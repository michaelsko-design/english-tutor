import type { LessonPack } from '../../../lessons/types';

/** The holidays pack's grade 9 mini-lessons, by mission id. The Bosses get their unit's recap. */
export const HOLIDAYS_GRADE_9_LESSONS: LessonPack = {
  'g9-u31-m1': {
    titleHe: 'מאז ועד עכשיו, ומה הלאה? 🍯',
    ideaHe:
      'Present Perfect (have / has + V3) מספר מה קרה מאז נקודה בעבר ועד היום. לתוכניות שכבר החלטנו עליהן משתמשים ב-be going to ופועל בסיס.',
    pattern: 'have + V3 since… · am going to + V1',
    examples: [
      { en: 'I have grown five centimetres since last year.', he: 'גדלתי בחמישה סנטימטרים מאז השנה שעברה.', highlight: 'have grown' },
      { en: 'She has learned to bake challah since the summer.', he: 'מאז הקיץ היא למדה לאפות חלה.', highlight: 'has learned' },
      { en: 'We are going to visit Grandpa on the holiday.', he: 'אנחנו הולכים לבקר את סבא בחג.', highlight: 'are going to visit' },
    ],
    tipHe: 'אחרי going to בא פועל בסיס: going to read, ולא going to reading.',
    quickTry: {
      promptHe: 'מה בא אחרי going to?',
      questionEn: 'This year I am going to ____ more vegetables.',
      correct: 'eat',
      wrong: 'eating',
      explainHe: 'אחרי going to בא פועל בסיס: eat.',
    },
  },
  'g9-u31-m2': {
    titleHe: 'באמצע הפעולה: when ו-while ☔',
    ideaHe:
      'Past Continuous (was / were + V-ing) מתאר פעולה שנמשכה בעבר. פעולה קצרה שקטעה אותה באה ב-Past Simple אחרי when.',
    pattern: 'was / were + V-ing … when + V2',
    examples: [
      { en: 'I was reading when the phone rang.', he: 'קראתי כשהטלפון צלצל.', highlight: 'was reading' },
      { en: 'While we were walking home, it started to rain.', he: 'בזמן שהלכנו הביתה, התחיל לרדת גשם.', highlight: 'were walking' },
      { en: 'They were singing when the lights went out.', he: 'הם שרו כשהאורות כבו.', highlight: 'were singing' },
    ],
    tipHe: 'עם we, you ו-they משתמשים ב-were, ולא ב-was.',
    quickTry: {
      promptHe: 'was או were?',
      questionEn: 'The kids ____ playing outside when the storm began.',
      correct: 'were',
      wrong: 'was',
      explainHe: 'The kids הם רבים, ולכן were.',
    },
  },
  'g9-u32-m1': {
    titleHe: 'אילו... תנאי שני 🎭',
    ideaHe: 'תנאי שני מדמיין מצב שלא קורה באמת. אחרי if בא Past Simple, ובחלק השני would ופועל בסיס.',
    pattern: 'If + V2, would + V1',
    examples: [
      { en: 'If I had a magic hat, I would become invisible.', he: 'אילו היה לי כובע קסמים, הייתי נעשה בלתי נראה.', highlight: 'would become' },
      { en: 'If our school had a garden, we would grow tomatoes.', he: 'אילו היה לבית הספר שלנו גן, היינו מגדלים עגבניות.', highlight: 'If our school had' },
      { en: 'Would you fly if you were a bird?', he: 'הייתם עפים אילו הייתם ציפור?', highlight: 'if you were' },
    ],
    tipHe: 'אחרי if לא בא would: If I had, ולא If I would have.',
    quickTry: {
      promptHe: 'מה בא אחרי would?',
      questionEn: 'If it snowed in Tel Aviv, we ____ a snowman.',
      correct: 'would build',
      wrong: 'would built',
      explainHe: 'אחרי would בא פועל בסיס: build.',
    },
  },
  'g9-u32-m2': {
    titleHe: 'for או since? מסורות משפחתיות 📅',
    ideaHe:
      'Present Perfect מספר על דבר שהתחיל בעבר ונמשך עד היום. for בא לפני משך זמן (for five years), ו-since לפני נקודת התחלה (since 2010).',
    pattern: 'for + period · since + point',
    examples: [
      { en: 'We have sung this song at the Seder for years.', he: 'אנחנו שרים את השיר הזה בליל הסדר כבר שנים.', highlight: 'for years' },
      { en: 'He has played in the band since April.', he: 'הוא מנגן בלהקה מאז אפריל.', highlight: 'since April' },
      { en: 'They have known each other since kindergarten.', he: 'הם מכירים זה את זה מהגן.', highlight: 'since kindergarten' },
    ],
    tipHe: 'לא אומרים since three years. אומרים for three years.',
    quickTry: {
      promptHe: 'for או since?',
      questionEn: 'I have had this bike ____ my last birthday.',
      correct: 'since',
      wrong: 'for',
      explainHe: 'my last birthday היא נקודת התחלה, ולכן since.',
    },
  },
};
