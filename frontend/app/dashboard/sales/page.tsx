'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SalesInquiry from './components/SalesInquiry';
import SalesQuotation from './components/SalesQuotation';
import SalesInvoice from './components/SalesInvoice';
import DeliveryChallan from './components/DeliveryChallan';
import SalesReturn from './components/SalesReturn';

type SalesTab = 'inquiry' | 'quotation' | 'invoice' | 'challan' | 'return';

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState<SalesTab>('inquiry');

  const tabs = [
    { id: 'inquiry' as SalesTab, label: 'Sales Inquiry', icon: '📋' },
    { id: 'quotation' as SalesTab, label: 'Sales Quotation', icon: '📄' },
    { id: 'invoice' as SalesTab, label: 'Sales Invoice', icon: '🧾' },
    { id: 'challan' as SalesTab, label: 'Delivery Challan', icon: '🚚' },
    { id: 'return' as SalesTab, label: 'Sales Return', icon: '↩️' },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-1 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full"></div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage sales inquiries, quotations, invoices, and returns</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Card className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-200 bg-gray-50">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'text-primary-600 border-b-2 border-primary-500 bg-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <CardContent className="p-0">
          {activeTab === 'inquiry' && <SalesInquiry />}
          {activeTab === 'quotation' && <SalesQuotation />}
          {activeTab === 'invoice' && <SalesInvoice />}
          {activeTab === 'challan' && <DeliveryChallan />}
          {activeTab === 'return' && <SalesReturn />}
        </CardContent>
      </Card>
    </div>
  );
}

