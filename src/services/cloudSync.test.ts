import { describe, expect, it, vi } from 'vitest';
import {
  CustomWordList,
  ExamPlanDay,
  ExamPrepPlan,
  LearnerProfile,
  PlacementResult,
} from '../types/learner';
import { MAX_DRAWN_STICKERS } from '../data/stickers';

vi.mock('./firebase', () => ({ db: null }));

const { mergeLearnerProfiles } = await import('./cloudSync');

function makePlacement(completedAt: string, grade: 'grade-4' | 'grade-6'): PlacementResult {
  return {
    completedAt,
    estimatedGradeId: grade,
    recommendedGradeId: grade,
    recommendedTier: 'challenger',
    correctCount: 6,
    totalQuestions: 10,
  };
}

const baseProfile: LearnerProfile = {
  isOnboarded: true,
  name: 'Ido',
  age: 10,
  gender: 'boy',
  gradeId: 'grade-5',
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
  unlockedRewardIds: [],
  claimedDailyQuestIds: [],
  dailyCounters: {
    dateStr: '2026-10-17',
    missionsCompletedToday: 0,
    voiceWordsPracticedToday: 0,
    threeStarMissionsToday: 0,
  },
  createdAt: '2026-10-01T00:00:00.000Z',
  updatedAt: '2026-10-10T00:00:00.000Z',
};

describe('mergeLearnerProfiles placementResult', () => {
  const older = makePlacement('2026-10-05T00:00:00.000Z', 'grade-4');
  const newer = makePlacement('2026-10-15T00:00:00.000Z', 'grade-6');

  it('keeps the newer local result over an older cloud result', () => {
    const merged = mergeLearnerProfiles(
      { ...baseProfile, placementResult: newer },
      { ...baseProfile, placementResult: older }
    );
    expect(merged.placementResult).toEqual(newer);
  });

  it('keeps the newer cloud result over an older local result', () => {
    const merged = mergeLearnerProfiles(
      { ...baseProfile, placementResult: older },
      { ...baseProfile, placementResult: newer }
    );
    expect(merged.placementResult).toEqual(newer);
  });

  it('keeps a result that exists on only one side', () => {
    const merged = mergeLearnerProfiles(baseProfile, { ...baseProfile, placementResult: older });
    expect(merged.placementResult).toEqual(older);
  });

  it('leaves the field out when neither side has taken the test', () => {
    const merged = mergeLearnerProfiles(baseProfile, baseProfile);
    expect('placementResult' in merged).toBe(false);
  });
});

function makeExamPlan(id: string, createdAt: string, days: ExamPlanDay[] = []): ExamPrepPlan {
  return {
    id,
    createdAt,
    gradeId: 'grade-5',
    examDateStr: '2026-10-25',
    unitNumbers: [1],
    skills: ['grammar'],
    days,
  };
}

function makeDay(dayIndex: number, extra: Partial<ExamPlanDay> = {}): ExamPlanDay {
  return { dayIndex, dateStr: '2026-10-20', kind: 'practice', focus: [], ...extra };
}

