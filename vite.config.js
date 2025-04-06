import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      // Improved proxy configuration to cover all API endpoints
      '/create-order': 'http://localhost:3000',
      '/verify-payment': 'http://localhost:3000',
      '/submit-contact': 'http://localhost:3000',
      '/submit-about-inquiry': 'http://localhost:3000',
      '/api': 'http://localhost:3000', // Added to catch all /api/* routes
      '/payment': 'http://localhost:3000'
    }
  },
})