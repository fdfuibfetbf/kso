import { PrismaClient } from '@prisma/client';
import path from 'path';

// Use frontend database
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${path.resolve(process.cwd(), 'prisma', 'dev.db').replace(/\\/g, '/')}`
    }
  }
});

// Sample parts data - same as backend
const partsData = [
  {
    partNo: 'AF-001-2024',
    masterPartNo: 'MP-AF-001',
    brand: 'Mann Filter',
    description: 'Air Filter Element - Premium Quality',
    mainCategory: 'Engine Parts',
    subCategory: 'Filters',
    application: 'Universal Application',
    hsCode: '8421.23.00',
    uom: 'PCS',
    weight: 0.5,
    reOrderLevel: 50,
    cost: 15.00,
    priceA: 22.50,
    priceB: 19.50,
    priceM: 18.00,
    rackNo: 'A-01-01',
    origin: 'Germany',
    grade: 'A',
    status: 'A',
    smc: 'SMC-AF-001',
    size: 'Standard',
    remarks: 'High quality air filter element',
    stockQuantity: 85
  },
  {
    partNo: 'TB-002-2024',
    masterPartNo: 'MP-TB-002',
    brand: 'Gates',
    description: 'Timing Belt - Multi-Rib',
    mainCategory: 'Engine Parts',
    subCategory: 'Belts',
    application: 'Universal Application',
    hsCode: '4010.39.00',
    uom: 'PCS',
    weight: 0.8,
    reOrderLevel: 30,
    cost: 35.00,
    priceA: 52.50,
    priceB: 45.50,
    priceM: 42.00,
    rackNo: 'A-02-01',
    origin: 'USA',
    grade: 'A',
    status: 'A',
    smc: 'SMC-TB-002',
    size: 'Standard',
    remarks: 'High-quality timing belt',
    stockQuantity: 72
  },
  {
    partNo: 'WP-003-2024',
    masterPartNo: 'MP-WP-003',
    brand: 'Fel-Pro',
    description: 'Water Pump Gasket - Premium',
    mainCategory: 'Cooling System',
    subCategory: 'Gaskets',
    application: 'Universal Application',
    hsCode: '8481.80.90',
    uom: 'PCS',
    weight: 0.1,
    reOrderLevel: 40,
    cost: 8.50,
    priceA: 12.75,
    priceB: 11.00,
    priceM: 10.00,
    rackNo: 'B-01-01',
    origin: 'USA',
    grade: 'A',
    status: 'A',
    smc: 'SMC-WP-003',
    size: 'Standard',
    remarks: 'Premium water pump gasket',
    stockQuantity: 95
  },
  {
    partNo: 'RC-004-2024',
    masterPartNo: 'MP-RC-004',
    brand: 'Stant',
    description: 'Radiator Cap - 16 PSI',
    mainCategory: 'Cooling System',
    subCategory: 'Caps',
    application: 'Universal Application',
    hsCode: '8481.80.90',
    uom: 'PCS',
    weight: 0.2,
    reOrderLevel: 60,
    cost: 6.00,
    priceA: 9.00,
    priceB: 7.50,
    priceM: 7.00,
    rackNo: 'B-02-01',
    origin: 'USA',
    grade: 'A',
    status: 'A',
    smc: 'SMC-RC-004',
    size: '16 PSI',
    remarks: 'Standard radiator cap',
    stockQuantity: 120
  },
  {
    partNo: 'CT-005-2024',
    masterPartNo: 'MP-CT-005',
    brand: 'Standard Motor',
    description: 'Coolant Temperature Sensor',
    mainCategory: 'Cooling System',
    subCategory: 'Sensors',
    application: 'Universal Application',
    hsCode: '9026.10.00',
    uom: 'PCS',
    weight: 0.15,
    reOrderLevel: 35,
    cost: 22.00,
    priceA: 33.00,
    priceB: 28.50,
    priceM: 26.00,
    rackNo: 'C-01-01',
    origin: 'USA',
    grade: 'A',
    status: 'A',
    smc: 'SMC-CT-005',
    size: 'Standard',
    remarks: 'Precision coolant temperature sensor',
    stockQuantity: 68
  },
];

// Generate 87 more parts
const generateMoreParts = () => {
  const brands = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes', 'Audi', 'Nissan', 'Hyundai', 'Mazda', 'Subaru', 'Volkswagen', 'Kia', 'Lexus', 'ACDelco'];
  const categories = ['Engine Parts', 'Brake System', 'Cooling System', 'Electrical', 'Suspension', 'Exhaust System', 'Transmission', 'Fuel System', 'Body Parts', 'Interior'];
  const subCategories = ['Filters', 'Belts', 'Gaskets', 'Sensors', 'Valves', 'Pumps', 'Hoses', 'Cables', 'Switches', 'Relays', 'Fuses', 'Bulbs', 'Pads', 'Rotors', 'Calipers'];
  const origins = ['USA', 'Japan', 'Germany', 'China', 'South Korea', 'India', 'Mexico'];
  const partTypes = ['Filter', 'Belt', 'Gasket', 'Sensor', 'Valve', 'Pump', 'Hose', 'Cable', 'Switch', 'Relay', 'Fuse', 'Bulb', 'Pad', 'Rotor', 'Caliper', 'Bearing', 'Seal', 'Ring', 'Clip', 'Bolt'];

  const parts = [];
  for (let i = 6; i <= 92; i++) {
    const partType = partTypes[Math.floor(Math.random() * partTypes.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const subCategory = subCategories[Math.floor(Math.random() * subCategories.length)];
    const origin = origins[Math.floor(Math.random() * origins.length)];
    
    const partNo = `PART-${String(i + 100).padStart(3, '0')}-2024`;
    const masterPartNo = `MP-${String(i + 100).padStart(3, '0')}`;
    
    const baseCost = Math.random() * 200 + 10;
    const cost = Math.round(baseCost * 100) / 100;
    const priceA = Math.round(cost * 1.5 * 100) / 100;
    const priceB = Math.round(cost * 1.3 * 100) / 100;
    const priceM = Math.round(cost * 1.2 * 100) / 100;
    
    const stockQuantity = Math.floor(Math.random() * 200) + 10;
    const reOrderLevel = Math.floor(stockQuantity * 0.3);
    
    const rackLetter = String.fromCharCode(65 + (i % 10));
    const rackNum = Math.floor(i / 10) + 1;
    const shelfNum = (i % 4) + 1;
    const rackNo = `${rackLetter}-${String(rackNum).padStart(2, '0')}-${String(shelfNum).padStart(2, '0')}`;
    
    parts.push({
      partNo,
      masterPartNo,
      brand,
      description: `${brand} ${partType} - ${subCategory} - Premium Quality`,
      mainCategory: category,
      subCategory,
      application: `Universal Application - ${brand} Compatible`,
      hsCode: `${Math.floor(Math.random() * 9000) + 1000}.${Math.floor(Math.random() * 100)}.${Math.floor(Math.random() * 100)}`,
      uom: ['PCS', 'SET', 'LTR', 'KG'][Math.floor(Math.random() * 4)],
      weight: Math.round((Math.random() * 10 + 0.1) * 100) / 100,
      reOrderLevel,
      cost,
      priceA,
      priceB,
      priceM,
      rackNo,
      origin,
      grade: 'A',
      status: 'A',
      smc: `SMC-${String(i + 100).padStart(3, '0')}`,
      size: ['Standard', 'Large', 'Small', 'Medium'][Math.floor(Math.random() * 4)],
      remarks: `High quality ${partType.toLowerCase()} for ${brand} vehicles. Premium grade A quality.`,
      stockQuantity
    });
  }
  return parts;
};

async function addPartsToFrontend() {
  console.log('🌱 Adding parts to frontend database...\n');

  try {
    const allParts = [...partsData, ...generateMoreParts()];
    const createdParts = [];
    const skippedParts = [];

    for (const partData of allParts) {
      const { stockQuantity, ...partFields } = partData;

      // Check if part already exists
      const existingPart = await prisma.part.findUnique({
        where: { partNo: partData.partNo }
      });

      if (existingPart) {
        skippedParts.push(partData.partNo);
        continue;
      }

      // Create the part
      const part = await prisma.part.create({
        data: partFields
      });

      // Create stock entry
      await prisma.stock.create({
        data: {
          partId: part.id,
          quantity: stockQuantity,
          location: `Warehouse ${partData.rackNo.split('-')[0]}`
        }
      });

      createdParts.push(part);
      if (createdParts.length % 10 === 0) {
        console.log(`   ✓ Created ${createdParts.length} parts...`);
      }
    }

    console.log(`\n✅ Successfully added ${createdParts.length} parts to frontend database!`);
    if (skippedParts.length > 0) {
      console.log(`   ⚠️  Skipped ${skippedParts.length} parts (already exist)`);
    }
    console.log(`\n📋 Summary:`);
    console.log(`   - Parts Created: ${createdParts.length}`);
    console.log(`   - Total Parts in Frontend Database: ${await prisma.part.count()}`);

  } catch (error) {
    console.error('❌ Error adding parts:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
if (require.main === module) {
  addPartsToFrontend()
    .then(() => {
      console.log('\n✅ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error);
      process.exit(1);
    });
}

export { addPartsToFrontend };

