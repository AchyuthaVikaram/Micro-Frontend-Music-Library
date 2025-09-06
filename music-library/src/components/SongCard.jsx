// Assignment/music-library/src/components/SongCard.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Trash2, Clock, Calendar, Disc, User, Music4 } from 'lucide-react';

const SongCard = ({ song, role, onDelete, index }) => {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(song.id);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.28,
        delay: (index || 0) * 0.05,
        ease: 'easeOut',
      },
    },
  };

  // Derive an avatar placeholder color ring for visual variety
  const ringColors = ['ring-blue-500/40', 'ring-purple-500/40', 'ring-indigo-500/40', 'ring-fuchsia-500/40'];
  const ring = ringColors[(song?.id || 0) % ringColors.length];

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.995 }}
      className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gray-800/60 bg-gradient-to-b from-gray-800/80 to-gray-900/80 p-4 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        {/* Album Art Placeholder */}
        <div className={`relative grid place-items-center h-14 w-14 shrink-0 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 ring-2 ${ring}`} aria-hidden="true">
          <Music4 className="h-6 w-6 text-blue-300/90" />
        </div>

        {/* Main Info */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base md:text-lg font-semibold text-white tracking-tight">
            {song.title}
          </h3>
          <div className="mt-0.5 flex items-center gap-2 text-xs md:text-sm text-gray-400">
            <User className="h-3.5 w-3.5" />
            <span className="truncate">{song.artist}</span>
          </div>
          {song.album && (
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
              <Disc className="h-3.5 w-3.5" />
              <span className="truncate">{song.album}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end gap-2 self-start">
          <motion.button
            aria-label="Play"
            title="Play"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-2 text-white shadow-sm hover:shadow transition"
          >
            <Play className="h-4 w-4" />
          </motion.button>
          {role === 'admin' && (
            <motion.button
              aria-label="Delete song"
              title="Delete song"
              onClick={handleDelete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="rounded-full p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Metadata Row */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-800 pt-2 text-[11px] md:text-xs text-gray-400">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {song.duration && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span className="tabular-nums">{song.duration}</span>
            </span>
          )}
          {song.year && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span className="tabular-nums">{song.year}</span>
            </span>
          )}
        </div>

        {song.genre && (
          <span className="ml-auto inline-flex items-center rounded-full bg-gray-800 px-2 py-1 text-[10px] md:text-[11px] font-medium text-gray-300 ring-1 ring-gray-700">
            {song.genre}
          </span>
        )}
      </div>

      {/* Subtle Hover Glow */}
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/0 via-purple-600/0 to-blue-600/0 opacity-0 transition-opacity duration-300 group-hover:opacity-20" />
    </motion.div>
  );
};

export default SongCard;
