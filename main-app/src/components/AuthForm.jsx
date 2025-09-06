// Assignment/main-app/src/components/AuthForm.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, AlertCircle, Music, User, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { registerUser } from '../utils/authHelpers';
import { useToast } from '../context/ToastContext';

const AuthForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const { login } = useAuth();
  const { push } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        // Register then login for seamless UX
        const res = await registerUser(formData.email, formData.password);
        push({ title: 'Account created', description: 'Welcome to Music Library!', variant: 'success' });
        await login(formData.email, formData.password);
      } else {
        await login(formData.email, formData.password);
        push({ title: 'Signed in', description: 'You are now logged in.', variant: 'success' });
      }
      onSuccess?.();
    } catch (err) {
      setError(err.message);
      push({ title: 'Action failed', description: err.message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePresetLogin = (role) => {
    const credentials = {
      admin: { email: 'admin@test.com', password: 'admin123' },
      user: { email: 'user@test.com', password: 'user123' }
    };
    
    setFormData(credentials[role]);
    setError('');
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/5 text-6xl"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), 
              y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 100,
              rotate: 0 
            }}
            animate={{ 
              y: -100, 
              rotate: 360,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)
            }}
            transition={{ 
              duration: Math.random() * 15 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            ♪
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-full">
                <Music className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{isSignup ? 'Create Account' : 'Welcome Back'}</h1>
            <p className="text-gray-400">{isSignup ? 'Sign up to get started' : 'Sign in to access your music library'}</p>
          </motion.div>

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-6"
          >
            {!isSignup ? (
              <>
                <p className="text-gray-300 text-sm mb-3 font-medium">Quick Login:</p>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePresetLogin('admin')}
                    className="flex items-center gap-2 p-3 bg-red-600/20 border border-red-600/30 rounded-lg text-red-200 hover:bg-red-600/30 transition-all duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Admin</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePresetLogin('user')}
                    className="flex items-center gap-2 p-3 bg-blue-600/20 border border-blue-600/30 rounded-lg text-blue-200 hover:bg-blue-600/30 transition-all duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">User</span>
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="text-gray-400 text-sm">
                Create a new account with email and password. Role defaults to user.
              </div>
            )}
          </motion.div>

          {/* Login Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <div className="space-y-4">
              <motion.div
                variants={inputVariants}
                whileFocus="focus"
                className="relative"
              >
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </motion.div>

              <motion.div
                variants={inputVariants}
                whileFocus="focus"
                className="relative"
              >
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </motion.div>
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isSignup ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                    {isSignup ? 'Sign Up' : 'Sign In'}
                  </>
                )}
              </motion.button>

              <button
                type="button"
                onClick={() => { setIsSignup(!isSignup); setError(''); }}
                className="w-full text-sm text-gray-300 hover:text-white underline-offset-4 hover:underline"
              >
                {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
              </button>
            </div>
          </motion.form>

          {/* Demo Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700"
          >
            <p className="text-xs text-gray-400 text-center">
              <strong className="text-gray-300">Demo Credentials:</strong><br />
              Admin: admin@test.com / admin123<br />
              User: user@test.com / user123
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;
