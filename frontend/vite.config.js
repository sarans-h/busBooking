import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-qr-reader': 'react-qr-reader'
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://busbooking-4ykq.onrender.com/',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/fetchseats': 'https://busbooking-4ykq.onrender.com/',
      '/book':'https://busbooking-4ykq.onrender.com/'
    },
  },
})
