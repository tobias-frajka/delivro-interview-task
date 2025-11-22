// ShipmentCard component - displays individual shipment information

'use client';

import React from 'react';
import type { ShipmentWithDetails } from '@/types';
import { formatDate, formatPrice, formatWeight, getCountryFlag } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

interface ShipmentCardProps {
  shipment: ShipmentWithDetails;
  onViewHistory: (shipmentId: string) => void;
}

export const ShipmentCard: React.FC<ShipmentCardProps> = ({
  shipment,
  onViewHistory,
}) => {
  const modeColor = shipment.mode === 'EXPORT' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800';

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-200">
      {/* Header - Provider */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gray-900">{shipment.provider}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${modeColor}`}>
          {shipment.mode}
        </span>
      </div>

      {/* Tracking Number */}
      <div className="mb-2">
        <span className="text-sm text-gray-500">TRK#</span>
        <p className="text-lg font-semibold text-gray-800">{shipment.trackingNumber}</p>
      </div>

      {/* Company */}
      <div className="mb-3">
        <p className="text-sm text-gray-600">{shipment.company.name}</p>
      </div>

      {/* Route */}
      <div className="flex items-center justify-center space-x-2 mb-3 py-2 bg-gray-50 rounded text-gray-700">
        <span className="text-2xl">{getCountryFlag(shipment.originCountry)}</span>
        <span>→</span>
        <span className="text-2xl">{getCountryFlag(shipment.destinationCountry)}</span>
      </div>

      {/* Latest Price */}
      {shipment.latestInvoice ? (
        <div className="mb-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Latest Price</p>
              <p className="text-xl font-bold text-gray-900">{formatPrice(shipment.latestInvoice.invoicedPrice)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Weight</p>
              <p className="text-lg font-semibold text-gray-800">{formatWeight(shipment.latestInvoice.invoicedWeight)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500 text-center">No invoice data</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <span className="text-xs text-gray-500">{formatDate(shipment.createdDate)}</span>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onViewHistory(shipment.id)}
        >
          View History
        </Button>
      </div>
    </div>
  );
};
