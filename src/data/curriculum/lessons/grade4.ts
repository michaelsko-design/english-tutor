import type { LessonPack } from './types';

/**
 * Grade 4 mini-lessons (Feature 42). Unit 4's Boss practises There is / There are with food,
 * which unit 4's missions don't teach, so it has its own lesson; the other Bosses get the recap.
 */
export const GRADE_4_LESSONS: LessonPack = {
  'g4-u1-m1': {
    titleHe: 'can: מה אפשר לעשות? 🦸',
    ideaHe: 'can אומר שאפשר לעשות משהו. אחרי can בא הפועל כמו שהוא, בלי s ובלי to.',
    pattern: 'can + verb',
    examples: [
      { en: 'Fish can swim.', he: 'דגים יודעים לשחות.', highlight: 'can swim', emoji: '🐟' },
      { en: 'My dog can jump.', he: 'הכלב שלי יודע לקפוץ.', highlight: 'can jump', emoji: '🐶' },
      { en: "Cats can't fly.", he: 'חתולים לא יכולים לעוף.', highlight: "can't fly", emoji: '🐱' },
    ],
    tipHe: 'can’t הוא קיצור של can not: אי אפשר.',
    quickTry: {
      promptHe: 'מה בא אחרי can?',
      questionEn: 'A frog can ____ high.',
      correct: 'jump',
      wrong: 'jumps',
      explainHe: 'אחרי can בא הפועל בלי s: jump.',
    },
  },
  'g4-u1-m2': {
    titleHe: 'Can you...? שאלה ותשובה ❓',
    ideaHe: 'כדי לשאול על יכולת, שמים את can בהתחלה: Can you swim? עונים בקצרה: Yes, I can או No, I can’t.',
    pattern: 'Can + you + verb?',
    examples: [
      { en: 'Can they ride a bike?', he: 'הם יודעים לרכוב על אופניים?', highlight: 'Can they ride', emoji: '🚲' },
      { en: 'Yes, we can.', he: 'כן, אנחנו יכולים.', highlight: 'we can', emoji: '✅' },
      { en: "No, he can't.", he: 'לא, הוא לא יכול.', highlight: "he can't", emoji: '❌' },
    ],
    tipHe: 'לא אומרים Do you can. שואלים פשוט Can you.',
    quickTry: {
      promptHe: 'מה התשובה הנכונה?',
      questionEn: 'Can your sister swim? Yes, she ____.',
      correct: 'can',
      wrong: 'does',
      explainHe: 'על שאלה עם Can עונים עם can: Yes, she can.',
    },
  },
  'g4-u2-m1': {
    titleHe: 'There is או There are? 🏠',
    ideaHe: 'There is אומר "יש" כשיש דבר אחד. There are אומר "יש" כשיש הרבה דברים.',
    pattern: 'There is + one · There are + many',
    examples: [
      { en: 'There is a cat on the sofa.', he: 'יש חתול על הספה.', highlight: 'There is', emoji: '🐱' },
      { en: 'There are three beds in my room.', he: 'יש שלוש מיטות בחדר שלי.', highlight: 'There are', emoji: '🛏️' },
      { en: 'There is a big window.', he: 'יש חלון גדול.', highlight: 'There is', emoji: '🪟' },
    ],
    tipHe: 'דבר אחד (a, one)? There is. שניים או יותר? There are.',
    quickTry: {
      promptHe: 'There is או There are?',
      questionEn: '____ four books on the table.',
      correct: 'There are',
      wrong: 'There is',
      explainHe: 'four books הם הרבה ספרים, ולכן There are.',
    },
  },
  'g4-u2-m2': {
    titleHe: 'איפה זה? in, on, next to 📦',
    ideaHe: 'מילות מקום אומרות איפה משהו נמצא: in בתוך, on על, under מתחת, ו-next to ליד.',
    pattern: 'in · on · under · next to',
    examples: [
      { en: 'The ball is in the box.', he: 'הכדור בתוך הקופסה.', highlight: 'in', emoji: '⚽' },
      { en: 'The cup is on the table.', he: 'הכוס על השולחן.', highlight: 'on', emoji: '☕' },
      { en: 'The dog is next to the door.', he: 'הכלב ליד הדלת.', highlight: 'next to', emoji: '🐕' },
    ],
    tipHe: 'on זה על משהו, ו-in זה בפנים: כוס על שולחן, אבל מים בתוך כוס.',
    quickTry: {
      promptHe: 'החתול יושב על הספה. מה מתאים?',
      questionEn: 'The cat is ____ the sofa.',
      correct: 'on',
      wrong: 'in',
      explainHe: 'החתול יושב על הספה, ולכן on.',
    },
  },
  'g4-u3-m1': {
    titleHe: 'We play! ספורט 🏀',
    ideaHe: 'כשמספרים מה עושים בדרך כלל, משתמשים בפועל כמו שהוא: I play, we play, they play. עם I / we / you / they לא מוסיפים s.',
    pattern: 'I / we / they + play',
    examples: [
      { en: 'They play tennis on Sunday.', he: 'הם משחקים טניס ביום ראשון.', highlight: 'play', emoji: '🎾' },
      { en: 'We swim in the summer.', he: 'אנחנו שוחים בקיץ.', highlight: 'swim', emoji: '🏊' },
      { en: 'You run very fast.', he: 'אתם רצים מהר מאוד.', highlight: 'run', emoji: '🏃' },
    ],
    tipHe: 'עם משחקי כדור אומרים play: play football, play tennis.',
    quickTry: {
      promptHe: 'עם s או בלי?',
      questionEn: 'My friends ____ soccer every day.',
      correct: 'play',
      wrong: 'plays',
      explainHe: 'My friends הם they, ולכן play בלי s.',
    },
  },
  'g4-u3-m2': {
    titleHe: 'תחביבים: can ו-can’t 🎨',
    ideaHe: 'can אומר מה יודעים לעשות, ו-can’t מה לא. אפשר לחבר בין השניים עם but (אבל).',
    pattern: 'can …, but can’t …',
    examples: [
      { en: "Lily can paint, but she can't sing.", he: 'לילי יודעת לצייר, אבל לא לשיר.', highlight: "can't sing", emoji: '🎨' },
      { en: 'Can you play the piano?', he: 'אתם יודעים לנגן בפסנתר?', highlight: 'Can you play', emoji: '🎹' },
      { en: 'Tom can read fast.', he: 'תום יודע לקרוא מהר.', highlight: 'can read', emoji: '📚' },
    ],
    tipHe: 'על Can you? עונים עם can: No, I can’t. לא אומרים No, I don’t.',
    quickTry: {
      promptHe: 'מה התשובה הנכונה?',
      questionEn: 'Can Dan dance? No, he ____.',
      correct: "can't",
      wrong: "isn't",
      explainHe: 'על שאלה עם Can עונים עם can’t.',
    },
  },
  'g4-u4-m1': {
    titleHe: 'I like, I don’t like 🍌',
    ideaHe: 'like אומר שאוהבים משהו. don’t like אומר שלא אוהבים. המילה don’t באה לפני like.',
    pattern: 'like … · don’t like …',
    examples: [
      { en: 'We like grapes.', he: 'אנחנו אוהבים ענבים.', highlight: 'like', emoji: '🍇' },
      { en: "They don't like onions.", he: 'הם לא אוהבים בצל.', highlight: "don't like", emoji: '🧅' },
      { en: 'Do you like milk?', he: 'אתם אוהבים חלב?', highlight: 'Do you like', emoji: '🥛' },
    ],
    tipHe: 'לא אומרים I no like. אומרים I don’t like.',
    quickTry: {
      promptHe: 'איך אומרים "לא אוהבים"?',
      questionEn: 'I ____ like spicy food.',
      correct: "don't",
      wrong: 'no',
      explainHe: 'השלילה היא don’t: I don’t like.',
    },
  },
  'g4-u4-m2': {
    titleHe: 'What? שואלים מה 🍽️',
    ideaHe: 'What פירושו "מה". בשאלה על מה עושים, הסדר הוא: What, אחריו do, אחריו you ואז הפועל.',
    pattern: 'What + do + you + verb?',
    examples: [
      { en: 'What do you like for lunch?', he: 'מה אתם אוהבים לארוחת צהריים?', highlight: 'What do you like', emoji: '🍕' },
      { en: 'What do they drink?', he: 'מה הם שותים?', highlight: 'What do they drink', emoji: '🧃' },
      { en: 'What is in the bag?', he: 'מה יש בתיק?', highlight: 'What is', emoji: '👜' },
    ],
    tipHe: 'do בא אחרי What ולפני you: What do you want?',
    quickTry: {
      promptHe: 'איזו שאלה נכונה?',
      correct: 'What do you cook?',
      wrong: 'What you do cook?',
      explainHe: 'הסדר הוא What, אחריו do, אחריו you ואז הפועל.',
    },
  },
  'g4-u4-m3': {
    titleHe: 'מה יש בסל? 🧺',
    ideaHe: 'There is לדבר אחד ו-There are להרבה דברים. מילות מקום כמו in ו-on אומרות איפה הם.',
    pattern: 'There is / There are + in / on',
    examples: [
      { en: 'There is a banana on the plate.', he: 'יש בננה על הצלחת.', highlight: 'There is', emoji: '🍌' },
      { en: 'There are two eggs in the fridge.', he: 'יש שתי ביצים במקרר.', highlight: 'There are', emoji: '🥚' },
      { en: 'There are grapes in the bowl.', he: 'יש ענבים בקערה.', highlight: 'in the bowl', emoji: '🍇' },
    ],
    tipHe: 'eggs ו-grapes הם ברבים, ולכן There are.',
    quickTry: {
      promptHe: 'There is או There are?',
      questionEn: '____ a lemon in the bag.',
      correct: 'There is',
      wrong: 'There are',
      explainHe: 'a lemon הוא לימון אחד, ולכן There is.',
    },
  },
};
