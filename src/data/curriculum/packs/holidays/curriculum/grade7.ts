import { buildMiddleSchoolGrade, type MiddleSchoolUnitSpec } from '../../../middleSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * Holidays pack, grade 7 ("Holidays & Seasons"). Playable from the first day of the grade, so it
 * reviews grade 6 grammar and grade 7 units 1–2 only: Present Simple for traditions, Present
 * Progressive for what is happening right now, stative verbs, and was / were.
 */
const UNITS: MiddleSchoolUnitSpec[] = [
  {
    ...packUnitNumbers('holidays', 0),
    titleEn: 'Autumn & Winter Holidays',
    titleHe: 'חגי הסתיו והחורף',
    subtitleHe: 'ראש השנה, סוכות, חנוכה וגשם ראשון — Present Simple למסורות ו-Present Progressive לרגע הזה',
    badgeEmoji: '🍃',
    missions: [
      {
        icon: '🍎',
        titleEn: 'Honey Cake & the Sukkah Team',
        titleHe: 'עוגת דבש וצוות הסוכה',
        storyHookHe:
          'השנה החדשה מתחילה! נספר באנגלית מה משפחות בישראל עושות בכל שנה בראש השנה ובסוכות.',
        grammarTopic: 'Present Simple for Holiday Traditions',
        skills: ['Present Simple Review', 'Holiday Traditions', 'Autumn Vocab'],
        sentenceEn: 'Every autumn, my family decorates the sukkah with paper chains and fruit.',
        sentenceHe: 'בכל סתיו, המשפחה שלי מקשטת את הסוכה בשרשראות נייר ובפירות.',
        vocab: [
          ['honey', 'noun', 'דבש', '🍯', 'We dip apple slices in honey at the holiday dinner.', 'אנחנו טובלים פרוסות תפוח בדבש בארוחת החג.'],
          ['tradition', 'noun', 'מסורת', '📜', 'Eating a pomegranate is an old tradition in our family.', 'לאכול רימון זו מסורת ישנה במשפחה שלנו.'],
          ['harvest', 'noun', 'קציר / אסיף', '🌾', 'Sukkot is also a celebration of the harvest.', 'סוכות הוא גם חגיגה של האסיף.'],
          ['decorate', 'verb', 'לקשט', '🎊', 'The children decorate the classroom for the new year.', 'הילדים מקשטים את הכיתה לשנה החדשה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'vinegar', translationHe: 'חומץ' },
            { wordEn: 'destroy', translationHe: 'להרוס' },
          ],
          shortSentenceEn: 'My family decorates the sukkah.',
          shortSentenceHe: 'המשפחה שלי מקשטת את הסוכה.',
          rule: {
            questionEn: 'Complete the sentence: "Every year, my grandfather ____ a big sukkah in the yard."',
            correct: 'builds',
            wrong: ['build', 'is build'],
            explainHe: 'Every year מראה מסורת שחוזרת על עצמה, ו-my grandfather הוא he, ולכן builds עם s.',
            hintHe: 'Every year מראה הרגל. סבא הוא he: מה מוסיפים לפועל ב-Present Simple?',
          },
          story: {
            passageEn:
              'Rosh Hashana is the Jewish New Year, and it usually comes in September. Families eat apples with honey and wish each other a sweet year. A few days later, many families build a sukkah. They decorate it with colorful paper chains, and some people eat and even sleep there for a week.',
            passageHe:
              'ראש השנה הוא השנה החדשה היהודית, והוא בדרך כלל חל בספטמבר. משפחות אוכלות תפוחים בדבש ומאחלות זו לזו שנה מתוקה. כמה ימים אחר כך, משפחות רבות בונות סוכה. הן מקשטות אותה בשרשראות נייר צבעוניות, ויש אנשים שאוכלים ואפילו ישנים בה במשך שבוע.',
            questionEn: 'Why do families eat apples with honey?',
            questionHe: 'מדוע משפחות אוכלות תפוחים בדבש?',
            correct: 'They wish each other a sweet year.',
            wrong: ['They want to finish the harvest quickly.', 'They need food for a long trip.'],
          },
        },
      },
      {
        icon: '🕯️',
        titleEn: 'Candles Are Burning, Rain Is Falling',
        titleHe: 'הנרות דולקים והגשם יורד',
        storyHookHe:
          'ערב חנוכה, בחוץ יורד גשם ראשון. נתאר באנגלית מה קורה עכשיו, ממש ברגע הזה, בעזרת Present Progressive.',
        grammarTopic: 'Present Progressive: What Is Happening Right Now',
        skills: ['Present Progressive Review', 'Now vs. Every Year', 'Winter Vocab'],
        sentenceEn: 'Right now, Dad is frying doughnuts and the rain is falling outside.',
        sentenceHe: 'ממש עכשיו, אבא מטגן סופגניות והגשם יורד בחוץ.',
        vocab: [
          ['candle', 'noun', 'נר', '🕯️', 'Each candle in our window burns for about an hour.', 'כל נר בחלון שלנו דולק בערך שעה.'],
          ['flame', 'noun', 'להבה', '🔥', 'The flame is small, but it is very bright.', 'הלהבה קטנה, אבל היא מאוד בהירה.'],
          ['doughnut', 'noun', 'סופגנייה', '🍩', 'This doughnut is full of strawberry jam.', 'הסופגנייה הזאת מלאה בריבת תות.'],
          ['puddle', 'noun', 'שלולית', '💧', 'My little brother loves jumping into every puddle.', 'אח שלי הקטן אוהב לקפוץ לכל שלולית.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'drought', translationHe: 'בצורת' },
            { wordEn: 'pillow', translationHe: 'כרית' },
          ],
          shortSentenceEn: 'The rain is falling outside.',
          shortSentenceHe: 'הגשם יורד בחוץ.',
          rule: {
            questionEn: 'Complete the sentence: "Look! The children ____ the candles now."',
            correct: 'are lighting',
            wrong: ['light', 'is lighting'],
            explainHe:
              'Look! ו-now מראים שהפעולה קורית ממש עכשיו, ולכן Present Progressive. the children הם רבים, ולכן are.',
            hintHe: 'Look! ו-now מספרים לנו מתי זה קורה. הילדים הם רבים: איזו צורה של be מתאימה להם?',
          },
          story: {
            passageEn:
              'It is the fifth night of Hanukkah, and the first winter storm is here. Outside, the wind is blowing and the streets are full of puddles. Inside, Shira’s family is standing near the window. Her little sister is lighting the candles, and everyone is singing. The kitchen smells of hot doughnuts.',
            passageHe:
              'זה הלילה החמישי של חנוכה, והסערה הראשונה של החורף כבר כאן. בחוץ הרוח נושבת והרחובות מלאים בשלוליות. בפנים, המשפחה של שירה עומדת ליד החלון. אחותה הקטנה מדליקה את הנרות, וכולם שרים. המטבח מריח מסופגניות חמות.',
            questionEn: 'Who is lighting the candles?',
            questionHe: 'מי מדליק/ה את הנרות?',
            correct: 'Shira’s little sister.',
            wrong: ['Shira’s grandmother.', 'Shira’s older brother.'],
          },
        },
      },
      {
        icon: '🌧️',
        isBoss: true,
        titleEn: 'Boss: A Cozy Winter Weekend',
        titleHe: 'אתגר הבוס: סוף שבוע חורפי ונעים',
        storyHookHe:
          'משימת סיכום של חגי הסתיו והחורף! קראו קטע Unseen על סוף שבוע גשום והבדילו בין מה שקורה תמיד למה שקורה עכשיו.',
        grammarTopic: 'Boss: Present Simple vs. Present Progressive in Holiday Reading',
        skills: ['Boss Unseen', 'Simple vs. Progressive', 'Seasons Vocab'],
        sentenceEn: 'We usually go to the park on Saturday, but today we are staying under a warm blanket.',
        sentenceHe: 'בדרך כלל אנחנו הולכים לפארק בשבת, אבל היום אנחנו נשארים מתחת לשמיכה חמה.',
        vocab: [
          ['blanket', 'noun', 'שמיכה', '🛌', 'Grandma knits a new blanket every winter.', 'סבתא סורגת שמיכה חדשה בכל חורף.'],
          ['storm', 'noun', 'סערה', '⛈️', 'The storm closes the beach for two days.', 'הסערה סוגרת את החוף ליומיים.'],
          ['gather', 'verb', 'להתאסף', '👨‍👩‍👧', 'Our cousins gather at our house for the holiday.', 'בני הדודים שלנו מתאספים בבית שלנו לחג.'],
          ['cozy', 'adjective', 'נעים וחמים', '☕', 'The living room is cozy when the heater is on.', 'הסלון נעים וחמים כשהתנור דולק.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'scatter', translationHe: 'להתפזר' },
            { wordEn: 'chilly', translationHe: 'קריר' },
          ],
          shortSentenceEn: 'We are staying under a blanket.',
          shortSentenceHe: 'אנחנו נשארים מתחת לשמיכה.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'It often rains in December, but today the sun is shining.',
            wrong: [
              'It is often raining in December, but today the sun shines.',
              'It often rain in December, but today the sun is shining.',
            ],
            explainHe:
              'often מראה הרגל, ולכן Present Simple: it rains. today מראה משהו שקורה עכשיו, ולכן is shining.',
            hintHe: 'בחלק הראשון יש מילה שמראה הרגל, ובחלק השני מילה שמראה את היום. בדקו גם את הסיומת של הפועל עם it.',
          },
          story: {
            passageEn:
              'In Israel, the rainy season usually starts in October or November. On winter weekends, many families gather at home. This Saturday, a strong storm is passing over Haifa. Eden and her parents are drinking hot cocoa and playing a board game. Eden prefers rainy days because her whole family is together.',
            passageHe:
              'בישראל, עונת הגשמים מתחילה בדרך כלל באוקטובר או בנובמבר. בסופי שבוע של חורף, משפחות רבות מתאספות בבית. בשבת הזאת, סערה חזקה עוברת מעל חיפה. עדן וההורים שלה שותים שוקו חם ומשחקים במשחק קופסה. עדן מעדיפה ימים גשומים כי כל המשפחה שלה ביחד.',
            questionEn: 'Why does Eden prefer rainy days?',
            questionHe: 'מדוע עדן מעדיפה ימים גשומים?',
            correct: 'Because her whole family is together.',
            wrong: ['Because she loves walking in the storm.', 'Because there is no school on those days.'],
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('holidays', 1),
    titleEn: 'Spring & Summer Celebrations',
    titleHe: 'חגיגות האביב והקיץ',
    subtitleHe: 'ט״ו בשבט, פורים, פסח, יום העצמאות, שבועות וחופש גדול — הרגלים, הרגע הזה ופעלי מצב',
    badgeEmoji: '🌸',
    missions: [
      {
        icon: '🌳',
        titleEn: 'Blossoms, Masks & Costumes',
        titleHe: 'פריחה, מסכות ותחפושות',
        storyHookHe:
          'מט״ו בשבט ועד פורים! נשתמש בפעלים כמו love, want ו-know, שכמעט אף פעם לא מקבלים ing.',
        grammarTopic: 'Stative Verbs (love, want, know, need) in Holiday Talk',
        skills: ['Stative Verbs Review', 'Purim & Tu BiShvat', 'Describing Costumes'],
        sentenceEn: 'My sister wants a pirate costume, but I love my homemade lion mask.',
        sentenceHe: 'אחותי רוצה תחפושת של פיראטית, אבל אני אוהב/ת את מסכת האריה שהכנתי בעצמי.',
        vocab: [
          ['costume', 'noun', 'תחפושת', '🦸', 'My costume this year is a giant pineapple.', 'התחפושת שלי השנה היא אננס ענק.'],
          ['blossom', 'noun', 'פריחה / פרח של עץ', '🌸', 'The almond trees are full of white blossom in February.', 'עצי השקד מלאים בפריחה לבנה בפברואר.'],
          ['mask', 'noun', 'מסכה', '🎭', 'He is painting a funny mask for the party.', 'הוא מצייר מסכה מצחיקה למסיבה.'],
          ['neighbor', 'noun', 'שכן / שכנה', '🏘️', 'We bring a basket of treats to our neighbor.', 'אנחנו מביאים סלסלת ממתקים לשכנה שלנו.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'uniform', translationHe: 'מדים' },
            { wordEn: 'stranger', translationHe: 'אדם זר' },
          ],
          shortSentenceEn: 'My sister wants a pirate costume.',
          shortSentenceHe: 'אחותי רוצה תחפושת של פיראטית.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'I know the words of this Purim song.',
            wrong: ['I am knowing the words of this Purim song.', 'I knows the words of this Purim song.'],
            explainHe: 'know הוא פועל מצב, ולכן לא מוסיפים לו ing. עם I הפועל נשאר בלי s.',
            hintHe: 'לדעת משהו זה מצב, לא פעולה שקורה עכשיו. ועם I, מה קורה לסוף הפועל?',
          },
          story: {
            passageEn:
              'On Tu BiShvat, the almond trees are in blossom and many classes plant young trees. A few weeks later, the streets are full of costumes for Purim. Children give baskets of sweets to their friends and neighbors. This year, Yonatan is wearing a robot costume. He needs help with his giant cardboard arms!',
            passageHe:
              'בט״ו בשבט עצי השקד פורחים וכיתות רבות שותלות עצים צעירים. כמה שבועות אחר כך, הרחובות מלאים בתחפושות לפורים. ילדים נותנים סלסלות ממתקים לחברים ולשכנים שלהם. השנה יונתן לובש תחפושת של רובוט. הוא צריך עזרה עם הזרועות הענקיות שלו מקרטון!',
            questionEn: 'What does Yonatan need help with?',
            questionHe: 'במה יונתן צריך עזרה?',
            correct: 'His giant cardboard arms.',
            wrong: ['Planting a young tree.', 'Baking sweets for the neighbors.'],
          },
        },
      },
      {
        icon: '🎆',
        titleEn: 'Freedom, Flags & a Big Picnic',
        titleHe: 'חירות, דגלים ופיקניק גדול',
        storyHookHe:
          'פסח, יום העצמאות ושבועות! נבחין בין מה שמשפחות עושות בכל שנה לבין מה שקורה עכשיו בחגיגה.',
        grammarTopic: 'Present Simple vs. Present Progressive in Spring Holidays',
        skills: ['Simple vs. Progressive', 'Spring Holidays', 'Speaking About Celebrations'],
        sentenceEn: 'Every Independence Day we have a picnic, and right now Dad is hanging a flag.',
        sentenceHe: 'בכל יום עצמאות אנחנו עושים פיקניק, וממש עכשיו אבא תולה דגל.',
        vocab: [
          ['freedom', 'noun', 'חירות / חופש', '🕊️', 'Passover is the holiday of freedom.', 'פסח הוא חג החירות.'],
          ['flag', 'noun', 'דגל', '🏳️', 'There is a blue and white flag on every balcony.', 'יש דגל כחול-לבן על כל מרפסת.'],
          ['picnic', 'noun', 'פיקניק', '🧺', 'Our class has a picnic in the park every spring.', 'הכיתה שלנו עושה פיקניק בפארק בכל אביב.'],
          ['fireworks', 'noun', 'זיקוקים', '🎆', 'The fireworks light up the sky over the city.', 'הזיקוקים מאירים את השמיים מעל העיר.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'prison', translationHe: 'כלא' },
            { wordEn: 'umbrella', translationHe: 'מטרייה' },
          ],
          shortSentenceEn: 'Dad is hanging a flag.',
          shortSentenceHe: 'אבא תולה דגל.',
          rule: {
            questionEn: 'Complete the sentence: "On Shavuot, many people ____ cheesecake."',
            correct: 'eat',
            wrong: ['are eating', 'eats'],
            explainHe:
              'On Shavuot מראה מסורת שחוזרת בכל שנה, ולכן Present Simple. many people הם רבים, ולכן eat בלי s.',
            hintHe: 'האם המשפט מתאר מה קורה כרגע, או מה עושים בכל שנה בחג? והנושא הוא רבים.',
          },
          story: {
            passageEn:
              'Spring is a busy time for holidays in Israel. On Passover, families sit together at the Seder and tell the story of freedom. A few weeks later, people celebrate Independence Day with flags, picnics and fireworks. Then on Shavuot, children wear white clothes and bring baskets of fruit to kindergarten.',
            passageHe:
              'האביב הוא תקופה עמוסה בחגים בישראל. בפסח משפחות יושבות יחד בליל הסדר ומספרות את סיפור החירות. כמה שבועות אחר כך, אנשים חוגגים את יום העצמאות עם דגלים, פיקניקים וזיקוקים. ואז בשבועות, ילדים לובשים בגדים לבנים ומביאים סלסלות פירות לגן.',
            questionEn: 'What do children wear on Shavuot?',
            questionHe: 'מה ילדים לובשים בשבועות?',
            correct: 'White clothes.',
            wrong: ['Purim costumes.', 'Blue raincoats.'],
          },
        },
      },
      {
        icon: '🏖️',
        isBoss: true,
        titleEn: 'Boss: Hello, Summer Vacation!',
        titleHe: 'אתגר הבוס: שלום, חופש גדול!',
        storyHookHe:
          'משימת הסיכום של חגיגות האביב והקיץ! קראו על החופש הגדול והראו שליטה בהרגלים, בפעולות של עכשיו ובפעלי מצב.',
        grammarTopic: 'Boss: Present Simple, Present Progressive & Stative Verbs Review',
        skills: ['Boss Unseen', 'Tenses Review', 'Summer Vocab'],
        sentenceEn: 'During the summer vacation, I usually relax at the beach with my friends.',
        sentenceHe: 'בחופש הגדול אני בדרך כלל נח/ה בחוף הים עם החברים שלי.',
        vocab: [
          ['vacation', 'noun', 'חופשה', '🏖️', 'Our summer vacation starts at the end of June.', 'החופש הגדול שלנו מתחיל בסוף יוני.'],
          ['relax', 'verb', 'לנוח / להירגע', '😌', 'My parents relax in the garden after work.', 'ההורים שלי נחים בגינה אחרי העבודה.'],
          ['sunscreen', 'noun', 'קרם הגנה', '🧴', 'Put on sunscreen before you go to the pool.', 'שימו קרם הגנה לפני שאתם הולכים לבריכה.'],
          ['memory', 'noun', 'זיכרון', '📷', 'The camp gave me a happy memory.', 'המחנה נתן לי זיכרון שמח.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'homework', translationHe: 'שיעורי בית' },
            { wordEn: 'rush', translationHe: 'למהר' },
          ],
          shortSentenceEn: 'I relax at the beach.',
          shortSentenceHe: 'אני נח/ה בחוף הים.',
          rule: {
            questionEn: 'Complete the sentence: "Shh! Gal ____ in the hammock right now."',
            correct: 'is sleeping',
            wrong: ['sleeps', 'are sleeping'],
            explainHe: 'right now מראה פעולה שקורה ממש עכשיו. Gal הוא אדם אחד, ולכן is sleeping.',
            hintHe: 'Shh! ו-right now מראים שזה קורה ברגע זה. גל הוא אדם אחד: איזה פועל עזר מתאים?',
          },
          story: {
            passageEn:
              'The last day of school is always exciting. Most students want to sleep late and spend time with their friends. This summer, Talia is working as a helper at a day camp near the sea. Every morning she puts sunscreen on the little kids. She believes this summer is her best vacation so far.',
            passageHe:
              'היום האחרון של הלימודים תמיד מרגש. רוב התלמידים רוצים לישון עד מאוחר ולבלות עם החברים שלהם. בקיץ הזה טליה עובדת כמדריכה בקייטנה ליד הים. בכל בוקר היא מורחת קרם הגנה על הילדים הקטנים. היא מאמינה שהקיץ הזה הוא החופשה הכי טובה שלה עד עכשיו.',
            questionEn: 'What does Talia do every morning at the camp?',
            questionHe: 'מה טליה עושה בכל בוקר בקייטנה?',
            correct: 'She puts sunscreen on the little kids.',
            wrong: ['She swims across the bay.', 'She sleeps late in her tent.'],
          },
        },
      },
    ],
  },
];

export const HOLIDAYS_GRADE_7_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildMiddleSchoolGrade('grade-7', UNITS);
