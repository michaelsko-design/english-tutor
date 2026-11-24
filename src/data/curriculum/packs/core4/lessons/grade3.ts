import type { LessonPack } from '../../../lessons/types';

/** The core-4 source's grade 3 mini-lessons, by mission id: short Hebrew, picture examples. */
export const CORE_4_GRADE_3_LESSONS: LessonPack = {
  'g3-u24-m1': {
    titleHe: 'מספרים סיפור: and ו-then 📜',
    ideaHe:
      'אגדה מתחילה ב-Once upon a time (היה היה פעם). and (ו-) מחבר שני דברים או שני רעיונות, ו-then (ואז) אומר מה קרה אחר כך.',
    pattern: 'Once upon a time, there was … · … and … · … and then …',
    examples: [
      { en: 'There was a little frog in the lake.', he: 'הייתה צפרדע קטנה באגם.', highlight: 'There was', emoji: '🐸' },
      { en: 'I have a pen and a pencil.', he: 'יש לי עט ועיפרון.', highlight: 'and', emoji: '✏️' },
      { en: 'We go to the park, and then we eat ice cream.', he: 'אנחנו הולכים לפארק, ואז אוכלים גלידה.', highlight: 'and then', emoji: '🍦' },
    ],
    quickTry: {
      promptHe: 'איך מחברים: I have a cat. I have a fish.',
      correct: 'I have a cat and a fish.',
      wrong: 'I have a cat a fish and.',
      explainHe: 'and עומד בין שני הדברים: a cat and a fish.',
    },
  },
  'g3-u24-m2': {
    titleHe: 'הפתעה בסיפור: but 🤨',
    ideaHe:
      'but (אבל) מחבר שני רעיונות שונים: משהו טוב ומשהו לא טוב, או כן ולא. לפני but שמים פסיק.',
    pattern: '… , but …',
    examples: [
      { en: 'The dog is big, but it is friendly.', he: 'הכלב גדול, אבל הוא חברותי.', highlight: 'but', emoji: '🐕' },
      { en: 'I like milk, but I don\'t like tea.', he: 'אני אוהב/ת חלב, אבל אני לא אוהב/ת תה.', highlight: 'but', emoji: '🥛' },
      { en: 'It is sunny, but it is cold.', he: 'יש שמש, אבל קר.', highlight: 'but', emoji: '☀️' },
    ],
    quickTry: {
      promptHe: 'איך מחברים: I am small. I am strong.',
      correct: 'I am small, but I am strong.',
      wrong: 'I am small, but I strong.',
      explainHe: 'קטן אבל חזק: שני רעיונות שונים, אז משתמשים ב-but. בכל חלק צריך am.',
    },
  },
};
