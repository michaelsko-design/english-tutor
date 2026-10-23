import type { LessonPack } from '../../../lessons/types';

/** The holidays pack's grade 5 mini-lessons, by mission id. Both Bosses get the recap of their unit. */
export const HOLIDAYS_GRADE_5_LESSONS: LessonPack = {
  'g5-u31-m1': {
    titleHe: 'There is או There are? 🍎',
    ideaHe: 'כדי להגיד "יש" על דבר אחד אומרים There is, ועל כמה דברים אומרים There are.',
    pattern: 'There is + one · There are + many',
    examples: [
      { en: 'There is a big cake on the table.', he: 'יש עוגה גדולה על השולחן.', highlight: 'There is', emoji: '🎂' },
      { en: 'There are three candles here.', he: 'יש כאן שלושה נרות.', highlight: 'There are', emoji: '🕯️' },
      { en: 'There is a gift for you.', he: 'יש מתנה בשבילכם.', highlight: 'There is', emoji: '🎁' },
    ],
    tipHe: 'There are בא עם שם עצם ברבים, עם s בסוף: There are two plates.',
    quickTry: {
      promptHe: 'is או are?',
      questionEn: 'There ____ five guests at our table.',
      correct: 'are',
      wrong: 'is',
      explainHe: 'five guests הם רבים, ולכן There are.',
    },
  },
  'g5-u31-m2': {
    titleHe: 'איפה זה? in, on, under 🌿',
    ideaHe: 'מילות מקום אומרות איפה משהו נמצא: in (בתוך), on (על), under (מתחת), next to (ליד).',
    pattern: 'in · on · under · next to',
    examples: [
      { en: 'The cat is under the chair.', he: 'החתול מתחת לכיסא.', highlight: 'under', emoji: '🐈' },
      { en: 'The lamp is on the table.', he: 'המנורה על השולחן.', highlight: 'on', emoji: '💡' },
      { en: 'My bag is next to the door.', he: 'התיק שלי ליד הדלת.', highlight: 'next to', emoji: '🎒' },
    ],
    tipHe: 'next to הן שתי מילים שבאות יחד, כמו "ליד".',
    quickTry: {
      promptHe: 'איך אומרים "בתוך"?',
      questionEn: 'The apples are ____ the box.',
      correct: 'in',
      wrong: 'under',
      explainHe: 'in אומר "בתוך": התפוחים בתוך הקופסה.',
    },
  },
  'g5-u32-m1': {
    titleHe: 'can ו-can’t בחגים 🎭',
    ideaHe: 'can אומר "יכול", ו-can’t אומר "לא יכול". אחרי can בא פועל בסיסי, בלי to ובלי s.',
    pattern: "can / can't + verb",
    examples: [
      { en: 'We can dance at the party.', he: 'אנחנו יכולים לרקוד במסיבה.', highlight: 'can dance', emoji: '💃' },
      { en: "My brother can't see in this mask.", he: 'אחי לא יכול לראות עם המסכה הזאת.', highlight: "can't see", emoji: '🙈' },
      { en: 'She can sing a holiday song.', he: 'היא יודעת לשיר שיר חג.', highlight: 'can sing', emoji: '🎤' },
    ],
    tipHe: 'עם he / she לא מוסיפים s: she can sing, ולא she can sings.',
    quickTry: {
      promptHe: 'מה נכון אחרי can?',
      questionEn: 'He can ____ a tall tree.',
      correct: 'climb',
      wrong: 'climbs',
      explainHe: 'אחרי can בא הפועל הבסיסי, בלי s: can climb.',
    },
  },
  'g5-u32-m2': {
    titleHe: 'מה השעה? ⏰',
    ideaHe: 'שואלים What time is it? או What time is the party? ועונים עם at: at six o’clock, at half past seven.',
    pattern: "What time…? · at + o'clock / half past",
    examples: [
      { en: 'The party is at six o’clock.', he: 'המסיבה בשעה שש.', highlight: 'at six o’clock', emoji: '🕕' },
      { en: 'We eat at half past eight.', he: 'אנחנו אוכלים בשמונה וחצי.', highlight: 'half past eight', emoji: '🍽️' },
      { en: 'What time is the show?', he: 'באיזו שעה ההצגה?', highlight: 'What time', emoji: '❓' },
    ],
    tipHe: 'half past seven זה "שבע וחצי", לא "שש וחצי". סופרים מהשעה שעברה.',
    quickTry: {
      promptHe: 'איך אומרים 4:30?',
      correct: 'half past four',
      wrong: 'half past five',
      explainHe: 'half past four = ארבע וחצי, חצי שעה אחרי ארבע.',
    },
  },
};
