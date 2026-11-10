import type { LessonPack } from '../../../lessons/types';

/** The core-3 source's grade 10 mini-lessons, by mission id. */
export const CORE_3_GRADE_10_LESSONS: LessonPack = {
  'g10-u23-m1': {
    titleHe: 'תוכניות שכבר סידרנו 📅',
    ideaHe:
      'כשתוכנית כבר מסודרת (יש כרטיס, שעה או פגישה קבועה), משתמשים ב-present continuous עם זמן בעתיד: We are flying to Eilat on Sunday.',
    pattern: 'am / is / are + V-ing + זמן בעתיד',
    examples: [
      { en: 'We are meeting the group at the station at six.', he: 'אנחנו פוגשים את הקבוצה בתחנה בשש.', highlight: 'are meeting' },
      { en: 'My cousin is starting a new job on Monday.', he: 'בן הדוד שלי מתחיל עבודה חדשה ביום שני.', highlight: 'is starting' },
      { en: 'Are you coming to the party tonight?', he: 'אתם באים למסיבה הערב?', highlight: 'Are you coming' },
    ],
    tipHe: 'מילת הזמן (tomorrow, on Sunday, next week) מראה שמדובר בעתיד ולא במה שקורה עכשיו.',
    quickTry: {
      promptHe: 'מה מתאים לתוכנית שכבר סודרה?',
      questionEn: 'Dana ____ her grandmother on Friday. The bus tickets are booked.',
      correct: 'is visiting',
      wrong: 'visited',
      explainHe: 'יש כרטיסים ותאריך בעתיד, ולכן present continuous: is visiting.',
    },
  },
  'g10-u23-m2': {
    titleHe: 'באמצע פעולה בעתיד ⏳',
    ideaHe:
      'future continuous מתאר פעולה שתהיה באמצע שלה ברגע מסוים בעתיד: At nine tomorrow, we will be sitting in class.',
    pattern: 'will be + V-ing',
    examples: [
      { en: 'At eight tonight, we will be watching the game.', he: 'הערב בשמונה, אנחנו נצפה במשחק.', highlight: 'will be watching' },
      { en: 'This time next week, she will be lying on a beach.', he: 'בזמן הזה בשבוע הבא, היא תשכב על החוף.', highlight: 'will be lying' },
      { en: 'Will they be working late on Friday?', he: 'האם הם יעבדו עד מאוחר ביום שישי?', highlight: 'Will they be working' },
    ],
    tipHe: 'בשאלה will עובר לפני הנושא: Will you be using the car tonight?',
    quickTry: {
      promptHe: 'מה מתאים לפעולה שתהיה באמצע?',
      questionEn: "Don't come at ten. We ____ a test then.",
      correct: 'will be taking',
      wrong: 'will taking',
      explainHe: 'בשעה עשר המבחן יהיה באמצע: will be + V-ing (will be taking).',
    },
  },
};
