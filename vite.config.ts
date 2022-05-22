import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { splitVendorChunkPlugin } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    https: true
  },
  base: '/',
  // base: '/qr-scan/',
  plugins: [vue(), splitVendorChunkPlugin()]
})