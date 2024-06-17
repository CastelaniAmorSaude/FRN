const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    viewportWidth: 1440,
    viewportHeight: 800,
    setupNodeEvents(on, config) {},    
    baseUrl: 'https://amei-staging.amorsaude.com.br',
    defaultCommandTimeout: 12000,    
  },
});
