// Assignment/music-library/src/components/FilterBar.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Plus, Grid3X3, List } from 'lucide-react';

const FilterBar = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  groupBy,
  onGroupChange,
  isGrouped,
  onToggleGroup,
  role,
  onAddSong
}) => {
  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'artist', label: 'Artist' },
    { value: 'album', label: 'Album' },
    { value: 'year', label: 'Year' },
    { value: 'duration', label: 'Duration' }
  ];

  const groupOptions = [
    { value: 'album', label: 'Album' },
    { value: 'artist', label: 'Artist' },
    { value: 'genre', label: 'Genre' },
    { value: 'year', label: 'Year' },
    { value: 'decade', label: 'Decade' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700 shadow-lg"
    >
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search songs, artists, albums..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  Sort by {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Group Toggle */}
          <motion.button
            onClick={onToggleGroup}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isGrouped
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {isGrouped ? <List className="w-4 h-4" /> : <Grid3X3 className="w-4 h-4" />}
            {isGrouped ? 'Grouped' : 'Grid'}
          </motion.button>

          {/* Group By Dropdown (when grouped) */}
          {isGrouped && (
            <select
              value={groupBy}
              onChange={(e) => onGroupChange(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {groupOptions.map(option => (
                <option key={option.value} value={option.value}>
                  Group by {option.label}
                </option>
              ))}
            </select>
          )}

          {/* Add Song Button (Admin only) */}
          {role === 'admin' && onAddSong && (
            <motion.button
              onClick={onAddSong}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Song
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;
