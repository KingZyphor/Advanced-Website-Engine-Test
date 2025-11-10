import { defineConfig } from 'vite'

export default defineConfig({
  // Set the base path for GitHub Pages deployment
  // Change this to match your repository name
  base: '/Advanced-Website-Engine-Test/',
  
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  
  server: {
    port: 3000,
    open: true // Automatically opens browser on dev server start
  }
})