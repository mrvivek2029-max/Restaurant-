import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    // Enable source maps for better debugging
    sourcemap: true,
    // Target modern browsers for better optimization
    target: 'es2020',
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Create separate chunks for better caching
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor'
            }
            if (id.includes('react-router')) {
              return 'router'
            }
            if (id.includes('react-window')) {
              return 'virtualization'
            }
            if (id.includes('lodash') || id.includes('moment') || id.includes('axios')) {
              return 'utils'
            }
            // All other node_modules go into vendor chunk
            return 'vendor'
          }
          // Split pages into separate chunks
          if (id.includes('/pages/')) {
            const pageName = id.split('/pages/')[1].split('.')[0].toLowerCase()
            return `page-${pageName}`
          }
        },
        // Optimize chunk names for caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          if (facadeModuleId) {
            return '[name]-[hash].js'
          }
          return 'chunks/[name]-[hash].js'
        },
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name.split('.').at(1)
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return 'assets/images/[name]-[hash][extname]'
          }
          if (/css/i.test(extType)) {
            return 'assets/css/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    },
    // Set chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable advanced minification
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console and debugger in production
        drop_console: true,
        drop_debugger: true,
        // Remove unused code
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        // Advanced optimizations
        passes: 2,
        unsafe_arrows: true,
        unsafe_methods: true,
        unsafe_proto: true
      },
      mangle: {
        // Mangle property names for smaller bundle
        properties: {
          regex: /^_/
        }
      },
      format: {
        // Remove comments
        comments: false
      }
    },
    // Optimize CSS
    cssCodeSplit: true,
    cssMinify: true,
    // Report compressed size
    reportCompressedSize: true,
    // Optimize for production
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    // Enable compression in dev mode
    compress: true
  },
  preview: {
    port: 4173,
    // Enable compression in preview mode
    compress: true
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@vite/client', '@vite/env']
  },
  // Define environment variables for optimization
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production')
  }
})