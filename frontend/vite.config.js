import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 环境感知：GitHub Pages 需要子路径，Vercel 根路径
  base: process.env.VERCEL ? '/' : '/ctf-writeup-blog/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'framer-motion': ['framer-motion'],
          'tsparticles': ['@tsparticles/react', '@tsparticles/slim', 'tsparticles'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  }
})
