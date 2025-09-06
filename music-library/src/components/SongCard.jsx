// Assignment/music-library/src/components/SongCard.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Trash2, Clock, Calendar, Disc, User } from 'lucide-react';

const SongCard = ({ song, role, onDelete, index }) => {
  const handleDelete = () => {
    if (onDelete) {
      onDelete(song.id);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        delay: index * 0.05,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group relative"
    >
      {/* Header with Play Button and Delete */}
      <div className="flex items-start justify-between mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Play className="w-5 h-5 ml-0.5" />
        </motion.button>
        
        {role === 'admin' && (
          <motion.button
            onClick={handleDelete}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Song Info */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-200 truncate">
            {song.title}
          </h3>
          <div className="flex items-center gap-1 text-gray-400 mt-1">
            <User className="w-3 h-3" />
            <p className="text-sm truncate">{song.artist}</p>
          </div>
        </div>

        {song.album && (
          <div className="flex items-center gap-1 text-gray-400">
            <Disc className="w-3 h-3" />
            <p className="text-sm truncate">{song.album}</p>
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-700">
          <div className="flex items-center gap-3">
            {song.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{song.duration}</span>
              </div>
            )}
            {song.year && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{song.year}</span>
              </div>
            )}
          </div>
          
          {song.genre && (
            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
              {song.genre}
            </span>
          )}
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default SongCard;
