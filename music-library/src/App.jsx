import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FilterBar from './components/FilterBar';
import SongCard from './components/SongCard';
import GroupedSongs from './components/GroupedSongs';
import { filterSongsByQuery } from './utils/filterSongs';
import { sortSongs } from './utils/sortSongs';
import { groupSongs } from './utils/groupSongs';
import { Music, Plus, X } from 'lucide-react';

// Add Song Modal Component
const AddSongModal = ({ isOpen, onClose, onAddSong }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    duration: '',
    year: '',
    genre: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.artist) {
      onAddSong({
        ...formData,
        year: formData.year ? parseInt(formData.year) : null
      });
      setFormData({
        title: '',
        artist: '',
        album: '',
        duration: '',
        year: '',
        genre: ''
      });
      onClose();
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Add New Song</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Artist *
            </label>
            <input
              type="text"
              name="artist"
              value={formData.artist}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Album
            </label>
            <input
              type="text"
              name="album"
              value={formData.album}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="3:45"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Year
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="1900"
                max="2030"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Genre
            </label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white hover:bg-gray-700 px-4 py-2 rounded-md font-medium transition-colors flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md font-medium transition-colors flex-1"
            >
              Add Song
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Main MusicLibrary Component
const MusicLibrary = ({ 
  songs: propsSongs = [], 
  role = 'user', 
  onAddSong, 
  onDeleteSong 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [groupBy, setGroupBy] = useState('album');
  const [isGrouped, setIsGrouped] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Shared state management using localStorage
  const [songs, setSongs] = useState(() => {
    const storedSongs = localStorage.getItem('musicLibrarySongs');
    if (storedSongs) {
      try {
        const parsed = JSON.parse(storedSongs);
        console.log('🎵 Loaded songs from localStorage:', parsed.length);
        return parsed;
      } catch (error) {
        console.error('Error parsing localStorage songs:', error);
        return propsSongs.length > 0 ? propsSongs : [];
      }
    }
    // Initialize with props if available, otherwise empty array
    console.log('🎵 No localStorage songs, using props:', propsSongs.length);
    return propsSongs.length > 0 ? propsSongs : [];
  });

  // Initialize localStorage if empty and we have songs
  useEffect(() => {
    const storedSongs = localStorage.getItem('musicLibrarySongs');
    if (!storedSongs && songs.length === 0 && propsSongs.length > 0) {
      console.log('🎵 Initializing localStorage with props songs');
      setSongs(propsSongs);
    }
  }, [propsSongs]);

  // Sync with localStorage and listen for changes from other windows/tabs
  useEffect(() => {
    // Save to localStorage whenever songs change
    localStorage.setItem('musicLibrarySongs', JSON.stringify(songs));

    // Dispatch custom event to notify other instances
    window.dispatchEvent(new CustomEvent('songsUpdated', { detail: songs }));
  }, [songs]);

  // Listen for localStorage changes from other windows/tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'musicLibrarySongs' && e.newValue) {
        setSongs(JSON.parse(e.newValue));
      }
    };

    const handleCustomSongsUpdate = (e) => {
      setSongs(e.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('songsUpdated', handleCustomSongsUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('songsUpdated', handleCustomSongsUpdate);
    };
  }, []);

  // Sync with props when they change (for micro frontend integration)
  useEffect(() => {
    if (propsSongs && propsSongs.length > 0) {
      setSongs(propsSongs);
    }
  }, [propsSongs]);

  // Debug logging
  console.log('🎵 MusicLibrary state:', {
    songsCount: songs.length,
    propsSongsCount: propsSongs?.length || 0,
    role,
    hasOnAddSong: !!onAddSong,
    hasOnDeleteSong: !!onDeleteSong,
    firstSong: songs[0]?.title || 'No songs'
  });

  // Process songs with filter, sort, and group
  const processedSongs = useMemo(() => {
    let filtered = filterSongsByQuery(songs, searchQuery);
    let sorted = sortSongs(filtered, sortBy);
    
    if (isGrouped) {
      return groupSongs(sorted, groupBy);
    }
    
    return sorted;
  }, [songs, searchQuery, sortBy, groupBy, isGrouped]);

  const handleAddSong = (songData) => {
    if (onAddSong) {
      setSongs([...songs, songData]);
      onAddSong(songData);
    }
  };

  const handleDeleteSong = (songId) => {
    if (onDeleteSong) {
      setSongs(songs.filter(song => song.id !== songId));
      onDeleteSong(songId);
    }
  };

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="bg-blue-500 p-3 rounded-2xl">
              <Music className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Music Library
          </h1>
          <p className="text-gray-400">
            {songs.length} songs • {role === 'admin' ? 'Admin Access' : 'User Access'}
          </p>
        </motion.div>

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          groupBy={groupBy}
          onGroupChange={setGroupBy}
          isGrouped={isGrouped}
          onToggleGroup={() => setIsGrouped(!isGrouped)}
          role={role}
          onAddSong={role === 'admin' ? handleOpenAddModal : null}
        />

        {/* Songs Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isGrouped ? (
            <GroupedSongs
              groupedSongs={processedSongs}
              groupBy={groupBy}
              role={role}
              onDeleteSong={handleDeleteSong}
            />
          ) : (
            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {processedSongs.map((song, index) => (
                <SongCard
                  key={song.id}
                  song={song}
                  role={role}
                  onDelete={handleDeleteSong}
                  index={index}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {processedSongs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-white text-xl mb-4">No songs found</div>
              <p className="text-gray-400">
                Try adjusting your search or filters
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Add Song Modal */}
        <AnimatePresence>
          {showAddModal && (
            <AddSongModal
              isOpen={showAddModal}
              onClose={() => setShowAddModal(false)}
              onAddSong={handleAddSong}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MusicLibrary;
