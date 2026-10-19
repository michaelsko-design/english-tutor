import type { LessonPack } from './types';

/**
 * Grade 6 mini-lessons (Feature 42). Unit 4's Boss adds How many / How much / Why, so it has its
 * own lesson; the other Bosses get the recap of their unit.
 */
export const GRADE_6_LESSONS: LessonPack = {
  'g6-u1-m1': {
    titleHe: 'Present Simple: הרגלים 🎨',
    ideaHe:
      'Present Simple מספר מה עושים באופן קבוע. עם he / she / it מוסיפים s, ומילים כמו every week ו-on Tuesdays מראות הרגל.',
    pattern: 'every week · on Tuesdays',
    examples: [
      { en: 'We paint every Tuesday.', he: 'אנחנו מציירים בכל יום שלישי.', highlight: 'paint', emoji: '🖌️' },
      { en: 'My brother practices the piano daily.', he: 'אחי מתאמן בפסנתר כל יום.', highlight: 'practices', emoji: '🎹' },
      { en: 'They meet at the club on Fridays.', he: 'הם נפגשים במועדון בימי שישי.', highlight: 'on Fridays', emoji: '🤝' },
    ],
    tipHe: 'בהרגל קבוע לא אומרים my sister playing. אומרים my sister plays.',
    quickTry: {
      promptHe: 'איזה פועל מתאים?',
      questionEn: 'Our teacher ____ a story every Friday.',
      correct: 'tells',
      wrong: 'tell',
      explainHe: 'Our teacher הוא he או she, ולכן tells.',
    },
  },
  'g6-u1-m2': {
    titleHe: 'Do או Does? 🧩',
    ideaHe:
      'שאלת כן/לא ב-Present Simple מתחילה ב-Do או ב-Does. Does בא עם he / she / it, ו-Do עם השאר. הפועל נשאר בלי s.',
    pattern: 'Do / Does + subject + verb?',
    examples: [
      { en: 'Do your friends like games?', he: 'החברים שלך אוהבים משחקים?', highlight: 'Do your friends like', emoji: '🎲' },
      { en: 'Does Maya swim on Sundays?', he: 'מאיה שוחה בימי ראשון?', highlight: 'Does Maya swim', emoji: '🏊' },
      { en: 'Yes, she does.', he: 'כן, היא שוחה.', highlight: 'does', emoji: '✅' },
    ],
    tipHe: 'תשובה קצרה: Yes, she does או No, he doesn’t.',
    quickTry: {
      promptHe: 'Do או Does?',
      questionEn: '____ the club start at four?',
      correct: 'Does',
      wrong: 'Do',
      explainHe: 'the club הוא it, ולכן Does.',
    },
  },
  'g6-u2-m1': {
    titleHe: 'קורה עכשיו או כל יום? 📹',
    ideaHe:
      'מה שקורה ממש עכשיו: am / is / are ופועל עם ing. מה שקורה כל יום: Present Simple. now ו-right now הם הרמז לעכשיו.',
    pattern: 'now → is + verb-ing · every day → verb',
    examples: [
      { en: 'Look! Dad is singing.', he: 'תראו! אבא שר.', highlight: 'is singing', emoji: '🎤' },
      { en: 'Dad sings in the shower every day.', he: 'אבא שר במקלחת בכל יום.', highlight: 'sings', emoji: '🚿' },
      { en: 'The kids are playing outside now.', he: 'הילדים משחקים בחוץ עכשיו.', highlight: 'are playing', emoji: '⚽' },
    ],
    tipHe: 'בעברית "שר" זה גם עכשיו וגם תמיד. באנגלית יש לכל אחד צורה.',
    quickTry: {
      promptHe: 'מה מתאים למשהו שקורה עכשיו?',
      questionEn: 'Shh! The baby ____ right now.',
      correct: 'is sleeping',
      wrong: 'sleeps',
      explainHe: 'right now אומר שזה קורה עכשיו, ולכן is sleeping.',
    },
  },
  'g6-u2-m2': {
    titleHe: 'am / is / are + ing 💻',
    ideaHe:
      'Present Progressive בנוי משני חלקים: am / is / are ופועל עם ing. בלי אחד מהם המשפט לא נכון.',
    pattern: 'am / is / are + verb-ing',
    examples: [
      { en: 'We are typing a message.', he: 'אנחנו מקלידים הודעה.', highlight: 'are typing', emoji: '⌨️' },
      { en: 'She is watching a video.', he: 'היא צופה בסרטון.', highlight: 'is watching', emoji: '📺' },
      { en: 'The computer is updating.', he: 'המחשב מתעדכן.', highlight: 'is updating', emoji: '🔄' },
    ],
    tipHe: 'פועל שנגמר ב-e מאבד אותה: write → writing.',
    quickTry: {
      promptHe: 'מה חסר?',
      questionEn: 'My friends ____ a game online.',
      correct: 'are playing',
      wrong: 'playing',
      explainHe: 'צריך גם are וגם ing: are playing.',
    },
  },
  'g6-u3-m1': {
    titleHe: 'was או were? 🏖️',
    ideaHe: 'was ו-were הם העבר של am / is / are. was עם I / he / she / it, ו-were עם you / we / they.',
    pattern: 'I / he / she / it was · we / you / they were',
    examples: [
      { en: 'I was at home yesterday.', he: 'הייתי בבית אתמול.', highlight: 'was', emoji: '🏠' },
      { en: 'The children were happy.', he: 'הילדים היו שמחים.', highlight: 'were', emoji: '😄' },
      { en: 'It was very hot last week.', he: 'היה חם מאוד בשבוע שעבר.', highlight: 'was', emoji: '☀️' },
    ],
    tipHe: 'yesterday ו-last week מראים עבר, ולכן was / were ולא am / is / are.',
    quickTry: {
      promptHe: 'was או were?',
      questionEn: 'My cousins ____ at the party.',
      correct: 'were',
      wrong: 'was',
      explainHe: 'My cousins הם they, ולכן were.',
    },
  },
  'g6-u3-m2': {
    titleHe: 'עבר עם ed 🎆',
    ideaHe: 'בפעלים רגילים יוצרים עבר עם ed בסוף: play → played. פועל שנגמר ב-e מקבל רק d: dance → danced.',
    pattern: 'verb + ed',
    examples: [
      { en: 'We cooked pasta last night.', he: 'בישלנו פסטה אתמול בערב.', highlight: 'cooked', emoji: '🍝' },
      { en: 'She danced at the wedding.', he: 'היא רקדה בחתונה.', highlight: 'danced', emoji: '💃' },
      { en: 'They cleaned the room yesterday.', he: 'הם ניקו את החדר אתמול.', highlight: 'cleaned', emoji: '🧹' },
    ],
    tipHe: 'בעבר הפועל זהה לכולם: I played, she played. אין s.',
    quickTry: {
      promptHe: 'מה צורת העבר?',
      questionEn: 'Yesterday I ____ my bike.',
      correct: 'washed',
      wrong: 'wash',
      explainHe: 'yesterday מראה עבר, ולכן washed.',
    },
  },
  'g6-u4-m1': {
    titleHe: 'יותר: er + than 🐘',
    ideaHe:
      'כדי להשוות בין שניים מוסיפים er לתואר, ואחריו than: tall → taller than. במילה קצרה עם עיצור בסוף מכפילים אותו: big → bigger.',
    pattern: 'adjective + er + than',
    examples: [
      { en: 'A giraffe is taller than a zebra.', he: 'ג׳ירפה גבוהה יותר מזברה.', highlight: 'taller than', emoji: '🦒' },
      { en: 'My bag is heavier than yours.', he: 'התיק שלי כבד יותר משלך.', highlight: 'heavier than', emoji: '🎒' },
      { en: 'Summer is hotter than winter.', he: 'הקיץ חם יותר מהחורף.', highlight: 'hotter than', emoji: '☀️' },
    ],
    tipHe: 'y בסוף הופכת ל-i: happy → happier, heavy → heavier.',
    quickTry: {
      promptHe: 'איך משווים?',
      questionEn: 'A cheetah is ____ than a dog.',
      correct: 'quicker',
      wrong: 'more quick',
      explainHe: 'quick היא מילה קצרה, ולכן quicker.',
    },
  },
  'g6-u4-m2': {
    titleHe: 'more + תואר ארוך 📚',
    ideaHe: 'עם תואר ארוך לא מוסיפים er. שמים לפניו more: more beautiful than.',
    pattern: 'more + long adjective + than',
    examples: [
      { en: 'This book is more exciting than the movie.', he: 'הספר הזה מרתק יותר מהסרט.', highlight: 'more exciting than', emoji: '📖' },
      { en: 'A plane is more expensive than a car.', he: 'מטוס יקר יותר ממכונית.', highlight: 'more expensive than', emoji: '✈️' },
      { en: 'Gold is more valuable than silver.', he: 'זהב יקר ערך יותר מכסף.', highlight: 'more valuable', emoji: '🥇' },
    ],
    tipHe: 'לא משתמשים בשניהם יחד: more bigger לא נכון.',
    quickTry: {
      promptHe: 'איך משווים תואר ארוך?',
      questionEn: 'The new game is ____ than the old one.',
      correct: 'more popular',
      wrong: 'popularer',
      explainHe: 'popular היא מילה ארוכה, ולכן more popular.',
    },
  },
  'g6-u4-m3': {
    titleHe: 'How many, How much, Why ❓',
    ideaHe:
      'How many שואל "כמה" על דברים שסופרים (books). How much שואל "כמה" על דברים שלא סופרים (water, money). Why שואל "למה", ועונים עם because.',
    pattern: 'How many + plural · How much + water',
    examples: [
      { en: 'How many pencils do you have?', he: 'כמה עפרונות יש לכם?', highlight: 'How many pencils', emoji: '✏️' },
      { en: 'How much water do you drink?', he: 'כמה מים אתם שותים?', highlight: 'How much water', emoji: '💧' },
      { en: 'Why are you late? Because the bus was late.', he: 'למה איחרתם? כי האוטובוס איחר.', highlight: 'Because', emoji: '🚌' },
    ],
    tipHe: 'אחרי How many בא שם עצם ברבים: How many cats, לא How many cat.',
    quickTry: {
      promptHe: 'many או much?',
      questionEn: 'How ____ milk is in the bottle?',
      correct: 'much',
      wrong: 'many',
      explainHe: 'חלב לא סופרים, ולכן How much.',
    },
  },
};
