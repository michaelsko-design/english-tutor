import { describe, expect, it } from 'vitest';
import { ActivityLogEntry, LearnerProfile } from '../types/learner';
import {
  ACTIVITY_LOG_DAYS,
  mergeActivityLog,
  pruneActivityLog,
  recordActivityLog,
} from './activityLog';

// Local noon, so the local date is 2026-10-15 in every time zone the app runs in
const NOW = new Date(2026, 9, 15, 12, 0, 0);
const TODAY = '2026-10-15';

const baseProfile: LearnerProfile = {
  isOnboarded: true,
  name: 'Noa',
  age: 10,
  gender: 'girl',
  gradeId: 'grade-5',
  preferredTier: 'challenger',
  themeId: 'cozy-studio',
  stats: {
    xp: 100,
    level: 1,
    stars: 0,
    maxPossibleStars: 36,
    diamonds: 50,
    streakDays: 2,
    shabbatShieldActive: true,
    wordsMastered: 0,
    missionsCompleted: 0,
  },
  missionProgress: { 'g5-u1-m1': 2 },
  unlockedRewardIds: [],
  claimedDailyQuestIds: [],
  dailyCounters: {
    dateStr: TODAY,
    missionsCompletedToday: 1,
    voiceWordsPracticedToday: 2,
    threeStarMissionsToday: 0,
  },
  createdAt: '2026-10-01T00:00:00.000Z',
};

function entry(dateStr: string, overrides: Partial<ActivityLogEntry> = {}): ActivityLogEntry {
  return {
    dateStr,
    sessions: 0,
    voiceWords: 0,
    threeStarSessions: 0,
    xpEarned: 0,
    starsGained: 0,
    missionStars: {},
    firstCompletedIds: [],
    ...overrides,
  };
}

describe('recordActivityLog', () => {
  it('logs the XP, counters and star gains of a finished mission', () => {
    const next: LearnerProfile = {
      ...baseProfile,
      stats: { ...baseProfile.stats, xp: 160 },
      missionProgress: { 'g5-u1-m1': 3, 'g5-u1-m2': 2 },
      dailyCounters: {
        dateStr: TODAY,
        missionsCompletedToday: 2,
        voiceWordsPracticedToday: 5,
        threeStarMissionsToday: 1,
      },
    };

    const result = recordActivityLog(baseProfile, next, NOW);

    expect(result.activityLog).toEqual([
      entry(TODAY, {
        sessions: 1,
        voiceWords: 3,
        threeStarSessions: 1,
        xpEarned: 60,
        starsGained: 3,
        missionStars: { 'g5-u1-m1': 3, 'g5-u1-m2': 2 },
        firstCompletedIds: ['g5-u1-m2'],
      }),
    ]);
  });

  it('counts all of the new counters when the counter day changed', () => {
    const next: LearnerProfile = {
      ...baseProfile,
      dailyCounters: {
        dateStr: '2026-10-16',
        missionsCompletedToday: 1,
        voiceWordsPracticedToday: 0,
        threeStarMissionsToday: 0,
      },
    };

    const result = recordActivityLog(baseProfile, next, NOW);

    expect(result.activityLog?.[0].sessions).toBe(1);
  });

  it('adds to an existing entry for today', () => {
    const prev: LearnerProfile = { ...baseProfile, activityLog: [entry(TODAY, { sessions: 2, xpEarned: 30 })] };
    const next: LearnerProfile = { ...prev, stats: { ...prev.stats, xp: 110 } };

    const result = recordActivityLog(prev, next, NOW);

    expect(result.activityLog).toEqual([entry(TODAY, { sessions: 2, xpEarned: 40 })]);
  });

  it('ignores drops, such as spending diamonds or an older profile', () => {
    const next: LearnerProfile = {
      ...baseProfile,
      stats: { ...baseProfile.stats, xp: 90, diamonds: 10 },
      missionProgress: { 'g5-u1-m1': 1 },
    };

    expect(recordActivityLog(baseProfile, next, NOW)).toBe(next);
  });

  it('returns the profile untouched when nothing was learned', () => {
    const next: LearnerProfile = { ...baseProfile, themeId: 'neon-pop' };

    const result = recordActivityLog(baseProfile, next, NOW);

    expect(result).toBe(next);
    expect(result.activityLog).toBeUndefined();
  });

  it('drops days older than the log keeps', () => {
    const tooOld = entry('2026-07-23', { sessions: 1 });
    const oldestKept = entry('2026-07-24', { sessions: 1 });
    const prev: LearnerProfile = { ...baseProfile, activityLog: [tooOld, oldestKept] };
    const next: LearnerProfile = { ...prev, stats: { ...prev.stats, xp: 105 } };

    const result = recordActivityLog(prev, next, NOW);

    expect(result.activityLog?.map((day) => day.dateStr)).toEqual(['2026-07-24', TODAY]);
  });
});

describe('pruneActivityLog', () => {
  it(`keeps ${ACTIVITY_LOG_DAYS} days sorted oldest first`, () => {
    const log = [entry(TODAY), entry('2026-10-01'), entry('2026-01-01')];

    expect(pruneActivityLog(log, TODAY).map((day) => day.dateStr)).toEqual(['2026-10-01', TODAY]);
  });
});

describe('mergeActivityLog', () => {
  it('returns whichever side exists when the other is missing', () => {
    const log = [entry(TODAY)];

    expect(mergeActivityLog(log, undefined, TODAY)).toBe(log);
    expect(mergeActivityLog(undefined, log, TODAY)).toBe(log);
  });

  it('unions days and keeps the higher count and stars of a shared day', () => {
    const local = [
      entry('2026-10-13', { sessions: 1 }),
      entry(TODAY, { sessions: 3, xpEarned: 20, missionStars: { a: 2 }, firstCompletedIds: ['a'] }),
    ];
    const cloud = [
      entry('2026-10-14', { voiceWords: 4 }),
      entry(TODAY, { sessions: 1, xpEarned: 50, missionStars: { a: 3, b: 1 }, firstCompletedIds: ['b'] }),
    ];

    const merged = mergeActivityLog(local, cloud, TODAY);

    expect(merged?.map((day) => day.dateStr)).toEqual(['2026-10-13', '2026-10-14', TODAY]);
    expect(merged?.[2]).toEqual(
      entry(TODAY, {
        sessions: 3,
        xpEarned: 50,
        missionStars: { a: 3, b: 1 },
        firstCompletedIds: ['b', 'a'],
      })
    );
  });
});
