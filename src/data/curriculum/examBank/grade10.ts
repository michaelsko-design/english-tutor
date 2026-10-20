import type { ExamBankPack } from './types';

/**
 * Grade 10 exam question bank (Feature 43, Band III entry and Bagrut foundations). New questions
 * only: none of them appears in a grade 10 mission, mini-lesson, the placement test or a contest.
 * The last 2 items of each list and the second passage are for the mock exam.
 */
export const GRADE_10_EXAM_BANK: ExamBankPack = {
  // Unit 1: Passive Voice (Present, Past and Future Simple)
  1: {
    vocabulary: [
      {
        clozeEn: 'One ____ of rising sea levels is that some coastal towns may disappear.',
        clozeHe: 'אחת ההשלכות של עליית מפלס הים היא שחלק מעיירות החוף עלולות להיעלם.',
        answer: 'consequence',
        wrong: ['urban', 'collaborate'],
      },
      {
        clozeEn: 'LED bulbs are more ____ than old bulbs because they use less energy.',
        clozeHe: 'נורות לד יעילות יותר מנורות ישנות כי הן צורכות פחות אנרגיה.',
        answer: 'efficient',
        wrong: ['urban', 'consequence'],
      },
      {
        clozeEn: 'The city council plans to ____ a new recycling program next year.',
        clozeHe: 'מועצת העיר מתכננת ליישם תוכנית מחזור חדשה בשנה הבאה.',
        answer: 'implement',
        wrong: ['urban', 'efficient'],
      },
      {
        clozeEn: 'Rooftop gardens are becoming popular in ____ areas where there is little green space.',
        clozeHe: 'גינות על גגות הופכות לפופולריות באזורים עירוניים שבהם יש מעט שטחים ירוקים.',
        answer: 'urban',
        wrong: ['collaborate', 'consequence'],
      },
      {
        clozeEn: 'Clean drinking water is ____ for every human being.',
        clozeHe: 'מי שתייה נקיים חיוניים לכל בן אדם.',
        answer: 'essential',
        wrong: ['urban', 'implement'],
      },
      {
        clozeEn: 'Students from three schools will ____ on a project to save the local river.',
        clozeHe: 'תלמידים משלושה בתי ספר ישתפו פעולה בפרויקט להצלת הנחל המקומי.',
        answer: 'collaborate',
        wrong: ['efficient', 'consequence'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "Every year, millions of trees ____ to make paper."',
        correct: 'are cut down',
        wrong: ['cut down', 'is cut down'],
        explainHe: 'העצים לא כורתים את עצמם, ולכן סביל. trees הם רבים, ולכן are + V3: are cut down.',
        hintHe: 'האם העצים עושים את הפעולה, או שהיא נעשית להם? ואיזה פועל עזר מתאים לרבים?',
      },
      {
        questionEn: 'Complete the sentence: "The first electric bus in our city ____ by the mayor in 2022."',
        correct: 'was introduced',
        wrong: ['introduced', 'is introduced'],
        explainHe: 'יש by the mayor ושנה בעבר, ולכן סביל בעבר: was + V3.',
        hintHe: 'שימו לב למילה by ולשנה. מי עשה את הפעולה, ובאיזה זמן זה קרה?',
      },
      {
        questionEn: 'Complete the sentence: "The results of the climate study ____ next month."',
        correct: 'will be published',
        wrong: ['will publish', 'will be publish'],
        explainHe: 'next month מראה עתיד, והתוצאות לא מפרסמות את עצמן, ולכן סביל בעתיד: will be + V3.',
        hintHe: 'next month מראה עתיד. האם התוצאות מפרסמות משהו, או שמפרסמים אותן? מה בא אחרי will be?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'Plastic bottles are recycled in this factory.',
        wrong: ['Plastic bottles are recycle in this factory.', 'Plastic bottles is recycled in this factory.'],
        explainHe: 'plastic bottles הם רבים, ולכן are, ואחריו V3: are recycled.',
        hintHe: 'בדקו את פועל העזר שמתאים לרבים ואת צורת הפועל שאחריו.',
      },
      {
        questionEn: 'Change to the Passive: "Engineers built the dam in 1990."',
        correct: 'The dam was built by engineers in 1990.',
        wrong: ['The dam built by engineers in 1990.', 'The dam is built by engineers in 1990.'],
        explainHe: 'המשפט המקורי בעבר, ולכן was + V3: was built.',
        hintHe: 'בסביל צריך פועל עזר לפני V3. איזה פועל עזר מתאים למשפט בעבר?',
      },
      {
        questionEn: 'Complete the question: "Is the electricity in your school ____ by solar panels?"',
        correct: 'generated',
        wrong: ['generate', 'generating'],
        explainHe: 'בשאלה בסביל: Is + הנושא + V3: Is the electricity generated...?',
        hintHe: 'במשפט יש by ולפני כן is. איזו צורה של הפועל באה בסביל?',
      },
    ],
    sentences: [
      { en: 'Rainwater is collected and used to water the parks.', he: 'מי גשם נאספים ומשמשים להשקיית הפארקים.' },
      { en: 'The old factory was turned into a science museum.', he: 'המפעל הישן הפך למוזיאון מדע.' },
      { en: 'Hundreds of trees will be planted along the highway.', he: 'מאות עצים יינטעו לאורך הכביש המהיר.' },
      { en: 'Electric scooters are used by many students in Tel Aviv.', he: 'קורקינטים חשמליים משמשים תלמידים רבים בתל אביב.' },
      { en: 'Was the new park designed by local students?', he: 'הפארק החדש תוכנן על ידי תלמידים מקומיים?' },
      { en: 'Less waste is produced when people buy local food.', he: 'נוצרת פחות פסולת כשאנשים קונים אוכל מקומי.' },
    ],
    passages: [
      {
        passageEn:
          'In 2023, a youth initiative called Green Roofs was launched in Bnei Brak, one of the most crowded cities in Israel. Empty rooftops were turned into small vegetable gardens by teenage volunteers. The gardens are watered with rainwater that is collected in large tanks. As a result, the buildings stay cooler in summer, and fresh vegetables are given to families in need. The project has been praised by environmental experts.',
        passageHe:
          'ב-2023 יצאה לדרך בבני ברק, אחת הערים הצפופות ביותר בישראל, יוזמת נוער בשם "גגות ירוקים". גגות ריקים הפכו לגינות ירק קטנות על ידי מתנדבים בני נוער. הגינות מושקות במי גשם שנאספים במכלים גדולים. כתוצאה מכך הבניינים נשארים קרירים יותר בקיץ, וירקות טריים ניתנים למשפחות נזקקות. הפרויקט זכה לשבחים ממומחים לאיכות הסביבה.',
        questions: [
          {
            questionEn: 'Who turned the rooftops into gardens?',
            questionHe: 'מי הפך את הגגות לגינות?',
            correct: 'Teenage volunteers.',
            wrong: ['City workers.', 'Local farmers.'],
          },
          {
            questionEn: 'How are the gardens watered?',
            questionHe: 'איך משקים את הגינות?',
            correct: 'With rainwater collected in tanks.',
            wrong: ['With water from the sea.', 'With tap water from the buildings.'],
          },
          {
            questionEn: 'What is one result of the project?',
            questionHe: 'מהי אחת התוצאות של הפרויקט?',
            correct: 'The buildings stay cooler in summer.',
            wrong: ['The city became less crowded.', 'More tourists visit the city.'],
          },
        ],
      },
      {
        passageEn:
          'Copenhagen is often described as one of the most bike-friendly cities in the world. Almost half of its residents ride a bicycle to work or school every day. Special bike lanes were built across the city, and they are cleaned of snow before the roads in winter. Because fewer cars are used, the air in the city center is cleaner than in many other capitals. Other cities, such as Paris and Bogotá, have been inspired to copy this model.',
        passageHe:
          'קופנהגן מתוארת לעיתים קרובות כאחת הערים הידידותיות ביותר לאופניים בעולם. כמעט מחצית מתושביה רוכבים על אופניים לעבודה או לבית הספר בכל יום. שבילי אופניים מיוחדים נבנו ברחבי העיר, ובחורף מפנים מהם את השלג לפני הכבישים. מכיוון שמשתמשים בפחות מכוניות, האוויר במרכז העיר נקי יותר מאשר בבירות רבות אחרות. ערים אחרות, כמו פריז ובוגוטה, קיבלו השראה להעתיק את המודל הזה.',
        questions: [
          {
            questionEn: 'How many residents ride a bicycle every day?',
            questionHe: 'כמה מהתושבים רוכבים על אופניים בכל יום?',
            correct: 'Almost half of them.',
            wrong: ['About ten percent.', 'Nearly all of them.'],
          },
          {
            questionEn: 'What happens to the bike lanes in winter?',
            questionHe: 'מה קורה לשבילי האופניים בחורף?',
            correct: 'They are cleaned of snow first.',
            wrong: ['They are closed until spring.', 'They are used by cars.'],
          },
          {
            questionEn: 'Why is the air in the city center cleaner?',
            questionHe: 'למה האוויר במרכז העיר נקי יותר?',
            correct: 'Fewer cars are used.',
            wrong: ['There are more trees.', 'Factories were moved outside.'],
          },
        ],
      },
    ],
  },

  // Unit 2: Defining and non-defining relative clauses (who, which, that, whose)
  2: {
    vocabulary: [
      {
        clozeEn: 'The headline was ____: the article said something completely different.',
        clozeHe: 'הכותרת הייתה מטעה: הכתבה אמרה משהו שונה לגמרי.',
        answer: 'misleading',
        wrong: ['objective', 'verify'],
      },
      {
        clozeEn: 'Before you share a shocking photo, try to ____ where it came from.',
        clozeHe: 'לפני שמשתפים תמונה מזעזעת, כדאי לנסות לוודא מאיפה היא הגיעה.',
        answer: 'verify',
        wrong: ['credible', 'privacy'],
      },
      {
        clozeEn: 'My little brother likes to ____; he said there were a million people at the party.',
        clozeHe: 'אחי הקטן אוהב להגזים; הוא אמר שהיו מיליון אנשים במסיבה.',
        answer: 'exaggerate',
        wrong: ['objective', 'privacy'],
      },
      {
        clozeEn: 'A good reporter stays ____ and presents both sides of the story.',
        clozeHe: 'כתב טוב נשאר אובייקטיבי ומציג את שני הצדדים של הסיפור.',
        answer: 'objective',
        wrong: ['misleading', 'privacy'],
      },
      {
        clozeEn: 'Some apps ____ users into spending more time online.',
        clozeHe: 'אפליקציות מסוימות מתמרנות משתמשים כך שיבלו יותר זמן ברשת.',
        answer: 'manipulate',
        wrong: ['credible', 'objective'],
      },
      {
        clozeEn: 'The doctor’s advice is ____ because it is based on years of research.',
        clozeHe: 'העצה של הרופאה אמינה כי היא מבוססת על שנים של מחקר.',
        answer: 'credible',
        wrong: ['verify', 'privacy'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "The journalist ____ wrote the article won a prize."',
        correct: 'who',
        wrong: ['which', 'whose'],
        explainHe: 'the journalist הוא אדם, והוא זה שכתב את הכתבה, ולכן who.',
        hintHe: 'החלק החסר מתאר אדם שעשה פעולה. בחרו מילה שמתאימה לאנשים ואינה מראה שייכות.',
      },
      {
        questionEn: 'Complete the sentence: "This is the website ____ shares false health tips."',
        correct: 'which',
        wrong: ['who', 'where'],
        explainHe: 'the website הוא דבר ולא אדם, ולכן which.',
        hintHe: 'the website הוא לא אדם ולא מקום שבו קורה משהו. איזו מילה מתאימה לדברים?',
      },
      {
        questionEn: 'Complete the sentence: "The student ____ phone was hacked called the police."',
        correct: 'whose',
        wrong: ['who', 'which'],
        explainHe: 'הטלפון שייך לתלמיד, ו-whose מבטא שייכות.',
        hintHe: 'למי שייך הטלפון? איזו מילה מבטאת שייכות?',
      },
      {
        questionEn: 'Which sentence uses commas correctly?',
        correct: 'Tel Aviv, which is on the coast, has many startups.',
        wrong: ['Tel Aviv which is on the coast, has many startups.', 'Tel Aviv, that is on the coast, has many startups.'],
        explainHe: 'מידע נוסף על שם מיוחד (Tel Aviv) נכתב בין שני פסיקים, ובפסוקית כזו לא משתמשים ב-that.',
        hintHe: 'המידע על החוף הוא תוספת, כי כבר ברור על איזו עיר מדובר. מה צריך לבוא סביב תוספת כזו, ואיזו מילה אסור להשתמש בה בתוכה?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'My aunt, who works as a nurse, lives in Eilat.',
        wrong: ['My aunt, which works as a nurse, lives in Eilat.', 'My aunt, whose works as a nurse, lives in Eilat.'],
        explainHe: 'my aunt היא אדם, ולכן who, גם בפסוקית שבין פסיקים.',
        hintHe: 'על מי מדבר המידע שבין הפסיקים? בחרו מילה שמתאימה לאנשים ואינה מראה שייכות.',
      },
      {
        questionEn: 'Complete the sentence: "The app ____ I downloaded asks for my location all the time."',
        correct: 'that',
        wrong: ['who', 'where'],
        explainHe: 'the app הוא דבר, ולכן that (או which).',
        hintHe: 'the app הוא דבר ולא אדם, ואף אחד לא נמצא בתוכו. איזו מילה מתאימה?',
      },
    ],
    sentences: [
      { en: 'The video that went viral last week was fake.', he: 'הסרטון שהפך לוויראלי בשבוע שעבר היה מזויף.' },
      {
        en: 'Readers who check their sources make better decisions.',
        he: 'קוראים שבודקים את המקורות שלהם מקבלים החלטות טובות יותר.',
      },
      {
        en: 'My cousin, who studies law, never shares rumors online.',
        he: 'בן הדוד שלי, שלומד משפטים, אף פעם לא משתף שמועות ברשת.',
      },
      { en: 'The website whose articles were false was finally closed.', he: 'האתר שהכתבות שלו היו שקריות נסגר לבסוף.' },
      {
        en: 'Haifa, which has a famous port, hosted the media conference.',
        he: 'חיפה, שיש בה נמל מפורסם, אירחה את כנס התקשורת.',
      },
      { en: 'Never post photos that show your home address.', he: 'אף פעם לא כדאי לפרסם תמונות שמראות את כתובת הבית שלכם.' },
    ],
    passages: [
      {
        passageEn:
          'Last year, a photo of a shark swimming on a flooded highway spread across social media. Thousands of people who saw it believed it was real. However, a teenager from Ra’anana, who loved checking facts, searched for the original picture. She discovered that the shark had been added to an old photo with an editing app. Her post, which explained the trick step by step, was shared more than fifty thousand times.',
        passageHe:
          'בשנה שעברה התפשטה ברשתות החברתיות תמונה של כריש ששוחה בכביש מהיר מוצף. אלפי אנשים שראו אותה האמינו שהיא אמיתית. אבל נערה מרעננה, שאהבה לבדוק עובדות, חיפשה את התמונה המקורית. היא גילתה שהכריש נוסף לתמונה ישנה בעזרת אפליקציית עריכה. הפוסט שלה, שהסביר את הטריק צעד אחר צעד, שותף יותר מחמישים אלף פעמים.',
        questions: [
          {
            questionEn: 'What did the photo show?',
            questionHe: 'מה הראתה התמונה?',
            correct: 'A shark swimming on a flooded highway.',
            wrong: ['A whale near the beach.', 'A storm in Ra’anana.'],
          },
          {
            questionEn: 'How was the photo created?',
            questionHe: 'איך נוצרה התמונה?',
            correct: 'The shark was added with an editing app.',
            wrong: ['It was taken by a news crew.', 'It was drawn by an artist.'],
          },
          {
            questionEn: 'How many times was her post shared?',
            questionHe: 'כמה פעמים שותף הפוסט שלה?',
            correct: 'More than fifty thousand times.',
            wrong: ['About five hundred times.', 'Only a few times.'],
          },
        ],
      },
      {
        passageEn:
          'Every time you use a free app, you leave a digital footprint. Companies that collect this information can learn where you go, what you buy and who your friends are. Some of this data is sold to advertisers, who use it to show you personal ads. Experts, whose job is to protect online privacy, suggest a few simple steps. For example, you should turn off location services for apps that don’t need them.',
        passageHe:
          'בכל פעם שמשתמשים באפליקציה חינמית, משאירים עקבות דיגיטליים. חברות שאוספות את המידע הזה יכולות לדעת לאן אתם הולכים, מה אתם קונים ומי החברים שלכם. חלק מהמידע הזה נמכר למפרסמים, שמשתמשים בו כדי להציג לכם פרסומות אישיות. מומחים, שתפקידם להגן על הפרטיות ברשת, מציעים כמה צעדים פשוטים. למשל, כדאי לכבות את שירותי המיקום באפליקציות שלא צריכות אותם.',
        questions: [
          {
            questionEn: 'What can companies learn from your information?',
            questionHe: 'מה חברות יכולות לדעת מהמידע שלכם?',
            correct: 'Where you go and what you buy.',
            wrong: ['Your school grades.', 'Your passwords.'],
          },
          {
            questionEn: 'Who buys some of the data?',
            questionHe: 'מי קונה חלק מהמידע?',
            correct: 'Advertisers.',
            wrong: ['Teachers.', 'Other apps.'],
          },
          {
            questionEn: 'What do the experts suggest?',
            questionHe: 'מה המומחים מציעים?',
            correct: 'Turn off location services for some apps.',
            wrong: ['Never use free apps.', 'Buy a new phone.'],
          },
        ],
      },
    ],
  },

  // Unit 3: Modals of deduction in the present (must be, can't be, might / could be)
  3: {
    vocabulary: [
      {
        clozeEn: 'Our ____ was that plants grow faster with music, so we tested it for a month.',
        clozeHe: 'ההשערה שלנו הייתה שצמחים גדלים מהר יותר עם מוזיקה, אז בדקנו אותה במשך חודש.',
        answer: 'hypothesis',
        wrong: ['organism', 'detect'],
      },
      {
        clozeEn: 'The northern lights are a beautiful natural ____.',
        clozeHe: 'הזוהר הצפוני הוא תופעת טבע יפהפייה.',
        answer: 'phenomenon',
        wrong: ['detect', 'plausible'],
      },
      {
        clozeEn: 'Special cameras can ____ heat from animals in the dark.',
        clozeHe: 'מצלמות מיוחדות יכולות לזהות חום של בעלי חיים בחושך.',
        answer: 'detect',
        wrong: ['mysterious', 'hypothesis'],
      },
      {
        clozeEn: 'The two witnesses ____ each other: one says the car was red, the other says blue.',
        clozeHe: 'שני העדים סותרים זה את זה: אחד אומר שהמכונית הייתה אדומה, והשני אומר שהיא הייתה כחולה.',
        answer: 'contradict',
        wrong: ['organism', 'plausible'],
      },
      {
        clozeEn: 'A single cell can be a complete living ____.',
        clozeHe: 'תא בודד יכול להיות אורגניזם חי שלם.',
        answer: 'organism',
        wrong: ['conclude', 'plausible'],
      },
      {
        clozeEn: 'Nobody knows who sent the ____ letter with no name on it.',
        clozeHe: 'אף אחד לא יודע מי שלח את המכתב המסתורי בלי שם.',
        answer: 'mysterious',
        wrong: ['detect', 'conclude'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "Look at all the cars outside. There ____ be a party next door."',
        correct: 'must',
        wrong: ['can’t', 'shouldn’t'],
        explainHe: 'הרבה מכוניות בחוץ הן ראיה חזקה, ולכן must be: אנחנו כמעט בטוחים.',
        hintHe: 'האם הסימן שרואים מראה שזה כמעט בטוח, או שזה בלתי אפשרי?',
      },
      {
        questionEn: 'Complete the sentence: "That ____ be Noa at the door. She is on holiday in Japan."',
        correct: 'can’t',
        wrong: ['must', 'might'],
        explainHe: 'נועה ביפן, ולכן בלתי אפשרי שהיא בדלת: can’t be.',
        hintHe: 'קראו את המשפט השני. האם יש סיכוי שנועה בדלת?',
      },
      {
        questionEn: 'Which sentence shows that something is only possible, not certain?',
        correct: 'The package might be in the post office.',
        wrong: ['The package must be in the post office.', 'The package can’t be in the post office.'],
        explainHe: 'might מבטא אפשרות (בערך 50%), לא ודאות.',
        hintHe: 'ודאות שמשהו נכון, ודאות שהוא לא נכון, או רק "אולי"? חפשו את המודל של "אולי".',
      },
      {
        questionEn: 'Complete the sentence: "I’m not sure where Dan is. He could ____ at the gym."',
        correct: 'be',
        wrong: ['being', 'to be'],
        explainHe: 'אחרי מודל כמו could בא פועל בסיסי בלי to: could be.',
        hintHe: 'אחרי מודלים יש כלל קבוע לגבי הפועל. באיזו צורה הוא בא?',
      },
      {
        questionEn: 'Choose the best reply: "The lights in the lab are on at midnight."',
        correct: 'Someone must be working late.',
        wrong: ['Someone can’t be working late.', 'Someone must to work late.'],
        explainHe: 'אורות דולקים בחצות הם ראיה שמישהו שם, ולכן must be + ing לפעולה שקורית עכשיו.',
        hintHe: 'מה מראים האורות הדולקים? בחרו את המסקנה ההגיונית, ובדקו שאחרי המודל אין to.',
      },
      {
        questionEn:
          'Complete the sentence: "Scientists say the signal ____ come from a distant planet, but they are not sure yet."',
        correct: 'could',
        wrong: ['must', 'can’t'],
        explainHe: 'not sure yet מראה שזו רק אפשרות, ולכן could.',
        hintHe: 'קראו את סוף המשפט: האם המדענים בטוחים?',
      },
    ],
    sentences: [
      { en: 'These footprints must belong to a large animal.', he: 'העקבות האלה בטח שייכות לבעל חיים גדול.' },
      { en: 'The museum can’t be closed; the lights are on.', he: 'המוזיאון לא יכול להיות סגור; האורות דולקים.' },
      { en: 'The strange noise might be coming from the pipes.', he: 'הרעש המוזר אולי מגיע מהצינורות.' },
      {
        en: 'Your hypothesis could be correct, but we need more data.',
        he: 'ייתכן שההשערה שלך נכונה, אבל אנחנו צריכים עוד נתונים.',
      },
      { en: 'She must be very tired after the long flight.', he: 'היא בטח עייפה מאוד אחרי הטיסה הארוכה.' },
      { en: 'This plant can’t survive without sunlight.', he: 'הצמח הזה לא יכול לשרוד בלי אור שמש.' },
    ],
    passages: [
      {
        passageEn:
          'In the Atacama Desert in Chile, scientists found tiny organisms living inside salt rocks. It almost never rains there, so most people thought nothing could survive. The scientists believe the organisms must take water from the air at night. However, they are still testing other ideas, because the water might also come from deep underground. Some researchers think similar life could exist on Mars, which is just as dry.',
        passageHe:
          'במדבר אטקמה שבצ׳ילה מצאו מדענים אורגניזמים זעירים שחיים בתוך סלעי מלח. כמעט אף פעם לא יורד שם גשם, ולכן רוב האנשים חשבו ששום דבר לא יכול לשרוד שם. המדענים מאמינים שהאורגניזמים בטח לוקחים מים מהאוויר בלילה. אבל הם עדיין בודקים רעיונות אחרים, כי ייתכן שהמים מגיעים גם ממעמקי האדמה. יש חוקרים שחושבים שחיים דומים יכולים להתקיים על מאדים, שיבש באותה מידה.',
        questions: [
          {
            questionEn: 'Where did the scientists find the organisms?',
            questionHe: 'איפה המדענים מצאו את האורגניזמים?',
            correct: 'Inside salt rocks.',
            wrong: ['Under the sea.', 'On a mountain in Peru.'],
          },
          {
            questionEn: 'Why did people think nothing could survive there?',
            questionHe: 'למה אנשים חשבו ששום דבר לא יכול לשרוד שם?',
            correct: 'It almost never rains there.',
            wrong: ['The rocks are too hot.', 'There is no air.'],
          },
          {
            questionEn: 'Where else could similar life exist?',
            questionHe: 'איפה עוד יכולים להתקיים חיים דומים?',
            correct: 'On Mars.',
            wrong: ['In the Dead Sea.', 'On the Moon.'],
          },
        ],
      },
      {
        passageEn:
          'Every autumn, a strange humming sound is heard in a small town in Scotland. Some residents say it must be coming from a factory, but the nearest factory closed ten years ago. Others think it could be the wind blowing through the hills. A team of engineers placed microphones around the town to detect the source. So far, they have recorded the sound, but they still can’t explain it.',
        passageHe:
          'בכל סתיו נשמע צליל זמזום מוזר בעיירה קטנה בסקוטלנד. חלק מהתושבים אומרים שהוא בטח מגיע ממפעל, אבל המפעל הקרוב ביותר נסגר לפני עשר שנים. אחרים חושבים שזו יכולה להיות הרוח שנושבת בין הגבעות. צוות מהנדסים הציב מיקרופונים ברחבי העיירה כדי לאתר את המקור. עד עכשיו הם הקליטו את הצליל, אבל הם עדיין לא מצליחים להסביר אותו.',
        questions: [
          {
            questionEn: 'When is the humming sound heard?',
            questionHe: 'מתי נשמע צליל הזמזום?',
            correct: 'Every autumn.',
            wrong: ['Every night in summer.', 'Only during storms.'],
          },
          {
            questionEn: 'Why can’t the sound come from the factory?',
            questionHe: 'למה הצליל לא יכול להגיע מהמפעל?',
            correct: 'The factory closed ten years ago.',
            wrong: ['The factory is too far away.', 'The factory works only by day.'],
          },
          {
            questionEn: 'What did the engineers do?',
            questionHe: 'מה עשו המהנדסים?',
            correct: 'They placed microphones around the town.',
            wrong: ['They closed the factory.', 'They moved to the hills.'],
          },
        ],
      },
    ],
  },

  // Unit 4: First and Second Conditionals, unless
  4: {
    vocabulary: [
      {
        clozeEn: 'Using someone’s song in your video without permission can break ____ laws.',
        clozeHe: 'שימוש בשיר של מישהו אחר בסרטון שלכם בלי רשות יכול להפר את חוקי זכויות היוצרים.',
        answer: 'copyright',
        wrong: ['benefit', 'algorithm'],
      },
      {
        clozeEn: 'The video site uses an ____ to decide which clips you see next.',
        clozeHe: 'אתר הסרטונים משתמש באלגוריתם כדי להחליט אילו קטעים תראו אחר כך.',
        answer: 'algorithm',
        wrong: ['copyright', 'regulate'],
      },
      {
        clozeEn: 'Many governments want to ____ how companies use personal data.',
        clozeHe: 'ממשלות רבות רוצות להסדיר את האופן שבו חברות משתמשות במידע אישי.',
        answer: 'regulate',
        wrong: ['ethical', 'innovation'],
      },
      {
        clozeEn: 'Honesty is an important ____ in our family.',
        clozeHe: 'כנות היא עיקרון חשוב במשפחה שלנו.',
        answer: 'principle',
        wrong: ['algorithm', 'regulate'],
      },
      {
        clozeEn: 'Smartphones had a huge ____ on the way teenagers communicate.',
        clozeHe: 'לטלפונים החכמים הייתה השפעה עצומה על הדרך שבה בני נוער מתקשרים.',
        answer: 'impact',
        wrong: ['copyright', 'ethical'],
      },
      {
        clozeEn: 'Israel is famous for its ____ in medicine and computer science.',
        clozeHe: 'ישראל מפורסמת בחדשנות שלה ברפואה ובמדעי המחשב.',
        answer: 'innovation',
        wrong: ['regulate', 'ethical'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "If the school bans phones, students ____ more during breaks."',
        correct: 'will talk',
        wrong: ['would talk', 'talked'],
        explainHe: 'זו אפשרות אמיתית (if + הווה פשוט), ולכן will + פועל בסיסי.',
        hintHe: 'החלק של if כתוב בהווה פשוט. האם זו אפשרות אמיתית, ומה בא בחלק התוצאה?',
      },
      {
        questionEn: 'Complete the sentence: "If computers ____ feelings, they would understand jokes."',
        correct: 'had',
        wrong: ['have', 'will have'],
        explainHe: 'זה מצב דמיוני (יש would), ולכן החלק של if בא ב-Past Simple: had.',
        hintHe: 'בחלק השני יש would. באיזה זמן כתוב החלק של if במצב דמיוני?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'If I were a programmer, I would build an app for the elderly.',
        wrong: [
          'If I was a programmer, I will build an app for the elderly.',
          'If I am a programmer, I would build an app for the elderly.',
        ],
        explainHe: 'במצב דמיוני: If I were, ובחלק השני would + פועל בסיסי.',
        hintHe: 'בדקו ששני חלקי המשפט מתאימים למצב דמיוני.',
      },
      {
        questionEn: 'Complete the sentence: "Unless companies ____ our data, we will lose our privacy."',
        correct: 'protect',
        wrong: ['don’t protect', 'will protect'],
        explainHe: 'unless פירושו "אם לא", ולכן אחריו פועל חיובי בהווה: Unless companies protect.',
        hintHe: 'unless כבר כולל שלילה. האם צריך שלילה נוספת, ואיזה זמן בא אחריו?',
      },
      {
        questionEn: 'Choose the meaning: "Unless it rains, we will have the picnic."',
        correct: 'If it doesn’t rain, we will have the picnic.',
        wrong: ['If it rains, we will have the picnic.', 'Because it rains, we will have the picnic.'],
        explainHe: 'unless = if not, ולכן: אם לא יירד גשם.',
        hintHe: 'unless מחליף שתי מילים באנגלית. אחת מהן היא if. מה השנייה?',
      },
      {
        questionEn: 'Complete the question: "What would happen if robots ____ all the factory jobs?"',
        correct: 'took',
        wrong: ['take', 'will take'],
        explainHe: 'השאלה עם would היא על מצב דמיוני, ולכן אחרי if בא Past Simple: took.',
        hintHe: 'יש would בשאלה. באיזה זמן בא הפועל אחרי if במצב כזה?',
      },
    ],
    sentences: [
      {
        en: 'If you share fake news, you will lose your readers’ trust.',
        he: 'אם תשתפו חדשות מזויפות, תאבדו את האמון של הקוראים שלכם.',
      },
      { en: 'If I were the minister, I would fund more research.', he: 'אם הייתי השר, הייתי מממן יותר מחקר.' },
      {
        en: 'Unless we set clear rules, the technology will be misused.',
        he: 'אם לא נקבע כללים ברורים, ישתמשו בטכנולוגיה לרעה.',
      },
      { en: 'Would you buy a song written by a computer?', he: 'הייתם קונים שיר שנכתב על ידי מחשב?' },
      { en: 'Doctors will save more lives if they use smart tools.', he: 'רופאים יצילו יותר חיים אם ישתמשו בכלים חכמים.' },
      {
        en: 'If robots cooked our dinner, we would have more free time.',
        he: 'אם רובוטים היו מבשלים לנו ארוחת ערב, היה לנו יותר זמן פנוי.',
      },
    ],
    passages: [
      {
        passageEn:
          'Last year, a song created by artificial intelligence reached the top of a music chart in Europe. Many listeners loved it, but some musicians were angry. They argued that the computer had learned from their songs without asking permission. If the law protected their work better, they said, they would earn money from such songs. Lawmakers in several countries are now discussing new copyright rules.',
        passageHe:
          'בשנה שעברה שיר שנוצר על ידי בינה מלאכותית הגיע לראש מצעד מוזיקה באירופה. מאזינים רבים אהבו אותו, אבל כמה מוזיקאים כעסו. הם טענו שהמחשב למד מהשירים שלהם בלי לבקש רשות. אם החוק היה מגן טוב יותר על היצירה שלהם, הם אמרו, הם היו מרוויחים כסף משירים כאלה. מחוקקים בכמה מדינות דנים עכשיו בכללים חדשים לזכויות יוצרים.',
        questions: [
          {
            questionEn: 'What did the AI song reach?',
            questionHe: 'לאן הגיע השיר של הבינה המלאכותית?',
            correct: 'The top of a music chart.',
            wrong: ['A million downloads in Asia.', 'A prize for young musicians.'],
          },
          {
            questionEn: 'Why were some musicians angry?',
            questionHe: 'למה כמה מוזיקאים כעסו?',
            correct: 'The computer learned from their songs without permission.',
            wrong: ['The song was too long.', 'Nobody listened to the song.'],
          },
          {
            questionEn: 'What are lawmakers discussing now?',
            questionHe: 'במה דנים המחוקקים עכשיו?',
            correct: 'New copyright rules.',
            wrong: ['A ban on all music apps.', 'Prizes for computer songs.'],
          },
        ],
      },
      {
        passageEn:
          'A hospital in Petah Tikva has started using a computer program to read X-rays. The program can find small problems that a tired doctor might miss. If the program finds something unusual, a doctor will always check the image again. The hospital says this system saves time and helps patients get treatment sooner. However, some experts warn that doctors may trust the computer too much unless they are trained carefully.',
        passageHe:
          'בית חולים בפתח תקווה התחיל להשתמש בתוכנת מחשב כדי לקרוא צילומי רנטגן. התוכנה יכולה למצוא בעיות קטנות שרופא עייף עלול לפספס. אם התוכנה מוצאת משהו חריג, רופא תמיד יבדוק את הצילום שוב. בית החולים אומר שהמערכת חוסכת זמן ועוזרת למטופלים לקבל טיפול מוקדם יותר. אבל כמה מומחים מזהירים שרופאים עלולים לסמוך על המחשב יותר מדי אם לא יוכשרו בזהירות.',
        questions: [
          {
            questionEn: 'What does the program read?',
            questionHe: 'מה התוכנה קוראת?',
            correct: 'X-rays.',
            wrong: ['Blood tests.', 'Doctors’ notes.'],
          },
          {
            questionEn: 'What happens if the program finds something unusual?',
            questionHe: 'מה קורה אם התוכנה מוצאת משהו חריג?',
            correct: 'A doctor checks the image again.',
            wrong: ['The patient goes home.', 'The program calls the patient.'],
          },
          {
            questionEn: 'What do some experts warn about?',
            questionHe: 'ממה מזהירים כמה מומחים?',
            correct: 'Doctors may trust the computer too much.',
            wrong: ['The program is too expensive.', 'Patients will wait longer.'],
          },
        ],
      },
    ],
  },
};
