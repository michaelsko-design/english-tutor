import type { ExamBankPack } from './types';

/**
 * Grade 8 exam question bank (Feature 43, Band II completion). New questions only: none of them
 * appears in a grade 8 mission, mini-lesson, the placement test or a contest. The last 2 items of
 * each list and the second passage are for the mock exam.
 */
export const GRADE_8_EXAM_BANK: ExamBankPack = {
  // Unit 1: Past Simple vs. Past Continuous, while / when
  1: {
    vocabulary: [
      {
        clozeEn: 'After a twelve-hour flight, we finally reached our ____: a small island in Greece.',
        clozeHe: 'אחרי טיסה של שתים עשרה שעות הגענו סוף סוף ליעד שלנו: אי קטן ביוון.',
        answer: 'destination',
        wrong: ['luggage', 'apologize'],
      },
      {
        clozeEn: 'The flight ____ brought me a blanket because I was cold.',
        clozeHe: 'הדייל הביא לי שמיכה כי היה לי קר.',
        answer: 'attendant',
        wrong: ['journey', 'announcement'],
      },
      {
        clozeEn: 'We were waiting at the gate when we heard an ____ about a delay.',
        clozeHe: 'חיכינו ליד השער כששמענו הודעה על עיכוב.',
        answer: 'announcement',
        wrong: ['attendant', 'experience'],
      },
      {
        clozeEn: 'The man in the black coat looked ____, so the guard followed him.',
        clozeHe: 'האיש במעיל השחור נראה חשוד, אז השומר עקב אחריו.',
        answer: 'suspicious',
        wrong: ['apologize', 'journey'],
      },
      {
        clozeEn: 'Keep your passport in a safe place. It is more ____ than anything in your bag.',
        clozeHe: 'שמרו את הדרכון במקום בטוח. הוא שווה יותר מכל דבר אחר בתיק.',
        answer: 'valuable',
        wrong: ['suddenly', 'announcement'],
      },
      {
        clozeEn: 'The train ride across the mountains was the best part of our ____.',
        clozeHe: 'הנסיעה ברכבת דרך ההרים הייתה החלק הכי טוב במסע שלנו.',
        answer: 'journey',
        wrong: ['apologize', 'suspicious'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "While I ____ a shower, the lights went out."',
        correct: 'was taking',
        wrong: ['took', 'am taking'],
        explainHe: 'אחרי while באה בדרך כלל הפעולה הארוכה שהייתה באמצע, ולכן Past Continuous: was taking.',
        hintHe: 'איזו פעולה נמשכה זמן ארוך, ואיזו קטעה אותה פתאום? הפעולה הארוכה באה בזמן אחר.',
      },
      {
        questionEn: 'Complete the sentence: "We were walking to the hotel when it ____ to rain."',
        correct: 'started',
        wrong: ['was starting', 'starts'],
        explainHe: 'הגשם התחיל פתאום, באמצע ההליכה, ולכן Past Simple אחרי when: it started.',
        hintHe: 'הפעולה הקצרה קטעה את ההליכה. באיזה זמן כותבים פעולה קצרה שקרתה בבת אחת בעבר?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'They were playing cards when the train stopped.',
        wrong: ['They was playing cards when the train stopped.', 'They were play cards when the train stopped.'],
        explainHe: 'עם they משתמשים ב-were, ואחריו פועל עם ing: were playing.',
        hintHe: 'בדקו את פועל העזר שמתאים ל-they ואת צורת הפועל שאחריו.',
      },
      {
        questionEn: 'Choose the correct question:',
        correct: 'What were you doing at eight o’clock last night?',
        wrong: ['What did you doing at eight o’clock last night?', 'What you were doing at eight o’clock last night?'],
        explainHe: 'שאלה ב-Past Continuous: מילת שאלה, were, הנושא, ופועל עם ing.',
        hintHe: 'בשאלה פועל העזר בא לפני הנושא. איזה פועל עזר הולך עם פועל שמסתיים ב-ing?',
      },
      {
        questionEn: 'Complete the sentence: "The attendant ____ drinks when the plane suddenly shook."',
        correct: 'was serving',
        wrong: ['were serving', 'serves'],
        explainHe: 'the attendant הוא אדם אחד, ולכן was, והפעולה הארוכה שנקטעה ב-Past Continuous: was serving.',
        hintHe: 'the attendant הוא אדם אחד. איזה פועל עזר מתאים לו, ובאיזה זמן כותבים את הפעולה שנקטעה?',
      },
      {
        questionEn: 'Complete the sentence: "Dana ____ her keys while she was running for the bus."',
        correct: 'lost',
        wrong: ['was losing', 'loses'],
        explainHe: 'איבוד מפתחות קורה ברגע אחד, באמצע הריצה הארוכה, ולכן Past Simple: lost.',
        hintHe: 'הריצה לאוטובוס הייתה הפעולה הארוכה. האם איבוד המפתחות נמשך זמן, או קרה ברגע אחד?',
      },
    ],
    sentences: [
      {
        en: 'While we were flying over Italy, the captain made an announcement.',
        he: 'בזמן שטסנו מעל איטליה, הקברניט מסר הודעה.',
      },
      { en: 'My phone rang while I was packing my suitcase.', he: 'הטלפון שלי צלצל בזמן שארזתי את המזוודה.' },
      { en: 'Were you sleeping when the plane landed in Rome?', he: 'ישנתם כשהמטוס נחת ברומא?' },
      {
        en: 'The tourists were taking photos when the bridge suddenly closed.',
        he: 'התיירים צילמו כשהגשר נסגר פתאום.',
      },
      { en: 'She apologized because she was talking during the film.', he: 'היא התנצלה כי דיברה במהלך הסרט.' },
      { en: 'Nobody noticed the thief while the band was playing.', he: 'אף אחד לא הבחין בגנב בזמן שהלהקה ניגנה.' },
    ],
    passages: [
      {
        passageEn:
          'Last summer, Noa and her parents travelled to Iceland. On the second day, they were driving along the coast when they saw a group of whales. Her father stopped the car, and they watched the whales for almost an hour. While Noa was taking photos, her phone battery died. Luckily, her mother had a small camera in her bag, so they still have pictures of that amazing moment.',
        passageHe:
          'בקיץ שעבר נועה וההורים שלה נסעו לאיסלנד. ביום השני הם נסעו לאורך החוף כשראו להקה של לווייתנים. אבא שלה עצר את המכונית, והם צפו בלווייתנים כמעט שעה. בזמן שנועה צילמה, נגמרה הסוללה בטלפון שלה. למזלם, לאמא שלה הייתה מצלמה קטנה בתיק, ולכן עדיין יש להם תמונות של הרגע המדהים הזה.',
        questions: [
          {
            questionEn: 'What were they doing when they saw the whales?',
            questionHe: 'מה הם עשו כשראו את הלווייתנים?',
            correct: 'They were driving along the coast.',
            wrong: ['They were swimming in the sea.', 'They were eating lunch on a boat.'],
          },
          {
            questionEn: 'How long did they watch the whales?',
            questionHe: 'כמה זמן הם צפו בלווייתנים?',
            correct: 'For almost an hour.',
            wrong: ['For ten minutes.', 'For the whole day.'],
          },
          {
            questionEn: 'What happened while Noa was taking photos?',
            questionHe: 'מה קרה בזמן שנועה צילמה?',
            correct: 'Her phone battery died.',
            wrong: ['Her camera fell into the sea.', 'Her father lost the car keys.'],
          },
        ],
      },
      {
        passageEn:
          'It was a quiet night on the overnight train to Vienna. Most passengers were sleeping, but a young musician named Eitan was reading in the dining car. Suddenly, he heard a loud crash from the next carriage. He ran there and found a violin case on the floor and an open window. The violin was safe inside, and its owner, an old woman, thanked him with tears in her eyes.',
        passageHe:
          'זה היה לילה שקט ברכבת הלילה לווינה. רוב הנוסעים ישנו, אבל מוזיקאי צעיר בשם איתן קרא בקרון המסעדה. פתאום הוא שמע רעש חזק מהקרון הסמוך. הוא רץ לשם ומצא נרתיק של כינור על הרצפה וחלון פתוח. הכינור היה שלם בתוכו, והבעלים שלו, אישה זקנה, הודתה לו עם דמעות בעיניים.',
        questions: [
          {
            questionEn: 'Where was Eitan when he heard the crash?',
            questionHe: 'איפה היה איתן כששמע את הרעש?',
            correct: 'In the dining car.',
            wrong: ['In his sleeping room.', 'At the station in Vienna.'],
          },
          {
            questionEn: 'What did Eitan find on the floor?',
            questionHe: 'מה איתן מצא על הרצפה?',
            correct: 'A violin case.',
            wrong: ['A broken window.', 'A train ticket.'],
          },
          {
            questionEn: 'What did the violin’s owner do?',
            questionHe: 'מה עשתה בעלת הכינור?',
            correct: 'She thanked Eitan.',
            wrong: ['She called the police.', 'She closed the window.'],
          },
        ],
      },
    ],
  },

  // Unit 2: Past Simple questions, be going to for plans, must / can't for deduction
  2: {
    vocabulary: [
      {
        clozeEn: 'The police officer asked the ____ to describe the car she saw.',
        clozeHe: 'השוטר ביקש מהעדה לתאר את המכונית שהיא ראתה.',
        answer: 'witness',
        wrong: ['decision', 'clue'],
      },
      {
        clozeEn: 'A torn ticket was the only ____ the detective found in the room.',
        clozeHe: 'כרטיס קרוע היה הרמז היחיד שהבלש מצא בחדר.',
        answer: 'clue',
        wrong: ['witness', 'intention'],
      },
      {
        clozeEn: 'Choosing a new school was a hard ____ for my family.',
        clozeHe: 'בחירת בית ספר חדש הייתה החלטה קשה למשפחה שלי.',
        answer: 'decision',
        wrong: ['witness', 'evidence'],
      },
      {
        clozeEn: 'The boys ____ planned a surprise party, so their mom knew nothing.',
        clozeHe: 'הבנים תכננו בסתר מסיבת הפתעה, כך שאמא שלהם לא ידעה דבר.',
        answer: 'secretly',
        wrong: ['guilty', 'direction'],
      },
      {
        clozeEn: 'The judge said that the young man was ____ and let him go home.',
        clozeHe: 'השופטת אמרה שהצעיר חף מפשע ונתנה לו ללכת הביתה.',
        answer: 'innocent',
        wrong: ['guilty', 'secretly'],
      },
      {
        clozeEn: 'After a long talk, we came to the ____ that the map was wrong.',
        clozeHe: 'אחרי שיחה ארוכה הגענו למסקנה שהמפה שגויה.',
        answer: 'conclusion',
        wrong: ['witness', 'direction'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the question: "____ you see anyone near the gate last night?"',
        correct: 'Did',
        wrong: ['Do', 'Were'],
        explainHe: 'last night מראה עבר, ושאלה בעבר עם פועל רגיל מתחילה ב-Did, ואחריה פועל בסיסי: Did you see?',
        hintHe: 'last night מראה מתי זה קרה, ו-see בא כאן בצורת בסיס. איזו מילת שאלה מתאימה?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'The detective didn’t find the missing key.',
        wrong: ['The detective didn’t found the missing key.', 'The detective not found the missing key.'],
        explainHe: 'אחרי didn’t הפועל בא בצורת הבסיס: didn’t find.',
        hintHe: 'בשלילה בעבר כבר יש מילה שמסמנת עבר. באיזו צורה בא הפועל שאחריה?',
      },
      {
        questionEn:
          'Complete the sentence: "We bought the train tickets yesterday. We ____ visit the old castle on Monday."',
        correct: 'are going to',
        wrong: ['going to', 'are go to'],
        explainHe: 'תוכנית שכבר הוחלט עליה (קנינו כרטיסים) כותבים עם be going to, ועם we בא are.',
        hintHe: 'התוכנית כבר סגורה. מה צריך לבוא לפני going to כדי שהמבנה יהיה שלם?',
      },
      {
        questionEn: 'Complete the sentence: "Her coat is wet. It ____ be raining outside."',
        correct: 'must',
        wrong: ['can’t', 'shouldn’t'],
        explainHe: 'המעיל הרטוב הוא ראיה חזקה, ולכן must: אנחנו כמעט בטוחים שיורד גשם.',
        hintHe: 'המעיל הרטוב הוא ראיה. האם המשפט מביע ביטחון שזה נכון, או ביטחון שזה לא נכון?',
      },
      {
        questionEn: 'Choose the correct question:',
        correct: 'Where did the witness see the thief?',
        wrong: ['Where did the witness saw the thief?', 'Where the witness did see the thief?'],
        explainHe: 'שאלה בעבר: מילת שאלה, did, הנושא ופועל בסיסי: Where did the witness see...?',
        hintHe: 'בדקו שני דברים: איפה עומד did, ובאיזו צורה בא הפועל שאחריו.',
      },
      {
        questionEn: 'Complete the sentence: "The lights are off and nobody answers the door. They ____ be at home."',
        correct: 'can’t',
        wrong: ['must', 'will'],
        explainHe: 'כל הסימנים מראים שאין שם אף אחד, ולכן can’t be: זה בלתי אפשרי שהם בבית.',
        hintHe: 'האורות כבויים ואף אחד לא עונה. האם אנחנו בטוחים שהם בבית, או בטוחים שלא?',
      },
    ],
    sentences: [
      { en: 'Did the guard lock the back door last night?', he: 'השומר נעל את הדלת האחורית אתמול בלילה?' },
      { en: 'We are going to investigate the noise in the attic.', he: 'אנחנו הולכים לחקור את הרעש בעליית הגג.' },
      { en: 'The footprints must belong to someone with big boots.', he: 'העקבות בטח שייכות למישהו עם מגפיים גדולים.' },
      { en: 'The witness didn’t remember the color of the car.', he: 'העד לא זכר את צבע המכונית.' },
      { en: 'Why did you leave the museum so early?', he: 'למה יצאתם מהמוזיאון כל כך מוקדם?' },
      {
        en: 'The detective is going to examine the letter tomorrow morning.',
        he: 'הבלשית הולכת לבחון את המכתב מחר בבוקר.',
      },
    ],
    passages: [
      {
        passageEn:
          'On Sunday morning, the class hamster was missing from its cage. Our teacher asked us to investigate. Yael found a trail of sunflower seeds on the floor, and it led to the music room. Behind the piano, we found the hamster asleep in a box of old songbooks. The cage door was broken, so nobody took the hamster. It escaped by itself!',
        passageHe:
          'ביום ראשון בבוקר האוגר של הכיתה נעלם מהכלוב שלו. המורה שלנו ביקשה מאיתנו לחקור. יעל מצאה שובל של גרעיני חמנייה על הרצפה, והוא הוביל לחדר המוזיקה. מאחורי הפסנתר מצאנו את האוגר ישן בקופסה של ספרי שירים ישנים. דלת הכלוב הייתה שבורה, כך שאף אחד לא לקח את האוגר. הוא ברח לבד!',
        questions: [
          {
            questionEn: 'What did Yael find on the floor?',
            questionHe: 'מה יעל מצאה על הרצפה?',
            correct: 'A trail of sunflower seeds.',
            wrong: ['A broken key.', 'A box of songbooks.'],
          },
          {
            questionEn: 'Where was the hamster?',
            questionHe: 'איפה היה האוגר?',
            correct: 'Asleep behind the piano.',
            wrong: ['Under the teacher’s desk.', 'Inside the broken cage.'],
          },
          {
            questionEn: 'How did the hamster leave its cage?',
            questionHe: 'איך האוגר יצא מהכלוב?',
            correct: 'It escaped by itself.',
            wrong: ['A student took it home.', 'The teacher let it out.'],
          },
        ],
      },
      {
        passageEn:
          'Every year, the town library holds a mystery night for teenagers. This year, the librarian hid a golden book somewhere in the building and left five clues. Omer and his team followed the clues from the history shelves to the old reading room. The last clue was a riddle about a clock. They found the golden book inside the big clock, just one minute before the end. Next year, they are going to bring a bigger team.',
        passageHe:
          'בכל שנה הספרייה העירונית מקיימת ערב תעלומות לבני נוער. השנה הספרנית החביאה ספר זהב איפשהו בבניין והשאירה חמישה רמזים. עומר והקבוצה שלו עקבו אחרי הרמזים ממדפי ההיסטוריה ועד לחדר הקריאה הישן. הרמז האחרון היה חידה על שעון. הם מצאו את ספר הזהב בתוך השעון הגדול, דקה אחת בלבד לפני הסוף. בשנה הבאה הם הולכים להביא קבוצה גדולה יותר.',
        questions: [
          {
            questionEn: 'How many clues did the librarian leave?',
            questionHe: 'כמה רמזים השאירה הספרנית?',
            correct: 'Five clues.',
            wrong: ['Two clues.', 'Ten clues.'],
          },
          {
            questionEn: 'Where was the golden book?',
            questionHe: 'איפה היה ספר הזהב?',
            correct: 'Inside the big clock.',
            wrong: ['On the history shelves.', 'Under a reading table.'],
          },
          {
            questionEn: 'What is Omer’s team going to do next year?',
            questionHe: 'מה הקבוצה של עומר הולכת לעשות בשנה הבאה?',
            correct: 'Bring a bigger team.',
            wrong: ['Write their own riddles.', 'Work at the library.'],
          },
        ],
      },
    ],
  },

  // Unit 3: Present Perfect (ever, never, already, just, yet, since, for) vs. Past Simple
  3: {
    vocabulary: [
      {
        clozeEn: 'It took us six hours to reach the ____ of the mountain.',
        clozeHe: 'לקח לנו שש שעות להגיע לפסגת ההר.',
        answer: 'summit',
        wrong: ['courage', 'record'],
      },
      {
        clozeEn: 'Lava poured down the side of the ____ for three days.',
        clozeHe: 'לבה זרמה במורד הר הגעש במשך שלושה ימים.',
        answer: 'volcano',
        wrong: ['achievement', 'dedication'],
      },
      {
        clozeEn: 'Gal has broken the school ____ for the long jump.',
        clozeHe: 'גל שבר את שיא בית הספר בקפיצה לרוחק.',
        answer: 'record',
        wrong: ['summit', 'courage'],
      },
      {
        clozeEn: 'Thirty students have signed up to ____ in the science quiz.',
        clozeHe: 'שלושים תלמידים נרשמו להשתתף בחידון המדע.',
        answer: 'participate',
        wrong: ['spectacular', 'volcano'],
      },
      {
        clozeEn: 'It takes real ____ to speak in front of the whole school.',
        clozeHe: 'צריך אומץ אמיתי כדי לדבר מול כל בית הספר.',
        answer: 'courage',
        wrong: ['summit', 'volcano'],
      },
      {
        clozeEn: 'The view of the sunrise from the boat was ____.',
        clozeHe: 'הנוף של הזריחה מהסירה היה מרהיב.',
        answer: 'spectacular',
        wrong: ['compete', 'expedition'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the question: "Have you ever ____ a snake?"',
        correct: 'touched',
        wrong: ['touch', 'touching'],
        explainHe: 'אחרי have בא V3. בפועל סדיר V3 נגמר ב-ed: Have you ever touched...?',
        hintHe: 'בשאלה עם have ו-ever הפועל בא בצורה השלישית. איך נראית הצורה הזאת בפועל סדיר?',
      },
      {
        questionEn: 'Complete the sentence: "My uncle has lived in Canada ____ ten years."',
        correct: 'for',
        wrong: ['since', 'ago'],
        explainHe: 'ten years הוא משך זמן, ולכן for. since בא לפני נקודת התחלה, כמו since 2015.',
        hintHe: 'האם ten years היא נקודת התחלה בזמן, או משך של זמן?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'Eden has already fed the dog.',
        wrong: ['Eden has already feed the dog.', 'Eden already has feeding the dog.'],
        explainHe: 'Present Perfect: has + V3, ו-already בא בין has לבין הפועל: has already fed (feed הוא פועל לא סדיר).',
        hintHe: 'בדקו את צורת הפועל שבאה אחרי has, וזכרו שהפועל הזה לא סדיר.',
      },
      {
        questionEn: 'Complete the sentence: "We ____ the museum last Friday."',
        correct: 'visited',
        wrong: ['have visited', 'have visit'],
        explainHe: 'last Friday הוא זמן מוגדר בעבר, ולכן Past Simple ולא Present Perfect.',
        hintHe: 'last Friday אומר בדיוק מתי זה קרה. האם עם זמן מוגדר בעבר משתמשים ב-have?',
      },
      {
        questionEn: 'Complete the sentence: "Hurry! The race has ____ started."',
        correct: 'just',
        wrong: ['yet', 'ago'],
        explainHe: 'just אומר שזה קרה ממש עכשיו, והוא בא בין has לבין V3: has just started.',
        hintHe: 'המילה Hurry! מראה שזה קרה לפני רגע. איזו מילה מתארת "ממש עכשיו", ואיזו באה רק בסוף שאלות ושלילות?',
      },
      {
        questionEn: 'Choose the correct question:',
        correct: 'Has your sister ever won a medal?',
        wrong: ['Has your sister ever win a medal?', 'Have your sister ever won a medal?'],
        explainHe: 'your sister היא she, ולכן Has, ואחריו V3: won.',
        hintHe: 'your sister היא אדם אחד. איזה פועל עזר מתאים לה, ובאיזו צורה בא הפועל?',
      },
    ],
    sentences: [
      { en: 'Have you ever seen a shooting star?', he: 'ראיתם פעם כוכב נופל?' },
      { en: 'Our team has won three games since January.', he: 'הקבוצה שלנו ניצחה בשלושה משחקים מאז ינואר.' },
      { en: 'I have never tasted such spicy soup.', he: 'אף פעם לא טעמתי מרק חריף כל כך.' },
      { en: 'She hasn’t finished her science project yet.', he: 'היא עוד לא סיימה את פרויקט המדע שלה.' },
      { en: 'My grandparents have known each other for fifty years.', he: 'סבא וסבתא שלי מכירים זה את זה כבר חמישים שנה.' },
      {
        en: 'We climbed the mountain last year and loved the adventure.',
        he: 'טיפסנו על ההר בשנה שעברה ואהבנו את ההרפתקה.',
      },
    ],
    passages: [
      {
        passageEn:
          'Roni is fifteen, and she has already run four marathons. She started running when she was nine, after she watched a race on television. Since then, she has trained almost every morning before school. Last spring, she broke the national record for her age group. Roni has never stopped dreaming, and she hopes to run in the Olympic Games one day.',
        passageHe:
          'רוני בת חמש עשרה, והיא כבר רצה ארבעה מרתונים. היא התחילה לרוץ כשהייתה בת תשע, אחרי שצפתה במרוץ בטלוויזיה. מאז היא מתאמנת כמעט בכל בוקר לפני בית הספר. באביב שעבר היא שברה את השיא הארצי לקבוצת הגיל שלה. רוני אף פעם לא הפסיקה לחלום, והיא מקווה לרוץ באולימפיאדה יום אחד.',
        questions: [
          {
            questionEn: 'How many marathons has Roni run?',
            questionHe: 'כמה מרתונים רוני רצה?',
            correct: 'Four marathons.',
            wrong: ['Nine marathons.', 'Fifteen marathons.'],
          },
          {
            questionEn: 'What made Roni start running?',
            questionHe: 'מה גרם לרוני להתחיל לרוץ?',
            correct: 'She watched a race on television.',
            wrong: ['Her coach invited her.', 'She won a school race.'],
          },
          {
            questionEn: 'What happened last spring?',
            questionHe: 'מה קרה באביב שעבר?',
            correct: 'She broke the national record.',
            wrong: ['She ran in the Olympic Games.', 'She started training at school.'],
          },
        ],
      },
      {
        passageEn:
          'Have you ever heard of the Ramon Crater in the Negev? It is the largest crater of its kind in the world, and thousands of tourists have visited it this year. Last month, a group of students from Ashkelon spent two nights there. They watched the stars through a big telescope and saw Saturn’s rings. Their teacher said it was the most remarkable trip she has ever led.',
        passageHe:
          'שמעתם פעם על מכתש רמון בנגב? זהו המכתש הגדול ביותר מסוגו בעולם, ואלפי תיירים ביקרו בו השנה. בחודש שעבר קבוצת תלמידים מאשקלון בילתה שם שני לילות. הם צפו בכוכבים דרך טלסקופ גדול וראו את הטבעות של שבתאי. המורה שלהם אמרה שזה היה הטיול הכי יוצא דופן שהיא הובילה אי פעם.',
        questions: [
          {
            questionEn: 'How long did the students stay at the crater?',
            questionHe: 'כמה זמן התלמידים שהו במכתש?',
            correct: 'Two nights.',
            wrong: ['One week.', 'A whole month.'],
          },
          {
            questionEn: 'What did the students see through the telescope?',
            questionHe: 'מה התלמידים ראו דרך הטלסקופ?',
            correct: 'Saturn’s rings.',
            wrong: ['A shooting star.', 'The lights of Ashkelon.'],
          },
          {
            questionEn: 'What did the teacher say about the trip?',
            questionHe: 'מה אמרה המורה על הטיול?',
            correct: 'It was her most remarkable trip ever.',
            wrong: ['It was too cold at night.', 'It was too long for the students.'],
          },
        ],
      },
    ],
  },

  // Unit 4: First Conditional, unless, result connectors (so, therefore)
  4: {
    vocabulary: [
      {
        clozeEn: 'The octopus is a clever ____ that can change its color.',
        clozeHe: 'התמנון הוא יצור חכם שיכול לשנות את הצבע שלו.',
        answer: 'creature',
        wrong: ['electricity', 'solution'],
      },
      {
        clozeEn: 'Smoke from the factory causes air ____ in our town.',
        clozeHe: 'עשן מהמפעל גורם לזיהום אוויר בעיר שלנו.',
        answer: 'pollution',
        wrong: ['community', 'creature'],
      },
      {
        clozeEn: 'Wind turbines ____ power for thousands of homes.',
        clozeHe: 'טורבינות רוח מייצרות חשמל לאלפי בתים.',
        answer: 'generate',
        wrong: ['recover', 'pollution'],
      },
      {
        clozeEn: 'After the fire, it took the forest ten years to ____.',
        clozeHe: 'אחרי השרפה לקח ליער עשר שנים להתאושש.',
        answer: 'recover',
        wrong: ['generate', 'renewable'],
      },
      {
        clozeEn: 'Our whole ____ came together to clean the park on Friday.',
        clozeHe: 'כל הקהילה שלנו התאספה כדי לנקות את הפארק ביום שישי.',
        answer: 'community',
        wrong: ['pollution', 'electricity'],
      },
      {
        clozeEn: 'Sun and wind are ____ sources of energy, because they never run out.',
        clozeHe: 'השמש והרוח הן מקורות אנרגיה מתחדשים, כי הן אף פעם לא נגמרות.',
        answer: 'renewable',
        wrong: ['creature', 'recover'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "If we recycle more paper, we ____ fewer trees."',
        correct: 'will cut',
        wrong: ['will cutting', 'cuts'],
        explainHe: 'בתנאי מסוג ראשון: if + Present Simple, ובחלק התוצאה will + פועל בסיסי.',
        hintHe: 'החלק עם if כתוב בהווה פשוט. מה בא בחלק התוצאה, ובאיזו צורה בא הפועל אחריו?',
      },
      {
        questionEn: 'Complete the sentence: "If it ____ tomorrow, the beach clean-up will move to Sunday."',
        correct: 'rains',
        wrong: ['will rain', 'rained'],
        explainHe: 'בחלק של if בתנאי מסוג ראשון לא כותבים will, ועם it הפועל מקבל s: If it rains.',
        hintHe: 'בחלק של if בתנאי מסוג ראשון יש כלל לגבי will. מה הכלל, ומה קורה לפועל עם it?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'If you leave the lights on, you will waste electricity.',
        wrong: [
          'If you will leave the lights on, you waste electricity.',
          'If you leave the lights on, you wasted electricity.',
        ],
        explainHe: 'if + הווה פשוט (leave), והתוצאה עם will + פועל בסיסי (will waste).',
        hintHe: 'בדקו באיזה חלק של המשפט נמצא will, ובאיזה זמן כתוב החלק של if.',
      },
      {
        questionEn: 'Choose the connector: "The river was full of plastic. ____, the town banned plastic bags."',
        correct: 'Therefore',
        wrong: ['However', 'Although'],
        explainHe: 'האיסור על שקיות הוא תוצאה של הזיהום, ולכן Therefore (לכן).',
        hintHe: 'האם המשפט השני מציג ניגוד למשפט הראשון, או תוצאה שלו?',
      },
      {
        questionEn: 'Complete the sentence: "Unless we ____ the trees, the birds will lose their homes."',
        correct: 'protect',
        wrong: ['don’t protect', 'will protect'],
        explainHe: 'unless פירושו "אם לא", ולכן אחריו בא פועל חיובי בהווה: Unless we protect.',
        hintHe: 'unless כבר כולל בתוכו "לא". האם צריך עוד שלילה, ואיזה זמן בא אחריו?',
      },
      {
        questionEn: 'Complete the sentence: "The old buses used a lot of fuel, ____ the city bought electric ones."',
        correct: 'so',
        wrong: ['but', 'because'],
        explainHe: 'קניית האוטובוסים החשמליים היא תוצאה, ולכן so (ולכן).',
        hintHe: 'מה הקשר בין שני חלקי המשפט: סיבה, ניגוד או תוצאה?',
      },
    ],
    sentences: [
      { en: 'If we plant more trees, the city will be cooler.', he: 'אם נשתול עוד עצים, העיר תהיה קרירה יותר.' },
      { en: 'Solar panels on the roof will save us money.', he: 'לוחות סולאריים על הגג יחסכו לנו כסף.' },
      { en: 'If you turn off the tap, you will save water.', he: 'אם תסגרו את הברז, תחסכו מים.' },
      { en: 'The beach was dirty, so we organized a clean-up day.', he: 'החוף היה מלוכלך, אז ארגנו יום ניקיון.' },
      {
        en: 'Many sea creatures will disappear if the water gets warmer.',
        he: 'הרבה יצורי ים ייעלמו אם המים יתחממו.',
      },
      { en: 'Our school uses rainwater to water the garden.', he: 'בית הספר שלנו משתמש במי גשם כדי להשקות את הגינה.' },
    ],
    passages: [
      {
        passageEn:
          'Kibbutz Ketura in the Arava desert gets a lot of sunshine all year. In 2011, the kibbutz built one of the first solar fields in Israel. Today, the solar field generates enough electricity for thousands of homes. Visitors come from many countries to learn how the system works. If more communities follow this example, the country will need much less oil and coal.',
        passageHe:
          'קיבוץ קטורה שבערבה מקבל הרבה שמש כל השנה. ב-2011 הקיבוץ הקים את אחד השדות הסולאריים הראשונים בישראל. היום השדה הסולארי מייצר מספיק חשמל לאלפי בתים. מבקרים מגיעים ממדינות רבות כדי ללמוד איך המערכת עובדת. אם יותר קהילות ילכו בדרך הזאת, המדינה תצטרך הרבה פחות נפט ופחם.',
        questions: [
          {
            questionEn: 'Where is Kibbutz Ketura?',
            questionHe: 'איפה נמצא קיבוץ קטורה?',
            correct: 'In the Arava desert.',
            wrong: ['Near the Sea of Galilee.', 'In the north of Israel.'],
          },
          {
            questionEn: 'What does the solar field produce?',
            questionHe: 'מה השדה הסולארי מייצר?',
            correct: 'Enough electricity for thousands of homes.',
            wrong: ['Clean water for the desert.', 'Food for the kibbutz.'],
          },
          {
            questionEn: 'What will happen if more communities follow this example?',
            questionHe: 'מה יקרה אם יותר קהילות ילכו בדרך הזאת?',
            correct: 'The country will need less oil and coal.',
            wrong: ['More visitors will come.', 'The desert will get more rain.'],
          },
        ],
      },
      {
        passageEn:
          'Two years ago, a group of teenagers in Haifa noticed that the beach near their school was covered in plastic. They started a club called Clean Waves, and every Friday they collect rubbish from the sand. So far, they have collected more than two tons of plastic. The club also visits primary schools to teach younger children about pollution. If the club keeps growing, the beach will be clean for everyone next summer.',
        passageHe:
          'לפני שנתיים קבוצת בני נוער בחיפה שמה לב שהחוף ליד בית הספר שלהם מכוסה בפלסטיק. הם הקימו מועדון בשם "גלים נקיים", ובכל יום שישי הם אוספים פסולת מהחול. עד עכשיו הם אספו יותר משני טונות של פלסטיק. המועדון גם מבקר בבתי ספר יסודיים כדי ללמד ילדים צעירים יותר על זיהום. אם המועדון ימשיך לגדול, החוף יהיה נקי לכולם בקיץ הבא.',
        questions: [
          {
            questionEn: 'What did the teenagers notice two years ago?',
            questionHe: 'במה בני הנוער הבחינו לפני שנתיים?',
            correct: 'The beach was covered in plastic.',
            wrong: ['The sea was too warm.', 'Their school had no recycling bins.'],
          },
          {
            questionEn: 'When does the club collect rubbish?',
            questionHe: 'מתי המועדון אוסף פסולת?',
            correct: 'Every Friday.',
            wrong: ['Every morning.', 'Once a month.'],
          },
          {
            questionEn: 'Who does the club teach about pollution?',
            questionHe: 'את מי המועדון מלמד על זיהום?',
            correct: 'Younger children in primary schools.',
            wrong: ['Tourists on the beach.', 'Their parents at home.'],
          },
        ],
      },
    ],
  },
};
