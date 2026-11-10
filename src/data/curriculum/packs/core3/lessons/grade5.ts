import type { LessonPack } from '../../../lessons/types';

/** The core-3 source's grade 5 mini-lessons, by mission id. */
export const CORE_3_GRADE_5_LESSONS: LessonPack = {
  'g5-u23-m1': {
    titleHe: 'מדברים על העתיד: will 🚀',
    ideaHe:
      'כדי לומר מה יקרה בעתיד שמים will לפני הפועל: I will travel (אטייל). אחרי will הפועל בא בצורה הבסיסית, בלי s ובלי to.',
    pattern: 'will + פועל בסיסי',
    examples: [
      { en: 'One day people will live on Mars.', he: 'יום אחד אנשים יגורו על מאדים.', highlight: 'will live', emoji: '🚀' },
      { en: 'Maybe I will be rich.', he: 'אולי אהיה עשיר/ה.', highlight: 'will be', emoji: '💰' },
      { en: 'It will not rain tomorrow.', he: 'מחר לא ירד גשם.', highlight: 'will not', emoji: '🌤️' },
    ],
    tipHe: 'will לא משתנה: I will, she will, they will. ובשלילה: will not או won\'t.',
    quickTry: {
      promptHe: 'מה מתאים אחרי will?',
      questionEn: 'In the future, I will ____ Chinese.',
      correct: 'speak',
      wrong: 'speaks',
      explainHe: 'אחרי will הפועל בא בלי s: will speak.',
    },
  },
  'g5-u23-m2': {
    titleHe: 'שואלים על העתיד: Will you…? ❓',
    ideaHe:
      'כדי לשאול על העתיד מתחילים ב-Will: Will you bake a cake? עונים בקצרה: Yes, I will או No, I won\'t.',
    pattern: 'Will + you + פועל…? → Yes, I will. / No, I won\'t.',
    examples: [
      { en: 'Will you sing in the show?', he: 'אתם תשירו בהופעה?', highlight: 'Will you', emoji: '🎤' },
      { en: 'When will the movie start?', he: 'מתי הסרט יתחיל?', highlight: 'will the movie start', emoji: '🎬' },
      { en: "No, I won't swim in the river.", he: 'לא, אני לא אשחה בנהר.', highlight: "won't", emoji: '🌊' },
    ],
    tipHe: 'לא מוסיפים do לשאלה עם will: Will you help me?, ולא Do you will help me?',
    quickTry: {
      promptHe: 'איך שואלים "תבואו למסיבה שלי?"',
      correct: 'Will you come to my party?',
      wrong: 'Will you to come to my party?',
      explainHe: 'אחרי Will you בא הפועל בלי to: Will you come…?',
    },
  },
};
