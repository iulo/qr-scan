import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { splitVendorChunkPlugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import mkcert from 'vite-plugin-mkcert'
import WindiCSS from 'vite-plugin-windicss'
import Components from 'unplugin-vue-components/vite'
import { Vuetify3Resolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'

// import { VarletUIResolver } from 'unplugin-vue-components/resolvers'

console.log(process.env.ANALYZE)

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    https: true
  },
  base: '/',
  // base: '/qr-scan/',
  plugins: [
    //
    Components({
      resolvers: [Vuetify3Resolver()]
    }),
    WindiCSS(),
    mkcert({
      // hosts: ['dev.iulo.me']
    }),
    vue(),
    splitVendorChunkPlugin(),
    VitePWA({
      devOptions: {
        // enabled: true
      },
      includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Qrcode Scanner',
        short_name: 'QR Scan',
        description: 'A qrcode scanner',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'maskable_icon_x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    }),
    process.env.ANALYZE ? visualizer({ open: true, gzipSize: true, brotliSize: true }) : null
  ],
  build: {
    reportCompressedSize: !process.env.CI
    // sourcemap: !!process.env.ANALYZE
  }
})
