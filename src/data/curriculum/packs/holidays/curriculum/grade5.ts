import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * Holidays grade 5 units: autumn–winter and spring–summer holidays. Playable from the first day,
 * so they only use grade 4's grammar (can, there is / are, places, I like) and units 1–2 of
 * grade 5 (be, have / has, telling time), with new holiday words.
 */
const UNIT_HOLIDAYS_AUTUMN: ElementaryUnitSpec = {
  ...packUnitNumbers('holidays-autumn'),
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which one is right?',
              correct: 'There is honey on the table.',
              wrong: ['There are honey on the table.'],
              explainHe: 'honey הוא דבר אחד שלא סופרים, ולכן There is.',
              hintHe: 'דבש הוא דבר אחד ולא סופרים אותו. איזו צורה של be מתאימה?',
            },
            story: {
              passageEn: 'It is a holiday. We eat apples and honey. The apples are sweet.',
              passageHe: 'היום חג. אנחנו אוכלים תפוחים ודבש. התפוחים מתוקים.',
              questionEn: 'What do we eat with honey?',
              questionHe: 'מה אוכלים עם דבש?',
              correct: 'apples',
              wrong: ['fish'],
            },
          },
          challenger: {
            clozeWrong: [
              ['shoes', 'paper'],
              ['window', 'carrot'],
              ['sleepy', 'angry'],
              ['shoe', 'mountain'],
            ],
          },
          master: {
            sentenceEn: 'My grandma has a big table for the holiday dinner.',
            sentenceHe: 'לסבתא שלי יש שולחן גדול לארוחת החג.',
            decoys: ['have', 'small'],
            voiceEn: 'There is a round challah here.',
            voiceHe: 'יש כאן חלה עגולה.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'There are three red apples on the plate.',
              wrong: ['There is three red apples on the plate.', 'There are three red apple on the plate.', 'There are red three apples on the plate.'],
              explainHe: 'three apples הם רבים: There are ו-apples עם s. המספר בא לפני התואר.',
              hintEn: 'Check the verb, the noun ending and the order.',
            },
            story: {
              passageEn: 'On Rosh Hashana the whole family sits around the table. Before dinner everyone dips an apple in honey and says a wish. Little Tamar is only four and shy, so she says nothing. Then she takes her mother by the hand and whispers her wish in her ear.',
              passageHe: '',
              questionEn: 'Why does Tamar whisper her wish?',
              questionHe: '',
              correct: 'She feels shy in front of everyone.',
              wrong: ['She wants to eat more apples now.', 'Her mother is at another table.', 'The family is already asleep now.'],
            },
            storyHintEn: 'How does Tamar feel about speaking?',
          },
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
      sentenceHe: 'הסוכה שלנו ליד הבית ועל הגג יש עלים ירוקים.',
      vocab: [
        ['sukkah', 'noun', 'סוכה', '🏡', 'We eat dinner in the sukkah.', 'אנחנו אוכלים ארוחת ערב בסוכה.'],
        ['roof', 'noun', 'גג / סכך', '🍃', 'The roof is made of palm leaves.', 'הגג עשוי מעלי דקל.'],
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Pick the right sentence.',
              correct: 'The cat is in the box.',
              wrong: ['The cat in is the box.'],
              explainHe: 'סדר המילים: הנושא, אחריו is, ואחריו מילת המקום in.',
              hintHe: 'הפועל is בא מיד אחרי הנושא.',
            },
            story: {
              passageEn: 'We have a sukkah in the yard. It has a green roof. We eat dinner in it.',
              passageHe: 'יש לנו סוכה בחצר. יש לה גג ירוק. אנחנו אוכלים בה ארוחת ערב.',
              questionEn: 'What color is the roof?',
              questionHe: 'באיזה צבע הגג?',
              correct: 'green',
              wrong: ['red'],
            },
          },
          challenger: {
            clozeWrong: [
              ['pocket', 'bottle'],
              ['river', 'sandwich'],
              ['idea', 'week'],
              ['tomorrow', 'yesterday'],
            ],
          },
          master: {
            sentenceEn: 'We hang colorful lights and paper stars inside the sukkah.',
            sentenceHe: 'אנחנו תולים אורות צבעוניים וכוכבי נייר בתוך הסוכה.',
            decoys: ['hangs', 'tall'],
            voiceEn: 'The roof has green and brown leaves.',
            voiceHe: 'לגג יש עלים ירוקים וחומים.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'The chairs are under the big table.',
              wrong: ['The chairs is under the big table.', 'The chairs are under big the table.', 'The chairs are under of the big table.'],
              explainHe: 'chairs הם רבים ולכן are, אחרי under לא מוסיפים to, והתואר big בא לפני שם העצם.',
              hintEn: 'Check the verb be and the words after under.',
            },
            story: {
              passageEn: 'On Sunday we build a sukkah, and on Monday there is a big storm. In the morning the paper decorations are on the grass and the roof is crooked. Dad looks tired, but he smiles and says, we can fix it together. By the evening the sukkah looks new again.',
              passageHe: '',
              questionEn: 'Why do the decorations lie on the grass?',
              questionHe: '',
              correct: 'The storm blows them off the walls.',
              wrong: ['Dad wants to clean the old walls.', 'The children want to play with them.', 'The family wants to paint them red.'],
            },
            storyHintEn: 'What happens on Monday?',
          },
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
        ['rain', 'noun', 'גשם', '🌧️', 'I like the sound of the rain.', 'אני אוהב/ת את צליל הגשם.'],
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which one is right?',
              correct: 'There are two candles.',
              wrong: ['There is two candles.'],
              explainHe: 'two candles הם רבים ולכן There are.',
              hintHe: 'שני נרות הם יותר מאחד. איזו צורה של be מתאימה לרבים?',
            },
            story: {
              passageEn: 'It is winter. It is cold and rainy. Dan has a coat and a hat.',
              passageHe: 'עכשיו חורף. קר וגשום. לדן יש מעיל וכובע.',
              questionEn: 'Who has a coat?',
              questionHe: 'למי יש מעיל?',
              correct: 'Dan',
              wrong: ['Mom'],
            },
          },
          challenger: {
            clozeWrong: [
              ['river', 'soup'],
              ['pencil', 'shoe'],
              ['week', 'month'],
              ['month', 'river'],
            ],
          },
          master: {
            sentenceEn: 'Grandma lights two candles when it rains in winter.',
            sentenceHe: 'סבתא מדליקה שני נרות כשיורד גשם בחורף.',
            decoys: ['light', 'sun'],
            voiceEn: 'My warm coat is on the chair.',
            voiceHe: 'המעיל החם שלי על הכיסא.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'My brothers have two warm coats.',
              wrong: ['My brothers has two warm coats.', 'My brothers have two warm coat.', 'My brother have two warm coats.'],
              explainHe: 'brothers הם רבים ולכן have, ואחרי two שם העצם מקבל s.',
              hintEn: 'Check the verb and the noun after two.',
            },
            story: {
              passageEn: 'It rains all week in December. Yael has no winter coat, because her old one is too small. On Friday her grandmother arrives with a big bag. Inside is a warm red coat with a hood. Yael puts it on and runs outside to jump in the water.',
              passageHe: '',
              questionEn: 'Why does Yael run outside happily?',
              questionHe: '',
              correct: 'Her new coat keeps her dry.',
              wrong: ['The rain finally stops today.', 'She has no school today.', 'Her old coat is warm again.'],
            },
            storyHintEn: 'What is in the big bag?',
          },
        },
      },
    },
  ],
};

