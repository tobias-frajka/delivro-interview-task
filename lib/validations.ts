// Zod validation schemas for invoice data

import { z } from 'zod';

// Schema for validating JSON input matching the actual structure
export const InvoiceInputSchema = z.object({
  id: z.string(),
  shipment: z.object({
    id: z.string(),
    createdAt: z.string().transform(str => new Date(str)),
    trackingNumber: z.string(),
    company: z.object({
      id: z.string(),
      name: z.string(),
    }),
    provider: z.enum(['GLS', 'DPD', 'UPS', 'PPL', 'FedEx']),
    mode: z.enum(['EXPORT', 'IMPORT']),
    originCountry: z.string().length(2),
    destinationCountry: z.string().length(2),
  }),
  invoicedWeight: z.number(),
  invoicedPrice: z.number(),
});

export type InvoiceInput = z.infer<typeof InvoiceInputSchema>;

// Array schema for validating entire JSON file
export const InvoiceArraySchema = z.array(InvoiceInputSchema);
