import { ActivityLogEntry, LearnerProfile } from '../types/learner';
import { addDays, toLocalDateStr } from './examPrep';

/**
 * Daily activity log for the weekly parent report (Feature 9).
 *
 * Every local profile update passes through `recordActivityLog`, which compares the profile
 * before and after the update and adds the difference to today's entry. This catches every
 * source of XP, stars and daily counters without touching each reward call site. Cloud
 * snapshots are merged with `mergeActivityLog` instead, so nothing is counted twice.
 */

/** 12 weeks of history; older days are dropped. */
export const ACTIVITY_LOG_DAYS = 84;

const positive = (value: number): number => (value > 0 ? value : 0);

function emptyEntry(dateStr: string): ActivityLogEntry {
  return {
    dateStr,
    sessions: 0,
    voiceWords: 0,
    threeStarSessions: 0,
    xpEarned: 0,
    starsGained: 0,
    missionStars: {},
    firstCompletedIds: [],
  };
}

interface CounterDelta {
  sessions: number;
  voiceWords: number;
  threeStarSessions: number;
}

/** Today's counter growth; on a new counter day the new counters are all new activity. */
function getCounterDelta(prev: LearnerProfile, next: LearnerProfile): CounterDelta {
  const before = prev.dailyCounters;
  const after = next.dailyCounters;
  if (!after) return { sessions: 0, voiceWords: 0, threeStarSessions: 0 };
  const isSameDay = before?.dateStr === after.dateStr;
  const base = (value: number | undefined): number => (isSameDay ? value || 0 : 0);
  return {
    sessions: positive((after.missionsCompletedToday || 0) - base(before?.missionsCompletedToday)),
    voiceWords: positive((after.voiceWordsPracticedToday || 0) - base(before?.voiceWordsPracticedToday)),
    threeStarSessions: positive(
      (after.threeStarMissionsToday || 0) - base(before?.threeStarMissionsToday)
    ),
  };
}

interface StarGains {
  starsGained: number;
  missionStars: Record<string, number>;
  firstCompletedIds: string[];
}

function getStarGains(prev: LearnerProfile, next: LearnerProfile): StarGains {
  const before = prev.missionProgress || {};
  const gains: StarGains = { starsGained: 0, missionStars: {}, firstCompletedIds: [] };
  for (const [missionId, stars] of Object.entries(next.missionProgress || {})) {
    const previousStars = before[missionId] || 0;
    if (stars <= previousStars) continue;
    gains.starsGained += stars - previousStars;
    gains.missionStars[missionId] = stars;
    if (previousStars === 0) gains.firstCompletedIds.push(missionId);
  }
  return gains;
}

/** Drops days older than the log keeps and sorts the rest oldest first. */
export function pruneActivityLog(log: ActivityLogEntry[], todayStr: string): ActivityLogEntry[] {
  const oldestKept = addDays(todayStr, -(ACTIVITY_LOG_DAYS - 1));
  return log
    .filter((entry) => entry.dateStr >= oldestKept)
    .sort((a, b) => a.dateStr.localeCompare(b.dateStr));
}

/** Adds what changed between two versions of the profile to today's log entry. */
export function recordActivityLog(
  prev: LearnerProfile,
  next: LearnerProfile,
  now: Date
): LearnerProfile {
  const counters = getCounterDelta(prev, next);
  const stars = getStarGains(prev, next);
  const xpEarned = positive((next.stats?.xp || 0) - (prev.stats?.xp || 0));
  const hasActivity =
    counters.sessions + counters.voiceWords + counters.threeStarSessions + xpEarned + stars.starsGained > 0;
  if (!hasActivity) return next;

  const todayStr = toLocalDateStr(now);
  const log = next.activityLog || [];
  const today = log.find((entry) => entry.dateStr === todayStr) || emptyEntry(todayStr);
  const updatedToday: ActivityLogEntry = {
    ...today,
    dateStr: todayStr,
    sessions: today.sessions + counters.sessions,
    voiceWords: today.voiceWords + counters.voiceWords,
    threeStarSessions: today.threeStarSessions + counters.threeStarSessions,
    xpEarned: today.xpEarned + xpEarned,
    starsGained: today.starsGained + stars.starsGained,
    missionStars: { ...today.missionStars, ...stars.missionStars },
    firstCompletedIds: Array.from(new Set([...today.firstCompletedIds, ...stars.firstCompletedIds])),
  };
  const others = log.filter((entry) => entry.dateStr !== todayStr);
  return { ...next, activityLog: pruneActivityLog([...others, updatedToday], todayStr) };
}

