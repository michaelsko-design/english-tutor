import { LIVE_CACHE_NAME } from '../services/tts/hybridTtsService';

/** Every key the app keeps on the device starts with this (internal ids keep the old name) */
const APP_KEY_PREFIX = 'english_tutor_';

/** Firestore's offline cache: one IndexedDB database per project, named `firestore/...` */
const FIRESTORE_DB_PREFIX = 'firestore/';

interface LocalStores {
  local: Storage | null;
  session: Storage | null;
  caches: Pick<CacheStorage, 'delete'> | null;
  indexedDb?: Pick<IDBFactory, 'databases' | 'deleteDatabase'> | null;
  /** Starts the app afresh: Firestore stops working in a page whose offline copy is being deleted */
  reload?: () => void;
}

function browserStores(): LocalStores {
  const read = <T>(get: () => T): T | null => {
    try {
      return get();
    } catch {
      return null;
    }
  };
  return {
    local: read(() => window.localStorage),
    session: read(() => window.sessionStorage),
    caches: read(() => (typeof caches === 'undefined' ? null : caches)),
    indexedDb: read(() => (typeof indexedDB === 'undefined' ? null : indexedDB)),
    reload: () => window.location.reload(),
  };
}

function removeAppKeys(storage: Storage | null): void {
  if (!storage) return;
  try {
    const keys = Array.from({ length: storage.length }, (_, index) => storage.key(index)).filter(
      (key): key is string => key !== null && key.startsWith(APP_KEY_PREFIX)
    );
    keys.forEach((key) => storage.removeItem(key));
  } catch {
    // Blocked storage holds nothing of ours to remove
  }
}

/**
 * Removes what the app kept on this device (profile copy, device id, parent codes, sticker pictures,
 * read-aloud audio that may say the learner's name) after an account is deleted, as the privacy
 * notice promises, then reloads the page so the app starts signed out with a fresh connection (a new
 * sign-up in the same page would hang on the deleted offline copy). Best effort: blocked storage never
 * fails the deletion.
 */
export async function clearLocalAppData(stores: LocalStores = browserStores()): Promise<void> {
  removeAppKeys(stores.local);
  removeAppKeys(stores.session);
  await stores.caches?.delete(LIVE_CACHE_NAME).catch(() => false);
  await requestFirestoreCacheDeletion(stores.indexedDb ?? null);
  stores.reload?.();
}

/**
 * Asks the browser to delete Firestore's offline copy (profile, parent data). Not awaited to the end:
 * the deletion waits until the open connection closes, which the reload that follows does.
 */
async function requestFirestoreCacheDeletion(indexedDb: LocalStores['indexedDb']): Promise<void> {
  if (!indexedDb?.databases) return;
  try {
    const databases = await indexedDb.databases();
    databases
      .map((database) => database.name)
      .filter((name): name is string => typeof name === 'string' && name.startsWith(FIRESTORE_DB_PREFIX))
      .forEach((name) => indexedDb.deleteDatabase(name));
  } catch {
    // Blocked storage: nothing to delete
  }
}
