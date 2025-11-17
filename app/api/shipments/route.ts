// GET /api/shipments
// Fetch all shipments with latest invoice data

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get('companyId');

    // Build query with optional company filter
    const where = companyId ? { companyId } : {};

    const shipments = await prisma.shipment.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        latestInvoice: {
          select: {
            id: true,
            invoicedPrice: true,
            invoicedWeight: true,
            uploadedAt: true,
          },
        },
      },
      orderBy: {
        createdDate: 'desc',
      },
    });

    // Transform to match expected format
    const transformedShipments = shipments.map((shipment) => ({
      id: shipment.id,
      trackingNumber: shipment.trackingNumber,
      provider: shipment.provider,
      mode: shipment.mode,
      originCountry: shipment.originCountry,
      destinationCountry: shipment.destinationCountry,
      createdDate: shipment.createdDate.toISOString(),
      company: shipment.company,
      latestInvoice: shipment.latestInvoice
        ? {
            id: shipment.latestInvoice.id,
            invoicedPrice: shipment.latestInvoice.invoicedPrice,
            invoicedWeight: shipment.latestInvoice.invoicedWeight,
            uploadedAt: shipment.latestInvoice.uploadedAt.toISOString(),
          }
        : null,
    }));

    return NextResponse.json({
      success: true,
      data: transformedShipments,
    });
  } catch (error) {
    console.error('Shipments fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch shipments' },
      { status: 500 }
    );
  }
}
