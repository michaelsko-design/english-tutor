import type { LessonPack } from '../../../lessons/types';

/** The core-plus pack's grade 10 mini-lessons, by mission id. The Bosses get their unit's recap. */
export const CORE_PLUS_GRADE_10_LESSONS: LessonPack = {
  'g10-u21-m1': {
    titleHe: 'שאלו אותי אם... שאלות עקיפות ❓',
    ideaHe:
      'בשאלה עקיפה אין היפוך ואין do / did: הנושא בא לפני הפועל, והזמן זז אחורה. לשאלת כן-לא מוסיפים if או whether.',
    pattern: 'asked + if / wh-word + subject + verb',
    examples: [
      { en: 'She asked me where the station was.', he: 'היא שאלה אותי איפה התחנה.', highlight: 'where the station was' },
      { en: 'He asked if we were hungry.', he: 'הוא שאל אם אנחנו רעבים.', highlight: 'if we were hungry' },
      { en: 'They asked us what time the show started.', he: 'הם שאלו אותנו מתי מתחילה ההופעה.', highlight: 'what time the show started' },
    ],
    tipHe: 'לא אומרים asked where was the station. אומרים asked where the station was.',
    quickTry: {
      promptHe: 'איזה סדר מילים נכון?',
      questionEn: 'Mom asked me ____.',
      correct: 'where I had been',
      wrong: 'where had I been',
      explainHe: 'בשאלה עקיפה הנושא (I) בא לפני הפועל, כמו במשפט רגיל.',
    },
  },
  'g10-u21-m2': {
    titleHe: 'אמרו לי ל...: פקודות עקיפות 📋',
    ideaHe: 'פקודה או בקשה מוסרים עם told / asked + מישהו + to + פועל בסיס. בשלילה מוסיפים not לפני to.',
    pattern: 'told / asked + someone + (not) to + V1',
    examples: [
      { en: 'The coach told us to drink more water.', he: 'המאמן אמר לנו לשתות יותר מים.', highlight: 'told us to drink' },
      { en: 'Dad asked me to close the window.', he: 'אבא ביקש ממני לסגור את החלון.', highlight: 'asked me to close' },
      { en: 'The guide told them not to feed the monkeys.', he: 'המדריך אמר להם לא להאכיל את הקופים.', highlight: 'not to feed' },
    ],
    tipHe: 'לא אומרים told me don’t. אומרים told me not to.',
    quickTry: {
      promptHe: 'מה בא אחרי told me?',
      questionEn: 'The nurse told me ____ still.',
      correct: 'to sit',
      wrong: 'sit',
      explainHe: 'אחרי told me בא to ופועל בסיס: to sit.',
    },
  },
  'g10-u22-m1': {
    titleHe: 'עדיין באמצע: have been + ing ⏳',
    ideaHe:
      'Present Perfect Continuous מספר על פעולה שהתחילה בעבר ועדיין נמשכת, או שנגמרה הרגע. שואלים How long have you been...?',
    pattern: 'have / has been + V-ing',
    examples: [
      { en: 'It has been raining since this morning.', he: 'יורד גשם מהבוקר.', highlight: 'has been raining' },
      { en: 'How long have you been waiting?', he: 'כמה זמן אתם כבר מחכים?', highlight: 'have you been waiting' },
      { en: 'They have been playing chess for an hour.', he: 'הם משחקים שחמט כבר שעה.', highlight: 'have been playing' },
    ],
    tipHe: 'בעברית אומרים "אני מחכה כבר שעה". באנגלית: I have been waiting for an hour.',
    quickTry: {
      promptHe: 'מה חסר?',
      questionEn: 'She has ____ studying since lunch.',
      correct: 'been',
      wrong: 'be',
      explainHe: 'אחרי has בא been, ואחריו פועל עם ing.',
    },
  },
  'g10-u22-m2': {
    titleHe: 'פעילות או תוצאה? 🎯',
    ideaHe:
      'have been + V-ing מדגיש את הפעילות ואת משך הזמן. have + V3 מדגיש את התוצאה, במיוחד כשסופרים כמה. פעלי מצב כמו know ו-like בלי ing.',
    pattern: 'been + V-ing (activity) · have + V3 (result)',
    examples: [
      { en: 'I have been reading all afternoon.', he: 'אני קורא כל אחר הצהריים.', highlight: 'have been reading' },
      { en: 'I have read four chapters.', he: 'קראתי ארבעה פרקים.', highlight: 'have read' },
      { en: 'We have known them for years.', he: 'אנחנו מכירים אותם כבר שנים.', highlight: 'have known' },
    ],
    tipHe: 'לא אומרים I have been knowing. know הוא פועל מצב: I have known.',
    quickTry: {
      promptHe: 'פעילות או תוצאה?',
      questionEn: 'Look! I ____ ten cookies for the party.',
      correct: 'have baked',
      wrong: 'have been baking',
      explainHe: 'סופרים תוצאה (ten cookies), ולכן have baked.',
    },
  },
};
