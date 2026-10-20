/**
 * The English alphabet for absolute beginners (Feature 48, grade 1 units 1–4): every letter with
 * its capital and small form and three picture words that start with it. The letter's name is read
 * as a clip (`letterToken`), followed by a word ("B … ball"), since isolated sounds from the voice
 * weren't clear enough to teach with.
 */
import { letterToken } from '../services/tts/ttsText';

export interface AlphabetWord {
  en: string;
  he: string;
  emoji: string;
}

export interface AlphabetLetter {
  upper: string;
  lower: string;
  words: readonly [AlphabetWord, AlphabetWord, AlphabetWord];
  /** Where the letter sits in its words: X opens almost no simple word, so its words end with it */
  position?: 'start' | 'end';
  /** A short, gender-neutral tip for a letter that is easy to confuse */
  tipHe?: string;
}

const w = (en: string, he: string, emoji: string): AlphabetWord => ({ en, he, emoji });

export const ALPHABET: readonly AlphabetLetter[] = [
  { upper: 'A', lower: 'a', words: [w('apple', 'תפוח', '🍎'), w('ant', 'נמלה', '🐜'), w('alligator', 'תנין', '🐊')] },
  { upper: 'B', lower: 'b', words: [w('ball', 'כדור', '⚽'), w('banana', 'בננה', '🍌'), w('bear', 'דוב', '🐻')], tipHe: 'שימו לב: b הקטנה פונה ימינה, ו-d פונה שמאלה.' },
  { upper: 'C', lower: 'c', words: [w('cat', 'חתול', '🐱'), w('car', 'מכונית', '🚗'), w('cake', 'עוגה', '🎂')], tipHe: 'C נשמעת כאן כמו ק׳ בהתחלה של cat.' },
  { upper: 'D', lower: 'd', words: [w('dog', 'כלב', '🐶'), w('duck', 'ברווז', '🦆'), w('door', 'דלת', '🚪')] },
  { upper: 'E', lower: 'e', words: [w('egg', 'ביצה', '🥚'), w('elephant', 'פיל', '🐘'), w('envelope', 'מעטפה', '✉️')] },
  { upper: 'F', lower: 'f', words: [w('fish', 'דג', '🐟'), w('frog', 'צפרדע', '🐸'), w('flower', 'פרח', '🌸')] },
  { upper: 'G', lower: 'g', words: [w('goat', 'עז', '🐐'), w('grapes', 'ענבים', '🍇'), w('gift', 'מתנה', '🎁')], tipHe: 'G נשמעת כאן כמו ג׳ בהתחלה של goat.' },
  { upper: 'H', lower: 'h', words: [w('hat', 'כובע', '🎩'), w('horse', 'סוס', '🐴'), w('house', 'בית', '🏠')] },
  { upper: 'I', lower: 'i', words: [w('insect', 'חרק', '🐛'), w('iguana', 'איגואנה', '🦎'), w('ink', 'דיו', '🖋️')] },
  { upper: 'J', lower: 'j', words: [w('juice', 'מיץ', '🧃'), w('jacket', 'מעיל', '🧥'), w('joystick', 'ג׳ויסטיק', '🕹️')], tipHe: 'J נשמעת כמו ג׳ במילה ג׳ירפה.' },
  { upper: 'K', lower: 'k', words: [w('kite', 'עפיפון', '🪁'), w('key', 'מפתח', '🔑'), w('kangaroo', 'קנגורו', '🦘')] },
  { upper: 'L', lower: 'l', words: [w('lion', 'אריה', '🦁'), w('lemon', 'לימון', '🍋'), w('leaf', 'עלה', '🍃')] },
  { upper: 'M', lower: 'm', words: [w('moon', 'ירח', '🌙'), w('monkey', 'קוף', '🐒'), w('milk', 'חלב', '🥛')] },
  { upper: 'N', lower: 'n', words: [w('nose', 'אף', '👃'), w('nut', 'אגוז', '🥜'), w('nine', 'תשע', '9️⃣')] },
  { upper: 'O', lower: 'o', words: [w('octopus', 'תמנון', '🐙'), w('orange', 'תפוז', '🍊'), w('ox', 'שור', '🐂')] },
  { upper: 'P', lower: 'p', words: [w('pig', 'חזיר', '🐷'), w('pen', 'עט', '🖊️'), w('pizza', 'פיצה', '🍕')], tipHe: 'שימו לב: p הקטנה יורדת למטה, ו-q הקטנה גם, אבל פונה לצד השני.' },
  { upper: 'Q', lower: 'q', words: [w('queen', 'מלכה', '👑'), w('question', 'שאלה', '❓'), w('quiet', 'שקט', '🤫')], tipHe: 'אחרי Q כמעט תמיד בא u, כמו ב-queen.' },
  { upper: 'R', lower: 'r', words: [w('rabbit', 'ארנב', '🐰'), w('rain', 'גשם', '🌧️'), w('robot', 'רובוט', '🤖')] },
  { upper: 'S', lower: 's', words: [w('sun', 'שמש', '☀️'), w('snake', 'נחש', '🐍'), w('star', 'כוכב', '⭐')] },
  { upper: 'T', lower: 't', words: [w('tiger', 'טיגריס', '🐯'), w('tree', 'עץ', '🌳'), w('train', 'רכבת', '🚂')] },
  { upper: 'U', lower: 'u', words: [w('umbrella', 'מטרייה', '☂️'), w('up', 'למעלה', '⬆️'), w('unicorn', 'חד-קרן', '🦄')] },
  { upper: 'V', lower: 'v', words: [w('van', 'טנדר', '🚐'), w('violin', 'כינור', '🎻'), w('volcano', 'הר געש', '🌋')] },
  { upper: 'W', lower: 'w', words: [w('watermelon', 'אבטיח', '🍉'), w('whale', 'לווייתן', '🐳'), w('window', 'חלון', '🪟')], tipHe: 'W נשמעת כמו ו׳ במילה וואו!' },
  { upper: 'X', lower: 'x', position: 'end', words: [w('fox', 'שועל', '🦊'), w('box', 'קופסה', '📦'), w('six', 'שש', '6️⃣')], tipHe: 'X מופיעה בדרך כלל בסוף המילה, כמו ב-fox.' },
  { upper: 'Y', lower: 'y', words: [w('yo-yo', 'יו-יו', '🪀'), w('yellow', 'צהוב', '💛'), w('yawn', 'פיהוק', '🥱')] },
  { upper: 'Z', lower: 'z', words: [w('zebra', 'זברה', '🦓'), w('zero', 'אפס', '0️⃣'), w('zipper', 'רוכסן', '🤐')] },
];

const BY_UPPER = new Map(ALPHABET.map((letter) => [letter.upper, letter]));

export function getAlphabetLetter(upper: string): AlphabetLetter {
  const letter = BY_UPPER.get(upper.toUpperCase());
  if (!letter) throw new Error(`Unknown letter "${upper}"`);
  return letter;
}

/** What the read-aloud plays for a letter: its name ("bee"), as a rendered clip. */
export function getLetterNameSpeech(upper: string): string {
  return letterToken(upper);
}

/** The letters taught before `upper` (A–Z order), so Master options can mix in earlier letters. */
export function getLettersBefore(upper: string): AlphabetLetter[] {
  return ALPHABET.slice(0, ALPHABET.findIndex((letter) => letter.upper === upper.toUpperCase()));
}
