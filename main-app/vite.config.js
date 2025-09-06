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
        'music-library': 'http://localhost:5174/assets/remoteEntry.js'
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
