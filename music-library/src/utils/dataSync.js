// Shared data synchronization service for micro frontends
// This ensures data consistency between main-app and music-library

class DataSyncService {
  constructor() {
    this.storageKey = 'musicLibrarySongs';
    this.eventName = 'songsUpdated';
    this.listeners = new Set();
    this.isInitialized = false;
    this.retryCount = 0;
    this.maxRetries = 3;

    // Cross-origin bridge (to main-app on 5173)
    this.bridgeUrl = 'http://localhost:5173/bridge.html';
    this.bridgeOrigin = 'http://localhost:5173';
    this.bridgeWindow = null;
    this.bridgeReady = false;
    this.pendingRequests = new Map(); // requestId -> { resolve, reject, timer }
    this.requestCounter = 0;
  }

  // Initialize the service
  init() {
    if (this.isInitialized) return;
    
    console.log('🔄 Initializing DataSyncService...');
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Initialize with default data if needed
    this.initializeDefaultData();
    
    // Spin up cross-origin bridge to main-app for true MF sync
    this.setupBridge();
    
    this.isInitialized = true;
    console.log('✅ DataSyncService initialized');
  }

  // Set up event listeners for cross-microfrontend communication
  setupEventListeners() {
    // Listen for localStorage changes (cross-tab communication)
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    
    // Listen for custom events (same-tab communication)
    window.addEventListener(this.eventName, this.handleCustomEvent.bind(this));
    
    // Listen for visibility changes to sync when tab becomes active
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Listen for window focus to sync when tab becomes active
    window.addEventListener('focus', this.handleWindowFocus.bind(this));
    
    // Listen for page show event (when tab becomes active)
    window.addEventListener('pageshow', this.handlePageShow.bind(this));
    
    // Add periodic sync for standalone music library
    this.setupPeriodicSync();
  }

  // Create hidden iframe bridge to main-app to exchange messages
  setupBridge() {
    try {
      // Avoid duplicate iframes
      const existing = document.getElementById('mf-bridge-5173');
      if (existing) {
        this.bridgeWindow = existing.contentWindow;
      } else {
        const iframe = document.createElement('iframe');
        iframe.id = 'mf-bridge-5173';
        iframe.src = this.bridgeUrl;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        this.bridgeWindow = iframe.contentWindow;
        iframe.addEventListener('load', () => {
          // Bridge is likely ready shortly after load
          this.bridgeReady = true;
          // Request a fresh copy of songs from main-app
          this.requestSongsFromBridge().catch(() => {});
        });
      }

      // Global listener for bridge messages
      window.addEventListener('message', (event) => {
        if (event.origin !== this.bridgeOrigin) return;
        const { type, payload, requestId } = event.data || {};
        if (type === 'BRIDGE_READY') {
          this.bridgeReady = true;
          this.requestSongsFromBridge().catch(() => {});
          return;
        }
        if (requestId && this.pendingRequests.has(requestId)) {
          const pending = this.pendingRequests.get(requestId);
          this.pendingRequests.delete(requestId);
          clearTimeout(pending.timer);
          if (type === 'RESPONSE_SONGS' || type === 'ACK_UPDATE') {
            pending.resolve(payload);
          } else {
            pending.reject(new Error(`Unexpected bridge response: ${type}`));
          }
        }

        if (type === 'RESPONSE_SONGS' && Array.isArray(payload)) {
          // Update local data and broadcast
          this.setData(payload);
        }
      });
    } catch (e) {
      console.warn('⚠️ Bridge setup failed, will rely on localStorage-only sync.', e);
    }
  }

  // Helper to send requests to the bridge with timeout
  postToBridge(message, timeoutMs = 2000) {
    return new Promise((resolve, reject) => {
      if (!this.bridgeWindow) return reject(new Error('Bridge window not available'));
      const requestId = `req_${Date.now()}_${++this.requestCounter}`;
      const timer = setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error('Bridge request timed out'));
        }
      }, timeoutMs);
      this.pendingRequests.set(requestId, { resolve, reject, timer });
      this.bridgeWindow.postMessage({ ...message, requestId }, this.bridgeOrigin);
    });
  }

  async requestSongsFromBridge() {
    if (!this.bridgeReady || !this.bridgeWindow) return [];
    try {
      const res = await this.postToBridge({ type: 'REQUEST_SONGS' });
      if (Array.isArray(res)) {
        this.setData(res);
        return res;
      }
      return [];
    } catch (e) {
      console.log('ℹ️ Bridge REQUEST_SONGS failed:', e.message);
      return [];
    }
  }

  // Setup periodic sync for standalone music library
  setupPeriodicSync() {
    // Sync every 1 second when tab is visible
    this.syncInterval = setInterval(() => {
      if (!document.hidden) {
        // Pull from same-origin storage (in case another 5174 tab wrote)
        this.syncFromStorage();
        // Also request fresh data from main-app bridge (authoritative source)
        this.requestSongsFromBridge().catch(() => {});
      }
    }, 1000);
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

  // Initialize with default data if localStorage is empty
  initializeDefaultData() {
    const storedData = localStorage.getItem(this.storageKey);
    if (!storedData) {
      const defaultSongs = [
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
      
      this.setData(defaultSongs);
      console.log('🎯 Initialized with 15 default songs');
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
      
      // Also push update to main-app via bridge (best-effort)
      if (this.bridgeReady && this.bridgeWindow) {
        this.postToBridge({ type: 'UPDATE_SONGS', payload: dataToStore }).catch(() => {});
      }
      
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
