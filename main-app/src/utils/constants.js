// Central place to configure remote Music Library base URL for main-app
// Driven by env for easy deploys; falls back to localhost for dev
export const BASE_URL = import.meta.env.VITE_MUSIC_LIBRARY_URL || 'https://microfrontendmusiclibrary.netlify.app/';

export default {
  BASE_URL,
};
