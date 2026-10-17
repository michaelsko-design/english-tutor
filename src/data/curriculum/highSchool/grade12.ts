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
            'יתר על כן, סמינרים קבוצתיים משפרים את מיומנויות התקשורת של התלמיד.',
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
            'צוות המחקר עשה התקדמות ניכרת בסמסטר זה.',
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
        sentenceHe: 'דו״ח החקירה חשף ששטחים ירוקים עירוניים מניבים דיבידנדים נפשיים וכלכליים עמוקים.',
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
        sentenceHe: 'מנהיגים מוסריים מפגינים יושרה אישית בעת ניהול משא ומתן עסקי בעל הימור גבוה.',
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
        },
      },
    ],
  },
];

export const grade12Curriculum = buildHighSchoolGrade('grade-12', units);
