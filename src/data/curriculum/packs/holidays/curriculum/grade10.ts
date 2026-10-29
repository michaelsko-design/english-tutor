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
        },
      },
    ],
  },
];

export const HOLIDAYS_GRADE_10_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildHighSchoolGrade('grade-10', UNITS);
