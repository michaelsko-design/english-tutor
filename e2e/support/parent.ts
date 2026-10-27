import type { Page } from '@playwright/test';
import { GoogleTestAccount } from './emulator';

const API_KEY = 'demo-api-key';

/**
 * Signs a Google account of the Auth emulator into the page by writing the SDK's saved sign-in
 * (IndexedDB) and reloading. The Google popup itself needs Google's gapi script, so the tests
 * skip it. Emulator tokens and test values only.
 */
export async function signInPageAsGoogleAccount(page: Page, account: GoogleTestAccount): Promise<void> {
  const savedUser = {
    uid: account.uid,
    email: account.email,
    emailVerified: true,
    displayName: null,
    isAnonymous: false,
    photoURL: null,
    phoneNumber: null,
    tenantId: null,
    providerData: [{ providerId: 'google.com', uid: `google-${account.uid}`, displayName: null, email: account.email, phoneNumber: null, photoURL: null }],
    stsTokenManager: {
      refreshToken: account.refreshToken,
      accessToken: account.idToken,
      expirationTime: Date.now() + account.expiresIn * 1000,
    },
    createdAt: String(Date.now()),
    lastLoginAt: String(Date.now()),
    apiKey: API_KEY,
    appName: '[DEFAULT]',
  };
  await page.evaluate(
    ({ key, value }) =>
      new Promise<void>((resolve, reject) => {
        const open = indexedDB.open('firebaseLocalStorageDb', 1);
        open.onupgradeneeded = () => open.result.createObjectStore('firebaseLocalStorage', { keyPath: 'fbase_key' });
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
          const tx = open.result.transaction('firebaseLocalStorage', 'readwrite');
          tx.objectStore('firebaseLocalStorage').put({ fbase_key: key, value });
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        };
      }),
    { key: `firebase:authUser:${API_KEY}:[DEFAULT]`, value: savedUser }
  );
  await page.reload();
}
