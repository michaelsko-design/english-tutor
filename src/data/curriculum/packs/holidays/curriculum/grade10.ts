import { buildHighSchoolGrade, type HighSchoolUnitSpec } from '../../../highSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * Grade 10 holidays pack: open from the first day of the grade, so it reviews grade 9's grammar
 * (Present Perfect, Second Conditional, contrast connectors) and grade 10's units 1–2 (the passive
 * and relative clauses) with new holiday words.
 */
const UNITS: HighSchoolUnitSpec[] = [
  {
    ...packUnitNumbers('holidays', 0),
    titleEn: 'Autumn Festivals & Winter Light',
    titleHe: 'חגי הסתיו ואור החורף',
    subtitleHe: 'ראש השנה, סוכות, חנוכה וגשמי החורף — חזרה על סביל ופסוקיות זיקה עם אוצר מילים של חגים',
    badgeEmoji: '🌧️',
    missions: [
      {
        icon: '🍎',
        titleEn: 'Rosh Hashana Customs: What Is Done and Why',
        titleHe: 'מנהגי ראש השנה: מה עושים ולמה',
        storyHookHe:
          'ראש השנה מגיע! נתאר מנהגים בעזרת סביל בהווה: מה אוכלים, מה אומרים ומה שולחים — כשהמנהג חשוב יותר ממי שעושה אותו.',
        grammarTopic: 'Present Simple Passive for Holiday Customs (Review)',
        skills: ['Passive Voice', 'Holiday Customs', 'Band III Vocab'],
        sentenceEn: 'On Rosh Hashana, apples are dipped in honey to wish everyone a sweet year.',
        sentenceHe: 'בראש השנה טובלים תפוחים בדבש כדי לאחל לכולם שנה מתוקה.',
        vocab: [
          ['custom', 'noun', 'מנהג', '📜', 'Each family has its own holiday customs.', 'לכל משפחה יש מנהגי חג משלה.'],
          ['symbolize', 'verb', 'לסמל', '🍎', 'The round challah symbolizes the circle of the year.', 'החלה העגולה מסמלת את מעגל השנה.'],
          ['festive', 'adjective', 'חגיגי / חגיגית', '🎉', 'The table looked festive with flowers and candles.', 'השולחן נראה חגיגי עם פרחים ונרות.'],
          ['apology', 'noun', 'התנצלות', '🙏', 'Before Yom Kippur, many people offer an apology to their friends.', 'לפני יום כיפור, אנשים רבים מבקשים סליחה מחבריהם.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'satellite', translationHe: 'לוויין' },
            { wordEn: 'warehouse', translationHe: 'מחסן' },
          ],
          shortSentenceEn: 'Apples are dipped in honey.',
          shortSentenceHe: 'טובלים תפוחים בדבש.',
          rule: {
            questionEn: 'Complete the sentence: "Special round loaves of challah _______ for the holiday."',
            correct: 'are baked',
            wrong: ['are bake', 'is baked'],
            explainHe: 'הנושא (loaves) ברבים, ולכן are, ואחריו V3: baked.',
            hintHe: 'בדקו אם הנושא ביחיד או ברבים, ואיזו צורת פועל באה אחרי be בסביל.',
          },
          story: {
            passageEn:
              'In many Israeli homes, the Rosh Hashana meal is planned days in advance. Pomegranates are bought at the market, and round challot are ordered from the bakery. During the meal, short blessings are said over different foods. Each food symbolizes a wish for the new year. After dinner, holiday messages are often sent to relatives abroad.',
            passageHe:
              'בבתים רבים בישראל מתכננים את ארוחת ראש השנה כמה ימים מראש. קונים רימונים בשוק ומזמינים חלות עגולות מהמאפייה. בזמן הארוחה אומרים ברכות קצרות על מאכלים שונים. כל מאכל מסמל משאלה לשנה החדשה. אחרי הארוחה שולחים לעיתים קרובות הודעות חג לקרובי משפחה בחו״ל.',
            questionEn: 'Where are the round challot ordered from?',
            questionHe: 'מאיפה מזמינים את החלות העגולות?',
            correct: 'From the bakery.',
            wrong: ['From the market.', 'From a restaurant.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'Fresh bread is bought before the holiday.',
                wrong: ['Fresh bread are bought before the holiday.'],
                explainHe: 'bread הוא ביחיד, ולכן is + V3: is bought.',
                hintHe: 'שימו לב אם bread ביחיד או ברבים, ואיזו צורה של be מתאימה.',
              },
              story: {
                passageEn:
                  'On Rosh Hashana, we eat apples with honey. The apples are cut into pieces. Everyone makes a wish for a sweet year.',
                passageHe:
                  'בראש השנה אנחנו אוכלים תפוחים עם דבש. התפוחים נחתכים לחתיכות. כולם מביעים משאלה לשנה מתוקה.',
                questionEn: 'What do we eat with honey?',
                questionHe: 'מה אוכלים עם דבש?',
                correct: 'Apples.',
                wrong: ['Bread.'],
              },
            },
            challenger: {
              clozeWrong: [['passport', 'climate'], ['replace', 'cancel'], ['nervous', 'jealous'], ['island', 'elbow']],
            },
            master: {
              sentenceEn: 'During the holiday meal, blessings are said over fruit that grows in Israel.',
              sentenceHe: 'במהלך ארוחת החג אומרים ברכות על פירות שגדלים בישראל.',
              decoys: ['is', 'saying'],
              voiceEn: 'Holiday cakes are baked in many homes.',
              voiceHe: 'עוגות חג נאפות בבתים רבים.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Round loaves are placed on the table before the meal.',
                wrong: ['Round loaves is placed on the table before the meal.', 'Round loaves are place on the table before the meal.', 'Round loaves placed are on the table before the meal.'],
                explainHe: 'סביל בהווה: am / is / are + V3. loaves ברבים ולכן are placed, בסדר הזה.',
                hintEn: 'Check the verb be, the verb form and the word order.',
              },
              story: {
                passageEn:
                  'Before Rosh Hashana, Hannah and her grandmother prepare a small jar of honey for each guest. The jars used to be bought in the supermarket, but today they decorate each one by hand and write a different wish on a label. The guests are invited to read their label aloud before eating the first apple. Last year one label said "May your year be full of surprises", and the guest who received it is still waiting to see what it means.',
                passageHe: '',
                questionEn: 'What can we infer about the wish on that label?',
                questionHe: '',
                correct: 'It describes something unexpected that has not happened yet.',
                wrong: ['It promises a large amount of money.', 'It was written by the supermarket.', 'It was already fulfilled last week.'],
              },
              storyHintEn: 'Think about what surprises are like.',
            },
          },
        },
      },
      {
        icon: '🌴',
        titleEn: 'Inside the Sukkah: A Hut Whose Roof Is Green',
        titleHe: 'בתוך הסוכה: צריף שהגג שלו ירוק',
        storyHookHe:
          'סוכות! נתאר את הסוכה ואת האורחים בעזרת פסוקיות זיקה: who לאנשים, which / that לדברים ו-whose לשייכות.',
        grammarTopic: 'Relative Clauses (who, which, that, whose) for Sukkot (Review)',
        skills: ['Relative Clauses', 'Description', 'Sukkot Vocab'],
        sentenceEn: 'A sukkah is a temporary hut whose roof is covered with palm branches.',
        sentenceHe: 'סוכה היא צריף זמני שהגג שלו מכוסה בענפי דקל.',
        vocab: [
          ['hut', 'noun', 'צריף / בקתה', '🛖', 'The scouts built a small hut in the forest.', 'הצופים בנו צריף קטן ביער.'],
          ['foliage', 'noun', 'עלווה', '🌿', 'The roof was made of thick green foliage.', 'הגג היה עשוי מעלווה ירוקה וצפופה.'],
          ['hospitality', 'noun', 'הכנסת אורחים', '🤗', 'Sukkot is a time of hospitality and open doors.', 'סוכות הוא זמן של הכנסת אורחים ודלתות פתוחות.'],
          ['abundance', 'noun', 'שפע', '🌾', 'In autumn, the markets offer an abundance of fruit.', 'בסתיו השווקים מציעים שפע של פירות.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'skyscraper', translationHe: 'גורד שחקים' },
            { wordEn: 'battery', translationHe: 'סוללה' },
          ],
          shortSentenceEn: 'This is the sukkah we built.',
          shortSentenceHe: 'זו הסוכה שבנינו.',
          rule: {
            questionEn: 'Complete the sentence: "Our neighbour, _______ sukkah is the biggest on the street, invited us for dinner."',
            correct: 'whose',
            wrong: ['who', 'which'],
            explainHe: 'whose מציין שייכות: הסוכה של השכן. who מתאים כשהאדם עצמו עושה את הפעולה, ו-which מתאים לדברים.',
            hintHe: 'אחרי החסר בא שם עצם (sukkah) ששייך לשכן. איזו מילת זיקה מראה שייכות?',
          },
          story: {
            passageEn:
              'The Ben-David family, who live in a small apartment in Jaffa, build their sukkah on the roof every year. The walls are made of old sheets, which the children paint with fruit and stars. The roof is covered with foliage that a neighbour brings from his garden. Every evening of the holiday, students whose families live far away are invited to eat with them.',
            passageHe:
              'משפחת בן-דוד, שגרה בדירה קטנה ביפו, בונה את הסוכה שלה על הגג בכל שנה. הקירות עשויים מסדינים ישנים, שהילדים מציירים עליהם פירות וכוכבים. הגג מכוסה בעלווה ששכן מביא מהגינה שלו. בכל ערב של החג מוזמנים לאכול איתם סטודנטים שהמשפחות שלהם גרות רחוק.',
            questionEn: 'Who brings the foliage for the roof?',
            questionHe: 'מי מביא את העלווה לגג?',
            correct: 'A neighbour brings it from his garden.',
            wrong: ['The children buy it at the market.', 'The grandparents bring it from the north.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'We visited a farm that grows olives.',
                wrong: ['We visited a farm who grows olives.'],
                explainHe: 'farm הוא מקום (לא אדם), ולכן that או which, ולא who.',
                hintHe: 'בדקו אם המילה לפני החסר היא אדם או דבר.',
              },
              story: {
                passageEn:
                  'We built a sukkah with my uncle, who is a carpenter. The roof is made of palm leaves. We ate dinner there on Friday.',
                passageHe:
                  'בנינו סוכה עם הדוד שלי, שהוא נגר. הגג עשוי מעלי דקל. אכלנו שם ארוחת ערב ביום שישי.',
                questionEn: 'Who is the carpenter?',
                questionHe: 'מי הנגר?',
                correct: 'My uncle.',
                wrong: ['My brother.'],
              },
            },
            challenger: {
              clozeWrong: [['river', 'mountain'], ['chocolate', 'sunshine'], ['jealousy', 'loneliness'], ['insect', 'elbow']],
            },
            master: {
              sentenceEn:
                'The family invites neighbours whose own sukkah is too small to hold all their guests.',
              sentenceHe: 'המשפחה מזמינה שכנים שהסוכה שלהם קטנה מכדי להכיל את כל האורחים שלהם.',
              decoys: ['who', 'that'],
              voiceEn: 'The guests who arrived early helped us.',
              voiceHe: 'האורחים שהגיעו מוקדם עזרו לנו.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'I admire people who welcome strangers into their homes.',
                wrong: ['I admire people which welcome strangers into their homes.', 'I admire people who welcomes strangers into their homes.', 'I admire people whose welcome strangers into their homes.'],
                explainHe:
                  'לבני אדם משתמשים ב-who, והפועל מתאים לרבים: people who welcome. whose מראה שייכות ואינו מתאים כאן.',
                hintEn: 'Check the pronoun for people and the verb after it.',
              },
              story: {
                passageEn:
                  'Every year before Sukkot, the Levi family lets its youngest child choose the decorations for the sukkah. Last year, six-year-old Lia insisted on hanging a paper lantern that she had made at school, even though it was far too big. Her father, who is usually very careful about appearances, decided not to argue. During the first dinner, the lantern swung gently in the wind and cast a warm light on the faces around the table. Several guests said afterwards that it was the most beautiful decoration they had ever seen.',
                passageHe: '',
                questionEn: 'Why did the father let Lia hang the lantern?',
                questionHe: '',
                correct: 'He wanted his daughter to feel that her choice mattered.',
                wrong: ['He thought the lantern was exactly the right size.', 'The guests had asked him to hang it.', 'He was not at home on that evening.'],
              },
              storyHintEn: 'Notice the word insisted and how he usually acts.',
            },
          },
        },
      },
      {
        icon: '🕯️',
        isBoss: true,
        titleEn: 'Boss: Hanukkah Lights and Winter Rains',
        titleHe: 'אתגר הבוס: אורות חנוכה וגשמי החורף',
        storyHookHe:
          'אתגר בוס לפרק! סיפור חנוכה, מאגרי המים והחורף הישראלי: נשלב סביל בהווה ובעבר עם פסוקיות זיקה, כולל פסוקיות בין פסיקים (which).',
        grammarTopic: 'Review: Passive Voice & Non-Defining Relative Clauses',
        skills: ['Boss Challenge', 'Passive Synthesis', 'Winter Unseen'],
        sentenceEn: 'The Hanukkah candles, which are lit for eight nights, remind us of an ancient story of courage.',
        sentenceHe: 'נרות חנוכה, שמדליקים במשך שמונה לילות, מזכירים לנו סיפור עתיק של אומץ.',
        vocab: [
          ['commemorate', 'verb', 'להנציח / לציין', '🕯️', 'The holiday commemorates events from over two thousand years ago.', 'החג מציין אירועים מלפני יותר מאלפיים שנה.'],
          ['illuminate', 'verb', 'להאיר', '💡', 'Thousands of lights illuminate the old city at night.', 'אלפי אורות מאירים את העיר העתיקה בלילה.'],
          ['reservoir', 'noun', 'מאגר מים', '💧', 'The winter rain slowly fills the reservoirs.', 'גשם החורף ממלא לאט את מאגרי המים.'],
          ['precipitation', 'noun', 'משקעים', '🌧️', 'The north receives more precipitation than the south.', 'הצפון מקבל יותר משקעים מהדרום.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'tournament', translationHe: 'טורניר' },
            { wordEn: 'pharmacy', translationHe: 'בית מרקחת' },
          ],
          shortSentenceEn: 'The candles are lit.',
          shortSentenceHe: 'מדליקים את הנרות.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'The Kinneret, which was filled by heavy rain, reached a record level.',
            wrong: [
              'The Kinneret, that was filled by heavy rain, reached a record level.',
              'The Kinneret, which filled by heavy rain, reached a record level.',
            ],
            explainHe: 'בפסוקית בין פסיקים לא משתמשים ב-that אלא ב-which. בסביל בעבר צריך להגיד was + V3.',
            hintHe: 'יש כאן פסוקית בין פסיקים ומבנה סביל בעבר. בדקו את מילת הזיקה ואת פועל העזר.',
          },
          story: {
            passageEn:
              'Last winter was one of the wettest in years. In January alone, more rain was measured in the Galilee than in the whole previous winter. Several roads were closed, and a few schools were flooded. However, the farmers, who were worried after the dry autumn, were delighted. By March, the reservoirs in the north were almost full.',
            passageHe:
              'החורף שעבר היה אחד הגשומים ביותר מזה שנים. רק בינואר נמדד בגליל יותר גשם מאשר בכל החורף הקודם. כמה כבישים נסגרו, וכמה בתי ספר הוצפו. עם זאת, החקלאים, שדאגו בגלל הסתיו היבש, שמחו מאוד. עד מרץ מאגרי המים בצפון היו כמעט מלאים.',
            questionEn: 'What was measured in the Galilee in January?',
            questionHe: 'מה נמדד בגליל בינואר?',
            correct: 'More rain than in the whole previous winter.',
            wrong: ['Less rain than in a normal year.', 'The coldest night in history.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'Doughnuts are eaten during Hanukkah.',
                wrong: ['Doughnuts is eaten during Hanukkah.'],
                explainHe: 'Doughnuts ברבים, ולכן are + V3: are eaten.',
                hintHe: 'בדקו אם הנושא ביחיד או ברבים.',
              },
              story: {
                passageEn:
                  'It rained all night in the north. The river was full in the morning. The children stayed home.',
                passageHe: 'ירד גשם כל הלילה בצפון. הנהר היה מלא בבוקר. הילדים נשארו בבית.',
                questionEn: 'What happened to the river?',
                questionHe: 'מה קרה לנהר?',
                correct: 'It was full.',
                wrong: ['It was dry.'],
              },
            },
            challenger: {
              clozeWrong: [['predict', 'invent'], ['darken', 'freeze'], ['mountain', 'tower'], ['temperature', 'latitude']],
            },
            master: {
              sentenceEn:
                'The reservoirs, which were almost empty in autumn, were filled by heavy rain in January.',
              sentenceHe: 'מאגרי המים, שהיו כמעט ריקים בסתיו, התמלאו בגשם כבד בינואר.',
              decoys: ['whose', 'fill'],
              voiceEn: 'The candles were lit by the children.',
              voiceHe: 'הנרות הודלקו על ידי הילדים.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct:
                  'The festival, which was celebrated last week, attracted thousands of visitors.',
                wrong: ['The festival, that was celebrated last week, attracted thousands of visitors.', 'The festival, which celebrated last week, attracted thousands of visitors.', 'The festival, which was celebrate last week, attracted thousands of visitors.'],
                explainHe:
                  'בפסוקית בין פסיקים משתמשים ב-which ולא ב-that. סביל בעבר: was + V3 (was celebrated).',
                hintEn: 'Check the pronoun and the passive verb.',
              },
              story: {
                passageEn:
                  'In one very dry winter, the water level of a large lake fell so low that fishermen could walk on parts of the lake bed. Officials urged households to use less water, and several cities announced limits on watering gardens. People complained at first, but when the rains finally came the following year, many of them had already changed their habits for good. Water experts say that this experience shaped the way people think about water even today.',
                passageHe: '',
                questionEn: 'What can we conclude about the dry winter?',
                questionHe: '',
                correct: 'It taught many people to save water for years afterwards.',
                wrong: ['It caused the lake to disappear forever.', 'It convinced officials that rain was unnecessary.', 'It ended when people watered their gardens.'],
              },
              storyHintEn: 'Look at what people kept doing after the rain came.',
            },
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('holidays', 1),
    titleEn: 'Spring Celebrations & Summer Heritage',
    titleHe: 'חגיגות האביב ומורשת הקיץ',
    subtitleHe: 'ט״ו בשבט, פורים, פסח, יום העצמאות ושבועות — חזרה על סביל, פסוקיות זיקה ותנאי שני',
    badgeEmoji: '🌷',
    missions: [
      {
        icon: '🌱',
        titleEn: 'Trees Are Planted, Masks Are Worn',
        titleHe: 'שותלים עצים, עוטים מסכות',
        storyHookHe:
          'מט״ו בשבט ועד פורים: נתאר מה נעשה בכל חג בעזרת סביל בהווה ובעבר — איפה נשתלו העצים ומתי נאספו התרומות.',
        grammarTopic: 'Passive Voice in Present & Past for Spring Holidays (Review)',
        skills: ['Passive Voice', 'Purim & Tu BiShvat', 'Charity Vocab'],
        sentenceEn: 'Thousands of seedlings were planted by students across Israel on Tu BiShvat.',
        sentenceHe: 'אלפי שתילים נשתלו על ידי תלמידים ברחבי ישראל בט״ו בשבט.',
        vocab: [
          ['seedling', 'noun', 'שתיל', '🌱', 'Each seedling needs water every day in its first month.', 'כל שתיל צריך מים בכל יום בחודש הראשון שלו.'],
          ['masquerade', 'noun', 'נשף מסכות', '🎭', 'The school masquerade was held in the gym.', 'נשף המסכות של בית הספר נערך באולם הספורט.'],
          ['charity', 'noun', 'צדקה / ארגון צדקה', '🎁', 'Part of the money from the fair went to charity.', 'חלק מהכסף מהיריד הלך לצדקה.'],
          ['parade', 'noun', 'תהלוכה / מצעד', '🎊', 'The Purim parade passes through the main street.', 'תהלוכת פורים עוברת ברחוב הראשי.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'laboratory', translationHe: 'מעבדה' },
            { wordEn: 'invoice', translationHe: 'חשבונית' },
          ],
          shortSentenceEn: 'Seedlings were planted today.',
          shortSentenceHe: 'שתילים נשתלו היום.',
          rule: {
            questionEn: 'Complete the sentence: "Last year, more than five hundred food baskets _______ to families in need before Purim."',
            correct: 'were delivered',
            wrong: ['was delivered', 'were deliver'],
            explainHe: 'הנושא (baskets) ברבים והפעולה בעבר, ולכן were + V3: were delivered.',
            hintHe: 'הסלים חולקו בעבר. בדקו את צורת be שמתאימה לרבים ואת צורת הפועל שבאה אחריה.',
          },
          story: {
            passageEn:
              'Every Purim, a big masquerade is organised by the students of a high school in Rishon LeZion. Tickets are sold for twenty shekels, and all the money is given to charity. Last year, the money was used to buy books for a children’s hospital. The prize for the best costume was chosen by a group of teachers. It was won by a student who came dressed as a walking tree.',
            passageHe:
              'בכל פורים, תלמידי תיכון בראשון לציון מארגנים נשף מסכות גדול. הכרטיסים נמכרים בעשרים שקלים, וכל הכסף ניתן לצדקה. בשנה שעברה הכסף שימש לקניית ספרים לבית חולים לילדים. הזוכה בפרס התחפושת הטובה ביותר נבחר על ידי קבוצת מורים. בפרס זכה תלמיד שהגיע מחופש לעץ מהלך.',
            questionEn: 'What was the money used for last year?',
            questionHe: 'למה שימש הכסף בשנה שעברה?',
            correct: 'To buy books for a children’s hospital.',
            wrong: ['To build a new school gym.', 'To plant trees in the park.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'The costumes were made by the students.',
                wrong: ['The costumes was made by the students.'],
                explainHe: 'costumes ברבים והפעולה בעבר, ולכן were + V3: were made.',
                hintHe: 'בדקו אם הנושא ביחיד או ברבים לפני שבוחרים בין was ל-were.',
              },
              story: {
                passageEn:
                  'Last Friday, a party was held at school. Many cookies were baked by the parents. The money was given to charity.',
                passageHe:
                  'ביום שישי שעבר נערכה מסיבה בבית הספר. עוגיות רבות נאפו על ידי ההורים. הכסף ניתן לצדקה.',
                questionEn: 'What was held at school?',
                questionHe: 'מה נערך בבית הספר?',
                correct: 'A party.',
                wrong: ['A race.'],
              },
            },
            challenger: {
              clozeWrong: [['pebble', 'statue'], ['recipe', 'ladder'], ['summer', 'midnight'], ['concert', 'banquet']],
            },
            master: {
              sentenceEn:
                'Hundreds of costumes were collected by volunteers and donated to families in need.',
              sentenceHe: 'מאות תחפושות נאספו על ידי מתנדבים ונתרמו למשפחות נזקקות.',
              decoys: ['collect', 'was'],
              voiceEn: 'A big parade was organised last spring.',
              voiceHe: 'מצעד גדול אורגן באביב שעבר.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Many trees were damaged by the strong wind last night.',
                wrong: ['Many trees was damaged by the strong wind last night.', 'Many trees were damage by the strong wind last night.', 'Many trees were damaged the strong wind last night.'],
                explainHe:
                  'סביל בעבר: was / were + V3 + by (מבצע הפעולה). trees ברבים ולכן were, damaged היא V3, ויש להשתמש ב-by.',
                hintEn: 'Check the verb be, the verb form and the word by.',
              },
              story: {
                passageEn:
                  'The Purim carnival in our neighbourhood was almost cancelled this year. The hall where it is usually held had been closed after a leak in the roof, and the organisers could not find another place. At the last moment, the owner of a nearby supermarket offered his large car park. Tables were moved, lights were hung between the trees, and hundreds of children arrived in costumes. The organisers admitted that the evening was more colourful than any carnival held in the old hall.',
                passageHe: '',
                questionEn: 'Why was the carnival held in a car park?',
                questionHe: '',
                correct: 'The usual hall could not be used because of damage.',
                wrong: ['The organisers wanted a smaller crowd.', 'The supermarket owner needed more customers.', 'The children refused to go inside the hall.'],
              },
              storyHintEn: 'What had happened to the hall?',
            },
          },
        },
      },
      {
        icon: '🎆',
        titleEn: 'Freedom and Independence: Stories That Are Told',
        titleHe: 'חירות ועצמאות: סיפורים שמסופרים',
        storyHookHe:
          'פסח ויום העצמאות: נספר על ליל הסדר ועל טקס הדלקת המשואות בעזרת פסוקיות זיקה וסביל — מה מסופר, מי מדליק ומה משמעות הסמלים.',
        grammarTopic: 'Relative Clauses with the Passive for Spring Holidays (Review)',
        skills: ['Relative Clauses', 'Passive Voice', 'Spring Holidays'],
        sentenceEn: 'The Haggadah, which is read at the Seder, tells the story of the Exodus from Egypt.',
        sentenceHe: 'ההגדה, שקוראים בה בליל הסדר, מספרת את סיפור יציאת מצרים.',
        vocab: [
          ['liberation', 'noun', 'שחרור', '🕊️', 'Passover celebrates the liberation of the Israelites from slavery.', 'פסח חוגג את שחרור בני ישראל מעבדות.'],
          ['exodus', 'noun', 'יציאה (המונית) / יציאת מצרים', '🚶', 'The story of the exodus has been told for centuries.', 'סיפור יציאת מצרים מסופר כבר מאות שנים.'],
          ['torch', 'noun', 'לפיד / משואה', '🔥', 'Twelve citizens light a torch at the ceremony on Mount Herzl.', 'שנים עשר אזרחים מדליקים משואה בטקס בהר הרצל.'],
          ['anthem', 'noun', 'המנון', '🎶', 'The crowd stood up for the national anthem.', 'הקהל נעמד לשירת ההמנון הלאומי.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'motorway', translationHe: 'כביש מהיר' },
            { wordEn: 'thermometer', translationHe: 'מדחום' },
          ],
          shortSentenceEn: 'The Haggadah is read aloud.',
          shortSentenceHe: 'קוראים את ההגדה בקול.',
          rule: {
            questionEn: 'Complete the sentence: "The people _______ light the torches are chosen for their contribution to society."',
            correct: 'who',
            wrong: ['which', 'whose'],
            explainHe: 'people הם בני אדם, ומיד אחרי החסר בא פועל (light), ולכן who.',
            hintHe: 'המילה לפני החסר מתארת בני אדם, ואחרי החסר בא פועל ולא שם עצם. איזו מילת זיקה מתאימה?',
          },
          story: {
            passageEn:
              'Every Independence Day eve, a ceremony is held on Mount Herzl in Jerusalem. Twelve torches are lit by Israelis who have made a special contribution to society. This year, one of the torches was lit by a teenager who started a reading club for children in hospitals. The ceremony, which is broadcast live on television, ends with fireworks and the national anthem.',
            passageHe:
              'בכל ערב יום העצמאות נערך טקס בהר הרצל בירושלים. שתים עשרה משואות מודלקות על ידי ישראלים שתרמו תרומה מיוחדת לחברה. השנה אחת המשואות הודלקה על ידי נערה שהקימה מועדון קריאה לילדים בבתי חולים. הטקס, שמשודר בשידור חי בטלוויזיה, מסתיים בזיקוקים ובהמנון הלאומי.',
            questionEn: 'How can people at home watch the ceremony?',
            questionHe: 'איך אנשים בבית יכולים לצפות בטקס?',
            correct: 'It is broadcast live on television.',
            wrong: ['It is shown only in cinemas.', 'It is streamed the next morning.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'The song that we sang was beautiful.',
                wrong: ['The song who we sang was beautiful.'],
                explainHe: 'song הוא דבר, ולכן that או which, ולא who.',
                hintHe: 'בדקו אם המילה לפני החסר היא אדם או דבר.',
              },
              story: {
                passageEn:
                  'We went to a ceremony on Independence Day. The flag, which was very big, hung over the stage. Everyone sang the anthem.',
                passageHe:
                  'הלכנו לטקס ביום העצמאות. הדגל, שהיה גדול מאוד, היה תלוי מעל הבמה. כולם שרו את ההמנון.',
                questionEn: 'What did everyone sing?',
                questionHe: 'מה כולם שרו?',
                correct: 'The anthem.',
                wrong: ['A birthday song.'],
              },
            },
            challenger: {
              clozeWrong: [['punishment', 'imprisonment'], ['weekend', 'elevator'], ['flag', 'trophy'], ['weather', 'recipe']],
            },
            master: {
              sentenceEn: 'The story that is told at the Seder reminds families of their freedom.',
              sentenceHe: 'הסיפור שמסופר בליל הסדר מזכיר למשפחות את החירות שלהן.',
              decoys: ['who', 'tells'],
              voiceEn: 'The flag that was raised is blue and white.',
              voiceHe: 'הדגל שהונף הוא כחול ולבן.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The man who lit the torch is a famous doctor.',
                wrong: ['The man which lit the torch is a famous doctor.', 'The man whose lit the torch is a famous doctor.', 'The man who he lit the torch is a famous doctor.'],
                explainHe: 'לאדם משתמשים ב-who, בלי which, בלי whose ובלי כינוי נוסף כמו he.',
                hintEn: 'Check the pronoun for a person and look for extra words.',
              },
              story: {
                passageEn:
                  'At our school ceremony for Independence Day, the principal asked a surprising question: "What would you say to the first people who lived here after 1948?" Most students described the difficulties of those years, such as small apartments, rationing and the shortage of work. One quiet girl, whose grandmother had arrived by ship as a child, said only that she would thank them for not giving up. The hall became silent for a moment, and then everybody applauded.',
                passageHe: '',
                questionEn: 'Why did the hall become silent?',
                questionHe: '',
                correct: 'The simple answer touched everyone in the hall.',
                wrong: ['The principal had lost the microphone.', 'Nobody understood the question.', 'The ceremony ended earlier than planned.'],
              },
              storyHintEn: 'Notice how her answer differed from the others.',
            },
          },
        },
      },
      {
        icon: '🌾',
        isBoss: true,
        titleEn: 'Boss: Shavuot Heritage and Summer Journeys',
        titleHe: 'אתגר הבוס: מורשת שבועות ומסעות הקיץ',
        storyHookHe:
          'אתגר בוס לפרק! שבועות, הביכורים והחופש הגדול: נשלב סביל, פסוקיות זיקה, תנאי שני ו-Present Perfect בקטע קריאה אחד.',
        grammarTopic: 'Review: Passive, Relative Clauses & Conditionals in Holiday Texts',
        skills: ['Boss Challenge', 'Unseen Reading', 'Summer Vocab'],
        sentenceEn: 'In ancient times, the first fruits of the harvest were carried to Jerusalem by farmers.',
        sentenceHe: 'בימי קדם, הביכורים הובאו לירושלים על ידי חקלאים.',
        vocab: [
          ['heritage', 'noun', 'מורשת', '🏛️', 'Folk dances are part of our cultural heritage.', 'ריקודי עם הם חלק מהמורשת התרבותית שלנו.'],
          ['agriculture', 'noun', 'חקלאות', '🚜', 'Many kibbutzim still depend on agriculture.', 'קיבוצים רבים עדיין תלויים בחקלאות.'],
          ['excursion', 'noun', 'טיול / סיור', '🧭', 'The class went on an excursion to the Carmel.', 'הכיתה יצאה לסיור בכרמל.'],
          ['heatwave', 'noun', 'גל חום', '🌡️', 'During the heatwave, the beaches were full.', 'בזמן גל החום החופים היו מלאים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'skeleton', translationHe: 'שלד' },
            { wordEn: 'elevator', translationHe: 'מעלית' },
          ],
          shortSentenceEn: 'Fruits were carried to Jerusalem.',
          shortSentenceHe: 'פירות הובאו לירושלים.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'If we had more time this summer, we would join an archaeological dig.',
            wrong: [
              'If we have more time this summer, we would join an archaeological dig.',
              'If we had more time this summer, we will join an archaeological dig.',
            ],
            explainHe: 'תנאי שני: if + Past Simple (had), ובתוצאה would + פועל בסיס.',
            hintHe: 'זה מצב דמיוני. בדקו ששני חלקי המשפט מתאימים זה לזה: הזמן אחרי if ופועל העזר בתוצאה.',
          },
          story: {
            passageEn:
              'On Shavuot, the children of Kibbutz Yagur take part in a festive ceremony, which celebrates the end of the wheat harvest. Baskets of fruit and vegetables are carried on decorated tractors. The ceremony has been held in the kibbutz for over ninety years. After the holiday, many families leave for summer excursions, but they always return for the next Shavuot.',
            passageHe:
              'בשבועות, ילדי קיבוץ יגור משתתפים בטקס חגיגי, שחוגג את סוף קציר החיטה. סלי פירות וירקות מובלים על טרקטורים מקושטים. הטקס נערך בקיבוץ כבר יותר מתשעים שנה. אחרי החג משפחות רבות יוצאות לטיולי קיץ, אבל הן תמיד חוזרות לשבועות הבא.',
            questionEn: 'How are the baskets of fruit carried?',
            questionHe: 'איך מובלים סלי הפירות?',
            correct: 'On decorated tractors.',
            wrong: ['In small boats.', 'By train.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'If I had a day off, I would visit a farm.',
                wrong: ['If I have a day off, I would visit a farm.'],
                explainHe: 'תנאי שני: If + Past Simple (had), ובתוצאה would + פועל בסיס.',
                hintHe: 'מצב דמיוני: בדקו איזה זמן מתאים אחרי if.',
              },
              story: {
                passageEn:
                  'It was a very hot day. The class went on a trip to a farm. They picked apples and drank cold water.',
                passageHe: 'היה יום חם מאוד. הכיתה יצאה לטיול בחווה. הם קטפו תפוחים ושתו מים קרים.',
                questionEn: 'What did the class pick?',
                questionHe: 'מה הכיתה קטפה?',
                correct: 'Apples.',
                wrong: ['Grapes.'],
              },
            },
            challenger: {
              clozeWrong: [['pollution', 'traffic'], ['pollution', 'laziness'], ['exam', 'invitation'], ['snowstorm', 'blizzard']],
            },
            master: {
              sentenceEn:
                'If farmers had more water, they would grow vegetables that are sold in local markets.',
              sentenceHe: 'אילו היו לחקלאים יותר מים, הם היו מגדלים ירקות שנמכרים בשווקים מקומיים.',
              decoys: ['will', 'selling'],
              voiceEn: 'The fruit was carried by young farmers.',
              voiceHe: 'הפירות נישאו על ידי חקלאים צעירים.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'If we had a bus, we would travel to the north every month.',
                wrong: ['If we have a bus, we would travel to the north every month.', 'If we had a bus, we will travel to the north every month.', 'If we would have a bus, we would travel to the north every month.'],
                explainHe:
                  'תנאי שני: If + Past Simple, would + פועל בסיס. לא Present אחרי if, לא will, ולא would אחרי if.',
                hintEn: 'Check the tense after if and the verb in the result.',
              },
              story: {
                passageEn:
                  'Every summer, the Peled family drives north to spend a week at a field school. Last summer, a severe heatwave made hiking impossible after ten in the morning, so the instructors changed the programme: the group walked at dawn, rested during the hottest hours in the shade of an old carob tree, and then helped farmers pick tomatoes in the evening. Dan, the youngest child, complained at first, but on the last day he said that this had been his favourite holiday. His mother admitted that she was also surprised.',
                passageHe: '',
                questionEn: 'What can we infer about the changed programme?',
                questionHe: '',
                correct: 'It turned out better than the family had expected.',
                wrong: ['It was cancelled after two days.', 'It made the family leave early.', 'It only included hiking at noon.'],
              },
              storyHintEn: 'Compare how Dan felt at first and on the last day.',
            },
          },
        },
      },
    ],
  },
];

export const HOLIDAYS_GRADE_10_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildHighSchoolGrade('grade-10', UNITS);
