import type { ExamBankPack } from '../../../examBank/types';

/**
 * Holidays pack, grade 8 exam bank (Feature 43), by the unit number in the mission ids. New
 * questions only, at review level (going to / will, Past Simple & Continuous, modals). The last
 * 2 items of each list and the second passage are for the mock exam.
 */
export const HOLIDAYS_GRADE_8_EXAM_BANK: ExamBankPack = {
  // Unit 31: autumn and winter holidays
  31: {
    vocabulary: [
      {
        clozeEn: 'My New Year ____ is to spend less time on my phone.',
        clozeHe: 'ההחלטה שלי לשנה החדשה היא לבלות פחות זמן בטלפון.',
        answer: 'resolution',
        wrong: ['thunder', 'heater'],
      },
      {
        clozeEn: 'Mom cut the ____ in half, and its red seeds fell on the table.',
        clozeHe: 'אמא חתכה את הרימון לשניים, והגרעינים האדומים שלו נפלו על השולחן.',
        answer: 'pomegranate',
        wrong: ['shelter', 'forecast'],
      },
      {
        clozeEn: 'A strong wind broke a ____ off the old olive tree.',
        clozeHe: 'רוח חזקה שברה ענף מעץ הזית הישן.',
        answer: 'branch',
        wrong: ['oil', 'resolution'],
      },
      {
        clozeEn: 'We walked home in the heavy rain and arrived completely ____.',
        clozeHe: 'הלכנו הביתה בגשם החזק והגענו רטובים לגמרי.',
        answer: 'soaked',
        wrong: ['gloomy', 'pomegranate'],
      },
      {
        clozeEn: 'The weather ____ for tomorrow is cold and windy.',
        clozeHe: 'תחזית מזג האוויר למחר היא קרה וסוערת.',
        answer: 'forecast',
        wrong: ['branch', 'shiver'],
      },
      {
        clozeEn: 'The dog began to ____ after its swim in the cold lake.',
        clozeHe: 'הכלב התחיל לרעוד אחרי השחייה שלו באגם הקר.',
        answer: 'shiver',
        wrong: ['heater', 'shelter'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "Next week, we ____ our grandparents in Tiberias for Sukkot."',
        correct: 'are going to visit',
        wrong: ['are going to visiting', 'going to visit'],
        explainHe: 'תוכנית שכבר נקבעה: am / is / are going to + V1. עם we: are going to visit.',
        hintHe: 'זו תוכנית שכבר החלטנו עליה. בדקו שיש פועל עזר לפני המבנה, ושהפועל בסוף בצורת הבסיס.',
      },
      {
        questionEn: 'Your friend says, "I’m cold." What is the best answer?',
        correct: 'I’ll close the window.',
        wrong: ['I’m closing the window yesterday.', 'I closed the window tomorrow.'],
        explainHe: 'זו הצעה לעזור שנולדת ברגע הדיבור, ולכן will: I’ll close.',
        hintHe: 'ההחלטה לעזור נולדת עכשיו, בתגובה לחבר. בדקו גם שמילות הזמן מתאימות לפועל.',
      },
      {
        questionEn: 'Complete the sentence: "While Dad ____ the doughnuts, the phone rang."',
        correct: 'was frying',
        wrong: ['fried', 'were frying'],
        explainHe: 'אחרי while באה הפעולה הארוכה ברקע ב-Past Continuous. Dad הוא he, ולכן was.',
        hintHe: 'הטיגון היה באמצע כשקרה משהו אחר. אבא הוא אדם אחד: איזה פועל עזר בעבר מתאים לו?',
      },
      {
        questionEn: 'Complete the sentence: "We were walking to the synagogue when it ____ to rain."',
        correct: 'began',
        wrong: ['was beginning', 'begins'],
        explainHe: 'הגשם התחיל פתאום, באמצע ההליכה, ולכן Past Simple: began.',
        hintHe: 'מה קטע את ההליכה? פעולה קצרה בעבר כתובה בזמן פשוט, בצורת העבר של הפועל.',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'What were you doing when the storm started?',
        wrong: ['What did you doing when the storm started?', 'What you were doing when the storm started?'],
        explainHe: 'שאלה ב-Past Continuous: מילת שאלה, were, הנושא ופועל עם ing.',
        hintHe: 'בשאלה פועל העזר בא לפני הנושא. איזה פועל עזר הולך עם פועל שמסתיים ב-ing?',
      },
      {
        questionEn: 'Complete the sentence: "Look at those dark clouds! It ____ soon."',
        correct: 'is going to rain',
        wrong: ['is going to raining', 'rains going'],
        explainHe: 'כשרואים סימן ברור עכשיו (עננים כהים), משתמשים ב-is going to + V1.',
        hintHe: 'יש סימן שרואים בעיניים. בחרו את המבנה של תחזית לפי סימן, עם פועל בצורת הבסיס.',
      },
    ],
    sentences: [
      { en: 'We are going to build the sukkah on Sunday.', he: 'אנחנו מתכננים לבנות את הסוכה ביום ראשון.' },
      { en: 'I will help Grandma with the holiday dinner.', he: 'אני אעזור לסבתא בארוחת החג.' },
      { en: 'While we were eating, the wind blew the decorations away.', he: 'בזמן שאכלנו, הרוח העיפה את הקישוטים.' },
      { en: 'It was raining hard when we lit the candles.', he: 'ירד גשם חזק כשהדלקנו את הנרות.' },
      { en: 'Were you sleeping when the thunder started?', he: 'ישנתם כשהרעם התחיל?' },
      { en: 'The forecast says it will be cold tomorrow.', he: 'התחזית אומרת שמחר יהיה קר.' },
    ],
    passages: [
      {
        passageEn:
          'Before Rosh Hashana, Tom and his sister made a list of resolutions. Tom wrote that he is going to learn to cook. His sister wrote that she is going to read a book every month. On the holiday evening, Tom cooked rice with raisins for the whole family. Everyone said it was delicious, and Tom was very proud.',
        passageHe:
          'לפני ראש השנה, תום ואחותו הכינו רשימה של החלטות. תום כתב שהוא מתכנן ללמוד לבשל. אחותו כתבה שהיא מתכננת לקרוא ספר בכל חודש. בערב החג, תום בישל אורז עם צימוקים לכל המשפחה. כולם אמרו שזה היה טעים מאוד, ותום היה גאה מאוד.',
        questions: [
          {
            questionEn: 'What is Tom going to learn?',
            questionHe: 'מה תום מתכנן ללמוד?',
            correct: 'To cook.',
            wrong: ['To swim.', 'To play the piano.'],
          },
          {
            questionEn: 'How often is his sister going to read a book?',
            questionHe: 'באיזו תדירות אחותו מתכננת לקרוא ספר?',
            correct: 'Every month.',
            wrong: ['Every day.', 'Every year.'],
          },
          {
            questionEn: 'What did Tom cook on the holiday evening?',
            questionHe: 'מה תום בישל בערב החג?',
            correct: 'Rice with raisins.',
            wrong: ['Fish with lemon.', 'Chicken soup.'],
          },
        ],
      },
      {
        passageEn:
          'On the sixth night of Hanukkah, the electricity went out in Shlomi. Hadas and her family were playing cards in the living room. Suddenly, the room was dark, and only the Hanukkah candles were burning. Her grandfather told stories about his childhood by the light of the candles. Hadas says it was the best night of the holiday.',
        passageHe:
          'בלילה השישי של חנוכה, החשמל נפל בשלומי. הדס והמשפחה שלה שיחקו קלפים בסלון. פתאום החדר היה חשוך, ורק נרות החנוכה דלקו. סבא שלה סיפר סיפורים על הילדות שלו לאור הנרות. הדס אומרת שזה היה הלילה הכי טוב של החג.',
        questions: [
          {
            questionEn: 'What were Hadas and her family doing when the electricity went out?',
            questionHe: 'מה הדס והמשפחה שלה עשו כשהחשמל נפל?',
            correct: 'They were playing cards.',
            wrong: ['They were watching TV.', 'They were frying latkes.'],
          },
          {
            questionEn: 'What was burning in the dark room?',
            questionHe: 'מה דלק בחדר החשוך?',
            correct: 'Only the Hanukkah candles.',
            wrong: ['A fire in the fireplace.', 'A small lamp.'],
          },
          {
            questionEn: 'What did her grandfather tell stories about?',
            questionHe: 'על מה סבא שלה סיפר סיפורים?',
            correct: 'About his childhood.',
            wrong: ['About his army service.', 'About a famous king.'],
          },
        ],
      },
    ],
  },
  // Unit 32: spring and summer celebrations
  32: {
    vocabulary: [
      {
        clozeEn: 'The spy wore a hat and dark glasses as a ____.',
        clozeHe: 'המרגל חבש כובע ומשקפיים כהים כהסוואה.',
        answer: 'disguise',
        wrong: ['dairy', 'campsite'],
      },
      {
        clozeEn: 'Bands and dancers marched in the colorful ____ through the city.',
        clozeHe: 'להקות ורקדנים צעדו במצעד הצבעוני ברחבי העיר.',
        answer: 'parade',
        wrong: ['sunburn', 'almond'],
      },
      {
        clozeEn: 'The little ____ needs water and sun to become a tall tree.',
        clozeHe: 'השתיל הקטן צריך מים ושמש כדי להפוך לעץ גבוה.',
        answer: 'seedling',
        wrong: ['ceremony', 'itinerary'],
      },
      {
        clozeEn: 'Everyone stood up when the ____ began with the national anthem.',
        clozeHe: 'כולם קמו כשהטקס התחיל בהמנון הלאומי.',
        answer: 'ceremony',
        wrong: ['barbecue', 'almond'],
      },
      {
        clozeEn: 'I stayed in the sun for too long and got a bad ____.',
        clozeHe: 'נשארתי בשמש יותר מדי זמן וקיבלתי כוויית שמש קשה.',
        answer: 'sunburn',
        wrong: ['parade', 'disguise'],
      },
      {
        clozeEn: 'Let’s check the ____ before we leave: first the beach, then the museum.',
        clozeHe: 'בואו נבדוק את המסלול לפני שיוצאים: קודם החוף, ואחר כך המוזיאון.',
        answer: 'itinerary',
        wrong: ['seedling', 'dairy'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "We ____ trees in the forest on Tu BiShvat last year."',
        correct: 'planted',
        wrong: ['were plant', 'plant'],
        explainHe: 'last year מראה פעולה שהסתיימה בעבר, ולכן Past Simple: planted.',
        hintHe: 'מילות הזמן בסוף המשפט מראות מתי זה קרה. איזו צורה של הפועל מתאימה?',
      },
      {
        questionEn: 'Complete the sentence: "The children were dancing in the street when the parade ____."',
        correct: 'arrived',
        wrong: ['was arrive', 'arrives'],
        explainHe: 'הגעת המצעד קטעה את הריקוד, ולכן Past Simple אחרי when: arrived.',
        hintHe: 'הריקוד היה הפעולה הארוכה. הפעולה הקצרה שקטעה אותה כתובה בזמן עבר פשוט.',
      },
      {
        questionEn: 'Which sentence gives advice?',
        correct: 'You should wear a hat in the sun.',
        wrong: ['You should wearing a hat in the sun.', 'You should to wear a hat in the sun.'],
        explainHe: 'אחרי should בא פועל בצורת הבסיס, בלי to ובלי ing.',
        hintHe: 'אחרי פועל של עצה, הפועל הבא מופיע בצורה הכי פשוטה שלו, בלי תוספות.',
      },
      {
        questionEn: 'Complete the sentence: "Visitors ____ leave their dogs in the car on hot days."',
        correct: 'mustn’t',
        wrong: ['don’t have', 'mustn’t to'],
        explainHe: 'mustn’t מראה איסור, ואחריו בא פועל בצורת הבסיס בלי to.',
        hintHe: 'זה כלל שאוסר משהו. בחרו את המילה של איסור שאחריה בא פועל בצורת הבסיס.',
      },
      {
        questionEn: 'Complete the sentence: "My sister ____ clean her room before Passover."',
        correct: 'has to',
        wrong: ['have to', 'has'],
        explainHe: 'have to מראה חובה, ועם she משתמשים ב-has to.',
        hintHe: 'מדובר בחובה, ואחותי היא she. איך משתנה ביטוי החובה בגוף שלישי, ומה בא לפני הפועל?',
      },
      {
        questionEn: 'Complete the sentence: "This summer, we ____ camp near the Sea of Galilee. We booked it yesterday."',
        correct: 'are going to',
        wrong: ['going to', 'are going'],
        explainHe: 'תוכנית שכבר הוזמנה: are going to + V1.',
        hintHe: 'כבר הזמנו מקום, כלומר זו תוכנית. בדקו שיש פועל עזר ושהמבנה שלם לפני הפועל.',
      },
    ],
    sentences: [
      { en: 'We planted almond trees near our school.', he: 'שתלנו עצי שקד ליד בית הספר שלנו.' },
      { en: 'My brother was wearing a lion costume at the parade.', he: 'אחי לבש תחפושת של אריה במצעד.' },
      { en: 'You must stand during the siren.', he: 'חובה לעמוד בזמן הצפירה.' },
      { en: 'We have to finish the matzah before the holiday ends.', he: 'אנחנו חייבים לסיים את המצות לפני שהחג נגמר.' },
      { en: 'You should put on sunscreen every two hours.', he: 'כדאי למרוח קרם הגנה כל שעתיים.' },
      { en: 'We are going to sleep in tents this summer.', he: 'אנחנו מתכננים לישון באוהלים בקיץ הזה.' },
    ],
    passages: [
      {
        passageEn:
          'On Independence Day, Roni’s family went to a park near Modi’in. Her father was cooking at the barbecue, and her cousins were playing football. Suddenly, a group of planes flew over the park in a special air show. Everyone stopped and looked at the sky. In the evening, they watched the fireworks from a hill.',
        passageHe:
          'ביום העצמאות, המשפחה של רוני נסעה לפארק ליד מודיעין. אבא שלה הכין אוכל על המנגל, ובני הדודים שלה שיחקו כדורגל. פתאום קבוצת מטוסים טסה מעל הפארק במטס מיוחד. כולם עצרו והסתכלו בשמיים. בערב הם צפו בזיקוקים מגבעה.',
        questions: [
          {
            questionEn: 'What were Roni’s cousins doing in the park?',
            questionHe: 'מה בני הדודים של רוני עשו בפארק?',
            correct: 'They were playing football.',
            wrong: ['They were flying kites.', 'They were cooking at the barbecue.'],
          },
          {
            questionEn: 'What flew over the park?',
            questionHe: 'מה טס מעל הפארק?',
            correct: 'A group of planes.',
            wrong: ['A flock of birds.', 'A big balloon.'],
          },
          {
            questionEn: 'Where did they watch the fireworks from?',
            questionHe: 'מאיפה הם צפו בזיקוקים?',
            correct: 'From a hill.',
            wrong: ['From the beach.', 'From their balcony.'],
          },
        ],
      },
      {
        passageEn:
          'Shavuot is the holiday of the wheat harvest and of dairy food. In many kibbutzim, children ride on tractors full of fruit and vegetables. Doctors say you should drink a lot of water, because Shavuot is often very hot. This year, Itamar’s kibbutz is going to hold a big ceremony in the fields. He has to practice a song with his class.',
        passageHe:
          'שבועות הוא חג קציר החיטה והמאכלים החלביים. בקיבוצים רבים ילדים רוכבים על טרקטורים מלאים בפירות ובירקות. רופאים אומרים שכדאי לשתות הרבה מים, כי בשבועות חם לעתים קרובות מאוד. השנה הקיבוץ של איתמר מתכנן לערוך טקס גדול בשדות. הוא צריך לתרגל שיר עם הכיתה שלו.',
        questions: [
          {
            questionEn: 'What do children ride on in many kibbutzim?',
            questionHe: 'על מה ילדים רוכבים בקיבוצים רבים?',
            correct: 'Tractors full of fruit and vegetables.',
            wrong: ['Horses with flowers.', 'Bicycles with flags.'],
          },
          {
            questionEn: 'Why should people drink a lot of water on Shavuot?',
            questionHe: 'מדוע כדאי לשתות הרבה מים בשבועות?',
            correct: 'Because Shavuot is often very hot.',
            wrong: ['Because they eat too much cheese.', 'Because they work in the fields.'],
          },
          {
            questionEn: 'What does Itamar have to practice?',
            questionHe: 'מה איתמר צריך לתרגל?',
            correct: 'A song with his class.',
            wrong: ['A dance with his sister.', 'A speech for the ceremony.'],
          },
        ],
      },
    ],
  },
};
