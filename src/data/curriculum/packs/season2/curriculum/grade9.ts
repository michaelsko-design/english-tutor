import { buildMiddleSchoolGrade, type MiddleSchoolUnitSpec } from '../../../middleSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * Grade 9 Season 2: Past Perfect (had + V3) after unit 1's Present Perfect and the
 * narrative tenses, then reported statements (said / told, backshift). Unit 22's Boss is the
 * grade's new finale before high school.
 */
const UNIT_SEASON2_1: MiddleSchoolUnitSpec = {
  ...packUnitNumbers('season2-1'),
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
        ['clue', 'noun', 'רמז / קצה חוט', '🔎', 'The detective found an important clue under the window.', 'הבלש מצא רמז חשוב מתחת לחלון.'],
        ['disappear', 'verb', 'להיעלם', '💨', 'The famous painting disappeared during the night.', 'הציור המפורסם נעלם במהלך הלילה.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'invitation', translationHe: 'הזמנה' },
          { wordEn: 'neighborhood', translationHe: 'שכונה' },
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
            'On Sunday morning, the cleaner at the city museum noticed an empty frame on the wall. Someone had removed a small painting during the night. The guard had locked every door at eight o’clock, so the thief had probably hidden inside the building. A visitor had noticed a man in a gray coat near the gift shop before closing time.',
          passageHe:
            'ביום ראשון בבוקר, המנקה במוזיאון העירוני הבחין במסגרת ריקה על הקיר. מישהו הוריד ציור קטן במהלך הלילה. השומר נעל את כל הדלתות בשעה שמונה, כך שהגנב כנראה הסתתר בתוך הבניין. מבקר הבחין באיש במעיל אפור ליד חנות המתנות לפני שעת הסגירה.',
          questionEn: 'When had the guard locked every door?',
          questionHe: 'מתי השומר נעל את כל הדלתות?',
          correct: 'At eight o’clock.',
          wrong: ['At midnight.', 'On Sunday morning.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'Dan had eaten before we arrived.',
              wrong: ['Dan has eaten before we arrived.'],
              explainHe: 'הסיפור בעבר, ולכן הפעולה המוקדמת באה ב-Past Perfect: had eaten.',
              hintHe: 'הסיפור כולו בעבר. איזה פועל עזר מתאים לפעולה המוקדמת?',
            },
            story: {
              passageEn: 
                'The bell rang at nine. The thief had left at eight. The guard found an open window.',
              passageHe: 'הפעמון צלצל בתשע. הגנב עזב בשמונה. השומר מצא חלון פתוח.',
              questionEn: 'When had the thief left?',
              questionHe: 'מתי הגנב עזב?',
              correct: 'At eight.',
              wrong: ['At ten.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['verdict', 'alibi'],
              ['crime', 'prison'],
              ['motive', 'trial'],
              ['whisper', 'sneeze'],
            ],
          },
          master: {
            sentenceEn: 'By the time the police arrived the suspect had already left the museum.',
            sentenceHe: 'עד שהמשטרה הגיעה החשוד כבר עזב את המוזיאון.',
            decoys: ['has', 'leave'],
            voiceEn: 'She had never seen that man.',
            voiceHe: 'היא מעולם לא ראתה את האיש ההוא.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'The witness had seen the thief before the lights went out.',
              wrong: [
                'The witness has seen the thief before the lights went out.',
                'The witness had see the thief before the lights went out.',
                'The witness have seen the thief before the lights went out.',
              ],
              explainHe: 
                'הפעולה המוקדמת בעבר באה ב-Past Perfect: had + V3 (had seen). has ו-have הם Present Perfect.',
              hintEn: 'Check the helping verb and the form of see.',
            },
            story: {
              passageEn: 
                'Inspector Barak arrived at the old library at dawn. The front door was locked, yet the shelves were empty and the floor was still wet. He noticed that the dust on the windowsill had been wiped clean, and a rope hung outside the window. Nobody inside had heard anything, because the night guard was wearing headphones. Barak smiled and said, "The thief did not use the door."',
              passageHe: '',
              questionEn: 'How did the thief most likely enter and leave?',
              questionHe: '',
              correct: 'Through the window, using the rope.',
              wrong: [
                'Through the locked front door.',
                'By following the guard inside.',
                'From the roof of the neighboring building.',
              ],
            },
            storyHintEn: 'Look for clues around the window.',
          },
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'Had the girl seen the clue?',
              wrong: ['Did the girl seen the clue?'],
              explainHe: 'שאלה ב-Past Perfect: Had + נושא + V3 (seen). Did בא עם פועל מקור.',
              hintHe: 'בשאלה ב-Past Perfect פועל העזר הוא had. מה בא אחריו?',
            },
            story: {
              passageEn: 
                'The lights went out at ten. The guard had gone home at nine. Nobody was in the building.',
              passageHe: 'האורות כבו בעשר. השומר הלך הביתה בתשע. אף אחד לא היה בבניין.',
              questionEn: 'When had the guard gone home?',
              questionHe: 'מתי השומר הלך הביתה?',
              correct: 'At nine.',
              wrong: ['At ten.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['arrest', 'protect'],
              ['lock', 'camera'],
              ['ceiling', 'chimney'],
              ['weather', 'ticket'],
            ],
          },
          master: {
            sentenceEn: 'The guard had not checked the cameras before the lights went out.',
            sentenceHe: 'השומר לא בדק את המצלמות לפני שהאורות כבו.',
            decoys: ['did', 'has'],
            voiceEn: 'Nobody had touched the old painting.',
            voiceHe: 'אף אחד לא נגע בציור הישן.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'Had the visitors left the gallery before the alarm started?',
              wrong: [
                'Did the visitors left the gallery before the alarm started?',
                'Had the visitors leave the gallery before the alarm started?',
                'The visitors had left the gallery before the alarm started?',
              ],
              explainHe: 
                'שאלה ב-Past Perfect: Had + נושא + V3 (left). אחרי Had לא באה צורת מקור, ואין להשתמש ב-Did עם V3.',
              hintEn: 'Check the first word and the verb form.',
            },
            story: {
              passageEn: 
                'When the detectives reached the control room, the screens were black. The engineer explained that the system had shut down at midnight, but nobody had reported the problem, because the night guard had fallen asleep. A cleaner had noticed a blue light near the stairs, but she had thought it was part of the exhibition. Only in the morning did she mention it to the manager.',
              passageHe: '',
              questionEn: 'Why did nobody report the problem at midnight?',
              questionHe: '',
              correct: 'The guard slept and the cleaner misunderstood a light.',
              wrong: [
                'The cameras were not connected to any power supply that night.',
                'The detectives arrived long before the system failed.',
                'The manager had turned the whole system off earlier.',
              ],
            },
            storyHintEn: 'Think about what the guard and the cleaner did.',
          },
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
        ['confess', 'verb', 'להודות (באשמה)', '🗣️', 'In the end, the night cleaner confessed to the crime.', 'בסופו של דבר, מנקה הלילה הודה בפשע.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'scholarship', translationHe: 'מלגה' },
          { wordEn: 'souvenir', translationHe: 'מזכרת' },
        ],
        shortSentenceEn: 'The detective solved the case.',
        shortSentenceHe: 'הבלש פענח את התיק.',
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'When we arrived, the show had started.',
              wrong: ['When we arrived, the show has started.'],
              explainHe: 'ההגעה קרתה בעבר, והתחלת ההצגה קרתה לפניה: had started.',
              hintHe: 'איזו פעולה קרתה קודם? היא מקבלת את had.',
            },
            story: {
              passageEn: 'Eli looked for his cat. He found it under the bed. It had eaten his sandwich!',
              passageHe: 'אלי חיפש את החתול שלו. הוא מצא אותו מתחת למיטה. החתול אכל את הכריך שלו!',
              questionEn: 'What had the cat eaten?',
              questionHe: 'מה החתול אכל?',
              correct: 'A sandwich.',
              wrong: ['A fish.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['holiday', 'bargain'],
              ['badge', 'uniform'],
              ['lock', 'steal'],
              ['belong', 'complain'],
            ],
          },
          master: {
            sentenceEn: 'After the detective had read the plans she understood where the painting was.',
            sentenceHe: 'אחרי שהבלשית קראה את התוכניות היא הבינה איפה הציור.',
            decoys: ['has', 'reading'],
            voiceEn: 'The thief had hidden the key.',
            voiceHe: 'הגנב החביא את המפתח.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'The thief confessed after the detective had shown him the evidence.',
              wrong: [
                'The thief had confessed after the detective showed him the evidence.',
                'The thief confessed after the detective has shown him the evidence.',
                'The thief confessed after the detective had show him the evidence.',
              ],
              explainHe: 
                'הפעולה המוקדמת (הבלש הראה) באה ב-Past Perfect: had shown. הווידוי המאוחר יותר ב-Past Simple: confessed.',
              hintEn: 'Which action happened first? Check the verb forms.',
            },
            story: {
              passageEn: 
                'The newspaper said that the thief had broken in through the roof, but the detective doubted it. The roof tiles were old and covered with moss that nobody had disturbed, and the ladder in the garden was still tied with a rusty lock. She decided to question the people who had worked in the building every day. Within an hour, one of the museum guards asked to speak to her privately.',
              passageHe: '',
              questionEn: 'What did the detective conclude?',
              questionHe: '',
              correct: 'The crime was probably done by someone inside.',
              wrong: [
                'The thief had used a ladder from the garden.',
                'The newspaper had described everything correctly.',
                'The roof had been damaged by a storm.',
              ],
            },
            storyHintEn: 'The moss and the ladder tell you something.',
          },
        },
      },
    },
  ],
};

