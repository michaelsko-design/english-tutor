import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The holidays pack's grade 2 units: autumn–winter and spring–summer holidays. Playable from the
 * first day, so it only uses grade 1's structures and grade 2's units 1–2: I have, What is this?
 * It is a…, I like / We like, This is my…, a / an and plural s.
 */
const UNITS: ElementaryUnitSpec[] = [
  {
    ...packUnitNumbers('holidays', 0),
    titleEn: 'Holidays in Autumn & Winter',
    titleHe: 'חגים בסתיו ובחורף',
    subtitleHe: 'ראש השנה, סוכות, חנוכה והגשם הראשון',
    badgeEmoji: '🌧️',
    missions: [
      {
        icon: '💌',
        titleEn: 'Honey Cake for Rosh Hashana',
        titleHe: 'עוגת דבש לראש השנה',
        storyHookHe: 'סבתא אופה עוגת דבש לראש השנה! בואו נלמד מילים מתוקות ונאחל Happy New Year.',
        grammarTopic: 'Holiday Food & "We like"',
        skills: ['Holiday Words', 'We like', 'a / an'],
        sentenceEn: 'We like honey cake on Rosh Hashana.',
        sentenceHe: 'אנחנו אוהבים עוגת דבש בראש השנה.',
        vocab: [
          ['honey', 'noun', 'דבש', '🍯', 'Bees make sweet honey.', 'דבורים מכינות דבש מתוק.'],
          ['cake', 'noun', 'עוגה', '🍰', 'Grandma bakes a cake.', 'סבתא אופה עוגה.'],
          ['sweet', 'adjective', 'מתוק / מתוקה', '🍬', 'The apple is sweet.', 'התפוח מתוק.'],
          ['year', 'noun', 'שנה', '🗓️', 'A new year begins.', 'שנה חדשה מתחילה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'carrot', translationHe: 'גזר' },
            { wordEn: 'milk', translationHe: 'חלב' },
          ],
          shortSentenceEn: 'We like honey.',
          shortSentenceHe: 'אנחנו אוהבים דבש.',
          rule: {
            questionEn: 'Which one is correct?',
            correct: 'an apple with honey',
            wrong: ['a apple with honey', 'an apples with honey'],
            explainHe: 'לפני מילה שמתחילה בתנועה (a, e, i, o, u) אומרים an: an apple. ויש תפוח אחד, בלי s.',
            hintHe: 'האם המילה apple מתחילה בתנועה? וכמה תפוחים יש, אחד או יותר?',
          },
          story: {
            passageEn: 'It is Rosh Hashana. Grandma has a honey cake. I have an apple with honey. We say: Happy New Year!',
            passageHe: 'ראש השנה. לסבתא יש עוגת דבש. לי יש תפוח עם דבש. אנחנו אומרים: שנה טובה!',
            questionEn: 'What does Grandma have?',
            questionHe: 'מה יש לסבתא?',
            correct: 'a honey cake',
            wrong: ['an apple', 'a carrot'],
          },
        },
      },
      {
        icon: '🌴',
        titleEn: 'This Is My Sukkah',
        titleHe: 'זו הסוכה שלי',
        storyHookHe: 'בנינו סוכה בחצר! בואו נראה לחברים: This is my sukkah. בלילה רואים כוכבים דרך הגג.',
        grammarTopic: 'Sukkot Words & "This is my..."',
        skills: ['Holiday Words', 'This is my...', 'Plural s'],
        sentenceEn: 'This is my sukkah, and I see stars at night.',
        sentenceHe: 'זו הסוכה שלי, ובלילה אני רואה כוכבים.',
        vocab: [
          ['sukkah', 'noun', 'סוכה', '🛖', 'My family eats in the sukkah.', 'המשפחה שלי אוכלת בסוכה.'],
          ['palm', 'noun', 'דקל', '🌴', 'We put palm leaves on the roof.', 'שמים עלי דקל על הגג.'],
          ['chain', 'noun', 'שרשרת', '🔗', 'My sister makes a paper chain.', 'אחותי מכינה שרשרת נייר.'],
          ['star', 'noun', 'כוכב', '⭐', 'I see a star in the sky.', 'אני רואה כוכב בשמיים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'window', translationHe: 'חלון' },
            { wordEn: 'shirt', translationHe: 'חולצה' },
          ],
          shortSentenceEn: 'This is my sukkah.',
          shortSentenceHe: 'זו הסוכה שלי.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'This is my chain.',
            wrong: ['This are my chain.', 'This my is chain.'],
            explainHe: 'על דבר אחד אומרים This is my …: המילה is מתאימה ליחיד, והסדר הוא This, is, my.',
            hintHe: 'מדברים על דבר אחד: איזה פועל מתאים ליחיד? בדקו גם את הסדר.',
          },
          story: {
            passageEn: 'This is my sukkah. It has a green palm roof. My brother has a blue chain. At night, we see three stars.',
            passageHe: 'זו הסוכה שלי. יש לה גג ירוק מעלי דקל. לאח שלי יש שרשרת כחולה. בלילה אנחנו רואים שלושה כוכבים.',
            questionEn: 'How many stars do we see?',
            questionHe: 'כמה כוכבים אנחנו רואים?',
            correct: 'three',
            wrong: ['one', 'two'],
          },
        },
      },
      {
        icon: '🍩',
        isBoss: true,
        titleEn: 'Boss: Hanukkah in the Rain',
        titleHe: 'אתגר הבוס: חנוכה בגשם',
        storyHookHe: 'בחוץ יורד גשם, ובבית דולקים נרות חנוכה! הראו שאתם זוכרים את כל מילות הסתיו והחורף.',
        grammarTopic: 'Hanukkah, Rain & Review',
        skills: ['Holiday Words', 'I have', 'Review'],
        sentenceEn: 'I have an umbrella, and we have eight candles.',
        sentenceHe: 'יש לי מטרייה, ויש לנו שמונה נרות.',
        vocab: [
          ['candle', 'noun', 'נר', '🕯️', 'The candle is little and bright.', 'הנר קטן ומאיר.'],
          ['donut', 'noun', 'סופגנייה', '🍩', 'The donut is sweet.', 'הסופגנייה מתוקה.'],
          ['rain', 'noun', 'גשם', '🌧️', 'The rain is cold.', 'הגשם קר.'],
          ['umbrella', 'noun', 'מטרייה', '☂️', 'I have a red umbrella.', 'יש לי מטרייה אדומה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'hat', translationHe: 'כובע' },
            { wordEn: 'banana', translationHe: 'בננה' },
          ],
          shortSentenceEn: 'I have an umbrella.',
          shortSentenceHe: 'יש לי מטרייה.',
          rule: {
            questionEn: 'Which one is correct?',
            correct: 'an umbrella',
            wrong: ['a umbrella', 'an umbrellas'],
            explainHe: 'umbrella מתחילה בתנועה u, ולכן אומרים an umbrella. ויש מטרייה אחת, בלי s.',
            hintHe: 'באיזו אות מתחילה המילה? והאם יש מטרייה אחת או הרבה?',
          },
          story: {
            passageEn:
              'It is Hanukkah. The rain is cold, so I have an umbrella. At home, Mom has eight candles. Dad has a plate of donuts. We like Hanukkah!',
            passageHe:
              'חנוכה. הגשם קר, אז יש לי מטרייה. בבית, לאמא יש שמונה נרות. לאבא יש צלחת עם סופגניות. אנחנו אוהבים את חנוכה!',
            questionEn: 'What does Dad have?',
            questionHe: 'מה יש לאבא?',
            correct: 'a plate of donuts',
            wrong: ['an umbrella', 'eight candles'],
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('holidays', 1),
    titleEn: 'Holidays in Spring & Summer',
    titleHe: 'חגים באביב ובקיץ',
    subtitleHe: 'ט״ו בשבט, פורים, פסח, יום העצמאות, שבועות והחופש הגדול',
    badgeEmoji: '🌷',
    missions: [
      {
        icon: '🎭',
        titleEn: 'Plants and Purim Masks',
        titleHe: 'צמחים ומסכות פורים',
        storyHookHe: 'בט״ו בשבט שותלים צמחים, ובפורים מתחפשים! What is this? בואו נגלה.',
        grammarTopic: 'Holiday Words & "What is this? It is a..."',
        skills: ['Holiday Words', 'What is this?', 'It is a...'],
        sentenceEn: 'What is this? It is a costume for Purim.',
        sentenceHe: 'מה זה? זו תחפושת לפורים.',
        vocab: [
          ['costume', 'noun', 'תחפושת', '🦸', 'I have a superhero costume.', 'יש לי תחפושת של גיבור על.'],
          ['mask', 'noun', 'מסכה', '🎭', 'The mask is funny.', 'המסכה מצחיקה.'],
          ['crown', 'noun', 'כתר', '👑', 'The queen has a crown.', 'למלכה יש כתר.'],
          ['plant', 'noun', 'צמח', '🌱', 'The plant needs water.', 'הצמח צריך מים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'socks', translationHe: 'גרביים' },
            { wordEn: 'door', translationHe: 'דלת' },
          ],
          shortSentenceEn: 'It is a mask.',
          shortSentenceHe: 'זו מסכה.',
          rule: {
            questionEn: 'What is this? 👑 Which answer is correct?',
            correct: 'It is a crown.',
            wrong: ['It is crown.', 'Is it a crown.'],
            explainHe: 'עונים It is a crown: קודם It is, ואז a והדבר.',
            hintHe: 'תשובה מתחילה ב-It is. מה צריך לבוא לפני הדבר?',
          },
          story: {
            passageEn: 'It is Purim at school. Noa has a costume. It is a cat costume! Ben has a mask and a crown. He is the king.',
            passageHe: 'פורים בבית הספר. לנועה יש תחפושת. זו תחפושת של חתול! לבן יש מסכה וכתר. הוא המלך.',
            questionEn: 'What costume does Noa have?',
            questionHe: 'איזו תחפושת יש לנועה?',
            correct: 'a cat costume',
            wrong: ['a king costume', 'a mask'],
          },
        },
      },
      {
        icon: '🎆',
        titleEn: 'Matzah and Flags',
        titleHe: 'מצות ודגלים',
        storyHookHe: 'בפסח אוכלים מצה, וביום העצמאות כל הרחוב מלא דגלים! בואו נספור ונגיד מה אנחנו אוהבים.',
        grammarTopic: 'Holiday Words & Plural s',
        skills: ['Holiday Words', 'Plural s', 'We like'],
        sentenceEn: 'We have ten flags for the party.',
        sentenceHe: 'יש לנו עשרה דגלים למסיבה.',
        vocab: [
          ['flag', 'noun', 'דגל', '🇮🇱', 'I wave the flag of Israel.', 'אני מניף/ה את דגל ישראל.'],
          ['matzah', 'noun', 'מצה', '🫓', 'Dad breaks the matzah.', 'אבא שובר את המצה.'],
          ['soup', 'noun', 'מרק', '🍲', 'The soup is hot.', 'המרק חם.'],
          ['party', 'noun', 'מסיבה', '🥳', 'We have a party in the park.', 'יש לנו מסיבה בפארק.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'shoes', translationHe: 'נעליים' },
            { wordEn: 'teddy', translationHe: 'דובי צעצוע' },
          ],
          shortSentenceEn: 'We like the party.',
          shortSentenceHe: 'אנחנו אוהבים את המסיבה.',
          rule: {
            questionEn: 'Which word means more than one flag?',
            correct: 'flags',
            wrong: ['flag', 'a flag'],
            explainHe: 'כשיש יותר מאחד מוסיפים s בסוף המילה: flags. המילים flag ו-a flag מדברות על דגל אחד.',
            hintHe: 'יותר מדגל אחד: מה קורה לסוף המילה כשיש הרבה?',
          },
          story: {
            passageEn:
              'It is Independence Day. Our street has ten flags. The flags are blue and white. We have a party in the park. I like the fireworks!',
            passageHe:
              'יום העצמאות. ברחוב שלנו יש עשרה דגלים. הדגלים כחולים ולבנים. יש לנו מסיבה בפארק. אני אוהב/ת את הזיקוקים!',
            questionEn: 'What colors are the flags?',
            questionHe: 'באילו צבעים הדגלים?',
            correct: 'blue and white',
            wrong: ['red and green', 'yellow and pink'],
          },
        },
      },
      {
        icon: '🏖️',
        isBoss: true,
        titleEn: 'Boss: Cheese, Sun and Sea',
        titleHe: 'אתגר הבוס: גבינה, שמש וים',
        storyHookHe: 'בשבועות אוכלים גבינה, ואז מתחיל החופש הגדול! הראו שאתם זוכרים את כל מילות החגים.',
        grammarTopic: 'Shavuot, Summer & Review',
        skills: ['Holiday Words', 'I like', 'Review'],
        sentenceEn: 'In summer we like the beach and the pool.',
        sentenceHe: 'בקיץ אנחנו אוהבים את חוף הים ואת הבריכה.',
        vocab: [
          ['cheese', 'noun', 'גבינה', '🧀', 'I like cheese on bread.', 'אני אוהב/ת גבינה על לחם.'],
          ['beach', 'noun', 'חוף ים', '🏖️', 'The beach is hot in summer.', 'חוף הים חם בקיץ.'],
          ['shell', 'noun', 'צדף', '🐚', 'This shell is white and pink.', 'הצדף הזה לבן וורוד.'],
          ['pool', 'noun', 'בריכה', '🏊', 'We swim in the pool.', 'אנחנו שוחים בבריכה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'chair', translationHe: 'כיסא' },
            { wordEn: 'bed', translationHe: 'מיטה' },
          ],
          shortSentenceEn: 'I like the pool.',
          shortSentenceHe: 'אני אוהב/ת את הבריכה.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'I have two shells.',
            wrong: ['I have two shell.', 'I have shells two.'],
            explainHe: 'יותר מצדף אחד: shells עם s, והמספר בא לפני.',
            hintHe: 'כמה צדפים יש? בדקו את סוף המילה ואת מקום המספר.',
          },
          story: {
            passageEn:
              'It is Shavuot. We have cheese and milk. Then summer is here! My family goes to the beach. I find a pink shell. My brother likes the pool.',
            passageHe:
              'שבועות. יש לנו גבינה וחלב. ואז מגיע הקיץ! המשפחה שלי נוסעת לחוף הים. אני מוצא/ת צדף ורוד. אח שלי אוהב את הבריכה.',
            questionEn: 'What does my brother like?',
            questionHe: 'מה אח שלי אוהב?',
            correct: 'the pool',
            wrong: ['the beach', 'the shell'],
          },
        },
      },
    ],
  },
];

export const HOLIDAYS_GRADE_2_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-2', UNITS);
