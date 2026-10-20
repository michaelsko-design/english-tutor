import type { ExamBankPack } from './types';

/**
 * Grade 4 exam question bank (Feature 43). New questions only: none of them appears in a grade 4
 * mission, mini-lesson, the placement test or a contest. The last 2 items of each list and the
 * second passage are for the mock exam.
 */
export const GRADE_4_EXAM_BANK: ExamBankPack = {
  // Unit 1: Action verbs, can / can't & questions with can
  1: {
    vocabulary: [
      {
        clozeEn: 'The firefighter is ____ and runs into the burning house.',
        clozeHe: 'הכבאי אמיץ ורץ לתוך הבית הבוער.',
        answer: 'brave',
        wrong: ['high', 'climb'],
      },
      {
        clozeEn: 'Monkeys can ____ trees very quickly.',
        clozeHe: 'קופים יכולים לטפס על עצים מהר מאוד.',
        answer: 'climb',
        wrong: ['strong', 'brave'],
      },
      {
        clozeEn: 'A good guard dog can ____ the house at night.',
        clozeHe: 'כלב שמירה טוב יכול לשמור על הבית בלילה.',
        answer: 'protect',
        wrong: ['strong', 'high'],
      },
      {
        clozeEn: 'My uncle is very ____. He can lift the heavy box.',
        clozeHe: 'הדוד שלי מאוד חזק. הוא יכול להרים את הקופסה הכבדה.',
        answer: 'strong',
        wrong: ['high', 'climb'],
      },
      {
        clozeEn: 'Can you ____ me with my bag? It is heavy.',
        clozeHe: 'אתם יכולים לעזור לי עם התיק? הוא כבד.',
        answer: 'help',
        wrong: ['fly', 'swim'],
      },
      {
        clozeEn: 'The cheetah is a very ____ animal.',
        clozeHe: 'הברדלס הוא חיה מאוד מהירה.',
        answer: 'fast',
        wrong: ['climb', 'help'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'My sister can swim.',
        wrong: ['My sister can swims.', 'My sister cans swim.'],
        explainHe: 'can לא משתנה, והפועל שאחריו בא בלי s: can swim.',
        hintHe: 'גם עם she, המילה can והפועל שאחריה לא מקבלים s. בדקו את שתי המילים.',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Can your dog jump?',
        wrong: ['Can your dog jumps?', 'Does your dog can jump?'],
        explainHe: 'שאלה עם can מתחילה ב-Can, והפועל בא בלי s: Can your dog jump?',
        hintHe: 'בשאלה על יכולת, can עובר להתחלה. האם צריך עוד מילת שאלה? ומה עם הפועל?',
      },
      {
        questionEn: 'Can you fly? Which answer is correct?',
        correct: 'No, I can’t.',
        wrong: ['No, I can.', 'Yes, I can’t.'],
        explainHe: 'אנשים לא עפים, לכן No, I can’t: "לא" בשני המקומות.',
        hintHe: 'חשבו אם אתם עפים. התשובה צריכה להיות "לא" גם בהתחלה וגם בסוף.',
      },
      {
        questionEn: 'Complete the sentence: "Fish can swim, but they ____ walk."',
        correct: 'can’t',
        wrong: ['can', 'cans'],
        explainHe: 'but (אבל) מראה ניגוד: דגים שוחים אבל לא הולכים, לכן can’t.',
        hintHe: 'המילה but אומרת שהחלק השני הפוך מהראשון. האם דגים הולכים?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We can’t fly like birds.',
        wrong: ['We can’t flying like birds.', 'We not can fly like birds.'],
        explainHe: 'השלילה של can היא can’t, ואחריה פועל בסיסי: can’t fly.',
        hintHe: 'איך אומרים "לא יכול" במילה אחת? ובאיזו צורה בא הפועל אחריה?',
      },
      {
        questionEn: 'Complete the question: "____ he climb the wall?"',
        correct: 'Can',
        wrong: ['Is', 'Are'],
        explainHe: 'שואלים על יכולת עם Can, ואחריו פועל בסיסי: Can he climb?',
        hintHe: 'אחרי המקום הריק בא he ואז פועל בסיסי (climb). איזו מילה שואלת על יכולת?',
      },
    ],
    sentences: [
      { en: 'The brave girl can climb the tall tree.', he: 'הילדה האמיצה יכולה לטפס על העץ הגבוה.' },
      { en: 'Can you help me carry this box?', he: 'אתם יכולים לעזור לי לסחוב את הקופסה הזאת?' },
      { en: 'My little brother can’t swim yet.', he: 'אחי הקטן עוד לא יודע לשחות.' },
      { en: 'Superheroes protect people in the city.', he: 'גיבורי על מגינים על האנשים בעיר.' },
      { en: 'The cat can jump onto the high shelf.', he: 'החתול יכול לקפוץ על המדף הגבוה.' },
      { en: 'He is strong, but he isn’t fast.', he: 'הוא חזק, אבל הוא לא מהיר.' },
    ],
    passages: [
      {
        passageEn:
          'Every Sunday, Yuval goes to a climbing class. He can climb very high walls. His friend Lia is new in the class. She can’t climb high yet, but she is brave. Yuval helps her every week.',
        passageHe:
          'בכל יום ראשון יובל הולך לחוג טיפוס. הוא יכול לטפס על קירות מאוד גבוהים. החברה שלו ליה חדשה בחוג. היא עוד לא יכולה לטפס גבוה, אבל היא אמיצה. יובל עוזר לה בכל שבוע.',
        questions: [
          {
            questionEn: 'When does Yuval go to the climbing class?',
            questionHe: 'מתי יובל הולך לחוג הטיפוס?',
            correct: 'Every Sunday.',
            wrong: ['Every Friday.', 'Every evening.'],
          },
          {
            questionEn: 'What is Lia like?',
            questionHe: 'איך אפשר לתאר את ליה?',
            correct: 'She is brave.',
            wrong: ['She is very fast.', 'She is very tall.'],
          },
          {
            questionEn: 'Who helps Lia every week?',
            questionHe: 'מי עוזר לליה בכל שבוע?',
            correct: 'Yuval.',
            wrong: ['Her mom.', 'The teacher.'],
          },
        ],
      },
      {
        passageEn:
          'Our town has a superhero show in the park. A man in a red costume can lift a car. A woman in a blue costume can jump over a wall. The children can’t believe it. At the end, everyone claps.',
        passageHe:
          'בעיר שלנו יש מופע גיבורי על בפארק. איש בתחפושת אדומה יכול להרים מכונית. אישה בתחפושת כחולה יכולה לקפוץ מעל קיר. הילדים לא מאמינים. בסוף כולם מוחאים כפיים.',
        questions: [
          {
            questionEn: 'Where is the superhero show?',
            questionHe: 'איפה מופע גיבורי העל?',
            correct: 'In the park.',
            wrong: ['At school.', 'In a big house.'],
          },
          {
            questionEn: 'What can the man in red lift?',
            questionHe: 'מה האיש באדום יכול להרים?',
            correct: 'A car.',
            wrong: ['A tree.', 'A wall.'],
          },
          {
            questionEn: 'What can the woman in blue do?',
            questionHe: 'מה האישה בכחול יכולה לעשות?',
            correct: 'Jump over a wall.',
            wrong: ['Lift a car.', 'Fly over the park.'],
          },
        ],
      },
    ],
  },

  // Unit 2: There is / There are, rooms & prepositions of place
  2: {
    vocabulary: [
      {
        clozeEn: 'Mom cooks dinner in the ____.',
        clozeHe: 'אמא מבשלת ארוחת ערב במטבח.',
        answer: 'kitchen',
        wrong: ['mirror', 'carpet'],
      },
      {
        clozeEn: 'I look in the ____ when I brush my hair.',
        clozeHe: 'אני מסתכל במראה כשאני מסרק את השיער.',
        answer: 'mirror',
        wrong: ['sofa', 'carpet'],
      },
      {
        clozeEn: 'There are flowers and trees in our ____.',
        clozeHe: 'יש פרחים ועצים בגינה שלנו.',
        answer: 'garden',
        wrong: ['lamp', 'shelf'],
      },
      {
        clozeEn: 'Turn on the ____. It is dark in here.',
        clozeHe: 'הדליקו את המנורה. חשוך כאן.',
        answer: 'lamp',
        wrong: ['carpet', 'sofa'],
      },
      {
        clozeEn: 'This soft chair is very ____.',
        clozeHe: 'הכיסא הרך הזה מאוד נוח.',
        answer: 'comfortable',
        wrong: ['kitchen', 'bathroom'],
      },
      {
        clozeEn: 'There is a soft ____ on the floor of my room.',
        clozeHe: 'יש שטיח רך על הרצפה בחדר שלי.',
        answer: 'carpet',
        wrong: ['shelf', 'kitchen'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "There ____ a lamp on my desk."',
        correct: 'is',
        wrong: ['are', 'am'],
        explainHe: 'על דבר אחד (a lamp) אומרים There is.',
        hintHe: 'כמה מנורות יש במשפט: אחת או יותר? בחרו לפי זה.',
      },
      {
        questionEn: 'Complete the sentence: "There ____ three windows in the kitchen."',
        correct: 'are',
        wrong: ['is', 'am'],
        explainHe: 'על יותר מדבר אחד (three windows) אומרים There are.',
        hintHe: 'כמה חלונות יש? מילה אחרת באה כשיש יותר מאחד.',
      },
      {
        questionEn: 'Which word means "על"?',
        correct: 'on',
        wrong: ['under', 'in'],
        explainHe: 'on פירושו על: The book is on the table.',
        hintHe: 'חשבו על ספר שמונח על השולחן: הוא נוגע בשולחן מלמעלה.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'The cat is under the sofa.',
        wrong: ['The cat is under sofa the.', 'The cat under is the sofa.'],
        explainHe: 'הסדר הוא: מי, is, מילת המקום, the והדבר: is under the sofa.',
        hintHe: 'אחרי The cat בא is, ואז מילת המקום. איפה צריכה לבוא המילה the?',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Is there a mirror in the bathroom?',
        wrong: ['Is there mirror a in the bathroom?', 'Are there a mirror in the bathroom?'],
        explainHe: 'על דבר אחד שואלים Is there, ואחריו a והדבר.',
        hintHe: 'כמה מראות שואלים עליהן? ובדקו איפה באה המילה a.',
      },
      {
        questionEn: 'Which word means "ליד"?',
        correct: 'next to',
        wrong: ['under', 'on'],
        explainHe: 'next to פירושו ליד: The sofa is next to the lamp.',
        hintHe: 'ליד זה בצד של משהו, לא מעליו ולא מתחתיו. בתשובה יש שתי מילים.',
      },
    ],
    sentences: [
      { en: 'There is a big mirror in the bathroom.', he: 'יש מראה גדולה בחדר האמבטיה.' },
      { en: 'My shoes are under the bed.', he: 'הנעליים שלי מתחת למיטה.' },
      { en: 'There are four chairs in the kitchen.', he: 'יש ארבעה כיסאות במטבח.' },
      { en: 'The lamp is next to the sofa.', he: 'המנורה ליד הספה.' },
      { en: 'Is there a garden behind your house?', he: 'יש גינה מאחורי הבית שלכם?' },
      { en: 'The books are on the top shelf.', he: 'הספרים על המדף העליון.' },
    ],
    passages: [
      {
        passageEn:
          'Yoni has a new bedroom. There is a big bed next to the window. There are two shelves on the wall. His toys are on the shelves. Under the bed, there is a box of games.',
        passageHe:
          'ליוני יש חדר שינה חדש. יש מיטה גדולה ליד החלון. יש שני מדפים על הקיר. הצעצועים שלו על המדפים. מתחת למיטה יש קופסת משחקים.',
        questions: [
          {
            questionEn: 'What is next to the window?',
            questionHe: 'מה יש ליד החלון?',
            correct: 'A big bed.',
            wrong: ['A sofa.', 'A lamp.'],
          },
          {
            questionEn: 'How many shelves are on the wall?',
            questionHe: 'כמה מדפים יש על הקיר?',
            correct: 'Two.',
            wrong: ['Three.', 'One.'],
          },
          {
            questionEn: 'What is under the bed?',
            questionHe: 'מה יש מתחת למיטה?',
            correct: 'A box of games.',
            wrong: ['His shoes.', 'A soft carpet.'],
          },
        ],
      },
      {
        passageEn:
          'Grandma’s house is small but comfortable. In the kitchen, there is a round table. There are flowers in the garden. Grandma reads on the old sofa in the living room. I love visiting her.',
        passageHe:
          'הבית של סבתא קטן אבל נוח. במטבח יש שולחן עגול. יש פרחים בגינה. סבתא קוראת על הספה הישנה בסלון. אני אוהב לבקר אותה.',
        questions: [
          {
            questionEn: 'What is Grandma’s house like?',
            questionHe: 'איך הבית של סבתא?',
            correct: 'Small but comfortable.',
            wrong: ['Big and new.', 'Cold and dark.'],
          },
          {
            questionEn: 'What is in the kitchen?',
            questionHe: 'מה יש במטבח?',
            correct: 'A round table.',
            wrong: ['An old sofa.', 'A big mirror.'],
          },
          {
            questionEn: 'Where does Grandma read?',
            questionHe: 'איפה סבתא קוראת?',
            correct: 'On the old sofa.',
            wrong: ['In the garden.', 'In the kitchen.'],
          },
        ],
      },
    ],
  },

  // Unit 3: Sports, hobbies & Present Simple with I / we / they
  3: {
    vocabulary: [
      {
        clozeEn: 'In ____, you throw the ball into a high basket.',
        clozeHe: 'בכדורסל זורקים את הכדור לסל גבוה.',
        answer: 'basketball',
        wrong: ['tennis', 'team'],
      },
      {
        clozeEn: 'You need a racket to play ____.',
        clozeHe: 'צריך מחבט כדי לשחק טניס.',
        answer: 'tennis',
        wrong: ['football', 'team'],
      },
      {
        clozeEn: 'Our ____ has eleven players.',
        clozeHe: 'בקבוצה שלנו יש אחד עשר שחקנים.',
        answer: 'team',
        wrong: ['winner', 'draw'],
      },
      {
        clozeEn: 'The first runner at the finish line is the ____.',
        clozeHe: 'הרץ הראשון בקו הסיום הוא המנצח.',
        answer: 'winner',
        wrong: ['dance', 'tennis'],
      },
      {
        clozeEn: 'I like to ____ books before I go to sleep.',
        clozeHe: 'אני אוהב לקרוא ספרים לפני שאני הולך לישון.',
        answer: 'read',
        wrong: ['dance', 'football'],
      },
      {
        clozeEn: 'Dana can ____ beautiful pictures of animals.',
        clozeHe: 'דנה יודעת לצייר תמונות יפות של חיות.',
        answer: 'draw',
        wrong: ['sing', 'football'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "They ____ football every Sunday."',
        correct: 'play',
        wrong: ['plays', 'playing'],
        explainHe: 'עם They (הם) הפועל ב-Present Simple בא בלי s: They play.',
        hintHe: 'They הם יותר מאחד, ו-every Sunday מראה הרגל. האם מוסיפים s לפועל עם they?',
      },
      {
        questionEn: 'Can she dance? Which answer is correct?',
        correct: 'Yes, she can.',
        wrong: ['Yes, she is.', 'Yes, can she.'],
        explainHe: 'על שאלה עם Can עונים עם can: Yes, she can.',
        hintHe: 'המילה שפותחת את השאלה חוזרת בסוף התשובה הקצרה. בדקו גם את הסדר.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I play tennis on Mondays.',
        wrong: ['I plays tennis on Mondays.', 'I tennis play on Mondays.'],
        explainHe: 'עם I הפועל בא בלי s, והוא בא לפני המשחק: I play tennis.',
        hintHe: 'האם עם I מוסיפים s לפועל? ואיפה בא הפועל: לפני שם המשחק או אחריו?',
      },
      {
        questionEn: 'Complete the sentence: "My friends can ____ very well."',
        correct: 'sing',
        wrong: ['sings', 'to sing'],
        explainHe: 'אחרי can בא פועל בסיסי, בלי s ובלי to: can sing.',
        hintHe: 'אחרי can הפועל נשאר בצורה הבסיסית. האם מוסיפים לו משהו?',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Can they draw well?',
        wrong: ['Can they draws well?', 'Do they can draw well?'],
        explainHe: 'שאלה עם can מתחילה ב-Can, בלי do, והפועל בא בסיסי.',
        hintHe: 'בשאלה על יכולת לא צריך עוד מילת שאלה. ומה קורה לפועל אחרי can?',
      },
      {
        questionEn: 'Complete the sentence: "Noa and I ____ in the school team."',
        correct: 'are',
        wrong: ['is', 'am'],
        explainHe: 'Noa and I הם שניים, כמו we, לכן are.',
        hintHe: 'Noa and I זה כמו we (אנחנו). איזו מילה מתאימה ל-we?',
      },
    ],
    sentences: [
      { en: 'We play football in the park after school.', he: 'אנחנו משחקים כדורגל בפארק אחרי הלימודים.' },
      { en: 'Can your sister dance and sing?', he: 'אחותך יודעת לרקוד ולשיר?' },
      { en: 'Our team is the winner this year!', he: 'הקבוצה שלנו היא המנצחת השנה!' },
      { en: 'They play tennis on Tuesday and Thursday.', he: 'הם משחקים טניס ביום שלישי וביום חמישי.' },
      { en: 'I can read, but I can’t draw.', he: 'אני יודע לקרוא, אבל אני לא יודע לצייר.' },
      { en: 'My brother throws the ball to me.', he: 'אחי זורק לי את הכדור.' },
    ],
    passages: [
      {
        passageEn:
          'Shai loves sports. On Sunday, he plays basketball with his class. On Wednesday, he plays tennis with his dad. Shai can run fast, but he can’t swim well. He wants to learn this summer.',
        passageHe:
          'שי אוהב ספורט. ביום ראשון הוא משחק כדורסל עם הכיתה שלו. ביום רביעי הוא משחק טניס עם אבא שלו. שי יודע לרוץ מהר, אבל הוא לא יודע לשחות טוב. הוא רוצה ללמוד בקיץ הזה.',
        questions: [
          {
            questionEn: 'What does Shai play on Sunday?',
            questionHe: 'במה שי משחק ביום ראשון?',
            correct: 'Basketball.',
            wrong: ['Tennis.', 'Football.'],
          },
          {
            questionEn: 'Who plays tennis with Shai?',
            questionHe: 'מי משחק טניס עם שי?',
            correct: 'His dad.',
            wrong: ['His class.', 'His sister.'],
          },
          {
            questionEn: 'What can’t Shai do well?',
            questionHe: 'מה שי לא יודע לעשות טוב?',
            correct: 'Swim.',
            wrong: ['Run.', 'Draw.'],
          },
        ],
      },
      {
        passageEn:
          'The school has a talent show today. Michal sings a song about the sea. Two boys dance to fast music. Ella shows her drawings of horses. The winner gets a big gold star.',
        passageHe:
          'היום יש בבית הספר מופע כישרונות. מיכל שרה שיר על הים. שני בנים רוקדים למוזיקה מהירה. אלה מראה את הציורים שלה של סוסים. המנצח מקבל כוכב זהב גדול.',
        questions: [
          {
            questionEn: 'What does Michal do in the show?',
            questionHe: 'מה מיכל עושה במופע?',
            correct: 'She sings a song about the sea.',
            wrong: ['She dances to fast music.', 'She draws horses.'],
          },
          {
            questionEn: 'What does Ella show?',
            questionHe: 'מה אלה מראה?',
            correct: 'Drawings of horses.',
            wrong: ['A song about the sea.', 'A gold star.'],
          },
          {
            questionEn: 'What does the winner get?',
            questionHe: 'מה המנצח מקבל?',
            correct: 'A big gold star.',
            wrong: ['A new ball.', 'A horse.'],
          },
        ],
      },
    ],
  },

  // Unit 4: Healthy food, I like / I don't like, What questions & There is / There are
  4: {
    vocabulary: [
      {
        clozeEn: 'A ____ is red, and we cut it into a salad.',
        clozeHe: 'עגבנייה היא אדומה, ואנחנו חותכים אותה לסלט.',
        answer: 'tomato',
        wrong: ['banana', 'milk'],
      },
      {
        clozeEn: 'I make a sandwich with ____ and cheese.',
        clozeHe: 'אני מכין כריך עם לחם וגבינה.',
        answer: 'bread',
        wrong: ['water', 'basket'],
      },
      {
        clozeEn: 'Please put the oranges in the ____.',
        clozeHe: 'בבקשה לשים את התפוזים בסל.',
        answer: 'basket',
        wrong: ['milk', 'healthy'],
      },
      {
        clozeEn: 'Fruit and vegetables are ____ for your body.',
        clozeHe: 'פירות וירקות בריאים לגוף.',
        answer: 'healthy',
        wrong: ['basket', 'bread'],
      },
      {
        clozeEn: 'The little mouse loves yellow ____.',
        clozeHe: 'העכבר הקטן אוהב גבינה צהובה.',
        answer: 'cheese',
        wrong: ['water', 'carrot'],
      },
      {
        clozeEn: 'Carrots and cucumbers are ____.',
        clozeHe: 'גזרים ומלפפונים הם ירקות.',
        answer: 'vegetables',
        wrong: ['milk', 'basket'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We don’t like cheese.',
        wrong: ['We no like cheese.', 'We not like cheese.'],
        explainHe: 'השלילה ב-Present Simple עם we היא don’t לפני הפועל.',
        hintHe: 'באנגלית לא אומרים "לא" לבד לפני הפועל. איזו מילת שלילה צריך עם we?',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'What do you drink at lunch?',
        wrong: ['What you drink at lunch?', 'What do you drinks at lunch?'],
        explainHe: 'שאלה עם What צריכה do לפני you, והפועל בא בלי s.',
        hintHe: 'אחרי What צריך מילת עזר לפני you. ובדקו את צורת הפועל.',
      },
      {
        questionEn: 'Complete the sentence: "There ____ some milk in the glass."',
        correct: 'is',
        wrong: ['are', 'am'],
        explainHe: 'milk הוא דבר שלא סופרים, ולכן There is some milk.',
        hintHe: 'חלב לא סופרים (אחד, שניים...). מה מתאים לדבר שלא סופרים: כמו אחד או כמו הרבה?',
      },
      {
        questionEn: 'Complete the sentence: "There ____ two bananas on the table."',
        correct: 'are',
        wrong: ['is', 'am'],
        explainHe: 'על שתי בננות (יותר מאחת) אומרים There are.',
        hintHe: 'כמה בננות יש: אחת או יותר? בחרו לפי זה.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'The bread is next to the cheese.',
        wrong: ['The bread is next the cheese.', 'The bread next to is the cheese.'],
        explainHe: 'ליד זה next to בשתי מילים, והן באות אחרי is.',
        hintHe: 'כמה מילים יש ב"ליד" באנגלית? ואיפה בא is במשפט?',
      },
      {
        questionEn: 'Do you like carrots? Which answer is correct?',
        correct: 'No, I don’t.',
        wrong: ['No, I not.', 'No, I doesn’t.'],
        explainHe: 'על שאלה עם Do עונים בשלילה No, I don’t.',
        hintHe: 'השאלה מתחילה ב-Do. איזו צורת שלילה מתאימה ל-I?',
      },
    ],
    sentences: [
      { en: 'I don’t like milk, but I like water.', he: 'אני לא אוהב חלב, אבל אני אוהב מים.' },
      { en: 'There is fresh bread in the basket.', he: 'יש לחם טרי בסל.' },
      { en: 'What do you eat in the evening?', he: 'מה אתם אוכלים בערב?' },
      { en: 'Bananas and apples are healthy fruit.', he: 'בננות ותפוחים הם פירות בריאים.' },
      { en: 'My mom buys tomatoes at the market.', he: 'אמא שלי קונה עגבניות בשוק.' },
      { en: 'There are carrots next to the cheese.', he: 'יש גזרים ליד הגבינה.' },
    ],
    passages: [
      {
        passageEn:
          'Every Friday, Adi and her grandpa go to the market. They buy bread, cheese and fruit. Adi likes bananas, but she doesn’t like tomatoes. Grandpa puts everything in a big basket. Then they walk home together.',
        passageHe:
          'בכל יום שישי עדי וסבא שלה הולכים לשוק. הם קונים לחם, גבינה ופירות. עדי אוהבת בננות, אבל היא לא אוהבת עגבניות. סבא שם הכול בסל גדול. ואז הם הולכים הביתה יחד.',
        questions: [
          {
            questionEn: 'When do Adi and her grandpa go to the market?',
            questionHe: 'מתי עדי וסבא שלה הולכים לשוק?',
            correct: 'Every Friday.',
            wrong: ['Every Sunday.', 'Every evening.'],
          },
          {
            questionEn: 'What doesn’t Adi like?',
            questionHe: 'מה עדי לא אוהבת?',
            correct: 'Tomatoes.',
            wrong: ['Bananas.', 'Cheese.'],
          },
          {
            questionEn: 'Where does Grandpa put everything?',
            questionHe: 'איפה סבא שם הכול?',
            correct: 'In a big basket.',
            wrong: ['In a small bag.', 'On the table.'],
          },
        ],
      },
      {
        passageEn:
          'It is lunch time at school. Gil opens his lunch box. There is a cheese sandwich and a red apple. He drinks a bottle of water. His teacher says that his lunch is very healthy.',
        passageHe:
          'עכשיו הפסקת צהריים בבית הספר. גיל פותח את קופסת האוכל שלו. יש בה כריך גבינה ותפוח אדום. הוא שותה בקבוק מים. המורה שלו אומרת שהאוכל שלו מאוד בריא.',
        questions: [
          {
            questionEn: 'What is in Gil’s lunch box?',
            questionHe: 'מה יש בקופסת האוכל של גיל?',
            correct: 'A cheese sandwich and a red apple.',
            wrong: ['Pizza and juice.', 'Bread and milk.'],
          },
          {
            questionEn: 'What does Gil drink?',
            questionHe: 'מה גיל שותה?',
            correct: 'Water.',
            wrong: ['Milk.', 'Juice.'],
          },
          {
            questionEn: 'What does the teacher say about Gil’s lunch?',
            questionHe: 'מה המורה אומרת על האוכל של גיל?',
            correct: 'It is very healthy.',
            wrong: ['It is too big.', 'It needs more bread.'],
          },
        ],
      },
    ],
  },
};
