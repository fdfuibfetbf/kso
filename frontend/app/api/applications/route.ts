import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { verifyToken } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {};
    if (status) {
      where.status = status;
    }
    // Note: For SQLite, we'll filter after fetching if search is needed
    // This is less efficient but works with SQLite's limitations

    const skip = (page - 1) * limit;

    // For SQLite, we need to handle search differently
    let allApplications = await prisma.application.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
    });

    // Apply search filter if provided (case-insensitive)
    if (search) {
      const searchLower = search.toLowerCase();
      allApplications = allApplications.filter((app) =>
        app.name.toLowerCase().includes(searchLower)
      );
    }

    const total = allApplications.length;
    const applications = allApplications.slice(skip, skip + limit);

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Applications fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, status } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Application name is required' },
        { status: 400 }
      );
    }

    // Check if application with same name already exists (case-insensitive check)
    const allApps = await prisma.application.findMany({
      select: { name: true },
    });
    const existing = allApps.find(
      (app) => app.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (existing) {
      return NextResponse.json(
        { error: 'Application with this name already exists' },
        { status: 400 }
      );
    }

    const application = await prisma.application.create({
      data: {
        name: name.trim(),
        status: status || 'A',
      },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error: any) {
    console.error('Application creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create application', message: error.message },
      { status: 500 }
    );
  }
}

