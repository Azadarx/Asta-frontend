import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      '/api': 'https://asta-backend-o8um.onrender.com',
      historyApiFallback: true,
    },
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:5000', // your local backend
  //       changeOrigin: true,
  //       secure: false
  //     }
  //   }
  // }
})