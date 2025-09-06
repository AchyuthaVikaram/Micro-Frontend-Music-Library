// Assignment/main-app/src/components/Sidebar.jsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Music, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Library,
  Shield,
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onToggle }) => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/',
      roles: ['admin', 'user']
    },
    {
      id: 'library',
      label: 'Music Library',
      icon: Library,
      path: '/dashboard',
      roles: ['admin', 'user']
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings',
      roles: ['admin']
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  const sidebarVariants = {
    open: {
      width: '16rem',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    closed: {
      width: '4rem',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2 }
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={isOpen ? 'open' : 'closed'}
      className="bg-gray-800/90 backdrop-blur-lg border-r border-gray-700 flex flex-col h-full relative"
    >
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className="absolute -right-3 top-6 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-full p-1.5 text-gray-400 hover:text-white transition-colors z-10"
      >
        {isOpen ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </motion.button>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg flex-shrink-0">
            {isAdmin() ? (
              <Shield className="w-5 h-5 text-white" />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                variants={itemVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="min-w-0 flex-1"
              >
                <p className="text-white font-medium text-sm truncate">
                  {user?.name}
                </p>
                <p className="text-gray-400 text-xs capitalize">
                  {user?.role}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {filteredMenuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={item.path}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-blue-600/20 text-blue-200 border border-blue-500/30' 
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    } ${!isOpen ? 'justify-center' : ''}`}
                    title={!isOpen ? item.label : ''}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <AnimatePresence>
                      {isOpen && (
                        <motion.span
                          variants={itemVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          className="font-medium"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={itemVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="text-center"
            >
              <p className="text-xs text-gray-500">
                Music Library v1.0
              </p>
              <p className="text-xs text-gray-600">
                Micro Frontend Demo
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
