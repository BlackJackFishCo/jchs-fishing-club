import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
  plugins: [react(), versionStamp()],
  define: {
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(buildTime),
  },
})
