import type { LessonPack } from '../../../lessons/types';

/**
 * Holidays pack, grade 8 mini-lessons (Feature 42): reviews of going to / will, Past Continuous
 * and modals through the holidays. The Bosses get the recap of their unit.
 */
export const HOLIDAYS_GRADE_8_LESSONS: LessonPack = {
  'g8-u31-m1': {
    titleHe: 'תוכנית או החלטה של רגע? 🗓️',
    ideaHe:
      'be going to מתאר תוכנית שכבר החלטנו עליה מראש. will מתאר החלטה שנולדת ברגע הדיבור, הבטחה או הצעה לעזור.',
    pattern: 'am / is / are going to + V1 · will + V1',
    examples: [
      { en: 'We are going to visit Grandma for the holiday.', he: 'אנחנו מתכננים לבקר את סבתא בחג.', highlight: 'are going to visit' },
      { en: 'That bag looks heavy. I’ll carry it for you.', he: 'התיק הזה נראה כבד. אני אסחוב אותו בשבילך.', highlight: 'I’ll carry' },
      { en: 'My cousins are going to sleep in the sukkah.', he: 'בני הדודים שלי מתכננים לישון בסוכה.', highlight: 'are going to sleep' },
    ],
    tipHe: 'אחרי going to ואחרי will בא פועל בצורת הבסיס: will help, לא will helps.',
    quickTry: {
      promptHe: 'מה מתאים להחלטה של רגע?',
      questionEn: 'Oh no, we have no apples! I ____ to the shop.',
      correct: 'will go',
      wrong: 'am going to went',
      explainHe: 'ההחלטה נולדה עכשיו, ולכן will go.',
    },
  },
  'g8-u31-m2': {
    titleHe: 'מה קרה באמצע? ⛈️',
    ideaHe:
      'Past Continuous (was / were + ing) מתאר פעולה ארוכה ברקע. Past Simple מתאר את מה שקרה פתאום. while בא לפני הרקע, ו-when לפני הפעולה הקצרה.',
    pattern: 'while + was / were + verb-ing · when + V2',
    examples: [
      { en: 'While we were eating latkes, the doorbell rang.', he: 'בזמן שאכלנו לביבות, צלצל פעמון הדלת.', highlight: 'were eating' },
      { en: 'Grandpa was telling a story when the lights went out.', he: 'סבא סיפר סיפור כשהאורות כבו.', highlight: 'was telling' },
      { en: 'It was raining when we left the party.', he: 'ירד גשם כשיצאנו מהמסיבה.', highlight: 'was raining' },
    ],
    tipHe: 'was עם I / he / she / it, ו-were עם you / we / they.',
    quickTry: {
      promptHe: 'was או were?',
      questionEn: 'The children ____ singing when the candles went out.',
      correct: 'were',
      wrong: 'was',
      explainHe: 'the children הם רבים, ולכן were singing.',
    },
  },
  'g8-u32-m1': {
    titleHe: 'מספרים סיפור מהחג 🎭',
    ideaHe:
      'בסיפור על העבר, Past Simple מספר מה קרה, ו-Past Continuous מתאר מה היה באמצע. בשאלה: Did + V1 או was / were + ing.',
    pattern: 'Did + V1? · What were you doing?',
    examples: [
      { en: 'Did you plant a tree on Tu BiShvat?', he: 'שתלתם עץ בט״ו בשבט?', highlight: 'Did you plant' },
      { en: 'What were you doing when the music started?', he: 'מה עשיתם כשהמוזיקה התחילה?', highlight: 'were you doing' },
      { en: 'Maya was dressed as a queen at the party.', he: 'מאיה הייתה מחופשת למלכה במסיבה.', highlight: 'was dressed' },
    ],
    tipHe: 'אחרי Did הפועל חוזר לצורת הבסיס: Did you see, לא Did you saw.',
    quickTry: {
      promptHe: 'איזו שאלה נכונה?',
      questionEn: '____ you see the fireworks last night?',
      correct: 'Did',
      wrong: 'Were',
      explainHe: 'see הוא פועל בצורת הבסיס בלי ing, ולכן שואלים עם Did.',
    },
  },
  'g8-u32-m2': {
    titleHe: 'עצה או חובה? 📣',
    ideaHe:
      'should נותן עצה ("כדאי"). must ו-have to מראים חובה ("חייבים"). אחרי should ו-must בא פועל בצורת הבסיס, בלי to.',
    pattern: 'should / must + V1 · have / has to + V1',
    examples: [
      { en: 'You should wear a hat at the barbecue.', he: 'כדאי לחבוש כובע במנגל.', highlight: 'should wear' },
      { en: 'Visitors must keep the park clean.', he: 'המבקרים חייבים לשמור על הפארק נקי.', highlight: 'must keep' },
      { en: 'We have to clean the kitchen before Passover.', he: 'אנחנו חייבים לנקות את המטבח לפני פסח.', highlight: 'have to clean' },
    ],
    tipHe: 'עם he / she / it אומרים has to: She has to go.',
    quickTry: {
      promptHe: 'מה מתאים לעצה?',
      questionEn: 'It’s very hot today. You ____ drink more water.',
      correct: 'should',
      wrong: 'should to',
      explainHe: 'אחרי should בא פועל בצורת הבסיס בלי to: should drink.',
    },
  },
};
