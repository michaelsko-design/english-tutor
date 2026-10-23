import type { LessonPack } from '../../../lessons/types';

/** The holidays pack's grade 2 mini-lessons, by mission id: very short Hebrew, picture examples. */
export const HOLIDAYS_GRADE_2_LESSONS: LessonPack = {
  'g2-u31-m1': {
    titleHe: 'We like: אנחנו אוהבים 🍯',
    ideaHe: 'כשכל המשפחה אוהבת משהו אומרים We like (אנחנו אוהבים). ולפני מילה שמתחילה בתנועה אומרים an.',
    pattern: 'We like … · an apple',
    examples: [
      { en: 'We like pomegranates.', he: 'אנחנו אוהבים רימונים.', highlight: 'We like', emoji: '🍎' },
      { en: 'We like round challah.', he: 'אנחנו אוהבים חלה עגולה.', highlight: 'We like', emoji: '🍞' },
      { en: 'an orange', he: 'תפוז', highlight: 'an', emoji: '🍊' },
    ],
    quickTry: {
      promptHe: 'איזה משפט נכון?',
      correct: 'We like sweet cake.',
      wrong: 'We sweet like cake.',
      explainHe: 'קודם We like, ואחר כך מה שאוהבים.',
    },
  },
  'g2-u31-m2': {
    titleHe: 'This is my: זה שלי 🌴',
    ideaHe: 'כשמראים משהו שלנו אומרים This is my … (זה ה… שלי). וכשיש הרבה, מוסיפים s: two stars.',
    pattern: 'This is my … · two stars',
    examples: [
      { en: 'This is my lamp.', he: 'זו המנורה שלי.', highlight: 'This is my', emoji: '💡' },
      { en: 'This is my paper chain.', he: 'זו שרשרת הנייר שלי.', highlight: 'This is my', emoji: '🔗' },
      { en: 'I see two lemons.', he: 'אני רואה שני לימונים.', highlight: 'two lemons', emoji: '🍋' },
    ],
    quickTry: {
      promptHe: 'יש כאן שלושה כוכבים ⭐⭐⭐. מה נכון?',
      correct: 'three stars',
      wrong: 'three star',
      explainHe: 'יותר מכוכב אחד: stars עם s.',
    },
  },
  'g2-u32-m1': {
    titleHe: 'What is this? מה זה? 🎭',
    ideaHe: 'שואלים What is this? (מה זה?) ועונים It is a … בפורים יש הרבה תחפושות לנחש!',
    pattern: 'What is this? · It is a …',
    examples: [
      { en: 'It is a funny hat.', he: 'זה כובע מצחיק.', highlight: 'It is a', emoji: '🎩' },
      { en: 'It is a clown costume.', he: 'זו תחפושת של ליצן.', highlight: 'It is a', emoji: '🎪' },
      { en: 'It is a little plant.', he: 'זה צמח קטן.', highlight: 'It is a', emoji: '🌱' },
    ],
    quickTry: {
      promptHe: 'What is this? 🦸 מה התשובה?',
      correct: 'It is a costume.',
      wrong: 'It a costume is.',
      explainHe: 'עונים It is a costume: זו תחפושת.',
    },
  },
  'g2-u32-m2': {
    titleHe: 'הרבה דגלים: s ברבים 🎆',
    ideaHe: 'כשיש יותר מאחד מוסיפים s בסוף המילה: one flag, two flags. וגם We like: אנחנו אוהבים.',
    pattern: 'one flag · ten flags',
    examples: [
      { en: 'two balloons', he: 'שני בלונים', highlight: 'balloons', emoji: '🎈' },
      { en: 'five songs', he: 'חמישה שירים', highlight: 'songs', emoji: '🎶' },
      { en: 'We like the fireworks.', he: 'אנחנו אוהבים את הזיקוקים.', highlight: 'We like', emoji: '🎆' },
    ],
    quickTry: {
      promptHe: 'יש כאן שישה דגלים. מה נכון?',
      correct: 'six flags',
      wrong: 'six flag',
      explainHe: 'יותר מדגל אחד: flags עם s.',
    },
  },
};
