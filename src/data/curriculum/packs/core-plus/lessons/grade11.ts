import type { LessonPack } from '../../../lessons/types';

/** The core-plus pack's grade 11 mini-lessons, by mission id: wish / if only, then the causative. */
export const CORE_PLUS_GRADE_11_LESSONS: LessonPack = {
  'g11-u21-m1': {
    titleHe: 'הלוואי שעכשיו… 🌟',
    ideaHe:
      'כדי להביע משאלה על ההווה, אומרים I wish או If only, ואחריהם Past Simple. הפועל נראה כמו עבר, אבל מדברים על עכשיו. עם be משתמשים ב-were.',
    pattern: 'I wish / If only + Past Simple',
    examples: [
      { en: 'I wish I had more free time.', he: 'הלוואי שהיה לי יותר זמן פנוי.', highlight: 'had' },
      { en: 'If only it were Friday today!', he: 'הלוואי שהיום היה יום שישי!', highlight: 'If only it were' },
      { en: 'She wishes she spoke Arabic fluently.', he: 'היא הייתה רוצה לדבר ערבית שוטפת.', highlight: 'spoke' },
    ],
    tipHe: 'לא אומרים I wish I can. משאלה על ההווה זזה זמן אחד אחורה: I wish I could.',
    quickTry: {
      promptHe: 'איזה פועל מתאים למשאלה על עכשיו?',
      questionEn: 'I wish my brother ____ here with us now.',
      correct: 'were',
      wrong: 'is',
      explainHe: 'משאלה על ההווה באה עם Past Simple, ועם be משתמשים ב-were.',
    },
  },
  'g11-u21-m2': {
    titleHe: 'אילו רק… חרטה על העבר ⏪',
    ideaHe:
      'חרטה על משהו שכבר קרה מביעים עם I wish או If only, ואחריהם Past Perfect: had + V3. זה כמו החלק של if בתנאי השלישי.',
    pattern: 'I wish / If only + had + V3',
    examples: [
      { en: 'I wish I had brought an umbrella.', he: 'חבל שלא הבאתי מטרייה.', highlight: 'had brought' },
      { en: "If only we hadn't missed the last bus!", he: 'אילו רק לא היינו מפספסים את האוטובוס האחרון!', highlight: "hadn't missed" },
      { en: 'He wishes he had told the truth.', he: 'הוא מצטער שלא אמר את האמת.', highlight: 'had told' },
    ],
    tipHe: 'שימו לב: I wish I had a dog זו משאלה על עכשיו. I wish I had had a dog זו חרטה על העבר.',
    quickTry: {
      promptHe: 'הסרט כבר נגמר. מה מתאים?',
      questionEn: 'I wish I ____ that film at the cinema last year.',
      correct: 'had seen',
      wrong: 'saw',
      explainHe: 'last year מראה שזה כבר קרה, ולכן Past Perfect: had seen.',
    },
  },
  'g11-u22-m1': {
    titleHe: 'מישהו אחר עושה בשבילנו 🛠️',
    ideaHe:
      'כשמשלמים לבעל מקצוע שיעשה עבודה בשבילנו, משתמשים בגרם: have + הדבר + V3. הזמן משתנה רק בפועל have.',
    pattern: 'have + object + V3',
    examples: [
      { en: 'We have our teeth checked every six months.', he: 'אנחנו בודקים את השיניים אצל רופא כל חצי שנה.', highlight: 'have our teeth checked' },
      { en: 'They had a new fence built last week.', he: 'בשבוע שעבר בנו להם גדר חדשה.', highlight: 'had a new fence built' },
      { en: 'She is having her bike fixed.', he: 'מתקנים לה עכשיו את האופניים.', highlight: 'having her bike fixed' },
    ],
    tipHe: 'הסדר חשוב: I had my phone repaired. אם אומרים I had repaired my phone, תיקנו בעצמנו.',
    quickTry: {
      promptHe: 'מה הסדר הנכון בגרם?',
      questionEn: 'We ____ yesterday.',
      correct: 'had the carpet cleaned',
      wrong: 'had cleaned the carpet',
      explainHe: 'בגרם הדבר (the carpet) בא לפני V3, כי מישהו אחר ניקה אותו.',
    },
  },
  'g11-u22-m2': {
    titleHe: 'get במקום have 💬',
    ideaHe:
      'בשפה יומיומית אפשר להחליף את have ב-get: get + הדבר + V3. כדי לשנות זמן משנים רק את get: got, will get, is getting.',
    pattern: 'get + object + V3',
    examples: [
      { en: 'I got my jacket cleaned before the trip.', he: 'לפני הטיול ניקו לי את המעיל.', highlight: 'got my jacket cleaned' },
      { en: "We'll get the photos printed tomorrow.", he: 'מחר נדפיס את התמונות (בחנות).', highlight: 'get the photos printed' },
      { en: 'Dad is getting his glasses fixed.', he: 'מתקנים עכשיו לאבא את המשקפיים.', highlight: 'getting his glasses fixed' },
    ],
    tipHe: 'ה-V3 לא משתנה אף פעם. got painted, will get painted: רק get זז בזמן.',
    quickTry: {
      promptHe: 'זה קרה אתמול. מה מתאים?',
      questionEn: 'Yesterday Noa ____ her nails painted.',
      correct: 'got',
      wrong: 'gets',
      explainHe: 'Yesterday מראה עבר, ולכן got. הצורה painted נשארת כמו שהיא.',
    },
  },
};
