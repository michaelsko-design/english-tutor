import type { LessonPack } from '../../../lessons/types';

/** The core-4 source's grade 12 mini-lessons, by mission id. */
export const CORE_4_GRADE_12_LESSONS: LessonPack = {
  'g12-u24-m1': {
    titleHe: 'דילמות: If + עבר, would 🤔',
    ideaHe:
      'בדיון על מוסר שואלים על מצב דמיוני: If + עבר, ובחלק השני would + פועל. כדי לדבר על העבר שלא קרה: If + had + V3, would have + V3.',
    pattern: 'If + past, would + verb · If + had + V3, would have + V3',
    examples: [
      { en: 'If I saw a friend in trouble, I would help him.', he: 'אם הייתי רואה חבר בצרה, הייתי עוזר/ת לו.', highlight: 'would help' },
      { en: 'Would you lie to protect a friend?', he: 'הייתם משקרים כדי להגן על חבר?', highlight: 'Would you lie' },
      { en: 'If she had known, she would have helped.', he: 'אילו היא הייתה יודעת, היא הייתה עוזרת.', highlight: 'had known' },
    ],
    tipHe: 'בכתיבה רשמית אומרים If I were (גם עם I, he ו-she): If I were the principal…',
    quickTry: {
      promptHe: 'איזה משפט נכון?',
      questionEn: 'If you ____ a lot of money, what would you do?',
      correct: 'If you found a lot of money, what would you do?',
      wrong: 'If you will find a lot of money, what would you do?',
      explainHe: 'בתנאי דמיוני אחרי If בא עבר: found.',
    },
  },
  'g12-u24-m2': {
    titleHe: 'סביל עם מילות עזר: should be + V3 🛑',
    ideaHe:
      'כשמדברים על חוקים ועל מה שצריך לעשות, ולא חשוב מי עושה, משתמשים בסביל עם should / must / can: should be banned, must be kept, can be used.',
    pattern: 'should / must / can + be + V3 · should not be + V3',
    examples: [
      { en: 'Smoking should be banned in parks.', he: 'צריך לאסור עישון בפארקים.', highlight: 'should be banned' },
      { en: 'Dogs must be kept on a leash.', he: 'חובה להחזיק כלבים ברצועה.', highlight: 'must be kept' },
      { en: 'This room can be used for meetings.', he: 'אפשר להשתמש בחדר הזה לפגישות.', highlight: 'can be used' },
    ],
    tipHe: 'בשלילה not בא אחרי מילת העזר (should not be allowed), ובשאלה מילת העזר ראשונה: Should it be banned?',
    quickTry: {
      promptHe: 'איזה משפט נכון?',
      questionEn: 'Rare plants ____ by law.',
      correct: 'Rare plants must be protected by law.',
      wrong: 'Rare plants must protected by law.',
      explainHe: 'סביל: must be + V3 (protected).',
    },
  },
};
