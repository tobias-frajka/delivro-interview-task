// Main dashboard page

'use client';

import React, { useEffect, useState } from 'react';
import { ShipmentGrid } from '@/components/shipments/ShipmentGrid';
import { CompanyFilter } from '@/components/shipments/CompanyFilter';
import { UploadModal } from '@/components/upload/UploadModal';
import { PriceHistoryModal } from '@/components/history/PriceHistoryModal';
import { Button } from '@/components/ui/Button';
import { useUploadStore } from '@/store/useUploadStore';
import { useHistoryStore } from '@/store/useHistoryStore';
import { useShipmentsStore } from '@/store/useShipmentsStore';
import type { ShipmentWithDetails } from '@/types';

interface Company {
  id: string;
  name: string;
}

export default function Home() {
  const [shipments, setShipments] = useState<ShipmentWithDetails[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { isUploadModalOpen, openUploadModal, closeUploadModal } = useUploadStore();
  const { isHistoryModalOpen, selectedShipmentId, openHistoryModal, closeHistoryModal } = useHistoryStore();
  const { selectedCompanyId, setSelectedCompanyId } = useShipmentsStore();

  useEffect(() => {
    fetchShipments();
  }, [selectedCompanyId]);

  const fetchShipments = async () => {
    setIsLoading(true);
    try {
      const url = selectedCompanyId
        ? `/api/shipments?companyId=${selectedCompanyId}`
        : '/api/shipments';

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setShipments(result.data);

        // Extract unique companies
        const uniqueCompanies = result.data.reduce((acc: Company[], shipment: ShipmentWithDetails) => {
          if (!acc.find((c) => c.id === shipment.company.id)) {
            acc.push(shipment.company);
          }
          return acc;
        }, []);

        setCompanies(uniqueCompanies);
      }
    } catch (error) {
      console.error('Failed to fetch shipments:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
