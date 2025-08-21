// @ts-check
//import { defineConfig, devices } from '@playwright/test';
import { defineConfig,devices } from "@playwright/test";

/**
 * @see https://playwright.dev/docs/test-configuration
 */
//export default defineConfig({ <- se quita de la configuracion para asignarlo a una variable de javascript
const config={
  testDir: './tests',
  /*Variable para configuracion de tiempo de espera de playwright */
   timeout: 40 *1000 ,
   expect:{
    timeout: 7*1000 ,
   },
   reporter: 'html',
  /* Run tests in files in parallel */
  use: {
        /*Configuracion para abrir el test en el navegador deseado puede ser chromium firefox o webkit (Safari) */
        browserName : 'chromium',
        headless : false, /*Si esta variable es true se ejecuta backend y si es false se ejecuta con navegadores, con lo cual solo se ocuparia el comando "npx playwright test" en caso de que no este es con la otra sentencia npx playwright test --headed*/
        screenshot:'on',/*Variable para que te tome captura de pantalla a los pasos de los casos de prueba */
        trace:'on' /*varibale para rastrear los pasos para ver donde falla el caso de prueba */
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    /*trace: 'on-first-retry', se comenta sentencia para que se pueda ejecutar con la variable headless c*/
  },

};

module.exports = config

