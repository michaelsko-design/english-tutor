import { buildMiddleSchoolGrade } from './builder';

/**
 * Grade 9 — Band III Entry & High School Transition:
 * Present Perfect review vs. Past Simple, Second Conditional (If + V2, would + base),
 * Contrast Connectors (Although, However, In contrast), Passive Voice (Present & Past Simple),
 * Relative Clauses (who, which, that), and High School Readiness.
 * 4 units × 3 missions = 12 missions (the 3rd mission of each unit is a Boss review).
 * Hebrew copy is gender-neutral (uses slash forms such as "בוחר/ת" and plural phrasing).
 */
export const grade9Curriculum = buildMiddleSchoolGrade('grade-9', [
  {
    titleEn: 'Unit 1: Future Innovators & Teen Podcast',
    titleHe: 'פרק 1: יזמים צעירים והפודקאסט העולמי',
    subtitleHe: 'Present Perfect מול Past Simple, שימוש ב-Since/For, Just ו-Already באולפן ההקלטות',
    badgeEmoji: '🚀',
    missions: [
      {
        icon: '🎙️',
        titleEn: 'Recording Our First Global Episode',
        titleHe: 'הקלטת הפרק הבינלאומי הראשון שלנו',
        storyHookHe: 'איך מתארים הישגים שכבר השגנו בחיים (Present Perfect) ומשתפים חוויות מול קהל מאזינים רחב?',
        grammarTopic: 'Present Perfect (Have/Has + V3) with Already & Just',
        skills: ['Present Perfect', 'Podcast Speaking', 'Innovation Vocab'],
        sentenceEn: 'We have already interviewed three young inventors this month!',
        sentenceHe: 'כבר ראיינו שלושה ממציאים צעירים החודש!',
        vocab: [
          ['opportunity', 'noun', 'הזדמנות', '🚪', 'This podcast gives teens an opportunity to speak.', 'הפודקאסט הזה נותן לבני נוער הזדמנות לדבר.'],
          ['confident', 'adjective', 'בעל/ת ביטחון עצמי', '🦁', 'Practice makes you feel more confident when speaking.', 'תרגול גורם לך להרגיש יותר בטוח/ה בעצמך בדיבור.'],
          ['achievement', 'noun', 'הישג', '🏆', 'Winning the robotics contest was a major achievement.', 'הזכייה בתחרות הרובוטיקה הייתה הישג משמעותי.'],
          ['interview', 'verb / noun', 'לראיין / ראיון', '🎤', 'Today we interview a sixteen-year-old developer.', 'היום אנחנו מראיינים מפתח בן שש עשרה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'tradition', translationHe: 'מסורת' },
            { wordEn: 'disadvantage', translationHe: 'חיסרון' },
          ],
          shortSentenceEn: 'We have interviewed young inventors.',
          shortSentenceHe: 'ראיינו ממציאים צעירים.',
          rule: {
            questionEn: 'Which sentence correctly uses the Present Perfect with "already"?',
            correct: 'She has already finished editing the audio file.',
            wrong: [
              'She has already finish editing the audio file.',
              'She is already finished editing the audio file.',
            ],
            explainHe: 'ב-Present Perfect משתמשים ב-has/have ואחריו V3 (finished). לא משתמשים ב-is.',
          },
          story: {
            passageEn:
              'Maya and her team host a weekly technology podcast for teens. Over the last four weeks, they have interviewed three young entrepreneurs from Israel, Sweden, and Canada. Each guest shared practical tips on coding and leadership. The show has already reached ten thousand active listeners.',
            passageHe:
              'מאיה והצוות שלה מנחים פודקאסט טכנולוגי שבועי לבני נוער. בארבעת השבועות האחרונים, הם ראיינו שלושה יזמים צעירים מישראל, שוודיה וקנדה. כל אורח חלק טיפים מעשיים על תכנות ומנהיגות. התוכנית כבר הגיעה לעשרת אלפים מאזינים פעילים.',
            questionEn: 'How many young entrepreneurs did the team interview?',
            questionHe: 'כמה יזמים צעירים ראיין הצוות?',
            correct: 'Three young entrepreneurs.',
            wrong: [
              'Ten young entrepreneurs.',
              'Only one local student.',
            ],
          },
        },
      },
      {
        icon: '🎧',
        titleEn: 'Soundtrack of Success: Edits & Deadlines',
        titleHe: 'פסקול של הצלחה: עריכות ולוחות זמנים',
        storyHookHe: 'ההקלטה הסתיימה ועכשיו הלחץ עולה בחדר העריכה! נלמד להשתמש ב-Since (מנקודת זמן) וב-For (למשך תקופת זמן).',
        grammarTopic: 'Present Perfect with Since and For',
        skills: ['Since vs. For', 'Production Vocab', 'Time Expressions'],
        sentenceEn: 'Our sound engineer has worked on this track for five hours without a break.',
        sentenceHe: 'טכנאי הקול שלנו עבד על הקטע הזה במשך חמש שעות ללא הפסקה.',
        vocab: [
          ['equipment', 'noun', 'ציוד', '🎛️', 'The studio bought high-quality audio equipment.', 'האולפן קנה ציוד אודיו באיכות גבוהה.'],
          ['broadcast', 'verb / noun', 'לשדר / שידור', '📡', 'The radio station broadcasts international news.', 'תחנת הרדיו משדרת חדשות בינלאומיות.'],
          ['production', 'noun', 'הפקה', '🎬', 'Digital music production requires creative vision.', 'הפקת מוזיקה דיגיטלית דורשת חזון יצירתי.'],
          ['listener', 'noun', 'מאזין / מאזינה', '🎧', 'Every listener can send questions via our app.', 'כל מאזין/ה יכול/ה לשלוח שאלות דרך האפליקציה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'passenger', translationHe: 'נוסע' },
            { wordEn: 'customer', translationHe: 'לקוח' },
          ],
          shortSentenceEn: 'He has worked for hours.',
          shortSentenceHe: 'הוא עבד במשך שעות.',
          rule: {
            questionEn: 'Choose the correct preposition: "I have known him _______ 2021."',
            correct: 'since',
            wrong: [
              'for',
              'during',
            ],
            explainHe: 'כאשר מציינים נקודת זמן ספציפית בעבר (כמו שנת 2021) משתמשים ב-since. המילה for משמשת למשך זמן (for three years).',
          },
          story: {
            passageEn:
              'Tal has managed the podcast soundboard since the beginning of eighth grade. Today he has been in the studio for six hours straight. He just completed mixing the background music. "The audio sounds crisp and ready for release," he told the producers.',
            passageHe:
              'טל מנהל את לוח הקול של הפודקאסט מאז תחילת כיתה ח׳. היום הוא נמצא באולפן במשך שש שעות רצופות. הוא בדיוק השלים את עריכת מוזיקת הרקע. "האודיו נשמע חד ומוכן להפצה," אמר למפיקים.',
            questionEn: 'Since when has Tal managed the podcast soundboard?',
            questionHe: 'מאז מתי טל מנהל את לוח הקול של הפודקאסט?',
            correct: 'Since the beginning of eighth grade.',
            wrong: [
              'Since yesterday morning.',
              'For only six days.',
            ],
          },
        },
      },
      {
        icon: '🌟',
        isBoss: true,
        titleEn: 'Boss: Live Studio Broadcast Challenge',
        titleHe: 'אתגר הבוס: שידור חי מהאולפן',
        storyHookHe: 'אתגר בוס לפרק 1: שידור פודקאסט חי מול אלפי מאזינים! שילוב של Present Perfect, Past Simple ושאלות עומק.',
        grammarTopic: 'Review: Present Perfect & Past Simple in Media Production',
        skills: ['Boss Challenge', 'Media Fluency', 'Tense Switching'],
        sentenceEn: 'We have produced twelve episodes, but yesterday was our most inspiring live broadcast.',
        sentenceHe: 'הפקנו שנים עשר פרקים, אך אתמול היה השידור החי מעורר ההשראה ביותר שלנו.',
        vocab: [
          ['audience', 'noun', 'קהל מאזינים / צופים', '👥', 'The online audience submitted brilliant questions.', 'הקהל המקוון שלח שאלות מבריקות.'],
          ['professional', 'adjective', 'מקצועי / מקצועית', '💼', 'She gave a very professional presentation.', 'היא נתנה מצגת מקצועית מאוד.'],
          ['feedback', 'noun', 'משוב', '📝', 'Constructive feedback helps creators improve.', 'משוב בונה עוזר ליוצרים להשתפר.'],
          ['publish', 'verb', 'לפרסם / להוציא לאור', '📰', 'They will publish the interview on Monday.', 'הם יפרסמו את הראיון ביום שני.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'criticism', translationHe: 'ביקורת' },
            { wordEn: 'permission', translationHe: 'רשות' },
          ],
          shortSentenceEn: 'The audience asked great questions.',
          shortSentenceHe: 'הקהל שאל שאלות מעולות.',
          rule: {
            questionEn: 'Which sentence correctly distinguishes between a past time and an open timeframe?',
            correct: 'We have recorded three interviews this week, and we recorded one yesterday.',
            wrong: [
              'We recorded three interviews this week, and we have recorded one yesterday.',
              'We have recorded three interviews this week, and we have recorded one yesterday too.',
            ],
            explainHe: 'כשיש ציון זמן סגור בעבר (yesterday) חייבים Past Simple (recorded). כשהשבוע עוד נמשך (this week) נשתמש ב-Present Perfect.',
          },
          story: {
            passageEn:
              'Last night, the Teen Innovators podcast went live for the first time. Over five thousand students joined the stream from around the globe. The guest, a seventeen-year-old climate activist, explained how green technology has evolved recently. After the episode ended, the hosts received overwhelmingly positive feedback from the worldwide audience.',
            passageHe:
              'אמש, הפודקאסט "יזמים צעירים" שודר בשידור חי בפעם הראשונה. מעל חמשת אלפים תלמידים הצטרפו לשידור מכל רחבי העולם. האורחת, פעילת אקלים בת שבע עשרה, הסבירה כיצד טכנולוגיה ירוקה התפתחה לאחרונה. לאחר סיום הפרק, המנחים קיבלו משוב חיובי באופן גורף מהקהל העולמי.',
            questionEn: 'What feedback did the podcast hosts receive after the live broadcast?',
            questionHe: 'איזה משוב קיבלו מנחי הפודקאסט לאחר השידור החי?',
            correct: 'Overwhelmingly positive feedback.',
            wrong: [
              'Negative reviews from teachers.',
              'No response from the listeners.',
            ],
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 2: The AI Revolution & Debate Club',
    titleHe: 'פרק 2: מהפכת הבינה המלאכותית ומועדון הדיבייט',
    subtitleHe: 'Second Conditional (If + Past Simple, would), מילות קישור של ניגוד ואתיקה דיגיטלית',
    badgeEmoji: '🤖',
    missions: [
      {
        icon: '💡',
        titleEn: 'Debating the Future: If We Built a Robot',
        titleHe: 'מדברים על העתיד: אילו בנינו רובוט',
        storyHookHe: 'מועדון הדיבייט של בית הספר דן בהשפעות ה-AI על העתיד! נלמד להביע דעה ולשער השערות היפותטיות בעזרת תנאי שני.',
        grammarTopic: 'Second Conditional (If + Past Simple, Would + Base Verb)',
        skills: ['Second Conditional', 'Debate Vocabulary', 'Hypothetical Thinking'],
        sentenceEn: 'If I had enough resources, I would develop an AI assistant for education.',
        sentenceHe: 'אילו היו לי מספיק משאבים, הייתי מפתח/ת עוזר בינה מלאכותית לחינוך.',
        vocab: [
          ['artificial', 'adjective', 'מלאכותי', '🤖', 'Artificial intelligence helps doctors diagnose diseases.', 'בינה מלאכותית עוזרת לרופאים לאבחן מחלות.'],
          ['influence', 'verb / noun', 'להשפיע / השפעה', '🌊', 'Technology has a deep influence on daily life.', 'לטכנולוגיה יש השפעה עמוקה על חיי היומיום.'],
          ['perspective', 'noun', 'נקודת מבט / השקפה', '👓', 'Travel opens your mind to new perspectives.', 'מסעות פותחים את המחשבה לנקודות מבט חדשות.'],
          ['debate', 'verb / noun', 'לדון / דיבייט', '🗣️', 'The students debate climate policies passionately.', 'התלמידים מנהלים דיבייט על מדיניות אקלים בלהט.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'destruction', translationHe: 'הרס' },
            { wordEn: 'coincidence', translationHe: 'צירוף מקרים' },
          ],
          shortSentenceEn: 'I would build a robot.',
          shortSentenceHe: 'הייתי בונה רובוט.',
          rule: {
            questionEn: 'Which sentence correctly follows the Second Conditional?',
            correct: 'If we had a laboratory robot, we would finish experiments faster.',
            wrong: [
              'If we will have a laboratory robot, we would finish experiments faster.',
              'If we have a laboratory robot, we would finished experiments faster.',
            ],
            explainHe: 'בתנאי שני למצבים היפותטיים בהווה: בחלק ה-If משתמשים ב-Past Simple (had), ובחלק התוצאה ב-would + פועל מקור.',
          },
          story: {
            passageEn:
              'In the weekly debate tournament, Yarden argued for assistive technology in hospitals. "If every senior citizen had a personal robotic companion, loneliness would decrease dramatically," she stated. Her opponent agreed that robotics offers great assistance, but warned about human contact.',
            passageHe:
              'בטורניר הדיבייט השבועי, ירדן טענה בעד טכנולוגיה מסייעת בבתי חולים. "אילו לכל אזרח ותיק היה מלווה רובוטי אישי, הבדידות הייתה פוחתת באופן דרמטי," הצהירה. יריבה הסכים שרובוטיקה מציעה עזרה נהדרת, אך הזהיר מפני אובדן מגע אנושי.',
            questionEn: 'What hypothetical benefit did Yarden mention in her argument?',
            questionHe: 'איזה יתרון היפותטי הזכירה ירדן בטיעון שלה?',
            correct: 'Loneliness would decrease dramatically.',
            wrong: [
              'Hospitals would close completely.',
              'Medicine would become free for all.',
            ],
          },
        },
      },
      {
        icon: '⚖️',
        titleEn: 'Ethics in the Digital Age',
        titleHe: 'אתיקה בעידן הדיגיטלי',
        storyHookHe: 'האם מותר ל-AI לכתוב שירים או להחליט החלטות שיפוטיות? נלמד מילות קישור של ניגוד: Although, However ו-In contrast.',
        grammarTopic: 'Connectors of Contrast (Although, However, In contrast)',
        skills: ['Contrast Connectors', 'Ethics Vocab', 'Argument Structure'],
        sentenceEn: 'Although technology evolves rapidly, human empathy remains completely irreplaceable.',
        sentenceHe: 'למרות שהטכנולוגיה מתפתחת במהירות, אמפתיה אנושית נשארת בלתי ניתנת להחלפה.',
        vocab: [
          ['ethical', 'adjective', 'אתי / מוסרי', '⚖️', 'Engineers face difficult ethical decisions.', 'מהנדסים מתמודדים עם החלטות אתיות קשות.'],
          ['advantage', 'noun', 'יתרון', '➕', 'Fast processing speed is a great advantage of computers.', 'מהירות עיבוד גבוהה היא יתרון גדול של מחשבים.'],
          ['privacy', 'noun', 'פרטיות', '🔒', 'Protecting user privacy is essential for online safety.', 'הגנה על פרטיות המשתמש חיונית לבטיחות ברשת.'],
          ['technology', 'noun', 'טכנולוגיה', '💻', 'Modern technology connects people worldwide.', 'טכנולוגיה מודרנית מחברת אנשים ברחבי העולם.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'punishment', translationHe: 'עונש' },
            { wordEn: 'celebration', translationHe: 'חגיגה' },
          ],
          shortSentenceEn: 'Human empathy remains irreplaceable.',
          shortSentenceHe: 'אמפתיה אנושית נשארת חיונית.',
          rule: {
            questionEn: 'Which sentence uses "although" with proper punctuation and grammar?',
            correct: 'Although the algorithm was fast, it made several factual mistakes.',
            wrong: [
              'Although the algorithm was fast, but it made several mistakes.',
              'The algorithm was fast, although it made not mistakes.',
            ],
            explainHe: 'כאשר פותחים משפט עם Although (למרות ש...), אין להוסיף את המילה but במשפט המשני.',
          },
          story: {
            passageEn:
              'The school ethics panel discussed generative software in modern education. "Although artificial intelligence can write coherent essays, it lacks personal emotional experience," argued Dan. "However, teachers can utilize it to design customized grammar drills for struggling pupils." The principal agreed that balance is essential.',
            passageHe:
              'פאנל האתיקה של בית הספר דן בתוכנות יוצרות בחינוך המודרני. "למרות שבינה מלאכותית יכולה לכתוב חיבורים קוהרנטיים, חסר לה ניסיון רגשי אישי," טען דן. "עם זאת, מורים יכולים לנצל אותה כדי לעצב תרגילי דקדוק מותאמים אישית לתלמידים מתקשים." המנהלת הסכימה שאיזון הוא חיוני.',
            questionEn: 'What key human quality does Dan claim artificial intelligence lacks?',
            questionHe: 'איזו תכונה אנושית מרכזית דן טוען שחסרה לבינה מלאכותית?',
            correct: 'Personal emotional experience.',
            wrong: [
              'Mathematical calculation power.',
              'Internet connectivity speed.',
            ],
          },
        },
      },
      {
        icon: '🏆',
        isBoss: true,
        titleEn: 'Boss: World Championship Teen Debate',
        titleHe: 'אתגר הבוס: אליפות הדיבייט העולמית לנוער',
        storyHookHe: 'אתגר בוס לפרק 2: גמר אליפות הדיבייט הבינלאומית! שליטה במבנה התנאי השני, מילות קישור רטוריות וטיעונים משכנעים.',
        grammarTopic: 'Review: Second Conditional & Advanced Rhetorical Argumentation',
        skills: ['Boss Challenge', 'Persuasion Skills', 'Debate Mastery'],
        sentenceEn: 'If society invested more in youth research, we would solve environmental crises much faster.',
        sentenceHe: 'אילו החברה הייתה משקיעה יותר במחקר נוער, היינו פותרים משברים סביבתיים הרבה יותר מהר.',
        vocab: [
          ['argument', 'noun', 'טיעון / נימוק', '💬', 'Her strong argument convinced the debate judges.', 'הטיעון החזק שלה שכנע את שופטי הדיבייט.'],
          ['convince', 'verb', 'לשכנע', '🤝', 'He managed to convince the committee with factual data.', 'הוא הצליח לשכנע את הוועדה בעזרת נתונים עובדתיים.'],
          ['challenge', 'noun', 'אתגר', '⛰️', 'Overcoming climate change is our greatest challenge.', 'התגברות על שינויי האקלים היא האתגר הגדול ביותר שלנו.'],
          ['statement', 'noun', 'הצהרה / אמירה', '📜', 'The team issued an official statement after the victory.', 'הקבוצה פרסמה הצהרה רשמית לאחר הניצחון.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'hesitation', translationHe: 'היסוס' },
            { wordEn: 'confusion', translationHe: 'בלבול' },
          ],
          shortSentenceEn: 'We would solve crises faster.',
          shortSentenceHe: 'היינו פותרים משברים מהר יותר.',
          rule: {
            questionEn: 'Which sentence correctly expresses an unreal condition in the present?',
            correct: 'If governments supported young scientists, breakthroughs would emerge rapidly.',
            wrong: [
              'If governments would support young scientists, breakthroughs will emerge.',
              'If governments supported young scientists, breakthroughs emerge rapidly.',
            ],
            explainHe: 'בחלק התנאי: If + Past Simple (supported). בחלק התוצאה: would + פועל מקור (would emerge). אין להשתמש ב-would בחלק ה-If.',
          },
          story: {
            passageEn:
              'In the international debate finals in London, twenty national youth teams debated future education. Maya took the podium to deliver her team summary statement. "If every high school had modern laboratories, thousands of students would discover breakthrough medical treatments," she declared passionately. Her structured arguments and clear counterpoints convinced the judges, earning her team the trophy.',
            passageHe:
              'בגמר הדיבייט הבינלאומי בלונדון, עשרים קבוצות נוער לאומיות דנו על עתיד החינוך. מאיה עלתה לדוכן הנואמים כדי למסור את הצהרת הסיכום של קבוצתה. "אילו לכל בית ספר תיכון היו מעבדות מודרניות, אלפי תלמידים היו מגלים טיפולים רפואיים פורצי דרך," הכריזה בלהט. טיעוניה המובנים ונקודות הנגד הברורות שלה שכנעו את השופטים, והביאו לקבוצתה את הגביע.',
            questionEn: 'What educational change did Maya propose to achieve medical breakthroughs?',
            questionHe: 'איזה שינוי חינוכי הציעה מאיה כדי להשיג פריצות דרך רפואיות?',
            correct: 'Modern laboratories in every high school.',
            wrong: [
              'Banning all computer usage in exams.',
              'Cancelling foreign language classes.',
            ],
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 3: Media Literacy & Passive Voice',
    titleHe: 'פרק 3: אוריינות תקשורת וסביל באנגלית',
    subtitleHe: 'Passive Voice בהווה ובעבר (is/are + V3, was/were + V3), בדיקת עובדות וחדשות',
    badgeEmoji: '📰',
    missions: [
      {
        icon: '📰',
        titleEn: 'How News Stories Are Created',
        titleHe: 'כיצד כתבות חדשות נוצרות',
        storyHookHe: 'מי כותב את החדשות ואיך בודקים עובדות? נלמד את צורת הסביל בהווה: כאשר הפעולה חשובה יותר ממי שעשה אותה.',
        grammarTopic: 'Present Simple Passive (am / is / are + V3)',
        skills: ['Present Passive', 'Journalism Vocab', 'Fact Checking'],
        sentenceEn: 'Articles are written by journalists and checked by senior editors before publishing.',
        sentenceHe: 'כתבות נכתבות על ידי עיתונאים ונבדקות על ידי עורכים בכירים לפני הפרסום.',
        vocab: [
          ['journalism', 'noun', 'עיתונות', '✍️', 'Honest journalism protects freedom of speech.', 'עיתונות ישרה שומרת על חופש הביטוי.'],
          ['article', 'noun', 'כתבה / מאמר', '📄', 'She published a fascinating article about astronomy.', 'היא פרסמה מאמר מרתק על אסטרונומיה.'],
          ['reliable', 'adjective', 'מהימן / אמין', '✅', 'Always verify that your sources are reliable.', 'ודאו תמיד שהמקורות שלכם אמינים.'],
          ['source', 'noun', 'מקור מידע', '🔍', 'The reporter protected his primary source.', 'הכתב הגן על מקור המידע העיקרי שלו.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'gossip', translationHe: 'רכילות' },
            { wordEn: 'advertisement', translationHe: 'פרסומת' },
          ],
          shortSentenceEn: 'Articles are checked carefully.',
          shortSentenceHe: 'כתבות נבדקות בקפידה.',
          rule: {
            questionEn: 'Which sentence correctly uses the Present Simple Passive?',
            correct: 'Digital photographs are uploaded to the news server every minute.',
            wrong: [
              'Digital photographs is uploaded to the news server every minute.',
              'Digital photographs are upload to the news server every minute.',
            ],
            explainHe: 'עבור שמות עצם ברבים (photographs) משתמשים ב-are בתוספת פועל ב-V3 (uploaded).',
          },
          story: {
            passageEn:
              'In modern newsrooms, hundreds of reports are processed every morning. Fact-checkers verify each claim against reliable government databases. Once the text is approved, videos are edited and captions are added. Finally, news items are broadcast simultaneously to millions of phones.',
            passageHe:
              'במערכות חדשות מודרניות, מאות דיווחים מעובדים מדי בוקר. בודקי עובדות מאמתים כל טענה מול מאגרי מידע ממשלתיים אמינים. ברגע שהטקסט מאושר, סרטונים נערכים וכתוביות מתווספות. לבסוף, מבזקי חדשות משודרים בו-זמנית למיליוני טלפונים.',
            questionEn: 'How are news claims verified before publication?',
            questionHe: 'כיצד מאמתים טענות חדשותיות לפני פרסומן?',
            correct: 'Against reliable government databases.',
            wrong: [
              'By voting on social media polls.',
              'They are never verified.',
            ],
          },
        },
      },
      {
        icon: '💡',
        titleEn: 'Famous Inventions That Changed History',
        titleHe: 'המצאות מפורסמות ששינו את ההיסטוריה',
        storyHookHe: 'הטלפון, הדפוס והחשמל שינו את חיינו. נלמד איך לתאר אירועים היסטוריים בסביל בעבר: was / were + V3!',
        grammarTopic: 'Past Simple Passive (was / were + V3)',
        skills: ['Past Passive', 'History Vocab', 'Historical Science'],
        sentenceEn: 'The first modern telephone was invented by Alexander Graham Bell in 1876.',
        sentenceHe: 'הטלפון המודרני הראשון הומצא על ידי אלכסנדר גרהם בל בשנת 1876.',
        vocab: [
          ['invention', 'noun', 'המצאה', '💡', 'The printing press was a groundbreaking invention.', 'מכבש הדפוס היה המצאה פורצת דרך.'],
          ['discover', 'verb', 'לגלות', '🧭', 'Scientists discovered penicillin by accident.', 'מדענים גילו את הפניצילין במקרה.'],
          ['patent', 'noun', 'פטנט / זכות המצאה', '📜', 'Edison held more than one thousand patents.', 'לאדיסון היו רשומים למעלה מאלף פטנטים.'],
          ['historical', 'adjective', 'היסטורי', '🏛️', 'The museum displays unique historical artifacts.', 'המוזיאון מציג פריטים היסטוריים ייחודיים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'tradition', translationHe: 'מסורת' },
            { wordEn: 'superstition', translationHe: 'אמונה טפלה' },
          ],
          shortSentenceEn: 'The telephone was invented.',
          shortSentenceHe: 'הטלפון הומצא.',
          rule: {
            questionEn: 'Which sentence correctly forms the Past Simple Passive?',
            correct: 'The printing press was built in Germany in the fifteenth century.',
            wrong: [
              'The printing press were built in Germany in the fifteenth century.',
              'The printing press was build in Germany in the fifteenth century.',
            ],
            explainHe: 'עבור יחיד (the printing press) משתמשים ב-was + V3 (built). הצורה were מתאימה לרבים בלבד.',
          },
          story: {
            passageEn:
              'In 1876, the first telephone call was made in Boston. Wires were connected between two adjoining rooms, and the famous words were heard clearly. Within twenty years, thousands of telephone lines were installed across major cities, transforming global communication forever.',
            passageHe:
              'בשנת 1876 בוצעה שיחת הטלפון הראשונה בבוסטון. חוטים חוברו בין שני חדרים סמוכים, והמילים המפורסמות נשמעו בבירור. תוך עשרים שנה הותקנו אלפי קווי טלפון ברחבי ערים מרכזיות, והתקשורת העולמית השתנתה לנצח.',
            questionEn: 'When was the first telephone call made?',
            questionHe: 'מתי בוצעה שיחת הטלפון הראשונה?',
            correct: 'In 1876 in Boston.',
            wrong: [
              'In 1999 on a mobile network.',
              'Hundreds of years before writing.',
            ],
          },
        },
      },
      {
        icon: '🔍',
        isBoss: true,
        titleEn: 'Boss: Investigative Journalism Report',
        titleHe: 'אתגר הבוס: תחקיר עיתונאי חוקר',
        storyHookHe: 'אתגר בוס לפרק 3: חשיפת האמת מאחורי ידיעה חדשותית! שליטה מלאה בסביל בהווה ובעבר, בדיקת מקורות ואוריינות דיגיטלית.',
        grammarTopic: 'Review: Passive Voice in Investigative Journalism',
        skills: ['Boss Challenge', 'Passive Mastery', 'Critical Media Analysis'],
        sentenceEn: 'The confidential documents were leaked online, but the facts were verified by honest researchers.',
        sentenceHe: 'המסמכים הסודיים הודלפו לרשת, אך העובדות אומתו על ידי חוקרים ישרים.',
        vocab: [
          ['headline', 'noun', 'כותרת ראשית', '📰', 'The bold headline grabbed the attention of readers.', 'הכותרת המודגשת משכה את תשומת לב הקוראים.'],
          ['report', 'noun / verb', 'דיווח / לדווח', '📑', 'The environmental report was published yesterday.', 'הדו"ח הסביבתי פורסם אתמול.'],
          ['document', 'noun', 'מסמך', '📄', 'Important historical documents are preserved in vaults.', 'מסמכים היסטוריים חשובים נשמרים בכספות.'],
          ['truth', 'noun', 'אמת', '🕊️', 'Courageous reporters always seek the objective truth.', 'כתבים אמיצים תמיד מחפשים את האמת האובייקטיבית.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'rumor', translationHe: 'שמועה' },
            { wordEn: 'deception', translationHe: 'הטעיה' },
          ],
          shortSentenceEn: 'The facts were verified.',
          shortSentenceHe: 'העובדות אומתו.',
          rule: {
            questionEn: 'Which passive sentence correctly changes: "Reporters checked the facts yesterday"?',
            correct: 'The facts were checked by reporters yesterday.',
            wrong: [
              'The facts was checked by reporters yesterday.',
              'The facts are checked by reporters yesterday.',
            ],
            explainHe: 'המילה facts היא ברבים ועבר (yesterday), ולכן נשתמש ב-were checked.',
          },
          story: {
            passageEn:
              'A viral story about a secret underwater city was shared by millions on social media last week. However, when the images were examined by marine archaeologists, inconsistencies were immediately detected. The images were generated by computer software rather than captured by underwater cameras. A detailed correction report was published by news agencies to inform the public.',
            passageHe:
              'סיפור ויראלי על עיר תת-ימית סודית שותף על ידי מיליונים ברשתות החברתיות בשבוע שעבר. אולם, כאשר התמונות נבדקו על ידי ארכיאולוגים ימיים, אי-התאמות זוהו מיד. התמונות נוצרו על ידי תוכנת מחשב ולא נלכדו במצלמות תת-ימיות. דו"ח תיקון מפורט פורסם על ידי סוכנויות הידיעות כדי ליידע את הציבור.',
            questionEn: 'How were the viral underwater city images actually created?',
            questionHe: 'כיצד נוצרו בפועל תמונות העיר התת-ימית הוויראליות?',
            correct: 'They were generated by computer software.',
            wrong: [
              'They were photographed by deep-sea divers.',
              'They were painted on ancient papyrus.',
            ],
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 4: Global Citizens & High School Countdown',
    titleHe: 'פרק 4: אזרחי העולם והמעבר לתיכון',
    subtitleHe: 'פסוקיות זיקה (who, which, that), סקירת משפטי תנאי ואוצר מילים ברמת Band III',
    badgeEmoji: '🎓',
    missions: [
      {
        icon: '🌍',
        titleEn: 'Leaders Who Inspire Us',
        titleHe: 'מנהיגים שמעניקים לנו השראה',
        storyHookHe: 'מי הם האנשים ששינו את העולם לטובה? נלמד לחבר משפטים מורכבים בעזרת כינויי זיקה: Who לבני אדם, ו-Which / That לחפצים ורעיונות.',
        grammarTopic: 'Relative Clauses (Who, Which, That)',
        skills: ['Relative Pronouns', 'Leadership Vocab', 'Complex Sentences'],
        sentenceEn: 'We admire leaders who fight for equality and make a lasting difference.',
        sentenceHe: 'אנחנו מעריצים מנהיגים שנלחמים למען שוויון ויוצרים שינוי בר-קיימא.',
        vocab: [
          ['equality', 'noun', 'שוויון', '⚖️', 'Education is the foundation of gender equality.', 'חינוך הוא הבסיס לשוויון מגדרי.'],
          ['inspiring', 'adjective', 'מעורר השראה', '🌟', 'She delivered an inspiring message to the youth.', 'היא מסרה מסר מעורר השראה לנוער.'],
          ['impact', 'noun', 'השפעה / אימפקט', '💥', 'Community volunteers have a positive impact.', 'למתנדבים בקהילה יש השפעה חיובית.'],
          ['contribution', 'noun', 'תרומה', '🎁', 'His scientific contribution saved thousands of lives.', 'תרומתו המדעית הצילה אלפי חיים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'rebellion', translationHe: 'מרד' },
            { wordEn: 'struggle', translationHe: 'מאבק' },
          ],
          shortSentenceEn: 'Leaders fight for equality.',
          shortSentenceHe: 'מנהיגים נלחמים למען שוויון.',
          rule: {
            questionEn: 'Which relative pronoun correctly refers to a person?',
            correct: 'The student who won the scholarship studies medicine.',
            wrong: [
              'The student which won the scholarship studies medicine.',
              'The student where won the scholarship studies medicine.',
            ],
            explainHe: 'כאשר מתייחסים לבני אדם (the student) משתמשים ב-who (או that). המילה which משמשת רק לחפצים ובעלי חיים.',
          },
          story: {
            passageEn:
              'Throughout human history, change has been championed by individuals who refused to accept injustice. Leaders like Nelson Mandela and Malala Yousafzai demonstrated that persistence creates profound impact. Their courage inspires millions of students who believe in education and equality.',
            passageHe:
              'לאורך ההיסטוריה האנושית, שינוי הובל על ידי אנשים שסירבו לקבל חוסר צדק. מנהיגים כמו נלסון מנדלה ומלאלה יוספזאי הוכיחו שהתמדה מייצרת השפעה עמוקה. האומץ שלהם מעניק השראה למיליוני תלמידים שמאמינים בחינוך ובשוויון.',
            questionEn: 'Who is inspired by courageous leaders in the text?',
            questionHe: 'מי מקבל השראה ממנהיגים אמיצים לפי הטקסט?',
            correct: 'Millions of students who believe in education.',
            wrong: [
              'Only professional politicians.',
              'Nobody reads about history anymore.',
            ],
          },
        },
      },
      {
        icon: '📚',
        titleEn: 'Choosing Our High School Majors',
        titleHe: 'בוחרים מגמות לתיכון',
        storyHookHe: 'המעבר לתיכון מתקרב בצעדי ענק! ביוטכנולוגיה, אמנות, מחשבים או פיזיקה? נתרגל תנאים וקבלת החלטות לעתיד.',
        grammarTopic: 'Conditionals Synthesis (Zero, First, and Second Conditional)',
        skills: ['Conditionals Review', 'High School Majors', 'Decision Making'],
        sentenceEn: 'If you choose computer science, you will build applications that solve real problems.',
        sentenceHe: 'אם תבחרו במדעי המחשב, תבנו יישומים שפותרים בעיות אמיתיות.',
        vocab: [
          ['academic', 'adjective', 'אקדמי / לימודי', '🎓', 'High school offers rigorous academic programs.', 'בית הספר התיכון מציע תוכניות אקדמיות מאתגרות.'],
          ['curriculum', 'noun', 'תוכנית לימודים', '📖', 'The curriculum includes literature, science, and history.', 'תוכנית הלימודים כוללת ספרות, מדע והיסטוריה.'],
          ['ambition', 'noun', 'שאיפה / אמביציה', '🚀', 'Her ambition is to become an aerospace engineer.', 'שאיפתה היא להפוך למהנדסת אווירוחלל.'],
          ['career', 'noun', 'קריירה / מסלול מקצועי', '💼', 'Choosing a major is the first step toward a career.', 'בחירת מגמה היא הצעד הראשון לקראת קריירה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'vacation', translationHe: 'חופשה' },
            { wordEn: 'hobby', translationHe: 'תחביב' },
          ],
          shortSentenceEn: 'You will build applications.',
          shortSentenceHe: 'אתם תבנו יישומים.',
          rule: {
            questionEn: 'Which sentence correctly expresses a realistic future choice?',
            correct: 'If I study physics, I will prepare for university engineering.',
            wrong: [
              'If I will study physics, I will prepare for university engineering.',
              'If I study physics, I prepared for university engineering.',
            ],
            explainHe: 'בתנאי ראשון (First Conditional) לחלק התנאי נכנס הווה פשוט (study) ולחלק התוצאה will + מקור.',
          },
          story: {
            passageEn:
              'Ninth graders met with high school counselors to discuss their academic majors. Liam wants to explore biotechnology because he loves biology. "If you take advanced chemistry, you will develop strong laboratory skills," explained the advisor. Liam felt excited about the upcoming challenges of high school.',
            passageHe:
              'תלמידי כיתה ט׳ נפגשו עם יועצי התיכון כדי לדון במגמות הלימוד שלהם. ליאם רוצה לחקור ביוטכנולוגיה כי הוא אוהב ביולוגיה. "אם תלמד כימיה מוגברת, תפתח מיומנויות מעבדה חזקות," הסביר היועץ. ליאם הרגיש נרגש לקראת האתגרים הקרובים בתיכון.',
            questionEn: 'Why does Liam want to choose the biotechnology major?',
            questionHe: 'מדוע ליאם רוצה לבחור במגמת ביוטכנולוגיה?',
            correct: 'Because he loves biology.',
            wrong: [
              'Because his parents forced him.',
              'Because it has no exams.',
            ],
          },
        },
      },
      {
        icon: '🎉',
        isBoss: true,
        titleEn: 'Boss: Graduation Gala & High School Ready',
        titleHe: 'אתגר הבוס: נשף הסיום ומוכנים לתיכון',
        storyHookHe: 'אתגר מסכם ענק לחטיבת הביניים: סיום כיתה ט׳ והמעבר לחטיבה העליונה! הוכיחו שליטה בכל אוצר המילים והמבנים של Band II ו-Band III.',
        grammarTopic: 'Comprehensive Middle School Mastery Review',
        skills: ['Boss Challenge', 'Band III Readiness', 'High School Transition'],
        sentenceEn: 'Having completed junior high school, we are fully prepared for the exciting challenges ahead.',
        sentenceHe: 'לאחר שסיימנו את חטיבת הביניים, אנחנו מוכנים לחלוטין לאתגרים המרגשים שלפנינו.',
        vocab: [
          ['graduation', 'noun', 'סיום לימודים / טקס סיום', '🎓', 'Family and friends attended the festive graduation.', 'משפחה וחברים השתתפו בטקס הסיום החגיגי.'],
          ['capability', 'noun', 'יכולת / כושר', '💪', 'Every student has the capability to excel in English.', 'לכל תלמיד/ה יש את היכולת להצטיין באנגלית.'],
          ['future', 'noun', 'עתיד', '🌅', 'Hard work today builds a successful future.', 'עבודה קשה היום בונה עתיד מוצלח.'],
          ['celebrate', 'verb', 'לחגוג', '🎊', 'We celebrate three years of friendship and growth.', 'אנחנו חוגגים שלוש שנים של חברות וצמיחה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'disappointment', translationHe: 'אכזבה' },
            { wordEn: 'regret', translationHe: 'חרטה' },
          ],
          shortSentenceEn: 'We are prepared for challenges.',
          shortSentenceHe: 'אנחנו מוכנים לאתגרים.',
          rule: {
            questionEn: 'Which sentence demonstrates proper Band III formal English structure?',
            correct: 'Students who show dedication will succeed in advanced high school courses.',
            wrong: [
              'Students which shows dedication will succeed in advanced high school courses.',
              'Students who shows dedication will succeed in advanced high school courses.',
            ],
            explainHe: 'עבור רבים (Students) כינוי הזיקה לבני אדם הוא who והפועל בלשון רבים הוא show (ללא s).',
          },
          story: {
            passageEn:
              'The junior high graduation ceremony began as music echoed through the hall. Three years of projects, debates, sports tournaments, and exams culminated in this memorable evening. Standing on the stage, the student representative reminded everyone: "We have learned together, we have supported one another through challenges, and we are stepping into high school with confidence and curiosity."',
            passageHe:
              'טקס הסיום של חטיבת הביניים החל כאשר מוזיקה הדהדה באולם. שלוש שנים של פרויקטים, דיבייטים, טורנירי ספורט ומבחנים הגיעו לשיאם בערב בלתי נשכח זה. בעומדו על הבמה, נציג התלמידים הזכיר לכולם: "למדנו יחד, תמכנו זה בזה באתגרים, ואנחנו צועדים אל התיכון עם ביטחון וסקרנות."',
            questionEn: 'With what mindset are the students entering high school?',
            questionHe: 'עם איזו גישה נכנסים התלמידים לבית הספר התיכון?',
            correct: 'With confidence and curiosity.',
            wrong: [
              'With fear and sadness.',
              'Without any preparation.',
            ],
          },
        },
      },
    ],
  },
]);
