import type { ExamBankPack } from './types';

/**
 * Grade 9 exam question bank (Feature 43, Band III entry). New questions only: none of them
 * appears in a grade 9 mission, mini-lesson, the placement test or a contest. The last 2 items of
 * each list and the second passage are for the mock exam.
 */
export const GRADE_9_EXAM_BANK: ExamBankPack = {
  // Unit 1: Present Perfect (already, yet, since, for) vs. Past Simple
  1: {
    vocabulary: [
      {
        clozeEn: 'The summer camp gave me the ____ to work with real scientists.',
        clozeHe: 'מחנה הקיץ נתן לי הזדמנות לעבוד עם מדענים אמיתיים.',
        answer: 'opportunity',
        wrong: ['listener', 'equipment'],
      },
      {
        clozeEn: 'We borrowed microphones and other ____ from the school studio.',
        clozeHe: 'שאלנו מיקרופונים וציוד אחר מהאולפן של בית הספר.',
        answer: 'equipment',
        wrong: ['audience', 'feedback'],
      },
      {
        clozeEn: 'Our teacher gave us helpful ____ on the first draft of the podcast.',
        clozeHe: 'המורה שלנו נתנה לנו משוב מועיל על הטיוטה הראשונה של הפודקאסט.',
        answer: 'feedback',
        wrong: ['equipment', 'listener'],
      },
      {
        clozeEn: 'After weeks of practice, Maya felt ____ enough to sing on stage.',
        clozeHe: 'אחרי שבועות של תרגול, מאיה הרגישה בטוחה מספיק בעצמה כדי לשיר על הבמה.',
        answer: 'confident',
        wrong: ['production', 'interview'],
      },
      {
        clozeEn: 'The local radio station will ____ the school concert live on Friday.',
        clozeHe: 'תחנת הרדיו המקומית תשדר את קונצרט בית הספר בשידור חי ביום שישי.',
        answer: 'broadcast',
        wrong: ['achievement', 'confident'],
      },
      {
        clozeEn: 'The magazine has agreed to ____ my short story in its spring issue.',
        clozeHe: 'המגזין הסכים לפרסם את הסיפור הקצר שלי בגיליון האביב שלו.',
        answer: 'publish',
        wrong: ['listener', 'interview'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "We have worked on this podcast ____ September."',
        correct: 'since',
        wrong: ['for', 'ago'],
        explainHe: 'September היא נקודת התחלה בזמן, ולכן since (מאז).',
        hintHe: 'האם September היא משך של זמן, או הנקודה שבה זה התחיל?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'They have interviewed five guests so far.',
        wrong: ['They have interview five guests so far.', 'They has interviewed five guests so far.'],
        explainHe: 'they + have + V3: have interviewed. so far (עד עכשיו) מתאים ל-Present Perfect.',
        hintHe: 'בדקו את פועל העזר שמתאים ל-they ואת צורת הפועל שאחריו.',
      },
      {
        questionEn: 'Complete the sentence: "Our first episode ____ online last Tuesday."',
        correct: 'went',
        wrong: ['has gone', 'have gone'],
        explainHe: 'last Tuesday הוא זמן מוגדר בעבר, ולכן Past Simple: went.',
        hintHe: 'האם יש במשפט זמן מוגדר בעבר? עם זמן כזה לא משתמשים ב-Present Perfect.',
      },
      {
        questionEn: 'Choose the correct question:',
        correct: 'How long have you been a radio host?',
        wrong: ['How long are you a radio host?', 'How long did you are a radio host?'],
        explainHe: 'כשמשהו התחיל בעבר ונמשך עד היום שואלים How long + Present Perfect: How long have you been...?',
        hintHe: 'השאלה היא על משהו שהתחיל בעבר ועדיין נמשך. איזה זמן מחבר בין העבר להווה?',
      },
      {
        questionEn: 'Complete the sentence: "I ____ my headphones. Can I borrow yours?"',
        correct: 'have lost',
        wrong: ['lose', 'have lose'],
        explainHe: 'התוצאה חשובה עכשיו (אין לי אוזניות), ולכן Present Perfect: have lost.',
        hintHe: 'המשפט השני מראה שהבעיה קיימת עכשיו. איזה זמן מחבר פעולה בעבר לתוצאה בהווה, ומה צורת הפועל בו?',
      },
      {
        questionEn: 'Complete the sentence: "Ella hasn’t edited the audio file ____."',
        correct: 'yet',
        wrong: ['already', 'since'],
        explainHe: 'yet בא בסוף משפט שלילה או שאלה ב-Present Perfect: hasn’t ... yet.',
        hintHe: 'המשפט שלילי. איזו מילה באה בסוף משפטי שלילה ב-Present Perfect, במשמעות "עדיין לא"?',
      },
    ],
    sentences: [
      { en: 'Have you ever recorded your own voice?', he: 'הקלטתם פעם את הקול שלכם?' },
      { en: 'Our podcast has reached two thousand listeners this month.', he: 'הפודקאסט שלנו הגיע לאלפיים מאזינים החודש.' },
      { en: 'I have known our sound engineer since first grade.', he: 'אני מכיר את טכנאי הסאונד שלנו מכיתה א׳.' },
      { en: 'She interviewed a famous chef last week.', he: 'היא ראיינה שף מפורסם בשבוע שעבר.' },
      { en: 'We haven’t chosen a name for the show yet.', he: 'עוד לא בחרנו שם לתוכנית.' },
      { en: 'The audience has sent us hundreds of questions.', he: 'הקהל שלח לנו מאות שאלות.' },
    ],
    passages: [
      {
        passageEn:
          'Tamar and Yonatan are fourteen, and they have hosted a science podcast for two years. They started it during a long winter break, when they had nothing to do. So far, they have recorded sixty episodes and interviewed doctors, astronauts and inventors. Last month, a university professor invited them to record an episode in her laboratory. They have already received thousands of messages from listeners around the world.',
        passageHe:
          'תמר ויונתן בני ארבע עשרה, והם מגישים פודקאסט מדעי כבר שנתיים. הם התחילו אותו בחופשת חורף ארוכה, כשלא היה להם מה לעשות. עד עכשיו הם הקליטו שישים פרקים וראיינו רופאים, אסטרונאוטים וממציאים. בחודש שעבר פרופסורית באוניברסיטה הזמינה אותם להקליט פרק במעבדה שלה. הם כבר קיבלו אלפי הודעות ממאזינים בכל העולם.',
        questions: [
          {
            questionEn: 'How long have Tamar and Yonatan hosted the podcast?',
            questionHe: 'כמה זמן תמר ויונתן מגישים את הפודקאסט?',
            correct: 'For two years.',
            wrong: ['For six months.', 'Since last winter.'],
          },
          {
            questionEn: 'When did they start the podcast?',
            questionHe: 'מתי הם התחילו את הפודקאסט?',
            correct: 'During a long winter break.',
            wrong: ['After a school trip.', 'On their first day of school.'],
          },
          {
            questionEn: 'Who invited them to a laboratory?',
            questionHe: 'מי הזמין אותם למעבדה?',
            correct: 'A university professor.',
            wrong: ['A famous astronaut.', 'One of their listeners.'],
          },
        ],
      },
      {
        passageEn:
          'The school radio station in Kfar Saba has broadcast a morning show every day since 2019. Students prepare the news, choose the music and interview teachers. This year, the show has won a national prize for youth media. The judges said the students sounded as professional as real journalists. The winners used the prize money to buy new microphones for the studio.',
        passageHe:
          'תחנת הרדיו של בית הספר בכפר סבא משדרת תוכנית בוקר בכל יום מאז 2019. התלמידים מכינים את החדשות, בוחרים את המוזיקה ומראיינים מורים. השנה התוכנית זכתה בפרס ארצי לתקשורת נוער. השופטים אמרו שהתלמידים נשמעו מקצועיים כמו עיתונאים אמיתיים. הזוכים השתמשו בכספי הפרס כדי לקנות מיקרופונים חדשים לאולפן.',
        questions: [
          {
            questionEn: 'Since when has the station broadcast a morning show?',
            questionHe: 'ממתי התחנה משדרת תוכנית בוקר?',
            correct: 'Since 2019.',
            wrong: ['Since 2009.', 'Since last year.'],
          },
          {
            questionEn: 'What has the show won this year?',
            questionHe: 'במה זכתה התוכנית השנה?',
            correct: 'A national prize for youth media.',
            wrong: ['New microphones.', 'A trip abroad.'],
          },
          {
            questionEn: 'What did the winners buy with the prize money?',
            questionHe: 'מה הזוכים קנו בכספי הפרס?',
            correct: 'New microphones for the studio.',
            wrong: ['A new computer.', 'Tickets to a concert.'],
          },
        ],
      },
    ],
  },

  // Unit 2: Second Conditional, although / despite
  2: {
    vocabulary: [
      {
        clozeEn: 'Smartphones and other kinds of ____ have changed the way we learn.',
        clozeHe: 'סמארטפונים וסוגים אחרים של טכנולוגיה שינו את הדרך שבה אנחנו לומדים.',
        answer: 'technology',
        wrong: ['argument', 'privacy'],
      },
      {
        clozeEn: 'Please respect my ____ and don’t read my messages.',
        clozeHe: 'בבקשה לכבד את הפרטיות שלי ולא לקרוא את ההודעות שלי.',
        answer: 'privacy',
        wrong: ['debate', 'advantage'],
      },
      {
        clozeEn: 'Being tall is a big ____ in basketball.',
        clozeHe: 'להיות גבוה זה יתרון גדול בכדורסל.',
        answer: 'advantage',
        wrong: ['privacy', 'statement'],
      },
      {
        clozeEn: 'Lior tried to ____ his parents to buy a puppy.',
        clozeHe: 'ליאור ניסה לשכנע את ההורים שלו לקנות גור.',
        answer: 'convince',
        wrong: ['artificial', 'perspective'],
      },
      {
        clozeEn: 'The flowers on the table look real, but they are ____.',
        clozeHe: 'הפרחים על השולחן נראים אמיתיים, אבל הם מלאכותיים.',
        answer: 'artificial',
        wrong: ['ethical', 'convince'],
      },
      {
        clozeEn: 'Friends can ____ the music you listen to and the clothes you wear.',
        clozeHe: 'חברים יכולים להשפיע על המוזיקה שאתם שומעים ועל הבגדים שאתם לובשים.',
        answer: 'influence',
        wrong: ['privacy', 'statement'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "If I ____ a robot, it would clean my room."',
        correct: 'had',
        wrong: ['have', 'will have'],
        explainHe: 'בתנאי מסוג שני (מצב דמיוני) החלק של if בא ב-Past Simple: If I had.',
        hintHe: 'בחלק השני יש would, ולכן זה מצב דמיוני. באיזה זמן כתוב החלק של if בתנאי כזה?',
      },
      {
        questionEn: 'Complete the sentence: "If we lived on the Moon, we ____ very light."',
        correct: 'would feel',
        wrong: ['will feel', 'would felt'],
        explainHe: 'בתנאי מסוג שני חלק התוצאה בא עם would + פועל בסיסי: would feel.',
        hintHe: 'החלק של if כתוב בעבר, ולכן זה מצב דמיוני. מה בא בחלק התוצאה, ובאיזו צורה בא הפועל אחריו?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'If I were the principal, I would cancel homework on Fridays.',
        wrong: [
          'If I am the principal, I would cancel homework on Fridays.',
          'If I were the principal, I will cancel homework on Fridays.',
        ],
        explainHe: 'במצב דמיוני כותבים If I were (גם עם I), ובחלק השני would + פועל בסיסי.',
        hintHe: 'האם מדובר במצב אמיתי או דמיוני? בדקו ששני חלקי המשפט מתאימים זה לזה.',
      },
      {
        questionEn: 'Choose the connector: "____ the robot was expensive, the school bought two of them."',
        correct: 'Although',
        wrong: ['Because', 'So'],
        explainHe: 'יש כאן ניגוד: הרובוט יקר, ובכל זאת קנו שניים. ניגוד כזה מחברים עם Although.',
        hintHe: 'האם החלק השני הוא תוצאה צפויה של החלק הראשון, או משהו שקרה למרות החלק הראשון?',
      },
      {
        questionEn: 'Complete the sentence: "____ the rain, the debate team arrived on time."',
        correct: 'Despite',
        wrong: ['Although', 'Because'],
        explainHe: 'אחרי Despite בא שם עצם (the rain), ואחרי Although בא משפט שלם. כאן יש רק the rain, ולכן Despite.',
        hintHe: 'מה בא אחרי החסר: משפט שלם עם פועל, או רק שם עצם? וזכרו שיש כאן ניגוד.',
      },
      {
        questionEn: 'Complete the question: "What would you do if you ____ a famous singer?"',
        correct: 'met',
        wrong: ['meet', 'will meet'],
        explainHe: 'בשאלה דמיונית עם would, החלק של if בא ב-Past Simple: if you met.',
        hintHe: 'בשאלה יש would, ולכן היא על מצב דמיוני. באיזה זמן בא הפועל אחרי if?',
      },
    ],
    sentences: [
      { en: 'If I had more free time, I would learn to code.', he: 'אם היה לי יותר זמן פנוי, הייתי לומד לתכנת.' },
      { en: 'Although the app is free, it collects a lot of data.', he: 'למרות שהאפליקציה חינמית, היא אוספת הרבה מידע.' },
      { en: 'Would you trust a robot to drive your car?', he: 'הייתם סומכים על רובוט שינהג במכונית שלכם?' },
      { en: 'Despite the noise, the speakers stayed calm.', he: 'למרות הרעש, הדוברים נשארו רגועים.' },
      {
        en: 'If robots wrote our essays, we would never improve our writing.',
        he: 'אם רובוטים היו כותבים לנו את החיבורים, אף פעם לא היינו משפרים את הכתיבה שלנו.',
      },
      { en: 'Every side in the debate has a strong argument.', he: 'לכל צד בוויכוח יש טיעון חזק.' },
    ],
    passages: [
      {
        passageEn:
          'Last week, the debate club at Ofek High School discussed a difficult question. Should students be allowed to use AI tools for their homework? Gili argued that AI would help weaker students understand hard topics. However, Shaked said that if students used AI all the time, they would stop thinking for themselves. In the end, the judges chose Shaked’s team, although many students in the audience agreed with Gili.',
        passageHe:
          'בשבוע שעבר מועדון הדיבייט בתיכון אופק דן בשאלה קשה. האם מותר לתלמידים להשתמש בכלי בינה מלאכותית לשיעורי הבית? גילי טען שבינה מלאכותית תעזור לתלמידים חלשים יותר להבין נושאים קשים. לעומת זאת, שקד אמרה שאם תלמידים ישתמשו בבינה מלאכותית כל הזמן, הם יפסיקו לחשוב בעצמם. בסוף השופטים בחרו בקבוצה של שקד, אף שתלמידים רבים בקהל הסכימו עם גילי.',
        questions: [
          {
            questionEn: 'What did the debate club discuss?',
            questionHe: 'על מה דן מועדון הדיבייט?',
            correct: 'Using AI tools for homework.',
            wrong: ['Shorter school days.', 'Phones in the classroom.'],
          },
          {
            questionEn: 'What did Gili argue?',
            questionHe: 'מה גילי טען?',
            correct: 'AI would help weaker students.',
            wrong: ['AI would make students lazy.', 'AI should be banned.'],
          },
          {
            questionEn: 'Which team did the judges choose?',
            questionHe: 'באיזו קבוצה בחרו השופטים?',
            correct: 'Shaked’s team.',
            wrong: ['Gili’s team.', 'Neither team.'],
          },
        ],
      },
      {
        passageEn:
          'Imagine a city where every car drove itself. If that happened, there would probably be fewer accidents, because computers never get tired. Old people and people with disabilities would travel more easily. On the other hand, many taxi and bus drivers would lose their jobs. Although the technology already exists, most experts think we will need many more years of testing.',
        passageHe:
          'דמיינו עיר שבה כל מכונית נוהגת בעצמה. אם זה היה קורה, כנראה היו פחות תאונות, כי מחשבים אף פעם לא מתעייפים. אנשים מבוגרים ואנשים עם מוגבלויות היו נוסעים בקלות רבה יותר. מצד שני, נהגי מוניות ואוטובוסים רבים היו מאבדים את העבודה שלהם. אף שהטכנולוגיה כבר קיימת, רוב המומחים חושבים שנצטרך עוד שנים רבות של ניסויים.',
        questions: [
          {
            questionEn: 'Why would there be fewer accidents?',
            questionHe: 'למה היו פחות תאונות?',
            correct: 'Computers never get tired.',
            wrong: ['Cars would drive more slowly.', 'Roads would be wider.'],
          },
          {
            questionEn: 'Who would travel more easily?',
            questionHe: 'מי היה נוסע בקלות רבה יותר?',
            correct: 'Old people and people with disabilities.',
            wrong: ['Taxi drivers.', 'Young children.'],
          },
          {
            questionEn: 'What would happen to many taxi drivers?',
            questionHe: 'מה היה קורה לנהגי מוניות רבים?',
            correct: 'They would lose their jobs.',
            wrong: ['They would earn more money.', 'They would test new cars.'],
          },
        ],
      },
    ],
  },

  // Unit 3: Passive Voice (Present Simple and Past Simple)
  3: {
    vocabulary: [
      {
        clozeEn: 'I read an interesting ____ about sleep in this week’s newspaper.',
        clozeHe: 'קראתי כתבה מעניינת על שינה בעיתון של השבוע.',
        answer: 'article',
        wrong: ['patent', 'truth'],
      },
      {
        clozeEn: 'Wikipedia is a good place to start, but always check another ____.',
        clozeHe: 'ויקיפדיה היא מקום טוב להתחיל בו, אבל תמיד כדאי לבדוק מקור נוסף.',
        answer: 'source',
        wrong: ['patent', 'journalism'],
      },
      {
        clozeEn: 'The ____ on the front page was in huge red letters.',
        clozeHe: 'הכותרת בעמוד הראשון הייתה באותיות אדומות ענקיות.',
        answer: 'headline',
        wrong: ['truth', 'discover'],
      },
      {
        clozeEn: 'The telephone was an ____ that changed the way people talk.',
        clozeHe: 'הטלפון היה המצאה ששינתה את הדרך שבה אנשים מדברים.',
        answer: 'invention',
        wrong: ['reliable', 'discover'],
      },
      {
        clozeEn: 'Our old car is slow, but it is ____ and never breaks down.',
        clozeHe: 'המכונית הישנה שלנו איטית, אבל היא אמינה ואף פעם לא מתקלקלת.',
        answer: 'reliable',
        wrong: ['historical', 'headline'],
      },
      {
        clozeEn: 'Divers hope to ____ the remains of an old ship near Caesarea.',
        clozeHe: 'צוללים מקווים לגלות שרידים של ספינה עתיקה ליד קיסריה.',
        answer: 'discover',
        wrong: ['patent', 'truth'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "English ____ in many countries around the world."',
        correct: 'is spoken',
        wrong: ['is speak', 'speaks'],
        explainHe: 'השפה לא מדברת בעצמה. אנשים מדברים אותה, ולכן סביל: is + V3: is spoken.',
        hintHe: 'האם השפה עושה את הפעולה, או שהפעולה נעשית לה? מה בא אחרי is בסביל?',
      },
      {
        questionEn: 'Complete the sentence: "The first photograph ____ almost two hundred years ago."',
        correct: 'was taken',
        wrong: ['is taken', 'took'],
        explainHe: 'ago מראה עבר, והתמונה לא צילמה את עצמה, ולכן סביל בעבר: was + V3.',
        hintHe: 'המילה ago מראה מתי זה קרה. האם התמונה עשתה את הפעולה בעצמה?',
      },
      {
        questionEn: 'Which sentence is in the Passive Voice?',
        correct: 'The news is read by millions of people.',
        wrong: ['Millions of people read the news.', 'Millions of people are reading the news.'],
        explainHe: 'בסביל מי שמקבל את הפעולה (the news) בא בהתחלה, ואחריו is + V3 ו-by.',
        hintHe: 'בסביל, מי שעושה את הפעולה זז לסוף המשפט או נעלם. באיזה משפט זה קרה?',
      },
      {
        questionEn: 'Complete the sentence: "These phones ____ in a factory in Korea."',
        correct: 'are made',
        wrong: ['is made', 'are make'],
        explainHe: 'these phones הם רבים, ולכן are, ואחריו V3: are made.',
        hintHe: 'these phones הם רבים. איזה פועל עזר מתאים להם, ובאיזו צורה בא הפועל אחריו?',
      },
      {
        questionEn: 'Change to the Passive: "Someone stole the painting last night."',
        correct: 'The painting was stolen last night.',
        wrong: ['The painting is stolen last night.', 'The painting was stole last night.'],
        explainHe: 'stole הוא עבר, ולכן was, ו-V3 של steal הוא stolen.',
        hintHe: 'המשפט המקורי בעבר. בדקו את פועל העזר ואת הצורה השלישית של steal.',
      },
      {
        questionEn: 'Complete the question: "When ____ the Eiffel Tower built?"',
        correct: 'was',
        wrong: ['did', 'is'],
        explainHe: 'שאלה בסביל בעבר: When + was + הנושא + V3: When was it built?',
        hintHe: 'built הוא כאן V3 של פועל סביל, והבנייה הייתה בעבר. איזה פועל עזר בא לפני הנושא?',
      },
    ],
    sentences: [
      { en: 'The school newspaper is printed every two weeks.', he: 'עיתון בית הספר מודפס פעם בשבועיים.' },
      { en: 'This bridge was designed by a young engineer.', he: 'הגשר הזה תוכנן על ידי מהנדסת צעירה.' },
      { en: 'Millions of emails are sent every second.', he: 'מיליוני מיילים נשלחים בכל שנייה.' },
      { en: 'The ancient coins were found by two hikers.', he: 'המטבעות העתיקים נמצאו על ידי שני מטיילים.' },
      { en: 'Was this article written by a student?', he: 'הכתבה הזאת נכתבה על ידי תלמיד?' },
      { en: 'The results of the survey will be published next week.', he: 'תוצאות הסקר יפורסמו בשבוע הבא.' },
    ],
    passages: [
      {
        passageEn:
          'The Dead Sea Scrolls were discovered in 1947 by a young shepherd. He was looking for a lost goat when he threw a stone into a cave and heard something break. Inside the cave, old clay jars were found, and in them were ancient scrolls. Today, the scrolls are kept in a special building in Jerusalem called the Shrine of the Book. They are protected from light, because light can damage them.',
        passageHe:
          'מגילות ים המלח התגלו ב-1947 על ידי רועה צעיר. הוא חיפש עז שאבדה כשזרק אבן לתוך מערה ושמע משהו נשבר. בתוך המערה נמצאו כדי חרס עתיקים, ובתוכם היו מגילות עתיקות. היום המגילות נשמרות בבניין מיוחד בירושלים שנקרא היכל הספר. הן מוגנות מפני אור, כי אור יכול להזיק להן.',
        questions: [
          {
            questionEn: 'Who discovered the scrolls?',
            questionHe: 'מי גילה את המגילות?',
            correct: 'A young shepherd.',
            wrong: ['A team of scientists.', 'A tourist from Jerusalem.'],
          },
          {
            questionEn: 'What was the shepherd looking for?',
            questionHe: 'מה הרועה חיפש?',
            correct: 'A lost goat.',
            wrong: ['Old clay jars.', 'A place to sleep.'],
          },
          {
            questionEn: 'Why are the scrolls protected from light?',
            questionHe: 'למה המגילות מוגנות מפני אור?',
            correct: 'Light can damage them.',
            wrong: ['Visitors prefer dark rooms.', 'The jars are too old.'],
          },
        ],
      },
      {
        passageEn:
          'Every morning, thousands of news stories are written around the world. But how is a story checked before it is published? First, the facts are compared with at least two reliable sources. Then, the article is read by an editor, who corrects mistakes and makes it shorter. Finally, a headline is chosen, and the story is sent to readers online.',
        passageHe:
          'בכל בוקר נכתבות אלפי כתבות חדשות ברחבי העולם. אבל איך כתבה נבדקת לפני שהיא מתפרסמת? קודם כול, העובדות מושוות לשני מקורות אמינים לפחות. אחר כך העורך קורא את הכתבה, מתקן טעויות ומקצר אותה. לבסוף נבחרת כותרת, והכתבה נשלחת לקוראים ברשת.',
        questions: [
          {
            questionEn: 'How many sources are the facts compared with?',
            questionHe: 'לכמה מקורות מושווים העובדות?',
            correct: 'At least two reliable sources.',
            wrong: ['Only one source.', 'Ten different sources.'],
          },
          {
            questionEn: 'Who reads the article before it is published?',
            questionHe: 'מי קורא את הכתבה לפני שהיא מתפרסמת?',
            correct: 'An editor.',
            wrong: ['The readers.', 'A photographer.'],
          },
          {
            questionEn: 'What is chosen at the end?',
            questionHe: 'מה נבחר בסוף?',
            correct: 'A headline.',
            wrong: ['A photo.', 'A new editor.'],
          },
        ],
      },
    ],
  },

  // Unit 4: Relative clauses (who, which, that, where), Past Perfect, real future choices
  4: {
    vocabulary: [
      {
        clozeEn: 'Her ____ is to become the first doctor in her family.',
        clozeHe: 'השאיפה שלה היא להיות הרופאה הראשונה במשפחה.',
        answer: 'ambition',
        wrong: ['curriculum', 'equality'],
      },
      {
        clozeEn: 'The new ____ includes more science and less history.',
        clozeHe: 'תוכנית הלימודים החדשה כוללת יותר מדעים ופחות היסטוריה.',
        answer: 'curriculum',
        wrong: ['ambition', 'graduation'],
      },
      {
        clozeEn: 'Grandpa gave a large ____ to the hospital in his town.',
        clozeHe: 'סבא תרם תרומה גדולה לבית החולים בעיר שלו.',
        answer: 'contribution',
        wrong: ['capability', 'career'],
      },
      {
        clozeEn: 'The speech by the young astronaut was truly ____.',
        clozeHe: 'הנאום של האסטרונאוטית הצעירה באמת עורר השראה.',
        answer: 'inspiring',
        wrong: ['equality', 'graduation'],
      },
      {
        clozeEn: 'Our parents sat in the front row at the ____ ceremony.',
        clozeHe: 'ההורים שלנו ישבו בשורה הראשונה בטקס הסיום.',
        answer: 'graduation',
        wrong: ['ambition', 'impact'],
      },
      {
        clozeEn: 'Women fought for ____ and the right to vote.',
        clozeHe: 'נשים נאבקו למען שוויון והזכות להצביע.',
        answer: 'equality',
        wrong: ['curriculum', 'capability'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "The coach ____ trained our team won an award."',
        correct: 'who',
        wrong: ['which', 'where'],
        explainHe: 'the coach הוא אדם, ולכן who.',
        hintHe: 'על מה מדבר החלק החסר: על אדם, על חפץ או על מקום?',
      },
      {
        questionEn: 'Complete the sentence: "This is the hall ____ the graduation party will take place."',
        correct: 'where',
        wrong: ['who', 'which'],
        explainHe: 'the hall הוא מקום, ו-where מחבר מקום למה שקורה בו.',
        hintHe: 'the hall הוא מקום. איזו מילה מחברת מקום לפעולה שקורית בו?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'The book that I borrowed was about Golda Meir.',
        wrong: ['The book who I borrowed was about Golda Meir.', 'The book where I borrowed was about Golda Meir.'],
        explainHe: 'the book הוא חפץ, ולכן that (או which), לא who ולא where.',
        hintHe: 'על מה מדבר החלק שאחרי the book? בחרו מילה שמתאימה לחפצים.',
      },
      {
        questionEn: 'Complete the sentence: "When we arrived at the cinema, the film ____ already started."',
        correct: 'had',
        wrong: ['has', 'have'],
        explainHe: 'הסרט התחיל לפני שהגענו, כלומר פעולה לפני פעולה אחרת בעבר: Past Perfect, had + V3.',
        hintHe: 'שתי הפעולות בעבר. מה קרה קודם? לפעולה שקרתה לפני פעולה אחרת בעבר יש זמן מיוחד.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'She had finished her exams before she started her first job.',
        wrong: [
          'She has finished her exams before she started her first job.',
          'She had finish her exams before she started her first job.',
        ],
        explainHe: 'הבחינות הסתיימו לפני העבודה, ולכן Past Perfect: had + V3 (finished).',
        hintHe: 'מה קרה קודם: הבחינות או העבודה? בדקו את פועל העזר ואת צורת הפועל שאחריו.',
      },
      {
        questionEn:
          'Complete the sentence: "If you choose the science track, you ____ study physics and chemistry."',
        correct: 'will',
        wrong: ['would', 'are'],
        explainHe: 'זו אפשרות אמיתית בעתיד (if + הווה פשוט), ולכן will בחלק התוצאה.',
        hintHe: 'החלק של if כתוב בהווה פשוט. האם זו אפשרות אמיתית או מצב דמיוני?',
      },
    ],
    sentences: [
      { en: 'The girl who won the science prize lives on my street.', he: 'הילדה שזכתה בפרס המדע גרה ברחוב שלי.' },
      { en: 'This is the café where my parents first met.', he: 'זה בית הקפה שבו ההורים שלי נפגשו בפעם הראשונה.' },
      { en: 'I had never flown before our trip to Rome.', he: 'אף פעם לא טסתי לפני הטיול שלנו לרומא.' },
      {
        en: 'Students who volunteer in the community earn extra points.',
        he: 'תלמידים שמתנדבים בקהילה מקבלים נקודות נוספות.',
      },
      { en: 'If you work hard, you will reach your goals.', he: 'אם תעבדו קשה, תגיעו למטרות שלכם.' },
      { en: 'The bus had left by the time we reached the station.', he: 'האוטובוס כבר יצא עד שהגענו לתחנה.' },
    ],
    passages: [
      {
        passageEn:
          'Ilan Ramon was the first Israeli astronaut, and he flew into space in 2003. Before he joined the space program, he had been a pilot in the air force for many years. On the shuttle, he carried a small drawing that a boy had made during the Holocaust. The drawing showed the Earth as seen from the Moon. Today, many schools in Israel are named after him, and his story inspires students who dream of science careers.',
        passageHe:
          'אילן רמון היה האסטרונאוט הישראלי הראשון, והוא טס לחלל ב-2003. לפני שהצטרף לתוכנית החלל, הוא היה טייס בחיל האוויר במשך שנים רבות. במעבורת הוא לקח איתו ציור קטן שילד צייר בתקופת השואה. הציור הראה את כדור הארץ כפי שהוא נראה מהירח. היום בתי ספר רבים בישראל נקראים על שמו, והסיפור שלו מעורר השראה בתלמידים שחולמים על קריירה במדע.',
        questions: [
          {
            questionEn: 'When did Ilan Ramon fly into space?',
            questionHe: 'מתי אילן רמון טס לחלל?',
            correct: 'In 2003.',
            wrong: ['In 1993.', 'In 2013.'],
          },
          {
            questionEn: 'What had he done before he joined the space program?',
            questionHe: 'מה הוא עשה לפני שהצטרף לתוכנית החלל?',
            correct: 'He had been a pilot in the air force.',
            wrong: ['He had taught science at a school.', 'He had built rockets.'],
          },
          {
            questionEn: 'What did the drawing show?',
            questionHe: 'מה הראה הציור?',
            correct: 'The Earth as seen from the Moon.',
            wrong: ['A plane in the sky.', 'A school in Israel.'],
          },
        ],
      },
      {
        passageEn:
          'At the end of ninth grade, students in Israel choose the subjects that they will study in high school. Noga, who loves animals, has chosen biology and chemistry. Her best friend Amir had planned to study computers, but he changed his mind after a trip to a theater festival. Now he wants to study drama and film. Their teacher says that students who follow their passions usually succeed.',
        passageHe:
          'בסוף כיתה ט׳ תלמידים בישראל בוחרים את המקצועות שהם ילמדו בתיכון. נוגה, שאוהבת בעלי חיים, בחרה בביולוגיה ובכימיה. החבר הכי טוב שלה, אמיר, תכנן ללמוד מחשבים, אבל הוא שינה את דעתו אחרי טיול לפסטיבל תיאטרון. עכשיו הוא רוצה ללמוד תיאטרון וקולנוע. המורה שלהם אומרת שתלמידים שהולכים אחרי התשוקה שלהם בדרך כלל מצליחים.',
        questions: [
          {
            questionEn: 'Why did Noga choose biology?',
            questionHe: 'למה נוגה בחרה בביולוגיה?',
            correct: 'She loves animals.',
            wrong: ['Her parents are doctors.', 'Her friend chose it.'],
          },
          {
            questionEn: 'What had Amir planned to study?',
            questionHe: 'מה אמיר תכנן ללמוד?',
            correct: 'Computers.',
            wrong: ['Biology.', 'Drama and film.'],
          },
          {
            questionEn: 'What made Amir change his mind?',
            questionHe: 'מה גרם לאמיר לשנות את דעתו?',
            correct: 'A trip to a theater festival.',
            wrong: ['A talk with his teacher.', 'A film he watched at home.'],
          },
        ],
      },
    ],
  },
};
