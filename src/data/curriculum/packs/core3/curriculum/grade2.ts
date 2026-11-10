import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-3 grade 2 unit: polite words (please, thank you, you're welcome, I'm sorry, Excuse me),
 * with Pre-Band I phrases the app never taught. Example Hebrew uses slash forms ("שמח/ה"); hints
 * and explanations are gender-neutral plural.
 */
const UNIT_CORE_3: ElementaryUnitSpec = {
  ...packUnitNumbers('core-3'),
  titleEn: 'Polite Words',
  titleHe: 'מילים מנומסות',
  subtitleHe: 'עונה 3: מבקשים יפה, מודים ומבקשים סליחה: please, thank you, sorry',
  badgeEmoji: '🤝',
  missions: [
    {
      icon: '🙏',
      titleEn: 'Please and Thank You',
      titleHe: 'בבקשה ותודה',
      storyHookHe:
        'בכיתה מבקשים יפה! נלמד לבקש עם please (בבקשה), להודות עם thank you (תודה) ולענות you\'re welcome (בבקשה).',
      grammarTopic: 'Asking nicely: Can I have …, please?',
      skills: ['Polite words', 'please & thank you', 'Can I have…?'],
      sentenceEn: 'Can I have the red pencil, please?',
      sentenceHe: 'אפשר לקבל את העיפרון האדום, בבקשה?',
      vocab: [
        ['thank you', 'phrase', 'תודה', '🙏', 'Thank you for the red ball.', 'תודה על הכדור האדום.'],
        ['ask', 'verb', 'לבקש / לשאול', '🙋', 'I ask Mom for an apple.', 'אני מבקש/ת מאמא תפוח.'],
        ['glad', 'adjective', 'שמח', '😁', 'I am glad to see you.', 'אני שמח/ה לראות אותך.'],
        [
          'say it again, please',
          'phrase',
          'אפשר לחזור על זה בבקשה?',
          '🔂',
          'I can\'t hear you. Say it again, please.',
          'אני לא שומע/ת. אפשר להגיד את זה שוב, בבקשה?',
        ],
        ['in a minute', 'phrase', 'עוד רגע', '⏲️', 'I can play with you in a minute.', 'אני יכול/ה לשחק איתך עוד רגע.'],
        ['sit down', 'verb', 'לשבת', '🪑', 'Please sit down on the chair.', 'שבו על הכיסא, בבקשה.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'sleep', translationHe: 'לישון' },
          { wordEn: 'jump', translationHe: 'לקפוץ' },
        ],
        shortSentenceEn: 'Thank you for the ball.',
        shortSentenceHe: 'תודה על הכדור.',
        rule: {
          questionEn: 'You want a pencil. What do you say?',
          correct: 'Can I have a pencil, please?',
          wrong: ['Give me a pencil now!', 'Can I a pencil have, please?'],
          explainHe: 'מבקשים יפה: Can I have …, please? המילה please פירושה "בבקשה".',
          hintHe: 'איזו בקשה מנומסת, ובאיזו מהן המילים בסדר הנכון?',
        },
        story: {
          passageEn:
            'Maya is in class. She wants a blue pencil. She asks Tom, Can I have your blue pencil, please? Tom says, Yes! Maya says, Thank you!',
          passageHe:
            'מאיה בכיתה. היא רוצה עיפרון כחול. היא שואלת את תום: אפשר לקבל את העיפרון הכחול שלך, בבקשה? תום אומר: כן! מאיה אומרת: תודה!',
          questionEn: 'What does Maya want?',
          questionHe: 'מה מאיה רוצה?',
          correct: 'a blue pencil',
          wrong: ['a red ball', 'a green apple'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which one is polite?',
              correct: 'Thank you!',
              wrong: ['Go away!'],
              explainHe: 'thank you פירושו "תודה". אומרים את זה כשמקבלים משהו.',
              hintHe: 'מה אומרים כשמקבלים משהו?',
            },
            story: {
              passageEn: 'Dan has a new ball. He gives it to Lea. Lea says, Thank you, Dan!',
              passageHe: 'לדן יש כדור חדש. הוא נותן אותו ללאה. לאה אומרת: תודה, דן!',
              questionEn: 'What does Lea say?',
              questionHe: 'מה לאה אומרת?',
              correct: 'Thank you, Dan!',
              wrong: ['Good night, Dan!'],
            },
          },
          challenger: {
            clozeWrong: [
              ['go away', 'good night'],
              ['sleep', 'jump'],
              ['green', 'tall'],
              ['red and blue', 'a big cat'],
              ['a banana', 'the door'],
              ['red', 'happy'],
            ],
          },
          master: {
            sentenceEn: 'Mom, can I have an apple, please?',
            sentenceHe: 'אמא, אפשר לקבל תפוח, בבקשה?',
            decoys: ['has', 'give'],
            voiceEn: 'Thank you for the yellow pencil.',
            voiceHe: 'תודה על העיפרון הצהוב.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'Can I have the book, please?',
              wrong: ['Can I has the book, please?', 'Can have I the book, please?', 'Can I have book the, please?'],
              explainHe: 'אחרי I בא have (לא has), וסדר המילים הוא Can I have the book, please?',
              hintEn: 'Check have and the word order.',
            },
            story: {
              passageEn:
                'It is lunch time. Noa has two apples, but Ben has no apple. Ben looks at the apples. He asks, Can I have an apple, please? Noa gives him one. Ben says, Thank you! Noa says, You\'re welcome.',
              passageHe: '',
              questionEn: 'Why does Ben ask Noa?',
              questionHe: '',
              correct: 'He has no apple.',
              wrong: ['He has two apples.', 'He wants a new book.', 'Noa is sad today.'],
            },
            storyHintEn: 'Look at what Ben has and does not have.',
          },
        },
      },
    },
    {
      icon: '😬',
      titleEn: 'Sorry! Excuse Me!',
      titleHe: 'סליחה!',
      storyHookHe: 'אופס! נלמד לבקש סליחה עם I\'m sorry, ולפנות למישהו בנימוס עם Excuse me.',
      grammarTopic: 'Saying sorry: I\'m sorry / Excuse me',
      skills: ['Polite words', 'I\'m sorry', 'Excuse me'],
      sentenceEn: 'Excuse me, can I sit here?',
      sentenceHe: 'סליחה, אפשר לשבת כאן?',
      vocab: [
        ['I\'m sorry', 'phrase', 'אני מצטער/ת', '😢', 'I\'m sorry, I am late.', 'אני מצטער/ת, אני מאחר/ת.'],
        ['it doesn\'t matter', 'phrase', 'לא נורא', '🫤', 'It doesn\'t matter. We can play again.', 'לא נורא. אפשר לשחק שוב.'],
        ['hit', 'verb', 'לפגוע / להכות', '⚾', 'Oops! The ball hit the window.', 'אופס! הכדור פגע בחלון.'],
        ['lost', 'adjective', 'אבוד', '🫨', 'My cat is lost.', 'החתול שלי הלך לאיבוד.'],
        ['talk', 'verb', 'לדבר', '🗣️', 'I talk with my friend.', 'אני מדבר/ת עם החבר שלי.'],
        ['come back', 'verb', 'לחזור', '🪃', 'Please come back soon!', 'תחזרו מהר, בבקשה!'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'eat', translationHe: 'לאכול' },
          { wordEn: 'swim', translationHe: 'לשחות' },
        ],
        shortSentenceEn: 'Excuse me, please.',
        shortSentenceHe: 'סליחה, בבקשה.',
        rule: {
          questionEn: 'Your ball hits a friend. What do you say?',
          correct: 'I\'m sorry!',
          wrong: ['Thank you!', 'Happy birthday!'],
          explainHe: 'כשפוגעים במישהו בטעות, מבקשים סליחה: I\'m sorry.',
          hintHe: 'מה אומרים כשמבקשים סליחה?',
        },
        story: {
          passageEn:
            'Dan runs in the park. Oops! His ball hits a girl. Dan says, I\'m sorry! The girl says, It doesn\'t matter. They play ball together.',
          passageHe:
            'דן רץ בפארק. אופס! הכדור שלו פוגע בילדה. דן אומר: אני מצטער! הילדה אומרת: לא נורא. הם משחקים בכדור ביחד.',
          questionEn: 'What does the girl say?',
          questionHe: 'מה הילדה אומרת?',
          correct: 'It doesn\'t matter.',
          wrong: ['Happy birthday!', 'Good night!'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'A boy stands at the door. You want to go in. What do you say?',
              correct: 'Excuse me!',
              wrong: ['Go away!'],
              explainHe: 'כשרוצים לעבור או לפנות למישהו, אומרים Excuse me (סליחה).',
              hintHe: 'איזו מילה מנומסת?',
            },
            story: {
              passageEn: 'Lea\'s cat is lost. She looks in the garden. The cat is under the tree!',
              passageHe: 'החתול של לאה הלך לאיבוד. היא מחפשת בגינה. החתול מתחת לעץ!',
              questionEn: 'Where is the cat?',
              questionHe: 'איפה החתול?',
              correct: 'under the tree',
              wrong: ['in the box'],
            },
          },
          challenger: {
            clozeWrong: [
              ['red apple', 'big table'],
              ['a green egg', 'my blue cap'],
              ['sleep', 'read'],
              ['pencil', 'sing'],
              ['table', 'green'],
              ['apple', 'yellow'],
            ],
          },
          master: {
            sentenceEn: 'Excuse me, is this your pen?',
            sentenceHe: 'סליחה, זה העט שלך?',
            decoys: ['are', 'his'],
            voiceEn: 'Sorry, I lost your pencil.',
            voiceHe: 'אני מצטער/ת, איבדתי את העיפרון שלך.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'I\'m sorry, my dog is in your garden.',
              wrong: [
                'I\'m sorry, my dog are in your garden.',
                'I sorry, my dog is in your garden.',
                'I\'m sorry, my dog is in garden your.',
              ],
              explainHe: 'אומרים I\'m sorry (עם am). עם dog אחד בא is, והמילה your באה לפני garden.',
              hintEn: 'Check I\'m, is, and the word order.',
            },
            story: {
              passageEn:
                'Tom has a big box. He wants to go into the class, but a boy stands at the door. Tom says, Excuse me, please. The boy says, Oh, I\'m sorry! and moves away. Tom says, Thank you!',
              passageHe: '',
              questionEn: 'Why does the boy say sorry?',
              questionHe: '',
              correct: 'He stands at the door.',
              wrong: ['He has a big box.', 'He is lost in the class.', 'Tom is sad and late.'],
            },
            storyHintEn: 'Where is the boy when Tom comes?',
          },
        },
      },
    },
    {
      icon: '🎂',
      isBoss: true,
      titleEn: 'Boss: The Polite Party',
      titleHe: 'אתגר הבוס: מסיבה מנומסת',
      storyHookHe: 'יש מסיבת יום הולדת! הראו שאתם יודעים לברך, לבקש יפה, להודות ולבקש סליחה.',
      grammarTopic: 'Polite words & Review',
      skills: ['please & thank you', 'I\'m sorry', 'Review'],
      sentenceEn: 'Thank you for the cake, Grandma!',
      sentenceHe: 'תודה על העוגה, סבתא!',
      vocab: [
        ['happy birthday', 'phrase', 'יום הולדת שמח', '🎂', 'Happy birthday, Noa!', 'יום הולדת שמח, נועה!'],
        ['how are you', 'phrase', 'מה שלומך?', '🙆', 'Hi, Grandma! How are you today?', 'היי, סבתא! מה שלומך היום?'],
        ['fine', 'adjective', 'בסדר / טוב', '👌', 'I am fine, thank you.', 'אני בסדר, תודה.'],
        ['let\'s go', 'phrase', 'בואו נלך', '🏃', 'Let\'s go to the party!', 'בואו נלך למסיבה!'],
        ['I\'m ready', 'phrase', 'אני מוכן/ה', '🏃‍♀️', 'I\'m ready! Let\'s play.', 'אני מוכן/ה! בואו נשחק.'],
        ['wait for', 'verb', 'לחכות ל...', '🕓', 'We wait for the bus.', 'אנחנו מחכים לאוטובוס.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'swim', translationHe: 'לשחות' },
          { wordEn: 'rain', translationHe: 'גשם' },
        ],
        shortSentenceEn: 'How are you, Dan?',
        shortSentenceHe: 'מה שלומך, דן?',
        rule: {
          questionEn: 'Your friend says, Thank you! What do you say?',
          correct: 'You\'re welcome!',
          wrong: ['Excuse me!', 'Happy birthday!'],
          explainHe: 'כשמישהו אומר thank you, עונים You\'re welcome (בבקשה, אין בעד מה).',
          hintHe: 'מה עונים למי שאומר תודה?',
        },
        story: {
          passageEn:
            'It is Noa\'s birthday. Her friends say, Happy birthday, Noa! Noa says, Thank you! Then Grandma comes. Noa asks, How are you, Grandma? Grandma says, I am fine.',
          passageHe:
            'זה יום ההולדת של נועה. החברים שלה אומרים: יום הולדת שמח, נועה! נועה אומרת: תודה! אחר כך סבתא באה. נועה שואלת: מה שלומך, סבתא? סבתא אומרת: אני בסדר.',
          questionEn: 'Who comes to the party?',
          questionHe: 'מי בא למסיבה?',
          correct: 'Grandma',
          wrong: ['Dad', 'the teacher'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'What do you say to a friend on a birthday?',
              correct: 'Happy birthday!',
              wrong: ['Good night!'],
              explainHe: 'ביום הולדת אומרים Happy birthday (יום הולדת שמח).',
              hintHe: 'מה אומרים לחברים ביום ההולדת?',
            },
            story: {
              passageEn: 'We wait for Dan. Here he is! Dan says, I\'m ready. Let\'s go!',
              passageHe: 'אנחנו מחכים לדן. הנה הוא! דן אומר: אני מוכן. בואו נלך!',
              questionEn: 'Who do we wait for?',
              questionHe: 'למי אנחנו מחכים?',
              correct: 'Dan',
              wrong: ['Mom'],
            },
          },
          challenger: {
            clozeWrong: [
              ['red table', 'big egg'],
              ['a yellow bus', 'the green door'],
              ['table', 'ball'],
              ['red cat', 'big egg'],
              ['blue bag', 'green pen'],
              ['happy', 'green'],
            ],
          },
          master: {
            sentenceEn: 'Can I have some cake, please?',
            sentenceHe: 'אפשר לקבל קצת עוגה, בבקשה?',
            decoys: ['has', 'cakes'],
            voiceEn: 'Happy birthday, Grandpa!',
            voiceHe: 'יום הולדת שמח, סבא!',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'Can I have some milk, please?',
              wrong: ['Can I has some milk, please?', 'Can have I some milk, please?', 'I can have some milk, please?'],
              explainHe: 'בקשה מנומסת: Can I have …, please? קודם Can, אחר כך I, ואז have.',
              hintEn: 'Check the order of can, I and have.',
            },
            story: {
              passageEn:
                'Ben is at Noa\'s party. He wants some juice, but the juice is on a high table. Ben asks Noa\'s dad, Excuse me, can I have some juice, please? Noa\'s dad gives Ben a cup of juice. Ben says, Thank you!',
              passageHe: '',
              questionEn: 'Why does Ben ask Noa\'s dad?',
              questionHe: '',
              correct: 'He can\'t get the juice.',
              wrong: ['He does not like juice.', 'He wants a big cake.', 'He is lost at the party.'],
            },
            storyHintEn: 'Where is the juice?',
          },
        },
      },
    },
  ],
};

/** The core-3 pack\'s grade 2 unit (`../../registry.ts`) */
export const CORE_3_GRADE_2_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-2', [UNIT_CORE_3]);
