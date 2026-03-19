import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Necesario para que Electron encuentre los archivos locales cuando se empaqueta
  server: {
    port: 5173
  }
})
