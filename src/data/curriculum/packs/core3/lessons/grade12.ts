import type { LessonPack } from '../../../lessons/types';

/** The core-3 source's grade 12 mini-lessons, by mission id. */
export const CORE_3_GRADE_12_LESSONS: LessonPack = {
  'g12-u23-m1': {
    titleHe: 'מילות רצף בחיבור 📝',
    ideaHe:
      'מילות רצף מראות לקורא את סדר הרעיונות: First (of all) לפתיחה, Then או After that להמשך, ו-Finally לרעיון האחרון. To sum up פותח את הסיכום.',
    pattern: 'First of all → Then / After that → Finally → To sum up',
    examples: [
      { en: 'First of all, plan your answer.', he: 'קודם כול, תכננו את התשובה.', highlight: 'First of all' },
      { en: 'After that, write one paragraph for each idea.', he: 'אחרי זה, כתבו פסקה אחת לכל רעיון.', highlight: 'After that' },
      { en: 'Finally, read your essay again.', he: 'לבסוף, קראו את החיבור שוב.', highlight: 'Finally' },
    ],
    tipHe: 'אחרי מילת רצף בתחילת משפט שמים פסיק: First of all, … After that, …',
    quickTry: {
      promptHe: 'מה פותח את הצעד האחרון?',
      questionEn: '____, check your spelling and hand in the essay.',
      correct: 'Finally',
      wrong: 'First of all',
      explainHe: 'זה הצעד האחרון לפני ההגשה, ולכן Finally.',
    },
  },
  'g12-u23-m2': {
    titleHe: 'מילות קישור: and, but, so 🔗',
    ideaHe:
      'מילות קישור מחברות שני משפטים: and מוסיף, but ו-yet מנגידים, so מציג תוצאה, ו-or מציג אפשרות. כשהמשפטים ארוכים, שמים פסיק לפני מילת הקישור.',
    pattern: 'משפט, + and / but / yet / so / or + משפט',
    examples: [
      { en: 'The book was long, but I enjoyed every page.', he: 'הספר היה ארוך, אבל נהניתי מכל עמוד.', highlight: 'but' },
      { en: 'It was getting dark, so we went home.', he: 'התחיל להחשיך, אז הלכנו הביתה.', highlight: 'so' },
      { en: 'We can meet today, or we can wait until Sunday.', he: 'אפשר להיפגש היום, או שאפשר לחכות עד יום ראשון.', highlight: 'or' },
    ],
    tipHe: 'yet דומה ל-but, אבל רשמי יותר ומתאים לחיבור: It was expensive, yet many people bought it.',
    quickTry: {
      promptHe: 'איזו מילה מציגה תוצאה?',
      questionEn: 'The road was closed, ____ we took another way.',
      correct: 'so',
      wrong: 'or',
      explainHe: 'הדרך הייתה סגורה, ובגלל זה נסענו בדרך אחרת: זו תוצאה, ולכן so.',
    },
  },
};
