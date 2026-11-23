/**
 * The daily-reminder ask (ReminderAskScreen), spoken to the child. Kept to a title, one line on why it
 * helps and two buttons: short enough for a young reader, and the same words for a girl and a boy.
 * The benefit is said softly ("helps"), never promised, with no gift for saying yes and no guilt for
 * "not now" (docs/legal/child-facing-pro-review.md).
 * Grades 1–2 hear `spokenHe` (Feature 47): scripts/tts/hebrewCorpus.ts renders it.
 */
export const REMINDER_ASK_COPY = {
  titleHe: 'רוצה שאזכיר לך מחר?',
  benefitHe: 'תזכורת קטנה כל יום עוזרת ללמוד טוב יותר ולשמור על הרצף 🔥',
  yesHe: 'כן, תזכירו לי',
  /** Shown on the yes button while the browser's own prompt is open */
  allowHe: 'לוחצים "אפשר"',
  notNowHe: 'לא עכשיו',
  doneHe: 'מעולה! נתראה מחר 👋',
  blockedHe: 'ההתראות חסומות בדפדפן. אפשר לאשר אותן ליד כתובת האתר (סמל המנעול), ואז להפעיל בהגדרות.',
  installTitleHe: 'באייפון צריך קודם להוסיף את האפליקציה למסך הבית:',
  spokenHe: 'רוצה שאזכיר לך מחר? תזכורת קטנה כל יום עוזרת ללמוד טוב יותר ולשמור על הרצף.',
} as const;
