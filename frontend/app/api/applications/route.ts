import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { verifyToken } from '@/lib/middleware/auth';

// Disable caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET - Get all applications from Application table
export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: any = {};
    
    if (status && status !== 'all') {
      where.status = status;
    }
    
    if (search) {
      where.name = { contains: search };
    }

    const applications = await prisma.application.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ applications });
  } catch (error: any) {
    console.error('Applications fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications', message: error.message },
      { status: 500 }
    );
  }
}

// POST - Add a new application
export async function POST(request: NextRequest) {
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
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Application name is required' }, { status: 400 });
    }

    const trimmedName = name.trim();

    // Check if application already exists
    const existing = await prisma.application.findUnique({
      where: { name: trimmedName },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Application with this name already exists' },
        { status: 400 }
      );
    }

    // Create the application record
    const application = await prisma.application.create({
      data: {
        name: trimmedName,
        status: 'A',
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
