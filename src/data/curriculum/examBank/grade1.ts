import type { ExamBankPack } from './types';

/**
 * Grade 1 exam question bank (Feature 43). New questions only: none of them appears in a grade 1
 * mission, mini-lesson, the placement test or a contest. The last 2 items of each list and the
 * second passage are for the mock exam. Very short sentences and passages, picture-friendly words.
 */
export const GRADE_1_EXAM_BANK: ExamBankPack = {
  // Unit 7 (after the letters and blending units): letter sounds, greetings, colors & animals
  7: {
    vocabulary: [
      {
        clozeEn: 'The ____ says meow.',
        clozeHe: 'החתול אומר מיאו.',
        answer: 'cat',
        wrong: ['egg', 'blue'],
      },
      {
        clozeEn: 'The ____ says quack.',
        clozeHe: 'הברווז אומר קוואק.',
        answer: 'duck',
        wrong: ['red', 'hello'],
      },
      {
        clozeEn: 'The sky is ____ today.',
        clozeHe: 'השמיים כחולים היום.',
        answer: 'blue',
        wrong: ['egg', 'duck'],
      },
      {
        clozeEn: 'A little ____ says woof.',
        clozeHe: 'כלב קטן אומר הב.',
        answer: 'dog',
        wrong: ['happy', 'egg'],
      },
      {
        clozeEn: 'Say ____ to your new friend.',
        clozeHe: 'תגידו שלום לחבר החדש.',
        answer: 'hello',
        wrong: ['fish', 'red'],
      },
      {
        clozeEn: 'Noa smiles. She is very ____.',
        clozeHe: 'נועה מחייכת. היא מאוד שמחה.',
        answer: 'happy',
        wrong: ['egg', 'fish'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which word starts with the sound /h/ like hello?',
        correct: 'hat',
        wrong: ['cat', 'dog'],
        explainHe: 'hat מתחילה בצליל /h/, כמו hello.',
        hintHe: 'אמרו כל מילה בקול. באיזו מילה הצליל הראשון כמו בהתחלה של hello?',
      },
      {
        questionEn: 'Which word starts with the sound /f/ like fish?',
        correct: 'five',
        wrong: ['sun', 'bag'],
        explainHe: 'five מתחילה בצליל /f/, כמו fish.',
        hintHe: 'אמרו fish בקול, ואז כל מילה. איזו מילה מתחילה באותו צליל?',
      },
      {
        questionEn: 'Which word starts with the sound /e/ like egg?',
        correct: 'elephant',
        wrong: ['dog', 'cat'],
        explainHe: 'elephant מתחילה בצליל /e/, כמו egg.',
        hintHe: 'הקשיבו לצליל הראשון של egg. חפשו מילה שמתחילה באותו צליל.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I see a blue fish.',
        wrong: ['I see a fish blue.', 'I see blue a fish.'],
        explainHe: 'באנגלית הצבע בא לפני הדבר: a blue fish.',
        hintHe: 'באנגלית שמים את הצבע לפני שם הדבר. איפה הצבע בכל משפט?',
      },
      {
        questionEn: 'Which word is a color?',
        correct: 'red',
        wrong: ['duck', 'egg'],
        explainHe: 'red הוא צבע (אדום). duck הוא ברווז ו-egg היא ביצה.',
        hintHe: 'חפשו מילה שאפשר לראות בקשת בענן.',
      },
      {
        questionEn: 'What do we say when we meet a friend?',
        correct: 'Hello!',
        wrong: ['Goodbye!', 'Thank you!'],
        explainHe: 'כשנפגשים אומרים Hello. את Goodbye אומרים כשהולכים.',
        hintHe: 'חשבו: מה אומרים בהתחלה, כשרק נפגשים?',
      },
    ],
    sentences: [
      { en: 'The duck is in the pond.', he: 'הברווז בבריכה.' },
      { en: 'I have a blue egg.', he: 'יש לי ביצה כחולה.' },
      { en: 'Hello, I am a happy dog.', he: 'שלום, אני כלב שמח.' },
      { en: 'The red fish can swim.', he: 'הדג האדום יודע לשחות.' },
      { en: 'My cat is very happy.', he: 'החתול שלי מאוד שמח.' },
      { en: 'Look at the blue duck.', he: 'תסתכלו על הברווז הכחול.' },
    ],
    passages: [
      {
        passageEn: 'Tom has a little dog. The dog is happy. It sees a duck. The duck is blue.',
        passageHe: 'לתום יש כלב קטן. הכלב שמח. הוא רואה ברווז. הברווז כחול.',
        questions: [
          {
            questionEn: 'What does Tom have?',
            questionHe: 'מה יש לתום?',
            correct: 'A little dog.',
            wrong: ['A big fish.', 'A red egg.'],
          },
          {
            questionEn: 'How does the dog feel?',
            questionHe: 'איך הכלב מרגיש?',
            correct: 'Happy.',
            wrong: ['Sad.', 'Tired.'],
          },
          {
            questionEn: 'What color is the duck?',
            questionHe: 'באיזה צבע הברווז?',
            correct: 'Blue.',
            wrong: ['Red.', 'Green.'],
          },
        ],
      },
      {
        passageEn: 'Noa is at the lake. She sees a red fish. She sees two ducks. Noa is happy.',
        passageHe: 'נועה ליד האגם. היא רואה דג אדום. היא רואה שני ברווזים. נועה שמחה.',
        questions: [
          {
            questionEn: 'Where is Noa?',
            questionHe: 'איפה נועה?',
            correct: 'At the lake.',
            wrong: ['At school.', 'At home.'],
          },
          {
            questionEn: 'What color is the fish?',
            questionHe: 'באיזה צבע הדג?',
            correct: 'Red.',
            wrong: ['Blue.', 'Green.'],
          },
          {
            questionEn: 'How many ducks does Noa see?',
            questionHe: 'כמה ברווזים נועה רואה?',
            correct: 'Two.',
            wrong: ['One.', 'Three.'],
          },
        ],
      },
    ],
  },

  // Unit 8: Numbers 1–10, plural s & goodbye
  8: {
    vocabulary: [
      {
        clozeEn: 'The little ____ sings in the tree.',
        clozeHe: 'הציפור הקטנה שרה על העץ.',
        answer: 'bird',
        wrong: ['moon', 'ten'],
      },
      {
        clozeEn: 'The ____ is yellow and very hot.',
        clozeHe: 'השמש צהובה ומאוד חמה.',
        answer: 'sun',
        wrong: ['bird', 'eight'],
      },
      {
        clozeEn: 'Two and one make ____.',
        clozeHe: 'שתיים ועוד אחת זה שלוש.',
        answer: 'three',
        wrong: ['ten', 'eight'],
      },
      {
        clozeEn: 'I have ____ fingers on one hand.',
        clozeHe: 'יש לי חמש אצבעות ביד אחת.',
        answer: 'five',
        wrong: ['ten', 'eight'],
      },
      {
        clozeEn: 'At night I see the ____ in the sky.',
        clozeHe: 'בלילה אני רואה את הירח בשמיים.',
        answer: 'moon',
        wrong: ['five', 'friend'],
      },
      {
        clozeEn: 'Dan is my best ____.',
        clozeHe: 'דן הוא החבר הכי טוב שלי.',
        answer: 'friend',
        wrong: ['sun', 'six'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which number comes after two?',
        correct: 'three',
        wrong: ['one', 'five'],
        explainHe: 'סופרים one, two, three. אחרי two בא three.',
        hintHe: 'ספרו בקול מההתחלה: one, two... מה בא אחר כך?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I have two stars.',
        wrong: ['I have two star.', 'I two have stars.'],
        explainHe: 'כשיש יותר מאחד מוסיפים s: two stars.',
        hintHe: 'כשיש יותר מאחד, מה מוסיפים בסוף המילה? ובדקו גם את סדר המילים.',
      },
      {
        questionEn: 'Which number comes before ten?',
        correct: 'nine',
        wrong: ['eight', 'six'],
        explainHe: 'סופרים eight, nine, ten. לפני ten בא nine.',
        hintHe: 'ספרו בקול עד ten. איזה מספר אומרים רגע לפני?',
      },
      {
        questionEn: 'Which word means more than one bird?',
        correct: 'birds',
        wrong: ['bird', 'a bird'],
        explainHe: 'birds עם s בסוף אומר יותר מציפור אחת.',
        hintHe: 'יותר מאחד באנגלית מקבל אות נוספת בסוף המילה.',
      },
      {
        questionEn: 'Your friend goes home. What do you say?',
        correct: 'Goodbye!',
        wrong: ['Hello!', 'Thank you!'],
        explainHe: 'כשחבר הולך הביתה אומרים Goodbye (להתראות).',
        hintHe: 'חשבו: מה אומרים בסוף, כשנפרדים?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We see six birds.',
        wrong: ['We see six bird.', 'We six see birds.'],
        explainHe: 'אחרי מספר גדול מאחד מוסיפים s, והמספר בא לפני הדבר: six birds.',
        hintHe: 'בדקו שני דברים: האם יש s בסוף, והאם המספר בא לפני הדבר.',
      },
    ],
    sentences: [
      { en: 'I see one big moon.', he: 'אני רואה ירח גדול אחד.' },
      { en: 'Five birds are in the tree.', he: 'חמש ציפורים על העץ.' },
      { en: 'My friend has ten stars.', he: 'לחבר שלי יש עשרה כוכבים.' },
      { en: 'Goodbye, sun! Hello, moon!', he: 'להתראות, שמש! שלום, ירח!' },
      { en: 'I count eight little birds.', he: 'אני סופר שמונה ציפורים קטנות.' },
      { en: 'The sun is big and hot.', he: 'השמש גדולה וחמה.' },
    ],
    passages: [
      {
        passageEn: 'It is night. Dan looks at the sky. He sees the moon. He sees five stars.',
        passageHe: 'עכשיו לילה. דן מסתכל על השמיים. הוא רואה את הירח. הוא רואה חמישה כוכבים.',
        questions: [
          {
            questionEn: 'What does Dan look at?',
            questionHe: 'על מה דן מסתכל?',
            correct: 'The sky.',
            wrong: ['The sun.', 'A bird.'],
          },
          {
            questionEn: 'How many stars does Dan see?',
            questionHe: 'כמה כוכבים דן רואה?',
            correct: 'Five.',
            wrong: ['Three.', 'Ten.'],
          },
          {
            questionEn: 'Is it day or night?',
            questionHe: 'עכשיו יום או לילה?',
            correct: 'Night.',
            wrong: ['Day.', 'Morning.'],
          },
        ],
      },
      {
        passageEn: 'Maya is at the park with her friend. They see three birds. The sun is hot. Then they say goodbye.',
        passageHe: 'מאיה בפארק עם החברה שלה. הן רואות שלוש ציפורים. השמש חמה. ואז הן אומרות להתראות.',
        questions: [
          {
            questionEn: 'Who is Maya with?',
            questionHe: 'עם מי מאיה?',
            correct: 'Her friend.',
            wrong: ['Her cat.', 'Her dad.'],
          },
          {
            questionEn: 'How many birds do they see?',
            questionHe: 'כמה ציפורים הן רואות?',
            correct: 'Three.',
            wrong: ['One.', 'Six.'],
          },
          {
            questionEn: 'What do they say at the end?',
            questionHe: 'מה הן אומרות בסוף?',
            correct: 'Goodbye.',
            wrong: ['Hello.', 'Thank you.'],
          },
        ],
      },
    ],
  },

  // Unit 9: My body, classroom objects & classroom commands
  9: {
    vocabulary: [
      {
        clozeEn: 'I smell a flower with my ____.',
        clozeHe: 'אני מריח פרח עם האף שלי.',
        answer: 'nose',
        wrong: ['pen', 'chair'],
      },
      {
        clozeEn: 'I hear music with my ____.',
        clozeHe: 'אני שומע מוזיקה עם האוזן שלי.',
        answer: 'ear',
        wrong: ['bag', 'book'],
      },
      {
        clozeEn: 'I write with a ____.',
        clozeHe: 'אני כותב עם עט.',
        answer: 'pen',
        wrong: ['nose', 'ear'],
      },
      {
        clozeEn: 'Please sit on the ____.',
        clozeHe: 'בבקשה לשבת על הכיסא.',
        answer: 'chair',
        wrong: ['pen', 'eye'],
      },
      {
        clozeEn: 'Please ____ your book.',
        clozeHe: 'בבקשה לפתוח את הספר.',
        answer: 'open',
        wrong: ['ear', 'nose'],
      },
      {
        clozeEn: 'I put my books in my ____.',
        clozeHe: 'אני שם את הספרים שלי בתיק.',
        answer: 'bag',
        wrong: ['eye', 'nose'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which part do we use to see?',
        correct: 'eyes',
        wrong: ['ears', 'hands'],
        explainHe: 'רואים עם העיניים: eyes.',
        hintHe: 'חשבו: עם מה מסתכלים על תמונה?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I have a red pen.',
        wrong: ['I have red a pen.', 'I a have red pen.'],
        explainHe: 'הסדר הוא I have, ואז a, הצבע והדבר: a red pen.',
        hintHe: 'קודם מי ומה עושים, ואחר כך a, הצבע והדבר.',
      },
      {
        questionEn: 'Which one is correct?',
        correct: 'a book',
        wrong: ['a books', 'book a'],
        explainHe: 'a בא לפני דבר אחד: a book.',
        hintHe: 'המילה a אומרת "אחד". היא באה לפני או אחרי? ומה עם s?',
      },
      {
        questionEn: 'The teacher says "Stand up". What do you do?',
        correct: 'I stand.',
        wrong: ['I sit.', 'I sleep.'],
        explainHe: 'Stand up אומר לקום ולעמוד: I stand.',
        hintHe: 'המורה מבקשת לקום. מה עושים כשקמים מהכיסא?',
      },
      {
        questionEn: 'Which word starts with the sound /b/ like book?',
        correct: 'bag',
        wrong: ['pen', 'chair'],
        explainHe: 'bag מתחילה בצליל /b/, כמו book.',
        hintHe: 'אמרו book בקול, ואז כל מילה. איזו מתחילה באותו צליל?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We have two hands.',
        wrong: ['We have two hand.', 'We has two hands.'],
        explainHe: 'עם We אומרים have, ושתי ידיים הן hands עם s.',
        hintHe: 'בדקו שני דברים: מה בא אחרי We, והאם יש s כשיש שתיים.',
      },
    ],
    sentences: [
      { en: 'Open your bag, please.', he: 'פתחו את התיק, בבקשה.' },
      { en: 'I touch my nose.', he: 'אני נוגע באף שלי.' },
      { en: 'Listen to the teacher, please.', he: 'הקשיבו למורה, בבקשה.' },
      { en: 'My pen is in my bag.', he: 'העט שלי בתיק שלי.' },
      { en: 'I sit on my chair.', he: 'אני יושב על הכיסא שלי.' },
      { en: 'I have two big ears.', he: 'יש לי שתי אוזניים גדולות.' },
    ],
    passages: [
      {
        passageEn: 'Ben is at school. He has a blue bag. In the bag, he has a pen. He sits on a chair.',
        passageHe: 'בן בבית הספר. יש לו תיק כחול. בתיק יש לו עט. הוא יושב על כיסא.',
        questions: [
          {
            questionEn: 'Where is Ben?',
            questionHe: 'איפה בן?',
            correct: 'At school.',
            wrong: ['At the park.', 'At home.'],
          },
          {
            questionEn: 'What color is the bag?',
            questionHe: 'באיזה צבע התיק?',
            correct: 'Blue.',
            wrong: ['Red.', 'Green.'],
          },
          {
            questionEn: 'What does Ben have in the bag?',
            questionHe: 'מה יש לבן בתיק?',
            correct: 'A pen.',
            wrong: ['A cat.', 'A cake.'],
          },
        ],
      },
      {
        passageEn: 'Dana is in class. The teacher says to listen. Dana listens. Then she opens her book.',
        passageHe: 'דנה בכיתה. המורה אומרת להקשיב. דנה מקשיבה. ואז היא פותחת את הספר שלה.',
        questions: [
          {
            questionEn: 'Where is Dana?',
            questionHe: 'איפה דנה?',
            correct: 'In class.',
            wrong: ['In the park.', 'At the zoo.'],
          },
          {
            questionEn: 'Who says to listen?',
            questionHe: 'מי אומרת להקשיב?',
            correct: 'The teacher.',
            wrong: ['Dana.', 'Mom.'],
          },
          {
            questionEn: 'What does Dana open?',
            questionHe: 'מה דנה פותחת?',
            correct: 'Her book.',
            wrong: ['Her bag.', 'The door.'],
          },
        ],
      },
    ],
  },

  // Unit 10: Fruit, toys, eat & drink
  10: {
    vocabulary: [
      {
        clozeEn: 'A ____ is long and yellow.',
        clozeHe: 'בננה ארוכה וצהובה.',
        answer: 'banana',
        wrong: ['kite', 'water'],
      },
      {
        clozeEn: 'I fly my ____ in the wind.',
        clozeHe: 'אני מעיף את העפיפון שלי ברוח.',
        answer: 'kite',
        wrong: ['cake', 'banana'],
      },
      {
        clozeEn: 'I ____ milk every morning.',
        clozeHe: 'אני שותה חלב בכל בוקר.',
        answer: 'drink',
        wrong: ['doll', 'ball'],
      },
      {
        clozeEn: 'Dad drives a red ____.',
        clozeHe: 'אבא נוהג במכונית אדומה.',
        answer: 'car',
        wrong: ['grapes', 'cake'],
      },
      {
        clozeEn: 'We ____ a big birthday cake.',
        clozeHe: 'אנחנו אוכלים עוגת יום הולדת גדולה.',
        answer: 'eat',
        wrong: ['kite', 'doll'],
      },
      {
        clozeEn: 'The fish lives in the ____.',
        clozeHe: 'הדג חי במים.',
        answer: 'water',
        wrong: ['cake', 'doll'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We like green grapes.',
        wrong: ['We likes green grapes.', 'Green grapes we like.'],
        explainHe: 'עם We אומרים like בלי s, והסדר הוא We like ואז הדבר.',
        hintHe: 'קודם בא We, ואחריו מה אוהבים. האם עם We מוסיפים s?',
      },
      {
        questionEn: 'Which word is a fruit?',
        correct: 'orange',
        wrong: ['kite', 'doll'],
        explainHe: 'orange הוא תפוז, פרי. kite הוא עפיפון ו-doll היא בובה.',
        hintHe: 'חשבו: מה אפשר לקטוף מעץ ולאכול?',
      },
      {
        questionEn: 'Which one is correct?',
        correct: 'an orange',
        wrong: ['a orange', 'an kite'],
        explainHe: 'לפני מילה שמתחילה בצליל של תנועה (a, e, i, o, u) אומרים an: an orange.',
        hintHe: 'an בא לפני מילה שמתחילה בצליל a, e, i, o, u. באיזו אות מתחילה כל מילה?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I play with my doll.',
        wrong: ['I play my with doll.', 'I plays with my doll.'],
        explainHe: 'אומרים I play with my doll: play בלי s, ואחריו with my.',
        hintHe: 'בדקו את הסדר: play, ואז with, ואז my והצעצוע.',
      },
      {
        questionEn: 'Which word is a drink?',
        correct: 'water',
        wrong: ['cake', 'ball'],
        explainHe: 'water הם מים, ושותים אותם. cake אוכלים ו-ball משחקים.',
        hintHe: 'חשבו: מה שמים בכוס ושותים כשצמאים?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We eat cake.',
        wrong: ['We drink cake.', 'We eats cake.'],
        explainHe: 'עוגה אוכלים, ועם We אומרים eat בלי s.',
        hintHe: 'חשבו: עוגה אוכלים או שותים? ובדקו אם יש s מיותר.',
      },
    ],
    sentences: [
      { en: 'I eat a green apple.', he: 'אני אוכל תפוח ירוק.' },
      { en: 'My doll is in the car.', he: 'הבובה שלי במכונית.' },
      { en: 'We drink cold water.', he: 'אנחנו שותים מים קרים.' },
      { en: 'The kite is red and blue.', he: 'העפיפון אדום וכחול.' },
      { en: 'Grapes are green and sweet.', he: 'ענבים ירוקים ומתוקים.' },
      { en: 'I play ball with Dad.', he: 'אני משחק בכדור עם אבא.' },
    ],
    passages: [
      {
        passageEn: 'It is a sunny day. Noa and Dan are in the park. Noa has a kite. Dan has a ball.',
        passageHe: 'זה יום שמשי. נועה ודן בפארק. לנועה יש עפיפון. לדן יש כדור.',
        questions: [
          {
            questionEn: 'What is the day like?',
            questionHe: 'איך היום?',
            correct: 'Sunny.',
            wrong: ['Rainy.', 'Cold.'],
          },
          {
            questionEn: 'What does Noa have?',
            questionHe: 'מה יש לנועה?',
            correct: 'A kite.',
            wrong: ['A ball.', 'A doll.'],
          },
          {
            questionEn: 'What does Dan have?',
            questionHe: 'מה יש לדן?',
            correct: 'A ball.',
            wrong: ['A kite.', 'A car.'],
          },
        ],
      },
      {
        passageEn: 'Mom has a big basket. In the basket, there are apples and grapes. We eat the grapes. We drink water.',
        passageHe: 'לאמא יש סל גדול. בסל יש תפוחים וענבים. אנחנו אוכלים את הענבים. אנחנו שותים מים.',
        questions: [
          {
            questionEn: 'What does Mom have with her?',
            questionHe: 'מה יש לאמא איתה?',
            correct: 'A big basket.',
            wrong: ['A red car.', 'A little doll.'],
          },
          {
            questionEn: 'What do we eat?',
            questionHe: 'מה אנחנו אוכלים?',
            correct: 'The grapes.',
            wrong: ['The cake.', 'The basket.'],
          },
          {
            questionEn: 'What do we drink?',
            questionHe: 'מה אנחנו שותים?',
            correct: 'Water.',
            wrong: ['Milk.', 'Juice.'],
          },
        ],
      },
    ],
  },
};
