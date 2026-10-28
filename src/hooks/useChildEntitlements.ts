import { useEffect, useState } from 'react';
import type { Entitlement } from '../data/proGate';
import { watchEntitlement } from '../services/entitlementService';

/** Per child: undefined while loading, null when free (or the read failed), else the entitlement */
export type ChildEntitlements = Readonly<Record<string, Entitlement | null | undefined>>;

/** The parent portal's live view of each linked child's Pro entitlement. */
export function useChildEntitlements(childUids: readonly string[]): ChildEntitlements {
  const [entitlements, setEntitlements] = useState<ChildEntitlements>({});
  const key = [...childUids].sort().join(',');

  useEffect(() => {
    const uids = key ? key.split(',') : [];
    const stops = uids.map((uid) =>
      watchEntitlement(
        uid,
        (entitlement) => setEntitlements((prev) => ({ ...prev, [uid]: entitlement })),
        // A failed read shows the child as free; the server still refuses a second plan for them
        () => setEntitlements((prev) => ({ ...prev, [uid]: null })),
        { shouldCache: false }
      )
    );
    return () => stops.forEach((stop) => stop());
  }, [key]);

  return entitlements;
}
