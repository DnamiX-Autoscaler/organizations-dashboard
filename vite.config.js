import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    // proxy: {
    //   // Proxy all /process requests to the backend, avoiding CORS
    //   "/process": {
    //     target: "http://localhost:8000",
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@iconify/react', 'recharts', 'react-is'],
    force: true
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
})
