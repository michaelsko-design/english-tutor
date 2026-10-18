import { describe, expect, it } from 'vitest';
import {
  VICTORY_TIMING,
  VictoryInput,
  countUpValue,
  getLevelProgress,
  getPhaseProgress,
  getVictoryDurationMs,
  getVictoryFrame,
} from './rewardFeedback';

describe('getLevelProgress', () => {
  it('starts level 1 at an empty bar', () => {
    expect(getLevelProgress(0, 1)).toEqual({ level: 1, xpIntoLevel: 0, xpToNextLevel: 150, ratio: 0 });
  });

  it('measures the XP inside the current level', () => {
    const progress = getLevelProgress(195, 2);
    expect(progress.level).toBe(2);
    expect(progress.xpIntoLevel).toBe(45);
    expect(progress.xpToNextLevel).toBe(105);
    expect(progress.ratio).toBeCloseTo(0.3);
  });

  it('starts a new level at an empty bar exactly on the threshold', () => {
    expect(getLevelProgress(300, 2)).toMatchObject({ level: 3, xpIntoLevel: 0, ratio: 0 });
  });

  it('keeps a stored level that is ahead of the XP and shows an empty bar', () => {
    const progress = getLevelProgress(100, 3);
    expect(progress.level).toBe(3);
    expect(progress.xpIntoLevel).toBe(0);
    expect(progress.xpToNextLevel).toBe(350);
    expect(progress.ratio).toBe(0);
  });
});

describe('getPhaseProgress', () => {
  it('is 0 before the phase, 1 after it and linear in between', () => {
    expect(getPhaseProgress(50, 100, 200)).toBe(0);
    expect(getPhaseProgress(200, 100, 200)).toBe(0.5);
    expect(getPhaseProgress(400, 100, 200)).toBe(1);
  });

  it('treats a zero-length phase as done once it starts', () => {
    expect(getPhaseProgress(99, 100, 0)).toBe(0);
    expect(getPhaseProgress(100, 100, 0)).toBe(1);
  });
});

describe('countUpValue', () => {
  it('returns the start and end values at the edges', () => {
    expect(countUpValue(10, 40, 0)).toBe(10);
    expect(countUpValue(10, 40, 1)).toBe(40);
  });

  it('clamps progress outside 0..1', () => {
    expect(countUpValue(10, 40, -1)).toBe(10);
    expect(countUpValue(10, 40, 2)).toBe(40);
  });

  it('eases out, so the middle is past the linear midpoint, and gives whole numbers', () => {
    const middle = countUpValue(0, 100, 0.5);
    expect(Number.isInteger(middle)).toBe(true);
    expect(middle).toBeGreaterThan(50);
    expect(middle).toBeLessThan(100);
  });

  it('never goes backwards as progress grows', () => {
    let previous = -1;
    for (let step = 0; step <= 20; step++) {
      const value = countUpValue(5, 63, step / 20);
      expect(value).toBeGreaterThanOrEqual(previous);
      previous = value;
    }
  });

  it('counts down when the value drops', () => {
    expect(countUpValue(50, 20, 1)).toBe(20);
    expect(countUpValue(50, 20, 0.5)).toBeLessThan(50);
  });
});

const BASE_INPUT: VictoryInput = {
  starsEarned: 2,
  startXp: 120,
  startLevel: 1,
  xpEarned: 60,
  diamondsEarned: 12,
  wordsLearned: 5,
  hasRoomItem: false,
};

describe('getVictoryFrame', () => {
  it('shows nothing earned yet at the start', () => {
    const frame = getVictoryFrame(BASE_INPUT, 0);
    expect(frame).toMatchObject({
      landedStarCount: 0,
      xp: 120,
      xpShown: 0,
      level: 1,
      hasLeveledUp: false,
      diamondsShown: 0,
      wordsShown: 0,
      isItemRevealed: false,
      isDone: false,
    });
    expect(frame.levelRatio).toBeCloseTo(0.8);
  });

  it('lands the three star slots one by one, missed ones included', () => {
    const { firstStarMs, starGapMs } = VICTORY_TIMING;
    expect(getVictoryFrame(BASE_INPUT, firstStarMs - 1).landedStarCount).toBe(0);
    expect(getVictoryFrame(BASE_INPUT, firstStarMs).landedStarCount).toBe(1);
    expect(getVictoryFrame(BASE_INPUT, firstStarMs + starGapMs).landedStarCount).toBe(2);
    expect(getVictoryFrame(BASE_INPUT, firstStarMs + 2 * starGapMs).landedStarCount).toBe(3);
  });

  it('fills the XP bar after the stars and crosses into the next level', () => {
    const { xpStartMs, xpDurationMs } = VICTORY_TIMING;
    expect(getVictoryFrame(BASE_INPUT, xpStartMs).xp).toBe(120);
    const end = getVictoryFrame(BASE_INPUT, xpStartMs + xpDurationMs);
    expect(end.xp).toBe(180);
    expect(end.xpShown).toBe(60);
    expect(end.level).toBe(2);
    expect(end.hasLeveledUp).toBe(true);
    expect(end.levelRatio).toBeCloseTo(0.2);
  });

  it('does not level up when the bar does not reach the threshold', () => {
    const frame = getVictoryFrame({ ...BASE_INPUT, startXp: 10, xpEarned: 40 }, 99_999);
    expect(frame.level).toBe(1);
    expect(frame.hasLeveledUp).toBe(false);
    expect(frame.levelRatio).toBeCloseTo(50 / 150);
  });

  it('counts the diamonds and words up after the XP bar', () => {
    const { countStartMs, countDurationMs } = VICTORY_TIMING;
    expect(getVictoryFrame(BASE_INPUT, countStartMs - 1).diamondsShown).toBe(0);
    const end = getVictoryFrame(BASE_INPUT, countStartMs + countDurationMs);
    expect(end.diamondsShown).toBe(12);
    expect(end.wordsShown).toBe(5);
  });

  it('reveals the room item last and only when there is one', () => {
    const withItem = { ...BASE_INPUT, starsEarned: 3 as const, hasRoomItem: true };
    expect(getVictoryFrame(withItem, VICTORY_TIMING.itemRevealMs - 1).isItemRevealed).toBe(false);
    expect(getVictoryFrame(withItem, VICTORY_TIMING.itemRevealMs).isItemRevealed).toBe(true);
    expect(getVictoryFrame(BASE_INPUT, 99_999).isItemRevealed).toBe(false);
  });

  it('is done at the total duration, which is longer with a room item', () => {
    const withItem = { ...BASE_INPUT, hasRoomItem: true };
    expect(getVictoryDurationMs(true)).toBeGreaterThan(getVictoryDurationMs(false));
    expect(getVictoryFrame(BASE_INPUT, getVictoryDurationMs(false) - 1).isDone).toBe(false);
    expect(getVictoryFrame(BASE_INPUT, getVictoryDurationMs(false)).isDone).toBe(true);
    expect(getVictoryFrame(withItem, getVictoryDurationMs(true)).isDone).toBe(true);
  });

  it('keeps the whole sequence at about four seconds', () => {
    expect(getVictoryDurationMs(true)).toBeLessThanOrEqual(4200);
  });

  it('shows the final state for a skipped or reduced-motion victory', () => {
    const frame = getVictoryFrame({ ...BASE_INPUT, hasRoomItem: true }, Number.POSITIVE_INFINITY);
    expect(frame).toMatchObject({
      landedStarCount: 3,
      xp: 180,
      level: 2,
      diamondsShown: 12,
      wordsShown: 5,
      isItemRevealed: true,
      isDone: true,
    });
  });
});
