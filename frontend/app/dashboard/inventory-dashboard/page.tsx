'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/api';

interface InventoryStats {
  totalParts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalQuantity: number;
  categories: Array<{ name: string; count: number; value: number }>;
  topItems: Array<{ partNo: string; description: string; quantity: number; value: number }>;
  stockByStore: Array<{ store: string; quantity: number; value: number }>;
  recentMovements: Array<{ date: string; type: string; quantity: number; partNo: string }>;
  monthlyTrends: Array<{ month: string; added: number; used: number; stock: number }>;
}

const COLORS = ['#ff6b35', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function InventoryDashboard() {
  const [stats, setStats] = useState<InventoryStats>({
    totalParts: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalQuantity: 0,
    categories: [],
    topItems: [],
    stockByStore: [],
    recentMovements: [],
    monthlyTrends: [],
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchInventoryStats();
  }, [timeRange]);

  const fetchInventoryStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all parts with stock
      const partsResponse = await api.get('/parts?limit=1000');
      const parts = partsResponse.data.parts || [];

      // Fetch inventory items
      const inventoryResponse = await api.get('/parts-management/getItemsInventory?records=1000&pageNo=1');
      const inventoryItems = inventoryResponse.data.itemsInventory?.data || [];

      // Calculate statistics
      let totalValue = 0;
      let totalQuantity = 0;
      let lowStockCount = 0;
      let outOfStockCount = 0;
      const categoryMap = new Map<string, { count: number; value: number }>();
      const itemsWithValue: Array<{ partNo: string; description: string; quantity: number; value: number }> = [];

      parts.forEach((part: any) => {
        const quantity = part.stock?.quantity || 0;
        const cost = part.cost || 0;
        const value = quantity * cost;
        
        totalQuantity += quantity;
        totalValue += value;

        if (quantity === 0) {
          outOfStockCount++;
        } else if (part.reOrderLevel && quantity <= part.reOrderLevel) {
          lowStockCount++;
        }

        // Category statistics
        const category = part.mainCategory || 'Uncategorized';
        const existing = categoryMap.get(category) || { count: 0, value: 0 };
        categoryMap.set(category, {
          count: existing.count + 1,
          value: existing.value + value,
        });

        // Top items
        if (quantity > 0) {
          itemsWithValue.push({
            partNo: part.partNo,
            description: part.description || part.partNo,
            quantity,
            value,
          });
        }
      });

      // Sort and get top 10 items
      const topItems = itemsWithValue
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);

      // Convert category map to array
      const categories = Array.from(categoryMap.entries())
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.value - a.value);

      // Store statistics
      const storeMap = new Map<string, { quantity: number; value: number }>();
      inventoryItems.forEach((item: any) => {
        const storeName = item.store?.name || 'Unknown Store';
        const quantity = item.quantity || 0;
        const cost = item.item?.machinePartOemPart?.machinePart?.unit?.name ? 10 : 0; // Default cost
        const value = quantity * cost;

        const existing = storeMap.get(storeName) || { quantity: 0, value: 0 };
        storeMap.set(storeName, {
          quantity: existing.quantity + quantity,
          value: existing.value + value,
        });
      });

      const stockByStore = Array.from(storeMap.entries())
        .map(([store, data]) => ({ store, ...data }))
        .sort((a, b) => b.quantity - a.quantity);

      // Generate monthly trends (mock data for now)
      const monthlyTrends = generateMonthlyTrends(parts.length, totalQuantity);

      setStats({
        totalParts: parts.length,
        totalValue,
        lowStockItems: lowStockCount,
        outOfStockItems: outOfStockCount,
        totalQuantity,
        categories: categories.slice(0, 8), // Top 8 categories
        topItems,
        stockByStore,
        recentMovements: [], // Can be populated from inventory adjustments
        monthlyTrends,
      });
    } catch (error: any) {
      console.error('Failed to fetch inventory stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMonthlyTrends = (totalParts: number, totalQty: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.map((month, index) => {
      const monthIndex = (currentMonth - 11 + index + 12) % 12;
      const baseAdded = Math.floor(totalParts / 12) + Math.random() * 10;
      const baseUsed = baseAdded * 0.3;
      const stock = totalQty - (baseUsed * (12 - index));
      
      return {
        month,
        added: Math.floor(baseAdded),
        used: Math.floor(baseUsed),
        stock: Math.max(0, Math.floor(stock)),
      };
    });
  };

  const statCards = [
    {
      label: 'Total Parts',
      value: stats.totalParts,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
    {
      label: 'Total Inventory Value',
      value: `$${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Total Quantity',
      value: stats.totalQuantity.toLocaleString(),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Low Stock Items',
      value: stats.lowStockItems,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      label: 'Out of Stock',
      value: stats.outOfStockItems,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-primary-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading inventory dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Dashboard</h1>
          <p className="text-gray-600">Comprehensive overview of your inventory operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((card, index) => (
            <Card key={index} className="bg-white border border-gray-200 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{card.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  <div className={`${card.bgColor} ${card.color} p-3 rounded-lg`}>
                    {card.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inventory Value by Category */}
          <Card className="bg-white border border-gray-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Inventory Value by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.categories}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" fill="#ff6b35" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="bg-white border border-gray-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Parts Distribution by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.categories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {stats.categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Inventory Trends */}
          <Card className="bg-white border border-gray-200 shadow-soft">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Monthly Inventory Trends</CardTitle>
                <div className="flex gap-2">
                  <button
                    onClick={() => setTimeRange('week')}
                    className={`px-3 py-1 text-xs rounded-md ${
                      timeRange === 'week' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setTimeRange('month')}
                    className={`px-3 py-1 text-xs rounded-md ${
                      timeRange === 'month' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setTimeRange('year')}
                    className={`px-3 py-1 text-xs rounded-md ${
                      timeRange === 'year' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Year
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats.monthlyTrends}>
                  <defs>
                    <linearGradient id="colorAdded" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ff6b35" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorUsed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Area type="monotone" dataKey="added" stroke="#ff6b35" fillOpacity={1} fill="url(#colorAdded)" name="Parts Added" />
                  <Area type="monotone" dataKey="used" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsed)" name="Parts Used" />
                  <Line type="monotone" dataKey="stock" stroke="#10b981" strokeWidth={2} name="Current Stock" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Stock by Store */}
          <Card className="bg-white border border-gray-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Stock Distribution by Store</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.stockByStore} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis 
                    dataKey="store" 
                    type="category" 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    width={120}
                  />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="quantity" fill="#10b981" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 10 Items by Value */}
          <Card className="bg-white border border-gray-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Top 10 Items by Inventory Value</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stats.topItems} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    type="number" 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <YAxis 
                    dataKey="partNo" 
                    type="category" 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    width={100}
                  />
                  <Tooltip 
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top 10 Items by Quantity */}
          <Card className="bg-white border border-gray-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Top 10 Items by Quantity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stats.topItems.sort((a, b) => b.quantity - a.quantity)} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    type="number" 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis 
                    dataKey="partNo" 
                    type="category" 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    width={100}
                  />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="quantity" fill="#f59e0b" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert Table */}
        {stats.lowStockItems > 0 && (
          <Card className="bg-white border border-gray-200 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Low Stock Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-yellow-800">Attention Required</p>
                    <p className="text-sm text-yellow-700">
                      {stats.lowStockItems} item{stats.lowStockItems !== 1 ? 's' : ''} {stats.lowStockItems === 1 ? 'is' : 'are'} below reorder level
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

