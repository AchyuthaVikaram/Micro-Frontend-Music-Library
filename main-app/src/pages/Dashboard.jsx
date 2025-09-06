// Assignment/main-app/src/pages/Dashboard.jsx

import React, { lazy, Suspense, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Music, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  const [songs, setSongs] = useState([
    {
      id: 1,
      title: "Bohemian Rhapsody",
      artist: "Queen",
      album: "A Night at the Opera",
      duration: "5:55",
      year: 1975,
      genre: "Rock"
    },
    {
      id: 2,
      title: "Hotel California",
      artist: "Eagles",
      album: "Hotel California",
      duration: "6:30",
      year: 1976,
      genre: "Rock"
    },
    {
      id: 3,
      title: "Imagine",
      artist: "John Lennon",
      album: "Imagine",
      duration: "3:07",
      year: 1971,
      genre: "Pop"
    },
    {
      id: 4,
      title: "Billie Jean",
      artist: "Michael Jackson",
      album: "Thriller",
      duration: "4:54",
      year: 1982,
      genre: "Pop"
    },
    {
      id: 5,
      title: "Stairway to Heaven",
      artist: "Led Zeppelin",
      album: "Led Zeppelin IV",
      duration: "8:02",
      year: 1971,
      genre: "Rock"
    },
    {
      id: 6,
      title: "Sweet Child O' Mine",
      artist: "Guns N' Roses",
      album: "Appetite for Destruction",
      duration: "5:03",
      year: 1987,
      genre: "Rock"
    },
    {
      id: 7,
      title: "Smells Like Teen Spirit",
      artist: "Nirvana",
      album: "Nevermind",
      duration: "5:01",
      year: 1991,
      genre: "Grunge"
    },
    {
      id: 8,
      title: "Like a Rolling Stone",
      artist: "Bob Dylan",
      album: "Highway 61 Revisited",
      duration: "6:13",
      year: 1965,
      genre: "Folk Rock"
    },
    {
      id: 9,
      title: "Purple Haze",
      artist: "Jimi Hendrix",
      album: "Are You Experienced",
      duration: "2:50",
      year: 1967,
      genre: "Rock"
    },
    {
      id: 10,
      title: "What's Going On",
      artist: "Marvin Gaye",
      album: "What's Going On",
      duration: "3:53",
      year: 1971,
      genre: "Soul"
    },
    {
      id: 11,
      title: "Good Vibrations",
      artist: "The Beach Boys",
      album: "Smiley Smile",
      duration: "3:39",
      year: 1966,
      genre: "Pop"
    },
    {
      id: 12,
      title: "Johnny B. Goode",
      artist: "Chuck Berry",
      album: "Chuck Berry Is on Top",
      duration: "2:38",
      year: 1958,
      genre: "Rock and Roll"
    },
    {
      id: 13,
      title: "Respect",
      artist: "Aretha Franklin",
      album: "I Never Loved a Man the Way I Love You",
      duration: "2:28",
      year: 1967,
      genre: "Soul"
    },
    {
      id: 14,
      title: "Hey Jude",
      artist: "The Beatles",
      album: "Hey Jude",
      duration: "7:11",
      year: 1968,
      genre: "Pop"
    },
    {
      id: 15,
      title: "Satisfaction",
      artist: "The Rolling Stones",
      album: "Out of Our Heads",
      duration: "3:44",
      year: 1965,
      genre: "Rock"
    }
  ]);

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
    
    const song = {
      ...newSong,
      id: Math.max(...songs.map(s => s.id)) + 1
    };
    setSongs(prevSongs => [...prevSongs, song]);
  };

  const handleDeleteSong = (songId) => {
    if (!isAdmin()) return;
    
    setSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/50 border-b border-gray-700 px-6 py-4"
      >
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Music Dashboard</h1>
            <p className="text-gray-400 text-sm">
              Manage your music collection • {songs.length} songs total
            </p>
          </div>
        </div>
      </motion.div>

      {/* Music Library Micro Frontend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6"
      >
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
            onAddSong={isAdmin() ? handleAddSong : undefined}
            onDeleteSong={isAdmin() ? handleDeleteSong : undefined}
          />
        </Suspense>
      </motion.div>
    </div>
  );
};

export default Dashboard;
