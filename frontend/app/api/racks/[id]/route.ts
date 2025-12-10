import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { verifyToken } from '@/lib/middleware/auth';

// GET - Get a single rack
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rack = await prisma.rack.findUnique({
      where: { id: params.id },
      include: {
        store: {
          include: {
            storeType: true,
          },
        },
        shelves: true,
        _count: {
          select: { shelves: true },
        },
      },
    });

    if (!rack) {
      return NextResponse.json({ error: 'Rack not found' }, { status: 404 });
    }

    return NextResponse.json({ rack });
  } catch (error: any) {
    console.error('Rack fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rack', message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update a rack
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
    const { rackNumber, storeId, description, status } = body;

    // Check if rack exists
    const existing = await prisma.rack.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Rack not found' }, { status: 404 });
    }

    // Check for duplicate if rackNumber or storeId is being changed
    if (rackNumber || storeId) {
      const newRackNumber = rackNumber || existing.rackNumber;
      const newStoreId = storeId || existing.storeId;

      const duplicate = await prisma.rack.findFirst({
        where: {
          rackNumber: newRackNumber,
          storeId: newStoreId,
          id: { not: params.id },
        },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: `Rack number "${newRackNumber}" already exists in this store` },
          { status: 400 }
        );
      }
    }

    // Verify store exists if storeId is being updated
    if (storeId) {
      const store = await prisma.store.findUnique({
        where: { id: storeId },
      });

      if (!store) {
        return NextResponse.json({ error: 'Store not found' }, { status: 404 });
      }
    }

    const rack = await prisma.rack.update({
      where: { id: params.id },
      data: {
        rackNumber: rackNumber || undefined,
        storeId: storeId || undefined,
        description: description !== undefined ? (description || null) : undefined,
        status: status || undefined,
      },
      include: {
        store: {
          include: {
            storeType: true,
          },
        },
      },
    });

    return NextResponse.json({ rack });
  } catch (error: any) {
    console.error('Rack update error:', error);
    return NextResponse.json(
      { error: 'Failed to update rack', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a rack
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if rack exists
    const rack = await prisma.rack.findUnique({
      where: { id: params.id },
    });

    if (!rack) {
      return NextResponse.json({ error: 'Rack not found' }, { status: 404 });
    }

    // Use transaction to delete everything in order
    await prisma.$transaction(async (tx) => {
      // First, delete all item inventories that reference this rack
      await tx.itemInventory.deleteMany({
        where: { rackId: params.id },
      });

      // Then delete the rack - shelves will cascade delete automatically
      await tx.rack.delete({
        where: { id: params.id },
      });
    });

    return NextResponse.json({ message: 'Rack deleted successfully' });
  } catch (error: any) {
    console.error('Rack delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete rack', message: error.message },
      { status: 500 }
    );
  }
}
