import type { LessonPack } from '../../../lessons/types';

/**
 * Core-plus pack, grade 7 mini-lessons (Feature 42): quantifiers, then too / enough and
 * comparatives. The Bosses get the recap of their unit. Examples never repeat a mission's answers.
 */
export const CORE_PLUS_GRADE_7_LESSONS: LessonPack = {
  'g7-u21-m1': {
    titleHe: 'סופרים או לא סופרים? 🧮',
    ideaHe:
      'דברים שאפשר לספור (apples, friends) הולכים עם many. דברים שלא סופרים (water, sugar, money) הולכים עם much. כך גם בשאלה: How many? או How much?',
    pattern: 'many + countable · much + uncountable',
    examples: [
      { en: 'How many apples are in the bag?', he: 'כמה תפוחים יש בשקית?', highlight: 'How many apples' },
      { en: 'There isn’t much sugar in this tea.', he: 'אין הרבה סוכר בתה הזה.', highlight: 'much sugar' },
      { en: 'We don’t have many chairs for the guests.', he: 'אין לנו הרבה כיסאות לאורחים.', highlight: 'many chairs' },
    ],
    tipHe: 'money הוא לא דבר שסופרים באנגלית: How much money, לא How many money.',
    quickTry: {
      promptHe: 'much או many?',
      questionEn: 'How ____ water do you drink every day?',
      correct: 'much',
      wrong: 'many',
      explainHe: 'את המים לא סופרים אחד אחד, ולכן How much water.',
    },
  },
  'g7-u21-m2': {
    titleHe: 'קצת, אבל לא הרבה 🤏',
    ideaHe:
      'a few ו-a little שניהם אומרים "קצת". a few בא עם דברים שסופרים (a few friends), ו-a little עם דברים שלא סופרים (a little time).',
    pattern: 'a few + plural · a little + uncountable',
    examples: [
      { en: 'I invited a few friends to my party.', he: 'הזמנתי כמה חברים למסיבה שלי.', highlight: 'a few friends' },
      { en: 'Can I have a little milk in my coffee?', he: 'אפשר לקבל קצת חלב בקפה?', highlight: 'a little milk' },
      { en: 'We only need a few minutes to get ready.', he: 'אנחנו צריכים רק כמה דקות כדי להתכונן.', highlight: 'a few minutes' },
    ],
    tipHe: 'אחרי a few בא שם עצם ברבים: a few eggs, לא a few egg.',
    quickTry: {
      promptHe: 'a few או a little?',
      questionEn: 'There is ____ juice left in the bottle.',
      correct: 'a little',
      wrong: 'a few',
      explainHe: 'juice הוא נוזל שלא סופרים, ולכן a little.',
    },
  },
  'g7-u22-m1': {
    titleHe: 'יותר מדי או מספיק? 🎚️',
    ideaHe:
      'too לפני שם התואר אומר "יותר מדי" (too hot). enough אחרי שם התואר אומר "מספיק" (old enough). not … enough אומר שחסר משהו.',
    pattern: 'too + adjective · adjective + enough',
    examples: [
      { en: 'The soup is too hot to eat right now.', he: 'המרק חם מדי לאכילה עכשיו.', highlight: 'too hot' },
      { en: 'Is your little brother old enough to ride a bike?', he: 'האח הקטן שלכם גדול מספיק כדי לרכוב על אופניים?', highlight: 'old enough' },
      { en: 'The room isn’t big enough for a party.', he: 'החדר לא גדול מספיק בשביל מסיבה.', highlight: 'big enough' },
    ],
    tipHe: 'enough בא אחרי שם התואר: fast enough, לא enough fast.',
    quickTry: {
      promptHe: 'מה מתאים?',
      questionEn: 'These shoes are ____ small. I need a bigger size.',
      correct: 'too',
      wrong: 'enough',
      explainHe: 'הנעליים קטנות יותר ממה שצריך, ולכן too small.',
    },
  },
  'g7-u22-m2': {
    titleHe: 'מי מנצח בהשוואה? 🥊',
    ideaHe:
      'למילה קצרה מוסיפים er (fast → faster), ולמילה ארוכה מוסיפים more לפניה (more famous). אחרי ההשוואה בא than. as … as אומר "בדיוק כמו".',
    pattern: 'adjective-er / more + adjective + than · as + adjective + as',
    examples: [
      { en: 'A cheetah is faster than a horse.', he: 'ברדלס מהיר יותר מסוס.', highlight: 'faster than' },
      { en: 'This puzzle is more difficult than the last one.', he: 'הפאזל הזה קשה יותר מהקודם.', highlight: 'more difficult than' },
      { en: 'My bike is as old as my sister’s bike.', he: 'האופניים שלי ישנים כמו האופניים של אחותי.', highlight: 'as old as' },
    ],
    tipHe: 'good הופך ל-better, ו-bad הופך ל-worse. לא gooder!',
    quickTry: {
      promptHe: 'איזו צורה נכונה?',
      questionEn: 'Today is ____ than yesterday. Let’s go to the beach!',
      correct: 'hotter',
      wrong: 'more hot',
      explainHe: 'hot היא מילה קצרה, ולכן מוסיפים er (ומכפילים את t): hotter.',
    },
  },
};
