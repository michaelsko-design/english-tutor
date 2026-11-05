import type { Page } from '@playwright/test';
import { GoogleTestAccount, GuestTestAccount } from './emulator';

const API_KEY = 'demo-api-key';

interface SavedSignIn {
  uid: string;
  email: string | null;
  isAnonymous: boolean;
  providerData: unknown[];
  idToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Writes the SDK's saved sign-in (IndexedDB) for an Auth-emulator account and reloads, so the app
 * starts signed in. The page must already be on the app's origin. Emulator tokens and test values only.
 */
async function saveSignIn(page: Page, account: SavedSignIn): Promise<void> {
  const savedUser = {
    uid: account.uid,
    email: account.email,
    emailVerified: Boolean(account.email),
    displayName: null,
    isAnonymous: account.isAnonymous,
    photoURL: null,
    phoneNumber: null,
    tenantId: null,
    providerData: account.providerData,
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

/**
 * Signs a Google account of the Auth emulator into the page. The Google popup itself needs
 * Google's gapi script, so the tests skip it.
 */
export async function signInPageAsGoogleAccount(page: Page, account: GoogleTestAccount): Promise<void> {
  await saveSignIn(page, {
    ...account,
    isAnonymous: false,
    providerData: [{ providerId: 'google.com', uid: `google-${account.uid}`, displayName: null, email: account.email, phoneNumber: null, photoURL: null }],
  });
}

/** Signs an anonymous (guest) account of the Auth emulator into the page. */
export async function signInPageAsGuest(page: Page, account: GuestTestAccount): Promise<void> {
  await saveSignIn(page, { ...account, email: null, isAnonymous: true, providerData: [] });
}
