import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-plus pack's grade 12 exam bank, by the unit number in its mission ids. New questions only;
 * the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_PLUS_GRADE_12_EXAM_BANK: ExamBankPack = {
  // Unit 21: mixed conditionals (past → present, present → past)
  21: {
    vocabulary: [
      {
        clozeEn: 'After two years in Paris, my cousin is now ____ in French.',
        clozeHe: 'אחרי שנתיים בפריז, בת הדודה שלי מדברת עכשיו צרפתית שוטפת.',
        answer: 'fluent',
        wrong: ['cautious', 'pivotal'],
      },
      {
        clozeEn: 'The factory will ____ to the north because land there is cheaper.',
        clozeHe: 'המפעל יעבור לצפון כי הקרקע שם זולה יותר.',
        answer: 'relocate',
        wrong: ['temperament', 'scholarship'],
      },
      {
        clozeEn: 'He made an ____ decision and bought a motorbike without asking anyone.',
        clozeHe: 'הוא קיבל החלטה אימפולסיבית וקנה אופנוע בלי לשאול אף אחד.',
        answer: 'impulsive',
        wrong: ['fluent', 'trajectory'],
      },
      {
        clozeEn: 'The final match was the most ____ game of the whole season.',
        clozeHe: 'משחק הגמר היה המשחק המכריע ביותר בכל העונה.',
        answer: 'pivotal',
        wrong: ['hesitate', 'relocate'],
      },
      {
        clozeEn: 'Thanks to a ____, Omer could study medicine without paying fees.',
        clozeHe: 'בזכות מלגה, עומר יכול היה ללמוד רפואה בלי לשלם שכר לימוד.',
        answer: 'scholarship',
        wrong: ['speculate', 'impulsive'],
      },
      {
        clozeEn: 'Scientists can only ____ about what the first humans sounded like.',
        clozeHe: 'מדענים יכולים רק לשער איך נשמעו בני האדם הראשונים.',
        answer: 'speculate',
        wrong: ['alternate', 'pursue'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the mixed conditional: "If I had eaten breakfast, I ____ hungry now."',
        correct: "wouldn't be",
        wrong: ["wouldn't have been", "won't be"],
        explainHe: 'התנאי בעבר (had eaten), אבל התוצאה עכשיו (now), ולכן would + V1.',
        hintHe: 'בדקו את מילת הזמן בסוף המשפט: האם הרעב היה בעבר או שהוא עכשיו?',
      },
      {
        questionEn: 'Complete the mixed conditional: "If Noa ____ so forgetful, she would have remembered my birthday."',
        correct: "weren't",
        wrong: ["hadn't", "won't be"],
        explainHe: 'השכחנות היא תכונה קבועה של נועה, ולכן Past Simple: weren\'t.',
        hintHe: 'האם השכחנות קרתה פעם אחת או שהיא תכונה שנכונה גם היום?',
      },
      {
        questionEn: 'Which sentence is a mixed conditional?',
        correct: 'If he had studied law, he would be a lawyer now.',
        wrong: [
          'If he had studied law, he would have become a lawyer.',
          'If he studies law, he will become a lawyer.',
        ],
        explainHe: 'בתנאי המעורב התנאי בעבר והתוצאה בהווה (would be … now). שתי האפשרויות האחרות הן תנאי שלישי ותנאי ראשון.',
        hintHe: 'חפשו את המשפט שבו שני החלקים מדברים על זמנים שונים.',
      },
      {
        questionEn: 'What does this sentence mean? "If I were a good swimmer, I would have joined the race."',
        correct: 'I am not a good swimmer, so I did not join the race.',
        wrong: ['I joined the race because I swim well.', 'I will join the race when I learn to swim.'],
        explainHe: 'were מתאר תכונה בהווה שאינה נכונה, ו-would have joined מתאר עבר שלא קרה.',
        hintHe: 'משפט תנאי דמיוני מתאר את ההפך מהמציאות. מה המציאות היום, ומה קרה בעבר?',
      },
      {
        questionEn: 'Choose the correct form: "If the bus hadn\'t broken down, we ____ at the beach right now."',
        correct: 'would be',
        wrong: ['would have been', 'will be'],
        explainHe: 'right now מראה שהתוצאה בהווה, ולכן would be.',
        hintHe: 'מה מילות הזמן בסוף המשפט אומרות על החלק השני?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'If Yoni were more careful, he would not have broken the vase.',
        wrong: [
          'If Yoni were more careful, he would not break the vase yesterday.',
          'If Yoni was more careful, he will not have broken the vase.',
        ],
        explainHe: 'תכונה קבועה (were more careful) ותוצאה בעבר: would not have + V3.',
        hintHe: 'האגרטל כבר נשבר. בדקו איזה מבנה מתאים לתוצאה שכבר קרתה.',
      },
    ],
    sentences: [
      { en: 'If I had learned to drive, I would not need rides now.', he: 'אילו הייתי לומד לנהוג, לא הייתי צריך טרמפים עכשיו.' },
      { en: 'If she were less shy, she would have sung at the party.', he: 'אילו הייתה פחות ביישנית, היא הייתה שרה במסיבה.' },
      { en: 'We would be famous if our song had won.', he: 'היינו מפורסמים עכשיו אילו השיר שלנו היה זוכה.' },
      { en: 'If he spoke Arabic, he would have helped the tourists.', he: 'אילו הוא דיבר ערבית, הוא היה עוזר לתיירים.' },
      { en: 'If they had planted trees, the street would be greener today.', he: 'אילו הם היו שותלים עצים, הרחוב היה ירוק יותר היום.' },
      { en: 'If I were braver, I would have tried bungee jumping.', he: 'אילו הייתי אמיץ יותר, הייתי מנסה קפיצת בנג׳י.' },
    ],
    passages: [
      {
        passageEn:
          'Hila has always been a cautious person. Three years ago, a friend invited her to start an online company together. Hila thought it was too risky, so she said no. Today the company has fifty workers and sells products all over the world. Hila sometimes thinks that if she had said yes, she would be a successful businesswoman now.',
        passageHe:
          'הילה תמיד הייתה אדם זהיר. לפני שלוש שנים חברה הזמינה אותה להקים יחד חברה מקוונת. הילה חשבה שזה מסוכן מדי, ולכן סירבה. היום בחברה יש חמישים עובדים והיא מוכרת מוצרים בכל העולם. לפעמים הילה חושבת שאילו הייתה מסכימה, היא הייתה היום אשת עסקים מצליחה.',
        questions: [
          {
            questionEn: 'Why did Hila say no to her friend?',
            questionHe: 'למה הילה סירבה לחברה שלה?',
            correct: 'She thought it was too risky.',
            wrong: ['She was busy with her studies.', 'She did not like her friend.'],
          },
          {
            questionEn: 'How many workers does the company have today?',
            questionHe: 'כמה עובדים יש בחברה היום?',
            correct: 'The company has fifty workers.',
            wrong: ['The company has five workers.', 'The company has five hundred workers.'],
          },
          {
            questionEn: 'What does Hila sometimes think?',
            questionHe: 'מה הילה חושבת לפעמים?',
            correct: 'If she had said yes, she would be a successful businesswoman.',
            wrong: ['If she had said no, she would be happier.', 'If she were braver, she would start a new company.'],
          },
        ],
      },
      {
        passageEn:
          'Historians love to imagine alternate versions of the past. For example, some ask what would be different if the printing press had never been invented. Without it, books would still be rare and expensive. Fewer people would know how to read, and science would probably have developed much more slowly. Such questions help students understand how one invention can change the trajectory of history.',
        passageHe:
          'היסטוריונים אוהבים לדמיין גרסאות חלופיות של העבר. לדוגמה, יש ששואלים מה היה שונה אילו מכונת הדפוס לא הייתה מומצאת מעולם. בלעדיה, ספרים היו עדיין נדירים ויקרים. פחות אנשים היו יודעים לקרוא, והמדע כנראה היה מתפתח לאט הרבה יותר. שאלות כאלה עוזרות לתלמידים להבין איך המצאה אחת יכולה לשנות את מסלול ההיסטוריה.',
        questions: [
          {
            questionEn: 'What would books be like without the printing press?',
            questionHe: 'איך היו נראים ספרים בלי מכונת הדפוס?',
            correct: 'They would still be rare and expensive.',
            wrong: ['They would be cheap and common.', 'They would be written only by scientists.'],
          },
          {
            questionEn: 'How would science probably have developed?',
            questionHe: 'איך המדע כנראה היה מתפתח?',
            correct: 'Science would have developed much more slowly.',
            wrong: ['Science would have developed much faster.', 'Science would not have changed at all.'],
          },
          {
            questionEn: 'What do such questions help students understand?',
            questionHe: 'מה עוזרות שאלות כאלה לתלמידים להבין?',
            correct: 'How one invention can change the trajectory of history.',
            wrong: ['How to invent a new printing machine.', 'Why historians prefer old books.'],
          },
        ],
      },
    ],
  },
  // Unit 22: paraphrasing and summarising
  22: {
    vocabulary: [
      {
        clozeEn: '"Huge" and "enormous" are a good example of a ____ pair.',
        clozeHe: '״Huge״ ו-״enormous״ הם דוגמה טובה לזוג של מילים נרדפות.',
        answer: 'synonym',
        wrong: ['verbatim', 'condense'],
      },
      {
        clozeEn: 'Instead of copying the sentence, write a ____ in your own words.',
        clozeHe: 'במקום להעתיק את המשפט, כתבו ניסוח מחדש במילים שלכם.',
        answer: 'paraphrase',
        wrong: ['redundant', 'omit'],
      },
      {
        clozeEn: 'A smile can ____ more than a long speech.',
        clozeHe: 'חיוך יכול להעביר יותר מנאום ארוך.',
        answer: 'convey',
        wrong: ['essence', 'concise'],
      },
      {
        clozeEn: 'The editor asked me to ____ my ten-page story into two pages.',
        clozeHe: 'העורך ביקש ממני לתמצת את הסיפור בן עשרת העמודים שלי לשני עמודים.',
        answer: 'condense',
        wrong: ['coherent', 'synonym'],
      },
      {
        clozeEn: 'Without clear connectors, the essay was not ____.',
        clozeHe: 'בלי מילות קישור ברורות, החיבור לא היה קוהרנטי.',
        answer: 'coherent',
        wrong: ['gist', 'convey'],
      },
      {
        clozeEn: 'Saying "free gift" is ____, since every gift is free.',
        clozeHe: 'לומר ״מתנה חינם״ זה מיותר, כי כל מתנה היא בחינם.',
        answer: 'redundant',
        wrong: ['paraphrase', 'equivalent'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which is the best paraphrase of "The storm destroyed many homes"?',
        correct: 'Many houses were ruined by the storm.',
        wrong: ['The storm destroyed many homes last night.', 'The storm did not damage any homes.'],
        explainHe: 'houses ו-ruined הן מילים נרדפות, והמבנה עבר לסביל. המשמעות נשארה זהה.',
        hintHe: 'פסלו את האפשרות שמעתיקה את המקור ואת האפשרות שמשנה את המשמעות.',
      },
      {
        questionEn: 'Which word form completes the paraphrase? "She decided to leave." — "She made the ____ to leave."',
        correct: 'decision',
        wrong: ['decide', 'decisive'],
        explainHe: 'אחרי made the צריך שם עצם: decision.',
        hintHe: 'איזה חלק דיבר בא אחרי made the?',
      },
      {
        questionEn: 'Which sentence is the main idea, not a detail?',
        correct: 'Social media changes the way teenagers communicate.',
        wrong: [
          'For instance, Roni sends about a hundred messages a day.',
          'One app was downloaded three million times in March.',
        ],
        explainHe: 'הרעיון המרכזי הוא טענה כללית. דוגמה אישית ונתון מספרי הם פרטים תומכים.',
        hintHe: 'איזה משפט אפשר להוכיח בעזרת שני המשפטים האחרים?',
      },
      {
        questionEn: 'Which sentence should be OMITTED from a summary?',
        correct: 'The writer, who lives in Haifa, enjoys long walks.',
        wrong: [
          'Plastic waste is a growing danger to sea animals.',
          'Governments must reduce the use of plastic bags.',
        ],
        explainHe: 'פרטים על הכותב אינם חלק מהרעיונות המרכזיים, ולכן משמיטים אותם מהסיכום.',
        hintHe: 'שני משפטים עוסקים בנושא הטקסט. איזה משפט עוסק בנושא צדדי?',
      },
      {
        questionEn: 'Which is the best paraphrase of "Few students passed the test"?',
        correct: 'Most students failed the exam.',
        wrong: ['A few students passed the test easily.', 'All the students did well on the exam.'],
        explainHe: 'few (מעטים) פירושו שרובם לא עברו. a few פירושו "כמה", וזה משנה את הדגש.',
        hintHe: 'שימו לב להבדל בין "מעטים" לבין "כמה": מה המשמעות של המשפט המקורי?',
      },
      {
        questionEn: 'Which phrase best opens a summary?',
        correct: 'The passage mainly describes',
        wrong: ['For example, in paragraph two', 'One small detail is that'],
        explainHe: 'סיכום פותח ברעיון הכללי של הקטע, ולא בדוגמה או בפרט.',
        hintHe: 'סיכום מתחיל מהתמונה הכללית. איזה ביטוי מוביל לרעיון כללי?',
      },
    ],
    sentences: [
      { en: 'A summary should be much shorter than the original text.', he: 'סיכום צריך להיות קצר בהרבה מהטקסט המקורי.' },
      { en: 'Good readers look for the same meaning in new words.', he: 'קוראים טובים מחפשים את אותה משמעות במילים חדשות.' },
      { en: 'Numbers and examples are usually left out of a summary.', he: 'מספרים ודוגמאות בדרך כלל לא נכנסים לסיכום.' },
      { en: 'The first sentence of a paragraph often states its main idea.', he: 'המשפט הראשון של פסקה מציג לעתים קרובות את הרעיון המרכזי שלה.' },
      { en: 'Try to explain the article to a friend in one minute.', he: 'נסו להסביר את המאמר לחבר בתוך דקה אחת.' },
      { en: 'Copying whole sentences is not the same as summarising.', he: 'העתקה של משפטים שלמים איננה סיכום.' },
    ],
    passages: [
      {
        passageEn:
          'Many teachers say that summarising is one of the most useful skills for the Bagrut. To write a summary, students first read the text to understand its general message. Then they underline the main idea of every paragraph and ignore the examples. Finally, they rewrite these ideas in their own words. Students who practise this method often read faster and remember more.',
        passageHe:
          'מורים רבים אומרים שסיכום הוא אחת המיומנויות השימושיות ביותר לבגרות. כדי לכתוב סיכום, התלמידים קוראים קודם את הטקסט כדי להבין את המסר הכללי שלו. אחר כך הם מסמנים את הרעיון המרכזי של כל פסקה ומתעלמים מהדוגמאות. לבסוף הם כותבים את הרעיונות האלה מחדש במילים שלהם. תלמידים שמתרגלים את השיטה הזו קוראים לעתים קרובות מהר יותר וזוכרים יותר.',
        questions: [
          {
            questionEn: 'What do students do first?',
            questionHe: 'מה התלמידים עושים קודם?',
            correct: 'They read the text to understand its general message.',
            wrong: ['They underline every example in the text.', 'They copy the first paragraph.'],
          },
          {
            questionEn: 'What do students ignore when they underline?',
            questionHe: 'ממה התלמידים מתעלמים כשהם מסמנים?',
            correct: 'They ignore the examples.',
            wrong: ['They ignore the main ideas.', 'They ignore the first paragraph.'],
          },
          {
            questionEn: 'What happens to students who practise this method?',
            questionHe: 'מה קורה לתלמידים שמתרגלים את השיטה הזו?',
            correct: 'They often read faster and remember more.',
            wrong: ['They often write longer essays.', 'They stop reading the examples.'],
          },
        ],
      },
      {
        passageEn:
          'A recent survey asked Israeli high school students how they prepare for reading exams. Most students said they read the questions before the text. About a third said they underline key words while reading. Only a few students said they check whether an answer is a paraphrase of the text. Teachers believe this last strategy deserves much more attention.',
        passageHe:
          'סקר שנערך לאחרונה שאל תלמידי תיכון בישראל איך הם מתכוננים למבחני קריאה. רוב התלמידים אמרו שהם קוראים את השאלות לפני הטקסט. כשליש אמרו שהם מסמנים מילות מפתח בזמן הקריאה. רק מעט תלמידים אמרו שהם בודקים אם תשובה היא פרפרזה של הטקסט. מורים מאמינים שהאסטרטגיה האחרונה הזו ראויה לתשומת לב רבה הרבה יותר.',
        questions: [
          {
            questionEn: 'What do most students do before reading the text?',
            questionHe: 'מה רוב התלמידים עושים לפני קריאת הטקסט?',
            correct: 'They read the questions before the text.',
            wrong: ['They underline key words.', 'They write a short summary.'],
          },
          {
            questionEn: 'How many students underline key words?',
            questionHe: 'כמה תלמידים מסמנים מילות מפתח?',
            correct: 'About a third of them.',
            wrong: ['Almost all of them.', 'Only a few of them.'],
          },
          {
            questionEn: 'Which strategy do teachers think deserves more attention?',
            questionHe: 'איזו אסטרטגיה ראויה לדעת המורים לתשומת לב רבה יותר?',
            correct: 'Checking whether an answer is a paraphrase of the text.',
            wrong: ['Reading the questions before the text.', 'Underlining key words while reading.'],
          },
        ],
      },
    ],
  },
};
