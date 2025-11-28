'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';
import { Part } from './PartForm';

export interface Kit {
  id?: string;
  kitNo: string;
  name: string;
  description?: string;
  totalCost?: number;
  price?: number;
  status: 'A' | 'I';
  items?: KitItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface KitItem {
  id?: string;
  partId: string;
  part?: Part;
  quantity: number;
}

interface KitFormProps {
  kit?: Kit | null;
  onSave: (kit: Kit) => void;
  onDelete?: (id: string) => void;
}

export default function KitForm({ kit, onSave, onDelete }: KitFormProps) {
  const [formData, setFormData] = useState({
    kitNo: '',
    name: '',
    description: '',
    price: undefined as number | undefined,
    status: 'A' as 'A' | 'I',
  });
  const [items, setItems] = useState<KitItem[]>([]);
  const [availableParts, setAvailableParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchParts();
    if (kit) {
      setFormData({
        kitNo: kit.kitNo,
        name: kit.name,
        description: kit.description || '',
        price: kit.price,
        status: kit.status,
      });
      setItems(kit.items || []);
    } else {
      resetForm();
    }
  }, [kit]);

  const fetchParts = async () => {
    try {
      const response = await api.get('/parts?limit=1000&status=A');
      setAvailableParts(response.data.parts);
    } catch (err) {
      console.error('Failed to fetch parts:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      kitNo: '',
      name: '',
      description: '',
      price: undefined,
      status: 'A',
    });
    setItems([]);
    setError('');
  };

  const addItem = () => {
    if (items.length >= 10) {
      setError('Maximum 10 items allowed per kit');
      return;
    }
    setItems([...items, { partId: '', quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof KitItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (items.length === 0) {
      setError('Please add at least one item to the kit');
      return;
    }

    if (items.length < 1 || items.length > 10) {
      setError('Kit must have between 1 and 10 items');
      return;
    }

    // Validate all items have partId
    if (items.some(item => !item.partId)) {
      setError('Please select a part for all items');
      return;
    }

    try {
      setLoading(true);
      const kitData = {
        ...formData,
        items: items.map(item => ({
          partId: item.partId,
          quantity: item.quantity,
        })),
      };

      if (kit?.id) {
        const response = await api.put(`/kits/${kit.id}`, kitData);
        onSave(response.data.kit);
      } else {
        const response = await api.post('/kits', kitData);
        onSave(response.data.kit);
        resetForm();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save kit');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!kit?.id || !onDelete) return;
    if (!confirm('Are you sure you want to delete this kit?')) return;

    try {
      setLoading(true);
      await api.delete(`/kits/${kit.id}`);
      onDelete(kit.id);
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete kit');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredParts = (searchTerm: string) => {
    if (!searchTerm) return availableParts;
    return availableParts.filter(part =>
      part.partNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{kit ? 'Edit Kit' : 'Create New Kit'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="kitNo">Kit Number *</Label>
            <Input
              id="kitNo"
              value={formData.kitNo}
              onChange={(e) => setFormData({ ...formData, kitNo: e.target.value })}
              placeholder="KIT-001"
              required
            />
          </div>

          <div>
            <Label htmlFor="name">Kit Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter kit name"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="price">Selling Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : undefined })}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'A' | 'I' })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="A">Active</option>
              <option value="I">Inactive</option>
            </select>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <Label>Kit Items ({items.length}/10)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
                disabled={items.length >= 10}
              >
                + Add Item
              </Button>
            </div>

            {items.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Click "Add Item" to add parts to this kit
              </p>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded p-3 bg-gray-50">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <Label className="text-xs">Part *</Label>
                      <select
                        value={item.partId}
                        onChange={(e) => updateItem(index, 'partId', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        required
                      >
                        <option value="">Select part</option>
                        {availableParts.map((part) => (
                          <option key={part.id} value={part.id}>
                            {part.partNo} - {part.description || 'No description'}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <Label className="text-xs">Quantity *</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="text-sm"
                        required
                      />
                    </div>

                    {item.partId && (() => {
                      const selectedPart = availableParts.find(p => p.id === item.partId);
                      return selectedPart && (
                        <div className="text-xs text-gray-600 bg-white p-2 rounded">
                          <div>Cost: ${selectedPart.cost || 0}</div>
                          <div>Total: ${(selectedPart.cost || 0) * item.quantity}</div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Saving...' : kit ? 'Update Kit' : 'Create Kit'}
            </Button>
            {kit && onDelete && (
              <Button
                type="button"
                variant="outline"
                onClick={handleDelete}
                disabled={loading}
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </Button>
            )}
            {kit && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

