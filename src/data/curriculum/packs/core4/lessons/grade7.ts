import type { LessonPack } from '../../../lessons/types';

/** The core-4 source's grade 7 mini-lessons, by mission id. */
export const CORE_4_GRADE_7_LESSONS: LessonPack = {
  'g7-u24-m1': {
    titleHe: 'מכונה ש…: that / which 🤖',
    ideaHe:
      'כדי להסביר על איזה דבר מדברים, מוסיפים אחרי שם העצם משפט שמתחיל ב-that או which ("ש..."): a machine that washes dishes. המשפט הזה מגדיר את הדבר, ולכן אין לפניו פסיק.',
    pattern: 'thing + that / which + verb …',
    examples: [
      { en: 'A fridge is a machine that keeps food cold.', he: 'מקרר הוא מכונה שמקררת את האוכל.', highlight: 'that keeps' },
      { en: 'I lost the key which opens the gate.', he: 'איבדתי את המפתח שפותח את השער.', highlight: 'which opens' },
      { en: 'Where is the book that you bought?', he: 'איפה הספר שקניתם?', highlight: 'that you bought' },
    ],
    tipHe: 'אחרי that או which לא חוזרים על הדבר (לא that you bought it). אפשר גם בלי that: the book you bought.',
    quickTry: {
      promptHe: 'איזה משפט נכון?',
      questionEn: 'A camera is a device ____ takes pictures.',
      correct: 'A camera is a device that takes pictures.',
      wrong: 'A camera is a device who takes pictures.',
      explainHe: 'למכשיר (דבר) משתמשים ב-that או which, לא ב-who.',
    },
  },
  'g7-u24-m2': {
    titleHe: 'האדם ש…: who 👷',
    ideaHe:
      'כשמסבירים על איזה אדם מדברים, משתמשים ב-who ("ש..."): the girl who sings, the man who fixed my bike. אפשר גם that, אבל לא which.',
    pattern: 'person + who + verb …',
    examples: [
      { en: 'A pilot is a person who flies planes.', he: 'טייס הוא אדם שמטיס מטוסים.', highlight: 'who flies' },
      { en: 'The boy who sits next to me is new.', he: 'הילד שיושב לידי חדש.', highlight: 'who sits' },
      { en: 'Do you know the woman who opened the café?', he: 'אתם מכירים את האישה שפתחה את בית הקפה?', highlight: 'who opened' },
    ],
    tipHe: 'אחרי who לא חוזרים על he או she: the girl who won (לא who she won).',
    quickTry: {
      promptHe: 'איזה משפט נכון?',
      questionEn: 'A chef is a person ____ cooks in a restaurant.',
      correct: 'A chef is a person who cooks in a restaurant.',
      wrong: 'A chef is a person which cooks in a restaurant.',
      explainHe: 'לאדם משתמשים ב-who.',
    },
  },
};
