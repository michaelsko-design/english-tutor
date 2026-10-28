import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PRO_GATING_ENABLED } from '../config/proTier';
import { getProAccess, isPro, type Entitlement, type ProAccess } from '../data/proGate';
import { readCachedEntitlement, watchEntitlement } from '../services/entitlementService';

/** Everything opens while gating is off, so a screen outside the provider loses nothing */
export const ProAccessContext = createContext<ProAccess>(getProAccess(false));

/** What the learner may open (App provides it from `useEntitlement`). */
export function useProAccess(): ProAccess {
  return useContext(ProAccessContext);
}

/**
 * The signed-in learner's entitlement: the cached value at once, then the live one. Nothing is
 * read while gating is switched off.
 */
export function useEntitlement(uid: string | undefined, isGatingOn: boolean = PRO_GATING_ENABLED): Entitlement | null {
  // Kept with the uid it belongs to, so another account signing in never sees it, not even for one render
  const [live, setLive] = useState<{ uid: string; entitlement: Entitlement | null } | null>(null);

  useEffect(() => {
    if (!uid || !isGatingOn) return undefined;
    return watchEntitlement(
      uid,
      (entitlement) => setLive({ uid, entitlement }),
      (error) => console.warn('Reading the Pro status failed:', error)
    );
  }, [uid, isGatingOn]);

  if (!uid || !isGatingOn) return null;
  return live?.uid === uid ? live.entitlement : readCachedEntitlement(uid);
}

/** The learner's Pro access now. */
export function useLearnerProAccess(uid: string | undefined, isGatingOn: boolean = PRO_GATING_ENABLED): ProAccess {
  const entitlement = useEntitlement(uid, isGatingOn);
  const isProNow = isPro(entitlement, Date.now());
  // One object per state, so the screens that read the context don't redraw for nothing
  return useMemo(() => getProAccess(isProNow, isGatingOn), [isProNow, isGatingOn]);
}
