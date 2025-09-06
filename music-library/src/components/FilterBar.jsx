// Assignment/music-library/src/components/FilterBar.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Mobile accordion state (UI-only)
  const [open, setOpen] = useState(false);

  const panelVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { height: 'auto', opacity: 1 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-800 bg-gray-850/60 bg-gradient-to-b from-gray-800/70 to-gray-900/70 p-4 md:p-6 mb-6 shadow-sm"
    >
      {/* Top row: Search + Mobile toggle */}
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search songs, artists, albums..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800/70 pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600/60 focus:border-transparent"
            />
          </div>
        </div>

        {/* Mobile toggle button - hidden on md+ */}
        <motion.button
          type="button"
          aria-expanded={open}
          aria-controls="filters-panel"
          onClick={() => setOpen((v) => !v)}
          whileTap={{ scale: 0.98 }}
          className="md:hidden inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-gray-200 hover:bg-gray-700/80"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </motion.button>
      </div>

      {/* Controls row: always visible on md+, collapsible on mobile */}
      <div className="hidden md:flex flex-wrap gap-3 items-center mt-4">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/60"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                Sort by {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Group toggle */}
        <motion.button
          onClick={onToggleGroup}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            isGrouped ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {isGrouped ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          {isGrouped ? 'Grouped' : 'Grid'}
        </motion.button>

        {/* Group by */}
        {isGrouped && (
          <select
            value={groupBy}
            onChange={(e) => onGroupChange(e.target.value)}
            className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/60"
          >
            {groupOptions.map((option) => (
              <option key={option.value} value={option.value}>
                Group by {option.label}
              </option>
            ))}
          </select>
        )}

        {/* Add Song */}
        {role === 'admin' && onAddSong && (
          <motion.button
            onClick={onAddSong}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="ml-auto inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Song
          </motion.button>
        )}
      </div>

      {/* Mobile collapsible panel */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="filters-panel"
            key="filters-panel"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={panelVariants}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden overflow-hidden"
          >
            <div className="mt-3 grid grid-cols-1 gap-3">
              {/* Sort */}
              <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-800 bg-gray-800/60 px-3 py-2.5">
                <div className="inline-flex items-center gap-2 text-sm text-gray-300">
                  <SlidersHorizontal className="h-4 w-4 text-gray-400" />
                  Sort
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/60"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Group controls */}
              <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-800 bg-gray-800/60 px-3 py-2.5">
                <div className="inline-flex items-center gap-2 text-sm text-gray-300">
                  {isGrouped ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                  View
                </div>
                <motion.button
                  onClick={onToggleGroup}
                  whileTap={{ scale: 0.98 }}
                  className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium ${
                    isGrouped ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-300'
                  }`}
                >
                  {isGrouped ? 'Grouped' : 'Grid'}
                </motion.button>
              </div>

              {isGrouped && (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-800 bg-gray-800/60 px-3 py-2.5">
                  <div className="text-sm text-gray-300">Group by</div>
                  <select
                    value={groupBy}
                    onChange={(e) => onGroupChange(e.target.value)}
                    className="rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/60"
                  >
                    {groupOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Add song on mobile */}
              {role === 'admin' && onAddSong && (
                <motion.button
                  onClick={onAddSong}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Song
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FilterBar;
