import type { LessonPack } from '../../../lessons/types';

/** The core-plus pack's grade 3 mini-lessons (Feature 42): jobs with He / She is a…, then my day with I + verb. */
export const CORE_PLUS_GRADE_3_LESSONS: LessonPack = {
  'g3-u21-m1': {
    titleHe: 'מה הוא עושה? He is a… 👩‍🏫',
    ideaHe: 'כדי לספר מה מישהו עובד אומרים He is a (הוא) או She is a (היא), ואחר כך המקצוע.',
    pattern: 'He / She + is + a + job',
    examples: [
      { en: 'He is a police officer.', he: 'הוא שוטר.', highlight: 'He is a', emoji: '👨' },
      { en: 'She is a dentist.', he: 'היא רופאת שיניים.', highlight: 'She is a', emoji: '👩' },
      { en: 'My uncle is a farmer.', he: 'הדוד שלי חקלאי.', highlight: 'is a farmer', emoji: '🌾' },
    ],
    tipHe: 'בעברית אומרים "הוא רופא" בלי מילה באמצע. באנגלית חייבים is.',
    quickTry: {
      promptHe: 'איך אומרים "היא טבחית"?',
      correct: 'She is a cook.',
      wrong: 'She a cook.',
      explainHe: 'באנגלית צריך להגיד is בין she לבין המקצוע.',
    },
  },
  'g3-u21-m2': {
    titleHe: 'a או an לפני מקצוע? 🚀',
    ideaHe: 'לפני מקצוע שמתחיל בצליל a, e, i, o, u אומרים an: an artist. לפני כל השאר אומרים a.',
    pattern: 'a pilot · an artist',
    examples: [
      { en: 'She is an actor.', he: 'היא שחקנית.', highlight: 'an actor', emoji: '🎭' },
      { en: 'He is an engineer.', he: 'הוא מהנדס.', highlight: 'an engineer', emoji: '🛠️' },
      { en: 'My aunt is a singer.', he: 'הדודה שלי זמרת.', highlight: 'a singer', emoji: '🎤' },
    ],
    quickTry: {
      promptHe: 'מה מתאים?',
      questionEn: 'He is ____ artist.',
      correct: 'an',
      wrong: 'a',
      explainHe: 'artist מתחילה בצליל a, ולכן an.',
    },
  },
  'g3-u22-m1': {
    titleHe: 'מה אני עושה בבוקר? ⏰',
    ideaHe: 'כשמספרים מה עושים כל יום, אחרי I בא הפועל עצמו: I get up, I wash, I eat.',
    pattern: 'I + verb',
    examples: [
      { en: 'I get up at six.', he: 'אני קם/ה בשש.', highlight: 'I get up', emoji: '⏰' },
      { en: 'I drink milk in the morning.', he: 'בבוקר אני שותה חלב.', highlight: 'I drink', emoji: '🥛' },
      { en: 'I brush my hair.', he: 'אני מבריש/ה את השיער.', highlight: 'I brush', emoji: '🪥' },
    ],
    tipHe: 'לא אומרים I am eat. אומרים פשוט I eat.',
    quickTry: {
      promptHe: 'מה נכון?',
      correct: 'I eat an apple.',
      wrong: 'I am eat an apple.',
      explainHe: 'כשמספרים מה עושים לא צריך להגיד am: I eat.',
    },
  },
  'g3-u22-m2': {
    titleHe: 'יום בבית הספר: I go, I do 🏫',
    ideaHe: 'גם בבית הספר: מי (I), מה עושים (go, eat, do), ואז איפה או מה: I go to school.',
    pattern: 'I + go / eat / do + …',
    examples: [
      { en: 'I go to the park.', he: 'אני הולך/ת לפארק.', highlight: 'I go', emoji: '🌳' },
      { en: 'I read a book in class.', he: 'בכיתה אני קורא/ת ספר.', highlight: 'I read', emoji: '📚' },
      { en: 'I eat a banana at ten.', he: 'בעשר אני אוכל/ת בננה.', highlight: 'I eat', emoji: '🍌' },
    ],
    quickTry: {
      promptHe: 'מה נכון?',
      correct: 'I go home at two.',
      wrong: 'I home go at two.',
      explainHe: 'הפועל go בא מיד אחרי I, ואחריו לאן הולכים.',
    },
  },
};
