// Assignment/music-library/src/utils/filterSongs.js

/**
 * Filters songs based on search query
 * @param {Array} songs - Array of song objects
 * @param {string} query - Search query string
 * @returns {Array} Filtered songs array
 */
export const filterSongsByQuery = (songs, query) => {
  if (!query || query.trim() === '') {
    return songs;
  }

  const searchTerm = query.toLowerCase().trim();
  
  return songs.filter(song => {
    const title = song.title?.toLowerCase() || '';
    const artist = song.artist?.toLowerCase() || '';
    const album = song.album?.toLowerCase() || '';
    const genre = song.genre?.toLowerCase() || '';
    
    return (
      title.includes(searchTerm) ||
      artist.includes(searchTerm) ||
      album.includes(searchTerm) ||
      genre.includes(searchTerm)
    );
  });
};

/**
 * Filters songs by artist
 * @param {Array} songs - Array of song objects
 * @param {string} artist - Artist name to filter by
 * @returns {Array} Filtered songs array
 */
export const filterSongsByArtist = (songs, artist) => {
  if (!artist || artist === 'all') {
    return songs;
  }
  
  return songs.filter(song => 
    song.artist?.toLowerCase() === artist.toLowerCase()
  );
};

/**
 * Filters songs by album
 * @param {Array} songs - Array of song objects
 * @param {string} album - Album name to filter by
 * @returns {Array} Filtered songs array
 */
export const filterSongsByAlbum = (songs, album) => {
  if (!album || album === 'all') {
    return songs;
  }
  
  return songs.filter(song => 
    song.album?.toLowerCase() === album.toLowerCase()
  );
};

/**
 * Filters songs by genre
 * @param {Array} songs - Array of song objects
 * @param {string} genre - Genre to filter by
 * @returns {Array} Filtered songs array
 */
export const filterSongsByGenre = (songs, genre) => {
  if (!genre || genre === 'all') {
    return songs;
  }
  
  return songs.filter(song => 
    song.genre?.toLowerCase() === genre.toLowerCase()
  );
};

/**
 * Gets unique artists from songs array
 * @param {Array} songs - Array of song objects
 * @returns {Array} Array of unique artist names
 */
export const getUniqueArtists = (songs) => {
  return [...new Set(songs.map(song => song.artist).filter(Boolean))].sort();
};

/**
 * Gets unique albums from songs array
 * @param {Array} songs - Array of song objects
 * @returns {Array} Array of unique album names
 */
export const getUniqueAlbums = (songs) => {
  return [...new Set(songs.map(song => song.album).filter(Boolean))].sort();
};

/**
 * Gets unique genres from songs array
 * @param {Array} songs - Array of song objects
 * @returns {Array} Array of unique genre names
 */
export const getUniqueGenres = (songs) => {
  return [...new Set(songs.map(song => song.genre).filter(Boolean))].sort();
};
