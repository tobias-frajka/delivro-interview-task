// PreviewTable component - displays invoice data preview

'use client';

import React from 'react';
import type { ParsedInvoice } from '@/types';
import { formatDate, formatPrice, formatWeight } from '@/lib/utils';

interface PreviewTableProps {
  invoices: ParsedInvoice[];
}

export const PreviewTable: React.FC<PreviewTableProps> = ({ invoices }) => {
  return (
    <div className="overflow-x-auto max-h-96 border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Invoice ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tracking
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Provider
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mode
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Weight
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices.map((invoice, index) => (
            <tr key={invoice.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                {invoice.id.substring(0, 12)}...
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {invoice.shipment.trackingNumber}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {invoice.shipment.company.name}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                {invoice.shipment.provider}
              </td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    invoice.shipment.mode === 'EXPORT'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {invoice.shipment.mode}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {formatPrice(invoice.invoicedPrice)}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900">
                {formatWeight(invoice.invoicedWeight)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
