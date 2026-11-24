import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-4 grade 6 unit (Band I): telling a past story with when (When we arrived, the train
 * was there) and giving reasons with because / because of, about trips, with Band I Core II
 * words the app never taught or taught only later. Example Hebrew uses slash forms for "I";
 * "you" is plural; hints and explanations are gender-neutral plural. Word emoji reuse drawn
 * pictures until the unit's own are drawn.
 */
const UNIT_CORE_4: ElementaryUnitSpec = {
  ...packUnitNumbers('core-4'),
  titleEn: 'Travel Stories',
  titleHe: 'סיפורי מסע',
  subtitleHe: 'עונה 4: מספרים על טיול שהיה עם when, because ו-because of',
  badgeEmoji: '🧳',
  missions: [
    {
      icon: '🚆',
      titleEn: 'When We Arrived…',
      titleHe: 'כשהגענו…',
      storyHookHe: 'יוצאים לדרך! נלמד לספר על טיול שהיה, ולחבר שני רגעים עם when (כאשר): When the train came, we got on.',
      grammarTopic: 'Past simple with when',
      skills: ['Past Simple', 'when', 'Travel'],
      sentenceEn: 'When we arrived at the station, the train was already there.',
      sentenceHe: 'כשהגענו לתחנה, הרכבת כבר הייתה שם.',
      vocab: [
        ['journey', 'noun', 'מסע / נסיעה', '🛤️', 'The journey to Eilat was long, but it was fun.', 'הנסיעה לאילת הייתה ארוכה, אבל היא הייתה כיפית.'],
        ['suitcase', 'noun', 'מזוודה', '🧳', 'When we got to the hotel, I opened my suitcase.', 'כשהגענו למלון, פתחתי את המזוודה שלי.'],
        ['platform', 'noun', 'רציף', '🚆', 'When the train came, we were on the platform.', 'כשהרכבת הגיעה, היינו על הרציף.'],
        ['railway', 'noun', 'מסילת רכבת', '🚂', 'The new railway goes all the way to the sea.', 'מסילת הרכבת החדשה מגיעה עד הים.'],
        ['gate', 'noun', 'שער', '🚧', 'When we got to the airport, we waited at the gate.', 'כשהגענו לשדה התעופה, חיכינו בשער.'],
        ['taxi', 'noun', 'מונית', '🚕', 'We took a taxi because it was late.', 'לקחנו מונית כי היה מאוחר.'],
        ['notice', 'verb', 'לשים לב', '👀', 'When I got on the bus, I didn\'t notice my bag was open.', 'כשעליתי לאוטובוס, לא שמתי לב שהתיק שלי פתוח.'],
        ['stairs', 'noun', 'מדרגות', '🪜', 'When the elevator stopped, we walked up the stairs.', 'כשהמעלית נתקעה, עלינו במדרגות.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'carrot', translationHe: 'גזר' },
          { wordEn: 'pillow', translationHe: 'כרית' },
        ],
        shortSentenceEn: 'We took a taxi.',
        shortSentenceHe: 'לקחנו מונית.',
        rule: {
          questionEn: 'Which sentence is right?',
          correct: 'When the bus came, we got on.',
          wrong: ['When the bus come, we got on.', 'When the bus came, we get on.'],
          explainHe: 'בסיפור על העבר שני החלקים בעבר: came ו-got. when (כאשר) מחבר את שני הרגעים.',
          hintHe: 'בדקו ששני הפעלים בעבר.',
        },
        story: {
          passageEn:
            'Last summer, Maya and her family went to Haifa by train. When they got to the station, the platform was full of people. When the train came, Dad carried the big suitcase onto the train. The journey was only one hour.',
          passageHe:
            'בקיץ שעבר מאיה והמשפחה שלה נסעו לחיפה ברכבת. כשהם הגיעו לתחנה, הרציף היה מלא אנשים. כשהרכבת הגיעה, אבא הכניס את המזוודה הגדולה לרכבת. הנסיעה ארכה רק שעה אחת.',
          questionEn: 'How long was the journey?',
          questionHe: 'כמה זמן ארכה הנסיעה?',
          correct: 'one hour',
          wrong: ['two hours', 'all day'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is in the past?',
              correct: 'We took a taxi to the hotel.',
              wrong: ['We take a taxi to the hotel.'],
              explainHe: 'took הוא העבר של take.',
              hintHe: 'איזה פועל בעבר?',
            },
            story: {
              passageEn: 'When we got to the airport, we went to the gate. Our plane was there.',
              passageHe: 'כשהגענו לשדה התעופה, הלכנו לשער. המטוס שלנו היה שם.',
              questionEn: 'Where did they go?',
              questionHe: 'לאן הם הלכו?',
              correct: 'to the gate',
              wrong: ['to the beach'],
            },
          },
          challenger: {
            clozeWrong: [
              ['stairs', 'notice'],
              ['notice', 'railway'],
              ['notice', 'journey'],
              ['notice', 'suitcase'],
              ['notice', 'journey'],
              ['stairs', 'notice'],
              ['taxi', 'platform'],
              ['notice', 'taxi'],
            ],
          },
          master: {
            sentenceEn: 'When the taxi stopped, Dad took our suitcases out.',
            sentenceHe: 'כשהמונית עצרה, אבא הוציא את המזוודות שלנו.',
            decoys: ['stops', 'take'],
            voiceEn: 'We waited on the platform for ten minutes.',
            voiceHe: 'חיכינו על הרציף עשר דקות.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'When we got home, we were very tired.',
              wrong: ['When we get home, we were very tired.', 'When we got home, we was very tired.', 'When we got home, we are very tired.'],
              explainHe: 'בסיפור על העבר: got ו-were. עם we אומרים were (לא was).',
              hintEn: 'Check got and were.',
            },
            story: {
              passageEn:
                'Last winter, Omri flew to London with his mom. When they landed, Omri noticed that his suitcase was not there. They went to a man at the airport. He said, "Your suitcase is on another plane!" It came to their hotel the next morning, and Omri was very happy.',
              passageHe: '',
              questionEn: 'Why was Omri\'s suitcase not at the airport?',
              questionHe: '',
              correct: 'It was on a different plane.',
              wrong: ['Omri left it at home.', 'The taxi took it.', 'It was in the hotel.'],
            },
            storyHintEn: 'What did the man at the airport say?',
          },
        },
      },
    },
    {
      icon: '💨',
      titleEn: 'Because…',
      titleHe: 'כי… ובגלל…',
      storyHookHe: 'למה זה קרה? נלמד לתת סיבה בסיפור: because (כי) לפני משפט, ו-because of (בגלל) לפני שם.',
      grammarTopic: 'because + clause / because of + noun',
      skills: ['because / because of', 'Past Simple', 'Reasons'],
      sentenceEn: 'We stayed in the hotel because it was raining.',
      sentenceHe: 'נשארנו במלון כי ירד גשם.',
      vocab: [
        ['afraid', 'adjective', 'מפחד/ת', '😬', 'I was afraid because the dog was very big.', 'פחדתי כי הכלב היה גדול מאוד.'],
        ['alone', 'adjective', 'לבד', '🧍', 'She walked home alone because her friend was sick.', 'היא הלכה הביתה לבד כי החברה שלה הייתה חולה.'],
        ['because of', 'phrase', 'בגלל', '💨', 'The trip was short because of the wind.', 'הטיול היה קצר בגלל הרוח.'],
        ['strange', 'adjective', 'מוזר', '👻', 'We heard a strange noise in the night.', 'שמענו רעש מוזר בלילה.'],
        ['happen', 'verb', 'לקרות', '💥', 'Things like this happen when it rains.', 'דברים כאלה קורים כשיורד גשם.'],
        ['instead', 'adverb', 'במקום זה', '🔀', 'The bus didn\'t come, so we walked instead.', 'האוטובוס לא הגיע, אז הלכנו ברגל במקום זה.'],
        ['during', 'preposition', 'במהלך', '⏱️', 'I slept during the flight because I was tired.', 'ישנתי במהלך הטיסה כי הייתי עייף/ה.'],
        ['immediately', 'adverb', 'מיד', '⚡', 'When it started to rain, we went inside immediately.', 'כשהתחיל לרדת גשם, נכנסנו מיד פנימה.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'spoon', translationHe: 'כף' },
          { wordEn: 'piano', translationHe: 'פסנתר' },
        ],
        shortSentenceEn: 'I was afraid of the dog.',
        shortSentenceHe: 'פחדתי מהכלב.',
        rule: {
          questionEn: 'Why did Noa stay home? Which sentence is right?',
          correct: 'Noa stayed home because she was sick.',
          wrong: ['Noa stayed home because of she was sick.', 'Noa stayed home because she is sick yesterday.'],
          explainHe: 'because (כי) בא לפני משפט שלם: she was sick. because of (בגלל) בא לפני שם: because of the rain.',
          hintHe: 'אחרי because of בא שם, לא משפט.',
        },
        story: {
          passageEn:
            'Last year, Lior went on a school trip. During the night, he heard a strange noise outside the tent. He was afraid because the noise was very close, so he woke up his friend. They looked outside and laughed. It was only a little cat!',
          passageHe:
            'בשנה שעברה ליאור יצא לטיול שנתי. במהלך הלילה הוא שמע רעש מוזר מחוץ לאוהל. הוא פחד כי הרעש היה קרוב מאוד, אז הוא העיר את החבר שלו. הם הסתכלו החוצה וצחקו. זה היה רק חתול קטן!',
          questionEn: 'What made the strange noise?',
          questionHe: 'מה השמיע את הרעש המוזר?',
          correct: 'a little cat',
          wrong: ['a big dog', 'the wind'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Dan was sad. His dog was sick. Which sentence is right?',
              correct: 'Dan was sad because his dog was sick.',
              wrong: ['Dan was sad but his dog was sick.'],
              explainHe: 'because (כי) נותן סיבה: למה דן היה עצוב?',
              hintHe: 'איזו מילה נותנת סיבה?',
            },
            story: {
              passageEn: 'We didn\'t go to the beach because of the storm. We played games instead.',
              passageHe: 'לא הלכנו לים בגלל הסערה. שיחקנו במשחקים במקום זה.',
              questionEn: 'Why didn\'t they go to the beach?',
              questionHe: 'למה הם לא הלכו לים?',
              correct: 'because of the storm',
              wrong: ['because they were tired'],
            },
          },
          challenger: {
            clozeWrong: [
              ['instead', 'during'],
              ['during', 'because of'],
              ['instead', 'alone'],
              ['instead', 'during'],
              ['strange', 'instead'],
              ['strange', 'because of'],
              ['afraid', 'instead'],
              ['strange', 'because of'],
            ],
          },
          master: {
            sentenceEn: 'We went home early because of the heavy rain.',
            sentenceHe: 'הלכנו הביתה מוקדם בגלל הגשם החזק.',
            decoys: ['was', 'goes'],
            voiceEn: 'Nothing strange happened during the trip.',
            voiceHe: 'שום דבר מוזר לא קרה במהלך הטיול.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'I was not afraid because my dad was with me.',
              wrong: [
                'I was not afraid because of my dad was with me.',
                'I were not afraid because my dad was with me.',
                'I was not afraid because my dad is with me yesterday.',
              ],
              explainHe: 'because בא לפני משפט שלם. עם I אומרים was, וכל הסיפור בעבר.',
              hintEn: 'Check because, was and the past.',
            },
            story: {
              passageEn:
                'Last month, Yuval wanted to fly to Eilat with his family. Because of a big storm, all the flights were canceled. Yuval was very sad. Instead, his dad rented a car, and they drove to Eilat. The drive was long, but during the journey they saw camels in the desert!',
              passageHe: '',
              questionEn: 'Why did the family drive to Eilat?',
              questionHe: '',
              correct: 'The flights were canceled because of a storm.',
              wrong: ['They were afraid of planes.', 'The car was cheap.', 'They wanted to see camels.'],
            },
            storyHintEn: 'What happened to the flights?',
          },
        },
      },
    },
    {
      icon: '🧭',
      isBoss: true,
      titleEn: 'Boss: My Best Trip',
      titleHe: 'אתגר הבוס: הטיול הכי טוב שלי',
      storyHookHe: 'ספרו על הטיול הכי טוב שלכם: מה קרה, מתי, ולמה. השתמשו ב-when, because ו-because of.',
      grammarTopic: 'Past stories with when / because: Review',
      skills: ['when / because', 'Past Simple', 'Review'],
      sentenceEn: 'Last summer we traveled around Israel for two weeks.',
      sentenceHe: 'בקיץ שעבר טיילנו ברחבי ישראל במשך שבועיים.',
      vocab: [
        ['helicopter', 'noun', 'מסוק', '✈️', 'We flew over the city in a helicopter.', 'טסנו מעל העיר במסוק.'],
        [
          'the ground floor',
          'noun',
          'קומת הקרקע',
          '🏪',
          'Our room was on the ground floor, so we didn\'t take the stairs.',
          'החדר שלנו היה בקומת הקרקע, אז לא עלינו במדרגות.',
        ],
        ['double', 'adjective', 'זוגי / כפול', '🛏️', 'We had a double room with a big bed.', 'היה לנו חדר זוגי עם מיטה גדולה.'],
        ['describe', 'verb', 'לתאר', '🗣️', 'Can you describe the hotel? Was it big?', 'אתם יכולים לתאר את המלון? הוא היה גדול?'],
        ['excellent', 'adjective', 'מצוין', '💯', 'The food at the hotel was excellent.', 'האוכל במלון היה מצוין.'],
        ['nearly', 'adverb', 'כמעט', '⛳', 'We nearly missed the bus because we were late.', 'כמעט פספסנו את האוטובוס כי איחרנו.'],
        ['imagine', 'verb', 'לדמיין', '💭', 'I can imagine the sea when I close my eyes.', 'אני יכול/ה לדמיין את הים כשאני עוצם/ת עיניים.'],
        ['around', 'preposition', 'מסביב / ברחבי', '🌍', 'We traveled around the north for a week.', 'טיילנו ברחבי הצפון במשך שבוע.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'mouse', translationHe: 'עכבר' },
          { wordEn: 'pencil', translationHe: 'עיפרון' },
        ],
        shortSentenceEn: 'The trip was excellent.',
        shortSentenceHe: 'הטיול היה מצוין.',
        rule: {
          questionEn: 'Which sentence is right?',
          correct: 'We missed the bus because we got up late.',
          wrong: ['We missed the bus because of we got up late.', 'We missed the bus because we get up late.'],
          explainHe: 'because (כי) בא לפני משפט שלם, וכל הסיפור בעבר: got up.',
          hintHe: 'בדקו את because ואת הפועל בעבר.',
        },
        story: {
          passageEn:
            'Last spring, Tal\'s family went to the north. They stayed in a double room on the ground floor of a small hotel. Every day they traveled around the Galilee. On the last day, they flew over the Sea of Galilee in a helicopter. Tal said, "It was excellent!"',
          passageHe:
            'באביב שעבר המשפחה של טל נסעה לצפון. הם התארחו בחדר זוגי בקומת הקרקע של מלון קטן. כל יום הם טיילו ברחבי הגליל. ביום האחרון הם טסו מעל הכנרת במסוק. טל אמר: זה היה מצוין!',
          questionEn: 'What did they do on the last day?',
          questionHe: 'מה הם עשו ביום האחרון?',
          correct: 'They flew in a helicopter.',
          wrong: ['They went to the beach.', 'They stayed in the hotel.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'The movie was very, very good. What do you say?',
              correct: 'It was excellent!',
              wrong: ['It was strange.'],
              explainHe: 'excellent פירושו "מצוין".',
              hintHe: 'איזו מילה אומרת "טוב מאוד"?',
            },
            story: {
              passageEn: 'We nearly missed the train. We ran up the stairs and got on.',
              passageHe: 'כמעט פספסנו את הרכבת. רצנו במדרגות ועלינו.',
              questionEn: 'What did they nearly miss?',
              questionHe: 'את מה הם כמעט פספסו?',
              correct: 'the train',
              wrong: ['the bus'],
            },
          },
          challenger: {
            clozeWrong: [
              ['double', 'nearly'],
              ['excellent', 'nearly'],
              ['nearly', 'describe'],
              ['excellent', 'around'],
              ['describe', 'around'],
              ['excellent', 'double'],
              ['excellent', 'nearly'],
              ['excellent', 'double'],
            ],
          },
          master: {
            sentenceEn: 'We nearly missed our flight because the taxi was late.',
            sentenceHe: 'כמעט פספסנו את הטיסה כי המונית איחרה.',
            decoys: ['miss', 'is'],
            voiceEn: 'Imagine a helicopter flying over the sea.',
            voiceHe: 'דמיינו מסוק שטס מעל הים.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'When the helicopter landed, everyone clapped.',
              wrong: [
                'When the helicopter land, everyone clapped.',
                'When the helicopter landed, everyone clap.',
                'When landed the helicopter, everyone clapped.',
              ],
              explainHe: 'בסיפור על העבר שני הפעלים בעבר: landed ו-clapped, ו-when בא לפני the helicopter.',
              hintEn: 'Check both verbs and the word order.',
            },
            story: {
              passageEn:
                'Ella had to describe her best trip for an English lesson. She wrote about a trip to the Dead Sea. The water was so salty that she floated like a boat. Then she wrote, "Imagine reading a newspaper while you lie on the water!" Her teacher said the story was excellent.',
              passageHe: '',
              questionEn: 'Why did Ella write about the Dead Sea?',
              questionHe: '',
              correct: 'It was her best trip.',
              wrong: ['She wanted to read a newspaper.', 'Her teacher went there.', 'She lives near the Dead Sea.'],
            },
            storyHintEn: 'Read the first sentence.',
          },
        },
      },
    },
  ],
};

/** The core-4 pack's grade 6 unit (`../../registry.ts`) */
export const CORE_4_GRADE_6_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-6', [UNIT_CORE_4]);
