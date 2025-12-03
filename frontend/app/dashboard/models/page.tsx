'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AnimatedSelect from '@/components/ui/animated-select';
import api from '@/lib/api';

interface VehicleModel {
  id: string;
  machine: string;
  make: string;
  name: string;
}

const MACHINE_OPTIONS = ['CAR', 'BIKE', 'SUV', 'TRUCK'];

export default function ModelsPage() {
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [machineFilter, setMachineFilter] = useState('');
  const [makeFilter, setMakeFilter] = useState('');
  const [modelNameFilter, setModelNameFilter] = useState('');

  // Form state
  const [formMachine, setFormMachine] = useState('');
  const [formMake, setFormMake] = useState('');
  const [formName, setFormName] = useState('');

  const [availableMakes, setAvailableMakes] = useState<string[]>([]);

  const loadModels = async () => {
    setLoading(true);
    try {
      // TODO: Wire this to a real backend endpoint when available
      const params = new URLSearchParams();
      if (machineFilter) params.append('machine', machineFilter);
      if (makeFilter) params.append('make', makeFilter);
      if (modelNameFilter) params.append('name', modelNameFilter);

      // Attempt to load data if an endpoint exists; otherwise fall back to empty list
      const response = await api
        .get(`/vehicle-models${params.toString() ? `?${params.toString()}` : ''}`)
        .catch(() => ({ data: { models: [] } }));

      const list = (response.data?.models || []) as VehicleModel[];
      setModels(list);

      // Derive makes for the filter dropdown
      const makes = Array.from(new Set(list.map((m) => m.make).filter(Boolean))).sort();
      setAvailableMakes(makes);
    } catch (error) {
      console.error('Failed to load models:', error);
      setModels([]);
      setAvailableMakes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredModels = models;

  const resetForm = () => {
    setFormMachine('');
    setFormMake('');
    setFormName('');
  };

  const handleOpenForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSaveModel = async () => {
    if (!formMachine || !formMake || !formName.trim()) {
      alert('Please fill Machine, Make, and Model.');
      return;
    }

    setSaving(true);
    try {
      await api
        .post('/vehicle-models', {
          machine: formMachine,
          make: formMake,
          name: formName.trim(),
        })
        .catch(() => Promise.resolve());

      await loadModels();
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to save model:', error);
      alert('Failed to save model. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Model List</h1>
            <p className="text-sm text-gray-500 mt-1">
              Browse and manage vehicle models by machine and make
            </p>
          </div>
          <Button
            onClick={handleOpenForm}
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 sm:px-5 py-2 rounded-full shadow-sm transition-transform duration-200 active:scale-95"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-sm font-semibold">Add New</span>
          </Button>
        </div>

        {/* Filters + table */}
        <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {/* Filter row - hidden when Add New form is open */}
            {!isFormOpen && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <AnimatedSelect
                  label="Machine"
                  value={machineFilter}
                  onChange={(value) => setMachineFilter(value)}
                  placeholder="Select..."
                  options={[
                    { value: '', label: 'All Machines' },
                    ...MACHINE_OPTIONS.map((m) => ({ value: m, label: m })),
                  ]}
                />

                <AnimatedSelect
                  label="Make"
                  value={makeFilter}
                  onChange={(value) => setMakeFilter(value)}
                  placeholder="Select..."
                  options={[
                    { value: '', label: 'All Makes' },
                    ...availableMakes.map((make) => ({ value: make, label: make })),
                  ]}
                />

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-600">Model Name</label>
                  <Input
                    placeholder="Enter model name"
                    value={modelNameFilter}
                    onChange={(e) => setModelNameFilter(e.target.value)}
                    className="h-10 text-sm border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                  />
                </div>

                <div className="flex items-center gap-2 md:justify-end">
                  <Button
                    onClick={loadModels}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-6 h-10 rounded-full text-sm font-semibold"
                  >
                    Search
                  </Button>
                </div>
              </div>
            )}

            {/* Table / Add New form area with smooth transition */}
            <div className="mt-2">
              {!isFormOpen && (
                <div className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ease-out transform">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 border-b border-gray-200">
                          <TableHead className="w-16 text-xs font-semibold text-gray-700 uppercase tracking-wide py-3 px-4">
                            Sr. No
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-gray-700 uppercase tracking-wide py-3 px-4">
                            Machine
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-gray-700 uppercase tracking-wide py-3 px-4">
                            Make
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-gray-700 uppercase tracking-wide py-3 px-4">
                            Name
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-gray-700 uppercase tracking-wide py-3 px-4 text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center">
                              <div className="flex flex-col items-center gap-2">
                                <svg
                                  className="animate-spin h-5 w-5 text-primary-500"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V2a10 10 0 100 20v-2a8 8 0 01-8-8z"
                                  ></path>
                                </svg>
                                <span className="text-sm text-gray-500">Loading models...</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : filteredModels.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="py-10 text-center">
                              <p className="text-sm text-gray-500">
                                No models found. Adjust your filters or add a new model.
                              </p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredModels.map((model, index) => (
                            <TableRow
                              key={model.id}
                              className="border-b border-gray-100 hover:bg-primary-50/40 transition-colors"
                            >
                              <TableCell className="py-3 px-4 text-sm text-gray-700">
                                {index + 1}
                              </TableCell>
                              <TableCell className="py-3 px-4 text-sm font-medium text-gray-900">
                                {model.machine || '-'}
                              </TableCell>
                              <TableCell className="py-3 px-4 text-sm text-gray-700">
                                {model.make || '-'}
                              </TableCell>
                              <TableCell className="py-3 px-4 text-sm text-gray-700">
                                {model.name || '-'}
                              </TableCell>
                              <TableCell className="py-3 px-4 text-sm text-right">
                                <div className="inline-flex items-center gap-2">
                                  <button
                                    className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-xs font-semibold"
                                    type="button"
                                  >
                                    <svg
                                      className="w-3.5 h-3.5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                    Edit
                                  </button>
                                  <button
                                    className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-xs font-semibold"
                                    type="button"
                                  >
                                    <svg
                                      className="w-3.5 h-3.5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                    Delete
                                  </button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {isFormOpen && (
                <div className="border border-gray-200 rounded-lg bg-gray-50/80 transition-all duration-300 ease-out transform">
                  <div className="p-4 sm:p-6 space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-50 text-primary-600">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </span>
                      <div>
                        <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                          Add New Model
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Define machine, make and model name.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatedSelect
                          label="Machines"
                          value={formMachine}
                          onChange={(value) => setFormMachine(value)}
                          placeholder="Select..."
                          options={[
                            { value: '', label: 'Select...' },
                            ...MACHINE_OPTIONS.map((m) => ({ value: m, label: m })),
                          ]}
                        />

                        <AnimatedSelect
                          label="Makes"
                          value={formMake}
                          onChange={(value) => setFormMake(value)}
                          placeholder="Select..."
                          options={[
                            { value: '', label: 'Select...' },
                            ...availableMakes.map((make) => ({ value: make, label: make })),
                          ]}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Model
                        </label>
                        <Input
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="Enter model name"
                          className="h-10 text-sm border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        className="text-xs sm:text-sm border-primary-300 text-primary-600 hover:bg-primary-50 px-4 h-9 rounded-full"
                      >
                        Reset
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCloseForm}
                          className="text-xs sm:text-sm border-gray-300 text-gray-700 hover:bg-gray-50 px-4 h-9 rounded-full"
                        >
                          Close
                        </Button>
                        <Button
                          type="button"
                          onClick={handleSaveModel}
                          disabled={saving}
                          className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white px-5 h-9 rounded-full text-xs sm:text-sm font-semibold"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          {saving ? 'Saving...' : 'Save'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

