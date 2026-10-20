import type { ExamBankPack } from './types';

/**
 * Grade 12 exam question bank (Feature 43, Band III mastery and Bagrut Modules G / C). New
 * questions only: none of them appears in a grade 12 mission, mini-lesson, the placement test or
 * a contest. The last 2 items of each list and the second passage are for the mock exam.
 */
export const GRADE_12_EXAM_BANK: ExamBankPack = {
  // Unit 1: Academic connectors: addition, contrast, result and concession
  1: {
    vocabulary: [
      {
        clozeEn: 'Public transport reduces traffic. ____, it lowers air pollution in city centers.',
        clozeHe: 'תחבורה ציבורית מפחיתה פקקים. יתרה מזאת, היא מורידה את זיהום האוויר במרכזי הערים.',
        answer: 'furthermore',
        wrong: ['yield', 'nurture'],
      },
      {
        clozeEn: 'The factory closed its doors; ____, hundreds of workers lost their jobs.',
        clozeHe: 'המפעל סגר את שעריו; כתוצאה מכך מאות עובדים איבדו את מקום עבודתם.',
        answer: 'consequently',
        wrong: ['contemporary', 'framework'],
      },
      {
        clozeEn: 'The new irrigation method is expected to ____ twice as many tomatoes per field.',
        clozeHe: 'שיטת ההשקיה החדשה צפויה להניב פי שניים עגבניות בכל שדה.',
        answer: 'yield',
        wrong: ['framework', 'moreover'],
      },
      {
        clozeEn: 'Good teachers ____ curiosity and confidence in their students.',
        clozeHe: 'מורים טובים מטפחים סקרנות וביטחון עצמי אצל התלמידים שלהם.',
        answer: 'nurture',
        wrong: ['substantial', 'consequently'],
      },
      {
        clozeEn: 'The museum combines ancient art with ____ works by young Israeli artists.',
        clozeHe: 'המוזיאון משלב אמנות עתיקה עם יצירות עכשוויות של אמנים ישראלים צעירים.',
        answer: 'contemporary',
        wrong: ['yield', 'nurture'],
      },
      {
        clozeEn: 'The government invested a ____ amount of money in public hospitals.',
        clozeHe: 'הממשלה השקיעה סכום כסף ניכר בבתי חולים ציבוריים.',
        answer: 'substantial',
        wrong: ['nurture', 'moreover'],
      },
    ],
    grammar: [
      {
        questionEn:
          'Choose the connector: "Online courses are cheap. ____, they allow students to learn at their own pace."',
        correct: 'In addition',
        wrong: ['Nevertheless', 'Consequently'],
        explainHe: 'המשפט השני מוסיף יתרון נוסף, ולכן In addition (בנוסף).',
        hintHe: 'האם המשפט השני מוסיף רעיון, מציג ניגוד או מתאר תוצאה?',
      },
      {
        questionEn: 'Which sentence is punctuated correctly?',
        correct: 'The roads were icy; nevertheless, the bus arrived on time.',
        wrong: [
          'The roads were icy, nevertheless the bus arrived on time.',
          'The roads were icy nevertheless, the bus arrived on time.',
        ],
        explainHe: 'מילת קישור כמו nevertheless בין שני משפטים שלמים: נקודה-פסיק לפניה ופסיק אחריה.',
        hintHe: 'כשמילת קישור מחברת שני משפטים שלמים, איזה סימן בא לפניה ואיזה אחריה?',
      },
      {
        questionEn: 'Choose the connector: "The study was small. ____, its results should be treated with caution."',
        correct: 'Therefore',
        wrong: ['Moreover', 'However'],
        explainHe: 'הזהירות נובעת מכך שהמחקר קטן, ולכן Therefore (לכן).',
        hintHe: 'האם המשפט השני מוסיף מידע, מנגיד או נובע מהמשפט הראשון?',
      },
      {
        questionEn:
          'Choose the connector: "Smartphones help us stay in touch. ____, they can also make us feel lonely."',
        correct: 'However',
        wrong: ['Furthermore', 'Therefore'],
        explainHe: 'המשפט השני מציג צד הפוך, ולכן However (אולם).',
        hintHe: 'האם המשפט השני ממשיך את הרעיון הראשון, נובע ממנו, או מציג צד הפוך?',
      },
      {
        questionEn: 'Which sentence introduces a concession correctly?',
        correct: 'While it is true that exams cause stress, they also motivate students to study.',
        wrong: [
          'While it is true that exams cause stress, so they motivate students to study.',
          'Because it is true that exams cause stress, they also motivate students to study.',
        ],
        explainHe: 'While it is true that... מודה בנקודה של הצד השני, ואחריה באה הטענה שלנו, בלי so.',
        hintHe: 'הודאה בנקודה של הצד השני צריכה להוביל לטענה הפוכה. איזה משפט עושה את זה בלי מילת תוצאה?',
      },
      {
        questionEn: 'Choose the connector: "The plan is expensive. ____, it is the only realistic solution."',
        correct: 'Nevertheless',
        wrong: ['Consequently', 'Furthermore'],
        explainHe: 'למרות המחיר הגבוה, התוכנית היא הפתרון היחיד: ניגוד, ולכן Nevertheless (אף על פי כן).',
        hintHe: 'האם החלק השני הוא תוצאה של המחיר, תוספת עליו, או משהו שנכון למרותו?',
      },
    ],
    sentences: [
      { en: 'Furthermore, the survey revealed a sharp rise in volunteering.', he: 'יתרה מזאת, הסקר חשף עלייה חדה בהתנדבות.' },
      { en: 'The bridge was unsafe; therefore, it was closed immediately.', he: 'הגשר לא היה בטוח; לכן הוא נסגר מיד.' },
      {
        en: 'Moreover, reading fiction can strengthen our sense of empathy.',
        he: 'יתר על כן, קריאת ספרות יכולה לחזק את תחושת האמפתיה שלנו.',
      },
      { en: 'The data was incomplete; consequently, the report was delayed.', he: 'הנתונים היו חלקיים; כתוצאה מכך הדוח התעכב.' },
      {
        en: 'While it is true that cars are convenient, trains are greener.',
        he: 'אמנם נכון שמכוניות נוחות, אבל רכבות ידידותיות יותר לסביבה.',
      },
      {
        en: 'This framework helps writers organize their arguments clearly.',
        he: 'המסגרת הזאת עוזרת לכותבים לארגן את הטיעונים שלהם בבהירות.',
      },
    ],
    passages: [
      {
        passageEn:
          'Many cities around the world are introducing a four-day school week. Supporters argue that students return to class more rested and focused. Furthermore, schools save a substantial amount of money on electricity and transport. Critics, however, point out that working parents must find childcare on the extra free day. Consequently, some families have to pay for private programs that they cannot afford. While it is true that the model has benefits, experts agree that more research is needed before it is adopted widely.',
        passageHe:
          'ערים רבות ברחבי העולם מנהיגות שבוע לימודים של ארבעה ימים. התומכים טוענים שהתלמידים חוזרים לכיתה רעננים וממוקדים יותר. יתרה מזאת, בתי הספר חוסכים סכום כסף ניכר על חשמל ותחבורה. המבקרים, לעומת זאת, מציינים שהורים עובדים צריכים למצוא סידור לילדים ביום החופשי הנוסף. כתוצאה מכך חלק מהמשפחות נאלצות לשלם על תוכניות פרטיות שאין ידן משגת. אמנם נכון שלמודל יש יתרונות, אבל מומחים מסכימים שדרוש מחקר נוסף לפני שהוא יאומץ באופן נרחב.',
        questions: [
          {
            questionEn: 'What do supporters argue?',
            questionHe: 'מה התומכים טוענים?',
            correct: 'Students return to class more rested and focused.',
            wrong: ['Teachers earn more money.', 'Students get better grades in math.'],
          },
          {
            questionEn: 'What do schools save money on?',
            questionHe: 'על מה בתי הספר חוסכים כסף?',
            correct: 'Electricity and transport.',
            wrong: ['Books and uniforms.', 'Teachers’ salaries.'],
          },
          {
            questionEn: 'What problem do critics point out?',
            questionHe: 'על איזו בעיה מצביעים המבקרים?',
            correct: 'Working parents must find childcare.',
            wrong: ['Students forget what they learned.', 'The school day becomes too long.'],
          },
        ],
      },
      {
        passageEn:
          'In the past, museums were quiet places where visitors simply looked at objects behind glass. Contemporary museums, by contrast, invite visitors to touch, play and create. One science museum in Jerusalem, for instance, lets children build their own robots and test them. Moreover, many museums now offer evening events for teenagers and young adults. As a result, the number of young visitors has grown significantly in recent years. Some traditional curators, nevertheless, fear that fun is replacing serious learning.',
        passageHe:
          'בעבר מוזיאונים היו מקומות שקטים שבהם המבקרים פשוט הסתכלו על חפצים מאחורי זכוכית. מוזיאונים עכשוויים, לעומת זאת, מזמינים את המבקרים לגעת, לשחק וליצור. מוזיאון מדע אחד בירושלים, למשל, מאפשר לילדים לבנות רובוטים משלהם ולבחון אותם. יתר על כן, מוזיאונים רבים מציעים היום אירועי ערב לבני נוער ולצעירים. כתוצאה מכך מספר המבקרים הצעירים גדל משמעותית בשנים האחרונות. אף על פי כן, כמה אוצרים מסורתיים חוששים שהכיף מחליף את הלמידה הרצינית.',
        questions: [
          {
            questionEn: 'How were museums in the past described?',
            questionHe: 'איך מתוארים המוזיאונים של העבר?',
            correct: 'Quiet places with objects behind glass.',
            wrong: ['Noisy places full of children.', 'Places for evening parties.'],
          },
          {
            questionEn: 'What can children do at the science museum in Jerusalem?',
            questionHe: 'מה ילדים יכולים לעשות במוזיאון המדע בירושלים?',
            correct: 'Build their own robots and test them.',
            wrong: ['Watch films about space.', 'Paint the museum walls.'],
          },
          {
            questionEn: 'What do some traditional curators fear?',
            questionHe: 'ממה חוששים כמה אוצרים מסורתיים?',
            correct: 'Fun is replacing serious learning.',
            wrong: ['Museums will lose money.', 'Robots will break.'],
          },
        ],
      },
    ],
  },

  // Unit 2: The Bagrut opinion essay: thesis, counter-argument, concession (despite / in spite of), conclusion
  2: {
    vocabulary: [
      {
        clozeEn: 'In many countries, wearing a seatbelt is ____ for every passenger.',
        clozeHe: 'במדינות רבות חגירת חגורת בטיחות היא חובה לכל נוסע.',
        answer: 'mandatory',
        wrong: ['counterpart', 'equip'],
      },
      {
        clozeEn: 'The lawyer made a ____ argument, and the jury was convinced.',
        clozeHe: 'עורכת הדין הציגה טיעון משכנע, וחבר המושבעים השתכנע.',
        answer: 'compelling',
        wrong: ['equip', 'concession'],
      },
      {
        clozeEn: 'Many doctors ____ a diet rich in vegetables and whole grains.',
        clozeHe: 'רופאים רבים ממליצים על תזונה עשירה בירקות ובדגנים מלאים.',
        answer: 'advocate',
        wrong: ['mandatory', 'undeniably'],
      },
      {
        clozeEn: 'The Israeli foreign minister met her French ____ in Paris.',
        clozeHe: 'שרת החוץ הישראלית נפגשה עם עמיתה הצרפתי בפריז.',
        answer: 'counterpart',
        wrong: ['rigor', 'equip'],
      },
      {
        clozeEn: 'Clean water is a ____ human right.',
        clozeHe: 'מים נקיים הם זכות אדם בסיסית.',
        answer: 'fundamental',
        wrong: ['counterpart', 'equip'],
      },
      {
        clozeEn: 'The course aims to ____ students with the skills they need for university.',
        clozeHe: 'הקורס נועד לצייד את התלמידים במיומנויות שהם צריכים לאוניברסיטה.',
        answer: 'equip',
        wrong: ['compelling', 'concession'],
      },
    ],
    grammar: [
      {
        questionEn: 'Which sentence is the strongest thesis statement?',
        correct: 'School uniforms should be required because they reduce bullying and save families money.',
        wrong: ['Some schools have uniforms and some schools do not.', 'In this essay, I will write about school uniforms.'],
        explainHe: 'הצהרת תזה טובה מציגה עמדה ברורה ואת הסיבות שיפותחו בחיבור.',
        hintHe: 'חפשו משפט שמביע עמדה ברורה וגם מציין את הסיבות שלה.',
      },
      {
        questionEn: 'Complete the sentence: "____ the high price, many families buy organic food."',
        correct: 'Despite',
        wrong: ['Although', 'However'],
        explainHe: 'אחרי Despite בא שם עצם (the high price). Although ו-However לא באים לפני שם עצם בלבד.',
        hintHe: 'אחרי החסר יש רק שם עצם, בלי פועל. איזו מילת ניגוד מתאימה לפני שם עצם?',
      },
      {
        questionEn: 'Which sentence presents a counter-argument fairly?',
        correct: 'Some people argue that homework is a waste of time; however, it helps students practice.',
        wrong: ['Homework is a waste of time, and nobody should ever do it.', 'Everyone agrees that homework is useful.'],
        explainHe: 'טיעון נגד הוגן מציג את דעת הצד השני, ואחר כך עונה לה (however).',
        hintHe: 'טיעון נגד מציג קודם את הדעה של הצד השני ואז משיב לה. איזה משפט עושה את שני הדברים?',
      },
      {
        questionEn: 'Complete the sentence: "In spite of ____, the team continued training."',
        correct: 'the heat',
        wrong: ['it was hot', 'the heat was strong'],
        explainHe: 'אחרי In spite of בא שם עצם (the heat), לא משפט שלם עם פועל.',
        hintHe: 'מה בא אחרי In spite of: משפט עם נושא ופועל, או שם עצם בלבד?',
      },
      {
        questionEn: 'What should a good conclusion of an opinion essay do?',
        correct: 'Restate the main opinion in new words',
        wrong: ['Add a completely new argument', 'Copy the first paragraph exactly'],
        explainHe: 'מסקנה טובה חוזרת על העמדה המרכזית במילים חדשות ומסכמת את הטיעונים, בלי להוסיף טיעון חדש.',
        hintHe: 'המסקנה סוגרת את החיבור. האם זה המקום לטיעונים חדשים, או לחזור על העמדה בדרך חדשה?',
      },
      {
        questionEn:
          'Choose the correct linking phrase: "____, I believe that public transport should be free for students."',
        correct: 'To sum up',
        wrong: ['For example', 'In contrast'],
        explainHe: 'To sum up (לסיכום) פותח את המסקנה ומחזיר את העמדה האישית.',
        hintHe: 'המשפט חוזר על העמדה בסוף החיבור. איזה ביטוי פותח סיכום?',
      },
    ],
    sentences: [
      {
        en: 'In my opinion, community service should be mandatory for teenagers.',
        he: 'לדעתי, התנדבות בקהילה צריכה להיות חובה לבני נוער.',
      },
      { en: 'Despite the risks, space exploration is worth the investment.', he: 'למרות הסיכונים, חקר החלל שווה את ההשקעה.' },
      { en: 'Opponents claim that the plan is too expensive.', he: 'המתנגדים טוענים שהתוכנית יקרה מדי.' },
      { en: 'Undeniably, technology has changed the way we study.', he: 'אין ספק שהטכנולוגיה שינתה את הדרך שבה אנחנו לומדים.' },
      { en: 'To sum up, the advantages clearly outweigh the disadvantages.', he: 'לסיכום, היתרונות גוברים בבירור על החסרונות.' },
      {
        en: 'Although some disagree, I strongly advocate a longer summer break.',
        he: 'אף שיש מי שחולקים, אני תומך בתוקף בחופשת קיץ ארוכה יותר.',
      },
    ],
    passages: [
      {
        passageEn:
          'Should mobile phones be banned in high schools? In my opinion, they should be allowed, but only under clear rules. Opponents argue that phones distract students and encourage cheating. While this concern is understandable, a total ban ignores the fact that phones are useful learning tools. For instance, students can check facts, record lessons and contact their parents in an emergency. To sum up, schools should teach responsible use rather than forbid phones completely.',
        passageHe:
          'האם צריך לאסור טלפונים ניידים בתיכונים? לדעתי צריך להתיר אותם, אבל רק לפי כללים ברורים. המתנגדים טוענים שהטלפונים מסיחים את דעת התלמידים ומעודדים העתקות. אף שהחשש הזה מובן, איסור מוחלט מתעלם מכך שטלפונים הם כלי למידה שימושיים. למשל, תלמידים יכולים לבדוק עובדות, להקליט שיעורים וליצור קשר עם ההורים שלהם במקרה חירום. לסיכום, בתי הספר צריכים ללמד שימוש אחראי במקום לאסור את הטלפונים לגמרי.',
        questions: [
          {
            questionEn: 'What is the writer’s opinion?',
            questionHe: 'מה דעתו של הכותב?',
            correct: 'Phones should be allowed under clear rules.',
            wrong: ['Phones should be banned completely.', 'Phones should be used only at home.'],
          },
          {
            questionEn: 'What do opponents argue?',
            questionHe: 'מה המתנגדים טוענים?',
            correct: 'Phones distract students and encourage cheating.',
            wrong: ['Phones are too expensive.', 'Phones break easily.'],
          },
          {
            questionEn: 'What does the writer suggest at the end?',
            questionHe: 'מה הכותב מציע בסוף?',
            correct: 'Schools should teach responsible use.',
            wrong: ['Parents should buy cheaper phones.', 'Teachers should collect all phones.'],
          },
        ],
      },
      {
        passageEn:
          'Some educators advocate replacing written exams with group projects. They claim that projects equip students with fundamental skills such as teamwork and planning. Undeniably, these skills are essential in the modern workplace. Despite this advantage, projects have a serious weakness: it is hard to know how much each student contributed. In addition, quieter students may let others do most of the work. Therefore, the best solution may be a combination of exams and projects.',
        passageHe:
          'יש אנשי חינוך שתומכים בהחלפת מבחנים כתובים בפרויקטים קבוצתיים. הם טוענים שפרויקטים מציידים את התלמידים במיומנויות יסוד כמו עבודת צוות ותכנון. אין ספק שהמיומנויות האלה חיוניות במקום העבודה המודרני. למרות היתרון הזה, לפרויקטים יש חולשה רצינית: קשה לדעת כמה כל תלמיד תרם. בנוסף, תלמידים שקטים יותר עלולים לתת לאחרים לעשות את רוב העבודה. לכן ייתכן שהפתרון הטוב ביותר הוא שילוב של מבחנים ופרויקטים.',
        questions: [
          {
            questionEn: 'What do some educators want to replace?',
            questionHe: 'מה רוצים להחליף כמה אנשי חינוך?',
            correct: 'Written exams.',
            wrong: ['Group projects.', 'School textbooks.'],
          },
          {
            questionEn: 'What is a weakness of group projects?',
            questionHe: 'מהי חולשה של פרויקטים קבוצתיים?',
            correct: 'It is hard to know how much each student contributed.',
            wrong: ['They take too much time.', 'They cost a lot of money.'],
          },
          {
            questionEn: 'What solution does the writer suggest?',
            questionHe: 'איזה פתרון הכותב מציע?',
            correct: 'A combination of exams and projects.',
            wrong: ['Only written exams.', 'More homework for quiet students.'],
          },
        ],
      },
    ],
  },

  // Unit 3: Module G unseen: author's tone and attitude, synthesis across paragraphs
  3: {
    vocabulary: [
      {
        clozeEn: 'Many scientists remain ____ about claims that the new pill cures every illness.',
        clozeHe: 'מדענים רבים נשארים ספקנים לגבי הטענות שהגלולה החדשה מרפאת כל מחלה.',
        answer: 'skeptical',
        wrong: ['metropolitan', 'revitalize'],
      },
      {
        clozeEn: 'Your explanation sounds ____, but we still need to test it.',
        clozeHe: 'ההסבר שלך נשמע סביר, אבל אנחנו עדיין צריכים לבדוק אותו.',
        answer: 'plausible',
        wrong: ['ecological', 'dividend'],
      },
      {
        clozeEn: 'Stress at work was the ____ cause of his health problems.',
        clozeHe: 'לחץ בעבודה היה הגורם הבסיסי לבעיות הבריאות שלו.',
        answer: 'underlying',
        wrong: ['metropolitan', 'revitalize'],
      },
      {
        clozeEn: 'Removing the wetlands caused serious ____ damage to birds and fish.',
        clozeHe: 'ייבוש אזורי הביצות גרם נזק אקולוגי חמור לציפורים ולדגים.',
        answer: 'ecological',
        wrong: ['skeptical', 'intervention'],
      },
      {
        clozeEn: 'The city plans to ____ its old port with cafés, parks and a market.',
        clozeHe: 'העירייה מתכננת להחיות מחדש את הנמל הישן שלה עם בתי קפה, פארקים ושוק.',
        answer: 'revitalize',
        wrong: ['inherent', 'dividend'],
      },
      {
        clozeEn: 'Over two million people live in the Tel Aviv ____ area.',
        clozeHe: 'יותר משני מיליון אנשים גרים במטרופולין תל אביב.',
        answer: 'metropolitan',
        wrong: ['skeptical', 'intervention'],
      },
    ],
    grammar: [
      {
        questionEn:
          'A writer calls a new law "a brilliant step that will finally protect our children." What is the writer’s tone?',
        correct: 'Enthusiastic',
        wrong: ['Skeptical', 'Neutral'],
        explainHe: 'המילים brilliant ו-finally מראות התלהבות ותמיכה בחוק.',
        hintHe: 'שימו לב לתארים שהכותב בחר. האם הם חיוביים, שליליים או ניטרליים?',
      },
      {
        questionEn:
          'A reviewer writes: "The so-called masterpiece is, at best, a forgettable film." What is the reviewer’s attitude?',
        correct: 'Critical',
        wrong: ['Admiring', 'Indifferent'],
        explainHe: 'so-called ו-at best מראים שהמבקר מזלזל בסרט, ולכן הגישה ביקורתית.',
        hintHe: 'מה המבקר חושב על הסרט באמת? שימו לב לביטויים שמקטינים את ערכו.',
      },
      {
        questionEn: 'Which phrase shows that the author is NOT sure about a claim?',
        correct: 'It remains unclear whether',
        wrong: ['It is clear that', 'There is no doubt that'],
        explainHe: 'It remains unclear whether מביע ספק. שני הביטויים האחרים מביעים ביטחון.',
        hintHe: 'חפשו ביטוי שמביע ספק ולא ביטחון.',
      },
      {
        questionEn:
          'Paragraph 2 says that a dam blocked the river. Paragraph 4 says that fish disappeared from the lake. How are the paragraphs connected?',
        correct: 'Paragraph 2 explains the cause of the problem in paragraph 4.',
        wrong: ['Paragraph 4 explains why the dam was built.', 'The paragraphs describe two unrelated events.'],
        explainHe: 'הסכר (פסקה 2) הוא הסיבה, והיעלמות הדגים (פסקה 4) היא התוצאה.',
        hintHe: 'מה קרה קודם, ומה יכול להיות תוצאה שלו? חפשו קשר של סיבה ותוצאה.',
      },
      {
        questionEn: 'Which sentence is written in a neutral, objective tone?',
        correct: 'The report found that air pollution rose by ten percent.',
        wrong: [
          'The shocking report proves that our leaders have failed us.',
          'Sadly, the terrible report shows how hopeless things are.',
        ],
        explainHe: 'משפט אובייקטיבי מוסר עובדות בלי מילים רגשיות כמו shocking או terrible.',
        hintHe: 'חפשו משפט שמוסר רק עובדה, בלי מילים שמביעות רגש או שיפוט.',
      },
      {
        questionEn:
          'An author writes: "Experts promised that the project would save the river. Ten years later, the river is drier than ever." What does the author suggest?',
        correct: 'The experts’ promise was not kept.',
        wrong: ['The project saved the river.', 'The experts did not make any promise.'],
        explainHe: 'הכותב מציב את ההבטחה מול המציאות, ומרמז שההבטחה לא התקיימה.',
        hintHe: 'השוו בין מה שהובטח לבין מה שקרה אחרי עשר שנים. מה המסקנה?',
      },
    ],
    sentences: [
      {
        en: 'The author’s tone becomes more skeptical in the final paragraph.',
        he: 'הטון של הכותב נעשה ספקני יותר בפסקה האחרונה.',
      },
      { en: 'The writer clearly admires the young scientists in the story.', he: 'הכותב מעריץ בבירור את המדענים הצעירים בסיפור.' },
      { en: 'Paragraph three explains the cause of the crisis.', he: 'הפסקה השלישית מסבירה את הסיבה למשבר.' },
      { en: 'The underlying message is that cities must protect nature.', he: 'המסר הבסיסי הוא שערים חייבות להגן על הטבע.' },
      { en: 'Quote a short phrase from the text to support your answer.', he: 'צטטו ביטוי קצר מהטקסט כדי לבסס את התשובה שלכם.' },
      {
        en: 'The government intervention came too late to save the forest.',
        he: 'התערבות הממשלה הגיעה מאוחר מדי כדי להציל את היער.',
      },
    ],
    passages: [
      {
        passageEn:
          'In the 1950s, the Hula Lake in northern Israel was drained to create farmland and to fight malaria. At the time, the project was celebrated as a great national achievement. However, the results were far less impressive than planners had promised. The dry soil was poor, rare birds and fish disappeared, and dust storms damaged nearby fields. In the 1990s, a small part of the valley was flooded again, creating a new lake. Today, millions of migrating birds stop there every year, and the new lake has become a symbol of ecological repair.',
        passageHe:
          'בשנות החמישים יובש אגם החולה שבצפון ישראל כדי ליצור שטחי חקלאות ולהילחם במלריה. באותה תקופה הפרויקט נחגג כהישג לאומי גדול. אבל התוצאות היו הרבה פחות מרשימות ממה שהבטיחו המתכננים. האדמה היבשה הייתה דלה, ציפורים ודגים נדירים נעלמו, וסופות אבק פגעו בשדות הסמוכים. בשנות התשעים הוצף מחדש חלק קטן מהעמק, ונוצר אגם חדש. היום מיליוני ציפורים נודדות עוצרות שם בכל שנה, והאגם החדש הפך לסמל של תיקון אקולוגי.',
        questions: [
          {
            questionEn: 'Why was the Hula Lake drained?',
            questionHe: 'למה יובש אגם החולה?',
            correct: 'To create farmland and to fight malaria.',
            wrong: ['To build a new city.', 'To produce electricity.'],
          },
          {
            questionEn: 'What happened after the lake was drained?',
            questionHe: 'מה קרה אחרי שהאגם יובש?',
            correct: 'Rare birds and fish disappeared.',
            wrong: ['The soil became very rich.', 'Tourism grew quickly.'],
          },
          {
            questionEn: 'What has the new lake become a symbol of?',
            questionHe: 'למה הפך האגם החדש לסמל?',
            correct: 'Ecological repair.',
            wrong: ['National farming success.', 'The fight against malaria.'],
          },
        ],
      },
      {
        passageEn:
          'Every few years, a technology company announces that its new gadget will "change the way we live forever". Critics have learned to treat such promises with caution. Smart glasses, for example, were introduced with enormous excitement but were quickly forgotten by most consumers. The underlying problem, according to some analysts, is that companies design products that impress investors rather than solve real needs. Nevertheless, a few inventions, such as the smartphone, did transform daily life. The challenge for readers is to tell the difference between genuine innovation and clever marketing.',
        passageHe:
          'כל כמה שנים חברת טכנולוגיה מכריזה שהמכשיר החדש שלה "ישנה את הדרך שבה אנחנו חיים לתמיד". המבקרים למדו להתייחס להבטחות כאלה בזהירות. משקפיים חכמים, למשל, הוצגו בהתלהבות עצומה, אבל רוב הצרכנים שכחו אותם מהר. הבעיה הבסיסית, לדברי כמה אנליסטים, היא שחברות מעצבות מוצרים שמרשימים משקיעים במקום לפתור צרכים אמיתיים. אף על פי כן, כמה המצאות, כמו הסמארטפון, אכן שינו את חיי היומיום. האתגר של הקוראים הוא להבחין בין חדשנות אמיתית לבין שיווק מתוחכם.',
        questions: [
          {
            questionEn: 'How do critics treat the companies’ promises?',
            questionHe: 'איך המבקרים מתייחסים להבטחות של החברות?',
            correct: 'With caution.',
            wrong: ['With great excitement.', 'With complete trust.'],
          },
          {
            questionEn: 'What happened to smart glasses?',
            questionHe: 'מה קרה למשקפיים החכמים?',
            correct: 'They were quickly forgotten by most consumers.',
            wrong: ['They replaced the smartphone.', 'They became cheaper every year.'],
          },
          {
            questionEn: 'According to analysts, what is the underlying problem?',
            questionHe: 'לפי האנליסטים, מהי הבעיה הבסיסית?',
            correct: 'Products are designed to impress investors.',
            wrong: ['Gadgets are too expensive to build.', 'Consumers do not like new technology.'],
          },
        ],
      },
    ],
  },

  // Unit 4: Global horizons: inversion for emphasis, formal register, professional English
  4: {
    vocabulary: [
      {
        clozeEn: 'Employers value ____ because the job market changes so quickly.',
        clozeHe: 'מעסיקים מעריכים כושר הסתגלות כי שוק העבודה משתנה כל כך מהר.',
        answer: 'adaptability',
        wrong: ['paramount', 'aspire'],
      },
      {
        clozeEn: 'After months of ____, the two companies finally signed the agreement.',
        clozeHe: 'אחרי חודשים של משא ומתן, שתי החברות חתמו סוף סוף על ההסכם.',
        answer: 'negotiation',
        wrong: ['integrity', 'aspire'],
      },
      {
        clozeEn: 'A judge must act with complete ____ and never accept gifts.',
        clozeHe: 'שופט חייב לפעול ביושרה מלאה ולעולם לא לקבל מתנות.',
        answer: 'integrity',
        wrong: ['negotiation', 'cultivate'],
      },
      {
        clozeEn: 'In an emergency, the safety of the passengers is ____.',
        clozeHe: 'במקרה חירום, ביטחון הנוסעים הוא מעל הכול.',
        answer: 'paramount',
        wrong: ['aspire', 'mastery'],
      },
      {
        clozeEn: 'Many young Israelis ____ to work in high-tech or medicine.',
        clozeHe: 'צעירים ישראלים רבים שואפים לעבוד בהייטק או ברפואה.',
        answer: 'aspire',
        wrong: ['paramount', 'competence'],
      },
      {
        clozeEn: 'Winning the national debate championship was a ____ for our small school.',
        clozeHe: 'הזכייה באליפות הדיבייט הארצית הייתה ניצחון מזהיר לבית הספר הקטן שלנו.',
        answer: 'triumph',
        wrong: ['cultivate', 'competence'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "Not only ____ fluent English, but she also speaks Arabic."',
        correct: 'does she speak',
        wrong: ['she speaks', 'she does speak'],
        explainHe: 'אחרי Not only בתחילת משפט בא סדר מילים הפוך, כמו בשאלה: does she speak.',
        hintHe: 'Not only בתחילת המשפט משנה את סדר המילים. איזו אפשרות בנויה כמו שאלה?',
      },
      {
        questionEn: 'Which sentence uses inversion correctly?',
        correct: 'Never have I seen such a beautiful sunset.',
        wrong: ['Never I have seen such a beautiful sunset.', 'Never have I saw such a beautiful sunset.'],
        explainHe: 'אחרי Never בתחילת משפט בא פועל העזר לפני הנושא (have I), ואחריו V3: seen.',
        hintHe: 'בהיפוך, איפה עומד פועל העזר ביחס לנושא? ובדקו את צורת הפועל אחרי have.',
      },
      {
        questionEn: 'Which opening is most suitable for a formal email to a company?',
        correct: 'Dear Sir or Madam,',
        wrong: ['Hey guys!', 'Hi there, what’s up?'],
        explainHe: 'במכתב רשמי לאדם שאיננו מכירים פותחים ב-Dear Sir or Madam.',
        hintHe: 'במכתב רשמי לא משתמשים בפנייה של חברים. איזו פתיחה מתאימה לאדם זר בעבודה?',
      },
      {
        questionEn: 'Choose the most formal phrase: "____ if the position is still available."',
        correct: 'I would like to know',
        wrong: ['Tell me', 'I wanna know'],
        explainHe: 'I would like to know מנומס ורשמי. Tell me נשמע כמו פקודה, ו-wanna הוא דיבור יומיומי.',
        hintHe: 'חפשו את הניסוח המנומס ביותר, בלי סלנג ובלי ציווי.',
      },
      {
        questionEn: 'Complete the sentence: "Rarely ____ such a talented young engineer."',
        correct: 'do we meet',
        wrong: ['we meet', 'we do meet'],
        explainHe: 'אחרי Rarely בתחילת משפט בא סדר מילים הפוך: do we meet.',
        hintHe: 'Rarely בתחילת המשפט עובד כמו Never. איזו אפשרות בנויה כמו שאלה?',
      },
      {
        questionEn: 'Which closing is correct for a formal letter that began with "Dear Sir or Madam"?',
        correct: 'Yours faithfully,',
        wrong: ['See you soon,', 'Love,'],
        explainHe: 'כשהמכתב נפתח ב-Dear Sir or Madam (בלי שם), חותמים ב-Yours faithfully.',
        hintHe: 'המכתב רשמי ולא פונה בשם. איזו חתימה מתאימה לאדם זר?',
      },
    ],
    sentences: [
      {
        en: 'Not only did she win the prize, but she also broke a record.',
        he: 'לא רק שהיא זכתה בפרס, היא גם שברה שיא.',
      },
      {
        en: 'I am writing to apply for the position of summer intern.',
        he: 'אני כותב כדי להגיש מועמדות למשרת מתמחה לקיץ.',
      },
      { en: 'Integrity is paramount in every professional relationship.', he: 'יושרה היא מעל הכול בכל קשר מקצועי.' },
      { en: 'Never before have so many young people worked from home.', he: 'מעולם לא עבדו כל כך הרבה צעירים מהבית.' },
      {
        en: 'I look forward to hearing from you at your earliest convenience.',
        he: 'אשמח לשמוע ממך בהקדם האפשרי.',
      },
      {
        en: 'Strong communication skills will help you succeed in any career.',
        he: 'מיומנויות תקשורת טובות יעזרו לכם להצליח בכל קריירה.',
      },
    ],
    passages: [
      {
        passageEn:
          'Noa Barak, a twenty-two-year-old engineer from Haifa, has just been chosen to lead a team at an international company. When she was in high school, she struggled with English and almost gave up. Not only did she improve her grades, but she also started a free tutoring club for younger students. Her teachers say that her greatest strength is adaptability: she learns quickly from every mistake. In her acceptance speech, Noa said that integrity matters more than talent. She hopes to inspire other young women to aspire to careers in technology.',
        passageHe:
          'נועה ברק, מהנדסת בת עשרים ושתיים מחיפה, נבחרה זה עתה להוביל צוות בחברה בינלאומית. כשהייתה בתיכון היא התקשתה באנגלית וכמעט ויתרה. לא רק שהיא שיפרה את הציונים שלה, היא גם הקימה מועדון שיעורי עזר חינמי לתלמידים צעירים יותר. המורים שלה אומרים שהחוזקה הגדולה ביותר שלה היא כושר ההסתגלות: היא לומדת מהר מכל טעות. בנאום הקבלה שלה אמרה נועה שיושרה חשובה יותר מכישרון. היא מקווה לעורר השראה בצעירות אחרות לשאוף לקריירה בטכנולוגיה.',
        questions: [
          {
            questionEn: 'What did Noa struggle with in high school?',
            questionHe: 'במה נועה התקשתה בתיכון?',
            correct: 'English.',
            wrong: ['Mathematics.', 'Making friends.'],
          },
          {
            questionEn: 'What did she start besides improving her grades?',
            questionHe: 'מה היא הקימה מלבד שיפור הציונים שלה?',
            correct: 'A free tutoring club for younger students.',
            wrong: ['A technology company.', 'A sports team.'],
          },
          {
            questionEn: 'According to Noa, what matters more than talent?',
            questionHe: 'לפי נועה, מה חשוב יותר מכישרון?',
            correct: 'Integrity.',
            wrong: ['Hard work.', 'Good luck.'],
          },
        ],
      },
      {
        passageEn:
          'Dear Hiring Manager, I am writing to apply for the position of junior translator at your company. I recently completed my studies in English and Arabic at the University of Haifa. During my final year, I translated documents for a local hospital, which taught me accuracy and responsibility. Rarely have I enjoyed a task as much as helping patients understand their treatment. I would welcome the opportunity to discuss how my skills could benefit your team. Yours sincerely, Yarden Cohen.',
        passageHe:
          'למנהל הגיוס שלום, אני כותבת כדי להגיש מועמדות למשרת מתרגמת זוטרה בחברה שלכם. לאחרונה סיימתי את לימודי האנגלית והערבית באוניברסיטת חיפה. בשנה האחרונה שלי תרגמתי מסמכים עבור בית חולים מקומי, וזה לימד אותי דיוק ואחריות. רק לעיתים רחוקות נהניתי ממשימה כמו מהעזרה למטופלים להבין את הטיפול שלהם. אשמח להזדמנות לשוחח על האופן שבו הכישורים שלי יכולים להועיל לצוות שלכם. בכבוד רב, ירדן כהן.',
        questions: [
          {
            questionEn: 'Which position is Yarden applying for?',
            questionHe: 'לאיזו משרה ירדן מגישה מועמדות?',
            correct: 'Junior translator.',
            wrong: ['Hospital nurse.', 'English teacher.'],
          },
          {
            questionEn: 'What did Yarden do during the final year of studies?',
            questionHe: 'מה ירדן עשתה בשנת הלימודים האחרונה?',
            correct: 'Translated documents for a local hospital.',
            wrong: ['Taught Arabic at a school.', 'Worked as a tour guide.'],
          },
          {
            questionEn: 'What did the hospital work teach Yarden?',
            questionHe: 'מה לימדה את ירדן העבודה בבית החולים?',
            correct: 'Accuracy and responsibility.',
            wrong: ['Patience and humor.', 'Speed and creativity.'],
          },
        ],
      },
    ],
  },
};
