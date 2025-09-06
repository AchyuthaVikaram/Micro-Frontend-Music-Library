// Assignment/music-library/src/utils/groupSongs.js

/**
 * Groups songs by album using Array.prototype.reduce
 * @param {Array} songs - Array of song objects
 * @returns {Object} Object with album names as keys and arrays of songs as values
 */
export const groupSongsByAlbum = (songs) => {
  return songs.reduce((groups, song) => {
    const album = song.album || 'Unknown Album';
    
    if (!groups[album]) {
      groups[album] = [];
    }
    
    groups[album].push(song);
    return groups;
  }, {});
};

/**
 * Groups songs by artist using Array.prototype.reduce
 * @param {Array} songs - Array of song objects
 * @returns {Object} Object with artist names as keys and arrays of songs as values
 */
export const groupSongsByArtist = (songs) => {
  return songs.reduce((groups, song) => {
    const artist = song.artist || 'Unknown Artist';
    
    if (!groups[artist]) {
      groups[artist] = [];
    }
    
    groups[artist].push(song);
    return groups;
  }, {});
};

/**
 * Groups songs by genre using Array.prototype.reduce
 * @param {Array} songs - Array of song objects
 * @returns {Object} Object with genre names as keys and arrays of songs as values
 */
export const groupSongsByGenre = (songs) => {
  return songs.reduce((groups, song) => {
    const genre = song.genre || 'Unknown Genre';
    
    if (!groups[genre]) {
      groups[genre] = [];
    }
    
    groups[genre].push(song);
    return groups;
  }, {});
};

/**
 * Groups songs by year using Array.prototype.reduce
 * @param {Array} songs - Array of song objects
 * @returns {Object} Object with years as keys and arrays of songs as values
 */
export const groupSongsByYear = (songs) => {
  return songs.reduce((groups, song) => {
    const year = song.year || 'Unknown Year';
    
    if (!groups[year]) {
      groups[year] = [];
    }
    
    groups[year].push(song);
    return groups;
  }, {});
};

/**
 * Groups songs by decade using Array.prototype.reduce
 * @param {Array} songs - Array of song objects
 * @returns {Object} Object with decades as keys and arrays of songs as values
 */
export const groupSongsByDecade = (songs) => {
  return songs.reduce((groups, song) => {
    const year = song.year;
    let decade = 'Unknown Decade';
    
    if (year) {
      decade = `${Math.floor(year / 10) * 10}s`;
    }
    
    if (!groups[decade]) {
      groups[decade] = [];
    }
    
    groups[decade].push(song);
    return groups;
  }, {});
};

/**
 * Generic group function that handles different grouping criteria
 * @param {Array} songs - Array of song objects
 * @param {string} groupBy - Field to group by ('album', 'artist', 'genre', 'year', 'decade')
 * @returns {Object} Grouped songs object
 */
export const groupSongs = (songs, groupBy = 'album') => {
  switch (groupBy) {
    case 'artist':
      return groupSongsByArtist(songs);
    case 'genre':
      return groupSongsByGenre(songs);
    case 'year':
      return groupSongsByYear(songs);
    case 'decade':
      return groupSongsByDecade(songs);
    case 'album':
    default:
      return groupSongsByAlbum(songs);
  }
};

/**
 * Converts grouped songs object to array format for easier rendering
 * @param {Object} groupedSongs - Grouped songs object
 * @returns {Array} Array of group objects with name and songs properties
 */
export const convertGroupsToArray = (groupedSongs) => {
  return Object.entries(groupedSongs).map(([groupName, songs]) => ({
    name: groupName,
    songs: songs,
    count: songs.length
  })).sort((a, b) => a.name.localeCompare(b.name));
};
