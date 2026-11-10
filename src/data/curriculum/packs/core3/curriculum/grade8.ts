import { buildMiddleSchoolGrade, type MiddleSchoolUnitSpec } from '../../../middleSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-3 grade 8 unit (Band II): the present simple passive (is / are + V3, questions, by),
 * which the Ministry starts in grade 8 and the base curriculum only in grade 9, about products and
 * inventions made in Israel, with Band II words the app never taught or only showed. Example Hebrew
 * addresses the learner in the plural; hints and explanations are gender-neutral plural.
 */
const UNIT_CORE_3: MiddleSchoolUnitSpec = {
  ...packUnitNumbers('core-3'),
  titleEn: 'Made in Israel',
  titleHe: 'תוצרת ישראל',
  subtitleHe: 'עונה 3: מה מייצרים ואיפה, עם סביל בהווה: is made, are grown, is used by',
  badgeEmoji: '🇮🇱',
  missions: [
    {
      icon: '🏭',
      titleEn: 'It Is Made Here',
      titleHe: 'זה מיוצר כאן',
      storyHookHe:
        'מה מייצרים בישראל? נלמד לדבר על מוצרים בלי לומר מי עשה אותם, עם is / are ו-V3: The furniture is made in the Galilee.',
      grammarTopic: 'Present Simple Passive (am / is / are + V3)',
      skills: ['Present Simple Passive', 'is / are + V3', 'Products & Goods'],
      sentenceEn: 'This furniture is made in a small factory in the Galilee.',
      sentenceHe: 'הרהיטים האלה מיוצרים במפעל קטן בגליל.',
      vocab: [
        ['goods', 'noun', 'סחורה / מוצרים', '🏬', 'The goods are sent to shops all over the country.', 'הסחורה נשלחת לחנויות בכל הארץ.'],
        ['well-made', 'adjective', 'עשוי היטב / איכותי', '👌', 'These chairs are built by hand, so they are well-made.', 'הכיסאות האלה נבנים ביד, ולכן הם עשויים היטב.'],
        ['furniture', 'noun', 'רהיטים', '🗃️', 'Most of the furniture in our house is made of wood.', 'רוב הרהיטים בבית שלנו עשויים מעץ.'],
        ['metal', 'noun', 'מתכת', '🔩', 'The spoons are made of metal.', 'הכפות עשויות ממתכת.'],
        ['package', 'noun', 'חבילה', '📫', 'The package is delivered to your door in two days.', 'החבילה נמסרת עד הדלת שלכם תוך יומיים.'],
        ['wrap up', 'verb', 'לעטוף', '🎁', "Please wrap up the gift. It is collected at five o'clock.", 'בבקשה עטפו את המתנה. אוספים אותה בשעה חמש.'],
        ['mainly', 'adverb', 'בעיקר', '🎯', 'These dates are mainly grown in the Jordan Valley.', 'התמרים האלה גדלים בעיקר בבקעת הירדן.'],
        ['fashion', 'noun', 'אופנה', '👗', 'Israeli fashion is sold in shops all over the world.', 'אופנה ישראלית נמכרת בחנויות בכל העולם.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'volcano', translationHe: 'הר געש' },
          { wordEn: 'eyebrow', translationHe: 'גבה' },
        ],
        shortSentenceEn: 'It is made in Israel.',
        shortSentenceHe: 'זה מיוצר בישראל.',
        rule: {
          questionEn: 'Complete: "Cherry tomatoes ____ in many Israeli greenhouses."',
          correct: 'are grown',
          wrong: ['is grown', 'are grow'],
          explainHe:
            'cherry tomatoes הם רבים, ולכן are. אחרי are בא V3: grown. כך אומרים מה עושים לעגבניות בלי לומר מי מגדל אותן.',
          hintHe: 'כמה עגבניות יש? ואיזו צורה של הפועל באה אחרי פועל העזר בסביל?',
        },
        story: {
          passageEn:
            'In a small village in the Galilee, there is a family factory. Beautiful wooden furniture is made there. The wood is cut by machines, but every table is finished by hand. The goods are mainly sold in Israel, and some are sent to Europe.',
          passageHe:
            'בכפר קטן בגליל יש מפעל משפחתי. מייצרים שם רהיטי עץ יפים. את העץ חותכות מכונות, אבל את הגימור של כל שולחן עושים ידנית. הסחורה נמכרת בעיקר בישראל, וחלק ממנה נשלח לאירופה.',
          questionEn: 'How is every table finished?',
          questionHe: 'איך עושים את הגימור של כל שולחן?',
          correct: 'By hand.',
          wrong: ['By machines.', 'In a factory in Europe.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'Cheese is made from milk.',
              wrong: ['Cheese is make from milk.'],
              explainHe: 'בסביל באה צורת V3 אחרי is: made.',
              hintHe: 'איזו צורה של הפועל באה אחרי is?',
            },
            story: {
              passageEn: 'Gil works in a factory. Chocolate is made there. It is sold in many shops.',
              passageHe: 'גיל עובד במפעל. מייצרים שם שוקולד. הוא נמכר בהרבה חנויות.',
              questionEn: 'What is made in the factory?',
              questionHe: 'מה מייצרים במפעל?',
              correct: 'Chocolate.',
              wrong: ['Shoes.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['clouds', 'dreams'],
              ['hungry', 'asleep'],
              ['weather', 'homework'],
              ['music', 'sleep'],
              ['rain', 'silence'],
              ['fall asleep', 'grow up'],
              ['angrily', 'loudly'],
              ['weather', 'sunshine'],
            ],
          },
          master: {
            sentenceEn: 'Every package is checked, wrapped and sent to the customer on the same day.',
            sentenceHe: 'כל חבילה נבדקת, נעטפת ונשלחת ללקוח באותו יום.',
            decoys: ['checks', 'send'],
            voiceEn: 'These chairs are made by hand.',
            voiceHe: 'הכיסאות האלה עשויים בעבודת יד.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'Olive oil is produced in many villages in the north.',
              wrong: [
                'Olive oil is produce in many villages in the north.',
                'Olive oil are produced in many villages in the north.',
                'Olive oil produced is in many villages in the north.',
              ],
              explainHe:
                'olive oil הוא יחיד (את השמן לא סופרים), ולכן is. אחרי is בא V3: produced, והסדר הוא is ואחריו V3.',
              hintEn: 'Check is / are, the verb form and the word order.',
            },
            story: {
              passageEn:
                'Many people buy a famous Israeli water bottle without knowing its story. The bottles are designed in Tel Aviv, but the metal parts are made in another country. Then the parts are sent back to Israel, where every bottle is checked by hand before it is packed. The company says this costs more money, but customers know the bottles are well-made, so they keep buying them.',
              passageHe: '',
              questionEn: 'Why does the company check every bottle by hand?',
              questionHe: '',
              correct: 'To make sure each bottle is good.',
              wrong: ['Because machines are too expensive.', 'Because the parts come from Tel Aviv.', 'To make the bottles cheaper.'],
            },
            storyHintEn: 'What do customers know about the bottles?',
          },
        },
      },
    },
    {
      icon: '💻',
      titleEn: 'Is It Used Everywhere?',
      titleHe: 'משתמשים בזה בכל מקום?',
      storyHookHe:
        'ממציאים ישראלים יצרו מכשירים שמשתמשים בהם בכל העולם. נלמד לשאול בסביל (Is it used…? Where are they made?) ולומר מי עושה את הפעולה עם by.',
      grammarTopic: 'Present Simple Passive: questions & by (Is it used…? It is controlled by…)',
      skills: ['Passive Questions', 'by + doer', 'Technology'],
      sentenceEn: 'This electronic device is used in hospitals all over the world.',
      sentenceHe: 'משתמשים במכשיר האלקטרוני הזה בבתי חולים בכל העולם.',
      vocab: [
        ['device', 'noun', 'מכשיר', '📟', 'This small device is used by doctors to check your heart.', 'רופאים משתמשים במכשיר הקטן הזה כדי לבדוק את הלב.'],
        ['electronic', 'adjective', 'אלקטרוני', '🔌', 'Electronic parts are made in factories in the south.', 'חלקים אלקטרוניים מיוצרים במפעלים בדרום.'],
        ['operate', 'verb', 'להפעיל', '⚙️', 'The machine is operated by one worker.', 'עובד אחד מפעיל את המכונה.'],
        ['control', 'verb', 'לשלוט / לכוון', '🎮', 'The drone is controlled from a phone.', 'שולטים ברחפן מהטלפון.'],
        ['digital', 'adjective', 'דיגיטלי', '🗺️', 'Digital maps are used by millions of drivers.', 'מיליוני נהגים משתמשים במפות דיגיטליות.'],
        ['latest', 'adjective', 'החדש ביותר / האחרון', '🆕', 'The latest model is sold online only.', 'הדגם החדש ביותר נמכר רק ברשת.'],
        ['vehicle', 'noun', 'כלי רכב', '🚚', 'Electric vehicles are charged at home or at work.', 'כלי רכב חשמליים נטענים בבית או בעבודה.'],
        ['design', 'verb', 'לעצב / לתכנן', '✏️', 'New apps are designed by young engineers in Tel Aviv.', 'מהנדסים צעירים בתל אביב מעצבים אפליקציות חדשות.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'blanket', translationHe: 'שמיכה' },
          { wordEn: 'puddle', translationHe: 'שלולית' },
        ],
        shortSentenceEn: 'It is used by doctors.',
        shortSentenceHe: 'רופאים משתמשים בזה.',
        rule: {
          questionEn: 'Which question is correct?',
          correct: 'Where are these devices made?',
          wrong: ['Where are these devices make?', 'Where these devices are made?'],
          explainHe: 'בשאלה בסביל, are בא לפני הנושא (these devices), ובסוף בא V3: Where are … made?',
          hintHe: 'בדקו את מקום פועל העזר ואת צורת הפועל בסוף השאלה.',
        },
        story: {
          passageEn:
            'Drip irrigation is an Israeli invention. Today, it is used by farmers in more than one hundred countries. Water is sent through small pipes straight to the plants, and the whole system is controlled from a phone. Less water is wasted, and more food is grown.',
          passageHe:
            'השקיה בטפטוף היא המצאה ישראלית. היום משתמשים בה חקלאים ביותר ממאה מדינות. המים נשלחים בצינורות קטנים ישר אל הצמחים, ואת כל המערכת מפעילים מהטלפון. פחות מים מתבזבזים, ויותר מזון גדל.',
          questionEn: 'How is the system controlled?',
          questionHe: 'איך שולטים במערכת?',
          correct: 'From a phone.',
          wrong: ['By hand in the field.', 'From a big computer in Tel Aviv.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'The app is used by many students.',
              wrong: ['The app is use by many students.'],
              explainHe: 'אחרי is בא V3: used. המילה by אומרת מי עושה את הפעולה.',
              hintHe: 'בדקו את סוף הפועל שבא אחרי is.',
            },
            story: {
              passageEn: 'This robot is made in Haifa. It is controlled by a phone. It cleans the floor.',
              passageHe: 'הרובוט הזה מיוצר בחיפה. שולטים בו באמצעות טלפון. הוא מנקה את הרצפה.',
              questionEn: 'Where is the robot made?',
              questionHe: 'איפה הרובוט מיוצר?',
              correct: 'In Haifa.',
              wrong: ['In Eilat.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['cloud', 'sandwich'],
              ['hungry', 'brave'],
              ['sleep', 'laugh'],
              ['cry', 'arrive'],
              ['angry', 'sleepy'],
              ['loudly', 'often'],
              ['sandwich', 'feeling'],
              ['sleep', 'fall'],
            ],
          },
          master: {
            sentenceEn: 'Is this vehicle controlled by a driver, or does it drive itself?',
            sentenceHe: 'האם נהג שולט ברכב הזה, או שהוא נוהג בעצמו?',
            decoys: ['drove', 'are'],
            voiceEn: 'Where are these phones made?',
            voiceHe: 'איפה מייצרים את הטלפונים האלה?',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'Are these solar panels made in Israel?',
              wrong: [
                'Are these solar panels make in Israel?',
                'Is these solar panels made in Israel?',
                'Do these solar panels made in Israel?',
              ],
              explainHe:
                'panels הם רבים, ולכן Are בתחילת השאלה, ואחרי הנושא בא V3: made. בשאלה בסביל לא משתמשים ב-do.',
              hintEn: 'Check the first word and the verb form.',
            },
            story: {
              passageEn:
                'In a company in the north of Israel, a very special camera is made. The camera is the size of a pill, and it is swallowed by the patient. As it moves through the body, pictures are sent to a computer. Doctors can see problems inside the body without an operation, so most patients go home on the same day.',
              passageHe: '',
              questionEn: 'Why do most patients go home on the same day?',
              questionHe: '',
              correct: 'They do not need an operation.',
              wrong: ['The camera is very cheap.', 'The pictures are sent by mail.', 'The doctors work very fast.'],
            },
            storyHintEn: 'What can doctors do without opening the body?',
          },
        },
      },
    },
    {
      icon: '🍊',
      isBoss: true,
      titleEn: 'Boss: The Israeli Expo',
      titleHe: 'אתגר הבוס: התערוכה הישראלית',
      storyHookHe:
        'התערוכה הגדולה של תוצרת ישראל נפתחת! הציגו מוצרים והמצאות, והראו שאתם יודעים לומר מה מיוצר, איפה ועל ידי מי.',
      grammarTopic: 'Unit Boss: Present Simple Passive Review',
      skills: ['Boss Review', 'Present Simple Passive', 'Israeli Inventions'],
      sentenceEn: 'At the expo, new tools are shown by engineers from all over the country.',
      sentenceHe: 'בתערוכה, מהנדסים מכל הארץ מציגים כלים חדשים.',
      vocab: [
        ['engineer', 'noun', 'מהנדס / מהנדסת', '👷', 'The bridge is checked by an engineer every year.', 'מהנדס בודק את הגשר בכל שנה.'],
        ['process', 'noun', 'תהליך', '🔄', 'Paper is made in a long process.', 'נייר מיוצר בתהליך ארוך.'],
        ['model', 'noun', 'דגם', '🚘', 'Two new models are shown at the expo.', 'שני דגמים חדשים מוצגים בתערוכה.'],
        ['tool', 'noun', 'כלי (עבודה)', '🔧', 'This tool is used to fix bikes.', 'משתמשים בכלי הזה כדי לתקן אופניים.'],
        ['extremely', 'adverb', 'מאוד / ביותר', '‼️', 'The new phone is extremely thin, and it is made in Israel.', 'הטלפון החדש דק מאוד, והוא מיוצר בישראל.'],
        ['everyday', 'adjective', 'יומיומי', '📅', 'Cherry tomatoes are now eaten as an everyday food in many countries.', 'עגבניות שרי נאכלות היום כמזון יומיומי בהרבה מדינות.'],
        ['practical', 'adjective', 'שימושי / מעשי', '👍', 'This bag is practical: it is used for school and for sport.', 'התיק הזה שימושי: משתמשים בו לבית הספר ולספורט.'],
        ['success', 'noun', 'הצלחה', '🏆', 'The new game is played all over the world. It is a big success.', 'במשחק החדש משחקים בכל העולם. הוא הצלחה גדולה.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'pajamas', translationHe: 'פיג׳מה' },
          { wordEn: 'snail', translationHe: 'חילזון' },
        ],
        shortSentenceEn: 'The tools are made here.',
        shortSentenceHe: 'הכלים מיוצרים כאן.',
        rule: {
          questionEn: 'Complete: "Every new model ____ by an engineer before it is sold."',
          correct: 'is tested',
          wrong: ['are tested', 'is test'],
          explainHe: 'model הוא יחיד, ולכן is, ואחריו V3: tested.',
          hintHe: 'כמה דגמים יש במשפט? ואיזו צורה של הפועל באה בסביל?',
        },
        story: {
          passageEn:
            'Our class visited the Israeli Expo in Tel Aviv. In one hall, everyday tools are shown, like a practical knife for campers. In another hall, a new car model is presented by two young engineers. The whole process is explained on big screens. The expo is extremely popular, and it is visited by thousands of students every year.',
          passageHe:
            'הכיתה שלנו ביקרה בתערוכה הישראלית בתל אביב. באולם אחד מוצגים כלים יומיומיים, כמו סכין שימושית למטיילים. באולם אחר שני מהנדסים צעירים מציגים דגם חדש של מכונית. כל התהליך מוסבר על מסכים גדולים. התערוכה פופולרית מאוד, ואלפי תלמידים מבקרים בה בכל שנה.',
          questionEn: 'Who presents the new car model?',
          questionHe: 'מי מציג את דגם המכונית החדש?',
          correct: 'Two young engineers.',
          wrong: ['Our class.', 'Thousands of students.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'The cars are made in a factory.',
              wrong: ['The cars is made in a factory.'],
              explainHe: 'cars הן רבות, ולכן are.',
              hintHe: 'כמה מכוניות יש? איזה פועל עזר מתאים?',
            },
            story: {
              passageEn: 'The expo is big. New tools are shown there. Noam likes a red bike. It is made in Israel.',
              passageHe: 'התערוכה גדולה. מציגים בה כלים חדשים. נועם אוהב אופניים אדומים. הם מיוצרים בישראל.',
              questionEn: 'What does Noam like?',
              questionHe: 'מה נועם אוהב?',
              correct: 'A red bike.',
              wrong: ['A blue car.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['onion', 'umbrella'],
              ['pillow', 'sunset'],
              ['silence', 'thunder'],
              ['cloud', 'song'],
              ['yesterday', 'under'],
              ['angry', 'asleep'],
              ['jealous', 'asleep'],
              ['sneeze', 'pillow'],
            ],
          },
          master: {
            sentenceEn: 'Every year, the expo is visited by thousands of people from many countries.',
            sentenceHe: 'בכל שנה מבקרים בתערוכה אלפי אנשים מהרבה מדינות.',
            decoys: ['visits', 'are'],
            voiceEn: 'This practical tool is made in Haifa.',
            voiceHe: 'הכלי השימושי הזה מיוצר בחיפה.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'Israeli cherry tomatoes are sold in many countries.',
              wrong: [
                'Israeli cherry tomatoes is sold in many countries.',
                'Israeli cherry tomatoes are sell in many countries.',
                'Israeli cherry tomatoes are selled in many countries.',
              ],
              explainHe: 'tomatoes הן ברבים, ולכן are. ה-V3 של sell הוא sold (פועל לא רגיל), לא selled.',
              hintEn: 'Check is / are and the V3 form of sell.',
            },
            story: {
              passageEn:
                'At the end of the expo, the visitors vote for the best invention. This year, the winner is not a robot or an expensive car. It is a simple bottle that is filled with water from the air. The bottle is extremely practical for hikers and soldiers, and it is made of recycled plastic. The young engineer who designed it says the idea came to her during a long, hot army hike.',
              passageHe: '',
              questionEn: 'Why did the visitors probably choose the bottle?',
              questionHe: '',
              correct: 'It solves a real everyday problem.',
              wrong: ['It is the most expensive invention.', 'It looks like a robot.', 'It was designed by a famous company.'],
            },
            storyHintEn: 'Think about who uses the bottle and why.',
          },
        },
      },
    },
  ],
};

/** The core-3 pack's grade 8 unit (`../../registry.ts`) */
export const CORE_3_GRADE_8_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildMiddleSchoolGrade('grade-8', [UNIT_CORE_3]);
