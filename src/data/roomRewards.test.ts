import { describe, expect, it } from 'vitest';
import { ROOM_REWARD_ORDER, getNextRoomReward, getRoomRewardForMission } from './roomRewards';
import { WARDROBE_REWARD_ORDER } from './wardrobe';
import { LearnerProfile } from '../types/learner';

const baseProfile: LearnerProfile = {
  isOnboarded: true,
  name: 'Noa',
  age: 9,
  gender: 'girl',
  gradeId: 'grade-4',
  preferredTier: 'challenger',
  themeId: 'cozy-studio',
  stats: {
    xp: 0,
    level: 1,
    stars: 0,
    maxPossibleStars: 36,
    diamonds: 50,
    streakDays: 0,
    shabbatShieldActive: true,
    wordsMastered: 0,
    missionsCompleted: 0,
  },
  missionProgress: {},
  unlockedRewardIds: ['avatar-boba-cat'],
  claimedDailyQuestIds: [],
  dailyCounters: {
    dateStr: '2026-10-17',
    missionsCompletedToday: 0,
    voiceWordsPracticedToday: 0,
    threeStarMissionsToday: 0,
  },
  createdAt: '2026-01-01T00:00:00.000Z',
};

function owning(...ids: string[]): LearnerProfile {
  return { ...baseProfile, unlockedRewardIds: [...baseProfile.unlockedRewardIds, ...ids] };
}

describe('ROOM_REWARD_ORDER', () => {
  it('alternates room decor and wardrobe items', () => {
    const first = getNextRoomReward(baseProfile);
    const second = getNextRoomReward(owning(ROOM_REWARD_ORDER[0]));
    expect(first?.kind).toBe('decor');
    expect(second?.kind).toBe('wear');
  });

  it('includes every earnable wardrobe item once', () => {
    WARDROBE_REWARD_ORDER.forEach((id) => expect(ROOM_REWARD_ORDER.filter((r) => r === id)).toHaveLength(1));
    expect(new Set(ROOM_REWARD_ORDER).size).toBe(ROOM_REWARD_ORDER.length);
  });

  it('leaves out starter and shop-only items', () => {
    ['room-plant', 'wear-cap', 'wear-crown'].forEach((id) => expect(ROOM_REWARD_ORDER).not.toContain(id));
  });
});

describe('getRoomRewardForMission', () => {
  it('awards the first item in order for a first 3-star result', () => {
    expect(getRoomRewardForMission(baseProfile, 'm1', 3)?.id).toBe(ROOM_REWARD_ORDER[0]);
  });

  it('awards nothing below 3 stars', () => {
    expect(getRoomRewardForMission(baseProfile, 'm1', 2)).toBeNull();
  });

  it('awards nothing when the mission already had 3 stars', () => {
    const replay = { ...baseProfile, missionProgress: { m1: 3 } };
    expect(getRoomRewardForMission(replay, 'm1', 3)).toBeNull();
  });

  it('awards an item when a 2-star mission is improved to 3 stars', () => {
    const improved = { ...baseProfile, missionProgress: { m1: 2 } };
    expect(getRoomRewardForMission(improved, 'm1', 3)).not.toBeNull();
  });

  it('skips items the learner already owns', () => {
    expect(getNextRoomReward(owning(ROOM_REWARD_ORDER[0]))?.id).toBe(ROOM_REWARD_ORDER[1]);
  });

  it('awards nothing once every item is owned', () => {
    expect(getRoomRewardForMission(owning(...ROOM_REWARD_ORDER), 'm1', 3)).toBeNull();
  });
});
