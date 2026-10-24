import react from '@vitejs/plugin-react'
import { defineConfig, configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // navegador simulado para probar componentes
    globals: true, // permite usar describe/it/expect estilo Jasmine sin importarlos
    setupFiles: 'src/test/configuracion.js',
    // src/karma tiene las pruebas de Jasmine que ejecuta Karma (npm run test:karma), no Vitest
    exclude: [...configDefaults.exclude, 'src/karma/**'],
    coverage: {
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/test/**', 'src/karma/**'],
    },
  },
})
