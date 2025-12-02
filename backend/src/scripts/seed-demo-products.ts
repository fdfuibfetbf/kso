import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const demoProducts = [
  {
    partNo: 'ENG-001-2024',
    masterPartNo: 'MP-ENG-001',
    brand: 'Toyota',
    description: 'Engine Oil Filter - Premium Quality',
    mainCategory: 'Engine Parts',
    subCategory: 'Filters',
    application: 'Toyota Camry 2020-2024',
    hsCode: '8421.23.00',
    uom: 'PCS',
    weight: 0.85,
    reOrderLevel: 50,
    cost: 12.50,
    priceA: 18.75,
    priceB: 16.25,
    priceM: 15.00,
    rackNo: 'A-12-05',
    origin: 'Japan',
    grade: 'A',
    status: 'A',
    smc: 'SMC-ENG-001',
    size: 'Standard',
    remarks: 'High quality OEM replacement filter. Compatible with multiple Toyota models.',
    models: [
      { modelNo: 'CAMRY-2020', qtyUsed: 1, tab: 'P1' },
      { modelNo: 'CAMRY-2021', qtyUsed: 1, tab: 'P1' },
      { modelNo: 'CAMRY-2022', qtyUsed: 1, tab: 'P1' },
      { modelNo: 'COROLLA-2020', qtyUsed: 1, tab: 'P2' },
    ],
    stock: { quantity: 125, location: 'Warehouse A' },
  },
  {
    partNo: 'BRAKE-002-2024',
    masterPartNo: 'MP-BRK-002',
    brand: 'Brembo',
    description: 'Front Brake Pad Set - Ceramic',
    mainCategory: 'Brake System',
    subCategory: 'Brake Pads',
    application: 'Honda Accord 2018-2023',
    hsCode: '8708.30.00',
    uom: 'SET',
    weight: 2.5,
    reOrderLevel: 30,
    cost: 45.00,
    priceA: 68.50,
    priceB: 59.75,
    priceM: 55.00,
    rackNo: 'B-08-12',
    origin: 'Italy',
    grade: 'A',
    status: 'A',
    smc: 'SMC-BRK-002',
    size: 'Front Set',
    remarks: 'Premium ceramic brake pads with low noise and dust. Excellent stopping power.',
    models: [
      { modelNo: 'ACCORD-2018', qtyUsed: 1, tab: 'P1' },
      { modelNo: 'ACCORD-2019', qtyUsed: 1, tab: 'P1' },
      { modelNo: 'ACCORD-2020', qtyUsed: 1, tab: 'P1' },
      { modelNo: 'CIVIC-2019', qtyUsed: 1, tab: 'P2' },
    ],
    stock: { quantity: 78, location: 'Warehouse B' },
  },
  {
    partNo: 'BATT-003-2024',
    masterPartNo: 'MP-BAT-003',
    brand: 'Exide',
    description: 'Car Battery 12V 60Ah - Maintenance Free',
    mainCategory: 'Electrical',
    subCategory: 'Batteries',
    application: 'Universal - Most Sedans',
    hsCode: '8507.20.00',
    uom: 'PCS',
    weight: 18.5,
    reOrderLevel: 20,
    cost: 85.00,
    priceA: 125.00,
    priceB: 110.00,
    priceM: 105.00,
    rackNo: 'C-15-03',
    origin: 'India',
    grade: 'B',
    status: 'A',
    smc: 'SMC-BAT-003',
    size: 'Group 24',
    remarks: 'Maintenance-free battery with 3-year warranty. High CCA rating for reliable starts.',
    models: [
      { modelNo: 'UNIVERSAL-24', qtyUsed: 1, tab: 'P1' },
      { modelNo: 'SEDAN-STD', qtyUsed: 1, tab: 'P1' },
    ],
    stock: { quantity: 42, location: 'Warehouse C' },
  },
  {
    partNo: 'TIRE-004-2024',
    masterPartNo: 'MP-TIR-004',
    brand: 'Michelin',
    description: 'All-Season Tire 205/55R16 - 91H',
    mainCategory: 'Tires & Wheels',
    subCategory: 'Tires',
    application: 'Sedan - Standard Size',
    hsCode: '4011.10.00',
    uom: 'PCS',
    weight: 9.2,
    reOrderLevel: 40,
    cost: 95.00,
    priceA: 145.00,
    priceB: 130.00,
    priceM: 120.00,
    rackNo: 'D-22-08',
    origin: 'France',
    grade: 'A',
    status: 'A',
    smc: 'SMC-TIR-004',
    size: '205/55R16',
    remarks: 'Premium all-season tire with excellent wet and dry traction. 60,000-mile warranty.',
    models: [
      { modelNo: 'SEDAN-205-55', qtyUsed: 4, tab: 'P1' },
      { modelNo: 'COMPACT-205-55', qtyUsed: 4, tab: 'P1' },
    ],
    stock: { quantity: 156, location: 'Warehouse D' },
  },
  {
    partNo: 'AIR-005-2024',
    masterPartNo: 'MP-AIR-005',
    brand: 'Mann Filter',
    description: 'Cabin Air Filter - Activated Carbon',
    mainCategory: 'HVAC',
    subCategory: 'Air Filters',
    application: 'Nissan Altima 2019-2024',
    hsCode: '8421.23.00',
    uom: 'PCS',
    weight: 0.35,
    reOrderLevel: 25,
    cost: 18.00,
    priceA: 28.50,
    priceB: 24.75,
    priceM: 22.00,
    rackNo: 'A-10-15',
    origin: 'Germany',
    grade: 'A',
    status: 'A',
    smc: 'SMC-AIR-005',
    size: 'Standard',
    remarks: 'Activated carbon filter removes odors, pollen, and pollutants. Easy installation.',
    models: [
      { modelNo: 'ALTIMA-2019', qtyUsed: 1, tab: 'P1' },
      { modelNo: 'ALTIMA-2020', qtyUsed: 1, tab: 'P1' },
      { modelNo: 'ALTIMA-2021', qtyUsed: 1, tab: 'P1' },
      { modelNo: 'SENTRA-2020', qtyUsed: 1, tab: 'P2' },
    ],
    stock: { quantity: 89, location: 'Warehouse A' },
  },
  {
    partNo: 'SPARK-006-2024',
    masterPartNo: 'MP-SPK-006',
    brand: 'NGK',
    description: 'Spark Plug Set - Iridium - 4 Pack',
    mainCategory: 'Engine Parts',
    subCategory: 'Ignition',
    application: 'Honda Civic 2016-2021',
    hsCode: '8511.10.00',
    uom: 'SET',
    weight: 0.2,
    reOrderLevel: 40,
    cost: 32.00,
    priceA: 48.00,
    priceB: 42.00,
    priceM: 38.00,
    rackNo: 'A-05-20',
    origin: 'Japan',
    grade: 'A',
    status: 'A',
    smc: 'SMC-SPK-006',
    size: 'Iridium',
    remarks: 'Iridium spark plugs for improved fuel economy and performance. Long-lasting design.',
    models: [
      { modelNo: 'CIVIC-2016', qtyUsed: 4, tab: 'P1' },
      { modelNo: 'CIVIC-2017', qtyUsed: 4, tab: 'P1' },
    ],
    stock: { quantity: 95, location: 'Warehouse A' },
  },
  {
    partNo: 'RADIATOR-007-2024',
    masterPartNo: 'MP-RAD-007',
    brand: 'Denso',
    description: 'Radiator - Aluminum Core',
    mainCategory: 'Cooling System',
    subCategory: 'Radiators',
    application: 'Toyota Corolla 2014-2019',
    hsCode: '8708.91.00',
    uom: 'PCS',
    weight: 4.8,
    reOrderLevel: 15,
    cost: 185.00,
    priceA: 275.00,
    priceB: 245.00,
    priceM: 230.00,
    rackNo: 'B-12-10',
    origin: 'Japan',
    grade: 'A',
    status: 'A',
    smc: 'SMC-RAD-007',
    size: 'Standard',
    remarks: 'High-efficiency aluminum radiator with improved cooling capacity. Direct OEM replacement.',
    models: [
      { modelNo: 'COROLLA-2014', qtyUsed: 1, tab: 'P1' },
      { modelNo: 'COROLLA-2015', qtyUsed: 1, tab: 'P1' },
    ],
    stock: { quantity: 28, location: 'Warehouse B' },
  },
  {
    partNo: 'WIPER-008-2024',
    masterPartNo: 'MP-WIP-008',
    brand: 'Bosch',
    description: 'Windshield Wiper Blades - 24" & 18" Set',
    mainCategory: 'Body & Exterior',
    subCategory: 'Wipers',
    application: 'Universal Fit',
    hsCode: '8512.40.00',
    uom: 'SET',
    weight: 0.5,
    reOrderLevel: 50,
    cost: 22.00,
    priceA: 35.00,
    priceB: 30.00,
    priceM: 28.00,
    rackNo: 'C-03-15',
    origin: 'Germany',
    grade: 'A',
    status: 'A',
    smc: 'SMC-WIP-008',
    size: '24"/18"',
    remarks: 'Premium beam-style wiper blades. Quiet operation and streak-free performance.',
    models: [
      { modelNo: 'UNIVERSAL-WIPER', qtyUsed: 1, tab: 'P1' },
    ],
    stock: { quantity: 142, location: 'Warehouse C' },
  },
  {
    partNo: 'BELT-009-2024',
    masterPartNo: 'MP-BEL-009',
    brand: 'Gates',
    description: 'Serpentine Belt - Multi-Rib',
    mainCategory: 'Engine Parts',
    subCategory: 'Belts',
    application: 'Ford Focus 2012-2018',
    hsCode: '4010.39.00',
    uom: 'PCS',
    weight: 0.6,
    reOrderLevel: 30,
    cost: 28.00,
    priceA: 42.00,
    priceB: 37.00,
    priceM: 35.00,
    rackNo: 'A-08-25',
    origin: 'USA',
    grade: 'A',
    status: 'A',
    smc: 'SMC-BEL-009',
    size: '6-Rib',
    remarks: 'High-quality multi-rib belt with excellent durability. OEM specifications.',
    models: [
      { modelNo: 'FOCUS-2012', qtyUsed: 1, tab: 'P1' },
      { modelNo: 'FOCUS-2013', qtyUsed: 1, tab: 'P1' },
    ],
    stock: { quantity: 67, location: 'Warehouse A' },
  },
  {
    partNo: 'SHOCK-010-2024',
    masterPartNo: 'MP-SHK-010',
    brand: 'Monroe',
    description: 'Front Shock Absorber - Gas Charged',
    mainCategory: 'Suspension',
    subCategory: 'Shock Absorbers',
    application: 'Chevrolet Malibu 2013-2016',
    hsCode: '8708.80.00',
    uom: 'PCS',
    weight: 3.2,
    reOrderLevel: 20,
    cost: 65.00,
    priceA: 98.00,
    priceB: 85.00,
    priceM: 80.00,
    rackNo: 'D-15-12',
    origin: 'USA',
    grade: 'A',
    status: 'A',
    smc: 'SMC-SHK-010',
    size: 'Front',
    remarks: 'Gas-charged shock absorber for improved ride comfort and handling.',
    models: [
      { modelNo: 'MALIBU-2013', qtyUsed: 2, tab: 'P1' },
      { modelNo: 'MALIBU-2014', qtyUsed: 2, tab: 'P1' },
    ],
    stock: { quantity: 34, location: 'Warehouse D' },
  },
  {
    partNo: 'HEADLIGHT-011-2024',
    masterPartNo: 'MP-HDL-011',
    brand: 'Philips',
    description: 'H4 Halogen Headlight Bulb - 60/55W',
    mainCategory: 'Electrical',
    subCategory: 'Lighting',
    application: 'Universal H4 Socket',
    hsCode: '8539.21.00',
    uom: 'PCS',
    weight: 0.1,
    reOrderLevel: 60,
    cost: 8.50,
    priceA: 14.00,
    priceB: 12.00,
    priceM: 11.00,
    rackNo: 'C-01-30',
    origin: 'Netherlands',
    grade: 'A',
    status: 'A',
    smc: 'SMC-HDL-011',
    size: 'H4',
    remarks: 'Bright halogen bulb with long lifespan. Easy installation.',
    models: [
      { modelNo: 'H4-UNIVERSAL', qtyUsed: 2, tab: 'P1' },
    ],
    stock: { quantity: 203, location: 'Warehouse C' },
  },
  {
    partNo: 'FUEL-012-2024',
    masterPartNo: 'MP-FUL-012',
    brand: 'Mahle',
    description: 'Fuel Filter - Inline',
    mainCategory: 'Fuel System',
    subCategory: 'Filters',
    application: 'Volkswagen Jetta 2011-2018',
    hsCode: '8421.23.00',
    uom: 'PCS',
    weight: 0.3,
    reOrderLevel: 35,
    cost: 15.00,
    priceA: 24.00,
    priceB: 21.00,
    priceM: 19.00,
    rackNo: 'A-11-18',
    origin: 'Germany',
    grade: 'A',
    status: 'A',
    smc: 'SMC-FUL-012',
    size: 'Inline',
    remarks: 'High-efficiency fuel filter protects engine from contaminants.',
    models: [
      { modelNo: 'JETTA-2011', qtyUsed: 1, tab: 'P1' },
      { modelNo: 'JETTA-2012', qtyUsed: 1, tab: 'P1' },
    ],
    stock: { quantity: 58, location: 'Warehouse A' },
  },
  {
    partNo: 'OIL-013-2024',
    masterPartNo: 'MP-OIL-013',
    brand: 'Mobil',
    description: 'Engine Oil 5W-30 Synthetic - 5 Quart',
    mainCategory: 'Fluids',
    subCategory: 'Engine Oil',
    application: 'Universal - Most Modern Engines',
    hsCode: '2710.12.45',
    uom: 'LTR',
    weight: 4.5,
    reOrderLevel: 25,
    cost: 28.00,
    priceA: 42.00,
    priceB: 37.00,
    priceM: 35.00,
    rackNo: 'E-20-05',
    origin: 'USA',
    grade: 'A',
    status: 'A',
    smc: 'SMC-OIL-013',
    size: '5 Quart',
    remarks: 'Full synthetic engine oil for extended drain intervals. Excellent protection.',
    models: [
      { modelNo: 'UNIVERSAL-5W30', qtyUsed: 1, tab: 'P1' },
    ],
    stock: { quantity: 112, location: 'Warehouse E' },
  },
  {
    partNo: 'THERMO-014-2024',
    masterPartNo: 'MP-THM-014',
    brand: 'Stant',
    description: 'Thermostat - 180°F',
    mainCategory: 'Cooling System',
    subCategory: 'Thermostats',
    application: 'GM Vehicles 2008-2015',
    hsCode: '8481.80.90',
    uom: 'PCS',
    weight: 0.4,
    reOrderLevel: 30,
    cost: 18.00,
    priceA: 28.00,
    priceB: 24.00,
    priceM: 22.00,
    rackNo: 'B-09-22',
    origin: 'USA',
    grade: 'A',
    status: 'A',
    smc: 'SMC-THM-014',
    size: '180°F',
    remarks: 'Precision-engineered thermostat maintains optimal engine temperature.',
    models: [
      { modelNo: 'GM-2008', qtyUsed: 1, tab: 'P1' },
      { modelNo: 'GM-2009', qtyUsed: 1, tab: 'P1' },
    ],
    stock: { quantity: 51, location: 'Warehouse B' },
  },
  {
    partNo: 'WATER-015-2024',
    masterPartNo: 'MP-WAT-015',
    brand: 'Gates',
    description: 'Water Pump - Aluminum Housing',
    mainCategory: 'Cooling System',
    subCategory: 'Water Pumps',
    application: 'Dodge Charger 2011-2014',
    hsCode: '8413.30.00',
    uom: 'PCS',
    weight: 2.8,
    reOrderLevel: 15,
    cost: 95.00,
    priceA: 145.00,
    priceB: 125.00,
    priceM: 115.00,
    rackNo: 'D-18-08',
    origin: 'USA',
    grade: 'A',
    status: 'A',
    smc: 'SMC-WAT-015',
    size: 'Standard',
    remarks: 'Durable aluminum water pump with sealed bearings. Long service life.',
    models: [
      { modelNo: 'CHARGER-2011', qtyUsed: 1, tab: 'P1' },
      { modelNo: 'CHARGER-2012', qtyUsed: 1, tab: 'P1' },
    ],
    stock: { quantity: 22, location: 'Warehouse D' },
  },
  {
    partNo: 'ALTERNATOR-016-2024',
    masterPartNo: 'MP-ALT-016',
    brand: 'Denso',
    description: 'Alternator - 120A',
    mainCategory: 'Electrical',
    subCategory: 'Alternators',
    application: 'Nissan Sentra 2013-2019',
    hsCode: '8511.40.00',
    uom: 'PCS',
    weight: 6.5,
    reOrderLevel: 10,
    cost: 185.00,
    priceA: 275.00,
    priceB: 240.00,
    priceM: 225.00,
    rackNo: 'C-25-15',
    origin: 'Japan',
    grade: 'A',
    status: 'A',
    smc: 'SMC-ALT-016',
    size: '120A',
    remarks: 'High-output alternator with improved charging capacity. OEM quality.',
    models: [
      { modelNo: 'SENTRA-2013', qtyUsed: 1, tab: 'P1' },
      { modelNo: 'SENTRA-2014', qtyUsed: 1, tab: 'P1' },
    ],
    stock: { quantity: 18, location: 'Warehouse C' },
  },
  {
    partNo: 'STARTER-017-2024',
    masterPartNo: 'MP-STR-017',
    brand: 'Bosch',
    description: 'Starter Motor - Remanufactured',
    mainCategory: 'Electrical',
    subCategory: 'Starters',
    application: 'BMW 3 Series 2006-2011',
    hsCode: '8511.40.00',
    uom: 'PCS',
    weight: 4.2,
    reOrderLevel: 12,
    cost: 165.00,
    priceA: 245.00,
    priceB: 215.00,
    priceM: 200.00,
    rackNo: 'B-22-10',
    origin: 'Germany',
    grade: 'A',
    status: 'A',
    smc: 'SMC-STR-017',
    size: 'Standard',
    remarks: 'Remanufactured starter motor with new brushes and bearings. Tested and guaranteed.',
    models: [
      { modelNo: 'BMW-3-2006', qtyUsed: 1, tab: 'P1' },
      { modelNo: 'BMW-3-2007', qtyUsed: 1, tab: 'P1' },
    ],
    stock: { quantity: 15, location: 'Warehouse B' },
  },
  {
    partNo: 'MUFFLER-018-2024',
    masterPartNo: 'MP-MUF-018',
    brand: 'Walker',
    description: 'Exhaust Muffler - Direct Fit',
    mainCategory: 'Exhaust System',
    subCategory: 'Mufflers',
    application: 'Mazda 3 2010-2013',
    hsCode: '8708.92.00',
    uom: 'PCS',
    weight: 8.5,
    reOrderLevel: 8,
    cost: 125.00,
    priceA: 185.00,
    priceB: 165.00,
    priceM: 155.00,
    rackNo: 'D-30-20',
    origin: 'USA',
    grade: 'B',
    status: 'A',
    smc: 'SMC-MUF-018',
    size: 'Direct Fit',
    remarks: 'Direct-fit muffler with corrosion-resistant construction. Easy installation.',
    models: [
      { modelNo: 'MAZDA-3-2010', qtyUsed: 1, tab: 'P1' },
      { modelNo: 'MAZDA-3-2011', qtyUsed: 1, tab: 'P1' },
    ],
    stock: { quantity: 12, location: 'Warehouse D' },
  },
  {
    partNo: 'CATALYTIC-019-2024',
    masterPartNo: 'MP-CAT-019',
    brand: 'Magnaflow',
    description: 'Catalytic Converter - Universal',
    mainCategory: 'Exhaust System',
    subCategory: 'Catalytic Converters',
    application: 'Universal - EPA Compliant',
    hsCode: '8708.92.00',
    uom: 'PCS',
    weight: 12.0,
    reOrderLevel: 5,
    cost: 285.00,
    priceA: 425.00,
    priceB: 375.00,
    priceM: 350.00,
    rackNo: 'E-15-25',
    origin: 'USA',
    grade: 'A',
    status: 'A',
    smc: 'SMC-CAT-019',
    size: 'Universal',
    remarks: 'EPA-compliant catalytic converter. Reduces harmful emissions effectively.',
    models: [
      { modelNo: 'UNIVERSAL-CAT', qtyUsed: 1, tab: 'P1' },
    ],
    stock: { quantity: 8, location: 'Warehouse E' },
  },
  {
    partNo: 'O2-SENSOR-020-2024',
    masterPartNo: 'MP-O2S-020',
    brand: 'NTK',
    description: 'Oxygen Sensor - Upstream',
    mainCategory: 'Exhaust System',
    subCategory: 'Sensors',
    application: 'Hyundai Elantra 2011-2016',
    hsCode: '9026.10.00',
    uom: 'PCS',
    weight: 0.3,
    reOrderLevel: 20,
    cost: 45.00,
    priceA: 68.00,
    priceB: 59.00,
    priceM: 55.00,
    rackNo: 'C-12-18',
    origin: 'Japan',
    grade: 'A',
    status: 'A',
    smc: 'SMC-O2S-020',
    size: 'Upstream',
    remarks: 'Precise oxygen sensor for optimal fuel mixture control. Fast response time.',
    models: [
      { modelNo: 'ELANTRA-2011', qtyUsed: 1, tab: 'P1' },
      { modelNo: 'ELANTRA-2012', qtyUsed: 1, tab: 'P1' },
    ],
    stock: { quantity: 31, location: 'Warehouse C' },
  },
  {
    partNo: 'TRANSMISSION-021-2024',
    masterPartNo: 'MP-TRN-021',
    brand: 'Valvoline',
    description: 'Automatic Transmission Fluid - Dexron VI - 1 Quart',
    mainCategory: 'Fluids',
    subCategory: 'Transmission Fluid',
    application: 'GM Vehicles 2006+',
    hsCode: '2710.19.45',
    uom: 'LTR',
    weight: 0.9,
    reOrderLevel: 40,
    cost: 12.00,
    priceA: 19.00,
    priceB: 16.50,
    priceM: 15.00,
    rackNo: 'E-08-12',
    origin: 'USA',
    grade: 'A',
    status: 'A',
    smc: 'SMC-TRN-021',
    size: '1 Quart',
    remarks: 'Full synthetic transmission fluid. Extends transmission life and improves shifting.',
    models: [
      { modelNo: 'GM-DEXRON-VI', qtyUsed: 1, tab: 'P1' },
    ],
    stock: { quantity: 87, location: 'Warehouse E' },
  },
  {
    partNo: 'POWER-STEERING-022-2024',
    masterPartNo: 'MP-PWS-022',
    brand: 'Pentosin',
    description: 'Power Steering Fluid - CHF 11S',
    mainCategory: 'Fluids',
    subCategory: 'Power Steering',
    application: 'European Vehicles',
    hsCode: '2710.19.45',
    uom: 'LTR',
    weight: 0.9,
    reOrderLevel: 35,
    cost: 18.00,
    priceA: 28.00,
    priceB: 24.00,
    priceM: 22.00,
    rackNo: 'E-10-08',
    origin: 'Germany',
    grade: 'A',
    status: 'A',
    smc: 'SMC-PWS-022',
    size: '1 Liter',
    remarks: 'Synthetic power steering fluid for European vehicles. Prevents pump wear.',
    models: [
      { modelNo: 'EURO-CHF11S', qtyUsed: 1, tab: 'P1' },
    ],
    stock: { quantity: 64, location: 'Warehouse E' },
  },
];

