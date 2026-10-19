import { describe, expect, it, vi } from 'vitest';
import {
  ActivityLogEntry,
  ContestRecord,
  CustomWordList,
  ExamPlanDay,
  ExamPrepPlan,
  FriendsHubState,
  LearnerProfile,
  PlacementResult,
} from '../types/learner';
import { MAX_DRAWN_STICKERS } from '../data/stickers';
import { toLocalDateStr } from '../data/examPrep';

vi.mock('./firebase', () => ({ db: null }));

const { buildLoginProfile, mergeLearnerProfiles } = await import('./cloudSync');

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

describe('mergeLearnerProfiles voicePreference', () => {
  it('keeps a voice chosen on only one side', () => {
    const merged = mergeLearnerProfiles(baseProfile, { ...baseProfile, voicePreference: 'male' });
    expect(merged.voicePreference).toBe('male');
  });

  it('leaves the field out when neither side chose', () => {
    expect('voicePreference' in mergeLearnerProfiles(baseProfile, baseProfile)).toBe(false);
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

describe('mergeLearnerProfiles friendsHub', () => {
  const hubOn: FriendsHubState = {
    isEnabled: true,
    friendCode: 'K7MP2Q',
    friendCodeCreatedAt: '2026-10-05T00:00:00.000Z',
    updatedAt: '2026-10-05T00:00:00.000Z',
  };
  const hubOffLater: FriendsHubState = { isEnabled: false, updatedAt: '2026-10-12T00:00:00.000Z' };

  it('keeps the newer toggle and the claimed code, from either side', () => {
    const expected = { ...hubOffLater, friendCode: 'K7MP2Q', friendCodeCreatedAt: hubOn.friendCodeCreatedAt };
    expect(mergeLearnerProfiles({ ...baseProfile, friendsHub: hubOn }, { friendsHub: hubOffLater }).friendsHub).toEqual(expected);
    expect(mergeLearnerProfiles({ ...baseProfile, friendsHub: hubOffLater }, { friendsHub: hubOn }).friendsHub).toEqual(expected);
  });

  it('keeps the earlier code when both devices claimed one', () => {
    const laterCode: FriendsHubState = {
      ...hubOn,
      friendCode: 'ZZZ222',
      friendCodeCreatedAt: '2026-10-06T00:00:00.000Z',
      updatedAt: '2026-10-06T00:00:00.000Z',
    };
    expect(mergeLearnerProfiles({ ...baseProfile, friendsHub: laterCode }, { friendsHub: hubOn }).friendsHub?.friendCode).toBe('K7MP2Q');
    expect(mergeLearnerProfiles({ ...baseProfile, friendsHub: hubOn }, { friendsHub: laterCode }).friendsHub?.friendCode).toBe('K7MP2Q');
  });

  it('keeps a hub that exists on only one side and adds none otherwise', () => {
    expect(mergeLearnerProfiles(baseProfile, { friendsHub: hubOn }).friendsHub).toEqual(hubOn);
    expect(mergeLearnerProfiles({ ...baseProfile, friendsHub: hubOn }, {}).friendsHub).toEqual(hubOn);
    expect('friendsHub' in mergeLearnerProfiles(baseProfile, baseProfile)).toBe(false);
  });
});

describe('mergeLearnerProfiles friendsHub contests', () => {
  const hub: FriendsHubState = { isEnabled: true, updatedAt: '2026-10-05T00:00:00.000Z' };
  const record = (contestId: string, recordedAt: string, diamondsEarned = 10): ContestRecord => ({
    contestId,
    friendUid: 'f',
    friendName: 'Dana',
    dateStr: '2026-10-17',
    myScorePercent: 80,
    theirScorePercent: 60,
    outcome: 'won',
    diamondsEarned,
    recordedAt,
  });

  it('unions contest records by contest, newest first, keeping the first record of a contest', () => {
    const local = { ...hub, contestHistory: [record('b', '2026-10-17T12:00:00.000Z'), record('a', '2026-10-17T09:00:00.000Z')] };
    const cloud = { ...hub, contestHistory: [record('c', '2026-10-17T15:00:00.000Z'), record('a', '2026-10-17T10:00:00.000Z', 0)] };
    for (const [l, c] of [[local, cloud], [cloud, local]]) {
      const merged = mergeLearnerProfiles({ ...baseProfile, friendsHub: l }, { friendsHub: c }).friendsHub!.contestHistory!;
      expect(merged.map((r) => r.contestId)).toEqual(['c', 'b', 'a']);
      expect(merged.find((r) => r.contestId === 'a')?.recordedAt).toBe('2026-10-17T09:00:00.000Z');
    }
  });

  it("keeps the later day's finish count, and the higher count for the same day", () => {
    const day = (dateStr: string, count: number): FriendsHubState => ({ ...hub, contestFinishDay: { dateStr, count } });
    expect(
      mergeLearnerProfiles({ ...baseProfile, friendsHub: day('2026-10-17', 1) }, { friendsHub: day('2026-10-17', 3) }).friendsHub?.contestFinishDay
    ).toEqual({ dateStr: '2026-10-17', count: 3 });
    expect(
      mergeLearnerProfiles({ ...baseProfile, friendsHub: day('2026-10-18', 1) }, { friendsHub: day('2026-10-17', 3) }).friendsHub?.contestFinishDay
    ).toEqual({ dateStr: '2026-10-18', count: 1 });
  });
});

describe('mergeLearnerProfiles activityLog', () => {
  const today = toLocalDateStr(new Date());
  const day = (sessions: number): ActivityLogEntry => ({
    dateStr: today,
    sessions,
    voiceWords: 0,
    threeStarSessions: 0,
    xpEarned: 0,
    starsGained: 0,
    missionStars: {},
    firstCompletedIds: [],
  });

  it('keeps a log that only one device has', () => {
    const merged = mergeLearnerProfiles(baseProfile, { ...baseProfile, activityLog: [day(2)] });

    expect(merged.activityLog).toEqual([day(2)]);
  });

  it('combines the logs of both devices', () => {
    const merged = mergeLearnerProfiles(
      { ...baseProfile, activityLog: [day(1)] },
      { ...baseProfile, activityLog: [day(3)] }
    );

    expect(merged.activityLog).toEqual([day(3)]);
  });

  it('leaves the field out when neither device has a log', () => {
    expect(mergeLearnerProfiles(baseProfile, baseProfile)).not.toHaveProperty('activityLog');
  });
});

describe('mergeLearnerProfiles diamonds', () => {
  it('keeps a purchase made on one device when another device earned diamonds', () => {
    const phone: LearnerProfile = {
      ...baseProfile,
      stats: { ...baseProfile.stats, diamonds: 70 },
      diamondLedger: { legacy: { earned: 100, spent: 0 }, phone: { earned: 0, spent: 30 } },
    };
    const tablet: LearnerProfile = {
      ...baseProfile,
      stats: { ...baseProfile.stats, diamonds: 110 },
      diamondLedger: { legacy: { earned: 100, spent: 0 }, tablet: { earned: 10, spent: 0 } },
    };

    const merged = mergeLearnerProfiles(phone, tablet);

    expect(merged.stats.diamonds).toBe(80);
    expect(mergeLearnerProfiles(tablet, phone).stats.diamonds).toBe(80);
  });

  it('does not refund a purchase when the other copy still has the old balance', () => {
    const afterPurchase: LearnerProfile = {
      ...baseProfile,
      stats: { ...baseProfile.stats, diamonds: 20 },
      diamondLedger: { legacy: { earned: 50, spent: 0 }, phone: { earned: 0, spent: 30 } },
    };
    const stale: LearnerProfile = { ...baseProfile, diamondLedger: { legacy: { earned: 50, spent: 0 } } };

    expect(mergeLearnerProfiles(stale, afterPurchase).stats.diamonds).toBe(20);
  });

  it('ignores the plain balance of a copy without a ledger once the other has one', () => {
    const withLedger: LearnerProfile = {
      ...baseProfile,
      stats: { ...baseProfile.stats, diamonds: 20 },
      diamondLedger: { legacy: { earned: 50, spent: 0 }, phone: { earned: 0, spent: 30 } },
    };

    expect(mergeLearnerProfiles(withLedger, { ...baseProfile, stats: { ...baseProfile.stats, diamonds: 50 } }).stats.diamonds).toBe(20);
  });

  it('keeps the larger balance while neither copy has a ledger', () => {
    const merged = mergeLearnerProfiles(baseProfile, { ...baseProfile, stats: { ...baseProfile.stats, diamonds: 75 } });
    expect(merged.stats.diamonds).toBe(75);
    expect('diamondLedger' in merged).toBe(false);
  });
});

describe('mergeLearnerProfiles streak and replay rewards', () => {
  it('keeps the streak of the device that learned last', () => {
    const merged = mergeLearnerProfiles(
      { ...baseProfile, stats: { ...baseProfile.stats, streakDays: 9, streakLastDateStr: '2026-10-10' } },
      { ...baseProfile, stats: { ...baseProfile.stats, streakDays: 1, streakLastDateStr: '2026-10-17' } }
    );
    expect(merged.stats.streakDays).toBe(1);
    expect(merged.stats.streakLastDateStr).toBe('2026-10-17');
  });

  it('keeps the later reward date per mission', () => {
    const merged = mergeLearnerProfiles(
      { ...baseProfile, missionRewardDates: { a: '2026-10-17', b: '2026-10-01' } },
      { ...baseProfile, missionRewardDates: { b: '2026-10-16', c: '2026-10-15' } }
    );
    expect(merged.missionRewardDates).toEqual({ a: '2026-10-17', b: '2026-10-16', c: '2026-10-15' });
  });

  it('unions the Vault words rewarded on the same day', () => {
    const merged = mergeLearnerProfiles(
      { ...baseProfile, vaultPractice: { dateStr: '2026-10-17', words: ['cat'] } },
      { ...baseProfile, vaultPractice: { dateStr: '2026-10-17', words: ['dog', 'cat'] } }
    );
    expect(merged.vaultPractice).toEqual({ dateStr: '2026-10-17', words: ['cat', 'dog'] });
  });
});

describe('mergeLearnerProfiles fields added by the audit', () => {
  it('keeps the parent’s first consent and the school grade', () => {
    const merged = mergeLearnerProfiles(
      { ...baseProfile, parentalConsentAt: '2026-10-12T00:00:00.000Z', schoolGradeId: 'grade-5' },
      { ...baseProfile, parentalConsentAt: '2026-10-15T00:00:00.000Z' }
    );
    expect(merged.parentalConsentAt).toBe('2026-10-12T00:00:00.000Z');
    expect(merged.schoolGradeId).toBe('grade-5');
  });
});

describe('buildLoginProfile', () => {
  const freshDefault: LearnerProfile = {
    ...baseProfile,
    isOnboarded: false,
    name: '',
    stats: { ...baseProfile.stats, diamonds: 50 },
    createdAt: new Date(0).toISOString(),
    updatedAt: new Date(0).toISOString(),
  };

  it('keeps a spent-down balance instead of the welcome gift (no ledger yet)', () => {
    const cloud = { ...baseProfile, stats: { ...baseProfile.stats, diamonds: 10 } };
    expect(buildLoginProfile(freshDefault, cloud).stats.diamonds).toBe(10);
  });

  it('uses the cloud profile’s name, grade and onboarding', () => {
    const loaded = buildLoginProfile(freshDefault, baseProfile);
    expect(loaded.isOnboarded).toBe(true);
    expect(loaded.name).toBe('Ido');
    expect(loaded.gradeId).toBe('grade-5');
  });
});
