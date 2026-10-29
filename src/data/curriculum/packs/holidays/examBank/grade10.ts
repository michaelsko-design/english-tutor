import type { ExamBankPack } from '../../../examBank/types';

/**
 * The holidays pack's grade 10 exam bank (Feature 43), by the unit number in its mission ids.
 * Review-level grammar (the passive, relative clauses, grade 9's conditionals and Present Perfect)
 * with holiday words. The last 2 items of each list and the second passage are for the mock exam.
 */
export const HOLIDAYS_GRADE_10_EXAM_BANK: ExamBankPack = {
  // Autumn and winter: passive (present and past) and relative clauses
  31: {
    vocabulary: [
      {
        clozeEn: 'Lighting candles on Friday evening is an old ____ in our family.',
        clozeHe: 'הדלקת נרות ביום שישי בערב היא מנהג ותיק במשפחה שלנו.',
        answer: 'custom',
        wrong: ['reservoir', 'foliage'],
      },
      {
        clozeEn: 'In many cultures, the colour white is used to ____ peace.',
        clozeHe: 'בתרבויות רבות משתמשים בצבע הלבן כדי לסמל שלום.',
        answer: 'symbolize',
        wrong: ['hospitality', 'festive'],
      },
      {
        clozeEn: 'The streets look ____ in December, with lights in every window.',
        clozeHe: 'הרחובות נראים חגיגיים בדצמבר, עם אורות בכל חלון.',
        answer: 'festive',
        wrong: ['apology', 'abundance'],
      },
      {
        clozeEn: 'The farmers stayed in a wooden ____ during the olive season.',
        clozeHe: 'החקלאים נשארו בצריף עץ בעונת המסיק.',
        answer: 'hut',
        wrong: ['precipitation', 'commemorate'],
      },
      {
        clozeEn: 'This year the ____ was below average, so water must be saved.',
        clozeHe: 'השנה המשקעים היו מתחת לממוצע, ולכן צריך לחסוך במים.',
        answer: 'precipitation',
        wrong: ['hospitality', 'custom'],
      },
      {
        clozeEn: 'Bright lanterns ____ the path to the sukkah.',
        clozeHe: 'פנסים בהירים מאירים את השביל לסוכה.',
        answer: 'illuminate',
        wrong: ['apology', 'abundance'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "Many sukkot _______ with paper chains and fruit."',
        correct: 'are decorated',
        wrong: ['are decorate', 'is decorated'],
        explainHe: 'sukkot ברבים, ולכן are, ואחריו V3: decorated.',
        hintHe: 'בדקו את מספר הנושא ואת צורת הפועל שבאה אחרי be בסביל.',
      },
      {
        questionEn: 'Complete the sentence: "The first Hanukkah candle _______ last night at sunset."',
        correct: 'was lit',
        wrong: ['is lit', 'was light'],
        explainHe: 'last night הוא זמן בעבר, ולכן סביל בעבר: was + V3 (lit).',
        hintHe: 'יש במשפט זמן בעבר. בדקו את צורת be ואת צורת הפועל שאחריה.',
      },
      {
        questionEn: 'Choose the correct sentence:',
        correct: 'The woman who organised the holiday dinner is my aunt.',
        wrong: [
          'The woman which organised the holiday dinner is my aunt.',
          'The woman whose organised the holiday dinner is my aunt.',
        ],
        explainHe: 'who מתאר אנשים. which מתאים לדברים, ו-whose מראה שייכות ובא לפני שם עצם.',
        hintHe: 'הפסוקית מתארת אדם, ואחרי מילת הזיקה בא פועל. איזו מילה מתאימה?',
      },
      {
        questionEn: 'Complete the sentence: "Eilat, _______ gets very little rain, is warm even in winter."',
        correct: 'which',
        wrong: ['that', 'who'],
        explainHe: 'פסוקית בין פסיקים על מקום: which. אחרי פסיק לא משתמשים ב-that.',
        hintHe: 'הפסוקית בין פסיקים ומתארת מקום. איזו מילת זיקה מתאימה לדברים ולמקומות וגם באה אחרי פסיק?',
      },
      {
        questionEn: 'Complete the sentence: "The family _______ house we visited on Sukkot has a huge garden."',
        correct: 'whose',
        wrong: ['who', 'which'],
        explainHe: 'הבית שייך למשפחה, ולכן whose.',
        hintHe: 'אחרי החסר בא שם עצם ששייך למשפחה. איזו מילת זיקה מראה שייכות?',
      },
      {
        questionEn: 'Choose the correct sentence:',
        correct: 'The new reservoir, which was built last year, is already full.',
        wrong: [
          'The new reservoir, that was built last year, is already full.',
          'The new reservoir, which built last year, is already full.',
        ],
        explainHe: 'אחרי פסיק משתמשים ב-which ולא ב-that, ובסביל בעבר צריך להגיד was + V3.',
        hintHe: 'בדקו שני דברים: איזו מילת זיקה באה אחרי פסיק, והאם יש פועל עזר במבנה הסביל.',
      },
    ],
    sentences: [
      { en: 'Round challot are baked for Rosh Hashana.', he: 'אופים חלות עגולות לראש השנה.' },
      { en: 'The sukkah that we built last year was bigger.', he: 'הסוכה שבנינו בשנה שעברה הייתה גדולה יותר.' },
      { en: 'Our guests, who came from Paris, loved the holiday food.', he: 'האורחים שלנו, שהגיעו מפריז, אהבו את אוכל החג.' },
      { en: 'The streets were flooded after the first winter storm.', he: 'הרחובות הוצפו אחרי סופת החורף הראשונה.' },
      { en: 'Doughnuts are sold in every bakery during Hanukkah.', he: 'בחנוכה מוכרים סופגניות בכל מאפייה.' },
      { en: 'If it rained more, the Kinneret would be full.', he: 'אילו ירד יותר גשם, הכנרת הייתה מלאה.' },
    ],
    passages: [
      {
        passageEn:
          'In the town of Zichron Ya’akov, a giant sukkah is built every year in the main square. The walls are decorated by local children, and the roof is covered with palm branches. Visitors who come during the holiday are offered free coffee and cake. The sukkah, which can hold two hundred people, is taken down a week after the holiday.',
        passageHe:
          'בזכרון יעקב בונים בכל שנה סוכת ענק בכיכר המרכזית. את הקירות מקשטים ילדי המקום, והגג מכוסה בענפי דקל. למבקרים שמגיעים בזמן החג מציעים קפה ועוגה בחינם. הסוכה, שיכולים לשבת בה מאתיים איש, מפורקת שבוע אחרי החג.',
        questions: [
          {
            questionEn: 'Who decorates the walls of the sukkah?',
            questionHe: 'מי מקשט את קירות הסוכה?',
            correct: 'Local children.',
            wrong: ['Professional artists.', 'The town council.'],
          },
          {
            questionEn: 'What are visitors offered?',
            questionHe: 'מה מציעים למבקרים?',
            correct: 'Free coffee and cake.',
            wrong: ['Free tickets to a concert.', 'Small palm trees.'],
          },
          {
            questionEn: 'How many people can the sukkah hold?',
            questionHe: 'כמה אנשים יכולים לשבת בסוכה?',
            correct: 'Two hundred people.',
            wrong: ['Fifty people.', 'One thousand people.'],
          },
        ],
      },
      {
        passageEn:
          'Hanukkah is celebrated for eight nights in December. In many cities, giant menorahs are placed in public squares. In Jerusalem, a special walking tour is offered, which takes visitors to the windows of old houses. In these windows, candles were lit by families more than a hundred years ago. The tour, which is very popular with teenagers, ends with hot doughnuts.',
        passageHe:
          'את חנוכה חוגגים במשך שמונה לילות בדצמבר. בערים רבות מציבים חנוכיות ענק בכיכרות. בירושלים מציעים סיור רגלי מיוחד, שלוקח את המבקרים לחלונות של בתים ישנים. בחלונות האלה משפחות הדליקו נרות לפני יותר ממאה שנה. הסיור, שפופולרי מאוד בקרב בני נוער, מסתיים בסופגניות חמות.',
        questions: [
          {
            questionEn: 'Where are giant menorahs placed?',
            questionHe: 'איפה מציבים חנוכיות ענק?',
            correct: 'In public squares.',
            wrong: ['On the roofs of schools.', 'Along the beach.'],
          },
          {
            questionEn: 'Where does the walking tour take visitors?',
            questionHe: 'לאן לוקח הסיור הרגלי את המבקרים?',
            correct: 'To the windows of old houses.',
            wrong: ['To a candle factory.', 'To the top of a tower.'],
          },
          {
            questionEn: 'How does the tour end?',
            questionHe: 'איך מסתיים הסיור?',
            correct: 'With hot doughnuts.',
            wrong: ['With a short film.', 'With a concert.'],
          },
        ],
      },
    ],
  },
  // Spring and summer: passive, relative clauses, Second Conditional, Present Perfect
  32: {
    vocabulary: [
      {
        clozeEn: 'The ____ was carried by a runner at the opening of the games.',
        clozeHe: 'הלפיד נישא על ידי רץ בפתיחת המשחקים.',
        answer: 'torch',
        wrong: ['heritage', 'charity'],
      },
      {
        clozeEn: 'Before the game, both teams stood for the ____.',
        clozeHe: 'לפני המשחק שתי הקבוצות נעמדו לשירת ההמנון.',
        answer: 'anthem',
        wrong: ['seedling', 'excursion'],
      },
      {
        clozeEn: 'Old songs and recipes are an important part of every family’s ____.',
        clozeHe: 'שירים ומתכונים ישנים הם חלק חשוב מהמורשת של כל משפחה.',
        answer: 'heritage',
        wrong: ['heatwave', 'torch'],
      },
      {
        clozeEn: 'Modern ____ uses drones to check the fields.',
        clozeHe: 'החקלאות המודרנית משתמשת ברחפנים כדי לבדוק את השדות.',
        answer: 'agriculture',
        wrong: ['masquerade', 'anthem'],
      },
      {
        clozeEn: 'Stay indoors in the afternoon during a ____.',
        clozeHe: 'הישארו בבית אחר הצהריים בזמן גל חום.',
        answer: 'heatwave',
        wrong: ['liberation', 'seedling'],
      },
      {
        clozeEn: 'Our class organised a book sale for ____.',
        clozeHe: 'הכיתה שלנו ארגנה מכירת ספרים למטרות צדקה.',
        answer: 'charity',
        wrong: ['exodus', 'parade'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "Hundreds of trees _______ in the new park last Tu BiShvat."',
        correct: 'were planted',
        wrong: ['are planted', 'were plant'],
        explainHe: 'last Tu BiShvat הוא זמן בעבר והנושא ברבים, ולכן were + V3.',
        hintHe: 'יש זמן בעבר והנושא ברבים. בדקו את צורת be ואת צורת הפועל שאחריה.',
      },
      {
        questionEn: 'Complete the sentence: "The Haggadah _______ in many languages today."',
        correct: 'is printed',
        wrong: ['prints', 'is print'],
        explainHe: 'ההגדה לא מדפיסה, אלא מדפיסים אותה: סביל בהווה is + V3.',
        hintHe: 'הנושא לא עושה את הפעולה בעצמו. בדקו גם את צורת הפועל אחרי פועל העזר.',
      },
      {
        questionEn: 'Choose the correct sentence:',
        correct: 'The dancers who marched in the parade waved to the crowd.',
        wrong: [
          'The dancers which marched in the parade waved to the crowd.',
          'The dancers whose marched in the parade waved to the crowd.',
        ],
        explainHe: 'dancers הם אנשים, ואחרי מילת הזיקה בא פועל, ולכן who.',
        hintHe: 'המשפט מתאר אנשים שעשו פעולה. איזו מילת זיקה מתאימה לאנשים כשאחריה בא פועל?',
      },
      {
        questionEn: 'Complete the sentence: "Shavuot, _______ is also called the Festival of the First Fruits, comes in early summer."',
        correct: 'which',
        wrong: ['that', 'who'],
        explainHe: 'פסוקית בין פסיקים על דבר (חג): which, ולא that.',
        hintHe: 'יש כאן פסוקית בין פסיקים על חג. איזו מילת זיקה מתאימה לדברים וגם באה אחרי פסיק?',
      },
      {
        questionEn: 'Choose the correct sentence:',
        correct: 'If I lived on a kibbutz, I would help with the harvest every summer.',
        wrong: [
          'If I live on a kibbutz, I would help with the harvest every summer.',
          'If I lived on a kibbutz, I will help with the harvest every summer.',
        ],
        explainHe: 'תנאי שני: if + Past Simple (lived), ובתוצאה would + פועל בסיס.',
        hintHe: 'זה מצב דמיוני. בדקו את הזמן אחרי if ואת פועל העזר בחלק השני.',
      },
      {
        questionEn: 'Complete the sentence: "Our family _______ a picnic on Independence Day since I was born."',
        correct: 'has had',
        wrong: ['has', 'had had'],
        explainHe: 'since I was born: זה התחיל בעבר ונמשך עד היום, ולכן Present Perfect: has had.',
        hintHe: 'יש במשפט since ונקודת התחלה בעבר. איזה זמן מחבר בין העבר להווה?',
      },
    ],
    sentences: [
      { en: 'Thousands of flags are sold before Independence Day.', he: 'לפני יום העצמאות מוכרים אלפי דגלים.' },
      { en: 'The matzah that we ate was baked in Bnei Brak.', he: 'המצה שאכלנו נאפתה בבני ברק.' },
      { en: 'The parade was watched by thousands of families.', he: 'אלפי משפחות צפו בתהלוכה.' },
      { en: 'My grandmother, who grew up on a farm, loves Shavuot.', he: 'סבתא שלי, שגדלה בחווה, אוהבת את שבועות.' },
      { en: 'If we had a boat, we would sail to Cyprus.', he: 'אילו הייתה לנו סירה, היינו מפליגים לקפריסין.' },
      { en: 'Our school has held a Purim party since 1995.', he: 'בית הספר שלנו עורך מסיבת פורים מאז 1995.' },
    ],
    passages: [
      {
        passageEn:
          'Every spring, a large Passover market is held in the old city of Akko. Matzah, spices and new dishes are sold at dozens of colourful stalls. Many of the sellers are families whose grandparents opened the same stalls decades ago. On the last day before the holiday, the market is so crowded that it is closed to cars. Visitors who arrive early usually find the best prices.',
        passageHe:
          'בכל אביב נערך שוק פסח גדול בעיר העתיקה של עכו. מצות, תבלינים וכלים חדשים נמכרים בעשרות דוכנים צבעוניים. רבים מהמוכרים הם משפחות שהסבים והסבתות שלהן פתחו את אותם דוכנים לפני עשרות שנים. ביום האחרון לפני החג השוק עמוס כל כך שהוא נסגר לרכבים. מבקרים שמגיעים מוקדם בדרך כלל מוצאים את המחירים הטובים ביותר.',
        questions: [
          {
            questionEn: 'Where is the Passover market held?',
            questionHe: 'איפה נערך שוק הפסח?',
            correct: 'In the old city of Akko.',
            wrong: ['In the centre of Tel Aviv.', 'Near the beach in Netanya.'],
          },
          {
            questionEn: 'Who opened many of the stalls decades ago?',
            questionHe: 'מי פתח רבים מהדוכנים לפני עשרות שנים?',
            correct: 'The grandparents of today’s sellers.',
            wrong: ['A group of tourists.', 'The city council.'],
          },
          {
            questionEn: 'Who usually finds the best prices?',
            questionHe: 'מי בדרך כלל מוצא את המחירים הטובים ביותר?',
            correct: 'Visitors who arrive early.',
            wrong: ['Visitors who come at night.', 'Families with many children.'],
          },
        ],
      },
      {
        passageEn:
          'In the summer, many Israeli teenagers join excursions to national parks. One of the most popular sites is Tel Megiddo, which was built more than five thousand years ago. Its ancient water system, which was dug through solid rock, is still visited by thousands of people. Guides recommend starting the tour early, because a heatwave can make the afternoon dangerous. If the park opened at night, many visitors would prefer to come then.',
        passageHe:
          'בקיץ בני נוער ישראלים רבים מצטרפים לטיולים בגנים לאומיים. אחד האתרים הפופולריים ביותר הוא תל מגידו, שנבנה לפני יותר מחמשת אלפים שנה. מערכת המים העתיקה שלו, שנחצבה בסלע, עדיין מושכת אלפי מבקרים. המדריכים ממליצים להתחיל את הסיור מוקדם, כי גל חום עלול להפוך את אחר הצהריים למסוכן. אילו הגן היה פתוח בלילה, מבקרים רבים היו מעדיפים לבוא אז.',
        questions: [
          {
            questionEn: 'When was Tel Megiddo built?',
            questionHe: 'מתי נבנה תל מגידו?',
            correct: 'More than five thousand years ago.',
            wrong: ['About two hundred years ago.', 'Less than a thousand years ago.'],
          },
          {
            questionEn: 'What was dug through solid rock?',
            questionHe: 'מה נחצב בסלע?',
            correct: 'An ancient water system.',
            wrong: ['A road for cars.', 'A tunnel for trains.'],
          },
          {
            questionEn: 'Why do guides recommend starting early?',
            questionHe: 'למה המדריכים ממליצים להתחיל מוקדם?',
            correct: 'Because a heatwave can make the afternoon dangerous.',
            wrong: ['Because the park closes at noon.', 'Because the tickets are cheaper in the morning.'],
          },
        ],
      },
    ],
  },
};
