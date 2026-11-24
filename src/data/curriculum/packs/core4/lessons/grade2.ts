import type { LessonPack } from '../../../lessons/types';

/** The core-4 source's grade 2 mini-lessons, by mission id: very short Hebrew, picture examples. */
export const CORE_4_GRADE_2_LESSONS: LessonPack = {
  'g2-u24-m1': {
    titleHe: 'איפה גרים? Where do you live? 🏡',
    ideaHe:
      'שואלים Where do you live? (איפה אתם גרים?). עונים I live in … (אני גר/ה ב...). ואת הכתובת אומרים כך: My address is …',
    pattern: 'Where do you live? · I live in … · My address is …',
    examples: [
      { en: 'Where do your friends live?', he: 'איפה החברים שלכם גרים?', highlight: 'Where', emoji: '❔' },
      { en: 'We live in Eilat.', he: 'אנחנו גרים באילת.', highlight: 'live in', emoji: '🏘️' },
      { en: 'My house is next to the shop.', he: 'הבית שלי ליד החנות.', highlight: 'next to', emoji: '🏪' },
    ],
    quickTry: {
      promptHe: 'שואלים אתכם Where do you live? מה עונים?',
      correct: 'We live in Ashdod.',
      wrong: 'We are Ashdod.',
      explainHe: 'על Where do you live? עונים I live in … או We live in … (אנחנו גרים ב...).',
    },
  },
  'g2-u24-m2': {
    titleHe: 'כמה? How many? There are… 🎲',
    ideaHe:
      'How many? פירושו "כמה?". כשיש כמה דברים, אומרים There are … (יש...), והשם מקבל s: three cats. plus פירושו "ועוד".',
    pattern: 'How many …? · There are … · two plus two',
    examples: [
      { en: 'How many dogs are there?', he: 'כמה כלבים יש?', highlight: 'How many', emoji: '🐶' },
      { en: 'There are three apples.', he: 'יש שלושה תפוחים.', highlight: 'There are', emoji: '🍎' },
      { en: 'One plus one is two.', he: 'אחת ועוד אחת זה שתיים.', highlight: 'plus', emoji: '✋' },
    ],
    quickTry: {
      promptHe: 'על השולחן יש חמש עוגיות 🍪. איך אומרים את זה?',
      correct: 'There are five cookies.',
      wrong: 'There is five cookie.',
      explainHe: 'עם כמה דברים אומרים There are, והשם ברבים: five cookies.',
    },
  },
};
