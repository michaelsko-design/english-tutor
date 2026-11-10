import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-3 source's grade 6 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_3_GRADE_6_EXAM_BANK: ExamBankPack = {
  // Unit 23: adverbs of manner, sports and competitions
  23: {
    vocabulary: [
      {
        clozeEn: 'Please ____ the ball to me, and I will catch it.',
        clozeHe: 'בבקשה זרקו לי את הכדור, ואני אתפוס אותו.',
        answer: 'throw',
        wrong: ['side', 'special'],
      },
      {
        clozeEn: 'Be ____ with the eggs! They can break.',
        clozeHe: 'היזהרו עם הביצים! הן יכולות להישבר.',
        answer: 'careful',
        wrong: ['almost', 'step'],
      },
      {
        clozeEn: 'The players stand in ____ of the field.',
        clozeHe: 'השחקנים עומדים באמצע המגרש.',
        answer: 'the middle',
        wrong: ['a while', 'hang on'],
      },
      {
        clozeEn: 'We have ____ water for the whole game.',
        clozeHe: 'יש לנו מספיק מים לכל המשחק.',
        answer: 'enough',
        wrong: ['across', 'push'],
      },
      {
        clozeEn: 'The race is ____ over. Only one more step!',
        clozeHe: 'המרוץ כמעט נגמר. רק עוד צעד אחד!',
        answer: 'almost',
        wrong: ['catch', 'follow'],
      },
      {
        clozeEn: 'Swimmers from every country come to the ____.',
        clozeHe: 'שחיינים מכל מדינה באים למשחקים האולימפיים.',
        answer: 'Olympic Games',
        wrong: ['the middle', 'not bad'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete: "The cheetah runs very ____."',
        correct: 'quickly',
        wrong: ['quick', 'quicker'],
        explainHe: 'המילה מתארת איך הברדלס רץ, ולכן תואר פועל: quickly.',
        hintHe: 'המילה מתארת פעולה. מה מוסיפים ל-quick?',
      },
      {
        questionEn: 'Complete: "Omer plays the piano very ____."',
        correct: 'well',
        wrong: ['good', 'goodly'],
        explainHe: 'כדי לתאר איך מנגנים אומרים well, לא good.',
        hintHe: 'מה תואר הפועל של good?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'The team trains hard every day.',
        wrong: ['The team trains hardly every day.', 'The team trains hards every day.'],
        explainHe: 'hard נשאר hard גם כתואר פועל. hardly פירושו כמעט לא.',
        hintHe: 'יש תוארי פועל שלא מוסיפים להם ly. בדקו את סוף המילה.',
      },
      {
        questionEn: 'Complete: "She won the race ____."',
        correct: 'easily',
        wrong: ['easy', 'easyly'],
        explainHe: 'easy + ly = easily: ה-y הופך ל-i.',
        hintHe: 'מה קורה ל-y כשמוסיפים ly?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'Dan reads the question carefully.',
        wrong: ['Dan reads carefully the question.', 'Dan reads the question careful.'],
        explainHe: 'תואר הפועל carefully בא אחרי הדבר שעליו עושים את הפעולה: reads the question carefully.',
        hintHe: 'בדקו את סוף המילה ואת המקום שלה במשפט.',
      },
      {
        questionEn: 'Complete: "Shhh! Walk ____. The baby is sleeping."',
        correct: 'slowly and quietly',
        wrong: ['slow and quiet', 'slowly and quiet'],
        explainHe: 'שתי המילים מתארות איך הולכים, ולכן שתיהן עם ly: slowly and quietly.',
        hintHe: 'כמה מילים מתארות את הפעולה? בדקו את שתיהן.',
      },
    ],
    sentences: [
      { en: 'Run quickly, and catch the ball carefully.', he: 'רוצו מהר, ותפסו את הכדור בזהירות.' },
      { en: 'Our team plays well because we train hard.', he: 'הקבוצה שלנו משחקת טוב כי אנחנו מתאמנים קשה.' },
      { en: 'She swims across the pool easily.', he: 'היא שוחה לרוחב הבריכה בקלות.' },
      { en: 'The old man walks slowly to the bus stop.', he: 'האיש הזקן הולך לאט לתחנת האוטובוס.' },
      { en: 'Follow me to the middle of the field.', he: 'בואו אחריי לאמצע המגרש.' },
      { en: 'Hang on! The game is not over.', he: 'רגע! המשחק לא נגמר.' },
    ],
    passages: [
      {
        passageEn:
          'Yoni loves soccer. He trains hard three times a week. In the big game on Friday, Yoni runs quickly and passes the ball well. In the last minute, he kicks the ball carefully into the net. His team wins 2 to 1, and his coach says, "Wonderful!"',
        passageHe:
          'יוני אוהב כדורגל. הוא מתאמן קשה שלוש פעמים בשבוע. במשחק הגדול ביום שישי, יוני רץ מהר ומוסר את הכדור טוב. בדקה האחרונה הוא בועט בכדור בזהירות לתוך השער. הקבוצה שלו מנצחת 2 ל-1, והמאמן שלו אומר: "נפלא!"',
        questions: [
          {
            questionEn: 'How often does Yoni train?',
            questionHe: 'כמה פעמים יוני מתאמן?',
            correct: 'Three times a week.',
            wrong: ['Every day.', 'Once a week.'],
          },
          {
            questionEn: 'How does Yoni kick the ball in the last minute?',
            questionHe: 'איך יוני בועט בכדור בדקה האחרונה?',
            correct: 'Carefully.',
            wrong: ['Slowly.', 'Badly.'],
          },
          {
            questionEn: 'What is the score?',
            questionHe: 'מה התוצאה?',
            correct: '2 to 1.',
            wrong: ['1 to 1.', '3 to 2.'],
          },
        ],
      },
      {
        passageEn:
          'Mika is in a swimming competition. She is not the fastest swimmer, but she swims well and never stops. After a while, the swimmers in front of her are tired. Mika swims across the pool easily and finishes second. "Not bad at all!" says her mom.',
        passageHe:
          'מיקה בתחרות שחייה. היא לא השחיינית הכי מהירה, אבל היא שוחה טוב ואף פעם לא עוצרת. אחרי זמן מה, השחיינים שלפניה עייפים. מיקה שוחה לרוחב הבריכה בקלות ומסיימת שנייה. "לא רע בכלל!" אומרת אמא שלה.',
        questions: [
          {
            questionEn: 'What kind of competition is it?',
            questionHe: 'איזו תחרות זאת?',
            correct: 'Swimming.',
            wrong: ['Running.', 'Soccer.'],
          },
          {
            questionEn: 'Why do the other swimmers slow down?',
            questionHe: 'למה השחיינים האחרים מאטים?',
            correct: 'They are tired.',
            wrong: ['They are hungry.', 'The water is cold.'],
          },
          {
            questionEn: 'In which place does Mika finish?',
            questionHe: 'באיזה מקום מיקה מסיימת?',
            correct: 'Second.',
            wrong: ['First.', 'Last.'],
          },
        ],
      },
    ],
  },
};
