import type { LessonPack } from '../../../lessons/types';

/** The holidays pack's grade 6 mini-lessons, by mission id. Both Bosses get the recap of their unit. */
export const HOLIDAYS_GRADE_6_LESSONS: LessonPack = {
  'g6-u31-m1': {
    titleHe: 'מנהגים ב-Present Simple 🍎',
    ideaHe: 'מנהג קורה שוב ושוב, ולכן מספרים עליו ב-Present Simple. מילים כמו every year ו-always מראות הרגל. עם he / she / it מוסיפים s.',
    pattern: 'every year · always + verb(s)',
    examples: [
      { en: 'Every year we visit our cousins.', he: 'בכל שנה אנחנו מבקרים את בני הדודים.', highlight: 'visit', emoji: '🏡' },
      { en: 'My uncle always tells funny stories.', he: 'הדוד שלי תמיד מספר סיפורים מצחיקים.', highlight: 'tells', emoji: '😂' },
      { en: 'The family sings together at night.', he: 'המשפחה שרה יחד בלילה.', highlight: 'sings', emoji: '🎶' },
    ],
    tipHe: 'the family היא it, ולכן the family sings ולא the family sing.',
    quickTry: {
      promptHe: 'איזה פועל מתאים?',
      questionEn: 'Every holiday my mom ____ a big salad.',
      correct: 'makes',
      wrong: 'make',
      explainHe: 'my mom היא she, ולכן מוסיפים s: makes.',
    },
  },
  'g6-u31-m2': {
    titleHe: 'מה קורה עכשיו? 🌿',
    ideaHe: 'מה שקורה ממש עכשיו: am / is / are ופועל עם ing. Look! ו-right now רומזים שזה קורה עכשיו.',
    pattern: 'am / is / are + verb-ing',
    examples: [
      { en: 'Look! Mom is hanging a lamp.', he: 'תראו! אמא תולה מנורה.', highlight: 'is hanging', emoji: '💡' },
      { en: 'The kids are cutting paper stars.', he: 'הילדים גוזרים כוכבי נייר.', highlight: 'are cutting', emoji: '✂️' },
      { en: 'We are carrying the chairs outside.', he: 'אנחנו סוחבים את הכיסאות החוצה.', highlight: 'are carrying', emoji: '🪑' },
    ],
    tipHe: 'לא לשכוח את am / is / are: the kids are cutting, ולא the kids cutting.',
    quickTry: {
      promptHe: 'מה חסר?',
      questionEn: 'Right now my friends ____ a big tent.',
      correct: 'are building',
      wrong: 'building',
      explainHe: 'צריך גם are וגם פועל עם ing: are building.',
    },
  },
  'g6-u32-m1': {
    titleHe: 'שאלות עם Do ו-Does 🌱',
    ideaHe: 'שאלה ב-Present Simple מתחילה ב-Do או ב-Does. Does בא עם he / she / it, והפועל שאחריו בלי s.',
    pattern: 'Do / Does + subject + verb?',
    examples: [
      { en: 'Do you eat dates on Tu BiShvat?', he: 'אתם אוכלים תמרים בט״ו בשבט?', highlight: 'Do you eat', emoji: '🌴' },
      { en: 'Does your sister like Purim?', he: 'אחותך אוהבת את פורים?', highlight: 'Does your sister like', emoji: '🎭' },
      { en: 'Do they send gifts to friends?', he: 'הם שולחים מתנות לחברים?', highlight: 'Do they send', emoji: '🎁' },
    ],
    tipHe: 'אחרי Does הפועל בלי s: Does he like…? ולא Does he likes…?',
    quickTry: {
      promptHe: 'Do או Does?',
      questionEn: '____ your teacher wear a costume on Purim?',
      correct: 'Does',
      wrong: 'Do',
      explainHe: 'your teacher הוא he או she, ולכן Does.',
    },
  },
  'g6-u32-m2': {
    titleHe: 'עכשיו או כל שנה? 🧹',
    ideaHe: 'מה שקורה עכשיו: is / are + ing. מה שקורה בכל שנה: Present Simple. right now ו-this week רומזים לעכשיו, every year להרגל.',
    pattern: 'now → are + verb-ing · every year → verb',
    examples: [
      { en: 'This week we are painting the fence.', he: 'השבוע אנחנו צובעים את הגדר.', highlight: 'are painting', emoji: '🖌️' },
      { en: 'We paint the fence every spring.', he: 'אנחנו צובעים את הגדר בכל אביב.', highlight: 'paint', emoji: '🌷' },
      { en: 'Grandpa is reading the story now.', he: 'סבא קורא את הסיפור עכשיו.', highlight: 'is reading', emoji: '📖' },
    ],
    tipHe: 'בעברית "צובעים" זה גם עכשיו וגם תמיד. באנגלית לכל אחד יש צורה.',
    quickTry: {
      promptHe: 'מה מתאים להרגל?',
      questionEn: 'Every Passover we ____ matzah balls.',
      correct: 'make',
      wrong: 'are making',
      explainHe: 'Every Passover הוא הרגל, ולכן Present Simple: make.',
    },
  },
};
