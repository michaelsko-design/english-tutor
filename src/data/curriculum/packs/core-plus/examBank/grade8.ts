import type { ExamBankPack } from '../../../examBank/types';

/**
 * Core-plus pack, grade 8 exam bank (Feature 43), by the unit number in the mission ids. New
 * questions only. The last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_PLUS_GRADE_8_EXAM_BANK: ExamBankPack = {
  // Unit 21: used to, didn't use to, Did … use to?
  21: {
    vocabulary: [
      {
        clozeEn: 'My parents’ ____ grew up without the internet.',
        clozeHe: 'הדור של ההורים שלי גדל בלי אינטרנט.',
        answer: 'generation',
        wrong: ['allowance', 'strict'],
      },
      {
        clozeEn: 'Before computers, writers used a ____ to type their books.',
        clozeHe: 'לפני המחשבים, סופרים השתמשו במכונת כתיבה כדי להקליד את הספרים שלהם.',
        answer: 'typewriter',
        wrong: ['habit', 'decade'],
      },
      {
        clozeEn: 'Biting your nails is a bad ____ that is hard to stop.',
        clozeHe: 'לכסוס ציפורניים זה הרגל רע שקשה להפסיק.',
        answer: 'habit',
        wrong: ['cassette', 'ancestor'],
      },
      {
        clozeEn: 'Our math teacher is ____: nobody can use a phone in her lesson.',
        clozeHe: 'המורה שלנו למתמטיקה קפדנית: אף אחד לא יכול להשתמש בטלפון בשיעור שלה.',
        answer: 'strict',
        wrong: ['nostalgic', 'neighborhood'],
      },
      {
        clozeEn: 'Ten years make one ____.',
        clozeHe: 'עשר שנים הן עשור אחד.',
        answer: 'decade',
        wrong: ['habit', 'childhood'],
      },
      {
        clozeEn: 'Robots will ____ the way people work in factories.',
        clozeHe: 'רובוטים ישנו מן היסוד את הדרך שבה אנשים עובדים במפעלים.',
        answer: 'transform',
        wrong: ['allowance', 'cassette'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "When I was six, I ____ afraid of the dark."',
        correct: 'used to be',
        wrong: ['used to being', 'use to was'],
        explainHe: 'מצב שהיה פעם ונגמר: used to + V1, כלומר used to be.',
        hintHe: 'הפחד היה פעם ועבר. אחרי המבנה של הרגל בעבר בא פועל בצורת הבסיס.',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Did your dad use to play football?',
        wrong: ['Did your dad used to play football?', 'Used your dad to play football?'],
        explainHe: 'בשאלה עם Did, הצורה היא use to בלי d.',
        hintHe: 'אחרי פועל העזר של העבר, המילה הבאה חוזרת לצורת הבסיס. בדקו את הסוף שלה.',
      },
      {
        questionEn: 'Complete the sentence: "My brother ____ like fish, but now he loves sushi."',
        correct: 'didn’t use to',
        wrong: ['didn’t used to', 'not used to'],
        explainHe: 'בשלילה של הרגל בעבר כותבים didn’t use to, בלי d.',
        hintHe: 'זו שלילה של מצב מהעבר. אחרי פועל העזר בשלילה, הפועל חוזר לצורת הבסיס.',
      },
      {
        questionEn: 'Which sentence talks about a past habit that has stopped?',
        correct: 'Shira used to swim every morning.',
        wrong: ['Shira uses to swim every morning.', 'Shira is used to swim every morning.'],
        explainHe: 'הרגל שנגמר מתוארים ב-used to + V1, בלי is ובלי s.',
        hintHe: 'ההרגל נגמר. בחרו את הצורה של העבר, בלי פועל עזר של ההווה ובלי סיומת של גוף שלישי.',
      },
      {
        questionEn: 'Complete the question: "Where ____ you use to go on holiday?"',
        correct: 'did',
        wrong: ['do', 'were'],
        explainHe: 'השאלה היא על העבר, ו-use בלי d מראה שפועל העזר הוא did.',
        hintHe: 'מדובר בהרגל מהעבר, והמילה use כתובה בלי d. איזה פועל עזר בא לפניה?',
      },
      {
        questionEn: 'Complete the sentence: "Before the bridge was built, people ____ the river by boat."',
        correct: 'used to cross',
        wrong: ['use to crossing', 'used to crossed'],
        explainHe: 'הרגל שהיה פעם: used to ואחריו פועל בצורת הבסיס.',
        hintHe: 'זה קרה פעם, באופן קבוע. בדקו את הצורה של הפועל שבא אחרי המבנה.',
      },
    ],
    sentences: [
      { en: 'My grandmother used to make her own bread.', he: 'סבתא שלי נהגה להכין לחם בעצמה.' },
      { en: 'We didn’t use to have a car.', he: 'פעם לא הייתה לנו מכונית.' },
      { en: 'Did you use to play in the street?', he: 'נהגתם לשחק ברחוב?' },
      { en: 'People used to send postcards from their holidays.', he: 'אנשים נהגו לשלוח גלויות מהחופשות שלהם.' },
      { en: 'This old cinema used to be a factory.', he: 'בית הקולנוע הישן הזה היה פעם מפעל.' },
      { en: 'My mom didn’t use to drink coffee.', he: 'אמא שלי לא נהגה לשתות קפה.' },
    ],
    passages: [
      {
        passageEn:
          'In the 1980s, Ronit was a teenager in Be’er Sheva. She didn’t use to have a phone in her room. Her family used to share one phone in the living room. When she wanted to call her best friend, everybody could hear the conversation. Today, Ronit laughs because her own children have phones in their pockets all day.',
        passageHe:
          'בשנות השמונים, רונית הייתה נערה בבאר שבע. לא היה לה טלפון בחדר. המשפחה שלה נהגה לחלוק טלפון אחד בסלון. כשהיא רצתה להתקשר לחברה הכי טובה שלה, כולם יכלו לשמוע את השיחה. היום רונית צוחקת, כי לילדים שלה יש טלפונים בכיס כל היום.',
        questions: [
          {
            questionEn: 'Where did Ronit grow up?',
            questionHe: 'איפה רונית גדלה?',
            correct: 'In Be’er Sheva.',
            wrong: ['In Haifa.', 'In Eilat.'],
          },
          {
            questionEn: 'Where was the family phone?',
            questionHe: 'איפה היה הטלפון של המשפחה?',
            correct: 'In the living room.',
            wrong: ['In Ronit’s room.', 'In the kitchen.'],
          },
          {
            questionEn: 'What was the problem when Ronit called her friend?',
            questionHe: 'מה הייתה הבעיה כשרונית התקשרה לחברה שלה?',
            correct: 'Everybody could hear the conversation.',
            wrong: ['The phone line was always busy.', 'The calls were too expensive.'],
          },
        ],
      },
      {
        passageEn:
          'One hundred years ago, there were no supermarkets in most Israeli towns. People used to buy fresh food at the market every day. Milk didn’t come in cartons, and a milkman used to bring it to the door. Children often used to help their parents in the fields after school. Life was slower, but it was also much harder.',
        passageHe:
          'לפני מאה שנה, לא היו סופרמרקטים ברוב הערים בישראל. אנשים נהגו לקנות אוכל טרי בשוק בכל יום. החלב לא הגיע בקרטונים, וחלבן נהג להביא אותו עד הדלת. ילדים נהגו לעתים קרובות לעזור להורים שלהם בשדות אחרי בית הספר. החיים היו איטיים יותר, אבל גם קשים הרבה יותר.',
        questions: [
          {
            questionEn: 'Where did people use to buy fresh food?',
            questionHe: 'איפה אנשים נהגו לקנות אוכל טרי?',
            correct: 'At the market.',
            wrong: ['At the supermarket.', 'On the internet.'],
          },
          {
            questionEn: 'Who used to bring the milk?',
            questionHe: 'מי נהג להביא את החלב?',
            correct: 'A milkman.',
            wrong: ['The children.', 'A farmer’s wife.'],
          },
          {
            questionEn: 'What did children often use to do after school?',
            questionHe: 'מה ילדים נהגו לעשות לעתים קרובות אחרי בית הספר?',
            correct: 'Help their parents in the fields.',
            wrong: ['Play computer games.', 'Swim in the sea.'],
          },
        ],
      },
    ],
  },
  // Unit 22: gerunds and infinitives
  22: {
    vocabulary: [
      {
        clozeEn: 'Try to ____ eating fast food every day.',
        clozeHe: 'נסו להימנע מאכילת מזון מהיר בכל יום.',
        answer: 'avoid',
        wrong: ['skill', 'ambition'],
      },
      {
        clozeEn: 'Collecting old coins is my grandfather’s favorite ____.',
        clozeHe: 'איסוף מטבעות ישנים הוא התחביב האהוב על סבא שלי.',
        answer: 'hobby',
        wrong: ['refuse', 'afford'],
      },
      {
        clozeEn: 'We can’t ____ to fly abroad this summer, so we are camping instead.',
        clozeHe: 'אנחנו לא יכולים להרשות לעצמנו לטוס לחו״ל בקיץ הזה, אז במקום זה אנחנו יוצאים לקמפינג.',
        answer: 'afford',
        wrong: ['hobby', 'determined'],
      },
      {
        clozeEn: 'Did the firefighters ____ to save the old dog in the end?',
        clozeHe: 'האם הכבאים הצליחו להציל את הכלב הזקן בסוף?',
        answer: 'manage',
        wrong: ['avoid', 'hobby'],
      },
      {
        clozeEn: 'She was ____ to win, so she trained every single morning.',
        clozeHe: 'היא הייתה נחושה לנצח, ולכן התאמנה בכל בוקר.',
        answer: 'determined',
        wrong: ['skill', 'mind'],
      },
      {
        clozeEn: 'Learning to swim is an important ____ for every child.',
        clozeHe: 'ללמוד לשחות זו מיומנות חשובה לכל ילד.',
        answer: 'skill',
        wrong: ['volunteer', 'refuse'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "My dad enjoys ____ in the garden on Fridays."',
        correct: 'working',
        wrong: ['to work', 'work'],
        explainHe: 'אחרי enjoy בא פועל עם ing: enjoys working.',
        hintHe: 'יש פעלים שאחריהם הפועל הבא מקבל סיומת. בדקו מה בא אחרי "ליהנות".',
      },
      {
        questionEn: 'Complete the sentence: "We hope ____ the final match next week."',
        correct: 'to win',
        wrong: ['winning', 'win'],
        explainHe: 'אחרי hope בא to + V1: hope to win.',
        hintHe: 'אחרי "לקוות" באנגלית בא מבנה של שתי מילים. איזו אפשרות בנויה כך?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'Reading comics is my favorite way to relax.',
        wrong: ['Read comics is my favorite way to relax.', 'To reading comics is my favorite way to relax.'],
        explainHe: 'פועל שמשמש כנושא בתחילת המשפט מקבל ing: Reading comics.',
        hintHe: 'הפועל בתחילת המשפט הוא הנושא. איזו צורה של פועל משמשת כמו שם עצם?',
      },
      {
        questionEn: 'Complete the sentence: "The shop assistant refused ____ my money back."',
        correct: 'to give',
        wrong: ['giving', 'give'],
        explainHe: 'אחרי refuse בא to + V1: refused to give.',
        hintHe: 'אחרי "לסרב" באנגלית בא מבנה קבוע של שתי מילים. בחרו את האפשרות שבנויה כך.',
      },
      {
        questionEn: 'Complete the question: "Would you mind ____ the door for me?"',
        correct: 'opening',
        wrong: ['to open', 'open'],
        explainHe: 'אחרי mind בא פועל עם ing: mind opening.',
        hintHe: 'בדקו איזו סיומת מקבל הפועל שבא אחרי mind.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I decided to stop eating sweets.',
        wrong: ['I decided stopping to eat sweets.', 'I decided to stop to eat sweets.'],
        explainHe: 'אחרי decide בא to + V1 (to stop), ואחרי stop בא פועל עם ing (eating).',
        hintHe: 'יש כאן שני פעלים ראשיים, ולכל אחד מבנה משלו. בדקו כל אחד בנפרד.',
      },
    ],
    sentences: [
      { en: 'My sister enjoys painting in her free time.', he: 'אחותי נהנית לצייר בזמן הפנוי שלה.' },
      { en: 'We decided to clean the beach on Saturday.', he: 'החלטנו לנקות את החוף בשבת.' },
      { en: 'Riding a horse is harder than it looks.', he: 'לרכוב על סוס קשה יותר ממה שזה נראה.' },
      { en: 'He promised to call me after school.', he: 'הוא הבטיח להתקשר אליי אחרי בית הספר.' },
      { en: 'Do you mind turning down the music?', he: 'אכפת לכם להנמיך את המוזיקה?' },
      { en: 'They hope to visit Japan one day.', he: 'הם מקווים לבקר ביפן יום אחד.' },
    ],
    passages: [
      {
        passageEn:
          'Yarden is fifteen and she loves cooking. Last year, she decided to start a cooking channel for teenagers. At first, she avoided showing her face because she was shy. After a few months, she managed to get ten thousand followers. Now she enjoys sharing easy recipes, and she hopes to write a cookbook one day.',
        passageHe:
          'ירדן בת חמש-עשרה והיא אוהבת לבשל. בשנה שעברה היא החליטה לפתוח ערוץ בישול לבני נוער. בהתחלה היא נמנעה מלהראות את הפנים שלה כי היא הייתה ביישנית. אחרי כמה חודשים היא הצליחה להשיג עשרת אלפים עוקבים. עכשיו היא נהנית לשתף מתכונים קלים, והיא מקווה לכתוב ספר בישול יום אחד.',
        questions: [
          {
            questionEn: 'What did Yarden decide to start last year?',
            questionHe: 'מה ירדן החליטה לפתוח בשנה שעברה?',
            correct: 'A cooking channel for teenagers.',
            wrong: ['A small restaurant.', 'A school newspaper.'],
          },
          {
            questionEn: 'Why did she avoid showing her face at first?',
            questionHe: 'מדוע היא נמנעה בהתחלה מלהראות את הפנים שלה?',
            correct: 'Because she was shy.',
            wrong: ['Because her parents said no.', 'Because her camera was broken.'],
          },
          {
            questionEn: 'What does Yarden hope to do one day?',
            questionHe: 'מה ירדן מקווה לעשות יום אחד?',
            correct: 'Write a cookbook.',
            wrong: ['Open a bakery.', 'Become a teacher.'],
          },
        ],
      },
      {
        passageEn:
          'Every Friday, a group of teenagers in Kiryat Shmona volunteers at a farm for old horses. The horses can’t work anymore, and their owners couldn’t afford to keep them. The teens enjoy brushing and feeding the horses. Last month, they managed to raise money for a new stable. The farm manager says that the teens are more determined than many adults.',
        passageHe:
          'בכל יום שישי, קבוצת בני נוער בקריית שמונה מתנדבת בחווה לסוסים זקנים. הסוסים כבר לא יכולים לעבוד, ובעליהם לא יכלו להרשות לעצמם להחזיק אותם. בני הנוער נהנים להבריש ולהאכיל את הסוסים. בחודש שעבר הם הצליחו לגייס כסף לאורווה חדשה. מנהל החווה אומר שבני הנוער נחושים יותר ממבוגרים רבים.',
        questions: [
          {
            questionEn: 'Why are the old horses at the farm?',
            questionHe: 'מדוע הסוסים הזקנים נמצאים בחווה?',
            correct: 'Their owners couldn’t afford to keep them.',
            wrong: ['They won many races.', 'They were born there.'],
          },
          {
            questionEn: 'What do the teens enjoy doing?',
            questionHe: 'מה בני הנוער נהנים לעשות?',
            correct: 'Brushing and feeding the horses.',
            wrong: ['Riding the horses in races.', 'Selling the horses.'],
          },
          {
            questionEn: 'What did they raise money for last month?',
            questionHe: 'בשביל מה הם גייסו כסף בחודש שעבר?',
            correct: 'A new stable.',
            wrong: ['A new truck.', 'A school trip.'],
          },
        ],
      },
    ],
  },
};
