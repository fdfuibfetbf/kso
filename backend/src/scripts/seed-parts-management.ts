import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPartsManagement() {
  console.log('🌱 Seeding Parts Management System...');

  try {
    // 1. Create Store Types
    console.log('Creating store types...');
    const storeTypes = await Promise.all([
      prisma.storeType.upsert({
        where: { name: 'Warehouse' },
        update: {},
        create: { name: 'Warehouse' }
      }),
      prisma.storeType.upsert({
        where: { name: 'Retail Store' },
        update: {},
        create: { name: 'Retail Store' }
      }),
      prisma.storeType.upsert({
        where: { name: 'Service Center' },
        update: {},
        create: { name: 'Service Center' }
      })
    ]);

    // 2. Create Stores
    console.log('Creating stores...');
    const stores = await Promise.all([
      prisma.store.upsert({
        where: { id: 'main-warehouse' },
        update: {},
        create: {
          id: 'main-warehouse',
          name: 'Main Warehouse',
          storeTypeId: storeTypes[0].id,
          description: 'Primary storage facility'
        }
      }),
      prisma.store.upsert({
        where: { id: 'branch-store-1' },
        update: {},
        create: {
          id: 'branch-store-1',
          name: 'Branch Store 1',
          storeTypeId: storeTypes[1].id,
          description: 'First branch retail location'
        }
      }),
      prisma.store.upsert({
        where: { id: 'service-center-1' },
        update: {},
        create: {
          id: 'service-center-1',
          name: 'Service Center 1',
          storeTypeId: storeTypes[2].id,
          description: 'Main service and repair center'
        }
      })
    ]);

    // 3. Create Racks
    console.log('Creating racks...');
    const racks = [];
    for (const store of stores) {
      for (let i = 1; i <= 5; i++) {
        const rackNumber = `R${i.toString().padStart(3, '0')}`;
        const rack = await prisma.rack.upsert({
          where: { 
            rackNumber_storeId: {
              rackNumber,
              storeId: store.id
            }
          },
          update: {},
          create: {
            rackNumber,
            storeId: store.id,
            description: `Rack ${i} in ${store.name}`
          }
        });
        racks.push(rack);
      }
    }

    // 4. Create Shelves
    console.log('Creating shelves...');
    const shelves = [];
    for (const rack of racks) {
      for (let i = 1; i <= 4; i++) {
        const shelfNumber = `S${i.toString().padStart(3, '0')}`;
        const shelf = await prisma.shelf.upsert({
          where: {
            shelfNumber_rackId: {
              shelfNumber,
              rackId: rack.id
            }
          },
          update: {},
          create: {
            shelfNumber,
            rackId: rack.id,
            description: `Shelf ${i} in ${rack.rackNumber}`
          }
        });
        shelves.push(shelf);
      }
    }

    // 5. Create Brands
    console.log('Creating brands...');
    const brands = await Promise.all([
      prisma.brand.upsert({
        where: { name: 'Toyota' },
        update: {},
        create: { name: 'Toyota' }
      }),
      prisma.brand.upsert({
        where: { name: 'Honda' },
        update: {},
        create: { name: 'Honda' }
      }),
      prisma.brand.upsert({
        where: { name: 'Ford' },
        update: {},
        create: { name: 'Ford' }
      }),
      prisma.brand.upsert({
        where: { name: 'Generic' },
        update: {},
        create: { name: 'Generic' }
      })
    ]);

    // 6. Create Units
    console.log('Creating units...');
    const units = await Promise.all([
      prisma.unit.upsert({
        where: { name: 'Piece' },
        update: {},
        create: { name: 'Piece', shortName: 'Pcs' }
      }),
      prisma.unit.upsert({
        where: { name: 'Liter' },
        update: {},
        create: { name: 'Liter', shortName: 'L' }
      }),
      prisma.unit.upsert({
        where: { name: 'Kilogram' },
        update: {},
        create: { name: 'Kilogram', shortName: 'Kg' }
      }),
      prisma.unit.upsert({
        where: { name: 'Set' },
        update: {},
        create: { name: 'Set', shortName: 'Set' }
      })
    ]);

    // 7. Create Machine Models
    console.log('Creating machine models...');
    const machineModels = await Promise.all([
      prisma.machineModel.upsert({
        where: { name: 'Camry 2020' },
        update: {},
        create: { name: 'Camry 2020' }
      }),
      prisma.machineModel.upsert({
        where: { name: 'Accord 2019' },
        update: {},
        create: { name: 'Accord 2019' }
      }),
      prisma.machineModel.upsert({
        where: { name: 'F-150 2021' },
        update: {},
        create: { name: 'F-150 2021' }
      }),
      prisma.machineModel.upsert({
        where: { name: 'Universal' },
        update: {},
        create: { name: 'Universal' }
      })
    ]);

    // 8. Create Categories
    console.log('Creating categories...');
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { id: 'engine-parts' },
        update: {},
        create: {
          id: 'engine-parts',
          name: 'Engine Parts',
          type: 'part_category'
        }
      }),
      prisma.category.upsert({
        where: { id: 'brake-parts' },
        update: {},
        create: {
          id: 'brake-parts',
          name: 'Brake Parts',
          type: 'part_category'
        }
      }),
      prisma.category.upsert({
        where: { id: 'body-parts' },
        update: {},
        create: {
          id: 'body-parts',
          name: 'Body Parts',
          type: 'part_category'
        }
      })
    ]);

    // Create Sub-categories
    const subCategories = await Promise.all([
      prisma.category.upsert({
        where: { id: 'engine-oil' },
        update: {},
        create: {
          id: 'engine-oil',
          name: 'Engine Oil',
          type: 'part_subcategory',
          parentId: categories[0].id
        }
      }),
      prisma.category.upsert({
        where: { id: 'engine-filters' },
        update: {},
        create: {
          id: 'engine-filters',
          name: 'Engine Filters',
          type: 'part_subcategory',
          parentId: categories[0].id
        }
      }),
      prisma.category.upsert({
        where: { id: 'brake-pads' },
        update: {},
        create: {
          id: 'brake-pads',
          name: 'Brake Pads',
          type: 'part_subcategory',
          parentId: categories[1].id
        }
      }),
      prisma.category.upsert({
        where: { id: 'brake-fluid' },
        update: {},
        create: {
          id: 'brake-fluid',
          name: 'Brake Fluid',
          type: 'part_subcategory',
          parentId: categories[1].id
        }
      })
    ]);

    // 9. Create Machine Parts
    console.log('Creating machine parts...');
    const machineParts = await Promise.all([
      prisma.machinePart.upsert({
        where: { name: 'Engine Oil Filter' },
        update: {},
        create: {
          name: 'Engine Oil Filter',
          unitId: units[0].id // Piece
        }
      }),
      prisma.machinePart.upsert({
        where: { name: 'Brake Pad Set' },
        update: {},
        create: {
          name: 'Brake Pad Set',
          unitId: units[3].id // Set
        }
      }),
      prisma.machinePart.upsert({
        where: { name: 'Engine Oil' },
        update: {},
        create: {
          name: 'Engine Oil',
          unitId: units[1].id // Liter
        }
      }),
      prisma.machinePart.upsert({
        where: { name: 'Brake Fluid' },
        update: {},
        create: {
          name: 'Brake Fluid',
          unitId: units[1].id // Liter
        }
      }),
      prisma.machinePart.upsert({
        where: { name: 'Complete Brake Kit' },
        update: {},
        create: {
          name: 'Complete Brake Kit',
          unitId: units[3].id // Set
        }
      })
    ]);

    // 10. Create OEM Part Numbers
    console.log('Creating OEM part numbers...');
    const oemPartNumbers = await Promise.all([
      prisma.oemPartNumber.upsert({
        where: { number1_number2: { number1: 'TOY001', number2: 'OF001' } },
        update: {},
        create: { number1: 'TOY001', number2: 'OF001' }
      }),
      prisma.oemPartNumber.upsert({
        where: { number1_number2: { number1: 'TOY002', number2: 'BP001' } },
        update: {},
        create: { number1: 'TOY002', number2: 'BP001' }
      }),
      prisma.oemPartNumber.upsert({
        where: { number1_number2: { number1: 'TOY003', number2: 'EO001' } },
        update: {},
        create: { number1: 'TOY003', number2: 'EO001' }
      }),
      prisma.oemPartNumber.upsert({
        where: { number1_number2: { number1: 'TOY004', number2: 'BF001' } },
        update: {},
        create: { number1: 'TOY004', number2: 'BF001' }
      }),
      prisma.oemPartNumber.upsert({
        where: { number1_number2: { number1: 'KIT001', number2: 'BRK001' } },
        update: {},
        create: { number1: 'KIT001', number2: 'BRK001' }
      })
    ]);

    // 11. Create Machine Part OEM Part relationships
    console.log('Creating machine part OEM part relationships...');
    const machinePartOemParts = await Promise.all([
      prisma.machinePartOemPart.upsert({
        where: {
          machinePartId_oemPartNumberId: {
            machinePartId: machineParts[0].id, // Engine Oil Filter
            oemPartNumberId: oemPartNumbers[0].id
          }
        },
        update: {},
        create: {
          machinePartId: machineParts[0].id,
          oemPartNumberId: oemPartNumbers[0].id
        }
      }),
      prisma.machinePartOemPart.upsert({
        where: {
          machinePartId_oemPartNumberId: {
            machinePartId: machineParts[1].id, // Brake Pad Set
            oemPartNumberId: oemPartNumbers[1].id
          }
        },
        update: {},
        create: {
          machinePartId: machineParts[1].id,
          oemPartNumberId: oemPartNumbers[1].id
        }
      }),
      prisma.machinePartOemPart.upsert({
        where: {
          machinePartId_oemPartNumberId: {
            machinePartId: machineParts[2].id, // Engine Oil
            oemPartNumberId: oemPartNumbers[2].id
          }
        },
        update: {},
        create: {
          machinePartId: machineParts[2].id,
          oemPartNumberId: oemPartNumbers[2].id
        }
      }),
      prisma.machinePartOemPart.upsert({
        where: {
          machinePartId_oemPartNumberId: {
            machinePartId: machineParts[3].id, // Brake Fluid
            oemPartNumberId: oemPartNumbers[3].id
          }
        },
        update: {},
        create: {
          machinePartId: machineParts[3].id,
          oemPartNumberId: oemPartNumbers[3].id
        }
      }),
      prisma.machinePartOemPart.upsert({
        where: {
          machinePartId_oemPartNumberId: {
            machinePartId: machineParts[4].id, // Complete Brake Kit
            oemPartNumberId: oemPartNumbers[4].id
          }
        },
        update: {},
        create: {
          machinePartId: machineParts[4].id,
          oemPartNumberId: oemPartNumbers[4].id
        }
      })
    ]);

    // 12. Create Items (Parts and Kits)
    console.log('Creating items...');
    const items = await Promise.all([
      // Individual Parts (typeId: 1)
      prisma.item.upsert({
        where: { id: 'item-oil-filter' },
        update: {},
        create: {
          id: 'item-oil-filter',
          machinePartOemPartId: machinePartOemParts[0].id,
          brandId: brands[0].id, // Toyota
          machineModelId: machineModels[0].id, // Camry 2020
          typeId: 1 // Part
        }
      }),
      prisma.item.upsert({
        where: { id: 'item-brake-pads' },
        update: {},
        create: {
          id: 'item-brake-pads',
          machinePartOemPartId: machinePartOemParts[1].id,
          brandId: brands[0].id, // Toyota
          machineModelId: machineModels[0].id, // Camry 2020
          typeId: 1 // Part
        }
      }),
      prisma.item.upsert({
        where: { id: 'item-engine-oil' },
        update: {},
        create: {
          id: 'item-engine-oil',
          machinePartOemPartId: machinePartOemParts[2].id,
          brandId: brands[3].id, // Generic
          machineModelId: machineModels[3].id, // Universal
          typeId: 1 // Part
        }
      }),
      prisma.item.upsert({
        where: { id: 'item-brake-fluid' },
        update: {},
        create: {
          id: 'item-brake-fluid',
          machinePartOemPartId: machinePartOemParts[3].id,
          brandId: brands[3].id, // Generic
          machineModelId: machineModels[3].id, // Universal
          typeId: 1 // Part
        }
      }),
      // Kit (typeId: 2)
      prisma.item.upsert({
        where: { id: 'kit-brake-complete' },
        update: {},
        create: {
          id: 'kit-brake-complete',
          machinePartOemPartId: machinePartOemParts[4].id,
          brandId: brands[0].id, // Toyota
          machineModelId: machineModels[0].id, // Camry 2020
          typeId: 2 // Kit
        }
      })
    ]);

    // 13. Create Kit Relationships (Kit Recipe)
    console.log('Creating kit recipes...');
    await Promise.all([
      prisma.kitChild.upsert({
        where: {
          kitItemId_childItemId: {
            kitItemId: items[4].id, // Complete Brake Kit
            childItemId: items[1].id  // Brake Pads
          }
        },
        update: {},
        create: {
          kitItemId: items[4].id, // Complete Brake Kit
          childItemId: items[1].id, // Brake Pads
          quantity: 1
        }
      }),
      prisma.kitChild.upsert({
        where: {
          kitItemId_childItemId: {
            kitItemId: items[4].id, // Complete Brake Kit
            childItemId: items[3].id  // Brake Fluid
          }
        },
        update: {},
        create: {
          kitItemId: items[4].id, // Complete Brake Kit
          childItemId: items[3].id, // Brake Fluid
          quantity: 2 // 2 liters of brake fluid per kit
        }
      })
    ]);

    // 14. Create Sample Inventory
    console.log('Creating sample inventory...');
    const sampleInventory = [];
    
    // Create inventory for each item in different stores and locations
    for (const item of items.slice(0, 4)) { // Only individual parts, not the kit
      for (let storeIndex = 0; storeIndex < 2; storeIndex++) {
        for (let rackIndex = 0; rackIndex < 2; rackIndex++) {
          const store = stores[storeIndex];
          const storeRacks = racks.filter(r => r.storeId === store.id);
          const rack = storeRacks[rackIndex];
          const rackShelves = shelves.filter(s => s.rackId === rack.id);
          const shelf = rackShelves[0]; // Use first shelf

          const quantity = Math.floor(Math.random() * 100) + 10; // Random quantity between 10-110

          const inventory = await prisma.itemInventory.upsert({
            where: {
              itemId_storeId_rackId_shelfId: {
                itemId: item.id,
                storeId: store.id,
                rackId: rack.id,
                shelfId: shelf.id
              }
            },
            update: {},
            create: {
              itemId: item.id,
              storeId: store.id,
              rackId: rack.id,
              shelfId: shelf.id,
              quantity
            }
          });
          sampleInventory.push(inventory);
        }
      }
    }

    console.log('✅ Parts Management System seeded successfully!');
    console.log(`📊 Created:`);
    console.log(`  - ${storeTypes.length} store types`);
    console.log(`  - ${stores.length} stores`);
    console.log(`  - ${racks.length} racks`);
    console.log(`  - ${shelves.length} shelves`);
    console.log(`  - ${brands.length} brands`);
    console.log(`  - ${units.length} units`);
    console.log(`  - ${machineModels.length} machine models`);
    console.log(`  - ${categories.length + subCategories.length} categories`);
    console.log(`  - ${machineParts.length} machine parts`);
    console.log(`  - ${oemPartNumbers.length} OEM part numbers`);
    console.log(`  - ${items.length} items (${items.filter(i => i.typeId === 1).length} parts + ${items.filter(i => i.typeId === 2).length} kits)`);
    console.log(`  - ${sampleInventory.length} inventory records`);

  } catch (error) {
    console.error('❌ Error seeding parts management system:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedPartsManagement();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { seedPartsManagement };