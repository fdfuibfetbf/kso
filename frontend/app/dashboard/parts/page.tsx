'use client';

import { useState, useEffect } from 'react';
import PartForm, { Part } from '@/components/inventory/PartForm';
import KitForm, { Kit } from '@/components/inventory/KitForm';
import ModelsPanel from '@/components/inventory/ModelsPanel';
import PartsTable from '@/components/inventory/PartsTable';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

export default function PartsPage() {
  const [activeFormTab, setActiveFormTab] = useState<'part' | 'kit'>('part');
  const [activeListTab, setActiveListTab] = useState<'parts' | 'kits'>('parts');
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [selectedKit, setSelectedKit] = useState<Kit | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Kits list state
  const [kits, setKits] = useState<Kit[]>([]);
  const [kitsLoading, setKitsLoading] = useState(false);
  const [kitSearchTerm, setKitSearchTerm] = useState('');
  const [kitError, setKitError] = useState('');
  const [kitSuccess, setKitSuccess] = useState('');

  useEffect(() => {
    if (activeListTab === 'kits') {
      loadKits();
    }
  }, [activeListTab, kitSearchTerm]);

  const loadKits = async () => {
    setKitsLoading(true);
    try {
      const response = await api.get('/kits');
      setKits(response.data.kits || []);
    } catch (error: any) {
      if (!error.message?.includes('Backend server is not running')) {
        console.error('Failed to load kits:', error);
      }
      setKits([]);
    } finally {
      setKitsLoading(false);
    }
  };

  const filteredKits = kits.filter(kit =>
    kit.kitNo.toLowerCase().includes(kitSearchTerm.toLowerCase()) ||
    kit.name.toLowerCase().includes(kitSearchTerm.toLowerCase()) ||
    kit.description?.toLowerCase().includes(kitSearchTerm.toLowerCase())
  );

  const handleSelectPart = async (part: Part) => {
    setLoading(true);
    try {
      // Fetch full part details with models
      const response = await api.get(`/parts/${part.id}`);
      setSelectedPart(response.data.part);
      setActiveFormTab('part');
      setSelectedKit(null);
    } catch (error) {
      console.error('Failed to load part details:', error);
      setSelectedPart(part);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePart = (part: Part) => {
    setSelectedPart(part);
    // Trigger refresh of parts table
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDeletePart = (id: string) => {
    setSelectedPart(null);
    // Trigger refresh of parts table
    setRefreshTrigger(prev => prev + 1);
  };

  const handleSaveKit = (kit: Kit) => {
    setSelectedKit(kit);
    setRefreshTrigger(prev => prev + 1);
    if (activeListTab === 'kits') {
      loadKits();
    }
  };

  const handleDeleteKit = (id: string) => {
    setSelectedKit(null);
    setRefreshTrigger(prev => prev + 1);
    if (activeListTab === 'kits') {
      loadKits();
    }
  };

  const handleBreakKitFromList = async (kit: Kit) => {
    if (!kit.id) return;
    
    const itemCount = kit.items?.length || 0;
    const confirmMessage = `Are you sure you want to break this kit?\n\n` +
      `Kit: ${kit.name} (${kit.kitNo})\n` +
      `Items: ${itemCount}\n\n` +
      `All ${itemCount} item${itemCount !== 1 ? 's' : ''} will be returned to inventory and the kit will be deleted permanently.`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setKitsLoading(true);
      setKitError('');
      const response = await api.post(`/kits/${kit.id}/break`);
      
      // Show detailed success message
      let successMsg = response.data.message || 'Kit broken successfully. All items have been returned to inventory.';
      if (response.data.returnedItems && response.data.returnedItems.length > 0) {
        const itemsList = response.data.returnedItems
          .map((item: any) => `  • ${item.partNo}: ${item.quantity} unit${item.quantity !== 1 ? 's' : ''}`)
          .join('\n');
        successMsg += `\n\nReturned items:\n${itemsList}`;
      }
      
      setKitSuccess(successMsg);
      if (selectedKit?.id === kit.id) {
        setSelectedKit(null);
      }
      loadKits();
      
      // Clear success message after 5 seconds
      setTimeout(() => setKitSuccess(''), 5000);
    } catch (err: any) {
      setKitError(err.response?.data?.error || err.response?.data?.message || 'Failed to break kit');
      setKitSuccess('');
    } finally {
      setKitsLoading(false);
    }
  };

  const handleDeleteKitFromList = async (id: string) => {
    if (!confirm('Are you sure you want to delete this kit?\n\nNote: Items will NOT be returned to inventory. Use "Break Kit" to return items to inventory.')) {
      return;
    }
    try {
      setKitsLoading(true);
      await api.delete(`/kits/${id}`);
      setKitSuccess('Kit deleted successfully');
      if (selectedKit?.id === id) {
        setSelectedKit(null);
      }
      loadKits();
      setTimeout(() => setKitSuccess(''), 3000);
    } catch (error: any) {
      setKitError(error.response?.data?.error || 'Failed to delete kit. Please try again.');
      setKitSuccess('');
    } finally {
      setKitsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 p-3 sm:p-4 md:p-6 bg-gray-50">
      {/* Left Panel - Part/Kit Form with Tabs */}
      <div className="lg:col-span-4 overflow-y-auto scrollbar-hide scroll-smooth order-1 lg:order-1">
        <div className="bg-white rounded-xl shadow-soft border border-gray-200">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => {
                setActiveFormTab('part');
                setSelectedKit(null);
              }}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeFormTab === 'part'
                  ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Part Entry
            </button>
            <button
              onClick={() => {
                setActiveFormTab('kit');
                setSelectedPart(null);
              }}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeFormTab === 'kit'
                  ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Create Kit
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-0">
            {activeFormTab === 'part' ? (
              <PartForm
                part={selectedPart}
                onSave={handleSavePart}
                onDelete={handleDeletePart}
              />
            ) : (
              <KitForm
                kit={selectedKit}
                onSave={handleSaveKit}
                onDelete={handleDeleteKit}
              />
            )}
          </div>
        </div>
      </div>

      {/* Middle Panel - Models */}
      <div className="lg:col-span-3 overflow-y-auto scrollbar-hide scroll-smooth order-3 lg:order-2">
        <ModelsPanel partId={selectedPart?.id} />
      </div>

      {/* Right Panel - Parts/Kits List with Tabs */}
      <div className="lg:col-span-5 overflow-y-auto scrollbar-hide scroll-smooth order-2 lg:order-3">
        <Card className="h-full bg-white border border-gray-200 shadow-medium rounded-lg overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-white">
            <button
              onClick={() => setActiveListTab('parts')}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                activeListTab === 'parts'
                  ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Parts List
            </button>
            <button
              onClick={() => setActiveListTab('kits')}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                activeListTab === 'kits'
                  ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Kits List
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeListTab === 'parts' ? (
              <PartsTable
                onSelectPart={handleSelectPart}
                selectedPartId={selectedPart?.id}
                refreshTrigger={refreshTrigger}
              />
            ) : (
              <div className="p-4">
                {kitError && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1">
                        <p className="font-medium">Error</p>
                        <p className="text-sm mt-1">{kitError}</p>
                      </div>
                      <button
                        onClick={() => setKitError('')}
                        className="text-red-600 hover:text-red-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {kitSuccess && (
                  <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md whitespace-pre-line">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1">
                        <p className="font-medium">Success!</p>
                        <p className="text-sm mt-1">{kitSuccess}</p>
                      </div>
                      <button
                        onClick={() => setKitSuccess('')}
                        className="text-green-600 hover:text-green-800"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <Input
                      type="text"
                      placeholder="Search kits..."
                      value={kitSearchTerm}
                      onChange={(e) => setKitSearchTerm(e.target.value)}
                      className="w-full pl-10 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                    />
                  </div>
                </div>

                {kitsLoading ? (
                  <div className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="animate-spin h-6 w-6 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm text-gray-500">Loading kits...</span>
                    </div>
                  </div>
                ) : filteredKits.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <p className="text-sm text-gray-500">
                        {kitSearchTerm ? 'No kits found matching your search.' : 'No kits found. Create one to get started.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredKits.map((kit) => (
                      <div
                        key={kit.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-primary-50/50 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedKit(kit);
                          setActiveFormTab('kit');
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{kit.name}</h3>
                              <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded">
                                {kit.kitNo}
                              </span>
                              {kit.status === 'I' && (
                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                                  Inactive
                                </span>
                              )}
                            </div>
                            {kit.description && (
                              <p className="text-sm text-gray-600 mb-2">{kit.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>
                                <strong>Items:</strong> {kit.items?.length || 0}
                              </span>
                              {kit.totalCost && (
                                <span>
                                  <strong>Total Cost:</strong> ${kit.totalCost.toFixed(2)}
                                </span>
                              )}
                              {kit.price && (
                                <span>
                                  <strong>Price:</strong> ${kit.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedKit(kit);
                                setActiveFormTab('kit');
                              }}
                              className="border-primary-300 text-primary-700 hover:bg-primary-50"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBreakKitFromList(kit);
                              }}
                              disabled={kitsLoading}
                              className="border-primary-300 text-primary-600 hover:text-primary-700 hover:bg-primary-50"
                              title="Break kit and return items to inventory"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Break Kit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                kit.id && handleDeleteKitFromList(kit.id);
                              }}
                              disabled={kitsLoading}
                              className="border-red-300 text-red-700 hover:bg-red-50"
                              title="Delete kit without returning items to inventory"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
