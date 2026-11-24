import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-4 source's grade 6 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_4_GRADE_6_EXAM_BANK: ExamBankPack = {
  // Unit 24: travel stories (past simple with when, because / because of)
  24: {
    vocabulary: [
      {
        clozeEn: 'I packed my clothes in a big ____.',
        clozeHe: 'ארזתי את הבגדים שלי במזוודה גדולה.',
        answer: 'suitcase',
        wrong: ['platform', 'stairs'],
      },
      {
        clozeEn: 'The flight was canceled ____ the storm.',
        clozeHe: 'הטיסה בוטלה בגלל הסערה.',
        answer: 'because of',
        wrong: ['instead', 'nearly'],
      },
      {
        clozeEn: 'The elevator is broken, so we need to take the ____.',
        clozeHe: 'המעלית מקולקלת, אז צריך לעלות במדרגות.',
        answer: 'stairs',
        wrong: ['gate', 'journey'],
      },
      {
        clozeEn: 'My little brother was ____ of the dark.',
        clozeHe: 'אחי הקטן פחד מהחושך.',
        answer: 'afraid',
        wrong: ['strange', 'double'],
      },
      {
        clozeEn: 'We didn\'t have time to wait, so we left ____.',
        clozeHe: 'לא היה לנו זמן לחכות, אז יצאנו מיד.',
        answer: 'immediately',
        wrong: ['strange', 'excellent'],
      },
      {
        clozeEn: 'The pizza was ____. It was the best pizza in town!',
        clozeHe: 'הפיצה הייתה מצוינת. זו הייתה הפיצה הכי טובה בעיר!',
        answer: 'excellent',
        wrong: ['afraid', 'nearly'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is right?',
        correct: 'When we arrived, the hotel was full.',
        wrong: ['When we arrive, the hotel was full.', 'When we arrived, the hotel is full.'],
        explainHe: 'בסיפור על העבר שני החלקים בעבר: arrived ו-was.',
        hintHe: 'בדקו ששני הפעלים בעבר.',
      },
      {
        questionEn: 'Which sentence is right?',
        correct: 'We stayed home because it was very hot.',
        wrong: ['We stayed home because of it was very hot.', 'We stayed home because it is very hot yesterday.'],
        explainHe: 'because (כי) בא לפני משפט שלם, והסיפור בעבר: it was.',
        hintHe: 'אחרי החיבור בא משפט שלם. איזו מילה מתאימה?',
      },
      {
        questionEn: 'Which sentence is right?',
        correct: 'The game stopped because of the rain.',
        wrong: ['The game stopped because the rain.', 'The game stop because of the rain.'],
        explainHe: 'because of (בגלל) בא לפני שם: the rain. stopped בעבר.',
        hintHe: 'אחרי החיבור בא שם. איזה חיבור מתאים?',
      },
      {
        questionEn: 'Which sentence is right?',
        correct: 'I saw the sea when I opened the window.',
        wrong: ['I saw the sea when I open the window.', 'I see the sea when I opened the window.'],
        explainHe: 'when מחבר שני רגעים בעבר: saw ו-opened.',
        hintHe: 'בדקו את שני הפעלים.',
      },
      {
        questionEn: 'Which sentence is right?',
        correct: 'Did you notice the strange man?',
        wrong: ['Did you noticed the strange man?', 'Did you noticing the strange man?'],
        explainHe: 'אחרי Did בא פועל בלי ed: Did you notice…?',
        hintHe: 'מה קורה לפועל אחרי Did?',
      },
      {
        questionEn: 'Which sentence is right?',
        correct: 'We went by bus because we didn\'t have a car.',
        wrong: ['We went by bus because we don\'t had a car.', 'We went by bus because of we didn\'t have a car.'],
        explainHe: 'בעבר בשלילה אומרים didn\'t have. לפני משפט שלם בא because.',
        hintHe: 'בדקו את didn\'t ואת because.',
      },
    ],
    sentences: [
      { en: 'When the plane landed, everyone clapped.', he: 'כשהמטוס נחת, כולם מחאו כפיים.' },
      { en: 'We took a taxi from the airport.', he: 'לקחנו מונית משדה התעופה.' },
      { en: 'I was afraid because the road was dark.', he: 'פחדתי כי הדרך הייתה חשוכה.' },
      { en: 'The trip was canceled because of the snow.', he: 'הטיול בוטל בגלל השלג.' },
      { en: 'We played cards during the long journey.', he: 'שיחקנו קלפים במהלך הנסיעה הארוכה.' },
      { en: 'Can you describe your best trip?', he: 'אתם יכולים לתאר את הטיול הכי טוב שלכם?' },
    ],
    passages: [
      {
        passageEn:
          'Last summer, Adi and her parents flew to Rome. When they arrived at the airport, they couldn\'t find their suitcase. They waited for an hour. Finally, a woman brought it to them. Adi was tired, but she was happy because the trip started well after all.',
        passageHe:
          'בקיץ שעבר עדי וההורים שלה טסו לרומא. כשהם הגיעו לשדה התעופה, הם לא מצאו את המזוודה שלהם. הם חיכו שעה. בסוף אישה הביאה אותה אליהם. עדי הייתה עייפה, אבל היא שמחה כי הטיול התחיל טוב בכל זאת.',
        questions: [
          {
            questionEn: 'Where did Adi\'s family fly?',
            questionHe: 'לאן טסה המשפחה של עדי?',
            correct: 'To Rome.',
            wrong: ['To London.', 'To Eilat.'],
          },
          {
            questionEn: 'What was the problem at the airport?',
            questionHe: 'מה הייתה הבעיה בשדה התעופה?',
            correct: 'They couldn\'t find their suitcase.',
            wrong: ['They missed their flight.', 'The airport was closed.'],
          },
          {
            questionEn: 'Who brought the suitcase?',
            questionHe: 'מי הביא את המזוודה?',
            correct: 'A woman at the airport.',
            wrong: ['Adi\'s dad.', 'A taxi driver.'],
          },
        ],
      },
      {
        passageEn:
          'Yoav\'s class went on a trip to the desert. During the night, the wind was very strong. Some kids were afraid, but the guide stayed with them. In the morning, they didn\'t climb the mountain because of the heat. Instead, they swam in a cool spring.',
        passageHe:
          'הכיתה של יואב יצאה לטיול במדבר. במהלך הלילה הרוח הייתה חזקה מאוד. כמה ילדים פחדו, אבל המדריך נשאר איתם. בבוקר הם לא טיפסו על ההר בגלל החום. במקום זה, הם שחו במעיין קריר.',
        questions: [
          {
            questionEn: 'Where did the class go?',
            questionHe: 'לאן הכיתה יצאה?',
            correct: 'To the desert.',
            wrong: ['To the sea.', 'To the city.'],
          },
          {
            questionEn: 'Why were some kids afraid?',
            questionHe: 'למה כמה ילדים פחדו?',
            correct: 'The wind was very strong.',
            wrong: ['The guide went home.', 'They saw a snake.'],
          },
          {
            questionEn: 'Why didn\'t they climb the mountain?',
            questionHe: 'למה הם לא טיפסו על ההר?',
            correct: 'Because of the heat.',
            wrong: ['Because of the rain.', 'Because they were tired.'],
          },
        ],
      },
    ],
  },
};
