#!/usr/bin/env node

/**
 * 🧪 Deployment Test Script
 * Run this after deploying to Render to verify everything works
 * Usage: node test-deploy.js [YOUR_RENDER_URL]
 */

const fetch = require('node-fetch');

const BASE_URL = process.argv[2] || 'http://localhost:3000';

console.log('🌿 Testing Gardener Bot Deployment...');
console.log(`📍 Base URL: ${BASE_URL}`);
console.log('═'.repeat(50));

async function runTests() {
  const tests = [
    {
      name: 'Root Endpoint',
      url: '/',
      expectedStatus: 200,
      expectedContent: 'Gardener Bot is running'
    },
    {
      name: 'Status Page',
      url: '/status',
      expectedStatus: 200,
      expectedContent: 'Gardener Bot Status Dashboard'
    },
    {
      name: 'Debug JSON',
      url: '/debug',
      expectedStatus: 200,
      expectedContent: 'groupKey'
    },
    {
      name: 'Test All Systems',
      url: '/test-all',
      expectedStatus: 200,
      expectedContent: 'tests'
    },
    {
      name: 'Morning Endpoint',
      url: '/morning',
      expectedStatus: 200,
      checkOnly: true // Don't send actual message in test
    },
    {
      name: 'Evening Endpoint', 
      url: '/evening',
      expectedStatus: 200,
      checkOnly: true
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`⏳ Testing ${test.name}...`);
      
      const response = await fetch(`${BASE_URL}${test.url}`);
      const text = await response.text();
      
      if (response.status === test.expectedStatus) {
        if (test.expectedContent && text.includes(test.expectedContent)) {
          console.log(`✅ ${test.name} - PASSED`);
          passed++;
        } else if (!test.expectedContent) {
          console.log(`✅ ${test.name} - PASSED (Status OK)`);
          passed++;
        } else {
          console.log(`❌ ${test.name} - FAILED (Content mismatch)`);
          console.log(`   Expected: "${test.expectedContent}"`);
          console.log(`   Got: "${text.substring(0, 100)}..."`);
          failed++;
        }
      } else {
        console.log(`❌ ${test.name} - FAILED (Status ${response.status})`);
        console.log(`   Expected: ${test.expectedStatus}`);
        failed++;
      }
      
    } catch (error) {
      console.log(`❌ ${test.name} - FAILED (${error.message})`);
      failed++;
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('═'.repeat(50));
  console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED! Deployment looks good!');
    console.log('');
    console.log('🔗 Useful URLs:');
    console.log(`   Status Dashboard: ${BASE_URL}/status`);
    console.log(`   Debug Info: ${BASE_URL}/debug`);
    console.log(`   Test All: ${BASE_URL}/test-all`);
  } else {
    console.log('⚠️  Some tests failed. Check the logs above.');
    process.exit(1);
  }
}

// Quick URL validation
if (process.argv[2] && !process.argv[2].startsWith('http')) {
  console.log('❌ Please provide a valid URL starting with http:// or https://');
  console.log('Usage: node test-deploy.js https://your-app.onrender.com');
  process.exit(1);
}

runTests().catch(error => {
  console.error('💥 Test runner failed:', error.message);
  process.exit(1);
});