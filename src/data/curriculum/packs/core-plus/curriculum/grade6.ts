import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * Core-plus ("Season 2") grade 6 units: irregular Past Simple on trips (after unit 3's was / were
 * and -ed), then superlatives (-est, the most) after unit 4's comparatives. The records Boss is
 * the grade's new finale.
 */
const UNITS: ElementaryUnitSpec[] = [
  {
    ...packUnitNumbers('core-plus', 0),
    titleEn: 'Trip Stories: Went, Saw, Ate',
    titleHe: 'סיפורי טיולים: went, saw, ate',
    subtitleHe: 'עונה 2: פעלים לא רגילים בעבר (go → went, see → saw) וטיולים בארץ',
    badgeEmoji: '🧳',
    missions: [
      {
        icon: '🚂',
        titleEn: 'The Train to the North',
        titleHe: 'הרכבת לצפון',
        storyHookHe: 'עונה 2 מתחילה ברכבת! נספר על טיול שהיה, עם פעלים מיוחדים בעבר כמו went ו-took.',
        grammarTopic: 'Past Simple: Irregular Verbs (go → went, take → took)',
        skills: ['Irregular Past', 'Travel Words', 'Voice Practice'],
        sentenceEn: 'Last summer we took the train to the north and went to a forest.',
        sentenceHe: 'בקיץ שעבר נסענו ברכבת לצפון והלכנו ליער.',
        vocab: [
          ['trip', 'noun', 'טיול', '🧳', 'Our class trip is in May.', 'הטיול של הכיתה שלנו במאי.'],
          ['train', 'noun', 'רכבת', '🚆', 'The train is fast and quiet.', 'הרכבת מהירה ושקטה.'],
          ['map', 'noun', 'מפה', '🗺️', 'Dad keeps a map of Israel in the car.', 'אבא שומר מפה של ישראל באוטו.'],
          ['forest', 'noun', 'יער', '🌲', 'Many birds live in the forest.', 'הרבה ציפורים חיות ביער.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'pillow', translationHe: 'כרית' },
            { wordEn: 'kettle', translationHe: 'קומקום' },
          ],
          shortSentenceEn: 'We went by train.',
          shortSentenceHe: 'נסענו ברכבת.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'Yesterday we went to the forest.',
            wrong: ['Yesterday we goed to the forest.', 'Yesterday we go to the forest.'],
            explainHe: 'go הוא פועל לא רגיל: בעבר הוא הופך ל-went, ולא goed.',
            hintHe: 'yesterday זה עבר. go הוא פועל לא רגיל: אין לו ed, יש לו צורת עבר מיוחדת.',
          },
          story: {
            passageEn:
              "Last spring Omer's family went on a trip to the north. They took an early train from Tel Aviv. In the afternoon they walked in a green forest. Omer had a map, so nobody got lost. They came home late at night.",
            passageHe:
              'באביב שעבר המשפחה של עומר יצאה לטיול בצפון. הם נסעו ברכבת מוקדמת מתל אביב. אחר הצהריים הם טיילו ביער ירוק. לעומר הייתה מפה, אז אף אחד לא הלך לאיבוד. הם חזרו הביתה מאוחר בלילה.',
            questionEn: 'How did the family travel to the north?',
            questionHe: 'איך המשפחה נסעה לצפון?',
            correct: 'by train',
            wrong: ['by car', 'by bus'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'Last week we went to the zoo.',
                wrong: ['Last week we goed to the zoo.'],
                explainHe: 'go הוא פועל לא רגיל: בעבר went, לא goed.',
                hintHe: 'last week הוא עבר. האם go מקבל ed?',
              },
              story: {
                passageEn: 'We took a train to the sea. The train was quick. We saw a boat.',
                passageHe: 'נסענו ברכבת לים. הרכבת הייתה מהירה. ראינו סירה.',
                questionEn: 'What did we see?',
                questionHe: 'מה ראינו?',
                correct: 'a boat',
                wrong: ['a plane'],
              },
            },
            challenger: {
              clozeWrong: [
                ['pencil', 'window'],
                ['sofa', 'sandwich'],
                ['river', 'mountain'],
                ['pocket', 'envelope'],
              ],
            },
            master: {
              sentenceEn: 'Last week my uncle took the train to Haifa.',
              sentenceHe: 'בשבוע שעבר דודי נסע ברכבת לחיפה.',
              decoys: ['taked', 'go'],
              voiceEn: 'We saw a bird in the forest.',
              voiceHe: 'ראינו ציפור ביער.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Last month we went to the north.',
                wrong: [
                  'Last month we goed to the far north.',
                  'Last month we go to the north.',
                  'Last month we gone to the north.',
                ],
                explainHe: 'go הוא פועל לא רגיל, ובעבר הוא went. לא goed, לא go ולא gone.',
                hintEn: 'Last month tells you the time. Is go regular?',
              },
              story: {
                passageEn: 
                  'Ofir took a map on the school trip, but the map was old. At the forest, the road on the map was missing. The group walked for twenty minutes and came back to the same big tree. Then Ofir saw a green sign with an arrow. The teacher smiled and they followed it to the river.',
                passageHe: '',
                questionEn: 'Why did the group come back to the same tree?',
                questionHe: '',
                correct: 'The old map did not show the new road.',
                wrong: [
                  'The teacher wanted to rest there.',
                  'They liked that big tree very much and stayed.',
                  'Ofir lost his map on the way.',
                ],
              },
              storyHintEn: 'What was wrong with the map?',
            },
          },
        },
      },
      {
        icon: '⛰️',
        titleEn: 'Hike Day: What We Saw',
        titleHe: 'יום טיול: מה ראינו',
        storyHookHe: 'עולים על ההר! נספר מה ראינו, מה אכלנו ומה עשינו עם saw, ate ו-had.',
        grammarTopic: 'Past Simple: More Irregular Verbs (see → saw, eat → ate)',
        skills: ['Irregular Past', 'Nature Words', 'Reading'],
        sentenceEn: 'We climbed the mountain, saw a river and had a picnic.',
        sentenceHe: 'טיפסנו על ההר, ראינו נהר ועשינו פיקניק.',
        vocab: [
          ['hike', 'noun', 'טיול רגלי', '🧗', 'The hike starts early in the morning.', 'הטיול הרגלי מתחיל מוקדם בבוקר.'],
          ['mountain', 'noun', 'הר', '⛰️', 'The mountain is high and green.', 'ההר גבוה וירוק.'],
          ['river', 'noun', 'נהר', '🌊', 'Fish swim in the river.', 'דגים שוחים בנהר.'],
          ['picnic', 'noun', 'פיקניק', '🧺', 'We have a picnic in the park on Saturdays.', 'אנחנו עושים פיקניק בפארק בשבתות.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'oven', translationHe: 'תנור' },
            { wordEn: 'printer', translationHe: 'מדפסת' },
          ],
          shortSentenceEn: 'We saw a river.',
          shortSentenceHe: 'ראינו נהר.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'Yesterday we ate sandwiches on the mountain.',
            wrong: ['Yesterday we eated sandwiches on the mountain.', 'Yesterday we eat sandwiches on the mountain.'],
            explainHe: 'eat הוא פועל לא רגיל, ובעבר הוא ate. לא אומרים eated.',
            hintHe: 'yesterday זה עבר, ו-eat הוא פועל לא רגיל: בעבר הוא משנה את הצורה שלו, בלי ed.',
          },
          story: {
            passageEn:
              "On Friday Shira's class went on a hike. They climbed a small mountain in the Galilee. From the top they saw a long river. At noon they had a picnic under a big tree. Shira ate a cheese sandwich and an apple.",
            passageHe:
              'ביום שישי הכיתה של שירה יצאה לטיול רגלי. הם טיפסו על הר קטן בגליל. מהפסגה הם ראו נהר ארוך. בצהריים הם עשו פיקניק מתחת לעץ גדול. שירה אכלה כריך גבינה ותפוח.',
            questionEn: 'What did they see from the top?',
            questionHe: 'מה הם ראו מהפסגה?',
            correct: 'a long river',
            wrong: ['a big lake', 'a train'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'Yesterday we saw a big bird.',
                wrong: ['Yesterday we seed a big bird.'],
                explainHe: 'see הוא פועל לא רגיל: בעבר saw, לא seed.',
                hintHe: 'yesterday הוא עבר. האם see מקבל ed?',
              },
              story: {
                passageEn: 'We had a picnic by the river. We ate bread. The bread was fresh.',
                passageHe: 'עשינו פיקניק ליד הנהר. אכלנו לחם. הלחם היה טרי.',
                questionEn: 'Where was the picnic?',
                questionHe: 'איפה היה הפיקניק?',
                correct: 'by the river',
                wrong: ['on the beach'],
              },
            },
            challenger: {
              clozeWrong: [
                ['window', 'sofa'],
                ['spoon', 'doctor'],
                ['sofa', 'desert'],
                ['yesterday', 'tomorrow'],
              ],
            },
            master: {
              sentenceEn: 'Last Friday we climbed a mountain and ate lunch.',
              sentenceHe: 'ביום שישי שעבר טיפסנו על הר ואכלנו ארוחת צהריים.',
              decoys: ['climb', 'eated'],
              voiceEn: 'We saw a river from the top.',
              voiceHe: 'ראינו נהר מהפסגה.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Last weekend we saw a small river.',
                wrong: [
                  'Last weekend we seed a small river.',
                  'Last weekend we see a small river.',
                  'Last weekend we seen a small river.',
                ],
                explainHe: 'see הוא פועל לא רגיל, ובעבר הוא saw. לא seed, לא see ולא seen.',
                hintEn: 'Last weekend is past. Check the form of see.',
              },
              story: {
                passageEn: 
                  'The hikers walked up the mountain for two hours. Near the top, Yoni stopped and drank all his water. His friend Alma still had half a bottle. She gave him some, and they reached the top together. Yoni said that next time he will take a bigger bottle.',
                passageHe: '',
                questionEn: 'Why did Yoni say he will take a bigger bottle next time?',
                questionHe: '',
                correct: 'He finished his water too early.',
                wrong: [
                  'He lost his bottle on the hike.',
                  'Alma had no water at all.',
                  'The bottle was too heavy for Alma.',
                ],
              },
              storyHintEn: 'What did Yoni do near the top?',
            },
          },
        },
      },
      {
        icon: '📷',
        isBoss: true,
        titleEn: 'Boss: My Trip Diary',
        titleHe: 'אתגר הבוס: יומן הטיול שלי',
        storyHookHe: 'הטיול נגמר, ועכשיו כותבים יומן! הראו שאתם יודעים פעלים רגילים ולא רגילים בעבר.',
        grammarTopic: 'Review: Regular & Irregular Past Simple',
        skills: ['Review', 'Past Simple', 'Reading'],
        sentenceEn: 'In my diary I wrote about the museum and the airport.',
        sentenceHe: 'ביומן שלי כתבתי על המוזיאון ועל שדה התעופה.',
        vocab: [
          ['diary', 'noun', 'יומן', '📔', 'I write in my diary every night.', 'אני כותב/ת ביומן שלי בכל לילה.'],
          ['camera', 'noun', 'מצלמה', '📷', 'My camera takes great pictures.', 'המצלמה שלי מצלמת תמונות נהדרות.'],
          ['museum', 'noun', 'מוזיאון', '🏛️', 'The museum has old coins and maps.', 'במוזיאון יש מטבעות ומפות עתיקים.'],
          ['airport', 'noun', 'שדה תעופה', '✈️', 'The airport is busy in summer.', 'שדה התעופה עמוס בקיץ.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'sofa', translationHe: 'ספה' },
            { wordEn: 'bucket', translationHe: 'דלי' },
          ],
          shortSentenceEn: 'I wrote in my diary.',
          shortSentenceHe: 'כתבתי ביומן שלי.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'We visited a museum and saw old maps.',
            wrong: ['We visited a museum and seed old maps.', 'We visit a museum and saw old maps.'],
            explainHe: 'visit הוא פועל רגיל ולכן visited, ו-see הוא פועל לא רגיל ולכן saw. שני הפעלים בעבר.',
            hintHe: 'בדקו את שני הפעלים: שניהם צריכים להיות בעבר. visit הוא פועל רגיל, ו-see הוא פועל לא רגיל.',
          },
          story: {
            passageEn:
              'Last week Gal flew to Eilat with her parents. At the airport she bought a small diary. In Eilat they visited an underwater museum. Gal took many photos with her new camera. That night she wrote three pages in her diary.',
            passageHe:
              'בשבוע שעבר גל טסה לאילת עם ההורים שלה. בשדה התעופה היא קנתה יומן קטן. באילת הם ביקרו במוזיאון תת-ימי. גל צילמה הרבה תמונות במצלמה החדשה שלה. באותו לילה היא כתבה שלושה עמודים ביומן.',
            questionEn: 'What did Gal buy at the airport?',
            questionHe: 'מה גל קנתה בשדה התעופה?',
            correct: 'a small diary',
            wrong: ['a new camera', 'a map'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'Yesterday I wrote in my diary.',
                wrong: ['Yesterday I writed in my diary.'],
                explainHe: 'write הוא פועל לא רגיל: בעבר wrote, לא writed.',
                hintHe: 'yesterday הוא עבר. האם write מקבל ed?',
              },
              story: {
                passageEn: 'Gal has a camera. She took a photo of a bird. The photo is nice.',
                passageHe: 'לגל יש מצלמה. היא צילמה תמונה של ציפור. התמונה יפה.',
                questionEn: 'What did Gal take a photo of?',
                questionHe: 'מה גל צילמה?',
                correct: 'a bird',
                wrong: ['a car'],
              },
            },
            challenger: {
              clozeWrong: [
                ['spoon', 'carrot'],
                ['spoon', 'sofa'],
                ['sandwich', 'pillow'],
                ['pencil', 'sock'],
              ],
            },
            master: {
              sentenceEn: 'Last summer we flew to Rome and visited a museum.',
              sentenceHe: 'בקיץ שעבר טסנו לרומא וביקרנו במוזיאון.',
              decoys: ['fly', 'visit'],
              voiceEn: 'I took many photos with my camera.',
              voiceHe: 'צילמתי הרבה תמונות במצלמה שלי.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'We flew to Eilat and visited a museum.',
                wrong: [
                  'We flied to Eilat and visited a museum.',
                  'We fly to Eilat and visited a museum.',
                  'We flew to Eilat and visit a museum.',
                ],
                explainHe: 'שני הפעלים בעבר: fly הוא לא רגיל (flew), ו-visit רגיל (visited).',
                hintEn: 'Both verbs need a past form.',
              },
              story: {
                passageEn: 
                  'Dina went to the airport with her grandparents. Her flight was at nine, but the airport was very full. At the check-in desk the worker said there was a problem with the computer. Her grandfather stayed calm and told jokes. After an hour the line moved and the family got their tickets.',
                passageHe: '',
                questionEn: 'Why did the grandfather tell jokes?',
                questionHe: '',
                correct: 'He wanted everyone to stay calm.',
                wrong: [
                  'He was angry at the worker and left.',
                  'He wanted to buy new tickets.',
                  'The flight was not at nine.',
                ],
              },
              storyHintEn: 'Think about how people felt in the long line.',
            },
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('core-plus', 1),
    titleEn: 'Record Breakers: The Best of All',
    titleHe: 'שוברי שיאים: הכי טובים שיש',
    subtitleHe: 'עונה 2: הכי (the tallest, the most famous) והגמר החדש של כיתה ו׳',
    badgeEmoji: '🏆',
    missions: [
      {
        icon: '🦒',
        titleEn: 'The Tallest Animal in the Zoo',
        titleHe: 'החיה הכי גבוהה בגן החיות',
        storyHookHe: 'יוצאים לגן החיות לחפש שיאים! נלמד להגיד "הכי" עם the ו-est.',
        grammarTopic: 'Superlatives with -est (the tallest, the biggest)',
        skills: ['Superlatives -est', 'Animal Records', 'Voice Practice'],
        sentenceEn: 'The giraffe is the tallest animal in the zoo.',
        sentenceHe: 'הג׳ירפה היא החיה הכי גבוהה בגן החיות.',
        vocab: [
          ['tallest', 'adjective', 'הכי גבוה', '🦒', 'Dan is the tallest boy in our class.', 'דן הוא הילד הכי גבוה בכיתה שלנו.'],
          ['whale', 'noun', 'לווייתן', '🐳', 'A whale lives in the ocean.', 'לווייתן חי באוקיינוס.'],
          ['heaviest', 'adjective', 'הכי כבד', '⚖️', 'This box is the heaviest one.', 'הקופסה הזאת היא הכי כבדה.'],
          ['smallest', 'adjective', 'הכי קטן', '🐜', 'The ant is the smallest animal here.', 'הנמלה היא החיה הכי קטנה כאן.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'kettle', translationHe: 'קומקום' },
            { wordEn: 'pencil', translationHe: 'עיפרון' },
          ],
          shortSentenceEn: 'The whale is the biggest.',
          shortSentenceHe: 'הלווייתן הוא הכי גדול.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'The blue whale is the biggest animal.',
            wrong: ['The blue whale is the bigest animal.', 'The blue whale is the most big animal.'],
            explainHe: 'בתואר קצר מוסיפים est: big הופך ל-the biggest (עם g כפולה). את most שמים רק לפני תארים ארוכים.',
            hintHe: 'big הוא תואר קצר שנגמר בעיצור אחרי תנועה אחת, ולכן מכפילים את האות האחרונה לפני הסיומת.',
          },
          story: {
            passageEn:
              'Our class visited the Safari in Ramat Gan. First we saw the giraffes. The tallest giraffe was five meters tall. Then we saw the elephants. The heaviest elephant ate a lot of hay.',
            passageHe:
              'הכיתה שלנו ביקרה בספארי ברמת גן. קודם ראינו את הג׳ירפות. הג׳ירפה הכי גבוהה הייתה בגובה חמישה מטרים. אחר כך ראינו את הפילים. הפיל הכי כבד אכל הרבה חציר.',
            questionEn: 'Which animals did the class see first?',
            questionHe: 'אילו חיות הכיתה ראתה קודם?',
            correct: 'the giraffes',
            wrong: ['the elephants', 'the whales'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'The lion is the strongest animal.',
                wrong: ['The lion is the most strong animal.'],
                explainHe: 'בתואר קצר מוסיפים est: the strongest. לא most.',
                hintHe: 'האם strong הוא תואר קצר או ארוך?',
              },
              story: {
                passageEn: 'A mouse is small. A bee is smaller. The ant is the smallest.',
                passageHe: 'עכבר הוא קטן. דבורה קטנה יותר. הנמלה היא הכי קטנה.',
                questionEn: 'Which animal is the smallest?',
                questionHe: 'איזו חיה היא הכי קטנה?',
                correct: 'the ant',
                wrong: ['the mouse'],
              },
            },
            challenger: {
              clozeWrong: [
                ['tale', 'table'],
                ['carrot', 'spoon'],
                ['heaven', 'heater'],
                ['smile', 'smell'],
              ],
            },
            master: {
              sentenceEn: 'The blue whale is the heaviest animal in the sea.',
              sentenceHe: 'הלווייתן הכחול הוא החיה הכי כבדה בים.',
              decoys: ['heavyest', 'most'],
              voiceEn: 'My brother is the tallest in our family.',
              voiceHe: 'אחי הוא הכי גבוה במשפחה שלנו.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'This hill is the highest place in our town.',
                wrong: [
                  'This hill is the most high place in our town.',
                  'This hill is the higher place in our town.',
                  'This hill is highest place in our town.',
                ],
                explainHe: 
                  'בתואר קצר מוסיפים est ושמים the לפניו: the highest. לא most, לא er, ולא לשכוח את the.',
                hintEn: 'Look for the word the and the adjective ending.',
              },
              story: {
                passageEn: 
                  'Tali and her little brother Gil visited the zoo. Gil wanted to see the tallest animal, so they walked to the giraffes. But the line was long and Gil was tired. Tali lifted him on her shoulders, and now Gil could see over everybody. He shouted that he was taller than the giraffe!',
                passageHe: '',
                questionEn: 'Why did Tali lift Gil on her shoulders?',
                questionHe: '',
                correct: 'He could not see the giraffes well.',
                wrong: [
                  'He was too tired to walk home from the zoo.',
                  'The giraffes were hiding.',
                  'He wanted to be taller than Tali.',
                ],
              },
              storyHintEn: 'What was long in front of the giraffes?',
            },
          },
        },
      },
      {
        icon: '🥇',
        titleEn: 'The Most Amazing Records',
        titleHe: 'השיאים הכי מדהימים',
        storyHookHe: 'בספר השיאים יש דברים מדהימים! נלמד להגיד "הכי" עם תארים ארוכים בעזרת the most.',
        grammarTopic: 'Superlatives with most (the most famous)',
        skills: ['the most + Adjective', 'Record Words', 'Reading'],
        sentenceEn: 'She is the most famous champion in our town.',
        sentenceHe: 'היא האלופה הכי מפורסמת בעיר שלנו.',
        vocab: [
          ['champion', 'noun', 'אלוף / אלופה', '🥇', 'The tennis champion trains every day.', 'אלופת הטניס מתאמנת כל יום.'],
          ['amazing', 'adjective', 'מדהים', '🤩', 'The view from the roof is amazing.', 'הנוף מהגג מדהים.'],
          ['famous', 'adjective', 'מפורסם', '🌟', 'He is a famous singer.', 'הוא זמר מפורסם.'],
          ['popular', 'adjective', 'פופולרי / אהוב', '👥', 'Football is a popular game in Israel.', 'כדורגל הוא משחק פופולרי בישראל.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'onion', translationHe: 'בצל' },
            { wordEn: 'ladder', translationHe: 'סולם' },
          ],
          shortSentenceEn: 'It is the most amazing.',
          shortSentenceHe: 'זה הכי מדהים.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'This is the most popular game in our school.',
            wrong: ['This is the popularest game in our school.', 'This is the more popular game in our school.'],
            explainHe: 'בתואר ארוך כמו popular שמים the most לפניו. more משמש להשוואה בין שניים, ולא אומרים popularest.',
            hintHe: 'popular הוא תואר ארוך: לא מוסיפים לו סיומת, וגם לא משתמשים במילה של השוואה בין שניים.',
          },
          story: {
            passageEn:
              'Tamar plays chess. Last year she was the youngest champion in Israel. Now she is the most famous girl in her school. Her games are very popular online. Everyone thinks she is amazing.',
            passageHe:
              'תמר משחקת שחמט. בשנה שעברה היא הייתה האלופה הכי צעירה בישראל. עכשיו היא הילדה הכי מפורסמת בבית הספר שלה. המשחקים שלה פופולריים מאוד ברשת. כולם חושבים שהיא מדהימה.',
            questionEn: 'What game does Tamar play?',
            questionHe: 'באיזה משחק תמר משחקת?',
            correct: 'chess',
            wrong: ['tennis', 'football'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'She is the most famous singer.',
                wrong: ['She is the famousest singer.'],
                explainHe: 'בתואר ארוך כמו famous שמים the most לפניו.',
                hintHe: 'האם famous הוא תואר קצר או ארוך?',
              },
              story: {
                passageEn: 'Ron is a champion swimmer. He swims very fast. Everyone knows him.',
                passageHe: 'רון הוא שחיין אלוף. הוא שוחה מהר מאוד. כולם מכירים אותו.',
                questionEn: 'What is Ron?',
                questionHe: 'מה רון?',
                correct: 'a champion swimmer',
                wrong: ['a famous singer'],
              },
            },
            challenger: {
              clozeWrong: [
                ['cheese', 'pencil'],
                ['hungry', 'thirsty'],
                ['happily', 'quickly'],
                ['carefully', 'slowly'],
              ],
            },
            master: {
              sentenceEn: 'Basketball is the most popular sport in our school.',
              sentenceHe: 'כדורסל הוא ענף הספורט הכי פופולרי בבית הספר שלנו.',
              decoys: ['popularest', 'more'],
              voiceEn: 'That singer is very famous.',
              voiceHe: 'הזמר הזה מפורסם מאוד.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'This is the most amazing story ever.',
                wrong: [
                  'This is the amazingest story ever told.',
                  'This is the more amazing story ever.',
                  'This is the amazing most story ever.',
                ],
                explainHe: 
                  'בתואר ארוך כמו amazing שמים the most לפניו. לא מוסיפים est, ולא משתמשים ב-more.',
                hintEn: 'Is amazing a short or a long adjective?',
              },
              story: {
                passageEn: 
                  'Everybody in the town knows Hila, the best swimmer in the school. Last year she won two golden medals. Today she is teaching small children to swim. A little boy asks for her signature, and Hila writes her name on his hand. He runs to show it to his mother.',
                passageHe: '',
                questionEn: 'Why does a little boy ask Hila for her signature?',
                questionHe: '',
                correct: 'She is a famous champion in town.',
                wrong: [
                  'He needs her name for homework.',
                  'She is his new neighbor from the next house.',
                  'He wants to win a medal.',
                ],
              },
              storyHintEn: 'Who knows Hila in town?',
            },
          },
        },
      },
      {
        icon: '🏆',
        isBoss: true,
        titleEn: 'Boss: Season 2 Finale',
        titleHe: 'אתגר הבוס: גמר עונה 2 – אלופי כיתה ו׳',
        storyHookHe: 'זה הגמר החדש של כיתה ו׳! הראו שאתם יודעים -er, -est, more ו-most, וגם פעלים בעבר.',
        grammarTopic: 'Review: Comparatives & Superlatives',
        skills: ['Review', '-er / -est / most', 'Reading'],
        sentenceEn: 'Our team won the biggest prize and every player got a medal.',
        sentenceHe: 'הקבוצה שלנו זכתה בפרס הכי גדול וכל שחקן קיבל מדליה.',
        vocab: [
          ['winner', 'noun', 'מנצח / מנצחת', '🏆', 'The winner gets a gold cup.', 'המנצח מקבל גביע זהב.'],
          ['prize', 'noun', 'פרס', '🎖️', 'The first prize is a new bike.', 'הפרס הראשון הוא אופניים חדשים.'],
          ['medal', 'noun', 'מדליה', '🏅', 'She has a silver medal from the race.', 'יש לה מדליית כסף מהמרוץ.'],
          ['team', 'noun', 'קבוצה', '🤝', 'Our team practices on Mondays.', 'הקבוצה שלנו מתאמנת בימי שני.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'carrot', translationHe: 'גזר' },
            { wordEn: 'blanket', translationHe: 'שמיכה' },
          ],
          shortSentenceEn: 'We are the winners!',
          shortSentenceHe: 'אנחנו המנצחים!',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'Noa is faster than Lia, but Maya is the fastest.',
            wrong: [
              'Noa is fastest than Lia, but Maya is the faster.',
              'Noa is faster than Lia, but Maya is the most fast.',
            ],
            explainHe: 'בהשוואה בין שניים: faster than. "הכי" מכולם: the fastest. fast הוא תואר קצר, ולכן לא most.',
            hintHe: 'כשמשווים שניים יש צורה אחת, וכשמישהו הכי טוב מכל הקבוצה יש צורה אחרת. fast הוא תואר קצר.',
          },
          story: {
            passageEn:
              'The school sports day was last Thursday. There were six teams. The red team was the fastest in the race. The blue team won the biggest prize, a trip to the beach. Every winner got a medal.',
            passageHe:
              'יום הספורט של בית הספר היה ביום חמישי שעבר. היו שש קבוצות. הקבוצה האדומה הייתה הכי מהירה במרוץ. הקבוצה הכחולה זכתה בפרס הכי גדול, טיול לחוף הים. כל מנצח קיבל מדליה.',
            questionEn: 'Which team won the biggest prize?',
            questionHe: 'איזו קבוצה זכתה בפרס הכי גדול?',
            correct: 'the blue team',
            wrong: ['the red team', 'the green team'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'Our team is the fastest.',
                wrong: ['Our team is the most fast.'],
                explainHe: 'בתואר קצר מוסיפים est: the fastest.',
                hintHe: 'fast הוא תואר קצר. מה מוסיפים לו?',
              },
              story: {
                passageEn: 'The green team ran fast. The yellow team ran faster. Yellow won the race.',
                passageHe: 'הקבוצה הירוקה רצה מהר. הקבוצה הצהובה רצה מהר יותר. הצהובה ניצחה במרוץ.',
                questionEn: 'Which team won?',
                questionHe: 'איזו קבוצה ניצחה?',
                correct: 'the yellow team',
                wrong: ['the green team'],
              },
            },
            challenger: {
              clozeWrong: [
                ['window', 'pencil'],
                ['bottle', 'sock'],
                ['sofa', 'carrot'],
                ['kitchen', 'spoon'],
              ],
            },
            master: {
              sentenceEn: 'The fastest runner in our team won a gold medal.',
              sentenceHe: 'הרץ הכי מהיר בקבוצה שלנו זכה במדליית זהב.',
              decoys: ['faster', 'win'],
              voiceEn: 'Our team is stronger than yours.',
              voiceHe: 'הקבוצה שלנו חזקה יותר משלכם.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Dana is taller than Lior, but Tom is the tallest.',
                wrong: [
                  'Dana is tallest than Lior, but Tom is the taller.',
                  'Dana is taller than Lior, but Tom is the most tall.',
                  'Dana is more tall than Lior, but Tom is the tallest.',
                ],
                explainHe: 
                  'בין שניים: taller than. הכי מכולם: the tallest. tall הוא תואר קצר ולכן לא more ולא most.',
                hintEn: 'Two people use one form, the whole group another.',
              },
              story: {
                passageEn: 
                  'The race was almost over. Maya was first, and Noa was close behind her. At the last corner Maya fell and her shoe came off. Noa stopped, helped Maya stand up, and they crossed the line together. The teacher gave both girls a medal for good sport.',
                passageHe: '',
                questionEn: 'Why did the teacher give both girls a medal?',
                questionHe: '',
                correct: 'They showed kindness during the race.',
                wrong: [
                  'They both ran much faster than all the others.',
                  'Maya won the race alone.',
                  'Noa lost her shoe.',
                ],
              },
              storyHintEn: 'What did Noa do at the corner?',
            },
          },
        },
      },
    ],
  },
];

export const CORE_PLUS_GRADE_6_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-6', UNITS);
