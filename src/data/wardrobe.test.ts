import { describe, expect, it } from 'vitest';
import {
  DRESS_UP_DAILY_GOAL,
  DRESS_UP_REWARD_DIAMONDS,
  DRESS_UP_REWARD_XP,
  NamingMethod,
  WARDROBE_STARTER_IDS,
  getDressUpDay,
  getOwnedWardrobeItems,
  getWardrobeDistractors,
  getWardrobeItem,
  getWornItems,
  putOnWardrobeItem,
  takeOffWardrobeLayer,
} from './wardrobe';
import { ROOM_NAMING_XP } from './room';
import { LearnerProfile } from '../types/learner';

const NOW = new Date(2026, 9, 17, 10, 0);
const LATER = new Date(2026, 9, 17, 11, 0);
const TOMORROW = new Date(2026, 9, 18, 10, 0);
const GIRL = '👧';
const CAT = '🐱';

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
    streakDays: 3,
    streakLastDateStr: '2026-10-16',
    shabbatShieldActive: true,
    wordsMastered: 0,
    missionsCompleted: 0,
  },
  missionProgress: {},
  unlockedRewardIds: ['avatar-boba-cat'],
  claimedDailyQuestIds: [],
  dailyCounters: {
    dateStr: '2026-10-16',
    missionsCompletedToday: 0,
    voiceWordsPracticedToday: 0,
    threeStarMissionsToday: 0,
  },
  createdAt: '2026-01-01T00:00:00.000Z',
};

/** Puts several items on in a row and returns the final profile. */
function putOnAll(profile: LearnerProfile, ids: string[], method: NamingMethod = 'spell', now = NOW): LearnerProfile {
  return ids.reduce((p, id) => putOnWardrobeItem(p, id, GIRL, method, now).profile, profile);
}

describe('getOwnedWardrobeItems', () => {
  it('starts every learner with the starter set', () => {
    expect(getOwnedWardrobeItems(baseProfile).map((i) => i.id)).toEqual(WARDROBE_STARTER_IDS);
  });

  it('adds earned and bought items', () => {
    const ids = getOwnedWardrobeItems({ ...baseProfile, unlockedRewardIds: ['wear-crown', 'wear-boots'] }).map(
      (i) => i.id
    );
    expect(ids).toEqual(expect.arrayContaining(['wear-crown', 'wear-boots']));
  });
});

describe('putOnWardrobeItem', () => {
  it('puts the item on its layer and gives first-time naming XP', () => {
    const result = putOnWardrobeItem(baseProfile, 'wear-cap', CAT, 'say', NOW);
    expect(result.profile.room?.outfit).toEqual({ head: 'wear-cap' });
    expect(result.profile.room?.namedItemIds).toEqual(['wear-cap']);
    expect(result.xpEarned).toBe(ROOM_NAMING_XP);
    expect(result.profile.room?.updatedAt).toBe(NOW.toISOString());
  });

  it('replaces the item on the same layer', () => {
    const owned = { ...baseProfile, unlockedRewardIds: ['wear-hat'] };
    const dressed = putOnAll(owned, ['wear-cap', 'wear-hat']);
    expect(dressed.room?.outfit).toEqual({ head: 'wear-hat' });
  });

  it('does not let an animal avatar wear clothes', () => {
    const result = putOnWardrobeItem(baseProfile, 'wear-shirt', CAT, 'spell', NOW);
    expect(result.profile).toBe(baseProfile);
  });

  it('rejects an item that is not owned or already worn', () => {
    expect(putOnWardrobeItem(baseProfile, 'wear-crown', GIRL, 'spell', NOW).profile).toBe(baseProfile);
    const dressed = putOnAll(baseProfile, ['wear-cap']);
    expect(putOnWardrobeItem(dressed, 'wear-cap', GIRL, 'spell', LATER).profile).toBe(dressed);
  });

  it('gives no naming XP for an item named before', () => {
    const dressed = takeOffWardrobeLayer(putOnAll(baseProfile, ['wear-cap']), 'head', NOW);
    expect(putOnWardrobeItem(dressed, 'wear-cap', GIRL, 'spell', LATER).xpEarned).toBe(0);
  });

  it('does not mutate the input profile', () => {
    putOnWardrobeItem(baseProfile, 'wear-cap', GIRL, 'spell', NOW);
    expect(baseProfile.room).toBeUndefined();
  });
});

