import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/utils/prisma';
import { verifyToken } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const search = searchParams.get('search');

    const where: any = {};
    if (search) {
      where.name = { contains: search };
    }

    const [makes, total] = await Promise.all([
      prisma.make.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.make.count({ where }),
    ]);

    return NextResponse.json({
      makes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Makes fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch makes', message: error.message },
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
    
    // Check if make name already exists
    const existing = await prisma.make.findFirst({
      where: { name: { equals: body.name, mode: 'insensitive' } },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Make name already exists' },
        { status: 400 }
      );
    }

    const make = await prisma.make.create({
      data: {
        name: body.name,
      },
    });

    return NextResponse.json({ make }, { status: 201 });
  } catch (error: any) {
    console.error('Make creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create make', message: error.message },
      { status: 500 }
    );
  }
}

