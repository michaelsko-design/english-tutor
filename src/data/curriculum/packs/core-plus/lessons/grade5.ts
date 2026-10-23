import type { LessonPack } from '../../../lessons/types';

/** The core-plus pack's grade 5 mini-lessons, by mission id. Both Bosses get the recap of their unit. */
export const CORE_PLUS_GRADE_5_LESSONS: LessonPack = {
  'g5-u21-m1': {
    titleHe: 'של מי? my, his, her 👪',
    ideaHe: 'כדי להגיד "שלי, שלו, שלה" שמים מילה לפני שם העצם: my (שלי), his (שלו), her (שלה), our (שלנו), their (שלהם).',
    pattern: 'my · his · her · our · their + noun',
    examples: [
      { en: 'Tom loves his little sister.', he: 'תום אוהב את אחותו הקטנה.', highlight: 'his', emoji: '👦' },
      { en: 'Dana rides her bike to school.', he: 'דנה רוכבת על האופניים שלה לבית הספר.', highlight: 'her', emoji: '🚲' },
      { en: 'Our grandparents live in a village.', he: 'סבא וסבתא שלנו גרים בכפר.', highlight: 'Our', emoji: '🏡' },
    ],
    tipHe: 'בעברית אומרים "הבית שלי" (המילה אחרי). באנגלית my בא לפני: my house.',
    quickTry: {
      promptHe: 'his או her?',
      questionEn: 'Yoav is playing with ____ dog.',
      correct: 'his',
      wrong: 'her',
      explainHe: 'Yoav הוא בן, ולכן his (שלו).',
    },
  },
  'g5-u21-m2': {
    titleHe: 'הסוד של ’s 🔍',
    ideaHe: 'כדי להגיד של מי משהו, מוסיפים לשם ’s: Dana’s bag = התיק של דנה. שואלים "של מי?" עם Whose.',
    pattern: "Whose + noun? · name + 's + noun",
    examples: [
      { en: "That is Eli's red bike.", he: 'אלה האופניים האדומים של אלי.', highlight: "Eli's", emoji: '🚲' },
      { en: "My dad's car is very old.", he: 'האוטו של אבא שלי ישן מאוד.', highlight: "dad's", emoji: '🚗' },
      { en: 'Whose backpack is this?', he: 'של מי תיק הגב הזה?', highlight: 'Whose', emoji: '🎒' },
    ],
    tipHe: 'הסדר הפוך מעברית: "הכלב של רון" באנגלית הוא Ron’s dog. קודם הבעלים, אחר כך החפץ.',
    quickTry: {
      promptHe: 'איך אומרים "הכובע של מאיה"?',
      correct: "Maya's hat",
      wrong: 'hat Maya',
      explainHe: 'קודם הבעלים עם ’s ואחר כך החפץ: Maya’s hat.',
    },
  },
  'g5-u22-m1': {
    titleHe: 'some או any? 🥚',
    ideaHe: 'some (קצת, כמה) בא במשפט חיובי. any בא בשלילה ובשאלה: We don’t have any… / Do you have any…?',
    pattern: '+ some · − any · ? any',
    examples: [
      { en: 'There is some milk in the fridge.', he: 'יש קצת חלב במקרר.', highlight: 'some', emoji: '🥛' },
      { en: "There aren't any apples left.", he: 'לא נשארו תפוחים.', highlight: 'any', emoji: '🍎' },
      { en: 'Do you have any butter?', he: 'יש לכם חמאה?', highlight: 'any', emoji: '❓' },
    ],
    tipHe: 'לא אומרים We don’t have some. בשלילה תמיד any.',
    quickTry: {
      promptHe: 'some או any?',
      questionEn: 'Is there ____ juice in the bottle?',
      correct: 'any',
      wrong: 'some',
      explainHe: 'זו שאלה, ובשאלה משתמשים ב-any.',
    },
  },
  'g5-u22-m2': {
    titleHe: 'סופרים או לא סופרים? 🧀',
    ideaHe: 'דברים שסופרים (an egg, two eggs) מקבלים a / an ו-s ברבים. דברים שלא סופרים (milk, rice) לא מקבלים a ולא s, אלא some.',
    pattern: 'a / an + one · some + uncountable',
    examples: [
      { en: 'We eat an egg for breakfast.', he: 'אנחנו אוכלים ביצה לארוחת בוקר.', highlight: 'an egg', emoji: '🥚' },
      { en: 'We need three lemons.', he: 'אנחנו צריכים שלושה לימונים.', highlight: 'three lemons', emoji: '🍋' },
      { en: 'Please pour some water.', he: 'בבקשה למזוג קצת מים.', highlight: 'some water', emoji: '💧' },
    ],
    tipHe: 'לא אומרים a bread או breads. אומרים some bread או a loaf of bread.',
    quickTry: {
      promptHe: 'מה נכון?',
      questionEn: 'Can I have ____ rice, please?',
      correct: 'some',
      wrong: 'a',
      explainHe: 'rice הוא דבר שלא סופרים, ולכן some ולא a.',
    },
  },
};
