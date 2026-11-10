import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * Grade 4, Holidays & Seasons pack: open from the first day, so it only uses grade 3's grammar
 * (plural s, colours, am / is / are, It is + weather, a / an, I can, I like) and grade 4's
 * units 1–2 (can / can't and questions, There is / There are, in / on / under) with new holiday words.
 * Hebrew copy is gender-neutral (slash forms such as "אוכל/ת" and plural imperatives).
 */
const UNIT_HOLIDAYS_AUTUMN: ElementaryUnitSpec = {
  ...packUnitNumbers('holidays-autumn'),
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which one is right?',
              correct: 'There is a candle on the cake.',
              wrong: ['There are a candle on the cake.'],
              explainHe: 'עם a candle (אחד) אומרים There is.',
              hintHe: 'כמה נרות יש? אחד. איזו צורה מתאימה?',
            },
            story: {
              passageEn: 'It is the new year. I write a card for my uncle. The card has a blue star.',
              passageHe: 'עכשיו ראש השנה. אני כותב/ת כרטיס ברכה לדוד שלי. בכרטיס יש כוכב כחול.',
              questionEn: 'What does the card have?',
              questionHe: 'מה יש בכרטיס?',
              correct: 'a blue star',
              wrong: ['a red heart'],
            },
          },
          challenger: {
            clozeWrong: [
              ['paper', 'rain'],
              ['sad', 'angry'],
              ['door', 'spoon'],
              ['honey', 'milk'],
            ],
          },
          master: {
            sentenceEn: 'There are many sweet cards on the long holiday table.',
            sentenceHe: 'יש הרבה כרטיסי ברכה מתוקים על שולחן החג הארוך.',
            decoys: ['is', 'card'],
            voiceEn: 'We eat honey with apples.',
            voiceHe: 'אנחנו אוכלים דבש עם תפוחים.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'There is a big plate of honey.',
              wrong: ['There are a big plate of honey.', 'There is two big plates of honey.', 'There a big plate is of honey.'],
              explainHe: 'לדבר אחד (a big plate) אומרים There is, ואחרי There בא is או are.',
              hintEn: 'Look at the words right after There.',
            },
            story: {
              passageEn: 'Grandma\'s table is ready for the holiday. There are apples, honey and a round challah on it. Little Tom looks at the food and asks, "Can I start now?" Grandma shakes her head. "First we wait for everybody," she says. Soon the door opens, and the whole family comes in with big smiles.',
              passageHe: '',
              questionEn: 'Why does Grandma tell Tom to wait?',
              questionHe: '',
              correct: 'The family is not here yet.',
              wrong: ['The food is not ready.', 'Tom is not hungry.', 'The table is too small.'],
            },
            storyHintEn: 'Who must come before they eat?',
          },
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'The keys are inside the bag. Which is right?',
              correct: 'The keys are in the bag.',
              wrong: ['The keys are on the bag.'],
              explainHe: 'בתוך אומרים in, ו-on פירושו על.',
              hintHe: 'המפתחות בפנים, לא למעלה. איזו מילה מתאימה?',
            },
            story: {
              passageEn: 'We have a small sukkah. There is a table in it. A green plant is on the table.',
              passageHe: 'יש לנו סוכה קטנה. יש בה שולחן. עציץ ירוק נמצא על השולחן.',
              questionEn: 'What is on the table?',
              questionHe: 'מה על השולחן?',
              correct: 'a green plant',
              wrong: ['a yellow cup'],
            },
          },
          challenger: {
            clozeWrong: [
              ['moon', 'minute'],
              ['sky', 'rain'],
              ['song', 'dream'],
              ['noise', 'minute'],
            ],
          },
          master: {
            sentenceEn: 'There are many paper decorations under the green roof.',
            sentenceHe: 'יש הרבה קישוטי נייר מתחת לגג הירוק.',
            decoys: ['is', 'lemon'],
            voiceEn: 'My uncle sits in the sukkah.',
            voiceHe: 'הדוד שלי יושב בסוכה.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'The lemons are on the table.',
              wrong: ['The lemons is on the table.', 'The lemons are in on the table.', 'The lemons are on of the table.'],
              explainHe: 'lemons ברבים ולכן are, ומילת מקום אחת בלבד באה לפני the: on the table.',
              hintEn: 'Check the verb and count the place words.',
            },
            story: {
              passageEn: 'Before the holiday, Noa and Uri build a sukkah in the yard. They put green branches on the roof, but Uri leaves a small gap. "Why?" asks Noa. "On Sukkot we must see the stars at night," he says. That night they lie on the floor of the sukkah and look up. The sky is full of small lights.',
              passageHe: '',
              questionEn: 'Why does Uri leave a gap in the roof?',
              questionHe: '',
              correct: 'So they can see the stars.',
              wrong: ['So the rain can come in.', 'Because the roof is too heavy.', 'To let the cat go out.'],
            },
            storyHintEn: 'What do they look at from the floor?',
          },
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
        ['winter', 'noun', 'חורף', '❄️', 'In winter, I wear warm socks.', 'בחורף אני גורב/ת גרביים חמים.'],
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which question is right?',
              correct: 'Can she bake a doughnut?',
              wrong: ['Can she bakes a doughnut?'],
              explainHe: 'בשאלה עם can הפועל נשאר בצורה הבסיסית, בלי s.',
              hintHe: 'אחרי Can she, איך נראה הפועל?',
            },
            story: {
              passageEn: 'It is winter. There is rain outside. I wear a warm hat.',
              passageHe: 'עכשיו חורף. יש גשם בחוץ. אני חובש/ת כובע חם.',
              questionEn: 'What do I wear?',
              questionHe: 'מה אני חובש/ת?',
              correct: 'a warm hat',
              wrong: ['a thin shirt'],
            },
          },
          challenger: {
            clozeWrong: [
              ['song', 'window'],
              ['pencil', 'chair'],
              ['pencil', 'garden'],
              ['sock', 'radio'],
            ],
          },
          master: {
            sentenceEn: 'On a rainy winter night we light the candles.',
            sentenceHe: 'בלילה חורפי וגשום אנחנו מדליקים את הנרות.',
            decoys: ['lights', 'summer'],
            voiceEn: 'I can see the rain.',
            voiceHe: 'אני יכול/ה לראות את הגשם.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'There are nine candles in the window.',
              wrong: ['There is nine candles in the window.', 'There are nine candle in the window.', 'There nine candles are in the window.'],
              explainHe: 'לרבים (nine candles) אומרים There are, והמילה candles מקבלת s.',
              hintEn: 'Check the verb and the end of the noun.',
            },
            story: {
              passageEn: 'It is a stormy winter night and the lights go out in the whole street. Dan is afraid of the dark. His mother finds a box of Hanukkah candles and puts them in the window. Soon the room is warm and bright. Dan smiles and asks for a doughnut. "Next time," he says, "I want the lights to go out again."',
              passageHe: '',
              questionEn: 'Why does Dan stop being afraid?',
              questionHe: '',
              correct: 'The candles make the room bright.',
              wrong: ['The rain stops falling.', 'His father comes home.', 'He falls asleep early.'],
            },
            storyHintEn: 'What does his mother put in the window?',
          },
        },
      },
    },
  ],
};

