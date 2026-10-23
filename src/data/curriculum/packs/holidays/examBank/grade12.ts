import type { ExamBankPack } from '../../../examBank/types';

/**
 * The holidays pack's grade 12 exam bank, by the unit number in its mission ids. New questions only;
 * the last 2 items of each list and the second passage are for the mock exam.
 */
export const HOLIDAYS_GRADE_12_EXAM_BANK: ExamBankPack = {
  // Unit 31: autumn and winter festivals; addition and contrast connectors, concession
  31: {
    vocabulary: [
      {
        clozeEn: 'Spring cleaning gives many people a sense of ____ at home.',
        clozeHe: 'ניקיון האביב נותן לאנשים רבים תחושה של התחדשות בבית.',
        answer: 'renewal',
        wrong: ['precipitation', 'customary'],
      },
      {
        clozeEn: 'The Bedouin family welcomed us with coffee and generous ____.',
        clozeHe: 'המשפחה הבדואית קיבלה אותנו בקפה ובהכנסת אורחים נדיבה.',
        answer: 'hospitality',
        wrong: ['overcast', 'replenish'],
      },
      {
        clozeEn: 'With great ____, the young runner trained every day for two years.',
        clozeHe: 'בהתמדה רבה, הרץ הצעיר התאמן כל יום במשך שנתיים.',
        answer: 'perseverance',
        wrong: ['canopy', 'communal'],
      },
      {
        clozeEn: 'Under the ____ sky, the city looked grey and quiet.',
        clozeHe: 'תחת השמיים המעוננים, העיר נראתה אפורה ושקטה.',
        answer: 'overcast',
        wrong: ['resolution', 'solidarity'],
      },
      {
        clozeEn: 'In some families it is ____ to give children coins on Hanukkah.',
        clozeHe: 'בכמה משפחות נהוג לתת לילדים מטבעות בחנוכה.',
        answer: 'customary',
        wrong: ['kindle', 'hospitality'],
      },
      {
        clozeEn: 'After the long hike, we stopped at a spring to ____ our water bottles.',
        clozeHe: 'אחרי הטיול הארוך עצרנו במעיין כדי למלא מחדש את בקבוקי המים שלנו.',
        answer: 'replenish',
        wrong: ['perseverance', 'renewal'],
      },
    ],
    grammar: [
      {
        questionEn: 'Choose the correct connector: "The sukkah was beautiful. ____, it collapsed in the first strong wind."',
        correct: 'However',
        wrong: ['Moreover', 'Furthermore'],
        explainHe: 'המשפט השני מנוגד לראשון (יפה, אבל קרסה), ולכן However.',
        hintHe: 'האם המשפט השני ממשיך באותו כיוון או מפתיע ומשנה כיוון?',
      },
      {
        questionEn: 'Choose the correct word: "____ the roads were icy, the family drove to Grandma\'s for the holiday."',
        correct: 'Although',
        wrong: ['Despite', 'In spite of'],
        explainHe: 'אחרי החסר בא משפט שלם (the roads were icy), ולכן Although.',
        hintHe: 'מה בא אחרי החסר: שם עצם או משפט שלם עם נושא ופועל?',
      },
      {
        questionEn: 'Choose the correct word: "____ the rain, the festival lights were turned on."',
        correct: 'In spite of',
        wrong: ['Although', 'Even though'],
        explainHe: 'the rain הוא שם עצם, ולכן In spite of.',
        hintHe: 'אחרי החסר בא רק שם עצם. איזו אפשרות מתאימה לפני שם עצם?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'Despite feeling cold, the children stayed for the ceremony.',
        wrong: [
          'Despite of feeling cold, the children stayed for the ceremony.',
          'Although feeling of cold, the children stayed for the ceremony.',
        ],
        explainHe: 'despite בא בלי of, ואחריו יכול לבוא פועל עם ing (feeling).',
        hintHe: 'אחת השגיאות הנפוצות היא להוסיף מילה מיותרת אחרי מילת הוויתור. בדקו כל משפט.',
      },
      {
        questionEn: 'Choose the correct connector: "Pomegranates are tasty. ____, they are full of vitamins."',
        correct: 'Furthermore',
        wrong: ['In contrast', 'Nevertheless'],
        explainHe: 'המשפט השני מוסיף יתרון נוסף, ולכן Furthermore.',
        hintHe: 'האם המשפט השני מוסיף עוד יתרון או מציג חיסרון?',
      },
      {
        questionEn: 'Which sentence shows concession correctly?',
        correct: 'Although winter is short in Israel, it brings most of the year\'s rain.',
        wrong: [
          'Despite winter is short in Israel, it brings most of the year\'s rain.',
          'Although winter is short in Israel, but it brings most of the year\'s rain.',
        ],
        explainHe: 'although בא לפני משפט שלם, ולא מוסיפים but בחלק השני.',
        hintHe: 'בדקו מה בא אחרי מילת הוויתור, והאם יש מילת ניגוד מיותרת בחלק השני.',
      },
    ],
    sentences: [
      { en: 'Although the evening was cold, everyone ate in the sukkah.', he: 'למרות שהערב היה קר, כולם אכלו בסוכה.' },
      { en: 'Despite the storm, the menorah stayed lit in the window.', he: 'למרות הסערה, החנוכייה נשארה דולקת בחלון.' },
      { en: 'The holiday is short. However, its message lasts all year.', he: 'החג קצר. אולם המסר שלו נמשך כל השנה.' },
      { en: 'Winter rains fill the wells; moreover, they clean the air.', he: 'גשמי החורף ממלאים את הבארות; יתרה מזאת, הם מנקים את האוויר.' },
      { en: 'In spite of the traffic, we arrived before the holiday began.', he: 'למרות הפקקים, הגענו לפני שהחג התחיל.' },
      { en: 'Many people make resolutions, although few keep them.', he: 'אנשים רבים מקבלים החלטות, למרות שמעטים עומדים בהן.' },
    ],
    passages: [
      {
        passageEn:
          'Every autumn, a small town in the Galilee builds a giant sukkah in its central park. Although the project takes two weeks, hundreds of residents volunteer to help. The walls are painted by schoolchildren, and local farmers donate fruit for decoration. Moreover, every evening of the festival, a different community group hosts a free dinner there. Despite the crowds, visitors say the atmosphere feels warm and personal.',
        passageHe:
          'בכל סתיו עיירה קטנה בגליל בונה סוכת ענק בפארק המרכזי שלה. למרות שהמיזם נמשך שבועיים, מאות תושבים מתנדבים לעזור. את הקירות צובעים תלמידי בית הספר, וחקלאים מקומיים תורמים פירות לקישוט. יתרה מזאת, בכל ערב של החג קבוצה קהילתית אחרת מארחת שם ארוחת ערב בחינם. למרות ההמונים, המבקרים אומרים שהאווירה מרגישה חמה ואישית.',
        questions: [
          {
            questionEn: 'Who paints the walls of the giant sukkah?',
            questionHe: 'מי צובע את הקירות של סוכת הענק?',
            correct: 'The walls are painted by schoolchildren.',
            wrong: ['The walls are painted by local farmers.', 'The walls are painted by visitors.'],
          },
          {
            questionEn: 'What happens every evening of the festival?',
            questionHe: 'מה קורה בכל ערב של החג?',
            correct: 'A different community group hosts a free dinner.',
            wrong: ['Farmers sell fruit in the park.', 'The sukkah is closed to visitors.'],
          },
          {
            questionEn: 'How do visitors describe the atmosphere?',
            questionHe: 'איך המבקרים מתארים את האווירה?',
            correct: 'They say it feels warm and personal.',
            wrong: ['They say it feels cold and crowded.', 'They say it feels formal and quiet.'],
          },
        ],
      },
      {
        passageEn:
          'Israel is a small country; however, its winter weather varies greatly from region to region. The Golan Heights may receive snow, whereas Eilat stays sunny and warm. Most precipitation falls between November and March. Although rainy days are relatively few, a single storm can cause floods in the desert. Therefore, hikers are warned to check the forecast before entering dry riverbeds.',
        passageHe:
          'ישראל היא מדינה קטנה; אולם מזג האוויר שלה בחורף משתנה מאוד מאזור לאזור. ברמת הגולן עשוי לרדת שלג, ואילו אילת נשארת שמשית וחמימה. רוב המשקעים יורדים בין נובמבר למרץ. למרות שימי הגשם מעטים יחסית, סערה אחת יכולה לגרום לשיטפונות במדבר. לכן מזהירים מטיילים לבדוק את התחזית לפני שהם נכנסים לערוצי נחלים יבשים.',
        questions: [
          {
            questionEn: 'How is the winter weather in Eilat described?',
            questionHe: 'איך מתואר מזג האוויר בחורף באילת?',
            correct: 'Eilat stays sunny and warm.',
            wrong: ['Eilat receives snow every year.', 'Eilat has floods every week.'],
          },
          {
            questionEn: 'When does most precipitation fall?',
            questionHe: 'מתי יורדים רוב המשקעים?',
            correct: 'Between November and March.',
            wrong: ['Between April and June.', 'Only in August.'],
          },
          {
            questionEn: 'Why are hikers warned to check the forecast?',
            questionHe: 'למה מזהירים מטיילים לבדוק את התחזית?',
            correct: 'A single storm can cause floods in the desert.',
            wrong: ['Snow can block the roads in Eilat.', 'The riverbeds are always full of water.'],
          },
        ],
      },
    ],
  },
  // Unit 32: spring and summer festivals; past modals, result connectors
  32: {
    vocabulary: [
      {
        clozeEn: 'The comedy show was a sharp ____ of television news.',
        clozeHe: 'מופע הקומדיה היה סאטירה חדה על חדשות הטלוויזיה.',
        answer: 'satire',
        wrong: ['milestone', 'itinerary'],
      },
      {
        clozeEn: 'The letter was ____, so nobody knew who had written it.',
        clozeHe: 'המכתב היה אנונימי, ולכן איש לא ידע מי כתב אותו.',
        answer: 'anonymous',
        wrong: ['agricultural', 'diverse'],
      },
      {
        clozeEn: 'She was a ____ in computer science when few women studied it.',
        clozeHe: 'היא הייתה חלוצה במדעי המחשב בתקופה שבה מעט נשים למדו את התחום.',
        answer: 'pioneer',
        wrong: ['satire', 'retrospect'],
      },
      {
        clozeEn: 'Our ____ for the trip includes a night in a desert camp.',
        clozeHe: 'מסלול הטיול שלנו כולל לילה במחנה במדבר.',
        answer: 'itinerary',
        wrong: ['merriment', 'emancipation'],
      },
      {
        clozeEn: 'The school is proud of its ____ student body from many backgrounds.',
        clozeHe: 'בית הספר גאה בציבור התלמידים המגוון שלו, שמגיע מרקעים רבים.',
        answer: 'diverse',
        wrong: ['anonymous', 'pioneer'],
      },
      {
        clozeEn: 'Learning to ride a bike is an exciting ____ for a child.',
        clozeHe: 'ללמוד לרכוב על אופניים זו אבן דרך מרגשת לילד.',
        answer: 'milestone',
        wrong: ['reforestation', 'rejuvenate'],
      },
    ],
    grammar: [
      {
        questionEn: 'Choose the correct modal: "The forest is full of tall trees. People ____ them decades ago."',
        correct: 'must have planted',
        wrong: ['should have planted', 'must plant'],
        explainHe: 'העצים הגבוהים הם ראיה, והמסקנה בטוחה ועל העבר: must have + V3.',
        hintHe: 'יש ראיה ברורה, והפעולה קרתה לפני שנים רבות. איזה מבנה מביע הסקה בטוחה על העבר?',
      },
      {
        questionEn: 'Choose the correct modal: "We arrived late and missed the parade. We ____ earlier."',
        correct: 'should have left',
        wrong: ['must have left', 'might have left'],
        explainHe: 'זו ביקורת על מה שלא עשינו בעבר: should have + V3.',
        hintHe: 'הדובר מצטער על בחירה שלו. איזה מודל מראה ביקורת על העבר?',
      },
      {
        questionEn: 'Choose the correct modal: "I am not sure where my mask is. I ____ it at the party."',
        correct: 'might have left',
        wrong: ['must have left', 'should have left'],
        explainHe: 'הדובר לא בטוח, ולכן זו אפשרות בלבד: might have + V3.',
        hintHe: 'הדובר אומר שהוא לא בטוח. איזה מודל מביע אפשרות ולא ודאות?',
      },
      {
        questionEn: 'Choose the correct connector: "The summer was extremely hot. ____, many families spent their vacation in the north."',
        correct: 'Consequently',
        wrong: ['Nevertheless', 'In contrast'],
        explainHe: 'החופשה בצפון היא תוצאה של החום, ולכן Consequently.',
        hintHe: 'האם המשפט השני הוא תוצאה של הראשון, או שהוא מפתיע ומנוגד לו?',
      },
      {
        questionEn: 'Which sentence is punctuated correctly?',
        correct: 'The matza ran out; consequently, we bought more on the way home.',
        wrong: [
          'The matza ran out, consequently we bought more on the way home.',
          'The matza ran out consequently, we bought more on the way home.',
        ],
        explainHe: 'לפני consequently שמחבר שני משפטים שלמים באה נקודה-פסיק, ואחריו פסיק.',
        hintHe: 'בדקו את הסימנים משני הצדדים של מילת התוצאה.',
      },
      {
        questionEn: 'What does this sentence mean? "The organisers should have checked the weather forecast."',
        correct: 'The organisers did not check the forecast, and that was a mistake.',
        wrong: [
          'The organisers checked the forecast very carefully.',
          'The organisers will check the forecast tomorrow.',
        ],
        explainHe: 'should have + V3 מתאר דבר שהיה צריך לקרות בעבר ולא קרה.',
        hintHe: 'המבנה מבקר פעולה בעבר. האם הפעולה נעשתה באמת?',
      },
    ],
    sentences: [
      { en: 'Someone must have hidden the afikoman under the sofa.', he: 'מישהו בטח החביא את האפיקומן מתחת לספה.' },
      { en: 'We should have booked the campsite before the holiday.', he: 'היינו צריכים להזמין את מקום הקמפינג לפני החג.' },
      { en: 'The bakery sold out; therefore, we made cheesecake at home.', he: 'המאפייה מכרה הכול; לכן אפינו עוגת גבינה בבית.' },
      { en: 'The fireworks might have frightened the dogs in the neighbourhood.', he: 'ייתכן שהזיקוקים הפחידו את הכלבים בשכונה.' },
      { en: 'Schools closed for summer; as a result, the beaches filled up.', he: 'בתי הספר נסגרו לקיץ; כתוצאה מכך, החופים התמלאו.' },
      { en: 'The costume must have taken hours to sew.', he: 'התחפושת בטח לקחה שעות לתפור.' },
    ],
    passages: [
      {
        passageEn:
          'Every Purim, the students of a high school in Jerusalem perform a short satire about their teachers. This year the show was written by an anonymous group of twelfth-graders. The jokes were so accurate that the writers must have watched the teachers very closely. The principal laughed louder than anyone. However, one teacher said the students should have asked permission before using his famous catchphrase.',
        passageHe:
          'בכל פורים התלמידים של תיכון בירושלים מעלים סאטירה קצרה על המורים שלהם. השנה המופע נכתב על ידי קבוצה אנונימית של תלמידי י״ב. הבדיחות היו מדויקות כל כך, שהכותבים בטח צפו במורים מקרוב מאוד. המנהל צחק חזק יותר מכולם. אולם מורה אחד אמר שהתלמידים היו צריכים לבקש רשות לפני שהשתמשו במשפט המפורסם שלו.',
        questions: [
          {
            questionEn: 'Who wrote this year\'s show?',
            questionHe: 'מי כתב את המופע השנה?',
            correct: 'An anonymous group of twelfth-graders.',
            wrong: ['The principal and two teachers.', 'A famous comedy writer.'],
          },
          {
            questionEn: 'What does the accuracy of the jokes suggest?',
            questionHe: 'על מה מעיד הדיוק של הבדיחות?',
            correct: 'The writers must have watched the teachers very closely.',
            wrong: ['The teachers must have written the jokes.', 'The writers must have copied an old show.'],
          },
          {
            questionEn: 'What did one teacher say about the students?',
            questionHe: 'מה אמר אחד המורים על התלמידים?',
            correct: 'They should have asked permission to use his catchphrase.',
            wrong: ['They should have performed the show twice.', 'They should have invited more parents.'],
          },
        ],
      },
      {
        passageEn:
          'On Independence Day, many Israelis head for national parks and forests. In recent years, the parks have become extremely crowded; consequently, some now limit the number of visitors. Families are therefore advised to book their places online in advance. Rangers also ask visitors to take their rubbish home, since the parks have limited staff. As a result of these rules, the forests stay cleaner after the holiday.',
        passageHe:
          'ביום העצמאות ישראלים רבים יוצאים לגנים לאומיים וליערות. בשנים האחרונות הגנים נעשו צפופים מאוד; כתוצאה מכך, חלקם מגבילים היום את מספר המבקרים. לכן ממליצים למשפחות להזמין מקום באינטרנט מראש. הפקחים גם מבקשים מהמבקרים לקחת את האשפה שלהם הביתה, כי בגנים יש מעט עובדים. כתוצאה מהכללים האלה, היערות נשארים נקיים יותר אחרי החג.',
        questions: [
          {
            questionEn: 'Why do some parks now limit the number of visitors?',
            questionHe: 'למה חלק מהגנים מגבילים היום את מספר המבקרים?',
            correct: 'The parks have become extremely crowded.',
            wrong: ['The parks have no forests left.', 'The parks are closed on holidays.'],
          },
          {
            questionEn: 'What are families advised to do?',
            questionHe: 'מה ממליצים למשפחות לעשות?',
            correct: 'Book their places online in advance.',
            wrong: ['Arrive at the park before sunrise.', 'Bring their own rangers.'],
          },
          {
            questionEn: 'What is the result of these rules?',
            questionHe: 'מהי התוצאה של הכללים האלה?',
            correct: 'The forests stay cleaner after the holiday.',
            wrong: ['The forests become more crowded.', 'The rangers have more work.'],
          },
        ],
      },
    ],
  },
};
