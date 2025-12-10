'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import api from '@/lib/api';

export interface PartModel {
  id: string;
  partId: string;
  modelNo: string;
  qtyUsed: number;
  tab: 'P1' | 'P2';
}

interface ModelsPanelProps {
  partId?: string;
  partName?: string;
  stockQuantity?: number;
}

export default function ModelsPanel({ partId, partName, stockQuantity: initialStockQuantity = 0 }: ModelsPanelProps) {
  const [models, setModels] = useState<PartModel[]>([]);
  const [stockQuantity, setStockQuantity] = useState<number>(initialStockQuantity);
  const [loading, setLoading] = useState(false);

  const loadModels = useCallback(async () => {
    if (!partId) {
      setModels([]);
      setStockQuantity(0);
      return;
    }
    setLoading(true);
    try {
      // Fetch models
      const modelsResponse = await api.get(`/models/part/${partId}`);
      setModels(modelsResponse.data?.models || []);
      
      // Fetch part with stock
      const partResponse = await api.get(`/parts/${partId}`);
      const stockQty = partResponse.data?.part?.stock?.quantity ?? 0;
      setStockQuantity(stockQty);
    } catch (error) {
      console.error('Failed to load models:', error);
      setModels([]);
      setStockQuantity(0);
    } finally {
      setLoading(false);
    }
  }, [partId]);

  useEffect(() => {
    // Update stock quantity when prop changes
    setStockQuantity(initialStockQuantity);
  }, [initialStockQuantity]);

  useEffect(() => {
    if (partId) {
      loadModels();
    } else {
      setModels([]);
      setStockQuantity(0);
    }
  }, [partId, loadModels]);

  return (
    <Card className="h-full bg-white border border-gray-200 shadow-medium rounded-lg overflow-hidden flex flex-col">
      <CardHeader className="bg-white border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full"></div>
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900">Model Numbers & Quantities</CardTitle>
            <p className="text-xs text-gray-500 mt-0.5">View part model associations</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto scrollbar-hide scroll-smooth bg-white">
        <div className="w-full">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-50 border-b-2 border-gray-200">
                <TableHead className="font-semibold text-gray-700 py-2 px-3 text-left text-sm">Models</TableHead>
                <TableHead className="font-semibold text-gray-700 py-2 px-3 text-left text-sm">Quantity Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-6">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm text-gray-500">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : !partId ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-6">
                    <p className="text-sm text-gray-500">Select a part to view model associations</p>
                  </TableCell>
                </TableRow>
              ) : models.length > 0 ? (
                models.map((model) => (
                  <TableRow 
                    key={model.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-900 py-2 px-3 text-sm">
                      {model.modelNo}
                    </TableCell>
                    <TableCell className="text-gray-700 py-2 px-3 text-sm">
                      <span className="font-medium text-gray-900">{stockQuantity}</span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="font-medium text-gray-900 py-2 px-3 text-sm">
                    {partName || '-'}
                  </TableCell>
                  <TableCell className="text-gray-700 py-2 px-3 text-sm">
                    <span className="font-medium text-gray-900">{stockQuantity}</span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
