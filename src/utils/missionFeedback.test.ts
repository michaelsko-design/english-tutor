import { describe, expect, it } from 'vitest';
import {
  COMBO_BONUS_XP_PER_STEP,
  getComboFlameLevel,
  getPeekCompanionPose,
  getStepXpGain,
  getTrailSegments,
} from './missionFeedback';

describe('getTrailSegments', () => {
  it('marks earlier steps done, the open step current and later steps to do', () => {
    expect(getTrailSegments(5, 2, false)).toEqual(['done', 'done', 'current', 'todo', 'todo']);
  });

  it('turns the current step done once it is answered', () => {
    expect(getTrailSegments(5, 4, true)).toEqual(['done', 'done', 'done', 'done', 'done']);
  });

  it('starts with only the first step current', () => {
    expect(getTrailSegments(3, 0, false)).toEqual(['current', 'todo', 'todo']);
  });
});

describe('getComboFlameLevel', () => {
  it('shows no flame below a 2x combo', () => {
    expect(getComboFlameLevel(0)).toBe(0);
    expect(getComboFlameLevel(1)).toBe(0);
  });

  it('grows at 3x and again at 5x', () => {
    expect(getComboFlameLevel(2)).toBe(1);
    expect(getComboFlameLevel(3)).toBe(2);
    expect(getComboFlameLevel(4)).toBe(2);
    expect(getComboFlameLevel(5)).toBe(3);
    expect(getComboFlameLevel(9)).toBe(3);
  });
});

describe('getStepXpGain', () => {
  it('spreads the base XP so the shares add up to it exactly', () => {
    const shares = [0, 1, 2, 3, 4].map((stepIdx) =>
      getStepXpGain({ baseXpTotal: 63, stepCount: 5, stepIdx, newCombo: 0, previousMaxCombo: 5 })
    );
    expect(shares.reduce((sum, xp) => sum + xp, 0)).toBe(63);
    expect(Math.max(...shares) - Math.min(...shares)).toBeLessThanOrEqual(1);
  });

  it('adds the combo bonus only when the best streak grows', () => {
    const base = { baseXpTotal: 50, stepCount: 5, stepIdx: 1 };
    expect(getStepXpGain({ ...base, newCombo: 2, previousMaxCombo: 1 })).toBe(10 + COMBO_BONUS_XP_PER_STEP);
    expect(getStepXpGain({ ...base, newCombo: 1, previousMaxCombo: 2 })).toBe(10);
  });

  it('adds up to the victory total of base XP plus the best combo bonus', () => {
    // First tries: right, right, wrong-then-right, right, right -> combos 1, 2, 1, 2, 3.
    const combos = [1, 2, 1, 2, 3];
    let maxCombo = 0;
    let total = 0;
    combos.forEach((newCombo, stepIdx) => {
      total += getStepXpGain({ baseXpTotal: 90, stepCount: 5, stepIdx, newCombo, previousMaxCombo: maxCombo });
      maxCombo = Math.max(maxCombo, newCombo);
    });
    expect(total).toBe(90 + maxCombo * COMBO_BONUS_XP_PER_STEP);
  });

  it('gives nothing for a mission without steps', () => {
    expect(getStepXpGain({ baseXpTotal: 40, stepCount: 0, stepIdx: 0, newCombo: 1, previousMaxCombo: 0 })).toBe(0);
  });
});

describe('getPeekCompanionPose', () => {
  it('thinks while the hint is open and idles otherwise', () => {
    expect(getPeekCompanionPose(true, false)).toBe('think');
    expect(getPeekCompanionPose(false, false)).toBe('idle');
  });

  it('ducks out of sight while the feedback sheet shows its own companion', () => {
    expect(getPeekCompanionPose(true, true)).toBeNull();
    expect(getPeekCompanionPose(false, true)).toBeNull();
  });
});
