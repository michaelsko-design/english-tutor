import type { LessonPack } from './types';

/**
 * Grade 2 mini-lessons (Feature 42): very short Hebrew, picture examples. The Bosses of units
 * 1, 2 and 4 bring something new (the -at family, plural s, I can) and have their own lessons;
 * unit 3's Boss gets the recap.
 */
export const GRADE_2_LESSONS: LessonPack = {
  'g2-u1-m1': {
    titleHe: 'מילים של 3 צלילים 🔤',
    ideaHe: 'מילים כמו cat, big ו-sun בנויות משלושה צלילים. אומרים כל צליל ומחברים: c-a-t, cat.',
    pattern: 'c + a + t = cat',
    examples: [
      { en: 'hat', he: 'כובע', highlight: 'a', emoji: '🎩' },
      { en: 'pen', he: 'עט', highlight: 'e', emoji: '🖊️' },
      { en: 'sun', he: 'שמש', highlight: 'u', emoji: '☀️' },
    ],
    quickTry: {
      promptHe: 'איזו מילה מתחרזת עם sun?',
      correct: 'fun',
      wrong: 'fan',
      explainHe: 'sun ו-fun נגמרות באותו צליל: un.',
    },
  },
  'g2-u1-m2': {
    titleHe: 'What is this? מה זה? 📦',
    ideaHe: 'שואלים What is this? (מה זה?) ועונים It is a … (זה …).',
    pattern: 'What is this? · It is a …',
    examples: [
      { en: 'What is this?', he: 'מה זה?', highlight: 'What is this', emoji: '❓' },
      { en: 'It is a car.', he: 'זאת מכונית.', highlight: 'It is a', emoji: '🚗' },
      { en: 'It is a kite.', he: 'זה עפיפון.', highlight: 'It is a', emoji: '🪁' },
    ],
    quickTry: {
      promptHe: 'What is this? 🎈 מה התשובה?',
      correct: 'It is a balloon.',
      wrong: 'Is it a balloon.',
      explainHe: 'עונים It is a: זה בלון.',
    },
  },
  'g2-u1-m3': {
    titleHe: 'משפחת at 🦇',
    ideaHe: 'מילים מאותה משפחה נגמרות באותו צליל ומתחרזות: cat, hat, bat. משנים רק את הצליל הראשון.',
    pattern: 'c-at · h-at · b-at',
    examples: [
      { en: 'rat', he: 'עכברוש', highlight: 'at', emoji: '🐀' },
      { en: 'A fat cat.', he: 'חתול שמן.', highlight: 'at', emoji: '🐈' },
      { en: 'Look at the bat.', he: 'תראו את העטלף.', highlight: 'bat', emoji: '🦇' },
    ],
    quickTry: {
      promptHe: 'איזו מילה מתחרזת עם hat?',
      correct: 'sat',
      wrong: 'sit',
      explainHe: 'hat ו-sat נגמרות באותו צליל: at.',
    },
  },
  'g2-u2-m1': {
    titleHe: 'a או an? 🍎',
    ideaHe: 'לפני מילה שמתחילה בתנועה (a, e, i, o, u) אומרים an: an egg. לפני כל השאר אומרים a: a cake.',
    pattern: 'a cake · an egg',
    examples: [
      { en: 'an orange', he: 'תפוז', highlight: 'an', emoji: '🍊' },
      { en: 'a banana', he: 'בננה', highlight: 'a', emoji: '🍌' },
      { en: 'an egg', he: 'ביצה', highlight: 'an', emoji: '🥚' },
    ],
    quickTry: {
      promptHe: 'a או an?',
      questionEn: 'I eat ____ ice cream.',
      correct: 'an',
      wrong: 'a',
      explainHe: 'ice מתחילה בתנועה i, ולכן an.',
    },
  },
  'g2-u2-m2': {
    titleHe: 'This is my... 👨‍👩‍👧',
    ideaHe: 'This is my פירושו "זה ה... שלי". כך מציגים את המשפחה: This is my mom.',
    pattern: 'This is my + mom / dad',
    examples: [
      { en: 'This is my dad.', he: 'זה אבא שלי.', highlight: 'This is my', emoji: '👨' },
      { en: 'This is my grandma.', he: 'זאת סבתא שלי.', highlight: 'This is my', emoji: '👵' },
      { en: 'This is my uncle.', he: 'זה הדוד שלי.', highlight: 'my uncle', emoji: '🧔' },
    ],
    quickTry: {
      promptHe: 'איך מציגים את אמא?',
      correct: 'This is my mom.',
      wrong: 'This my is mom.',
      explainHe: 'הסדר הוא This is my ואחריו mom.',
    },
  },
  'g2-u2-m3': {
    titleHe: 'אחד או הרבה? s 🥕',
    ideaHe: 'כשיש יותר מדבר אחד, מוסיפים s בסוף המילה: one carrot, two carrots.',
    pattern: 'one apple · two apples',
    examples: [
      { en: 'one grape, three grapes', he: 'ענב אחד, שלושה ענבים', highlight: 'grapes', emoji: '🍇' },
      { en: 'two eggs', he: 'שתי ביצים', highlight: 'eggs', emoji: '🥚' },
      { en: 'five cookies', he: 'חמש עוגיות', highlight: 'cookies', emoji: '🍪' },
    ],
    quickTry: {
      promptHe: 'יש ארבעה תפוחים. מה נכון?',
      correct: 'four apples',
      wrong: 'four apple',
      explainHe: 'יש יותר מתפוח אחד, ולכן apples עם s.',
    },
  },
  'g2-u3-m1': {
    titleHe: 'בחווה: It is a... 🐄',
    ideaHe: 'It is a פירושו "זה...". אומרים It is a ואחריו את החיה: It is a cow.',
    pattern: 'It is a + animal',
    examples: [
      { en: 'It is a goat.', he: 'זאת עז.', highlight: 'It is a', emoji: '🐐' },
      { en: 'It is a duck.', he: 'זה ברווז.', highlight: 'It is a', emoji: '🦆' },
      { en: 'It is a big horse.', he: 'זה סוס גדול.', highlight: 'big', emoji: '🐴' },
    ],
    quickTry: {
      promptHe: 'מה נכון?',
      correct: 'It is a sheep.',
      wrong: 'It a is sheep.',
      explainHe: 'הסדר הוא It is a ואחריו החיה.',
    },
  },
  'g2-u3-m2': {
    titleHe: 'Is it a...? שואלים 🐇',
    ideaHe: 'כדי לשאול, מחליפים את הסדר: It is a cat (זה חתול) הופך ל-Is it a cat? (זה חתול?).',
    pattern: 'It is → Is it …?',
    examples: [
      { en: 'Is it a cat?', he: 'זה חתול?', highlight: 'Is it', emoji: '🐱' },
      { en: 'Yes, it is.', he: 'כן.', highlight: 'it is', emoji: '✅' },
      { en: 'No, it is a hamster.', he: 'לא, זה אוגר.', highlight: 'No', emoji: '🐹' },
    ],
    quickTry: {
      promptHe: 'איזו שאלה נכונה?',
      correct: 'Is it a turtle?',
      wrong: 'It is a turtle?',
      explainHe: 'בשאלה Is בא בהתחלה: Is it a turtle?',
    },
  },
  'g2-u4-m1': {
    titleHe: 'הבית שלי 🏠',
    ideaHe: 'בבית יש חדרים ודברים: door (דלת), window (חלון), bed (מיטה). מציגים אותם עם This is my.',
    pattern: 'This is my + room',
    examples: [
      { en: 'This is my room.', he: 'זה החדר שלי.', highlight: 'This is my', emoji: '🛏️' },
      { en: 'This is my kitchen.', he: 'זה המטבח שלי.', highlight: 'kitchen', emoji: '🍳' },
      { en: 'This is my garden.', he: 'זאת הגינה שלי.', highlight: 'garden', emoji: '🌷' },
    ],
    quickTry: {
      promptHe: 'מה פותחים כדי להיכנס הביתה?',
      correct: 'the door',
      wrong: 'the bed',
      explainHe: 'נכנסים הביתה דרך הדלת: the door.',
    },
  },
  'g2-u4-m2': {
    titleHe: 'בגדים: I have 👕',
    ideaHe: 'I have פירושו "יש לי". כשיש יותר מבגד אחד מוסיפים s: two socks.',
    pattern: 'I have + a hat · two shoes',
    examples: [
      { en: 'I have a green hat.', he: 'יש לי כובע ירוק.', highlight: 'I have', emoji: '🧢' },
      { en: 'I have two gloves.', he: 'יש לי שתי כפפות.', highlight: 'gloves', emoji: '🧤' },
      { en: 'I have a yellow dress.', he: 'יש לי שמלה צהובה.', highlight: 'a yellow dress', emoji: '👗' },
    ],
    quickTry: {
      promptHe: 'מה נכון?',
      correct: 'I have three shirts.',
      wrong: 'I have three shirt.',
      explainHe: 'יש יותר מחולצה אחת, ולכן shirts עם s.',
    },
  },
  'g2-u4-m3': {
    titleHe: 'I can בבית 🪑',
    ideaHe: 'I can פירושו "אני יכול/ה". אחריו בא פועל: I can sit, I can jump.',
    pattern: 'I can + verb',
    examples: [
      { en: 'I can open the window.', he: 'אני יכול/ה לפתוח את החלון.', highlight: 'I can', emoji: '🪟' },
      { en: 'I can wear my jacket.', he: 'אני יכול/ה ללבוש את המעיל.', highlight: 'can wear', emoji: '🧥' },
      { en: 'I can close the door.', he: 'אני יכול/ה לסגור את הדלת.', highlight: 'can close', emoji: '🚪' },
    ],
    quickTry: {
      promptHe: 'מה נכון?',
      correct: 'I can clap.',
      wrong: 'I can claps.',
      explainHe: 'אחרי can בא הפועל בלי s: clap.',
    },
  },
};
