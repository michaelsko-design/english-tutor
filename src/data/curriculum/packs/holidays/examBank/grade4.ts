import type { ExamBankPack } from '../../../examBank/types';

/**
 * The holidays pack's grade 4 exam bank (Feature 43), by the unit number in its mission ids.
 * Review-level grammar only (grade 3 and grade 4 units 1–2). The last 2 items of each list and
 * the second passage are for the mock exam.
 */
export const HOLIDAYS_GRADE_4_EXAM_BANK: ExamBankPack = {
  // Holidays, unit A: Rosh Hashana, Sukkot, Hanukkah and winter
  31: {
    vocabulary: [
      {
        clozeEn: 'I put a ____ on every plate for the guests.',
        clozeHe: 'שמים כרטיס ברכה על כל צלחת בשביל האורחים.',
        answer: 'card',
        wrong: ['rain', 'lemon'],
      },
      {
        clozeEn: 'The etrog is yellow, like a ____.',
        clozeHe: 'האתרוג צהוב, כמו לימון.',
        answer: 'lemon',
        wrong: ['roof', 'winter'],
      },
      {
        clozeEn: 'Put the ____ on the menorah and light it.',
        clozeHe: 'שימו את הנר בחנוכייה והדליקו אותו.',
        answer: 'candle',
        wrong: ['honey', 'table'],
      },
      {
        clozeEn: 'There is a paper ____ on the wall of the sukkah.',
        clozeHe: 'יש קישוט מנייר על הקיר של הסוכה.',
        answer: 'decoration',
        wrong: ['doughnut', 'rain'],
      },
      {
        clozeEn: 'The first ____ falls after Sukkot.',
        clozeHe: 'הגשם הראשון יורד אחרי סוכות.',
        answer: 'rain',
        wrong: ['card', 'sukkah'],
      },
      {
        clozeEn: 'The chocolate cake is very ____.',
        clozeHe: 'עוגת השוקולד מתוקה מאוד.',
        answer: 'sweet',
        wrong: ['roof', 'candle'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'There are four candles in the window.',
        wrong: ['There is four candles in the window.', 'There are four candle in the window.'],
        explainHe: 'כמה נרות: There are, ו-candles עם s.',
        hintHe: 'כמה נרות יש? בדקו את הצורה של "יש" ואת סוף המילה.',
      },
      {
        questionEn: 'The honey is inside the jar. Complete: "The honey is ____ the jar."',
        correct: 'in',
        wrong: ['on', 'under'],
        explainHe: 'בתוך הצנצנת אומרים in the jar.',
        hintHe: 'הדבש בפנים, לא למעלה ולא למטה. איזו מילת מקום אומרת "בתוך"?',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Can you see the sukkah?',
        wrong: ['Do you can see the sukkah?', 'Can you sees the sukkah?'],
        explainHe: 'שאלה עם can מתחילה ב-Can, והפועל בא בלי s.',
        hintHe: 'שאלה של יכולת מתחילה במילת היכולת (בלי do), והפועל לא מקבל סיומת.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'There is a doughnut on my plate.',
        wrong: ['There are a doughnut on my plate.', 'There is a doughnut in under my plate.'],
        explainHe: 'על דבר אחד אומרים There is, ועל הצלחת אומרים on my plate.',
        hintHe: 'כמה סופגניות יש? ואיזו מילת מקום מתאימה למשהו שמונח על צלחת?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'It is cold and rainy in winter.',
        wrong: ['It cold and rainy in winter.', 'It are cold and rainy in winter.'],
        explainHe: 'על מזג האוויר אומרים It is.',
        hintHe: 'מה הולך עם it? ובאנגלית אי אפשר לוותר על המילה הזאת.',
      },
      {
        questionEn: 'Complete the answer: "Can your brother light the candles?" "No, he ____."',
        correct: "can't",
        wrong: ["don't", "isn't"],
        explainHe: "על שאלה עם Can עונים בקצרה עם can't: No, he can't.",
        hintHe: 'התשובה הקצרה חוזרת על המילה שפותחת את השאלה, בצורת השלילה.',
      },
    ],
    sentences: [
      { en: 'There is a jar of honey on the table.', he: 'יש צנצנת דבש על השולחן.' },
      { en: 'I can make a card for Grandma.', he: 'אני יכול/ה להכין כרטיס ברכה לסבתא.' },
      { en: 'There are paper decorations in our sukkah.', he: 'יש קישוטי נייר בסוכה שלנו.' },
      { en: 'The cat is under the sukkah table.', he: 'החתול מתחת לשולחן בסוכה.' },
      { en: 'We can eat doughnuts on Hanukkah.', he: 'בחנוכה אנחנו יכולים לאכול סופגניות.' },
      { en: 'I love the sound of the rain at night.', he: 'אני אוהב/ת את הקול של הגשם בלילה.' },
    ],
    passages: [
      {
        passageEn: 'It is the first night of Sukkot. There are ten people in the sukkah. There is a big lamp on the roof. Grandpa has an etrog. The children sing songs.',
        passageHe: 'הלילה הראשון של סוכות. יש עשרה אנשים בסוכה. יש מנורה גדולה על הגג. לסבא יש אתרוג. הילדים שרים שירים.',
        questions: [
          {
            questionEn: 'How many people are in the sukkah?',
            questionHe: 'כמה אנשים יש בסוכה?',
            correct: 'Ten.',
            wrong: ['Two.', 'Six.'],
          },
          {
            questionEn: 'What is on the roof?',
            questionHe: 'מה יש על הגג?',
            correct: 'A big lamp.',
            wrong: ['A cat.', 'A flag.'],
          },
          {
            questionEn: 'Who has an etrog?',
            questionHe: 'למי יש אתרוג?',
            correct: 'Grandpa.',
            wrong: ['The children.', 'Mom.'],
          },
        ],
      },
      {
        passageEn: 'Tamar loves Hanukkah. There are nine candles in her menorah. She can light them with Dad. Outside, there is rain. Inside, Mom makes doughnuts with jam.',
        passageHe: 'תמר אוהבת את חנוכה. יש תשעה נרות בחנוכייה שלה. היא מדליקה אותם עם אבא. בחוץ יש גשם. בפנים אמא מכינה סופגניות עם ריבה.',
        questions: [
          {
            questionEn: 'How many candles are in the menorah?',
            questionHe: 'כמה נרות יש בחנוכייה?',
            correct: 'Nine.',
            wrong: ['Eight.', 'Two.'],
          },
          {
            questionEn: 'Who does Tamar light the candles with?',
            questionHe: 'עם מי תמר מדליקה את הנרות?',
            correct: 'With Dad.',
            wrong: ['With Mom.', 'With her friend.'],
          },
          {
            questionEn: 'What does Mom make?',
            questionHe: 'מה אמא מכינה?',
            correct: 'Doughnuts with jam.',
            wrong: ['Apples with honey.', 'A big cake.'],
          },
        ],
      },
    ],
  },
  // Holidays, unit B: Tu BiShvat, Purim, Passover, Independence Day, Shavuot and summer
  32: {
    vocabulary: [
      {
        clozeEn: 'Plant the ____ in the ground and give it water.',
        clozeHe: 'שתלו את הזרע באדמה ותנו לו מים.',
        answer: 'seed',
        wrong: ['pool', 'flag'],
      },
      {
        clozeEn: 'My Purim ____ is a green dinosaur.',
        clozeHe: 'התחפושת שלי לפורים היא דינוזאור ירוק.',
        answer: 'costume',
        wrong: ['wheat', 'spring'],
      },
      {
        clozeEn: 'We eat sandwiches on a blanket at the ____.',
        clozeHe: 'אנחנו אוכלים כריכים על שמיכה בפיקניק.',
        answer: 'picnic',
        wrong: ['crown', 'seed'],
      },
      {
        clozeEn: 'The ____ in the field is tall and yellow.',
        clozeHe: 'החיטה בשדה גבוהה וצהובה.',
        answer: 'wheat',
        wrong: ['costume', 'vacation'],
      },
      {
        clozeEn: 'I can jump into the ____ in summer.',
        clozeHe: 'בקיץ אפשר לקפוץ לבריכה.',
        answer: 'pool',
        wrong: ['tree', 'fireworks'],
      },
      {
        clozeEn: 'In ____, the flowers open and the birds sing.',
        clozeHe: 'באביב הפרחים נפתחים והציפורים שרות.',
        answer: 'spring',
        wrong: ['crown', 'picnic'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'There are many trees in the forest.',
        wrong: ['There is many trees in the forest.', 'There are many tree in the forest.'],
        explainHe: 'הרבה עצים: There are, ו-trees עם s.',
        hintHe: 'האם יש כאן עץ אחד או הרבה? בדקו את הצורה של "יש" ואת סוף המילה.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'My sister can make a crown.',
        wrong: ['My sister can makes a crown.', 'My sister cans make a crown.'],
        explainHe: 'can לא משתנה, והפועל אחריו בלי s: can make.',
        hintHe: 'גם עם היא, מילת היכולת והפועל שאחריה נשארים בלי תוספת.',
      },
      {
        questionEn: 'Which one is correct?',
        correct: 'a blue and white flag',
        wrong: ['a flag blue and white', 'blue and white a flag'],
        explainHe: 'הצבעים באים לפני הדבר, ו-a בהתחלה.',
        hintHe: 'מה בא קודם באנגלית: הצבעים או הדבר? ואיפה המילה הקטנה?',
      },
      {
        questionEn: 'The basket is below the tree. Complete: "The basket is ____ the tree."',
        correct: 'under',
        wrong: ['on', 'in'],
        explainHe: 'מתחת לעץ אומרים under the tree.',
        hintHe: 'הסל למטה, מתחת לענפים. איזו מילת מקום אומרת "מתחת"?',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Is there a pool in the hotel?',
        wrong: ['There is a pool in the hotel?', 'Are there a pool in the hotel?'],
        explainHe: 'בשאלה is בא לפני there, ועל דבר אחד אומרים is: Is there...?',
        hintHe: 'בשאלה של כן או לא שתי המילים הראשונות מתחלפות. וכמה בריכות יש כאן?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We are on vacation in July.',
        wrong: ['We is on vacation in July.', 'We am on vacation in July.'],
        explainHe: 'עם we אומרים are: We are.',
        hintHe: 'איזו צורה של be הולכת עם אנחנו?',
      },
    ],
    sentences: [
      { en: 'There are three seeds in my hand.', he: 'יש שלושה זרעים ביד שלי.' },
      { en: 'Can you see my gold crown?', he: 'אתם רואים את כתר הזהב שלי?' },
      { en: 'We have a picnic under a big tree.', he: 'אנחנו עושים פיקניק מתחת לעץ גדול.' },
      { en: 'The fireworks are red, blue and green.', he: 'הזיקוקים אדומים, כחולים וירוקים.' },
      { en: 'There is a flag on every house.', he: 'יש דגל על כל בית.' },
      { en: 'In summer, I can swim every day.', he: 'בקיץ אני יכול/ה לשחות כל יום.' },
    ],
    passages: [
      {
        passageEn: 'It is Purim at school. There are many funny costumes. Ido is a pirate. Shani has a pink crown. The teacher is a big clown. Everyone can dance in the hall.',
        passageHe: 'פורים בבית הספר. יש הרבה תחפושות מצחיקות. עידו פיראט. לשני יש כתר ורוד. המורה ליצן גדול. כולם יכולים לרקוד באולם.',
        questions: [
          {
            questionEn: 'What is Ido?',
            questionHe: 'במה עידו מחופש?',
            correct: 'A pirate.',
            wrong: ['A clown.', 'A king.'],
          },
          {
            questionEn: 'What color is Shani’s crown?',
            questionHe: 'באיזה צבע הכתר של שני?',
            correct: 'Pink.',
            wrong: ['Gold.', 'Blue.'],
          },
          {
            questionEn: 'Where can everyone dance?',
            questionHe: 'איפה כולם יכולים לרקוד?',
            correct: 'In the hall.',
            wrong: ['In the park.', 'In the pool.'],
          },
        ],
      },
      {
        passageEn: 'Summer vacation is here! Liam and his family go to a hotel. There is a big pool there. Liam can swim very well. His little brother can’t swim yet, so he plays in the sand.',
        passageHe: 'החופש הגדול כאן! ליאם והמשפחה שלו נוסעים למלון. יש שם בריכה גדולה. ליאם יודע לשחות טוב מאוד. אח שלו הקטן עוד לא יודע לשחות, אז הוא משחק בחול.',
        questions: [
          {
            questionEn: 'Where does Liam’s family go?',
            questionHe: 'לאן המשפחה של ליאם נוסעת?',
            correct: 'To a hotel.',
            wrong: ['To the forest.', 'To Grandma.'],
          },
          {
            questionEn: 'What is at the hotel?',
            questionHe: 'מה יש במלון?',
            correct: 'A big pool.',
            wrong: ['A big tree.', 'A wheat field.'],
          },
          {
            questionEn: 'Where does the little brother play?',
            questionHe: 'איפה האח הקטן משחק?',
            correct: 'In the sand.',
            wrong: ['In the pool.', 'In the hall.'],
          },
        ],
      },
    ],
  },
};
