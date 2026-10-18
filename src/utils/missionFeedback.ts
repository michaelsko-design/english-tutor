/**
 * Mission runner feedback (Feature 25): the trail progress bar, the combo flame, the "+XP"
 * that floats off the feedback sheet and the companion's pose. Presentation only; the rewards
 * are still worked out once at the end of the mission.
 */
import { CompanionPose } from '../themes/themeArt';

/** Each step of the best first-try streak adds this much XP at the end of the mission. */
export const COMBO_BONUS_XP_PER_STEP = 5;

export type TrailSegmentState = 'done' | 'current' | 'todo';

/** One segment per step: done once its step is answered, the step being answered is current. */
export function getTrailSegments(
  stepCount: number,
  currentStepIdx: number,
  isCurrentStepCompleted: boolean
): TrailSegmentState[] {
  return Array.from({ length: stepCount }, (_, idx) => {
    if (idx < currentStepIdx) return 'done';
    if (idx === currentStepIdx) return isCurrentStepCompleted ? 'done' : 'current';
    return 'todo';
  });
}

/** 0 = no flame (combo below 2), 1 = small, 2 = bigger from 3x, 3 = biggest from 5x. */
export type ComboFlameLevel = 0 | 1 | 2 | 3;

export function getComboFlameLevel(combo: number): ComboFlameLevel {
  if (combo >= 5) return 3;
  if (combo >= 3) return 2;
  if (combo >= 2) return 1;
  return 0;
}

/**
 * The XP a correct answer adds to the end-of-mission total. The tier-scaled base XP is spread
 * over the steps so the shares add up to it exactly, plus the combo bonus when the answer
 * lengthens the best streak. Summed over a mission, the floats equal the victory screen's XP.
 */
export function getStepXpGain(input: {
  baseXpTotal: number;
  stepCount: number;
  stepIdx: number;
  newCombo: number;
  previousMaxCombo: number;
}): number {
  const { baseXpTotal, stepCount, stepIdx, newCombo, previousMaxCombo } = input;
  if (stepCount <= 0) return 0;
  const shareOf = (count: number) => Math.floor((count * baseXpTotal) / stepCount);
  const baseShare = shareOf(stepIdx + 1) - shareOf(stepIdx);
  const comboGain = Math.max(0, newCombo - previousMaxCombo) * COMBO_BONUS_XP_PER_STEP;
  return baseShare + comboGain;
}

/**
 * The companion peeking over the question card thinks while the hint is open and idles
 * otherwise. While the feedback sheet is open it ducks out of sight (null): the sheet's own
 * companion cheers or says oops, so only one companion reacts at a time.
 */
export function getPeekCompanionPose(isHintOpen: boolean, isFeedbackOpen: boolean): CompanionPose | null {
  if (isFeedbackOpen) return null;
  return isHintOpen ? 'think' : 'idle';
}
