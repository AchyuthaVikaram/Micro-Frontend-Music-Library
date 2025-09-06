import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import federation from "@originjs/vite-plugin-federation"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'mainApp',
      remotes: {
        // Configure remote URL via env var for easy deployment changes
        // Use VITE_MUSIC_LIBRARY_URL to set the base origin of music-library
        // Example: VITE_MUSIC_LIBRARY_URL=https://music-lib.example.com
        'music-library': `${process.env.VITE_MUSIC_LIBRARY_URL || 'http://localhost:5174'}/assets/remoteEntry.js`
      },
      shared: ['react', 'react-dom']
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173
  },
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})
