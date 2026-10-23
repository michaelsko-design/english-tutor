import type { LessonPack } from '../../../lessons/types';

/** The core-plus pack's grade 12 mini-lessons, by mission id: mixed conditionals, then paraphrasing and summarising. */
export const CORE_PLUS_GRADE_12_LESSONS: LessonPack = {
  'g12-u21-m1': {
    titleHe: 'עבר שלא קרה, הווה אחר ⏪',
    ideaHe:
      'תנאי מעורב מחבר עבר דמיוני לתוצאה בהווה. בחלק של if בא had + V3, ובתוצאה would + V1, כי מדברים על המצב עכשיו.',
    pattern: 'If + had + V3, would + V1 (now)',
    examples: [
      { en: 'If I had slept well, I would not be so tired now.', he: 'אילו הייתי ישן טוב, לא הייתי כל כך עייף עכשיו.', highlight: 'would not be' },
      { en: 'If they had saved money, they would own a house today.', he: 'אילו חסכו כסף, היה להם היום בית משלהם.', highlight: 'had saved' },
      { en: 'If she had taken the job, she would live in Eilat.', he: 'אילו הייתה לוקחת את העבודה, היא הייתה גרה באילת.', highlight: 'would live' },
    ],
    tipHe: 'מילים כמו now ו-today בתוצאה מסמנות שהיא בהווה: would be ולא would have been.',
    quickTry: {
      promptHe: 'התוצאה היא עכשיו. מה מתאים?',
      questionEn: "If we had booked a table, we ____ outside the restaurant now.",
      correct: "wouldn't be waiting",
      wrong: "wouldn't have waited",
      explainHe: 'now מראה שהתוצאה בהווה, ולכן would + V1 ולא would have + V3.',
    },
  },
  'g12-u21-m2': {
    titleHe: 'תכונה קבועה, תוצאה בעבר 🤔',
    ideaHe:
      'כשתכונה שנכונה תמיד השפיעה על אירוע שכבר קרה, בחלק של if בא Past Simple (were, knew), ובתוצאה would have + V3.',
    pattern: 'If + Past Simple, would have + V3',
    examples: [
      { en: "If he weren't so shy, he would have joined the drama club.", he: 'אילו לא היה כל כך ביישן, הוא היה מצטרף לחוג התיאטרון.', highlight: "weren't so shy" },
      { en: 'If I spoke French, I would have understood the guide.', he: 'אילו דיברתי צרפתית, הייתי מבין את המדריך.', highlight: 'would have understood' },
      { en: 'If she were taller, she would have reached the shelf.', he: 'אילו הייתה גבוהה יותר, היא הייתה מגיעה למדף.', highlight: 'If she were taller' },
    ],
    tipHe: 'שימו לב: If I spoke French מדבר על תכונה של היום, ולא על משהו שקרה פעם אחת.',
    quickTry: {
      promptHe: 'התכונה נכונה תמיד. מה מתאים?',
      questionEn: 'If Tom ____ more patient, he would have waited for us.',
      correct: 'were',
      wrong: 'will be',
      explainHe: 'סבלנות היא תכונה קבועה, ולכן בחלק של if בא Past Simple: were.',
    },
  },
  'g12-u22-m1': {
    titleHe: 'אותו רעיון, מילים אחרות 🔁',
    ideaHe:
      'בפרפרזה מחליפים מילים במילים נרדפות, משנים חלק דיבר (decide → decision) או עוברים מפעיל לסביל. המשמעות חייבת להישאר זהה.',
    pattern: 'synonym · word form · active → passive',
    examples: [
      { en: 'The price rose sharply. In other words, it increased steeply.', he: 'המחיר עלה בחדות. במילים אחרות, הוא עלה בתלילות.', highlight: 'increased steeply' },
      { en: 'They decided quickly. In other words, they made a quick decision.', he: 'הם החליטו מהר. במילים אחרות, הם קיבלו החלטה מהירה.', highlight: 'made a quick decision' },
      { en: 'Workers built the bridge. In other words, the bridge was built.', he: 'פועלים בנו את הגשר. במילים אחרות, הגשר נבנה.', highlight: 'was built' },
    ],
    tipHe: 'תשובה שמעתיקה מילים מהקטע היא לא תמיד הנכונה. כדאי לחפש את אותה משמעות במילים אחרות.',
    quickTry: {
      promptHe: 'איזו פרפרזה שומרת על המשמעות של "The town is growing fast"?',
      correct: 'The town is expanding rapidly.',
      wrong: 'The town is shrinking slowly.',
      explainHe: 'expanding rapidly היא מילים נרדפות ל-growing fast, והמשמעות נשמרת.',
    },
  },
  'g12-u22-m2': {
    titleHe: 'רק את העיקר 📋',
    ideaHe:
      'בסיכום משאירים את הרעיון המרכזי ומשמיטים דוגמאות, מספרים, ציטוטים וחזרות. פותחים בביטוי כמו The text mainly discusses.',
    pattern: 'main idea ✔ · examples & numbers ✘',
    examples: [
      { en: 'The text mainly discusses the dangers of plastic.', he: 'הטקסט עוסק בעיקר בסכנות של הפלסטיק.', highlight: 'mainly discusses' },
      { en: 'In short, exercise improves both body and mind.', he: 'בקיצור, ספורט משפר גם את הגוף וגם את הנפש.', highlight: 'In short' },
      { en: 'Overall, the writer supports a shorter school week.', he: 'בסך הכול, הכותב תומך בשבוע לימודים קצר יותר.', highlight: 'Overall' },
    ],
    tipHe: 'משפט שמתחיל ב-For example הוא כמעט תמיד פרט, ולא הרעיון המרכזי.',
    quickTry: {
      promptHe: 'מה מתאים לסיכום?',
      correct: 'Recycling saves energy and resources.',
      wrong: 'Dana recycled 40 bottles last week.',
      explainHe: 'המשפט הראשון הוא רעיון כללי. המשפט על דנה הוא דוגמה עם מספר.',
    },
  },
};
