// Central place to configure main-app base URL for music-library
// Driven by env for easy deploys; falls back to localhost for dev
export const BASE_URL = import.meta.env.VITE_MAIN_APP_URL || 'http://localhost:5173';

export default {
  BASE_URL,
};
