import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['leaflet', 'maplibre-gl', '@maplibre/maplibre-gl-leaflet'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  preview: {
    allowedHosts: ['feralde-admin.chysev.cloud'],
    proxy: {
      '/tiles': {
        target: 'http://localhost:8090',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tiles/, ''),
      },
    },
  },
  server: {
    port: 3001,
    proxy: {
      '/tiles': {
        target: 'http://localhost:8090',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tiles/, ''),
      },
      '/api/auth': {
        target: 'http://127.0.0.1:8100',
        changeOrigin: true,
      },
      '/api/user': {
        target: 'http://127.0.0.1:8100',
        changeOrigin: true,
      },
      '/api/users': {
        target: 'http://127.0.0.1:8100',
        changeOrigin: true,
      },
      '/api/roles': {
        target: 'http://127.0.0.1:8100',
        changeOrigin: true,
      },
      '/api/permissions': {
        target: 'http://127.0.0.1:8100',
        changeOrigin: true,
      },
      '/storage/payment_proofs': {
        target: 'http://127.0.0.1:8101',
        changeOrigin: true,
      },
      '/storage': {
        target: 'http://127.0.0.1:8102',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://127.0.0.1:8102',
        changeOrigin: true,
      },
    },
  },
})
