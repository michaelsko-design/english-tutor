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
          shortSentenceHe: 'האם בית הקפה מגיש מאצ׳ה?',
          rule: {
            questionEn: 'Which question correctly uses Do or Does?',
            correct: 'Does your sister prefer iced tea?',
            wrong: ['Do your sister prefer iced tea?', 'Does your sister prefers iced tea?'],
            explainHe:
              'בשאלות עבור He / She / It משתמשים ב-Does, והפועל הראשי חוזר לצורת הבסיס שלו ללא s (Does your sister prefer).',
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
            'אפשר להשיג את המטרות כמתרגלים מדי יום.',
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
            'הם מתאמנים על ריקוד חדש ממש עכשיו.',
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
            'לחוץ / מתרגש בחשש',
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
          },
          story: {
            passageEn:
              'Ten thousand fans fill the city stadium tonight. The stage lights are shining brilliantly in neon colors. Although the lead singer usually feels nervous before major events, she is smiling radiantly right now. The crowd knows every single lyric and sings along in perfect unison.',
            passageHe:
              'עשרת אלפים מעריצים ממלאים את אצטדיון העיר הערב. אורות הבמה זוהרים בצבעי ניאון מרהיבים. אף על פי שהזמרת הראשית בדרך כלל מרגישה לחוצה לפני אירועים גדולים, היא מחייכת לרווחה ממש עכשיו. הקהל מכיר כל שורת מילים ושר יחד בתיאום מושלם.',
            questionEn: 'How does the crowd participate during the live concert?',
            questionHe: 'כיצד הקהל משתתף במהלך ההופעה החיה?',
            correct: 'By singing along to every lyric in unison.',
            wrong: ['By leaving the stadium in complete silence.', 'By demanding the lights be switched off.'],
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
          shortSentenceHe: 'עקבנו אחר רמזים בלונדון.',
          rule: {
            questionEn: 'Choose the sentence with correct irregular past verbs:',
            correct: 'They ran to Baker Street and took the underground train.',
            wrong: [
              'They runned to Baker Street and taked the train.',
              'They were run to Baker Street and did took the train.',
            ],
            explainHe:
              'הפעלים run ו-take הם בלתי רגילים, וצורות העבר הנכונות שלהם הן ran ו-took.',
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
          },
          story: {
            passageEn:
              'Three middle school friends spent their spring break designing interactive web stickers. They decided that next summer, they are going to launch a boutique online store. They believe their colorful designs will succeed and help young creators personalize their digital journals.',
            passageHe:
              'שלושה חברי חטיבת ביניים בילו את חופשת האביב בעיצוב מדבקות רשת אינטראקטיביות. הם החליטו שבקיץ הבא הם עומדים להשיק חנות אונליין בוטיקית. הם מאמינים שהעיצובים הצבעוניים שלהם יצליחו ויעזרו ליוצרים צעירים להעניק נופך אישי ליומנים הדיגיטליים שלהם.',
            questionEn: 'What do the friends plan to launch next summer?',
            questionHe: 'מה מתכננים החברים להשיק בקיץ הבא?',
            correct: 'A boutique online digital sticker store.',
            wrong: ['A traditional bakery in central London.', 'A physical bookstore near the station.'],
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
          },
          story: {
            passageEn:
              'In the student council newsletter, Maya writes the weekly advice column. A classmate asked how to balance violin practice with heavy exam homework. Maya advised that students should divide study blocks into twenty-minute intervals, emphasizing that rest is essential for mental focus.',
            passageHe:
              'בעלון מועצת התלמידים, מאיה כותבת את טור העצות השבועי. חבר לכיתה שאל כיצד לאזן בין אימוני כינור לבין שיעורי בית מרובים למבחנים. מאיה ייעצה שתלמידים צריכים לחלק מקטעי למידה למרווחים של עשרים דקות, והדגישה שמנוחה חיונית למיקוד מנטלי.',
            questionEn: 'What study method did Maya recommend in her column?',
            questionHe: 'איזו שיטת לימוד המליצה מאיה בטור שלה?',
            correct: 'Dividing study time into twenty-minute intervals with breaks.',
            wrong: ['Studying all night without drinking water.', 'Canceling all music lessons permanently.'],
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
            'כדאי להרגיש גאווה גדולה בהתקדמות שלך באנגלית!',
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
        },
      },
    ],
  },
];

export const grade7Curriculum = buildMiddleSchoolGrade('grade-7', units);
