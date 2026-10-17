import { buildHighSchoolGrade, HighSchoolUnitSpec } from './builder';

const units: HighSchoolUnitSpec[] = [
  {
    titleEn: 'Unit 1: Literature, Cinema & Critical Minds',
    titleHe: 'פרק 1: ספרות, קולנוע ומחשבה ביקורתית',
    subtitleHe: 'אסטרטגיות חשיבה מסדר גבוה (HOTS), תנאי שלישי (Third Conditional) ושאלון E',
    badgeEmoji: '🎬',
    missions: [
      {
        icon: '🎭',
        titleEn: 'Critical Turning Points: Third Conditional',
        titleHe: 'נקודות מפנה קריטיות: תנאי שלישי',
        storyHookHe:
          'איך הבחירות של דמויות בספרות משפיעות על גורלן? נלמד על התנאי השלישי (Third Conditional: If + had + V3, would have + V3) לתיאור מצבי חרטה והחמצה בעבר.',
        grammarTopic: 'Third Conditional (If + had + V3, would have + V3)',
        skills: ['Third Conditional', 'HOTS Cause & Effect', 'Literary Analysis'],
        sentenceEn: 'If George had studied diligently, he would have achieved his dream earlier.',
        sentenceHe: 'אילו ג׳ורג׳ היה לומד בשקדנות, הוא היה מגשים את חלומו מוקדם יותר.',
        vocab: [
          [
            'significant',
            'adjective',
            'משמעותי / בעל חשיבות',
            '⭐',
            'The turning point had a significant impact on his life.',
            'לנקודת המפנה הייתה השפעה משמעותית על חייו.',
          ],
          [
            'motivation',
            'noun',
            'מוטיבציה / מניע פנימי',
            '🔥',
            'Understanding the protagonist\'s motivation explains his actions.',
            'הבנת המניע של הגיבור מסבירה את מעשיו.',
          ],
          [
            'dilemma',
            'noun',
            'דילמה / התלבטות קשה',
            '⚖️',
            'The young doctor faced an agonizing moral dilemma.',
            'הרופא הצעיר עמד בפני דילמה מוסרית מייסרת.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'unimportant', translationHe: 'חסר חשיבות' },
            { wordEn: 'coincidence', translationHe: 'צירוף מקרים' },
          ],
          shortSentenceEn: 'Hard work brings great dreams.',
          shortSentenceHe: 'עבודה קשה מביאה חלומות גדולים.',
          rule: {
            questionEn: 'What is the correct structure of the Third Conditional?',
            correct: 'If + had + V3, would have + V3',
            wrong: ['If + have + V3, will have + V3', 'If + would + V1, had + V3'],
            explainHe:
              'תנאי שלישי מתאר מצב בלתי אפשרי בעבר (חרטה / מה היה קורה אילו). המבנה הוא: If + had + V3, ולאחריו would have + V3.',
            hintHe: 'תנאי שלישי מדבר על עבר שאי אפשר לשנות, ולכן בשני החלקים יש V3. איזה מבנה מתאים לעבר רחוק ולא להווה או לעתיד?',
          },
          story: {
            passageEn:
              'In the classic drama All My Sons, Joe Keller made a fatal moral compromise during the war. If he had admitted the defects in the aircraft cylinders immediately, innocent pilots would not have perished. His inner guilt eventually caused the tragic disintegration of his family.',
            passageHe:
              'בדרמה הקלאסית ״כולם היו בניי״, ג׳ו קלר עשה פשרה מוסרית הרסנית במהלך המלחמה. אילו היה מודה בפגמים בראשי הצילינדר של המטוסים באופן מיידי, טייסים חפים מפשע לא היו נהרגים. רגשות האשמה הפנימיים שלו הובילו בסופו של דבר להתפרקות הטרגית של משפחתו.',
            questionEn: 'What would have happened if Joe Keller had reported the defects?',
            questionHe: 'מה היה קורה אילו ג׳ו קלר היה מדווח על הפגמים?',
            correct: 'Innocent pilots would not have perished in crashes.',
            wrong: ['His business would have doubled its profits.', 'He would have become a war hero.'],
          },
        },
      },
      {
        icon: '💡',
        titleEn: 'Explaining Motives: HOTS Cause and Effect',
        titleHe: 'הסבר מניעים: כלי חשיבה סיבה ותוצאה',
        storyHookHe:
          'בבגרות בספרות נדרש לנמק מדוע דמות פעלה בצורה מסוימת. נלמד להשתמש בכלי החשיבה Cause and Effect ובמילות קישור לתוצאה (Due to, Consequently, As a result).',
        grammarTopic: 'HOTS: Cause and Effect & Connectors of Result',
        skills: ['HOTS Cause & Effect', 'Literature Connectors', 'Module F/E'],
        sentenceEn: 'The protagonist made a regretful decision because economic hardship pressured his family.',
        sentenceHe: 'הגיבור קיבל החלטה מעציבה משום שמצוקה כלכלית לחצה על משפחתו.',
        vocab: [
          [
            'hardship',
            'noun',
            'מצוקה / קושי כלכלי',
            '🌧️',
            'Many families overcame severe economic hardship.',
            'משפחות רבות התגברו על מצוקה כלכלית חמורה.',
          ],
          [
            'inevitable',
            'adjective',
            'בלתי נמנע',
            '⏳',
            'Change in society is natural and inevitable.',
            'שינוי בחברה הוא טבעי ובלתי נמנע.',
          ],
          [
            'consequence',
            'noun',
            'השלכה / תוצאה ישירה',
            '🔗',
            'Every action carries moral consequences.',
            'לכל פעולה יש השלכות מוסריות.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'prosperity', translationHe: 'שגשוג' },
            { wordEn: 'coincidence', translationHe: 'מקריות' },
          ],
          shortSentenceEn: 'Actions carry moral consequences.',
          shortSentenceHe: 'למעשים יש השלכות מוסריות.',
          rule: {
            questionEn: 'Which phrase is correctly followed by a NOUN phrase (not a full sentence)?',
            correct: 'Due to / Because of',
            wrong: ['Because', 'Since'],
            explainHe:
              'הביטויים Due to ו-Because of נדרשים לקבל שם עצם (Due to the storm), בעוד ש-Because ו-Since דורשים משפט שלם עם נושא ופועל (Because it rained).',
            hintHe: 'כדאי לנסות כל אפשרות עם the storm אחריה: איזו נשמעת נכון בלי נושא ופועל?',
          },
          story: {
            passageEn:
              'In George Orwell\'s Animal Farm, the animals rebelled due to the farmer\'s neglect and cruelty. As a result of their successful uprising, they established rules based on equality. However, because the pigs gradually centralized authority, the farm became worse than before.',
            passageHe:
              'ב״חוות החיות״ של ג׳ורג׳ אורוול, בעלי החיים מרדו בשל הזנחתו ואכזריותו של החוואי. כתוצאה מהתקוממותם המוצלחת, הם קבעו כללים המבוססים על שוויון. עם זאת, מכיוון שהחזירים ריכזו בהדרגה את הסמכויות בידיהם, החווה הפכה לגרועה יותר מבעבר.',
            questionEn: 'What directly caused the animals to stage their initial uprising?',
            questionHe: 'מה גרם באופן ישיר לבעלי החיים לערוך את המרד הראשוני שלהם?',
            correct: 'The farmer\'s continuous neglect and cruel mistreatment.',
            wrong: ['A harsh winter that destroyed their barn.', 'An attack by neighboring wild predators.'],
          },
        },
      },
      {
        icon: '👑',
        isBoss: true,
        titleEn: 'Boss: Literature Analysis: The Road Not Taken',
        titleHe: 'בוס: ניתוח ספרות — השביל שלא נבחר',
        storyHookHe:
          'משימת בוס עיונית: עליכם לנתח את השיר המפורסם של רוברט פרוסט, ליישם את כלי החשיבה Distinguishing Different Perspectives ולענות על שאלות ברמת בגרות!',
        grammarTopic: 'Third Conditional & Literary Synthesis',
        skills: ['HOTS Mastery', 'Poetry Analysis', 'Bagrut Literature'],
        sentenceEn: 'The traveler realized that choosing the less traveled road made all the difference.',
        sentenceHe: 'הנוסע הבין שהבחירה בשביל הפחות מטויל עשתה את כל ההבדל.',
        vocab: [
          [
            'diverge',
            'verb',
            'להתפצל / לפנות לכיוונים שונים',
            '🌿',
            'Two roads diverged in a yellow wood.',
            'שני שבילים התפצלו ביער צהוב.',
          ],
          [
            'profound',
            'adjective',
            'עמוק / בעל משמעות עמוקה',
            '🌊',
            'The poem carries a profound philosophical message.',
            'השיר נושא מסר פילוסופי עמוק.',
          ],
          [
            'contemplate',
            'verb',
            'להרהר / לשקול בכובד ראש',
            '🤔',
            'He contemplated the options before choosing his path.',
            'הוא הרהר באפשרויות לפני שבחר את דרכו.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'superficial', translationHe: 'שטחי' },
            { wordEn: 'converge', translationHe: 'להתמזג / להתכנס' },
          ],
          shortSentenceEn: 'Two roads diverged clearly.',
          shortSentenceHe: 'שני שבילים התפצלו בבירור.',
          rule: {
            questionEn: 'Which sentence correctly expresses past regret using Third Conditional?',
            correct: 'If I had taken the other road, my life would have been very different.',
            wrong: [
              'If I take the other road, my life will be different.',
              'If I took the other road, my life would be different.',
            ],
            explainHe:
              'תנאי שלישי מביע חרטה על אירוע שהתרחש בעבר הרחוק באמצעות had taken ולאחריו would have been.',
            hintHe: 'חרטה על העבר היא תנאי שלישי: כדאי לחפש V3 בשני חלקי המשפט.',
          },
          story: {
            passageEn:
              'Standing at a fork in an autumnal forest, Robert Frost contemplates two paths that look almost identical. By selecting the grassy path that wanted wear, the speaker acknowledges that he could not travel both. Years later, he looks back with a sigh, knowing that life choices permanently shape our identity.',
            passageHe:
              'בעומדו בצומת דרכים ביער סתווי, רוברט פרוסט מהרהר בשני שבילים הנראים כמעט זהים. בבחירתו בשביל העשבוני שדרש הליכה, הדובר מכיר בכך שלא יכול היה ללכת בשניהם. שנים מאוחר יותר, הוא מביט לאחור באנחה, ביודעו שבחירות החיים מעצבות את זהותנו לצמיתות.',
            questionEn: 'Why could the traveler not explore both paths simultaneously?',
            questionHe: 'מדוע לא יכול היה הנוסע לחקור את שני השבילים בו-זמנית?',
            correct: 'Because one person cannot travel two divergent life roads.',
            wrong: ['Because the second road was blocked by fallen trees.', 'Because a thunderstorm forced him to return.'],
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 2: Perspectives & Comparative Literature',
    titleHe: 'פרק 2: נקודות מבט וספרות משווה',
    subtitleHe: 'הבחנה בין נקודות מבט (Different Perspectives), השוואה וניגוד ומילות קישור',
    badgeEmoji: '🎭',
    missions: [
      {
        icon: '👥',
        titleEn: 'Two Sides: Distinguishing Perspectives',
        titleHe: 'שני צדדים: הבחנה בין נקודות מבט',
        storyHookHe:
          'איך שני אנשים חווים את אותו אירוע באופן שונה לחלוטין? נלמד ליישם את ה-HOTS של Distinguishing Different Perspectives ומילות קישור של ניגוד (Whereas, While, On the other hand).',
        grammarTopic: 'HOTS: Distinguishing Perspectives & Contrast Connectors',
        skills: ['Different Perspectives', 'Contrast Connectors', 'Empathy in Literature'],
        sentenceEn: 'While the father prioritized financial security, his daughter valued artistic expression.',
        sentenceHe: 'בעוד שהאב נתן עדיפות לביטחון כלכלי, בתו העריכה ביטוי אמנותי.',
        vocab: [
          [
            'perspective',
            'noun',
            'נקודת מבט / השקפה',
            '👁️',
            'Reading literature broadens our cultural perspective.',
            'קריאת ספרות מרחיבה את נקודת המבט התרבותית שלנו.',
          ],
          [
            'contradict',
            'verb',
            'לסתור / לעמוד בניגוד',
            '↔️',
            'Her private feelings contradicted her public speech.',
            'רגשותיה הפרטיים סתרו את נאומה הפומבי.',
          ],
          [
            'empathy',
            'noun',
            'אמפתיה / הבנה רגשית',
            '❤️',
            'Empathy allows us to relate to diverse characters.',
            'אמפתיה מאפשרת לנו להזדהות עם דמויות מגוונות.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'apathy', translationHe: 'אדישות מוחלטת' },
            { wordEn: 'arrogance', translationHe: 'יוהרה / שחצנות' },
          ],
          shortSentenceEn: 'Literature builds strong empathy.',
          shortSentenceHe: 'ספרות בונה אמפתיה חזקה.',
          rule: {
            questionEn: 'Which connector indicates a contrast between two distinct ideas?',
            correct: 'Whereas / On the other hand',
            wrong: ['Furthermore / In addition', 'Consequently / Therefore'],
            explainHe:
              'המילים Whereas ו-On the other hand משמשות להצגת ניגוד או הבדל בין שתי עמדות או רעיונות שונים.',
            hintHe: 'מחפשים מילים שמציגות ניגוד (לעומת זאת), לא הוספה ולא תוצאה.',
          },
          story: {
            passageEn:
              'In modern fiction, authors frequently employ alternating chapter narrators. In one chapter, a teacher views a rebellious student as undisciplined and disruptive. In the following chapter, the narrative shifts to the student\'s perspective, revealing that he works sixteen hours weekly to support his ailing grandmother.',
            passageHe:
              'בספרות מודרנית, מחברים משתמשים לעיתים קרובות במספרים מתחלפים בפרקים. בפרק אחד, מורה רואה תלמיד מרדן כחסר משמעת ומפריע. בפרק הבא, הנרטיב עובר לנקודת מבטו של התלמיד, וחושף כי הוא עובד שש-עשרה שעות שבועיות כדי לפרנס את סבתו החולה.',
            questionEn: 'How does the shift in perspective change the reader\'s understanding?',
            questionHe: 'כיצד השינוי בנקודת המבט משנה את הבנת הקורא?',
            correct: 'It reveals the student\'s hidden family struggles and generates empathy.',
            wrong: ['It shows the student wanted to fail high school on purpose.', 'It proves the teacher was deliberately cruel.'],
          },
        },
      },
      {
        icon: '⚖️',
        titleEn: 'Comparing & Contrasting Themes',
        titleHe: 'השוואה וניגוד של מוטיבים',
        storyHookHe:
          'נשווה בין שתי יצירות ספרותיות או שתי דמויות מרכזיות. נלמד להשתמש בביטויי השוואה מדויקים: Similarly, Likewise לעומת In contrast to, Unlike.',
        grammarTopic: 'HOTS: Comparing and Contrasting Across Texts',
        skills: ['Comparing & Contrasting', 'Literary Motifs', 'Essay Transitions'],
        sentenceEn: 'Both authors examine societal pressure, yet their protagonists choose opposite paths.',
        sentenceHe: 'שני המחברים בוחנים לחץ חברתי, אך גיבוריהם בוחרים בדרכים מנוגדות.',
        vocab: [
          [
            'distinction',
            'noun',
            'הבחנה / הבדל מובהק',
            '🔍',
            'We must make a clear distinction between myth and fact.',
            'עלינו לעשות הבחנה ברורה בין מיתוס לעובדה.',
          ],
          [
            'resemble',
            'verb',
            'להידמות ל- / להיראות כמו',
            '🪞',
            'The protagonist closely resembles the author as a youth.',
            'הגיבור דומה מאוד למחבר בצעירותו.',
          ],
          [
            'criticism',
            'noun',
            'ביקורת',
            '✍️',
            'The novel received praise for its social criticism.',
            'הרומן זכה לשבחים על הביקורת החברתית שבו.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'conformity', translationHe: 'קונפורמיות / ציות עיוור' },
            { wordEn: 'ignorance', translationHe: 'בערות / חוסר ידע' },
          ],
          shortSentenceEn: 'Authors examine social pressure.',
          shortSentenceHe: 'מחברים בוחנים לחץ חברתי.',
          rule: {
            questionEn: 'Which transition word is used to introduce a SIMILARITY?',
            correct: 'Similarly',
            wrong: ['In contrast', 'Despite this'],
            explainHe:
              'המילה Similarly (בדומה לכך) משמשת להצגת דמיון בין שתי תופעות, דמויות או יצירות ספרותיות.',
            hintHe: 'מחפשים מילה שמשמעותה בדומה לכך, ולא ניגוד או ויתור.',
          },
          story: {
            passageEn:
              'A famous comparative essay juxtaposes Harper Lee\'s To Kill a Mockingbird with Lorraine Hansberry\'s A Raisin in the Sun. Both literary masterpieces confront systemic racial prejudice in mid-twentieth-century America. However, while Lee filters the narrative through the innocent gaze of young Scout, Hansberry anchors her drama in the domestic intimacy of the Younger family apartment.',
            passageHe:
              'מאמר השוואתי מפורסם מעמיד זה לצד זה את ״אל תיגע בזמיר״ של הרפר לי ואת ״צימוק בשמש״ של לוריין הנסברי. שתי יצירות המופת הספרותיות מתעמתות עם אפליה גזעית ממסדית באמריקה של אמצע המאה העשרים. עם זאת, בעוד שלי מסננת את הנרטיב דרך מבטה התמים של סקאוט הצעירה, הנסברי מעגנת את הדרמה שלה באינטימיות הביתית של דירת משפחת יאנגר.',
            questionEn: 'What fundamental similarity links both literary works?',
            questionHe: 'איזה דמיון מהותי מקשר בין שתי היצירות הספרותיות?',
            correct: 'Both critically confront racial prejudice in mid-twentieth-century America.',
            wrong: ['Both were written as poetic ballads about European royalty.', 'Both took place exclusively in deep wilderness camps.'],
          },
        },
      },
      {
        icon: '👑',
        isBoss: true,
        titleEn: 'Boss: The Unseen Literary Essay',
        titleHe: 'בוס: חיבור ספרותי משווה — אתגר שאלון F/E',
        storyHookHe:
          'משימת בוס עיונית: עליכם לנתח טקסט ספרותי עמוק, לשלב מונחי HOTS ומילות קישור אקדמיות, ולהשיב על שאלות אנסין מורכבות!',
        grammarTopic: 'Advanced Literary Synthesis & HOTS Integration',
        skills: ['Literary Synthesis', 'Symbolism & Allegory', 'Bagrut HOTS Exam'],
        sentenceEn: 'By examining multiple perspectives, readers discover the deeper moral themes of the story.',
        sentenceHe: 'על ידי בחינת נקודות מבט מרובות, הקוראים מגלים את המוטיבים המוסריים העמוקים של הסיפור.',
        vocab: [
          [
            'insight',
            'noun',
            'תובנה / ראייה מעמיקה',
            '💡',
            'The poem offers profound insight into human nature.',
            'השיר מציע תובנה עמוקה על טבע האדם.',
          ],
          [
            'allegory',
            'noun',
            'אלגוריה / משל סמלי',
            '📖',
            'The novella serves as a political allegory.',
            'הנובלה משמשת כאלגוריה פוליטית.',
          ],
          [
            'symbolism',
            'noun',
            'סמליות',
            '🕊️',
            'The white dove is a recognized symbol of peace.',
            'היונה הלבנה היא סמל מוכר לשלום.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'literalism', translationHe: 'פשטנות / היצמדות למובן המילולי' },
            { wordEn: 'indifference', translationHe: 'אדישות' },
          ],
          shortSentenceEn: 'Readers discover profound insights.',
          shortSentenceHe: 'קוראים מגלים תובנות עמוקות.',
          rule: {
            questionEn: 'Which HOTS is demonstrated when explaining what a symbol represents?',
            correct: 'Uncovering Motives / Interpreting Symbolism',
            wrong: ['Chronological Ordering', 'Fact Counting'],
            explainHe:
              'פענוח סמליות ביצירה ספרותית הוא תהליך חשיבה פרשני מסדר גבוה שבו מקשרים בין אלמנט קונקרטי למשמעות מופשטת.',
            hintHe: 'סמל הוא דבר מוחשי שמייצג רעיון מופשט. איזו מיומנות מפרשת משמעות נסתרת, ולא סופרת או מסדרת?',
          },
          story: {
            passageEn:
              'In Shirley Jackson\'s chilling short story The Lottery, an ordinary farming community gathers on a bright June morning. At first, the event resembles a harmless civic picnic. Jackson employs intense foreshadowing and dramatic irony, forcing the reader to examine how unthinking adherence to tradition can lead civilized neighbors to commit horrific acts.',
            passageHe:
              'בסיפורה הקצר ומעורר המחשבה של שירלי ג׳קסון ״הגרלה״, קהילת חקלאים רגילה מתאספת בבוקר יוני בהיר. תחילה, האירוע נראה כמו פיקניק אזרחי תמים. ג׳קסון משתמשת ברמזים מקדימים עוצמתיים ובאירוניה דרמטית, ומאלצת את הקורא לבחון כיצד היצמדות עיוורת למסורת עלולה להוביל שכנים תרבותיים לבצע מעשים מחרידים.',
            questionEn: 'What is the central social critique conveyed through Jackson\'s story?',
            questionHe: 'מהי הביקורת החברתית המרכזית המועברת דרך סיפורה של ג׳קסון?',
            correct: 'The danger of blindly obeying cruel traditions without moral questioning.',
            wrong: ['The difficulty of farming crops in dry summer conditions.', 'The importance of purchasing lottery tickets regularly.'],
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 3: Modals in the Past & Turning Points',
    titleHe: 'פרק 3: מודלים בעבר ונקודות מפנה היסטוריות',
    subtitleHe: 'הסקת מסקנות וחרטה בעבר (should have, must have, could have + V3)',
    badgeEmoji: '⏳',
    missions: [
      {
        icon: '🛡️',
        titleEn: 'Looking Back: Should Have & Regret',
        titleHe: 'מבט לאחור: חרטה ועצות בדיעבד',
        storyHookHe:
          'מה היינו עושים אחרת בהיסטוריה? נלמד להשתמש ב-should have + V3 לביקורת על פעולה שנעשתה בעבר או חרטה על הזדמנות שפוספסה.',
        grammarTopic: 'Modals in the Past: Should have + V3',
        skills: ['Past Modals of Regret', 'Historical Analysis', 'Critical Evaluation'],
        sentenceEn: 'The commander should have retreated before the harsh winter storms arrived.',
        sentenceHe: 'המפקד היה צריך לסגת לפני שסופות החורף הקשות הגיעו.',
        vocab: [
          [
            'crucial',
            'adjective',
            'מכריע / בעל חשיבות עליונה',
            '⚡',
            'Timely communication is crucial during emergencies.',
            'תקשורת בזמן אמת היא מכרעת במצבי חירום.',
          ],
          [
            'remorse',
            'noun',
            'חרטה עמוקה / נקיפות מצפון',
            '💔',
            'The leader expressed sincere remorse for past errors.',
            'המנהיג הביע חרטה כנה על שגיאות העבר.',
          ],
          [
            'overlook',
            'verb',
            'להתעלם מ- / להחמיץ בטעות',
            '🙈',
            'Do not overlook small warning signs in data.',
            'אל תתעלמו מסימני אזהרה קטנים בנתונים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'trivial', translationHe: 'שולי / חסר ערך' },
            { wordEn: 'celebrate', translationHe: 'לחגוג' },
          ],
          shortSentenceEn: 'They should have retreated earlier.',
          shortSentenceHe: 'הם היו צריכים לסגת מוקדם יותר.',
          rule: {
            questionEn: 'Which sentence correctly expresses a past regret or criticism?',
            correct: 'We should have double-checked the navigational maps.',
            wrong: [
              'We should double-checked the navigational maps.',
              'We should had checked the navigational maps.',
            ],
            explainHe:
              'לציון חרטה או ביקורת על העבר, המבנה הוא should have ולאחריו צורת V3 של הפועל (should have checked).',
            hintHe: 'חרטה על העבר: אחרי should צריך עוד מילה אחת, ואז V3.',
          },
          story: {
            passageEn:
              'In 1912, the Titanic struck an iceberg in the North Atlantic. Historical maritime inquiries concluded that the captain should have reduced speed following radio ice warnings. Furthermore, maritime authorities should have mandated sufficient lifeboats for all souls aboard.',
            passageHe:
              'בשנת 1912, הטיטניק פגעה בקרחון בצפון האוקיינוס האטלנטי. ועדות חקירה ימיות היסטוריות הגיעו למסקנה כי הקפטן היה צריך להפחית מהירות בעקבות אזהרות קרח ברדיו. יתרה מזאת, רשויות הספנות היו צריכות לחייב סירות הצלה בכמות מספקת לכל הנוסעים על הסיפון.',
            questionEn: 'What crucial action should the captain have taken according to inquiries?',
            questionHe: 'איזו פעולה מכרעת היה על הקפטן לנקוט לפי ממצאי החקירה?',
            correct: 'He should have reduced cruising speed after ice warnings were received.',
            wrong: ['He should have steered the ship directly into the Arctic circle.', 'He should have turned off the ship\'s engines completely for days.'],
          },
        },
      },
      {
        icon: '🏛️',
        titleEn: 'Piecing Past Clues: Must Have & Couldn\'t Have',
        titleHe: 'מרכיבים רמזים מהעבר: ודאות בעבר',
        storyHookHe:
          'איך ארכאולוגים פותרים תעלומות עתיקות? נלמד להשתמש ב-must have + V3 כשאנחנו בטוחים ב-99% שמשהו קרה בעבר, וב-couldn\'t have כשזה בלתי אפשרי.',
        grammarTopic: 'Modals of Past Deduction: Must have & Couldn\'t have + V3',
        skills: ['Past Deduction', 'Archaeology & History', 'Logical Reconstruction'],
        sentenceEn: 'The ancient engineers must have possessed advanced mathematics to align the monuments so precisely.',
        sentenceHe: 'המהנדסים הקדמונים חייבים היו להחזיק במתמטיקה מתקדמת כדי ליישר את המונומנטים בצורה כה מדויקת.',
        vocab: [
          [
            'align',
            'verb',
            'ליישר / לתאם בדיוק',
            '📐',
            'The stones align perfectly with the summer solstice.',
            'האבנים מתיישרות באופן מושלם עם יום היפוך הקיץ.',
          ],
          [
            'monument',
            'noun',
            'אנדרטה / מבנה עתיק מפואר',
            '🏛️',
            'The marble monument stood for three thousand years.',
            'מונומנט השיש עמד במשך שלושת אלפים שנה.',
          ],
          [
            'flourish',
            'verb',
            'לשגשג / לפרוח',
            '🌺',
            'The trading civilization flourished along the Mediterranean coast.',
            'תרבות המסחר שגשגה לאורך חוף הים התיכון.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'decay', translationHe: 'ריקבון / התפוררות' },
            { wordEn: 'disintegrate', translationHe: 'להתפרק' },
          ],
          shortSentenceEn: 'Ancient civilizations flourished brilliantly.',
          shortSentenceHe: 'תרבויות עתיקות שגשגו להפליא.',
          rule: {
            questionEn: 'Which modal structure expresses certainty that an event occurred in the past?',
            correct: 'must have + V3',
            wrong: ['might have + V1', 'could have + V2'],
            explainHe:
              'כדי להביע ודאות לוגית חזקה לגבי פעולה בעבר, משתמשים ב-must have + V3 (למשל: He must have forgotten his keys).',
            hintHe: 'ודאות חזקה (חייב להיות ש...) על משהו שכבר קרה: איזה מודל מבטא ודאות, ואיזו צורת פועל מתאימה לעבר?',
          },
          story: {
            passageEn:
              'At Stonehenge in England, massive megaliths weighing up to twenty-five tons were transported from quarries located over two hundred kilometers away. Archaeologists argue that Neolithic builders couldn\'t have used iron tools because metallurgy had not yet developed. They must have relied on wooden sledges, river rafts, and thousands of organized workers.',
            passageHe:
              'בסטונהנג׳ שבאנגליה, אבני ענק במשקל של עד עשרים וחמישה טון הועברו ממחצבות הממוקמות במרחק של יותר ממאתיים קילומטרים. ארכאולוגים טוענים כי בונים בתקופה הנאוליתית לא יכלו להשתמש בכלי ברזל כיוון שמטלורגיה טרם התפתחה. הם חייבים היו להסתמך על מזחלות עץ, רפסודות נהר ואלפי פועלים מאורגנים.',
            questionEn: 'Why couldn\'t the Neolithic builders have used iron chisels?',
            questionHe: 'מדוע הבונים הנאוליתיים לא יכלו להשתמש באיזמלי ברזל?',
            correct: 'Because iron metallurgy had not yet been invented in Britain.',
            wrong: ['Because iron was considered sacred and forbidden to touch.', 'Because the rocks were too soft for metal contact.'],
          },
        },
      },
      {
        icon: '👑',
        isBoss: true,
        titleEn: 'Boss: Historic Turning Points Unseen',
        titleHe: 'בוס: נקודות מפנה בהיסטוריה — אתגר אנסין שאלון E',
        storyHookHe:
          'משימת בוס עיונית: עליכם לנתח טקסט היסטורי על מהפכת הדפוס של גוטנברג, לשלב מודלים בעבר ולהשיב על שאלות בגרות מורכבות!',
        grammarTopic: 'Past Modals Synthesis & Historical Unseen',
        skills: ['Past Modals Synthesis', 'Historical Unseen', 'Module E Exam Readiness'],
        sentenceEn: 'Early inventors could not have anticipated how global printing would revolutionize education.',
        sentenceHe: 'הממציאים המוקדמים לא יכלו לחזות כיצד הדפוס העולמי יחולל מהפכה בחינוך.',
        vocab: [
          [
            'anticipate',
            'verb',
            'לצפות מראש / לחזות',
            '🔮',
            'Economists anticipated a swift financial recovery.',
            'כלכלנים צפו מראש התאוששות פיננסית מהירה.',
          ],
          [
            'transform',
            'verb',
            'לשנות לחלוטין / להתמיר',
            '🦋',
            'Movable type transformed the distribution of knowledge.',
            'הדפוס בעזרת אותיות מיטלטלות שינה לחלוטין את הפצת הידע.',
          ],
          [
            'legacy',
            'noun',
            'מורשת / נכס תרבותי',
            '📜',
            'The scientist left an enduring legacy of discovery.',
            'המדען הותיר מורשת מתמשכת של תגליות.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'stagnate', translationHe: 'לקפוא על השמרים' },
            { wordEn: 'vanish', translationHe: 'להיעלם כלא היה' },
          ],
          shortSentenceEn: 'Printing transformed world education.',
          shortSentenceHe: 'הדפוס שינה את החינוך העולמי.',
          rule: {
            questionEn: 'Complete the sentence: "Without the invention, books _______ so accessible."',
            correct: 'couldn\'t have become',
            wrong: ['couldn\'t became', 'could not becoming'],
            explainHe:
              'לתיאור תוצאה בלתי אפשרית בעבר משתמשים ב-couldn\'t have + V3 (couldn\'t have become).',
            hintHe: 'תוצאה בלתי אפשרית בעבר: אחרי couldn’t צריך מבנה של עבר מושלם (מילת עזר + V3).',
          },
          story: {
            passageEn:
              'Before Johannes Gutenberg perfected movable metal type in 1440, every single volume had to be handwritten by scribes, requiring up to a year per copy. Gutenberg must have realized that mechanizing typography would democratize literacy. Within five decades, over twenty million books were printed, sparking the Renaissance across Europe.',
            passageHe:
              'לפני שיוהנס גוטנברג שכלל את האותיות המיטלטלות ממתכת בשנת 1440, כל כרך בודד נאלץ להיכתב ידנית על ידי סופרים, תהליך שארך עד שנה לעותק. גוטנברג חייב היה להבין שמיכון הדפוס ידמוקרטיזציה של ידיעת קרוא וכתוב. תוך חמישה עשורים הודפסו למעלה מעשרים מיליון ספרים, מה שהצית את תקופת הרנסאנס ברחבי אירופה.',
            questionEn: 'How did Gutenberg\'s invention impact the Renaissance in Europe?',
            questionHe: 'כיצד השפיעה המצאתו של גוטנברג על הרנסאנס באירופה?',
            correct: 'By making books widely accessible, dramatically expanding literacy and ideas.',
            wrong: ['By banning the publication of religious scriptures.', 'By forcing schools to close printing presses.'],
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 4: Module E Reading Comprehension & Scientific Unseens',
    titleHe: 'פרק 4: שליטה בשאלון E ואנסין מדעי',
    subtitleHe: 'אסטרטגיות קריאה אקדמיות, הסקת משמעות מהקשר ופיענוח נתונים',
    badgeEmoji: '📝',
    missions: [
      {
        icon: '🧠',
        titleEn: 'Skimming, Scanning & Contextual Clues',
        titleHe: 'סריקה, רפרוף והסקה מהקשר',
        storyHookHe:
          'איך קוראים טקסט אקדמי בזמן קצר בשאלון E? נלמד מיומנויות Skimming (רפרוף לרעיון מרכזי) ו-Scanning (איתור נתון מספרי ספציפי) לצד הרחבת אוצר מילים Band III.',
        grammarTopic: 'Academic Reading Strategies: Skimming & Context Clues',
        skills: ['Skimming & Scanning', 'Contextual Guessing', 'Module E Strategies'],
        sentenceEn: 'Researchers discovered that adequate sleep substantially enhances cognitive performance during exams.',
        sentenceHe: 'חוקרים גילו ששינה מספקת משפרת באופן מהותי את הביצועים הקוגניטיביים בזמן בחינות.',
        vocab: [
          [
            'adequate',
            'adjective',
            'הולם / מספק',
            '🛌',
            'Eight hours of rest is adequate for young adolescents.',
            'שמונה שעות מנוחה הן מספקות עבור בני נוער צעירים.',
          ],
          [
            'enhance',
            'verb',
            'להגביר / לשפר',
            '📈',
            'Physical exercise enhances concentration and mental focus.',
            'פעילות גופנית משפרת את הריכוז והמיקוד המנטלי.',
          ],
          [
            'cognitive',
            'adjective',
            'קוגניטיבי / הכרתי',
            '🧠',
            'Cognitive development progresses rapidly in teenage years.',
            'התפתחות קוגניטיבית מתקדמת במהירות בשנות העשרה.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'insufficient', translationHe: 'בלתי מספק' },
            { wordEn: 'diminish', translationHe: 'להפחית / להחליש' },
          ],
          shortSentenceEn: 'Sleep enhances mental focus.',
          shortSentenceHe: 'שינה משפרת מיקוד מנטלי.',
          rule: {
            questionEn: 'What is the primary objective of "Scanning" in an unseen reading task?',
            correct: 'Searching quickly for a specific word, date, or fact',
            wrong: ['Reading every word slowly from beginning to end', 'Translating the passage into another language'],
            explainHe:
              'סריקה (Scanning) היא טכניקה לאיתור מהיר של מילה, שם, תאריך או עובדה ספציפית בטקסט מבלי לקרוא כל מילה.',
            hintHe: 'Scanning היא סריקה מהירה כדי למצוא פרט אחד, לא קריאה של כל מילה ולא תרגום.',
          },
          story: {
            passageEn:
              'A landmark clinical study conducted by Oxford neuroscientists tracked five hundred high school pupils over an academic term. Students who averaged at least eight hours of sleep consistently scored fifteen percent higher on analytic tests. The researchers concluded that deep sleep enables memory consolidation, converting daily learning into permanent neural pathways.',
            passageHe:
              'מחקר קליני פורץ דרך שנערך על ידי חוקרי מוח באוקספורד עקב אחר חמש מאות תלמידי תיכון במהלך סמסטר לימודים. תלמידים שישנו בממוצע לפחות שמונה שעות השיגו בעקביות ציונים גבוהים בחמישה-עשר אחוזים במבחנים אנליטיים. החוקרים הסיקו כי שינה עמוקה מאפשרת גיבוש זיכרון, והופכת למידה יומיומית למסלולים עצביים קבועים.',
            questionEn: 'According to the Oxford study, what does deep sleep accomplish?',
            questionHe: 'לפי המחקר של אוקספורד, מה משיגה שינה עמוקה?',
            correct: 'It facilitates memory consolidation, converting daily facts into long-term retention.',
            wrong: ['It lowers analytic scores by creating excessive tiredness.', 'It makes students forget unimportant vocabulary completely.'],
          },
        },
      },
      {
        icon: '📊',
        titleEn: 'Decoding Graphs & Survey Unseens',
        titleHe: 'פיענוח גרפים, סקרים ונתונים סטטיסטיים',
        storyHookHe:
          'בשאלון E מופיעים לעיתים גרפים ומחקרים סטטיסטיים. נלמד לתרגם נתונים מספריים למילים באנגלית: demonstrated, predominantly, majority לעומת minority.',
        grammarTopic: 'Describing Trends, Statistics & Survey Results',
        skills: ['Interpreting Graphs', 'Survey Vocabulary', 'Statistical Analysis'],
        sentenceEn: 'The demographic survey demonstrated that youth volunteering increased predominantly in rural districts.',
        sentenceHe: 'הסקר הדמוגרפי הוכיח שהתנדבות בני נוער גדלה בעיקר במחוזות כפריים.',
        vocab: [
          [
            'demonstrate',
            'verb',
            'להדגים / להוכיח',
            '📊',
            'The graphs demonstrate an upward trend in renewable power.',
            'הגרפים מדגימים מגמת עלייה באנרגיה מתחדשת.',
          ],
          [
            'predominantly',
            'adverb',
            'בעיקר / ברובו המכריע',
            '🎯',
            'The participants were predominantly high school graduates.',
            'המשתתפים היו ברובם המכריע בוגרי תיכון.',
          ],
          [
            'implication',
            'noun',
            'השלכה / משמעות נלווית',
            '💡',
            'The survey has serious implications for urban planning.',
            'לסקר יש השלכות רציניות על תכנון עירוני.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'marginally', translationHe: 'באופן זניח' },
            { wordEn: 'disprove', translationHe: 'להפריך' },
          ],
          shortSentenceEn: 'The survey demonstrated high growth.',
          shortSentenceHe: 'הסקר הדגים צמיחה גבוהה.',
          rule: {
            questionEn: 'Which word means "the smaller number or part, especially less than 50%"?',
            correct: 'Minority',
            wrong: ['Majority', 'Plurality'],
            explainHe:
              'המילה minority מציינת מיעוט (פחות מ-50%), בעוד ש-majority פירושה רוב.',
            hintHe: 'פחות מחצי. כדאי לחשוב על מילה שקרובה ל-minor (קטן, משני).',
          },
          story: {
            passageEn:
              'A national youth council published an infographic documenting changes in teenage recreational habits. Between 2018 and 2024, daily screen entertainment rose from three to nearly six hours. However, outdoor sports participation did not collapse; instead, adolescents predominantly replaced traditional television viewing with interactive streaming and online gaming.',
            passageHe:
              'מועצת נוער ארצית פרסמה אינפוגרפיקה המתעדת שינויים בהרגלי הפנאי של בני נוער. בין 2018 ל-2024, צפייה יומית במסכים עלתה משלוש לכמעט שש שעות. עם זאת, ההשתתפות בספורט באוויר הפתוח לא קרסה; במקום זאת, בני נוער החליפו בעיקר את הצפייה המסורתית בטלוויזיה בסטרימינג אינטראקטיבי ומשחקי רשת.',
            questionEn: 'What did the infographic show about outdoor sports participation?',
            questionHe: 'מה הראתה האינפוגרפיקה על ההשתתפות בספורט בחוץ?',
            correct: 'It remained resilient, because screens mostly replaced television viewing.',
            wrong: ['It fell to zero percent across the entire country.', 'It was completely outlawed by local youth councils.'],
          },
        },
      },
      {
        icon: '👑',
        isBoss: true,
        titleEn: 'Boss: Full Module E Exam Simulation',
        titleHe: 'בוס: סימולציית בחינת בגרות שאלון E מלאה',
        storyHookHe:
          'משימת בוס עיונית: עליכם לפצח אנסין מדעי מלא ברמת שאלון E של משרד החינוך על גמישות מוחית ושפות, ולענות על שאלות איתור פרטים והסקה!',
        grammarTopic: 'Module E Full Synthesis & Question Strategies',
        skills: ['Module E Mastery', 'Inference Questions', 'Complex Academic Lexicon'],
        sentenceEn: 'The comprehensive findings proved that bilingual education fosters remarkable cognitive flexibility in adolescents.',
        sentenceHe: 'הממצאים המקיפים הוכיחו שחינוך דו-לשוני מטפח גמישות קוגניטיבית יוצאת דופן בקרב בני נוער.',
        vocab: [
          [
            'comprehensive',
            'adjective',
            'מקיף / כולל',
            '📚',
            'The university published a comprehensive guide to exams.',
            'האוניברסיטה פרסמה מדריך מקיף לבחינות.',
          ],
          [
            'bilingual',
            'adjective',
            'דו-לשוני',
            '🗣️',
            'Bilingual individuals navigate between languages easily.',
            'אנשים דו-לשוניים מנווטים בין שפות בקלות.',
          ],
          [
            'flexibility',
            'noun',
            'גמישות / יכולת הסתגלות',
            '🤸',
            'Mental flexibility helps people solve novel challenges.',
            'גמישות מנטלית מסייעת לאנשים לפתור אתגרים חדשים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'rigid', translationHe: 'נוקשה / חסר גמישות' },
            { wordEn: 'monolingual', translationHe: 'חד-לשוני' },
          ],
          shortSentenceEn: 'Bilingual students show high flexibility.',
          shortSentenceHe: 'תלמידים דו-לשוניים מראים גמישות גבוהה.',
          rule: {
            questionEn: 'When a Bagrut question asks "What can be inferred from paragraph 3?", you must:',
            correct: 'Deduce an unstated conclusion based directly on evidence in paragraph 3',
            wrong: [
              'Copy a sentence directly without thinking',
              'Invent an answer based on your personal life experiences',
            ],
            explainHe:
              'שאלת הסקה (Inference) בשאלון E דורשת להסיק מסקנה הגיונית שאינה כתובה במפורש, בהתבסס אך ורק על הראיות המופיעות בפסקה.',
            hintHe: 'הסקה היא מסקנה שלא כתובה במפורש, אבל נשענת על הראיות בטקסט ולא על דעה אישית.',
          },
          story: {
            passageEn:
              'Neuroimaging technology has revolutionized our understanding of linguistic brain development. Recent experiments at Cambridge confirmed that bilingual teenagers who speak both Hebrew and English actively toggle between distinct grammar networks. Consequently, their prefrontal cortex exhibits enhanced executive functioning, shielding them against cognitive fatigue during prolonged scholarly tasks.',
            passageHe:
              'טכנולוגיית דימות מוחי חוללה מהפכה בהבנתנו לגבי התפתחות שפתית של המוח. ניסויים אחרונים בקיימברידג׳ אישרו כי בני נוער דו-לשוניים הדוברים הן עברית והן אנגלית ממתגים באופן פעיל בין רשתות דקדוק נפרדות. כתוצאה מכך, קליפת המוח הקדם-מצחית שלהם מציגה תפקוד ניהולי משופר, המגן עליהם מפני עייפות קוגניטיבית במהלך משימות לימודיות ממושכות.',
            questionEn: 'How does toggling between two languages benefit adolescents?',
            questionHe: 'כיצד מיתוג בין שתי שפות מועיל לבני נוער?',
            correct: 'It enhances executive mental functions and reduces cognitive fatigue.',
            wrong: ['It makes them forget grammar rules of their native tongue.', 'It slows down overall reading comprehension permanently.'],
          },
        },
      },
    ],
  },
];

export const grade11Curriculum = buildHighSchoolGrade('grade-11', units);
