import { buildElementaryGrade } from './builder';

/**
 * Grade 4 — Band I (Foundation) start: action verbs and can / can't, rooms and furniture with
 * There is / There are and prepositions of place, sports and hobbies, healthy food and What-questions.
 * 4 units × 3 missions (the 3rd mission of each unit is a Boss review).
 * Hebrew copy is gender-neutral (uses slash forms such as "אוכל/ת" and plural imperatives).
 */
export const grade4Curriculum = buildElementaryGrade('grade-4', [
  {
    titleEn: 'Unit 1: Superhero Action Academy',
    titleHe: 'פרק 1: אקדמיית גיבורי העל',
    subtitleHe: "פועלי פעולה (run, jump, swim, fly), כינויי גוף ויכולת עם Can ו-Can't",
    badgeEmoji: '🦸‍♂️',
    missions: [
      {
        icon: '⚡',
        titleEn: 'Super Powers: What Can You Do?',
        titleHe: 'כוחות על: מה אתם יכולים לעשות?',
        storyHookHe:
          "התקבלתם לאקדמיית גיבורי העל! בואו נלמד לספר על היכולות המיוחדות שלכם באנגלית בעזרת Can ו-Can't.",
        grammarTopic: "Modal Verb \"Can / Can't\" & Action Verbs",
        skills: ['Action Verbs', "Can / Can't", 'Voice Power Drill'],
        sentenceEn: 'Super heroes can fly fast and help people every day.',
        sentenceHe: 'גיבורי על יכולים לעוף מהר ולעזור לאנשים כל יום.',
        vocab: [
          ['swim', 'verb', 'לשחות', '🏊', 'Dolphins can swim very quickly.', 'דולפינים יכולים לשחות מהר מאוד.'],
          ['jump', 'verb', 'לקפוץ', '🦘', 'She can jump over the obstacle easily.', 'היא יכולה לקפוץ מעל המכשול בקלות.'],
          [
            'protect',
            'verb',
            'להגן על / לשמור',
            '🛡️',
            'Superheroes protect the city from villains.',
            'גיבורי על מגנים על העיר מפני נבלים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'sleep', translationHe: 'לישון' },
            { wordEn: 'read', translationHe: 'לקרוא' },
          ],
          shortSentenceEn: 'I can swim fast.',
          shortSentenceHe: 'אני יכול/ה לשחות מהר.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'Birds can fly.',
            wrong: ['Birds can flies.', 'Birds can to fly.'],
            explainHe: 'אחרי can תמיד בא הפועל בצורתו הבסיסית, בלי s ובלי to: can fly (יכול לעוף).',
          },
          story: {
            passageEn:
              'Sam is a superhero. He can jump very high. He can swim, too. He protects the city every day.',
            passageHe: 'סם הוא גיבור על. הוא יכול לקפוץ גבוה מאוד. הוא גם יכול לשחות. הוא שומר על העיר כל יום.',
            questionEn: 'What does Sam protect?',
            questionHe: 'על מה סם שומר?',
            correct: 'the city',
            wrong: ['the moon', 'a pizza shop'],
          },
        },
      },
      {
        icon: '🏃',
        titleEn: "Can You Do It? Can't & Questions",
        titleHe: 'אתם מסוגלים? Can’t ושאלות',
        storyHookHe: 'באקדמיה יש מסלול מכשולים ענק! נספר מה אנחנו יכולים ומה עדיין לא, ונשאל חברים: Can you…?',
        grammarTopic: "Can / Can't Questions & Short Answers",
        skills: ["Can't", 'Yes/No Questions', 'Action Verbs'],
        sentenceEn: "I can run fast, but I can't fly.",
        sentenceHe: 'אני יכול/ה לרוץ מהר, אבל אני לא יכול/ה לעוף.',
        vocab: [
          ['run', 'verb', 'לרוץ', '🏃', 'Kids can run in the park.', 'ילדים יכולים לרוץ בפארק.'],
          ['climb', 'verb', 'לטפס', '🧗', 'Monkeys can climb tall trees.', 'קופים יכולים לטפס על עצים גבוהים.'],
          ['fly', 'verb', 'לעוף', '🦸', "Superman can fly, but I can't.", 'סופרמן יכול לעוף, אבל אני לא.'],
          ['help', 'verb', 'לעזור', '🤝', 'I can help my friends.', 'אני יכול/ה לעזור לחברים שלי.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'eat', translationHe: 'לאכול' },
            { wordEn: 'draw', translationHe: 'לצייר' },
          ],
          shortSentenceEn: 'I can run fast.',
          shortSentenceHe: 'אני יכול/ה לרוץ מהר.',
          rule: {
            questionEn: 'Which question is correct?',
            correct: 'Can you climb?',
            wrong: ['Can you climbs?', 'Do you can climb?'],
            explainHe: 'בשאלה עם can שמים את can בהתחלה ואחריו הפועל הבסיסי: Can you climb? (האם אתם יכולים לטפס?).',
          },
          story: {
            passageEn:
              "Dana is new at the academy. She can run fast and climb walls. She can't fly yet. Her friend Omer can fly.",
            passageHe: 'דנה חדשה באקדמיה. היא יכולה לרוץ מהר ולטפס על קירות. היא עדיין לא יכולה לעוף. חבר שלה, עומר, יכול לעוף.',
            questionEn: "What can't Dana do yet?",
            questionHe: 'מה דנה עדיין לא יכולה לעשות?',
            correct: 'fly',
            wrong: ['run', 'climb'],
          },
        },
      },
      {
        icon: '🏆',
        isBoss: true,
        titleEn: 'Boss: The Superhero Test',
        titleHe: 'אתגר הבוס: מבחן גיבורי העל',
        storyHookHe: 'הגיע המבחן הגדול של האקדמיה! הראו שאתם יודעים לספר מה אפשר ומה אי אפשר לעשות.',
        grammarTopic: "Review: Action Verbs & Can / Can't",
        skills: ['Review', "Can / Can't", 'Reading Aloud'],
        sentenceEn: 'Can you jump high and run very fast?',
        sentenceHe: 'האם אתם יכולים לקפוץ גבוה ולרוץ מהר מאוד?',
        vocab: [
          ['strong', 'adjective', 'חזק / חזקה', '💪', 'The superhero is very strong.', 'גיבור העל חזק מאוד.'],
          ['fast', 'adjective', 'מהיר / מהירה', '⚡', 'Cheetahs and heroes can run fast.', 'גיבורים יכולים לרוץ מהר.'],
          ['high', 'adverb', 'גבוה', '🦅', 'Frogs can jump very high.', 'צפרדעים יכולות לקפוץ גבוה מאוד.'],
          ['brave', 'adjective', 'אמיץ / אמיצה', '🦁', 'The brave hero saves the cat.', 'הגיבור האמיץ מציל את החתול.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'slow', translationHe: 'איטי' },
            { wordEn: 'tired', translationHe: 'עייף' },
          ],
          shortSentenceEn: 'Can you jump high?',
          shortSentenceHe: 'האם אתם יכולים לקפוץ גבוה?',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'He can jump high.',
            wrong: ['He cans jump high.', 'He can jumps high.'],
            explainHe: 'גם עם he ו-she אומרים can ללא s, והפועל שאחריו נשאר בצורה הבסיסית: He can jump.',
          },
          story: {
            passageEn:
              "Welcome to the final test! Ben can run fast and jump high. He can swim, but he can't fly. Ben wants to be a superhero. Today he runs, jumps and swims. The teacher says, great job!",
            passageHe:
              'ברוכים הבאים למבחן הסיום! בן יכול לרוץ מהר ולקפוץ גבוה. הוא יכול לשחות, אבל הוא לא יכול לעוף. בן רוצה להיות גיבור על. היום הוא רץ, קופץ ושוחה. המורה אומרת: כל הכבוד!',
            questionEn: "What can't Ben do?",
            questionHe: 'מה בן לא יכול לעשות?',
            correct: 'fly',
            wrong: ['swim', 'run fast'],
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 2: Around the House & My Room',
    titleHe: 'פרק 2: סביב הבית והחדר שלי',
    subtitleHe: 'חדרי הבית (kitchen, bedroom, living room), שמות עצם ברבים ומבנה There is / There are',
    badgeEmoji: '🏠',
    missions: [
      {
        icon: '🛋️',
        titleEn: 'Welcome to My Cozy Room',
        titleHe: 'ברוכים הבאים לחדר הנעים שלי',
        storyHookHe:
          'בואו נעשה סיור בחדר שלנו! נלמד להגיד מה יש בו בעזרת There is (ליחיד) ו-There are (לרבים).',
        grammarTopic: 'There is / There are & House Vocabulary',
        skills: ['There is / are', 'Room Vocabulary', 'Prepositions'],
        sentenceEn: 'There are two comfortable chairs in the living room.',
        sentenceHe: 'יש שני כיסאות נוחים בסלון.',
        vocab: [
          ['bedroom', 'noun', 'חדר שינה', '🛏️', 'My bedroom has a soft blue rug.', 'בחדר השינה שלי יש שטיח כחול ורך.'],
          [
            'kitchen',
            'noun',
            'מטבח',
            '🍳',
            'Dad is cooking vegetable soup in the kitchen.',
            'אבא מבשל מרק ירקות במטבח.',
          ],
          [
            'comfortable',
            'adjective',
            'נוח / נוחה',
            '😌',
            'This sofa is very comfortable for reading.',
            'הספה הזו נוחה מאוד לקריאה.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'garden', translationHe: 'גינה' },
            { wordEn: 'school', translationHe: 'בית ספר' },
          ],
          shortSentenceEn: 'My bedroom is small.',
          shortSentenceHe: 'חדר השינה שלי קטן.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'There are two chairs.',
            wrong: ['There is two chairs.', 'There are a chair.'],
            explainHe: 'There is משתמשים ליחיד (a chair), ו-There are לרבים (two chairs).',
          },
          story: {
            passageEn:
              'Dad is in the kitchen. There is a big table in the kitchen. There are three chairs. They are comfortable.',
            passageHe: 'אבא במטבח. יש שולחן גדול במטבח. יש שלושה כיסאות. הם נוחים.',
            questionEn: 'Where is Dad?',
            questionHe: 'איפה אבא?',
            correct: 'in the kitchen',
            wrong: ['in the bedroom', 'in the garden'],
          },
        },
      },
      {
        icon: '💡',
        titleEn: 'Where Is It? In, On, Under',
        titleHe: 'איפה זה? ב־, על, מתחת ל־',
        storyHookHe: 'משהו הלך לאיבוד בחדר! בואו נלמד להגיד איפה כל דבר נמצא: in, on, under ו-next to.',
        grammarTopic: 'Prepositions of Place & Furniture',
        skills: ['Prepositions', 'Furniture', 'Where Questions'],
        sentenceEn: 'The lamp is on the shelf next to the bed.',
        sentenceHe: 'המנורה על המדף ליד המיטה.',
        vocab: [
          ['lamp', 'noun', 'מנורה', '💡', 'The lamp is on the desk.', 'המנורה על השולחן.'],
          ['shelf', 'noun', 'מדף', '📚', 'My books are on the shelf.', 'הספרים שלי על המדף.'],
          ['sofa', 'noun', 'ספה', '🛋️', 'The cat sleeps on the sofa.', 'החתול ישן על הספה.'],
          ['bed', 'noun', 'מיטה', '🛏️', 'The ball is under the bed.', 'הכדור מתחת למיטה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'apple', translationHe: 'תפוח' },
            { wordEn: 'bird', translationHe: 'ציפור' },
          ],
          shortSentenceEn: 'It is on the shelf.',
          shortSentenceHe: 'זה נמצא על המדף.',
          rule: {
            questionEn: "Which word means 'מתחת ל'?",
            correct: 'under',
            wrong: ['on', 'next to'],
            explainHe: 'under פירושו מתחת ל, on פירושו על, ו-next to פירושו ליד.',
          },
          story: {
            passageEn:
              'Dan has a small room. There is a bed next to the window. A lamp is on the shelf. A ball is under the bed.',
            passageHe: 'לדן יש חדר קטן. יש מיטה ליד החלון. מנורה על המדף. כדור מתחת למיטה.',
            questionEn: 'Where is the ball?',
            questionHe: 'איפה הכדור?',
            correct: 'under the bed',
            wrong: ['on the shelf', 'in the kitchen'],
          },
        },
      },
      {
        icon: '🏡',
        isBoss: true,
        titleEn: 'Boss: The Big House Tour',
        titleHe: 'אתגר הבוס: סיור גדול בבית',
        storyHookHe: 'הבית כולו מחכה לכם! הראו שאתם יודעים לתאר חדרים, רהיטים ומיקומים.',
        grammarTopic: 'Review: There is / There are & Prepositions',
        skills: ['Review', 'There is / are', 'Reading Aloud'],
        sentenceEn: 'There are two mirrors in the bathroom.',
        sentenceHe: 'יש שתי מראות בחדר האמבטיה.',
        vocab: [
          ['bathroom', 'noun', 'חדר אמבטיה', '🛁', 'I brush my teeth in the bathroom.', 'אני מצחצח/ת שיניים בחדר האמבטיה.'],
          ['garden', 'noun', 'גינה', '🌷', 'We play with the dog in the garden.', 'אנחנו משחקים עם הכלב בגינה.'],
          ['mirror', 'noun', 'מראה', '🪞', 'There is a big mirror on the wall.', 'יש מראה גדולה על הקיר.'],
          ['carpet', 'noun', 'שטיח', '🧶', 'The carpet is next to the sofa.', 'השטיח ליד הספה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'park', translationHe: 'פארק' },
            { wordEn: 'zoo', translationHe: 'גן חיות' },
          ],
          shortSentenceEn: 'There is a mirror.',
          shortSentenceHe: 'יש מראה.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'There is a sofa in the living room.',
            wrong: ['There are a sofa in the living room.', 'There is sofas in the living room.'],
            explainHe: 'עם a sofa (ספה אחת) משתמשים ב-There is. There are מתאים רק לרבים, כמו two sofas.',
          },
          story: {
            passageEn:
              'Welcome to my house! There is a big kitchen and a small bathroom. In the living room, there is a sofa. There are two lamps next to the sofa. I love my house.',
            passageHe:
              'ברוכים הבאים לבית שלי! יש מטבח גדול וחדר אמבטיה קטן. בסלון יש ספה. יש שתי מנורות ליד הספה. אני אוהב/ת את הבית שלי.',
            questionEn: 'What is next to the sofa?',
            questionHe: 'מה נמצא ליד הספה?',
            correct: 'two lamps',
            wrong: ['a big table', 'three chairs'],
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 3: Sports Stars & Hobbies',
    titleHe: 'פרק 3: כוכבי ספורט ותחביבים',
    subtitleHe: 'משחקי ספורט, תחביבים ומשפטי I can עם פעלים',
    badgeEmoji: '⚽',
    missions: [
      {
        icon: '⚽',
        titleEn: 'Let’s Play! My Favorite Sports',
        titleHe: 'בואו נשחק! ענפי הספורט האהובים',
        storyHookHe: 'שעת הפסקה! כולם רצים למגרש. בואו נלמד לספר איזה ספורט אנחנו משחקים עם החברים.',
        grammarTopic: 'Sports Vocabulary & Present Simple (I / we / they play)',
        skills: ['Sports Words', 'We / They play', 'Reading Aloud'],
        sentenceEn: 'We play football with our friends after school.',
        sentenceHe: 'אנחנו משחקים כדורגל עם החברים אחרי בית הספר.',
        vocab: [
          ['football', 'noun', 'כדורגל', '⚽', 'We play football on Friday.', 'אנחנו משחקים כדורגל ביום שישי.'],
          ['basketball', 'noun', 'כדורסל', '🏀', 'They play basketball in the yard.', 'הם משחקים כדורסל בחצר.'],
          ['tennis', 'noun', 'טניס', '🎾', 'I play tennis with my sister.', 'אני משחק/ת טניס עם אחותי.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'pencil', translationHe: 'עיפרון' },
            { wordEn: 'banana', translationHe: 'בננה' },
          ],
          shortSentenceEn: 'We play football.',
          shortSentenceHe: 'אנחנו משחקים כדורגל.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'We play basketball.',
            wrong: ['We plays basketball.', 'We play are basketball.'],
            explainHe: 'עם I, you, we ו-they הפועל נשאר בצורתו הבסיסית, בלי s: We play.',
          },
          story: {
            passageEn:
              'Noa and Dan are friends. They play basketball on Monday. They play tennis on Friday. They like sports.',
            passageHe: 'נועה ודן הם חברים. הם משחקים כדורסל ביום שני. הם משחקים טניס ביום שישי. הם אוהבים ספורט.',
            questionEn: 'What do they play on Monday?',
            questionHe: 'מה הם משחקים ביום שני?',
            correct: 'basketball',
            wrong: ['football', 'tennis'],
          },
        },
      },
      {
        icon: '🎨',
        titleEn: 'My Hobbies: I Can Draw and Sing',
        titleHe: 'התחביבים שלי: אני יכול/ה לצייר ולשיר',
        storyHookHe: 'הגיע ערב כישרונות! בואו נספר מה אנחנו אוהבים לעשות ונשאל חברים: Can you…?',
        grammarTopic: "Hobbies with Can / Can't & Short Answers",
        skills: ['Hobby Verbs', 'Can + Verb', 'Short Answers'],
        sentenceEn: "I can draw and sing, but I can't dance.",
        sentenceHe: 'אני יכול/ה לצייר ולשיר, אבל אני לא יכול/ה לרקוד.',
        vocab: [
          ['draw', 'verb', 'לצייר', '🎨', 'I can draw a big house.', 'אני יכול/ה לצייר בית גדול.'],
          ['sing', 'verb', 'לשיר', '🎤', 'She can sing a nice song.', 'היא יכולה לשיר שיר יפה.'],
          ['dance', 'verb', 'לרקוד', '💃', 'We can dance at the party.', 'אנחנו יכולים לרקוד במסיבה.'],
          ['read', 'verb', 'לקרוא', '📖', 'I can read a book in English.', 'אני יכול/ה לקרוא ספר באנגלית.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'eat', translationHe: 'לאכול' },
            { wordEn: 'sleep', translationHe: 'לישון' },
          ],
          shortSentenceEn: 'I can draw well.',
          shortSentenceHe: 'אני יכול/ה לצייר יפה.',
          rule: {
            questionEn: 'Can you sing? Which answer is correct?',
            correct: 'Yes, I can.',
            wrong: ['Yes, I am.', 'Yes, can I.'],
            explainHe: 'עונים לשאלה עם can בתשובה קצרה עם can: Yes, I can. או No, I can\'t.',
          },
          story: {
            passageEn: "Lia has two hobbies. She can draw and she can sing. She can't dance. Her brother can dance.",
            passageHe: 'לליה יש שני תחביבים. היא יכולה לצייר והיא יכולה לשיר. היא לא יכולה לרקוד. אח שלה יכול לרקוד.',
            questionEn: "What can't Lia do?",
            questionHe: 'מה ליה לא יכולה לעשות?',
            correct: 'dance',
            wrong: ['draw', 'sing'],
          },
        },
      },
      {
        icon: '🏅',
        isBoss: true,
        titleEn: 'Boss: Sports Day Champions',
        titleHe: 'אתגר הבוס: אלופי יום הספורט',
        storyHookHe: 'יום הספורט של בית הספר התחיל! הראו שאתם מכירים משחקים, קבוצות ויכולות.',
        grammarTopic: 'Review: Sports, Hobbies & Can',
        skills: ['Review', 'Can + Verb', 'Reading Aloud'],
        sentenceEn: 'Our team can run fast and play well.',
        sentenceHe: 'הקבוצה שלנו יכולה לרוץ מהר ולשחק טוב.',
        vocab: [
          ['ball', 'noun', 'כדור', '⚽', 'I have a new ball.', 'יש לי כדור חדש.'],
          ['team', 'noun', 'קבוצה', '👥', 'Our team is very strong.', 'הקבוצה שלנו חזקה מאוד.'],
          ['winner', 'noun', 'מנצח / מנצחת', '🏆', 'The winner gets a gold cup.', 'המנצח/ת מקבל/ת גביע זהב.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'spoon', translationHe: 'כף' },
            { wordEn: 'book', translationHe: 'ספר' },
          ],
          shortSentenceEn: 'We have a ball.',
          shortSentenceHe: 'יש לנו כדור.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'She can play tennis.',
            wrong: ['She can plays tennis.', 'She cans play tennis.'],
            explainHe: 'אחרי can הפועל נשאר בצורה הבסיסית, גם עם she: She can play.',
          },
          story: {
            passageEn:
              "It is Sports Day at school! Tom plays football with his team. Mia plays tennis. She can run fast and she can hit the ball. Tom's team is the winner. They are very happy.",
            passageHe:
              'זה יום הספורט בבית הספר! טום משחק כדורגל עם הקבוצה שלו. מיה משחקת טניס. היא יכולה לרוץ מהר והיא יכולה להכות בכדור. הקבוצה של טום היא המנצחת. הם שמחים מאוד.',
            questionEn: 'Who is the winner?',
            questionHe: 'מי המנצחים?',
            correct: "Tom's team",
            wrong: ['Mia', 'the teacher'],
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 4: The Healthy Food Market',
    titleHe: 'פרק 4: שוק האוכל הבריא',
    subtitleHe: "פירות וירקות, I like / I don't like, שאלות What ומשפטי There is / There are",
    badgeEmoji: '🍎',
    missions: [
      {
        icon: '🍎',
        titleEn: 'Fruit & Veggie Fun: I Like…',
        titleHe: 'כיף של פירות וירקות: אני אוהב/ת…',
        storyHookHe: 'הגענו לשוק הצבעוני! בואו נלמד להגיד איזה פירות וירקות אנחנו אוהבים ואיזה לא.',
        grammarTopic: "Fruit & Vegetables, I like / I don't like",
        skills: ['Food Words', "I like / I don't like", 'Plural s'],
        sentenceEn: "I like bananas, but I don't like carrots.",
        sentenceHe: 'אני אוהב/ת בננות, אבל אני לא אוהב/ת גזר.',
        vocab: [
          ['apple', 'noun', 'תפוח', '🍎', 'The red apple is sweet.', 'התפוח האדום מתוק.'],
          ['banana', 'noun', 'בננה', '🍌', 'A banana is yellow.', 'בננה היא צהובה.'],
          ['carrot', 'noun', 'גזר', '🥕', 'Rabbits like carrots.', 'ארנבים אוהבים גזר.'],
          ['tomato', 'noun', 'עגבנייה', '🍅', 'I put a tomato in the salad.', 'אני שם/ה עגבנייה בסלט.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'shoe', translationHe: 'נעל' },
            { wordEn: 'chair', translationHe: 'כיסא' },
          ],
          shortSentenceEn: 'I like apples.',
          shortSentenceHe: 'אני אוהב/ת תפוחים.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: "I don't like carrots.",
            wrong: ['I no like carrots.', 'I not like carrots.'],
            explainHe: "כדי להגיד שאנחנו לא אוהבים משהו משתמשים ב-don't לפני like: I don't like.",
          },
          story: {
            passageEn:
              'Yael is at the market. She buys a red apple and a yellow banana. Fruit is healthy. Yael is happy.',
            passageHe: 'יעל בשוק. היא קונה תפוח אדום ובננה צהובה. פירות הם בריאים. יעל שמחה.',
            questionEn: 'What color is the banana?',
            questionHe: 'באיזה צבע הבננה?',
            correct: 'yellow',
            wrong: ['red', 'blue'],
          },
        },
      },
      {
        icon: '🥛',
        titleEn: 'What Do You Eat and Drink?',
        titleHe: 'מה אוכלים ושותים?',
        storyHookHe: 'ארוחת בוקר בריאה מתחילה כאן! בואו נשאל ונענה: What do you eat? What do you drink?',
        grammarTopic: 'What Questions & Healthy Food',
        skills: ['What Questions', 'Food & Drink', 'Healthy Habits'],
        sentenceEn: 'What do you drink in the morning?',
        sentenceHe: 'מה אתם שותים בבוקר?',
        vocab: [
          ['milk', 'noun', 'חלב', '🥛', 'I drink milk for breakfast.', 'אני שותה/ת חלב בארוחת בוקר.'],
          ['water', 'noun', 'מים', '💧', 'Water is good for you.', 'מים בריאים לנו.'],
          ['bread', 'noun', 'לחם', '🍞', 'We eat bread with cheese.', 'אנחנו אוכלים לחם עם גבינה.'],
          ['cheese', 'noun', 'גבינה', '🧀', 'I like cheese on my bread.', 'אני אוהב/ת גבינה על הלחם.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'sock', translationHe: 'גרב' },
            { wordEn: 'door', translationHe: 'דלת' },
          ],
          shortSentenceEn: 'I drink water.',
          shortSentenceHe: 'אני שותה/ת מים.',
          rule: {
            questionEn: 'Which question is correct?',
            correct: 'What do you eat?',
            wrong: ['What you do eat?', 'Do what you eat?'],
            explainHe: 'בשאלה עם What סדר המילים הוא: What + do + you + הפועל. למשל: What do you eat?',
          },
          story: {
            passageEn:
              'Ben is hungry. For breakfast, he eats bread and cheese. He drinks a glass of milk. Ben feels strong.',
            passageHe: 'בן רעב. בארוחת בוקר הוא אוכל לחם וגבינה. הוא שותה כוס חלב. בן מרגיש חזק.',
            questionEn: 'What does Ben drink?',
            questionHe: 'מה בן שותה?',
            correct: 'milk',
            wrong: ['juice', 'tea'],
          },
        },
      },
      {
        icon: '🧺',
        isBoss: true,
        titleEn: 'Boss: The Healthy Basket',
        titleHe: 'אתגר הבוס: הסל הבריא',
        storyHookHe: 'סל הקניות מחכה למילוי! הראו שאתם יודעים לתאר מה יש בסל ואיפה הוא נמצא.',
        grammarTopic: 'Review: There is / There are, Food & Prepositions',
        skills: ['Review', 'There is / are', 'Reading Aloud'],
        sentenceEn: 'There are fresh vegetables in the basket.',
        sentenceHe: 'יש ירקות טריים בסל.',
        vocab: [
          ['vegetables', 'noun', 'ירקות', '🥦', 'Vegetables are good for me.', 'ירקות טובים לי.'],
          ['fruit', 'noun', 'פירות', '🍇', 'I eat fruit every day.', 'אני אוכל/ת פירות כל יום.'],
          ['basket', 'noun', 'סל', '🧺', 'The basket is on the table.', 'הסל על השולחן.'],
          ['healthy', 'adjective', 'בריא / בריאה', '💪', 'Fresh food is healthy.', 'אוכל טרי הוא בריא.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'pencils', translationHe: 'עפרונות' },
            { wordEn: 'shoes', translationHe: 'נעליים' },
          ],
          shortSentenceEn: 'The fruit is healthy.',
          shortSentenceHe: 'הפרי בריא.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'There are apples in the basket.',
            wrong: ['There is apples in the basket.', 'There apples are in the basket.'],
            explainHe: 'לרבים (apples) אומרים There are, ובמשפט הסדר הוא: There are + שם העצם + מקום.',
          },
          story: {
            passageEn:
              'It is Friday. Mom and I go to the market. We buy fruit and vegetables. There are red tomatoes and green cucumbers in the basket. There is a big apple next to the basket. Healthy food is great for us!',
            passageHe:
              'זה יום שישי. אמא ואני הולכים לשוק. אנחנו קונים פירות וירקות. יש עגבניות אדומות ומלפפונים ירוקים בסל. יש תפוח גדול ליד הסל. אוכל בריא מעולה בשבילנו!',
            questionEn: 'What is next to the basket?',
            questionHe: 'מה נמצא ליד הסל?',
            correct: 'a big apple',
            wrong: ['a small cat', 'a blue bag'],
          },
        },
      },
    ],
  },
]);

