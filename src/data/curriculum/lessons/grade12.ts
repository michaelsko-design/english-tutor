import type { LessonPack } from './types';

/**
 * Grade 12 mini-lessons (Feature 42). The Bosses of units 1–3 have their own lessons
 * (concession, the conclusion paragraph, justifying from the text); unit 4's Boss gets the recap.
 */
export const GRADE_12_LESSONS: LessonPack = {
  'g12-u1-m1': {
    titleHe: 'להוסיף ולהנגיד ➕',
    ideaHe:
      'furthermore ו-moreover מוסיפים טיעון באותו כיוון. however ו-in contrast מציגים ניגוד. בתחילת משפט שמים אחריהם פסיק.',
    pattern: 'Moreover, … · However, …',
    examples: [
      { en: 'Exercise improves health. Moreover, it reduces stress.', he: 'ספורט משפר את הבריאות. יתרה מזאת, הוא מפחית לחץ.', highlight: 'Moreover,' },
      { en: 'The plan is cheap. However, it takes time.', he: 'התוכנית זולה. אולם, היא לוקחת זמן.', highlight: 'However,' },
      { en: 'Reading builds vocabulary. Furthermore, it sparks imagination.', he: 'קריאה בונה אוצר מילים. נוסף על כך, היא מעוררת דמיון.', highlight: 'Furthermore,' },
    ],
    tipHe: 'moreover לא מתאים לניגוד. לניגוד בוחרים however.',
    quickTry: {
      promptHe: 'הוספה או ניגוד?',
      questionEn: 'Phones are useful. ____, they can be distracting.',
      correct: 'However',
      wrong: 'Moreover',
      explainHe: 'הטיעון השני מנוגד לראשון, ולכן However.',
    },
  },
  'g12-u1-m2': {
    titleHe: 'פיסוק של תוצאה 🎯',
    ideaHe:
      'consequently ו-therefore מציגים תוצאה. כשהם מחברים שני משפטים שלמים, שמים לפניהם נקודה-פסיק (;) ואחריהם פסיק.',
    pattern: 'clause; therefore, clause.',
    examples: [
      { en: 'The team practised daily; consequently, they won the cup.', he: 'הקבוצה התאמנה כל יום; כתוצאה מכך, היא זכתה בגביע.', highlight: 'consequently,' },
      { en: 'It snowed heavily. Therefore, schools closed.', he: 'ירד שלג כבד. לכן בתי הספר נסגרו.', highlight: 'Therefore,' },
      { en: 'Prices rose; as a result, sales fell.', he: 'המחירים עלו; כתוצאה מכך, המכירות ירדו.', highlight: 'as a result,' },
    ],
    tipHe: 'פסיק לבד לפני therefore לא מספיק כדי לחבר שני משפטים שלמים.',
    quickTry: {
      promptHe: 'איזה משפט מפוסק נכון?',
      correct: 'We missed the bus; consequently, we were late.',
      wrong: 'We missed the bus, consequently we were late.',
      explainHe: 'לפני consequently באה נקודה-פסיק, ואחריו פסיק.',
    },
  },
  'g12-u1-m3': {
    titleHe: 'קודם מודים, אחר כך טוענים 🤝',
    ideaHe:
      'בטיעון חזק מודים קודם בנקודה של הצד השני (concession), ואז מציגים את העמדה שלנו. while it is true that ו-nevertheless עושים את זה.',
    pattern: 'While it is true that A, B. · A. Nevertheless, B.',
    examples: [
      { en: 'While it is true that phones distract, they also help us learn.', he: 'אמנם נכון שטלפונים מסיחים את הדעת, אבל הם גם עוזרים לנו ללמוד.', highlight: 'While it is true that' },
      { en: 'Homework takes time. Nevertheless, it builds good habits.', he: 'שיעורי בית לוקחים זמן. למרות זאת, הם בונים הרגלים טובים.', highlight: 'Nevertheless' },
      { en: 'Admittedly, uniforms are boring, but they save money.', he: 'אמנם תלבושת אחידה משעממת, אבל היא חוסכת כסף.', highlight: 'Admittedly' },
    ],
    tipHe: 'הוויתור בא קודם, והטיעון שלנו בא אחריו ומקבל את המילה האחרונה.',
    quickTry: {
      promptHe: 'מה מתאים אחרי ויתור?',
      questionEn: 'Fast food is cheap. ____, it is unhealthy.',
      correct: 'Nevertheless',
      wrong: 'Moreover',
      explainHe: 'המשפט השני מנוגד לראשון, ולכן Nevertheless.',
    },
  },
  'g12-u2-m1': {
    titleHe: 'משפט התזה: העמדה שלכם 📌',
    ideaHe:
      'משפט התזה, בסוף פסקת הפתיחה, אומר מה העמדה שלכם ומרמז על הנימוקים שיבואו. הוא קצר, ברור, ואינו שאלה.',
    pattern: 'stance + reasons',
    examples: [
      { en: 'In my opinion, school should start later because teens need sleep.', he: 'לדעתי, הלימודים צריכים להתחיל מאוחר יותר כי בני נוער צריכים שינה.', highlight: 'In my opinion' },
      { en: 'I strongly believe that homework should be optional.', he: 'לדעתי, שיעורי בית צריכים להיות רשות.', highlight: 'strongly believe' },
      { en: 'Sports should be required, as they build health and teamwork.', he: 'ספורט צריך להיות חובה, כי הוא בונה בריאות ועבודת צוות.', highlight: 'as they build health and teamwork' },
    ],
    tipHe: 'משפט תזה הוא לא שאלה ולא עובדה, אלא עמדה שאפשר להתווכח איתה.',
    quickTry: {
      promptHe: 'איזה מהם הוא משפט תזה?',
      correct: 'Schools should ban phones because they hurt focus.',
      wrong: 'Many students have phones.',
      explainHe: 'המשפט הנכון מציג עמדה ונימוק. השני הוא רק עובדה.',
    },
  },
  'g12-u2-m2': {
    titleHe: 'although או despite? ⚔️',
    ideaHe:
      'בטענת נגד מציגים את הצד השני ואז עונים לו. although בא לפני משפט שלם, ו-despite לפני שם עצם או פועל עם ing.',
    pattern: 'Although + clause · Despite + noun / -ing',
    examples: [
      { en: 'Although the trip was long, we enjoyed it.', he: 'למרות שהטיול היה ארוך, נהנינו ממנו.', highlight: 'Although the trip was long' },
      { en: 'Despite the rain, the match continued.', he: 'למרות הגשם, המשחק נמשך.', highlight: 'Despite the rain' },
      { en: 'Despite feeling tired, she kept running.', he: 'למרות העייפות, היא המשיכה לרוץ.', highlight: 'Despite feeling tired' },
    ],
    tipHe: 'לא אומרים despite of. פשוט despite, או in spite of.',
    quickTry: {
      promptHe: 'מה בא לפני שם עצם?',
      questionEn: '____ the noise, the baby slept.',
      correct: 'Despite',
      wrong: 'Although',
      explainHe: 'the noise הוא שם עצם, ולכן Despite.',
    },
  },
  'g12-u2-m3': {
    titleHe: 'פסקת הסיכום 🏁',
    ideaHe:
      'פסקת הסיכום חוזרת על העמדה במילים חדשות ומסכמת את הנימוקים. לא מוסיפים בה טיעון חדש. פותחים במילים כמו In conclusion.',
    pattern: 'In conclusion, + the stance again',
    examples: [
      { en: 'In conclusion, a later start would help students learn.', he: 'לסיכום, התחלה מאוחרת יותר תעזור לתלמידים ללמוד.', highlight: 'In conclusion,' },
      { en: 'To sum up, sport keeps us healthy and teaches teamwork.', he: 'לסיכום, ספורט שומר על הבריאות ומלמד עבודת צוות.', highlight: 'To sum up,' },
      { en: 'All in all, the benefits are greater than the costs.', he: 'בסך הכול, היתרונות גדולים מהעלויות.', highlight: 'All in all,' },
    ],
    tipHe: 'בסיכום לא מעתיקים את משפט התזה מילה במילה. כותבים אותו מחדש.',
    quickTry: {
      promptHe: 'מה מתאים לפסקת הסיכום?',
      correct: 'Restating the opinion in new words',
      wrong: 'Adding a brand new reason',
      explainHe: 'בסיכום חוזרים על העמדה במילים חדשות. טיעון חדש שייך לפסקאות הנימוק.',
    },
  },
  'g12-u3-m1': {
    titleHe: 'מה הטון של הכותב? 🎭',
    ideaHe:
      'הטון הוא היחס של הכותב לנושא. מזהים אותו לפי מילים טעונות: amazing מראה התלהבות (enthusiastic), ו-so-called מראה ספקנות (skeptical).',
    pattern: 'word choice → tone',
    examples: [
      { en: 'This amazing app will change your life.', he: 'האפליקציה המדהימה הזאת תשנה את חייכם.', highlight: 'amazing' },
      { en: 'The so-called miracle diet has no proof.', he: 'לדיאטת הפלא כביכול אין שום הוכחה.', highlight: 'so-called' },
      { en: 'The report presents the numbers without comment.', he: 'הדוח מציג את המספרים בלי הערות.', highlight: 'without comment' },
    ],
    tipHe: 'טון ניטרלי (objective) מציג עובדות בלי מילים של רגש או שיפוט.',
    quickTry: {
      promptHe: 'מה הטון של המשפט?',
      questionEn: 'What a fantastic idea! Every school needs it.',
      correct: 'Enthusiastic',
      wrong: 'Skeptical',
      explainHe: 'fantastic ו-every school needs it מראים התלהבות: enthusiastic.',
    },
  },
  'g12-u3-m2': {
    titleHe: 'לחבר בין פסקאות 🧵',
    ideaHe:
      'שאלת סינתזה מבקשת לחבר מידע משתי פסקאות: פרט מפסקה אחת מסביר תוצאה בפסקה אחרת. מחפשים את הקשר, לא רק את הפרטים.',
    pattern: 'detail (P2) → result (P4)',
    examples: [
      { en: 'Paragraph 2: The town built a new park.', he: 'פסקה 2: העיר בנתה פארק חדש.', highlight: 'built a new park' },
      { en: 'Paragraph 4: Fewer people now feel stressed.', he: 'פסקה 4: עכשיו פחות אנשים מרגישים לחוצים.', highlight: 'feel stressed' },
      { en: 'Together: the park helped people relax.', he: 'ביחד: הפארק עזר לאנשים להירגע.', highlight: 'the park helped' },
    ],
    tipHe: 'מילות קישור כמו as a result ו-this led to עוזרות לנסח את הקשר.',
    quickTry: {
      promptHe: 'פסקה 1: נבנה גשר. פסקה 3: הנסיעה התקצרה. מה הקשר?',
      correct: 'The bridge shortened the trip.',
      wrong: 'The trip built the bridge.',
      explainHe: 'הגשר (פסקה 1) גרם לתוצאה (פסקה 3): הנסיעה התקצרה.',
    },
  },
  'g12-u3-m3': {
    titleHe: 'להצדיק מתוך הטקסט 📜',
    ideaHe:
      'כשמבקשים להצדיק תשובה, מצטטים מילים קצרות מהטקסט או מנסחים אותן מחדש בדיוק, ומציינים את מספר השורה. דעה אישית לא מספיקה.',
    pattern: 'answer + short quote (line …)',
    examples: [
      { en: 'The writer is worried: "a dangerous trend" (line 5).', he: 'הכותב מודאג: "מגמה מסוכנת" (שורה 5).', highlight: '"a dangerous trend"' },
      { en: 'As stated in line 8, parks reduce stress.', he: 'כפי שכתוב בשורה 8, פארקים מפחיתים לחץ.', highlight: 'As stated in line 8' },
      { en: 'This is shown by the words "sharp rise" in line 3.', he: 'הדבר מוכח מהמילים "עלייה חדה" בשורה 3.', highlight: '"sharp rise"' },
    ],
    tipHe: 'ציטוט קצר וממוקד עדיף על העתקה של פסקה שלמה.',
    quickTry: {
      promptHe: 'איזו הצדקה טובה יותר?',
      correct: '"Costs fell by half" (line 6).',
      wrong: 'I think it is true.',
      explainHe: 'ציטוט עם מספר שורה מוכיח מתוך הטקסט. דעה אישית לא מוכיחה.',
    },
  },
  'g12-u4-m1': {
    titleHe: 'Not only… but also: הדגשה 💪',
    ideaHe:
      'כשמשפט מתחיל ב-Not only, מחליפים את הסדר כמו בשאלה: פועל עזר (does / is / can) ואחריו הנושא. בחלק השני בא but … also.',
    pattern: 'Not only + does / is / can + subject …, but … also',
    examples: [
      { en: 'Not only does she sing, but she also dances.', he: 'היא לא רק שרה, אלא גם רוקדת.', highlight: 'Not only does she sing' },
      { en: 'Not only is the app free, but it is also fast.', he: 'האפליקציה לא רק חינמית, אלא גם מהירה.', highlight: 'Not only is the app free' },
      { en: 'Not only can he cook, but he also bakes bread.', he: 'הוא לא רק יודע לבשל, אלא גם אופה לחם.', highlight: 'Not only can he cook' },
    ],
    tipHe: 'בלי Not only בהתחלה אין היפוך: She not only sings but also dances.',
    quickTry: {
      promptHe: 'מה בא אחרי Not only בהתחלה?',
      questionEn: 'Not only ____ fast, but he also writes well.',
      correct: 'does he read',
      wrong: 'he reads',
      explainHe: 'אחרי Not only בהתחלה בא היפוך: does he read.',
    },
  },
  'g12-u4-m2': {
    titleHe: 'אנגלית רשמית 👔',
    ideaHe:
      'במכתב רשמי או בראיון עבודה בוחרים מילים מנומסות ומלאות, בלי קיצורים (I am, לא I’m) ובלי סלנג. would like מנומס יותר מ-want.',
    pattern: 'want → would like · get → receive',
    examples: [
      { en: 'I would be grateful if you could reply.', he: 'אודה לכם אם תוכלו להשיב.', highlight: 'I would be grateful' },
      { en: 'Please find my CV attached.', he: 'מצורפים קורות החיים שלי.', highlight: 'Please find' },
      { en: 'I look forward to hearing from you.', he: 'אני מצפה לשמוע מכם.', highlight: 'look forward to' },
    ],
    tipHe: 'Hey ו-Thanks a lot מתאימים לחברים. במכתב רשמי כותבים Dear ו-Thank you.',
    quickTry: {
      promptHe: 'מה מתאים למכתב רשמי?',
      correct: 'Could you please send me the details?',
      wrong: 'Send me the details, OK?',
      explainHe: 'בקשה מנומסת עם Could you please מתאימה למשלב רשמי.',
    },
  },
};
