import type { ExamBankPack } from '../../../examBank/types';

/**
 * The holidays pack's grade 2 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const HOLIDAYS_GRADE_2_EXAM_BANK: ExamBankPack = {
  // Unit 31: Rosh Hashana, Sukkot, Hanukkah & rain
  31: {
    vocabulary: [
      {
        clozeEn: 'Grandma bakes a honey ____ for the holiday.',
        clozeHe: 'סבתא אופה עוגת דבש לחג.',
        answer: 'cake',
        wrong: ['star', 'rain'],
      },
      {
        clozeEn: 'We start a new ____ on Rosh Hashana.',
        clozeHe: 'בראש השנה מתחילים שנה חדשה.',
        answer: 'year',
        wrong: ['palm', 'candle'],
      },
      {
        clozeEn: 'Take an umbrella! The ____ is coming.',
        clozeHe: 'קחו מטרייה! הגשם מגיע.',
        answer: 'rain',
        wrong: ['honey', 'chain'],
      },
      {
        clozeEn: 'We light the ____ on Hanukkah.',
        clozeHe: 'מדליקים את הנר בחנוכה.',
        answer: 'candle',
        wrong: ['sukkah', 'cake'],
      },
      {
        clozeEn: 'I have a jam ____ on my plate.',
        clozeHe: 'יש לי סופגנייה עם ריבה בצלחת.',
        answer: 'donut',
        wrong: ['star', 'year'],
      },
      {
        clozeEn: 'My friends come to my ____ on Sukkot.',
        clozeHe: 'החברים שלי באים לסוכה שלי בסוכות.',
        answer: 'sukkah',
        wrong: ['umbrella', 'donut'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which one is correct?',
        correct: 'an orange candle',
        wrong: ['a orange candle', 'an orange candles'],
        explainHe: 'orange מתחילה בתנועה, ולכן an. ויש נר אחד, בלי s.',
        hintHe: 'באיזו אות מתחילה המילה שאחרי? וכמה נרות יש?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We like honey cake.',
        wrong: ['We likes honey cake.', 'We honey cake like.'],
        explainHe: 'עם We אומרים like, בלי s: We like.',
        hintHe: 'בדקו את הפועל אחרי "אנחנו", ואת סדר המילים.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'This is my umbrella.',
        wrong: ['This are my umbrella.', 'This my umbrella is.'],
        explainHe: 'על דבר אחד אומרים This is my: is מתאים ליחיד.',
        hintHe: 'מדברים על דבר אחד. איזה פועל מתאים, ואיפה הוא עומד?',
      },
      {
        questionEn: 'What is this? (a star) Which answer is correct?',
        correct: 'It is a star.',
        wrong: ['It is star.', 'Is it a star.'],
        explainHe: 'עונים It is a star: לפני דבר אחד צריך a.',
        hintHe: 'תשובה מתחילה ב-It is. מה חסר לפני הדבר?',
      },
      {
        questionEn: 'Which word means more than one donut?',
        correct: 'donuts',
        wrong: ['donut', 'a donut'],
        explainHe: 'יותר מסופגנייה אחת: מוסיפים s: donuts.',
        hintHe: 'יותר מסופגנייה אחת: מה קורה לסוף המילה?',
      },
      {
        questionEn: 'Which one is correct?',
        correct: 'a sweet apple',
        wrong: ['an sweet apple', 'a apple sweet'],
        explainHe: 'sweet מתחילה ב-s, שהיא לא תנועה, ולכן a. והמילה שמתארת באה לפני הדבר.',
        hintHe: 'הסתכלו על המילה שמיד אחרי המילה הקטנה: באיזו אות היא מתחילה?',
      },
    ],
    sentences: [
      { en: 'Have a sweet new year!', he: 'שתהיה לכם שנה טובה ומתוקה!' },
      { en: 'This is my little sukkah.', he: 'זו הסוכה הקטנה שלי.' },
      { en: 'I see a big star in the sky.', he: 'אני רואה כוכב גדול בשמיים.' },
      { en: 'My brother has a long paper chain.', he: 'לאח שלי יש שרשרת נייר ארוכה.' },
      { en: 'We like donuts and candles.', he: 'אנחנו אוהבים סופגניות ונרות.' },
      { en: 'I have a big blue umbrella.', he: 'יש לי מטרייה כחולה גדולה.' },
    ],
    passages: [
      {
        passageEn: 'It is Sukkot. Yoni has a big sukkah. It has a palm roof. His sister makes a red chain. At night, they see the moon.',
        passageHe: 'סוכות. ליוני יש סוכה גדולה. יש לה גג מעלי דקל. אחותו מכינה שרשרת אדומה. בלילה הם רואים את הירח.',
        questions: [
          {
            questionEn: 'Who has a big sukkah?',
            questionHe: 'למי יש סוכה גדולה?',
            correct: 'Yoni.',
            wrong: ['Dad.', 'Grandma.'],
          },
          {
            questionEn: 'What color is the chain his sister makes?',
            questionHe: 'באיזה צבע השרשרת שאחותו מכינה?',
            correct: 'Red.',
            wrong: ['Green.', 'Blue.'],
          },
          {
            questionEn: 'What do they see at night?',
            questionHe: 'מה הם רואים בלילה?',
            correct: 'The moon.',
            wrong: ['The sun.', 'A rainbow.'],
          },
        ],
      },
      {
        passageEn: 'It is a cold day. The rain falls. Lia has a pink umbrella. At home, Grandma has a box of donuts. They light the candles.',
        passageHe: 'יום קר. יורד גשם. לליה יש מטרייה ורודה. בבית, לסבתא יש קופסה של סופגניות. הן מדליקות את הנרות.',
        questions: [
          {
            questionEn: 'What color is the umbrella?',
            questionHe: 'באיזה צבע המטרייה?',
            correct: 'Pink.',
            wrong: ['Blue.', 'Red.'],
          },
          {
            questionEn: 'What does Grandma have at home?',
            questionHe: 'מה יש לסבתא בבית?',
            correct: 'A box of donuts.',
            wrong: ['A pink umbrella.', 'A honey cake.'],
          },
          {
            questionEn: 'What do they light?',
            questionHe: 'מה הן מדליקות?',
            correct: 'The candles.',
            wrong: ['The sukkah.', 'The cake.'],
          },
        ],
      },
    ],
  },
  // Unit 32: Tu BiShvat, Purim, Passover, Independence Day, Shavuot & summer
  32: {
    vocabulary: [
      {
        clozeEn: 'On Purim I wear a lion ____.',
        clozeHe: 'בפורים אני לובש/ת תחפושת של אריה.',
        answer: 'costume',
        wrong: ['soup', 'pool'],
      },
      {
        clozeEn: 'We put the ____ in a pot with water.',
        clozeHe: 'שמים את הצמח בעציץ עם מים.',
        answer: 'plant',
        wrong: ['cheese', 'party'],
      },
      {
        clozeEn: 'Grandma makes hot chicken ____.',
        clozeHe: 'סבתא מכינה מרק עוף חם.',
        answer: 'soup',
        wrong: ['flag', 'crown'],
      },
      {
        clozeEn: 'On Passover we eat ____, not bread.',
        clozeHe: 'בפסח אוכלים מצה ולא לחם.',
        answer: 'matzah',
        wrong: ['shell', 'mask'],
      },
      {
        clozeEn: 'I swim in the ____ in summer.',
        clozeHe: 'אני שוחה בבריכה בקיץ.',
        answer: 'pool',
        wrong: ['cheese', 'crown'],
      },
      {
        clozeEn: 'The king has a gold ____.',
        clozeHe: 'למלך יש כתר זהב.',
        answer: 'crown',
        wrong: ['soup', 'plant'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We like white cheese.',
        wrong: ['We likes white cheese.', 'We cheese like white.'],
        explainHe: 'עם We אומרים like, והצבע בא לפני הדבר: white cheese.',
        hintHe: 'בדקו את הפועל אחרי "אנחנו", ואת המקום של הצבע.',
      },
      {
        questionEn: 'Which word means more than one shell?',
        correct: 'shells',
        wrong: ['shell', 'a shell'],
        explainHe: 'יותר מצדף אחד: shells עם s.',
        hintHe: 'יותר מצדף אחד: מה קורה לסוף המילה?',
      },
      {
        questionEn: 'What is this? (a flag) Which answer is correct?',
        correct: 'It is a flag.',
        wrong: ['It a flag is.', 'Is it flag.'],
        explainHe: 'עונים It is a flag: It is, ואז a והדבר.',
        hintHe: 'תשובה מתחילה ב-It, ואחריו הפועל. מה בא לפני הדבר?',
      },
      {
        questionEn: 'Which one is correct?',
        correct: 'an orange mask',
        wrong: ['a orange mask', 'an mask orange'],
        explainHe: 'orange מתחילה בתנועה, ולכן an. והצבע בא לפני הדבר.',
        hintHe: 'באיזו אות מתחילה המילה שאחרי? ואיפה עומד הצבע?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'This is my flag.',
        wrong: ['This is my flags.', 'This my is flag.'],
        explainHe: 'על דבר אחד אומרים This is my flag, בלי s.',
        hintHe: 'מדברים על דבר אחד. בדקו את סוף המילה ואת הסדר.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We have a party at the pool.',
        wrong: ['We has a party at the pool.', 'We a party have at the pool.'],
        explainHe: 'עם We אומרים have: We have a party.',
        hintHe: 'בדקו איזה פועל מתאים ל"אנחנו", ואיפה הוא עומד.',
      },
    ],
    sentences: [
      { en: 'My costume has a red crown.', he: 'לתחפושת שלי יש כתר אדום.' },
      { en: 'This is my little green plant.', he: 'זה הצמח הירוק הקטן שלי.' },
      { en: 'We like hot soup with matzah.', he: 'אנחנו אוהבים מרק חם עם מצה.' },
      { en: 'I see blue and white flags.', he: 'אני רואה דגלים כחולים ולבנים.' },
      { en: 'We eat cheese on Shavuot.', he: 'אוכלים גבינה בשבועות.' },
      { en: 'I have a big shell from the beach.', he: 'יש לי צדף גדול מחוף הים.' },
    ],
    passages: [
      {
        passageEn: 'It is Purim. Adam has a costume. It is a lion costume! His sister has a mask. The mask is green and pink.',
        passageHe: 'פורים. לאדם יש תחפושת. זו תחפושת של אריה! לאחות שלו יש מסכה. המסכה ירוקה וורודה.',
        questions: [
          {
            questionEn: 'What costume does Adam have?',
            questionHe: 'איזו תחפושת יש לאדם?',
            correct: 'A lion costume.',
            wrong: ['A cat costume.', 'A king costume.'],
          },
          {
            questionEn: 'Who has a mask?',
            questionHe: 'למי יש מסכה?',
            correct: 'His sister.',
            wrong: ['His mom.', 'His dad.'],
          },
          {
            questionEn: 'What colors are on the mask?',
            questionHe: 'אילו צבעים יש על המסכה?',
            correct: 'Green and pink.',
            wrong: ['Blue and white.', 'Red and yellow.'],
          },
        ],
      },
      {
        passageEn: 'It is summer. Gal and Dad go to the beach. Gal finds a big shell. Then they swim in the pool. They have cheese sandwiches.',
        passageHe: 'קיץ. גל ואבא נוסעים לחוף הים. גל מוצא צדף גדול. אחר כך הם שוחים בבריכה. יש להם כריכים עם גבינה.',
        questions: [
          {
            questionEn: 'Where do Gal and Dad go?',
            questionHe: 'לאן גל ואבא נוסעים?',
            correct: 'To the beach.',
            wrong: ['To the park.', 'To school.'],
          },
          {
            questionEn: 'What does Gal find?',
            questionHe: 'מה גל מוצא?',
            correct: 'A big shell.',
            wrong: ['A flag.', 'A crown.'],
          },
          {
            questionEn: 'Where do they swim?',
            questionHe: 'איפה הם שוחים?',
            correct: 'In the pool.',
            wrong: ['In the sea.', 'In the rain.'],
          },
        ],
      },
    ],
  },
};
