// Assignment/main-app/src/pages/Dashboard.jsx

import React, { lazy, Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Music, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSongs } from '../context/SongsContext';

// Enhanced lazy loading with retry mechanism
const MusicLibrary = lazy(() => 
  import('musicLibrary/MusicLibrary')
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
    <div className="min-h-screen bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
              <Music className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Music Library Dashboard</h1>
              <p className="text-gray-400">
                Welcome back, <span className="text-blue-400">{user?.name}</span>! 
                You're logged in as <span className="capitalize text-purple-400">{user?.role}</span>
              </p>
            </div>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${remoteLoaded ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-gray-400">
                Remote Status: {remoteLoaded ? 'Connected' : 'Checking...'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${songsLoading ? 'bg-yellow-400' : 'bg-blue-400'}`} />
              <span className="text-gray-400">
                Songs: {songsLoading ? 'Loading...' : `${songs.length} tracks loaded`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400" />
              <span className="text-gray-400">
                Data Sync: Active
              </span>
            </div>
          </div>
        </div>

        {/* Music Library Component */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
          <Suspense 
            fallback={
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
                <p className="text-gray-400 mb-2">Loading Music Library...</p>
                <p className="text-sm text-gray-500">Connecting to micro frontend on port 5174</p>
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
