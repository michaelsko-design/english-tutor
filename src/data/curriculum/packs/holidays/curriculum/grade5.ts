import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * Holidays grade 5 units: autumn–winter and spring–summer holidays. Playable from the first day,
 * so they only use grade 4's grammar (can, there is / are, places, I like) and units 1–2 of
 * grade 5 (be, have / has, telling time), with new holiday words.
 */
const UNITS: ElementaryUnitSpec[] = [
  {
    ...packUnitNumbers('holidays', 0),
    titleEn: 'Autumn & Winter Holidays',
    titleHe: 'חגים בסתיו ובחורף',
    subtitleHe: 'ראש השנה, סוכות, חנוכה וחורף גשום: there is / there are, have / has ומילות מקום',
    badgeEmoji: '❄️',
    missions: [
      {
        icon: '🍎',
        titleEn: 'A Sweet New Year',
        titleHe: 'שנה טובה ומתוקה',
        storyHookHe: 'ראש השנה מגיע! עורכים שולחן חג ומספרים מה יש עליו עם There is ו-There are.',
        grammarTopic: 'There is / There are & Holiday Food',
        skills: ['Holiday Words', 'There is / There are', 'Voice Practice'],
        sentenceEn: 'There are apples and honey on the holiday table.',
        sentenceHe: 'יש תפוחים ודבש על שולחן החג.',
        vocab: [
          ['honey', 'noun', 'דבש', '🍯', 'We dip apples in honey.', 'אנחנו טובלים תפוחים בדבש.'],
          ['holiday', 'noun', 'חג', '🎊', 'Rosh Hashana is a happy holiday.', 'ראש השנה הוא חג שמח.'],
          ['sweet', 'adjective', 'מתוק', '🍭', 'The cake is very sweet.', 'העוגה מתוקה מאוד.'],
          ['wish', 'noun', 'משאלה / ברכה', '💫', 'My wish is a happy year for everyone.', 'המשאלה שלי היא שנה שמחה לכולם.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'bicycle', translationHe: 'אופניים' },
            { wordEn: 'window', translationHe: 'חלון' },
          ],
          shortSentenceEn: 'There is sweet honey.',
          shortSentenceHe: 'יש דבש מתוק.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'There are two apples on the plate.',
            wrong: ['There is two apples on the plate.', 'There are two apple on the plate.'],
            explainHe: 'two apples זה רבים, ולכן There are, ושם העצם מקבל s: apples.',
            hintHe: 'כמה תפוחים יש? בדקו אם צריך צורת יחיד או רבים, גם בפועל וגם בשם העצם.',
          },
          story: {
            passageEn:
              'It is Rosh Hashana. Grandma has a big table in her living room. There are apples, honey and a round challah on the table. We say a wish for a sweet new year. The family is happy together.',
            passageHe:
              'זה ראש השנה. לסבתא יש שולחן גדול בסלון שלה. על השולחן יש תפוחים, דבש וחלה עגולה. אנחנו אומרים ברכה לשנה טובה ומתוקה. המשפחה שמחה ביחד.',
            questionEn: 'Where is the big table?',
            questionHe: 'איפה השולחן הגדול?',
            correct: 'in her living room',
            wrong: ['in the kitchen', 'in the garden'],
          },
        },
      },
      {
        icon: '🌿',
        titleEn: 'Our Sukkah Is Ready',
        titleHe: 'הסוכה שלנו מוכנה',
        storyHookHe: 'בונים סוכה בחצר! נתאר מה נמצא בתוך הסוכה, עליה ולידה עם in, on, under ו-next to.',
        grammarTopic: 'Prepositions of Place in the Sukkah',
        skills: ['Sukkot Words', 'in / on / under / next to', 'Reading'],
        sentenceEn: 'Our sukkah is next to the house and the roof has green leaves.',
        sentenceHe: 'הסוכה שלנו ליד הבית ולגג יש עלים ירוקים.',
        vocab: [
          ['sukkah', 'noun', 'סוכה', '🏡', 'We eat dinner in the sukkah.', 'אנחנו אוכלים ארוחת ערב בסוכה.'],
          ['roof', 'noun', 'גג / סכך', '🍃', 'The sukkah has a roof of palm leaves.', 'לסוכה יש גג מעלי דקל.'],
          ['decoration', 'noun', 'קישוט', '🎀', 'This decoration is red and gold.', 'הקישוט הזה אדום וזהוב.'],
          ['outside', 'adverb', 'בחוץ', '🌳', 'We can sleep outside tonight.', 'אנחנו יכולים לישון בחוץ הלילה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'bathroom', translationHe: 'חדר אמבטיה' },
            { wordEn: 'computer', translationHe: 'מחשב' },
          ],
          shortSentenceEn: 'The sukkah is outside.',
          shortSentenceHe: 'הסוכה בחוץ.',
          rule: {
            questionEn: 'Complete: "The chairs are ____ the table." (מתחת ל-)',
            correct: 'under',
            wrong: ['on', 'next to'],
            explainHe: 'under אומר "מתחת ל-". on זה "על", ו-next to זה "ליד".',
            hintHe: 'קראו את המילה בעברית שבסוגריים. איזו מילת מקום מתאימה לה?',
          },
          story: {
            passageEn:
              'Every year we build a sukkah in our garden. It is next to the lemon tree. There are paper decorations on the walls. At night we eat dinner outside in the sukkah. I like the colorful lights.',
            passageHe:
              'בכל שנה אנחנו בונים סוכה בגינה שלנו. היא ליד עץ הלימון. על הקירות יש קישוטי נייר. בלילה אנחנו אוכלים ארוחת ערב בחוץ, בסוכה. אני אוהב/ת את האורות הצבעוניים.',
            questionEn: 'Where is the sukkah?',
            questionHe: 'איפה הסוכה?',
            correct: 'next to the lemon tree',
            wrong: ['on the roof', 'in the living room'],
          },
        },
      },
      {
        icon: '🕯️',
        isBoss: true,
        titleEn: 'Boss: Hanukkah Lights on a Rainy Night',
        titleHe: 'אתגר הבוס: אורות חנוכה בלילה גשום',
        storyHookHe: 'בחוץ קר וגשום, ובבית דולקים נרות חנוכה! הראו שאתם יודעים there is / there are, have / has ומילות מקום.',
        grammarTopic: 'Review: There is / are, Have / Has & Places',
        skills: ['Review', 'Hanukkah & Winter', 'Reading'],
        sentenceEn: 'In winter there is a lot of rain, so I have a warm coat.',
        sentenceHe: 'בחורף יש הרבה גשם, אז יש לי מעיל חם.',
        vocab: [
          ['candle', 'noun', 'נר', '🕯️', 'There is a tall candle in the window.', 'יש נר גבוה בחלון.'],
          ['winter', 'noun', 'חורף', '❄️', 'It is cold in winter.', 'קר בחורף.'],
          ['rain', 'noun', 'גשם', '🌧️', 'I like the sound of the rain.', 'אני אוהב/ת את הקול של הגשם.'],
          ['coat', 'noun', 'מעיל', '🧥', 'My coat has big pockets.', 'למעיל שלי יש כיסים גדולים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'sandals', translationHe: 'סנדלים' },
            { wordEn: 'sunglasses', translationHe: 'משקפי שמש' },
          ],
          shortSentenceEn: 'The candles are bright.',
          shortSentenceHe: 'הנרות בוהקים.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'My sister has a new coat.',
            wrong: ['My sister have a new coat.', 'My sister haves a new coat.'],
            explainHe: 'עם he / she / it משתמשים ב-has. my sister היא she, ולכן has. אין מילה haves.',
            hintHe: 'my sister היא she, כלומר יחיד. איזו צורה של הפועל מתאימה לה? שימו לב שיש צורה אחת שלא קיימת בכלל.',
          },
          story: {
            passageEn:
              'It is Hanukkah and it is cold outside. There is a lot of rain on the window. We are at home in the warm living room. There are eight candles on the table. Grandpa has a bag of chocolate coins for us.',
            passageHe:
              'זה חנוכה ובחוץ קר. יש הרבה גשם על החלון. אנחנו בבית, בסלון החמים. על השולחן יש שמונה נרות. לסבא יש בשבילנו שקית של מטבעות שוקולד.',
            questionEn: 'What does Grandpa have?',
            questionHe: 'מה יש לסבא?',
            correct: 'a bag of chocolate coins',
            wrong: ['a big umbrella', 'a new coat'],
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('holidays', 1),
    titleEn: 'Spring & Summer Celebrations',
    titleHe: 'חגים באביב ובקיץ',
    subtitleHe: 'ט״ו בשבט, פורים, פסח, יום העצמאות, שבועות והחופש הגדול: can, have / has ושעות',
    badgeEmoji: '🌸',
    missions: [
      {
        icon: '🎭',
        titleEn: 'Trees and Costumes',
        titleHe: 'עצים ותחפושות',
        storyHookHe: 'בט״ו בשבט נוטעים עצים ובפורים מתחפשים! נספר מה אפשר לעשות בחגים עם can ו-can’t.',
        grammarTopic: "Can / Can't & Holiday Fun",
        skills: ['Holiday Words', "can / can't", 'Voice Practice'],
        sentenceEn: 'On Tu BiShvat we plant a tree and eat dried fruit.',
        sentenceHe: 'בט״ו בשבט אנחנו נוטעים עץ ואוכלים פירות יבשים.',
        vocab: [
          ['plant', 'verb', 'לשתול / לנטוע', '🌱', 'We plant flowers in the school garden.', 'אנחנו שותלים פרחים בגינת בית הספר.'],
          ['fruit', 'noun', 'פרי / פירות', '🍇', 'I eat fruit every morning.', 'אני אוכל/ת פירות בכל בוקר.'],
          ['mask', 'noun', 'מסכה', '🎭', 'The mask has big blue eyes.', 'למסכה יש עיניים כחולות גדולות.'],
          ['queen', 'noun', 'מלכה', '👑', 'The queen has a gold crown.', 'למלכה יש כתר זהב.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'ruler', translationHe: 'סרגל' },
            { wordEn: 'pillow', translationHe: 'כרית' },
          ],
          shortSentenceEn: 'We can plant trees.',
          shortSentenceHe: 'אנחנו יכולים לנטוע עצים.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'I can wear a funny mask.',
            wrong: ['I can wears a funny mask.', 'I can to wear a funny mask.'],
            explainHe: 'אחרי can בא הפועל הבסיסי, בלי to ובלי s: can wear.',
            hintHe: 'אחרי can הפועל בא בצורה הבסיסית: בלי סיומת ובלי מילה נוספת לפניו.',
          },
          story: {
            passageEn:
              'In February we have Tu BiShvat. My class can plant three small trees next to the school. In March we have Purim. I am a queen with a gold mask. My friend Eden is a funny clown.',
            passageHe:
              'בפברואר יש לנו ט״ו בשבט. הכיתה שלי יכולה לנטוע שלושה עצים קטנים ליד בית הספר. במרץ יש לנו פורים. אני מלכה עם מסכה זהובה. החבר/ה שלי עדן ליצן מצחיק.',
            questionEn: 'Where can the class plant trees?',
            questionHe: 'איפה הכיתה יכולה לנטוע עצים?',
            correct: 'next to the school',
            wrong: ['in the sukkah', 'at the beach'],
          },
        },
      },
      {
        icon: '🍽️',
        titleEn: 'Passover: Spring Cleaning and the Seder',
        titleHe: 'פסח: ניקיון של אביב וליל הסדר',
        storyHookHe: 'האביב כאן ופסח מתקרב! מנקים את הבית ומתכוננים לליל הסדר. נשאל What time ונספר מה יש על השולחן.',
        grammarTopic: 'What Time? & There is / There are',
        skills: ['Passover Words', 'Telling Time', 'Reading'],
        sentenceEn: "At seven o'clock we sit at the Seder table with matzah.",
        sentenceHe: 'בשעה שבע אנחנו יושבים ליד שולחן הסדר עם מצות.',
        vocab: [
          ['matzah', 'noun', 'מצה', '🍞', 'We eat matzah on Passover.', 'אנחנו אוכלים מצה בפסח.'],
          ['spring', 'noun', 'אביב', '🌷', 'There are many flowers in spring.', 'יש הרבה פרחים באביב.'],
          ['clean', 'verb', 'לנקות', '🧹', 'We clean the house before the holiday.', 'אנחנו מנקים את הבית לפני החג.'],
          ['cup', 'noun', 'כוס', '☕', 'There is a cup of grape juice for everyone.', 'יש כוס מיץ ענבים לכל אחד.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'helmet', translationHe: 'קסדה' },
            { wordEn: 'bridge', translationHe: 'גשר' },
          ],
          shortSentenceEn: 'We clean the kitchen.',
          shortSentenceHe: 'אנחנו מנקים את המטבח.',
          rule: {
            questionEn: 'Which question is correct?',
            correct: 'What time is the Seder?',
            wrong: ['What time the Seder is?', 'What time are the Seder?'],
            explainHe: 'בשאלה באנגלית is בא לפני הנושא: What time is the Seder? ו-the Seder הוא יחיד, ולכן is.',
            hintHe: 'בשאלה הפועל be בא לפני הנושא. the Seder הוא דבר אחד.',
          },
          story: {
            passageEn:
              'It is spring and Passover is here. In the morning we clean the house. At half past seven we sit at the Seder table. There are four cups of grape juice for every child. I can read the four questions in Hebrew.',
            passageHe:
              'זה אביב ופסח כאן. בבוקר אנחנו מנקים את הבית. בשבע וחצי אנחנו יושבים ליד שולחן הסדר. יש ארבע כוסות מיץ ענבים לכל ילד. אני יכול/ה לקרוא את ארבע הקושיות בעברית.',
            questionEn: 'What time do they sit at the Seder table?',
            questionHe: 'באיזו שעה הם יושבים ליד שולחן הסדר?',
            correct: 'at half past seven',
            wrong: ["at seven o'clock", 'in the morning'],
          },
        },
      },
      {
        icon: '🎆',
        isBoss: true,
        titleEn: 'Boss: Flags, Flowers and Summer Fun',
        titleHe: 'אתגר הבוס: דגלים, פרחים וכיף של קיץ',
        storyHookHe: 'יום העצמאות, שבועות ואז החופש הגדול! הראו שאתם יודעים לספר על החגים עם can, have / has ו-there is / there are.',
        grammarTopic: 'Review: Can, Have / Has & There is / There are',
        skills: ['Review', 'Holidays & Summer', 'Reading'],
        sentenceEn: 'On Independence Day there are blue and white flags on every street.',
        sentenceHe: 'ביום העצמאות יש דגלים כחולים ולבנים בכל רחוב.',
        vocab: [
          ['flag', 'noun', 'דגל', '🇮🇱', 'The flag of Israel is blue and white.', 'הדגל של ישראל כחול ולבן.'],
          ['flower', 'noun', 'פרח', '🌺', 'This flower is pink and yellow.', 'הפרח הזה ורוד וצהוב.'],
          ['basket', 'noun', 'סל', '🧺', 'The basket is full of grapes.', 'הסל מלא בענבים.'],
          ['vacation', 'noun', 'חופשה / חופש', '🏖️', 'We have a long vacation in summer.', 'יש לנו חופש ארוך בקיץ.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'jacket', translationHe: 'ז׳קט' },
            { wordEn: 'boots', translationHe: 'מגפיים' },
          ],
          shortSentenceEn: 'I have a small flag.',
          shortSentenceHe: 'יש לי דגל קטן.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'The children have flowers for Shavuot.',
            wrong: ['The children has flowers for Shavuot.', 'The children haves flowers for Shavuot.'],
            explainHe: 'children הם רבים (they), ולכן have. has בא רק עם he / she / it.',
            hintHe: 'the children הם רבים (they). איזו צורה של הפועל מתאימה לרבים?',
          },
          story: {
            passageEn:
              'Summer is almost here. On Independence Day there are flags on every balcony. On Shavuot the children have white clothes and baskets of fruit. Then we have the big summer vacation. We can swim at the beach every day.',
            passageHe:
              'הקיץ כמעט כאן. ביום העצמאות יש דגלים בכל מרפסת. בשבועות לילדים יש בגדים לבנים וסלים של פירות. אחר כך יש לנו את החופש הגדול של הקיץ. אנחנו יכולים לשחות בים כל יום.',
            questionEn: 'What do the children have on Shavuot?',
            questionHe: 'מה יש לילדים בשבועות?',
            correct: 'white clothes and baskets of fruit',
            wrong: ['blue flags', 'warm coats'],
          },
        },
      },
    ],
  },
];

export const HOLIDAYS_GRADE_5_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-5', UNITS);
