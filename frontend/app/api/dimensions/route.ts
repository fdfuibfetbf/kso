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
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [dimensions, total] = await Promise.all([
      prisma.dimension.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.dimension.count({ where }),
    ]);

    return NextResponse.json({
      dimensions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Dimensions fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dimensions', message: error.message },
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
    
    if (!body.name) {
      return NextResponse.json(
        { error: 'Dimension name is required' },
        { status: 400 }
      );
    }

    // Store name in uppercase for consistency
    const normalizedName = body.name.toUpperCase().trim();
    
    // Check if dimension name already exists
    const existing = await prisma.dimension.findUnique({
      where: { name: normalizedName },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Dimension name already exists' },
        { status: 400 }
      );
    }

    const dimension = await prisma.dimension.create({
      data: {
        name: normalizedName,
        description: body.description || null,
      },
    });

    return NextResponse.json({ dimension }, { status: 201 });
  } catch (error: any) {
    console.error('Dimension creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create dimension', message: error.message },
      { status: 500 }
    );
  }
}

