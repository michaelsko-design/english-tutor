import type { ExamBankPack } from '../../../examBank/types';

/**
 * Core-plus pack, grade 7 exam bank (Feature 43), by the unit number in the mission ids. New
 * questions only. The last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_PLUS_GRADE_7_EXAM_BANK: ExamBankPack = {
  // Unit 21: much / many, a few / a little
  21: {
    vocabulary: [
      {
        clozeEn: 'Chocolate is the most important ____ in my brownies.',
        clozeHe: 'שוקולד הוא המרכיב הכי חשוב בבראוניז שלי.',
        answer: 'ingredient',
        wrong: ['crowd', 'profit'],
      },
      {
        clozeEn: 'The shop gives every ____ a free cookie on Fridays.',
        clozeHe: 'החנות נותנת לכל לקוח עוגייה בחינם בימי שישי.',
        answer: 'customer',
        wrong: ['spice', 'budget'],
      },
      {
        clozeEn: 'Grandma always cooks a huge ____ of rice for the family.',
        clozeHe: 'סבתא תמיד מבשלת כמות ענקית של אורז למשפחה.',
        answer: 'amount',
        wrong: ['customer', 'recipe'],
      },
      {
        clozeEn: 'Can you ____ a little sugar on the strawberries?',
        clozeHe: 'אתם יכולים לפזר קצת סוכר על התותים?',
        answer: 'sprinkle',
        wrong: ['earn', 'crowd'],
      },
      {
        clozeEn: 'We have a small ____, so we can’t buy an expensive oven.',
        clozeHe: 'יש לנו תקציב קטן, אז אנחנו לא יכולים לקנות תנור יקר.',
        answer: 'budget',
        wrong: ['portion', 'spice'],
      },
      {
        clozeEn: 'My sister wants to ____ money for a new bike, so she walks dogs.',
        clozeHe: 'אחותי רוצה להרוויח כסף לאופניים חדשים, אז היא מוציאה כלבים לטיול.',
        answer: 'earn',
        wrong: ['taste', 'amount'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the question: "How ____ homework do you have tonight?"',
        correct: 'much',
        wrong: ['many', 'few'],
        explainHe: 'homework באנגלית הוא דבר שלא סופרים, ולכן How much homework.',
        hintHe: 'האם באנגלית אפשר לספור שיעורי בית אחד אחד? חשבו אם יש למילה צורת רבים.',
      },
      {
        questionEn: 'Complete the sentence: "There aren’t ____ students in the library today."',
        correct: 'many',
        wrong: ['much', 'a little'],
        explainHe: 'students הם דבר שסופרים, ובשלילה משתמשים ב-many.',
        hintHe: 'אפשר לספור תלמידים. איזו מילת כמות מתאימה לשם עצם ברבים במשפט שלילי?',
      },
      {
        questionEn: 'Complete the sentence: "I’m tired. I need ____ rest before the game."',
        correct: 'a little',
        wrong: ['a few', 'many'],
        explainHe: 'rest (מנוחה) הוא דבר שלא סופרים, ולכן a little.',
        hintHe: 'האם אפשר לספור מנוחה? בחרו מילת כמות לדבר שאין לו צורת רבים.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We only have a few days until the holiday.',
        wrong: ['We only have a little days until the holiday.', 'We only have a few day until the holiday.'],
        explainHe: 'days הם דבר שסופרים, ולכן a few, ושם העצם בא ברבים.',
        hintHe: 'אפשר לספור ימים. בדקו גם את מילת הכמות וגם את הצורה של שם העצם אחריה.',
      },
      {
        questionEn: 'Complete the question: "How ____ bottles of water should we bring?"',
        correct: 'many',
        wrong: ['much', 'little'],
        explainHe: 'השאלה היא על bottles (בקבוקים), שאותם סופרים, ולכן How many.',
        hintHe: 'שימו לב לשם העצם שאחרי הרווח: האם סופרים אותו או את המים?',
      },
      {
        questionEn: 'Complete the sentence: "Don’t put ____ salt in the salad. Dad doesn’t like it."',
        correct: 'too much',
        wrong: ['too many', 'a few'],
        explainHe: 'salt הוא דבר שלא סופרים, ולכן too much salt (יותר מדי מלח).',
        hintHe: 'מלח לא סופרים. בחרו את הביטוי שמתאים לכמות גדולה מדי של דבר שלא סופרים.',
      },
    ],
    sentences: [
      { en: 'How many slices of pizza did you eat?', he: 'כמה משולשי פיצה אכלתם?' },
      { en: 'There isn’t much time before the bus leaves.', he: 'אין הרבה זמן לפני שהאוטובוס יוצא.' },
      { en: 'I added a little lemon juice to the soup.', he: 'הוספתי קצת מיץ לימון למרק.' },
      { en: 'A few customers asked for extra cheese.', he: 'כמה לקוחות ביקשו תוספת גבינה.' },
      { en: 'We didn’t earn much money at the school fair.', he: 'לא הרווחנו הרבה כסף ביריד של בית הספר.' },
      { en: 'Only a few people came because of the rain.', he: 'רק כמה אנשים הגיעו בגלל הגשם.' },
    ],
    passages: [
      {
        passageEn:
          'Every Thursday, Ben bakes cookies for the school bake sale. This week, he didn’t have much flour, so he asked his neighbor for some. He made sixty cookies and added a little cinnamon to each one. By lunchtime, the cookies were gone. Ben earned enough money to buy new books for the class library.',
        passageHe:
          'בכל יום חמישי, בן אופה עוגיות למכירת העוגות של בית הספר. השבוע לא היה לו הרבה קמח, אז הוא ביקש קצת מהשכן שלו. הוא הכין שישים עוגיות והוסיף קצת קינמון לכל אחת. עד שעת הצהריים העוגיות נגמרו. בן הרוויח מספיק כסף כדי לקנות ספרים חדשים לספריית הכיתה.',
        questions: [
          {
            questionEn: 'Why did Ben ask his neighbor for help?',
            questionHe: 'מדוע בן ביקש עזרה מהשכן שלו?',
            correct: 'He didn’t have much flour.',
            wrong: ['His oven was broken.', 'He needed more eggs.'],
          },
          {
            questionEn: 'How many cookies did Ben make?',
            questionHe: 'כמה עוגיות בן הכין?',
            correct: 'Sixty cookies.',
            wrong: ['Sixteen cookies.', 'Six cookies.'],
          },
          {
            questionEn: 'What did Ben buy with the money?',
            questionHe: 'מה בן קנה בכסף?',
            correct: 'New books for the class library.',
            wrong: ['A new oven for the school.', 'Flour for next week.'],
          },
        ],
      },
      {
        passageEn:
          'Rotem’s family opened a small juice stand at the Carmel Market. On the first day, only a few customers stopped to buy a drink. Rotem decided to give free tastes of her mango and mint juice. Soon a crowd formed in front of the stand. At the end of the week, the family counted their profit and smiled.',
        passageHe:
          'המשפחה של רותם פתחה דוכן מיצים קטן בשוק הכרמל. ביום הראשון רק כמה לקוחות עצרו לקנות משקה. רותם החליטה לתת טעימות חינם ממיץ המנגו והנענע שלה. עד מהרה נוצר המון אנשים מול הדוכן. בסוף השבוע המשפחה ספרה את הרווח שלה וחייכה.',
        questions: [
          {
            questionEn: 'Where did Rotem’s family open their juice stand?',
            questionHe: 'איפה המשפחה של רותם פתחה את דוכן המיצים?',
            correct: 'At the Carmel Market.',
            wrong: ['Near the school gate.', 'On the beach in Eilat.'],
          },
          {
            questionEn: 'What did Rotem decide to give?',
            questionHe: 'מה רותם החליטה לתת?',
            correct: 'Free tastes of her mango and mint juice.',
            wrong: ['Free sandwiches to every customer.', 'Two drinks for the price of one.'],
          },
          {
            questionEn: 'What happened after the free tastes?',
            questionHe: 'מה קרה אחרי הטעימות בחינם?',
            correct: 'A crowd formed in front of the stand.',
            wrong: ['The family closed the stand early.', 'The market ran out of mangoes.'],
          },
        ],
      },
    ],
  },
  // Unit 22: too / enough, comparatives review
  22: {
    vocabulary: [
      {
        clozeEn: 'My ____ is almost empty, so I can’t play music for long.',
        clozeHe: 'הסוללה שלי כמעט ריקה, אז אי אפשר לנגן מוזיקה הרבה זמן.',
        answer: 'battery',
        wrong: ['effort', 'invention'],
      },
      {
        clozeEn: 'This suitcase is too ____ for my little sister to carry.',
        clozeHe: 'המזוודה הזאת כבדה מדי בשביל אחותי הקטנה.',
        answer: 'heavy',
        wrong: ['cheap', 'reliable'],
      },
      {
        clozeEn: 'Before you buy new sneakers, ____ the prices in three shops.',
        clozeHe: 'לפני שאתם קונים נעלי ספורט חדשות, השוו את המחירים בשלוש חנויות.',
        answer: 'compare',
        wrong: ['charge', 'battery'],
      },
      {
        clozeEn: 'The new train is very ____: it climbs the mountain in ten minutes.',
        clozeHe: 'הרכבת החדשה חזקה מאוד: היא מטפסת על ההר בעשר דקות.',
        answer: 'powerful',
        wrong: ['cheap', 'heavy'],
      },
      {
        clozeEn: 'Our coach is happy with our hard work and ____ this season.',
        clozeHe: 'המאמן שלנו מרוצה מהעבודה הקשה ומהמאמץ שלנו בעונה הזאת.',
        answer: 'effort',
        wrong: ['screen', 'battery'],
      },
      {
        clozeEn: 'I want a ____ bike that never breaks on the way to school.',
        clozeHe: 'אני רוצה אופניים אמינים שאף פעם לא מתקלקלים בדרך לבית הספר.',
        answer: 'reliable',
        wrong: ['expensive', 'heavy'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "The water is ____ cold for swimming today."',
        correct: 'too',
        wrong: ['enough', 'very enough'],
        explainHe: 'המים קרים יותר ממה שנעים לשחות בהם, ולכן too cold (קרים מדי).',
        hintHe: 'אי אפשר לשחות היום. האם הבעיה היא שיש יותר מדי קור? חשבו גם איפה כל מילה עומדת.',
      },
      {
        questionEn: 'Complete the sentence: "Are you ____ to watch this movie? It’s for ages 16 and up."',
        correct: 'old enough',
        wrong: ['enough old', 'too old'],
        explainHe: 'השאלה היא אם הגיל מספיק, ו-enough בא אחרי שם התואר: old enough.',
        hintHe: 'הסרט מגיל 16. האם חסר גיל או שיש יותר מדי? ושימו לב לסדר המילים.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'My new phone is better than my old one.',
        wrong: ['My new phone is gooder than my old one.', 'My new phone is more better than my old one.'],
        explainHe: 'good היא מילה יוצאת דופן: ההשוואה שלה היא better, בלי more.',
        hintHe: 'ההשוואה של המילה "טוב" לא בנויה לפי הכלל הרגיל. בחרו את הצורה המיוחדת שלה.',
      },
      {
        questionEn: 'Complete the sentence: "This laptop is ____ than that tablet."',
        correct: 'more expensive',
        wrong: ['expensiver', 'most expensive'],
        explainHe: 'expensive היא מילה ארוכה, ולכן מוסיפים more לפניה: more expensive than.',
        hintHe: 'המילה "יקר" באנגלית ארוכה. ויש במשפט than, כלומר משווים בין שני דברים בלבד.',
      },
      {
        questionEn: 'Complete the sentence: "My bag is ____ yours. They weigh the same."',
        correct: 'as heavy as',
        wrong: ['heavier as', 'as heavy than'],
        explainHe: 'כששני דברים שווים משתמשים ב-as … as: as heavy as.',
        hintHe: 'שני התיקים שוקלים אותו דבר. איזה מבנה מראה ששני דברים שווים?',
      },
      {
        questionEn: 'Complete the sentence: "The screen isn’t ____ to read in the sun."',
        correct: 'bright enough',
        wrong: ['enough bright', 'too bright'],
        explainHe: 'חסר אור כדי לקרוא, ו-enough בא אחרי שם התואר: bright enough.',
        hintHe: 'אי אפשר לקרוא בשמש כי המסך חלש. האם חסר אור או שיש יותר מדי? ובדקו את סדר המילים.',
      },
    ],
    sentences: [
      { en: 'This jacket is too big for me.', he: 'המעיל הזה גדול מדי בשבילי.' },
      { en: 'Is the room warm enough for the baby?', he: 'החדר חם מספיק בשביל התינוק?' },
      { en: 'Tel Aviv is bigger than Nahariya.', he: 'תל אביב גדולה יותר מנהריה.' },
      { en: 'My old laptop was slower than this one.', he: 'המחשב הנייד הישן שלי היה איטי יותר מזה.' },
      { en: 'The new game isn’t as exciting as the old one.', he: 'המשחק החדש לא מרגש כמו הישן.' },
      { en: 'We didn’t have enough chairs for all the guests.', he: 'לא היו לנו מספיק כיסאות לכל האורחים.' },
    ],
    passages: [
      {
        passageEn:
          'Shai wanted a new bike for his birthday. The first bike in the shop was too expensive. The second bike was cheaper, but it was too small for him. Finally, the shop owner showed him a blue bike. It was light, fast and big enough for a tall teenager. Shai rode it home with a huge smile.',
        passageHe:
          'שי רצה אופניים חדשים ליום ההולדת שלו. האופניים הראשונים בחנות היו יקרים מדי. האופניים השניים היו זולים יותר, אבל הם היו קטנים מדי בשבילו. לבסוף בעל החנות הראה לו אופניים כחולים. הם היו קלים, מהירים וגדולים מספיק בשביל נער גבוה. שי רכב עליהם הביתה עם חיוך ענק.',
        questions: [
          {
            questionEn: 'What was wrong with the first bike?',
            questionHe: 'מה הייתה הבעיה עם האופניים הראשונים?',
            correct: 'It was too expensive.',
            wrong: ['It was too heavy.', 'It was the wrong color.'],
          },
          {
            questionEn: 'Why didn’t Shai take the second bike?',
            questionHe: 'מדוע שי לא לקח את האופניים השניים?',
            correct: 'It was too small for him.',
            wrong: ['It was more expensive than the first.', 'It was broken.'],
          },
          {
            questionEn: 'What color was the bike that Shai bought?',
            questionHe: 'באיזה צבע היו האופניים ששי קנה?',
            correct: 'Blue.',
            wrong: ['Red.', 'Black.'],
          },
        ],
      },
      {
        passageEn:
          'Two students in Netanya built paper airplanes for a science competition. Hila’s plane was longer and heavier than Avi’s plane. Avi’s plane was lighter, so it flew higher in the wind. However, Hila’s plane flew farther across the gym. The judges said both planes were excellent, and the two friends shared first prize.',
        passageHe:
          'שני תלמידים בנתניה בנו מטוסי נייר לתחרות מדע. המטוס של הילה היה ארוך יותר וכבד יותר מהמטוס של אבי. המטוס של אבי היה קל יותר, ולכן הוא עף גבוה יותר ברוח. אבל המטוס של הילה עף רחוק יותר לאורך האולם. השופטים אמרו ששני המטוסים מצוינים, ושני החברים חלקו את הפרס הראשון.',
        questions: [
          {
            questionEn: 'Whose plane was heavier?',
            questionHe: 'המטוס של מי היה כבד יותר?',
            correct: 'Hila’s plane.',
            wrong: ['Avi’s plane.', 'The judges’ plane.'],
          },
          {
            questionEn: 'Why did Avi’s plane fly higher?',
            questionHe: 'מדוע המטוס של אבי עף גבוה יותר?',
            correct: 'It was lighter.',
            wrong: ['It was longer.', 'It was made of metal.'],
          },
          {
            questionEn: 'Who won first prize?',
            questionHe: 'מי זכה בפרס הראשון?',
            correct: 'The two friends shared it.',
            wrong: ['Only Hila won it.', 'Another school won it.'],
          },
        ],
      },
    ],
  },
};
