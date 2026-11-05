import { buildMiddleSchoolGrade, MiddleSchoolUnitSpec } from './builder';

const units: MiddleSchoolUnitSpec[] = [
  {
    titleEn: 'Unit 1: Seoul Café & Daily Vibes',
    titleHe: 'פרק 1: בית הקפה בסיאול ושגרת היומיום',
    subtitleHe: 'Present Simple, ביטויי זמן ואוצר מילים Band II לחיי חברה ובית ספר',
    badgeEmoji: '🧋',
    missions: [
      {
        icon: '💌',
        titleEn: 'Group Chat Introductions',
        titleHe: 'היכרות בקבוצת הוואטסאפ הבינלאומית',
        storyHookHe:
          'הצטרפתם לקבוצת יוצרים צעירים מרחבי העולם! בואו נציג את ההרגלים והתחביבים שלנו באנגלית.',
        grammarTopic: 'Present Simple (Affirmative & Time Expressions)',
        skills: ['Present Simple', 'Band II Social Vocab', 'Voice Greeting'],
        sentenceEn: 'My best friend usually designs digital stickers after school.',
        sentenceHe: 'החבר/ה הכי טוב/ה שלי בדרך כלל מעצב/ת מדבקות דיגיטליות אחרי בית הספר.',
        vocab: [
          [
            'usually',
            'adverb',
            'בדרך כלל',
            '⏰',
            'I usually drink iced tea in the afternoon.',
            'אני בדרך כלל שותה תה קר אחר הצהריים.',
          ],
          [
            'creative',
            'adjective',
            'יצירתי / יצירתית',
            '🎨',
            'She has very creative ideas for our project.',
            'יש לה רעיונות יצירתיים מאוד לפרויקט שלנו.',
          ],
          [
            'introduce',
            'verb',
            'להציג (מישהו)',
            '🤝',
            'Let me introduce my new friend from London.',
            'תנו לי להציג את החבר/ה החדש/ה שלי מלונדון.',
          ],
          [
            'schedule',
            'noun',
            'מערכת שעות / לוח זמנים',
            '📅',
            'Our school schedule is busy on Mondays.',
            'מערכת השעות שלנו עמוסה בימי שני.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'rarely', translationHe: 'לעיתים רחוקות' },
            { wordEn: 'chaotic', translationHe: 'מבולגן / כאוטי' },
          ],
          shortSentenceEn: 'My best friend designs stickers.',
          shortSentenceHe: 'החבר/ה הכי טוב/ה שלי מעצב/ת מדבקות.',
          rule: {
            questionEn: 'Complete the sentence: "Mina usually _______ in her studio after school."',
            correct: 'draws',
            wrong: ['draw', 'is drawing'],
            explainHe:
              'ב-Present Simple עבור גוף שלישי יחיד (He / She / It) מוסיפים s או es לפועל (Mina draws).',
            hintHe: 'Mina היא she, ו-usually מראה שגרה. מה קורה לפועל ב-Present Simple עם she?',
          },
          story: {
            passageEn:
              'Mina lives in Seoul and attends middle school. Every afternoon, she connects with young creators in an international chat group. Her friends share digital artwork and discuss their daily schedules. Mina usually shares creative sticker packs that inspire students around the world.',
            passageHe:
              'מינה גרה בסיאול ולומדת בחטיבת ביניים. בכל אחר צהריים, היא מתחברת עם יוצרים צעירים בקבוצת צ׳אט בינלאומית. החברים שלה משתפים יצירות דיגיטליות ומשוחחים על מערכת השעות היומית שלהם. מינה בדרך כלל משתפת חבילות מדבקות יצירתיות שנותנות השראה לתלמידים ברחבי העולם.',
            questionEn: 'What does Mina usually share in the international group chat?',
            questionHe: 'מה מינה בדרך כלל משתפת בקבוצת הצ׳אט הבינלאומית?',
            correct: 'Creative digital sticker packs she designs.',
            wrong: ['Weekly math examination answers.', 'Cooking recipes from local restaurants.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'My cousin plays chess.',
                wrong: ['My cousin play chess.'],
                explainHe: 'עם My cousin (כמו he / she) מוסיפים s לפועל: plays.',
                hintHe: 'My cousin הוא אדם אחד. מה קורה לפועל ב-Present Simple עם he / she?',
              },
              story: {
                passageEn: 'Dana likes music. She plays the piano every day. Her sister listens.',
                passageHe: 'דנה אוהבת מוזיקה. היא מנגנת בפסנתר כל יום. אחותה מקשיבה.',
                questionEn: 'Who plays the piano every day?',
                questionHe: 'מי מנגנת בפסנתר כל יום?',
                correct: 'Dana.',
                wrong: ['Her sister.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['suddenly', 'nearly'],
                ['noisy', 'muddy'],
                ['arrive', 'complain'],
                ['uniform', 'homework'],
              ],
            },
            master: {
              sentenceEn: 'My cousin from Haifa usually cooks spicy noodles for his family on Saturdays.',
              sentenceHe: 'בן הדוד שלי מחיפה בדרך כלל מבשל אטריות חריפות למשפחה שלו בשבתות.',
              decoys: ['cook', 'cooking'],
              voiceEn: 'My sister reads comics on the bus.',
              voiceHe: 'אחותי קוראת קומיקס באוטובוס.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Maya usually walks to the studio with her sister.',
                wrong: [
                  'Maya usually walk to the studio with her sister.',
                  'Maya usually is walking to the studio with her sister.',
                  'Maya usually walkes to the studio with her sister.',
                ],
                explainHe: 
                  'ב-Present Simple עם she מוסיפים s לפועל (walks). לא משתמשים ב-is + ing כשמדברים על הרגל, ופועל שנגמר ב-k מקבל s בלבד.',
                hintEn: 'Check the verb ending and the helping verb.',
              },
              story: {
                passageEn: 
                  'Every morning, Ido wakes up before his brothers and checks his weekly schedule on the fridge. He rarely forgets anything, but last Tuesday he left his sports bag at home. His coach was not angry. She only asked him to bring two bags the next day, one for training and one for emergencies. Since then, Ido writes a small list every night and puts it on his bag.',
                passageHe: '',
                questionEn: 'Why does Ido write a list every night now?',
                questionHe: '',
                correct: 'He does not want to forget his things again.',
                wrong: [
                  'His coach asked him to write a long story.',
                  'He wants to wake up later than his brothers.',
                  'His brothers copy his weekly schedule.',
                ],
              },
              storyHintEn: 'Think about what happened last Tuesday.',
            },
          },
        },
      },
      {
        icon: '🥐',
        titleEn: 'Café Menu & Secret Questions',
        titleHe: 'תפריט בית הקפה ושאלות הסקרנות',
        storyHookHe:
          'איך שואלים שאלות ב-Present Simple בלי להתבלבל בין Do ל-Does? משימת בלשות בבית הקפה!',
        grammarTopic: 'Present Simple (Negatives & Questions: Do / Does)',
        skills: ['Do vs. Does', 'Don’t / Doesn’t', 'Question Word Order'],
        sentenceEn: 'Does this café serve strawberry matcha on weekends?',
        sentenceHe: 'האם בית הקפה הזה מגיש מאצ׳ה תות בסופי שבוע?',
        vocab: [
          [
            'prefer',
            'verb',
            'להעדיף',
            '☕',
            'Do you prefer sweet or salty snacks?',
            'האם את/ה מעדיף/ה חטיפים מתוקים או מלוחים?',
          ],
          [
            'recommend',
            'verb',
            'להמליץ',
            '💡',
            'Which song do you recommend for our video?',
            'על איזה שיר את/ה ממליץ/ה לסרטון שלנו?',
          ],
          [
            'delicious',
            'adjective',
            'טעים מאוד',
            '🥐',
            'These warm croissants smell delicious!',
            'הקרואסונים החמים האלה מריחים טעים מאוד!',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'reject', translationHe: 'לדחות / לסרב' },
            { wordEn: 'bland', translationHe: 'תפל / חסר טעם' },
          ],
          shortSentenceEn: 'Does this café serve matcha?',
          shortSentenceHe: 'האם בית הקפה הזה מגיש מאצ׳ה?',
          rule: {
            questionEn: 'Which question correctly uses Do or Does?',
            correct: 'Does your sister prefer iced tea?',
            wrong: ['Do your sister prefer iced tea?', 'Does your sister prefers iced tea?'],
            explainHe:
              'בשאלות עבור He / She / It משתמשים ב-Does, והפועל הראשי חוזר לצורת הבסיס שלו ללא s (Does your sister prefer).',
            hintHe: 'your sister היא she: שואלים עם פועל העזר של גוף שלישי, ואז הפועל הראשי בלי סיומת.',
          },
          story: {
            passageEn:
              'On Saturday mornings, students gather at the Cozy Bean Café near Hongdae Station. The bakery serves warm cinnamon rolls and iced berry drinks. Customers often ask the barista which drink she recommends, and she always suggests the house iced matcha.',
            passageHe:
              'בימי שבת בבוקר, תלמידים מתאספים בבית הקפה ״קוזי בין״ ליד תחנת הונגדה. המאפייה מגישה לחמניות קינמון חמות ומשקאות פירות יער קרים. לקוחות שואלים לעיתים קרובות את הבריסטה על איזה משקה היא ממליצה, והיא תמיד מציעה את המאצ׳ה הקרה המיוחדת של המקום.',
            questionEn: 'Which beverage does the barista always recommend?',
            questionHe: 'על איזה משקה ממליצה הבריסטה תמיד?',
            correct: 'The house iced matcha.',
            wrong: ['Hot black coffee without sugar.', 'Bottled tap water only.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'Do they like tea?',
                wrong: ['Does they like tea?'],
                explainHe: 'עם they משתמשים ב-Do. את Does שומרים ל-he / she / it.',
                hintHe: 'they הוא רבים. איזה פועל עזר מתאים לרבים?',
              },
              story: {
                passageEn: 
                  'Gil works at a café. He makes juice and coffee. Customers like his orange juice.',
                passageHe: 'גיל עובד בבית קפה. הוא מכין מיץ וקפה. הלקוחות אוהבים את מיץ התפוזים שלו.',
                questionEn: 'What do customers like?',
                questionHe: 'מה הלקוחות אוהבים?',
                correct: 'His orange juice.',
                wrong: ['His tea.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['forget', 'imagine'],
                ['arrive', 'complain'],
                ['crunchy', 'noisy'],
              ],
            },
            master: {
              sentenceEn: 
                'Does your older brother usually order a large fruit smoothie after football practice?',
              sentenceHe: 'האם אחיך הגדול מזמין בדרך כלל שייק פירות גדול אחרי אימון כדורגל?',
              decoys: ['do', 'orders'],
              voiceEn: 'What does she recommend for lunch?',
              voiceHe: 'מה היא ממליצה לארוחת צהריים?',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Does the barista recommend the cold coffee every day?',
                wrong: [
                  'Do the barista recommend the cold coffee every day?',
                  'Does the barista recommends the cold coffee every day?',
                  'Is the barista recommend the cold coffee every day?',
                ],
                explainHe: 
                  'בשאלה עם he / she / it משתמשים ב-Does, והפועל הראשי נשאר בצורת בסיס בלי s: Does the barista recommend.',
                hintEn: 'Check the helping verb and the main verb ending.',
              },
              story: {
                passageEn: 
                  'Last weekend, Lea visited a new café near her school. The menu was long, but she asked the waiter what he recommends. He smiled and said that every customer who tries the pistachio cake comes back the next day. Lea ordered a small piece. After the first bite, she did not say a word. She just asked for a second piece, and then she booked a table for her friends.',
                passageHe: '',
                questionEn: 'Why did Lea book a table for her friends?',
                questionHe: '',
                correct: 'She liked the cake and wanted to share it.',
                wrong: [
                  'The waiter asked her to leave the café.',
                  'The menu was too long to read alone.',
                  'She wanted to learn how to bake a cake.',
                ],
              },
              storyHintEn: 'Look at what Lea did after the first bite.',
            },
          },
        },
      },
      {
        icon: '🎀',
        isBoss: true,
        titleEn: 'Boss: The Aesthetic Vlog Script',
        titleHe: 'בוס: תסריט הוולוג המושלם — אתגר אנסין',
        storyHookHe:
          'משימת סיכום פרק 1! קראו קטע Unseen קצר על ולוגרית מסיאול ופתרו את השאלות כדי לזכות בכתר היהלומים!',
        grammarTopic: 'Unit 1 Boss: Unseen Reading + Present Simple Mastery',
        skills: ['Unseen Comprehension', 'Present Simple Boss', 'Voice Challenge'],
        sentenceEn: 'Every Friday, Hana films a cozy study vlog and shares tips with her followers.',
        sentenceHe: 'בכל יום שישי, האנה מצלמת וולוג למידה נעים ומשתפת טיפים עם העוקבים שלה.',
        vocab: [
          [
            'audience',
            'noun',
            'קהל / צופים',
            '👥',
            'Her audience loves the calm music in her videos.',
            'הקהל שלה אוהב את המוזיקה הרגועה בסרטונים שלה.',
          ],
          [
            'inspire',
            'verb',
            'לתת השראה',
            '✨',
            'Good stories inspire people to learn new languages.',
            'סיפורים טובים נותנים לאנשים השראה ללמוד שפות חדשות.',
          ],
          [
            'achieve',
            'verb',
            'להשיג (מטרה)',
            '🎯',
            'You can achieve your goals when you practice daily.',
            'אפשר להשיג את המטרות כשמתרגלים מדי יום.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'neglect', translationHe: 'להזניח' },
            { wordEn: 'discourage', translationHe: 'לייאש' },
          ],
          shortSentenceEn: 'Hana films a cozy vlog.',
          shortSentenceHe: 'האנה מצלמת וולוג נעים.',
          rule: {
            questionEn: 'Which sentence correctly expresses a weekly routine?',
            correct: 'Hana always edits her videos on Friday evenings.',
            wrong: [
              'Hana is always edit her videos on Friday evenings.',
              'Hana always editing her videos on Friday evenings.',
            ],
            explainHe:
              'לתיאור פעולה שגרתית קבועה (שקרתה, קורית ותקרה שוב) משתמשים ב-Present Simple בתוספת s בגוף שלישי (Hana edits).',
            hintHe: 'always ו-on Friday evenings מראים שגרה. איזה זמן מתאים לשגרה, ומה מוסיפים לפועל עם she?',
          },
          story: {
            passageEn:
              'Hana is a twelve-year-old student who creates aesthetic study vlogs in Seoul. Every Friday afternoon, she cleans her wooden desk, brews green tea, and sets up her camera. Her international audience tunes in to study alongside her in silence. Her videos inspire thousands of middle school students to organize their schedules and study peacefully.',
            passageHe:
              'האנה היא תלמידה בת שתים-עשרה שיוצרת ולוגים אסתטיים של למידה בסיאול. בכל יום שישי אחר הצהריים, היא מנקה את שולחן העץ שלה, מכינה תה ירוק ומעמידה את המצלמה. הקהל הבינלאומי שלה מתחבר כדי ללמוד לצידה בדממה. הסרטונים שלה נותנים השראה לאלפי תלמידי חטיבת ביניים לארגן את לוח הזמנים שלהם וללמוד ברוגע.',
            questionEn: 'Why do thousands of middle school students watch Hana\'s videos?',
            questionHe: 'מדוע אלפי תלמידי חטיבת ביניים צופים בסרטונים של האנה?',
            correct: 'To study alongside her in silence and organize their schedules peacefully.',
            wrong: ['To learn extreme skateboarding stunts.', 'To purchase expensive computer monitors.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'Hana films videos.',
                wrong: ['Hana film videos.'],
                explainHe: 'עם Hana (she) מוסיפים s לפועל ב-Present Simple: films.',
                hintHe: 'Hana היא she. מה מוסיפים לפועל כדי לספר על הרגל?',
              },
              story: {
                passageEn: 
                  'Hana makes a video each week. She shows her desk and her books. Many students watch it.',
                passageHe: 
                  'חנה מכינה סרטון בכל שבוע. היא מראה את השולחן והספרים שלה. תלמידים רבים צופים בו.',
                questionEn: 'What does Hana show in her video?',
                questionHe: 'מה חנה מראה בסרטון שלה?',
                correct: 'Her desk and her books.',
                wrong: ['Her dog and her bike.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['microphone', 'studio'],
                ['prevent', 'confuse'],
                ['spend', 'pay'],
              ],
            },
            master: {
              sentenceEn: 
                'After school Hana usually edits her videos while her little brother does his homework.',
              sentenceHe: 
                'אחרי בית הספר חנה בדרך כלל עורכת את הסרטונים שלה בזמן שאחיה הקטן עושה שיעורי בית.',
              decoys: ['edit', 'doing'],
              voiceEn: 'Many students study with her every evening.',
              voiceHe: 'הרבה תלמידים לומדים איתה כל ערב.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Hana edits her videos on Friday and shares them with fans.',
                wrong: [
                  'Hana edit her videos on Friday and shares them with fans.',
                  'Hana edits her videos on Friday and share them with fans.',
                  'Hana is edits her videos on Friday and shares them with fans.',
                ],
                explainHe: 
                  'עם Hana (she) כל פועל ב-Present Simple מקבל s: edits ו-shares. אחרי is לא בא פועל בלי ing.',
                hintEn: 'Check every verb in the sentence, not only the first.',
              },
              story: {
                passageEn: 
                  'Sam started his study channel only three months ago. At first, almost nobody watched, and he nearly stopped after the second week. Then a girl from Canada wrote a comment saying that his calm videos helped her finish her exams. Sam read the message twice and smiled. That evening, he made a new schedule for the channel and promised himself to post every Friday.',
                passageHe: '',
                questionEn: 'What made Sam continue with his channel?',
                questionHe: '',
                correct: 'A kind comment from a viewer gave him new energy.',
                wrong: [
                  'His teacher paid him to keep posting videos.',
                  'Millions of people watched from the first day.',
                  'He wanted to become famous in Canada.',
                ],
              },
              storyHintEn: 'Think about the message from Canada.',
            },
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 2: Backstage Studio & Live Vlogs',
    titleHe: 'פרק 2: מאחורי הקלעים בשידור חי',
    subtitleHe: 'Present Progressive מול Present Simple, פעלי מצב (Stative Verbs) ואוצר מילים של מוזיקה ומדיה',
    badgeEmoji: '🎧',
    missions: [
      {
        icon: '⚡',
        titleEn: 'Right Now vs. Every Day at the Studio',
        titleHe: 'מה קורה עכשיו לעומת הרגלים קבועים',
        storyHookHe:
          'הלהקה מתאמנת להופעה ממש עכשיו! בואו נלמד מתי משתמשים ב-am/is/are + ing ומתי ב-Present Simple.',
        grammarTopic: 'Present Progressive vs. Present Simple',
        skills: ['Present Progressive vs. Simple', 'Band II Vocab', 'Voice & Chat'],
        sentenceEn: 'Usually Noa takes the bus, but today she is walking to the studio with her friends.',
        sentenceHe: 'בדרך כלל נועה נוסעת באוטובוס, אבל היום היא הולכת ברגל לסטודיו עם חבריה.',
        vocab: [
          [
            'practice',
            'verb',
            'להתאמן / אימון',
            '💃',
            'They are practicing their new dance routine right now.',
            'הם מתאמנים על הריקוד החדש שלהם ממש עכשיו.',
          ],
          [
            'perform',
            'verb',
            'להופיע',
            '🎤',
            'The band performs on the main stage every summer.',
            'הלהקה מופיעה על הבמה המרכזית כל קיץ.',
          ],
          [
            'excited',
            'adjective',
            'נרגש / נרגשת',
            '🤩',
            'We are so excited about tonight’s concert!',
            'אנחנו כל כך נרגשים לקראת ההופעה הערב!',
          ],
          [
            'currently',
            'adverb',
            'כרגע / בימים אלו',
            '⚡',
            'She is currently recording a new song in the studio.',
            'היא מקליטה כרגע שיר חדש באולפן.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'ignore', translationHe: 'להתעלם' },
            { wordEn: 'bored', translationHe: 'משועמם / משועממת' },
          ],
          shortSentenceEn: 'She is walking to the studio.',
          shortSentenceHe: 'היא הולכת ברגל לסטודיו.',
          rule: {
            questionEn: 'Which sentence correctly shows an action happening RIGHT NOW?',
            correct: 'Look! The guitarist is tuning his instrument right now.',
            wrong: [
              'Look! The guitarist tunes his instrument right now.',
              'Look! The guitarist is tune his instrument right now.',
            ],
            explainHe:
              'לפעולה המתרחשת ממש ברגע זה (right now, look, listen) משתמשים ב-Present Progressive: am / is / are בתוספת הפועל עם ing.',
            hintHe: 'Look! ו-right now מראים שזה קורה עכשיו. צריך צורה של be וגם פועל עם ing.',
          },
          story: {
            passageEn:
              'The Starlight Band performs on big stages every summer. However, tonight is special! Right now, the musicians are standing backstage and checking their microphones because the live stream starts in ten minutes. Usually Noa feels calm, but today her heart is beating fast with excitement.',
            passageHe:
              'להקת Starlight מופיעה על במות גדולות בכל קיץ. עם זאת, הערב מיוחד! ממש עכשיו, המוזיקאים עומדים מאחורי הקלעים ובודקים את המיקרופונים שלהם מכיוון שהשידור החי מתחיל בעוד עשר דקות. בדרך כלל נועה מרגישה רגועה, אך היום ליבה פועם במהירות מהתרגשות.',
            questionEn: 'What are the musicians doing backstage right now?',
            questionHe: 'מה עושים המוזיקאים מאחורי הקלעים ממש עכשיו?',
            correct: 'Checking their microphones before the broadcast starts.',
            wrong: ['Sleeping in their hotel rooms.', 'Packing their luggage for vacation.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'The dog is running now.',
                wrong: ['The dog runs now.'],
                explainHe: 'now מראה פעולה שקורית ברגע זה, ולכן am / is / are + ing: is running.',
                hintHe: 'המילה now אומרת שזה קורה עכשיו. איזו צורה מראה פעולה עכשווית?',
              },
              story: {
                passageEn: 'It is Monday. Ron is at the studio. He is playing the drums now.',
                passageHe: 'יום שני. רון נמצא באולפן. הוא מנגן עכשיו בתופים.',
                questionEn: 'What is Ron playing now?',
                questionHe: 'במה רון מנגן עכשיו?',
                correct: 'The drums.',
                wrong: ['The guitar.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['drink', 'wear'],
                ['collect', 'invent'],
                ['tired', 'famous'],
                ['recently', 'previously'],
              ],
            },
            master: {
              sentenceEn: 'Usually Dana sings alone but today she is rehearsing with the whole choir.',
              sentenceHe: 'בדרך כלל דנה שרה לבד אבל היום היא מתאמנת עם המקהלה כולה.',
              decoys: ['sing', 'rehearses'],
              voiceEn: 'The drummer is warming up right now.',
              voiceHe: 'המתופף מתחמם ממש עכשיו.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Listen! The singers are warming up on the stage now.',
                wrong: [
                  'Listen! The singers warm up on the stage now.',
                  'Listen! The singers is warming up on the stage now.',
                  'Listen! The singers are warm up on the stage now.',
                ],
                explainHe: 
                  'Listen ו-now מראים פעולה שקורית עכשיו: am / is / are + ing. singers הם רבים, ולכן are warming.',
                hintEn: 'Look at the helping verb and the verb ending.',
              },
              story: {
                passageEn: 
                  'Tomer plays the trumpet in the school band. Normally, he practices alone in his room. Today, however, the whole band is standing on the stage and the principal is sitting in the first row. Tomer’s hands are shaking a little, and he keeps looking at the sheet of music. His teacher whispers, "Breathe, and just play."',
                passageHe: '',
                questionEn: 'How does Tomer feel at the moment?',
                questionHe: '',
                correct: 'Nervous, because an important guest is watching.',
                wrong: [
                  'Bored, because he plays alone every day.',
                  'Angry, because the band started without him.',
                  'Happy, because he finished the music early.',
                ],
              },
              storyHintEn: 'Think about his shaking hands.',
            },
          },
        },
      },
      {
        icon: '🎤',
        titleEn: 'Stative Verbs Secret Code',
        titleHe: 'הצופן הסודי של פעלי הרגש והמחשבה',
        storyHookHe:
          'למה אי אפשר להגיד "I am knowing"? גלו את הסוד של Stative Verbs שכל תלמיד/ת כיתה ז׳ חייב/ת להכיר!',
        grammarTopic: 'Stative Verbs (know, believe, remember, need, prefer)',
        skills: ['Stative Verbs', 'Error Detective', 'Voice Pronunciation'],
        sentenceEn: 'Even though everyone is shouting right now, I remember all the lyrics!',
        sentenceHe: 'למרות שכולם צועקים ממש עכשיו, אני זוכר/ת את כל מילות השיר!',
        vocab: [
          [
            'remember',
            'verb',
            'לזכור',
            '🧠',
            'Do you remember the password to the studio tablet?',
            'האם את/ה זוכר/ת את הסיסמה לטאבלט של האולפן?',
          ],
          [
            'believe',
            'verb',
            'להאמין',
            '💫',
            'I believe our team can win the competition!',
            'אני מאמין/ה שהצוות שלנו יכול לנצח בתחרות!',
          ],
          [
            'belong',
            'verb',
            'להיות שייך ל-',
            '🏷️',
            'This pink microphone belongs to the lead singer.',
            'המיקרופון הוורוד הזה שייך לזמר/ת הראשי/ת.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'forget', translationHe: 'לשכוח' },
            { wordEn: 'doubt', translationHe: 'להטיל ספק' },
          ],
          shortSentenceEn: 'I remember all the lyrics.',
          shortSentenceHe: 'אני זוכר/ת את כל המילים.',
          rule: {
            questionEn: 'Which sentence with a Stative Verb is grammatically correct?',
            correct: 'I understand the secret instructions now.',
            wrong: [
              'I am understanding the secret instructions now.',
              'I am knowing the secret instructions now.',
            ],
            explainHe:
              'פעלי מצב, רגש והבנה (understand, know, believe, want, need) אינם מקבלים צורת ing גם כאשר הפעולה מתרחשת עכשיו.',
            hintHe: 'פעלי הבנה וידיעה הם פעלי מצב. האם פעלי מצב מקבלים ing, גם כשמדברים על עכשיו?',
          },
          story: {
            passageEn:
              'Inside the sound booth, the music plays loudly. While the technician is adjusting the volume dials, Noa listens attentively. She understands every harmony and believes this song will inspire young listeners across the world.',
            passageHe:
              'בתוך תא ההקלטה, המוזיקה מתנגנת בעוצמה. בעוד הטכנאי מכוונן את חוגות עוצמת הקול, נועה מקשיבה בתשומת לב. היא מבינה כל הרמוניה ומאמינה שהשיר הזה ייתן השראה למאזינים צעירים ברחבי העולם.',
            questionEn: 'Why is Noa confident about the new song?',
            questionHe: 'מדוע נועה בטוחה לגבי השיר החדש?',
            correct: 'She understands its harmonies and believes in its inspiring message.',
            wrong: ['She plans to sell the microphone immediately.', 'The technician told her to turn off the music.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'I know the song.',
                wrong: ['I am knowing the song.'],
                explainHe: 'know הוא פועל מצב, ולכן לא מוסיפים לו ing.',
                hintHe: 'לדעת משהו זה מצב ולא פעולה. האם פועל כזה מקבל ing?',
              },
              story: {
                passageEn: 'Lia has a red bag. She likes the bag. It belongs to her sister.',
                passageHe: 'לליה יש תיק אדום. היא אוהבת את התיק. הוא שייך לאחותה.',
                questionEn: 'Who does the bag belong to?',
                questionHe: 'למי התיק שייך?',
                correct: 'Her sister.',
                wrong: ['Her teacher.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['imagine', 'celebrate'],
                ['enjoy', 'decide'],
                ['swallow', 'swim'],
              ],
            },
            master: {
              sentenceEn: 'I believe this blue guitar belongs to my uncle because I remember the sticker.',
              sentenceHe: 'אני מאמין/ה שהגיטרה הכחולה הזאת שייכת לדוד שלי כי אני זוכר/ת את המדבקה.',
              decoys: ['believing', 'remembers'],
              voiceEn: 'We need a bigger microphone today.',
              voiceHe: 'אנחנו צריכים מיקרופון גדול יותר היום.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Right now I understand why my brother loves this song.',
                wrong: [
                  'Right now I am understanding why my brother loves this song.',
                  'Right now I understand why my brother is loving this song.',
                  'Right now I understand why my brother love this song.',
                ],
                explainHe: 
                  'understand ו-love הם פעלי מצב ולכן לא מקבלים ing, גם עם right now. עם my brother (he) מוסיפים s: loves.',
                hintEn: 'Which verbs describe feelings or thoughts, not actions?',
              },
              story: {
                passageEn: 
                  'Yael found a silver ring under the bench in the school yard. She believed it belonged to someone in her class, because it had a small letter inside. She remembered that Dana wore a similar ring last winter, but Dana said it was not hers. On Friday, Yael put a note on the board. Before the lesson ended, a quiet boy from the next class came and described the ring perfectly.',
                passageHe: '',
                questionEn: 'How did Yael know the ring was really his?',
                questionHe: '',
                correct: 'He described it exactly without seeing it again.',
                wrong: [
                  'Dana told the teacher that he was the owner.',
                  'He found the note on the board and took it.',
                  'His whole name was written inside the ring.',
                ],
              },
              storyHintEn: 'Think about what the boy said about the ring.',
            },
          },
        },
      },
      {
        icon: '🌟',
        isBoss: true,
        titleEn: 'Boss: Live Concert Unseen',
        titleHe: 'בוס: שידור חי מההופעה — אתגר אנסין',
        storyHookHe:
          'סיכום פרק 2! קראו את הראיון החי מאחורי הקלעים, שלבו בין שני זמני ההווה וזכו בתיבת יהלומים כפולה!',
        grammarTopic: 'Unit 2 Boss: Present Simple vs. Progressive + Stative Verbs',
        skills: ['Unseen Interview', 'Tense Mastery', 'Voice Fluency'],
        sentenceEn: 'The lights are shining brightly, and the crowd knows every word of the song!',
        sentenceHe: 'האורות זורחים בעוצמה, והקהל מכיר כל מילה בשיר!',
        vocab: [
          [
            'atmosphere',
            'noun',
            'אווירה',
            '🌌',
            'The atmosphere at the concert is magical tonight.',
            'האווירה בהופעה קסומה הערב.',
          ],
          [
            'nervous',
            'adjective',
            'לחוץ / מתוח',
            '💓',
            'She feels a little nervous before she goes on stage.',
            'היא מרגישה קצת לחוצה לפני שהיא עולה לבמה.',
          ],
          [
            'celebrate',
            'verb',
            'לחגוג',
            '🎉',
            'We are celebrating our band’s first anniversary today!',
            'אנחנו חוגגים היום שנה להקמת הלהקה שלנו!',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'gloom', translationHe: 'קדרות / עגמומיות' },
            { wordEn: 'mourn', translationHe: 'להתאבל' },
          ],
          shortSentenceEn: 'The lights are shining brightly.',
          shortSentenceHe: 'האורות זורחים בעוצמה.',
          rule: {
            questionEn: 'Choose the correct pair: "Right now the band _______, and fans _______."',
            correct: 'is performing / love the music',
            wrong: [
              'performs / are loving the music',
              'is perform / is loving the music',
            ],
            explainHe:
              'הופעה היא פעולה המתרחשת כרגע (is performing ב-Progressive), ואילו אהבה היא פועל מצב/רגש שאינו מקבל ing (love).',
            hintHe: 'שני חלקים: הופעה היא פעולה שקורית עכשיו, ואהבה היא רגש (פועל מצב). איזה מהם יכול לקבל ing?',
          },
          story: {
            passageEn:
              'Ten thousand fans fill the city stadium tonight. The stage lights are shining brilliantly in neon colors. Although the lead singer usually feels nervous before major events, she is smiling radiantly right now. The crowd knows every single lyric and sings along in perfect unison.',
            passageHe:
              'עשרת אלפים מעריצים ממלאים את אצטדיון העיר הערב. אורות הבמה זוהרים בצבעי ניאון מרהיבים. אף על פי שהזמרת הראשית בדרך כלל מרגישה לחוצה לפני אירועים גדולים, היא מחייכת בחיוך קורן ממש עכשיו. הקהל מכיר כל שורת מילים ושר יחד בתיאום מושלם.',
            questionEn: 'How does the crowd participate during the live concert?',
            questionHe: 'כיצד הקהל משתתף במהלך ההופעה החיה?',
            correct: 'By singing along to every lyric in unison.',
            wrong: ['By leaving the stadium in complete silence.', 'By demanding the lights be switched off.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'The band is playing now.',
                wrong: ['The band plays now.'],
                explainHe: 'now מראה פעולה שקורית ברגע זה, ולכן is playing.',
                hintHe: 'המילה now מצביעה על הרגע הזה. איזה פועל עזר מתאים ל-band?',
              },
              story: {
                passageEn: 'The band is on stage. The fans are singing. Everyone is happy.',
                passageHe: 'הלהקה על הבמה. המעריצים שרים. כולם שמחים.',
                questionEn: 'Who is singing?',
                questionHe: 'מי שר?',
                correct: 'The fans.',
                wrong: ['The teacher.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['ticket', 'row'],
                ['crowded', 'popular'],
                ['decorate', 'bake'],
              ],
            },
            master: {
              sentenceEn: 
                'The crowd is cheering loudly because everybody knows the chorus of this famous song.',
              sentenceHe: 'הקהל מריע בקול רם כי כולם מכירים את הפזמון של השיר המפורסם הזה.',
              decoys: ['cheer', 'knowing'],
              voiceEn: 'Everyone is waving at the lead singer.',
              voiceHe: 'כולם מנופפים לזמר הראשי.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The fans are dancing and they love every song tonight.',
                wrong: [
                  'The fans are dancing and they are loving every song tonight.',
                  'The fans is dancing and they love every song tonight.',
                  'The fans are dance and they love every song tonight.',
                ],
                explainHe: 
                  'tonight מראה פעולה עכשווית: are dancing (fans הם רבים). love הוא פועל מצב ולכן בלי ing.',
                hintEn: 'Check the helping verb, the ing form and the verb of feeling.',
              },
              story: {
                passageEn: 
                  'Backstage, Roni was walking in circles. Her song was next, and the audience was louder than she expected. Her friend handed her a cup of water and said nothing. Roni closed her eyes, counted to ten, and remembered her first concert in the school hall, when only twelve people clapped. Then the announcer called her name, and she walked toward the light with a small smile.',
                passageHe: '',
                questionEn: 'Why did Roni smile before she went on stage?',
                questionHe: '',
                correct: 'Remembering her small first concert made her calmer.',
                wrong: [
                  'Her friend promised to sing the song with her.',
                  'The audience became quiet when the light turned on.',
                  'She decided to sing a different song instead.',
                ],
              },
              storyHintEn: 'Think about what she remembered.',
            },
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 3: London Mystery Diary',
    titleHe: 'פרק 3: יומן התעלומה בלונדון',
    subtitleHe: 'Past Simple (פעלים רגילים ויוצאי דופן V2), שאלות עם Did ופענוח רמזים',
    badgeEmoji: '🕵️‍♀️',
    missions: [
      {
        icon: '🗝️',
        titleEn: 'The Hidden Clue at the Museum',
        titleHe: 'הרמז הנסתר במוזיאון הבריטי',
        storyHookHe:
          'אתמול קרה משהו מסתורי בטיול בלונדון! תרגלו פעלים בזמן עבר (Past Simple) כדי לפענח מה קרה.',
        grammarTopic: 'Past Simple (Regular & Irregular Verbs V2)',
        skills: ['Past Simple V2', 'Irregular Verbs', 'Story Detective'],
        sentenceEn: 'Yesterday we visited the museum and found a golden compass.',
        sentenceHe: 'אתמול ביקרנו במוזיאון ומצאנו מצפן מוזהב.',
        vocab: [
          [
            'discover',
            'verb',
            'לגלות',
            '🗝️',
            'They discovered a secret message behind the painting.',
            'הם גילו הודעה סודית מאחורי הציור.',
          ],
          [
            'suddenly',
            'adverb',
            'פתאום / לפתע',
            '⚡',
            'Suddenly, the lights in the hall went out.',
            'פתאום, האורות באולם כבו.',
          ],
          [
            'disappear',
            'verb',
            'להיעלם',
            '🌫️',
            'The mysterious guide disappeared into the crowd.',
            'המדריך המסתורי נעלם בתוך הקהל.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'conceal', translationHe: 'להסתיר' },
            { wordEn: 'arrive', translationHe: 'להגיע' },
          ],
          shortSentenceEn: 'We found a golden compass.',
          shortSentenceHe: 'מצאנו מצפן מוזהב.',
          rule: {
            questionEn: 'Which is the correct Past Simple form of the irregular verb "find"?',
            correct: 'found',
            wrong: ['finded', 'was find'],
            explainHe:
              'הפועל find הוא פועל בלתי רגיל (irregular verb), וצורת העבר (V2) שלו היא found ולא finded.',
            hintHe: 'find הוא פועל לא רגיל: לא מוסיפים לו ed, ובעבר הפשוט לא צריך להגיד was לפניו.',
          },
          story: {
            passageEn:
              'Yesterday afternoon, Noa and her friends visited the British Museum in London. While admiring an ancient clock exhibit, they discovered a small wooden compartment. Inside lay a golden compass that pointed directly toward the Tower of London.',
            passageHe:
              'אתמול אחר הצהריים, נועה וחברותיה ביקרו במוזיאון הבריטי בלונדון. בעודן מתפעלות מתצוגת שעונים עתיקים, הן גילו תא עץ קטן. בפנים שכב מצפן מוזהב שהצביע ישירות לעבר מצודת לונדון.',
            questionEn: 'Where did the mysterious compass point?',
            questionHe: 'לאן הצביע המצפן המסתורי?',
            correct: 'Directly toward the Tower of London.',
            wrong: ['Toward the subway entrance.', 'Toward the museum gift shop.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'We went to the park.',
                wrong: ['We goed to the park.'],
                explainHe: 'go הוא פועל יוצא דופן: צורת העבר שלו היא went ולא goed.',
                hintHe: 'האם go מקבל ed בעבר? זכרו שיש פעלים עם צורת עבר מיוחדת.',
              },
              story: {
                passageEn: 'Last Sunday, Eli went to a museum. He saw an old map. He took a photo of it.',
                passageHe: 'ביום ראשון שעבר אלי הלך למוזיאון. הוא ראה מפה ישנה. הוא צילם אותה.',
                questionEn: 'What did Eli take a photo of?',
                questionHe: 'את מה אלי צילם?',
                correct: 'An old map.',
                wrong: ['A big clock.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['bake', 'follow'],
                ['carefully', 'politely'],
                ['arrive', 'count'],
              ],
            },
            master: {
              sentenceEn: 'Last night we followed a strange noise and found a key under the stairs.',
              sentenceHe: 'אתמול בלילה עקבנו אחרי רעש מוזר ומצאנו מפתח מתחת למדרגות.',
              decoys: ['finded', 'follow'],
              voiceEn: 'We ran out of the dark room.',
              voiceHe: 'רצנו אל מחוץ לחדר החשוך.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The thief ran down the stairs and dropped a silver coin.',
                wrong: [
                  'The thief runned down the stairs and dropped a silver coin.',
                  'The thief ran down the stairs and drop a silver coin.',
                  'The thief was ran down the stairs and dropped a silver coin.',
                ],
                explainHe: 
                  'run הוא פועל יוצא דופן: ran ולא runned. כל הפעלים בסיפור על העבר צריכים להיות בעבר: dropped. אחרי was לא באה צורת עבר.',
                hintEn: 'Check each verb: is it a real past form?',
              },
              story: {
                passageEn: 
                  'Noam arrived at the old library early in the morning. The door was open, which was strange because the guard always came at nine. Inside, a book lay on the floor and a window was broken. Noam did not touch anything. He took out his phone, called his uncle who works with the police, and waited outside. When the officers arrived, they asked him only one question.',
                passageHe: '',
                questionEn: 'Why did Noam wait outside the library?',
                questionHe: '',
                correct: 'He thought something bad happened and stayed away.',
                wrong: [
                  'The guard told him to stay in the street.',
                  'He wanted to read a book in the sun.',
                  'The library was closed until nine.',
                ],
              },
              storyHintEn: 'Think about the open door and the broken window.',
            },
          },
        },
      },
      {
        icon: '🔍',
        titleEn: 'Detective Questions: Did & Didn’t',
        titleHe: 'חקירת הבלשים: שאלות ושלילה בעבר',
        storyHookHe:
          'זכרו את כלל הזהב של כיתה ז׳: כשיש Did או Didn’t, הפועל חוזר לצורת הבסיס (V1)! בואו נחקור את העדים.',
        grammarTopic: 'Past Simple Questions & Negatives (Did / Didn’t + Base Verb)',
        skills: ['Did + V1 Rule', 'Didn’t + V1', 'Detective Interview'],
        sentenceEn: 'Did the guard notice anything strange before the diamond vanished?',
        sentenceHe: 'האם השומר הבחין במשהו מוזר לפני שהיהלום נעלם?',
        vocab: [
          [
            'notice',
            'verb',
            'להבחין / לשים לב',
            '👀',
            'I didn’t notice the footprints near the window.',
            'לא שמתי לב לעקבות ליד החלון.',
          ],
          [
            'evidence',
            'noun',
            'ראיה / הוכחה',
            '📜',
            'The young detective found important evidence in the garden.',
            'הבלש/ית הצעיר/ה מצא/ה ראיה חשובה בגינה.',
          ],
          [
            'solve',
            'verb',
            'לפתור (תעלומה / חידה)',
            '🔍',
            'How did you solve the riddle so quickly?',
            'איך פתרת את החידה כל כך מהר?',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'overlook', translationHe: 'להחמיץ / להתעלם' },
            { wordEn: 'confusion', translationHe: 'בלבול' },
          ],
          shortSentenceEn: 'Did the guard notice anything?',
          shortSentenceHe: 'האם השומר הבחין במשהו?',
          rule: {
            questionEn: 'Which question correctly follows the "Did + V1" rule?',
            correct: 'Did you see the footsteps in the courtyard?',
            wrong: [
              'Did you saw the footsteps in the courtyard?',
              'Did you seen the footsteps in the courtyard?',
            ],
            explainHe:
              'במשפטי שאלה ושלילה בעבר עם Did או Didn’t, הפועל העיקרי חוזר תמיד לצורת המקור הבסיסית V1 (see ולא saw).',
            hintHe: 'אחרי Did הפועל הראשי חוזר לצורת הבסיס (V1), כי Did כבר מראה שזה עבר.',
          },
          story: {
            passageEn:
              'Inspector Reed arrived at the museum courtyard at dawn. He questioned the night guard about the mysterious open window. The guard explained that he didn\'t hear any footsteps, but he noticed a blue silk scarf caught on the iron fence.',
            passageHe:
              'המפקח ריד הגיע לחצר המוזיאון עם שחר. הוא תחקר את שומר הלילה לגבי החלון הפתוח המסתורי. השומר הסביר שהוא לא שמע שום צעדים, אך הוא הבחין בצעיף משי כחול שנתפס על גדר הברזל.',
            questionEn: 'What crucial clue did the guard discover on the iron fence?',
            questionHe: 'איזה רמז מכריע גילה השומר על גדר הברזל?',
            correct: 'A blue silk scarf caught on the fence.',
            wrong: ['A dropped set of museum keys.', 'A muddy pair of winter boots.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'Did you see the thief?',
                wrong: ['Did you saw the thief?'],
                explainHe: 'אחרי Did הפועל חוזר לצורת בסיס: Did you see, ולא Did you saw.',
                hintHe: 'ב-Did כבר מסתתר העבר. איזו צורה של הפועל צריכה לבוא אחריו?',
              },
              story: {
                passageEn: 'Mia saw a small box in the garden. She did not open it. She called her dad.',
                passageHe: 'מיה ראתה קופסה קטנה בגינה. היא לא פתחה אותה. היא התקשרה לאבא שלה.',
                questionEn: 'Who did Mia call?',
                questionHe: 'למי מיה התקשרה?',
                correct: 'Her dad.',
                wrong: ['Her aunt.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['sell', 'order'],
                ['weather', 'traffic'],
                ['carry', 'pour'],
              ],
            },
            master: {
              sentenceEn: 
                'Did the detective find any evidence in the garden before the heavy rain started?',
              sentenceHe: 'האם הבלש מצא ראיות כלשהן בגינה לפני שהגשם הכבד התחיל?',
              decoys: ['found', 'finds'],
              voiceEn: 'We did not solve the mystery.',
              voiceHe: 'לא פתרנו את התעלומה.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Did the guard hear any noise before the lights went out?',
                wrong: [
                  'Did the guard heard any noise before the lights went out?',
                  'Was the guard hear any noise before the lights went out?',
                  'Does the guard hear any noise before the lights went out?',
                ],
                explainHe: 
                  'שאלה בעבר: Did + נושא + פועל בצורת בסיס (hear). אחרי Did לא משתמשים ב-heard, ולא מחליפים ב-Was או Does.',
                hintEn: 'After Did, which form of the verb should come?',
              },
              story: {
                passageEn: 
                  'Dana noticed that the cake in the school kitchen was missing. She asked the cook, but he was in the yard all morning. Then she saw tiny crumbs on the floor, leading all the way to the lowest shelf, and a small paw print next to a glass of milk. Dana laughed and called the caretaker, who whispered that the new school cat loved to visit that kitchen.',
                passageHe: '',
                questionEn: 'Who most likely took the cake?',
                questionHe: '',
                correct: 'The new cat from the school.',
                wrong: [
                  'The cook who worked in the yard.',
                  'A student who ate it during class.',
                  'The caretaker who was away all day.',
                ],
              },
              storyHintEn: 'What do the paw print and the milk tell you?',
            },
          },
        },
      },
      {
        icon: '👑',
        isBoss: true,
        titleEn: 'Boss: Sherlock’s Unseen Diary',
        titleHe: 'בוס: היומן האבוד מרחוב בייקר — אתגר אנסין',
        storyHookHe:
          'פיצוח התעלומה בלונדון! קראו את דף היומן העתיק ופתרו את כל שאלות ה-Unseen כדי לזכות בכתר הבלשים!',
        grammarTopic: 'Unit 3 Boss: Past Simple Mastery & Mystery Unseen',
        skills: ['Mystery Unseen', 'Irregular Past Mastery', 'Voice Storyteller'],
        sentenceEn: 'We followed the clues across London and finally solved the mystery!',
        sentenceHe: 'עקבנו אחר הרמזים ברחבי לונדון ולבסוף פתרנו את התעלומה!',
        vocab: [
          [
            'ancient',
            'adjective',
            'עתיק',
            '🏛️',
            'The museum displayed an ancient map of the city.',
            'המוזיאון הציג מפה עתיקה של העיר.',
          ],
          [
            'whisper',
            'verb',
            'ללחוש / לחישה',
            '🤫',
            'She whispered the secret password to her partner.',
            'היא לחשה את הסיסמה הסודית לשותף/ה שלה.',
          ],
          [
            'curious',
            'adjective',
            'סקרן / סקרנית',
            '🧐',
            'Noa was curious about the locked wooden box.',
            'נועה הייתה סקרנית לגבי קופסת העץ הנעולה.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'modern', translationHe: 'מודרני' },
            { wordEn: 'shout', translationHe: 'לצעוק' },
          ],
          shortSentenceEn: 'We followed clues across London.',
          shortSentenceHe: 'עקבנו אחר רמזים ברחבי לונדון.',
          rule: {
            questionEn: 'Choose the sentence with correct irregular past verbs:',
            correct: 'They ran to Baker Street and took the underground train.',
            wrong: [
              'They runned to Baker Street and taked the train.',
              'They were run to Baker Street and did took the train.',
            ],
            explainHe:
              'הפעלים run ו-take הם בלתי רגילים, וצורות העבר הנכונות שלהם הן ran ו-took.',
            hintHe: 'run ו-take הם פעלים לא רגילים: בעבר אין להם ed, ולא צריך להגיד were או did לפניהם.',
          },
          story: {
            passageEn:
              'Near 221B Baker Street, the friends discovered a leather-bound diary hidden inside a hollow brick wall. The yellowed pages contained cryptic riddles written by a Victorian detective. By deciphering the dates and compass bearings, they unlocked a secret iron gate leading to a forgotten underground vault.',
            passageHe:
              'ליד רחוב בייקר 221B, החברים גילו יומן כרוך עור שהוחבא בתוך קיר לבנים חלול. הדפים המצהיבים הכילו חידות מוצפנות שנכתבו על ידי בלש מהתקופה הוויקטוריאנית. על ידי פענוח התאריכים וכיווני המצפן, הם פתחו שער ברזל סודי שהוביל לכספת תת-קרקעית נשכחת.',
            questionEn: 'Where was the leather-bound diary hidden?',
            questionHe: 'היכן הוחבא היומן כרוך העור?',
            correct: 'Inside a hollow brick wall near Baker Street.',
            wrong: ['Under a bench inside Victoria train station.', 'In the deep water of the River Thames.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'They ran to the station.',
                wrong: ['They runned to the station.'],
                explainHe: 'run הוא פועל יוצא דופן: ran ולא runned.',
                hintHe: 'האם run מקבל ed בעבר? יש לו צורת עבר מיוחדת.',
              },
              story: {
                passageEn: 'Sara found a key in the garden. She took it home. It opened an old box.',
                passageHe: 'שרה מצאה מפתח בגינה. היא לקחה אותו הביתה. הוא פתח קופסה ישנה.',
                questionEn: 'What did the key open?',
                questionHe: 'מה המפתח פתח?',
                correct: 'An old box.',
                wrong: ['A red door.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['angry', 'annoyed'],
                ['cough', 'smile'],
                ['famous', 'tired'],
              ],
            },
            master: {
              sentenceEn: 
                'The curious students whispered while their teacher opened the ancient box in the hall.',
              sentenceHe: 'התלמידים הסקרנים לחשו בזמן שהמורה שלהם פתח את הקופסה העתיקה באולם.',
              decoys: ['whisper', 'open'],
              voiceEn: 'The old clock stopped at midnight.',
              voiceHe: 'השעון הישן עצר בחצות.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'We took a taxi to Baker Street and met the detective.',
                wrong: [
                  'We taked a taxi to Baker Street and met the detective.',
                  'We took a taxi to Baker Street and meet the detective.',
                  'We did took a taxi to Baker Street and met the detective.',
                ],
                explainHe: 'take ו-meet הם פעלים יוצאי דופן: took ו-met. אחרי did לא משתמשים בצורת עבר.',
                hintEn: 'Check both verbs and the helping verb did.',
              },
              story: {
                passageEn: 
                  'The old lighthouse at the end of the road was closed for years. One night, three friends noticed a small yellow light moving behind its dusty window. Nobody answered when they knocked, but the next morning they found fresh footprints near the door and a warm cup on the step. The oldest friend smiled and said that ghosts do not drink tea.',
                passageHe: '',
                questionEn: 'What did the friends decide about the light?',
                questionHe: '',
                correct: 'Someone real had been inside the lighthouse.',
                wrong: [
                  'A ghost lived in the old lighthouse.',
                  'The light came from the street lamps.',
                  'The lighthouse was open to all visitors.',
                ],
              },
              storyHintEn: 'Think about the footprints and the warm cup.',
            },
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 4: Future Creators & Teen Advice',
    titleHe: 'פרק 4: יוצרי העתיד וטור העצות',
    subtitleHe: 'Future (Will vs. Be going to), Modals (can, should, must, have to) וסיכום שנתי לכיתה ז׳',
    badgeEmoji: '🚀',
    missions: [
      {
        icon: '✨',
        titleEn: 'Future Dreams: Will & Going To',
        titleHe: 'חלומות ותוכניות לעתיד: Will מול Going To',
        storyHookHe:
          'איך מספרים באנגלית על תוכניות לחופש הגדול ועל תחזיות לעתיד? מתכננים את פרויקט הקיץ!',
        grammarTopic: 'Future Simple (Will) vs. Be Going To',
        skills: ['Will vs. Going To', 'Future Time Expressions', 'Voice Goals'],
        sentenceEn: 'Next summer, we are going to launch our own digital art shop!',
        sentenceHe: 'בקיץ הבא אנחנו עומדים/ות להשיק חנות אמנות דיגיטלית משלנו!',
        vocab: [
          [
            'future',
            'noun',
            'עתיד / עתידי',
            '🔮',
            'In the future, robots will help students learn faster.',
            'בעתיד, רובוטים יעזרו לתלמידים ללמוד מהר יותר.',
          ],
          [
            'plan',
            'verb',
            'לתכנן / תוכנית',
            '📝',
            'What are you planning to do tomorrow afternoon?',
            'מה את/ה מתכנן/ת לעשות מחר אחר הצהריים?',
          ],
          [
            'succeed',
            'verb',
            'להצליח',
            '🏆',
            'I am sure you will succeed in the English test!',
            'אני בטוח/ה שתצליח/י במבחן באנגלית!',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'past', translationHe: 'עבר' },
            { wordEn: 'falter', translationHe: 'להיכשל / למעוד' },
          ],
          shortSentenceEn: 'We are going to launch a shop.',
          shortSentenceHe: 'אנחנו עומדים/ות להשיק חנות.',
          rule: {
            questionEn: 'Which form is best for a prior planned intention?',
            correct: 'am / is / are going to + base verb',
            wrong: ['will + -ing', 'did + base verb'],
            explainHe:
              'לתוכניות שנקבעו מראש (prior intentions) משתמשים ב-be going to (We are going to launch), בעוד ש-will משמש להחלטות ספונטניות או תחזיות.',
            hintHe: 'תוכנית שהוחלטה מראש היא לא החלטה של הרגע. איזה מבנה של עתיד מתאים לתוכנית?',
          },
          story: {
            passageEn:
              'Three middle school friends spent their spring break designing interactive web stickers. They decided that next summer, they are going to launch a boutique online store. They believe their colorful designs will succeed and help young creators personalize their digital journals.',
            passageHe:
              'שלושה חברים מחטיבת הביניים בילו את חופשת האביב בעיצוב מדבקות רשת אינטראקטיביות. הם החליטו שבקיץ הבא הם עומדים להשיק חנות אונליין בוטיקית. הם מאמינים שהעיצובים הצבעוניים שלהם יצליחו ויעזרו ליוצרים צעירים להעניק נופך אישי ליומנים הדיגיטליים שלהם.',
            questionEn: 'What do the friends plan to launch next summer?',
            questionHe: 'מה מתכננים החברים להשיק בקיץ הבא?',
            correct: 'A boutique online digital sticker store.',
            wrong: ['A traditional bakery in central London.', 'A physical bookstore near the station.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'I am going to visit my aunt.',
                wrong: ['I going to visit my aunt.'],
                explainHe: 'לתוכנית שכבר נקבעה משתמשים ב-am / is / are going to: I am going to visit.',
                hintHe: 'כדי לדבר על תוכנית חסרה כאן מילה אחת לפני going to. איזו?',
              },
              story: {
                passageEn: 'Ben has a plan. He is going to bake a cake on Friday. The cake is for his mom.',
                passageHe: 'לבן יש תוכנית. הוא מתכוון לאפות עוגה ביום שישי. העוגה בשביל אמא שלו.',
                questionEn: 'Who is the cake for?',
                questionHe: 'בשביל מי העוגה?',
                correct: 'His mom.',
                wrong: ['His teacher.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['past', 'history'],
                ['avoid', 'enjoy'],
                ['arrive', 'depend'],
              ],
            },
            master: {
              sentenceEn: 'Next month my classmates and I are going to open a small recycling shop.',
              sentenceHe: 'בחודש הבא חבריי לכיתה ואני עומדים לפתוח חנות מיחזור קטנה.',
              decoys: ['goes', 'opening'],
              voiceEn: 'I am sure our team will win.',
              voiceHe: 'אני בטוח/ה שהקבוצה שלנו תנצח.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'We are going to travel to Eilat because we already bought tickets.',
                wrong: [
                  'We will going to travel to Eilat because we already bought tickets.',
                  'We are going travel to Eilat because we already bought tickets.',
                  'We are going to travels to Eilat because we already bought tickets.',
                ],
                explainHe: 
                  'לתוכנית שכבר נקבעה: am / is / are going to + פועל בצורת בסיס. לא מוסיפים will לפני going to, לא שוכחים to, ולא מוסיפים s לפועל.',
                hintEn: 'Check the words before the verb and the verb form.',
              },
              story: {
                passageEn: 
                  'Gal wants to join the school robotics team next year, but the test is hard. Every evening she practices with a friend who is already in the team. Tonight her friend told her that the final test will include a surprise task. Gal did not worry. She opened her notebook and started building a robot from simple parts, just to be ready for anything.',
                passageHe: '',
                questionEn: 'Why did Gal start building a robot tonight?',
                questionHe: '',
                correct: 'She wanted to prepare for an unknown task.',
                wrong: [
                  'Her friend asked her to leave the team.',
                  'She finished the test and had free time.',
                  'Her notebook was empty and she was bored.',
                ],
              },
              storyHintEn: 'Think about the surprise task.',
            },
          },
        },
      },
      {
        icon: '💡',
        titleEn: 'Teen Advice Column: Modals',
        titleHe: 'טור העצות לנוער: Can, Should, Must, Have to',
        storyHookHe:
          'חברים מבקשים מכם עצה בצ׳אט! נלמד לתת עצות חכמות באנגלית עם should, must ו-have to.',
        grammarTopic: 'Modals & Semi-Modals (can, could, should, must, have to)',
        skills: ['Should vs. Must', 'Don’t have to vs. Mustn’t', 'Advice Chat'],
        sentenceEn: 'You should take a short break and drink water before you continue studying.',
        sentenceHe: 'כדאי לך לקחת הפסקה קצרה ולשתות מים לפני שתמשיך/י ללמוד.',
        vocab: [
          [
            'advice',
            'noun',
            'עצה (שם עצם בלתי ספיר)',
            '💡',
            'Can you give me some good advice about my project?',
            'את/ה יכול/ה לתת לי עצה טובה לגבי הפרויקט שלי?',
          ],
          [
            'important',
            'adjective',
            'חשוב',
            '⭐',
            'It is important to get enough sleep before a busy day.',
            'חשוב לישון מספיק לפני יום עמוס.',
          ],
          [
            'choose',
            'verb',
            'לבחור',
            '🎯',
            'You can choose any topic that interests you.',
            'את/ה יכול/ה לבחור כל נושא שמעניין אותך.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'trivial', translationHe: 'חסר חשיבות' },
            { wordEn: 'compel', translationHe: 'לכפות / להכריח' },
          ],
          shortSentenceEn: 'You should take a short break.',
          shortSentenceHe: 'כדאי לך לקחת הפסקה קצרה.',
          rule: {
            questionEn: 'Which modal expresses a helpful suggestion or friendly advice?',
            correct: 'should',
            wrong: ['mustn’t', 'have to'],
            explainHe:
              'המודל should משמש למתן עצה ידידותית או המלצה (כדאי לך), בעוד ש-must מבטא חובה מוחלטת.',
            hintHe: 'עצה ידידותית היא כדאי לך, לא חובה ולא איסור. איזה מודל מתאים לעצה?',
          },
          story: {
            passageEn:
              'In the student council newsletter, Maya writes the weekly advice column. A classmate asked how to balance violin practice with heavy exam homework. Maya advised that students should divide study blocks into twenty-minute intervals, emphasizing that rest is essential for mental focus.',
            passageHe:
              'בעלון מועצת התלמידים, מאיה כותבת את טור העצות השבועי. חבר לכיתה שאל כיצד לאזן בין אימוני כינור לבין שיעורי בית מרובים למבחנים. מאיה ייעצה שתלמידים צריכים לחלק מקטעי למידה למרווחים של עשרים דקות, והדגישה שמנוחה חיונית למיקוד מנטלי.',
            questionEn: 'What study method did Maya recommend in her column?',
            questionHe: 'על איזו שיטת לימוד המליצה מאיה בטור שלה?',
            correct: 'Dividing study time into twenty-minute intervals with breaks.',
            wrong: ['Studying all night without drinking water.', 'Canceling all music lessons permanently.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'You should drink water.',
                wrong: ['You should drinks water.'],
                explainHe: 'אחרי should בא פועל בצורת בסיס, בלי s.',
                hintHe: 'אחרי פועל מודלי הפועל לא משתנה. האם צריך להוסיף לו s?',
              },
              story: {
                passageEn: 'Tal has a test on Monday. She should study today. She studies for one hour.',
                passageHe: 'לטל יש מבחן ביום שני. כדאי לה ללמוד היום. היא לומדת שעה אחת.',
                questionEn: 'When is the test?',
                questionHe: 'מתי המבחן?',
                correct: 'On Monday.',
                wrong: ['On Friday.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['furniture', 'luggage'],
                ['illegal', 'dangerous'],
                ['win', 'pay'],
              ],
            },
            master: {
              sentenceEn: 'You should not stay online until midnight because you have to wake up early.',
              sentenceHe: 'לא כדאי להישאר מחוברים עד חצות כי צריך לקום מוקדם.',
              decoys: ['staying', 'wakes'],
              voiceEn: 'Students can choose their own topics.',
              voiceHe: 'תלמידים יכולים לבחור נושאים משלהם.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Teenagers should sleep eight hours before an important exam.',
                wrong: [
                  'Teenagers should to sleep eight hours before an important exam.',
                  'Teenagers should sleeps eight hours before an important exam.',
                  'Teenagers can should sleep eight hours before an important exam.',
                ],
                explainHe: 
                  'אחרי פועל מודלי בא פועל בצורת בסיס: בלי to ובלי s. ולא שמים שני פעלים מודליים ברצף.',
                hintEn: 'What comes right after the modal verb?',
              },
              story: {
                passageEn: 
                  'Maya writes a teen advice column for her school newspaper. Last week a boy asked how to stop feeling nervous before speeches. Maya answered that he should not try to remember every word. Instead, he can write three short points and practice them with a friend. She also told him he does not have to be perfect, because the audience wants to hear a real person.',
                passageHe: '',
                questionEn: 'What is the main advice Maya gives the boy?',
                questionHe: '',
                correct: 'Learn only the main ideas and practice speaking them.',
                wrong: [
                  'Memorize the whole speech word for word.',
                  'Avoid speaking in front of other people.',
                  'Ask a friend to give the speech for him.',
                ],
              },
              storyHintEn: 'Look for what he should not do and what he can do.',
            },
          },
        },
      },
      {
        icon: '🏆',
        isBoss: true,
        titleEn: 'Boss: 7th Grade Champion Unseen',
        titleHe: 'בוס סיום: אליפות כיתה ז׳ באנגלית!',
        storyHookHe:
          'משימת הכתר המסכמת של כיתה ז׳! שילוב כל הזמנים (Present, Past, Future, Modals) וקטע Unseen חגיגי!',
        grammarTopic: '7th Grade Full Curriculum Synthesis & Champion Unseen',
        skills: ['All 7th Grade Tenses', 'Band II Vocabulary Crown', 'Voice Master'],
        sentenceEn: 'This year I learned hundreds of new words, and next year I will speak English everywhere!',
        sentenceHe: 'השנה למדתי מאות מילים חדשות, ובשנה הבאה אדבר אנגלית בכל מקום!',
        vocab: [
          [
            'proud',
            'adjective',
            'גאה',
            '👑',
            'You should feel very proud of your progress in English!',
            'את/ה צריך/ה להרגיש גאה מאוד בהתקדמות שלך באנגלית!',
          ],
          [
            'challenge',
            'noun',
            'אתגר / לאתגר',
            '🧗',
            'Every new mission is a fun challenge.',
            'כל משימה חדשה היא אתגר מהנה.',
          ],
          [
            'international',
            'adjective',
            'בינלאומי',
            '🌍',
            'English helps us make international friends.',
            'אנגלית עוזרת לנו לרכוש חברים בינלאומיים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'ashamed', translationHe: 'מתבייש / מבויש' },
            { wordEn: 'isolated', translationHe: 'מבודד' },
          ],
          shortSentenceEn: 'I learned hundreds of new words.',
          shortSentenceHe: 'למדתי מאות מילים חדשות.',
          rule: {
            questionEn: 'Which sentence correctly combines Past and Future tenses?',
            correct: 'Yesterday I finished my review, and tomorrow I will take the test.',
            wrong: [
              'Yesterday I will finish my review, and tomorrow I took the test.',
              'Yesterday I finish my review, and tomorrow I did take the test.',
            ],
            explainHe:
              'לפעולה שהסתיימה בעבר משתמשים ב-Past Simple (finished), ולפעולה בעתיד משתמשים ב-will (will take).',
            hintHe: 'כדאי לבדוק כל חצי לפי מילת הזמן: Yesterday מבקשת עבר, ו-tomorrow מבקשת עתיד.',
          },
          story: {
            passageEn:
              'At the seventh-grade closing assembly, students presented a multilingual exhibition. They highlighted how mastering Band II English vocabulary empowered them to correspond with peers in Asia, Europe, and America. With high confidence and pride, the students celebrated completing their middle school foundation.',
            passageHe:
              'בטקס סיום כיתה ז׳, התלמידים הציגו תערוכה רב-לשונית. הם הדגישו כיצד שליטה באוצר המילים של Band II באנגלית העניקה להם את היכולת להתכתב עם עמיתים באסיה, אירופה ואמריקה. בביטחון רב ובגאווה, התלמידים חגגו את השלמת יסודות חטיבת הביניים שלהם.',
            questionEn: 'What did seventh-graders celebrate at their closing assembly?',
            questionHe: 'מה חגגו תלמידי כיתה ז׳ בטקס הסיום שלהם?',
            correct: 'Completing their middle school English foundation and gaining global confidence.',
            wrong: ['Failing their final vocabulary examination.', 'Deciding to stop learning languages forever.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'We will visit London next year.',
                wrong: ['We will visiting London next year.'],
                explainHe: 'אחרי will בא פועל בצורת בסיס, בלי ing: will visit.',
                hintHe: 'אחרי will הפועל לא משתנה. האם מוסיפים לו ing?',
              },
              story: {
                passageEn: 'Tom is proud. He finished his book. Next week, he will start a new one.',
                passageHe: 'תום גאה. הוא סיים את הספר שלו. בשבוע הבא הוא יתחיל ספר חדש.',
                questionEn: 'What will Tom start next week?',
                questionHe: 'מה תום יתחיל בשבוע הבא?',
                correct: 'A new book.',
                wrong: ['A new game.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['lucky', 'ready'],
                ['headache', 'accident'],
                ['tropical', 'electric'],
              ],
            },
            master: {
              sentenceEn: 'Last year I felt nervous but next year I will lead a class discussion.',
              sentenceHe: 'בשנה שעברה הרגשתי לחוץ/ה אבל בשנה הבאה אנהל דיון בכיתה.',
              decoys: ['feeling', 'leads'],
              voiceEn: 'Next summer we are going to travel abroad.',
              voiceHe: 'בקיץ הבא אנחנו עומדים לטייל בחו״ל.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Last week we visited Rome and next week we will visit Paris.',
                wrong: [
                  'Last week we visit Rome and next week we will visit Paris.',
                  'Last week we visited Rome and next week we will to visit Paris.',
                  'Last week we visited Rome and next week we going visit Paris.',
                ],
                explainHe: 
                  'לעבר משתמשים ב-Past Simple (visited), ולעתיד ב-will + פועל בצורת בסיס, בלי to אחרי will.',
                hintEn: 'Check the verb forms in the past part and the future part.',
              },
              story: {
                passageEn: 
                  'At the closing assembly, Itay was asked to speak for one minute about the year. He walked to the microphone and noticed that his notes were still in his bag. Instead of panicking, he put his hands in his pockets and told the story of his first day in seventh grade, when he got lost and arrived late to English. The hall laughed warmly, and the teacher in the front row wiped her eyes.',
                passageHe: '',
                questionEn: 'What can we understand about Itay at the end?',
                questionHe: '',
                correct: 'He handled the problem calmly and shared a real story.',
                wrong: [
                  'He decided not to say anything at all.',
                  'He read his notes without any problems.',
                  'He was angry that nobody laughed.',
                ],
              },
              storyHintEn: 'Think about what he did instead of panicking.',
            },
          },
        },
      },
    ],
  },
];

export const grade7Curriculum = buildMiddleSchoolGrade('grade-7', units);
