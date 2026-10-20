import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaEnterpriseProvider, getToken, AppCheck } from 'firebase/app-check';
import { getAuth, connectAuthEmulator, GoogleAuthProvider, Auth } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  connectFirestoreEmulator,
  persistentLocalCache,
  persistentMultipleTabManager,
  Firestore,
} from 'firebase/firestore';

/**
 * `npm run dev:emu` runs Vite in "emulator" mode: Auth and Firestore talk to the local Firebase
 * emulators (`npm run emulators`) under a demo project, never to the live project. Only honoured
 * on localhost, so a production build can't be pointed at an emulator.
 */
const isEmulatorMode: boolean =
  import.meta.env.MODE === 'emulator' &&
  typeof window !== 'undefined' &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname);

const EMULATOR_HOST = '127.0.0.1';
const EMULATOR_AUTH_PORT = 9099;
const EMULATOR_FIRESTORE_PORT = 8080;

const liveFirebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY?.trim() ||
    'AIzaSyBW8GwRMBgXDNKYyYkHKSK-ugEmJuUAm0M',
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim() ||
    'english-tutor-il-7.firebaseapp.com',
  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim() ||
    'english-tutor-il-7',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim() ||
    'english-tutor-il-7.firebasestorage.app',
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim() ||
    '1003230297590',
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID?.trim() ||
    '1:1003230297590:web:740118a4daff206b391bd7',
};

const firebaseConfig = isEmulatorMode
  ? {
      ...liveFirebaseConfig,
      apiKey: 'demo-api-key',
      authDomain: 'localhost',
      projectId: 'demo-english-vibe',
      storageBucket: 'demo-english-vibe.appspot.com',
    }
  : liveFirebaseConfig;

/**
 * Checks whether valid Firebase environment variables have been provided.
 * Prevents runtime crashes if the user hasn't created a `.env` file yet.
 */
export const isFirebaseConfigured: boolean = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'your_firebase_api_key_here' &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== 'your-project-id'
);

const appCheckSiteKey = import.meta.env.VITE_APPCHECK_SITE_KEY?.trim() ?? '';

let appCheck: AppCheck | null = null;
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    // App Check must start before Firestore/Auth are used so their requests carry a token. Without a
    // site key (or against the emulators) it stays off and the app works as before.
    if (appCheckSiteKey && !isEmulatorMode) {
      try {
        // Local dev uses a debug token (printed once in the console, registered in the Firebase console)
        if (import.meta.env.DEV) {
          (self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean }).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
        }
        appCheck = initializeAppCheck(app, {
          provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey),
          isTokenAutoRefreshEnabled: true,
        });
      } catch (err) {
        console.warn('Firebase App Check could not start:', err);
        appCheck = null;
      }
    }
    auth = getAuth(app);
    if (isEmulatorMode) {
      connectAuthEmulator(auth, `http://${EMULATOR_HOST}:${EMULATOR_AUTH_PORT}`, { disableWarnings: true });
    }
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });

    // Enable IndexedDB offline persistence across multiple tabs so the app
    // stays fast and responsive even with spotty mobile connectivity.
    try {
      db = initializeFirestore(app, {
        ignoreUndefinedProperties: true,
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });
    } catch {
      // Fallback if Firestore was already initialized during HMR
      db = getFirestore(app);
    }
    if (isEmulatorMode && db) {
      try {
        connectFirestoreEmulator(db, EMULATOR_HOST, EMULATOR_FIRESTORE_PORT);
      } catch {
        // Already connected during HMR
      }
    }
  } catch (err) {
    console.warn('Firebase initialization skipped or failed; falling back to localStorage:', err);
    app = null;
    auth = null;
    db = null;
  }
}

/** The current App Check token, or null when App Check is off or the token can't be fetched. */
export async function getAppCheckToken(): Promise<string | null> {
  if (!appCheck) return null;
  try {
    return (await getToken(appCheck)).token;
  } catch {
    return null;
  }
}

export { app, appCheck, auth, db, googleProvider };
