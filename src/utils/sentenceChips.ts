/** A comma that is its own chip in a sentence builder (Master): the learner must place it. */
export const COMMA_CHIP = ',';

/** True when the bank has a comma chip, so the comma's place is part of the answer. */
export function hasCommaChip(chips: readonly string[]): boolean {
  return chips.includes(COMMA_CHIP);
}

/** The built chips as a sentence: a comma chip sticks to the word before it. */
export function joinSentenceChips(chips: readonly string[]): string {
  return chips.join(' ').replace(/ ,/g, COMMA_CHIP);
}

/** Like `normalizeSentence` (useDrillSession), but commas count, and where they are. */
export function normalizeSentenceWithCommas(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s',]/g, '')
    .replace(/\s*,\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}
