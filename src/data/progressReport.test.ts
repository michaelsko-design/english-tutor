import { describe, expect, it } from 'vitest';
import { ActivityLogEntry, LearnerProfile } from '../types/learner';
import {
  MAX_REPORT_WEEKS,
  SHARE_TEXT_MAX_WORDS,
  buildWeeklyReport,
  buildWeeklyReportTextHe,
  collectMissionWords,
  countMasteredWords,
  formatDayCountHe,
  getAvailableWeeks,
  getOverallProgress,
  getWeekDays,
  getWeekStart,
} from './progressReport';

// Thursday; its week runs from Sunday 2026-10-11 to Saturday 2026-10-17
const TODAY = '2026-10-15';
const WEEK = '2026-10-11';

const baseProfile: LearnerProfile = {
  isOnboarded: true,
  name: 'Noa',
  age: 10,
  gender: 'girl',
  gradeId: 'grade-5',
  preferredTier: 'challenger',
  themeId: 'cozy-studio',
  isShabbatObserver: true,
  stats: {
    xp: 400,
    level: 3,
    stars: 0,
    maxPossibleStars: 36,
    diamonds: 50,
    streakDays: 4,
    streakLastDateStr: TODAY,
    shabbatShieldActive: true,
    wordsMastered: 0,
    missionsCompleted: 0,
  },
  missionProgress: {},
  unlockedRewardIds: [],
  claimedDailyQuestIds: [],
  dailyCounters: {
    dateStr: TODAY,
    missionsCompletedToday: 0,
    voiceWordsPracticedToday: 0,
    threeStarMissionsToday: 0,
  },
  createdAt: '2026-09-01T00:00:00.000Z',
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

describe('getWeekStart', () => {
  it('returns the Sunday of the week', () => {
    expect(getWeekStart(TODAY)).toBe(WEEK);
    expect(getWeekStart('2026-10-17')).toBe(WEEK);
    expect(getWeekStart(WEEK)).toBe(WEEK);
    expect(getWeekStart('2026-10-18')).toBe('2026-10-18');
  });

  it('crosses month and year boundaries', () => {
    expect(getWeekStart('2027-01-01')).toBe('2026-12-27');
  });
});

describe('getWeekDays', () => {
  it('lists the seven days from Sunday to Saturday', () => {
    expect(getWeekDays(WEEK)).toEqual([
      '2026-10-11',
      '2026-10-12',
      '2026-10-13',
      '2026-10-14',
      '2026-10-15',
      '2026-10-16',
      '2026-10-17',
    ]);
  });
});

describe('getAvailableWeeks', () => {
  it('offers only the current week before anything was logged', () => {
    expect(getAvailableWeeks(baseProfile, TODAY)).toEqual([WEEK]);
  });

  it('goes back to the week of the first logged day, newest first', () => {
    const profile = { ...baseProfile, activityLog: [entry('2026-09-30'), entry(TODAY)] };

    expect(getAvailableWeeks(profile, TODAY)).toEqual([WEEK, '2026-10-04', '2026-09-27']);
  });

  it(`shows at most ${MAX_REPORT_WEEKS} weeks`, () => {
    const profile = { ...baseProfile, activityLog: [entry('2026-01-01')] };

    const weeks = getAvailableWeeks(profile, TODAY);

    expect(weeks).toHaveLength(MAX_REPORT_WEEKS);
    expect(weeks[0]).toBe(WEEK);
  });
});

describe('buildWeeklyReport', () => {
  const profile: LearnerProfile = {
    ...baseProfile,
    missionProgress: { 'g5-u1-m1': 3, 'g5-u1-m2': 2, 'g6-u1-m1': 1 },
    activityLog: [
      entry('2026-10-10', { sessions: 5, xpEarned: 500 }),
      entry('2026-10-12', {
        sessions: 2,
        xpEarned: 60,
        voiceWords: 3,
        threeStarSessions: 1,
        starsGained: 4,
        missionStars: { 'g5-u1-m1': 3, 'g5-u1-m2': 1 },
        firstCompletedIds: ['g5-u1-m1', 'g5-u1-m2'],
      }),
      entry('2026-10-14', {
        sessions: 1,
        xpEarned: 20,
        starsGained: 1,
        missionStars: { 'g5-u1-m2': 2 },
      }),
    ],
  };

  it('adds up only the days of the chosen week', () => {
    const report = buildWeeklyReport(profile, WEEK, TODAY);

    expect(report).toMatchObject({
      weekStart: WEEK,
      weekEnd: '2026-10-17',
      isCurrentWeek: true,
      activeDays: 2,
      sessions: 3,
      xpEarned: 80,
      voiceWords: 3,
      threeStarSessions: 1,
      starsGained: 5,
      newMissionsCompleted: 2,
      trackingStartDateStr: '2026-10-10',
    });
  });

  it('marks each day as active, missed, Shabbat or still to come', () => {
    const statuses = buildWeeklyReport(profile, WEEK, TODAY).days.map((day) => day.status);

    expect(statuses).toEqual(['missed', 'active', 'missed', 'active', 'missed', 'future', 'future']);
  });

  it('shields Friday and Saturday only for Shabbat observers', () => {
    const lastWeek = '2026-10-04';

    const observer = buildWeeklyReport(profile, lastWeek, TODAY).days.map((day) => day.status);
    const nonObserver = buildWeeklyReport({ ...profile, isShabbatObserver: false }, lastWeek, TODAY).days.map(
      (day) => day.status
    );

    expect(observer.slice(5)).toEqual(['shabbat', 'active']);
    expect(nonObserver.slice(5)).toEqual(['missed', 'active']);
  });

  it('counts a day with only voice practice as active, but not a day with only XP', () => {
    const voiceOnly: LearnerProfile = {
      ...baseProfile,
      activityLog: [entry('2026-10-12', { voiceWords: 2, xpEarned: 10 }), entry('2026-10-13', { xpEarned: 15 })],
    };

    const statuses = buildWeeklyReport(voiceOnly, WEEK, TODAY).days.map((day) => day.status);

    expect(statuses.slice(1, 3)).toEqual(['active', 'missed']);
  });

  it('lists the words of missions that reached 3 stars this week', () => {
    const words = buildWeeklyReport(profile, WEEK, TODAY).newMasteredWords.map((word) => word.wordEn);

    expect(words).toEqual(['fluffy', 'friendly', 'favorite']);
  });

  it('reports an empty past week as all missed', () => {
    const report = buildWeeklyReport(profile, '2026-09-27', TODAY);

    expect(report.isCurrentWeek).toBe(false);
    expect(report.sessions).toBe(0);
    expect(report.days.every((day) => day.status !== 'active' && day.status !== 'future')).toBe(true);
  });
});

describe('getOverallProgress', () => {
  it('rates star mastery across all grades and for the current grade', () => {
    const profile = { ...baseProfile, missionProgress: { 'g5-u1-m1': 3, 'g5-u1-m2': 2, 'g6-u1-m1': 2, 'g5-u1-m3': 0 } };

    expect(getOverallProgress(profile, TODAY)).toEqual({
      level: 3,
      streakDays: 4,
      missionsCompleted: 3,
      totalStars: 7,
      averageStars: 2.3,
      gradeStarsEarned: 5,
      gradeStarsPossible: 36,
      gradeStarPercent: 14,
      masteredWordCount: 3,
    });
  });

  it('has a zero average before any mission is completed', () => {
    expect(getOverallProgress(baseProfile, TODAY).averageStars).toBe(0);
  });
});

describe('countMasteredWords', () => {
  it('counts the words of 3-star missions only, the same number the report shows', () => {
    const progress = { 'g5-u1-m1': 3, 'g5-u1-m2': 2, 'g6-u1-m1': 2 };

    expect(countMasteredWords(progress)).toBe(3);
    expect(countMasteredWords(progress)).toBe(
      getOverallProgress({ ...baseProfile, missionProgress: progress }, TODAY).masteredWordCount
    );
  });

  it('counts a word shared by two mastered missions of different grades once', () => {
    const both = countMasteredWords({ 'g1-u4-m2': 3, 'g2-u1-m1': 3 });
    const separate =
      countMasteredWords({ 'g1-u4-m2': 3 }) + countMasteredWords({ 'g2-u1-m1': 3 });

    expect(both).toBe(collectMissionWords(['g1-u4-m2', 'g2-u1-m1']).length);
    expect(both).toBeLessThan(separate);
  });

  it('is zero before any mission has 3 stars', () => {
    expect(countMasteredWords({})).toBe(0);
    expect(countMasteredWords({ 'g5-u1-m1': 2 })).toBe(0);
  });
});

describe('collectMissionWords', () => {
  it('counts a word that appears in two missions once', () => {
    const words = collectMissionWords(['g1-u4-m2', 'g2-u1-m1']).map((word) => word.wordEn.toLowerCase());

    expect(words.filter((word) => word === 'ball')).toHaveLength(1);
  });

  it('skips unknown mission ids', () => {
    expect(collectMissionWords(['no-such-mission'])).toEqual([]);
  });
});

describe('formatDayCountHe', () => {
  it('says one day the Hebrew way', () => {
    expect(formatDayCountHe(1)).toBe('יום אחד');
    expect(formatDayCountHe(4)).toBe('4 ימים');
  });
});

describe('buildWeeklyReportTextHe', () => {
  const profile: LearnerProfile = {
    ...baseProfile,
    missionProgress: { 'g5-u1-m1': 3 },
    activityLog: [
      entry('2026-10-12', { sessions: 2, starsGained: 3, missionStars: { 'g5-u1-m1': 3 }, firstCompletedIds: ['g5-u1-m1'] }),
    ],
  };

  it('sums up the week with the learner name and the girl form', () => {
    const text = buildWeeklyReportTextHe(buildWeeklyReport(profile, WEEK, TODAY), profile);

    expect(text).toContain('Noa (כיתה ה׳)');
    expect(text).toContain('שבוע 11/10–17/10');
    expect(text).toContain('Noa תרגלה יום אחד מתוך 7');
    expect(text).toContain('תרגולים שהושלמו: 2');
    expect(text).toContain('fluffy – ');
  });

  it('uses the boy form and says when the week has no practice yet', () => {
    const boy: LearnerProfile = { ...baseProfile, name: 'Ido', gender: 'boy' };

    const text = buildWeeklyReportTextHe(buildWeeklyReport(boy, WEEK, TODAY), boy);

    expect(text).toContain('Ido עוד לא תרגל בשבוע הזה');
    expect(text).not.toContain('מילים חדשות שנשלטו');
  });

  it(`lists at most ${SHARE_TEXT_MAX_WORDS} new words`, () => {
    const missionIds = ['g5-u1-m1', 'g5-u1-m2', 'g5-u1-m3', 'g6-u1-m1', 'g6-u1-m2'];
    const busy: LearnerProfile = {
      ...baseProfile,
      activityLog: [
        entry('2026-10-12', { sessions: 5, missionStars: Object.fromEntries(missionIds.map((id) => [id, 3])) }),
      ],
    };
    const report = buildWeeklyReport(busy, WEEK, TODAY);

    const text = buildWeeklyReportTextHe(report, busy);

    expect(report.newMasteredWords).toHaveLength(15);
    expect(text).toContain('ועוד 5 מילים');
    expect(text.split('\n').filter((line) => /^[a-z]+ – /i.test(line))).toHaveLength(SHARE_TEXT_MAX_WORDS);
  });
});
