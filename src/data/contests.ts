import { ContestOutcome, ContestRecord, LearnerGender, LearnerProfile } from '../types/learner';
import { GradeCurriculumPack, isPhonicsUnit, MissionNode, VocabularyItem } from './curriculum';
import { MissionExerciseStep, getExercisesForMission } from './missionExercises';
import { toLocalDateStr } from './examPrep';
import { levelForXp } from './progressRewards';
import { grantDailyActivityReward } from './roomActivities';
import { MAX_FRIENDS, getPairId } from './friends';
import { inflectHebrew } from '../utils/hebrewGender';
import { seededShuffle } from '../utils/shuffle';

/**
 * Feature 19: daily contests between two friends. Each player gets questions from their own
 * grade, with the same relative difficulty: the same unit number, the same tier and the same
 * number of meaning-match and sentence-magnet questions, seeded by the contest so a reload
 * shows the same questions. The higher score wins and the faster time breaks a tie.
 */

export const CONTEST_MEANING_COUNT = 5;
export const CONTEST_OPTION_COUNT = 4;
/** Both players play at the same tier, whatever tier each one usually picks */
export const CONTEST_TIER = 'challenger';
export const CONTEST_UNIT_COUNT = 4;
export const CONTEST_FINISH_XP = 10;
export const CONTEST_REPEAT_XP = 2;
export const CONTEST_WIN_DIAMONDS = 10;
export const CONTEST_PARTICIPATION_DIAMONDS = 3;
/** Contests per day that earn the finishing reward, and contests per day that earn diamonds */
export const CONTEST_DAILY_REWARD_LIMIT = 3;
/** How far back the hub looks for contests to decide and reward */
export const CONTEST_LOOKBACK_DAYS = 7;
/** Records are kept for the record vs. each friend; older ones are dropped */
export const CONTEST_HISTORY_DAYS = 30;
/**
 * Enough for every contest the hub can still see (one per friend per day in the lookback window),
 * so a record is never dropped while its contest could be recorded again.
 */
export const MAX_CONTEST_HISTORY = MAX_FRIENDS * (CONTEST_LOOKBACK_DAYS + 1) + 60;
/** The rules reject faster results */
export const CONTEST_MIN_TIME_MS = 3000;

export type ContestStatus = 'invited' | 'accepted' | 'declined';

export interface ContestResult {
  correctCount: number;
  totalCount: number;
  timeMs: number;
  finishedAt: string;
}

/** A `contests/{pairId}_{dateStr}` document. */
export interface ContestDoc {
  id: string;
  /** [creator, invitee] */
  uids: string[];
  createdBy: string;
  creatorName: string;
  inviteeName: string;
  /** The creator's local date; one contest per pair per day */
  dateStr: string;
  /** The creator's local midnight at the end of dateStr */
  expiresAtMs: number;
  seed: number;
  unitNumber: number;
  status: ContestStatus;
  results?: Record<string, ContestResult>;
  createdAt: string;
  /** Client only: a local write the server hasn't confirmed yet */
  hasPendingWrites?: boolean;
}

export type ContestStep = MissionExerciseStep & { kind: 'meaning' | 'sentence' };

/** Where a contest stands for one of its players. */
export type ContestState =
  /** The friend invited me and I haven't answered */
  | 'invited-me'
  /** I can play now */
  | 'ready'
  /** I played, the friend still can */
  | 'waiting'
  | ContestOutcome
  /** The day ended before I played */
  | 'missed'
  /** The invitee declined before I played */
  | 'declined';

export function getContestId(myUid: string, friendUid: string, dateStr: string): string {
  return `${getPairId(myUid, friendUid)}_${dateStr}`;
}

/** The local midnight that ends `now`'s day. */
export function getContestExpiry(now: Date): number {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
}

