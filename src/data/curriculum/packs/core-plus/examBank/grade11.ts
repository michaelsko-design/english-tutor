import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-plus pack's grade 11 exam bank, by the unit number in its mission ids. New questions only;
 * the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_PLUS_GRADE_11_EXAM_BANK: ExamBankPack = {
  // Unit 21: I wish / If only + Past Simple (present) and + Past Perfect (past)
  21: {
    vocabulary: [
      {
        clozeEn: 'After months in the desert, the soldiers began to ____ for a cold shower.',
        clozeHe: 'אחרי חודשים במדבר, החיילים התחילו להשתוקק למקלחת קרה.',
        answer: 'yearn',
        wrong: ['grant', 'sacrifice'],
      },
      {
        clozeEn: 'With ____, it is easy to see where the team went wrong.',
        clozeHe: 'במבט לאחור, קל לראות איפה הקבוצה טעתה.',
        answer: 'hindsight',
        wrong: ['ambition', 'envious'],
      },
      {
        clozeEn: 'Riding a scooter without a helmet is a ____ thing to do.',
        clozeHe: 'לרכוב על קורקינט בלי קסדה זה דבר פזיז.',
        answer: 'reckless',
        wrong: ['nostalgia', 'circumstance'],
      },
      {
        clozeEn: 'Her parents made a huge ____ so that she could study abroad.',
        clozeHe: 'ההורים שלה עשו הקרבה עצומה כדי שהיא תוכל ללמוד בחו״ל.',
        answer: 'sacrifice',
        wrong: ['yearn', 'reckless'],
      },
      {
        clozeEn: 'Listening to songs from the nineties fills my mother with ____.',
        clozeHe: 'האזנה לשירים משנות התשעים ממלאת את אמא שלי בנוסטלגיה.',
        answer: 'nostalgia',
        wrong: ['reconcile', 'aspiration'],
      },
      {
        clozeEn: 'The mayor hopes the two neighbours will ____ and end their long dispute.',
        clozeHe: 'ראש העיר מקווה ששני השכנים יתפייסו ויסיימו את הסכסוך הארוך שלהם.',
        answer: 'reconcile',
        wrong: ['hindsight', 'envious'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the wish about the present: "I wish I ____ how to play the guitar."',
        correct: 'knew',
        wrong: ['know', 'will know'],
        explainHe: 'משאלה על ההווה באה עם Past Simple: I wish I knew.',
        hintHe: 'המשאלה היא על עכשיו, אבל הפועל אחרי wish זז זמן אחד אחורה. איזו צורה היא צורת עבר?',
      },
      {
        questionEn: 'Complete the regret: "If only we ____ the tickets before they sold out."',
        correct: 'had bought',
        wrong: ['bought', 'would buy'],
        explainHe: 'הכרטיסים כבר אזלו, ולכן זו חרטה על העבר: If only + had + V3.',
        hintHe: 'האירוע כבר קרה. איזה מבנה מדבר על "עבר שלפני העבר"?',
      },
      {
        questionEn: 'Choose the correct form: "My little sister wishes she ____ taller."',
        correct: 'were',
        wrong: ['is', 'will be'],
        explainHe: 'במשאלה על ההווה עם הפועל be משתמשים ב-were לכל הגופים.',
        hintHe: 'האחות רוצה שהמצב שלה עכשיו יהיה אחר. איזו צורה של be מתאימה למשאלה דמיונית?',
      },
      {
        questionEn: 'What does this sentence mean? "I wish I hadn\'t eaten so much cake."',
        correct: 'I ate too much cake, and I am sorry about it.',
        wrong: ['I want to eat more cake right now.', 'I did not eat any cake at the party.'],
        explainHe: 'hadn\'t eaten מראה חרטה על משהו שכבר קרה: אכלתי יותר מדי, ואני מצטער.',
        hintHe: 'משאלה עם had + V3 היא חרטה. האם הדבר קרה באמת, או לא?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'If only I could fly to Eilat this weekend.',
        wrong: ['If only I can fly to Eilat this weekend.', 'If only I will can fly to Eilat this weekend.'],
        explainHe: 'במשאלה על ההווה או על העתיד הקרוב can הופך ל-could.',
        hintHe: 'אחרי If only הפועל זז זמן אחד אחורה. מה צורת העבר של פועל העזר?',
      },
      {
        questionEn: 'Choose the correct form: "Daniel wishes he ____ to the doctor last week."',
        correct: 'had gone',
        wrong: ['went', 'goes'],
        explainHe: 'last week מראה עבר, וזו חרטה, ולכן had gone.',
        hintHe: 'מצאו את מילת הזמן במשפט. האם המשאלה היא על עכשיו או על משהו שכבר עבר?',
      },
    ],
    sentences: [
      { en: 'I wish my grandparents lived in the same city as us.', he: 'הלוואי שסבא וסבתא שלי היו גרים באותה עיר כמונו.' },
      { en: 'If only I had read the instructions more carefully.', he: 'אילו רק הייתי קורא את ההוראות בעיון רב יותר.' },
      { en: 'She wishes she were brave enough to sing on stage.', he: 'היא הייתה רוצה להיות אמיצה מספיק כדי לשיר על הבמה.' },
      { en: 'Do you ever wish you had chosen a different hobby?', he: 'האם אתם מצטערים לפעמים שלא בחרתם תחביב אחר?' },
      { en: 'The coach wishes his players trained harder before matches.', he: 'המאמן היה רוצה שהשחקנים שלו יתאמנו קשה יותר לפני משחקים.' },
      { en: 'If only the storm had not ruined our camping trip.', he: 'אילו רק הסערה לא הייתה הורסת לנו את הטיול לקמפינג.' },
    ],
    passages: [
      {
        passageEn:
          'Ori has played the piano since he was six. Last year he stopped practising because he wanted more time for football. Now his band needs a keyboard player for a big concert in Tel Aviv. Ori wishes he had kept practising, because his fingers feel slow and stiff. His teacher says that with two hours a day he can still be ready in time.',
        passageHe:
          'אורי מנגן בפסנתר מאז שהיה בן שש. בשנה שעברה הוא הפסיק להתאמן כי רצה יותר זמן לכדורגל. עכשיו הלהקה שלו צריכה נגן קלידים להופעה גדולה בתל אביב. אורי מצטער שלא המשיך להתאמן, כי האצבעות שלו מרגישות איטיות ונוקשות. המורה שלו אומרת שעם שעתיים ביום הוא עוד יכול להיות מוכן בזמן.',
        questions: [
          {
            questionEn: 'Why did Ori stop practising last year?',
            questionHe: 'למה אורי הפסיק להתאמן בשנה שעברה?',
            correct: 'He wanted more time for football.',
            wrong: ['His piano teacher moved away.', 'His band broke up after a concert.'],
          },
          {
            questionEn: 'How do Ori\'s fingers feel now?',
            questionHe: 'איך מרגישות האצבעות של אורי עכשיו?',
            correct: 'They feel slow and stiff.',
            wrong: ['They feel strong and fast.', 'They hurt after playing football.'],
          },
          {
            questionEn: 'What does his teacher suggest?',
            questionHe: 'מה המורה שלו מציעה?',
            correct: 'Practising two hours a day to be ready in time.',
            wrong: ['Finding another keyboard player for the band.', 'Cancelling the concert in Tel Aviv.'],
          },
        ],
      },
      {
        passageEn:
          'In a famous play, an old king divides his kingdom between his daughters. He gives everything to the two who praise him with sweet words. His youngest daughter refuses to flatter him, so he sends her away. Later, when the older sisters treat him cruelly, he wishes he had trusted the honest daughter. By then, however, it is too late to change his fate.',
        passageHe:
          'במחזה מפורסם, מלך זקן מחלק את ממלכתו בין בנותיו. הוא נותן הכול לשתיים שמשבחות אותו במילים מתוקות. בתו הצעירה מסרבת להחמיא לו, ולכן הוא מגרש אותה. מאוחר יותר, כשהאחיות הגדולות מתייחסות אליו באכזריות, הוא מתחרט שלא בטח בבת הכנה. אבל אז כבר מאוחר מדי לשנות את גורלו.',
        questions: [
          {
            questionEn: 'Why does the king send his youngest daughter away?',
            questionHe: 'למה המלך מגרש את בתו הצעירה?',
            correct: 'She refuses to flatter him.',
            wrong: ['She wants to rule the kingdom alone.', 'She treats her older sisters cruelly.'],
          },
          {
            questionEn: 'How do the older sisters treat the king later?',
            questionHe: 'איך האחיות הגדולות מתייחסות למלך מאוחר יותר?',
            correct: 'They treat him cruelly.',
            wrong: ['They praise him every day.', 'They give the kingdom back to him.'],
          },
          {
            questionEn: 'What does the king regret?',
            questionHe: 'על מה המלך מתחרט?',
            correct: 'He regrets that he had not trusted the honest daughter.',
            wrong: ['He regrets that he had not become king earlier.', 'He regrets that he had praised his older daughters.'],
          },
        ],
      },
    ],
  },
  // Unit 22: causative have / get + object + V3
  22: {
    vocabulary: [
      {
        clozeEn: 'The landlord promised to ____ the old bathroom before we move in.',
        clozeHe: 'בעל הבית הבטיח לשפץ את חדר האמבטיה הישן לפני שנעבור לגור.',
        answer: 'renovate',
        wrong: ['invoice', 'tailor'],
      },
      {
        clozeEn: 'Our dishwasher is the most useful ____ in the house.',
        clozeHe: 'מדיח הכלים שלנו הוא המכשיר הכי שימושי בבית.',
        answer: 'appliance',
        wrong: ['inspect', 'convenience'],
      },
      {
        clozeEn: 'The ____ shortened my trousers so they would fit perfectly.',
        clozeHe: 'החייט קיצר לי את המכנסיים כדי שיתאימו בדיוק.',
        answer: 'tailor',
        wrong: ['maintenance', 'renovate'],
      },
      {
        clozeEn: 'Safety experts ____ the bridge every year for cracks.',
        clozeHe: 'מומחי בטיחות בודקים את הגשר בכל שנה כדי לחפש סדקים.',
        answer: 'inspect',
        wrong: ['portrait', 'technician'],
      },
      {
        clozeEn: 'Ready-made meals are popular because of their ____.',
        clozeHe: 'ארוחות מוכנות פופולריות בגלל הנוחות שלהן.',
        answer: 'convenience',
        wrong: ['outsource', 'alter'],
      },
      {
        clozeEn: 'Without proper ____, the old elevator kept breaking down.',
        clozeHe: 'בלי תחזוקה נכונה, המעלית הישנה המשיכה להתקלקל.',
        answer: 'maintenance',
        wrong: ['install', 'portrait'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the causative: "Grandpa had his hearing ____ at the clinic."',
        correct: 'tested',
        wrong: ['test', 'testing'],
        explainHe: 'בגרם, אחרי have והחפץ בא V3: had his hearing tested.',
        hintHe: 'מישהו אחר עשה את הבדיקה בשביל סבא. איזו צורת פועל באה אחרי החפץ בגרם?',
      },
      {
        questionEn: 'Choose the correct word order: "Last month we ____."',
        correct: 'had our windows replaced',
        wrong: ['had replaced our windows', 'replaced had our windows'],
        explainHe: 'בגרם הסדר הוא have + חפץ + V3: had our windows replaced.',
        hintHe: 'אנשי מקצוע החליפו את החלונות. מה צריך לבוא מיד אחרי had: החפץ או הפועל?',
      },
      {
        questionEn: 'Which sentence means that a professional did the work?',
        correct: 'Lior got his laptop fixed at the mall.',
        wrong: ['Lior fixed his laptop at the mall.', 'Lior was fixing his laptop at the mall.'],
        explainHe: 'got + חפץ + V3 אומר שמישהו אחר תיקן בשביל ליאור.',
        hintHe: 'חפשו את המשפט שבו החפץ בא לפני הפועל בצורת V3.',
      },
      {
        questionEn: 'Complete in the Present Continuous: "We ____ our living room painted this week."',
        correct: 'are having',
        wrong: ['have had', 'had'],
        explainHe: 'this week ופעולה שקורית עכשיו: Present Continuous של have, כלומר are having.',
        hintHe: 'העבודה מתבצעת בימים אלה. איזו צורה של have מראה פעולה שנמשכת עכשיו?',
      },
      {
        questionEn: 'What does this sentence mean? "Shira will get her passport renewed next week."',
        correct: 'An office will renew Shira\'s passport for her.',
        wrong: ['Shira renewed her passport last week.', 'Shira will print a new passport at home.'],
        explainHe: 'will get + חפץ + V3: בשבוע הבא מישהו אחר (המשרד) יחדש לשירה את הדרכון.',
        hintHe: 'בדקו את הזמן במשפט ומי באמת עושה את העבודה.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'You should have your eyes examined regularly.',
        wrong: ['You should have examined your eyes regularly by a doctor.', 'You should have your eyes examine regularly.'],
        explainHe: 'אחרי should have + חפץ בא V3: have your eyes examined.',
        hintHe: 'שימו לב לצורת הפועל שבאה אחרי החפץ, ולסדר בין החפץ לפועל.',
      },
    ],
    sentences: [
      { en: 'We had the air conditioner serviced before the summer.', he: 'דאגנו שיעשו טיפול למזגן לפני הקיץ.' },
      { en: 'My aunt gets her groceries delivered every Thursday.', he: 'הדודה שלי מקבלת את המצרכים במשלוח בכל יום חמישי.' },
      { en: 'Have you ever had your portrait drawn by a street artist?', he: 'האם צייר רחוב צייר אי פעם את הדיוקן שלכם?' },
      { en: 'The school is having new computers installed in the library.', he: 'בית הספר מתקין מחשבים חדשים בספרייה.' },
      { en: 'Our neighbours got their garden redesigned by a professional.', he: 'השכנים שלנו דאגו שאיש מקצוע יעצב מחדש את הגינה שלהם.' },
      { en: 'I need to get my bike tyres pumped before the race.', he: 'אני צריך שינפחו לי את צמיגי האופניים לפני המרוץ.' },
    ],
    passages: [
      {
        passageEn:
          'Before opening her small café in Beersheba, Lihi had a lot of work to do. She had the floor tiled and the walls painted bright yellow. Then she got a coffee machine installed by an Italian technician. She baked all the cakes herself, because she wanted them to taste like her mother\'s. On the first morning, more than a hundred customers came in.',
        passageHe:
          'לפני שפתחה את בית הקפה הקטן שלה בבאר שבע, להיה הייתה צריכה לעשות הרבה עבודה. היא דאגה שירצפו את הרצפה ויצבעו את הקירות בצהוב בוהק. אחר כך טכנאי איטלקי התקין לה מכונת קפה. את כל העוגות היא אפתה בעצמה, כי רצתה שיהיה להן טעם כמו של העוגות של אמא שלה. בבוקר הראשון נכנסו יותר ממאה לקוחות.',
        questions: [
          {
            questionEn: 'What colour were the café walls painted?',
            questionHe: 'באיזה צבע נצבעו קירות בית הקפה?',
            correct: 'Bright yellow.',
            wrong: ['Pale blue.', 'Dark green.'],
          },
          {
            questionEn: 'What did Lihi do herself?',
            questionHe: 'מה להיה עשתה בעצמה?',
            correct: 'She baked all the cakes herself.',
            wrong: ['She installed the coffee machine.', 'She tiled the floor of the café.'],
          },
          {
            questionEn: 'How many customers came on the first morning?',
            questionHe: 'כמה לקוחות הגיעו בבוקר הראשון?',
            correct: 'More than a hundred customers.',
            wrong: ['About twenty customers.', 'Only her mother and friends.'],
          },
        ],
      },
      {
        passageEn:
          'Every two years, the city of Haifa gets its historic buildings inspected by engineers. This year, experts found cracks in an old school near the port. The city had the school closed for three months and had the walls strengthened with steel. Students studied in a nearby community centre during the repairs. When they returned, they found that their classrooms had also been repainted.',
        passageHe:
          'כל שנתיים העירייה של חיפה דואגת שמהנדסים יבדקו את המבנים ההיסטוריים שלה. השנה מצאו המומחים סדקים בבית ספר ישן ליד הנמל. העירייה סגרה את בית הספר לשלושה חודשים ודאגה שיחזקו את הקירות בפלדה. התלמידים למדו במתנ״ס קרוב בזמן התיקונים. כשחזרו, הם גילו שגם הכיתות שלהם נצבעו מחדש.',
        questions: [
          {
            questionEn: 'What did the experts find this year?',
            questionHe: 'מה מצאו המומחים השנה?',
            correct: 'Cracks in an old school near the port.',
            wrong: ['A fire in the community centre.', 'Water damage in the city hall.'],
          },
          {
            questionEn: 'Where did the students study during the repairs?',
            questionHe: 'איפה למדו התלמידים בזמן התיקונים?',
            correct: 'In a nearby community centre.',
            wrong: ['At home with online lessons.', 'In another school near the port.'],
          },
          {
            questionEn: 'What surprise did the students find when they returned?',
            questionHe: 'איזו הפתעה מצאו התלמידים כשחזרו?',
            correct: 'Their classrooms had also been repainted.',
            wrong: ['Their school had moved to a new building.', 'Their classrooms had new computers.'],
          },
        ],
      },
    ],
  },
};
