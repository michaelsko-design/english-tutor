import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-4 grade 3 unit: telling a story and joining ideas with and / then and but, with
 * Pre-Band I words the app never taught or taught only later ("once upon a time", "their",
 * "It's not fair"…). Stories open with "Once upon a time, there was…" (Pre-Band I "there was").
 * Example Hebrew uses slash forms for "I"; "you" is plural; hints and explanations are
 * gender-neutral plural. Word emoji reuse drawn pictures until the unit's own are drawn.
 */
const UNIT_CORE_4: ElementaryUnitSpec = {
  ...packUnitNumbers('core-4'),
  titleEn: 'Once Upon a Time',
  titleHe: 'היה היה פעם',
  subtitleHe: 'עונה 4: מספרים סיפור ומחברים רעיונות עם and, then ו-but',
  badgeEmoji: '📜',
  missions: [
    {
      icon: '🐉',
      titleEn: 'Once Upon a Time',
      titleHe: 'היה היה פעם',
      storyHookHe:
        'כל אגדה מתחילה ב-Once upon a time (היה היה פעם)! נלמד לספר סיפור ולחבר רעיונות עם and (ו-) ו-then (ואז).',
      grammarTopic: 'Joining ideas with and / and then',
      skills: ['Stories', 'and / and then', 'their / them'],
      sentenceEn: 'Once upon a time, there was a little fox and a big bear.',
      sentenceHe: 'היה היה פעם שועל קטן ודוב גדול.',
      vocab: [
        [
          'once upon a time',
          'phrase',
          'היה היה פעם',
          '📜',
          'Once upon a time, there was a big red dragon.',
          'היה היה פעם דרקון אדום וגדול.',
        ],
        ['then', 'adverb', 'ואז / אחר כך', '👉', 'We eat lunch, and then we play.', 'אנחנו אוכלים צהריים, ואז אנחנו משחקים.'],
        ['their', 'pronoun', 'שלהם / שלהן', '👪', 'The kids play with their dog.', 'הילדים משחקים עם הכלב שלהם.'],
        ['them', 'pronoun', 'אותם / אותן / איתם', '👫', 'I like my friends, and I play with them.', 'אני אוהב/ת את החברים שלי, ואני משחק/ת איתם.'],
        ['last', 'adjective', 'אחרון', '🏁', 'Dan is the last one in the line.', 'דן הוא האחרון בתור.'],
        ['go away', 'verb', 'ללכת מכאן', '🏃', 'Bee, please go away!', 'דבורה, לכי מכאן בבקשה!'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'bus', translationHe: 'אוטובוס' },
          { wordEn: 'shirt', translationHe: 'חולצה' },
        ],
        shortSentenceEn: 'They play with their dog.',
        shortSentenceHe: 'הם משחקים עם הכלב שלהם.',
        rule: {
          questionEn: 'I have a dog. I have a cat. Which sentence joins them?',
          correct: 'I have a dog and a cat.',
          wrong: ['I have a dog but a cat.', 'I have and a dog a cat.'],
          explainHe: 'and (ו-) מחבר שני דברים: a dog and a cat. המילה and עומדת בין שני הדברים.',
          hintHe: 'איזו מילה מחברת, ואיפה היא עומדת?',
        },
        story: {
          passageEn:
            'Once upon a time, there was a little bird and a big tree. The bird lived in the tree with her mom and dad. Every morning, the bird sang a song.',
          passageHe: 'היה היה פעם ציפור קטנה ועץ גדול. הציפור גרה בעץ עם אמא ואבא שלה. כל בוקר הציפור שרה שיר.',
          questionEn: 'Where is the bird\'s home?',
          questionHe: 'איפה הבית של הציפור?',
          correct: 'in a big tree',
          wrong: ['in a big house', 'in the sea'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'How does a story start?',
              correct: 'Once upon a time…',
              wrong: ['Good night…'],
              explainHe: 'Once upon a time פירושו "היה היה פעם": כך מתחילה אגדה.',
              hintHe: 'מה אומרים בתחילת אגדה?',
            },
            story: {
              passageEn: 'Once upon a time, there was a king. He had a big castle and a little cat.',
              passageHe: 'היה היה פעם מלך. היה לו ארמון גדול וחתול קטן.',
              questionEn: 'What is big in the story?',
              questionHe: 'מה גדול בסיפור?',
              correct: 'the castle',
              wrong: ['the cat'],
            },
          },
          challenger: {
            clozeWrong: [
              ['Good night', 'Thank you'],
              ['their', 'them'],
              ['them', 'they'],
              ['their', 'they'],
              ['then', 'them'],
              ['then', 'last'],
            ],
          },
          master: {
            sentenceEn: 'Once upon a time, there was a king and a queen.',
            sentenceHe: 'היה היה פעם מלך ומלכה.',
            decoys: ['but', 'are'],
            voiceEn: 'The kids go home, and then they eat.',
            voiceHe: 'הילדים הולכים הביתה, ואז הם אוכלים.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'Tom and Dan play with their ball.',
              wrong: ['Tom and Dan play with them ball.', 'Tom and Dan plays with their ball.', 'Tom and Dan play with ball their.'],
              explainHe: 'their (שלהם) בא לפני ball. עם Tom and Dan (הם) אומרים play בלי s.',
              hintEn: 'Check their and play.',
            },
            story: {
              passageEn:
                'Once upon a time, there was a little rabbit. Every day, a big fox came to her home and said, "Give me your carrots!" The rabbit was sad. One day, the rabbit and her friends stood at the door and said, "Go away, fox!" The fox ran away and never came back.',
              passageHe: '',
              questionEn: 'What makes the fox go away?',
              questionHe: '',
              correct: 'The rabbit and her friends.',
              wrong: ['A big dog.', 'The rain.', 'Some carrots.'],
            },
            storyHintEn: 'Who is at the door?',
          },
        },
      },
    },
    {
      icon: '🤨',
      titleEn: 'But…!',
      titleHe: 'אבל…!',
      storyHookHe: 'בכל סיפור יש הפתעה! נלמד לחבר שני רעיונות שונים עם but (אבל).',
      grammarTopic: 'Joining different ideas with but',
      skills: ['Stories', 'but', 'It\'s not fair'],
      sentenceEn: 'I want to play outside, but it is raining.',
      sentenceHe: 'אני רוצה לשחק בחוץ, אבל יורד גשם.',
      vocab: [
        ['but', 'conjunction', 'אבל', '🤨', 'I like cats, but I don\'t like dogs.', 'אני אוהב/ת חתולים, אבל אני לא אוהב/ת כלבים.'],
        [
          'It\'s not fair',
          'phrase',
          'זה לא הוגן',
          '⚖️',
          'It\'s not fair! Dan has two cookies, and I have one.',
          'זה לא הוגן! לדן יש שתי עוגיות, ולי יש אחת.',
        ],
        ['bad', 'adjective', 'רע', '🌧️', 'The weather is bad, but we can play inside.', 'מזג האוויר רע, אבל אפשר לשחק בפנים.'],
        ['go on', 'verb', 'להמשיך', '🧗', 'The story is fun. Please go on!', 'הסיפור כיף. תמשיכו, בבקשה!'],
        ['no one', 'pronoun', 'אף אחד', '🫥', 'The park is empty. There is no one here.', 'הפארק ריק. אין כאן אף אחד.'],
        ['all the time', 'phrase', 'כל הזמן', '⏳', 'My little brother talks all the time.', 'אח שלי הקטן מדבר כל הזמן.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'cake', translationHe: 'עוגה' },
          { wordEn: 'blue', translationHe: 'כחול' },
        ],
        shortSentenceEn: 'I am tired, but I am happy.',
        shortSentenceHe: 'אני עייף/ה, אבל אני שמח/ה.',
        rule: {
          questionEn: 'I want to swim. The water is cold. Which sentence joins them?',
          correct: 'I want to swim, but the water is cold.',
          wrong: ['I want to swim, but the water cold.', 'I want to swim but, the water is cold.'],
          explainHe: 'but (אבל) מחבר שני רעיונות שונים. הפסיק בא לפני but, ולא שוכחים את is.',
          hintHe: 'בדקו את המילה is ואת מקום הפסיק.',
        },
        story: {
          passageEn: 'Ben and Maya play a game. Maya wins, but Ben is not sad. He says, "Good game! Let\'s play again!"',
          passageHe: 'בן ומאיה משחקים משחק. מאיה מנצחת, אבל בן לא עצוב. הוא אומר: משחק טוב! בואי נשחק שוב!',
          questionEn: 'Who wins the game?',
          questionHe: 'מי מנצח במשחק?',
          correct: 'Maya',
          wrong: ['Ben', 'no one'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Dan likes ice cream. He does not like cake. Which sentence is right?',
              correct: 'Dan likes ice cream, but he does not like cake.',
              wrong: ['Dan likes ice cream and cake.'],
              explainHe: 'but (אבל) מראה הבדל: גלידה כן, עוגה לא.',
              hintHe: 'מה דן לא אוהב?',
            },
            story: {
              passageEn: 'It is a bad day. It rains all the time. But then the sun comes out!',
              passageHe: 'זה יום רע. יורד גשם כל הזמן. אבל אז השמש יוצאת!',
              questionEn: 'What comes out at the end?',
              questionHe: 'מה יוצא בסוף?',
              correct: 'the sun',
              wrong: ['the moon'],
            },
          },
          challenger: {
            clozeWrong: [
              ['then', 'their'],
              ['Go on', 'No one'],
              ['then', 'no one'],
              ['bad', 'no one'],
              ['bad', 'go on'],
              ['their', 'but'],
            ],
          },
          master: {
            sentenceEn: 'Dana is tired, but she wants to play.',
            sentenceHe: 'דנה עייפה, אבל היא רוצה לשחק.',
            decoys: ['and', 'want'],
            voiceEn: 'No one is home, but the door is open.',
            voiceHe: 'אף אחד לא בבית, אבל הדלת פתוחה.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'I like the game, but it is hard.',
              wrong: ['I like the game, but it hard.', 'I likes the game, but it is hard.', 'I like the game but, it is hard.'],
              explainHe: 'אחרי I בא like (בלי s), הפסיק בא לפני but, ולא שוכחים את is.',
              hintEn: 'Check like, is and the comma.',
            },
            story: {
              passageEn:
                'Tom and his sister play a ball game. Tom gets the ball all the time. His sister says, "It\'s not fair! I want the ball too." Tom says, "You are right." Now they take turns, and the game is fun for both of them.',
              passageHe: '',
              questionEn: 'Why does Tom\'s sister say "It\'s not fair"?',
              questionHe: '',
              correct: 'Tom gets the ball all the time.',
              wrong: ['She does not like ball games.', 'Tom is sad.', 'She wins all the time.'],
            },
            storyHintEn: 'Who gets the ball?',
          },
        },
      },
    },
    {
      icon: '🏁',
      isBoss: true,
      titleEn: 'Boss: The Big Race',
      titleHe: 'אתגר הבוס: המרוץ הגדול',
      storyHookHe: 'יש מרוץ גדול בבית הספר! ספרו את הסיפור שלו עם and, then ו-but.',
      grammarTopic: 'Telling a story with and, then and but: Review',
      skills: ['and / then', 'but', 'Review'],
      sentenceEn: 'Good luck in the race, Dana!',
      sentenceHe: 'בהצלחה במרוץ, דנה!',
      vocab: [
        ['Good luck!', 'phrase', 'בהצלחה!', '🍀', 'Good luck! You can win!', 'בהצלחה! אתם יכולים לנצח!'],
        ['take a picture', 'phrase', 'לצלם', '📷', 'Mom, please take a picture of us!', 'אמא, צלמי אותנו בבקשה!'],
        ['rest', 'noun', 'מנוחה', '🛌', 'I am tired. I need a rest.', 'אני עייף/ה. אני צריך/ה מנוחה.'],
        ['fifth', 'adjective', 'חמישי', '🏅', 'Dana is fifth in the race.', 'דנה במקום החמישי במרוץ.'],
        ['test', 'noun', 'מבחן', '📝', 'I have an English test today.', 'יש לי מבחן באנגלית היום.'],
        ['a bit', 'phrase', 'קצת', '💧', 'The water is a bit cold.', 'המים קצת קרים.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'fish', translationHe: 'דג' },
          { wordEn: 'green', translationHe: 'ירוק' },
        ],
        shortSentenceEn: 'Let\'s take a picture!',
        shortSentenceHe: 'בואו נצטלם!',
        rule: {
          questionEn: 'Which sentence is right?',
          correct: 'Dana runs fast, but she is fifth.',
          wrong: ['Dana runs fast, but she fifth.', 'Dana runs fast and but she is fifth.'],
          explainHe: 'but מחבר שני רעיונות: היא רצה מהר, אבל היא חמישית. אחרי she בא is.',
          hintHe: 'בדקו את is ואת המילה המחברת.',
        },
        story: {
          passageEn:
            'Once upon a time, there was a big race in the park. Ten kids ran. Dana ran fast, but she was fifth. She was a bit sad. Then her dad said, "Good job! Let\'s take a picture!"',
          passageHe:
            'היה היה פעם מרוץ גדול בפארק. עשרה ילדים רצו. דנה רצה מהר, אבל היא הגיעה למקום החמישי. היא הייתה קצת עצובה. ואז אבא שלה אמר: כל הכבוד! בואי נצטלם!',
          questionEn: 'What is Dana\'s place in the race?',
          questionHe: 'באיזה מקום דנה במרוץ?',
          correct: 'fifth',
          wrong: ['first', 'last'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Your friend has a test today. What do you say?',
              correct: 'Good luck!',
              wrong: ['Go away!'],
              explainHe: 'Good luck! פירושו "בהצלחה!".',
              hintHe: 'מה מאחלים לפני מבחן?',
            },
            story: {
              passageEn: 'Ben runs and runs. Then he stops for a rest. He drinks some water.',
              passageHe: 'בן רץ ורץ. ואז הוא עוצר למנוחה. הוא שותה קצת מים.',
              questionEn: 'What does Ben drink?',
              questionHe: 'מה בן שותה?',
              correct: 'water',
              wrong: ['milk'],
            },
          },
          challenger: {
            clozeWrong: [
              ['It\'s not fair!', 'Go away!'],
              ['go on', 'rest'],
              ['fifth', 'go on'],
              ['a bit', 'rest'],
              ['fifth', 'a bit'],
              ['fifth', 'test'],
            ],
          },
          master: {
            sentenceEn: 'The race is hard, but we can have a rest at the end.',
            sentenceHe: 'המרוץ קשה, אבל אפשר לנוח בסוף.',
            decoys: ['are', 'rests'],
            voiceEn: 'Good luck on your test!',
            voiceHe: 'בהצלחה במבחן!',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'Maya is tired, but she runs to the end.',
              wrong: [
                'Maya is tired, but she run to the end.',
                'Maya are tired, but she runs to the end.',
                'Maya is tired, but runs she to the end.',
              ],
              explainHe: 'עם Maya ו-she אומרים is ו-runs (עם s). קודם she ואחר כך runs.',
              hintEn: 'Check is, runs and the word order.',
            },
            story: {
              passageEn:
                'Once upon a time, there was a school race. Before the race, Noa\'s friends said, "Good luck!" Noa ran fast, but in the middle of the race she fell. She stood up and went on. She was last, but everyone clapped for her. Then her teacher took a picture of Noa with a big smile.',
              passageHe: '',
              questionEn: 'Why does everyone clap for Noa?',
              questionHe: '',
              correct: 'She gets up and goes on.',
              wrong: ['She is first in the race.', 'She takes a picture.', 'She does not run.'],
            },
            storyHintEn: 'What does Noa do after she falls?',
          },
        },
      },
    },
  ],
};

/** The core-4 pack's grade 3 unit (`../../registry.ts`) */
export const CORE_4_GRADE_3_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-3', [UNIT_CORE_4]);
