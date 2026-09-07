import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const buildTime = Date.now().toString()

function versionStamp() {
  return {
    name: 'version-stamp',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ buildTime }),
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    versionStamp(),
    VitePWA({
      // The site already silently reloads on a new deploy (see
      // src/versionCheck.js), so the service worker should follow the
      // same "just self-update" behavior instead of prompting.
      registerType: 'autoUpdate',
      manifest: {
        name: 'JCHS Fishing Club',
        short_name: 'JCHS Fishing',
        description: 'John Carroll High School Fishing Club — Fort Pierce, FL',
        theme_color: '#050607',
        background_color: '#050607',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: '/pwa-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Precache only the JS/CSS shell — images are cached lazily at
        // runtime instead, so first install stays lightweight. index.html
        // and version.json are deliberately left off the precache list, and
        // navigateFallback is disabled (it defaults to 'index.html' in this
        // plugin), so page navigations always hit the network and
        // versionCheck.js's stale-build detection keeps working.
        globPatterns: ['**/*.{js,css}'],
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'catch-photos',
              expiration: { maxEntries: 150, maxAgeSeconds: 60 * 60 * 24 * 60 },
            },
          },
          {
            urlPattern: /^https:\/\/(firestore|firebaseio|identitytoolkit)\.googleapis\.com\/.*/i,
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'site-images',
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 60 },
            },
          },
        ],
      },
    }),
  ],
  define: {
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(buildTime),
  },
})