describe('mergeLearnerProfiles examPrep', () => {
  it('keeps the newer plan when the plan ids differ', () => {
    const older = makeExamPlan('a', '2026-10-01T00:00:00.000Z');
    const newer = makeExamPlan('b', '2026-10-12T00:00:00.000Z');

    expect(mergeLearnerProfiles({ ...baseProfile, examPrep: older }, { examPrep: newer }).examPrep).toEqual(newer);
    expect(mergeLearnerProfiles({ ...baseProfile, examPrep: newer }, { examPrep: older }).examPrep).toEqual(newer);
  });

  it('merges progress of the same plan from both devices', () => {
    const local = {
      ...makeExamPlan('a', '2026-10-01T00:00:00.000Z', [
        makeDay(0, { completedAt: '2026-10-20T10:00:00.000Z', scorePercent: 60 }),
        makeDay(1),
      ]),
      bestMockScore: 50,
    };
    const cloud = {
      ...makeExamPlan('a', '2026-10-01T00:00:00.000Z', [
        makeDay(0, { completedAt: '2026-10-20T08:00:00.000Z', scorePercent: 90 }),
        makeDay(1, { completedAt: '2026-10-21T08:00:00.000Z', scorePercent: 70 }),
      ]),
      bestMockScore: 80,
      certificateEarnedAt: '2026-10-22T08:00:00.000Z',
      archivedAt: '2026-10-26T08:00:00.000Z',
    };
    const merged = mergeLearnerProfiles({ ...baseProfile, examPrep: local }, { examPrep: cloud }).examPrep;

    expect(merged?.days[0]).toMatchObject({ completedAt: '2026-10-20T08:00:00.000Z', scorePercent: 90 });
    expect(merged?.days[1]).toMatchObject({ completedAt: '2026-10-21T08:00:00.000Z', scorePercent: 70 });
    expect(merged?.bestMockScore).toBe(80);
    expect(merged?.certificateEarnedAt).toBe('2026-10-22T08:00:00.000Z');
    expect(merged?.archivedAt).toBe('2026-10-26T08:00:00.000Z');
  });

  it('keeps a plan that exists on only one side and omits the field otherwise', () => {
    const plan = makeExamPlan('a', '2026-10-01T00:00:00.000Z');

    expect(mergeLearnerProfiles(baseProfile, { examPrep: plan }).examPrep).toEqual(plan);
    expect('examPrep' in mergeLearnerProfiles(baseProfile, baseProfile)).toBe(false);
  });
});

function makeWordList(id: string, overrides: Partial<CustomWordList> = {}): CustomWordList {
  return {
    id,
    title: `List ${id}`,
    createdAt: '2026-10-10T08:00:00.000Z',
    items: [
      { id: 'w1', textEn: 'window', translationHe: 'חלון', kind: 'word' },
      { id: 'w2', textEn: 'pillow', kind: 'word' },
    ],
    ...overrides,
  };
}

describe('mergeLearnerProfiles customWordLists', () => {
  it('keeps the lists from both devices', () => {
    const merged = mergeLearnerProfiles(
      { ...baseProfile, customWordLists: [makeWordList('a')] },
      { customWordLists: [makeWordList('b')] }
    ).customWordLists;
    expect(merged?.map((l) => l.id)).toEqual(['a', 'b']);
  });

  it('keeps the best score and the latest practice of the same list', () => {
    const local = makeWordList('a', {
      bestScore: 90,
      lastPracticedAt: '2026-10-12T08:00:00.000Z',
      lastRewardedDateStr: '2026-10-12',
    });
    const cloud = makeWordList('a', {
      bestScore: 60,
      lastPracticedAt: '2026-10-14T08:00:00.000Z',
      lastRewardedDateStr: '2026-10-14',
    });
    const [merged] = mergeLearnerProfiles(
      { ...baseProfile, customWordLists: [local] },
      { customWordLists: [cloud] }
    ).customWordLists!;
    expect(merged.bestScore).toBe(90);
    expect(merged.lastPracticedAt).toBe('2026-10-14T08:00:00.000Z');
    expect(merged.lastRewardedDateStr).toBe('2026-10-14');
    expect(merged.items).toHaveLength(2);
  });

  it('keeps a list deleted on either device deleted', () => {
    const archived = makeWordList('a', { items: [], archivedAt: '2026-10-15T08:00:00.000Z' });
    const fromCloud = mergeLearnerProfiles(
      { ...baseProfile, customWordLists: [makeWordList('a')] },
      { customWordLists: [archived] }
    ).customWordLists![0];
    const fromLocal = mergeLearnerProfiles(
      { ...baseProfile, customWordLists: [archived] },
      { customWordLists: [makeWordList('a')] }
    ).customWordLists![0];
    [fromCloud, fromLocal].forEach((list) => {
      expect(list.archivedAt).toBe('2026-10-15T08:00:00.000Z');
      expect(list.items).toEqual([]);
    });
  });

  it('adds no field when neither device has lists', () => {
    expect('customWordLists' in mergeLearnerProfiles(baseProfile, baseProfile)).toBe(false);
    const lists = [makeWordList('a')];
    expect(mergeLearnerProfiles(baseProfile, { customWordLists: lists }).customWordLists).toEqual(lists);
  });
});

