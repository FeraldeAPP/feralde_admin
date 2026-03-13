import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    proxy: {
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
  preview: {
    allowedHosts: ['feralde-admin.chysev.cloud'],
  },
})
