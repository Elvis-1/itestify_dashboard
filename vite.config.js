import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    proxy: {
      "/users": {
        target: "https://itestify-backend-1.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
