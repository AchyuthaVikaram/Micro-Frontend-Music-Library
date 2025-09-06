// Test script to verify data synchronization between micro frontends
const fetch = require('node-fetch');

async function testDataSynchronization() {
  console.log('🔄 Testing Data Synchronization Between Micro Frontends...\n');
  
  // Test 1: Check if both servers are running
  console.log('📡 Checking server status...');
  
  let mainAppRunning = false;
  let musicLibraryRunning = false;
  
  try {
    const mainResponse = await fetch('http://localhost:5173');
    if (mainResponse.ok) {
      console.log('✅ Main App (port 5173): Running');
      mainAppRunning = true;
    }
  } catch (error) {
    console.log('❌ Main App (port 5173): Not running');
  }
  
  try {
    const musicResponse = await fetch('http://localhost:5174');
    if (musicResponse.ok) {
      console.log('✅ Music Library (port 5174): Running');
      musicLibraryRunning = true;
    }
  } catch (error) {
    console.log('❌ Music Library (port 5174): Not running');
  }
  
  if (!mainAppRunning || !musicLibraryRunning) {
    console.log('\n❌ Both servers must be running to test data synchronization');
    console.log('Please run:');
    console.log('  cd main-app && npm run dev');
    console.log('  cd music-library && npm run dev');
    return;
  }
  
  console.log('\n🎯 Data Synchronization Test Instructions:');
  console.log('1. Open two browser tabs:');
  console.log('   - Tab 1: http://localhost:5173/dashboard');
  console.log('   - Tab 2: http://localhost:5174');
  console.log('');
  console.log('2. Test the following scenarios:');
  console.log('   a) Add a song in Tab 1 (main app) - should appear in Tab 2');
  console.log('   b) Add a song in Tab 2 (music library) - should appear in Tab 1');
  console.log('   c) Delete a song in either tab - should be removed from both');
  console.log('   d) Refresh either tab - data should persist');
  console.log('');
  console.log('3. Check browser console for synchronization logs:');
  console.log('   - Look for "🎵" prefixed messages');
  console.log('   - Look for "📡" prefixed messages');
  console.log('   - Look for "💾" prefixed messages');
  console.log('');
  console.log('4. Expected behavior:');
  console.log('   - Both tabs should show the same song count');
  console.log('   - Changes in one tab should immediately reflect in the other');
  console.log('   - Data should persist across page refreshes');
  console.log('   - Both tabs should start with 15 default songs');
  console.log('');
  console.log('🔍 Troubleshooting:');
  console.log('- If songs don\'t sync, check browser console for errors');
  console.log('- Make sure both servers are running on correct ports');
  console.log('- Try clearing localStorage and refreshing both tabs');
  console.log('- Check that both apps are using the same localStorage key');
  console.log('');
  console.log('✅ Test completed! Follow the instructions above to verify data synchronization.');
}

testDataSynchronization().catch(console.error);
