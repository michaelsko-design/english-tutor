import type { LessonPack } from './types';

/**
 * Grade 7 mini-lessons (Feature 42). The Boss missions get the recap of their unit's lessons
 * (`buildBossRecap`). Examples never repeat a mission's own answers.
 */
export const GRADE_7_LESSONS: LessonPack = {
  'g7-u1-m1': {
    titleHe: 'הסוד של ה-s הקטנה 🐍',
    ideaHe:
      'Present Simple מספר על הרגלים ועל דברים שקורים תמיד. עם he / she / it מוסיפים s לפועל! מילים כמו every day ו-usually הן הרמז.',
    pattern: 'he / she / it + verb + s',
    examples: [
      { en: 'We play football every Tuesday.', he: 'אנחנו משחקים כדורגל בכל יום שלישי.', highlight: 'play' },
      { en: 'Dana plays the guitar after school.', he: 'דנה מנגנת בגיטרה אחרי בית הספר.', highlight: 'plays' },
      { en: 'My brother watches cartoons on Fridays.', he: 'אח שלי צופה בסרטים מצוירים בימי שישי.', highlight: 'watches' },
    ],
    tipHe: 'פעלים שנגמרים ב-sh, ch, s, x או o מקבלים es: watches, goes.',
    quickTry: {
      promptHe: 'איזה פועל משלים את המשפט?',
      questionEn: 'Tom ____ his bike to school every day.',
      correct: 'rides',
      wrong: 'ride',
      explainHe: 'Tom הוא he, ולכן מוסיפים s: rides.',
    },
  },
  'g7-u1-m2': {
    titleHe: 'Do או Does? 🤔',
    ideaHe:
      'כששואלים או שוללים ב-Present Simple, פועל עזר עושה את העבודה: Does עם he / she / it, ו-Do עם כל השאר. הפועל עצמו נשאר בלי s.',
    pattern: 'Do / Does + subject + verb?',
    examples: [
      { en: 'Do your friends like pizza?', he: 'החברים שלך אוהבים פיצה?', highlight: 'Do' },
      { en: 'Does Tom play chess?', he: 'האם תום משחק שחמט?', highlight: 'Does Tom play' },
      { en: "She doesn't eat meat.", he: 'היא לא אוכלת בשר.', highlight: "doesn't eat" },
    ],
    tipHe: 'אחרי Does לא מוסיפים s לפועל: Does he play, לא Does he plays.',
    quickTry: {
      promptHe: 'Do או Does?',
      questionEn: '____ your cat sleep on the sofa?',
      correct: 'Does',
      wrong: 'Do',
      explainHe: 'your cat הוא it, ולכן שואלים עם Does.',
    },
  },
  'g7-u2-m1': {
    titleHe: 'עכשיו או תמיד? ⏱️',
    ideaHe:
      'מה שקורה ממש עכשיו: am / is / are ופועל עם ing. הרגל קבוע: Present Simple. מילים כמו now ו-Look! מסמנות עכשיו, ו-every day מסמנת הרגל.',
    pattern: 'am / is / are + verb-ing',
    examples: [
      { en: 'Look! The baby is laughing.', he: 'תראו! התינוק צוחק.', highlight: 'is laughing' },
      { en: 'We are eating lunch right now.', he: 'אנחנו אוכלים ארוחת צהריים ממש עכשיו.', highlight: 'are eating' },
      { en: 'Dad cooks dinner every evening.', he: 'אבא מבשל ארוחת ערב בכל ערב.', highlight: 'cooks' },
    ],
    tipHe: 'בעברית "אוכלים" זה גם עכשיו וגם תמיד. באנגלית יש לכל אחד צורה משלו!',
    quickTry: {
      promptHe: 'מה מתאים למשהו שקורה ממש עכשיו?',
      questionEn: 'Shh! The teacher ____ right now.',
      correct: 'is talking',
      wrong: 'talks',
      explainHe: 'right now אומר שזה קורה ברגע זה, ולכן is talking.',
    },
  },
  'g7-u2-m2': {
    titleHe: 'פעלים שלא אוהבים ing 🚫',
    ideaHe:
      'פעלים של מחשבה, רגש ושייכות, כמו know, like, want ו-believe, מתארים מצב ולא פעולה. לכן הם לא מקבלים ing, גם כשמדברים על עכשיו.',
    pattern: 'know / want / need + no -ing',
    examples: [
      { en: 'We know the answer!', he: 'אנחנו יודעים את התשובה!', highlight: 'know' },
      { en: 'She wants a new phone.', he: 'היא רוצה טלפון חדש.', highlight: 'wants' },
      { en: 'This bag belongs to Dan.', he: 'התיק הזה שייך לדן.', highlight: 'belongs' },
    ],
    tipHe: 'לא אומרים I am wanting. אומרים פשוט I want.',
    quickTry: {
      promptHe: 'מה נכון כאן?',
      questionEn: 'Right now I ____ a glass of water.',
      correct: 'need',
      wrong: 'am needing',
      explainHe: 'need הוא פועל מצב, ולכן גם עכשיו אומרים I need.',
    },
  },
  'g7-u3-m1': {
    titleHe: 'חוזרים לאתמול ⏪',
    ideaHe:
      'ב-Past Simple מספרים מה קרה. לרוב הפעלים מוסיפים ed. לפעלים יוצאי דופן (irregular) יש צורת עבר מיוחדת (V2), שפשוט זוכרים.',
    pattern: 'play → played · go → went',
    examples: [
      { en: 'We played basketball yesterday.', he: 'שיחקנו כדורסל אתמול.', highlight: 'played' },
      { en: 'Dana went to the beach last week.', he: 'דנה הלכה לים בשבוע שעבר.', highlight: 'went' },
      { en: 'I ate a big sandwich.', he: 'אכלתי כריך גדול.', highlight: 'ate' },
    ],
    tipHe: 'מילים כמו yesterday, last week ו-ago הן סימן לעבר.',
    quickTry: {
      promptHe: 'מה צורת העבר הנכונה?',
      questionEn: 'Yesterday I ____ a letter to my grandma.',
      correct: 'wrote',
      wrong: 'writed',
      explainHe: 'write הוא פועל יוצא דופן: העבר שלו הוא wrote.',
    },
  },
  'g7-u3-m2': {
    titleHe: 'ה-Did עושה את כל העבודה 💪',
    ideaHe: 'בשאלה ובשלילה בעבר, Did כבר מראה שזה עבר. לכן הפועל שאחריו חוזר לצורת הבסיס (V1).',
    pattern: 'Did + subject + V1? · didn’t + V1',
    examples: [
      { en: 'Did you eat breakfast?', he: 'אכלתם ארוחת בוקר?', highlight: 'Did you eat' },
      { en: 'Did Maya call her friend?', he: 'מאיה התקשרה לחברה שלה?', highlight: 'Did Maya call' },
      { en: "We didn't go to school on Friday.", he: 'לא הלכנו לבית הספר ביום שישי.', highlight: "didn't go" },
    ],
    tipHe: 'לא אומרים Did you went. העבר כבר נמצא ב-Did!',
    quickTry: {
      promptHe: 'איזה פועל בא אחרי Did?',
      questionEn: 'Did they ____ the bus this morning?',
      correct: 'take',
      wrong: 'took',
      explainHe: 'אחרי Did בא V1: take, לא took.',
    },
  },
  'g7-u4-m1': {
    titleHe: 'will או going to? 🔮',
    ideaHe:
      'שתי דרכים לדבר על העתיד: going to לתוכנית שכבר החלטנו עליה, ו-will להחלטה של הרגע או לניחוש על העתיד.',
    pattern: 'plan → going to · now / guess → will',
    examples: [
      { en: 'We are going to visit Eilat in the summer.', he: 'אנחנו עומדים לבקר באילת בקיץ.', highlight: 'are going to visit' },
      { en: "It's cold. I will close the window.", he: 'קר. אני אסגור את החלון.', highlight: 'will close' },
      { en: 'Maybe it will rain tomorrow.', he: 'אולי מחר ירד גשם.', highlight: 'will rain' },
    ],
    tipHe: 'אחרי will בא פועל בסיס: will go, לא will going.',
    quickTry: {
      promptHe: 'דנה כבר קנתה כרטיסים. מה מתאים?',
      questionEn: 'Dana ____ see the show tonight.',
      correct: 'is going to',
      wrong: 'will',
      explainHe: 'יש כרטיסים, זאת תוכנית שכבר נקבעה, ולכן is going to.',
    },
  },
  'g7-u4-m2': {
    titleHe: 'עצה, חובה ויכולת 🧭',
    ideaHe:
      'פעלים מודליים באים לפני פועל בסיס: can היא יכולת, should היא עצה, must ו-have to הן חובה. ו-mustn’t? אסור!',
    pattern: 'modal + base verb',
    examples: [
      { en: 'Dolphins can swim fast.', he: 'דולפינים יכולים לשחות מהר.', highlight: 'can swim' },
      { en: 'You must wear a helmet.', he: 'חייבים לחבוש קסדה.', highlight: 'must wear' },
      { en: "You mustn't run near the pool.", he: 'אסור לרוץ ליד הבריכה.', highlight: "mustn't run" },
    ],
    tipHe: 'don’t have to פירושו לא חייבים, אבל mustn’t פירושו אסור. הבדל גדול!',
    quickTry: {
      promptHe: 'מה מתאים בספרייה?',
      questionEn: "It's a library. You ____ shout here.",
      correct: "mustn't",
      wrong: "don't have to",
      explainHe: 'בספרייה אסור לצעוק, ולכן mustn’t.',
    },
  },
};
