import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * Holidays grade 6 units: autumn–winter and spring–summer holidays. Playable from the first day,
 * so they use grade 5's grammar and units 1–2 of grade 6 only (Present Simple, do / does
 * questions, Present Progressive), no past tense, with new holiday words.
 */
const UNITS: ElementaryUnitSpec[] = [
  {
    ...packUnitNumbers('holidays', 0),
    titleEn: 'Autumn & Winter Holidays',
    titleHe: 'חגים בסתיו ובחורף',
    subtitleHe: 'ראש השנה, סוכות, חנוכה וחורף: Present Simple למנהגים ו-Present Progressive למה שקורה עכשיו',
    badgeEmoji: '🕯️',
    missions: [
      {
        icon: '🍎',
        titleEn: 'New Year Traditions',
        titleHe: 'המנהגים של ראש השנה',
        storyHookHe: 'ראש השנה הגיע! נספר מה המשפחה עושה בכל שנה עם Present Simple ומילים כמו every year.',
        grammarTopic: 'Present Simple for Traditions (every year)',
        skills: ['Holiday Words', 'Present Simple', 'Voice Practice'],
        sentenceEn: 'Every year my relatives eat apples with honey for a sweet new year.',
        sentenceHe: 'בכל שנה הקרובים שלי אוכלים תפוחים בדבש לשנה טובה ומתוקה.',
        vocab: [
          ['tradition', 'noun', 'מנהג / מסורת', '📜', 'We have a fun tradition on Rosh Hashana.', 'יש לנו מנהג כיפי בראש השנה.'],
          ['apple', 'noun', 'תפוח', '🍎', 'This apple is red and sweet.', 'התפוח הזה אדום ומתוק.'],
          ['honey', 'noun', 'דבש', '🍯', 'Bees make honey.', 'דבורים מכינות דבש.'],
          ['relatives', 'noun', 'קרובי משפחה', '👪', 'All our relatives come for the holiday dinner.', 'כל קרובי המשפחה שלנו באים לארוחת החג.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'helmet', translationHe: 'קסדה' },
            { wordEn: 'printer', translationHe: 'מדפסת' },
          ],
          shortSentenceEn: 'Grandma always makes honey cake.',
          shortSentenceHe: 'סבתא תמיד מכינה עוגת דבש.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'Every year my grandma bakes a honey cake.',
            wrong: ['Every year my grandma bake a honey cake.', 'Every year my grandma is bake a honey cake.'],
            explainHe: 'מנהג של כל שנה הוא Present Simple, ועם she מוסיפים s לפועל: bakes.',
            hintHe: 'my grandma היא she, וזה הרגל של כל שנה. מה קורה לפועל עם she ב-Present Simple?',
          },
          story: {
            passageEn:
              "Every Rosh Hashana, Yael's family goes to her grandparents in Jerusalem. Her grandma always makes a big dinner. The children dip apples in honey. Her uncle blows the shofar in the morning. It is Yael's favorite holiday tradition.",
            passageHe:
              'בכל ראש השנה המשפחה של יעל נוסעת לסבא ולסבתא שלה בירושלים. סבתא שלה תמיד מכינה ארוחת ערב גדולה. הילדים טובלים תפוחים בדבש. הדוד שלה תוקע בשופר בבוקר. זה המנהג האהוב על יעל בחג.',
            questionEn: "Where do Yael's grandparents live?",
            questionHe: 'איפה גרים הסבא והסבתא של יעל?',
            correct: 'in Jerusalem',
            wrong: ['in Haifa', 'in Eilat'],
          },
        },
      },
      {
        icon: '🌿',
        titleEn: 'Building the Sukkah Right Now',
        titleHe: 'בונים סוכה עכשיו',
        storyHookHe: 'כל המשפחה בחצר! נספר מה כל אחד עושה ממש עכשיו עם am / is / are ו-ing.',
        grammarTopic: 'Present Progressive: What Are You Doing Now?',
        skills: ['Sukkot Words', 'Present Progressive', 'Reading'],
        sentenceEn: 'Right now Dad is building the sukkah and we are decorating it.',
        sentenceHe: 'ממש עכשיו אבא בונה את הסוכה ואנחנו מקשטים אותה.',
        vocab: [
          ['decorate', 'verb', 'לקשט', '🎀', 'We decorate the classroom for the holiday.', 'אנחנו מקשטים את הכיתה לחג.'],
          ['build', 'verb', 'לבנות', '🛠️', 'Birds build nests in spring.', 'ציפורים בונות קנים באביב.'],
          ['paper chain', 'noun', 'שרשרת נייר', '🔗', 'My sister makes a long paper chain.', 'אחותי מכינה שרשרת נייר ארוכה.'],
          ['roof', 'noun', 'גג / סכך', '🍃', 'The sukkah roof has palm leaves.', 'לגג של הסוכה יש עלי דקל.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'sink', translationHe: 'כיור' },
            { wordEn: 'pillow', translationHe: 'כרית' },
          ],
          shortSentenceEn: 'We are decorating the sukkah.',
          shortSentenceHe: 'אנחנו מקשטים את הסוכה.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'Look! Grandpa is putting leaves on the roof.',
            wrong: ['Look! Grandpa putting leaves on the roof.', 'Look! Grandpa are putting leaves on the roof.'],
            explainHe: 'Present Progressive צריך am / is / are ופועל עם ing. Grandpa הוא he, ולכן is putting.',
            hintHe: 'Look! מראה שזה קורה עכשיו. חסר משהו לפני הפועל עם ing? בדקו איזו צורה של be מתאימה ל-Grandpa.',
          },
          story: {
            passageEn:
              'It is the day before Sukkot. Noam and his sister are in the garden. Noam is building the sukkah walls with his dad. His sister is making a long paper chain. Their mom is cooking dinner in the kitchen.',
            passageHe:
              'זה היום שלפני סוכות. נועם ואחותו בגינה. נועם בונה את קירות הסוכה עם אבא שלו. אחותו מכינה שרשרת נייר ארוכה. אמא שלהם מבשלת ארוחת ערב במטבח.',
            questionEn: "What is Noam's sister making?",
            questionHe: 'מה אחותו של נועם מכינה?',
            correct: 'a long paper chain',
            wrong: ['dinner', 'the walls'],
          },
        },
      },
      {
        icon: '🕯️',
        isBoss: true,
        titleEn: 'Boss: Hanukkah on a Rainy Night',
        titleHe: 'אתגר הבוס: חנוכה בלילה גשום',
        storyHookHe: 'בחוץ יורד גשם ובפנים דולקים נרות! הראו שאתם יודעים מתי Present Simple ומתי Present Progressive.',
        grammarTopic: 'Review: Present Simple vs. Present Progressive',
        skills: ['Review', 'Hanukkah & Winter', 'Reading'],
        sentenceEn: 'Every night we light a candle, and tonight it is raining outside.',
        sentenceHe: 'בכל לילה אנחנו מדליקים נר, והלילה יורד גשם בחוץ.',
        vocab: [
          ['candle', 'noun', 'נר', '🕯️', 'The candle burns for half an hour.', 'הנר דולק חצי שעה.'],
          ['light', 'verb', 'להדליק', '💡', 'We light the candles after sunset.', 'אנחנו מדליקים את הנרות אחרי השקיעה.'],
          ['raincoat', 'noun', 'מעיל גשם', '🧥', 'My raincoat is yellow and long.', 'מעיל הגשם שלי צהוב וארוך.'],
          ['cloudy', 'adjective', 'מעונן', '☁️', 'The sky is cloudy today.', 'השמיים מעוננים היום.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'swimsuit', translationHe: 'בגד ים' },
            { wordEn: 'sandals', translationHe: 'סנדלים' },
          ],
          shortSentenceEn: 'It is raining now.',
          shortSentenceHe: 'עכשיו יורד גשם.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'Every night we light a candle.',
            wrong: ['Every night we are lighting a candle.', 'Every night we lights a candle.'],
            explainHe: 'Every night הוא הרגל, ולכן Present Simple. עם we הפועל בלי s.',
            hintHe: 'Every night מראה הרגל, לא משהו שקורה עכשיו. ובדקו את צורת הפועל עם we.',
          },
          story: {
            passageEn:
              "It is the fifth night of Hanukkah. Outside it is cloudy and cold. Ella is wearing her new raincoat. Now she is walking to her cousin's house. Every year the cousins light the candles together and eat doughnuts.",
            passageHe:
              'זה הלילה החמישי של חנוכה. בחוץ מעונן וקר. אלה לובשת את מעיל הגשם החדש שלה. עכשיו היא הולכת לבית של בת הדודה שלה. בכל שנה בני הדודים מדליקים יחד את הנרות ואוכלים סופגניות.',
            questionEn: 'What is Ella wearing?',
            questionHe: 'מה אלה לובשת?',
            correct: 'her new raincoat',
            wrong: ['a warm scarf', 'a costume'],
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('holidays', 1),
    titleEn: 'Spring & Summer Celebrations',
    titleHe: 'חגים באביב ובקיץ',
    subtitleHe: 'ט״ו בשבט, פורים, פסח, יום העצמאות, שבועות והחופש הגדול: שאלות do / does ומה קורה עכשיו',
    badgeEmoji: '🌸',
    missions: [
      {
        icon: '🌱',
        titleEn: 'Trees, Masks and Gifts',
        titleHe: 'עצים, מסכות ומתנות',
        storyHookHe: 'בט״ו בשבט נוטעים ובפורים שולחים משלוחי מנות! נשאל שאלות על החגים עם Do ו-Does.',
        grammarTopic: 'Do / Does Questions about Holidays',
        skills: ['Holiday Words', 'Do / Does', 'Voice Practice'],
        sentenceEn: 'Does your class plant a tree on Tu BiShvat?',
        sentenceHe: 'הכיתה שלכם נוטעת עץ בט״ו בשבט?',
        vocab: [
          ['plant', 'verb', 'לשתול / לנטוע', '🌱', 'Farmers plant seeds in the field.', 'חקלאים שותלים זרעים בשדה.'],
          ['dried fruit', 'noun', 'פירות יבשים', '🍇', 'Dried fruit is a sweet snack.', 'פירות יבשים הם חטיף מתוק.'],
          ['mask', 'noun', 'מסכה', '🎭', 'The silver mask covers my eyes.', 'המסכה הכסופה מכסה לי את העיניים.'],
          ['gift', 'noun', 'מתנה', '🎁', 'We send a gift to our neighbors on Purim.', 'אנחנו שולחים מתנה לשכנים בפורים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'stapler', translationHe: 'שדכן' },
            { wordEn: 'pillow', translationHe: 'כרית' },
          ],
          shortSentenceEn: 'Do you plant trees?',
          shortSentenceHe: 'אתם נוטעים עצים?',
          rule: {
            questionEn: 'Which question is correct?',
            correct: 'Does your brother wear a mask on Purim?',
            wrong: ['Do your brother wear a mask on Purim?', 'Does your brother wears a mask on Purim?'],
            explainHe: 'עם he / she / it שואלים עם Does, והפועל שאחריו בא בלי s.',
            hintHe: 'your brother הוא he. איזו מילת שאלה מתאימה ל-he, ובאיזו צורה בא הפועל אחריה?',
          },
          story: {
            passageEn:
              "Every year Itay's class goes to a park on Tu BiShvat. The children plant small trees and eat dried fruit. On Purim, Itay sends a gift basket to his best friend. This year he wants a pirate costume. His sister wants a cat mask.",
            passageHe:
              'בכל שנה הכיתה של איתי הולכת לפארק בט״ו בשבט. הילדים נוטעים עצים קטנים ואוכלים פירות יבשים. בפורים איתי שולח סל מתנה לחבר הכי טוב שלו. השנה הוא רוצה תחפושת של פיראט. אחותו רוצה מסכה של חתול.',
            questionEn: 'What does Itay send on Purim?',
            questionHe: 'מה איתי שולח בפורים?',
            correct: 'a gift basket',
            wrong: ['a pirate costume', 'dried fruit'],
          },
        },
      },
      {
        icon: '🧹',
        titleEn: 'Passover Is Coming',
        titleHe: 'פסח מתקרב',
        storyHookHe: 'האביב הגיע וכולם מנקים! נספר מה קורה עכשיו בבית ומה עושים בכל ליל סדר.',
        grammarTopic: 'Present Progressive vs. Present Simple at Passover',
        skills: ['Passover Words', 'Now vs. Every Year', 'Reading'],
        sentenceEn: 'This week we are cleaning the house for the Seder.',
        sentenceHe: 'השבוע אנחנו מנקים את הבית לקראת ליל הסדר.',
        vocab: [
          ['clean', 'verb', 'לנקות', '🧹', 'I clean my room every Friday.', 'אני מנקה את החדר שלי בכל יום שישי.'],
          ['matzah', 'noun', 'מצה', '🍞', 'Matzah is flat and dry.', 'מצה היא שטוחה ויבשה.'],
          ['seder', 'noun', 'ליל הסדר', '🍽️', 'The seder starts at night.', 'ליל הסדר מתחיל בלילה.'],
          ['spring', 'noun', 'אביב', '🌷', 'The weather in spring is nice.', 'מזג האוויר באביב נעים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'snowman', translationHe: 'איש שלג' },
            { wordEn: 'scarf', translationHe: 'צעיף' },
          ],
          shortSentenceEn: 'Mom is cleaning the kitchen.',
          shortSentenceHe: 'אמא מנקה את המטבח.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'Right now my brothers are cleaning their room.',
            wrong: ['Right now my brothers clean their room.', 'Right now my brothers is cleaning their room.'],
            explainHe: 'Right now = עכשיו, ולכן Present Progressive. my brothers הם רבים, ולכן are cleaning.',
            hintHe: 'Right now אומר שזה קורה עכשיו. my brothers הם רבים: בדקו איזו צורה של be מתאימה.',
          },
          story: {
            passageEn:
              'It is a week before Passover. The whole family is busy. Dad is cleaning the car. Mira is washing the windows. Every year Grandma makes the Seder in her big house, and she always buys a lot of matzah.',
            passageHe:
              'נשאר שבוע עד פסח. כל המשפחה עסוקה. אבא מנקה את האוטו. מירה שוטפת את החלונות. בכל שנה סבתא עורכת את הסדר בבית הגדול שלה, והיא תמיד קונה הרבה מצות.',
            questionEn: 'What is Mira washing?',
            questionHe: 'מה מירה שוטפת?',
            correct: 'the windows',
            wrong: ['the car', 'the kitchen floor'],
          },
        },
      },
      {
        icon: '🎆',
        isBoss: true,
        titleEn: 'Boss: From Independence Day to Summer',
        titleHe: 'אתגר הבוס: מיום העצמאות ועד החופש',
        storyHookHe: 'דגלים, ביכורים ואז החופש הגדול! הראו שאתם יודעים לשאול עם do / does ולספר מה קורה עכשיו.',
        grammarTopic: 'Review: Do / Does Questions & Present Progressive',
        skills: ['Review', 'Holidays & Summer', 'Reading'],
        sentenceEn: 'On Independence Day many families have a barbecue in the park.',
        sentenceHe: 'ביום העצמאות הרבה משפחות עושות מנגל בפארק.',
        vocab: [
          ['flag', 'noun', 'דגל', '🇮🇱', 'A big flag hangs on our balcony.', 'דגל גדול תלוי במרפסת שלנו.'],
          ['barbecue', 'noun', 'מנגל / ברביקיו', '🔥', 'Dad cooks meat on the barbecue.', 'אבא צולה בשר על המנגל.'],
          ['summer', 'noun', 'קיץ', '☀️', 'Summer in Israel is very hot.', 'הקיץ בישראל חם מאוד.'],
          ['vacation', 'noun', 'חופשה / חופש', '🌴', 'Where do you go on vacation?', 'לאן אתם נוסעים בחופשה?'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'gloves', translationHe: 'כפפות' },
            { wordEn: 'heater', translationHe: 'תנור חימום' },
          ],
          shortSentenceEn: 'Do you like summer?',
          shortSentenceHe: 'אתם אוהבים את הקיץ?',
          rule: {
            questionEn: 'Which question is correct?',
            correct: 'Are you watching the fireworks now?',
            wrong: ['Do you watching the fireworks now?', 'Are you watch the fireworks now?'],
            explainHe: 'שאלה על משהו שקורה עכשיו: Are you ופועל עם ing. Do בא עם פועל בסיסי בלי ing.',
            hintHe: 'now אומר שזה קורה עכשיו. איזו מילה פותחת שאלה כזאת, ובאיזו צורה בא הפועל?',
          },
          story: {
            passageEn:
              "Today is Independence Day. Gili and her parents are at the park. Her dad is making a barbecue, and her mom is hanging a flag on a tree. Gili is playing with her friends. On Shavuot she wears white, and then the summer vacation starts!",
            passageHe:
              'היום יום העצמאות. גילי וההורים שלה בפארק. אבא שלה עושה מנגל, ואמא שלה תולה דגל על עץ. גילי משחקת עם החברים שלה. בשבועות היא לובשת לבן, ואז מתחיל החופש הגדול!',
            questionEn: "Where is Gili's family today?",
            questionHe: 'איפה המשפחה של גילי היום?',
            correct: 'at the park',
            wrong: ['at the beach', 'at home'],
          },
        },
      },
    ],
  },
];

export const HOLIDAYS_GRADE_6_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-6', UNITS);
