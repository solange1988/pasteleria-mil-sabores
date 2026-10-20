import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // navegador simulado para probar componentes
    globals: true, // permite usar describe/it/expect estilo Jasmine sin importarlos
    setupFiles: 'src/test/configuracion.js',
    coverage: {
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/test/**'],
    },
  },
})
