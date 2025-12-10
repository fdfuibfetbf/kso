import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const suppliers = [
  {
    code: 'SUP001',
    name: 'Auto Parts Distributors Inc.',
    email: 'contact@autopartsdist.com',
    phone: '+1-555-0101',
    address: '1234 Industrial Boulevard',
    city: 'Detroit',
    state: 'Michigan',
    country: 'USA',
    zipCode: '48201',
    contactPerson: 'John Smith',
    taxId: 'TAX-001-2024',
    paymentTerms: 'Net 30',
    notes: 'Primary supplier for engine parts and components',
    status: 'A',
  },
  {
    code: 'SUP002',
    name: 'Global Automotive Supplies Ltd.',
    email: 'sales@globalauto.com',
    phone: '+1-555-0102',
    address: '5678 Commerce Drive',
    city: 'Los Angeles',
    state: 'California',
    country: 'USA',
    zipCode: '90001',
    contactPerson: 'Sarah Johnson',
    taxId: 'TAX-002-2024',
    paymentTerms: 'Net 45',
    notes: 'Specializes in imported parts from Asia',
    status: 'A',
  },
  {
    code: 'SUP003',
    name: 'Premium Parts Co.',
    email: 'info@premiumparts.co',
    phone: '+1-555-0103',
    address: '9012 Manufacturing Way',
    city: 'Chicago',
    state: 'Illinois',
    country: 'USA',
    zipCode: '60601',
    contactPerson: 'Michael Brown',
    taxId: 'TAX-003-2024',
    paymentTerms: 'Net 30',
    notes: 'High-quality OEM replacement parts',
    status: 'A',
  },
  {
    code: 'SUP004',
    name: 'Fast Track Auto Parts',
    email: 'orders@fasttrackauto.com',
    phone: '+1-555-0104',
    address: '3456 Speed Avenue',
    city: 'Houston',
    state: 'Texas',
    country: 'USA',
    zipCode: '77001',
    contactPerson: 'Emily Davis',
    taxId: 'TAX-004-2024',
    paymentTerms: 'Net 15',
    notes: 'Fast delivery and competitive pricing',
    status: 'A',
  },
  {
    code: 'SUP005',
    name: 'Reliable Components LLC',
    email: 'support@reliablecomp.com',
    phone: '+1-555-0105',
    address: '7890 Quality Street',
    city: 'Phoenix',
    state: 'Arizona',
    country: 'USA',
    zipCode: '85001',
    contactPerson: 'Robert Wilson',
    taxId: 'TAX-005-2024',
    paymentTerms: 'Net 30',
    notes: 'Known for reliable delivery and customer service',
    status: 'A',
  },
  {
    code: 'SUP006',
    name: 'Elite Motor Parts',
    email: 'sales@elitemotor.com',
    phone: '+1-555-0106',
    address: '2345 Performance Road',
    city: 'Miami',
    state: 'Florida',
    country: 'USA',
    zipCode: '33101',
    contactPerson: 'Lisa Anderson',
    taxId: 'TAX-006-2024',
    paymentTerms: 'Net 30',
    notes: 'Premium performance parts and accessories',
    status: 'A',
  },
  {
    code: 'SUP007',
    name: 'Universal Auto Solutions',
    email: 'contact@universalauto.com',
    phone: '+1-555-0107',
    address: '6789 Universal Boulevard',
    city: 'Seattle',
    state: 'Washington',
    country: 'USA',
    zipCode: '98101',
    contactPerson: 'David Martinez',
    taxId: 'TAX-007-2024',
    paymentTerms: 'Net 45',
    notes: 'Wide range of universal fit parts',
    status: 'A',
  },
  {
    code: 'SUP008',
    name: 'Pro Parts Warehouse',
    email: 'info@propartswarehouse.com',
    phone: '+1-555-0108',
    address: '4567 Warehouse Lane',
    city: 'Atlanta',
    state: 'Georgia',
    country: 'USA',
    zipCode: '30301',
    contactPerson: 'Jennifer Taylor',
    taxId: 'TAX-008-2024',
    paymentTerms: 'Net 30',
    notes: 'Large inventory with bulk pricing available',
    status: 'A',
  },
  {
    code: 'SUP009',
    name: 'Tech Auto Components',
    email: 'sales@techauto.com',
    phone: '+1-555-0109',
    address: '8901 Technology Drive',
    city: 'San Francisco',
    state: 'California',
    country: 'USA',
    zipCode: '94101',
    contactPerson: 'James White',
    taxId: 'TAX-009-2024',
    paymentTerms: 'Net 30',
    notes: 'Advanced electronic and tech components',
    status: 'A',
  },
  {
    code: 'SUP010',
    name: 'Master Parts Distributors',
    email: 'orders@masterparts.com',
    phone: '+1-555-0110',
    address: '1234 Master Street',
    city: 'Boston',
    state: 'Massachusetts',
    country: 'USA',
    zipCode: '02101',
    contactPerson: 'Patricia Harris',
    taxId: 'TAX-010-2024',
    paymentTerms: 'Net 30',
    notes: 'Comprehensive parts catalog with excellent support',
    status: 'A',
  },
];

async function addSuppliers() {
  try {
    console.log('Starting to add 10 suppliers...\n');

    let added = 0;
    let skipped = 0;

    for (const supplier of suppliers) {
      try {
        // Check if supplier code already exists
        const existing = await prisma.supplier.findUnique({
          where: { code: supplier.code },
        });

        if (existing) {
          console.log(`⚠️  Supplier ${supplier.code} (${supplier.name}) already exists, skipping...`);
          skipped++;
          continue;
        }

        // Create supplier
        const created = await prisma.supplier.create({
          data: supplier,
        });

        console.log(`✅ Added supplier: ${created.code} - ${created.name}`);
        added++;
      } catch (error: any) {
        console.error(`❌ Error adding supplier ${supplier.code}:`, error.message);
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Summary:');
    console.log(`✅ Added: ${added} suppliers`);
    console.log(`⚠️  Skipped: ${skipped} suppliers (already exist)`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    console.error('Error adding suppliers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSuppliers();

