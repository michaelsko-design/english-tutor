import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-plus pack's grade 2 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_PLUS_GRADE_2_EXAM_BANK: ExamBankPack = {
  // Unit 21: vehicles & a describing word before the noun
  21: {
    vocabulary: [
      {
        clozeEn: 'I ride my ____ to the park.',
        clozeHe: 'אני רוכב/ת על האופניים שלי לפארק.',
        answer: 'bike',
        wrong: ['ship', 'pilot'],
      },
      {
        clozeEn: 'The ____ flies in the sky.',
        clozeHe: 'המטוס טס בשמיים.',
        answer: 'plane',
        wrong: ['van', 'bike'],
      },
      {
        clozeEn: 'A snail is very ____.',
        clozeHe: 'חילזון הוא איטי מאוד.',
        answer: 'slow',
        wrong: ['fast', 'bus'],
      },
      {
        clozeEn: 'The ____ flies the big plane.',
        clozeHe: 'הטייס מטיס את המטוס הגדול.',
        answer: 'pilot',
        wrong: ['train', 'stop'],
      },
      {
        clozeEn: 'We sail on a big ____.',
        clozeHe: 'אנחנו מפליגים באונייה גדולה.',
        answer: 'ship',
        wrong: ['car', 'bike'],
      },
      {
        clozeEn: 'The ____ goes up to the stars.',
        clozeHe: 'החללית עולה אל הכוכבים.',
        answer: 'rocket',
        wrong: ['bus', 'van'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which one is correct?',
        correct: 'a big white van',
        wrong: ['a van big white', 'big a white van'],
        explainHe: 'מילים שמתארות באות לפני הדבר: a big white van.',
        hintHe: 'באנגלית מילים שמתארות עומדות לפני הדבר. בדקו מה עומד בסוף.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'The rocket is fast.',
        wrong: ['The rocket fast is.', 'Is the rocket fast.'],
        explainHe: 'קודם הדבר, אחר כך is, ואז המילה שמתארת: The rocket is fast.',
        hintHe: 'במשפט רגיל הפועל בא מיד אחרי מי שמדברים עליו.',
      },
      {
        questionEn: 'Which word means the opposite of fast?',
        correct: 'slow',
        wrong: ['big', 'red'],
        explainHe: 'fast זה מהיר, ו-slow זה איטי.',
        hintHe: 'חשבו על צב ועל מטוס: מה ההפך של מהיר?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I see two cars.',
        wrong: ['I see two car.', 'I see car two.'],
        explainHe: 'יותר ממכונית אחת: cars עם s, והמספר בא לפני.',
        hintHe: 'כמה מכוניות יש? בדקו את סוף המילה ואת מקום המספר.',
      },
      {
        questionEn: 'What is this? (a train) Which answer is correct?',
        correct: 'It is a train.',
        wrong: ['It is train a.', 'Is it a train.'],
        explainHe: 'עונים It is a train: It is, ואז a והדבר.',
        hintHe: 'תשובה מתחילה ב-It is. מה בא אחריו?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'This is my new bike.',
        wrong: ['This is my bike new.', 'This my is new bike.'],
        explainHe: 'המילה שמתארת new באה לפני הדבר: my new bike.',
        hintHe: 'מילה שמתארת עומדת לפני הדבר. בדקו גם את הסדר This, is, my.',
      },
    ],
    sentences: [
      { en: 'The pilot has a blue cap.', he: 'לטייס יש כובע כחול.' },
      { en: 'I go to school on a yellow bus.', he: 'אני נוסע/ת לבית הספר באוטובוס צהוב.' },
      { en: 'The fast train goes to Tel Aviv.', he: 'הרכבת המהירה נוסעת לתל אביב.' },
      { en: 'My dad has a big white van.', he: 'לאבא שלי יש מיניבוס לבן וגדול.' },
      { en: 'The little ship is very slow.', he: 'האונייה הקטנה איטית מאוד.' },
      { en: 'We wait at the stop for the bus.', he: 'אנחנו מחכים בתחנה לאוטובוס.' },
    ],
    passages: [
      {
        passageEn: 'Dana goes to the beach with Dad. They go in a red car. The car is fast. At the beach, Dana sees a big white ship.',
        passageHe: 'דנה נוסעת לחוף הים עם אבא. הם נוסעים במכונית אדומה. המכונית מהירה. בחוף, דנה רואה אונייה לבנה גדולה.',
        questions: [
          {
            questionEn: 'Who goes to the beach with Dana?',
            questionHe: 'מי נוסע לחוף עם דנה?',
            correct: 'Dad.',
            wrong: ['Mom.', 'Grandma.'],
          },
          {
            questionEn: 'What color is the fast car?',
            questionHe: 'באיזה צבע המכונית המהירה?',
            correct: 'Red.',
            wrong: ['White.', 'Blue.'],
          },
          {
            questionEn: 'What does Dana see at the beach?',
            questionHe: 'מה דנה רואה בחוף?',
            correct: 'A big white ship.',
            wrong: ['A red car.', 'A fast plane.'],
          },
        ],
      },
      {
        passageEn: 'Omer has a toy rocket. It is blue and little. His sister has a toy plane. The plane is green. They play in the yard.',
        passageHe: 'לעומר יש חללית צעצוע. היא כחולה וקטנה. לאחות שלו יש מטוס צעצוע. המטוס ירוק. הם משחקים בחצר.',
        questions: [
          {
            questionEn: 'What toy does Omer have?',
            questionHe: 'איזה צעצוע יש לעומר?',
            correct: 'A toy rocket.',
            wrong: ['A toy plane.', 'A toy bus.'],
          },
          {
            questionEn: 'What color is the toy plane?',
            questionHe: 'באיזה צבע מטוס הצעצוע?',
            correct: 'Green.',
            wrong: ['Blue.', 'Red.'],
          },
          {
            questionEn: 'Where do they play?',
            questionHe: 'איפה הם משחקים?',
            correct: 'In the yard.',
            wrong: ['On a ship.', 'At the bus stop.'],
          },
        ],
      },
    ],
  },
  // Unit 22: the playground & in / on / under
  22: {
    vocabulary: [
      {
        clozeEn: 'In summer the ____ is very hot.',
        clozeHe: 'בקיץ השמש חמה מאוד.',
        answer: 'sun',
        wrong: ['ant', 'basket'],
      },
      {
        clozeEn: 'The little ____ is under the leaf.',
        clozeHe: 'הנמלה הקטנה מתחת לעלה.',
        answer: 'ant',
        wrong: ['tree', 'goal'],
      },
      {
        clozeEn: 'The ball goes into the ____!',
        clozeHe: 'הכדור נכנס לשער!',
        answer: 'goal',
        wrong: ['flower', 'cap'],
      },
      {
        clozeEn: 'The ____ sings in the tree.',
        clozeHe: 'הציפור שרה על העץ.',
        answer: 'bird',
        wrong: ['sand', 'kite'],
      },
      {
        clozeEn: 'I put on my ____ in the sun.',
        clozeHe: 'אני שם/ה את כובע המצחייה שלי בשמש.',
        answer: 'cap',
        wrong: ['balloon', 'ant'],
      },
      {
        clozeEn: 'Mom has a ____ for the picnic.',
        clozeHe: 'לאמא יש סלסלה לפיקניק.',
        answer: 'basket',
        wrong: ['bird', 'sand'],
      },
    ],
    grammar: [
      {
        questionEn: 'The pen is inside the bag. Which sentence is correct?',
        correct: 'The pen is in the bag.',
        wrong: ['The pen is under the bag.', 'The pen in is the bag.'],
        explainHe: 'in פירושו "בתוך": העט בתוך התיק.',
        hintHe: 'העט נמצא בפנים. איזו מילה אומרת "בתוך"? בדקו גם את הסדר.',
      },
      {
        questionEn: 'The doll sits on top of the bed. Which sentence is correct?',
        correct: 'The doll is on the bed.',
        wrong: ['The doll is under the bed.', 'The doll on the bed is.'],
        explainHe: 'on פירושו "על": הבובה על המיטה.',
        hintHe: 'הבובה למעלה. איזו מילה אומרת "על"? בדקו גם איפה הפועל.',
      },
      {
        questionEn: 'The dog is below the table. Which sentence is correct?',
        correct: 'The dog is under the table.',
        wrong: ['The dog is on the table.', 'The dog under is the table.'],
        explainHe: 'under פירושו "מתחת": הכלב מתחת לשולחן.',
        hintHe: 'הכלב למטה, והשולחן מעליו. איזו מילה מתאימה?',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Where is the balloon?',
        wrong: ['Where the balloon is?', 'Is where the balloon?'],
        explainHe: 'שואלים Where is the balloon: קודם Where, אחר כך is.',
        hintHe: 'שאלה מתחילה במילת השאלה. בדקו מה בא אחריה.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I see two flowers.',
        wrong: ['I see two flower.', 'I two see flowers.'],
        explainHe: 'יותר מפרח אחד: flowers עם s, והמספר בא לפני.',
        hintHe: 'כמה פרחים יש? בדקו את סוף המילה ואת מקום המספר.',
      },
      {
        questionEn: 'Which one is correct?',
        correct: 'a pink balloon',
        wrong: ['a balloon pink', 'pink a balloon'],
        explainHe: 'הצבע בא לפני הדבר: a pink balloon.',
        hintHe: 'באנגלית הצבע עומד לפני הדבר. ומה עומד ראשון?',
      },
    ],
    sentences: [
      { en: 'The bird is in the big tree.', he: 'הציפור בעץ הגדול.' },
      { en: 'My kite is on the sand.', he: 'העפיפון שלי על החול.' },
      { en: 'A red flower is under the tree.', he: 'פרח אדום מתחת לעץ.' },
      { en: 'My friend has a green cap.', he: 'לחבר שלי יש כובע מצחייה ירוק.' },
      { en: 'The ants are in the basket!', he: 'הנמלים בתוך הסלסלה!' },
      { en: 'Where is my yellow balloon?', he: 'איפה הבלון הצהוב שלי?' },
    ],
    passages: [
      {
        passageEn: 'It is a hot day. Lior and his friend play in the park. Lior has a yellow kite. The kite is in the tree! His friend helps him.',
        passageHe: 'יום חם. ליאור והחבר שלו משחקים בפארק. לליאור יש עפיפון צהוב. העפיפון בתוך העץ! החבר שלו עוזר לו.',
        questions: [
          {
            questionEn: 'What color kite does Lior have?',
            questionHe: 'באיזה צבע העפיפון של ליאור?',
            correct: 'Yellow.',
            wrong: ['Red.', 'Green.'],
          },
          {
            questionEn: 'Where is the yellow kite?',
            questionHe: 'איפה העפיפון הצהוב?',
            correct: 'In the tree.',
            wrong: ['On the sand.', 'In the basket.'],
          },
          {
            questionEn: 'Who helps Lior?',
            questionHe: 'מי עוזר לליאור?',
            correct: 'His friend.',
            wrong: ['His dad.', 'His sister.'],
          },
        ],
      },
      {
        passageEn: 'We have a picnic in the sun. The basket is on the sand. An ant is under the basket. My cap is on my head.',
        passageHe: 'יש לנו פיקניק בשמש. הסלסלה על החול. נמלה מתחת לסלסלה. כובע המצחייה שלי על הראש שלי.',
        questions: [
          {
            questionEn: 'Where is the basket?',
            questionHe: 'איפה הסלסלה?',
            correct: 'On the sand.',
            wrong: ['In the tree.', 'Under the cap.'],
          },
          {
            questionEn: 'What is under the basket?',
            questionHe: 'מה מתחת לסלסלה?',
            correct: 'An ant.',
            wrong: ['A bird.', 'A kite.'],
          },
          {
            questionEn: 'What is on my head?',
            questionHe: 'מה על הראש שלי?',
            correct: 'My cap.',
            wrong: ['A basket.', 'An ant.'],
          },
        ],
      },
    ],
  },
};
