import type { ExamBankPack } from './types';

/**
 * Grade 6 exam question bank (Feature 43). New questions only: none of them appears in a grade 6
 * mission, mini-lesson, the placement test or a contest. The last 2 items of each list and the
 * second passage are for the mock exam.
 */
export const GRADE_6_EXAM_BANK: ExamBankPack = {
  // Unit 1: Present Simple, do / does questions, frequency words & time prepositions
  1: {
    vocabulary: [
      {
        clozeEn: 'The violin is a beautiful ____.',
        clozeHe: 'הכינור הוא כלי נגינה יפה.',
        answer: 'instrument',
        wrong: ['calendar', 'club'],
      },
      {
        clozeEn: 'In ____, each player starts with sixteen pieces.',
        clozeHe: 'בשחמט כל שחקן מתחיל עם שישה עשר כלים.',
        answer: 'chess',
        wrong: ['club', 'calendar'],
      },
      {
        clozeEn: 'My grandpa’s ____ is fishing at the lake.',
        clozeHe: 'התחביב של סבא שלי הוא דיג באגם.',
        answer: 'hobby',
        wrong: ['instrument', 'calendar'],
      },
      {
        clozeEn: 'I write my dentist appointment on the ____.',
        clozeHe: 'אני כותב את התור לרופא השיניים על לוח השנה.',
        answer: 'calendar',
        wrong: ['chess', 'instrument'],
      },
      {
        clozeEn: 'My brother and I build a big puzzle ____.',
        clozeHe: 'אחי ואני בונים יחד פאזל גדול.',
        answer: 'together',
        wrong: ['calendar', 'instrument'],
      },
      {
        clozeEn: 'You need to ____ every day if you want to play well.',
        clozeHe: 'צריך להתאמן כל יום אם רוצים לנגן טוב.',
        answer: 'practice',
        wrong: ['chess', 'together'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the question: "____ your friends play chess after school?"',
        correct: 'Do',
        wrong: ['Does', 'Are'],
        explainHe: 'your friends הם they, ועם they שואלים ב-Present Simple עם Do.',
        hintHe: 'your friends הם they, והפועל play בא בסיסי. איזו מילת שאלה מתאימה ל-they?',
      },
      {
        questionEn: 'Complete the question: "Does Maya ____ the piano?"',
        correct: 'play',
        wrong: ['plays', 'playing'],
        explainHe: 'אחרי Does הפועל בא בצורה הבסיסית, בלי s: Does Maya play?',
        hintHe: 'ה-s כבר נמצאת ב-Does. באיזו צורה בא הפועל אחריה?',
      },
      {
        questionEn: 'Does he go to the club? (No) Which answer is correct?',
        correct: 'No, he doesn’t.',
        wrong: ['No, he don’t.', 'No, he isn’t go.'],
        explainHe: 'על שאלה עם Does עונים בשלילה No, he doesn’t.',
        hintHe: 'השאלה מתחילה ב-Does. איזו צורת שלילה מתאימה ל-he?',
      },
      {
        questionEn: 'Complete the sentence: "The club starts ____ Monday."',
        correct: 'on',
        wrong: ['in', 'at'],
        explainHe: 'לפני יום בשבוע אומרים on: on Monday.',
        hintHe: 'Monday הוא יום בשבוע. איזו מילת יחס באה לפני ימים?',
      },
      {
        questionEn: 'Complete the sentence: "We have a chess contest ____ June."',
        correct: 'in',
        wrong: ['on', 'at'],
        explainHe: 'לפני חודש אומרים in: in June.',
        hintHe: 'June הוא חודש. איזו מילת יחס באה לפני חודשים, ולא לפני ימים או שעות?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'They usually meet at the club after school.',
        wrong: ['They meet usually at the club after school.', 'They usually meets at the club after school.'],
        explainHe: 'מילת תדירות באה לפני הפועל, ועם they הפועל בלי s: usually meet.',
        hintHe: 'איפה באה מילת התדירות: לפני הפועל או אחריו? ובדקו את הפועל עם they.',
      },
    ],
    sentences: [
      { en: 'Do you practice the piano every day?', he: 'אתם מתאמנים בפסנתר כל יום?' },
      { en: 'My hobby is building model planes.', he: 'התחביב שלי הוא בניית דגמי מטוסים.' },
      { en: 'We sometimes play chess together on Friday.', he: 'לפעמים אנחנו משחקים יחד שחמט ביום שישי.' },
      { en: 'Which instrument does your sister play?', he: 'באיזה כלי נגינה אחותך מנגנת?' },
      { en: 'The drama club meets on Wednesday afternoon.', he: 'חוג התיאטרון נפגש ביום רביעי אחר הצהריים.' },
      { en: 'Look at the calendar for the next meeting.', he: 'תסתכלו בלוח השנה כדי לראות מתי המפגש הבא.' },
    ],
    passages: [
      {
        passageEn:
          'Every Thursday, Yarden goes to the science club at the community center. The club has twelve members. They build small robots together. Yarden usually works with her friend Ofek. Next month, they want to show their robot at a big fair.',
        passageHe:
          'בכל יום חמישי ירדן הולכת למועדון המדע במתנ״ס. במועדון יש שנים עשר חברים. הם בונים יחד רובוטים קטנים. ירדן בדרך כלל עובדת עם החבר שלה אופק. בחודש הבא הם רוצים להציג את הרובוט שלהם ביריד גדול.',
        questions: [
          {
            questionEn: 'When does Yarden go to the science club?',
            questionHe: 'מתי ירדן הולכת למועדון המדע?',
            correct: 'Every Thursday.',
            wrong: ['Every Monday.', 'Every weekend.'],
          },
          {
            questionEn: 'What do the club members build?',
            questionHe: 'מה חברי המועדון בונים?',
            correct: 'Small robots.',
            wrong: ['Model planes.', 'Wooden boxes.'],
          },
          {
            questionEn: 'Who does Yarden usually work with?',
            questionHe: 'עם מי ירדן בדרך כלל עובדת?',
            correct: 'Her friend Ofek.',
            wrong: ['Her teacher.', 'Her brother.'],
          },
        ],
      },
      {
        passageEn:
          'Asaf has an unusual hobby. He collects old coins from different countries. He has more than two hundred coins. He sometimes buys coins at a market in Jaffa. His favorite coin is from Japan.',
        passageHe:
          'לאסף יש תחביב לא רגיל. הוא אוסף מטבעות ישנים מארצות שונות. יש לו יותר ממאתיים מטבעות. לפעמים הוא קונה מטבעות בשוק ביפו. המטבע האהוב עליו הוא מיפן.',
        questions: [
          {
            questionEn: 'What does Asaf collect?',
            questionHe: 'מה אסף אוסף?',
            correct: 'Old coins.',
            wrong: ['Old stamps.', 'Small robots.'],
          },
          {
            questionEn: 'Where does Asaf sometimes buy coins?',
            questionHe: 'איפה אסף קונה לפעמים מטבעות?',
            correct: 'At a market in Jaffa.',
            wrong: ['At the mall.', 'In a bank.'],
          },
          {
            questionEn: 'Where is his favorite coin from?',
            questionHe: 'מאיפה המטבע האהוב עליו?',
            correct: 'Japan.',
            wrong: ['Jaffa.', 'Italy.'],
          },
        ],
      },
    ],
  },

  // Unit 2: Present Simple vs. Present Progressive & technology words
  2: {
    vocabulary: [
      {
        clozeEn: 'Never tell anyone your ____.',
        clozeHe: 'אף פעם אל תגלו לאף אחד את הסיסמה שלכם.',
        answer: 'password',
        wrong: ['screen', 'headphones'],
      },
      {
        clozeEn: 'I wear ____ so my music doesn’t bother my family.',
        clozeHe: 'אני שם אוזניות כדי שהמוזיקה שלי לא תפריע למשפחה.',
        answer: 'headphones',
        wrong: ['password', 'website'],
      },
      {
        clozeEn: 'Mom sends me a text ____ when she is late.',
        clozeHe: 'אמא שולחת לי הודעת טקסט כשהיא מאחרת.',
        answer: 'message',
        wrong: ['laptop', 'screen'],
      },
      {
        clozeEn: 'Let’s ____ our song and send it to Grandma.',
        clozeHe: 'בואו נקליט את השיר שלנו ונשלח אותו לסבתא.',
        answer: 'record',
        wrong: ['screen', 'online'],
      },
      {
        clozeEn: 'Our class has a ____ with photos from the school trip.',
        clozeHe: 'לכיתה שלנו יש אתר אינטרנט עם תמונות מהטיול השנתי.',
        answer: 'website',
        wrong: ['password', 'headphones'],
      },
      {
        clozeEn: 'The ____ of my phone is broken, so I can’t see anything.',
        clozeHe: 'המסך של הטלפון שלי שבור, אז אני לא רואה כלום.',
        answer: 'screen',
        wrong: ['message', 'record'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "Look! The baby ____ right now."',
        correct: 'is sleeping',
        wrong: ['sleeps', 'sleeping'],
        explainHe: 'Look! ו-right now מראים שזה קורה עכשיו: is + ing.',
        hintHe: 'right now אומר שזה קורה ממש עכשיו. כמה חלקים יש לזמן הזה?',
      },
      {
        questionEn: 'Complete the sentence: "My dad ____ the news every morning."',
        correct: 'reads',
        wrong: ['is reading', 'read'],
        explainHe: 'every morning מראה הרגל, לכן Present Simple, ועם he מוסיפים s: reads.',
        hintHe: 'every morning מראה משהו שקורה כל יום. איזה זמן מתאים להרגל, ומה קורה לפועל עם he?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We are preparing a video for the class.',
        wrong: ['We preparing a video for the class.', 'We are prepare a video for the class.'],
        explainHe: 'Present Progressive צריך את שני החלקים: are + preparing.',
        hintHe: 'בזמן הזה יש שני חלקים: צורה של be ופועל עם ing. בדקו שיש את שניהם.',
      },
      {
        questionEn: 'Complete the question: "____ you listening to me?"',
        correct: 'Are',
        wrong: ['Do', 'Is'],
        explainHe: 'listening הוא Present Progressive, ועם you שואלים Are you...?',
        hintHe: 'הפועל listening עם ing. איזו מילה פותחת שאלה בזמן הזה עם you?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'She isn’t using her laptop now.',
        wrong: ['She doesn’t using her laptop now.', 'She isn’t use her laptop now.'],
        explainHe: 'השלילה ב-Present Progressive היא isn’t + ing: isn’t using.',
        hintHe: 'now אומר שזה קורה עכשיו. איזו שלילה באה לפני פועל עם ing?',
      },
      {
        questionEn: 'Complete the sentence: "I usually ____ to school, but today I am taking the bus."',
        correct: 'walk',
        wrong: ['am walking', 'walks'],
        explainHe: 'usually מראה הרגל, לכן Present Simple, ועם I בלי s: I usually walk.',
        hintHe: 'usually מראה הרגל, לא משהו שקורה עכשיו. ובדקו מה מתאים ל-I.',
      },
    ],
    sentences: [
      { en: 'Right now, my brother is recording a song.', he: 'ממש עכשיו אחי מקליט שיר.' },
      { en: 'Are you chatting online with your friends?', he: 'אתם מתכתבים ברשת עם החברים שלכם?' },
      { en: 'She usually checks her messages after dinner.', he: 'היא בדרך כלל בודקת את ההודעות שלה אחרי ארוחת הערב.' },
      { en: 'We are preparing a slideshow about animals.', he: 'אנחנו מכינים מצגת על חיות.' },
      { en: 'Please don’t share your password with anyone.', he: 'בבקשה לא לשתף את הסיסמה שלכם עם אף אחד.' },
      { en: 'The screen is too dark to read.', he: 'המסך חשוך מדי לקריאה.' },
    ],
    passages: [
      {
        passageEn:
          'It is Tuesday evening. Ofir is sitting at his desk with his laptop. He is preparing a short video about his school for a class project. He usually works on the project with his partner, Liam. Tonight Liam is sick, so Ofir is working alone.',
        passageHe:
          'עכשיו יום שלישי בערב. אופיר יושב ליד השולחן שלו עם המחשב הנייד. הוא מכין סרטון קצר על בית הספר שלו לפרויקט כיתתי. הוא בדרך כלל עובד על הפרויקט עם השותף שלו, ליאם. הערב ליאם חולה, אז אופיר עובד לבד.',
        questions: [
          {
            questionEn: 'What is Ofir preparing?',
            questionHe: 'מה אופיר מכין?',
            correct: 'A short video about his school.',
            wrong: ['A song for his class.', 'A website about space.'],
          },
          {
            questionEn: 'Who does Ofir usually work with?',
            questionHe: 'עם מי אופיר עובד בדרך כלל?',
            correct: 'His partner, Liam.',
            wrong: ['His sister.', 'His teacher.'],
          },
          {
            questionEn: 'Why is Ofir working alone tonight?',
            questionHe: 'למה אופיר עובד לבד הערב?',
            correct: 'Liam is sick.',
            wrong: ['Liam is on vacation.', 'His laptop is broken.'],
          },
        ],
      },
      {
        passageEn:
          'Grandpa Moshe is learning to use a tablet. His granddaughter Noga is helping him. Right now, he is writing his first email. Noga is showing him how to add a photo. Grandpa is smiling because the email is for his old friend in Canada.',
        passageHe:
          'סבא משה לומד להשתמש בטאבלט. הנכדה שלו נוגה עוזרת לו. ממש עכשיו הוא כותב את המייל הראשון שלו. נוגה מראה לו איך מוסיפים תמונה. סבא מחייך כי המייל הוא לחבר הוותיק שלו בקנדה.',
        questions: [
          {
            questionEn: 'Who is helping Grandpa Moshe?',
            questionHe: 'מי עוזרת לסבא משה?',
            correct: 'His granddaughter Noga.',
            wrong: ['His old friend.', 'His son.'],
          },
          {
            questionEn: 'What is Grandpa writing right now?',
            questionHe: 'מה סבא כותב ממש עכשיו?',
            correct: 'His first email.',
            wrong: ['A text message.', 'A letter on paper.'],
          },
          {
            questionEn: 'Who is the email for?',
            questionHe: 'למי המייל?',
            correct: 'His old friend in Canada.',
            wrong: ['His granddaughter.', 'His doctor.'],
          },
        ],
      },
    ],
  },

  // Unit 3: Past Simple: was / were, regular and irregular verbs
  3: {
    vocabulary: [
      {
        clozeEn: 'On New Year’s Eve, we watched colorful ____ in the sky.',
        clozeHe: 'בערב השנה האזרחית החדשה צפינו בזיקוקים צבעוניים בשמיים.',
        answer: 'fireworks',
        wrong: ['doughnut', 'costume'],
      },
      {
        clozeEn: 'On Hanukkah, I ate a sweet ____ with jam.',
        clozeHe: 'בחנוכה אכלתי סופגנייה מתוקה עם ריבה.',
        answer: 'doughnut',
        wrong: ['beach', 'fireworks'],
      },
      {
        clozeEn: 'My ____ live in Haifa, and we visit them every month.',
        clozeHe: 'סבא וסבתא שלי גרים בחיפה, ואנחנו מבקרים אותם כל חודש.',
        answer: 'grandparents',
        wrong: ['costume', 'beach'],
      },
      {
        clozeEn: 'We built a sandcastle at the ____.',
        clozeHe: 'בנינו ארמון חול בחוף הים.',
        answer: 'beach',
        wrong: ['party', 'costume'],
      },
      {
        clozeEn: 'On Purim, my little sister wore a princess ____.',
        clozeHe: 'בפורים אחותי הקטנה התחפשה לנסיכה.',
        answer: 'costume',
        wrong: ['beach', 'doughnut'],
      },
      {
        clozeEn: 'I was at the dentist ____, so I missed school.',
        clozeHe: 'הייתי אצל רופא השיניים אתמול, אז החסרתי את בית הספר.',
        answer: 'yesterday',
        wrong: ['party', 'grandparents'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "My friends ____ at the party last night."',
        correct: 'were',
        wrong: ['was', 'are'],
        explainHe: 'last night מראה עבר, ו-My friends הם they, לכן were.',
        hintHe: 'last night מראה עבר, ו-My friends הם יותר מאחד. איזו צורת עבר מתאימה ל-they?',
      },
      {
        questionEn: 'Complete the sentence: "Yesterday it ____ very hot."',
        correct: 'was',
        wrong: ['were', 'is'],
        explainHe: 'Yesterday מראה עבר, ועם it אומרים was.',
        hintHe: 'Yesterday מראה עבר. איזו צורת עבר של be מתאימה ל-it?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We played football yesterday.',
        wrong: ['We play football yesterday.', 'We playing football yesterday.'],
        explainHe: 'yesterday מראה עבר, ופועל רגיל בעבר מקבל ed: played.',
        hintHe: 'yesterday מראה עבר. איזו סיומת מקבל פועל רגיל בעבר?',
      },
      {
        questionEn: 'Complete the sentence: "Last Friday, Dad ____ a big dinner."',
        correct: 'cooked',
        wrong: ['cooks', 'cooking'],
        explainHe: 'Last Friday מראה עבר, לכן cook מקבל ed: cooked.',
        hintHe: 'Last Friday כבר עבר. באיזו צורה בא הפועל כשמדברים על עבר?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'Last summer we went to Eilat.',
        wrong: ['Last summer we go to Eilat.', 'Last summer we goed to Eilat.'],
        explainHe: 'go הוא פועל יוצא דופן: בעבר הוא went, ולא goed.',
        hintHe: 'Last summer מראה עבר. לפועל go יש צורת עבר מיוחדת, בלי ed.',
      },
      {
        questionEn: 'Complete the question: "____ you at home yesterday?"',
        correct: 'Were',
        wrong: ['Was', 'Did'],
        explainHe: 'עם you בעבר אומרים were, גם בשאלה: Were you at home?',
        hintHe: 'אין פועל אחר במשפט, רק at home. איזו צורת עבר של be מתאימה ל-you?',
      },
    ],
    sentences: [
      { en: 'Yesterday we were at my cousin’s party.', he: 'אתמול היינו במסיבה של בן הדוד שלי.' },
      { en: 'I visited my grandparents last weekend.', he: 'ביקרתי את סבא וסבתא שלי בסוף השבוע שעבר.' },
      { en: 'The fireworks were very loud and bright.', he: 'הזיקוקים היו מאוד רועשים ובוהקים.' },
      { en: 'My costume was a big green dragon.', he: 'התחפושת שלי הייתה דרקון ירוק גדול.' },
      { en: 'We ate doughnuts after the Hanukkah party.', he: 'אכלנו סופגניות אחרי מסיבת החנוכה.' },
      { en: 'Was the water at the beach cold?', he: 'המים בחוף היו קרים?' },
    ],
    passages: [
      {
        passageEn:
          'Last weekend, Mika and her parents traveled to the Dead Sea. The weather was very hot. Mika floated in the salty water and laughed. In the afternoon, they visited a small museum. They came home late, and Mika was very tired.',
        passageHe:
          'בסוף השבוע שעבר מיקה וההורים שלה נסעו לים המלח. מזג האוויר היה מאוד חם. מיקה צפה במים המלוחים וצחקה. אחר הצהריים הם ביקרו במוזיאון קטן. הם חזרו הביתה מאוחר, ומיקה הייתה מאוד עייפה.',
        questions: [
          {
            questionEn: 'Where did Mika and her parents travel?',
            questionHe: 'לאן מיקה וההורים שלה נסעו?',
            correct: 'To the Dead Sea.',
            wrong: ['To Eilat.', 'To the Galilee.'],
          },
          {
            questionEn: 'What did Mika do in the salty water?',
            questionHe: 'מה מיקה עשתה במים המלוחים?',
            correct: 'She floated and laughed.',
            wrong: ['She swam with fish.', 'She built a sandcastle.'],
          },
          {
            questionEn: 'What did they visit in the afternoon?',
            questionHe: 'במה הם ביקרו אחר הצהריים?',
            correct: 'A small museum.',
            wrong: ['A big zoo.', 'Their grandparents.'],
          },
        ],
      },
      {
        passageEn:
          'Last Purim, our school had a big costume party. I was a pirate, and my friend Roy was a robot. The teachers were funny animals. We danced and ate cake. The best costume prize went to a girl in a rainbow dress.',
        passageHe:
          'בפורים שעבר הייתה בבית הספר שלנו מסיבת תחפושות גדולה. אני הייתי פיראט, והחבר שלי רועי היה רובוט. המורים היו חיות מצחיקות. רקדנו ואכלנו עוגה. פרס התחפושת הכי טובה הלך לילדה בשמלת קשת.',
        questions: [
          {
            questionEn: 'What was Roy at the party?',
            questionHe: 'למה רועי התחפש במסיבה?',
            correct: 'A robot.',
            wrong: ['A pirate.', 'A funny animal.'],
          },
          {
            questionEn: 'What were the teachers?',
            questionHe: 'למה התחפשו המורים?',
            correct: 'Funny animals.',
            wrong: ['Pirates.', 'Robots.'],
          },
          {
            questionEn: 'Who won the best costume prize?',
            questionHe: 'מי זכה בפרס התחפושת הכי טובה?',
            correct: 'A girl in a rainbow dress.',
            wrong: ['Roy.', 'A teacher.'],
          },
        ],
      },
    ],
  },

  // Unit 4: Comparatives & How many / How much / Why
  4: {
    vocabulary: [
      {
        clozeEn: 'A cheetah runs ____ than a turtle.',
        clozeHe: 'ברדלס רץ מהר יותר מצב.',
        answer: 'faster',
        wrong: ['bigger', 'interesting'],
      },
      {
        clozeEn: 'An ____ is the biggest animal on land.',
        clozeHe: 'הפיל הוא החיה הגדולה ביותר ביבשה.',
        answer: 'elephant',
        wrong: ['backpack', 'notebook'],
      },
      {
        clozeEn: 'In ____ class, we learn about kings and old cities.',
        clozeHe: 'בשיעור היסטוריה אנחנו לומדים על מלכים ועל ערים עתיקות.',
        answer: 'history',
        wrong: ['science', 'backpack'],
      },
      {
        clozeEn: 'I put my lunch box in my ____.',
        clozeHe: 'אני שם את קופסת האוכל שלי בתיק הגב.',
        answer: 'backpack',
        wrong: ['history', 'elephant'],
      },
      {
        clozeEn: 'This book is so ____ that I can’t stop reading it.',
        clozeHe: 'הספר הזה כל כך מעניין שאני לא יכול להפסיק לקרוא אותו.',
        answer: 'interesting',
        wrong: ['faster', 'bigger'],
      },
      {
        clozeEn: 'I stayed at home ____ I was sick.',
        clozeHe: 'נשארתי בבית כי הייתי חולה.',
        answer: 'because',
        wrong: ['history', 'notebook'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "A mountain is ____ than a hill."',
        correct: 'higher',
        wrong: ['more high', 'highest'],
        explainHe: 'high היא מילה קצרה, לכן משווים בעזרת er: higher than.',
        hintHe: 'משווים שני דברים (than). מילה קצרה כמו high מקבלת סיומת, ולא מילה נוספת לפניה.',
      },
      {
        questionEn: 'Complete the sentence: "This test is ____ than the last one."',
        correct: 'more difficult',
        wrong: ['difficulter', 'most difficult'],
        explainHe: 'difficult היא מילה ארוכה, לכן משווים עם more: more difficult than.',
        hintHe: 'difficult היא מילה ארוכה. איך משווים שני דברים בעזרת מילה ארוכה?',
      },
      {
        questionEn: 'Complete the question: "How ____ water do you drink every day?"',
        correct: 'much',
        wrong: ['many', 'old'],
        explainHe: 'water הם מים, ואותם לא סופרים אחד אחד, לכן How much.',
        hintHe: 'האם אפשר לספור מים: אחד, שניים, שלושה? בחרו לפי זה.',
      },
      {
        questionEn: 'Complete the question: "How ____ students are in your class?"',
        correct: 'many',
        wrong: ['much', 'old'],
        explainHe: 'students סופרים אחד אחד (ויש s בסוף), לכן How many.',
        hintHe: 'האם אפשר לספור תלמידים אחד אחד? שימו לב ל-s בסוף students.',
      },
      {
        questionEn: 'Complete the answer: "Why are you happy?" – "____ it is my birthday."',
        correct: 'Because',
        wrong: ['So', 'But'],
        explainHe: 'על שאלה עם Why (למה) עונים עם Because (כי).',
        hintHe: 'השאלה היא Why, כלומר "למה". איזו מילה פותחת תשובה שנותנת סיבה?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'My sister is taller than me.',
        wrong: ['My sister is more tall than me.', 'My sister is tallest than me.'],
        explainHe: 'tall היא מילה קצרה, לכן taller than, בלי more.',
        hintHe: 'tall היא מילה קצרה. עם than מוסיפים לה סיומת: איזו מהשתיים?',
      },
    ],
    sentences: [
      { en: 'My backpack is heavier than yours.', he: 'תיק הגב שלי כבד יותר משלכם.' },
      { en: 'Why do you like history so much?', he: 'למה אתם כל כך אוהבים היסטוריה?' },
      { en: 'How many notebooks do you need?', he: 'כמה מחברות אתם צריכים?' },
      { en: 'A horse is faster than a camel.', he: 'סוס מהיר יותר מגמל.' },
      { en: 'This museum is bigger than the old one.', he: 'המוזיאון הזה גדול יותר מהישן.' },
      { en: 'I like science because we do experiments.', he: 'אני אוהב מדעים כי אנחנו עושים ניסויים.' },
    ],
    passages: [
      {
        passageEn:
          'Our class visited the zoo in Ramat Gan last week. First, we saw the elephants. They are much bigger than the hippos. Then we watched the cheetahs because they are the fastest animals. Ori said the zoo was more interesting than the museum.',
        passageHe:
          'הכיתה שלנו ביקרה בשבוע שעבר בגן החיות ברמת גן. קודם ראינו את הפילים. הם הרבה יותר גדולים מההיפופוטמים. אחר כך צפינו בברדלסים כי הם החיות הכי מהירות. אורי אמר שגן החיות היה מעניין יותר מהמוזיאון.',
        questions: [
          {
            questionEn: 'What did the class visit last week?',
            questionHe: 'במה הכיתה ביקרה בשבוע שעבר?',
            correct: 'The zoo in Ramat Gan.',
            wrong: ['A museum in Tel Aviv.', 'A farm.'],
          },
          {
            questionEn: 'Which animals are bigger than the hippos?',
            questionHe: 'אילו חיות גדולות יותר מההיפופוטמים?',
            correct: 'The elephants.',
            wrong: ['The cheetahs.', 'The lions.'],
          },
          {
            questionEn: 'Why did they watch the cheetahs?',
            questionHe: 'למה הם צפו בברדלסים?',
            correct: 'They are the fastest animals.',
            wrong: ['They are bigger than elephants.', 'They are very funny.'],
          },
        ],
      },
      {
        passageEn:
          'Next year, Hila is starting Grade 7 at a new school. The new school is bigger than her old school. It has a big library and a science lab. Hila is a little nervous because she doesn’t know many students there. Her brother says the new teachers are very friendly.',
        passageHe:
          'בשנה הבאה הילה מתחילה את כיתה ז׳ בבית ספר חדש. בית הספר החדש גדול יותר מבית הספר הישן שלה. יש בו ספרייה גדולה ומעבדת מדעים. הילה קצת לחוצה כי היא לא מכירה שם הרבה תלמידים. אחיה אומר שהמורים החדשים מאוד נחמדים.',
        questions: [
          {
            questionEn: 'Which grade is Hila starting next year?',
            questionHe: 'איזו כיתה הילה מתחילה בשנה הבאה?',
            correct: 'Grade 7.',
            wrong: ['Grade 6.', 'Grade 8.'],
          },
          {
            questionEn: 'What does the new school have?',
            questionHe: 'מה יש בבית הספר החדש?',
            correct: 'A big library and a science lab.',
            wrong: ['A swimming pool and a garden.', 'A small library.'],
          },
          {
            questionEn: 'Why is Hila nervous?',
            questionHe: 'למה הילה לחוצה?',
            correct: 'She doesn’t know many students there.',
            wrong: ['The school is too small.', 'Her brother is angry.'],
          },
        ],
      },
    ],
  },
};
