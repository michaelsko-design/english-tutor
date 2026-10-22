import { screen, within } from '@testing-library/react';
import type userEvent from '@testing-library/user-event';
import type { MultipleChoiceOption } from '../data/missionExercises';

export type TestUser = ReturnType<typeof userEvent.setup>;

/** The parts of a mission, exam, word-list or contest step that say how to answer it */
export interface AnswerableStep {
  type: string;
  options?: MultipleChoiceOption[];
  scrambledWords?: string[];
  letterTiles?: string[];
  /** The sentence (or the word, in a blending build step) to build */
  targetSentenceEn?: string;
  /** Word lists: the word or sentence itself */
  textEn?: string;
}

const toComparable = (word: string) => word.replace(/[.!?",]/g, '').toLowerCase();

/** The answer button's accessible name: a picture option is named by its word (the emoji is hidden) */
export function getOptionName(option: MultipleChoiceOption): string {
  return /\p{L}/u.test(option.textEn) ? option.textEn : (option.speakEn ?? option.textEn);
}

async function pickOption(user: TestUser, options: MultipleChoiceOption[], isCorrect: boolean) {
  const option = options.find((o) => o.isCorrect === isCorrect);
  if (!option) throw new Error(`no ${isCorrect ? 'right' : 'wrong'} option`);
  await user.click(screen.getByRole('button', { name: getOptionName(option) }));
}

/** Taps the bank's chips (in the zone labelled `bankLabel`) in the order `pickNext` chooses */
async function tapInOrder(
  user: TestUser,
  bankLabel: string,
  chips: string[],
  pickNext: (isUsed: (idx: number) => boolean) => number | null
) {
  const used = new Set<number>();
  for (let next = pickNext((i) => used.has(i)); next !== null; next = pickNext((i) => used.has(i))) {
    if (next < 0 || next >= chips.length) throw new Error('the answer cannot be built from the chips');
    used.add(next);
    await user.click(within(screen.getByLabelText(bankLabel)).getAllByRole('button')[next]);
  }
}

async function buildSentence(user: TestUser, words: string[], target: string) {
  const tokens = target.split(/\s+/).filter(Boolean);
  let tokenIdx = 0;
  await tapInOrder(user, 'בנק המילים', words, (isUsed) => {
    if (tokenIdx >= tokens.length) return null;
    const token = toComparable(tokens[tokenIdx++]);
    return words.findIndex((w, i) => !isUsed(i) && toComparable(w) === token);
  });
  await user.click(screen.getByRole('button', { name: /בדיקת משפט/ }));
}

async function spellWord(user: TestUser, tiles: string[], target: string) {
  let rest = target.replace(/[^\p{L}]/gu, '').toLowerCase();
  await tapInOrder(user, 'האותיות', tiles, (isUsed) => {
    if (!rest) return null;
    const idx = tiles.findIndex((t, i) => !isUsed(i) && rest.startsWith(t.toLowerCase()));
    if (idx >= 0) rest = rest.slice(tiles[idx].length);
    return idx;
  });
  await user.click(screen.getByRole('button', { name: /בדיקת איות/ }));
}

/** Answers the step on screen the right way (a voice step is skipped, as in a quiet place) */
export async function answerCorrectly(user: TestUser, step: AnswerableStep): Promise<void> {
  const target = step.targetSentenceEn ?? step.textEn ?? '';
  if (step.type === 'voice-speak') {
    await user.click(screen.getByRole('button', { name: /אני במקום שקט/ }));
  } else if (step.letterTiles) {
    await spellWord(user, step.letterTiles, target);
  } else if (step.scrambledWords) {
    await buildSentence(user, step.scrambledWords, target);
  } else if (step.options) {
    await pickOption(user, step.options, true);
  } else {
    throw new Error(`no way to answer a ${step.type} step`);
  }
}

/** Picks a wrong option (multiple-choice steps only) */
export async function answerWrongly(user: TestUser, step: AnswerableStep): Promise<void> {
  if (!step.options) throw new Error(`a ${step.type} step has no options to get wrong`);
  await pickOption(user, step.options, false);
}