const TARGET_TOTAL_PARTS = 22;
const DEMO_KITS = [
  {
    kitNo: 'KIT-SERVICE-001',
    name: 'Standard Service Kit',
    description: 'Engine oil filter, air filter and brake pads for standard service.',
    status: 'A',
  },
  {
    kitNo: 'KIT-BRAKE-002',
    name: 'Brake Overhaul Kit',
    description: 'Front brake pads and additional wear components.',
    status: 'A',
  },
  {
    kitNo: 'KIT-ELECT-003',
    name: 'Electrical & Battery Kit',
    description: 'Battery with essential electrical spares.',
    status: 'A',
  },
];

async function seedDemoProducts() {
  try {
    console.log('🌱 Starting to seed demo products...\n');

    // Check if we should reset (delete existing parts to recreate with detailed examples)
    const shouldReset = process.env.RESET_PARTS === 'true' || process.argv.includes('--reset');
    
    if (shouldReset) {
      console.log('🔄 RESET mode: Deleting existing parts to recreate with detailed examples...\n');
      await prisma.kitItem.deleteMany({});
      await prisma.kit.deleteMany({});
      await prisma.partModel.deleteMany({});
      await prisma.stock.deleteMany({});
      await prisma.part.deleteMany({});
      console.log('✅ All existing parts and kits deleted.\n');
    }

    // 1) Seed detailed demo products only when there are no parts yet
    let existingCount = await prisma.part.count();
    if (existingCount === 0) {
      console.log('ℹ️  No parts found. Seeding detailed demo products first...\n');

      for (const product of demoProducts) {
        const { models, stock, ...partData } = product;

        // Create the part
        const part = await prisma.part.create({
          data: partData,
        });

        console.log(`✅ Created part: ${part.partNo} - ${part.description}`);

        // Create models
        if (models && models.length > 0) {
          for (const model of models) {
            await prisma.partModel.create({
              data: {
                partId: part.id,
                modelNo: model.modelNo,
                qtyUsed: model.qtyUsed,
                tab: model.tab,
              },
            });
          }
          console.log(`   └─ Added ${models.length} model(s)`);
        }

        // Create stock
        if (stock) {
          await prisma.stock.create({
            data: {
              partId: part.id,
              quantity: stock.quantity,
              location: stock.location,
            },
          });
          console.log(`   └─ Stock: ${stock.quantity} units at ${stock.location}`);
        }

        console.log('');
      }

      existingCount = demoProducts.length;
    } else {
      console.log(`ℹ️  Found ${existingCount} existing part(s). Skipping detailed demo products.\n`);
    }

    // 2) Ensure we have exactly TARGET_TOTAL_PARTS detailed parts
    if (existingCount < TARGET_TOTAL_PARTS) {
      const partsToCreate = TARGET_TOTAL_PARTS - existingCount;
      console.log(`ℹ️  Creating ${partsToCreate} additional detailed demo part(s) to reach ${TARGET_TOTAL_PARTS} total...\n`);

      // Use remaining detailed products from demoProducts array
      const remainingProducts = demoProducts.slice(existingCount);
      
      for (let i = 0; i < partsToCreate && i < remainingProducts.length; i++) {
        const product = remainingProducts[i];
        const { models, stock, ...partData } = product;

        // Create the part
        const part = await prisma.part.create({
          data: partData,
        });

        console.log(`✅ Created part: ${part.partNo} - ${part.description}`);

        // Create models
        if (models && models.length > 0) {
          for (const model of models) {
            await prisma.partModel.create({
              data: {
                partId: part.id,
                modelNo: model.modelNo,
                qtyUsed: model.qtyUsed,
                tab: model.tab,
              },
            });
          }
          console.log(`   └─ Added ${models.length} model(s)`);
        }

        // Create stock
        if (stock) {
          await prisma.stock.create({
            data: {
              partId: part.id,
              quantity: stock.quantity,
              location: stock.location,
            },
          });
          console.log(`   └─ Stock: ${stock.quantity} units at ${stock.location}`);
        }

        console.log('');
      }

      // If we still need more parts, create detailed ones (not generic)
      const stillNeeded = TARGET_TOTAL_PARTS - await prisma.part.count();
      if (stillNeeded > 0) {
        console.log(`ℹ️  Creating ${stillNeeded} additional detailed parts...\n`);
        for (let i = 1; i <= stillNeeded; i++) {
          const index = existingCount + demoProducts.length + i;
          const categories = ['Engine Parts', 'Electrical', 'Brake System', 'Cooling System', 'Suspension'];
          const brands = ['ACDelco', 'Motorcraft', 'Delphi', 'Beck Arnley', 'Standard Motor'];
          
          const part = await prisma.part.create({
            data: {
              partNo: `PART-${index.toString().padStart(3, '0')}-2024`,
              masterPartNo: `MP-${index.toString().padStart(3, '0')}`,
              brand: brands[i % brands.length],
              description: `Quality automotive part ${index} - Premium grade`,
              mainCategory: categories[i % categories.length],
              subCategory: 'General',
              application: 'Universal Application',
              hsCode: '8708.99.00',
              uom: 'PCS',
              weight: 1.5 + (i * 0.2),
              reOrderLevel: 20,
              cost: 25 + (i * 2),
              priceA: 38 + (i * 3),
              priceB: 33 + (i * 2.5),
              priceM: 30 + (i * 2),
              rackNo: `R-${Math.ceil(index / 5)}-${index % 5 || 5}`,
              origin: 'USA',
              grade: i % 3 === 0 ? 'A' : 'B',
              status: 'A',
              smc: `SMC-${index.toString().padStart(3, '0')}`,
              size: 'Standard',
              remarks: `Detailed demo part ${index} for inventory testing and kit creation.`,
            },
          });

          await prisma.stock.create({
            data: {
              partId: part.id,
              quantity: 30 + (i * 2),
              location: `Warehouse ${String.fromCharCode(65 + (i % 5))}`,
            },
          });

          console.log(`✅ Created detailed part: ${part.partNo}`);
        }
      }

      existingCount = await prisma.part.count();
    }

    // 3) Create a few demo kits if none exist
    const existingKits = await prisma.kit.count();
    if (existingKits === 0) {
      console.log('\n🔧 No kits found. Creating demo kits for testing...\n');

      const parts = await prisma.part.findMany({
        take: 12,
        orderBy: { createdAt: 'asc' },
        include: { stock: true },
      });

      if (parts.length === 0) {
        console.log('⚠️  No parts available to build kits. Skipping kit creation.');
      } else {
        // Helper to get part safely by index with wrap‑around
        const getPart = (idx: number) => parts[idx % parts.length];

        const kitsToCreate = [
          {
            def: DEMO_KITS[0],
            items: [
              { part: getPart(0), quantity: 1 },
              { part: getPart(1), quantity: 1 },
              { part: getPart(2), quantity: 1 },
            ],
          },
          {
            def: DEMO_KITS[1],
            items: [
              { part: getPart(1), quantity: 2 },
              { part: getPart(3), quantity: 4 },
            ],
          },
          {
            def: DEMO_KITS[2],
            items: [
              { part: getPart(2), quantity: 1 },
              { part: getPart(4), quantity: 2 },
            ],
          },
        ];

        for (const kitConfig of kitsToCreate) {
          const { def, items } = kitConfig;

          const totalCost = items.reduce((sum, it) => {
            const cost = it.part.cost ?? 0;
            return sum + cost * it.quantity;
          }, 0);

          const price = totalCost * 1.25; // 25% markup for demo

          const kit = await prisma.kit.create({
            data: {
              kitNo: def.kitNo,
              name: def.name,
              description: def.description,
              status: def.status,
              totalCost,
              price,
              items: {
                create: items.map((it) => ({
                  partId: it.part.id,
                  quantity: it.quantity,
                })),
              },
            },
          });

          console.log(`✅ Created kit: ${kit.kitNo} - ${kit.name} (Items: ${items.length})`);
        }
      }
    } else {
      console.log(`\nℹ️  Found ${existingKits} existing kit(s). Skipping demo kit creation.`);
    }

    console.log('\n✨ Seeding completed!');
    console.log('\n📋 Summary:');
    console.log(`   - Total Parts in DB: ${await prisma.part.count()}`);
    console.log(`   - Total Kits in DB: ${await prisma.kit.count()}`);
  } catch (error) {
    console.error('❌ Error seeding demo products:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedDemoProducts()
  .then(() => {
    console.log('\n✅ Seed completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  });

