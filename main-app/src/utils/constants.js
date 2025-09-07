// Central place to configure remote Music Library base URL for main-app
// Driven by env for easy deploys; falls back to localhost for dev
const rawUrl = import.meta.env.VITE_MUSIC_LIBRARY_URL || 'https://microfrontendmusiclibrary.netlify.app';
export const BASE_URL = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;

export default {
  BASE_URL,
};
