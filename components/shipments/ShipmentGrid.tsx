// ShipmentGrid component - displays grid of shipment cards

'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import type { ShipmentWithDetails } from '@/types';
import { ShipmentCard } from './ShipmentCard';

interface ShipmentGridProps {
  shipments: ShipmentWithDetails[];
  onViewHistory: (shipmentId: string) => void;
  isLoading?: boolean;
}

export const ShipmentGrid: React.FC<ShipmentGridProps> = React.memo(({
  shipments,
  onViewHistory,
  isLoading = false,
}) => {
  const t = useTranslations('shipmentGrid');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-teal-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">{t('loadingShipments')}</p>
        </div>
      </div>
    );
  }

  if (shipments.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('noShipmentsFound')}</h3>
          <p className="text-gray-500">{t('uploadToGetStarted')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shipments.map((shipment) => (
        <ShipmentCard
          key={shipment.id}
          shipment={shipment}
          onViewHistory={onViewHistory}
        />
      ))}
    </div>
  );
});

ShipmentGrid.displayName = 'ShipmentGrid';
