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
            hintHe: 'אחרי While באה הפעולה הארוכה ברקע (was / were + ing). וגם כדאי לבדוק שאחרי While בא הנושא.',
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which word is right? I ___ sleeping when the phone rang.',
                correct: 'was',
                wrong: ['were'],
                explainHe: 'עם I משתמשים ב-was בעבר המתמשך: I was sleeping.',
                hintHe: 'I הוא יחיד. איזו צורת עבר של be מתאימה?',
              },
              story: {
                passageEn: 'Dan was at the station. He was eating an apple. A train came.',
                passageHe: 'דן היה בתחנה. הוא אכל תפוח. רכבת הגיעה.',
                questionEn: 'What was Dan eating?',
                questionHe: 'מה דן אכל?',
                correct: 'An apple.',
                wrong: ['A sandwich.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['subject', 'song'],
                ['invention', 'neighbor'],
                ['hungrily', 'kindly'],
                ['ticket', 'suitcase'],
              ],
            },
            master: {
              sentenceEn: 'We heard a loud bell while the guide was talking about the temple.',
              sentenceHe: 'שמענו פעמון חזק בזמן שהמדריך דיבר על המקדש.',
              decoys: ['were', 'talk'],
              voiceEn: 'We were walking to the station.',
              voiceHe: 'הלכנו אל התחנה.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Ben was reading a map when the bus stopped.',
                wrong: [
                  'Ben were reading a map when the bus stopped.',
                  'Ben was read a map when the bus stopped.',
                  'Ben was reading a map when the bus was stop.',
                ],
                explainHe: 
                  'ב-Past Continuous משתמשים ב-was / were + ing. עם Ben (יחיד) נשתמש ב-was, והפעולה הקצרה באה ב-Past Simple.',
                hintEn: 'Check the helping verb and the verb ending in each sentence.',
              },
              story: {
                passageEn: 
                  'Mina and her father arrived at the small mountain station just before sunset. While they were buying tickets, the speaker announced that the last train to the lake had left ten minutes earlier. Mina looked at her father and smiled. They took out their map, found a bus that went to the lake, and ran across the road with their heavy bags.',
                passageHe: '',
                questionEn: 'Why did Mina and her father run across the road?',
                questionHe: '',
                correct: 'They needed another way to reach the lake.',
                wrong: [
                  'They wanted to buy tickets for the next train.',
                  'They forgot their map at the station.',
                  'They were looking for the hotel kitchen.',
                ],
              },
              storyHintEn: 'Think about what the announcement meant for them.',
            },
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
          ['attendant', 'noun', 'דייל / דיילת', '🧑‍✈️', 'The flight attendant helped us find our seats.', 'הדייל עזר לנו למצוא את המקומות שלנו.'],
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
            hintHe: 'They הוא רבים: איזו צורת עבר של be מתאימה? וב-Past Continuous הפועל מקבל ing.',
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which word is right? They ___ looking for the bag.',
                correct: 'were',
                wrong: ['was'],
                explainHe: 'עם They משתמשים ב-were: They were looking.',
                hintHe: 'They הוא רבים. איזו צורת עבר של be מתאימה?',
              },
              story: {
                passageEn: 'Sam waited at the airport. His bag was not on the belt. The man said sorry.',
                passageHe: 'סם חיכה בשדה התעופה. המזוודה שלו לא הייתה על המסוע. האיש אמר סליחה.',
                questionEn: 'Where did Sam wait?',
                questionHe: 'איפה סם חיכה?',
                correct: 'At the airport.',
                wrong: ['At school.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['seat', 'gate'],
                ['engine', 'wing'],
                ['luggage', 'passport'],
                ['celebrate', 'volunteer'],
              ],
            },
            master: {
              sentenceEn: 
                'The passengers were waiting patiently when the airline made an important announcement.',
              sentenceHe: 'הנוסעים חיכו בסבלנות כשחברת התעופה השמיעה הודעה חשובה.',
              decoys: ['wait', 'was'],
              voiceEn: 'The bags arrived the next day.',
              voiceHe: 'המזוודות הגיעו למחרת.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'We were standing in line when they called our names.',
                wrong: [
                  'We was standing in line when they called our names.',
                  'We were stand in line when they called our names.',
                  'We were standing in line when they were call our names.',
                ],
                explainHe: 
                  'עם We משתמשים ב-were + ing לפעולה הארוכה, והפעולה הקצרה (called) באה ב-Past Simple.',
                hintEn: 'Look at we and at the two verbs.',
              },
              story: {
                passageEn: 
                  'Tali missed her connecting flight in Rome because her first plane landed late. At the desk, an attendant apologized and explained that the next flight to Tel Aviv was full until the morning. Tali called her mother, then asked for a hotel voucher and a blanket. In the waiting area, she met a boy who also lost his connection, and they decided to share a taxi.',
                passageHe: '',
                questionEn: 'Why did Tali ask for a hotel voucher?',
                questionHe: '',
                correct: 'She had to stay overnight in Rome.',
                wrong: [
                  'She wanted to leave Rome at once.',
                  'Her plane was waiting for her.',
                  'The attendant lost her bag.',
                ],
              },
              storyHintEn: 'What did the full flight mean for her night?',
            },
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
        sentenceHe: 'בזמן שהנוסעים ישנו, הבלש מצא את שעון הזהב שנעלם.',
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
            hintHe: 'הפעולה הקצרה קוטעת את הארוכה. the detective הוא יחיד: איזו צורה של be מתאימה לו?',
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Choose the correct word: The guards ___ talking when the lights went out.',
                correct: 'were',
                wrong: ['was'],
                explainHe: 'עם The guards (רבים) משתמשים ב-were.',
                hintHe: 'guards הוא רבים. איזו צורה של be מתאימה?',
              },
              story: {
                passageEn: 'Ken is a detective. He saw a man in a black coat. The man ran away.',
                passageHe: 'קן הוא בלש. הוא ראה איש במעיל שחור. האיש ברח.',
                questionEn: 'What coat did the man wear?',
                questionHe: 'איזה מעיל האיש לבש?',
                correct: 'A black coat.',
                wrong: ['A red coat.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['concert', 'holiday'],
                ['spicy', 'crunchy'],
                ['smile', 'laugh'],
                ['noisy', 'salty'],
              ],
            },
            master: {
              sentenceEn: 
                'The detective was questioning the guard when a suspicious noise came from the cabin.',
              sentenceHe: 'הבלש חקר את השומר כשרעש חשוד נשמע מהתא.',
              decoys: ['questioned', 'were'],
              voiceEn: 'The valuable necklace disappeared.',
              voiceHe: 'השרשרת היקרה נעלמה.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'While the guard was sleeping, the thief opened the door.',
                wrong: [
                  'While the guard was sleep, the thief opened the door.',
                  'While the guard were sleeping, the thief opened the door.',
                  'While the guard was sleeping, the thief was open the door.',
                ],
                explainHe: 
                  'אחרי While בא Past Continuous (was + ing) לפעולה הארוכה, ו-the guard הוא יחיד ולכן was.',
                hintEn: 'Check each verb form after the helping verb.',
              },
              story: {
                passageEn: 
                  'The museum guard noticed that the golden mask had disappeared at nine in the evening. The cameras showed only a cleaner who was pushing a trolley past the room. Detective Ken looked at the trolley again. It was much heavier than before, and one wheel left wet marks on the floor. He quietly followed the marks to the storage room.',
                passageHe: '',
                questionEn: 'What did Ken probably think?',
                questionHe: '',
                correct: 'The mask was hidden inside the trolley.',
                wrong: [
                  'The cameras had not worked all day.',
                  'The cleaner was a famous guard.',
                  'The wet marks came from the rain.',
                ],
              },
              storyHintEn: 'Why was the trolley heavier than before?',
            },
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
        sentenceHe: 'האם מצאת את הפתק הסודי, ומה את/ה מתכוונ/ת לעשות אחר כך?',
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
            hintHe: 'אחרי Did הפועל הראשי חוזר לצורת הבסיס, בלי ed.',
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which word is right? ___ you find the note?',
                correct: 'Did',
                wrong: ['Do'],
                explainHe: 'שאלה על העבר פותחת ב-Did.',
                hintHe: 'השאלה היא על משהו שקרה בעבר. איזה פועל עזר מתאים?',
              },
              story: {
                passageEn: 'Mia found a key. It was under a chair. She gave it to her teacher.',
                passageHe: 'מיה מצאה מפתח. הוא היה מתחת לכיסא. היא נתנה אותו למורה.',
                questionEn: 'Where was the key?',
                questionHe: 'איפה היה המפתח?',
                correct: 'Under a chair.',
                wrong: ['On a table.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['climb', 'bake'],
                ['wall', 'villain'],
                ['weather', 'garbage'],
                ['traffic', 'furniture'],
              ],
            },
            master: {
              sentenceEn: 'What are you going to tell the police about the strange man?',
              sentenceHe: 'מה אתם מתכוונים לספר למשטרה על האיש המוזר?',
              decoys: ['will', 'told'],
              voiceEn: 'Did you find any new clues?',
              voiceHe: 'מצאתם רמזים חדשים?',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Did the witness see the man at the station?',
                wrong: [
                  'Did the witness saw the man at the station?',
                  'Was the witness see the man at the station?',
                  'Did the witness seeing the man at the station?',
                ],
                explainHe: 'אחרי Did הפועל הראשי חוזר לצורת הבסיס: see.',
                hintEn: 'What form follows Did in a question?',
              },
              story: {
                passageEn: 
                  'Detective Lee looked at the photo carefully. A woman in a green coat was standing outside the bank, but the clock behind her showed ten past three. The robbery happened at two thirty, and the woman had told the police she was at home all afternoon. Lee closed the folder and said, "I am going to visit her house today."',
                passageHe: '',
                questionEn: 'What does Lee probably think about the woman?',
                questionHe: '',
                correct: 'She did not tell the truth.',
                wrong: [
                  'She is a famous detective.',
                  'She was far from the bank.',
                  'She saw the robbery clearly.',
                ],
              },
              storyHintEn: 'Compare the time in the photo with her story.',
            },
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
          ['direction', 'noun', 'כיוון / הנחיה', '🧭', 'Can you give us directions to the museum?', 'תוכל/י לתת לנו הוראות הגעה למוזיאון?'],
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
            hintHe: 'הכרטיסים נקנו מראש, אז זו תוכנית שכבר נקבעה (be + ___ + to). כדאי לבדוק שכל חלקי המבנה במקום.',
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which word is right? I ___ going to read a book tonight.',
                correct: 'am',
                wrong: ['is'],
                explainHe: 'עם I משתמשים ב-am: I am going to.',
                hintHe: 'איזו צורה של be הולכת עם I?',
              },
              story: {
                passageEn: 
                  'It was raining in London. Dan had no umbrella. His friend said, "I will share mine."',
                passageHe: 
                  'ירד גשם בלונדון. לדן לא הייתה מטרייה. החבר שלו אמר: ״אני אתחלק איתך במטרייה שלי.״',
                questionEn: 'What did the friend share?',
                questionHe: 'במה החבר התחלק?',
                correct: 'An umbrella.',
                wrong: ['A sandwich.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['nickname', 'allergy'],
                ['camera', 'lock'],
                ['loudly', 'noisily'],
                ['souvenir', 'weather'],
              ],
            },
            master: {
              sentenceEn: 'I will take a taxi but Dan is going to walk to the museum.',
              sentenceHe: 'אני אקח מונית אבל דן מתכוון ללכת ברגל למוזיאון.',
              decoys: ['am', 'goes'],
              voiceEn: 'I will help you with the map.',
              voiceHe: 'אני אעזור לך עם המפה.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'We have tickets so we are going to see the show.',
                wrong: [
                  'We have tickets so we will to see the show.',
                  'We have tickets so we are going see the show.',
                  'We have tickets so we going to see the show.',
                ],
                explainHe: 'תוכנית שכבר קבענו: be going to, עם כל החלקים: are + going + to + פועל.',
                hintEn: 'Count the parts of the be going to structure.',
              },
              story: {
                passageEn: 
                  'Eli and Dana planned to meet their guide at the Soho market at noon. They had bought tickets for a walking tour, so they were sure about the plan. Just before noon, a message arrived: the guide was sick. Eli smiled and said, "I will find another guide," and he walked to the information desk.',
                passageHe: '',
                questionEn: 'Why did Eli walk to the information desk?',
                questionHe: '',
                correct: 'To look for a new guide for the tour.',
                wrong: [
                  'To buy tickets for a different city.',
                  'To ask where the market was.',
                  'To tell the guide about the plan.',
                ],
              },
              storyHintEn: 'What changed about the plan?',
            },
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
            hintHe: 'הדלת נעולה, אז המסקנה כמעט ודאית. איזה מודל מבטא ודאות חזקה? ואחרי מודל בא פועל בסיסי בלי to.',
          },
          story: {
            passageEn:
              'Inspector Reed and her young assistants gathered at Baker Street. Two witnesses gave different stories about the missing antique clock. "The thief must have had a master key because the lock is undamaged," argued Reed. "We should verify the security cameras before we accuse anyone," whispered Maya. Their careful investigation proved the suspect was innocent.',
            passageHe:
              'המפקחת ריד ועוזריה הצעירים התכנסו ברחוב בייקר. שני עדים מסרו גרסאות שונות לגבי השעון העתיק החסר. "הגנב היה חייב להחזיק במפתח מאסטר כי המנעול אינו פגום," טענה ריד. "כדאי שנבדוק את מצלמות האבטחה לפני שנאשים מישהו," לחשה מאיה. חקירתם הקפדנית הוכיחה שהחשוד היה חף מפשע.',
            questionEn: 'Why did Inspector Reed believe the thief used a key?',
            questionHe: 'מדוע המפקחת ריד האמינה שהגנב השתמש במפתח?',
            correct: 'Because the door lock had no damage.',
            wrong: [
              'Because the thief dropped the key on the floor.',
              'Because a witness saw the key in his hand.',
            ],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which is right? You should ___ the clues.',
                correct: 'check',
                wrong: ['checking'],
                explainHe: 'אחרי should בא פועל בצורת הבסיס, בלי ing.',
                hintHe: 'אחרי should הפועל מופיע בצורה הפשוטה ביותר שלו.',
              },
              story: {
                passageEn: 'The key was in the bag. The bag was under the desk. Lia found it.',
                passageHe: 'המפתח היה בתיק. התיק היה מתחת לשולחן. ליה מצאה אותו.',
                questionEn: 'Where was the bag?',
                questionHe: 'איפה היה התיק?',
                correct: 'Under the desk.',
                wrong: ['On the chair.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['marry', 'sing'],
                ['ripe', 'muddy'],
                ['tradition', 'headache'],
                ['frozen', 'ripe'],
              ],
            },
            master: {
              sentenceEn: 'The thief must be a guard because the lock is not broken.',
              sentenceHe: 'הגנב חייב להיות שומר כי המנעול לא שבור.',
              decoys: ['to', 'been'],
              voiceEn: 'You should check the cameras first.',
              voiceHe: 'כדאי לבדוק קודם את המצלמות.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'He must be at home because the lights are on.',
                wrong: [
                  'He must to be at home because the lights are on.',
                  'He must is at home because the lights are on.',
                  'He musts be at home because the lights are on.',
                ],
                explainHe: 'אחרי must בא פועל בצורת הבסיס, בלי to ובלי s: must be.',
                hintEn: 'What follows a modal verb?',
              },
              story: {
                passageEn: 
                  'After the museum closed, three people were still inside: a cleaner, a guard and a student. The clock was stolen from a locked room, and only one key opened that door. The cleaner had a ring of keys, but she was on the phone with her son all evening, and the phone company later confirmed the call. The student had no key at all. Inspector Reed turned to the guard.',
                passageHe: '',
                questionEn: 'Why did Reed turn to the guard?',
                questionHe: '',
                correct: 'The others probably could not have taken it.',
                wrong: [
                  'The guard was on the phone all evening.',
                  'The student carried the only key.',
                  'The guard had left before it closed.',
                ],
              },
              storyHintEn: 'Who had both a key and time?',
            },
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
            hintHe: 'Present Perfect בנוי מ-have / has + V3. הפועל try צריך להיות בצורת V3.',
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which is right? She has ___ a volcano.',
                correct: 'climbed',
                wrong: ['climb'],
                explainHe: 'אחרי has בא הפועל בצורת V3: climbed.',
                hintHe: 'ב-Present Perfect הפועל הראשי בצורת V3.',
              },
              story: {
                passageEn: 'Omer went to Italy. He saw a big volcano. It was very hot.',
                passageHe: 'עומר נסע לאיטליה. הוא ראה הר געש גדול. היה מאוד חם.',
                questionEn: 'What did Omer see?',
                questionHe: 'מה עומר ראה?',
                correct: 'A big volcano.',
                wrong: ['A big ship.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['island', 'desert'],
                ['harbor', 'bakery'],
                ['noisy', 'crunchy'],
                ['ingredient', 'envelope'],
              ],
            },
            master: {
              sentenceEn: 'My brother has never climbed a volcano but he has hiked in the desert.',
              sentenceHe: 'אחי מעולם לא טיפס על הר געש אבל הוא טייל במדבר.',
              decoys: ['ever', 'climb'],
              voiceEn: 'Have you ever seen a volcano?',
              voiceHe: 'ראיתם אי פעם הר געש?',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'They have visited three countries this year.',
                wrong: [
                  'They has visited three countries this year.',
                  'They have visit three countries this year.',
                  'They have visiting three countries this year.',
                ],
                explainHe: 'עם They משתמשים ב-have, ואחריו פועל בצורת V3: visited.',
                hintEn: 'Check the helping verb and the verb form.',
              },
              story: {
                passageEn: 
                  'Last summer, Roni climbed Mount Etna with her uncle. They started before sunrise because the afternoon sun is very hot on the black rocks. After four hours, Roni felt tired and her uncle offered to turn back. She drank some water, looked at the smoke far above, and kept walking. At the top, she took a photo and said it was the best day of her life.',
                passageHe: '',
                questionEn: 'Why did Roni keep walking?',
                questionHe: '',
                correct: 'She was determined to reach the top.',
                wrong: [
                  'Her uncle was too tired to go down.',
                  'She had no water left to drink.',
                  'The path back was closed by smoke.',
                ],
              },
              storyHintEn: 'Think about what Roni chose after the rest.',
            },
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
            hintHe: 'המילה yet באה בדרך כלל בסוף שאלה או שלילה ב-Present Perfect.',
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'I have already finished my homework.',
                wrong: ['I have yet finished my homework.'],
                explainHe: 'במשפט חיובי משתמשים ב-already (כבר). yet שייכת לשאלות ולשלילה.',
                hintHe: 'המשפט חיובי ואומר שהפעולה כבר נעשתה.',
              },
              story: {
                passageEn: 'Ella runs every day. She won a gold medal. She is very happy.',
                passageHe: 'אלה רצה כל יום. היא זכתה במדליית זהב. היא מאוד שמחה.',
                questionEn: 'What did Ella win?',
                questionHe: 'במה אלה זכתה?',
                correct: 'A gold medal.',
                wrong: ['A big cup.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['ticket', 'uniform'],
                ['cook', 'shop'],
                ['lunch', 'shoe'],
                ['noise', 'sunshine'],
              ],
            },
            master: {
              sentenceEn: 'She has already broken two records but has not won gold yet.',
              sentenceHe: 'היא כבר שברה שני שיאים אבל עדיין לא זכתה בזהב.',
              decoys: ['break', 'still'],
              voiceEn: 'Have you finished training yet?',
              voiceHe: 'סיימתם להתאמן כבר?',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Has Dana finished her race yet?',
                wrong: [
                  'Has Dana yet finished her race?',
                  'Did Dana finished her race yet?',
                  'Has Dana finish her race yet?',
                ],
                explainHe: 'בשאלה ב-Present Perfect: Has + נושא + V3, ו-yet בסוף המשפט.',
                hintEn: 'Check the verb form and where yet goes.',
              },
              story: {
                passageEn: 
                  'Yoav joined the swimming team two years ago. At first he came last in every race, and some boys laughed at him. He did not stop. Every morning at six he was at the pool, long before the others arrived. This year Yoav has already won two local races, and his coach has chosen him for the national finals.',
                passageHe: '',
                questionEn: 'Why has the coach chosen Yoav for the finals?',
                questionHe: '',
                correct: 'He practiced hard and got better.',
                wrong: [
                  'He has always won every race.',
                  'He swims in a bigger pool.',
                  'His friends asked the coach.',
                ],
              },
              storyHintEn: 'Compare how Yoav started with how he is now.',
            },
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
            hintHe: 'יש ציון זמן מדויק (in 2023)? אז עבר פשוט. ניסיון חיים בלי זמן? אז Present Perfect.',
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'I went to London in 2023.',
                wrong: ['I have gone to London in 2023.'],
                explainHe: 'עם זמן מוגדר בעבר (in 2023) משתמשים ב-Past Simple.',
                hintHe: 'יש כאן שנה מדויקת. איזה זמן מתאים לזה?',
              },
              story: {
                passageEn: 'Tom is fifteen. He went to the Arctic last year. It was very cold.',
                passageHe: 'תום בן חמש עשרה. הוא נסע לאזור הארקטי בשנה שעברה. היה קר מאוד.',
                questionEn: 'Where did Tom go?',
                questionHe: 'לאן תום נסע?',
                correct: 'To the Arctic.',
                wrong: ['To the desert.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['birthday', 'recipe'],
                ['furniture', 'sunshine'],
                ['noisy', 'muddy'],
                ['arrive', 'laugh'],
              ],
            },
            master: {
              sentenceEn: 
                'He has visited many countries but last winter he joined an expedition to Greenland.',
              sentenceHe: 'הוא ביקר בהרבה מדינות אבל בחורף שעבר הוא הצטרף למשלחת לגרינלנד.',
              decoys: ['visit', 'ago'],
              voiceEn: 'I have never seen a glacier.',
              voiceHe: 'מעולם לא ראיתי קרחון.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'I have never eaten sushi, but I visited Tokyo in 2022.',
                wrong: [
                  'I have never eaten sushi, but I have visited Tokyo in 2022.',
                  'I never have eaten sushi, but I visited Tokyo in 2022.',
                  'I have never ate sushi, but I visited Tokyo in 2022.',
                ],
                explainHe: 
                  'ניסיון חיים כללי: Present Perfect (have never eaten). זמן מדויק (in 2022): Past Simple.',
                hintEn: 'Which part has an exact time?',
              },
              story: {
                passageEn: 
                  'Noa wanted to join the school science expedition to the Dead Sea, but only ten students could go. She had never been on a trip without her parents, and she felt nervous. Her teacher asked every student to explain why they wanted to participate. Noa wrote about her grandmother, who had worked in a salt factory by the sea for thirty years. The next morning the teacher read the list of names aloud, and Noa was the first.',
                passageHe: '',
                questionEn: 'Why was Noa probably chosen?',
                questionHe: '',
                correct: 'Her personal story impressed the teacher.',
                wrong: [
                  'She had joined many trips before.',
                  'She was the only one who wrote an answer.',
                  'Her teacher worked in a salt factory.',
                ],
              },
              storyHintEn: 'Think about what each student had to write.',
            },
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
            hintHe: 'בחלק של If לא שמים will. ובחלק התוצאה צריך להגיד will + פועל בסיסי.',
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which word is right? If I study, I ___ pass the test.',
                correct: 'will',
                wrong: ['did'],
                explainHe: 'בתנאי ראשון התוצאה באה עם will + פועל בסיסי.',
                hintHe: 'מדובר בעתיד האפשרי. איזו מילה מבטאת עתיד?',
              },
              story: {
                passageEn: 'Sara picked up plastic on the beach. She put it in a bin. The beach was clean.',
                passageHe: 'שרה אספה פלסטיק בחוף. היא שמה אותו בפח. החוף היה נקי.',
                questionEn: 'Where did Sara put the plastic?',
                questionHe: 'איפה שרה שמה את הפלסטיק?',
                correct: 'In a bin.',
                wrong: ['In the sea.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['sunshine', 'music'],
                ['plant', 'rock'],
                ['travel', 'whisper'],
                ['borrow', 'cook'],
              ],
            },
            master: {
              sentenceEn: 'If we reduce plastic waste the oceans will become much cleaner soon.',
              sentenceHe: 'אם נפחית את פסולת הפלסטיק האוקיינוסים יהפכו נקיים בהרבה בקרוב.',
              decoys: ['reduced', 'would'],
              voiceEn: 'We will protect the sea turtles.',
              voiceHe: 'אנחנו נגן על צבי הים.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'If we plant trees, the air will be cleaner.',
                wrong: [
                  'If we will plant trees, the air will be cleaner.',
                  'If we plants trees, the air will be cleaner.',
                  'If we plant trees, the air will being cleaner.',
                ],
                explainHe: 'בחלק של If משתמשים בהווה פשוט (plant), ובתוצאה ב-will + פועל בסיסי (will be).',
                hintEn: 'Check the if part and the result part separately.',
              },
              story: {
                passageEn: 
                  'Every Saturday, a group of students visits a small beach near Haifa. At first they only collected bottles, but then they counted what they found: more than two hundred pieces of plastic in one morning. They showed the numbers to the city council and asked for more bins and a ban on plastic straws. A month later, new bins appeared on the beach, and fewer straws were found each week.',
                passageHe: '',
                questionEn: 'Why did the students count the plastic?',
                questionHe: '',
                correct: 'Numbers helped them convince the council.',
                wrong: [
                  'They wanted to sell it for money.',
                  'The council asked them to stop.',
                  'They could not find any bins.',
                ],
              },
              storyHintEn: 'What did the students do with the numbers?',
            },
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
          ['renewable', 'adjective', 'מתחדש', '♻️', 'Solar power is a renewable resource.', 'אנרגיה סולארית היא משאב מתחדש.'],
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
            hintHe: 'מחפשים מילת קישור שמשמעותה לכן: החלק השני הוא תוצאה של הראשון.',
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which word shows a result? It rained, ___ we stayed home.',
                correct: 'so',
                wrong: ['because'],
                explainHe: 'so מציגה תוצאה: ירד גשם, ולכן נשארנו בבית.',
                hintHe: 'החלק השני הוא תוצאה של הראשון.',
              },
              story: {
                passageEn: 'The sun shines in Eilat. Solar panels make electricity. The school uses it.',
                passageHe: 'השמש זורחת באילת. לוחות סולאריים מייצרים חשמל. בית הספר משתמש בו.',
                questionEn: 'What do solar panels make?',
                questionHe: 'מה לוחות סולאריים מייצרים?',
                correct: 'Electricity.',
                wrong: ['Water.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['smoke', 'plastic'],
                ['friendly', 'muddy'],
                ['burn', 'drink'],
                ['polluted', 'wasteful'],
              ],
            },
            master: {
              sentenceEn: 'The school installed solar panels and as a result its bills went down.',
              sentenceHe: 'בית הספר התקין לוחות סולאריים וכתוצאה מכך החשבונות שלו ירדו.',
              decoys: ['because', 'although'],
              voiceEn: 'Wind can make clean electricity.',
              voiceHe: 'רוח יכולה לייצר חשמל נקי.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The sun was strong; therefore, the panels worked well.',
                wrong: [
                  'The sun was strong; because, the panels worked well.',
                  'The sun was strong; although, the panels worked well.',
                  'The sun was strong; however, the panels worked well.',
                ],
                explainHe: 'therefore מציגה תוצאה הגיונית. because, although ו-however לא מתאימות לכאן.',
                hintEn: 'Which word means as a result?',
              },
              story: {
                passageEn: 
                  'A small village in the north had no electricity during the winter storms. The villagers decided to build a wind turbine on the hill above the school. It cost a lot of money, so every family gave a little, and the school sold handmade candles. Two years later, the village has light even in storms, and nobody pays a bill to a power company.',
                passageHe: '',
                questionEn: 'Why did every family give a little money?',
                questionHe: '',
                correct: 'The turbine was too expensive for one person.',
                wrong: [
                  'The power company asked them to.',
                  'The school needed new candles.',
                  'They wanted to move to the hill.',
                ],
              },
              storyHintEn: 'Why was the turbine paid for by many people?',
            },
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
        sentenceHe: 'אם בני נוער יובילו את השינוי היום, לכוכב הלכת שלנו יהיה עתיד בר-קיימא.',
        vocab: [
          ['atmosphere', 'noun', 'אטמוספירה / אווירה', '☁️', 'Forests absorb carbon from the atmosphere.', 'יערות סופגים פחמן מהאטמוספירה.'],
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
          shortSentenceHe: 'בני נוער מובילים את השינוי.',
          rule: {
            questionEn: 'Which sentence combines a condition and consequence correctly?',
            correct: 'If our community plants more trees, the air will become cleaner.',
            wrong: [
              'If our community will plant more trees, the air becomes cleaner.',
              'If our community plants more trees, the air became cleaner.',
            ],
            explainHe: 'במשפט תנאי ראשון: If + פועל בהווה (plants), והתוצאה ב-will + מקור (will become).',
            hintHe: 'בתנאי ראשון: If + הווה פשוט, והתוצאה ב-will + פועל בסיסי.',
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which is right? If we plant trees, the air ___ cleaner.',
                correct: 'will be',
                wrong: ['was'],
                explainHe: 'בתנאי ראשון התוצאה באה עם will + פועל בסיסי.',
                hintHe: 'מדובר בעתיד. איזו צורה מבטאת עתיד?',
              },
              story: {
                passageEn: 'Ben has a small garden. He plants flowers. The bees come.',
                passageHe: 'לבן יש גינה קטנה. הוא שותל פרחים. הדבורים מגיעות.',
                questionEn: 'What does Ben plant?',
                questionHe: 'מה בן שותל?',
                correct: 'Flowers.',
                wrong: ['Carrots.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['library', 'playground'],
                ['prevent', 'confuse'],
                ['headache', 'sneeze'],
                ['climate', 'traffic'],
              ],
            },
            master: {
              sentenceEn: 'If every community plants trees the planet will have cleaner air.',
              sentenceHe: 'אם כל קהילה תשתול עצים לכדור הארץ יהיה אוויר נקי יותר.',
              decoys: ['plant', 'would'],
              voiceEn: 'Young people can inspire change.',
              voiceHe: 'צעירים יכולים לעורר שינוי.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'If we waste less water, the lake will recover.',
                wrong: [
                  'If we wasted less water, the lake will recover.',
                  'If we waste less water, the lake recovered.',
                  'If we will waste less water, the lake will recover.',
                ],
                explainHe: 
                  'בתנאי ראשון: If + הווה פשוט (waste), והתוצאה ב-will + פועל בסיסי (will recover).',
                hintEn: 'Check the tense in each half.',
              },
              story: {
                passageEn: 
                  'At the youth summit, Adam listened to a speaker who said that cities in the north were already planting forests on empty land. Adam lives in a town with a large empty field behind the school. After the summit he asked his classmates, the mayor and a local farmer for help. Within a year, three hundred young trees were growing there, and the town council named the field after the summit.',
                passageHe: '',
                questionEn: 'Why did Adam ask the mayor and a farmer for help?',
                questionHe: '',
                correct: 'He wanted to start a forest in his own town.',
                wrong: [
                  'He wanted to leave the town forever.',
                  'They had already planted the whole field.',
                  'The speaker told him to sell trees.',
                ],
              },
              storyHintEn: 'What idea did Adam bring home from the summit?',
            },
          },
        },
      },
    ],
  },
]);
