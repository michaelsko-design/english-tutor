import type { LessonPack } from '../../../lessons/types';

/** The core-3 source's grade 3 mini-lessons, by mission id. */
export const CORE_3_GRADE_3_LESSONS: LessonPack = {
  'g3-u23-m1': {
    titleHe: 'שאלה עם Do: Do you like…? ❓',
    ideaHe:
      'כדי לשאול "אתם אוהבים…?" מתחילים ב-Do: Do you like cats? עונים בקצרה: Yes, I do (כן) או No, I don\'t (לא).',
    pattern: 'Do you like …? → Yes, I do. / No, I don\'t.',
    examples: [
      { en: 'Do you like dogs?', he: 'אתם אוהבים כלבים?', highlight: 'Do you like', emoji: '🐕' },
      { en: 'Do you like bananas?', he: 'אתם אוהבים בננות?', highlight: 'Do you like', emoji: '🍌' },
      { en: 'Do you like milk? No, I don\'t.', he: 'אתם אוהבים חלב? לא.', highlight: 'No, I don\'t', emoji: '❌' },
    ],
    quickTry: {
      promptHe: 'איך שואלים "אתם אוהבים גלידה?" 🍦',
      correct: 'Do you like ice cream?',
      wrong: 'You like do ice cream?',
      explainHe: 'שאלה כזאת מתחילה ב-Do: Do you like ice cream?',
    },
  },
  'g3-u23-m2': {
    titleHe: 'יש לכם? Do you have…? 🎒',
    ideaHe:
      'כדי לשאול "יש לכם…?" אומרים Do you have…? אחרי Do you בא have (לא has). התשובה: Yes, I do או No, I don\'t.',
    pattern: 'Do you have a …? → Yes, I do. / No, I don\'t.',
    examples: [
      { en: 'Do you have a pet?', he: 'יש לכם חיית מחמד?', highlight: 'Do you have', emoji: '🐾' },
      { en: 'Do you have a red pen?', he: 'יש לכם עט אדום?', highlight: 'Do you have', emoji: '🖊️' },
      { en: 'No, I don\'t have a bike.', he: 'לא, אין לי אופניים.', highlight: 'don\'t have', emoji: '🚲' },
    ],
    quickTry: {
      promptHe: 'איך שואלים "יש לכם כדור?"',
      correct: 'Do you have a ball?',
      wrong: 'Do you has a ball?',
      explainHe: 'אחרי Do you בא have: Do you have a ball?',
    },
  },
};
