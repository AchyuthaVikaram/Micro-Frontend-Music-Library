// Assignment/main-app/src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  authenticateUser, 
  getUserFromToken, 
  getStoredToken, 
  storeToken, 
  removeToken,
  isAdmin as checkIsAdmin,
  isUser as checkIsUser
} from '../utils/authHelpers';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = getStoredToken();
      
      if (storedToken) {
        const userData = getUserFromToken(storedToken);
        
        if (userData) {
          setUser(userData);
          setToken(storedToken);
        } else {
          // Token is invalid, remove it
          removeToken();
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Login user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} User data
   */
  const login = async (email, password) => {
    try {
      const { user: userData, token: authToken } = await authenticateUser(email, password);
      
      // Store token and update state
      storeToken(authToken);
      setToken(authToken);
      setUser(userData);
      
      return userData;
    } catch (error) {
      throw error;
    }
  };

  /**
   * Logout user and clear auth state
   */
  const logout = () => {
    removeToken();
    setToken(null);
    setUser(null);
  };

  /**
   * Check if current user is admin
   * @returns {boolean} True if user is admin
   */
  const isAdmin = () => {
    return checkIsAdmin(user);
  };

  /**
   * Check if current user is regular user
   * @returns {boolean} True if user is regular user
   */
  const isUser = () => {
    return checkIsUser(user);
  };

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is logged in
   */
  const isAuthenticated = () => {
    return !!user && !!token;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAdmin,
    isUser,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use auth context
 * @returns {Object} Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
