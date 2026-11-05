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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'We like red apples.',
                wrong: ['We likes red apples.'],
                explainHe: 'עם We אומרים like, בלי s.',
                hintHe: 'איזה פועל מתאים ל-We?',
              },
              story: {
                passageEn: 'Grandma has a cake. The cake is sweet. It has honey on top.',
                passageHe: 'לסבתא יש עוגה. העוגה מתוקה. יש עליה דבש.',
                questionEn: 'What is on the cake?',
                questionHe: 'מה יש על העוגה?',
                correct: 'honey',
                wrong: ['milk'],
              },
            },
            challenger: {
              clozeWrong: [
                ['milk', 'soup'],
                ['door', 'chair'],
                ['two', 'many'],
                ['shoe', 'sock'],
              ],
            },
            master: {
              sentenceEn: 'Grandma makes a sweet cake for us.',
              sentenceHe: 'סבתא מכינה לנו עוגה מתוקה.',
              decoys: ['make', 'cakes'],
              voiceEn: 'We say happy new year.',
              voiceHe: 'אנחנו אומרים שנה טובה.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'We like sweet honey cake.',
                wrong: [
                  'We likes sweet honey cake.',
                  'We like sweet honey a cake.',
                  'We like honey sweet cake.',
                ],
                explainHe: 'עם We אומרים like, בלי s. מילה שמתארת באה לפני שם הדבר.',
                hintEn: 'Check like and the order of the words.',
              },
              story: {
                passageEn: 
                  'It is the night of Rosh Hashana. Grandma puts a plate on the table. On the plate there are red apples and a small bowl. Everyone dips a piece of apple in the bowl and says, Happy new year! The bowl has something yellow and sweet.',
                passageHe: '',
                questionEn: 'What is in the bowl?',
                questionHe: '',
                correct: 'honey',
                wrong: ['milk', 'soup', 'rice'],
              },
              storyHintEn: 'What is yellow and sweet, with apples?',
            },
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
          ['palm', 'noun', 'דקל', '🌴', 'We put palm leaves on the roof.', 'אנחנו שמים עלי דקל על הגג.'],
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'This is my star.',
                wrong: ['This are my star.'],
                explainHe: 'על דבר אחד אומרים This is my ...: is מתאים ליחיד.',
                hintHe: 'דבר אחד: איזה פועל מתאים?',
              },
              story: {
                passageEn: 'This is my sukkah. It is small. I have a chain in the sukkah.',
                passageHe: 'זו הסוכה שלי. היא קטנה. יש לי שרשרת בסוכה.',
                questionEn: 'What is small?',
                questionHe: 'מה קטן?',
                correct: 'the sukkah',
                wrong: ['the chain'],
              },
            },
            challenger: {
              clozeWrong: [
                ['soup', 'shirt'],
                ['rain', 'milk'],
                ['milk', 'rain'],
                ['sock', 'shoe'],
              ],
            },
            master: {
              sentenceEn: 'We put a paper star in the sukkah.',
              sentenceHe: 'אנחנו שמים כוכב מנייר בסוכה.',
              decoys: ['puts', 'stars'],
              voiceEn: 'We sit in the sukkah at night.',
              voiceHe: 'אנחנו יושבים בסוכה בלילה.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'This is my gold chain.',
                wrong: ['This are my gold chain.', 'This is my gold chains.', 'This my is gold chain.'],
                explainHe: 'על דבר אחד: This is my ... עם is ו-my בסדר הזה, ושם הדבר ביחיד.',
                hintEn: 'Check is, the order of my and is, and the end of chain.',
              },
              story: {
                passageEn: 
                  'Tom and his dad build a sukkah. Dad puts palm leaves on top. At night Tom lies down and looks up. He cannot see the roof, but he sees many small lights in the sky.',
                passageHe: '',
                questionEn: 'What does Tom see?',
                questionHe: '',
                correct: 'stars',
                wrong: ['candles', 'balloons', 'kites'],
              },
              storyHintEn: 'What small lights are in the night sky?',
            },
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'I have a donut.',
                wrong: ['I have an donut.'],
                explainHe: 'donut מתחילה בעיצור d ולכן אומרים a donut.',
                hintHe: 'האם d היא תנועה?',
              },
              story: {
                passageEn: 'The rain is cold. I have an umbrella. It is yellow.',
                passageHe: 'הגשם קר. יש לי מטרייה. היא צהובה.',
                questionEn: 'What is yellow?',
                questionHe: 'מה צהוב?',
                correct: 'the umbrella',
                wrong: ['the rain'],
              },
            },
            challenger: {
              clozeWrong: [
                ['milk', 'rain'],
                ['chair', 'door'],
                ['song', 'game'],
                ['rain', 'milk'],
              ],
            },
            master: {
              sentenceEn: 'Mom lights eight candles and we eat donuts.',
              sentenceHe: 'אמא מדליקה שמונה נרות ואנחנו אוכלים סופגניות.',
              decoys: ['light', 'umbrella'],
              voiceEn: 'I like donuts with my family.',
              voiceHe: 'אני אוהב/ת סופגניות עם המשפחה שלי.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'We have a big umbrella.',
                wrong: ['We have a big umbrellas.', 'We has a big umbrella.', 'We have an big umbrella.'],
                explainHe: 'עם We אומרים have. לפני big אומרים a, ו-umbrella ביחיד.',
                hintEn: 'Check have, a or an, and the end of umbrella.',
              },
              story: {
                passageEn: 
                  'It is a cold night and the rain falls on the window. The room is dark. Dad takes a match and goes to the table. Soon eight small lights shine in the room. We sing and eat sweet donuts.',
                passageHe: '',
                questionEn: 'What are the small lights?',
                questionHe: '',
                correct: 'candles',
                wrong: ['stars', 'balloons', 'donuts'],
              },
              storyHintEn: 'What does Dad light with a match?',
            },
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which answer is right?',
                correct: 'It is a plant.',
                wrong: ['It is plant.'],
                explainHe: 'אחרי It is אומרים a לפני הדבר.',
                hintHe: 'מה צריך לבוא לפני plant?',
              },
              story: {
                passageEn: 'Ben has a mask. The mask is green. It has a big nose.',
                passageHe: 'לבן יש מסכה. המסכה ירוקה. יש לה אף גדול.',
                questionEn: 'What does the mask have?',
                questionHe: 'מה יש למסכה?',
                correct: 'a big nose',
                wrong: ['a red hat'],
              },
            },
            challenger: {
              clozeWrong: [
                ['rain', 'milk'],
                ['rain', 'milk'],
                ['rain', 'milk'],
                ['door', 'sock'],
              ],
            },
            master: {
              sentenceEn: 'The king wears a gold crown and a mask.',
              sentenceHe: 'המלך חובש כתר זהב ומסכה.',
              decoys: ['wear', 'crowns'],
              voiceEn: 'I am a cat for Purim.',
              voiceHe: 'אני חתול/ה בפורים.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'It is a funny mask.',
                wrong: ['It is funny a mask.', 'It a is funny mask.', 'It are a funny mask.'],
                explainHe: 'It is a ...: קודם It is, אחר כך a, ואז המילה המתארת והדבר.',
                hintEn: 'Check is, a, and the word order.',
              },
              story: {
                passageEn: 
                  'Noa has a party at school tomorrow. Today she opens a big box. Inside are a long blue dress and a gold crown. Noa puts them on and smiles.',
                passageHe: '',
                questionEn: 'Why does Noa put on the dress and the crown?',
                questionHe: '',
                correct: 'It is a costume for the party.',
                wrong: ['She is cold.', 'It is raining.', 'Her sister is a queen.'],
              },
              storyHintEn: 'Think about the party at school.',
            },
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which one is right?',
                correct: 'three flags',
                wrong: ['three flag'],
                explainHe: 'אחרי מספר גדול מאחד מוסיפים s.',
                hintHe: 'כמה דגלים? מה קורה לסוף המילה?',
              },
              story: {
                passageEn: 'We have a party. Mom makes soup. The soup is hot.',
                passageHe: 'יש לנו מסיבה. אמא מכינה מרק. המרק חם.',
                questionEn: 'What is hot?',
                questionHe: 'מה חם?',
                correct: 'the soup',
                wrong: ['the party'],
              },
            },
            challenger: {
              clozeWrong: [
                ['door', 'soup'],
                ['milk', 'rain'],
                ['ice', 'snow'],
                ['rain', 'sky'],
              ],
            },
            master: {
              sentenceEn: 'We eat hot soup with matzah at home.',
              sentenceHe: 'אנחנו אוכלים מרק חם עם מצה בבית.',
              decoys: ['eats', 'soups'],
              voiceEn: 'I wave a blue and white flag.',
              voiceHe: 'אני מניף/ה דגל כחול ולבן.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'I see five big flags.',
                wrong: ['I see five big flag.', 'I sees five big flags.', 'I see big five flags.'],
                explainHe: 'עם I אומרים see בלי s. אחרי five מוסיפים s: flags. והמספר בא לפני התיאור.',
                hintEn: 'Check see, the number place, and the end of flag.',
              },
              story: {
                passageEn: 
                  'Today is a big day. The street is full of blue and white flags. Many families sit in the park. At night there are loud lights in the sky. Children say, Wow!',
                passageHe: '',
                questionEn: 'What do people see in the sky at night?',
                questionHe: '',
                correct: 'fireworks',
                wrong: ['paper balloons', 'little kites', 'big airplanes'],
              },
              storyHintEn: 'What loud lights fly up on a big day?',
            },
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'I like cheese.',
                wrong: ['I likes cheese.'],
                explainHe: 'עם I אומרים like, בלי s.',
                hintHe: 'איזה פועל מתאים ל-I?',
              },
              story: {
                passageEn: 'We go to the beach. I find a shell. The shell is white.',
                passageHe: 'אנחנו הולכים לחוף הים. אני מוצא/ת צדף. הצדף לבן.',
                questionEn: 'What do I find?',
                questionHe: 'מה אני מוצא/ת?',
                correct: 'a shell',
                wrong: ['a crab'],
              },
            },
            challenger: {
              clozeWrong: [
                ['rain', 'sand'],
                ['ice', 'snow'],
                ['rain', 'song'],
                ['cheese', 'bread'],
              ],
            },
            master: {
              sentenceEn: 'We eat cheese and swim in the pool.',
              sentenceHe: 'אנחנו אוכלים גבינה ושוחים בבריכה.',
              decoys: ['eats', 'beach'],
              voiceEn: 'We play on the beach today.',
              voiceHe: 'אנחנו משחקים היום בחוף.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'My sister finds two shells.',
                wrong: [
                  'My sister find two shells.',
                  'My sister finds two shell.',
                  'My sisters finds two shells.',
                ],
                explainHe: 'אחות אחת: finds עם s. אחרי two מוסיפים s: shells.',
                hintEn: 'Check the end of find and the end of shell.',
              },
              story: {
                passageEn: 
                  'It is hot in summer. Dan puts on his swim shorts and takes a towel. He runs to a square place with blue water. There is no sand. He jumps in with a big splash.',
                passageHe: '',
                questionEn: 'Where does Dan go?',
                questionHe: '',
                correct: 'to the pool',
                wrong: ['to the beach', 'to the park', 'to school'],
              },
              storyHintEn: 'Which place has water, but no sand?',
            },
          },
        },
      },
    ],
  },
];

export const HOLIDAYS_GRADE_2_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-2', UNITS);
