import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Generate 50 more diverse parts
const generateParts = () => {
  const brands = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'BMW', 'Mercedes', 'Audi', 'Nissan', 'Hyundai', 'Mazda', 'Subaru', 'Volkswagen', 'Kia', 'Lexus', 'Acura'];
  const categories = ['Engine Parts', 'Brake System', 'Cooling System', 'Electrical', 'Suspension', 'Exhaust System', 'Transmission', 'Fuel System', 'Body Parts', 'Interior'];
  const subCategories = ['Filters', 'Belts', 'Gaskets', 'Sensors', 'Valves', 'Pumps', 'Hoses', 'Cables', 'Switches', 'Relays', 'Fuses', 'Bulbs', 'Pads', 'Rotors', 'Calipers'];
  const origins = ['USA', 'Japan', 'Germany', 'China', 'South Korea', 'India', 'Mexico'];
  const grades = ['A', 'B', 'C'];
  const statuses = ['A', 'A', 'A', 'A', 'N']; // Mostly active
  
  const parts = [];
  const partTypes = [
    'Filter', 'Belt', 'Gasket', 'Sensor', 'Valve', 'Pump', 'Hose', 'Cable', 
    'Switch', 'Relay', 'Fuse', 'Bulb', 'Pad', 'Rotor', 'Caliper', 'Bearing',
    'Seal', 'Ring', 'Clip', 'Bolt', 'Nut', 'Washer', 'Bracket', 'Mount',
    'Bushing', 'Link', 'Arm', 'Shock', 'Strut', 'Spring', 'Tie Rod', 'Ball Joint'
  ];

  for (let i = 1; i <= 50; i++) {
    const partType = partTypes[Math.floor(Math.random() * partTypes.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    const subCategory = subCategories[Math.floor(Math.random() * subCategories.length)];
    const origin = origins[Math.floor(Math.random() * origins.length)];
    const grade = grades[Math.floor(Math.random() * grades.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const partNo = `PART-${String(i + 100).padStart(3, '0')}-2024`;
    const masterPartNo = `MP-${String(i + 100).padStart(3, '0')}`;
    
    const baseCost = Math.random() * 200 + 10; // $10-$210
    const cost = Math.round(baseCost * 100) / 100;
    const priceA = Math.round(cost * 1.5 * 100) / 100;
    const priceB = Math.round(cost * 1.3 * 100) / 100;
    const priceM = Math.round(cost * 1.2 * 100) / 100;
    
    const stockQuantity = Math.floor(Math.random() * 200) + 10; // 10-210 units
    const reOrderLevel = Math.floor(stockQuantity * 0.3);
    
    const rackLetter = String.fromCharCode(65 + (i % 10)); // A-J
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
      grade,
      status,
      smc: `SMC-${String(i + 100).padStart(3, '0')}`,
      size: ['Standard', 'Large', 'Small', 'Medium'][Math.floor(Math.random() * 4)],
      remarks: `High quality ${partType.toLowerCase()} for ${brand} vehicles. Premium grade ${grade} quality.`,
      stockQuantity
    });
  }
  
  return parts;
};

async function add50MoreParts() {
  console.log('🌱 Adding 50 more parts to Parts List...\n');

  try {
    const partsData = generateParts();
    const createdParts = [];
    const skippedParts = [];

    for (const partData of partsData) {
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
      console.log(`   ✓ ${part.partNo} - ${part.description.substring(0, 50)}...`);
    }

    console.log(`\n✅ Successfully added ${createdParts.length} parts to Parts List!`);
    if (skippedParts.length > 0) {
      console.log(`   ⚠️  Skipped ${skippedParts.length} parts (already exist)`);
    }
    console.log(`\n📋 Summary:`);
    console.log(`   - Parts Created: ${createdParts.length}`);
    console.log(`   - Total Parts in Database: ${await prisma.part.count()}`);

  } catch (error) {
    console.error('❌ Error adding parts:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
if (require.main === module) {
  add50MoreParts()
    .then(() => {
      console.log('\n✅ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error);
      process.exit(1);
    });
}

export { add50MoreParts };

