// Assignment/main-app/src/context/SongsContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import dataSyncService from '../utils/dataSync';

const SongsContext = createContext();

export const useSongs = () => {
  const context = useContext(SongsContext);
  if (!context) {
    throw new Error('useSongs must be used within a SongsProvider');
  }
  return context;
};

export const SongsProvider = ({ children }) => {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize with data from the sync service
  useEffect(() => {
    console.log('🎵 SongsContext: Initializing with dataSyncService...');
    
    // Get initial data
    const initialData = dataSyncService.getData();
    setSongs(initialData);
    setIsLoading(false);
    
    console.log('🎵 SongsContext: Initial data loaded:', initialData.length, 'songs');

    // Subscribe to data changes with a stable callback
    const unsubscribe = dataSyncService.subscribe((newData) => {
      console.log('🎵 SongsContext: Received data update:', newData.length, 'songs');
      // Only update if the data has actually changed
      setSongs(prevSongs => {
        if (JSON.stringify(prevSongs) !== JSON.stringify(newData)) {
          return newData;
        }
        return prevSongs;
      });
    });

    // Cleanup subscription on unmount
    return () => {
      console.log('🎵 SongsContext: Cleaning up subscription');
      unsubscribe();
    };
  }, []);

  // Memoize the callback functions to prevent unnecessary re-renders
  const addSong = useCallback((newSong) => {
    console.log('🎵 SongsContext: Adding song:', newSong.title);
    const addedSong = dataSyncService.addSong(newSong);
    return addedSong;
  }, []);

  const updateSong = useCallback((songId, updatedSong) => {
    console.log('🎵 SongsContext: Updating song:', songId);
    const updatedSongData = dataSyncService.updateSong(songId, updatedSong);
    return updatedSongData;
  }, []);

  const deleteSong = useCallback((songId) => {
    console.log('🎵 SongsContext: Deleting song:', songId);
    dataSyncService.deleteSong(songId);
  }, []);

  const getSongById = useCallback((songId) => {
    return dataSyncService.getSongById(songId);
  }, []);

  const refreshSongs = useCallback(() => {
    console.log('🎵 SongsContext: Manually refreshing songs');
    const currentData = dataSyncService.syncFromStorage();
    setSongs(currentData);
  }, []);

  const getStats = useCallback(() => {
    return dataSyncService.getStats();
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    songs,
    addSong,
    updateSong,
    deleteSong,
    getSongById,
    refreshSongs,
    getStats,
    isLoading,
    setSongs // For bulk operations if needed
  }), [songs, addSong, updateSong, deleteSong, getSongById, refreshSongs, getStats, isLoading]);

  return (
    <SongsContext.Provider value={value}>
      {children}
    </SongsContext.Provider>
  );
};
