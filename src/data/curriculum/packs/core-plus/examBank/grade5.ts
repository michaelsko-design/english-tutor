import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-plus pack's grade 5 exam bank (Feature 43), by the unit number in its mission ids.
 * New questions only. The last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_PLUS_GRADE_5_EXAM_BANK: ExamBankPack = {
  // Family words, my / his / her / their, possessive 's & whose
  21: {
    vocabulary: [
      {
        clozeEn: 'My mom’s sister is my ____.',
        clozeHe: 'האחות של אמא שלי היא הדודה שלי.',
        answer: 'aunt',
        wrong: ['uncle', 'nephew'],
      },
      {
        clozeEn: 'Ido and Ori were born on the same day. They are ____.',
        clozeHe: 'עידו ואורי נולדו באותו יום. הם תאומים.',
        answer: 'twins',
        wrong: ['glasses', 'photo'],
      },
      {
        clozeEn: 'It is raining, so take your ____.',
        clozeHe: 'יורד גשם, אז קחו את המטרייה.',
        answer: 'umbrella',
        wrong: ['scarf', 'baby'],
      },
      {
        clozeEn: '____ shoes are these under the bed?',
        clozeHe: 'של מי הנעליים האלה שמתחת למיטה?',
        answer: 'Whose',
        wrong: ['Aunt', 'Photo'],
      },
      {
        clozeEn: 'My brother’s son is my ____.',
        clozeHe: 'הבן של אחי הוא האחיין שלי.',
        answer: 'nephew',
        wrong: ['niece', 'aunt'],
      },
      {
        clozeEn: 'Grandma can’t see well without her ____.',
        clozeHe: 'סבתא לא רואה טוב בלי המשקפיים שלה.',
        answer: 'glasses',
        wrong: ['cousin', 'uncle'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete: "Gal and Tom love ____ new puppy."',
        correct: 'their',
        wrong: ['his', 'they'],
        explainHe: 'Gal and Tom הם שניים (they), ולכן their (שלהם).',
        hintHe: 'כמה אנשים יש כאן? חפשו את המילה שאומרת "שלהם", ולא "הם".',
      },
      {
        questionEn: 'Complete: "Uncle Dov is washing ____ car."',
        correct: 'his',
        wrong: ['her', 'he'],
        explainHe: 'Uncle Dov הוא גבר, ולכן his (שלו).',
        hintHe: 'Uncle Dov הוא גבר. איזו מילה אומרת "שלו"? שימו לב: he זה "הוא".',
      },
      {
        questionEn: 'How do you say "the doll of Michal"?',
        correct: "Michal's doll",
        wrong: ['Michals doll', "doll Michal's"],
        explainHe: 'קודם הבעלים עם ’s ואחר כך החפץ: Michal’s doll.',
        hintHe: 'באנגלית הבעלים בא קודם, עם גרש ו-s, ורק אחריו החפץ.',
      },
      {
        questionEn: 'Which question asks "של מי הכובע הזה?"',
        correct: 'Whose hat is this?',
        wrong: ['Who hat is this?', 'Where hat is this?'],
        explainHe: 'Whose שואל "של מי". Who שואל "מי", ו-Where שואל "איפה".',
        hintHe: 'צריך מילת שאלה שאומרת "של מי", לא "מי" ולא "איפה".',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'My sister and I clean our room.',
        wrong: ['My sister and I clean we room.', 'My sister and I clean us room.'],
        explainHe: 'My sister and I הם "אנחנו", ו"שלנו" באנגלית הוא our.',
        hintHe: 'My sister and I = אנחנו. איזו מילה אומרת "שלנו"? היא לא we ולא us.',
      },
      {
        questionEn: 'Complete: "This is ____ bike." (האופניים של אבא)',
        correct: "Dad's",
        wrong: ['Dads', 'Dad'],
        explainHe: 'כדי להגיד "של אבא" מוסיפים ’s: Dad’s bike.',
        hintHe: 'כדי להגיד "של" מוסיפים לשם גרש ואות אחת.',
      },
    ],
    sentences: [
      { en: 'My uncle has three children and a big dog.', he: 'לדוד שלי יש שלושה ילדים וכלב גדול.' },
      { en: 'Whose blue scarf is on the bench?', he: 'של מי הצעיף הכחול שעל הספסל?' },
      { en: 'Her cousin lives next to the library.', he: 'בת הדודה שלה גרה ליד הספרייה.' },
      { en: "This is my grandpa's old photo.", he: 'זו התמונה הישנה של סבא שלי.' },
      { en: 'The baby sleeps in his small bed.', he: 'התינוק ישן במיטה הקטנה שלו.' },
      { en: "Our niece always plays with Dana's cat.", he: 'האחיינית שלנו תמיד משחקת עם החתולה של דנה.' },
    ],
    passages: [
      {
        passageEn:
          'Lior has a small family tree on her bedroom wall. At the top there are her grandparents. Under them there are her parents and her aunt Tali. Aunt Tali has twin boys. Lior loves her cousins because they are very funny.',
        passageHe:
          'לליאור יש עץ משפחה קטן על הקיר בחדר השינה שלה. למעלה נמצאים סבא וסבתא שלה. מתחתם נמצאים ההורים שלה והדודה שלה טלי. לדודה טלי יש תאומים בנים. ליאור אוהבת את בני הדודים שלה כי הם מצחיקים מאוד.',
        questions: [
          {
            questionEn: 'Where is the family tree?',
            questionHe: 'איפה עץ המשפחה?',
            correct: 'On her bedroom wall.',
            wrong: ['In her school bag.', 'On the kitchen door.'],
          },
          {
            questionEn: 'Who is at the top of the tree?',
            questionHe: 'מי נמצא בראש העץ?',
            correct: 'Her grandparents.',
            wrong: ['Her cousins.', 'Aunt Tali.'],
          },
          {
            questionEn: 'Why does Lior love her cousins?',
            questionHe: 'למה ליאור אוהבת את בני הדודים שלה?',
            correct: 'Because they are very funny.',
            wrong: ['Because they are very tall.', 'Because they live near her.'],
          },
        ],
      },
      {
        passageEn:
          'On Monday the teacher finds a green umbrella in the classroom. She asks the class whose umbrella it is. Nobody answers. Then Adam remembers his sister’s green umbrella. He takes it home after school.',
        passageHe:
          'ביום שני המורה מוצאת מטרייה ירוקה בכיתה. היא שואלת את הכיתה של מי המטרייה. אף אחד לא עונה. אז אדם נזכר במטרייה הירוקה של אחותו. הוא לוקח אותה הביתה אחרי בית הספר.',
        questions: [
          {
            questionEn: 'What does the teacher find?',
            questionHe: 'מה המורה מוצאת?',
            correct: 'A green umbrella.',
            wrong: ['A red scarf.', 'Old glasses.'],
          },
          {
            questionEn: 'Whose umbrella is it?',
            questionHe: 'של מי המטרייה?',
            correct: 'Adam’s sister’s.',
            wrong: ['The teacher’s.', 'Adam’s mother’s.'],
          },
          {
            questionEn: 'When does Adam take it home?',
            questionHe: 'מתי אדם לוקח אותה הביתה?',
            correct: 'After school.',
            wrong: ['In the morning.', 'On Friday.'],
          },
        ],
      },
    ],
  },

  // Cooking: some / any, countable & uncountable nouns
  22: {
    vocabulary: [
      {
        clozeEn: 'Mix the eggs and the milk in a ____.',
        clozeHe: 'ערבבו את הביצים ואת החלב בקערה.',
        answer: 'bowl',
        wrong: ['oven', 'recipe'],
      },
      {
        clozeEn: 'Bake the bread in a hot ____ for one hour.',
        clozeHe: 'אפו את הלחם בתנור חם במשך שעה.',
        answer: 'oven',
        wrong: ['bowl', 'carrot'],
      },
      {
        clozeEn: 'Rabbits love to eat a long orange ____.',
        clozeHe: 'ארנבים אוהבים לאכול גזר כתום וארוך.',
        answer: 'carrot',
        wrong: ['sugar', 'flour'],
      },
      {
        clozeEn: 'Read the ____ before you start to cook.',
        clozeHe: 'קראו את המתכון לפני שמתחילים לבשל.',
        answer: 'recipe',
        wrong: ['onion', 'cheese'],
      },
      {
        clozeEn: 'In winter my dad makes hot vegetable ____.',
        clozeHe: 'בחורף אבא שלי מכין מרק ירקות חם.',
        answer: 'soup',
        wrong: ['flour', 'bowl'],
      },
      {
        clozeEn: 'Lemonade needs water, lemons and a little ____.',
        clozeHe: 'לימונדה צריכה מים, לימונים וקצת סוכר.',
        answer: 'sugar',
        wrong: ['tomato', 'oven'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete: "We need ____ eggs for the cake."',
        correct: 'some',
        wrong: ['any', 'a'],
        explainHe: 'במשפט חיובי אומרים some. eggs הם רבים, ולכן לא a.',
        hintHe: 'זה משפט חיובי עם שם עצם ברבים. איזו מילה מתאימה למשפט חיובי?',
      },
      {
        questionEn: 'Complete: "There isn\'t ____ milk in the fridge."',
        correct: 'any',
        wrong: ['some', 'a'],
        explainHe: 'במשפט שלילה (isn’t) אומרים any.',
        hintHe: 'שימו לב למילת השלילה במשפט. איזו מילה באה בשלילה?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I would like an apple and some bread.',
        wrong: ['I would like a apple and a bread.', 'I would like an apple and breads.'],
        explainHe: 'apple מתחיל בתנועה ולכן an apple. bread הוא דבר שלא סופרים, ולכן some bread.',
        hintHe: 'בדקו את שני שמות העצם: אחד סופרים ומתחיל בתנועה, ואת השני לא סופרים בכלל.',
      },
      {
        questionEn: 'Complete: "Do you have ____ tomatoes?"',
        correct: 'any',
        wrong: ['a', 'an'],
        explainHe: 'בשאלה אומרים any, ו-tomatoes הם רבים, ולכן לא a ולא an.',
        hintHe: 'זו שאלה, ושם העצם ברבים. מילים שמתאימות לדבר אחד לא יעבדו כאן.',
      },
      {
        questionEn: 'Which word is uncountable (we can\'t count it)?',
        correct: 'water',
        wrong: ['onion', 'carrot'],
        explainHe: 'אי אפשר לספור מים (one water, two waters), ולכן water הוא uncountable.',
        hintHe: 'נסו להגיד "אחד, שניים" לפני כל מילה. את מה אי אפשר לספור?',
      },
      {
        questionEn: 'Complete: "She puts ____ onion in the soup."',
        correct: 'an',
        wrong: ['a', 'some'],
        explainHe: 'onion מתחיל בתנועה (o), ולכן an onion. זה בצל אחד שסופרים.',
        hintHe: 'בדקו באיזו אות מתחילה המילה onion. לפני תנועה הצורה משתנה.',
      },
    ],
    sentences: [
      { en: 'We need some flour and two eggs.', he: 'אנחנו צריכים קצת קמח ושתי ביצים.' },
      { en: "There isn't any cheese for the pizza.", he: 'אין גבינה לפיצה.' },
      { en: 'My grandma has an old cake recipe.', he: 'לסבתא שלי יש מתכון ישן לעוגה.' },
      { en: 'Are there any onions in the basket?', he: 'יש בצלים בסל?' },
      { en: 'Dad puts the pancakes on a big plate.', he: 'אבא שם את הפנקייקים על צלחת גדולה.' },
      { en: 'I like hot chocolate on cold days.', he: 'אני אוהב/ת שוקו חם בימים קרים.' },
    ],
    passages: [
      {
        passageEn:
          'Ella wants to make a salad for her family. She looks in the fridge. There are some tomatoes and two carrots. But there isn’t any cheese. Ella asks her brother to buy some cheese at the shop.',
        passageHe:
          'אלה רוצה להכין סלט למשפחה שלה. היא מסתכלת במקרר. יש כמה עגבניות ושני גזרים. אבל אין גבינה. אלה מבקשת מאחיה לקנות קצת גבינה בחנות.',
        questions: [
          {
            questionEn: 'What does Ella want to make?',
            questionHe: 'מה אלה רוצה להכין?',
            correct: 'A salad.',
            wrong: ['A cake.', 'Some soup.'],
          },
          {
            questionEn: 'How many carrots are there in the fridge?',
            questionHe: 'כמה גזרים יש במקרר?',
            correct: 'Two carrots.',
            wrong: ['One carrot.', 'Five carrots.'],
          },
          {
            questionEn: 'What does her brother buy at the shop?',
            questionHe: 'מה אחיה קונה בחנות?',
            correct: 'Some cheese.',
            wrong: ['Some tomatoes.', 'Some bread.'],
          },
        ],
      },
      {
        passageEn:
          'Every Friday Uri cooks with his grandpa. This week they are making pancakes. They need flour, milk and sugar. Grandpa has a secret recipe from his mother. The pancakes are ready at five o’clock.',
        passageHe:
          'בכל יום שישי אורי מבשל עם סבא שלו. השבוע הם מכינים פנקייקים. הם צריכים קמח, חלב וסוכר. לסבא יש מתכון סודי מאמא שלו. הפנקייקים מוכנים בשעה חמש.',
        questions: [
          {
            questionEn: 'When does Uri cook with his grandpa?',
            questionHe: 'מתי אורי מבשל עם סבא שלו?',
            correct: 'Every Friday.',
            wrong: ['Every Monday.', 'Every evening.'],
          },
          {
            questionEn: 'Where is the secret recipe from?',
            questionHe: 'ממי המתכון הסודי?',
            correct: 'From his mother.',
            wrong: ['From a book.', 'From the shop.'],
          },
          {
            questionEn: 'What time are the pancakes ready?',
            questionHe: 'באיזו שעה הפנקייקים מוכנים?',
            correct: 'At five o’clock.',
            wrong: ['At six o’clock.', 'At noon.'],
          },
        ],
      },
    ],
  },
};
