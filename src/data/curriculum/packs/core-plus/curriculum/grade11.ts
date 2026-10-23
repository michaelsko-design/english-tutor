import { buildHighSchoolGrade, type HighSchoolUnitSpec } from '../../../highSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

const UNITS: HighSchoolUnitSpec[] = [
  {
    ...packUnitNumbers('core-plus', 0),
    titleEn: 'Wishes, Regrets & If Only',
    titleHe: 'משאלות, חרטות ו-If only',
    subtitleHe: 'עונה 2: הבעת משאלות על ההווה ועל העבר (I wish / If only + Past Simple / Past Perfect)',
    badgeEmoji: '🌟',
    missions: [
      {
        icon: '💭',
        titleEn: 'Wishing for a Different Present',
        titleHe: 'משאלה להווה אחר',
        storyHookHe:
          'הרפתקת בונוס של עונה 2: איך מביעים רצון שהמצב עכשיו יהיה אחר? נלמד את המבנה I wish / If only + Past Simple, שמדבר על ההווה למרות שהפועל נראה כמו עבר.',
        grammarTopic: 'I wish / If only + Past Simple (wishes about the present)',
        skills: ['Wish Clauses', 'Expressing Desire', 'Character Analysis'],
        sentenceEn: 'Dana wishes she lived closer to the sea, but her family cannot move.',
        sentenceHe: 'דנה הייתה רוצה לגור קרוב יותר לים, אבל המשפחה שלה לא יכולה לעבור.',
        vocab: [
          [
            'yearn',
            'verb',
            'להשתוקק / לערוג',
            '💭',
            'Many teenagers yearn for more freedom and independence.',
            'בני נוער רבים משתוקקים ליותר חופש ועצמאות.',
          ],
          [
            'aspiration',
            'noun',
            'שאיפה / מטרה רחוקה',
            '🚀',
            'Her greatest aspiration is to design sustainable buildings.',
            'השאיפה הגדולה ביותר שלה היא לתכנן מבנים ירוקים.',
          ],
          [
            'envious',
            'adjective',
            'מקנא / קנאי',
            '👀',
            'He felt envious of his cousin\'s new apartment in Haifa.',
            'הוא הרגיש קנאה בדירה החדשה של בן דודו בחיפה.',
          ],
          [
            'circumstance',
            'noun',
            'נסיבה / מצב',
            '🧭',
            'We cannot always control the circumstances of our lives.',
            'איננו יכולים תמיד לשלוט בנסיבות חיינו.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'neglect', translationHe: 'להזניח' },
            { wordEn: 'refuse', translationHe: 'לסרב' },
          ],
          shortSentenceEn: 'I wish I had wings.',
          shortSentenceHe: 'הלוואי שהיו לי כנפיים.',
          rule: {
            questionEn: 'Which sentence expresses a wish about the PRESENT correctly?',
            correct: 'I wish I knew the answer to this riddle.',
            wrong: ['I wish I know the answer to this riddle.', 'I wish I will know the answer to this riddle.'],
            explainHe:
              'משאלה על ההווה בנויה מ-I wish + Past Simple: I wish I knew. הפועל נראה כמו עבר, אבל המשמעות היא "הלוואי שידעתי עכשיו".',
            hintHe: 'משאלה על ההווה "זזה" זמן אחד אחורה. איזה פועל כתוב בצורת עבר, למרות שמדובר על עכשיו?',
          },
          story: {
            passageEn:
              'Noam is seventeen and lives in a small town in the Negev. He yearns to study film, but the nearest film school is three hours away. "If only there were a bus that left earlier," he often says. His aspiration keeps him busy: every weekend he edits short videos about his neighbours.',
            passageHe:
              'נועם בן שבע-עשרה וגר בעיירה קטנה בנגב. הוא משתוקק ללמוד קולנוע, אבל בית הספר לקולנוע הקרוב נמצא במרחק שלוש שעות. "הלוואי שהיה אוטובוס שיוצא מוקדם יותר," הוא אומר לעתים קרובות. השאיפה שלו מעסיקה אותו: בכל סוף שבוע הוא עורך סרטונים קצרים על השכנים שלו.',
            questionEn: 'What does Noam do every weekend?',
            questionHe: 'מה נועם עושה בכל סוף שבוע?',
            correct: 'He edits short videos about his neighbours.',
            wrong: ['He travels to the film school by bus.', 'He works in a cinema in the Negev.'],
          },
        },
      },
      {
        icon: '⏪',
        titleEn: 'If Only I Had Known: Past Regrets',
        titleHe: 'אילו רק ידעתי: חרטות על העבר',
        storyHookHe:
          'לפעמים מסתכלים אחורה ומצטערים על בחירה. נלמד את המבנה I wish / If only + Past Perfect (had + V3) לתיאור חרטה על משהו שכבר קרה.',
        grammarTopic: 'I wish / If only + Past Perfect (regrets about the past)',
        skills: ['Wish Clauses', 'Expressing Regret', 'Third Conditional Review'],
        sentenceEn: 'If only the captain had checked the weather report before the voyage.',
        sentenceHe: 'אילו רק הקברניט היה בודק את תחזית מזג האוויר לפני ההפלגה.',
        vocab: [
          [
            'regret',
            'noun',
            'חרטה / צער על מעשה',
            '😢',
            'She has no regret about leaving the team.',
            'אין לה שום חרטה על כך שעזבה את הקבוצה.',
          ],
          [
            'hindsight',
            'noun',
            'חוכמה בדיעבד / מבט לאחור',
            '🔎',
            'In hindsight, the decision was clearly a mistake.',
            'במבט לאחור, ההחלטה הייתה בבירור טעות.',
          ],
          [
            'reckless',
            'adjective',
            'פזיז / חסר אחריות',
            '⚡',
            'Reckless driving causes many accidents on our roads.',
            'נהיגה פזיזה גורמת לתאונות רבות בכבישים שלנו.',
          ],
          [
            'reconcile',
            'verb',
            'להתפייס / ליישב מחלוקת',
            '🤝',
            'The two brothers finally reconciled after years of silence.',
            'שני האחים התפייסו לבסוף אחרי שנים של שתיקה.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'foresight', translationHe: 'ראיית הנולד' },
            { wordEn: 'pride', translationHe: 'גאווה' },
          ],
          shortSentenceEn: 'If only I had listened.',
          shortSentenceHe: 'אילו רק הקשבתי.',
          rule: {
            questionEn: 'Which sentence expresses regret about the PAST correctly?',
            correct: 'I wish I had saved my work before the computer crashed.',
            wrong: [
              'I wish I saved my work before the computer crashed.',
              'I wish I would save my work before the computer crashed.',
            ],
            explainHe:
              'חרטה על העבר בנויה מ-I wish + Past Perfect (had + V3). המחשב כבר קרס, ולכן משתמשים ב-had saved.',
            hintHe: 'האירוע כבר קרה ואי אפשר לשנות אותו. כדאי לחפש את המבנה שזז זמן אחד אחורה מהעבר הפשוט.',
          },
          story: {
            passageEn:
              'Yael and her best friend argued about a school project and stopped talking for a whole year. In hindsight, the argument was about something very small. "I wish I had called her that same evening," Yael admits. Last month the two friends finally reconciled at a mutual friend\'s birthday party.',
            passageHe:
              'יעל והחברה הכי טובה שלה רבו על פרויקט בבית הספר והפסיקו לדבר שנה שלמה. במבט לאחור, הוויכוח היה על משהו קטן מאוד. "הלוואי שהייתי מתקשרת אליה באותו ערב," יעל מודה. בחודש שעבר שתי החברות התפייסו לבסוף במסיבת יום הולדת של חברה משותפת.',
            questionEn: 'Where did the two friends finally make peace?',
            questionHe: 'איפה שתי החברות השלימו לבסוף?',
            correct: 'At a mutual friend\'s birthday party.',
            wrong: ['In the school library after the project.', 'On the phone that same evening.'],
          },
        },
      },
      {
        icon: '🔮',
        isBoss: true,
        titleEn: 'Boss: The Three Wishes Unseen',
        titleHe: 'בוס: קטע Unseen של שלוש המשאלות',
        storyHookHe:
          'משימת בוס של עונה 2: סיפור עממי על שלוש משאלות שמתגשמות בדרך מפתיעה. עליכם להבחין בין משאלה על ההווה לחרטה על העבר ולענות על שאלות ברמת בגרות!',
        grammarTopic: 'Wish Clauses Synthesis (Present & Past)',
        skills: ['Wish Clauses Mastery', 'Folk Tale Analysis', 'Bagrut Unseen'],
        sentenceEn: 'The old fisherman wished he had asked for wisdom instead of gold.',
        sentenceHe: 'הדייג הזקן התחרט שלא ביקש חוכמה במקום זהב.',
        vocab: [
          [
            'grant',
            'verb',
            'להעניק / להגשים (משאלה)',
            '🎁',
            'The magic fish agreed to grant him three wishes.',
            'דג הקסמים הסכים להגשים לו שלוש משאלות.',
          ],
          [
            'nostalgia',
            'noun',
            'נוסטלגיה / געגוע לעבר',
            '📷',
            'Old family photos fill my grandfather with nostalgia.',
            'תמונות משפחתיות ישנות ממלאות את סבי בנוסטלגיה.',
          ],
          [
            'ambition',
            'noun',
            'שאפתנות / יומרה',
            '🏔️',
            'Without ambition, talent alone rarely leads to success.',
            'בלי שאפתנות, כישרון לבדו רק לעתים רחוקות מוביל להצלחה.',
          ],
          [
            'sacrifice',
            'noun',
            'הקרבה / ויתור',
            '❤️',
            'Raising a family often requires personal sacrifice.',
            'גידול משפחה דורש לעתים קרובות הקרבה אישית.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'deny', translationHe: 'לשלול / להכחיש' },
            { wordEn: 'borrow', translationHe: 'לשאול / ללוות' },
          ],
          shortSentenceEn: 'The fish granted three wishes.',
          shortSentenceHe: 'הדג הגשים שלוש משאלות.',
          rule: {
            questionEn: 'Which sentence is about the PAST, not the present?',
            correct: 'If only he had stayed in his village.',
            wrong: ['If only he stayed in his village.', 'If only he were in his village.'],
            explainHe:
              'had stayed הוא Past Perfect, ולכן המשאלה מדברת על העבר. stayed ו-were במשאלה מדברים על ההווה.',
            hintHe: 'שתי אפשרויות מדברות על עכשיו. איזו משתמשת בצורה של "עבר לפני העבר"?',
          },
          story: {
            passageEn:
              'In an old folk tale, a poor fisherman catches a golden fish that can speak. In return for its freedom, the fish grants him three wishes. First he asks for a palace, then for a mountain of gold. Lonely in his huge palace, he finally wishes he had stayed in his little hut with his friends.',
            passageHe:
              'בסיפור עם עתיק, דייג עני תופס דג זהב שיודע לדבר. בתמורה לחירותו, הדג מגשים לו שלוש משאלות. תחילה הוא מבקש ארמון, ואחר כך הר של זהב. בודד בארמון הענק שלו, הוא מתחרט לבסוף שלא נשאר בבקתה הקטנה שלו עם חבריו.',
            questionEn: 'Why does the fisherman feel regret at the end of the tale?',
            questionHe: 'למה הדייג מתחרט בסוף הסיפור?',
            correct: 'He is lonely in his huge palace.',
            wrong: ['The fish takes back the mountain of gold.', 'His hut is destroyed by a storm.'],
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('core-plus', 1),
    titleEn: 'Getting Things Done: The Causative',
    titleHe: 'לדאוג שיעשו בשבילנו: הגרם (Causative)',
    subtitleHe: 'עונה 2: have / get something done, שירותים, תיקונים וסיום העונה',
    badgeEmoji: '🛠️',
    missions: [
      {
        icon: '🏗️',
        titleEn: 'Have It Done: Services & Renovations',
        titleHe: 'Have it done: שירותים ושיפוצים',
        storyHookHe:
          'כשאנחנו לא עושים משהו בעצמנו אלא משלמים למישהו אחר שיעשה אותו, משתמשים בגרם (Causative): have + object + V3. נצא להרפתקת שיפוץ של דירה ישנה!',
        grammarTopic: 'Causative: have + object + V3',
        skills: ['Causative Have', 'Passive Voice Review', 'Everyday Services'],
        sentenceEn: 'The Levi family had their old kitchen renovated by a local company last spring.',
        sentenceHe: 'משפחת לוי שיפצה את המטבח הישן שלה בעזרת חברה מקומית באביב שעבר.',
        vocab: [
          [
            'renovate',
            'verb',
            'לשפץ / לחדש',
            '🏗️',
            'The city plans to renovate the old train station.',
            'העירייה מתכננת לשפץ את תחנת הרכבת הישנה.',
          ],
          [
            'technician',
            'noun',
            'טכנאי',
            '🛠️',
            'A technician came to fix the air conditioner.',
            'טכנאי הגיע לתקן את המזגן.',
          ],
          [
            'appliance',
            'noun',
            'מכשיר חשמלי ביתי',
            '🔌',
            'Modern kitchen appliances save a lot of electricity.',
            'מכשירי מטבח מודרניים חוסכים הרבה חשמל.',
          ],
          [
            'install',
            'verb',
            'להתקין',
            '🔧',
            'We need to install solar panels on the roof.',
            'אנחנו צריכים להתקין פאנלים סולאריים על הגג.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'demolish', translationHe: 'להרוס' },
            { wordEn: 'abandon', translationHe: 'לנטוש' },
          ],
          shortSentenceEn: 'We had the roof repaired.',
          shortSentenceHe: 'תיקנו את הגג (בעזרת בעל מקצוע).',
          rule: {
            questionEn: 'Which sentence shows that someone ELSE did the work for Ron?',
            correct: 'Ron had his car washed at the station.',
            wrong: ['Ron washed his car at the station.', 'Ron had washed his car at the station.'],
            explainHe:
              'have + object + V3 (had his car washed) אומר שמישהו אחר עשה את העבודה בשביל רון. had washed his car הוא Past Perfect: רון עשה זאת בעצמו.',
            hintHe: 'בגרם החפץ בא לפני הפועל בצורת V3. בדקו איפה נמצא his car בכל משפט.',
          },
          story: {
            passageEn:
              'When Grandma Rivka bought an old apartment in Jaffa, nothing worked properly. She had the walls painted and the windows replaced in the first month. Then a technician installed new appliances in the kitchen. Today the apartment looks modern, but it still keeps its beautiful old arches.',
            passageHe:
              'כשסבתא רבקה קנתה דירה ישנה ביפו, שום דבר לא עבד כמו שצריך. בחודש הראשון היא דאגה שיצבעו את הקירות ויחליפו את החלונות. אחר כך טכנאי התקין מכשירים חדשים במטבח. היום הדירה נראית מודרנית, אבל היא עדיין שומרת על הקשתות הישנות והיפות שלה.',
            questionEn: 'What did the apartment keep after the renovation?',
            questionHe: 'על מה הדירה שמרה אחרי השיפוץ?',
            correct: 'Its beautiful old arches.',
            wrong: ['Its old kitchen appliances.', 'Its original windows.'],
          },
        },
      },
      {
        icon: '✂️',
        titleEn: 'Get It Done: Tailors, Portraits & Inspections',
        titleHe: 'Get it done: חייטים, דיוקנאות ובדיקות',
        storyHookHe:
          'בשפה מדוברת אומרים לעתים קרובות get + object + V3 במקום have. נלמד מתי משתמשים בו, ואיך משנים את הזמן דרך הפועל get עצמו (got, will get, is getting).',
        grammarTopic: 'Causative: get + object + V3 & tense changes',
        skills: ['Causative Get', 'Tense Control', 'Informal Register'],
        sentenceEn: 'Before the prom, Maya got her grandmother\'s dress altered by a skilled tailor.',
        sentenceHe: 'לפני הנשף, מאיה דאגה שחייט מיומן יתאים לה את השמלה של סבתה.',
        vocab: [
          [
            'alter',
            'verb',
            'לשנות / להתאים (בגד)',
            '✂️',
            'The new evidence may alter the result of the trial.',
            'הראיות החדשות עשויות לשנות את תוצאת המשפט.',
          ],
          [
            'tailor',
            'noun',
            'חייט',
            '🧵',
            'My uncle has worked as a tailor for forty years.',
            'הדוד שלי עובד כחייט כבר ארבעים שנה.',
          ],
          [
            'portrait',
            'noun',
            'דיוקן / תמונת פנים',
            '🖼️',
            'A famous artist painted a portrait of the queen.',
            'אמן מפורסם צייר דיוקן של המלכה.',
          ],
          [
            'inspect',
            'verb',
            'לבדוק / לפקח',
            '🔍',
            'Officials inspect every restaurant twice a year.',
            'פקחים בודקים כל מסעדה פעמיים בשנה.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'preserve', translationHe: 'לשמר' },
            { wordEn: 'ignore', translationHe: 'להתעלם' },
          ],
          shortSentenceEn: 'She got her hair cut.',
          shortSentenceHe: 'היא הסתפרה (אצל ספר).',
          rule: {
            questionEn: 'Choose the correct FUTURE causative: "Next week we ____ the boiler checked."',
            correct: 'will get',
            wrong: ['got', 'are getting to'],
            explainHe:
              'בגרם הזמן משתנה רק בפועל get או have. Next week מראה עתיד, ולכן will get, ואחריו החפץ ו-V3 (the boiler checked).',
            hintHe: 'הביטוי Next week מראה מתי זה יקרה. רק הפועל הראשון משנה זמן; checked נשאר תמיד אותו דבר.',
          },
          story: {
            passageEn:
              'Every summer, the Cohen family gets a portrait taken at the same beach in Netanya. This year, however, the camera fell into the sand. Instead of buying a new one, they got it inspected at a small repair shop. The owner fixed it in one hour, and the family portrait was taken at sunset as usual.',
            passageHe:
              'בכל קיץ משפחת כהן מצטלמת לתמונה משפחתית באותו חוף בנתניה. אבל השנה המצלמה נפלה לחול. במקום לקנות מצלמה חדשה, הם דאגו שיבדקו אותה בחנות תיקונים קטנה. הבעלים תיקן אותה בתוך שעה, והתמונה המשפחתית צולמה בשקיעה כרגיל.',
            questionEn: 'What happened to the camera this year?',
            questionHe: 'מה קרה למצלמה השנה?',
            correct: 'It fell into the sand.',
            wrong: ['It was stolen on the beach.', 'It was left at home in Netanya.'],
          },
        },
      },
      {
        icon: '🏆',
        isBoss: true,
        titleEn: 'Boss: Season Finale: The Wedding Planner Unseen',
        titleHe: 'בוס: גמר העונה — Unseen של מתכננת החתונות',
        storyHookHe:
          'גמר עונה 2! מתכננת אירועים דואגת שכל פרט בחתונה ייעשה בידי אנשי מקצוע. עליכם לזהות מי עשה מה, לשלב have ו-get בזמנים שונים ולפצח קטע Unseen מלא!',
        grammarTopic: 'Causative have / get Synthesis & Season Review',
        skills: ['Causative Mastery', 'Wish Clauses Review', 'Bagrut Unseen'],
        sentenceEn: 'Instead of cooking for two hundred guests, the couple had the meal prepared by caterers.',
        sentenceHe: 'במקום לבשל למאתיים אורחים, בני הזוג הזמינו את הארוחה מחברת קייטרינג.',
        vocab: [
          [
            'outsource',
            'verb',
            'להעביר עבודה לגורם חיצוני / מיקור חוץ',
            '📦',
            'Many companies outsource their customer service abroad.',
            'חברות רבות מעבירות את שירות הלקוחות שלהן לחו"ל.',
          ],
          [
            'convenience',
            'noun',
            'נוחות',
            '🛋️',
            'Online banking offers great convenience to busy people.',
            'בנקאות מקוונת מציעה נוחות רבה לאנשים עסוקים.',
          ],
          [
            'invoice',
            'noun',
            'חשבונית',
            '📄',
            'The plumber sent us an invoice for the repairs.',
            'השרברב שלח לנו חשבונית על התיקונים.',
          ],
          [
            'maintenance',
            'noun',
            'תחזוקה',
            '⚙️',
            'Regular maintenance keeps old buildings safe.',
            'תחזוקה קבועה שומרת על בניינים ישנים בטוחים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'volunteer', translationHe: 'להתנדב' },
            { wordEn: 'hesitate', translationHe: 'להסס' },
          ],
          shortSentenceEn: 'They had invitations printed.',
          shortSentenceHe: 'הם הדפיסו הזמנות (בבית דפוס).',
          rule: {
            questionEn: 'Which sentence is a correct causative in the Present Perfect?',
            correct: 'We have just had the invitations designed by an artist.',
            wrong: [
              'We have just the invitations had designed by an artist.',
              'We have just had designed the invitations by an artist.',
            ],
            explainHe:
              'בגרם הסדר קבוע: have/get בזמן הנכון (have had), אחריו החפץ (the invitations), ורק אז V3 (designed).',
            hintHe: 'בדקו את הסדר: הפועל שמראה זמן, אחריו הדבר שעליו עובדים, ובסוף הפועל בצורת V3.',
          },
          story: {
            passageEn:
              'Tamar runs a small wedding-planning business in the Galilee. She believes that couples should enjoy their wedding day, so she outsources almost every task. She has the flowers arranged by a local florist and gets the music played by a student band. At the end, every couple receives one clear invoice instead of twenty different bills.',
            passageHe:
              'תמר מנהלת עסק קטן לתכנון חתונות בגליל. היא מאמינה שזוגות צריכים ליהנות מיום החתונה שלהם, ולכן היא מעבירה כמעט כל משימה לאנשי מקצוע. היא דואגת שמשתלה מקומית תסדר את הפרחים ושלהקת סטודנטים תנגן את המוזיקה. בסוף, כל זוג מקבל חשבונית ברורה אחת במקום עשרים חשבונות שונים.',
            questionEn: 'What does every couple receive at the end?',
            questionHe: 'מה מקבל כל זוג בסוף?',
            correct: 'One clear invoice instead of twenty bills.',
            wrong: ['A free concert by a student band.', 'A discount from a local florist.'],
          },
        },
      },
    ],
  },
];

/** The core-plus pack's grade 11 units: wish / if only, then the causative (the grade's new finale). */
export const CORE_PLUS_GRADE_11_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildHighSchoolGrade('grade-11', UNITS);
