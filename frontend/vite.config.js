import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://busbooking-4ykq.onrender.com',
        secure: true, // Only use if testing with self-signed SSL
        changeOrigin: true,
        
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/fetchseats': 'https://busbooking-4ykq.onrender.com',
      '/book':'https://busbooking-4ykq.onrender.com'
    },
  },
})
