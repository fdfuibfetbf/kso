import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const type = params.type;
    if (!type || !['purchase', 'direct'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid type. Must be "purchase" or "direct"' },
        { status: 400 }
      );
    }

    const backendUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/purchase-orders/next-po-number/${type}`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: request.headers.get('Authorization') || '',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Next PO number fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch next PO number', 
        message: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

