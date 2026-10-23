import type { ExamBankPack } from '../../../examBank/types';

/**
 * The holidays pack's grade 11 exam bank, by the unit number in its mission ids. New questions only;
 * the last 2 items of each list and the second passage are for the mock exam.
 */
export const HOLIDAYS_GRADE_11_EXAM_BANK: ExamBankPack = {
  // Unit 31: autumn and winter festivals; passive voice, cause and result connectors
  31: {
    vocabulary: [
      {
        clozeEn: 'Grandma split the ____ and gave each of us a handful of red seeds.',
        clozeHe: 'סבתא חצתה את הרימון ונתנה לכל אחד מאיתנו חופן גרעינים אדומים.',
        answer: 'pomegranate',
        wrong: ['downpour', 'gratitude'],
      },
      {
        clozeEn: 'The family moved into a ____ flat while their house was being repaired.',
        clozeHe: 'המשפחה עברה לדירה זמנית בזמן שתיקנו את הבית שלה.',
        answer: 'temporary',
        wrong: ['revolt', 'abundance'],
      },
      {
        clozeEn: 'Street lamps and coloured lights ____ the old city at night.',
        clozeHe: 'פנסי רחוב ואורות צבעוניים מאירים את העיר העתיקה בלילה.',
        answer: 'illuminate',
        wrong: ['reflection', 'reservoir'],
      },
      {
        clozeEn: 'The olive ____ begins in October in the villages of the Galilee.',
        clozeHe: 'מסיק הזיתים מתחיל באוקטובר בכפרי הגליל.',
        answer: 'harvest',
        wrong: ['festive', 'illuminate'],
      },
      {
        clozeEn: 'We wrote cards to the nurses to show our ____ for their care.',
        clozeHe: 'כתבנו כרטיסים לאחיות כדי להראות את הכרת התודה שלנו על הטיפול שלהן.',
        answer: 'gratitude',
        wrong: ['temporary', 'miracle'],
      },
      {
        clozeEn: 'The doctors called her full recovery a medical ____.',
        clozeHe: 'הרופאים קראו להחלמה המלאה שלה נס רפואי.',
        answer: 'miracle',
        wrong: ['pomegranate', 'festive'],
      },
    ],
    grammar: [
      {
        questionEn: 'Choose the correct passive form: "Honey cakes ____ in many homes before Rosh Hashana."',
        correct: 'are baked',
        wrong: ['bake', 'are baking'],
        explainHe: 'העוגות לא אופות, אלא נאפות: סביל בהווה, are + V3.',
        hintHe: 'האם העוגות עושות את הפעולה, או שהפעולה נעשית להן?',
      },
      {
        questionEn: 'Choose the correct passive form: "The first menorah candle ____ last night by my little sister."',
        correct: 'was lit',
        wrong: ['lit', 'is lit'],
        explainHe: 'last night מראה עבר, והנר הוא מקבל הפעולה: was + V3.',
        hintHe: 'מצאו את מילת הזמן במשפט, ובדקו מי עשה את הפעולה ומי קיבל אותה.',
      },
      {
        questionEn: 'Choose the correct connector: "The ceremony was moved indoors ____ the downpour."',
        correct: 'due to',
        wrong: ['since', 'therefore'],
        explainHe: 'the downpour הוא שם עצם, ולכן due to. since בא לפני משפט שלם.',
        hintHe: 'מה בא אחרי החסר: שם עצם או משפט שלם עם פועל?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'Winter was very dry; as a result, the farmers were worried.',
        wrong: [
          'Winter was very dry; because of, the farmers were worried.',
          'Winter was very dry; due to, the farmers were worried.',
        ],
        explainHe: 'as a result פותח תוצאה ובא לבד, עם פסיק אחריו. because of ו-due to צריכים שם עצם אחריהם.',
        hintHe: 'אחרי החיבור בא פסיק ולא שם עצם. איזה ביטוי יכול לעמוד לבד ולפתוח תוצאה?',
      },
      {
        questionEn: 'Change to the passive: "People eat doughnuts all over Israel during Hanukkah."',
        correct: 'Doughnuts are eaten all over Israel during Hanukkah.',
        wrong: [
          'Doughnuts eat all over Israel during Hanukkah.',
          'Doughnuts were eating all over Israel during Hanukkah.',
        ],
        explainHe: 'המשפט המקורי בהווה, ולכן בסביל: are + V3 (are eaten).',
        hintHe: 'בדקו באיזה זמן המשפט המקורי, ואיזו צורה של הפועל באה אחרי be בסביל.',
      },
      {
        questionEn: 'Choose the correct connector: "____ it rained all night, the football match was postponed."',
        correct: 'Because',
        wrong: ['Because of', 'As a result'],
        explainHe: 'אחרי החסר בא משפט שלם (it rained all night), ולכן Because.',
        hintHe: 'האם אחרי החסר יש נושא ופועל? ואיזה חלק במשפט הוא הסיבה?',
      },
    ],
    sentences: [
      { en: 'Apples dipped in honey are served on the festive table.', he: 'תפוחים טבולים בדבש מוגשים על השולחן החגיגי.' },
      { en: 'The streets were flooded because of the first winter storm.', he: 'הרחובות הוצפו בגלל סערת החורף הראשונה.' },
      { en: 'Our sukkah was built in only two hours this year.', he: 'השנה הסוכה שלנו נבנתה בשעתיים בלבד.' },
      { en: 'Due to the cold, we lit the candles inside.', he: 'בגלל הקור, הדלקנו את הנרות בפנים.' },
      { en: 'Many new year resolutions are forgotten by November.', he: 'הרבה החלטות של השנה החדשה נשכחות עד נובמבר.' },
      { en: 'The rain was heavy; as a result, the lake rose quickly.', he: 'הגשם היה כבד; כתוצאה מכך, האגם עלה במהירות.' },
    ],
    passages: [
      {
        passageEn:
          'In the weeks before Rosh Hashana, the markets of Israel are busy and loud. Huge piles of pomegranates and apples are sold at every stall. Many families buy new clothes, because the holiday is seen as a fresh start. Honey is also popular, since people hope for a sweet year. On the evening of the holiday, the busy streets suddenly become quiet.',
        passageHe:
          'בשבועות שלפני ראש השנה, השווקים בישראל עמוסים ורועשים. ערימות ענק של רימונים ותפוחים נמכרות בכל דוכן. משפחות רבות קונות בגדים חדשים, כי החג נחשב להתחלה חדשה. גם הדבש פופולרי, מכיוון שאנשים מקווים לשנה מתוקה. בערב החג, הרחובות העמוסים נעשים פתאום שקטים.',
        questions: [
          {
            questionEn: 'What is sold at every stall before the holiday?',
            questionHe: 'מה נמכר בכל דוכן לפני החג?',
            correct: 'Huge piles of pomegranates and apples.',
            wrong: ['Paper chains for the sukkah.', 'Candles for the long winter nights.'],
          },
          {
            questionEn: 'Why do many families buy new clothes?',
            questionHe: 'למה משפחות רבות קונות בגדים חדשים?',
            correct: 'Because the holiday is seen as a fresh start.',
            wrong: ['Because the winter is coming soon.', 'Because clothes are cheaper before holidays.'],
          },
          {
            questionEn: 'What happens to the streets on the evening of the holiday?',
            questionHe: 'מה קורה לרחובות בערב החג?',
            correct: 'They suddenly become quiet.',
            wrong: ['They are filled with markets.', 'They become loud and crowded.'],
          },
        ],
      },
      {
        passageEn:
          'In Israel, the first rain of the season is called the yoreh. Farmers wait for it anxiously, because the soil is completely dry after the long summer. When the first downpour finally arrives, children often run outside to feel the drops. The rain washes the dust from the trees, and the hills slowly turn green. As a result, many people see the first rain as the true beginning of winter.',
        passageHe:
          'בישראל הגשם הראשון של העונה נקרא ״יורה״. החקלאים מחכים לו בדאגה, כי האדמה יבשה לגמרי אחרי הקיץ הארוך. כשהגשם השוטף הראשון מגיע סוף סוף, ילדים רצים לעתים קרובות החוצה להרגיש את הטיפות. הגשם שוטף את האבק מהעצים, והגבעות מוריקות לאט. כתוצאה מכך, אנשים רבים רואים בגשם הראשון את ההתחלה האמיתית של החורף.',
        questions: [
          {
            questionEn: 'Why do farmers wait anxiously for the first rain?',
            questionHe: 'למה החקלאים מחכים בדאגה לגשם הראשון?',
            correct: 'The soil is completely dry after the long summer.',
            wrong: ['The rivers are full after the long summer.', 'The trees are damaged by the snow.'],
          },
          {
            questionEn: 'What do children often do when the first downpour arrives?',
            questionHe: 'מה ילדים עושים לעתים קרובות כשהגשם הראשון מגיע?',
            correct: 'They run outside to feel the drops.',
            wrong: ['They stay inside and watch films.', 'They help the farmers plant trees.'],
          },
          {
            questionEn: 'How do many people see the first rain?',
            questionHe: 'איך אנשים רבים רואים את הגשם הראשון?',
            correct: 'As the true beginning of winter.',
            wrong: ['As the end of the school year.', 'As a danger to the hills.'],
          },
        ],
      },
    ],
  },
  // Unit 32: spring and summer festivals; comparing and contrasting, relative clauses
  32: {
    vocabulary: [
      {
        clozeEn: 'In March, the hills near Jerusalem ____ with red and yellow flowers.',
        clozeHe: 'במרץ הגבעות ליד ירושלים פורחות בפרחים אדומים וצהובים.',
        answer: 'blossom',
        wrong: ['scorching', 'ceremony'],
      },
      {
        clozeEn: 'The spy used a fake beard to ____ himself.',
        clozeHe: 'המרגל השתמש בזקן מזויף כדי להסוות את עצמו.',
        answer: 'disguise',
        wrong: ['leisure', 'dairy'],
      },
      {
        clozeEn: 'Yogurt, butter and cheese are all ____ products.',
        clozeHe: 'יוגורט, חמאה וגבינה הם כולם מוצרי חלב.',
        answer: 'dairy',
        wrong: ['blossom', 'heritage'],
      },
      {
        clozeEn: 'Our town held a short ____ to honour its first teachers.',
        clozeHe: 'העיירה שלנו ערכה טקס קצר לכבוד המורים הראשונים שלה.',
        answer: 'ceremony',
        wrong: ['sapling', 'unleavened'],
      },
      {
        clozeEn: 'Stories and recipes passed down by grandparents are part of our ____.',
        clozeHe: 'סיפורים ומתכונים שעוברים מסבים ומסבתות הם חלק מהמורשת שלנו.',
        answer: 'heritage',
        wrong: ['parade', 'disguise'],
      },
      {
        clozeEn: 'On ____ days in July, the beaches are crowded from early morning.',
        clozeHe: 'בימים לוהטים ביולי, החופים עמוסים כבר מהבוקר המוקדם.',
        answer: 'scorching',
        wrong: ['liberation', 'commemorate'],
      },
    ],
    grammar: [
      {
        questionEn: 'Choose the correct connector: "____ Purim, Tu BiShvat has no costumes."',
        correct: 'Unlike',
        wrong: ['Whereas', 'Similarly'],
        explainHe: 'אחרי החסר בא שם עצם (Purim), ולכן Unlike. whereas מחבר שני משפטים שלמים.',
        hintHe: 'מה בא אחרי החסר: שם עצם או משפט שלם? והאם מדובר בדמיון או בהבדל?',
      },
      {
        questionEn: 'Choose the correct connector: "Passover lasts a week. ____, Sukkot lasts a week too."',
        correct: 'Similarly',
        wrong: ['However', 'Unlike'],
        explainHe: 'שני החגים נמשכים שבוע, כלומר יש דמיון, ולכן Similarly.',
        hintHe: 'האם שני המשפטים מתארים דבר דומה או דבר הפוך?',
      },
      {
        questionEn: 'Choose the correct relative pronoun: "The farmer ____ grows our wheat lives in the Jezreel Valley."',
        correct: 'who',
        wrong: ['which', 'where'],
        explainHe: 'the farmer הוא אדם, ולכן who.',
        hintHe: 'על מה מוסיפים מידע: על אדם, על דבר או על מקום?',
      },
      {
        questionEn: 'Which sentence is punctuated correctly?',
        correct: 'Jerusalem, where the ceremony is held, is full of flags.',
        wrong: [
          'Jerusalem where the ceremony is held, is full of flags.',
          'Jerusalem, where the ceremony is held is full of flags.',
        ],
        explainHe: 'פסוקית שמוסיפה מידע על שם פרטי (Jerusalem) מוקפת בפסיקים משני הצדדים.',
        hintHe: 'פסוקית שמוסיפה מידע נוסף נסגרת בשני סימנים זהים. בדקו את שני צדי הפסוקית.',
      },
      {
        questionEn: 'Choose the correct relative pronoun: "Matza, ____ is made of flour and water, is eaten all week."',
        correct: 'which',
        wrong: ['that', 'who'],
        explainHe: 'מצה היא דבר, והפסוקית בין פסיקים, ולכן which ולא that.',
        hintHe: 'שימו לב לפסיקים סביב הפסוקית, ולשאלה אם מדובר באדם או בדבר.',
      },
      {
        questionEn: 'Which sentence shows a contrast?',
        correct: 'Shavuot is a dairy festival, whereas Passover is famous for matza.',
        wrong: [
          'Shavuot is a dairy festival, and similarly Passover is famous for matza.',
          'Shavuot is a dairy festival, and Passover is also a dairy festival.',
        ],
        explainHe: 'whereas מראה ניגוד בין שני החגים: לכל אחד מהם מאפיין אחר.',
        hintHe: 'חפשו את המשפט שבו המחבר מראה ששני החגים שונים זה מזה.',
      },
    ],
    sentences: [
      { en: 'Unlike Purim, Tu BiShvat is celebrated quietly in nature.', he: 'בשונה מפורים, את ט״ו בשבט חוגגים בשקט בטבע.' },
      { en: 'The children who planted trees received a certificate.', he: 'הילדים ששתלו עצים קיבלו תעודה.' },
      { en: 'Both Passover and Sukkot last for a whole week.', he: 'גם פסח וגם סוכות נמשכים שבוע שלם.' },
      { en: 'The beach where we swim is closed on stormy days.', he: 'החוף שבו אנחנו שוחים סגור בימים סוערים.' },
      { en: 'My cousin wore a pirate costume, whereas I dressed as a chef.', he: 'בן הדוד שלי לבש תחפושת של פיראט, ואילו אני התחפשתי לשף.' },
      { en: 'Summer camp, which starts in July, lasts three weeks.', he: 'הקייטנה, שמתחילה ביולי, נמשכת שלושה שבועות.' },
    ],
    passages: [
      {
        passageEn:
          'On Tu BiShvat, thousands of students go out to plant saplings in forests across Israel. The trees, which are chosen by experts, must survive hot and dry summers. Pine trees were once planted almost everywhere, whereas today local trees like oaks and carobs are preferred. Students who plant a tree often return years later to see how tall it has grown.',
        passageHe:
          'בט״ו בשבט אלפי תלמידים יוצאים לשתול שתילים ביערות ברחבי ישראל. העצים, שנבחרים על ידי מומחים, צריכים לשרוד קיצים חמים ויבשים. פעם נשתלו עצי אורן כמעט בכל מקום, ואילו היום מעדיפים עצים מקומיים כמו אלונים וחרובים. תלמידים ששותלים עץ חוזרים לעתים קרובות כעבור שנים כדי לראות כמה הוא גדל.',
        questions: [
          {
            questionEn: 'Who chooses the trees for planting?',
            questionHe: 'מי בוחר את העצים לשתילה?',
            correct: 'They are chosen by experts.',
            wrong: ['They are chosen by the students.', 'They are chosen by local farmers.'],
          },
          {
            questionEn: 'Which trees are preferred today?',
            questionHe: 'אילו עצים מעדיפים היום?',
            correct: 'Local trees like oaks and carobs.',
            wrong: ['Pine trees from other countries.', 'Fruit trees like apples and pears.'],
          },
          {
            questionEn: 'Why do students often return years later?',
            questionHe: 'למה תלמידים חוזרים לעתים קרובות כעבור שנים?',
            correct: 'To see how tall their tree has grown.',
            wrong: ['To plant pine trees again.', 'To cut down the old trees.'],
          },
        ],
      },
      {
        passageEn:
          'For many Israeli teenagers, the summer vacation begins at the end of June. Some spend their leisure time at the beach, whereas others work in cafés or summer camps. Teenagers who volunteer often help younger children with reading and sport. Unlike the school year, the summer has no fixed timetable. Many teenagers say this freedom is the best part of the year.',
        passageHe:
          'עבור בני נוער רבים בישראל, חופשת הקיץ מתחילה בסוף יוני. חלקם מבלים את זמן הפנאי שלהם בחוף הים, ואילו אחרים עובדים בבתי קפה או בקייטנות. בני נוער שמתנדבים עוזרים לעתים קרובות לילדים צעירים בקריאה ובספורט. בשונה משנת הלימודים, בקיץ אין מערכת שעות קבועה. בני נוער רבים אומרים שהחופש הזה הוא החלק הכי טוב בשנה.',
        questions: [
          {
            questionEn: 'When does the summer vacation begin?',
            questionHe: 'מתי מתחילה חופשת הקיץ?',
            correct: 'At the end of June.',
            wrong: ['At the beginning of May.', 'In the middle of August.'],
          },
          {
            questionEn: 'How do teenage volunteers help younger children?',
            questionHe: 'איך בני נוער מתנדבים עוזרים לילדים צעירים?',
            correct: 'They help them with reading and sport.',
            wrong: ['They teach them to swim at the beach.', 'They cook meals for them in cafés.'],
          },
          {
            questionEn: 'What does the summer not have, unlike the school year?',
            questionHe: 'מה אין בקיץ, בשונה משנת הלימודים?',
            correct: 'It has no fixed timetable.',
            wrong: ['It has no free time.', 'It has no work for teenagers.'],
          },
        ],
      },
    ],
  },
};
