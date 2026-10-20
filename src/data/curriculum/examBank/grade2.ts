import type { ExamBankPack } from './types';

/**
 * Grade 2 exam question bank (Feature 43). New questions only: none of them appears in a grade 2
 * mission, mini-lesson, the placement test or a contest. The last 2 items of each list and the
 * second passage are for the mock exam. Very short sentences and passages, picture-friendly words.
 */
export const GRADE_2_EXAM_BANK: ExamBankPack = {
  // Unit 1: Toys, CVC words, rhymes & "What is this?"
  1: {
    vocabulary: [
      {
        clozeEn: 'My soft ____ sleeps with me at night.',
        clozeHe: 'הדובי הרך שלי ישן איתי בלילה.',
        answer: 'teddy',
        wrong: ['bat', 'box'],
      },
      {
        clozeEn: 'I wear a ____ on my head.',
        clozeHe: 'אני חובש כובע על הראש.',
        answer: 'hat',
        wrong: ['box', 'bat'],
      },
      {
        clozeEn: 'An elephant is very ____.',
        clozeHe: 'פיל הוא מאוד גדול.',
        answer: 'big',
        wrong: ['bag', 'hat'],
      },
      {
        clozeEn: 'A mouse is very ____.',
        clozeHe: 'עכבר הוא מאוד קטן.',
        answer: 'little',
        wrong: ['box', 'hat'],
      },
      {
        clozeEn: 'Hit the ball hard with your ____!',
        clozeHe: 'תכו חזק בכדור עם המחבט!',
        answer: 'bat',
        wrong: ['cat', 'teddy'],
      },
      {
        clozeEn: 'All my toys are in a big ____.',
        clozeHe: 'כל הצעצועים שלי בקופסה גדולה.',
        answer: 'box',
        wrong: ['cat', 'little'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which word rhymes with box?',
        correct: 'fox',
        wrong: ['bag', 'doll'],
        explainHe: 'box ו-fox נגמרות באותו צליל: ox.',
        hintHe: 'אמרו box בקול. איזו מילה נגמרת באותו צליל בדיוק?',
      },
      {
        questionEn: 'Which word rhymes with ball?',
        correct: 'tall',
        wrong: ['bed', 'cup'],
        explainHe: 'ball ו-tall נגמרות באותו צליל: all.',
        hintHe: 'הקשיבו לסוף של ball. חפשו מילה עם אותו סוף.',
      },
      {
        questionEn: 'What is this? (a box) Which answer is correct?',
        correct: 'It is a box.',
        wrong: ['It is box a.', 'Is it a box.'],
        explainHe: 'עונים It is a box: קודם It is, ואז a והדבר.',
        hintHe: 'תשובה מתחילה ב-It is, ואחריו a והדבר. בדקו את הסדר.',
      },
      {
        questionEn: 'Which word has the short a sound, like cat?',
        correct: 'bag',
        wrong: ['big', 'box'],
        explainHe: 'ב-bag שומעים את אותו צליל a קצר כמו ב-cat.',
        hintHe: 'אמרו cat בקול. באיזו מילה שומעים את אותו צליל באמצע?',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'What is in your hand?',
        wrong: ['What in your hand is?', 'Is what in your hand?'],
        explainHe: 'שואלים What is in your hand: מילת השאלה, ואז is, ואז איפה.',
        hintHe: 'שאלה מתחילה במילת השאלה. מה בא מיד אחריה?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I have a little teddy.',
        wrong: ['I have a teddy little.', 'I little have a teddy.'],
        explainHe: 'מילת התיאור באה לפני הדבר: a little teddy.',
        hintHe: 'באנגלית מילה שמתארת (כמו גדול או קטן) באה לפני הדבר. איפה היא בכל משפט?',
      },
    ],
    sentences: [
      { en: 'My doll has a little hat.', he: 'לבובה שלי יש כובע קטן.' },
      { en: 'I have a big blue bag.', he: 'יש לי תיק כחול גדול.' },
      { en: 'What is in your bag?', he: 'מה יש בתיק שלכם?' },
      { en: 'The cat naps on the mat.', he: 'החתול נמנם על השטיחון.' },
      { en: 'It is a little teddy.', he: 'זה דובי קטן.' },
      { en: 'Put the bat in the box.', he: 'שימו את המחבט בקופסה.' },
    ],
    passages: [
      {
        passageEn: 'Lily has a little box. In the box, she has a doll. The doll has a pink hat. Lily loves her doll.',
        passageHe: 'ללילי יש קופסה קטנה. בקופסה יש לה בובה. לבובה יש כובע ורוד. לילי אוהבת את הבובה שלה.',
        questions: [
          {
            questionEn: 'What does Lily have?',
            questionHe: 'מה יש ללילי?',
            correct: 'A little box.',
            wrong: ['A big bag.', 'A red ball.'],
          },
          {
            questionEn: 'What is in the little box?',
            questionHe: 'מה יש בקופסה הקטנה?',
            correct: 'A doll.',
            wrong: ['A cat.', 'A bat.'],
          },
          {
            questionEn: 'What color is the hat?',
            questionHe: 'באיזה צבע הכובע?',
            correct: 'Pink.',
            wrong: ['Blue.', 'Green.'],
          },
        ],
      },
      {
        passageEn: 'Sam has a big bag. He opens it. He sees a bat and a ball. He plays with his friend.',
        passageHe: 'לסאם יש תיק גדול. הוא פותח אותו. הוא רואה מחבט וכדור. הוא משחק עם החבר שלו.',
        questions: [
          {
            questionEn: 'What does Sam open?',
            questionHe: 'מה סאם פותח?',
            correct: 'A big bag.',
            wrong: ['A little box.', 'A door.'],
          },
          {
            questionEn: 'What does Sam see in the bag?',
            questionHe: 'מה סאם רואה בתיק?',
            correct: 'A bat and a ball.',
            wrong: ['A cat and a hat.', 'A doll and a box.'],
          },
          {
            questionEn: 'Who does Sam play with?',
            questionHe: 'עם מי סאם משחק?',
            correct: 'His friend.',
            wrong: ['His cat.', 'His mom.'],
          },
        ],
      },
    ],
  },

  // Unit 2: Family & healthy snacks
  2: {
    vocabulary: [
      {
        clozeEn: 'A ____ is orange, and rabbits love it.',
        clozeHe: 'גזר הוא כתום, וארנבים אוהבים אותו.',
        answer: 'carrot',
        wrong: ['milk', 'baby'],
      },
      {
        clozeEn: 'The ____ is very small and drinks milk.',
        clozeHe: 'התינוק מאוד קטן ושותה חלב.',
        answer: 'baby',
        wrong: ['carrot', 'banana'],
      },
      {
        clozeEn: 'Dad, Mom and I are a happy ____.',
        clozeHe: 'אבא, אמא ואני משפחה שמחה.',
        answer: 'family',
        wrong: ['banana', 'milk'],
      },
      {
        clozeEn: 'Mom is my mother, and Dad is my ____.',
        clozeHe: 'אמא היא האמא שלי, ואבא הוא האבא שלי.',
        answer: 'father',
        wrong: ['sister', 'carrot'],
      },
      {
        clozeEn: 'White ____ is good for strong teeth.',
        clozeHe: 'חלב לבן טוב לשיניים חזקות.',
        answer: 'milk',
        wrong: ['brother', 'apple'],
      },
      {
        clozeEn: 'My ____ is a girl. She is ten.',
        clozeHe: 'אחותי היא ילדה. היא בת עשר.',
        answer: 'sister',
        wrong: ['brother', 'carrot'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We like yellow bananas.',
        wrong: ['We likes yellow bananas.', 'We yellow bananas like.'],
        explainHe: 'עם We אומרים like בלי s, ואחריו מה אוהבים.',
        hintHe: 'האם עם We מוסיפים s לפועל? ובדקו איפה בא הפועל.',
      },
      {
        questionEn: 'Which one is correct?',
        correct: 'a banana',
        wrong: ['an banana', 'a bananas'],
        explainHe: 'banana מתחילה ב-b, לכן a. ובננה אחת היא בלי s.',
        hintHe: 'an בא רק לפני צליל של a, e, i, o, u. ובננה אחת – עם s או בלי?',
      },
      {
        questionEn: 'Which word means more than one carrot?',
        correct: 'carrots',
        wrong: ['carrot', 'a carrot'],
        explainHe: 'carrots עם s בסוף אומר יותר מגזר אחד.',
        hintHe: 'יותר מאחד באנגלית מקבל אות נוספת בסוף המילה.',
      },
      {
        questionEn: 'Which word is a family member?',
        correct: 'brother',
        wrong: ['carrot', 'milk'],
        explainHe: 'brother הוא אח, חלק מהמשפחה. carrot הוא גזר ו-milk הוא חלב.',
        hintHe: 'חפשו מילה של אדם שגר איתכם בבית.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'My father is tall.',
        wrong: ['My father are tall.', 'My father tall is.'],
        explainHe: 'על אדם אחד אומרים is: My father is tall.',
        hintHe: 'מדברים על אדם אחד. איזו מילה מתאימה לאחד, ואיפה היא באה?',
      },
      {
        questionEn: 'Which word starts with the sound /m/ like milk?',
        correct: 'mother',
        wrong: ['father', 'baby'],
        explainHe: 'mother מתחילה בצליל /m/, כמו milk.',
        hintHe: 'אמרו milk בקול, ואז כל מילה. איזו מתחילה באותו צליל?',
      },
    ],
    sentences: [
      { en: 'My baby brother is little.', he: 'אחי התינוק קטן.' },
      { en: 'We eat carrots and apples.', he: 'אנחנו אוכלים גזר ותפוחים.' },
      { en: 'This is my big family.', he: 'זאת המשפחה הגדולה שלי.' },
      { en: 'My sister likes cold milk.', he: 'אחותי אוהבת חלב קר.' },
      { en: 'Dad has a yellow banana.', he: 'לאבא יש בננה צהובה.' },
      { en: 'I love my mother and father.', he: 'אני אוהב את אמא ואבא שלי.' },
    ],
    passages: [
      {
        passageEn: 'This is Ron. He has a big family. He has a sister and a baby brother. His sister likes carrots.',
        passageHe: 'זה רון. יש לו משפחה גדולה. יש לו אחות ואח תינוק. אחותו אוהבת גזר.',
        questions: [
          {
            questionEn: 'What kind of family does Ron have?',
            questionHe: 'איזו משפחה יש לרון?',
            correct: 'A big family.',
            wrong: ['A small family.', 'A new family.'],
          },
          {
            questionEn: 'Who is in Ron’s family?',
            questionHe: 'מי במשפחה של רון?',
            correct: 'A sister and a baby brother.',
            wrong: ['Two sisters.', 'A big brother.'],
          },
          {
            questionEn: 'What does his sister like?',
            questionHe: 'מה אחותו אוהבת?',
            correct: 'Carrots.',
            wrong: ['Milk.', 'Bananas.'],
          },
        ],
      },
      {
        passageEn: 'It is morning. Mom drinks milk. Dad eats a banana. The baby eats an apple.',
        passageHe: 'עכשיו בוקר. אמא שותה חלב. אבא אוכל בננה. התינוק אוכל תפוח.',
        questions: [
          {
            questionEn: 'What does Mom drink?',
            questionHe: 'מה אמא שותה?',
            correct: 'Milk.',
            wrong: ['Water.', 'Juice.'],
          },
          {
            questionEn: 'What does Dad eat?',
            questionHe: 'מה אבא אוכל?',
            correct: 'A banana.',
            wrong: ['An apple.', 'A carrot.'],
          },
          {
            questionEn: 'Who eats an apple?',
            questionHe: 'מי אוכל תפוח?',
            correct: 'The baby.',
            wrong: ['Mom.', 'Dad.'],
          },
        ],
      },
    ],
  },

  // Unit 3: Farm & pet animals, "Is it a...?"
  3: {
    vocabulary: [
      {
        clozeEn: 'Every morning, the farmer gets milk from the ____.',
        clozeHe: 'בכל בוקר החקלאי מקבל חלב מהפרה.',
        answer: 'cow',
        wrong: ['frog', 'fish'],
      },
      {
        clozeEn: 'A ____ is green and jumps.',
        clozeHe: 'צפרדע ירוקה וקופצת.',
        answer: 'frog',
        wrong: ['cow', 'sheep'],
      },
      {
        clozeEn: 'The ____ is pink and says oink.',
        clozeHe: 'החזיר ורוד ואומר אוינק.',
        answer: 'pig',
        wrong: ['hen', 'horse'],
      },
      {
        clozeEn: 'A ____ has long ears and eats carrots.',
        clozeHe: 'לארנב יש אוזניים ארוכות והוא אוכל גזר.',
        answer: 'rabbit',
        wrong: ['fish', 'hen'],
      },
      {
        clozeEn: 'I ride a big brown ____.',
        clozeHe: 'אני רוכב על סוס חום גדול.',
        answer: 'horse',
        wrong: ['fish', 'frog'],
      },
      {
        clozeEn: 'The ____ gives us eggs.',
        clozeHe: 'התרנגולת נותנת לנו ביצים.',
        answer: 'hen',
        wrong: ['pig', 'cow'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which word rhymes with hen?',
        correct: 'ten',
        wrong: ['pig', 'cow'],
        explainHe: 'hen ו-ten נגמרות באותו צליל: en.',
        hintHe: 'אמרו hen בקול. איזו מילה נגמרת באותו צליל?',
      },
      {
        questionEn: 'Which word rhymes with fish?',
        correct: 'dish',
        wrong: ['frog', 'sheep'],
        explainHe: 'fish ו-dish נגמרות באותו צליל: ish.',
        hintHe: 'הקשיבו לסוף של fish. חפשו מילה עם אותו סוף.',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Is it a horse?',
        wrong: ['Is it horse a?', 'A horse is it?'],
        explainHe: 'שאלה מתחילה ב-Is it, ואחריה a והחיה: Is it a horse?',
        hintHe: 'שאלה של כן או לא מתחילה ב-Is. מה בא אחריו, ואיפה המילה a?',
      },
      {
        questionEn: 'Is it a cow? (Yes) Which answer is correct?',
        correct: 'Yes, it is a cow.',
        wrong: ['Yes, it is cow a.', 'Yes, is it a cow.'],
        explainHe: 'בתשובה הסדר הוא it is, ואחריו a והחיה: Yes, it is a cow.',
        hintHe: 'בשאלה is בא ראשון, אבל בתשובה הסדר מתהפך. ואיפה המילה a?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'The cow is black and white.',
        wrong: ['The cow are black and white.', 'The cow is black and whites.'],
        explainHe: 'על חיה אחת אומרים is, וצבע לא מקבל s.',
        hintHe: 'מדובר בפרה אחת. איזו מילה מתאימה לאחת? והאם צבעים מקבלים s?',
      },
      {
        questionEn: 'Is it a frog? (It is a fish.) Which answer is correct?',
        correct: 'No, it is a fish.',
        wrong: ['Yes, it is a fish.', 'No, it is a frog.'],
        explainHe: 'זה לא צפרדע, לכן No, ואז אומרים מה זה באמת: it is a fish.',
        hintHe: 'מה כתוב בסוגריים? האם זה מה שנשאלתם? ואז בדקו איזו חיה זאת באמת.',
      },
    ],
    sentences: [
      { en: 'The hen is on the farm.', he: 'התרנגולת בחווה.' },
      { en: 'Is it a little pig?', he: 'האם זה חזיר קטן?' },
      { en: 'My rabbit eats green grass.', he: 'הארנב שלי אוכל עשב ירוק.' },
      { en: 'The frog jumps into the water.', he: 'הצפרדע קופצת למים.' },
      { en: 'Two cows sleep in the sun.', he: 'שתי פרות ישנות בשמש.' },
      { en: 'No, it is a horse.', he: 'לא, זה סוס.' },
    ],
    passages: [
      {
        passageEn: 'Gal is on a farm. She sees a pig and a cow. The pig is in the mud. The cow eats grass.',
        passageHe: 'גל בחווה. היא רואה חזיר ופרה. החזיר בבוץ. הפרה אוכלת עשב.',
        questions: [
          {
            questionEn: 'Where is Gal?',
            questionHe: 'איפה גל?',
            correct: 'On a farm.',
            wrong: ['At the zoo.', 'At school.'],
          },
          {
            questionEn: 'Where is the pig?',
            questionHe: 'איפה החזיר?',
            correct: 'In the mud.',
            wrong: ['In the house.', 'In the water.'],
          },
          {
            questionEn: 'What does the cow eat?',
            questionHe: 'מה הפרה אוכלת?',
            correct: 'Grass.',
            wrong: ['Eggs.', 'Fish.'],
          },
        ],
      },
      {
        passageEn: 'Omer has a pet. It is not a dog. It is not a cat. It is a little green frog!',
        passageHe: 'לעומר יש חיית מחמד. זה לא כלב. זה לא חתול. זאת צפרדע ירוקה קטנה!',
        questions: [
          {
            questionEn: 'What does Omer have?',
            questionHe: 'מה יש לעומר?',
            correct: 'A pet.',
            wrong: ['A farm.', 'A horse.'],
          },
          {
            questionEn: 'Is the pet a dog?',
            questionHe: 'האם חיית המחמד היא כלב?',
            correct: 'No, it is not.',
            wrong: ['Yes, it is.', 'Yes, it is a dog.'],
          },
          {
            questionEn: 'What color is the frog?',
            questionHe: 'באיזה צבע הצפרדע?',
            correct: 'Green.',
            wrong: ['Pink.', 'Brown.'],
          },
        ],
      },
    ],
  },

  // Unit 4: My home & my clothes, "I can..."
  4: {
    vocabulary: [
      {
        clozeEn: 'I sleep in my ____ at night.',
        clozeHe: 'אני ישן במיטה שלי בלילה.',
        answer: 'bed',
        wrong: ['door', 'shoes'],
      },
      {
        clozeEn: 'Please close the ____. It is cold.',
        clozeHe: 'בבקשה לסגור את הדלת. קר.',
        answer: 'door',
        wrong: ['bed', 'socks'],
      },
      {
        clozeEn: 'I put ____ on my feet before my shoes.',
        clozeHe: 'אני שם גרביים על הרגליים לפני הנעליים.',
        answer: 'socks',
        wrong: ['jacket', 'chair'],
      },
      {
        clozeEn: 'It is cold, so I wear my ____.',
        clozeHe: 'קר, אז אני לובש את המעיל שלי.',
        answer: 'jacket',
        wrong: ['bed', 'window'],
      },
      {
        clozeEn: 'I look out of the ____ and see the sun.',
        clozeHe: 'אני מסתכל מהחלון ורואה את השמש.',
        answer: 'window',
        wrong: ['shirt', 'bed'],
      },
      {
        clozeEn: 'Our ____ has a blue door and two windows.',
        clozeHe: 'לבית שלנו יש דלת כחולה ושני חלונות.',
        answer: 'house',
        wrong: ['socks', 'shirt'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which word rhymes with door?',
        correct: 'four',
        wrong: ['bed', 'sock'],
        explainHe: 'door ו-four נגמרות באותו צליל: or.',
        hintHe: 'אמרו door בקול. איזו מילה נשמעת אותו דבר בסוף?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I have new shoes.',
        wrong: ['I has new shoes.', 'I new have shoes.'],
        explainHe: 'עם I אומרים have, ומילת התיאור באה לפני הדבר: new shoes.',
        hintHe: 'מה בא אחרי I? ואיפה באה המילה שמתארת את הנעליים?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We can open the big window.',
        wrong: ['We can opens the big window.', 'We can open big window the.'],
        explainHe: 'אחרי can בא פועל בלי s, ו-the בא לפני הדבר.',
        hintHe: 'אחרי can הפועל נשאר בלי שינוי. ובדקו איפה בא the.',
      },
      {
        questionEn: 'Which word is something we wear?',
        correct: 'shirt',
        wrong: ['door', 'bed'],
        explainHe: 'shirt היא חולצה, ולובשים אותה. door היא דלת ו-bed היא מיטה.',
        hintHe: 'חפשו בגד: משהו ששמים על הגוף בבוקר.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'This is my jacket.',
        wrong: ['This are my jacket.', 'This my is jacket.'],
        explainHe: 'על דבר אחד אומרים This is, ואז my והדבר.',
        hintHe: 'מדובר בדבר אחד. איזו מילה מתאימה לאחד, ואיפה באה המילה my?',
      },
      {
        questionEn: 'Which word means more than one sock?',
        correct: 'socks',
        wrong: ['sock', 'a sock'],
        explainHe: 'socks עם s בסוף אומר יותר מגרב אחת.',
        hintHe: 'יותר מאחד באנגלית מקבל אות נוספת בסוף המילה.',
      },
    ],
    sentences: [
      { en: 'My jacket is on the chair.', he: 'המעיל שלי על הכיסא.' },
      { en: 'Can you close the door?', he: 'אתם יכולים לסגור את הדלת?' },
      { en: 'I have green socks.', he: 'יש לי גרביים ירוקות.' },
      { en: 'The window is very big.', he: 'החלון מאוד גדול.' },
      { en: 'This is my new shirt.', he: 'זאת החולצה החדשה שלי.' },
      { en: 'I can see your house.', he: 'אני רואה את הבית שלכם.' },
    ],
    passages: [
      {
        passageEn: 'This is Noa’s room. It has a bed and a chair. The bed is pink. Noa’s jacket is on the chair.',
        passageHe: 'זה החדר של נועה. יש בו מיטה וכיסא. המיטה ורודה. המעיל של נועה על הכיסא.',
        questions: [
          {
            questionEn: 'What is pink?',
            questionHe: 'מה ורוד?',
            correct: 'The bed.',
            wrong: ['The chair.', 'The jacket.'],
          },
          {
            questionEn: 'Where is the jacket?',
            questionHe: 'איפה המעיל?',
            correct: 'On the chair.',
            wrong: ['On the bed.', 'In the window.'],
          },
          {
            questionEn: 'What is in the room?',
            questionHe: 'מה יש בחדר?',
            correct: 'A bed and a chair.',
            wrong: ['A sofa and a lamp.', 'A door and a car.'],
          },
        ],
      },
      {
        passageEn: 'It is a cold day. Ben puts on his socks and shoes. He puts on a warm jacket. Then he opens the door.',
        passageHe: 'זה יום קר. בן נועל גרביים ונעליים. הוא לובש מעיל חם. ואז הוא פותח את הדלת.',
        questions: [
          {
            questionEn: 'Is the day hot or cold?',
            questionHe: 'היום חם או קר?',
            correct: 'Cold.',
            wrong: ['Hot.', 'Sunny.'],
          },
          {
            questionEn: 'What does Ben put on his feet?',
            questionHe: 'מה בן שם על הרגליים?',
            correct: 'Socks and shoes.',
            wrong: ['A jacket.', 'A hat.'],
          },
          {
            questionEn: 'What does Ben open?',
            questionHe: 'מה בן פותח?',
            correct: 'The door.',
            wrong: ['The window.', 'His bag.'],
          },
        ],
      },
    ],
  },
};
