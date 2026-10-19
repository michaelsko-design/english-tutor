import type { LessonPack } from './types';

/**
 * Grade 10 mini-lessons (Feature 42). The Bosses of units 1, 2 and 4 have their own lessons,
 * because they add the future passive, "whose" and "unless"; unit 3's Boss gets the recap.
 */
export const GRADE_10_LESSONS: LessonPack = {
  'g10-u1-m1': {
    titleHe: 'סביל: הפעולה במרכז 🔄',
    ideaHe:
      'בסביל (Passive) הנושא הוא מי שהפעולה נעשית עליו. בהווה פשוט: am / is / are ואחריו V3. מי שעשה את הפעולה מופיע אחרי by, אם בכלל.',
    pattern: 'is / are + V3 (+ by …)',
    examples: [
      { en: 'Coffee is grown in Brazil.', he: 'מגדלים קפה בברזיל.', highlight: 'is grown' },
      { en: 'The streets are cleaned every night.', he: 'מנקים את הרחובות בכל לילה.', highlight: 'are cleaned' },
      { en: 'This song is sung by a famous choir.', he: 'את השיר הזה שרה מקהלה מפורסמת.', highlight: 'is sung' },
    ],
    tipHe: 'בעברית אומרים "מנקים את הרחובות" בלי נושא. באנגלית: The streets are cleaned.',
    quickTry: {
      promptHe: 'מה מתאים כאן?',
      questionEn: 'Plastic bags ____ in many shops today.',
      correct: 'are banned',
      wrong: 'ban',
      explainHe: 'השקיות לא אוסרות כלום, אוסרים אותן: are banned.',
    },
  },
  'g10-u1-m2': {
    titleHe: 'סביל בעבר 🏗️',
    ideaHe: 'בסביל בעבר משתמשים ב-was / were ואחריו V3. לא משתמשים ב-did בסביל, ולא שוכחים את V3.',
    pattern: 'was / were + V3',
    examples: [
      { en: 'The museum was opened in 1965.', he: 'המוזיאון נפתח ב-1965.', highlight: 'was opened' },
      { en: 'Thousands of trees were planted last year.', he: 'בשנה שעברה ניטעו אלפי עצים.', highlight: 'were planted' },
      { en: 'Was the email sent yesterday?', he: 'האם המייל נשלח אתמול?', highlight: 'Was the email sent' },
    ],
    tipHe: 'בשאלה בסביל בעבר לא משתמשים ב-did: Was it sent, ולא Did it sent.',
    quickTry: {
      promptHe: 'מה בא אחרי was?',
      questionEn: 'The new stadium ____ in only two years.',
      correct: 'was built',
      wrong: 'was build',
      explainHe: 'אחרי was בא V3: built.',
    },
  },
  'g10-u1-m3': {
    titleHe: 'סביל בכל הזמנים 🕰️',
    ideaHe:
      'בכל זמן, הסביל בנוי מצורה של be ואחריה V3. בהווה is / are, בעבר was / were, ובעתיד will be.',
    pattern: 'is / was / will be + V3',
    examples: [
      { en: 'The results are published every June.', he: 'התוצאות מתפרסמות בכל יוני.', highlight: 'are published' },
      { en: 'The results were published last June.', he: 'התוצאות פורסמו ביוני שעבר.', highlight: 'were published' },
      { en: 'The results will be published next June.', he: 'התוצאות יתפרסמו ביוני הבא.', highlight: 'will be published' },
    ],
    tipHe: 'בעתיד הסביל צריך גם be: will be built, לא will built.',
    quickTry: {
      promptHe: 'מה מתאים לעתיד?',
      questionEn: 'A new school ____ here next year.',
      correct: 'will be built',
      wrong: 'will build',
      explainHe: 'בית הספר לא בונה, בונים אותו. בעתיד: will be built.',
    },
  },
  'g10-u2-m1': {
    titleHe: 'פסוקית מגדירה: על מי מדובר? 🎯',
    ideaHe:
      'פסוקית מגדירה אומרת לנו בדיוק על מי או על מה מדברים. בלעדיה המשפט לא ברור, ולכן אין לפניה פסיק.',
    pattern: 'the person who … · the thing which / that …',
    examples: [
      { en: 'The teacher who helped me is retiring.', he: 'המורה שעזר לי יוצא לפנסיה.', highlight: 'who helped me' },
      { en: 'I lost the keys that open the garage.', he: 'איבדתי את המפתחות שפותחים את המוסך.', highlight: 'that open the garage' },
      { en: 'The app which we use is free.', he: 'האפליקציה שאנחנו משתמשים בה חינמית.', highlight: 'which we use' },
    ],
    tipHe: 'where מתאים רק למקומות: the city where I live.',
    quickTry: {
      promptHe: 'מה מתאים לדבר, לא לאדם?',
      questionEn: 'The article ____ I read was misleading.',
      correct: 'that',
      wrong: 'who',
      explainHe: 'article הוא דבר ולא אדם, ולכן that.',
    },
  },
  'g10-u2-m2': {
    titleHe: 'מידע נוסף בין פסיקים ✂️',
    ideaHe:
      'פסוקית לא מגדירה מוסיפה מידע על משהו שכבר ידוע. שמים אותה בין פסיקים, ומשתמשים רק ב-who או ב-which, לא ב-that.',
    pattern: ', who / which …,',
    examples: [
      { en: 'My aunt, who lives in Haifa, is a doctor.', he: 'הדודה שלי, שגרה בחיפה, היא רופאה.', highlight: 'who lives in Haifa' },
      { en: 'Tel Aviv, which is by the sea, is very busy.', he: 'תל אביב, שנמצאת לחוף הים, עמוסה מאוד.', highlight: 'which is by the sea' },
      { en: 'Our dog, which is ten years old, still runs fast.', he: 'הכלב שלנו, שהוא בן עשר, עדיין רץ מהר.', highlight: 'which is ten years old' },
    ],
    tipHe: 'אם אפשר למחוק את הפסוקית והמשפט עדיין ברור, היא בין פסיקים.',
    quickTry: {
      promptHe: 'מה מתאים בין הפסיקים?',
      questionEn: 'Jerusalem, ____ is very old, has many museums.',
      correct: 'which',
      wrong: 'that',
      explainHe: 'בפסוקית בין פסיקים לא משתמשים ב-that, ולכן which.',
    },
  },
  'g10-u2-m3': {
    titleHe: 'whose: של מי? 🔑',
    ideaHe:
      'whose מציין שייכות: למי הדבר שייך. הוא מחליף את his / her / their בפסוקית, ובא תמיד לפני שם עצם.',
    pattern: 'person / thing + whose + noun',
    examples: [
      { en: "That's the boy whose bike was stolen.", he: 'זה הילד שהאופניים שלו נגנבו.', highlight: 'whose bike' },
      { en: 'I met a writer whose books are famous.', he: 'פגשתי סופרת שהספרים שלה מפורסמים.', highlight: 'whose books' },
      { en: 'We visited a town whose streets are very narrow.', he: 'ביקרנו בעיירה שהרחובות שלה צרים מאוד.', highlight: 'whose streets' },
    ],
    tipHe: 'לא מבלבלים בין whose (של מי) לבין who’s (who is).',
    quickTry: {
      promptHe: 'יש כאן שייכות?',
      questionEn: 'The girl ____ won the race is my cousin.',
      correct: 'who',
      wrong: 'whose',
      explainHe: 'אין כאן שייכות: הילדה עצמה ניצחה, ולכן who.',
    },
  },
  'g10-u3-m1': {
    titleHe: 'בטוח שכן, בטוח שלא 🔬',
    ideaHe:
      'כשיש ראיות חזקות, must be אומר "בטוח שכן", ו-can’t be אומר "בטוח שלא". אלה מסקנות על ההווה, לא חובה או יכולת.',
    pattern: 'must be (yes) · can’t be (no)',
    examples: [
      { en: "She's wearing a uniform. She must be a nurse.", he: 'היא לובשת מדים. היא בטח אחות.', highlight: 'must be' },
      { en: "He just ate. He can't be hungry.", he: 'הוא הרגע אכל. לא ייתכן שהוא רעב.', highlight: "can't be" },
      { en: "That can't be Dana. She's in London.", he: 'זאת בטוח לא דנה. היא בלונדון.', highlight: "can't be" },
    ],
    tipHe: 'ההפך של must be כאן הוא can’t be, ולא mustn’t be.',
    quickTry: {
      promptHe: 'מה מתאים לראיה?',
      questionEn: 'The lights are off. They ____ be at home.',
      correct: "can't",
      wrong: 'must',
      explainHe: 'האורות כבויים, אז בטוח שהם לא בבית: can’t.',
    },
  },
  'g10-u3-m2': {
    titleHe: 'might ו-could: אולי 🤷',
    ideaHe:
      'כשאנחנו לא בטוחים, might ו-could אומרים "אולי": זה אפשרי, אבל אין מספיק ראיות. might not אומר "אולי לא".',
    pattern: 'might / could + V1 = maybe',
    examples: [
      { en: 'Take an umbrella. It might rain later.', he: 'קחו מטרייה. אולי ירד גשם אחר כך.', highlight: 'might rain' },
      { en: 'The noise could be the wind.', he: 'אולי הרעש בא מהרוח.', highlight: 'could be' },
      { en: 'He might not be at school today.', he: 'אולי הוא לא בבית הספר היום.', highlight: 'might not be' },
    ],
    tipHe: 'could not be פירושו "לא ייתכן", אבל might not be פירושו "אולי לא".',
    quickTry: {
      promptHe: 'לא בטוחים. מה מתאים?',
      questionEn: "I'm not sure where Tom is. He ____ be in the library.",
      correct: 'might',
      wrong: 'must',
      explainHe: 'אנחנו לא בטוחים, ולכן might: אולי.',
    },
  },
  'g10-u4-m1': {
    titleHe: 'תנאי ראשון: תחזית אמיתית 🔮',
    ideaHe:
      'תנאי ראשון מנבא תוצאה סבירה. החלק עם if הוא בהווה פשוט, והתוצאה ב-will. אפשר גם להתחיל בתוצאה: will …, if ….',
    pattern: 'If + present, will + V1',
    examples: [
      { en: 'If the bus is late, I will walk.', he: 'אם האוטובוס יאחר, אלך ברגל.', highlight: 'If the bus is late' },
      { en: 'If people use less water, the lake will recover.', he: 'אם אנשים ישתמשו בפחות מים, האגם יתאושש.', highlight: 'will recover' },
      { en: 'You will feel better if you sleep more.', he: 'תרגישו טוב יותר אם תישנו יותר.', highlight: 'if you sleep' },
    ],
    tipHe: 'בעברית אומרים "אם תישנו", בעתיד. באנגלית אחרי if בא הווה: if you sleep.',
    quickTry: {
      promptHe: 'מה בא אחרי if?',
      questionEn: 'If the city ____ more trees, the air will be cleaner.',
      correct: 'plants',
      wrong: 'will plant',
      explainHe: 'אחרי if בא Present Simple: plants (עם s, כי the city הוא it).',
    },
  },
  'g10-u4-m2': {
    titleHe: 'תנאי שני: עולם דמיוני 🌌',
    ideaHe:
      'תנאי שני מתאר מצב לא אמיתי בהווה. אחרי if בא V2, ובתוצאה would. עם be נוהגים לומר were גם אחרי I / he / she.',
    pattern: 'If + V2 / were, would + V1',
    examples: [
      { en: 'If she were here, she would help us.', he: 'אילו היא הייתה כאן, היא הייתה עוזרת לנו.', highlight: 'If she were here' },
      { en: 'If robots did our homework, we would learn nothing.', he: 'אילו רובוטים היו מכינים לנו שיעורי בית, לא היינו לומדים כלום.', highlight: 'would learn' },
      { en: 'If he had more time, he would read more.', he: 'אילו היה לו יותר זמן, הוא היה קורא יותר.', highlight: 'If he had' },
    ],
    tipHe: 'If I were you הוא ביטוי קבוע לעצה: "במקומך".',
    quickTry: {
      promptHe: 'מה בא אחרי if בתנאי שני?',
      questionEn: 'If we ____ in Paris, we would visit the Louvre.',
      correct: 'lived',
      wrong: 'live',
      explainHe: 'בתנאי שני אחרי if בא V2: lived.',
    },
  },
  'g10-u4-m3': {
    titleHe: 'unless: אלא אם כן ⛔',
    ideaHe: 'unless פירושו "אלא אם כן", כלומר if … not. כמו אחרי if, גם אחרי unless בא הווה ולא will.',
    pattern: 'unless = if … not',
    examples: [
      { en: 'We will be late unless we leave now.', he: 'נאחר אלא אם כן נצא עכשיו.', highlight: 'unless we leave' },
      { en: 'Unless it rains, the game will start at five.', he: 'אם לא ירד גשם, המשחק יתחיל בחמש.', highlight: 'Unless it rains' },
      { en: "You can't drive unless you have a license.", he: 'אי אפשר לנהוג בלי רישיון.', highlight: 'unless you have' },
    ],
    tipHe: 'לא כותבים unless ו-not ביחד: unless you hurry, לא unless you don’t hurry.',
    quickTry: {
      promptHe: 'מה בא אחרי unless?',
      questionEn: 'Unless you ____, you will miss the bus.',
      correct: 'hurry',
      wrong: 'will hurry',
      explainHe: 'אחרי unless בא הווה: hurry.',
    },
  },
};
