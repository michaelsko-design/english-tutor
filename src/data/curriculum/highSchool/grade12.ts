import { buildHighSchoolGrade, HighSchoolUnitSpec } from './builder';

const units: HighSchoolUnitSpec[] = [
  {
    titleEn: 'Unit 1: Academic Connectors & Discourse Markers',
    titleHe: 'פרק 1: מילות קישור אקדמיות ומבנה טיעון',
    subtitleHe: 'מילות קישור להוספה (Furthermore, Moreover), ניגוד (However, In contrast) ותוצאה (Consequently, Therefore)',
    badgeEmoji: '🚀',
    missions: [
      {
        icon: '🔗',
        titleEn: 'Building Arguments: Addition & Contrast',
        titleHe: 'בניית טיעונים: הוספה וניגוד',
        storyHookHe:
          'איך כותבים טיעון משכנע ברמת 5 יחידות? נלמד להשתמש במילות קישור אקדמיות להוספה (Furthermore, Moreover) ולניגוד (However, In contrast, On the contrary).',
        grammarTopic: 'Academic Connectors: Addition & Contrast',
        skills: ['Academic Connectors', 'Essay Architecture', 'Module G Lexicon'],
        sentenceEn: 'Furthermore, innovative digital tools allow students to express their ideas independently.',
        sentenceHe: 'יתרה מזאת, כלים דיגיטליים חדשניים מאפשרים לתלמידים לבטא את רעיונותיהם באופן עצמאי.',
        vocab: [
          [
            'furthermore',
            'connector / adverb',
            'יתרה מזאת / בנוסף לכך',
            '➕',
            'Furthermore, online libraries provide free access to rare manuscripts.',
            'יתרה מזאת, ספריות מקוונות מספקות גישה חופשית לכתבי יד נדירים.',
          ],
          [
            'moreover',
            'connector / adverb',
            'יתר על כן / נוסף על כך',
            '📚',
            'Moreover, group seminars enhance student communication skills.',
            'יתר על כן, סמינרים קבוצתיים משפרים את מיומנויות התקשורת של התלמידים.',
          ],
          [
            'perspective',
            'noun',
            'השקפה / זווית ראייה',
            '👁️',
            'It is vital to consider global issues from diverse perspectives.',
            'חיוני לבחון סוגיות עולמיות מתוך מגוון השקפות.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'similarly', translationHe: 'באופן דומה' },
            { wordEn: 'nevertheless', translationHe: 'אף על פי כן' },
          ],
          shortSentenceEn: 'Digital tools allow independent learning.',
          shortSentenceHe: 'כלים דיגיטליים מאפשרים למידה עצמאית.',
          rule: {
            questionEn: 'Which punctuation is correct when starting a sentence with "Furthermore"?',
            correct: 'Furthermore, the data confirms our hypothesis.',
            wrong: [
              'Furthermore the data confirms our hypothesis.',
              'Furthermore: the data confirms our hypothesis.',
            ],
            explainHe:
              'כאשר מילת קישור אקדמית כגון Furthermore, Moreover או However פותחת משפט, חובה לשים פסיק מיד אחריה.',
            hintHe: 'כשמילת קישור אקדמית פותחת משפט, איזה סימן פיסוק בא מיד אחריה?',
          },
          story: {
            passageEn:
              'Modern universities increasingly integrate project-based coursework into their degree programs. Students collaborate across disciplines to solve real municipal dilemmas. Furthermore, industry mentors evaluate their presentations, offering direct professional feedback and recruitment prospects.',
            passageHe:
              'אוניברסיטאות מודרניות משלבות יותר ויותר קורסים מבוססי-פרויקטים בתוכניות התואר שלהן. סטודנטים משתפים פעולה בין דיסציפלינות שונות כדי לפתור דילמות עירוניות אמיתיות. יתרה מזאת, מנטורים מהתעשייה מעריכים את המצגות שלהם, ומציעים משוב מקצועי ישיר וסיכויי גיוס לעבודה.',
            questionEn: 'How do industry mentors contribute to students\' university projects?',
            questionHe: 'כיצד מנטורים מהתעשייה תורמים לפרויקטים של הסטודנטים באוניברסיטה?',
            correct: 'By evaluating presentations, offering professional feedback, and recruiting talent.',
            wrong: ['By canceling final degree graduation ceremonies.', 'By writing all research papers for the students.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence adds one more good point? The app is free.',
                correct: 'Furthermore, it is easy to use.',
                wrong: ['However, it is easy to use.'],
                explainHe: 
                  'Furthermore מוסיף עוד נקודה באותו כיוון, ו-However מציג ניגוד. כאן הרעיון השני הוא עוד יתרון.',
                hintHe: 'האם הרעיון השני מוסיף יתרון נוסף או מנוגד לראשון?',
              },
              story: {
                passageEn: 
                  'Noa loves her town library. It has free books. Moreover, it has quiet rooms for study.',
                passageHe: 
                  'נועה אוהבת את ספריית העיר שלה. יש בה ספרים בחינם. יתרה מזאת, יש בה חדרים שקטים ללמידה.',
                questionEn: 'What does the library have for study?',
                questionHe: 'מה יש בספרייה ללמידה?',
                correct: 'Quiet rooms.',
                wrong: ['Free pizza.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['whereas', 'albeit'],
                ['thereby', 'whereby'],
                ['deadline', 'ingredient'],
              ],
            },
            master: {
              sentenceEn: 
                'Online courses are affordable and furthermore they give learners flexible schedules.',
              sentenceHe: 'קורסים מקוונים הם במחיר סביר ויתרה מזאת הם נותנים ללומדים לוחות זמנים גמישים.',
              decoys: ['nevertheless', 'despite'],
              voiceEn: 'Reading widens our view of the world.',
              voiceHe: 'קריאה מרחיבה את ההשקפה שלנו על העולם.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Libraries are free; furthermore, they offer quiet study rooms.',
                wrong: [
                  'Libraries are free, furthermore, they offer quiet study rooms.',
                  'Libraries are free; furthermore, they offers quiet study rooms.',
                  'Libraries are free; however, they also offer quiet study rooms.',
                ],
                explainHe: 
                  'כששני משפטים שלמים מחוברים ב-furthermore, שמים נקודה-פסיק לפניו ופסיק אחריו. כדאי לבדוק גם את הפועל (they offer) ואת משמעות מילת הקישור: להוספה furthermore, לניגוד however.',
                hintEn: 'Check the punctuation, the verb form and the linking word.',
              },
              story: {
                passageEn: 
                  'Every spring Dana visits the small library near her school. Her friends prefer the new shopping mall, because it has a cinema and many cafes. Dana, in contrast, enjoys the silence of the reading hall. Last month she borrowed a thick book about ancient cities, and she finished it in three days. The next week her history teacher asked who could describe the old harbor of Caesarea. Dana raised her hand before anyone else, and her classmates turned to look at her in surprise.',
                passageHe: '',
                questionEn: 'Why were her classmates surprised?',
                questionHe: '',
                correct: 'They did not expect her to know about the harbor.',
                wrong: [
                  'Her friends had already answered the question before her.',
                  'The teacher had asked about the shopping mall instead.',
                  'She had borrowed the book only a few minutes earlier.',
                ],
              },
              storyHintEn: 'Think about what her friends usually do.',
            },
          },
        },
      },
      {
        icon: '⚡',
        titleEn: 'Cause, Effect & Result: Consequently & Therefore',
        titleHe: 'סיבה, תוצאה ומסקנה: לפיכך וכתוצאה מכך',
        storyHookHe:
          'איך מראים קשר סיבתי מושלם בחיבור? נלמד להשתמש ב-Consequently, Therefore ו-As a result בפיסוק אקדמי מדויק (נקודה-פסיק או פסיק).',
        grammarTopic: 'Conjunctive Adverbs of Result: Consequently & Therefore',
        skills: ['Result Connectors', 'Semicolon Usage', 'Logical Deductions'],
        sentenceEn: 'The investment yielded notable results; consequently, school leaders expanded the project.',
        sentenceHe: 'ההשקעה הניבה תוצאות ראויות לציון; כתוצאה מכך, הנהלת בית הספר הרחיבה את הפרויקט.',
        vocab: [
          [
            'consequently',
            'connector / adverb',
            'כתוצאה מכך / לפיכך',
            '➡️',
            'Rainfall declined drastically; consequently, agricultural yields fell.',
            'המשקעים פחתו בצורה דרסטית; כתוצאה מכך, היבולים החקלאיים ירדו.',
          ],
          [
            'substantial',
            'adjective',
            'מהותי / ניכר / בעל ערך רב',
            '💎',
            'The research team made substantial progress this semester.',
            'צוות המחקר רשם התקדמות ניכרת בסמסטר זה.',
          ],
          [
            'yield',
            'verb',
            'להניב / להפיק',
            '🌾',
            'Renewable energy investments yield long-term savings.',
            'השקעות באנרגיה מתחדשת מניבות חיסכון לטווח ארוך.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'unproductively', translationHe: 'באופן בלתי פרודוקטיבי' },
            { wordEn: 'haphazardly', translationHe: 'באופן אקראי / מפוזר' },
          ],
          shortSentenceEn: 'The smart investment yielded results.',
          shortSentenceHe: 'ההשקעה החכמה הניבה תוצאות.',
          rule: {
            questionEn: 'Which sentence demonstrates correct punctuation with a conjunctive adverb?',
            correct: 'The budget was approved; therefore, construction began promptly.',
            wrong: [
              'The budget was approved, therefore construction began promptly.',
              'The budget was approved therefore, construction began promptly.',
            ],
            explainHe:
              'כאשר מחברים שני משפטים עצמאיים באמצעות therefore או consequently, שמים נקודה-פסיק (;) לפני מילת הקישור ופסיק (,) מיד אחריה.',
            hintHe: 'שני משפטים עצמאיים: לפני מילת הקישור בא סימן שמפריד בין משפטים, ואחריה פסיק.',
          },
          story: {
            passageEn:
              'A district in Galilee installed intelligent drip-irrigation systems connected to weather satellites. Water wastage decreased by thirty-four percent within the first quarter; consequently, regional water tariffs were reduced for resident farmers. Neighboring agricultural councils have announced plans to adopt the exact same infrastructure.',
            passageHe:
              'מחוז בגליל התקין מערכות השקיה בטפטוף חכמות המחוברות ללווייני מזג אוויר. בזבוז המים פחת בשלושים וארבעה אחוזים בתוך הרבעון הראשון; כתוצאה מכך, תעריפי המים האזוריים הופחתו עבור החקלאים התושבים. מועצות חקלאיות שכנות הכריזו על תוכניות לאמץ בדיוק את אותה תשתית.',
            questionEn: 'What was the direct consequence of reducing water wastage by thirty-four percent?',
            questionHe: 'מה הייתה התוצאה הישירה של הפחתת בזבוז המים ב-34%?',
            correct: 'Regional water tariffs were substantially reduced for local farmers.',
            wrong: ['Farmers abandoned their agricultural land.', 'The satellite was permanently deactivated.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is punctuated correctly?',
                correct: 'The road was closed; consequently, we stayed home.',
                wrong: ['The road was closed consequently we stayed home.'],
                explainHe: 'לפני consequently בין שני משפטים שלמים באה נקודה-פסיק, ואחריו פסיק.',
                hintHe: 'איזה סימן מפריד בין שני משפטים שלמים לפני מילת התוצאה?',
              },
              story: {
                passageEn: 
                  'Yael studied every night. She passed the exam. Therefore, her parents were proud.',
                passageHe: 'יעל למדה בכל לילה. היא עברה את המבחן. לכן ההורים שלה היו גאים.',
                questionEn: 'Why were her parents proud?',
                questionHe: 'למה ההורים שלה היו גאים?',
                correct: 'Yael passed the exam.',
                wrong: ['Yael lost her book.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['albeit', 'scarcely'],
                ['hostile', 'spacious'],
                ['soothe', 'restrain'],
              ],
            },
            master: {
              sentenceEn: 'The factory reduced its waste and therefore the river became much cleaner.',
              sentenceHe: 'המפעל צמצם את הפסולת שלו ולכן הנהר נעשה נקי הרבה יותר.',
              decoys: ['although', 'despite'],
              voiceEn: 'Careful planning produces excellent final results.',
              voiceHe: 'תכנון קפדני מניב תוצאות סופיות מצוינות.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The tickets sold out; therefore, the concert was moved to a bigger hall.',
                wrong: [
                  'The tickets sold out, therefore the concert was moved to a bigger hall.',
                  'The tickets sold out therefore, the concert was moved to a bigger hall.',
                  'The tickets sold out; however, the concert was moved to a bigger hall.',
                ],
                explainHe: 
                  'לפני therefore בין שני משפטים שלמים באה נקודה-פסיק ואחריו פסיק. כדאי גם לוודא שמילת הקישור מתאימה: however מציג ניגוד, לא תוצאה.',
                hintEn: 'Look at the mark before the linking word and its meaning.',
              },
              story: {
                passageEn: 
                  'The small town of Neve Ilan relied on a single bakery. When the owner fell ill the shop closed for two months. Many residents began buying bread from a supermarket twenty kilometers away. Meanwhile, the local council received dozens of letters from worried families. In the end, three young bakers from the city offered to run the shop together, and the council agreed to lower their rent for the first year.',
                passageHe: '',
                questionEn: 'Why did the council lower the rent?',
                questionHe: '',
                correct: 'It hoped to encourage the new bakers to reopen the shop.',
                wrong: [
                  'It wanted the supermarket to attract more customers.',
                  'The former owner had demanded a smaller building.',
                  'The families had refused to buy bread from anyone.',
                ],
              },
              storyHintEn: 'Ask what the council wanted for the town.',
            },
          },
        },
      },
      {
        icon: '👑',
        isBoss: true,
        titleEn: 'Boss: The Debate Champion Essay',
        titleHe: 'בוס: חיבור אליפות הדיבייט — אתגר טיעונים מורכב',
        storyHookHe:
          'משימת בוס עיונית: עליכם לנתח נאום דיבייט מנצח, לזהות מילות קישור של הוספה, ניגוד ותוצאה, ולהרכיב טיעון ברמת בגרות 5 יחידות!',
        grammarTopic: 'Full Discourse Markers Synthesis & Argumentative Mastery',
        skills: ['Discourse Synthesis', 'Competitive Debate', 'Bagrut Module G'],
        sentenceEn: 'While traditional methods offer discipline, contemporary collaborative frameworks nurture genuine creativity.',
        sentenceHe: 'בעוד ששיטות מסורתיות מציעות משמעת, מסגרות שיתופיות בנות-זמננו מטפחות יצירתיות אמיתית.',
        vocab: [
          [
            'nurture',
            'verb',
            'לטפח / לגדל במסירות',
            '🌱',
            'Mentors nurture talent through encouraging guidance.',
            'חונכים מטפחים כישרון באמצעות הנחיה מעודדת.',
          ],
          [
            'contemporary',
            'adjective',
            'בן-זמננו / עכשווי',
            '⏳',
            'Contemporary literature reflects modern cultural diversity.',
            'ספרות בת-זמננו משקפת גיוון תרבותי מודרני.',
          ],
          [
            'framework',
            'noun',
            'מסגרת / תשתית רעיונית',
            '📐',
            'The treaty established a clear framework for international peace.',
            'האמנה ביססה מסגרת ברורה לשלום בינלאומי.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'stifle', translationHe: 'לחנוק / לדכא' },
            { wordEn: 'archaic', translationHe: 'מיושן / ארכאי' },
          ],
          shortSentenceEn: 'Frameworks nurture true creativity.',
          shortSentenceHe: 'מסגרות מטפחות יצירתיות אמיתית.',
          rule: {
            questionEn: 'Which transition phrase effectively introduces a concession before your main point?',
            correct: 'While it is true that..., nevertheless...',
            wrong: [
              'Because of this reason..., moreover...',
              'In order to..., consequently...',
            ],
            explainHe:
              'בכתיבת טיעון ברמה גבוהה משתמשים בוויתור (Concession): מודים בנכונות חלקית של טענת הצד השני (While it is true that...), ואז מציגים את הטיעון החזק שלנו (nevertheless...).',
            hintHe: 'ויתור פירושו להודות קודם שהצד השני צודק בחלק, ואז להציג טיעון נגדי חזק. מה מתאים לשני השלבים?',
          },
          story: {
            passageEn:
              'In the grand final of the National Youth Debate Cup, the affirmative team defended mandatory coding literacy in elementary schools. The lead speaker acknowledged that human arts must never be neglected; nevertheless, computational literacy provides young learners with indispensable analytic problem-solving tools in a digitized civilization.',
            passageHe:
              'בגמר הגדול של גביע הדיבייט הארצי לנוער, קבוצת התמיכה הגנה על חינוך חובה לתכנות בבתי ספר יסודיים. הדובר הראשי הודה שאסור להזניח את מקצועות הרוח והאמנות; אף על פי כן, אוריינות חישובית מעניקה ללומדים צעירים כלים אנליטיים הכרחיים לפתרון בעיות בציוויליזציה ממוחשבת.',
            questionEn: 'How did the debate champion address potential critics of coding education?',
            questionHe: 'כיצד התייחס אלוף הדיבייט למבקרי הוראת התכנות?',
            correct: 'By affirming the value of the arts while emphasizing computing as an analytic necessity.',
            wrong: ['By demanding the immediate abolition of all literature classes.', 'By claiming computers will eliminate all human art forever.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence admits a point before disagreeing?',
                correct: 'Although exams are stressful, they teach discipline.',
                wrong: ['Moreover exams are stressful, they teach discipline.'],
                explainHe: 
                  'Although פותח ויתור: מודים בנקודה אחת ואז מציגים את הטיעון שלנו. Moreover רק מוסיף רעיון ואינו מציג ויתור.',
                hintHe: 'איזו מילה מתחילה הודאה בנקודה של הצד השני?',
              },
              story: {
                passageEn: 
                  'Tom joined the school debate team. First, he felt nervous. Then he practiced every day, and now he speaks well.',
                passageHe: 
                  'תום הצטרף לקבוצת הדיבייט של בית הספר. בהתחלה הוא היה לחוץ. אחר כך הוא התאמן כל יום, ועכשיו הוא מדבר היטב.',
                questionEn: 'What did Tom do every day?',
                questionHe: 'מה תום עשה כל יום?',
                correct: 'He practiced.',
                wrong: ['He cooked dinner.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['undermine', 'discourage'],
                ['ancient', 'prehistoric'],
                ['souvenir', 'rumor'],
              ],
            },
            master: {
              sentenceEn: 
                'While online lessons are convenient the classroom still builds stronger friendships among students.',
              sentenceHe: 'בעוד ששיעורים מקוונים נוחים הכיתה עדיין בונה חברויות חזקות יותר בין התלמידים.',
              decoys: ['because', 'therefore'],
              voiceEn: 'Debate teaches students to respect other opinions.',
              voiceHe: 'דיבייט מלמד תלמידים לכבד דעות אחרות.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Although the debate was long, the audience stayed until the end.',
                wrong: [
                  'Although the debate was long, but the audience stayed until the end.',
                  'Despite the debate was long, the audience stayed until the end.',
                  'Although the debate was long, the audience staying until the end.',
                ],
                explainHe: 
                  'Although פותח משפט משנה עם נושא ופועל, ואין להוסיף but במשפט הראשי. אחרי despite בא שם עצם ולא משפט, והמשפט הראשי צריך פועל מלא.',
                hintEn: 'Check the linking word and the verb in the main clause.',
              },
              story: {
                passageEn: 
                  'Maya was chosen to argue for a phone ban in her school. Her teacher expected a long list of screen dangers, since Maya often complained about the gaming of her brother. Instead, she opened with a surprising sentence: phones can be useful tools. She admitted that students sometimes research and learn with them. Nevertheless, she argued, a full day without notifications would improve concentration far more. The judges wrote down her opening remark and later gave her the highest score for balance.',
                passageHe: '',
                questionEn: 'Why did the judges give her the highest score for balance?',
                questionHe: '',
                correct: 'She recognized the other side before presenting her own view.',
                wrong: [
                  'She agreed with the opposing team on every point.',
                  'She avoided mentioning phones during her speech.',
                  'She listed only the dangers of screens as expected.',
                ],
              },
              storyHintEn: 'Notice how she began her speech.',
            },
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 2: The Winning Bagrut Opinion Essay (Module G/C)',
    titleHe: 'פרק 2: ארכיטקטורת חיבור דעה לבגרות',
    subtitleHe: 'פסקת פתיחה, פסקאות נימוק ודוגמאות, התייחסות לטענת הנגד ופסקת סיכום',
    badgeEmoji: '✍️',
    missions: [
      {
        icon: '🎯',
        titleEn: 'Thesis Statements & Compelling Openings',
        titleHe: 'משפט עמדה (Thesis) ופתיחה מנצחת',
        storyHookHe:
          'איך תופסים את הבוחן כבר בפסקת הפתיחה? נלמד לנסח משפט עמדה (Thesis Statement) ברור, להשתמש בפועלי עמדה חזקים (advocate, maintain, argue) ולבנות פתיח מושלם.',
        grammarTopic: 'Essay Introductions & Thesis Statement Formulation',
        skills: ['Thesis Statements', 'Essay Openings', 'Bagrut Writing Rubric'],
        sentenceEn: 'Many educators strongly advocate that practical internships should become mandatory for high school graduation.',
        sentenceHe: 'מחנכים רבים תומכים בחום בכך שהתמחויות מעשיות יהפכו לחובה לצורך קבלת תעודת בגרות.',
        vocab: [
          [
            'advocate',
            'verb',
            'לתמוך בפומבי / לצדד ב-',
            '📣',
            'Health experts advocate a balanced Mediterranean diet.',
            'מומחי בריאות מצדדים בתזונה ים-תיכונית מאוזנת.',
          ],
          [
            'compelling',
            'adjective',
            'משכנע / מרתק',
            '✨',
            'She presented compelling arguments in favor of public transport.',
            'היא הציגה טיעונים משכנעים בעד תחבורה ציבורית.',
          ],
          [
            'mandatory',
            'adjective',
            'חובה / מחייב על פי חוק',
            '📜',
            'Wearing helmets on scooters is strictly mandatory.',
            'חבישת קסדות ברכיבה על קורקינטים היא חובה מוחלטת.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'optional', translationHe: 'רשות / לבחירה' },
            { wordEn: 'discourage', translationHe: 'לרפות ידיים / לייאש' },
          ],
          shortSentenceEn: 'Practical internships should become mandatory.',
          shortSentenceHe: 'התמחויות מעשיות צריכות להפוך לחובה.',
          rule: {
            questionEn: 'What are the two essential components of an effective Thesis Statement?',
            correct: 'A clear personal stance + a concise roadmap of supporting arguments',
            wrong: [
              'A dictionary definition of the prompt word + an apology',
              'A fictional narrative story + a series of rhetorical questions',
            ],
            explainHe:
              'משפט עמדה מוצלח בבגרות מציג הן את העמדה החד-משמעית שלך והן את מפת הדרכים התמציתית של הנימוקים שיוצגו בפסקאות הבאות.',
            hintHe: 'משפט עמדה טוב מראה מה העמדה של הכותב ואילו נימוקים יבואו אחריה.',
          },
          story: {
            passageEn:
              'In Module G writing tasks, candidates are allotted fifty minutes to author an opinion composition of 120 to 140 words. Chief matriculation examiners consistently observe that papers beginning with a clear, assertive thesis statement score significantly higher in communicative quality than those opening with vague generalizations.',
            passageHe:
              'במטלות הכתיבה של שאלון G, מוקצות לנבחנים חמישים דקות לכתיבת חיבור דעה של 120 עד 140 מילים. מעריכי בגרות ראשיים מציינים בעקביות כי חיבורים הנפתחים במשפט עמדה ברור ובטוח זוכים לציונים גבוהים משמעותית בממד התקשורתי מאשר חיבורים הפותחים בהכללות מעורפלות.',
            questionEn: 'What do chief examiners note regarding assertive thesis statements?',
            questionHe: 'מה מציינים מעריכי בחינות ראשיים לגבי משפטי עמדה ברורים?',
            correct: 'They earn significantly higher marks in communicative effectiveness.',
            wrong: ['They are penalized for being overly concise.', 'They force the examiner to deduct points for grammar.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is a clear opinion?',
                correct: 'I believe schools should start later.',
                wrong: ['Schools are buildings with many rooms.'],
                explainHe: 
                  'משפט עמדה אומר מה הכותב חושב, למשל I believe ... should .... משפט עובדתי רגיל אינו עמדה.',
                hintHe: 'איזה משפט מראה מה הכותב חושב?',
              },
              story: {
                passageEn: 
                  'Eli wrote an essay about recycling. His first sentence said that all schools should recycle. Then he gave three reasons.',
                passageHe: 
                  'אלי כתב חיבור על מחזור. המשפט הראשון שלו אמר שכל בתי הספר צריכים למחזר. אחר כך הוא נתן שלושה נימוקים.',
                questionEn: 'What did Eli write about?',
                questionHe: 'על מה אלי כתב?',
                correct: 'Recycling.',
                wrong: ['Football.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['dismantle', 'exhaust'],
                ['fragrant', 'slippery'],
                ['hereditary', 'nutritious'],
              ],
            },
            master: {
              sentenceEn: 
                'Many teachers strongly believe that volunteering should become a required part of school life.',
              sentenceHe: 'מורים רבים מאמינים בתוקף שהתנדבות צריכה להפוך לחלק חובה בחיי בית הספר.',
              decoys: ['optional', 'rarely'],
              voiceEn: 'I advocate a healthier school lunch menu.',
              voiceHe: 'אני מצדד/ת בתפריט ארוחות צהריים בריא יותר בבית הספר.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'In my opinion, public libraries should remain free for every citizen.',
                wrong: [
                  'In my opinion, public libraries should remains free for every citizen.',
                  'In my opinion public libraries should to remain free for every citizen.',
                  'In my opinion, public libraries must be remain free for every citizen.',
                ],
                explainHe: 
                  'אחרי should בא פועל בצורת שורש: בלי s, בלי to ובלי פועל נוסף. כך מנסחים משפט עמדה ברור.',
                hintEn: 'Look at the verb after should.',
              },
              story: {
                passageEn: 
                  'Noga stared at the blank page for ten minutes. The exam question asked whether schools should ban sweet drinks, and her mind was full of ideas but none seemed organized. Then she remembered the advice of her teacher and wrote one sentence: schools should ban sweet drinks because they harm health, concentration and the budget. Suddenly, her three paragraphs almost wrote themselves, and she finished with five minutes to spare.',
                passageHe: '',
                questionEn: 'Why did the paragraphs almost write themselves?',
                questionHe: '',
                correct: 'The opening sentence gave her a clear plan to follow.',
                wrong: [
                  'Her teacher wrote the whole essay for her.',
                  'The question had been changed at the last minute.',
                  'She copied the ideas from the student next to her.',
                ],
              },
              storyHintEn: 'What did Noga write first?',
            },
          },
        },
      },
      {
        icon: '⚖️',
        titleEn: 'Counter-Arguments & Concession Structures',
        titleHe: 'טענת הנגד והזמתה: כתיבה מאוזנת',
        storyHookHe:
          'איך כותבים חיבור בוגר שזוכה בציון 100? מציגים את טענת המתנגדים (Although opponents contend...) ואז מפריכים אותה בנימוק מנצח.',
        grammarTopic: 'Counter-Argument Formulation & Concession Clauses (Although / Despite)',
        skills: ['Counter-Arguments', 'Concession Clauses', 'Rebuttal Techniques'],
        sentenceEn: 'Although critics argue that uniforms reduce personal expression, they undeniably foster school equality.',
        sentenceHe: 'אף על פי שמבקרים טוענים שתלבושת אחידה מפחיתה ביטוי אישי, היא ללא ספק מקדמת שוויון בבית הספר.',
        vocab: [
          [
            'concession',
            'noun',
            'ויתור / הודאה בנכונות עמדה',
            '🤝',
            'Making a rhetorical concession strengthens the essay\'s objectivity.',
            'ביצוע ויתור רטורי מחזק את האובייקטיביות של החיבור.',
          ],
          [
            'counterpart',
            'noun',
            'עמית / גורם מקביל',
            '👥',
            'The foreign minister met with her European counterpart.',
            'שרת החוץ נפגשה עם עמיתתה האירופית.',
          ],
          [
            'undeniably',
            'adverb',
            'באופן שאינו מוטל בספק / ללא ספק',
            '🌟',
            'Renewable solar energy is undeniably beneficial.',
            'אנרגיה סולארית מתחדשת מועילה ללא צל של ספק.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'dubiously', translationHe: 'בספקנות / באופן מפוקפק' },
            { wordEn: 'rebuttal', translationHe: 'הפרכה / סתירת טענה' },
          ],
          shortSentenceEn: 'Uniforms undeniably foster school equality.',
          shortSentenceHe: 'תלבושת אחידה מקדמת ללא ספק שוויון בית-ספרי.',
          rule: {
            questionEn: 'Which structure is grammatically correct with "Despite"?',
            correct: 'Despite the high initial cost, the project succeeded.',
            wrong: [
              'Despite that the project was costly, it succeeded.',
              'Despite the project was costly, it succeeded.',
            ],
            explainHe:
              'אחרי Despite חייב לבוא שם עצם (noun phrase) או פועל עם ing (Despite the cost), ולא משפט עם נושא ופועל (בשונה מ-Although).',
            hintHe: 'אחרי Despite לא בא משפט עם נושא ופועל, אלא צירוף שמני.',
          },
          story: {
            passageEn:
              'A compelling argumentative essay addresses alternative viewpoints rather than ignoring them. When debating whether school start times should be delayed, a student acknowledged that shifting the bell might complicate parents\' commute. However, she refuted this concern by citing scientific evidence that well-rested teens cause fewer road accidents, thus benefiting the whole community.',
            passageHe:
              'חיבור טיעוני משכנע מתמודד עם נקודות מבט חלופיות במקום להתעלם מהן. בעת דיון בשאלה האם יש לדחות את שעת פתיחת הלימודים, תלמידה הכירה בכך שהזזת הצלצול עלולה לסבך את נסיעת ההורים לעבודה. עם זאת, היא הפריכה דאגה זו באמצעות ציטוט ראיות מדעיות לכך שבני נוער ערניים גורמים לפחות תאונות דרכים, ובכך תורמים לקהילה כולה.',
            questionEn: 'How did the student effectively refute the counter-argument regarding parents\' commutes?',
            questionHe: 'כיצד הפריכה התלמידה ביעילות את טענת הנגד בנוגע לנסיעות ההורים?',
            correct: 'By showing that well-rested adolescent drivers cause fewer traffic accidents for everyone.',
            wrong: ['By demanding parents resign from their jobs immediately.', 'By suggesting schools abolish morning classes permanently.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'Despite the rain, we played outside.',
                wrong: ['Despite it rained, we played outside.'],
                explainHe: 'אחרי despite בא שם עצם (the rain) ולא משפט עם נושא ופועל.',
                hintHe: 'מה בא אחרי despite: שם עצם או משפט שלם?',
              },
              story: {
                passageEn: 
                  'Some students like uniforms. Others do not. Dina thinks uniforms are fine, although she wants more colors.',
                passageHe: 
                  'חלק מהתלמידים אוהבים תלבושת אחידה. אחרים לא. דינה חושבת שתלבושת אחידה בסדר, אף על פי שהיא רוצה יותר צבעים.',
                questionEn: 'What does Dina want?',
                questionHe: 'מה דינה רוצה?',
                correct: 'More colors.',
                wrong: ['No uniforms at all.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['recession', 'vacancy'],
                ['lecture', 'sculpture'],
                ['reluctantly', 'nervously'],
              ],
            },
            master: {
              sentenceEn: 
                'Despite the strong objections of parents the school decided to extend the school day.',
              sentenceHe: 'למרות ההתנגדות החזקה של ההורים בית הספר החליט להאריך את יום הלימודים.',
              decoys: ['although', 'because'],
              voiceEn: 'Critics may disagree but the facts remain.',
              voiceHe: 'מבקרים עשויים לא להסכים אך העובדות נשארות.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Although many people disagree, the new law is clearly beneficial.',
                wrong: [
                  'Although many people disagree, but the new law is clearly beneficial.',
                  'Despite many people disagree, the new law is clearly beneficial.',
                  'Although many people disagreement, the new law is clearly beneficial.',
                ],
                explainHe: 
                  'Although פותח משפט שלם עם נושא ופועל ואינו מצריך but; אחרי despite בא שם עצם. כדאי לבדוק גם שיש פועל במשפט המשנה.',
                hintEn: 'Check which structure follows the linking word.',
              },
              story: {
                passageEn: 
                  'Itay wanted the cafeteria to stop selling sugary snacks. At the council meeting, a classmate answered that students would simply buy sweets outside the school gates. Itay nodded and replied that this might happen at first. However, he pointed out that a nearby school had tried the same plan and, after one year, fewer students bought sweets at all. Even the classmate who disagreed asked to see the figures.',
                passageHe: '',
                questionEn: 'What made the classmate ask to see the figures?',
                questionHe: '',
                correct: 'Itay supported his reply with evidence from another school.',
                wrong: [
                  'Itay refused to listen to any objection.',
                  'The council had already canceled the rule.',
                  'The classmate wanted to sell sweets outside school.',
                ],
              },
              storyHintEn: 'Which example did Itay mention?',
            },
          },
        },
      },
      {
        icon: '👑',
        isBoss: true,
        titleEn: 'Boss: 140-Word Bagrut Opinion Essay Master',
        titleHe: 'בוס: מאסטר חיבור דעה לבגרות — 140 מילים',
        storyHookHe:
          'משימת בוס עיונית: עליכם לנתח חיבור דעה מושלם לשאלון G שזכה לציון 100, לזהות פסקאות פתיחה, נימוק, ויתור וסיכום, ולהוכיח שליטה מלאה!',
        grammarTopic: 'Full Bagrut Opinion Essay Synthesis & Model Analysis',
        skills: ['Bagrut 140-Word Essay', 'Concluding Paragraphs', 'Matriculation Rubric'],
        sentenceEn: 'In conclusion, fostering creative thinking alongside academic rigor equips students for competitive global careers.',
        sentenceHe: 'לסיכום, טיפוח חשיבה יצירתית לצד קפדנות אקדמית מכשיר את התלמידים לקריירות גלובליות תחרותיות.',
        vocab: [
          [
            'rigor',
            'noun',
            'קפדנות / דיוק מחמיר',
            '📐',
            'Academic rigor prepares students for demanding university challenges.',
            'קפדנות אקדמית מכינה תלמידים לאתגרים תובעניים באוניברסיטה.',
          ],
          [
            'fundamental',
            'adjective',
            'בסיסי / יסודי',
            '🏛️',
            'Freedom of speech is a fundamental democratic right.',
            'חופש הביטוי הוא זכות דמוקרטית יסודית.',
          ],
          [
            'equip',
            'verb',
            'לצייד / להכשיר',
            '🎒',
            'Modern schools equip adolescents with digital competencies.',
            'בתי ספר מודרניים מציידים בני נוער במיומנויות דיגיטליות.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'superficiality', translationHe: 'שטחיות' },
            { wordEn: 'deprive', translationHe: 'לשלול / למנוע מ-' },
          ],
          shortSentenceEn: 'Schools equip students for global careers.',
          shortSentenceHe: 'בתי ספר מציידים תלמידים לקריירות גלובליות.',
          rule: {
            questionEn: 'Which is a common fatal error in the conclusion of an opinion essay?',
            correct: 'Introducing brand new supporting arguments never mentioned before',
            wrong: [
              'Restating the original thesis using fresh synonyms',
              'Summarizing the central points in two concise sentences',
            ],
            explainHe:
              'שגיאה נפוצה בפסקת הסיכום היא העלאת טיעון חדש שלא הוזכר בגוף החיבור. הסיכום נועד אך ורק לתמצת את הטיעונים הקיימים ולתת המלצה סופית.',
            hintHe: 'פסקת הסיכום רק מסכמת את מה שכבר נאמר. מה פוגע בה?',
          },
          story: {
            passageEn:
              'A top-scoring Bagrut Module G composition examined whether remote work should permanently replace office environments. The essay demonstrated flawless organization: an engaging hook, balanced body paragraphs supporting psychological autonomy, a courteous concession regarding team cohesion, and a punchy conclusion urging hybrid flexibility. The evaluator awarded full thirty points.',
            passageHe:
              'חיבור מצטיין לשאלון G בבגרות בחן האם עבודה מרחוק צריכה להחליף לצמיתות את סביבת המשרד. החיבור הציג מבנה ללא דופי: פתיח מושך, פסקאות גוף מאוזנות התומכות באוטונומיה פסיכולוגית, ויתור מנומס בנוגע ללכידות צוותית, ופסקת סיכום חדה הממליצה על גמישות היברידית. המעריך העניק לחיבור את מלוא שלושים הנקודות.',
            questionEn: 'What final recommendation made the model essay\'s conclusion punchy?',
            questionHe: 'איזו המלצה סופית הפכה את סיכום חיבור המודל לחד ומוצלח?',
            correct: 'Advocating for a balanced hybrid flexibility rather than extreme opposites.',
            wrong: ['Demanding the total closure of all corporate enterprises.', 'Insisting workers return to strict forty-hour physical weeks.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is best for a conclusion?',
                correct: 'In conclusion, school sports are good for everyone.',
                wrong: ['For example, my cousin plays football on Fridays.'],
                explainHe: 
                  'המסקנה מסכמת את העמדה בקצרה, למשל In conclusion. דוגמה אישית שייכת לגוף החיבור.',
                hintHe: 'איזה משפט מסכם את העמדה ואיזה נותן רק דוגמה?',
              },
              story: {
                passageEn: 
                  'Roni wrote a short essay. First she gave her opinion. At the end, she wrote one sentence to sum it up.',
                passageHe: 'רוני כתבה חיבור קצר. קודם היא כתבה את דעתה. בסוף היא כתבה משפט אחד שמסכם הכול.',
                questionEn: 'What did Roni write at the end?',
                questionHe: 'מה רוני כתבה בסוף?',
                correct: 'A sentence to sum it up.',
                wrong: ['A new story.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['gossip', 'nostalgia'],
                ['hereditary', 'ceremonial'],
                ['punish', 'deprive'],
              ],
            },
            master: {
              sentenceEn: 
                'In conclusion schools must balance creative freedom with strict academic standards for every student.',
              sentenceHe: 
                'לסיכום בתי ספר חייבים לאזן בין חופש יצירתי לבין סטנדרטים אקדמיים מחמירים לכל תלמיד.',
              decoys: ['although', 'rarely'],
              voiceEn: 'Good essays end with a clear conclusion.',
              voiceHe: 'חיבורים טובים מסתיימים במסקנה ברורה.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'To sum up, we should invest in education because it benefits everyone.',
                wrong: [
                  'To sum up, we should invest in education because it benefit everyone.',
                  'To sum up, we should investing in education because it benefits everyone.',
                  'To sum up, we should invest in education because of it benefits everyone.',
                ],
                explainHe: 
                  'אחרי should בא פועל בצורת שורש, אחרי because בא משפט עם פועל שמתאים לנושא (it benefits), ו-because of בא לפני שם עצם.',
                hintEn: 'Check the verbs and the words before it benefits.',
              },
              story: {
                passageEn: 
                  'Mr Cohen collected the essays on Sunday. Most students ended with the same sentence: there are many opinions about this topic. Only Yarden wrote that schools should add an hour of art every week and that this small change would help students think more freely. Mr Cohen smiled, put her essay on top of the pile, and wrote the word Convincing next to the final paragraph.',
                passageHe: '',
                questionEn: 'Why did Mr Cohen write Convincing next to the last paragraph?',
                questionHe: '',
                correct: 'Her ending took a clear position and gave a reason.',
                wrong: [
                  'Her ending was the same as everyone else.',
                  'Her essay was the shortest in the pile.',
                  'Her ending asked the teacher a question.',
                ],
              },
              storyHintEn: 'Compare her ending with the others.',
            },
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 3: Advanced Module G Unseen & Author\'s Tone',
    titleHe: 'פרק 3: שאלון G מתקדם ועמדת הכותב',
    subtitleHe: 'זיהוי טון ועמדה (objective, skeptical, critical, enthusiastic) והסקה עמוקה',
    badgeEmoji: '🔍',
    missions: [
      {
        icon: '🧐',
        titleEn: 'Decoding Author\'s Tone and Attitude',
        titleHe: 'פיענוח טון הכותב ועמדתו',
        storyHookHe:
          'בשאלון G מופיעות שאלות כגון: "What is the author\'s tone in lines 10-15?". נלמד לזהות שמות תואר של טון (skeptical, cynical, objective, critical, appreciative) על פי בחירת המילים של המחבר.',
        grammarTopic: 'Identifying Author\'s Tone & Rhetorical Stance',
        skills: ['Author\'s Tone', 'Subtle Nuance', 'Module G Vocabulary'],
        sentenceEn: 'The columnist adopts a skeptical tone regarding the exaggerated claims of instant learning apps.',
        sentenceHe: 'בעל הטור נוקט בטון סקפטי בנוגע לטענות המוגזמות של אפליקציות ללמידה מיידית.',
        vocab: [
          [
            'skeptical',
            'adjective',
            'ספקני / מפקפק',
            '🤨',
            'Scientists remain skeptical until rigorous evidence emerges.',
            'מדענים נותרים ספקנים עד להופעת ראיות מוצקות.',
          ],
          [
            'plausible',
            'adjective',
            'מתקבל על הדעת / סביר',
            '💡',
            'The explanation provided by the witness seemed plausible.',
            'ההסבר שסיפק העד נראה מתקבל על הדעת.',
          ],
          [
            'underlying',
            'adjective',
            'בסיסי / חבוי מתחת לפני השטח',
            '🌊',
            'We must address the underlying causes of youth anxiety.',
            'עלינו לטפל בסיבות הבסיסיות של חרדת בני נוער.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'enthusiastic', translationHe: 'נלהב / אופטימי' },
            { wordEn: 'gullible', translationHe: 'פתי / מאמין לכל דבר' },
          ],
          shortSentenceEn: 'The scientist remains openly skeptical.',
          shortSentenceHe: 'המדען נותר ספקני בגלוי.',
          rule: {
            questionEn: 'If an author uses phrases like "so-called experts" and "doubtful promises", their tone is:',
            correct: 'Skeptical / Critical',
            wrong: ['Enthusiastic / Celebratory', 'Completely Indifferent / Unbiased'],
            explainHe:
              'ביטויים כמו "מומחים כביכול" (so-called) ו"הבטחות מוטלות בספק" (doubtful promises) מעידים במובהק על טון ספקני וביקורתי של הכותב.',
            hintHe: 'so-called ו-doubtful מראים שהכותב לא מאמין לטענות. איזה טון מתאים לחוסר אמון?',
          },
          story: {
            passageEn:
              'In an editorial for The Technology Review, Dr. Levin scrutinizes startups advertising brain-wave headsets that claim to boost memory by three hundred percent in forty-eight hours. Levin observes dryly that despite flashy marketing videos, zero peer-reviewed clinical trials support these miraculous breakthroughs, warning parents against squandering savings.',
            passageHe:
              'במאמר מערכת עבור ״טכנולוג׳י רוויו״, ד״ר לוין בוחן בעין ביקורתית חברות הזנק המפרסמות אוזניות גלי מוח הטוענות לשיפור הזיכרון בשלוש מאות אחוזים בתוך ארבעים ושמונה שעות. לוין מציין ביובש כי למרות סרטוני שיווק מנצנצים, אף ניסוי קליני מבוקר אינו תומך בפריצות דרך ניסיות אלו, ומזהיר הורים מפני בזבוז חסכונותיהם.',
            questionEn: 'What is Dr. Levin\'s primary attitude toward brain-wave headsets?',
            questionHe: 'מהי עמדתו העיקרית של ד״ר לוין כלפי אוזניות גלי המוח?',
            correct: 'Skeptical and critical due to the absence of scientific peer-reviewed evidence.',
            wrong: ['Enthusiastic and recommending immediate government subsidies.', 'Fascinated and buying headsets for all his university staff.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'A writer says: "I do not believe this promise." What is the tone?',
                correct: 'Doubtful and critical',
                wrong: ['Happy and proud'],
                explainHe: 'כשהכותב אומר שהוא אינו מאמין להבטחה, הטון שלו ספקני וביקורתי.',
                hintHe: 'מי שלא מאמין להבטחה: איזה טון הוא משמיע?',
              },
              story: {
                passageEn: 
                  'The ad says that a pill makes you smart in one day. Ben reads it and laughs. He does not believe it.',
                passageHe: 
                  'המודעה אומרת שכדור הופך אותך לחכם ביום אחד. בן קורא אותה וצוחק. הוא לא מאמין לזה.',
                questionEn: 'Does Ben believe the ad?',
                questionHe: 'האם בן מאמין למודעה?',
                correct: 'No, he does not.',
                wrong: ['Yes, he does.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['sluggish', 'nutritious'],
                ['hospitable', 'punctual'],
                ['vocal', 'ornamental'],
              ],
            },
            master: {
              sentenceEn: 
                'The author sounds doubtful because he describes the so called miracle cure with obvious irony.',
              sentenceHe: 'הכותב נשמע מפקפק כי הוא מתאר את תרופת הפלא כביכול באירוניה ברורה.',
              decoys: ['quickly', 'under'],
              voiceEn: 'The writer sounds critical of the plan.',
              voiceHe: 'הכותב נשמע ביקורתי כלפי התוכנית.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The writer seems skeptical because he gives no evidence for his claims.',
                wrong: [
                  'The writer seem skeptical because he gives no evidence for his claims.',
                  'The writer seems skeptically because he gives no evidence for his claims.',
                  'The writer seems skeptical because he gives no evidences for his claims.',
                ],
                explainHe: 
                  'הנושא the writer דורש seems, אחרי seems בא שם תואר (skeptical) ולא תואר פועל, ו-evidence הוא שם עצם שאינו ניתן לספירה, ולכן אין evidences.',
                hintEn: 'Check the verb ending, the word after seems and the noun.',
              },
              story: {
                passageEn: 
                  'Dr Rosen wrote a review of a new documentary about electric cars. She praised the beautiful photography and admitted the director had worked hard. Yet she noted that the film never mentions the cost of batteries, the mining needed to make them, or the electricity that comes from coal. Her final line read: it is an excellent advertisement, but we should not mistake an advertisement for an investigation.',
                passageHe: '',
                questionEn: 'What is the attitude of Dr Rosen toward the documentary?',
                questionHe: '',
                correct: 'Respectful but critical, because important facts are missing.',
                wrong: [
                  'Completely enthusiastic, because the photography was beautiful.',
                  'Indifferent, because she did not watch the whole film.',
                  'Angry, because the director wasted a lot of money.',
                ],
              },
              storyHintEn: 'Look at her final line.',
            },
          },
        },
      },
      {
        icon: '🌊',
        titleEn: 'Synthesis Across Paragraphs & Ripple Effects',
        titleHe: 'סינתזה בין פסקאות ואפקט האדווה',
        storyHookHe:
          'שאלות בגרות מתקדמות דורשות לקשר בין נתונים המופיעים בפסקאות שונות. נתרגל קריאה אינטגרטיבית ואוצר מילים של מערכות מורכבות.',
        grammarTopic: 'Cross-Paragraph Synthesis & Integrative Comprehension',
        skills: ['Synthesis Across Text', 'Ecological Networks', 'Module G Rigor'],
        sentenceEn: 'The inherent complexity of ecological networks means that localized interventions produce widespread ripple effects.',
        sentenceHe: 'המורכבות הטבועה ברשתות אקולוגיות משמעה שהתערבויות מקומיות מייצרות אפקט אדווה נרחב.',
        vocab: [
          [
            'inherent',
            'adjective',
            'טבוע / חלק בלתי נפרד',
            '🧬',
            'Risk is an inherent part of space exploration.',
            'סיכון הוא חלק בלתי נפרד מחקר החלל.',
          ],
          [
            'ecological',
            'adjective',
            'אקולוגי / סביבתי',
            '🌿',
            'Ecological conservation protects endangered species.',
            'שימור אקולוגי מגן על מינים בסכנת הכחדה.',
          ],
          [
            'intervention',
            'noun',
            'התערבות מכוונת',
            '🛡️',
            'Medical intervention prevented the outbreak from spreading.',
            'התערבות רפואית מנעה מההתפרצות להתפשט.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'superficial', translationHe: 'שטחי' },
            { wordEn: 'isolated', translationHe: 'מבודד' },
          ],
          shortSentenceEn: 'Interventions create widespread ripple effects.',
          shortSentenceHe: 'התערבויות יוצרות אפקט אדווה נרחב.',
          rule: {
            questionEn: 'How should you approach a question that cites evidence from both Paragraph 2 and Paragraph 4?',
            correct: 'Synthesize how the detail in P2 causes or explains the outcome described in P4',
            wrong: [
              'Choose only one paragraph and ignore the other completely',
              'Copy the first line of both paragraphs without reading',
            ],
            explainHe:
              'שאלת סינתזה בבגרות מחייבת להבין את הקשר הלוגי (סיבה, תוצאה, הסבר או ניגוד) בין שתי הפסקאות ולנסח תשובה שלמה המשלבת את שתיהן.',
            hintHe: 'שאלת סינתזה דורשת לחבר בין שתי הפסקאות: איך פרט באחת מסביר או גורם למה שקורה בשנייה?',
          },
          story: {
            passageEn:
              'When wolves were reintroduced to Yellowstone National Park in 1995, biologists initially aimed solely to manage overgrown deer populations. Unexpectedly, because deer avoided open valleys, native aspen trees regenerated rapidly. Consequently, songbird populations soared and beaver colonies expanded twelvefold, creating wetlands that stabilized riverbanks and reduced seasonal soil erosion.',
            passageHe:
              'כאשר זאבים הוחזרו לפארק הלאומי ילוסטון בשנת 1995, מטרתם הראשונית של הביולוגים הייתה אך ורק לווסת אוכלוסיות איילים שגדלו יתר על המידה. באופן בלתי צפוי, משום שהאיילים נמנעו מעמקים פתוחים, עצי צפצפה מקומיים התחדשו במהירות. כתוצאה מכך, אוכלוסיות ציפורי השיר נסקו ומושבות בונים גדלו פי שנים-עשר, ויצרו שטחי ביצות שייצבו את גדות הנהרות והפחיתו סחף קרקע עונתי.',
            questionEn: 'What unexpected ripple effect occurred following the reintroduction of wolves?',
            questionHe: 'איזה אפקט אדווה בלתי צפוי התרחש בעקבות השבת הזאבים?',
            correct: 'Beavers and vegetation stabilized riverbanks and reduced soil erosion.',
            wrong: ['The river dried up and transformed into arid desert.', 'All bird populations migrated away permanently.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'To answer a question about two paragraphs, what should you do?',
                correct: 'Connect ideas from both paragraphs.',
                wrong: ['Read only the first paragraph.'],
                explainHe: 'שאלת סינתזה דורשת לחבר בין פרטים משתי הפסקאות, ולא להסתמך על אחת מהן בלבד.',
                hintHe: 'כשיש שתי פסקאות בשאלה, כדאי להשתמש בשתיהן.',
              },
              story: {
                passageEn: 
                  'Rain fell in the hills. Then the river grew big. The farmers moved their sheep away.',
                passageHe: 'גשם ירד בגבעות. אחר כך הנהר גדל. החקלאים הרחיקו את הכבשים שלהם.',
                questionEn: 'Why did the farmers move their sheep?',
                questionHe: 'למה החקלאים הרחיקו את הכבשים?',
                correct: 'The river grew big.',
                wrong: ['The sheep were sick.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['underwater', 'alphabetical'],
                ['monetary', 'linguistic'],
                ['resignation', 'recreation'],
              ],
            },
            master: {
              sentenceEn: 
                'Small changes in one habitat can create unexpected effects across the whole ecological system.',
              sentenceHe: 
                'שינויים קטנים בבית גידול אחד יכולים ליצור השפעות בלתי צפויות על כל המערכת האקולוגית.',
              decoys: ['although', 'nearly'],
              voiceEn: 'One event can cause many other changes.',
              voiceHe: 'אירוע אחד יכול לגרום להרבה שינויים אחרים.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The drought reduced the harvest; as a result, food prices rose sharply.',
                wrong: [
                  'The drought reduced the harvest as a result, food prices rose sharply.',
                  'The drought reduced the harvest; as a result, food prices risen sharply.',
                  'The drought reduced the harvest; as a result food prices raised sharply.',
                ],
                explainHe: 
                  'לפני as a result בין שני משפטים שלמים באה נקודה-פסיק. בנוסף, rose היא צורת העבר של rise (פועל שאינו מקבל מושא), ואילו risen דורש have.',
                hintEn: 'Check the punctuation and the form of the verb rise.',
              },
              story: {
                passageEn: 
                  'When the city council closed the old canal to build a parking lot, nobody worried about the fish. A year later the herons that fed on those fish had moved to a park three kilometers away. Residents who used to photograph the birds from the bridge stopped visiting, and the small cafe beside the canal lost half of its customers. This spring, the owner started a petition asking the council to reopen the water.',
                passageHe: '',
                questionEn: 'Why did the cafe owner start the petition?',
                questionHe: '',
                correct: 'The closure of the canal had indirectly damaged his business.',
                wrong: [
                  'He wanted to build a bigger parking lot.',
                  'The herons had asked him to reopen the canal.',
                  'The council had offered to buy his cafe.',
                ],
              },
              storyHintEn: 'Follow the chain from fish to birds to customers.',
            },
          },
        },
      },
      {
        icon: '👑',
        isBoss: true,
        titleEn: 'Boss: Rigorous Module G Unseen Challenge',
        titleHe: 'בוס: אתגר אנסין שאלון G מלא — רמת מצטיינים',
        storyHookHe:
          'משימת בוס עיונית: עליכם לפתור קטע הבנת הנקרא אקדמי מלא ברמת שאלון G הגבוהה ביותר (5 יח״ל) על החייאת שטחים ירוקים בערים ורווחת התושבים!',
        grammarTopic: 'Module G Full Unseen Synthesis & Academic Vocabulary',
        skills: ['Module G Excellence', 'Academic Synthesis', 'High-Stakes Unseen'],
        sentenceEn: 'The investigative report revealed that urban green spaces yield profound mental and economic dividends.',
        sentenceHe: 'דו״ח התחקיר חשף ששטחים ירוקים עירוניים מניבים רווחים נפשיים וכלכליים משמעותיים.',
        vocab: [
          [
            'dividend',
            'noun',
            'רווח / דיבידנד / תועלת מתמשכת',
            '💰',
            'Investing in youth education pays perpetual dividends.',
            'השקעה בחינוך נוער מניבה רווחים מתמשכים.',
          ],
          [
            'metropolitan',
            'adjective',
            'מטרופוליני / של עיר גדולה',
            '🏙️',
            'Metropolitan rail networks reduce highway traffic congestion.',
            'רשתות רכבת מטרופוליניות מפחיתות את עומסי התנועה בכבישים המהירים.',
          ],
          [
            'revitalize',
            'verb',
            'להחיות מחדש / להפיח רוח חיים',
            '✨',
            'Urban gardens revitalize abandoned industrial neighborhoods.',
            'גינות קהילתיות מפיחות רוח חיים בשכונות תעשייתיות נטושות.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'liability', translationHe: 'נטל / חבות משפטית' },
            { wordEn: 'neglect', translationHe: 'הזנחה' },
          ],
          shortSentenceEn: 'Green parks revitalize big cities.',
          shortSentenceHe: 'פארקים ירוקים מפיחים רוח חיים בערים גדולות.',
          rule: {
            questionEn: 'In high-level Module G questions, when asked to "justify your answer from the text", you should:',
            correct: 'Provide a concise quote or precise paraphrase citing the relevant line numbers',
            wrong: [
              'Write your personal opinion without mentioning the text',
              'Copy three whole paragraphs to be safe',
            ],
            explainHe:
              'בשאלות נימוק מהטקסט (Justify your answer) יש לצטט או לנסח במדויק את המשפט הרלוונטי בלבד ולא להעתיק פסקאות שלמות, כדי לא לאבד נקודות.',
            hintHe: 'נימוק מהטקסט הוא מדויק וקצר: רק המשפט הרלוונטי, לא דעה אישית ולא פסקאות שלמות.',
          },
          story: {
            passageEn:
              'A landmark study spearheaded by researchers at the Harvard School of Public Health investigated thirty metropolitan centers across four continents. Findings proved that residents living within three hundred meters of tree canopies visited healthcare clinics twenty-one percent less frequently for cardiovascular and stress complaints. The economic return yielded six dollars for every single municipal dollar spent on botanical maintenance.',
            passageHe:
              'מחקר פורץ דרך בהובלת חוקרים בבית הספר לבריאות הציבור של הרווארד בדק שלושים מרכזים מטרופוליניים בארבע יבשות. הממצאים הוכיחו כי תושבים המתגוררים במרחק של עד שלוש מאות מטרים מחופת עצים ביקרו במרפאות עשרים ואחד אחוזים פחות בתלונות על מחלות לב ולחץ. התשואה הכלכלית הניבה שישה דולרים על כל דולר עירוני בודד שהושקע בתחזוקה בוטנית.',
            questionEn: 'What quantifiable economic return did municipal tree maintenance generate?',
            questionHe: 'איזו תשואה כלכלית ניתנת למדידה הניבה תחזוקת העצים העירונית?',
            correct: 'Six dollars in savings for every single dollar spent on maintenance.',
            wrong: ['No economic benefit was recorded in healthcare budgets.', 'Cities lost municipal revenues due to fallen leaves.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'What does "justify your answer" ask you to do?',
                correct: 'Give a reason from the text.',
                wrong: ['Give your favorite color.'],
                explainHe: 'Justify your answer פירושו לנמק בעזרת הטקסט: לצטט או לנסח מחדש משפט רלוונטי.',
                hintHe: 'נימוק בבגרות מגיע מתוך הטקסט.',
              },
              story: {
                passageEn: 
                  'A new park opened in the city. Many people walk there after work. They say they feel calm.',
                passageHe: 
                  'פארק חדש נפתח בעיר. אנשים רבים מטיילים בו אחרי העבודה. הם אומרים שהם מרגישים רגועים.',
                questionEn: 'How do people feel in the park?',
                questionHe: 'איך אנשים מרגישים בפארק?',
                correct: 'They feel calm.',
                wrong: ['They feel angry.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['verdict', 'trophy'],
                ['celestial', 'mythical'],
                ['demolish', 'evacuate'],
              ],
            },
            master: {
              sentenceEn: 
                'Careful investment in public parks can revitalize entire neighborhoods and improve resident health.',
              sentenceHe: 
                'השקעה זהירה בפארקים ציבוריים יכולה להפיח חיים בשכונות שלמות ולשפר את בריאות התושבים.',
              decoys: ['demolish', 'however'],
              voiceEn: 'The report shows clear economic benefits.',
              voiceHe: 'הדוח מראה יתרונות כלכליים ברורים.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'According to the report, green spaces reduce stress among city residents.',
                wrong: [
                  'According the report, green spaces reduce stress among city residents.',
                  'According to the report, green spaces reduces stress among city residents.',
                  'According to the report, green spaces reduce stress between city residents.',
                ],
                explainHe: 
                  'הביטוי הנכון הוא according to. הנושא green spaces הוא רבים ולכן reduce בלי s, ו-among מתאים לקבוצה גדולה (תושבי העיר).',
                hintEn: 'Check the small words and the verb ending.',
              },
              story: {
                passageEn: 
                  'A metropolitan council in northern Europe replaced a noisy motorway with a long, shaded promenade. Critics warned that traffic would collapse and that shops would lose customers. Two years later, bus journeys took only five minutes longer, while the number of pedestrians had tripled. The local newspaper reported that rents on the promenade had risen, and that a chain of supermarkets had asked to open three new branches there.',
                passageHe: '',
                questionEn: 'What does the rise in rents suggest?',
                questionHe: '',
                correct: 'The area had become more attractive to businesses.',
                wrong: [
                  'The shops on the promenade were failing.',
                  'Traffic had become much worse than before.',
                  'Pedestrians no longer wanted to visit.',
                ],
              },
              storyHintEn: 'Why would businesses agree to pay more?',
            },
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 4: Global Horizons & Professional Future',
    titleHe: 'פרק 4: אופקים גלובליים ועתיד מקצועי',
    subtitleHe: 'אנגלית אקדמית ורשמית לעולם העבודה, ראיונות, אתיקה ומנהיגות בינלאומית',
    badgeEmoji: '🌐',
    missions: [
      {
        icon: '💼',
        titleEn: 'The Global Job Market & Adaptability',
        titleHe: 'שוק העבודה הגלובלי ויכולת הסתגלות',
        storyHookHe:
          'איך מתכוננים לעבודה בחברות גלובליות ובאקדמיה בינלאומית? נלמד מבני היפוך והדגשה (Inversion: Not only... but also...) ואוצר מילים פורמלי.',
        grammarTopic: 'Advanced Emphatic Structures & Inversion (Not only... but also...)',
        skills: ['Emphatic Inversion', 'Professional English', 'Lifelong Learning'],
        sentenceEn: 'Graduates who cultivate adaptability and digital literacy thrive in competitive international workplaces.',
        sentenceHe: 'בוגרים שמטפחים יכולת הסתגלות ואוריינות דיגיטלית משגשגים במקומות עבודה בינלאומיים תחרותיים.',
        vocab: [
          [
            'adaptability',
            'noun',
            'כושר הסתגלות / גמישות מחשבתית',
            '🦎',
            'Career success requires adaptability in rapidly shifting markets.',
            'הצלחה בקריירה דורשת כושר הסתגלות בשווקים המשתנים במהירות.',
          ],
          [
            'cultivate',
            'verb',
            'לטפח / לגדל / לפתח לאורך זמן',
            '🌱',
            'Lifelong learning helps us cultivate valuable professional skills.',
            'למידה לאורך החיים עוזרת לנו לטפח מיומנויות מקצועיות בעלות ערך.',
          ],
          [
            'competence',
            'noun',
            'מיומנות / כשירות מקצועית',
            '🏆',
            'Linguistic competence opens doors in international research.',
            'כשירות לשונית פותחת דלתות במחקר בינלאומי.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'inflexibility', translationHe: 'נוקשות / חוסר גמישות' },
            { wordEn: 'incompetence', translationHe: 'חוסר כשירות' },
          ],
          shortSentenceEn: 'Graduates cultivate high digital literacy.',
          shortSentenceHe: 'בוגרים מטפחים אוריינות דיגיטלית גבוהה.',
          rule: {
            questionEn: 'Which sentence correctly demonstrates inverted word order for emphasis?',
            correct: 'Not only does bilingualism enhance memory, but it also improves career prospects.',
            wrong: [
              'Not only bilingualism enhances memory, but it also improves career prospects.',
              'Not only bilingualism does enhance memory, but also it improves prospects.',
            ],
            explainHe:
              'כאשר פותחים משפט בביטוי שלילתי או מגביל כמו Not only, משתמשים בהיפוך כמו בשאלה (does bilingualism enhance).',
            hintHe: 'אחרי Not only בתחילת משפט סדר המילים הפוך, כמו בשאלה: פועל עזר לפני הנושא.',
          },
          story: {
            passageEn:
              'An executive symposium at the World Economic Forum highlighted that technical skills become outdated every five years. Consequently, global employers prioritize emotional intelligence, cross-cultural empathy, and agile adaptability above rote memorization. Candidates who demonstrate intellectual curiosity consistently secure senior innovation leadership roles.',
            passageHe:
              'סימפוזיון מנהלים בפורום הכלכלי העולמי הדגיש כי מיומנויות טכניות מתיישנות מדי חמש שנים. כתוצאה מכך, מעסיקים בינלאומיים מעניקים עדיפות לאינטליגנציה רגשית, אמפתיה בין-תרבותית ויכולת הסתגלות גמישה על פני שינון עיוור. מועמדים המפגינים סקרנות אינטלקטואלית מבטיחים בעקביות תפקידי הובלה בכירים בתחום החדשנות.',
            questionEn: 'What do global corporate leaders value above rote technical memorization?',
            questionHe: 'מה מעריכים מנהיגי תאגידים גלובליים מעל שינון טכני עיוור?',
            correct: 'Emotional intelligence, cross-cultural empathy, and intellectual adaptability.',
            wrong: ['The willingness to work without any digital technology.', 'Strict memorization of corporate rulebooks only.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'Not only does Ben swim, but he also runs.',
                wrong: ['Not only Ben swims, but he also runs.'],
                explainHe: 'אחרי Not only בתחילת משפט משתמשים בהיפוך כמו בשאלה: פועל עזר לפני הנושא (למשל: does Ben swim).',
                hintHe: 'אחרי Not only בא פועל עזר לפני הנושא.',
              },
              story: {
                passageEn: 
                  'Lia studies English and Spanish. She wants to work in other countries. She practices every evening.',
                passageHe: 'ליה לומדת אנגלית וספרדית. היא רוצה לעבוד במדינות אחרות. היא מתרגלת בכל ערב.',
                questionEn: 'When does Lia practice?',
                questionHe: 'מתי ליה מתרגלת?',
                correct: 'Every evening.',
                wrong: ['Every morning.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['monotony', 'nostalgia'],
                ['erase', 'squander'],
                ['sympathy', 'hesitation'],
              ],
            },
            master: {
              sentenceEn: 
                'Not only do employers value technical skills but they also look for adaptability and teamwork.',
              sentenceHe: 'לא רק שמעסיקים מעריכים כישורים טכניים, אלא שהם גם מחפשים יכולת הסתגלות ועבודת צוות.',
              decoys: ['does', 'nothing'],
              voiceEn: 'Learning never stops in a modern career.',
              voiceHe: 'הלמידה אף פעם לא נפסקת בקריירה מודרנית.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Not only did the company hire graduates, but it also trained them.',
                wrong: [
                  'Not only the company hired graduates, but it also trained them.',
                  'Not only did the company hired graduates, but it also trained them.',
                  'Not only did the company hire graduates, but also it trained them.',
                ],
                explainHe: 
                  'אחרי Not only בתחילת משפט בא פועל עזר לפני הנושא (did the company), ואחריו הפועל בצורת שורש (hire). גם סדר המילים אחרי but נשמר: but it also trained.',
                hintEn: 'Check the order of words and the verb form after did.',
              },
              story: {
                passageEn: 
                  'At the age of thirty-five, Hadas lost her job when the printing company she worked for closed. Her friends advised her to look for another printing company, but she signed up for an evening course in web design instead. For a year she worked in a cafe during the day and studied at night. Now she designs websites for three international firms, and last month she was invited to train new employees at one of them.',
                passageHe: '',
                questionEn: 'What does the story suggest about Hadas?',
                questionHe: '',
                correct: 'She was willing to learn new skills when circumstances changed.',
                wrong: [
                  'She was unable to find any work outside the printing business.',
                  'She refused to accept any advice from her old friends.',
                  'She disliked every kind of modern technology and training.',
                ],
              },
              storyHintEn: 'Think about how she reacted to losing her job.',
            },
          },
        },
      },
      {
        icon: '🤝',
        titleEn: 'Professional Ethics & Leadership Integrity',
        titleHe: 'אתיקה מקצועית ומנהיגות בעלת יושרה',
        storyHookHe:
          'מהי מנהיגות אמיתית במאה ה-21? נלמד על משלב שפה פורמלי (Formal Register), ניהול משא ומתן באנגלית רהוטה וערכי יושרה.',
        grammarTopic: 'Formal Register & Discourse in Professional Negotiations',
        skills: ['Formal Register', 'Leadership Ethics', 'Negotiation English'],
        sentenceEn: 'Ethical leaders demonstrate personal integrity when navigating high-stakes business negotiations.',
        sentenceHe: 'מנהיגים מוסריים מפגינים יושרה אישית בעת ניהול משא ומתן עסקי עתיר סיכונים.',
        vocab: [
          [
            'integrity',
            'noun',
            'יושרה / הגינות מוסרית',
            '🧭',
            'Personal integrity builds lasting trust in diplomacy.',
            'יושרה אישית בונה אמון מתמשך בדיפלומטיה.',
          ],
          [
            'negotiation',
            'noun',
            'משא ומתן',
            '🤝',
            'The multilateral negotiations produced a historic accord.',
            'המשא ומתן הרב-צדדי הניב הסכם היסטורי.',
          ],
          [
            'paramount',
            'adjective',
            'עליון / בעל חשיבות מכרעת',
            '👑',
            'Protecting civilian safety is of paramount importance.',
            'הגנה על ביטחון אזרחים היא בעלת חשיבות עליונה.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'corruption', translationHe: 'שחיתות' },
            { wordEn: 'triviality', translationHe: 'חוסר חשיבות / קטנוניות' },
          ],
          shortSentenceEn: 'Personal integrity is always paramount.',
          shortSentenceHe: 'יושרה אישית היא תמיד בעלת חשיבות עליונה.',
          rule: {
            questionEn: 'Which phrase represents a FORMAL register suitable for professional correspondence?',
            correct: 'I would like to inquire whether...',
            wrong: [
              'Hey, tell me if...',
              'Wanna know if...',
            ],
            explainHe:
              'במשלב פורמלי רשמי נשתמש בביטויים מנומסים ומדויקים כגון "I would like to inquire" במקום שפת דיבור סלנגית.',
            hintHe: 'משלב רשמי הוא מנומס ומלא, בלי סלנג ובלי קיצורים של דיבור.',
          },
          story: {
            passageEn:
              'When aerospace engineering firms draft safety protocols, transparency is paramount. In a landmark corporate case study, a young quality assurance engineer discovered a micro-crack in turbine prototypes. Despite immense pressure from executives to meet delivery deadlines, she halted production, demonstrating unyielding professional integrity that averted catastrophic failures.',
            passageHe:
              'כאשר חברות הנדסת אווירונאוטיקה מנסחות פרוטוקולי בטיחות, שקיפות היא בעלת חשיבות עליונה. במקרה בוחן תאגידי מפורסם, מהנדסת אבטחת איכות צעירה גילתה סדק זעיר באבות טיפוס של טורבינה. למרות לחץ עצום מצד המנהלים לעמוד בלוחות זמנים של אספקה, היא עצרה את הייצור, והפגינה יושרה מקצועית בלתי מתפשרת שמנעה כשלים קטסטרופליים.',
            questionEn: 'What did the engineer demonstrate by halting turbine production?',
            questionHe: 'מה הפגינה המהנדסת בעצירת ייצור הטורבינות?',
            correct: 'Unyielding professional integrity prioritizing human safety over commercial speed.',
            wrong: ['A total lack of interest in corporate engineering.', 'A desire to sabotage her company\'s reputation.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is more formal?',
                correct: 'I would like to ask about the job.',
                wrong: ['Wanna ask about the job?'],
                explainHe: 
                  'במשלב פורמלי משתמשים בביטויים מלאים ומנומסים כמו I would like to, ולא בקיצורי דיבור.',
                hintHe: 'משלב רשמי הוא מלא ומנומס.',
              },
              story: {
                passageEn: 
                  'Mia found a wallet on the bus. She did not keep the money. She gave it to the driver.',
                passageHe: 'מיה מצאה ארנק באוטובוס. היא לא לקחה את הכסף. היא נתנה אותו לנהג.',
                questionEn: 'What did Mia do with the wallet?',
                questionHe: 'מה מיה עשתה עם הארנק?',
                correct: 'She gave it to the driver.',
                wrong: ['She kept the money.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['arrogance', 'suspicion'],
                ['blueprint', 'souvenir'],
                ['lunar', 'sluggish'],
              ],
            },
            master: {
              sentenceEn: 
                'Trustworthy managers remain honest during difficult negotiations and respect every member of the team.',
              sentenceHe: 'מנהלים אמינים נשארים ישרים במהלך משא ומתן קשה ומכבדים כל חבר בצוות.',
              decoys: ['hey', 'whereas'],
              voiceEn: 'Honest leaders earn lasting respect from others.',
              voiceHe: 'מנהיגים ישרים זוכים לכבוד מתמשך מאחרים.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'I would be grateful if you could send me the details.',
                wrong: [
                  'I would be grateful if you can send me the details.',
                  'I would be grateful if you could to send me the details.',
                  'I would grateful if you could send me the details.',
                ],
                explainHe: 
                  'בבקשה פורמלית משתמשים ב-I would be grateful if you could + פועל בצורת שורש. חשוב לא לשכוח את be, ולא להוסיף to אחרי could.',
                hintEn: 'Check the polite request pattern word by word.',
              },
              story: {
                passageEn: 
                  'Before the contract signing, the director of a small software firm discovered that the offer of a rival company was ten percent lower than his own. His assistant suggested quietly raising the quality claims in the proposal to compensate. The director thought for a moment, then asked her to delete the idea and to print the original document. He lost the contract, but three months later the same client returned, saying it had heard that his firm never exaggerated.',
                passageHe: '',
                questionEn: 'Why did the client return?',
                questionHe: '',
                correct: 'It trusted the firm because of its honest reputation.',
                wrong: [
                  'It wanted a cheaper offer than before.',
                  'The rival company had refused to sign.',
                  'The director had raised the quality claims.',
                ],
              },
              storyHintEn: 'What did the client hear about the firm?',
            },
          },
        },
      },
      {
        icon: '👑',
        isBoss: true,
        titleEn: 'Boss: Bagrut Graduation Laurels & Future Horizon',
        titleHe: 'בוס: זרי הדפנה של הבגרות ואופק העתיד',
        storyHookHe:
          'משימת סיום הבגרות של כיתה י״ב! עליכם לשלוט בכל מונחי הליבה של Band III, להפגין אנגלית אקדמית ורשמית מלאה, ולסיים את מסע הבגרות בהצטיינות!',
        grammarTopic: 'Culmination Synthesis: Band III Mastery & Graduation Honors',
        skills: ['Band III Complete Mastery', 'Bagrut 5 Points Excellence', 'Graduation Triumph'],
        sentenceEn: 'Equipped with linguistic mastery and critical insight, high school graduates confidently step onto the global stage.',
        sentenceHe: 'מצוידים בשליטה לשונית ותובנה ביקורתית, בוגרי התיכון צועדים בביטחון אל הבמה הגלובלית.',
        vocab: [
          [
            'aspire',
            'verb',
            'לשאוף / לשאת עיניים אל',
            '✨',
            'Young scientists aspire to solve climate dilemmas.',
            'מדענים צעירים שואפים לפתור דילמות אקלים.',
          ],
          [
            'mastery',
            'noun',
            'שליטה מוחלטת / מומחיות',
            '🎓',
            'Linguistic mastery empowers eloquent communication.',
            'שליטה לשונית מעצימה תקשורת רהוטה.',
          ],
          [
            'triumph',
            'noun',
            'ניצחון מזהיר / הישג כביר',
            '🏆',
            'Earning full matriculation honors was a proud personal triumph.',
            'השגת תעודת בגרות בהצטיינות הייתה ניצחון אישי מעורר גאווה.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'mediocrity', translationHe: 'בינוניות' },
            { wordEn: 'despair', translationHe: 'ייאוש' },
          ],
          shortSentenceEn: 'Graduates step onto world stages.',
          shortSentenceHe: 'בוגרים צועדים אל במות העולם.',
          rule: {
            questionEn: 'What distinguishes an exceptional Bagrut performance across all modules?',
            correct: 'Rich lexical precision, syntactic variety, cohesive flow, and analytical rigor',
            wrong: [
              'Repeating simple words without any connectors or complex clauses',
              'Writing the shortest possible answers to finish early',
            ],
            explainHe:
              'הצטיינות בבגרות באנגלית (שאלונים E-G) נמדדת בדיוק לקסיקלי עשיר (Band III), מגוון תחבירי, זרימה לוגית עם מילות קישור, ועומק אנליטי.',
            hintHe: 'הצטיינות נמדדת באוצר מילים עשיר, מבנים מגוונים ומילות קישור, לא בתשובות קצרות.',
          },
          story: {
            passageEn:
              'At a national high school commencement ceremony, student valedictorians delivered addresses celebrating twelve years of scholastic dedication. Reflecting on their journey from early phonics in elementary school to analyzing complex literature and debating global ethics in Grade 12, the graduates stood united. Equipped with English fluency, they prepared to venture into academia, technological research, and international leadership.',
            passageHe:
              'בטקס סיום לימודי תיכון ארצי, נציגי התלמידים המצטיינים נשאו נאומים שחגגו שתים-עשרה שנות מסירות לימודית. בהביטם לאחור על מסעם מפונטיקה בסיסית בבית הספר היסודי ועד לניתוח ספרות מורכבת ודיבייט על אתיקה גלובלית בכיתה י״ב, הבוגרים עמדו מאוחדים. מצוידים בשטף בשפה האנגלית, הם נערכו לצאת אל עולמות האקדמיה, המחקר הטכנולוגי והמנהיגות הבינלאומית.',
            questionEn: 'What overarching journey did the graduates reflect upon during commencement?',
            questionHe: 'על איזה מסע כולל הרהרו הבוגרים במהלך טקס הסיום?',
            correct: 'From elementary phonics foundations to sophisticated literary analysis, debate, and global fluency.',
            wrong: ['A rapid two-week crash course with no academic challenges.', 'A strictly physical sports training camp without academic studies.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'Graduates aspire to study abroad.',
                wrong: ['Graduates aspire study abroad.'],
                explainHe: 'אחרי aspire בא to ואחריו פועל בצורת שורש: aspire to study.',
                hintHe: 'בדקו איזו מילה קטנה חסרה אחרי aspire.',
              },
              story: {
                passageEn: 
                  'Tomer finished school today. His family came to the ceremony. He felt proud and happy.',
                passageHe: 'תומר סיים היום את בית הספר. המשפחה שלו הגיעה לטקס. הוא הרגיש גאה ושמח.',
                questionEn: 'How did Tomer feel?',
                questionHe: 'איך תומר הרגיש?',
                correct: 'Proud and happy.',
                wrong: ['Tired and angry.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['vanish', 'tremble'],
                ['ignorance', 'vagueness'],
                ['disaster', 'scandal'],
              ],
            },
            master: {
              sentenceEn: 'The graduates celebrated their triumph and aspired to even greater goals.',
              sentenceHe: 'הבוגרים חגגו את ניצחונם ושאפו להשיג מטרות גדולות עוד יותר.',
              decoys: ['although', 'between'],
              voiceEn: 'Mastery requires years of patient practice.',
              voiceHe: 'שליטה דורשת שנים של תרגול סבלני.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Having completed her exams, she aspired to become a doctor.',
                wrong: [
                  'Having completed her exams, she aspired become a doctor.',
                  'Having completing her exams, she aspired to become a doctor.',
                  'Having completed her exams, she aspire to become a doctor.',
                ],
                explainHe: 
                  'aspire to + פועל בצורת שורש; Having + V3 מתאר פעולה שהסתיימה לפני כן; ובמשפט בעבר הפועל aspired.',
                hintEn: 'Check the verb forms and the word to.',
              },
              story: {
                passageEn: 
                  'On the last day of school, Oren found an old notebook in his locker. On the first page, written in twelve-year-old handwriting, was a list titled Things I Will Never Do. The list included speaking in front of the class, learning English properly, and leaving home to study. Oren smiled quietly, because that morning he had given the farewell speech in English, and next month he would fly abroad for university.',
                passageHe: '',
                questionEn: 'Why did Oren smile?',
                questionHe: '',
                correct: 'He had accomplished everything he once believed was impossible.',
                wrong: [
                  'The notebook contained his best exam answers.',
                  'He was afraid of the speech he had to give.',
                  'His teacher had written the list for him.',
                ],
              },
              storyHintEn: 'Compare the old list with what happened today.',
            },
          },
        },
      },
    ],
  },
];

export const grade12Curriculum = buildHighSchoolGrade('grade-12', units);
