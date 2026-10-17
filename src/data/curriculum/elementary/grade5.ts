import { buildElementaryGrade } from './builder';

/**
 * Grade 5 — Band I Foundation core: pets & animals (be, have/has), town places, telling time,
 * daily routines with Present Simple (he/she/it + s) and frequency words.
 * 4 units × 3 missions (the 3rd mission of each unit is a Boss review).
 * Hebrew copy is gender-neutral (uses slash forms such as "אוכל/ת").
 */
export const grade5Curriculum = buildElementaryGrade('grade-5', [
  {
    titleEn: 'Unit 1: Cozy Pet Café & Animals',
    titleHe: 'פרק 1: בית הקפה לחיות מחמד וחברים',
    subtitleHe: 'אוצר מילים Band I, פועל Be (Am / Is / Are) ותיאור חיות',
    badgeEmoji: '🐱',
    missions: [
      {
        icon: '🐾',
        titleEn: 'Meet Mochi the Cat',
        titleHe: 'הכירו את מוצ׳י החתול',
        storyHookHe: 'בואו נלמד לתאר חיות מחמד מתוקות ולהגיד משפטים שלמים באנגלית בעזרת פועל To Be!',
        grammarTopic: 'Verb To Be (Am / Is / Are) & Adjectives',
        skills: ['Band I Vocab', 'Am / Is / Are', 'Voice Reading'],
        sentenceEn: 'My cute cat is very friendly and loves warm milk.',
        sentenceHe: 'החתול החמוד שלי ידידותי מאוד ואוהב חלב חם.',
        vocab: [
          ['fluffy', 'adjective', 'פרוותי / נעים למגע', '🐑', 'The rabbit has fluffy white fur.', 'לארנב יש פרווה לבנה ופרוותית.'],
          ['friendly', 'adjective', 'ידידותי / נחמד', '🤗', 'The puppy is very friendly.', 'הגור ידידותי מאוד.'],
          ['favorite', 'adjective', 'אהוב / מועדף', '⭐', 'Purple is my favorite color.', 'סגול הוא הצבע האהוב עליי.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'hungry', translationHe: 'רעב' },
            { wordEn: 'cold', translationHe: 'קר' },
          ],
          shortSentenceEn: 'Mochi is very fluffy.',
          shortSentenceHe: 'מוצ׳י פרוותי מאוד.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'My cat is friendly.',
            wrong: ['My cat are friendly.', 'My cat am friendly.'],
            explainHe: 'עם שם עצם ביחיד (my cat) משתמשים ב-is. את am אומרים רק עם I, ואת are עם you / we / they ועם רבים.',
            hintHe: 'my cat הוא חתול אחד (יחיד). איזו צורה של be מתאימה ליחיד שהוא לא I?',
          },
          story: {
            passageEn:
              'Mochi is a white cat. He is very fluffy and friendly. His favorite drink is warm milk. He is happy at the café.',
            passageHe: 'מוצ׳י הוא חתול לבן. הוא פרוותי וידידותי מאוד. המשקה האהוב עליו הוא חלב חם. הוא שמח בבית הקפה.',
            questionEn: 'What is the favorite drink of Mochi?',
            questionHe: 'מהו המשקה האהוב על מוצ׳י?',
            correct: 'warm milk',
            wrong: ['orange juice', 'cold water'],
          },
        },
      },
      {
        icon: '🐰',
        titleEn: 'Pets Have Fur and Tails',
        titleHe: 'לחיות המחמד יש פרווה וזנב',
        storyHookHe: 'בבית הקפה גרים ארנב, תוכי ואוגר! בואו נספר מה יש לכל אחד מהם בעזרת have ו-has.',
        grammarTopic: 'Have / Has & Animals',
        skills: ['Pets', 'Have / Has', 'Describing Animals'],
        sentenceEn: 'My rabbit has long ears and a short tail.',
        sentenceHe: 'לארנב שלי יש אוזניים ארוכות וזנב קצר.',
        vocab: [
          ['rabbit', 'noun', 'ארנב', '🐰', 'The rabbit eats a carrot.', 'הארנב אוכל גזר.'],
          ['parrot', 'noun', 'תוכי', '🦜', 'The parrot can say hello.', 'התוכי יודע להגיד שלום.'],
          ['hamster', 'noun', 'אוגר', '🐹', 'The hamster runs in its wheel.', 'האוגר רץ בגלגל שלו.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'horse', translationHe: 'סוס' },
            { wordEn: 'fish', translationHe: 'דג' },
          ],
          shortSentenceEn: 'My rabbit has long ears.',
          shortSentenceHe: 'לארנב שלי יש אוזניים ארוכות.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'The parrot has green wings.',
            wrong: ['The parrot have green wings.', 'The parrot haves green wings.'],
            explainHe: 'עם he / she / it ועם שם עצם ביחיד משתמשים ב-has. עם I / you / we / they משתמשים ב-have. אין צורה בשם haves.',
            hintHe: 'the parrot הוא it, כלומר יחיד. עם he / she / it הפועל have משנה את צורתו (וזו לא haves).',
          },
          story: {
            passageEn:
              'Dana has a parrot. The parrot has green wings. Her brother has a hamster. The hamster has a small house.',
            passageHe: 'לדנה יש תוכי. לתוכי יש כנפיים ירוקות. לאחיה יש אוגר. לאוגר יש בית קטן.',
            questionEn: 'What does Dana have?',
            questionHe: 'מה יש לדנה?',
            correct: 'a parrot',
            wrong: ['a hamster', 'a rabbit'],
          },
        },
      },
      {
        icon: '🐶',
        isBoss: true,
        titleEn: 'Boss: Pet Café Challenge',
        titleHe: 'אתגר הבוס: בית הקפה לחיות מחמד',
        storyHookHe: 'בית הקפה מלא בגורים וגורי חתולים! הראו שאתם יודעים לתאר חיות עם is, are, have ו-has.',
        grammarTopic: 'Review: Be & Have / Has',
        skills: ['Review', 'Be & Have / Has', 'Reading'],
        sentenceEn: 'The puppy is playful and the kitten has soft fur.',
        sentenceHe: 'הגור שובב ולגור החתולים יש פרווה רכה.',
        vocab: [
          ['puppy', 'noun', 'גור כלבים', '🐶', 'The puppy plays with a ball.', 'גור הכלבים משחק עם כדור.'],
          ['kitten', 'noun', 'גור חתולים', '🐱', 'The kitten drinks a little milk.', 'גור החתולים שותה מעט חלב.'],
          ['goldfish', 'noun', 'דג זהב', '🐠', 'The goldfish swims in a bowl.', 'דג הזהב שוחה בקערה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'elephant', translationHe: 'פיל' },
            { wordEn: 'monkey', translationHe: 'קוף' },
          ],
          shortSentenceEn: 'The puppy is playful.',
          shortSentenceHe: 'הגור שובב.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'The kittens are small and they have soft fur.',
            wrong: [
              'The kittens is small and they has soft fur.',
              'The kittens are small and they has soft fur.',
            ],
            explainHe: 'kittens הוא רבים ולכן are. גם they הוא רבים ולכן have. הצורות is ו-has מתאימות רק ליחיד.',
            hintHe: 'כדאי לבדוק שני חלקים: kittens ו-they הם רבים, ולכן שני הפעלים צריכים צורת רבים.',
          },
          story: {
            passageEn:
              'Ron works at the pet café on Sunday. He has a puppy and two kittens. The puppy is playful and loud. The kittens are small and quiet. They sleep in a soft basket.',
            passageHe:
              'רון עובד בבית הקפה לחיות מחמד ביום ראשון. יש לו גור כלבים ושני גורי חתולים. גור הכלבים שובב ורועש. גורי החתולים קטנים ושקטים. הם ישנים בסל רך.',
            questionEn: 'Where do the kittens sleep?',
            questionHe: 'איפה ישנים גורי החתולים?',
            correct: 'in a soft basket',
            wrong: ['in a big bed', 'on the table'],
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 2: Town Explorers & Telling Time',
    titleHe: 'פרק 2: מטיילים בעיר וקוראים שעון',
    subtitleHe: "מקומות בעיר (library, park, bakery), מילות יחס ומילות זמן (at 4 o'clock)",
    badgeEmoji: '🏙️',
    missions: [
      {
        icon: '🗺️',
        titleEn: 'Meet Me at the Library',
        titleHe: 'נפגשים בספרייה בשעה ארבע',
        storyHookHe: 'יוצאים לסיבוב במרכז העיר! בואו נלמד לקבוע פגישה, לשאול איפה כל מקום נמצא ולספר מה השעה.',
        grammarTopic: 'Prepositions of Place (in, on, next to) & Telling Time',
        skills: ['Places in Town', 'Telling Time', 'Prepositions'],
        sentenceEn: 'The public library is next to the sunny park.',
        sentenceHe: 'הספרייה הציבורית נמצאת ליד הפארק השמשי.',
        vocab: [
          ['library', 'noun', 'ספרייה', '📚', 'We borrow adventure books from the library.', 'אנחנו משאילים ספרי הרפתקאות מהספרייה.'],
          ['next to', 'preposition', 'ליד / סמוך ל-', '👉', 'The bakery is next to the bookstore.', 'המאפייה נמצאת ליד חנות הספרים.'],
          ['arrive', 'verb', 'להגיע', '🚌', "The bus will arrive at five o'clock.", 'האוטובוס יגיע בחמש בדיוק.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'bakery', translationHe: 'מאפייה' },
            { wordEn: 'hospital', translationHe: 'בית חולים' },
          ],
          shortSentenceEn: 'We go to the library.',
          shortSentenceHe: 'אנחנו הולכים לספרייה.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'The bakery is next to the library.',
            wrong: ['The bakery is next the library.', 'The bakery is next at library.'],
            explainHe: 'הביטוי המלא הוא next to (ליד). חייבים לכתוב את המילה to ואחריה את שם המקום.',
            hintHe: 'ליד באנגלית זה ביטוי של שתי מילים: next ועוד מילה קטנה. איזו?',
          },
          story: {
            passageEn:
              "Noa and Dan meet at the library at four o'clock. The library is next to the park. Noa arrives first. Dan arrives at half past four.",
            passageHe:
              'נועה ודן נפגשים בספרייה בארבע בדיוק. הספרייה נמצאת ליד הפארק. נועה מגיעה ראשונה. דן מגיע בארבע וחצי.',
            questionEn: 'Where is the library?',
            questionHe: 'איפה נמצאת הספרייה?',
            correct: 'next to the park',
            wrong: ['next to the bakery', 'under the bridge'],
          },
        },
      },
      {
        icon: '⏰',
        titleEn: 'What Time Is It?',
        titleHe: 'מה השעה?',
        storyHookHe: 'השעון בכיכר העיר מתקתק! בואו נלמד להגיד שעה עגולה ושעה וחצי באנגלית.',
        grammarTopic: "Telling Time (o'clock & half past)",
        skills: ['Telling Time', "O'clock", 'Half Past'],
        sentenceEn: 'It is half past three, so we go home.',
        sentenceHe: 'השעה שלוש וחצי, אז אנחנו הולכים הביתה.',
        vocab: [
          ['clock', 'noun', 'שעון קיר', '🕒', 'The clock is on the wall.', 'שעון הקיר תלוי על הקיר.'],
          ["o'clock", 'adverb', 'שעה עגולה', '🕔', "It is five o'clock.", 'השעה חמש בדיוק.'],
          ['half past', 'phrase', 'וחצי', '🕞', 'It is half past three.', 'השעה שלוש וחצי.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'window', translationHe: 'חלון' },
            { wordEn: 'table', translationHe: 'שולחן' },
          ],
          shortSentenceEn: "It is four o'clock.",
          shortSentenceHe: 'השעה ארבע בדיוק.',
          rule: {
            questionEn: 'The clock shows 4:30. What time is it?',
            correct: 'It is half past four.',
            wrong: ['It is half past five.', "It is four o'clock."],
            explainHe: "half past אומר שעברו 30 דקות מהשעה העגולה. ארבע וחצי היא half past four. ארבע בדיוק היא four o'clock.",
            hintHe: 'half past פירושו חצי שעה אחרי. 4:30 זה חצי שעה אחרי איזו שעה עגולה?',
          },
          story: {
            passageEn:
              "The school clock is on the wall. School starts at eight o'clock. Lunch is at half past ten. School ends at one o'clock.",
            passageHe: 'שעון בית הספר תלוי על הקיר. בית הספר מתחיל בשמונה בדיוק. ארוחת הצהריים בעשר וחצי. בית הספר מסתיים באחת בדיוק.',
            questionEn: 'When is lunch?',
            questionHe: 'מתי ארוחת הצהריים?',
            correct: 'at half past ten',
            wrong: ["at eight o'clock", "at one o'clock"],
          },
        },
      },
      {
        icon: '🛒',
        isBoss: true,
        titleEn: 'Boss: Find the Supermarket',
        titleHe: 'אתגר הבוס: מוצאים את הסופרמרקט',
        storyHookHe: 'תייר אבוד מחפש את הסופרמרקט! עזרו לו עם שאלות Where והכוונות בעיר.',
        grammarTopic: 'Where Questions & Directions',
        skills: ['Directions', 'Where Questions', 'Review'],
        sentenceEn: 'Go straight and turn left at the supermarket.',
        sentenceHe: 'לכו ישר ופנו שמאלה ליד הסופרמרקט.',
        vocab: [
          ['supermarket', 'noun', 'סופרמרקט', '🛒', 'We buy fruit at the supermarket.', 'אנחנו קונים פירות בסופרמרקט.'],
          ['left', 'adverb', 'שמאלה', '⬅️', 'Turn left at the corner.', 'פנו שמאלה בפינה.'],
          ['straight', 'adverb', 'ישר', '⬆️', 'Go straight for two minutes.', 'לכו ישר במשך שתי דקות.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'museum', translationHe: 'מוזיאון' },
            { wordEn: 'school', translationHe: 'בית ספר' },
          ],
          shortSentenceEn: 'Turn left at the park.',
          shortSentenceHe: 'פנו שמאלה ליד הפארק.',
          rule: {
            questionEn: 'Which question is correct?',
            correct: 'Where is the supermarket?',
            wrong: ['Where the supermarket is?', 'Where is supermarket the?'],
            explainHe: 'בשאלות Wh סדר המילים הוא: מילת שאלה, פועל, ואז נושא. Where is the supermarket?',
            hintHe: 'בשאלת Wh הסדר הוא: מילת השאלה, הפועל, ואז הנושא עם the לפניו.',
          },
          story: {
            passageEn:
              'Tom is at the library. He asks where the supermarket is. A girl says, go straight and then turn left. The supermarket is next to the park. Tom arrives at half past five.',
            passageHe:
              'טום נמצא בספרייה. הוא שואל איפה הסופרמרקט. ילדה אומרת, לכו ישר ואז פנו שמאלה. הסופרמרקט נמצא ליד הפארק. טום מגיע בחמש וחצי.',
            questionEn: 'Where is the supermarket?',
            questionHe: 'איפה נמצא הסופרמרקט?',
            correct: 'next to the park',
            wrong: ['next to the library', 'under the clock'],
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 3: My Daily Routine',
    titleHe: 'פרק 3: סדר היום שלי',
    subtitleHe: 'Present Simple עם he / she / it (פועל + s), פעולות יומיות ושעות',
    badgeEmoji: '🌞',
    missions: [
      {
        icon: '🍳',
        titleEn: 'Wake Up and Eat Breakfast',
        titleHe: 'קמים ואוכלים ארוחת בוקר',
        storyHookHe: 'בוקר חדש מתחיל! בואו נספר מה עושים כל בוקר ונלמד להוסיף s אחרי he ו-she.',
        grammarTopic: 'Present Simple (he / she / it + verb-s)',
        skills: ['Morning Routine', 'Present Simple', 'Verb + s'],
        sentenceEn: 'I wake up at seven and eat breakfast.',
        sentenceHe: 'אני קם/ה בשבע ואוכל/ת ארוחת בוקר.',
        vocab: [
          ['breakfast', 'noun', 'ארוחת בוקר', '🍳', 'I eat bread and eggs for breakfast.', 'אני אוכל/ת לחם וביצים לארוחת בוקר.'],
          ['wake up', 'verb', 'להתעורר / לקום', '⏰', 'We wake up early on Monday.', 'אנחנו מתעוררים מוקדם ביום שני.'],
          ['brush', 'verb', 'לצחצח', '🪥', 'I brush my teeth every morning.', 'אני מצחצח/ת שיניים כל בוקר.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'homework', translationHe: 'שיעורי בית' },
            { wordEn: 'pillow', translationHe: 'כרית' },
          ],
          shortSentenceEn: 'I eat breakfast.',
          shortSentenceHe: 'אני אוכל/ת ארוחת בוקר.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'She wakes up at seven.',
            wrong: ['She wake up at seven.', 'She do wake up at seven.'],
            explainHe: 'ב-Present Simple עם he / she / it מוסיפים s לפועל: she wakes up. בלי s או עם do המשפט שגוי.',
            hintHe: 'she היא גוף שלישי יחיד. מה מוסיפים לפועל ב-Present Simple עם he / she / it?',
          },
          story: {
            passageEn:
              "Dana wakes up at seven o'clock. She brushes her teeth. Then she eats breakfast with her family. She eats bread and eggs.",
            passageHe: 'דנה מתעוררת בשבע בדיוק. היא מצחצחת שיניים. אחר כך היא אוכלת ארוחת בוקר עם המשפחה. היא אוכלת לחם וביצים.',
            questionEn: 'What time does Dana wake up?',
            questionHe: 'באיזו שעה דנה מתעוררת?',
            correct: "at seven o'clock",
            wrong: ["at eight o'clock", 'at half past six'],
          },
        },
      },
      {
        icon: '🏫',
        titleEn: 'Off to School',
        titleHe: 'יוצאים לבית הספר',
        storyHookHe: 'התיק מוכן וצריך לצאת! בואו נספר מה עושים בבית הספר ואחריו, עם goes ו-does.',
        grammarTopic: 'Present Simple: goes, does, has',
        skills: ['School Day', 'Goes / Does', 'Daily Actions'],
        sentenceEn: 'He goes to school and does his homework.',
        sentenceHe: 'הוא הולך לבית הספר ועושה שיעורי בית.',
        vocab: [
          ['school', 'noun', 'בית ספר', '🏫', 'My school has a big yard.', 'לבית הספר שלי יש חצר גדולה.'],
          ['homework', 'noun', 'שיעורי בית', '📝', 'I do my homework at home.', 'אני עושה/ה שיעורי בית בבית.'],
          ['lunch', 'noun', 'ארוחת צהריים', '🥪', 'We eat lunch at twelve.', 'אנחנו אוכלים ארוחת צהריים בשתים עשרה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'hospital', translationHe: 'בית חולים' },
            { wordEn: 'zoo', translationHe: 'גן חיות' },
          ],
          shortSentenceEn: 'He goes to school.',
          shortSentenceHe: 'הוא הולך לבית הספר.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'He goes to school every day.',
            wrong: ['He go to school every day.', 'He gos to school every day.'],
            explainHe: 'לפועל go מוסיפים es עם he / she / it: goes. כך גם do הופך ל-does.',
            hintHe: 'עם he הפועל go מקבל סיומת, אבל לא רק s. בדיוק כמו do שהופך ל-does.',
          },
          story: {
            passageEn:
              "Amir goes to school at eight. He has lunch at twelve o'clock. After school, he does his homework. Then he plays with his dog.",
            passageHe: 'אמיר הולך לבית הספר בשמונה. הוא אוכל ארוחת צהריים בשתים עשרה בדיוק. אחרי בית הספר הוא עושה שיעורי בית. אחר כך הוא משחק עם הכלב שלו.',
            questionEn: 'When does Amir have lunch?',
            questionHe: 'מתי אמיר אוכל ארוחת צהריים?',
            correct: "at twelve o'clock",
            wrong: ["at eight o'clock", "at five o'clock"],
          },
        },
      },
      {
        icon: '🛏️',
        isBoss: true,
        titleEn: 'Boss: A Busy Day',
        titleHe: 'אתגר הבוס: יום עמוס',
        storyHookHe: 'ליאור עושה המון דברים ביום אחד! עקבו אחרי סדר היום ועזרו לו לענות על השאלות.',
        grammarTopic: 'Present Simple Review: do / does',
        skills: ['Review', 'Do / Does Questions', 'Reading'],
        sentenceEn: 'She eats dinner at six and goes to bed.',
        sentenceHe: 'היא אוכלת ארוחת ערב בשש והולכת לישון.',
        vocab: [
          ['bed', 'noun', 'מיטה', '🛏️', 'My bed is soft and warm.', 'המיטה שלי רכה וחמה.'],
          ['dinner', 'noun', 'ארוחת ערב', '🍽️', 'We eat dinner together.', 'אנחנו אוכלים ארוחת ערב יחד.'],
          ['sleep', 'verb', 'לישון', '😴', 'The baby sleeps at night.', 'התינוק ישן בלילה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'chair', translationHe: 'כיסא' },
            { wordEn: 'door', translationHe: 'דלת' },
          ],
          shortSentenceEn: 'She goes to bed.',
          shortSentenceHe: 'היא הולכת לישון.',
          rule: {
            questionEn: 'Which question is correct?',
            correct: 'What time does he go to bed?',
            wrong: ['What time do he go to bed?', 'What time does he goes to bed?'],
            explainHe: 'בשאלה עם he / she / it משתמשים ב-does, ואז הפועל חוזר לצורה הרגילה בלי s: does he go.',
            hintHe: 'עם he שואלים עם פועל עזר מיוחד ליחיד, ואחריו הפועל חוזר לצורה הבסיסית.',
          },
          story: {
            passageEn:
              "Lior has a busy day. He wakes up at seven and eats breakfast. He goes to school at eight. He does his homework after lunch. At six o'clock his family eats dinner together. Lior goes to bed at nine o'clock.",
            passageHe:
              'לליאור יש יום עמוס. הוא מתעורר בשבע ואוכל ארוחת בוקר. הוא הולך לבית הספר בשמונה. הוא עושה שיעורי בית אחרי ארוחת הצהריים. בשש בדיוק המשפחה אוכלת ארוחת ערב יחד. ליאור הולך לישון בתשע בדיוק.',
            questionEn: 'What time does Lior go to bed?',
            questionHe: 'באיזו שעה ליאור הולך לישון?',
            correct: "at nine o'clock",
            wrong: ["at six o'clock", "at seven o'clock"],
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 4: Free Time & Weekends',
    titleHe: 'פרק 4: זמן פנאי וסוף שבוע',
    subtitleHe: 'תחביבים, מילות תדירות (always, usually, never) ושאלות Wh',
    badgeEmoji: '🎸',
    missions: [
      {
        icon: '🎸',
        titleEn: 'My Favorite Hobbies',
        titleHe: 'התחביבים האהובים עליי',
        storyHookHe: 'מה עושים בזמן הפנאי? בואו נכיר תחביבים כמו נגינה, שחייה וציור ונספר עליהם.',
        grammarTopic: 'Hobbies & Present Simple',
        skills: ['Hobbies', 'Present Simple', 'Speaking'],
        sentenceEn: 'I play the guitar and I like to swim.',
        sentenceHe: 'אני מנגן/ת בגיטרה ואוהב/ת לשחות.',
        vocab: [
          ['guitar', 'noun', 'גיטרה', '🎸', 'My brother plays the guitar.', 'אח שלי מנגן בגיטרה.'],
          ['swim', 'verb', 'לשחות', '🏊', 'We swim in the sea.', 'אנחנו שוחים בים.'],
          ['draw', 'verb', 'לצייר', '🎨', 'I draw animals in my notebook.', 'אני מצייר/ת חיות במחברת.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'bicycle', translationHe: 'אופניים' },
            { wordEn: 'umbrella', translationHe: 'מטרייה' },
          ],
          shortSentenceEn: 'I play the guitar.',
          shortSentenceHe: 'אני מנגן/ת בגיטרה.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'She plays the guitar on Fridays.',
            wrong: ['She play the guitar on Fridays.', 'She plays guitar the on Fridays.'],
            explainHe: 'עם she מוסיפים s לפועל: plays. וחשוב לשמור על סדר המילים: the guitar.',
            hintHe: 'עם she הפועל מקבל סיומת. וגם כדאי לבדוק איפה עומדת המילה the.',
          },
          story: {
            passageEn:
              'Maya likes hobbies. She plays the guitar on Monday. She draws pictures on Tuesday. On Friday she swims with her friends.',
            passageHe: 'מאיה אוהבת תחביבים. היא מנגנת בגיטרה ביום שני. היא מציירת תמונות ביום שלישי. ביום שישי היא שוחה עם החברים.',
            questionEn: 'What does Maya do on Friday?',
            questionHe: 'מה מאיה עושה ביום שישי?',
            correct: 'She swims with her friends.',
            wrong: ['She plays the guitar.', 'She draws pictures.'],
          },
        },
      },
      {
        icon: '🎉',
        titleEn: 'Always, Usually, Never',
        titleHe: 'תמיד, בדרך כלל, אף פעם',
        storyHookHe: 'כמה פעמים עושים כל דבר? בואו נלמד מילות תדירות ונספר מה עושים בסוף השבוע.',
        grammarTopic: 'Frequency Words (always, usually, never)',
        skills: ['Frequency Words', 'Weekend', 'Word Order'],
        sentenceEn: 'I always play football on the weekend.',
        sentenceHe: 'אני תמיד משחק/ת כדורגל בסוף השבוע.',
        vocab: [
          ['weekend', 'noun', 'סוף שבוע', '🎉', 'We visit grandma on the weekend.', 'אנחנו מבקרים את סבתא בסוף השבוע.'],
          ['always', 'adverb', 'תמיד', '✅', 'She always smiles at school.', 'היא תמיד מחייכת בבית הספר.'],
          ['usually', 'adverb', 'בדרך כלל', '🔄', 'We usually eat lunch at one.', 'אנחנו בדרך כלל אוכלים צהריים באחת.'],
          ['never', 'adverb', 'אף פעם', '❌', 'He never eats fish.', 'הוא אף פעם לא אוכל דג.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'morning', translationHe: 'בוקר' },
            { wordEn: 'birthday', translationHe: 'יום הולדת' },
          ],
          shortSentenceEn: 'I never eat fish.',
          shortSentenceHe: 'אני אף פעם לא אוכל/ת דג.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'He always eats breakfast.',
            wrong: ['He always eat breakfast.', 'He eats always breakfast.'],
            explainHe: 'מילת תדירות באה לפני הפועל הרגיל, ועם he עדיין מוסיפים s לפועל: He always eats.',
            hintHe: 'מילת תדירות (always) באה לפני הפועל הראשי, ועם he הפועל עדיין מקבל סיומת.',
          },
          story: {
            passageEn:
              'Yoav always wakes up early on school days. On the weekend he usually sleeps until nine. He never watches TV in the morning. He always plays football with his friends in the afternoon.',
            passageHe:
              'יואב תמיד מתעורר מוקדם בימי לימודים. בסוף השבוע הוא בדרך כלל ישן עד תשע. הוא אף פעם לא רואה טלוויזיה בבוקר. הוא תמיד משחק כדורגל עם החברים אחר הצהריים.',
            questionEn: 'What does Yoav never do in the morning?',
            questionHe: 'מה יואב אף פעם לא עושה בבוקר?',
            correct: 'watch TV',
            wrong: ['play football', 'sleep until nine'],
          },
        },
      },
      {
        icon: '🎬',
        isBoss: true,
        titleEn: 'Boss: Movie Night Questions',
        titleHe: 'אתגר הבוס: שאלות על ערב סרט',
        storyHookHe: 'ערב סרט בקולנוע! ענו על שאלות Wh ועל מילות התדירות וגלו מה כל אחד עושה בקולנוע.',
        grammarTopic: 'Wh-Questions & Frequency Words Review',
        skills: ['Review', 'Wh-Questions', 'Frequency Words'],
        sentenceEn: 'We usually go to the cinema on Saturday.',
        sentenceHe: 'אנחנו בדרך כלל הולכים לקולנוע ביום שבת.',
        vocab: [
          ['cinema', 'noun', 'קולנוע', '🎬', 'The cinema is open on Saturday.', 'הקולנוע פתוח ביום שבת.'],
          ['ticket', 'noun', 'כרטיס', '🎟️', 'I have a ticket for the movie.', 'יש לי כרטיס לסרט.'],
          ['popcorn', 'noun', 'פופקורן', '🍿', 'We eat popcorn at the movies.', 'אנחנו אוכלים פופקורן בסרט.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'bank', translationHe: 'בנק' },
            { wordEn: 'farm', translationHe: 'חווה' },
          ],
          shortSentenceEn: 'We go to the cinema.',
          shortSentenceHe: 'אנחנו הולכים לקולנוע.',
          rule: {
            questionEn: 'Which question is correct?',
            correct: 'Where do you go on Saturday?',
            wrong: ['Where you go on Saturday?', 'Where does you go on Saturday?'],
            explainHe: 'בשאלת Wh ב-Present Simple מוסיפים do או does אחרי מילת השאלה. עם you משתמשים ב-do ולא ב-does.',
            hintHe: 'בשאלת Wh צריך פועל עזר אחרי מילת השאלה. עם you משתמשים בצורה בלי s.',
          },
          story: {
            passageEn:
              'Gal and her brother Ben go to the cinema on Saturday. They always buy two tickets. They usually eat popcorn. Ben never eats candy. Gal likes the funny movies.',
            passageHe:
              'גל ואחיה בן הולכים לקולנוע ביום שבת. הם תמיד קונים שני כרטיסים. הם בדרך כלל אוכלים פופקורן. בן אף פעם לא אוכל ממתקים. גל אוהבת סרטים מצחיקים.',
            questionEn: 'What do they usually eat?',
            questionHe: 'מה הם בדרך כלל אוכלים?',
            correct: 'popcorn',
            wrong: ['pizza', 'ice cream'],
          },
        },
      },
    ],
  },
]);
