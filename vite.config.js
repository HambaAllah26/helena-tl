import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  base: '/helena-tl/',
  plugins: [
    react(),
    {
      name: 'markdown-loader',
      transform(code, id) {
        if (id.endsWith('.md')) {
          return `export default ${JSON.stringify(code)};`
        }
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'frontend')
    }
  }
})

