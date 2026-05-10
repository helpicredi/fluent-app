import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/fluent-app/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Fluent — Learn English',
        short_name: 'Fluent',
        description: 'Practice English daily with AI-powered exercises.',
        theme_color: '#2d6a4f',
        background_color: '#f8f7f4',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/fluent-app/',
        start_url: '/fluent-app/',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ]
})
