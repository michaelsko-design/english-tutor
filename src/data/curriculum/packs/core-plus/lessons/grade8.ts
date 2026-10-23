import type { LessonPack } from '../../../lessons/types';

/**
 * Core-plus pack, grade 8 mini-lessons (Feature 42): used to, then gerunds and infinitives.
 * The Bosses get the recap of their unit. Examples never repeat a mission's answers.
 */
export const CORE_PLUS_GRADE_8_LESSONS: LessonPack = {
  'g8-u21-m1': {
    titleHe: 'פעם זה היה ככה 📻',
    ideaHe:
      'used to + V1 מתאר הרגל או מצב שהיו בעבר ונגמרו. הוא אומר "נהגו ל..." או "פעם...". הפועל שאחריו תמיד בצורת הבסיס.',
    pattern: 'used to + V1',
    examples: [
      { en: 'My dad used to have long hair.', he: 'פעם היה לאבא שלי שיער ארוך.', highlight: 'used to have' },
      { en: 'We used to live in a small flat in Haifa.', he: 'פעם גרנו בדירה קטנה בחיפה.', highlight: 'used to live' },
      { en: 'Grandma used to walk to work every day.', he: 'סבתא נהגה ללכת ברגל לעבודה בכל יום.', highlight: 'used to walk' },
    ],
    tipHe: 'used to מתאים רק לעבר. על הרגל של היום אומרים usually: I usually walk.',
    quickTry: {
      promptHe: 'מה מתאים?',
      questionEn: 'My uncle ____ in a band when he was young.',
      correct: 'used to play',
      wrong: 'used to playing',
      explainHe: 'אחרי used to בא פועל בצורת הבסיס: used to play.',
    },
  },
  'g8-u21-m2': {
    titleHe: 'לא נהגו לעשות? שואלים! ❓',
    ideaHe:
      'בשלילה ובשאלה עוזר did, ולכן used מאבד את ה-d: didn’t use to, Did you use to? הפועל שאחריו נשאר בצורת הבסיס.',
    pattern: 'didn’t use to + V1 · Did … use to + V1?',
    examples: [
      { en: 'Did your parents use to watch cartoons?', he: 'ההורים שלכם נהגו לצפות בסרטים מצוירים?', highlight: 'Did your parents use to' },
      { en: 'I didn’t use to like vegetables.', he: 'פעם לא אהבתי ירקות.', highlight: 'didn’t use to' },
      { en: 'Where did you use to play after school?', he: 'איפה נהגתם לשחק אחרי בית הספר?', highlight: 'did you use to' },
    ],
    tipHe: 'שימו לב: אחרי did כותבים use to, ולא used to.',
    quickTry: {
      promptHe: 'איזו צורה נכונה?',
      questionEn: 'My sister ____ to be afraid of dogs, but now she loves them.',
      correct: 'used',
      wrong: 'use',
      explainHe: 'זה משפט חיובי בלי did, ולכן used to עם d.',
    },
  },
  'g8-u22-m1': {
    titleHe: 'פעלים שאוהבים ing 🎧',
    ideaHe:
      'אחרי enjoy, avoid, finish, mind ו-consider בא פועל עם ing (gerund). גם בתחילת משפט, פועל עם ing יכול להיות הנושא: Swimming is fun.',
    pattern: 'enjoy / avoid / finish / mind + verb-ing',
    examples: [
      { en: 'My mom enjoys gardening on Saturday mornings.', he: 'אמא שלי נהנית לעבוד בגינה בשבת בבוקר.', highlight: 'enjoys gardening' },
      { en: 'Dancing is the best way to relax.', he: 'ריקוד הוא הדרך הכי טובה להירגע.', highlight: 'Dancing' },
      { en: 'Do you mind closing the window?', he: 'אכפת לכם לסגור את החלון?', highlight: 'mind closing' },
    ],
    tipHe: 'לא אומרים enjoy to swim. אומרים enjoy swimming.',
    quickTry: {
      promptHe: 'מה בא אחרי avoid?',
      questionEn: 'Try to avoid ____ your phone before bed.',
      correct: 'using',
      wrong: 'to use',
      explainHe: 'אחרי avoid בא פועל עם ing: avoid using.',
    },
  },
  'g8-u22-m2': {
    titleHe: 'החלטתי ל... to! 🚦',
    ideaHe:
      'אחרי decide, want, hope, promise, refuse, afford ו-manage בא to ופועל בצורת הבסיס (infinitive). כך מתארים החלטות, תקוות והבטחות.',
    pattern: 'decide / promise / refuse + to + V1',
    examples: [
      { en: 'We hope to visit Rome next summer.', he: 'אנחנו מקווים לבקר ברומא בקיץ הבא.', highlight: 'hope to visit' },
      { en: 'The cat refused to come down from the tree.', he: 'החתול סירב לרדת מהעץ.', highlight: 'refused to come' },
      { en: 'Dana promised to return my book on Monday.', he: 'דנה הבטיחה להחזיר את הספר שלי ביום שני.', highlight: 'promised to return' },
    ],
    tipHe: 'enjoy ו-avoid מקבלים ing, אבל want ו-decide מקבלים to. כדאי לזכור את שתי הקבוצות.',
    quickTry: {
      promptHe: 'מה בא אחרי want?',
      questionEn: 'I want ____ a new language this year.',
      correct: 'to learn',
      wrong: 'learning',
      explainHe: 'אחרי want בא to + V1: want to learn.',
    },
  },
};
