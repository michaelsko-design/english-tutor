import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-4 grade 5 unit (Band I): be going to for plans (I am going to visit…) and its
 * questions and short answers (Are you going to…? Yes, I am), about weekend plans, with Band I
 * words the app never taught or taught only later (Core II "be going to do sth", "I don't mind",
 * "enjoy yourself"…). Example Hebrew uses slash forms for "I"; "you" is plural; hints and
 * explanations are gender-neutral plural. Word emoji reuse drawn pictures until the unit's own
 * are drawn.
 */
const UNIT_CORE_4: ElementaryUnitSpec = {
  ...packUnitNumbers('core-4'),
  titleEn: 'Weekend Plans',
  titleHe: 'תוכניות לסוף השבוע',
  subtitleHe: 'עונה 4: מתכננים עם going to: I am going to…, Are you going to…?',
  badgeEmoji: '📋',
  missions: [
    {
      icon: '🗓️',
      titleEn: 'I\'m Going to…',
      titleHe: 'אני הולך/ת ל…',
      storyHookHe: 'מה התוכנית לסוף השבוע? נלמד לספר על תוכניות עם going to: I am going to visit Grandma.',
      grammarTopic: 'be going to + verb (plans)',
      skills: ['going to', 'Plans', 'Weekend'],
      sentenceEn: 'This weekend we are going to visit our cousins.',
      sentenceHe: 'בסוף השבוע הזה אנחנו הולכים לבקר את בני הדודים שלנו.',
      vocab: [
        ['plan to', 'phrase', 'לתכנן ל...', '📋', 'We plan to visit the zoo, and we are going to take photos.', 'אנחנו מתכננים לבקר בגן החיות, ואנחנו הולכים לצלם.'],
        ['invite', 'verb', 'להזמין', '💌', 'I am going to invite my friends to my party.', 'אני הולך/ת להזמין את החברים שלי למסיבה שלי.'],
        ['visit', 'verb', 'לבקר', '👵', 'On Friday we are going to visit Grandma.', 'ביום שישי אנחנו הולכים לבקר את סבתא.'],
        ['go shopping', 'phrase', 'ללכת לקניות', '🛒', 'Mom and I are going to go shopping for new shoes.', 'אמא ואני הולכים לקנות נעליים חדשות.'],
        ['neighbor', 'noun', 'שכן / שכנה', '🏘️', 'Our neighbor is going to help us paint the fence.', 'השכן שלנו הולך לעזור לנו לצבוע את הגדר.'],
        ['need to', 'phrase', 'צריך ל...', '🎒', 'I need to pack my bag before the trip.', 'אני צריך/ה לארוז את התיק לפני הטיול.'],
        ['a.m.', 'abbreviation', 'בבוקר (לפני הצהריים)', '⏰', 'The train is going to leave at 9 a.m.', 'הרכבת הולכת לצאת בתשע בבוקר.'],
        ['till', 'preposition', 'עד', '🕓', 'We are going to stay at the beach till five.', 'אנחנו הולכים להישאר בחוף עד חמש.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'shelf', translationHe: 'מדף' },
          { wordEn: 'onion', translationHe: 'בצל' },
        ],
        shortSentenceEn: 'I am going to swim.',
        shortSentenceHe: 'אני הולך/ת לשחות.',
        rule: {
          questionEn: 'Talk about a plan. Which sentence is right?',
          correct: 'I am going to play soccer tomorrow.',
          wrong: ['I going to play soccer tomorrow.', 'I am going play soccer tomorrow.'],
          explainHe: 'תוכנית לעתיד: am / is / are, ואחריו going to ופועל: I am going to play.',
          hintHe: 'בדקו שיש am וגם to.',
        },
        story: {
          passageEn:
            'It is Thursday. Omer has a big plan for the weekend. On Friday he is going to visit his grandpa. On Saturday he is going to go to the beach with his friends. They are going to stay there till the evening.',
          passageHe:
            'יום חמישי. לעומר יש תוכנית גדולה לסוף השבוע. ביום שישי הוא הולך לבקר את סבא שלו. בשבת הוא הולך לים עם החברים שלו. הם הולכים להישאר שם עד הערב.',
          questionEn: 'Who is Omer going to visit on Friday?',
          questionHe: 'את מי עומר הולך לבקר ביום שישי?',
          correct: 'his grandpa',
          wrong: ['his friends', 'his neighbor'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is about the future?',
              correct: 'I am going to read a book.',
              wrong: ['I read a book every day.'],
              explainHe: 'going to מספר מה נעשה בעתיד.',
              hintHe: 'חפשו going to.',
            },
            story: {
              passageEn: 'Tomorrow Dana is going to go shopping. She needs to buy a new bag.',
              passageHe: 'מחר דנה הולכת לקניות. היא צריכה לקנות תיק חדש.',
              questionEn: 'What does Dana need to buy?',
              questionHe: 'מה דנה צריכה לקנות?',
              correct: 'a new bag',
              wrong: ['new shoes'],
            },
          },
          challenger: {
            clozeWrong: [
              ['till', 'a.m.'],
              ['till', 'neighbor'],
              ['till', 'a.m.'],
              ['need to', 'invite'],
              ['till', 'go shopping'],
              ['till', 'neighbor'],
              ['till', 'invite'],
              ['invite', 'neighbor'],
            ],
          },
          master: {
            sentenceEn: 'My sister is going to visit her friend after school.',
            sentenceHe: 'אחותי הולכת לבקר את החברה שלה אחרי בית הספר.',
            decoys: ['go', 'are'],
            voiceEn: 'We need to leave at eight a.m.',
            voiceHe: 'אנחנו צריכים לצאת בשמונה בבוקר.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'They are going to watch a movie tonight.',
              wrong: [
                'They is going to watch a movie tonight.',
                'They are going watch a movie tonight.',
                'They going to watch a movie tonight.',
              ],
              explainHe: 'they ואחריו are, ואז going to ופועל: They are going to watch.',
              hintEn: 'Check are and to.',
            },
            story: {
              passageEn:
                'Eden plans to have a picnic in the park on Saturday. She is going to invite four friends. On Friday she goes shopping for food, but the weather report says it is going to rain all day on Saturday. Eden has a new idea: the friends are going to have the picnic on the floor of her living room!',
              passageHe: '',
              questionEn: 'Why is the picnic going to be in Eden\'s living room?',
              questionHe: '',
              correct: 'It is going to rain on Saturday.',
              wrong: ['The park is closed.', 'Her friends do not like the park.', 'There is no food.'],
            },
            storyHintEn: 'What does the weather report say?',
          },
        },
      },
    },
    {
      icon: '🤷',
      titleEn: 'Are You Going to…?',
      titleHe: 'אתם הולכים ל…?',
      storyHookHe: 'בואו נשאל את החברים על התוכניות שלהם: Are you going to…? ונענה Yes, I am או No, I\'m not.',
      grammarTopic: 'be going to: questions and short answers',
      skills: ['going to Questions', 'Short Answers', 'Making Plans'],
      sentenceEn: 'Are you going to play outside after school?',
      sentenceHe: 'אתם הולכים לשחק בחוץ אחרי בית הספר?',
      vocab: [
        ['I don\'t mind', 'phrase', 'לא אכפת לי / זה בסדר מבחינתי', '🤷', 'Pizza or pasta? I don\'t mind.', 'פיצה או פסטה? לא אכפת לי.'],
        ['happy to', 'phrase', 'שמח ל...', '😁', 'I am happy to help you with your homework.', 'אני שמח/ה לעזור לכם בשיעורי הבית.'],
        ['enjoy yourself', 'phrase', 'תיהנו!', '🥳', 'Have a great trip and enjoy yourself!', 'טיול נהדר, ותיהנו!'],
        ['either', 'adverb', 'גם (במשפט שלילי)', '🙅', 'I am not going to swim, and my sister isn\'t going to swim either.', 'אני לא הולך/ת לשחות, וגם אחותי לא הולכת לשחות.'],
        ['sure', 'adjective', 'בטוח / בטח', '👍', 'Are you sure it is going to rain?', 'אתם בטוחים שירד גשם?'],
        ['anyway', 'adverb', 'בכל מקרה', '🔄', 'It is cold, but we are going to play outside anyway.', 'קר, אבל אנחנו הולכים לשחק בחוץ בכל מקרה.'],
        ['get off', 'phrase', 'לרדת (מאוטובוס / רכבת)', '🚌', 'We are going to get off the bus at the next stop.', 'אנחנו הולכים לרדת מהאוטובוס בתחנה הבאה.'],
        ['Good evening!', 'phrase', 'ערב טוב!', '🌙', 'Good evening! Are you going to stay for dinner?', 'ערב טוב! אתם הולכים להישאר לארוחת ערב?'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'tooth', translationHe: 'שן' },
          { wordEn: 'fork', translationHe: 'מזלג' },
        ],
        shortSentenceEn: 'Is she going to come?',
        shortSentenceHe: 'היא הולכת לבוא?',
        rule: {
          questionEn: 'Ask about Ron\'s plan. Which question is right?',
          correct: 'Is Ron going to swim today?',
          wrong: ['Does Ron going to swim today?', 'Is Ron going swim today?'],
          explainHe: 'שאלה על תוכנית: Is או Are בהתחלה, ואז going to ופועל.',
          hintHe: 'בדקו את המילה הראשונה ואת to.',
        },
        story: {
          passageEn:
            'Gali calls her friend Tamar. "Are you going to come to the park?" she asks. Tamar says, "Sure! Are we going to play ball or ride bikes?" Gali says, "I don\'t mind. Let\'s do both!"',
          passageHe:
            'גלי מתקשרת לחברה שלה תמר. "את הולכת לבוא לפארק?" היא שואלת. תמר אומרת: "בטח! אנחנו הולכות לשחק בכדור או לרכוב על אופניים?" גלי אומרת: "לא אכפת לי. בואי נעשה את שניהם!"',
          questionEn: 'Where are the girls going to go?',
          questionHe: 'לאן הבנות הולכות?',
          correct: 'to the park',
          wrong: ['to the beach', 'to school'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Your friend asks, "Are you going to come?" You want to come. What do you say?',
              correct: 'Yes, I am.',
              wrong: ['Yes, I do.'],
              explainHe: 'על Are you going to…? עונים Yes, I am או No, I\'m not.',
              hintHe: 'השאלה מתחילה ב-Are. מה עונים?',
            },
            story: {
              passageEn: 'It is evening. Grandma comes in and says, "Good evening!" She is happy to see us.',
              passageHe: 'ערב. סבתא נכנסת ואומרת: ערב טוב! היא שמחה לראות אותנו.',
              questionEn: 'Who comes in?',
              questionHe: 'מי נכנס?',
              correct: 'Grandma',
              wrong: ['Dad'],
            },
          },
          challenger: {
            clozeWrong: [
              ['Good evening', 'Get off'],
              ['either', 'anyway'],
              ['either', 'get off'],
              ['sure', 'Good evening'],
              ['either', 'anyway'],
              ['sure', 'happy to'],
              ['anyway', 'either'],
              ['I don\'t mind', 'Get off'],
            ],
          },
          master: {
            sentenceEn: 'Is your family going to travel in the summer?',
            sentenceHe: 'המשפחה שלכם הולכת לטייל בקיץ?',
            decoys: ['Does', 'goes'],
            voiceEn: 'I don\'t mind. I am happy to wait.',
            voiceHe: 'לא אכפת לי. אני שמח/ה לחכות.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'Are your parents going to come to the show?',
              wrong: [
                'Is your parents going to come to the show?',
                'Are your parents going to coming to the show?',
                'Are your parents go to come to the show?',
              ],
              explainHe: 'עם parents (הם) שואלים Are, ואחרי going to בא פועל רגיל: come.',
              hintEn: 'Check Are and the verb after to.',
            },
            story: {
              passageEn:
                'Ori is going to the movie theater with his dad. On the bus, Dad asks, "Are you sure the movie is at six?" Ori looks at the ticket. Oh no! It is at five! They get off the bus and take a taxi. They are a bit late, but they enjoy the movie anyway.',
              passageHe: '',
              questionEn: 'Why do they take a taxi?',
              questionHe: '',
              correct: 'The movie starts earlier than they think.',
              wrong: ['The bus is not coming.', 'Dad does not like buses.', 'They want to be late.'],
            },
            storyHintEn: 'What does Ori see on the ticket?',
          },
        },
      },
    },
    {
      icon: '🛍️',
      isBoss: true,
      titleEn: 'Boss: The Weekend Surprise',
      titleHe: 'אתגר הבוס: הפתעה בסוף השבוע',
      storyHookHe: 'מתכננים הפתעה! ספרו מה אתם הולכים לקנות ולעשות, ושאלו את החברים על התוכניות שלהם.',
      grammarTopic: 'be going to: Review',
      skills: ['going to', 'Shopping', 'Review'],
      sentenceEn: 'We are going to buy a present for Mom.',
      sentenceHe: 'אנחנו הולכים לקנות מתנה לאמא.',
      vocab: [
        ['spend', 'verb', 'להוציא (כסף / זמן)', '💰', 'I am going to spend my money on a new book.', 'אני הולך/ת להוציא את הכסף שלי על ספר חדש.'],
        ['cheap', 'adjective', 'זול', '🏷️', 'This T-shirt is cheap, so I am going to buy it.', 'החולצה הזאת זולה, אז אני הולך/ת לקנות אותה.'],
        ['customer', 'noun', 'לקוח / לקוחה', '🛍️', 'The customer is going to pay for the shoes.', 'הלקוח הולך לשלם על הנעליים.'],
        ['size', 'noun', 'מידה / גודל', '👟', 'What size are you? These shoes are too small.', 'מה המידה שלכם? הנעליים האלה קטנות מדי.'],
        ['pocket', 'noun', 'כיס', '👖', 'I have ten shekels in my pocket.', 'יש לי עשרה שקלים בכיס.'],
        ['quarter', 'noun', 'רבע', '🕒', 'We are going to meet at a quarter past four.', 'אנחנו הולכים להיפגש בארבע ורבע.'],
        ['simple', 'adjective', 'פשוט', '🧩', 'The game is simple, so we are going to learn it fast.', 'המשחק פשוט, אז אנחנו הולכים ללמוד אותו מהר.'],
        ['useful', 'adjective', 'שימושי', '🛠️', 'A backpack is useful for a trip.', 'תיק גב שימושי לטיול.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'lion', translationHe: 'אריה' },
          { wordEn: 'cloud', translationHe: 'ענן' },
        ],
        shortSentenceEn: 'It is very cheap.',
        shortSentenceHe: 'זה זול מאוד.',
        rule: {
          questionEn: 'Which sentence is right?',
          correct: 'Dad is going to buy a new bike.',
          wrong: ['Dad are going to buy a new bike.', 'Dad is going to buys a new bike.'],
          explainHe: 'עם Dad (הוא) אומרים is going to, ואחריו פועל בלי s: buy.',
          hintHe: 'בדקו את is ואת הפועל אחרי to.',
        },
        story: {
          passageEn:
            'On Friday morning, the twins have fifty shekels. They are going to buy a present for Mom\'s birthday. In the shop, they see a big scarf, but it is not cheap. Then they find a small, useful bag. It costs forty shekels. The twins are going to spend ten shekels on a card, too.',
          passageHe:
            'ביום שישי בבוקר יש לתאומים חמישים שקלים. הם הולכים לקנות מתנה ליום ההולדת של אמא. בחנות הם רואים צעיף גדול, אבל הוא לא זול. ואז הם מוצאים תיק קטן ושימושי. הוא עולה ארבעים שקלים. התאומים הולכים להוציא עשרה שקלים גם על כרטיס ברכה.',
          questionEn: 'How much does the bag cost?',
          questionHe: 'כמה עולה התיק?',
          correct: 'forty shekels',
          wrong: ['fifty shekels', 'ten shekels'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'The shoes are too small. What do you need?',
              correct: 'a bigger size',
              wrong: ['a cheap pocket'],
              explainHe: 'size פירושו "מידה". הנעליים קטנות? צריך מידה גדולה יותר.',
              hintHe: 'מה משתנה כשהנעליים קטנות?',
            },
            story: {
              passageEn: 'Ben has five shekels in his pocket. He is going to buy an ice cream.',
              passageHe: 'לבן יש חמישה שקלים בכיס. הוא הולך לקנות גלידה.',
              questionEn: 'What is Ben going to buy?',
              questionHe: 'מה בן הולך לקנות?',
              correct: 'an ice cream',
              wrong: ['a book'],
            },
          },
          challenger: {
            clozeWrong: [
              ['cheap', 'pocket'],
              ['customer', 'spend'],
              ['simple', 'cheap'],
              ['spend', 'useful'],
              ['cheap', 'spend'],
              ['pocket', 'customer'],
              ['pocket', 'spend'],
              ['spend', 'customer'],
            ],
          },
          master: {
            sentenceEn: 'The customer is going to pay for a bigger size.',
            sentenceHe: 'הלקוח הולך לשלם על מידה גדולה יותר.',
            decoys: ['are', 'pays'],
            voiceEn: 'This bag is cheap and useful.',
            voiceHe: 'התיק הזה זול ושימושי.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'We are going to spend the day at the mall.',
              wrong: [
                'We is going to spend the day at the mall.',
                'We are going to spending the day at the mall.',
                'We are go to spend the day at the mall.',
              ],
              explainHe: 'we ואחריו are, ואז going to ופועל רגיל: spend.',
              hintEn: 'Check are, going and the verb.',
            },
            story: {
              passageEn:
                'Shira wants new sneakers. She has 100 shekels. The first pair costs 150 shekels, so it is not for her. The second pair is cheap, but it is the wrong size. At a quarter past five, she finds a simple white pair in her size for 90 shekels. She is going to keep the change in her pocket.',
              passageHe: '',
              questionEn: 'Why does Shira not buy the second pair?',
              questionHe: '',
              correct: 'They are not her size.',
              wrong: ['They cost too much.', 'They are not white.', 'The shop is closed.'],
            },
            storyHintEn: 'What is wrong with the second pair?',
          },
        },
      },
    },
  ],
};

/** The core-4 pack's grade 5 unit (`../../registry.ts`) */
export const CORE_4_GRADE_5_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-5', [UNIT_CORE_4]);
