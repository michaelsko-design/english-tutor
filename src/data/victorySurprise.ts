import type { DailyActivityCounters } from '../types/learner';
import { seededRandom } from '../utils/shuffle';

/**
 * Earned surprises on the victory screen (retention audit): now and then a finished mission pays a
 * small bonus-diamond gift on top of its prize. It is never bought and never promised: it comes only
 * with a full prize (so replays can't farm it), at most once a day, and the roll is fixed by the
 * learner, the day and the day's mission number, so leaving and replaying never re-rolls it.
 */

/** About one finished mission in five brings a surprise */
export const SURPRISE_CHANCE = 0.2;
export const MAX_SURPRISES_PER_DAY = 1;
export const SURPRISE_DIAMOND_AMOUNTS: readonly number[] = [10, 15, 20, 25, 30];

export interface SurpriseRollInput {
  /** Only a full prize can bring a surprise */
  isFullReward: boolean;
  /** Today's counters before this mission is recorded */
  todayCounters: DailyActivityCounters;
  /** Fixed per learner (the account uid; old profiles can share a default createdAt), so siblings on one day get different rolls */
  learnerSeed: string;
  todayStr: string;
}

/** The surprise diamonds this mission brings: 0 for none. */
export function rollMissionSurprise({ isFullReward, todayCounters, learnerSeed, todayStr }: SurpriseRollInput): number {
  if (!isFullReward) return 0;
  const isToday = todayCounters.dateStr === todayStr;
  if (isToday && (todayCounters.surprisesToday ?? 0) >= MAX_SURPRISES_PER_DAY) return 0;
  const missionNumberToday = isToday ? todayCounters.missionsCompletedToday : 0;
  const rand = seededRandom(`surprise:${learnerSeed}:${todayStr}:${missionNumberToday}`);
  if (rand() >= SURPRISE_CHANCE) return 0;
  return SURPRISE_DIAMOND_AMOUNTS[Math.floor(rand() * SURPRISE_DIAMOND_AMOUNTS.length)];
}
