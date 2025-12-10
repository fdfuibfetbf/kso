'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import api from '@/lib/api';
import { Part } from '@/components/inventory/PartForm';

export interface PurchaseOrderItem {
  id?: string;
  partId?: string;
  part?: Part;
  partNo: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  uom?: string;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

export interface PurchaseOrder {
  id?: string;
  poNo: string;
  type: 'purchase';
  supplierId?: string;
  supplier?: Supplier;
  supplierName: string;
  supplierEmail?: string;
  supplierPhone?: string;
  supplierAddress?: string;
  orderDate: string;
  expectedDate?: string;
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled';
  subTotal: number;
  tax: number;
  discount: number;
  totalAmount: number;
  notes?: string;
  items: PurchaseOrderItem[];
  createdAt?: string;
  updatedAt?: string;
}

export default function PurchaseOrdersPage() {
  // Removed activeTab - only Purchase Order type is supported
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [availableParts, setAvailableParts] = useState<Part[]>([]);
  const [availableSuppliers, setAvailableSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const [formData, setFormData] = useState<PurchaseOrder>({
    poNo: '',
    type: 'purchase',
    supplierId: '',
    supplierName: '',
    supplierEmail: '',
    supplierPhone: '',
    supplierAddress: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDate: '',
    status: 'draft',
    subTotal: 0,
    tax: 0,
    discount: 0,
    totalAmount: 0,
    notes: '',
    items: [],
  });

  useEffect(() => {
    fetchPurchaseOrders();
    fetchParts();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPurchaseOrders();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [statusFilter, searchTerm]);

  useEffect(() => {
    calculateTotals();
  }, [formData.items, formData.tax, formData.discount]);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      params.append('type', 'purchase');
      
      const response = await api.get(`/purchase-orders?${params.toString()}`);
      setPurchaseOrders(response.data.purchaseOrders);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch purchase orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchParts = async () => {
    try {
      const response = await api.get('/parts?limit=1000&status=A');
      setAvailableParts(response.data.parts);
    } catch (err) {
      console.error('Failed to fetch parts:', err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await api.get('/suppliers?status=A');
      setAvailableSuppliers(response.data.suppliers);
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
    }
  };

  const handleSupplierChange = (supplierId: string) => {
    if (!supplierId) {
      setFormData(prev => ({
        ...prev,
        supplierId: '',
        supplierName: '',
        supplierEmail: '',
        supplierPhone: '',
        supplierAddress: '',
      }));
      return;
    }

    const supplier = availableSuppliers.find(s => s.id === supplierId);
    if (supplier) {
      setFormData(prev => ({
        ...prev,
        supplierId: supplier.id,
        supplierName: supplier.name,
        supplierEmail: supplier.email || '',
        supplierPhone: supplier.phone || '',
        supplierAddress: [
          supplier.address,
          supplier.city,
          supplier.state,
          supplier.country,
        ].filter(Boolean).join(', '),
      }));
    }
  };

  const calculateTotals = () => {
    const subTotal = formData.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const discount = formData.discount || 0;
    const tax = formData.tax || 0;
    const totalAmount = subTotal - discount + tax;
    
    setFormData(prev => ({
      ...prev,
      subTotal,
      totalAmount,
    }));
  };

  const addItem = () => {
    if (formData.items.length >= 20) {
      setError('Maximum 20 items allowed per purchase order');
      return;
    }
    // Add new item at the beginning of the array (top of the list)
    setFormData(prev => ({
      ...prev,
      items: [{
        partNo: '',
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0,
        uom: '',
      }, ...prev.items],
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateItem = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    const updated = [...formData.items];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-calculate total price
    if (field === 'quantity' || field === 'unitPrice') {
      updated[index].totalPrice = (updated[index].quantity || 0) * (updated[index].unitPrice || 0);
    }
    
    // Auto-fill part details if part is selected
    if (field === 'partId' && value) {
      const part = availableParts.find(p => p.id === value);
      if (part) {
        updated[index].partNo = part.partNo;
        updated[index].description = part.description || '';
        updated[index].unitPrice = part.cost || 0;
        updated[index].totalPrice = (updated[index].quantity || 1) * (part.cost || 0);
        updated[index].uom = part.uom || '';
      }
    }
    
    setFormData(prev => ({ ...prev, items: updated }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.items.length === 0) {
      setError('Please add at least one item to the purchase order');
      return;
    }

    if (formData.items.some(item => !item.partNo || item.quantity <= 0 || item.unitPrice < 0)) {
      setError('Please fill in all item details correctly');
      return;
    }

    try {
      setLoading(true);
      const poData = {
        ...formData,
        poNo: selectedPO?.id ? formData.poNo : undefined, // Don't send poNo for new orders - backend will generate it
        type: 'purchase',
        supplierId: formData.supplierId ? formData.supplierId : undefined,
        items: formData.items.map(item => ({
          partId: item.partId || undefined,
          partNo: item.partNo,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          uom: item.uom,
        })),
      };

      if (selectedPO?.id) {
        const response = await api.put(`/purchase-orders/${selectedPO.id}`, poData);
        setSuccess('Purchase order updated successfully');
        setSelectedPO(response.data.purchaseOrder);
      } else {
        const response = await api.post('/purchase-orders', poData);
        setSuccess('Purchase order created successfully');
        setSelectedPO(response.data.purchaseOrder);
      }
      
      await                       resetForm().then(() => {
                        fetchPurchaseOrders();
                      });
      setTimeout(() => setShowForm(false), 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save purchase order');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setFormData({
      ...po,
      supplierId: po.supplierId || po.supplier?.id || '',
      orderDate: po.orderDate ? new Date(po.orderDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      expectedDate: po.expectedDate ? new Date(po.expectedDate).toISOString().split('T')[0] : '',
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this purchase order?')) {
      return;
    }

    try {
      setLoading(true);
      await api.delete(`/purchase-orders/${id}`);
      setSuccess('Purchase order deleted successfully');
      if (selectedPO?.id === id) {
        resetForm();
        setShowForm(false);
      }
      fetchPurchaseOrders();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete purchase order');
    } finally {
      setLoading(false);
    }
  };

  const fetchNextPONumber = async () => {
    try {
      const response = await api.get('/purchase-orders/next-po-number/purchase');
      return response.data.nextPONumber;
    } catch (error) {
      console.error('Failed to fetch next PO number:', error);
      return '';
    }
  };

  const resetForm = async () => {
    const nextPONumber = await fetchNextPONumber();
    setFormData({
      poNo: nextPONumber,
      type: 'purchase',
      supplierId: '',
      supplierName: '',
      supplierEmail: '',
      supplierPhone: '',
      supplierAddress: '',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDate: '',
      status: 'draft',
      subTotal: 0,
      tax: 0,
      discount: 0,
      totalAmount: 0,
      notes: '',
      items: [],
    });
    setSelectedPO(null);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      draft: 'bg-gray-100 text-gray-700',
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-primary-100 text-primary-700',
      received: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || colors.draft;
  };

  // Filter is now handled in the API call, but keep this for client-side filtering if needed
  const filteredPOs = purchaseOrders;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        .tab-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .slide-in {
          animation: slideIn 0.4s ease-out;
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase Orders</h1>
          <p className="text-sm text-gray-500">Manage purchase orders</p>
        </div>
        <Button
          onClick={() => {
            resetForm().then(() => {
              setShowForm(true);
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="bg-primary-500 hover:bg-primary-600 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          + New Purchase Order
        </Button>
      </div>


      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md shadow-sm animate-fade-in">
          {typeof error === 'object' ? JSON.stringify(error) : error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-md shadow-sm animate-fade-in">
          {success}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <Card className="shadow-lg border-2 border-primary-200 animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-primary-50 to-orange-50 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                {selectedPO ? 'Edit Purchase Order' : 'Create New Purchase Order'}
              </CardTitle>
              <Button variant="ghost" onClick={() => { setShowForm(false); resetForm(); }}>
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Main Purchase Order Fields - Professional Single Line Layout */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="grid grid-cols-4 gap-6 items-start">
                  <div className="space-y-2">
                    <Label htmlFor="poNo" className="text-sm font-medium text-gray-700 block">
                      PO NO
                    </Label>
                    <Input
                      id="poNo"
                      value={formData.poNo}
                      disabled
                      readOnly
                      className="w-full bg-gray-100 cursor-not-allowed"
                      title="PO Number is auto-generated and cannot be edited"
                      placeholder="Loading..."
                    />
                    <p className="text-xs text-gray-500">Auto-generated</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="supplierId" className="text-sm font-medium text-gray-700 block">
                      Supplier
                    </Label>
                    <div className="flex gap-2">
                      <Select
                        id="supplierId"
                        value={formData.supplierId || ''}
                        onChange={(e) => handleSupplierChange(e.target.value)}
                        className="flex-1"
                        required
                      >
                        <option value="">Select...</option>
                        {availableSuppliers.map((supplier) => (
                          <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                          </option>
                        ))}
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('/dashboard/suppliers', '_blank')}
                        className="px-3 text-xs whitespace-nowrap border-green-300 text-green-600 hover:bg-green-50 hover:border-green-400"
                      >
                        + Add New
                      </Button>
                    </div>
                    <p className="text-xs text-red-500">Required</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="orderDate" className="text-sm font-medium text-gray-700 block">
                      Request Date
                    </Label>
                    <Input
                      id="orderDate"
                      type="date"
                      value={formData.orderDate}
                      onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium text-gray-700 block">
                      Remarks
                    </Label>
                    <Input
                      id="notes"
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Enter remarks..."
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Item Parts Section - Professional Table Layout */}
              <div className="mt-8">
                <div className="bg-white border rounded-lg overflow-hidden">
                  {/* Table Header with Add New Item Button */}
                  <div className="bg-gray-100 p-4 border-b">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-800">Item Parts</h3>
                      <Button 
                        type="button" 
                        onClick={addItem} 
                        disabled={formData.items.length >= 20}
                        className="bg-blue-500 hover:bg-blue-600 text-white border-0 px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-200 font-medium rounded-lg"
                      >
                        + Add New Item
                      </Button>
                    </div>
                    <div className="grid grid-cols-4 gap-4 font-medium text-gray-700 text-sm">
                      <div>Item Parts</div>
                      <div>Quantity</div>
                      <div>Remarks</div>
                      <div className="text-center">Remove</div>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-gray-200">
                    {formData.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 transition-colors">
                        <div>
                          <Select
                            value={item.partId || ''}
                            onChange={(e) => updateItem(index, 'partId', e.target.value)}
                            className="w-full"
                          >
                            <option value="">Select...</option>
                            {availableParts.map((part) => (
                              <option key={part.id} value={part.id}>
                                {part.partNo} - {part.description?.substring(0, 25) || 'No description'}
                              </option>
                            ))}
                          </Select>
                          <p className="text-xs text-red-500 mt-1">Required!</p>
                        </div>
                        
                        <div>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            required
                            className="w-full"
                            placeholder="1"
                          />
                        </div>
                        
                        <div>
                          <Input
                            value={item.description || ''}
                            onChange={(e) => updateItem(index, 'description', e.target.value)}
                            placeholder="Enter remarks..."
                            className="w-full bg-green-50 border-green-200 focus:bg-green-100 focus:border-green-300"
                          />
                        </div>
                        
                        <div className="flex justify-center">
                          <Button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 font-bold text-lg flex items-center justify-center"
                            title="Remove item"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Empty State */}
                    {formData.items.length === 0 && (
                      <div className="p-8 text-center text-gray-500">
                        <div className="text-gray-400 mb-2">
                          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <p>No items added yet</p>
                        <p className="text-sm">Click "Add New Item" to add items to this purchase order</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Information */}
                {formData.items.length >= 20 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-700">Maximum 20 items allowed per purchase order</p>
                  </div>
                )}
              </div>

              {/* Action Buttons - Professional Layout */}
              <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  {formData.items.length === 0 ? (
                    "Please add at least one item to save the purchase order"
                  ) : (
                    `${formData.items.length} item${formData.items.length > 1 ? 's' : ''} added`
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    onClick={() => {
                      resetForm();
                      setError('');
                      setSuccess('');
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-2 shadow-lg hover:shadow-xl transition-all duration-200 font-medium rounded-lg border-0"
                  >
                    Reset
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading || formData.items.length === 0 || !formData.supplierId} 
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium rounded-lg border-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    {loading ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Purchase Orders List */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle>All Purchase Orders ({filteredPOs.length})</CardTitle>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="min-w-[150px]"
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="received">Received</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loading && !purchaseOrders.length ? (
            <div className="text-center py-12 text-gray-500">Loading purchase orders...</div>
          ) : filteredPOs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchTerm || statusFilter ? 'No purchase orders found matching your filters.' : 'No purchase orders found. Create one to get started.'}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPOs.map((po, index) => (
                <div
                  key={po.id}
                  className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-300 hover:border-primary-300 slide-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{po.poNo}</h3>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(po.status)}`}>
                          {po.status.toUpperCase()}
                        </span>
                        <span className="px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                          Purchase Order
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Supplier</p>
                          <p className="font-medium">{po.supplierName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Order Date</p>
                          <p className="font-medium">{new Date(po.orderDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Items</p>
                          <p className="font-medium">{po.items.length}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Amount</p>
                          <p className="font-bold text-lg text-primary-600">${po.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>

                      {po.items && po.items.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-xs font-medium text-gray-500 uppercase mb-2">Items:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {po.items.slice(0, 4).map((item, idx) => (
                              <div key={idx} className="text-xs bg-gray-50 p-2 rounded">
                                <span className="font-medium">{item.partNo}</span> - Qty: {item.quantity} × ${item.unitPrice} = ${item.totalPrice.toFixed(2)}
                              </div>
                            ))}
                            {po.items.length > 4 && (
                              <div className="text-xs text-gray-500 p-2">
                                +{po.items.length - 4} more items
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(po)}
                        className="hover:bg-primary-50 hover:border-primary-300 transition-colors"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => po.id && handleDelete(po.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
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

