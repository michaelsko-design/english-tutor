import type { LessonPack } from '../../../lessons/types';

/** The core-4 source's grade 10 mini-lessons, by mission id. */
export const CORE_4_GRADE_10_LESSONS: LessonPack = {
  'g10-u24-m1': {
    titleHe: 'הוראות בטיחות: If + ציווי 🦺',
    ideaHe:
      'כשנותנים הוראה למקרה מסוים, מתחילים ב-If + הווה, וממשיכים בפועל בציווי (בלי you ובלי will): If you feel sick, sit down. בשלילה: If it rains, don\'t go out.',
    pattern: 'If + present, imperative · If + present, don\'t + verb',
    examples: [
      { en: 'If you hear the alarm, leave the building.', he: 'אם אתם שומעים את האזעקה, צאו מהבניין.', highlight: 'leave' },
      { en: 'If the water is too hot, don\'t drink it.', he: 'אם המים חמים מדי, אל תשתו אותם.', highlight: 'don\'t drink' },
      { en: 'Call 101 if someone is badly hurt.', he: 'התקשרו ל-101 אם מישהו נפגע קשה.', highlight: 'Call' },
    ],
    tipHe: 'if גם מרכך הוראה או הצעה: Sit here, if you like. כש-If בהתחלה, שמים פסיק אחרי החלק שלו.',
    quickTry: {
      promptHe: 'איזו הוראה נכונה?',
      questionEn: 'If you cut your finger, ____ it with clean water.',
      correct: 'If you cut your finger, wash it with clean water.',
      wrong: 'If you cut your finger, you will washing it with clean water.',
      explainHe: 'אחרי חלק ה-If באה הוראה בציווי: wash.',
    },
  },
  'g10-u24-m2': {
    titleHe: 'מילות חיבור: and, but, or, so, yet 🔥',
    ideaHe:
      'and מוסיף רעיון, but ו-yet מראים ניגוד (yet = ובכל זאת), so מראה תוצאה, ו-or נותן אפשרות. כשהן מחברות שני משפטים שלמים, שמים פסיק לפניהן.',
    pattern: 'clause, and / but / or / so / yet + clause',
    examples: [
      { en: 'The road was closed, so we took another way.', he: 'הכביש היה סגור, אז נסענו בדרך אחרת.', highlight: 'so' },
      { en: 'He was tired, yet he finished the race.', he: 'הוא היה עייף, ובכל זאת הוא סיים את המרוץ.', highlight: 'yet' },
      { en: 'Wear a helmet, or you may get hurt.', he: 'חבשו קסדה, אחרת אתם עלולים להיפגע.', highlight: 'or' },
    ],
    tipHe: 'or אחרי הוראה פירושו "אחרת": Hurry up, or you\'ll be late.',
    quickTry: {
      promptHe: 'איזה משפט מראה תוצאה?',
      questionEn: 'It was very cold, ____ we lit a fire.',
      correct: 'It was very cold, so we lit a fire.',
      wrong: 'It was very cold, or we lit a fire.',
      explainHe: 'הדלקנו אש בגלל הקור: so מראה תוצאה.',
    },
  },
};
