import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-plus pack's grade 4 exam bank (Feature 43), by the unit number in its mission ids.
 * New questions only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_PLUS_GRADE_4_EXAM_BANK: ExamBankPack = {
  // Season 2, unit 1: clothes shop, this / that / these / those, How much?
  21: {
    vocabulary: [
      {
        clozeEn: 'It is snowing, so put on your warm ____ and hat.',
        clozeHe: 'יורד שלג, אז לבשו את המעיל החם ושימו כובע.',
        answer: 'coat',
        wrong: ['sunglasses', 'price'],
      },
      {
        clozeEn: 'The sun is very bright. Where are my ____?',
        clozeHe: 'השמש מסנוורת מאוד. איפה משקפי השמש שלי?',
        answer: 'sunglasses',
        wrong: ['scarf', 'shop'],
      },
      {
        clozeEn: 'My hands are cold. I need my ____.',
        clozeHe: 'הידיים קרות. צריך את הכפפות.',
        answer: 'gloves',
        wrong: ['dress', 'shekel'],
      },
      {
        clozeEn: 'The new phone costs a lot. It is very ____.',
        clozeHe: 'הטלפון החדש עולה הרבה. הוא יקר מאוד.',
        answer: 'expensive',
        wrong: ['jeans', 'cap'],
      },
      {
        clozeEn: 'Look at the label. The ____ is forty shekels.',
        clozeHe: 'הסתכלו על התווית. המחיר הוא ארבעים שקלים.',
        answer: 'price',
        wrong: ['boots', 'scarf'],
      },
      {
        clozeEn: 'Grandma has a pretty blue ____ for the wedding.',
        clozeHe: 'לסבתא יש שמלה כחולה יפה לחתונה.',
        answer: 'dress',
        wrong: ['gloves', 'expensive'],
      },
    ],
    grammar: [
      {
        questionEn: 'The scarf is in your hand. Which sentence is correct?',
        correct: 'This scarf is soft.',
        wrong: ['That scarf is soft.', 'These scarf is soft.'],
        explainHe: 'על דבר אחד קרוב (ביד) אומרים this: This scarf.',
        hintHe: 'כמה צעיפים יש כאן, והאם הוא קרוב או רחוק?',
      },
      {
        questionEn: 'The coats are far away. Complete: "____ coats are long."',
        correct: 'Those',
        wrong: ['That', 'These'],
        explainHe: 'על כמה דברים רחוקים אומרים those.',
        hintHe: 'בדקו שני דברים: אחד או הרבה, וקרוב או רחוק.',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'How much is this coat?',
        wrong: ['How much are this coat?', 'How many is this coat?'],
        explainHe: 'על מחיר שואלים How much, ועל דבר אחד אומרים is.',
        hintHe: 'שואלים כאן על מחיר, לא על מספר. והמעיל הוא דבר אחד.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'These jeans are too big.',
        wrong: ['This jeans are too big.', 'These jeans is too big.'],
        explainHe: "jeans היא מילה ברבים, ולכן these ו-are.",
        hintHe: "באנגלית ג'ינס נחשבים כמה דברים. בחרו את המילה ואת צורת be שמתאימות לרבים.",
      },
      {
        questionEn: 'Complete the answer: "How much are the boots?" "____ fifty shekels."',
        correct: 'They are',
        wrong: ['It is', 'He is'],
        explainHe: 'boots הם כמה דברים, ולכן עונים They are.',
        hintHe: 'על מה שואלים: דבר אחד או כמה דברים? בחרו את המילה שמחליפה אותם.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I like that cap over there.',
        wrong: ['I like those cap over there.', 'I like these cap over there.'],
        explainHe: 'cap הוא דבר אחד, והוא רחוק (over there), ולכן that.',
        hintHe: 'הכובע אחד, והוא שם, רחוק. איזו מילה מתאימה לדבר אחד רחוק?',
      },
    ],
    sentences: [
      { en: 'This red scarf is my favorite.', he: 'הצעיף האדום הזה הוא האהוב עליי.' },
      { en: 'How much is that green cap?', he: 'כמה עולה כובע המצחייה הירוק ההוא?' },
      { en: 'These boots are very expensive.', he: 'המגפיים האלה יקרים מאוד.' },
      { en: 'The shop is near the park.', he: 'החנות נמצאת ליד הפארק.' },
      { en: 'Those gloves are only ten shekels.', he: 'הכפפות ההן עולות רק עשרה שקלים.' },
      { en: 'Can I try on this coat, please?', he: 'אפשר למדוד את המעיל הזה, בבקשה?' },
    ],
    passages: [
      {
        passageEn: 'Rina goes to a big clothes shop. She likes a purple dress. The price is eighty shekels. It is expensive, so she buys a scarf for twenty shekels.',
        passageHe: 'רינה הולכת לחנות בגדים גדולה. היא אוהבת שמלה סגולה. המחיר הוא שמונים שקלים. זה יקר, אז היא קונה צעיף בעשרים שקלים.',
        questions: [
          {
            questionEn: 'What color is the dress?',
            questionHe: 'באיזה צבע השמלה?',
            correct: 'Purple.',
            wrong: ['Red.', 'Green.'],
          },
          {
            questionEn: 'What is the price of the dress?',
            questionHe: 'מה המחיר של השמלה?',
            correct: 'Eighty shekels.',
            wrong: ['Twenty shekels.', 'Ten shekels.'],
          },
          {
            questionEn: 'What does Rina buy?',
            questionHe: 'מה רינה קונה?',
            correct: 'A scarf.',
            wrong: ['A dress.', 'Boots.'],
          },
        ],
      },
      {
        passageEn: 'Yoni needs clothes for a ski trip. He tries on these black boots. They are good. Then he sees those gloves on the shelf. They are blue and warm. He buys the boots and the gloves.',
        passageHe: 'יוני צריך בגדים לטיול סקי. הוא מודד את המגפיים השחורים האלה. הם טובים. אחר כך הוא רואה את הכפפות ההן על המדף. הן כחולות וחמות. הוא קונה את המגפיים ואת הכפפות.',
        questions: [
          {
            questionEn: 'Why does Yoni need clothes?',
            questionHe: 'למה יוני צריך בגדים?',
            correct: 'For a ski trip.',
            wrong: ['For a party.', 'For school.'],
          },
          {
            questionEn: 'Where are the gloves?',
            questionHe: 'איפה הכפפות?',
            correct: 'On the shelf.',
            wrong: ['In his bag.', 'Under the table.'],
          },
          {
            questionEn: 'What color are the gloves?',
            questionHe: 'באיזה צבע הכפפות?',
            correct: 'Blue.',
            wrong: ['Black.', 'White.'],
          },
        ],
      },
    ],
  },
  // Season 2, unit 2: health and the body, imperatives, have got
  22: {
    vocabulary: [
      {
        clozeEn: 'I smell the flowers with my ____.',
        clozeHe: 'מריחים את הפרחים עם האף.',
        answer: 'nose',
        wrong: ['foot', 'rest'],
      },
      {
        clozeEn: 'The dentist looks at my ____.',
        clozeHe: 'רופא השיניים בודק לי את השיניים.',
        answer: 'teeth',
        wrong: ['ear', 'sick'],
      },
      {
        clozeEn: 'Ben has got a cold. He is ____ in bed.',
        clozeHe: 'לבן יש הצטננות. הוא חולה במיטה.',
        answer: 'sick',
        wrong: ['hand', 'mouth'],
      },
      {
        clozeEn: 'My ____ hurts, so I can’t walk.',
        clozeHe: 'כואבת לי הרגל, אז אי אפשר ללכת.',
        answer: 'leg',
        wrong: ['eye', 'wash'],
      },
      {
        clozeEn: 'Raise your ____ if you know the answer.',
        clozeHe: 'הרימו יד אם אתם יודעים את התשובה.',
        answer: 'hand',
        wrong: ['nose', 'doctor'],
      },
      {
        clozeEn: 'I hear the music with my left ____.',
        clozeHe: 'שומעים את המוזיקה באוזן שמאל.',
        answer: 'ear',
        wrong: ['teeth', 'sick'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'Drink water after sports.',
        wrong: ['You drinks water after sports.', 'Drinking water after sports!'],
        explainHe: 'הוראה מתחילה בפועל עצמו, בלי you ובלי ing: Drink water.',
        hintHe: 'הוראה פותחת ישר בפועל בצורה הפשוטה שלו.',
      },
      {
        questionEn: 'Complete the rule: "____ touch your eyes."',
        correct: "Don't",
        wrong: ['No', 'Not'],
        explainHe: 'הוראה של "אל" מתחילה ב-Don’t: Don’t touch.',
        hintHe: 'הוראה של "אל" מתחילה במילה שבנויה מ-do ו-not.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'We have got two eyes.',
        wrong: ['We has got two eyes.', 'We have get two eyes.'],
        explainHe: 'עם we אומרים have got: We have got.',
        hintHe: 'איזו צורה של have הולכת עם אנחנו? ובדקו את המילה שבאה אחריה.',
      },
      {
        questionEn: 'Complete the sentence: "My dog ____ got a black nose."',
        correct: 'has',
        wrong: ['have', 'is'],
        explainHe: 'הכלב הוא it, ולכן has got.',
        hintHe: 'הכלב הוא it. איזו צורה של have מתאימה ל-he / she / it?',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Have you got a cold?',
        wrong: ['Do you got a cold?', 'You have got a cold?'],
        explainHe: 'בשאלה עם have got שמים את have בהתחלה: Have you got...?',
        hintHe: 'בשאלה עם got, המילה הראשונה במשפט הרגיל עוברת לפני you.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'Please open your mouth.',
        wrong: ['Please opens your mouth.', 'Please you opening your mouth.'],
        explainHe: 'בהוראה הפועל בא בצורה הפשוטה: open, גם אחרי please.',
        hintHe: 'הוראה נשארת בצורה הפשוטה של הפועל, בלי סיומות.',
      },
    ],
    sentences: [
      { en: 'Wash your hands with soap and water.', he: 'שטפו ידיים במים ובסבון.' },
      { en: 'My baby brother has got small feet.', he: 'לאח התינוק שלי יש כפות רגליים קטנות.' },
      { en: "Don't eat too much candy.", he: 'אל תאכלו יותר מדי ממתקים.' },
      { en: 'The doctor has got a white coat.', he: 'לרופאה יש חלוק לבן.' },
      { en: 'Rest and drink hot tea.', he: 'נוחו ושתו תה חם.' },
      { en: 'An owl has got very big eyes.', he: 'לינשוף יש עיניים גדולות מאוד.' },
    ],
    passages: [
      {
        passageEn: 'Dan is sick today. He has got a red nose and a sore throat. Mom says, "Stay in bed and rest." Dan drinks hot soup. He reads a comic book in bed.',
        passageHe: 'דן חולה היום. יש לו אף אדום וכאב גרון. אמא אומרת: "תישאר במיטה ותנוח." דן שותה מרק חם. הוא קורא חוברת קומיקס במיטה.',
        questions: [
          {
            questionEn: 'What color is Dan’s nose?',
            questionHe: 'באיזה צבע האף של דן?',
            correct: 'Red.',
            wrong: ['Blue.', 'White.'],
          },
          {
            questionEn: 'What does Dan drink?',
            questionHe: 'מה דן שותה?',
            correct: 'Hot soup.',
            wrong: ['Cold water.', 'Orange juice.'],
          },
          {
            questionEn: 'What does Dan read?',
            questionHe: 'מה דן קורא?',
            correct: 'A comic book.',
            wrong: ['A newspaper.', 'A letter.'],
          },
        ],
      },
      {
        passageEn: 'Our coach has got rules for the team. Drink water in every break. Don’t play with a sore leg. Stretch your legs before the game. Sleep well before a big match.',
        passageHe: 'למאמן שלנו יש כללים לקבוצה. שתו מים בכל הפסקה. אל תשחקו עם רגל כואבת. מתחו את הרגליים לפני המשחק. ישנו טוב לפני משחק גדול.',
        questions: [
          {
            questionEn: 'When do the players drink water?',
            questionHe: 'מתי השחקנים שותים מים?',
            correct: 'In every break.',
            wrong: ['After the match.', 'At night.'],
          },
          {
            questionEn: 'What do they stretch before the game?',
            questionHe: 'מה הם מותחים לפני המשחק?',
            correct: 'Their legs.',
            wrong: ['Their hands.', 'Their necks.'],
          },
          {
            questionEn: 'What must they do before a big match?',
            questionHe: 'מה הם צריכים לעשות לפני משחק גדול?',
            correct: 'Sleep well.',
            wrong: ['Eat candy.', 'Play all night.'],
          },
        ],
      },
    ],
  },
};
