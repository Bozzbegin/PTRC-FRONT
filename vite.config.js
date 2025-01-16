import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'react_app_build'
  },
  base: "/",
  optimizeDeps: {
    include: ['moment', 'moment-timezone']
  },
  server: {
    host: '0.0.0.0', // Listen on all available network interfaces
    port: 3000, // Specify the port
  }
})
