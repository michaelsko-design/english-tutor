import { buildHighSchoolGrade, type HighSchoolUnitSpec } from '../../../highSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * Grade 10 "Season 2" (core-plus): reported questions and commands, then the Present Perfect
 * Continuous. Unit 22's Boss is the grade's new finale.
 */
const UNITS: HighSchoolUnitSpec[] = [
  {
    ...packUnitNumbers('core-plus', 0),
    titleEn: 'Season 2: The Job Interview Diaries',
    titleHe: 'עונה 2: יומן ראיונות העבודה',
    subtitleHe: 'הרפתקאות בונוס: שאלות ובקשות בדיבור עקיף — asked if / whether, told + to',
    badgeEmoji: '💼',
    missions: [
      {
        icon: '💬',
        titleEn: 'She Asked Me Why: Reporting Questions',
        titleHe: 'היא שאלה אותי למה: שאלות בדיבור עקיף',
        storyHookHe:
          'עונה 2 נפתחת עם ראיון עבודה ראשון לקיץ! נלמד למסור שאלות: asked if / whether לשאלות כן-לא, ו-asked עם מילת שאלה לשאלות פתוחות, בסדר המילים של משפט רגיל.',
        grammarTopic: 'Reported Questions (asked if / whether, asked + wh-word)',
        skills: ['Reported Questions', 'Word Order', 'Employment Vocab'],
        sentenceEn: 'The interviewer asked me why I wanted to work at the science museum.',
        sentenceHe: 'המראיינת שאלה אותי למה אני רוצה לעבוד במוזיאון המדע.',
        vocab: [
          ['applicant', 'noun', 'מועמד / מועמדת', '🧑‍💼', 'Each applicant had ten minutes to present a project.', 'לכל מועמד היו עשר דקות להציג פרויקט.'],
          ['qualification', 'noun', 'הכשרה / כישורים', '📜', 'A first-aid course is a useful qualification for camp counsellors.', 'קורס עזרה ראשונה הוא הכשרה שימושית למדריכי קייטנה.'],
          ['employer', 'noun', 'מעסיק / מעסיקה', '🏢', 'My employer gave me a flexible schedule during exams.', 'המעסיק שלי נתן לי לוח זמנים גמיש בתקופת המבחנים.'],
          ['inquire', 'verb', 'לברר / לשאול', '❓', 'I called the shop to inquire about summer jobs.', 'התקשרתי לחנות כדי לברר לגבי עבודות קיץ.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'volcano', translationHe: 'הר געש' },
            { wordEn: 'lighthouse', translationHe: 'מגדלור' },
          ],
          shortSentenceEn: 'She asked where I lived.',
          shortSentenceHe: 'היא שאלה איפה אני גר/ה.',
          rule: {
            questionEn: 'Report the question: "Do you speak Arabic?" — The manager asked me _______.',
            correct: 'if I spoke Arabic',
            wrong: ['do I speak Arabic', 'if did I speak Arabic'],
            explainHe:
              'בשאלת כן-לא עקיפה משתמשים ב-if, סדר המילים הוא של משפט רגיל (I spoke), והזמן זז צעד אחורה. לא משתמשים ב-do או did.',
            hintHe: 'שאלה עקיפה נבנית כמו משפט רגיל: בלי פועל עזר של שאלה, והזמן זז צעד אחורה.',
          },
          story: {
            passageEn:
              'Last June, Noa applied for a summer job at a science museum in Haifa. The interviewer asked her what she knew about robots. She also asked whether Noa could work on weekends. Noa answered honestly and showed a video of a robot from her school project. A week later, the museum offered her the job.',
            passageHe:
              'ביוני שעבר, נועה הגישה מועמדות לעבודת קיץ במוזיאון מדע בחיפה. המראיינת שאלה אותה מה היא יודעת על רובוטים. היא גם שאלה אם נועה יכולה לעבוד בסופי שבוע. נועה ענתה בכנות והראתה סרטון של רובוט מפרויקט בית הספר שלה. שבוע אחר כך המוזיאון הציע לה את העבודה.',
            questionEn: 'What else did the interviewer ask Noa?',
            questionHe: 'מה עוד שאלה המראיינת את נועה?',
            correct: 'Whether she could work on weekends.',
            wrong: ['Whether she had a driving licence.', 'How much money she wanted.'],
          },
        },
      },
      {
        icon: '📋',
        titleEn: 'Orders from the Manager: Told Us To…',
        titleHe: 'הוראות מהמנהלת: אמרה לנו ל...',
        storyHookHe:
          'היום הראשון בעבודה מלא בהוראות! נלמד למסור פקודות ובקשות: told / asked + מישהו + to + פועל, ובשלילה not to.',
        grammarTopic: 'Reported Commands and Requests (told / asked + object + (not) to + V1)',
        skills: ['Reported Commands', 'Workplace English', 'Requests'],
        sentenceEn: 'The supervisor told us not to use our phones near the customers.',
        sentenceHe: 'האחראית אמרה לנו לא להשתמש בטלפונים ליד הלקוחות.',
        vocab: [
          ['supervisor', 'noun', 'אחראי / מפקח', '🧑‍🏫', 'Our supervisor checks the schedule every morning.', 'האחראי שלנו בודק את לוח הזמנים בכל בוקר.'],
          ['instruct', 'verb', 'להורות / להנחות', '📋', 'The trainer instructed the new workers to wear gloves.', 'המדריך הורה לעובדים החדשים ללבוש כפפות.'],
          ['deadline', 'noun', 'מועד אחרון', '⏰', 'The deadline for the project is next Thursday.', 'המועד האחרון להגשת הפרויקט הוא ביום חמישי הבא.'],
          ['urge', 'verb', 'להפציר / לדחוק ב-', '📣', 'Doctors urge teenagers to sleep at least eight hours.', 'רופאים מפצירים בבני נוער לישון לפחות שמונה שעות.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'iceberg', translationHe: 'קרחון' },
            { wordEn: 'parachute', translationHe: 'מצנח' },
          ],
          shortSentenceEn: 'She told us to wait.',
          shortSentenceHe: 'היא אמרה לנו לחכות.',
          rule: {
            questionEn: 'Report the command: "Don’t touch the cash register!" — The manager told me _______ the cash register.',
            correct: 'not to touch',
            wrong: ['to not touching', 'don’t touch'],
            explainHe: 'פקודה שלילית בדיבור עקיף: told + מישהו + not to + פועל בסיס.',
            hintHe: 'בפקודה שלילית עקיפה המילה השוללת באה לפני to, ואחריהן פועל בסיס בלי ing.',
          },
          story: {
            passageEn:
              'On his first day at the supermarket, Eitan met his supervisor, Rachel. She told him to arrive fifteen minutes before every shift. She asked him to check the dates on the milk cartons every morning. She also told him not to leave boxes in the aisles, because customers could trip over them. By the evening, Eitan felt tired but proud.',
            passageHe:
              'ביום הראשון שלו בסופרמרקט, איתן פגש את האחראית שלו, רחל. היא אמרה לו להגיע רבע שעה לפני כל משמרת. היא ביקשה ממנו לבדוק את התאריכים על קרטוני החלב בכל בוקר. היא גם אמרה לו לא להשאיר ארגזים במעברים, כי לקוחות עלולים למעוד עליהם. עד הערב איתן הרגיש עייף אבל גאה.',
            questionEn: 'Why did Rachel tell Eitan not to leave boxes in the aisles?',
            questionHe: 'למה רחל אמרה לאיתן לא להשאיר ארגזים במעברים?',
            correct: 'Because customers could trip over them.',
            wrong: ['Because the boxes were too heavy.', 'Because the manager was coming.'],
          },
        },
      },
      {
        icon: '👑',
        isBoss: true,
        titleEn: 'Boss: The Internship Report',
        titleHe: 'אתגר הבוס: דוח ההתמחות',
        storyHookHe:
          'אתגר בוס לפרק! סיימתם שבוע התמחות בחברת הייטק, ועכשיו כותבים דוח: מה שאלו אתכם, מה ביקשו מכם ומה אמרו לכם — הכול בדיבור עקיף.',
        grammarTopic: 'Review: Reported Statements, Questions and Commands',
        skills: ['Boss Challenge', 'Reported Speech Synthesis', 'Professional Writing'],
        sentenceEn: 'The team leader asked whether I had finished the code and told me to present it on Monday.',
        sentenceHe: 'ראש הצוות שאלה אם סיימתי את הקוד ואמרה לי להציג אותו ביום שני.',
        vocab: [
          ['internship', 'noun', 'התמחות', '💼', 'The internship gave me real experience in a laboratory.', 'ההתמחות נתנה לי ניסיון אמיתי במעבדה.'],
          ['punctual', 'adjective', 'דייקן / דייקנית', '⏱️', 'Employers value workers who are punctual.', 'מעסיקים מעריכים עובדים דייקנים.'],
          ['negotiate', 'verb', 'לנהל משא ומתן', '🤝', 'She negotiated a better salary for her summer job.', 'היא ניהלה משא ומתן על משכורת טובה יותר לעבודת הקיץ שלה.'],
          ['recruit', 'verb', 'לגייס', '📢', 'The company recruits high-school students every summer.', 'החברה מגייסת תלמידי תיכון בכל קיץ.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'telescope', translationHe: 'טלסקופ' },
            { wordEn: 'avalanche', translationHe: 'מפולת שלגים' },
          ],
          shortSentenceEn: 'They asked me to stay.',
          shortSentenceHe: 'הם ביקשו ממני להישאר.',
          rule: {
            questionEn: 'Which sentence reports the question correctly?',
            correct: 'He asked me where I had put the files.',
            wrong: ['He asked me where had I put the files.', 'He asked me where did I put the files.'],
            explainHe: 'בשאלה עקיפה סדר המילים הוא של משפט רגיל: הנושא ואחריו הפועל (I had put), בלי did ובלי היפוך.',
            hintHe: 'בשאלה עקיפה לא הופכים את סדר המילים ולא מוסיפים פועל עזר של שאלה. איפה צריך לעמוד הנושא?',
          },
          story: {
            passageEn:
              'During her internship at a medical start-up in Rehovot, Shir kept a short diary. On the first day, the manager asked her what programming languages she knew. On the third day, a senior engineer told her to test a new app for nurses. She discovered two serious problems and reported them immediately. On the last day, the manager said that the company would be happy to recruit her after the army.',
            passageHe:
              'בזמן ההתמחות שלה בחברת סטארט-אפ רפואית ברחובות, שיר כתבה יומן קצר. ביום הראשון המנהל שאל אותה אילו שפות תכנות היא יודעת. ביום השלישי מהנדסת בכירה אמרה לה לבדוק אפליקציה חדשה לאחיות. היא גילתה שתי בעיות רציניות ודיווחה עליהן מיד. ביום האחרון המנהל אמר שהחברה תשמח לגייס אותה אחרי הצבא.',
            questionEn: 'What did the senior engineer tell Shir to do?',
            questionHe: 'מה המהנדסת הבכירה אמרה לשיר לעשות?',
            correct: 'To test a new app for nurses.',
            wrong: ['To write a report about the company.', 'To interview new workers.'],
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('core-plus', 1),
    titleEn: 'Season 2: Still Going Strong',
    titleHe: 'עונה 2: עדיין בתנופה',
    subtitleHe: 'Present Perfect Continuous (have / has been + V-ing): פעולות שנמשכות עד עכשיו — גמר העונה של כיתה י׳',
    badgeEmoji: '⏳',
    missions: [
      {
        icon: '🏃',
        titleEn: 'Training for the Marathon: How Long Have You Been…?',
        titleHe: 'מתאמנים למרתון: כמה זמן אתם כבר...?',
        storyHookHe:
          'הקבוצה מתאמנת למרתון ירושלים! נלמד את Present Perfect Continuous: have / has been + V-ing לפעולה שהתחילה בעבר ועדיין נמשכת, עם for, since ו-How long.',
        grammarTopic: 'Present Perfect Continuous (have / has been + V-ing) with For, Since & How Long',
        skills: ['Present Perfect Continuous', 'Duration', 'Sports Vocab'],
        sentenceEn: 'My sister has been training for the Jerusalem Marathon since January.',
        sentenceHe: 'אחותי מתאמנת למרתון ירושלים מאז ינואר.',
        vocab: [
          ['endurance', 'noun', 'סבולת / כושר עמידה', '🏃', 'Long runs build endurance and patience.', 'ריצות ארוכות בונות סבולת וסבלנות.'],
          ['athlete', 'noun', 'ספורטאי / ספורטאית', '🏅', 'Every athlete in the club follows a strict diet.', 'כל ספורטאי במועדון שומר על תזונה קפדנית.'],
          ['persevere', 'verb', 'להתמיד', '💪', 'If you persevere, you will reach the finish line.', 'אם תתמידו, תגיעו לקו הסיום.'],
          ['rehearse', 'verb', 'לעשות חזרות', '🎭', 'The choir rehearses twice a week in the school hall.', 'המקהלה עושה חזרות פעמיים בשבוע באולם בית הספר.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'cathedral', translationHe: 'קתדרלה' },
            { wordEn: 'submarine', translationHe: 'צוללת' },
          ],
          shortSentenceEn: 'She has been running daily.',
          shortSentenceHe: 'היא רצה כל יום כבר תקופה.',
          rule: {
            questionEn: 'Complete the sentence: "We _______ for the school play since September."',
            correct: 'have been rehearsing',
            wrong: ['have rehearsing', 'are been rehearsing'],
            explainHe: 'הפעולה התחילה בספטמבר ועדיין נמשכת, ולכן have been + V-ing: have been rehearsing.',
            hintHe: 'הפעולה התחילה בעבר ועדיין נמשכת. התבנית צריכה שלושה חלקים: פועל עזר של Present Perfect, צורת V3 של be, ופועל עם ing.',
          },
          story: {
            passageEn:
              'Amir is sixteen, and he has been running with a local club for two years. At first, he could only run three kilometres without stopping. Since last autumn, he has been training five times a week. His coach says that his endurance has improved a lot. Next month, Amir is going to run his first half marathon in Tel Aviv.',
            passageHe:
              'אמיר בן שש עשרה, והוא רץ עם מועדון מקומי כבר שנתיים. בהתחלה הוא יכול היה לרוץ רק שלושה קילומטרים בלי לעצור. מאז הסתיו שעבר הוא מתאמן חמש פעמים בשבוע. המאמן שלו אומר שהסבולת שלו השתפרה מאוד. בחודש הבא אמיר ירוץ את חצי המרתון הראשון שלו בתל אביב.',
            questionEn: 'How often has Amir been training since last autumn?',
            questionHe: 'באיזו תדירות אמיר מתאמן מאז הסתיו שעבר?',
            correct: 'Five times a week.',
            wrong: ['Once a week.', 'Every single day.'],
          },
        },
      },
      {
        icon: '✍️',
        titleEn: 'Busy or Done? Activity vs. Result',
        titleHe: 'עסוקים או סיימנו? פעילות מול תוצאה',
        storyHookHe:
          'כמה כתבנו, ומה עשינו כל הבוקר? נשווה בין Present Perfect Simple (התוצאה: written three pages) לבין Present Perfect Continuous (הפעילות עצמה: been writing all morning).',
        grammarTopic: 'Present Perfect Continuous vs. Present Perfect Simple',
        skills: ['Activity vs. Result', 'State Verbs', 'Project Vocab'],
        sentenceEn: 'I have been revising my essay all morning, and I have rewritten the whole introduction.',
        sentenceHe: 'כל הבוקר אני משכתב/ת את החיבור שלי, וכבר כתבתי מחדש את כל המבוא.',
        vocab: [
          ['draft', 'noun / verb', 'טיוטה / לנסח', '📝', 'My first draft was too long, so I cut it.', 'הטיוטה הראשונה שלי הייתה ארוכה מדי, אז קיצרתי אותה.'],
          ['exhausted', 'adjective', 'מותש / מותשת', '😴', 'After the long hike, everyone was exhausted.', 'אחרי הטיול הארוך כולם היו מותשים.'],
          ['progress', 'noun', 'התקדמות', '📈', 'Our teacher is happy with our progress this term.', 'המורה שלנו מרוצה מההתקדמות שלנו במחצית הזאת.'],
          ['revise', 'verb', 'לשכתב / לחזור על החומר', '✏️', 'Revise your notes the night before the test.', 'חזרו על הסיכומים שלכם בלילה שלפני המבחן.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'orchestra', translationHe: 'תזמורת' },
            { wordEn: 'harbour', translationHe: 'נמל' },
          ],
          shortSentenceEn: 'I have been writing all day.',
          shortSentenceHe: 'אני כותב/ת כל היום.',
          rule: {
            questionEn: 'Choose the correct sentence:',
            correct: 'I have known my best friend since first grade.',
            wrong: [
              'I have been knowing my best friend since first grade.',
              'I am knowing my best friend since first grade.',
            ],
            explainHe: 'know הוא פועל של מצב (state verb), ולכן משתמשים ב-Present Perfect Simple: have known, ולא been knowing.',
            hintHe: 'know הוא פועל של מצב, ופעלי מצב לא באים בצורה עם ing. איזה משפט שומר על זה?',
          },
          story: {
            passageEn:
              'Our class has been preparing a short film about water in the Negev for six weeks. So far, we have interviewed three farmers and filmed a water factory near Ashkelon. Dana has been editing the video every evening, so she is exhausted. Yesterday, the teacher watched the first draft and praised our progress. We have still not chosen the music for the ending.',
            passageHe:
              'הכיתה שלנו מכינה כבר שישה שבועות סרט קצר על מים בנגב. עד עכשיו ראיינו שלושה חקלאים וצילמנו מפעל מים ליד אשקלון. דנה עורכת את הסרטון בכל ערב, ולכן היא מותשת. אתמול המורה צפתה בטיוטה הראשונה ושיבחה את ההתקדמות שלנו. עדיין לא בחרנו את המוזיקה לסיום.',
            questionEn: 'Why is Dana exhausted?',
            questionHe: 'למה דנה מותשת?',
            correct: 'She has been editing the video every evening.',
            wrong: ['She has been filming in the desert.', 'She has been studying for an exam.'],
          },
        },
      },
      {
        icon: '👑',
        isBoss: true,
        titleEn: 'Boss: Season Finale — The Grade 10 Showcase',
        titleHe: 'אתגר הבוס: גמר העונה — תערוכת סוף כיתה י׳',
        storyHookHe:
          'גמר העונה! בתערוכת סוף השנה כל צוות מציג פרויקט שעבד עליו כל השנה. נשלב Present Perfect Simple ו-Continuous עם דיבור עקיף כדי לספר על הדרך ועל התוצאות.',
        grammarTopic: 'Review: Present Perfect Simple & Continuous in Project Presentations',
        skills: ['Boss Challenge', 'Tense Contrast', 'Presentation Skills'],
        sentenceEn: 'We have been working on this solar oven for months, and it has finally cooked its first meal.',
        sentenceHe: 'אנחנו עובדים על התנור הסולארי הזה כבר חודשים, וסוף סוף הוא בישל את הארוחה הראשונה שלו.',
        vocab: [
          ['dedication', 'noun', 'מסירות', '❤️', 'Her dedication to the project inspired the whole team.', 'המסירות שלה לפרויקט נתנה השראה לכל הצוות.'],
          ['milestone', 'noun', 'אבן דרך', '🏁', 'Finishing the first prototype was an important milestone.', 'סיום אב הטיפוס הראשון היה אבן דרך חשובה.'],
          ['accomplish', 'verb', 'להשיג / להגשים', '🏆', 'We accomplished more than we expected this year.', 'השגנו השנה יותר ממה שציפינו.'],
          ['commitment', 'noun', 'מחויבות', '🤝', 'Volunteering every week requires real commitment.', 'התנדבות בכל שבוע דורשת מחויבות אמיתית.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'microwave', translationHe: 'מיקרוגל' },
            { wordEn: 'blizzard', translationHe: 'סופת שלגים' },
          ],
          shortSentenceEn: 'We have built an oven.',
          shortSentenceHe: 'בנינו תנור.',
          rule: {
            questionEn: 'Choose the correct sentence for a finished result:',
            correct: 'Our team has built three working prototypes this year.',
            wrong: [
              'Our team has been building three working prototypes this year.',
              'Our team have been build three working prototypes this year.',
            ],
            explainHe:
              'כשמדברים על תוצאה שהושלמה וסופרים אותה (three prototypes) משתמשים ב-Present Perfect Simple: has + V3.',
            hintHe: 'כשסופרים כמה דברים הושלמו, לא משתמשים בצורה עם ing. בדקו גם את צורת V3.',
          },
          story: {
            passageEn:
              'At the end-of-year showcase, Lia and Tom presented an app that helps elderly people remember their medicine. They have been developing it since October. So far, forty families in Modi’in have tested it. A visiting engineer asked them how they had found the families. Tom explained that they had worked with the local community centre.',
            passageHe:
              'בתערוכת סוף השנה, ליה ותום הציגו אפליקציה שעוזרת לאנשים מבוגרים לזכור את התרופות שלהם. הם מפתחים אותה מאז אוקטובר. עד עכשיו ארבעים משפחות במודיעין בדקו אותה. מהנדסת שביקרה בתערוכה שאלה אותם איך הם מצאו את המשפחות. תום הסביר שהם עבדו עם המתנ״ס המקומי.',
            questionEn: 'Since when have they been developing the app?',
            questionHe: 'ממתי הם מפתחים את האפליקציה?',
            correct: 'Since October.',
            wrong: ['Since last summer.', 'Since the end of ninth grade.'],
          },
        },
      },
    ],
  },
];

export const CORE_PLUS_GRADE_10_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildHighSchoolGrade('grade-10', UNITS);
