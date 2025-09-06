// Assignment/main-app/src/pages/Home.jsx

import React from 'react';
import { motion } from 'framer-motion';
import { Music, ArrowRight, Shield, User, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, isAdmin } = useAuth();

  const features = [
    {
      icon: Music,
      title: 'Rich Music Library',
      description: 'Browse, filter, and manage your music collection with ease'
    },
    {
      icon: Zap,
      title: 'Micro Frontend Architecture',
      description: 'Built with modern micro frontend patterns using Module Federation'
    },
    {
      icon: Shield,
      title: 'Role-Based Access',
      description: 'Secure authentication with admin and user role management'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/10 to-purple-900/10">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-2xl">
              <Music className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Music Library</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            A modern music management platform built with React, Micro Frontend architecture, 
            and role-based authentication. Experience the future of modular web applications.
          </p>

          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-800/50 rounded-full border border-gray-700">
                {isAdmin() ? (
                  <Shield className="w-5 h-5 text-red-400" />
                ) : (
                  <User className="w-5 h-5 text-blue-400" />
                )}
                <span className="text-white font-medium">
                  Welcome back, {user.name}!
                </span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full capitalize">
                  {user.role}
                </span>
              </div>
            </motion.div>
          )}

          <motion.a
            href="/dashboard"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 rounded-md font-medium transition-colors text-lg"
          >
            Explore Music Library
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-3 rounded-xl">
                    <Icon className="w-8 h-8 text-blue-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Built With Modern Tech</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['React', 'Vite', 'Module Federation', 'Tailwind CSS', 'Framer Motion', 'JWT Auth'].map((tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-gray-300 text-sm"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
