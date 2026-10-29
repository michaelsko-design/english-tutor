import type { ExamBankPack } from './types';

/**
 * Grade 5 exam question bank (Feature 43). New questions only: none of them appears in a grade 5
 * mission, mini-lesson, the placement test or a contest. The last 2 items of each list and the
 * second passage are for the mock exam.
 */
export const GRADE_5_EXAM_BANK: ExamBankPack = {
  // Unit 1: Be (am / is / are), have / has & pets
  1: {
    vocabulary: [
      {
        clozeEn: 'My ____ swims around in a small glass bowl.',
        clozeHe: 'דג הזהב שלי שוחה סביב בקערת זכוכית קטנה.',
        answer: 'goldfish',
        wrong: ['puppy', 'parrot'],
      },
      {
        clozeEn: 'A ____ is a baby cat.',
        clozeHe: 'גור חתולים הוא חתול תינוק.',
        answer: 'kitten',
        wrong: ['puppy', 'hamster'],
      },
      {
        clozeEn: 'Our new neighbor is very ____ and always says hello.',
        clozeHe: 'השכן החדש שלנו מאוד נחמד ותמיד אומר שלום.',
        answer: 'friendly',
        wrong: ['fluffy', 'goldfish'],
      },
      {
        clozeEn: 'Blue is my ____ color.',
        clozeHe: 'כחול הוא הצבע האהוב עליי.',
        answer: 'favorite',
        wrong: ['fluffy', 'friendly'],
      },
      {
        clozeEn: 'The ____ sleeps all day and runs on its wheel at night.',
        clozeHe: 'האוגר ישן כל היום ורץ על הגלגל שלו בלילה.',
        answer: 'hamster',
        wrong: ['goldfish', 'parrot'],
      },
      {
        clozeEn: 'The white clouds look soft and ____.',
        clozeHe: 'העננים הלבנים נראים רכים ונעימים למגע.',
        answer: 'fluffy',
        wrong: ['favorite', 'puppy'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "The puppies ____ very playful."',
        correct: 'are',
        wrong: ['is', 'am'],
        explainHe: 'The puppies הם יותר מאחד (they), לכן are.',
        hintHe: 'כמה גורים יש: אחד או יותר? שימו לב ל-s בסוף המילה.',
      },
      {
        questionEn: 'Complete the sentence: "My hamster ____ a tiny nose."',
        correct: 'has',
        wrong: ['have', 'is'],
        explainHe: 'עם he / she / it (my hamster) אומרים has.',
        hintHe: 'My hamster הוא it. איזו צורה של "יש ל..." מתאימה ל-it?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We have two goldfish.',
        wrong: ['We has two goldfish.', 'We are two goldfish.'],
        explainHe: 'עם We אומרים have. We are two goldfish אומר שאנחנו בעצמנו דגים!',
        hintHe: 'רוצים לומר שיש לנו דגים, לא שאנחנו דגים. איזו מילה מתאימה ל-we?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I am not afraid of dogs.',
        wrong: ['I is not afraid of dogs.', 'I not am afraid of dogs.'],
        explainHe: 'עם I אומרים am, ו-not בא אחריו: I am not.',
        hintHe: 'איזו צורה של be מתאימה ל-I? ואיפה בא not: לפניה או אחריה?',
      },
      {
        questionEn: 'Complete the question: "____ your rabbit white?"',
        correct: 'Is',
        wrong: ['Are', 'Has'],
        explainHe: 'your rabbit הוא it, ושואלים עליו עם Is.',
        hintHe: 'your rabbit הוא it, ו-white הוא תיאור. איזו מילת שאלה מתאימה ל-it עם תיאור?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'Our parrots have red feathers.',
        wrong: ['Our parrots has red feathers.', 'Our parrots are have red feathers.'],
        explainHe: 'Our parrots הם they, לכן have, ולא צריך להגיד are לפניו.',
        hintHe: 'כמה תוכים יש? איזו צורה מתאימה ל-they, והאם צריך שתי מילים לפני red?',
      },
    ],
    sentences: [
      { en: 'My kitten has soft gray fur.', he: 'לגור החתולים שלי יש פרווה אפורה ורכה.' },
      { en: 'Is your puppy friendly with other dogs?', he: 'הגור שלכם נחמד לכלבים אחרים?' },
      { en: 'Their parrot is green and very loud.', he: 'התוכי שלהם ירוק ומאוד רועש.' },
      { en: 'The hamster has a little wheel in its cage.', he: 'לאוגר יש גלגל קטן בכלוב שלו.' },
      { en: 'My favorite animal is the rabbit.', he: 'החיה האהובה עליי היא הארנב.' },
      { en: 'We are at the pet shop with Grandpa.', he: 'אנחנו בחנות חיות המחמד עם סבא.' },
    ],
    passages: [
      {
        passageEn:
          'Nir has a fluffy rabbit called Snow. Snow is white and has long ears. Every morning, Nir gives her carrots and fresh water. Snow is friendly and likes to sit on Nir’s lap. Nir’s favorite time of day is playing with Snow.',
        passageHe:
          'לניר יש ארנבת פרוותית בשם סנואו. סנואו לבנה ויש לה אוזניים ארוכות. בכל בוקר ניר נותן לה גזרים ומים טריים. סנואו ידידותית ואוהבת לשבת על הברכיים של ניר. הזמן האהוב על ניר ביום הוא לשחק עם סנואו.',
        questions: [
          {
            questionEn: 'What is the name of Nir’s rabbit?',
            questionHe: 'מה שם הארנבת של ניר?',
            correct: 'Snow.',
            wrong: ['Mochi.', 'Lily.'],
          },
          {
            questionEn: 'What does Nir give Snow every morning?',
            questionHe: 'מה ניר נותן לסנואו בכל בוקר?',
            correct: 'Carrots and fresh water.',
            wrong: ['Milk and bread.', 'Seeds and fruit.'],
          },
          {
            questionEn: 'What does Snow like to do?',
            questionHe: 'מה סנואו אוהבת לעשות?',
            correct: 'Sit on Nir’s lap.',
            wrong: ['Swim in the water.', 'Run in the garden.'],
          },
        ],
      },
      {
        passageEn:
          'The pet shop on our street has many animals. There are three puppies and four kittens. The puppies are loud, but the kittens are quiet. A big parrot says hello to every customer. My little sister has a favorite, a tiny brown hamster.',
        passageHe:
          'בחנות חיות המחמד ברחוב שלנו יש הרבה חיות. יש שלושה גורי כלבים וארבעה גורי חתולים. גורי הכלבים רועשים, אבל גורי החתולים שקטים. תוכי גדול אומר שלום לכל לקוח. לאחותי הקטנה יש חיה אהובה: אוגר חום קטנטן.',
        questions: [
          {
            questionEn: 'How many kittens are there in the shop?',
            questionHe: 'כמה גורי חתולים יש בחנות?',
            correct: 'Four.',
            wrong: ['Three.', 'Two.'],
          },
          {
            questionEn: 'Which animals are quiet?',
            questionHe: 'אילו חיות שקטות?',
            correct: 'The kittens.',
            wrong: ['The puppies.', 'The parrots.'],
          },
          {
            questionEn: 'What does the big parrot do?',
            questionHe: 'מה התוכי הגדול עושה?',
            correct: 'It says hello to every customer.',
            wrong: ['It sleeps all day.', 'It sits on a lap.'],
          },
        ],
      },
    ],
  },

  // Unit 2: Places in town, prepositions, telling time & directions
  2: {
    vocabulary: [
      {
        clozeEn: 'We borrow books from the school ____.',
        clozeHe: 'אנחנו שואלים ספרים מספריית בית הספר.',
        answer: 'library',
        wrong: ['clock', 'supermarket'],
      },
      {
        clozeEn: 'Our guests ____ at six in the evening.',
        clozeHe: 'האורחים שלנו מגיעים בשש בערב.',
        answer: 'arrive',
        wrong: ['straight', 'clock'],
      },
      {
        clozeEn: 'Look at the ____ on the wall. We are late!',
        clozeHe: 'תסתכלו על השעון על הקיר. אנחנו מאחרים!',
        answer: 'clock',
        wrong: ['library', 'left'],
      },
      {
        clozeEn: 'We buy milk and eggs at the ____.',
        clozeHe: 'אנחנו קונים חלב וביצים בסופרמרקט.',
        answer: 'supermarket',
        wrong: ['library', 'clock'],
      },
      {
        clozeEn: 'Don’t turn. Go ____ to the end of the street.',
        clozeHe: 'אל תפנו. לכו ישר עד סוף הרחוב.',
        answer: 'straight',
        wrong: ['left', 'clock'],
      },
      {
        clozeEn: 'Turn ____ at the bank, not right.',
        clozeHe: 'פנו שמאלה ליד הבנק, לא ימינה.',
        answer: 'left',
        wrong: ['straight', 'arrive'],
      },
    ],
    grammar: [
      {
        questionEn: 'The clock shows 11:00. What time is it?',
        correct: 'It is eleven o’clock.',
        wrong: ['It is half past eleven.', 'It is eleven half.'],
        explainHe: 'כשהמחוג הגדול על 12 זו שעה עגולה: eleven o’clock.',
        hintHe: 'המחוג הגדול על 12. איך אומרים שעה עגולה באנגלית?',
      },
      {
        questionEn: 'The clock shows 6:30. What time is it?',
        correct: 'It is half past six.',
        wrong: ['It is half past seven.', 'It is six o’clock.'],
        explainHe: '6:30 היא חצי שעה אחרי שש: half past six.',
        hintHe: 'המחוג הגדול על 6. אומרים "חצי אחרי" ואז את השעה שכבר עברה, לא את הבאה.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'The park is next to the school.',
        wrong: ['The park is next the school.', 'The park next to is the school.'],
        explainHe: 'ליד זה next to בשתי מילים, והן באות אחרי is.',
        hintHe: 'כמה מילים יש ב"ליד" באנגלית? ואיפה בא is?',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Where is the swimming pool?',
        wrong: ['Where the swimming pool is?', 'Where is swimming pool the?'],
        explainHe: 'בשאלה is בא מיד אחרי Where, ו-the לפני המקום.',
        hintHe: 'בשאלה עם Where, מה בא מיד אחריה? ואיפה צריכה לבוא המילה the?',
      },
      {
        questionEn: 'Complete the sentence: "The keys are ____ the box." (בתוך)',
        correct: 'in',
        wrong: ['on', 'next to'],
        explainHe: 'בתוך זה in: The keys are in the box.',
        hintHe: 'בסוגריים כתוב בתוך. איזו מילת מקום אומרת שמשהו נמצא פנימה?',
      },
      {
        questionEn: 'Complete the sentence: "We go to school ____ eight o’clock."',
        correct: 'at',
        wrong: ['in', 'on'],
        explainHe: 'לפני שעה אומרים at: at eight o’clock.',
        hintHe: 'לפני שעה מדויקת באה מילת יחס מיוחדת. היא לא אותה מילה של ימים או חודשים.',
      },
    ],
    sentences: [
      { en: 'The bus stop is next to the bakery.', he: 'תחנת האוטובוס ליד המאפייה.' },
      { en: 'We arrive at school at eight o’clock.', he: 'אנחנו מגיעים לבית הספר בשמונה.' },
      { en: 'Turn right at the library and go straight.', he: 'פנו ימינה ליד הספרייה ולכו ישר.' },
      { en: 'The museum opens at half past nine.', he: 'המוזיאון נפתח בתשע וחצי.' },
      { en: 'Where is the nearest supermarket?', he: 'איפה הסופרמרקט הכי קרוב?' },
      { en: 'The big clock is above the door.', he: 'השעון הגדול מעל הדלת.' },
    ],
    passages: [
      {
        passageEn:
          'Shira wants to go to the swimming pool. She asks a police officer for help. He says, go straight and turn right at the library. The pool is next to the post office. Shira arrives at half past three.',
        passageHe:
          'שירה רוצה ללכת לבריכה. היא מבקשת עזרה משוטר. הוא אומר: לכי ישר ופני ימינה ליד הספרייה. הבריכה נמצאת ליד הדואר. שירה מגיעה בשלוש וחצי.',
        questions: [
          {
            questionEn: 'Who does Shira ask for help?',
            questionHe: 'ממי שירה מבקשת עזרה?',
            correct: 'A police officer.',
            wrong: ['Her teacher.', 'A bus driver.'],
          },
          {
            questionEn: 'Where is the pool?',
            questionHe: 'איפה הבריכה?',
            correct: 'Next to the post office.',
            wrong: ['Next to the library.', 'Behind the school.'],
          },
          {
            questionEn: 'What time does Shira arrive?',
            questionHe: 'באיזו שעה שירה מגיעה?',
            correct: 'At half past three.',
            wrong: ['At three o’clock.', 'At half past four.'],
          },
        ],
      },
      {
        passageEn:
          'On Friday, my family goes to the supermarket at ten o’clock. It is on the corner of our street, next to the bank. Dad takes a big cart. We buy bread, fruit and cheese. We go home at half past eleven.',
        passageHe:
          'ביום שישי המשפחה שלי הולכת לסופרמרקט בעשר. הוא בפינת הרחוב שלנו, ליד הבנק. אבא לוקח עגלה גדולה. אנחנו קונים לחם, פירות וגבינה. אנחנו חוזרים הביתה באחת עשרה וחצי.',
        questions: [
          {
            questionEn: 'When does the family go to the supermarket?',
            questionHe: 'מתי המשפחה הולכת לסופרמרקט?',
            correct: 'At ten o’clock on Friday.',
            wrong: ['At half past ten on Sunday.', 'At eleven o’clock on Friday.'],
          },
          {
            questionEn: 'What is next to the supermarket?',
            questionHe: 'מה נמצא ליד הסופרמרקט?',
            correct: 'The bank.',
            wrong: ['The library.', 'The park.'],
          },
          {
            questionEn: 'What does Dad take?',
            questionHe: 'מה אבא לוקח?',
            correct: 'A big cart.',
            wrong: ['A big bag.', 'A basket of fruit.'],
          },
        ],
      },
    ],
  },

  // Unit 3: Daily routine, Present Simple with he / she / it & do / does
  3: {
    vocabulary: [
      {
        clozeEn: 'I ____ my teeth after every meal.',
        clozeHe: 'אני מצחצח את השיניים אחרי כל ארוחה.',
        answer: 'brush',
        wrong: ['sleep', 'dinner'],
      },
      {
        clozeEn: 'We eat ____ in the evening with the whole family.',
        clozeHe: 'אנחנו אוכלים ארוחת ערב בערב עם כל המשפחה.',
        answer: 'dinner',
        wrong: ['breakfast', 'homework'],
      },
      {
        clozeEn: 'Our teacher gives us math ____ for tomorrow.',
        clozeHe: 'המורה שלנו נותנת לנו שיעורי בית בחשבון למחר.',
        answer: 'homework',
        wrong: ['lunch', 'bed'],
      },
      {
        clozeEn: 'At noon, we eat ____ in the school dining room.',
        clozeHe: 'בצהריים אנחנו אוכלים ארוחת צהריים בחדר האוכל של בית הספר.',
        answer: 'lunch',
        wrong: ['homework', 'brush'],
      },
      {
        clozeEn: 'Babies ____ a lot during the day.',
        clozeHe: 'תינוקות ישנים הרבה במשך היום.',
        answer: 'sleep',
        wrong: ['brush', 'breakfast'],
      },
      {
        clozeEn: 'Every morning, I eat ____ before school.',
        clozeHe: 'בכל בוקר אני אוכל ארוחת בוקר לפני בית הספר.',
        answer: 'breakfast',
        wrong: ['dinner', 'homework'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "My mom ____ coffee every morning."',
        correct: 'drinks',
        wrong: ['drink', 'drinking'],
        explainHe: 'ב-Present Simple עם he / she / it מוסיפים s לפועל: My mom drinks.',
        hintHe: 'My mom היא she, ו-every morning מראה הרגל. מה קורה לפועל עם she?',
      },
      {
        questionEn: 'Complete the sentence: "Ari ____ his homework after lunch."',
        correct: 'does',
        wrong: ['do', 'dos'],
        explainHe: 'עם he הפועל do הופך ל-does (עם es).',
        hintHe: 'Ari הוא he. הפועל do מקבל עם he תוספת מיוחדת: לא רק s.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'She brushes her hair every morning.',
        wrong: ['She brush her hair every morning.', 'She brushs her hair every morning.'],
        explainHe: 'פועל שנגמר ב-sh מקבל es עם he / she / it: brushes.',
        hintHe: 'עם she מוסיפים לפועל סוף. בדקו איך כותבים אותו כשהפועל נגמר ב-sh.',
      },
      {
        questionEn: 'Complete the question: "What time ____ your sister wake up?"',
        correct: 'does',
        wrong: ['do', 'is'],
        explainHe: 'your sister היא she, ועם she שואלים עם does ואחריו פועל בסיסי.',
        hintHe: 'your sister היא she, והפועל wake בא בלי s. איזו מילת שאלה מתאימה ל-she?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'He has lunch at one o’clock.',
        wrong: ['He have lunch at one o’clock.', 'He haves lunch at one o’clock.'],
        explainHe: 'עם he / she / it הפועל have הופך ל-has.',
        hintHe: 'עם he הפועל have משתנה, אבל לא על ידי הוספת s רגילה.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'My dad doesn’t sleep after lunch.',
        wrong: ['My dad don’t sleep after lunch.', 'My dad doesn’t sleeps after lunch.'],
        explainHe: 'עם he משתמשים ב-doesn’t, והפועל שאחריו בא בלי s.',
        hintHe: 'בדקו שני דברים: איזו מילת שלילה מתאימה ל-he, ומה קורה לפועל שאחריה.',
      },
    ],
    sentences: [
      { en: 'Noam wakes up at half past six.', he: 'נועם מתעורר בשש וחצי.' },
      { en: 'She brushes her teeth before bed.', he: 'היא מצחצחת שיניים לפני השינה.' },
      { en: 'My brother does his homework in his room.', he: 'אחי מכין את שיעורי הבית בחדר שלו.' },
      { en: 'We eat lunch at school every day.', he: 'אנחנו אוכלים ארוחת צהריים בבית הספר כל יום.' },
      { en: 'Does your father cook dinner?', he: 'אבא שלכם מבשל ארוחת ערב?' },
      { en: 'The baby sleeps after lunch.', he: 'התינוק ישן אחרי ארוחת הצהריים.' },
    ],
    passages: [
      {
        passageEn:
          'Gali is a nurse at a big hospital. She wakes up at five o’clock every morning. She drinks coffee and eats a quick breakfast. Her work starts at seven. She comes home at three and sleeps for one hour.',
        passageHe:
          'גלי אחות בבית חולים גדול. היא מתעוררת בחמש בכל בוקר. היא שותה קפה ואוכלת ארוחת בוקר מהירה. העבודה שלה מתחילה בשבע. היא חוזרת הביתה בשלוש וישנה שעה אחת.',
        questions: [
          {
            questionEn: 'What is Gali’s job?',
            questionHe: 'מה העבודה של גלי?',
            correct: 'She is a nurse.',
            wrong: ['She is a teacher.', 'She is a cook.'],
          },
          {
            questionEn: 'When does Gali wake up?',
            questionHe: 'מתי גלי מתעוררת?',
            correct: 'At five o’clock.',
            wrong: ['At seven o’clock.', 'At three o’clock.'],
          },
          {
            questionEn: 'What does Gali do when she comes home?',
            questionHe: 'מה גלי עושה כשהיא חוזרת הביתה?',
            correct: 'She sleeps for one hour.',
            wrong: ['She eats breakfast.', 'She drinks coffee.'],
          },
        ],
      },
      {
        passageEn:
          'Itay’s day is very busy. He goes to school at eight and has lunch at one. After lunch, he goes to his judo class. In the evening, he does his homework and eats dinner. He goes to bed at half past nine.',
        passageHe:
          'היום של איתי עמוס מאוד. הוא הולך לבית הספר בשמונה ואוכל ארוחת צהריים באחת. אחרי ארוחת הצהריים הוא הולך לחוג ג׳ודו. בערב הוא מכין שיעורי בית ואוכל ארוחת ערב. הוא הולך לישון בתשע וחצי.',
        questions: [
          {
            questionEn: 'When does Itay have lunch?',
            questionHe: 'מתי איתי אוכל ארוחת צהריים?',
            correct: 'At one.',
            wrong: ['At twelve.', 'At three.'],
          },
          {
            questionEn: 'Where does Itay go after lunch?',
            questionHe: 'לאן איתי הולך אחרי ארוחת הצהריים?',
            correct: 'To his judo class.',
            wrong: ['To bed.', 'To the park.'],
          },
          {
            questionEn: 'What time does Itay go to bed?',
            questionHe: 'באיזו שעה איתי הולך לישון?',
            correct: 'At half past nine.',
            wrong: ['At nine o’clock.', 'At half past eight.'],
          },
        ],
      },
    ],
  },

  // Unit 4: Hobbies, frequency words & Wh- questions
  4: {
    vocabulary: [
      {
        clozeEn: 'We watch a new movie at the ____.',
        clozeHe: 'אנחנו צופים בסרט חדש בקולנוע.',
        answer: 'cinema',
        wrong: ['guitar', 'popcorn'],
      },
      {
        clozeEn: 'You need a ____ to get into the show.',
        clozeHe: 'צריך כרטיס כדי להיכנס להופעה.',
        answer: 'ticket',
        wrong: ['popcorn', 'guitar'],
      },
      {
        clozeEn: 'My uncle plays the ____ and sings.',
        clozeHe: 'הדוד שלי מנגן בגיטרה ושר.',
        answer: 'guitar',
        wrong: ['popcorn', 'cinema'],
      },
      {
        clozeEn: 'On the ____, we don’t go to school.',
        clozeHe: 'בסוף השבוע אנחנו לא הולכים לבית הספר.',
        answer: 'weekend',
        wrong: ['ticket', 'cinema'],
      },
      {
        clozeEn: 'I ____ eat breakfast. I eat it every single day.',
        clozeHe: 'אני תמיד אוכל ארוחת בוקר. אני אוכל אותה כל יום ויום.',
        answer: 'always',
        wrong: ['never', 'usually'],
      },
      {
        clozeEn: 'Fish can’t live out of water, so they ____ walk.',
        clozeHe: 'דגים לא יכולים לחיות מחוץ למים, ולכן הם אף פעם לא הולכים.',
        answer: 'never',
        wrong: ['always', 'usually'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We usually go swimming on Saturday.',
        wrong: ['We go usually swimming on Saturday.', 'We usually goes swimming on Saturday.'],
        explainHe: 'מילת תדירות באה לפני הפועל, ועם we הפועל בלי s: We usually go.',
        hintHe: 'איפה באה מילת התדירות: לפני הפועל או אחריו? ובדקו את הפועל עם we.',
      },
      {
        questionEn: 'Complete the question: "____ do you go on Friday?" – "To the beach."',
        correct: 'Where',
        wrong: ['When', 'What'],
        explainHe: 'התשובה היא מקום (To the beach), לכן שואלים Where.',
        hintHe: 'התשובה היא מקום. איזו מילת שאלה שואלת על מקום?',
      },
      {
        questionEn: 'Complete the question: "____ do you play the guitar?" – "On Mondays."',
        correct: 'When',
        wrong: ['Where', 'Who'],
        explainHe: 'התשובה היא זמן (On Mondays), לכן שואלים When.',
        hintHe: 'התשובה היא יום בשבוע. איזו מילת שאלה שואלת על זמן?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'She never drinks coffee.',
        wrong: ['She never drink coffee.', 'She drinks never coffee.'],
        explainHe: 'never בא לפני הפועל, ועם she הפועל מקבל s: never drinks.',
        hintHe: 'מילת התדירות באה לפני הפועל. ומה קורה לפועל עם she?',
      },
      {
        questionEn: 'Complete the question: "____ is your best friend?" – "My cousin Yael."',
        correct: 'Who',
        wrong: ['What', 'Where'],
        explainHe: 'התשובה היא אדם (My cousin Yael), לכן שואלים Who.',
        hintHe: 'התשובה היא אדם. איזו מילת שאלה שואלת על אנשים?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'He is always happy on Friday.',
        wrong: ['He always is happy on Friday.', 'He is happy always on Friday.'],
        explainHe: 'עם is, מילת התדירות באה אחריו: is always happy.',
        hintHe: 'עם הפועל be (am / is / are) מילת התדירות לא באה לפניו, אלא מיד אחריו.',
      },
    ],
    sentences: [
      { en: 'We always buy popcorn at the cinema.', he: 'אנחנו תמיד קונים פופקורן בקולנוע.' },
      { en: 'My sister usually draws in the afternoon.', he: 'אחותי בדרך כלל מציירת אחר הצהריים.' },
      { en: 'I never swim in cold water.', he: 'אני אף פעם לא שוחה במים קרים.' },
      { en: 'Where do you usually go on the weekend?', he: 'לאן אתם בדרך כלל הולכים בסוף השבוע?' },
      { en: 'He plays the guitar every Friday evening.', he: 'הוא מנגן בגיטרה בכל יום שישי בערב.' },
      { en: 'How much is a cinema ticket?', he: 'כמה עולה כרטיס לקולנוע?' },
    ],
    passages: [
      {
        passageEn:
          'Roni’s weekend is always fun. On Friday morning, she usually swims at the pool. In the afternoon, she draws pictures with her grandma. On Saturday, she never wakes up early. She reads in bed until ten.',
        passageHe:
          'סוף השבוע של רוני תמיד כיפי. ביום שישי בבוקר היא בדרך כלל שוחה בבריכה. אחר הצהריים היא מציירת עם סבתא שלה. בשבת היא אף פעם לא קמה מוקדם. היא קוראת במיטה עד עשר.',
        questions: [
          {
            questionEn: 'Where does Roni usually swim?',
            questionHe: 'איפה רוני בדרך כלל שוחה?',
            correct: 'At the pool.',
            wrong: ['At the beach.', 'At school.'],
          },
          {
            questionEn: 'Who does Roni draw with?',
            questionHe: 'עם מי רוני מציירת?',
            correct: 'Her grandma.',
            wrong: ['Her mom.', 'Her friend.'],
          },
          {
            questionEn: 'What does Roni never do on Saturday?',
            questionHe: 'מה רוני אף פעם לא עושה בשבת?',
            correct: 'Wake up early.',
            wrong: ['Read in bed.', 'Draw pictures.'],
          },
        ],
      },
      {
        passageEn:
          'On Thursday, the school takes the fifth grade to the cinema. The teacher buys tickets for everyone. The children watch a funny movie about a dog. Some children eat popcorn, but Tal never eats it. After the movie, they go back to school by bus.',
        passageHe:
          'ביום חמישי בית הספר לוקח את שכבת כיתות ה׳ לקולנוע. המורה קונה כרטיסים לכולם. הילדים צופים בסרט מצחיק על כלב. חלק מהילדים אוכלים פופקורן, אבל טל אף פעם לא אוכלת. אחרי הסרט הם חוזרים לבית הספר באוטובוס.',
        questions: [
          {
            questionEn: 'Who buys the tickets?',
            questionHe: 'מי קונה את הכרטיסים?',
            correct: 'The teacher.',
            wrong: ['The children.', 'Tal’s mom.'],
          },
          {
            questionEn: 'What is the movie about?',
            questionHe: 'על מה הסרט?',
            correct: 'A dog.',
            wrong: ['A cat.', 'A school bus.'],
          },
          {
            questionEn: 'How do they go back to school?',
            questionHe: 'איך הם חוזרים לבית הספר?',
            correct: 'By bus.',
            wrong: ['On foot.', 'By train.'],
          },
        ],
      },
    ],
  },
};
