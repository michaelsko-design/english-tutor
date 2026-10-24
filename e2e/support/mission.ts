import { Locator, Page } from '@playwright/test';
import { CURRICULUM_BY_GRADE } from '../../src/test/curriculum';
import { expect } from './test';

/** The step's done button, or the last step's finish button */
export const NEXT_STEP = /לשלב הבא|סיום משימה/;
/** A mission has 5 steps; more rounds than this means the loop is stuck */
export const MAX_ROUNDS = 12;

/** The open mission */
export function missionDialog(page: Page): Locator {
  return page.getByRole('dialog', { name: /^משימה:/ });
}

/** The answer buttons of a multiple-choice step (each beside its own 🔊 button) */
export function answerOptions(mission: Locator): Locator {
  return mission.locator('button[dir="auto"]');
}

/** The voice step's "I can't talk now" link */
export function skipVoiceButton(mission: Locator): Locator {
  return mission.getByRole('button', { name: /אני במקום שקט/ });
}

/**
 * Answers the step on screen without knowing the answer (the options are shuffled in the
 * browser): the voice step is skipped, and the options are tried in turn until one is right.
 */
export async function answerStep(page: Page, mission: Locator): Promise<void> {
  const skipVoice = skipVoiceButton(mission);
  if (await skipVoice.isVisible()) {
    await skipVoice.click();
    return;
  }
  const options = answerOptions(mission);
  const count = await options.count();
  for (let idx = 0; idx < count; idx++) {
    await options.nth(idx).click();
    const nextButton = page.getByRole('button', { name: NEXT_STEP });
    const tryAgain = page.getByRole('button', { name: /נס(י|ה) שוב/ });
    await expect(nextButton.or(tryAgain)).toBeVisible();
    if (await nextButton.isVisible()) return;
    await tryAgain.click();
  }
  throw new Error('no option was right');
}

/**
 * The control is fully inside the viewport without scrolling to it. Polled, so a sheet that is
 * still sliding in settles first; one that stays below the fold fails.
 */
export async function expectOnScreen(page: Page, control: Locator, what: string): Promise<void> {
  await expect(control, what).toBeVisible();
  const viewport = page.viewportSize();
  if (!viewport) throw new Error('no viewport');
  const readEdges = async () => {
    const box = await control.boundingBox();
    return box ? { top: Math.round(box.y), bottom: Math.round(box.y + box.height) } : null;
  };
  await expect
    .poll(async () => (await readEdges())?.top ?? -1, { message: `${what}: top edge` })
    .toBeGreaterThanOrEqual(0);
  await expect
    .poll(async () => (await readEdges())?.bottom ?? Infinity, {
      message: `${what}: bottom edge (screen height ${viewport.height})`,
    })
    .toBeLessThanOrEqual(viewport.height);
}

/** A sentence's words as the sentence builder's chips show them (missionExercises / elementaryExercises) */
function toSentenceWords(sentenceEn: string): string[] {
  return sentenceEn.replace(/[.!?",]/g, '').split(/\s+/).filter(Boolean);
}

/** Every string in the curriculum data (sample sentences, examples, vocabulary...) */
function collectStrings(value: unknown, found: string[] = []): string[] {
  if (typeof value === 'string') found.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, found));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => collectStrings(item, found));
  return found;
}

/** Sorted word list → the curriculum sentence with exactly those words */
const SENTENCE_BY_WORDS = new Map(
  collectStrings(CURRICULUM_BY_GRADE).map((text) => {
    const words = toSentenceWords(text);
    return [[...words].sort().join(' '), words] as const;
  })
);

/**
 * Builds the sentence-builder step's sentence: finds the curriculum sentence made of exactly the
 * word chips on screen, then taps the chips in that sentence's order.
 */
export async function buildSentence(mission: Locator): Promise<void> {
  const bank = mission.getByLabel('בנק המילים');
  const chips = await bank.getByRole('button').allTextContents();
  const chipKey = chips.map((word) => word.trim()).sort().join(' ');
  const answer = SENTENCE_BY_WORDS.get(chipKey);
  if (!answer) throw new Error(`no curriculum sentence has the words: ${chipKey}`);
  for (const word of answer) {
    await bank.getByRole('button', { name: word, exact: true, disabled: false }).first().click();
  }
}
