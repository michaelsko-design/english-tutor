import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-plus pack's grade 6 exam bank (Feature 43), by the unit number in its mission ids.
 * New questions only. The last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_PLUS_GRADE_6_EXAM_BANK: ExamBankPack = {
  // Trips: irregular Past Simple (went, took, saw, ate, had, wrote)
  21: {
    vocabulary: [
      {
        clozeEn: 'We looked at the ____ to find the way to the lake.',
        clozeHe: 'הסתכלנו במפה כדי למצוא את הדרך לאגם.',
        answer: 'map',
        wrong: ['diary', 'picnic'],
      },
      {
        clozeEn: 'The ____ left the station at eight in the morning.',
        clozeHe: 'הרכבת יצאה מהתחנה בשמונה בבוקר.',
        answer: 'train',
        wrong: ['forest', 'museum'],
      },
      {
        clozeEn: 'Mount Hermon is the highest ____ in Israel.',
        clozeHe: 'החרמון הוא ההר הגבוה ביותר בישראל.',
        answer: 'mountain',
        wrong: ['camera', 'airport'],
      },
      {
        clozeEn: 'The Jordan is a famous ____ in Israel.',
        clozeHe: 'הירדן הוא נהר מפורסם בישראל.',
        answer: 'river',
        wrong: ['diary', 'trip'],
      },
      {
        clozeEn: 'We waited for our plane at the ____.',
        clozeHe: 'חיכינו למטוס שלנו בשדה התעופה.',
        answer: 'airport',
        wrong: ['forest', 'picnic'],
      },
      {
        clozeEn: 'Every evening Noa writes about her day in her ____.',
        clozeHe: 'בכל ערב נועה כותבת על היום שלה ביומן שלה.',
        answer: 'diary',
        wrong: ['mountain', 'train'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete: "Last year we ____ to Eilat."',
        correct: 'went',
        wrong: ['goed', 'go'],
        explainHe: 'go הוא פועל לא רגיל, ובעבר הוא went.',
        hintHe: 'Last year זה עבר, ו-go הוא פועל לא רגיל, בלי ed.',
      },
      {
        questionEn: 'Complete: "Yesterday Maya ____ a photo of the sea."',
        correct: 'took',
        wrong: ['taked', 'takes'],
        explainHe: 'take הוא פועל לא רגיל, ובעבר הוא took.',
        hintHe: 'Yesterday זה עבר. take הוא פועל לא רגיל עם צורת עבר מיוחדת.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We had lunch near the river.',
        wrong: ['We haved lunch near the river.', 'We has lunch near the river.'],
        explainHe: 'have הוא פועל לא רגיל, ובעבר הוא had לכל הגופים.',
        hintHe: 'הפועל have בעבר לא מקבל ed, ויש לו צורה אחת לכל הגופים.',
      },
      {
        questionEn: 'Complete: "Last night I ____ two pages in my diary."',
        correct: 'wrote',
        wrong: ['writed', 'write'],
        explainHe: 'write הוא פועל לא רגיל, ובעבר הוא wrote.',
        hintHe: 'Last night זה עבר. write הוא פועל לא רגיל, בלי ed.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'They walked in the forest and saw a deer.',
        wrong: ['They walk in the forest and saw a deer.', 'They walked in the forest and seed a deer.'],
        explainHe: 'שני הפעלים בעבר: walk הוא רגיל (walked), ו-see הוא לא רגיל (saw).',
        hintHe: 'שני הפעלים צריכים להיות בעבר. אחד מהם רגיל והשני לא רגיל.',
      },
      {
        questionEn: 'Complete: "On Friday my grandma ____ a big cake for us."',
        correct: 'made',
        wrong: ['maked', 'make'],
        explainHe: 'make הוא פועל לא רגיל, ובעבר הוא made.',
        hintHe: 'הסיפור הוא על יום שישי שעבר. make הוא פועל לא רגיל עם צורת עבר מיוחדת.',
      },
    ],
    sentences: [
      { en: 'We took a train to Haifa last summer.', he: 'נסענו ברכבת לחיפה בקיץ שעבר.' },
      { en: 'Our class went on a trip to the desert.', he: 'הכיתה שלנו יצאה לטיול במדבר.' },
      { en: 'I saw an old map at the museum.', he: 'ראיתי מפה עתיקה במוזיאון.' },
      { en: 'We ate sandwiches on a long hike.', he: 'אכלנו כריכים בטיול רגלי ארוך.' },
      { en: 'Dad forgot his camera at the hotel.', he: 'אבא שכח את המצלמה שלו במלון.' },
      { en: 'The children had a picnic next to the river.', he: 'הילדים עשו פיקניק ליד הנהר.' },
    ],
    passages: [
      {
        passageEn:
          'Last Passover Daniel’s family went to the Golan. They drove for four hours. On the first day they went on a hike near a waterfall. Daniel took a lot of photos with his phone. At night they slept in a small cabin.',
        passageHe:
          'בפסח שעבר המשפחה של דניאל נסעה לגולן. הם נסעו ארבע שעות. ביום הראשון הם יצאו לטיול רגלי ליד מפל. דניאל צילם הרבה תמונות בטלפון שלו. בלילה הם ישנו בבקתה קטנה.',
        questions: [
          {
            questionEn: 'Where did Daniel’s family go?',
            questionHe: 'לאן נסעה המשפחה של דניאל?',
            correct: 'To the Golan.',
            wrong: ['To Eilat.', 'To Jerusalem.'],
          },
          {
            questionEn: 'What did they do on the first day?',
            questionHe: 'מה הם עשו ביום הראשון?',
            correct: 'They went on a hike near a waterfall.',
            wrong: ['They swam in the sea.', 'They visited a museum.'],
          },
          {
            questionEn: 'Where did they sleep?',
            questionHe: 'איפה הם ישנו?',
            correct: 'In a small cabin.',
            wrong: ['In a big hotel.', 'In a tent.'],
          },
        ],
      },
      {
        passageEn:
          'In June Hila flew to London with her aunt. They took a red bus to the city. On Monday they visited a famous museum. Hila saw a very old ship there. She wrote about it in her diary.',
        passageHe:
          'ביוני הילה טסה ללונדון עם הדודה שלה. הן נסעו באוטובוס אדום לעיר. ביום שני הן ביקרו במוזיאון מפורסם. הילה ראתה שם ספינה עתיקה מאוד. היא כתבה על זה ביומן שלה.',
        questions: [
          {
            questionEn: 'Who did Hila fly to London with?',
            questionHe: 'עם מי הילה טסה ללונדון?',
            correct: 'With her aunt.',
            wrong: ['With her parents.', 'With her class.'],
          },
          {
            questionEn: 'What did Hila see in the museum?',
            questionHe: 'מה הילה ראתה במוזיאון?',
            correct: 'A very old ship.',
            wrong: ['A red bus.', 'A big plane.'],
          },
          {
            questionEn: 'Where did she write about it?',
            questionHe: 'איפה היא כתבה על זה?',
            correct: 'In her diary.',
            wrong: ['In a letter.', 'On her phone.'],
          },
        ],
      },
    ],
  },

  // Records: superlatives (-est, the most) with comparatives review
  22: {
    vocabulary: [
      {
        clozeEn: 'The blue ____ is the biggest animal in the sea.',
        clozeHe: 'הלווייתן הכחול הוא החיה הכי גדולה בים.',
        answer: 'whale',
        wrong: ['medal', 'team'],
      },
      {
        clozeEn: 'Shai is the ____ player, so he plays basketball.',
        clozeHe: 'שי הוא השחקן הכי גבוה, ולכן הוא משחק כדורסל.',
        answer: 'tallest',
        wrong: ['smallest', 'famous'],
      },
      {
        clozeEn: 'Our ____ has eleven players and a coach.',
        clozeHe: 'לקבוצה שלנו יש אחד עשר שחקנים ומאמן.',
        answer: 'team',
        wrong: ['whale', 'prize'],
      },
      {
        clozeEn: 'Everyone knows this singer. She is very ____.',
        clozeHe: 'כולם מכירים את הזמרת הזאת. היא מפורסמת מאוד.',
        answer: 'famous',
        wrong: ['heaviest', 'smallest'],
      },
      {
        clozeEn: 'The ____ of the race gets a gold cup.',
        clozeHe: 'המנצח במרוץ מקבל גביע זהב.',
        answer: 'winner',
        wrong: ['whale', 'river'],
      },
      {
        clozeEn: 'Wow, this magic show is ____!',
        clozeHe: 'וואו, מופע הקסמים הזה מדהים!',
        answer: 'amazing',
        wrong: ['tallest', 'medal'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete: "Mount Everest is ____ mountain in the world."',
        correct: 'the highest',
        wrong: ['the higher', 'the most high'],
        explainHe: 'high הוא תואר קצר, ו"הכי" מכולם זה the highest.',
        hintHe: 'משווים הר אחד לכל ההרים בעולם, ו-high הוא תואר קצר.',
      },
      {
        questionEn: 'Complete: "This is ____ movie of the year."',
        correct: 'the most exciting',
        wrong: ['the excitingest', 'the more exciting'],
        explainHe: 'exciting הוא תואר ארוך, ולכן the most exciting.',
        hintHe: 'exciting הוא תואר ארוך, וזה "הכי" מכל הסרטים, לא השוואה בין שניים.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'July is the hottest month in Israel.',
        wrong: ['July is the hotest month in Israel.', 'July is the most hot month in Israel.'],
        explainHe: 'hot הוא תואר קצר שמכפיל את ה-t: the hottest.',
        hintHe: 'hot הוא תואר קצר שנגמר בעיצור אחרי תנועה אחת. מה קורה לאות האחרונה?',
      },
      {
        questionEn: 'Complete: "My bag is heavier ____ your bag."',
        correct: 'than',
        wrong: ['then', 'that'],
        explainHe: 'בהשוואה בין שניים אומרים than: heavier than.',
        hintHe: 'משווים שני תיקים. איזו מילה אומרת "מ..." בהשוואה?',
      },
      {
        questionEn: 'Complete: "Dana is the ____ girl in our class."',
        correct: 'happiest',
        wrong: ['happyest', 'most happy'],
        explainHe: 'בתואר שנגמר ב-y אחרי עיצור, ה-y הופכת ל-i ואז est: happiest.',
        hintHe: 'happy נגמר ב-y. מה קורה ל-y לפני הסיומת?',
      },
      {
        questionEn: 'Complete: "Football is ____ sport in our school."',
        correct: 'the most popular',
        wrong: ['the popularest', 'the more popular'],
        explainHe: 'popular הוא תואר ארוך, ולכן the most popular.',
        hintHe: 'popular הוא תואר ארוך, וזה "הכי" מכל סוגי הספורט.',
      },
    ],
    sentences: [
      { en: 'The cheetah is the fastest animal on land.', he: 'הברדלס הוא החיה הכי מהירה ביבשה.' },
      { en: 'This is the smallest bird in the park.', he: 'זו הציפור הכי קטנה בפארק.' },
      { en: 'Our team won a gold medal yesterday.', he: 'הקבוצה שלנו זכתה במדליית זהב אתמול.' },
      { en: 'She is the most famous player in Israel.', he: 'היא השחקנית הכי מפורסמת בישראל.' },
      { en: 'The first prize was a trip to Paris.', he: 'הפרס הראשון היה טיול לפריז.' },
      { en: 'Which is the heaviest box in the room?', he: 'איזו קופסה היא הכי כבדה בחדר?' },
    ],
    passages: [
      {
        passageEn:
          'Last week our school had a big spelling contest. Twenty children were in the contest. The youngest child was only nine. The winner was Roni from Grade 6. She got a medal and a new dictionary.',
        passageHe:
          'בשבוע שעבר בית הספר שלנו ערך תחרות איות גדולה. עשרים ילדים השתתפו בתחרות. הילד הכי צעיר היה רק בן תשע. המנצחת הייתה רוני מכיתה ו׳. היא קיבלה מדליה ומילון חדש.',
        questions: [
          {
            questionEn: 'How many children were in the contest?',
            questionHe: 'כמה ילדים השתתפו בתחרות?',
            correct: 'Twenty children.',
            wrong: ['Nine children.', 'Six children.'],
          },
          {
            questionEn: 'Who was the winner?',
            questionHe: 'מי ניצח/ה?',
            correct: 'Roni from Grade 6.',
            wrong: ['The youngest child.', 'A boy from Grade 4.'],
          },
          {
            questionEn: 'What did the winner get?',
            questionHe: 'מה קיבלה המנצחת?',
            correct: 'A medal and a new dictionary.',
            wrong: ['A gold cup and a ball.', 'A trip to the beach.'],
          },
        ],
      },
      {
        passageEn:
          'The Dead Sea is the lowest place on Earth. Its water is the saltiest in the world. People can float on the water very easily. Many tourists visit it every year. It is one of the most amazing places in Israel.',
        passageHe:
          'ים המלח הוא המקום הכי נמוך על כדור הארץ. המים שלו הכי מלוחים בעולם. אנשים יכולים לצוף על המים בקלות רבה. הרבה תיירים מבקרים בו בכל שנה. זה אחד המקומות הכי מדהימים בישראל.',
        questions: [
          {
            questionEn: 'What is the lowest place on Earth?',
            questionHe: 'מהו המקום הכי נמוך על כדור הארץ?',
            correct: 'The Dead Sea.',
            wrong: ['The Red Sea.', 'Lake Kinneret.'],
          },
          {
            questionEn: 'What can people do on the water?',
            questionHe: 'מה אנשים יכולים לעשות על המים?',
            correct: 'Float very easily.',
            wrong: ['Ride big boats.', 'Catch many fish.'],
          },
          {
            questionEn: 'Who visits it every year?',
            questionHe: 'מי מבקר שם בכל שנה?',
            correct: 'Many tourists.',
            wrong: ['Only scientists.', 'Only children.'],
          },
        ],
      },
    ],
  },
};
