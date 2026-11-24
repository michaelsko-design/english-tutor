import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-4 source's grade 4 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_4_GRADE_4_EXAM_BANK: ExamBankPack = {
  // Unit 24: weather and seasons (present continuous and its questions)
  24: {
    vocabulary: [
      {
        clozeEn: 'Take your umbrella. A ____ is coming.',
        clozeHe: 'קחו מטרייה. סערה מתקרבת.',
        answer: 'storm',
        wrong: ['afternoon', 'pocket'],
      },
      {
        clozeEn: 'My clothes are wet, but your clothes are ____.',
        clozeHe: 'הבגדים שלי רטובים, אבל הבגדים שלכם יבשים.',
        answer: 'dry',
        wrong: ['early', 'soon'],
      },
      {
        clozeEn: 'The old man is walking ____ up the hill.',
        clozeHe: 'האיש הזקן הולך לאט במעלה הגבעה.',
        answer: 'slowly',
        wrong: ['heavy', 'tomorrow'],
      },
      {
        clozeEn: 'Can you ____ the door? It is cold in here.',
        clozeHe: 'אפשר לסגור את הדלת? קר כאן.',
        answer: 'close',
        wrong: ['travel', 'learn'],
      },
      {
        clozeEn: 'In winter it gets dark in the ____.',
        clozeHe: 'בחורף מחשיך בערב.',
        answer: 'evening',
        wrong: ['easily', 'nobody'],
      },
      {
        clozeEn: 'Today is Monday, and ____ is Tuesday.',
        clozeHe: 'היום יום שני, ומחר יום שלישי.',
        answer: 'tomorrow',
        wrong: ['nobody', 'everything'],
      },
    ],
    grammar: [
      {
        questionEn: 'Look! What is the dog doing?',
        correct: 'The dog is running in the rain.',
        wrong: ['The dog running in the rain.', 'The dog is run in the rain.'],
        explainHe: 'מה שקורה עכשיו: is ואחריו פועל עם ing: is running.',
        hintHe: 'בדקו את is ואת ing.',
      },
      {
        questionEn: 'Which sentence is right?',
        correct: 'We are sitting by the fire.',
        wrong: ['We is sitting by the fire.', 'We are siting by the fire.'],
        explainHe: 'עם we אומרים are. ב-sit מכפילים את t: sitting.',
        hintHe: 'בדקו את are ואת האיות של sitting.',
      },
      {
        questionEn: 'You want to know about your friends now. Which question is right?',
        correct: 'Are your friends playing outside?',
        wrong: ['Is your friends playing outside?', 'Are your friends play outside?'],
        explainHe: 'עם friends שואלים Are, והפועל עם ing.',
        hintHe: 'friends הם רבים. איך מתחילה השאלה?',
      },
      {
        questionEn: 'Which question is right?',
        correct: 'What are you doing?',
        wrong: ['What you are doing?', 'What are you do?'],
        explainHe: 'בשאלה עם What, are בא לפני you: What are you doing?',
        hintHe: 'מה בא קודם: are או you?',
      },
      {
        questionEn: 'Is it snowing? It is not. What do you say?',
        correct: 'No, it isn\'t. It is raining.',
        wrong: ['No, it doesn\'t. It is raining.', 'No, it not. It is raining.'],
        explainHe: 'על Is it…? עונים No, it isn\'t.',
        hintHe: 'השאלה מתחילה ב-Is. מה עונים?',
      },
      {
        questionEn: 'Which sentence is right?',
        correct: 'Grandma is making soup because it is cold.',
        wrong: ['Grandma making soup because it is cold.', 'Grandma is makeing soup because it is cold.'],
        explainHe: 'is ואחריו making. ב-make מורידים את ה-e: making.',
        hintHe: 'בדקו את is ואת האיות של making.',
      },
    ],
    sentences: [
      { en: 'The sun is shining, and the birds are singing.', he: 'השמש זורחת, והציפורים שרות.' },
      { en: 'Is it raining in Haifa today?', he: 'יורד גשם בחיפה היום?' },
      { en: 'We are watching the storm from the window.', he: 'אנחנו צופים בסערה מהחלון.' },
      { en: 'My sister is reading this afternoon.', he: 'אחותי קוראת היום אחר הצהריים.' },
      { en: 'Are you bringing a coat?', he: 'אתם מביאים מעיל?' },
      { en: 'Nobody is swimming in the cold sea.', he: 'אף אחד לא שוחה בים הקר.' },
    ],
    passages: [
      {
        passageEn:
          'It is a winter morning in Jerusalem. It is very cold, and it is snowing! Roni and her brother are wearing coats and hats. They are building a snowman in the garden. Mom is watching them from the window and taking pictures.',
        passageHe:
          'זה בוקר חורפי בירושלים. קר מאוד, ויורד שלג! רוני ואחיה לובשים מעילים וכובעים. הם בונים איש שלג בגינה. אמא מסתכלת עליהם מהחלון ומצלמת.',
        questions: [
          {
            questionEn: 'What is the weather like?',
            questionHe: 'איך מזג האוויר?',
            correct: 'Cold and snowy.',
            wrong: ['Hot and sunny.', 'Warm and windy.'],
          },
          {
            questionEn: 'What are Roni and her brother building?',
            questionHe: 'מה רוני ואחיה בונים?',
            correct: 'A snowman.',
            wrong: ['A tower.', 'A house.'],
          },
          {
            questionEn: 'Where is Mom?',
            questionHe: 'איפה אמא?',
            correct: 'At the window.',
            wrong: ['In the garden.', 'In the car.'],
          },
        ],
      },
      {
        passageEn:
          'It is a hot summer morning. Dad is driving to the beach, and the kids are singing in the car. Are there a lot of people at the beach? No, there aren\'t, because it is early. The family is swimming and eating watermelon together.',
        passageHe:
          'זה בוקר חם בקיץ. אבא נוהג לים, והילדים שרים במכונית. יש הרבה אנשים בחוף? לא, כי מוקדם. המשפחה שוחה ואוכלת אבטיח ביחד.',
        questions: [
          {
            questionEn: 'Who is driving?',
            questionHe: 'מי נוהג?',
            correct: 'Dad.',
            wrong: ['Mom.', 'The kids.'],
          },
          {
            questionEn: 'Why are there not a lot of people at the beach?',
            questionHe: 'למה אין הרבה אנשים בחוף?',
            correct: 'Because it is early.',
            wrong: ['Because it is raining.', 'Because it is winter.'],
          },
          {
            questionEn: 'What is the family eating?',
            questionHe: 'מה המשפחה אוכלת?',
            correct: 'Watermelon.',
            wrong: ['Ice cream.', 'Sandwiches.'],
          },
        ],
      },
    ],
  },
};
