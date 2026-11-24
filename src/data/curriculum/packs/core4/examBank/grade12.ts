import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-4 source's grade 12 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_4_GRADE_12_EXAM_BANK: ExamBankPack = {
  // Unit 24: ethics (conditionals, passive with modals)
  24: {
    vocabulary: [
      {
        clozeEn: 'It is ____ to talk with your mouth full.',
        clozeHe: 'לא מנומס לדבר עם פה מלא.',
        answer: 'rude',
        wrong: ['altogether', 'penalty'],
      },
      {
        clozeEn: 'Please turn down the music. It will ____ the neighbors.',
        clozeHe: 'בבקשה הנמיכו את המוזיקה. זה ירגיז את השכנים.',
        answer: 'annoy',
        wrong: ['bring up', 'give away'],
      },
      {
        clozeEn: 'The driver had to pay a ____ for parking in the wrong place.',
        clozeHe: 'הנהג נאלץ לשלם קנס על חנייה במקום אסור.',
        answer: 'penalty',
        wrong: ['membership', 'gentleman'],
      },
      {
        clozeEn: 'They decided to ____ their old toys to a kindergarten.',
        clozeHe: 'הם החליטו לתת את הצעצועים הישנים שלהם במתנה לגן ילדים.',
        answer: 'give away',
        wrong: ['bring up', 'annoy'],
      },
      {
        clozeEn: 'He shares everything with his friends. He is not ____.',
        clozeHe: 'הוא חולק הכול עם החברים שלו. הוא לא אנוכי.',
        answer: 'selfish',
        wrong: ['dreadful', 'altogether'],
      },
      {
        clozeEn: 'After a long and ____ day, I just wanted to sleep.',
        clozeHe: 'אחרי יום ארוך ונורא, רק רציתי לישון.',
        answer: 'dreadful',
        wrong: ['dishonest', 'membership'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'If I found a wallet, I would take it to the police.',
        wrong: ['If I find a wallet, I would take it to the police.', 'If I found a wallet, I will take it to the police.'],
        explainHe: 'תנאי דמיוני: If + עבר (found), ו-would + פועל.',
        hintHe: 'בדקו ששני החלקים מאותו סוג תנאי.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'If he had told the truth, he would not have lost his job.',
        wrong: ['If he told the truth, he would not have lost his job.', 'If he had told the truth, he will not have lost his job.'],
        explainHe: 'תנאי על העבר: If + had + V3, ו-would have + V3.',
        hintHe: 'מדובר בעבר שכבר קרה. איזה מבנה מתאים?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'Food should not be wasted.',
        wrong: ['Food should not wasted.', 'Food should be not waste.'],
        explainHe: 'סביל בשלילה: should not be + V3 (wasted).',
        hintHe: 'בדקו את be ואת צורת הפועל.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'The results will be published next week.',
        wrong: ['The results will published next week.', 'The results will be publish next week.'],
        explainHe: 'סביל בעתיד: will be + V3 (published).',
        hintHe: 'מה חסר, ובאיזו צורה הפועל?',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Should animals be used in experiments?',
        wrong: ['Should animals used in experiments?', 'Should be animals used in experiments?'],
        explainHe: 'בשאלה: Should + נושא + be + V3.',
        hintHe: 'בדקו את סדר המילים.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'What would you do if you were the judge?',
        wrong: ['What will you do if you were the judge?', 'What would you do if you are the judge?'],
        explainHe: 'שאלה על מצב דמיוני: would + if + were.',
        hintHe: 'זה מצב דמיוני. בדקו את would ואת were.',
      },
    ],
    sentences: [
      { en: 'If I were the mayor, I would build more parks.', he: 'אם הייתי ראש העיר, הייתי בונה יותר פארקים.' },
      { en: 'Phones must be switched off during the exam.', he: 'חובה לכבות טלפונים בזמן הבחינה.' },
      { en: 'It would be dishonest to keep the money.', he: 'זה יהיה לא הגון לשמור את הכסף.' },
      { en: 'Should homework be banned altogether?', he: 'האם צריך לבטל לגמרי שיעורי בית?' },
      { en: 'The winners will be announced tomorrow.', he: 'הזוכים יוכרזו מחר.' },
      { en: 'If she had asked, I would have helped her.', he: 'אילו היא הייתה מבקשת, הייתי עוזר/ת לה.' },
    ],
    passages: [
      {
        passageEn:
          'Should students be allowed to use AI to write their homework? Some teachers say that AI tools should be banned altogether, because students would stop thinking for themselves. Others believe that AI can be used as a helper, just like a dictionary. Most agree on one thing: if a student copies an answer and says it is their own, that is dishonest.',
        passageHe:
          'האם צריך לאפשר לתלמידים להשתמש בבינה מלאכותית כדי לכתוב שיעורי בית? כמה מורים אומרים שצריך לאסור לגמרי כלי בינה מלאכותית, כי תלמידים יפסיקו לחשוב בעצמם. אחרים מאמינים שאפשר להשתמש בבינה מלאכותית כעוזר, בדיוק כמו במילון. רובם מסכימים על דבר אחד: אם תלמיד מעתיק תשובה ואומר שהיא שלו, זה לא הגון.',
        questions: [
          {
            questionEn: 'Why do some teachers want to ban AI tools?',
            questionHe: 'למה כמה מורים רוצים לאסור כלי בינה מלאכותית?',
            correct: 'Students would stop thinking for themselves.',
            wrong: ['AI tools are too expensive.', 'Dictionaries are better.'],
          },
          {
            questionEn: 'What do other teachers compare AI to?',
            questionHe: 'למה מורים אחרים משווים את הבינה המלאכותית?',
            correct: 'A dictionary.',
            wrong: ['A teacher.', 'A calculator.'],
          },
          {
            questionEn: 'What do most teachers agree on?',
            questionHe: 'על מה רוב המורים מסכימים?',
            correct: 'Copying an answer and calling it your own is dishonest.',
            wrong: ['AI should be used in every lesson.', 'Homework should be banned.'],
          },
        ],
      },
      {
        passageEn:
          'In the novel we read in class, Eran, a young soccer player, is offered a lot of money to lose a game on purpose. He refuses and tells his coach. Because of him, the people who offered the bribe are caught. At the end of the book he says, "If I had taken the money, I would never have been able to look at myself in the mirror."',
        passageHe:
          'ברומן שקראנו בכיתה, מציעים לערן, שחקן כדורגל צעיר, הרבה כסף כדי להפסיד במשחק בכוונה. הוא מסרב ומספר למאמן שלו. בזכותו, האנשים שהציעו את השוחד נתפסים. בסוף הספר הוא אומר: "אילו הייתי לוקח את הכסף, לעולם לא הייתי יכול להסתכל על עצמי במראה."',
        questions: [
          {
            questionEn: 'What is Eran offered money for?',
            questionHe: 'על מה מציעים לערן כסף?',
            correct: 'To lose a game on purpose.',
            wrong: ['To join a new team.', 'To score more goals.'],
          },
          {
            questionEn: 'What does Eran do?',
            questionHe: 'מה ערן עושה?',
            correct: 'He refuses and tells his coach.',
            wrong: ['He takes the money.', 'He leaves soccer.'],
          },
          {
            questionEn: 'What does Eran say about the money?',
            questionHe: 'מה ערן אומר על הכסף?',
            correct: 'Taking it would have made him ashamed.',
            wrong: ['He needed it for his family.', 'It was not enough money.'],
          },
        ],
      },
    ],
  },
};
