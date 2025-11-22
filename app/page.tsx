// Main dashboard page

'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { ShipmentGrid } from '@/components/shipments/ShipmentGrid';
import { CompanyFilter } from '@/components/shipments/CompanyFilter';
import { UploadModal } from '@/components/upload/UploadModal';
import { PriceHistoryModal } from '@/components/history/PriceHistoryModal';
import { Button } from '@/components/ui/Button';
import { useUploadStore } from '@/store/useUploadStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useShipmentsStore } from '@/store/useShipmentsStore';
import type { ShipmentWithDetails, Company } from '@/types';

export default function Home() {
  const [shipments, setShipments] = useState<ShipmentWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Optimize store subscriptions - only subscribe to what we need
  // Using stable selectors to prevent unnecessary re-subscriptions
  const isUploadModalOpen = useUploadStore((state) => state.isUploadModalOpen);
  const openUploadModal = useUploadStore((state) => state.openUploadModal);
  const closeUploadModal = useUploadStore((state) => state.closeUploadModal);

  const isHistoryModalOpen = useHistoryStore((state) => state.isHistoryModalOpen);
  const selectedShipmentId = useHistoryStore((state) => state.selectedShipmentId);
  const openHistoryModal = useHistoryStore((state) => state.openHistoryModal);
  const closeHistoryModal = useHistoryStore((state) => state.closeHistoryModal);

  const selectedCompanyId = useShipmentsStore((state) => state.selectedCompanyId);
  const setSelectedCompanyId = useShipmentsStore((state) => state.setSelectedCompanyId);

  const fetchShipments = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = selectedCompanyId
        ? `/api/shipments?companyId=${selectedCompanyId}`
        : '/api/shipments';

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setShipments(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch shipments:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCompanyId]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  // Extract unique companies from shipments with O(n) complexity using Map
  const companies = useMemo(() => {
    const companyMap = new Map<string, Company>();
    shipments.forEach((shipment) => {
      if (!companyMap.has(shipment.company.id)) {
        companyMap.set(shipment.company.id, shipment.company);
      }
    });
    return Array.from(companyMap.values());
  }, [shipments]);

  const handleUploadSuccess = () => {
    fetchShipments();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Delivro</h1>
              <p className="text-sm text-gray-600 mt-1">Invoice Management System</p>
            </div>
            <Button onClick={openUploadModal}>
              Upload Invoices
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex items-center justify-between">
          <CompanyFilter
            companies={companies}
            selectedCompanyId={selectedCompanyId}
            onSelect={setSelectedCompanyId}
          />

          {/* Stats */}
          {!isLoading && (
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{shipments.length}</span> shipments
            </div>
          )}
        </div>

        {/* Shipments Grid */}
        <ShipmentGrid
          shipments={shipments}
          onViewHistory={openHistoryModal}
          isLoading={isLoading}
        />
      </main>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={closeUploadModal}
        onSuccess={handleUploadSuccess}
      />

      <PriceHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={closeHistoryModal}
        shipmentId={selectedShipmentId}
      />
    </div>
  );
}
