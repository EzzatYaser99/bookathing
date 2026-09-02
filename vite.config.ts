import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Make design-system Sass modules available in every .scss file without @import
        // Using @use ... as * to keep original variable/mixin names accessible globally
        additionalData: `@use "/src/styles/_variables" as *; @use "/src/styles/_colors" as *; @use "/src/styles/_mixins" as *;`
      }
    }
  }
})
