// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: true,
    watch: {
      usePolling: true,
    },
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom']
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  }
})