import type { ExamBankPack } from './types';

/**
 * Grade 3 exam question bank (Feature 43). New questions only: none of them appears in a grade 3
 * mission, mini-lesson, the placement test or a contest. The last 2 items of each list and the
 * second passage are for the mock exam. Short sentences and passages for early readers.
 */
export const GRADE_3_EXAM_BANK: ExamBankPack = {
  // Unit 1: School supplies, colors & plural s
  1: {
    vocabulary: [
      {
        clozeEn: 'Mom cuts the ribbon with sharp ____.',
        clozeHe: 'אמא גוזרת את הסרט עם מספריים חדים.',
        answer: 'scissors',
        wrong: ['crayon', 'desk'],
      },
      {
        clozeEn: 'I use a ____ to draw a straight line.',
        clozeHe: 'אני משתמש בסרגל כדי לצייר קו ישר.',
        answer: 'ruler',
        wrong: ['scissors', 'desk'],
      },
      {
        clozeEn: 'I write my homework in my ____.',
        clozeHe: 'אני כותב את שיעורי הבית במחברת שלי.',
        answer: 'notebook',
        wrong: ['scissors', 'purple'],
      },
      {
        clozeEn: 'The grass in the garden is ____.',
        clozeHe: 'הדשא בגינה ירוק.',
        answer: 'green',
        wrong: ['purple', 'desk'],
      },
      {
        clozeEn: 'I dip my ____ in the paint.',
        clozeHe: 'אני טובל את המכחול שלי בצבע.',
        answer: 'paintbrush',
        wrong: ['notebook', 'desk'],
      },
      {
        clozeEn: 'My books are on my ____.',
        clozeHe: 'הספרים שלי על שולחן הכתיבה שלי.',
        answer: 'desk',
        wrong: ['scissors', 'green'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I have three crayons.',
        wrong: ['I have three crayon.', 'I have crayons three.'],
        explainHe: 'אחרי מספר גדול מאחד מוסיפים s, והמספר בא לפני הדבר: three crayons.',
        hintHe: 'בדקו שני דברים: האם יש s כשיש יותר מאחד, והאם המספר בא לפני הדבר.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'She has a purple ruler.',
        wrong: ['She has a ruler purple.', 'She purple has a ruler.'],
        explainHe: 'באנגלית הצבע בא לפני הדבר: a purple ruler.',
        hintHe: 'איפה בא הצבע באנגלית: לפני הדבר או אחריו?',
      },
      {
        questionEn: 'Which word means more than one notebook?',
        correct: 'notebooks',
        wrong: ['notebook', 'a notebooks'],
        explainHe: 'notebooks עם s ובלי a אומר כמה מחברות.',
        hintHe: 'יותר מאחד מקבל s בסוף. והאם המילה a מתאימה ליותר מאחד?',
      },
      {
        questionEn: 'Which one is correct?',
        correct: 'an orange crayon',
        wrong: ['a orange crayon', 'an crayon orange'],
        explainHe: 'orange מתחילה בצליל o, לכן an. והצבע בא לפני הדבר.',
        hintHe: 'בדקו באיזה צליל מתחילה המילה שאחרי a או an, ואיפה בא הצבע.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We have two desks.',
        wrong: ['We has two desks.', 'We have two desk.'],
        explainHe: 'עם We אומרים have, ושני שולחנות הם desks עם s.',
        hintHe: 'מה בא אחרי We? והאם יש s כשיש שניים?',
      },
      {
        questionEn: 'Which word is a color?',
        correct: 'purple',
        wrong: ['pencil', 'ruler'],
        explainHe: 'purple הוא צבע (סגול). pencil הוא עיפרון ו-ruler הוא סרגל.',
        hintHe: 'חפשו מילה שמתארת איך משהו נראה, ולא כלי כתיבה.',
      },
    ],
    sentences: [
      { en: 'I have five green crayons.', he: 'יש לי חמישה עפרונות צבעוניים ירוקים.' },
      { en: 'The scissors are on the desk.', he: 'המספריים על השולחן.' },
      { en: 'My notebook is purple.', he: 'המחברת שלי סגולה.' },
      { en: 'Can I have some paper?', he: 'אפשר לקבל קצת נייר?' },
      { en: 'She paints with a paintbrush.', he: 'היא מציירת עם מכחול.' },
      { en: 'I have two orange pencils.', he: 'יש לי שני עפרונות כתומים.' },
    ],
    passages: [
      {
        passageEn: 'Tal has a new pencil case. It is purple. In it, she has three pencils and a ruler. She is happy.',
        passageHe: 'לטל יש קלמר חדש. הוא סגול. בתוכו יש לה שלושה עפרונות וסרגל. היא שמחה.',
        questions: [
          {
            questionEn: 'What color is the pencil case?',
            questionHe: 'באיזה צבע הקלמר?',
            correct: 'Purple.',
            wrong: ['Green.', 'Orange.'],
          },
          {
            questionEn: 'How many pencils does Tal have?',
            questionHe: 'כמה עפרונות יש לטל?',
            correct: 'Three.',
            wrong: ['Two.', 'Five.'],
          },
          {
            questionEn: 'What else is in the pencil case?',
            questionHe: 'מה עוד יש בקלמר?',
            correct: 'A ruler.',
            wrong: ['Scissors.', 'A paintbrush.'],
          },
        ],
      },
      {
        passageEn: 'It is art class. Omer takes paper and a paintbrush. He paints a green tree. He puts the picture on his desk.',
        passageHe: 'עכשיו שיעור אמנות. עומר לוקח נייר ומכחול. הוא מצייר עץ ירוק. הוא שם את התמונה על השולחן שלו.',
        questions: [
          {
            questionEn: 'What class is it?',
            questionHe: 'איזה שיעור עכשיו?',
            correct: 'Art class.',
            wrong: ['Math class.', 'Music class.'],
          },
          {
            questionEn: 'What does Omer paint?',
            questionHe: 'מה עומר מצייר?',
            correct: 'A green tree.',
            wrong: ['A purple flower.', 'A red house.'],
          },
          {
            questionEn: 'Where does he put the picture?',
            questionHe: 'איפה הוא שם את התמונה?',
            correct: 'On his desk.',
            wrong: ['In his bag.', 'On the wall.'],
          },
        ],
      },
    ],
  },

  // Unit 2: Days, weather & feelings, am / is / are
  2: {
    vocabulary: [
      {
        clozeEn: 'Take your umbrella. It is ____ today.',
        clozeHe: 'קחו מטרייה. היום גשום.',
        answer: 'rainy',
        wrong: ['excited', 'outside'],
      },
      {
        clozeEn: 'The kite flies high because it is ____.',
        clozeHe: 'העפיפון עף גבוה כי יש רוח.',
        answer: 'windy',
        wrong: ['sad', 'tired'],
      },
      {
        clozeEn: 'I want to sleep. I am very ____.',
        clozeHe: 'אני רוצה לישון. אני מאוד עייף.',
        answer: 'tired',
        wrong: ['windy', 'rainy'],
      },
      {
        clozeEn: 'The day after Thursday is ____.',
        clozeHe: 'היום שאחרי יום חמישי הוא יום שישי.',
        answer: 'Friday',
        wrong: ['weather', 'cloudy'],
      },
      {
        clozeEn: 'It is sunny, so we play ____.',
        clozeHe: 'יש שמש, אז אנחנו משחקים בחוץ.',
        answer: 'outside',
        wrong: ['tired', 'weather'],
      },
      {
        clozeEn: 'Tomorrow is our school trip, and I am so ____!',
        clozeHe: 'מחר הטיול השנתי שלנו, ואני כל כך נרגש!',
        answer: 'excited',
        wrong: ['cloudy', 'windy'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'They are tired.',
        wrong: ['They is tired.', 'They am tired.'],
        explainHe: 'עם They (הם, יותר מאחד) אומרים are.',
        hintHe: 'They הם יותר מאחד. איזו מילה מתאימה ליותר מאחד?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'He is sad today.',
        wrong: ['He are sad today.', 'He am sad today.'],
        explainHe: 'עם He (הוא) אומרים is.',
        hintHe: 'He הוא אדם אחד. איזו מילה מתאימה ל-he, לא ל-I ולא ל-they?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'It is cloudy today.',
        wrong: ['It cloudy is today.', 'It are cloudy today.'],
        explainHe: 'על מזג האוויר אומרים It is, ואז מילת מזג האוויר.',
        hintHe: 'על מזג אוויר מתחילים ב-It. איזו מילה מתאימה ל-it, ואיפה היא באה?',
      },
      {
        questionEn: 'Which day comes after Monday?',
        correct: 'Tuesday',
        wrong: ['Sunday', 'Friday'],
        explainHe: 'אחרי Monday (שני) בא Tuesday (שלישי).',
        hintHe: 'אמרו את ימי השבוע לפי הסדר. מה בא אחרי יום שני?',
      },
      {
        questionEn: 'How do you feel? (a big smile) Which answer is correct?',
        correct: 'I am happy.',
        wrong: ['I is happy.', 'I am sad.'],
        explainHe: 'חיוך גדול אומר שמחה, לכן happy, ועם I אומרים am.',
        hintHe: 'מה כתוב בסוגריים? ובדקו איזו מילה מתאימה ל-I.',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Is it windy today?',
        wrong: ['Is windy it today?', 'Windy is it today?'],
        explainHe: 'שאלה מתחילה ב-Is it, ואחריה מזג האוויר: Is it windy today?',
        hintHe: 'בשאלה של כן או לא, is בא ראשון. מה בא מיד אחריו?',
      },
    ],
    sentences: [
      { en: 'It is windy and cloudy.', he: 'יש רוח ומעונן.' },
      { en: 'We are excited about Friday.', he: 'אנחנו נרגשים לקראת יום שישי.' },
      { en: 'I am sad when it rains.', he: 'אני עצוב כשיורד גשם.' },
      { en: 'The weather is nice today.', he: 'מזג האוויר נעים היום.' },
      { en: 'Let’s play outside today!', he: 'בואו נשחק היום בחוץ!' },
      { en: 'My dog is tired now.', he: 'הכלב שלי עייף עכשיו.' },
    ],
    passages: [
      {
        passageEn: 'Today is Friday. The weather is sunny. Maya plays outside with her dog. She is very happy.',
        passageHe: 'היום יום שישי. מזג האוויר שמשי. מאיה משחקת בחוץ עם הכלב שלה. היא מאוד שמחה.',
        questions: [
          {
            questionEn: 'What day is it?',
            questionHe: 'איזה יום היום?',
            correct: 'Friday.',
            wrong: ['Monday.', 'Sunday.'],
          },
          {
            questionEn: 'How is the weather?',
            questionHe: 'איך מזג האוויר?',
            correct: 'Sunny.',
            wrong: ['Rainy.', 'Windy.'],
          },
          {
            questionEn: 'Who does Maya play with?',
            questionHe: 'עם מי מאיה משחקת?',
            correct: 'Her dog.',
            wrong: ['Her mom.', 'Her friends.'],
          },
        ],
      },
      {
        passageEn: 'On Sunday, it is rainy and windy. Ido stays inside. He is sad and a little tired. Then his friend calls, and Ido is excited.',
        passageHe: 'ביום ראשון גשום ויש רוח. עידו נשאר בבית. הוא עצוב וקצת עייף. ואז החבר שלו מתקשר, ועידו נרגש.',
        questions: [
          {
            questionEn: 'What is the weather on Sunday?',
            questionHe: 'מה מזג האוויר ביום ראשון?',
            correct: 'Rainy and windy.',
            wrong: ['Sunny and hot.', 'Cloudy and cold.'],
          },
          {
            questionEn: 'Where does Ido stay?',
            questionHe: 'איפה עידו נשאר?',
            correct: 'Inside.',
            wrong: ['Outside.', 'At school.'],
          },
          {
            questionEn: 'Why is Ido excited?',
            questionHe: 'למה עידו נרגש?',
            correct: 'His friend calls.',
            wrong: ['The sun comes out.', 'It is Friday.'],
          },
        ],
      },
    ],
  },

  // Unit 3: Zoo animals, a / an & "can"
  3: {
    vocabulary: [
      {
        clozeEn: 'The ____ has a very long neck.',
        clozeHe: 'לג׳ירפה יש צוואר מאוד ארוך.',
        answer: 'giraffe',
        wrong: ['parrot', 'lion'],
      },
      {
        clozeEn: 'A ____ has black and white stripes.',
        clozeHe: 'לזברה יש פסים שחורים ולבנים.',
        answer: 'zebra',
        wrong: ['lion', 'monkey'],
      },
      {
        clozeEn: 'The ____ has a long trunk and big ears.',
        clozeHe: 'לפיל יש חדק ארוך ואוזניים גדולות.',
        answer: 'elephant',
        wrong: ['zebra', 'parrot'],
      },
      {
        clozeEn: 'A ____ is a bird that can talk.',
        clozeHe: 'תוכי הוא ציפור שיודעת לדבר.',
        answer: 'parrot',
        wrong: ['tiger', 'giraffe'],
      },
      {
        clozeEn: 'Fish ____ in the sea.',
        clozeHe: 'דגים שוחים בים.',
        answer: 'swim',
        wrong: ['fly', 'run'],
      },
      {
        clozeEn: 'The ____ likes bananas and climbs trees.',
        clozeHe: 'הקוף אוהב בננות ומטפס על עצים.',
        answer: 'monkey',
        wrong: ['zebra', 'elephant'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'A monkey can jump.',
        wrong: ['A monkey can jumps.', 'A monkey can to jump.'],
        explainHe: 'אחרי can בא פועל בסיסי, בלי s ובלי to: can jump.',
        hintHe: 'אחרי can הפועל לא משתנה. האם מוסיפים לו משהו?',
      },
      {
        questionEn: 'Which one is correct?',
        correct: 'a tiger',
        wrong: ['an tiger', 'a tigers'],
        explainHe: 'tiger מתחילה ב-t, לכן a. ונמר אחד הוא בלי s.',
        hintHe: 'an בא רק לפני צליל של a, e, i, o, u. וכשיש אחד – עם s או בלי?',
      },
      {
        questionEn: 'Can a fish fly? Which answer is correct?',
        correct: 'No, it can’t.',
        wrong: ['No, it can.', 'Yes, it can’t.'],
        explainHe: 'דג לא עף, לכן No, it can’t: התשובה לא, והמילה לא יכול.',
        hintHe: 'חשבו אם דג עף. התשובה צריכה להיות "לא" בשני המקומות.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I see three lions.',
        wrong: ['I see three lion.', 'I see lions three.'],
        explainHe: 'אחרי three מוסיפים s, והמספר בא לפני החיה: three lions.',
        hintHe: 'בדקו שני דברים: s כשיש יותר מאחד, והמספר לפני החיה.',
      },
      {
        questionEn: 'Which word starts with the sound /z/ like zoo?',
        correct: 'zebra',
        wrong: ['tiger', 'lion'],
        explainHe: 'zebra מתחילה בצליל /z/, כמו zoo.',
        hintHe: 'אמרו zoo בקול, ואז כל מילה. איזו מתחילה באותו צליל?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'Parrots can fly.',
        wrong: ['Parrots can flies.', 'Parrots flies can.'],
        explainHe: 'אחרי can בא פועל בסיסי: can fly.',
        hintHe: 'מה בא אחרי can? והאם הפועל משתנה?',
      },
    ],
    sentences: [
      { en: 'Can a giraffe swim?', he: 'האם ג׳ירפה יודעת לשחות?' },
      { en: 'I see two big elephants.', he: 'אני רואה שני פילים גדולים.' },
      { en: 'A parrot can talk.', he: 'תוכי יודע לדבר.' },
      { en: 'Monkeys can jump and climb.', he: 'קופים יודעים לקפוץ ולטפס.' },
      { en: 'The zebra has black stripes.', he: 'לזברה יש פסים שחורים.' },
      { en: 'I can run and swim.', he: 'אני יודע לרוץ ולשחות.' },
    ],
    passages: [
      {
        passageEn: 'Dana goes to the zoo with her dad. She sees a giraffe. The giraffe is very tall. It eats leaves from a tree.',
        passageHe: 'דנה הולכת לגן החיות עם אבא שלה. היא רואה ג׳ירפה. הג׳ירפה מאוד גבוהה. היא אוכלת עלים מעץ.',
        questions: [
          {
            questionEn: 'Who goes to the zoo with Dana?',
            questionHe: 'מי הולך לגן החיות עם דנה?',
            correct: 'Her dad.',
            wrong: ['Her mom.', 'Her teacher.'],
          },
          {
            questionEn: 'Which animal is very tall?',
            questionHe: 'איזו חיה מאוד גבוהה?',
            correct: 'The giraffe.',
            wrong: ['The lion.', 'The monkey.'],
          },
          {
            questionEn: 'What does the giraffe eat?',
            questionHe: 'מה הג׳ירפה אוכלת?',
            correct: 'Leaves.',
            wrong: ['Bananas.', 'Fish.'],
          },
        ],
      },
      {
        passageEn: 'Look at the animals! The monkey can jump. The elephant can swim. The parrot can fly, but it can’t swim.',
        passageHe: 'תסתכלו על החיות! הקוף יודע לקפוץ. הפיל יודע לשחות. התוכי יודע לעוף, אבל הוא לא יודע לשחות.',
        questions: [
          {
            questionEn: 'What can the monkey do?',
            questionHe: 'מה הקוף יודע לעשות?',
            correct: 'It can jump.',
            wrong: ['It can fly.', 'It can swim.'],
          },
          {
            questionEn: 'Which animal can swim?',
            questionHe: 'איזו חיה יודעת לשחות?',
            correct: 'The elephant.',
            wrong: ['The parrot.', 'The monkey.'],
          },
          {
            questionEn: 'What can’t the parrot do?',
            questionHe: 'מה התוכי לא יודע לעשות?',
            correct: 'Swim.',
            wrong: ['Fly.', 'Talk.'],
          },
        ],
      },
    ],
  },

  // Unit 4: Birthday party, "I like", "What is this?" & "Is it...?"
  4: {
    vocabulary: [
      {
        clozeEn: 'I blow out the ____ on my cake.',
        clozeHe: 'אני מכבה בנשיפה את הנר על העוגה שלי.',
        answer: 'candle',
        wrong: ['juice', 'card'],
      },
      {
        clozeEn: 'Grandma gives me a ____ in a big box.',
        clozeHe: 'סבתא נותנת לי מתנה בקופסה גדולה.',
        answer: 'present',
        wrong: ['juice', 'dance'],
      },
      {
        clozeEn: 'I drink a cup of orange ____.',
        clozeHe: 'אני שותה כוס מיץ תפוזים.',
        answer: 'juice',
        wrong: ['balloon', 'card'],
      },
      {
        clozeEn: 'The red ____ goes up in the sky.',
        clozeHe: 'הבלון האדום עולה לשמיים.',
        answer: 'balloon',
        wrong: ['pizza', 'cake'],
      },
      {
        clozeEn: 'We ____ to the music at the party.',
        clozeHe: 'אנחנו רוקדים לפי המוזיקה במסיבה.',
        answer: 'dance',
        wrong: ['juice', 'candle'],
      },
      {
        clozeEn: 'I write a ____ for my friend’s birthday.',
        clozeHe: 'אני כותב כרטיס ברכה ליום ההולדת של החבר שלי.',
        answer: 'card',
        wrong: ['pizza', 'juice'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'My friend likes cake.',
        wrong: ['My friend like cake.', 'My friend liking cake.'],
        explainHe: 'על חבר אחד (he / she) מוסיפים s לפועל: likes.',
        hintHe: 'My friend הוא אדם אחד, כמו he או she. מה קורה לפועל?',
      },
      {
        questionEn: 'What is this? (a candle) Which answer is correct?',
        correct: 'It is a candle.',
        wrong: ['Yes, it does.', 'I am a candle.'],
        explainHe: 'על השאלה What is this עונים It is a ומה זה.',
        hintHe: 'השאלה היא "מה זה?". איזו תשובה אומרת מה זה?',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Is it a present?',
        wrong: ['Is a it present?', 'It a present is?'],
        explainHe: 'שאלה של כן או לא מתחילה ב-Is it, ואחריה a והדבר.',
        hintHe: 'בשאלה is בא ראשון. מה בא מיד אחריו, ואיפה המילה a?',
      },
      {
        questionEn: 'Is it a balloon? (Yes) Which answer is correct?',
        correct: 'Yes, it is a balloon.',
        wrong: ['Yes, it a balloon is.', 'Yes, is it a balloon.'],
        explainHe: 'בתשובה הסדר הוא it is, ואז a והדבר: Yes, it is a balloon.',
        hintHe: 'בשאלה is בא ראשון, אבל בתשובה הסדר מתהפך.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We sing at the party.',
        wrong: ['We sings at the party.', 'We at the party sing.'],
        explainHe: 'עם We אומרים sing בלי s, והפועל בא אחרי We.',
        hintHe: 'עם We מוסיפים s לפועל? ואיפה בא הפועל במשפט?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I have two balloons.',
        wrong: ['I have two balloon.', 'I has two balloons.'],
        explainHe: 'עם I אומרים have, ושני בלונים הם balloons עם s.',
        hintHe: 'מה בא אחרי I? והאם יש s כשיש שניים?',
      },
    ],
    sentences: [
      { en: 'We eat pizza at the party.', he: 'אנחנו אוכלים פיצה במסיבה.' },
      { en: 'The cake has six candles.', he: 'על העוגה יש שישה נרות.' },
      { en: 'My birthday is in May.', he: 'יום ההולדת שלי בחודש מאי.' },
      { en: 'I have a present for you.', he: 'יש לי מתנה בשבילכם.' },
      { en: 'Let’s dance and sing!', he: 'בואו נרקוד ונשיר!' },
      { en: 'I like cold ice cream.', he: 'אני אוהב גלידה קרה.' },
    ],
    passages: [
      {
        passageEn: 'Today is Ella’s birthday. She has a party at home. Her friends bring presents. They eat pizza and cake.',
        passageHe: 'היום יום ההולדת של אלה. יש לה מסיבה בבית. החברים שלה מביאים מתנות. הם אוכלים פיצה ועוגה.',
        questions: [
          {
            questionEn: 'Where is the party?',
            questionHe: 'איפה המסיבה?',
            correct: 'At home.',
            wrong: ['At school.', 'At the zoo.'],
          },
          {
            questionEn: 'What do her friends bring?',
            questionHe: 'מה החברים שלה מביאים?',
            correct: 'Presents.',
            wrong: ['Balloons.', 'Juice.'],
          },
          {
            questionEn: 'What do they eat?',
            questionHe: 'מה הם אוכלים?',
            correct: 'Pizza and cake.',
            wrong: ['Ice cream and fish.', 'Apples and bread.'],
          },
        ],
      },
      {
        passageEn: 'Ari has a big party. There are blue balloons. The children sing and dance. Ari gets a card from his grandma.',
        passageHe: 'לארי יש מסיבה גדולה. יש בלונים כחולים. הילדים שרים ורוקדים. ארי מקבל כרטיס ברכה מסבתא שלו.',
        questions: [
          {
            questionEn: 'What color are the balloons?',
            questionHe: 'באיזה צבע הבלונים?',
            correct: 'Blue.',
            wrong: ['Red.', 'Green.'],
          },
          {
            questionEn: 'What do the children do?',
            questionHe: 'מה הילדים עושים?',
            correct: 'They sing and dance.',
            wrong: ['They swim.', 'They sleep.'],
          },
          {
            questionEn: 'Who gives Ari a card?',
            questionHe: 'מי נותנת לארי כרטיס ברכה?',
            correct: 'His grandma.',
            wrong: ['His dad.', 'His teacher.'],
          },
        ],
      },
    ],
  },
};
