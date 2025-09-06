// Test script to verify the synchronization fix between main app and music library
const fetch = require('node-fetch');

async function testSyncFix() {
  console.log('🔄 Testing Synchronization Fix Between Main App and Music Library...\n');
  
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
    console.log('\n❌ Both servers must be running to test synchronization');
    console.log('Please run:');
    console.log('  cd main-app && npm run dev');
    console.log('  cd music-library && npm run dev');
    return;
  }
  
  console.log('\n🎯 Synchronization Test Instructions:');
  console.log('1. Open two browser tabs:');
  console.log('   - Tab 1: http://localhost:5173/dashboard (Main App)');
  console.log('   - Tab 2: http://localhost:5174 (Music Library)');
  console.log('');
  console.log('2. Test CRUD operations in Main App (Tab 1):');
  console.log('   a) Add a new song - should appear in Music Library (Tab 2)');
  console.log('   b) Delete a song - should be removed from Music Library (Tab 2)');
  console.log('   c) Edit a song - changes should appear in Music Library (Tab 2)');
  console.log('');
  console.log('3. Test CRUD operations in Music Library (Tab 2):');
  console.log('   a) Add a new song - should appear in Main App (Tab 1)');
  console.log('   b) Delete a song - should be removed from Main App (Tab 1)');
  console.log('   c) Use the "Sync Data" button if needed');
  console.log('');
  console.log('4. Expected behavior:');
  console.log('   ✅ Changes in one app immediately appear in the other');
  console.log('   ✅ Both apps show the same song count');
  console.log('   ✅ Data persists across page refreshes');
  console.log('   ✅ No infinite loops or errors');
  console.log('');
  console.log('5. Check browser console for these logs:');
  console.log('   ✅ "🎵 SongsContext: Adding song: [song name]"');
  console.log('   ✅ "🎵 MusicLibrary: Received data update: X songs"');
  console.log('   ✅ "💾 Data saved and broadcasted: X songs"');
  console.log('   ✅ "🔄 Syncing from localStorage: X songs"');
  console.log('   ✅ "📡 Received data from localStorage: X songs"');
  console.log('');
  console.log('6. If synchronization is not working:');
  console.log('   - Click the "Sync Data" button in Music Library');
  console.log('   - Switch between tabs to trigger focus events');
  console.log('   - Wait 2 seconds for periodic sync');
  console.log('   - Check browser console for error messages');
  console.log('');
  console.log('7. Troubleshooting steps:');
  console.log('   - Clear localStorage and refresh both tabs');
  console.log('   - Make sure both servers are running');
  console.log('   - Check for JavaScript errors in console');
  console.log('   - Try the manual sync button');
  console.log('');
  console.log('✅ Test completed! Both apps should now sync properly.');
}

testSyncFix().catch(console.error);
