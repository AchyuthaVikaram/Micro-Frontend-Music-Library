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
      name: 'music-library',
      filename: 'remoteEntry.js',
      exposes: {
        './MusicLibrary': './src/App.jsx',
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
    port: 5174,
    cors: true,
    host: '0.0.0.0'
  },
  build: {
    outDir: 'dist',
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
  base: '/music-library/'
})