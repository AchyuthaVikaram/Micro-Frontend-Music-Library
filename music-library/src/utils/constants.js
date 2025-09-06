// Central place to configure main-app base URL for music-library
// Driven by env for easy deploys; falls back to localhost for dev
export const BASE_URL = import.meta.env.VITE_MAIN_APP_URL || 'https://mainappmicrofronted.netlify.app';

export default {
  BASE_URL,
};
