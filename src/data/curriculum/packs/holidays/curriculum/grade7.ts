import { buildMiddleSchoolGrade, type MiddleSchoolUnitSpec } from '../../../middleSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * Holidays pack, grade 7 ("Holidays & Seasons"). Playable from the first day of the grade, so it
 * reviews grade 6 grammar and grade 7 units 1–2 only: Present Simple for traditions, Present
 * Progressive for what is happening right now, stative verbs, and was / were.
 */
const UNITS: MiddleSchoolUnitSpec[] = [
  {
    ...packUnitNumbers('holidays', 0),
    titleEn: 'Autumn & Winter Holidays',
    titleHe: 'חגי הסתיו והחורף',
    subtitleHe: 'ראש השנה, סוכות, חנוכה וגשם ראשון — Present Simple למסורות ו-Present Progressive לרגע הזה',
    badgeEmoji: '🍃',
    missions: [
      {
        icon: '🍎',
        titleEn: 'Honey Cake & the Sukkah Team',
        titleHe: 'עוגת דבש וצוות הסוכה',
        storyHookHe:
          'השנה החדשה מתחילה! נספר באנגלית מה משפחות בישראל עושות בכל שנה בראש השנה ובסוכות.',
        grammarTopic: 'Present Simple for Holiday Traditions',
        skills: ['Present Simple Review', 'Holiday Traditions', 'Autumn Vocab'],
        sentenceEn: 'Every autumn, my family decorates the sukkah with paper chains and fruit.',
        sentenceHe: 'בכל סתיו, המשפחה שלי מקשטת את הסוכה בשרשראות נייר ובפירות.',
        vocab: [
          ['honey', 'noun', 'דבש', '🍯', 'We dip apple slices in honey at the holiday dinner.', 'אנחנו טובלים פרוסות תפוח בדבש בארוחת החג.'],
          ['tradition', 'noun', 'מסורת', '📜', 'Eating a pomegranate is an old tradition in our family.', 'לאכול רימון זו מסורת עתיקה במשפחה שלנו.'],
          ['harvest', 'noun', 'קציר / אסיף', '🌾', 'Sukkot is also a celebration of the harvest.', 'סוכות הוא גם חגיגה של האסיף.'],
          ['decorate', 'verb', 'לקשט', '🎊', 'The children decorate the classroom for the new year.', 'הילדים מקשטים את הכיתה לשנה החדשה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'vinegar', translationHe: 'חומץ' },
            { wordEn: 'destroy', translationHe: 'להרוס' },
          ],
          shortSentenceEn: 'My family decorates the sukkah.',
          shortSentenceHe: 'המשפחה שלי מקשטת את הסוכה.',
          rule: {
            questionEn: 'Complete the sentence: "Every year, my grandfather ____ a big sukkah in the yard."',
            correct: 'builds',
            wrong: ['build', 'is build'],
            explainHe: 'Every year מראה מסורת שחוזרת על עצמה, ו-my grandfather הוא he, ולכן builds עם s.',
            hintHe: 'Every year מראה הרגל. סבא הוא he: מה מוסיפים לפועל ב-Present Simple?',
          },
          story: {
            passageEn:
              'Rosh Hashana is the Jewish New Year, and it usually comes in September. Families eat apples with honey and wish each other a sweet year. A few days later, many families build a sukkah. They decorate it with colorful paper chains, and some people eat and even sleep there for a week.',
            passageHe:
              'ראש השנה הוא השנה החדשה היהודית, והוא בדרך כלל חל בספטמבר. משפחות אוכלות תפוחים בדבש ומאחלות זו לזו שנה מתוקה. כמה ימים אחר כך, משפחות רבות בונות סוכה. הן מקשטות אותה בשרשראות נייר צבעוניות, ויש אנשים שאוכלים ואפילו ישנים בה במשך שבוע.',
            questionEn: 'Why do families eat apples with honey?',
            questionHe: 'מדוע משפחות אוכלות תפוחים בדבש?',
            correct: 'They wish each other a sweet year.',
            wrong: ['They want to finish the harvest quickly.', 'They need food for a long trip.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'We eat apples at dinner.',
                wrong: ['We eats apples at dinner.'],
                explainHe: 'עם We הפועל נשאר בלי s: eat.',
                hintHe: 'We הוא רבים. האם מוסיפים s לפועל?',
              },
              story: {
                passageEn: 
                  'Every year, Grandma bakes a honey cake. The whole family eats it after dinner. Everyone says it is sweet.',
                passageHe: 
                  'בכל שנה סבתא אופה עוגת דבש. כל המשפחה אוכלת אותה אחרי הארוחה. כולם אומרים שהיא מתוקה.',
                questionEn: 'Who bakes the honey cake?',
                questionHe: 'מי אופה את עוגת הדבש?',
                correct: 'Grandma.',
                wrong: ['Dad.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['ink', 'glue'],
                ['accident', 'vegetable'],
                ['traffic', 'garbage'],
                ['cook', 'taste'],
              ],
            },
            master: {
              sentenceEn: 
                'Every autumn my grandfather builds a wooden sukkah and my cousins hang paper stars.',
              sentenceHe: 'בכל סתיו סבא שלי בונה סוכה מעץ ובני הדודים שלי תולים כוכבי נייר.',
              decoys: ['build', 'hangs'],
              voiceEn: 'Our family eats dinner in the sukkah.',
              voiceHe: 'המשפחה שלנו אוכלת ארוחת ערב בסוכה.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Every Rosh Hashana my aunt bakes a round challah for us.',
                wrong: [
                  'Every Rosh Hashana my aunt bake a round challah for us.',
                  'Every Rosh Hashana my aunt is bakes a round challah for us.',
                  'Every Rosh Hashana my aunt baking a round challah for us.',
                ],
                explainHe: 
                  'Every Rosh Hashana מראה מסורת: Present Simple. my aunt היא she, ולכן bakes עם s, בלי is ובלי ing.',
                hintEn: 'Which ending shows she in Present Simple?',
              },
              story: {
                passageEn: 
                  'In Noa’s family, the night before Sukkot is for building. Her father brings the wooden frame and her brother brings the heavy boxes of decorations. Noa’s job is the most difficult one, because she must hang the fruit without letting it fall. This year, she tied each fruit with a double knot. Her father looked up at the ceiling, smiled, and for the first time did not say a word of advice.',
                passageHe: '',
                questionEn: 'Why did Noa’s father not give advice this year?',
                questionHe: '',
                correct: 'He saw that Noa did her job well.',
                wrong: [
                  'He was too tired to speak.',
                  'He did not like the decorations.',
                  'Noa asked him to be quiet.',
                ],
              },
              storyHintEn: 'Look at how Noa tied the fruit.',
            },
          },
        },
      },
      {
        icon: '🕯️',
        titleEn: 'Candles Are Burning, Rain Is Falling',
        titleHe: 'הנרות דולקים והגשם יורד',
        storyHookHe:
          'ערב חנוכה, בחוץ יורד גשם ראשון. נתאר באנגלית מה קורה עכשיו, ממש ברגע הזה, בעזרת Present Progressive.',
        grammarTopic: 'Present Progressive: What Is Happening Right Now',
        skills: ['Present Progressive Review', 'Now vs. Every Year', 'Winter Vocab'],
        sentenceEn: 'Right now, Dad is frying doughnuts and the rain is falling outside.',
        sentenceHe: 'ממש עכשיו, אבא מטגן סופגניות והגשם יורד בחוץ.',
        vocab: [
          ['candle', 'noun', 'נר', '🕯️', 'Each candle in our window burns for about an hour.', 'כל נר בחלון שלנו דולק בערך שעה.'],
          ['flame', 'noun', 'להבה', '🔥', 'The flame is small, but it is very bright.', 'הלהבה קטנה, אבל היא מאוד בהירה.'],
          ['doughnut', 'noun', 'סופגנייה', '🍩', 'This doughnut is full of strawberry jam.', 'הסופגנייה הזאת מלאה בריבת תות.'],
          ['puddle', 'noun', 'שלולית', '💧', 'My little brother loves jumping into every puddle.', 'אח שלי הקטן אוהב לקפוץ לכל שלולית.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'drought', translationHe: 'בצורת' },
            { wordEn: 'pillow', translationHe: 'כרית' },
          ],
          shortSentenceEn: 'The rain is falling outside.',
          shortSentenceHe: 'הגשם יורד בחוץ.',
          rule: {
            questionEn: 'Complete the sentence: "Look! The children ____ the candles now."',
            correct: 'are lighting',
            wrong: ['light', 'is lighting'],
            explainHe:
              'Look! ו-now מראים שהפעולה קורית ממש עכשיו, ולכן Present Progressive. the children הם רבים, ולכן are.',
            hintHe: 'Look! ו-now מספרים לנו מתי זה קורה. הילדים הם רבים: איזו צורה של be מתאימה להם?',
          },
          story: {
            passageEn:
              'It is the fifth night of Hanukkah, and the first winter storm is here. Outside, the wind is blowing and the streets are full of puddles. Inside, Shira’s family is standing near the window. Her little sister is lighting the candles, and everyone is singing. The kitchen smells of hot doughnuts.',
            passageHe:
              'זה הלילה החמישי של חנוכה, והסערה הראשונה של החורף כבר כאן. בחוץ הרוח נושבת והרחובות מלאים בשלוליות. בפנים, המשפחה של שירה עומדת ליד החלון. אחותה הקטנה מדליקה את הנרות, וכולם שרים. המטבח מריח מסופגניות חמות.',
            questionEn: 'Who is lighting the candles?',
            questionHe: 'מי מדליק/ה את הנרות?',
            correct: 'Shira’s little sister.',
            wrong: ['Shira’s grandmother.', 'Shira’s older brother.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'The kids are singing now.',
                wrong: ['The kids sings now.'],
                explainHe: 'now מראה פעולה עכשווית: are singing. kids הם רבים, ולכן are.',
                hintHe: 'המילה now מצביעה על הרגע הזה. הילדים הם רבים: איזו צורה של be מתאימה?',
              },
              story: {
                passageEn: 'It is evening. Dan is lighting a candle. His sister is eating a doughnut.',
                passageHe: 'עכשיו ערב. דן מדליק נר. אחותו אוכלת סופגנייה.',
                questionEn: 'What is his sister eating?',
                questionHe: 'מה אחותו אוכלת?',
                correct: 'A doughnut.',
                wrong: ['An apple.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['bottle', 'plate'],
                ['smoke', 'ash'],
                ['candle', 'balloon'],
                ['cloud', 'rainbow'],
              ],
            },
            master: {
              sentenceEn: 
                'Now the children are jumping in puddles while their grandmother is frying doughnuts.',
              sentenceHe: 'עכשיו הילדים קופצים בשלוליות בזמן שסבתא שלהם מטגנת סופגניות.',
              decoys: ['jump', 'fries'],
              voiceEn: 'The candles are shining in the window.',
              voiceHe: 'הנרות מאירים בחלון.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Look at the sky! The wind is blowing the clouds away.',
                wrong: [
                  'Look at the sky! The wind blowing the clouds away.',
                  'Look at the sky! The wind are blowing the clouds away.',
                  'Look at the sky! The wind is blow the clouds away.',
                ],
                explainHe: 
                  'Look at מראה פעולה שקורית עכשיו: am / is / are + ing. wind הוא יחיד ולכן is. אי אפשר להשמיט את is או לשכוח את ing.',
                hintEn: 'Check the helping verb and the ending of the verb.',
              },
              story: {
                passageEn: 
                  'The first big storm of the year reached the city this afternoon. Tamar’s whole street is dark because the electricity went off, and the neighbors are standing in their doorways with flashlights. Tamar’s grandfather is lighting an old oil lamp. He tells the children not to worry, because he remembers many storms like this one, and each one ended with a quiet morning and a bright sky.',
                passageHe: '',
                questionEn: 'Why does the grandfather tell the children not to worry?',
                questionHe: '',
                correct: 'He knows from experience that the storm will pass.',
                wrong: [
                  'The electricity will come back in an hour.',
                  'He is afraid the neighbors will go home.',
                  'The storm is already over outside.',
                ],
              },
              storyHintEn: 'Think about the storms he remembers.',
            },
          },
        },
      },
      {
        icon: '🌧️',
        isBoss: true,
        titleEn: 'Boss: A Cozy Winter Weekend',
        titleHe: 'אתגר הבוס: סוף שבוע חורפי ונעים',
        storyHookHe:
          'משימת סיכום של חגי הסתיו והחורף! קראו קטע Unseen על סוף שבוע גשום והבדילו בין מה שקורה תמיד למה שקורה עכשיו.',
        grammarTopic: 'Boss: Present Simple vs. Present Progressive in Holiday Reading',
        skills: ['Boss Unseen', 'Simple vs. Progressive', 'Seasons Vocab'],
        sentenceEn: 'We usually go to the park on Saturday, but today we are staying under a warm blanket.',
        sentenceHe: 'בדרך כלל אנחנו הולכים לפארק בשבת, אבל היום אנחנו נשארים מתחת לשמיכה חמה.',
        vocab: [
          ['blanket', 'noun', 'שמיכה', '🛌', 'Grandma knits a new blanket every winter.', 'סבתא סורגת שמיכה חדשה בכל חורף.'],
          ['storm', 'noun', 'סערה', '⛈️', 'The storm closes the beach for two days.', 'הסערה סוגרת את החוף ליומיים.'],
          ['gather', 'verb', 'להתאסף', '👨‍👩‍👧', 'Our cousins gather at our house for the holiday.', 'בני הדודים שלנו מתאספים בבית שלנו לחג.'],
          ['cozy', 'adjective', 'נעים וחמים', '☕', 'The living room is cozy when the heater is on.', 'הסלון נעים וחמים כשהתנור דולק.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'scatter', translationHe: 'להתפזר' },
            { wordEn: 'chilly', translationHe: 'קריר' },
          ],
          shortSentenceEn: 'We are staying under a blanket.',
          shortSentenceHe: 'אנחנו נשארים מתחת לשמיכה.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'It often rains in December, but today the sun is shining.',
            wrong: [
              'It is often raining in December, but today the sun shines.',
              'It often rain in December, but today the sun is shining.',
            ],
            explainHe:
              'often מראה הרגל, ולכן Present Simple: it rains. today מראה משהו שקורה עכשיו, ולכן is shining.',
            hintHe: 'בחלק הראשון יש מילה שמראה הרגל, ובחלק השני מילה שמראה את היום. בדקו גם את הסיומת של הפועל עם it.',
          },
          story: {
            passageEn:
              'In Israel, the rainy season usually starts in October or November. On winter weekends, many families gather at home. This Saturday, a strong storm is passing over Haifa. Eden and her parents are drinking hot cocoa and playing a board game. Eden prefers rainy days because her whole family is together.',
            passageHe:
              'בישראל, עונת הגשמים מתחילה בדרך כלל באוקטובר או בנובמבר. בסופי שבוע של חורף, משפחות רבות מתאספות בבית. בשבת הזאת, סערה חזקה עוברת מעל חיפה. עדן וההורים שלה שותים שוקו חם ומשחקים במשחק קופסה. עדן מעדיפה ימים גשומים כי כל המשפחה שלה ביחד.',
            questionEn: 'Why does Eden prefer rainy days?',
            questionHe: 'מדוע עדן מעדיפה ימים גשומים?',
            correct: 'Because her whole family is together.',
            wrong: ['Because she loves walking in the storm.', 'Because there is no school on those days.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'It often rains in winter.',
                wrong: ['It often rain in winter.'],
                explainHe: 'often מראה הרגל: Present Simple. עם it מוסיפים s: rains.',
                hintHe: 'המילה often מראה הרגל. מה מוסיפים לפועל עם it?',
              },
              story: {
                passageEn: 'It is rainy today. Maya is under a blanket. She is reading a book.',
                passageHe: 'היום גשום. מאיה מתחת לשמיכה. היא קוראת ספר.',
                questionEn: 'What is Maya doing?',
                questionHe: 'מה מאיה עושה?',
                correct: 'Reading a book.',
                wrong: ['Playing outside.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['window', 'bicycle'],
                ['sunshine', 'rainbow'],
                ['shrink', 'melt'],
                ['hungry', 'talkative'],
              ],
            },
            master: {
              sentenceEn: 'Our cousins usually gather at home but today they are hiding from the storm.',
              sentenceHe: 'בני הדודים שלנו בדרך כלל מתאספים בבית אבל היום הם מסתתרים מהסערה.',
              decoys: ['gathers', 'hide'],
              voiceEn: 'It is very cozy under this warm blanket.',
              voiceHe: 'נעים מאוד מתחת לשמיכה החמה הזאת.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Normally Dad makes soup but today he is baking bread.',
                wrong: [
                  'Normally Dad is making soup but today he is baking bread.',
                  'Normally Dad makes soup but today he bakes bread.',
                  'Normally Dad make soup but today he is baking bread.',
                ],
                explainHe: 
                  'Normally מראה הרגל: Present Simple (makes). today מראה פעולה עכשווית: is baking.',
                hintEn: 'Which word shows a habit and which shows today?',
              },
              story: {
                passageEn: 
                  'On winter Fridays, Lior’s family always gathers at his grandmother’s apartment. This week the roads are flooded, so nobody can drive there. At six o’clock the phone rings, and every cousin appears on the screen holding a bowl of Grandma’s soup. Grandma laughs and says that the family is together, even if the table is wide and the distance is long.',
                passageHe: '',
                questionEn: 'How does the family spend this Friday?',
                questionHe: '',
                correct: 'They meet by video call and eat the same soup.',
                wrong: [
                  'They drive carefully to Grandma’s apartment.',
                  'They cancel dinner because of the storm.',
                  'They eat in different restaurants in town.',
                ],
              },
              storyHintEn: 'Think about the flooded roads and the phone.',
            },
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('holidays', 1),
    titleEn: 'Spring & Summer Celebrations',
    titleHe: 'חגיגות האביב והקיץ',
    subtitleHe: 'ט״ו בשבט, פורים, פסח, יום העצמאות, שבועות וחופש גדול — הרגלים, הרגע הזה ופעלי מצב',
    badgeEmoji: '🌸',
    missions: [
      {
        icon: '🌳',
        titleEn: 'Blossoms, Masks & Costumes',
        titleHe: 'פריחה, מסכות ותחפושות',
        storyHookHe:
          'מט״ו בשבט ועד פורים! נשתמש בפעלים כמו love, want ו-know, שכמעט אף פעם לא מקבלים ing.',
        grammarTopic: 'Stative Verbs (love, want, know, need) in Holiday Talk',
        skills: ['Stative Verbs Review', 'Purim & Tu BiShvat', 'Describing Costumes'],
        sentenceEn: 'My sister wants a pirate costume, but I love my homemade lion mask.',
        sentenceHe: 'אחותי רוצה תחפושת של פיראטית, אבל אני אוהב/ת את מסכת האריה שהכנתי בעצמי.',
        vocab: [
          ['costume', 'noun', 'תחפושת', '🦸', 'My costume this year is a giant pineapple.', 'התחפושת שלי השנה היא אננס ענק.'],
          ['blossom', 'noun', 'פריחה / פרח של עץ', '🌸', 'The almond trees are full of white blossom in February.', 'עצי השקד מלאים בפריחה לבנה בפברואר.'],
          ['mask', 'noun', 'מסכה', '🎭', 'He is painting a funny mask for the party.', 'הוא מצייר מסכה מצחיקה למסיבה.'],
          ['neighbor', 'noun', 'שכן / שכנה', '🏘️', 'We bring a basket of treats to our neighbor.', 'אנחנו מביאים סלסלת ממתקים לשכנה שלנו.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'uniform', translationHe: 'מדים' },
            { wordEn: 'stranger', translationHe: 'אדם זר' },
          ],
          shortSentenceEn: 'My sister wants a pirate costume.',
          shortSentenceHe: 'אחותי רוצה תחפושת של פיראטית.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'I know the words of this Purim song.',
            wrong: ['I am knowing the words of this Purim song.', 'I knows the words of this Purim song.'],
            explainHe: 'know הוא פועל מצב, ולכן לא מוסיפים לו ing. עם I הפועל נשאר בלי s.',
            hintHe: 'לדעת משהו זה מצב, לא פעולה שקורית עכשיו. ועם I, מה קורה לסוף הפועל?',
          },
          story: {
            passageEn:
              'On Tu BiShvat, the almond trees are in blossom and many classes plant young trees. A few weeks later, the streets are full of costumes for Purim. Children give baskets of sweets to their friends and neighbors. This year, Yonatan is wearing a robot costume. He needs help with his giant cardboard arms!',
            passageHe:
              'בט״ו בשבט עצי השקד פורחים וכיתות רבות שותלות עצים צעירים. כמה שבועות אחר כך, הרחובות מלאים בתחפושות לפורים. ילדים נותנים סלסלות ממתקים לחברים ולשכנים שלהם. השנה יונתן לובש תחפושת של רובוט. הוא צריך עזרה עם הזרועות הענקיות שלו מקרטון!',
            questionEn: 'What does Yonatan need help with?',
            questionHe: 'במה יונתן צריך עזרה?',
            correct: 'His giant cardboard arms.',
            wrong: ['Planting a young tree.', 'Baking sweets for the neighbors.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'I want a red mask.',
                wrong: ['I am wanting a red mask.'],
                explainHe: 'want הוא פועל מצב, ולכן לא מוסיפים לו ing.',
                hintHe: 'לרצות זה מצב ולא פעולה. האם פועל כזה מקבל ing?',
              },
              story: {
                passageEn: 'Today is Purim. Rina wears a lion costume. Her neighbor wears a clown mask.',
                passageHe: 'היום פורים. רינה לובשת תחפושת אריה. השכן שלה חובש מסכת ליצן.',
                questionEn: 'What does Rina wear?',
                questionHe: 'מה רינה לובשת?',
                correct: 'A lion costume.',
                wrong: ['A clown mask.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['ticket', 'birthday'],
                ['flour', 'cheese'],
                ['secret', 'smell'],
                ['ceiling', 'floor'],
              ],
            },
            master: {
              sentenceEn: 
                'My little brother wants a dragon costume because he loves the stories about knights.',
              sentenceHe: 'האח הקטן שלי רוצה תחפושת דרקון כי הוא אוהב את הסיפורים על אבירים.',
              decoys: ['wanting', 'love'],
              voiceEn: 'Our neighbor needs a ladder for the tree.',
              voiceHe: 'השכן שלנו צריך סולם בשביל העץ.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'My cousin knows every word of the Purim song by heart.',
                wrong: [
                  'My cousin is knowing every word of the Purim song by heart.',
                  'My cousin know every word of the Purim song by heart.',
                  'My cousin knowing every word of the Purim song by heart.',
                ],
                explainHe: 'know הוא פועל מצב ולכן לא מקבל ing. עם my cousin (he / she) מוסיפים s: knows.',
                hintEn: 'Check the helping verb and the s ending.',
              },
              story: {
                passageEn: 
                  'Every year, Rina’s class visits a grove of almond trees in February. This year, the teacher asked everyone to bring one small thing that shows spring. Some students brought flowers and others brought drawings. Rina brought an empty glass jar. She held it near a blossom for a moment and closed the lid quickly. "I have the smell of spring," she smiled.',
                passageHe: '',
                questionEn: 'What does Rina keep inside the jar?',
                questionHe: '',
                correct: 'The smell of the spring blossom.',
                wrong: ['A small almond tree.', 'A drawing of the grove.', 'Some water from the field.'],
              },
              storyHintEn: 'Read the last sentence carefully.',
            },
          },
        },
      },
      {
        icon: '🎆',
        titleEn: 'Freedom, Flags & a Big Picnic',
        titleHe: 'חירות, דגלים ופיקניק גדול',
        storyHookHe:
          'פסח, יום העצמאות ושבועות! נבחין בין מה שמשפחות עושות בכל שנה לבין מה שקורה עכשיו בחגיגה.',
        grammarTopic: 'Present Simple vs. Present Progressive in Spring Holidays',
        skills: ['Simple vs. Progressive', 'Spring Holidays', 'Speaking About Celebrations'],
        sentenceEn: 'Every Independence Day we have a picnic, and right now Dad is hanging a flag.',
        sentenceHe: 'בכל יום עצמאות אנחנו עושים פיקניק, וממש עכשיו אבא תולה דגל.',
        vocab: [
          ['freedom', 'noun', 'חירות / חופש', '🕊️', 'Passover is the holiday of freedom.', 'פסח הוא חג החירות.'],
          ['flag', 'noun', 'דגל', '🏳️', 'There is a blue and white flag on every balcony.', 'יש דגל כחול-לבן על כל מרפסת.'],
          ['picnic', 'noun', 'פיקניק', '🧺', 'Our class has a picnic in the park every spring.', 'הכיתה שלנו עושה פיקניק בפארק בכל אביב.'],
          ['fireworks', 'noun', 'זיקוקים', '🎆', 'The fireworks light up the sky over the city.', 'הזיקוקים מאירים את השמיים מעל העיר.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'prison', translationHe: 'כלא' },
            { wordEn: 'umbrella', translationHe: 'מטרייה' },
          ],
          shortSentenceEn: 'Dad is hanging a flag.',
          shortSentenceHe: 'אבא תולה דגל.',
          rule: {
            questionEn: 'Complete the sentence: "On Shavuot, many people ____ cheesecake."',
            correct: 'eat',
            wrong: ['are eating', 'eats'],
            explainHe:
              'On Shavuot מראה מסורת שחוזרת בכל שנה, ולכן Present Simple. many people הם רבים, ולכן eat בלי s.',
            hintHe: 'האם המשפט מתאר מה קורה כרגע, או מה עושים בכל שנה בחג? והנושא הוא רבים.',
          },
          story: {
            passageEn:
              'Spring is a busy time for holidays in Israel. On Passover, families sit together at the Seder and tell the story of freedom. A few weeks later, people celebrate Independence Day with flags, picnics and fireworks. Then on Shavuot, children wear white clothes and bring baskets of fruit to kindergarten.',
            passageHe:
              'האביב הוא תקופה עמוסה בחגים בישראל. בפסח משפחות יושבות יחד בליל הסדר ומספרות את סיפור החירות. כמה שבועות אחר כך, אנשים חוגגים את יום העצמאות עם דגלים, פיקניקים וזיקוקים. ואז בשבועות, ילדים לובשים בגדים לבנים ומביאים סלסלות פירות לגן.',
            questionEn: 'What do children wear on Shavuot?',
            questionHe: 'מה ילדים לובשים בשבועות?',
            correct: 'White clothes.',
            wrong: ['Purim costumes.', 'Blue raincoats.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'Mom is making a salad now.',
                wrong: ['Mom makes a salad now.'],
                explainHe: 'now מראה פעולה עכשווית, ולכן is making.',
                hintHe: 'המילה now מצביעה על הרגע הזה. איזו צורה מתאימה לפעולה עכשווית?',
              },
              story: {
                passageEn: 'It is Independence Day. The family has a picnic. Dad is holding a flag.',
                passageHe: 'היום יום העצמאות. המשפחה עושה פיקניק. אבא מחזיק דגל.',
                questionEn: 'What is Dad holding?',
                questionHe: 'מה אבא מחזיק?',
                correct: 'A flag.',
                wrong: ['A bag.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['hunger', 'headache'],
                ['bridge', 'tunnel'],
                ['bathtub', 'dictionary'],
                ['shadows', 'puddles'],
              ],
            },
            master: {
              sentenceEn: 
                'Every spring our class has a picnic and today the teacher is bringing lemonade.',
              sentenceHe: 'בכל אביב הכיתה שלנו עושה פיקניק והיום המורה מביאה לימונדה.',
              decoys: ['have', 'bring'],
              voiceEn: 'People are waving flags in the street.',
              voiceHe: 'אנשים מנופפים בדגלים ברחוב.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Every Shavuot we eat cheesecake and right now Mom is baking one.',
                wrong: [
                  'Every Shavuot we are eating cheesecake and right now Mom is baking one.',
                  'Every Shavuot we eat cheesecake and right now Mom bakes one.',
                  'Every Shavuot we eats cheesecake and right now Mom is baking one.',
                ],
                explainHe: 
                  'Every Shavuot מראה מסורת: Present Simple (eat). right now מראה פעולה עכשווית: is baking.',
                hintEn: 'Find the habit part and the right-now part.',
              },
              story: {
                passageEn: 
                  'In Haifa, the Independence Day picnic is a big tradition. Hundreds of families arrive early to find a place under the trees. This year a boy named Eyal brought a huge blue and white kite instead of a flag. At first, the neighbors laughed, but when the wind lifted it high above the park, children from every corner ran toward him, asking to hold the string.',
                passageHe: '',
                questionEn: 'Why did the children run toward Eyal?',
                questionHe: '',
                correct: 'They wanted to fly the kite too.',
                wrong: [
                  'They wanted to take his flag.',
                  'They were afraid of the strong wind.',
                  'The neighbors asked them to help.',
                ],
              },
              storyHintEn: 'Think about what the kite did in the wind.',
            },
          },
        },
      },
      {
        icon: '🏖️',
        isBoss: true,
        titleEn: 'Boss: Hello, Summer Vacation!',
        titleHe: 'אתגר הבוס: שלום, חופש גדול!',
        storyHookHe:
          'משימת הסיכום של חגיגות האביב והקיץ! קראו על החופש הגדול והראו שליטה בהרגלים, בפעולות של עכשיו ובפעלי מצב.',
        grammarTopic: 'Boss: Present Simple, Present Progressive & Stative Verbs Review',
        skills: ['Boss Unseen', 'Tenses Review', 'Summer Vocab'],
        sentenceEn: 'During the summer vacation, I usually relax at the beach with my friends.',
        sentenceHe: 'בחופש הגדול אני בדרך כלל נח/ה בחוף הים עם החברים שלי.',
        vocab: [
          ['vacation', 'noun', 'חופשה', '🏖️', 'Our summer vacation starts at the end of June.', 'החופש הגדול שלנו מתחיל בסוף יוני.'],
          ['relax', 'verb', 'לנוח / להירגע', '😌', 'My parents relax in the garden after work.', 'ההורים שלי נחים בגינה אחרי העבודה.'],
          ['sunscreen', 'noun', 'קרם הגנה', '🧴', 'Put on sunscreen before you go to the pool.', 'שימו קרם הגנה לפני שאתם הולכים לבריכה.'],
          ['memory', 'noun', 'זיכרון', '📷', 'The camp gave me a happy memory.', 'המחנה נתן לי זיכרון שמח.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'homework', translationHe: 'שיעורי בית' },
            { wordEn: 'rush', translationHe: 'למהר' },
          ],
          shortSentenceEn: 'I relax at the beach.',
          shortSentenceHe: 'אני נח/ה בחוף הים.',
          rule: {
            questionEn: 'Complete the sentence: "Shh! Gal ____ in the hammock right now."',
            correct: 'is sleeping',
            wrong: ['sleeps', 'are sleeping'],
            explainHe: 'right now מראה פעולה שקורית ממש עכשיו. Gal הוא אדם אחד, ולכן is sleeping.',
            hintHe: 'Shh! ו-right now מראים שזה קורה ברגע זה. גל הוא אדם אחד: איזה פועל עזר מתאים?',
          },
          story: {
            passageEn:
              'The last day of school is always exciting. Most students want to sleep late and spend time with their friends. This summer, Talia is working as a helper at a day camp near the sea. Every morning she puts sunscreen on the little kids. She believes this summer is her best vacation so far.',
            passageHe:
              'היום האחרון של הלימודים תמיד מרגש. רוב התלמידים רוצים לישון עד מאוחר ולבלות עם החברים שלהם. בקיץ הזה טליה עובדת כמדריכה בקייטנה ליד הים. בכל בוקר היא מורחת קרם הגנה על הילדים הקטנים. היא מאמינה שהקיץ הזה הוא החופשה הכי טובה שלה עד עכשיו.',
            questionEn: 'What does Talia do every morning at the camp?',
            questionHe: 'מה טליה עושה בכל בוקר בקייטנה?',
            correct: 'She puts sunscreen on the little kids.',
            wrong: ['She swims across the bay.', 'She sleeps late in her tent.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'My dad likes the beach.',
                wrong: ['My dad is liking the beach.'],
                explainHe: 'like הוא פועל מצב, ולכן לא מוסיפים לו ing. עם My dad מוסיפים s: likes.',
                hintHe: 'לאהוב זה מצב ולא פעולה. האם פועל כזה מקבל ing?',
              },
              story: {
                passageEn: 
                  'Summer is here. Tal goes to the beach every day. Today she is swimming with her friends.',
                passageHe: 'הקיץ הגיע. טל הולכת לים כל יום. היום היא שוחה עם החברים שלה.',
                questionEn: 'What is Tal doing today?',
                questionHe: 'מה טל עושה היום?',
                correct: 'Swimming with her friends.',
                wrong: ['Reading at home.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['jacket', 'recipe'],
                ['dive', 'sail'],
                ['toothpaste', 'ketchup'],
                ['headache', 'sunburn'],
              ],
            },
            master: {
              sentenceEn: 'My cousins usually swim all day but today they are resting under umbrellas.',
              sentenceHe: 'בני הדודים שלי בדרך כלל שוחים כל היום אבל היום הם נחים מתחת לשמשיות.',
              decoys: ['swims', 'rest'],
              voiceEn: 'I believe this is my best summer.',
              voiceHe: 'אני מאמין/ה שזה הקיץ הכי טוב שלי.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Noga usually relaxes at home but today she is working at the camp.',
                wrong: [
                  'Noga usually relax at home but today she is working at the camp.',
                  'Noga usually is relaxing at home but today she is working at the camp.',
                  'Noga usually relaxes at home but today she is work at the camp.',
                ],
                explainHe: 
                  'usually מראה הרגל: relaxes (עם she מוסיפים s). today מראה פעולה עכשווית: is working.',
                hintEn: 'Check each verb: habit or happening today?',
              },
              story: {
                passageEn: 
                  'Dana usually spends her summer vacation at the beach, but this year she is working at a small bookshop in the city. At first she was bored, because nobody entered the shop in the heat. Then an old man came in every afternoon and asked for the same book. By the third week, Dana began to save a copy for him. On Friday, he put a small note on the counter. It said only one word: thanks.',
                passageHe: '',
                questionEn: 'Why did the old man leave a note?',
                questionHe: '',
                correct: 'He was grateful that Dana saved the book for him.',
                wrong: [
                  'He wanted to buy a different book.',
                  'He was angry that the shop was empty.',
                  'Dana asked him to write his name.',
                ],
              },
              storyHintEn: 'Think about what Dana began to do in week three.',
            },
          },
        },
      },
    ],
  },
];

export const HOLIDAYS_GRADE_7_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildMiddleSchoolGrade('grade-7', UNITS);
