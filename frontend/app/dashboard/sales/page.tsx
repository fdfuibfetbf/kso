'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SalesInquiry from './components/SalesInquiry';
import SalesQuotation from './components/SalesQuotation';
import SalesReturn from './components/SalesReturn';

type SalesTab = 'sale' | 'quotation' | 'return';

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState<SalesTab>('sale');

  const menuItems = [
    { 
      id: 'sale' as SalesTab, 
      label: 'Sale', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      )
    },
    { 
      id: 'quotation' as SalesTab, 
      label: 'Quotation', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      id: 'return' as SalesTab, 
      label: 'Return Sales', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'sale':
        return <SalesInquiry />;
      case 'quotation':
        return <SalesQuotation />;
      case 'return':
        return <SalesReturn />;
      default:
        return <SalesInquiry />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sales Management</h1>
        <p className="text-gray-600">Manage sales inquiries, quotations, invoices, and returns</p>
      </div>

      {/* Horizontal Tabs Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex justify-center border-b border-gray-200 overflow-x-auto">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${isActive
                    ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {renderContent()}
      </div>
    </div>
  );
}

