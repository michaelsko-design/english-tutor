import type { LessonPack } from './types';

/**
 * Grade 5 mini-lessons (Feature 42). The Bosses of units 2–4 add grammar their units' missions
 * don't teach (Where and directions, do / does questions, Wh- questions), so they have their
 * own lessons; unit 1's Boss gets the recap.
 */
export const GRADE_5_LESSONS: LessonPack = {
  'g5-u1-m1': {
    titleHe: 'am, is, are 🐱',
    ideaHe: 'הפועל be מחבר בין מישהו לבין התיאור שלו: I am, he / she / it is, we / you / they are.',
    pattern: 'I am · he / she / it is · we / they are',
    examples: [
      { en: 'We are happy today.', he: 'אנחנו שמחים היום.', highlight: 'are', emoji: '😊' },
      { en: 'The dog is hungry.', he: 'הכלב רעב.', highlight: 'is', emoji: '🐶' },
      { en: 'The birds are small.', he: 'הציפורים קטנות.', highlight: 'are', emoji: '🐦' },
    ],
    tipHe: 'בעברית אומרים "הכלב רעב" בלי פועל. באנגלית חייבים is: The dog is hungry.',
    quickTry: {
      promptHe: 'is או are?',
      questionEn: 'My parrots ____ very loud.',
      correct: 'are',
      wrong: 'is',
      explainHe: 'My parrots הם רבים (they), ולכן are.',
    },
  },
  'g5-u1-m2': {
    titleHe: 'have או has? 🐰',
    ideaHe: 'have / has אומר "יש ל...". has בא עם he / she / it, ו-have עם I / you / we / they.',
    pattern: 'he / she / it has · I / we / they have',
    examples: [
      { en: 'The cat has a long tail.', he: 'לחתול יש זנב ארוך.', highlight: 'has', emoji: '🐈' },
      { en: 'We have two fish.', he: 'יש לנו שני דגים.', highlight: 'have', emoji: '🐠' },
      { en: 'My dog has big ears.', he: 'לכלב שלי יש אוזניים גדולות.', highlight: 'has', emoji: '🐕' },
    ],
    tipHe: 'אין מילה כזאת haves. עם he / she / it אומרים has.',
    quickTry: {
      promptHe: 'have או has?',
      questionEn: 'The turtle ____ a hard shell.',
      correct: 'has',
      wrong: 'have',
      explainHe: 'The turtle הוא it, ולכן has.',
    },
  },
  'g5-u2-m1': {
    titleHe: 'בעיר: איפה זה נמצא? 🏙️',
    ideaHe: 'כדי לתאר מקום בעיר משתמשים במילות מקום: next to (ליד), between (בין), opposite (מול), in (בתוך).',
    pattern: 'next to · between · opposite',
    examples: [
      { en: 'The bank is next to the school.', he: 'הבנק ליד בית הספר.', highlight: 'next to', emoji: '🏦' },
      { en: 'The shop is between the bank and the park.', he: 'החנות בין הבנק לפארק.', highlight: 'between', emoji: '🏪' },
      { en: 'The bus stop is opposite the zoo.', he: 'תחנת האוטובוס מול גן החיות.', highlight: 'opposite', emoji: '🚏' },
    ],
    tipHe: 'next to הוא תמיד שתי מילים: next to the bank, לא next the bank.',
    quickTry: {
      promptHe: 'הפארק ליד הבית. מה מתאים?',
      questionEn: 'The park is ____ my house.',
      correct: 'next to',
      wrong: 'next',
      explainHe: '"ליד" באנגלית הוא next to, שתי מילים.',
    },
  },
  'g5-u2-m2': {
    titleHe: 'מה השעה? ⏰',
    ideaHe: 'שעה עגולה: o’clock. חצי שעה אחרי: half past. אומרים It is ואחר כך את השעה.',
    pattern: "It is 3 o'clock · It is half past 3",
    examples: [
      { en: "It is seven o'clock.", he: 'השעה שבע.', highlight: "seven o'clock", emoji: '🕖' },
      { en: 'It is half past two.', he: 'השעה שתיים וחצי.', highlight: 'half past two', emoji: '🕝' },
      { en: "School starts at eight o'clock.", he: 'הלימודים מתחילים בשמונה.', highlight: "at eight o'clock", emoji: '🏫' },
    ],
    tipHe: 'half past six פירושו שש וחצי, ולא חמש וחצי.',
    quickTry: {
      promptHe: 'השעון מראה 9:30. מה השעה?',
      correct: 'It is half past nine.',
      wrong: "It is nine o'clock.",
      explainHe: '9:30 הוא חצי שעה אחרי תשע: half past nine.',
    },
  },
  'g5-u2-m3': {
    titleHe: 'איך מגיעים? 🧭',
    ideaHe: 'שואלים על מקום עם Where is …? ועונים עם כיוונים: go straight (ישר), turn left (שמאלה), turn right (ימינה).',
    pattern: 'Where is …? · go straight · turn left / right',
    examples: [
      { en: 'Where is the post office?', he: 'איפה הדואר?', highlight: 'Where is', emoji: '📮' },
      { en: 'Go straight and turn right.', he: 'סעו ישר ופנו ימינה.', highlight: 'turn right', emoji: '➡️' },
      { en: 'The zoo is on the left.', he: 'גן החיות בצד שמאל.', highlight: 'on the left', emoji: '⬅️' },
    ],
    tipHe: 'בשאלה is בא מיד אחרי Where: Where is the bank, לא Where the bank is.',
    quickTry: {
      promptHe: 'שואלים על מקום. איזו מילה מתאימה?',
      questionEn: '____ is the toilet, please?',
      correct: 'Where',
      wrong: 'What',
      explainHe: 'שואלים על מקום, ולכן Where.',
    },
  },
  'g5-u3-m1': {
    titleHe: 'הוא, היא: מוסיפים s 🌞',
    ideaHe: 'כשמספרים מה מישהו עושה כל יום, עם he / she / it מוסיפים s לפועל: she eats, he drinks.',
    pattern: 'he / she / it + verb + s',
    examples: [
      { en: 'Dad drinks coffee every morning.', he: 'אבא שותה קפה בכל בוקר.', highlight: 'drinks', emoji: '☕' },
      { en: 'My sister sleeps after lunch.', he: 'אחותי ישנה אחרי ארוחת הצהריים.', highlight: 'sleeps', emoji: '😴' },
      { en: 'We eat cereal.', he: 'אנחנו אוכלים דגני בוקר.', highlight: 'eat', emoji: '🥣' },
    ],
    tipHe: 'עם I / you / we / they לא מוסיפים s: we eat, אבל she eats.',
    quickTry: {
      promptHe: 'איזה פועל מתאים?',
      questionEn: 'Tom ____ his teeth every night.',
      correct: 'brushes',
      wrong: 'brush',
      explainHe: 'Tom הוא he, ולכן brushes (עם es, כי brush נגמר ב-sh).',
    },
  },
  'g5-u3-m2': {
    titleHe: 'go → goes, do → does 🎒',
    ideaHe: 'יש פעלים שמשתנים קצת עם he / she / it. למשל go הופך ל-goes, ו-do הופך ל-does.',
    pattern: 'goes · does · has',
    examples: [
      { en: 'She goes to the park.', he: 'היא הולכת לפארק.', highlight: 'goes', emoji: '🌳' },
      { en: 'Dan does the dishes.', he: 'דן שוטף את הכלים.', highlight: 'does', emoji: '🍽️' },
      { en: 'Maya has a red bag.', he: 'למאיה יש תיק אדום.', highlight: 'has', emoji: '🎒' },
    ],
    tipHe: 'לא כותבים gos. כותבים goes, עם e.',
    quickTry: {
      promptHe: 'go או goes?',
      questionEn: 'My mom ____ to work by bus.',
      correct: 'goes',
      wrong: 'go',
      explainHe: 'My mom היא she, ולכן goes.',
    },
  },
  'g5-u3-m3': {
    titleHe: 'do או does בשאלה? 🕘',
    ideaHe: 'שאלה ב-Present Simple צריכה do או does. does בא עם he / she / it, ו-do עם השאר. אחרי does הפועל בלי s.',
    pattern: 'do / does + subject + verb?',
    examples: [
      { en: 'What time do you wake up?', he: 'באיזו שעה אתם מתעוררים?', highlight: 'do you wake up', emoji: '⏰' },
      { en: 'Does she like pizza?', he: 'היא אוהבת פיצה?', highlight: 'Does she like', emoji: '🍕' },
      { en: 'Where does he live?', he: 'איפה הוא גר?', highlight: 'does he live', emoji: '🏡' },
    ],
    tipHe: 'Does he play, לא Does he plays. ה-s כבר נמצאת ב-does.',
    quickTry: {
      promptHe: 'Do או Does?',
      questionEn: '____ your brother eat lunch at school?',
      correct: 'Does',
      wrong: 'Do',
      explainHe: 'your brother הוא he, ולכן Does.',
    },
  },
  'g5-u4-m1': {
    titleHe: 'תחביבים בהווה פשוט 🎸',
    ideaHe: 'כשמספרים על תחביבים משתמשים ב-Present Simple: I draw, she draws. עם כלי נגינה אומרים play the: play the piano.',
    pattern: 'play the + instrument',
    examples: [
      { en: 'We play the drums on Sunday.', he: 'אנחנו מתופפים ביום ראשון.', highlight: 'play the drums', emoji: '🥁' },
      { en: 'Noa dances every Monday.', he: 'נועה רוקדת בכל יום שני.', highlight: 'dances', emoji: '💃' },
      { en: 'He plays chess with his grandpa.', he: 'הוא משחק שחמט עם סבא שלו.', highlight: 'plays chess', emoji: '♟️' },
    ],
    tipHe: 'עם ספורט אין the (play football), אבל עם כלי נגינה יש (play the violin).',
    quickTry: {
      promptHe: 'עם s או בלי?',
      questionEn: 'Dana ____ the violin.',
      correct: 'plays',
      wrong: 'play',
      explainHe: 'Dana היא she, ולכן plays.',
    },
  },
  'g5-u4-m2': {
    titleHe: 'always, usually, never 🔁',
    ideaHe: 'מילות תדירות אומרות כמה פעמים עושים משהו: always (תמיד), usually (בדרך כלל), sometimes (לפעמים), never (אף פעם). הן באות לפני הפועל.',
    pattern: 'always / usually / never + verb',
    examples: [
      { en: 'We always brush our teeth.', he: 'אנחנו תמיד מצחצחים שיניים.', highlight: 'always brush', emoji: '🪥' },
      { en: 'Dad usually cooks on Friday.', he: 'אבא בדרך כלל מבשל ביום שישי.', highlight: 'usually cooks', emoji: '🍲' },
      { en: 'My cat never drinks milk.', he: 'החתול שלי אף פעם לא שותה חלב.', highlight: 'never drinks', emoji: '🐱' },
    ],
    tipHe: 'המילה באה לפני הפועל: she always walks, לא she walks always.',
    quickTry: {
      promptHe: 'מה מתאים?',
      questionEn: 'Tom is never late. He ____ comes on time.',
      correct: 'always',
      wrong: 'never',
      explainHe: 'Tom אף פעם לא מאחר, אז הוא תמיד בזמן: always.',
    },
  },
  'g5-u4-m3': {
    titleHe: 'מילות שאלה: Wh 🎬',
    ideaHe: 'Who (מי), What (מה), Where (איפה), When (מתי), Why (למה). בשאלה: מילת שאלה, do / does, הנושא ואז הפועל.',
    pattern: 'Wh- + do / does + subject + verb?',
    examples: [
      { en: 'When do you go to the cinema?', he: 'מתי אתם הולכים לקולנוע?', highlight: 'When do you go', emoji: '🎟️' },
      { en: 'Who is your best friend?', he: 'מי החבר הכי טוב שלך?', highlight: 'Who', emoji: '👫' },
      { en: 'Why does she like popcorn?', he: 'למה היא אוהבת פופקורן?', highlight: 'Why does she like', emoji: '🍿' },
    ],
    tipHe: 'Where do you live, לא Where you live.',
    quickTry: {
      promptHe: 'שואלים על זמן. איזו מילה מתאימה?',
      questionEn: '____ does the movie start? At six.',
      correct: 'When',
      wrong: 'Where',
      explainHe: 'At six הוא זמן, ולכן When.',
    },
  },
};
