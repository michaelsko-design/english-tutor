import { describe, expect, it } from 'vitest';
import {
  CONTEST_DAILY_REWARD_LIMIT,
  CONTEST_FINISH_XP,
  CONTEST_HISTORY_DAYS,
  CONTEST_LOOKBACK_DAYS,
  CONTEST_MIN_TIME_MS,
  CONTEST_MEANING_COUNT,
  CONTEST_OPTION_COUNT,
  CONTEST_PARTICIPATION_DIAMONDS,
  CONTEST_REPEAT_XP,
  CONTEST_WIN_DIAMONDS,
  ContestDoc,
  MAX_CONTEST_HISTORY,
  ContestResult,
  applyContestFinish,
  applyContestOutcome,
  applyDecidedContests,
  buildContestSteps,
  createContest,
  findTodaysContest,
  getContestExpiry,
  getContestId,
  getContestState,
  getRecordAgainst,
  keepRecentRecords,
  scoreContestAnswers,
} from './contests';
import { CURRICULUM_BY_GRADE } from './curriculum';
import { MAX_FRIENDS, getPairId } from './friends';
import { GradeId, LearnerProfile } from '../types/learner';

const ME = 'uid-me';
const FRIEND = 'uid-friend';
const NOW = new Date(2026, 9, 17, 10, 0);
const LATER = new Date(2026, 9, 17, 22, 0);
const TOMORROW = new Date(2026, 9, 18, 10, 0);

const baseProfile: LearnerProfile = {
  isOnboarded: true,
  name: 'Noa',
  age: 10,
  gender: 'girl',
  gradeId: 'grade-5',
  preferredTier: 'explorer',
  themeId: 'cozy-studio',
  stats: {
    xp: 0,
    level: 1,
    stars: 0,
    maxPossibleStars: 36,
    diamonds: 10,
    streakDays: 2,
    streakLastDateStr: '2026-10-16',
    shabbatShieldActive: true,
    wordsMastered: 0,
    missionsCompleted: 0,
  },
  missionProgress: {},
  unlockedRewardIds: [],
  claimedDailyQuestIds: [],
  dailyCounters: {
    dateStr: '2026-10-16',
    missionsCompletedToday: 0,
    voiceWordsPracticedToday: 0,
    threeStarMissionsToday: 0,
  },
  createdAt: '2026-01-01T00:00:00.000Z',
};

function sequence(...values: number[]): () => number {
  let i = 0;
  return () => values[i++ % values.length];
}

function makeContest(overrides: Partial<ContestDoc> = {}): ContestDoc {
  return {
    ...createContest({ uid: ME, displayName: 'Noa' }, { uid: FRIEND, displayName: 'Dana' }, NOW, sequence(0.42, 0.3)),
    ...overrides,
  };
}

function result(correctCount: number, timeMs: number, totalCount = 8): ContestResult {
  return { correctCount, totalCount, timeMs, finishedAt: NOW.toISOString() };
}

describe('createContest', () => {
  it('creates one contest per pair per day that ends at local midnight', () => {
    const contest = makeContest();
    expect(contest.id).toBe(`${getPairId(ME, FRIEND)}_2026-10-17`);
    expect(contest.id).toBe(getContestId(FRIEND, ME, '2026-10-17'));
    expect(contest.uids).toEqual([ME, FRIEND]);
    expect(contest.status).toBe('invited');
    expect(contest.expiresAtMs).toBe(new Date(2026, 9, 18).getTime());
    expect(getContestExpiry(LATER)).toBe(contest.expiresAtMs);
    expect(contest.unitNumber).toBe(2);
  });

  it('picks a unit from 1 to 4', () => {
    for (const r of [0, 0.25, 0.5, 0.99]) {
      const unit = createContest({ uid: ME, displayName: 'a' }, { uid: FRIEND, displayName: 'b' }, NOW, sequence(0.5, r)).unitNumber;
      expect(unit).toBeGreaterThanOrEqual(1);
      expect(unit).toBeLessThanOrEqual(4);
    }
  });
});

