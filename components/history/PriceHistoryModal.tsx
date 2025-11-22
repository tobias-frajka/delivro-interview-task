// PriceHistoryModal component - displays invoice price history for a shipment

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/Modal';
import type { InvoiceHistory } from '@/types';
import { formatDate, formatPrice, formatWeight } from '@/lib/utils';

interface PriceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipmentId: string | null;
}

export const PriceHistoryModal: React.FC<PriceHistoryModalProps> = React.memo(({
  isOpen,
  onClose,
  shipmentId,
}) => {
  const t = useTranslations('historyModal');
  const [history, setHistory] = useState<InvoiceHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!shipmentId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/shipments/${shipmentId}/history`);
      const result = await response.json();

      if (result.success) {
        setHistory(result.data);
      } else {
        setError(result.error || t('failedToFetch'));
      }
    } catch {
      setError(t('failedToFetch'));
    } finally {
      setIsLoading(false);
    }
  }, [shipmentId, t]);

  useEffect(() => {
    if (isOpen && shipmentId) {
      fetchHistory();
    } else {
      // Clear data when closed to reduce memory usage
      setHistory([]);
      setError(null);
    }
  }, [isOpen, shipmentId, fetchHistory]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('title')} size="lg">
      <div className="space-y-4">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-teal-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-gray-600">{t('loadingHistory')}</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* History Table */}
        {!isLoading && !error && history.length > 0 && (
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('invoiceId')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('price')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('weight')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('uploadedAt')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((invoice, index) => (
                  <tr
                    key={invoice.id}
                    className={`${
                      index === 0 ? 'bg-yellow-50 border-l-4 border-yellow-400' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                      {invoice.id.substring(0, 16)}...
                      {index === 0 && (
                        <span className="ml-2 px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-semibold">
                          {t('latest')}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {formatPrice(invoice.invoicedPrice)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatWeight(invoice.invoicedWeight)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(invoice.uploadedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && history.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('noHistoryFound')}</p>
          </div>
        )}
      </div>
    </Modal>
  );
});

PriceHistoryModal.displayName = 'PriceHistoryModal';
