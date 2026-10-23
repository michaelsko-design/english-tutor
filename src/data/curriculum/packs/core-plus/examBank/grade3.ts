import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-plus pack's grade 3 exam bank (Feature 43), by the unit number in its mission ids.
 * New questions only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_PLUS_GRADE_3_EXAM_BANK: ExamBankPack = {
  // Season 2, unit 1: jobs, He / She is a…, a / an
  21: {
    vocabulary: [
      {
        clozeEn: 'The ____ flies a big plane to London.',
        clozeHe: 'הטייסת מטיסה מטוס גדול ללונדון.',
        answer: 'pilot',
        wrong: ['baker', 'farmer'],
      },
      {
        clozeEn: 'The ____ grows tomatoes and has two horses.',
        clozeHe: 'החקלאי מגדל עגבניות ויש לו שני סוסים.',
        answer: 'farmer',
        wrong: ['singer', 'pilot'],
      },
      {
        clozeEn: 'Our ____ writes the new words on the board.',
        clozeHe: 'המורה שלנו כותבת את המילים החדשות על הלוח.',
        answer: 'teacher',
        wrong: ['vet', 'astronaut'],
      },
      {
        clozeEn: 'The ____ makes cakes and cookies every morning.',
        clozeHe: 'האופה מכין עוגות ועוגיות כל בוקר.',
        answer: 'baker',
        wrong: ['builder', 'doctor'],
      },
      {
        clozeEn: 'My dog is sick, so we go to the ____.',
        clozeHe: 'הכלב שלי חולה, אז אנחנו הולכים לווטרינר.',
        answer: 'vet',
        wrong: ['singer', 'cook'],
      },
      {
        clozeEn: 'The ____ sings on a big stage.',
        clozeHe: 'הזמרת שרה על במה גדולה.',
        answer: 'singer',
        wrong: ['firefighter', 'teacher'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'He is a baker.',
        wrong: ['He a baker.', 'He are a baker.'],
        explainHe: 'עם he (הוא) אומרים is, ואחריו a והמקצוע: He is a baker.',
        hintHe: 'איזו צורה של be הולכת עם הוא? וזכרו שבאנגלית אי אפשר לדלג עליה.',
      },
      {
        questionEn: 'Complete the sentence: "She is ____ astronaut."',
        correct: 'an',
        wrong: ['a', 'the a'],
        explainHe: 'astronaut מתחילה בצליל a, ולכן an.',
        hintHe: 'הקשיבו לצליל הראשון של המקצוע: האם הוא צליל של אות ניקוד (a, e, i, o, u)?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'My mom is a doctor.',
        wrong: ['My mom is doctor.', 'My mom are a doctor.'],
        explainHe: 'אמא היא she, ולכן is. ולפני מקצוע של אדם אחד שמים a.',
        hintHe: 'בדקו שתי מילים קטנות: הצורה של be שמתאימה לאמא, והמילה שבאה לפני המקצוע.',
      },
      {
        questionEn: 'Complete the sentence: "I am ____ artist."',
        correct: 'an',
        wrong: ['a', 'is'],
        explainHe: 'artist מתחילה בצליל a, ולכן אומרים an artist.',
        hintHe: 'באיזה צליל מתחיל המקצוע? לפני צליל של אות ניקוד משתנה המילה הקטנה.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'They are pilots.',
        wrong: ['They is pilots.', 'They are pilot.'],
        explainHe: 'עם they אומרים are, וכמה טייסים הם pilots עם s.',
        hintHe: 'כמה אנשים יש כאן? בדקו את צורת be ואת סוף המילה.',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Is she a vet?',
        wrong: ['She vet is?', 'Is she vet a?'],
        explainHe: 'בשאלה is בא בהתחלה, לפני she: Is she a vet?',
        hintHe: 'בשאלה של כן או לא, איזו מילה עוברת לתחילת המשפט? ואיפה בא a?',
      },
    ],
    sentences: [
      { en: 'My grandpa is a farmer.', he: 'סבא שלי חקלאי.' },
      { en: 'She is an artist in Tel Aviv.', he: 'היא אמנית בתל אביב.' },
      { en: 'The firefighter has a red truck.', he: 'לכבאי יש משאית אדומה.' },
      { en: 'Is he a cook or a baker?', he: 'האם הוא טבח או אופה?' },
      { en: 'The builder is tired today.', he: 'הבנאי עייף היום.' },
      { en: 'My cousin is an astronaut.', he: 'בת הדודה שלי אסטרונאוטית.' },
    ],
    passages: [
      {
        passageEn: 'This is Maya. She is a doctor. She works in a big hospital. Her brother Eli is a cook. He makes soup and rice.',
        passageHe: 'זאת מאיה. היא רופאה. היא עובדת בבית חולים גדול. אח שלה, אלי, הוא טבח. הוא מכין מרק ואורז.',
        questions: [
          {
            questionEn: 'What is Maya?',
            questionHe: 'מה המקצוע של מאיה?',
            correct: 'A doctor.',
            wrong: ['A cook.', 'A pilot.'],
          },
          {
            questionEn: 'Where does Maya work?',
            questionHe: 'איפה מאיה עובדת?',
            correct: 'In a big hospital.',
            wrong: ['In a school.', 'On a farm.'],
          },
          {
            questionEn: 'What does Eli make?',
            questionHe: 'מה אלי מכין?',
            correct: 'Soup and rice.',
            wrong: ['Cakes.', 'Bread and cheese.'],
          },
        ],
      },
      {
        passageEn: 'Ben has a funny family. His dad is a vet. His mom is a pilot. His big sister is a singer. Ben wants to be a builder.',
        passageHe: 'לבן יש משפחה מצחיקה. אבא שלו וטרינר. אמא שלו טייסת. אחותו הגדולה זמרת. בן רוצה להיות בנאי.',
        questions: [
          {
            questionEn: "What is Ben's mom?",
            questionHe: 'מה המקצוע של אמא של בן?',
            correct: 'A pilot.',
            wrong: ['A vet.', 'A singer.'],
          },
          {
            questionEn: 'Who is a singer?',
            questionHe: 'מי זמרת?',
            correct: 'His big sister.',
            wrong: ['His mom.', 'His dad.'],
          },
          {
            questionEn: 'What does Ben want to be?',
            questionHe: 'מה בן רוצה להיות?',
            correct: 'A builder.',
            wrong: ['A doctor.', 'A teacher.'],
          },
        ],
      },
    ],
  },
  // Season 2, unit 2: my day, I + verb
  22: {
    vocabulary: [
      {
        clozeEn: 'I eat eggs and bread for ____.',
        clozeHe: 'לארוחת בוקר אוכלים ביצים ולחם.',
        answer: 'breakfast',
        wrong: ['night', 'homework'],
      },
      {
        clozeEn: 'Mom reads me a story at ____.',
        clozeHe: 'אמא מקריאה לי סיפור בלילה.',
        answer: 'night',
        wrong: ['lunch', 'brush'],
      },
      {
        clozeEn: 'I ____ my hands before I eat.',
        clozeHe: 'שוטפים ידיים לפני האוכל.',
        answer: 'wash',
        wrong: ['sleep', 'dinner'],
      },
      {
        clozeEn: 'My math ____ is on page ten.',
        clozeHe: 'שיעורי הבית שלי בחשבון בעמוד עשר.',
        answer: 'homework',
        wrong: ['breakfast', 'play'],
      },
      {
        clozeEn: 'We ____ ball in the yard after school.',
        clozeHe: 'אחרי בית הספר משחקים בכדור בחצר.',
        answer: 'play',
        wrong: ['lunch', 'night'],
      },
      {
        clozeEn: 'We have pasta and salad for ____ at six.',
        clozeHe: 'בשש אוכלים פסטה וסלט לארוחת ערב.',
        answer: 'dinner',
        wrong: ['wash', 'brush'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I eat lunch at school.',
        wrong: ['I am eat lunch at school.', 'I eats lunch at school.'],
        explainHe: 'כשמספרים מה עושים כל יום, אחרי I בא הפועל כמו שהוא: I eat.',
        hintHe: 'אחרי אני בא הפועל בלי תוספת בסוף ובלי מילה נוספת לפניו.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I brush my teeth at night.',
        wrong: ['I my teeth brush at night.', 'I brushes my teeth at night.'],
        explainHe: 'הסדר הוא: I, אחר כך הפועל brush, ואז my teeth.',
        hintHe: 'קודם מי עושה, מיד אחריו הפועל בלי תוספת, ורק אחר כך מה.',
      },
      {
        questionEn: 'Complete the sentence: "I ____ up at seven."',
        correct: 'get',
        wrong: ['gets', 'am'],
        explainHe: 'אומרים I get up: הפועל get בלי s.',
        hintHe: 'עם אני הפועל נשאר בצורה הפשוטה ביותר שלו.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I go to bed at nine.',
        wrong: ['I am go to bed at nine.', 'I to bed go at nine.'],
        explainHe: 'אחרי I בא מיד הפועל go, בלי am.',
        hintHe: 'האם צריך מילה בין אני לפועל? ואיפה בא הפועל במשפט?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'I do my homework in my room.',
        wrong: ['I does my homework in my room.', 'I doing my homework in my room.'],
        explainHe: 'עם I אומרים do, כמו שהוא: I do my homework.',
        hintHe: 'עם אני הפועל לא מקבל שום סיומת.',
      },
      {
        questionEn: 'Which word is a meal?',
        correct: 'dinner',
        wrong: ['night', 'wash'],
        explainHe: 'dinner היא ארוחת ערב. night הוא לילה ו-wash הוא לשטוף.',
        hintHe: 'חפשו מילה של משהו שאוכלים בזמן מסוים ביום.',
      },
    ],
    sentences: [
      { en: 'I get up and I make my bed.', he: 'אני קם/ה ומסדר/ת את המיטה.' },
      { en: 'I wash my face with soap.', he: 'אני שוטף/ת את הפנים בסבון.' },
      { en: 'I eat rice and chicken for lunch.', he: 'אני אוכל/ת אורז ועוף לארוחת צהריים.' },
      { en: 'I go to my grandma on Friday.', he: 'ביום שישי אני הולך/ת לסבתא.' },
      { en: 'I play with my cat after dinner.', he: 'אחרי ארוחת הערב אני משחק/ת עם החתול שלי.' },
      { en: 'I sleep with my teddy bear.', he: 'אני ישן/ה עם הדובי שלי.' },
    ],
    passages: [
      {
        passageEn: 'Hi, I am Tom. I get up at six. I eat cereal for breakfast. I go to school by bike. At school, I play with my friends.',
        passageHe: 'היי, אני תום. אני קם בשש. אני אוכל דגני בוקר לארוחת בוקר. אני רוכב לבית הספר באופניים. בבית הספר אני משחק עם החברים שלי.',
        questions: [
          {
            questionEn: 'When does Tom get up?',
            questionHe: 'מתי תום קם?',
            correct: 'At six.',
            wrong: ['At nine.', 'At one.'],
          },
          {
            questionEn: 'What does Tom eat for breakfast?',
            questionHe: 'מה תום אוכל לארוחת בוקר?',
            correct: 'Cereal.',
            wrong: ['Pizza.', 'Soup.'],
          },
          {
            questionEn: 'How does Tom go to school?',
            questionHe: 'איך תום מגיע לבית הספר?',
            correct: 'By bike.',
            wrong: ['By bus.', 'By car.'],
          },
        ],
      },
      {
        passageEn: 'It is evening. I eat dinner with my dad. Then I take a bath. I read a book in bed. At night, I sleep with my little dog.',
        passageHe: 'ערב. אני אוכל/ת ארוחת ערב עם אבא. אחר כך אני מתרחץ/ת באמבטיה. אני קורא/ת ספר במיטה. בלילה אני ישן/ה עם הכלב הקטן שלי.',
        questions: [
          {
            questionEn: 'Who do I eat dinner with?',
            questionHe: 'עם מי אני אוכל/ת ארוחת ערב?',
            correct: 'My dad.',
            wrong: ['My teacher.', 'My sister.'],
          },
          {
            questionEn: 'Where do I read a book?',
            questionHe: 'איפה אני קורא/ת ספר?',
            correct: 'In bed.',
            wrong: ['In the bath.', 'At school.'],
          },
          {
            questionEn: 'What do I sleep with?',
            questionHe: 'עם מה אני ישן/ה?',
            correct: 'My little dog.',
            wrong: ['My teddy bear.', 'My book.'],
          },
        ],
      },
    ],
  },
};
