import { XP_PER_LEVEL, levelForXp } from '../data/progressRewards';

/**
 * Pure maths for the reward feedback kit (Feature 24): the XP bar to the next level,
 * count-up numbers, and the staged victory timeline. Presentation only; rewards are
 * computed elsewhere and passed in.
 */

export interface LevelProgress {
  level: number;
  /** XP earned inside the current level (0..XP_PER_LEVEL) */
  xpIntoLevel: number;
  /** XP still needed for the next level */
  xpToNextLevel: number;
  /** Bar fill, 0..1 */
  ratio: number;
}

/**
 * Where the learner stands inside their level. A stored level that is ahead of the XP
 * (the level never drops) shows an empty bar until the XP catches up.
 */
export function getLevelProgress(xp: number, level: number): LevelProgress {
  const currentLevel = levelForXp(xp, level);
  const levelStartXp = (currentLevel - 1) * XP_PER_LEVEL;
  const xpIntoLevel = Math.min(XP_PER_LEVEL, Math.max(0, xp - levelStartXp));
  return {
    level: currentLevel,
    xpIntoLevel,
    xpToNextLevel: currentLevel * XP_PER_LEVEL - xp,
    ratio: xpIntoLevel / XP_PER_LEVEL,
  };
}

/** Linear progress of a phase that starts at `startMs` and lasts `durationMs`, clamped to 0..1. */
export function getPhaseProgress(elapsedMs: number, startMs: number, durationMs: number): number {
  if (elapsedMs < startMs) return 0;
  if (durationMs <= 0) return 1;
  return Math.min(1, (elapsedMs - startMs) / durationMs);
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/** A whole number between `from` and `to`, eased out so the count slows down near the end. */
export function countUpValue(from: number, to: number, progress: number): number {
  const t = Math.min(1, Math.max(0, progress));
  return Math.round(from + (to - from) * easeOutCubic(t));
}

export const VICTORY_TIMING = {
  firstStarMs: 400,
  starGapMs: 400,
  xpStartMs: 1500,
  xpDurationMs: 1100,
  countStartMs: 2600,
  countDurationMs: 700,
  itemRevealMs: 3500,
  /** How long the item card takes to flip in before the sequence counts as done */
  itemRevealDurationMs: 500,
} as const;

const STAR_SLOTS = 3;

export function getVictoryDurationMs(hasRoomItem: boolean): number {
  const t = VICTORY_TIMING;
  return hasRoomItem ? t.itemRevealMs + t.itemRevealDurationMs : t.countStartMs + t.countDurationMs;
}

export interface VictoryInput {
  starsEarned: 1 | 2 | 3;
  startXp: number;
  startLevel: number;
  xpEarned: number;
  diamondsEarned: number;
  wordsLearned: number;
  hasRoomItem: boolean;
}

export interface VictoryFrame {
  /** Star slots that have landed so far (earned and missed), 0..3 */
  landedStarCount: number;
  /** The learner's total XP as the bar fills */
  xp: number;
  /** XP of this mission counted so far */
  xpShown: number;
  level: number;
  levelRatio: number;
  hasLeveledUp: boolean;
  diamondsShown: number;
  wordsShown: number;
  isItemRevealed: boolean;
  isDone: boolean;
}

/** Everything the victory screen shows at `elapsedMs` (Infinity = skipped, the final state). */
export function getVictoryFrame(input: VictoryInput, elapsedMs: number): VictoryFrame {
  const t = VICTORY_TIMING;
  const landedStarCount =
    elapsedMs < t.firstStarMs
      ? 0
      : Math.min(STAR_SLOTS, Math.floor((elapsedMs - t.firstStarMs) / t.starGapMs) + 1);

  const xpShown = countUpValue(0, input.xpEarned, getPhaseProgress(elapsedMs, t.xpStartMs, t.xpDurationMs));
  const xp = input.startXp + xpShown;
  const { level, ratio } = getLevelProgress(xp, input.startLevel);

  const countProgress = getPhaseProgress(elapsedMs, t.countStartMs, t.countDurationMs);

  return {
    landedStarCount,
    xp,
    xpShown,
    level,
    levelRatio: ratio,
    hasLeveledUp: level > input.startLevel,
    diamondsShown: countUpValue(0, input.diamondsEarned, countProgress),
    wordsShown: countUpValue(0, input.wordsLearned, countProgress),
    isItemRevealed: input.hasRoomItem && elapsedMs >= t.itemRevealMs,
    isDone: elapsedMs >= getVictoryDurationMs(input.hasRoomItem),
  };
}
