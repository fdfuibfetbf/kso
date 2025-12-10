/**
 * Test script for Rack API
 * Run with: node test-rack-api.mjs
 */

import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testRackAPI() {
  log('\n=== Rack API Test Suite ===\n', 'blue');

  try {
    // Step 1: Test the test endpoint
    log('Step 1: Testing database connection and tables...', 'yellow');
    try {
      const testResponse = await axios.post(`${API_URL}/racks/test`);
      if (testResponse.data.success) {
        log('✓ All database tests passed!', 'green');
        log(`  Available store: ${testResponse.data.storeAvailable.name} (ID: ${testResponse.data.storeAvailable.id})`, 'green');
        
        const storeId = testResponse.data.storeAvailable.id;
        
        // Step 2: Test creating a rack
        log('\nStep 2: Testing rack creation...', 'yellow');
        const testRackData = {
          rackNumber: `TEST-${Date.now()}`,
          storeId: storeId,
          description: 'Test rack from automated test',
          status: 'A',
        };

        log(`  Creating rack with data:`, 'yellow');
        log(`    Rack Number: ${testRackData.rackNumber}`, 'yellow');
        log(`    Store ID: ${testRackData.storeId}`, 'yellow');
        log(`    Description: ${testRackData.description}`, 'yellow');
        log(`    Status: ${testRackData.status}`, 'yellow');

        try {
          // Try without auth first to see the error
          console.log('  Attempting without auth token...');
          const createResponse = await axios.post(`${API_URL}/racks`, testRackData, {
            headers: {
              'Content-Type': 'application/json',
            },
            validateStatus: () => true, // Don't throw on any status
          });
          
          if (createResponse.status === 401) {
            log('  Got 401 Unauthorized (expected without token)', 'yellow');
            log('  This means the backend route is working, but requires authentication', 'yellow');
            log('  To test with auth, you need to login first and get a token', 'yellow');
            return;
          }
          
          if (createResponse.status === 201 || createResponse.status === 200) {
            log('✓ Rack created successfully!', 'green');
            const rack = createResponse.data?.rack || createResponse.data;
            if (rack) {
              log(`  Rack ID: ${rack.id}`, 'green');
              log(`  Rack Number: ${rack.rackNumber}`, 'green');
              log(`  Store: ${rack.store?.name || 'N/A'}`, 'green');
              
              // Test 3: Get the created rack
              log('\nStep 3: Testing rack retrieval...', 'yellow');
              try {
                const getResponse = await axios.get(`${API_URL}/racks/${rack.id}`, {
                  validateStatus: () => true,
                });
                if (getResponse.status === 200) {
                  log('✓ Rack retrieved successfully!', 'green');
                  log(`  Store: ${getResponse.data.rack?.store?.name || 'N/A'}`, 'green');
                } else {
                  log(`  Status: ${getResponse.status}`, 'yellow');
                }
              } catch (error) {
                log(`  Note: Could not retrieve rack (may need auth): ${error.message}`, 'yellow');
              }
              
              // Test 4: Delete the test rack
              log('\nStep 4: Cleaning up test rack...', 'yellow');
              try {
                await axios.delete(`${API_URL}/racks/${rack.id}`, {
                  validateStatus: () => true,
                });
                log('✓ Test rack deleted successfully!', 'green');
              } catch (error) {
                log(`  Note: Could not delete rack (may need auth): ${error.message}`, 'yellow');
              }
            } else {
              log('  Response data:', 'yellow');
              console.log(JSON.stringify(createResponse.data, null, 2));
            }
            return;
          }
          
          // If we get here, it's an unexpected status
          log(`  Unexpected status: ${createResponse.status}`, 'yellow');
          log('  Response data:', 'yellow');
          console.log(JSON.stringify(createResponse.data, null, 2));
          
          // Test 3: Get the created rack
          log('\nStep 3: Testing rack retrieval...', 'yellow');
          try {
            const getResponse = await axios.get(`${API_URL}/racks/${createResponse.data.rack.id}`);
            log('✓ Rack retrieved successfully!', 'green');
            log(`  Store: ${getResponse.data.rack.store?.name || 'N/A'}`, 'green');
          } catch (error) {
            log(`✗ Failed to retrieve rack: ${error.message}`, 'red');
          }
          
          // Test 4: Delete the test rack
          log('\nStep 4: Cleaning up test rack...', 'yellow');
          try {
            await axios.delete(`${API_URL}/racks/${createResponse.data.rack.id}`);
            log('✓ Test rack deleted successfully!', 'green');
          } catch (error) {
            log(`✗ Failed to delete rack: ${error.message}`, 'red');
          }
          
        } catch (error) {
          if (error.response) {
            log(`✗ Rack creation failed:`, 'red');
            log(`  Status: ${error.response.status}`, 'red');
            log(`  Full Response Data:`, 'red');
            console.log(JSON.stringify(error.response.data, null, 2));
            log(`  Response Headers:`, 'red');
            console.log(JSON.stringify(error.response.headers, null, 2));
          } else if (error.request) {
            log(`✗ No response received:`, 'red');
            log(`  Request: ${JSON.stringify(error.request, null, 2)}`, 'red');
          } else {
            log(`✗ Error setting up request: ${error.message}`, 'red');
          }
        }
      } else {
        log(`✗ Test failed: ${testResponse.data.error}`, 'red');
        log(`  Message: ${testResponse.data.message}`, 'red');
      }
    } catch (error) {
      log(`✗ Test endpoint failed: ${error.message}`, 'red');
      if (error.response) {
        log(`  Status: ${error.response.status}`, 'red');
        log(`  Error: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
      }
    }

    log('\n=== Test Complete ===\n', 'blue');
  } catch (error) {
    log(`\n✗ Unexpected error: ${error.message}`, 'red');
    if (error.stack) {
      log(error.stack, 'red');
    }
  }
}

// Run the test
testRackAPI().catch(console.error);