describe('buildContestSteps', () => {
  const contest = { seed: 12345, unitNumber: 3 };

  it('gives every player the same layout from their own grade', () => {
    const grades: GradeId[] = ['grade-2', 'grade-5', 'grade-8', 'grade-11'];
    const layouts = grades.map((g) => buildContestSteps(g, contest, 'girl').map((s) => s.kind));
    const expected = [...Array(CONTEST_MEANING_COUNT).fill('meaning'), 'sentence', 'sentence', 'sentence'];
    for (const layout of layouts) expect(layout).toEqual(expected);
  });

  it("uses words from the contest unit of the player's grade", () => {
    const unitWords = CURRICULUM_BY_GRADE['grade-8'].units[2].missions.flatMap((m) => m.vocabulary.map((v) => v.wordEn));
    const steps = buildContestSteps('grade-8', contest, 'boy').filter((s) => s.kind === 'meaning');
    for (const step of steps) {
      const word = step.questionEn.match(/"(.+)"/)?.[1];
      expect(unitWords).toContain(word);
    }
  });

  it('gives each meaning question one right answer among distinct options', () => {
    for (const step of buildContestSteps('grade-5', contest, 'girl').filter((s) => s.kind === 'meaning')) {
      expect(step.options).toHaveLength(CONTEST_OPTION_COUNT);
      expect(step.options!.filter((o) => o.isCorrect)).toHaveLength(1);
      expect(new Set(step.options!.map((o) => o.textEn)).size).toBe(CONTEST_OPTION_COUNT);
    }
  });

  it('is the same for the same contest and changes with the seed', () => {
    const a = buildContestSteps('grade-6', contest, 'girl');
    expect(buildContestSteps('grade-6', contest, 'girl')).toEqual(a);
    const b = buildContestSteps('grade-6', { ...contest, seed: 999 }, 'girl');
    expect(b.map((s) => s.questionEn + JSON.stringify(s.options))).not.toEqual(
      a.map((s) => s.questionEn + JSON.stringify(s.options))
    );
  });

  it('gives sentence magnets with all the words of the target sentence', () => {
    for (const step of buildContestSteps('grade-9', contest, 'boy').filter((s) => s.kind === 'sentence')) {
      expect(step.scrambledWords!.length).toBeGreaterThan(1);
      expect(step.targetSentenceEn).toBeTruthy();
    }
  });
});

describe('getContestState', () => {
  it('lets the creator play right away and asks the invitee to answer', () => {
    const contest = makeContest();
    expect(getContestState(contest, ME, NOW)).toBe('ready');
    expect(getContestState(contest, FRIEND, NOW)).toBe('invited-me');
    expect(getContestState({ ...contest, status: 'accepted' }, FRIEND, NOW)).toBe('ready');
  });

  it('waits for the friend after playing', () => {
    expect(getContestState(makeContest({ results: { [ME]: result(6, 50_000) } }), ME, NOW)).toBe('waiting');
  });

  it('decides by score, then by the faster time', () => {
    const contest = makeContest({ status: 'accepted', results: { [ME]: result(7, 60_000), [FRIEND]: result(6, 30_000) } });
    expect(getContestState(contest, ME, NOW)).toBe('won');
    expect(getContestState(contest, FRIEND, NOW)).toBe('lost');
    const sameScore = makeContest({ status: 'accepted', results: { [ME]: result(6, 61_000), [FRIEND]: result(6, 60_000) } });
    expect(getContestState(sameScore, ME, NOW)).toBe('lost');
    expect(getContestState(sameScore, FRIEND, NOW)).toBe('won');
    const tie = makeContest({ status: 'accepted', results: { [ME]: result(6, 60_000), [FRIEND]: result(6, 60_000) } });
    expect(getContestState(tie, ME, NOW)).toBe('tie');
  });

  it('compares scores as percentages when the question counts differ', () => {
    const contest = makeContest({
      status: 'accepted',
      results: { [ME]: result(7, 60_000, 7), [FRIEND]: result(7, 30_000, 8) },
    });
    expect(getContestState(contest, ME, NOW)).toBe('won');
  });

  it('ends at midnight', () => {
    const played = makeContest({ results: { [ME]: result(5, 40_000) } });
    expect(getContestState(played, ME, TOMORROW)).toBe('friend-missed');
    expect(getContestState(played, FRIEND, TOMORROW)).toBe('missed');
    expect(getContestState(makeContest(), ME, TOMORROW)).toBe('missed');
  });

  it('ends when the invitee declines', () => {
    const declined = makeContest({ status: 'declined' });
    expect(getContestState(declined, FRIEND, NOW)).toBe('declined');
    expect(getContestState({ ...declined, results: { [ME]: result(5, 40_000) } }, ME, NOW)).toBe('friend-missed');
  });
});

