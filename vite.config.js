import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const autoscalingTarget =
    env.VITE_EXECUTOR_API ||
    (env.VITE_Auto_Scaling_Base_Url
      ? env.VITE_Auto_Scaling_Base_Url.replace(/\/api\/v1\/?$/, '')
      : 'http://localhost:6001')

  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      proxy: {
        "/api/v1": {
          target: autoscalingTarget,
          changeOrigin: true,
          secure: false,
        },
        "/socket.io": {
          target: autoscalingTarget,
          ws: true,
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
        "/process": {
          target: "http://localhost:8000",
          changeOrigin: true,
          secure: false,
        },
        "/performance": {
          target: "http://localhost:8000",
          changeOrigin: true,
          secure: false,
        },
        "/nodes": {
          target: "http://localhost:8000",
          changeOrigin: true,
          secure: false,
        },
        "/pods": {
          target: "http://localhost:8000",
          changeOrigin: true,
          secure: false,
        },
        "/apps": {
          target: "http://localhost:8000",
          changeOrigin: true,
          secure: false,
        },
        "/mesh": {
          target: "http://localhost:8000",
          changeOrigin: true,
          secure: false,
        },
        "/stress-index": {
          target: "http://localhost:8000",
          changeOrigin: true,
          secure: false,
        },
        "/graph": {
          target: "http://localhost:8000",
          changeOrigin: true,
          secure: false,
        },
        "/config": {
          target: "http://localhost:8000",
          changeOrigin: true,
          secure: false,
        },
        "/runtime": {
          target: "http://localhost:8000",
          changeOrigin: true,
          secure: false,
        },
        "/metrics": {
          target: "http://localhost:8000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', '@iconify/react', 'recharts', 'react-is'],
      force: true
    },
    build: {
      commonjsOptions: {
        include: [/node_modules/],
      },
    }
  }
})
