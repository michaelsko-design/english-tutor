import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-4 source's grade 7 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_4_GRADE_7_EXAM_BANK: ExamBankPack = {
  // Unit 24: inventions (defining relative clauses with who / which / that)
  24: {
    vocabulary: [
      {
        clozeEn: 'My computer is slow because it has a ____.',
        clozeHe: 'המחשב שלי איטי כי יש בו וירוס.',
        answer: 'virus',
        wrong: ['secretary', 'emoji'],
      },
      {
        clozeEn: 'The ____ of living near school is that I can sleep later.',
        clozeHe: 'היתרון בלגור ליד בית הספר הוא שאני יכול/ה לישון מאוחר יותר.',
        answer: 'advantage',
        wrong: ['virus', 'emoji'],
      },
      {
        clozeEn: 'The ____ who answers the phone at the office is very kind.',
        clozeHe: 'המזכירה שעונה לטלפון במשרד נחמדה מאוד.',
        answer: 'secretary',
        wrong: ['software', 'quality'],
      },
      {
        clozeEn: 'Sorry, there is an ____ on this page. Please try again.',
        clozeHe: 'סליחה, יש שגיאה בדף הזה. נסו שוב.',
        answer: 'error',
        wrong: ['advantage', 'option'],
      },
      {
        clozeEn: 'Please ____ when you get home safely.',
        clozeHe: 'תודיעו לי בבקשה כשתגיעו הביתה בשלום.',
        answer: 'let me know',
        wrong: ['at present', 'according to'],
      },
      {
        clozeEn: 'Fifty shekels is a ____ price for a good book.',
        clozeHe: 'חמישים שקלים הם מחיר סביר לספר טוב.',
        answer: 'reasonable',
        wrong: ['somehow', 'surely'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'A microwave is a machine that heats food.',
        wrong: ['A microwave is a machine who heats food.', 'A microwave is a machine that it heats food.'],
        explainHe: 'לדבר משתמשים ב-that או which, ובלי it אחרי that.',
        hintHe: 'האם microwave הוא אדם או דבר?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'The scientist who found the cure won a prize.',
        wrong: ['The scientist which found the cure won a prize.', 'The scientist who he found the cure won a prize.'],
        explainHe: 'לאדם משתמשים ב-who, ואחרי who לא חוזרים על he.',
        hintHe: 'בדקו את מילת החיבור ואת המילה שאחריה.',
      },
      {
        questionEn: 'Which word completes the sentence? This is the drone ____ my uncle built.',
        correct: 'which',
        wrong: ['who', 'what'],
        explainHe: 'drone הוא דבר, אז which (או that).',
        hintHe: 'מה מתאים לדבר?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'The students who made the robot are from Eilat.',
        wrong: ['The students who made the robot is from Eilat.', 'The students which made the robot are from Eilat.'],
        explainHe: 'לאנשים who. הנושא the students (רבים), ולכן are.',
        hintHe: 'מי הנושא של המשפט, ומה מתאים לו: is או are?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I like phones that have a big screen.',
        wrong: ['I like phones that has a big screen.', 'I like phones who have a big screen.'],
        explainHe: 'phones הם רבים, אז have. לדברים that.',
        hintHe: 'בדקו את have או has, ואת מילת החיבור.',
      },
      {
        questionEn: 'Which word completes the sentence? Do you know the girl ____ invented this game?',
        correct: 'who',
        wrong: ['which', 'where'],
        explainHe: 'girl היא אדם, אז who.',
        hintHe: 'מה מתאים לאדם?',
      },
    ],
    sentences: [
      { en: 'This is the game that helps me learn words.', he: 'זה המשחק שעוזר לי ללמוד מילים.' },
      { en: 'The man who fixed my laptop was very fast.', he: 'האיש שתיקן את המחשב הנייד שלי היה מהיר מאוד.' },
      { en: 'We need machines which save energy.', he: 'אנחנו צריכים מכונות שחוסכות אנרגיה.' },
      { en: 'Choose an option that is cheap.', he: 'בחרו אפשרות שהיא זולה.' },
      { en: 'The girl who won first prize at the fair is my cousin.', he: 'הילדה שזכתה בפרס הראשון בתערוכה היא בת הדודה שלי.' },
      { en: 'At present, the robot can only walk.', he: 'כרגע הרובוט יכול רק ללכת.' },
    ],
    passages: [
      {
        passageEn:
          'Some inventions that we use every day came from Israel. One of the first USB flash drives, which store files, was developed by an Israeli company. Modern drip irrigation, a system that gives plants water drop by drop, was also developed in Israel. Farmers who use it save a lot of water.',
        passageHe:
          'כמה המצאות שאנחנו משתמשים בהן כל יום הגיעו מישראל. אחד החסנים הניידים (דיסק און קי) הראשונים, ששומרים קבצים, פותח בחברה ישראלית. גם ההשקיה בטפטוף המודרנית, שיטה שנותנת לצמחים מים טיפה אחרי טיפה, פותחה בישראל. חקלאים שמשתמשים בה חוסכים הרבה מים.',
        questions: [
          {
            questionEn: 'What does a USB flash drive do?',
            questionHe: 'מה עושה החסן הנייד?',
            correct: 'It stores files.',
            wrong: ['It waters plants.', 'It takes photos.'],
          },
          {
            questionEn: 'How does drip irrigation give plants water?',
            questionHe: 'איך השקיה בטפטוף נותנת לצמחים מים?',
            correct: 'Drop by drop.',
            wrong: ['Once a week.', 'With a big pipe.'],
          },
          {
            questionEn: 'Who saves a lot of water?',
            questionHe: 'מי חוסך הרבה מים?',
            correct: 'Farmers who use drip irrigation.',
            wrong: ['People who use a flash drive.', 'Companies in Israel.'],
          },
        ],
      },
      {
        passageEn:
          'Gil is a boy who loves building things. Last month, he made a bird feeder which sends a photo to his phone when a bird lands on it. At first, the camera took too many photos of leaves. Gil moved the camera away from the tree, and now it only takes photos of birds.',
        passageHe:
          'גיל הוא ילד שאוהב לבנות דברים. בחודש שעבר הוא בנה מאכיל ציפורים ששולח תמונה לטלפון שלו כשציפור נוחתת עליו. בהתחלה המצלמה צילמה יותר מדי תמונות של עלים. גיל הזיז את המצלמה רחוק מהעץ, ועכשיו היא מצלמת רק ציפורים.',
        questions: [
          {
            questionEn: 'What did Gil make?',
            questionHe: 'מה גיל בנה?',
            correct: 'A bird feeder with a camera.',
            wrong: ['A robot that flies.', 'A phone for birds.'],
          },
          {
            questionEn: 'What was the problem at first?',
            questionHe: 'מה הייתה הבעיה בהתחלה?',
            correct: 'It took too many photos of leaves.',
            wrong: ['It did not send photos.', 'Birds did not come.'],
          },
          {
            questionEn: 'How did Gil fix the problem?',
            questionHe: 'איך גיל פתר את הבעיה?',
            correct: 'He moved the camera.',
            wrong: ['He bought a new camera.', 'He changed the software.'],
          },
        ],
      },
    ],
  },
};
