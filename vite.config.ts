import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const ReactCompilerConfig = {
  target: '19',
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3067',
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    },
  },
})
