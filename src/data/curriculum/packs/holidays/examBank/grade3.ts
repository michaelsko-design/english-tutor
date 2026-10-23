import type { ExamBankPack } from '../../../examBank/types';

/**
 * The holidays pack's grade 3 exam bank (Feature 43), by the unit number in its mission ids.
 * Review-level grammar only (grade 2 and grade 3 units 1–2). The last 2 items of each list and
 * the second passage are for the mock exam.
 */
export const HOLIDAYS_GRADE_3_EXAM_BANK: ExamBankPack = {
  // Holidays, unit A: Rosh Hashana, Sukkot, Hanukkah and winter
  31: {
    vocabulary: [
      {
        clozeEn: 'The bees in the garden make ____.',
        clozeHe: 'הדבורים בגינה מכינות דבש.',
        answer: 'honey',
        wrong: ['umbrella', 'guest'],
      },
      {
        clozeEn: 'It is raining, so open your ____.',
        clozeHe: 'יורד גשם, אז פתחו את המטריה.',
        answer: 'umbrella',
        wrong: ['honey', 'year'],
      },
      {
        clozeEn: 'We eat lunch in the ____ on Sukkot.',
        clozeHe: 'בסוכות אוכלים ארוחת צהריים בסוכה.',
        answer: 'sukkah',
        wrong: ['doughnut', 'star'],
      },
      {
        clozeEn: 'Grandpa is our ____ at dinner tonight.',
        clozeHe: 'סבא הוא האורח שלנו בארוחת הערב הלילה.',
        answer: 'guest',
        wrong: ['winter', 'apple'],
      },
      {
        clozeEn: 'It is cold and rainy in ____.',
        clozeHe: 'בחורף קר וגשום.',
        answer: 'winter',
        wrong: ['chain', 'honey'],
      },
      {
        clozeEn: 'The ____ has pink jam in it.',
        clozeHe: 'יש ריבה ורודה בתוך הסופגנייה.',
        answer: 'doughnut',
        wrong: ['star', 'sukkah'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I have two sweet apples.',
        wrong: ['I have two sweet apple.', 'I have apples two sweet.'],
        explainHe: 'אחרי two מוסיפים s: apples. המספר והתיאור באים לפני הדבר.',
        hintHe: 'בדקו את סוף המילה כשיש שניים, ואת הסדר: מספר, תיאור, ואז הדבר.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'It is cold today.',
        wrong: ['It cold today.', 'It am cold today.'],
        explainHe: 'על מזג האוויר אומרים It is: It is cold.',
        hintHe: 'איזו צורה של be הולכת עם it? ובאנגלית אי אפשר לוותר עליה.',
      },
      {
        questionEn: 'Which one is correct?',
        correct: 'a yellow star',
        wrong: ['a star yellow', 'yellow a star'],
        explainHe: 'הצבע בא לפני הדבר, ו-a בא ראשון: a yellow star.',
        hintHe: 'מה בא קודם באנגלית: הצבע או הדבר? ואיפה המילה הקטנה?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We are happy on Hanukkah.',
        wrong: ['We is happy on Hanukkah.', 'We am happy on Hanukkah.'],
        explainHe: 'עם we אומרים are: We are happy.',
        hintHe: 'איזו צורה של be הולכת עם אנחנו?',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Is it a doughnut?',
        wrong: ['It is a doughnut?', 'Is a doughnut it?'],
        explainHe: 'בשאלה is בא בהתחלה ואחריו it: Is it a doughnut?',
        hintHe: 'בשאלה של כן או לא, המילה של be עוברת לתחילת המשפט.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'The lights are so bright.',
        wrong: ['The lights is so bright.', 'The light are so bright.'],
        explainHe: 'lights הם הרבה אורות, ולכן are.',
        hintHe: 'האם יש כאן אור אחד או הרבה? בדקו שהצורה של be מתאימה לסוף המילה.',
      },
    ],
    sentences: [
      { en: 'I dip my apple in sweet honey.', he: 'אני טובל/ת את התפוח שלי בדבש מתוק.' },
      { en: 'Our sukkah has a long chain.', he: 'בסוכה שלנו יש שרשרת ארוכה.' },
      { en: 'We have four guests on Sukkot.', he: 'בסוכות יש לנו ארבעה אורחים.' },
      { en: 'I like doughnuts with chocolate.', he: 'אני אוהב/ת סופגניות עם שוקולד.' },
      { en: 'My umbrella is green and orange.', he: 'המטריה שלי ירוקה וכתומה.' },
      { en: 'Happy new year, Grandma!', he: 'שנה טובה, סבתא!' },
    ],
    passages: [
      {
        passageEn: 'It is Sukkot. Noam has a big sukkah. It has yellow stars and a red chain. His friend Lior is a guest. They eat pizza in the sukkah.',
        passageHe: 'סוכות. לנועם יש סוכה גדולה. יש בה כוכבים צהובים ושרשרת אדומה. החבר שלו, ליאור, הוא אורח. הם אוכלים פיצה בסוכה.',
        questions: [
          {
            questionEn: 'What color are the stars?',
            questionHe: 'באיזה צבע הכוכבים?',
            correct: 'Yellow.',
            wrong: ['Red.', 'Green.'],
          },
          {
            questionEn: 'Who is the guest?',
            questionHe: 'מי האורח?',
            correct: 'Lior.',
            wrong: ['Noam.', 'Grandma.'],
          },
          {
            questionEn: 'What do they eat?',
            questionHe: 'מה הם אוכלים?',
            correct: 'Pizza.',
            wrong: ['Doughnuts.', 'Apples.'],
          },
        ],
      },
      {
        passageEn: 'It is winter. It is cold and windy. Shira is at home with her family. They light the Hanukkah candles. Shira has a doughnut. She is happy.',
        passageHe: 'חורף. קר ויש רוח. שירה בבית עם המשפחה שלה. הם מדליקים את נרות החנוכה. לשירה יש סופגנייה. היא שמחה.',
        questions: [
          {
            questionEn: 'What is the weather like?',
            questionHe: 'איך מזג האוויר?',
            correct: 'Cold and windy.',
            wrong: ['Hot and sunny.', 'Warm.'],
          },
          {
            questionEn: 'Where is Shira?',
            questionHe: 'איפה שירה?',
            correct: 'At home.',
            wrong: ['At school.', 'In the park.'],
          },
          {
            questionEn: 'What does Shira have?',
            questionHe: 'מה יש לשירה?',
            correct: 'A doughnut.',
            wrong: ['An umbrella.', 'A flag.'],
          },
        ],
      },
    ],
  },
  // Holidays, unit B: Tu BiShvat, Purim, Passover, Independence Day, Shavuot and summer
  32: {
    vocabulary: [
      {
        clozeEn: 'My Purim ____ is a big orange cat.',
        clozeHe: 'התחפושת שלי לפורים היא חתול כתום גדול.',
        answer: 'costume',
        wrong: ['cheese', 'spring'],
      },
      {
        clozeEn: 'The king has a gold ____ on his head.',
        clozeHe: 'למלך יש כתר זהב על הראש.',
        answer: 'crown',
        wrong: ['flower', 'summer'],
      },
      {
        clozeEn: 'On Tu BiShvat, we ____ a little tree.',
        clozeHe: 'בט"ו בשבט שותלים עץ קטן.',
        answer: 'plant',
        wrong: ['vacation', 'grapes'],
      },
      {
        clozeEn: 'The ____ in the sky are pink and green.',
        clozeHe: 'הזיקוקים בשמיים ורודים וירוקים.',
        answer: 'fireworks',
        wrong: ['crown', 'cheese'],
      },
      {
        clozeEn: 'The ____ on our window is blue and white.',
        clozeHe: 'הדגל על החלון שלנו כחול ולבן.',
        answer: 'flag',
        wrong: ['tree', 'vacation'],
      },
      {
        clozeEn: 'We eat ____ and cake on Shavuot.',
        clozeHe: 'בשבועות אוכלים גבינה ועוגה.',
        answer: 'cheese',
        wrong: ['costume', 'flag'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I have a pink costume.',
        wrong: ['I have a costume pink.', 'I pink have a costume.'],
        explainHe: 'הצבע בא לפני הדבר: a pink costume.',
        hintHe: 'איפה בא הצבע באנגלית: לפני הדבר או אחריו?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'The grapes are very juicy.',
        wrong: ['The grapes is very juicy.', 'The grapes am very juicy.'],
        explainHe: 'grapes הם הרבה ענבים, ולכן are.',
        hintHe: 'האם זה דבר אחד או הרבה? בחרו את הצורה של be שמתאימה להרבה.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I am excited on Purim.',
        wrong: ['I is excited on Purim.', 'I are excited on Purim.'],
        explainHe: 'עם I תמיד אומרים am: I am excited.',
        hintHe: 'איזו צורה של be הולכת תמיד עם אני?',
      },
      {
        questionEn: 'Which word means more than one tree?',
        correct: 'trees',
        wrong: ['tree', 'a trees'],
        explainHe: 'trees עם s ובלי a אומר כמה עצים.',
        hintHe: 'יותר מאחד מקבל תוספת בסוף. והאם a מתאימה ליותר מאחד?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'It is hot in summer.',
        wrong: ['It hot in summer.', 'It are hot in summer.'],
        explainHe: 'על מזג האוויר אומרים It is: It is hot.',
        hintHe: 'מה הולך עם it? ואל תשכחו שבאנגלית צריך את המילה הזאת.',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Is it a flag?',
        wrong: ['It a flag is?', 'Is a flag it?'],
        explainHe: 'בשאלה is בא בהתחלה, ואחריו it: Is it a flag?',
        hintHe: 'איזו מילה פותחת שאלה של כן או לא, ומה בא מיד אחריה?',
      },
    ],
    sentences: [
      { en: 'This is my queen costume.', he: 'זאת תחפושת המלכה שלי.' },
      { en: 'I have a little tree in a pot.', he: 'יש לי עץ קטן בעציץ.' },
      { en: 'The flowers in spring are pretty.', he: 'הפרחים באביב יפים.' },
      { en: 'We have a flag on our car.', he: 'יש לנו דגל על המכונית.' },
      { en: 'I like green grapes.', he: 'אני אוהב/ת ענבים ירוקים.' },
      { en: 'It is summer and I am happy.', he: 'קיץ ואני שמח/ה.' },
    ],
    passages: [
      {
        passageEn: 'It is Purim. Yael has a bee costume. It is yellow and black. Her brother Adi has a crown. He is a king. They are excited.',
        passageHe: 'פורים. ליעל יש תחפושת של דבורה. היא צהובה ושחורה. לאח שלה, עדי, יש כתר. הוא מלך. הם נרגשים.',
        questions: [
          {
            questionEn: 'What costume does Yael have?',
            questionHe: 'איזו תחפושת יש ליעל?',
            correct: 'A bee costume.',
            wrong: ['A cat costume.', 'A king costume.'],
          },
          {
            questionEn: 'What does Adi have?',
            questionHe: 'מה יש לעדי?',
            correct: 'A crown.',
            wrong: ['A flag.', 'A tree.'],
          },
          {
            questionEn: 'How do they feel?',
            questionHe: 'איך הם מרגישים?',
            correct: 'Excited.',
            wrong: ['Tired.', 'Sad.'],
          },
        ],
      },
      {
        passageEn: 'It is summer vacation. It is hot and sunny. Gal is at the sea with his dad. He has a red ball. Dad has cheese sandwiches.',
        passageHe: 'החופש הגדול. חם ושמשי. גל בים עם אבא שלו. יש לו כדור אדום. לאבא יש כריכים עם גבינה.',
        questions: [
          {
            questionEn: 'Where is Gal?',
            questionHe: 'איפה גל?',
            correct: 'At the sea.',
            wrong: ['At school.', 'In the sukkah.'],
          },
          {
            questionEn: 'What color is the ball at the sea?',
            questionHe: 'באיזה צבע הכדור?',
            correct: 'Red.',
            wrong: ['Blue.', 'Yellow.'],
          },
          {
            questionEn: 'What food does Dad have?',
            questionHe: 'מה יש לאבא?',
            correct: 'Cheese sandwiches.',
            wrong: ['Doughnuts.', 'Grapes.'],
          },
        ],
      },
    ],
  },
};