const UNIT_SEASON2_2: MiddleSchoolUnitSpec = {
  ...packUnitNumbers('season2-2'),
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'Dan said that he was hungry.',
              wrong: ['Dan said that he is hungry.'],
              explainHe: 'בדיבור עקיף אחרי said הזמן זז אחורה: is הופך ל-was.',
              hintHe: 'אחרי said הזמן זז צעד אחורה. איך נראה is בעבר?',
            },
            story: {
              passageEn: 
                'Noa called from the ship. She said that the sea was calm. She said that the food was good.',
              passageHe: 'נועה התקשרה מהספינה. היא אמרה שהים רגוע. היא אמרה שהאוכל טוב.',
              questionEn: 'What did Noa say about the sea?',
              questionHe: 'מה נועה אמרה על הים?',
              correct: 'It was calm.',
              wrong: ['It was cold.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['glacier', 'iceberg'],
              ['serve', 'cook'],
              ['promise', 'ensure'],
              ['invite', 'memorize'],
            ],
          },
          master: {
            sentenceEn: 
              'The leader announced that the team would leave the camp early the next morning.',
            sentenceHe: 'ראש הצוות הודיע שהצוות יעזוב את המחנה מוקדם למחרת בבוקר.',
            decoys: ['is', 'left'],
            voiceEn: 'She said that she was tired.',
            voiceHe: 'היא אמרה שהיא עייפה.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'Tom told me that the camp was very close to the river.',
              wrong: [
                'Tom said me that the camp was very close to the river.',
                'Tom told me that the camp be very close to the river.',
                'Tom told to me that the camp was very close to the river.',
              ],
              explainHe: 
                'tell בא עם מישהו ששומע (told me). say לא בא עם מושא אישי. וגם בדיבור עקיף משתמשים ב-was ולא ב-be.',
              hintEn: 'Check the verb after Tom and who hears it.',
            },
            story: {
              passageEn: 
                'During the radio call, the doctor said that the patient was feeling much better. However, she added that the helicopter could not land until the snow stopped. The leader told the team to stay calm and to pack only the essential equipment. Nobody complained, but several members looked at the gray sky nervously.',
              passageHe: '',
              questionEn: 'What can we infer about the situation?',
              questionHe: '',
              correct: 'They could not leave before the weather improved.',
              wrong: [
                'The patient was too sick to speak on the radio.',
                'The doctor refused to help the team on the radio.',
                'The leader wanted everyone to carry heavy bags.',
              ],
            },
            storyHintEn: 'Why could the helicopter not land?',
          },
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'Dad told me that dinner was ready.',
              wrong: ['Dad said me that dinner was ready.'],
              explainHe: 'tell בא עם מישהו ששומע (told me). say לא בא עם me ישירות.',
              hintHe: 'אחרי הפועל יש me. איזה פועל מתאים למישהו ששומע?',
            },
            story: {
              passageEn: 
                'Dina told her friend a secret. She said that she was moving to Haifa. Her friend was sad.',
              passageHe: 'דינה סיפרה לחברה שלה סוד. היא אמרה שהיא עוברת לחיפה. החברה שלה הייתה עצובה.',
              questionEn: 'Where is Dina moving?',
              questionHe: 'לאן דינה עוברת?',
              correct: 'To Haifa.',
              wrong: ['To Eilat.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['arrive', 'sleep'],
              ['order', 'demand'],
              ['habit', 'weekend'],
              ['cook', 'travel'],
            ],
          },
          master: {
            sentenceEn: 'The pilot promised that he would call the base after the storm ended.',
            sentenceHe: 'הטייס הבטיח שהוא יתקשר לבסיס אחרי שהסערה תסתיים.',
            decoys: ['told', 'will'],
            voiceEn: 'My sister told me a funny story.',
            voiceHe: 'אחותי סיפרה לי סיפור מצחיק.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'She said that she would reply to all of our messages.',
              wrong: [
                'She said me that she would reply to all of our messages.',
                'She said that she would replies to all of our messages.',
                'She told that she would reply to all of our messages.',
              ],
              explainHe: 
                'say בא בלי מושא אישי, ו-tell צריך מישהו ששומע. אחרי would בא פועל מקור (reply).',
              hintEn: 'Check the reporting verb and the verb after would.',
            },
            story: {
              passageEn: 
                'Before leaving, the manager told the volunteers that the camp would close in ten days. One volunteer admitted that he had not packed his winter jacket, while another complained that the food supply was too small. The manager replied calmly that a boat would bring everything they needed on Friday. Everyone relaxed, but the oldest volunteer kept looking at the sea and said nothing.',
              passageHe: '',
              questionEn: 'Why was the oldest volunteer probably still worried?',
              questionHe: '',
              correct: 'He doubted that the boat would arrive on time.',
              wrong: [
                'He was angry about the small food supply in the camp.',
                'He was sure the camp would stay open.',
                'He wanted to buy a winter jacket.',
              ],
            },
            storyHintEn: 'He looked at the sea and said nothing.',
          },
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
            'After four months on the ice, the expedition finally returned to Tel Aviv. At the airport, reporters were waiting with cameras and microphones. The leader said that the glacier had lost almost two meters of ice since their last visit. She added that the team would publish a full summary in the spring.',
          passageHe:
            'אחרי ארבעה חודשים על הקרח, המשלחת חזרה סוף סוף לתל אביב. בשדה התעופה חיכו כתבים עם מצלמות ומיקרופונים. ראש המשלחת אמרה שהקרחון איבד כמעט שני מטרים של קרח מאז הביקור הקודם שלהם. היא הוסיפה שהצוות יפרסם סיכום מלא באביב.',
          questionEn: 'How much ice had the glacier lost?',
          questionHe: 'כמה קרח איבד הקרחון?',
          correct: 'Almost two meters.',
          wrong: ['Almost ten meters.', 'Nothing at all.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'Maya said that she liked the trip.',
              wrong: ['Maya said that she likes the trip.'],
              explainHe: 'בדיבור עקיף אחרי said הזמן זז אחורה: likes הופך ל-liked.',
              hintHe: 'אחרי said הזמן זז צעד אחורה. מהו העבר של likes?',
            },
            story: {
              passageEn: 
                'The reporter asked the scientist a question. The scientist said that the ice was thin. The reporter wrote this down.',
              passageHe: 'הכתב שאל את המדען שאלה. המדען אמר שהקרח דק. הכתב רשם זאת.',
              questionEn: 'What did the scientist say?',
              questionHe: 'מה המדען אמר?',
              correct: 'That the ice was thin.',
              wrong: ['That the ice was thick.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['recipe', 'poster'],
              ['publish', 'print'],
              ['colorful', 'cheerful'],
              ['dissolve', 'boil'],
            ],
          },
          master: {
            sentenceEn: 
              'The scientist explained that the team had measured the ice every week since January.',
            sentenceHe: 'המדענית הסבירה שהצוות מדד את הקרח בכל שבוע מאז ינואר.',
            decoys: ['has', 'explain'],
            voiceEn: 'The reporter said that she was late.',
            voiceHe: 'הכתבת אמרה שהיא מאחרת.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'Lior said that the team had collected enough samples for the study.',
              wrong: [
                'Lior said that the team has collected enough samples for the study.',
                'Lior said me that the team had collected enough samples for the study.',
                'Lior said that the team had collect enough samples for the study.',
              ],
              explainHe: 
                'בדיבור עקיף Present Perfect הופך ל-Past Perfect: had collected. told צריך מישהו ששומע אחריו.',
              hintEn: 'Check the tense after said and the verb form.',
            },
            story: {
              passageEn: 
                'When the reporter read her notes, she realized that the quote sounded wrong. The scientist had said that the ice might melt completely in fifty years, but the reporter had written that it would melt next year. The editor called the scientist to check the facts. In the afternoon, the newspaper published a correction on its front page, and the reporter promised to record every interview in the future.',
              passageHe: '',
              questionEn: 'Why did the newspaper publish a correction?',
              questionHe: '',
              correct: 'The reporter had changed what the scientist said.',
              wrong: [
                'The scientist wanted to change his opinion again later.',
                'The editor had lost the notes of the interview.',
                'The ice had melted faster than anyone expected.',
              ],
            },
            storyHintEn: 'Compare what was said with what was written.',
          },
        },
      },
    },
  ],
};

/** The season2-1 pack's grade 9 unit (`../../registry.ts`) */
export const SEASON2_1_GRADE_9_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildMiddleSchoolGrade('grade-9', [UNIT_SEASON2_1]);

/** The season2-2 pack's grade 9 unit (`../../registry.ts`) */
export const SEASON2_2_GRADE_9_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildMiddleSchoolGrade('grade-9', [UNIT_SEASON2_2]);
