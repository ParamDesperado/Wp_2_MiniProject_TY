import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Forward any /api request from the React dev server to the Express backend
  server: { proxy: { '/api': 'http://localhost:5001' } },
  // When built on Vercel (it sets VERCEL=1) there is no MongoDB, so turn on browser "demo mode"
  define: {
    'import.meta.env.VITE_BROWSER_DB': JSON.stringify(process.env.VERCEL ? 'true' : process.env.VITE_BROWSER_DB || 'false'),
  },
})