describe('applyContestFinish', () => {
  it('counts as a mission and gives XP for the first contests of the day', () => {
    const { profile, xpEarned, isFullReward } = applyContestFinish(baseProfile, NOW);
    expect(isFullReward).toBe(true);
    expect(xpEarned).toBe(CONTEST_FINISH_XP);
    expect(profile.stats.xp).toBe(CONTEST_FINISH_XP);
    expect(profile.dailyCounters.missionsCompletedToday).toBe(1);
    expect(profile.stats.streakDays).toBe(baseProfile.stats.streakDays + 1);
    expect(profile.friendsHub?.contestFinishDay).toEqual({ dateStr: '2026-10-17', count: 1 });
    expect(profile.friendsHub?.isEnabled).toBe(true);
  });

  it('gives only a little XP after the daily limit, and resets the next day', () => {
    let profile = baseProfile;
    for (let i = 0; i < CONTEST_DAILY_REWARD_LIMIT; i++) profile = applyContestFinish(profile, NOW).profile;
    const extra = applyContestFinish(profile, LATER);
    expect(extra.isFullReward).toBe(false);
    expect(extra.xpEarned).toBe(CONTEST_REPEAT_XP);
    expect(extra.profile.dailyCounters.missionsCompletedToday).toBe(CONTEST_DAILY_REWARD_LIMIT);
    expect(applyContestFinish(profile, TOMORROW).isFullReward).toBe(true);
  });
});

describe('applyContestOutcome', () => {
  const won = makeContest({ status: 'accepted', results: { [ME]: result(7, 60_000), [FRIEND]: result(6, 30_000) } });

  it('gives the winner and the other player their diamonds and records the contest', () => {
    const winner = applyContestOutcome(baseProfile, won, ME, NOW);
    expect(winner.stats.diamonds).toBe(baseProfile.stats.diamonds + CONTEST_WIN_DIAMONDS);
    expect(winner.friendsHub?.contestHistory?.[0]).toMatchObject({
      contestId: won.id,
      friendUid: FRIEND,
      friendName: 'Dana',
      myScorePercent: 88,
      theirScorePercent: 75,
      outcome: 'won',
      diamondsEarned: CONTEST_WIN_DIAMONDS,
    });
    const other = applyContestOutcome(baseProfile, won, FRIEND, NOW);
    expect(other.stats.diamonds).toBe(baseProfile.stats.diamonds + CONTEST_PARTICIPATION_DIAMONDS);
    expect(other.friendsHub?.contestHistory?.[0].friendName).toBe('Noa');
  });

  it('rewards a contest only once', () => {
    const once = applyContestOutcome(baseProfile, won, ME, NOW);
    expect(applyContestOutcome(once, won, ME, LATER)).toBe(once);
  });

  it('gives only participation diamonds when the friend never played', () => {
    const missed = makeContest({ results: { [ME]: result(8, 30_000) } });
    const profile = applyContestOutcome(baseProfile, missed, ME, TOMORROW);
    expect(profile.stats.diamonds).toBe(baseProfile.stats.diamonds + CONTEST_PARTICIPATION_DIAMONDS);
    expect(profile.friendsHub?.contestHistory?.[0].outcome).toBe('friend-missed');
  });

  it('does nothing before the contest is decided or for a player who did not play', () => {
    const waiting = makeContest({ results: { [ME]: result(6, 30_000) } });
    expect(applyContestOutcome(baseProfile, waiting, ME, NOW)).toBe(baseProfile);
    expect(applyContestOutcome(baseProfile, waiting, FRIEND, TOMORROW)).toBe(baseProfile);
  });

  it('gives diamonds for only a few contests per day', () => {
    const contests = Array.from({ length: CONTEST_DAILY_REWARD_LIMIT + 2 }, (_, i) =>
      makeContest({
        id: `contest-${i}`,
        createdAt: `2026-10-17T0${i}:00:00.000Z`,
        status: 'accepted',
        results: { [ME]: result(7, 60_000), [FRIEND]: result(6, 30_000) },
      })
    );
    const profile = applyDecidedContests(baseProfile, contests, ME, NOW);
    expect(profile.friendsHub?.contestHistory).toHaveLength(contests.length);
    expect(profile.stats.diamonds).toBe(baseProfile.stats.diamonds + CONTEST_DAILY_REWARD_LIMIT * CONTEST_WIN_DIAMONDS);
  });
});

