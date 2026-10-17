import { LearnerProfile } from '../types/learner';
import { toLocalDateStr } from './examPrep';
import { levelForXp, recordDailyActivity } from './progressRewards';
import { getRoom } from './room';

/**
 * Feature 12: the daily reward shared by the room's activities (phone, dream journal, word games).
 * The first finished activity of each kind per day earns the full reward and counts as a mission;
 * repeats earn a little XP.
 */

export type RoomActivityId =
  | 'phone'
  | 'journal'
  | 'game-scramble'
  | 'game-search'
  | 'game-crossword'
  | 'game-finding';

export const ROOM_ACTIVITY_XP = 10;
export const ROOM_ACTIVITY_DIAMONDS = 2;
export const ROOM_ACTIVITY_REPEAT_XP = 2;

export interface RoomActivityReward {
  profile: LearnerProfile;
  xpEarned: number;
  diamondsEarned: number;
  isFullReward: boolean;
}

/** Adds XP and diamonds and credits the activity to today's quests and streak as one mission. */
export function grantDailyActivityReward(
  profile: LearnerProfile,
  reward: { xp: number; diamonds: number; voiceWords: number },
  now: Date
): LearnerProfile {
  const withActivity = recordDailyActivity(
    profile,
    { missions: 1, voiceWords: reward.voiceWords, threeStarMissions: 0 },
    now.toISOString().slice(0, 10)
  );
  const xp = withActivity.stats.xp + reward.xp;
  return {
    ...withActivity,
    stats: {
      ...withActivity.stats,
      xp,
      level: levelForXp(xp, withActivity.stats.level),
      diamonds: withActivity.stats.diamonds + reward.diamonds,
    },
  };
}

export function isActivityRewardedToday(profile: LearnerProfile, activityId: RoomActivityId, now: Date): boolean {
  return getRoom(profile).activityRewardDates?.[activityId] === toLocalDateStr(now);
}

/** The small XP of a repeat; it doesn't use up the daily reward or count as a mission. */
export function applyRepeatActivityXp(profile: LearnerProfile): RoomActivityReward {
  const xp = profile.stats.xp + ROOM_ACTIVITY_REPEAT_XP;
  return {
    profile: { ...profile, stats: { ...profile.stats, xp, level: levelForXp(xp, profile.stats.level) } },
    xpEarned: ROOM_ACTIVITY_REPEAT_XP,
    diamondsEarned: 0,
    isFullReward: false,
  };
}

/** Rewards a finished room activity: the full reward once a day per activity, a little XP after. */
export function applyRoomActivityReward(
  profile: LearnerProfile,
  activityId: RoomActivityId,
  voiceWords: number,
  now: Date
): RoomActivityReward {
  if (isActivityRewardedToday(profile, activityId, now)) return applyRepeatActivityXp(profile);

  const room = getRoom(profile);
  const marked: LearnerProfile = {
    ...profile,
    room: {
      ...room,
      activityRewardDates: { ...(room.activityRewardDates || {}), [activityId]: toLocalDateStr(now) },
    },
  };
  return {
    profile: grantDailyActivityReward(
      marked,
      { xp: ROOM_ACTIVITY_XP, diamonds: ROOM_ACTIVITY_DIAMONDS, voiceWords },
      now
    ),
    xpEarned: ROOM_ACTIVITY_XP,
    diamondsEarned: ROOM_ACTIVITY_DIAMONDS,
    isFullReward: true,
  };
}
