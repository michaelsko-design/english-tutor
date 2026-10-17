import { buildMiddleSchoolGrade } from './builder';

/**
 * Grade 8 — Band II Completion: Past Continuous vs. Past Simple (while / when),
 * Future will vs. be going to & Modals, Present Perfect Simple (have/has + V3, ever/never, already/yet),
 * and First Conditional & Environmental Discourse.
 * 4 units × 3 missions = 12 missions (the 3rd mission of each unit is a Boss review).
 * Hebrew copy is gender-neutral (uses slash forms such as "קורא/ת" and plural phrasing).
 */
export const grade8Curriculum = buildMiddleSchoolGrade('grade-8', [
  {
    titleEn: 'Unit 1: Global Travellers & Past Adventures',
    titleHe: 'פרק 1: הרפתקאות מסביב לעולם',
    subtitleHe: 'Past Simple מול Past Continuous, מילות הקישור While ו-When והבנת הנקרא',
    badgeEmoji: '✈️',
    missions: [
      {
        icon: '🧭',
        titleEn: 'While We Were Travelling in Tokyo',
        titleHe: 'בזמן שטיילנו בטוקיו',
        storyHookHe: 'שילוב של פעולה ארוכה בעבר (Past Continuous) עם פעולה קצרה שהפריעה לה בעזרת While ו-When!',
        grammarTopic: 'Past Simple vs. Past Continuous (While / When)',
        skills: ['Past Continuous', 'While vs. When', 'Travel Vocab'],
        sentenceEn: 'While we were waiting for the train, we met our favorite singer.',
        sentenceHe: 'בזמן שחיכינו לרכבת, פגשנו את הזמרת האהובה עלינו.',
        vocab: [
          ['destination', 'noun', 'יעד (לטיול)', '📍', 'Tokyo was our favorite destination.', 'טוקיו הייתה היעד האהוב עלינו.'],
          ['experience', 'noun', 'חוויה', '✨', 'Travelling in Japan was an amazing experience.', 'טיול ביפן היה חוויה מדהימה.'],
          ['suddenly', 'adverb', 'לפתע / פתאום', '⚡', 'Suddenly, the bullet train arrived.', 'לפתע, רכבת הקליע הגיעה.'],
          ['journey', 'noun', 'מסע / נסיעה', '🚆', 'Our long journey began early in the morning.', 'המסע הארוך שלנו התחיל מוקדם בבוקר.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'tradition', translationHe: 'מסורת' },
            { wordEn: 'passenger', translationHe: 'נוסע / נוסעת' },
          ],
          shortSentenceEn: 'We were waiting for the train.',
          shortSentenceHe: 'חיכינו לרכבת.',
          rule: {
            questionEn: 'Which sentence correctly uses "while"?',
            correct: 'While I was sleeping, the doorbell rang.',
            wrong: [
              'While I slept, the doorbell was ringing constantly.',
              'While was I sleeping, the doorbell rang.',
            ],
            explainHe: 'אחרי While נשתמש בדרך כלל ב-Past Continuous (was / were + V-ing) עבור הפעולה הארוכה ברקע.',
          },
          story: {
            passageEn:
              'Maya and Guy were waiting at the busy railway station in Tokyo. While they were checking their tickets, a famous pop singer suddenly walked past them. The singer smiled and signed their notebook.',
            passageHe:
              'מאיה וגיא חיכו בתחנת הרכבת העמוסה בטוקיו. בזמן שבדקו את הכרטיסים שלהם, זמר פופ מפורסם עבר לפתע לידם. הזמר חייך וחתם על המחברת שלהם.',
            questionEn: 'What were Maya and Guy doing when the singer walked past?',
            questionHe: 'מה מאיה וגיא עשו כשהזמר עבר לידם?',
            correct: 'They were checking their tickets.',
            wrong: [
              'They were drinking green tea.',
              'They were sleeping on the platform.',
            ],
          },
        },
      },
      {
        icon: '🧳',
        titleEn: 'Lost Luggage & Midnight Flights',
        titleHe: 'מזוודות אבודות וטיסות לילה',
        storyHookHe: 'הנחיתה הייתה חלקה, אבל איפה המזוודות? נלמד לתאר רצף פעולות בעבר ואירועים שהתרחשו במקביל.',
        grammarTopic: 'Past Continuous (Interrupted Actions with When)',
        skills: ['Interrupted Past', 'Airport Vocab', 'Speaking Fluency'],
        sentenceEn: 'The flight attendant was explaining the safety rules when the lights went out.',
        sentenceHe: 'הדייל הסביר את כללי הבטיחות כאשר האורות כבו.',
        vocab: [
          ['luggage', 'noun', 'מטען / מזוודות', '🧳', 'We collected our luggage at the carousel.', 'אספנו את המטען שלנו במסוע.'],
          ['attendant', 'noun', 'דייל / דיילת', '🧑‍✈️', 'The flight attendant helped us find our seats.', 'הדייל עזר לנו למצוא את המושבים.'],
          ['announcement', 'noun', 'הודעה / כריזה', '📢', 'We listened carefully to the gate announcement.', 'הקשבנו בתשומת לב לכריזה בשער.'],
          ['apologize', 'verb', 'להתנצל', '🙏', 'The airline staff apologized for the delay.', 'צוות חברת התעופה התנצל על העיכוב.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'passport', translationHe: 'דרכון' },
            { wordEn: 'souvenir', translationHe: 'מזכרת' },
          ],
          shortSentenceEn: 'The attendant was explaining rules.',
          shortSentenceHe: 'הדייל הסביר כללים.',
          rule: {
            questionEn: 'Which sentence is grammatically correct?',
            correct: 'They were looking for the bag when the phone rang.',
            wrong: [
              'They was looking for the bag when the phone rang.',
              'They were look for the bag when the phone rang.',
            ],
            explainHe: 'עבור They משתמשים ב-were ולא ב-was, ומוסיפים ing לפועל ב-Past Continuous.',
          },
          story: {
            passageEn:
              'At midnight, thirty tired passengers were standing near the carousel. While they were waiting, an attendant made an announcement. The luggage was on another plane! The airline apologized and delivered the bags the next morning.',
            passageHe:
              'בחצות, שלושים נוסעים עייפים עמדו ליד המסוע. בזמן שחיכו, דיילת השמיעה הודעה בכריזה. המזוודות היו על מטוס אחר! חברת התעופה התנצלה והביאה את המזוודות בבוקר למחרת.',
            questionEn: 'What did the airline do the next morning?',
            questionHe: 'מה חברת התעופה עשתה בבוקר למחרת?',
            correct: 'Delivered the bags.',
            wrong: [
              'Cancelled all tickets.',
              'Asked for more money.',
            ],
          },
        },
      },
      {
        icon: '🕵️',
        isBoss: true,
        titleEn: 'Boss: The Tokyo Express Mystery',
        titleHe: 'אתגר הבוס: תעלומת הרכבת לטוקיו',
        storyHookHe: 'אתגר Unseen מסכם לפרק 1: תעלומה על הרכבת המהירה! הוכיחו שליטה בשילוב זמני העבר ובאוצר מילים מתקדם.',
        grammarTopic: 'Review: Past Simple & Past Continuous in Unseen Reading',
        skills: ['Boss Unseen', 'Past Contrast', 'Critical Thinking'],
        sentenceEn: 'While the passengers were asleep, the detective found the missing golden watch.',
        sentenceHe: 'בזמן שהנוסעים ישנו, הבלש מצא את שעון הזהב הנעדר.',
        vocab: [
          ['investigation', 'noun', 'חקירה', '🔍', 'The police started a quick investigation.', 'המשטרה פתחה בחקירה מהירה.'],
          ['suspicious', 'adjective', 'חשוד / מעורר חשד', '🤨', 'A suspicious man was sitting in the corner.', 'אדם חשוד ישב בפינה.'],
          ['disappear', 'verb', 'להיעלם', '💨', 'The package disappeared from the platform.', 'החבילה נעלמה מהרציף.'],
          ['valuable', 'adjective', 'בעל ערך / יקר', '💎', 'The museum owns many valuable paintings.', 'המוזיאון מחזיק בציורים רבים בעלי ערך.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'dangerous', translationHe: 'מסוכן' },
            { wordEn: 'crowded', translationHe: 'צפוף' },
          ],
          shortSentenceEn: 'The detective found the watch.',
          shortSentenceHe: 'הבלש מצא את השעון.',
          rule: {
            questionEn: 'Which sentence connects the two actions correctly?',
            correct: 'The lights went out while the detective was questioning the guard.',
            wrong: [
              'The lights were going out while the detective questioned the guard.',
              'The lights went out while the detective were questioning the guard.',
            ],
            explainHe: 'הפעולה הקצרה (went out) קוטעת את הפעולה המתמשכת (was questioning). עבור detective יחיד נשתמש ב-was.',
          },
          story: {
            passageEn:
              'The Tokyo Express was travelling through the snowy mountains at high speed. A valuable diamond necklace suddenly disappeared from a private cabin. While the conductor was interviewing the passengers, Detective Ken saw a suspicious shadow near the door. He noticed wet footsteps leading to the dining cart, where the necklace was hidden under a napkin.',
            passageHe:
              'רכבת האקספרס של טוקיו נסעה דרך ההרים המושלגים במהירות גבוהה. ענק יהלומים יקר ערך נעלם לפתע מתא פרטי. בזמן שהכרטיסן ראיין את הנוסעים, הבלש קן ראה צל חשוד ליד הדלת. הוא הבחין בעקבות רטובות שהובילו לקרון המסעדה, שבו הענק הוחבא מתחת למפית.',
            questionEn: 'Where was the missing necklace finally discovered?',
            questionHe: 'איפה נמצא בסופו של דבר הענק האבוד?',
            correct: 'Under a napkin in the dining cart.',
            wrong: [
              'Inside the conductor cabin.',
              'In the snowy mountains outside.',
            ],
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 2: London Clues & Future Plans',
    titleHe: 'פרק 2: תעלומת לונדון ותוכניות לעתיד',
    subtitleHe: 'עתיד Will מול Be Going to, שאלות Did בעבר ו-Modals (must, should, could)',
    badgeEmoji: '🕵️',
    missions: [
      {
        icon: '🔍',
        titleEn: 'The Lost Ticket at Baker Street',
        titleHe: 'הכרטיס האבוד ברחוב בייקר',
        storyHookHe: 'בלשי הנוער של לונדון בעקבות רמז מסתורי! נלמד לשאול שאלות על העבר ולתכנן את הצעד הבא.',
        grammarTopic: 'Future: Will vs. Be Going to & Past Questions (Did)',
        skills: ['Future Tenses', 'Past Questions', 'Mystery Vocabulary'],
        sentenceEn: 'Did you find the secret note, and what are you going to do next?',
        sentenceHe: 'האם מצאת את הפתק הסודי, ומה את/ה מתכוונ/ת לעשות עכשיו?',
        vocab: [
          ['investigate', 'verb', 'לחקור / לברר', '🔎', 'The detectives will investigate the message.', 'הבלשים יחקרו את ההודעה.'],
          ['clue', 'noun', 'רמז', '🧩', 'Every clue brings us closer to the truth.', 'כל רמז מקרב אותנו לאמת.'],
          ['decision', 'noun', 'החלטה', '⚖️', 'We have to make an important decision today.', 'אנחנו חייבים לקבל החלטה חשובה היום.'],
          ['evidence', 'noun', 'ראיות / הוכחות', '📂', 'The police gathered clear evidence.', 'המשטרה אספה ראיות ברורות.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'solution', translationHe: 'פתרון' },
            { wordEn: 'suspect', translationHe: 'חשוד' },
          ],
          shortSentenceEn: 'Did you find the clue?',
          shortSentenceHe: 'האם מצאת את הרמז?',
          rule: {
            questionEn: 'Which question correctly asks about a past event?',
            correct: 'Did you examine the camera footage yesterday?',
            wrong: [
              'Did you examined the camera footage yesterday?',
              'Were you examine the camera footage yesterday?',
            ],
            explainHe: 'אחרי פועל העזר Did, הפועל הראשי חייב לחזור לצורת המקור שלו (examine ללא ed).',
          },
          story: {
            passageEn:
              'Maya found an old theatre ticket near Baker Street station. On the back, someone had written a time and an address. "Did someone drop this by accident?" asked her brother. They decided to investigate the clue together after lunch.',
            passageHe:
              'מאיה מצאה כרטיס תיאטרון ישן ליד תחנת רחוב בייקר. מאחור, מישהו כתב שעה וכתובת. "האם מישהו הפיל את זה במקרה?" שאל אחיה. הם החליטו לחקור את הרמז יחד אחרי ארוחת הצהריים.',
            questionEn: 'What was written on the back of the ticket?',
            questionHe: 'מה היה כתוב בגב הכרטיס?',
            correct: 'A time and an address.',
            wrong: [
              'A secret bank code.',
              'A shopping list.',
            ],
          },
        },
      },
      {
        icon: '🗺️',
        titleEn: 'Planning the Next Move in Soho',
        titleHe: 'מתכננים את הצעד הבא בסוהו',
        storyHookHe: 'מה ההבדל בין החלטה ספונטנית (will) לבין תוכנית שכבר קבענו מראש (be going to)? בואו נתרגל בסמטאות לונדון.',
        grammarTopic: 'Will (Spontaneous) vs. Be Going To (Planned Intentions)',
        skills: ['Future Intentions', 'Spontaneous Decisions', 'City Vocab'],
        sentenceEn: 'We are going to visit the museum, but it is raining so I will take a taxi.',
        sentenceHe: 'אנחנו מתכוונים לבקר במוזיאון, אבל יורד גשם אז אקח מונית.',
        vocab: [
          ['intention', 'noun', 'כוונה / תוכנית', '🎯', 'Her intention is to study architecture.', 'כוונתה ללמוד אדריכלות.'],
          ['witness', 'noun', 'עד / עדה', '👁️', 'The witness described the red coat.', 'העד תיאר את המעיל האדום.'],
          ['secretly', 'adverb', 'בסתר / בחשאי', '🤫', 'They met secretly in the quiet park.', 'הם נפגשו בחשאי בפארק השקט.'],
          ['direction', 'noun', 'כיוון / הנחיה', '🧭', 'Can you give us directions to the museum?', 'תוכל/י לתת לנו הנחיות למוזיאון?'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'opinion', translationHe: 'דעה' },
            { wordEn: 'schedule', translationHe: 'לוח זמנים' },
          ],
          shortSentenceEn: 'I will take a taxi.',
          shortSentenceHe: 'אני אקח מונית.',
          rule: {
            questionEn: 'Choose the correct form for a prior planned intention:',
            correct: 'We are going to meet our guide at four o’clock.',
            wrong: [
              'We will meet our guide at four o’clock, we bought tickets last week.',
              'We are go to meet our guide at four o’clock.',
            ],
            explainHe: 'כאשר מדובר בתוכנית מוגדרת מראש שהוכנה בעבר, נשתמש ב-Be Going To ולא ב-Will ספונטני.',
          },
          story: {
            passageEn:
              'The team sat in a café in Soho with their city map spread out. "We are going to visit the historical library this afternoon," announced Liam. Suddenly, the waitress dropped a tray of cups. "Do not worry, I will help you pick them up," Liam offered immediately.',
            passageHe:
              'הצוות ישב בבית קפה בסוהו עם מפת העיר פרוסה לפניהם. "אנחנו מתכוונים לבקר בספרייה ההיסטורית אחר הצהריים," הודיע ליאם. לפתע, המלצרית הפילה מגש כוסות. "אל תדאגי, אני אעזור לך לאסוף אותן," הציע ליאם מיד.',
            questionEn: 'Why did Liam say "I will help you"?',
            questionHe: 'מדוע ליאם השתמש ב-"I will help you"?',
            correct: 'It was a spontaneous decision made on the spot.',
            wrong: [
              'He planned to do it two days ago.',
              'It was part of his school schedule.',
            ],
          },
        },
      },
      {
        icon: '🏆',
        isBoss: true,
        titleEn: 'Boss: Baker Street Detective Challenge',
        titleHe: 'אתגר הבוס: תעלומת רחוב בייקר',
        storyHookHe: 'אתגר בוס לפרק 2: פתרון תעלומה בלונדון בעזרת Modals (must, should, could) ותוכניות עתידיות!',
        grammarTopic: 'Modals of Advice & Deduction (Must, Should, Could) Review',
        skills: ['Boss Challenge', 'Modals', 'Deductive Logic'],
        sentenceEn: 'You should examine the footsteps carefully before making a final decision.',
        sentenceHe: 'כדאי לבחון את העקבות בקפידה לפני שמקבלים החלטה סופית.',
        vocab: [
          ['examine', 'verb', 'לבחון / לבדוק', '🔬', 'The scientist examined the ancient coin.', 'המדען בחן את המטבע העתיק.'],
          ['innocent', 'adjective', 'חף מפשע / תמים', '🕊️', 'The guard proved that he was completely innocent.', 'השומר הוכיח שהוא חף מפשע לחלוטין.'],
          ['conclusion', 'noun', 'מסקנה', '📌', 'We reached a surprising conclusion at the end.', 'הגענו למסקנה מפתיעה בסוף.'],
          ['guilty', 'adjective', 'אשם / אשמה', '⚖️', 'The evidence showed who was guilty.', 'הראיות הראו מי היה אשם.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'curious', translationHe: 'סקרן' },
            { wordEn: 'generous', translationHe: 'נדיב' },
          ],
          shortSentenceEn: 'You should examine the clues.',
          shortSentenceHe: 'כדאי לבחון את הרמזים.',
          rule: {
            questionEn: 'Which modal verb expresses strong logical certainty?',
            correct: 'The door is locked, so the key must be inside.',
            wrong: [
              'The door is locked, so the key should be inside maybe.',
              'The door is locked, so the key could to be inside.',
            ],
            explainHe: 'המודל must מבטא מסקנה לוגית כמעט ודאית ("חייב להיות ש..."). אחרי מודל תמיד בא פועל בסיסי.',
          },
          story: {
            passageEn:
              'Inspector Reed and her young assistants gathered at Baker Street. Two witnesses gave different stories about the missing antique clock. "The thief must have had a master key because the lock is undamaged," argued Reed. "We should verify the security cameras before we accuse anyone," whispered Maya. Their careful investigation proved the suspect was innocent.',
            passageHe:
              'המפקחת ריד ועוזריה הצעירים התכנסו ברחוב בייקר. שני עדים מסרו גרסאות שונות לגבי השעון העתיק החסר. "הגנב היה חייב להחזיק במפתח מאסטר כי המנעול אינו פגום," טענה ריד. "כדאי שנאמת את מצלמות האבטחה לפני שנאשים מישהו," לחשה מאיה. חקירתם הקפדנית הוכיחה שהחשוד היה חף מפשע.',
            questionEn: 'Why did Inspector Reed believe the thief used a key?',
            questionHe: 'מדוע המפקחת ריד האמינה שהגנב השתמש במפתח?',
            correct: 'Because the door lock had no damage.',
            wrong: [
              'Because the thief dropped the key on the floor.',
              'Because a witness saw the key in his hand.',
            ],
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 3: Life Milestones & Experiences',
    titleHe: 'פרק 3: הישגים וחוויות חיים',
    subtitleHe: 'Present Perfect Simple (have/has + V3) עם Ever, Never, Already ו-Yet',
    badgeEmoji: '🌟',
    missions: [
      {
        icon: '🌋',
        titleEn: 'Have You Ever Climbed a Volcano?',
        titleHe: 'האם אי פעם טיפסתם על הר געש?',
        storyHookHe: 'הכירו את זמני ההישגים! איך שואלים על חוויות חיים בלי לציין זמן מדויק בעזרת Present Perfect.',
        grammarTopic: 'Present Perfect Simple with Ever and Never',
        skills: ['Present Perfect', 'Ever vs. Never', 'Life Experiences'],
        sentenceEn: 'Have you ever climbed an active volcano during summer vacation?',
        sentenceHe: 'האם אי פעם טיפסתם על הר געש פעיל במהלך חופשת הקיץ?',
        vocab: [
          ['volcano', 'noun', 'הר געש', '🌋', 'The volcano erupted hundreds of years ago.', 'הר הגעש התפרץ לפני מאות שנים.'],
          ['summit', 'noun', 'פסגה', '⛰️', 'They reached the mountain summit at sunrise.', 'הם הגיעו לפסגת ההר עם הזריחה.'],
          ['spectacular', 'adjective', 'מרהיב / יוצא דופן', '🎆', 'The view from the top was truly spectacular.', 'הנוף מלמעלה היה מרהיב באמת.'],
          ['adventure', 'noun', 'הרפתקה', '🎒', 'Exploring the jungle was an exciting adventure.', 'חקר הג׳ונגל היה הרפתקה מרגשת.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'island', translationHe: 'אי' },
            { wordEn: 'valley', translationHe: 'עמק' },
          ],
          shortSentenceEn: 'I have never climbed a volcano.',
          shortSentenceHe: 'מעולם לא טיפסתי על הר געש.',
          rule: {
            questionEn: 'Which question uses the Present Perfect correctly?',
            correct: 'Have you ever tried scuba diving?',
            wrong: [
              'Did you ever tried scuba diving before?',
              'Have you ever try scuba diving?',
            ],
            explainHe: 'ב-Present Perfect משתמשים ב-have / has בתוספת הפועל בצורת ה-V3 (Past Participle): tried.',
          },
          story: {
            passageEn:
              'Fourteen-year-old Noam loves extreme outdoor sports. He has hiked in the desert and kayaked along rivers, but he has never climbed a volcano. Next July, his family is planning a guided tour to Mount Etna in Italy to see the smoking craters.',
            passageHe:
              'נועם בן ה-14 אוהב ספורט אתגרי בטבע. הוא טייל במדבר ושט בקיאקים בנהרות, אך מעולם לא טיפס על הר געש. ביולי הבא, משפחתו מתכננת סיור מודרך להר אתנה באיטליה כדי לחזות בלועות המעשנים.',
            questionEn: 'What outdoor activity has Noam NOT done yet?',
            questionHe: 'איזו פעילות שטח נועם עדיין לא עשה?',
            correct: 'Climbed a volcano.',
            wrong: [
              'Hiked in the desert.',
              'Kayaked along rivers.',
            ],
          },
        },
      },
      {
        icon: '🏅',
        titleEn: 'Young Record Breakers',
        titleHe: 'שוברים שיאים צעירים',
        storyHookHe: 'מה כבר הספקתם לעשות ומה עדיין לא? נתרגל שימוש ב-Already (כבר) וב-Yet (עדיין לא / כבר בשאלות).',
        grammarTopic: 'Present Perfect with Already and Yet',
        skills: ['Already vs. Yet', 'Sports Records', 'V3 Irregular Verbs'],
        sentenceEn: 'She has already won two international medals, but she has not stopped training yet.',
        sentenceHe: 'היא כבר זכתה בשתי מדליות בינלאומיות, אך היא עדיין לא הפסיקה להתאמן.',
        vocab: [
          ['achievement', 'noun', 'הישג', '🏆', 'Finishing the marathon was her greatest achievement.', 'סיום המרתון היה הישגה הגדול ביותר.'],
          ['compete', 'verb', 'להתחרות', '🤺', 'Athletes from fifty countries compete in the games.', 'ספורטאים מחמישים מדינות מתחרים במשחקים.'],
          ['record', 'noun', 'שיא', '⏱️', 'The young runner set a new national record.', 'הרץ הצעיר קבע שיא לאומי חדש.'],
          ['dedication', 'noun', 'מסירות / התמדה', '🔥', 'Success in music requires years of dedication.', 'הצלחה במוזיקה דורשת שנים של מסירות.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'trophy', translationHe: 'גביע' },
            { wordEn: 'celebration', translationHe: 'חגיגה' },
          ],
          shortSentenceEn: 'She has already won medals.',
          shortSentenceHe: 'היא כבר זכתה במדליות.',
          rule: {
            questionEn: 'Where does "yet" typically appear in a sentence?',
            correct: 'Have you finished your homework yet?',
            wrong: [
              'Have you yet finished your homework?',
              'I have yet finished my homework.',
            ],
            explainHe: 'המילה yet מופיעה בדרך כלל בסוף משפטי שלילה ושאלה ב-Present Perfect.',
          },
          story: {
            passageEn:
              'Ella started gymnastics when she was five years old. At age thirteen, she has already broken three regional records. However, she has not competed in the European finals yet. Her coach says that with daily dedication, she will win gold.',
            passageHe:
              'אלה התחילה בהתעמלות קרקע כשהייתה בת חמש. בגיל שלוש עשרה, היא כבר שברה שלושה שיאים אזוריים. עם זאת, היא עדיין לא התחרתה בגמר האירופי. מאמנה אומר שעם התמדה יומיומית, היא תזכה בזהב.',
            questionEn: 'What milestone has Ella NOT reached yet?',
            questionHe: 'לאיזה יעד אלה עדיין לא הגיעה?',
            correct: 'Competing in the European finals.',
            wrong: [
              'Breaking regional records.',
              'Starting gymnastics training.',
            ],
          },
        },
      },
      {
        icon: '🎖️',
        isBoss: true,
        titleEn: 'Boss: Teen Explorer of the Year',
        titleHe: 'אתגר הבוס: חוקר/ת השנה הצעיר/ה',
        storyHookHe: 'אתגר בוס לפרק 3: הבחנה מדויקת בין Past Simple (זמן מוגדר) לבין Present Perfect (ללא זמן מוגדר)!',
        grammarTopic: 'Present Perfect vs. Past Simple Distinction Review',
        skills: ['Boss Challenge', 'Tense Distinction', 'Reading Mastery'],
        sentenceEn: 'She has visited thirty countries, but last year she explored Antarctica for science.',
        sentenceHe: 'היא ביקרה בשלושים מדינות, אך בשנה שעברה היא חקרה את אנטארקטיקה למען המדע.',
        vocab: [
          ['expedition', 'noun', 'משלחת מחקר', '🧊', 'The Arctic expedition lasted four freezing weeks.', 'משלחת המחקר לקוטב נמשכה ארבעה שבועות קפואים.'],
          ['courage', 'noun', 'אומץ לב', '🦁', 'It takes courage to speak in front of hundreds.', 'דרוש אומץ לב כדי לדבר בפני מאות אנשים.'],
          ['remarkable', 'adjective', 'יוצא דופן / ראוי לציון', '⭐', 'The young inventor presented a remarkable idea.', 'הממציא הצעיר הציג רעיון יוצא דופן.'],
          ['participate', 'verb', 'להשתתף', '🤝', 'Many teenagers participate in volunteer projects.', 'בני נוער רבים משתתפים בפרויקטים התנדבותיים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'curiosity', translationHe: 'סקרנות' },
            { wordEn: 'challenge', translationHe: 'אתגר' },
          ],
          shortSentenceEn: 'She explored the cold land.',
          shortSentenceHe: 'היא חקרה את הארץ הקרה.',
          rule: {
            questionEn: 'Which sentence correctly chooses between Past Simple and Present Perfect?',
            correct: 'I visited London in 2023, but I have never seen Paris.',
            wrong: [
              'I have visited London in 2023, but I have never seen Paris.',
              'I visited London in 2023, but I never saw Paris in my life.',
            ],
            explainHe: 'כשיש ציון זמן מדויק בעבר (in 2023) חייבים להשתמש ב-Past Simple. כשמדברים על ניסיון חיים כללי נשתמש ב-Present Perfect.',
          },
          story: {
            passageEn:
              'Maya has accomplished more before age fifteen than many adults. Over the past three years, she has written articles about environmental science and participated in global youth forums. In 2024, she joined a scientific expedition to Antarctica. There, she collected water samples and photographed wildlife. Her courage and curiosity have inspired students worldwide.',
            passageHe:
              'מאיה השיגה לפני גיל חמש עשרה יותר ממה שמבוגרים רבים משיגים. במהלך שלוש השנים האחרונות, היא כתבה מאמרים על מדעי הסביבה והשתתפה בפורומי נוער עולמיים. בשנת 2024, היא הצטרפה למשלחת מדעית לאנטארקטיקה. שם, היא אספה דגימות מים וצילמה חיות בר. האומץ והסקרנות שלה העניקו השראה לתלמידים ברחבי העולם.',
            questionEn: 'What specific research task did Maya perform in Antarctica in 2024?',
            questionHe: 'איזו משימת מחקר ספציפית ביצעה מאיה באנטארקטיקה בשנת 2024?',
            correct: 'She collected water samples.',
            wrong: [
              'She built a weather satellite.',
              'She taught English to tourists.',
            ],
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 4: Planet Earth & Eco-Warriors',
    titleHe: 'פרק 4: שומרים על כדור הארץ',
    subtitleHe: 'משפטי תנאי ראשון (First Conditional), מילות קישור של סיבה ותוצאה ואוצר מילים ירוק',
    badgeEmoji: '🌍',
    missions: [
      {
        icon: '🌊',
        titleEn: 'If We Protect the Oceans',
        titleHe: 'אם נגן על האוקיינוסים',
        storyHookHe: 'העתיד של כדור הארץ בידיים שלנו! נלמד לבנות משפטי תנאי ראשון: מה יקרה בעתיד (will) אם נפעל עכשיו (if + present).',
        grammarTopic: 'First Conditional (If + Present Simple, Will + Base Verb)',
        skills: ['First Conditional', 'Ecology Vocab', 'Cause and Effect'],
        sentenceEn: 'If we stop polluting the water, coral reefs will recover quickly.',
        sentenceHe: 'אם נפסיק לזהם את המים, שוניות האלמוגים יתאוששו במהירות.',
        vocab: [
          ['pollution', 'noun', 'זיהום', '🛢️', 'Plastic pollution harms ocean wildlife.', 'זיהום פלסטיק פוגע בחיות הים.'],
          ['creature', 'noun', 'יצור / בעל חיים', '🐢', 'Sea turtles are gentle marine creatures.', 'צבי ים הם יצורים ימיים עדינים.'],
          ['recover', 'verb', 'להתאושש / להחלים', '🌱', 'The forest will recover after the rain.', 'היער יתאושש אחרי הגשם.'],
          ['protect', 'verb', 'להגן על / לשמור', '🛡️', 'We must protect our natural reserves.', 'חובה עלינו להגן על שמורות הטבע שלנו.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'damage', translationHe: 'נזק' },
            { wordEn: 'factory', translationHe: 'מפעל' },
          ],
          shortSentenceEn: 'Coral reefs will recover.',
          shortSentenceHe: 'שוניות האלמוגים יתאוששו.',
          rule: {
            questionEn: 'Which sentence correctly follows the First Conditional structure?',
            correct: 'If temperatures rise, ice sheets will melt faster.',
            wrong: [
              'If temperatures will rise, ice sheets will melt faster.',
              'If temperatures rise, ice sheets melt faster tomorrow.',
            ],
            explainHe: 'בחלק התנאי עם If משתמשים ב-Present Simple (ללא will), ובחלק התוצאה משתמשים ב-will + פועל מקור.',
          },
          story: {
            passageEn:
              'Marine biologist Dr. Lavi spoke to high school students about ocean conservation. "Our oceans produce half of the oxygen on Earth," she explained. "If we reduce plastic waste today, marine creatures will thrive and future generations will enjoy clean beaches."',
            passageHe:
              'הביולוגית הימית ד"ר לביא שוחחה עם תלמידים על שימור האוקיינוס. "האוקיינוסים שלנו מייצרים מחצית מהחמצן בכדור הארץ," הסבירה. "אם נפחית את פסולת הפלסטיק היום, יצורים ימיים ישגשגו והדורות הבאים ייהנו מחופים נקיים."',
            questionEn: 'What positive result will happen if we reduce plastic waste?',
            questionHe: 'איזו תוצאה חיובית תקרה אם נפחית פסולת פלסטיק?',
            correct: 'Marine creatures will thrive.',
            wrong: [
              'The oceans will freeze over.',
              'People will stop swimming in the sea.',
            ],
          },
        },
      },
      {
        icon: '☀️',
        titleEn: 'Renewable Energy Innovators',
        titleHe: 'ממציאי האנרגיה המתחדשת',
        storyHookHe: 'איך יוצרים אנרגיה מהשמש ומהרוח? נתרגל מילות קישור של סיבה ותוצאה (as a result, therefore, because).',
        grammarTopic: 'Connectors of Cause and Effect (Therefore, As a result, Because)',
        skills: ['Connectors', 'Green Energy Vocab', 'Reading Analysis'],
        sentenceEn: 'Solar panels generate clean power; therefore, cities reduce harmful carbon emissions.',
        sentenceHe: 'לוחות סולאריים מייצרים חשמל נקי; לכן, ערים מפחיתות פליטות פחמן מזיקות.',
        vocab: [
          ['electricity', 'noun', 'חשמל', '⚡', 'Wind turbines generate clean electricity.', 'טורבינות רוח מייצרות חשמל נקי.'],
          ['renewable', 'adjective', 'מתחדש / בר-קיימא', '♻️', 'Solar power is a renewable resource.', 'אנרגיה סולארית היא משאב מתחדש.'],
          ['generate', 'verb', 'לייצר / להפיק', '💡', 'Dams generate power from moving water.', 'סכרים מפיקים אנרגיה ממים זורמים.'],
          ['sustainable', 'adjective', 'בר-קיימא', '🌍', 'We should build sustainable green cities.', 'כדאי שנבנה ערים ירוקות בנות-קיימא.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'dangerous', translationHe: 'מסוכן' },
            { wordEn: 'expensive', translationHe: 'יקר' },
          ],
          shortSentenceEn: 'Panels generate clean power.',
          shortSentenceHe: 'לוחות מייצרים חשמל נקי.',
          rule: {
            questionEn: 'Which connector expresses a logical conclusion or result?',
            correct: 'The project proved successful; therefore, funding was expanded.',
            wrong: [
              'The project proved successful; because, funding was expanded.',
              'The project proved successful; although, funding was expanded.',
            ],
            explainHe: 'המילה therefore (לפיכך / לכן) מציגה תוצאה או מסקנה הגיונית של המשפט הקודם.',
          },
          story: {
            passageEn:
              'A group of ninth-grade students in the Negev designed a smart solar tracker for school rooftops. The device automatically follows the sun throughout the day. As a result, the solar panels generate thirty percent more electricity. Their school now powers its computer labs with zero carbon emissions.',
            passageHe:
              'קבוצת תלמידי כיתה ט׳ בנגב תכננה עוקב שמש חכם לגגות בתי ספר. המכשיר עוקב באופן אוטומטי אחר השמש לאורך היום. כתוצאה מכך, הלוחות הסולאריים מפיקים שלושים אחוז יותר חשמל. בית הספר שלהם מפעיל כעת את מעבדות המחשבים עם אפס פליטות פחמן.',
            questionEn: 'What was the result of the smart tracking device?',
            questionHe: 'מה הייתה התוצאה של מכשיר המעקב החכם?',
            correct: 'Panels generated thirty percent more power.',
            wrong: [
              'The school closed its computer labs.',
              'Electricity bills doubled in price.',
            ],
          },
        },
      },
      {
        icon: '🌱',
        isBoss: true,
        titleEn: 'Boss: Global Youth Climate Summit',
        titleHe: 'אתגר הבוס: ועידת האקלים העולמית לנוער',
        storyHookHe: 'אתגר בוס לפרק 4: נאום בוועידת האקלים הבינלאומית! הוכיחו שליטה בתנאי ראשון, מילות קישור וטיעונים מנומקים.',
        grammarTopic: 'Comprehensive Review: Conditionals & Environmental Discourse',
        skills: ['Boss Challenge', 'Public Speaking Vocab', 'Band II Mastery'],
        sentenceEn: 'If teenagers lead the change today, our planet will have a sustainable future.',
        sentenceHe: 'אם בני נוער יובילו את השינוי היום, לכוכב שלנו יהיה עתיד בר-קיימא.',
        vocab: [
          ['atmosphere', 'noun', 'אטמוספירה / אקלים', '☁️', 'Forests absorb carbon from the atmosphere.', 'יערות סופגים פחמן מהאטמוספירה.'],
          ['inspire', 'verb', 'להעניק השראה', '✨', 'Young speakers inspire adults to take action.', 'נואמים צעירים מעניקים השראה למבוגרים לפעול.'],
          ['solution', 'noun', 'פתרון', '💡', 'Together we will discover creative solutions.', 'יחד נגלה פתרונות יצירתיים.'],
          ['community', 'noun', 'קהילה', '🏘️', 'Our local community plants fruit trees.', 'הקהילה המקומית שלנו שותלת עצי פרי.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'disaster', translationHe: 'אסון' },
            { wordEn: 'threat', translationHe: 'איום' },
          ],
          shortSentenceEn: 'Teenagers lead the change.',
          shortSentenceHe: 'בני נוער מובילים שינוי.',
          rule: {
            questionEn: 'Which sentence combines a condition and consequence correctly?',
            correct: 'If our community plants more trees, the air will become cleaner.',
            wrong: [
              'If our community will plant more trees, the air becomes cleaner.',
              'If our community plants more trees, the air became cleaner.',
            ],
            explainHe: 'במשפט תנאי ראשון: If + פועל בהווה (plants), והתוצאה ב-will + מקור (will become).',
          },
          story: {
            passageEn:
              'Five hundred youth delegates from eighty nations gathered in Geneva for the annual climate summit. During the opening ceremony, sixteen-year-old Shira delivered an emotional speech. "If we wait for someone else to act, it will be too late," she warned. "However, if every community adopts renewable energy and protects local habitats, we will restore the balance of our atmosphere." The audience gave her a standing ovation.',
            passageHe:
              'חמש מאות נציגי נוער משמונים מדינות התכנסו בז׳נבה לוועידת האקלים השנתית. במהלך טקס הפתיחה, שירה בת השש עשרה נשאה נאום מרגש. "אם נחכה שמישהו אחר יפעל, יהיה מאוחר מדי," הזהירה. "עם זאת, אם כל קהילה תאמץ אנרגיה מתחדשת ותגן על בתי הגידול המקומיים, נשקם את האיזון של האטמוספירה שלנו." הקהל הריע לה במחיאות כפיים סוערות בעמידה.',
            questionEn: 'What core message did Shira convey to the delegates?',
            questionHe: 'איזה מסר מרכזי העבירה שירה לנציגים?',
            correct: 'Communities must act immediately rather than wait.',
            wrong: [
              'Youth should leave environmental science to adults.',
              'The summit should be postponed until next year.',
            ],
          },
        },
      },
    ],
  },
]);
