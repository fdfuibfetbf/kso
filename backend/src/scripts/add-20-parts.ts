import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample parts data
const partsData = [
  { name: 'Air Filter Element', oem1: 'AF001', oem2: 'FIL-001', brand: 'Mann Filter', model: 'Camry 2020', unit: 'Piece' },
  { name: 'Timing Belt', oem1: 'TB002', oem2: 'BEL-002', brand: 'Gates', model: 'Accord 2019', unit: 'Piece' },
  { name: 'Water Pump Gasket', oem1: 'WP003', oem2: 'GAS-003', brand: 'Fel-Pro', model: 'F-150 2021', unit: 'Piece' },
  { name: 'Radiator Cap', oem1: 'RC004', oem2: 'CAP-004', brand: 'Stant', model: 'Universal', unit: 'Piece' },
  { name: 'Coolant Temperature Sensor', oem1: 'CT005', oem2: 'SEN-005', brand: 'Standard Motor', model: 'Camry 2020', unit: 'Piece' },
  { name: 'Ignition Coil', oem1: 'IC006', oem2: 'COI-006', brand: 'Delphi', model: 'Accord 2019', unit: 'Piece' },
  { name: 'Fuel Pump', oem1: 'FP007', oem2: 'PUM-007', brand: 'Bosch', model: 'F-150 2021', unit: 'Piece' },
  { name: 'Mass Air Flow Sensor', oem1: 'MA008', oem2: 'SEN-008', brand: 'Denso', model: 'Universal', unit: 'Piece' },
  { name: 'Throttle Position Sensor', oem1: 'TP009', oem2: 'SEN-009', brand: 'Standard Motor', model: 'Camry 2020', unit: 'Piece' },
  { name: 'Camshaft Position Sensor', oem1: 'CP010', oem2: 'SEN-010', brand: 'Delphi', model: 'Accord 2019', unit: 'Piece' },
  { name: 'Crankshaft Position Sensor', oem1: 'CR011', oem2: 'SEN-011', brand: 'Standard Motor', model: 'F-150 2021', unit: 'Piece' },
  { name: 'Idle Air Control Valve', oem1: 'IA012', oem2: 'VAL-012', brand: 'ACDelco', model: 'Universal', unit: 'Piece' },
  { name: 'EGR Valve', oem1: 'EG013', oem2: 'VAL-013', brand: 'Standard Motor', model: 'Camry 2020', unit: 'Piece' },
  { name: 'PCV Valve', oem1: 'PC014', oem2: 'VAL-014', brand: 'ACDelco', model: 'Accord 2019', unit: 'Piece' },
  { name: 'Oil Pressure Sensor', oem1: 'OP015', oem2: 'SEN-015', brand: 'Standard Motor', model: 'F-150 2021', unit: 'Piece' },
  { name: 'Knock Sensor', oem1: 'KN016', oem2: 'SEN-016', brand: 'Delphi', model: 'Universal', unit: 'Piece' },
  { name: 'MAP Sensor', oem1: 'MP017', oem2: 'SEN-017', brand: 'Standard Motor', model: 'Camry 2020', unit: 'Piece' },
  { name: 'Intake Manifold Gasket', oem1: 'IM018', oem2: 'GAS-018', brand: 'Fel-Pro', model: 'Accord 2019', unit: 'Piece' },
  { name: 'Exhaust Manifold Gasket', oem1: 'EM019', oem2: 'GAS-019', brand: 'Fel-Pro', model: 'F-150 2021', unit: 'Piece' },
  { name: 'Valve Cover Gasket', oem1: 'VC020', oem2: 'GAS-020', brand: 'Fel-Pro', model: 'Universal', unit: 'Piece' },
];

