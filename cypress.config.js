const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: 'https://amei-staging.amorsaude.com.br',
    defaultCommandTimeout: 8000,
  },
});
