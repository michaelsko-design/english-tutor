/**
 * The words of grade 1's blending units (Feature 48, units 5–6): short words made only of letters
 * taught in units 1–4, one new vowel or letter pair at a time. Each word is split into sound tiles
 * (a letter pair like "sh" is one tile) and has two look-alike words that differ by one letter,
 * so reading it means looking at every letter, not guessing from the first one.
 */
export interface BlendWord {
  word: string;
  /** The word's sounds in order; joined they spell the word */
  tiles: string[];
  he: string;
  emoji: string;
  /** Two real words one letter away (hat → hit, hot), shown as wrong options */
  lookAlikes: [string, string];
}

const b = (word: string, tiles: string[], he: string, emoji: string, lookAlikes: [string, string]): BlendWord => ({
  word,
  tiles,
  he,
  emoji,
  lookAlikes,
});

export const BLEND_WORDS: readonly BlendWord[] = [
  // Short a
  b('cat', ['c', 'a', 't'], 'חתול', '🐱', ['cut', 'cot']),
  b('hat', ['h', 'a', 't'], 'כובע', '🎩', ['hit', 'hot']),
  b('map', ['m', 'a', 'p'], 'מפה', '🗺️', ['mop', 'cap']),
  b('bag', ['b', 'a', 'g'], 'תיק', '👜', ['big', 'bug']),
  b('bat', ['b', 'a', 't'], 'עטלף', '🦇', ['bit', 'but']),
  // Short i and o
  b('pig', ['p', 'i', 'g'], 'חזיר', '🐷', ['peg', 'big']),
  b('lip', ['l', 'i', 'p'], 'שפה', '👄', ['lap', 'lid']),
  b('pin', ['p', 'i', 'n'], 'סיכה', '📌', ['pan', 'pen']),
  b('dog', ['d', 'o', 'g'], 'כלב', '🐶', ['dig', 'log']),
  b('pot', ['p', 'o', 't'], 'סיר', '🍲', ['pit', 'pet']),
  b('fox', ['f', 'o', 'x'], 'שועל', '🦊', ['fix', 'box']),
  b('log', ['l', 'o', 'g'], 'בול עץ', '🪵', ['leg', 'dog']),
  // Short e and u
  b('bed', ['b', 'e', 'd'], 'מיטה', '🛏️', ['bad', 'bud']),
  b('hen', ['h', 'e', 'n'], 'תרנגולת', '🐔', ['ten', 'pen']),
  b('ten', ['t', 'e', 'n'], 'עשר', '🔟', ['tin', 'hen']),
  b('sun', ['s', 'u', 'n'], 'שמש', '☀️', ['sub', 'run']),
  b('bus', ['b', 'u', 's'], 'אוטובוס', '🚌', ['bug', 'but']),
  b('cup', ['c', 'u', 'p'], 'כוס', '☕', ['cap', 'pup']),
  // Two letters, one sound: sh, ch, th
  b('ship', ['sh', 'i', 'p'], 'אונייה', '🚢', ['shop', 'chip']),
  b('fish', ['f', 'i', 'sh'], 'דג', '🐟', ['dish', 'wish']),
  b('chip', ['ch', 'i', 'p'], 'צ׳יפס', '🍟', ['chop', 'ship']),
  b('bath', ['b', 'a', 'th'], 'אמבטיה', '🛁', ['math', 'path']),
];

const BY_WORD = new Map(BLEND_WORDS.map((word) => [word.word, word]));

export function getBlendWord(word: string): BlendWord {
  const found = BY_WORD.get(word);
  if (!found) throw new Error(`Unknown blending word "${word}"`);
  return found;
}

/** Words read whole, not sounded out: they don't follow the letter sounds yet. */
export const SIGHT_WORDS: readonly { word: string; he: string }[] = [
  { word: 'I', he: 'אני' },
  { word: 'a', he: '(מילה לפני שם עצם)' },
  { word: 'the', he: 'ה- (הידיעה)' },
  { word: 'is', he: 'הוא / היא' },
  { word: 'see', he: 'רואה' },
];

/** The first sentence the learner reads (the Boss of unit 6): sight words plus blended words. */
export const FIRST_SENTENCES: readonly { en: string; he: string; emoji: string; distractorEmojis: [string, string] }[] = [
  { en: 'I see a red hen.', he: 'אני רואה תרנגולת אדומה.', emoji: '🐔', distractorEmojis: ['🐶', '🐟'] },
  { en: 'The cat is on the bed.', he: 'החתול על המיטה.', emoji: '🐱', distractorEmojis: ['🐷', '🦊'] },
  { en: 'I see a big ship.', he: 'אני רואה אונייה גדולה.', emoji: '🚢', distractorEmojis: ['🚌', '🛁'] },
];
