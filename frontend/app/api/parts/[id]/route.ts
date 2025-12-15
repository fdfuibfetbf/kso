import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/middleware/auth';

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET - Get a single part by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const backendUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/parts/${params.id}`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        Authorization: request.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Part fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch part', message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update a part
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  let body: any;
  try {
    // Read body first
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const backendUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/parts/${params.id}`;

    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers: {
        Authorization: request.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Part update error:', error);
    return NextResponse.json(
      { error: 'Failed to update part', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a part
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const backendUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/parts/${params.id}`;

    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        Authorization: request.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Part deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete part', message: error.message },
      { status: 500 }
    );
  }
}
