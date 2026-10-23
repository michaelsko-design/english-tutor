import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * Core-plus ("Season 2") grade 5 units: possessives (my / his / her, 's, whose) with family words,
 * then cooking with some / any and countable / uncountable nouns. They build on units 1–4
 * (be, have / has, Present Simple). The cooking Boss is the grade's new finale.
 */
const UNITS: ElementaryUnitSpec[] = [
  {
    ...packUnitNumbers('core-plus', 0),
    titleEn: 'Family Tree & Whose Is It?',
    titleHe: 'עץ המשפחה ושל מי זה?',
    subtitleHe: "עונה 2: בני משפחה, my / his / her / their ו-’s (Dana's bag)",
    badgeEmoji: '👪',
    missions: [
      {
        icon: '🌳',
        titleEn: 'My Family Tree',
        titleHe: 'עץ המשפחה שלי',
        storyHookHe: 'עונה 2 מתחילה! בונים עץ משפחה ומספרים מי זה מי עם my, his, her ו-their.',
        grammarTopic: 'Possessive Adjectives (my / his / her / their)',
        skills: ['Family Words', 'my / his / her', 'Voice Practice'],
        sentenceEn: 'My aunt lives in Haifa with her two cats.',
        sentenceHe: 'הדודה שלי גרה בחיפה עם שני החתולים שלה.',
        vocab: [
          ['aunt', 'noun', 'דודה', '👩', 'My aunt teaches music at a school.', 'הדודה שלי מלמדת מוזיקה בבית ספר.'],
          ['uncle', 'noun', 'דוד', '🧔', 'Our uncle has a big red truck.', 'לדוד שלנו יש משאית אדומה גדולה.'],
          ['cousin', 'noun', 'בן דוד / בת דודה', '🧒', 'My cousin is ten years old.', 'בן הדוד שלי בן עשר.'],
          ['twins', 'noun', 'תאומים', '👫', 'The twins have the same birthday.', 'לתאומים יש אותו יום הולדת.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'teacher', translationHe: 'מורה' },
            { wordEn: 'doctor', translationHe: 'רופא' },
          ],
          shortSentenceEn: 'This is my aunt.',
          shortSentenceHe: 'זו הדודה שלי.',
          rule: {
            questionEn: 'Noa has a cousin. Which sentence is correct?',
            correct: 'Her cousin is funny.',
            wrong: ['His cousin is funny.', 'She cousin is funny.'],
            explainHe: 'נועה היא בת, ולכן אומרים her (שלה). his זה "שלו", ו-she זה "היא" ולא "שלה".',
            hintHe: 'נועה היא בת. איזו מילה אומרת "שלה"? שימו לב: she זה "היא".',
          },
          story: {
            passageEn:
              'Maya has a big family. Her uncle Avi has twins, Tom and Gal. They are her cousins. Their dog is called Bamba. Maya visits them every Friday.',
            passageHe:
              'למאיה יש משפחה גדולה. לדוד שלה אבי יש תאומים, תום וגל. הם בני הדודים שלה. הכלב שלהם נקרא במבה. מאיה מבקרת אותם בכל יום שישי.',
            questionEn: 'What is the name of their dog?',
            questionHe: 'איך קוראים לכלב שלהם?',
            correct: 'Bamba',
            wrong: ['Tom', 'Gal'],
          },
        },
      },
      {
        icon: '🔍',
        titleEn: 'Whose Is It? Lost and Found',
        titleHe: 'של מי זה? פינת האבדות',
        storyHookHe: 'בפינת האבדות של בית הספר מחכים חפצים לבעלים שלהם! נגלה של מי כל דבר עם Whose ועם ’s.',
        grammarTopic: "Possessive 's & Whose",
        skills: ["Possessive 's", 'Whose Questions', 'Reading'],
        sentenceEn: "This is Dana's umbrella and that is Ben's scarf.",
        sentenceHe: 'זו המטרייה של דנה וזה הצעיף של בן.',
        vocab: [
          ['whose', 'question word', 'של מי', '❓', 'Whose pencil is on the floor?', 'של מי העיפרון שעל הרצפה?'],
          ['umbrella', 'noun', 'מטרייה', '☂️', 'I have a yellow umbrella.', 'יש לי מטרייה צהובה.'],
          ['scarf', 'noun', 'צעיף', '🧣', 'My scarf is long and warm.', 'הצעיף שלי ארוך וחם.'],
          ['glasses', 'noun', 'משקפיים', '👓', "Grandpa can't read without his glasses.", 'סבא לא יכול לקרוא בלי המשקפיים שלו.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'pillow', translationHe: 'כרית' },
            { wordEn: 'kitchen', translationHe: 'מטבח' },
          ],
          shortSentenceEn: "It is Dana's scarf.",
          shortSentenceHe: 'זה הצעיף של דנה.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: "This is Ron's umbrella.",
            wrong: ['This is Rons umbrella.', 'This is Ron umbrella.'],
            explainHe: 'כדי להגיד של מי משהו מוסיפים לשם ’s: Ron’s umbrella = המטרייה של רון. בלי הגרש, Rons נשמע כמו רבים.',
            hintHe: 'כדי להגיד "של רון" מוסיפים משהו לשם עצמו: גרש ואות אחת.',
          },
          story: {
            passageEn:
              "The lost and found box is full. There is a blue scarf, a red umbrella and old glasses. The scarf is Yoni's. The umbrella is Shira's. Nobody knows whose glasses they are.",
            passageHe:
              'קופסת האבדות מלאה. יש בה צעיף כחול, מטרייה אדומה ומשקפיים ישנים. הצעיף של יוני. המטרייה של שירה. אף אחד לא יודע של מי המשקפיים.',
            questionEn: 'Whose is the red umbrella?',
            questionHe: 'של מי המטרייה האדומה?',
            correct: "Shira's",
            wrong: ["Yoni's", "the teacher's"],
          },
        },
      },
      {
        icon: '🧺',
        isBoss: true,
        titleEn: 'Boss: The Big Family Picnic',
        titleHe: 'אתגר הבוס: הפיקניק המשפחתי הגדול',
        storyHookHe: 'כל המשפחה נפגשת בפארק! הראו שאתם יודעים לספר של מי כל דבר עם my, his, her, their ו-’s.',
        grammarTopic: "Review: Possessives (my / his / her & 's)",
        skills: ['Review', "Possessives & 's", 'Reading'],
        sentenceEn: 'My niece takes a photo of her baby brother.',
        sentenceHe: 'האחיינית שלי מצלמת תמונה של אחיה התינוק.',
        vocab: [
          ['niece', 'noun', 'אחיינית', '👧', 'My niece loves to draw animals.', 'האחיינית שלי אוהבת לצייר חיות.'],
          ['nephew', 'noun', 'אחיין', '👦', 'Her nephew plays football every day.', 'האחיין שלה משחק כדורגל כל יום.'],
          ['baby', 'noun', 'תינוק / תינוקת', '👶', 'The baby sleeps in the afternoon.', 'התינוק ישן אחר הצהריים.'],
          ['photo', 'noun', 'תמונה / צילום', '📷', 'This photo is from my birthday.', 'התמונה הזאת היא מיום ההולדת שלי.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'garden', translationHe: 'גינה' },
            { wordEn: 'pencil', translationHe: 'עיפרון' },
          ],
          shortSentenceEn: 'Look at their photo.',
          shortSentenceHe: 'תסתכלו על התמונה שלהם.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: "The twins love their grandma's cake.",
            wrong: ["The twins love they grandma's cake.", 'The twins love their grandmas cake.'],
            explainHe: 'their אומר "שלהם" (they זה רק "הם"), ו-grandma’s עם גרש ו-s אומר "של סבתא".',
            hintHe: 'בדקו שני דברים: איזו מילה אומרת "שלהם", ואיך כותבים "של סבתא".',
          },
          story: {
            passageEn:
              'On Saturday the whole family has a picnic in the park. Aunt Rina brings her famous cake. Uncle Moshe plays with his baby son. My cousins take photos with their new camera. Everyone is happy.',
            passageHe:
              'בשבת כל המשפחה עושה פיקניק בפארק. הדודה רינה מביאה את העוגה המפורסמת שלה. הדוד משה משחק עם הבן התינוק שלו. בני הדודים שלי מצלמים תמונות עם המצלמה החדשה שלהם. כולם שמחים.',
            questionEn: 'Who brings a cake?',
            questionHe: 'מי מביא/ה עוגה?',
            correct: 'Aunt Rina',
            wrong: ['Uncle Moshe', 'the cousins'],
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('core-plus', 1),
    titleEn: 'Cooking Club: Some & Any',
    titleHe: 'מועדון הבישול: Some ו-Any',
    subtitleHe: 'עונה 2: מתכונים, some / any, דברים שסופרים ושלא סופרים – והגמר החדש של כיתה ה׳!',
    badgeEmoji: '🍲',
    missions: [
      {
        icon: '🥚',
        titleEn: "Let's Bake a Cake",
        titleHe: 'בואו נאפה עוגה!',
        storyHookHe: 'נכנסים למטבח של מועדון הבישול! נבדוק מה יש לנו עם some ומה אין לנו עם any.',
        grammarTopic: 'Some / Any',
        skills: ['Kitchen Words', 'Some / Any', 'Voice Practice'],
        sentenceEn: "We have some flour, but we don't have any sugar.",
        sentenceHe: 'יש לנו קצת קמח, אבל אין לנו סוכר בכלל.',
        vocab: [
          ['flour', 'noun', 'קמח', '🌾', 'We need flour for the pizza dough.', 'אנחנו צריכים קמח לבצק של הפיצה.'],
          ['sugar', 'noun', 'סוכר', '🍬', 'I drink tea without sugar.', 'אני שותה תה בלי סוכר.'],
          ['bowl', 'noun', 'קערה', '🥣', 'Put the eggs in a big bowl.', 'שימו את הביצים בקערה גדולה.'],
          ['oven', 'noun', 'תנור', '🔥', 'The oven is very hot.', 'התנור חם מאוד.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'ladder', translationHe: 'סולם' },
            { wordEn: 'sock', translationHe: 'גרב' },
          ],
          shortSentenceEn: 'We have some flour.',
          shortSentenceHe: 'יש לנו קצת קמח.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: "We don't have any eggs.",
            wrong: ["We don't have some eggs.", "We doesn't have any eggs."],
            explainHe: 'במשפט חיובי אומרים some, ובשלילה ובשאלה אומרים any. עם we אומרים don’t: We don’t have any eggs.',
            hintHe: 'זה משפט שלילה, ובשלילה יש מילה אחרת מזו שבמשפט חיובי. בדקו גם את צורת השלילה עם we.',
          },
          story: {
            passageEn:
              "Noa and her dad want to bake a cake. They have some flour and some eggs. But there isn't any sugar in the kitchen. Dad goes to the shop. Then they put the cake in the oven.",
            passageHe:
              'נועה ואבא שלה רוצים לאפות עוגה. יש להם קצת קמח וכמה ביצים. אבל אין סוכר במטבח. אבא הולך לחנות. אחר כך הם מכניסים את העוגה לתנור.',
            questionEn: 'What is missing in the kitchen?',
            questionHe: 'מה חסר במטבח?',
            correct: 'sugar',
            wrong: ['flour', 'eggs'],
          },
        },
      },
      {
        icon: '🧀',
        titleEn: 'Pizza Night: Count It or Not?',
        titleHe: 'ערב פיצה: סופרים או לא?',
        storyHookHe: 'מכינים פיצה! עגבנייה אחת, שלוש עגבניות... אבל גבינה לא סופרים. נלמד מתי אומרים a ומתי some.',
        grammarTopic: 'Countable & Uncountable Nouns (a / an / some)',
        skills: ['Food Words', 'Countable / Uncountable', 'Reading'],
        sentenceEn: 'I need an onion, two tomatoes and some cheese.',
        sentenceHe: 'אני צריך/ה בצל, שתי עגבניות וקצת גבינה.',
        vocab: [
          ['cheese', 'noun', 'גבינה', '🧀', 'This cheese is soft and white.', 'הגבינה הזאת רכה ולבנה.'],
          ['tomato', 'noun', 'עגבנייה', '🍅', 'A tomato is red and round.', 'עגבנייה היא אדומה ועגולה.'],
          ['onion', 'noun', 'בצל', '🧅', 'There is an onion in the salad.', 'יש בצל בסלט.'],
          ['carrot', 'noun', 'גזר', '🥕', 'The carrot is orange and long.', 'הגזר כתום וארוך.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'shoe', translationHe: 'נעל' },
            { wordEn: 'chair', translationHe: 'כיסא' },
          ],
          shortSentenceEn: 'I need some cheese.',
          shortSentenceHe: 'אני צריך/ה קצת גבינה.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'I want some cheese on my pizza.',
            wrong: ['I want a cheese on my pizza.', 'I want cheeses on my pizza.'],
            explainHe: 'cheese הוא דבר שלא סופרים (uncountable), ולכן לא אומרים a cheese ולא cheeses.',
            hintHe: 'האם אפשר לספור גבינה? לפני דבר שלא סופרים לא שמים a, וגם לא מוסיפים לו s.',
          },
          story: {
            passageEn:
              "Tonight Ben makes pizza with his grandpa. They put tomato sauce and some cheese on the dough. Ben cuts an onion. Grandpa adds two carrots to the salad. The pizza is ready at seven o'clock.",
            passageHe:
              'הערב בן מכין פיצה עם סבא שלו. הם שמים רוטב עגבניות וקצת גבינה על הבצק. בן חותך בצל. סבא מוסיף שני גזרים לסלט. הפיצה מוכנה בשעה שבע.',
            questionEn: 'What does Ben cut?',
            questionHe: 'מה בן חותך?',
            correct: 'an onion',
            wrong: ['two carrots', 'some cheese'],
          },
        },
      },
      {
        icon: '🍝',
        isBoss: true,
        titleEn: 'Boss: The Great Chef Finale',
        titleHe: 'אתגר הבוס: גמר השפים הגדול',
        storyHookHe: 'זה הגמר של עונה 2! מכינים ארוחה ענקית. הראו שאתם יודעים some, any, a ו-an.',
        grammarTopic: 'Review: Some / Any & Countable / Uncountable',
        skills: ['Review', 'Some / Any', 'Reading'],
        sentenceEn: 'Is there any chocolate for the pancakes?',
        sentenceHe: 'יש שוקולד לפנקייקים?',
        vocab: [
          ['recipe', 'noun', 'מתכון', '📜', 'This recipe is from my grandma.', 'המתכון הזה מסבתא שלי.'],
          ['soup', 'noun', 'מרק', '🍲', 'Hot soup is great in winter.', 'מרק חם נהדר בחורף.'],
          ['pancake', 'noun', 'פנקייק / לביבה', '🥞', 'I eat a pancake with honey.', 'אני אוכל/ת פנקייק עם דבש.'],
          ['chocolate', 'noun', 'שוקולד', '🍫', 'We have some dark chocolate.', 'יש לנו קצת שוקולד מריר.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'bridge', translationHe: 'גשר' },
            { wordEn: 'ruler', translationHe: 'סרגל' },
          ],
          shortSentenceEn: 'Is there any soup?',
          shortSentenceHe: 'יש מרק?',
          rule: {
            questionEn: 'Which question is correct?',
            correct: 'Are there any pancakes on the plate?',
            wrong: ['Is there any pancakes on the plate?', 'Are there some pancake on the plate?'],
            explainHe: 'בשאלה משתמשים ב-any. pancakes הם רבים, ולכן Are there any pancakes?',
            hintHe: 'pancakes הם רבים. בדקו איזו צורה של be מתאימה לרבים, ואיזו מילה באה בשאלה.',
          },
          story: {
            passageEn:
              "The cooking club has a big final today. Every team gets a recipe. Lia's team makes tomato soup. Omer's team makes pancakes, but there isn't any chocolate. They use some honey. The teacher loves both dishes.",
            passageHe:
              'למועדון הבישול יש היום גמר גדול. כל קבוצה מקבלת מתכון. הקבוצה של ליה מכינה מרק עגבניות. הקבוצה של עומר מכינה פנקייקים, אבל אין שוקולד. הם משתמשים בקצת דבש. המורה אוהב/ת את שתי המנות.',
            questionEn: "What does Lia's team make?",
            questionHe: 'מה מכינה הקבוצה של ליה?',
            correct: 'tomato soup',
            wrong: ['pancakes', 'pizza'],
          },
        },
      },
    ],
  },
];

export const CORE_PLUS_GRADE_5_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-5', UNITS);
