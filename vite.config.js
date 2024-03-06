import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://joaao-vitor.github.io/fcc-clock/',
  plugins: [react()],
})
