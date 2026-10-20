import type { LessonPack, MiniLesson } from './types';
import { getAlphabetLetter } from '../../alphabet';
import { getBlendWord } from '../../blendingWords';

/**
 * Grade 1 mini-lessons of units 1–6 (Feature 48), built from the alphabet and blending words:
 * a letters lesson shows a card per letter, a blending lesson shows words as tiles that slide
 * together. Hebrew is gender-neutral plural and short, since it is read aloud.
 */

const LETTERS_IDEA_HE =
  'לכל אות באנגלית יש שם, צורה גדולה וצורה קטנה. לחצו על אות כדי לשמוע את השם שלה, ועל תמונה כדי לשמוע מילה.';

function lettersLesson(letters: string[]): MiniLesson {
  const [first, second] = letters.map(getAlphabetLetter);
  const tipHe = letters.map((upper) => getAlphabetLetter(upper).tipHe).find(Boolean);
  const verb = first.position === 'end' ? 'מסתיימת' : 'מתחילה';
  return {
    titleHe: `האותיות ${letters.join(', ')} 🔤`,
    ideaHe: LETTERS_IDEA_HE,
    pattern: letters.map((upper) => `${upper}${upper.toLowerCase()}`).join(' · '),
    examples: letters.slice(0, 3).map((upper) => {
      const word = getAlphabetLetter(upper).words[0];
      return { en: `${upper} is for ${word.en}.`, he: `${upper} כמו ${word.he}`, highlight: upper, emoji: word.emoji };
    }),
    ...(tipHe ? { tipHe } : {}),
    quickTry: {
      promptHe: `איזו תמונה ${verb} באות ${first.upper}?`,
      correct: first.words[1].emoji,
      wrong: second.words[1].emoji,
      explainHe: `${first.words[1].emoji} ${first.words[1].en} ${verb === 'מסתיימת' ? 'מסתיים' : 'מתחיל'} ב-${first.upper}.`,
    },
    letters,
  };
}

const BLEND_IDEA_HE =
  'כדי לקרוא מילה, אומרים כל אות לפי הסדר ואז מחברים אותן מהר יותר: c... a... t, cat! לחצו על ➡️ כדי לראות איך.';
const PAIRS_IDEA_HE =
  'יש זוגות אותיות שנשמעים כמו צליל אחד: sh כמו ש׳, ch כמו צ׳ ו-th כמו ת׳ רכה, עם הלשון בין השיניים.';

interface BlendLessonSpec {
  titleHe: string;
  ideaHe: string;
  pattern: string;
  words: string[];
  tipHe?: string;
  /** A word outside the mission, read in the quick try, and its picture */
  tryWord: string;
  tryEmoji: string;
  wrongEmoji: string;
  tryHe: string;
}

function blendLesson(spec: BlendLessonSpec): MiniLesson {
  return {
    titleHe: spec.titleHe,
    ideaHe: spec.ideaHe,
    pattern: spec.pattern,
    examples: spec.words.map((text) => {
      const word = getBlendWord(text);
      return { en: `${word.tiles.join('-')}, ${word.word}!`, he: word.he, highlight: word.word, emoji: word.emoji };
    }),
    ...(spec.tipHe ? { tipHe: spec.tipHe } : {}),
    quickTry: {
      promptHe: 'קראו את המילה. איזו תמונה מתאימה לה?',
      questionEn: spec.tryWord,
      correct: spec.tryEmoji,
      wrong: spec.wrongEmoji,
      explainHe: `${spec.tryWord} זה ${spec.tryHe} ${spec.tryEmoji}`,
    },
    blendWords: spec.words,
  };
}

export const GRADE_1_PHONICS_LESSONS: LessonPack = {
  'g1-u11-m1': lettersLesson(['A', 'B', 'C']),
  'g1-u11-m2': lettersLesson(['D', 'E', 'F']),
  'g1-u12-m1': lettersLesson(['G', 'H', 'I']),
  'g1-u12-m2': lettersLesson(['J', 'K', 'L', 'M']),
  'g1-u13-m1': lettersLesson(['N', 'O', 'P']),
  'g1-u13-m2': lettersLesson(['Q', 'R', 'S', 'T']),
  'g1-u14-m1': lettersLesson(['U', 'V', 'W']),
  'g1-u14-m2': lettersLesson(['X', 'Y', 'Z']),
  'g1-u15-m1': blendLesson({
    titleHe: 'מחברים אותיות: a 🧱',
    ideaHe: BLEND_IDEA_HE,
    pattern: 'c + a + t = cat',
    words: ['cat', 'map', 'bag'],
    tipHe: 'a באמצע מילה קצרה נשמעת כמו אֶ פתוחה, כמו ב-cat.',
    tryWord: 'van',
    tryEmoji: '🚐',
    wrongEmoji: '🐷',
    tryHe: 'טנדר',
  }),
  'g1-u15-m2': blendLesson({
    titleHe: 'מחברים אותיות: i ו-o 🧱',
    ideaHe: BLEND_IDEA_HE,
    pattern: 'p + i + g = pig',
    words: ['pig', 'dog', 'fox'],
    tipHe: 'i נשמעת כמו אִ קצרה (pig), ו-o כמו אָ פתוחה (dog).',
    tryWord: 'six',
    tryEmoji: '6️⃣',
    wrongEmoji: '🎩',
    tryHe: 'שש',
  }),
  'g1-u16-m1': blendLesson({
    titleHe: 'מחברים אותיות: e ו-u 📖',
    ideaHe: BLEND_IDEA_HE,
    pattern: 's + u + n = sun',
    words: ['bed', 'sun', 'cup'],
    tipHe: 'e נשמעת כמו אֶ (bed), ו-u כמו אַ קצרה (sun).',
    tryWord: 'net',
    tryEmoji: '🥅',
    wrongEmoji: '🐱',
    tryHe: 'רשת',
  }),
  'g1-u16-m2': blendLesson({
    titleHe: 'שתי אותיות, צליל אחד 📖',
    ideaHe: PAIRS_IDEA_HE,
    pattern: 'sh · ch · th',
    words: ['ship', 'chip', 'bath'],
    tipHe: 'מילים כמו I, a, the, is ו-see קוראים במבט אחד, בלי לפרק לאותיות.',
    tryWord: 'shell',
    tryEmoji: '🐚',
    wrongEmoji: '🍟',
    tryHe: 'צדף',
  }),
};
