import type { LessonPack } from '../../../lessons/types';

/** The core-3 source's grade 6 mini-lessons, by mission id. */
export const CORE_3_GRADE_6_LESSONS: LessonPack = {
  'g6-u23-m1': {
    titleHe: 'איך? quickly, carefully 🏃',
    ideaHe:
      'תואר פועל מתאר איך עושים משהו. ברוב המילים מוסיפים ly לתואר: quick → quickly, careful → carefully. הוא בא בדרך כלל אחרי הפועל.',
    pattern: 'תואר + ly → תואר פועל · easy → easily',
    examples: [
      { en: 'Noa runs quickly.', he: 'נועה רצה מהר.', highlight: 'quickly', emoji: '⚡' },
      { en: 'Throw the ball carefully.', he: 'זרקו את הכדור בזהירות.', highlight: 'carefully', emoji: '🏀' },
      { en: 'Ron wins the race easily.', he: 'רון מנצח במרוץ בקלות.', highlight: 'easily', emoji: '😌' },
    ],
    tipHe: 'כשהתואר נגמר ב-y, ה-y הופך ל-i: easy → easily, happy → happily.',
    quickTry: {
      promptHe: 'המילה מתארת איך הוא רץ. מה מתאים?',
      questionEn: 'Tom runs ____ in the race.',
      correct: 'quickly',
      wrong: 'quick',
      explainHe: 'כדי לתאר איך הוא רץ צריך תואר פועל: quick + ly = quickly.',
    },
  },
  'g6-u23-m2': {
    titleHe: 'תוארי פועל מיוחדים: well, hard, fast 🥇',
    ideaHe:
      'יש תוארי פועל בלי ly: התואר good הופך ל-well (She plays well), ו-hard ו-fast נשארים אותו דבר: work hard, run fast.',
    pattern: 'good → well · hard → hard · fast → fast',
    examples: [
      { en: 'Maya sings very well.', he: 'מאיה שרה טוב מאוד.', highlight: 'well', emoji: '👏' },
      { en: 'Dan works hard every day.', he: 'דן עובד קשה כל יום.', highlight: 'hard', emoji: '💪' },
      { en: 'The cheetah runs fast.', he: 'הברדלס רץ מהר.', highlight: 'fast', emoji: '🏃' },
    ],
    tipHe: 'לא אומרים plays good או runs fastly. ו-hardly היא מילה אחרת: כמעט לא.',
    quickTry: {
      promptHe: 'מה מתאים כדי לתאר איך הוא נוהג?',
      questionEn: 'My uncle drives very ____.',
      correct: 'fast',
      wrong: 'fastly',
      explainHe: 'fast לא משתנה: הוא גם תואר וגם תואר פועל, בלי ly.',
    },
  },
};
