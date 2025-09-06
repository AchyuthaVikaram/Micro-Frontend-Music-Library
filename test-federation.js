// Test script to verify Module Federation setup
const fetch = require('node-fetch');

async function testModuleFederation() {
  console.log('🔍 Testing Module Federation Setup...\n');
  
  // Test 1: Check if music-library server is running
  try {
    const response = await fetch('http://localhost:5174');
    console.log('✅ Music Library server is running on port 5174');
    console.log(`   Status: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.log('❌ Music Library server is NOT running on port 5174');
    console.log(`   Error: ${error.message}`);
    return;
  }
  
  // Test 2: Check if remoteEntry.js is accessible
  try {
    const response = await fetch('http://localhost:5174/remoteEntry.js');
    if (response.ok) {
      console.log('✅ remoteEntry.js is accessible');
      const content = await response.text();
      console.log(`   Size: ${content.length} bytes`);
      
      // Check if it contains expected Module Federation code
      if (content.includes('music-library') || content.includes('MusicLibrary')) {
        console.log('✅ remoteEntry.js contains expected module exports');
      } else {
        console.log('⚠️  remoteEntry.js may not contain expected exports');
      }
    } else {
      console.log('❌ remoteEntry.js is NOT accessible');
      console.log(`   Status: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.log('❌ Failed to fetch remoteEntry.js');
    console.log(`   Error: ${error.message}`);
  }
  
  // Test 3: Check if main-app server is running
  try {
    const response = await fetch('http://localhost:5173');
    console.log('✅ Main App server is running on port 5173');
    console.log(`   Status: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.log('❌ Main App server is NOT running on port 5173');
    console.log(`   Error: ${error.message}`);
  }
  
  console.log('\n📋 Troubleshooting Steps:');
  console.log('1. Make sure both servers are running:');
  console.log('   cd music-library && npm run dev');
  console.log('   cd main-app && npm run dev');
  console.log('2. Check browser console for detailed error messages');
  console.log('3. Verify no firewall is blocking localhost connections');
  console.log('4. Try accessing http://localhost:5174/remoteEntry.js directly in browser');
}

testModuleFederation().catch(console.error);
