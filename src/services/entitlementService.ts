import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { parseEntitlement, type Entitlement } from '../data/proGate';

/**
 * The learner's Pro entitlement (`entitlements/{uid}`, written only by the server). The last value is
 * kept on the device, so Pro works offline and the first paint after a restart is right.
 */

const cacheKey = (uid: string) => `english_tutor_entitlement_${uid}`;

export function readCachedEntitlement(uid: string): Entitlement | null {
  try {
    const raw = localStorage.getItem(cacheKey(uid));
    return raw ? parseEntitlement(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function cacheEntitlement(uid: string, entitlement: Entitlement | null): void {
  try {
    if (entitlement) localStorage.setItem(cacheKey(uid), JSON.stringify(entitlement));
    else localStorage.removeItem(cacheKey(uid));
  } catch {
    // Storage full or blocked: the live value still works for this session
  }
}

/**
 * Follows the learner's entitlement. A missing document means free; a failed read keeps the cached
 * value (losing Pro for a moment offline is better than blocking play).
 */
export function watchEntitlement(
  uid: string,
  onChange: (entitlement: Entitlement | null) => void,
  onError: (error: unknown) => void,
  /** The parent portal follows its children's plans live and keeps nothing on the device */
  { shouldCache = true }: { shouldCache?: boolean } = {}
): () => void {
  if (!db) return () => undefined;
  return onSnapshot(
    doc(db, 'entitlements', uid),
    (snapshot) => {
      const entitlement = snapshot.exists() ? parseEntitlement(snapshot.data()) : null;
      if (shouldCache) cacheEntitlement(uid, entitlement);
      onChange(entitlement);
    },
    onError
  );
}

/** The entitlement as the server has it now (the data export); null when there is none or it can't be read. */
export async function readEntitlementOnce(uid: string): Promise<Entitlement | null> {
  if (!db) return null;
  try {
    const snapshot = await getDoc(doc(db, 'entitlements', uid));
    return snapshot.exists() ? parseEntitlement(snapshot.data()) : null;
  } catch {
    return null;
  }
}
