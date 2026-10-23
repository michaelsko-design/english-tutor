import type { LessonPack } from '../../../lessons/types';

/** The holidays pack's grade 4 mini-lessons (Feature 42): holiday words with review-level grammar. */
export const HOLIDAYS_GRADE_4_LESSONS: LessonPack = {
  'g4-u31-m1': {
    titleHe: 'מה יש על שולחן החג? 🍎',
    ideaHe: 'על דבר אחד אומרים There is (יש). על כמה דברים אומרים There are, והמילה מקבלת s.',
    pattern: 'There is + one · There are + many',
    examples: [
      { en: 'There is a round challah.', he: 'יש חלה עגולה.', highlight: 'There is', emoji: '🍞' },
      { en: 'There are red pomegranates.', he: 'יש רימונים אדומים.', highlight: 'There are', emoji: '❤️' },
      { en: 'There are six plates.', he: 'יש שש צלחות.', highlight: 'There are', emoji: '🍽️' },
    ],
    quickTry: {
      promptHe: 'מה מתאים?',
      questionEn: 'There ____ two apples in the bowl.',
      correct: 'are',
      wrong: 'is',
      explainHe: 'שני תפוחים הם יותר מאחד, ולכן There are.',
    },
  },
  'g4-u31-m2': {
    titleHe: 'איפה זה בסוכה? in, on, under 🌴',
    ideaHe: 'in אומר בתוך, on אומר על, under אומר מתחת. מילת המקום באה לפני the: on the roof.',
    pattern: 'in / on / under + the + place',
    examples: [
      { en: 'The etrog is in the box.', he: 'האתרוג בתוך הקופסה.', highlight: 'in the box', emoji: '📦' },
      { en: 'The leaves are on the roof.', he: 'העלים על הגג.', highlight: 'on the roof', emoji: '🍃' },
      { en: 'The dog sits under the table.', he: 'הכלב יושב מתחת לשולחן.', highlight: 'under the table', emoji: '🐶' },
    ],
    quickTry: {
      promptHe: 'הקישוט תלוי למעלה, על הקיר. מה מתאים?',
      questionEn: 'The decoration is ____ the wall.',
      correct: 'on',
      wrong: 'under',
      explainHe: 'משהו שתלוי על הקיר הוא on the wall.',
    },
  },
  'g4-u32-m1': {
    titleHe: 'can בחגים: מה אפשר לעשות? 🌱',
    ideaHe: 'can אומר שאפשר או יודעים לעשות משהו. אחרי can ו-can’t בא הפועל כמו שהוא.',
    pattern: 'can / can’t + verb',
    examples: [
      { en: 'We can water the plants.', he: 'אנחנו יכולים להשקות את הצמחים.', highlight: 'can water', emoji: '💧' },
      { en: 'I can wear a mask.', he: 'אני יכול/ה לשים מסכה.', highlight: 'can wear', emoji: '🎭' },
      { en: "A baby can't climb a tree.", he: 'תינוק לא יכול לטפס על עץ.', highlight: "can't climb", emoji: '👶' },
    ],
    quickTry: {
      promptHe: 'מה נכון?',
      correct: 'She can make a mask.',
      wrong: 'She can makes a mask.',
      explainHe: 'אחרי can הפועל בלי s: can make.',
    },
  },
  'g4-u32-m2': {
    titleHe: 'יום העצמאות: There is ו-There are 🎆',
    ideaHe: 'גם בחוץ סופרים: There is a picnic (פיקניק אחד), There are many flags (הרבה דגלים).',
    pattern: 'There is a … · There are many …',
    examples: [
      { en: 'There is a big party in town.', he: 'יש מסיבה גדולה בעיר.', highlight: 'There is', emoji: '🎉' },
      { en: 'There are balloons on the trees.', he: 'יש בלונים על העצים.', highlight: 'There are', emoji: '🎈' },
    ],
    tipHe: 'לא אומרים It is a flag כשרוצים לומר "יש דגל". אומרים There is a flag.',
    quickTry: {
      promptHe: 'מה נכון?',
      correct: 'There are many people in the park.',
      wrong: 'There is many people in the park.',
      explainHe: 'many people הם הרבה אנשים, ולכן There are.',
    },
  },
};
