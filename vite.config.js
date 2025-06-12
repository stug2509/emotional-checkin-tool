import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize build performance
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          utils: ['date-fns']
        }
      }
    },
    // Reduce bundle analysis time
    reportCompressedSize: false,
    // Increase chunk size limit to avoid warnings
    chunkSizeWarningLimit: 1000
  },
  // Optimize for serverless deployment
  optimizeDeps: {
    include: ['react', 'react-dom', '@supabase/supabase-js', 'date-fns']
  }
})
