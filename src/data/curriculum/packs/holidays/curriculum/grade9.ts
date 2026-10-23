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
          ['disguise', 'noun / verb', 'הסוואה / להסוות', '🕶️', 'Nobody recognised him in his clever disguise.', 'אף אחד לא זיהה אותו בהסוואה המתוחכמת שלו.'],
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
        },
      },
    ],
  },
];

export const HOLIDAYS_GRADE_9_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildMiddleSchoolGrade('grade-9', UNITS);
