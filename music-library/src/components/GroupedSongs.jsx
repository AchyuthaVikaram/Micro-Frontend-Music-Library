// Assignment/music-library/src/components/GroupedSongs.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Disc, User, Tag, Calendar } from 'lucide-react';
import SongCard from './SongCard';

const GroupedSongs = ({ groupedSongs, groupBy, role, onDeleteSong }) => {
  const [expandedGroups, setExpandedGroups] = React.useState(new Set());

  const toggleGroup = (groupName) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  const getGroupIcon = (groupBy) => {
    switch (groupBy) {
      case 'artist':
        return User;
      case 'genre':
        return Tag;
      case 'year':
        return Calendar;
      case 'album':
      default:
        return Disc;
    }
  };

  const GroupIcon = getGroupIcon(groupBy);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const groupVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const songsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05
      }
    }
  };

  if (!groupedSongs || Object.keys(groupedSongs).length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="text-gray-400 text-lg">No songs found</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {Object.entries(groupedSongs)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([groupName, songs], groupIndex) => {
          const isExpanded = expandedGroups.has(groupName);
          
          return (
            <motion.div
              key={groupName}
              variants={groupVariants}
              className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden"
            >
              {/* Group Header */}
              <motion.button
                onClick={() => toggleGroup(groupName)}
                whileHover={{ backgroundColor: 'rgba(75, 85, 99, 0.5)' }}
                whileTap={{ scale: 0.99 }}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-700/50 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                    <GroupIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {groupName}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {songs.length} song{songs.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
              </motion.button>

              {/* Group Content */}
              <motion.div
                initial={false}
                animate={isExpanded ? "visible" : "hidden"}
                variants={songsVariants}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6">
                  <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {songs.map((song, songIndex) => (
                      <SongCard
                        key={song.id}
                        song={song}
                        role={role}
                        onDelete={onDeleteSong}
                        index={songIndex}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
    </motion.div>
  );
};

export default GroupedSongs;
