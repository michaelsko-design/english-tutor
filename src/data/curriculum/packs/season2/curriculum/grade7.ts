import { buildMiddleSchoolGrade, type MiddleSchoolUnitSpec } from '../../../middleSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * Season 2, grade 7: quantifiers (much / many / a few / a little), then
 * too / enough and a comparatives review. Builds on units 1–4 (Present Simple & Progressive,
 * Past Simple, will / going to, modals). The second unit's Boss is the grade's new finale.
 */
const UNIT_SEASON2_1: MiddleSchoolUnitSpec = {
  ...packUnitNumbers('season2-1'),
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
        ['customer', 'noun', 'לקוח / לקוחה', '🧍', 'The first customer ordered two pancakes.', 'הלקוח הראשון הזמין שני פנקייקים.'],
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'How many eggs do we have?',
              wrong: ['How much eggs do we have?'],
              explainHe: 'eggs אפשר לספור, ולכן How many.',
              hintHe: 'אפשר לספור ביצים אחת אחת? מילת הכמות צריכה להתאים לדבר שסופרים.',
            },
            story: {
              passageEn: 'Dina has a food truck. She sells salad and juice. Today she has ten customers.',
              passageHe: 'לדינה יש משאית אוכל. היא מוכרת סלט ומיץ. היום יש לה עשרה לקוחות.',
              questionEn: 'How many customers does she have today?',
              questionHe: 'כמה לקוחות יש לה היום?',
              correct: 'Ten.',
              wrong: ['Two.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['recipe', 'oven'],
              ['menu', 'kitchen'],
              ['number', 'bunch'],
              ['ingredient', 'pan'],
            ],
          },
          master: {
            sentenceEn: 'How many onions do we need and how much olive oil is left today?',
            sentenceHe: 'כמה בצלים אנחנו צריכים וכמה שמן זית נשאר היום?',
            decoys: ['lot', 'few'],
            voiceEn: 'There is not much milk in the fridge.',
            voiceHe: 'אין הרבה חלב במקרר.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'There are many people in line but there is not much bread.',
              wrong: [
                'There are much people in line but there is not much bread.',
                'There are many people in line but there is not many bread.',
                'There is many people in line but there is not much bread.',
              ],
              explainHe: 
                'people אפשר לספור ולכן many, ו-bread אי אפשר לספור ולכן much. people הם רבים, ולכן are.',
              hintEn: 'Which nouns can you count, and which cannot?',
            },
            story: {
              passageEn: 
                'Elad runs a juice truck near the university. On hot days a long line waits for his drinks, so he buys a lot of oranges early in the morning. Last Tuesday it rained, and he had only a few customers. He still had plenty of oranges, so he gave a free cup to every student who came. The next day, the line was longer than ever.',
              passageHe: '',
              questionEn: 'Why was the line so long the next day?',
              questionHe: '',
              correct: 'People liked the free juice and came back.',
              wrong: [
                'The rain made the oranges cheaper.',
                'Elad closed the truck for two days.',
                'A new university opened nearby.',
              ],
            },
            storyHintEn: 'Think about what Elad did on the rainy day.',
          },
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
        ['taste', 'verb', 'לטעום / טעם', '👅', 'Taste the soup before you add more pepper.', 'טעמו את המרק לפני שאתם מוסיפים עוד פלפל.'],
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'I need a few eggs.',
              wrong: ['I need a little eggs.'],
              explainHe: 'eggs אפשר לספור, ולכן a few.',
              hintHe: 'ביצים סופרים אחת אחת. איזו מילת כמות מתאימה לדברים שסופרים?',
            },
            story: {
              passageEn: 'Hila makes soup. She adds a little salt. She puts in a few carrots.',
              passageHe: 'הילה מכינה מרק. היא מוסיפה קצת מלח. היא שמה כמה גזרים.',
              questionEn: 'What does she put in the soup?',
              questionHe: 'מה היא שמה במרק?',
              correct: 'A few carrots.',
              wrong: ['A few apples.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['dessert', 'cheese'],
              ['kitchen', 'apron'],
              ['boil', 'slice'],
              ['chop', 'peel'],
            ],
          },
          master: {
            sentenceEn: 'Add a few onions and a little black pepper to the pan before serving.',
            sentenceHe: 'הוסיפו כמה בצלים וקצת פלפל שחור למחבת לפני ההגשה.',
            decoys: ['salty', 'spoon'],
            voiceEn: 'I only need a little time.',
            voiceHe: 'אני צריך/ה רק קצת זמן.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'We have a few lemons but only a little sugar.',
              wrong: [
                'We have a little lemons but only a little sugar.',
                'We have a few lemons but only a few sugar.',
                'We have a few lemon but only a little sugar.',
              ],
              explainHe: 'lemons אפשר לספור ולכן a few ברבים. sugar אי אפשר לספור ולכן a little.',
              hintEn: 'Check which noun you can count.',
            },
            story: {
              passageEn: 
                'Ofir wanted to impress his grandmother, so he decided to cook her favorite soup. He found the recipe in an old notebook, but the writing was faded. It said "a few carrots" and "a little something special". Ofir called his mother, who laughed and said that the special thing is only love. He added a few extra carrots, tasted the soup twice, and finally carried the bowl to the table with a nervous smile.',
              passageHe: '',
              questionEn: 'What did the mother mean by "something special"?',
              questionHe: '',
              correct: 'The care you put into the cooking.',
              wrong: [
                'A rare spice from another country.',
                'A secret kind of expensive cheese.',
                'A sweet ingredient hidden in the carrots.',
              ],
            },
            storyHintEn: 'Read what Ofir’s mother said about the special thing.',
          },
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
        ['profit', 'noun', 'רווח', '📈', 'The truck made a big profit in the summer.', 'המשאית הניבה רווח גדול בקיץ.'],
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'We have a little time.',
              wrong: ['We have a few time.'],
              explainHe: 'time אי אפשר לספור, ולכן a little.',
              hintHe: 'האם אפשר לספור זמן אחד, שניים? מילת הכמות צריכה להתאים.',
            },
            story: {
              passageEn: 'The market is busy. Yoni sells fruit. He sold a lot of apples today.',
              passageHe: 'השוק עמוס. יוני מוכר פירות. היום הוא מכר הרבה תפוחים.',
              questionEn: 'What did Yoni sell a lot of?',
              questionHe: 'ממה יוני מכר הרבה?',
              correct: 'Apples.',
              wrong: ['Bread.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['menu', 'kitchen'],
              ['engine', 'wheel'],
              ['spend', 'borrow'],
              ['freezer', 'cashier'],
            ],
          },
          master: {
            sentenceEn: 'We earned a profit but there were not many sandwiches left by the evening.',
            sentenceHe: 'הרווחנו, אבל לא נשארו הרבה כריכים עד הערב.',
            decoys: ['much', 'few'],
            voiceEn: 'A large crowd came to the market.',
            voiceHe: 'קהל גדול הגיע לשוק.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'The truck sold many drinks but we have a little juice left.',
              wrong: [
                'The truck sold much drinks but we have a little juice left.',
                'The truck sold many drinks but we have a few juice left.',
                'The truck sold many drink but we have a little juice left.',
              ],
              explainHe: 'drinks אפשר לספור ולכן many ברבים. juice אי אפשר לספור ולכן a little.',
              hintEn: 'Count the nouns: which can be counted?',
            },
            story: {
              passageEn: 
                'The manager of the market looked at the numbers on Sunday night. The crowd had been huge, and every truck sold almost everything. Only one truck, the smallest one, earned less than usual. Its owner, Rina, had spent most of her budget on a beautiful sign and a few flowers, but she had bought very little food. Next week, she says, she will do the opposite.',
              passageHe: '',
              questionEn: 'What went wrong for Rina’s truck?',
              questionHe: '',
              correct: 'She spent money on decoration instead of food.',
              wrong: [
                'She had too many cooks in the small truck.',
                'The crowd did not come to her side of the market.',
                'Her prices were higher than the other trucks.',
              ],
            },
            storyHintEn: 'Look at how Rina spent her budget.',
          },
        },
      },
    },
  ],
};

