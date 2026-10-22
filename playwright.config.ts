import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests against the Firebase emulators (`npm run test:e2e`, which starts them).
 * The app runs in Vite's emulator mode, so Auth and Firestore never reach the live project;
 * e2e/global-setup.ts refuses to run otherwise.
 */
const PORT = 5175;
const E2E_BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: 'e2e',
  globalSetup: './e2e/global-setup.ts',
  // One shared emulator: tests run one at a time and each makes its own learner
  workers: 1,
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  timeout: 90_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: E2E_BASE_URL,
    locale: 'he-IL',
    timezoneId: 'Asia/Jerusalem',
    reducedMotion: 'reduce',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npm run dev:emu -- --port ${PORT} --strictPort`,
    url: E2E_BASE_URL,
    // Always our own emulator-mode server: one already on the port might use the live project
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
