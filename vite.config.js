import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  server: {
    proxy: {
      // Forward requests to /api and other endpoints to your backend server
      '/create-order': 'http://localhost:3000',
      '/verify-payment': 'http://localhost:3000',
      // Add any other API endpoints you need
    }
  },
})