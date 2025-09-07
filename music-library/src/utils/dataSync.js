// Shared data synchronization service for micro frontends
// This ensures data consistency between main-app and music-library

import { BASE_URL } from './constants';

class DataSyncService {
  constructor() {
    this.storageKey = 'musicLibrarySongs';
    this.channel = new BroadcastChannel('music_library_sync');
    this.listeners = new Set();
    this.isInitialized = false;
  }

  // Initialize the service
  init() {
    if (this.isInitialized) return;
    console.log('🔄 Initializing DataSyncService in music-library...');
    this.setupEventListeners();
    this.initializeDefaultData(); // Initialize with local data first
    this.isInitialized = true;
    console.log('✅ DataSyncService initialized in music-library');
    // Request fresh data from the main-app
    console.log('📢 music-library: Requesting songs from main-app...');
    this.channel.postMessage({ type: 'REQUEST_SONGS' });
  }

  // Set up event listeners for cross-microfrontend communication
  setupEventListeners() {
    this.channel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'SYNC_SONGS' || type === 'DATA_READY') {
        console.log(`📡 music-library: Received ${type} event with`, payload.length, 'songs.');
        this.setData(payload);
      }
    };

    // Listen for localStorage changes to sync across tabs of the same app
    window.addEventListener('storage', this.handleStorageChange.bind(this));
  }


  // Handle localStorage changes from other tabs/windows
  handleStorageChange(event) {
    if (event.key === this.storageKey && event.newValue) {
      try {
        const newData = JSON.parse(event.newValue);
        console.log('📡 Received data from localStorage:', newData.length, 'songs');
        this.notifyListeners(newData);
      } catch (error) {
        console.error('❌ Error parsing localStorage data:', error);
      }
    }
  }

  // Handle custom events from same tab
  handleCustomEvent(event) {
    if (event.detail) {
      console.log('📡 Received data from custom event:', event.detail.length, 'songs');
      this.notifyListeners(event.detail);
    }
  }

  // Handle visibility changes to sync when tab becomes active
  handleVisibilityChange() {
    if (!document.hidden) {
      console.log('👁️ Tab became visible, syncing data...');
      this.syncFromStorage();
    }
  }

  // Handle window focus to sync when tab becomes active
  handleWindowFocus() {
    console.log('🎯 Window focused, syncing data...');
    this.syncFromStorage();
  }

  // Handle page show event (when tab becomes active)
  handlePageShow() {
    console.log('📄 Page shown, syncing data...');
    this.syncFromStorage();
  }

  // Provide a reusable list of default songs
  getDefaultSongs() {
    return [
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
    ];
  }

  // Initialize with default data if localStorage is empty
  initializeDefaultData() {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      let needsSeed = false;
      if (!storedData) {
        needsSeed = true;
      } else {
        try {
          const parsed = JSON.parse(storedData);
          if (Array.isArray(parsed) && parsed.length === 0) {
            needsSeed = true;
          }
        } catch (_) {
          // Corrupted data, reseed
          needsSeed = true;
        }
      }

      if (needsSeed) {
        const defaultSongs = this.getDefaultSongs();
        this.setData(defaultSongs);
        console.log('🎯 Initialized with 15 default songs');
      }
    } catch (error) {
      console.warn('⚠️ initializeDefaultData failed; attempting to seed defaults.', error);
      const fallback = this.getDefaultSongs();
      this.setData(fallback);
    }
  }

  // Get current data from localStorage
  getData() {
    try {
      const storedData = localStorage.getItem(this.storageKey);
      return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      console.error('❌ Error reading data from localStorage:', error);
      return [];
    }
  }

  // Set data and notify all listeners
  setData(data) {
    try {
      const dataToStore = Array.isArray(data) ? data : [];
      const dataString = JSON.stringify(dataToStore);
      
      // Only update if data has actually changed
      const currentData = localStorage.getItem(this.storageKey);
      if (currentData === dataString) {
        console.log('💾 Data unchanged, skipping update');
        return dataToStore;
      }
      
      localStorage.setItem(this.storageKey, dataString);
      
      // Notify listeners in same tab
      window.dispatchEvent(new CustomEvent(this.eventName, { detail: dataToStore }));
      
      // Broadcast changes to other contexts (like the main-app)
      this.channel.postMessage({ type: 'SYNC_SONGS', payload: dataToStore });
      
      console.log('💾 Data saved and broadcasted:', dataToStore.length, 'songs');
      return dataToStore;
    } catch (error) {
      console.error('❌ Error saving data to localStorage:', error);
      return [];
    }
  }

  // Add a song
  addSong(songData) {
    const currentData = this.getData();
    const newSong = {
      ...songData,
      id: Math.max(...currentData.map(s => s.id), 0) + 1,
      year: songData.year ? parseInt(songData.year) : null
    };
    
    const updatedData = [...currentData, newSong];
    this.setData(updatedData);
    return newSong;
  }

  // Update a song
  updateSong(songId, updatedSong) {
    const currentData = this.getData();
    const updatedData = currentData.map(song =>
      song.id === songId
        ? { ...updatedSong, id: songId, year: updatedSong.year ? parseInt(updatedSong.year) : null }
        : song
    );
    
    this.setData(updatedData);
    return updatedData.find(song => song.id === songId);
  }

  // Delete a song
  deleteSong(songId) {
    const currentData = this.getData();
    const updatedData = currentData.filter(song => song.id !== songId);
    this.setData(updatedData);
    return updatedData;
  }

  // Get song by ID
  getSongById(songId) {
    const currentData = this.getData();
    return currentData.find(song => song.id === songId);
  }

  // Subscribe to data changes
  subscribe(callback) {
    this.listeners.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Notify all listeners of data changes
  notifyListeners(data) {
    this.listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('❌ Error in data change listener:', error);
      }
    });
  }

  // Sync data from localStorage (useful for manual sync)
  syncFromStorage() {
    const data = this.getData();
    console.log('🔄 Syncing from localStorage:', data.length, 'songs');
    this.notifyListeners(data);
    return data;
  }

  // Clear all data
  clearData() {
    localStorage.removeItem(this.storageKey);
    this.notifyListeners([]);
  }

  // Get data statistics
  getStats() {
    const data = this.getData();
    return {
      totalSongs: data.length,
      artists: [...new Set(data.map(song => song.artist))].length,
      albums: [...new Set(data.map(song => song.album))].length,
      genres: [...new Set(data.map(song => song.genre))].length
    };
  }

  // Cleanup method
  destroy() {
    window.removeEventListener('storage', this.handleStorageChange.bind(this));
    window.removeEventListener(this.eventName, this.handleCustomEvent.bind(this));
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    window.removeEventListener('focus', this.handleWindowFocus.bind(this));
    window.removeEventListener('pageshow', this.handlePageShow.bind(this));
    
    // Clear periodic sync interval
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    
    this.listeners.clear();
    this.isInitialized = false;
  }
}

// Create and export a singleton instance
const dataSyncService = new DataSyncService();

// Auto-initialize when the module is loaded
if (typeof window !== 'undefined') {
  dataSyncService.init();
}

export default dataSyncService;
