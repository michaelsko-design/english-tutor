import type { LessonPack } from '../../../lessons/types';

/** The core-plus pack's grade 1 mini-lessons, by mission id: very short Hebrew, picture examples. */
export const CORE_PLUS_GRADE_1_LESSONS: LessonPack = {
  'g1-u21-m1': {
    titleHe: 'אני רואה: I see 👀',
    ideaHe: 'כשרוצים לספר מה רואים אומרים I see (אני רואה), ואז a ושם החיה: I see a bear.',
    pattern: 'I see a + animal',
    examples: [
      { en: 'I see a zebra.', he: 'אני רואה זברה.', highlight: 'I see a', emoji: '🦓' },
      { en: 'I see a monkey.', he: 'אני רואה קוף.', highlight: 'I see a', emoji: '🐒' },
      { en: 'I see a tiger.', he: 'אני רואה נמר.', highlight: 'I see a', emoji: '🐯' },
    ],
    quickTry: {
      promptHe: 'איך אומרים "אני רואה אריה"?',
      correct: 'I see a lion.',
      wrong: 'I a lion see.',
      explainHe: 'קודם I see, ואז a lion.',
    },
  },
  'g1-u21-m2': {
    titleHe: 'What do you see? ❓',
    ideaHe: 'שואלים What do you see? (מה רואים?). עונים I see a … ושם החיה.',
    pattern: 'What do you see? · I see a …',
    examples: [
      { en: 'What do you see?', he: 'מה רואים?', highlight: 'What do you see', emoji: '❓' },
      { en: 'I see a frog.', he: 'אני רואה צפרדע.', highlight: 'I see a', emoji: '🐸' },
      { en: 'I see a rabbit.', he: 'אני רואה ארנב.', highlight: 'I see a', emoji: '🐇' },
    ],
    quickTry: {
      promptHe: 'השאלה היא What do you see? 🐍 מה עונים?',
      correct: 'I see a snake.',
      wrong: 'I see snake.',
      explainHe: 'עונים I see a snake: עם a לפני החיה.',
    },
  },
  'g1-u22-m1': {
    titleHe: 'צורות וצבעים 📐',
    ideaHe: 'עיגול הוא circle, ריבוע הוא square, משולש הוא triangle. הצבע בא לפני הצורה.',
    pattern: 'a + color + shape',
    examples: [
      { en: 'a yellow triangle', he: 'משולש צהוב', highlight: 'yellow', emoji: '📐' },
      { en: 'a pink heart', he: 'לב ורוד', highlight: 'pink', emoji: '❤️' },
      { en: 'a green square', he: 'ריבוע ירוק', highlight: 'green', emoji: '🖼️' },
    ],
    quickTry: {
      promptHe: 'איך אומרים "עיגול כחול"?',
      correct: 'a blue circle',
      wrong: 'a circle blue',
      explainHe: 'הצבע בא לפני הצורה: a blue circle.',
    },
  },
  'g1-u22-m2': {
    titleHe: 'גדול או קטן? 🐘🐜',
    ideaHe: 'big זה גדול, small זה קטן. tall זה גבוה, long זה ארוך.',
    pattern: 'The … is big / small',
    examples: [
      { en: 'The bus is big.', he: 'האוטובוס גדול.', highlight: 'big', emoji: '🚌' },
      { en: 'The cat is small.', he: 'החתול קטן.', highlight: 'small', emoji: '🐱' },
      { en: 'The tree is very tall.', he: 'העץ גבוה מאוד.', highlight: 'tall', emoji: '🌳' },
    ],
    quickTry: {
      promptHe: 'לרכבת 🚂 יש הרבה קרונות. איזו מילה מתאימה?',
      questionEn: 'The train is ____.',
      correct: 'long',
      wrong: 'round',
      explainHe: 'לרכבת יש הרבה קרונות, ולכן היא long (ארוכה).',
    },
  },
};
