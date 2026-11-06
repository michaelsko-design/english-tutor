import { doc, increment, setDoc, type Firestore } from 'firebase/firestore';
import { ANALYTICS_DAILY_COLLECTION, isAnalyticsEvent } from './events';

/** Counters are written at most this often, plus once when the page is hidden */
export const FLUSH_INTERVAL_MS = 60_000;

export interface AnalyticsContext {
  uid: string;
  gradeId: string;
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
  let timer: unknown = null;

  async function flush(): Promise<void> {
    if (timer !== null) {
      clearTimer(timer);
      timer = null;
    }
    const db = deps.getDb();
    const batch = pending;
    if (!context || !db || Object.keys(batch).length === 0) return;
    const { uid, gradeId } = context;
    const day = pendingDay;
    pending = {};
    const counts = Object.fromEntries(Object.entries(batch).map(([name, n]) => [name, increment(n)]));
    try {
      await setDoc(doc(db, ANALYTICS_DAILY_COLLECTION, `${day}_${uid}`), { uid, day, gradeId, counts }, { merge: true });
    } catch {
      // Dropped on purpose: one lost batch is not worth a retry loop or an error screen
    }
  }

  function track(name: string): void {
    if (!context || !isAnalyticsEvent(name)) return;
    const day = deps.today();
    if (pendingDay && pendingDay !== day) void flush();
    pendingDay = day;
    pending = { ...pending, [name]: (pending[name] ?? 0) + 1 };
    if (timer === null) timer = setTimer(() => void flush(), FLUSH_INTERVAL_MS);
  }

  return {
    track,
    flush,
    /** Sets who the counters belong to; `null` (sign-out) flushes first and stops tracking */
    setContext(next: AnalyticsContext | null): void {
      if (context && (!next || next.uid !== context.uid)) void flush();
      context = next;
      if (!next) pending = {};
    },
  };
}
