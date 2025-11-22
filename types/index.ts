// Shared TypeScript types for the application

export type Provider = 'GLS' | 'DPD' | 'UPS' | 'PPL' | 'FedEx';
export type Mode = 'EXPORT' | 'IMPORT';

// Company type
export interface Company {
  id: string;
  name: string;
}

// Parsed invoice data with calculated mode
export interface ParsedInvoice {
  id: string;
  shipment: {
    id: string;
    createdAt: Date;
    trackingNumber: string;
    company: Company;
    provider: Provider;
    mode: Mode;
    originCountry: string;
    destinationCountry: string;
  };
  invoicedWeight: number;
  invoicedPrice: number;
}

// Shipment with details for display
export interface ShipmentWithDetails {
  id: string;
  trackingNumber: string;
  provider: string;
  mode: string;
  originCountry: string;
  destinationCountry: string;
  createdDate: string;
  company: Company;
  latestInvoice: {
    id: string;
    invoicedPrice: number;
    invoicedWeight: number;
    uploadedAt: string;
  } | null;
}

// Invoice history entry
export interface InvoiceHistory {
  id: string;
  invoicedPrice: number;
  invoicedWeight: number;
  uploadedAt: string;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface UploadStats {
  companiesCreated: number;
  shipmentsCreated: number;
  shipmentsUpdated: number;
  invoicesCreated: number;
}
