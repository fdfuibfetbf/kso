import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const suppliers = [
  {
    code: 'SUP011',
    name: 'Advanced Auto Systems',
    email: 'info@advancedauto.com',
    phone: '+1-555-0111',
    address: '1111 Technology Parkway',
    city: 'San Jose',
    state: 'California',
    country: 'USA',
    zipCode: '95101',
    contactPerson: 'Mark Thompson',
    taxId: 'TAX-011-2024',
    paymentTerms: 'Net 30',
    notes: 'Specializes in advanced automotive electronics and sensors',
    status: 'A',
  },
  {
    code: 'SUP012',
    name: 'Prime Components Inc.',
    email: 'sales@primecomponents.com',
    phone: '+1-555-0112',
    address: '2222 Manufacturing Drive',
    city: 'Dallas',
    state: 'Texas',
    country: 'USA',
    zipCode: '75201',
    contactPerson: 'Susan Lee',
    taxId: 'TAX-012-2024',
    paymentTerms: 'Net 30',
    notes: 'High-quality OEM and aftermarket components',
    status: 'A',
  },
  {
    code: 'SUP013',
    name: 'Express Parts Delivery',
    email: 'orders@expressparts.com',
    phone: '+1-555-0113',
    address: '3333 Logistics Way',
    city: 'Denver',
    state: 'Colorado',
    country: 'USA',
    zipCode: '80201',
    contactPerson: 'Robert Garcia',
    taxId: 'TAX-013-2024',
    paymentTerms: 'Net 15',
    notes: 'Fast shipping and same-day delivery available',
    status: 'A',
  },
  {
    code: 'SUP014',
    name: 'Quality Parts Manufacturing',
    email: 'contact@qualityparts.com',
    phone: '+1-555-0114',
    address: '4444 Industrial Avenue',
    city: 'Portland',
    state: 'Oregon',
    country: 'USA',
    zipCode: '97201',
    contactPerson: 'Jennifer Martinez',
    taxId: 'TAX-014-2024',
    paymentTerms: 'Net 30',
    notes: 'Manufacturer of premium quality automotive parts',
    status: 'A',
  },
  {
    code: 'SUP015',
    name: 'Global Parts Network',
    email: 'info@globalparts.net',
    phone: '+1-555-0115',
    address: '5555 International Boulevard',
    city: 'New York',
    state: 'New York',
    country: 'USA',
    zipCode: '10001',
    contactPerson: 'David Kim',
    taxId: 'TAX-015-2024',
    paymentTerms: 'Net 45',
    notes: 'International parts sourcing and distribution',
    status: 'A',
  },
  {
    code: 'SUP016',
    name: 'Eco Auto Solutions',
    email: 'sales@ecoauto.com',
    phone: '+1-555-0116',
    address: '6666 Green Energy Road',
    city: 'Portland',
    state: 'Maine',
    country: 'USA',
    zipCode: '04101',
    contactPerson: 'Lisa Green',
    taxId: 'TAX-016-2024',
    paymentTerms: 'Net 30',
    notes: 'Eco-friendly and sustainable automotive parts',
    status: 'A',
  },
  {
    code: 'SUP017',
    name: 'Performance Parts Direct',
    email: 'orders@perfparts.com',
    phone: '+1-555-0117',
    address: '7777 Speed Street',
    city: 'Las Vegas',
    state: 'Nevada',
    country: 'USA',
    zipCode: '89101',
    contactPerson: 'Michael Speed',
    taxId: 'TAX-017-2024',
    paymentTerms: 'Net 30',
    notes: 'Performance and racing parts specialist',
    status: 'A',
  },
  {
    code: 'SUP018',
    name: 'Budget Auto Supplies',
    email: 'info@budgetauto.com',
    phone: '+1-555-0118',
    address: '8888 Economy Lane',
    city: 'Kansas City',
    state: 'Missouri',
    country: 'USA',
    zipCode: '64101',
    contactPerson: 'Patricia Budget',
    taxId: 'TAX-018-2024',
    paymentTerms: 'Net 30',
    notes: 'Affordable parts with bulk pricing discounts',
    status: 'A',
  },
  {
    code: 'SUP019',
    name: 'Premium Auto Imports',
    email: 'sales@premiumimports.com',
    phone: '+1-555-0119',
    address: '9999 Import Avenue',
    city: 'Miami',
    state: 'Florida',
    country: 'USA',
    zipCode: '33101',
    contactPerson: 'Carlos Rodriguez',
    taxId: 'TAX-019-2024',
    paymentTerms: 'Net 30',
    notes: 'Imported premium parts from Europe and Asia',
    status: 'A',
  },
  {
    code: 'SUP020',
    name: 'Complete Auto Solutions',
    email: 'contact@completeauto.com',
    phone: '+1-555-0120',
    address: '10000 Complete Circle',
    city: 'Minneapolis',
    state: 'Minnesota',
    country: 'USA',
    zipCode: '55401',
    contactPerson: 'Nancy Complete',
    taxId: 'TAX-020-2024',
    paymentTerms: 'Net 30',
    notes: 'One-stop shop for all automotive parts and accessories',
    status: 'A',
  },
];

async function addSuppliers() {
  try {
    console.log('Starting to add 10 more suppliers...\n');

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
    
    // Show total count
    const totalCount = await prisma.supplier.count();
    console.log(`📊 Total suppliers in database: ${totalCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    console.error('Error adding suppliers:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSuppliers();

