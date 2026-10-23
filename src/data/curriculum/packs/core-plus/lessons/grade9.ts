import type { LessonPack } from '../../../lessons/types';

/** The core-plus pack's grade 9 mini-lessons, by mission id. The Bosses get their unit's recap. */
export const CORE_PLUS_GRADE_9_LESSONS: LessonPack = {
  'g9-u21-m1': {
    titleHe: 'had + V3: העבר שלפני העבר ⏪',
    ideaHe:
      'כשמספרים על שתי פעולות בעבר, הפעולה שקרתה קודם באה ב-Past Perfect: had ואחריו V3. אותו had מתאים לכל הגופים.',
    pattern: 'had + V3',
    examples: [
      { en: 'The film had started when we arrived.', he: 'הסרט כבר התחיל כשהגענו.', highlight: 'had started' },
      { en: 'She had lost her key, so she climbed the fence.', he: 'היא איבדה את המפתח, אז היא טיפסה על הגדר.', highlight: 'had lost' },
      { en: 'They had eaten dinner before the guests came.', he: 'הם אכלו ארוחת ערב לפני שהאורחים הגיעו.', highlight: 'had eaten' },
    ],
    tipHe: 'בעברית אין זמן מיוחד לזה: "הסרט התחיל כשהגענו". באנגלית אומרים had started.',
    quickTry: {
      promptHe: 'מה בא אחרי had?',
      questionEn: 'The shop had ____ before we got there.',
      correct: 'closed',
      wrong: 'close',
      explainHe: 'אחרי had בא V3: closed.',
    },
  },
  'g9-u21-m2': {
    titleHe: 'עד ש... by the time ⏰',
    ideaHe:
      'before, after ו-by the time עוזרים לסדר את הפעולות. בשלילה אומרים hadn’t + V3, ובשאלה had בא לפני הנושא: Had you...?',
    pattern: 'By the time + V2, had + V3',
    examples: [
      { en: 'By the time I woke up, my brother had left.', he: 'עד שהתעוררתי, אחי כבר יצא.', highlight: 'had left' },
      { en: 'We hadn’t met before the trip.', he: 'לא הכרנו לפני הטיול.', highlight: 'hadn’t met' },
      { en: 'Had you ever flown before last summer?', he: 'טסתם פעם לפני הקיץ שעבר?', highlight: 'Had you ever flown' },
    ],
    tipHe: 'אחרי by the time בא Past Simple ולא had: By the time I woke up.',
    quickTry: {
      promptHe: 'איך שוללים ב-Past Perfect?',
      questionEn: 'I ____ the news before you called.',
      correct: 'hadn’t heard',
      wrong: 'didn’t heard',
      explainHe: 'בשלילה ב-Past Perfect: hadn’t ואחריו V3 (heard).',
    },
  },
  'g9-u22-m1': {
    titleHe: 'אמרו ש... דיבור עקיף 🗨️',
    ideaHe:
      'כשמוסרים מה מישהו אמר, אחרי said הזמן זז צעד אחורה: am / is הופכים ל-was, ו-Present Simple הופך ל-Past Simple. גם I הופך ל-he או she.',
    pattern: 'said (that) + one step back',
    examples: [
      { en: '"I am hungry." — He said that he was hungry.', he: '"אני רעב." ← הוא אמר שהוא רעב.', highlight: 'he was hungry' },
      { en: 'Shira said that she liked the new song.', he: 'שירה אמרה שהשיר החדש מוצא חן בעיניה.', highlight: 'she liked' },
      { en: 'They said that the bus was late.', he: 'הם אמרו שהאוטובוס מאחר.', highlight: 'the bus was late' },
    ],
    tipHe: 'בעברית הזמן נשאר: "הוא אמר שהוא רעב". באנגלית: he said he was hungry.',
    quickTry: {
      promptHe: 'מה הצורה הנכונה אחרי said?',
      questionEn: 'Ben said that he ____ football every day.',
      correct: 'played',
      wrong: 'plays',
      explainHe: 'אחרי said הזמן זז אחורה: plays הופך ל-played.',
    },
  },
  'g9-u22-m2': {
    titleHe: 'said או told? 🤔',
    ideaHe:
      'tell צריך מישהו ששומע: told me, told the class. say בא בלי מישהו: said that. בדיבור עקיף will הופך ל-would, ו-have + V3 הופך ל-had + V3.',
    pattern: 'told + someone · will → would',
    examples: [
      { en: 'Grandma told me that she would visit soon.', he: 'סבתא אמרה לי שהיא תבוא לבקר בקרוב.', highlight: 'told me' },
      { en: 'The coach said that we had played well.', he: 'המאמן אמר ששיחקנו טוב.', highlight: 'had played' },
      { en: 'You told us that the test would be easy!', he: 'אמרתם לנו שהמבחן יהיה קל!', highlight: 'would be easy' },
    ],
    tipHe: 'לא אומרים said me. אומרים told me, או said to me.',
    quickTry: {
      promptHe: 'למה הופך will בדיבור עקיף?',
      questionEn: 'Noa told me that she ____ call later.',
      correct: 'would',
      wrong: 'will',
      explainHe: 'בדיבור עקיף will זז צעד אחורה ל-would.',
    },
  },
};
