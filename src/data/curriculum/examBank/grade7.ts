import type { ExamBankPack } from './types';

/**
 * Grade 7 exam question bank (Feature 43). New questions only: none of them appears in a grade 7
 * mission, mini-lesson, the placement test or a contest. The last 2 items of each list and the
 * second passage are for the mock exam.
 */
export const GRADE_7_EXAM_BANK: ExamBankPack = {
  // Unit 1: Present Simple, time expressions, do / does
  1: {
    vocabulary: [
      {
        clozeEn: 'My cousin ____ drinks hot chocolate before bed, but tonight she wants tea.',
        clozeHe: 'בת הדודה שלי בדרך כלל שותה שוקו חם לפני השינה, אבל הלילה היא רוצה תה.',
        answer: 'usually',
        wrong: ['delicious', 'creative'],
      },
      {
        clozeEn: 'Our art teacher loves ____ ideas, so we always try something new.',
        clozeHe: 'המורה שלנו לאמנות אוהבת רעיונות יצירתיים, אז אנחנו תמיד מנסים משהו חדש.',
        answer: 'creative',
        wrong: ['delicious', 'usually'],
      },
      {
        clozeEn: 'Let me ____ my new classmate, Daniel. He comes from Haifa.',
        clozeHe: 'הרשו לי להציג את חבר הכיתה החדש שלי, דניאל. הוא מחיפה.',
        answer: 'introduce',
        wrong: ['achieve', 'prefer'],
      },
      {
        clozeEn: 'Do you ____ pizza or pasta for lunch?',
        clozeHe: 'אתם מעדיפים פיצה או פסטה לארוחת הצהריים?',
        answer: 'prefer',
        wrong: ['inspire', 'introduce'],
      },
      {
        clozeEn: 'The waiter can ____ the best dessert on the menu.',
        clozeHe: 'המלצר יכול להמליץ על הקינוח הכי טוב בתפריט.',
        answer: 'recommend',
        wrong: ['achieve', 'inspire'],
      },
      {
        clozeEn: 'The ____ claps loudly at the end of every show.',
        clozeHe: 'הקהל מוחא כפיים בקול בסוף כל הופעה.',
        answer: 'audience',
        wrong: ['schedule', 'achieve'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "My brother ____ football every Tuesday."',
        correct: 'plays',
        wrong: ['play', 'is play'],
        explainHe: 'ב-Present Simple עם he / she / it מוסיפים s לפועל: My brother plays.',
        hintHe: 'My brother הוא he, ו-every Tuesday מראה הרגל. מה קורה לפועל עם he?',
      },
      {
        questionEn: 'Complete the question: "____ your parents work on Fridays?"',
        correct: 'Do',
        wrong: ['Does', 'Are'],
        explainHe: 'עם I / you / we / they (וגם your parents) שואלים ב-Present Simple עם Do.',
        hintHe: 'your parents הם they. איזו מילת שאלה מתאימה ל-they ב-Present Simple?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'Ella doesn’t eat meat.',
        wrong: ['Ella don’t eat meat.', 'Ella doesn’t eats meat.'],
        explainHe: 'עם she משתמשים ב-doesn’t, והפועל שאחריו בא בלי s: doesn’t eat.',
        hintHe: 'בדקו שני דברים: איזו מילת שלילה מתאימה ל-she, ומה קורה לפועל שאחריה.',
      },
      {
        questionEn: 'Complete the sentence: "We ____ go to the beach in winter. It is too cold."',
        correct: 'never',
        wrong: ['always', 'usually'],
        explainHe: 'too cold (קר מדי) אומר שזה לא קורה אף פעם, ולכן never.',
        hintHe: 'קראו גם את המשפט השני: האם הולכים לים כשקר מדי?',
      },
      {
        questionEn: 'Complete the question: "What time ____ the library open?"',
        correct: 'does',
        wrong: ['do', 'is'],
        explainHe: 'the library היא it, ועם it שואלים עם does ואחריו פועל בסיסי.',
        hintHe: 'the library היא it. איזו מילת שאלה מתאימה ל-it ב-Present Simple?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'Tom watches a movie every Saturday.',
        wrong: ['Tom watch a movie every Saturday.', 'Tom watchs a movie every Saturday.'],
        explainHe: 'פועל שנגמר ב-ch מקבל es עם he / she / it: watches.',
        hintHe: 'Tom הוא he. בדקו איך כותבים עם he פועל שנגמר באותיות ch.',
      },
    ],
    sentences: [
      { en: 'My sister reads comic books every evening.', he: 'אחותי קוראת חוברות קומיקס בכל ערב.' },
      { en: 'Do you walk to school in the morning?', he: 'אתם הולכים ברגל לבית הספר בבוקר?' },
      { en: 'Our team practices basketball twice a week.', he: 'הקבוצה שלנו מתאמנת בכדורסל פעמיים בשבוע.' },
      { en: 'Dad doesn’t drink coffee after lunch.', he: 'אבא לא שותה קפה אחרי ארוחת הצהריים.' },
      { en: 'Does the bus stop near your house?', he: 'האוטובוס עוצר ליד הבית שלכם?' },
      { en: 'The baker opens the shop at six every morning.', he: 'האופה פותח את החנות בשש בכל בוקר.' },
    ],
    passages: [
      {
        passageEn:
          'Lior is thirteen and lives in Tel Aviv. Every morning, he rides his bike to school with his neighbor Adam. After school, Lior usually helps at his uncle’s falafel stand. He doesn’t work on Fridays, because his family visits his grandmother in Jerusalem. Lior wants to open his own café one day.',
        passageHe:
          'ליאור בן שלוש עשרה וגר בתל אביב. בכל בוקר הוא רוכב על האופניים לבית הספר עם השכן שלו, אדם. אחרי הלימודים ליאור בדרך כלל עוזר בדוכן הפלאפל של הדוד שלו. הוא לא עובד בימי שישי, כי המשפחה שלו מבקרת את סבתא שלו בירושלים. ליאור רוצה לפתוח בית קפה משלו יום אחד.',
        questions: [
          {
            questionEn: 'How does Lior get to school?',
            questionHe: 'איך ליאור מגיע לבית הספר?',
            correct: 'He rides his bike.',
            wrong: ['He takes the bus.', 'He walks with his uncle.'],
          },
          {
            questionEn: 'Where does Lior usually go after school?',
            questionHe: 'לאן ליאור הולך בדרך כלל אחרי הלימודים?',
            correct: 'To his uncle’s falafel stand.',
            wrong: ['To his grandmother in Jerusalem.', 'To Adam’s house.'],
          },
          {
            questionEn: 'Why doesn’t Lior work on Fridays?',
            questionHe: 'למה ליאור לא עובד בימי שישי?',
            correct: 'His family visits his grandmother.',
            wrong: ['He has a basketball game.', 'The falafel stand is closed.'],
          },
        ],
      },
      {
        passageEn:
          'Every summer, the town of Eilat has a music festival on the beach. Bands from many countries play there for three nights. Shira, a student from Beersheba, sells homemade lemonade at the festival. She starts at five in the evening and finishes at midnight. The audience loves her mint lemonade, and she often sells all of it before ten o’clock.',
        passageHe:
          'בכל קיץ מתקיים באילת פסטיבל מוזיקה על החוף. להקות מארצות רבות מנגנות שם במשך שלושה לילות. שירה, תלמידה מבאר שבע, מוכרת בפסטיבל לימונדה ביתית. היא מתחילה בחמש בערב ומסיימת בחצות. הקהל אוהב את הלימונדה עם הנענע שלה, ולעיתים קרובות היא מוכרת את כולה לפני עשר.',
        questions: [
          {
            questionEn: 'How long does the festival last?',
            questionHe: 'כמה זמן נמשך הפסטיבל?',
            correct: 'Three nights.',
            wrong: ['One week.', 'Two days.'],
          },
          {
            questionEn: 'What does Shira sell at the festival?',
            questionHe: 'מה שירה מוכרת בפסטיבל?',
            correct: 'Homemade lemonade.',
            wrong: ['Music tickets.', 'Mint ice cream.'],
          },
          {
            questionEn: 'What often happens before ten o’clock?',
            questionHe: 'מה קורה לעיתים קרובות לפני עשר?',
            correct: 'Shira sells all of her lemonade.',
            wrong: ['The bands start to play.', 'Shira goes home to Beersheba.'],
          },
        ],
      },
    ],
  },

  // Unit 2: Present Progressive vs. Present Simple, stative verbs
  2: {
    vocabulary: [
      {
        clozeEn: 'We ____ the piano for an hour every day.',
        clozeHe: 'אנחנו מתאמנים בפסנתר שעה בכל יום.',
        answer: 'practice',
        wrong: ['belong', 'believe'],
      },
      {
        clozeEn: 'I always feel ____ before a big test, so I take a deep breath.',
        clozeHe: 'אני תמיד מרגיש לחוץ לפני מבחן גדול, אז אני לוקח נשימה עמוקה.',
        answer: 'nervous',
        wrong: ['currently', 'celebrate'],
      },
      {
        clozeEn: 'This blue jacket doesn’t ____ to me. It is my brother’s.',
        clozeHe: 'המעיל הכחול הזה לא שייך לי. הוא של אחי.',
        answer: 'belong',
        wrong: ['believe', 'perform'],
      },
      {
        clozeEn: 'The ____ at the party is warm and happy, and everyone is dancing.',
        clozeHe: 'האווירה במסיבה חמה ושמחה, וכולם רוקדים.',
        answer: 'atmosphere',
        wrong: ['excited', 'currently'],
      },
      {
        clozeEn: 'Tonight our class will ____ the end of the school year with a picnic.',
        clozeHe: 'הערב הכיתה שלנו תחגוג את סוף שנת הלימודים בפיקניק.',
        answer: 'celebrate',
        wrong: ['belong', 'nervous'],
      },
      {
        clozeEn: 'The kids are so ____ about the trip that they can’t sleep.',
        clozeHe: 'הילדים כל כך נרגשים לקראת הטיול שהם לא מצליחים להירדם.',
        answer: 'excited',
        wrong: ['currently', 'perform'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "Listen! The baby ____ in the next room."',
        correct: 'is crying',
        wrong: ['cries', 'cry'],
        explainHe: 'Listen! מראה שזה קורה עכשיו, ולכן Present Progressive: is crying.',
        hintHe: 'המילה Listen! אומרת שמשהו קורה ברגע זה. איזה זמן מתאים לפעולה שקורה עכשיו?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I know the answer to this riddle.',
        wrong: ['I am knowing the answer to this riddle.', 'I knowing the answer to this riddle.'],
        explainHe: 'know הוא פועל מצב (stative), ולכן לא מוסיפים לו ing גם כשמדובר בעכשיו.',
        hintHe: 'פעלים של ידיעה ומחשבה, כמו understand או believe, מתנהגים אחרת. האם מוסיפים להם ing?',
      },
      {
        questionEn: 'Complete the sentence: "My dad ____ the dishes every evening, but tonight I am doing them."',
        correct: 'washes',
        wrong: ['is washing', 'wash'],
        explainHe: 'every evening מראה הרגל, ולכן Present Simple: My dad washes.',
        hintHe: 'יש במשפט שני חלקים: מה קורה בדרך כלל ומה קורה הלילה. לאיזה חלק שייך החסר?',
      },
      {
        questionEn: 'Choose the correct question:',
        correct: 'What are you drawing right now?',
        wrong: ['What do you drawing right now?', 'What you are drawing right now?'],
        explainHe: 'שאלה ב-Present Progressive: מילת שאלה, אחריה are, אחריו you, ובסוף פועל עם ing.',
        hintHe: 'ב-Present Progressive הפועל עם ing צריך פועל עזר (am / is / are). איפה פועל העזר עומד בשאלה?',
      },
      {
        questionEn: 'Complete the sentence: "This soup ____ amazing! Can I have more?"',
        correct: 'tastes',
        wrong: ['is tasting', 'taste'],
        explainHe: 'כאן taste מתאר תחושה (פועל מצב), ולכן Present Simple: This soup tastes amazing.',
        hintHe: 'This soup הוא it. האם הפועל כאן מתאר פעולה או תחושה?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'They are playing chess at the moment.',
        wrong: ['They play chess at the moment.', 'They is playing chess at the moment.'],
        explainHe: 'at the moment פירושו "כרגע", ולכן Present Progressive, ועם they משתמשים ב-are.',
        hintHe: 'at the moment פירושו "כרגע". איזה זמן מתאים, ואיזה פועל עזר מתאים ל-they?',
      },
    ],
    sentences: [
      { en: 'Right now my grandmother is baking a chocolate cake.', he: 'ממש עכשיו סבתא שלי אופה עוגת שוקולד.' },
      { en: 'We believe your story about the lost puppy.', he: 'אנחנו מאמינים לסיפור שלך על הגור האבוד.' },
      { en: 'The children are swimming in the pool this afternoon.', he: 'הילדים שוחים בבריכה אחר הצהריים.' },
      { en: 'Does this red backpack belong to you?', he: 'התיק האדום הזה שייך לך?' },
      { en: 'Our neighbors are painting their fence today.', he: 'השכנים שלנו צובעים את הגדר שלהם היום.' },
      {
        en: 'She usually wears glasses, but today she is wearing contact lenses.',
        he: 'בדרך כלל היא מרכיבה משקפיים, אבל היום היא מרכיבה עדשות מגע.',
      },
    ],
    passages: [
      {
        passageEn:
          'It is Saturday afternoon, and the Levi family is at the park. Dad is lighting the grill, and Mom is reading a book under a tree. Their twins, Gal and Ori, are flying a red kite. Usually the twins play football on Saturdays, but today the wind is perfect for kites. Ori doesn’t like the smell of smoke, so he is standing far from the grill.',
        passageHe:
          'זה שבת אחר הצהריים, ומשפחת לוי נמצאת בפארק. אבא מדליק את המנגל, ואמא קוראת ספר מתחת לעץ. התאומים שלהם, גל ועורי, מעיפים עפיפון אדום. בדרך כלל התאומים משחקים כדורגל בשבת, אבל היום הרוח מושלמת לעפיפונים. עורי לא אוהב את ריח העשן, ולכן הוא עומד רחוק מהמנגל.',
        questions: [
          {
            questionEn: 'What is Mom doing?',
            questionHe: 'מה אמא עושה?',
            correct: 'She is reading a book.',
            wrong: ['She is lighting the grill.', 'She is flying a kite.'],
          },
          {
            questionEn: 'What do the twins usually do on Saturdays?',
            questionHe: 'מה התאומים עושים בדרך כלל בשבת?',
            correct: 'They play football.',
            wrong: ['They fly a kite.', 'They read books.'],
          },
          {
            questionEn: 'Why is Ori standing far from the grill?',
            questionHe: 'למה עורי עומד רחוק מהמנגל?',
            correct: 'He doesn’t like the smell of smoke.',
            wrong: ['He is afraid of the fire.', 'He wants to play football.'],
          },
        ],
      },
      {
        passageEn:
          'Maya is a volunteer at an animal shelter in Haifa. She goes there every Tuesday after school. This week is different, because the shelter is preparing for a big adoption day. Right now Maya is washing three small puppies, and her friend Yoni is taking photos of them. Maya believes that every animal deserves a loving home.',
        passageHe:
          'מאיה מתנדבת במקלט לבעלי חיים בחיפה. היא הולכת לשם בכל יום שלישי אחרי הלימודים. השבוע שונה, כי המקלט מתכונן ליום אימוץ גדול. ממש עכשיו מאיה רוחצת שלושה גורים קטנים, והחבר שלה יוני מצלם אותם. מאיה מאמינה שלכל בעל חיים מגיע בית אוהב.',
        questions: [
          {
            questionEn: 'When does Maya usually go to the shelter?',
            questionHe: 'מתי מאיה הולכת בדרך כלל למקלט?',
            correct: 'Every Tuesday after school.',
            wrong: ['Every Friday morning.', 'Only on adoption day.'],
          },
          {
            questionEn: 'What is Yoni doing right now?',
            questionHe: 'מה יוני עושה עכשיו?',
            correct: 'He is taking photos of the puppies.',
            wrong: ['He is washing the puppies.', 'He is feeding the cats.'],
          },
          {
            questionEn: 'What does Maya believe?',
            questionHe: 'במה מאיה מאמינה?',
            correct: 'Every animal deserves a loving home.',
            wrong: ['Puppies are easy to wash.', 'The shelter needs more volunteers.'],
          },
        ],
      },
    ],
  },

  // Unit 3: Past Simple (regular and irregular), did / didn't
  3: {
    vocabulary: [
      {
        clozeEn: 'The scientists hope to ____ a new kind of fish in the deep sea.',
        clozeHe: 'המדענים מקווים לגלות סוג חדש של דג בים העמוק.',
        answer: 'discover',
        wrong: ['whisper', 'solve'],
      },
      {
        clozeEn: 'We were reading quietly when ____ the lights went out.',
        clozeHe: 'קראנו בשקט, ופתאום האורות כבו.',
        answer: 'suddenly',
        wrong: ['ancient', 'curious'],
      },
      {
        clozeEn: 'Please ____ in the library so you don’t disturb other readers.',
        clozeHe: 'בבקשה ללחוש בספרייה כדי לא להפריע לקוראים אחרים.',
        answer: 'whisper',
        wrong: ['disappear', 'notice'],
      },
      {
        clozeEn: 'The detective found important ____ under the window: muddy footprints.',
        clozeHe: 'הבלש מצא ראיה חשובה מתחת לחלון: עקבות של בוץ.',
        answer: 'evidence',
        wrong: ['ancient', 'suddenly'],
      },
      {
        clozeEn: 'My little brother is very ____ and asks a hundred questions a day.',
        clozeHe: 'אחי הקטן סקרן מאוד ושואל מאה שאלות ביום.',
        answer: 'curious',
        wrong: ['ancient', 'evidence'],
      },
      {
        clozeEn: 'Can you help me ____ this math puzzle? I am stuck.',
        clozeHe: 'אפשר לעזור לי לפתור את חידת החשבון הזאת? נתקעתי.',
        answer: 'solve',
        wrong: ['disappear', 'whisper'],
      },
    ],
    grammar: [
      {
        questionEn: 'What is the Past Simple of "buy"?',
        correct: 'bought',
        wrong: ['buyed', 'brought'],
        explainHe: 'buy הוא פועל לא סדיר: buy → bought (ולא buyed). brought הוא העבר של bring.',
        hintHe: 'buy הוא פועל לא סדיר, ולכן לא מוסיפים לו ed. כדאי לא לבלבל אותו עם פועל שנשמע דומה.',
      },
      {
        questionEn: 'Complete the sentence: "Last night we ____ a scary movie."',
        correct: 'watched',
        wrong: ['watch', 'are watching'],
        explainHe: 'Last night מראה עבר, ולכן מוסיפים ed לפועל הסדיר: watched.',
        hintHe: 'Last night מראה מתי זה קרה. איזה זמן מתאים לפעולה שנגמרה בעבר?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'She didn’t call me yesterday.',
        wrong: ['She didn’t called me yesterday.', 'She don’t call me yesterday.'],
        explainHe: 'אחרי didn’t הפועל חוזר לצורת הבסיס: didn’t call.',
        hintHe: 'במשפט שלילה בעבר כבר יש מילה שמראה עבר. האם צריך לסמן עבר גם בפועל?',
      },
      {
        questionEn: 'Choose the correct question:',
        correct: 'Did you finish your homework?',
        wrong: ['Did you finished your homework?', 'Do you finished your homework?'],
        explainHe: 'שאלה בעבר: Did, אחריו הנושא, ואחריו פועל בסיסי: Did you finish?',
        hintHe: 'Did כבר מראה שזה עבר. באיזו צורה בא הפועל שאחריו?',
      },
      {
        questionEn: 'What is the Past Simple of "write"?',
        correct: 'wrote',
        wrong: ['writed', 'written'],
        explainHe: 'write הוא פועל לא סדיר: write → wrote. written היא צורת V3.',
        hintHe: 'write הוא פועל לא סדיר. זכרו: ל-V2 ול-V3 שלו יש צורות שונות.',
      },
      {
        questionEn: 'Complete the sentence: "Two years ago my family ____ to Ashdod."',
        correct: 'moved',
        wrong: ['moves', 'is moving'],
        explainHe: 'ago מראה עבר, ולכן moved (פועל סדיר שמקבל d).',
        hintHe: 'המילה ago אומרת שזה קרה לפני זמן מה. איזה זמן מתאים?',
      },
    ],
    sentences: [
      { en: 'We visited our grandparents last weekend.', he: 'ביקרנו אצל סבא וסבתא בסוף השבוע שעבר.' },
      { en: 'Did you hear the thunder last night?', he: 'שמעתם את הרעם אתמול בלילה?' },
      { en: 'The museum guard didn’t see the thief.', he: 'שומר המוזיאון לא ראה את הגנב.' },
      { en: 'I lost my keys and found them in the fridge.', he: 'איבדתי את המפתחות ומצאתי אותם במקרר.' },
      { en: 'Where did they hide the treasure map?', he: 'איפה הם החביאו את מפת האוצר?' },
      { en: 'The old castle disappeared behind the thick fog.', he: 'הטירה העתיקה נעלמה מאחורי הערפל הכבד.' },
    ],
    passages: [
      {
        passageEn:
          'Last winter, Tamar’s class went on a trip to an old fortress near the Dead Sea. Their guide told them stories about people who lived there two thousand years ago. Tamar noticed a strange symbol on one of the walls, and she took a picture of it. At home, she searched online and discovered that the symbol was an ancient fish. Her teacher was very impressed.',
        passageHe:
          'בחורף שעבר הכיתה של תמר יצאה לטיול למבצר עתיק ליד ים המלח. המדריך סיפר להם סיפורים על אנשים שחיו שם לפני אלפיים שנה. תמר הבחינה בסמל מוזר על אחד הקירות, והיא צילמה אותו. בבית היא חיפשה ברשת וגילתה שהסמל הוא דג עתיק. המורה שלה התרשמה מאוד.',
        questions: [
          {
            questionEn: 'Where did the class go?',
            questionHe: 'לאן הכיתה נסעה?',
            correct: 'To an old fortress near the Dead Sea.',
            wrong: ['To a museum in Jerusalem.', 'To a beach in Eilat.'],
          },
          {
            questionEn: 'What did Tamar notice?',
            questionHe: 'במה תמר הבחינה?',
            correct: 'A strange symbol on a wall.',
            wrong: ['A fish in the sea.', 'A broken camera.'],
          },
          {
            questionEn: 'How did Tamar find out what the symbol was?',
            questionHe: 'איך תמר גילתה מה הסמל?',
            correct: 'She searched online at home.',
            wrong: ['Her guide told her.', 'She asked her teacher.'],
          },
        ],
      },
      {
        passageEn:
          'On Monday morning, the baker Uri opened his bakery and found an empty shelf. Someone took all the fresh rolls during the night! He called his friend Dana, who loves mysteries. Dana didn’t find any footprints, but she noticed crumbs near a small hole in the wall. The thief wasn’t a person at all. It was a hungry family of mice.',
        passageHe:
          'ביום שני בבוקר האופה אורי פתח את המאפייה שלו ומצא מדף ריק. מישהו לקח בלילה את כל הלחמניות הטריות! הוא התקשר לחברה שלו דנה, שאוהבת תעלומות. דנה לא מצאה עקבות, אבל היא הבחינה בפירורים ליד חור קטן בקיר. הגנב בכלל לא היה אדם. זו הייתה משפחה רעבה של עכברים.',
        questions: [
          {
            questionEn: 'What did Uri find on Monday morning?',
            questionHe: 'מה אורי מצא ביום שני בבוקר?',
            correct: 'An empty shelf.',
            wrong: ['A broken window.', 'A hungry cat.'],
          },
          {
            questionEn: 'What did Dana notice?',
            questionHe: 'במה דנה הבחינה?',
            correct: 'Crumbs near a small hole.',
            wrong: ['Footprints on the floor.', 'A note from the thief.'],
          },
          {
            questionEn: 'Who took the rolls?',
            questionHe: 'מי לקח את הלחמניות?',
            correct: 'A family of mice.',
            wrong: ['A hungry neighbor.', 'A bakery worker.'],
          },
        ],
      },
    ],
  },

  // Unit 4: will vs. be going to, modals
  4: {
    vocabulary: [
      {
        clozeEn: 'If you practice every day, you will ____ in the competition.',
        clozeHe: 'אם תתאמנו בכל יום, תצליחו בתחרות.',
        answer: 'succeed',
        wrong: ['advice', 'proud'],
      },
      {
        clozeEn: 'My aunt gave me good ____ about choosing a high school.',
        clozeHe: 'הדודה שלי נתנה לי עצה טובה על בחירת תיכון.',
        answer: 'advice',
        wrong: ['succeed', 'international'],
      },
      {
        clozeEn: 'It is ____ to wear a helmet when you ride a bike.',
        clozeHe: 'חשוב לחבוש קסדה כשרוכבים על אופניים.',
        answer: 'important',
        wrong: ['proud', 'future'],
      },
      {
        clozeEn: 'You can ____ one book from the shelf as a prize.',
        clozeHe: 'אפשר לבחור ספר אחד מהמדף בתור פרס.',
        answer: 'choose',
        wrong: ['succeed', 'challenge'],
      },
      {
        clozeEn: 'Running ten kilometers was a real ____ for me, but I did it.',
        clozeHe: 'ריצה של עשרה קילומטרים הייתה בשבילי אתגר אמיתי, אבל עשיתי את זה.',
        answer: 'challenge',
        wrong: ['important', 'succeed'],
      },
      {
        clozeEn: 'Our school has a big ____ fair with food from twenty countries.',
        clozeHe: 'בבית הספר שלנו יש יריד בינלאומי גדול עם אוכל מעשרים מדינות.',
        answer: 'international',
        wrong: ['proud', 'succeed'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "Look at those dark clouds! It ____ rain."',
        correct: 'is going to',
        wrong: ['will to', 'going to'],
        explainHe: 'כשרואים סימן ברור עכשיו (עננים שחורים), משתמשים ב-be going to: It is going to rain.',
        hintHe: 'יש כאן סימן שרואים עכשיו. איזו צורת עתיד מתאימה לתחזית לפי סימן, ומה צריך לבוא לפני going to?',
      },
      {
        questionEn: 'Complete the sentence: "The phone is ringing. Don’t worry, I ____ answer it."',
        correct: 'will',
        wrong: ['am going', 'am'],
        explainHe: 'להחלטה של הרגע משתמשים ב-will: I will answer it.',
        hintHe: 'ההחלטה לענות נולדה עכשיו, ברגע שהטלפון צלצל. איזו צורת עתיד מתאימה להחלטה של הרגע?',
      },
      {
        questionEn: 'Which modal shows that something is a rule?',
        correct: 'must',
        wrong: ['might', 'could'],
        explainHe: 'must מביע חובה או כלל: You must wear a seatbelt.',
        hintHe: 'כלל הוא משהו שאין עליו ויכוח. איזה מודל מבטא חובה ולא אפשרות?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'You should eat more vegetables.',
        wrong: ['You should to eat more vegetables.', 'You should eats more vegetables.'],
        explainHe: 'אחרי מודל בא פועל בסיסי, בלי to ובלי s: should eat.',
        hintHe: 'אחרי מודלים כמו can או should יש כלל קבוע לגבי הפועל. מה הכלל?',
      },
      {
        questionEn:
          'Complete the sentence: "We ____ visit Grandma next Sunday. We bought the train tickets yesterday."',
        correct: 'are going to',
        wrong: ['are going', 'is going to'],
        explainHe: 'כשהתוכנית כבר סגורה (קנינו כרטיסים), משתמשים ב-be going to, ועם we בא are.',
        hintHe: 'קראו את המשפט השני: התוכנית כבר סגורה. מה מתאים ל-we, ומה חסר כדי שהמבנה יהיה שלם?',
      },
      {
        questionEn: 'Complete the sentence: "When I was five, I ____ ride a bike without help."',
        correct: 'could',
        wrong: ['can', 'must'],
        explainHe: 'could הוא העבר של can: I could ride (יכולתי לרכוב).',
        hintHe: 'When I was five מראה שזה קרה בעבר. איזה מודל מבטא יכולת בעבר?',
      },
    ],
    sentences: [
      { en: 'Tomorrow I will help my dad in the garden.', he: 'מחר אעזור לאבא שלי בגינה.' },
      { en: 'They are going to build a robot for the science fair.', he: 'הם הולכים לבנות רובוט ליריד המדע.' },
      { en: 'You must turn off your phone during the test.', he: 'חובה לכבות את הטלפון במהלך המבחן.' },
      { en: 'Can you show me the way to the station?', he: 'אפשר להראות לי את הדרך לתחנה?' },
      { en: 'My sister is going to study medicine next year.', he: 'אחותי הולכת ללמוד רפואה בשנה הבאה.' },
      { en: 'We should leave early because the roads are busy.', he: 'כדאי לנו לצאת מוקדם כי הכבישים עמוסים.' },
    ],
    passages: [
      {
        passageEn:
          'Next month, Ido’s school is going to hold a science fair. Ido and his friend Lea are going to build a small solar car. Lea already drew the plans, and Ido bought the batteries yesterday. Their teacher says they should test the car outside on a sunny day. Ido thinks they will win first prize, but Lea says the most important thing is learning something new.',
        passageHe:
          'בחודש הבא בית הספר של עידו יקיים יריד מדע. עידו והחברה שלו לאה הולכים לבנות מכונית סולארית קטנה. לאה כבר שרטטה את התוכניות, ועידו קנה אתמול את הסוללות. המורה שלהם אומרת שכדאי להם לבדוק את המכונית בחוץ ביום שמשי. עידו חושב שהם יזכו בפרס הראשון, אבל לאה אומרת שהדבר הכי חשוב הוא ללמוד משהו חדש.',
        questions: [
          {
            questionEn: 'What are Ido and Lea going to build?',
            questionHe: 'מה עידו ולאה הולכים לבנות?',
            correct: 'A small solar car.',
            wrong: ['A robot dog.', 'A model of the sun.'],
          },
          {
            questionEn: 'What did Ido do yesterday?',
            questionHe: 'מה עידו עשה אתמול?',
            correct: 'He bought the batteries.',
            wrong: ['He drew the plans.', 'He tested the car.'],
          },
          {
            questionEn: 'What does Lea think is the most important thing?',
            questionHe: 'מה לאה חושבת שהוא הדבר הכי חשוב?',
            correct: 'Learning something new.',
            wrong: ['Winning first prize.', 'Building the fastest car.'],
          },
        ],
      },
      {
        passageEn:
          'Dear Noam, thank you for your letter. You asked for advice about your first day at a new school. First, you should arrive a few minutes early, so you can find your classroom. You don’t have to know everyone on the first day. Try to say hello to one new person, and you will see that it gets easier. I am sure you will make good friends soon. Love, Aunt Rina.',
        passageHe:
          'נועם היקר, תודה על המכתב שלך. ביקשת עצה לגבי היום הראשון שלך בבית ספר חדש. קודם כול, כדאי שתגיע כמה דקות מוקדם, כדי שתוכל למצוא את הכיתה שלך. אתה לא חייב להכיר את כולם ביום הראשון. נסה להגיד שלום לאדם חדש אחד, ותראה שזה נהיה קל יותר. אני בטוחה שבקרוב תמצא חברים טובים. באהבה, דודה רינה.',
        questions: [
          {
            questionEn: 'Why did Aunt Rina write this letter?',
            questionHe: 'למה דודה רינה כתבה את המכתב?',
            correct: 'Noam asked her for advice.',
            wrong: ['Noam won a prize.', 'Noam moved to her city.'],
          },
          {
            questionEn: 'Why should Noam arrive early?',
            questionHe: 'למה כדאי לנועם להגיע מוקדם?',
            correct: 'So he can find his classroom.',
            wrong: ['So he can meet the teacher.', 'So he can get a good seat.'],
          },
          {
            questionEn: 'What does Aunt Rina say about the first day?',
            questionHe: 'מה דודה רינה אומרת על היום הראשון?',
            correct: 'Noam doesn’t have to know everyone.',
            wrong: ['Noam must talk to everyone.', 'Noam should stay home.'],
          },
        ],
      },
    ],
  },
};
