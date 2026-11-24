import type { LessonPack } from '../../../lessons/types';

/** The core-4 source's grade 8 mini-lessons, by mission id. */
export const CORE_4_GRADE_8_LESSONS: LessonPack = {
  'g8-u24-m1': {
    titleHe: 'מוסרים דברים: said that 🎤',
    ideaHe:
      'כשמספרים מה מישהו אמר: said (that) … או told + אדם + that …, ומחליפים את הגוף: I → he / she, my → his / her, we → they. את הזמן לא חייבים לשנות (לומדים את זה בתיכון).',
    pattern: '"I love …" → He said (that) he loves …',
    examples: [
      { en: 'Ron said that he loves soccer.', he: 'רון אמר שהוא אוהב כדורגל.', highlight: 'said that he' },
      { en: 'Maya told me that her brother is a chef.', he: 'מאיה סיפרה לי שאחיה שף.', highlight: 'told me that her' },
      { en: 'The girls said that they liked the show.', he: 'הבנות אמרו שהן אהבו את ההופעה.', highlight: 'said that they' },
    ],
    tipHe: 'אחרי said לא בא אדם: said that… (לא said me that…). את המילה that אפשר גם להשמיט.',
    quickTry: {
      promptHe: 'Yael said, "My cat is sick." איך מוסרים את זה?',
      questionEn: 'Yael said that ____ cat is sick.',
      correct: 'Yael said that her cat is sick.',
      wrong: 'Yael said that my cat is sick.',
      explainHe: 'ה-my של יעל הופך ל-her.',
    },
  },
  'g8-u24-m2': {
    titleHe: 'told me, told us to, asked whether 📢',
    ideaHe:
      'told בא תמיד עם אדם: She told me that…. כשמוסרים בקשה או הוראה: told + אדם + to + פועל (He told us to wait). שאלת כן/לא מוסרים עם asked whether (או if), בסדר מילים רגיל.',
    pattern: 'told + person + that … · told + person + to … · asked whether …',
    examples: [
      { en: 'The coach told the team that they played well.', he: 'המאמן אמר לקבוצה שהם שיחקו טוב.', highlight: 'told the team' },
      { en: 'Dad told me to turn off the TV.', he: 'אבא אמר לי לכבות את הטלוויזיה.', highlight: 'told me to' },
      { en: 'Lior asked whether the shop was open.', he: 'ליאור שאל אם החנות פתוחה.', highlight: 'asked whether' },
    ],
    tipHe: 'בהוראה בשלילה: told + אדם + not to: She told us not to run.',
    quickTry: {
      promptHe: 'The guide said to us, "Stay together." איך מוסרים את זה?',
      questionEn: 'The guide told us ____ together.',
      correct: 'The guide told us to stay together.',
      wrong: 'The guide told to us stay together.',
      explainHe: 'told, אחריו האדם (us), ואז to + פועל.',
    },
  },
};
