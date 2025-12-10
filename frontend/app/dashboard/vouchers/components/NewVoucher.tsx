'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface VoucherEntry {
  id: string;
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
  description: string;
}

export default function NewVoucher() {
  const [voucherType, setVoucherType] = useState('payment');
  const [voucherDate, setVoucherDate] = useState(new Date().toISOString().split('T')[0]);
  const [voucherNumber, setVoucherNumber] = useState('');
  const [narration, setNarration] = useState('');
  const [entries, setEntries] = useState<VoucherEntry[]>([
    { id: '1', accountId: '', accountName: '', debit: 0, credit: 0, description: '' }
  ]);

  const addEntry = () => {
    const newEntry: VoucherEntry = {
      id: Date.now().toString(),
      accountId: '',
      accountName: '',
      debit: 0,
      credit: 0,
      description: ''
    };
    setEntries([...entries, newEntry]);
  };

  const removeEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter(entry => entry.id !== id));
    }
  };

  const updateEntry = (id: string, field: keyof VoucherEntry, value: any) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  const totalDebit = entries.reduce((sum, entry) => sum + (Number(entry.debit) || 0), 0);
  const totalCredit = entries.reduce((sum, entry) => sum + (Number(entry.credit) || 0), 0);
  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isBalanced) {
      alert('Voucher is not balanced! Total debit must equal total credit.');
      return;
    }

    // TODO: Submit voucher to API
    console.log({
      voucherType,
      voucherDate,
      voucherNumber,
      narration,
      entries,
      totalAmount: totalDebit
    });

    alert('Voucher saved successfully!');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Voucher Details */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Voucher Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="voucherType">Voucher Type</Label>
              <select
                id="voucherType"
                value={voucherType}
                onChange={(e) => setVoucherType(e.target.value)}
                className="mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="payment">Payment Voucher</option>
                <option value="receipt">Receipt Voucher</option>
                <option value="journal">Journal Voucher</option>
                <option value="contra">Contra Voucher</option>
              </select>
            </div>

            <div>
              <Label htmlFor="voucherNumber">Voucher Number</Label>
              <Input
                id="voucherNumber"
                type="text"
                value={voucherNumber}
                onChange={(e) => setVoucherNumber(e.target.value)}
                placeholder="Auto-generated"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="voucherDate">Date</Label>
              <Input
                id="voucherDate"
                type="date"
                value={voucherDate}
                onChange={(e) => setVoucherDate(e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>
        </div>

        {/* Voucher Entries */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Entries</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Debit
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credit
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-4 py-3">
                      <Input
                        type="text"
                        value={entry.accountName}
                        onChange={(e) => updateEntry(entry.id, 'accountName', e.target.value)}
                        placeholder="Select account"
                        required
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="text"
                        value={entry.description}
                        onChange={(e) => updateEntry(entry.id, 'description', e.target.value)}
                        placeholder="Description"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        value={entry.debit || ''}
                        onChange={(e) => updateEntry(entry.id, 'debit', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="text-right"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Input
                        type="number"
                        value={entry.credit || ''}
                        onChange={(e) => updateEntry(entry.id, 'credit', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                        className="text-right"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => removeEntry(entry.id)}
                        disabled={entries.length === 1}
                        className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-right font-semibold text-gray-900">
                    Total:
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">
                    ₹{totalDebit.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">
                    ₹{totalCredit.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {isBalanced ? (
                      <span className="text-green-600 font-semibold">✓ Balanced</span>
                    ) : (
                      <span className="text-red-600 font-semibold">✗ Not Balanced</span>
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <Button
              type="button"
              onClick={addEntry}
              variant="outline"
              className="w-full"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Entry
            </Button>
          </div>
        </div>

        {/* Narration */}
        <div>
          <Label htmlFor="narration">Narration</Label>
          <textarea
            id="narration"
            value={narration}
            onChange={(e) => setNarration(e.target.value)}
            placeholder="Enter voucher narration..."
            rows={3}
            className="max-w-md mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit" disabled={!isBalanced}>
            Save Voucher
          </Button>
        </div>
      </form>
    </div>
  );
}

