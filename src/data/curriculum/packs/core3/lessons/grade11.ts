import type { LessonPack } from '../../../lessons/types';

/** The core-3 source's grade 11 mini-lessons, by mission id. */
export const CORE_3_GRADE_11_LESSONS: LessonPack = {
  'g11-u23-m1': {
    titleHe: 'מה נמשך לפני כן? had been + V-ing 🕵️',
    ideaHe:
      'past perfect continuous מתאר פעולה שנמשכה זמן מה עד רגע מסוים בעבר: The guard had been sleeping for an hour when the alarm rang.',
    pattern: 'had been + V-ing (+ for / since) … when + past simple',
    examples: [
      { en: 'We had been walking for hours when we saw the lake.', he: 'הלכנו כבר שעות כשראינו את האגם.', highlight: 'had been walking' },
      { en: 'She had been living in Haifa before she moved here.', he: 'היא גרה בחיפה לפני שעברה לכאן.', highlight: 'had been living' },
      { en: 'How long had he been waiting when the bus came?', he: 'כמה זמן הוא חיכה כשהאוטובוס הגיע?', highlight: 'had he been waiting' },
    ],
    tipHe: 'עם for ו-since אומרים כמה זמן הפעולה נמשכה: had been running for ten minutes.',
    quickTry: {
      promptHe: 'מה מתאים לפעולה שנמשכה עד רגע בעבר?',
      questionEn: 'When the phone rang, Tom ____ for twenty minutes.',
      correct: 'had been sleeping',
      wrong: 'has been sleeping',
      explainHe: 'השינה נמשכה עד הרגע שבו הטלפון צלצל, בעבר: had been sleeping.',
    },
  },
  'g11-u23-m2': {
    titleHe: 'סיבה ותוצאה בעבר 🔬',
    ideaHe:
      'כשרואים תוצאה בעבר, had been + V-ing מסביר מה נמשך לפניה וגרם לה: The floor was wet because it had been raining.',
    pattern: 'תוצאה בעבר + because + had been + V-ing',
    examples: [
      { en: 'His hands were dirty because he had been fixing the car.', he: 'הידיים שלו היו מלוכלכות כי הוא תיקן את המכונית.', highlight: 'had been fixing' },
      { en: 'They were tired because they had been studying.', he: 'הם היו עייפים כי הם למדו.', highlight: 'had been studying' },
      { en: 'The grass was wet. Had it been raining?', he: 'הדשא היה רטוב. האם ירד גשם?', highlight: 'Had it been raining' },
    ],
    tipHe: 'had been + V-ing מדגיש כמה זמן הפעולה נמשכה. כשסופרים כמה פעמים או כמה דברים, משתמשים ב-had + V3.',
    quickTry: {
      promptHe: 'מה מסביר את התוצאה?',
      questionEn: 'The dog was dirty because it ____ in the mud.',
      correct: 'had been playing',
      wrong: 'has been playing',
      explainHe: 'התוצאה (כלב מלוכלך) בעבר, והמשחק בבוץ נמשך לפניה: had been playing.',
    },
  },
};
