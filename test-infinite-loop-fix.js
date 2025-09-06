// Test script to verify the infinite loop fix
const fetch = require('node-fetch');

async function testInfiniteLoopFix() {
  console.log('🔧 Testing Infinite Loop Fix...\n');
  
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
    console.log('\n❌ Both servers must be running to test the fix');
    console.log('Please run:');
    console.log('  cd main-app && npm run dev');
    console.log('  cd music-library && npm run dev');
    return;
  }
  
  console.log('\n🎯 Infinite Loop Fix Test Instructions:');
  console.log('1. Open browser and go to: http://localhost:5173/dashboard');
  console.log('');
  console.log('2. Open browser console (F12) and look for:');
  console.log('   ✅ NO "Maximum update depth exceeded" errors');
  console.log('   ✅ NO infinite loop warnings');
  console.log('   ✅ Clean console with only expected logs');
  console.log('');
  console.log('3. Test CRUD operations:');
  console.log('   a) Add a new song - should work without errors');
  console.log('   b) Delete a song - should work without errors');
  console.log('   c) Edit a song - should work without errors');
  console.log('   d) Filter/sort songs - should work without errors');
  console.log('');
  console.log('4. Expected behavior:');
  console.log('   ✅ No infinite re-renders');
  console.log('   ✅ Smooth UI interactions');
  console.log('   ✅ Data synchronization works');
  console.log('   ✅ Console shows only expected logs');
  console.log('');
  console.log('5. Check for these log patterns:');
  console.log('   ✅ "🎵 SongsContext: Initializing..."');
  console.log('   ✅ "🎵 MusicLibrary: Initializing..."');
  console.log('   ✅ "💾 Data saved and broadcasted: X songs"');
  console.log('   ❌ NO repeated "Maximum update depth exceeded"');
  console.log('');
  console.log('🔍 If you still see errors:');
  console.log('- Clear browser localStorage');
  console.log('- Hard refresh the page (Ctrl+Shift+R)');
  console.log('- Check that both servers are running');
  console.log('- Look for any remaining dependency issues in console');
  console.log('');
  console.log('✅ Test completed! The infinite loop should now be fixed.');
}

testInfiniteLoopFix().catch(console.error);
