import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 1,
  timeout: 30_000,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Lance les serveurs automatiquement si pas déjà démarrés
  webServer: [
    {
      command: 'cd backend && npm run dev',
      url: 'http://localhost:4000/api/health',
      timeout: 30_000,
      reuseExistingServer: true,
    },
    {
      command: 'cd frontend && npm run dev',
      url: 'http://localhost:3000',
      timeout: 60_000,
      reuseExistingServer: true,
    },
  ],
})
