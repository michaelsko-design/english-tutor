import { buildHighSchoolGrade, type HighSchoolUnitSpec } from '../../../highSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

const UNITS: HighSchoolUnitSpec[] = [
  {
    ...packUnitNumbers('core-plus', 0),
    titleEn: 'Mixed Conditionals & Alternate Lives',
    titleHe: 'תנאים מעורבים וחיים חלופיים',
    subtitleHe: 'עונה 2: חיבור בין עבר להווה במשפטי תנאי (Mixed Conditionals) וניתוח בחירות',
    badgeEmoji: '🔀',
    missions: [
      {
        icon: '⏪',
        titleEn: 'Past Choices, Present Results',
        titleHe: 'בחירות בעבר, תוצאות בהווה',
        storyHookHe:
          'הרפתקת בונוס של עונה 2: מה היה המצב שלנו היום אילו בעבר היינו בוחרים אחרת? נלמד את התנאי המעורב If + had + V3, would + V1, שמחבר עבר דמיוני לתוצאה בהווה.',
        grammarTopic: 'Mixed Conditional: past condition → present result',
        skills: ['Mixed Conditionals', 'Third Conditional Review', 'Life Choices'],
        sentenceEn: 'If Adi had accepted the scholarship, she would be studying in Canada now.',
        sentenceHe: 'אילו עדי הייתה מקבלת את המלגה, היא הייתה לומדת עכשיו בקנדה.',
        vocab: [
          [
            'pursue',
            'verb',
            'לרדוף אחרי / לחתור להשגת מטרה',
            '🏃',
            'She decided to pursue a career in marine biology.',
            'היא החליטה לחתור לקריירה בביולוגיה ימית.',
          ],
          [
            'relocate',
            'verb',
            'לעבור למקום אחר / להעתיק מקום מגורים',
            '🧳',
            'The company asked him to relocate to its office in Berlin.',
            'החברה ביקשה ממנו לעבור למשרד שלה בברלין.',
          ],
          [
            'fluent',
            'adjective',
            'שוטף / רהוט (בשפה)',
            '🗣️',
            'After a year in Madrid, he became fluent in Spanish.',
            'אחרי שנה במדריד הוא דיבר ספרדית שוטפת.',
          ],
          [
            'scholarship',
            'noun',
            'מלגה',
            '🎓',
            'Only ten students won a full scholarship this year.',
            'רק עשרה תלמידים זכו השנה במלגה מלאה.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'abandon', translationHe: 'לנטוש / לוותר על' },
            { wordEn: 'postpone', translationHe: 'לדחות' },
          ],
          shortSentenceEn: 'He would be fluent now.',
          shortSentenceHe: 'הוא היה מדבר שוטף עכשיו.',
          rule: {
            questionEn: 'Which sentence connects a PAST condition to a PRESENT result?',
            correct: 'If I had moved to London, I would speak perfect English today.',
            wrong: [
              'If I had moved to London, I would have spoken perfect English then.',
              'If I move to London, I will speak perfect English today.',
            ],
            explainHe:
              'בתנאי מעורב החלק של if בעבר (had + V3), אבל התוצאה בהווה (would + V1). מילה כמו today מראה שהתוצאה היא עכשיו.',
            hintHe: 'חפשו משפט שבו החלק הראשון מדבר על עבר שלא קרה, והחלק השני על המצב כיום.',
          },
          story: {
            passageEn:
              'Twenty years ago, Ronen was offered a job at a bank in New York. He chose to stay in Israel and pursue his dream of opening a bakery in Rehovot. If he had relocated to New York, he would probably be a rich banker today. Instead, he runs one of the most popular bakeries in the city, and he says he has no regrets.',
            passageHe:
              'לפני עשרים שנה הציעו לרונן עבודה בבנק בניו יורק. הוא בחר להישאר בישראל ולהגשים את החלום שלו לפתוח מאפייה ברחובות. אילו היה עובר לניו יורק, כנראה שהיה היום בנקאי עשיר. במקום זאת, הוא מנהל את אחת המאפיות הפופולריות בעיר, והוא אומר שאינו מתחרט.',
            questionEn: 'What does Ronen do today?',
            questionHe: 'במה רונן עוסק היום?',
            correct: 'He runs one of the most popular bakeries in the city.',
            wrong: ['He works as a rich banker in New York.', 'He teaches baking at a school in Rehovot.'],
          },
        },
      },
      {
        icon: '🤔',
        titleEn: 'Present Traits, Past Results',
        titleHe: 'תכונות בהווה, תוצאות בעבר',
        storyHookHe:
          'לפעמים תכונה קבועה שלנו משפיעה על מה שכבר קרה. נלמד את הכיוון השני של התנאי המעורב: If + Past Simple, would have + V3, למשל If I were braver, I would have spoken.',
        grammarTopic: 'Mixed Conditional: present condition → past result',
        skills: ['Mixed Conditionals', 'Character Traits', 'Cause & Effect'],
        sentenceEn: 'If Gal were less impulsive, he would not have sent that angry message.',
        sentenceHe: 'אילו גל היה פחות אימפולסיבי, הוא לא היה שולח את ההודעה הכועסת ההיא.',
        vocab: [
          [
            'impulsive',
            'adjective',
            'אימפולסיבי / פועל בלי לחשוב',
            '💥',
            'Impulsive shoppers often buy things they do not need.',
            'קונים אימפולסיביים קונים לעתים קרובות דברים שהם לא צריכים.',
          ],
          [
            'cautious',
            'adjective',
            'זהיר',
            '⚠️',
            'Cautious hikers always carry extra water in the desert.',
            'מטיילים זהירים תמיד נושאים מים נוספים במדבר.',
          ],
          [
            'hesitate',
            'verb',
            'להסס / להתלבט',
            '🤷',
            'Do not hesitate to ask for help if you need it.',
            'אל תהססו לבקש עזרה אם אתם צריכים אותה.',
          ],
          [
            'temperament',
            'noun',
            'מזג / אופי',
            '🌀',
            'My sister has a calm temperament, unlike me.',
            'לאחותי יש מזג רגוע, בשונה ממני.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'reliable', translationHe: 'אמין' },
            { wordEn: 'generous', translationHe: 'נדיב' },
          ],
          shortSentenceEn: 'She is a cautious driver.',
          shortSentenceHe: 'היא נהגת זהירה.',
          rule: {
            questionEn: 'Which sentence connects a PRESENT trait to a PAST result?',
            correct: 'If Lior were more organised, he would have finished the project yesterday.',
            wrong: [
              'If Lior had been more organised, he would finish the project tomorrow.',
              'If Lior is more organised, he will finish the project yesterday.',
            ],
            explainHe:
              'תכונה קבועה בהווה מופיעה ב-Past Simple (were more organised), והתוצאה שכבר הייתה אמורה לקרות מופיעה ב-would have + V3.',
            hintHe: 'התכונה של ליאור נכונה גם היום, והפרויקט היה אמור להסתיים בעבר. התאימו את הזמן של כל חלק.',
          },
          story: {
            passageEn:
              'Maya has always had a shy temperament. Last week, her history teacher asked who wanted to represent the school at a national debate. Maya knew the topic well, but she hesitated and said nothing. If she were more confident, she would have raised her hand, and she might be preparing for the debate right now.',
            passageHe:
              'למאיה תמיד היה מזג ביישני. בשבוע שעבר המורה להיסטוריה שאלה מי רוצה לייצג את בית הספר בתחרות ויכוח ארצית. מאיה הכירה את הנושא היטב, אבל היא היססה ולא אמרה דבר. אילו הייתה בטוחה יותר בעצמה, היא הייתה מצביעה, ואולי הייתה מתכוננת לתחרות ממש עכשיו.',
            questionEn: 'What did Maya do when the teacher asked the question?',
            questionHe: 'מה עשתה מאיה כשהמורה שאלה את השאלה?',
            correct: 'She hesitated and said nothing.',
            wrong: ['She raised her hand at once.', 'She asked a friend to answer.'],
          },
        },
      },
      {
        icon: '🧭',
        isBoss: true,
        titleEn: 'Boss: Sliding Doors Unseen',
        titleHe: 'בוס: Unseen של ״דלתות מסתובבות״',
        storyHookHe:
          'משימת בוס של עונה 2: ניתוח של סרט שבו רגע אחד קטן משנה חיים שלמים. עליכם להבחין בין שני סוגי התנאי המעורב ובין תנאי שלישי רגיל ולענות על שאלות ברמת בגרות!',
        grammarTopic: 'Mixed & Third Conditionals Synthesis',
        skills: ['Conditionals Mastery', 'Film Analysis', 'Bagrut Unseen'],
        sentenceEn: 'If she had caught that train, her whole life would be different today.',
        sentenceHe: 'אילו הייתה מספיקה לעלות לרכבת ההיא, כל חייה היו שונים היום.',
        vocab: [
          [
            'pivotal',
            'adjective',
            'מכריע / מרכזי',
            '🎯',
            'Meeting his mentor was a pivotal moment in his career.',
            'הפגישה עם המנטור שלו הייתה רגע מכריע בקריירה שלו.',
          ],
          [
            'trajectory',
            'noun',
            'מסלול / כיוון התפתחות',
            '📈',
            'One good teacher can change the trajectory of a student\'s life.',
            'מורה טוב אחד יכול לשנות את מסלול חייו של תלמיד.',
          ],
          [
            'alternate',
            'adjective',
            'חלופי',
            '🔀',
            'The film shows an alternate version of history.',
            'הסרט מציג גרסה חלופית של ההיסטוריה.',
          ],
          [
            'speculate',
            'verb',
            'לשער / להעלות השערות',
            '💭',
            'Fans love to speculate about how the series will end.',
            'מעריצים אוהבים להעלות השערות איך הסדרה תסתיים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'trivial', translationHe: 'שולי / חסר חשיבות' },
            { wordEn: 'identical', translationHe: 'זהה' },
          ],
          shortSentenceEn: 'One moment changed everything.',
          shortSentenceHe: 'רגע אחד שינה הכול.',
          rule: {
            questionEn: 'Which sentence is a mixed conditional (past condition, present result)?',
            correct: 'If the doors had not closed, Helen would be a different person now.',
            wrong: [
              'If the doors had not closed, Helen would have met him on the train.',
              'If the doors do not close, Helen will meet him on the train.',
            ],
            explainHe:
              'בתנאי המעורב התוצאה מדברת על ההווה (would be … now). would have met הוא תנאי שלישי רגיל, ו-will meet הוא תנאי ראשון.',
            hintHe: 'בכל האפשרויות בדקו את החלק השני: האם הוא מדבר על העבר, על העתיד או על המצב עכשיו?',
          },
          story: {
            passageEn:
              'In the film Sliding Doors, a young woman named Helen runs to catch a train in London. The story splits into two alternate lives: in one she catches the train, and in the other the doors close in her face. In the first life she discovers a painful secret and starts a new business. Viewers still speculate about which life was better for her.',
            passageHe:
              'בסרט ״דלתות מסתובבות״, אישה צעירה בשם הלן רצה כדי להספיק לרכבת בלונדון. הסיפור מתפצל לשני חיים חלופיים: באחד היא מספיקה לעלות לרכבת, ובשני הדלתות נסגרות מול פניה. בחיים הראשונים היא מגלה סוד כואב ופותחת עסק חדש. הצופים עדיין משערים אילו חיים היו טובים יותר עבורה.',
            questionEn: 'What happens to Helen in the first life?',
            questionHe: 'מה קורה להלן בחיים הראשונים?',
            correct: 'She discovers a painful secret and starts a new business.',
            wrong: ['She misses the train and goes home.', 'She moves away from London for good.'],
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('core-plus', 1),
    titleEn: 'Paraphrasing & Summarising for the Bagrut',
    titleHe: 'ניסוח מחדש וסיכום לבגרות',
    subtitleHe: 'עונה 2: לומר את אותו רעיון במילים אחרות, לזהות עיקר וטפל ולכתוב סיכום קצר',
    badgeEmoji: '📝',
    missions: [
      {
        icon: '🔁',
        titleEn: 'Same Idea, New Words: Paraphrasing',
        titleHe: 'אותו רעיון, מילים חדשות: פרפרזה',
        storyHookHe:
          'בשאלות הבגרות התשובה הנכונה כמעט אף פעם לא מעתיקה את המילים מהטקסט. נלמד לזהות פרפרזה: מילים נרדפות, שינוי חלק דיבר ומעבר מפעיל לסביל.',
        grammarTopic: 'Paraphrasing: synonyms, word forms & active ↔ passive',
        skills: ['Paraphrasing', 'Synonyms', 'Module G Strategies'],
        sentenceEn: 'A good paraphrase keeps the original meaning but uses completely different words.',
        sentenceHe: 'פרפרזה טובה שומרת על המשמעות המקורית אבל משתמשת במילים שונות לגמרי.',
        vocab: [
          [
            'paraphrase',
            'noun',
            'פרפרזה / ניסוח מחדש',
            '🔁',
            'The correct answer is usually a paraphrase of the text.',
            'התשובה הנכונה היא בדרך כלל ניסוח מחדש של הטקסט.',
          ],
          [
            'synonym',
            'noun',
            'מילה נרדפת',
            '🔗',
            '"Begin" is a synonym for "start".',
            '״Begin״ היא מילה נרדפת ל-״start״.',
          ],
          [
            'equivalent',
            'adjective',
            'שווה ערך / מקביל',
            '⚖️',
            'One kilometre is equivalent to a thousand metres.',
            'קילומטר אחד שווה ערך לאלף מטרים.',
          ],
          [
            'convey',
            'verb',
            'להעביר (מסר / רעיון)',
            '📨',
            'Poets use images to convey strong feelings.',
            'משוררים משתמשים בדימויים כדי להעביר רגשות חזקים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'antonym', translationHe: 'מילה הפוכה' },
            { wordEn: 'quotation', translationHe: 'ציטוט' },
          ],
          shortSentenceEn: 'Synonyms help us paraphrase.',
          shortSentenceHe: 'מילים נרדפות עוזרות לנו לנסח מחדש.',
          rule: {
            questionEn: 'Which sentence is the best paraphrase of "The museum attracts many tourists"?',
            correct: 'Large numbers of visitors are drawn to the museum.',
            wrong: ['The museum attracts many tourists every day.', 'Few tourists are interested in the museum.'],
            explainHe:
              'פרפרזה טובה שומרת על המשמעות אבל משנה את המילים ואת המבנה: visitors במקום tourists, ומבנה סביל (are drawn to).',
            hintHe: 'פסלו את האפשרות שמעתיקה את המשפט כמעט מילה במילה, ואת זו שהופכת את המשמעות.',
          },
          story: {
            passageEn:
              'In the Bagrut reading section, many students choose answers that repeat words from the passage. However, examiners often write the correct answer as a paraphrase. For example, if the text says that a city "grew rapidly", the right answer may say that it "expanded quickly". Students who learn synonyms can recognise these hidden answers much more easily.',
            passageHe:
              'בחלק הקריאה של הבגרות, תלמידים רבים בוחרים תשובות שחוזרות על מילים מהקטע. עם זאת, הבוחנים כותבים לעתים קרובות את התשובה הנכונה כפרפרזה. לדוגמה, אם בטקסט כתוב שעיר ״גדלה במהירות״, התשובה הנכונה עשויה לומר שהיא ״התרחבה מהר״. תלמידים שלומדים מילים נרדפות יכולים לזהות את התשובות המוסתרות האלה בקלות רבה יותר.',
            questionEn: 'Who can recognise the hidden answers more easily?',
            questionHe: 'מי יכולים לזהות את התשובות המוסתרות בקלות רבה יותר?',
            correct: 'Students who learn synonyms.',
            wrong: ['Students who copy words from the passage.', 'Students who read the questions first.'],
          },
        },
      },
      {
        icon: '📋',
        titleEn: 'Main Idea or Detail? Summarising',
        titleHe: 'עיקר או טפל? סיכום',
        storyHookHe:
          'סיכום טוב שומר רק על הרעיונות המרכזיים, בלי דוגמאות, מספרים וחזרות. נלמד להפריד בין עיקר לטפל ולהשתמש בביטויים כמו The passage mainly discusses… ו-In short.',
        grammarTopic: 'Summarising: main ideas vs. supporting details',
        skills: ['Summarising', 'Main Idea', 'Module G Strategies'],
        sentenceEn: 'In short, the article argues that green roofs make cities cooler and healthier.',
        sentenceHe: 'בקיצור, המאמר טוען שגגות ירוקים הופכים ערים לקרירות ולבריאות יותר.',
        vocab: [
          [
            'condense',
            'verb',
            'לתמצת / לקצר',
            '🧩',
            'Try to condense the whole chapter into five sentences.',
            'נסו לתמצת את כל הפרק לחמישה משפטים.',
          ],
          [
            'concise',
            'adjective',
            'תמציתי / קצר וברור',
            '✂️',
            'Her report was concise and easy to follow.',
            'הדוח שלה היה תמציתי וקל להבנה.',
          ],
          [
            'redundant',
            'adjective',
            'מיותר / חוזר על עצמו',
            '🗑️',
            'Delete any redundant words from your essay.',
            'מחקו מהחיבור כל מילה מיותרת.',
          ],
          [
            'essence',
            'noun',
            'מהות / עיקר',
            '💎',
            'The essence of the story is the power of friendship.',
            'מהות הסיפור היא כוחה של החברות.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'expand', translationHe: 'להרחיב' },
            { wordEn: 'decorate', translationHe: 'לקשט' },
          ],
          shortSentenceEn: 'Keep your summary concise.',
          shortSentenceHe: 'כדאי שהסיכום יהיה תמציתי.',
          rule: {
            questionEn: 'Which sentence belongs in a SUMMARY of an article about sleep?',
            correct: 'Teenagers need more sleep than most of them actually get.',
            wrong: [
              'For example, a girl from Ashdod sleeps only five hours a night.',
              'The researcher, who has two cats, wrote the study in 2019.',
            ],
            explainHe:
              'בסיכום נשאר רק הרעיון המרכזי. דוגמה אישית ופרטים על החוקר הם טפל, ולכן לא נכנסים לסיכום.',
            hintHe: 'שאלו את עצמכם: האם המשפט מציג את הרעיון הכללי של המאמר, או רק דוגמה ופרט צדדי?',
          },
          story: {
            passageEn:
              'Researchers in Tel Aviv studied how green roofs affect city life. Roofs covered with plants were up to thirty degrees cooler than ordinary roofs on summer afternoons. In one building, the residents even started a small vegetable garden. The study concludes that green roofs can reduce heat and improve the quality of urban life.',
            passageHe:
              'חוקרים בתל אביב בדקו איך גגות ירוקים משפיעים על החיים בעיר. גגות מכוסים בצמחים היו קרירים עד שלושים מעלות יותר מגגות רגילים בשעות אחר הצהריים בקיץ. באחד הבניינים הדיירים אפילו פתחו גינת ירקות קטנה. המחקר מסכם שגגות ירוקים יכולים להפחית חום ולשפר את איכות החיים בעיר.',
            questionEn: 'What is the main conclusion of the study?',
            questionHe: 'מהי המסקנה העיקרית של המחקר?',
            correct: 'Green roofs can reduce heat and improve urban life.',
            wrong: ['Residents should grow vegetables on every roof.', 'Summer afternoons in Tel Aviv are getting shorter.'],
          },
        },
      },
      {
        icon: '🎓',
        isBoss: true,
        titleEn: 'Boss: Season Finale: The Bagrut Summary Challenge',
        titleHe: 'בוס: גמר העונה — אתגר הסיכום לבגרות',
        storyHookHe:
          'גמר עונה 2 והפרידה מהתיכון! עליכם לקרוא קטע Unseen מלא, לזהות את הפרפרזה הנכונה, להשמיט את הטפל ולבחור את הסיכום המדויק ביותר. בהצלחה בבגרות!',
        grammarTopic: 'Paraphrasing & Summarising Synthesis: Season Finale',
        skills: ['Paraphrase Mastery', 'Summary Writing', 'Bagrut Unseen'],
        sentenceEn: 'A coherent summary conveys the gist of the text without copying it word for word.',
        sentenceHe: 'סיכום קוהרנטי מעביר את תמצית הטקסט בלי להעתיק אותו מילה במילה.',
        vocab: [
          [
            'gist',
            'noun',
            'תמצית / הרעיון הכללי',
            '🎯',
            'Read the first paragraph quickly to get the gist.',
            'קראו את הפסקה הראשונה מהר כדי להבין את הרעיון הכללי.',
          ],
          [
            'omit',
            'verb',
            'להשמיט / לדלג על',
            '❌',
            'You may omit minor details from your summary.',
            'אפשר להשמיט פרטים שוליים מהסיכום.',
          ],
          [
            'coherent',
            'adjective',
            'קוהרנטי / מגובש והגיוני',
            '🧱',
            'A coherent paragraph moves logically from one idea to the next.',
            'פסקה קוהרנטית עוברת בהיגיון מרעיון אחד לבא אחריו.',
          ],
          [
            'verbatim',
            'adverb',
            'מילה במילה',
            '📜',
            'The journalist quoted the minister verbatim.',
            'העיתונאי ציטט את השר מילה במילה.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'footnote', translationHe: 'הערת שוליים' },
            { wordEn: 'headline', translationHe: 'כותרת' },
          ],
          shortSentenceEn: 'First, get the gist.',
          shortSentenceHe: 'קודם כול, הבינו את הרעיון הכללי.',
          rule: {
            questionEn: 'Which is the best one-sentence summary of a text about volunteering?',
            correct: 'Volunteering benefits both the community and the volunteers themselves.',
            wrong: [
              'In 2022, exactly 412 students volunteered at a hospital in Haifa.',
              'Volunteering is when people volunteer and do volunteer work.',
            ],
            explainHe:
              'סיכום טוב מציג את הרעיון המרכזי במילים תמציתיות. מספרים מדויקים הם פרט שולי, ומשפט שחוזר על אותה מילה הוא מיותר.',
            hintHe: 'פסלו משפט שמתמקד במספרים, ומשפט שחוזר על עצמו בלי להוסיף מידע.',
          },
          story: {
            passageEn:
              'Every year, thousands of Israeli graduates spend a year volunteering before the army or university. Some work with children in development towns, while others help elderly people or farmers. Research shows that these volunteers develop leadership skills and a stronger sense of responsibility. Communities benefit too, since many projects continue long after the volunteers leave.',
            passageHe:
              'בכל שנה אלפי בוגרים בישראל מקדישים שנה להתנדבות לפני הצבא או האוניברסיטה. חלקם עובדים עם ילדים בעיירות פיתוח, ואחרים עוזרים לקשישים או לחקלאים. מחקרים מראים שהמתנדבים מפתחים כישורי מנהיגות ותחושת אחריות חזקה יותר. גם הקהילות מרוויחות, מפני שפרויקטים רבים נמשכים עוד זמן רב אחרי שהמתנדבים עוזבים.',
            questionEn: 'What skills do the volunteers develop, according to research?',
            questionHe: 'אילו כישורים מפתחים המתנדבים, לפי המחקרים?',
            correct: 'Leadership skills and a stronger sense of responsibility.',
            wrong: ['Farming skills and a love of nature.', 'Language skills and better grades.'],
          },
        },
      },
    ],
  },
];

/** The core-plus pack's grade 12 units: mixed conditionals, then paraphrasing and summarising (the grade's new finale). */
export const CORE_PLUS_GRADE_12_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildHighSchoolGrade('grade-12', UNITS);
