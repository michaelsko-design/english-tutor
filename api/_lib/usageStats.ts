/**
 * Product-analytics numbers for the owner dashboard, from the anonymous `analyticsDaily` counters
 * and the scrubbed `clientErrors` documents (src/services/analytics). Aggregates only.
 */
import { OWNER_STATS_DAYS, addDaysToDateStr } from './ownerStats.js';

export interface AnalyticsDayRow {
  uid: string;
  day: string;
  counts: Record<string, number>;
  /** Coarse device bucket, e.g. `ios-safari-phone-pwa`; missing on rows written before devices were tracked */
  device?: string;
}

export interface ClientErrorRow {
  day: string;
  message: string;
  source: string;
  count: number;
  device?: string;
}

/** One learner's day on one mission and tier (collection `missionStruggle`) */
export interface MissionStruggleRow {
  uid: string;
  day: string;
  missionId: string;
  tier: 'explorer' | 'challenger' | 'master';
  starts: number;
  abandons: number;
}

export interface StuckMission {
  missionId: string;
  starts: number;
  abandons: number;
  /** Distinct learners who left it unfinished */
  learners: number;
  /** Abandons by the tier being played at the time */
  tiers: { explorer: number; challenger: number; master: number };
}

export interface UsageStats {
  windowDays: number;
  /** False until the first counter arrives, so the dashboard can say "collecting" instead of 0% */
  hasData: boolean;
  /** Distinct learners who reached each step in the window */
  funnel: {
    sessions: number;
    onboardingViewed: number;
    onboarded: number;
    greeted: number;
    toured: number;
    placed: number;
    firstMission: number;
    threeStars: number;
  };
  /** Missions finished in the window, by tier */
  missionsByTier: { explorer: number; challenger: number; master: number };
  /** Share of learners (first seen at least N days ago) who came back exactly N days later; null with no cohort yet */
  retention: { day1: number | null; day7: number | null };
  /** Distinct learners who opened each feature in the window, most used first */
  features: Array<{ key: string; learners: number }>;
  errors: Array<{ message: string; source: string; count: number; days: number; devices: string[] }>;
  /** Where learners get stuck, summed over the window */
  struggle: { missionStarts: number; missionAbandons: number; hintsUsed: number; ttsErrors: number };
  /** Missions left unfinished most often in the window (only those abandoned at least once) */
  stuckMissions: StuckMission[];
  /** Distinct learners per device bucket in the window, most used first */
  devices: Array<{ device: string; learners: number }>;
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
  /** Device buckets seen in the window, most recent first (a child may use more than one) */
  devices: string[];
}

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
/** The shape of a device bucket (see src/services/analytics/deviceInfo.ts); anything else is ignored */
const DEVICE_RE = /^[a-z]{3,7}-[a-z]{3,7}-(phone|tablet|desktop)(-pwa)?$/;
const MISSION_ID_RE = /^[A-Za-z0-9_.-]{1,60}$/;
const TIERS = ['explorer', 'challenger', 'master'] as const;
const TOP_ERRORS = 8;
const TOP_STUCK_MISSIONS = 10;
const MAX_ERROR_DEVICES = 3;
const deviceOf = (value: unknown): string | undefined => (typeof value === 'string' && value.length <= 40 && DEVICE_RE.test(value) ? value : undefined);
/** Counter names that mean "opened a feature" (the feature_* events in src/services/analytics/events.ts) */
const FEATURE_PREFIX = 'feature_';
const count = (value: unknown): number => (typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0);

export function readAnalyticsRows(rows: ReadonlyArray<{ fields: Record<string, unknown> }>): AnalyticsDayRow[] {
  return rows.flatMap(({ fields }) => {
    const { uid, day, counts } = fields;
    if (typeof uid !== 'string' || typeof day !== 'string' || !DAY_RE.test(day) || !counts || typeof counts !== 'object') return [];
    const device = deviceOf(fields.device);
    return [{ uid, day, counts: Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, count(v)])), ...(device ? { device } : {}) }];
  });
}

export function readMissionStruggleRows(rows: ReadonlyArray<{ fields: Record<string, unknown> }>): MissionStruggleRow[] {
  return rows.flatMap(({ fields }) => {
    const { uid, day, missionId, tier } = fields;
    if (typeof uid !== 'string' || typeof day !== 'string' || !DAY_RE.test(day)) return [];
    if (typeof missionId !== 'string' || !MISSION_ID_RE.test(missionId)) return [];
    if (typeof tier !== 'string' || !(TIERS as readonly string[]).includes(tier)) return [];
    return [{ uid, day, missionId, tier: tier as MissionStruggleRow['tier'], starts: count(fields.starts), abandons: count(fields.abandons) }];
  });
}

