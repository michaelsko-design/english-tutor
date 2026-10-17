import { buildHighSchoolGrade, HighSchoolUnitSpec } from './builder';

const units: HighSchoolUnitSpec[] = [
  {
    titleEn: 'Unit 1: Global Youth Summit & Environment',
    titleHe: 'פרק 1: ועידת הנוער העולמית ומשבר האקלים',
    subtitleHe: 'מבנה הסביל (Passive Voice), קיימות ואוצר מילים Band III',
    badgeEmoji: '🌍',
    missions: [
      {
        icon: '🌱',
        titleEn: 'Protecting Our Planet: Passive Action',
        titleHe: 'שומרים על כדור הארץ: משפטי סביל',
        storyHookHe:
          'הצטרפתם לוועידת האקלים העולמית של בני נוער! נלמד לתאר יוזמות סביבתיות במבנה סביל (Passive Voice) כשהפעולה חשובה יותר ממבצע הפעולה.',
        grammarTopic: 'Passive Voice (Present Simple: is/are + V3)',
        skills: ['Passive Voice', 'Band III Environment', 'Bagrut Unseen'],
        sentenceEn: 'Millions of plastic bottles are recycled every year around the world.',
        sentenceHe: 'מיליוני בקבוקי פלסטיק ממוחזרים מדי שנה ברחבי העולם.',
        vocab: [
          [
            'consequence',
            'noun',
            'תוצאה / השלכה',
            '💥',
            'Pollution has serious consequences for marine life.',
            'לזיהום יש השלכות חמורות על החיים בים.',
          ],
          [
            'sustainable',
            'adjective',
            'בר-קיימא / סביבתי',
            '🌱',
            'We must build sustainable cities for future generations.',
            'עלינו לבנות ערים בנות-קיימא עבור הדורות הבאים.',
          ],
          [
            'implement',
            'verb',
            'ליישם / להוציא לפועל',
            '🛠️',
            'The school implemented a new recycling program.',
            'בית הספר יישם תוכנית מחזור חדשה.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'solution', translationHe: 'פתרון' },
            { wordEn: 'obstacle', translationHe: 'מכשול' },
          ],
          shortSentenceEn: 'Plastic bottles are recycled.',
          shortSentenceHe: 'בקבוקי פלסטיק ממוחזרים.',
          rule: {
            questionEn: 'How is the Passive Voice formed in Present Simple?',
            correct: 'am / is / are + V3 (Past Participle)',
            wrong: ['was / were + base verb', 'have / has + -ing form'],
            explainHe:
              'בסביל בהווה (Present Simple Passive) משתמשים בפועל to be בהווה (am / is / are) ואחריו צורת הפועל השלישית (V3).',
            hintHe: 'סביל בהווה צריך צורה של הפועל להיות בהווה, ואחריה צורת הפועל השלישית. איזו תשובה עונה על שני התנאים?',
          },
          story: {
            passageEn:
              'In a small coastal town, thousands of plastic bottles are collected by youth volunteers every Saturday. The collected waste is recycled into eco-friendly school benches. The town mayor praised the teenagers for their dedication to a sustainable future.',
            passageHe:
              'בעיירת חוף קטנה, אלפי בקבוקי פלסטיק נאספים על ידי מתנדבים צעירים בכל יום שבת. הפסולת שנאספת ממוחזרת לספסלי בית ספר ידידותיים לסביבה. ראש העיר שיבח את בני הנוער על מסירותם לעתיד בר-קיימא.',
            questionEn: 'What is done with the plastic bottles that are collected?',
            questionHe: 'מה נעשה עם בקבוקי הפלסטיק שנאספים?',
            correct: 'They are recycled into eco-friendly school benches.',
            wrong: ['They are thrown into the ocean.', 'They are burned in local factories.'],
          },
        },
      },
      {
        icon: '🏙️',
        titleEn: 'Sustainable Cities & Clean Tech',
        titleHe: 'ערים בנות-קיימא וטכנולוגיה ירוקה',
        storyHookHe:
          'מה הופך עיר למודרנית וירוקה? נלמד על אנרגיה מתחדשת ותחבורה חכמה במבנה סביל בעבר (was/were + V3).',
        grammarTopic: 'Passive Voice (Past Simple: was/were + V3)',
        skills: ['Past Passive', 'Clean Tech', 'Contextual Reading'],
        sentenceEn: 'The solar panels were installed on public roofs last month.',
        sentenceHe: 'לוחות השמש הותקנו על גגות ציבוריים בחודש שעבר.',
        vocab: [
          [
            'efficient',
            'adjective',
            'יעיל / חסכוני',
            '⚡',
            'Solar energy is an efficient power source.',
            'אנרגיה סולארית היא מקור כוח יעיל.',
          ],
          [
            'generate',
            'verb',
            'לייצר / להפיק',
            '🏭',
            'Wind farms generate clean electricity.',
            'חוות רוח מפיקות חשמל נקי.',
          ],
          [
            'urban',
            'adjective',
            'עירוני',
            '🏙️',
            'Urban areas produce a lot of waste.',
            'אזורים עירוניים מייצרים פסולת רבה.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'fragile', translationHe: 'שביר' },
            { wordEn: 'remote', translationHe: 'מרוחק' },
          ],
          shortSentenceEn: 'Solar panels were installed.',
          shortSentenceHe: 'לוחות סולאריים הותקנו.',
          rule: {
            questionEn: 'Which sentence is correctly written in the Past Simple Passive?',
            correct: 'The modern bridge was completed in 2024.',
            wrong: ['The modern bridge was complete in 2024.', 'The modern bridge did completed in 2024.'],
            explainHe:
              'בסביל בעבר משתמשים ב-was (ליחיד) או were (לרבים) ולאחריו צורת ה-V3 של הפועל (was completed ולא was complete).',
            hintHe: 'סביל בעבר בנוי מ-was / were + V3. האם complete כתוב כאן בצורת V3? ו-did לא משמש בסביל.',
          },
          story: {
            passageEn:
              'Last year, smart sensors were placed across the capital city to monitor air quality. The real-time data was shared directly with citizens via a mobile app. Consequently, traffic was redirected away from congested streets during peak pollution hours.',
            passageHe:
              'בשנה שעברה, חיישנים חכמים הוצבו ברחבי עיר הבירה כדי לנטר את איכות האוויר. הנתונים בזמן אמת שותפו ישירות עם התושבים באמצעות אפליקציה לנייד. כתוצאה מכך, התנועה נותבה מחדש הרחק מרחובות עמוסים בשעות שיא הזיהום.',
            questionEn: 'How was the air quality data shared with the citizens?',
            questionHe: 'כיצד שותפו נתוני איכות האוויר עם התושבים?',
            correct: 'Through a dedicated mobile application.',
            wrong: ['Through weekly printed newspapers.', 'Through television broadcasts only.'],
          },
        },
      },
      {
        icon: '👑',
        isBoss: true,
        titleEn: 'Boss: Global Youth Summit Unseen',
        titleHe: 'בוס: ועידת הנוער העולמית — אתגר אנסין',
        storyHookHe:
          'משימת בוס עיונית: עליכם לנתח נאום רשמי מוועידת האקלים הבינלאומית, לזהות משפטי סביל ולענות על שאלות הבנה מעמיקות!',
        grammarTopic: 'Passive Voice Synthesis (Present & Past)',
        skills: ['Passive Synthesis', 'Academic Discourse', 'Bagrut Unseen Mastery'],
        sentenceEn: 'Significant solutions were proposed by youth leaders who were invited to the summit.',
        sentenceHe: 'פתרונות משמעותיים הוצעו על ידי מנהיגי נוער שהוזמנו לפסגה.',
        vocab: [
          [
            'initiative',
            'noun',
            'יוזמה',
            '💡',
            'The youth initiative received international recognition.',
            'יוזמת הנוער זכתה להכרה בינלאומית.',
          ],
          [
            'collaborate',
            'verb',
            'לשתף פעולה',
            '🤝',
            'Scientists and students collaborate on ocean research.',
            'מדענים ותלמידים משתפים פעולה בחקר האוקיינוסים.',
          ],
          [
            'essential',
            'adjective',
            'חיוני / הכרחי',
            '⭐',
            'Clean water is essential for all living creatures.',
            'מים נקיים חיוניים לכל היצורים החיים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'hesitation', translationHe: 'היסוס' },
            { wordEn: 'disregard', translationHe: 'התעלמות' },
          ],
          shortSentenceEn: 'Great initiatives were proposed.',
          shortSentenceHe: 'יוזמות נהדרות הוצעו.',
          rule: {
            questionEn: 'Choose the correct Passive form: "New laws _______ by parliament tomorrow."',
            correct: 'will be enacted',
            wrong: ['will enacted', 'are enact'],
            explainHe:
              'סביל בעתיד נבנה באמצעות will be בתוספת הפועל השלישי (will be enacted).',
            hintHe: 'סביל בעתיד צריך שלושה חלקים: will, צורת הבסיס של הפועל להיות, ואז V3.',
          },
          story: {
            passageEn:
              'At the Youth Climate Summit in Geneva, ambitious proposals were presented by delegates from forty countries. An international youth council was formed to supervise renewable energy projects in developing regions. Millions of dollars were pledged by environmental funds to support these young innovators.',
            passageHe:
              'בוועידת האקלים לנוער בז׳נבה, הצעות שאפתניות הוצגו על ידי נציגים מארבעים מדינות. מועצת נוער בינלאומית הוקמה כדי לפקח על פרויקטים של אנרגיה מתחדשת באזורים מתפתחים. מיליוני דולרים הובטחו על ידי קרנות סביבתיות לתמיכה בחדשנים צעירים אלה.',
            questionEn: 'What was the main purpose of forming the international youth council?',
            questionHe: 'מה הייתה המטרה העיקרית של הקמת מועצת הנוער הבינלאומית?',
            correct: 'To supervise renewable energy projects in developing regions.',
            wrong: ['To organize sports competitions in Geneva.', 'To cancel international research funds.'],
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 2: Media Literacy & Digital Footprints',
    titleHe: 'פרק 2: אוריינות תקשורת ועקבות דיגיטליים',
    subtitleHe: 'פסוקיות יחסיות (Relative Clauses), זיהוי מקורות והערכת מידע',
    badgeEmoji: '📱',
    missions: [
      {
        icon: '🔍',
        titleEn: 'The Truth Behind Fake News',
        titleHe: 'האמת מאחורי פייק ניוז',
        storyHookHe:
          'איך מזהים עובדה מול שמועה ברשת? נלמד להשתמש בפסוקיות יחסיות מגדירות (Defining Relative Clauses) עם who, which ו-that.',
        grammarTopic: 'Defining Relative Clauses (who, which, that)',
        skills: ['Relative Clauses', 'Media Literacy', 'Fact Checking'],
        sentenceEn: 'Journalists who verify their sources ensure that information is reliable.',
        sentenceHe: 'עיתונאים שמאמתים את מקורותיהם מבטיחים שהמידע מהימן.',
        vocab: [
          [
            'reliable',
            'adjective',
            'מהימן / אמין',
            '✅',
            'Always check whether your news source is reliable.',
            'בדקו תמיד האם מקור החדשות שלכם מהימן.',
          ],
          [
            'misleading',
            'adjective',
            'מטעה',
            '⚠️',
            'The headline was misleading and created panic.',
            'הכותרת הייתה מטעה ויצרה בהלה.',
          ],
          [
            'verify',
            'verb',
            'לאמת / לוודא',
            '🔍',
            'Researchers must verify data before publication.',
            'חוקרים חייבים לאמת נתונים לפני הפרסום.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'fabricated', translationHe: 'מומצא / מפוברק' },
            { wordEn: 'casual', translationHe: 'מקרי / לא רשמי' },
          ],
          shortSentenceEn: 'Journalists verify facts carefully.',
          shortSentenceHe: 'עיתונאים מאמתים עובדות בקפידה.',
          rule: {
            questionEn: 'Which relative pronoun is used specifically for people?',
            correct: 'who',
            wrong: ['which', 'where'],
            explainHe:
              'משתמשים בכינוי הזיקה who עבור בני אדם (למשל: The student who studied passed the test), בעוד ש-which משמש עבור חפצים או בעלי חיים.',
            hintHe: 'כדאי לנסות משפט כמו: The girl ___ sings is my friend. איזו מילה מתאימה לאדם?',
          },
          story: {
            passageEn:
              'A viral video claimed that a rare comet would hit Earth next Tuesday. High school students who followed astronomy blogs decided to investigate the claim. They verified the dates with NASA scientists and proved that the video was completely fabricated.',
            passageHe:
              'סרטון ויראלי טען כי שביט נדיר יפגע בכדור הארץ ביום שלישי הקרוב. תלמידי תיכון שעקבו אחרי בלוגים של אסטרונומיה החליטו לחקור את הטענה. הם אימתו את התאריכים מול מדעני נאס״א והוכיחו כי הסרטון היה מפוברק לחלוטין.',
            questionEn: 'How did the high school students prove the video was false?',
            questionHe: 'כיצד הוכיחו תלמידי התיכון שהסרטון היה שקרי?',
            correct: 'By verifying the scientific dates with NASA experts.',
            wrong: ['By deleting their social media accounts.', 'By interviewing the video creator.'],
          },
        },
      },
      {
        icon: '🌐',
        titleEn: 'Digital Footprints & Privacy',
        titleHe: 'עקבות דיגיטליים ופרטיות ברשת',
        storyHookHe:
          'כל פעולה שלנו ברשת משאירה עקבות. נלמד להשתמש בפסוקיות יחסיות לא-מגדירות (Non-Defining Relative Clauses) המופרדות בפסיקים.',
        grammarTopic: 'Non-Defining Relative Clauses (which, who with commas)',
        skills: ['Non-Defining Clauses', 'Digital Safety', 'Punctuation'],
        sentenceEn: 'Social platforms, which collect user data, must respect privacy regulations.',
        sentenceHe: 'פלטפורמות חברתיות, שאוספות נתוני משתמשים, חייבות לכבד תקנות פרטיות.',
        vocab: [
          [
            'exaggerate',
            'verb',
            'להגזים',
            '📢',
            'Online influencers often exaggerate the results.',
            'משפיעני רשת לעיתים קרובות מגזימים בתוצאות.',
          ],
          [
            'credible',
            'adjective',
            'אמין / בעל אמינות',
            '🎖️',
            'The documentary was based on credible scientific research.',
            'הסרט התיעודי התבסס על מחקר מדעי אמין.',
          ],
          [
            'privacy',
            'noun',
            'פרטיות',
            '🔒',
            'Protecting personal privacy is essential online.',
            'הגנה על פרטיות אישית חיונית ברשת.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'minimize', translationHe: 'למזער' },
            { wordEn: 'neglect', translationHe: 'להזניח' },
          ],
          shortSentenceEn: 'Privacy is very essential.',
          shortSentenceHe: 'פרטיות חיונית מאוד.',
          rule: {
            questionEn: 'Which sentence correctly uses commas for extra non-essential information?',
            correct: 'My brother, who studies computer science, built a secure app.',
            wrong: [
              'My brother that studies computer science, built a secure app.',
              'My brother which studies computer science built a secure app.',
            ],
            explainHe:
              'בפסוקית לא-מגדירה המספקת מידע נוסף ולא-הכרחי, משתמשים בפסיקים סביב הפסוקית, ולעולם לא משתמשים ב-that.',
            hintHe: 'מידע נוסף שאפשר להשמיט נכתב בין שני פסיקים. וגם כדאי לבדוק שכינוי הזיקה מתאים לאדם.',
          },
          story: {
            passageEn:
              'Many teenagers share photographs and locations daily without realizing the long-term impact. Cyber security experts, who study digital footprints, advise young users to adjust their privacy settings. Information posted online can remain accessible to future universities and employers.',
            passageHe:
              'בני נוער רבים משתפים תמונות ומיקומים מדי יום מבלי להבין את ההשפעה ארוכת הטווח. מומחי אבטחת מידע, החוקרים עקבות דיגיטליים, מייעצים למשתמשים צעירים להתאים את הגדרות הפרטיות שלהם. מידע שמועלה לרשת עשוי להישאר נגיש לאוניברסיטאות ומעסיקים בעתיד.',
            questionEn: 'What do cyber security experts recommend teenagers do?',
            questionHe: 'מה מומחי אבטחת מידע ממליצים לבני נוער לעשות?',
            correct: 'Adjust their privacy settings carefully.',
            wrong: ['Stop using computers permanently.', 'Share their passwords with friends.'],
          },
        },
      },
      {
        icon: '👑',
        isBoss: true,
        titleEn: 'Boss: Fact-Checking Investigation',
        titleHe: 'בוס: חקירת בדיקת עובדות — אתגר מדיה',
        storyHookHe:
          'משימת בוס מעשית: הוזמנתם לחדר החדשות של עיתון מוביל! עליכם לזהות מניפולציות בטקסט, לשלב פסוקיות יחסיות ולנמק את מסקנותיכם.',
        grammarTopic: 'Relative Clauses & Critical Media Synthesis',
        skills: ['Relative Synthesis', 'Critical Thinking', 'Bagrut Module C/E'],
        sentenceEn: 'Readers who develop critical thinking skills easily identify biased articles.',
        sentenceHe: 'קוראים שמפתחים מיומנויות חשיבה ביקורתית מזהים בקלות מאמרים מוטים.',
        vocab: [
          [
            'critical',
            'adjective',
            'ביקורתי / מכריע',
            '🧠',
            'Critical thinking helps us evaluate complex claims.',
            'חשיבה ביקורתית עוזרת לנו להעריך טענות מורכבות.',
          ],
          [
            'objective',
            'adjective',
            'אובייקטיבי / נטול פניות',
            '⚖️',
            'An objective report presents both sides fairly.',
            'דיווח אובייקטיבי מציג את שני הצדדים בהגינות.',
          ],
          [
            'manipulate',
            'verb',
            'לתמרן / לעשות מניפולציה',
            '🎭',
            'Clickbait headlines manipulate readers emotions.',
            'כותרות קליקבייט מתמרנות את רגשות הקוראים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'superficial', translationHe: 'שטחי' },
            { wordEn: 'passive', translationHe: 'פאסיבי / סביל' },
          ],
          shortSentenceEn: 'Critical readers analyze facts.',
          shortSentenceHe: 'קוראים ביקורתיים מנתחים עובדות.',
          rule: {
            questionEn: 'Which relative pronoun refers to possession (belonging to someone)?',
            correct: 'whose',
            wrong: ['whom', 'which'],
            explainHe:
              'משתמשים ב-whose לציון שייכות של אדם או גורם (למשל: The author whose article won an award).',
            hintHe: 'שייכות היא ש... שלו / שלה. איזו מילה שואלת של מי משהו?',
          },
          story: {
            passageEn:
              'During an election campaign, an artificial audio recording of a candidate spread across thousands of forums. Independent fact-checkers, whose mission is to protect truth in democracy, analyzed the sound waves using acoustic software. Within three hours, the recording was proven to be deepfake manipulation.',
            passageHe:
              'במהלך מערכת בחירות, הקלטת שמע מלאכותית של מועמד הופצה באלפי פורומים. בודקי עובדות עצמאיים, שמטרתם להגן על האמת בדמוקרטיה, ניתחו את גלי הקול באמצעות תוכנה אקוסטית. תוך שלוש שעות הוכח כי ההקלטה הייתה זיוף דיפ-פייק.',
            questionEn: 'How did fact-checkers discover that the recording was fake?',
            questionHe: 'כיצד גילו בודקי העובדות שההקלטה הייתה מזויפת?',
            correct: 'By analyzing the acoustic sound waves with specialized software.',
            wrong: ['By calling the radio station directly.', 'By deleting the internet archive.'],
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 3: Modals of Deduction & Scientific Inquiries',
    titleHe: 'פרק 3: מודלים של השערה ומסתורין מדעי',
    subtitleHe: 'הסקת מסקנות בהווה (must be, can\'t be, might be), ראיות והשערות',
    badgeEmoji: '🔬',
    missions: [
      {
        icon: '🧬',
        titleEn: 'Clues & Hypotheses: Must be & Can\'t be',
        titleHe: 'רמזים והשערות: בטוח שכן ובטוח שלא',
        storyHookHe:
          'בלשי המדע יוצאים לשטח! נלמד להשתמש ב-must be כשאנחנו בטוחים ב-100% שדבר מסוים נכון, וב-can\'t be כשאנחנו בטוחים שהוא אינו הגיוני.',
        grammarTopic: 'Modals of Deduction: Must be vs. Can\'t be',
        skills: ['Deduction Modals', 'Scientific Evidence', 'Logical Inference'],
        sentenceEn: 'The test results must be valid because three different labs confirmed them.',
        sentenceHe: 'תוצאות הבדיקה חייבות להיות תקפות משום ששלוש מעבדות שונות אישרו אותן.',
        vocab: [
          [
            'contradict',
            'verb',
            'לסתור / להתנגד',
            '⚡',
            'These new findings contradict earlier research.',
            'ממצאים חדשים אלה סותרים מחקרים קודמים.',
          ],
          [
            'evidence',
            'noun',
            'ראיות / עדות',
            '📜',
            'There is strong evidence that temperatures are rising.',
            'ישנן ראיות חזקות לכך שהטמפרטורות עולות.',
          ],
          [
            'hypothesis',
            'noun',
            'השערה מדעית',
            '💭',
            'The scientist formulated a clear hypothesis.',
            'המדען ניסח השערה ברורה.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'assumption', translationHe: 'הנחה בלתי מבוססת' },
            { wordEn: 'rumor', translationHe: 'שמועה' },
          ],
          shortSentenceEn: 'The evidence is valid.',
          shortSentenceHe: 'הראיות תקפות.',
          rule: {
            questionEn: 'Which modal expresses 99% certainty that something is IMPOSSIBLE?',
            correct: 'can\'t be',
            wrong: ['must be', 'might not be'],
            explainHe:
              'באנגלית משתמשים ב-can\'t be כדי להביע ביטחון מלא שמשהו אינו אפשרי (למשל: He can\'t be in Paris; I saw him here an hour ago).',
            hintHe: 'מחפשים ודאות שלילית חזקה (בטוח שלא), לא רק אפשרות ולא ודאות חיובית.',
          },
          story: {
            passageEn:
              'Geologists exploring an underground cavern noticed glowing green crystals along the ceiling. Dr. Green noted that the crystals can\'t be ordinary quartz because they emit ultraviolet light without any external power. She stated that there must be an unknown mineral reaction taking place inside the rock.',
            passageHe:
              'גאולוגים שחקרו מערה תת-קרקעית הבחינו בגבישים ירוקים זוהרים לאורך התקרה. ד״ר גרין ציינה שהגבישים אינם יכולים להיות קוורץ רגיל משום שהם פולטים אור אולטרה-סגול ללא מקור כוח חיצוני. היא קבעה כי חייבת להתרחש תגובה מינרלית בלתי מוכרת בתוך הסלע.',
            questionEn: 'Why did Dr. Green state the crystals cannot be ordinary quartz?',
            questionHe: 'מדוע קבעה ד״ר גרין שהגבישים אינם יכולים להיות קוורץ רגיל?',
            correct: 'Because they emit ultraviolet light without any external power.',
            wrong: ['Because they were completely black.', 'Because they dissolved in water instantly.'],
          },
        },
      },
      {
        icon: '🌌',
        titleEn: 'Exploring the Unknown: Might & Could',
        titleHe: 'חוקרים את הבלתי נודע: אולי וייתכן',
        storyHookHe:
          'מתי משהו אינו ודאי? נלמד להשתמש ב-might be ו-could be לתיאור אפשרויות סבירות כשאין לנו מספיק ראיות חד-משמעיות.',
        grammarTopic: 'Modals of Possibility: Might & Could',
        skills: ['Possibility Modals', 'Astronomy & Physics', 'Hypothesizing'],
        sentenceEn: 'The strange radio signals might be generated by a distant rotating star.',
        sentenceHe: 'אותות הרדיו המוזרים עשויים להיווצר על ידי כוכב רחוק שמסתובב.',
        vocab: [
          [
            'phenomenon',
            'noun',
            'תופעה',
            '✨',
            'The northern lights are a stunning natural phenomenon.',
            'הזוהר הצפוני הוא תופעת טבע מרהיבה.',
          ],
          [
            'plausible',
            'adjective',
            'מתקבל על הדעת / סביר',
            '🤔',
            'His explanation sounds completely plausible.',
            'ההסבר שלו נשמע מתקבל על הדעת לחלוטין.',
          ],
          [
            'detect',
            'verb',
            'לגלות / לאתר',
            '📡',
            'The telescope detected unusual radiation from space.',
            'הטלסקופ איתר קרינה חריגה מהחלל.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'disregard', translationHe: 'להתעלם' },
            { wordEn: 'conceal', translationHe: 'להסתיר' },
          ],
          shortSentenceEn: 'Sensors detect strange signals.',
          shortSentenceHe: 'חיישנים מאתרים אותות מוזרים.',
          rule: {
            questionEn: 'Which modal verbs express 50% possibility about a present situation?',
            correct: 'might / could',
            wrong: ['must / will', 'should / ought'],
            explainHe:
              'משתמשים ב-might או could כדי להביע אפשרות של כ-50% שדבר מסוים מתרחש או ייתכן (ייתכן שכן וייתכן שלא).',
            hintHe: 'אפשרות של 50% היא ייתכן שכן וייתכן שלא: לא ודאות ולא עצה.',
          },
          story: {
            passageEn:
              'In 1977, an observatory in Ohio detected a powerful radio pulse nicknamed the Wow Signal. Some astronomers suggested that it could be evidence of extraterrestrial communication. However, other astrophysicists argued that it might simply be an echo from passing comets.',
            passageHe:
              'בשנת 1977, מצפה כוכבים באוהיו איתר פולס רדיו עוצמתי שזכה לכינוי ״אות ה-וואו״. כמה אסטרונומים העלו השערה כי ייתכן שזו עדות לתקשורת חוצנית. עם זאת, אסטרופיזיקאים אחרים טענו שייתכן שמדובר פשוט בהד מכוכבי שביט חולפים.',
            questionEn: 'What did skeptical astrophysicists suggest about the signal?',
            questionHe: 'מה הציעו אסטרופיזיקאים סקפטיים לגבי האות?',
            correct: 'It might be an echo from passing comets.',
            wrong: ['It was a secret military broadcast.', 'It was an error in the microwave oven.'],
          },
        },
      },
      {
        icon: '👑',
        isBoss: true,
        titleEn: 'Boss: Deep Ocean Mystery Unseen',
        titleHe: 'בוס: מסתורין במעמקי האוקיינוס — אתגר מדעי',
        storyHookHe:
          'משימת בוס עיונית: צוללת מחקר הגיעה לעומק של 8,000 מטר ומצאה מבנה ביולוגי יוצא דופן. עליכם לנתח את הראיות ולהסיק מסקנות מנומקות!',
        grammarTopic: 'Modals of Deduction Synthesis & Scientific Unseen',
        skills: ['Deduction Synthesis', 'Scientific Unseen', 'Module E Readiness'],
        sentenceEn: 'Scientists concluded that the deep underwater organisms must survive without sunlight.',
        sentenceHe: 'מדענים הסיקו כי האורגניזמים במעמקי המים חייבים לשרוד ללא אור שמש.',
        vocab: [
          [
            'conclude',
            'verb',
            'להסיק מסקנה / לסכם',
            '🎯',
            'After reviewing the data, we concluded the test succeeded.',
            'לאחר סקירת הנתונים, הסקנו כי המבחן הצליח.',
          ],
          [
            'mysterious',
            'adjective',
            'מסתורי / בלתי מוסבר',
            '🔮',
            'A mysterious glow lit up the dark underwater trench.',
            'זוהר מסתורי האיר את השוחה התת-ימית החשוכה.',
          ],
          [
            'organism',
            'noun',
            'יצור חי / אורגניזם',
            '🦠',
            'Microscopic organisms thrive in boiling volcanic vents.',
            'אורגניזמים מיקרוסקופיים משגשגים בפתחים וולקניים רותחים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'inorganic', translationHe: 'אנאורגני' },
            { wordEn: 'artificial', translationHe: 'מלאכותי' },
          ],
          shortSentenceEn: 'Deep organisms survive darkness.',
          shortSentenceHe: 'אורגניזמים במעמקים שורדים בחשיכה.',
          rule: {
            questionEn: 'Select the sentence showing the highest degree of certainty:',
            correct: 'The expedition must be successful; they found living samples.',
            wrong: [
              'The expedition might be successful if they find samples.',
              'The expedition could be successful tomorrow.',
            ],
            explainHe:
              'משפט עם must be מביע את דרגת הוודאות הגבוהה ביותר כאשר יש ראיה תומכת (they found living samples).',
            hintHe: 'הוודאות הגבוהה ביותר מגיעה כשיש ראיה. באיזה משפט מופיעה ראיה שכבר נמצאה?',
          },
          story: {
            passageEn:
              'In the Mariana Trench, robotic cameras recorded translucent creatures moving near thermal vents where temperatures exceed 300 degrees Celsius. Biologists realized these organisms cannot depend on photosynthesis because no light penetrates such depths. Instead, they must rely on chemosynthesis, converting mineral sulfur into life energy.',
            passageHe:
              'בשקע מריאנה, מצלמות רובוטיות תיעדו יצורים שקופים-למחצה שנעים ליד פתחים תרמיים שבהם הטמפרטורה עולה על 300 מעלות צלזיוס. ביולוגים הבינו כי יצורים אלה אינם יכולים להיות תלויים בפוטוסינתזה כיוון ששום אור אינו חודר לעומקים כאלה. במקום זאת, הם חייבים להסתמך על כמוסינתזה, הממירה גופרית מינרלית לאנרגיית חיים.',
            questionEn: 'How do creatures in the Mariana Trench generate life energy?',
            questionHe: 'כיצד יצורים בשקע מריאנה מייצרים אנרגיית חיים?',
            correct: 'Through chemosynthesis, utilizing mineral sulfur.',
            wrong: ['Through direct sunlight absorbed from above.', 'By eating plants drifting from surface waters.'],
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 4: Technology Ethics & Future Dilemmas',
    titleHe: 'פרק 4: אתיקה טכנולוגית ודילמות העתיד',
    subtitleHe: 'משפטי תנאי (First vs. Second Conditional), בינה מלאכותית ואחריות חברתית',
    badgeEmoji: '🤖',
    missions: [
      {
        icon: '💻',
        titleEn: 'Tech Tomorrow: Cause & Condition',
        titleHe: 'טכנולוגיית המחר: תנאי ותוצאה',
        storyHookHe:
          'מה יקרה אם מכוניות אוטונומיות יקבלו החלטות בכביש? נתרגל משפטי תנאי ראשון (First Conditional: If + Present, will + base verb) לתחזיות עתידיות ריאליות.',
        grammarTopic: 'First Conditional for Realistic Predictions',
        skills: ['First Conditional', 'Tech Forecasting', 'Clause Ordering'],
        sentenceEn: 'If automated cars encounter hazards, smart algorithms will respond instantly.',
        sentenceHe: 'אם מכוניות אוטונומיות ייתקלו במפגעים, אלגוריתמים חכמים יגיבו באופן מיידי.',
        vocab: [
          [
            'artificial',
            'adjective',
            'מלאכותי',
            '🤖',
            'Artificial intelligence is transforming medical diagnostics.',
            'בינה מלאכותית משנה את האבחון הרפואי.',
          ],
          [
            'ethical',
            'adjective',
            'מוסרי / אתי',
            '⚖️',
            'Engineers must follow ethical standards when designing AI.',
            'מהנדסים חייבים לציית לתקנים אתיים בעת תכנון בינה מלאכותית.',
          ],
          [
            'regulate',
            'verb',
            'להסדיר / לפקח בחוק',
            '📜',
            'Governments need to regulate automated algorithms.',
            'ממשלות צריכות להסדיר אלגוריתמים אוטומטיים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'disorderly', translationHe: 'בלתי מסודר' },
            { wordEn: 'primitive', translationHe: 'פרימיטיבי' },
          ],
          shortSentenceEn: 'Smart algorithms respond instantly.',
          shortSentenceHe: 'אלגוריתמים חכמים מגיבים מיד.',
          rule: {
            questionEn: 'Complete the First Conditional: "If society _______ tech, risks will decrease."',
            correct: 'regulates',
            wrong: ['will regulate', 'regulated'],
            explainHe:
              'בפסוקית התנאי (אחרי if) במשפט תנאי ראשון, משתמשים ב-Present Simple (regulates), ורק בחלק העיקרי של המשפט שמים will.',
            hintHe: 'אחרי if בתנאי ראשון לא שמים will, ו-society הוא it (יחיד).',
          },
          story: {
            passageEn:
              'Autonomous public transit is being piloted in major European hubs. If test fleets maintain zero collisions for six consecutive months, regional authorities will expand autonomous buses across residential suburbs. Civic planners emphasize that safety will always precede speed.',
            passageHe:
              'תחבורה ציבורית אוטונומית נבחנת בפיילוט במרכזים אירופיים מרכזיים. אם ציי הניסוי ישמרו על אפס התנגשויות במשך שישה חודשים רצופים, הרשויות האזוריות ירחיבו את האוטובוסים האוטונומיים לפרברי מגורים. מתכנני ערים מדגישים כי בטיחות תמיד תקדם למהירות.',
            questionEn: 'Under what condition will autonomous buses be expanded?',
            questionHe: 'באיזה תנאי יורחב מערך האוטובוסים האוטונומיים?',
            correct: 'If the test fleet maintains zero collisions for six months.',
            wrong: ['If ticket prices are doubled immediately.', 'If drivers agree to work overtime.'],
          },
        },
      },
      {
        icon: '🎨',
        titleEn: 'AI & Creative Dilemmas',
        titleHe: 'בינה מלאכותית ודילמות יצירתיות',
        storyHookHe:
          'אילו מחשב היה כותב שיר זוכה פרסים, למי היו שייכות זכויות היוצרים? נתרגל תנאי שני (Second Conditional: If + Past, would + base verb) למצבים היפותטיים.',
        grammarTopic: 'Second Conditional for Hypothetical Situations',
        skills: ['Second Conditional', 'Creative AI', 'Hypothetical Reasoning'],
        sentenceEn: 'If algorithms created original music, questions of copyright would become complex.',
        sentenceHe: 'אילו אלגוריתמים היו יוצרים מוזיקה מקורית, שאלות של זכויות יוצרים היו הופכות למורכבות.',
        vocab: [
          [
            'innovation',
            'noun',
            'חדשנות',
            '💡',
            'Technological innovation creates exciting opportunities.',
            'חדשנות טכנולוגית יוצרת הזדמנויות מרגשות.',
          ],
          [
            'copyright',
            'noun',
            'זכויות יוצרים',
            '©️',
            'The artist registered the copyright for her artwork.',
            'האמנית רשמה את זכויות היוצרים על יצירתה.',
          ],
          [
            'algorithm',
            'noun',
            'אלגוריתם',
            '⚙️',
            'The search algorithm organizes millions of pages.',
            'אלגוריתם החיפוש מארגן מיליוני עמודים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'tradition', translationHe: 'מסורת' },
            { wordEn: 'plagiarism', translationHe: 'גניבה ספרותית' },
          ],
          shortSentenceEn: 'Innovation creates great opportunities.',
          shortSentenceHe: 'חדשנות יוצרת הזדמנויות נהדרות.',
          rule: {
            questionEn: 'Which sentence correctly demonstrates the Second Conditional?',
            correct: 'If I were a programmer, I would design ethical AI tools.',
            wrong: [
              'If I am a programmer, I would design ethical AI tools.',
              'If I was a programmer, I will design ethical AI tools.',
            ],
            explainHe:
              'בתנאי שני למצב היפותטי בהווה, משתמשים בצורת עבר (if I were/studied) ולאחריה would + פועל בסיסי.',
            hintHe: 'תנאי שני הוא מצב דמיוני: אחרי If צורת עבר, ובתוצאה would + פועל בסיסי. בכתיבה רשמית יש לפועל להיות צורת עבר אחת לכל הגופים.',
          },
          story: {
            passageEn:
              'An art gallery in Tokyo hosted an exhibition where all paintings were produced by deep neural networks. Visitors were asked to guess which canvases were made by humans. If visitors knew an algorithm painted the portrait, they rated its emotional resonance substantially lower.',
            passageHe:
              'גלריית אמנות בטוקיו אירחה תערוכה שבה כל הציורים הופקו על ידי רשתות נוירונים עמוקות. המבקרים התבקשו לנחש אילו קנבסים נוצרו על ידי בני אדם. אילו המבקרים ידעו שאלגוריתם צייר את הדיוקן, הם דירגו את התהודה הרגשית שלו באופן נמוך משמעותית.',
            questionEn: 'How did knowing a computer painted a portrait affect visitors?',
            questionHe: 'כיצד הידיעה שמחשב צייר את הדיוקן השפיעה על המבקרים?',
            correct: 'They rated its emotional impact significantly lower.',
            wrong: ['They offered twice as much money to buy it.', 'They refused to enter the gallery.'],
          },
        },
      },
      {
        icon: '👑',
        isBoss: true,
        titleEn: 'Boss: Module C/E Gateway Simulation',
        titleHe: 'בוס: סימולציית בגרות שאלון C/E — אתגר עתידנות',
        storyHookHe:
          'משימת בוס עיונית: עליכם לפתור קטע הבנת הנקרא אקדמי מלא ברמת שאלון בגרות E על עתיד החינוך והטכנולוגיה!',
        grammarTopic: 'Conditionals & Future Discourse Synthesis',
        skills: ['Conditionals Synthesis', 'Bagrut Module E Prep', 'Critical Reading'],
        sentenceEn: 'Society will benefit greatly if advanced technologies are guided by ethical principles.',
        sentenceHe: 'החברה תפיק תועלת רבה אם טכנולוגיות מתקדמות יונחו על ידי עקרונות מוסריים.',
        vocab: [
          [
            'benefit',
            'verb',
            'להפיק תועלת / להועיל',
            '🌟',
            'Students benefit greatly from interactive digital tools.',
            'תלמידים מפיקים תועלת רבה מכלים דיגיטליים אינטראקטיביים.',
          ],
          [
            'principle',
            'noun',
            'עיקרון מנחה / כלל',
            '🧭',
            'Honesty is a fundamental principle of science.',
            'יושר הוא עיקרון יסוד במדע.',
          ],
          [
            'impact',
            'noun',
            'השפעה / רושם',
            '💥',
            'Online education had a huge impact on modern schools.',
            'לחינוך מקוון הייתה השפעה עצומה על בתי ספר מודרניים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'disadvantage', translationHe: 'חיסרון' },
            { wordEn: 'indifference', translationHe: 'אדישות' },
          ],
          shortSentenceEn: 'Principles guide smart technology.',
          shortSentenceHe: 'עקרונות מנחים טכנולוגיה חכמה.',
          rule: {
            questionEn: 'Choose the correct structure: "Unless we _______ rules, problems will arise."',
            correct: 'establish',
            wrong: ['will establish', 'established'],
            explainHe:
              'המילה unless פירושה if not (אלא אם כן). אחריה משתמשים ב-Present Simple (establish) בדיוק כמו אחרי if.',
            hintHe: 'unless פירושו if not. אחריה משתמשים באותו זמן כמו אחרי if בתנאי ראשון.',
          },
          story: {
            passageEn:
              'A landmark international study conducted across twenty school districts evaluated the impact of personalized tutoring bots. The research proved that when bots were used as supplementary mentors alongside human teachers, reading comprehension scores rose by twenty-two percent. However, lead researchers warned that human empathy remains indispensable.',
            passageHe:
              'מחקר בינלאומי פורץ דרך שנערך בעשרים מחוזות לימוד העריך את ההשפעה של בוטים מותאמים אישית להוראה פרטית. המחקר הוכיח שכאשר בוטים שימשו כחונכים משלימים לצד מורים אנושיים, ציוני הבנת הנקרא עלו בעשרים ושניים אחוזים. עם זאת, החוקרים הראשיים הזהירו כי אמפתיה אנושית נותרה הכרחית ובלתי ניתנת להחלפה.',
            questionEn: 'What did the study prove about personalized tutoring bots?',
            questionHe: 'מה הוכיח המחקר לגבי בוטים מותאמים אישית להוראה?',
            correct: 'They significantly boosted reading scores when paired with human teachers.',
            wrong: ['They completely replaced the need for human teachers.', 'They caused students to fail examinations.'],
          },
        },
      },
    ],
  },
];

export const grade10Curriculum = buildHighSchoolGrade('grade-10', units);
