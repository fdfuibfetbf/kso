import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/utils/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const records = parseInt(searchParams.get('records') || '10');
    const pageNo = parseInt(searchParams.get('pageNo') || '1');
    const colName = searchParams.get('colName') || 'id';
    const sort = searchParams.get('sort') || 'desc';
    const item_id = searchParams.get('item_id');
    const store_id = searchParams.get('store_id');
    const store_type_id = searchParams.get('store_type_id');
    const category_id = searchParams.get('category_id');
    const sub_category_id = searchParams.get('sub_category_id');
    const part_model_id = searchParams.get('part_model_id');

    const limit = records;
    const page = pageNo;
    const offset = (page - 1) * limit;

    // Build filters based on existing Part model structure
    const where: any = {};
    
    if (item_id) where.id = item_id;
    if (category_id) where.mainCategory = { contains: category_id };
    if (sub_category_id) where.subCategory = { contains: sub_category_id };
    if (part_model_id) where.id = part_model_id;

    // Get total count
    const total = await prisma.part.count({ where });

    // Get paginated data with stock information
    const parts = await prisma.part.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: {
        [colName]: sort as 'asc' | 'desc'
      },
      include: {
        stock: true,
        models: true
      }
    });

    // Format response to match expected structure from documentation
    const formattedData = parts.map((part) => ({
      id: part.id,
      quantity: part.stock?.quantity || 0,
      item: {
        id: part.id,
        machine_part_oem_part: {
          oem_part_number: {
            number1: part.partNo,
            number2: part.masterPartNo || ''
          },
          machine_part: {
            name: part.description || part.partNo,
            unit: {
              name: part.uom || 'Piece'
            }
          }
        },
        brand: {
          name: part.brand || 'Generic'
        },
        machine_model: {
          name: part.models?.[0]?.modelNo || 'Universal'
        }
      },
      store: {
        name: part.stock?.store || 'Main Store',
        store_type: {
          name: 'Warehouse'
        }
      },
      racks: {
        rack_number: part.stock?.racks || part.rackNo || 'R001'
      },
      shelves: {
        shelf_number: part.stock?.shelf || 'S001'
      }
    }));

    const response = {
      itemsInventory: {
        data: formattedData,
        from: offset + 1,
        to: Math.min(offset + limit, total),
        total,
        current_page: page,
        per_page: limit
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory items' }, { status: 500 });
  }
}