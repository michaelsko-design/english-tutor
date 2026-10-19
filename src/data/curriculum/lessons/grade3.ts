import type { LessonPack } from './types';

/**
 * Grade 3 mini-lessons (Feature 42): short Hebrew, picture examples. The Bosses of units 2 and 4
 * bring something new (am / is / are, Is it...?) and have their own lessons; units 1 and 3 get
 * the recap.
 */
export const GRADE_3_LESSONS: LessonPack = {
  'g3-u1-m1': {
    titleHe: 'אחד, שניים: מוסיפים s ✏️',
    ideaHe: 'כשיש יותר מדבר אחד, מוסיפים s בסוף: a pen, two pens. המספר בא לפני הדבר.',
    pattern: 'a book · three books',
    examples: [
      { en: 'I have three books.', he: 'יש לי שלושה ספרים.', highlight: 'books', emoji: '📚' },
      { en: 'I have one bag.', he: 'יש לי תיק אחד.', highlight: 'one bag', emoji: '🎒' },
      { en: 'There are five markers.', he: 'יש חמישה טושים.', highlight: 'markers', emoji: '🖍️' },
    ],
    quickTry: {
      promptHe: 'מה נכון?',
      correct: 'I have two rulers.',
      wrong: 'I have two ruler.',
      explainHe: 'יש יותר מסרגל אחד, ולכן rulers עם s.',
    },
  },
  'g3-u1-m2': {
    titleHe: 'הצבע בא לפני הדבר 🖍️',
    ideaHe: 'באנגלית הצבע בא לפני הדבר: a red bag (תיק אדום). בעברית זה הפוך.',
    pattern: 'a + color + thing',
    examples: [
      { en: 'a yellow pencil', he: 'עיפרון צהוב', highlight: 'yellow', emoji: '✏️' },
      { en: 'a pink bag', he: 'תיק ורוד', highlight: 'pink', emoji: '🎒' },
      { en: 'I have a brown dog.', he: 'יש לי כלב חום.', highlight: 'brown dog', emoji: '🐶' },
    ],
    quickTry: {
      promptHe: 'איך אומרים "ספר כחול"?',
      correct: 'a blue book',
      wrong: 'a book blue',
      explainHe: 'הצבע בא לפני הדבר: a blue book.',
    },
  },
  'g3-u2-m1': {
    titleHe: 'I am: איך מרגישים? 😊',
    ideaHe: 'I am פירושו "אני". I am happy: אני שמח/ה. I am tired: אני עייף/ה.',
    pattern: 'I am + happy / tired / excited',
    examples: [
      { en: 'I am happy on Sunday.', he: 'אני שמח/ה ביום ראשון.', highlight: 'I am', emoji: '😊' },
      { en: 'I am hungry.', he: 'אני רעב/ה.', highlight: 'hungry', emoji: '🍽️' },
      { en: 'I am sleepy at night.', he: 'אני עייף/ה בלילה.', highlight: 'sleepy', emoji: '😴' },
    ],
    tipHe: 'ימי השבוע נכתבים תמיד באות גדולה: Sunday, Monday.',
    quickTry: {
      promptHe: 'מה נכון?',
      correct: 'I am sad.',
      wrong: 'I is sad.',
      explainHe: 'עם I אומרים am: I am.',
    },
  },
  'g3-u2-m2': {
    titleHe: 'מזג האוויר: It is… ☀️',
    ideaHe: 'על מזג האוויר אומרים It is: It is sunny (שמשי), It is rainy (גשום), It is windy (סוער).',
    pattern: 'It is + sunny / rainy / windy',
    examples: [
      { en: 'It is sunny today.', he: 'היום שמשי.', highlight: 'sunny', emoji: '☀️' },
      { en: 'It is cold in winter.', he: 'בחורף קר.', highlight: 'It is cold', emoji: '❄️' },
      { en: 'It is snowy.', he: 'יורד שלג.', highlight: 'snowy', emoji: '🌨️' },
    ],
    quickTry: {
      promptHe: 'יש עננים בשמיים. מה נכון?',
      correct: 'It is cloudy.',
      wrong: 'It are cloudy.',
      explainHe: 'עם it אומרים is: It is cloudy.',
    },
  },
  'g3-u2-m3': {
    titleHe: 'am, is, are 🙂',
    ideaHe: 'I am, he / she / it is, we / you / they are. בוחרים לפי מי שמדברים עליו.',
    pattern: 'I am · she is · we are',
    examples: [
      { en: 'She is tired.', he: 'היא עייפה.', highlight: 'is', emoji: '😴' },
      { en: 'They are excited.', he: 'הם נרגשים.', highlight: 'are', emoji: '🤩' },
      { en: 'I am sad today.', he: 'אני עצוב/ה היום.', highlight: 'am', emoji: '😢' },
    ],
    quickTry: {
      promptHe: 'is או are?',
      questionEn: 'My friends ____ happy.',
      correct: 'are',
      wrong: 'is',
      explainHe: 'My friends הם they, ולכן are.',
    },
  },
  'g3-u3-m1': {
    titleHe: 'a או an בגן החיות 🦁',
    ideaHe: 'לפני מילה שמתחילה בתנועה (a, e, i, o, u) אומרים an: an elephant. לפני השאר אומרים a: a lion.',
    pattern: 'a lion · an elephant',
    examples: [
      { en: 'I see an owl.', he: 'אני רואה ינשוף.', highlight: 'an owl', emoji: '🦉' },
      { en: 'I see a zebra.', he: 'אני רואה זברה.', highlight: 'a zebra', emoji: '🦓' },
      { en: 'It is an ant.', he: 'זאת נמלה.', highlight: 'an ant', emoji: '🐜' },
    ],
    quickTry: {
      promptHe: 'a או an?',
      questionEn: 'I see ____ octopus.',
      correct: 'an',
      wrong: 'a',
      explainHe: 'octopus מתחילה בתנועה o, ולכן an.',
    },
  },
  'g3-u3-m2': {
    titleHe: 'can: מה אפשר לעשות? 🏃',
    ideaHe: 'can אומר שאפשר לעשות משהו. אחרי can בא פועל בלי s: A fish can swim.',
    pattern: 'can + swim / jump / run',
    examples: [
      { en: 'A frog can jump.', he: 'צפרדע יודעת לקפוץ.', highlight: 'can jump', emoji: '🐸' },
      { en: 'A horse can run fast.', he: 'סוס יודע לרוץ מהר.', highlight: 'can run', emoji: '🐎' },
      { en: 'A duck can swim.', he: 'ברווז יודע לשחות.', highlight: 'can swim', emoji: '🦆' },
    ],
    quickTry: {
      promptHe: 'מה בא אחרי can?',
      questionEn: 'A kangaroo can ____.',
      correct: 'hop',
      wrong: 'hops',
      explainHe: 'אחרי can בא הפועל בלי s: hop.',
    },
  },
  'g3-u4-m1': {
    titleHe: 'I like: אוכל במסיבה 🍕',
    ideaHe: 'I like אומר שאוהבים משהו. אחרי I לא מוסיפים s: I like, לא I likes.',
    pattern: 'I like + food',
    examples: [
      { en: 'I like chocolate.', he: 'אני אוהב/ת שוקולד.', highlight: 'I like', emoji: '🍫' },
      { en: 'I like popcorn.', he: 'אני אוהב/ת פופקורן.', highlight: 'I like', emoji: '🍿' },
      { en: 'We like candy.', he: 'אנחנו אוהבים ממתקים.', highlight: 'We like', emoji: '🍬' },
    ],
    quickTry: {
      promptHe: 'מה נכון?',
      correct: 'I like cookies.',
      wrong: 'I likes cookies.',
      explainHe: 'עם I לא מוסיפים s: I like.',
    },
  },
  'g3-u4-m2': {
    titleHe: 'What is this? במסיבה 🎁',
    ideaHe: 'What is this? פירושו "מה זה?". עונים It is a: It is a cake.',
    pattern: 'What is this? · It is a …',
    examples: [
      { en: 'What is this? It is a hat.', he: 'מה זה? זה כובע.', highlight: 'It is a hat', emoji: '🥳' },
      { en: 'It is a drum.', he: 'זה תוף.', highlight: 'It is a drum', emoji: '🥁' },
      { en: 'It is a cupcake.', he: 'זה קאפקייק.', highlight: 'cupcake', emoji: '🧁' },
    ],
    quickTry: {
      promptHe: 'What is this? 🍭 מה התשובה?',
      correct: 'It is a lollipop.',
      wrong: 'Yes, I do.',
      explainHe: 'על What is this? עונים It is a.',
    },
  },
  'g3-u4-m3': {
    titleHe: 'Is it...? ניחושים 🎂',
    ideaHe: 'Is it a …? היא שאלת כן או לא. עונים Yes, it is או No, it isn’t.',
    pattern: 'Is it a …? · Yes, it is · No, it isn’t',
    examples: [
      { en: 'Is it a ball?', he: 'זה כדור?', highlight: 'Is it', emoji: '⚽' },
      { en: 'Yes, it is.', he: 'כן, זה כדור.', highlight: 'Yes, it is', emoji: '✅' },
      { en: "No, it isn't.", he: 'לא, זה לא.', highlight: "isn't", emoji: '❌' },
    ],
    quickTry: {
      promptHe: 'איזו שאלה נכונה?',
      correct: 'Is it a candle?',
      wrong: 'It a candle is?',
      explainHe: 'בשאלה Is בא ראשון: Is it a candle?',
    },
  },
};
