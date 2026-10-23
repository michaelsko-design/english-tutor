import type { LessonPack } from '../../../lessons/types';

/** The holidays pack's grade 1 mini-lessons, by mission id: very short Hebrew, picture examples. */
export const HOLIDAYS_GRADE_1_LESSONS: LessonPack = {
  'g1-u31-m1': {
    titleHe: 'ראש השנה: Happy New Year 🍯',
    ideaHe: 'בראש השנה מאחלים Happy New Year (שנה טובה). כשמשהו טעים, אומרים I like.',
    pattern: 'Happy New Year! · I like + …',
    examples: [
      { en: 'Have a good year, Mom!', he: 'שתהיה לך שנה טובה, אמא!', highlight: 'good year', emoji: '💌' },
      { en: 'I like pomegranates.', he: 'אני אוהב/ת רימונים.', highlight: 'I like', emoji: '🍎' },
      { en: 'I like sweet apples.', he: 'אני אוהב/ת תפוחים מתוקים.', highlight: 'sweet', emoji: '🍎' },
    ],
    quickTry: {
      promptHe: 'איך אומרים "אני אוהב/ת עוגה"?',
      correct: 'I like cake.',
      wrong: 'I cake like.',
      explainHe: 'קודם I like, ואחר כך מה שאוהבים.',
    },
  },
  'g1-u31-m2': {
    titleHe: 'סוכות: I see, I have 🌴',
    ideaHe: 'בסוכה יש הרבה דברים יפים. אומרים I see (אני רואה) ו-I have (יש לי), ואחר כך a והדבר.',
    pattern: 'I see a … · I have a …',
    examples: [
      { en: 'I see a palm tree.', he: 'אני רואה עץ דקל.', highlight: 'I see a', emoji: '🌴' },
      { en: 'I have a lemon.', he: 'יש לי לימון.', highlight: 'I have a', emoji: '🍋' },
      { en: 'I see a lamp.', he: 'אני רואה מנורה.', highlight: 'I see a', emoji: '💡' },
    ],
    quickTry: {
      promptHe: 'איזה משפט נכון?',
      correct: 'I have a chain.',
      wrong: 'I have chain.',
      explainHe: 'לפני דבר אחד אומרים a: a chain.',
    },
  },
  'g1-u32-m1': {
    titleHe: 'ט״ו בשבט ופורים 🎭',
    ideaHe: 'בט״ו בשבט שותלים plant, ובפורים מתחפשים עם mask או crown. אומרים I have a: יש לי.',
    pattern: 'I have a + …',
    examples: [
      { en: 'I have a costume.', he: 'יש לי תחפושת.', highlight: 'I have a', emoji: '🦸' },
      { en: 'I have a green plant.', he: 'יש לי צמח ירוק.', highlight: 'I have a', emoji: '🌱' },
      { en: 'I have a pink crown.', he: 'יש לי כתר ורוד.', highlight: 'pink', emoji: '👑' },
    ],
    quickTry: {
      promptHe: 'מה מתאים לפורים?',
      correct: 'a mask',
      wrong: 'a plant',
      explainHe: 'בפורים מתחפשים: a mask (מסכה).',
    },
  },
  'g1-u32-m2': {
    titleHe: 'פסח ויום העצמאות 🎆',
    ideaHe: 'ביום העצמאות הדגל כחול ולבן. הצבע בא לפני הדבר: a blue flag.',
    pattern: 'a + color + thing',
    examples: [
      { en: 'a white matzah', he: 'מצה לבנה', highlight: 'white', emoji: '🫓' },
      { en: 'red fireworks', he: 'זיקוקים אדומים', highlight: 'red', emoji: '🎆' },
      { en: 'a blue balloon', he: 'בלון כחול', highlight: 'blue', emoji: '🎈' },
    ],
    quickTry: {
      promptHe: 'איך אומרים "דגל לבן"?',
      correct: 'a white flag',
      wrong: 'a flag white',
      explainHe: 'הצבע בא לפני הדבר: a white flag.',
    },
  },
};
