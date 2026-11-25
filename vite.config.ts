import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('three') || id.includes('@react-three')) {
            if (id.includes('three/examples') || id.includes('three-stdlib')) {
              return 'vendor-three-addons'
            }
            if (id.includes('@react-three/drei')) {
              return 'vendor-drei'
            }
            if (id.includes('@react-three/fiber')) {
              return 'vendor-r3f'
            }
            return 'vendor-three-core'
          }
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor-react'
          }
        },
      },
    },
  },
})
