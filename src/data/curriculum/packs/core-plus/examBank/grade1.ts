import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-plus pack's grade 1 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_PLUS_GRADE_1_EXAM_BANK: ExamBankPack = {
  // Unit 21: zoo animals & "I see a..."
  21: {
    vocabulary: [
      {
        clozeEn: 'The tall ____ eats leaves from a tree.',
        clozeHe: 'הג׳ירפה הגבוהה אוכלת עלים מעץ.',
        answer: 'giraffe',
        wrong: ['hamster', 'lizard'],
      },
      {
        clozeEn: 'The green ____ says hello!',
        clozeHe: 'התוכי הירוק אומר שלום!',
        answer: 'parrot',
        wrong: ['cow', 'turtle'],
      },
      {
        clozeEn: 'The ____ says moo.',
        clozeHe: 'הפרה אומרת מו.',
        answer: 'cow',
        wrong: ['owl', 'lizard'],
      },
      {
        clozeEn: 'The ____ has a little house on its back.',
        clozeHe: 'לצב יש בית קטן על הגב.',
        answer: 'turtle',
        wrong: ['eagle', 'sheep'],
      },
      {
        clozeEn: 'The ____ says baa.',
        clozeHe: 'הכבשה אומרת מה.',
        answer: 'sheep',
        wrong: ['parrot', 'crocodile'],
      },
      {
        clozeEn: 'The ____ says hoo hoo at night.',
        clozeHe: 'הינשוף אומר הו הו בלילה.',
        answer: 'owl',
        wrong: ['cow', 'hamster'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I see a green lizard.',
        wrong: ['I see a lizard green.', 'I green see a lizard.'],
        explainHe: 'הצבע בא לפני החיה: a green lizard.',
        hintHe: 'באנגלית הצבע עומד לפני שם החיה. איפה הוא בכל משפט?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I see two eagles.',
        wrong: ['I see two eagle.', 'I see eagles two.'],
        explainHe: 'כשיש יותר מאחד מוסיפים s, והמספר בא לפני: two eagles.',
        hintHe: 'כמה נשרים יש? בדקו את סוף המילה ואת מקום המספר.',
      },
      {
        questionEn: 'What do you see? 🐢 Which answer is correct?',
        correct: 'I see a turtle.',
        wrong: ['I see turtle a.', 'A turtle I see.'],
        explainHe: 'עונים I see a turtle: קודם I see, ואז a והחיה.',
        hintHe: 'תשובה מתחילה במי שרואה ובפועל, ואחר כך מילה קטנה והחיה.',
      },
      {
        questionEn: 'Which word is an animal?',
        correct: 'hamster',
        wrong: ['blue', 'hello'],
        explainHe: 'hamster הוא אוגר, חיה. blue הוא צבע ו-hello היא ברכה.',
        hintHe: 'חפשו מילה שהיא יצור חי עם פרווה.',
      },
      {
        questionEn: 'Which word starts with the sound /k/ like cow?',
        correct: 'cat',
        wrong: ['dog', 'sun'],
        explainHe: 'cat מתחילה בצליל /k/, כמו cow.',
        hintHe: 'אמרו כל מילה בקול. איזו מילה מתחילה כמו החיה שנותנת חלב?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'Hello, I see a parrot!',
        wrong: ['Hello, I a parrot see!', 'Hello, see I a parrot!'],
        explainHe: 'הסדר הוא I see a parrot: אני, רואה, ואז החיה.',
        hintHe: 'אחרי שלום באים: מי, מה עושים, ומה רואים. בדקו את הסדר.',
      },
    ],
    sentences: [
      { en: 'I see a parrot in the tree.', he: 'אני רואה תוכי על העץ.' },
      { en: 'The turtle is in the water.', he: 'הצב במים.' },
      { en: 'The caterpillar is on my hand.', he: 'הזחל על היד שלי.' },
      { en: 'I see a yellow butterfly.', he: 'אני רואה פרפר צהוב.' },
      { en: 'Two sheep sleep in the sun.', he: 'שתי כבשים ישנות בשמש.' },
      { en: 'The hamster has a red ball.', he: 'לאוגר יש כדור אדום.' },
    ],
    passages: [
      {
        passageEn:
          'Maya is at the zoo. She sees a giraffe. The giraffe is very tall. Then she sees a green parrot. The parrot says hello!',
        passageHe: 'מאיה בגן החיות. היא רואה ג׳ירפה. הג׳ירפה גבוהה מאוד. אחר כך היא רואה תוכי ירוק. התוכי אומר שלום!',
        questions: [
          {
            questionEn: 'Where is Maya?',
            questionHe: 'איפה מאיה?',
            correct: 'At the zoo.',
            wrong: ['At school.', 'At home.'],
          },
          {
            questionEn: 'What color is the parrot Maya sees?',
            questionHe: 'באיזה צבע התוכי שמאיה רואה?',
            correct: 'Green.',
            wrong: ['Red.', 'Blue.'],
          },
          {
            questionEn: 'What does the parrot say?',
            questionHe: 'מה התוכי אומר?',
            correct: 'Hello.',
            wrong: ['Goodbye.', 'Moo.'],
          },
        ],
      },
      {
        passageEn: 'Ben has a little hamster. The hamster is brown. Ben sees a caterpillar in the garden. The caterpillar is on a leaf.',
        passageHe: 'לבן יש אוגר קטן. האוגר חום. בן רואה זחל בגינה. הזחל על עלה.',
        questions: [
          {
            questionEn: 'What does Ben have?',
            questionHe: 'מה יש לבן?',
            correct: 'A little hamster.',
            wrong: ['A big cow.', 'A green lizard.'],
          },
          {
            questionEn: 'What color is the hamster?',
            questionHe: 'באיזה צבע האוגר?',
            correct: 'Brown.',
            wrong: ['Blue.', 'Red.'],
          },
          {
            questionEn: 'What is the caterpillar on?',
            questionHe: 'על מה הזחל?',
            correct: 'A leaf.',
            wrong: ['A box.', 'A bed.'],
          },
        ],
      },
    ],
  },
  // Unit 22: shapes, sizes & big / small
  22: {
    vocabulary: [
      {
        clozeEn: 'A pizza is ____.',
        clozeHe: 'פיצה היא עגולה.',
        answer: 'round',
        wrong: ['tall', 'long'],
      },
      {
        clozeEn: 'I love you, Mom! Here is a red ____.',
        clozeHe: 'אני אוהב/ת אותך, אמא! הנה לב אדום.',
        answer: 'heart',
        wrong: ['tall', 'long'],
      },
      {
        clozeEn: 'The roof of my house is a ____.',
        clozeHe: 'הגג של הבית שלי הוא משולש.',
        answer: 'triangle',
        wrong: ['circle', 'heart'],
      },
      {
        clozeEn: 'A whale is very ____.',
        clozeHe: 'לוויתן הוא גדול מאוד.',
        answer: 'big',
        wrong: ['small', 'thin'],
      },
      {
        clozeEn: 'The window is a ____.',
        clozeHe: 'החלון הוא ריבוע.',
        answer: 'square',
        wrong: ['heart', 'tall'],
      },
      {
        clozeEn: 'A mouse is very ____.',
        clozeHe: 'עכבר הוא קטן מאוד.',
        answer: 'small',
        wrong: ['big', 'tall'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which one is correct?',
        correct: 'a green triangle',
        wrong: ['a triangle green', 'green a triangle'],
        explainHe: 'הצבע בא לפני הצורה: a green triangle.',
        hintHe: 'באנגלית הצבע עומד לפני הדבר. מה בא אחרי המילה הקטנה?',
      },
      {
        questionEn: 'Which word is the opposite of big?',
        correct: 'small',
        wrong: ['tall', 'round'],
        explainHe: 'big זה גדול, ו-small זה קטן: הם הפכים.',
        hintHe: 'חשבו על פיל ועל נמלה: מה ההפך של גדול?',
      },
      {
        questionEn: 'Which word is a shape?',
        correct: 'circle',
        wrong: ['cow', 'hello'],
        explainHe: 'circle הוא עיגול, צורה. cow היא פרה ו-hello היא ברכה.',
        hintHe: 'חפשו משהו שאפשר לצייר בעיפרון, ולא חיה ולא ברכה.',
      },
      {
        questionEn: 'A giraffe has a long neck. Which sentence is correct?',
        correct: 'The giraffe is tall.',
        wrong: ['The giraffe is short.', 'The giraffe tall is.'],
        explainHe: 'לג׳ירפה צוואר ארוך, ולכן היא tall: The giraffe is tall.',
        hintHe: 'חשבו איך נראית ג׳ירפה, ובדקו גם את סדר המילים.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I see a small square.',
        wrong: ['I see a square small.', 'I small see a square.'],
        explainHe: 'מילה שמתארת גודל באה לפני הדבר: a small square.',
        hintHe: 'באנגלית מילה שמתארת עומדת לפני הדבר. איפה היא בכל משפט?',
      },
      {
        questionEn: 'Which word is the opposite of tall?',
        correct: 'short',
        wrong: ['round', 'big'],
        explainHe: 'tall זה גבוה, ו-short זה נמוך: הם הפכים.',
        hintHe: 'חשבו על ג׳ירפה ועל צב: מה ההפך של גבוה?',
      },
    ],
    sentences: [
      { en: 'My kite is a red triangle.', he: 'העפיפון שלי הוא משולש אדום.' },
      { en: 'The clock is a big circle.', he: 'השעון הוא עיגול גדול.' },
      { en: 'Here is a small pink heart.', he: 'הנה לב ורוד קטן.' },
      { en: 'The snake is long and thin.', he: 'הנחש ארוך ודק.' },
      { en: 'A square has four sides.', he: 'לריבוע יש ארבע צלעות.' },
      { en: 'The ball is small and round.', he: 'הכדור קטן ועגול.' },
    ],
    passages: [
      {
        passageEn: 'Look at my picture. I see a big red circle. I see a small blue square. The triangle is green.',
        passageHe: 'תסתכלו על הציור שלי. אני רואה עיגול אדום גדול. אני רואה ריבוע כחול קטן. המשולש ירוק.',
        questions: [
          {
            questionEn: 'What color is the circle?',
            questionHe: 'באיזה צבע העיגול?',
            correct: 'Red.',
            wrong: ['Blue.', 'Green.'],
          },
          {
            questionEn: 'Which shape is small?',
            questionHe: 'איזו צורה קטנה?',
            correct: 'The square.',
            wrong: ['The circle.', 'The triangle.'],
          },
          {
            questionEn: 'What color is the triangle?',
            questionHe: 'באיזה צבע המשולש?',
            correct: 'Green.',
            wrong: ['Red.', 'Pink.'],
          },
        ],
      },
      {
        passageEn: 'Dan has a long snake toy. It is green and thin. His sister has a round ball. The ball is small.',
        passageHe: 'לדן יש צעצוע נחש ארוך. הוא ירוק ודק. לאחות שלו יש כדור עגול. הכדור קטן.',
        questions: [
          {
            questionEn: 'What toy does Dan have?',
            questionHe: 'איזה צעצוע יש לדן?',
            correct: 'A long snake.',
            wrong: ['A round ball.', 'A big car.'],
          },
          {
            questionEn: 'What color is the snake toy?',
            questionHe: 'באיזה צבע צעצוע הנחש?',
            correct: 'Green.',
            wrong: ['Red.', 'Blue.'],
          },
          {
            questionEn: 'What does his sister have?',
            questionHe: 'מה יש לאחות שלו?',
            correct: 'A round ball.',
            wrong: ['A long snake.', 'A tall tree.'],
          },
        ],
      },
    ],
  },
};