/** A new contest for today; `random` returns [0, 1) like Math.random. */
export function createContest(
  me: { uid: string; displayName: string },
  friend: { uid: string; displayName: string },
  now: Date,
  random: () => number = Math.random
): ContestDoc {
  const dateStr = toLocalDateStr(now);
  return {
    id: getContestId(me.uid, friend.uid, dateStr),
    uids: [me.uid, friend.uid],
    createdBy: me.uid,
    creatorName: me.displayName,
    inviteeName: friend.displayName,
    dateStr,
    expiresAtMs: getContestExpiry(now),
    seed: Math.floor(random() * 1_000_000_000),
    unitNumber: 1 + Math.floor(random() * CONTEST_UNIT_COUNT),
    status: 'invited',
    createdAt: now.toISOString(),
  };
}

function uniqueByWord(words: VocabularyItem[]): VocabularyItem[] {
  const seen = new Set<string>();
  return words.filter((w) => {
    const key = w.wordEn.toLowerCase();
    if (seen.has(key) || !w.translationHe) return false;
    seen.add(key);
    return true;
  });
}

function buildMeaningStep(
  word: VocabularyItem,
  gradeWords: VocabularyItem[],
  seed: number,
  index: number,
  gender: LearnerGender
): ContestStep {
  const wrong = seededShuffle(
    Array.from(new Set(gradeWords.map((w) => w.translationHe).filter((t) => t !== word.translationHe))),
    `${seed}|${word.wordEn}|wrong`
  ).slice(0, CONTEST_OPTION_COUNT - 1);
  const options = seededShuffle(
    [
      { textEn: word.translationHe, isCorrect: true, explanationHe: `נכון! ${word.wordEn} = ${word.translationHe}` },
      ...wrong.map((t) => ({ textEn: t, isCorrect: false, explanationHe: `לא נכון. ${word.wordEn} = ${word.translationHe}` })),
    ],
    `${seed}|${word.wordEn}|options`
  );
  return {
    id: `contest-meaning-${index}`,
    stepNumber: index + 1,
    type: 'chat-reply',
    kind: 'meaning',
    badgeLabelHe: '🔤 פירוש מילה',
    promptHe: inflectHebrew('מה המשמעות של המילה?', gender),
    hintHe: '',
    questionEn: word.wordEn,
    options,
  };
}

/** The sentence-magnet step of a mission, at the contest tier and seed. */
function buildSentenceStep(mission: MissionNode, seed: number, index: number, gender: LearnerGender): ContestStep | null {
  const step = getExercisesForMission(mission, CONTEST_TIER, gender, seed).find((s) => s.type === 'sentence-builder');
  if (!step || !step.scrambledWords?.length) return null;
  return { ...step, id: `contest-sentence-${index}`, kind: 'sentence', badgeLabelHe: '🧩 בניית משפט' };
}

/**
 * The learner's contest questions, from their own grade: meaning matches for words of the contest
 * unit, then one sentence magnet per mission of that unit.
 */
export function buildContestSteps(
  gradePack: GradeCurriculumPack | undefined,
  contest: Pick<ContestDoc, 'seed' | 'unitNumber'>,
  gender: LearnerGender
): ContestStep[] {
  // Grade 1's letters and blending units have no sentences, so a contest unit N is the grade's Nth
  // unit with sentence missions (the same unit number for every other grade)
  const units = (gradePack?.units || []).filter((u) => !isPhonicsUnit(u));
  const unit = units[contest.unitNumber - 1] || units[0];
  if (!unit) return [];
  const gradeWords = uniqueByWord(units.flatMap((u) => u.missions.flatMap((m) => m.vocabulary)));
  const unitWords = uniqueByWord(unit.missions.flatMap((m) => m.vocabulary));
  // A unit with too few words borrows from the rest of the grade
  const pool = unitWords.length >= CONTEST_MEANING_COUNT
    ? unitWords
    : [...unitWords, ...gradeWords.filter((w) => !unitWords.includes(w))];
  const words = seededShuffle(pool, `${contest.seed}|words`).slice(0, CONTEST_MEANING_COUNT);
  const meaning = words.map((w, i) => buildMeaningStep(w, gradeWords, contest.seed, i, gender));
  const sentences = unit.missions
    .map((m, i) => buildSentenceStep(m, contest.seed, meaning.length + i, gender))
    .filter((s): s is ContestStep => s !== null);
  return [...meaning, ...sentences];
}

