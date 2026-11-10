import type { LessonPack } from '../../../lessons/types';

/** The core-3 source's grade 9 mini-lessons, by mission id. */
export const CORE_3_GRADE_9_LESSONS: LessonPack = {
  'g9-u23-m1': {
    titleHe: 'מתארים אנשים: who, that 🧬',
    ideaHe:
      'משפט זיקה מוסיף מידע על שם עצם ובא מיד אחריו. כשמדברים על אנשים משתמשים ב-who או ב-that: a singer who writes her own songs.',
    pattern: 'אדם + who / that + פועל',
    examples: [
      { en: 'He is the coach who trained our team.', he: 'הוא המאמן שאימן את הקבוצה שלנו.', highlight: 'who trained' },
      { en: 'I have an uncle who lives in Canada.', he: 'יש לי דוד שגר בקנדה.', highlight: 'who lives' },
      { en: 'She is the girl that won the spelling contest.', he: 'היא הילדה שזכתה בתחרות האיות.', highlight: 'that won' },
    ],
    tipHe: 'who כבר מחליף את האדם, ולכן לא מוסיפים אחריו he או she: the man who lives here (לא who he lives).',
    quickTry: {
      promptHe: 'מה מתאים לאדם?',
      questionEn: 'I know a boy ____ can speak four languages.',
      correct: 'that',
      wrong: 'where',
      explainHe: 'a boy הוא אדם, ולכן that (או who). where מתאים רק למקומות.',
    },
  },
  'g9-u23-m2': {
    titleHe: 'דברים ומקומות: which, that, where 🏘️',
    ideaHe:
      'על דברים ובעלי חיים משתמשים ב-which או ב-that: a song which we sing at weddings. על מקומות משתמשים ב-where: the street where my parents met.',
    pattern: 'דבר + which / that · מקום + where',
    examples: [
      { en: 'This is the necklace which my grandmother gave me.', he: 'זו השרשרת שסבתא שלי נתנה לי.', highlight: 'which' },
      { en: 'We visited the house where my mother was born.', he: 'ביקרנו בבית שבו אמא שלי נולדה.', highlight: 'where' },
      { en: 'Pita is a bread that many families eat every day.', he: 'פיתה היא לחם שהרבה משפחות אוכלות כל יום.', highlight: 'that' },
    ],
    tipHe: 'that מתאים גם לאנשים וגם לדברים, אבל who רק לאנשים, ו-where רק למקומות.',
    quickTry: {
      promptHe: 'מה מתאים למקום?',
      questionEn: 'This is the park ____ we play football.',
      correct: 'where',
      wrong: 'who',
      explainHe: 'the park הוא מקום, ולכן where.',
    },
  },
};
