import type { LessonPack } from '../../../lessons/types';

/** The holidays pack's grade 12 mini-lessons, by mission id: review grammar on festival topics. */
export const HOLIDAYS_GRADE_12_LESSONS: LessonPack = {
  'g12-u31-m1': {
    titleHe: 'עוד רעיון או רעיון הפוך? 🍎',
    ideaHe:
      'Furthermore ו-Moreover מוסיפים טיעון באותו כיוון. However ו-In contrast מציגים רעיון מנוגד. בתחילת משפט שמים אחריהם פסיק.',
    pattern: 'Moreover, … · However, …',
    examples: [
      { en: 'The holiday is joyful. Moreover, it brings families together.', he: 'החג שמח. יתרה מזאת, הוא מקרב משפחות.', highlight: 'Moreover,' },
      { en: 'Guests are welcome. However, the sukkah is quite small.', he: 'אורחים מתקבלים בברכה. אולם הסוכה די קטנה.', highlight: 'However,' },
      { en: 'Apples are sweet. Furthermore, they are healthy.', he: 'תפוחים מתוקים. נוסף על כך, הם בריאים.', highlight: 'Furthermore,' },
    ],
    tipHe: 'However לא מוסיף רעיון דומה. הוא תמיד מסמן שינוי כיוון.',
    quickTry: {
      promptHe: 'הוספה או ניגוד?',
      questionEn: 'The new year starts in autumn. ____, the school year starts then too.',
      correct: 'Moreover',
      wrong: 'However',
      explainHe: 'המשפט השני מוסיף עובדה באותו כיוון, ולכן Moreover.',
    },
  },
  'g12-u31-m2': {
    titleHe: 'למרות ש… 🕯️',
    ideaHe:
      'although בא לפני משפט שלם עם נושא ופועל. despite ו-in spite of באים לפני שם עצם או לפני פועל עם ing.',
    pattern: 'although + clause · despite + noun / V-ing',
    examples: [
      { en: 'Although it was windy, we lit the candles outside.', he: 'למרות שנשבה רוח, הדלקנו את הנרות בחוץ.', highlight: 'Although it was' },
      { en: 'Despite the cold, the square was crowded.', he: 'למרות הקור, הכיכר הייתה מלאה.', highlight: 'Despite the cold' },
      { en: 'In spite of feeling tired, she baked doughnuts.', he: 'למרות שהייתה עייפה, היא אפתה סופגניות.', highlight: 'In spite of feeling' },
    ],
    tipHe: 'לא אומרים despite of. אומרים despite או in spite of.',
    quickTry: {
      promptHe: 'שם עצם או משפט שלם?',
      questionEn: '____ the storm, the lights stayed on all night.',
      correct: 'Despite',
      wrong: 'Although',
      explainHe: 'the storm הוא שם עצם, ולכן Despite.',
    },
  },
  'g12-u32-m1': {
    titleHe: 'מסקנה או ביקורת על העבר? 🌱',
    ideaHe:
      'must have + V3 הוא מסקנה בטוחה על העבר. might have + V3 הוא אפשרות. should have + V3 הוא ביקורת על משהו שלא נעשה.',
    pattern: 'must / might / should + have + V3',
    examples: [
      { en: 'The ground is wet. It must have rained last night.', he: 'האדמה רטובה. בטח ירד גשם אתמול בלילה.', highlight: 'must have rained' },
      { en: 'He might have forgotten his costume at home.', he: 'ייתכן שהוא שכח את התחפושת בבית.', highlight: 'might have forgotten' },
      { en: 'We should have bought the tickets earlier.', he: 'היינו צריכים לקנות את הכרטיסים מוקדם יותר.', highlight: 'should have bought' },
    ],
    tipHe: 'אחרי have תמיד בא V3: must have gone, ולא must have go.',
    quickTry: {
      promptHe: 'אין ספק. מה מתאים?',
      questionEn: 'The tree is huge. Someone ____ it many years ago.',
      correct: 'must have planted',
      wrong: 'should have planted',
      explainHe: 'העץ הענק הוא ראיה, והמסקנה בטוחה: must have planted.',
    },
  },
  'g12-u32-m2': {
    titleHe: 'ולכן… תוצאה ופיסוק 🎆',
    ideaHe:
      'consequently, therefore ו-as a result מציגים תוצאה. כשהם מחברים שני משפטים שלמים, לפניהם באה נקודה או נקודה-פסיק, ואחריהם פסיק.',
    pattern: 'clause; consequently, clause.',
    examples: [
      { en: 'The fields were dry; consequently, the harvest was small.', he: 'השדות היו יבשים; כתוצאה מכך, היבול היה קטן.', highlight: 'consequently,' },
      { en: 'Prices rose in summer. Therefore, we stayed in Israel.', he: 'המחירים עלו בקיץ. לכן נשארנו בארץ.', highlight: 'Therefore,' },
      { en: 'The road was closed. As a result, we changed our route.', he: 'הכביש היה סגור. כתוצאה מכך, שינינו את המסלול.', highlight: 'As a result,' },
    ],
    tipHe: 'therefore הוא לא but. הוא מציג תוצאה, לא ניגוד.',
    quickTry: {
      promptHe: 'תוצאה או ניגוד?',
      questionEn: 'It was very hot. ____, the pool was crowded.',
      correct: 'Therefore',
      wrong: 'However',
      explainHe: 'הצפיפות בבריכה היא תוצאה של החום, ולכן Therefore.',
    },
  },
};
