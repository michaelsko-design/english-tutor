import { doc, increment, setDoc, type Firestore } from 'firebase/firestore';
import {
  ANALYTICS_DAILY_COLLECTION,
  MISSION_STRUGGLE_COLLECTION,
  isAnalyticsEvent,
  isMissionId,
  isMissionTier,
  type MissionTier,
} from './events';

/** Counters are written at most this often, plus once when the page is hidden */
export const FLUSH_INTERVAL_MS = 60_000;

export interface AnalyticsContext {
  uid: string;
  gradeId: string;
  /** A coarse device bucket (deviceInfo.ts); left out when unknown */
  device?: string;
}

export type MissionSignal = 'start' | 'abandon';

interface PendingMission {
  missionId: string;
  tier: MissionTier;
  starts: number;
  abandons: number;
}

interface AnalyticsDeps {
  getDb: () => Firestore | null;
  /** The learner's local calendar day, YYYY-MM-DD */
  today: () => string;
  setTimer?: (fn: () => void, ms: number) => unknown;
  clearTimer?: (handle: unknown) => void;
}

/**
 * Batches anonymous event counters into one `analyticsDaily/{day}_{uid}` document per learner and
 * day. Failures are swallowed on purpose: analytics must never break the app.
 */
export function createAnalytics(deps: AnalyticsDeps) {
  const setTimer = deps.setTimer ?? ((fn, ms) => setTimeout(fn, ms));
  const clearTimer = deps.clearTimer ?? ((handle) => clearTimeout(handle as ReturnType<typeof setTimeout>));
  let context: AnalyticsContext | null = null;
  let pending: Readonly<Record<string, number>> = {};
  let pendingDay = '';
  let pendingMissions: Readonly<Record<string, PendingMission>> = {};
  let timer: unknown = null;

  async function writeMissions(
    db: Firestore,
    uid: string,
    day: string,
    batch: Readonly<Record<string, PendingMission>>
  ): Promise<void> {
    await Promise.all(
      Object.values(batch).map(async ({ missionId, tier, starts, abandons }) => {
        try {
          await setDoc(
            doc(db, MISSION_STRUGGLE_COLLECTION, `${day}_${uid}_${missionId}_${tier}`),
            { uid, day, missionId, tier, starts: increment(starts), abandons: increment(abandons) },
            { merge: true }
          );
        } catch {
          // Dropped on purpose, like the counters
        }
      })
    );
  }

  async function flush(): Promise<void> {
    if (timer !== null) {
      clearTimer(timer);
      timer = null;
    }
    const db = deps.getDb();
    const batch = pending;
    const missionBatch = pendingMissions;
    const hasCounters = Object.keys(batch).length > 0;
    const hasMissions = Object.keys(missionBatch).length > 0;
    if (!context || !db || (!hasCounters && !hasMissions)) return;
    const { uid, gradeId, device } = context;
    const day = pendingDay;
    pending = {};
    pendingMissions = {};
    const writes: Array<Promise<void>> = [];
    if (hasMissions) writes.push(writeMissions(db, uid, day, missionBatch));
    if (hasCounters) {
      const counts = Object.fromEntries(Object.entries(batch).map(([name, n]) => [name, increment(n)]));
      const data = { uid, day, gradeId, counts, ...(device ? { device } : {}) };
      writes.push(
        setDoc(doc(db, ANALYTICS_DAILY_COLLECTION, `${day}_${uid}`), data, { merge: true }).then(
          () => undefined,
          () => undefined // Dropped on purpose: one lost batch is not worth a retry loop or an error screen
        )
      );
    }
    await Promise.all(writes);
  }

  function startPendingDay(): void {
    const day = deps.today();
    if (pendingDay && pendingDay !== day) void flush();
    pendingDay = day;
    if (timer === null) timer = setTimer(() => void flush(), FLUSH_INTERVAL_MS);
  }

  function track(name: string): void {
    if (!context || !isAnalyticsEvent(name)) return;
    startPendingDay();
    pending = { ...pending, [name]: (pending[name] ?? 0) + 1 };
  }

  /** A mission opened or closed unfinished, kept per mission and tier so the owner sees where learners quit */
  function trackMission(missionId: string, tier: string, signal: MissionSignal): void {
    if (!context || !isMissionId(missionId) || !isMissionTier(tier)) return;
    startPendingDay();
    const key = `${missionId}|${tier}`;
    const current = pendingMissions[key] ?? { missionId, tier, starts: 0, abandons: 0 };
    pendingMissions = {
      ...pendingMissions,
      [key]: signal === 'start' ? { ...current, starts: current.starts + 1 } : { ...current, abandons: current.abandons + 1 },
    };
  }

  return {
    track,
    trackMission,
    flush,
    /** Sets who the counters belong to; `null` (sign-out) flushes first and stops tracking */
    setContext(next: AnalyticsContext | null): void {
      if (context && (!next || next.uid !== context.uid)) void flush();
      context = next;
      if (!next) {
        pending = {};
        pendingMissions = {};
      }
    },
  };
}