/** Missions abandoned at least once in the window, most abandoned first (ties: lower completion rate) */
function stuckMissionsFrom(rows: readonly MissionStruggleRow[], windowStart: string, todayStr: string): StuckMission[] {
  const byMission = new Map<string, StuckMission & { who: Set<string> }>();
  for (const row of rows) {
    if (row.day < windowStart || row.day > todayStr) continue;
    const entry = byMission.get(row.missionId) ?? {
      missionId: row.missionId, starts: 0, abandons: 0, learners: 0, tiers: { explorer: 0, challenger: 0, master: 0 }, who: new Set<string>(),
    };
    entry.starts += row.starts;
    entry.abandons += row.abandons;
    entry.tiers = { ...entry.tiers, [row.tier]: entry.tiers[row.tier] + row.abandons };
    if (row.abandons > 0) entry.who.add(row.uid);
    byMission.set(row.missionId, entry);
  }
  return [...byMission.values()]
    .filter((entry) => entry.abandons > 0)
    .map(({ who, ...entry }): StuckMission => ({ ...entry, learners: who.size }))
    .sort((a, b) => b.abandons - a.abandons || b.abandons / Math.max(1, b.starts) - a.abandons / Math.max(1, a.starts) || a.missionId.localeCompare(b.missionId))
    .slice(0, TOP_STUCK_MISSIONS);
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
      const { uid, day, kind, text, gradeId, appVersion, testerLabel } = fields;
      if (typeof day !== 'string' || !DAY_RE.test(day) || typeof text !== 'string') return [];
      return [{
        day,
        kind: kind === 'idea' ? 'idea' : 'problem',
        text: text.slice(0, 500),
        // A note kept after its account was deleted has no uid, only the alias saved with it
        tester:
          (typeof uid === 'string' && labelOf.get(uid)) ||
          (typeof testerLabel === 'string' && testerLabel ? `${testerLabel} (account deleted)` : 'unknown'),
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
    const device = deviceOf(fields.device);
    return [{ day, message, source: typeof source === 'string' ? source : 'unknown', count: count(n), ...(device ? { device } : {}) }];
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
  feedback: readonly FeedbackRow[] = [],
  missionRows: readonly MissionStruggleRow[] = []
): UsageStats {
  const windowStart = addDaysToDateStr(todayStr, -(OWNER_STATS_DAYS - 1));
  const reached = {
    sessions: new Set<string>(),
    onboardingViewed: new Set<string>(),
    onboarded: new Set<string>(),
    greeted: new Set<string>(),
    toured: new Set<string>(),
    placed: new Set<string>(),
    firstMission: new Set<string>(),
    threeStars: new Set<string>(),
  };
  const tiers = { explorer: 0, challenger: 0, master: 0 };
  const firstSeen = new Map<string, string>();
  const seenDays = new Map<string, Set<string>>();
  const featureLearners = new Map<string, Set<string>>();
  const struggle = { missionStarts: 0, missionAbandons: 0, hintsUsed: 0, ttsErrors: 0 };
  const testerByUid = new Map(allowed.map((row) => [row.uid, row]));
  const testerTotals = new Map<string, Omit<TesterRow, 'label' | 'cohort' | 'daysActive' | 'devices'> & { days: Set<string> }>();
  const deviceLearners = new Map<string, Set<string>>();
  /** uid -> device -> latest day seen on it */
  const deviceLastSeen = new Map<string, Map<string, string>>();

  for (const { uid, day, counts, device } of analyticsRows) {
    if (day > todayStr) continue;
    const first = firstSeen.get(uid);
    if (!first || day < first) firstSeen.set(uid, day);
    seenDays.set(uid, (seenDays.get(uid) ?? new Set<string>()).add(day));
    if (day < windowStart) continue;
    if (device) {
      deviceLearners.set(device, (deviceLearners.get(device) ?? new Set<string>()).add(uid));
      const seen = deviceLastSeen.get(uid) ?? new Map<string, string>();
      const last = seen.get(device);
      deviceLastSeen.set(uid, new Map(seen).set(device, !last || day > last ? day : last));
    }
    if (counts.session_start) reached.sessions.add(uid);
    if (counts.onboarding_view) reached.onboardingViewed.add(uid);
    if (counts.onboarding_done) reached.onboarded.add(uid);
    if (counts.greeting_done) reached.greeted.add(uid);
    if (counts.tour_done) reached.toured.add(uid);
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

  const errorMap = new Map<string, { message: string; source: string; count: number; days: Set<string>; devices: Map<string, number> }>();
  for (const row of errorRows) {
    if (row.day < windowStart || row.day > todayStr) continue;
    const key = `${row.source}|${row.message}`;
    const entry = errorMap.get(key) ?? { message: row.message, source: row.source, count: 0, days: new Set<string>(), devices: new Map<string, number>() };
    entry.count += row.count;
    entry.days.add(row.day);
    if (row.device) entry.devices.set(row.device, (entry.devices.get(row.device) ?? 0) + row.count);
    errorMap.set(key, entry);
  }

  return {
    windowDays: OWNER_STATS_DAYS,
    hasData: analyticsRows.length > 0,
    funnel: {
      sessions: reached.sessions.size,
      onboardingViewed: reached.onboardingViewed.size,
      onboarded: reached.onboarded.size,
      greeted: reached.greeted.size,
      toured: reached.toured.size,
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
    stuckMissions: stuckMissionsFrom(missionRows, windowStart, todayStr),
    devices: [...deviceLearners.entries()]
      .map(([device, learners]) => ({ device, learners: learners.size }))
      .sort((a, b) => b.learners - a.learners || a.device.localeCompare(b.device)),
    feedback: [...feedback],
    // Testers who never opened the app still get a row, so "invited but silent" is visible
    testers: allowed
      .map(({ uid, label, cohort }): TesterRow => {
        const { days, ...t } = testerTotals.get(uid) ?? { days: new Set<string>(), lastSeen: null, sessions: 0, missions: 0, missionAbandons: 0, hintsUsed: 0, ttsErrors: 0 };
        const devices = [...(deviceLastSeen.get(uid) ?? new Map<string, string>()).entries()]
          .sort((a, b) => b[1].localeCompare(a[1]) || a[0].localeCompare(b[0]))
          .map(([device]) => device);
        return { label, cohort, daysActive: days.size, ...t, devices };
      })
      .sort((a, b) => (b.lastSeen ?? '').localeCompare(a.lastSeen ?? '') || a.label.localeCompare(b.label)),
    errors: [...errorMap.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, TOP_ERRORS)
      .map(({ message, source, count: n, days, devices }) => ({
        message,
        source,
        count: n,
        days: days.size,
        devices: [...devices.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, MAX_ERROR_DEVICES).map(([device]) => device),
      })),
  };
}
