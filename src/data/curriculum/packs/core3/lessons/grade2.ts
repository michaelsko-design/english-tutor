import type { LessonPack } from '../../../lessons/types';

/** The core-3 source's grade 2 mini-lessons, by mission id: very short Hebrew, picture examples. */
export const CORE_3_GRADE_2_LESSONS: LessonPack = {
  'g2-u23-m1': {
    titleHe: 'מבקשים יפה: please ו-thank you 🙏',
    ideaHe:
      'כשמבקשים משהו, אומרים Can I have …, please? (אפשר לקבל…, בבקשה?). כשמקבלים, אומרים Thank you. ועל תודה עונים You\'re welcome.',
    pattern: 'Can I have …, please? · Thank you! · You\'re welcome!',
    examples: [
      { en: 'Can I have the ball, please?', he: 'אפשר לקבל את הכדור, בבקשה?', highlight: 'please', emoji: '⚽' },
      { en: 'Thank you for the cake!', he: 'תודה על העוגה!', highlight: 'Thank you', emoji: '🍰' },
      { en: 'You\'re welcome!', he: 'בבקשה! (אין בעד מה)', highlight: 'You\'re welcome', emoji: '😊' },
    ],
    quickTry: {
      promptHe: 'רוצים מים 💧. איך מבקשים יפה?',
      correct: 'Can I have some water, please?',
      wrong: 'Give me water!',
      explainHe: 'בקשה מנומסת מסתיימת ב-please: Can I have some water, please?',
    },
  },
  'g2-u23-m2': {
    titleHe: 'סליחה! I\'m sorry ו-Excuse me 😬',
    ideaHe:
      'I\'m sorry פירושו "אני מצטער" או "אני מצטערת": אומרים את זה כשעושים טעות. Excuse me פירושו "סליחה": אומרים את זה כשפונים למישהו או רוצים לעבור.',
    pattern: 'I\'m sorry! · Excuse me, …',
    examples: [
      { en: 'I\'m sorry, Dan!', he: 'אני מצטער/ת, דן!', highlight: 'I\'m sorry', emoji: '😢' },
      { en: 'Excuse me, where is the door?', he: 'סליחה, איפה הדלת?', highlight: 'Excuse me', emoji: '🚪' },
      { en: 'Excuse me, can you help me?', he: 'סליחה, אפשר עזרה?', highlight: 'Excuse me', emoji: '✋' },
    ],
    quickTry: {
      promptHe: 'חבר אומר לכם I\'m sorry. מה עונים בנימוס?',
      correct: 'That\'s OK.',
      wrong: 'Go away!',
      explainHe: 'כשמישהו מבקש סליחה, עונים בנימוס: That\'s OK (זה בסדר).',
    },
  },
};