/** Longest active time one flush may add, so a throttled or stuck timer cannot inflate the day. */
export const MAX_ACTIVE_SECONDS_PER_FLUSH = 15 * 60;
const MAX_ACTIVE_SECONDS_PER_DAY = 20 * 60 * 60;

/** Adds active-use seconds to today's log entry (owner analytics; see `ActivityLogEntry.activeSeconds`). */
export function addActiveSeconds(profile: LearnerProfile, seconds: number, now: Date): LearnerProfile {
  const added = Math.min(Math.floor(seconds), MAX_ACTIVE_SECONDS_PER_FLUSH);
  if (!(added > 0)) return profile;
  const todayStr = toLocalDateStr(now);
  const log = profile.activityLog || [];
  const today = log.find((entry) => entry.dateStr === todayStr) || emptyEntry(todayStr);
  const updatedToday: ActivityLogEntry = {
    ...today,
    activeSeconds: Math.min((today.activeSeconds || 0) + added, MAX_ACTIVE_SECONDS_PER_DAY),
  };
  const others = log.filter((entry) => entry.dateStr !== todayStr);
  return { ...profile, activityLog: pruneActivityLog([...others, updatedToday], todayStr) };
}

/** The log without owner-only fields, for anything a learner or parent can see. */
export function stripOwnerFields(log: ActivityLogEntry[]): ActivityLogEntry[] {
  return log.map((entry) => {
    const visible = { ...entry };
    delete visible.activeSeconds;
    return visible;
  });
}

function mergeEntries(a: ActivityLogEntry, b: ActivityLogEntry): ActivityLogEntry {
  const missionIds = Array.from(new Set([...Object.keys(a.missionStars), ...Object.keys(b.missionStars)]));
  const activeSeconds = Math.max(a.activeSeconds || 0, b.activeSeconds || 0);
  return {
    ...(activeSeconds > 0 ? { activeSeconds } : {}),
    dateStr: a.dateStr,
    sessions: Math.max(a.sessions, b.sessions),
    voiceWords: Math.max(a.voiceWords, b.voiceWords),
    threeStarSessions: Math.max(a.threeStarSessions, b.threeStarSessions),
    xpEarned: Math.max(a.xpEarned, b.xpEarned),
    starsGained: Math.max(a.starsGained, b.starsGained),
    missionStars: Object.fromEntries(
      missionIds.map((id) => [id, Math.max(a.missionStars[id] || 0, b.missionStars[id] || 0)])
    ),
    firstCompletedIds: Array.from(new Set([...a.firstCompletedIds, ...b.firstCompletedIds])),
  };
}

/**
 * Days from both devices; the same day keeps the higher count of each field (so a day played on
 * two devices shows the busier one, not the sum) and the stars of both.
 */
export function mergeActivityLog(
  local: ActivityLogEntry[] | undefined,
  cloud: ActivityLogEntry[] | undefined,
  todayStr: string
): ActivityLogEntry[] | undefined {
  if (!local || !cloud) return local || cloud;
  const byDate = new Map<string, ActivityLogEntry>();
  for (const entry of [...cloud, ...local]) {
    const existing = byDate.get(entry.dateStr);
    byDate.set(entry.dateStr, existing ? mergeEntries(existing, entry) : entry);
  }
  return pruneActivityLog(Array.from(byDate.values()), todayStr);
}
