// Assignment/music-library/src/utils/sortSongs.js

/**
 * Sorts songs by title (A-Z)
 * @param {Array} songs - Array of song objects
 * @param {string} order - 'asc' for ascending, 'desc' for descending
 * @returns {Array} Sorted songs array
 */
export const sortSongsByTitle = (songs, order = 'asc') => {
  return [...songs].sort((a, b) => {
    const titleA = a.title?.toLowerCase() || '';
    const titleB = b.title?.toLowerCase() || '';
    
    if (order === 'desc') {
      return titleB.localeCompare(titleA);
    }
    return titleA.localeCompare(titleB);
  });
};

/**
 * Sorts songs by artist name (A-Z)
 * @param {Array} songs - Array of song objects
 * @param {string} order - 'asc' for ascending, 'desc' for descending
 * @returns {Array} Sorted songs array
 */
export const sortSongsByArtist = (songs, order = 'asc') => {
  return [...songs].sort((a, b) => {
    const artistA = a.artist?.toLowerCase() || '';
    const artistB = b.artist?.toLowerCase() || '';
    
    if (order === 'desc') {
      return artistB.localeCompare(artistA);
    }
    return artistA.localeCompare(artistB);
  });
};

/**
 * Sorts songs by album name (A-Z)
 * @param {Array} songs - Array of song objects
 * @param {string} order - 'asc' for ascending, 'desc' for descending
 * @returns {Array} Sorted songs array
 */
export const sortSongsByAlbum = (songs, order = 'asc') => {
  return [...songs].sort((a, b) => {
    const albumA = a.album?.toLowerCase() || '';
    const albumB = b.album?.toLowerCase() || '';
    
    if (order === 'desc') {
      return albumB.localeCompare(albumA);
    }
    return albumA.localeCompare(albumB);
  });
};

/**
 * Sorts songs by year
 * @param {Array} songs - Array of song objects
 * @param {string} order - 'asc' for ascending, 'desc' for descending
 * @returns {Array} Sorted songs array
 */
export const sortSongsByYear = (songs, order = 'asc') => {
  return [...songs].sort((a, b) => {
    const yearA = a.year || 0;
    const yearB = b.year || 0;
    
    if (order === 'desc') {
      return yearB - yearA;
    }
    return yearA - yearB;
  });
};

/**
 * Sorts songs by duration
 * @param {Array} songs - Array of song objects
 * @param {string} order - 'asc' for ascending, 'desc' for descending
 * @returns {Array} Sorted songs array
 */
export const sortSongsByDuration = (songs, order = 'asc') => {
  const parseDuration = (duration) => {
    if (!duration) return 0;
    const parts = duration.split(':');
    return parseInt(parts[0]) * 60 + parseInt(parts[1] || 0);
  };

  return [...songs].sort((a, b) => {
    const durationA = parseDuration(a.duration);
    const durationB = parseDuration(b.duration);
    
    if (order === 'desc') {
      return durationB - durationA;
    }
    return durationA - durationB;
  });
};

/**
 * Generic sort function that handles different sort criteria
 * @param {Array} songs - Array of song objects
 * @param {string} sortBy - Field to sort by ('title', 'artist', 'album', 'year', 'duration')
 * @param {string} order - 'asc' for ascending, 'desc' for descending
 * @returns {Array} Sorted songs array
 */
export const sortSongs = (songs, sortBy = 'title', order = 'asc') => {
  switch (sortBy) {
    case 'artist':
      return sortSongsByArtist(songs, order);
    case 'album':
      return sortSongsByAlbum(songs, order);
    case 'year':
      return sortSongsByYear(songs, order);
    case 'duration':
      return sortSongsByDuration(songs, order);
    case 'title':
    default:
      return sortSongsByTitle(songs, order);
  }
};
