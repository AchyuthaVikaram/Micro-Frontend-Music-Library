// Assignment/main-app/src/context/SongsContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';

const SongsContext = createContext();

export const useSongs = () => {
  const context = useContext(SongsContext);
  if (!context) {
    throw new Error('useSongs must be used within a SongsProvider');
  }
  return context;
};

export const SongsProvider = ({ children }) => {
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
      title: "Thriller",
      artist: "Michael Jackson",
      album: "Thriller",
      duration: "5:57",
      year: 1982,
      genre: "Pop"
    },
    {
      id: 12,
      title: "Comfortably Numb",
      artist: "Pink Floyd",
      album: "The Wall",
      duration: "6:23",
      year: 1979,
      genre: "Progressive Rock"
    },
    {
      id: 13,
      title: "Yesterday",
      artist: "The Beatles",
      album: "Help!",
      duration: "2:05",
      year: 1965,
      genre: "Pop"
    },
    {
      id: 14,
      title: "Good Vibrations",
      artist: "The Beach Boys",
      album: "Smiley Smile",
      duration: "3:39",
      year: 1966,
      genre: "Pop"
    },
    {
      id: 15,
      title: "Respect",
      artist: "Aretha Franklin",
      album: "I Never Loved a Man the Way I Love You",
      duration: "2:28",
      year: 1967,
      genre: "Soul"
    }
  ]);

  // Load songs from localStorage on mount
  useEffect(() => {
    const savedSongs = localStorage.getItem('musicLibrarySongs');
    if (savedSongs) {
      try {
        setSongs(JSON.parse(savedSongs));
      } catch (error) {
        console.error('Error loading songs from localStorage:', error);
        // If localStorage is corrupted, save default songs
        localStorage.setItem('musicLibrarySongs', JSON.stringify(songs));
      }
    } else {
      // If no songs in localStorage, save the default 15 songs
      localStorage.setItem('musicLibrarySongs', JSON.stringify(songs));
      console.log('🎯 Initialized localStorage with 15 default songs');
    }
  }, []);

  // Save songs to localStorage whenever songs change
  useEffect(() => {
    localStorage.setItem('musicLibrarySongs', JSON.stringify(songs));
    
    // Dispatch custom event to notify other instances (like music-library on port 5174)
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

  const addSong = (newSong) => {
    const song = {
      ...newSong,
      id: Math.max(...songs.map(s => s.id), 0) + 1,
      year: newSong.year ? parseInt(newSong.year) : null
    };
    setSongs(prevSongs => [...prevSongs, song]);
    return song;
  };

  const updateSong = (songId, updatedSong) => {
    setSongs(prevSongs =>
      prevSongs.map(song =>
        song.id === songId
          ? { ...updatedSong, id: songId, year: updatedSong.year ? parseInt(updatedSong.year) : null }
          : song
      )
    );
  };

  const deleteSong = (songId) => {
    setSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
  };

  const getSongById = (songId) => {
    return songs.find(song => song.id === songId);
  };

  const value = {
    songs,
    addSong,
    updateSong,
    deleteSong,
    getSongById,
    setSongs // For bulk operations if needed
  };

  return (
    <SongsContext.Provider value={value}>
      {children}
    </SongsContext.Provider>
  );
};
