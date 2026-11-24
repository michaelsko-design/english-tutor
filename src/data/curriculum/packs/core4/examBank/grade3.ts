import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-4 source's grade 3 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_4_GRADE_3_EXAM_BANK: ExamBankPack = {
  // Unit 24: telling a story with and, then and but
  24: {
    vocabulary: [
      {
        clozeEn: '____, there was a princess in a tall tower.',
        clozeHe: 'היה היה פעם נסיכה במגדל גבוה.',
        answer: 'Once upon a time',
        wrong: ['All the time', 'Good luck'],
      },
      {
        clozeEn: 'The kids put on ____ coats.',
        clozeHe: 'הילדים לובשים את המעילים שלהם.',
        answer: 'their',
        wrong: ['them', 'then'],
      },
      {
        clozeEn: 'Tom is the ____ one to finish.',
        clozeHe: 'תום הוא האחרון שמסיים.',
        answer: 'last',
        wrong: ['bad', 'their'],
      },
      {
        clozeEn: 'The room is empty. ____ is here.',
        clozeHe: 'החדר ריק. אף אחד לא כאן.',
        answer: 'No one',
        wrong: ['Their', 'Then'],
      },
      {
        clozeEn: 'You have a test today? ____',
        clozeHe: 'יש לכם מבחן היום? בהצלחה!',
        answer: 'Good luck!',
        wrong: ['Go away!', 'It\'s not fair!'],
      },
      {
        clozeEn: 'The soup is ____ hot. Wait a minute.',
        clozeHe: 'המרק קצת חם. חכו רגע.',
        answer: 'a bit',
        wrong: ['last', 'their'],
      },
    ],
    grammar: [
      {
        questionEn: 'I have a ball. I have a kite. Which sentence joins them?',
        correct: 'I have a ball and a kite.',
        wrong: ['I have a ball but a kite.', 'I have and a ball a kite.'],
        explainHe: 'and (ו-) מחבר שני דברים: a ball and a kite.',
        hintHe: 'איזו מילה מחברת שני דברים?',
      },
      {
        questionEn: 'Which word fits? I am hungry, ___ there is no food.',
        correct: 'but',
        wrong: ['and then', 'their'],
        explainHe: 'רעב, אבל אין אוכל: שני רעיונות שונים, אז משתמשים ב-but.',
        hintHe: 'האם שני החלקים מסתדרים זה עם זה?',
      },
      {
        questionEn: 'First we eat. After that we play. Which sentence is right?',
        correct: 'We eat, and then we play.',
        wrong: ['We eat, and them we play.', 'We eat, then and we play.'],
        explainHe: 'and then (ואז) אומר מה קרה אחר כך.',
        hintHe: 'איזו מילה אומרת "ואז"?',
      },
      {
        questionEn: 'Which sentence is right?',
        correct: 'The girls play with their cat.',
        wrong: ['The girls play with them cat.', 'The girls plays with their cat.'],
        explainHe: 'their (שלהן) בא לפני cat, ועם the girls אומרים play בלי s.',
        hintHe: 'בדקו את their ואת play.',
      },
      {
        questionEn: 'Which sentence is right?',
        correct: 'The bag is big, but it is light.',
        wrong: ['The bag is big, but it light.', 'The bag big, but it is light.'],
        explainHe: 'בכל חלק של המשפט צריך is: The bag is big, but it is light.',
        hintHe: 'בדקו שבכל חלק יש is.',
      },
      {
        questionEn: 'How does a story start?',
        correct: 'Once upon a time, there was a king.',
        wrong: ['Once upon a time, there were a king.', 'Once upon a time, there is a king was.'],
        explainHe: 'אגדה מתחילה ב-Once upon a time, there was … (היה היה פעם...).',
        hintHe: 'עם a king (אחד) אומרים was.',
      },
    ],
    sentences: [
      { en: 'Once upon a time, there was a little mouse.', he: 'היה היה פעם עכבר קטן.' },
      { en: 'We play ball, and then we go home.', he: 'אנחנו משחקים בכדור, ואז הולכים הביתה.' },
      { en: 'I like the story, but it is long.', he: 'אני אוהב/ת את הסיפור, אבל הוא ארוך.' },
      { en: 'The kids help their teacher.', he: 'הילדים עוזרים למורה שלהם.' },
      { en: 'My sister sings all the time.', he: 'אחותי שרה כל הזמן.' },
      { en: 'Good luck in the race!', he: 'בהצלחה במרוץ!' },
    ],
    passages: [
      {
        passageEn:
          'Once upon a time, there was a little duck. She lived on a farm with her brothers. Every day, the ducks swam in the lake, and then they ate bread. But one day, the little duck was lost. Her brothers looked for her all day. At last, they found her under a big tree.',
        passageHe:
          'היה היה פעם ברווזה קטנה. היא גרה בחווה עם האחים שלה. כל יום הברווזים שחו באגם, ואז אכלו לחם. אבל יום אחד הברווזה הקטנה הלכה לאיבוד. האחים שלה חיפשו אותה כל היום. בסוף הם מצאו אותה מתחת לעץ גדול.',
        questions: [
          {
            questionEn: 'Where is the little duck\'s home?',
            questionHe: 'איפה הבית של הברווזה הקטנה?',
            correct: 'On a farm.',
            wrong: ['In a big city.', 'In a school.'],
          },
          {
            questionEn: 'After the lake, what do the ducks eat?',
            questionHe: 'אחרי האגם, מה הברווזים אוכלים?',
            correct: 'Bread.',
            wrong: ['Grass.', 'Cake.'],
          },
          {
            questionEn: 'Where is the little duck at the end?',
            questionHe: 'איפה הברווזה הקטנה בסוף?',
            correct: 'Under a big tree.',
            wrong: ['In the lake.', 'In a shop.'],
          },
        ],
      },
      {
        passageEn:
          'Ron has a test today. He is a bit sad. His mom says, "Good luck!" Ron goes to school. The test is hard, but Ron knows the answers. After the test, he has a rest in the garden.',
        passageHe:
          'לרון יש מבחן היום. הוא קצת עצוב. אמא שלו אומרת: בהצלחה! רון הולך לבית הספר. המבחן קשה, אבל רון יודע את התשובות. אחרי המבחן הוא נח בגינה.',
        questions: [
          {
            questionEn: 'How does Ron feel before the test?',
            questionHe: 'איך רון מרגיש לפני המבחן?',
            correct: 'A bit sad.',
            wrong: ['Very happy.', 'Tired and sick.'],
          },
          {
            questionEn: 'What does Mom say?',
            questionHe: 'מה אמא אומרת?',
            correct: 'Good luck!',
            wrong: ['Go away!', 'It\'s not fair!'],
          },
          {
            questionEn: 'What does Ron do after the test?',
            questionHe: 'מה רון עושה אחרי המבחן?',
            correct: 'He has a rest in the garden.',
            wrong: ['He has another test.', 'He goes to the park with Mom.'],
          },
        ],
      },
    ],
  },
};
