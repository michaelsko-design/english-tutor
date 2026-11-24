import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-4 source's grade 5 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_4_GRADE_5_EXAM_BANK: ExamBankPack = {
  // Unit 24: weekend plans (be going to, questions and short answers)
  24: {
    vocabulary: [
      {
        clozeEn: 'I am going to ____ my whole class to my birthday party.',
        clozeHe: 'אני הולך/ת להזמין את כל הכיתה למסיבת יום ההולדת שלי.',
        answer: 'invite',
        wrong: ['spend', 'till'],
      },
      {
        clozeEn: 'Our ____ lives next door. He has a big dog.',
        clozeHe: 'השכן שלנו גר בבית ליד. יש לו כלב גדול.',
        answer: 'neighbor',
        wrong: ['customer', 'pocket'],
      },
      {
        clozeEn: 'The shop is open ____ nine o\'clock.',
        clozeHe: 'החנות פתוחה עד השעה תשע.',
        answer: 'till',
        wrong: ['either', 'simple'],
      },
      {
        clozeEn: 'This pen is very ____. It costs only two shekels.',
        clozeHe: 'העט הזה זול מאוד. הוא עולה רק שני שקלים.',
        answer: 'cheap',
        wrong: ['useful', 'sure'],
      },
      {
        clozeEn: 'We are going to ____ the train at the last station.',
        clozeHe: 'אנחנו הולכים לרדת מהרכבת בתחנה האחרונה.',
        answer: 'get off',
        wrong: ['invite', 'spend'],
      },
      {
        clozeEn: 'A map is ____ when you travel.',
        clozeHe: 'מפה שימושית כשמטיילים.',
        answer: 'useful',
        wrong: ['cheap', 'either'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is right?',
        correct: 'We are going to fly to Eilat.',
        wrong: ['We going to fly to Eilat.', 'We are going fly to Eilat.'],
        explainHe: 'we ואחריו are going to ופועל: We are going to fly.',
        hintHe: 'בדקו שיש are וגם to.',
      },
      {
        questionEn: 'Which sentence is right?',
        correct: 'My brother is going to paint his room.',
        wrong: ['My brother are going to paint his room.', 'My brother is going to paints his room.'],
        explainHe: 'עם brother (הוא) אומרים is going to, ואחריו פועל בלי s.',
        hintHe: 'בדקו את is ואת הפועל אחרי to.',
      },
      {
        questionEn: 'You want to ask your friends about their plan. Which question is right?',
        correct: 'Are you going to dance in the show?',
        wrong: ['Are you going to dancing in the show?', 'Do you going to dance in the show?'],
        explainHe: 'שאלה על תוכנית: Are בהתחלה, ואחרי going to בא פועל רגיל: dance.',
        hintHe: 'מה בא בהתחלה, ואיך נראה הפועל אחרי to?',
      },
      {
        questionEn: 'Are you going to swim? You are not. What do you say?',
        correct: 'No, I\'m not.',
        wrong: ['No, I don\'t.', 'No, I amn\'t.'],
        explainHe: 'על Are you…? עונים No, I\'m not.',
        hintHe: 'השאלה מתחילה ב-Are. מה עונים בשלילה?',
      },
      {
        questionEn: 'Which sentence is right?',
        correct: 'They are not going to play today.',
        wrong: ['They not going to play today.', 'They aren\'t going play today.'],
        explainHe: 'בשלילה not בא אחרי are: They are not going to…',
        hintHe: 'איפה עומד not?',
      },
      {
        questionEn: 'Which question is right?',
        correct: 'What are you going to do tomorrow?',
        wrong: ['What you are going to do tomorrow?', 'What are you going do tomorrow?'],
        explainHe: 'בשאלה עם What, are בא לפני you, ואחרי going to בא פועל.',
        hintHe: 'בדקו את סדר המילים ואת to.',
      },
    ],
    sentences: [
      { en: 'I am going to visit my cousins on Friday.', he: 'אני הולך/ת לבקר את בני הדודים שלי ביום שישי.' },
      { en: 'Are you going to come to the park?', he: 'אתם הולכים לבוא לפארק?' },
      { en: 'We plan to leave at eight a.m.', he: 'אנחנו מתכננים לצאת בשמונה בבוקר.' },
      { en: 'She is not going to buy the dress.', he: 'היא לא הולכת לקנות את השמלה.' },
      { en: 'I don\'t mind. Let\'s go anyway.', he: 'לא אכפת לי. בואו נלך בכל מקרה.' },
      { en: 'What are you going to spend your money on?', he: 'על מה אתם הולכים להוציא את הכסף שלכם?' },
    ],
    passages: [
      {
        passageEn:
          'Next weekend is going to be busy for Itay. On Friday he is going to visit his grandparents in the north. On Saturday morning he is going to play soccer with his team. In the evening, his family is going to watch a movie together.',
        passageHe:
          'סוף השבוע הבא הולך להיות עמוס בשביל איתי. ביום שישי הוא הולך לבקר את סבא וסבתא שלו בצפון. בשבת בבוקר הוא הולך לשחק כדורגל עם הקבוצה שלו. בערב המשפחה שלו הולכת לצפות ביחד בסרט.',
        questions: [
          {
            questionEn: 'Who is Itay going to visit on Friday?',
            questionHe: 'את מי איתי הולך לבקר ביום שישי?',
            correct: 'His grandparents.',
            wrong: ['His team.', 'His neighbor.'],
          },
          {
            questionEn: 'What is Itay going to do on Saturday morning?',
            questionHe: 'מה איתי הולך לעשות בשבת בבוקר?',
            correct: 'Play soccer.',
            wrong: ['Watch a movie.', 'Go shopping.'],
          },
          {
            questionEn: 'When is the family going to watch a movie?',
            questionHe: 'מתי המשפחה הולכת לצפות בסרט?',
            correct: 'In the evening.',
            wrong: ['On Friday morning.', 'On Saturday morning.'],
          },
        ],
      },
      {
        passageEn:
          'Noga has eighty shekels. She is going to buy a present for her best friend. Is she going to buy a book? No, she isn\'t, because her friend has a lot of books. She is going to buy a useful pencil case and some colorful pens.',
        passageHe:
          'לנוגה יש שמונים שקלים. היא הולכת לקנות מתנה לחברה הכי טובה שלה. היא הולכת לקנות ספר? לא, כי לחברה שלה יש הרבה ספרים. היא הולכת לקנות קלמר שימושי וכמה עטים צבעוניים.',
        questions: [
          {
            questionEn: 'Who is the present for?',
            questionHe: 'בשביל מי המתנה?',
            correct: 'Noga\'s best friend.',
            wrong: ['Noga\'s mom.', 'Noga\'s teacher.'],
          },
          {
            questionEn: 'Why isn\'t Noga going to buy a book?',
            questionHe: 'למה נוגה לא הולכת לקנות ספר?',
            correct: 'Her friend has a lot of books.',
            wrong: ['Books are not cheap.', 'Her friend doesn\'t like reading.'],
          },
          {
            questionEn: 'What is Noga going to buy?',
            questionHe: 'מה נוגה הולכת לקנות?',
            correct: 'A pencil case and pens.',
            wrong: ['A book and a bag.', 'A doll and a ball.'],
          },
        ],
      },
    ],
  },
};
