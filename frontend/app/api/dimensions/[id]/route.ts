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

    const dimension = await prisma.dimension.findUnique({
      where: { id: params.id },
    });

    if (!dimension) {
      return NextResponse.json({ error: 'Dimension not found' }, { status: 404 });
    }

    return NextResponse.json({ dimension });
  } catch (error: any) {
    console.error('Dimension fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dimension', message: error.message },
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
    const existing = await prisma.dimension.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Dimension not found' }, { status: 404 });
    }

    // Normalize name if provided
    const normalizedName = body.name ? body.name.toUpperCase().trim() : existing.name;
    
    // Check for duplicate name
    if (body.name && normalizedName !== existing.name) {
      const duplicate = await prisma.dimension.findUnique({
        where: { name: normalizedName },
      });

      if (duplicate && duplicate.id !== params.id) {
        return NextResponse.json(
          { error: 'Dimension name already exists' },
          { status: 400 }
        );
      }
    }

    const dimension = await prisma.dimension.update({
      where: { id: params.id },
      data: {
        name: normalizedName,
        description: body.description !== undefined ? body.description : existing.description,
      },
    });

    return NextResponse.json({ dimension });
  } catch (error: any) {
    console.error('Dimension update error:', error);
    return NextResponse.json(
      { error: 'Failed to update dimension', message: error.message },
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

    const dimension = await prisma.dimension.findUnique({
      where: { id: params.id },
    });

    if (!dimension) {
      return NextResponse.json({ error: 'Dimension not found' }, { status: 404 });
    }

    await prisma.dimension.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Dimension deleted successfully' });
  } catch (error: any) {
    console.error('Dimension delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete dimension', message: error.message },
      { status: 500 }
    );
  }
}

