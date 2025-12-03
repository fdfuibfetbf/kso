import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { verifyToken } from '@/lib/middleware/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const make = await prisma.make.findUnique({
      where: { id: params.id },
    });

    if (!make) {
      return NextResponse.json({ error: 'Make not found' }, { status: 404 });
    }

    return NextResponse.json({ make });
  } catch (error: any) {
    console.error('Make fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch make', message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const existing = await prisma.make.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Make not found' }, { status: 404 });
    }

    // Check for duplicate name
    if (body.name && body.name !== existing.name) {
      const duplicate = await prisma.make.findFirst({
        where: {
          name: { equals: body.name, mode: 'insensitive' },
          id: { not: params.id },
        },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: 'Make name already exists' },
          { status: 400 }
        );
      }
    }

    const make = await prisma.make.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json({ make });
  } catch (error: any) {
    console.error('Make update error:', error);
    return NextResponse.json(
      { error: 'Failed to update make', message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const make = await prisma.make.findUnique({
      where: { id: params.id },
    });

    if (!make) {
      return NextResponse.json({ error: 'Make not found' }, { status: 404 });
    }

    await prisma.make.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Make deleted successfully' });
  } catch (error: any) {
    console.error('Make delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete make', message: error.message },
      { status: 500 }
    );
  }
}

