import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-3 source's grade 11 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_3_GRADE_11_EXAM_BANK: ExamBankPack = {
  // Unit 23: investigations (past perfect continuous, against the past perfect simple)
  23: {
    vocabulary: [
      {
        clozeEn: 'The police found the ____ of the robbery lying on the floor of the shop.',
        clozeHe: 'המשטרה מצאה את קורבן השוד שוכב על רצפת החנות.',
        answer: 'victim',
        wrong: ['powder', 'justice'],
      },
      {
        clozeEn: 'Mix the white ____ with warm water and wait ten minutes.',
        clozeHe: 'ערבבו את האבקה הלבנה עם מים חמימים וחכו עשר דקות.',
        answer: 'powder',
        wrong: ['spy', 'scandal'],
      },
      {
        clozeEn: 'The children left the kitchen in a terrible ____ after baking a cake.',
        clozeHe: 'הילדים השאירו את המטבח בבלגן נוראי אחרי שאפו עוגה.',
        answer: 'mess',
        wrong: ['laser', 'incident'],
      },
      {
        clozeEn: 'It was ____ that nobody had been living in the house for years.',
        clozeHe: 'היה ברור שאף אחד לא גר בבית במשך שנים.',
        answer: 'apparent',
        wrong: ['liquid', 'urgent'],
      },
      {
        clozeEn: 'Can you ____ how much paint we need for the whole room?',
        clozeHe: 'אתם יכולים לחשב כמה צבע אנחנו צריכים לכל החדר?',
        answer: 'calculate',
        wrong: ['punish', 'rob'],
      },
      {
        clozeEn: 'Each ____ of rock tells us about a different period in history.',
        clozeHe: 'כל שכבה של סלע מספרת לנו על תקופה אחרת בהיסטוריה.',
        answer: 'layer',
        wrong: ['tube', 'victim'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete: "When we arrived at the cinema, the film ____ for ten minutes."',
        correct: 'had been running',
        wrong: ['have been running', 'had been run'],
        explainHe: 'הסרט התחיל לפני שהגענו ונמשך עד אז, בעבר: had been + V-ing.',
        hintHe: 'הפעולה התחילה לפני רגע בעבר ונמשכה עד אליו. איזה פועל עזר מתאים?',
      },
      {
        questionEn: 'Complete: "Her clothes were wet because she ____ in the rain."',
        correct: 'had been walking',
        wrong: ['had been walk', 'have been walking'],
        explainHe: 'הבגדים היו רטובים (תוצאה בעבר) כי פעולה נמשכה לפני כן: had been walking.',
        hintHe: 'מה גרם לתוצאה בעבר, ובאיזו צורה כותבים פעולה שנמשכה לפניה?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'They had been talking for an hour when the teacher came in.',
        wrong: [
          'They had been talk for an hour when the teacher came in.',
          'They had being talking for an hour when the teacher came in.',
        ],
        explainHe: 'had been + פועל עם ing: had been talking.',
        hintHe: 'בדקו את המילים שבין הנושא לבין for.',
      },
      {
        questionEn: 'Complete: "How long ____ been learning Arabic before you moved to Jaffa?"',
        correct: 'had you',
        wrong: ['have you', 'you had'],
        explainHe: 'שאלה ב-past perfect continuous: How long + had + נושא + been + V-ing. המעבר ליפו היה בעבר, ולכן had.',
        hintHe: 'בשאלה פועל העזר בא לפני הנושא. איזה פועל עזר מתאים לעבר?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'By noon, she had read three chapters.',
        wrong: ['By noon, she had been reading three chapters.', 'By noon, she has read three chapters.'],
        explainHe: 'כשסופרים כמה דברים הסתיימו (three chapters), משתמשים ב-had + V3, לא ב-had been + V-ing.',
        hintHe: 'האם הפעולה נספרת וגמורה, או שהיא נמשכת?',
      },
      {
        questionEn: 'Complete: "The ground was white because it ____ all night."',
        correct: 'had been snowing',
        wrong: ['have been snowing', 'had snowing'],
        explainHe: 'השלג ירד כל הלילה, לפני התוצאה בעבר: had been snowing.',
        hintHe: 'מה קרה לפני שהאדמה הייתה לבנה, וכמה זמן זה נמשך?',
      },
    ],
    sentences: [
      { en: 'The thief had been hiding behind the door.', he: 'הגנב הסתתר מאחורי הדלת.' },
      { en: 'We had been driving for hours when the car stopped.', he: 'נסענו כבר שעות כשהמכונית עצרה.' },
      { en: 'The scientists had been testing the water for months.', he: 'המדענים בדקו את המים במשך חודשים.' },
      { en: 'Her hands were blue because she had been painting.', he: 'הידיים שלה היו כחולות כי היא ציירה.' },
      { en: 'Nobody knew that he had been working as a spy.', he: 'אף אחד לא ידע שהוא עבד כמרגל.' },
      { en: 'The court punished the men who had robbed the bank.', he: 'בית המשפט העניש את האנשים ששדדו את הבנק.' },
    ],
    passages: [
      {
        passageEn:
          'A small museum noticed that several old coins were missing. The guards had been checking the rooms every hour, and the cameras had been working all the time. After a long investigation, the police discovered that a cleaner had been taking one coin a week for almost a year. She had been replacing each coin with a cheap copy, so nobody had noticed.',
        passageHe:
          'מוזיאון קטן גילה שכמה מטבעות עתיקים נעלמו. השומרים בדקו את החדרים כל שעה, והמצלמות פעלו כל הזמן. אחרי חקירה ארוכה, המשטרה גילתה שמנקה לקחה מטבע אחד בכל שבוע במשך כמעט שנה. היא החליפה כל מטבע בהעתק זול, ולכן אף אחד לא שם לב.',
        questions: [
          {
            questionEn: 'What was missing from the museum?',
            questionHe: 'מה נעלם מהמוזיאון?',
            correct: 'Old coins.',
            wrong: ['Paintings.', 'A camera.'],
          },
          {
            questionEn: 'How often had the guards been checking the rooms?',
            questionHe: 'כל כמה זמן השומרים בדקו את החדרים?',
            correct: 'Every hour.',
            wrong: ['Once a week.', 'Every night.'],
          },
          {
            questionEn: 'Why had nobody noticed?',
            questionHe: 'למה אף אחד לא שם לב?',
            correct: 'She put a cheap copy in place of each coin.',
            wrong: ['The cameras were broken.', 'The guards were asleep.'],
          },
        ],
      },
      {
        passageEn:
          'A few years ago, the water in a small salt lake turned bright pink. Local people were worried, because they thought a factory had been putting chemicals into the lake. However, scientists tested the water and found that tiny living things were causing the color. These living things grow well in very salty water, and the lake had been getting saltier because there had been no rain for months.',
        passageHe:
          'לפני כמה שנים, המים באגם מלח קטן הפכו לוורודים עזים. התושבים דאגו, כי הם חשבו שמפעל שפך כימיקלים לאגם. אבל מדענים בדקו את המים וגילו שיצורים חיים זעירים גרמו לצבע. היצורים האלה גדלים טוב במים מלוחים מאוד, והאגם נעשה מלוח יותר כי לא ירד גשם במשך חודשים.',
        questions: [
          {
            questionEn: 'What color did the lake turn?',
            questionHe: 'לאיזה צבע הפך האגם?',
            correct: 'Pink.',
            wrong: ['Green.', 'Brown.'],
          },
          {
            questionEn: 'What did local people think at first?',
            questionHe: 'מה התושבים חשבו בהתחלה?',
            correct: 'A factory had put chemicals in it.',
            wrong: ['The rain had changed the color.', 'Scientists had painted the water.'],
          },
          {
            questionEn: 'Why had the lake been getting saltier?',
            questionHe: 'למה האגם נעשה מלוח יותר?',
            correct: 'There had been no rain for months.',
            wrong: ['A factory had added salt.', 'Visitors had been swimming in it.'],
          },
        ],
      },
    ],
  },
};
