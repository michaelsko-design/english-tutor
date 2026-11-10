import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-3 source's grade 2 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_3_GRADE_2_EXAM_BANK: ExamBankPack = {
  // Unit 23: polite words (please, thank you, I'm sorry, Excuse me)
  23: {
    vocabulary: [
      {
        clozeEn: 'Grandma gives me a gift. I say, ____!',
        clozeHe: 'סבתא נותנת לי מתנה. אני אומר/ת: תודה!',
        answer: 'Thank you',
        wrong: ['Sit down', 'Come back'],
      },
      {
        clozeEn: 'My dog is ____. I can\'t find him.',
        clozeHe: 'הכלב שלי הלך לאיבוד. אני לא מוצא/ת אותו.',
        answer: 'lost',
        wrong: ['glad', 'fine'],
      },
      {
        clozeEn: 'Come in and ____, please.',
        clozeHe: 'היכנסו ושבו, בבקשה.',
        answer: 'sit down',
        wrong: ['talk', 'hit'],
      },
      {
        clozeEn: 'We are ____ you are here!',
        clozeHe: 'אנחנו שמחים שאתם כאן!',
        answer: 'glad',
        wrong: ['lost', 'ask'],
      },
      {
        clozeEn: 'I ____ my friend after school.',
        clozeHe: 'אני מחכה לחבר שלי אחרי בית הספר.',
        answer: 'wait for',
        wrong: ['sit down', 'hit'],
      },
      {
        clozeEn: 'The ball ____ my leg. Ouch!',
        clozeHe: 'הכדור פגע לי ברגל. איי!',
        answer: 'hit',
        wrong: ['glad', 'fine'],
      },
    ],
    grammar: [
      {
        questionEn: 'You want the red pen. Which one is polite?',
        correct: 'Can I have the red pen, please?',
        wrong: ['Give me the red pen!', 'Can I the red pen have, please?'],
        explainHe: 'בקשה מנומסת: Can I have …, please?',
        hintHe: 'איזו בקשה מנומסת, ובאיזו מהן המילים בסדר הנכון?',
      },
      {
        questionEn: 'Your friend says, Thank you! What do you say?',
        correct: 'You\'re welcome!',
        wrong: ['I\'m sorry!', 'Excuse me!'],
        explainHe: 'על תודה עונים You\'re welcome (בבקשה, אין בעד מה).',
        hintHe: 'מה עונים למי שאומר תודה?',
      },
      {
        questionEn: 'Your bag is on a friend\'s chair. What do you say?',
        correct: 'I\'m sorry, my bag is on your chair.',
        wrong: ['Thank you, my bag is on your chair.', 'I sorry, my bag is on your chair.'],
        explainHe: 'מבקשים סליחה עם I\'m sorry (I am sorry).',
        hintHe: 'מה אומרים כשמבקשים סליחה? בדקו גם שלא חסרה מילה.',
      },
      {
        questionEn: 'You want to ask the teacher a question. What do you say first?',
        correct: 'Excuse me!',
        wrong: ['Go away!', 'Happy birthday!'],
        explainHe: 'כשפונים למישהו בנימוס, מתחילים ב-Excuse me.',
        hintHe: 'איזו מילה מנומסת פותחת שאלה למורה?',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'How are you, Grandpa?',
        wrong: ['How you are, Grandpa?', 'How is you, Grandpa?'],
        explainHe: 'שואלים How are you? קודם How, אחר כך are, ואז you.',
        hintHe: 'מה בא מיד אחרי How? בדקו גם את המילה שמתאימה ל-you.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We wait for Grandma.',
        wrong: ['We wait Grandma for.', 'We waits for Grandma.'],
        explainHe: 'אומרים wait for (לחכות ל…), ועם we הפועל בלי s.',
        hintHe: 'איפה באה המילה for? ומה קורה לפועל עם we?',
      },
    ],
    sentences: [
      { en: 'Can I have a cookie, please?', he: 'אפשר לקבל עוגייה, בבקשה?' },
      { en: 'Thank you for the green pen.', he: 'תודה על העט הירוק.' },
      { en: 'I am sorry, my cat is lost.', he: 'סליחה, החתול שלי הלך לאיבוד.' },
      { en: 'Excuse me, is this your bag?', he: 'סליחה, זה התיק שלך?' },
      { en: 'We are fine, thank you.', he: 'אנחנו בסדר, תודה.' },
      { en: 'Please come back to the park!', he: 'תחזרו לפארק, בבקשה!' },
    ],
    passages: [
      {
        passageEn:
          'Lior is at the park. His ball is lost. He asks a girl, Excuse me, can you help me, please? The girl finds the ball under a tree. Lior says, Thank you! The girl says, You\'re welcome.',
        passageHe:
          'ליאור בפארק. הכדור שלו הלך לאיבוד. הוא שואל ילדה: סליחה, את יכולה לעזור לי, בבקשה? הילדה מוצאת את הכדור מתחת לעץ. ליאור אומר: תודה! הילדה אומרת: בבקשה.',
        questions: [
          {
            questionEn: 'What is lost?',
            questionHe: 'מה הלך לאיבוד?',
            correct: 'Lior\'s ball.',
            wrong: ['Lior\'s cat.', 'The girl\'s bag.'],
          },
          {
            questionEn: 'Where does the girl find the ball?',
            questionHe: 'איפה הילדה מוצאת את הכדור?',
            correct: 'Under a tree.',
            wrong: ['In the bag.', 'On the chair.'],
          },
          {
            questionEn: 'What does Lior say to the girl at the end?',
            questionHe: 'מה ליאור אומר לילדה בסוף?',
            correct: 'Thank you!',
            wrong: ['I\'m sorry!', 'Go away!'],
          },
        ],
      },
      {
        passageEn:
          'It is Dana\'s birthday. Grandpa says, Happy birthday, Dana! Dana says, Thank you! Then Dana\'s friends come. Dana says, I\'m ready. Let\'s go to the park!',
        passageHe:
          'זה יום ההולדת של דנה. סבא אומר: יום הולדת שמח, דנה! דנה אומרת: תודה! אחר כך החברים של דנה באים. דנה אומרת: אני מוכנה. בואו נלך לפארק!',
        questions: [
          {
            questionEn: 'Whose birthday is it?',
            questionHe: 'של מי יום ההולדת?',
            correct: 'Dana\'s.',
            wrong: ['Grandpa\'s.', 'A friend\'s.'],
          },
          {
            questionEn: 'What does Grandpa say?',
            questionHe: 'מה סבא אומר?',
            correct: 'Happy birthday, Dana!',
            wrong: ['Good night, Dana!', 'Excuse me, Dana!'],
          },
          {
            questionEn: 'Where do they go?',
            questionHe: 'לאן הם הולכים?',
            correct: 'To the park.',
            wrong: ['To school.', 'To the bus stop.'],
          },
        ],
      },
    ],
  },
};