describe('daily dress-up reward', () => {
  const goalItems = ['wear-cap', 'wear-glasses', 'wear-scarf'];

  it('gives the reward once the daily goal is reached and counts it as a mission', () => {
    expect(goalItems).toHaveLength(DRESS_UP_DAILY_GOAL);
    const almost = putOnAll(baseProfile, goalItems.slice(0, 2), 'say');
    const result = putOnWardrobeItem(almost, goalItems[2], GIRL, 'say', NOW);

    expect(result.isDailyRewardEarned).toBe(true);
    expect(result.xpEarned).toBe(ROOM_NAMING_XP + DRESS_UP_REWARD_XP);
    expect(result.diamondsEarned).toBe(DRESS_UP_REWARD_DIAMONDS);
    expect(result.profile.stats.diamonds).toBe(baseProfile.stats.diamonds + DRESS_UP_REWARD_DIAMONDS);
    expect(result.profile.stats.xp).toBe(3 * ROOM_NAMING_XP + DRESS_UP_REWARD_XP);
    expect(result.profile.dailyCounters.missionsCompletedToday).toBe(1);
    expect(result.profile.dailyCounters.voiceWordsPracticedToday).toBe(3);
    expect(result.profile.stats.streakDays).toBe(baseProfile.stats.streakDays + 1);
  });

  it('only gives the reward once a day', () => {
    const owned = { ...baseProfile, unlockedRewardIds: ['wear-hat'] };
    const rewarded = putOnAll(owned, goalItems);
    const again = putOnWardrobeItem(rewarded, 'wear-hat', GIRL, 'spell', LATER);
    expect(again.isDailyRewardEarned).toBe(false);
    expect(again.diamondsEarned).toBe(0);
    expect(getDressUpDay(again.profile, LATER).namedCount).toBe(4);
  });

  it('starts counting again on a new day', () => {
    const rewarded = putOnAll(baseProfile, goalItems);
    expect(getDressUpDay(rewarded, TOMORROW)).toEqual({
      dateStr: '2026-10-18',
      namedCount: 0,
      voiceCount: 0,
      isRewarded: false,
      wornItemIds: [],
    });
  });

  it('counts the same item put on again only once', () => {
    let profile = putOnAll(baseProfile, ['wear-cap'], 'say');
    for (let i = 0; i < DRESS_UP_DAILY_GOAL; i++) {
      profile = takeOffWardrobeLayer(profile, 'head', LATER);
      const again = putOnWardrobeItem(profile, 'wear-cap', GIRL, 'say', LATER);
      expect(again.isDailyRewardEarned).toBe(false);
      expect(again.profile.room?.outfit?.head).toBe('wear-cap');
      profile = again.profile;
    }
    const day = getDressUpDay(profile, LATER);
    expect(day.namedCount).toBe(1);
    expect(day.voiceCount).toBe(1);
    expect(day.wornItemIds).toEqual(['wear-cap']);
  });

  it('keeps the count of a day saved before item ids were stored', () => {
    const legacy: LearnerProfile = {
      ...baseProfile,
      room: {
        placements: {},
        namedItemIds: [],
        updatedAt: NOW.toISOString(),
        dressUpDay: { dateStr: '2026-10-17', namedCount: 2, voiceCount: 0, isRewarded: false },
      },
    };
    const first = putOnWardrobeItem(legacy, 'wear-cap', GIRL, 'spell', LATER);
    expect(getDressUpDay(first.profile, LATER).namedCount).toBe(2);
    expect(first.isDailyRewardEarned).toBe(false);
    const second = putOnWardrobeItem(first.profile, 'wear-glasses', GIRL, 'spell', LATER);
    expect(second.isDailyRewardEarned).toBe(false);
    const third = putOnWardrobeItem(second.profile, 'wear-scarf', GIRL, 'spell', LATER);
    expect(third.isDailyRewardEarned).toBe(true);
  });
});

describe('getWornItems', () => {
  it('lists worn items top to bottom and hides clothes on an animal avatar', () => {
    const dressed = putOnAll(baseProfile, ['wear-jeans', 'wear-cap', 'wear-shirt']);
    expect(getWornItems(dressed, GIRL).map((i) => i.layer)).toEqual(['head', 'torso', 'legs']);
    expect(getWornItems(dressed, CAT).map((i) => i.id)).toEqual(['wear-cap']);
  });
});

describe('takeOffWardrobeLayer', () => {
  it('takes the item off and leaves an empty layer unchanged', () => {
    const dressed = putOnAll(baseProfile, ['wear-cap']);
    expect(takeOffWardrobeLayer(dressed, 'head', LATER).room?.outfit).toEqual({});
    expect(takeOffWardrobeLayer(dressed, 'feet', LATER)).toBe(dressed);
  });
});

describe('getWardrobeDistractors', () => {
  it('returns two other names, stable for the same seed', () => {
    const cap = getWardrobeItem('wear-cap')!;
    const names = getWardrobeDistractors(cap, 7);
    expect(names).toHaveLength(2);
    expect(names).not.toContain('cap');
    expect(getWardrobeDistractors(cap, 7)).toEqual(names);
  });
});
