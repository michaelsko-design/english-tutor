import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-4 source's grade 10 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_4_GRADE_10_EXAM_BANK: ExamBankPack = {
  // Unit 24: safety and first aid (conditional imperative, coordinating conjunctions)
  24: {
    vocabulary: [
      {
        clozeEn: 'The old tree was hit by ____ during the storm.',
        clozeHe: 'העץ הישן נפגע מברק במהלך הסערה.',
        answer: 'lightning',
        wrong: ['queue', 'specialist'],
      },
      {
        clozeEn: 'This chair is very ____. Can I sit on the sofa?',
        clozeHe: 'הכיסא הזה מאוד לא נוח. אפשר לשבת על הספה?',
        answer: 'uncomfortable',
        wrong: ['probable', 'underneath'],
      },
      {
        clozeEn: 'The rules are ____, so read them twice.',
        clozeHe: 'החוקים מסובכים, אז קראו אותם פעמיים.',
        answer: 'complicated',
        wrong: ['loose', 'nasty'],
      },
      {
        clozeEn: 'We waited in a long ____ to buy tickets.',
        clozeHe: 'חיכינו בתור ארוך לקנות כרטיסים.',
        answer: 'queue',
        wrong: ['lightning', 'trash'],
      },
      {
        clozeEn: 'If you have old batteries, ____ them at a recycling point.',
        clozeHe: 'אם יש לכם סוללות ישנות, היפטרו מהן בנקודת מחזור.',
        answer: 'get rid of',
        wrong: ['get in touch', 'get worse'],
      },
      {
        clozeEn: 'The guests will arrive ____, so let\'s get ready.',
        clozeHe: 'האורחים יגיעו בכל רגע, אז בואו נתכונן.',
        answer: 'any minute now',
        wrong: ['in connection with', 'not until'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which instruction is correct?',
        correct: 'If you see a snake, stay away from it.',
        wrong: ['If you will see a snake, stay away from it.', 'If you see a snake, staying away from it.'],
        explainHe: 'If + הווה, ואחר כך הוראה בציווי: stay away.',
        hintHe: 'מה בא אחרי If, ואיך נראית ההוראה?',
      },
      {
        questionEn: 'Which instruction is correct?',
        correct: 'If the sea is rough, don\'t swim.',
        wrong: ['If the sea is rough, not swim.', 'If the sea is rough, you don\'t swimming.'],
        explainHe: 'הוראה בשלילה: don\'t + פועל בסיס.',
        hintHe: 'איך אומרים "אל ת..." באנגלית?',
      },
      {
        questionEn: 'Which word fits? I studied hard, ____ I failed the test.',
        correct: 'yet',
        wrong: ['so', 'or'],
        explainHe: 'למדתי קשה, ובכל זאת נכשלתי: yet מראה ניגוד.',
        hintHe: 'האם החלק השני הוא תוצאה או ניגוד?',
      },
      {
        questionEn: 'Which word fits? The shop was closed, ____ we went home.',
        correct: 'so',
        wrong: ['yet', 'or'],
        explainHe: 'הלכנו הביתה בגלל שהחנות סגורה: so מראה תוצאה.',
        hintHe: 'מה קרה בגלל שהחנות הייתה סגורה?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'Put on sunscreen, or you will get burned.',
        wrong: ['Put on sunscreen, so you will get burned.', 'Put on sunscreen, or you get burn.'],
        explainHe: 'or אחרי הוראה פירושו "אחרת". אחרי will בא get burned.',
        hintHe: 'איזו מילה פירושה "אחרת"?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'The kit was old, but everything in it still worked.',
        wrong: ['The kit was old but, everything in it still worked.', 'The kit old, but everything in it still worked.'],
        explainHe: 'הפסיק בא לפני but, ובחלק הראשון צריך was.',
        hintHe: 'בדקו את מקום הפסיק ואת was.',
      },
    ],
    sentences: [
      { en: 'If you feel weak, sit in the shade.', he: 'אם אתם מרגישים חלשים, שבו בצל.' },
      { en: 'If there is a fire, don\'t use the elevator.', he: 'אם יש שריפה, אל תשתמשו במעלית.' },
      { en: 'The floor was wet, so I slipped.', he: 'הרצפה הייתה רטובה, אז החלקתי.' },
      { en: 'The cut was small, yet it bled a lot.', he: 'החתך היה קטן, ובכל זאת הוא דימם הרבה.' },
      { en: 'Wear gloves, or you may hurt your hands.', he: 'לבשו כפפות, אחרת אתם עלולים לפצוע את הידיים.' },
      { en: 'Who is in charge of the first aid kit?', he: 'מי אחראי על ערכת העזרה הראשונה?' },
    ],
    passages: [
      {
        passageEn:
          'Every summer, lifeguards on Israeli beaches give the same advice. If there is no lifeguard, don\'t go into the water. If you see a black flag, the sea is dangerous, so stay on the sand. If someone is in trouble in the water, call the lifeguard, but don\'t swim out alone to save them.',
        passageHe:
          'כל קיץ, המצילים בחופי ישראל נותנים את אותה עצה. אם אין מציל, אל תיכנסו למים. אם אתם רואים דגל שחור, הים מסוכן, אז הישארו על החול. אם מישהו בצרה במים, קראו למציל, אבל אל תשחו לבד כדי להציל אותו.',
        questions: [
          {
            questionEn: 'What should you do if there is no lifeguard?',
            questionHe: 'מה צריך לעשות אם אין מציל?',
            correct: 'Stay out of the water.',
            wrong: ['Swim near the shore.', 'Look for a black flag.'],
          },
          {
            questionEn: 'What does a black flag mean?',
            questionHe: 'מה פירוש דגל שחור?',
            correct: 'The sea is dangerous.',
            wrong: ['The lifeguard is on a break.', 'The water is warm.'],
          },
          {
            questionEn: 'What should you do if someone is in trouble in the water?',
            questionHe: 'מה צריך לעשות אם מישהו בצרה במים?',
            correct: 'Call the lifeguard.',
            wrong: ['Swim out alone to help.', 'Wait on the sand quietly.'],
          },
        ],
      },
      {
        passageEn:
          'During a school hike, a girl was stung by a bee. Her arm got red, yet she said that she felt fine. The teacher, who was in charge of the group, knew that some people are allergic to bees, so she watched the girl carefully. When the girl\'s face started to swell, the teacher called 101 immediately.',
        passageHe:
          'במהלך טיול בית ספר, דבורה עקצה ילדה. היד שלה האדימה, ובכל זאת היא אמרה שהיא מרגישה טוב. המורה, שהייתה אחראית על הקבוצה, ידעה שלחלק מהאנשים יש אלרגיה לדבורים, אז היא השגיחה על הילדה בזהירות. כשהפנים של הילדה התחילו להתנפח, המורה התקשרה מיד ל-101.',
        questions: [
          {
            questionEn: 'What happened to the girl?',
            questionHe: 'מה קרה לילדה?',
            correct: 'A bee stung her.',
            wrong: ['She slipped on a rock.', 'She got lost.'],
          },
          {
            questionEn: 'Why did the teacher watch the girl carefully?',
            questionHe: 'למה המורה השגיחה על הילדה בזהירות?',
            correct: 'Some people are allergic to bees.',
            wrong: ['The girl was crying.', 'The girl wanted to go home.'],
          },
          {
            questionEn: 'When did the teacher call 101?',
            questionHe: 'מתי המורה התקשרה ל-101?',
            correct: 'When the girl\'s face started to swell.',
            wrong: ['As soon as the bee stung her.', 'At the end of the hike.'],
          },
        ],
      },
    ],
  },
};
