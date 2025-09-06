// Assignment/main-app/src/pages/Dashboard.jsx

import React, { lazy, Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Music, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSongs } from '../context/SongsContext';

// Enhanced lazy loading with retry mechanism
const MusicLibrary = lazy(() => 
  import('music-library/MusicLibrary')
    .then(module => {
      console.log('✅ Music Library loaded successfully');
      return module;
    })
    .catch(error => {
      console.error('❌ Failed to load Music Library:', error);
      return {
        default: () => (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Music Library Unavailable
            </h3>
            <p className="text-gray-400 mb-4">
              The music library micro frontend could not be loaded.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Make sure the music-library app is running on port 5174
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        )
      };
    })
);

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const { songs, addSong, deleteSong, isLoading: songsLoading } = useSongs();
  const [remoteLoaded, setRemoteLoaded] = useState(false);

  useEffect(() => {
    // Check if remote is accessible
    const checkRemote = async () => {
      try {
        // Try both possible paths for remoteEntry.js
        const paths = [
          'http://localhost:5174/assets/remoteEntry.js',
          'http://localhost:5174/remoteEntry.js'
        ];
        
        let found = false;
        for (const path of paths) {
          try {
            const response = await fetch(path);
            if (response.ok) {
              console.log(`✅ Remote entry accessible at: ${path}`);
              setRemoteLoaded(true);
              found = true;
              break;
            }
          } catch (e) {
            console.log(`❌ Failed to access: ${path}`);
          }
        }
        
        if (!found) {
          console.warn('⚠️ Remote entry not accessible at any expected path');
          // Try to check if the server is running at all
          try {
            const serverResponse = await fetch('http://localhost:5174');
            if (serverResponse.ok) {
              console.log('✅ Music library server is running, but remoteEntry.js not found');
            }
          } catch (e) {
            console.log('❌ Music library server is not running');
          }
        }
      } catch (error) {
        console.error('❌ Remote check failed:', error);
      }
    };

    checkRemote();
  }, []);

  const handleAddSong = (newSong) => {
    if (!isAdmin()) return;
    return addSong(newSong);
  };

  const handleDeleteSong = (songId) => {
    if (!isAdmin()) return;
    deleteSong(songId);
  };

  // Debug logging for songs data
  console.log('🎯 Dashboard songs data:', {
    songsCount: songs.length,
    firstFewSongs: songs.slice(0, 3).map(s => ({ id: s.id, title: s.title, artist: s.artist })),
    userRole: user?.role
  });

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-5 sm:px-6 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl"
      >
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col items-center justify-center gap-3 text-center md:flex-row md:justify-start md:text-left md:gap-4 mb-4">
            <div className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-3">
              <Music className="h-7 w-7 text-white md:h-8 md:w-8" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">Music Library Dashboard</h1>
              <p className="text-sm md:text-base text-gray-400 mt-0.5">
                Welcome back, <span className="text-blue-400">{user?.name}</span>!
                <span className="mx-1 hidden md:inline">•</span>
                <span className="block md:inline">Role: <span className="capitalize text-purple-400">{user?.role}</span></span>
              </p>
            </div>
          </div>

          {/* Status Widgets: stacked on mobile, pills on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Remote Status */}
            <motion.div
              whileHover={{ y: -1 }}
              className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-800/60 px-4 py-3"
            >
              <span className={`h-2.5 w-2.5 rounded-full ${remoteLoaded ? 'bg-green-400' : 'bg-red-400'}`} />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-gray-400">Remote Status</p>
                <p className="text-sm font-medium text-white">{remoteLoaded ? 'Connected' : 'Checking...'}</p>
              </div>
            </motion.div>

            {/* Songs Count */}
            <motion.div
              whileHover={{ y: -1 }}
              className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-800/60 px-4 py-3"
            >
              <span className={`h-2.5 w-2.5 rounded-full ${songsLoading ? 'bg-yellow-400' : 'bg-blue-400'}`} />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-gray-400">Tracks</p>
                <p className="text-sm font-medium text-white">{songsLoading ? 'Loading...' : `${songs.length} loaded`}</p>
              </div>
            </motion.div>

            {/* Data Sync */}
            <motion.div
              whileHover={{ y: -1 }}
              className="flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-800/60 px-4 py-3"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-purple-400" />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-gray-400">Data Sync</p>
                <p className="text-sm font-medium text-white">Active</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Music Library Component */}
        <div className="rounded-2xl border border-gray-800 bg-gray-800/50 backdrop-blur-sm p-4 md:p-6">
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center p-10 md:p-12 text-center">
                <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
                <p className="mb-1 text-gray-300">Loading Music Library...</p>
                <p className="text-xs text-gray-500">Connecting to micro frontend on port 5174</p>
              </div>
            }
          >
            <MusicLibrary
              songs={songs}
              role={user?.role}
              onAddSong={handleAddSong}
              onDeleteSong={handleDeleteSong}
            />
          </Suspense>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
