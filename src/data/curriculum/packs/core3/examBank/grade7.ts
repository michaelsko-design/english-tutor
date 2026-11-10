import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-3 source's grade 7 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_3_GRADE_7_EXAM_BANK: ExamBankPack = {
  // Unit 23: would like and reflexive pronouns, at the café
  23: {
    vocabulary: [
      {
        clozeEn: 'Can I have a ____ pizza? A large one is too big for me.',
        clozeHe: 'אפשר לקבל פיצה בינונית? גדולה היא יותר מדי בשבילי.',
        answer: 'medium',
        wrong: ['purse', 'discount'],
      },
      {
        clozeEn: 'Members of the club get a ____ of five shekels on every drink.',
        clozeHe: 'חברי המועדון מקבלים הנחה של חמישה שקלים על כל משקה.',
        answer: 'discount',
        wrong: ['café', 'pleasure'],
      },
      {
        clozeEn: 'Our ____ has small tables outside and a big coffee machine inside.',
        clozeHe: 'לבית הקפה שלנו יש שולחנות קטנים בחוץ ומכונת קפה גדולה בפנים.',
        answer: 'café',
        wrong: ['purse', 'anyway'],
      },
      {
        clozeEn: 'These strawberries are very ____. We picked them this morning.',
        clozeHe: 'התותים האלה טריים מאוד. קטפנו אותם הבוקר.',
        answer: 'fresh',
        wrong: ['medium', 'quite'],
      },
      {
        clozeEn: 'The milk is finished? Oh well, ____. We can drink our coffee black.',
        clozeHe: 'החלב נגמר? נו טוב, לא נורא. אנחנו יכולים לשתות את הקפה שלנו שחור.',
        answer: 'never mind',
        wrong: ['on offer', 'a little bit'],
      },
      {
        clozeEn: 'She paid for the sandwich with coins from her ____.',
        clozeHe: 'היא שילמה על הכריך במטבעות מהארנק שלה.',
        answer: 'purse',
        wrong: ['discount', 'pleasure'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete: "I\'d like ____ a table for four, please."',
        correct: 'to book',
        wrong: ['book', 'booking'],
        explainHe: 'אחרי would like בא to ופועל: would like to book.',
        hintHe: 'מה בא אחרי would like לפני פועל?',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Would you like some more cake?',
        wrong: ['Do you would like some more cake?', 'Would you likes some more cake?'],
        explainHe: 'בשאלה would בא בתחילת המשפט, ואחרי would הפועל like נשאר בלי s.',
        hintHe: 'איך פותחים שאלה מנומסת, ומה קורה לפועל אחרי פועל העזר?',
      },
      {
        questionEn: 'Complete: "My sister would ____ a vanilla milkshake."',
        correct: 'like',
        wrong: ['likes', 'liking'],
        explainHe: 'אחרי would הפועל נשאר בצורת הבסיס: would like.',
        hintHe: 'איזו צורה של הפועל באה אחרי would?',
      },
      {
        questionEn: 'Complete: "Be careful with that knife! Don\'t cut ____."',
        correct: 'yourself',
        wrong: ['yourselfs', 'you'],
        explainHe: 'הפעולה חוזרת אל מי שעושה אותה, ולכן yourself.',
        hintHe: 'מי עלול להיפגע מהפעולה? בדקו גם את סוף המילה.',
      },
      {
        questionEn: 'Complete: "The cat is washing ____."',
        correct: 'itself',
        wrong: ['himself', 'itselves'],
        explainHe: 'לבעל חיים או לדבר משתמשים ב-it, ולכן itself.',
        hintHe: 'באיזו מילה מדברים על בעל חיים באנגלית?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We painted the walls of our room ourselves.',
        wrong: ['We painted the walls of our room ourself.', 'We painted the walls of our room us.'],
        explainHe: 'we הם רבים, ולכן ourselves, עם selves בסוף.',
        hintHe: 'בדקו את המילה האחרונה: האם היא ביחיד או ברבים?',
      },
    ],
    sentences: [
      { en: 'Would you like a medium coffee or a small one?', he: 'תרצו קפה בינוני או קטן?' },
      { en: 'I would like to pay, please.', he: 'הייתי רוצה לשלם, בבקשה.' },
      { en: 'We made the sandwiches ourselves.', he: 'הכנו את הכריכים בעצמנו.' },
      { en: 'Just a moment, the tea is almost ready.', he: 'רק רגע, התה כמעט מוכן.' },
      { en: 'He looked at himself in the mirror.', he: 'הוא הסתכל על עצמו במראה.' },
      { en: 'Pancakes are on offer this morning.', he: 'הבוקר יש מבצע על פנקייקים.' },
    ],
    passages: [
      {
        passageEn:
          'Lia and her mom go to their favorite café every Saturday. Today, the waiter says, "Fresh orange juice is on offer." Lia would like a big glass, but her mom would prefer a medium coffee. When the bill comes, Mom looks for her purse. "Never mind," says the waiter, "you can pay next time."',
        passageHe:
          'ליה ואמא שלה הולכות לבית הקפה האהוב עליהן בכל שבת. היום המלצר אומר: "יש מבצע על מיץ תפוזים טרי." ליה רוצה כוס גדולה, אבל אמא שלה מעדיפה קפה בינוני. כשהחשבון מגיע, אמא מחפשת את הארנק שלה. "לא נורא," אומר המלצר, "אפשר לשלם בפעם הבאה."',
        questions: [
          {
            questionEn: 'When do Lia and her mom go to the café?',
            questionHe: 'מתי ליה ואמא שלה הולכות לבית הקפה?',
            correct: 'Every Saturday.',
            wrong: ['Every evening.', 'Once a month.'],
          },
          {
            questionEn: 'What would Mom prefer?',
            questionHe: 'מה אמא מעדיפה?',
            correct: 'A medium coffee.',
            wrong: ['A big glass of juice.', 'A cup of tea.'],
          },
          {
            questionEn: 'Why does the waiter say "Never mind"?',
            questionHe: 'למה המלצר אומר "לא נורא"?',
            correct: 'Mom cannot find her purse.',
            wrong: ['The juice is finished.', 'The café is closing.'],
          },
        ],
      },
      {
        passageEn:
          'For the school fair, the students of class 7B opened a small café. They did everything themselves. Dana baked the cakes herself, and Omer painted the sign by himself. The teachers enjoyed themselves so much that they came back twice. At the end of the day, the class gave all the money to a children\'s hospital.',
        passageHe:
          'ליריד בית הספר, התלמידים של כיתה ז׳2 פתחו בית קפה קטן. הם עשו הכול בעצמם. דנה אפתה את העוגות בעצמה, ועומר צבע את השלט לבד. המורים נהנו כל כך שהם חזרו פעמיים. בסוף היום הכיתה נתנה את כל הכסף לבית חולים לילדים.',
        questions: [
          {
            questionEn: 'Who painted the sign?',
            questionHe: 'מי צבע את השלט?',
            correct: 'Omer.',
            wrong: ['Dana.', 'The teachers.'],
          },
          {
            questionEn: 'Why did the teachers come back twice?',
            questionHe: 'למה המורים חזרו פעמיים?',
            correct: 'They enjoyed the café very much.',
            wrong: ['They forgot their money.', 'They wanted to help bake.'],
          },
          {
            questionEn: 'What did the class do with the money?',
            questionHe: 'מה הכיתה עשתה עם הכסף?',
            correct: "They gave it to a children's hospital.",
            wrong: ['They bought a new coffee machine.', 'They kept it for a class trip.'],
          },
        ],
      },
    ],
  },
};
