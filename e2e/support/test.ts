import { expect, test as base } from '@playwright/test';
import { newTestLearner, TestLearner } from './emulator';

/** Firebase hosts the app may only reach through the emulators */
const FIREBASE_HOST_PATTERN = /(googleapis\.com|firebaseio\.com|firebaseapp\.com)$/;

interface Fixtures {
  /** A fresh username and PIN; the test decides whether the account exists yet */
  learner: TestLearner;
}

/**
 * Every test: no read-aloud or sound requests, and nothing may reach a real Firebase host.
 * The clock is real: Playwright's fake clock stalls the app's save timer and Firebase.
 */
export const test = base.extend<Fixtures>({
  page: async ({ page }, use) => {
    // A request to a real Firebase host is stopped before it leaves, and fails the test
    const liveFirebaseRequests: string[] = [];
    await page.route(
      (url) => FIREBASE_HOST_PATTERN.test(url.hostname),
      (route) => {
        liveFirebaseRequests.push(route.request().url());
        return route.abort();
      }
    );
    await page.route(/\/api\/tts|\.mp3(\?|$)/, (route) => route.abort());

    await use(page);

    expect(liveFirebaseRequests, 'requests that left the emulators').toEqual([]);
  },
  learner: async ({}, use) => {
    await use(newTestLearner());
  },
});

export { expect };
