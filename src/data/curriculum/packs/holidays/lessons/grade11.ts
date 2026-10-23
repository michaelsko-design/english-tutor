import type { LessonPack } from '../../../lessons/types';

/** The holidays pack's grade 11 mini-lessons, by mission id: review grammar on festival topics. */
export const HOLIDAYS_GRADE_11_LESSONS: LessonPack = {
  'g11-u31-m1': {
    titleHe: 'מה נעשה בחג? סביל 🍎',
    ideaHe:
      'כשחשוב מה נעשה ולא מי עשה, משתמשים בסביל: is / are + V3 בהווה, was / were + V3 בעבר. כך מתארים מנהגים של חגים.',
    pattern: 'is / are / was / were + V3',
    examples: [
      { en: 'Round challahs are baked for the new year.', he: 'לשנה החדשה אופים חלות עגולות.', highlight: 'are baked' },
      { en: 'The shofar is blown in the synagogue.', he: 'תוקעים בשופר בבית הכנסת.', highlight: 'is blown' },
      { en: 'Our sukkah was decorated with lemons and dates.', he: 'הסוכה שלנו קושטה בלימונים ובתמרים.', highlight: 'was decorated' },
    ],
    tipHe: 'by מופיע רק כשחשוב לדעת מי עשה: The cake was baked by Grandma.',
    quickTry: {
      promptHe: 'הסביל בעבר. מה מתאים?',
      questionEn: 'Last year, the guests ____ to our sukkah on the first night.',
      correct: 'were invited',
      wrong: 'invited',
      explainHe: 'האורחים לא הזמינו, אלא הוזמנו: were + V3.',
    },
  },
  'g11-u31-m2': {
    titleHe: 'למה? כי… ולכן! 🕯️',
    ideaHe:
      'because ו-since באים לפני משפט שלם. because of ו-due to באים לפני שם עצם. as a result פותח את התוצאה, ואחריו פסיק.',
    pattern: 'because of + noun · As a result, + result',
    examples: [
      { en: 'The trip was cancelled due to the storm.', he: 'הטיול בוטל בגלל הסערה.', highlight: 'due to' },
      { en: 'It rained all week. As a result, the river overflowed.', he: 'ירד גשם כל השבוע. כתוצאה מכך, הנחל עלה על גדותיו.', highlight: 'As a result,' },
      { en: 'We stayed inside because it was freezing.', he: 'נשארנו בפנים כי היה קפוא.', highlight: 'because it was' },
    ],
    tipHe: 'as a result לא בא לפני הסיבה. הוא תמיד פותח את מה שקרה בעקבותיה.',
    quickTry: {
      promptHe: 'שם עצם או משפט שלם?',
      questionEn: 'The lights went out ____ the strong wind.',
      correct: 'due to',
      wrong: 'because',
      explainHe: 'the strong wind הוא שם עצם, ולכן due to.',
    },
  },
  'g11-u32-m1': {
    titleHe: 'דומה או שונה? 🌳',
    ideaHe:
      'כשמשווים בין שני חגים, both ו-similarly מראים דמיון. whereas, unlike ו-on the other hand מראים הבדל.',
    pattern: 'A …, whereas B … · Unlike A, B …',
    examples: [
      { en: 'Both holidays are celebrated in spring.', he: 'את שני החגים חוגגים באביב.', highlight: 'Both' },
      { en: 'Unlike Passover, Shavuot lasts one day.', he: 'בשונה מפסח, שבועות נמשך יום אחד.', highlight: 'Unlike' },
      { en: 'My brother loves costumes, whereas my sister prefers quiet days.', he: 'אחי אוהב תחפושות, ואילו אחותי מעדיפה ימים שקטים.', highlight: 'whereas' },
    ],
    tipHe: 'unlike בא לפני שם עצם. whereas מחבר שני משפטים שלמים.',
    quickTry: {
      promptHe: 'דמיון או הבדל?',
      questionEn: 'Purim is loud. ____, Tu BiShvat is peaceful.',
      correct: 'In contrast',
      wrong: 'Similarly',
      explainHe: 'שני החגים מתוארים בתכונות הפוכות, ולכן In contrast.',
    },
  },
  'g11-u32-m2': {
    titleHe: 'מידע נוסף: who, which, where 🎆',
    ideaHe:
      'פסוקית זיקה מוסיפה מידע על שם עצם: who לאנשים, which לדברים, where למקומות. בין פסיקים לא משתמשים ב-that.',
    pattern: 'who · which · where',
    examples: [
      { en: 'The girl who lit the torch is from Akko.', he: 'הנערה שהדליקה את המשואה היא מעכו.', highlight: 'who' },
      { en: 'Cheesecake, which my family loves, is easy to bake.', he: 'עוגת גבינה, שהמשפחה שלי אוהבת מאוד, קלה לאפייה.', highlight: 'which' },
      { en: 'This is the park where we have our picnic.', he: 'זה הפארק שבו אנחנו עושים פיקניק.', highlight: 'where' },
    ],
    tipHe: 'לא מוסיפים כינוי אחרי הפסוקית: the girl who lit the torch, ולא the girl who she lit.',
    quickTry: {
      promptHe: 'אדם, דבר או מקום?',
      questionEn: 'Eilat is the city ____ we spend every summer vacation.',
      correct: 'where',
      wrong: 'which',
      explainHe: 'מדובר על מקום שבו קורה משהו, ולכן where.',
    },
  },
};
