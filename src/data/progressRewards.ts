import { LearnerProfile } from '../types/learner';

/** Shared progress bookkeeping for activities that count toward daily quests and streaks. */

export const XP_PER_LEVEL = 150;

/** The level never drops, even if the XP formula would give a lower one. */
export function levelForXp(xp: number, currentLevel: number): number {
  return Math.max(currentLevel, Math.floor(xp / XP_PER_LEVEL) + 1);
}

export interface DailyActivity {
  missions: number;
  voiceWords: number;
  threeStarMissions: number;
}

/**
 * Adds an activity to today's counters (resetting them on a new day) and extends the streak
 * when this is the first completed mission of the day.
 */
export function recordDailyActivity(
  profile: LearnerProfile,
  activity: DailyActivity,
  todayStr: string
): LearnerProfile {
  const isToday = profile.dailyCounters?.dateStr === todayStr;
  const missionsToday = isToday ? profile.dailyCounters?.missionsCompletedToday || 0 : 0;
  const isFirstMissionToday = missionsToday === 0 && activity.missions > 0;

  return {
    ...profile,
    dailyCounters: {
      dateStr: todayStr,
      missionsCompletedToday: missionsToday + activity.missions,
      voiceWordsPracticedToday:
        (isToday ? profile.dailyCounters?.voiceWordsPracticedToday || 0 : 0) + activity.voiceWords,
      threeStarMissionsToday:
        (isToday ? profile.dailyCounters?.threeStarMissionsToday || 0 : 0) +
        activity.threeStarMissions,
    },
    stats: {
      ...profile.stats,
      streakDays: isFirstMissionToday ? profile.stats.streakDays + 1 : profile.stats.streakDays,
    },
  };
}

/**
 * One word said aloud in the Vocabulary Vault: a voice word for today's quests (not a mission,
 * so no streak), plus the XP and diamonds. `stats.wordsMastered` is a stored lifetime counter
 * that isn't shown; the dashboard shows `countMasteredWords` instead.
 */
export function applyVocabPracticeReward(
  profile: LearnerProfile,
  xpBonus: number,
  diamondBonus: number,
  todayStr: string
): LearnerProfile {
  const withActivity = recordDailyActivity(
    profile,
    { missions: 0, voiceWords: 1, threeStarMissions: 0 },
    todayStr
  );
  const xp = withActivity.stats.xp + xpBonus;
  return {
    ...withActivity,
    stats: {
      ...withActivity.stats,
      xp,
      level: levelForXp(xp, withActivity.stats.level),
      diamonds: withActivity.stats.diamonds + diamondBonus,
      wordsMastered: withActivity.stats.wordsMastered + 1,
    },
  };
}
