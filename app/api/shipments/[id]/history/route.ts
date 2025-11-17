// GET /api/shipments/[id]/history
// Fetch all invoice records for a specific shipment

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const invoices = await prisma.invoice.findMany({
      where: {
        shipmentId: id,
      },
      select: {
        id: true,
        invoicedPrice: true,
        invoicedWeight: true,
        uploadedAt: true,
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });

    const transformedInvoices = invoices.map((invoice) => ({
      id: invoice.id,
      invoicedPrice: invoice.invoicedPrice,
      invoicedWeight: invoice.invoicedWeight,
      uploadedAt: invoice.uploadedAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: transformedInvoices,
    });
  } catch (error) {
    console.error('Invoice history fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoice history' },
      { status: 500 }
    );
  }
}
