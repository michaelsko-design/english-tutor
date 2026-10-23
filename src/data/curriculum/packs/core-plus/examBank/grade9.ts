import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-plus pack's grade 9 exam bank (Feature 43), by the unit number in its mission ids.
 * New questions only. The last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_PLUS_GRADE_9_EXAM_BANK: ExamBankPack = {
  // Season 2, unit A: Past Perfect (had + V3), before / after / by the time
  21: {
    vocabulary: [
      {
        clozeEn: 'The police asked every ____ to describe the man in the red cap.',
        clozeHe: 'המשטרה ביקשה מכל עד ראייה לתאר את האיש בכובע האדום.',
        answer: 'witness',
        wrong: ['footprint', 'alarm'],
      },
      {
        clozeEn: 'Our cat likes to ____ under the bed whenever guests arrive.',
        clozeHe: 'החתול שלנו אוהב להיעלם מתחת למיטה בכל פעם שמגיעים אורחים.',
        answer: 'disappear',
        wrong: ['confess', 'reveal'],
      },
      {
        clozeEn: 'The fire ____ rang during the maths lesson, so we all went outside.',
        clozeHe: 'אזעקת האש צלצלה בשיעור מתמטיקה, אז כולנו יצאנו החוצה.',
        answer: 'alarm',
        wrong: ['clue', 'suspect'],
      },
      {
        clozeEn: 'Scientists want to ____ why the fish left the lake.',
        clozeHe: 'מדענים רוצים לחקור למה הדגים עזבו את האגם.',
        answer: 'investigate',
        wrong: ['disappear', 'witness'],
      },
      {
        clozeEn: 'There was one small ____ in the message: a drawing of a key.',
        clozeHe: 'היה רמז קטן אחד בהודעה: ציור של מפתח.',
        answer: 'clue',
        wrong: ['security', 'alarm'],
      },
      {
        clozeEn: 'The magician refused to ____ the secret of his best trick.',
        clozeHe: 'הקוסם סירב לחשוף את הסוד של הקסם הכי טוב שלו.',
        answer: 'reveal',
        wrong: ['footprint', 'witness'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "When I opened the fridge, someone ____ my yogurt."',
        correct: 'had eaten',
        wrong: ['has eaten', 'had eat'],
        explainHe: 'מישהו אכל את היוגורט לפני שפתחתי את המקרר, ולכן Past Perfect: had + V3 (eaten).',
        hintHe: 'האכילה קרתה לפני הפתיחה, וכל הסיפור בעבר. בדקו את פועל העזר ואת צורת הפועל.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'After she had finished her homework, she went to the park.',
        wrong: [
          'After she had finish her homework, she went to the park.',
          'After she has finished her homework, she went to the park.',
        ],
        explainHe: 'had + V3 (finished) לפעולה הראשונה, ו-Past Simple (went) לפעולה שבאה אחריה.',
        hintHe: 'בדקו את צורת הפועל אחרי פועל העזר, ואם פועל העזר מתאים לסיפור שכולו בעבר.',
      },
      {
        questionEn: 'Complete the question: "____ you visited Jerusalem before the school trip?"',
        correct: 'Had',
        wrong: ['Did', 'Were'],
        explainHe: 'שאלה ב-Past Perfect פותחת ב-had, ואחרי הנושא בא V3 (visited).',
        hintHe: 'אחרי הנושא בא V3 (visited), והשאלה היא על זמן שלפני הטיול בעבר. איזה פועל עזר בא עם V3 בעבר?',
      },
      {
        questionEn: 'Complete the sentence: "By the time the firefighters arrived, the fire ____."',
        correct: 'had already gone out',
        wrong: ['has already gone out', 'already goes out'],
        explainHe: 'האש כבתה לפני שהכבאים הגיעו, ולכן had + V3: had already gone out.',
        hintHe: 'מה קרה קודם: הגעת הכבאים או כיבוי האש? הפעולה המוקדמת מקבלת את פועל העזר של העבר שלפני העבר.',
      },
      {
        questionEn: 'Choose the correct negative sentence:',
        correct: 'I hadn’t seen the sea before I moved to Haifa.',
        wrong: ['I didn’t seen the sea before I moved to Haifa.', 'I hadn’t see the sea before I moved to Haifa.'],
        explainHe: 'שלילה ב-Past Perfect: hadn’t ואחריו V3 (seen).',
        hintHe: 'בדקו שני דברים: איזה פועל עזר מתאים לעבר שלפני העבר, ואיזו צורת פועל באה אחריו.',
      },
      {
        questionEn: 'Complete the sentence: "The detective ____ the suspect twice before he found new evidence."',
        correct: 'had questioned',
        wrong: ['has questioned', 'had question'],
        explainHe: 'החקירה קרתה לפני שהבלש מצא ראיות חדשות, ולכן had + V3: had questioned.',
        hintHe: 'הפעולה הזאת קרתה לפני שהבלש מצא ראיות חדשות. בדקו את פועל העזר ואת צורת הפועל.',
      },
    ],
    sentences: [
      { en: 'The bakery had sold all its bread by noon.', he: 'המאפייה מכרה את כל הלחם שלה עד הצהריים.' },
      { en: 'Nobody had noticed the open gate until morning.', he: 'אף אחד לא שם לב לשער הפתוח עד הבוקר.' },
      { en: 'Had you finished the book before the movie came out?', he: 'סיימתם את הספר לפני שהסרט יצא?' },
      { en: 'The witness remembered a blue car near the bank.', he: 'עד הראייה זכר מכונית כחולה ליד הבנק.' },
      { en: 'After the alarm had stopped, everyone went back inside.', he: 'אחרי שהאזעקה הפסיקה, כולם חזרו פנימה.' },
      { en: 'The thief had left a muddy glove behind.', he: 'הגנב השאיר מאחוריו כפפה בוצית.' },
    ],
    passages: [
      {
        passageEn:
          'Last spring, a rare bird disappeared from the Jerusalem zoo. The keepers had checked its cage at six in the evening, and everything had looked normal. The next morning, the cage was empty, but the lock was not broken. A young volunteer investigated the area and found white feathers near an open window. In the end, the bird had simply flown to a tall tree in the garden.',
        passageHe:
          'באביב שעבר, ציפור נדירה נעלמה מגן החיות בירושלים. השומרים בדקו את הכלוב שלה בשש בערב, והכול נראה רגיל. למחרת בבוקר הכלוב היה ריק, אבל המנעול לא היה שבור. מתנדב צעיר חקר את האזור ומצא נוצות לבנות ליד חלון פתוח. בסוף התברר שהציפור פשוט עפה לעץ גבוה בגן.',
        questions: [
          {
            questionEn: 'When had the keepers checked the cage?',
            questionHe: 'מתי השומרים בדקו את הכלוב?',
            correct: 'At six in the evening.',
            wrong: ['At midnight.', 'Early the next morning.'],
          },
          {
            questionEn: 'What did the volunteer find near an open window?',
            questionHe: 'מה מצא המתנדב ליד חלון פתוח?',
            correct: 'White feathers.',
            wrong: ['A broken lock.', 'A muddy footprint.'],
          },
          {
            questionEn: 'Where had the bird gone?',
            questionHe: 'לאן הלכה הציפור?',
            correct: 'To a tall tree in the garden.',
            wrong: ['To another zoo.', 'To a pet shop in town.'],
          },
        ],
      },
      {
        passageEn:
          'Ido came home from school and found the kitchen in a mess. Someone had opened a bag of flour, and there were small white footprints on the floor. His parents had gone to work early, and his sister had stayed at a friend’s house. Ido followed the footprints to the living room. There, he found the family puppy, covered in flour and fast asleep.',
        passageHe:
          'עידו חזר הביתה מבית הספר ומצא את המטבח בבלגן. מישהו פתח שקית קמח, והיו טביעות רגליים לבנות קטנות על הרצפה. ההורים שלו יצאו מוקדם לעבודה, ואחותו נשארה אצל חברה. עידו הלך בעקבות טביעות הרגליים עד הסלון. שם הוא מצא את הגור של המשפחה, מכוסה בקמח וישן עמוק.',
        questions: [
          {
            questionEn: 'What had someone opened in the kitchen?',
            questionHe: 'מה מישהו פתח במטבח?',
            correct: 'A bag of flour.',
            wrong: ['A box of eggs.', 'A bottle of milk.'],
          },
          {
            questionEn: 'Where had his sister stayed?',
            questionHe: 'איפה אחותו נשארה?',
            correct: 'At a friend’s house.',
            wrong: ['At her grandmother’s house.', 'At school.'],
          },
          {
            questionEn: 'Who had made the mess?',
            questionHe: 'מי עשה את הבלגן?',
            correct: 'The family puppy.',
            wrong: ['Ido’s sister.', 'A neighbour’s cat.'],
          },
        ],
      },
    ],
  },
  // Season 2, unit B: reported statements (said / told, backshift)
  22: {
    vocabulary: [
      {
        clozeEn: 'The head teacher will ____ the winners of the contest at the end of the year.',
        clozeHe: 'המנהלת תכריז על הזוכים בתחרות בסוף השנה.',
        answer: 'announce',
        wrong: ['interpret', 'complain'],
      },
      {
        clozeEn: 'Please ____ to my email as soon as you can.',
        clozeHe: 'בבקשה תשיבו למייל שלי ברגע שתוכלו.',
        answer: 'reply',
        wrong: ['admit', 'quote'],
      },
      {
        clozeEn: 'It is not easy to ____ that you made a mistake.',
        clozeHe: 'לא קל להודות שעשיתם טעות.',
        answer: 'admit',
        wrong: ['summary', 'expedition'],
      },
      {
        clozeEn: 'The ____ climbed the mountain for six days.',
        clozeHe: 'המשלחת טיפסה על ההר במשך שישה ימים.',
        answer: 'expedition',
        wrong: ['summary', 'quote'],
      },
      {
        clozeEn: 'Check the dates in your essay, because they must be ____.',
        clozeHe: 'בדקו את התאריכים בחיבור שלכם, כי הם חייבים להיות מדויקים.',
        answer: 'accurate',
        wrong: ['promise', 'mention'],
      },
      {
        clozeEn: 'Our neighbours often ____ about the noise from the park.',
        clozeHe: 'השכנים שלנו מתלוננים לעיתים קרובות על הרעש מהפארק.',
        answer: 'complain',
        wrong: ['interpret', 'announce'],
      },
    ],
    grammar: [
      {
        questionEn: 'Report the sentence: Tom said, "I am late."',
        correct: 'Tom said that he was late.',
        wrong: ['Tom said that he is late.', 'Tom said that I was late.'],
        explainHe: 'בדיבור עקיף am זז אחורה ל-was, ו-I הופך ל-he כי מוסרים את הדברים של Tom.',
        hintHe: 'בדקו שני דברים: האם הזמן זז אחורה, ומי הגוף הנכון כשמוסרים את הדברים של מישהו אחר.',
      },
      {
        questionEn: 'Complete the sentence: "Rina ____ me that the museum was closed."',
        correct: 'told',
        wrong: ['said', 'spoke'],
        explainHe: 'אחרי החסר בא me, ולכן told: הפועל tell צריך מישהו ששומע.',
        hintHe: 'שימו לב למילה שבאה מיד אחרי החסר. איזה פועל בא עם מישהו ששומע?',
      },
      {
        questionEn: 'Report the sentence: Ella said, "We will win the game."',
        correct: 'Ella said that they would win the game.',
        wrong: ['Ella said that they will won the game.', 'Ella said that they would won the game.'],
        explainHe: 'בדיבור עקיף will הופך ל-would, ואחרי would בא פועל בסיס (win).',
        hintHe: 'בדקו למה הופך will בדיבור עקיף, ואיזו צורת פועל באה אחריו.',
      },
      {
        questionEn: 'Report the sentence: My brother said, "I have broken my phone."',
        correct: 'My brother said that he had broken his phone.',
        wrong: ['My brother said that he has broke his phone.', 'My brother said that he had broke my phone.'],
        explainHe: 'have broken הופך ל-had broken, ו-my הופך ל-his כי מוסרים את הדברים של האח.',
        hintHe: 'Present Perfect זז צעד אחורה בדיבור עקיף. בדקו גם את צורת V3 ואת מילת השייכות.',
      },
      {
        questionEn: 'Choose the correct sentence:',
        correct: 'The guide told the group that the path was dangerous.',
        wrong: ['The guide said the group that the path was dangerous.', 'The guide told that the path is dangerous.'],
        explainHe: 'told בא עם מישהו ששומע (told the group), ובדיבור עקיף הזמן זז אחורה: was.',
        hintHe: 'בדקו איזה פועל מוסר בא עם מישהו ששומע אחריו, והאם הזמן זז אחורה.',
      },
      {
        questionEn: 'Report the sentence: Avi said, "I can swim."',
        correct: 'Avi said that he could swim.',
        wrong: ['Avi said that he can swam.', 'Avi said that he could swam.'],
        explainHe: 'בדיבור עקיף can הופך ל-could, ואחריו בא פועל בסיס (swim).',
        hintHe: 'בדיבור עקיף can זז צעד אחורה. מה בא אחריו: פועל בסיס או פועל בעבר?',
      },
    ],
    sentences: [
      { en: 'She said that the water was too cold.', he: 'היא אמרה שהמים קרים מדי.' },
      { en: 'My teacher told me that my essay was excellent.', he: 'המורה שלי אמר לי שהחיבור שלי מצוין.' },
      { en: 'They said that they would call us tonight.', he: 'הם אמרו שהם יתקשרו אלינו הערב.' },
      { en: 'Dana told her parents that she had found a job.', he: 'דנה אמרה להורים שלה שהיא מצאה עבודה.' },
      { en: 'The reporter quoted the coach in her article.', he: 'הכתבת ציטטה את המאמן בכתבה שלה.' },
      { en: 'He admitted that he had forgotten the tickets.', he: 'הוא הודה ששכח את הכרטיסים.' },
    ],
    passages: [
      {
        passageEn:
          'In July, a group of students from Be’er Sheva joined a desert expedition in the Negev. Every night, they wrote messages to their families. Gal wrote that the stars were brighter than in the city. Her friend Omer said that he missed his own bed. On the last day, their guide told them that they had walked more than eighty kilometres.',
        passageHe:
          'ביולי, קבוצת תלמידים מבאר שבע הצטרפה למשלחת מדבר בנגב. בכל לילה הם כתבו הודעות למשפחות שלהם. גל כתבה שהכוכבים בהירים יותר מאשר בעיר. החבר שלה עומר אמר שהוא מתגעגע למיטה שלו. ביום האחרון, המדריך אמר להם שהם הלכו יותר משמונים קילומטרים.',
        questions: [
          {
            questionEn: 'What did Gal write about the stars?',
            questionHe: 'מה גל כתבה על הכוכבים?',
            correct: 'They were brighter than in the city.',
            wrong: ['They were hidden by clouds.', 'They were hard to see.'],
          },
          {
            questionEn: 'What did Omer say he missed?',
            questionHe: 'למה עומר אמר שהוא מתגעגע?',
            correct: 'His own bed.',
            wrong: ['His mother’s cooking.', 'His phone.'],
          },
          {
            questionEn: 'How far had they walked?',
            questionHe: 'כמה הם הלכו?',
            correct: 'More than eighty kilometres.',
            wrong: ['About twenty kilometres.', 'More than two hundred kilometres.'],
          },
        ],
      },
      {
        passageEn:
          'Last week, our class met a famous chef for the school newspaper. She said that she had started cooking at the age of nine. She told us that her first dish was a burnt omelette. She also said that every good cook made mistakes. At the end, she promised that she would visit our school kitchen in the spring.',
        passageHe:
          'בשבוע שעבר הכיתה שלנו פגשה שפית מפורסמת בשביל עיתון בית הספר. היא אמרה שהתחילה לבשל בגיל תשע. היא סיפרה לנו שהמנה הראשונה שלה הייתה חביתה שרופה. היא גם אמרה שכל טבח טוב עושה טעויות. בסוף היא הבטיחה שתבקר במטבח של בית הספר שלנו באביב.',
        questions: [
          {
            questionEn: 'When had the chef started cooking?',
            questionHe: 'מתי השפית התחילה לבשל?',
            correct: 'At the age of nine.',
            wrong: ['At the age of twenty.', 'After she finished university.'],
          },
          {
            questionEn: 'What was her first dish?',
            questionHe: 'מה הייתה המנה הראשונה שלה?',
            correct: 'A burnt omelette.',
            wrong: ['A chocolate cake.', 'A vegetable soup.'],
          },
          {
            questionEn: 'What did the chef promise?',
            questionHe: 'מה השפית הבטיחה?',
            correct: 'She would visit the school kitchen in the spring.',
            wrong: ['She would send the class a recipe book.', 'She would open a restaurant near the school.'],
          },
        ],
      },
    ],
  },
};
