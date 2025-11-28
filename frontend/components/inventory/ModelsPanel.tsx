'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
}

export default function ModelsPanel({ partId }: ModelsPanelProps) {
  const [models, setModels] = useState<PartModel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (partId) {
      loadModels();
    } else {
      setModels([]);
    }
  }, [partId]);

  const loadModels = async () => {
    if (!partId) return;
    setLoading(true);
    try {
      const response = await api.get(`/models/part/${partId}`);
      setModels(response.data.models);
    } catch (error) {
      console.error('Failed to load models:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Card className="h-full bg-white border border-gray-200 shadow-medium rounded-lg overflow-hidden flex flex-col">
      <CardHeader className="bg-white border-b border-gray-200 px-6 py-5 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-10 w-1 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full"></div>
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">Model Numbers & Quantities</CardTitle>
            <p className="text-sm text-gray-500 mt-0.5">View part model associations</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto scrollbar-hide scroll-smooth bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b-2 border-gray-200">
                <TableHead className="font-semibold text-gray-700 py-4 px-6 text-left">Model No</TableHead>
                <TableHead className="font-semibold text-gray-700 py-4 px-6 text-left">Qty Used</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="text-sm text-gray-500">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : models.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-12">
                    <p className="text-sm text-gray-500">No models found for this part.</p>
                  </TableCell>
                </TableRow>
              ) : (
                models.map((model) => (
                  <TableRow 
                    key={model.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-900 py-4 px-6">
                      {model.modelNo}
                    </TableCell>
                    <TableCell className="text-gray-700 py-4 px-6">
                      <span className="inline-flex items-center gap-2">
                        <span className="text-gray-400 font-bold">X</span>
                        <span>{model.qtyUsed}</span>
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

      </CardContent>
    </Card>
  );
}

