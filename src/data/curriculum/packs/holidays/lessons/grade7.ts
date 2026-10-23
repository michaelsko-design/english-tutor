import type { LessonPack } from '../../../lessons/types';

/**
 * Holidays pack, grade 7 mini-lessons (Feature 42): reviews of Present Simple, Present
 * Progressive and stative verbs through the holidays. The Bosses get the recap of their unit.
 */
export const HOLIDAYS_GRADE_7_LESSONS: LessonPack = {
  'g7-u31-m1': {
    titleHe: 'מסורת שחוזרת כל שנה 🍯',
    ideaHe:
      'על מסורות ועל דברים שקורים בכל שנה מספרים ב-Present Simple. עם he / she / it מוסיפים s לפועל. מילים כמו every year ו-always הן הרמז.',
    pattern: 'every year + Present Simple',
    examples: [
      { en: 'Every year, we visit our cousins in Eilat.', he: 'בכל שנה אנחנו מבקרים את בני הדודים שלנו באילת.', highlight: 'visit' },
      { en: 'My aunt always bakes a round challah.', he: 'הדודה שלי תמיד אופה חלה עגולה.', highlight: 'bakes' },
      { en: 'The holiday dinner starts at seven.', he: 'ארוחת החג מתחילה בשבע.', highlight: 'starts' },
    ],
    tipHe: 'עם families או people (רבים) הפועל בלי s: families eat.',
    quickTry: {
      promptHe: 'איזה פועל משלים את המשפט?',
      questionEn: 'My mother ____ a special cake every Rosh Hashana.',
      correct: 'makes',
      wrong: 'make',
      explainHe: 'my mother היא she, ולכן מוסיפים s: makes.',
    },
  },
  'g7-u31-m2': {
    titleHe: 'מה קורה ממש עכשיו? 👀',
    ideaHe:
      'על מה שקורה ברגע זה מספרים ב-Present Progressive: am / is / are + פועל עם ing. מילים כמו now, right now ו-Look! הן הרמז.',
    pattern: 'am / is / are + verb-ing',
    examples: [
      { en: 'Listen! The wind is blowing very hard.', he: 'הקשיבו! הרוח נושבת חזק מאוד.', highlight: 'is blowing' },
      { en: 'We are singing Hanukkah songs right now.', he: 'אנחנו שרים שירי חנוכה ממש עכשיו.', highlight: 'are singing' },
      { en: 'Dana is wearing her warm red sweater today.', he: 'דנה לובשת היום את הסוודר האדום והחם שלה.', highlight: 'is wearing' },
    ],
    tipHe: 'אל תשכחו את am / is / are: she is reading, לא she reading.',
    quickTry: {
      promptHe: 'מה מתאים לרגע הזה?',
      questionEn: 'Look! It ____ outside.',
      correct: 'is raining',
      wrong: 'rains',
      explainHe: 'Look! מראה שזה קורה ממש עכשיו, ולכן is raining.',
    },
  },
  'g7-u32-m1': {
    titleHe: 'פעלים שלא אוהבים ing ❤️',
    ideaHe:
      'יש פעלים שמתארים מצב ולא פעולה: love, like, want, need, know, believe. גם כשמדברים על עכשיו, הם נשארים ב-Present Simple, בלי ing.',
    pattern: 'love / want / need / know + (no -ing)',
    examples: [
      { en: 'We love the smell of the almond trees.', he: 'אנחנו אוהבים את הריח של עצי השקד.', highlight: 'love' },
      { en: 'Do you know the name of this tree?', he: 'אתם יודעים איך קוראים לעץ הזה?', highlight: 'know' },
      { en: 'My brother needs a hat for his costume.', he: 'אח שלי צריך כובע לתחפושת שלו.', highlight: 'needs' },
    ],
    tipHe: 'אומרים I want, ולא I am wanting, גם כשהרצון הוא עכשיו.',
    quickTry: {
      promptHe: 'איזה משפט נכון?',
      questionEn: 'Noa ____ a clown costume this year.',
      correct: 'wants',
      wrong: 'is wanting',
      explainHe: 'want הוא פועל מצב, ולכן Present Simple: wants.',
    },
  },
  'g7-u32-m2': {
    titleHe: 'כל שנה או ברגע הזה? 🎉',
    ideaHe:
      'Present Simple מספר מה עושים בכל שנה בחג. Present Progressive מספר מה קורה עכשיו, באמצע החגיגה. בדקו את מילות הזמן במשפט.',
    pattern: 'every year → verb(s) · now → am / is / are + verb-ing',
    examples: [
      { en: 'We eat matzah on Passover.', he: 'אנחנו אוכלים מצה בפסח.', highlight: 'eat' },
      { en: 'Right now, Grandpa is telling the story.', he: 'ממש עכשיו, סבא מספר את הסיפור.', highlight: 'is telling' },
      { en: 'People sing the anthem at the ceremony.', he: 'אנשים שרים את ההמנון בטקס.', highlight: 'sing' },
    ],
    tipHe: 'every, always ו-usually מובילים ל-Present Simple. now ו-at the moment מובילים ל-ing.',
    quickTry: {
      promptHe: 'מה מתאים?',
      questionEn: 'At the moment, my cousins ____ in the park.',
      correct: 'are playing',
      wrong: 'play',
      explainHe: 'At the moment מראה שזה קורה עכשיו, ולכן are playing.',
    },
  },
};
