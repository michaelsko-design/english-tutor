import { buildHighSchoolGrade, type HighSchoolUnitSpec } from '../../../highSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-3 grade 10 unit (Band III): gap-year plans with the present continuous for fixed
 * arrangements and the future continuous, both new to the app, with Band III Core I (4-point)
 * words the app never had. Example Hebrew addresses the learner in the plural; hints and
 * explanations are gender-neutral plural.
 */
const UNIT_CORE_3: HighSchoolUnitSpec = {
  ...packUnitNumbers('core-3'),
  titleEn: 'Gap Year Plans',
  titleHe: 'תוכניות לשנת הפסקה',
  subtitleHe:
    'עונה 3: מה אתם עושים בשנה הבאה? מדברים על תוכניות שכבר סודרו עם present continuous, ועל מה שיהיה באמצע ברגע מסוים עם will be + V-ing',
  badgeEmoji: '🎒',
  missions: [
    {
      icon: '📅',
      titleEn: "We're Leaving on Sunday: Plans and Arrangements",
      titleHe: 'יוצאים ביום ראשון: תוכניות וסידורים',
      storyHookHe:
        'הכרטיסים כבר בידיים! נלמד לדבר על תוכניות שכבר סידרנו, עם זמן קבוע בעתיד, ב-present continuous: We are flying to Eilat on Sunday.',
      grammarTopic: 'Present Continuous for the Future (fixed arrangements)',
      skills: ['Present Continuous for the Future', 'Travel Arrangements', 'Time Expressions'],
      sentenceEn: 'We are meeting the other volunteers at the station on Sunday.',
      sentenceHe: 'אנחנו פוגשים את שאר המתנדבים בתחנה ביום ראשון.',
      vocab: [
        ['departure', 'noun', 'יציאה / המראה', '🛫', 'Our departure is at six, so we are getting up at four.', 'היציאה שלנו בשש, אז אנחנו קמים בארבע.'],
        ['check in', 'phrase', "לעשות צ'ק-אין / להירשם בכניסה", '🛎️', 'We are flying on Monday, and we have to check in two hours early.', "אנחנו טסים ביום שני, וצריך לעשות צ'ק-אין שעתיים מוקדם."],
        ['resort', 'noun', 'אתר נופש', '🏝️', 'This summer, Omer is working as a lifeguard at a resort in Eilat.', 'בקיץ הזה, עומר עובד כמציל באתר נופש באילת.'],
        ['part-time', 'adjective', 'חלקי (משרה חלקית)', '⏳', 'In September, Tamar is starting a part-time job at a bookshop.', 'בספטמבר, תמר מתחילה עבודה במשרה חלקית בחנות ספרים.'],
        ['cab', 'noun', 'מונית', '🚕', "The bus isn't running at night, so we are taking a cab to the airport.", 'האוטובוס לא נוסע בלילה, אז אנחנו לוקחים מונית לשדה התעופה.'],
        ['monthly', 'adjective', 'חודשי', '📆', 'The volunteers get a small monthly payment for food.', 'המתנדבים מקבלים תשלום חודשי קטן לאוכל.'],
        ['loan', 'noun', 'הלוואה', '💳', "Dana's parents are giving her a loan for the trip, and she is paying it back in June.", 'ההורים של דנה נותנים לה הלוואה לטיול, והיא מחזירה אותה ביוני.'],
        ['shortly', 'adverb', 'בקרוב / תוך זמן קצר', '⏱️', 'The bus to the north is leaving shortly, so please take your bags.', 'האוטובוס לצפון יוצא בקרוב, אז בבקשה קחו את התיקים שלכם.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'saucepan', translationHe: 'סיר' },
          { wordEn: 'scarecrow', translationHe: 'דחליל' },
        ],
        shortSentenceEn: 'We are flying on Sunday.',
        shortSentenceHe: 'אנחנו טסים ביום ראשון.',
        rule: {
          questionEn: 'Complete: "The tickets are booked. We ____ to Rome on Friday."',
          correct: 'are flying',
          wrong: ['have flown', 'flew'],
          explainHe:
            'הכרטיסים כבר הוזמנו, כלומר זו תוכנית מסודרת עם זמן קבוע בעתיד, ולכן present continuous: are flying. flew הוא עבר, ו-have flown מתאר משהו שכבר קרה.',
          hintHe: 'הכרטיסים כבר נקנו והזמן בעתיד. איזו צורה מתארת תוכנית שכבר סודרה?',
        },
        story: {
          passageEn:
            'Itay finished twelfth grade last month, and his gap year is starting soon. On Sunday, he is moving to a youth village in the north, where he is helping new immigrant children with their homework. He is also starting a part-time job at a café to pay back a small loan from his parents. His departure is early, so his mother is driving him to the station at six.',
          passageHe:
            'איתי סיים את כיתה י״ב בחודש שעבר, ושנת ההפסקה שלו מתחילה בקרוב. ביום ראשון הוא עובר לכפר נוער בצפון, ושם הוא עוזר לילדים עולים חדשים בשיעורי הבית. הוא גם מתחיל עבודה במשרה חלקית בבית קפה, כדי להחזיר להוריו הלוואה קטנה. היציאה שלו מוקדמת, אז אמא שלו מסיעה אותו לתחנה בשש.',
          questionEn: 'Why is Itay starting a part-time job?',
          questionHe: 'למה איתי מתחיל עבודה במשרה חלקית?',
          correct: 'To pay back a loan.',
          wrong: ['To buy a new car.', 'To help his mother.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'We are meeting Dana tomorrow.',
              wrong: ['We meeting Dana tomorrow.'],
              explainHe: 'ב-present continuous צריך גם are וגם פועל עם ing: are meeting.',
              hintHe: 'בדקו אם חסרה מילה לפני הפועל.',
            },
            story: {
              passageEn: 'Noa is going to Eilat on Monday. She is working at a hotel there. Her bus is leaving at nine.',
              passageHe: 'נועה נוסעת לאילת ביום שני. היא עובדת שם במלון. האוטובוס שלה יוצא בתשע.',
              questionEn: 'When is Noa going to Eilat?',
              questionHe: 'מתי נועה נוסעת לאילת?',
              correct: 'On Monday.',
              wrong: ['On Friday.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['eyebrow', 'kettle'],
              ['grow taller', 'turn green'],
              ['pillow', 'sneeze'],
              ['rainy', 'hungry'],
              ['mountain', 'sunset'],
              ['wooden', 'sleepy'],
              ['sneeze', 'rainbow'],
              ['yesterday', 'long ago'],
            ],
          },
          master: {
            sentenceEn: 'On Thursday, we are taking a cab to the airport at five.',
            sentenceHe: 'ביום חמישי, אנחנו לוקחים מונית לשדה התעופה בחמש.',
            decoys: ['took', 'takes'],
            voiceEn: 'My brother is starting his gap year in September.',
            voiceHe: 'אחי מתחיל את שנת ההפסקה שלו בספטמבר.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'Are you coming to the farewell party on Friday?',
              wrong: [
                'Do you coming to the farewell party on Friday?',
                'Are you come to the farewell party on Friday?',
                'Are you be coming to the farewell party on Friday?',
              ],
              explainHe: 'שאלה ב-present continuous: are + נושא + פועל עם ing. לא משתמשים ב-do, לא בפועל בסיס, ולא מוסיפים be.',
              hintEn: 'Check the helping verb and the verb form.',
            },
            story: {
              passageEn:
                'Lior has planned every detail of his gap year. On the first of October he is flying to Nepal, and on the fifth he is starting a three-week trek with two friends from school. After that, he is volunteering at a school in a small village. His mother kept asking him the same question: "What happens if something goes wrong?" Lior always smiled and showed her the plan on his phone, with every flight, bus and hostel already booked. Last night, she finally stopped asking and asked him to send her a copy.',
              passageHe: '',
              questionEn: "What can we infer about Lior's mother at the end?",
              questionHe: '',
              correct: 'She feels calmer about the trip.',
              wrong: ['She wants to join the trek.', 'She has canceled his flight to Nepal.', 'She is angry about the hostel.'],
            },
            storyHintEn: 'Why did she stop asking the same question?',
          },
        },
      },
    },
    {
      icon: '🐢',
      titleEn: 'This Time Next Year: Future Continuous',
      titleHe: 'בדיוק בזמן הזה בשנה הבאה',
      storyHookHe:
        'איפה תהיו בדיוק בזמן הזה בשנה הבאה? נלמד לתאר פעולה שתהיה באמצע שלה ברגע מסוים בעתיד, עם will be + V-ing: we will be working on a farm.',
      grammarTopic: 'Future Continuous (will be + V-ing)',
      skills: ['Future Continuous', 'Volunteering', 'Describing Future Routines'],
      sentenceEn: 'This time next year, we will be working on a farm in the Galilee.',
      sentenceHe: 'בזמן הזה בשנה הבאה, אנחנו נעבוד בחווה בגליל.',
      vocab: [
        ['rescue', 'verb', 'להציל / לחלץ', '🛟', 'Next summer, volunteers will be rescuing sea turtles on the beach at night.', 'בקיץ הבא, מתנדבים יצילו צבי ים על החוף בלילות.'],
        ['educate', 'verb', 'לחנך / ללמד', '🏫', 'During her service year, Maya will be educating young children about saving water.', 'במהלך שנת השירות שלה, מאיה תחנך ילדים צעירים לחסוך במים.'],
        ['tough', 'adjective', 'קשה / קשוח', '💪', 'The first weeks will be tough, but we will be learning a lot.', 'השבועות הראשונים יהיו קשים, אבל נלמד הרבה.'],
        ['extraordinary', 'adjective', 'יוצא דופן / מדהים', '🌟', 'In Kenya, Ron will be living in a truly extraordinary place with lions and elephants.', 'בקניה, רון יגור במקום יוצא דופן באמת, עם אריות ופילים.'],
        ['territory', 'noun', 'שטח / טריטוריה', '🗺️', 'The rangers will be counting the wolves in their territory all winter.', 'הפקחים יספרו את הזאבים בשטח שלהם כל החורף.'],
        ['hopefully', 'adverb', 'בתקווה / אני מקווה ש...', '🤞', 'Hopefully, we will be sleeping in real beds by Friday.', 'אני מקווה שעד יום שישי כבר נישן במיטות אמיתיות.'],
        ['indoors', 'adverb', 'בפנים / בתוך הבית', '🏠', 'When it rains, the volunteers will be working indoors.', 'כשיורד גשם, המתנדבים יעבדו בפנים.'],
        ['sore', 'adjective', 'כואב (שריר, גרון)', '🤕', 'After a day of planting trees, our arms will be very sore.', 'אחרי יום של נטיעת עצים, הידיים שלנו יכאבו מאוד.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'toothbrush', translationHe: 'מברשת שיניים' },
          { wordEn: 'snail', translationHe: 'חילזון' },
        ],
        shortSentenceEn: 'I will be working all day.',
        shortSentenceHe: 'אני אעבוד כל היום.',
        rule: {
          questionEn: 'Complete: "Don\'t call at nine tonight. We ____ dinner with our grandparents."',
          correct: 'will be having',
          wrong: ['will having', 'have been having'],
          explainHe:
            'בתשע בערב הארוחה תהיה באמצע, ולכן future continuous: will be + פועל עם ing. ב-will having חסר be, ו-have been having מתאר פעולה שהתחילה בעבר.',
          hintHe: 'בשעה הזו הארוחה תהיה בעיצומה. איזו צורה מתארת פעולה שנמשכת ברגע מסוים בעתיד?',
        },
        story: {
          passageEn:
            'Next September, Shira is starting a year of volunteering at a nature reserve in the Negev. Her days will be long and tough. In the mornings, she will be counting animals and checking their territory. In the afternoons, she will be educating school groups about desert wildlife. Hopefully, she will also be sleeping well, because the reserve is far from any city lights.',
          passageHe:
            'בספטמבר הבא שירה מתחילה שנת התנדבות בשמורת טבע בנגב. הימים שלה יהיו ארוכים וקשים. בבקרים היא תספור בעלי חיים ותבדוק את השטח שלהם. אחר הצהריים היא תלמד קבוצות של תלמידים על חיות המדבר. בתקווה, היא גם תישן טוב, כי השמורה רחוקה מכל אורות העיר.',
          questionEn: 'What will Shira be doing in the afternoons?',
          questionHe: 'מה שירה תעשה אחר הצהריים?',
          correct: 'Teaching school groups.',
          wrong: ['Counting animals.', 'Sleeping at the reserve.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'At eight, I will be sleeping.',
              wrong: ['At eight, I will sleeping.'],
              explainHe: 'ב-future continuous צריך will be ואחר כך פועל עם ing.',
              hintHe: 'בדקו אם חסרה מילה לפני הפועל עם ing.',
            },
            story: {
              passageEn: 'Tom is going to a farm next week. He will be feeding the cows every morning. He loves animals.',
              passageHe: 'תום נוסע לחווה בשבוע הבא. הוא יאכיל את הפרות כל בוקר. הוא אוהב בעלי חיים.',
              questionEn: 'What will Tom be doing every morning?',
              questionHe: 'מה תום יעשה כל בוקר?',
              correct: 'Feeding the cows.',
              wrong: ['Milking the goats.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['sneeze', 'arrive'],
              ['sleep', 'sneeze'],
              ['wooden', 'purple'],
              ['hungry', 'polite'],
              ['spoon', 'sneeze'],
              ['yesterday', 'long ago'],
              ['last night', 'long ago'],
              ['delicious', 'rainy'],
            ],
          },
          master: {
            sentenceEn: 'At this time tomorrow, the volunteers will be cleaning the beach in Haifa.',
            sentenceHe: 'מחר בשעה הזו, המתנדבים ינקו את החוף בחיפה.',
            decoys: ['are', 'cleaned'],
            voiceEn: 'Next week, I will be working on a farm.',
            voiceHe: 'בשבוע הבא אני אעבוד בחווה.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'This time next year, we will be studying abroad.',
              wrong: [
                'This time next year, we will studying abroad.',
                'This time next year, we will be study abroad.',
                'This time next year, we will been studying abroad.',
              ],
              explainHe: 'future continuous בנוי מ-will be + פועל עם ing. לא משמיטים את be, לא שמים פועל בסיס, ואחרי will לא בא been.',
              hintEn: 'Check the words after will.',
            },
            story: {
              passageEn:
                'When Gal finished school, she decided to spend a year working with horses on a farm in the Golan. Her parents were worried, because Gal had never lived away from home. Before she left, her father joked that in two weeks she would be calling home and asking to come back. Two weeks later, Gal did call home. She told her parents that she would be staying on the farm for another year, because the owner had offered her a real job teaching children to ride.',
              passageHe: '',
              questionEn: "Why was her father's joke wrong?",
              questionHe: '',
              correct: 'She loved the farm and stayed on.',
              wrong: ['She called home on the very first day.', 'She never called her parents again.', 'The farm closed after two weeks.'],
            },
            storyHintEn: 'What did Gal say when she called home?',
          },
        },
      },
    },
    {
      icon: '🧳',
      isBoss: true,
      titleEn: 'Boss: The Gap Year Presentation',
      titleHe: 'אתגר הבוס: מציגים את שנת ההפסקה',
      storyHookHe:
        'אתגר הבוס! הציגו לכיתה את התוכנית לשנה הבאה: מה כבר סידרתם (present continuous) ומה תעשו בדיוק ברגע מסוים בעתיד (will be + V-ing).',
      grammarTopic: 'Review: Present Continuous for the Future & Future Continuous',
      skills: ['Boss Challenge', 'Talking About Plans', 'Presentation Skills'],
      sentenceEn: 'We are leaving in August, and in October we will be volunteering in Peru.',
      sentenceHe: 'אנחנו יוצאים באוגוסט, ובאוקטובר נתנדב בפרו.',
      vocab: [
        ['worthwhile', 'adjective', 'שווה את המאמץ / כדאי', '✅', 'A year of volunteering is hard, but it is worthwhile.', 'שנת התנדבות היא קשה, אבל היא שווה את המאמץ.'],
        ['in the meantime', 'phrase', 'בינתיים', '⌛', 'The army starts in March. In the meantime, Gil is working in a hotel.', 'הצבא מתחיל במרץ. בינתיים, גיל עובד במלון.'],
        ['quit', 'verb', 'לעזוב (עבודה) / להפסיק / לפרוש', '🚪', 'Noam is quitting his job in May because he is traveling to India.', 'נועם עוזב את העבודה שלו במאי כי הוא נוסע להודו.'],
        ['ideal', 'adjective', 'אידיאלי / מושלם', '🎯', 'For Dan, the ideal gap year is half work and half travel.', 'בשביל דן, שנת ההפסקה האידיאלית היא חצי עבודה וחצי טיולים.'],
        ['cope', 'verb', 'להתמודד', '🧘', 'Living far from home is hard, but most volunteers cope with it well.', 'לגור רחוק מהבית זה קשה, אבל רוב המתנדבים מתמודדים עם זה טוב.'],
        ['sooner or later', 'phrase', 'במוקדם או במאוחר', '🔜', 'Sooner or later, every traveler loses something important.', 'במוקדם או במאוחר, כל מטייל מאבד משהו חשוב.'],
        ['nightmare', 'noun', 'סיוט', '😱', 'The flight was a nightmare: we waited nine hours at the airport.', 'הטיסה הייתה סיוט: חיכינו תשע שעות בשדה התעופה.'],
        ['unlikely', 'adjective', 'לא סביר', '🤷', 'It is unlikely that we will be home before midnight.', 'לא סביר שנהיה בבית לפני חצות.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'ladder', translationHe: 'סולם' },
          { wordEn: 'mushroom', translationHe: 'פטרייה' },
        ],
        shortSentenceEn: 'We are leaving in August.',
        shortSentenceHe: 'אנחנו יוצאים באוגוסט.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'Our flight is leaving at six, so at noon we will be sitting on the beach.',
          wrong: [
            'Our flight is being leave at six, so at noon we will be sitting on the beach.',
            'Our flight is leaving at six, so at noon we will sitting on the beach.',
          ],
          explainHe:
            'לתוכנית מסודרת משתמשים ב-present continuous (is leaving), ולפעולה שתהיה באמצע בשעה מסוימת בעתיד ב-will be + פועל עם ing (will be sitting).',
          hintHe: 'בדקו את שני חלקי המשפט: האם בכל אחד מהם הפועל בנוי נכון?',
        },
        story: {
          passageEn:
            'For her Boss presentation, Yael showed the class her gap-year plan. She is quitting her job at the supermarket in July and flying to Peru in August. In October, she will be teaching English in a mountain village. Her friends said it was unlikely that she would cope without hot water, but Yael thinks the year will be worthwhile. In the meantime, she is saving money and learning Spanish.',
          passageHe:
            'במצגת לאתגר הבוס, יעל הראתה לכיתה את התוכנית שלה לשנת ההפסקה. היא עוזבת את העבודה שלה בסופרמרקט ביולי וטסה לפרו באוגוסט. באוקטובר היא תלמד אנגלית בכפר בהרים. החברים שלה אמרו שלא סביר שהיא תסתדר בלי מים חמים, אבל יעל חושבת שהשנה תהיה שווה את המאמץ. בינתיים היא חוסכת כסף ולומדת ספרדית.',
          questionEn: 'What will Yael be doing in October?',
          questionHe: 'מה יעל תעשה באוקטובר?',
          correct: 'Teaching English.',
          wrong: ['Working at a supermarket.', 'Studying Spanish at home.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'She is visiting her aunt on Sunday.',
              wrong: ['She visiting her aunt on Sunday.'],
              explainHe: 'לתוכנית מסודרת: is + פועל עם ing (is visiting).',
              hintHe: 'בדקו אם חסרה מילה אחרי הנושא.',
            },
            story: {
              passageEn: 'Ben is flying to London on Monday. On Tuesday, he will be visiting a museum. He is very excited.',
              passageHe: 'בן טס ללונדון ביום שני. ביום שלישי הוא יבקר במוזיאון. הוא מתרגש מאוד.',
              questionEn: 'Where is Ben flying?',
              questionHe: 'לאן בן טס?',
              correct: 'To London.',
              wrong: ['To Paris.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['triangular', 'wooden'],
              ['long ago', 'last year'],
              ['sneeze', 'arrive'],
              ['hungry', 'wooden'],
              ['sneeze', 'melt'],
              ['last night', 'two days ago'],
              ['carrot', 'pillow'],
              ['wooden', 'hungry'],
            ],
          },
          master: {
            sentenceEn: 'In the meantime, we are saving money for the trip.',
            sentenceHe: 'בינתיים, אנחנו חוסכים כסף לטיול.',
            decoys: ['saved', 'will'],
            voiceEn: 'This time tomorrow, we will be flying to Peru.',
            voiceHe: 'מחר בשעה הזו, אנחנו נטוס לפרו.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'They are meeting us at the airport tomorrow.',
              wrong: [
                'They meeting us at the airport tomorrow.',
                'They are meet us at the airport tomorrow.',
                'They will being meeting us at the airport tomorrow.',
              ],
              explainHe: 'לתוכנית מסודרת: are + פועל עם ing. לא משמיטים את are, לא שמים אחריו פועל בסיס, ואין will being.',
              hintEn: 'Look at the helping verb and the main verb.',
            },
            story: {
              passageEn:
                'Ido and Lihi are planning a trip to South America after the army, and they agree on almost everything. The tickets are booked: they are flying to Lima on the third of March. The problem is the first week. Ido wants to spend it hiking in the mountains, while Lihi dreams of lying on a beach. Last night, they finally found a solution. During the first week, Ido will be climbing with a local guide, and Lihi will be learning to surf. On the eighth, they are meeting in Cusco.',
              passageHe: '',
              questionEn: 'How did Ido and Lihi solve their problem?',
              questionHe: '',
              correct: 'They will spend a week apart.',
              wrong: [
                'Lihi agreed to go hiking in the mountains.',
                'They canceled the first week of the trip.',
                'Ido decided to stay at the beach with Lihi.',
              ],
            },
            storyHintEn: 'What will each of them do in the first week?',
          },
        },
      },
    },
  ],
};

/** The core-3 pack's grade 10 unit (`../../registry.ts`) */
export const CORE_3_GRADE_10_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildHighSchoolGrade('grade-10', [UNIT_CORE_3]);
