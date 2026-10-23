import type { ExamBankPack } from '../../../examBank/types';

/**
 * The holidays pack's grade 9 exam bank (Feature 43), by the unit number in its mission ids.
 * Review-level grammar with holiday words. The last 2 items of each list and the second passage
 * are for the mock exam.
 */
export const HOLIDAYS_GRADE_9_EXAM_BANK: ExamBankPack = {
  // Autumn and winter: Present Perfect, Past Continuous, going to, contrast, First Conditional
  31: {
    vocabulary: [
      {
        clozeEn: 'Grandma cut a ____ in half and gave us the red seeds.',
        clozeHe: 'סבתא חתכה רימון לשניים ונתנה לנו את הגרעינים האדומים.',
        answer: 'pomegranate',
        wrong: ['flame', 'shelter'],
      },
      {
        clozeEn: 'We hang paper chains and lights to ____ our classroom for the holiday.',
        clozeHe: 'אנחנו תולים שרשראות נייר ואורות כדי לקשט את הכיתה שלנו לחג.',
        answer: 'decorate',
        wrong: ['reflect', 'gather'],
      },
      {
        clozeEn: 'The bus stop has a roof, so it gives ____ from the rain.',
        clozeHe: 'לתחנת האוטובוס יש גג, אז היא נותנת מחסה מהגשם.',
        answer: 'shelter',
        wrong: ['harvest', 'greeting'],
      },
      {
        clozeEn: 'Farmers work long days during the olive ____ in autumn.',
        clozeHe: 'חקלאים עובדים ימים ארוכים בזמן מסיק הזיתים בסתיו.',
        answer: 'harvest',
        wrong: ['miracle', 'resolution'],
      },
      {
        clozeEn: 'We got caught in a sudden ____ on the way home.',
        clozeHe: 'נתפסנו בגשם זלעפות פתאומי בדרך הביתה.',
        answer: 'downpour',
        wrong: ['pomegranate', 'greeting'],
      },
      {
        clozeEn: 'This classroom is only ____; our new building will be ready next month.',
        clozeHe: 'הכיתה הזאת היא רק זמנית; הבניין החדש שלנו יהיה מוכן בחודש הבא.',
        answer: 'temporary',
        wrong: ['flame', 'harvest'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "My uncle ____ in Eilat since 2018."',
        correct: 'has lived',
        wrong: ['lives', 'lived'],
        explainHe: 'since 2018 מראה שזה התחיל בעבר ונמשך עד היום, ולכן Present Perfect: has lived.',
        hintHe: 'יש במשפט נקודת התחלה בעבר, והמצב עדיין נמשך. איזה זמן מחבר בין עבר להווה?',
      },
      {
        questionEn: 'Complete the sentence: "We ____ apples into honey when the guests knocked on the door."',
        correct: 'were dipping',
        wrong: ['dipped were', 'are dipping'],
        explainHe: 'הפעולה נמשכה כשהאורחים דפקו בדלת, ולכן Past Continuous: were + V-ing.',
        hintHe: 'פעולה ארוכה בעבר נקטעה על ידי פעולה קצרה. בדקו את הזמן ואת סדר המילים.',
      },
      {
        questionEn: 'Choose the correct sentence:',
        correct: 'Although it was cold, we slept in the sukkah.',
        wrong: ['Although it was cold, but we slept in the sukkah.', 'However it was cold, we slept in the sukkah.'],
        explainHe: 'although מחבר שני חלקים באותו משפט, ולא מוסיפים אחריו but. however פותח משפט חדש.',
        hintHe: 'בדקו כמה מילות ניגוד יש בכל משפט, ואיזו מהן מחברת שני חלקים בתוך אותו משפט.',
      },
      {
        questionEn: 'Complete the sentence: "If it rains tomorrow, we ____ the party inside."',
        correct: 'will have',
        wrong: ['would had', 'have'],
        explainHe: 'תנאי ראשון: if + Present Simple, ובחלק התוצאה will + פועל בסיס.',
        hintHe: 'זה מצב אפשרי בעתיד. מה בא בחלק התוצאה של תנאי ראשון?',
      },
      {
        questionEn: 'Complete the sentence: "Look at the sky over the sukkah! It ____ rain soon."',
        correct: 'is going to',
        wrong: ['goes to', 'is go to'],
        explainHe: 'כשרואים סימן עכשיו (השמיים מעל הסוכה), משתמשים ב-be going to כדי לחזות מה יקרה.',
        hintHe: 'יש סימן ברור עכשיו שמשהו יקרה. איזו תבנית עתיד מתאימה, ומה הצורה המלאה שלה?',
      },
      {
        questionEn: 'Complete the sentence: "Have you ever ____ sufganiyot at home?"',
        correct: 'made',
        wrong: ['make', 'making'],
        explainHe: 'אחרי Have you ever בא V3: made.',
        hintHe: 'השאלה בנויה עם have. איזו צורת פועל באה אחרי have בשאלה כזאת?',
      },
    ],
    sentences: [
      { en: 'We have eaten honey cake every day this week.', he: 'אכלנו עוגת דבש כל יום השבוע.' },
      { en: 'The first rain fell while we were sleeping.', he: 'הגשם הראשון ירד בזמן שישנו.' },
      { en: 'Grandpa has told the Hanukkah story many times.', he: 'סבא סיפר את סיפור חנוכה הרבה פעמים.' },
      { en: 'If the wind gets stronger, we will take down the decorations.', he: 'אם הרוח תתחזק, נוריד את הקישוטים.' },
      { en: 'Although the sukkah was small, twenty guests sat inside.', he: 'למרות שהסוכה הייתה קטנה, עשרים אורחים ישבו בתוכה.' },
      { en: 'My resolution is to help more at home.', he: 'ההחלטה שלי היא לעזור יותר בבית.' },
    ],
    passages: [
      {
        passageEn:
          'Every autumn, Tamar’s family goes to an olive farm near Nazareth. They have helped the farmer with the harvest for five years. This year, while they were picking olives, dark clouds appeared over the hills. However, the rain did not start until the evening. The farmer gave them a bottle of fresh olive oil as a thank-you gift.',
        passageHe:
          'בכל סתיו, המשפחה של תמר נוסעת לחוות זיתים ליד נצרת. הם עוזרים לחקלאי במסיק כבר חמש שנים. השנה, בזמן שהם קטפו זיתים, הופיעו עננים כהים מעל הגבעות. עם זאת, הגשם לא התחיל עד הערב. החקלאי נתן להם בקבוק שמן זית טרי כמתנת תודה.',
        questions: [
          {
            questionEn: 'How long have they helped the farmer?',
            questionHe: 'כמה זמן הם עוזרים לחקלאי?',
            correct: 'For five years.',
            wrong: ['For one month.', 'For ten years.'],
          },
          {
            questionEn: 'When did the rain start?',
            questionHe: 'מתי התחיל הגשם?',
            correct: 'In the evening.',
            wrong: ['In the morning.', 'At noon.'],
          },
          {
            questionEn: 'What did the farmer give the family?',
            questionHe: 'מה החקלאי נתן למשפחה?',
            correct: 'A bottle of fresh olive oil.',
            wrong: ['A basket of olives.', 'A small olive tree.'],
          },
        ],
      },
      {
        passageEn:
          'Hanukkah lasts eight nights, and it usually comes in December. Families light one more candle every evening. In many Israeli schools, students have a short vacation during the holiday. Last year, Daniel was visiting his cousins in Jerusalem when it suddenly snowed. Although the snow melted quickly, he has never forgotten that magical evening.',
        passageHe:
          'חנוכה נמשך שמונה לילות, והוא בדרך כלל חל בדצמבר. משפחות מדליקות נר נוסף בכל ערב. בבתי ספר רבים בישראל יש לתלמידים חופשה קצרה בזמן החג. בשנה שעברה, דניאל ביקר את בני הדודים שלו בירושלים כשפתאום ירד שלג. למרות שהשלג נמס מהר, הוא אף פעם לא שכח את הערב הקסום ההוא.',
        questions: [
          {
            questionEn: 'How many nights does Hanukkah last?',
            questionHe: 'כמה לילות נמשך חנוכה?',
            correct: 'Eight nights.',
            wrong: ['Seven nights.', 'Ten nights.'],
          },
          {
            questionEn: 'Where was Daniel when it snowed?',
            questionHe: 'איפה היה דניאל כשירד שלג?',
            correct: 'In Jerusalem, visiting his cousins.',
            wrong: ['At home in Tel Aviv.', 'On a school trip to the north.'],
          },
          {
            questionEn: 'What happened to the snow?',
            questionHe: 'מה קרה לשלג?',
            correct: 'It melted quickly.',
            wrong: ['It stayed for a week.', 'It turned into rain.'],
          },
        ],
      },
    ],
  },
  // Spring and summer: Second Conditional, Present Perfect with for / since, contrast, future forms
  32: {
    vocabulary: [
      {
        clozeEn: 'The spy wore a beard and glasses as a ____.',
        clozeHe: 'המרגל הרכיב זקן ומשקפיים כהסוואה.',
        answer: 'disguise',
        wrong: ['sapling', 'firework'],
      },
      {
        clozeEn: 'Each student planted a small ____ near the school fence.',
        clozeHe: 'כל תלמיד שתל שתיל קטן ליד גדר בית הספר.',
        answer: 'sapling',
        wrong: ['sunscreen', 'ceremony'],
      },
      {
        clozeEn: 'Our class decided to ____ old books to the children’s hospital.',
        clozeHe: 'הכיתה שלנו החליטה לתרום ספרים ישנים לבית החולים לילדים.',
        answer: 'donate',
        wrong: ['freedom', 'vacation'],
      },
      {
        clozeEn: 'The graduation ____ will take place in the school yard.',
        clozeHe: 'טקס הסיום יתקיים בחצר בית הספר.',
        answer: 'ceremony',
        wrong: ['costume', 'dairy'],
      },
      {
        clozeEn: 'Put on ____ before you go out in the midday sun.',
        clozeHe: 'מרחו קרם הגנה לפני שאתם יוצאים לשמש של הצהריים.',
        answer: 'sunscreen',
        wrong: ['independence', 'itinerary'],
      },
      {
        clozeEn: 'People who cannot drink milk often avoid ____ products.',
        clozeHe: 'אנשים שלא יכולים לשתות חלב נמנעים לעיתים קרובות ממוצרי חלב.',
        answer: 'dairy',
        wrong: ['firework', 'disguise'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "If I ____ a superpower, I would make everyone laugh."',
        correct: 'had',
        wrong: ['have', 'will have'],
        explainHe: 'תנאי שני: אחרי if בא Past Simple (had), ובחלק השני would.',
        hintHe: 'זה מצב דמיוני. איזה זמן בא אחרי if בתנאי שני?',
      },
      {
        questionEn: 'Choose the correct sentence:',
        correct: 'If my sister were here, she would help us with the costumes.',
        wrong: [
          'If my sister is here, she would help us with the costumes.',
          'If my sister were here, she will help us with the costumes.',
        ],
        explainHe: 'במצב דמיוני: If + were, ובחלק השני would + פועל בסיס.',
        hintHe: 'זה מצב דמיוני ולא אמיתי. בדקו את שני החלקים: הזמן אחרי if ואת פועל העזר בתוצאה.',
      },
      {
        questionEn: 'Complete the sentence: "We have celebrated Independence Day at the beach ____ 2020."',
        correct: 'since',
        wrong: ['for', 'ago'],
        explainHe: '2020 היא נקודת התחלה, ולכן since.',
        hintHe: 'האם 2020 היא משך של זמן, או הנקודה שבה זה התחיל?',
      },
      {
        questionEn: 'Complete the sentence: "My parents have known our neighbours ____ more than twenty years."',
        correct: 'for',
        wrong: ['since', 'during'],
        explainHe: 'more than twenty years הוא משך זמן, ולכן for.',
        hintHe: 'האם more than twenty years מתאר נקודה בזמן או משך של זמן?',
      },
      {
        questionEn: 'Choose the correct sentence:',
        correct: 'The fireworks were beautiful. However, they were very loud.',
        wrong: [
          'The fireworks were beautiful. Although, they were very loud.',
          'The fireworks were beautiful. However, they was very loud.',
        ],
        explainHe: 'However פותח משפט חדש ובא אחריו פסיק. although לא בא לבד עם פסיק, ועם they משתמשים ב-were.',
        hintHe: 'בדקו איזו מילת ניגוד מתאימה לפתיחת משפט חדש עם פסיק, ואם פועל העזר מתאים לגוף.',
      },
      {
        questionEn: 'Complete the sentence: "If we leave early, we ____ at the beach before noon."',
        correct: 'will arrive',
        wrong: ['would arrived', 'arrive will'],
        explainHe: 'תנאי ראשון: if + Present Simple, ואחר כך will + פועל בסיס.',
        hintHe: 'זו תוכנית אפשרית. בדקו את פועל העזר, את צורת הפועל ואת סדר המילים.',
      },
    ],
    sentences: [
      { en: 'If we had a free week, we would go camping.', he: 'אילו היה לנו שבוע פנוי, היינו יוצאים לקמפינג.' },
      { en: 'Our family has visited the same beach for years.', he: 'המשפחה שלנו מבקרת באותו חוף כבר שנים.' },
      { en: 'The children donated their old toys before Passover.', he: 'הילדים תרמו את הצעצועים הישנים שלהם לפני פסח.' },
      { en: 'We are going to plant an olive tree on Tu BiShvat.', he: 'אנחנו הולכים לשתול עץ זית בט״ו בשבט.' },
      { en: 'Although the costume was heavy, he wore it all day.', he: 'למרות שהתחפושת הייתה כבדה, הוא לבש אותה כל היום.' },
      { en: 'Everyone ate cheesecake at the Shavuot picnic.', he: 'כולם אכלו עוגת גבינה בפיקניק של שבועות.' },
    ],
    passages: [
      {
        passageEn:
          'On Purim, the city of Holon holds a big street parade. This year, Shira and her friends dressed up as famous scientists. Shira wore a white coat and carried a model of the solar system. Although the sun was hot, thousands of people watched the parade for three hours. If it were possible, Shira would celebrate Purim every month!',
        passageHe:
          'בפורים העיר חולון עורכת תהלוכת רחוב גדולה. השנה שירה והחברות שלה התחפשו למדעניות מפורסמות. שירה לבשה חלוק לבן ונשאה דגם של מערכת השמש. למרות שהשמש הייתה חמה, אלפי אנשים צפו בתהלוכה במשך שלוש שעות. אילו זה היה אפשרי, שירה הייתה חוגגת את פורים כל חודש!',
        questions: [
          {
            questionEn: 'Which city holds the big street parade?',
            questionHe: 'איזו עיר עורכת את תהלוכת הרחוב הגדולה?',
            correct: 'Holon.',
            wrong: ['Haifa.', 'Eilat.'],
          },
          {
            questionEn: 'What did Shira carry?',
            questionHe: 'מה שירה נשאה?',
            correct: 'A model of the solar system.',
            wrong: ['A big umbrella.', 'A basket of sweets.'],
          },
          {
            questionEn: 'How long did people watch the parade?',
            questionHe: 'כמה זמן אנשים צפו בתהלוכה?',
            correct: 'For three hours.',
            wrong: ['For one hour.', 'For the whole day.'],
          },
        ],
      },
      {
        passageEn:
          'Since he was ten, Yoav has spent every summer vacation with his grandparents on a farm in the Golan. He feeds the goats, helps in the vegetable garden and swims in a cold stream. This year, he is going to bring his best friend with him. They have already written an itinerary with hikes, picnics and a night under the stars. Yoav’s grandmother promised to make her famous cheese pastries.',
        passageHe:
          'מאז שהיה בן עשר, יואב מבלה כל חופש גדול עם סבא וסבתא שלו בחווה ברמת הגולן. הוא מאכיל את העזים, עוזר בגינת הירקות ושוחה בנחל קר. השנה הוא הולך להביא איתו את החבר הכי טוב שלו. הם כבר כתבו תוכנית מסלול עם טיולים, פיקניקים ולילה תחת הכוכבים. סבתא של יואב הבטיחה להכין את מאפי הגבינה המפורסמים שלה.',
        questions: [
          {
            questionEn: 'Where does Yoav spend every summer vacation?',
            questionHe: 'איפה יואב מבלה כל חופש גדול?',
            correct: 'On his grandparents’ farm in the Golan.',
            wrong: ['At a summer camp by the sea.', 'In a hotel in Eilat.'],
          },
          {
            questionEn: 'Who is Yoav going to bring this year?',
            questionHe: 'את מי יואב הולך להביא השנה?',
            correct: 'His best friend.',
            wrong: ['His younger sister.', 'His dog.'],
          },
          {
            questionEn: 'What did his grandmother promise to make?',
            questionHe: 'מה סבתא שלו הבטיחה להכין?',
            correct: 'Her famous cheese pastries.',
            wrong: ['A chocolate birthday cake.', 'Fresh bread for breakfast.'],
          },
        ],
      },
    ],
  },
};
