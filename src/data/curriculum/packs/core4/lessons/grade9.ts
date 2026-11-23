import type { LessonPack } from '../../../lessons/types';

/** The core-4 source's grade 9 mini-lessons, by mission id. */
export const CORE_4_GRADE_9_LESSONS: LessonPack = {
  'g9-u24-m1': {
    titleHe: 'תנאי אמיתי: If + הווה, will 🧑‍🎓',
    ideaHe:
      'כשמשהו באמת יכול לקרות, משתמשים בתנאי מסוג ראשון: If + הווה, ואחר כך will + פועל. אחרי if לא בא will, גם כשמדברים על העתיד.',
    pattern: 'If + present, … will + verb',
    examples: [
      { en: 'If you study hard, you will pass the test.', he: 'אם תלמדו ברצינות, תעברו את המבחן.', highlight: 'If you study' },
      { en: 'If it rains, the game will stop.', he: 'אם ירד גשם, המשחק ייפסק.', highlight: 'will stop' },
      { en: 'She will call us if she needs help.', he: 'היא תתקשר אלינו אם היא תצטרך עזרה.', highlight: 'if she needs' },
    ],
    tipHe: 'אפשר להתחיל בכל חלק. כש-If בהתחלה, שמים פסיק אחרי החלק שלו.',
    quickTry: {
      promptHe: 'איזה משפט נכון?',
      questionEn: 'If he ____ the bus, he will be late.',
      correct: 'If he misses the bus, he will be late.',
      wrong: 'If he will miss the bus, he will be late.',
      explainHe: 'אחרי If בא הווה (misses), לא will.',
    },
  },
  'g9-u24-m2': {
    titleHe: 'תנאי דמיוני: If + עבר, would 💭',
    ideaHe:
      'כשמדמיינים מצב שלא קורה עכשיו, משתמשים בתנאי מסוג שני: If + עבר, ואחר כך would + פועל. עם be אומרים were: If I were rich… ועצה נותנים כך: If I were you, I would…',
    pattern: 'If + past, … would + verb',
    examples: [
      { en: 'If I had a robot, it would clean my room.', he: 'אם היה לי רובוט, הוא היה מנקה את החדר שלי.', highlight: 'If I had' },
      { en: 'If she lived in Eilat, she would swim every day.', he: 'אם היא הייתה גרה באילת, היא הייתה שוחה כל יום.', highlight: 'would swim' },
      { en: 'If we were older, we would drive a car.', he: 'אם היינו גדולים יותר, היינו נוהגים במכונית.', highlight: 'If we were' },
    ],
    tipHe: 'הפועל בעבר כאן לא מדבר על העבר, אלא על דמיון: If I had a million shekels… (אין לי).',
    quickTry: {
      promptHe: 'איזה משפט נכון?',
      questionEn: 'If I ____ a dog, I would walk it every day.',
      correct: 'If I had a dog, I would walk it every day.',
      wrong: 'If I have a dog, I would walk it every day.',
      explainHe: 'בתנאי דמיוני: If + עבר (had), ואחר כך would.',
    },
  },
};
