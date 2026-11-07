/**
 * Product-analytics numbers for the owner dashboard, from the anonymous `analyticsDaily` counters
 * and the scrubbed `clientErrors` documents (src/services/analytics). Aggregates only.
 */
import { OWNER_STATS_DAYS, addDaysToDateStr } from './ownerStats.js';

export interface AnalyticsDayRow {
  uid: string;
  day: string;
  counts: Record<string, number>;
}

export interface ClientErrorRow {
  day: string;
  message: string;
  source: string;
  count: number;
}

export interface UsageStats {
  windowDays: number;
  /** False until the first counter arrives, so the dashboard can say "collecting" instead of 0% */
  hasData: boolean;
  /** Distinct learners who reached each step in the window */
  funnel: { sessions: number; onboarded: number; placed: number; firstMission: number; threeStars: number };
  /** Missions finished in the window, by tier */
  missionsByTier: { explorer: number; challenger: number; master: number };
  /** Share of learners (first seen at least N days ago) who came back exactly N days later; null with no cohort yet */
  retention: { day1: number | null; day7: number | null };
  /** Distinct learners who opened each feature in the window, most used first */
  features: Array<{ key: string; learners: number }>;
  errors: Array<{ message: string; source: string; count: number; days: number }>;
  /** Where learners get stuck, summed over the window */
  struggle: { missionStarts: number; missionAbandons: number; hintsUsed: number; ttsErrors: number };
  /** One row per invited early tester (label = the invite alias), most recently seen first */
  testers: TesterRow[];
  /** Newest tester notes first (text is capped at 500 characters by the rules) */
  feedback: FeedbackRow[];
}

export interface FeedbackRow {
  day: string;
  kind: string;
  text: string;
  tester: string;
  gradeId: string;
  appVersion: string;
}

export interface AllowedRow {
  uid: string;
  label: string;
  cohort: string;
}

export interface TesterRow {
  label: string;
  cohort: string;
  /** Days with any activity in the window */
  daysActive: number;
  lastSeen: string | null;
  sessions: number;
  missions: number;
  missionAbandons: number;
  hintsUsed: number;
  ttsErrors: number;
}

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const TOP_ERRORS = 8;
/** Counter names that mean "opened a feature" (the feature_* events in src/services/analytics/events.ts) */
const FEATURE_PREFIX = 'feature_';
const count = (value: unknown): number => (typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0);

export function readAnalyticsRows(rows: ReadonlyArray<{ fields: Record<string, unknown> }>): AnalyticsDayRow[] {
  return rows.flatMap(({ fields }) => {
    const { uid, day, counts } = fields;
    if (typeof uid !== 'string' || typeof day !== 'string' || !DAY_RE.test(day) || !counts || typeof counts !== 'object') return [];
    return [{ uid, day, counts: Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, count(v)])) }];
  });
}

export function readAllowedRows(rows: ReadonlyArray<{ id: string; fields: Record<string, unknown> }>): AllowedRow[] {
  return rows.map(({ id, fields }) => ({
    uid: id,
    label: typeof fields.label === 'string' && fields.label ? fields.label : 'unlabeled',
    cohort: typeof fields.cohort === 'string' && fields.cohort ? fields.cohort : 'none',
  }));
}

const MAX_FEEDBACK_ROWS = 30;

export function readFeedbackRows(
  rows: ReadonlyArray<{ fields: Record<string, unknown> }>,
  allowed: readonly AllowedRow[]
): FeedbackRow[] {
  const labelOf = new Map(allowed.map((row) => [row.uid, row.label]));
  return rows
    .flatMap(({ fields }) => {
      const { uid, day, kind, text, gradeId, appVersion } = fields;
      if (typeof day !== 'string' || !DAY_RE.test(day) || typeof text !== 'string') return [];
      return [{
        day,
        kind: kind === 'idea' ? 'idea' : 'problem',
        text: text.slice(0, 500),
        tester: typeof uid === 'string' ? (labelOf.get(uid) ?? 'unknown') : 'unknown',
        gradeId: typeof gradeId === 'string' ? gradeId : '',
        appVersion: typeof appVersion === 'string' ? appVersion : '',
      }];
    })
    .sort((a, b) => b.day.localeCompare(a.day))
    .slice(0, MAX_FEEDBACK_ROWS);
}

export function readClientErrorRows(rows: ReadonlyArray<{ fields: Record<string, unknown> }>): ClientErrorRow[] {
  return rows.flatMap(({ fields }) => {
    const { day, message, source, count: n } = fields;
    if (typeof day !== 'string' || !DAY_RE.test(day) || typeof message !== 'string') return [];
    return [{ day, message, source: typeof source === 'string' ? source : 'unknown', count: count(n) }];
  });
}

function retentionFor(firstSeen: ReadonlyMap<string, string>, seenDays: ReadonlyMap<string, ReadonlySet<string>>, offset: number, todayStr: string): number | null {
  let eligible = 0;
  let returned = 0;
  for (const [uid, first] of firstSeen) {
    const target = addDaysToDateStr(first, offset);
    if (target > todayStr) continue;
    eligible += 1;
    if (seenDays.get(uid)?.has(target)) returned += 1;
  }
  return eligible ? Math.round((returned / eligible) * 100) / 100 : null;
}

