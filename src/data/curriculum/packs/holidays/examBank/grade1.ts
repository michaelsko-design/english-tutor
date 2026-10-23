import type { ExamBankPack } from '../../../examBank/types';

/**
 * The holidays pack's grade 1 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const HOLIDAYS_GRADE_1_EXAM_BANK: ExamBankPack = {
  // Unit 31: Rosh Hashana, Sukkot, Hanukkah & winter
  31: {
    vocabulary: [
      {
        clozeEn: 'The little bees make ____.',
        clozeHe: 'הדבורים הקטנות מכינות דבש.',
        answer: 'honey',
        wrong: ['paper', 'cold'],
      },
      {
        clozeEn: 'We eat dinner in the ____ on Sukkot.',
        clozeHe: 'בסוכות אוכלים ארוחת ערב בסוכה.',
        answer: 'sukkah',
        wrong: ['candle', 'donut'],
      },
      {
        clozeEn: 'I light a ____ on Hanukkah.',
        clozeHe: 'בחנוכה אני מדליק/ה נר.',
        answer: 'candle',
        wrong: ['card', 'palm'],
      },
      {
        clozeEn: 'Put on a coat. It is ____ today.',
        clozeHe: 'לבשו מעיל. קר היום.',
        answer: 'cold',
        wrong: ['sweet', 'paper'],
      },
      {
        clozeEn: 'I write a ____ for my teacher.',
        clozeHe: 'אני כותב/ת כרטיס ברכה למורה.',
        answer: 'card',
        wrong: ['donut', 'chain'],
      },
      {
        clozeEn: 'The jam ____ is sweet and round.',
        clozeHe: 'הסופגנייה עם הריבה מתוקה ועגולה.',
        answer: 'donut',
        wrong: ['menorah', 'year'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I have sweet honey.',
        wrong: ['I have honey sweet.', 'I sweet have honey.'],
        explainHe: 'מילה שמתארת באה לפני הדבר: sweet honey (דבש מתוק).',
        hintHe: 'באנגלית מילה שמתארת עומדת לפני הדבר. איפה היא בכל משפט?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I see five candles.',
        wrong: ['I see five candle.', 'I see candles five.'],
        explainHe: 'יותר מנר אחד: candles עם s, והמספר בא לפני.',
        hintHe: 'כמה נרות יש? בדקו את סוף המילה ואת מקום המספר.',
      },
      {
        questionEn: 'What do we say on Hanukkah?',
        correct: 'Happy Hanukkah!',
        wrong: ['Good morning!', 'Goodbye!'],
        explainHe: 'בחנוכה מברכים Happy Hanukkah: חג חנוכה שמח!',
        hintHe: 'חפשו ברכה שיש בה את שם החג של הנרות.',
      },
      {
        questionEn: 'Which one is correct?',
        correct: 'a red card',
        wrong: ['a card red', 'red a card'],
        explainHe: 'הצבע בא לפני הדבר: a red card.',
        hintHe: 'באנגלית הצבע עומד לפני הדבר. ומה עומד ראשון?',
      },
      {
        questionEn: 'Which word starts with the sound /s/ like sukkah?',
        correct: 'sun',
        wrong: ['cat', 'dog'],
        explainHe: 'sun מתחילה בצליל /s/, כמו sukkah.',
        hintHe: 'אמרו כל מילה בקול. איזו מילה מתחילה באותו צליל כמו סוכה?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I have a paper chain.',
        wrong: ['I have paper a chain.', 'I a paper chain have.'],
        explainHe: 'הסדר הוא I have, ואז a paper chain (שרשרת נייר).',
        hintHe: 'בדקו שהמשפט מתחיל במי שיש לו, ואז הפועל, ואז מילה קטנה והדבר.',
      },
    ],
    sentences: [
      { en: 'Happy New Year, my friend!', he: 'שנה טובה, חבר שלי!' },
      { en: 'The honey cake is sweet.', he: 'עוגת הדבש מתוקה.' },
      { en: 'I see a palm in the sun.', he: 'אני רואה דקל בשמש.' },
      { en: 'We make a long paper chain.', he: 'אנחנו מכינים שרשרת נייר ארוכה.' },
      { en: 'It is cold and I have a donut.', he: 'קר, ויש לי סופגנייה.' },
      { en: 'Four candles are on the menorah.', he: 'ארבעה נרות על החנוכייה.' },
    ],
    passages: [
      {
        passageEn: 'It is Sukkot. Noa is in the sukkah. She sees a green chain. She has a red apple. She is happy.',
        passageHe: 'סוכות. נועה בסוכה. היא רואה שרשרת ירוקה. יש לה תפוח אדום. היא שמחה.',
        questions: [
          {
            questionEn: 'Where is Noa?',
            questionHe: 'איפה נועה?',
            correct: 'In the sukkah.',
            wrong: ['In the sea.', 'At school.'],
          },
          {
            questionEn: 'What color is the chain Noa sees?',
            questionHe: 'באיזה צבע השרשרת שנועה רואה?',
            correct: 'Green.',
            wrong: ['Red.', 'Blue.'],
          },
          {
            questionEn: 'What does Noa have?',
            questionHe: 'מה יש לנועה?',
            correct: 'A red apple.',
            wrong: ['A green chain.', 'A donut.'],
          },
        ],
      },
      {
        passageEn: 'It is Hanukkah. It is cold. Tom sees three candles. He has a big donut. Happy Hanukkah, Tom!',
        passageHe: 'חנוכה. קר. תום רואה שלושה נרות. יש לו סופגנייה גדולה. חג חנוכה שמח, תום!',
        questions: [
          {
            questionEn: 'What is the weather like?',
            questionHe: 'איך מזג האוויר?',
            correct: 'It is cold.',
            wrong: ['It is hot.', 'It is sunny.'],
          },
          {
            questionEn: 'How many candles does Tom see?',
            questionHe: 'כמה נרות תום רואה?',
            correct: 'Three candles.',
            wrong: ['Two candles.', 'Eight candles.'],
          },
          {
            questionEn: 'What does Tom have?',
            questionHe: 'מה יש לתום?',
            correct: 'A big donut.',
            wrong: ['A red card.', 'A palm.'],
          },
        ],
      },
    ],
  },
  // Unit 32: Tu BiShvat, Purim, Passover, Independence Day, Shavuot & summer
  32: {
    vocabulary: [
      {
        clozeEn: 'On Purim I put on a funny ____.',
        clozeHe: 'בפורים אני שם/ה מסכה מצחיקה.',
        answer: 'mask',
        wrong: ['wheat', 'beach'],
      },
      {
        clozeEn: 'The king has a big ____ on his head.',
        clozeHe: 'למלך יש כתר גדול על הראש.',
        answer: 'crown',
        wrong: ['cheese', 'shell'],
      },
      {
        clozeEn: 'I find a pink ____ on the sand.',
        clozeHe: 'אני מוצא/ת צדף ורוד על החול.',
        answer: 'shell',
        wrong: ['flag', 'matzah'],
      },
      {
        clozeEn: 'On Passover, I eat white ____.',
        clozeHe: 'בפסח אני אוכל/ת מצה לבנה.',
        answer: 'matzah',
        wrong: ['crown', 'garden'],
      },
      {
        clozeEn: 'I see a blue and white ____ on the house.',
        clozeHe: 'אני רואה דגל כחול לבן על הבית.',
        answer: 'flag',
        wrong: ['cheese', 'wheat'],
      },
      {
        clozeEn: 'We give water to the ____ in the garden.',
        clozeHe: 'אנחנו משקים את הצמח בגינה.',
        answer: 'plant',
        wrong: ['mask', 'fireworks'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I have a yellow crown.',
        wrong: ['I have a crown yellow.', 'I yellow have a crown.'],
        explainHe: 'הצבע בא לפני הדבר: a yellow crown.',
        hintHe: 'באנגלית הצבע עומד לפני הדבר. איפה הוא בכל משפט?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I see six flags.',
        wrong: ['I see six flag.', 'I six see flags.'],
        explainHe: 'יותר מדגל אחד: flags עם s, והמספר בא לפני.',
        hintHe: 'כמה דגלים יש? בדקו את סוף המילה ואת מקום המספר.',
      },
      {
        questionEn: 'What do we say on Purim?',
        correct: 'Happy Purim!',
        wrong: ['Thank you!', 'Good night!'],
        explainHe: 'בפורים מברכים Happy Purim: פורים שמח!',
        hintHe: 'חפשו ברכה שיש בה את שם החג של המסכות.',
      },
      {
        questionEn: 'Which word is a food?',
        correct: 'cheese',
        wrong: ['flag', 'shell'],
        explainHe: 'cheese היא גבינה, אוכל. flag הוא דגל ו-shell הוא צדף.',
        hintHe: 'חפשו משהו שאוכלים בשבועות.',
      },
      {
        questionEn: 'Which one is correct?',
        correct: 'a big party',
        wrong: ['a party big', 'big a party'],
        explainHe: 'מילה שמתארת באה לפני הדבר: a big party.',
        hintHe: 'באנגלית מילה שמתארת עומדת לפני הדבר. ומה עומד ראשון?',
      },
      {
        questionEn: 'Which word starts with the sound /b/ like beach?',
        correct: 'ball',
        wrong: ['cat', 'sun'],
        explainHe: 'ball מתחילה בצליל /b/, כמו beach.',
        hintHe: 'אמרו כל מילה בקול. איזו מילה מתחילה באותו צליל כמו המילה של חוף הים?',
      },
    ],
    sentences: [
      { en: 'I have a mask and a hat.', he: 'יש לי מסכה וכובע.' },
      { en: 'My plant is in the garden.', he: 'הצמח שלי בגינה.' },
      { en: 'I like white cheese and bread.', he: 'אני אוהב/ת גבינה לבנה ולחם.' },
      { en: 'I see red and blue fireworks.', he: 'אני רואה זיקוקים אדומים וכחולים.' },
      { en: 'The wheat is tall and yellow.', he: 'החיטה גבוהה וצהובה.' },
      { en: 'We have a party at the beach.', he: 'יש לנו מסיבה בחוף הים.' },
    ],
    passages: [
      {
        passageEn: 'It is Purim. Dan has a mask. The mask is green. His sister has a pink crown. They go to a party.',
        passageHe: 'פורים. לדן יש מסכה. המסכה ירוקה. לאחות שלו יש כתר ורוד. הם הולכים למסיבה.',
        questions: [
          {
            questionEn: 'What does Dan have?',
            questionHe: 'מה יש לדן?',
            correct: 'A mask.',
            wrong: ['A crown.', 'A flag.'],
          },
          {
            questionEn: 'What color is the mask?',
            questionHe: 'באיזה צבע המסכה?',
            correct: 'Green.',
            wrong: ['Pink.', 'Blue.'],
          },
          {
            questionEn: 'What color is the crown?',
            questionHe: 'באיזה צבע הכתר?',
            correct: 'Pink.',
            wrong: ['Green.', 'Red.'],
          },
        ],
      },
      {
        passageEn: 'It is summer. Lea is at the beach. She sees the blue sea. She finds two shells. She likes the beach.',
        passageHe: 'קיץ. לאה בחוף הים. היא רואה את הים הכחול. היא מוצאת שני צדפים. היא אוהבת את החוף.',
        questions: [
          {
            questionEn: 'Where is Lea?',
            questionHe: 'איפה לאה?',
            correct: 'At the beach.',
            wrong: ['At the zoo.', 'In the sukkah.'],
          },
          {
            questionEn: 'What color is the sea?',
            questionHe: 'באיזה צבע הים?',
            correct: 'Blue.',
            wrong: ['Green.', 'Red.'],
          },
          {
            questionEn: 'How many shells does Lea find?',
            questionHe: 'כמה צדפים לאה מוצאת?',
            correct: 'Two shells.',
            wrong: ['One shell.', 'Five shells.'],
          },
        ],
      },
    ],
  },
};
