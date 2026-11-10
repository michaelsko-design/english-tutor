import type { LessonPack } from '../../../lessons/types';

/** The core-3 source's grade 7 mini-lessons, by mission id. */
export const CORE_3_GRADE_7_LESSONS: LessonPack = {
  'g7-u23-m1': {
    titleHe: 'מזמינים בנימוס: would like ☕',
    ideaHe:
      "would like היא הדרך המנומסת לומר \"רוצה\". אומרים I would like (בקיצור I'd like), ושואלים Would you like…? אחרי would like בא שם עצם (a sandwich) או to ופועל (to order).",
    pattern: "I'd like + שם עצם · I'd like to + פועל · Would you like…?",
    examples: [
      { en: "I'd like a slice of pizza, please.", he: 'הייתי רוצה משולש פיצה, בבקשה.', highlight: "I'd like" },
      { en: 'Would you like some water?', he: 'תרצו קצת מים?', highlight: 'Would you like' },
      { en: 'We would like to order now.', he: 'היינו רוצים להזמין עכשיו.', highlight: 'would like to order' },
    ],
    tipHe: 'אחרי would הפועל נשאר בצורת הבסיס: She would like (לא would likes). במסעדה I want נשמע פחות מנומס.',
    quickTry: {
      promptHe: 'מה מתאים לשאלה המנומסת?',
      questionEn: '____ you like a cup of tea?',
      correct: 'Would',
      wrong: 'Do',
      explainHe: 'כדי להציע בנימוס שואלים Would you like…? ("תרצו…?").',
    },
  },
  'g7-u23-m2': {
    titleHe: 'בעצמי, בעצמנו: myself, ourselves 🪞',
    ideaHe:
      'כשהפעולה חוזרת אל מי שעושה אותה, משתמשים במילה עם self (ביחיד) או selves (ברבים): I hurt myself. אותן מילים אומרות גם "בעצמי, בלי עזרה": We cooked it ourselves.',
    pattern: 'myself · yourself · himself · herself · itself · ourselves · yourselves · themselves',
    examples: [
      { en: 'I taught myself to play the guitar.', he: 'לימדתי את עצמי לנגן בגיטרה.', highlight: 'myself' },
      { en: 'The children cleaned the classroom themselves.', he: 'הילדים ניקו את הכיתה בעצמם.', highlight: 'themselves' },
      { en: 'Enjoy yourselves at the party!', he: 'תיהנו במסיבה!', highlight: 'yourselves' },
    ],
    tipHe: 'by myself פירושו "לבד": He lives by himself. ואין באנגלית hisself או theirselves.',
    quickTry: {
      promptHe: 'איזו מילה מתאימה ל-we?',
      questionEn: 'We built the sand castle ____.',
      correct: 'ourselves',
      wrong: 'ourself',
      explainHe: 'we הם רבים, ולכן ourselves, עם selves בסוף.',
    },
  },
};