export function scoreContestAnswers(answers: boolean[], timeMs: number, now: Date): ContestResult {
  return {
    correctCount: answers.filter(Boolean).length,
    totalCount: answers.length,
    timeMs: Math.max(CONTEST_MIN_TIME_MS, Math.round(timeMs)),
    finishedAt: now.toISOString(),
  };
}

export function getScorePercent(result: ContestResult): number {
  return result.totalCount > 0 ? Math.round((result.correctCount / result.totalCount) * 100) : 0;
}

export function getFriendUid(contest: ContestDoc, myUid: string): string {
  return contest.uids.find((uid) => uid !== myUid) || '';
}

function compareResults(mine: ContestResult, theirs: ContestResult): ContestOutcome {
  const scoreDiff = getScorePercent(mine) - getScorePercent(theirs);
  if (scoreDiff !== 0) return scoreDiff > 0 ? 'won' : 'lost';
  if (mine.timeMs !== theirs.timeMs) return mine.timeMs < theirs.timeMs ? 'won' : 'lost';
  return 'tie';
}

/** A player's result, unless it was finished after the contest ended (the server rejects those). */
function getValidResult(contest: ContestDoc, uid: string): ContestResult | undefined {
  const result = contest.results?.[uid];
  return result && Date.parse(result.finishedAt) < contest.expiresAtMs ? result : undefined;
}

export function getContestState(contest: ContestDoc, myUid: string, now: Date): ContestState {
  const mine = getValidResult(contest, myUid);
  const theirs = getValidResult(contest, getFriendUid(contest, myUid));
  if (mine && theirs) return compareResults(mine, theirs);
  const isOver = now.getTime() >= contest.expiresAtMs || contest.status === 'declined';
  if (mine) return isOver ? 'friend-missed' : 'waiting';
  if (contest.status === 'declined') return 'declined';
  if (isOver) return 'missed';
  if (contest.status === 'invited' && contest.createdBy !== myUid) return 'invited-me';
  return 'ready';
}

export function isContestDecided(state: ContestState): state is ContestOutcome {
  return state === 'won' || state === 'lost' || state === 'tie' || state === 'friend-missed';
}

/** A tie is friendly: both players get the winner's diamonds. */
export function getOutcomeDiamonds(outcome: ContestOutcome): number {
  return outcome === 'won' || outcome === 'tie' ? CONTEST_WIN_DIAMONDS : CONTEST_PARTICIPATION_DIAMONDS;
}

export interface ContestFinishReward {
  profile: LearnerProfile;
  xpEarned: number;
  isFullReward: boolean;
}

/**
 * Finishing a contest counts as a mission for the daily quests and streak and gives XP, for the
 * first few contests of the day; later ones give a little XP.
 */
export function applyContestFinish(profile: LearnerProfile, now: Date): ContestFinishReward {
  const today = toLocalDateStr(now);
  const hub = profile.friendsHub || { isEnabled: true, updatedAt: new Date(0).toISOString() };
  const countToday = hub.contestFinishDay?.dateStr === today ? hub.contestFinishDay.count : 0;
  if (countToday >= CONTEST_DAILY_REWARD_LIMIT) {
    const xp = profile.stats.xp + CONTEST_REPEAT_XP;
    return {
      profile: { ...profile, stats: { ...profile.stats, xp, level: levelForXp(xp, profile.stats.level) } },
      xpEarned: CONTEST_REPEAT_XP,
      isFullReward: false,
    };
  }
  const rewarded = grantDailyActivityReward(profile, { xp: CONTEST_FINISH_XP, diamonds: 0, voiceWords: 0 }, now);
  return {
    profile: { ...rewarded, friendsHub: { ...hub, contestFinishDay: { dateStr: today, count: countToday + 1 } } },
    xpEarned: CONTEST_FINISH_XP,
    isFullReward: true,
  };
}

