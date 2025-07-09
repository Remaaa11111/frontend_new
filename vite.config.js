import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000', // Sesuaikan dengan backend kamu
        changeOrigin: true,
        secure: false,
      }
    }
  }
});
