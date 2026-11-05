import { buildMiddleSchoolGrade, type MiddleSchoolUnitSpec } from '../../../middleSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * Grade 9 holidays pack: open from the first day of the grade, so it reviews grade 8's grammar
 * (Past Continuous, will / going to, First Conditional) and grade 9's units 1–2 (Present Perfect
 * with since / for, Second Conditional, contrast connectors) with new holiday words.
 */
const UNITS: MiddleSchoolUnitSpec[] = [
  {
    ...packUnitNumbers('holidays', 0),
    titleEn: 'Autumn Holidays & Winter Rain',
    titleHe: 'חגי הסתיו וגשמי החורף',
    subtitleHe: 'ראש השנה, סוכות, חנוכה והחורף הישראלי — חזרה על Present Perfect, Past Continuous ומילות ניגוד',
    badgeEmoji: '🍎',
    missions: [
      {
        icon: '🍎',
        titleEn: 'A Sweet New Year: Resolutions',
        titleHe: 'שנה טובה ומתוקה: החלטות לשנה החדשה',
        storyHookHe:
          'ראש השנה מגיע! מה כבר השגנו מאז ראש השנה הקודם, ומה אנחנו הולכים לעשות השנה? נחזור על Present Perfect עם since ועל be going to.',
        grammarTopic: 'Present Perfect with Since & Be Going To for New-Year Plans',
        skills: ['Present Perfect', 'Future Plans', 'Holiday Vocab'],
        sentenceEn: 'Since last Rosh Hashana, I have read twelve books, and this year I am going to read more.',
        sentenceHe: 'מאז ראש השנה שעבר קראתי שנים עשר ספרים, והשנה אני הולך/ת לקרוא עוד.',
        vocab: [
          ['resolution', 'noun', 'החלטה (לשנה החדשה)', '📝', 'My resolution is to go to bed before midnight.', 'ההחלטה שלי היא ללכת לישון לפני חצות.'],
          ['pomegranate', 'noun', 'רימון', '🔴', 'Pomegranates are full of small red seeds.', 'רימונים מלאים בגרעינים אדומים קטנים.'],
          ['greeting', 'noun', 'ברכה', '💌', 'We sent holiday greetings to our relatives in Canada.', 'שלחנו ברכות לחג לקרובי המשפחה שלנו בקנדה.'],
          ['reflect', 'verb', 'להרהר / לחשוב לעומק', '🪞', 'The new year is a good time to reflect on the past.', 'השנה החדשה היא זמן טוב להרהר בעבר.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'engine', translationHe: 'מנוע' },
            { wordEn: 'passport', translationHe: 'דרכון' },
          ],
          shortSentenceEn: 'I am going to read more.',
          shortSentenceHe: 'אני הולך/ת לקרוא יותר.',
          rule: {
            questionEn: 'Complete the sentence: "We _______ in this neighbourhood since last Rosh Hashana."',
            correct: 'have lived',
            wrong: ['live', 'are living'],
            explainHe: 'כשמשהו התחיל בעבר ונמשך עד עכשיו (since last Rosh Hashana) משתמשים ב-Present Perfect: have lived.',
            hintHe: 'המשפט מספר על משהו שהתחיל בעבר ועדיין נמשך. איזה זמן מחבר עבר להווה?',
          },
          story: {
            passageEn:
              'Every year, Noam’s class writes resolutions on paper apples before Rosh Hashana. This year, the teacher hung last year’s paper apples on the wall first. Noam laughed when he read his old note: "I will stop eating sweets." Since then, he has eaten a lot of honey cake! This time, he is going to choose a resolution he can really keep.',
            passageHe:
              'בכל שנה, הכיתה של נעם כותבת החלטות על תפוחי נייר לפני ראש השנה. השנה, המורה תלתה קודם על הקיר את תפוחי הנייר של השנה שעברה. נעם צחק כשקרא את הפתק הישן שלו: "אני אפסיק לאכול ממתקים." מאז הוא אכל המון עוגת דבש! הפעם הוא הולך לבחור החלטה שהוא באמת יכול לקיים.',
            questionEn: 'What did the teacher hang on the wall?',
            questionHe: 'מה המורה תלתה על הקיר?',
            correct: 'Last year’s paper apples.',
            wrong: ['Pictures of honey cake.', 'A calendar for the new year.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'We have lived here for two years.',
                wrong: ['We has lived here for two years.'],
                explainHe: 'עם We משתמשים ב-have: We have lived.',
                hintHe: 'We הוא רבים. איזה פועל עזר מתאים?',
              },
              story: {
                passageEn: 
                  'Rina ate a pomegranate. It was sweet and red. She has loved it since she was little.',
                passageHe: 'רינה אכלה רימון. הוא היה מתוק ואדום. היא אוהבת אותו מאז שהייתה קטנה.',
                questionEn: 'What colour was the pomegranate?',
                questionHe: 'באיזה צבע היה הרימון?',
                correct: 'Red.',
                wrong: ['Green.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['alarm', 'blanket'],
                ['banana', 'peach'],
                ['diet', 'allergy'],
                ['walk', 'dance'],
              ],
            },
            master: {
              sentenceEn: 'Since summer I have saved money and I am going to buy gifts.',
              sentenceHe: 'מאז הקיץ חסכתי כסף ואני הולך/ת לקנות מתנות.',
              decoys: ['has', 'buying'],
              voiceEn: 'I am going to write a greeting card.',
              voiceHe: 'אני הולך/ת לכתוב כרטיס ברכה.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'We have celebrated Rosh Hashana with my grandparents since I was a baby.',
                wrong: [
                  'We have celebrated Rosh Hashana with my grandparents since when I was a baby.',
                  'We has celebrated Rosh Hashana with my grandparents since I was a baby.',
                  'We have celebrate Rosh Hashana with my grandparents since I was a baby.',
                ],
                explainHe: 
                  'since בא עם נקודת התחלה (since I was a baby), ו-Present Perfect = have / has + V3. עם We נשתמש ב-have.',
                hintEn: 'Check the helping verb, the verb form and the time word.',
              },
              story: {
                passageEn: 
                  'On the evening before Rosh Hashana, Ofir looked at his list from last year. He had promised to call his grandmother every week, but he had called only twice. This time, he did not write a long list. He wrote one sentence on a card, put it next to his phone, and set a reminder for every Friday afternoon.',
                passageHe: '',
                questionEn: 'Why did Ofir write only one sentence this year?',
                questionHe: '',
                correct: 'He wanted a goal that he could really keep.',
                wrong: [
                  'He had no time to write more.',
                  'His grandmother asked him to stop calling so often.',
                  'He forgot what he had promised.',
                ],
              },
              storyHintEn: 'Think about the list from last year.',
            },
          },
        },
      },
      {
        icon: '🌿',
        titleEn: 'Building the Sukkah in the First Rain',
        titleHe: 'בונים סוכה בגשם הראשון',
        storyHookHe:
          'הסוכה כמעט מוכנה... ואז מתחיל לרדת גשם! נחזור על Past Continuous עם when ו-while כדי לספר מה קרה באמצע הקישוטים.',
        grammarTopic: 'Past Continuous with When & While (Review)',
        skills: ['Past Continuous', 'Storytelling', 'Sukkot Vocab'],
        sentenceEn: 'We were hanging decorations in the sukkah when the first rain of the year began.',
        sentenceHe: 'תלינו קישוטים בסוכה כשהגשם הראשון של השנה התחיל.',
        vocab: [
          ['decorate', 'verb', 'לקשט', '🎨', 'The children decorate the sukkah with colourful paper chains.', 'הילדים מקשטים את הסוכה בשרשראות נייר צבעוניות.'],
          ['harvest', 'noun / verb', 'אסיף / קציר; לקצור', '🌾', 'Sukkot marks the end of the harvest.', 'סוכות מציין את סוף האסיף.'],
          ['temporary', 'adjective', 'זמני / זמנית', '⏳', 'A sukkah is a temporary home for one week.', 'סוכה היא בית זמני לשבוע אחד.'],
          ['shelter', 'noun', 'מחסה', '⛺', 'The sukkah gave us shelter from the hot sun.', 'הסוכה נתנה לנו מחסה מהשמש החמה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'ambulance', translationHe: 'אמבולנס' },
            { wordEn: 'helmet', translationHe: 'קסדה' },
          ],
          shortSentenceEn: 'It was raining outside.',
          shortSentenceHe: 'ירד גשם בחוץ.',
          rule: {
            questionEn: 'Complete the sentence: "While Dad _______ the roof, my sister handed him the palm branches."',
            correct: 'was fixing',
            wrong: ['fixed was', 'has fixing'],
            explainHe: 'אחרי while מתארים פעולה שנמשכה באותו זמן, ולכן Past Continuous: was + V-ing.',
            hintHe: 'while מתאר פעולה שנמשכה ברקע. איזו תבנית בנויה מ-was ופועל עם ing בסדר הנכון?',
          },
          story: {
            passageEn:
              'On the first evening of Sukkot, the Levi family was eating dinner in their sukkah. Suddenly, a strong wind began to blow. While Grandpa was holding the table, the children were catching the falling decorations. In the end, everyone ran inside and finished the meal in the living room.',
            passageHe:
              'בערב הראשון של סוכות, משפחת לוי אכלה ארוחת ערב בסוכה שלה. פתאום התחילה לנשוב רוח חזקה. בזמן שסבא החזיק את השולחן, הילדים תפסו את הקישוטים שנפלו. בסוף כולם רצו פנימה וסיימו את הארוחה בסלון.',
            questionEn: 'Where did the family finish the meal?',
            questionHe: 'איפה המשפחה סיימה את הארוחה?',
            correct: 'In the living room.',
            wrong: ['In the sukkah.', 'At the neighbours’ house.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'I was drawing when you called.',
                wrong: ['I were drawing when you called.'],
                explainHe: 'עם I משתמשים ב-was בעבר המתמשך: I was drawing.',
                hintHe: 'I הוא יחיד. איזו צורת עבר של be מתאימה?',
              },
              story: {
                passageEn: 'It was raining. Dad was fixing the sukkah. The kids were holding the roof.',
                passageHe: 'ירד גשם. אבא תיקן את הסוכה. הילדים החזיקו את הגג.',
                questionEn: 'What was Dad doing?',
                questionHe: 'מה אבא עשה?',
                correct: 'Fixing the sukkah.',
                wrong: ['Eating dinner.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['sweep', 'repair'],
                ['winter', 'exam'],
                ['permanent', 'lifelong'],
                ['decoration', 'silence'],
              ],
            },
            master: {
              sentenceEn: 
                'While the children were cutting paper stars their father was carrying the heavy table.',
              sentenceHe: 'בזמן שהילדים גזרו כוכבי נייר אביהם סחב את השולחן הכבד.',
              decoys: ['cut', 'is'],
              voiceEn: 'We were eating when it started to rain.',
              voiceHe: 'אכלנו כשהתחיל לרדת גשם.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'My sister was painting a banner while I was cutting the branches.',
                wrong: [
                  'My sister were painting a banner while I was cutting the branches.',
                  'My sister was paint a banner while I was cutting the branches.',
                  'My sister was painting a banner while I were cutting the branches.',
                ],
                explainHe: 
                  'Past Continuous: was / were + V-ing. עם I ועם My sister (יחיד) משתמשים ב-was, ואחריו פועל עם ing.',
                hintEn: 'Check each helping verb and each verb ending.',
              },
              story: {
                passageEn: 
                  'The first rain of the year arrived suddenly while the Levy family was still hanging paper chains. Father tried to cover the roof with a plastic sheet, but the wind kept lifting it. Mother ran to bring towels, and the children saved the lanterns from the puddles. Later, they all sat inside, wet and laughing, and agreed that this was the most memorable Sukkot ever.',
                passageHe: '',
                questionEn: 'Why did the family remember this Sukkot?',
                questionHe: '',
                correct: 'The sudden storm became a funny shared adventure.',
                wrong: [
                  'Nobody helped to build the sukkah.',
                  'They finished decorating long before the storm began.',
                  'The rain stopped as soon as it began.',
                ],
              },
              storyHintEn: 'How did they feel at the end?',
            },
          },
        },
      },
      {
        icon: '🕯️',
        isBoss: true,
        titleEn: 'Boss: Hanukkah Lights on a Rainy Night',
        titleHe: 'אתגר הבוס: אורות חנוכה בלילה גשום',
        storyHookHe:
          'אתגר בוס לפרק! חנוכה, גשם וחורף: נשלב Present Perfect, Past Continuous, תנאי ראשון ומילות ניגוד כמו although ו-however.',
        grammarTopic: 'Review: Contrast Connectors, First Conditional & Holiday Tenses',
        skills: ['Boss Challenge', 'Although / However', 'Winter Vocab'],
        sentenceEn: 'Although it was pouring outside, the whole family gathered by the window to light the candles.',
        sentenceHe: 'למרות שירד גשם חזק בחוץ, כל המשפחה התאספה ליד החלון כדי להדליק את הנרות.',
        vocab: [
          ['miracle', 'noun', 'נס', '✨', 'Hanukkah tells the story of a small jar of oil and a great miracle.', 'חנוכה מספר את הסיפור של פך שמן קטן ונס גדול.'],
          ['gather', 'verb', 'להתאסף / לאסוף', '👪', 'Friends gather every evening to eat warm doughnuts.', 'חברים מתאספים בכל ערב כדי לאכול סופגניות חמות.'],
          ['flame', 'noun', 'להבה', '🔥', 'The small flame danced in the cold wind.', 'הלהבה הקטנה רקדה ברוח הקרה.'],
          ['downpour', 'noun', 'גשם זלעפות', '🌧️', 'The downpour flooded the streets of Haifa.', 'גשם הזלעפות הציף את הרחובות של חיפה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'skeleton', translationHe: 'שלד' },
            { wordEn: 'library', translationHe: 'ספרייה' },
          ],
          shortSentenceEn: 'We lit the candles.',
          shortSentenceHe: 'הדלקנו את הנרות.',
          rule: {
            questionEn: 'Choose the correct connector: "It was freezing outside. _______, we ate our doughnuts in the garden."',
            correct: 'However',
            wrong: ['Because', 'Although'],
            explainHe:
              'However (עם זאת) מחבר שני משפטים נפרדים שיש ביניהם ניגוד, ובא בתחילת המשפט השני עם פסיק. although מחבר שני חלקים בתוך אותו משפט.',
            hintHe: 'יש כאן שני משפטים נפרדים עם ניגוד ביניהם. איזו מילה פותחת משפט חדש ובאה עם פסיק?',
          },
          story: {
            passageEn:
              'In December, the rain finally came to the Galilee. On the fourth night of Hanukkah, a storm knocked out the electricity in Hila’s village. However, the families did not sit in the dark. Neighbours gathered in the community hall, lit their candles together and sang holiday songs. If the rain continues tomorrow, they will meet there again.',
            passageHe:
              'בדצמבר הגשם הגיע סוף סוף לגליל. בלילה הרביעי של חנוכה, סערה גרמה להפסקת חשמל בכפר של הילה. עם זאת, המשפחות לא ישבו בחושך. השכנים התאספו באולם הקהילתי, הדליקו יחד את הנרות ושרו שירי חג. אם הגשם יימשך מחר, הם ייפגשו שם שוב.',
            questionEn: 'Where did the neighbours gather?',
            questionHe: 'איפה התאספו השכנים?',
            correct: 'In the community hall.',
            wrong: ['In the school gym.', 'At Hila’s house.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'Although it was cold, we went outside.',
                wrong: ['Although it was cold, but we went outside.'],
                explainHe: 'אחרי Although לא מוסיפים but. המשפט כבר מביע ניגוד.',
                hintHe: 'כבר יש מילת ניגוד אחת במשפט. האם צריך עוד אחת?',
              },
              story: {
                passageEn: 
                  'It was a rainy night. The family lit the candles. The flames were small but bright.',
                passageHe: 'זה היה לילה גשום. המשפחה הדליקה את הנרות. הלהבות היו קטנות אבל בוהקות.',
                questionEn: 'How were the flames?',
                questionHe: 'איך היו הלהבות?',
                correct: 'Small but bright.',
                wrong: ['Big and red.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['mistake', 'disaster'],
                ['faint', 'vanish'],
                ['puddle', 'pebble'],
                ['drought', 'heatwave'],
              ],
            },
            master: {
              sentenceEn: 
                'Although the roads were flooded the whole family came to light candles with us.',
              sentenceHe: 'למרות שהכבישים הוצפו כל המשפחה הגיעה להדליק נרות איתנו.',
              decoys: ['but', 'however'],
              voiceEn: 'If it rains we will stay inside.',
              voiceHe: 'אם ירד גשם נישאר בפנים.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Although the power went out, we sang songs by candlelight.',
                wrong: [
                  'Although the power went out, but we sang songs by candlelight.',
                  'Although the power go out, we sang songs by candlelight.',
                  'Although the power went out, we was singing songs by candlelight.',
                ],
                explainHe: 
                  'אחרי Although לא מוסיפים but. וצריך להקפיד על צורות הפועל: went (עבר פשוט) ו-sang.',
                hintEn: 'Check for a double connector and wrong verb forms.',
              },
              story: {
                passageEn: 
                  'During the downpour, the electricity in the village failed, and the families could not use their heaters. Instead of going home, the neighbours carried blankets and hot soup to the community hall. Children played board games by candlelight while the adults shared stories about older winters. Although the night was cold, nobody wanted to leave, and the mayor said that he had never felt so proud of his village.',
                passageHe: '',
                questionEn: 'Why was the mayor proud of the village?',
                questionHe: '',
                correct: 'People supported each other during a difficult night.',
                wrong: [
                  'The heaters worked even without any electricity at all.',
                  'Nobody came to the community hall.',
                  'The storm ended earlier than expected.',
                ],
              },
              storyHintEn: 'Think about how the neighbours acted together.',
            },
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('holidays', 1),
    titleEn: 'Spring Festivals & Summer Days',
    titleHe: 'חגי האביב וימי הקיץ',
    subtitleHe: 'ט״ו בשבט, פורים, פסח, יום העצמאות, שבועות והחופש הגדול — חזרה על תנאי שני, Present Perfect ו-will',
    badgeEmoji: '🌷',
    missions: [
      {
        icon: '🎭',
        titleEn: 'Trees and Costumes: If I Could Be Anyone…',
        titleHe: 'עצים ותחפושות: אילו יכולתי להיות כל דמות...',
        storyHookHe:
          'מט״ו בשבט ועד פורים! נשתמש בתנאי שני כדי לדמיין: אילו יכולתי להתחפש לכל דמות בעולם, למה הייתי מתחפש/ת?',
        grammarTopic: 'Second Conditional for Imaginary Holiday Plans (Review)',
        skills: ['Second Conditional', 'Purim Vocab', 'Tu BiShvat'],
        sentenceEn: 'If I could choose any costume this Purim, I would dress up as an astronaut.',
        sentenceHe: 'אילו יכולתי לבחור כל תחפושת בפורים הזה, הייתי מתחפש/ת לאסטרונאוט.',
        vocab: [
          ['costume', 'noun', 'תחפושת', '🎭', 'It took her two weeks to make the costume.', 'לקח לה שבועיים להכין את התחפושת.'],
          ['disguise', 'noun / verb', 'תחפושת / להתחפש; הסוואה / להסוות', '🕶️', 'Nobody recognised him in his clever disguise.', 'אף אחד לא זיהה אותו בתחפושת המתוחכמת שלו.'],
          ['sapling', 'noun', 'שתיל', '🌱', 'Our class planted ten saplings on Tu BiShvat.', 'הכיתה שלנו שתלה עשרה שתילים בט״ו בשבט.'],
          ['donate', 'verb', 'לתרום', '🎁', 'Many families donate food baskets before Purim.', 'משפחות רבות תורמות סלי מזון לפני פורים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'microscope', translationHe: 'מיקרוסקופ' },
            { wordEn: 'umbrella', translationHe: 'מטרייה' },
          ],
          shortSentenceEn: 'I would dress as a pirate.',
          shortSentenceHe: 'הייתי מתחפש/ת לפיראט.',
          rule: {
            questionEn: 'Which sentence imagines an unreal situation correctly?',
            correct: 'If we lived near the forest, we would plant trees every Tu BiShvat.',
            wrong: [
              'If we live near the forest, we would planted trees every Tu BiShvat.',
              'If we would live near the forest, we plant trees every Tu BiShvat.',
            ],
            explainHe: 'בתנאי שני: אחרי if בא Past Simple (lived), ובחלק התוצאה would ופועל בסיס (plant).',
            hintHe: 'בחלק של if בתנאי שני בא עבר פשוט, ובחלק השני would ואחריו פועל בלי שינוי.',
          },
          story: {
            passageEn:
              'On Tu BiShvat, the eighth graders of Kiryat Gat planted fifty saplings near their school. A month later, the ninth graders organised a Purim party for younger children. They made costumes from recycled boxes. Although the party was simple, the children enjoyed every minute. If the students had more money, they would also hire a magician next year.',
            passageHe:
              'בט״ו בשבט, תלמידי כיתות ח׳ בקריית גת שתלו חמישים שתילים ליד בית הספר. חודש אחר כך, תלמידי כיתות ט׳ ארגנו מסיבת פורים לילדים צעירים. הם הכינו תחפושות מקופסאות ממוחזרות. למרות שהמסיבה הייתה פשוטה, הילדים נהנו מכל רגע. אילו היה לתלמידים יותר כסף, הם היו מזמינים גם קוסם בשנה הבאה.',
            questionEn: 'What did the ninth graders make the costumes from?',
            questionHe: 'ממה הכינו תלמידי כיתות ט׳ את התחפושות?',
            correct: 'Recycled boxes.',
            wrong: ['Old curtains.', 'New fabric.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'If I had wings, I would fly to school.',
                wrong: ['If I would have wings, I fly to school.'],
                explainHe: 'בתנאי שני אחרי If בא Past Simple (had), ובתוצאה would + פועל מקור (fly).',
                hintHe: 'מצב דמיוני: מה בא אחרי If, ומה בא אחרי would?',
              },
              story: {
                passageEn: 
                  'Gal has a pirate costume. It has a red hat. If he had a parrot, he would put it on his shoulder.',
                passageHe: 
                  'לגל יש תחפושת פיראט. יש לה כובע אדום. אילו היה לו תוכי, הוא היה שם אותו על הכתף.',
                questionEn: 'What colour is the hat?',
                questionHe: 'באיזה צבע הכובע?',
                correct: 'Red.',
                wrong: ['Blue.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['weather', 'sunshine'],
                ['tradition', 'recipe'],
                ['bench', 'statue'],
                ['steal', 'destroy'],
              ],
            },
            master: {
              sentenceEn: 'If I could plant a forest I would choose olive trees and wild flowers.',
              sentenceHe: 'אילו יכולתי לנטוע יער הייתי בוחר/ת עצי זית ופרחי בר.',
              decoys: ['will', 'chosen'],
              voiceEn: 'I would wear a funny hat.',
              voiceHe: 'הייתי חובש/ת כובע מצחיק.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'If we had enough money, we would donate more food to families.',
                wrong: [
                  'If we would have enough money, we would donate more food to families.',
                  'If we had enough money, we will donate more food to families.',
                  'If we have enough money, we would donating more food to families.',
                ],
                explainHe: 
                  'תנאי שני: If + Past Simple (had), ובתוצאה would + פועל מקור (donate). אין would אחרי If.',
                hintEn: 'Check the verb after If and after would.',
              },
              story: {
                passageEn: 
                  'Every Purim, Tal and her classmates collect costumes for children who cannot afford them. Last year, Tal brought an old astronaut suit that was too small for her. A week later, she saw a shy boy wearing it at the party. He walked proudly across the room, and other children gathered around him with questions about space. Tal never told him that the suit was hers.',
                passageHe: '',
                questionEn: 'Why did Tal never tell the boy the suit was hers?',
                questionHe: '',
                correct: 'She wanted him to enjoy the gift without shame.',
                wrong: [
                  'She was sure that nobody wanted to know about it.',
                  'She had already forgotten bringing the old suit.',
                  'She was upset that the boy had worn her suit.',
                ],
              },
              storyHintEn: 'Think about how the boy might feel.',
            },
          },
        },
      },
      {
        icon: '🎆',
        titleEn: 'From Freedom to Independence',
        titleHe: 'מחירות לעצמאות',
        storyHookHe:
          'פסח ויום העצמאות: חגים של חירות ושל חגיגה. נחזור על Present Perfect עם for ו-since כדי לספר על מסורות שנמשכות כבר שנים.',
        grammarTopic: 'Present Perfect with For & Since for Family Traditions (Review)',
        skills: ['Present Perfect', 'Spring Holidays', 'Traditions'],
        sentenceEn: 'My grandmother has hosted the Passover Seder for more than thirty years.',
        sentenceHe: 'סבתא שלי מארחת את ליל הסדר כבר יותר משלושים שנה.',
        vocab: [
          ['freedom', 'noun', 'חירות / חופש', '🕊️', 'Passover is the holiday of freedom.', 'פסח הוא חג החירות.'],
          ['independence', 'noun', 'עצמאות', '🎆', 'Israel celebrates its independence in the spring.', 'ישראל חוגגת את עצמאותה באביב.'],
          ['ceremony', 'noun', 'טקס', '🏛️', 'The torch-lighting ceremony starts in the evening.', 'טקס הדלקת המשואות מתחיל בערב.'],
          ['firework', 'noun', 'זיקוק', '🎇', 'Every firework lit up the night sky over the park.', 'כל זיקוק האיר את שמי הלילה מעל הפארק.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'thermometer', translationHe: 'מדחום' },
            { wordEn: 'elevator', translationHe: 'מעלית' },
          ],
          shortSentenceEn: 'We have cleaned the house.',
          shortSentenceHe: 'ניקינו את הבית.',
          rule: {
            questionEn: 'Complete the sentence: "Our neighbours have watched the fireworks from their roof _______ ten years."',
            correct: 'for',
            wrong: ['since', 'ago'],
            explainHe: 'ten years הוא משך זמן, ולכן for. since בא לפני נקודת התחלה, ו-ago לא בא עם Present Perfect.',
            hintHe: 'האם ten years הוא נקודת התחלה בזמן, או משך של זמן?',
          },
          story: {
            passageEn:
              'Every year, the Cohen family has a busy spring. Before Passover, they clean the whole house and buy new books for the Seder. Three weeks later, on Independence Day, they have a picnic in the park with their neighbours. They have kept this tradition since their oldest son was born. This year, he is going to bring his own guitar.',
            passageHe:
              'בכל שנה למשפחת כהן יש אביב עמוס. לפני פסח הם מנקים את כל הבית וקונים הגדות חדשות לליל הסדר. שלושה שבועות אחר כך, ביום העצמאות, הם עורכים פיקניק בפארק עם השכנים. הם שומרים על המסורת הזאת מאז שהבן הבכור שלהם נולד. השנה הוא הולך להביא את הגיטרה שלו.',
            questionEn: 'Since when have they kept this tradition?',
            questionHe: 'ממתי הם שומרים על המסורת הזאת?',
            correct: 'Since their oldest son was born.',
            wrong: ['Since they moved to the city.', 'Since last Passover.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'We have lived here since 2020.',
                wrong: ['We have lived here for 2020.'],
                explainHe: '2020 היא נקודת התחלה בזמן, ולכן since. for בא עם משך זמן (for two years).',
                hintHe: '2020 היא משך זמן או נקודה בזמן?',
              },
              story: {
                passageEn: 
                  'Grandma makes the Seder every year. She has made it for thirty years. The whole family comes.',
                passageHe: 'סבתא מכינה את הסדר בכל שנה. היא מכינה אותו כבר שלושים שנה. כל המשפחה באה.',
                questionEn: 'How long has Grandma made the Seder?',
                questionHe: 'כמה זמן סבתא מכינה את הסדר?',
                correct: 'For thirty years.',
                wrong: ['For three years.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['slavery', 'punishment'],
                ['currency', 'border'],
                ['museum', 'invitation'],
                ['bench', 'picnic'],
              ],
            },
            master: {
              sentenceEn: 'My family has gathered at this park every Independence Day since I was born.',
              sentenceHe: 'המשפחה שלי מתאספת בפארק הזה בכל יום עצמאות מאז שנולדתי.',
              decoys: ['have', 'for'],
              voiceEn: 'We have cleaned the house for days.',
              voiceHe: 'ניקינו את הבית במשך ימים.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The Cohen family has hosted the Seder in this house since 1998.',
                wrong: [
                  'The Cohen family has hosted the Seder in this house for 1998.',
                  'The Cohen family have hosted the Seder in this house since 1998.',
                  'The Cohen family has host the Seder in this house since 1998.',
                ],
                explainHe: 
                  'since בא עם נקודת התחלה (1998). וגם: עם the Cohen family (יחיד) משתמשים ב-has ואחריו V3 (hosted).',
                hintEn: 'Check the time word, the helping verb and the verb form.',
              },
              story: {
                passageEn: 
                  'For many years, Mr Katz refused to attend the Independence Day ceremony because the noise of the fireworks reminded him of difficult memories. This year his granddaughter invited him to watch from a quiet hill outside the city. They sat together with a blanket and hot tea. When the first firework appeared far away, he smiled gently and held her hand.',
                passageHe: '',
                questionEn: 'Why did the quiet hill make a difference for Mr Katz?',
                questionHe: '',
                correct: 'He could enjoy the evening without the loud noise.',
                wrong: [
                  'He disliked the city and its ceremonies.',
                  'His granddaughter did not like fireworks.',
                  'The fireworks were much closer than in earlier years.',
                ],
              },
              storyHintEn: 'Why had he avoided the ceremony before?',
            },
          },
        },
      },
      {
        icon: '🏖️',
        isBoss: true,
        titleEn: 'Boss: Shavuot and the Summer Countdown',
        titleHe: 'אתגר הבוס: שבועות והספירה לאחור לחופש',
        storyHookHe:
          'אתגר בוס לפרק! שבועות כבר כאן והחופש הגדול מתקרב. נשלב תנאי ראשון, will ו-going to ומילות ניגוד כדי לתכנן את הקיץ.',
        grammarTopic: 'Review: First & Second Conditional, Future Forms and Contrast',
        skills: ['Boss Challenge', 'Summer Plans', 'Mixed Review'],
        sentenceEn: 'If the weather stays hot, we will spend most of the summer vacation at the beach.',
        sentenceHe: 'אם מזג האוויר יישאר חם, נבלה את רוב החופש הגדול בחוף.',
        vocab: [
          ['vacation', 'noun', 'חופשה', '🏖️', 'Our summer vacation starts at the end of June.', 'החופש הגדול שלנו מתחיל בסוף יוני.'],
          ['dairy', 'adjective / noun', 'חלבי / מוצרי חלב', '🧀', 'On Shavuot, many families eat dairy food like cheesecake.', 'בשבועות משפחות רבות אוכלות מאכלי חלב כמו עוגת גבינה.'],
          ['itinerary', 'noun', 'מסלול / תוכנית טיול', '🗺️', 'We wrote an itinerary for our trip to the north.', 'כתבנו תוכנית מסלול לטיול שלנו לצפון.'],
          ['sunscreen', 'noun', 'קרם הגנה', '🧴', 'Don’t forget to put on sunscreen at the pool.', 'אל תשכחו למרוח קרם הגנה בבריכה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'invoice', translationHe: 'חשבונית' },
            { wordEn: 'lecture', translationHe: 'הרצאה' },
          ],
          shortSentenceEn: 'We will go to the beach.',
          shortSentenceHe: 'נלך לחוף.',
          rule: {
            questionEn: 'Choose the correct sentence about summer plans:',
            correct: 'If I finish my exams early, I will visit my cousins in Eilat.',
            wrong: [
              'If I will finish my exams early, I visit my cousins in Eilat.',
              'If I finished my exams early, I will visited my cousins in Eilat.',
            ],
            explainHe: 'בתנאי ראשון: אחרי if בא Present Simple (finish), ובחלק התוצאה will ופועל בסיס (visit).',
            hintHe: 'זו תוכנית אפשרית ומציאותית. בדקו איזה זמן בא אחרי if, ומה בא אחרי will.',
          },
          story: {
            passageEn:
              'On Shavuot, Yael’s youth group visited a dairy farm in the Jezreel Valley. They watched the cows and tasted fresh cheese. Although it was only the beginning of June, the sun was already very strong. The guide reminded everyone to drink water and to wear hats. After the trip, the group started planning their itinerary for the summer.',
            passageHe:
              'בשבועות, תנועת הנוער של יעל ביקרה ברפת בעמק יזרעאל. הם צפו בפרות וטעמו גבינה טרייה. למרות שזו הייתה רק תחילת יוני, השמש כבר הייתה חזקה מאוד. המדריך הזכיר לכולם לשתות מים ולחבוש כובעים. אחרי הטיול, הקבוצה התחילה לתכנן את המסלול שלה לקיץ.',
            questionEn: 'Where did the youth group go on Shavuot?',
            questionHe: 'לאן הלכה תנועת הנוער בשבועות?',
            correct: 'To a dairy farm in the Jezreel Valley.',
            wrong: ['To a beach in Eilat.', 'To a museum in Jerusalem.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'If it is sunny, we will swim.',
                wrong: ['If it will be sunny, we swim.'],
                explainHe: 'בתנאי ראשון: אחרי If בא Present Simple (is), ובתוצאה will + פועל מקור.',
                hintHe: 'תוכנית אפשרית: מה בא אחרי If, ומה בא אחרי will?',
              },
              story: {
                passageEn: 
                  'It is hot today. Shira has sunscreen in her bag. She will go to the beach with her cousin.',
                passageHe: 'חם היום. לשירה יש קרם הגנה בתיק. היא תלך לחוף עם בת הדוד שלה.',
                questionEn: 'Who will Shira go with?',
                questionHe: 'עם מי שירה תלך?',
                correct: 'Her cousin.',
                wrong: ['Her teacher.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['frost', 'snowstorm'],
                ['spicy', 'salty'],
                ['airline', 'envelope'],
                ['shade', 'chlorine'],
              ],
            },
            master: {
              sentenceEn: 'If I finish my project early I will join my cousins at the beach.',
              sentenceHe: 'אם אסיים את הפרויקט מוקדם אצטרף לבני הדוד שלי בחוף.',
              decoys: ['joined', 'going'],
              voiceEn: 'We are going to visit Eilat.',
              voiceHe: 'אנחנו הולכים לבקר באילת.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'If the weather is cool, we will walk along the river.',
                wrong: [
                  'If the weather will be cool, we will walk along the river.',
                  'If the weather were cool, we will walk along the river.',
                  'If the weather is cool, we will walking along the river.',
                ],
                explainHe: 
                  'תנאי ראשון: If + Present Simple (is), ובתוצאה will + פועל מקור (walk). אין will אחרי If.',
                hintEn: 'Check the verb after If and after will.',
              },
              story: {
                passageEn: 
                  'Maya planned an exciting summer itinerary: a week in Eilat, two days at a dairy farm, and a hike in the Galilee. Then she checked the weather forecast. Temperatures in Eilat would reach forty-two degrees every day. Instead of cancelling the trip, she moved the hike to the early morning, packed extra sunscreen, and chose a hotel with a swimming pool.',
                passageHe: '',
                questionEn: 'What does Maya do about the heat?',
                questionHe: '',
                correct: 'She changes her plans to stay comfortable and safe.',
                wrong: [
                  'She cancels all her summer plans.',
                  'She decides to spend every single day at the dairy farm.',
                  'She ignores the forecast and packs less.',
                ],
              },
              storyHintEn: 'Look at what she changed, not what she cancelled.',
            },
          },
        },
      },
    ],
  },
];

export const HOLIDAYS_GRADE_9_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildMiddleSchoolGrade('grade-9', UNITS);
