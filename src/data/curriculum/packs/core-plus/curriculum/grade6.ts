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
          ['forest', 'noun', 'יער', '🌲', 'Many birds live in the forest.', 'הרבה ציפורים גרות ביער.'],
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
        },
      },
    ],
  },
];

export const CORE_PLUS_GRADE_6_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-6', UNITS);
