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

    const application = await prisma.application.findUnique({
      where: { id: params.id },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ application });
  } catch (error: any) {
    console.error('Application fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application', message: error.message },
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
    const { name, status } = body;

    // Check if application exists
    const existing = await prisma.application.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // If name is being updated, check for duplicates (case-insensitive check)
    if (name && name.trim() !== existing.name) {
      const allApps = await prisma.application.findMany({
        where: { id: { not: params.id } },
        select: { name: true },
      });
      const duplicate = allApps.find(
        (app) => app.name.toLowerCase() === name.trim().toLowerCase()
      );

      if (duplicate) {
        return NextResponse.json(
          { error: 'Application with this name already exists' },
          { status: 400 }
        );
      }
    }

    const application = await prisma.application.update({
      where: { id: params.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(status && { status }),
      },
    });

    return NextResponse.json({ application });
  } catch (error: any) {
    console.error('Application update error:', error);
    return NextResponse.json(
      { error: 'Failed to update application', message: error.message },
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

    // Check if application exists
    const existing = await prisma.application.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Check if application is used in parts
    const partsCount = await prisma.part.count({
      where: {
        application: existing.name,
      },
    });

    if (partsCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete application. It is used by ${partsCount} part(s).`,
        },
        { status: 400 }
      );
    }

    await prisma.application.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Application deleted successfully' });
  } catch (error: any) {
    console.error('Application delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete application', message: error.message },
      { status: 500 }
    );
  }
}

