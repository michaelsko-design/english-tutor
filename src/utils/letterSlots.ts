// Letter slots of the spelling magnets: one entry per letter of the word, the bank index of the
// tile placed there or null for an open slot. Letters can sit in any slot, with open slots between them.
// Every helper returns a new array.

export type LetterSlots = readonly (number | null)[];

const SLOT_ID_PREFIX = 'letter-slot-';

/** The drop id of a slot position. */
export const toSlotId = (pos: number): string => `${SLOT_ID_PREFIX}${pos}`;

/** The slot position of a drop id, or null for any other id. */
export const fromSlotId = (id: string | number): number | null => {
  if (typeof id !== 'string' || !id.startsWith(SLOT_ID_PREFIX)) return null;
  const pos = Number(id.slice(SLOT_ID_PREFIX.length));
  return Number.isInteger(pos) && pos >= 0 ? pos : null;
};

/** The slots at full length (a runner starts and resets with an empty list). */
export const toSlots = (slots: LetterSlots, count: number): (number | null)[] =>
  Array.from({ length: count }, (_, pos) => slots[pos] ?? null);

/** A tap on a bank letter: it goes into the first open slot. */
export const placeLetter = (slots: LetterSlots, count: number, idx: number): (number | null)[] => {
  const next = toSlots(slots, count);
  const openPos = next.indexOf(null);
  if (next.includes(idx) || openPos === -1) return next;
  next[openPos] = idx;
  return next;
};

/** A tap on a placed letter: its slot opens, the other letters stay where they are. */
export const takeBackLetter = (slots: LetterSlots, count: number, idx: number): (number | null)[] =>
  toSlots(slots, count).map((placed) => (placed === idx ? null : placed));

/**
 * A letter dropped on a slot. An open slot takes it; on a filled slot a placed letter swaps places
 * with the one there, and a bank letter sends that one back to the bank.
 */
export const dropLetter = (slots: LetterSlots, count: number, idx: number, pos: number): (number | null)[] => {
  const next = toSlots(slots, count);
  if (pos < 0 || pos >= count) return next;
  const fromPos = next.indexOf(idx);
  if (fromPos === pos) return next;
  const displaced = next[pos];
  if (fromPos !== -1) next[fromPos] = displaced;
  next[pos] = idx;
  return next;
};

export const isEverySlotFilled = (slots: LetterSlots, count: number): boolean =>
  toSlots(slots, count).every((placed) => placed !== null);

/** Splits tiles into evenly sized rows of at most `maxPerRow`, so no single tile is left alone on a line. */
export const splitIntoBalancedRows = <T>(items: readonly T[], maxPerRow: number): T[][] => {
  if (items.length === 0) return [];
  const rowCount = Math.ceil(items.length / maxPerRow);
  const perRow = Math.ceil(items.length / rowCount);
  return Array.from({ length: rowCount }, (_, row) => items.slice(row * perRow, (row + 1) * perRow));
};

/** The placed letters in slot order. */
export const spellSlots = (slots: LetterSlots, letterTiles: readonly string[]): string =>
  slots.map((placed) => (placed === null ? '' : letterTiles[placed] ?? '')).join('');