describe('mergeLearnerProfiles room', () => {
  const olderRoom = {
    placements: { 'floor-left': 'room-sofa' },
    namedItemIds: ['room-sofa'],
    updatedAt: '2026-10-12T08:00:00.000Z',
  };
  const newerRoom = {
    placements: { 'floor-right': 'room-plant' },
    namedItemIds: ['room-plant'],
    updatedAt: '2026-10-14T08:00:00.000Z',
  };

  it('keeps the newer layout from either device', () => {
    const fromCloud = mergeLearnerProfiles({ ...baseProfile, room: olderRoom }, { room: newerRoom }).room!;
    const fromLocal = mergeLearnerProfiles({ ...baseProfile, room: newerRoom }, { room: olderRoom }).room!;
    [fromCloud, fromLocal].forEach((room) => {
      expect(room.placements).toEqual({ 'floor-right': 'room-plant' });
      expect(room.updatedAt).toBe(newerRoom.updatedAt);
    });
  });

  it('keeps the items named on both devices', () => {
    const merged = mergeLearnerProfiles({ ...baseProfile, room: olderRoom }, { room: newerRoom }).room!;
    expect([...merged.namedItemIds].sort()).toEqual(['room-plant', 'room-sofa']);
  });

  it('keeps the newer outfit with the layout', () => {
    const merged = mergeLearnerProfiles(
      { ...baseProfile, room: { ...olderRoom, outfit: { head: 'wear-cap' } } },
      { room: { ...newerRoom, outfit: { head: 'wear-crown' } } }
    ).room!;
    expect(merged.outfit).toEqual({ head: 'wear-crown' });
  });

  it('keeps the most dress-up progress for the same day and the later day otherwise', () => {
    const day = { dateStr: '2026-10-14', namedCount: 3, voiceCount: 0, isRewarded: true };
    const sameDay = mergeLearnerProfiles(
      { ...baseProfile, room: { ...newerRoom, dressUpDay: { ...day, namedCount: 1, voiceCount: 1, isRewarded: false } } },
      { room: { ...olderRoom, dressUpDay: day } }
    ).room!;
    expect(sameDay.dressUpDay).toEqual({ ...day, voiceCount: 1 });

    const laterDay = { dateStr: '2026-10-15', namedCount: 1, voiceCount: 0, isRewarded: false };
    const merged = mergeLearnerProfiles(
      { ...baseProfile, room: { ...newerRoom, dressUpDay: day } },
      { room: { ...olderRoom, dressUpDay: laterDay } }
    ).room!;
    expect(merged.dressUpDay).toEqual(laterDay);
  });

  it('unions the items worn on the same day on both devices', () => {
    const day = { dateStr: '2026-10-14', namedCount: 2 };
    const local = { ...day, voiceCount: 2, isRewarded: false, wornItemIds: ['wear-cap', 'wear-scarf'] };
    const cloud = { ...day, voiceCount: 0, isRewarded: true, wornItemIds: ['wear-cap', 'wear-shirt'] };
    const merged = mergeLearnerProfiles(
      { ...baseProfile, room: { ...newerRoom, dressUpDay: local } },
      { room: { ...olderRoom, dressUpDay: cloud } }
    ).room!;
    expect(merged.dressUpDay).toEqual({
      dateStr: '2026-10-14',
      namedCount: 3,
      voiceCount: 2,
      isRewarded: true,
      wornItemIds: ['wear-cap', 'wear-scarf', 'wear-shirt'],
    });
  });

  it('keeps the latest daily reward date per room activity', () => {
    const merged = mergeLearnerProfiles(
      { ...baseProfile, room: { ...newerRoom, activityRewardDates: { phone: '2026-10-14', journal: '2026-10-10' } } },
      { room: { ...olderRoom, activityRewardDates: { phone: '2026-10-12', 'game-search': '2026-10-13' } } }
    ).room!;
    expect(merged.activityRewardDates).toEqual({
      phone: '2026-10-14',
      journal: '2026-10-10',
      'game-search': '2026-10-13',
    });
  });

  it('keeps dreams from both devices, newest first', () => {
    const dream = (id: string, createdAt: string) => ({ id, createdAt, textEn: id, textHe: id });
    const merged = mergeLearnerProfiles(
      { ...baseProfile, room: { ...newerRoom, dreamJournal: [dream('b', '2026-10-14T08:00:00.000Z'), dream('a', '2026-10-10T08:00:00.000Z')] } },
      { room: { ...olderRoom, dreamJournal: [dream('c', '2026-10-12T08:00:00.000Z'), dream('a', '2026-10-10T08:00:00.000Z')] } }
    ).room!;
    expect(merged.dreamJournal?.map((d) => d.id)).toEqual(['b', 'c', 'a']);
  });

  it('keeps the best word-game score per game', () => {
    const merged = mergeLearnerProfiles(
      { ...baseProfile, room: { ...newerRoom, gameBestScores: { scramble: 60, search: 100 } } },
      { room: { ...olderRoom, gameBestScores: { scramble: 80, crossword: 40 } } }
    ).room!;
    expect(merged.gameBestScores).toEqual({ scramble: 80, search: 100, crossword: 40 });
  });

  it('keeps drawn stickers from both devices and a deletion from either', () => {
    const sticker = (id: string, archivedAt?: string) => ({
      id,
      nameEn: id,
      imageDataUrl: archivedAt ? '' : 'data:image/png;base64,AAA',
      createdAt: '2026-10-10T08:00:00.000Z',
      ...(archivedAt ? { archivedAt } : {}),
    });
    const merged = mergeLearnerProfiles(
      { ...baseProfile, room: { ...newerRoom, drawnStickers: [sticker('a'), sticker('b')] } },
      { room: { ...olderRoom, drawnStickers: [sticker('a', '2026-10-15T08:00:00.000Z'), sticker('c')] } }
    ).room!;
    expect(merged.drawnStickers?.map((s) => s.id)).toEqual(['a', 'b', 'c']);
    expect(merged.drawnStickers?.[0]).toMatchObject({ archivedAt: '2026-10-15T08:00:00.000Z', imageDataUrl: '' });
    expect(merged.drawnStickers?.[1].imageDataUrl).toBe('data:image/png;base64,AAA');
  });

  it('keeps only the newest drawn stickers active when both devices drew a full set', () => {
    const drawn = (id: string, day: number) => ({
      id,
      nameEn: id,
      imageDataUrl: 'data:image/png;base64,AAA',
      createdAt: `2026-10-${String(day).padStart(2, '0')}T08:00:00.000Z`,
    });
    const days = Array.from({ length: MAX_DRAWN_STICKERS }, (_, i) => i + 1);
    const local = days.map((day) => drawn(`local-${day}`, day));
    const cloud = days.map((day) => drawn(`cloud-${day}`, day + MAX_DRAWN_STICKERS));
    const merged = mergeLearnerProfiles(
      { ...baseProfile, room: { ...newerRoom, drawnStickers: local } },
      { room: { ...olderRoom, drawnStickers: cloud } }
    ).room!.drawnStickers!;

    expect(merged).toHaveLength(2 * MAX_DRAWN_STICKERS);
    const active = merged.filter((s) => !s.archivedAt);
    expect(active).toHaveLength(MAX_DRAWN_STICKERS);
    expect(active.map((s) => s.id)).toEqual(cloud.map((s) => s.id));
    const archived = merged.filter((s) => s.archivedAt);
    expect(archived.map((s) => s.id)).toEqual(local.map((s) => s.id));
    expect(archived.every((s) => s.imageDataUrl === '' && s.archivedAt === '2026-10-24T08:00:00.000Z')).toBe(true);

    // The other device computes the same result
    const reversed = mergeLearnerProfiles(
      { ...baseProfile, room: { ...newerRoom, drawnStickers: cloud } },
      { room: { ...olderRoom, drawnStickers: local } }
    ).room!.drawnStickers!;
    expect(reversed.filter((s) => s.archivedAt)).toEqual(archived);
  });

  it('keeps a room that exists on only one side and adds none otherwise', () => {
    expect(mergeLearnerProfiles(baseProfile, { room: olderRoom }).room).toEqual(olderRoom);
    expect(mergeLearnerProfiles({ ...baseProfile, room: olderRoom }, {}).room).toEqual(olderRoom);
    expect('room' in mergeLearnerProfiles(baseProfile, baseProfile)).toBe(false);
  });
});
