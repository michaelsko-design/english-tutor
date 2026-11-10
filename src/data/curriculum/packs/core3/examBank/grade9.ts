import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-3 source's grade 9 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_3_GRADE_9_EXAM_BANK: ExamBankPack = {
  // Unit 23: identity, with relative clauses recycled
  23: {
    vocabulary: [
      {
        clozeEn: 'On the form, write your name, address and ____ (day, month and year).',
        clozeHe: 'בטופס כתבו את השם, הכתובת ותאריך הלידה שלכם (יום, חודש ושנה).',
        answer: 'date of birth',
        wrong: ['in general', 'to be honest'],
      },
      {
        clozeEn: 'My twin brother and I are not the same, but we are very ____.',
        clozeHe: 'אחי התאום ואני לא זהים, אבל אנחנו מאוד דומים.',
        answer: 'similar',
        wrong: ['nowadays', 'originally'],
      },
      {
        clozeEn: 'After we moved to Haifa, it took me a year to ____ there.',
        clozeHe: 'אחרי שעברנו לחיפה, לקח לי שנה להרגיש שם בבית.',
        answer: 'feel at home',
        wrong: ['keep in touch', 'likes and dislikes'],
      },
      {
        clozeEn: 'This is my bedroom. It is a ____ place, so please knock first.',
        clozeHe: 'זה חדר השינה שלי. זה מקום פרטי, אז בבקשה דפקו קודם.',
        answer: 'private',
        wrong: ['shy', 'similar'],
      },
      {
        clozeEn: 'It is not easy to ____ my parents to buy a dog.',
        clozeHe: 'לא קל לשכנע את ההורים שלי לקנות כלב.',
        answer: 'persuade',
        wrong: ['accept', 'feel at home'],
      },
      {
        clozeEn: 'Many people think that money brings ____, but friends are more important.',
        clozeHe: 'הרבה אנשים חושבים שכסף מביא אושר, אבל חברים חשובים יותר.',
        answer: 'happiness',
        wrong: ['nationality', 'society'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete: "I have a neighbor ____ speaks five languages."',
        correct: 'who',
        wrong: ['which', 'where'],
        explainHe: 'neighbor הוא אדם, ולכן who.',
        hintHe: 'האם השכן הוא אדם, דבר או מקום?',
      },
      {
        questionEn: 'Complete: "This is the school ____ my parents met."',
        correct: 'where',
        wrong: ['who', 'which'],
        explainHe: 'the school הוא מקום שבו משהו קרה, ולכן where.',
        hintHe: 'האם החלק הזה מתאר אדם, דבר או מקום שבו קרה משהו?',
      },
      {
        questionEn: 'Complete: "Shabbat is a day ____ is special for many families."',
        correct: 'that',
        wrong: ['who', 'where'],
        explainHe: 'a day הוא דבר (ולא אדם), ולכן that או which.',
        hintHe: 'על מה מדבר החלק הזה של המשפט, ואיזו מילה מתאימה לו?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'The girl who sits behind me is from Nazareth.',
        wrong: ['The girl who she sits behind me is from Nazareth.', 'The girl which sits behind me is from Nazareth.'],
        explainHe: 'the girl היא אדם, ולכן who, ואחרי who לא חוזרים על she.',
        hintHe: 'בדקו את מילת הזיקה, והאם יש מילה מיותרת אחריה.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'The books that I read last summer were great.',
        wrong: ['The books that I read them last summer were great.', 'The books who I read last summer were great.'],
        explainHe: 'books הם דברים, ולכן that, ואחרי that לא חוזרים על them.',
        hintHe: 'בדקו את מילת הזיקה, והאם יש מילה מיותרת אחרי הפועל.',
      },
      {
        questionEn: 'Complete: "People ____ travel a lot often learn languages easily."',
        correct: 'who',
        wrong: ['where', 'which'],
        explainHe: 'people הם אנשים, ולכן who.',
        hintHe: 'על מי מדבר החלק הזה של המשפט?',
      },
    ],
    sentences: [
      { en: 'She is a teenager who loves to draw.', he: 'היא נערה שאוהבת לצייר.' },
      { en: 'This is the street where my father grew up.', he: 'זה הרחוב שבו אבא שלי גדל.' },
      { en: 'My family is originally from Yemen.', he: 'המשפחה שלי היא במקור מתימן.' },
      { en: 'We keep in touch with our friends abroad.', he: 'אנחנו שומרים על קשר עם החברים שלנו בחו״ל.' },
      { en: 'In my opinion, every human is different.', he: 'לדעתי, כל בן אדם שונה.' },
      { en: 'This is a song that my grandmother loves.', he: 'זה שיר שסבתא שלי אוהבת.' },
    ],
    passages: [
      {
        passageEn:
          'Yosef is a teenager who lives in a village in the north. His family is originally from Russia, and his best friend, Ahmad, is from a village nearby. They play in a basketball team that has players of every religion. In general, Yosef says, the team is like a second family where everyone is accepted.',
        passageHe:
          'יוסף הוא נער שגר בכפר בצפון. המשפחה שלו היא במקור מרוסיה, והחבר הכי טוב שלו, אחמד, הוא מכפר סמוך. הם משחקים בקבוצת כדורסל שיש בה שחקנים מכל הדתות. באופן כללי, אומר יוסף, הקבוצה היא כמו משפחה שנייה שבה כולם מתקבלים.',
        questions: [
          {
            questionEn: 'Where is Yosef\'s family originally from?',
            questionHe: 'מאיפה המשפחה של יוסף במקור?',
            correct: 'Russia.',
            wrong: ['A village nearby.', 'The south of Israel.'],
          },
          {
            questionEn: 'What does Yosef play?',
            questionHe: 'במה יוסף משחק?',
            correct: 'Basketball.',
            wrong: ['Football.', 'Tennis.'],
          },
          {
            questionEn: 'What is the team like for Yosef?',
            questionHe: 'למה דומה הקבוצה בשביל יוסף?',
            correct: 'A second family.',
            wrong: ['A hard school.', 'A big business.'],
          },
        ],
      },
      {
        passageEn:
          'Nowadays, many teenagers post selfies every day. A study asked young people in Israel how they feel after they look at other people\'s photos. Many said that the reality is different from the pictures, but they still feel bad about themselves. The researchers think that teenagers who spend less time online are often happier.',
        passageHe:
          'בימינו הרבה בני נוער מעלים סלפי כל יום. מחקר שאל צעירים בישראל איך הם מרגישים אחרי שהם מסתכלים על תמונות של אחרים. רבים אמרו שהמציאות שונה מהתמונות, אבל הם בכל זאת מרגישים רע עם עצמם. החוקרים חושבים שבני נוער שמבלים פחות זמן ברשת הם לעיתים קרובות מאושרים יותר.',
        questions: [
          {
            questionEn: 'What do many teenagers post every day?',
            questionHe: 'מה הרבה בני נוער מעלים כל יום?',
            correct: 'Selfies.',
            wrong: ['Long stories.', 'Songs.'],
          },
          {
            questionEn: 'How do many young people feel after looking at the photos?',
            questionHe: 'איך צעירים רבים מרגישים אחרי שהם מסתכלים בתמונות?',
            correct: 'Bad about themselves.',
            wrong: ['Proud of their friends.', 'Happy and calm.'],
          },
          {
            questionEn: 'Who is often happier, according to the researchers?',
            questionHe: 'מי לעיתים קרובות מאושר יותר, לפי החוקרים?',
            correct: 'Teenagers who spend less time online.',
            wrong: ['Teenagers who post more photos.', 'Teenagers who have more followers.'],
          },
        ],
      },
    ],
  },
};
