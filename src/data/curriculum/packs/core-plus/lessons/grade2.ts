import type { LessonPack } from '../../../lessons/types';

/** The core-plus pack's grade 2 mini-lessons, by mission id: very short Hebrew, picture examples. */
export const CORE_PLUS_GRADE_2_LESSONS: LessonPack = {
  'g2-u21-m1': {
    titleHe: 'מילה שמתארת: a red bus 🚌',
    ideaHe: 'באנגלית מילה שמתארת (צבע, גדול, קטן) באה לפני הדבר: a red bus זה אוטובוס אדום.',
    pattern: 'a + red / big + bus',
    examples: [
      { en: 'a yellow taxi', he: 'מונית צהובה', highlight: 'yellow', emoji: '🚕' },
      { en: 'a big truck', he: 'משאית גדולה', highlight: 'big', emoji: '🚚' },
      { en: 'a little blue boat', he: 'סירה כחולה קטנה', highlight: 'little blue', emoji: '⛵' },
    ],
    quickTry: {
      promptHe: 'איך אומרים "מכונית לבנה"?',
      correct: 'a white car',
      wrong: 'a car white',
      explainHe: 'המילה שמתארת באה לפני הדבר: a white car.',
    },
  },
  'g2-u21-m2': {
    titleHe: 'מהיר או איטי? fast, slow 💨',
    ideaHe: 'fast זה מהיר, ו-slow זה איטי. הן באות לפני הדבר: a fast car. או אחרי is: The car is fast.',
    pattern: 'a fast … · The … is slow',
    examples: [
      { en: 'a fast horse', he: 'סוס מהיר', highlight: 'fast', emoji: '🐎' },
      { en: 'The snail is slow.', he: 'החילזון איטי.', highlight: 'slow', emoji: '🐌' },
      { en: 'a fast train', he: 'רכבת מהירה', highlight: 'fast', emoji: '🚆' },
    ],
    quickTry: {
      promptHe: 'הצב 🐢 הולך לאט. איזו מילה מתאימה?',
      questionEn: 'The turtle is very ____.',
      correct: 'slow',
      wrong: 'fast',
      explainHe: 'הצב הולך לאט: slow.',
    },
  },
  'g2-u22-m1': {
    titleHe: 'in ו-on: בתוך ועל 📍',
    ideaHe: 'in פירושו "בתוך": in the box. on פירושו "על": on the table. שואלים Where is…? (איפה?).',
    pattern: 'in the … · on the …',
    examples: [
      { en: 'The frog is in the pond.', he: 'הצפרדע בתוך הבריכה.', highlight: 'in', emoji: '🐸' },
      { en: 'The cup is on the table.', he: 'הכוס על השולחן.', highlight: 'on', emoji: '☕' },
      { en: 'My book is in my bag.', he: 'הספר שלי בתוך התיק.', highlight: 'in', emoji: '🎒' },
    ],
    quickTry: {
      promptHe: 'הדג 🐟 שוחה בתוך המים. מה נכון?',
      correct: 'in the water',
      wrong: 'on the water',
      explainHe: 'הדג בתוך המים: in the water.',
    },
  },
  'g2-u22-m2': {
    titleHe: 'under: מתחת 👇',
    ideaHe: 'under פירושו "מתחת". הנעליים מתחת למיטה: under the bed.',
    pattern: 'under the …',
    examples: [
      { en: 'The shoes are under the bed.', he: 'הנעליים מתחת למיטה.', highlight: 'under', emoji: '👟' },
      { en: 'A cat sleeps under the chair.', he: 'חתול ישן מתחת לכיסא.', highlight: 'under', emoji: '🐱' },
      { en: 'The fish swim under the boat.', he: 'הדגים שוחים מתחת לסירה.', highlight: 'under', emoji: '🐟' },
    ],
    quickTry: {
      promptHe: 'הכדור ⚽ למטה, והשולחן מעליו. מה נכון?',
      correct: 'under the table',
      wrong: 'on the table',
      explainHe: 'הכדור מתחת לשולחן: under the table.',
    },
  },
};
