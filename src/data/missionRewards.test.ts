import { describe, expect, it } from 'vitest';
import { REPEAT_MISSION_XP_SHARE, getMissionReward, isFullMissionReward } from './missionRewards';

describe('isFullMissionReward', () => {
  it('pays in full the first time a mission is played', () => {
    expect(isFullMissionReward({ previousStars: 0, starsEarned: 1, lastRewardDateStr: undefined, todayStr: '2026-10-19' })).toBe(true);
  });

  it('pays in full when the stars improve, even on the same day', () => {
    expect(isFullMissionReward({ previousStars: 2, starsEarned: 3, lastRewardDateStr: '2026-10-19', todayStr: '2026-10-19' })).toBe(true);
  });

  it('pays in full once a day while the mission is not yet mastered', () => {
    expect(isFullMissionReward({ previousStars: 2, starsEarned: 2, lastRewardDateStr: '2026-10-18', todayStr: '2026-10-19' })).toBe(true);
    expect(isFullMissionReward({ previousStars: 2, starsEarned: 2, lastRewardDateStr: '2026-10-19', todayStr: '2026-10-19' })).toBe(false);
  });

  it('gives only the repeat reward for a mastered (3-star) mission', () => {
    expect(isFullMissionReward({ previousStars: 3, starsEarned: 3, lastRewardDateStr: '2026-10-01', todayStr: '2026-10-19' })).toBe(false);
  });
});

describe('getMissionReward', () => {
  it('keeps the full XP and diamonds of a full reward', () => {
    expect(getMissionReward(120, 25, true)).toEqual({ xp: 120, diamonds: 25 });
  });

  it('gives a share of the XP and no diamonds for a repeat', () => {
    expect(getMissionReward(120, 25, false)).toEqual({ xp: Math.round(120 * REPEAT_MISSION_XP_SHARE), diamonds: 0 });
  });
});
