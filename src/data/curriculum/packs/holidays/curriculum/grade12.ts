import { buildHighSchoolGrade, type HighSchoolUnitSpec } from '../../../highSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

const UNITS: HighSchoolUnitSpec[] = [
  {
    ...packUnitNumbers('holidays', 0),
    titleEn: 'Autumn & Winter: Renewal and Light',
    titleHe: 'סתיו וחורף: התחדשות ואור',
    subtitleHe: 'ראש השנה, סוכות, חנוכה וגשמי החורף: מילות קישור אקדמיות וויתור (although / despite)',
    badgeEmoji: '🌧️',
    missions: [
      {
        icon: '🍎',
        titleEn: 'A Fresh Start: Adding & Contrasting Ideas',
        titleHe: 'התחלה חדשה: להוסיף ולהנגיד רעיונות',
        storyHookHe:
          'ראש השנה וסוכות הם זמן של התחדשות, החלטות ואירוח. נחזור על מילות קישור אקדמיות להוספה (Furthermore, Moreover) ולניגוד (However, In contrast) כדי לכתוב על החגים כמו בחיבור בגרות.',
        grammarTopic: 'Academic Connectors Review: Addition & Contrast',
        skills: ['Academic Connectors', 'Cultural Writing', 'Band III Vocabulary'],
        sentenceEn: 'Rosh Hashana is a time for celebration; moreover, it invites personal reflection and renewal.',
        sentenceHe: 'ראש השנה הוא זמן של חגיגה; יתרה מזאת, הוא מזמין חשבון נפש אישי והתחדשות.',
        vocab: [
          [
            'renewal',
            'noun',
            'התחדשות',
            '🌱',
            'Autumn brings a feeling of renewal after the long summer.',
            'הסתיו מביא תחושה של התחדשות אחרי הקיץ הארוך.',
          ],
          [
            'resolution',
            'noun',
            'החלטה / התחייבות אישית',
            '📝',
            'My resolution for the new year is to read more books.',
            'ההחלטה שלי לשנה החדשה היא לקרוא יותר ספרים.',
          ],
          [
            'hospitality',
            'noun',
            'הכנסת אורחים / אירוח',
            '🤗',
            'The family is famous for its warm hospitality during Sukkot.',
            'המשפחה מפורסמת בהכנסת האורחים החמה שלה בסוכות.',
          ],
          [
            'canopy',
            'noun',
            'סכך / חופה / גג של ענפים',
            '🌴',
            'Through the leafy canopy of the sukkah, we could see the stars.',
            'מבעד לסכך העלים של הסוכה יכולנו לראות את הכוכבים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'stagnation', translationHe: 'קיפאון' },
            { wordEn: 'decline', translationHe: 'ירידה / שקיעה' },
          ],
          shortSentenceEn: 'The new year brings renewal.',
          shortSentenceHe: 'השנה החדשה מביאה התחדשות.',
          rule: {
            questionEn: 'Choose the correct connector: "Sukkot celebrates the harvest. ____, it remembers the journey in the desert."',
            correct: 'Furthermore',
            wrong: ['However', 'In contrast'],
            explainHe:
              'המשפט השני מוסיף עוד משמעות לחג באותו כיוון, ולכן Furthermore. However ו-In contrast מציגים ניגוד.',
            hintHe: 'האם המשפט השני מוסיף רעיון דומה או מציג רעיון הפוך?',
          },
          story: {
            passageEn:
              'For many Israelis, the autumn holidays mark a new beginning. On Rosh Hashana, people make personal resolutions and wish each other a good year. Furthermore, Sukkot offers a chance to practise hospitality, as friends and neighbours are invited to eat in the sukkah. However, the busy holiday season can also be tiring, since schools and offices are closed for many days.',
            passageHe:
              'עבור ישראלים רבים, חגי הסתיו מסמנים התחלה חדשה. בראש השנה אנשים מקבלים החלטות אישיות ומאחלים זה לזה שנה טובה. יתרה מזאת, סוכות מזמן הזדמנות להכנסת אורחים, כשחברים ושכנים מוזמנים לאכול בסוכה. אולם עונת החגים העמוסה יכולה להיות גם מעייפת, מכיוון שבתי ספר ומשרדים סגורים ימים רבים.',
            questionEn: 'Why can the holiday season also be tiring?',
            questionHe: 'למה עונת החגים יכולה להיות גם מעייפת?',
            correct: 'Schools and offices are closed for many days.',
            wrong: ['Too many guests are invited to the sukkah.', 'People make too many personal resolutions.'],
          },
        },
      },
      {
        icon: '🕯️',
        titleEn: 'Light Despite the Dark: Concession',
        titleHe: 'אור למרות החושך: ויתור (Concession)',
        storyHookHe:
          'חנוכה מדליקה אור דווקא בימים הקצרים והחשוכים של השנה. נחזור על מבני ויתור: although + משפט שלם, despite / in spite of + שם עצם, כדי לתאר ניגוד מפתיע.',
        grammarTopic: 'Concession Review: although vs. despite',
        skills: ['Concession Clauses', 'Argument Structure', 'Weather Vocabulary'],
        sentenceEn: 'Despite the cold and the rain, thousands of families gathered to kindle the Hanukkah lights.',
        sentenceHe: 'למרות הקור והגשם, אלפי משפחות התאספו להדליק את נרות החנוכה.',
        vocab: [
          [
            'kindle',
            'verb',
            'להדליק / להצית',
            '🔥',
            'Each evening, one more candle is used to kindle the menorah.',
            'בכל ערב משתמשים בעוד נר אחד כדי להדליק את החנוכייה.',
          ],
          [
            'perseverance',
            'noun',
            'התמדה / עקשנות חיובית',
            '💪',
            'The Maccabees\' story is often told as a story of perseverance.',
            'סיפור המכבים מסופר לעתים קרובות כסיפור של התמדה.',
          ],
          [
            'precipitation',
            'noun',
            'משקעים (גשם, שלג, ברד)',
            '🌧️',
            'The north of Israel receives more precipitation than the south.',
            'צפון ישראל מקבל יותר משקעים מהדרום.',
          ],
          [
            'overcast',
            'adjective',
            'מעונן (כולו)',
            '☁️',
            'The sky stayed overcast for the whole week of Hanukkah.',
            'השמיים נשארו מעוננים כל שבוע החנוכה.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'extinguish', translationHe: 'לכבות' },
            { wordEn: 'abandon', translationHe: 'לנטוש' },
          ],
          shortSentenceEn: 'We kindle one more candle.',
          shortSentenceHe: 'אנחנו מדליקים עוד נר אחד.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'Despite the heavy rain, the Hanukkah parade went ahead.',
            wrong: [
              'Despite it rained heavily, the Hanukkah parade went ahead.',
              'Although the heavy rain, the Hanukkah parade went ahead.',
            ],
            explainHe:
              'despite בא לפני שם עצם (the heavy rain), ו-although בא לפני משפט שלם עם נושא ופועל (it rained).',
            hintHe: 'בדקו מה בא אחרי מילת הוויתור בכל משפט: שם עצם או משפט שלם עם נושא ופועל?',
          },
          story: {
            passageEn:
              'Hanukkah falls in the darkest weeks of the year, when the nights are long and the sky is often overcast. Although the weather is cold, many families light their menorahs in windows facing the street. In this way, the light can be seen by everyone who passes by. Despite the rain, some cities also hold public candle-lighting ceremonies in their main squares.',
            passageHe:
              'חנוכה חלה בשבועות החשוכים ביותר בשנה, כשהלילות ארוכים והשמיים מעוננים לעתים קרובות. למרות שמזג האוויר קר, משפחות רבות מדליקות את החנוכיות שלהן בחלונות הפונים לרחוב. כך האור נראה לכל מי שעובר בדרך. למרות הגשם, יש ערים שעורכות גם טקסי הדלקת נרות ציבוריים בכיכרות המרכזיות שלהן.',
            questionEn: 'Why do many families light their menorahs in windows facing the street?',
            questionHe: 'למה משפחות רבות מדליקות את החנוכיות בחלונות הפונים לרחוב?',
            correct: 'So the light can be seen by everyone who passes by.',
            wrong: ['So the candles stay dry in the rain.', 'So the house stays warm at night.'],
          },
        },
      },
      {
        icon: '🤝',
        isBoss: true,
        titleEn: 'Boss: Community in the Cold Season Unseen',
        titleHe: 'בוס: Unseen על קהילה בעונה הקרה',
        storyHookHe:
          'משימת בוס חגיגית: קטע Unseen על מנהגים קהילתיים בחגי הסתיו ובחורף. עליכם לשלב מילות הוספה, ניגוד וויתור ולזהות את עמדת הכותב, ברמת בגרות!',
        grammarTopic: 'Academic Connectors & Concession Synthesis',
        skills: ['Discourse Markers Review', 'Seasonal Unseen', 'Bagrut Reading'],
        sentenceEn: 'Although winter can be lonely, holiday traditions bring communities together.',
        sentenceHe: 'למרות שהחורף יכול להיות בודד, מסורות החגים מקרבות קהילות זו לזו.',
        vocab: [
          [
            'communal',
            'adjective',
            'קהילתי / משותף',
            '👥',
            'The kibbutz holds a communal meal on every holiday.',
            'הקיבוץ עורך ארוחה משותפת בכל חג.',
          ],
          [
            'customary',
            'adjective',
            'מקובל / נהוג',
            '📜',
            'It is customary to eat sweet foods on the new year.',
            'נהוג לאכול מאכלים מתוקים בשנה החדשה.',
          ],
          [
            'replenish',
            'verb',
            'למלא מחדש / לחדש מלאי',
            '💧',
            'Winter rains replenish the underground water supply.',
            'גשמי החורף ממלאים מחדש את מי התהום.',
          ],
          [
            'solidarity',
            'noun',
            'סולידריות / ערבות הדדית',
            '🤝',
            'Neighbours showed solidarity by sharing food after the storm.',
            'השכנים הפגינו ערבות הדדית כשחלקו אוכל אחרי הסערה.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'isolation', translationHe: 'בידוד' },
            { wordEn: 'rivalry', translationHe: 'יריבות' },
          ],
          shortSentenceEn: 'Rain replenishes the land.',
          shortSentenceHe: 'הגשם ממלא מחדש את האדמה.',
          rule: {
            questionEn: 'Which connector best completes the sentence? "Many people travel abroad during the holidays. ____, others prefer to stay with family."',
            correct: 'In contrast',
            wrong: ['Moreover', 'Consequently'],
            explainHe:
              'המשפט השני מציג התנהגות הפוכה לזו שבמשפט הראשון, ולכן In contrast. Moreover מוסיף, ו-Consequently מציג תוצאה.',
            hintHe: 'האם הקבוצה השנייה עושה אותו דבר, דבר הפוך, או משהו שנובע מהמשפט הראשון?',
          },
          story: {
            passageEn:
              'In many Israeli neighbourhoods, the holiday season is a time of communal activity. During Sukkot, residents sometimes build one large sukkah in a shared courtyard. Moreover, in winter, volunteers collect warm clothes and food for families in need. Although these projects take time and effort, the writer believes that they strengthen solidarity and make the cold season warmer for everyone.',
            passageHe:
              'בשכונות רבות בישראל, עונת החגים היא זמן של פעילות קהילתית. בסוכות התושבים בונים לפעמים סוכה גדולה אחת בחצר משותפת. יתרה מזאת, בחורף מתנדבים אוספים בגדים חמים ומזון למשפחות נזקקות. למרות שהפרויקטים האלה דורשים זמן ומאמץ, הכותב מאמין שהם מחזקים את הערבות ההדדית והופכים את העונה הקרה לחמה יותר עבור כולם.',
            questionEn: 'What is the writer\'s opinion of these community projects?',
            questionHe: 'מה דעתו של הכותב על הפרויקטים הקהילתיים האלה?',
            correct: 'They strengthen solidarity and make the cold season warmer.',
            wrong: ['They take too much time and should be stopped.', 'They are only useful during Sukkot.'],
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('holidays', 1),
    titleEn: 'Spring & Summer: Freedom and Growth',
    titleHe: 'אביב וקיץ: חירות וצמיחה',
    subtitleHe: 'ט״ו בשבט, פורים, פסח, יום העצמאות, שבועות וחופשת הקיץ: מודלים בעבר ומילות תוצאה',
    badgeEmoji: '🌸',
    missions: [
      {
        icon: '🌱',
        titleEn: 'Forests & Masks: Past Modals',
        titleHe: 'יערות ומסכות: מודלים בעבר',
        storyHookHe:
          'מי שתל את היערות הראשונים? ומי כתב את המחזות הסאטיריים של פורים? נחזור על מודלים בעבר (must have, might have, should have + V3) כדי להסיק מסקנות ולהביע ביקורת על העבר.',
        grammarTopic: 'Past Modals Review: must have, might have, should have + V3',
        skills: ['Past Modals', 'Deduction', 'Cultural Reading'],
        sentenceEn: 'The early planters must have worked very hard to turn bare hills into forests.',
        sentenceHe: 'השותלים הראשונים בוודאי עבדו קשה מאוד כדי להפוך גבעות חשופות ליערות.',
        vocab: [
          [
            'reforestation',
            'noun',
            'ייעור מחדש',
            '🌲',
            'Reforestation helps prevent soil from washing away.',
            'ייעור מחדש עוזר למנוע מהאדמה להיסחף.',
          ],
          [
            'satire',
            'noun',
            'סאטירה',
            '🎭',
            'The Purim show was a clever satire of school life.',
            'הצגת פורים הייתה סאטירה שנונה על חיי בית הספר.',
          ],
          [
            'anonymous',
            'adjective',
            'אנונימי / בעילום שם',
            '🕵️',
            'An anonymous donor paid for the new playground.',
            'תורם אנונימי שילם על מגרש המשחקים החדש.',
          ],
          [
            'merriment',
            'noun',
            'עליזות / שמחה רועשת',
            '🥳',
            'The streets were full of music and merriment on Purim.',
            'הרחובות היו מלאים מוזיקה ועליזות בפורים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'deforestation', translationHe: 'בירוא יערות' },
            { wordEn: 'erosion', translationHe: 'סחף / בליה' },
          ],
          shortSentenceEn: 'Someone must have planted these.',
          shortSentenceHe: 'מישהו בוודאי שתל את אלה.',
          rule: {
            questionEn: 'Which sentence expresses CRITICISM of a past action?',
            correct: 'The organisers should have prepared more costumes for the children.',
            wrong: [
              'The organisers must have prepared more costumes for the children.',
              'The organisers might have prepared more costumes for the children.',
            ],
            explainHe:
              'should have + V3 מבקר משהו שלא נעשה בעבר. must have מביע הסקה ודאית, ו-might have מביע אפשרות.',
            hintHe: 'שלושת המשפטים בנויים אותו דבר. איזה מודל מראה שמשהו היה צריך לקרות ולא קרה?',
          },
          story: {
            passageEn:
              'At the beginning of the twentieth century, many hills in the Land of Israel were almost bare. Early reforestation projects planted millions of pine trees, and Tu BiShvat became a day of planting. The planters must have hoped that the trees would protect the soil. Today, however, experts think that they should have planted more local species, which survive fires and droughts better.',
            passageHe:
              'בתחילת המאה העשרים, גבעות רבות בארץ ישראל היו כמעט חשופות. מיזמי ייעור מוקדמים שתלו מיליוני עצי אורן, וט״ו בשבט הפך ליום של שתילה. השותלים בוודאי קיוו שהעצים יגנו על האדמה. אולם היום מומחים חושבים שהיה עליהם לשתול יותר מינים מקומיים, ששורדים טוב יותר שריפות ובצורות.',
            questionEn: 'What do experts think the planters should have done?',
            questionHe: 'מה לדעת המומחים השותלים היו צריכים לעשות?',
            correct: 'They should have planted more local species.',
            wrong: ['They should have planted only pine trees.', 'They should have stopped planting on Tu BiShvat.'],
          },
        },
      },
      {
        icon: '🎆',
        titleEn: 'From Freedom to First Fruits: Results & Consequences',
        titleHe: 'מחירות לביכורים: תוצאות והשלכות',
        storyHookHe:
          'פסח, יום העצמאות ושבועות מספרים סיפור של חירות, בנייה וקציר, ואחריהם מגיעה חופשת הקיץ. נחזור על מילות תוצאה (Consequently, Therefore, As a result) ועל הפיסוק הנכון שלהן.',
        grammarTopic: 'Result Connectors Review: Consequently & Therefore',
        skills: ['Result Connectors', 'Punctuation', 'Cultural Reading'],
        sentenceEn: 'The pioneers drained swamps and planted fields; consequently, new villages could grow.',
        sentenceHe: 'החלוצים ייבשו ביצות ושתלו שדות; כתוצאה מכך, יכלו לצמוח כפרים חדשים.',
        vocab: [
          [
            'emancipation',
            'noun',
            'שחרור / יציאה לחופשי',
            '🕊️',
            'The Passover Seder retells the emancipation of slaves.',
            'ליל הסדר מספר מחדש את שחרור העבדים.',
          ],
          [
            'pioneer',
            'noun',
            'חלוץ / חלוצה',
            '🧑‍🌾',
            'The first pioneers lived in tents near the fields.',
            'החלוצים הראשונים גרו באוהלים ליד השדות.',
          ],
          [
            'agricultural',
            'adjective',
            'חקלאי',
            '🌾',
            'Shavuot has deep agricultural roots in the wheat harvest.',
            'לשבועות יש שורשים חקלאיים עמוקים בקציר החיטים.',
          ],
          [
            'itinerary',
            'noun',
            'מסלול טיול / תוכנית נסיעה',
            '🗺️',
            'Our summer itinerary includes three days in the Golan.',
            'מסלול הקיץ שלנו כולל שלושה ימים ברמת הגולן.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'oppression', translationHe: 'דיכוי' },
            { wordEn: 'industrial', translationHe: 'תעשייתי' },
          ],
          shortSentenceEn: 'We planned our summer itinerary.',
          shortSentenceHe: 'תכננו את מסלול הקיץ שלנו.',
          rule: {
            questionEn: 'Which sentence is punctuated correctly?',
            correct: 'Exams ended in June; therefore, the students left for the Galilee.',
            wrong: [
              'Exams ended in June, therefore the students left for the Galilee.',
              'Exams ended in June therefore, the students left for the Galilee.',
            ],
            explainHe:
              'כש-therefore מחבר שני משפטים שלמים, לפניו באה נקודה-פסיק (;) ואחריו פסיק.',
            hintHe: 'שני משפטים שלמים לא מתחברים בפסיק בלבד. בדקו את הסימן לפני מילת התוצאה ואת הסימן אחריה.',
          },
          story: {
            passageEn:
              'Shavuot began as an agricultural festival, when farmers brought the first fruits of their harvest to Jerusalem. In the twentieth century, the pioneers of the kibbutzim gave the festival new life. They celebrated the harvest with songs, dances and wagons full of produce. Consequently, Shavuot is still celebrated on many kibbutzim with colourful harvest parades.',
            passageHe:
              'שבועות התחיל כחג חקלאי, שבו החקלאים הביאו לירושלים את הפירות הראשונים של הקציר שלהם. במאה העשרים, החלוצים של הקיבוצים העניקו לחג חיים חדשים. הם חגגו את הקציר בשירים, בריקודים ובעגלות מלאות תוצרת. כתוצאה מכך, שבועות עדיין נחגג בקיבוצים רבים עם תהלוכות ביכורים צבעוניות.',
            questionEn: 'How did the kibbutz pioneers celebrate the harvest?',
            questionHe: 'איך חגגו חלוצי הקיבוצים את הקציר?',
            correct: 'With songs, dances and wagons full of produce.',
            wrong: ['With a long trip to Jerusalem by train.', 'With a quiet meal at home.'],
          },
        },
      },
      {
        icon: '☀️',
        isBoss: true,
        titleEn: 'Boss: Milestones of the Year Unseen',
        titleHe: 'בוס: Unseen של אבני הדרך של השנה',
        storyHookHe:
          'משימת בוס חגיגית בסוף שנת התיכון: קטע Unseen על חגי האביב ועל הקיץ שבא אחריהם. עליכם לשלב מודלים בעבר, מילות תוצאה וויתור ולענות על שאלות ברמת בגרות!',
        grammarTopic: 'Past Modals & Result Connectors Synthesis',
        skills: ['Grammar Review', 'Seasonal Unseen', 'Bagrut Reading'],
        sentenceEn: 'In retrospect, the graduates realised that every holiday had marked a milestone in their lives.',
        sentenceHe: 'במבט לאחור, הבוגרים הבינו שכל חג סימן אבן דרך בחייהם.',
        vocab: [
          [
            'milestone',
            'noun',
            'אבן דרך / ציון דרך',
            '🏁',
            'Finishing the Bagrut is an important milestone.',
            'סיום הבגרות הוא אבן דרך חשובה.',
          ],
          [
            'retrospect',
            'noun',
            'מבט לאחור (in retrospect)',
            '⏪',
            'In retrospect, the trip was the best part of the year.',
            'במבט לאחור, הטיול היה החלק הכי טוב בשנה.',
          ],
          [
            'diverse',
            'adjective',
            'מגוון / רב-גוני',
            '🌈',
            'Israel\'s diverse population celebrates many different holidays.',
            'האוכלוסייה המגוונת של ישראל חוגגת חגים רבים ושונים.',
          ],
          [
            'rejuvenate',
            'verb',
            'להצעיר / לרענן / להחיות מחדש',
            '🌊',
            'A week by the sea can rejuvenate tired students.',
            'שבוע ליד הים יכול לרענן תלמידים עייפים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'setback', translationHe: 'נסיגה / מכשול' },
            { wordEn: 'routine', translationHe: 'שגרה' },
          ],
          shortSentenceEn: 'Graduation is a big milestone.',
          shortSentenceHe: 'סיום הלימודים הוא אבן דרך גדולה.',
          rule: {
            questionEn: 'Which sentence expresses a confident deduction about the past?',
            correct: 'The beach is full of sand castles, so many children must have played here.',
            wrong: [
              'The beach is full of sand castles, so many children should have played here.',
              'The beach is full of sand castles, so many children must play here.',
            ],
            explainHe:
              'must have + V3 מביע מסקנה בטוחה על העבר על סמך ראיה (ארמונות החול). should have מבקר, ו-must play מדבר על ההווה.',
            hintHe: 'הראיה נמצאת מולנו, והמסקנה היא על מה שכבר קרה. איזה מבנה מתאים להסקה בטוחה על העבר?',
          },
          story: {
            passageEn:
              'For Israeli twelfth-graders, spring is a season of milestones. The diverse holidays of Purim, Passover, Independence Day and Shavuot follow one another quickly, while final exams approach. Although the weeks are stressful, many students say the holidays give them short breaks to rest. When the exams end in June, many graduates travel together to rejuvenate before the army, national service or work.',
            passageHe:
              'עבור תלמידי כיתות י״ב בישראל, האביב הוא עונה של אבני דרך. החגים המגוונים פורים, פסח, יום העצמאות ושבועות באים זה אחר זה במהירות, בזמן שבחינות הגמר מתקרבות. למרות שהשבועות האלה מלחיצים, תלמידים רבים אומרים שהחגים נותנים להם הפסקות קצרות למנוחה. כשהבחינות מסתיימות ביוני, בוגרים רבים יוצאים יחד לטיול כדי להתרענן לפני הצבא, השירות הלאומי או העבודה.',
            questionEn: 'What do many students say the holidays give them?',
            questionHe: 'מה תלמידים רבים אומרים שהחגים נותנים להם?',
            correct: 'Short breaks to rest.',
            wrong: ['Extra time to study for exams.', 'A chance to travel abroad.'],
          },
        },
      },
    ],
  },
];

/** The holidays pack's grade 12 units: autumn–winter, then spring–summer festivals. */
export const HOLIDAYS_GRADE_12_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildHighSchoolGrade('grade-12', UNITS);
