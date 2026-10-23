import { buildMiddleSchoolGrade, type MiddleSchoolUnitSpec } from '../../../middleSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * Grade 9 "Season 2" (core-plus): Past Perfect (had + V3) after unit 1's Present Perfect and the
 * narrative tenses, then reported statements (said / told, backshift). Unit 22's Boss is the
 * grade's new finale before high school.
 */
const UNITS: MiddleSchoolUnitSpec[] = [
  {
    ...packUnitNumbers('core-plus', 0),
    titleEn: 'Season 2: The Museum Mystery',
    titleHe: 'עונה 2: התעלומה במוזיאון',
    subtitleHe: 'הרפתקאות בונוס: Past Perfect (had + V3) — מה קרה עוד לפני שקרה משהו אחר בעבר',
    badgeEmoji: '🕵️',
    missions: [
      {
        icon: '🔍',
        titleEn: 'The Empty Frame: What Had Happened?',
        titleHe: 'המסגרת הריקה: מה קרה קודם?',
        storyHookHe:
          'עונה 2 נפתחת! ציור יקר נעלם מהמוזיאון בלילה. כדי לשחזר את האירועים נלמד את Past Perfect (had + V3): פעולה שקרתה עוד לפני פעולה אחרת בעבר.',
        grammarTopic: 'Past Perfect (had + V3) for the Earlier Past Action',
        skills: ['Past Perfect', 'Mystery Vocabulary', 'Sequencing Events'],
        sentenceEn: 'When the guard reached the gallery, the thief had already escaped through the roof.',
        sentenceHe: 'כשהשומר הגיע לאולם, הגנב כבר ברח דרך הגג.',
        vocab: [
          ['witness', 'noun / verb', 'עד ראייה / לחזות ב-', '👀', 'A witness saw a tall figure near the back door.', 'עד ראייה ראה דמות גבוהה ליד הדלת האחורית.'],
          ['suspect', 'noun / verb', 'חשוד / לחשוד', '🕵️', 'The police questioned the main suspect for two hours.', 'המשטרה חקרה את החשוד העיקרי במשך שעתיים.'],
          ['clue', 'noun', 'רמז / ראיה', '🔎', 'The detective found an important clue under the window.', 'הבלש מצא רמז חשוב מתחת לחלון.'],
          ['disappear', 'verb', 'להיעלם', '💨', 'The famous painting disappeared during the night.', 'הציור המפורסם נעלם במהלך הלילה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'invitation', translationHe: 'הזמנה' },
            { wordEn: 'neighbourhood', translationHe: 'שכונה' },
          ],
          shortSentenceEn: 'The thief had escaped.',
          shortSentenceHe: 'הגנב ברח קודם לכן.',
          rule: {
            questionEn: 'Which sentence shows the earlier action in the Past Perfect?',
            correct: 'The alarm had stopped before the police arrived.',
            wrong: [
              'The alarm had stop before the police arrived.',
              'The alarm has stopped before the police arrived.',
            ],
            explainHe:
              'ב-Past Perfect משתמשים ב-had ואחריו V3 (stopped). has stopped הוא Present Perfect, והוא לא מתאים לסיפור שכולו בעבר.',
            hintHe: 'הסיפור כולו בעבר. בדקו את פועל העזר ואת צורת הפועל שאחריו.',
          },
          story: {
            passageEn:
              'On Sunday morning, the cleaner at the city museum noticed an empty frame on the wall. Someone had removed a small painting during the night. The guard had locked every door at eight o’clock, so the thief had probably hidden inside the building. A visitor had noticed a man in a grey coat near the gift shop before closing time.',
            passageHe:
              'ביום ראשון בבוקר, המנקה במוזיאון העירוני הבחין במסגרת ריקה על הקיר. מישהו הוריד ציור קטן במהלך הלילה. השומר נעל את כל הדלתות בשעה שמונה, כך שהגנב כנראה הסתתר בתוך הבניין. מבקר הבחין באיש במעיל אפור ליד חנות המתנות לפני שעת הסגירה.',
            questionEn: 'When had the guard locked every door?',
            questionHe: 'מתי השומר נעל את כל הדלתות?',
            correct: 'At eight o’clock.',
            wrong: ['At midnight.', 'On Sunday morning.'],
          },
        },
      },
      {
        icon: '🔑',
        titleEn: 'Before the Alarm: Timeline of the Night',
        titleHe: 'לפני האזעקה: ציר הזמן של הלילה',
        storyHookHe:
          'מתי בדיוק הכול קרה? נבנה ציר זמן עם before, after ו-by the time, נשאל שאלות כמו Had he...? ונענה בשלילה עם hadn’t + V3.',
        grammarTopic: 'Past Perfect with Before, After & By the Time; Questions and Negatives',
        skills: ['Time Connectors', 'Past Perfect Questions', 'Timeline Building'],
        sentenceEn: 'By the time the alarm rang, nobody had noticed the open window.',
        sentenceHe: 'עד שהאזעקה צלצלה, אף אחד לא שם לב לחלון הפתוח.',
        vocab: [
          ['investigate', 'verb', 'לחקור', '🔍', 'Two officers came to investigate the strange noise.', 'שני שוטרים הגיעו לחקור את הרעש המוזר.'],
          ['alarm', 'noun', 'אזעקה', '🚨', 'The alarm woke up the whole street.', 'האזעקה העירה את כל הרחוב.'],
          ['footprint', 'noun', 'טביעת רגל', '👣', 'There was a muddy footprint on the marble floor.', 'הייתה טביעת רגל בוצית על רצפת השיש.'],
          ['security', 'noun', 'אבטחה / ביטחון', '🛡️', 'The museum improved its security after the robbery.', 'המוזיאון שיפר את האבטחה שלו אחרי השוד.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'recipe', translationHe: 'מתכון' },
            { wordEn: 'furniture', translationHe: 'רהיטים' },
          ],
          shortSentenceEn: 'Nobody had noticed the window.',
          shortSentenceHe: 'אף אחד לא שם לב לחלון.',
          rule: {
            questionEn: 'Complete the question: "_______ the guard checked the cameras before he went home?"',
            correct: 'Had',
            wrong: ['Did', 'Has'],
            explainHe: 'בשאלה ב-Past Perfect, had בא לפני הנושא, ואחרי הנושא בא V3 (checked). הסיפור בעבר, ולכן לא has.',
            hintHe: 'בדקו את צורת הפועל checked ואת הזמן של הסיפור: איזה פועל עזר בא עם V3 כשמדברים על עבר שלפני עבר?',
          },
          story: {
            passageEn:
              'The investigation team arrived at the museum at seven in the morning. By then, the night guard had already gone home. The detectives found a footprint near the window, but it had rained heavily, so the mark was not clear. After they had watched the security videos, they understood that the cameras had not worked since midnight.',
            passageHe:
              'צוות החקירה הגיע למוזיאון בשבע בבוקר. עד אז, שומר הלילה כבר הלך הביתה. הבלשים מצאו טביעת רגל ליד החלון, אבל ירד גשם חזק, ולכן הסימן לא היה ברור. אחרי שצפו בסרטוני האבטחה, הם הבינו שהמצלמות לא עבדו מאז חצות.',
            questionEn: 'Since when had the cameras not worked?',
            questionHe: 'ממתי המצלמות לא עבדו?',
            correct: 'Since midnight.',
            wrong: ['Since seven in the morning.', 'Since the day before.'],
          },
        },
      },
      {
        icon: '🌟',
        isBoss: true,
        titleEn: 'Boss: Case Closed — The Detective’s Report',
        titleHe: 'אתגר הבוס: התיק נסגר — דוח הבלש',
        storyHookHe:
          'אתגר בוס לפרק! מחברים את כל הרמזים: נשלב Past Simple ו-Past Perfect כדי לספר את כל סיפור השוד בסדר הנכון.',
        grammarTopic: 'Review: Past Perfect vs. Past Simple in Narratives',
        skills: ['Boss Challenge', 'Narrative Tenses', 'Mystery Solving'],
        sentenceEn: 'The detective finally solved the mystery: the painting had never left the building.',
        sentenceHe: 'הבלש פתר סוף סוף את התעלומה: הציור מעולם לא יצא מהבניין.',
        vocab: [
          ['mystery', 'noun', 'תעלומה', '❓', 'The missing painting remained a mystery for a week.', 'הציור החסר נשאר תעלומה במשך שבוע.'],
          ['detective', 'noun', 'בלש', '🕵️', 'A young detective noticed what everyone else had missed.', 'בלש צעיר שם לב למה שכל האחרים פספסו.'],
          ['reveal', 'verb', 'לחשוף / לגלות', '💡', 'The cameras revealed a hidden door behind the shelves.', 'המצלמות חשפו דלת נסתרת מאחורי המדפים.'],
          ['confess', 'verb', 'להודות (באשמה)', '🗣️', 'In the end, the night cleaner confessed to the crime.', 'בסוף, המנקה של הלילה הודה בפשע.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'scholarship', translationHe: 'מלגה' },
            { wordEn: 'souvenir', translationHe: 'מזכרת' },
          ],
          shortSentenceEn: 'The detective solved the case.',
          shortSentenceHe: 'הבלש פתר את התיק.',
          rule: {
            questionEn: 'Which sentence puts the two past actions in the correct order?',
            correct: 'When we arrived at the gallery, the tour had already started.',
            wrong: [
              'When we had arrived at the gallery, the tour already started.',
              'When we arrive at the gallery, the tour had already started.',
            ],
            explainHe:
              'הפעולה שקרתה קודם (הסיור התחיל) באה ב-Past Perfect: had started. הפעולה המאוחרת (הגענו) באה ב-Past Simple: arrived.',
            hintHe: 'מה קרה קודם: ההגעה שלנו או תחילת הסיור? הפעולה המוקדמת יותר מקבלת את had, וכל הסיפור בעבר.',
          },
          story: {
            passageEn:
              'For a week, the city talked about nothing but the missing painting. Then a young detective checked the museum’s old building plans. She discovered a storage room that the builders had closed many years earlier. Inside, she found the painting wrapped in a blanket. The thief had hidden it there and had planned to take it out later.',
            passageHe:
              'במשך שבוע, העיר לא דיברה על שום דבר מלבד הציור החסר. ואז חוקרת צעירה בדקה את תוכניות הבנייה הישנות של המוזיאון. היא גילתה מחסן שהבנאים סגרו שנים רבות קודם לכן. בפנים היא מצאה את הציור עטוף בשמיכה. הגנב החביא אותו שם ותכנן להוציא אותו מאוחר יותר.',
            questionEn: 'Where did the detective find the painting?',
            questionHe: 'איפה החוקרת מצאה את הציור?',
            correct: 'In an old storage room inside the museum.',
            wrong: ['In a car outside the city.', 'In the museum gift shop.'],
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('core-plus', 1),
    titleEn: 'Season 2: Voices from the Expedition',
    titleHe: 'עונה 2: קולות מהמשלחת',
    subtitleHe: 'דיבור עקיף (Reported Speech): said / told והזזת הזמנים אחורה — גמר העונה בדרך לתיכון',
    badgeEmoji: '🗺️',
    missions: [
      {
        icon: '❄️',
        titleEn: 'Messages from the Ice: She Said That…',
        titleHe: 'הודעות מהקרח: היא אמרה ש...',
        storyHookHe:
          'משלחת של מדענים צעירים נמצאת באנטארקטיקה! נלמד למסור מה הם אמרו בדיבור עקיף: הזמן זז צעד אחורה, is הופך ל-was ו-Present Simple הופך ל-Past Simple.',
        grammarTopic: 'Reported Statements with Said: Backshift of Present Tenses',
        skills: ['Reported Speech', 'Backshift', 'Expedition Vocab'],
        sentenceEn: 'The team leader said that the ice was melting faster than ever.',
        sentenceHe: 'ראש הצוות אמר שהקרח נמס מהר יותר מאי פעם.',
        vocab: [
          ['expedition', 'noun', 'משלחת / מסע מחקר', '🧭', 'The expedition spent three months near the South Pole.', 'המשלחת בילתה שלושה חודשים ליד הקוטב הדרומי.'],
          ['announce', 'verb', 'להודיע / להכריז', '📢', 'The captain will announce the plan at dinner.', 'הקברניט יודיע על התוכנית בארוחת הערב.'],
          ['claim', 'verb / noun', 'לטעון / טענה', '💬', 'Some scientists claim that the glacier is shrinking.', 'כמה מדענים טוענים שהקרחון מתכווץ.'],
          ['mention', 'verb', 'להזכיר / לציין', '🗣️', 'She didn’t mention the cold in her first message.', 'היא לא הזכירה את הקור בהודעה הראשונה שלה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'equation', translationHe: 'משוואה' },
            { wordEn: 'pharmacy', translationHe: 'בית מרקחת' },
          ],
          shortSentenceEn: 'She said it was cold.',
          shortSentenceHe: 'היא אמרה שהיה קר.',
          rule: {
            questionEn: 'Report the sentence: Noa said, "I feel tired." — Noa said that she _______ tired.',
            correct: 'felt',
            wrong: ['feel', 'has felt'],
            explainHe: 'בדיבור עקיף אחרי said הזמן זז אחורה: Present Simple (feel) הופך ל-Past Simple (felt).',
            hintHe: 'אחרי said הזמן זז צעד אחד אחורה. מהו העבר הפשוט של הפועל שבציטוט?',
          },
          story: {
            passageEn:
              'Every evening, the expedition sends a short video to schools in Israel. Yesterday, the youngest scientist, Lior, spoke about the penguins. He said that the chicks were growing quickly. He also said that the team needed more batteries for the cameras.',
            passageHe:
              'בכל ערב, המשלחת שולחת סרטון קצר לבתי ספר בישראל. אתמול, המדען הצעיר ביותר, ליאור, דיבר על הפינגווינים. הוא אמר שהגוזלים גדלים מהר. הוא גם אמר שהצוות צריך עוד סוללות למצלמות.',
            questionEn: 'What did Lior say the team needed?',
            questionHe: 'מה ליאור אמר שהצוות צריך?',
            correct: 'More batteries for the cameras.',
            wrong: ['Warmer clothes for the night.', 'A bigger tent for the penguins.'],
          },
        },
      },
      {
        icon: '💬',
        titleEn: 'Told You So: Promises and Plans',
        titleHe: 'אמרתי לכם: הבטחות ותוכניות',
        storyHookHe:
          'מתי אומרים said ומתי told? נלמד ש-tell צריך מישהו ששומע (told us), ונראה איך will הופך ל-would ו-have done הופך ל-had done.',
        grammarTopic: 'Say vs. Tell & Backshift of Will and Present Perfect',
        skills: ['Say vs. Tell', 'Will → Would', 'Reporting Promises'],
        sentenceEn: 'The pilot told us that he would land the plane before the storm.',
        sentenceHe: 'הטייס אמר לנו שהוא ינחית את המטוס לפני הסערה.',
        vocab: [
          ['promise', 'verb / noun', 'להבטיח / הבטחה', '🤝', 'My cousin promised to send me a photo of a seal.', 'בן הדוד שלי הבטיח לשלוח לי תמונה של כלב ים.'],
          ['admit', 'verb', 'להודות', '😬', 'He admitted that he was a little afraid of the dark.', 'הוא הודה שהוא קצת פוחד מהחושך.'],
          ['reply', 'verb / noun', 'להשיב / תשובה', '📨', 'We are still waiting for a reply from the base.', 'אנחנו עדיין מחכים לתשובה מהבסיס.'],
          ['complain', 'verb', 'להתלונן', '😤', 'Nobody complained about the simple food.', 'אף אחד לא התלונן על האוכל הפשוט.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'umbrella', translationHe: 'מטרייה' },
            { wordEn: 'calculator', translationHe: 'מחשבון' },
          ],
          shortSentenceEn: 'He told us the news.',
          shortSentenceHe: 'הוא סיפר לנו את החדשות.',
          rule: {
            questionEn: 'Choose the correct verb: "The doctor _______ the team that the water was safe."',
            correct: 'told',
            wrong: ['said', 'spoke'],
            explainHe: 'tell בא עם מישהו ששומע מיד אחריו (told the team). say בא בלי מושא אישי (said that...).',
            hintHe: 'שימו לב למילים שבאות מיד אחרי החסר: יש שם מישהו ששומע. איזה פועל צריך מושא כזה?',
          },
          story: {
            passageEn:
              'Before the flight home, the captain called the whole team to the dining tent. He told them that the weather had changed. He said that the plane would arrive one day late. Maya admitted that she was happy to stay another night, because she had not seen the southern lights yet.',
            passageHe:
              'לפני הטיסה הביתה, הקברניט קרא לכל הצוות לאוהל האוכל. הוא אמר להם שמזג האוויר השתנה. הוא אמר שהמטוס יגיע באיחור של יום. מאיה הודתה שהיא שמחה להישאר עוד לילה, כי היא עוד לא ראתה את הזוהר הדרומי.',
            questionEn: 'Why was Maya happy to stay another night?',
            questionHe: 'למה מאיה שמחה להישאר עוד לילה?',
            correct: 'She had not seen the southern lights yet.',
            wrong: ['She wanted to finish her science project.', 'She was afraid of flying.'],
          },
        },
      },
      {
        icon: '🎓',
        isBoss: true,
        titleEn: 'Boss: Season Finale — The Expedition Report',
        titleHe: 'אתגר הבוס: גמר העונה — דוח המשלחת',
        storyHookHe:
          'גמר העונה וגמר כיתה ט׳! כותבים את הדוח הסופי של המשלחת: מוסרים מה אמרו המדענים בדיבור עקיף, בדיוק כמו בעבודת חקר בתיכון.',
        grammarTopic: 'Review: Reported Statements and Backshift',
        skills: ['Boss Challenge', 'Reported Speech', 'Academic Summary'],
        sentenceEn: 'In her final interview, the scientist said that the expedition had changed her life.',
        sentenceHe: 'בראיון האחרון שלה, המדענית אמרה שהמשלחת שינתה את חייה.',
        vocab: [
          ['summary', 'noun', 'סיכום / תקציר', '📝', 'Write a short summary of the article in English.', 'כתבו תקציר קצר של המאמר באנגלית.'],
          ['quote', 'verb / noun', 'לצטט / ציטוט', '📜', 'The newspaper quoted the youngest member of the team.', 'העיתון ציטט את חבר הצוות הצעיר ביותר.'],
          ['accurate', 'adjective', 'מדויק / מדויקת', '🎯', 'A good report gives accurate numbers.', 'דוח טוב נותן מספרים מדויקים.'],
          ['interpret', 'verb', 'לפרש', '🧠', 'Scientists interpret the data in different ways.', 'מדענים מפרשים את הנתונים בדרכים שונות.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'ingredient', translationHe: 'מרכיב' },
            { wordEn: 'tournament', translationHe: 'טורניר' },
          ],
          shortSentenceEn: 'They said the trip was hard.',
          shortSentenceHe: 'הם אמרו שהמסע היה קשה.',
          rule: {
            questionEn: 'Report the sentence: Dan said, "We have collected all the samples."',
            correct: 'Dan said that they had collected all the samples.',
            wrong: [
              'Dan said that they has collected all the samples.',
              'Dan told that they had collected all the samples.',
            ],
            explainHe:
              'בדיבור עקיף Present Perfect (have collected) הופך ל-Past Perfect (had collected). told חייב לבוא עם מישהו ששומע אחריו (told us).',
            hintHe: 'בדקו שני דברים: לאיזה זמן עובר Present Perfect בדיבור עקיף, והאם הפועל המוסר מתאים בלי מישהו ששומע אחריו.',
          },
          story: {
            passageEn:
              'After four months on the ice, the expedition finally returned to Tel Aviv. At the airport, reporters were waiting with cameras and microphones. The leader said that the glacier had lost almost two metres of ice since their last visit. She added that the team would publish a full summary in the spring.',
            passageHe:
              'אחרי ארבעה חודשים על הקרח, המשלחת חזרה סוף סוף לתל אביב. בשדה התעופה חיכו כתבים עם מצלמות ומיקרופונים. ראש המשלחת אמרה שהקרחון איבד כמעט שני מטרים של קרח מאז הביקור הקודם שלהם. היא הוסיפה שהצוות יפרסם סיכום מלא באביב.',
            questionEn: 'How much ice had the glacier lost?',
            questionHe: 'כמה קרח איבד הקרחון?',
            correct: 'Almost two metres.',
            wrong: ['Almost ten metres.', 'Nothing at all.'],
          },
        },
      },
    ],
  },
];

export const CORE_PLUS_GRADE_9_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildMiddleSchoolGrade('grade-9', UNITS);
