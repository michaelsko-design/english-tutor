import { DiamondLedger, DiamondLedgerEntry, LearnerProfile } from '../types/learner';

/**
 * Diamonds as per-device totals. Each device only adds to its own `earned` and `spent`, and both
 * only grow, so two devices merge by taking the larger value of each: a purchase on one device
 * is never refunded by another, and offline earnings on both are kept.
 *
 * Reward and shop code keeps changing `stats.diamonds`; `App.handleUpdateProfile` passes every
 * local update through recordDiamondChange, which turns the change into this device's ledger
 * entry. The balance from before the ledger existed becomes the `legacy` entry.
 */

export const LEGACY_LEDGER_KEY = 'legacy';

function isEntry(value: unknown): value is DiamondLedgerEntry {
  const entry = value as DiamondLedgerEntry | null;
  return Boolean(entry) && Number.isFinite(entry!.earned) && Number.isFinite(entry!.spent);
}

export function getLedgerBalance(ledger: DiamondLedger): number {
  let balance = 0;
  for (const entry of Object.values(ledger)) {
    if (isEntry(entry)) balance += entry.earned - entry.spent;
  }
  // Two devices spending the same diamonds offline can overdraw; the shop then waits for earnings.
  return Math.max(0, balance);
}

function getLedger(profile: LearnerProfile): DiamondLedger {
  return profile.diamondLedger ?? { [LEGACY_LEDGER_KEY]: { earned: profile.stats.diamonds, spent: 0 } };
}

/** Records the diamond change from `prev` to `next` as earned or spent on this device. */
export function recordDiamondChange(prev: LearnerProfile, next: LearnerProfile, deviceId: string): LearnerProfile {
  const delta = next.stats.diamonds - prev.stats.diamonds;
  if (delta === 0) {
    return prev.diamondLedger ? { ...next, diamondLedger: prev.diamondLedger } : next;
  }

  const ledger = getLedger(prev);
  const entry = ledger[deviceId] ?? { earned: 0, spent: 0 };
  const diamondLedger: DiamondLedger = {
    ...ledger,
    [deviceId]: delta > 0 ? { ...entry, earned: entry.earned + delta } : { ...entry, spent: entry.spent - delta },
  };
  return {
    ...next,
    diamondLedger,
    stats: { ...next.stats, diamonds: getLedgerBalance(diamondLedger) },
  };
}

/** Each device's larger totals. A side without a ledger adds nothing. */
export function mergeDiamondLedgers(
  local: DiamondLedger | undefined,
  cloud: DiamondLedger | undefined
): DiamondLedger | undefined {
  if (!local && !cloud) return undefined;
  const merged: DiamondLedger = {};
  for (const source of [local, cloud]) {
    for (const [deviceId, entry] of Object.entries(source ?? {})) {
      if (!isEntry(entry)) continue;
      const current = merged[deviceId];
      merged[deviceId] = current
        ? { earned: Math.max(current.earned, entry.earned), spent: Math.max(current.spent, entry.spent) }
        : { earned: entry.earned, spent: entry.spent };
    }
  }
  return merged;
}
