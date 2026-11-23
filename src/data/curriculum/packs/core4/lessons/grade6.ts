import type { LessonPack } from '../../../lessons/types';

/** The core-4 source's grade 6 mini-lessons, by mission id. */
export const CORE_4_GRADE_6_LESSONS: LessonPack = {
  'g6-u24-m1': {
    titleHe: 'סיפור על העבר עם when 🚆',
    ideaHe:
      'when (כאשר) מחבר שני רגעים בסיפור שכבר קרה. שני הפעלים בעבר: When the bell rang, we went out. אפשר גם להתחיל במשפט השני: We went out when the bell rang.',
    pattern: 'When + past, past. · past when + past.',
    examples: [
      { en: 'When the movie ended, we went home.', he: 'כשהסרט נגמר, הלכנו הביתה.', highlight: 'When', emoji: '🎬' },
      { en: 'Dad was happy when he saw the sea.', he: 'אבא שמח כשהוא ראה את הים.', highlight: 'when', emoji: '🌊' },
      { en: 'When we landed, it was dark.', he: 'כשנחתנו, היה חושך.', highlight: 'When', emoji: '✈️' },
    ],
    quickTry: {
      promptHe: 'איזה משפט נכון?',
      correct: 'When I opened the door, the dog ran out.',
      wrong: 'When I open the door, the dog ran out.',
      explainHe: 'בסיפור על העבר שני הפעלים בעבר: opened ו-ran.',
    },
  },
  'g6-u24-m2': {
    titleHe: 'למה? because ו-because of 💨',
    ideaHe:
      'because (כי) בא לפני משפט שלם: because it was cold. because of (בגלל) בא לפני שם: because of the cold.',
    pattern: '… because + sentence · … because of + noun',
    examples: [
      { en: 'We were late because the road was closed.', he: 'איחרנו כי הכביש היה סגור.', highlight: 'because', emoji: '🚧' },
      { en: 'We were late because of the traffic.', he: 'איחרנו בגלל הפקקים.', highlight: 'because of', emoji: '🚗' },
      { en: 'He was happy because he won.', he: 'הוא שמח כי הוא ניצח.', highlight: 'because', emoji: '🏆' },
    ],
    quickTry: {
      promptHe: 'איזו מילה מתאימה? We stayed inside ___ the heat.',
      correct: 'We stayed inside because of the heat.',
      wrong: 'We stayed inside because the heat.',
      explainHe: 'אחרי החסר בא שם (the heat), אז משתמשים ב-because of.',
    },
  },
};
