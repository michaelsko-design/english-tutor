import { buildHighSchoolGrade, type HighSchoolUnitSpec } from '../../../highSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

const UNITS: HighSchoolUnitSpec[] = [
  {
    ...packUnitNumbers('core-plus', 0),
    titleEn: 'Mixed Conditionals & Alternate Lives',
    titleHe: 'תנאים מעורבים וחיים חלופיים',
    subtitleHe: 'עונה 2: חיבור בין עבר להווה במשפטי תנאי (Mixed Conditionals) וניתוח בחירות',
    badgeEmoji: '🔀',
    missions: [
      {
        icon: '⏪',
        titleEn: 'Past Choices, Present Results',
        titleHe: 'בחירות בעבר, תוצאות בהווה',
        storyHookHe:
          'הרפתקת בונוס של עונה 2: מה היה המצב שלנו היום אילו בעבר היינו בוחרים אחרת? נלמד את התנאי המעורב If + had + V3, would + V1, שמחבר עבר דמיוני לתוצאה בהווה.',
        grammarTopic: 'Mixed Conditional: past condition → present result',
        skills: ['Mixed Conditionals', 'Third Conditional Review', 'Life Choices'],
        sentenceEn: 'If Adi had accepted the scholarship, she would be studying in Canada now.',
        sentenceHe: 'אילו עדי הייתה מקבלת את המלגה, היא הייתה לומדת עכשיו בקנדה.',
        vocab: [
          [
            'pursue',
            'verb',
            'לרדוף אחרי / לחתור להשגת מטרה',
            '🏃',
            'She decided to pursue a career in marine biology.',
            'היא החליטה לפתח קריירה בביולוגיה ימית.',
          ],
          [
            'relocate',
            'verb',
            'לעבור למקום אחר / להעתיק מקום מגורים',
            '🧳',
            'The company asked him to relocate to its office in Berlin.',
            'החברה ביקשה ממנו לעבור למשרד שלה בברלין.',
          ],
          [
            'fluent',
            'adjective',
            'שוטף / רהוט (בשפה)',
            '🗣️',
            'After a year in Madrid, he became fluent in Spanish.',
            'אחרי שנה במדריד הוא דיבר ספרדית שוטפת.',
          ],
          [
            'scholarship',
            'noun',
            'מלגה',
            '🎓',
            'Only ten students won a full scholarship this year.',
            'רק עשרה תלמידים זכו השנה במלגה מלאה.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'abandon', translationHe: 'לנטוש / לוותר על' },
            { wordEn: 'postpone', translationHe: 'לדחות' },
          ],
          shortSentenceEn: 'He would be fluent now.',
          shortSentenceHe: 'הוא היה מדבר שוטף עכשיו.',
          rule: {
            questionEn: 'Which sentence connects a PAST condition to a PRESENT result?',
            correct: 'If I had moved to London, I would speak perfect English today.',
            wrong: [
              'If I had moved to London, I would have spoken perfect English then.',
              'If I move to London, I will speak perfect English today.',
            ],
            explainHe:
              'בתנאי מעורב החלק של if בעבר (had + V3), אבל התוצאה בהווה (would + V1). מילה כמו today מראה שהתוצאה היא עכשיו.',
            hintHe: 'חפשו משפט שבו החלק הראשון מדבר על עבר שלא קרה, והחלק השני על המצב כיום.',
          },
          story: {
            passageEn:
              'Twenty years ago, Ronen was offered a job at a bank in New York. He chose to stay in Israel and pursue his dream of opening a bakery in Rehovot. If he had relocated to New York, he would probably be a rich banker today. Instead, he runs one of the most popular bakeries in the city, and he says he has no regrets.',
            passageHe:
              'לפני עשרים שנה הציעו לרונן עבודה בבנק בניו יורק. הוא בחר להישאר בישראל ולהגשים את החלום שלו לפתוח מאפייה ברחובות. אילו היה עובר לניו יורק, כנראה שהיה היום בנקאי עשיר. במקום זאת, הוא מנהל את אחת המאפיות הפופולריות בעיר, והוא אומר שאינו מתחרט.',
            questionEn: 'What does Ronen do today?',
            questionHe: 'במה רונן עוסק היום?',
            correct: 'He runs one of the most popular bakeries in the city.',
            wrong: ['He works as a rich banker in New York.', 'He teaches baking at a school in Rehovot.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'If she had left earlier, she would be home now.',
                wrong: ['If she had left earlier, she will be home now.'],
                explainHe: 
                  'בתנאי מעורב החלק של if בעבר (had left) והתוצאה בהווה (would be). will שייך לתנאי אחר.',
                hintHe: 'החלק הראשון מדבר על עבר שלא קרה, והשני על המצב עכשיו.',
              },
              story: {
                passageEn: 
                  'Amit missed the bus this morning. He walked to school and arrived late. Now he is tired.',
                passageHe: 'עמית פספס את האוטובוס הבוקר. הוא הלך לבית הספר והגיע באיחור. עכשיו הוא עייף.',
                questionEn: 'How did Amit get to school?',
                questionHe: 'איך עמית הגיע לבית הספר?',
                correct: 'He walked.',
                wrong: ['He took a taxi.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['purchase', 'embroider'],
                ['evolve', 'gamble'],
                ['punctual', 'fertile'],
                ['pension', 'mortgage'],
              ],
            },
            master: {
              sentenceEn: 'If Dana had chosen medicine she would probably be working in a hospital today.',
              sentenceHe: 'אילו דנה הייתה בוחרת ברפואה היא כנראה הייתה עובדת היום בבית חולים.',
              decoys: ['will', 'yesterday'],
              voiceEn: 'If I had waited, I would feel better.',
              voiceHe: 'אילו חיכיתי, הייתי מרגיש/ה טוב יותר.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'If he had accepted the offer, he would live in Berlin now.',
                wrong: [
                  'If he accepted the offer, he would live in Berlin now.',
                  'If he had accepted the offer, he would lived in Berlin now.',
                  'If he had accepted the offer, he will live in Berlin now.',
                ],
                explainHe: 
                  'בתנאי מעורב: if + had + V3 לתנאי בעבר, ו-would + פועל בצורת שורש לתוצאה בהווה. לא משתמשים ב-will וגם לא ב-would + עבר.',
                hintEn: 'Check both halves: the past condition and the present result.',
              },
              story: {
                passageEn: 
                  'When Nitzan was seventeen, a famous football club invited her to a trial. Her parents wanted her to finish school first, so she stayed home and studied hard. Nowadays she teaches physics at a university, and her students often ask whether she regrets her decision. She usually answers with a smile that she often watches the matches of the club and that she has never felt jealous.',
                passageHe: '',
                questionEn: 'What can we infer about Nitzan today?',
                questionHe: '',
                correct: 'She is satisfied with the path she chose.',
                wrong: [
                  'She wishes she had never studied physics.',
                  'She plays for the club in the evenings.',
                  'Her parents regret their decision.',
                ],
              },
              storyHintEn: 'Notice how she answers her students.',
            },
          },
        },
      },
      {
        icon: '🤔',
        titleEn: 'Present Traits, Past Results',
        titleHe: 'תכונות בהווה, תוצאות בעבר',
        storyHookHe:
          'לפעמים תכונה קבועה שלנו משפיעה על מה שכבר קרה. נלמד את הכיוון השני של התנאי המעורב: If + Past Simple, would have + V3, למשל If I were braver, I would have spoken.',
        grammarTopic: 'Mixed Conditional: present condition → past result',
        skills: ['Mixed Conditionals', 'Character Traits', 'Cause & Effect'],
        sentenceEn: 'If Gal were less impulsive, he would not have sent that angry message.',
        sentenceHe: 'אילו גל היה פחות אימפולסיבי, הוא לא היה שולח את ההודעה הכועסת ההיא.',
        vocab: [
          [
            'impulsive',
            'adjective',
            'אימפולסיבי / פועל בלי לחשוב',
            '💥',
            'Impulsive shoppers often buy things they do not need.',
            'קונים אימפולסיביים קונים לעתים קרובות דברים שהם לא צריכים.',
          ],
          [
            'cautious',
            'adjective',
            'זהיר',
            '⚠️',
            'Cautious hikers always carry extra water in the desert.',
            'מטיילים זהירים תמיד נושאים מים נוספים במדבר.',
          ],
          [
            'hesitate',
            'verb',
            'להסס / להתלבט',
            '🤷',
            'Do not hesitate to ask for help if you need it.',
            'אל תהססו לבקש עזרה אם אתם צריכים אותה.',
          ],
          [
            'temperament',
            'noun',
            'מזג / אופי',
            '🌀',
            'My sister has a calm temperament, unlike me.',
            'לאחותי יש מזג רגוע, בשונה ממני.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'reliable', translationHe: 'אמין' },
            { wordEn: 'generous', translationHe: 'נדיב' },
          ],
          shortSentenceEn: 'She is a cautious driver.',
          shortSentenceHe: 'היא נהגת זהירה.',
          rule: {
            questionEn: 'Which sentence connects a PRESENT trait to a PAST result?',
            correct: 'If Lior were more organised, he would have finished the project yesterday.',
            wrong: [
              'If Lior had been more organised, he would finish the project tomorrow.',
              'If Lior is more organised, he will finish the project yesterday.',
            ],
            explainHe:
              'תכונה קבועה בהווה מופיעה ב-Past Simple (were more organised), והתוצאה שכבר הייתה אמורה לקרות מופיעה ב-would have + V3.',
            hintHe: 'התכונה של ליאור נכונה גם היום, והפרויקט היה אמור להסתיים בעבר. התאימו את הזמן של כל חלק.',
          },
          story: {
            passageEn:
              'Maya has always had a shy temperament. Last week, her history teacher asked who wanted to represent the school at a national debate. Maya knew the topic well, but she hesitated and said nothing. If she were more confident, she would have raised her hand, and she might be preparing for the debate right now.',
            passageHe:
              'למאיה תמיד היה מזג ביישני. בשבוע שעבר המורה להיסטוריה שאלה מי רוצה לייצג את בית הספר בתחרות ויכוח ארצית. מאיה הכירה את הנושא היטב, אבל היא היססה ולא אמרה דבר. אילו הייתה בטוחה יותר בעצמה, היא הייתה מצביעה, ואולי הייתה מתכוננת לתחרות ממש עכשיו.',
            questionEn: 'What did Maya do when the teacher asked the question?',
            questionHe: 'מה עשתה מאיה כשהמורה שאלה את השאלה?',
            correct: 'She hesitated and said nothing.',
            wrong: ['She raised her hand at once.', 'She asked a friend to answer.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'If Omer were taller, he would have caught the ball.',
                wrong: ['If Omer was taller, he would caught the ball.'],
                explainHe: 'במשפט תנאי מעורב עם were בחלק הראשון, התוצאה בעבר היא would have + V3.',
                hintHe: 'התוצאה כבר קרתה (או לא קרתה) בעבר, לכן צריך would have + V3.',
              },
              story: {
                passageEn: 
                  'Ruth is very careful. Yesterday she checked her bag twice. She did not forget her keys.',
                passageHe: 'רות מאוד זהירה. אתמול היא בדקה את התיק שלה פעמיים. היא לא שכחה את המפתחות.',
                questionEn: 'What did Ruth check?',
                questionHe: 'מה רות בדקה?',
                correct: 'Her bag.',
                wrong: ['Her phone.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['thrifty', 'frugal'],
                ['careless', 'foolish'],
                ['boast', 'threaten'],
                ['vocabulary', 'mortgage'],
              ],
            },
            master: {
              sentenceEn: 'If Yoav were more patient he would not have quit the course after one week.',
              sentenceHe: 'אילו יואב היה סבלני יותר הוא לא היה פורש מהקורס אחרי שבוע אחד.',
              decoys: ['will', 'been'],
              voiceEn: 'If she were calmer she would have won.',
              voiceHe: 'אילו הייתה רגועה יותר היא הייתה מנצחת.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'If Tali were less shy, she would have joined the debate team.',
                wrong: [
                  'If Tali were less shy, she would joined the debate team.',
                  'If Tali had less shy, she would have joined the debate team.',
                  'If Tali were less shy, she will have joined the debate team.',
                ],
                explainHe: 
                  'תכונה בהווה מופיעה ב-were, והתוצאה בעבר ב-would have + V3. אין לשלב would עם עבר פשוט, ולא משתמשים ב-will.',
                hintEn: 'Check the trait in the first half and the result in the second half.',
              },
              story: {
                passageEn: 
                  'Gili is known in her class as extremely cautious. Before every test she makes a detailed plan, and she never answers a question unless she is completely sure. Last month the class had to choose a captain for the science competition, and the teacher noticed that Gili had the best ideas. Yet she stayed silent while two louder classmates volunteered. Afterwards the teacher told her quietly that the team had lost a good leader.',
                passageHe: '',
                questionEn: 'Why did the teacher say the team had lost a good leader?',
                questionHe: '',
                correct: 'Her caution stopped her from volunteering.',
                wrong: [
                  'Gili had refused to join the competition.',
                  'The louder classmates had left the team.',
                  'The teacher had chosen another captain.',
                ],
              },
              storyHintEn: 'Why did Gili stay silent?',
            },
          },
        },
      },
      {
        icon: '🧭',
        isBoss: true,
        titleEn: 'Boss: Sliding Doors Unseen',
        titleHe: 'בוס: Unseen של ״דלתות מסתובבות״',
        storyHookHe:
          'משימת בוס של עונה 2: ניתוח של סרט שבו רגע אחד קטן משנה חיים שלמים. עליכם להבחין בין שני סוגי התנאי המעורב ובין תנאי שלישי רגיל ולענות על שאלות ברמת בגרות!',
        grammarTopic: 'Mixed & Third Conditionals Synthesis',
        skills: ['Conditionals Mastery', 'Film Analysis', 'Bagrut Unseen'],
        sentenceEn: 'If she had caught that train, her whole life would be different today.',
        sentenceHe: 'אילו הייתה מספיקה לעלות לרכבת ההיא, כל חייה היו שונים היום.',
        vocab: [
          [
            'pivotal',
            'adjective',
            'מכריע / מרכזי',
            '🎯',
            'Meeting his mentor was a pivotal moment in his career.',
            'הפגישה עם המנטור שלו הייתה רגע מכריע בקריירה שלו.',
          ],
          [
            'trajectory',
            'noun',
            'מסלול / כיוון התפתחות',
            '📈',
            'One good teacher can change the trajectory of a student\'s life.',
            'מורה טוב אחד יכול לשנות את מסלול חייו של תלמיד.',
          ],
          [
            'alternate',
            'adjective',
            'חלופי',
            '🔀',
            'The film shows an alternate version of history.',
            'הסרט מציג גרסה חלופית של ההיסטוריה.',
          ],
          [
            'speculate',
            'verb',
            'לשער / להעלות השערות',
            '💭',
            'Fans love to speculate about how the series will end.',
            'מעריצים אוהבים להעלות השערות איך הסדרה תסתיים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'trivial', translationHe: 'שולי / חסר חשיבות' },
            { wordEn: 'identical', translationHe: 'זהה' },
          ],
          shortSentenceEn: 'One moment changed everything.',
          shortSentenceHe: 'רגע אחד שינה הכול.',
          rule: {
            questionEn: 'Which sentence is a mixed conditional (past condition, present result)?',
            correct: 'If the doors had not closed, Helen would be a different person now.',
            wrong: [
              'If the doors had not closed, Helen would have met him on the train.',
              'If the doors do not close, Helen will meet him on the train.',
            ],
            explainHe:
              'בתנאי המעורב התוצאה מדברת על ההווה (would be … now). would have met הוא תנאי שלישי רגיל, ו-will meet הוא תנאי ראשון.',
            hintHe: 'בכל האפשרויות בדקו את החלק השני: האם הוא מדבר על העבר, על העתיד או על המצב עכשיו?',
          },
          story: {
            passageEn:
              'In the film Sliding Doors, a young woman named Helen runs to catch a train in London. The story splits into two alternate lives: in one she catches the train, and in the other the doors close in her face. In the first life she discovers a painful secret and starts a new business. Viewers still speculate about which life was better for her.',
            passageHe:
              'בסרט ״דלתות מסתובבות״, אישה צעירה בשם הלן רצה כדי להספיק לרכבת בלונדון. הסיפור מתפצל לשני חיים חלופיים: באחד היא מספיקה לעלות לרכבת, ובשני הדלתות נסגרות מול פניה. בחיים הראשונים היא מגלה סוד כואב ופותחת עסק חדש. הצופים עדיין משערים אילו חיים היו טובים יותר עבורה.',
            questionEn: 'What happens to Helen in the first life?',
            questionHe: 'מה קורה להלן בחיים הראשונים?',
            correct: 'She discovers a painful secret and starts a new business.',
            wrong: ['She misses the train and goes home.', 'She moves away from London for good.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is about something that did not happen?',
                correct: 'If I had taken that job, my life would be different.',
                wrong: ['If I take this job, my life will be different.'],
                explainHe: 'had taken מראה שהדבר לא קרה בעבר. If I take הוא תנאי אפשרי לעתיד.',
                hintHe: 'חפשו את המשפט שמדבר על משהו שכבר אי אפשר לשנות.',
              },
              story: {
                passageEn: 
                  'Max nearly took a different train. In the end he stayed on his train and met an old friend. They talked for an hour.',
                passageHe: 
                  'מקס כמעט עלה על רכבת אחרת. בסוף הוא נשאר ברכבת שלו ופגש חבר ותיק. הם דיברו שעה.',
                questionEn: 'Who did Max meet?',
                questionHe: 'את מי מקס פגש?',
                correct: 'An old friend.',
                wrong: ['A new teacher.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['mechanical', 'nomadic'],
                ['souvenir', 'pronunciation'],
                ['elastic', 'edible'],
                ['dance', 'shiver'],
              ],
            },
            master: {
              sentenceEn: 'If the letter had arrived on time her career would be very different today.',
              sentenceHe: 'אילו המכתב היה מגיע בזמן הקריירה שלה הייתה שונה מאוד היום.',
              decoys: ['will', 'have'],
              voiceEn: 'One small choice can change everything.',
              voiceHe: 'בחירה קטנה אחת יכולה לשנות הכול.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'If she had stayed in London, she would have a different job now.',
                wrong: [
                  'If she stayed in London, she would have a different job now.',
                  'If she had stayed in London, she would had a different job now.',
                  'If she had stay in London, she would have a different job now.',
                ],
                explainHe: 
                  'בתנאי מעורב: had + V3 בחלק של if (had stayed) ו-would + פועל בצורת שורש בתוצאה. עבר פשוט בחלק של if משנה את המשמעות.',
                hintEn: 'Check the verb form in each half of the sentence.',
              },
              story: {
                passageEn: 
                  'Tamar still remembers the morning of her violin audition. She woke up late, missed her usual bus, and shared a taxi with a stranger who happened to be a music teacher. During the ride they talked about Bach, and by the end she had a new teacher and a place in his small youth orchestra. She never made it to the audition, but she often says the missed bus was the best thing that ever happened to her.',
                passageHe: '',
                questionEn: 'Why does Tamar call the missed bus the best thing?',
                questionHe: '',
                correct: 'It led to opportunities more valuable than the audition.',
                wrong: [
                  'She enjoys travelling by taxi more than by bus.',
                  'She believes auditions are not important at all.',
                  'She passed the audition thanks to the stranger.',
                ],
              },
              storyHintEn: 'Where did the missed bus lead?',
            },
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('core-plus', 1),
    titleEn: 'Paraphrasing & Summarising for the Bagrut',
    titleHe: 'ניסוח מחדש וסיכום לבגרות',
    subtitleHe: 'עונה 2: לומר את אותו רעיון במילים אחרות, לזהות עיקר וטפל ולכתוב סיכום קצר',
    badgeEmoji: '📝',
    missions: [
      {
        icon: '🔁',
        titleEn: 'Same Idea, New Words: Paraphrasing',
        titleHe: 'אותו רעיון, מילים חדשות: פרפרזה',
        storyHookHe:
          'בשאלות הבגרות התשובה הנכונה כמעט אף פעם לא מעתיקה את המילים מהטקסט. נלמד לזהות פרפרזה: מילים נרדפות, שינוי חלק דיבר ומעבר מפעיל לסביל.',
        grammarTopic: 'Paraphrasing: synonyms, word forms & active ↔ passive',
        skills: ['Paraphrasing', 'Synonyms', 'Module G Strategies'],
        sentenceEn: 'A good paraphrase keeps the original meaning but uses completely different words.',
        sentenceHe: 'פרפרזה טובה שומרת על המשמעות המקורית אבל משתמשת במילים שונות לגמרי.',
        vocab: [
          [
            'paraphrase',
            'noun',
            'פרפרזה / ניסוח מחדש',
            '🔁',
            'The correct answer is usually a paraphrase of the text.',
            'התשובה הנכונה היא בדרך כלל ניסוח מחדש של הטקסט.',
          ],
          [
            'synonym',
            'noun',
            'מילה נרדפת',
            '🔗',
            '"Begin" is a synonym for "start".',
            '״Begin״ היא מילה נרדפת ל-״start״.',
          ],
          [
            'equivalent',
            'adjective',
            'שווה ערך / מקביל',
            '⚖️',
            'One kilometre is equivalent to a thousand metres.',
            'קילומטר אחד שווה ערך לאלף מטרים.',
          ],
          [
            'convey',
            'verb',
            'להעביר (מסר / רעיון)',
            '📨',
            'Poets use images to convey strong feelings.',
            'משוררים משתמשים בדימויים כדי להעביר רגשות חזקים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'antonym', translationHe: 'מילה הפוכה' },
            { wordEn: 'quotation', translationHe: 'ציטוט' },
          ],
          shortSentenceEn: 'Synonyms help us paraphrase.',
          shortSentenceHe: 'מילים נרדפות עוזרות לנו לנסח מחדש.',
          rule: {
            questionEn: 'Which sentence is the best paraphrase of "The museum attracts many tourists"?',
            correct: 'Large numbers of visitors are drawn to the museum.',
            wrong: ['The museum attracts many tourists every day.', 'Few tourists are interested in the museum.'],
            explainHe:
              'פרפרזה טובה שומרת על המשמעות אבל משנה את המילים ואת המבנה: visitors במקום tourists, ומבנה סביל (are drawn to).',
            hintHe: 'פסלו את האפשרות שמעתיקה את המשפט כמעט מילה במילה, ואת זו שהופכת את המשמעות.',
          },
          story: {
            passageEn:
              'In the Bagrut reading section, many students choose answers that repeat words from the passage. However, examiners often write the correct answer as a paraphrase. For example, if the text says that a city "grew rapidly", the right answer may say that it "expanded quickly". Students who learn synonyms can recognise these hidden answers much more easily.',
            passageHe:
              'בחלק הקריאה של הבגרות, תלמידים רבים בוחרים תשובות שחוזרות על מילים מהקטע. עם זאת, הבוחנים כותבים לעתים קרובות את התשובה הנכונה כפרפרזה. לדוגמה, אם בטקסט כתוב שעיר ״גדלה במהירות״, התשובה הנכונה עשויה לומר שהיא ״התרחבה מהר״. תלמידים שלומדים מילים נרדפות יכולים לזהות את התשובות המוסתרות האלה בקלות רבה יותר.',
            questionEn: 'Who can recognise the hidden answers more easily?',
            questionHe: 'מי יכולים לזהות את התשובות המוסתרות בקלות רבה יותר?',
            correct: 'Students who learn synonyms.',
            wrong: ['Students who copy words from the passage.', 'Students who read the questions first.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence has the same meaning as "The film is very long"?',
                correct: 'The movie lasts a long time.',
                wrong: ['The film is very short.'],
                explainHe: 
                  'פרפרזה שומרת על המשמעות אבל משתמשת במילים אחרות: movie במקום film, lasts a long time במקום is very long.',
                hintHe: 'חפשו משפט עם אותה משמעות ובמילים שונות.',
              },
              story: {
                passageEn: 
                  'The shop opens early. The store starts work in the morning. These two sentences mean the same.',
                passageHe: 'החנות נפתחת מוקדם. החנות מתחילה לעבוד בבוקר. שני המשפטים האלה אומרים אותו דבר.',
                questionEn: 'What do the two sentences do?',
                questionHe: 'מה עושים שני המשפטים?',
                correct: 'They mean the same.',
                wrong: ['They mean the opposite.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['blueprint', 'postcard'],
                ['prefix', 'suffix'],
                ['loyal', 'sensitive'],
                ['repair', 'weigh'],
              ],
            },
            master: {
              sentenceEn: 
                'Skilled writers often replace common words with synonyms to avoid repeating themselves in essays.',
              sentenceHe: 
                'כותבים מיומנים מחליפים לעתים קרובות מילים נפוצות במילים נרדפות כדי להימנע מחזרה בחיבורים.',
              decoys: ['copy', 'antonyms'],
              voiceEn: 'Say it again in your own words.',
              voiceHe: 'אמרו זאת שוב במילים שלכם.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The sentence was paraphrased by the student in simpler words.',
                wrong: [
                  'The sentence was paraphrase by the student in simpler words.',
                  'The sentence paraphrased by the student in simpler words.',
                  'The sentence was paraphrasing by the student in simpler words.',
                ],
                explainHe: 
                  'במבנה סביל משתמשים ב-was + V3 (was paraphrased). אי אפשר להשמיט את was או להשתמש ב-ing.',
                hintEn: 'Look for the passive form: was and the third form.',
              },
              story: {
                passageEn: 
                  'In the Bagrut reading section, Eyal found the sentence: rapid urbanisation has placed enormous pressure on public services. One answer option said that fast growth of cities has made it hard for public services to cope. Another repeated the words rapid urbanisation and added that cities are always beautiful. Eyal chose the first, even though it shared almost no words with the original, and his teacher later confirmed that he was right.',
                passageHe: '',
                questionEn: 'Why did Eyal choose the first option?',
                questionHe: '',
                correct: 'It expressed the same meaning in different words.',
                wrong: [
                  'It used exactly the same words as the passage.',
                  'It was the longest answer of all.',
                  'It praised the beauty of cities.',
                ],
              },
              storyHintEn: 'Compare meaning, not words.',
            },
          },
        },
      },
      {
        icon: '📋',
        titleEn: 'Main Idea or Detail? Summarising',
        titleHe: 'עיקר או טפל? סיכום',
        storyHookHe:
          'סיכום טוב שומר רק על הרעיונות המרכזיים, בלי דוגמאות, מספרים וחזרות. נלמד להפריד בין עיקר לטפל ולהשתמש בביטויים כמו The passage mainly discusses… ו-In short.',
        grammarTopic: 'Summarising: main ideas vs. supporting details',
        skills: ['Summarising', 'Main Idea', 'Module G Strategies'],
        sentenceEn: 'In short, the article argues that green roofs make cities cooler and healthier.',
        sentenceHe: 'בקיצור, המאמר טוען שגגות ירוקים הופכים ערים לקרירות ולבריאות יותר.',
        vocab: [
          [
            'condense',
            'verb',
            'לתמצת / לקצר',
            '🧩',
            'Try to condense the whole chapter into five sentences.',
            'נסו לתמצת את כל הפרק לחמישה משפטים.',
          ],
          [
            'concise',
            'adjective',
            'תמציתי / קצר וברור',
            '✂️',
            'Her report was concise and easy to follow.',
            'הדוח שלה היה תמציתי וקל להבנה.',
          ],
          [
            'redundant',
            'adjective',
            'מיותר / חוזר על עצמו',
            '🗑️',
            'Delete any redundant words from your essay.',
            'מחקו מהחיבור כל מילה מיותרת.',
          ],
          [
            'essence',
            'noun',
            'מהות / עיקר',
            '💎',
            'The essence of the story is the power of friendship.',
            'מהות הסיפור היא כוחה של החברות.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'expand', translationHe: 'להרחיב' },
            { wordEn: 'decorate', translationHe: 'לקשט' },
          ],
          shortSentenceEn: 'Keep your summary concise.',
          shortSentenceHe: 'הקפידו שהסיכום יהיה תמציתי.',
          rule: {
            questionEn: 'Which sentence belongs in a SUMMARY of an article about sleep?',
            correct: 'Teenagers need more sleep than most of them actually get.',
            wrong: [
              'For example, a girl from Ashdod sleeps only five hours a night.',
              'The researcher, who has two cats, wrote the study in 2019.',
            ],
            explainHe:
              'בסיכום נשאר רק הרעיון המרכזי. דוגמה אישית ופרטים על החוקר הם טפל, ולכן לא נכנסים לסיכום.',
            hintHe: 'שאלו את עצמכם: האם המשפט מציג את הרעיון הכללי של המאמר, או רק דוגמה ופרט צדדי?',
          },
          story: {
            passageEn:
              'Researchers in Tel Aviv studied how green roofs affect city life. Roofs covered with plants were up to thirty degrees cooler than ordinary roofs on summer afternoons. In one building, the residents even started a small vegetable garden. The study concludes that green roofs can reduce heat and improve the quality of urban life.',
            passageHe:
              'חוקרים בתל אביב בדקו איך גגות ירוקים משפיעים על החיים בעיר. גגות מכוסים בצמחים היו קרירים עד שלושים מעלות יותר מגגות רגילים בשעות אחר הצהריים בקיץ. באחד הבניינים הדיירים אפילו פתחו גינת ירקות קטנה. המחקר מסכם שגגות ירוקים יכולים להפחית חום ולשפר את איכות החיים בעיר.',
            questionEn: 'What is the main conclusion of the study?',
            questionHe: 'מהי המסקנה העיקרית של המחקר?',
            correct: 'Green roofs can reduce heat and improve urban life.',
            wrong: ['Residents should grow vegetables on every roof.', 'Summer afternoons in Tel Aviv are getting shorter.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is the main idea?',
                correct: 'Exercise keeps the body and mind healthy.',
                wrong: ['Dan ran five kilometres on Tuesday.'],
                explainHe: 'הרעיון המרכזי הוא כללי וחשוב. פרט כמו מי רץ וכמה הוא רק דוגמה.',
                hintHe: 'איזה משפט כללי ואיזה פרט צדדי?',
              },
              story: {
                passageEn: 'A summary is short. It gives the main idea. It leaves out small details.',
                passageHe: 'סיכום הוא קצר. הוא נותן את הרעיון המרכזי. הוא משמיט פרטים קטנים.',
                questionEn: 'What does a summary leave out?',
                questionHe: 'מה סיכום משמיט?',
                correct: 'Small details.',
                wrong: ['The main idea.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['expand', 'multiply'],
                ['vague', 'confusing'],
                ['essential', 'vital'],
                ['length', 'format'],
              ],
            },
            master: {
              sentenceEn: 
                'A concise summary includes the main ideas and leaves out examples and unnecessary details.',
              sentenceHe: 'סיכום תמציתי כולל את הרעיונות המרכזיים ומשמיט דוגמאות ופרטים מיותרים.',
              decoys: ['yesterday', 'between'],
              voiceEn: 'Good summaries are short and clear.',
              voiceHe: 'סיכומים טובים הם קצרים וברורים.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The article mainly discusses how sleep affects teenagers.',
                wrong: [
                  'The article mainly discuss how sleep affects teenagers.',
                  'The article mainly discusses how does sleep affect teenagers.',
                  'The article main discusses how sleep affects teenagers.',
                ],
                explainHe: 
                  'הנושא the article דורש discusses; אחרי how במשפט עקיף משתמשים בסדר רגיל (sleep affects) ולא בשאלה; ו-mainly הוא תואר פועל.',
                hintEn: 'Check the verb ending and the word order after how.',
              },
              story: {
                passageEn: 
                  'Last winter the town of Arad opened a repair cafe where residents bring broken toasters, lamps and bicycles. Volunteers fix what they can for free and teach owners how to do small repairs themselves. At first, the municipality worried that shops would lose business. Instead, hardware stores reported more customers buying screws and tools, and the cafe itself had a waiting list within two months.',
                passageHe: '',
                questionEn: 'What can we conclude about the repair cafe?',
                questionHe: '',
                correct: 'It became popular without harming local shops.',
                wrong: [
                  'It was closed after complaints from hardware stores.',
                  'It only repaired broken toasters.',
                  'It charged high prices for every repair.',
                ],
              },
              storyHintEn: 'Compare the fears of the municipality with the results.',
            },
          },
        },
      },
      {
        icon: '🎓',
        isBoss: true,
        titleEn: 'Boss: Season Finale: The Bagrut Summary Challenge',
        titleHe: 'בוס: גמר העונה — אתגר הסיכום לבגרות',
        storyHookHe:
          'גמר עונה 2 והפרידה מהתיכון! עליכם לקרוא קטע Unseen מלא, לזהות את הפרפרזה הנכונה, להשמיט את הטפל ולבחור את הסיכום המדויק ביותר. בהצלחה בבגרות!',
        grammarTopic: 'Paraphrasing & Summarising Synthesis: Season Finale',
        skills: ['Paraphrase Mastery', 'Summary Writing', 'Bagrut Unseen'],
        sentenceEn: 'A coherent summary conveys the gist of the text without copying it word for word.',
        sentenceHe: 'סיכום קוהרנטי מעביר את תמצית הטקסט בלי להעתיק אותו מילה במילה.',
        vocab: [
          [
            'gist',
            'noun',
            'תמצית / הרעיון הכללי',
            '🎯',
            'Read the first paragraph quickly to get the gist.',
            'קראו את הפסקה הראשונה מהר כדי להבין את הרעיון הכללי.',
          ],
          [
            'omit',
            'verb',
            'להשמיט / לדלג על',
            '❌',
            'You may omit minor details from your summary.',
            'אפשר להשמיט פרטים שוליים מהסיכום.',
          ],
          [
            'coherent',
            'adjective',
            'קוהרנטי / מגובש והגיוני',
            '🧱',
            'A coherent paragraph moves logically from one idea to the next.',
            'פסקה קוהרנטית עוברת בהיגיון מרעיון אחד לבא אחריו.',
          ],
          [
            'verbatim',
            'adverb',
            'מילה במילה',
            '📜',
            'The journalist quoted the minister verbatim.',
            'העיתונאי ציטט את השר מילה במילה.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'footnote', translationHe: 'הערת שוליים' },
            { wordEn: 'headline', translationHe: 'כותרת' },
          ],
          shortSentenceEn: 'First, get the gist.',
          shortSentenceHe: 'קודם כול, הבינו את הרעיון הכללי.',
          rule: {
            questionEn: 'Which is the best one-sentence summary of a text about volunteering?',
            correct: 'Volunteering benefits both the community and the volunteers themselves.',
            wrong: [
              'In 2022, exactly 412 students volunteered at a hospital in Haifa.',
              'Volunteering is when people volunteer and do volunteer work.',
            ],
            explainHe:
              'סיכום טוב מציג את הרעיון המרכזי במילים תמציתיות. מספרים מדויקים הם פרט שולי, ומשפט שחוזר על אותה מילה הוא מיותר.',
            hintHe: 'פסלו משפט שמתמקד במספרים, ומשפט שחוזר על עצמו בלי להוסיף מידע.',
          },
          story: {
            passageEn:
              'Every year, thousands of Israeli graduates spend a year volunteering before the army or university. Some work with children in development towns, while others help elderly people or farmers. Research shows that these volunteers develop leadership skills and a stronger sense of responsibility. Communities benefit too, since many projects continue long after the volunteers leave.',
            passageHe:
              'בכל שנה אלפי בוגרים בישראל מקדישים שנה להתנדבות לפני הצבא או האוניברסיטה. חלקם עובדים עם ילדים בעיירות פיתוח, ואחרים עוזרים לקשישים או לחקלאים. מחקרים מראים שהמתנדבים מפתחים כישורי מנהיגות ותחושת אחריות חזקה יותר. גם הקהילות מרוויחות, מפני שפרויקטים רבים נמשכים עוד זמן רב אחרי שהמתנדבים עוזבים.',
            questionEn: 'What skills do the volunteers develop, according to research?',
            questionHe: 'אילו כישורים מפתחים המתנדבים, לפי המחקרים?',
            correct: 'Leadership skills and a stronger sense of responsibility.',
            wrong: ['Farming skills and a love of nature.', 'Language skills and better grades.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is the best summary of a story about a lost dog?',
                correct: 'A boy finds his lost dog with the help of neighbours.',
                wrong: ['The dog was brown and had a red collar.'],
                explainHe: 'סיכום טוב מציג את העלילה המרכזית. תיאור של צבע ורצועה הוא פרט משני.',
                hintHe: 'סיכום מספר מה קרה בגדול.',
              },
              story: {
                passageEn: 
                  'Keren read a long article. She wrote one sentence about it. The sentence gave the main idea.',
                passageHe: 'קרן קראה מאמר ארוך. היא כתבה עליו משפט אחד. המשפט נתן את הרעיון המרכזי.',
                questionEn: 'What did Keren write?',
                questionHe: 'מה קרן כתבה?',
                correct: 'One sentence.',
                wrong: ['A long letter.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['souvenir', 'pension'],
                ['forgive', 'assemble'],
                ['confusing', 'jumbled'],
                ['chemically', 'geographically'],
              ],
            },
            master: {
              sentenceEn: 'Before writing a summary read the passage twice and omit every minor example.',
              sentenceHe: 'לפני כתיבת סיכום קראו את הקטע פעמיים והשמיטו כל דוגמה משנית.',
              decoys: ['quickly', 'between'],
              voiceEn: 'The gist is the central idea.',
              voiceHe: 'התמצית היא הרעיון המרכזי.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'She omitted the examples because they were not essential to the main idea.',
                wrong: [
                  'She omit the examples because they were not essential to the main idea.',
                  'She omitted the examples because they was not essential to the main idea.',
                  'She omitted the examples because they were not essentially to the main idea.',
                ],
                explainHe: 
                  'בעבר הפועל omitted, הנושא they דורש were, ואחרי were בא שם תואר (essential) ולא תואר פועל.',
                hintEn: 'Check the tense, the verb be and the word essential.',
              },
              story: {
                passageEn: 
                  'The final exam question asked students to summarise a passage about a school garden in two sentences. Most students copied the first two sentences of the passage, which described the soil and the size of the garden. Shira read the whole text, noticed that the last paragraph explained how the garden taught pupils responsibility and reduced waste in the canteen, and wrote that as her summary. The examiner later told the class that the first sentences had been only background.',
                passageHe: '',
                questionEn: 'Why did the summary of Shira earn higher marks?',
                questionHe: '',
                correct: 'It captured the central message of the whole passage.',
                wrong: [
                  'It was copied from the beginning of the text.',
                  'It described the soil and the size of the garden.',
                  'It was the longest answer in the class.',
                ],
              },
              storyHintEn: 'Where is the central message of a text?',
            },
          },
        },
      },
    ],
  },
];

/** The core-plus pack's grade 12 units: mixed conditionals, then paraphrasing and summarising (the grade's new finale). */
export const CORE_PLUS_GRADE_12_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildHighSchoolGrade('grade-12', UNITS);
