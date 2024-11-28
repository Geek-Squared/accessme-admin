import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Use Railway's PORT or default to 3000
    strictPort: true, // Ensure the app fails if the port is unavailable
    host: '0.0.0.0', // Necessary to allow external access on Railway
  },
})
