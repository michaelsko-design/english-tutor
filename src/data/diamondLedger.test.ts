import { describe, expect, it } from 'vitest';
import { getLedgerBalance, mergeDiamondLedgers, recordDiamondChange } from './diamondLedger';
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
    diamonds: 100,
    streakDays: 0,
    shabbatShieldActive: true,
    wordsMastered: 0,
    missionsCompleted: 0,
  },
  missionProgress: {},
  unlockedRewardIds: [],
  claimedDailyQuestIds: [],
  dailyCounters: { dateStr: '2026-10-19', missionsCompletedToday: 0, voiceWordsPracticedToday: 0, threeStarMissionsToday: 0 },
  createdAt: '2026-01-01T00:00:00.000Z',
};

function withDiamonds(profile: LearnerProfile, diamonds: number): LearnerProfile {
  return { ...profile, stats: { ...profile.stats, diamonds } };
}

describe('recordDiamondChange', () => {
  it('turns the old balance into a legacy entry and records a spend on this device', () => {
    const next = recordDiamondChange(baseProfile, withDiamonds(baseProfile, 70), 'phone');
    expect(next.diamondLedger).toEqual({ legacy: { earned: 100, spent: 0 }, phone: { earned: 0, spent: 30 } });
    expect(next.stats.diamonds).toBe(70);
  });

  it('records earnings on this device', () => {
    const prev = { ...baseProfile, diamondLedger: { legacy: { earned: 100, spent: 0 } } };
    const next = recordDiamondChange(prev, withDiamonds(prev, 112), 'phone');
    expect(next.diamondLedger?.phone).toEqual({ earned: 12, spent: 0 });
    expect(next.stats.diamonds).toBe(112);
  });

  it('keeps the ledger of the profile before the change, not a stale copy in the update', () => {
    const prev = { ...baseProfile, diamondLedger: { legacy: { earned: 100, spent: 0 }, tablet: { earned: 20, spent: 0 } } };
    const stale = { ...withDiamonds(baseProfile, 105), diamondLedger: { legacy: { earned: 100, spent: 0 } } };
    // prev.stats.diamonds is 100 here although the ledger says 120: the update is +5 on this device
    const next = recordDiamondChange({ ...prev, stats: { ...prev.stats, diamonds: 120 } }, { ...stale, stats: { ...stale.stats, diamonds: 125 } }, 'phone');
    expect(next.diamondLedger?.tablet).toEqual({ earned: 20, spent: 0 });
    expect(next.stats.diamonds).toBe(125);
  });

  it('leaves a profile without a change and without a ledger as it is', () => {
    const next = recordDiamondChange(baseProfile, { ...baseProfile, name: 'Noa B' }, 'phone');
    expect(next.diamondLedger).toBeUndefined();
    expect(next.name).toBe('Noa B');
  });
});

describe('mergeDiamondLedgers', () => {
  it('keeps a purchase on one device and earnings on another', () => {
    const phone = { legacy: { earned: 100, spent: 0 }, phone: { earned: 0, spent: 30 } };
    const tablet = { legacy: { earned: 100, spent: 0 }, tablet: { earned: 10, spent: 0 } };
    const merged = mergeDiamondLedgers(phone, tablet);
    expect(merged).toEqual({
      legacy: { earned: 100, spent: 0 },
      phone: { earned: 0, spent: 30 },
      tablet: { earned: 10, spent: 0 },
    });
    expect(getLedgerBalance(merged!)).toBe(80);
  });

  it('takes the newer (larger) totals of the same device', () => {
    const merged = mergeDiamondLedgers({ phone: { earned: 5, spent: 30 } }, { phone: { earned: 12, spent: 10 } });
    expect(merged).toEqual({ phone: { earned: 12, spent: 30 } });
  });

  it('is undefined when neither side has a ledger', () => {
    expect(mergeDiamondLedgers(undefined, undefined)).toBeUndefined();
  });

  it('ignores malformed entries', () => {
    const merged = mergeDiamondLedgers({ phone: { earned: 5, spent: 0 } }, { bad: null } as never);
    expect(merged).toEqual({ phone: { earned: 5, spent: 0 } });
  });
});

describe('getLedgerBalance', () => {
  it('never goes below 0', () => {
    expect(getLedgerBalance({ a: { earned: 10, spent: 30 } })).toBe(0);
  });
});
