import { DailyActivityCounters, DailyActivityKind, LearnerProfile } from '../types/learner';
import { pickDailyQuestIds } from './dailyQuests';
import { advanceStreak } from './streak';
import { applyStreakReward } from './streakReward';

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
  /** What the session was, for the rotating daily quests; counted only when it is a session */
  kind?: DailyActivityKind;
}

/**
 * Today's counters and claimed quests. Stored counters from an earlier day (a tab left open past
 * midnight) count as zero, and their claims as unclaimed.
 */
export function getTodayCounters(
  profile: LearnerProfile,
  todayStr: string
): { counters: DailyActivityCounters; claimedQuestIds: string[] } {
  if (profile.dailyCounters?.dateStr === todayStr) {
    return { counters: profile.dailyCounters, claimedQuestIds: profile.claimedDailyQuestIds || [] };
  }
  return {
    counters: { dateStr: todayStr, missionsCompletedToday: 0, voiceWordsPracticedToday: 0, threeStarMissionsToday: 0 },
    claimedQuestIds: [],
  };
}

/** Today's session counts by kind with one more session of `kind` (none added for a non-session). */
function addKindCount(counters: DailyActivityCounters, activity: DailyActivity): DailyActivityCounters['kindCounts'] {
  if (!activity.kind || activity.missions <= 0) return counters.kindCounts;
  const kindCounts = counters.kindCounts ?? {};
  return { ...kindCounts, [activity.kind]: (kindCounts[activity.kind] ?? 0) + activity.missions };
}

/**
 * Adds an activity to today's counters (resetting them and the claimed quests on a new day) and
 * extends the streak when this is the first completed mission of the day (paying the one-time streak
 * reward once the streak reaches its goal, data/streakReward.ts). The day's quests are frozen at its
 * first recorded activity (data/dailyQuests.ts), picked from the profile as it was before it.
 */
export function recordDailyActivity(
  profile: LearnerProfile,
  activity: DailyActivity,
  todayStr: string
): LearnerProfile {
  const { counters, claimedQuestIds } = getTodayCounters(profile, todayStr);
  const isFirstMissionToday = counters.missionsCompletedToday === 0 && activity.missions > 0;
  const kindCounts = addKindCount(counters, activity);
  const questIds = counters.questIds && counters.questIds.length > 0 ? counters.questIds : pickDailyQuestIds(profile, todayStr);

  const updated: LearnerProfile = {
    ...profile,
    claimedDailyQuestIds: claimedQuestIds,
    dailyCounters: {
      // Keeps today's other counters (the surprises) as they are
      ...counters,
      dateStr: todayStr,
      missionsCompletedToday: counters.missionsCompletedToday + activity.missions,
      voiceWordsPracticedToday: counters.voiceWordsPracticedToday + activity.voiceWords,
      threeStarMissionsToday: counters.threeStarMissionsToday + activity.threeStarMissions,
      ...(kindCounts ? { kindCounts } : {}),
      questIds,
    },
    stats: isFirstMissionToday ? advanceStreak(profile, todayStr) : profile.stats,
  };
  return isFirstMissionToday ? applyStreakReward(updated, todayStr) : updated;
}

/** Vault words that earn XP and diamonds per day; each word earns once a day. */
export const VAULT_DAILY_REWARD_WORDS = 20;

/**
 * One word said aloud in the Vocabulary Vault: a voice word for today's quests (not a mission,
 * so no streak), plus the XP and diamonds, once per word per day and for up to
 * VAULT_DAILY_REWARD_WORDS words. `stats.wordsMastered` is a stored lifetime counter that isn't
 * shown; the dashboard shows `countMasteredWords` instead.
 */
export function applyVocabPracticeReward(
  profile: LearnerProfile,
  wordEn: string,
  xpBonus: number,
  diamondBonus: number,
  todayStr: string
): { profile: LearnerProfile; isRewarded: boolean } {
  const word = wordEn.trim().toLowerCase();
  const rewardedToday = profile.vaultPractice?.dateStr === todayStr ? profile.vaultPractice.words : [];
  if (rewardedToday.includes(word) || rewardedToday.length >= VAULT_DAILY_REWARD_WORDS) {
    return { profile, isRewarded: false };
  }

  const withActivity = recordDailyActivity(
    profile,
    { missions: 0, voiceWords: 1, threeStarMissions: 0 },
    todayStr
  );
  const xp = withActivity.stats.xp + xpBonus;
  return {
    isRewarded: true,
    profile: {
      ...withActivity,
      vaultPractice: { dateStr: todayStr, words: [...rewardedToday, word] },
      stats: {
        ...withActivity.stats,
        xp,
        level: levelForXp(xp, withActivity.stats.level),
        diamonds: withActivity.stats.diamonds + diamondBonus,
        wordsMastered: withActivity.stats.wordsMastered + 1,
      },
    },
  };
}
