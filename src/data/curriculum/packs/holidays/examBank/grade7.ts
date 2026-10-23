import type { ExamBankPack } from '../../../examBank/types';

/**
 * Holidays pack, grade 7 exam bank (Feature 43), by the unit number in the mission ids. New
 * questions only, at review level (Present Simple, Present Progressive, stative verbs). The last
 * 2 items of each list and the second passage are for the mock exam.
 */
export const HOLIDAYS_GRADE_7_EXAM_BANK: ExamBankPack = {
  // Unit 31: autumn and winter holidays
  31: {
    vocabulary: [
      {
        clozeEn: 'Bees make sweet ____ from the flowers in the field.',
        clozeHe: 'דבורים מכינות דבש מתוק מהפרחים בשדה.',
        answer: 'honey',
        wrong: ['puddle', 'storm'],
      },
      {
        clozeEn: 'In our family, lighting a fire on the beach every winter is a ____.',
        clozeHe: 'במשפחה שלנו, להדליק מדורה על החוף בכל חורף זו מסורת.',
        answer: 'tradition',
        wrong: ['blanket', 'flame'],
      },
      {
        clozeEn: 'Farmers work very hard during the olive ____ in the autumn.',
        clozeHe: 'חקלאים עובדים קשה מאוד בזמן מסיק הזיתים בסתיו.',
        answer: 'harvest',
        wrong: ['doughnut', 'cozy'],
      },
      {
        clozeEn: 'The baker fills each ____ with chocolate or vanilla cream.',
        clozeHe: 'האופה ממלא כל סופגנייה בקרם שוקולד או וניל.',
        answer: 'doughnut',
        wrong: ['candle', 'storm'],
      },
      {
        clozeEn: 'Don’t step in that ____! Your new shoes will get wet.',
        clozeHe: 'אל תדרכו בשלולית הזאת! הנעליים החדשות שלכם יירטבו.',
        answer: 'puddle',
        wrong: ['honey', 'tradition'],
      },
      {
        clozeEn: 'On cold nights, my cat sleeps on a soft wool ____.',
        clozeHe: 'בלילות קרים, החתול שלי ישן על שמיכת צמר רכה.',
        answer: 'blanket',
        wrong: ['harvest', 'gather'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "My aunt ____ a round challah for Rosh Hashana every year."',
        correct: 'bakes',
        wrong: ['bake', 'is bake'],
        explainHe: 'every year מראה מסורת, ו-my aunt היא she, ולכן Present Simple עם s: bakes.',
        hintHe: 'מדובר בהרגל של כל שנה. הדודה היא she: מה קורה לסוף הפועל?',
      },
      {
        questionEn: 'Complete the sentence: "Be quiet! Grandpa ____ the blessing now."',
        correct: 'is saying',
        wrong: ['says', 'are saying'],
        explainHe: 'now מראה פעולה שקורית ממש עכשיו, ו-Grandpa הוא אדם אחד, ולכן is saying.',
        hintHe: 'זה קורה ממש ברגע זה. סבא הוא אדם אחד: איזה פועל עזר מתאים לו?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We don’t usually sleep in the sukkah.',
        wrong: ['We doesn’t usually sleep in the sukkah.', 'We don’t usually sleeping in the sukkah.'],
        explainHe: 'עם we השלילה היא don’t, והפועל אחריה בצורת הבסיס.',
        hintHe: 'בדקו את פועל העזר בשלילה שמתאים ל-we, ואת צורת הפועל אחריו.',
      },
      {
        questionEn: 'Complete the question: "____ your family eat latkes on Hanukkah?"',
        correct: 'Does',
        wrong: ['Do', 'Is'],
        explainHe: 'your family היא it (משפחה אחת), ולכן שואלים עם Does.',
        hintHe: 'המשפחה היא קבוצה אחת, כמו it. איזה פועל עזר שואל על it ב-Present Simple?',
      },
      {
        questionEn: 'Complete the sentence: "It’s cold today, and the children ____ coats."',
        correct: 'are wearing',
        wrong: ['is wearing', 'wears'],
        explainHe: 'today מדבר על עכשיו, ו-the children הם רבים, ולכן are wearing.',
        hintHe: 'מדובר במה שקורה היום, והילדים הם רבים. איזה פועל עזר מתאים להם?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I remember the smell of Grandma’s kitchen on holidays.',
        wrong: ['I am remembering the smell of Grandma’s kitchen on holidays.', 'I remembers the smell of Grandma’s kitchen on holidays.'],
        explainHe: 'remember הוא פועל מצב, ולכן לא מוסיפים לו ing. עם I הוא בלי s.',
        hintHe: 'לזכור זה מצב ולא פעולה. ועם I, האם מוסיפים משהו לסוף הפועל?',
      },
    ],
    sentences: [
      { en: 'We eat apples and honey on Rosh Hashana.', he: 'אנחנו אוכלים תפוח בדבש בראש השנה.' },
      { en: 'My cousins are decorating the sukkah right now.', he: 'בני הדודים שלי מקשטים את הסוכה ממש עכשיו.' },
      { en: 'The first rain usually comes in October.', he: 'הגשם הראשון מגיע בדרך כלל באוקטובר.' },
      { en: 'Look, the candles are burning in every window!', he: 'תראו, הנרות דולקים בכל חלון!' },
      { en: 'My grandmother fries doughnuts every Hanukkah.', he: 'סבתא שלי מטגנת סופגניות בכל חנוכה.' },
      { en: 'We are drinking hot tea under a warm blanket.', he: 'אנחנו שותים תה חם מתחת לשמיכה חמה.' },
    ],
    passages: [
      {
        passageEn:
          'Sukkot is a happy autumn holiday in Israel. Many families build a sukkah on their balcony or in the yard. Children make decorations from paper and hang fruit from the roof. This year, Avi’s class is building a big sukkah in the schoolyard. The students are eating their lunch there every day this week.',
        passageHe:
          'סוכות הוא חג סתיו שמח בישראל. משפחות רבות בונות סוכה במרפסת או בחצר. ילדים מכינים קישוטים מנייר ותולים פירות מהגג. השנה הכיתה של אבי בונה סוכה גדולה בחצר בית הספר. התלמידים אוכלים שם את ארוחת הצהריים שלהם בכל יום השבוע.',
        questions: [
          {
            questionEn: 'Where do many families build a sukkah?',
            questionHe: 'איפה משפחות רבות בונות סוכה?',
            correct: 'On their balcony or in the yard.',
            wrong: ['On the roof of the school.', 'In the forest near the city.'],
          },
          {
            questionEn: 'What do children make from paper?',
            questionHe: 'מה ילדים מכינים מנייר?',
            correct: 'Decorations.',
            wrong: ['Hats.', 'Boats.'],
          },
          {
            questionEn: 'Where are Avi’s classmates eating lunch this week?',
            questionHe: 'איפה חברי הכיתה של אבי אוכלים צהריים השבוע?',
            correct: 'In the big sukkah in the schoolyard.',
            wrong: ['In the school dining room.', 'At Avi’s house.'],
          },
        ],
      },
      {
        passageEn:
          'It is a rainy evening in Jerusalem, and it is the last night of Hanukkah. Lia’s family is standing near the window with eight bright candles. Her father is playing the guitar, and everyone is singing. Lia loves this night more than any other night of the year. Outside, the streets are wet, but inside the house is warm.',
        passageHe:
          'זה ערב גשום בירושלים, וזה הלילה האחרון של חנוכה. המשפחה של ליה עומדת ליד החלון עם שמונה נרות בהירים. אבא שלה מנגן בגיטרה, וכולם שרים. ליה אוהבת את הלילה הזה יותר מכל לילה אחר בשנה. בחוץ הרחובות רטובים, אבל בפנים הבית חם.',
        questions: [
          {
            questionEn: 'Which night of Hanukkah is it?',
            questionHe: 'איזה לילה של חנוכה זה?',
            correct: 'The last night.',
            wrong: ['The first night.', 'The third night.'],
          },
          {
            questionEn: 'What is Lia’s father doing?',
            questionHe: 'מה אבא של ליה עושה?',
            correct: 'He is playing the guitar.',
            wrong: ['He is frying doughnuts.', 'He is cleaning the window.'],
          },
          {
            questionEn: 'What are the streets like outside?',
            questionHe: 'איך נראים הרחובות בחוץ?',
            correct: 'They are wet.',
            wrong: ['They are full of snow.', 'They are dry and sunny.'],
          },
        ],
      },
    ],
  },
  // Unit 32: spring and summer celebrations
  32: {
    vocabulary: [
      {
        clozeEn: 'For Purim, Eli is wearing a dinosaur ____ with a long green tail.',
        clozeHe: 'לפורים, אלי לובש תחפושת של דינוזאור עם זנב ירוק וארוך.',
        answer: 'costume',
        wrong: ['flag', 'freedom'],
      },
      {
        clozeEn: 'The pink ____ on the trees tells us that spring is here.',
        clozeHe: 'הפריחה הוורודה על העצים מספרת לנו שהאביב הגיע.',
        answer: 'blossom',
        wrong: ['sunscreen', 'neighbor'],
      },
      {
        clozeEn: 'Our ____ next door always waters our plants when we travel.',
        clozeHe: 'השכנה שלנו מהדלת הסמוכה תמיד משקה את הצמחים שלנו כשאנחנו נוסעים.',
        answer: 'neighbor',
        wrong: ['picnic', 'mask'],
      },
      {
        clozeEn: 'Birds fly out of the cage and enjoy their ____.',
        clozeHe: 'ציפורים עפות מהכלוב ונהנות מהחופש שלהן.',
        answer: 'freedom',
        wrong: ['costume', 'memory'],
      },
      {
        clozeEn: 'After a long year of school, I just want to ____ in a hammock.',
        clozeHe: 'אחרי שנת לימודים ארוכה, אני רק רוצה לנוח בערסל.',
        answer: 'relax',
        wrong: ['flag', 'blossom'],
      },
      {
        clozeEn: 'My best ____ from the summer is the night we saw shooting stars.',
        clozeHe: 'הזיכרון הכי טוב שלי מהקיץ הוא הלילה שבו ראינו כוכבים נופלים.',
        answer: 'memory',
        wrong: ['picnic', 'neighbor'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "My little brother ____ a superhero costume this year."',
        correct: 'wants',
        wrong: ['is wanting', 'want'],
        explainHe: 'want הוא פועל מצב בלי ing, ועם he מוסיפים s: wants.',
        hintHe: 'לרצות זה מצב, לא פעולה. ואח שלי הוא he: מה מוסיפים לפועל?',
      },
      {
        questionEn: 'Complete the sentence: "Look! The students ____ trees in the park."',
        correct: 'are planting',
        wrong: ['plant', 'is planting'],
        explainHe: 'Look! מראה שזה קורה עכשיו, ו-the students הם רבים, ולכן are planting.',
        hintHe: 'הסימן בתחילת המשפט מראה שזה קורה עכשיו. התלמידים הם רבים: איזה פועל עזר מתאים?',
      },
      {
        questionEn: 'Complete the sentence: "On Independence Day, people often ____ in the park."',
        correct: 'have barbecues',
        wrong: ['are having barbecues', 'has barbecues'],
        explainHe: 'often מראה הרגל של כל שנה, ולכן Present Simple. people הם רבים: have.',
        hintHe: 'המילה often מראה מה קורה בכל שנה. והנושא הוא רבים.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'Do you need help with your mask?',
        wrong: ['Are you needing help with your mask?', 'Does you need help with your mask?'],
        explainHe: 'need הוא פועל מצב, ולכן לא ב-ing. עם you שואלים עם Do.',
        hintHe: 'לצטרך זה מצב. ובשאלה עם you, איזה פועל עזר של ההווה מתאים?',
      },
      {
        questionEn: 'Complete the sentence: "Every Passover, my uncle ____ the story of the Exodus."',
        correct: 'reads',
        wrong: ['is reading', 'read'],
        explainHe: 'Every Passover מראה מסורת, ו-my uncle הוא he, ולכן reads.',
        hintHe: 'מדובר במסורת שחוזרת בכל שנה, והדוד הוא he. מה קורה לסוף הפועל?',
      },
      {
        questionEn: 'Complete the sentence: "Right now, we ____ on the beach and eating watermelon."',
        correct: 'are sitting',
        wrong: ['sit', 'is sitting'],
        explainHe: 'Right now מראה שזה קורה עכשיו, ועם we משתמשים ב-are: are sitting.',
        hintHe: 'מדובר ברגע הזה. עם we, איזה פועל עזר מתאים, ואיזו סיומת מקבל הפועל?',
      },
    ],
    sentences: [
      { en: 'We plant young trees on Tu BiShvat.', he: 'אנחנו שותלים עצים צעירים בט״ו בשבט.' },
      { en: 'My sister is painting a mask for Purim.', he: 'אחותי מציירת מסכה לפורים.' },
      { en: 'Do you know the story of Passover?', he: 'אתם מכירים את סיפור פסח?' },
      { en: 'The fireworks start at nine o’clock tonight.', he: 'הזיקוקים מתחילים בתשע הלילה.' },
      { en: 'Children bring baskets of fruit on Shavuot.', he: 'ילדים מביאים סלסלות פירות בשבועות.' },
      { en: 'We are putting on sunscreen before we swim.', he: 'אנחנו מורחים קרם הגנה לפני שאנחנו שוחים.' },
    ],
    passages: [
      {
        passageEn:
          'Purim is one of the happiest holidays in Israel. People wear costumes and give gifts of food to their friends. In many cities, there is a big parade called the Adloyada. This year, Noam and his neighbor are making costumes together. Noam wants to be a pirate, and his neighbor wants to be a rainbow.',
        passageHe:
          'פורים הוא אחד החגים השמחים ביותר בישראל. אנשים לובשים תחפושות ונותנים משלוחי מנות לחברים שלהם. בערים רבות יש מצעד גדול שנקרא עדלאידע. השנה, נועם והשכן שלו מכינים תחפושות ביחד. נועם רוצה להיות פיראט, והשכן שלו רוצה להיות קשת בענן.',
        questions: [
          {
            questionEn: 'What do people give to their friends on Purim?',
            questionHe: 'מה אנשים נותנים לחברים שלהם בפורים?',
            correct: 'Gifts of food.',
            wrong: ['Flowers.', 'Books.'],
          },
          {
            questionEn: 'What is the big parade called?',
            questionHe: 'איך נקרא המצעד הגדול?',
            correct: 'The Adloyada.',
            wrong: ['The Seder.', 'The Harvest.'],
          },
          {
            questionEn: 'What does Noam’s neighbor want to be?',
            questionHe: 'מה השכן של נועם רוצה להיות?',
            correct: 'A rainbow.',
            wrong: ['A pirate.', 'A king.'],
          },
        ],
      },
      {
        passageEn:
          'Summer vacation in Israel starts in July for middle school students. Many teenagers work in day camps or help their parents. Others travel with their families to the north. Right now, Gal is sitting at a campsite near the Jordan River. He is writing in his diary because he wants to remember every moment.',
        passageHe:
          'החופש הגדול בישראל מתחיל ביולי לתלמידי חטיבת הביניים. בני נוער רבים עובדים בקייטנות או עוזרים להורים שלהם. אחרים נוסעים עם המשפחות שלהם לצפון. ממש עכשיו, גל יושב באתר קמפינג ליד נהר הירדן. הוא כותב ביומן שלו כי הוא רוצה לזכור כל רגע.',
        questions: [
          {
            questionEn: 'When does summer vacation start for middle school students?',
            questionHe: 'מתי מתחיל החופש הגדול לתלמידי חטיבת הביניים?',
            correct: 'In July.',
            wrong: ['In June.', 'In August.'],
          },
          {
            questionEn: 'Where is Gal sitting right now?',
            questionHe: 'איפה גל יושב ממש עכשיו?',
            correct: 'At a campsite near the Jordan River.',
            wrong: ['On a beach in Tel Aviv.', 'In his classroom.'],
          },
          {
            questionEn: 'Why is Gal writing in his diary?',
            questionHe: 'מדוע גל כותב ביומן שלו?',
            correct: 'He wants to remember every moment.',
            wrong: ['His teacher asked him to.', 'He is bored at the campsite.'],
          },
        ],
      },
    ],
  },
};
