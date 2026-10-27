import { LearnerProfile, LearnerStats } from '../types/learner';
// Explicit .js: api/streak-reminder.ts runs this file under Node ESM, which needs the extension.
import { addDays, parseDateStr } from '../utils/dates.js';

/**
 * The learning streak: consecutive days with a finished session. For a Shabbat observer,
 * Friday and Shabbat never break it, and each shop shield covers one missed day.
 *
 * The streak is stored with the date it last counted (`stats.streakLastDateStr`), so it is
 * read with getCurrentStreak: a streak whose last day is long gone shows 0 even though the
 * stored number is still there. Old profiles (from before the streak could break) have no
 * date; their number was really a count of all active days, so it becomes `totalActiveDays`
 * and the streak is rebuilt from the activity log.
 */

export const STREAK_SHIELD_ITEM_ID = 'boost-streak-shield';

const FRIDAY = 5;
const SATURDAY = 6;

/** Days that never break the streak: Friday and Shabbat for observers. */
export function isStreakProtectedDay(dateStr: string, isShabbatObserver: boolean): boolean {
  if (!isShabbatObserver) return false;
  const weekday = parseDateStr(dateStr).getDay();
  return weekday === FRIDAY || weekday === SATURDAY;
}

/** Days strictly between the two dates that needed a session and had none. */
function countMissedDays(lastDateStr: string, todayStr: string, isShabbatObserver: boolean): number {
  let missed = 0;
  for (let day = addDays(lastDateStr, 1); day < todayStr; day = addDays(day, 1)) {
    if (!isStreakProtectedDay(day, isShabbatObserver)) missed += 1;
  }
  return missed;
}

interface StreakState {
  days: number;
  lastDateStr?: string;
  shieldsBought: number;
  shieldsUsed: number;
  totalActiveDays: number;
}

/** Rebuilds the streak of an old profile from its activity log (the last 12 weeks). */
function rebuildFromLog(profile: LearnerProfile, todayStr: string): Pick<StreakState, 'days' | 'lastDateStr'> {
  const isObserver = profile.isShabbatObserver ?? true;
  const activeDays = new Set(
    (profile.activityLog || []).filter((e) => e.sessions > 0 && e.dateStr <= todayStr).map((e) => e.dateStr)
  );
  const lastDateStr = [...activeDays].sort().pop();
  if (!lastDateStr) return { days: 0 };

  let days = 0;
  for (let day = lastDateStr; ; day = addDays(day, -1)) {
    if (activeDays.has(day)) days += 1;
    else if (!isStreakProtectedDay(day, isObserver)) break;
    // Stop at the start of the log: nothing older is known
    if (day < (profile.activityLog?.[0]?.dateStr ?? day)) break;
  }
  return { days, lastDateStr };
}

function getStreakState(profile: LearnerProfile, todayStr: string): StreakState {
  const stats = profile.stats;
  const shieldsBought =
    stats.streakShieldsBought ?? (profile.unlockedRewardIds?.includes(STREAK_SHIELD_ITEM_ID) ? 1 : 0);
  const shieldsUsed = stats.streakShieldsUsed ?? 0;
  if (stats.streakLastDateStr) {
    return {
      days: stats.streakDays,
      lastDateStr: stats.streakLastDateStr,
      shieldsBought,
      shieldsUsed,
      totalActiveDays: stats.totalActiveDays ?? stats.streakDays,
    };
  }
  return {
    ...rebuildFromLog(profile, todayStr),
    shieldsBought,
    shieldsUsed,
    totalActiveDays: stats.totalActiveDays ?? stats.streakDays,
  };
}

export function getStreakShieldsLeft(profile: LearnerProfile): number {
  const { shieldsBought, shieldsUsed } = getStreakState(profile, '0000-00-00');
  return Math.max(0, shieldsBought - shieldsUsed);
}

/** The streak to show today: 0 once a day was missed that no shield can cover. */
export function getCurrentStreak(profile: LearnerProfile, todayStr: string): number {
  const state = getStreakState(profile, todayStr);
  if (!state.lastDateStr) return 0;
  if (state.lastDateStr >= todayStr) return state.days;
  const missed = countMissedDays(state.lastDateStr, todayStr, profile.isShabbatObserver ?? true);
  return missed <= state.shieldsBought - state.shieldsUsed ? state.days : 0;
}

/** The stats after the first finished session of `todayStr`. */
export function advanceStreak(profile: LearnerProfile, todayStr: string): LearnerStats {
  const state = getStreakState(profile, todayStr);
  if (state.lastDateStr && state.lastDateStr >= todayStr) return profile.stats;

  let days = 1;
  let shieldsUsed = state.shieldsUsed;
  if (state.lastDateStr) {
    const missed = countMissedDays(state.lastDateStr, todayStr, profile.isShabbatObserver ?? true);
    if (missed === 0) {
      days = state.days + 1;
    } else if (missed <= state.shieldsBought - state.shieldsUsed) {
      days = state.days + 1;
      shieldsUsed += missed;
    }
  }

  return {
    ...profile.stats,
    streakDays: days,
    streakLastDateStr: todayStr,
    streakShieldsBought: state.shieldsBought,
    streakShieldsUsed: shieldsUsed,
    totalActiveDays: state.totalActiveDays + 1,
  };
}

/** One more shield from the shop. */
export function addStreakShield(profile: LearnerProfile): LearnerStats {
  const { shieldsBought } = getStreakState(profile, '0000-00-00');
  return { ...profile.stats, streakShieldsBought: shieldsBought + 1 };
}

const maxOf = (a: number | undefined, b: number | undefined): number | undefined =>
  a === undefined && b === undefined ? undefined : Math.max(a ?? 0, b ?? 0);

/**
 * The streak of the device that learned most recently wins (the same day: the higher one).
 * The shield and active-day counters only grow, so the larger value is the newer one.
 */
export function mergeStreakStats(
  local: Partial<LearnerStats> | undefined,
  cloud: Partial<LearnerStats> | undefined
): Pick<LearnerStats, 'streakDays' | 'streakLastDateStr' | 'streakShieldsBought' | 'streakShieldsUsed' | 'totalActiveDays'> {
  const localDate = local?.streakLastDateStr;
  const cloudDate = cloud?.streakLastDateStr;
  let streakDays: number;
  let streakLastDateStr: string | undefined;
  if (!localDate && !cloudDate) {
    streakDays = Math.max(local?.streakDays ?? 0, cloud?.streakDays ?? 0);
  } else if (!cloudDate || (localDate && localDate > cloudDate)) {
    streakDays = local?.streakDays ?? 0;
    streakLastDateStr = localDate;
  } else if (!localDate || cloudDate > localDate) {
    streakDays = cloud?.streakDays ?? 0;
    streakLastDateStr = cloudDate;
  } else {
    streakDays = Math.max(local?.streakDays ?? 0, cloud?.streakDays ?? 0);
    streakLastDateStr = localDate;
  }

  const merged = {
    streakDays,
    streakLastDateStr,
    streakShieldsBought: maxOf(local?.streakShieldsBought, cloud?.streakShieldsBought),
    streakShieldsUsed: maxOf(local?.streakShieldsUsed, cloud?.streakShieldsUsed),
    totalActiveDays: maxOf(local?.totalActiveDays, cloud?.totalActiveDays),
  };
  // Leave out unknown values so Firestore doesn't store undefined
  return Object.fromEntries(Object.entries(merged).filter(([, v]) => v !== undefined)) as ReturnType<
    typeof mergeStreakStats
  >;
}
