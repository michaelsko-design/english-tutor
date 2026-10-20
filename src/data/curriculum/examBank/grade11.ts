import type { ExamBankPack } from './types';

/**
 * Grade 11 exam question bank (Feature 43, Band III core and Bagrut Module E). New questions only:
 * none of them appears in a grade 11 mission, mini-lesson, the placement test or a contest. The
 * last 2 items of each list and the second passage are for the mock exam.
 */
export const GRADE_11_EXAM_BANK: ExamBankPack = {
  // Unit 1: Third Conditional, cause and effect (because / because of / due to)
  1: {
    vocabulary: [
      {
        clozeEn: 'Choosing between her two best friends was a painful ____ for Shira.',
        clozeHe: 'הבחירה בין שתי החברות הכי טובות שלה הייתה דילמה כואבת עבור שירה.',
        answer: 'dilemma',
        wrong: ['inevitable', 'profound'],
      },
      {
        clozeEn: 'After the long drought, the farmers faced years of ____.',
        clozeHe: 'אחרי הבצורת הארוכה החקלאים התמודדו עם שנים של מצוקה.',
        answer: 'hardship',
        wrong: ['contemplate', 'significant'],
      },
      {
        clozeEn: 'With so little practice, losing the final was almost ____.',
        clozeHe: 'עם כל כך מעט אימונים, ההפסד בגמר היה כמעט בלתי נמנע.',
        answer: 'inevitable',
        wrong: ['hardship', 'motivation'],
      },
      {
        clozeEn: 'The novel had a ____ effect on me; I still think about it years later.',
        clozeHe: 'לרומן הייתה עליי השפעה עמוקה; אני עדיין חושב עליו שנים אחר כך.',
        answer: 'profound',
        wrong: ['dilemma', 'contemplate'],
      },
      {
        clozeEn: 'Her ____ to become a doctor came from watching her grandmother’s illness.',
        clozeHe: 'המוטיבציה שלה להיות רופאה נבעה מכך שראתה את המחלה של סבתא שלה.',
        answer: 'motivation',
        wrong: ['inevitable', 'diverge'],
      },
      {
        clozeEn: 'At the fork in the forest, the two paths ____ and never meet again.',
        clozeHe: 'בצומת שביער שני השבילים מתפצלים ולא נפגשים שוב לעולם.',
        answer: 'diverge',
        wrong: ['hardship', 'significant'],
      },
    ],
    grammar: [
      {
        questionEn:
          'Complete the sentence: "If the hero had listened to his mother, he ____ the dragon’s cave."',
        correct: 'would have avoided',
        wrong: ['would avoid', 'will have avoided'],
        explainHe: 'בתנאי מסוג שלישי (עבר שלא קרה): If + had + V3, would have + V3.',
        hintHe: 'החלק של if כתוב עם had ו-V3, כלומר על עבר שלא קרה. איזה מבנה בא בחלק התוצאה?',
      },
      {
        questionEn: 'Complete the sentence: "If she ____ the bus, she would have arrived on time."',
        correct: 'hadn’t missed',
        wrong: ['didn’t miss', 'wouldn’t miss'],
        explainHe: 'בחלק של if בתנאי מסוג שלישי בא had + V3 (כאן בשלילה): hadn’t missed.',
        hintHe: 'בחלק השני יש would have, כלומר עבר שלא קרה. איזה זמן בא בחלק של if?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'If they had saved more money, they would have bought the house.',
        wrong: [
          'If they would have saved more money, they had bought the house.',
          'If they saved more money, they would have buy the house.',
        ],
        explainHe: 'had + V3 בחלק של if, ו-would have + V3 בחלק התוצאה.',
        hintHe: 'בדקו איזה חלק מתחיל ב-if, ואיזה מבנה מתאים לכל חלק בתנאי על העבר.',
      },
      {
        questionEn: 'Choose the correct phrase: "The match was cancelled ____ the heavy storm."',
        correct: 'because of',
        wrong: ['because', 'although'],
        explainHe: 'אחרי because of בא שם עצם (the heavy storm), ואחרי because בא משפט שלם.',
        hintHe: 'מה בא אחרי החסר: משפט שלם עם פועל, או שם עצם בלבד?',
      },
      {
        questionEn:
          'Choose the correct connector: "____ the main character lost his job, he moved back to his village."',
        correct: 'Because',
        wrong: ['Due to', 'Despite'],
        explainHe: 'אחרי החסר בא משפט שלם (the main character lost his job), ולכן Because. Due to בא לפני שם עצם.',
        hintHe: 'האם אחרי החסר בא משפט שלם עם נושא ופועל? והאם הקשר הוא סיבה או ניגוד?',
      },
      {
        questionEn: 'What does this sentence mean? "If I had known about the test, I would have studied."',
        correct: 'I didn’t know about the test, so I didn’t study.',
        wrong: ['I knew about the test, so I studied.', 'I will study if I hear about the test.'],
        explainHe: 'תנאי מסוג שלישי מתאר עבר שלא קרה: לא ידעתי על המבחן, ולכן לא למדתי.',
        hintHe: 'תנאי עם had ו-would have מדבר על עבר דמיוני. האם הדברים האלה קרו באמת?',
      },
    ],
    sentences: [
      { en: 'If he had read the warning, he would have stayed home.', he: 'אם הוא היה קורא את האזהרה, הוא היה נשאר בבית.' },
      { en: 'The flight was delayed due to thick fog.', he: 'הטיסה התעכבה בגלל ערפל כבד.' },
      { en: 'Because of her courage, the whole village was saved.', he: 'בזכות האומץ שלה, הכפר כולו ניצל.' },
      { en: 'Would you have acted differently in her position?', he: 'הייתם נוהגים אחרת במקומה?' },
      {
        en: 'If we hadn’t taken that wrong turn, we would have found the lake.',
        he: 'אם לא היינו פונים בפנייה השגויה ההיא, היינו מוצאים את האגם.',
      },
      {
        en: 'The poem makes readers contemplate the choices they have made.',
        he: 'השיר גורם לקוראים להרהר בבחירות שעשו.',
      },
    ],
    passages: [
      {
        passageEn:
          'In the short story "The Last Letter", a young soldier writes to his sister before a dangerous mission. He tells her that he regrets their last argument and asks her to forgive him. The letter, however, is lost in the post for forty years. When it finally arrives, his sister is an old woman, and he has long since died. Readers are left to wonder how both their lives would have changed if the letter had arrived on time. The author uses this delay to show that some words cannot wait.',
        passageHe:
          'בסיפור הקצר "המכתב האחרון" חייל צעיר כותב לאחותו לפני משימה מסוכנת. הוא מספר לה שהוא מתחרט על הוויכוח האחרון שלהם ומבקש ממנה לסלוח לו. אבל המכתב הולך לאיבוד בדואר במשך ארבעים שנה. כשהוא מגיע סוף סוף, אחותו כבר אישה זקנה, והוא מת מזמן. הקוראים נשארים לתהות איך חייהם של שניהם היו משתנים אילו המכתב היה מגיע בזמן. הסופר משתמש בעיכוב הזה כדי להראות שיש מילים שאינן יכולות לחכות.',
        questions: [
          {
            questionEn: 'Why does the soldier write to his sister?',
            questionHe: 'למה החייל כותב לאחותו?',
            correct: 'He regrets their last argument.',
            wrong: ['He wants her to visit him.', 'He needs money for the mission.'],
          },
          {
            questionEn: 'What happens to the letter?',
            questionHe: 'מה קורה למכתב?',
            correct: 'It is lost in the post for forty years.',
            wrong: ['It is burned in a fire.', 'It is sent to the wrong city.'],
          },
          {
            questionEn: 'What does the author want to show?',
            questionHe: 'מה הסופר רוצה להראות?',
            correct: 'Some words cannot wait.',
            wrong: ['Soldiers should not write letters.', 'Sisters always forgive their brothers.'],
          },
        ],
      },
      {
        passageEn:
          'The Great Famine in Ireland began in 1845, when a disease destroyed most of the country’s potato crop. Because potatoes were the main food of the poor, about one million people died of hunger and illness. Due to the terrible hardship, another million people left Ireland and sailed to America. Historians argue that the disaster was not inevitable. If the government had sent more food and help, many lives would have been saved. The famine changed Irish society for generations.',
        passageHe:
          'הרעב הגדול באירלנד החל ב-1845, כשמחלה השמידה את רוב יבול תפוחי האדמה של המדינה. מכיוון שתפוחי האדמה היו המזון העיקרי של העניים, כמיליון בני אדם מתו מרעב וממחלות. בגלל המצוקה הנוראה, מיליון אנשים נוספים עזבו את אירלנד והפליגו לאמריקה. היסטוריונים טוענים שהאסון לא היה בלתי נמנע. אילו הממשלה הייתה שולחת יותר מזון ועזרה, חיים רבים היו ניצלים. הרעב שינה את החברה האירית לדורות.',
        questions: [
          {
            questionEn: 'What destroyed the potato crop?',
            questionHe: 'מה השמיד את יבול תפוחי האדמה?',
            correct: 'A disease.',
            wrong: ['A long drought.', 'A war with England.'],
          },
          {
            questionEn: 'Why did another million people leave Ireland?',
            questionHe: 'למה מיליון אנשים נוספים עזבו את אירלנד?',
            correct: 'Due to the terrible hardship.',
            wrong: ['To find gold in America.', 'Because the government asked them to.'],
          },
          {
            questionEn: 'According to historians, what could have saved many lives?',
            questionHe: 'לפי ההיסטוריונים, מה היה יכול להציל חיים רבים?',
            correct: 'More food and help from the government.',
            wrong: ['A new kind of potato.', 'Leaving the country earlier.'],
          },
        ],
      },
    ],
  },

  // Unit 2: Perspectives, contrast and similarity connectors (whereas, on the other hand, similarly)
  2: {
    vocabulary: [
      {
        clozeEn: 'From a child’s ____, a small backyard can feel like a huge jungle.',
        clozeHe: 'מנקודת המבט של ילד, חצר אחורית קטנה יכולה להרגיש כמו ג׳ונגל ענק.',
        answer: 'perspective',
        wrong: ['criticism', 'allegory'],
      },
      {
        clozeEn: 'The twins ____ each other so closely that even their teachers mix them up.',
        clozeHe: 'התאומים דומים זה לזה כל כך שאפילו המורים שלהם מתבלבלים ביניהם.',
        answer: 'resemble',
        wrong: ['empathy', 'insight'],
      },
      {
        clozeEn: 'The director received harsh ____ for the ending of the film.',
        clozeHe: 'הבמאי ספג ביקורת חריפה על סוף הסרט.',
        answer: 'criticism',
        wrong: ['resemble', 'empathy'],
      },
      {
        clozeEn: 'Volunteering at the hospital taught Omer ____ for people in pain.',
        clozeHe: 'ההתנדבות בבית החולים לימדה את עומר אמפתיה לאנשים שסובלים.',
        answer: 'empathy',
        wrong: ['distinction', 'allegory'],
      },
      {
        clozeEn: '"Animal Farm" is an ____ in which farm animals represent real political leaders.',
        clozeHe: '"חוות החיות" היא אלגוריה שבה חיות החווה מייצגות מנהיגים פוליטיים אמיתיים.',
        answer: 'allegory',
        wrong: ['empathy', 'resemble'],
      },
      {
        clozeEn: 'There is an important ____ between facts and opinions.',
        clozeHe: 'יש הבחנה חשובה בין עובדות לדעות.',
        answer: 'distinction',
        wrong: ['resemble', 'symbolism'],
      },
    ],
    grammar: [
      {
        questionEn:
          'Choose the connector: "The city mouse loves noise and lights, ____ the country mouse prefers silence."',
        correct: 'whereas',
        wrong: ['similarly', 'because'],
        explainHe: 'שני העכברים שונים זה מזה, ו-whereas (ואילו) מחבר בין שני רעיונות מנוגדים.',
        hintHe: 'האם שני חלקי המשפט מתארים דמיון, ניגוד או סיבה?',
      },
      {
        questionEn: 'Choose the connector: "Romeo acts without thinking. ____, Juliet makes quick decisions."',
        correct: 'Similarly',
        wrong: ['However', 'Whereas'],
        explainHe: 'שתי הדמויות פועלות באותה דרך, ולכן Similarly (באופן דומה).',
        hintHe: 'האם שתי הדמויות מתנהגות באותה דרך או בדרכים שונות?',
      },
      {
        questionEn: 'Which sentence is punctuated correctly?',
        correct: 'Some critics loved the novel. Others, on the other hand, found it boring.',
        wrong: [
          'Some critics loved the novel. Others on the other hand found it boring.',
          'Some critics loved the novel, others, on the other hand found it boring.',
        ],
        explainHe: 'on the other hand באמצע משפט נכתב בין שני פסיקים.',
        hintHe: 'כשביטוי מקשר נכנס לאמצע משפט, מה צריך לבוא לפניו ואחריו?',
      },
      {
        questionEn: 'Which word shows that the second idea is like the first one?',
        correct: 'Likewise',
        wrong: ['Nevertheless', 'Instead'],
        explainHe: 'Likewise פירושו "באותו אופן", והוא מציג דמיון. Nevertheless ו-Instead מציגים ניגוד.',
        hintHe: 'חפשו מילה שפירושה "באותו אופן", ולא "בכל זאת" או "במקום זאת".',
      },
      {
        questionEn: 'Complete the sentence: "____ both poems describe the sea, they express very different feelings."',
        correct: 'Although',
        wrong: ['Because', 'Similarly'],
        explainHe: 'יש כאן ניגוד בתוך משפט אחד: נושא זהה, רגשות שונים. Although מחבר ניגוד כזה.',
        hintHe: 'האם החלק השני הוא תוצאה של הראשון, דמיון לו, או משהו מפתיע לעומתו?',
      },
      {
        questionEn:
          'Choose the correct word: "The first story ends in tragedy. ____ the first story, the second one has a happy ending."',
        correct: 'Unlike',
        wrong: ['Like', 'Similar'],
        explainHe: 'הסוף של שני הסיפורים שונה, ולכן Unlike (בשונה מ-).',
        hintHe: 'האם לשני הסיפורים יש אותו סוף? חפשו מילה שמביעה הבדל.',
      },
    ],
    sentences: [
      { en: 'The narrator sees the war through the eyes of a child.', he: 'המספר רואה את המלחמה דרך עיניו של ילד.' },
      { en: 'Whereas the father is strict, the mother is gentle and patient.', he: 'בעוד שהאב קפדן, האם עדינה וסבלנית.' },
      { en: 'Both characters resemble each other in their stubborn pride.', he: 'שתי הדמויות דומות זו לזו בגאווה העקשנית שלהן.' },
      { en: 'The broken clock is a symbol of lost time.', he: 'השעון השבור הוא סמל לזמן אבוד.' },
      { en: 'Critics, on the other hand, found the ending too simple.', he: 'המבקרים, לעומת זאת, מצאו את הסוף פשוט מדי.' },
      { en: 'Similarly, the second poem celebrates the beauty of nature.', he: 'באופן דומה, השיר השני מהלל את יופיו של הטבע.' },
    ],
    passages: [
      {
        passageEn:
          'Two students wrote about the same school trip to the Galilee. Liat described the hike as exhausting and boring, and she complained about the heat and the long walk. Yoav, on the other hand, called it the best day of the year. He wrote about the cold spring water and the view of the Sea of Galilee from the top. Interestingly, both students mentioned the same moment: a sudden rainstorm on the way down. Whereas Liat saw it as the worst part, Yoav thought it made the day unforgettable.',
        passageHe:
          'שני תלמידים כתבו על אותו טיול שנתי לגליל. ליאת תיארה את המסלול כמתיש ומשעמם, והתלוננה על החום ועל ההליכה הארוכה. יואב, לעומת זאת, כינה אותו היום הכי טוב בשנה. הוא כתב על מי המעיין הקרים ועל הנוף של הכנרת מהפסגה. מעניין ששני התלמידים הזכירו את אותו רגע: סופת גשם פתאומית בדרך למטה. בעוד שליאת ראתה בה את החלק הגרוע ביותר, יואב חשב שהיא הפכה את היום לבלתי נשכח.',
        questions: [
          {
            questionEn: 'How did Liat describe the hike?',
            questionHe: 'איך ליאת תיארה את המסלול?',
            correct: 'Exhausting and boring.',
            wrong: ['Exciting and fun.', 'Short and easy.'],
          },
          {
            questionEn: 'What did Yoav write about?',
            questionHe: 'על מה יואב כתב?',
            correct: 'The cold spring water and the view.',
            wrong: ['The heat and the long walk.', 'The bus ride home.'],
          },
          {
            questionEn: 'Which moment did both students mention?',
            questionHe: 'איזה רגע הזכירו שני התלמידים?',
            correct: 'A sudden rainstorm on the way down.',
            wrong: ['Lunch at the top.', 'A visit to a museum.'],
          },
        ],
      },
      {
        passageEn:
          'In many old fables, animals behave like people in order to teach a lesson. In "The Tortoise and the Hare", for example, the slow tortoise wins the race because the proud hare stops to sleep. Similarly, in "The Ant and the Grasshopper", the hardworking ant survives the winter, whereas the lazy grasshopper goes hungry. Both stories reward patience and effort. However, modern writers sometimes retell these fables from a different perspective. In one new version, the grasshopper is an artist whose music brings joy to the whole forest.',
        passageHe:
          'במשלים עתיקים רבים בעלי חיים מתנהגים כמו בני אדם כדי ללמד לקח. ב"הצב והארנב", למשל, הצב האיטי מנצח במרוץ כי הארנב הגאוותן עוצר לישון. באופן דומה, ב"הנמלה והחרגול" הנמלה החרוצה שורדת את החורף, ואילו החרגול העצלן נשאר רעב. שני הסיפורים מתגמלים סבלנות ומאמץ. אבל סופרים מודרניים מספרים לפעמים את המשלים האלה מחדש מנקודת מבט שונה. בגרסה חדשה אחת, החרגול הוא אמן שהמוזיקה שלו מביאה שמחה ליער כולו.',
        questions: [
          {
            questionEn: 'Why does the tortoise win the race?',
            questionHe: 'למה הצב מנצח במרוץ?',
            correct: 'The proud hare stops to sleep.',
            wrong: ['The tortoise takes a shortcut.', 'The hare gets lost in the forest.'],
          },
          {
            questionEn: 'What do both stories reward?',
            questionHe: 'מה שני הסיפורים מתגמלים?',
            correct: 'Patience and effort.',
            wrong: ['Speed and strength.', 'Music and art.'],
          },
          {
            questionEn: 'How is the grasshopper described in one new version?',
            questionHe: 'איך מתואר החרגול בגרסה חדשה אחת?',
            correct: 'As an artist whose music brings joy.',
            wrong: ['As a lazy thief.', 'As the ant’s teacher.'],
          },
        ],
      },
    ],
  },

  // Unit 3: Modals in the past (should have, must have, couldn't have, might have + V3)
  3: {
    vocabulary: [
      {
        clozeEn: 'Getting enough sleep before an exam is ____ for good results.',
        clozeHe: 'שינה מספקת לפני מבחן היא קריטית לתוצאות טובות.',
        answer: 'crucial',
        wrong: ['remorse', 'monument'],
      },
      {
        clozeEn: 'The driver felt deep ____ after the accident and visited the injured boy every day.',
        clozeHe: 'הנהג חש חרטה עמוקה אחרי התאונה וביקר את הילד הפצוע בכל יום.',
        answer: 'remorse',
        wrong: ['legacy', 'align'],
      },
      {
        clozeEn: 'It is easy to ____ small spelling mistakes when you write quickly.',
        clozeHe: 'קל לפספס שגיאות כתיב קטנות כשכותבים מהר.',
        answer: 'overlook',
        wrong: ['monument', 'flourish'],
      },
      {
        clozeEn: 'Desert plants ____ after the winter rains, covering the hills with flowers.',
        clozeHe: 'צמחי המדבר פורחים אחרי גשמי החורף ומכסים את הגבעות בפרחים.',
        answer: 'flourish',
        wrong: ['remorse', 'legacy'],
      },
      {
        clozeEn: 'The scientist’s greatest ____ is the school she founded for girls.',
        clozeHe: 'המורשת הגדולה ביותר של המדענית היא בית הספר שהקימה לבנות.',
        answer: 'legacy',
        wrong: ['overlook', 'anticipate'],
      },
      {
        clozeEn: 'Nobody could ____ how quickly the internet would change the world.',
        clozeHe: 'אף אחד לא יכול היה לצפות כמה מהר האינטרנט ישנה את העולם.',
        answer: 'anticipate',
        wrong: ['monument', 'crucial'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "I failed the test. I ____ studied harder."',
        correct: 'should have',
        wrong: ['should', 'must have'],
        explainHe: 'should have + V3 מביע חרטה על משהו שלא עשינו בעבר.',
        hintHe: 'הדובר מתחרט על משהו שלא עשה. איזה מבנה מביע חרטה על העבר?',
      },
      {
        questionEn: 'Complete the sentence: "The ground is wet. It ____ rained during the night."',
        correct: 'must have',
        wrong: ['should have', 'can’t have'],
        explainHe: 'האדמה הרטובה היא ראיה, ולכן must have + V3: אנחנו כמעט בטוחים שזה קרה.',
        hintHe: 'יש כאן ראיה למשהו שקרה בעבר. האם המבנה מביע ביטחון, חרטה או חוסר אפשרות?',
      },
      {
        questionEn: 'Which sentence shows that something was impossible in the past?',
        correct: 'She couldn’t have seen us; she was in Paris.',
        wrong: ['She must have seen us; she was in Paris.', 'She should have seen us; she was in Paris.'],
        explainHe: 'couldn’t have + V3 אומר שזה לא ייתכן שקרה, כי היא הייתה בפריז.',
        hintHe: 'אם היא הייתה בפריז, האם ייתכן שראתה אותנו? חפשו את המבנה של "לא ייתכן".',
      },
      {
        questionEn:
          'Complete the sentence: "The ancient builders ____ have used simple tools, but nobody knows for sure."',
        correct: 'might',
        wrong: ['must', 'should'],
        explainHe: 'nobody knows for sure מראה שזו רק אפשרות, ולכן might have + V3.',
        hintHe: 'קראו את סוף המשפט: האם מישהו בטוח?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'You should have told me about the problem.',
        wrong: ['You should have tell me about the problem.', 'You should had told me about the problem.'],
        explainHe: 'אחרי should have בא V3: told. אחרי should תמיד בא have ולא had.',
        hintHe: 'בדקו את המילה שאחרי should ואת צורת הפועל שאחריה.',
      },
      {
        questionEn: 'What does this sentence mean? "They must have missed the train."',
        correct: 'I am almost sure that they missed the train.',
        wrong: ['They had to miss the train.', 'It was a mistake to miss the train.'],
        explainHe: 'must have + V3 הוא מסקנה הגיונית על העבר: אני כמעט בטוח שזה קרה.',
        hintHe: 'כאן must לא מביע חובה. האם הוא מביע מסקנה או חרטה?',
      },
    ],
    sentences: [
      {
        en: 'We should have left home earlier to avoid the traffic.',
        he: 'היינו צריכים לצאת מהבית מוקדם יותר כדי להימנע מהפקקים.',
      },
      { en: 'The museum guard must have fallen asleep.', he: 'שומר המוזיאון בטח נרדם.' },
      { en: 'The king couldn’t have built the palace alone.', he: 'לא ייתכן שהמלך בנה את הארמון לבדו.' },
      { en: 'You shouldn’t have ignored the warning signs.', he: 'לא הייתם צריכים להתעלם מסימני האזהרה.' },
      {
        en: 'The ancient city might have been destroyed by an earthquake.',
        he: 'ייתכן שהעיר העתיקה נהרסה ברעידת אדמה.',
      },
      {
        en: 'The sailors must have used the stars to find their way.',
        he: 'המלחים בטח השתמשו בכוכבים כדי למצוא את דרכם.',
      },
    ],
    passages: [
      {
        passageEn:
          'Stonehenge, the famous stone circle in England, was built about five thousand years ago. Some of its huge stones came from Wales, more than two hundred kilometers away. The builders couldn’t have used trucks or cranes, so how did they move them? Archaeologists believe they must have used wooden sledges and ropes, pulled by hundreds of people. The stones also align with the sunrise on the longest day of the year, so the site might have been used as a calendar.',
        passageHe:
          'סטונהנג׳, מעגל האבנים המפורסם באנגליה, נבנה לפני כחמשת אלפים שנה. חלק מהאבנים הענקיות שלו הגיעו מוויילס, במרחק של יותר ממאתיים קילומטרים. הבונים לא יכלו להשתמש במשאיות או במנופים, אז איך הם הזיזו אותן? ארכיאולוגים מאמינים שהם בטח השתמשו במזחלות עץ ובחבלים, שנמשכו על ידי מאות אנשים. האבנים גם מיושרות עם הזריחה ביום הארוך ביותר בשנה, ולכן ייתכן שהאתר שימש כלוח שנה.',
        questions: [
          {
            questionEn: 'Where did some of the stones come from?',
            questionHe: 'מאיפה הגיעו חלק מהאבנים?',
            correct: 'From Wales.',
            wrong: ['From France.', 'From the nearby river.'],
          },
          {
            questionEn: 'How do archaeologists think the stones were moved?',
            questionHe: 'איך ארכיאולוגים חושבים שהאבנים הוזזו?',
            correct: 'With wooden sledges and ropes.',
            wrong: ['With trucks and cranes.', 'By boats along the coast.'],
          },
          {
            questionEn: 'Why might the site have been used as a calendar?',
            questionHe: 'למה ייתכן שהאתר שימש כלוח שנה?',
            correct: 'The stones align with the sunrise on the longest day.',
            wrong: ['It has twelve stones.', 'It was built by farmers.'],
          },
        ],
      },
      {
        passageEn:
          'In 1912, the Titanic was described as a ship that could never sink. On its first voyage, it received several warnings about icebergs, but the crew did not slow down. When the ship hit an iceberg, there were not enough lifeboats for everyone on board. More than fifteen hundred people lost their lives. Experts today say that the disaster could have been avoided. The captain should have reduced speed, and the owners should have provided more lifeboats.',
        passageHe:
          'ב-1912 הטיטאניק תוארה כספינה שלעולם לא תטבע. במסע הראשון שלה היא קיבלה כמה אזהרות על קרחונים, אבל הצוות לא האט. כשהספינה פגעה בקרחון, לא היו מספיק סירות הצלה לכל מי שהיה על הסיפון. יותר מאלף וחמש מאות בני אדם נספו. מומחים אומרים היום שאפשר היה למנוע את האסון. הקברניט היה צריך להפחית מהירות, והבעלים היו צריכים לספק יותר סירות הצלה.',
        questions: [
          {
            questionEn: 'How was the Titanic described in 1912?',
            questionHe: 'איך תוארה הטיטאניק ב-1912?',
            correct: 'As a ship that could never sink.',
            wrong: ['As the fastest ship in Europe.', 'As a ship for poor families.'],
          },
          {
            questionEn: 'What did the ship receive on its first voyage?',
            questionHe: 'מה קיבלה הספינה במסע הראשון שלה?',
            correct: 'Several warnings about icebergs.',
            wrong: ['A new captain.', 'Extra lifeboats.'],
          },
          {
            questionEn: 'What should the owners have done?',
            questionHe: 'מה הבעלים היו צריכים לעשות?',
            correct: 'Provided more lifeboats.',
            wrong: ['Hired a younger crew.', 'Chosen a shorter route.'],
          },
        ],
      },
    ],
  },

  // Unit 4: Module E reading skills: skimming and scanning, graph language, inference
  4: {
    vocabulary: [
      {
        clozeEn: 'Children who grow up speaking Hebrew and English are ____.',
        clozeHe: 'ילדים שגדלים כשהם מדברים עברית ואנגלית הם דו-לשוניים.',
        answer: 'bilingual',
        wrong: ['implication', 'enhance'],
      },
      {
        clozeEn: 'Puzzles and chess can improve ____ skills such as memory and attention.',
        clozeHe: 'פאזלים ושחמט יכולים לשפר מיומנויות קוגניטיביות כמו זיכרון וקשב.',
        answer: 'cognitive',
        wrong: ['flexibility', 'demonstrate'],
      },
      {
        clozeEn: 'The survey showed that the visitors were ____ young people under thirty.',
        clozeHe: 'הסקר הראה שהמבקרים היו ברובם צעירים מתחת לגיל שלושים.',
        answer: 'predominantly',
        wrong: ['adequate', 'enhance'],
      },
      {
        clozeEn: 'Working from home gives parents more ____ in their daily schedule.',
        clozeHe: 'עבודה מהבית נותנת להורים יותר גמישות בלוח הזמנים היומי.',
        answer: 'flexibility',
        wrong: ['cognitive', 'predominantly'],
      },
      {
        clozeEn: 'The guide gave us a ____ list of everything we need for the trip.',
        clozeHe: 'המדריך נתן לנו רשימה מקיפה של כל מה שאנחנו צריכים לטיול.',
        answer: 'comprehensive',
        wrong: ['flexibility', 'enhance'],
      },
      {
        clozeEn: 'The experiment will ____ how light affects plant growth.',
        clozeHe: 'הניסוי ידגים איך האור משפיע על צמיחת צמחים.',
        answer: 'demonstrate',
        wrong: ['bilingual', 'adequate'],
      },
    ],
    grammar: [
      {
        questionEn: 'In a survey, 80% of students said they read every day. How can this be described?',
        correct: 'The majority of students read every day.',
        wrong: ['A minority of students read every day.', 'Hardly any students read every day.'],
        explainHe: '80% הם יותר ממחצית, ולכן the majority (הרוב).',
        hintHe: 'האם 80% הם יותר או פחות ממחצית? חפשו את המילה שמתארת את החלק הגדול יותר.',
      },
      {
        questionEn: 'A graph shows that sales fell from 500 to 200. Which word describes this trend?',
        correct: 'declined',
        wrong: ['increased', 'remained stable'],
        explainHe: 'ירידה מ-500 ל-200 היא ירידה, ולכן declined.',
        hintHe: 'האם המספר עלה, ירד או נשאר זהה?',
      },
      {
        questionEn: 'What is the main purpose of skimming a text?',
        correct: 'Reading fast to understand the main topic',
        wrong: ['Finding one exact date or number', 'Translating every word into Hebrew'],
        explainHe: 'skimming הוא קריאה מהירה כדי להבין על מה הטקסט. חיפוש פרט מסוים נקרא scanning.',
        hintHe: 'יש הבדל בין קריאה מהירה כדי להבין את הנושא לבין חיפוש פרט אחד. מה מהם skimming?',
      },
      {
        questionEn:
          'A text says: "Even though the town has a new library, very few teenagers visit it." What can be inferred?',
        correct: 'The library has not attracted many teenagers.',
        wrong: ['Teenagers in the town do not like reading.', 'The town built the library for adults.'],
        explainHe: 'הטקסט אומר רק שמעט בני נוער מבקרים בספרייה. הוא לא אומר למה, ולכן אי אפשר להסיק שהם לא אוהבים לקרוא.',
        hintHe: 'הסקה צריכה להתבסס רק על מה שכתוב. מה הטקסט באמת אומר, בלי להוסיף סיבות?',
      },
      {
        questionEn: 'Which connector shows that the next sentence gives an example?',
        correct: 'For instance',
        wrong: ['In contrast', 'As a result'],
        explainHe: 'For instance (למשל) מציג דוגמה. In contrast מציג ניגוד, ו-As a result מציג תוצאה.',
        hintHe: 'חפשו את הביטוי שפירושו "למשל".',
      },
      {
        questionEn:
          'A chart shows that only 15% of the city’s energy comes from the sun. Which sentence is correct?',
        correct: 'Solar power provides a small minority of the city’s energy.',
        wrong: [
          'Solar power provides most of the city’s energy.',
          'Solar power provides exactly half of the city’s energy.',
        ],
        explainHe: '15% הם חלק קטן, פחות ממחצית, ולכן a small minority.',
        hintHe: 'האם 15% הם רוב, מחצית או חלק קטן?',
      },
    ],
    sentences: [
      { en: 'The graph shows a sharp rise in online shopping.', he: 'הגרף מראה עלייה חדה בקניות ברשת.' },
      { en: 'A minority of the participants preferred printed books.', he: 'מיעוט מהמשתתפים העדיף ספרים מודפסים.' },
      { en: 'Bilingual children often switch easily between tasks.', he: 'ילדים דו-לשוניים עוברים לעיתים קרובות בקלות בין משימות.' },
      { en: 'The study suggests that music can enhance concentration.', he: 'המחקר מרמז שמוזיקה יכולה לשפר את הריכוז.' },
      {
        en: 'Read the question first, then scan the text for the answer.',
        he: 'קראו קודם את השאלה, ואז סרקו את הטקסט כדי למצוא את התשובה.',
      },
      {
        en: 'The results demonstrate a clear link between sleep and memory.',
        he: 'התוצאות מדגימות קשר ברור בין שינה לזיכרון.',
      },
    ],
    passages: [
      {
        passageEn:
          'A recent study examined how smartphones affect sleep among teenagers. Researchers asked two thousand students aged thirteen to eighteen to record their phone use for a month. The results showed that the majority of students used their phones in bed after midnight. These students slept, on average, one hour less than students who left their phones outside the bedroom. In addition, they reported more difficulty concentrating in class. The researchers concluded that schools and parents should teach teenagers about healthy screen habits.',
        passageHe:
          'מחקר שנערך לאחרונה בדק איך סמארטפונים משפיעים על השינה של בני נוער. החוקרים ביקשו מאלפיים תלמידים בני שלוש עשרה עד שמונה עשרה לתעד את השימוש שלהם בטלפון במשך חודש. התוצאות הראו שרוב התלמידים השתמשו בטלפון במיטה אחרי חצות. התלמידים האלה ישנו בממוצע שעה אחת פחות מתלמידים שהשאירו את הטלפון מחוץ לחדר השינה. בנוסף, הם דיווחו על יותר קושי להתרכז בכיתה. החוקרים הסיקו שבתי ספר והורים צריכים ללמד בני נוער על הרגלי מסך בריאים.',
        questions: [
          {
            questionEn: 'How many students took part in the study?',
            questionHe: 'כמה תלמידים השתתפו במחקר?',
            correct: 'Two thousand students.',
            wrong: ['Two hundred students.', 'Eighteen students.'],
          },
          {
            questionEn: 'How much less did the phone users sleep?',
            questionHe: 'בכמה פחות ישנו המשתמשים בטלפון?',
            correct: 'One hour less on average.',
            wrong: ['Ten minutes less.', 'Three hours less.'],
          },
          {
            questionEn: 'What did the researchers conclude?',
            questionHe: 'מה הסיקו החוקרים?',
            correct: 'Teenagers should learn about healthy screen habits.',
            wrong: ['Phones should be banned in schools.', 'Students need longer school days.'],
          },
        ],
      },
      {
        passageEn:
          'For many years, people believed that learning two languages confused young children. However, modern research has shown the opposite. Bilingual children often perform better on tasks that require flexibility, such as switching between rules in a game. Scientists think this happens because their brains constantly choose which language to use. One study even found that elderly bilingual people developed memory problems about four years later than others. The implication is clear: learning a second language may protect the brain throughout life.',
        passageHe:
          'במשך שנים רבות אנשים האמינו שלימוד שתי שפות מבלבל ילדים צעירים. אבל מחקרים מודרניים הראו את ההפך. ילדים דו-לשוניים מצליחים לעיתים קרובות יותר במשימות שדורשות גמישות, כמו מעבר בין כללים במשחק. מדענים חושבים שזה קורה כי המוח שלהם בוחר כל הזמן באיזו שפה להשתמש. מחקר אחד אפילו מצא שאצל קשישים דו-לשוניים בעיות זיכרון התפתחו כארבע שנים מאוחר יותר מאשר אצל אחרים. המשמעות ברורה: לימוד שפה שנייה עשוי להגן על המוח לאורך כל החיים.',
        questions: [
          {
            questionEn: 'What did people believe for many years?',
            questionHe: 'במה אנשים האמינו במשך שנים רבות?',
            correct: 'Two languages confused young children.',
            wrong: ['Children learn languages slowly.', 'Games improve memory.'],
          },
          {
            questionEn: 'Why do scientists think bilingual children have more flexibility?',
            questionHe: 'למה מדענים חושבים שלילדים דו-לשוניים יש יותר גמישות?',
            correct: 'Their brains constantly choose which language to use.',
            wrong: ['They play more games.', 'They sleep longer than others.'],
          },
          {
            questionEn: 'What did one study find about elderly bilingual people?',
            questionHe: 'מה מצא מחקר אחד על קשישים דו-לשוניים?',
            correct: 'Their memory problems started about four years later.',
            wrong: ['They forgot their second language.', 'They learned new languages faster.'],
          },
        ],
      },
    ],
  },
};
