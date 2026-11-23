import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-4 source's grade 9 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_4_GRADE_9_EXAM_BANK: ExamBankPack = {
  // Unit 24: careers (first and second conditionals)
  24: {
    vocabulary: [
      {
        clozeEn: 'I want to ____ a new hobby, like painting.',
        clozeHe: 'אני רוצה להתחיל תחביב חדש, כמו ציור.',
        answer: 'take up',
        wrong: ['end up', 'set off'],
      },
      {
        clozeEn: 'Animals can ____ to cold weather.',
        clozeHe: 'בעלי חיים יכולים להסתגל למזג אוויר קר.',
        answer: 'adapt',
        wrong: ['babysit', 'session'],
      },
      {
        clozeEn: 'My sister likes to ____ for the kids next door.',
        clozeHe: 'אחותי אוהבת לעשות בייביסיטר לילדים של השכנים.',
        answer: 'babysit',
        wrong: ['adapt', 'set off'],
      },
      {
        clozeEn: 'We sell ____ kinds of fruit: apples, mangoes and figs.',
        clozeHe: 'אנחנו מוכרים סוגים שונים של פירות: תפוחים, מנגו ותאנים.',
        answer: 'various',
        wrong: ['aware', 'lately'],
      },
      {
        clozeEn: 'It is okay to ____ about your future job.',
        clozeHe: 'זה בסדר לשנות את דעתכם לגבי העבודה העתידית שלכם.',
        answer: 'change your mind',
        wrong: ['set off', 'babysit'],
      },
      {
        clozeEn: 'Everyone came to the party ____ Dan. He was sick.',
        clozeHe: 'כולם באו למסיבה חוץ מדן. הוא היה חולה.',
        answer: 'apart from',
        wrong: ['face-to-face', 'quite a while'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'If you leave now, you will catch the bus.',
        wrong: ['If you will leave now, you will catch the bus.', 'If you leave now, you catching the bus.'],
        explainHe: 'תנאי מסוג ראשון: If + הווה, ואחר כך will + פועל.',
        hintHe: 'מה בא אחרי If, ומה בחלק השני?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'If I were taller, I would play basketball.',
        wrong: ['If I am taller, I would play basketball.', 'If I were taller, I will play basketball.'],
        explainHe: 'תנאי דמיוני: If I were, ואחר כך would + פועל.',
        hintHe: 'זה דמיון. בדקו את were ואת would.',
      },
      {
        questionEn: 'Which word completes the sentence? If she ____ the job, she will be very happy.',
        correct: 'gets',
        wrong: ['will get', 'got'],
        explainHe: 'בתנאי מסוג ראשון אחרי If בא הווה: she gets.',
        hintHe: 'מה בא אחרי If בתנאי אמיתי?',
      },
      {
        questionEn: 'Which word completes the sentence? If we had a car, we ____ drive to the north.',
        correct: 'would',
        wrong: ['will', 'are'],
        explainHe: 'אחרי If + עבר (had) בא would.',
        hintHe: 'החלק הראשון בעבר. מה בא בחלק השני?',
      },
      {
        questionEn: 'Your friend is tired. What advice do you give?',
        correct: 'If I were you, I would go to bed early.',
        wrong: ['If I am you, I would go to bed early.', 'If I were you, I will go to bed early.'],
        explainHe: 'עצה: If I were you, I would…',
        hintHe: 'איך מתחילים עצה בתנאי דמיוני?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'What would you do if you won a million shekels?',
        wrong: ['What will you do if you won a million shekels?', 'What would you do if you will win a million shekels?'],
        explainHe: 'שאלה על דמיון: What would you do if + עבר?',
        hintHe: 'בדקו את would ואת הפועל אחרי if.',
      },
    ],
    sentences: [
      { en: 'If you practice, you will improve.', he: 'אם תתאמנו, תשתפרו.' },
      { en: 'If I were a principal, I would start school at nine.', he: 'אם הייתי מנהל/ת, הייתי מתחיל/ה את הלימודים בתשע.' },
      { en: 'If we set off at seven, we will arrive at nine.', he: 'אם נצא לדרך בשבע, נגיע בתשע.' },
      { en: 'She would rather be a nurse than a lawyer.', he: 'היא מעדיפה להיות אחות מאשר עורכת דין.' },
      { en: 'I guess I would study art if I had more time.', he: 'כנראה שהייתי לומד/ת אמנות אם היה לי יותר זמן.' },
      { en: 'Lately, more girls have started studying engineering.', he: 'לאחרונה יותר בנות התחילו ללמוד הנדסה.' },
    ],
    passages: [
      {
        passageEn:
          'Rotem is in ninth grade, and she is not sure what she wants to do in the future. Her school counselor told her that if she tries out different activities, she will discover what she enjoys. So Rotem joined a robotics club and a drama group. Now she thinks that she would rather be an engineer than an actor.',
        passageHe:
          'רותם בכיתה ט׳, והיא לא בטוחה מה היא רוצה לעשות בעתיד. היועצת של בית הספר אמרה לה שאם היא תנסה פעילויות שונות, היא תגלה מה היא אוהבת. אז רותם הצטרפה לחוג רובוטיקה ולקבוצת תיאטרון. עכשיו היא חושבת שהיא מעדיפה להיות מהנדסת מאשר שחקנית.',
        questions: [
          {
            questionEn: 'What did the counselor tell Rotem?',
            questionHe: 'מה היועצת אמרה לרותם?',
            correct: 'To try out different activities.',
            wrong: ['To join a drama group only.', 'To become an engineer.'],
          },
          {
            questionEn: 'Which clubs did Rotem join?',
            questionHe: 'לאילו חוגים רותם הצטרפה?',
            correct: 'Robotics and drama.',
            wrong: ['Music and sports.', 'Art and cooking.'],
          },
          {
            questionEn: 'What would Rotem rather be now?',
            questionHe: 'מה רותם מעדיפה להיות עכשיו?',
            correct: 'An engineer.',
            wrong: ['An actor.', 'A counselor.'],
          },
        ],
      },
      {
        passageEn:
          'If you visit the new science facility in our town, you will see a real space lab. The facility opened recently, and students can take part in sessions with scientists. Guides say that if more young people come, the town will open a second lab. Apart from labs, there is also a small café.',
        passageHe:
          'אם תבקרו במתקן המדע החדש בעיר שלנו, תראו מעבדת חלל אמיתית. המתקן נפתח לאחרונה, ותלמידים יכולים להשתתף במפגשים עם מדענים. המדריכים אומרים שאם יגיעו יותר צעירים, העירייה תפתח מעבדה שנייה. חוץ מהמעבדות, יש שם גם בית קפה קטן.',
        questions: [
          {
            questionEn: 'What can visitors see at the facility?',
            questionHe: 'מה המבקרים יכולים לראות במתקן?',
            correct: 'A real space lab.',
            wrong: ['A real spaceship.', 'A fire station.'],
          },
          {
            questionEn: 'What will the town do if more young people come?',
            questionHe: 'מה העירייה תעשה אם יגיעו יותר צעירים?',
            correct: 'Open a second lab.',
            wrong: ['Close the café.', 'Build a new school.'],
          },
          {
            questionEn: 'What else is there apart from the labs?',
            questionHe: 'מה עוד יש שם חוץ מהמעבדות?',
            correct: 'A small café.',
            wrong: ['A swimming pool.', 'A library.'],
          },
        ],
      },
    ],
  },
};
