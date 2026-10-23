import type { LessonPack } from '../../../lessons/types';

/** The core-plus pack's grade 6 mini-lessons, by mission id. Both Bosses get the recap of their unit. */
export const CORE_PLUS_GRADE_6_LESSONS: LessonPack = {
  'g6-u21-m1': {
    titleHe: 'פעלים לא רגילים: went, took 🚂',
    ideaHe: 'לרוב הפעלים מוסיפים ed בעבר, אבל יש פעלים "לא רגילים" עם צורה מיוחדת: go → went, take → took, come → came.',
    pattern: 'go → went · take → took · come → came',
    examples: [
      { en: 'We went to the zoo last Sunday.', he: 'הלכנו לגן החיות ביום ראשון שעבר.', highlight: 'went', emoji: '🦁' },
      { en: 'Dad took a bus to work.', he: 'אבא נסע באוטובוס לעבודה.', highlight: 'took', emoji: '🚌' },
      { en: 'My cousins came for dinner.', he: 'בני הדודים שלי באו לארוחת ערב.', highlight: 'came', emoji: '🍽️' },
    ],
    tipHe: 'לא אומרים goed או taked. את הצורות המיוחדות לומדים בעל פה.',
    quickTry: {
      promptHe: 'מה הצורה בעבר?',
      questionEn: 'Last night Ori ____ home at ten.',
      correct: 'came',
      wrong: 'comed',
      explainHe: 'come הוא פועל לא רגיל, ובעבר הוא came.',
    },
  },
  'g6-u21-m2': {
    titleHe: 'עוד פעלים מיוחדים: saw, ate ⛰️',
    ideaHe: 'גם see, eat, have ו-make הם פעלים לא רגילים: see → saw, eat → ate, have → had, make → made.',
    pattern: 'see → saw · eat → ate · have → had · make → made',
    examples: [
      { en: 'I saw a big turtle at the beach.', he: 'ראיתי צב גדול בחוף.', highlight: 'saw', emoji: '🐢' },
      { en: 'We had pizza for lunch.', he: 'אכלנו פיצה לארוחת צהריים.', highlight: 'had', emoji: '🍕' },
      { en: 'Grandma made a chocolate cake.', he: 'סבתא הכינה עוגת שוקולד.', highlight: 'made', emoji: '🍰' },
    ],
    tipHe: 'have lunch = לאכול ארוחת צהריים. בעבר: had lunch.',
    quickTry: {
      promptHe: 'מה הצורה בעבר?',
      questionEn: 'Yesterday we ____ a funny movie.',
      correct: 'saw',
      wrong: 'seed',
      explainHe: 'see הוא פועל לא רגיל, ובעבר הוא saw.',
    },
  },
  'g6-u22-m1': {
    titleHe: 'הכי! the + est 🦒',
    ideaHe: 'כדי להגיד "הכי" בתואר קצר, שמים the ומוסיפים est: tall → the tallest. כך משווים אחד מול כל הקבוצה.',
    pattern: 'the + adjective-est',
    examples: [
      { en: 'Ben is the oldest kid in the class.', he: 'בן הוא הילד הכי מבוגר בכיתה.', highlight: 'the oldest', emoji: '🧒' },
      { en: 'This is the longest river here.', he: 'זה הנהר הכי ארוך כאן.', highlight: 'the longest', emoji: '🌊' },
      { en: 'July is the hottest month.', he: 'יולי הוא החודש הכי חם.', highlight: 'the hottest', emoji: '☀️' },
    ],
    tipHe: 'big, hot ו-fat מכפילים אות: the biggest. happy הופך ל-the happiest.',
    quickTry: {
      promptHe: 'איך אומרים "הכי ארוך"?',
      questionEn: 'This is ____ pencil in my bag.',
      correct: 'the longest',
      wrong: 'the longer',
      explainHe: 'הכי מכולם: the longest. longer משווה רק בין שניים.',
    },
  },
  'g6-u22-m2': {
    titleHe: 'הכי עם the most 🥇',
    ideaHe: 'בתואר ארוך לא מוסיפים est. שמים לפניו the most: the most beautiful, the most interesting.',
    pattern: 'the most + long adjective',
    examples: [
      { en: 'This is the most beautiful park.', he: 'זה הפארק הכי יפה.', highlight: 'the most beautiful', emoji: '🌳' },
      { en: 'Math is the most difficult subject for me.', he: 'מתמטיקה היא המקצוע הכי קשה בשבילי.', highlight: 'the most difficult', emoji: '📐' },
      { en: 'It was the most exciting game.', he: 'זה היה המשחק הכי מרגש.', highlight: 'the most exciting', emoji: '⚽' },
    ],
    tipHe: 'good הוא יוצא דופן: good → better → the best.',
    quickTry: {
      promptHe: 'מה נכון?',
      questionEn: 'That was ____ book of the year.',
      correct: 'the most interesting',
      wrong: 'the interestingest',
      explainHe: 'interesting הוא תואר ארוך, ולכן the most interesting.',
    },
  },
};
