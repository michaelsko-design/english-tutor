import { defineConfig, devices } from '@playwright/test';

/**
 * Captures the app screenshots of the landing page (public/site/screens/) against the Firebase
 * emulators: `npm run site:screens`. Not part of `npm run test:e2e`.
 */
const PORT = 5176;
const BASE_URL = `http://localhost:${PORT}`;
// e2e/global-setup.ts warms this server up
process.env.E2E_BASE_URL = BASE_URL;

export default defineConfig({
  testDir: 'scripts/site',
  testMatch: /captureScreens\.spec\.ts/,
  globalSetup: './e2e/global-setup.ts',
  workers: 1,
  timeout: 480_000,
  expect: { timeout: 15_000 },
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
    locale: 'he-IL',
    timezoneId: 'Asia/Jerusalem',
    reducedMotion: 'reduce',
  },
  projects: [
    {
      name: 'phone',
      use: { ...devices['Pixel 7'], viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 },
    },
  ],
  webServer: {
    command: `npm run dev:emu -- --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120_000,
    env: { E2E_BASE_URL: BASE_URL },
  },
});
