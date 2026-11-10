import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-3 source's grade 4 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_3_GRADE_4_EXAM_BANK: ExamBankPack = {
  // Unit 23: and / but / or + because, friends and feelings
  23: {
    vocabulary: [
      {
        clozeEn: 'My ____ is Yael, and my last name is Cohen.',
        clozeHe: 'השם הפרטי שלי הוא יעל, ושם המשפחה שלי הוא כהן.',
        answer: 'first name',
        wrong: ['the rest', 'how about'],
      },
      {
        clozeEn: 'Omer is very ____. He knows every answer.',
        clozeHe: 'עומר חכם מאוד. הוא יודע כל תשובה.',
        answer: 'clever',
        wrong: ['hungry', 'once'],
      },
      {
        clozeEn: 'I am ____ because I have no breakfast.',
        clozeHe: 'אני רעב/ה כי אין לי ארוחת בוקר.',
        answer: 'hungry',
        wrong: ['young', 'often'],
      },
      {
        clozeEn: 'We ____ a lot at the funny movie.',
        clozeHe: 'אנחנו צוחקים הרבה בסרט המצחיק.',
        answer: 'laugh',
        wrong: ['busy', 'age'],
      },
      {
        clozeEn: 'Sorry, I can\'t come now. I am very ____.',
        clozeHe: 'סליחה, אני לא יכול/ה לבוא עכשיו. אני עסוק/ה מאוד.',
        answer: 'busy',
        wrong: ['group', 'meet'],
      },
      {
        clozeEn: 'Dana and I are the same ____. We are both ten.',
        clozeHe: 'דנה ואני באותו גיל. שתינו בנות עשר.',
        answer: 'age',
        wrong: ['enjoy', 'nice'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete: "I like football, ____ I don\'t like tennis."',
        correct: 'but',
        wrong: ['or', 'because'],
        explainHe: 'הרעיון השני הפוך מהראשון ("כן" ואז "לא"), ולכן but.',
        hintHe: 'האם שני הרעיונות דומים או הפוכים?',
      },
      {
        questionEn: 'Complete: "Do you want an apple ____ a banana?"',
        correct: 'or',
        wrong: ['but', 'because'],
        explainHe: 'צריך לבחור אחד מהשניים, ולכן or (או).',
        hintHe: 'בוחרים דבר אחד. איזו מילה נותנת בחירה?',
      },
      {
        questionEn: 'Complete: "Gal is sad ____ his dog is sick."',
        correct: 'because',
        wrong: ['or', 'and'],
        explainHe: 'הכלב חולה: זו הסיבה שגל עצוב, ולכן because.',
        hintHe: 'איזו מילה עונה על השאלה "למה?"',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I stay at home because it is raining.',
        wrong: ['I stay at home because raining.', 'I stay at home because it raining.'],
        explainHe: 'אחרי because בא משפט שלם: it is raining.',
        hintHe: 'בדקו שיש נושא ופועל אחרי because.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'Noa has a cat, and she has a dog as well.',
        wrong: ['Noa has a cat, but she has a dog as well.', 'Noa has a cat, and she have a dog as well.'],
        explainHe: 'גם חתול וגם כלב הם רעיונות דומים, ולכן and. עם she אומרים has.',
        hintHe: 'דומים או הפוכים? ומה מתאים ל-she: have או has?',
      },
      {
        questionEn: 'Complete: "We often meet at the park, ____ today we meet at school."',
        correct: 'but',
        wrong: ['because', 'or'],
        explainHe: 'בדרך כלל בפארק, אבל היום בבית הספר: שינוי מהרגיל, ולכן but.',
        hintHe: 'היום קורה משהו אחר מהרגיל. איזו מילה מתאימה?',
      },
    ],
    sentences: [
      { en: 'Maya is young, but she can read very well.', he: 'מאיה צעירה, אבל היא יודעת לקרוא טוב מאוד.' },
      { en: 'Do you want to play ball or draw?', he: 'אתם רוצים לשחק בכדור או לצייר?' },
      { en: 'I am hungry because it is late.', he: 'אני רעב/ה כי מאוחר.' },
      { en: 'We laugh because the joke is funny.', he: 'אנחנו צוחקים כי הבדיחה מצחיקה.' },
      { en: 'Someone is at the door, and it is Ben.', he: 'מישהו ליד הדלת, וזה בן.' },
      { en: 'I enjoy the game, but I am tired.', he: 'אני נהנה/ית מהמשחק, אבל אני עייף/ה.' },
    ],
    passages: [
      {
        passageEn:
          'Hey! My first name is Tal. I have a best friend, and her name is Shira. We are the same age, but we are very different. I like sports, and Shira likes books. We often meet after school because we live on the same street.',
        passageHe:
          'היי! השם הפרטי שלי הוא טל. יש לי חברה הכי טובה, וקוראים לה שירה. אנחנו באותו גיל, אבל אנחנו שונות מאוד. אני אוהבת ספורט, ושירה אוהבת ספרים. אנחנו נפגשות הרבה אחרי בית הספר כי אנחנו גרות באותו רחוב.',
        questions: [
          {
            questionEn: 'Who is Shira?',
            questionHe: 'מי זאת שירה?',
            correct: "Tal's best friend.",
            wrong: ["Tal's sister.", "Tal's teacher."],
          },
          {
            questionEn: 'What does Shira like?',
            questionHe: 'מה שירה אוהבת?',
            correct: 'Books.',
            wrong: ['Sports.', 'Music.'],
          },
          {
            questionEn: 'Why do they often meet after school?',
            questionHe: 'למה הן נפגשות הרבה אחרי בית הספר?',
            correct: 'They live on the same street.',
            wrong: ['They are in the same group.', 'They like the same sport.'],
          },
        ],
      },
      {
        passageEn:
          'Today Ido is not happy because he can\'t find his new ball anywhere. He asks his sister, "Is the ball in your room or in the garden?" She laughs. "Look under your bed!" The ball is there, and now Ido is happy.',
        passageHe:
          'היום עידו לא שמח כי הוא לא מוצא את הכדור החדש שלו בשום מקום. הוא שואל את אחותו: "הכדור בחדר שלך או בגינה?" היא צוחקת. "תסתכל מתחת למיטה שלך!" הכדור שם, ועכשיו עידו שמח.',
        questions: [
          {
            questionEn: 'Why is Ido not happy at first?',
            questionHe: 'למה עידו לא שמח בהתחלה?',
            correct: "He can't find his ball.",
            wrong: ['His sister is sick.', 'He is very hungry.'],
          },
          {
            questionEn: 'Who laughs?',
            questionHe: 'מי צוחקת?',
            correct: "Ido's sister.",
            wrong: ['Ido.', 'Their mom.'],
          },
          {
            questionEn: 'Where does Ido find his ball?',
            questionHe: 'איפה עידו מוצא את הכדור שלו?',
            correct: "Under Ido's bed.",
            wrong: ['In the garden.', "In his sister's room."],
          },
        ],
      },
    ],
  },
};
