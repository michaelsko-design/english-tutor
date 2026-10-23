import { buildMiddleSchoolGrade, type MiddleSchoolUnitSpec } from '../../../middleSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * Core-plus pack, grade 7 ("Season 2"): quantifiers (much / many / a few / a little), then
 * too / enough and a comparatives review. Builds on units 1–4 (Present Simple & Progressive,
 * Past Simple, will / going to, modals). The second unit's Boss is the grade's new finale.
 */
const UNITS: MiddleSchoolUnitSpec[] = [
  {
    ...packUnitNumbers('core-plus', 0),
    titleEn: 'Food Truck Challenge: How Much & How Many',
    titleHe: 'אתגר משאית האוכל: כמה בדיוק?',
    subtitleHe: 'עונה 2: much / many, a few / a little ושמות עצם שאפשר ושאי אפשר לספור',
    badgeEmoji: '🍳',
    missions: [
      {
        icon: '🛒',
        titleEn: 'How Many Customers? How Much Cheese?',
        titleHe: 'כמה לקוחות? כמה גבינה?',
        storyHookHe:
          'הרפתקאות בונוס! פתחנו משאית אוכל בשוק של תל אביב. לפני שמתחילים לבשל, צריך לדעת מה אפשר לספור ומה לא.',
        grammarTopic: 'Quantifiers: much (uncountable) vs. many (countable)',
        skills: ['much vs. many', 'Countable & Uncountable Nouns', 'Food Truck Vocab'],
        sentenceEn: 'How many customers are waiting, and how much cheese do we have left?',
        sentenceHe: 'כמה לקוחות מחכים, וכמה גבינה נשארה לנו?',
        vocab: [
          ['ingredient', 'noun', 'מרכיב (במתכון)', '🧂', 'Flour is the main ingredient in this bread.', 'קמח הוא המרכיב העיקרי בלחם הזה.'],
          ['customer', 'noun', 'לקוח / לקוחה', '🧍', 'The first customer ordered two pancakes.', 'הלקוח הראשון הזמין שתי פנקייקים.'],
          ['amount', 'noun', 'כמות', '⚖️', 'We need a small amount of butter for the pan.', 'אנחנו צריכים כמות קטנה של חמאה למחבת.'],
          ['portion', 'noun', 'מנה', '🍽️', 'Every portion comes with a fresh salad.', 'כל מנה מגיעה עם סלט טרי.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'utensil', translationHe: 'כלי מטבח' },
            { wordEn: 'waiter', translationHe: 'מלצר' },
          ],
          shortSentenceEn: 'How much cheese do we have?',
          shortSentenceHe: 'כמה גבינה יש לנו?',
          rule: {
            questionEn: 'Complete the question: "How ____ eggs do we need for the omelettes?"',
            correct: 'many',
            wrong: ['much', 'lot'],
            explainHe: 'eggs הם דבר שאפשר לספור (ביצה אחת, שתי ביצים), ולכן שואלים How many.',
            hintHe: 'האם אפשר לספור ביצים אחת אחת? לדברים שסופרים יש מילת כמות משלהם.',
          },
          story: {
            passageEn:
              'Every Friday, Tamar and her brother run a small food truck near the beach. They sell hot pancakes with honey and fresh fruit. Before they open, they check how many eggs and how much milk they have. Last Friday, they had too little milk, so Tamar ran to the shop.',
            passageHe:
              'בכל יום שישי, תמר ואחיה מפעילים משאית אוכל קטנה ליד החוף. הם מוכרים פנקייקים חמים עם דבש ופירות טריים. לפני שהם פותחים, הם בודקים כמה ביצים וכמה חלב יש להם. ביום שישי שעבר היה להם מעט מדי חלב, אז תמר רצה לחנות.',
            questionEn: 'What do Tamar and her brother check before they open?',
            questionHe: 'מה תמר ואחיה בודקים לפני שהם פותחים?',
            correct: 'How many eggs and how much milk they have.',
            wrong: ['How many customers visited last week.', 'How much money the beach shop earns.'],
          },
        },
      },
      {
        icon: '🌿',
        titleEn: 'A Few Spices, a Little Magic',
        titleHe: 'קצת תבלינים, קצת קסם',
        storyHookHe:
          'המתכון הסודי של המשאית צריך רק קצת מכל דבר. נלמד מתי אומרים a few ומתי a little.',
        grammarTopic: 'Quantifiers: a few (countable) vs. a little (uncountable)',
        skills: ['a few vs. a little', 'Recipe Instructions', 'Kitchen Vocab'],
        sentenceEn: 'Add a few tomatoes and a little salt, and the sauce will taste amazing.',
        sentenceHe: 'הוסיפו כמה עגבניות וקצת מלח, והרוטב יהיה טעים להפליא.',
        vocab: [
          ['spice', 'noun', 'תבלין', '🌶️', 'Cumin is my favorite spice for soup.', 'כמון הוא התבלין האהוב עליי למרק.'],
          ['recipe', 'noun', 'מתכון', '📖', 'My grandmother never writes down her recipe.', 'סבתא שלי אף פעם לא כותבת את המתכון שלה.'],
          ['sprinkle', 'verb', 'לפזר (מעט)', '🧂', 'Sprinkle some cinnamon on top of the cake.', 'פזרו קצת קינמון על העוגה.'],
          ['taste', 'verb', 'לטעום / להיות בטעם', '👅', 'Taste the soup before you add more pepper.', 'טעמו את המרק לפני שאתם מוסיפים עוד פלפל.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'freeze', translationHe: 'להקפיא' },
            { wordEn: 'bowl', translationHe: 'קערה' },
          ],
          shortSentenceEn: 'Add a little salt.',
          shortSentenceHe: 'הוסיפו קצת מלח.',
          rule: {
            questionEn: 'Complete the sentence: "Put ____ olives on the pizza, not too many."',
            correct: 'a few',
            wrong: ['a little', 'much'],
            explainHe: 'olives הם דבר שסופרים (זית אחד, שני זיתים), ולכן a few.',
            hintHe: 'אפשר לספור זיתים? מילת הכמות צריכה להתאים לשם עצם ברבים שאפשר לספור.',
          },
          story: {
            passageEn:
              'Omer is preparing his famous shakshuka for the food truck. He cuts a few red peppers and adds a little olive oil to the pan. Then he sprinkles a few spices over the eggs. His customers say the secret is the fresh tomatoes from his uncle’s garden.',
            passageHe:
              'עומר מכין את השקשוקה המפורסמת שלו למשאית האוכל. הוא חותך כמה פלפלים אדומים ומוסיף קצת שמן זית למחבת. אחר כך הוא מפזר כמה תבלינים על הביצים. הלקוחות שלו אומרים שהסוד הוא העגבניות הטריות מהגינה של הדוד שלו.',
            questionEn: 'What do the customers think is the secret of the shakshuka?',
            questionHe: 'מה הלקוחות חושבים שהוא הסוד של השקשוקה?',
            correct: 'The fresh tomatoes from his uncle’s garden.',
            wrong: ['The expensive cheese from France.', 'The hot sauce from the market.'],
          },
        },
      },
      {
        icon: '💰',
        isBoss: true,
        titleEn: 'Boss: The Market Day Report',
        titleHe: 'אתגר הבוס: הדו״ח של יום השוק',
        storyHookHe:
          'משימת סיכום! קראו את הדו״ח של יום השוק הגדול, ספרו לקוחות ומרכיבים, והוכיחו שליטה ב-much, many, a few ו-a little.',
        grammarTopic: 'Unit Boss: much / many / a few / a little in Unseen Reading',
        skills: ['Boss Unseen', 'Quantifiers Review', 'Speaking Challenge'],
        sentenceEn: 'We earned a lot of money today, but we only had a few minutes to rest.',
        sentenceHe: 'הרווחנו הרבה כסף היום, אבל היו לנו רק כמה דקות לנוח.',
        vocab: [
          ['budget', 'noun', 'תקציב', '📊', 'Our budget for new pans is two hundred shekels.', 'התקציב שלנו למחבתות חדשות הוא מאתיים שקלים.'],
          ['profit', 'noun', 'רווח', '📈', 'The truck made a big profit in the summer.', 'המשאית הרוויחה רווח גדול בקיץ.'],
          ['earn', 'verb', 'להרוויח (כסף)', '💵', 'Teenagers can earn money by babysitting.', 'בני נוער יכולים להרוויח כסף משמרטפות.'],
          ['crowd', 'noun', 'המון / קהל גדול', '👥', 'A huge crowd stood in line for ice cream.', 'המון אנשים עמדו בתור לגלידה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'loss', translationHe: 'הפסד' },
            { wordEn: 'debt', translationHe: 'חוב' },
          ],
          shortSentenceEn: 'We earned a lot today.',
          shortSentenceHe: 'הרווחנו הרבה היום.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'There isn’t much bread, but there are a few rolls.',
            wrong: [
              'There aren’t many bread, but there is a little rolls.',
              'There isn’t many bread, but there are a little rolls.',
            ],
            explainHe:
              'bread הוא דבר שלא סופרים, ולכן much. rolls (לחמניות) סופרים, ולכן a few.',
            hintHe: 'בדקו כל שם עצם: את הלחם לא סופרים, ואת הלחמניות כן. לכל סוג מילת כמות אחרת.',
          },
          story: {
            passageEn:
              'Saturday was the biggest market day of the year in Jaffa. A huge crowd came to the food trucks from early morning. Noa’s team sold three hundred portions of falafel, so they made a nice profit. They didn’t have much time for lunch, and by the evening only a few pitas were left. Next year, they are going to bring a bigger team.',
            passageHe:
              'שבת הייתה יום השוק הגדול ביותר בשנה ביפו. המון אנשים הגיעו למשאיות האוכל מהבוקר המוקדם. הצוות של נועה מכר שלוש מאות מנות פלאפל, ולכן הם הרוויחו רווח יפה. לא היה להם הרבה זמן לארוחת צהריים, ובערב נשארו רק כמה פיתות. בשנה הבאה הם מתכוונים להביא צוות גדול יותר.',
            questionEn: 'Why did Noa’s team make a nice profit?',
            questionHe: 'מדוע הצוות של נועה הרוויח רווח יפה?',
            correct: 'They sold three hundred portions of falafel.',
            wrong: ['They raised the prices of all the drinks.', 'They closed the truck early in the afternoon.'],
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('core-plus', 1),
    titleEn: 'Gadget Lab: Too, Enough & Better',
    titleHe: 'מעבדת הגאדג׳טים: יותר מדי, מספיק וטוב יותר',
    subtitleHe: 'עונה 2: too / enough והשוואות (-er, more, as … as) — הגמר החדש של כיתה ז׳',
    badgeEmoji: '🛠️',
    missions: [
      {
        icon: '🎒',
        titleEn: 'Too Heavy or Light Enough?',
        titleHe: 'כבד מדי או קל מספיק?',
        storyHookHe:
          'הצטרפנו למעבדת ממציאים צעירים! לפני שבוחרים גאדג׳ט לטיול השנתי, בודקים מה too ומה enough.',
        grammarTopic: 'too + adjective vs. adjective + enough',
        skills: ['too + adjective', 'adjective + enough', 'Tech Vocab'],
        sentenceEn: 'This speaker is too heavy for my bag, and its battery isn’t strong enough.',
        sentenceHe: 'הרמקול הזה כבד מדי בשביל התיק שלי, והסוללה שלו לא חזקה מספיק.',
        vocab: [
          ['battery', 'noun', 'סוללה', '🔋', 'My phone battery dies in the afternoon.', 'הסוללה בטלפון שלי נגמרת אחר הצהריים.'],
          ['heavy', 'adjective', 'כבד / כבדה', '🏋️', 'The laptop is heavy, so I carry it in a backpack.', 'המחשב הנייד כבד, אז אני נושא אותו בתיק גב.'],
          ['charge', 'verb', 'להטעין', '🔌', 'I always charge my headphones at night.', 'אני תמיד מטעין את האוזניות בלילה.'],
          ['screen', 'noun', 'מסך', '📺', 'The screen on this tablet is very bright.', 'המסך בטאבלט הזה בהיר מאוד.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'cable', translationHe: 'כבל' },
            { wordEn: 'wireless', translationHe: 'אלחוטי' },
          ],
          shortSentenceEn: 'This speaker is too heavy.',
          shortSentenceHe: 'הרמקול הזה כבד מדי.',
          rule: {
            questionEn: 'Complete the sentence: "Yoav can’t reach the top shelf. He isn’t ____."',
            correct: 'tall enough',
            wrong: ['enough tall', 'too tall'],
            explainHe: 'enough בא אחרי שם התואר: tall enough. יואב לא מגיע, כלומר הגובה שלו לא מספיק.',
            hintHe: 'יואב לא מגיע למדף. האם הבעיה היא שהוא גבוה מדי, או שחסר לו גובה? שימו לב גם לסדר המילים.',
          },
          story: {
            passageEn:
              'Lior wants to take a speaker on the class trip to the Galilee. His old speaker is too big for his backpack. His sister’s mini speaker is light enough, but its battery lasts only two hours. In the end, Lior buys a small power bank, so he can charge the mini speaker on the bus.',
            passageHe:
              'ליאור רוצה לקחת רמקול לטיול השנתי לגליל. הרמקול הישן שלו גדול מדי בשביל תיק הגב שלו. הרמקול הקטן של אחותו קל מספיק, אבל הסוללה שלו מחזיקה רק שעתיים. בסוף, ליאור קונה מטען נייד קטן, כדי שיוכל להטעין את הרמקול הקטן באוטובוס.',
            questionEn: 'What is the problem with his sister’s mini speaker?',
            questionHe: 'מה הבעיה עם הרמקול הקטן של אחותו?',
            correct: 'Its battery lasts only two hours.',
            wrong: ['It is too heavy for the backpack.', 'It doesn’t play loud music.'],
          },
        },
      },
      {
        icon: '⚖️',
        titleEn: 'Which Gadget Is Better?',
        titleHe: 'איזה גאדג׳ט טוב יותר?',
        storyHookHe:
          'שני טלפונים, שני מחירים, החלטה אחת. נחזור על השוואות: -er, more, ו-as … as.',
        grammarTopic: 'Comparatives Review (-er / more … than / as … as)',
        skills: ['Comparatives Review', 'as … as', 'Making Choices'],
        sentenceEn: 'The new phone is more powerful than the old one, but it isn’t as cheap.',
        sentenceHe: 'הטלפון החדש חזק יותר מהישן, אבל הוא לא זול כמוהו.',
        vocab: [
          ['compare', 'verb', 'להשוות', '🔍', 'Let’s compare the prices before we buy anything.', 'בואו נשווה את המחירים לפני שאנחנו קונים משהו.'],
          ['powerful', 'adjective', 'חזק / עוצמתי', '⚡', 'This computer has a powerful fan inside.', 'יש למחשב הזה מאוורר חזק בפנים.'],
          ['expensive', 'adjective', 'יקר / יקרה', '💸', 'Smart watches are expensive in this shop.', 'שעונים חכמים יקרים בחנות הזאת.'],
          ['cheap', 'adjective', 'זול / זולה', '🏷️', 'I found a cheap case for my tablet.', 'מצאתי כיסוי זול לטאבלט שלי.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'refund', translationHe: 'החזר כספי' },
            { wordEn: 'useless', translationHe: 'חסר תועלת' },
          ],
          shortSentenceEn: 'The new phone is more powerful.',
          shortSentenceHe: 'הטלפון החדש חזק יותר.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'My tablet is more expensive than yours.',
            wrong: ['My tablet is expensiver than yours.', 'My tablet is more expensive as yours.'],
            explainHe:
              'לשם תואר ארוך (expensive) מוסיפים more לפניו, ואחרי ההשוואה בא than.',
            hintHe: 'expensive היא מילה ארוכה: איך משווים מילה כזאת? ואיזו מילה מחברת בין שני הדברים שמשווים?',
          },
          story: {
            passageEn:
              'Maya is choosing between two cameras for her photography club. The black camera is lighter and cheaper than the silver one. However, the silver camera is more powerful and takes clearer photos at night. Maya compares the two for a week. Finally, she chooses the silver camera because she loves taking photos of the stars.',
            passageHe:
              'מאיה בוחרת בין שתי מצלמות לחוג הצילום שלה. המצלמה השחורה קלה יותר וזולה יותר מהכסופה. אבל המצלמה הכסופה חזקה יותר ומצלמת תמונות ברורות יותר בלילה. מאיה משווה בין השתיים במשך שבוע. לבסוף היא בוחרת במצלמה הכסופה, כי היא אוהבת לצלם את הכוכבים.',
            questionEn: 'Why does Maya choose the silver camera?',
            questionHe: 'מדוע מאיה בוחרת במצלמה הכסופה?',
            correct: 'Because she loves taking photos of the stars.',
            wrong: ['Because it is cheaper than the black one.', 'Because her club leader told her to.'],
          },
        },
      },
      {
        icon: '🚀',
        isBoss: true,
        titleEn: 'Boss: The Young Inventors Fair',
        titleHe: 'אתגר הבוס: יריד הממציאים הצעירים',
        storyHookHe:
          'הגמר הגדול של כיתה ז׳! ביריד הממציאים צריך להשוות בין המצאות, לבדוק מה חזק מספיק ומה גדול מדי, ולזכות בגביע.',
        grammarTopic: 'Grade 7 Finale: too / enough, Comparatives & Quantifiers in Unseen Reading',
        skills: ['Champion Unseen', 'too / enough & Comparatives', 'Final Voice Challenge'],
        sentenceEn: 'Our robot is faster than last year’s model, but it still isn’t quiet enough.',
        sentenceHe: 'הרובוט שלנו מהיר יותר מהדגם של השנה שעברה, אבל הוא עדיין לא שקט מספיק.',
        vocab: [
          ['invention', 'noun', 'המצאה', '💡', 'The light bulb was an important invention.', 'הנורה הייתה המצאה חשובה.'],
          ['improve', 'verb', 'לשפר', '📈', 'We improve our robot after every test.', 'אנחנו משפרים את הרובוט שלנו אחרי כל ניסוי.'],
          ['reliable', 'adjective', 'אמין / אמינה', '✅', 'A reliable alarm clock never stops working.', 'שעון מעורר אמין אף פעם לא מפסיק לעבוד.'],
          ['effort', 'noun', 'מאמץ', '💪', 'The team put a lot of effort into the project.', 'הצוות השקיע הרבה מאמץ בפרויקט.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'failure', translationHe: 'כישלון' },
            { wordEn: 'careless', translationHe: 'רשלני' },
          ],
          shortSentenceEn: 'Our robot is faster now.',
          shortSentenceHe: 'הרובוט שלנו מהיר יותר עכשיו.',
          rule: {
            questionEn: 'Complete the sentence: "The box was ____ to lift, so two students carried it."',
            correct: 'too heavy',
            wrong: ['heavy enough', 'enough heavy'],
            explainHe:
              'הקופסה הייתה כבדה יותר ממה שתלמיד אחד יכול להרים, כלומר too heavy (כבדה מדי).',
            hintHe: 'שני תלמידים נשאו את הקופסה, כי אחד לא הצליח. האם יש כאן יותר מדי משקל, או בדיוק מספיק?',
          },
          story: {
            passageEn:
              'Every spring, the Young Inventors Fair takes place in Be’er Sheva. This year, Adi and Ron showed a robot that waters plants. Last year their robot was too slow, so they worked hard to improve it. The judges said it was more reliable than any other invention at the fair. Adi and Ron won first prize, and they are going to use the money to build a new model.',
            passageHe:
              'בכל אביב מתקיים בבאר שבע יריד הממציאים הצעירים. השנה עדי ורון הציגו רובוט שמשקה צמחים. בשנה שעברה הרובוט שלהם היה איטי מדי, אז הם עבדו קשה כדי לשפר אותו. השופטים אמרו שהוא אמין יותר מכל המצאה אחרת ביריד. עדי ורון זכו בפרס הראשון, והם מתכוונים להשתמש בכסף כדי לבנות דגם חדש.',
            questionEn: 'What was the problem with the robot last year?',
            questionHe: 'מה הייתה הבעיה עם הרובוט בשנה שעברה?',
            correct: 'It was too slow.',
            wrong: ['It was too expensive to build.', 'It was not big enough for the plants.'],
          },
        },
      },
    ],
  },
];

export const CORE_PLUS_GRADE_7_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildMiddleSchoolGrade('grade-7', UNITS);