describe('getRecordAgainst and findTodaysContest', () => {
  it('counts wins, losses and ties against one friend', () => {
    const lost = makeContest({ id: 'c2', status: 'accepted', results: { [ME]: result(5, 60_000), [FRIEND]: result(6, 30_000) } });
    const won = makeContest({ id: 'c1', status: 'accepted', results: { [ME]: result(7, 60_000), [FRIEND]: result(6, 30_000) } });
    const profile = applyDecidedContests(baseProfile, [won, lost], ME, NOW);
    expect(getRecordAgainst(profile.friendsHub?.contestHistory, FRIEND)).toEqual({ wins: 1, losses: 1, ties: 0 });
    expect(getRecordAgainst(profile.friendsHub?.contestHistory, 'someone-else')).toEqual({ wins: 0, losses: 0, ties: 0 });
  });

  it("finds today's contest with a friend", () => {
    const contest = makeContest();
    expect(findTodaysContest([contest], FRIEND, ME, LATER)).toBe(contest);
    expect(findTodaysContest([contest], ME, FRIEND, TOMORROW)).toBeUndefined();
  });
});

describe('review fixes', () => {
  const decided = (i: number, dayOffset: number): ContestDoc => {
    const day = new Date(2026, 9, 17 - dayOffset, 10, 0);
    return {
      ...createContest({ uid: ME, displayName: 'Noa' }, { uid: `f${i}`, displayName: `F${i}` }, day, sequence(0.42, 0.3)),
      status: 'accepted',
      results: {
        [ME]: { correctCount: 7, totalCount: 8, timeMs: 60_000, finishedAt: day.toISOString() },
        [`f${i}`]: { correctCount: 6, totalCount: 8, timeMs: 30_000, finishedAt: day.toISOString() },
      },
    };
  };

  it('records many decided contests once and then leaves the profile unchanged', () => {
    // Every friend, every day of the lookback window
    const contests = Array.from({ length: MAX_FRIENDS }, (_, i) =>
      Array.from({ length: CONTEST_LOOKBACK_DAYS }, (_, d) => decided(i, d))
    ).flat();
    const once = applyDecidedContests(baseProfile, contests, ME, NOW);
    expect(once.friendsHub?.contestHistory).toHaveLength(contests.length);
    expect(applyDecidedContests(once, contests, ME, LATER)).toBe(once);
    expect(MAX_CONTEST_HISTORY).toBeGreaterThanOrEqual(contests.length);
  });

  it('drops records older than the history window', () => {
    const old = applyContestOutcome(baseProfile, decided(1, CONTEST_HISTORY_DAYS + 2), ME, NOW);
    expect(old.friendsHub?.contestHistory).toEqual([]);
    expect(keepRecentRecords(applyContestOutcome(baseProfile, decided(1, 1), ME, NOW).friendsHub!.contestHistory!, NOW)).toHaveLength(1);
  });

  it('waits for the server to confirm a result before recording the contest', () => {
    const pending = { ...decided(1, 0), hasPendingWrites: true };
    expect(applyContestOutcome(baseProfile, pending, ME, NOW)).toBe(baseProfile);
  });

  it('ignores a result finished after midnight', () => {
    const contest = makeContest({
      status: 'accepted',
      results: {
        [ME]: result(7, 60_000),
        [FRIEND]: { ...result(8, 30_000), finishedAt: TOMORROW.toISOString() },
      },
    });
    expect(getContestState(contest, ME, TOMORROW)).toBe('friend-missed');
  });

  it('never reports a time faster than the rules allow', () => {
    expect(scoreContestAnswers([true, false, true, true, true], 500, NOW).timeMs).toBe(CONTEST_MIN_TIME_MS);
    expect(scoreContestAnswers([true, false, true, true, true], 42_400.4, NOW)).toMatchObject({
      correctCount: 4,
      totalCount: 5,
      timeMs: 42_400,
    });
  });
});
