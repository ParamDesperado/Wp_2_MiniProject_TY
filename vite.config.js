import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Forward any /api request from the React dev server to the Express backend
  server: { proxy: { '/api': 'http://localhost:5001' } },
})
