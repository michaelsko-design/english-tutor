import { Locator, Page } from '@playwright/test';
import { CURRICULUM_BY_GRADE } from '../../src/test/curriculum';
import { ALL_PACK_CURRICULA } from '../../src/data/curriculum/packs';
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
    await options.nth(idx).click({ timeout: 10_000 });
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

/** Master's chips: like `toSentenceWords`, but each comma is a chip of its own */
function toSentenceChips(sentenceEn: string): string[] {
  return sentenceEn.replace(/[.!?"]/g, '').replace(/,/g, ' , ').split(/\s+/).filter(Boolean);
}

/** Every string in the curriculum data (sample sentences, examples, vocabulary...) */
function collectStrings(value: unknown, found: string[] = []): string[] {
  if (typeof value === 'string') found.push(value);
  else if (Array.isArray(value)) value.forEach((item) => collectStrings(item, found));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => collectStrings(item, found));
  return found;
}

/**
 * The app's curriculum, then every unreleased pack's (the packs preview plays them; a pack string
 * never replaces an app string with the same words)
 */
const CURRICULUM_STRINGS = [...collectStrings(ALL_PACK_CURRICULA), ...collectStrings(CURRICULUM_BY_GRADE)];

/** Sorted word list → the curriculum sentence with exactly those words */
const SENTENCE_BY_WORDS = new Map(
  CURRICULUM_STRINGS.map((text) => {
    const words = toSentenceWords(text);
    return [[...words].sort().join(' '), words] as const;
  })
);

/** Sorted letters → the curriculum words spelled with exactly those letters */
const WORDS_BY_LETTERS = new Map<string, string[]>();
for (const text of CURRICULUM_STRINGS) {
  if (!/^[A-Za-z]{2,}$/.test(text)) continue;
  const key = text.toLowerCase().split('').sort().join('');
  const known = WORDS_BY_LETTERS.get(key) ?? [];
  if (!known.includes(text.toLowerCase())) WORDS_BY_LETTERS.set(key, [...known, text.toLowerCase()]);
}

/** The words made of exactly these letters (anagrams are rare, so usually one) */
export function wordsFromLetters(letters: string[]): string[] {
  return WORDS_BY_LETTERS.get(letters.map((letter) => letter.toLowerCase()).sort().join('')) ?? [];
}

/** Master's word-spell step: the letters on offer, then the word built from them */
export async function spellWord(page: Page, mission: Locator): Promise<void> {
  const tiles = mission.getByLabel('האותיות');
  const letters = (await tiles.getByRole('button').evaluateAll((buttons) =>
    buttons.map((button) => (button.getAttribute('aria-label') ?? '').replace('letter ', ''))
  )) as string[];
  const candidates = wordsFromLetters(letters);
  if (candidates.length === 0) throw new Error(`no curriculum word has the letters: ${letters.join('')}`);
  const check = mission.getByRole('button', { name: /בדיקת איות/ });
  const tryAgain = page.getByRole('button', { name: /נס(י|ה) שוב/ });
  const next = page.getByRole('button', { name: NEXT_STEP });
  for (const word of candidates) {
    for (const letter of word) {
      await tiles.getByRole('button', { name: `letter ${letter}`, disabled: false }).first().click();
    }
    await check.click();
    await expect(next.or(tryAgain)).toBeVisible();
    if (await next.isVisible()) return;
    await tryAgain.click();
    await mission.getByRole('button', { name: /איפוס אותיות/ }).click();
  }
  throw new Error('no candidate word was right');
}

/**
 * Master's sentence builder has two extra chips: finds the curriculum sentence whose words are
 * among the chips on screen and leave exactly two chips over, then taps its words in order.
 */
export async function buildSentenceAmongDecoys(mission: Locator): Promise<void> {
  const bank = mission.getByLabel('בנק המילים');
  const chips = (await bank.getByRole('button').allTextContents()).map((word) => word.trim());
  const answers = [...new Set(collectStrings(CURRICULUM_BY_GRADE))]
    .filter((text) => /^[A-Z][^.!?]*[.!?]$/.test(text))
    .map(toSentenceChips)
    .filter((words) => words.length === chips.length - 2 && isSubMultiset(words, chips));
  if (answers.length === 0) throw new Error(`no curriculum sentence fits the chips: ${chips.join(' ')}`);
  for (const word of answers[0]) {
    await bank.getByRole('button', { name: word, exact: true, disabled: false }).first().click();
  }
}

function isSubMultiset(part: string[], whole: string[]): boolean {
  const left = [...whole];
  return part.every((word) => {
    const at = left.indexOf(word);
    if (at < 0) return false;
    left.splice(at, 1);
    return true;
  });
}

/**
 * Builds the sentence-builder step's sentence: finds the curriculum sentence made of exactly the
 * word chips on screen, then taps the chips in that sentence's order.
 */
export async function buildSentence(mission: Locator): Promise<void> {
  const bank = mission.getByLabel('בנק המילים');
  const chips = await bank.getByRole('button').allTextContents();
  // Grades 1–2 give each chip an icon-only listen button (no text): skip those
  const chipKey = chips.map((word) => word.trim()).filter(Boolean).sort().join(' ');
  const answer = SENTENCE_BY_WORDS.get(chipKey);
  if (!answer) throw new Error(`no curriculum sentence has the words: ${chipKey}`);
  for (const word of answer) {
    await bank.getByRole('button', { name: word, exact: true, disabled: false }).first().click();
  }
}
