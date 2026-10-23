import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * Grade 4, Holidays & Seasons pack: open from the first day, so it only uses grade 3's grammar
 * (plural s, colours, am / is / are, It is + weather, a / an, I can, I like) and grade 4's
 * units 1–2 (can / can't and questions, There is / There are, in / on / under) with new holiday words.
 * Hebrew copy is gender-neutral (slash forms such as "אוכל/ת" and plural imperatives).
 */
const UNITS: ElementaryUnitSpec[] = [
  {
    ...packUnitNumbers('holidays', 0),
    titleEn: 'Autumn & Winter Holidays',
    titleHe: 'חגי הסתיו והחורף',
    subtitleHe: 'ראש השנה, סוכות וחנוכה: מילים חדשות (honey, roof, candle) עם There is / There are ו-can',
    badgeEmoji: '🕯️',
    missions: [
      {
        icon: '🍎',
        titleEn: 'A Sweet New Year Table',
        titleHe: 'שולחן לשנה טובה ומתוקה',
        storyHookHe: 'עורכים את שולחן החג של ראש השנה! מה יש על השולחן? בואו נספר באנגלית.',
        grammarTopic: 'Rosh Hashana Words & "There is / There are"',
        skills: ['Holiday Words', 'There is / There are', 'Speaking Aloud'],
        sentenceEn: 'There is honey on the table and there are two cards.',
        sentenceHe: 'יש דבש על השולחן ויש שני כרטיסי ברכה.',
        vocab: [
          ['honey', 'noun', 'דבש', '🍯', 'We dip apples in honey.', 'אנחנו טובלים תפוחים בדבש.'],
          ['sweet', 'adjective', 'מתוק / מתוקה', '🍬', 'We wish you a sweet new year!', 'אנחנו מאחלים לכם שנה מתוקה!'],
          ['card', 'noun', 'כרטיס ברכה', '💌', 'I write a card to my grandpa.', 'אני כותב/ת כרטיס ברכה לסבא שלי.'],
          ['table', 'noun', 'שולחן', '🍽️', 'The holiday table is long.', 'שולחן החג ארוך.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'basketball', translationHe: 'כדורסל' },
            { wordEn: 'mirror', translationHe: 'מראה' },
          ],
          shortSentenceEn: 'There is honey here.',
          shortSentenceHe: 'יש כאן דבש.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'There are three cards on the table.',
            wrong: ['There is three cards on the table.', 'There are three card on the table.'],
            explainHe: 'כשיש יותר מדבר אחד אומרים There are, והמילה מקבלת s: three cards.',
            hintHe: 'כמה כרטיסים יש? בחרו את הצורה של "יש" שמתאימה להרבה, ובדקו את סוף המילה.',
          },
          story: {
            passageEn:
              'It is Rosh Hashana. There is a big table in the living room. There are apples and honey on it. Grandma gives me a card. It says, "Have a sweet year!"',
            passageHe: 'ראש השנה. יש שולחן גדול בסלון. יש עליו תפוחים ודבש. סבתא נותנת לי כרטיס ברכה. כתוב בו: "שתהיה לך שנה מתוקה!"',
            questionEn: 'Where is the big table?',
            questionHe: 'איפה השולחן הגדול?',
            correct: 'in the living room',
            wrong: ['in the garden', 'in the bedroom'],
          },
        },
      },
      {
        icon: '🌴',
        titleEn: 'In the Sukkah, On the Roof',
        titleHe: 'בתוך הסוכה, על הגג',
        storyHookHe: 'בונים סוכה! תולים קישוטים, שמים ענפים על הגג ומחפשים את האתרוג. איפה כל דבר?',
        grammarTopic: 'Sukkot Words & in / on / under',
        skills: ['Holiday Words', 'Prepositions', 'Listening'],
        sentenceEn: 'There are green branches on the roof of the sukkah.',
        sentenceHe: 'יש ענפים ירוקים על הגג של הסוכה.',
        vocab: [
          ['sukkah', 'noun', 'סוכה', '🌴', 'Our sukkah is in the yard.', 'הסוכה שלנו בחצר.'],
          ['roof', 'noun', 'גג', '🏡', 'There is a cat on the roof.', 'יש חתול על הגג.'],
          ['decoration', 'noun', 'קישוט', '🎊', 'I hang a decoration in the sukkah.', 'אני תולה קישוט בסוכה.'],
          ['lemon', 'noun', 'לימון', '🍋', 'The etrog looks like a big lemon.', 'האתרוג נראה כמו לימון גדול.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'football', translationHe: 'כדורגל' },
            { wordEn: 'carpet', translationHe: 'שטיח' },
          ],
          shortSentenceEn: 'The sukkah has a roof.',
          shortSentenceHe: 'לסוכה יש גג.',
          rule: {
            questionEn: 'The box is below the table. Which sentence is correct?',
            correct: 'The box is under the table.',
            wrong: ['The box is on the table.', 'The box is in under the table.'],
            explainHe: 'מתחת לשולחן אומרים under the table.',
            hintHe: 'הקופסה למטה, מתחת לשולחן. איזו מילת מקום אומרת "מתחת"?',
          },
          story: {
            passageEn:
              'We build a sukkah in the yard. My brother puts branches on the roof. I hang paper decorations. Dad puts a chair in the sukkah. The cat sleeps under the chair.',
            passageHe: 'אנחנו בונים סוכה בחצר. אח שלי שם ענפים על הגג. אני תולה קישוטי נייר. אבא שם כיסא בסוכה. החתול ישן מתחת לכיסא.',
            questionEn: 'Where does the cat sleep?',
            questionHe: 'איפה החתול ישן?',
            correct: 'under the chair',
            wrong: ['on the roof', 'in the kitchen'],
          },
        },
      },
      {
        icon: '🍩',
        isBoss: true,
        titleEn: 'Boss: Hanukkah in the Rain',
        titleHe: 'אתגר הבוס: חנוכה בגשם',
        storyHookHe: 'בחוץ יורד גשם של חורף, ובבית מדליקים נרות! עברו על כל חגי הסתיו והחורף והראו מה למדתם.',
        grammarTopic: 'Hanukkah & Winter, can / There are & Review',
        skills: ['Holiday Words', 'can / There are', 'Review'],
        sentenceEn: 'There are eight candles, and we can eat a doughnut.',
        sentenceHe: 'יש שמונה נרות, ואנחנו יכולים לאכול סופגנייה.',
        vocab: [
          ['candle', 'noun', 'נר', '🕯️', 'We light one more candle every night.', 'אנחנו מדליקים עוד נר כל לילה.'],
          ['doughnut', 'noun', 'סופגנייה', '🍩', 'This doughnut has jam inside.', 'בסופגנייה הזאת יש ריבה.'],
          ['winter', 'noun', 'חורף', '❄️', 'In winter, I wear warm socks.', 'בחורף אני גורב/ת גרביים חמות.'],
          ['rain', 'noun', 'גשם', '🌧️', 'The rain is good for the trees.', 'הגשם טוב לעצים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'bathroom', translationHe: 'חדר אמבטיה' },
            { wordEn: 'team', translationHe: 'קבוצה' },
          ],
          shortSentenceEn: 'We can light the candles.',
          shortSentenceHe: 'אנחנו יכולים להדליק את הנרות.',
          rule: {
            questionEn: 'Which question is correct?',
            correct: 'Can you light the candle?',
            wrong: ['Do you can light the candle?', 'Can you lights the candle?'],
            explainHe: 'שאלה עם can מתחילה ב-Can, ואחרי הנושא בא הפועל בלי s: Can you light...?',
            hintHe: 'שאלה של יכולת מתחילה במילת היכולת עצמה (בלי do), והפועל נשאר בצורה הבסיסית.',
          },
          story: {
            passageEn:
              'It is a cold winter night. There is rain on the windows. Inside, there are candles in the window. My little sister can sing a Hanukkah song. We eat doughnuts and play with a spinning top.',
            passageHe:
              'לילה קר של חורף. יש גשם על החלונות. בפנים יש נרות בחלון. אחותי הקטנה יודעת לשיר שיר חנוכה. אנחנו אוכלים סופגניות ומשחקים בסביבון.',
            questionEn: 'What can my little sister do?',
            questionHe: 'מה אחותי הקטנה יודעת לעשות?',
            correct: 'sing a Hanukkah song',
            wrong: ['light the candles', 'make doughnuts'],
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('holidays', 1),
    titleEn: 'Spring & Summer Holidays',
    titleHe: 'חגי האביב והקיץ',
    subtitleHe: 'ט"ו בשבט, פורים, פסח, יום העצמאות ושבועות: מילים חדשות (seed, picnic, wheat) עם can ו-There is',
    badgeEmoji: '🌷',
    missions: [
      {
        icon: '🌳',
        titleEn: 'Seeds, Trees and Crowns',
        titleHe: 'זרעים, עצים וכתרים',
        storyHookHe: 'בט"ו בשבט שותלים, ובפורים מתחפשים! מה אתם יכולים לעשות בחגים האלה?',
        grammarTopic: 'Tu BiShvat & Purim Words, "can" & colours',
        skills: ['Holiday Words', 'can', 'Colours'],
        sentenceEn: 'I can plant a seed, and I can make a gold crown.',
        sentenceHe: 'אני יכול/ה לשתול זרע, ואני יכול/ה להכין כתר זהב.',
        vocab: [
          ['seed', 'noun', 'זרע', '🌱', 'A tiny seed can grow into a big tree.', 'זרע קטנטן יכול לגדול לעץ גדול.'],
          ['tree', 'noun', 'עץ', '🌳', 'Birds live in that tree.', 'ציפורים גרות בעץ ההוא.'],
          ['costume', 'noun', 'תחפושת', '🎭', 'My costume has a long tail.', 'לתחפושת שלי יש זנב ארוך.'],
          ['crown', 'noun', 'כתר', '👑', 'Queen Esther has a crown.', 'למלכה אסתר יש כתר.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'sofa', translationHe: 'ספה' },
            { wordEn: 'cheese', translationHe: 'גבינה' },
          ],
          shortSentenceEn: 'I can plant a tree.',
          shortSentenceHe: 'אני יכול/ה לשתול עץ.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: "He can't find his costume.",
            wrong: ["He can't finds his costume.", "He don't can find his costume."],
            explainHe: "אחרי can't בא הפועל בצורה הבסיסית, בלי s: can't find.",
            hintHe: 'אחרי מילת היכולת השלילית הפועל לא משתנה, ולא מוסיפים לפניה עוד מילה.',
          },
          story: {
            passageEn:
              'On Tu BiShvat, our class goes to the park. There are small holes in the ground. Each child can plant a seed. Then on Purim, I am a tree! My costume is green and brown.',
            passageHe: 'בט"ו בשבט הכיתה שלנו הולכת לפארק. יש גומות קטנות באדמה. כל ילד יכול לשתול זרע. ואז בפורים אני עץ! התחפושת שלי ירוקה וחומה.',
            questionEn: 'What is my Purim costume?',
            questionHe: 'מה התחפושת שלי בפורים?',
            correct: 'a tree',
            wrong: ['a king', 'a cat'],
          },
        },
      },
      {
        icon: '🎆',
        titleEn: 'Picnic, Flags and Fireworks',
        titleHe: 'פיקניק, דגלים וזיקוקים',
        storyHookHe: 'האביב פורח! בפסח יוצאים לטבע, וביום העצמאות עושים פיקניק ומסתכלים על זיקוקים.',
        grammarTopic: 'Passover & Independence Day Words, "There is / There are"',
        skills: ['Holiday Words', 'There is / There are', 'Reading'],
        sentenceEn: 'There are many flags in the park, and there is a big picnic.',
        sentenceHe: 'יש הרבה דגלים בפארק, ויש פיקניק גדול.',
        vocab: [
          ['picnic', 'noun', 'פיקניק', '🧺', 'We have a picnic on the grass.', 'אנחנו עושים פיקניק על הדשא.'],
          ['spring', 'noun', 'אביב', '🌷', 'There are new flowers in spring.', 'באביב יש פרחים חדשים.'],
          ['flag', 'noun', 'דגל', '🇮🇱', 'The flag has a blue star.', 'בדגל יש מגן דוד כחול.'],
          ['fireworks', 'noun', 'זיקוקים', '🎆', 'We watch the fireworks at night.', 'אנחנו צופים בזיקוקים בלילה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'lamp', translationHe: 'מנורה' },
            { wordEn: 'winner', translationHe: 'מנצח / מנצחת' },
          ],
          shortSentenceEn: 'There is a picnic today.',
          shortSentenceHe: 'יש פיקניק היום.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'There is a flag on our balcony.',
            wrong: ['There are a flag on our balcony.', 'It is a flag on our balcony.'],
            explainHe: 'על דבר אחד אומרים There is: There is a flag (יש דגל).',
            hintHe: 'כמה דגלים יש? בחרו את הצורה של "יש" שמתאימה לדבר אחד.',
          },
          story: {
            passageEn:
              'It is Independence Day. We go to the park with our neighbors. There are blue and white flags on the trees. Mom makes a picnic with salad and hot dogs. At night, there are fireworks.',
            passageHe:
              'יום העצמאות. אנחנו הולכים לפארק עם השכנים. יש דגלים כחולים ולבנים על העצים. אמא מכינה פיקניק עם סלט ונקניקיות. בלילה יש זיקוקים.',
            questionEn: 'Who do we go to the park with?',
            questionHe: 'עם מי אנחנו הולכים לפארק?',
            correct: 'our neighbors',
            wrong: ['our teacher', 'the team'],
          },
        },
      },
      {
        icon: '🏖️',
        isBoss: true,
        titleEn: 'Boss: Wheat, Pools and Summer Fun',
        titleHe: 'אתגר הבוס: חיטה, בריכה וכיף של קיץ',
        storyHookHe: 'בשבועות חוגגים את החיטה, ואחר כך מתחיל החופש הגדול! עברו על כל חגי האביב והקיץ.',
        grammarTopic: 'Shavuot & Summer, can / There is & Review',
        skills: ['Holiday Words', 'can / There is', 'Review'],
        sentenceEn: 'In summer vacation, we can swim in the pool every day.',
        sentenceHe: 'בחופש הגדול אנחנו יכולים לשחות בבריכה כל יום.',
        vocab: [
          ['vacation', 'noun', 'חופשה / חופש', '🧳', 'Our vacation starts in July.', 'החופש שלנו מתחיל ביולי.'],
          ['summer', 'noun', 'קיץ', '🏖️', 'The days are long in summer.', 'הימים ארוכים בקיץ.'],
          ['wheat', 'noun', 'חיטה', '🌾', 'Farmers grow wheat in the field.', 'חקלאים מגדלים חיטה בשדה.'],
          ['pool', 'noun', 'בריכה', '🏊', 'The pool is cool and blue.', 'הבריכה קרירה וכחולה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'kitchen', translationHe: 'מטבח' },
            { wordEn: 'shelf', translationHe: 'מדף' },
          ],
          shortSentenceEn: 'We can swim in the pool.',
          shortSentenceHe: 'אנחנו יכולים לשחות בבריכה.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'There are baskets of wheat on the stage.',
            wrong: ['There is baskets of wheat on the stage.', 'There are basket of wheat on the stage.'],
            explainHe: 'כמה סלים: There are, ו-baskets עם s.',
            hintHe: 'יש כאן יותר מסל אחד. בדקו את הצורה של "יש" ואת סוף המילה.',
          },
          story: {
            passageEn:
              'On Shavuot, there is a party at the kindergarten. The children wear white and bring baskets of fruit and wheat. Then summer vacation starts. Now we can go to the pool and play all day!',
            passageHe:
              'בשבועות יש מסיבה בגן. הילדים לובשים לבן ומביאים סלים של פירות וחיטה. אחר כך מתחיל החופש הגדול. עכשיו אנחנו יכולים ללכת לבריכה ולשחק כל היום!',
            questionEn: 'What color do the children wear?',
            questionHe: 'באיזה צבע הילדים לבושים?',
            correct: 'white',
            wrong: ['blue', 'red'],
          },
        },
      },
    ],
  },
];

export const HOLIDAYS_GRADE_4_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-4', UNITS);
