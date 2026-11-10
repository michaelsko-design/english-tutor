import { buildHighSchoolGrade, type HighSchoolUnitSpec } from '../../../highSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-3 grade 12 unit (Band III): Bagrut essay skills, with sequencing words and the
 * coordinating conjunctions used to build an argument, and Band III Core I (4-point) words the app
 * never had. Example Hebrew addresses the learner in the plural; hints and explanations are
 * gender-neutral plural.
 */
const UNIT_CORE_3: HighSchoolUnitSpec = {
  ...packUnitNumbers('core-3'),
  titleEn: 'Essay Skills',
  titleHe: 'כתיבת חיבור',
  subtitleHe:
    'עונה 3: כותבים חיבור לבגרות: מסדרים את הרעיונות עם first, then, finally, ומחברים אותם עם and, but, so, yet ו-or',
  badgeEmoji: '✍️',
  missions: [
    {
      icon: '📝',
      titleEn: 'First Things First: Sequencing an Essay',
      titleHe: 'קודם כול: סדר הרעיונות בחיבור',
      storyHookHe:
        'חיבור טוב בבגרות מוביל את הקורא צעד אחר צעד. נלמד מילות רצף: first of all, then, after that, finally, ונסכם בסוף עם to sum up.',
      grammarTopic: 'Sequencing in Essays (first of all, then, after that, finally)',
      skills: ['Sequencing', 'Essay Structure', 'Bagrut Writing'],
      sentenceEn: 'First of all, I will explain the problem, and then I will suggest a solution.',
      sentenceHe: 'קודם כול, אסביר את הבעיה, ואחר כך אציע פתרון.',
      vocab: [
        ['to start with', 'phrase', 'קודם כול / בתור התחלה', '🏁', 'To start with, school uniforms save families money.', 'קודם כול, תלבושת אחידה חוסכת למשפחות כסף.'],
        ['sum up', 'phrase', 'לסכם', '🧾', 'In the last paragraph, sum up your main points in two sentences.', 'בפסקה האחרונה, סכמו את הנקודות העיקריות שלכם בשני משפטים.'],
        ['particular', 'adjective', 'מסוים / מיוחד', '🔎', 'Each paragraph should focus on one particular idea.', 'כל פסקה צריכה להתמקד ברעיון מסוים אחד.'],
        ['among other things', 'phrase', 'בין היתר', '📚', 'Sport teaches, among other things, patience and teamwork.', 'ספורט מלמד, בין היתר, סבלנות ועבודת צוות.'],
        ['characteristic', 'noun', 'מאפיין / תכונה', '🧩', 'One characteristic of a good essay is a clear order of ideas.', 'אחד המאפיינים של חיבור טוב הוא סדר ברור של רעיונות.'],
        ['appropriate', 'adjective', 'מתאים / הולם', '👔', 'Slang is not appropriate in a formal essay.', 'סלנג לא מתאים לחיבור רשמי.'],
        ['more or less', 'phrase', 'פחות או יותר', '〰️', 'My first draft was more or less 200 words long.', 'הטיוטה הראשונה שלי הייתה באורך של פחות או יותר 200 מילים.'],
        ['necessarily', 'adverb', 'בהכרח', '❓', 'A longer essay is not necessarily a better essay.', 'חיבור ארוך יותר הוא לא בהכרח חיבור טוב יותר.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'walrus', translationHe: 'ניבתן' },
          { wordEn: 'thimble', translationHe: 'אצבעון' },
        ],
        shortSentenceEn: 'First, read the question.',
        shortSentenceHe: 'קודם, קראו את השאלה.',
        rule: {
          questionEn: 'Complete: "____, plan your ideas. Then write a draft. Finally, check your spelling."',
          correct: 'First',
          wrong: ['In conclusion', 'Finally'],
          explainHe:
            'הצעד הראשון ברצף נפתח ב-First (או First of all). Finally פותח את הצעד האחרון, ו-In conclusion פותח את הסיכום.',
          hintHe: 'זה הצעד הראשון מתוך שלושה. איזו מילה פותחת רצף?',
        },
        story: {
          passageEn:
            "Teachers who mark Bagrut essays often see the same problems. To start with, many students put their best idea in the last paragraph, where it is easy to miss. Then they repeat the same point twice. Finally, many essays stop without a conclusion. The teachers' advice is simple: plan before writing, give each paragraph one particular idea, and sum up the opinion at the end.",
          passageHe:
            'מורים שבודקים חיבורי בגרות רואים לעיתים קרובות את אותן בעיות. קודם כול, הרבה תלמידים שמים את הרעיון הכי טוב שלהם בפסקה האחרונה, שם קל לפספס אותו. אחר כך הם חוזרים על אותה נקודה פעמיים. לבסוף, הרבה חיבורים נגמרים בלי סיכום. העצה של המורים פשוטה: לתכנן לפני שכותבים, לתת לכל פסקה רעיון מסוים אחד, ולסכם את הדעה בסוף.',
          questionEn: 'Where do many students put their best idea?',
          questionHe: 'איפה הרבה תלמידים שמים את הרעיון הכי טוב שלהם?',
          correct: 'In the last paragraph.',
          wrong: ['In the title of the essay.', 'In the middle paragraph.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'First, we read. Then, we write.',
              wrong: ['Then, we read. First, we write.'],
              explainHe: 'First בא בהתחלה, ו-Then בא אחריו.',
              hintHe: 'איזו מילה פותחת את הרצף?',
            },
            story: {
              passageEn: 'Lia writes an essay. First, she makes a plan. Then she writes. Finally, she checks her spelling.',
              passageHe: 'ליה כותבת חיבור. קודם היא מכינה תוכנית. אחר כך היא כותבת. לבסוף היא בודקת את האיות.',
              questionEn: 'What does Lia do first?',
              questionHe: 'מה ליה עושה קודם?',
              correct: 'She makes a plan.',
              wrong: ['She checks her spelling.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['last night', 'long ago'],
              ['sneeze', 'melt'],
              ['hungry', 'wooden'],
              ['next door', 'long ago'],
              ['banana', 'umbrella'],
              ['hungry', 'rainy'],
              ['next door', 'good night'],
              ['yesterday', 'loudly'],
            ],
          },
          master: {
            sentenceEn: 'After that, give two examples, and finally, sum up your opinion.',
            sentenceHe: 'אחרי זה, תנו שתי דוגמאות, ולבסוף, סכמו את הדעה שלכם.',
            decoys: ['first', 'then'],
            voiceEn: 'To begin with, let me explain the problem.',
            voiceHe: 'בתור התחלה, הרשו לי להסביר את הבעיה.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'First, I will describe the problem. After that, I will offer a solution.',
              wrong: [
                'First, I will describe the problem. After, I will offer a solution.',
                'Firstly of all, I will describe the problem. After that, I will offer a solution.',
                'At first, I will describe the problem. After that, I will offer a solution.',
              ],
              explainHe:
                'בחיבור כותבים First או First of all, לא Firstly of all ולא At first (שפירושו "בהתחלה, ואחר כך זה השתנה"). After לבד לא פותח משפט כזה; כותבים After that.',
              hintEn: 'Check each sequencing word at the start of a sentence.',
            },
            story: {
              passageEn:
                'For her Bagrut practice essay, Tal had to answer the question "Should homework be banned?" Her first draft was full of good ideas, but her teacher gave it a low mark. The ideas were in a random order: an example came before the argument it supported, and the conclusion appeared in the middle. Tal did not add a single new idea. She simply reorganized the paragraphs, opened each one with a sequencing word and ended with a clear summary. Her second draft received one of the highest marks in the class.',
              passageHe: '',
              questionEn: "What does the story suggest about Tal's first draft?",
              questionHe: '',
              correct: 'Its order was the main problem.',
              wrong: ['It had too many spelling mistakes.', 'It answered a different question.', 'It was much too short for the Bagrut.'],
            },
            storyHintEn: 'What did Tal change, and what did she not change?',
          },
        },
      },
    },
    {
      icon: '🔗',
      titleEn: 'Linking Ideas: And, But, So, Yet, Or',
      titleHe: 'מחברים רעיונות: and, but, so, yet, or',
      storyHookHe:
        'בחיבור טוב הרעיונות מחוברים זה לזה. נלמד לחבר שני משפטים עם מילות קישור: and, but, or, so, yet, ונשים פסיק לפניהן כשהמשפטים ארוכים.',
      grammarTopic: 'Coordinating Conjunctions in Essays (and, but, or, so, yet)',
      skills: ['Coordinating Conjunctions', 'Linking Arguments', 'Bagrut Writing'],
      sentenceEn: 'Phones help students learn, but they can also distract them in class.',
      sentenceHe: 'טלפונים עוזרים לתלמידים ללמוד, אבל הם גם יכולים להסיח את דעתם בכיתה.',
      vocab: [
        ['even if', 'phrase', 'גם אם', '🤔', 'Even if homework is boring, it helps us remember the lesson.', 'גם אם שיעורי הבית משעממים, הם עוזרים לנו לזכור את השיעור.'],
        ['except that', 'phrase', 'אלא ש... / חוץ מזה ש...', '➖', 'The plan is good, except that it costs too much.', 'התוכנית טובה, אלא שהיא עולה יותר מדי.'],
        ['exception', 'noun', 'יוצא מן הכלל / חריג', '⚠️', 'Phones are not allowed in class, and there is no exception.', 'טלפונים אסורים בכיתה, ואין יוצא מן הכלל.'],
        ['in that case', 'phrase', 'במקרה כזה', '👉', 'Some students cannot afford a laptop, so in that case the school should lend one.', 'יש תלמידים שאין להם כסף למחשב נייד, ובמקרה כזה בית הספר צריך להשאיל להם אחד.'],
        ['impression', 'noun', 'רושם', '✨', 'A clear first paragraph makes a good impression on the reader.', 'פסקה ראשונה ברורה עושה רושם טוב על הקורא.'],
        ['interaction', 'noun', 'קשר בין אנשים / אינטראקציה', '💬', 'Online classes are useful, yet they offer little real interaction.', 'שיעורים מקוונים שימושיים, ובכל זאת יש בהם מעט קשר אמיתי בין אנשים.'],
        ['limited', 'adjective', 'מוגבל', '⏱️', 'Time in the exam is limited, so plan your essay quickly.', 'הזמן במבחן מוגבל, אז תכננו את החיבור שלכם מהר.'],
        ['seldom', 'adverb', 'לעיתים רחוקות', '🐌', 'Good writers seldom use the same linking word twice in a row.', 'כותבים טובים משתמשים לעיתים רחוקות באותה מילת קישור פעמיים ברצף.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'pelican', translationHe: 'שקנאי' },
          { wordEn: 'anvil', translationHe: 'סדן' },
        ],
        shortSentenceEn: 'It was late, so we left.',
        shortSentenceHe: 'היה מאוחר, אז הלכנו.',
        rule: {
          questionEn: 'Complete: "The test was very hard, ____ most students passed it."',
          correct: 'yet',
          wrong: ['so', 'and so'],
          explainHe: 'שני החלקים מנוגדים (קשה, ובכל זאת עברו), ולכן yet (או but). so ו-and so מציגים תוצאה, וכאן אין תוצאה.',
          hintHe: 'האם החלק השני הוא תוצאה של החלק הראשון, או ניגוד לו?',
        },
        story: {
          passageEn:
            'In a class debate about school phones, Yoni argued that phones should be banned during lessons. He admitted that phones can be useful, but he said that students seldom use them for learning in class. Maya disagreed. She said that phones are a good tool, yet teachers need clear rules for them. In the end, the class voted for a compromise: phones stay in bags, except that the teacher can allow them for a particular task.',
          passageHe:
            'בוויכוח כיתתי על טלפונים בבית הספר, יוני טען שצריך לאסור טלפונים בזמן השיעורים. הוא הודה שטלפונים יכולים להיות שימושיים, אבל אמר שתלמידים משתמשים בהם ללמידה בכיתה לעיתים רחוקות. מאיה לא הסכימה. היא אמרה שטלפונים הם כלי טוב, ובכל זאת המורים צריכים כללים ברורים לגביהם. בסוף, הכיתה הצביעה בעד פשרה: הטלפונים נשארים בתיקים, אלא שהמורה יכול להתיר אותם למשימה מסוימת.',
          questionEn: 'What did the class decide?',
          questionHe: 'מה הכיתה החליטה?',
          correct: 'Phones stay in bags most of the time.',
          wrong: ['Phones are banned from the school building.', 'Every student must use a phone in class.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'I was tired, so I went to bed.',
              wrong: ['I was tired, but I went to bed.'],
              explainHe: 'הלכתי לישון בגלל העייפות: זו תוצאה, ולכן so.',
              hintHe: 'האם החלק השני הוא תוצאה או ניגוד?',
            },
            story: {
              passageEn: 'Ron wanted to play outside, but it was raining. So he stayed home and read a book.',
              passageHe: 'רון רצה לשחק בחוץ, אבל ירד גשם. אז הוא נשאר בבית וקרא ספר.',
              questionEn: 'Why did Ron stay home?',
              questionHe: 'למה רון נשאר בבית?',
              correct: 'It was raining.',
              wrong: ['He was sick.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['next door', 'last night'],
              ['good night', 'next door'],
              ['carrot', 'ceiling'],
              ['long ago', 'last night'],
              ['sandwich', 'giraffe'],
              ['furniture', 'thunder'],
              ['delicious', 'wooden'],
              ['yesterday', 'loudly'],
            ],
          },
          master: {
            sentenceEn: 'The idea is interesting, yet it is not realistic, so we should change it.',
            sentenceHe: 'הרעיון מעניין, ובכל זאת הוא לא מציאותי, אז כדאי שנשנה אותו.',
            decoys: ['but', 'because'],
            voiceEn: 'We can take the bus, or we can walk.',
            voiceHe: 'אפשר לנסוע באוטובוס, או שאפשר ללכת ברגל.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'Many teenagers love social media, but they also worry about their privacy.',
              wrong: [
                'Many teenagers love social media, so they also worry about their privacy.',
                'Many teenagers love social media, or they also worry about their privacy.',
                'Many teenagers love social media, and yet but they also worry about their privacy.',
              ],
              explainHe:
                'החלק השני מציג ניגוד לחלק הראשון, ולכן but. so מציג תוצאה, or מציג אפשרות, ולא שמים שתי מילות ניגוד יחד.',
              hintEn: 'How is the second idea related to the first one?',
            },
            story: {
              passageEn:
                'In her Bagrut essay about volunteering, Shani wrote short, simple sentences: "Volunteering is good. It takes time. Students are busy. They should still volunteer." Her teacher said that the ideas were fine, yet the essay sounded like a list. Shani rewrote it: "Volunteering takes time, and students are busy, but they should still volunteer, so schools should give them credit for it." The new version was shorter, but the teacher said it finally sounded like an argument.',
              passageHe: '',
              questionEn: 'Why did the teacher like the new version better?',
              questionHe: '',
              correct: 'The ideas were connected.',
              wrong: ['It was much longer than the first one.', 'It used more difficult vocabulary words.', 'It did not mention volunteering at all.'],
            },
            storyHintEn: 'Compare the two versions of the essay.',
          },
        },
      },
    },
    {
      icon: '🎓',
      isBoss: true,
      titleEn: 'Boss: The Bagrut Essay',
      titleHe: 'אתגר הבוס: חיבור הבגרות',
      storyHookHe:
        'אתגר הבוס! כתבו חיבור דעה שלם: פתיחה, טיעונים מסודרים במילות רצף, רעיונות מחוברים במילות קישור וסיכום ברור.',
      grammarTopic: 'Review: Sequencing and Coordinating in Bagrut Writing',
      skills: ['Boss Challenge', 'Opinion Essay', 'Sequencing & Linking'],
      sentenceEn: 'To sum up, social media has many benefits, but we must use it wisely.',
      sentenceHe: 'לסיכום, לרשתות החברתיות יש הרבה יתרונות, אבל אנחנו חייבים להשתמש בהן בחוכמה.',
      vocab: [
        ['the main thing', 'phrase', 'העיקר / הדבר החשוב ביותר', '⭐', 'The main thing in an essay is a clear opinion.', 'העיקר בחיבור הוא דעה ברורה.'],
        ['wealth', 'noun', 'עושר', '💎', 'Wealth does not always bring happiness, yet many people want it.', 'עושר לא תמיד מביא אושר, ובכל זאת הרבה אנשים רוצים אותו.'],
        ['barrier', 'noun', 'מחסום', '🚧', 'Language can be a barrier, but technology helps people understand each other.', 'שפה יכולה להיות מחסום, אבל הטכנולוגיה עוזרת לאנשים להבין זה את זה.'],
        ['sensitive', 'adjective', 'רגיש', '🫶', 'Teenagers are sensitive to comments, so online bullying can hurt them badly.', 'בני נוער רגישים להערות, ולכן בריונות ברשת יכולה לפגוע בהם מאוד.'],
        ['aggressive', 'adjective', 'תוקפני / אגרסיבי', '😠', 'Some online comments are aggressive, and many users simply stop reading.', 'חלק מהתגובות ברשת תוקפניות, והרבה משתמשים פשוט מפסיקים לקרוא.'],
        ['acquire', 'verb', 'לרכוש (ידע, מיומנות)', '🎓', 'Students acquire new skills when they work on real projects.', 'תלמידים רוכשים מיומנויות חדשות כשהם עובדים על פרויקטים אמיתיים.'],
        ['whatever', 'pronoun', 'מה ש... / לא משנה מה', '🤷', 'Whatever you decide, explain your reasons clearly.', 'מה שלא תחליטו, הסבירו את הסיבות שלכם בבירור.'],
        ['thanks to', 'phrase', 'בזכות', '🙏', 'Thanks to the internet, students can learn almost anything.', 'בזכות האינטרנט, תלמידים יכולים ללמוד כמעט כל דבר.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'harpoon', translationHe: 'צלצל' },
          { wordEn: 'acorn', translationHe: 'בלוט' },
        ],
        shortSentenceEn: 'To sum up, we agree.',
        shortSentenceHe: 'לסיכום, אנחנו מסכימים.',
        rule: {
          questionEn: 'Complete: "First, homework teaches responsibility. ____, it helps students prepare for tests."',
          correct: 'Second',
          wrong: ['To conclude', 'In conclusion'],
          explainHe: 'זה הטיעון השני ברשימה, ולכן Second. To conclude ו-In conclusion פותחים את הסיכום, לא טיעון חדש.',
          hintHe: 'האם המשפט מוסיף טיעון חדש או מסכם את החיבור?',
        },
        story: {
          passageEn:
            'For the Boss task, Omer wrote an opinion essay on the question "Is social media good for teenagers?" To start with, he gave his opinion clearly: social media has benefits, but it also has dangers. Then he wrote one paragraph about learning and friendship and another about aggressive comments and sensitive teenagers. Finally, he summed up both sides and suggested that schools teach safe online habits. His teacher said that the main thing she liked was the clear order.',
          passageHe:
            'לאתגר הבוס, עומר כתב חיבור דעה על השאלה "האם הרשתות החברתיות טובות לבני נוער?" קודם כול, הוא הציג את דעתו בבירור: לרשתות החברתיות יש יתרונות, אבל יש להן גם סכנות. אחר כך הוא כתב פסקה אחת על למידה וחברות, ועוד פסקה על תגובות תוקפניות ובני נוער רגישים. לבסוף, הוא סיכם את שני הצדדים והציע שבתי הספר ילמדו הרגלים בטוחים ברשת. המורה שלו אמרה שהדבר העיקרי שאהבה הוא הסדר הברור.',
          questionEn: 'What did Omer suggest at the end?',
          questionHe: 'מה עומר הציע בסוף?',
          correct: 'Teaching safe online habits.',
          wrong: ['Closing all social media for teenagers.', 'Reading every message on the phone.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'It was cold, but we swam.',
              wrong: ['It was cold, so we swam.'],
              explainHe: 'לשחות בקור זה ניגוד, ולכן but.',
              hintHe: 'האם השחייה היא תוצאה של הקור או ניגוד לו?',
            },
            story: {
              passageEn: 'Dana wrote an essay. First, she wrote her opinion. Then she gave two reasons. Finally, she wrote an ending.',
              passageHe: 'דנה כתבה חיבור. קודם היא כתבה את דעתה. אחר כך היא נתנה שתי סיבות. לבסוף היא כתבה סיום.',
              questionEn: 'What did Dana write first?',
              questionHe: 'מה דנה כתבה קודם?',
              correct: 'Her opinion.',
              wrong: ['Two reasons.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['last night', 'next door'],
              ['thunder', 'dust'],
              ['carrot', 'pillow'],
              ['wooden', 'delicious'],
              ['triangular', 'juicy'],
              ['sneeze', 'bake'],
              ['yesterday', 'nobody'],
              ['good night', 'happy birthday'],
            ],
          },
          master: {
            sentenceEn: 'Thanks to the internet, students can find information quickly, but they must check it.',
            sentenceHe: 'בזכות האינטרנט, תלמידים יכולים למצוא מידע מהר, אבל הם חייבים לבדוק אותו.',
            decoys: ['so', 'because'],
            voiceEn: 'Finally, I would like to thank my teachers.',
            voiceHe: 'לבסוף, אני רוצה להודות למורים שלי.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'In conclusion, social media can help us, but it can also hurt us.',
              wrong: [
                'In conclusion, social media can help us, so it can also hurt us.',
                'In the conclusion, social media can help us, but it can also hurt us.',
                'In conclusion, social media can help us, but also it can hurt also us.',
              ],
              explainHe: 'בסיכום כותבים In conclusion, בלי the. החלק השני מנוגד לראשון, ולכן but ולא so. also בא פעם אחת, לפני הפועל.',
              hintEn: 'Check the opening phrase, the linking word and the word order.',
            },
            story: {
              passageEn:
                "Two students, Adi and Ben, wrote essays about whether schools should start later in the morning. Adi had excellent arguments, but she wrote them in one long paragraph without any linking words. Ben's arguments were simpler, yet each paragraph began with a clear sequencing word and ended by connecting to the next idea. When the essays were read aloud to the class, most students could remember Ben's three reasons, while almost nobody could repeat Adi's.",
              passageHe: '',
              questionEn: 'What is the main lesson of the story?',
              questionHe: '',
              correct: 'Clear structure helps readers remember.',
              wrong: [
                'Long paragraphs always get higher marks.',
                'Schools should start later in the morning.',
                'Good arguments matter more than anything.',
              ],
            },
            storyHintEn: "Why could the class remember Ben's reasons?",
          },
        },
      },
    },
  ],
};

/** The core-3 pack's grade 12 unit (`../../registry.ts`) */
export const CORE_3_GRADE_12_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildHighSchoolGrade('grade-12', [UNIT_CORE_3]);
