import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logoIco.png'],
      manifest: {
        name: 'Tienda de Ropa Virtual',
        short_name: 'TiendaRopa',
        description: 'Tienda de ropa virtual - Moda femenina y masculina',
        theme_color: '#0f172a',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/logoIco.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/logoIco.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/logoIco.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})
