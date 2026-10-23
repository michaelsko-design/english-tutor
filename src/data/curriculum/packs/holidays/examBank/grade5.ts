import type { ExamBankPack } from '../../../examBank/types';

/**
 * The holidays pack's grade 5 exam bank (Feature 43), by the unit number in its mission ids.
 * Review-level grammar with holiday words. The last 2 items of each list and the second passage
 * are for the mock exam.
 */
export const HOLIDAYS_GRADE_5_EXAM_BANK: ExamBankPack = {
  // Autumn & winter: Rosh Hashana, Sukkot, Hanukkah, rain; there is / are, have / has, places
  31: {
    vocabulary: [
      {
        clozeEn: 'Bees make ____ in the summer.',
        clozeHe: 'דבורים מכינות דבש בקיץ.',
        answer: 'honey',
        wrong: ['rain', 'coat'],
      },
      {
        clozeEn: 'On Sukkot we eat our meals in the ____.',
        clozeHe: 'בסוכות אנחנו אוכלים את הארוחות שלנו בסוכה.',
        answer: 'sukkah',
        wrong: ['winter', 'candle'],
      },
      {
        clozeEn: 'It is cold today, so I need my warm ____.',
        clozeHe: 'קר היום, אז אני צריך/ה את המעיל החם שלי.',
        answer: 'coat',
        wrong: ['honey', 'roof'],
      },
      {
        clozeEn: 'Hanukkah is a ____ of lights.',
        clozeHe: 'חנוכה הוא חג של אורות.',
        answer: 'holiday',
        wrong: ['decoration', 'coat'],
      },
      {
        clozeEn: 'Snow and cold days come in ____.',
        clozeHe: 'שלג וימים קרים באים בחורף.',
        answer: 'winter',
        wrong: ['sukkah', 'honey'],
      },
      {
        clozeEn: 'The children play ____ in the yard.',
        clozeHe: 'הילדים משחקים בחוץ בחצר.',
        answer: 'outside',
        wrong: ['sweet', 'wish'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete: "There ____ a honey cake on the table."',
        correct: 'is',
        wrong: ['are', 'am'],
        explainHe: 'a honey cake היא עוגה אחת, ולכן There is.',
        hintHe: 'כמה עוגות יש? בדקו אם זה יחיד או רבים.',
      },
      {
        questionEn: 'Complete: "There ____ eight candles in the window."',
        correct: 'are',
        wrong: ['is', 'be'],
        explainHe: 'eight candles הם רבים, ולכן There are.',
        hintHe: 'שמונה נרות הם רבים. איזו צורה של be מתאימה לרבים?',
      },
      {
        questionEn: 'Complete: "My grandpa ____ a long white beard."',
        correct: 'has',
        wrong: ['have', 'is'],
        explainHe: 'my grandpa הוא he, ועם he אומרים has.',
        hintHe: 'my grandpa הוא he, כלומר יחיד. איזו צורה של "יש ל..." מתאימה ל-he?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'The decorations are on the walls of the sukkah.',
        wrong: ['The decorations is on the walls of the sukkah.', 'The decorations are on the wall of the sukkahs.'],
        explainHe: 'the decorations הם רבים, ולכן are. יש סוכה אחת עם כמה קירות: the walls of the sukkah.',
        hintHe: 'הקישוטים הם רבים, ויש רק סוכה אחת. בדקו את הפועל ואת שמות העצם.',
      },
      {
        questionEn: 'Complete: "The cat is sleeping ____ the table." (מתחת ל-)',
        correct: 'under',
        wrong: ['on', 'in'],
        explainHe: 'under אומר "מתחת ל-". on זה "על", ו-in זה "בתוך".',
        hintHe: 'קראו את המילה בעברית בסוגריים ובחרו את מילת המקום שמתאימה לה.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We are at home because of the rain.',
        wrong: ['We is at home because of the rain.', 'We am at home because of the rain.'],
        explainHe: 'עם we אומרים are: we are.',
        hintHe: 'הנושא הוא we. איזו צורה של be באה עם we?',
      },
    ],
    sentences: [
      { en: 'There is a round challah for the new year.', he: 'יש חלה עגולה לשנה החדשה.' },
      { en: 'My wish is a sweet and happy year.', he: 'המשאלה שלי היא שנה מתוקה ושמחה.' },
      { en: 'The roof of our sukkah has green branches.', he: 'לגג של הסוכה שלנו יש ענפים ירוקים.' },
      { en: 'We can see the stars from the sukkah.', he: 'אנחנו יכולים לראות את הכוכבים מהסוכה.' },
      { en: 'There are many candles in the window tonight.', he: 'יש הרבה נרות בחלון הלילה.' },
      { en: 'I have boots and a coat for the rain.', he: 'יש לי מגפיים ומעיל לגשם.' },
    ],
    passages: [
      {
        passageEn:
          'Today is the first day of Sukkot. Our sukkah is in the garden next to a big tree. There are paper birds and lemons on the walls. My little sister has a red decoration in her hand. We eat lunch outside with our friends.',
        passageHe:
          'היום הוא היום הראשון של סוכות. הסוכה שלנו בגינה, ליד עץ גדול. על הקירות יש ציפורי נייר ולימונים. לאחותי הקטנה יש קישוט אדום ביד. אנחנו אוכלים ארוחת צהריים בחוץ עם החברים שלנו.',
        questions: [
          {
            questionEn: 'Where is their sukkah this year?',
            questionHe: 'איפה הסוכה שלהם השנה?',
            correct: 'In the garden next to a big tree.',
            wrong: ['On the roof of the house.', 'Next to the school.'],
          },
          {
            questionEn: 'What is on the walls?',
            questionHe: 'מה יש על הקירות?',
            correct: 'Paper birds and lemons.',
            wrong: ['Pictures of the family.', 'Big flags.'],
          },
          {
            questionEn: 'What does the little sister have?',
            questionHe: 'מה יש לאחות הקטנה?',
            correct: 'A red decoration.',
            wrong: ['A yellow lemon.', 'A paper bird.'],
          },
        ],
      },
      {
        passageEn:
          'It is winter and there is a lot of rain. Yoni is at home with his grandma. They have a box of eight candles for Hanukkah. Grandma has a warm cup of tea. At six o’clock the family lights the first candle.',
        passageHe:
          'זה חורף ויש הרבה גשם. יוני בבית עם סבתא שלו. יש להם קופסה של שמונה נרות לחנוכה. לסבתא יש כוס תה חמה. בשעה שש המשפחה מדליקה את הנר הראשון.',
        questions: [
          {
            questionEn: 'Who is at home with Yoni?',
            questionHe: 'מי בבית עם יוני?',
            correct: 'His grandma.',
            wrong: ['His teacher.', 'His cousin.'],
          },
          {
            questionEn: 'How many candles are in the box?',
            questionHe: 'כמה נרות יש בקופסה?',
            correct: 'Eight candles.',
            wrong: ['Two candles.', 'Six candles.'],
          },
          {
            questionEn: 'What time does the family light the first candle?',
            questionHe: 'באיזו שעה המשפחה מדליקה את הנר הראשון?',
            correct: 'At six o’clock.',
            wrong: ['At eight o’clock.', 'In the morning.'],
          },
        ],
      },
    ],
  },

  // Spring & summer: Tu BiShvat, Purim, Passover, Independence Day, Shavuot; can, have / has, time
  32: {
    vocabulary: [
      {
        clozeEn: 'On Purim I wear a ____ on my face.',
        clozeHe: 'בפורים אני שם/ה מסכה על הפנים.',
        answer: 'mask',
        wrong: ['cup', 'spring'],
      },
      {
        clozeEn: 'The ____ of Israel has a blue star.',
        clozeHe: 'בדגל של ישראל יש מגן דוד כחול.',
        answer: 'flag',
        wrong: ['basket', 'matzah'],
      },
      {
        clozeEn: 'Esther is the ____ in the Purim story.',
        clozeHe: 'אסתר היא המלכה בסיפור של פורים.',
        answer: 'queen',
        wrong: ['flower', 'cup'],
      },
      {
        clozeEn: 'Before Passover we ____ every room in the house.',
        clozeHe: 'לפני פסח אנחנו מנקים כל חדר בבית.',
        answer: 'clean',
        wrong: ['mask', 'flag'],
      },
      {
        clozeEn: 'In ____ the trees are green and the days are warm.',
        clozeHe: 'באביב העצים ירוקים והימים חמימים.',
        answer: 'spring',
        wrong: ['queen', 'basket'],
      },
      {
        clozeEn: 'On Shavuot the children carry a ____ of fruit.',
        clozeHe: 'בשבועות הילדים נושאים סל של פירות.',
        answer: 'basket',
        wrong: ['vacation', 'mask'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete: "We ____ plant trees on Tu BiShvat."',
        correct: 'can',
        wrong: ['cans', 'can to'],
        explainHe: 'can לא משתנה ולא בא עם to: we can plant.',
        hintHe: 'המילה "יכולים" באנגלית לא מקבלת סיומת, ולא באה אחריה מילה נוספת לפני הפועל.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: "My little brother can't read the story.",
        wrong: ["My little brother can't reads the story.", "My little brother don't can read the story."],
        explainHe: 'אחרי can’t בא פועל בסיסי בלי s: can’t read.',
        hintHe: 'אחרי מילת השלילה של "יכול" הפועל בא בצורה הבסיסית, בלי s.',
      },
      {
        questionEn: 'Complete: "The Seder starts at ____." (7:30)',
        correct: 'half past seven',
        wrong: ['half past eight', "seven o'clock"],
        explainHe: '7:30 זה half past seven: חצי שעה אחרי שבע.',
        hintHe: 'השעה היא חצי שעה אחרי שבע. סופרים מהשעה שעברה.',
      },
      {
        questionEn: 'Complete: "Our teacher ____ a basket of flowers."',
        correct: 'has',
        wrong: ['have', 'haves'],
        explainHe: 'our teacher הוא he או she, ולכן has.',
        hintHe: 'המורה הוא אדם אחד. איזו צורה של "יש ל..." מתאימה ל-he / she? ויש צורה אחת שלא קיימת.',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Can you see the fireworks?',
        wrong: ['You can see the fireworks?', 'Can you sees the fireworks?'],
        explainHe: 'בשאלה can בא לפני you, והפועל בא בצורה בסיסית: Can you see…?',
        hintHe: 'בשאלה עם "יכול" המילה הזאת עוברת לתחילת המשפט, והפועל נשאר בסיסי.',
      },
      {
        questionEn: 'Complete: "There ____ four cups of grape juice on the table."',
        correct: 'are',
        wrong: ['is', 'am'],
        explainHe: 'four cups הם רבים, ולכן There are.',
        hintHe: 'ארבע כוסות הן רבים. איזו צורה מתאימה לרבים?',
      },
    ],
    sentences: [
      { en: 'On Tu BiShvat we eat dates and figs.', he: 'בט״ו בשבט אנחנו אוכלים תמרים ותאנים.' },
      { en: 'My mask has gold stars and blue feathers.', he: 'למסכה שלי יש כוכבי זהב ונוצות כחולות.' },
      { en: 'There is a big plate of matzah on the table.', he: 'יש צלחת גדולה של מצות על השולחן.' },
      { en: 'Can you help me clean the kitchen?', he: 'אתם יכולים לעזור לי לנקות את המטבח?' },
      { en: 'We have flags on our car for Independence Day.', he: 'יש לנו דגלים על האוטו ליום העצמאות.' },
      { en: 'In the summer vacation I can sleep late.', he: 'בחופש הגדול אני יכול/ה לישון עד מאוחר.' },
    ],
    passages: [
      {
        passageEn:
          'It is Purim and there is a big party at school. Noga is a queen with a long purple dress. Her friend Amir has a lion mask. The music is loud and everyone can dance. At twelve o’clock the children go home.',
        passageHe:
          'זה פורים ויש מסיבה גדולה בבית הספר. נוגה היא מלכה עם שמלה סגולה ארוכה. לחבר שלה אמיר יש מסכה של אריה. המוזיקה רועשת וכולם יכולים לרקוד. בשעה שתים עשרה הילדים הולכים הביתה.',
        questions: [
          {
            questionEn: 'Where is the Purim party?',
            questionHe: 'איפה מסיבת פורים?',
            correct: 'At school.',
            wrong: ['At the beach.', 'In the park.'],
          },
          {
            questionEn: 'What does Amir have?',
            questionHe: 'מה יש לאמיר?',
            correct: 'A lion mask.',
            wrong: ['A purple dress.', 'A gold crown.'],
          },
          {
            questionEn: 'When do the children go home?',
            questionHe: 'מתי הילדים הולכים הביתה?',
            correct: 'At twelve o’clock.',
            wrong: ['At ten o’clock.', 'At night.'],
          },
        ],
      },
      {
        passageEn:
          'Summer is here and school is over. Ron has a long vacation. He can swim in the sea every morning. In the afternoon he has ice cream with his cousins. Ron likes the summer more than the winter.',
        passageHe:
          'הקיץ כאן והלימודים נגמרו. לרון יש חופש ארוך. הוא יכול לשחות בים בכל בוקר. אחר הצהריים הוא אוכל גלידה עם בני הדודים שלו. רון אוהב את הקיץ יותר מהחורף.',
        questions: [
          {
            questionEn: 'What can Ron do every morning?',
            questionHe: 'מה רון יכול לעשות בכל בוקר?',
            correct: 'Swim in the sea.',
            wrong: ['Play football.', 'Read books.'],
          },
          {
            questionEn: 'Who does Ron eat ice cream with?',
            questionHe: 'עם מי רון אוכל גלידה?',
            correct: 'With his cousins.',
            wrong: ['With his teacher.', 'With his grandpa.'],
          },
          {
            questionEn: 'Which season does Ron like more?',
            questionHe: 'איזו עונה רון אוהב יותר?',
            correct: 'The summer.',
            wrong: ['The winter.', 'The spring.'],
          },
        ],
      },
    ],
  },
};
