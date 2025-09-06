// Assignment/main-app/src/context/SongsContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from './ToastContext';
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
  const { push } = useToast();
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
    const song = {
      ...newSong,
      id: Math.max(...songs.map(s => s.id), 0) + 1,
      year: newSong.year ? parseInt(newSong.year) : null
    };
    setSongs(prevSongs => [...prevSongs, song]);
    try {
      push({ title: 'Song added', description: `${song.title} by ${song.artist}`, variant: 'success' });
    } catch {}
    return song;
  }, [songs, push]);

  // Define getSongById BEFORE other callbacks that reference it
  const getSongById = useCallback((songId) => {
    return dataSyncService.getSongById(songId);
  }, []);

  const updateSong = useCallback((songId, updatedSong) => {
    setSongs(prevSongs =>
      prevSongs.map(song =>
        song.id === songId
          ? { ...updatedSong, id: songId, year: updatedSong.year ? parseInt(updatedSong.year) : null }
          : song
      )
    );
    try {
      const t = updatedSong?.title || getSongById(songId)?.title || 'Song';
      push({ title: 'Song updated', description: `${t} updated successfully`, variant: 'success' });
    } catch {}
    return dataSyncService.updateSong(songId, updatedSong);
  }, [push, getSongById]);

  const deleteSong = useCallback((songId) => {
    setSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
    try {
      const removed = getSongById(songId);
      const label = removed ? removed.title : 'Song';
      push({ title: 'Song deleted', description: `${label} removed`, variant: 'success' });
    } catch {}
    dataSyncService.deleteSong(songId);
  }, [push, getSongById]);

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
