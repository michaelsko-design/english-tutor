import { buildMiddleSchoolGrade, type MiddleSchoolUnitSpec } from '../../../middleSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * Holidays pack, grade 8 ("Holidays & Seasons"). Playable from the first day of the grade, so it
 * reviews grade 7 grammar and grade 8 units 1–2 only: be going to / will, Past Simple vs. Past
 * Continuous (while / when) and modals (should, must, have to).
 */
const UNITS: MiddleSchoolUnitSpec[] = [
  {
    ...packUnitNumbers('holidays', 0),
    titleEn: 'Autumn & Winter: New Year, Lights & Storms',
    titleHe: 'סתיו וחורף: שנה חדשה, אורות וסערות',
    subtitleHe: 'ראש השנה, סוכות, חנוכה וחורף גשום — תוכניות עם going to ו-will, וסיפורים ב-Past Continuous',
    badgeEmoji: '🌧️',
    missions: [
      {
        icon: '🌴',
        titleEn: 'New Year Resolutions & a Sukkah Plan',
        titleHe: 'החלטות לשנה החדשה ותוכנית לסוכה',
        storyHookHe:
          'שנה חדשה, החלטות חדשות! נספר באנגלית מה אנחנו מתכננים לשנה הקרובה ואיך נבנה את הסוכה, בעזרת going to ו-will.',
        grammarTopic: 'Be Going To (Plans) vs. Will (Quick Decisions) for the New Year',
        skills: ['going to vs. will', 'New Year Resolutions', 'Autumn Holiday Vocab'],
        sentenceEn: 'This year I am going to read more books, and I will help Dad build the sukkah.',
        sentenceHe: 'השנה אני מתכנן/ת לקרוא יותר ספרים, ואני אעזור לאבא לבנות את הסוכה.',
        vocab: [
          ['resolution', 'noun', 'החלטה (לשנה החדשה)', '📝', 'My resolution is to sleep more and scroll less.', 'ההחלטה שלי היא לישון יותר ולגלול פחות.'],
          ['pomegranate', 'noun', 'רימון', '🍎', 'A pomegranate has hundreds of red seeds.', 'לרימון יש מאות גרעינים אדומים.'],
          ['shelter', 'noun', 'מחסה / מבנה זמני', '⛺', 'The sukkah is a simple shelter with a leafy roof.', 'הסוכה היא מחסה פשוט עם גג עלים.'],
          ['branch', 'noun', 'ענף', '🌿', 'We put palm branches on top of the sukkah.', 'שמנו ענפי דקל על גג הסוכה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'regret', translationHe: 'חרטה' },
            { wordEn: 'basement', translationHe: 'מרתף' },
          ],
          shortSentenceEn: 'I am going to read more books.',
          shortSentenceHe: 'אני מתכנן/ת לקרוא יותר ספרים.',
          rule: {
            questionEn: 'The phone rings during dinner. Which answer is correct?',
            correct: 'Don’t worry, I’ll answer it.',
            wrong: ['Don’t worry, I’m going to answer it.', 'Don’t worry, I answer it.'],
            explainHe:
              'זו החלטה מהירה שמתקבלת ברגע עצמו, ולכן משתמשים ב-will (I’ll).',
            hintHe: 'האם תכננו מראש לענות לטלפון, או שההחלטה נולדה עכשיו, כשהוא צלצל?',
          },
          story: {
            passageEn:
              'Before Rosh Hashana, Gili’s class wrote resolutions for the new year. Gili wrote that she is going to learn to play the drums. Two weeks later, her family started to build their sukkah. Her father forgot to buy palm branches, so Gili said, “I’ll ask our neighbor!” The neighbor had a tall palm tree and gave them plenty of branches.',
            passageHe:
              'לפני ראש השנה, הכיתה של גילי כתבה החלטות לשנה החדשה. גילי כתבה שהיא מתכננת ללמוד לנגן בתופים. שבועיים אחר כך, המשפחה שלה התחילה לבנות את הסוכה. אבא שלה שכח לקנות ענפי דקל, אז גילי אמרה: ״אני אשאל את השכן!״ לשכן היה עץ דקל גבוה, והוא נתן להם הרבה ענפים.',
            questionEn: 'What did Gili’s father forget to buy?',
            questionHe: 'מה אבא של גילי שכח לקנות?',
            correct: 'Palm branches.',
            wrong: ['Paper chains.', 'Apples and honey.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which word is right? I ___ going to learn to swim.',
                correct: 'am',
                wrong: ['is'],
                explainHe: 'עם I משתמשים ב-am: I am going to.',
                hintHe: 'איזו צורה של be הולכת עם I?',
              },
              story: {
                passageEn: 'Gili wants to play the drums. She has a plan. She will practice every day.',
                passageHe: 'גילי רוצה לנגן בתופים. יש לה תוכנית. היא תתאמן בכל יום.',
                questionEn: 'What will Gili do every day?',
                questionHe: 'מה גילי תעשה בכל יום?',
                correct: 'Practice the drums.',
                wrong: ['Go shopping.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['nickname', 'allergy'],
                ['banana', 'carrot'],
                ['bridge', 'road'],
                ['chair', 'shoe'],
              ],
            },
            master: {
              sentenceEn: 'We are going to build a big sukkah and I will bring branches.',
              sentenceHe: 'אנחנו מתכוונים לבנות סוכה גדולה ואני אביא ענפים.',
              decoys: ['builds', 'bringing'],
              voiceEn: 'I will help you with the lights.',
              voiceHe: 'אני אעזור לך עם האורות.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'We are going to visit Grandma after the holiday.',
                wrong: [
                  'We are going visit Grandma after the holiday.',
                  'We going to visit Grandma after the holiday.',
                  'We are going to visiting Grandma after the holiday.',
                ],
                explainHe: 'תוכנית מראש: are going to + פועל בצורת הבסיס.',
                hintEn: 'Count the parts of be going to.',
              },
              story: {
                passageEn: 
                  'Every year before Sukkot, Uri and his father build the sukkah in the yard. This year the wind was strong, and half of the roof fell down on the first evening. Uri wanted to cancel the dinner, but his father laughed and called the neighbors. Within an hour six people arrived with ladders, new branches and cold lemonade. They ate dinner under a roof that was a little crooked and a lot of fun.',
                passageHe: '',
                questionEn: 'What can we understand about the neighbors?',
                questionHe: '',
                correct: 'They were ready to help right away.',
                wrong: [
                  'They were angry about the noise.',
                  'They did not want to come.',
                  'They were not at home that evening.',
                ],
              },
              storyHintEn: 'What happened after his father called the neighbors?',
            },
          },
        },
      },
      {
        icon: '🕯️',
        titleEn: 'While We Were Spinning the Dreidel',
        titleHe: 'בזמן שסובבנו את הסביבון',
        storyHookHe:
          'ערב חנוכה סוער! נספר מה עשינו ברקע ומה קרה פתאום, בעזרת while ו-when.',
        grammarTopic: 'Past Continuous & Past Simple (while / when) on a Winter Night',
        skills: ['Past Continuous Review', 'while / when', 'Winter Story Telling'],
        sentenceEn: 'While we were spinning the dreidel, a loud clap of thunder shook the windows.',
        sentenceHe: 'בזמן שסובבנו את הסביבון, רעם חזק הרעיד את החלונות.',
        vocab: [
          ['thunder', 'noun', 'רעם', '🌩️', 'The thunder woke up the whole building.', 'הרעם העיר את כל הבניין.'],
          ['soaked', 'adjective', 'רטוב לגמרי', '💦', 'I came home soaked because I forgot my umbrella.', 'הגעתי הביתה רטוב/ה לגמרי כי שכחתי את המטרייה.'],
          ['spin', 'verb', 'לסובב / להסתובב', '🌀', 'Can you spin the top on one finger?', 'אתם יכולים לסובב את הסביבון על אצבע אחת?'],
          ['oil', 'noun', 'שמן', '🫒', 'Latkes are fried in hot oil.', 'לביבות מטוגנות בשמן חם.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'drizzle', translationHe: 'טפטוף' },
            { wordEn: 'flour', translationHe: 'קמח' },
          ],
          shortSentenceEn: 'We were spinning the dreidel.',
          shortSentenceHe: 'סובבנו את הסביבון.',
          rule: {
            questionEn: 'Complete the sentence: "Grandma ____ latkes when the electricity went out."',
            correct: 'was frying',
            wrong: ['fried', 'were frying'],
            explainHe:
              'הטיגון היה הפעולה הארוכה שנקטעה, ולכן Past Continuous. Grandma היא אחת, ולכן was.',
            hintHe: 'איזו פעולה נמשכה, ואיזו קטעה אותה פתאום? סבתא היא אדם אחד: איזה פועל עזר מתאים לה?',
          },
          story: {
            passageEn:
              'On the third night of Hanukkah, Ori’s family was having a party at home. While the kids were spinning the dreidel, the rain started. Ori’s cousin Neta arrived late and completely soaked. She was carrying a box of doughnuts, and luckily they were dry! Everyone laughed and gave Neta a warm towel.',
            passageHe:
              'בלילה השלישי של חנוכה, המשפחה של אורי ערכה מסיבה בבית. בזמן שהילדים סובבו את הסביבון, התחיל לרדת גשם. בת הדודה של אורי, נטע, הגיעה באיחור ורטובה לגמרי. היא החזיקה קופסת סופגניות, ולמזלם הן היו יבשות! כולם צחקו ונתנו לנטע מגבת חמה.',
            questionEn: 'What was Neta carrying when she arrived?',
            questionHe: 'מה נטע החזיקה כשהיא הגיעה?',
            correct: 'A box of doughnuts.',
            wrong: ['A big umbrella.', 'A bag of presents.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which is right? Dad ___ cooking when it rained.',
                correct: 'was',
                wrong: ['were'],
                explainHe: 'עם Dad (יחיד) משתמשים ב-was.',
                hintHe: 'Dad הוא אדם אחד. איזו צורה של be מתאימה?',
              },
              story: {
                passageEn: 'It rained on Hanukkah. The kids played inside. They ate doughnuts.',
                passageHe: 'ירד גשם בחנוכה. הילדים שיחקו בפנים. הם אכלו סופגניות.',
                questionEn: 'What did the kids eat?',
                questionHe: 'מה הילדים אכלו?',
                correct: 'Doughnuts.',
                wrong: ['Sandwiches.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['rainbow', 'cloud'],
                ['dry', 'dusty'],
                ['eat', 'pour'],
                ['milk', 'juice'],
              ],
            },
            master: {
              sentenceEn: 'The children were playing board games when the lights suddenly went out.',
              sentenceHe: 'הילדים שיחקו במשחקי קופסה כשהאורות כבו פתאום.',
              decoys: ['played', 'was'],
              voiceEn: 'Grandma was frying latkes for us.',
              voiceHe: 'סבתא טיגנה לנו לביבות.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'I was drying my hair when the phone rang.',
                wrong: [
                  'I were drying my hair when the phone rang.',
                  'I was dry my hair when the phone rang.',
                  'I was drying my hair when the phone was ring.',
                ],
                explainHe: 'עם I משתמשים ב-was + ing, והפעולה הקצרה ב-Past Simple.',
                hintEn: 'Check the helping verb and each verb ending.',
              },
              story: {
                passageEn: 
                  'On the last night of Hanukkah, Ruti was carrying a tray of candles down the stairs when she heard a loud crash of thunder. She stopped, looked at the dark window, and saw that the whole street had lost its power. For a moment everything was black, except for eight small flames on her tray. Her little brother clapped his hands and shouted that Hanukkah had its own lights.',
                passageHe: '',
                questionEn: 'Why was the little brother so happy?',
                questionHe: '',
                correct: 'The candles gave light in the dark.',
                wrong: [
                  'The thunder had stopped at last.',
                  'Ruti had dropped the tray.',
                  'The electricity came back on.',
                ],
              },
              storyHintEn: 'What was the only light in the street?',
            },
          },
        },
      },
      {
        icon: '☂️',
        isBoss: true,
        titleEn: 'Boss: The Great Winter Storm',
        titleHe: 'אתגר הבוס: סערת החורף הגדולה',
        storyHookHe:
          'משימת סיכום של הסתיו והחורף! קראו קטע Unseen על סערה גדולה והוכיחו שליטה בתוכניות לעתיד ובסיפורים מהעבר.',
        grammarTopic: 'Boss: going to / will & Past Continuous in Winter Reading',
        skills: ['Boss Unseen', 'Future & Past Review', 'Weather Vocab'],
        sentenceEn: 'The forecast says it will snow on the mountain, so we are going to stay at home.',
        sentenceHe: 'התחזית אומרת שירד שלג על ההר, ולכן אנחנו מתכוונים להישאר בבית.',
        vocab: [
          ['forecast', 'noun', 'תחזית', '📡', 'The weather forecast promises a sunny weekend.', 'תחזית מזג האוויר מבטיחה סוף שבוע שמשי.'],
          ['heater', 'noun', 'תנור חימום', '♨️', 'We turned on the heater in the living room.', 'הדלקנו את תנור החימום בסלון.'],
          ['shiver', 'verb', 'לרעוד (מקור)', '🥶', 'The children were shivering at the bus stop.', 'הילדים רעדו מקור בתחנת האוטובוס.'],
          ['gloomy', 'adjective', 'קודר / אפור', '🌫️', 'It was a gloomy morning with dark clouds.', 'זה היה בוקר קודר עם עננים כהים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'sunny', translationHe: 'שמשי' },
            { wordEn: 'fan', translationHe: 'מאוורר' },
          ],
          shortSentenceEn: 'We are going to stay home.',
          shortSentenceHe: 'אנחנו מתכוונים להישאר בבית.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'We were watching the news when the storm reached our town.',
            wrong: [
              'We watched the news when the storm was reach our town.',
              'We was watching the news when the storm reached our town.',
            ],
            explainHe:
              'הפעולה הארוכה (were watching) נקטעה בפעולה קצרה (reached). עם we משתמשים ב-were.',
            hintHe: 'מצאו את הפעולה הארוכה ואת הפעולה הקצרה. ועם we, איזו צורת עבר של be מתאימה?',
          },
          story: {
            passageEn:
              'Last January, a huge storm hit the north of Israel. The forecast warned that there would be snow on Mount Hermon and floods in the valleys. Schools closed for two days. While the wind was blowing, Yael and her brother were sitting next to the heater and reading. When the storm ended, they went outside and saw a beautiful rainbow over the hills.',
            passageHe:
              'בינואר שעבר, סערה ענקית פגעה בצפון ישראל. התחזית הזהירה שירד שלג בחרמון ויהיו שיטפונות בעמקים. בתי הספר נסגרו ליומיים. בזמן שהרוח נשבה, יעל ואחיה ישבו ליד תנור החימום וקראו. כשהסערה נגמרה, הם יצאו החוצה וראו קשת יפה מעל הגבעות.',
            questionEn: 'What did Yael and her brother see when the storm ended?',
            questionHe: 'מה יעל ואחיה ראו כשהסערה נגמרה?',
            correct: 'A beautiful rainbow over the hills.',
            wrong: ['Snow in their garden.', 'A broken window in the school.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which is right? The forecast says it ___ rain.',
                correct: 'will',
                wrong: ['wills'],
                explainHe: 'לתחזית עתידית משתמשים ב-will (שאינו מקבל s בגוף שלישי), ואחריו בא פועל בצורת הבסיס.',
                hintHe: 'שימו לב: באיזה פועל עזר משתמשים לחיזוי עתיד? זכרו שפועלי עזר מודליים אינם מקבלים s בגוף שלישי.',
              },
              story: {
                passageEn: 'It is cold today. Dan sits near the heater. He drinks hot tea.',
                passageHe: 'היום קר. דן יושב ליד תנור החימום. הוא שותה תה חם.',
                questionEn: 'What hot drink does Dan have near the heater?',
                questionHe: 'מה דן שותה?',
                correct: 'Hot tea.',
                wrong: ['Cold milk.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['recipe', 'menu'],
                ['sofa', 'curtain'],
                ['dive', 'cook'],
                ['salty', 'wooden'],
              ],
            },
            master: {
              sentenceEn: 'The forecast says it will rain all day so we are going to stay inside.',
              sentenceHe: 'התחזית אומרת שירד גשם כל היום אז אנחנו מתכוונים להישאר בפנים.',
              decoys: ['rains', 'stays'],
              voiceEn: 'It was a cold and gloomy day.',
              voiceHe: 'זה היה יום קר וקודר.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'We were eating dinner when the storm began.',
                wrong: [
                  'We was eating dinner when the storm began.',
                  'We were eat dinner when the storm began.',
                  'We eating dinner when the storm began.',
                ],
                explainHe: 'עם We משתמשים ב-were + ing לפעולה הארוכה.',
                hintEn: 'Check the helping verb and the ending of eat.',
              },
              story: {
                passageEn: 
                  'The weather app showed a red warning for the whole weekend, so the Cohen family packed candles, water and warm blankets on Friday afternoon. Late at night the wind hit the windows, and the lights went out. While the parents were looking for the matches, the youngest child found the flashlight that Dad had hidden for a birthday present. The family spent the night playing cards by its light.',
                passageHe: '',
                questionEn: 'What can we understand about the family?',
                questionHe: '',
                correct: 'They prepared well for the storm.',
                wrong: [
                  'They were surprised by the weather.',
                  'They forgot to buy candles.',
                  'They left the house at night.',
                ],
              },
              storyHintEn: 'What did the family do before the storm arrived?',
            },
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('holidays', 1),
    titleEn: 'Spring & Summer: Masks, Freedom & Sunshine',
    titleHe: 'אביב וקיץ: מסכות, חירות ושמש',
    subtitleHe: 'ט״ו בשבט, פורים, פסח, יום העצמאות, שבועות וחופש גדול — עבר, עצות עם should ו-must ותוכניות לקיץ',
    badgeEmoji: '🌾',
    missions: [
      {
        icon: '🎭',
        titleEn: 'The Purim Parade Surprise',
        titleHe: 'ההפתעה במצעד פורים',
        storyHookHe:
          'מט״ו בשבט ועד עדלאידע! נספר מה עשינו בחגים של סוף החורף ומה קרה בזמן שצעדנו במצעד.',
        grammarTopic: 'Past Simple & Past Continuous in Holiday Stories',
        skills: ['Past Tenses Review', 'Tu BiShvat & Purim', 'Describing Events'],
        sentenceEn: 'We were marching in the Purim parade when my disguise suddenly fell apart.',
        sentenceHe: 'צעדנו במצעד פורים כשהתחפושת שלי פתאום התפרקה.',
        vocab: [
          ['disguise', 'noun', 'תחפושת / הסוואה', '🥸', 'Nobody recognized my uncle in his clever disguise.', 'אף אחד לא זיהה את הדוד שלי בתחפושת המתוחכמת שלו.'],
          ['parade', 'noun', 'מצעד / תהלוכה', '🎺', 'The parade passed through the main street.', 'המצעד עבר ברחוב הראשי.'],
          ['seedling', 'noun', 'שתיל', '🌱', 'Each student planted a seedling near the school gate.', 'כל תלמיד שתל שתיל ליד שער בית הספר.'],
          ['almond', 'noun', 'שקד', '🥜', 'Almond trees bloom before all the other trees.', 'עצי שקד פורחים לפני כל העצים האחרים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'funeral', translationHe: 'הלוויה' },
            { wordEn: 'weed', translationHe: 'עשב שוטה' },
          ],
          shortSentenceEn: 'We were marching in the parade.',
          shortSentenceHe: 'צעדנו במצעד.',
          rule: {
            questionEn: 'Complete the question: "What ____ you wearing at the Purim party last year?"',
            correct: 'were',
            wrong: ['did', 'was'],
            explainHe:
              'wearing הוא צורת ing, ולכן השאלה ב-Past Continuous עם you צריכה were.',
            hintHe: 'הפועל בשאלה מסתיים ב-ing. איזה פועל עזר בעבר הולך איתו, ואיזו צורה מתאימה ל-you?',
          },
          story: {
            passageEn:
              'On Tu BiShvat, Eyal’s class planted seedlings in a park in Holon. A month later, the city held its famous Purim parade. Eyal was wearing a disguise of a giant almond, and his friends were dressed as trees. While they were marching, it started to rain. Instead of going home, the whole group danced in the rain and the crowd cheered.',
            passageHe:
              'בט״ו בשבט, הכיתה של אייל שתלה שתילים בפארק בחולון. חודש אחר כך, העיר ערכה את מצעד הפורים המפורסם שלה. אייל לבש תחפושת של שקד ענק, והחברים שלו היו מחופשים לעצים. בזמן שהם צעדו, התחיל לרדת גשם. במקום ללכת הביתה, כל הקבוצה רקדה בגשם והקהל הריע.',
            questionEn: 'What did the group do when it started to rain?',
            questionHe: 'מה הקבוצה עשתה כשהתחיל לרדת גשם?',
            correct: 'They danced in the rain.',
            wrong: ['They went home quickly.', 'They hid under the trees.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which is right? We ___ marching in the parade.',
                correct: 'were',
                wrong: ['was'],
                explainHe: 'עם We משתמשים ב-were.',
                hintHe: 'We הוא רבים. איזו צורה של be מתאימה?',
              },
              story: {
                passageEn: 'It was Purim. Eli wore a big hat. He danced in the street.',
                passageHe: 'היה פורים. אלי חבש כובע גדול. הוא רקד ברחוב.',
                questionEn: 'What did Eli wear?',
                questionHe: 'מה אלי לבש?',
                correct: 'A big hat.',
                wrong: ['A red shoe.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['idea', 'schedule'],
                ['concert', 'lesson'],
                ['ladder', 'lantern'],
                ['plastic', 'marble'],
              ],
            },
            master: {
              sentenceEn: 'Everyone was dancing in the street when it suddenly started to rain heavily.',
              sentenceHe: 'כולם רקדו ברחוב כשפתאום התחיל לרדת גשם חזק.',
              decoys: ['danced', 'were'],
              voiceEn: 'My disguise was a giant almond.',
              voiceHe: 'התחפושת שלי הייתה שקד ענק.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'They were wearing masks when the parade began.',
                wrong: [
                  'They was wearing masks when the parade began.',
                  'They were wear masks when the parade began.',
                  'They were wearing masks when the parade was begin.',
                ],
                explainHe: 'עם They משתמשים ב-were + ing, והפעולה הקצרה (began) ב-Past Simple.',
                hintEn: 'Check the helping verb and each verb form.',
              },
              story: {
                passageEn: 
                  'Michal spent three weeks sewing a costume of a rainbow for the school Purim parade. On the morning of the parade, her little dog chewed the last, red stripe. Michal almost cried, but her grandmother took a red scarf from her closet and tied it carefully to the costume. During the parade a photographer from the local paper asked her to pose, because hers was the most colorful costume of all.',
                passageHe: '',
                questionEn: 'How did Michal probably feel at the end?',
                questionHe: '',
                correct: 'Happy that the problem was solved.',
                wrong: [
                  'Angry that nobody helped her.',
                  'Worried about the missing costume.',
                  'Bored because the parade was long.',
                ],
              },
              storyHintEn: 'Think about how the red stripe problem ended.',
            },
          },
        },
      },
      {
        icon: '🎊',
        titleEn: 'Holiday Rules: Should, Must & Have To',
        titleHe: 'כללי החג: should, must ו-have to',
        storyHookHe:
          'פסח, יום העצמאות ושבועות מגיעים עם הרבה עצות וכללים. נלמד לתת עצה ולספר מה חובה לעשות.',
        grammarTopic: 'Modals of Advice & Obligation (should, must, have to) for Spring Holidays',
        skills: ['should / must / have to', 'Giving Advice', 'Spring Holiday Vocab'],
        sentenceEn: 'You should arrive early for the ceremony, and you must stand during the anthem.',
        sentenceHe: 'כדאי להגיע מוקדם לטקס, וחובה לעמוד בזמן ההמנון.',
        vocab: [
          ['ceremony', 'noun', 'טקס', '🎖️', 'The school ceremony starts at nine in the morning.', 'הטקס של בית הספר מתחיל בתשע בבוקר.'],
          ['independence', 'noun', 'עצמאות', '🇮🇱', 'Israel celebrated its independence in 1948.', 'ישראל חגגה את עצמאותה ב-1948.'],
          ['barbecue', 'noun', 'מנגל', '🍖', 'Our neighbors invited us to a barbecue in the park.', 'השכנים שלנו הזמינו אותנו למנגל בפארק.'],
          ['dairy', 'adjective', 'חלבי', '🧀', 'On Shavuot many families eat dairy food.', 'בשבועות משפחות רבות אוכלות מאכלים חלביים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'surrender', translationHe: 'כניעה' },
            { wordEn: 'frozen', translationHe: 'קפוא' },
          ],
          shortSentenceEn: 'You should arrive early.',
          shortSentenceHe: 'כדאי להגיע מוקדם.',
          rule: {
            questionEn: 'Complete the sentence: "Ron ____ wake up early tomorrow because the trip starts at six."',
            correct: 'has to',
            wrong: ['have to', 'has'],
            explainHe:
              'have to מראה חובה. Ron הוא he, ולכן has to, ואחריו פועל בצורת הבסיס.',
            hintHe: 'רון חייב לקום מוקדם. רון הוא he: איך משתנה הביטוי של חובה בגוף שלישי, ומה בא לפני הפועל?',
          },
          story: {
            passageEn:
              'Before Passover, many Israeli families clean their homes from top to bottom. A few weeks later, on Independence Day, the parks fill with barbecues and blue and white flags. Park rangers remind visitors that they must take their rubbish home. Then comes Shavuot, a holiday of wheat and dairy food. Doctors say you shouldn’t eat too much cheesecake in one day!',
            passageHe:
              'לפני פסח, משפחות ישראליות רבות מנקות את הבית מלמעלה עד למטה. כמה שבועות אחר כך, ביום העצמאות, הפארקים מתמלאים במנגלים ובדגלים כחולים-לבנים. פקחי הפארקים מזכירים למבקרים שחובה עליהם לקחת את האשפה שלהם הביתה. ואז מגיע שבועות, חג של חיטה ומאכלים חלביים. רופאים אומרים שלא כדאי לאכול יותר מדי עוגת גבינה ביום אחד!',
            questionEn: 'What do park rangers remind visitors on Independence Day?',
            questionHe: 'מה פקחי הפארקים מזכירים למבקרים ביום העצמאות?',
            correct: 'They must take their rubbish home.',
            wrong: ['They should bring more flags.', 'They have to leave before noon.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which is right? You should ___ early.',
                correct: 'arrive',
                wrong: ['arriving'],
                explainHe: 'אחרי should בא פועל בצורת הבסיס, בלי ing.',
                hintHe: 'אחרי should הפועל מופיע בצורה הפשוטה ביותר.',
              },
              story: {
                passageEn: 'It is Independence Day. The family goes to the park. They have a barbecue.',
                passageHe: 'היום יום העצמאות. המשפחה הולכת לפארק. הם עושים מנגל.',
                questionEn: 'Where does the family go?',
                questionHe: 'לאן המשפחה הולכת?',
                correct: 'To the park.',
                wrong: ['To the beach.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['uniform', 'backpack'],
                ['homework', 'weather'],
                ['bathtub', 'dentist'],
                ['plastic', 'electric'],
              ],
            },
            master: {
              sentenceEn: 'You must wear a hat and you should drink a lot of water.',
              sentenceHe: 'חובה לחבוש כובע וכדאי לשתות הרבה מים.',
              decoys: ['have', 'wears'],
              voiceEn: 'We have to stand during the anthem.',
              voiceHe: 'אנחנו צריכים לעמוד בזמן ההמנון.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Students must wear white shirts to the ceremony.',
                wrong: [
                  'Students must to wear white shirts to the ceremony.',
                  'Students must wearing white shirts to the ceremony.',
                  'Students musts wear white shirts to the ceremony.',
                ],
                explainHe: 'אחרי must בא פועל בצורת הבסיס, בלי to, בלי ing ובלי s.',
                hintEn: 'What can follow a modal verb?',
              },
              story: {
                passageEn: 
                  'Last Independence Day, Avi and his cousins arrived at the park at ten in the morning, but all the picnic tables were already taken. A park ranger told them that families usually come at sunrise to keep a place. Avi suggested sharing a big table with a family who had only three people. They agreed, and by evening the two families were singing together and sharing the salads.',
                passageHe: '',
                questionEn: 'What can we understand from the story?',
                questionHe: '',
                correct: 'Sharing a table solved the problem.',
                wrong: [
                  'Families must arrive after sunset.',
                  'Park rangers keep tables for guests.',
                  'Barbecues are not allowed in parks.',
                ],
              },
              storyHintEn: 'How did the two families end the problem?',
            },
          },
        },
      },
      {
        icon: '🗺️',
        isBoss: true,
        titleEn: 'Boss: Our Summer Trip Plan',
        titleHe: 'אתגר הבוס: התוכנית לטיול הקיץ',
        storyHookHe:
          'משימת הסיכום של האביב והקיץ! תכננו טיול לחופש הגדול, קראו קטע Unseen והראו שליטה בעבר, בעתיד ובעצות.',
        grammarTopic: 'Boss: Past Tenses, going to / will & Modals in Summer Reading',
        skills: ['Boss Unseen', 'Mixed Tenses Review', 'Travel Planning'],
        sentenceEn: 'We are going to hike in the Golan, so we should take a lot of water.',
        sentenceHe: 'אנחנו מתכוונים לטייל ברגל בגולן, ולכן כדאי שניקח הרבה מים.',
        vocab: [
          ['campsite', 'noun', 'חניון לילה / אתר קמפינג', '🏕️', 'The campsite is next to a quiet river.', 'אתר הקמפינג נמצא ליד נהר שקט.'],
          ['sunburn', 'noun', 'כוויית שמש', '🥵', 'Wear a hat or you will get a sunburn.', 'חבשו כובע, אחרת תקבלו כוויית שמש.'],
          ['hike', 'verb', 'לטייל ברגל / לצעוד בשטח', '🥾', 'My cousins hike in the desert every spring.', 'בני הדודים שלי מטיילים ברגל במדבר בכל אביב.'],
          ['itinerary', 'noun', 'מסלול / תוכנית טיול', '🗺️', 'Our itinerary includes three national parks.', 'המסלול שלנו כולל שלושה גנים לאומיים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'office', translationHe: 'משרד' },
            { wordEn: 'frostbite', translationHe: 'כוויית קור' },
          ],
          shortSentenceEn: 'We are going to hike.',
          shortSentenceHe: 'אנחנו מתכוונים לטייל ברגל.',
          rule: {
            questionEn: 'Which sentence gives good advice for a hot day?',
            correct: 'You should drink water every hour.',
            wrong: ['You should to drink water every hour.', 'You should drinking water every hour.'],
            explainHe: 'אחרי should בא פועל בצורת הבסיס, בלי to ובלי ing.',
            hintHe: 'אחרי פועל של עצה, הפועל הבא מופיע בצורה הכי פשוטה שלו.',
          },
          story: {
            passageEn:
              'Last summer, Dana’s family planned a four-day trip to the Golan Heights. Dana wrote the itinerary, and her brother packed the tents. On the first day, they were hiking along a stream when they saw a family of wild boars. They stayed at a campsite near the Sea of Galilee. Next summer, they are going to explore the Negev desert.',
            passageHe:
              'בקיץ שעבר, המשפחה של דנה תכננה טיול של ארבעה ימים לרמת הגולן. דנה כתבה את המסלול, ואחיה ארז את האוהלים. ביום הראשון, הם טיילו לאורך נחל כשראו משפחה של חזירי בר. הם לנו באתר קמפינג ליד הכנרת. בקיץ הבא הם מתכוונים לחקור את מדבר הנגב.',
            questionEn: 'What did they see while they were hiking along a stream?',
            questionHe: 'מה הם ראו בזמן שטיילו לאורך הנחל?',
            correct: 'A family of wild boars.',
            wrong: ['A group of camels.', 'A big waterfall.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which is right? We ___ going to hike tomorrow.',
                correct: 'are',
                wrong: ['is'],
                explainHe: 'עם We משתמשים ב-are: We are going to.',
                hintHe: 'We הוא רבים. איזו צורה של be מתאימה?',
              },
              story: {
                passageEn: 'Dana has a map. She will hike with her brother. They take water.',
                passageHe: 'לדנה יש מפה. היא תטייל ברגל עם אחיה. הם לוקחים מים.',
                questionEn: 'What do they take?',
                questionHe: 'מה הם לוקחים?',
                correct: 'Water.',
                wrong: ['Pizza.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['itinerary', 'sunburn'],
                ['puddle', 'tent'],
                ['ski', 'sail'],
                ['sunburn', 'allergy'],
              ],
            },
            master: {
              sentenceEn: 'We were hiking near a river when we saw a family of deer.',
              sentenceHe: 'טיילנו ברגל ליד נהר כשראינו משפחה של צבאים.',
              decoys: ['hiked', 'was'],
              voiceEn: 'You should wear a hat today.',
              voiceHe: 'כדאי לחבוש כובע היום.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'We were walking home when it started to rain.',
                wrong: [
                  'We was walking home when it started to rain.',
                  'We were walking home when it start to rain.',
                  'We walking home when it started to rain.',
                ],
                explainHe: 
                  'פעולה ארוכה ב-Past Continuous (were + ing), והפעולה שקטעה אותה ב-Past Simple (started).',
                hintEn: 'Check the helping verb and the second verb.',
              },
              story: {
                passageEn: 
                  'Ofer packed his backpack the night before the trip: two bottles of water, a hat, sunscreen and a thin jacket. His friend laughed at the jacket, because the forecast promised thirty-five degrees. At the top of the mountain the wind was so cold that his friend was shivering, and she gratefully borrowed the jacket. They ate lunch together under a tree and planned their next hike.',
                passageHe: '',
                questionEn: 'Why was the jacket useful?',
                questionHe: '',
                correct: 'The mountain top was colder than expected.',
                wrong: [
                  'It was raining on the way down.',
                  'Ofer needed it to carry water.',
                  'His friend forgot to bring a hat.',
                ],
              },
              storyHintEn: 'What was the weather like at the top?',
            },
          },
        },
      },
    ],
  },
];

export const HOLIDAYS_GRADE_8_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildMiddleSchoolGrade('grade-8', UNITS);
