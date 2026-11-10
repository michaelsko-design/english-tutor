import { buildHighSchoolGrade, type HighSchoolUnitSpec } from '../../../highSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

const UNIT_HOLIDAYS_AUTUMN: HighSchoolUnitSpec = {
  ...packUnitNumbers('holidays-autumn'),
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
            'For many Israelis, the autumn holidays mark a new beginning. On Rosh Hashana, people make personal resolutions and wish each other a good year. Furthermore, Sukkot offers a chance to practice hospitality, as friends and neighbors are invited to eat in the sukkah. However, the busy holiday season can also be tiring, since schools and offices are closed for many days.',
          passageHe:
            'עבור ישראלים רבים, חגי הסתיו מסמנים התחלה חדשה. בראש השנה אנשים מקבלים החלטות אישיות ומאחלים זה לזה שנה טובה. יתרה מזאת, סוכות מזמן הזדמנות להכנסת אורחים, כשחברים ושכנים מוזמנים לאכול בסוכה. אולם עונת החגים העמוסה יכולה להיות גם מעייפת, מכיוון שבתי ספר ומשרדים סגורים ימים רבים.',
          questionEn: 'Why can the holiday season also be tiring?',
          questionHe: 'למה עונת החגים יכולה להיות גם מעייפת?',
          correct: 'Schools and offices are closed for many days.',
          wrong: ['Too many guests are invited to the sukkah.', 'People make too many personal resolutions.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which word adds an idea? We cooked for guests. ____ we decorated the sukkah.',
              correct: 'Moreover, we decorated the sukkah.',
              wrong: ['However, we decorated the sukkah.'],
              explainHe: 'Moreover מוסיף עוד פעולה באותו כיוון, ו-However מציג ניגוד.',
              hintHe: 'האם הפעולה השנייה מוסיפה או מנוגדת לראשונה?',
            },
            story: {
              passageEn: 
                'Rosh Hashana is a new year. Families eat apples with honey. They hope for a sweet year.',
              passageHe: 'ראש השנה הוא שנה חדשה. משפחות אוכלות תפוחים בדבש. הן מקוות לשנה מתוקה.',
              questionEn: 'What do families eat?',
              questionHe: 'מה משפחות אוכלות?',
              correct: 'Apples with honey.',
              wrong: ['Cold ice cream.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['revenue', 'pollution'],
              ['complaint', 'umbrella'],
              ['bureaucracy', 'arrogance'],
              ['foundation', 'corridor'],
            ],
          },
          master: {
            sentenceEn: 
              'Autumn holidays encourage reflection and furthermore they bring relatives together around one large table.',
            sentenceHe: 
              'חגי הסתיו מעודדים התבוננות פנימית, ויתרה מזאת הם מכנסים בני משפחה סביב שולחן גדול אחד.',
            decoys: ['however', 'nevertheless'],
            voiceEn: 'Every new year brings fresh hope.',
            voiceHe: 'כל שנה חדשה מביאה תקווה חדשה.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'Sukkot is joyful; moreover, it teaches us to welcome strangers.',
              wrong: [
                'Sukkot is joyful, moreover, it teaches us to welcome strangers.',
                'Sukkot is joyful; however, it teaches us to welcome strangers.',
                'Sukkot is joyful; moreover, it teach us to welcome strangers.',
              ],
              explainHe: 
                'בין שני משפטים שלמים לפני moreover באה נקודה-פסיק. moreover מוסיף רעיון ו-however מנגיד. והנושא it דורש teaches.',
              hintEn: 'Check the punctuation, the linking word and the verb.',
            },
            story: {
              passageEn: 
                'Each year, the family of Hila invites a different guest to the sukkah. Last year the guest was an elderly neighbor who had recently moved to the city and knew nobody. The neighbor arrived with a plastic bag of dates and sat quietly at the end of the table. By the end of the evening, he was telling stories about his village and teaching the children a song, and the following week he brought them a handmade lamp.',
              passageHe: '',
              questionEn: 'What can be inferred about the neighbor?',
              questionHe: '',
              correct: 'He felt welcomed and wanted to show his gratitude.',
              wrong: [
                'He disliked the food and left early.',
                'He was already friends with everyone.',
                'He forgot the way to the sukkah.',
              ],
            },
            storyHintEn: 'Think about why he brought a gift.',
          },
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'Despite the cold, we lit the candles.',
              wrong: ['Although the cold, we lit the candles.'],
              explainHe: 'although בא לפני משפט שלם, ו-despite בא לפני שם עצם (the cold).',
              hintHe: 'מה בא אחרי מילת הוויתור: שם עצם או משפט?',
            },
            story: {
              passageEn: 'It is cold in winter. Tali lights a candle. The room feels warm.',
              passageHe: 'קר בחורף. טלי מדליקה נר. בחדר נהיה חם.',
              questionEn: 'What does Tali light?',
              questionHe: 'מה טלי מדליקה?',
              correct: 'A candle.',
              wrong: ['A big fire outside.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['extinguish', 'polish'],
              ['furniture', 'luggage'],
              ['inflation', 'vocabulary'],
              ['fertile', 'crowded'],
            ],
          },
          master: {
            sentenceEn: 
              'Although the evenings were dark and rainy the children gathered happily to sing Hanukkah songs.',
            sentenceHe: 'למרות שהערבים היו חשוכים וגשומים הילדים התאספו בשמחה כדי לשיר שירי חנוכה.',
            decoys: ['despite', 'because'],
            voiceEn: 'The menorah glowed in the window.',
            voiceHe: 'החנוכייה זהרה בחלון.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'Despite the heavy rain, the ceremony took place as planned.',
              wrong: [
                'Despite it rained heavily, the ceremony took place as planned.',
                'Although the heavy rain, the ceremony took place as planned.',
                'Despite the heavy rain, but the ceremony took place as planned.',
              ],
              explainHe: 
                'אחרי despite בא שם עצם (the heavy rain), ואחרי although בא משפט שלם. בנוסף, אין להוסיף but אחרי ביטוי הוויתור.',
              hintEn: 'Check what follows the linking word and avoid extra words.',
            },
            story: {
              passageEn: 
                'The old man at number seven had not lit Hanukkah candles for years, since his wife passed away. This year, however, a girl from the third floor knocked on his door with a small menorah and a box of matches. She did not say anything about candles; she simply asked if she could use his window, because it faced the street. He hesitated, then opened the curtains. Neighbors who walked by that evening stopped to look at the two small flames.',
              passageHe: '',
              questionEn: 'Why did the girl visit the old man?',
              questionHe: '',
              correct: 'She wanted him to light candles again.',
              wrong: [
                'She wanted to borrow his matches for her home.',
                'She wanted to sell him a new menorah.',
                'She was afraid of walking in the rain.',
              ],
            },
            storyHintEn: 'What did the girl bring with her?',
          },
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
          'Neighbors showed solidarity by sharing food after the storm.',
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
            'In many Israeli neighborhoods, the holiday season is a time of communal activity. During Sukkot, residents sometimes build one large sukkah in a shared courtyard. Moreover, in winter, volunteers collect warm clothes and food for families in need. Although these projects take time and effort, the writer believes that they strengthen solidarity and make the cold season warmer for everyone.',
          passageHe:
            'בשכונות רבות בישראל, עונת החגים היא זמן של פעילות קהילתית. בסוכות התושבים בונים לפעמים סוכה גדולה אחת בחצר משותפת. יתרה מזאת, בחורף מתנדבים אוספים בגדים חמים ומזון למשפחות נזקקות. למרות שהפרויקטים האלה דורשים זמן ומאמץ, הכותב מאמין שהם מחזקים את הערבות ההדדית והופכים את העונה הקרה לחמה יותר עבור כולם.',
          questionEn: 'What is the writer\'s opinion of these community projects?',
          questionHe: 'מה דעתו של הכותב על הפרויקטים הקהילתיים האלה?',
          correct: 'They strengthen solidarity and make the cold season warmer.',
          wrong: ['They take too much time and should be stopped.', 'They are only useful during Sukkot.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence shows a contrast?',
              correct: 'Some stay home; in contrast, others travel.',
              wrong: ['Some stay home; moreover, others travel.'],
              explainHe: 'In contrast מציג ניגוד בין שתי קבוצות, ו-moreover רק מוסיף רעיון באותו כיוון.',
              hintHe: 'שתי הקבוצות עושות דברים הפוכים.',
            },
            story: {
              passageEn: 
                'The neighbors cooked a big meal. Everyone brought one dish. They ate together in the yard.',
              passageHe: 'השכנים בישלו ארוחה גדולה. כל אחד הביא מנה אחת. הם אכלו יחד בחצר.',
              questionEn: 'Where did they eat?',
              questionHe: 'איפה הם אכלו?',
              correct: 'In the yard.',
              wrong: ['In a school.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['solitary', 'digital'],
              ['spacious', 'generous'],
              ['imitate', 'weigh'],
              ['rivalry', 'hostility'],
            ],
          },
          master: {
            sentenceEn: 
              'Although volunteering requires time many residents join community projects because they value solidarity.',
            sentenceHe: 
              'למרות שהתנדבות דורשת זמן תושבים רבים מצטרפים לפרויקטים קהילתיים כי הם מעריכים סולידריות.',
            decoys: ['despite', 'therefore'],
            voiceEn: 'Customs bring neighbors closer together every winter.',
            voiceHe: 'מנהגים מקרבים שכנים זה לזה בכל חורף.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'Many families travel; in contrast, others prefer a quiet holiday at home.',
              wrong: [
                'Many families travel in contrast, others prefer a quiet holiday at home.',
                'Many families travel; in contrast, other prefers a quiet holiday at home.',
                'Many families travel; moreover, others prefer a quiet holiday at home.',
              ],
              explainHe: 
                'לפני in contrast בין שני משפטים שלמים באה נקודה-פסיק; others דורש prefer בלי s, ו-moreover אינו מתאים כי הרעיון השני הפוך.',
              hintEn: 'Check the punctuation, the verb and the meaning of the connector.',
            },
            story: {
              passageEn: 
                'When the heavy storm of December flooded the lower streets of the neighborhood, the community center opened its doors at midnight. Volunteers arrived with blankets, soup and two large heaters, though nobody had organized them. By morning more than forty residents had slept on the floor of the main hall, and a teenager was already collecting names to arrange temporary housing. The mayor later said that the building had been designed for lectures, not for emergencies, yet that night it became the heart of the city.',
              passageHe: '',
              questionEn: 'What does the mayor suggest about the community center?',
              questionHe: '',
              correct: 'It served a purpose far beyond its original design.',
              wrong: [
                'It should have been closed before the storm.',
                'It was built mainly to host emergencies.',
                'It stayed empty throughout the night.',
              ],
            },
            storyHintEn: 'Compare the design of the building with what happened.',
          },
        },
      },
    },
  ],
};

