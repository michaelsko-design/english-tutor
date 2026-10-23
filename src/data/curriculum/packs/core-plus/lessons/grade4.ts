import type { LessonPack } from '../../../lessons/types';

/**
 * The core-plus pack's grade 4 mini-lessons (Feature 42): this / that, these / those, then
 * imperatives and have got. The Bosses (How much…?, health review) get the automatic recap.
 */
export const CORE_PLUS_GRADE_4_LESSONS: LessonPack = {
  'g4-u21-m1': {
    titleHe: 'this קרוב, that רחוק 👉',
    ideaHe: 'על דבר אחד שקרוב אלינו אומרים this (הזה). על דבר אחד שרחוק מאיתנו אומרים that (ההוא).',
    pattern: 'this + near · that + far',
    examples: [
      { en: 'This shirt is soft.', he: 'החולצה הזאת רכה.', highlight: 'This shirt', emoji: '👕' },
      { en: 'That hat is funny.', he: 'הכובע ההוא מצחיק.', highlight: 'That hat', emoji: '🎩' },
      { en: 'I want this skirt.', he: 'אני רוצה את החצאית הזאת.', highlight: 'this skirt', emoji: '👗' },
    ],
    tipHe: 'עוזר לחשוב על היד: this מחזיקים ביד, that רואים מרחוק.',
    quickTry: {
      promptHe: 'הכובע ממש ביד שלכם. מה מתאים?',
      questionEn: '____ hat is green.',
      correct: 'This',
      wrong: 'That',
      explainHe: 'הכובע קרוב, ולכן this.',
    },
  },
  'g4-u21-m2': {
    titleHe: 'these ו-those: הרבה דברים 👖',
    ideaHe: 'על הרבה דברים קרובים אומרים these (האלה), ועל הרבה דברים רחוקים those (ההם). אחריהם בא are.',
    pattern: 'these / those + things + are',
    examples: [
      { en: 'These socks are pink.', he: 'הגרביים האלה ורודים.', highlight: 'These socks are', emoji: '🧦' },
      { en: 'Those shoes are big.', he: 'הנעליים ההן גדולות.', highlight: 'Those shoes are', emoji: '👟' },
    ],
    tipHe: "ג'ינס, מכנסיים ומשקפיים הם תמיד ברבים באנגלית: these jeans.",
    quickTry: {
      promptHe: 'הנעליים רחוקות, ליד הדלת. מה מתאים?',
      questionEn: '____ shoes are mine.',
      correct: 'Those',
      wrong: 'This',
      explainHe: 'יש כמה נעליים והן רחוקות, ולכן those.',
    },
  },
  'g4-u22-m1': {
    titleHe: 'הוראות: Wash! Drink! 🚿',
    ideaHe: 'כדי לתת הוראה מתחילים בפועל עצמו: Drink water! כדי לומר "אל" מוסיפים Don’t לפני: Don’t run!',
    pattern: 'verb! · Don’t + verb!',
    examples: [
      { en: 'Eat an apple every day.', he: 'אכלו תפוח כל יום.', highlight: 'Eat', emoji: '🍎' },
      { en: 'Sleep nine hours at night.', he: 'ישנו תשע שעות בלילה.', highlight: 'Sleep', emoji: '😴' },
      { en: "Don't run in the hall.", he: 'אל תרוצו במסדרון.', highlight: "Don't run", emoji: '🏃' },
    ],
    tipHe: 'בהוראה אין you בהתחלה: אומרים Close the door, לא You close the door.',
    quickTry: {
      promptHe: 'איך אומרים "אל תאכלו בכיתה"?',
      correct: "Don't eat in class.",
      wrong: 'No eat in class.',
      explainHe: 'הוראה של "אל" מתחילה ב-Don’t ואחריה הפועל.',
    },
  },
  'g4-u22-m2': {
    titleHe: 'have got: מה יש לי? 🧍',
    ideaHe: 'have got אומר "יש לי": I have got two hands. עם he, she, it אומרים has got.',
    pattern: 'I / we / they have got · he / she / it has got',
    examples: [
      { en: 'We have got ten fingers.', he: 'יש לנו עשר אצבעות.', highlight: 'have got', emoji: '🖐️' },
      { en: 'An elephant has got big ears.', he: 'לפיל יש אוזניים גדולות.', highlight: 'has got', emoji: '🐘' },
      { en: 'My sister has got long hair.', he: 'לאחותי יש שיער ארוך.', highlight: 'has got', emoji: '👧' },
    ],
    quickTry: {
      promptHe: 'מה מתאים?',
      questionEn: 'A frog ____ got long legs.',
      correct: 'has',
      wrong: 'have',
      explainHe: 'צפרדע היא it, ולכן has got.',
    },
  },
};
