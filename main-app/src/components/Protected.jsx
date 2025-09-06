// Assignment/main-app/src/components/Protected.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

/**
 * Protected component that guards routes based on authentication and role
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string} props.requiredRole - Required role ('admin' or 'user')
 * @param {string} props.redirectTo - Path to redirect if not authorized
 * @returns {React.ReactNode} Protected content or redirect
 */
const Protected = ({ 
  children, 
  requiredRole = null, 
  redirectTo = '/login' 
}) => {
  const { user, loading, isAuthenticated, isAdmin, isUser } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          <p className="text-gray-400">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role-based access
  if (requiredRole) {
    const hasRequiredRole = 
      (requiredRole === 'admin' && isAdmin()) ||
      (requiredRole === 'user' && (isUser() || isAdmin())); // Admin can access user routes

    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 max-w-md">
              <div className="text-red-400 text-6xl mb-4">🚫</div>
              <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
              <p className="text-gray-400 mb-4">
                You don't have permission to access this page.
              </p>
              <p className="text-sm text-gray-500">
                Required role: <span className="text-red-400 font-medium">{requiredRole}</span>
                <br />
                Your role: <span className="text-blue-400 font-medium">{user?.role}</span>
              </p>
            </div>
          </motion.div>
        </div>
      );
    }
  }

  // Render protected content
  return <>{children}</>;
};

export default Protected;
