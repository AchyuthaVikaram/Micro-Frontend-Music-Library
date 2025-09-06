// Assignment/main-app/src/utils/authHelpers.js

/**
 * Creates a mock JWT token for demo purposes
 * @param {Object} user - User object with id, username, role, name
 * @returns {string} Base64 encoded token
 */
export const createMockJWT = (user) => {
  const payload = {
    sub: user.id,
    username: user.username,
    role: user.role,
    name: user.name,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };
  
  // In a real app, this would be properly signed
  return btoa(JSON.stringify(payload));
};

/**
 * Parses a mock JWT token
 * @param {string} token - Base64 encoded token
 * @returns {Object|null} Decoded payload or null if invalid
 */
export const parseJWT = (token) => {
  try {
    const payload = JSON.parse(atob(token));
    return payload;
  } catch (error) {
    console.error('Invalid token format:', error);
    return null;
  }
};

/**
 * Validates if a token is still valid (not expired)
 * @param {string} token - Base64 encoded token
 * @returns {boolean} True if token is valid and not expired
 */
export const isTokenValid = (token) => {
  if (!token) return false;
  
  const payload = parseJWT(token);
  if (!payload) return false;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp > currentTime;
};

/**
 * Gets the user data from a valid token
 * @param {string} token - Base64 encoded token
 * @returns {Object|null} User data or null if invalid
 */
export const getUserFromToken = (token) => {
  if (!isTokenValid(token)) return null;
  
  const payload = parseJWT(token);
  return {
    id: payload.sub,
    username: payload.username,
    role: payload.role,
    name: payload.name
  };
};

/**
 * Stores token in localStorage
 * @param {string} token - JWT token to store
 */
export const storeToken = (token) => {
  localStorage.setItem('auth_token', token);
};

/**
 * Retrieves token from localStorage
 * @returns {string|null} Stored token or null
 */
export const getStoredToken = () => {
  return localStorage.getItem('auth_token');
};

/**
 * Removes token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('auth_token');
};

/**
 * Checks if user has admin role
 * @param {Object} user - User object
 * @returns {boolean} True if user is admin
 */
export const isAdmin = (user) => {
  return user?.role === 'admin';
};

/**
 * Checks if user has user role
 * @param {Object} user - User object
 * @returns {boolean} True if user is regular user
 */
export const isUser = (user) => {
  return user?.role === 'user';
};

// Mock user database for demo
export const MOCK_USERS = {
  'admin@test.com': {
    id: 1,
    username: 'admin@test.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
  },
  'user@test.com': {
    id: 2,
    username: 'user@test.com',
    password: 'user123',
    role: 'user',
    name: 'Regular User'
  }
};

/**
 * Authenticates user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} User data and token
 * @throws {Error} If credentials are invalid
 */
export const authenticateUser = async (email, password) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = MOCK_USERS[email];
  
  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }
  
  const token = createMockJWT(user);
  
  return {
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      name: user.name
    },
    token
  };
};
