// POST /api/invoices/confirm
// Save confirmed invoice data to database

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { ParsedInvoice, UploadStats } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const invoices: ParsedInvoice[] = body.invoices;

    if (!Array.isArray(invoices) || invoices.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No invoices provided' },
        { status: 400 }
      );
    }

    const stats: UploadStats = {
      companiesCreated: 0,
      shipmentsCreated: 0,
      shipmentsUpdated: 0,
      invoicesCreated: 0,
    };

    // Get unique companies
    const uniqueCompanies = Array.from(
      new Map(
        invoices.map((inv) => [inv.shipment.company.id, inv.shipment.company])
      ).values()
    );

    // Get existing companies and shipments upfront
    const existingCompanyIds = new Set(
      (await prisma.company.findMany({
        where: {
          id: { in: uniqueCompanies.map((c) => c.id) },
        },
        select: { id: true },
      })).map((c) => c.id)
    );

    const existingShipmentIds = new Set(
      (await prisma.shipment.findMany({
        where: {
          id: { in: invoices.map((inv) => inv.shipment.id) },
        },
        select: { id: true },
      })).map((s) => s.id)
    );

    // Process all invoices in a transaction with increased timeout
    await prisma.$transaction(
      async (tx) => {
        // Create companies that don't exist
        const newCompanies = uniqueCompanies.filter(
          (c) => !existingCompanyIds.has(c.id)
        );
        if (newCompanies.length > 0) {
          await tx.company.createMany({
            data: newCompanies.map((c) => ({
              id: c.id,
              name: c.name,
            })),
            skipDuplicates: true,
          });
          stats.companiesCreated = newCompanies.length;
        }

        // Create new shipments (without latestInvoiceId)
        const newShipments = invoices.filter(
          (inv) => !existingShipmentIds.has(inv.shipment.id)
        );
        if (newShipments.length > 0) {
          await tx.shipment.createMany({
            data: newShipments.map((inv) => ({
              id: inv.shipment.id,
              companyId: inv.shipment.company.id,
              trackingNumber: inv.shipment.trackingNumber,
              provider: inv.shipment.provider,
              mode: inv.shipment.mode,
              originCountry: inv.shipment.originCountry,
              destinationCountry: inv.shipment.destinationCountry,
              createdDate: inv.shipment.createdAt,
            })),
            skipDuplicates: true,
          });
          stats.shipmentsCreated = newShipments.length;
        }

        // Create all invoices
        await tx.invoice.createMany({
          data: invoices.map((inv) => ({
            id: inv.id,
            shipmentId: inv.shipment.id,
            invoicedWeight: inv.invoicedWeight,
            invoicedPrice: inv.invoicedPrice,
          })),
          skipDuplicates: true,
        });
        stats.invoicesCreated = invoices.length;

        // Update all shipments with their latest invoice
        for (const invoice of invoices) {
          await tx.shipment.update({
            where: { id: invoice.shipment.id },
            data: { latestInvoiceId: invoice.id },
          });
        }

        stats.shipmentsUpdated = invoices.filter((inv) =>
          existingShipmentIds.has(inv.shipment.id)
        ).length;
      },
      {
        maxWait: 10000, // 10 seconds
        timeout: 30000, // 30 seconds
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Invoices successfully uploaded',
      stats,
    });
  } catch (error) {
    console.error('Confirm error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save invoices to database' },
      { status: 500 }
    );
  }
}
