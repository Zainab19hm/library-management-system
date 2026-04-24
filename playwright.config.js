const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:5000',
    headless: true
  },
  webServer: {
    command: 'npm run start:test',
    url: 'http://127.0.0.1:5000',
    reuseExistingServer: true,
    timeout: 120_000
  }
});
