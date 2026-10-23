import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * Grade 4, Season 2 (core-plus pack): a clothes shop with this / that / these / those and
 * "How much…?", then health and the body with imperatives and have got. Builds on units 1–4
 * (can, There is / There are, prepositions, I like, What questions).
 * Hebrew copy is gender-neutral (slash forms such as "אוהב/ת" and plural imperatives).
 */
const UNITS: ElementaryUnitSpec[] = [
  {
    ...packUnitNumbers('core-plus', 0),
    titleEn: 'The Clothes Shop',
    titleHe: 'עונה 2: חנות הבגדים',
    subtitleHe: 'הרפתקאות בונוס: בגדים (dress, jeans, boots), this / that / these / those ושאלת How much?',
    badgeEmoji: '🛍️',
    missions: [
      {
        icon: '👗',
        titleEn: 'This Dress or That Coat?',
        titleHe: 'השמלה הזאת או המעיל ההוא?',
        storyHookHe: 'עונה 2 נפתחת בקניון! נכנסים לחנות בגדים ומצביעים: מה קרוב אלינו ומה רחוק?',
        grammarTopic: 'Clothes & "this / that"',
        skills: ['Clothes', 'this / that', 'Speaking Aloud'],
        sentenceEn: 'I like this dress, but I do not like that coat.',
        sentenceHe: 'אני אוהב/ת את השמלה הזאת, אבל אני לא אוהב/ת את המעיל ההוא.',
        vocab: [
          ['dress', 'noun', 'שמלה', '👗', 'She wears a long dress to the party.', 'היא לובשת שמלה ארוכה למסיבה.'],
          ['cap', 'noun', 'כובע מצחייה', '🧢', 'He wears a cap in the sun.', 'הוא חובש כובע מצחייה בשמש.'],
          ['scarf', 'noun', 'צעיף', '🧣', 'My scarf is warm and soft.', 'הצעיף שלי חם ורך.'],
          ['coat', 'noun', 'מעיל', '🧥', 'I wear a coat in winter.', 'אני לובש/ת מעיל בחורף.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'carrot', translationHe: 'גזר' },
            { wordEn: 'shelf', translationHe: 'מדף' },
          ],
          shortSentenceEn: 'I like this dress.',
          shortSentenceHe: 'אני אוהב/ת את השמלה הזאת.',
          rule: {
            questionEn: 'The cap is far away. Which sentence is correct?',
            correct: 'That cap is blue.',
            wrong: ['This cap is blue.', 'Those cap is blue.'],
            explainHe: 'על דבר אחד רחוק אומרים that: That cap (כובע המצחייה ההוא).',
            hintHe: 'הכובע אחד והוא רחוק. איזו מילה מצביעה על דבר אחד שנמצא רחוק מאיתנו?',
          },
          story: {
            passageEn:
              'Noa is in a clothes shop. She holds a green scarf. "I like this scarf," she says. Then she sees a red coat far away. "Mom, look at that coat!"',
            passageHe: 'נועה בחנות בגדים. היא מחזיקה צעיף ירוק. "אני אוהבת את הצעיף הזה," היא אומרת. ואז היא רואה מעיל אדום רחוק. "אמא, תראי את המעיל ההוא!"',
            questionEn: 'What color is the coat?',
            questionHe: 'באיזה צבע המעיל?',
            correct: 'red',
            wrong: ['green', 'blue'],
          },
        },
      },
      {
        icon: '🕶️',
        titleEn: 'These Jeans, Those Boots',
        titleHe: 'הג׳ינס האלה, המגפיים ההם',
        storyHookHe: 'בחנות יש מדף מלא בדברים שבאים בזוגות! נלמד להצביע על כמה דברים יחד: these ו-those.',
        grammarTopic: 'Clothes & "these / those"',
        skills: ['Clothes', 'these / those', 'Plural Nouns'],
        sentenceEn: 'These jeans are new, and those boots are black.',
        sentenceHe: 'הג׳ינס האלה חדשים, והמגפיים ההם שחורים.',
        vocab: [
          ['jeans', 'noun', "ג'ינס", '👖', 'My jeans are blue.', "הג'ינס שלי כחולים."],
          ['boots', 'noun', 'מגפיים', '👢', 'I wear boots in the rain.', 'אני נועל/ת מגפיים בגשם.'],
          ['gloves', 'noun', 'כפפות', '🧤', 'Gloves keep my hands warm.', 'כפפות שומרות על הידיים שלי חמות.'],
          ['sunglasses', 'noun', 'משקפי שמש', '🕶️', 'Dad wears sunglasses at the beach.', 'אבא מרכיב משקפי שמש בחוף.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'lamp', translationHe: 'מנורה' },
            { wordEn: 'bread', translationHe: 'לחם' },
          ],
          shortSentenceEn: 'These gloves are warm.',
          shortSentenceHe: 'הכפפות האלה חמות.',
          rule: {
            questionEn: 'The boots are here, near you. Which sentence is correct?',
            correct: 'These boots are new.',
            wrong: ['This boots are new.', 'These boots is new.'],
            explainHe: 'על כמה דברים קרובים אומרים these, ואחריהם are: These boots are new.',
            hintHe: 'יש כאן יותר ממגף אחד, והם קרובים. בחרו מילה שמצביעה על הרבה דברים קרובים, ובדקו את צורת be.',
          },
          story: {
            passageEn:
              'Omer needs new clothes for the trip. He tries on these black jeans. They are great! Then he points at the window. "Can I have those sunglasses, too?"',
            passageHe: "עומר צריך בגדים חדשים לטיול. הוא מודד את הג'ינס השחורים האלה. הם מעולים! ואז הוא מצביע על החלון. \"אפשר לקבל גם את משקפי השמש ההם?\"",
            questionEn: 'What color are the jeans?',
            questionHe: "באיזה צבע הג'ינס?",
            correct: 'black',
            wrong: ['blue', 'white'],
          },
        },
      },
      {
        icon: '🏷️',
        isBoss: true,
        titleEn: 'Boss: How Much Is It?',
        titleHe: 'אתגר הבוס: כמה זה עולה?',
        storyHookHe: 'הגיע הזמן לשלם! שאלו כמה עולה כל דבר, השוו מחירים והראו את כל מה שלמדנו בחנות.',
        grammarTopic: 'How much is / are...? & this / that / these / those Review',
        skills: ['Shopping', 'How much?', 'Review'],
        sentenceEn: 'How much are these gloves? They are thirty shekels.',
        sentenceHe: 'כמה עולות הכפפות האלה? הן עולות שלושים שקלים.',
        vocab: [
          ['price', 'noun', 'מחיר', '🏷️', 'The price is on the label.', 'המחיר כתוב על התווית.'],
          ['shekel', 'noun', 'שקל', '🪙', 'This pencil costs one shekel.', 'העיפרון הזה עולה שקל אחד.'],
          ['expensive', 'adjective', 'יקר / יקרה', '💎', 'The gold ring is very expensive.', 'טבעת הזהב יקרה מאוד.'],
          ['shop', 'noun', 'חנות', '🏪', 'The shop opens at nine.', 'החנות נפתחת בתשע.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'mirror', translationHe: 'מראה' },
            { wordEn: 'tennis', translationHe: 'טניס' },
          ],
          shortSentenceEn: 'How much is this cap?',
          shortSentenceHe: 'כמה עולה כובע המצחייה הזה?',
          rule: {
            questionEn: 'Which question is correct?',
            correct: 'How much are those boots?',
            wrong: ['How much is those boots?', 'How many are those boots?'],
            explainHe: 'על מחיר שואלים How much. על כמה דברים (those boots) אומרים are.',
            hintHe: 'שואלים על מחיר, ולא על מספר דברים. ובדקו: האם המגפיים הם דבר אחד או יותר?',
          },
          story: {
            passageEn:
              'Tal and her dad are at the shop. Tal likes a yellow dress. "How much is it?" she asks. The price is ninety shekels. "That is expensive," says Dad. They buy a cap for twenty shekels.',
            passageHe:
              'טל ואבא שלה בחנות. טל אוהבת שמלה צהובה. "כמה היא עולה?" היא שואלת. המחיר הוא תשעים שקלים. "זה יקר," אומר אבא. הם קונים כובע מצחייה בעשרים שקלים.',
            questionEn: 'What do they buy?',
            questionHe: 'מה הם קונים?',
            correct: 'a cap',
            wrong: ['a yellow dress', 'boots'],
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('core-plus', 1),
    titleEn: 'Healthy Body, Happy Me',
    titleHe: 'עונה 2: גוף בריא, אני שמח/ה',
    subtitleHe: 'הרפתקאות בונוס: איברי הגוף (ear, nose, leg), הוראות (Wash your hands!) ו-have got',
    badgeEmoji: '💪',
    missions: [
      {
        icon: '🚿',
        titleEn: 'Wash Your Hands!',
        titleHe: 'לשטוף ידיים!',
        storyHookHe: 'האחות של בית הספר מגיעה לכיתה עם טיפים לגוף בריא. בואו נלמד לתת הוראות באנגלית!',
        grammarTopic: 'Healthy Habits & Imperatives (Wash! Don\'t eat!)',
        skills: ['Health', 'Imperatives', 'Listening'],
        sentenceEn: 'Wash your hands and brush your teeth every day.',
        sentenceHe: 'שטפו ידיים וצחצחו שיניים כל יום.',
        vocab: [
          ['wash', 'verb', 'לשטוף / לרחוץ', '🚿', 'Wash your face in the morning.', 'שטפו פנים בבוקר.'],
          ['hand', 'noun', 'יד / כף יד', '✋', 'I write with my right hand.', 'אני כותב/ת ביד ימין.'],
          ['teeth', 'noun', 'שיניים', '🪥', 'Brush your teeth after dinner.', 'צחצחו שיניים אחרי ארוחת הערב.'],
          ['rest', 'verb', 'לנוח', '🛌', 'Rest in bed when you are sick.', 'נוחו במיטה כשאתם חולים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'sofa', translationHe: 'ספה' },
            { wordEn: 'winner', translationHe: 'מנצח / מנצחת' },
          ],
          shortSentenceEn: 'Wash your hands.',
          shortSentenceHe: 'שטפו ידיים.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: "Don't eat candy at night.",
            wrong: ['No eat candy at night.', "You don't eats candy at night."],
            explainHe: "כדי לומר למישהו לא לעשות משהו מתחילים ב-Don't ואחריו הפועל: Don't eat.",
            hintHe: 'הוראה של "אל" מתחילה במילה מיוחדת שמחוברת ל-not, ואחריה הפועל בלי תוספת.',
          },
          story: {
            passageEn:
              'The school nurse visits our class. "Wash your hands before you eat," she says. "Drink a lot of water. Don\'t sit all day. Go out and play!"',
            passageHe: 'האחות של בית הספר מבקרת בכיתה שלנו. "שטפו ידיים לפני שאתם אוכלים," היא אומרת. "שתו הרבה מים. אל תשבו כל היום. צאו לשחק!"',
            questionEn: 'What does the nurse say to drink?',
            questionHe: 'מה האחות אומרת לשתות?',
            correct: 'water',
            wrong: ['milk', 'juice'],
          },
        },
      },
      {
        icon: '🧍',
        titleEn: 'I Have Got Two Ears',
        titleHe: 'יש לי שתי אוזניים',
        storyHookHe: 'הרובוט החדש של הכיתה רוצה לדעת איך בנוי גוף של אדם. בואו נספר לו עם have got!',
        grammarTopic: 'The Body & "have got / has got"',
        skills: ['Body Parts', 'have got / has got', 'Speaking Aloud'],
        sentenceEn: 'I have got two ears and my dog has got four legs.',
        sentenceHe: 'יש לי שתי אוזניים ולכלב שלי יש ארבע רגליים.',
        vocab: [
          ['ear', 'noun', 'אוזן', '👂', 'I listen with my ears.', 'אני מקשיב/ה באוזניים שלי.'],
          ['nose', 'noun', 'אף', '👃', 'The clown has got a red nose.', 'לליצן יש אף אדום.'],
          ['leg', 'noun', 'רגל', '🦵', 'A spider has got eight legs.', 'לעכביש יש שמונה רגליים.'],
          ['foot', 'noun', 'כף רגל', '🦶', 'I kick the ball with my foot.', 'אני בועט/ת בכדור עם כף הרגל.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'garden', translationHe: 'גינה' },
            { wordEn: 'tomato', translationHe: 'עגבנייה' },
          ],
          shortSentenceEn: 'I have got two ears.',
          shortSentenceHe: 'יש לי שתי אוזניים.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'My cat has got a pink nose.',
            wrong: ['My cat have got a pink nose.', 'My cat has a got pink nose.'],
            explainHe: 'עם he / she / it (החתול) אומרים has got. עם I / we / they אומרים have got.',
            hintHe: 'החתול הוא it. איזו צורה מתאימה לו? ושימו לב ש-got בא מיד אחריה.',
          },
          story: {
            passageEn:
              'Robi is a funny robot. He has got three eyes and a long nose. He has got two legs, but he has got wheels on his feet! He can roll very fast.',
            passageHe: 'רובי הוא רובוט מצחיק. יש לו שלוש עיניים ואף ארוך. יש לו שתי רגליים, אבל יש לו גלגלים על כפות הרגליים! הוא יכול להתגלגל מהר מאוד.',
            questionEn: 'What has Robi got on his feet?',
            questionHe: 'מה יש לרובי על כפות הרגליים?',
            correct: 'wheels',
            wrong: ['shoes', 'boots'],
          },
        },
      },
      {
        icon: '🏆',
        isBoss: true,
        titleEn: 'Boss: Season 2 Finale at the Doctor',
        titleHe: 'אתגר הבוס: סיום עונה 2 אצל הרופא',
        storyHookHe: 'הגמר הגדול של עונה 2! מישהו לא מרגיש טוב. ספרו לרופאה מה כואב, הקשיבו להוראות וזכו בגביע.',
        grammarTopic: 'Imperatives, have got & Health Review',
        skills: ['Health', 'Review', 'Reading Aloud'],
        sentenceEn: 'I have got a sore eye, so the doctor says: rest at home.',
        sentenceHe: 'כואבת לי העין, אז הרופאה אומרת: נוחו בבית.',
        vocab: [
          ['doctor', 'noun', 'רופא / רופאה', '🩺', 'The doctor looks at my ear.', 'הרופאה בודקת לי את האוזן.'],
          ['eye', 'noun', 'עין', '👁️', 'Close one eye and look.', 'עצמו עין אחת והסתכלו.'],
          ['mouth', 'noun', 'פה', '👄', 'Open your mouth and say "ah".', 'פתחו את הפה ותגידו "אה".'],
          ['sick', 'adjective', 'חולה', '🤒', 'My brother is sick today.', 'אח שלי חולה היום.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'basket', translationHe: 'סל' },
            { wordEn: 'kitchen', translationHe: 'מטבח' },
          ],
          shortSentenceEn: 'Open your mouth, please.',
          shortSentenceHe: 'פתחו את הפה, בבקשה.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'She has got a sore throat.',
            wrong: ['She have got a sore throat.', 'She got has a sore throat.'],
            explainHe: 'עם she אומרים has got, וקודם has ואחריו got: She has got.',
            hintHe: 'איזו צורה של have הולכת עם היא? ובדקו איזו מילה באה קודם.',
          },
          story: {
            passageEn:
              'Ella is sick. She has got a hot head and a red eye. Mom takes her to the doctor. The doctor says, "Open your mouth. Drink tea and rest for two days."',
            passageHe:
              'אלה חולה. יש לה ראש חם ועין אדומה. אמא לוקחת אותה לרופא. הרופא אומר: "פתחי את הפה. שתי תה ונוחי יומיים."',
            questionEn: 'What does the doctor say to drink?',
            questionHe: 'מה הרופא אומר לשתות?',
            correct: 'tea',
            wrong: ['milk', 'juice'],
          },
        },
      },
    ],
  },
];

export const CORE_PLUS_GRADE_4_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-4', UNITS);