const UNIT_SEASON2_2: MiddleSchoolUnitSpec = {
  ...packUnitNumbers('season2-2'),
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'The bag is too heavy.',
              wrong: ['The bag is enough heavy.'],
              explainHe: 'too בא לפני שם התואר: too heavy.',
              hintHe: 'שימו לב לסדר המילים. איפה עומדת המילה too ביחס לשם התואר?',
            },
            story: {
              passageEn: 
                'Ari wants to buy a phone. The phone is nice, but it is too expensive. He has only fifty shekels.',
              passageHe: 'ארי רוצה לקנות טלפון. הטלפון יפה, אבל הוא יקר מדי. יש לו רק חמישים שקלים.',
              questionEn: 'Why does Ari not buy the phone?',
              questionHe: 'למה ארי לא קונה את הטלפון?',
              correct: 'It is too expensive.',
              wrong: ['It is too small.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['case', 'cover'],
              ['bright', 'quiet'],
              ['delete', 'download'],
              ['battery', 'charger'],
            ],
          },
          master: {
            sentenceEn: 'This tablet is too expensive for me but the battery is strong enough.',
            sentenceHe: 'הטאבלט הזה יקר מדי בשבילי אבל הסוללה חזקה מספיק.',
            decoys: ['much', 'tall'],
            voiceEn: 'My phone screen is big enough.',
            voiceHe: 'המסך של הטלפון שלי גדול מספיק.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'The box is too heavy for one child to carry.',
              wrong: [
                'The box is heavy too for one child to carry.',
                'The box is too heavily for one child to carry.',
                'The box is enough heavy for one child to carry.',
              ],
              explainHe: 
                'too בא לפני שם התואר ושם התואר נשאר בצורתו: too heavy. enough בא אחרי התואר, לא לפניו.',
              hintEn: 'Check where too goes and the form of the adjective.',
            },
            story: {
              passageEn: 
                'Shai bought a very cheap speaker online. When it arrived, he was excited and took it to the beach. But after twenty minutes the music stopped. The battery was not strong enough, and the speaker was too quiet to hear over the waves. His older cousin laughed kindly and told him that a better speaker costs more. Shai nodded and started saving his money.',
              passageHe: '',
              questionEn: 'What lesson did Shai learn about the speaker?',
              questionHe: '',
              correct: 'A very cheap product is not always a good choice.',
              wrong: [
                'Speakers should never be taken to the beach.',
                'Music sounds better when the battery is low.',
                'His cousin’s speaker was worse than his own.',
              ],
            },
            storyHintEn: 'Think about the battery, the sound and the price.',
          },
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'Dan is taller than Ron.',
              wrong: ['Dan is more tall than Ron.'],
              explainHe: 'לשם תואר קצר מוסיפים er ואחריו than: taller than.',
              hintHe: 'tall היא מילה קצרה. איך משווים מילה קצרה?',
            },
            story: {
              passageEn: 
                'Ella has two bikes. The red bike is faster than the blue bike. The blue bike is older.',
              passageHe: 
                'לאלה יש שני זוגות אופניים. האופניים האדומים מהירים יותר מהכחולים. האופניים הכחולים ישנים יותר.',
              questionEn: 'Which bike is faster?',
              questionHe: 'אילו אופניים מהירים יותר?',
              correct: 'The red bike.',
              wrong: ['The blue bike.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['measure', 'wrap'],
              ['friendly', 'muddy'],
              ['rude', 'tasty'],
              ['friendly', 'lazy'],
            ],
          },
          master: {
            sentenceEn: 'Our new school website is easier to use than the old one.',
            sentenceHe: 'האתר החדש של בית הספר שלנו קל יותר לשימוש מהישן.',
            decoys: ['more', 'easy'],
            voiceEn: 'This tablet is cheaper than that one.',
            voiceHe: 'הטאבלט הזה זול יותר מההוא.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'The silver watch is more expensive than the black one.',
              wrong: [
                'The silver watch is expensiver than the black one.',
                'The silver watch is more expensive that the black one.',
                'The silver watch is more expensive as the black one.',
              ],
              explainHe: 
                'שם תואר ארוך (expensive) מקבל more ולא er. אחרי ההשוואה בא than, ולא that או as.',
              hintEn: 'Check how to compare a long adjective and the word after it.',
            },
            story: {
              passageEn: 
                'Two bakeries stand on Dina’s street. The first one is bigger and sells cheaper bread, but the line is always long. The second one is smaller, and a loaf costs a little more. Dina’s mother prefers the small bakery. She says she does not mind paying extra because the owner knows every customer by name and the bread is always warm.',
              passageHe: '',
              questionEn: 'Why does Dina’s mother prefer the small bakery?',
              questionHe: '',
              correct: 'She enjoys the personal service and warm bread.',
              wrong: [
                'The bread there is cheaper than in the big one.',
                'The line at the small bakery is longer.',
                'The owner of the big bakery is her cousin.',
              ],
            },
            storyHintEn: 'Think about what she says about the owner.',
          },
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'The robot is too slow.',
              wrong: ['The robot is enough slow.'],
              explainHe: 'too בא לפני שם התואר: too slow. enough לא בא לפניו.',
              hintHe: 'שימו לב לסדר המילים: איפה עומדת המילה too?',
            },
            story: {
              passageEn: 
                'Noy built a small robot. It is faster than a snail. It is not fast enough for the race.',
              passageHe: 'נוי בנה רובוט קטן. הוא מהיר יותר מחילזון. הוא לא מהיר מספיק למירוץ.',
              questionEn: 'Why can the robot not win the race?',
              questionHe: 'למה הרובוט לא יכול לנצח במירוץ?',
              correct: 'It is not fast enough.',
              wrong: ['It is too fast.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['president', 'neighbor'],
              ['borrow', 'forgive'],
              ['broken', 'sleepy'],
              ['luck', 'noise'],
            ],
          },
          master: {
            sentenceEn: 'The new model is lighter than the old one but not strong enough.',
            sentenceHe: 'הדגם החדש קל יותר מהישן אבל לא חזק מספיק.',
            decoys: ['lightest', 'too'],
            voiceEn: 'We worked hard to improve the robot.',
            voiceHe: 'עבדנו קשה כדי לשפר את הרובוט.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'The robot is fast enough to win but too noisy for the judges.',
              wrong: [
                'The robot is enough fast to win but too noisy for the judges.',
                'The robot is fast enough to win but too noisier for the judges.',
                'The robot is fast enough to win but noisy too for the judges.',
              ],
              explainHe: 
                'enough בא אחרי שם התואר (fast enough), ו-too בא לפניו (too noisy). אחרי too התואר נשאר בצורתו הרגילה.',
              hintEn: 'Check where enough and too stand and the adjective form.',
            },
            story: {
              passageEn: 
                'The judges walked slowly between the tables at the fair. Many robots were colorful and fast, but several of them stopped working during the demonstration. Maya’s robot was plain gray and quite slow. Still, it finished all three tasks without a single mistake, even when the lights went off for a moment. At the end, the head judge said that a prize should go to the project that works every time.',
              passageHe: '',
              questionEn: 'Why did the head judge value Maya’s robot?',
              questionHe: '',
              correct: 'It worked correctly each time, even in difficult moments.',
              wrong: [
                'It was the most colorful robot at the fair.',
                'It was faster than all the other robots.',
                'It stopped working during the demonstration.',
              ],
            },
            storyHintEn: 'Think about which robots had problems.',
          },
        },
      },
    },
  ],
};

/** The season2-1 pack's grade 7 unit (`../../registry.ts`) */
export const SEASON2_1_GRADE_7_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildMiddleSchoolGrade('grade-7', [UNIT_SEASON2_1]);

/** The season2-2 pack's grade 7 unit (`../../registry.ts`) */
export const SEASON2_2_GRADE_7_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildMiddleSchoolGrade('grade-7', [UNIT_SEASON2_2]);
