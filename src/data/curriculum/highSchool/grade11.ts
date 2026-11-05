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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence about the past is correct?',
                correct: 'If Ruth had left earlier, she would have caught the bus.',
                wrong: ['If Ruth had left earlier, she would catch the bus.'],
                explainHe: 
                  'בתנאי שלישי יש had + V3 בחלק ה-if ו-would have + V3 בחלק השני. שימו לב ששני החלקים מדברים על העבר.',
                hintHe: 'כדאי לבדוק: האם שני חלקי המשפט מתארים את העבר?',
              },
              story: {
                passageEn: 'Tom missed the bus. He was late for school. His teacher was not happy.',
                passageHe: 'תום פספס את האוטובוס. הוא איחר לבית הספר. המורה לא הייתה מרוצה.',
                questionEn: 'Why was Tom late?',
                questionHe: 'למה תום איחר?',
                correct: 'He missed the bus.',
                wrong: ['He lost his bag.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['reluctant', 'fragile'],
                ['accumulation', 'punctuation'],
                ['celebration', 'arrangement'],
              ],
            },
            master: {
              sentenceEn: 
                'If the author had changed the ending many readers would have felt deeply disappointed.',
              sentenceHe: 'אילו הסופר היה משנה את הסוף, קוראים רבים היו מרגישים אכזבה עמוקה.',
              decoys: ['has', 'were'],
              voiceEn: 'She would have helped if she had known.',
              voiceHe: 'היא הייתה עוזרת אילו הייתה יודעת.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'If he had apologized, she would have forgiven him.',
                wrong: [
                  'If he apologized, she would have forgiven him.',
                  'If he had apologized, she will have forgiven him.',
                  'If he would have apologized, she would have forgiven him.',
                ],
                explainHe: 
                  'בתנאי שלישי משתמשים ב-had + V3 אחרי if וב-would have + V3 בחלק השני. לא משתמשים בעבר פשוט, ב-will או ב-would אחרי if.',
                hintEn: 'Check the verb forms after if and in the result part.',
              },
              story: {
                passageEn: 
                  'Nora had spent months preparing for the national debate final. On the morning of the contest, she noticed that her main argument rested on a statistic from an unreliable website. She considered removing it but decided there was no time to check another source. Her opponent immediately challenged the figure, and the judges frowned. Afterwards, Nora admitted to her coach that a single hour of research earlier in the week would have saved her speech.',
                passageHe: '',
                questionEn: 'Why did the judges frown?',
                questionHe: '',
                correct: 'Her key figure came from a weak source.',
                wrong: [
                  'Nora forgot most of her prepared speech.',
                  'The opponent had stolen her main argument.',
                  'Her coach interrupted the speech loudly.',
                ],
              },
              storyHintEn: 'Think about where her main statistic came from.',
            },
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
        sentenceHe: 'הגיבור קיבל החלטה מצערת משום שמצוקה כלכלית לחצה על משפחתו.',
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is correct?',
                correct: 'Due to the rain, the match was cancelled.',
                wrong: ['Due to it rained, the match was cancelled.'],
                explainHe: 'אחרי Due to בא שם עצם (the rain), ולא משפט שלם עם נושא ופועל.',
                hintHe: 'כדאי לבדוק: מה בא אחרי Due to, שם עצם או משפט שלם?',
              },
              story: {
                passageEn: 
                  'Dan forgot his umbrella. It rained all afternoon. As a result, he got very wet.',
                passageHe: 'דן שכח את המטרייה שלו. ירד גשם כל אחר הצהריים. כתוצאה מכך הוא נרטב מאוד.',
                questionEn: 'Why did Dan get wet?',
                questionHe: 'למה דן נרטב?',
                correct: 'He had no umbrella.',
                wrong: ['He fell in a lake.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['prosperity', 'leisure'],
                ['avoidable', 'hostile'],
                ['landscape', 'ingredient'],
              ],
            },
            master: {
              sentenceEn: 
                'Consequently rising prices forced many families to cut their spending last winter.',
              sentenceHe: 'כתוצאה מכך, עליית המחירים אילצה משפחות רבות לקצץ בהוצאותיהן בחורף שעבר.',
              decoys: ['forcing', 'cutting'],
              voiceEn: 'Hardship often leads to difficult choices.',
              voiceHe: 'קושי מוביל לעתים קרובות לבחירות קשות.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Due to the long strike, the trains stopped running.',
                wrong: [
                  'Because of the strike started, the trains stopped.',
                  'Due to the strike, so the trains stopped running.',
                  'As a result the strike, the trains stopped running.',
                ],
                explainHe: 
                  'Due to ו-Because of באים לפני שם עצם, לא לפני משפט שלם. As a result דורש of לפני שם עצם, ואין צורך ב-so אחרי ביטוי סיבה.',
                hintEn: 'Look at what follows each cause phrase and the word so.',
              },
              story: {
                passageEn: 
                  'When the factory closed, nearly two hundred workers lost their jobs. Local shops soon noticed fewer customers, and the cafe on the corner reduced its opening hours. Young people began leaving town to find work in the city, and the primary school was left with half its classes. The mayor admitted that no single decision had caused the decline, but that the closure had set everything else in motion. Years later, a small technology park finally opened.',
                passageHe: '',
                questionEn: 'What does the passage suggest the mayor believes?',
                questionHe: '',
                correct: 'It started a chain of other problems.',
                wrong: [
                  'It alone explains every problem in town.',
                  'It helped the shops earn more money.',
                  'It was planned by the young people.',
                ],
              },
              storyHintEn: 'Notice the phrase set everything else in motion.',
            },
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is correct?',
                correct: 'If I had chosen the other road, I would have been late.',
                wrong: ['If I would have chosen the other road, I had been late.'],
                explainHe: 
                  'בתנאי שלישי: If + had + V3 בחלק הראשון, ו-would have + V3 בחלק השני. אי אפשר להחליף ביניהם.',
                hintHe: 'כדאי לבדוק באיזה חלק של המשפט משתמשים ב-had.',
              },
              story: {
                passageEn: 'Sam saw two paths in the park. He took the short one. It was quiet and green.',
                passageHe: 'סם ראה שני שבילים בפארק. הוא בחר בשביל הקצר. הוא היה שקט וירוק.',
                questionEn: 'Which path did Sam take?',
                questionHe: 'באיזה שביל סם בחר?',
                correct: 'The short one.',
                wrong: ['The long one.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['hesitate', 'confess'],
                ['mandatory', 'vigorous'],
                ['recite', 'forbid'],
              ],
            },
            master: {
              sentenceEn: 'If the poet had taken the other road he would have written a different poem.',
              sentenceHe: 'אילו המשורר היה בוחר בדרך האחרת, הוא היה כותב שיר אחר.',
              decoys: ['has', 'took'],
              voiceEn: 'Every choice leaves another path unexplored.',
              voiceHe: 'כל בחירה משאירה דרך אחרת בלתי נחקרת.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'If she had read the poem, she would have understood it.',
                wrong: [
                  'If she had read the poem, she would had understood it.',
                  'If she would read the poem, she would have understood it.',
                  'If she had read the poem, she would have understand it.',
                ],
                explainHe: 
                  'בתנאי שלישי הצורה היא would have + V3: אחרי would have בא V3 ולא V1, ולא had. אחרי if לא מוסיפים would.',
                hintEn: 'Look closely at the verb after would, and after if.',
              },
              story: {
                passageEn: 
                  'Maya stood at the fork in the path for a long time. Her friends had already chosen the wide, busy trail that led to the lake, and their laughter faded slowly behind the trees. The narrow path looked muddy and uncertain, yet something about it made her curious. Eventually she stepped forward alone. Years later she still described that afternoon as the moment she stopped asking others what she should do.',
                passageHe: '',
                questionEn: 'What does the ending suggest about Maya?',
                questionHe: '',
                correct: 'She learned to trust her own judgment.',
                wrong: [
                  'She deeply regretted leaving her friends.',
                  'She avoided every forest path afterwards.',
                  'She was afraid of the busy lake trail.',
                ],
              },
              storyHintEn: 'Think about what changed for her after that afternoon.',
            },
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is correct?',
                correct: 'My brother likes noise, whereas I prefer silence.',
                wrong: ['My brother likes noise, because I prefer silence.'],
                explainHe: 'Whereas מחבר שני רעיונות מנוגדים. Because מסביר סיבה, ולכן לא מתאים כאן.',
                hintHe: 'כדאי לשאול: האם המשפט השני מנוגד לראשון או מסביר אותו?',
              },
              story: {
                passageEn: 'Ben likes football. His sister likes books. They never choose the same game.',
                passageHe: 'בן אוהב כדורגל. אחותו אוהבת ספרים. הם אף פעם לא בוחרים את אותו משחק.',
                questionEn: 'What does Ben like?',
                questionHe: 'מה בן אוהב?',
                correct: 'He likes football.',
                wrong: ['He likes books.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['pressure', 'distance'],
                ['dissolve', 'bewilder'],
                ['inflation', 'architecture'],
              ],
            },
            master: {
              sentenceEn: 
                'Although critics admired the novel for its realism some readers found its ending unconvincing.',
              sentenceHe: 
                'למרות שמבקרים העריכו את הרומן על הריאליזם שבו, חלק מהקוראים מצאו את סופו לא משכנע.',
              decoys: ['whereas', 'unconvince'],
              voiceEn: 'Both characters see the story differently.',
              voiceHe: 'שתי הדמויות רואות את הסיפור אחרת.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The mother wanted peace, whereas her son wanted adventure.',
                wrong: [
                  'Whereas the mother wanted peace, but her son wanted adventure.',
                  'The mother wanted peace, despite her son wanted adventure.',
                  'The mother wanted peace, however her son wanted adventure.',
                ],
                explainHe: 
                  'ב-Whereas לא משתמשים יחד עם but; Despite דורש שם עצם ולא משפט; ו-however אחרי פסיק בלבד יוצר שני משפטים מחוברים בצורה שגויה.',
                hintEn: 'Check each linking word and what follows it.',
              },
              story: {
                passageEn: 
                  'The town council argued for weeks about a vacant lot. Mr Cohen, a retired teacher, wanted a library, noting that half the children in his neighbourhood had no quiet place to study. The coach of the youth team disagreed. In his view, teenagers needed a gym to release energy, and books could wait. A student named Lior finally proposed a building that offered both, with a reading room above the courts. Both men, surprisingly, nodded.',
                passageHe: '',
                questionEn: 'Why did both men nod at Lior\'s idea?',
                questionHe: '',
                correct: 'It addressed what each of them wanted.',
                wrong: [
                  'It was clearly the cheapest possible plan.',
                  'It gave the council more time to argue.',
                  'It replaced the lot with an empty park.',
                ],
              },
              storyHintEn: 'Think about what each man wanted from the empty lot.',
            },
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is correct?',
                correct: 'Both stories are about friendship.',
                wrong: ['Both stories is about friendship.'],
                explainHe: 'אחרי Both בא שם עצם ברבים ולכן הפועל הוא are, לא is.',
                hintHe: 'כדאי לבדוק: Both מתייחס לאחד או לשניים?',
              },
              story: {
                passageEn: 'Ana has a cat. Dan has a dog. Both pets like to sleep.',
                passageHe: 'לאנה יש חתול. לדן יש כלב. שתי חיות המחמד אוהבות לישון.',
                questionEn: 'What do both pets like?',
                questionHe: 'מה שתי חיות המחמד אוהבות?',
                correct: 'They like to sleep.',
                wrong: ['They like to swim.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['complaint', 'improvement'],
                ['overtake', 'astonish'],
                ['pollution', 'budget'],
              ],
            },
            master: {
              sentenceEn: 
                'Unlike the first poem which celebrates nature the second poem warns readers about industry.',
              sentenceHe: 'בניגוד לשיר הראשון שמהלל את הטבע, השיר השני מזהיר את הקוראים מפני התעשייה.',
              decoys: ['whereas', 'warn'],
              voiceEn: 'The two poems share one theme.',
              voiceHe: 'שני השירים חולקים נושא אחד.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Both writers criticize war, yet their methods differ.',
                wrong: [
                  'Both writers criticizes war, yet their methods differ.',
                  'Both writers criticize war, yet differ their methods.',
                  'Both of writers criticize war, yet their methods differ.',
                ],
                explainHe: 
                  'אחרי Both writers הפועל ברבים (criticize), סדר המילים בחלק השני הוא נושא ואחריו פועל, ואומרים Both writers ולא Both of writers.',
                hintEn: 'Check the verb agreement and the word order after yet.',
              },
              story: {
                passageEn: 
                  'Two memoirs describe growing up in the same city during the nineties. The first, written by a banker, remembers crowded markets and a sense of endless opportunity. The second, by a nurse, recalls long power cuts and her mother working two jobs. Readers often assume the authors are describing different places. In fact, both books mention the same street, and each author stresses how much the neighbours helped one another. Perhaps the contrast says more about the writers than about the city.',
                passageHe: '',
                questionEn: 'What can be inferred from the differences between the memoirs?',
                questionHe: '',
                correct: 'Background influences how a place is remembered.',
                wrong: [
                  'The authors lived in completely different cities.',
                  'The neighbours disliked helping each other.',
                  'The banker made up his whole story.',
                ],
              },
              storyHintEn: 'Remember both books describe the same street.',
            },
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
            'The white dove is a recognized piece of symbolism for peace.',
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
              'בסיפורה הקצר והמצמרר של שירלי ג׳קסון ״ההגרלה״, קהילת חקלאים רגילה מתאספת בבוקר יוני בהיר. תחילה, האירוע נראה כמו פיקניק אזרחי תמים. ג׳קסון משתמשת ברמזים מקדימים עוצמתיים ובאירוניה דרמטית, ומאלצת את הקורא לבחון כיצד היצמדות עיוורת למסורת עלולה להוביל שכנים תרבותיים לבצע מעשים מחרידים.',
            questionEn: 'What is the central social critique conveyed through Jackson\'s story?',
            questionHe: 'מהי הביקורת החברתית המרכזית המועברת דרך סיפורה של ג׳קסון?',
            correct: 'The danger of blindly obeying cruel traditions without moral questioning.',
            wrong: ['The difficulty of farming crops in dry summer conditions.', 'The importance of purchasing lottery tickets regularly.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is correct?',
                correct: 'Because of the storm, the trip was cancelled.',
                wrong: ['Because of the storm was strong, the trip was cancelled.'],
                explainHe: 'אחרי Because of בא שם עצם (the storm), לא משפט עם פועל.',
                hintHe: 'כדאי לבדוק מה בא אחרי Because of.',
              },
              story: {
                passageEn: 
                  'The dove is white. In many stories, it means peace. Lena draws a dove for the class.',
                passageHe: 'היונה לבנה. בסיפורים רבים היא מסמלת שלום. לנה מציירת יונה לכיתה.',
                questionEn: 'What does the dove mean?',
                questionHe: 'מה מסמלת היונה?',
                correct: 'It means peace.',
                wrong: ['It means winter.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['permission', 'obstacle'],
                ['treaty', 'rumor'],
                ['equipment', 'machinery'],
              ],
            },
            master: {
              sentenceEn: 'The writer uses a broken mirror to symbolize how the family lost its trust.',
              sentenceHe: 'הסופר משתמש במראה שבורה כדי לסמל כיצד המשפחה איבדה את האמון שלה.',
              decoys: ['symbolism', 'losing'],
              voiceEn: 'Symbols can carry a deeper meaning.',
              voiceHe: 'לסמלים יכולה להיות משמעות עמוקה יותר.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Because of his pride, the hero lost everything he loved.',
                wrong: [
                  'Because of he was proud, the hero lost everything he loved.',
                  'Because his pride, the hero lost everything he loved.',
                  'As a result of his pride, so the hero lost everything he loved.',
                ],
                explainHe: 
                  'Because of דורש שם עצם (his pride); המילה Because ללא of דורשת משפט שלם; ואחרי As a result of אין צורך ב-so.',
                hintEn: 'Check what follows Because and whether of is needed.',
              },
              story: {
                passageEn: 
                  'For decades the lighthouse on the cliff had guided fishing boats safely home. When a modern navigation system replaced it, the council planned to demolish the empty tower. Residents protested, arguing that it was more than a building. Old fishermen told their grandchildren that the beam had meant someone was always watching over them. In the end the council turned the tower into a small museum, keeping the lamp lit every evening. Tourists now climb the stairs to see it.',
                passageHe: '',
                questionEn: 'What does the lamp that is lit every evening most likely represent?',
                questionHe: '',
                correct: 'A living reminder of the town\'s past.',
                wrong: [
                  'A signal that the museum is closed to visitors.',
                  'The newest form of boat navigation.',
                  'The council\'s plan to knock it down.',
                ],
              },
              storyHintEn: 'Think about what the beam meant to the fishermen.',
            },
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is correct?',
                correct: 'You should have called me yesterday.',
                wrong: ['You should called me yesterday.'],
                explainHe: 'לביטוי חרטה על העבר משתמשים ב-should have + V3.',
                hintHe: 'כדאי לבדוק: מה חסר בין should לבין הפועל?',
              },
              story: {
                passageEn: 'Dina did not study for the test. She got a low grade. Now she feels sad.',
                passageHe: 'דינה לא למדה למבחן. היא קיבלה ציון נמוך. עכשיו היא עצובה.',
                questionEn: 'Why is Dina sad?',
                questionHe: 'למה דינה עצובה?',
                correct: 'She got a low grade.',
                wrong: ['She lost her pen.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['humorous', 'ornamental'],
                ['jealousy', 'amusement'],
                ['forbid', 'sharpen'],
              ],
            },
            master: {
              sentenceEn: 
                'The government should have warned residents earlier about the dangerous flooding in the valley.',
              sentenceHe: 'הממשלה הייתה צריכה להזהיר את התושבים מוקדם יותר מפני ההצפה המסוכנת בעמק.',
              decoys: ['warns', 'early'],
              voiceEn: 'We should have left much earlier.',
              voiceHe: 'היינו צריכים לצאת הרבה קודם.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'They should have checked the map before leaving.',
                wrong: [
                  'They should checked the map before leaving.',
                  'They should have check the map before leaving.',
                  'They should of checked the map before leaving.',
                ],
                explainHe: 
                  'should have + V3 הוא המבנה לחרטה. חסר have בדוגמה הראשונה, V1 במקום V3 בשנייה, וכתיבת of במקום have בשלישית.',
                hintEn: 'Look at the words between should and the main verb.',
              },
              story: {
                passageEn: 
                  'The hikers had been warned about afternoon fog, yet the group leader, eager to reach the summit, ignored the advice. By three o\'clock, the path had vanished into white mist and two members began to panic. The leader finally admitted that turning back at noon would have kept everyone safe. They descended slowly, holding a rope between them, and reached the car park after dark. No one was hurt, but nobody spoke about the summit again.',
                passageHe: '',
                questionEn: 'How did the leader probably feel at the end?',
                questionHe: '',
                correct: 'Regretful about his earlier decision.',
                wrong: [
                  'Proud of reaching the summit first.',
                  'Amused that the group was afraid.',
                  'Pleased that the fog had lifted.',
                ],
              },
              storyHintEn: 'Notice the leader\'s admission and the silence at the end.',
            },
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
        sentenceHe: 'המהנדסים הקדמונים היו חייבים לשלוט במתמטיקה מתקדמת כדי ליישר את המונומנטים בצורה כה מדויקת.',
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is correct?',
                correct: 'The door is open, so someone must have come in.',
                wrong: ['The door is open, so someone must came in.'],
                explainHe: 'להסקת מסקנה על העבר משתמשים ב-must have + V3.',
                hintHe: 'כדאי לבדוק איזו צורה של הפועל באה אחרי must have.',
              },
              story: {
                passageEn: 'The cake is gone. There are crumbs on the floor. The dog looks very happy.',
                passageHe: 'העוגה נעלמה. יש פירורים על הרצפה. הכלב נראה מאוד מאושר.',
                questionEn: 'Who ate the cake?',
                questionHe: 'מי אכל את העוגה?',
                correct: 'The dog probably did.',
                wrong: ['The cat probably did.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['collide', 'dissolve'],
                ['treaty', 'election'],
                ['compose', 'hibernate'],
              ],
            },
            master: {
              sentenceEn: 
                'The villagers could not have built such a huge tower without skilled foreign help.',
              sentenceHe: 'הכפריים לא יכלו לבנות מגדל ענק כזה בלי עזרה זרה מיומנת.',
              decoys: ['builds', 'are'],
              voiceEn: 'It must have been very cold.',
              voiceHe: 'בטח היה קר מאוד.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The thieves must have entered through the window.',
                wrong: [
                  'The thieves must entered through the window.',
                  'The thieves must have enter through the window.',
                  'The thieves must has entered through the window.',
                ],
                explainHe: 
                  'המבנה הנכון הוא must have + V3, ללא שינוי בגוף: חסר have בדוגמה הראשונה, V1 במקום V3 בשנייה, ו-has במקום have בשלישית.',
                hintEn: 'Check each word between must and the window.',
              },
              story: {
                passageEn: 
                  'Archaeologists found a bronze bowl beside the ancient road, but no tools for making it were nearby. The clay beneath the bowl came from a region three hundred kilometres away. Scholars noticed that the bowl\'s decoration matched jewellery from distant ports. A few experts suggested that local craftsmen had simply invented the style. However, the shape of the handles was unknown in the area before that century. The debate continues.',
                passageHe: '',
                questionEn: 'What do the clay and the decoration most strongly suggest?',
                questionHe: '',
                correct: 'It probably came from somewhere else.',
                wrong: [
                  'Local people made it from nearby clay.',
                  'It was certainly buried much later.',
                  'Archaeologists made the bowl themselves.',
                ],
              },
              storyHintEn: 'Where did the clay come from?',
            },
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
              'לפני שיוהנס גוטנברג שכלל את האותיות המיטלטלות ממתכת בשנת 1440, כל כרך בודד נאלץ להיכתב ידנית על ידי סופרים, תהליך שארך עד שנה לעותק. גוטנברג חייב היה להבין שמיכון הדפוס יוביל לדמוקרטיזציה של ידיעת קרוא וכתוב. תוך חמישה עשורים הודפסו למעלה מעשרים מיליון ספרים, מה שהצית את תקופת הרנסאנס ברחבי אירופה.',
            questionEn: 'How did Gutenberg\'s invention impact the Renaissance in Europe?',
            questionHe: 'כיצד השפיעה המצאתו של גוטנברג על הרנסאנס באירופה?',
            correct: 'By making books widely accessible, dramatically expanding literacy and ideas.',
            wrong: ['By banning the publication of religious scriptures.', 'By forcing schools to close printing presses.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is correct?',
                correct: 'She could not have known about the surprise.',
                wrong: ['She could not known about the surprise.'],
                explainHe: 'could not have + V3 מבטא שהדבר היה בלתי אפשרי בעבר. חייבים לכתוב have לפני V3.',
                hintHe: 'כדאי לבדוק איזו מילה חסרה אחרי could not.',
              },
              story: {
                passageEn: 
                  'Long ago, people copied books by hand. Then printing machines came. Books became cheaper, and more people could read.',
                passageHe: 
                  'לפני הרבה שנים אנשים העתיקו ספרים ביד. אחר כך הגיעו מכונות הדפוס. ספרים נעשו זולים יותר, ויותר אנשים יכלו לקרוא.',
                questionEn: 'What did printing machines change?',
                questionHe: 'מה שינו מכונות הדפוס?',
                correct: 'Books became cheaper.',
                wrong: ['Books became smaller.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['forbid', 'inhabit'],
                ['decorate', 'unwrap'],
                ['shortage', 'vacancy'],
              ],
            },
            master: {
              sentenceEn: 
                'The printing press could not have changed education without cheap paper and many readers.',
              sentenceHe: 'הדפוס לא היה יכול לשנות את החינוך בלי נייר זול וקוראים רבים.',
              decoys: ['spread', 'change'],
              voiceEn: 'Their work left a lasting legacy.',
              voiceHe: 'עבודתם הותירה מורשת מתמשכת.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'No one could have predicted such rapid change.',
                wrong: [
                  'No one could have predict such rapid change.',
                  'No one could predicted such rapid change.',
                  'No one couldn\'t have predicted such rapid change.',
                ],
                explainHe: 
                  'could have + V3: בדוגמה הראשונה V1 במקום V3, בשנייה חסר have, ובשלישית יש שלילה כפולה (No one couldn\'t).',
                hintEn: 'Check the verb form, and count the negatives.',
              },
              story: {
                passageEn: 
                  'When the first telephones appeared, many newspapers dismissed them as noisy toys that would never replace the letter. Within two decades, however, businesses were hiring operators, and families were paying for a line to be installed in the hall. Historians now point out that the early critics judged the invention by what it was, not by what it allowed people to do. The telephone\'s real effect was to shrink distances between towns. Today the same pattern repeats with new technology.',
                passageHe: '',
                questionEn: 'Why were the early critics mistaken?',
                questionHe: '',
                correct: 'They judged only its present form.',
                wrong: [
                  'Telephones were too expensive for businesses.',
                  'Letters became faster than calls.',
                  'Operators refused to use the machines.',
                ],
              },
              storyHintEn: 'Read what historians say about judging an invention.',
            },
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'What is skimming?',
                correct: 'Reading quickly to get the main idea.',
                wrong: ['Reading slowly to learn every word.'],
                explainHe: 'Skimming היא קריאה מהירה כדי להבין את הרעיון המרכזי, בלי לעצור על כל מילה.',
                hintHe: 'כדאי לחשוב: האם סורקים את הטקסט במהירות או קוראים כל מילה?',
              },
              story: {
                passageEn: 
                  'Yael reads the title first. Then she looks at the pictures. Now she knows what the text is about.',
                passageHe: 
                  'יעל קוראת קודם את הכותרת. אחר כך היא מסתכלת בתמונות. עכשיו היא יודעת על מה הטקסט.',
                questionEn: 'What does Yael read first?',
                questionHe: 'מה יעל קוראת קודם?',
                correct: 'The title.',
                wrong: ['The last line.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['talkative', 'jealous'],
                ['postpone', 'accuse'],
                ['agricultural', 'nautical'],
              ],
            },
            master: {
              sentenceEn: 
                'Skimming the headings first helps students predict the topic before reading every paragraph carefully.',
              sentenceHe: 
                'סריקת הכותרות תחילה עוזרת לתלמידים לנחש את הנושא לפני שהם קוראים כל פסקה בעיון.',
              decoys: ['skim', 'predicts'],
              voiceEn: 'Context clues explain unknown words.',
              voiceHe: 'רמזים מההקשר מסבירים מילים לא מוכרות.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The study shows that sleep improves memory.',
                wrong: [
                  'The study show that sleep improves memory.',
                  'The study shows that sleep improve memory.',
                  'The study shows sleep that improves memory.',
                ],
                explainHe: 
                  'במשפט הזה שני נושאים בגוף שלישי יחיד: The study shows ו-sleep improves. בנוסף, אחרי shows בא that ואז הנושא.',
                hintEn: 'Check both verbs and the position of the word that.',
              },
              story: {
                passageEn: 
                  'A recent survey asked three hundred students how they prepare for exams. Most reported that they reread their notes several times, yet those who tested themselves with practice questions scored noticeably higher. The researchers explained that rereading feels comfortable because the material looks familiar, but familiarity is not the same as understanding. Teachers who read the findings began to replace some lecture time with short quizzes. Students complained at first, then admitted the quizzes helped. One teacher said the change surprised her.',
                passageHe: '',
                questionEn: 'Why does rereading often mislead students?',
                questionHe: '',
                correct: 'It feels like real understanding.',
                wrong: [
                  'Notes often contain serious errors.',
                  'It makes the content harder to read.',
                  'It replaces the teacher\'s lectures.',
                ],
              },
              storyHintEn: 'Compare feeling familiar with truly understanding.',
            },
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is correct?',
                correct: 'The number of cars rose sharply last year.',
                wrong: ['The number of cars rosed sharply last year.'],
                explainHe: 'לפועל rise יש צורת עבר לא רגילה: rose. אין להוסיף ed.',
                hintHe: 'כדאי לבדוק: האם rise הוא פועל רגיל בעבר?',
              },
              story: {
                passageEn: 
                  'In a class survey, 20 students like pizza. Only 5 like fish. Pizza is the most popular food.',
                passageHe: 
                  'בסקר בכיתה, 20 תלמידים אוהבים פיצה. רק 5 אוהבים דג. פיצה היא האוכל הפופולרי ביותר.',
                questionEn: 'Which food is more popular?',
                questionHe: 'איזה אוכל פופולרי יותר?',
                correct: 'Pizza is more popular.',
                wrong: ['Fish is more popular.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['inhabit', 'withdraw'],
                ['gratefully', 'eagerly'],
                ['compliment', 'ingredient'],
              ],
            },
            master: {
              sentenceEn: 
                'The statistics indicate that unemployment fell steadily among graduates throughout the past five years.',
              sentenceHe: 
                'הנתונים מצביעים על כך שהאבטלה ירדה בהתמדה בקרב בוגרים לאורך חמש השנים האחרונות.',
              decoys: ['rises', 'fallen'],
              voiceEn: 'The graph shows a steady increase.',
              voiceHe: 'הגרף מראה עלייה מתמדת.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Sales rose steadily from March to June.',
                wrong: [
                  'Sales rised steadily from March to June.',
                  'Sales rose steady from March to June.',
                  'Sales rose steadily since March to June.',
                ],
                explainHe: 
                  'rose היא צורת העבר של rise. הפועל מקבל תואר פועל (steadily) ולא תואר, ועם from משתמשים ב-to ולא ב-since.',
                hintEn: 'Check the past form, the adverb, and the linking word.',
              },
              story: {
                passageEn: 
                  'A city council published a chart showing that bicycle use had doubled since the opening of protected bike lanes, while car traffic in the centre dropped by only five percent. Supporters celebrated the result. A transport analyst, however, warned that the chart said nothing about why the drivers stayed: many commuters from distant suburbs had no safe alternative. She suggested that new bus routes might reveal a bigger change than lanes alone. The council promised to study the question.',
                passageHe: '',
                questionEn: 'What is the analyst\'s main point?',
                questionHe: '',
                correct: 'The data does not tell the whole story.',
                wrong: [
                  'The bike lanes should be removed soon.',
                  'Car traffic fell by about half.',
                  'Suburban commuters prefer cycling.',
                ],
              },
              storyHintEn: 'Think about what the chart does not explain.',
            },
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
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is correct?',
                correct: 'She speaks two languages, so she is bilingual.',
                wrong: ['She speaks one language, so she is bilingual.'],
                explainHe: 'Bilingual פירושו דובר/ת שתי שפות. אם מדברים רק שפה אחת, זה אינו נכון.',
                hintHe: 'כדאי לזכור: הקידומת -bi מציינת שניים (דו-).',
              },
              story: {
                passageEn: 
                  'Omer speaks Hebrew and English. He talks to his grandmother in Hebrew. He watches films in English.',
                passageHe: 'עומר מדבר עברית ואנגלית. הוא מדבר עם סבתו בעברית. הוא רואה סרטים באנגלית.',
                questionEn: 'How many languages does Omer speak?',
                questionHe: 'כמה שפות עומר מדבר?',
                correct: 'He speaks two languages.',
                wrong: ['He speaks five languages.'],
              },
            },
            challenger: {
              clozeWrong: [
                ['fragile', 'reluctant'],
                ['fiscal', 'nautical'],
                ['rigidity', 'confusion'],
              ],
            },
            master: {
              sentenceEn: 
                'Students who practise speaking daily become more confident and flexible in unfamiliar situations.',
              sentenceHe: 'תלמידים שמתרגלים דיבור מדי יום נעשים בטוחים וגמישים יותר במצבים לא מוכרים.',
              decoys: ['confidence', 'flexibly'],
              voiceEn: 'Learning languages keeps the mind active.',
              voiceHe: 'לימוד שפות שומר על המוח פעיל.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The research was conducted by a team of linguists.',
                wrong: [
                  'The research was conduct by a team of linguists.',
                  'The research were conducted by a team of linguists.',
                  'The research was conducted from a team of linguists.',
                ],
                explainHe: 
                  'במבנה סביל: was/were + V3. הנושא research ביחיד ולכן was, ואת מבצע הפעולה מציינים עם by.',
                hintEn: 'Check the verb form, the be-verb, and the preposition.',
              },
              story: {
                passageEn: 
                  'A language school compared two groups of adults who began Spanish together. One group attended three long lessons a week; the other studied twenty minutes every day using an app and a weekly conversation club. After six months the second group could hold longer conversations and forgot fewer words. The director noticed that the daily group also reported feeling less anxious about speaking. She decided to redesign the schedule for all new classes. Some teachers worried about losing lesson time.',
                passageHe: '',
                questionEn: 'Why did the director change the schedule?',
                questionHe: '',
                correct: 'Short daily practice worked better.',
                wrong: [
                  'The long lessons were too expensive to run.',
                  'The app group forgot more words.',
                  'Teachers asked for fewer students.',
                ],
              },
              storyHintEn: 'Compare the two groups after six months.',
            },
          },
        },
      },
    ],
  },
];

export const grade11Curriculum = buildHighSchoolGrade('grade-11', units);
