import { buildHighSchoolGrade, type HighSchoolUnitSpec } from '../../../highSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

const UNITS: HighSchoolUnitSpec[] = [
  {
    ...packUnitNumbers('holidays', 0),
    titleEn: 'Autumn & Winter Festivals',
    titleHe: 'חגי הסתיו והחורף',
    subtitleHe: 'ראש השנה, סוכות, חנוכה וגשמי החורף: סביל, סיבה ותוצאה ואוצר מילים Band III',
    badgeEmoji: '🌧️',
    missions: [
      {
        icon: '🍎',
        titleEn: 'New Year & Harvest Booths: The Passive',
        titleHe: 'שנה חדשה וסוכות הקציר: סביל',
        storyHookHe:
          'בראש השנה ובסוכות מתמלאים הבתים במנהגים: תפוחים בדבש, רימונים וסוכות בחצר. נחזור על מבנה הסביל (is / are / was / were + V3) כדי לתאר מה נעשה בחגים, בלי לציין מי עושה זאת.',
        grammarTopic: 'Passive Voice Review (Present & Past) for Customs',
        skills: ['Passive Voice', 'Describing Customs', 'Cultural Reading'],
        sentenceEn: 'On Rosh Hashana, slices of apple are dipped in honey to wish everyone a sweet year.',
        sentenceHe: 'בראש השנה פרוסות תפוח נטבלות בדבש כדי לאחל לכולם שנה מתוקה.',
        vocab: [
          [
            'pomegranate',
            'noun',
            'רימון',
            '🍎',
            'A pomegranate is said to contain hundreds of seeds.',
            'אומרים שברימון יש מאות גרעינים.',
          ],
          [
            'harvest',
            'noun',
            'קציר / אסיף',
            '🌾',
            'Sukkot was originally a celebration of the autumn harvest.',
            'סוכות היה במקורו חגיגה של האסיף בסתיו.',
          ],
          [
            'temporary',
            'adjective',
            'זמני',
            '⏳',
            'A sukkah is a temporary hut with a roof of branches.',
            'סוכה היא מבנה זמני עם גג של ענפים.',
          ],
          [
            'reflection',
            'noun',
            'הרהור / חשבון נפש',
            '🪞',
            'The new year is a time of reflection and new goals.',
            'השנה החדשה היא זמן של חשבון נפש ומטרות חדשות.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'permanent', translationHe: 'קבוע' },
            { wordEn: 'drought', translationHe: 'בצורת' },
          ],
          shortSentenceEn: 'The sukkah was decorated beautifully.',
          shortSentenceHe: 'הסוכה קושטה יפה.',
          rule: {
            questionEn: 'Which sentence is in the Past Simple Passive?',
            correct: 'The sukkah was built by the whole family on Sunday.',
            wrong: [
              'The whole family built the sukkah on Sunday.',
              'The sukkah is built by the whole family every year.',
            ],
            explainHe:
              'סביל בעבר בנוי מ-was / were + V3. במשפט אחד הפועל פעיל (built), ובמשפט אחר הסביל בהווה (is built).',
            hintHe: 'בסביל הדבר שעליו עובדים הוא הנושא. בדקו גם את פועל העזר: האם הוא בהווה או בעבר?',
          },
          story: {
            passageEn:
              'In many Israeli towns, sukkahs are built on balconies and in gardens a few days after Yom Kippur. The walls are made of cloth or wood, and the roof is covered with palm branches. Inside, children hang paper chains and pictures of fruit. During the festival, meals are eaten in the sukkah, and guests are warmly invited to join.',
            passageHe:
              'בערים רבות בישראל בונים סוכות במרפסות ובגינות כמה ימים אחרי יום כיפור. הקירות עשויים מבד או מעץ, והגג מכוסה בענפי דקל. בפנים הילדים תולים שרשראות נייר ותמונות של פירות. במהלך החג אוכלים את הארוחות בסוכה, ומזמינים אורחים בחום להצטרף.',
            questionEn: 'What is the roof of the sukkah covered with?',
            questionHe: 'במה מכוסה הגג של הסוכה?',
            correct: 'It is covered with palm branches.',
            wrong: ['It is covered with paper chains.', 'It is covered with pieces of cloth.'],
          },
        },
      },
      {
        icon: '🕯️',
        titleEn: 'Lights in the Rain: Causes & Results',
        titleHe: 'אורות בגשם: סיבה ותוצאה',
        storyHookHe:
          'חנוכה מגיעה בלב החורף, כשהלילות ארוכים והגשמים מתחילים. נחזור על מילות קישור של סיבה ותוצאה (because of, due to, as a result) כדי להסביר את סיפור החג ואת מזג האוויר.',
        grammarTopic: 'Cause & Result Connectors Review (because of, due to, as a result)',
        skills: ['Cause & Effect', 'Historical Reading', 'Weather Vocabulary'],
        sentenceEn: 'Due to the heavy rain, the Hanukkah market moved into the town hall.',
        sentenceHe: 'בגלל הגשם הכבד, יריד החנוכה עבר לבניין העירייה.',
        vocab: [
          [
            'miracle',
            'noun',
            'נס',
            '✨',
            'According to tradition, a small jar of oil lasted eight days, which was a miracle.',
            'לפי המסורת, כד שמן קטן הספיק לשמונה ימים, וזה היה נס.',
          ],
          [
            'revolt',
            'noun',
            'מרד / התקוממות',
            '⚔️',
            'The Maccabees led a revolt more than two thousand years ago.',
            'המכבים הובילו מרד לפני יותר מאלפיים שנה.',
          ],
          [
            'downpour',
            'noun',
            'מטר / גשם שוטף',
            '🌧️',
            'A sudden downpour flooded the streets of Tel Aviv.',
            'גשם שוטף פתאומי הציף את רחובות תל אביב.',
          ],
          [
            'illuminate',
            'verb',
            'להאיר',
            '💡',
            'Thousands of candles illuminate the windows during Hanukkah.',
            'אלפי נרות מאירים את החלונות בחנוכה.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'disaster', translationHe: 'אסון' },
            { wordEn: 'drizzle', translationHe: 'טפטוף' },
          ],
          shortSentenceEn: 'Candles illuminate every window.',
          shortSentenceHe: 'נרות מאירים כל חלון.',
          rule: {
            questionEn: 'Choose the correct connector: "The roads were closed ____ the floods."',
            correct: 'because of',
            wrong: ['because', 'therefore'],
            explainHe:
              'the floods הוא שם עצם, ולכן because of. אחרי because בא משפט שלם, ו-therefore מציג את התוצאה ולא את הסיבה.',
            hintHe: 'מה בא אחרי החסר: משפט שלם או שם עצם? והאם החלק השני הוא הסיבה או התוצאה?',
          },
          story: {
            passageEn:
              'Hanukkah remembers the revolt of the Maccabees and the rededication of the Temple in Jerusalem. Because only one small jar of pure oil was found, there was only enough for one day. According to tradition, it burned for eight days. As a result, Jewish families light candles for eight nights and eat foods fried in oil, like doughnuts and potato pancakes.',
            passageHe:
              'חנוכה מזכירה את מרד המכבים ואת חנוכת בית המקדש בירושלים. מכיוון שנמצא רק כד קטן אחד של שמן טהור, היה בו מספיק רק ליום אחד. לפי המסורת, היא דלקה שמונה ימים. כתוצאה מכך, משפחות יהודיות מדליקות נרות שמונה לילות ואוכלות מאכלים מטוגנים בשמן, כמו סופגניות ולביבות.',
            questionEn: 'Why do families eat foods fried in oil on Hanukkah?',
            questionHe: 'למה משפחות אוכלות מאכלים מטוגנים בשמן בחנוכה?',
            correct: 'To remember the oil that burned for eight days.',
            wrong: ['Because oil is cheap in the winter.', 'To celebrate the end of the rainy season.'],
          },
        },
      },
      {
        icon: '💧',
        isBoss: true,
        titleEn: 'Boss: The Lake That Fills in Winter Unseen',
        titleHe: 'בוס: Unseen של האגם שמתמלא בחורף',
        storyHookHe:
          'משימת בוס חגיגית: קטע Unseen על הכנרת, על הגשמים ועל חגי הסתיו. עליכם לשלב סביל, סיבה ותוצאה ומילות החגים כדי לענות על שאלות ברמת בגרות!',
        grammarTopic: 'Passive Voice & Cause and Effect Synthesis',
        skills: ['Grammar Review', 'Seasonal Unseen', 'Bagrut Reading'],
        sentenceEn: 'Thanks to a rainy winter, the Sea of Galilee was filled almost to the top.',
        sentenceHe: 'בזכות חורף גשום, הכנרת התמלאה כמעט עד הסוף.',
        vocab: [
          [
            'reservoir',
            'noun',
            'מאגר מים',
            '💧',
            'The Sea of Galilee was once Israel\'s main water reservoir.',
            'הכנרת הייתה פעם מאגר המים הראשי של ישראל.',
          ],
          [
            'festive',
            'adjective',
            'חגיגי',
            '🎉',
            'The streets have a festive atmosphere before the holidays.',
            'ברחובות יש אווירה חגיגית לפני החגים.',
          ],
          [
            'gratitude',
            'noun',
            'הכרת תודה',
            '🙏',
            'Farmers expressed their gratitude for the first rain.',
            'החקלאים הביעו את הכרת התודה שלהם על הגשם הראשון.',
          ],
          [
            'abundance',
            'noun',
            'שפע',
            '🧺',
            'The market was full of an abundance of fresh fruit.',
            'השוק היה מלא בשפע של פירות טריים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'shortage', translationHe: 'מחסור' },
            { wordEn: 'desert', translationHe: 'מדבר' },
          ],
          shortSentenceEn: 'Rain fills the lake.',
          shortSentenceHe: 'הגשם ממלא את האגם.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'As a result of the rain, the lake rose by two metres.',
            wrong: [
              'As a result the rain, the lake rose by two metres.',
              'Because the rain, the lake rose by two metres.',
            ],
            explainHe:
              'לפני שם עצם (the rain) צריך ביטוי שמסתיים ב-of: as a result of. אחרי because בלבד צריך לבוא משפט שלם.',
            hintHe: 'אחרי החיבור בא שם עצם ולא משפט. איזו אפשרות מחברת את שם העצם בצורה נכונה?',
          },
          story: {
            passageEn:
              'For many years, the level of the Sea of Galilee dropped because of long dry summers. Each winter, Israelis follow the news to see how much the lake has risen. After a very rainy winter, the water reached the highest level in decades. Because desalinated water is now added to it, the lake is no longer the country\'s only reservoir.',
            passageHe:
              'במשך שנים רבות מפלס הכנרת ירד בגלל קיצים יבשים וארוכים. בכל חורף ישראלים עוקבים אחרי החדשות כדי לראות בכמה האגם עלה. אחרי חורף גשום מאוד, המים הגיעו למפלס הגבוה ביותר מזה עשרות שנים. מכיוון שכיום מוסיפים לה מים מותפלים, הכנרת כבר אינה מאגר המים היחיד של המדינה.',
            questionEn: 'Why did the level of the lake drop for many years?',
            questionHe: 'למה מפלס האגם ירד במשך שנים רבות?',
            correct: 'Because of long dry summers.',
            wrong: ['Because of too much desalinated water.', 'Because farmers stopped using it.'],
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('holidays', 1),
    titleEn: 'Spring & Summer Celebrations',
    titleHe: 'חגי האביב והקיץ',
    subtitleHe: 'ט״ו בשבט, פורים, פסח, יום העצמאות, שבועות וחופשת הקיץ: השוואה וניגוד ופסוקיות זיקה',
    badgeEmoji: '🌸',
    missions: [
      {
        icon: '🌳',
        titleEn: 'Trees & Costumes: Comparing Two Festivals',
        titleHe: 'עצים ותחפושות: השוואה בין שני חגים',
        storyHookHe:
          'ט״ו בשבט ופורים נחגגים בסוף החורף, אבל הם שונים מאוד זה מזה. נחזור על מילות השוואה וניגוד (both, whereas, unlike, similarly) כדי להשוות בין שני החגים.',
        grammarTopic: 'Comparing & Contrasting Connectors Review (both, whereas, unlike)',
        skills: ['Compare & Contrast', 'HOTS Thinking', 'Cultural Reading'],
        sentenceEn: 'Tu BiShvat is celebrated outdoors with trees, whereas Purim is celebrated with costumes and parties.',
        sentenceHe: 'את ט״ו בשבט חוגגים בחוץ עם עצים, ואילו את פורים חוגגים בתחפושות ובמסיבות.',
        vocab: [
          [
            'blossom',
            'verb',
            'לפרוח / ללבלב',
            '🌸',
            'Almond trees blossom in Israel in late winter.',
            'עצי השקד פורחים בישראל בסוף החורף.',
          ],
          [
            'sapling',
            'noun',
            'שתיל / עץ צעיר',
            '🌱',
            'Each student planted a small sapling near the school.',
            'כל תלמיד שתל שתיל קטן ליד בית הספר.',
          ],
          [
            'disguise',
            'verb',
            'להתחפש / להסוות',
            '🎭',
            'Queen Esther hid who she really was, almost like a disguise.',
            'המלכה אסתר הסתירה את זהותה האמיתית, כמעט כמו תחפושת.',
          ],
          [
            'parade',
            'noun',
            'תהלוכה / מצעד',
            '🎊',
            'Thousands of people watched the colourful parade in Holon.',
            'אלפי אנשים צפו בתהלוכה הצבעונית בחולון.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'wither', translationHe: 'לנבול' },
            { wordEn: 'uproot', translationHe: 'לעקור' },
          ],
          shortSentenceEn: 'Almond trees blossom early.',
          shortSentenceHe: 'עצי השקד פורחים מוקדם.',
          rule: {
            questionEn: 'Which connector shows a DIFFERENCE between the two festivals?',
            correct: 'Purim is noisy, whereas Tu BiShvat is calm.',
            wrong: ['Purim is noisy, and similarly Tu BiShvat is calm.', 'Purim is noisy, and likewise Tu BiShvat is calm.'],
            explainHe:
              'whereas מחבר בין שני דברים מנוגדים. similarly ו-likewise מראים דמיון, ולכן הם לא מתאימים כאן.',
            hintHe: 'שני חלקי המשפט מתארים תכונות הפוכות. איזה מחבר מראה הבדל ולא דמיון?',
          },
          story: {
            passageEn:
              'Both Tu BiShvat and Purim fall at the end of winter, but they feel very different. On Tu BiShvat, families plant saplings and eat dried fruit such as figs and dates. Purim, on the other hand, is full of noise: children disguise themselves as heroes, and people send gifts of food to friends. Unlike Tu BiShvat, Purim also includes reading the story of Queen Esther.',
            passageHe:
              'גם ט״ו בשבט וגם פורים חלים בסוף החורף, אבל ההרגשה בהם שונה מאוד. בט״ו בשבט משפחות שותלות שתילים ואוכלות פירות יבשים כמו תאנים ותמרים. פורים, לעומת זאת, מלא ברעש: ילדים מתחפשים לגיבורים, ואנשים שולחים משלוחי מנות לחברים. בשונה מט״ו בשבט, בפורים גם קוראים את סיפור המלכה אסתר.',
            questionEn: 'What do families eat on Tu BiShvat?',
            questionHe: 'מה משפחות אוכלות בט״ו בשבט?',
            correct: 'Dried fruit such as figs and dates.',
            wrong: ['Sweet pastries filled with jam.', 'Fried doughnuts and potato pancakes.'],
          },
        },
      },
      {
        icon: '🎆',
        titleEn: 'Freedom, Fireworks & First Fruits: Relative Clauses',
        titleHe: 'חירות, זיקוקים וביכורים: פסוקיות זיקה',
        storyHookHe:
          'האביב והקיץ מביאים את פסח, יום העצמאות, שבועות ואת חופשת הקיץ. נחזור על פסוקיות זיקה (who, which, that, where) כדי להוסיף מידע על חגים, אנשים ומקומות.',
        grammarTopic: 'Relative Clauses Review (who, which, that, where)',
        skills: ['Relative Clauses', 'Adding Information', 'Cultural Reading'],
        sentenceEn: 'Shavuot, which marks the wheat harvest, is famous for its cheesecakes and dairy dishes.',
        sentenceHe: 'שבועות, שמציין את קציר החיטים, מפורסם בעוגות הגבינה ובמאכלי החלב שלו.',
        vocab: [
          [
            'liberation',
            'noun',
            'שחרור / גאולה מעבדות',
            '🕊️',
            'Passover tells the story of liberation from slavery in Egypt.',
            'פסח מספר את סיפור השחרור מעבדות במצרים.',
          ],
          [
            'ceremony',
            'noun',
            'טקס',
            '🎖️',
            'The torch-lighting ceremony opens Independence Day.',
            'טקס הדלקת המשואות פותח את יום העצמאות.',
          ],
          [
            'dairy',
            'adjective',
            'חלבי / של מוצרי חלב',
            '🧀',
            'Many families prepare dairy meals on Shavuot.',
            'משפחות רבות מכינות ארוחות חלביות בשבועות.',
          ],
          [
            'leisure',
            'noun',
            'פנאי',
            '🏖️',
            'Summer vacation gives students more time for leisure.',
            'חופשת הקיץ נותנת לתלמידים יותר זמן פנאי.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'slavery', translationHe: 'עבדות' },
            { wordEn: 'routine', translationHe: 'שגרה' },
          ],
          shortSentenceEn: 'Summer brings more leisure.',
          shortSentenceHe: 'הקיץ מביא יותר פנאי.',
          rule: {
            questionEn: 'Choose the correct relative pronoun: "The Seder is the meal ____ opens the Passover holiday."',
            correct: 'which',
            wrong: ['who', 'where'],
            explainHe:
              'the meal הוא דבר, ולכן which. who מתאר אנשים, ו-where מתאר מקום.',
            hintHe: 'על מה מוסיפים מידע: על אדם, על מקום או על דבר?',
          },
          story: {
            passageEn:
              'Independence Day begins with a ceremony on Mount Herzl in Jerusalem, where twelve torches are lit. The people who light them are chosen for their special contribution to society. The next day, families who love the outdoors go to parks for picnics and barbecues. In the evening, fireworks, which can be seen from far away, light up the sky over many cities.',
            passageHe:
              'יום העצמאות נפתח בטקס בהר הרצל בירושלים, שבו מדליקים שתים-עשרה משואות. האנשים שמדליקים אותן נבחרים בזכות תרומתם המיוחדת לחברה. למחרת, משפחות שאוהבות לבלות בחוץ יוצאות לפארקים לפיקניקים ולמנגלים. בערב, זיקוקים שאפשר לראות מרחוק מאירים את השמיים מעל ערים רבות.',
            questionEn: 'Why are the torch lighters chosen?',
            questionHe: 'למה נבחרים מדליקי המשואות?',
            correct: 'For their special contribution to society.',
            wrong: ['For their success in a national quiz.', 'For organising picnics in the parks.'],
          },
        },
      },
      {
        icon: '🏖️',
        isBoss: true,
        titleEn: 'Boss: From Spring Festivals to Summer Vacation Unseen',
        titleHe: 'בוס: Unseen מחגי האביב לחופשת הקיץ',
        storyHookHe:
          'משימת בוס חגיגית: קטע Unseen על חגי האביב ועל ימי הקיץ החמים. עליכם לשלב השוואה וניגוד ופסוקיות זיקה כדי לפענח את הטקסט ולענות על שאלות ברמת בגרות!',
        grammarTopic: 'Compare & Contrast and Relative Clauses Synthesis',
        skills: ['Grammar Review', 'Seasonal Unseen', 'Bagrut Reading'],
        sentenceEn: 'Passover celebrates freedom, whereas Independence Day celebrates the birth of the modern state.',
        sentenceHe: 'פסח חוגג חירות, ואילו יום העצמאות חוגג את הולדת המדינה המודרנית.',
        vocab: [
          [
            'heritage',
            'noun',
            'מורשת',
            '🏛️',
            'Festivals help young people connect to their heritage.',
            'חגים עוזרים לצעירים להתחבר למורשת שלהם.',
          ],
          [
            'commemorate',
            'verb',
            'להנציח / לציין לזכר',
            '🕯️',
            'A monument was built to commemorate the city\'s founders.',
            'אנדרטה נבנתה כדי להנציח את מייסדי העיר.',
          ],
          [
            'unleavened',
            'adjective',
            'לא תפוח / ללא שמרים (מצה)',
            '🍞',
            'Matza is unleavened bread eaten during Passover.',
            'מצה היא לחם לא תפוח שאוכלים בפסח.',
          ],
          [
            'scorching',
            'adjective',
            'לוהט / חם מאוד',
            '☀️',
            'In August, the scorching sun keeps people indoors at noon.',
            'באוגוסט, השמש הלוהטת משאירה אנשים בבית בצהריים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'freezing', translationHe: 'קפוא' },
            { wordEn: 'forget', translationHe: 'לשכוח' },
          ],
          shortSentenceEn: 'Festivals connect us to heritage.',
          shortSentenceHe: 'חגים מחברים אותנו למורשת.',
          rule: {
            questionEn: 'Which sentence uses a non-defining relative clause correctly?',
            correct: 'Matza, which is eaten for a week, is made only of flour and water.',
            wrong: [
              'Matza, that is eaten for a week, is made only of flour and water.',
              'Matza, who is eaten for a week, is made only of flour and water.',
            ],
            explainHe:
              'בפסוקית זיקה עם פסיקים (non-defining) לא משתמשים ב-that. מצה היא דבר ולא אדם, ולכן גם who לא מתאים.',
            hintHe: 'פסוקית בין פסיקים מוסיפה מידע נוסף. איזו מילה אסורה בין פסיקים, ואיזו מתאימה רק לאנשים?',
          },
          story: {
            passageEn:
              'Spring in Israel is a season of many festivals. Passover, which lasts a week, begins with the Seder, where families read the Haggadah together. Unlike Passover, Shavuot lasts only one day, and many kibbutzim celebrate it with tractors full of fresh produce. Soon afterwards, the scorching summer arrives, and students who have finished their exams head to the beach.',
            passageHe:
              'האביב בישראל הוא עונה של חגים רבים. פסח, שנמשך שבוע, מתחיל בליל הסדר, שבו משפחות קוראות יחד את ההגדה. בשונה מפסח, שבועות נמשך רק יום אחד, וקיבוצים רבים חוגגים אותו עם טרקטורים מלאים בתוצרת טרייה. זמן קצר אחר כך מגיע הקיץ הלוהט, ותלמידים שסיימו את הבחינות שלהם יוצאים לים.',
            questionEn: 'How do many kibbutzim celebrate Shavuot?',
            questionHe: 'איך קיבוצים רבים חוגגים את שבועות?',
            correct: 'With tractors full of fresh produce.',
            wrong: ['With a week of reading the Haggadah.', 'With fireworks over the beach.'],
          },
        },
      },
    ],
  },
];

/** The holidays pack's grade 11 units: autumn–winter, then spring–summer festivals. */
export const HOLIDAYS_GRADE_11_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildHighSchoolGrade('grade-11', UNITS);
