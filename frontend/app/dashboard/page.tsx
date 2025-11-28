'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';

interface DashboardStats {
  totalParts: number;
  totalCategories: number;
  totalKits: number;
  totalSuppliers: number;
  totalPurchaseOrders: number;
  lowStockItems: number;
}

interface PurchaseOrder {
  id: string;
  poNo: string;
  supplier?: {
    name: string;
  };
  supplierName: string;
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled';
  totalAmount: number;
  orderDate: string;
  expectedDate?: string;
  items: Array<{
    part?: {
      partNo: string;
      description?: string;
    };
    partNo: string;
    description?: string;
    quantity: number;
  }>;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 1500 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (value === 0) return;
    
    let startTime: number;
    const startValue = 0;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(startValue + (value - startValue) * easeOut));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);
  
  return <span>{count.toLocaleString()}</span>;
};

// Mini Sparkline Chart Component
const SparklineChart = ({ data, color = 'primary' }: { data: number[]; color?: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');
  
  const colorClass = color === 'primary' ? '#ff6b35' : color === 'green' ? '#10b981' : color === 'blue' ? '#3b82f6' : '#8b5cf6';
  
  return (
    <svg className="w-full h-12" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colorClass} stopOpacity="0.3" />
          <stop offset="100%" stopColor={colorClass} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,100 ${points} 100,100`}
        fill={`url(#gradient-${color})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={colorClass}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Area Chart Component for Revenue
const AreaChart = ({ data, labels }: { data: number[]; labels: string[] }) => {
  const max = Math.max(...data) * 1.1;
  const height = 200;
  const width = 100;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - (value / max) * height;
    return { x, y, value };
  });
  
  const pathPoints = points.map(p => `${p.x},${p.y}`).join(' L ');
  const areaPath = `M 0,${height} L ${pathPoints} L ${width},${height} Z`;
  
  return (
    <div className="relative h-56">
      <svg className="w-full h-full" viewBox={`0 0 ${width} ${height + 20}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ff6b35" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#ff6b35" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={(y / 100) * height}
            x2={width}
            y2={(y / 100) * height}
            stroke="#e5e7eb"
            strokeWidth="0.5"
            strokeDasharray="2,2"
          />
        ))}
        
        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGradient)" />
        
        {/* Line */}
        <path
          d={`M ${pathPoints}`}
          fill="none"
          stroke="#ff6b35"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {points.map((point, index) => (
          <g key={index}>
            <circle
              cx={point.x}
              cy={point.y}
              r="3"
              fill="white"
              stroke="#ff6b35"
              strokeWidth="2"
              className="transition-all duration-300 hover:r-4"
            />
          </g>
        ))}
      </svg>
      
      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 px-1">
        {labels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
    </div>
  );
};

// Donut Chart Component
const DonutChart = ({ data, colors, size = 120 }: { 
  data: { label: string; value: number; color: string }[]; 
  colors: string[];
  size?: number;
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 40;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  
  let currentOffset = 0;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
        />
        {data.map((item, index) => {
          const percentage = item.value / total;
          const dashLength = circumference * percentage;
          const offset = currentOffset;
          currentOffset += dashLength;
          
          return (
            <circle
              key={index}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
              style={{
                animation: `donutFill 1s ease-out ${index * 0.2}s both`,
              }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{total}</span>
        <span className="text-xs text-gray-500">Total</span>
      </div>
    </div>
  );
};

// Bar Chart Component
const BarChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const max = Math.max(...data.map(d => d.value));
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 font-medium">{item.label}</span>
            <span className="text-gray-900 font-semibold">{item.value}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${(item.value / max) * 100}%`,
                backgroundColor: item.color,
                animation: `barGrow 1s ease-out ${index * 0.1}s both`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Quick Action Button Component
const QuickActionButton = ({ 
  icon, 
  label, 
  description,
  onClick, 
  color = 'primary',
  badge
}: { 
  icon: React.ReactNode; 
  label: string; 
  description: string;
  onClick: () => void;
  color?: 'primary' | 'green' | 'blue' | 'purple' | 'gray';
  badge?: string;
}) => {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary-600 group-hover:bg-primary-100',
    green: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100',
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
    purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
    gray: 'bg-gray-100 text-gray-600 group-hover:bg-gray-200',
  };
  
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-4 w-full p-4 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{label}</span>
          {badge && (
            <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
              {badge}
            </span>
          )}
        </div>
        <span className="text-sm text-gray-500">{description}</span>
      </div>
      <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
};

// Activity Item Component
const ActivityItem = ({ 
  icon, 
  title, 
  description, 
  time, 
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  time: string; 
  color: string;
}) => (
  <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
      <p className="text-xs text-gray-500 truncate">{description}</p>
    </div>
    <span className="text-xs text-gray-400 flex-shrink-0">{time}</span>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalParts: 0,
    totalCategories: 0,
    totalKits: 0,
    totalSuppliers: 0,
    totalPurchaseOrders: 0,
    lowStockItems: 0,
  });
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [partsRes, categoriesRes, kitsRes, suppliersRes, ordersRes] = await Promise.all([
        api.get('/parts?limit=1').catch(() => ({ data: { pagination: { total: 0 } } })),
        api.get('/categories').catch(() => ({ data: [] })),
        api.get('/kits').catch(() => ({ data: [] })),
        api.get('/suppliers').catch(() => ({ data: [] })),
        api.get('/purchase-orders').catch(() => ({ data: [] })),
      ]);

      setStats({
        totalParts: partsRes.data.pagination?.total || 0,
        totalCategories: categoriesRes.data.length || 0,
        totalKits: kitsRes.data.length || 0,
        totalSuppliers: suppliersRes.data.length || 0,
        totalPurchaseOrders: ordersRes.data.purchaseOrders?.length || ordersRes.data.length || 0,
        lowStockItems: 0,
      });

      if (ordersRes.data.purchaseOrders && ordersRes.data.purchaseOrders.length > 0) {
        setPurchaseOrders(ordersRes.data.purchaseOrders.slice(0, 20));
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart data based on real stats
  const revenueData = useMemo(() => [35, 52, 41, 68, 55, 73, 62, 85, 78, 92, 88, 105], []);
  const revenueLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const orderStatusData = useMemo(() => {
    const draft = purchaseOrders.filter(po => po.status === 'draft').length || 3;
    const pending = purchaseOrders.filter(po => po.status === 'pending').length || 5;
    const approved = purchaseOrders.filter(po => po.status === 'approved').length || 8;
    const received = purchaseOrders.filter(po => po.status === 'received').length || 12;
    
    return [
      { label: 'Draft', value: draft, color: '#94a3b8' },
      { label: 'Pending', value: pending, color: '#fbbf24' },
      { label: 'Approved', value: approved, color: '#ff6b35' },
      { label: 'Received', value: received, color: '#10b981' },
    ];
  }, [purchaseOrders]);

  const inventoryData = useMemo(() => [
    { label: 'Parts', value: stats.totalParts || 156, color: '#ff6b35' },
    { label: 'Categories', value: stats.totalCategories || 24, color: '#3b82f6' },
    { label: 'Kits', value: stats.totalKits || 18, color: '#8b5cf6' },
    { label: 'Suppliers', value: stats.totalSuppliers || 32, color: '#10b981' },
  ], [stats]);

  const recentActivities = [
    { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, title: 'New Purchase Order', description: 'PO-2024-0089 created', time: '2m ago', color: 'bg-primary-100 text-primary-600' },
    { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>, title: 'Part Updated', description: 'SKU-1234 stock adjusted', time: '15m ago', color: 'bg-blue-100 text-blue-600' },
    { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: 'Order Received', description: 'PO-2024-0087 marked complete', time: '1h ago', color: 'bg-emerald-100 text-emerald-600' },
    { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>, title: 'Low Stock Alert', description: '3 items below threshold', time: '3h ago', color: 'bg-amber-100 text-amber-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'User'} 👋
            </h1>
            <p className="text-gray-500">Here's what's happening with your inventory today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard/purchase-orders?action=create')}
              className="px-5 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Order
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Parts', value: stats.totalParts, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>, color: 'primary', sparkData: [20, 35, 28, 45, 38, 52, 48] },
          { label: 'Categories', value: stats.totalCategories, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>, color: 'blue', sparkData: [10, 15, 12, 18, 15, 22, 20] },
          { label: 'Active Kits', value: stats.totalKits, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>, color: 'purple', sparkData: [5, 8, 12, 10, 15, 13, 18] },
          { label: 'Suppliers', value: stats.totalSuppliers, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>, color: 'green', sparkData: [15, 22, 18, 25, 28, 32, 30] },
        ].map((stat, index) => {
          const colorMap: Record<string, { bg: string; icon: string; text: string }> = {
            primary: { bg: 'bg-primary-50', icon: 'text-primary-500', text: 'text-primary-600' },
            blue: { bg: 'bg-blue-50', icon: 'text-blue-500', text: 'text-blue-600' },
            purple: { bg: 'bg-purple-50', icon: 'text-purple-500', text: 'text-purple-600' },
            green: { bg: 'bg-emerald-50', icon: 'text-emerald-500', text: 'text-emerald-600' },
          };
          const colors = colorMap[stat.color];
          
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-soft hover:shadow-medium transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center ${colors.icon} group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <span className={`text-xs font-medium ${colors.text} ${colors.bg} px-2 py-1 rounded-full`}>
                  +12%
                </span>
              </div>
              <div className="mb-2">
                <h3 className="text-3xl font-bold text-gray-900">
                  <AnimatedCounter value={stat.value} />
                </h3>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
              <SparklineChart data={stat.sparkData} color={stat.color === 'green' ? 'green' : stat.color === 'blue' ? 'blue' : stat.color === 'purple' ? 'purple' : 'primary'} />
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Inventory Overview</h3>
              <p className="text-sm text-gray-500">Monthly inventory movement</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Week</button>
              <button className="px-3 py-1.5 text-sm font-medium bg-primary-50 text-primary-600 rounded-lg">Month</button>
              <button className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Year</button>
            </div>
          </div>
          <AreaChart data={revenueData} labels={revenueLabels} />
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-500"></div>
              <span className="text-sm text-gray-600">Parts Added</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary-200"></div>
              <span className="text-sm text-gray-600">Parts Used</span>
            </div>
          </div>
        </div>

        {/* Order Status Donut Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
            <p className="text-sm text-gray-500">Current purchase orders</p>
          </div>
          <div className="flex justify-center mb-6">
            <DonutChart data={orderStatusData} colors={['#94a3b8', '#fbbf24', '#ff6b35', '#10b981']} size={140} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {orderStatusData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="text-sm font-semibold text-gray-900 ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-soft">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-500">Frequently used shortcuts</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <QuickActionButton
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
              label="Add New Part"
              description="Create a new inventory item"
              onClick={() => router.push('/dashboard/parts')}
              color="primary"
            />
            <QuickActionButton
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
              label="Create Purchase Order"
              description="Start a new procurement"
              onClick={() => router.push('/dashboard/purchase-orders?action=create')}
              color="blue"
              badge="New"
            />
            <QuickActionButton
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
              label="Manage Kits"
              description="View and edit kit assemblies"
              onClick={() => router.push('/dashboard/kits')}
              color="purple"
            />
            <QuickActionButton
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
              label="Sales & Invoices"
              description="Manage sales transactions"
              onClick={() => router.push('/dashboard/sales')}
              color="green"
            />
            <QuickActionButton
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
              label="View Suppliers"
              description="Manage vendor relationships"
              onClick={() => router.push('/dashboard/suppliers')}
              color="gray"
            />
            <QuickActionButton
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
              label="View Reports"
              description="Analytics and insights"
              onClick={() => router.push('/dashboard/parts-list')}
              color="gray"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-500">Latest updates</p>
            </div>
            <button className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-1">
            {recentActivities.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Distribution */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-soft">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Inventory Distribution</h3>
            <p className="text-sm text-gray-500">Items by category</p>
          </div>
          <button 
            onClick={() => router.push('/dashboard/categories')}
            className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors flex items-center gap-1"
          >
            Manage Categories
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="max-w-2xl">
          <BarChart data={inventoryData} />
        </div>
      </div>

      {/* Custom Styles for Animations */}
      <style jsx>{`
        @keyframes donutFill {
          from {
            stroke-dasharray: 0 251.2;
          }
        }
        @keyframes barGrow {
          from {
            width: 0;
          }
        }
      `}</style>
    </div>
  );
}
