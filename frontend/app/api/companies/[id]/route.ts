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

    const company = await prisma.company.findUnique({
      where: { id: params.id },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ company });
  } catch (error: any) {
    console.error('Company fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company', message: error.message },
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

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id: params.id },
    });

    if (!existingCompany) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Check if name is already taken by another company
    if (body.name !== existingCompany.name) {
      const duplicateCompany = await prisma.company.findUnique({
        where: { name: body.name },
      });

      if (duplicateCompany) {
        return NextResponse.json(
          { error: 'Company with this name already exists' },
          { status: 400 }
        );
      }
    }

    const company = await prisma.company.update({
      where: { id: params.id },
      data: {
        name: body.name,
        status: body.status || 'A',
      },
    });

    return NextResponse.json({ company });
  } catch (error: any) {
    console.error('Company update error:', error);
    return NextResponse.json(
      { error: 'Failed to update company', message: error.message },
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

    // Check if company exists
    const existingCompany = await prisma.company.findUnique({
      where: { id: params.id },
    });

    if (!existingCompany) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    await prisma.company.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Company deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Company deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete company', message: error.message },
      { status: 500 }
    );
  }
}