const UNIT_HOLIDAYS_SPRING: HighSchoolUnitSpec = {
  ...packUnitNumbers('holidays-spring'),
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
          correct: 'The organizers should have prepared more costumes for the children.',
          wrong: [
            'The organizers must have prepared more costumes for the children.',
            'The organizers might have prepared more costumes for the children.',
          ],
          explainHe:
            'should have + V3 מבקר משהו שלא נעשה בעבר. must have מביע הסקה ודאית, ו-might have מביע אפשרות.',
          hintHe: 'שלושת המשפטים בנויים אותו דבר. איזה מודל מראה שמשהו היה צריך לקרות ולא קרה?',
        },
        story: {
          passageEn:
            'At the beginning of the twentieth century, many hills in the Land of Israel were almost bare. Early reforestation projects planted millions of pine trees, and Tu BiShvat became a day of planting. The planters must have hoped that the trees would protect the soil. Today, however, experts think that they should have planted more local species, which survive fires and droughts better.',
          passageHe:
            'בתחילת המאה העשרים, גבעות רבות בארץ ישראל היו כמעט חשופות. מיזמי ייעור מוקדמים נטעו מיליוני עצי אורן, וט״ו בשבט הפך ליום של נטיעות. הנוטעים בוודאי קיוו שהעצים יגנו על האדמה. אולם היום מומחים חושבים שהיה עליהם לנטוע יותר מינים מקומיים, ששורדים טוב יותר שריפות ובצורות.',
          questionEn: 'What do experts think the planters should have done?',
          questionHe: 'מה לדעת המומחים הנוטעים היו צריכים לעשות?',
          correct: 'They should have planted more local species.',
          wrong: ['They should have planted only pine trees.', 'They should have stopped planting on Tu BiShvat.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'He should have brought a coat.',
              wrong: ['He should brought a coat.'],
              explainHe: 'אחרי should בעבר בא have + V3: should have brought.',
              hintHe: 'חסרה מילה אחת בין should לבין brought.',
            },
            story: {
              passageEn: 
                'There was a cake on the table this morning. Now it is gone. Dan has chocolate on his face.',
              passageHe: 'הבוקר הייתה עוגה על השולחן. עכשיו היא נעלמה. לדן יש שוקולד על הפנים.',
              questionEn: 'Who has chocolate on his face?',
              questionHe: 'למי יש שוקולד על הפנים?',
              correct: 'Dan.',
              wrong: ['The cat.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['deforestation', 'urbanization'],
              ['mortgage', 'vacancy'],
              ['ancient', 'obsolete'],
              ['luggage', 'gravel'],
            ],
          },
          master: {
            sentenceEn: 'The early settlers must have felt exhausted after planting thousands of trees.',
            sentenceHe: 'המתיישבים הראשונים בוודאי הרגישו תשושים אחרי שנטעו אלפי עצים.',
            decoys: ['should', 'tiring'],
            voiceEn: 'They might have forgotten the old route.',
            voiceHe: 'ייתכן שהם שכחו את הדרך הישנה.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'The director should have chosen a simpler costume for the youngest actors.',
              wrong: [
                'The director should of chosen a simpler costume for the youngest actors.',
                'The director should have choose a simpler costume for the youngest actors.',
                'The director should have chose a simpler costume for the youngest actors.',
              ],
              explainHe: 
                'אחרי should have באה הצורה השלישית של הפועל (chosen). אין לכתוב should of, וגם לא צורת שורש (choose) או עבר פשוט (chose).',
              hintEn: 'Check the exact form of the verb after should have.',
            },
            story: {
              passageEn: 
                'When the forestry team revisited the hills they had planted in the 1950s, they found that nearly every pine tree had been replaced by wild oaks and carobs. The team leader examined the soil and noticed that there were hardly any pine seedlings anywhere. Local shepherds explained that the old pines had burned in a fire decades ago, and that the oaks grew back by themselves within a few seasons. The leader sighed and said that planning for local trees would have saved decades of effort.',
              passageHe: '',
              questionEn: 'What does the team leader imply?',
              questionHe: '',
              correct: 'The original planting plan was not the wisest choice.',
              wrong: [
                'Shepherds should have burned the pine forest.',
                'Oaks and carobs cannot grow without planting.',
                'The hills had never been planted by anyone.',
              ],
            },
            storyHintEn: 'Read what the leader says about local trees.',
          },
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
      sentenceHe: 'החלוצים ייבשו ביצות וזרעו שדות; כתוצאה מכך, יכלו לצמוח כפרים חדשים.',
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
            'Shavuot began as an agricultural festival, when farmers brought the first fruits of their harvest to Jerusalem. In the twentieth century, the pioneers of the kibbutzim gave the festival new life. They celebrated the harvest with songs, dances and wagons full of produce. Consequently, Shavuot is still celebrated on many kibbutzim with colorful harvest parades.',
          passageHe:
            'שבועות התחיל כחג חקלאי, שבו החקלאים הביאו לירושלים את הפירות הראשונים של הקציר שלהם. במאה העשרים, החלוצים של הקיבוצים העניקו לחג חיים חדשים. הם חגגו את הקציר בשירים, בריקודים ובעגלות מלאות תוצרת. כתוצאה מכך, שבועות עדיין נחגג בקיבוצים רבים עם תהלוכות ביכורים צבעוניות.',
          questionEn: 'How did the kibbutz pioneers celebrate the harvest?',
          questionHe: 'איך חגגו חלוצי הקיבוצים את הקציר?',
          correct: 'With songs, dances and wagons full of produce.',
          wrong: ['With a long trip to Jerusalem by train.', 'With a quiet meal at home.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'It rained; therefore, we stayed inside.',
              wrong: ['It rained, therefore we stayed inside.'],
              explainHe: 'בין שני משפטים שלמים לפני therefore באה נקודה-פסיק, ואחריו פסיק.',
              hintHe: 'פסיק לבדו אינו מחבר שני משפטים שלמים.',
            },
            story: {
              passageEn: 
                'Shavuot is in spring. Farmers bring the first fruits. Therefore, many children wear flowers on their heads.',
              passageHe: 
                'שבועות הוא באביב. חקלאים מביאים את הפירות הראשונים. לכן ילדים רבים שמים פרחים על הראש.',
              questionEn: 'What do many children wear?',
              questionHe: 'מה ילדים רבים שמים על הראש?',
              correct: 'Flowers on their heads.',
              wrong: ['Winter coats.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['coronation', 'inauguration'],
              ['senator', 'astronaut'],
              ['industrial', 'maritime'],
              ['vaccine', 'mortgage'],
            ],
          },
          master: {
            sentenceEn: 
              'The new railway connected remote villages and therefore trade grew across the region.',
            sentenceHe: 'מסילת הברזל החדשה חיברה כפרים מבודדים ולכן המסחר גדל ברחבי האזור.',
            decoys: ['although', 'instead'],
            voiceEn: 'Our itinerary includes a visit to the farm.',
            voiceHe: 'מסלול הטיול שלנו כולל ביקור בחווה.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'The harvest was poor; consequently, food prices increased during the summer.',
              wrong: [
                'The harvest was poor, consequently food prices increased during the summer.',
                'The harvest was poor; consequently, food prices increases during the summer.',
                'The harvest was poor; however, food prices increased during the summer.',
              ],
              explainHe: 
                'לפני consequently בין שני משפטים שלמים באה נקודה-פסיק ואחריו פסיק. הנושא prices דורש פועל בעבר (increased), ו-however מנגיד ולא מראה תוצאה.',
              hintEn: 'Check the punctuation, the verb and the meaning of the connector.',
            },
            story: {
              passageEn: 
                'During the first years of the state, thousands of immigrants arrived faster than houses could be built, so many families lived in tents or in metal huts. The government encouraged young people to establish farming villages near the borders. Each village received seeds, a water pipe and a few tractors, yet the soil was stony and the summers were harsh. Nevertheless, within a decade, most of those villages were selling vegetables to the nearby towns.',
              passageHe: '',
              questionEn: 'What does the word Nevertheless show about the villages?',
              questionHe: '',
              correct: 'They succeeded in spite of difficult conditions.',
              wrong: [
                'They failed because of the stony soil.',
                'They received no help from the government.',
                'They moved back to the tents in the cities.',
              ],
            },
            storyHintEn: 'Think about the difficulties and the final outcome.',
          },
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
      sentenceEn: 'In retrospect, the graduates realized that every holiday had marked a milestone in their lives.',
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
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is a confident guess about the past?',
              correct: 'The ground is wet, so it must have rained.',
              wrong: ['The ground is wet, so it must rain.'],
              explainHe: 'must have + V3 מביע הסקה בטוחה על העבר על סמך ראיה (הקרקע רטובה).',
              hintHe: 'הראיה נמצאת עכשיו והמסקנה היא על מה שכבר קרה.',
            },
            story: {
              passageEn: 
                'The graduates traveled to the sea. They swam and laughed. It was a great end to the year.',
              passageHe: 'הבוגרים נסעו לים. הם שחו וצחקו. זה היה סוף נהדר לשנה.',
              questionEn: 'Where did they travel?',
              questionHe: 'לאן הם נסעו?',
              correct: 'To the sea.',
              wrong: ['To the desert.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['anniversary', 'ancestor'],
              ['proportion', 'transit'],
              ['uniform', 'nomadic'],
              ['scold', 'vaccinate'],
            ],
          },
          master: {
            sentenceEn: 'In retrospect the holidays gave students a chance to relax and rejuvenate.',
            sentenceHe: 'במבט לאחור החגים נתנו לתלמידים הזדמנות להירגע ולהתרענן.',
            decoys: ['must', 'rarely'],
            voiceEn: 'Every milestone teaches us something valuable.',
            voiceHe: 'כל אבן דרך מלמדת אותנו משהו בעל ערך.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'The exams ended in June, so the graduates must have felt relieved.',
              wrong: [
                'The exams ended in June so the graduates must felt relieved.',
                'The exams ended in June, so the graduates must have feel relieved.',
                'The exams ended in June, so the graduates must has felt relieved.',
              ],
              explainHe: 
                'הסקה בטוחה על העבר נבנית כך: must have + V3. אי אפשר להשמיט have, לכתוב אחריו צורת שורש, או להחליף ב-has.',
              hintEn: 'Check the three words after the subject.',
            },
            story: {
              passageEn: 
                'On the final morning of the school year, the principal handed each graduate an envelope. Inside was the first photograph taken of their class on the first day of Grade 1, together with a short note written by their first teacher. Some students laughed at their missing teeth; others fell silent. Later that day, a girl who had never cried in front of her classmates sat on the stairs and stared at the picture for almost half an hour.',
              passageHe: '',
              questionEn: 'Why did the girl stare at the picture for so long?',
              questionHe: '',
              correct: 'It reminded her how much she had changed over the years.',
              wrong: [
                'She was angry that the photograph was blurry.',
                'She wanted to give it back to the principal.',
                'She was waiting for her first teacher to arrive.',
              ],
            },
            storyHintEn: 'Think about what the picture and the note represent.',
          },
        },
      },
    },
  ],
};

/** The holidays-autumn pack's grade 12 unit (`../../registry.ts`) */
export const HOLIDAYS_AUTUMN_GRADE_12_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildHighSchoolGrade('grade-12', [UNIT_HOLIDAYS_AUTUMN]);

/** The holidays-spring pack's grade 12 unit (`../../registry.ts`) */
export const HOLIDAYS_SPRING_GRADE_12_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildHighSchoolGrade('grade-12', [UNIT_HOLIDAYS_SPRING]);
