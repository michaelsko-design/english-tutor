import { describe, expect, it } from 'vitest';
import { DEFAULT_PROFILE } from '../data/defaultProfile';
import { parseStoredProfile } from './localProfile';

const good = {
  ...DEFAULT_PROFILE,
  isOnboarded: true,
  name: 'Dana',
  gradeId: 'grade-3',
  themeId: 'neon-pop',
  stats: { ...DEFAULT_PROFILE.stats, xp: 120, stars: 9 },
  missionProgress: { m1: 3, m2: 1 },
  unlockedRewardIds: ['a', 'b'],
};

const parse = (value: unknown) => parseStoredProfile(JSON.stringify(value));

describe('parseStoredProfile', () => {
  it.each([null, '', '{bad', 'null', '[]', '"x"', '5'])('falls back to the default for %j', (raw) => {
    const result = parseStoredProfile(raw);
    expect(result).toEqual(DEFAULT_PROFILE);
    expect(result).not.toBe(DEFAULT_PROFILE);
  });

  it('keeps a valid profile unchanged', () => {
    expect(parse(good)).toEqual(good);
  });

  it('fills fields an old profile lacks, observing Shabbat by default', () => {
    const old: Record<string, unknown> = { ...good };
    delete old.isShabbatObserver;
    delete old.dailyCounters;
    const result = parse(old);
    expect(result.isShabbatObserver).toBe(true);
    expect(result.dailyCounters).toEqual(DEFAULT_PROFILE.dailyCounters);
    expect(result.name).toBe('Dana');
  });

  it('keeps an explicit isShabbatObserver false', () => {
    expect(parse({ ...good, isShabbatObserver: false }).isShabbatObserver).toBe(false);
  });

  it.each([
    ['stats is a string', { stats: 'x' }],
    ['gradeId is unknown', { gradeId: 'grade-99' }],
    ['themeId is a number', { themeId: 7 }],
    ['gender is unknown', { gender: 'x' }],
    ['preferredTier is unknown', { preferredTier: 'hard' }],
    ['name is a number', { name: 4 }],
    ['age is a string', { age: '12' }],
    ['missionProgress is an array', { missionProgress: [] }],
    ['unlockedRewardIds is a string', { unlockedRewardIds: 'a' }],
    ['claimedDailyQuestIds has a number', { claimedDailyQuestIds: [1] }],
    ['dailyCounters is null', { dailyCounters: null }],
    ['missionTierStars is a string', { missionTierStars: 'x' }],
    ['activityLog is an object', { activityLog: {} }],
  ])('repairs the bad field when %s and keeps the rest', (_label, bad) => {
    const result = parse({ ...good, ...bad });
    const key = Object.keys(bad)[0] as keyof typeof DEFAULT_PROFILE;
    if (key === 'stats') {
      expect(result.stats).toEqual(DEFAULT_PROFILE.stats);
    } else if (key === 'missionTierStars' || key === 'activityLog') {
      expect(result[key]).toBeUndefined();
    } else {
      expect(result[key]).toEqual(DEFAULT_PROFILE[key]);
    }
    if (key !== 'name') expect(result.name).toBe('Dana');
    if (key !== 'gradeId') expect(result.gradeId).toBe('grade-3');
  });

  it('keeps good stats when only one is bad', () => {
    const result = parse({ ...good, stats: { ...good.stats, level: 'x' } });
    expect(result.stats.xp).toBe(120);
    expect(result.stats.level).toBe(DEFAULT_PROFILE.stats.level);
  });

  it('drops mission stars outside 0 to 3 or not numbers', () => {
    const result = parse({ ...good, missionProgress: { m1: 3, m2: 'x', m3: 9 } });
    expect(result.missionProgress).toEqual({ m1: 3 });
  });

  it('never aliases the default profile objects', () => {
    const result = parse({});
    expect(result.stats).not.toBe(DEFAULT_PROFILE.stats);
    expect(result.dailyCounters).not.toBe(DEFAULT_PROFILE.dailyCounters);
    expect(result.unlockedRewardIds).not.toBe(DEFAULT_PROFILE.unlockedRewardIds);
  });
});
