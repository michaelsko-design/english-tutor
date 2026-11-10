import { defineConfig } from '@playwright/test';
import base from './playwright.config';

/**
 * Play-tests of unreleased content packs (`e2e/packs-*.spec.ts`): the app runs in Vite's "packs"
 * mode (`npm run dev:packs`, every pack shown), which talks to the Firebase emulators like the
 * emulator mode. Run it inside the emulators:
 *   npx firebase emulators:exec --only auth,firestore --project demo-english-vibe "npx playwright test -c playwright.packs.config.ts"
 */
const PORT = 5176;
const E2E_BASE_URL = `http://localhost:${PORT}`;
// e2e/global-setup.ts warms this server up
process.env.E2E_BASE_URL = E2E_BASE_URL;

export default defineConfig({
  ...base,
  testIgnore: [],
  testMatch: /packs-.*\.spec\.ts/,
  use: { ...base.use, baseURL: E2E_BASE_URL },
  webServer: {
    command: `npm run dev:packs -- --port ${PORT} --strictPort`,
    url: E2E_BASE_URL,
    // Always our own packs-mode server: one already on the port might use the live project
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