/**
 * Records a decided contest once and gives its diamonds, for up to the daily limit of contests
 * per contest day. Returns the same profile when it was already recorded or isn't decided yet.
 */
export function applyContestOutcome(profile: LearnerProfile, contest: ContestDoc, myUid: string, now: Date): LearnerProfile {
  if (contest.hasPendingWrites) return profile;
  const state = getContestState(contest, myUid, now);
  const mine = getValidResult(contest, myUid);
  if (!isContestDecided(state) || !mine) return profile;
  const hub = profile.friendsHub || { isEnabled: true, updatedAt: new Date(0).toISOString() };
  const history = hub.contestHistory || [];
  if (history.some((r) => r.contestId === contest.id)) return profile;

  const paidThatDay = history.filter((r) => r.dateStr === contest.dateStr && r.diamondsEarned > 0).length;
  const diamondsEarned = paidThatDay < CONTEST_DAILY_REWARD_LIMIT ? getOutcomeDiamonds(state) : 0;
  const friendUid = getFriendUid(contest, myUid);
  const theirs = getValidResult(contest, friendUid);
  const record: ContestRecord = {
    contestId: contest.id,
    friendUid,
    friendName: contest.createdBy === myUid ? contest.inviteeName : contest.creatorName,
    dateStr: contest.dateStr,
    myScorePercent: getScorePercent(mine),
    ...(theirs ? { theirScorePercent: getScorePercent(theirs) } : {}),
    outcome: state,
    diamondsEarned,
    recordedAt: now.toISOString(),
  };
  return {
    ...profile,
    stats: { ...profile.stats, diamonds: profile.stats.diamonds + diamondsEarned },
    friendsHub: { ...hub, contestHistory: keepRecentRecords([record, ...history], now) },
  };
}

/** Drops records older than CONTEST_HISTORY_DAYS and keeps at most MAX_CONTEST_HISTORY, newest first. */
export function keepRecentRecords(records: ContestRecord[], now: Date): ContestRecord[] {
  const oldest = toLocalDateStr(new Date(now.getFullYear(), now.getMonth(), now.getDate() - CONTEST_HISTORY_DAYS, 12));
  return records.filter((r) => r.dateStr >= oldest).slice(0, MAX_CONTEST_HISTORY);
}

/** Records every decided contest that isn't recorded yet. */
export function applyDecidedContests(
  profile: LearnerProfile,
  contests: ContestDoc[],
  myUid: string,
  now: Date
): LearnerProfile {
  return [...contests]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .reduce((current, contest) => applyContestOutcome(current, contest, myUid, now), profile);
}

export function getRecordAgainst(history: ContestRecord[] | undefined, friendUid: string): { wins: number; losses: number; ties: number } {
  const games = (history || []).filter((r) => r.friendUid === friendUid);
  return {
    wins: games.filter((r) => r.outcome === 'won').length,
    losses: games.filter((r) => r.outcome === 'lost').length,
    ties: games.filter((r) => r.outcome === 'tie').length,
  };
}

/** Today's contest with a friend, if one was created. */
export function findTodaysContest(contests: ContestDoc[], myUid: string, friendUid: string, now: Date): ContestDoc | undefined {
  return contests.find((c) => c.id === getContestId(myUid, friendUid, toLocalDateStr(now)));
}

export function getContestLookbackDateStr(now: Date): string {
  return toLocalDateStr(new Date(now.getFullYear(), now.getMonth(), now.getDate() - CONTEST_LOOKBACK_DAYS, 12));
}
