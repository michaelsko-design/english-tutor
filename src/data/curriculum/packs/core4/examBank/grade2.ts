import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-4 source's grade 2 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_4_GRADE_2_EXAM_BANK: ExamBankPack = {
  // Unit 24: home, address and numbers (Where do you live? How many? There are…)
  24: {
    vocabulary: [
      {
        clozeEn: 'Our school is ____ the park.',
        clozeHe: 'בית הספר שלנו ליד הפארק.',
        answer: 'next to',
        wrong: ['plus', 'half'],
      },
      {
        clozeEn: 'Can I ____ a card to Grandpa?',
        clozeHe: 'אפשר לשלוח כרטיס לסבא?',
        answer: 'send',
        wrong: ['half', 'kid'],
      },
      {
        clozeEn: 'Three ____ four is seven.',
        clozeHe: 'שלוש ועוד ארבע זה שבע.',
        answer: 'plus',
        wrong: ['next to', 'help'],
      },
      {
        clozeEn: 'I eat ____ of the sandwich.',
        clozeHe: 'אני אוכל/ת חצי מהכריך.',
        answer: 'half',
        wrong: ['send', 'help'],
      },
      {
        clozeEn: 'Can you ____ me with my bag, please?',
        clozeHe: 'אפשר לעזור לי עם התיק, בבקשה?',
        answer: 'help',
        wrong: ['plus', 'half'],
      },
      {
        clozeEn: 'The car is ____ the house.',
        clozeHe: 'המכונית עומדת מול הבית.',
        answer: 'in front of',
        wrong: ['a few', 'help'],
      },
    ],
    grammar: [
      {
        questionEn: 'Your friend asks, "Where do you live?" What do you say?',
        correct: 'I live in Netanya.',
        wrong: ['I lives in Netanya.', 'I in live Netanya.'],
        explainHe: 'עונים I live in … (אני גר/ה ב...). אחרי I בא live בלי s.',
        hintHe: 'בדקו את live ואת סדר המילים.',
      },
      {
        questionEn: 'Six cats. Which sentence is right?',
        correct: 'There are six cats.',
        wrong: ['There is six cats.', 'There are six cat.'],
        explainHe: 'עם כמה דברים אומרים There are, והשם ברבים: six cats.',
        hintHe: 'בדקו את are ואת ה-s בסוף.',
      },
      {
        questionEn: 'You want to know the number of pencils. What do you ask?',
        correct: 'How many pencils are there?',
        wrong: ['How old pencils are there?', 'Where pencils are there?'],
        explainHe: 'How many? פירושו "כמה?": How many pencils are there?',
        hintHe: 'איזו שאלה שואלת על מספר?',
      },
      {
        questionEn: 'Which sentence tells your address?',
        correct: 'My address is 7 Lake Street.',
        wrong: ['My address are 7 Lake Street.', 'I address is 7 Lake Street.'],
        explainHe: 'אומרים My address is … (הכתובת שלי היא...).',
        hintHe: 'בדקו את My ואת is.',
      },
      {
        questionEn: 'Grandpa asks, "How are you?" What do you say?',
        correct: 'I feel well today, Grandpa.',
        wrong: ['I well feel today, Grandpa.', 'I feels well today, Grandpa.'],
        explainHe: 'עונים I feel well (אני מרגיש/ה טוב). אחרי I בא feel בלי s, ואחריו well.',
        hintHe: 'בדקו את feel ואת סדר המילים.',
      },
      {
        questionEn: 'Which sentence is right?',
        correct: 'We help Mom.',
        wrong: ['We helps Mom.', 'Us help Mom.'],
        explainHe: 'עם we אומרים help בלי s, והמשפט מתחיל ב-We (לא Us).',
        hintHe: 'בדקו את We ואת help.',
      },
    ],
    sentences: [
      { en: 'Where do you live, Ido?', he: 'איפה אתה גר, עידו?' },
      { en: 'I live next to the school.', he: 'אני גר/ה ליד בית הספר.' },
      { en: 'There are a lot of trees in the park.', he: 'יש הרבה עצים בפארק.' },
      { en: 'How many kids are in your class?', he: 'כמה ילדים יש בכיתה שלכם?' },
      { en: 'I have a few red pens.', he: 'יש לי כמה עטים אדומים.' },
      { en: 'My dad and I help Mom.', he: 'אבא ואני עוזרים לאמא.' },
    ],
    passages: [
      {
        passageEn:
          'Hi! My name is Yoni. I live in Rehovot. My address is 4 Olive Street. My house is next to a big park. There are four people in my family: my mom, my dad, my sister and me.',
        passageHe:
          'היי! קוראים לי יוני. אני גר ברחובות. הכתובת שלי היא רחוב הזית 4. הבית שלי ליד פארק גדול. במשפחה שלי יש ארבעה אנשים: אמא, אבא, אחותי ואני.',
        questions: [
          {
            questionEn: 'Where does Yoni live?',
            questionHe: 'איפה יוני גר?',
            correct: 'In Rehovot.',
            wrong: ['In Haifa.', 'In the park.'],
          },
          {
            questionEn: 'What is next to Yoni\'s house?',
            questionHe: 'מה נמצא ליד הבית של יוני?',
            correct: 'A big park.',
            wrong: ['A big shop.', 'A school.'],
          },
          {
            questionEn: 'How many people are in Yoni\'s family?',
            questionHe: 'כמה אנשים יש במשפחה של יוני?',
            correct: 'Four.',
            wrong: ['Three.', 'Five.'],
          },
        ],
      },
      {
        passageEn:
          'It is Saturday. Mom and Dad make a big cake. Lea and her brother help them. Then Dad cuts the cake. Lea eats half of her piece, and her brother eats a lot of cake!',
        passageHe:
          'היום שבת. אמא ואבא מכינים עוגה גדולה. לאה ואחיה עוזרים להם. ואז אבא חותך את העוגה. לאה אוכלת חצי מהחתיכה שלה, ואחיה אוכל הרבה עוגה!',
        questions: [
          {
            questionEn: 'Who makes the cake?',
            questionHe: 'מי מכין את העוגה?',
            correct: 'Mom and Dad.',
            wrong: ['Lea\'s friends.', 'Grandma.'],
          },
          {
            questionEn: 'Who cuts the cake?',
            questionHe: 'מי חותך את העוגה?',
            correct: 'Dad.',
            wrong: ['Lea.', 'Mom.'],
          },
          {
            questionEn: 'What does Lea eat?',
            questionHe: 'מה לאה אוכלת?',
            correct: 'Half of her piece.',
            wrong: ['All of the cake.', 'A lot of cake.'],
          },
        ],
      },
    ],
  },
};
