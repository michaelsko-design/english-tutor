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
  errors: Array<{ message: string; source: string; count: number; days: number }>;
}

const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
const TOP_ERRORS = 8;
const count = (value: unknown): number => (typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0);

export function readAnalyticsRows(rows: ReadonlyArray<{ fields: Record<string, unknown> }>): AnalyticsDayRow[] {
  return rows.flatMap(({ fields }) => {
    const { uid, day, counts } = fields;
    if (typeof uid !== 'string' || typeof day !== 'string' || !DAY_RE.test(day) || !counts || typeof counts !== 'object') return [];
    return [{ uid, day, counts: Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, count(v)])) }];
  });
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
  todayStr: string
): UsageStats {
  const windowStart = addDaysToDateStr(todayStr, -(OWNER_STATS_DAYS - 1));
  const reached = { sessions: new Set<string>(), onboarded: new Set<string>(), placed: new Set<string>(), firstMission: new Set<string>(), threeStars: new Set<string>() };
  const tiers = { explorer: 0, challenger: 0, master: 0 };
  const firstSeen = new Map<string, string>();
  const seenDays = new Map<string, Set<string>>();

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
    tiers.explorer += counts.mission_finish_tier_explorer ?? 0;
    tiers.challenger += counts.mission_finish_tier_challenger ?? 0;
    tiers.master += counts.mission_finish_tier_master ?? 0;
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
    errors: [...errorMap.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, TOP_ERRORS)
      .map(({ message, source, count: n, days }) => ({ message, source, count: n, days: days.size })),
  };
}
