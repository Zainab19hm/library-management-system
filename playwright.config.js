const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:5000',
    headless: true
  },
  webServer: {
    command: 'npm run dev', // or 'npm start' - whatever starts your app
    url: 'http://localhost:5000', // or 3000, check your local port
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  }
});