export function computeUsageStats(
  analyticsRows: readonly AnalyticsDayRow[],
  errorRows: readonly ClientErrorRow[],
  todayStr: string,
  allowed: readonly AllowedRow[] = [],
  feedback: readonly FeedbackRow[] = []
): UsageStats {
  const windowStart = addDaysToDateStr(todayStr, -(OWNER_STATS_DAYS - 1));
  const reached = { sessions: new Set<string>(), onboarded: new Set<string>(), placed: new Set<string>(), firstMission: new Set<string>(), threeStars: new Set<string>() };
  const tiers = { explorer: 0, challenger: 0, master: 0 };
  const firstSeen = new Map<string, string>();
  const seenDays = new Map<string, Set<string>>();
  const featureLearners = new Map<string, Set<string>>();
  const struggle = { missionStarts: 0, missionAbandons: 0, hintsUsed: 0, ttsErrors: 0 };
  const testerByUid = new Map(allowed.map((row) => [row.uid, row]));
  const testerTotals = new Map<string, Omit<TesterRow, 'label' | 'cohort' | 'daysActive'> & { days: Set<string> }>();

  for (const { uid, day, counts } of analyticsRows) {
    if (day > todayStr) continue;
    const first = firstSeen.get(uid);
    if (!first || day < first) firstSeen.set(uid, day);
    seenDays.set(uid, (seenDays.get(uid) ?? new Set<string>()).add(day));
    if (day < windowStart) continue;
    if (counts.session_start) reached.sessions.add(uid);
    if (counts.onboarding_done) reached.onboarded.add(uid);
    if (counts.placement_done) reached.placed.add(uid);
    if (counts.mission_finish) reached.firstMission.add(uid);
    if (counts.mission_three_stars) reached.threeStars.add(uid);
    struggle.missionStarts += counts.mission_start ?? 0;
    struggle.missionAbandons += counts.mission_abandon ?? 0;
    struggle.hintsUsed += counts.hint_used ?? 0;
    struggle.ttsErrors += counts.tts_error ?? 0;
    if (testerByUid.has(uid)) {
      const t = testerTotals.get(uid) ?? { lastSeen: null, sessions: 0, missions: 0, missionAbandons: 0, hintsUsed: 0, ttsErrors: 0, days: new Set<string>() };
      t.days.add(day);
      t.lastSeen = !t.lastSeen || day > t.lastSeen ? day : t.lastSeen;
      t.sessions += counts.session_start ?? 0;
      t.missions += counts.mission_finish ?? 0;
      t.missionAbandons += counts.mission_abandon ?? 0;
      t.hintsUsed += counts.hint_used ?? 0;
      t.ttsErrors += counts.tts_error ?? 0;
      testerTotals.set(uid, t);
    }
    tiers.explorer += counts.mission_finish_tier_explorer ?? 0;
    tiers.challenger += counts.mission_finish_tier_challenger ?? 0;
    tiers.master += counts.mission_finish_tier_master ?? 0;
    for (const [key, value] of Object.entries(counts)) {
      if (!key.startsWith(FEATURE_PREFIX) || !value) continue;
      featureLearners.set(key, (featureLearners.get(key) ?? new Set<string>()).add(uid));
    }
  }

  const errorMap = new Map<string, { message: string; source: string; count: number; days: Set<string> }>();
  for (const row of errorRows) {
    if (row.day < windowStart || row.day > todayStr) continue;
    const key = `${row.source}|${row.message}`;
    const entry = errorMap.get(key) ?? { message: row.message, source: row.source, count: 0, days: new Set<string>() };
    entry.count += row.count;
    entry.days.add(row.day);
    errorMap.set(key, entry);
  }

  return {
    windowDays: OWNER_STATS_DAYS,
    hasData: analyticsRows.length > 0,
    funnel: {
      sessions: reached.sessions.size,
      onboarded: reached.onboarded.size,
      placed: reached.placed.size,
      firstMission: reached.firstMission.size,
      threeStars: reached.threeStars.size,
    },
    missionsByTier: tiers,
    retention: { day1: retentionFor(firstSeen, seenDays, 1, todayStr), day7: retentionFor(firstSeen, seenDays, 7, todayStr) },
    features: [...featureLearners.entries()]
      .map(([key, learners]) => ({ key, learners: learners.size }))
      .sort((a, b) => b.learners - a.learners || a.key.localeCompare(b.key)),
    struggle,
    feedback: [...feedback],
    // Testers who never opened the app still get a row, so "invited but silent" is visible
    testers: allowed
      .map(({ uid, label, cohort }): TesterRow => {
        const { days, ...t } = testerTotals.get(uid) ?? { days: new Set<string>(), lastSeen: null, sessions: 0, missions: 0, missionAbandons: 0, hintsUsed: 0, ttsErrors: 0 };
        return { label, cohort, daysActive: days.size, ...t };
      })
      .sort((a, b) => (b.lastSeen ?? '').localeCompare(a.lastSeen ?? '') || a.label.localeCompare(b.label)),
    errors: [...errorMap.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, TOP_ERRORS)
      .map(({ message, source, count: n, days }) => ({ message, source, count: n, days: days.size })),
  };
}
