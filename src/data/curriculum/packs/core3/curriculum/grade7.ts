import { buildMiddleSchoolGrade, type MiddleSchoolUnitSpec } from '../../../middleSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-3 grade 7 unit (Band II): would like (I'd like…, Would you like…?) and reflexive pronouns
 * (myself, yourself, ourselves…), at a café, with Band II words the app never taught or only
 * showed. Example Hebrew addresses the learner in the plural; hints and explanations are
 * gender-neutral plural.
 */
const UNIT_CORE_3: MiddleSchoolUnitSpec = {
  ...packUnitNumbers('core-3'),
  titleEn: 'Café & Ordering',
  titleHe: 'בבית הקפה',
  subtitleHe: 'עונה 3: מזמינים בנימוס עם would like, ומדברים על עצמנו עם myself, yourself, ourselves',
  badgeEmoji: '☕',
  missions: [
    {
      icon: '🥐',
      titleEn: "I'd Like a Croissant, Please",
      titleHe: 'אני רוצה קרואסון, בבקשה',
      storyHookHe:
        'פתחנו את התפריט בבית הקפה השכונתי. כדי להזמין בנימוס לא אומרים I want אלא I would like (I\'d like), ושואלים Would you like…?',
      grammarTopic: "would like: I'd like… / Would you like…?",
      skills: ['would like', "I'd like / Would you like…?", 'Café Vocab'],
      sentenceEn: 'Would you like a fresh croissant with your coffee?',
      sentenceHe: 'תרצו קרואסון טרי עם הקפה?',
      vocab: [
        ['café', 'noun', 'בית קפה', '🥯', 'We meet at the café near the school every Friday.', 'אנחנו נפגשים בבית הקפה ליד בית הספר בכל יום שישי.'],
        ['would prefer', 'phrase', 'להעדיף (בנימוס)', '🤔', 'My sister would prefer tea, not coffee.', 'אחותי הייתה מעדיפה תה, לא קפה.'],
        ['medium', 'adjective', 'בינוני', '🥤', 'Can I have a medium orange juice, please?', 'אפשר לקבל מיץ תפוזים בינוני, בבקשה?'],
        ['discount', 'noun', 'הנחה', '🏷️', 'Students get a ten percent discount on Mondays.', 'תלמידים מקבלים הנחה של עשרה אחוזים בימי שני.'],
        ['on offer', 'phrase', 'במבצע', '🎁', 'Lemon cake is on offer today: two slices for ten shekels.', 'עוגת לימון במבצע היום: שתי פרוסות בעשרה שקלים.'],
        ['just a moment', 'phrase', 'רק רגע', '⏳', 'Just a moment, please. Your coffee is almost ready.', 'רק רגע, בבקשה. הקפה שלכם כמעט מוכן.'],
        ['fresh', 'adjective', 'טרי', '🍞', 'The bread here is fresh every morning.', 'הלחם כאן טרי בכל בוקר.'],
        ['purse', 'noun', 'ארנק', '👛', 'Mom took some money out of her purse.', 'אמא הוציאה קצת כסף מהארנק שלה.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'hammer', translationHe: 'פטיש' },
          { wordEn: 'ladder', translationHe: 'סולם' },
        ],
        shortSentenceEn: "I'd like a cup of tea.",
        shortSentenceHe: 'הייתי רוצה כוס תה.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'I would like a glass of water, please.',
          wrong: ['I would like to a glass of water, please.', 'I would likes a glass of water, please.'],
          explainHe:
            'אחרי would like בא שם עצם (a glass of water) או to ופועל (to drink). אחרי would הפועל like נשאר בלי s.',
          hintHe: 'בדקו את הפועל שבא אחרי would, ומה בא מיד אחריו.',
        },
        story: {
          passageEn:
            'On Friday morning, Noa and her grandfather go to a small café by the sea. The waiter asks, "What would you like?" Grandpa would like a black coffee. Noa would prefer a medium hot chocolate. Fresh cakes are on offer, so they share a piece of cheesecake.',
          passageHe:
            'ביום שישי בבוקר, נועה וסבא שלה הולכים לבית קפה קטן ליד הים. המלצר שואל: "מה תרצו?" סבא רוצה קפה שחור. נועה מעדיפה שוקו חם בינוני. יש מבצע על עוגות טריות, אז הם מתחלקים בפרוסת עוגת גבינה.',
          questionEn: 'What does Noa order?',
          questionHe: 'מה נועה מזמינה?',
          correct: 'A medium hot chocolate.',
          wrong: ['A black coffee.', 'A glass of fresh juice.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: "I'd like an ice cream, please.",
              wrong: ["I'd likes an ice cream, please."],
              explainHe: "אחרי I'd (I would) בא like בלי s.",
              hintHe: "בדקו את סוף הפועל שבא אחרי I'd.",
            },
            story: {
              passageEn: 'Tom is at a café. He would like a cake. His sister would like a juice.',
              passageHe: 'תום נמצא בבית קפה. הוא רוצה עוגה. אחותו רוצה מיץ.',
              questionEn: 'What would Tom like?',
              questionHe: 'מה תום רוצה?',
              correct: 'A cake.',
              wrong: ['A pizza.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['pillow', 'spoon'],
              ['would arrive', 'would sleep'],
              ['angry', 'sleepy'],
              ['ceiling', 'blanket'],
              ['on foot', 'in bed'],
              ['good luck', 'happy birthday'],
              ['hungry', 'brave'],
              ['ceiling', 'shoulder'],
            ],
          },
          master: {
            sentenceEn: 'Would you like a fresh salad, or would you prefer the soup?',
            sentenceHe: 'תרצו סלט טרי, או שאתם מעדיפים את המרק?',
            decoys: ['likes', 'want'],
            voiceEn: 'Just a moment, I would like to pay.',
            voiceHe: 'רק רגע, הייתי רוצה לשלם.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'Would you like to sit near the window?',
              wrong: [
                'Would you like sit near the window?',
                'Do you would like to sit near the window?',
                'Would you liking to sit near the window?',
              ],
              explainHe:
                'בשאלה would בא לפני you, ואחרי like בא to ופועל: Would you like to sit…? אין צורך ב-do.',
              hintEn: 'Check the word order and the verb after like.',
            },
            story: {
              passageEn:
                'Every Saturday, Yael works at her aunt\'s café. One morning, an old man came in and sat by the window. Yael asked, "What would you like?" He looked at the menu for a long time, but he did not order anything. Then he said quietly, "I would like a cup of tea, but I left my purse at home." Yael smiled and brought him tea and a fresh roll. "Today it\'s on the café," she said. The next week, the man came back with flowers for her.',
              passageHe: '',
              questionEn: 'Why did the man bring flowers the next week?',
              questionHe: '',
              correct: 'To thank Yael for her help.',
              wrong: ['To pay for a new cup of tea.', "Because it was Yael's birthday.", 'Because the café sold flowers.'],
            },
            storyHintEn: 'Think about what Yael did for the man.',
          },
        },
      },
    },
    {
      icon: '🪞',
      titleEn: 'We Made It Ourselves',
      titleHe: 'הכנו את זה בעצמנו',
      storyHookHe:
        'בבית הקפה של הכיתה הכול נעשה בעצמנו! נלמד את myself, yourself, ourselves: מילים שמחזירות את הפעולה אל מי שעושה אותה.',
      grammarTopic: 'Reflexive pronouns (myself, yourself, himself, ourselves…)',
      skills: ['Reflexive Pronouns', 'by myself / enjoy yourselves', 'Class Café'],
      sentenceEn: 'We baked these cookies ourselves, so please enjoy yourselves!',
      sentenceHe: 'אפינו את העוגיות האלה בעצמנו, אז בבקשה תיהנו!',
      vocab: [
        ['myself', 'pronoun', 'את עצמי / בעצמי', '🪞', 'I made this sandwich myself.', 'הכנתי את הכריך הזה בעצמי.'],
        ['yourself', 'pronoun', 'את עצמך / בעצמך', '👉', "Be careful! Don't burn yourself on the hot cup.", 'זהירות! אל תיכוו מהכוס החמה.'],
        ['himself', 'pronoun', 'את עצמו / בעצמו', '🧍', 'Dan cut himself with the bread knife.', 'דן נחתך מסכין הלחם.'],
        ['itself', 'pronoun', 'את עצמו / את עצמה (דבר או חיה)', '🤖', 'The coffee machine turns itself off at night.', 'מכונת הקפה מכבה את עצמה בלילה.'],
        ['ourselves', 'pronoun', 'את עצמנו / בעצמנו', '👫', 'We painted the café sign ourselves.', 'צבענו את השלט של בית הקפה בעצמנו.'],
        ['yourselves', 'pronoun', 'את עצמכם / בעצמכם', '👥', 'Kids, did you make these cakes yourselves?', 'ילדים, הכנתם את העוגות האלה בעצמכם?'],
        ['pleasure', 'noun', 'הנאה / בשמחה (my pleasure)', '😊', '"Thank you for the tea!" "It\'s my pleasure."', '"תודה על התה!" "בשמחה."'],
        ['smell', 'verb', 'להריח / ריח', '👃', 'The fresh bread smells wonderful.', 'הלחם הטרי מריח נפלא.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'tractor', translationHe: 'טרקטור' },
          { wordEn: 'helmet', translationHe: 'קסדה' },
        ],
        shortSentenceEn: 'I did it myself.',
        shortSentenceHe: 'עשיתי את זה בעצמי.',
        rule: {
          questionEn: 'Complete: "My little brother can tie his shoes all by ____."',
          correct: 'himself',
          wrong: ['hisself', 'herself'],
          explainHe: 'המשפט מדבר על my brother (הוא), ולכן himself. אין באנגלית מילה hisself.',
          hintHe: 'על מי המשפט מדבר? בחרו את המילה שמתאימה לו.',
        },
        story: {
          passageEn:
            'Our class opened a café for one day. We made everything ourselves: the sandwiches, the cakes and the lemonade. Lior baked the cookies himself, and they smelled wonderful. At the end of the day, our teacher said, "You can be proud of yourselves!"',
          passageHe:
            'הכיתה שלנו פתחה בית קפה ליום אחד. הכנו הכול בעצמנו: את הכריכים, את העוגות ואת הלימונדה. ליאור אפה את העוגיות בעצמו, והן הריחו נפלא. בסוף היום המורה שלנו אמרה: "אתם יכולים להיות גאים בעצמכם!"',
          questionEn: 'Who baked the cookies?',
          questionHe: 'מי אפה את העוגיות?',
          correct: 'Lior.',
          wrong: ['The teacher.', 'A shop near the school.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'I can do it myself.',
              wrong: ['I can do it meself.'],
              explainHe: 'עם I אומרים myself (בעצמי).',
              hintHe: 'איזו מילה מתאימה ל-I?',
            },
            story: {
              passageEn: 'Maya makes a sandwich. She makes it herself. Then she eats it in the park.',
              passageHe: 'מאיה מכינה כריך. היא מכינה אותו בעצמה. אחר כך היא אוכלת אותו בפארק.',
              questionEn: 'Where does Maya eat the sandwich?',
              questionHe: 'איפה מאיה אוכלת את הכריך?',
              correct: 'In the park.',
              wrong: ['At school.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['himself', 'ourselves'],
              ['itself', 'ourselves'],
              ['myself', 'yourselves'],
              ['yourself', 'ourselves'],
              ['himself', 'yourself'],
              ['myself', 'itself'],
              ['elbow', 'ladder'],
              ['swim', 'write'],
            ],
          },
          master: {
            sentenceEn: 'The little boy looked at himself in the café window and laughed.',
            sentenceHe: 'הילד הקטן הסתכל על עצמו בחלון של בית הקפה וצחק.',
            decoys: ['hisself', 'herself'],
            voiceEn: 'We enjoyed ourselves at the café.',
            voiceHe: 'נהנינו בבית הקפה.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'She taught herself to bake bread.',
              wrong: [
                'She taught himself to bake bread.',
                'She taught herselfs to bake bread.',
                'She taught myself to bake bread.',
              ],
              explainHe:
                'המשפט מדבר על she, ולכן herself. רק ברבים מוסיפים selves (ourselves, themselves), ולא selfs.',
              hintEn: 'Who is the sentence about?',
            },
            story: {
              passageEn:
                'Amir\'s parents were away for the weekend, and he was home by himself for the first time. On Saturday morning, he decided to make pancakes. He found a recipe online and did everything himself. The first pancake burned, and the kitchen smelled terrible. The second one stuck to the pan. The third one was perfect. When his parents came home, Amir said proudly, "I can look after myself now. Who wants breakfast tomorrow?"',
              passageHe: '',
              questionEn: 'What does Amir mean at the end?',
              questionHe: '',
              correct: 'He can manage alone now.',
              wrong: ['He wants his parents to cook.', 'He never wants to cook again.', 'He burned all the pancakes.'],
            },
            storyHintEn: 'Think about how the third pancake turned out.',
          },
        },
      },
    },
    {
      icon: '🍰',
      isBoss: true,
      titleEn: 'Boss: The Busy Café',
      titleHe: 'אתגר הבוס: בית הקפה העמוס',
      storyHookHe:
        'שישי בבוקר, ובית הקפה מלא! הראו שאתם יודעים להזמין בנימוס עם would like ולדבר על עצמכם עם myself ו-ourselves.',
      grammarTopic: 'Unit Boss: would like & reflexive pronouns review',
      skills: ['Boss Review', 'would like', 'Reflexive Pronouns'],
      sentenceEn: 'We would love some cake, but just a little bit, please.',
      sentenceHe: 'נשמח לקצת עוגה, אבל רק חתיכה קטנה, בבקשה.',
      vocab: [
        ['would love', 'phrase', 'מאוד לרצות / לשמוח ל…', '🤩', 'My grandmother would love a cup of mint tea.', 'סבתא שלי מאוד הייתה רוצה כוס תה עם נענע.'],
        ['a little bit', 'phrase', 'קצת / מעט', '🤏', 'Can I have a little bit more milk in my coffee?', 'אפשר לקבל עוד קצת חלב בקפה שלי?'],
        ['never mind', 'phrase', 'לא נורא / עזבו', '🤷', 'Never mind, we can sit inside.', 'לא נורא, אנחנו יכולים לשבת בפנים.'],
        ['Why not?', 'phrase', 'למה לא?', '🙂', '"Let\'s have breakfast at the café." "Why not?"', '"בואו נאכל ארוחת בוקר בבית הקפה." "למה לא?"'],
        ['definitely', 'adverb', 'בהחלט', '✅', 'This is definitely the best hummus in town.', 'זה בהחלט החומוס הכי טוב בעיר.'],
        ['anyway', 'adverb', 'בכל זאת / בכל מקרה', '➡️', 'The café was full, but we waited anyway.', 'בית הקפה היה מלא, אבל חיכינו בכל זאת.'],
        ['quite', 'adverb', 'די / למדי', '👌', 'The soup was quite good, but it was a little cold.', 'המרק היה די טוב, אבל הוא היה קצת קר.'],
        ['too bad', 'phrase', 'חבל', '😕', '"The chocolate cake is finished." "Oh, too bad!"', '"עוגת השוקולד נגמרה." "אוי, חבל!"'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'wheelbarrow', translationHe: 'מריצה' },
          { wordEn: 'drill', translationHe: 'מקדחה' },
        ],
        shortSentenceEn: 'We would love some tea.',
        shortSentenceHe: 'נשמח לקצת תה.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'The children would like to make the sandwiches themselves.',
          wrong: [
            'The children would like make the sandwiches themselves.',
            'The children would like to make the sandwiches themself.',
          ],
          explainHe:
            'אחרי would like בא to ופועל (to make). the children הם רבים, ולכן themselves, עם selves בסוף.',
          hintHe: 'בדקו שני דברים: מה בא אחרי would like, ואת סוף המילה שמתייחסת לילדים.',
        },
        story: {
          passageEn:
            'On Friday the café is very busy. A family of four comes in. The father would love a big breakfast, but the kitchen is quite slow today. "Never mind," he says. "We have time." The children pour the juice themselves. The breakfast is late, but it is definitely worth the wait.',
          passageHe:
            'ביום שישי בית הקפה עמוס מאוד. משפחה של ארבעה נכנסת. האבא מאוד רוצה ארוחת בוקר גדולה, אבל המטבח די איטי היום. "לא נורא," הוא אומר. "יש לנו זמן." הילדים מוזגים את המיץ בעצמם. ארוחת הבוקר מתעכבת, אבל היא בהחלט שווה את ההמתנה.',
          questionEn: 'Who pours the juice?',
          questionHe: 'מי מוזג את המיץ?',
          correct: 'The children.',
          wrong: ['The waiter.', 'The father and the cook.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'We would like two juices, please.',
              wrong: ['We would likes two juices, please.'],
              explainHe: 'אחרי would בא like בלי s.',
              hintHe: 'בדקו את הפועל שבא אחרי would.',
            },
            story: {
              passageEn: 'Dina is at the café. She would love a cake. Too bad! The cake is finished. She orders a sandwich.',
              passageHe: 'דינה בבית הקפה. היא מאוד רוצה עוגה. חבל! העוגה נגמרה. היא מזמינה כריך.',
              questionEn: 'What does Dina order?',
              questionHe: 'מה דינה מזמינה?',
              correct: 'A sandwich.',
              wrong: ['A cake.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['would rain', 'would fall'],
              ['good night', 'happy birthday'],
              ['bless you', 'happy new year'],
              ['How old?', 'What color?'],
              ['loudly', 'yesterday'],
              ['tomorrow', 'next year'],
              ['under', 'behind'],
              ['happy birthday', 'nice to meet you'],
            ],
          },
          master: {
            sentenceEn: 'It was quite busy, but we found a table and served ourselves.',
            sentenceHe: 'היה די עמוס, אבל מצאנו שולחן והגשנו לעצמנו.',
            decoys: ['myself', 'quiet'],
            voiceEn: 'Too bad, the cake is finished.',
            voiceHe: 'חבל, העוגה נגמרה.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'Would you like to try the soup yourselves, kids?',
              wrong: [
                'Would you like try the soup yourselves, kids?',
                'Would you like to try the soup yourself, kids?',
                'Would you like to try the soup yourselfs, kids?',
              ],
              explainHe:
                'אחרי would like בא to ופועל. kids הם רבים, ולכן yourselves (ברבים selves, לא selfs).',
              hintEn: 'Check the verb after like and the word for the kids.',
            },
            story: {
              passageEn:
                'Rina opened a small café in Haifa last year. At first, she did everything herself: she baked, served the customers and washed the dishes. She was always tired, and the café was often quite slow. One day, a regular customer said, "Why don\'t you ask your teenage sons to help on Fridays?" Rina laughed, but she tried it anyway. Now the boys serve the tables, Rina has time to bake, and the café is full every weekend.',
              passageHe: '',
              questionEn: 'What made the café more successful?',
              questionHe: '',
              correct: 'Rina shared the work.',
              wrong: ['Rina baked fewer cakes.', 'The customers served themselves.', 'Rina moved the café to Haifa.'],
            },
            storyHintEn: "Compare the café before and after the customer's idea.",
          },
        },
      },
    },
  ],
};

/** The core-3 pack's grade 7 unit (`../../registry.ts`) */
export const CORE_3_GRADE_7_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildMiddleSchoolGrade('grade-7', [UNIT_CORE_3]);
