import type { LessonPack } from './types';

/**
 * Grade 11 mini-lessons (Feature 42). The Bosses of units 2 and 4 have their own lessons
 * (interpreting symbols, inference questions); units 1 and 3 get the recap.
 */
export const GRADE_11_LESSONS: LessonPack = {
  'g11-u1-m1': {
    titleHe: 'תנאי שלישי: חרטה על העבר ⏪',
    ideaHe:
      'תנאי שלישי מדבר על עבר שלא קרה ועל התוצאה הדמיונית שלו. כבר מאוחר לשנות. אחרי if בא had + V3, ובתוצאה would have + V3.',
    pattern: 'had + V3 … would have + V3',
    examples: [
      { en: 'If we had left earlier, we would have caught the train.', he: 'אילו יצאנו מוקדם יותר, היינו מספיקים לרכבת.', highlight: 'had left' },
      { en: 'If she had studied, she would have passed.', he: 'אילו היא הייתה לומדת, היא הייתה עוברת.', highlight: 'would have passed' },
      { en: "If it hadn't rained, we would have gone to the beach.", he: 'אילו לא ירד גשם, היינו הולכים לים.', highlight: "hadn't rained" },
    ],
    tipHe: 'would have לא בא אחרי if: If I had known, לא If I would have known.',
    quickTry: {
      promptHe: 'מה בא אחרי if בתנאי שלישי?',
      questionEn: "If they ____ the map, they wouldn't have got lost.",
      correct: 'had checked',
      wrong: 'checked',
      explainHe: 'בתנאי שלישי אחרי if בא had + V3: had checked.',
    },
  },
  'g11-u1-m2': {
    titleHe: 'סיבה ותוצאה בסיפור 🧩',
    ideaHe:
      'בשאלות HOTS מחפשים למה דמות פעלה כך ומה קרה בעקבות זה. because ו-since באים לפני משפט שלם, ו-because of ו-due to לפני שם עצם.',
    pattern: 'because + sentence · because of + noun',
    examples: [
      { en: 'The game was cancelled because of the storm.', he: 'המשחק בוטל בגלל הסערה.', highlight: 'because of the storm' },
      { en: 'The game was cancelled because it was stormy.', he: 'המשחק בוטל כי היה סוער.', highlight: 'because it was stormy' },
      { en: "He left home due to his father's anger.", he: 'הוא עזב את הבית בגלל הכעס של אביו.', highlight: 'due to' },
    ],
    tipHe: '"בגלל" לפני שם עצם הוא because of, ולא because.',
    quickTry: {
      promptHe: 'מה בא לפני שם עצם?',
      questionEn: 'She stayed home ____ her illness.',
      correct: 'because of',
      wrong: 'because',
      explainHe: 'her illness הוא שם עצם, ולכן because of.',
    },
  },
  'g11-u2-m1': {
    titleHe: 'שתי נקודות מבט 👀',
    ideaHe:
      'בשאלה על נקודות מבט משווים בין מה ששתי דמויות חושבות או מרגישות. whereas ו-on the other hand מראים את ההבדל ביניהן.',
    pattern: 'A thinks …, whereas B thinks …',
    examples: [
      { en: 'Dan loves the city, whereas his sister prefers the village.', he: 'דן אוהב את העיר, ואילו אחותו מעדיפה את הכפר.', highlight: 'whereas' },
      { en: 'The coach wants speed. On the other hand, the players want rest.', he: 'המאמן רוצה מהירות. מנגד, השחקנים רוצים מנוחה.', highlight: 'On the other hand' },
      { en: "From the mother's point of view, the move was a mistake.", he: 'מנקודת המבט של האם, המעבר היה טעות.', highlight: "From the mother's point of view" },
    ],
    tipHe: 'furthermore מוסיף רעיון דומה. הוא לא מתאים להבדל בין דעות.',
    quickTry: {
      promptHe: 'איזו מילה מראה ניגוד?',
      questionEn: 'Tom wanted to stay, ____ Lily wanted to leave.',
      correct: 'whereas',
      wrong: 'furthermore',
      explainHe: 'יש כאן ניגוד בין שתי דעות, ולכן whereas.',
    },
  },
  'g11-u2-m2': {
    titleHe: 'דומה ושונה ⚖️',
    ideaHe:
      'כשמשווים בין שני טקסטים, מחפשים במה הם דומים ובמה הם שונים. both ו-likewise מראים דמיון, ו-unlike ו-in contrast מראים הבדל.',
    pattern: 'same → both / likewise · different → unlike',
    examples: [
      { en: 'Both stories take place during a war.', he: 'שני הסיפורים מתרחשים בזמן מלחמה.', highlight: 'Both' },
      { en: 'The first hero is brave. Likewise, the second never gives up.', he: 'הגיבור הראשון אמיץ. גם השני אף פעם לא מוותר.', highlight: 'Likewise' },
      { en: 'Unlike the poem, the story ends happily.', he: 'בניגוד לשיר, הסיפור נגמר בטוב.', highlight: 'Unlike' },
    ],
    tipHe: 'unlike בא לפני שם עצם: Unlike the poem. in contrast פותח משפט, ואחריו פסיק.',
    quickTry: {
      promptHe: 'דמיון או הבדל?',
      questionEn: 'The novel is long. ____, the poem is very short.',
      correct: 'In contrast',
      wrong: 'Likewise',
      explainHe: 'יש כאן הבדל (ארוך מול קצר), ולכן In contrast.',
    },
  },
  'g11-u2-m3': {
    titleHe: 'מה הסמל מסמל? 🕊️',
    ideaHe:
      'סמל הוא דבר מוחשי שמייצג רעיון גדול יותר. כדי לפרש סמל שואלים: מה הוא מזכיר, מתי הוא מופיע, ואיך הוא קשור לנושא של הסיפור.',
    pattern: 'object → idea',
    examples: [
      { en: 'The dove represents peace.', he: 'היונה מסמלת שלום.', highlight: 'represents' },
      { en: 'The locked door symbolizes her fear of change.', he: 'הדלת הנעולה מסמלת את הפחד שלה משינוי.', highlight: 'symbolizes' },
      { en: 'The storm reflects his anger.', he: 'הסערה משקפת את הכעס שלו.', highlight: 'reflects' },
    ],
    tipHe: 'לא מספיק לתאר את הסמל. צריך להסביר מה הוא מייצג, ולמה.',
    quickTry: {
      promptHe: 'מה מתאים להסבר של סמל?',
      questionEn: "In the story, the broken clock ____ the father's lost time.",
      correct: 'symbolizes',
      wrong: 'repairs',
      explainHe: 'השעון השבור מייצג רעיון, הזמן שאבד לאב: symbolizes.',
    },
  },
  'g11-u3-m1': {
    titleHe: 'should have: היה כדאי... 😬',
    ideaHe:
      'should have + V3 מביע חרטה או ביקורת על העבר: היה כדאי לעשות משהו, אבל זה לא קרה. shouldn’t have אומר שעשו משהו שלא היה כדאי.',
    pattern: 'should (not) have + V3',
    examples: [
      { en: 'We should have taken a map.', he: 'היינו צריכים לקחת מפה.', highlight: 'should have taken' },
      { en: "You shouldn't have eaten so much candy.", he: 'לא הייתם צריכים לאכול כל כך הרבה ממתקים.', highlight: "shouldn't have eaten" },
      { en: 'He should have told the truth.', he: 'הוא היה צריך לומר את האמת.', highlight: 'should have told' },
    ],
    tipHe: 'אחרי should have בא V3, לא V2: should have gone, לא should have went.',
    quickTry: {
      promptHe: 'חרטה על העבר. מה נכון?',
      questionEn: "I'm so tired. I ____ gone to bed earlier.",
      correct: 'should have',
      wrong: 'should had',
      explainHe: 'חרטה על העבר: should have + V3.',
    },
  },
  'g11-u3-m2': {
    titleHe: 'מסקנות על העבר 🏺',
    ideaHe:
      'must have + V3 אומר "בטוח ש... קרה". couldn’t have + V3 אומר "לא ייתכן ש... קרה". כך מסיקים מסקנות על העבר מתוך ראיות.',
    pattern: 'must have + V3 · couldn’t have + V3',
    examples: [
      { en: 'The ground is wet. It must have rained.', he: 'האדמה רטובה. בטח ירד גשם.', highlight: 'must have rained' },
      { en: "She couldn't have seen us. It was too dark.", he: 'לא ייתכן שהיא ראתה אותנו. היה חשוך מדי.', highlight: "couldn't have seen" },
      { en: 'They must have forgotten the meeting.', he: 'הם בטח שכחו את הפגישה.', highlight: 'must have forgotten' },
    ],
    tipHe: 'מסקנה על העבר צריכה have + V3 אחרי המודל: must have left, לא must left.',
    quickTry: {
      promptHe: 'מסקנה על העבר. מה נכון?',
      questionEn: "Ben isn't answering. He ____ left his phone at home.",
      correct: 'must have',
      wrong: 'must had',
      explainHe: 'מסקנה בטוחה על העבר: must have + V3.',
    },
  },
  'g11-u4-m1': {
    titleHe: 'סריקה, רפרוף ומילים מההקשר 🔎',
    ideaHe:
      'skimming: קריאה מהירה כדי להבין את הרעיון הכללי. scanning: חיפוש מהיר של פרט מסוים. מילה לא מוכרת? מנחשים לפי המילים שסביבה.',
    pattern: 'skim → main idea · scan → detail',
    examples: [
      { en: "The desert was arid; it hadn't rained for years.", he: 'המדבר היה צחיח; לא ירד בו גשם במשך שנים.', highlight: "it hadn't rained for years" },
      { en: 'He was famished, so he ate three plates of pasta.', he: 'הוא היה רעב מאוד, אז הוא אכל שלוש צלחות פסטה.', highlight: 'ate three plates of pasta' },
      { en: 'Unlike her timid brother, Maya was very bold.', he: 'בניגוד לאחיה הביישן, מאיה הייתה נועזת מאוד.', highlight: 'Unlike her timid brother' },
    ],
    tipHe: 'מילים כמו unlike, but ו-so הן רמזים חזקים למשמעות של מילה חדשה.',
    quickTry: {
      promptHe: 'לפי ההקשר, מה פירוש narrow?',
      questionEn: 'The road was so narrow that only one car could pass.',
      correct: 'צר',
      wrong: 'רחב',
      explainHe: 'only one car could pass רומז שהדרך לא רחבה, ולכן narrow הוא צר.',
    },
  },
  'g11-u4-m2': {
    titleHe: 'מתארים גרפים ומגמות 📈',
    ideaHe:
      'בתיאור נתונים משתמשים בפעלים של מגמה: rise (עלה), drop (ירד), remain stable (נשאר יציב). majority היא יותר מחצי.',
    pattern: 'rise · drop · remain stable',
    examples: [
      { en: 'Sales rose sharply in 2023.', he: 'המכירות עלו בחדות ב-2023.', highlight: 'rose sharply' },
      { en: 'The number of visitors dropped by 20%.', he: 'מספר המבקרים ירד ב-20%.', highlight: 'dropped' },
      { en: 'The majority of students walk to school.', he: 'רוב התלמידים הולכים ברגל לבית הספר.', highlight: 'The majority of' },
    ],
    tipHe: 'sharply אומר שינוי חד, ו-slightly אומר שינוי קטן.',
    quickTry: {
      promptHe: 'שינוי קטן או חד?',
      questionEn: 'Prices went from $10 to $11. They rose ____.',
      correct: 'slightly',
      wrong: 'sharply',
      explainHe: 'שינוי של דולר אחד הוא קטן, ולכן slightly.',
    },
  },
  'g11-u4-m3': {
    titleHe: 'מה אפשר להסיק? 🧠',
    ideaHe:
      'שאלת הסקה (infer) מבקשת משהו שלא כתוב במפורש, אבל נובע מהטקסט. מחפשים ראיה בטקסט ושואלים: מה היא מלמדת?',
    pattern: 'evidence → conclusion',
    examples: [
      { en: "Dana's eyes were red, and she held a tissue.", he: 'העיניים של דנה היו אדומות, והיא החזיקה טישו.', highlight: 'held a tissue' },
      { en: 'We can infer that Dana had been crying.', he: 'אפשר להסיק שדנה בכתה.', highlight: 'infer' },
      { en: 'The streets were full of umbrellas.', he: 'הרחובות היו מלאים במטריות.', highlight: 'full of umbrellas' },
    ],
    tipHe: 'תשובת הסקה טובה נשענת על הטקסט, לא על דעה אישית.',
    quickTry: {
      promptHe: 'מה אפשר להסיק מהמשפט?',
      questionEn: 'Everyone in the room was yawning.',
      correct: 'People were tired.',
      wrong: 'People were hungry.',
      explainHe: 'פיהוק הוא ראיה לעייפות, ולכן אפשר להסיק שהם עייפים.',
    },
  },
};
