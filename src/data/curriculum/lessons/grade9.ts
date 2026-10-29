import type { LessonPack } from './types';

/** Grade 9 mini-lessons (Feature 42). The Bosses are reviews and get the recap of their unit. */
export const GRADE_9_LESSONS: LessonPack = {
  'g9-u1-m1': {
    titleHe: 'just ו-already: הרגע וכבר ⏱️',
    ideaHe:
      'Present Perfect (have / has + V3) מחבר עבר להווה. just אומר "הרגע", ו-already אומר "כבר". שניהם באים בין have / has לבין V3.',
    pattern: 'have / has + just / already + V3',
    examples: [
      { en: 'I have just woken up.', he: 'הרגע התעוררתי.', highlight: 'have just woken' },
      { en: 'They have already bought the tickets.', he: 'הם כבר קנו את הכרטיסים.', highlight: 'have already bought' },
      { en: 'The train has just left.', he: 'הרכבת הרגע יצאה.', highlight: 'has just left' },
    ],
    tipHe: 'has עם he / she / it, ו-have עם כל השאר.',
    quickTry: {
      promptHe: 'מה בא אחרי has just?',
      questionEn: 'Tom has just ____ his homework.',
      correct: 'done',
      wrong: 'did',
      explainHe: 'אחרי has just בא V3: done. did הוא V2.',
    },
  },
  'g9-u1-m2': {
    titleHe: 'since או for? ⌛',
    ideaHe:
      'כשמשהו התחיל בעבר ועדיין נמשך, משתמשים ב-Present Perfect. for אומר כמה זמן, ו-since אומר מאיזו נקודת זמן.',
    pattern: 'for + a period · since + a starting point',
    examples: [
      { en: 'We have lived here for ten years.', he: 'אנחנו גרים כאן כבר עשר שנים.', highlight: 'for ten years' },
      { en: 'She has played the piano since 2019.', he: 'היא מנגנת בפסנתר מאז 2019.', highlight: 'since 2019' },
      { en: 'I have been sick since Monday.', he: 'אני חולה מיום שני.', highlight: 'since Monday' },
    ],
    tipHe: 'בעברית אומרים "אנחנו גרים כאן" בהווה. באנגלית צריך להגיד have lived.',
    quickTry: {
      promptHe: 'since או for?',
      questionEn: 'They have been friends ____ three years.',
      correct: 'for',
      wrong: 'since',
      explainHe: 'three years הוא משך זמן, ולכן for.',
    },
  },
  'g9-u2-m1': {
    titleHe: 'ומה אם...? תנאי שני 💭',
    ideaHe:
      'תנאי שני מדבר על מצב דמיוני או לא סביר. אחרי if בא Past Simple, ובחלק השני would ופועל בסיס.',
    pattern: 'If + V2, would + V1',
    examples: [
      { en: 'If we had wings, we would fly to school.', he: 'אם היו לנו כנפיים, היינו עפים לבית הספר.', highlight: 'would fly' },
      { en: 'If she lived near the sea, she would surf every day.', he: 'אם היא הייתה גרה ליד הים, היא הייתה גולשת כל יום.', highlight: 'If she lived' },
      { en: 'What would you do if you won a million?', he: 'מה הייתם עושים אם הייתם זוכים במיליון?', highlight: 'would you do' },
    ],
    tipHe: 'אחרי if לא בא would: If I had, לא If I would have.',
    quickTry: {
      promptHe: 'מה בא אחרי if בתנאי שני?',
      questionEn: 'If we ____ a dog, we would walk it every day.',
      correct: 'had',
      wrong: 'have',
      explainHe: 'בתנאי שני אחרי if בא V2: had.',
    },
  },
  'g9-u2-m2': {
    titleHe: 'although ו-however: ניגוד 🔀',
    ideaHe:
      'although (למרות ש) מחבר שני חלקים במשפט אחד. however (אולם) פותח משפט חדש, ואחריו פסיק. in contrast משווה בין שני דברים שונים.',
    pattern: 'Although A, B. · A. However, B.',
    examples: [
      { en: 'Although it was cold, we went swimming.', he: 'למרות שהיה קר, הלכנו לשחות.', highlight: 'Although' },
      { en: 'The phone is cheap. However, it is slow.', he: 'הטלפון זול. אולם, הוא איטי.', highlight: 'However' },
      { en: 'Cats sleep a lot. In contrast, dogs need walks.', he: 'חתולים ישנים הרבה. לעומתם, כלבים צריכים טיולים.', highlight: 'In contrast' },
    ],
    tipHe: 'לא שמים although ו-but באותו משפט. אחד מהם מספיק.',
    quickTry: {
      promptHe: 'איזו מילה מתאימה?',
      questionEn: '____ she was tired, she finished the race.',
      correct: 'Although',
      wrong: 'However',
      explainHe: 'שני החלקים נמצאים באותו משפט, ולכן Although.',
    },
  },
  'g9-u3-m1': {
    titleHe: 'סביל: מה נעשה, לא מי עשה 🏭',
    ideaHe:
      'בסביל (Passive) חשוב מה קרה לדבר, יותר ממי שעשה אותו. בהווה: am / is / are ואחריו V3. את מי שעשה מוסיפים עם by.',
    pattern: 'am / is / are + V3 (+ by …)',
    examples: [
      { en: 'English is spoken all over the world.', he: 'מדברים אנגלית בכל העולם.', highlight: 'is spoken' },
      { en: 'These shoes are made in Italy.', he: 'הנעליים האלה מיוצרות באיטליה.', highlight: 'are made' },
      { en: 'The pizza is delivered by a robot.', he: 'את הפיצה מביא רובוט.', highlight: 'is delivered' },
    ],
    tipHe: 'is עם יחיד ו-are עם רבים, והפועל תמיד V3: are made, לא are make.',
    quickTry: {
      promptHe: 'מה מתאים כאן?',
      questionEn: 'Bread ____ in this bakery every morning.',
      correct: 'is baked',
      wrong: 'bakes',
      explainHe: 'הלחם לא אופה את עצמו. זה סביל: is baked.',
    },
  },
  'g9-u3-m2': {
    titleHe: 'סביל בעבר 🏛️',
    ideaHe:
      'בסביל בעבר משתמשים ב-was (יחיד) או were (רבים) ואחריהם V3. כך מספרים מה נעשה פעם, במיוחד כשלא חשוב מי עשה.',
    pattern: 'was / were + V3',
    examples: [
      { en: 'The pyramids were built thousands of years ago.', he: 'הפירמידות נבנו לפני אלפי שנים.', highlight: 'were built' },
      { en: 'My bike was stolen last night.', he: 'האופניים שלי נגנבו אתמול בלילה.', highlight: 'was stolen' },
      { en: 'The letters were written by hand.', he: 'המכתבים נכתבו בכתב יד.', highlight: 'were written' },
    ],
    tipHe: 'was עם יחיד ו-were עם רבים: The bike was, The bikes were.',
    quickTry: {
      promptHe: 'was או were?',
      questionEn: 'The windows ____ broken in the storm.',
      correct: 'were',
      wrong: 'was',
      explainHe: 'The windows הם רבים, ולכן were.',
    },
  },
  'g9-u4-m1': {
    titleHe: 'who, which, that: מי ומה? 👥',
    ideaHe:
      'פסוקית זיקה מוסיפה מידע על שם עצם. who מתאים לאנשים, which לדברים ולבעלי חיים, ו-that מתאים לשניהם.',
    pattern: 'person → who · thing → which · both → that',
    examples: [
      { en: 'I have a friend who speaks French.', he: 'יש לי חבר שמדבר צרפתית.', highlight: 'who speaks' },
      { en: 'This is the book which won the prize.', he: 'זה הספר שזכה בפרס.', highlight: 'which won' },
      { en: 'The cake that Mom baked is delicious.', he: 'העוגה שאמא אפתה טעימה מאוד.', highlight: 'that Mom baked' },
    ],
    tipHe: 'לא אומרים The man which. לאנשים משתמשים ב-who.',
    quickTry: {
      promptHe: 'who או which?',
      questionEn: 'The dog ____ lives next door is very loud.',
      correct: 'which',
      wrong: 'who',
      explainHe: 'כלב הוא לא אדם, ולכן which.',
    },
  },
  'g9-u4-m2': {
    titleHe: 'שלושה תנאים במבט אחד 🧭',
    ideaHe:
      'תנאי אפס (If + present, present) הוא עובדה שתמיד נכונה. תנאי ראשון (will) הוא עתיד אפשרי. תנאי שני (If + V2, would) הוא דמיון.',
    pattern: 'fact · possible · imaginary',
    examples: [
      { en: 'If you heat ice, it melts.', he: 'אם מחממים קרח, הוא נמס.', highlight: 'it melts' },
      { en: 'If it snows, we will build a snowman.', he: 'אם ירד שלג, נבנה איש שלג.', highlight: 'will build' },
      { en: 'If we were birds, we would fly away.', he: 'אילו היינו ציפורים, היינו עפים.', highlight: 'would fly' },
    ],
    tipHe: 'באף אחד מהתנאים לא שמים will אחרי if.',
    quickTry: {
      promptHe: 'תוכנית אמיתית לעתיד. מה מתאים?',
      questionEn: 'If we leave now, we ____ the train.',
      correct: 'will catch',
      wrong: 'would catch',
      explainHe: 'זה עתיד אפשרי ואמיתי (תנאי ראשון), ולכן will catch.',
    },
  },
};