const UNIT_HOLIDAYS_SPRING: ElementaryUnitSpec = {
  ...packUnitNumbers('holidays-spring'),
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
      grammarTopic: 'Tu BiShvat & Purim Words, "can" & colors',
      skills: ['Holiday Words', 'can', 'Colors'],
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
          passageHe: 'בט"ו בשבט הכיתה שלנו הולכת לפארק. יש גומות קטנות באדמה. כל ילד יכול לזרוע זרע. ואז בפורים אני עץ! התחפושת שלי ירוקה וחומה.',
          questionEn: 'What is my Purim costume?',
          questionHe: 'מה התחפושת שלי בפורים?',
          correct: 'a tree',
          wrong: ['a king', 'a cat'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which one is right?',
              correct: 'We can plant a flower.',
              wrong: ['We can plants a flower.'],
              explainHe: 'אחרי can הפועל נשאר בצורה הבסיסית, בלי s.',
              hintHe: 'שימו לב לסוף הפועל אחרי can.',
            },
            story: {
              passageEn: 'It is Purim. Dan has a costume. He is a pirate with a black hat.',
              passageHe: 'עכשיו פורים. לדן יש תחפושת. הוא פיראט עם כובע שחור.',
              questionEn: 'What is Dan?',
              questionHe: 'למה דן מחופש?',
              correct: 'a pirate',
              wrong: ['a king'],
            },
          },
          challenger: {
            clozeWrong: [
              ['spoon', 'sock'],
              ['soup', 'pencil'],
              ['table', 'window'],
              ['river', 'mountain'],
            ],
          },
          master: {
            sentenceEn: 'The little girl can make a gold crown for Purim.',
            sentenceHe: 'הילדה הקטנה יכולה להכין כתר זהב לפורים.',
            decoys: ['makes', 'cans'],
            voiceEn: 'My friend has a funny costume.',
            voiceHe: 'לחבר שלי יש תחפושת מצחיקה.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'My sister can wear a gold crown.',
              wrong: ['My sister can wears a gold crown.', 'My sister cans wear a gold crown.', 'My sister can to wear a gold crown.'],
              explainHe: 'אחרי can הפועל בצורה בסיסית: בלי s ובלי to, ו-can לא משתנה.',
              hintEn: 'Check can and the verb after it.',
            },
            story: {
              passageEn: 'On Tu BiShvat, Mia plants a tiny seed in a pot and puts it on the window. Every day she gives it a little water and talks to it. After three weeks a small green leaf comes out. "It is working!" Mia shouts. Her grandfather smiles. "A tree starts very small," he says. "You only have to wait and care."',
              passageHe: '',
              questionEn: 'What does Grandpa mean?',
              questionHe: '',
              correct: 'Good things grow with time and care.',
              wrong: ['Trees grow only in the park.', 'A seed needs no water at all.', 'Leaves come out in one day.'],
            },
            storyHintEn: 'What does Mia do every day?',
          },
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which one is right?',
              correct: 'There are two kites in the sky.',
              wrong: ['There is two kites in the sky.'],
              explainHe: 'לרבים (two kites) אומרים There are.',
              hintHe: 'כמה עפיפונים יש? יותר מאחד. איזו צורה מתאימה?',
            },
            story: {
              passageEn: 'It is spring. We go to the park. There is a big tree. We eat lunch under the tree.',
              passageHe: 'עכשיו אביב. אנחנו הולכים לפארק. יש עץ גדול. אנחנו אוכלים ארוחת צהריים מתחת לעץ.',
              questionEn: 'Where do we eat?',
              questionHe: 'איפה אנחנו אוכלים?',
              correct: 'under the tree',
              wrong: ['on the roof'],
            },
          },
          challenger: {
            clozeWrong: [
              ['ceiling', 'door'],
              ['Monday', 'Sunday'],
              ['rain', 'Monday'],
              ['sun', 'soup'],
            ],
          },
          master: {
            sentenceEn: 'There are red and white flags in the park today.',
            sentenceHe: 'יש היום דגלים אדומים ולבנים בפארק.',
            decoys: ['is', 'flag'],
            voiceEn: 'My family has a picnic today.',
            voiceHe: 'למשפחה שלי יש פיקניק היום.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'There is a picnic in the park.',
              wrong: ['There are a picnic in the park.', 'It is a picnic in the park.', 'There is picnics in the park.'],
              explainHe: 'כדי לומר "יש" על דבר אחד אומרים There is. לא It is ולא There are.',
              hintEn: 'Which two words mean "there exists"?',
            },
            story: {
              passageEn: "Every Independence Day, Ofra's family goes to the same park. They hang a flag on their tree and spread a big blanket. This year it rains all afternoon, so they stay at home. Ofra's dad puts the flag on the balcony. At night they sit in the dark and watch the fireworks from the window.",
              passageHe: '',
              questionEn: 'Why does the family stay at home?',
              questionHe: '',
              correct: 'The weather is bad.',
              wrong: ['Dad is sick today.', 'The park is closed.', 'The flag is missing.'],
            },
            storyHintEn: 'What happens all afternoon?',
          },
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which one is right?',
              correct: 'We can swim in the sea.',
              wrong: ['We can swims in the sea.'],
              explainHe: 'אחרי can הפועל נשאר בצורה הבסיסית, בלי s.',
              hintHe: 'שימו לב לסוף הפועל אחרי can.',
            },
            story: {
              passageEn: 'It is summer. Dan goes to the pool. He can swim very well.',
              passageHe: 'עכשיו קיץ. דן הולך לבריכה. הוא יודע לשחות מצוין.',
              questionEn: 'Where does Dan go?',
              questionHe: 'לאן דן הולך?',
              correct: 'to the pool',
              wrong: ['to school'],
            },
          },
          challenger: {
            clozeWrong: [
              ['tooth', 'pencil'],
              ['Monday', 'pencil'],
              ['doors', 'shoes'],
              ['song', 'Monday'],
            ],
          },
          master: {
            sentenceEn: 'We can play in the cool pool all summer.',
            sentenceHe: 'אנחנו יכולים לשחק בבריכה הקרירה כל הקיץ.',
            decoys: ['plays', 'winter'],
            voiceEn: 'The wheat is in the field.',
            voiceHe: 'החיטה בשדה.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'There are many pools in this town.',
              wrong: ['There is many pools in this town.', 'There are many pool in this town.', 'There many pools are in this town.'],
              explainHe: 'לרבים (many pools) אומרים There are, והמילה pools מקבלת s.',
              hintEn: 'Check the verb and the end of pools.',
            },
            story: {
              passageEn: 'Dalit and Ben are cousins. Every summer vacation they stay with their grandfather, who has a wheat field. This year, the wheat is tall and golden, and there is a small pool behind the house. In the morning they help Grandpa in the field. In the afternoon they swim. At night Ben says, "This is the best vacation."',
              passageHe: '',
              questionEn: 'Why does Ben say it is the best vacation?',
              questionHe: '',
              correct: 'He likes the field and the pool.',
              wrong: ['He does not have to swim.', 'Grandpa gives them money.', 'They stay at home all day.'],
            },
            storyHintEn: 'What do they do morning and afternoon?',
          },
        },
      },
    },
  ],
};

/** The holidays-autumn pack's grade 4 unit (`../../registry.ts`) */
export const HOLIDAYS_AUTUMN_GRADE_4_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-4', [UNIT_HOLIDAYS_AUTUMN]);

/** The holidays-spring pack's grade 4 unit (`../../registry.ts`) */
export const HOLIDAYS_SPRING_GRADE_4_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-4', [UNIT_HOLIDAYS_SPRING]);
