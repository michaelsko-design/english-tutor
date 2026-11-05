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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which one is right?',
                correct: 'a yellow car',
                wrong: ['a car yellow'],
                explainHe: 'מילה שמתארת באה לפני הדבר: a yellow car.',
                hintHe: 'באנגלית קודם הצבע ואז הדבר.',
              },
              story: {
                passageEn: 'Ron has a bike. The bike is green. It is in the park.',
                passageHe: 'לרון יש אופניים. האופניים ירוקים. הם בפארק.',
                questionEn: 'Where is the bike?',
                questionHe: 'איפה האופניים?',
                correct: 'in the park',
                wrong: ['in the bag'],
              },
            },
            challenger: {
              clozeWrong: [
                ['bed', 'hat'],
                ['sky', 'rain'],
                ['soup', 'door'],
                ['milk', 'soup'],
              ],
            },
            master: {
              sentenceEn: 'I ride a fast green bike to school.',
              sentenceHe: 'אני רוכב/ת על אופניים ירוקים מהירים לבית הספר.',
              decoys: ['rides', 'bikes'],
              voiceEn: 'A yellow bus stops here.',
              voiceHe: 'אוטובוס צהוב עוצר כאן.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'It is a big yellow bus.',
                wrong: ['It is a bus big yellow.', 'It is big a yellow bus.', 'It is a big yellow buses.'],
                explainHe: 'הסדר הוא a, אחר כך גודל וצבע ואז הדבר. הדבר ביחיד: bus.',
                hintEn: 'Check the order of big, yellow and bus.',
              },
              story: {
                passageEn: 
                  'Eli waits at the stop. A red car goes by. A white van goes by. Then a big yellow one comes with many children. Eli gets in.',
                passageHe: '',
                questionEn: 'What does Eli take?',
                questionHe: '',
                correct: 'a bus',
                wrong: ['a car', 'a van', 'a bike'],
              },
              storyHintEn: 'Which vehicle has many children?',
            },
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'It is a fast car.',
                wrong: ['It is a car fast.'],
                explainHe: 'המילה fast באה לפני car: a fast car.',
                hintHe: 'מה בא לפני שם הדבר?',
              },
              story: {
                passageEn: 'The plane is in the sky. The ship is in the sea. The plane is fast.',
                passageHe: 'המטוס בשמיים. האונייה בים. המטוס מהיר.',
                questionEn: 'Where is the ship?',
                questionHe: 'איפה האונייה?',
                correct: 'in the sea',
                wrong: ['in the sky'],
              },
            },
            challenger: {
              clozeWrong: [
                ['table', 'rock'],
                ['bed', 'hat'],
                ['two', 'ten'],
                ['many', 'two'],
              ],
            },
            master: {
              sentenceEn: 'The fast plane flies over the slow ship.',
              sentenceHe: 'המטוס המהיר טס מעל האונייה האיטית.',
              decoys: ['fly', 'ships'],
              voiceEn: 'My plane is very fast.',
              voiceHe: 'המטוס שלי מהיר מאוד.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The plane is very fast.',
                wrong: ['The plane are very fast.', 'The plane is fast very.', 'The planes is very fast.'],
                explainHe: 'עם plane אחד אומרים is, והמילה very באה לפני fast.',
                hintEn: 'Check is and the place of very.',
              },
              story: {
                passageEn: 
                  'Ron and Gal go to Tel Aviv. Ron goes by plane. Gal goes by ship. The plane takes one hour. The ship takes one day. Gal is on the sea for a long time.',
                passageHe: '',
                questionEn: 'Who gets to Tel Aviv first?',
                questionHe: '',
                correct: 'Ron',
                wrong: ['Gal', 'Both of them', 'Nobody'],
              },
              storyHintEn: 'Which is faster, a plane or a ship?',
            },
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'We see two trains.',
                wrong: ['We see two train.'],
                explainHe: 'אחרי two מוסיפים s: trains.',
                hintHe: 'כמה רכבות? מה קורה לסוף המילה?',
              },
              story: {
                passageEn: 'Dad is a pilot. He has a big plane. The plane is white.',
                passageHe: 'אבא הוא טייס. יש לו מטוס גדול. המטוס לבן.',
                questionEn: 'Who is the pilot?',
                questionHe: 'מי הטייס?',
                correct: 'Dad',
                wrong: ['Mom'],
              },
            },
            challenger: {
              clozeWrong: [
                ['soup', 'door'],
                ['bed', 'cup'],
                ['baby', 'cow'],
                ['milk', 'cake'],
              ],
            },
            master: {
              sentenceEn: 'We take the long train to the city.',
              sentenceHe: 'אנחנו נוסעים ברכבת הארוכה לעיר.',
              decoys: ['takes', 'trains'],
              voiceEn: 'I want to be a pilot.',
              voiceHe: 'אני רוצה להיות טייס/ת.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The long train is very fast.',
                wrong: [
                  'The train long is very fast.',
                  'The long train are very fast.',
                  'The long trains is very fast.',
                ],
                explainHe: 'The long train – אחד, לכן is. מילה שמתארת באה לפני שם הדבר.',
                hintEn: 'Check is and the place of long.',
              },
              story: {
                passageEn: 
                  'Dad has a job. Every morning he puts on a white shirt and a blue hat. He goes to a place with many planes. He sits in front of one big plane and Mom waves. Then the plane goes up into the sky.',
                passageHe: '',
                questionEn: 'What job does Dad have?',
                questionHe: '',
                correct: 'He is a pilot.',
                wrong: ['He is a doctor.', 'He is a teacher.', 'He is a farmer.'],
              },
              storyHintEn: 'Think about planes and the sky.',
            },
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
        sentenceHe: 'העפיפון האדום שלי נמצא על העץ הגדול.',
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
          shortSentenceHe: 'הבלון על העץ.',
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'The kite is in the sky.',
                wrong: ['The kite is on the sky.'],
                explainHe: 'אומרים in the sky: העפיפון בתוך השמיים.',
                hintHe: 'איזו מילה מתאימה ל-sky?',
              },
              story: {
                passageEn: 'A little bird is in a big tree. It sings a nice song. The sun is hot.',
                passageHe: 'ציפור קטנה בתוך עץ גדול. היא שרה שיר יפה. השמש חמה.',
                questionEn: 'What does the bird do?',
                questionHe: 'מה הציפור עושה?',
                correct: 'It sings.',
                wrong: ['It sleeps.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['door', 'book'],
                ['soup', 'milk'],
                ['rain', 'milk'],
                ['rock', 'door'],
              ],
            },
            master: {
              sentenceEn: 'The little bird sits on my blue kite.',
              sentenceHe: 'הציפור הקטנה יושבת על העפיפון הכחול שלי.',
              decoys: ['sit', 'birds'],
              voiceEn: 'My bird is on the tree.',
              voiceHe: 'הציפור שלי על העץ.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The kite is in the big tree.',
                wrong: [
                  'The kite is in big the tree.',
                  'The kite is at the big tree.',
                  'The kite are in the big tree.',
                ],
                explainHe: 'עם kite אחד אומרים is, ומילת המקום כאן היא in. המילה big באה אחרי the.',
                hintEn: 'Check is, the place word, and the order.',
              },
              story: {
                passageEn: 
                  'Dina hears a song in the morning. She looks up. A little bird is on a branch of the big tree. It looks at the park. Then the bird sees a bug and flies down.',
                passageHe: '',
                questionEn: 'Why does the bird fly down?',
                questionHe: '',
                correct: 'It wants to eat.',
                wrong: ['It is cold.', 'It wants to sleep.', 'Dina calls it.'],
              },
              storyHintEn: 'What do birds do with a bug?',
            },
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'The cat is under the chair.',
                wrong: ['The cat under the is chair.'],
                explainHe: 'הסדר הוא is, under, the, ואז הדבר.',
                hintHe: 'איפה המילה under באה?',
              },
              story: {
                passageEn: 'The flower is red. The ant is under the flower. The ant is little.',
                passageHe: 'הפרח אדום. הנמלה מתחת לפרח. הנמלה קטנה.',
                questionEn: 'What is little?',
                questionHe: 'מה קטן?',
                correct: 'the ant',
                wrong: ['the flower'],
              },
            },
            challenger: {
              clozeWrong: [
                ['rain', 'sky'],
                ['song', 'sky'],
                ['rain', 'milk'],
                ['song', 'color'],
              ],
            },
            master: {
              sentenceEn: 'The ant hides under the red flower.',
              sentenceHe: 'הנמלה מתחבאת מתחת לפרח האדום.',
              decoys: ['hide', 'flowers'],
              voiceEn: 'I put the basket on the grass.',
              voiceHe: 'אני שם/ה את הסלסלה על הדשא.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'A little ant is under my hat.',
                wrong: [
                  'A little ant under is my hat.',
                  'A little ant is under me hat.',
                  'A little ants is under my hat.',
                ],
                explainHe: 'under פירושו מתחת. is בא לפני under, ו-my באה לפני הדבר. נמלה אחת: ant.',
                hintEn: 'Check the place of is, my, and the end of ant.',
              },
              story: {
                passageEn: 
                  'Gal has a picnic basket. She puts it on the grass and goes to play. Later she comes back and sees a small black line near the basket. It goes under the basket and comes out with a piece of bread. Gal laughs.',
                passageHe: '',
                questionEn: 'What is the small black line?',
                questionHe: '',
                correct: 'Many ants',
                wrong: ['A black snake', 'A long string', 'Some black hair'],
              },
              storyHintEn: 'What little animals love picnic food?',
            },
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which question is right?',
                correct: 'Where is my friend?',
                wrong: ['Where my friend is?'],
                explainHe: 'בשאלה קודם Where, אחר כך is.',
                hintHe: 'מה בא מיד אחרי Where?',
              },
              story: {
                passageEn: 'My friend has a cap. The cap is blue. We play in the sand.',
                passageHe: 'לחבר שלי יש כובע מצחייה. הוא כחול. אנחנו משחקים בחול.',
                questionEn: 'Where do we play?',
                questionHe: 'איפה אנחנו משחקים?',
                correct: 'in the sand',
                wrong: ['in the box'],
              },
            },
            challenger: {
              clozeWrong: [
                ['pencil', 'chair'],
                ['book', 'bus'],
                ['rain', 'snow'],
                ['snow', 'ice'],
              ],
            },
            master: {
              sentenceEn: 'My friend and I play under the sun.',
              sentenceHe: 'החבר שלי ואני משחקים בשמש.',
              decoys: ['plays', 'sand'],
              voiceEn: 'Where is my red cap?',
              voiceHe: 'איפה הכובע האדום שלי?',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Our caps are in the bag.',
                wrong: ['Our caps is in the bag.', 'Our cap are in the bag.', 'Our caps are on in the bag.'],
                explainHe: 'כשיש יותר מכובע אחד: caps ו-are. ואחרי are בא המקום: in the bag.',
                hintEn: 'Check caps, are, and the place word.',
              },
              story: {
                passageEn: 
                  'It is a hot day. Dan has a cap, but Lea has no cap. Lea says, My head is hot. Dan gives Lea his cap and sits under the tree. Now Lea is happy.',
                passageHe: '',
                questionEn: 'Why does Dan sit under the tree?',
                questionHe: '',
                correct: 'He has no cap now.',
                wrong: ['He is sleepy.', 'He wants a flower.', 'Lea says no.'],
              },
              storyHintEn: 'Dan gave his cap away. Where is it cool?',
            },
          },
        },
      },
    ],
  },
];

export const CORE_PLUS_GRADE_2_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-2', UNITS);
