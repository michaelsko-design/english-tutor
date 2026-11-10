import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-3 source's grade 3 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_3_GRADE_3_EXAM_BANK: ExamBankPack = {
  // Unit 23: Do you like…? Do you have…? and the short answers
  23: {
    vocabulary: [
      {
        clozeEn: 'My ____ is a little brown dog.',
        clozeHe: 'חיית המחמד שלי היא כלב חום קטן.',
        answer: 'pet',
        wrong: ['net', 'end'],
      },
      {
        clozeEn: 'The kitten is very ____.',
        clozeHe: 'החתלתול רך מאוד.',
        answer: 'soft',
        wrong: ['from', 'know'],
      },
      {
        clozeEn: 'Kick the ball into the ____!',
        clozeHe: 'בעטו את הכדור לתוך הרשת!',
        answer: 'net',
        wrong: ['soft', 'today'],
      },
      {
        clozeEn: 'My favorite ____ is green.',
        clozeHe: 'הצבע האהוב עליי הוא ירוק.',
        answer: 'color',
        wrong: ['hot', 'both'],
      },
      {
        clozeEn: 'Noa is my ____ friend.',
        clozeHe: 'נועה היא החברה הכי טובה שלי.',
        answer: 'best',
        wrong: ['cut', 'from'],
      },
      {
        clozeEn: 'Please ____ the paper with the scissors.',
        clozeHe: 'גזרו את הנייר במספריים, בבקשה.',
        answer: 'cut',
        wrong: ['soft', 'end'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which question is correct?',
        correct: 'Do you like pizza?',
        wrong: ['You like do pizza?', 'Do you likes pizza?'],
        explainHe: 'שאלה כזאת מתחילה ב-Do, ואחרי Do you הפועל בא בלי s.',
        hintHe: 'במה מתחילה השאלה? ומה קורה לפועל שאחריה?',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Do you have a red pencil?',
        wrong: ['Do you has a red pencil?', 'Have you do a red pencil?'],
        explainHe: 'שואלים Do you have…? אחרי Do you בא have.',
        hintHe: 'have או has? ובמה מתחילה השאלה?',
      },
      {
        questionEn: 'Do you like milk? (You like milk.) Which answer is correct?',
        correct: 'Yes, I do. I like milk.',
        wrong: ['Yes, I like. I like milk.', 'Yes, I am. I like milk.'],
        explainHe: 'על שאלה עם Do עונים בקצרה: Yes, I do.',
        hintHe: 'איזו מילה מהשאלה חוזרת בתשובה?',
      },
      {
        questionEn: 'Do you have a bike? (You have no bike.) Which answer is correct?',
        correct: 'No, I don\'t. I have a scooter.',
        wrong: ['No, I doesn\'t. I have a scooter.', 'No, I not. I have a scooter.'],
        explainHe: 'תשובה שלילית קצרה: No, I don\'t (do not).',
        hintHe: 'עם I אומרים do, לא does. איך עושים מזה "לא"?',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Where is your teacher from?',
        wrong: ['Where your teacher is from?', 'Where are your teacher from?'],
        explainHe: 'בשאלה עם Where בא קודם is ואחר כך your teacher.',
        hintHe: 'מה בא מיד אחרי Where? ומה מתאים ל-teacher אחד?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We both have a little dog.',
        wrong: ['We have both a little dog.', 'We both has a little dog.'],
        explainHe: 'both בא לפני have, ועם we אומרים have.',
        hintHe: 'איפה עומד both? ומה מתאים ל-we: have או has?',
      },
    ],
    sentences: [
      { en: 'Do you like little rabbits?', he: 'אתם אוהבים ארנבים קטנים?' },
      { en: 'Do you have a pet at home?', he: 'יש לכם חיית מחמד בבית?' },
      { en: 'Yes, I do. I have a cat.', he: 'כן. יש לי חתול.' },
      { en: 'No, I don\'t like hot soup.', he: 'לא, אני לא אוהב/ת מרק חם.' },
      { en: 'Do you know the new girl?', he: 'אתם מכירים את הילדה החדשה?' },
      { en: 'What color is your pet?', he: 'באיזה צבע חיית המחמד שלך?' },
    ],
    passages: [
      {
        passageEn:
          'Yael has a new pet. It is a little white rabbit. Her friend Tom asks, Do you like your rabbit? Yael says, Yes, I do! It is soft and fun. Tom asks, Do you have a dog too? Yael says, No, I don\'t.',
        passageHe:
          'ליעל יש חיית מחמד חדשה. זה ארנב לבן קטן. החבר שלה תום שואל: את אוהבת את הארנב שלך? יעל אומרת: כן! הוא רך וכיפי. תום שואל: יש לך גם כלב? יעל אומרת: לא.',
        questions: [
          {
            questionEn: 'What is Yael\'s new pet?',
            questionHe: 'מה חיית המחמד החדשה של יעל?',
            correct: 'A white rabbit.',
            wrong: ['A brown dog.', 'A black cat.'],
          },
          {
            questionEn: 'Does Yael like her pet?',
            questionHe: 'יעל אוהבת את חיית המחמד שלה?',
            correct: 'Yes, she does.',
            wrong: ['No, she doesn\'t.', 'She has no pet.'],
          },
          {
            questionEn: 'Does Yael have a dog?',
            questionHe: 'יש ליעל כלב?',
            correct: 'No, she has no dog.',
            wrong: ['Yes, a big dog.', 'Yes, two dogs.'],
          },
        ],
      },
      {
        passageEn:
          'Today is game day. Ido and Omer both like football. Ido asks, Do you have a ball? Omer says, Yes, I do. Ido says, I have a net at home! At the end of the day, they are hot and happy.',
        passageHe:
          'היום יום משחקים. עידו ועומר אוהבים שניהם כדורגל. עידו שואל: יש לך כדור? עומר אומר: כן. עידו אומר: יש לי רשת בבית! בסוף היום חם להם והם שמחים.',
        questions: [
          {
            questionEn: 'What do Ido and Omer like?',
            questionHe: 'מה עידו ועומר אוהבים?',
            correct: 'Football.',
            wrong: ['Swimming.', 'Pets.'],
          },
          {
            questionEn: 'Who says, Yes, I do?',
            questionHe: 'מי אומר: כן?',
            correct: 'Omer.',
            wrong: ['Ido.', 'Nobody.'],
          },
          {
            questionEn: 'Where is the net?',
            questionHe: 'איפה הרשת?',
            correct: 'At Ido\'s home.',
            wrong: ['At school.', 'In the park.'],
          },
        ],
      },
    ],
  },
};
