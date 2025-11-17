// POST /api/invoices/upload
// Parse and validate JSON file without saving to DB

import { NextRequest, NextResponse } from 'next/server';
import { parseInvoiceFile, transformToInvoice } from '@/lib/utils';
import { ZodError } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!file.name.endsWith('.json')) {
      return NextResponse.json(
        { success: false, error: 'File must be a JSON file' },
        { status: 400 }
      );
    }

    // Parse and validate the file
    const invoices = await parseInvoiceFile(file);

    // Transform to parsed invoices
    const parsedInvoices = invoices.map(transformToInvoice);

    return NextResponse.json({
      success: true,
      data: parsedInvoices,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: `Validation error: ${error.errors.map((e) => e.message).join(', ')}`,
        },
        { status: 400 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON file' },
        { status: 400 }
      );
    }

    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process file' },
      { status: 500 }
    );
  }
}
