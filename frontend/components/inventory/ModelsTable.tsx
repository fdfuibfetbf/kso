'use client';

import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';

export interface ModelWithPart {
  id: string;
  modelNo: string;
  qtyUsed: number;
  tab: 'P1' | 'P2';
  partId: string;
  part: {
    id: string;
    partNo: string;
    description?: string;
    brand?: string;
    mainCategory?: string;
    stock?: {
      quantity: number;
    };
  };
}

interface ModelsTableProps {
  refreshTrigger?: number;
}

export default function ModelsTable({ refreshTrigger = 0 }: ModelsTableProps) {
  const [models, setModels] = useState<ModelWithPart[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadModels();
  }, [page, debouncedSearch, refreshTrigger]);

  const loadModels = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
      });
      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }
      const response = await api.get(`/models?${params.toString()}`);
      setModels(response.data.models || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
      setTotal(response.data.pagination?.total || 0);
    } catch (error: any) {
      if (!error.message?.includes('Backend server is not running')) {
        console.error('Failed to load models:', error);
      }
      setModels([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <Card className="bg-white border border-gray-200 shadow-sm rounded-xl">
      <CardHeader className="border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">Models List</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {total} model{total !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="w-64">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input
                placeholder="Search by Model No, Part No..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b-2 border-gray-200">
                <TableHead className="font-semibold text-gray-900 py-4 px-6 text-left">Model No</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4 px-6 text-left">Part No</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4 px-6 text-left">Part Description</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4 px-6 text-left">Brand</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4 px-6 text-left">Category</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4 px-6 text-right">Qty Used</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4 px-6 text-center">Tab</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4 px-6 text-right">Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="animate-spin h-6 w-6 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm text-gray-500">Loading models...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : models.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm text-gray-500">No models found</p>
                      {debouncedSearch && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSearch('')}
                          className="mt-2"
                        >
                          Clear Search
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                models.map((model) => (
                  <TableRow
                    key={model.id}
                    className="border-b border-gray-100 hover:bg-primary-50/50 transition-all duration-200 ease-in-out hover:shadow-sm"
                  >
                    <TableCell className="font-semibold text-gray-900 py-4 px-6">
                      {model.modelNo}
                    </TableCell>
                    <TableCell className="text-gray-700 py-4 px-6">
                      {model.part.partNo}
                    </TableCell>
                    <TableCell className="text-gray-700 py-4 px-6 max-w-xs truncate" title={model.part.description || ''}>
                      {model.part.description || '-'}
                    </TableCell>
                    <TableCell className="text-gray-700 py-4 px-6">
                      {model.part.brand || '-'}
                    </TableCell>
                    <TableCell className="text-gray-700 py-4 px-6">
                      {model.part.mainCategory || '-'}
                    </TableCell>
                    <TableCell className="text-gray-700 py-4 px-6 text-right font-medium">
                      {model.qtyUsed}
                    </TableCell>
                    <TableCell className="text-center py-4 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        model.tab === 'P1'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {model.tab}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-700 py-4 px-6 text-right font-medium">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        (model.part.stock?.quantity || 0) > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {model.part.stock?.quantity !== undefined ? model.part.stock.quantity : 0}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-600 font-medium">
              Showing {((page - 1) * 50) + 1} to {Math.min(page * 50, total)} of {total} models
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-gray-300"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="border-gray-300"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

