import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * Grade 3, Holidays & Seasons pack: open from the first day, so it only uses grade 2's grammar
 * (I have, I like, This is my…, What is this? It is a…, Is it a…?, I can) and grade 3's units 1–2
 * (plural s, colours before nouns, I am + feeling, It is + weather, am / is / are) with new holiday words.
 * Hebrew copy is gender-neutral (slash forms such as "אוכל/ת").
 */
const UNITS: ElementaryUnitSpec[] = [
  {
    ...packUnitNumbers('holidays', 0),
    titleEn: 'Autumn & Winter Holidays',
    titleHe: 'חגי הסתיו והחורף',
    subtitleHe: 'ראש השנה, סוכות וחנוכה: מילים חדשות (honey, sukkah, doughnut) ומשפטי "I have / It is"',
    badgeEmoji: '🌧️',
    missions: [
      {
        icon: '🍎',
        titleEn: 'Apples and Honey',
        titleHe: 'תפוח בדבש',
        storyHookHe: 'ראש השנה מגיע! השולחן מלא בתפוחים ובדבש. בואו נאחל שנה טובה ומתוקה באנגלית.',
        grammarTopic: 'Rosh Hashana Words & "I have / I like"',
        skills: ['Holiday Words', 'I have / I like', 'Speaking Aloud'],
        sentenceEn: 'I have a red apple and sweet honey.',
        sentenceHe: 'יש לי תפוח אדום ודבש מתוק.',
        vocab: [
          ['honey', 'noun', 'דבש', '🍯', 'Honey comes from bees.', 'דבש מגיע מדבורים.'],
          ['apple', 'noun', 'תפוח', '🍎', 'I dip the apple in honey.', 'אני טובל/ת את התפוח בדבש.'],
          ['sweet', 'adjective', 'מתוק / מתוקה', '🍬', 'The cake is very sweet.', 'העוגה מתוקה מאוד.'],
          ['year', 'noun', 'שנה', '🗓️', 'Happy new year to you!', 'שנה טובה לכם!'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'scissors', translationHe: 'מספריים' },
            { wordEn: 'windy', translationHe: 'רוחני / סוער' },
          ],
          shortSentenceEn: 'Honey is so sweet.',
          shortSentenceHe: 'דבש כל כך מתוק.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'I have three red apples.',
            wrong: ['I have three red apple.', 'I have three apples red.'],
            explainHe: 'יותר מתפוח אחד: apples עם s. והצבע בא לפני הדבר: red apples.',
            hintHe: 'בדקו שני דברים: האם יש תוספת בסוף כשיש יותר מאחד, והאם הצבע בא לפני הדבר.',
          },
          story: {
            passageEn: 'It is Rosh Hashana. Grandma has a big table. The honey is on the table. I eat a green apple with honey. It is sweet!',
            passageHe: 'ראש השנה. לסבתא יש שולחן גדול. הדבש על השולחן. אני אוכל/ת תפוח ירוק עם דבש. זה מתוק!',
            questionEn: 'What color is my apple?',
            questionHe: 'באיזה צבע התפוח שלי?',
            correct: 'green',
            wrong: ['red', 'purple'],
          },
        },
      },
      {
        icon: '🌴',
        titleEn: 'Our Sukkah',
        titleHe: 'הסוכה שלנו',
        storyHookHe: 'בונים סוכה בחצר! תולים קישוטים צבעוניים ומזמינים אורחים. מה יש בסוכה שלנו?',
        grammarTopic: 'Sukkot Words & "This is my..." / plural s',
        skills: ['Holiday Words', 'This is...', 'Plural s'],
        sentenceEn: 'This is our sukkah and it has yellow stars.',
        sentenceHe: 'זאת הסוכה שלנו ויש בה כוכבים צהובים.',
        vocab: [
          ['sukkah', 'noun', 'סוכה', '🌴', 'We eat dinner in the sukkah.', 'אנחנו אוכלים ארוחת ערב בסוכה.'],
          ['chain', 'noun', 'שרשרת', '🔗', 'I make a paper chain.', 'אני מכין/ה שרשרת מנייר.'],
          ['guest', 'noun', 'אורח / אורחת', '👥', 'We have five guests today.', 'יש לנו חמישה אורחים היום.'],
          ['star', 'noun', 'כוכב', '⭐', 'I draw a big star.', 'אני מצייר/ת כוכב גדול.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'notebook', translationHe: 'מחברת' },
            { wordEn: 'tired', translationHe: 'עייף / עייפה' },
          ],
          shortSentenceEn: 'This is our sukkah.',
          shortSentenceHe: 'זאת הסוכה שלנו.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'We have two guests.',
            wrong: ['We have two guest.', 'We has two guests.'],
            explainHe: 'עם we אומרים have, ושני אורחים הם guests עם s.',
            hintHe: 'איזו צורה של have הולכת עם אנחנו? והאם יש תוספת בסוף כשיש שניים?',
          },
          story: {
            passageEn: 'This is my sukkah. It has a green roof. I have a long paper chain. My sister has blue stars. We are happy.',
            passageHe: 'זאת הסוכה שלי. יש לה גג ירוק. יש לי שרשרת נייר ארוכה. לאחותי יש כוכבים כחולים. אנחנו שמחים.',
            questionEn: 'What does my sister have?',
            questionHe: 'מה יש לאחותי?',
            correct: 'blue stars',
            wrong: ['a green roof', 'red apples'],
          },
        },
      },
      {
        icon: '🕯️',
        isBoss: true,
        titleEn: 'Boss: Hanukkah on a Rainy Night',
        titleHe: 'אתגר הבוס: חנוכה בלילה גשום',
        storyHookHe: 'בחוץ יורד גשם, ובבית חם ומואר. מדליקים נרות, אוכלים סופגניות ועוברים על כל חגי הסתיו והחורף!',
        grammarTopic: 'Hanukkah & Winter, It is... & Review',
        skills: ['Holiday Words', 'Weather', 'Review'],
        sentenceEn: 'It is cold in winter, but I am happy with my doughnut.',
        sentenceHe: 'קר בחורף, אבל אני שמח/ה עם הסופגנייה שלי.',
        vocab: [
          ['doughnut', 'noun', 'סופגנייה', '🍩', 'I eat a doughnut with jam.', 'אני אוכל/ת סופגנייה עם ריבה.'],
          ['winter', 'noun', 'חורף', '❄️', 'Winter is cold and rainy.', 'החורף קר וגשום.'],
          ['light', 'noun', 'אור / נר דולק', '💡', 'The lights are pretty.', 'האורות יפים.'],
          ['umbrella', 'noun', 'מטריה', '☂️', 'My umbrella is yellow.', 'המטריה שלי צהובה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'pencil', translationHe: 'עיפרון' },
            { wordEn: 'giraffe', translationHe: "ג'ירפה" },
          ],
          shortSentenceEn: 'It is cold in winter.',
          shortSentenceHe: 'בחורף קר.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'It is rainy today.',
            wrong: ['It are rainy today.', 'It rainy today.'],
            explainHe: 'על מזג האוויר אומרים It is: It is rainy (גשום).',
            hintHe: 'איזו צורה של be הולכת עם it? ובאנגלית אי אפשר לוותר עליה.',
          },
          story: {
            passageEn:
              'It is Hanukkah. It is rainy outside, so I have my umbrella. At home, we light the candles. We have eight lights. Mom gives me a doughnut. I am so happy!',
            passageHe:
              'חנוכה. בחוץ גשום, אז יש לי מטריה. בבית אנחנו מדליקים את הנרות. יש לנו שמונה אורות. אמא נותנת לי סופגנייה. אני כל כך שמח/ה!',
            questionEn: 'How many lights do we have?',
            questionHe: 'כמה אורות יש לנו?',
            correct: 'eight',
            wrong: ['two', 'five'],
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('holidays', 1),
    titleEn: 'Spring & Summer Holidays',
    titleHe: 'חגי האביב והקיץ',
    subtitleHe: 'ט"ו בשבט, פורים, פסח, יום העצמאות ושבועות: מילים חדשות (costume, flag, vacation)',
    badgeEmoji: '🌷',
    missions: [
      {
        icon: '🌳',
        titleEn: 'Trees and Costumes',
        titleHe: 'עצים ותחפושות',
        storyHookHe: 'בט"ו בשבט שותלים עצים, ובפורים מתחפשים! איזו תחפושת יש לכם השנה?',
        grammarTopic: 'Tu BiShvat & Purim Words, "I have" & colours',
        skills: ['Holiday Words', 'I have', 'Colours'],
        sentenceEn: 'I have a purple costume and a gold crown.',
        sentenceHe: 'יש לי תחפושת סגולה וכתר זהב.',
        vocab: [
          ['costume', 'noun', 'תחפושת', '🎭', 'My costume is funny.', 'התחפושת שלי מצחיקה.'],
          ['crown', 'noun', 'כתר', '👑', 'The queen has a crown.', 'למלכה יש כתר.'],
          ['tree', 'noun', 'עץ', '🌳', 'The tree is tall and green.', 'העץ גבוה וירוק.'],
          ['plant', 'verb', 'לשתול', '🌱', 'We plant flowers in the garden.', 'אנחנו שותלים פרחים בגינה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'desk', translationHe: 'שולחן כתיבה' },
            { wordEn: 'cloudy', translationHe: 'מעונן' },
          ],
          shortSentenceEn: 'I have a costume.',
          shortSentenceHe: 'יש לי תחפושת.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'I have a gold crown.',
            wrong: ['I have a crown gold.', 'I gold have a crown.'],
            explainHe: 'באנגלית הצבע בא לפני הדבר: a gold crown (כתר זהב).',
            hintHe: 'איפה בא הצבע באנגלית: לפני הדבר שהוא מתאר או אחריו?',
          },
          story: {
            passageEn: 'It is Purim. I have a king costume. It is red. I have a crown, too. My friend Dana is a cat.',
            passageHe: 'פורים. יש לי תחפושת של מלך. היא אדומה. יש לי גם כתר. החברה שלי, דנה, היא חתולה.',
            questionEn: 'What color is my costume?',
            questionHe: 'באיזה צבע התחפושת שלי?',
            correct: 'red',
            wrong: ['green', 'orange'],
          },
        },
      },
      {
        icon: '🎆',
        titleEn: 'Spring, Grapes and Fireworks',
        titleHe: 'אביב, ענבים וזיקוקים',
        storyHookHe: 'האביב כאן! בפסח יושבים עם המשפחה, וביום העצמאות מניפים דגלים ומסתכלים על זיקוקים.',
        grammarTopic: 'Passover & Independence Day Words, "It is" & "I am"',
        skills: ['Holiday Words', 'It is / I am', 'Listening'],
        sentenceEn: 'The flag is blue and white and I am excited.',
        sentenceHe: 'הדגל כחול ולבן ואני נרגש/ת.',
        vocab: [
          ['flag', 'noun', 'דגל', '🇮🇱', 'I have a flag on my bike.', 'יש לי דגל על האופניים.'],
          ['spring', 'noun', 'אביב', '🌷', 'In spring, the flowers are pretty.', 'באביב הפרחים יפים.'],
          ['grapes', 'noun', 'ענבים', '🍇', 'The grapes are purple.', 'הענבים סגולים.'],
          ['fireworks', 'noun', 'זיקוקים', '🎆', 'The fireworks are loud.', 'הזיקוקים רועשים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'ruler', translationHe: 'סרגל' },
            { wordEn: 'monkey', translationHe: 'קוף' },
          ],
          shortSentenceEn: 'I have a flag.',
          shortSentenceHe: 'יש לי דגל.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'The fireworks are big.',
            wrong: ['The fireworks is big.', 'The fireworks am big.'],
            explainHe: 'fireworks הם הרבה זיקוקים, ולכן are: The fireworks are big.',
            hintHe: 'האם יש כאן דבר אחד או הרבה? בחרו את צורת be שמתאימה להרבה.',
          },
          story: {
            passageEn: 'It is Independence Day. We are in the park. I have a small flag. At night, we see fireworks. They are pink and gold.',
            passageHe: 'יום העצמאות. אנחנו בפארק. יש לי דגל קטן. בלילה אנחנו רואים זיקוקים. הם ורודים וזהובים.',
            questionEn: 'Where are we?',
            questionHe: 'איפה אנחנו?',
            correct: 'in the park',
            wrong: ['at school', 'in the sukkah'],
          },
        },
      },
      {
        icon: '🏖️',
        isBoss: true,
        titleEn: 'Boss: Hello, Summer Vacation!',
        titleHe: 'אתגר הבוס: שלום, חופש גדול!',
        storyHookHe: 'בשבועות אוכלים גבינה ושמים פרחים, ואז מגיע החופש הגדול! עברו על כל חגי האביב והקיץ.',
        grammarTopic: 'Shavuot & Summer, I am / It is & Review',
        skills: ['Holiday Words', 'Weather', 'Review'],
        sentenceEn: 'It is hot in summer and I am on vacation.',
        sentenceHe: 'בקיץ חם ואני בחופש.',
        vocab: [
          ['vacation', 'noun', 'חופשה / חופש', '🧳', 'We go to the sea on vacation.', 'בחופש אנחנו נוסעים לים.'],
          ['summer', 'noun', 'קיץ', '🏖️', 'Summer is hot and sunny.', 'הקיץ חם ושמשי.'],
          ['cheese', 'noun', 'גבינה', '🧀', 'I like white cheese.', 'אני אוהב/ת גבינה לבנה.'],
          ['flower', 'noun', 'פרח', '🌺', 'This flower is pink.', 'הפרח הזה ורוד.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'paintbrush', translationHe: 'מכחול' },
            { wordEn: 'zebra', translationHe: 'זברה' },
          ],
          shortSentenceEn: 'I am on vacation.',
          shortSentenceHe: 'אני בחופש.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'We are happy in summer.',
            wrong: ['We is happy in summer.', 'We am happy in summer.'],
            explainHe: 'עם we (אנחנו) אומרים are: We are happy.',
            hintHe: 'איזו צורה של be הולכת עם אנחנו? (am הולכת רק עם אני.)',
          },
          story: {
            passageEn:
              'It is Shavuot. I have white flowers on my head. We eat cheese cake. Then it is summer vacation! It is sunny and hot. We go to the sea.',
            passageHe:
              'שבועות. יש לי פרחים לבנים על הראש. אנחנו אוכלים עוגת גבינה. ואז מגיע החופש הגדול! שמשי וחם. אנחנו הולכים לים.',
            questionEn: 'Where do we go?',
            questionHe: 'לאן אנחנו הולכים?',
            correct: 'to the sea',
            wrong: ['to school', 'to the zoo'],
          },
        },
      },
    ],
  },
];

export const HOLIDAYS_GRADE_3_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-3', UNITS);
