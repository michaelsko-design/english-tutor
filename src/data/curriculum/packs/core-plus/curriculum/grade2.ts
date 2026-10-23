import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-plus pack's grade 2 units ("Season 2"): vehicles with a describing word before the noun
 * ("a red bus"), then the playground with in / on / under. Hebrew copy is gender-neutral (slash
 * forms such as "אוהב/ת").
 */
const UNITS: ElementaryUnitSpec[] = [
  {
    ...packUnitNumbers('core-plus', 0),
    titleEn: 'On the Move: Buses, Planes & Trains',
    titleHe: 'בדרכים: אוטובוסים, מטוסים ורכבות',
    subtitleHe: 'עונה 2: הרפתקאות בונוס! כלי תחבורה ומילה שמתארת לפני הדבר: a red bus',
    badgeEmoji: '🚏',
    missions: [
      {
        icon: '🚌',
        titleEn: 'A Red Bus and a Blue Car',
        titleHe: 'אוטובוס אדום ומכונית כחולה',
        storyHookHe: 'עונה 2 יוצאת לדרך! עומדים בתחנה ורואים כלי רכב בכל הצבעים. נלמד לומר a red bus.',
        grammarTopic: 'Vehicles & adjective + noun',
        skills: ['Vehicles', 'a red bus', 'Describing'],
        sentenceEn: 'I see a red bus and a little blue car.',
        sentenceHe: 'אני רואה אוטובוס אדום ומכונית כחולה קטנה.',
        vocab: [
          ['bus', 'noun', 'אוטובוס', '🚌', 'We go to school by bus.', 'אנחנו נוסעים לבית הספר באוטובוס.'],
          ['car', 'noun', 'מכונית', '🚗', 'Dad washes the car.', 'אבא שוטף את המכונית.'],
          ['bike', 'noun', 'אופניים', '🚲', 'I ride my bike in the park.', 'אני רוכב/ת על האופניים בפארק.'],
          ['van', 'noun', 'מיניבוס', '🚐', 'The van is big and white.', 'המיניבוס גדול ולבן.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'doll', translationHe: 'בובה' },
            { wordEn: 'bed', translationHe: 'מיטה' },
          ],
          shortSentenceEn: 'It is a red bus.',
          shortSentenceHe: 'זה אוטובוס אדום.',
          rule: {
            questionEn: 'Which one is correct?',
            correct: 'a green bike',
            wrong: ['a bike green', 'green a bike'],
            explainHe: 'מילה שמתארת (כמו צבע) באה לפני הדבר: a green bike.',
            hintHe: 'באנגלית מילה שמתארת עומדת לפני שם הדבר. בדקו מה בא אחרי המילה הקטנה.',
          },
          story: {
            passageEn: 'I am at the bus stop. I see a big yellow bus. I see a little red car. My bus is the yellow bus!',
            passageHe: 'אני בתחנת האוטובוס. אני רואה אוטובוס צהוב גדול. אני רואה מכונית אדומה קטנה. האוטובוס שלי הוא האוטובוס הצהוב!',
            questionEn: 'What color is the car?',
            questionHe: 'באיזה צבע המכונית?',
            correct: 'red',
            wrong: ['yellow', 'blue'],
          },
        },
      },
      {
        icon: '✈️',
        titleEn: 'Fast Plane, Slow Ship',
        titleHe: 'מטוס מהיר, אונייה איטית',
        storyHookHe: 'יוצאים לטיול רחוק! מטוס טס בשמיים ואונייה שטה בים. מי מהיר ומי איטי?',
        grammarTopic: 'fast / slow + noun',
        skills: ['Vehicles', 'fast & slow', 'Describing'],
        sentenceEn: 'The plane is fast, but the ship is slow.',
        sentenceHe: 'המטוס מהיר, אבל האונייה איטית.',
        vocab: [
          ['plane', 'noun', 'מטוס', '✈️', 'The plane flies over the sea.', 'המטוס טס מעל הים.'],
          ['ship', 'noun', 'אונייה', '🚢', 'A big ship is in the sea.', 'אונייה גדולה בים.'],
          ['fast', 'adjective', 'מהיר / מהירה', '💨', 'The car is very fast.', 'המכונית מהירה מאוד.'],
          ['slow', 'adjective', 'איטי / איטית', '🐢', 'The turtle is slow.', 'הצב איטי.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'hat', translationHe: 'כובע' },
            { wordEn: 'cow', translationHe: 'פרה' },
          ],
          shortSentenceEn: 'It is a fast plane.',
          shortSentenceHe: 'זה מטוס מהיר.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'It is a slow ship.',
            wrong: ['It is a ship slow.', 'It a slow is ship.'],
            explainHe: 'קודם It is a, ואז המילה שמתארת slow, ואז הדבר: a slow ship.',
            hintHe: 'מילה שמתארת באה לפני הדבר. וגם כדאי לבדוק את הסדר של It ו-is.',
          },
          story: {
            passageEn: 'Grandma goes to Eilat. She goes by plane. The plane is fast. Grandpa goes by ship. The ship is slow.',
            passageHe: 'סבתא נוסעת לאילת. היא טסה במטוס. המטוס מהיר. סבא נוסע באונייה. האונייה איטית.',
            questionEn: 'Who goes by ship?',
            questionHe: 'מי נוסע באונייה?',
            correct: 'Grandpa',
            wrong: ['Grandma', 'Dad'],
          },
        },
      },
      {
        icon: '🚆',
        isBoss: true,
        titleEn: 'Boss: The Big Train Trip',
        titleHe: 'אתגר הבוס: טיול ברכבת',
        storyHookHe: 'כולם עולים לרכבת הגדולה! הראו שאתם מכירים את כלי הרכב ויודעים לתאר אותם.',
        grammarTopic: 'Vehicles, Describing Words & Review',
        skills: ['Vehicles', 'Describing', 'Review'],
        sentenceEn: 'We like the long green train.',
        sentenceHe: 'אנחנו אוהבים את הרכבת הירוקה הארוכה.',
        vocab: [
          ['train', 'noun', 'רכבת', '🚆', 'The train goes to Haifa.', 'הרכבת נוסעת לחיפה.'],
          ['rocket', 'noun', 'חללית', '🚀', 'The rocket goes to the moon.', 'החללית טסה לירח.'],
          ['pilot', 'noun', 'טייס / טייסת', '🧑‍✈️', 'The pilot flies the plane.', 'הטייס מטיס את המטוס.'],
          ['stop', 'noun', 'תחנה', '🚏', 'We wait at the bus stop.', 'אנחנו מחכים בתחנת האוטובוס.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'box', translationHe: 'קופסה' },
            { wordEn: 'pen', translationHe: 'עט' },
          ],
          shortSentenceEn: 'I like the train.',
          shortSentenceHe: 'אני אוהב/ת את הרכבת.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'I have two blue rockets.',
            wrong: ['I have two rocket blue.', 'I have blue two rockets.'],
            explainHe: 'המספר בא ראשון, אחריו הצבע, ואז הדבר עם s: two blue rockets.',
            hintHe: 'קודם כמה, אחר כך איזה צבע, ובסוף הדבר. וכשיש יותר מאחד, מה קורה לסוף המילה?',
          },
          story: {
            passageEn:
              'Sam and Dad wait at the train stop. A long green train comes. It is fast! Sam sees a pilot on the train. The pilot goes to a big plane.',
            passageHe:
              'סם ואבא מחכים בתחנת הרכבת. מגיעה רכבת ירוקה ארוכה. היא מהירה! סם רואה טייס ברכבת. הטייס נוסע למטוס גדול.',
            questionEn: 'What color is the train?',
            questionHe: 'באיזה צבע הרכבת?',
            correct: 'green',
            wrong: ['red', 'blue'],
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('core-plus', 1),
    titleEn: 'Playground Fun: In, On, Under',
    titleHe: 'כיף בגן השעשועים: בתוך, על ומתחת',
    subtitleHe: 'עונה 2: איפה זה? in, on ו-under',
    badgeEmoji: '🤸',
    missions: [
      {
        icon: '🪁',
        titleEn: 'The Kite Is in the Tree',
        titleHe: 'העפיפון בתוך העץ',
        storyHookHe: 'העפיפון נתקע בעץ! נלמד לומר איפה דברים נמצאים: in (בתוך) ו-on (על).',
        grammarTopic: 'Where? in / on',
        skills: ['Playground', 'in & on', 'Where is...?'],
        sentenceEn: 'My red kite is in the big tree.',
        sentenceHe: 'העפיפון האדום שלי נמצא בתוך העץ הגדול.',
        vocab: [
          ['kite', 'noun', 'עפיפון', '🪁', 'My kite flies high in the sky.', 'העפיפון שלי עף גבוה בשמיים.'],
          ['tree', 'noun', 'עץ', '🌳', 'The tree is green and tall.', 'העץ ירוק וגבוה.'],
          ['balloon', 'noun', 'בלון', '🎈', 'I have a pink balloon.', 'יש לי בלון ורוד.'],
          ['bird', 'noun', 'ציפור', '🐦', 'A bird sings in the morning.', 'ציפור שרה בבוקר.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'cat', translationHe: 'חתול' },
            { wordEn: 'shoes', translationHe: 'נעליים' },
          ],
          shortSentenceEn: 'The balloon is in the tree.',
          shortSentenceHe: 'הבלון בתוך העץ.',
          rule: {
            questionEn: 'The bird sits on top of the box. Which sentence is correct?',
            correct: 'The bird is on the box.',
            wrong: ['The bird is in the box.', 'The bird on is the box.'],
            explainHe: 'on פירושו "על": הציפור יושבת על הקופסה. in פירושו "בתוך".',
            hintHe: 'הציפור למעלה, לא בפנים. איזו מילה אומרת "על"? כדאי לבדוק גם את סדר המילים.',
          },
          story: {
            passageEn: 'Tom and Lea play in the park. Tom has a red kite. Lea has a blue balloon. Oh no! The kite is in the tree.',
            passageHe: 'תום ולאה משחקים בפארק. לתום יש עפיפון אדום. ללאה יש בלון כחול. אוי לא! העפיפון בתוך העץ.',
            questionEn: 'Where is the kite?',
            questionHe: 'איפה העפיפון?',
            correct: 'in the tree',
            wrong: ['on the bed', 'in the box'],
          },
        },
      },
      {
        icon: '🧺',
        titleEn: 'Under the Basket',
        titleHe: 'מתחת לסלסלה',
        storyHookHe: 'יש פיקניק בגן השעשועים! מי מתחבא מתחת לסלסלה? נלמד את המילה under (מתחת).',
        grammarTopic: 'Where? under',
        skills: ['Playground', 'under', 'Where is...?'],
        sentenceEn: 'The little ant is under the basket.',
        sentenceHe: 'הנמלה הקטנה נמצאת מתחת לסלסלה.',
        vocab: [
          ['basket', 'noun', 'סלסלה', '🧺', 'The basket has apples in it.', 'בסלסלה יש תפוחים.'],
          ['ant', 'noun', 'נמלה', '🐜', 'The ant is very little.', 'הנמלה קטנה מאוד.'],
          ['flower', 'noun', 'פרח', '🌷', 'I give Mom a flower.', 'אני נותן/ת לאמא פרח.'],
          ['goal', 'noun', 'שער', '🥅', 'The ball is in the goal!', 'הכדור בשער!'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'hen', translationHe: 'תרנגולת' },
            { wordEn: 'bag', translationHe: 'תיק' },
          ],
          shortSentenceEn: 'The ant is under the flower.',
          shortSentenceHe: 'הנמלה מתחת לפרח.',
          rule: {
            questionEn: 'The ball is below the bed. Which sentence is correct?',
            correct: 'The ball is under the bed.',
            wrong: ['The ball is on the bed.', 'The ball under is the bed.'],
            explainHe: 'under פירושו "מתחת": הכדור מתחת למיטה.',
            hintHe: 'הכדור למטה, והמיטה מעליו. איזו מילה אומרת "מתחת"? בדקו גם את הסדר.',
          },
          story: {
            passageEn: 'We have a picnic. The basket is on the grass. A little ant is under the basket. A red flower is in the basket.',
            passageHe: 'יש לנו פיקניק. הסלסלה על הדשא. נמלה קטנה מתחת לסלסלה. פרח אדום בתוך הסלסלה.',
            questionEn: 'Where is the ant?',
            questionHe: 'איפה הנמלה?',
            correct: 'under the basket',
            wrong: ['in the basket', 'on the flower'],
          },
        },
      },
      {
        icon: '🤸',
        isBoss: true,
        titleEn: 'Boss: Hide and Seek',
        titleHe: 'אתגר הבוס: מחבואים',
        storyHookHe: 'משחקים מחבואים בגן השעשועים! הראו שאתם יודעים לומר איפה כל אחד מתחבא: in, on או under.',
        grammarTopic: 'in / on / under & Review',
        skills: ['in, on, under', 'Where is...?', 'Review'],
        sentenceEn: 'My friend is under the big tree.',
        sentenceHe: 'החבר שלי מתחת לעץ הגדול.',
        vocab: [
          ['friend', 'noun', 'חבר / חברה', '🤝', 'My friend plays with me.', 'החבר שלי משחק איתי.'],
          ['sand', 'noun', 'חול', '🏖️', 'We dig in the sand.', 'אנחנו חופרים בחול.'],
          ['cap', 'noun', 'כובע מצחייה', '🧢', 'My cap is blue.', 'כובע המצחייה שלי כחול.'],
          ['sun', 'noun', 'שמש', '☀️', 'The sun is hot today.', 'השמש חמה היום.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'bed', translationHe: 'מיטה' },
            { wordEn: 'milk', translationHe: 'חלב' },
          ],
          shortSentenceEn: 'My cap is on the sand.',
          shortSentenceHe: 'כובע המצחייה שלי על החול.',
          rule: {
            questionEn: 'Which question is correct?',
            correct: 'Where is my cap?',
            wrong: ['Where my cap is?', 'Is where my cap?'],
            explainHe: 'שואלים Where is …? (איפה …?): קודם Where, אחר כך is, ואז הדבר.',
            hintHe: 'שאלה מתחילה במילת השאלה. מה בא מיד אחריה?',
          },
          story: {
            passageEn:
              'We play hide and seek. Dan is under the tree. Maya is in the big box. Noa is on the sand, in the sun. My cap is on her head!',
            passageHe:
              'אנחנו משחקים מחבואים. דן מתחת לעץ. מאיה בתוך הקופסה הגדולה. נועה על החול, בשמש. הכובע שלי על הראש שלה!',
            questionEn: 'Where is Dan?',
            questionHe: 'איפה דן?',
            correct: 'under the tree',
            wrong: ['in the box', 'on the sand'],
          },
        },
      },
    ],
  },
];

export const CORE_PLUS_GRADE_2_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-2', UNITS);
