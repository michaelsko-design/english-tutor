import { buildHighSchoolGrade, type HighSchoolUnitSpec } from '../../../highSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-3 grade 11 unit (Band III): investigations with the past perfect continuous, new to the
 * app; the Boss sets it against the past perfect simple. Band III Core I (4-point) words the app
 * never had. Example Hebrew addresses the learner in the plural; hints and explanations are
 * gender-neutral plural.
 */
const UNIT_CORE_3: HighSchoolUnitSpec = {
  ...packUnitNumbers('core-3'),
  titleEn: 'Investigations',
  titleHe: 'חקירות',
  subtitleHe:
    'עונה 3: מה קרה כאן? חוקרים תעלומות ומגלים מה נמשך לפני שמשהו קרה, עם past perfect continuous: had been + V-ing',
  badgeEmoji: '🔍',
  missions: [
    {
      icon: '🕵️',
      titleEn: 'The Missing Necklace: What Had Been Going On?',
      titleHe: 'השרשרת שנעלמה: מה נמשך לפני כן?',
      storyHookHe:
        'מישהו שדד חנות תכשיטים ברחוב הראשי! נלמד לתאר פעולה שנמשכה זמן מה עד רגע מסוים בעבר, עם had been + V-ing: The guard had been sleeping for an hour.',
      grammarTopic: 'Past Perfect Continuous (had been + V-ing): what had been happening',
      skills: ['Past Perfect Continuous', 'Crime & Mystery', 'Describing Evidence'],
      sentenceEn: 'The guard had been sleeping for an hour when the thieves arrived.',
      sentenceHe: 'השומר ישן כבר שעה כשהגנבים הגיעו.',
      vocab: [
        ['rob', 'verb', 'לשדוד', '💰', 'Two men robbed the jewelry shop after they had been watching it for days.', 'שני גברים שדדו את חנות התכשיטים אחרי שעקבו אחריה במשך ימים.'],
        ['victim', 'noun', 'קורבן', '🙍', 'The victim had been walking home alone when a man took his phone.', 'הקורבן הלך הביתה לבד כשאדם לקח לו את הטלפון.'],
        ['incident', 'noun', 'תקרית / אירוע', '🚨', 'Before the incident, the two neighbors had been arguing for weeks.', 'לפני התקרית, שני השכנים התווכחו במשך שבועות.'],
        ['chase', 'verb', 'לרדוף אחרי', '🏃', 'The police officer had been chasing the thief for ten minutes when he finally caught him.', 'השוטר רדף אחרי הגנב עשר דקות כשסוף סוף תפס אותו.'],
        ['mess', 'noun', 'בלגן / אי-סדר', '🗑️', 'The room was a mess, so the detective knew someone had been searching it.', 'החדר היה בבלגן, אז הבלש ידע שמישהו חיפש בו.'],
        ['apparent', 'adjective', 'ברור / גלוי לעין', '👁️', 'It was apparent that the dog had been digging in the garden.', 'היה ברור שהכלב חפר בגינה.'],
        ['spy', 'noun', 'מרגל / מרגלת', '🕶️', 'The spy had been working at the embassy for years before anyone noticed.', 'המרגל עבד בשגרירות במשך שנים לפני שמישהו שם לב.'],
        ['frighten', 'verb', 'להפחיד', '😨', 'The strange noises frightened the children, who had been sleeping in the tent.', 'הרעשים המוזרים הפחידו את הילדים, שישנו באוהל.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'feather', translationHe: 'נוצה' },
          { wordEn: 'teapot', translationHe: 'קנקן תה' },
        ],
        shortSentenceEn: 'She had been waiting for hours.',
        shortSentenceHe: 'היא חיכתה במשך שעות.',
        rule: {
          questionEn: 'Complete: "When the police arrived, the neighbors ____ for twenty minutes."',
          correct: 'had been waiting',
          wrong: ['have been waiting', 'had been wait'],
          explainHe:
            'ההמתנה התחילה לפני שהמשטרה הגיעה ונמשכה עד אז, והכול בעבר, ולכן past perfect continuous: had been + פועל עם ing. have been מתאר פעולה שנמשכת עד עכשיו.',
          hintHe: 'הפעולה נמשכה עד רגע מסוים בעבר. איזה פועל עזר מתאים לעבר, ובאיזו צורה בא הפועל?',
        },
        story: {
          passageEn:
            'Last Friday, someone robbed a small jewelry shop on Herzl Street. The owner, Mr. Levi, had been working in the back room all morning, so he did not hear anything. When he came out, the shop was a mess and a gold necklace was missing. A neighbor told the police that a young man had been standing outside the shop for an hour. The police are now looking at the street cameras.',
          passageHe:
            'ביום שישי שעבר, מישהו שדד חנות תכשיטים קטנה ברחוב הרצל. הבעלים, מר לוי, עבד כל הבוקר בחדר האחורי, ולכן לא שמע כלום. כשהוא יצא, החנות הייתה בבלגן ושרשרת זהב נעלמה. שכנה סיפרה למשטרה שבחור צעיר עמד מחוץ לחנות במשך שעה. המשטרה בודקת עכשיו את מצלמות הרחוב.',
          questionEn: 'Why did Mr. Levi not hear anything?',
          questionHe: 'למה מר לוי לא שמע כלום?',
          correct: 'He was in the back room.',
          wrong: ['He was out at lunch.', 'He was talking on the phone.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'They had been playing for an hour.',
              wrong: ['They had been play for an hour.'],
              explainHe: 'אחרי had been בא פועל עם ing (playing).',
              hintHe: 'בדקו את צורת הפועל בסוף.',
            },
            story: {
              passageEn: 'Dan came home and saw a big mess. His dog had been playing with the pillows all day!',
              passageHe: 'דן חזר הביתה וראה בלגן גדול. הכלב שלו שיחק עם הכריות כל היום!',
              questionEn: 'Who made the mess?',
              questionHe: 'מי עשה את הבלגן?',
              correct: 'The dog.',
              wrong: ["Dan's sister."],
            },
          },
          challenger: {
            clozeWrong: [
              ['sneeze', 'whisper'],
              ['carrot', 'pillow'],
              ['spoon', 'eyebrow'],
              ['sneeze', 'bake'],
              ['carrot', 'whale'],
              ['wooden', 'hungry'],
              ['pillow', 'cucumber'],
              ['fold', 'peel'],
            ],
          },
          master: {
            sentenceEn: 'By the time the detective arrived, the witnesses had been waiting for two hours.',
            sentenceHe: 'עד שהבלש הגיע, העדים חיכו כבר שעתיים.',
            decoys: ['have', 'waited'],
            voiceEn: 'I had been reading for an hour when the lights went out.',
            voiceHe: 'קראתי כבר שעה כשהאורות כבו.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'How long had they been watching the house before the robbery?',
              wrong: [
                'How long had they been watch the house before the robbery?',
                'How long have they been watching the house before the robbery?',
                'How long had been they watching the house before the robbery?',
              ],
              explainHe: 'בשאלה had בא לפני הנושא, ואחריו been + פועל עם ing. השוד היה בעבר, ולכן had ולא have.',
              hintEn: 'Check the word order, the helping verb and the verb form.',
            },
            story: {
              passageEn:
                'For weeks, the people of a quiet street had been finding their garden lights broken every morning. Some blamed teenagers, and others blamed a neighbor they did not like. Then one night, a girl set up a camera in her garden. In the morning, she watched the video and laughed. A family of jackals had been coming into the gardens at night and biting the lights, which looked a bit like small animals. The neighbors who had been accusing each other felt rather embarrassed.',
              passageHe: '',
              questionEn: 'Why did some neighbors feel embarrassed?',
              questionHe: '',
              correct: 'They had blamed the wrong people.',
              wrong: ['The girl had broken the lights herself.', 'The camera had recorded them at night.', 'They had been feeding the jackals.'],
            },
            storyHintEn: 'Who had the neighbors blamed before the video?',
          },
        },
      },
    },
    {
      icon: '🔬',
      titleEn: 'The Lab Mystery: Why Had the Water Turned Green?',
      titleHe: 'תעלומה במעבדה: למה המים הפכו לירוקים?',
      storyHookHe:
        'במעבדת בית הספר המים במיכל הפכו לירוקים! נחקור כמו מדענים ונסביר מה גרם לתוצאה בעבר, עם had been + V-ing: The pump had been leaking for days.',
      grammarTopic: 'Past Perfect Continuous for Causes and Evidence (had been + V-ing)',
      skills: ['Past Perfect Continuous', 'Science Investigation', 'Explaining Causes'],
      sentenceEn: 'The water had turned green because the pump had been leaking for days.',
      sentenceHe: 'המים הפכו לירוקים כי המשאבה דלפה במשך ימים.',
      vocab: [
        ['calculate', 'verb', 'לחשב', '🧮', 'We calculated how long the experiment had been running.', 'חישבנו כמה זמן הניסוי כבר רץ.'],
        ['layer', 'noun', 'שכבה', '🍰', 'A thin layer of dust showed that nobody had been using the machine.', 'שכבה דקה של אבק הראתה שאף אחד לא השתמש במכונה.'],
        ['liquid', 'noun', 'נוזל', '💧', 'The green liquid had been dripping onto the floor all night.', 'הנוזל הירוק טפטף על הרצפה כל הלילה.'],
        ['powder', 'noun', 'אבקה', '🧂', 'The students had been mixing the white powder with water.', 'התלמידים ערבבו את האבקה הלבנה עם מים.'],
        ['mixture', 'noun', 'תערובת', '🧪', 'The mixture was hot because it had been sitting in the sun.', 'התערובת הייתה חמה כי היא עמדה בשמש.'],
        ['laser', 'noun', 'לייזר', '🔦', 'The laser had been working for hours, so it was very hot.', 'הלייזר פעל במשך שעות, אז הוא היה חם מאוד.'],
        ['tube', 'noun', 'מבחנה / צינור', '🧫', 'There was a crack in the glass tube, and water had been leaking out.', 'היה סדק במבחנה, ומים דלפו ממנה החוצה.'],
        ['pump', 'noun', 'משאבה', '⛽', 'The pump had been making a strange noise before it stopped.', 'המשאבה השמיעה רעש מוזר לפני שהיא הפסיקה לעבוד.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'saddle', translationHe: 'אוכף' },
          { wordEn: 'doorbell', translationHe: 'פעמון דלת' },
        ],
        shortSentenceEn: 'It had been raining all night.',
        shortSentenceHe: 'ירד גשם כל הלילה.',
        rule: {
          questionEn: 'Complete: "Her eyes were red because she ____ at the screen for hours."',
          correct: 'had been looking',
          wrong: ['have been looking', 'had been look'],
          explainHe:
            'העיניים היו אדומות (תוצאה בעבר) כי פעולה נמשכה לפני כן: had been + פועל עם ing. have been מתאר משהו שנמשך עד עכשיו.',
          hintHe: 'יש כאן תוצאה בעבר וסיבה שנמשכה לפניה. איזו צורה מתאימה לסיבה?',
        },
        story: {
          passageEn:
            'On Monday morning, the science teacher found the fish tank in the school lab full of green water. The students had been studying the fish for a month, so they were worried. They checked the tank and found a crack in the pump. It had been leaking for days, and the water had not been moving. Without moving water, tiny green plants called algae had been growing fast. The class calculated how much water to change and fixed the pump.',
          passageHe:
            'ביום שני בבוקר, המורה למדעים מצא את האקווריום במעבדת בית הספר מלא במים ירוקים. התלמידים חקרו את הדגים במשך חודש, אז הם דאגו. הם בדקו את האקווריום ומצאו סדק במשאבה. היא דלפה במשך ימים, והמים לא זרמו. בלי מים זורמים, צמחים ירוקים זעירים שנקראים אצות גדלו מהר. הכיתה חישבה כמה מים צריך להחליף ותיקנה את המשאבה.',
          questionEn: 'Why had the algae been growing fast?',
          questionHe: 'למה האצות גדלו מהר?',
          correct: 'The water was not moving.',
          wrong: ['The fish had been eating too much.', 'The teacher had added a powder.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'He had been working all day.',
              wrong: ['He had working all day.'],
              explainHe: 'צריך גם had וגם been לפני הפועל עם ing.',
              hintHe: 'בדקו אם חסרה מילה לפני הפועל.',
            },
            story: {
              passageEn: 'The floor was wet. Water had been dripping from the tube all night. Maya cleaned it up.',
              passageHe: 'הרצפה הייתה רטובה. מים טפטפו מהצינור כל הלילה. מאיה ניקתה את זה.',
              questionEn: 'Why was the floor wet?',
              questionHe: 'למה הרצפה הייתה רטובה?',
              correct: 'Water had been dripping.',
              wrong: ['Maya had spilled milk.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['sneeze', 'peel'],
              ['elephant', 'sandwich'],
              ['brick', 'chair'],
              ['ceiling', 'bicycle'],
              ['idea', 'silence'],
              ['banana', 'cloud'],
              ['song', 'idea'],
              ['carpet', 'sandwich'],
            ],
          },
          master: {
            sentenceEn: 'The scientists had been testing the liquid for weeks before they found the answer.',
            sentenceHe: 'המדענים בדקו את הנוזל במשך שבועות לפני שמצאו את התשובה.',
            decoys: ['have', 'tested'],
            voiceEn: 'The lab smelled strange because someone had been cooking there.',
            voiceHe: 'המעבדה הריחה מוזר כי מישהו בישל שם.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'The machine was hot because it had been running all night.',
              wrong: [
                'The machine was hot because it had been run all night.',
                'The machine was hot because it has been running all night.',
                'The machine was hot because it had being running all night.',
              ],
              explainHe: 'הסיבה נמשכה לפני תוצאה בעבר: had been + פועל עם ing. לא has (זה עבר), לא being ולא פועל בסיס.',
              hintEn: 'Check the tense and the verb form after it.',
            },
            story: {
              passageEn:
                'In 1928, Alexander Fleming came back from a holiday to his laboratory in London. Before he left, he had been growing bacteria in small glass dishes. He noticed that a blue-green mould had been growing on one of the dishes, and that around the mould, the bacteria had died. Instead of throwing the dish away, Fleming studied it carefully. His discovery led to penicillin, a medicine that has saved millions of lives.',
              passageHe: '',
              questionEn: "What made Fleming's discovery possible?",
              questionHe: '',
              correct: 'He looked closely at a spoiled dish.',
              wrong: [
                'He had been testing a new medicine on patients.',
                'He had cleaned every dish before his holiday.',
                'A friend sent him mould from another country.',
              ],
            },
            storyHintEn: 'What did Fleming do when he noticed the mould?',
          },
        },
      },
    },
    {
      icon: '📰',
      isBoss: true,
      titleEn: 'Boss: The Investigative Report',
      titleHe: 'אתגר הבוס: כתבת התחקיר',
      storyHookHe:
        'אתגר הבוס! אתם עיתונאים צעירים שחוקרים שערורייה בעירייה. הראו שאתם מבחינים בין had been + V-ing (פעולה שנמשכה) לבין had + V3 (פעולה שהסתיימה) לפני רגע בעבר.',
      grammarTopic: 'Review: Past Perfect Continuous vs. Past Perfect Simple',
      skills: ['Boss Challenge', 'Past Perfect Forms', 'Investigative Journalism'],
      sentenceEn: 'The reporters had been asking questions for months before the mayor finally answered.',
      sentenceHe: 'הכתבים שאלו שאלות במשך חודשים לפני שראש העיר סוף סוף ענה.',
      vocab: [
        ['scandal', 'noun', 'שערורייה', '📰', "The scandal began after a journalist had been checking the city's accounts.", 'השערורייה התחילה אחרי שעיתונאית בדקה את החשבונות של העירייה.'],
        ['justice', 'noun', 'צדק', '⚖️', 'The families had been waiting for justice for ten years.', 'המשפחות חיכו לצדק במשך עשר שנים.'],
        ['punish', 'verb', 'להעניש', '🚫', 'The court punished the company that had been polluting the river.', 'בית המשפט העניש את החברה שזיהמה את הנהר.'],
        ['as a matter of fact', 'phrase', 'למעשה / בעצם', '☝️', 'As a matter of fact, the mayor had known about the problem for years.', 'למעשה, ראש העיר ידע על הבעיה כבר שנים.'],
        ['involvement', 'noun', 'מעורבות', '🤝', 'The police are checking his involvement in the robbery.', 'המשטרה בודקת את המעורבות שלו בשוד.'],
        ['nonsense', 'noun', 'שטויות', '🙄', 'The manager said the story was nonsense, but the reporters had proof.', 'המנהל אמר שהסיפור הוא שטויות, אבל לכתבים היו הוכחות.'],
        ['weird', 'adjective', 'מוזר', '🤨', 'Something weird had been happening in the office every night.', 'משהו מוזר קרה במשרד בכל לילה.'],
        ['urgent', 'adjective', 'דחוף', '❗', 'The editor sent us a very urgent message: the story was going online at six.', 'העורכת שלחה לנו הודעה דחופה מאוד: הכתבה עולה לרשת בשש.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'paddle', translationHe: 'משוט' },
          { wordEn: 'hedgehog', translationHe: 'קיפוד' },
        ],
        shortSentenceEn: 'They had been lying for years.',
        shortSentenceHe: 'הם שיקרו במשך שנים.',
        rule: {
          questionEn:
            'Complete: "When the editor called, Dana ____ the article for three hours, but it still wasn\'t finished."',
          correct: 'had been writing',
          wrong: ['had written', 'have been writing'],
          explainHe:
            'הכתיבה נמשכה שלוש שעות ועדיין לא הסתיימה, ולכן had been writing. had written מתאר פעולה שהסתיימה, ו-have been writing מתאים להווה.',
          hintHe: 'האם הכתבה הסתיימה כשהעורך התקשר? ואיזה פועל עזר מתאים לעבר?',
        },
        story: {
          passageEn:
            "Last year, a student newspaper in Beersheba published a scandal. For months, two students had been looking into why the town's sports center was always closed. As a matter of fact, the money for the center had been going to a company owned by a city worker. At first, the mayor called the story nonsense. But after the students had shown their documents on the news, the city worker was punished and the center opened again.",
          passageHe:
            'בשנה שעברה, עיתון של תלמידים בבאר שבע פרסם שערורייה. במשך חודשים, שני תלמידים בדקו למה מרכז הספורט העירוני תמיד סגור. למעשה, הכסף של המרכז הלך לחברה שהייתה בבעלות של עובד עירייה. בהתחלה ראש העיר אמר שהסיפור הוא שטויות. אבל אחרי שהתלמידים הראו את המסמכים שלהם בחדשות, עובד העירייה נענש והמרכז נפתח שוב.',
          questionEn: 'What happened after the students showed their documents?',
          questionHe: 'מה קרה אחרי שהתלמידים הראו את המסמכים שלהם?',
          correct: 'The center opened again.',
          wrong: ['The newspaper was closed.', 'The mayor gave them a prize.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'She had been crying, so her eyes were red.',
              wrong: ['She had been cry, so her eyes were red.'],
              explainHe: 'אחרי had been בא פועל עם ing (crying).',
              hintHe: 'בדקו את צורת הפועל הראשון במשפט.',
            },
            story: {
              passageEn:
                'The reporter was very tired. She had been writing her story all night. In the morning, it was in the newspaper.',
              passageHe: 'הכתבת הייתה עייפה מאוד. היא כתבה את הכתבה שלה כל הלילה. בבוקר היא הופיעה בעיתון.',
              questionEn: 'Why was the reporter tired?',
              questionHe: 'למה הכתבת הייתה עייפה?',
              correct: 'She had been writing all night.',
              wrong: ['She had been running all day.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['pillow', 'giraffe'],
              ['spaghetti', 'eyebrow'],
              ['bake', 'tickle'],
              ['good night', 'happy birthday'],
              ['sandwich', 'haircut'],
              ['breakfast', 'furniture'],
              ['wooden', 'delicious'],
              ['rainy', 'wooden'],
            ],
          },
          master: {
            sentenceEn: 'By the time the story came out, the company had been hiding the truth for years.',
            sentenceHe: 'עד שהכתבה פורסמה, החברה הסתירה את האמת כבר שנים.',
            decoys: ['has', 'hidden'],
            voiceEn: 'They had been working on the report since January.',
            voiceHe: 'הם עבדו על הדוח מאז ינואר.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'Before the trial, the witness had already spoken to the police twice.',
              wrong: [
                'Before the trial, the witness had already been speaking to the police twice.',
                'Before the trial, the witness has already spoken to the police twice.',
                'Before the trial, the witness had already speak to the police twice.',
              ],
              explainHe:
                'כשסופרים כמה פעמים משהו קרה (twice), הפעולה הסתיימה, ולכן had + V3 (had spoken) ולא had been + V-ing. לפני אירוע בעבר: had ולא has.',
              hintEn: 'The action happened twice. Is it finished or ongoing?',
            },
            story: {
              passageEn:
                'Noa, a young reporter, received an anonymous letter claiming that a famous restaurant had been serving old meat. Her editor wanted to publish the story immediately, because another newspaper was also investigating. Noa refused. For two weeks she had been checking the facts, and she still had no proof. In the end, she discovered that the letter came from a rival restaurant owner. The other newspaper published the story anyway and later had to apologize to the restaurant.',
              passageHe: '',
              questionEn: "What can we learn from Noa's decision?",
              questionHe: '',
              correct: 'Checking facts can protect a reporter.',
              wrong: [
                'Being first is more important than being right.',
                'Editors usually know more than their reporters.',
                'Restaurants should never get anonymous letters.',
              ],
            },
            storyHintEn: 'What happened to the newspaper that published first?',
          },
        },
      },
    },
  ],
};

/** The core-3 pack's grade 11 unit (`../../registry.ts`) */
export const CORE_3_GRADE_11_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildHighSchoolGrade('grade-11', [UNIT_CORE_3]);
