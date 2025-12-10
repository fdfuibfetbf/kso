import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { verifyToken } from '@/lib/middleware/auth';

// GET - Get a single category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const category = await prisma.category.findUnique({
      where: { id: params.id },
      include: {
        parent: true,
        subcategories: true,
      },
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error: any) {
    console.error('Category fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category', message: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update a category
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
    const { name, type, parentId, description, status } = body;

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        type: type || 'main',
        parentId: parentId || null,
        description,
        status: status || 'A',
      },
    });

    return NextResponse.json({ category });
  } catch (error: any) {
    console.error('Category update error:', error);
    return NextResponse.json(
      { error: 'Failed to update category', message: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Delete a category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.category.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    console.error('Category delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete category', message: error.message },
      { status: 500 }
    );
  }
}
