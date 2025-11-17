// Utility functions for the application

import { InvoiceArraySchema, type InvoiceInput } from './validations';
import type { ParsedInvoice } from '@/types';

/**
 * Parse JSON file to array of invoices
 */
export async function parseInvoiceFile(file: File): Promise<InvoiceInput[]> {
  const text = await file.text();
  const json = JSON.parse(text);
  return InvoiceArraySchema.parse(json);
}

/**
 * Transform input to parsed invoice (already validated)
 */
export function transformToInvoice(input: InvoiceInput): ParsedInvoice {
  return input;
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format price with currency
 */
export function formatPrice(price: number): string {
  return `${price.toFixed(2)} Kč`;
}

/**
 * Format weight with unit
 */
export function formatWeight(weight: number): string {
  return `${weight.toFixed(2)} kg`;
}

/**
 * Get country flag emoji from country code
 */
export function getCountryFlag(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
