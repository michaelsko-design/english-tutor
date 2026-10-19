import type { LessonPack } from './types';

/**
 * Grade 1 mini-lessons (Feature 42): very short Hebrew, picture examples. Every Boss of grade 1
 * brings something new (sounds D–F, goodbye, classroom commands, eat and drink), so each has
 * its own lesson.
 */
export const GRADE_1_LESSONS: LessonPack = {
  'g1-u1-m1': {
    titleHe: 'הצלילים A, B, C 🔤',
    ideaHe: 'לכל אות יש צליל. A כמו apple. B כמו ball. C כמו cat. וכשנפגשים אומרים Hello.',
    pattern: 'A /a/ · B /b/ · C /k/',
    examples: [
      { en: 'apple', he: 'תפוח', highlight: 'a', emoji: '🍎' },
      { en: 'ball', he: 'כדור', highlight: 'b', emoji: '⚽' },
      { en: 'Hello, cat!', he: 'שלום, חתול!', highlight: 'Hello', emoji: '🐱' },
    ],
    quickTry: {
      promptHe: 'איזו מילה מתחילה בצליל /b/?',
      correct: 'bus',
      wrong: 'sun',
      explainHe: 'bus מתחילה בצליל /b/, כמו ball.',
    },
  },
  'g1-u1-m2': {
    titleHe: 'צבעים: red, blue 🎨',
    ideaHe: 'red זה אדום, ו-blue זה כחול. באנגלית הצבע בא לפני הדבר: a red ball.',
    pattern: 'a + color + thing',
    examples: [
      { en: 'a blue car', he: 'מכונית כחולה', highlight: 'blue', emoji: '🚙' },
      { en: 'a red apple', he: 'תפוח אדום', highlight: 'red', emoji: '🍎' },
      { en: 'a blue bird', he: 'ציפור כחולה', highlight: 'blue', emoji: '🐦' },
    ],
    quickTry: {
      promptHe: 'איך אומרים "כובע אדום"?',
      correct: 'a red hat',
      wrong: 'a hat red',
      explainHe: 'הצבע בא לפני הדבר: a red hat.',
    },
  },
  'g1-u1-m3': {
    titleHe: 'הצלילים D, E, F 🦆',
    ideaHe: 'D כמו duck. E כמו egg. F כמו fish. מקשיבים לצליל הראשון של כל מילה.',
    pattern: 'D /d/ · E /e/ · F /f/',
    examples: [
      { en: 'door', he: 'דלת', highlight: 'd', emoji: '🚪' },
      { en: 'elephant', he: 'פיל', highlight: 'e', emoji: '🐘' },
      { en: 'frog', he: 'צפרדע', highlight: 'f', emoji: '🐸' },
    ],
    quickTry: {
      promptHe: 'איזו מילה מתחילה בצליל /f/?',
      correct: 'fox',
      wrong: 'box',
      explainHe: 'fox מתחילה בצליל /f/, כמו fish.',
    },
  },
  'g1-u2-m1': {
    titleHe: 'סופרים עד 5 🖐️',
    ideaHe: 'one, two, three, four, five. כשיש יותר מאחד, מוסיפים s למילה: two cats.',
    pattern: '1 one · 2 two · 3 three · 4 four · 5 five',
    examples: [
      { en: 'two dogs', he: 'שני כלבים', highlight: 'two', emoji: '🐶' },
      { en: 'four apples', he: 'ארבעה תפוחים', highlight: 'four', emoji: '🍎' },
      { en: 'one sun', he: 'שמש אחת', highlight: 'one', emoji: '☀️' },
    ],
    quickTry: {
      promptHe: 'יש כאן שני חתולים 🐱🐱. מה נכון?',
      correct: 'two cats',
      wrong: 'two cat',
      explainHe: 'יש יותר מחתול אחד, ולכן cats עם s.',
    },
  },
  'g1-u2-m2': {
    titleHe: 'סופרים עד 10 🔟',
    ideaHe: 'six, seven, eight, nine, ten. סופרים יחד, לאט.',
    pattern: '6 six · 7 seven · 8 eight · 9 nine · 10 ten',
    examples: [
      { en: 'seven balls', he: 'שבעה כדורים', highlight: 'seven', emoji: '⚽' },
      { en: 'six cars', he: 'שש מכוניות', highlight: 'six', emoji: '🚗' },
      { en: 'ten fingers', he: 'עשר אצבעות', highlight: 'ten', emoji: '🖐️' },
    ],
    quickTry: {
      promptHe: 'איזה מספר בא אחרי six?',
      correct: 'seven',
      wrong: 'five',
      explainHe: 'אחרי six (6) בא seven (7).',
    },
  },
  'g1-u2-m3': {
    titleHe: 'Hello ו-Goodbye 👋',
    ideaHe: 'כשנפגשים אומרים Hello. כשהולכים אומרים Goodbye, או בקיצור Bye.',
    pattern: 'meet → Hello · leave → Goodbye',
    examples: [
      { en: 'Hello, Dad!', he: 'שלום, אבא!', highlight: 'Hello', emoji: '👨' },
      { en: 'Bye, Mom!', he: 'ביי, אמא!', highlight: 'Bye', emoji: '👩' },
      { en: 'See you tomorrow!', he: 'נתראה מחר!', highlight: 'See you', emoji: '🌙' },
    ],
    quickTry: {
      promptHe: 'נכנסים לכיתה בבוקר. מה אומרים?',
      correct: 'Good morning',
      wrong: 'Goodbye',
      explainHe: 'בבוקר, כשנפגשים, אומרים Good morning.',
    },
  },
  'g1-u3-m1': {
    titleHe: 'הגוף שלי 👀',
    ideaHe: 'I have פירושו "יש לי". I have two eyes: יש לי שתי עיניים.',
    pattern: 'I have + two eyes',
    examples: [
      { en: 'I have two hands.', he: 'יש לי שתי ידיים.', highlight: 'I have', emoji: '🙌' },
      { en: 'I have one mouth.', he: 'יש לי פה אחד.', highlight: 'one mouth', emoji: '👄' },
      { en: 'I have ten toes.', he: 'יש לי עשר אצבעות ברגליים.', highlight: 'ten toes', emoji: '🦶' },
    ],
    quickTry: {
      promptHe: 'במה שומעים?',
      correct: 'ears',
      wrong: 'eyes',
      explainHe: 'שומעים באוזניים: ears.',
    },
  },
  'g1-u3-m2': {
    titleHe: 'a: דבר אחד 🎒',
    ideaHe: 'לפני דבר אחד אומרים a: a book, a pen. בעברית אין מילה כזאת, אבל באנגלית חייבים אותה.',
    pattern: 'a + book',
    examples: [
      { en: 'I have a ruler.', he: 'יש לי סרגל.', highlight: 'a ruler', emoji: '📏' },
      { en: 'This is a chair.', he: 'זה כיסא.', highlight: 'a chair', emoji: '🪑' },
      { en: 'I see a clock.', he: 'אני רואה שעון.', highlight: 'a clock', emoji: '🕐' },
    ],
    quickTry: {
      promptHe: 'מה נכון?',
      correct: 'I have a bag.',
      wrong: 'I have bag.',
      explainHe: 'לפני דבר אחד צריך a: a bag.',
    },
  },
  'g1-u3-m3': {
    titleHe: 'הוראות בכיתה 👩‍🏫',
    ideaHe: 'בכיתה שומעים הוראות קצרות באנגלית. מקשיבים לפועל ועושים אותו.',
    pattern: 'Stand up · Sit down · Open · Close',
    examples: [
      { en: 'Close the door.', he: 'סגרו את הדלת.', highlight: 'Close', emoji: '🚪' },
      { en: 'Raise your hand.', he: 'הרימו יד.', highlight: 'Raise', emoji: '✋' },
      { en: 'Look at the board.', he: 'הסתכלו על הלוח.', highlight: 'Look', emoji: '👀' },
    ],
    quickTry: {
      promptHe: 'שומעים Close your book. מה עושים?',
      correct: 'סוגרים את הספר',
      wrong: 'פותחים את הספר',
      explainHe: 'close פירושו לסגור.',
    },
  },
  'g1-u4-m1': {
    titleHe: 'I like: מה אוהבים? 🍓',
    ideaHe: 'I like אומר שאנחנו אוהבים משהו. אחריו בא מה שאוהבים: I like grapes.',
    pattern: 'I like + fruit',
    examples: [
      { en: 'I like grapes.', he: 'אני אוהב/ת ענבים.', highlight: 'I like', emoji: '🍇' },
      { en: 'I like strawberries.', he: 'אני אוהב/ת תותים.', highlight: 'I like', emoji: '🍓' },
      { en: 'I like pears.', he: 'אני אוהב/ת אגסים.', highlight: 'I like', emoji: '🍐' },
    ],
    quickTry: {
      promptHe: 'איזה משפט נכון?',
      correct: 'I like cherries.',
      wrong: 'I cherries like.',
      explainHe: 'קודם I like, ואחר כך הפרי.',
    },
  },
  'g1-u4-m2': {
    titleHe: 'צעצועים: I play with 🪁',
    ideaHe: 'I play with פירושו "אני משחק/ת עם". אחריו בא הצעצוע: I play with a ball.',
    pattern: 'I play with + a toy',
    examples: [
      { en: 'I play with a teddy.', he: 'אני משחק/ת עם דובי.', highlight: 'play with', emoji: '🧸' },
      { en: 'I play with blocks.', he: 'אני משחק/ת בקוביות.', highlight: 'play with', emoji: '🧱' },
      { en: 'We play with a yo-yo.', he: 'אנחנו משחקים ביו-יו.', highlight: 'play with', emoji: '🪀' },
    ],
    quickTry: {
      promptHe: 'איזו מילה היא צעצוע?',
      correct: 'teddy',
      wrong: 'apple',
      explainHe: 'teddy הוא דובי, צעצוע. apple הוא פרי.',
    },
  },
  'g1-u4-m3': {
    titleHe: 'אוכלים ושותים 🍰',
    ideaHe: 'eat פירושו לאכול, ו-drink פירושו לשתות. אוכלים עוגה, ושותים מיץ.',
    pattern: 'eat + food · drink + juice',
    examples: [
      { en: 'I eat bread.', he: 'אני אוכל/ת לחם.', highlight: 'eat', emoji: '🍞' },
      { en: 'I drink milk.', he: 'אני שותה חלב.', highlight: 'drink', emoji: '🥛' },
      { en: 'We eat pizza.', he: 'אנחנו אוכלים פיצה.', highlight: 'eat', emoji: '🍕' },
    ],
    quickTry: {
      promptHe: 'מה עושים עם מיץ?',
      questionEn: 'I ____ juice.',
      correct: 'drink',
      wrong: 'eat',
      explainHe: 'מיץ שותים: drink.',
    },
  },
};
