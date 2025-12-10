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

    const adjustment = await prisma.inventoryAdjustment.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            part: true,
          },
        },
      },
    });

    if (!adjustment) {
      return NextResponse.json({ error: 'Inventory adjustment not found' }, { status: 404 });
    }

    return NextResponse.json({ adjustment });
  } catch (error: any) {
    console.error('Inventory adjustment fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory adjustment', message: error.message },
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

    const existing = await prisma.inventoryAdjustment.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Inventory adjustment not found' }, { status: 404 });
    }

    const body = await request.json();
    const { adjustmentNo, total, date, notes, items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Adjustment must have at least one item' },
        { status: 400 }
      );
    }

    // Calculate new quantities
    const itemsWithNewQuantity = items.map((item: any) => ({
      ...item,
      newQuantity: (item.previousQuantity || 0) + (item.adjustedQuantity || 0),
    }));

    // Update adjustment in transaction
    const adjustment = await prisma.$transaction(async (tx) => {
      // Revert previous stock changes
      for (const oldItem of existing.items) {
        if (oldItem.partId) {
          const stock = await tx.stock.findUnique({
            where: { partId: oldItem.partId },
          });
          if (stock) {
            await tx.stock.update({
              where: { partId: oldItem.partId },
              data: {
                quantity: stock.quantity - oldItem.adjustedQuantity,
              },
            });
          }
        }
      }

      // Delete old items
      await tx.inventoryAdjustmentItem.deleteMany({
        where: { adjustmentId: params.id },
      });

      // Create new adjustment with updated items
      const updated = await tx.inventoryAdjustment.update({
        where: { id: params.id },
        data: {
          adjustmentNo: adjustmentNo || null,
          total: total || 0,
          date: date ? new Date(date) : existing.date,
          notes: notes || null,
          items: {
            create: itemsWithNewQuantity.map((item: any) => ({
              partId: item.partId || null,
              partNo: item.partNo,
              description: item.description || null,
              previousQuantity: item.previousQuantity || 0,
              adjustedQuantity: item.adjustedQuantity || 0,
              newQuantity: item.newQuantity,
              reason: item.reason || null,
            })),
          },
        },
        include: {
          items: {
            include: {
              part: true,
            },
          },
        },
      });

      // Apply new stock changes
      for (const item of itemsWithNewQuantity) {
        if (item.partId) {
          const stock = await tx.stock.findUnique({
            where: { partId: item.partId },
          });
          if (stock) {
            await tx.stock.update({
              where: { partId: item.partId },
              data: {
                quantity: item.newQuantity,
              },
            });
          } else {
            await tx.stock.create({
              data: {
                partId: item.partId,
                quantity: item.newQuantity,
              },
            });
          }
        }
      }

      return updated;
    });

    return NextResponse.json({ adjustment });
  } catch (error: any) {
    console.error('Inventory adjustment update error:', error);
    return NextResponse.json(
      { error: 'Failed to update inventory adjustment', message: error.message },
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

    const existing = await prisma.inventoryAdjustment.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Inventory adjustment not found' }, { status: 404 });
    }

    // Revert stock changes in transaction
    await prisma.$transaction(async (tx) => {
      // Revert stock changes
      for (const item of existing.items) {
        if (item.partId) {
          const stock = await tx.stock.findUnique({
            where: { partId: item.partId },
          });
          if (stock) {
            await tx.stock.update({
              where: { partId: item.partId },
              data: {
                quantity: stock.quantity - item.adjustedQuantity,
              },
            });
          }
        }
      }

      // Delete adjustment (items will be deleted via cascade)
      await tx.inventoryAdjustment.delete({
        where: { id: params.id },
      });
    });

    return NextResponse.json({ message: 'Inventory adjustment deleted successfully' });
  } catch (error: any) {
    console.error('Inventory adjustment deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete inventory adjustment', message: error.message },
      { status: 500 }
    );
  }
}

