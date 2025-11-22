// Main dashboard page

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { ShipmentGrid } from '@/components/shipments/ShipmentGrid';
import { CompanyFilter } from '@/components/shipments/CompanyFilter';
import { UploadModal } from '@/components/upload/UploadModal';
import { PriceHistoryModal } from '@/components/history/PriceHistoryModal';
import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useUploadStore } from '@/store/useUploadStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useShipmentsStore } from '@/store/useShipmentsStore';
import type { ShipmentWithDetails, Company } from '@/types';

export default function Home() {
  const t = useTranslations();
  const [shipments, setShipments] = useState<ShipmentWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Cache the full company list to persist across filters
  const [cachedCompanies, setCachedCompanies] = useState<Company[]>([]);

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

        // Only extract and cache companies when fetching ALL shipments (no filter)
        // This ensures the dropdown always shows all available companies
        if (!selectedCompanyId) {
          const companyMap = new Map<string, Company>();
          result.data.forEach((shipment: ShipmentWithDetails) => {
            if (!companyMap.has(shipment.company.id)) {
              companyMap.set(shipment.company.id, shipment.company);
            }
          });
          setCachedCompanies(Array.from(companyMap.values()));
        }
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

  const handleUploadSuccess = () => {
    // Clear filter to fetch all shipments and refresh company cache
    setSelectedCompanyId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('app.title')}</h1>
              <p className="text-sm text-gray-600 mt-1">{t('app.subtitle')}</p>
            </div>
            <div className="flex items-center space-x-3">
              <LanguageSwitcher />
              <Button onClick={openUploadModal}>
                {t('header.uploadInvoices')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex items-center justify-between">
          <CompanyFilter
            companies={cachedCompanies}
            selectedCompanyId={selectedCompanyId}
            onSelect={setSelectedCompanyId}
          />

          {/* Stats */}
          {!isLoading && (
            <div className="text-sm text-gray-600">
              {t('dashboard.showingShipments', { count: shipments.length })}
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
