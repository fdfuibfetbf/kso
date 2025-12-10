'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import api from '@/lib/api';

interface Store {
  id: string;
  name: string;
  storeType?: {
    id: string;
    name: string;
  };
}

interface Rack {
  id: string;
  rackNumber: string;
  storeId: string;
  store?: Store;
  description?: string;
  status: 'A' | 'I';
  createdAt: string;
  updatedAt: string;
  _count?: {
    shelves: number;
  };
}

export default function RacksPage() {
  const [racks, setRacks] = useState<Rack[]>([]);
  const [availableStores, setAvailableStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingRack, setEditingRack] = useState<Rack | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    rackNumber: '',
    storeId: '',
    description: '',
    status: 'A' as 'A' | 'I',
  });

  useEffect(() => {
    loadRacks();
    loadStores();
  }, []);

  const loadRacks = async () => {
    setLoading(true);
    try {
      const response = await api.get('/racks');
      setRacks(response.data.racks || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load racks');
    } finally {
      setLoading(false);
    }
  };

  const loadStores = async () => {
    try {
      const response = await api.get('/parts-management/getStoredropdown');
      setAvailableStores(response.data.store || []);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setLoading(true);
      if (editingRack) {
        await api.put(`/racks/${editingRack.id}`, formData);
        setSuccess('Rack updated successfully');
      } else {
        await api.post('/racks', formData);
        setSuccess('Rack created successfully');
      }
      resetForm();
      loadRacks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save rack');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rack: Rack) => {
    setEditingRack(rack);
    setFormData({
      rackNumber: rack.rackNumber,
      storeId: rack.storeId,
      description: rack.description || '',
      status: rack.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rack?')) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/racks/${id}`);
      setSuccess('Rack deleted successfully');
      loadRacks();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete rack');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      rackNumber: '',
      storeId: '',
      description: '',
      status: 'A',
    });
    setEditingRack(null);
    setShowForm(false);
  };

  const filteredRacks = racks.filter((rack) =>
    rack.rackNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rack.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rack.store?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Racks List</h1>
          <p className="text-sm text-gray-500">Manage storage racks for inventory organization</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-primary-500 hover:bg-primary-600"
        >
          + Add New Rack
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md">
          {typeof error === 'object' ? JSON.stringify(error) : error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-md">
          {success}
        </div>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingRack ? 'Edit Rack' : 'Create New Rack'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rackNumber">Code No *</Label>
                  <Input
                    id="rackNumber"
                    value={formData.rackNumber}
                    onChange={(e) => setFormData({ ...formData, rackNumber: e.target.value })}
                    placeholder="Enter rack number"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="storeId">Store *</Label>
                  <Select
                    id="storeId"
                    value={formData.storeId}
                    onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
                    required
                  >
                    <option value="">Select Store...</option>
                    {availableStores.map((store) => (
                      <option key={store.id} value={store.id}>
                        {store.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter rack description..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'A' | 'I' })}
                  >
                    <option value="A">Active</option>
                    <option value="I">Inactive</option>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading} className="bg-primary-500 hover:bg-primary-600">
                  {loading ? 'Saving...' : editingRack ? 'Update' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Racks ({filteredRacks.length})</CardTitle>
            <Input
              type="text"
              placeholder="Search racks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading && !racks.length ? (
            <div className="text-center py-12">Loading racks...</div>
          ) : filteredRacks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchTerm ? 'No racks found matching your search.' : 'No racks found. Create one to get started.'}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRacks.map((rack) => (
                <div
                  key={rack.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{rack.rackNumber}</h3>
                      <div className="mt-1 space-y-1">
                        {rack.description && (
                          <p className="text-sm text-gray-600">{rack.description}</p>
                        )}
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">
                            Store: {rack.store?.name || 'N/A'}
                          </span>
                          {rack._count && rack._count.shelves > 0 && (
                            <span className="text-sm text-gray-500">
                              {rack._count.shelves} shelf{rack._count.shelves !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          rack.status === 'A' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {rack.status === 'A' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(rack)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(rack.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