async function add20Parts() {
  console.log('🌱 Adding 20 parts items to Parts Management System...\n');

  try {
    // 1. Get or create necessary dependencies
    console.log('📋 Setting up dependencies...');
    
    // Get or create Units
    const unitPiece = await prisma.unit.upsert({
      where: { name: 'Piece' },
      update: {},
      create: { name: 'Piece', shortName: 'Pcs' }
    });

    // Get or create Brands
    const brandNames = ['Mann Filter', 'Gates', 'Fel-Pro', 'Stant', 'Standard Motor', 'Delphi', 'Bosch', 'Denso', 'ACDelco'];
    const brands = await Promise.all(
      brandNames.map(name =>
        prisma.brand.upsert({
          where: { name },
          update: {},
          create: { name }
        })
      )
    );
    const brandMap = new Map(brands.map(b => [b.name, b]));

    // Get or create Machine Models
    const modelNames = ['Camry 2020', 'Accord 2019', 'F-150 2021', 'Universal'];
    const machineModels = await Promise.all(
      modelNames.map(name =>
        prisma.machineModel.upsert({
          where: { name },
          update: {},
          create: { name }
        })
      )
    );
    const modelMap = new Map(machineModels.map(m => [m.name, m]));

    // Get or create Store Type and Stores
    let stores = await prisma.store.findMany({ take: 2 });
    if (stores.length === 0) {
      console.log('   Creating store type and stores...');
      const storeType = await prisma.storeType.upsert({
        where: { name: 'Warehouse' },
        update: {},
        create: { name: 'Warehouse' }
      });
      
      const mainStore = await prisma.store.upsert({
        where: { id: 'main-warehouse' },
        update: {},
        create: {
          id: 'main-warehouse',
          name: 'Main Warehouse',
          storeTypeId: storeType.id,
          description: 'Primary storage facility'
        }
      });
      stores = [mainStore];
    }

    // Get or create Racks and Shelves
    let racks = await prisma.rack.findMany({ where: { storeId: stores[0].id }, take: 2 });
    if (racks.length === 0) {
      console.log('   Creating racks...');
      const rack1 = await prisma.rack.upsert({
        where: {
          rackNumber_storeId: {
            rackNumber: 'R001',
            storeId: stores[0].id
          }
        },
        update: {},
        create: {
          rackNumber: 'R001',
          storeId: stores[0].id,
          description: 'Rack 1'
        }
      });
      racks = [rack1];
    }

    let shelves = await prisma.shelf.findMany({ where: { rackId: racks[0].id }, take: 1 });
    if (shelves.length === 0) {
      console.log('   Creating shelves...');
      const shelf1 = await prisma.shelf.upsert({
        where: {
          shelfNumber_rackId: {
            shelfNumber: 'S001',
            rackId: racks[0].id
          }
        },
        update: {},
        create: {
          shelfNumber: 'S001',
          rackId: racks[0].id,
          description: 'Shelf 1'
        }
      });
      shelves = [shelf1];
    }

    console.log('✅ Dependencies ready\n');

    // 2. Create Machine Parts
    console.log('🔧 Creating machine parts...');
    const machineParts = [];
    for (const partData of partsData) {
      const machinePart = await prisma.machinePart.upsert({
        where: { name: partData.name },
        update: {},
        create: {
          name: partData.name,
          unitId: unitPiece.id
        }
      });
      machineParts.push(machinePart);
      console.log(`   ✓ ${partData.name}`);
    }
    console.log(`✅ Created ${machineParts.length} machine parts\n`);

    // 3. Create OEM Part Numbers
    console.log('🏷️  Creating OEM part numbers...');
    const oemPartNumbers = [];
    for (const partData of partsData) {
      const oemPartNumber = await prisma.oemPartNumber.upsert({
        where: {
          number1_number2: {
            number1: partData.oem1,
            number2: partData.oem2
          }
        },
        update: {},
        create: {
          number1: partData.oem1,
          number2: partData.oem2
        }
      });
      oemPartNumbers.push(oemPartNumber);
      console.log(`   ✓ ${partData.oem1}/${partData.oem2}`);
    }
    console.log(`✅ Created ${oemPartNumbers.length} OEM part numbers\n`);

    // 4. Create Machine Part OEM Part relationships
    console.log('🔗 Linking machine parts with OEM numbers...');
    const machinePartOemParts = [];
    for (let i = 0; i < partsData.length; i++) {
      const machinePartOemPart = await prisma.machinePartOemPart.upsert({
        where: {
          machinePartId_oemPartNumberId: {
            machinePartId: machineParts[i].id,
            oemPartNumberId: oemPartNumbers[i].id
          }
        },
        update: {},
        create: {
          machinePartId: machineParts[i].id,
          oemPartNumberId: oemPartNumbers[i].id
        }
      });
      machinePartOemParts.push(machinePartOemPart);
      console.log(`   ✓ Linked ${partsData[i].name} with ${partsData[i].oem1}`);
    }
    console.log(`✅ Created ${machinePartOemParts.length} relationships\n`);

    // 5. Create Items
    console.log('📦 Creating items...');
    const items = [];
    for (let i = 0; i < partsData.length; i++) {
      const partData = partsData[i];
      const brand = brandMap.get(partData.brand) || brands[0];
      const model = modelMap.get(partData.model) || machineModels[0];

      const item = await prisma.item.upsert({
        where: { id: `item-${partData.oem1.toLowerCase()}` },
        update: {},
        create: {
          id: `item-${partData.oem1.toLowerCase()}`,
          machinePartOemPartId: machinePartOemParts[i].id,
          brandId: brand.id,
          machineModelId: model.id,
          typeId: 1 // Part (not kit)
        }
      });
      items.push(item);
      console.log(`   ✓ ${partData.name} (${partData.brand} - ${partData.model})`);
    }
    console.log(`✅ Created ${items.length} items\n`);

    // 6. Create Item Inventory
    console.log('📊 Creating inventory records...');
    const inventoryRecords = [];
    for (const item of items) {
      const quantity = Math.floor(Math.random() * 100) + 10; // Random quantity 10-110
      
      const inventory = await prisma.itemInventory.upsert({
        where: {
          itemId_storeId_rackId_shelfId: {
            itemId: item.id,
            storeId: stores[0].id,
            rackId: racks[0].id,
            shelfId: shelves[0].id
          }
        },
        update: {
          quantity
        },
        create: {
          itemId: item.id,
          storeId: stores[0].id,
          rackId: racks[0].id,
          shelfId: shelves[0].id,
          quantity
        }
      });
      inventoryRecords.push(inventory);
      console.log(`   ✓ Inventory: ${quantity} units`);
    }
    console.log(`✅ Created ${inventoryRecords.length} inventory records\n`);

    console.log('✨ Successfully added 20 parts items!');
    console.log('\n📋 Summary:');
    console.log(`   - Machine Parts: ${machineParts.length}`);
    console.log(`   - OEM Part Numbers: ${oemPartNumbers.length}`);
    console.log(`   - Machine Part OEM Part Links: ${machinePartOemParts.length}`);
    console.log(`   - Items: ${items.length}`);
    console.log(`   - Inventory Records: ${inventoryRecords.length}`);

  } catch (error) {
    console.error('❌ Error adding parts:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
if (require.main === module) {
  add20Parts()
    .then(() => {
      console.log('\n✅ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error);
      process.exit(1);
    });
}

export { add20Parts };

