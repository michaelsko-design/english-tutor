import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-4 source's grade 8 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_4_GRADE_8_EXAM_BANK: ExamBankPack = {
  // Unit 24: news and interviews (reported speech: said, told, asked whether)
  24: {
    vocabulary: [
      {
        clozeEn: 'The bus driver gave us an ____ for being late.',
        clozeHe: 'נהג האוטובוס התנצל בפנינו על האיחור.',
        answer: 'apology',
        wrong: ['duty', 'level'],
      },
      {
        clozeEn: 'We are going to ____ in math next Monday.',
        clozeHe: 'אנחנו ניבחן במתמטיקה ביום שני הבא.',
        answer: 'take an exam',
        wrong: ['watch out', 'hardly ever'],
      },
      {
        clozeEn: '____! The floor is wet.',
        clozeHe: 'היזהרו! הרצפה רטובה.',
        answer: 'Watch out',
        wrong: ['As you know', 'In case of'],
      },
      {
        clozeEn: 'She got the main ____ in the school play.',
        clozeHe: 'היא קיבלה את התפקיד הראשי בהצגה של בית הספר.',
        answer: 'role',
        wrong: ['duty', 'total'],
      },
      {
        clozeEn: 'Our teacher was ____ with our project.',
        clozeHe: 'המורה שלנו הייתה מרוצה מהפרויקט שלנו.',
        answer: 'pleased',
        wrong: ['recent', 'mostly'],
      },
      {
        clozeEn: 'I didn\'t know ____ the shop was open on Friday.',
        clozeHe: 'לא ידעתי אם החנות פתוחה ביום שישי.',
        answer: 'whether',
        wrong: ['mostly', 'trust'],
      },
    ],
    grammar: [
      {
        questionEn: 'Ron said, "I am tired." Which is right?',
        correct: 'Ron said that he was tired.',
        wrong: ['Ron said that I was tired.', 'Ron said me that he was tired.'],
        explainHe: 'I הופך ל-he, ואחרי said לא בא me.',
        hintHe: 'בדקו את הגוף ואת המילה אחרי said.',
      },
      {
        questionEn: 'The girls said, "We love the new park." Which is right?',
        correct: 'The girls said that they love the new park.',
        wrong: ['The girls said that we love the new park.', 'The girls said me that they love the new park.'],
        explainHe: 'we הופך ל-they, ואחרי said לא בא me. את הזמן לא חייבים לשנות.',
        hintHe: 'מי ה-we, ומה בא אחרי said?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'The nurse told me to sit down.',
        wrong: ['The nurse told me sit down.', 'The nurse said me to sit down.'],
        explainHe: 'told + אדם + to + פועל. said לא בא עם me.',
        hintHe: 'מה חסר לפני sit, ואיזה פועל בא עם me?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'He asked whether the museum was open.',
        wrong: ['He asked whether was the museum open.', 'He asked that the museum was open.'],
        explainHe: 'שאלת כן/לא בדיבור עקיף: asked whether + נושא + פועל, בלי היפוך.',
        hintHe: 'בדקו את סדר המילים אחרי whether.',
      },
      {
        questionEn: 'Mom said to me, "My phone is broken." Which is right?',
        correct: 'Mom told me that her phone is broken.',
        wrong: ['Mom told me that my phone is broken.', 'Mom said me that her phone is broken.'],
        explainHe: 'ה-my של אמא הופך ל-her, ועם me בא told (לא said).',
        hintHe: 'של מי הטלפון, ואיזה פועל בא עם me?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'The coach told us not to give up.',
        wrong: ['The coach told us to not giving up.', 'The coach said us not to give up.'],
        explainHe: 'הוראה בשלילה: told + אדם + not to + פועל.',
        hintHe: 'איפה עומד not, ומה בא אחרי told?',
      },
    ],
    sentences: [
      { en: 'The reporter said that the road was closed.', he: 'הכתב אמר שהכביש סגור.' },
      { en: 'My friend told me that she was moving.', he: 'החברה שלי סיפרה לי שהיא עוברת דירה.' },
      { en: 'The teacher told us to open our books.', he: 'המורה אמרה לנו לפתוח את הספרים.' },
      { en: 'Dan asked whether the test was hard.', he: 'דן שאל אם המבחן קשה.' },
      { en: 'As you know, the trip is next week.', he: 'כפי שאתם יודעים, הטיול בשבוע הבא.' },
      { en: 'The mayor said that she was pleased.', he: 'ראש העיר אמרה שהיא מרוצה.' },
    ],
    passages: [
      {
        passageEn:
          'Last week, a famous basketball player visited our school. In the interview, he said that he hardly ever missed a practice when he was young. He told us that he practiced every morning before school. When a student asked whether he was ever afraid, he admitted that he was afraid before every big game.',
        passageHe:
          'בשבוע שעבר שחקן כדורסל מפורסם ביקר בבית הספר שלנו. בראיון הוא אמר שכשהיה צעיר הוא כמעט אף פעם לא החמיץ אימון. הוא סיפר לנו שהוא התאמן כל בוקר לפני בית הספר. כשתלמיד שאל אם הוא אי פעם פחד, הוא הודה שהוא פחד לפני כל משחק גדול.',
        questions: [
          {
            questionEn: 'When did the player practice?',
            questionHe: 'מתי השחקן התאמן?',
            correct: 'Every morning before school.',
            wrong: ['Every evening after dinner.', 'Only on weekends.'],
          },
          {
            questionEn: 'What did a student ask him?',
            questionHe: 'מה תלמיד שאל אותו?',
            correct: 'Whether he was ever afraid.',
            wrong: ['Whether he liked school.', 'Whether he was tired.'],
          },
          {
            questionEn: 'What did the player admit?',
            questionHe: 'במה השחקן הודה?',
            correct: 'He was afraid before big games.',
            wrong: ['He often missed practice.', 'He did not like basketball.'],
          },
        ],
      },
      {
        passageEn:
          'The town radio reported a big storm. The reporter said that the situation was dangerous. The police told people to stay at home and to watch out for fallen trees. In case of an emergency, they told everyone to call 100. By the next day, the storm was over.',
        passageHe:
          'הרדיו של העיר דיווח על סערה גדולה. הכתב אמר שהמצב מסוכן. המשטרה אמרה לאנשים להישאר בבית ולהיזהר מעצים שנפלו. במקרה חירום, הם אמרו לכולם להתקשר ל-100. עד למחרת הסערה נגמרה.',
        questions: [
          {
            questionEn: 'What did the reporter say about the situation?',
            questionHe: 'מה הכתב אמר על המצב?',
            correct: 'It was dangerous.',
            wrong: ['It was getting better.', 'It was funny.'],
          },
          {
            questionEn: 'What did the police tell people to do?',
            questionHe: 'מה המשטרה אמרה לאנשים לעשות?',
            correct: 'Stay at home.',
            wrong: ['Go to the beach.', 'Drive to the city.'],
          },
          {
            questionEn: 'When was the storm over?',
            questionHe: 'מתי הסערה נגמרה?',
            correct: 'By the next day.',
            wrong: ['After a week.', 'In the evening.'],
          },
        ],
      },
    ],
  },
};