const UNIT_HOLIDAYS_SPRING: ElementaryUnitSpec = {
  ...packUnitNumbers('holidays-spring'),
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which one is right?',
              correct: 'I can plant a tree.',
              wrong: ['I can plants a tree.'],
              explainHe: 'אחרי can הפועל בא בצורה הבסיסית, בלי s.',
              hintHe: 'אחרי can הפועל לא משתנה.',
            },
            story: {
              passageEn: 'Today we plant a tree. The tree is small. Dana puts water on it.',
              passageHe: 'היום אנחנו נוטעים עץ. העץ קטן. דנה שופכת עליו מים.',
              questionEn: 'What does Dana put on the tree?',
              questionHe: 'מה דנה שופכת על העץ?',
              correct: 'water',
              wrong: ['paint'],
            },
          },
          challenger: {
            clozeWrong: [
              ['read', 'sing'],
              ['shoes', 'chairs'],
              ['week', 'song'],
              ['tomato', 'pencil'],
            ],
          },
          master: {
            sentenceEn: 'On Purim my friends wear masks and eat sweet cookies.',
            sentenceHe: 'בפורים החברים שלי חובשים מסכות ואוכלים עוגיות מתוקות.',
            decoys: ['can', 'wears'],
            voiceEn: 'My brother is a funny king.',
            voiceHe: 'אחי הוא מלך מצחיק.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'We can plant a tree on Monday.',
              wrong: ['We can to plant a tree on Monday.', 'We can plants a tree on Monday.', 'We cans plant a tree on Monday.'],
              explainHe: 'אחרי can בא הפועל הבסיסי בלי to ובלי s, ו-can עצמו לא משתנה.',
              hintEn: 'Check the words around the verb plant.',
            },
            story: {
              passageEn: 'Eden wants to be a queen for Purim, but her mother says the shop is closed. Eden looks in the old box in the garage. She finds a gold paper plate, some string and a yellow scarf. Soon she has a crown and a long dress. The next day everyone says her costume is the best.',
              passageHe: '',
              questionEn: 'How does Eden make her costume?',
              questionHe: '',
              correct: 'She uses things from an old box.',
              wrong: ['She buys everything at the shop.', 'Her mother sews a brand new dress.', 'A friend gives her the whole costume.'],
            },
            storyHintEn: 'Is the shop open or closed?',
          },
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which one is right?',
              correct: 'What time is dinner?',
              wrong: ['What time are dinner?'],
              explainHe: 'dinner הוא דבר אחד ולכן is.',
              hintHe: 'ארוחת ערב היא דבר אחד. איזו צורה של be מתאימה?',
            },
            story: {
              passageEn: 'It is spring. We clean the house. Then we eat matzah.',
              passageHe: 'עכשיו אביב. אנחנו מנקים את הבית. אחר כך אנחנו אוכלים מצה.',
              questionEn: 'What do we eat after we clean?',
              questionHe: 'מה אוכלים אחרי שמנקים?',
              correct: 'matzah',
              wrong: ['pizza'],
            },
          },
          challenger: {
            clozeWrong: [
              ['pencils', 'windows'],
              ['soup', 'pencil'],
              ['eat', 'sing'],
              ['mountain', 'pencil'],
            ],
          },
          master: {
            sentenceEn: 'At night we clean the kitchen and set the table.',
            sentenceHe: 'בלילה אנחנו מנקים את המטבח ועורכים את השולחן.',
            decoys: ['cleans', 'spring'],
            voiceEn: 'There are four cups on the tray.',
            voiceHe: 'יש ארבע כוסות על המגש.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'What time do we eat dinner?',
              wrong: ['What time we eat dinner?', 'What time does we eat dinner?', 'What time do we eats dinner?'],
              explainHe: 'בשאלה עם we משתמשים ב-do, והפועל eat נשאר בצורה הבסיסית.',
              hintEn: 'Check the helper verb and the main verb.',
            },
            story: {
              passageEn: "The Seder starts at seven, but at six the kitchen is still full of dirty pots. Dad looks at the clock and calls everyone. Mom washes the pots, Dan sets the table and Noa puts the cups out. At seven o'clock the table is ready and the family sits down with big smiles.",
              passageHe: '',
              questionEn: 'Why does Dad call everyone to the kitchen?',
              questionHe: '',
              correct: 'They must be ready on time.',
              wrong: ['The food is already cold.', 'He wants to eat the matzah.', 'The guests are late again.'],
            },
            storyHintEn: 'What time does the Seder start?',
          },
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which one is right?',
              correct: 'There are two flags.',
              wrong: ['There is two flags.'],
              explainHe: 'two flags הם רבים ולכן There are.',
              hintHe: 'שני דגלים הם יותר מאחד. איזו צורה של be מתאימה?',
            },
            story: {
              passageEn: 'It is summer. Mia has a basket. There are flowers in it.',
              passageHe: 'עכשיו קיץ. למיה יש סל. יש בו פרחים.',
              questionEn: 'What is in the basket?',
              questionHe: 'מה יש בסל?',
              correct: 'flowers',
              wrong: ['books'],
            },
          },
          challenger: {
            clozeWrong: [
              ['week', 'song'],
              ['week', 'idea'],
              ['sky', 'rain'],
              ['tomorrow', 'yesterday'],
            ],
          },
          master: {
            sentenceEn: 'In summer we have a long vacation at the beach.',
            sentenceHe: 'בקיץ יש לנו חופש ארוך בחוף הים.',
            decoys: ['has', 'pencil'],
            voiceEn: 'The flag is on the balcony.',
            voiceHe: 'הדגל על המרפסת.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'There are six flags on the balcony.',
              wrong: ['There is six flags on the balcony.', 'There are six flag on the balcony.', 'There are flags six on the balcony.'],
              explainHe: 'six flags הם רבים: There are, flags עם s, והמספר בא לפני שם העצם.',
              hintEn: 'Check the verb, the noun ending and the order.',
            },
            story: {
              passageEn: 'On the last day of school the teacher gives every child a small flower. Some children put it in their hair. Roi puts his flower in a book and says it is for the summer. Then he waves goodbye and runs to the bus. He cannot wait for the long vacation.',
              passageHe: '',
              questionEn: 'Why does Roi put his flower in a book?',
              questionHe: '',
              correct: 'He wants to keep it for later.',
              wrong: ['He wants to read on the bus.', 'The teacher asks him to do it.', 'He does not like the flower.'],
            },
            storyHintEn: 'What does Roi say about the summer?',
          },
        },
      },
    },
  ],
};

/** The holidays-autumn pack's grade 5 unit (`../../registry.ts`) */
export const HOLIDAYS_AUTUMN_GRADE_5_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-5', [UNIT_HOLIDAYS_AUTUMN]);

/** The holidays-spring pack's grade 5 unit (`../../registry.ts`) */
export const HOLIDAYS_SPRING_GRADE_5_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-5', [UNIT_HOLIDAYS_SPRING]);
