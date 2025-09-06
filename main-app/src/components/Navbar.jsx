// Assignment/main-app/src/components/Navbar.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Music, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gray-800/80 backdrop-blur-lg border-b border-gray-700 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
            <Music className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Music Library</h1>
            <p className="text-xs text-gray-400">Micro Frontend Demo</p>
          </div>
        </motion.div>

        {/* User Info and Actions */}
        <div className="flex items-center gap-4">
          {/* User Badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 px-4 py-2 bg-gray-700/50 rounded-lg border border-gray-600"
          >
            <div className="flex items-center gap-2">
              {isAdmin() ? (
                <Shield className="w-4 h-4 text-red-400" />
              ) : (
                <User className="w-4 h-4 text-blue-400" />
              )}
              <div className="text-sm">
                <p className="text-white font-medium">{user?.name}</p>
                <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
              </div>
            </div>
          </motion.div>

          {/* Logout Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-200 hover:text-red-100 transition-all duration-200"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Logout</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
