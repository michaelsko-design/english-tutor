import type { LessonPack } from '../../../lessons/types';

/** The core-4 source's grade 11 mini-lessons, by mission id. */
export const CORE_4_GRADE_11_LESSONS: LessonPack = {
  'g11-u24-m1': {
    titleHe: 'מה כבר יקרה עד אז: will have + V3 🚀',
    ideaHe:
      'future perfect מתאר פעולה שתסתיים לפני זמן מסוים בעתיד. בונים אותו עם will have + V3, ומוסיפים זמן עם by: By 2030, I will have finished university.',
    pattern: 'By + time, subject + will have + V3',
    examples: [
      { en: 'By six o\'clock, we will have cooked dinner.', he: 'עד השעה שש, נבשל ארוחת ערב.', highlight: 'will have cooked' },
      { en: 'By next year, she will have saved enough money.', he: 'עד השנה הבאה, היא תחסוך מספיק כסף.', highlight: 'will have saved' },
      { en: 'Will they have built the bridge by 2030?', he: 'האם הם יסיימו לבנות את הגשר עד 2030?', highlight: 'Will they have built' },
    ],
    tipHe: 'אחרי will בא תמיד have (גם עם he ו-she), ואחריו V3: will have gone, will have written.',
    quickTry: {
      promptHe: 'איזה משפט נכון?',
      questionEn: 'By the time you wake up, I ____ to work.',
      correct: 'By the time you wake up, I will have gone to work.',
      wrong: 'By the time you wake up, I will have go to work.',
      explainHe: 'will have + V3: gone.',
    },
  },
  'g11-u24-m2': {
    titleHe: 'העתיד מהעבר: was going to, would ⏪',
    ideaHe:
      'כשמספרים על תוכנית או תחזית מהעבר, משתמשים ב-was / were going to (התכוונו) או would (במקום will): I was going to call you. She said that she would come.',
    pattern: 'was / were going to + verb · would + verb',
    examples: [
      { en: 'We were going to swim, but it rained.', he: 'התכוונו לשחות, אבל ירד גשם.', highlight: 'were going to' },
      { en: 'He promised that he would help us.', he: 'הוא הבטיח שהוא יעזור לנו.', highlight: 'would help' },
      { en: 'I thought the movie would be boring.', he: 'חשבתי שהסרט יהיה משעמם.', highlight: 'would be' },
    ],
    tipHe: 'would בא אחרי פועל בעבר (said, thought, promised). was going to מרמז לרוב שהתוכנית לא קרתה.',
    quickTry: {
      promptHe: 'איזה משפט נכון?',
      questionEn: 'I was sure that you ____ the prize.',
      correct: 'I was sure that you would win the prize.',
      wrong: 'I was sure that you will won the prize.',
      explainHe: 'אחרי was sure (עבר) בא would + פועל בסיס: would win.',
    },
  },
};
