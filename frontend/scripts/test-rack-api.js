/**
 * Test script for Rack API
 * Run with: node scripts/test-rack-api.js
 */

const axios = require('axios');

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
      } else {
        log(`✗ Test failed: ${testResponse.data.error}`, 'red');
        log(`  Message: ${testResponse.data.message}`, 'red');
        return;
      }
    } catch (error) {
      log(`✗ Test endpoint failed: ${error.message}`, 'red');
      if (error.response) {
        log(`  Status: ${error.response.status}`, 'red');
        log(`  Error: ${JSON.stringify(error.response.data, null, 2)}`, 'red');
      }
      return;
    }

    // Step 2: Get authentication token (you'll need to login first)
    log('\nStep 2: Testing rack creation...', 'yellow');
    log('Note: This test requires authentication. Please login first and set your token.', 'yellow');
    
    // For now, we'll test without auth to see the error
    const testRackData = {
      rackNumber: `TEST-${Date.now()}`,
      storeId: 'test-store-id', // This will fail, but we'll see the error
      description: 'Test rack',
      status: 'A',
    };

    try {
      const createResponse = await axios.post(`${API_URL}/racks`, testRackData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      log('✓ Rack created successfully!', 'green');
      log(`  Rack ID: ${createResponse.data.rack.id}`, 'green');
    } catch (error) {
      if (error.response) {
        log(`✗ Rack creation failed:`, 'red');
        log(`  Status: ${error.response.status}`, 'red');
        log(`  Error: ${error.response.data.error || 'Unknown error'}`, 'red');
        log(`  Message: ${error.response.data.message || 'No message'}`, 'red');
        if (error.response.data.code) {
          log(`  Code: ${error.response.data.code}`, 'red');
        }
        if (error.response.data.details) {
          log(`  Details: ${JSON.stringify(error.response.data.details, null, 2)}`, 'red');
        }
      } else {
        log(`✗ Network error: ${error.message}`, 'red');
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
testRackAPI();

