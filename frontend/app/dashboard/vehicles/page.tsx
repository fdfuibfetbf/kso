'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';

interface Vehicle {
  id: string;
  name: string;
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [vehicleName, setVehicleName] = useState('');

  const totalPages = Math.max(1, Math.ceil(total / pageSize || 1));

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
      });

      const response = await api.get(`/vehicles?${params.toString()}`);

      const list = (response.data?.vehicles || []) as Vehicle[];
      setVehicles(list);
      setTotal(response.data?.pagination?.total ?? 0);
    } catch (error: any) {
      console.error('Failed to load vehicles:', error);
      // Don't show alert for network errors (handled by api.ts)
      if (!error.message?.includes('Backend server is not running') && 
          !error.message?.includes('Network Error') &&
          error.response?.status !== 401) {
        // Only show alert for actual API errors, not network issues
        const errorMsg = error.response?.data?.error || error.message || 'Failed to load vehicles. Please try again.';
        if (errorMsg !== 'Backend server is not running. Please start it first.') {
          alert(errorMsg);
        }
      }
      setVehicles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const handleChangePageSize = (value: number) => {
    setPageSize(value);
    setPage(1);
  };

  const resetForm = () => {
    setVehicleName('');
  };

  const handleOpenForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleSaveVehicle = async () => {
    if (!vehicleName.trim()) {
      alert('Please enter vehicle name.');
      return;
    }

    setSaving(true);
    try {
      await api.post('/vehicles', { name: vehicleName.trim() });
      await loadVehicles();
      resetForm();
      setIsFormOpen(false);
    } catch (error: any) {
      console.error('Failed to save vehicle:', error);
      alert(error.response?.data?.error || 'Failed to save vehicle. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle.id);
    setEditName(vehicle.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) {
      alert('Please enter vehicle name.');
      return;
    }

    setSaving(true);
    try {
      await api.put(`/vehicles/${id}`, { name: editName.trim() });
      await loadVehicles();
      setEditingId(null);
      setEditName('');
    } catch (error: any) {
      console.error('Failed to update vehicle:', error);
      alert(error.response?.data?.error || 'Failed to update vehicle. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      await api.delete(`/vehicles/${id}`);
      await loadVehicles();
    } catch (error: any) {
      console.error('Failed to delete vehicle:', error);
      alert(error.response?.data?.error || 'Failed to delete vehicle. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-gray-50 p-4 sm:p-6 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 text-primary-600">
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
                  d="M3 13l2-5a2 2 0 011.874-1.25h10.252A2 2 0 0119 8l2 5m-2 4h-1a3 3 0 01-6 0H9a3 3 0 01-6 0H2"
                />
              </svg>
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Vehicles List</h1>
            </div>
          </div>

          <Button
            onClick={handleOpenForm}
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 sm:px-5 py-2 rounded-full shadow-sm text-sm font-semibold transition-transform duration-200 active:scale-95"
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
            Add New
          </Button>
        </div>

        {/* List / Add form card */}
        <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
          <CardHeader className="border-b border-gray-100 pb-3">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
              Vehicles
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {/* Vehicles table - hidden when Add form open */}
            {!isFormOpen && (
              <>
                <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 border-b border-gray-200">
                          <TableHead className="w-12 py-3 px-4">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-primary-500 border-gray-300 rounded"
                            />
                          </TableHead>
                          <TableHead className="w-20 text-xs font-semibold text-gray-700 uppercase tracking-wide py-3 px-4">
                            Sr. No
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
                            <TableCell colSpan={4} className="py-10 text-center">
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
                                <span className="text-sm text-gray-500">Loading vehicles...</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : vehicles.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="py-10 text-center">
                              <p className="text-sm text-gray-500">No vehicles found.</p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          vehicles.map((vehicle, index) => (
                            <TableRow
                              key={vehicle.id}
                              className="border-b border-gray-100 hover:bg-primary-50/40 transition-colors"
                            >
                              <TableCell className="py-3 px-4">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 text-primary-500 border-gray-300 rounded"
                                />
                              </TableCell>
                              <TableCell className="py-3 px-4 text-sm text-gray-700">
                                {(page - 1) * pageSize + index + 1}
                              </TableCell>
                              <TableCell className="py-3 px-4 text-sm font-medium text-gray-900">
                                {editingId === vehicle.id ? (
                                  <Input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="h-8 text-sm border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        handleSaveEdit(vehicle.id);
                                      } else if (e.key === 'Escape') {
                                        handleCancelEdit();
                                      }
                                    }}
                                    autoFocus
                                  />
                                ) : (
                                  vehicle.name || '-'
                                )}
                              </TableCell>
                              <TableCell className="py-3 px-4 text-sm text-right">
                                {editingId === vehicle.id ? (
                                  <div className="inline-flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleSaveEdit(vehicle.id)}
                                      disabled={saving}
                                      className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-xs font-semibold disabled:opacity-50"
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
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                      {saving ? 'Saving...' : 'Save'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleCancelEdit}
                                      disabled={saving}
                                      className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-700 text-xs font-semibold disabled:opacity-50"
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
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center gap-3">
                                    <button
                                      type="button"
                                      onClick={() => handleEdit(vehicle)}
                                      className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-xs font-semibold"
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
                                      type="button"
                                      onClick={() => handleDelete(vehicle.id, vehicle.name)}
                                      disabled={deletingId === vehicle.id}
                                      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-xs font-semibold disabled:opacity-50"
                                    >
                                      {deletingId === vehicle.id ? (
                                        <>
                                          <svg
                                            className="animate-spin w-3.5 h-3.5"
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
                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                          </svg>
                                          Deleting...
                                        </>
                                      ) : (
                                        <>
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
                                        </>
                                      )}
                                    </button>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Pagination footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 text-xs sm:text-sm text-gray-600">
                  <div>
                    Showing {(page - 1) * pageSize + 1} to{' '}
                    {Math.min(page * pageSize, total || vehicles.length)} of {total || vehicles.length}{' '}
                    records
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span>Rows:</span>
                      <select
                        value={pageSize}
                        onChange={(e) => handleChangePageSize(Number(e.target.value))}
                        className="border border-gray-300 rounded-md h-8 px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                      </select>
                    </div>

                    <div className="inline-flex items-center border border-gray-300 rounded-md overflow-hidden text-xs">
                      <button
                        type="button"
                        onClick={() => setPage(1)}
                        disabled={page === 1}
                        className={`px-2 py-1 border-r border-gray-300 ${
                          page === 1
                            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'bg-white hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        First
                      </button>
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className={`px-2 py-1 border-r border-gray-300 ${
                          page === 1
                            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'bg-white hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        Prev
                      </button>
                      <span className="px-3 py-1 bg-primary-500 text-white font-semibold">
                        {page}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className={`px-2 py-1 border-l border-gray-300 ${
                          page === totalPages
                            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'bg-white hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        Next
                      </button>
                      <button
                        type="button"
                        onClick={() => setPage(totalPages)}
                        disabled={page === totalPages}
                        className={`px-2 py-1 border-l border-gray-300 ${
                          page === totalPages
                            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'bg-white hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        Last
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Add Vehicle form - shown when Add New clicked */}
            {isFormOpen && (
              <div className="mt-2 border border-gray-200 rounded-lg bg-gray-50/80 transition-all duration-300 ease-out transform">
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
                        Add Vehicle
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Vehicle Name
                      </label>
                      <input
                        type="text"
                        value={vehicleName}
                        onChange={(e) => setVehicleName(e.target.value)}
                        placeholder="Enter vehicle name"
                        className="w-full h-10 rounded-md border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
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
                        onClick={handleSaveVehicle}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

