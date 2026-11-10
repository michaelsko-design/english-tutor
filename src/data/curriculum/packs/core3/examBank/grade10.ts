import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-3 source's grade 10 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_3_GRADE_10_EXAM_BANK: ExamBankPack = {
  // Unit 23: gap-year plans (present continuous for the future, future continuous)
  23: {
    vocabulary: [
      {
        clozeEn: 'The plane to Rome is late, so the ____ time has changed to nine.',
        clozeHe: 'המטוס לרומא מאחר, ולכן שעת היציאה השתנתה לתשע.',
        answer: 'departure',
        wrong: ['loan', 'territory'],
      },
      {
        clozeEn: 'Lior works three mornings a week. It is a ____ job, so she can still study.',
        clozeHe: 'ליאור עובדת שלושה בקרים בשבוע. זו עבודה במשרה חלקית, אז היא עדיין יכולה ללמוד.',
        answer: 'part-time',
        wrong: ['sore', 'unlikely'],
      },
      {
        clozeEn: 'After the long hike, my legs were so ____ that I could hardly walk.',
        clozeHe: 'אחרי הטיול הארוך, הרגליים שלי כאבו כל כך שבקושי יכולתי ללכת.',
        answer: 'sore',
        wrong: ['worthwhile', 'ideal'],
      },
      {
        clozeEn: 'The guide is late, and ____ we are waiting in the hotel lobby.',
        clozeHe: 'המדריך מאחר, ובינתיים אנחנו מחכים בלובי של המלון.',
        answer: 'in the meantime',
        wrong: ['unlikely', 'worthwhile'],
      },
      {
        clozeEn: 'Many families save money and take a ____ from the bank to pay for university.',
        clozeHe: 'הרבה משפחות חוסכות כסף ולוקחות הלוואה מהבנק כדי לשלם על האוניברסיטה.',
        answer: 'loan',
        wrong: ['cab', 'resort'],
      },
      {
        clozeEn: 'It is raining hard, so the children are playing ____ today.',
        clozeHe: 'יורד גשם חזק, אז הילדים משחקים היום בפנים.',
        answer: 'indoors',
        wrong: ['tough', 'monthly'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete: "I can\'t come on Thursday. I ____ the dentist at four."',
        correct: 'am seeing',
        wrong: ['have seen', 'saw'],
        explainHe: 'פגישה קבועה בעתיד (ביום חמישי בארבע), ולכן present continuous: am seeing.',
        hintHe: 'יש שעה קבועה בעתיד. איזו צורה מתאימה לתוכנית מסודרת?',
      },
      {
        questionEn: 'Complete: "At midnight, most of the passengers ____."',
        correct: 'will be sleeping',
        wrong: ['will sleeping', 'are slept'],
        explainHe: 'בחצות השינה תהיה באמצע, ולכן will be + פועל עם ing.',
        hintHe: 'בשעה הזו השינה תהיה בעיצומה. כמה מילים צריך לפני הפועל?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We are having a party on Saturday night.',
        wrong: ['We having a party on Saturday night.', 'We are have a party on Saturday night.'],
        explainHe: 'תוכנית מסודרת: are + פועל עם ing (are having).',
        hintHe: 'בדקו את פועל העזר ואת צורת הפועל.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'This time tomorrow, they will be driving to Eilat.',
        wrong: ['This time tomorrow, they will be drive to Eilat.', 'This time tomorrow, they will driving to Eilat.'],
        explainHe: 'פעולה שתהיה באמצע מחר בשעה הזו: will be + פועל עם ing.',
        hintHe: 'בדקו את המילים שאחרי הנושא.',
      },
      {
        questionEn: 'Complete: "____ you be using the computer this evening?"',
        correct: 'Will',
        wrong: ['Are', 'Do'],
        explainHe: 'שאלה ב-future continuous: Will + נושא + be + V-ing.',
        hintHe: 'איזו מילה פותחת שאלה על העתיד שבהמשכה be ופועל עם ing?',
      },
      {
        questionEn: 'Complete: "Hurry up! The train ____ in five minutes."',
        correct: 'is leaving',
        wrong: ['was leaving', 'has left'],
        explainHe: 'הרכבת יוצאת בעוד חמש דקות, תוכנית קבועה בעתיד: is leaving.',
        hintHe: 'הזמן כאן הוא בעוד חמש דקות. איזו צורה מדברת על העתיד?',
      },
    ],
    sentences: [
      { en: 'We are flying to Rome on Monday morning.', he: 'אנחנו טסים לרומא ביום שני בבוקר.' },
      { en: 'At noon tomorrow, I will be sitting on a train.', he: 'מחר בצהריים אני אשב ברכבת.' },
      { en: 'My brother is starting a part-time job next week.', he: 'אחי מתחיל עבודה במשרה חלקית בשבוע הבא.' },
      { en: 'The volunteers will be working indoors all afternoon.', he: 'המתנדבים יעבדו בפנים כל אחר הצהריים.' },
      { en: 'Our cab is coming at five, so please be ready.', he: 'המונית שלנו מגיעה בחמש, אז בבקשה היו מוכנים.' },
      { en: 'Next year, she will be living in a small village.', he: 'בשנה הבאה היא תגור בכפר קטן.' },
    ],
    passages: [
      {
        passageEn:
          'Avi finished school in June. He is not joining the army until next March, so he is spending the months in between at a youth village in the Galilee. He is starting there on the first of September. Every morning, he will be helping in the kitchen, and every afternoon he will be teaching young children to swim. He is also taking a first-aid course in October.',
        passageHe:
          'אבי סיים את בית הספר ביוני. הוא מתגייס לצבא רק במרץ הבא, ולכן הוא מבלה את החודשים שבינתיים בכפר נוער בגליל. הוא מתחיל שם באחד בספטמבר. כל בוקר הוא יעזור במטבח, וכל אחר צהריים הוא ילמד ילדים קטנים לשחות. באוקטובר הוא גם עושה קורס עזרה ראשונה.',
        questions: [
          {
            questionEn: 'When is Avi joining the army?',
            questionHe: 'מתי אבי מתגייס לצבא?',
            correct: 'Next March.',
            wrong: ['In September.', 'In October.'],
          },
          {
            questionEn: 'What will Avi be doing every afternoon?',
            questionHe: 'מה אבי יעשה כל אחר צהריים?',
            correct: 'Teaching children to swim.',
            wrong: ['Helping in the kitchen.', 'Taking a first-aid course.'],
          },
          {
            questionEn: 'Where is the youth village?',
            questionHe: 'איפה נמצא כפר הנוער?',
            correct: 'In the Galilee.',
            wrong: ['In the Negev.', 'Near Eilat.'],
          },
        ],
      },
      {
        passageEn:
          'Many Israeli teenagers take a gap year before the army. Some work and save money, while others volunteer in poor towns or nature reserves. Experts say the year can be worthwhile, because young people learn to cope on their own. However, a gap year abroad can be expensive, so many families take a loan or plan the budget a year ahead.',
        passageHe:
          'הרבה בני נוער ישראלים לוקחים שנת הפסקה לפני הצבא. חלקם עובדים וחוסכים כסף, ואחרים מתנדבים בעיירות עניות או בשמורות טבע. מומחים אומרים שהשנה יכולה להיות שווה את המאמץ, כי צעירים לומדים להתמודד בכוחות עצמם. עם זאת, שנת הפסקה בחו״ל יכולה להיות יקרה, ולכן הרבה משפחות לוקחות הלוואה או מתכננות את התקציב שנה מראש.',
        questions: [
          {
            questionEn: 'When do many Israeli teenagers take a gap year?',
            questionHe: 'מתי הרבה בני נוער ישראלים לוקחים שנת הפסקה?',
            correct: 'Before the army.',
            wrong: ['After university.', 'In twelfth grade.'],
          },
          {
            questionEn: 'Why can the year be worthwhile, according to experts?',
            questionHe: 'למה השנה יכולה להיות שווה את המאמץ, לפי המומחים?',
            correct: 'Young people learn to cope on their own.',
            wrong: ['Young people earn a lot of money.', 'Young people travel for free.'],
          },
          {
            questionEn: 'Why do some families take a loan?',
            questionHe: 'למה חלק מהמשפחות לוקחות הלוואה?',
            correct: 'A gap year abroad can be expensive.',
            wrong: ['The army pays them back.', 'They want to buy a house.'],
          },
        ],
      },
    ],
  },
};
