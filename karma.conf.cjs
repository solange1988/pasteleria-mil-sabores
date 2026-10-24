// Configuración de Karma: ejecuta las pruebas de Jasmine de src/karma en Google Chrome.
// Se usa con: npm run test:karma
// (.cjs porque Karma lee su configuración en formato CommonJS y el proyecto es "type": "module")

module.exports = function (config) {
  config.set({
    // Jasmine: el lenguaje de las pruebas (describe, it, expect, spyOn, jasmine.createSpy)
    frameworks: ['jasmine'],

    // Archivos de prueba que Karma carga en el navegador
    files: [{ pattern: 'src/karma/**/*.spec.js', watched: false }],

    // esbuild transforma JSX e imports para que el navegador los entienda (igual que hace Vite)
    preprocessors: { 'src/karma/**/*.spec.js': ['esbuild'] },
    esbuild: {
      jsx: 'automatic',
      loader: { '.js': 'jsx' }, // las pruebas de componentes tienen JSX aunque terminen en .js
      define: { 'process.env.NODE_ENV': '"development"' },
      // un paquete por archivo: en Windows el paquete único falla con rutas cortas como ADMINI~1
      singleBundle: false,
    },

    // Chrome sin ventana: abre el navegador, corre las pruebas y lo cierra
    browsers: ['ChromeHeadless'],
    singleRun: true,

    // Muestra el avance y el resumen: "Executed 15 of 15 SUCCESS"
    reporters: ['progress'],
  })
}
