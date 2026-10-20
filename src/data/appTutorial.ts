import { CompanionPose } from '../themes/themeArt';

/**
 * Feature 45: the app tour. A short slideshow led by the companion that shows a new learner
 * the loop (play a mission, earn stars, XP and diamonds, spend them) and where everything is.
 * It plays once after the welcome chest and again from the ❓ button in the header.
 *
 * The Hebrew is gender-neutral plural ("לוחצים", "בואו"), so it reads the same for every learner.
 */

export type TutorialSlideId = 'welcome' | 'missions' | 'map' | 'economy' | 'streak' | 'dock' | 'finish';

export interface TutorialPoint {
  emoji: string;
  /** A short bold label before the text; left out when the text says it all */
  labelHe?: string;
  textHe: string;
}

export interface TutorialSlide {
  id: TutorialSlideId;
  titleHe: string;
  bodyHe: string;
  pose: CompanionPose;
  points: TutorialPoint[];
}

export interface TutorialInput {
  /** The theme's name for diamonds (`theme.currencyNameHe`) */
  currencyNameHe: string;
  /** The Friends tile is on the dock (the hub is on and the account isn't a guest) */
  hasFriends: boolean;
  /** Friday and Shabbat never break the streak */
  isShabbatObserver: boolean;
}

/** The five mission steps, in the order a mission plays them (4.5). */
export const MISSION_STEP_POINTS: TutorialPoint[] = [
  { emoji: '💬', textHe: 'מילים ושיחה' },
  { emoji: '🧲', textHe: 'בונים משפט' },
  { emoji: '🎙️', textHe: 'אומרים בקול' },
  { emoji: '🕵️', textHe: 'בלשי דקדוק' },
  { emoji: '📖', textHe: 'קוראים סיפור' },
];

export function getTutorialSlides({ currencyNameHe, hasFriends, isShabbatObserver }: TutorialInput): TutorialSlide[] {
  const streakPoints: TutorialPoint[] = [
    { emoji: '🔥', labelHe: 'רצף', textHe: 'כל יום עם משימה מגדיל את הרצף.' },
    { emoji: '🎯', labelHe: 'אתגרים יומיים', textHe: '3 אתגרים חדשים כל יום, עם עוד פרסים.' },
  ];
  if (isShabbatObserver) {
    streakPoints.push({ emoji: '🛡️', labelHe: 'מגן שבת', textHe: 'שישי ושבת לא שוברים את הרצף.' });
  }

  const dockPoints: TutorialPoint[] = [
    { emoji: '🏠', labelHe: 'החדר שלי', textHe: 'מקשטים, מתלבשים ומשחקים במשחקי מילים.' },
    { emoji: '📅', labelHe: 'מבחן', textHe: 'תוכנית אימון קצרה עד יום המבחן.' },
    { emoji: '📝', labelHe: 'רשימות מילים', textHe: 'מדביקים מילים מבית הספר ומתרגלים אותן.' },
  ];
  if (hasFriends) {
    dockPoints.push({ emoji: '👫', labelHe: 'חברים', textHe: 'מוסיפים חברים ומתחרים כל יום.' });
  }
  dockPoints.push({ emoji: '📊', labelHe: 'דוח להורים', textHe: 'כל מה שלמדתם השבוע.' });

  return [
    {
      id: 'welcome',
      titleHe: 'סיור קצר באפליקציה',
      bodyHe: 'בואו נראה איפה הכול נמצא. זה לוקח רק דקה!',
      pose: 'wave',
      points: [],
    },
    {
      id: 'missions',
      titleHe: 'משימות: כאן לומדים',
      bodyHe: 'לוחצים על כפתור המשחק הגדול. בכל משימה 5 שלבים קצרים:',
      pose: 'idle',
      points: MISSION_STEP_POINTS,
    },
    {
      id: 'map',
      titleHe: 'המפה והכוכבים',
      bodyHe: 'כל משימה נותנת עד 3 כוכבים, וכוכב אחד פותח את המשימה הבאה.',
      pose: 'think',
      points: [
        { emoji: '🏰', labelHe: 'טירת הבוס', textHe: 'בסוף כל יחידה. נפתחת עם 2 כוכבים בכל משימה של היחידה.' },
      ],
    },
    {
      id: 'economy',
      titleHe: `XP ו${currencyNameHe}`,
      bodyHe: 'כל משימה נותנת שני סוגי פרסים:',
      pose: 'cheer',
      points: [
        { emoji: '⚡', labelHe: 'XP', textHe: 'ממלא את הטבעת סביב הדמות ומעלה רמה.' },
        { emoji: '💎', labelHe: currencyNameHe, textHe: 'קונים בחנות דמויות, מדבקות, בגדים ומגיני רצף.' },
      ],
    },
    {
      id: 'streak',
      titleHe: 'רצף ואתגרים',
      bodyHe: 'קצת אנגלית כל יום זה הסוד.',
      pose: 'idle',
      points: streakPoints,
    },
    {
      id: 'dock',
      titleHe: 'עוד הרבה כיף',
      bodyHe: 'בשורת הכפתורים שמתחת לאתגרים:',
      pose: 'wave',
      points: dockPoints,
    },
    {
      id: 'finish',
      titleHe: 'מוכנים? יוצאים לדרך!',
      bodyHe: 'אפשר לראות את הסיור שוב בכל רגע בכפתור ❓ למעלה.',
      pose: 'cheer',
      points: [],
    },
  ];
}
