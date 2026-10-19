import type { LessonPack } from './types';

/**
 * Grade 8 mini-lessons (Feature 42). Units 2 and 3 have their own Boss lessons, because those
 * Bosses add grammar the unit's missions don't teach (modals of deduction, Present Perfect vs.
 * Past Simple); the other Bosses get the recap of their unit.
 */
export const GRADE_8_LESSONS: LessonPack = {
  'g8-u1-m1': {
    titleHe: 'while: מה קרה ברקע? 🎬',
    ideaHe:
      'Past Continuous (was / were + ing) מתאר פעולה ארוכה שהייתה באמצע בעבר. Past Simple מתאר פעולה קצרה. אחרי while בא בדרך כלל הרקע הארוך.',
    pattern: 'while + was / were + verb-ing',
    examples: [
      { en: 'While Dad was cooking, the cat ate the fish.', he: 'בזמן שאבא בישל, החתול אכל את הדג.', highlight: 'was cooking' },
      { en: 'We were playing outside when it started to rain.', he: 'שיחקנו בחוץ כשהתחיל לרדת גשם.', highlight: 'were playing' },
      { en: 'While Noa was swimming, she saw a turtle.', he: 'בזמן שנועה שחתה, היא ראתה צב.', highlight: 'was swimming' },
    ],
    tipHe: 'was עם I / he / she / it, ו-were עם you / we / they.',
    quickTry: {
      promptHe: 'מה מתאים לפעולה הארוכה שברקע?',
      questionEn: 'While we ____ TV, the lights went out.',
      correct: 'were watching',
      wrong: 'watched',
      explainHe: 'while מציג את הפעולה הארוכה שברקע, ולכן were watching.',
    },
  },
  'g8-u1-m2': {
    titleHe: 'בום! פעולה שנקטעה 💥',
    ideaHe:
      'פעולה ארוכה (was / were + ing) נקטעת פתאום בפעולה קצרה ב-Past Simple. את הפעולה הקצרה מכניסים אחרי when.',
    pattern: 'was / were + verb-ing … when + V2',
    examples: [
      { en: 'I was sleeping when the alarm went off.', he: 'ישנתי כשהשעון המעורר צלצל.', highlight: 'was sleeping' },
      { en: 'They were eating dinner when Grandpa arrived.', he: 'הם אכלו ארוחת ערב כשסבא הגיע.', highlight: 'when Grandpa arrived' },
      { en: 'She was running when she fell.', he: 'היא רצה כשהיא נפלה.', highlight: 'was running' },
    ],
    tipHe: 'אחרי was / were בא פועל עם ing: were walking, לא were walk.',
    quickTry: {
      promptHe: 'was או were?',
      questionEn: 'Mom ____ a cake when the bell rang.',
      correct: 'was baking',
      wrong: 'were baking',
      explainHe: 'Mom היא she, ולכן was baking.',
    },
  },
  'g8-u2-m1': {
    titleHe: 'שואלים על אתמול ועל מחר 🔍',
    ideaHe:
      'על העבר שואלים עם Did, והפועל חוזר לצורת הבסיס (V1). על תוכנית לעתיד שואלים עם are you going to.',
    pattern: 'Did + V1? · are you going to + V1?',
    examples: [
      { en: 'Did you lock the door last night?', he: 'נעלתם את הדלת אתמול בלילה?', highlight: 'Did you lock' },
      { en: 'Did Dan send the message?', he: 'דן שלח את ההודעה?', highlight: 'Did Dan send' },
      { en: 'What are you going to do on Sunday?', he: 'מה אתם מתכננים לעשות ביום ראשון?', highlight: 'are you going to do' },
    ],
    tipHe: 'אחרי Did לא באה צורת עבר: Did you lock, לא Did you locked.',
    quickTry: {
      promptHe: 'איזה פועל בא אחרי Did?',
      questionEn: 'Did the police ____ the thief?',
      correct: 'catch',
      wrong: 'caught',
      explainHe: 'אחרי Did בא V1: catch.',
    },
  },
  'g8-u2-m2': {
    titleHe: 'תוכנית או החלטה של הרגע? ⚡',
    ideaHe:
      'going to מתאים לתוכנית שכבר החלטנו עליה לפני כן. will מתאים להחלטה שנולדת ברגע הדיבור, כתגובה למשהו שקרה עכשיו.',
    pattern: 'plan → be going to · now → will',
    examples: [
      { en: 'We bought paint. We are going to paint our room.', he: 'קנינו צבע. אנחנו עומדים לצבוע את החדר.', highlight: 'are going to paint' },
      { en: "The phone is ringing. I'll answer it.", he: 'הטלפון מצלצל. אני אענה.', highlight: "I'll answer" },
      { en: 'You look tired. I will make you some tea.', he: 'נראה שאתם עייפים. אני אכין לכם תה.', highlight: 'will make' },
    ],
    tipHe: 'כשיש כבר כרטיסים, הזמנה או הכנות, זאת תוכנית, ולכן going to.',
    quickTry: {
      promptHe: 'פתאום התחיל גשם. מה אומרים?',
      questionEn: "It's raining. I ____ take an umbrella.",
      correct: 'will',
      wrong: 'am going to',
      explainHe: 'ההחלטה נולדה עכשיו, כשהגשם התחיל, ולכן will.',
    },
  },
  'g8-u2-m3': {
    titleHe: 'כמה אנחנו בטוחים? 🕵️',
    ideaHe:
      'should נותן עצה. must יכול להיות גם מסקנה: אנחנו כמעט בטוחים שזה נכון. could ו-might הם רק אפשרות.',
    pattern: 'must (sure) · could / might (maybe)',
    examples: [
      { en: 'The lights are on. Someone must be home.', he: 'האורות דולקים. מישהו בטח בבית.', highlight: 'must be' },
      { en: 'The bag could be in the car.', he: 'ייתכן שהתיק באוטו.', highlight: 'could be' },
      { en: 'You should drink more water.', he: 'כדאי לכם לשתות יותר מים.', highlight: 'should drink' },
    ],
    tipHe: 'אחרי מודל אין to: must be, לא must to be.',
    quickTry: {
      promptHe: 'המטרייה רטובה. מה מתאים?',
      questionEn: 'Her umbrella is wet. It ____ be raining outside.',
      correct: 'must',
      wrong: 'should',
      explainHe: 'מטרייה רטובה היא ראיה כמעט בטוחה, ולכן must.',
    },
  },
  'g8-u3-m1': {
    titleHe: 'האם אי פעם...? 🌋',
    ideaHe:
      'Present Perfect (have / has + V3) מספר על חוויות בחיים, בלי לומר מתי. ever שואל "אי פעם", ו-never אומר "אף פעם".',
    pattern: 'have / has + ever / never + V3',
    examples: [
      { en: 'Have you ever seen a shark?', he: 'ראיתם פעם כריש?', highlight: 'Have you ever seen' },
      { en: 'My grandma has never flown on a plane.', he: 'סבתא שלי אף פעם לא טסה במטוס.', highlight: 'has never flown' },
      { en: 'We have eaten sushi twice.', he: 'אכלנו סושי פעמיים.', highlight: 'have eaten' },
    ],
    tipHe: 'לפעלים רבים יש V3 שונה מ-V2: see, saw, seen.',
    quickTry: {
      promptHe: 'מה בא אחרי has ever?',
      questionEn: 'Has she ever ____ a horse?',
      correct: 'ridden',
      wrong: 'rode',
      explainHe: 'אחרי has בא V3: ridden. rode הוא V2.',
    },
  },
  'g8-u3-m2': {
    titleHe: 'כבר? עוד לא? ⏳',
    ideaHe:
      'already (כבר) בא בין have / has לבין V3. yet בא בסוף משפט: בשלילה הוא "עוד לא", ובשאלה הוא "כבר?".',
    pattern: 'has already + V3 · … yet?',
    examples: [
      { en: 'I have already packed my bag.', he: 'כבר ארזתי את התיק.', highlight: 'have already packed' },
      { en: "The movie hasn't started yet.", he: 'הסרט עוד לא התחיל.', highlight: 'yet' },
      { en: 'Has the bus arrived yet?', he: 'האוטובוס כבר הגיע?', highlight: 'yet' },
    ],
    tipHe: 'yet לא בא באמצע המשפט, אלא בסופו.',
    quickTry: {
      promptHe: 'איזו מילה מתאימה למקום הזה?',
      questionEn: 'Ben has ____ cleaned his room.',
      correct: 'already',
      wrong: 'yet',
      explainHe: 'already בא בין has לבין V3. yet בא בסוף המשפט.',
    },
  },
  'g8-u3-m3': {
    titleHe: 'מתי בדיוק? או אי פעם? 📅',
    ideaHe:
      'כשאומרים מתי בדיוק (yesterday, in 2020, last week) משתמשים ב-Past Simple. כשהזמן לא חשוב ומדברים על חוויה, משתמשים ב-Present Perfect.',
    pattern: 'in 2020 → V2 · ever / never → have + V3',
    examples: [
      { en: 'I met Maya last summer.', he: 'פגשתי את מאיה בקיץ שעבר.', highlight: 'met' },
      { en: 'I have met her three times.', he: 'פגשתי אותה שלוש פעמים.', highlight: 'have met' },
      { en: 'Did you go to Eilat in May?', he: 'נסעתם לאילת במאי?', highlight: 'Did you go' },
    ],
    tipHe: 'לא אומרים I have seen it yesterday. עם yesterday בא V2: I saw it.',
    quickTry: {
      promptHe: 'יש זמן מדויק. מה מתאים?',
      questionEn: 'We ____ to Rome in 2022.',
      correct: 'went',
      wrong: 'have gone',
      explainHe: 'in 2022 הוא זמן מדויק בעבר, ולכן went.',
    },
  },
  'g8-u4-m1': {
    titleHe: 'אם... אז: תנאי ראשון 🌊',
    ideaHe:
      'תנאי ראשון מדבר על משהו שבאמת יכול לקרות. אחרי if בא Present Simple, ובחלק השני will ופועל בסיס.',
    pattern: 'If + present, will + V1',
    examples: [
      { en: 'If it rains, we will stay home.', he: 'אם ירד גשם, נישאר בבית.', highlight: 'If it rains' },
      { en: 'If you study, you will pass the test.', he: 'אם תלמדו, תעברו את המבחן.', highlight: 'will pass' },
      { en: "We will miss the bus if we don't hurry.", he: 'נפספס את האוטובוס אם לא נמהר.', highlight: "if we don't hurry" },
    ],
    tipHe: 'אין will אחרי if: If it rains, לא If it will rain.',
    quickTry: {
      promptHe: 'מה בא אחרי if?',
      questionEn: 'If you ____ the plant, it will grow.',
      correct: 'water',
      wrong: 'will water',
      explainHe: 'אחרי if בא Present Simple: If you water.',
    },
  },
  'g8-u4-m2': {
    titleHe: 'סיבה ותוצאה 🔗',
    ideaHe:
      'because מציג סיבה. therefore ו-as a result מציגים תוצאה, ובאים בתחילת החלק של התוצאה.',
    pattern: 'cause; therefore, result',
    examples: [
      { en: 'We stayed inside because it was very hot.', he: 'נשארנו בפנים כי היה חם מאוד.', highlight: 'because' },
      { en: 'It was very hot; therefore, we stayed inside.', he: 'היה חם מאוד; לכן נשארנו בפנים.', highlight: 'therefore' },
      { en: 'He trained every day. As a result, he won.', he: 'הוא התאמן כל יום. כתוצאה מכך, הוא ניצח.', highlight: 'As a result' },
    ],
    tipHe: 'because בא לפני הסיבה, ו-therefore לפני התוצאה. לא מחליפים ביניהם.',
    quickTry: {
      promptHe: 'מה מחבר את הסיבה לתוצאה?',
      questionEn: 'The road was icy; ____, the school closed.',
      correct: 'therefore',
      wrong: 'because',
      explainHe: 'סגירת בית הספר היא התוצאה, ולכן therefore.',
    },
  },
};
