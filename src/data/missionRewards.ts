/**
 * Mission replays: the full XP and diamonds come the first time, whenever the stars improve, and
 * once a day while the mission isn't mastered yet. Other replays give a little XP, so a learner
 * can't farm diamonds by replaying an easy mission.
 */

export const REPEAT_MISSION_XP_SHARE = 0.2;
const MASTERED_STARS = 3;

export function isFullMissionReward(input: {
  previousStars: number;
  starsEarned: number;
  lastRewardDateStr: string | undefined;
  todayStr: string;
}): boolean {
  if (input.starsEarned > input.previousStars) return true;
  if (input.previousStars >= MASTERED_STARS) return false;
  return input.lastRewardDateStr !== input.todayStr;
}

export function getMissionReward(fullXp: number, fullDiamonds: number, isFull: boolean): { xp: number; diamonds: number } {
  return isFull ? { xp: fullXp, diamonds: fullDiamonds } : { xp: Math.round(fullXp * REPEAT_MISSION_XP_SHARE), diamonds: 0 };
}
