import type { LessonPack } from '../../../lessons/types';

/** The holidays pack's grade 3 mini-lessons (Feature 42): holiday words with review-level grammar. */
export const HOLIDAYS_GRADE_3_LESSONS: LessonPack = {
  'g3-u31-m1': {
    titleHe: 'שנה טובה ומתוקה! 🍎',
    ideaHe: 'בראש השנה מספרים מה יש לנו ומה אנחנו אוהבים: I have (יש לי), I like (אני אוהב/ת).',
    pattern: 'I have … · I like …',
    examples: [
      { en: 'I like round challah.', he: 'אני אוהב/ת חלה עגולה.', highlight: 'I like', emoji: '🍞' },
      { en: 'I have a new dress.', he: 'יש לי שמלה חדשה.', highlight: 'I have', emoji: '👗' },
      { en: 'We like pomegranates.', he: 'אנחנו אוהבים רימונים.', highlight: 'We like', emoji: '❤️' },
    ],
    quickTry: {
      promptHe: 'איך אומרים "יש לי דבש"?',
      correct: 'I have honey.',
      wrong: 'I am honey.',
      explainHe: 'יש לי אומרים I have.',
    },
  },
  'g3-u31-m2': {
    titleHe: 'מה יש בסוכה? ⭐',
    ideaHe: 'This is מראה דבר אחד: This is our sukkah. וכשיש יותר מאחד מוסיפים s: two chains.',
    pattern: 'This is … · two + things',
    examples: [
      { en: 'This is my paper lamp.', he: 'זאת מנורת הנייר שלי.', highlight: 'This is', emoji: '💡' },
      { en: 'We have four chairs in the sukkah.', he: 'יש לנו ארבעה כיסאות בסוכה.', highlight: 'chairs', emoji: '🪑' },
      { en: 'I see two stars.', he: 'אני רואה שני כוכבים.', highlight: 'stars', emoji: '⭐' },
    ],
    quickTry: {
      promptHe: 'מה נכון?',
      correct: 'I have six chains.',
      wrong: 'I have six chain.',
      explainHe: 'שש שרשראות הן יותר מאחת, ולכן chains עם s.',
    },
  },
  'g3-u32-m1': {
    titleHe: 'כתר זהב ותחפושת סגולה 👑',
    ideaHe: 'גם בפורים הצבע בא לפני הדבר: a pink costume (תחפושת ורודה).',
    pattern: 'a + color + thing',
    examples: [
      { en: 'I have a silver mask.', he: 'יש לי מסכה כסופה.', highlight: 'silver mask', emoji: '🎭' },
      { en: 'This is a green tree.', he: 'זה עץ ירוק.', highlight: 'green tree', emoji: '🌳' },
    ],
    tipHe: 'בעברית אומרים "כתר זהב", ובאנגלית a gold crown: הצבע קודם.',
    quickTry: {
      promptHe: 'איך אומרים "תחפושת כחולה"?',
      correct: 'a blue costume',
      wrong: 'a costume blue',
      explainHe: 'הצבע בא לפני הדבר: a blue costume.',
    },
  },
  'g3-u32-m2': {
    titleHe: 'is או are? 🎆',
    ideaHe: 'על דבר אחד אומרים is: The flag is blue. על הרבה דברים אומרים are: The grapes are sweet.',
    pattern: 'one + is · many + are',
    examples: [
      { en: 'The flag is big.', he: 'הדגל גדול.', highlight: 'is', emoji: '🇮🇱' },
      { en: 'The flowers are red.', he: 'הפרחים אדומים.', highlight: 'are', emoji: '🌷' },
      { en: 'It is spring.', he: 'עכשיו אביב.', highlight: 'It is', emoji: '🌷' },
    ],
    quickTry: {
      promptHe: 'מה מתאים?',
      questionEn: 'The grapes ____ green.',
      correct: 'are',
      wrong: 'is',
      explainHe: 'grapes הם הרבה ענבים, ולכן are.',
    },
  },
};
