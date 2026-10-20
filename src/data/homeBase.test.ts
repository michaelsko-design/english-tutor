import { describe, expect, it } from 'vitest';
import {
  getFirstLaunchSteps,
  getHomeGreetingHe,
  getMapPeek,
  getPlayLabelHe,
  getQuestRings,
  getRingDash,
} from './homeBase';
import { DAILY_QUESTS } from './rewardShop';
import { CurriculumUnit, MissionNode } from './curriculum';
import { DailyActivityCounters } from '../types/learner';

const counters = (overrides: Partial<DailyActivityCounters> = {}): DailyActivityCounters => ({
  dateStr: '2026-10-18',
  missionsCompletedToday: 0,
  voiceWordsPracticedToday: 0,
  threeStarMissionsToday: 0,
  ...overrides,
});

const makeUnit = (unitNumber: number, missionCount = 3): CurriculumUnit =>
  ({
    unitNumber,
    titleHe: `יחידה ${unitNumber}`,
    badgeEmoji: '🏰',
    missions: Array.from({ length: missionCount }, (_, i) => ({ id: `u${unitNumber}-m${i + 1}` }) as MissionNode),
  }) as CurriculumUnit;

describe('getQuestRings', () => {
  it('gives one ring per quest in order, empty at the start of the day', () => {
    const rings = getQuestRings(DAILY_QUESTS, counters(), []);

    expect(rings.map((r) => r.id)).toEqual(DAILY_QUESTS.map((q) => q.id));
    expect(rings.every((r) => r.ratio === 0 && r.state === 'progress')).toBe(true);
  });

  it('fills a ring partway and caps it at the target', () => {
    const rings = getQuestRings(DAILY_QUESTS, counters({ voiceWordsPracticedToday: 1, missionsCompletedToday: 4 }), []);
    const voice = rings.find((r) => r.id === 'quest-voice-words')!;
    const mission = rings.find((r) => r.id === 'quest-daily-mission')!;

    expect(voice).toMatchObject({ current: 1, target: 2, ratio: 0.5, state: 'progress' });
    expect(mission).toMatchObject({ current: 1, target: 1, ratio: 1, state: 'ready' });
  });

  it('marks a claimed quest as claimed even when its counter was reset', () => {
    const rings = getQuestRings(DAILY_QUESTS, counters(), ['quest-three-stars']);

    expect(rings.find((r) => r.id === 'quest-three-stars')!.state).toBe('claimed');
  });
});

describe('getRingDash', () => {
  it('leaves the given share of the ring drawn', () => {
    const { circumference, offset } = getRingDash(0.25, 10);

    expect(circumference).toBeCloseTo(2 * Math.PI * 10);
    expect(offset).toBeCloseTo(circumference * 0.75);
  });

  it('clamps the ratio to 0..1', () => {
    expect(getRingDash(2, 10).offset).toBe(0);
    expect(getRingDash(-1, 10).offset).toBeCloseTo(2 * Math.PI * 10);
  });
});

describe('getHomeGreetingHe', () => {
  const base = { name: 'נועה', bossGate: null, missionsToday: 0, isFirstMission: false };

  it('greets by name in gendered Hebrew', () => {
    expect(getHomeGreetingHe({ ...base, gender: 'girl' })).toBe('היי נועה! מוכנה למשימה של היום?');
    expect(getHomeGreetingHe({ ...base, gender: 'boy', name: 'איתי' })).toBe('היי איתי! מוכן למשימה של היום?');
  });

  it('falls back to a gendered nickname without a name', () => {
    expect(getHomeGreetingHe({ ...base, gender: 'girl', name: '  ' })).toContain('אלופה');
    expect(getHomeGreetingHe({ ...base, gender: 'boy', name: '' })).toContain('אלוף');
  });

  it('invites a first-timer to the first adventure', () => {
    expect(getHomeGreetingHe({ ...base, gender: 'boy', isFirstMission: true })).toContain('בוא נתחיל');
  });

  it('names the missing Boss stars on a replay suggestion', () => {
    const bossGate = { required: 4, earned: 1, missing: 3, isMet: false };

    expect(getHomeGreetingHe({ ...base, gender: 'girl', bossGate })).toContain('עוד 3 ⭐');
  });

  it('cheers after a mission today', () => {
    expect(getHomeGreetingHe({ ...base, gender: 'girl', missionsToday: 2 })).toContain('כל הכבוד נועה');
  });
});

describe('getPlayLabelHe', () => {
  it('plays the next mission or replays for stars, by gender', () => {
    expect(getPlayLabelHe('girl', false)).toBe('בואי נשחק!');
    expect(getPlayLabelHe('boy', false)).toBe('בוא נשחק!');
    expect(getPlayLabelHe('girl', true)).toBe('שפרי כוכבים');
    expect(getPlayLabelHe('boy', true)).toBe('שפר כוכבים');
  });
});

describe('getMapPeek', () => {
  const units = [makeUnit(1), makeUnit(2)];

  it('points at the first unit with a mission without stars', () => {
    const peek = getMapPeek(units, { 'u1-m1': 3, 'u1-m2': 2, 'u1-m3': 1, 'u2-m1': 1 });

    expect(peek).toEqual({
      unitNumber: 2,
      unitTitleHe: 'יחידה 2',
      unitEmoji: '🏰',
      starsEarned: 7,
      starsPossible: 18,
      missionsCompleted: 4,
      missionsTotal: 6,
    });
  });

  it('stays on the last unit once every mission has stars, and ignores other grades', () => {
    const progress = Object.fromEntries(units.flatMap((u) => u.missions.map((m) => [m.id, 3])));
    const peek = getMapPeek(units, { ...progress, 'other-grade': 3 });

    expect(peek).toMatchObject({ unitNumber: 2, starsEarned: 18, missionsCompleted: 6 });
  });

  it('returns null for a grade without units', () => {
    expect(getMapPeek([], {})).toBeNull();
  });
});

describe('getFirstLaunchSteps', () => {
  const steps = (hasSeenWelcomeGift: boolean, isOfferingTour: boolean, isOfferingPlacement: boolean) =>
    getFirstLaunchSteps({ hasSeenWelcomeGift, isOfferingTour, isOfferingPlacement });

  it('runs the greeting first, then the app tour, then the placement offer', () => {
    expect(steps(false, false, true)).toEqual(['greeting', 'tour', 'placement']);
  });

  it('always follows the greeting with the tour', () => {
    expect(steps(false, false, false)).toEqual(['greeting', 'tour']);
  });

  it('skips the steps already done', () => {
    expect(steps(true, true, true)).toEqual(['tour', 'placement']);
    expect(steps(true, false, true)).toEqual(['placement']);
    expect(steps(true, true, false)).toEqual(['tour']);
    expect(steps(true, false, false)).toEqual([]);
  });
});
