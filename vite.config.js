import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    proxy: {
      "/users": {
        target: "https://itestify-backend-nxel.onrender.com/mobile",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
