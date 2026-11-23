import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-4 source's grade 11 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_4_GRADE_11_EXAM_BANK: ExamBankPack = {
  // Unit 24: predictions and plans (future perfect, future in the past)
  24: {
    vocabulary: [
      {
        clozeEn: 'Teaching is a ____ that needs a lot of patience.',
        clozeHe: 'הוראה היא מקצוע שדורש הרבה סבלנות.',
        answer: 'profession',
        wrong: ['mood', 'pity'],
      },
      {
        clozeEn: 'She has a warm and friendly ____.',
        clozeHe: 'יש לה אישיות חמה וחברותית.',
        answer: 'personality',
        wrong: ['union', 'input'],
      },
      {
        clozeEn: 'I was ____ go to sleep when my friend called.',
        clozeHe: 'עמדתי ללכת לישון כשהחבר שלי התקשר.',
        answer: 'about to',
        wrong: ['tired of', 'or so'],
      },
      {
        clozeEn: 'It\'s a ____ that you can\'t come to the party.',
        clozeHe: 'חבל שאתם לא יכולים לבוא למסיבה.',
        answer: 'pity',
        wrong: ['fortune', 'maker'],
      },
      {
        clozeEn: 'The trip was very ____. We laughed all day.',
        clozeHe: 'הטיול היה מהנה מאוד. צחקנו כל היום.',
        answer: 'enjoyable',
        wrong: ['unemployed', 'occasional'],
      },
      {
        clozeEn: 'I am ____ eating pasta every day. Let\'s cook something else.',
        clozeHe: 'נמאס לי לאכול פסטה כל יום. בואו נבשל משהו אחר.',
        answer: 'tired of',
        wrong: ['about to', 'see off'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'By 2030, they will have built a new hospital.',
        wrong: ['By 2030, they will have build a new hospital.', 'By 2030, they will built a new hospital.'],
        explainHe: 'future perfect: will have + V3 (built).',
        hintHe: 'מה חסר, ובאיזו צורה הפועל?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'By the time Mom gets home, we will have cleaned the house.',
        wrong: ['By the time Mom will get home, we will have cleaned the house.', 'By the time Mom gets home, we will cleaned the house.'],
        explainHe: 'אחרי By the time בא הווה (gets), ובחלק השני will have + V3.',
        hintHe: 'בדקו את gets ואת will have.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I was going to visit you, but I got sick.',
        wrong: ['I was going to visited you, but I got sick.', 'I am going to visit you, but I got sick.'],
        explainHe: 'תוכנית מהעבר שלא קרתה: was going to + פועל בסיס.',
        hintHe: 'הסיפור בעבר. מה בא אחרי going to?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'She promised that she would call.',
        wrong: ['She promised that she will called.', 'She promised that she would calls.'],
        explainHe: 'אחרי promised (עבר) בא would + פועל בסיס.',
        hintHe: 'מה בא במקום will במשפט על העבר?',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Will you have finished the project by Monday?',
        wrong: ['Will you have finish the project by Monday?', 'Will have you finished the project by Monday?'],
        explainHe: 'בשאלה: Will + נושא + have + V3.',
        hintHe: 'בדקו את סדר המילים ואת צורת הפועל.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We thought that the game would be easy.',
        wrong: ['We thought that the game will be easy.', 'We thought that the game would being easy.'],
        explainHe: 'עתיד מנקודת מבט של העבר: would + be.',
        hintHe: 'המשפט בעבר (thought).',
      },
    ],
    sentences: [
      { en: 'By next summer, I will have saved enough money.', he: 'עד הקיץ הבא, כבר אחסוך מספיק כסף.' },
      { en: 'We were going to meet, but she was busy.', he: 'התכוונו להיפגש, אבל היא הייתה עסוקה.' },
      { en: 'He said that he would bring the snacks.', he: 'הוא אמר שהוא יביא את החטיפים.' },
      { en: 'By 2050, cities will have changed a lot.', he: 'עד 2050 הערים כבר ישתנו מאוד.' },
      { en: 'I was about to leave when you arrived.', he: 'עמדתי לצאת כשהגעתם.' },
      { en: 'Once in a while, I read my old diary.', he: 'מדי פעם אני קורא/ת ביומן הישן שלי.' },
    ],
    passages: [
      {
        passageEn:
          'Experts predict that by 2050, the world\'s population will have reached almost ten billion people. Cities will have grown, and many new professions will have appeared. However, they also warn that if we don\'t act now, many regions will have run short of fresh water.',
        passageHe:
          'מומחים חוזים שעד 2050 אוכלוסיית העולם תגיע לכמעט עשרה מיליארד בני אדם. הערים יגדלו, והרבה מקצועות חדשים יופיעו. עם זאת, הם גם מזהירים שאם לא נפעל עכשיו, באזורים רבים כבר יהיה מחסור במים מתוקים.',
        questions: [
          {
            questionEn: 'How many people will there be by 2050, according to experts?',
            questionHe: 'כמה אנשים יהיו עד 2050, לפי המומחים?',
            correct: 'Almost ten billion.',
            wrong: ['Almost one billion.', 'Exactly fifty billion.'],
          },
          {
            questionEn: 'What will have appeared by 2050?',
            questionHe: 'מה יופיע עד 2050?',
            correct: 'Many new professions.',
            wrong: ['New planets.', 'More fresh water.'],
          },
          {
            questionEn: 'What do the experts warn about?',
            questionHe: 'ממה המומחים מזהירים?',
            correct: 'Running short of fresh water.',
            wrong: ['Cities getting smaller.', 'Too many jobs.'],
          },
        ],
      },
      {
        passageEn:
          'When Avi was twelve, he was sure that he would become an astronaut. He was going to study physics and fly to the moon. In actual fact, he became a science teacher. "I didn\'t reach space," he tells his students, "but strangely enough, I help other people get there."',
        passageHe:
          'כשאבי היה בן שתים עשרה, הוא היה בטוח שהוא יהיה אסטרונאוט. הוא התכוון ללמוד פיזיקה ולטוס לירח. למעשה, הוא נעשה מורה למדעים. "לא הגעתי לחלל," הוא אומר לתלמידים שלו, "אבל למרבה הפלא, אני עוזר לאנשים אחרים להגיע לשם."',
        questions: [
          {
            questionEn: 'What did Avi think he would become?',
            questionHe: 'מה אבי חשב שהוא יהיה?',
            correct: 'An astronaut.',
            wrong: ['A science teacher.', 'A pilot.'],
          },
          {
            questionEn: 'What is Avi\'s job now?',
            questionHe: 'מה המקצוע של אבי עכשיו?',
            correct: 'A science teacher.',
            wrong: ['An astronaut.', 'A physicist.'],
          },
          {
            questionEn: 'What does Avi mean by "I help other people get there"?',
            questionHe: 'למה אבי מתכוון כשהוא אומר "אני עוזר לאנשים אחרים להגיע לשם"?',
            correct: 'He teaches students who may one day reach space.',
            wrong: ['He drives people to the airport.', 'He builds rockets.'],
          },
        ],
      },
    ],
  },
};
