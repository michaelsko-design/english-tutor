import type { LessonPack } from '../../../lessons/types';

/** The core-3 source's grade 8 mini-lessons, by mission id. */
export const CORE_3_GRADE_8_LESSONS: LessonPack = {
  'g8-u23-m1': {
    titleHe: 'סביל בהווה: is made, are grown 🏭',
    ideaHe:
      'בסביל מתמקדים במה שעושים לדבר, ולא במי שעושה אותו: Bread is baked every morning. בונים אותו מ-am / is / are ואחריו V3 (הצורה השלישית של הפועל).',
    pattern: 'is / are + V3 · Oranges are grown · Paper is made',
    examples: [
      { en: 'Bread is baked here every morning.', he: 'כאן אופים לחם בכל בוקר.', highlight: 'is baked' },
      { en: 'Bananas are grown near the Sea of Galilee.', he: 'מגדלים בננות ליד הכנרת.', highlight: 'are grown' },
      { en: 'These bags are made of old clothes.', he: 'התיקים האלה עשויים מבגדים ישנים.', highlight: 'are made' },
    ],
    tipHe: 'בפעלים רגילים V3 נגמר ב-ed (cleaned, used), אבל יש פעלים לא רגילים: make → made, grow → grown, sell → sold.',
    quickTry: {
      promptHe: 'מה מתאים לשם עצם ברבים?',
      questionEn: 'Many flowers ____ grown in the Negev.',
      correct: 'are',
      wrong: 'is',
      explainHe: 'flowers הם רבים, ולכן are grown.',
    },
  },
  'g8-u23-m2': {
    titleHe: 'שאלות בסביל ו-by 💻',
    ideaHe:
      'בשאלה בסביל, is / are באים לפני הנושא: Is it made in Israel? Where are they sold? כדי לומר מי עושה את הפעולה מוסיפים by: The app is used by teachers.',
    pattern: 'Is / Are + נושא + V3? · … by + מי שעושה',
    examples: [
      { en: 'Is this game played all over the world?', he: 'משחקים במשחק הזה בכל העולם?', highlight: 'Is this game played' },
      { en: 'Where are these robots built?', he: 'איפה בונים את הרובוטים האלה?', highlight: 'are these robots built' },
      { en: 'The website is visited by thousands of students.', he: 'אלפי תלמידים מבקרים באתר.', highlight: 'by thousands of students' },
    ],
    tipHe: 'בשאלה בסביל לא משתמשים ב-do / does: Is it used…? (לא Does it used…?).',
    quickTry: {
      promptHe: 'איזו מילה פותחת את השאלה בסביל?',
      questionEn: '____ these phones made in China?',
      correct: 'Are',
      wrong: 'Do',
      explainHe: 'בסביל השאלה נפתחת ב-is / are, ו-phones הם רבים, ולכן Are.',
    },
  },
};
