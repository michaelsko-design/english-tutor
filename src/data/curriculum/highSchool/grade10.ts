import { buildHighSchoolGrade, HighSchoolUnitSpec } from './builder';

const units: HighSchoolUnitSpec[] = [
  {
    titleEn: 'Unit 1: Global Youth Summit & Environment',
    titleHe: 'פרק 1: ועידת הנוער העולמית ומשבר האקלים',
    subtitleHe: 'מבנה הסביל (Passive Voice), קיימות ואוצר מילים Band III',
    badgeEmoji: '🌍',
    missions: [
      {
        icon: '🌱',
        titleEn: 'Protecting Our Planet: Passive Action',
        titleHe: 'שומרים על כדור הארץ: משפטי סביל',
        storyHookHe:
          'הצטרפתם לוועידת האקלים העולמית של בני נוער! נלמד לתאר יוזמות סביבתיות במבנה סביל (Passive Voice) כשהפעולה חשובה יותר ממבצע הפעולה.',
        grammarTopic: 'Passive Voice (Present Simple: is/are + V3)',
        skills: ['Passive Voice', 'Band III Environment', 'Bagrut Unseen'],
        sentenceEn: 'Millions of plastic bottles are recycled every year around the world.',
        sentenceHe: 'מיליוני בקבוקי פלסטיק ממוחזרים מדי שנה ברחבי העולם.',
        vocab: [
          [
            'consequence',
            'noun',
            'תוצאה / השלכה',
            '💥',
            'Pollution has serious consequences for marine life.',
            'לזיהום יש השלכות חמורות על החיים בים.',
          ],
          [
            'sustainable',
            'adjective',
            'בר-קיימא / סביבתי',
            '🌱',
            'We must build sustainable cities for future generations.',
            'עלינו לבנות ערים בנות-קיימא עבור הדורות הבאים.',
          ],
          [
            'implement',
            'verb',
            'ליישם / להוציא לפועל',
            '🛠️',
            'The school implemented a new recycling program.',
            'בית הספר יישם תוכנית מחזור חדשה.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'solution', translationHe: 'פתרון' },
            { wordEn: 'obstacle', translationHe: 'מכשול' },
          ],
          shortSentenceEn: 'Plastic bottles are recycled.',
          shortSentenceHe: 'בקבוקי פלסטיק ממוחזרים.',
          rule: {
            questionEn: 'How is the Passive Voice formed in Present Simple?',
            correct: 'am / is / are + V3 (Past Participle)',
            wrong: ['was / were + base verb', 'have / has + -ing form'],
            explainHe:
              'בסביל בהווה (Present Simple Passive) משתמשים בפועל to be בהווה (am / is / are) ואחריו צורת הפועל השלישית (V3).',
            hintHe: 'סביל בהווה צריך צורה של הפועל להיות בהווה, ואחריה צורת הפועל השלישית. איזו תשובה עונה על שני התנאים?',
          },
          story: {
            passageEn:
              'In a small coastal town, thousands of plastic bottles are collected by youth volunteers every Saturday. The collected waste is recycled into eco-friendly school benches. The town mayor praised the teenagers for their dedication to a sustainable future.',
            passageHe:
              'בעיירת חוף קטנה, אלפי בקבוקי פלסטיק נאספים על ידי מתנדבים צעירים בכל יום שבת. הפסולת שנאספת ממוחזרת לספסלי בית ספר ידידותיים לסביבה. ראש העיר שיבח את בני הנוער על מסירותם לעתיד בר-קיימא.',
            questionEn: 'What is done with the plastic bottles that are collected?',
            questionHe: 'מה נעשה עם בקבוקי הפלסטיק שנאספים?',
            correct: 'They are recycled into eco-friendly school benches.',
            wrong: ['They are thrown into the ocean.', 'They are burned in local factories.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'Old glass jars are collected here.',
                wrong: ['Old glass jars is collected here.'],
                explainHe: 'jars הוא ברבים, ולכן משתמשים ב-are ואחריו צורת V3: are collected.',
                hintHe: 'שימו לב אם הנושא ביחיד או ברבים, ואיזו צורה של be מתאימה לו.',
              },
              story: {
                passageEn:
                  'Dana lives in a green town. Paper is collected from every house on Monday. The paper is then made into new notebooks.',
                passageHe:
                  'דנה גרה בעיירה ירוקה. נייר נאסף מכל בית ביום שני. אחר כך הנייר הופך למחברות חדשות.',
                questionEn: 'When is the paper collected?',
                questionHe: 'מתי נאסף הנייר?',
                correct: 'On Monday.',
                wrong: ['On Friday.'],
              },
            },
            challenger: {
              clozeWrong: [['benefit', 'solution'], ['wasteful', 'polluted'], ['pollute', 'inherit']],
            },
            master: {
              sentenceEn: 'Several local rivers are polluted by factories that were built decades ago.',
              sentenceHe: 'כמה נהרות מקומיים מזוהמים על ידי מפעלים שנבנו לפני עשרות שנים.',
              decoys: ['pollute', 'been'],
              voiceEn: 'Our school is cleaned by volunteers.',
              voiceHe: 'בית הספר שלנו מנוקה על ידי מתנדבים.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Electricity is produced by wind turbines in this region.',
                wrong: ['Electricity are produced by wind turbines in this region.', 'Electricity is produce by wind turbines in this region.', 'Electricity is producing by wind turbines in this region.'],
                explainHe:
                  'בסביל בהווה: am / is / are + V3. electricity הוא שם עצם שאינו ניתן לספירה ולכן is, ואחריו V3: produced.',
                hintEn: 'Check the verb be and the form of the main verb.',
              },
              story: {
                passageEn:
                  'Every spring, the town of Eilot holds a clean-up day. Residents are asked to bring their own gloves and bags, and the collected rubbish is sorted in the town square. Last year, however, fewer people than expected arrived, and the mayor was disappointed. A week later, a local teenager posted a short video that showed the polluted beach next to her home. Within two days, hundreds of volunteers had signed up for the next event, and the mayor thanked the teenager in public.',
                passageHe: '',
                questionEn: 'Why did more people volunteer for the next clean-up day?',
                questionHe: '',
                correct: 'The video made them realise how bad the beach looked.',
                wrong: ['The mayor offered to pay every single volunteer.', 'The town square was closed for repairs and cleaning.', 'The previous event had been cancelled by the police.'],
              },
              storyHintEn: 'Look at what happened after the video was posted.',
            },
          },
        },
      },
      {
        icon: '🏙️',
        titleEn: 'Sustainable Cities & Clean Tech',
        titleHe: 'ערים בנות-קיימא וטכנולוגיה ירוקה',
        storyHookHe:
          'מה הופך עיר למודרנית וירוקה? נלמד על אנרגיה מתחדשת ותחבורה חכמה במבנה סביל בעבר (was/were + V3).',
        grammarTopic: 'Passive Voice (Past Simple: was/were + V3)',
        skills: ['Past Passive', 'Clean Tech', 'Contextual Reading'],
        sentenceEn: 'The solar panels were installed on public roofs last month.',
        sentenceHe: 'הלוחות הסולאריים הותקנו על גגות ציבוריים בחודש שעבר.',
        vocab: [
          [
            'efficient',
            'adjective',
            'יעיל / חסכוני',
            '⚡',
            'Solar energy is an efficient power source.',
            'אנרגיה סולארית היא מקור כוח יעיל.',
          ],
          [
            'generate',
            'verb',
            'לייצר / להפיק',
            '🏭',
            'Wind farms generate clean electricity.',
            'חוות רוח מפיקות חשמל נקי.',
          ],
          [
            'urban',
            'adjective',
            'עירוני',
            '🏙️',
            'Urban areas produce a lot of waste.',
            'אזורים עירוניים מייצרים פסולת רבה.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'fragile', translationHe: 'שביר' },
            { wordEn: 'remote', translationHe: 'מרוחק' },
          ],
          shortSentenceEn: 'Solar panels were installed.',
          shortSentenceHe: 'לוחות סולאריים הותקנו.',
          rule: {
            questionEn: 'Which sentence is correctly written in the Past Simple Passive?',
            correct: 'The modern bridge was completed in 2024.',
            wrong: ['The modern bridge was complete in 2024.', 'The modern bridge did completed in 2024.'],
            explainHe:
              'בסביל בעבר משתמשים ב-was (ליחיד) או were (לרבים) ולאחריו צורת ה-V3 של הפועל (was completed ולא was complete).',
            hintHe: 'סביל בעבר בנוי מ-was / were + V3. האם complete כתוב כאן בצורת V3? ו-did לא משמש בסביל.',
          },
          story: {
            passageEn:
              'Last year, smart sensors were placed across the capital city to monitor air quality. The real-time data was shared directly with citizens via a mobile app. Consequently, traffic was redirected away from congested streets during peak pollution hours.',
            passageHe:
              'בשנה שעברה, חיישנים חכמים הוצבו ברחבי עיר הבירה כדי לנטר את איכות האוויר. הנתונים בזמן אמת שותפו ישירות עם התושבים באמצעות אפליקציה לנייד. כתוצאה מכך, התנועה נותבה מחדש הרחק מרחובות עמוסים בשעות שיא הזיהום.',
            questionEn: 'How was the air quality data shared with the citizens?',
            questionHe: 'כיצד שותפו נתוני איכות האוויר עם התושבים?',
            correct: 'Through a dedicated mobile application.',
            wrong: ['Through weekly printed newspapers.', 'Through television broadcasts only.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'The old bridge was repaired last year.',
                wrong: ['The old bridge were repaired last year.'],
                explainHe: 'bridge הוא ביחיד והפעולה בעבר, ולכן was + V3: was repaired.',
                hintHe: 'בדקו אם הנושא ביחיד או ברבים לפני שבוחרים בין was ל-were.',
              },
              story: {
                passageEn:
                  'A new library was opened in our town. It was built last year. Many children visit it after school.',
                passageHe:
                  'ספרייה חדשה נפתחה בעיירה שלנו. היא נבנתה בשנה שעברה. ילדים רבים מבקרים בה אחרי בית הספר.',
                questionEn: 'When was the library built?',
                questionHe: 'מתי נבנתה הספרייה?',
                correct: 'Last year.',
                wrong: ['Next year.'],
              },
            },
            challenger: {
              clozeWrong: [['elastic', 'edible'], ['bake', 'pollute'], ['silent', 'empty']],
            },
            master: {
              sentenceEn:
                'The old power station was closed down after thousands of complaints were received.',
              sentenceHe: 'תחנת הכוח הישנה נסגרה לאחר שהתקבלו אלפי תלונות.',
              decoys: ['are', 'closing'],
              voiceEn: 'Many trees were planted along the river.',
              voiceHe: 'עצים רבים ניטעו לאורך הנהר.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'Several new schools were built in the city last decade.',
                wrong: ['Several new schools was built in the city last decade.', 'Several new schools were build in the city last decade.', 'Several new schools built were in the city last decade.'],
                explainHe:
                  'בסביל בעבר: was / were + V3. schools ברבים ולכן were, built היא צורת V3 של build, והסדר הנכון הוא were built.',
                hintEn: 'Look at the verb be and the third form of build.',
              },
              story: {
                passageEn:
                  'When the city of Karmiel decided to cut its electricity costs, engineers first measured how much energy each building used. The results were surprising: the oldest school wasted almost twice as much power as the newest one. Instead of rebuilding it, the council chose to install better windows and LED lights. After one winter, the bill was reduced by a third, and the savings were spent on new laboratory equipment.',
                passageHe: '',
                questionEn: 'What can we conclude about the decision to improve the old school?',
                questionHe: '',
                correct: 'It saved money without the cost of a new building.',
                wrong: ['It proved that new buildings use more energy.', 'It made the electricity bills twice as high.', 'It was cancelled after the first cold winter.'],
              },
              storyHintEn: 'Think about why the council did not rebuild the school.',
            },
          },
        },
      },
      {
        icon: '👑',
        isBoss: true,
        titleEn: 'Boss: Global Youth Summit Unseen',
        titleHe: 'בוס: ועידת הנוער העולמית — אתגר אנסין',
        storyHookHe:
          'משימת בוס עיונית: עליכם לנתח נאום רשמי מוועידת האקלים הבינלאומית, לזהות משפטי סביל ולענות על שאלות הבנה מעמיקות!',
        grammarTopic: 'Passive Voice Synthesis (Present & Past)',
        skills: ['Passive Synthesis', 'Academic Discourse', 'Bagrut Unseen Mastery'],
        sentenceEn: 'Significant solutions were proposed by youth leaders who were invited to the summit.',
        sentenceHe: 'פתרונות משמעותיים הוצעו על ידי מנהיגי נוער שהוזמנו לפסגה.',
        vocab: [
          [
            'initiative',
            'noun',
            'יוזמה',
            '💡',
            'The youth initiative received international recognition.',
            'יוזמת הנוער זכתה להכרה בינלאומית.',
          ],
          [
            'collaborate',
            'verb',
            'לשתף פעולה',
            '🤝',
            'Scientists and students collaborate on ocean research.',
            'מדענים ותלמידים משתפים פעולה בחקר האוקיינוסים.',
          ],
          [
            'essential',
            'adjective',
            'חיוני / הכרחי',
            '⭐',
            'Clean water is essential for all living creatures.',
            'מים נקיים חיוניים לכל היצורים החיים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'hesitation', translationHe: 'היסוס' },
            { wordEn: 'disregard', translationHe: 'התעלמות' },
          ],
          shortSentenceEn: 'Great initiatives were proposed.',
          shortSentenceHe: 'יוזמות נהדרות הוצעו.',
          rule: {
            questionEn: 'Choose the correct Passive form: "New laws _______ by parliament tomorrow."',
            correct: 'will be enacted',
            wrong: ['will enacted', 'are enact'],
            explainHe:
              'סביל בעתיד נבנה באמצעות will be בתוספת צורת הפועל השלישית (V3) (למשל: will be enacted).',
            hintHe: 'סביל בעתיד צריך שלושה חלקים: will, צורת הבסיס של הפועל להיות, ואז V3.',
          },
          story: {
            passageEn:
              'At the Youth Climate Summit in Geneva, ambitious proposals were presented by delegates from forty countries. An international youth council was formed to supervise renewable energy projects in developing regions. Millions of dollars were pledged by environmental funds to support these young innovators.',
            passageHe:
              'בוועידת האקלים לנוער בז׳נבה, הצעות שאפתניות הוצגו על ידי נציגים מארבעים מדינות. מועצת נוער בינלאומית הוקמה כדי לפקח על פרויקטים של אנרגיה מתחדשת באזורים מתפתחים. מיליוני דולרים הובטחו על ידי קרנות סביבתיות לתמיכה בחדשנים צעירים אלה.',
            questionEn: 'What was the main purpose of forming the international youth council?',
            questionHe: 'מה הייתה המטרה העיקרית של הקמת מועצת הנוער הבינלאומית?',
            correct: 'To supervise renewable energy projects in developing regions.',
            wrong: ['To organize sports competitions in Geneva.', 'To cancel international research funds.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'New rules will be announced tomorrow.',
                wrong: ['New rules will announced tomorrow.'],
                explainHe: 'סביל בעתיד: will be + V3. בלי be המשפט חסר.',
                hintHe: 'סביל בעתיד צריך את be בין will לבין צורת V3.',
              },
              story: {
                passageEn:
                  'The students planned a clean beach day. Bags and gloves were given to everyone. Forty students came to help.',
                passageHe:
                  'התלמידים תכננו יום ניקיון בחוף. שקיות וכפפות חולקו לכולם. ארבעים תלמידים באו לעזור.',
                questionEn: 'What was given to everyone?',
                questionHe: 'מה חולק לכולם?',
                correct: 'Bags and gloves.',
                wrong: ['Food and water.'],
              },
            },
            challenger: {
              clozeWrong: [['accident', 'curfew'], ['swim', 'shrink'], ['optional', 'harmful']],
            },
            master: {
              sentenceEn:
                'Proposals that were presented by students will be reviewed by the committee next month.',
              sentenceHe: 'הצעות שהוצגו על ידי תלמידים ייבדקו על ידי הוועדה בחודש הבא.',
              decoys: ['reviewing', 'is'],
              voiceEn: 'The winners will be announced tonight.',
              voiceHe: 'הזוכים יוכרזו הערב.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The final report was written by a team of young researchers.',
                wrong: ['The final report written was by a team of young researchers.', 'The final report was wrote by a team of young researchers.', 'The final report were written by a team of young researchers.'],
                explainHe:
                  'בסביל: be + V3 בסדר הנכון. written היא V3 של write, ו-report ביחיד ולכן was.',
                hintEn: 'Check word order, the verb be and the third form.',
              },
              story: {
                passageEn:
                  'Maya had always believed that one person could not change a whole city. Then her class joined a project in which each student adopted a neglected public garden. Maya received a plot beside the bus station, where nothing but weeds and broken glass had been seen for years. She worked there every afternoon for a month. When a journalist visited, the garden was full of herbs, and neighbours had begun to leave their own gifts of plants at the gate.',
                passageHe: '',
                questionEn: 'What does the story suggest about Maya at the end?',
                questionHe: '',
                correct: 'Her work inspired other people in the neighbourhood.',
                wrong: ['She became sure that one person cannot change anything.', 'She stopped working because the garden was too small.', 'She forced her neighbours to pay for the new plants.'],
              },
              storyHintEn: 'Think about why neighbours left plants at the gate.',
            },
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 2: Media Literacy & Digital Footprints',
    titleHe: 'פרק 2: אוריינות תקשורת ועקבות דיגיטליים',
    subtitleHe: 'פסוקיות יחסיות (Relative Clauses), זיהוי מקורות והערכת מידע',
    badgeEmoji: '📱',
    missions: [
      {
        icon: '🔍',
        titleEn: 'The Truth Behind Fake News',
        titleHe: 'האמת מאחורי פייק ניוז',
        storyHookHe:
          'איך מזהים עובדה מול שמועה ברשת? נלמד להשתמש בפסוקיות יחסיות מגדירות (Defining Relative Clauses) עם who, which ו-that.',
        grammarTopic: 'Defining Relative Clauses (who, which, that)',
        skills: ['Relative Clauses', 'Media Literacy', 'Fact Checking'],
        sentenceEn: 'Journalists who verify their sources ensure that information is reliable.',
        sentenceHe: 'עיתונאים שמאמתים את מקורותיהם מבטיחים שהמידע מהימן.',
        vocab: [
          [
            'reliable',
            'adjective',
            'מהימן / אמין',
            '✅',
            'Always check whether your news source is reliable.',
            'בדקו תמיד האם מקור החדשות שלכם מהימן.',
          ],
          [
            'misleading',
            'adjective',
            'מטעה',
            '⚠️',
            'The headline was misleading and created panic.',
            'הכותרת הייתה מטעה ויצרה בהלה.',
          ],
          [
            'verify',
            'verb',
            'לאמת / לוודא',
            '🔍',
            'Researchers must verify data before publication.',
            'חוקרים חייבים לאמת נתונים לפני הפרסום.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'fabricated', translationHe: 'מומצא / מפוברק' },
            { wordEn: 'casual', translationHe: 'מקרי / לא רשמי' },
          ],
          shortSentenceEn: 'Journalists verify facts carefully.',
          shortSentenceHe: 'עיתונאים מאמתים עובדות בקפידה.',
          rule: {
            questionEn: 'Which relative pronoun is used specifically for people?',
            correct: 'who',
            wrong: ['which', 'where'],
            explainHe:
              'משתמשים בכינוי הזיקה who עבור בני אדם (למשל: The student who studied passed the test), בעוד ש-which משמש עבור חפצים או בעלי חיים.',
            hintHe: 'כדאי לנסות משפט כמו: The girl ___ sings is my friend. איזו מילה מתאימה לאדם?',
          },
          story: {
            passageEn:
              'A viral video claimed that a rare comet would hit Earth next Tuesday. High school students who followed astronomy blogs decided to investigate the claim. They verified the dates with NASA scientists and proved that the video was completely fabricated.',
            passageHe:
              'סרטון ויראלי טען כי שביט נדיר יפגע בכדור הארץ ביום שלישי הקרוב. תלמידי תיכון שעקבו אחרי בלוגים של אסטרונומיה החליטו לחקור את הטענה. הם אימתו את התאריכים מול מדעני נאס״א והוכיחו כי הסרטון היה מפוברק לחלוטין.',
            questionEn: 'How did the high school students prove the video was false?',
            questionHe: 'כיצד הוכיחו תלמידי התיכון שהסרטון היה שקרי?',
            correct: 'By verifying the scientific dates with NASA experts.',
            wrong: ['By deleting their social media accounts.', 'By interviewing the video creator.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'The girl who sings in the choir is my cousin.',
                wrong: ['The girl which sings in the choir is my cousin.'],
                explainHe: 'לבני אדם משתמשים ב-who, ולא ב-which.',
                hintHe: 'המילה girl מתארת אדם. איזו מילת זיקה מתאימה לאדם?',
              },
              story: {
                passageEn:
                  'Yael read a message about free pizza. She asked her teacher, who checked it online. The message was fake.',
                passageHe:
                  'יעל קראה הודעה על פיצה בחינם. היא שאלה את המורה שלה, שבדק אותה באינטרנט. ההודעה הייתה מזויפת.',
                questionEn: 'Who checked the message?',
                questionHe: 'מי בדק את ההודעה?',
                correct: 'The teacher.',
                wrong: ['Her mother.'],
              },
            },
            challenger: {
              clozeWrong: [['flexible', 'comfortable'], ['boring', 'amusing'], ['invent', 'ignore']],
            },
            master: {
              sentenceEn: 'The story that went viral was written by someone who ignored the facts.',
              sentenceHe: 'הסיפור שהפך לויראלי נכתב על ידי מישהו שהתעלם מהעובדות.',
              decoys: ['whose', 'whom'],
              voiceEn: 'Check the source before you share it.',
              voiceHe: 'בדקו את המקור לפני שאתם משתפים אותו.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'People who share rumours online can cause real harm.',
                wrong: ['People which share rumours online can cause real harm.', 'People who shares rumours online can cause real harm.', 'People whose share rumours online can cause real harm.'],
                explainHe:
                  'לבני אדם משתמשים ב-who, והפועל בפסוקית מתאים לנושא: people ... who share (רבים).',
                hintEn: 'Check the pronoun for people and the verb after it.',
              },
              story: {
                passageEn:
                  'Tomer received a message that said his school would close for a week because of a storm. Several classmates who read it immediately shared it with their friends. Tomer, however, noticed that the message had no name and no date. He opened the official school website, which showed a normal schedule. By the evening, the false message had reached hundreds of students, and the principal had to send an email to calm everyone.',
                passageHe: '',
                questionEn: 'Why did Tomer doubt the message?',
                questionHe: '',
                correct: 'It did not show who wrote it or when.',
                wrong: ['The school website had been closed for repairs.', 'His classmates told him it was only a joke.', 'It was sent to him by the principal herself.'],
              },
              storyHintEn: 'Notice what was missing from the message.',
            },
          },
        },
      },
      {
        icon: '🌐',
        titleEn: 'Digital Footprints & Privacy',
        titleHe: 'עקבות דיגיטליים ופרטיות ברשת',
        storyHookHe:
          'כל פעולה שלנו ברשת משאירה עקבות. נלמד להשתמש בפסוקיות יחסיות לא-מגדירות (Non-Defining Relative Clauses) המופרדות בפסיקים.',
        grammarTopic: 'Non-Defining Relative Clauses (which, who with commas)',
        skills: ['Non-Defining Clauses', 'Digital Safety', 'Punctuation'],
        sentenceEn: 'Social platforms, which collect user data, must respect privacy regulations.',
        sentenceHe: 'פלטפורמות חברתיות, שאוספות נתוני משתמשים, חייבות לכבד תקנות פרטיות.',
        vocab: [
          [
            'exaggerate',
            'verb',
            'להגזים',
            '📢',
            'Online influencers often exaggerate the results.',
            'משפיעני רשת לעיתים קרובות מגזימים בתוצאות.',
          ],
          [
            'credible',
            'adjective',
            'אמין / בעל אמינות',
            '🎖️',
            'The documentary was based on credible scientific research.',
            'הסרט התיעודי התבסס על מחקר מדעי אמין.',
          ],
          [
            'privacy',
            'noun',
            'פרטיות',
            '🔒',
            'Protecting personal privacy is essential online.',
            'הגנה על פרטיות אישית חיונית ברשת.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'minimize', translationHe: 'למזער' },
            { wordEn: 'neglect', translationHe: 'להזניח' },
          ],
          shortSentenceEn: 'Privacy is very essential.',
          shortSentenceHe: 'פרטיות חיונית מאוד.',
          rule: {
            questionEn: 'Which sentence correctly uses commas for extra non-essential information?',
            correct: 'My brother, who studies computer science, built a secure app.',
            wrong: [
              'My brother that studies computer science, built a secure app.',
              'My brother which studies computer science built a secure app.',
            ],
            explainHe:
              'בפסוקית לא-מגדירה המספקת מידע נוסף ולא-הכרחי, משתמשים בפסיקים סביב הפסוקית, ולעולם לא משתמשים ב-that.',
            hintHe: 'מידע נוסף שאפשר להשמיט נכתב בין שני פסיקים. וגם כדאי לבדוק שכינוי הזיקה מתאים לאדם.',
          },
          story: {
            passageEn:
              'Many teenagers share photographs and locations daily without realizing the long-term impact. Cyber security experts, who study digital footprints, advise young users to adjust their privacy settings. Information posted online can remain accessible to future universities and employers.',
            passageHe:
              'בני נוער רבים משתפים תמונות ומיקומים מדי יום מבלי להבין את ההשפעה ארוכת הטווח. מומחי אבטחת מידע, החוקרים עקבות דיגיטליים, מייעצים למשתמשים צעירים להתאים את הגדרות הפרטיות שלהם. מידע שמועלה לרשת עשוי להישאר נגיש לאוניברסיטאות ומעסיקים בעתיד.',
            questionEn: 'What do cyber security experts recommend teenagers do?',
            questionHe: 'מה מומחי אבטחת מידע ממליצים לבני נוער לעשות?',
            correct: 'Adjust their privacy settings carefully.',
            wrong: ['Stop using computers permanently.', 'Share their passwords with friends.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'Our teacher, who lives nearby, walks to school.',
                wrong: ['Our teacher, that lives nearby, walks to school.'],
                explainHe: 'בפסוקית עם מידע נוסף בין פסיקים לא משתמשים ב-that. לאדם משתמשים ב-who.',
                hintHe: 'מידע נוסף בין פסיקים לא מקבל that. מה מתאים לאדם?',
              },
              story: {
                passageEn:
                  'Ben has a new phone. His phone, which is very fast, has a good camera. Ben takes photos of his dog every day.',
                passageHe:
                  'לבן יש טלפון חדש. הטלפון שלו, שהוא מהיר מאוד, כולל מצלמה טובה. בן מצלם את הכלב שלו כל יום.',
                questionEn: 'What does Ben take photos of?',
                questionHe: 'את מה בן מצלם?',
                correct: 'His dog.',
                wrong: ['His school.'],
              },
            },
            challenger: {
              clozeWrong: [['repair', 'harvest'], ['imaginary', 'seasonal'], ['fashion', 'popularity']],
            },
            master: {
              sentenceEn:
                'Our headteacher, who spoke at the assembly, warned us about fake online profiles.',
              sentenceHe: 'מנהל בית הספר שלנו, שנאם באסיפה, הזהיר אותנו מפני פרופילים מזויפים ברשת.',
              decoys: ['which', 'whom'],
              voiceEn: 'My phone, which is old, still works.',
              voiceHe: 'הטלפון שלי, שהוא ישן, עדיין עובד.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The museum, which opened last year, attracts many tourists.',
                wrong: ['The museum, that opened last year, attracts many tourists.', 'The museum, who opened last year, attracts many tourists.', 'The museum, which it opened last year, attracts many tourists.'],
                explainHe:
                  'בפסוקית לא-מגדירה בין פסיקים משתמשים ב-which לדברים (לא that, לא who) ולא מוסיפים כינוי נוסף כמו it.',
                hintEn: 'Check the pronoun for things and look for extra words.',
              },
              story: {
                passageEn:
                  'When Lior turned sixteen, she decided to look herself up online, expecting to find nothing. To her surprise, the first page of results showed a photograph from a school trip, a comment she had written at the age of twelve, and the name of her street. Her older brother, who works in technology, helped her delete what she could and change her settings. Lior now says she would think twice before posting anything, because removing something completely is much harder than posting it.',
                passageHe: '',
                questionEn: 'What did Lior learn from the experience?',
                questionHe: '',
                correct: 'Content that is shared once may be hard to remove.',
                wrong: ['Search engines never show private information.', 'Only adults leave a digital footprint behind.', 'Her brother posts photographs without asking.'],
              },
              storyHintEn: 'Think about which is easier: posting or deleting.',
            },
          },
        },
      },
      {
        icon: '👑',
        isBoss: true,
        titleEn: 'Boss: Fact-Checking Investigation',
        titleHe: 'בוס: חקירת בדיקת עובדות — אתגר מדיה',
        storyHookHe:
          'משימת בוס מעשית: הוזמנתם לחדר החדשות של עיתון מוביל! עליכם לזהות מניפולציות בטקסט, לשלב פסוקיות יחסיות ולנמק את מסקנותיכם.',
        grammarTopic: 'Relative Clauses & Critical Media Synthesis',
        skills: ['Relative Synthesis', 'Critical Thinking', 'Bagrut Module C/E'],
        sentenceEn: 'Readers who develop critical thinking skills easily identify biased articles.',
        sentenceHe: 'קוראים שמפתחים מיומנויות חשיבה ביקורתית מזהים בקלות מאמרים מוטים.',
        vocab: [
          [
            'critical',
            'adjective',
            'ביקורתי / מכריע',
            '🧠',
            'Critical thinking helps us evaluate complex claims.',
            'חשיבה ביקורתית עוזרת לנו להעריך טענות מורכבות.',
          ],
          [
            'objective',
            'adjective',
            'אובייקטיבי / נטול פניות',
            '⚖️',
            'An objective report presents both sides fairly.',
            'דיווח אובייקטיבי מציג את שני הצדדים בהגינות.',
          ],
          [
            'manipulate',
            'verb',
            'לתמרן / לעשות מניפולציה',
            '🎭',
            'Clickbait headlines manipulate readers emotions.',
            'כותרות קליקבייט מתמרנות את רגשות הקוראים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'superficial', translationHe: 'שטחי' },
            { wordEn: 'passive', translationHe: 'פאסיבי / סביל' },
          ],
          shortSentenceEn: 'Critical readers analyze facts.',
          shortSentenceHe: 'קוראים ביקורתיים מנתחים עובדות.',
          rule: {
            questionEn: 'Which relative pronoun refers to possession (belonging to someone)?',
            correct: 'whose',
            wrong: ['whom', 'which'],
            explainHe:
              'משתמשים ב-whose לציון שייכות של אדם או גורם (למשל: The author whose article won an award).',
            hintHe: 'שייכות היא ש... שלו / שלה. איזו מילה שואלת של מי משהו?',
          },
          story: {
            passageEn:
              'During an election campaign, an artificial audio recording of a candidate spread across thousands of forums. Independent fact-checkers, whose mission is to protect truth in democracy, analyzed the sound waves using acoustic software. Within three hours, the recording was proven to be deepfake manipulation.',
            passageHe:
              'במהלך מערכת בחירות, הקלטת שמע מלאכותית של מועמד הופצה באלפי פורומים. בודקי עובדות עצמאיים, שמטרתם להגן על האמת בדמוקרטיה, ניתחו את גלי הקול באמצעות תוכנה אקוסטית. תוך שלוש שעות הוכח כי ההקלטה הייתה זיוף דיפ-פייק.',
            questionEn: 'How did fact-checkers discover that the recording was fake?',
            questionHe: 'כיצד גילו בודקי העובדות שההקלטה הייתה מזויפת?',
            correct: 'By analyzing the acoustic sound waves with specialized software.',
            wrong: ['By calling the radio station directly.', 'By deleting the internet archive.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'I know a man whose son is a pilot.',
                wrong: ['I know a man who son is a pilot.'],
                explainHe: 'whose מראה שייכות: הבן של האיש. who משמש כשהאדם עצמו עושה את הפעולה.',
                hintHe: 'הבן שייך לאיש. איזו מילת זיקה מראה שייכות?',
              },
              story: {
                passageEn:
                  'Noam read two articles about the same match. The first article gave facts about both teams. The second article only praised one team.',
                passageHe:
                  'נעם קרא שתי כתבות על אותו משחק. הכתבה הראשונה נתנה עובדות על שתי הקבוצות. הכתבה השנייה רק שיבחה קבוצה אחת.',
                questionEn: 'Which article gave facts about both teams?',
                questionHe: 'איזו כתבה נתנה עובדות על שתי הקבוצות?',
                correct: 'The first one.',
                wrong: ['The second one.'],
              },
            },
            challenger: {
              clozeWrong: [['wishful', 'casual'], ['icy', 'exaggerated'], ['translate', 'memorize']],
            },
            master: {
              sentenceEn:
                'Readers whose attention is captured by dramatic headlines rarely read the full article.',
              sentenceHe: 'קוראים שתשומת לבם נתפסת על ידי כותרות דרמטיות כמעט לא קוראים את הכתבה המלאה.',
              decoys: ['who', 'whom'],
              voiceEn: 'A good reporter always asks difficult questions.',
              voiceHe: 'עיתונאי טוב תמיד שואל שאלות קשות.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The editor whose article won the prize is visiting our school.',
                wrong: ['The editor who article won the prize is visiting our school.', 'The editor whose article won the prize are visiting our school.', 'The editor whose his article won the prize is visiting our school.'],
                explainHe:
                  'whose מראה שייכות ואחריו בא שם עצם ישירות, בלי כינוי נוסף (לא whose his). הפועל מתאים ליחיד: is.',
                hintEn: 'Check the word showing belonging and any extra words.',
              },
              story: {
                passageEn:
                  'Karin works for a news website whose editors want as many clicks as possible. Last month her manager asked her to publish a calm report about a small earthquake under the headline "Disaster Strikes: Thousands Panic!" Karin knew that nobody was injured and that nobody had panicked. She argued with the manager for an hour, and finally they agreed on a headline that was dramatic but true. She admitted afterwards that it was not an easy choice, because her job depended on the popularity of the website.',
                passageHe: '',
                questionEn: 'What can we infer about Karin?',
                questionHe: '',
                correct: 'She cares more about accuracy than about easy clicks.',
                wrong: ['She enjoys writing exaggerated headlines.', 'She was fired for disagreeing with her manager.', 'She believes earthquakes are never dangerous.'],
              },
              storyHintEn: 'Notice how she reacted to the first headline.',
            },
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 3: Modals of Deduction & Scientific Inquiries',
    titleHe: 'פרק 3: מודלים של השערה ומסתורין מדעי',
    subtitleHe: 'הסקת מסקנות בהווה (must be, can\'t be, might be), ראיות והשערות',
    badgeEmoji: '🔬',
    missions: [
      {
        icon: '🧬',
        titleEn: 'Clues & Hypotheses: Must be & Can\'t be',
        titleHe: 'רמזים והשערות: בטוח שכן ובטוח שלא',
        storyHookHe:
          'בלשי המדע יוצאים לשטח! נלמד להשתמש ב-must be כשאנחנו בטוחים ב-100% שדבר מסוים נכון, וב-can\'t be כשאנחנו בטוחים שהוא אינו הגיוני.',
        grammarTopic: 'Modals of Deduction: Must be vs. Can\'t be',
        skills: ['Deduction Modals', 'Scientific Evidence', 'Logical Inference'],
        sentenceEn: 'The test results must be valid because three different labs confirmed them.',
        sentenceHe: 'תוצאות הבדיקה חייבות להיות תקפות משום ששלוש מעבדות שונות אישרו אותן.',
        vocab: [
          [
            'contradict',
            'verb',
            'לסתור / להתנגד',
            '⚡',
            'These new findings contradict earlier research.',
            'ממצאים חדשים אלה סותרים מחקרים קודמים.',
          ],
          [
            'evidence',
            'noun',
            'ראיות / עדות',
            '📜',
            'There is strong evidence that temperatures are rising.',
            'ישנן ראיות חזקות לכך שהטמפרטורות עולות.',
          ],
          [
            'hypothesis',
            'noun',
            'השערה מדעית',
            '💭',
            'The scientist formulated a clear hypothesis.',
            'המדען ניסח השערה ברורה.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'assumption', translationHe: 'הנחה בלתי מבוססת' },
            { wordEn: 'rumor', translationHe: 'שמועה' },
          ],
          shortSentenceEn: 'The evidence is valid.',
          shortSentenceHe: 'הראיות תקפות.',
          rule: {
            questionEn: 'Which modal expresses 99% certainty that something is IMPOSSIBLE?',
            correct: 'can\'t be',
            wrong: ['must be', 'might not be'],
            explainHe:
              'באנגלית משתמשים ב-can\'t be כדי להביע ביטחון מלא שמשהו אינו אפשרי (למשל: He can\'t be in Paris; I saw him here an hour ago).',
            hintHe: 'מחפשים ודאות שלילית חזקה (בטוח שלא), לא רק אפשרות ולא ודאות חיובית.',
          },
          story: {
            passageEn:
              'Geologists exploring an underground cavern noticed glowing green crystals along the ceiling. Dr. Green noted that the crystals can\'t be ordinary quartz because they emit ultraviolet light without any external power. She stated that there must be an unknown mineral reaction taking place inside the rock.',
            passageHe:
              'גאולוגים שחקרו מערה תת-קרקעית הבחינו בגבישים ירוקים זוהרים לאורך התקרה. ד״ר גרין ציינה שהגבישים אינם יכולים להיות קוורץ רגיל משום שהם פולטים אור אולטרה-סגול ללא מקור כוח חיצוני. היא קבעה כי חייבת להתרחש תגובה מינרלית בלתי מוכרת בתוך הסלע.',
            questionEn: 'Why did Dr. Green state the crystals cannot be ordinary quartz?',
            questionHe: 'מדוע קבעה ד״ר גרין שהגבישים אינם יכולים להיות קוורץ רגיל?',
            correct: 'Because they emit ultraviolet light without any external power.',
            wrong: ['Because they were completely black.', 'Because they dissolved in water instantly.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'He is wearing a helmet, so he must be a cyclist.',
                wrong: ["He is wearing a helmet, so he can't be a cyclist."],
                explainHe:
                  "הקסדה היא ראיה, ולכן בטוחים שהוא רוכב: must be. can't be מביע ודאות שזה לא ייתכן.",
                hintHe: 'הראיה תומכת בכך שהוא רוכב אופניים. איזו ודאות מתאימה?',
              },
              story: {
                passageEn:
                  'Tal heard a noise in the kitchen. Her cat was asleep on her bed. So it was not the cat.',
                passageHe: 'טל שמעה רעש במטבח. החתול שלה ישן על המיטה שלה. אז זה לא היה החתול.',
                questionEn: 'Where was the cat?',
                questionHe: 'איפה היה החתול?',
                correct: 'On her bed.',
                wrong: ['In the kitchen.'],
              },
            },
            challenger: {
              clozeWrong: [['precede', 'translate'], ['weather', 'pollution'], ['laboratory', 'microscope']],
            },
            master: {
              sentenceEn: 'The footprints are too small so they must belong to a child.',
              sentenceHe: 'העקבות קטנות מדי ולכן הן חייבות להשתייך לילד.',
              decoys: ['belongs', 'adult'],
              voiceEn: 'The lab results cannot be correct.',
              voiceHe: 'תוצאות המעבדה לא יכולות להיות נכונות.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'She has been absent all week, so she must be ill.',
                wrong: ['She has been absent all week, so she must is ill.', 'She has been absent all week, so she must being ill.', 'She has been absent all week, so she must to be ill.'],
                explainHe: 'אחרי must בא פועל בסיס: must be. לא must is, לא must being ולא must to be.',
                hintEn: 'Look at what comes right after the modal verb.',
              },
              story: {
                passageEn:
                  'Dr. Navon opened the old sealed box and found a notebook, a pair of glasses and a rusty compass. The dates in the notebook were all from 1912. Strangely, the final page described a storm that happened in 1925. Dr. Navon first thought that the date must be a mistake, but the paper and ink looked exactly the same as on the earlier pages. She finally decided that the writer had probably continued to use the notebook for many years.',
                passageHe: '',
                questionEn: 'What does Dr. Navon finally conclude?',
                questionHe: '',
                correct: 'The notebook was used over a long period of time.',
                wrong: ['The last page was added by a different person.', 'The box had been opened several times before.', 'The storm of 1925 never really happened.'],
              },
              storyHintEn: 'Why did the paper and ink matter?',
            },
          },
        },
      },
      {
        icon: '🌌',
        titleEn: 'Exploring the Unknown: Might & Could',
        titleHe: 'חוקרים את הבלתי נודע: אולי וייתכן',
        storyHookHe:
          'מתי משהו אינו ודאי? נלמד להשתמש ב-might be ו-could be לתיאור אפשרויות סבירות כשאין לנו מספיק ראיות חד-משמעיות.',
        grammarTopic: 'Modals of Possibility: Might & Could',
        skills: ['Possibility Modals', 'Astronomy & Physics', 'Hypothesizing'],
        sentenceEn: 'The strange radio signals might be generated by a distant rotating star.',
        sentenceHe: 'אותות הרדיו המוזרים עשויים להיווצר על ידי כוכב רחוק שמסתובב.',
        vocab: [
          [
            'phenomenon',
            'noun',
            'תופעה',
            '✨',
            'The northern lights are a stunning natural phenomenon.',
            'הזוהר הצפוני הוא תופעת טבע מרהיבה.',
          ],
          [
            'plausible',
            'adjective',
            'מתקבל על הדעת / סביר',
            '🤔',
            'His explanation sounds completely plausible.',
            'ההסבר שלו נשמע מתקבל על הדעת לחלוטין.',
          ],
          [
            'detect',
            'verb',
            'לגלות / לאתר',
            '📡',
            'The telescope detected unusual radiation from space.',
            'הטלסקופ איתר קרינה חריגה מהחלל.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'disregard', translationHe: 'להתעלם' },
            { wordEn: 'conceal', translationHe: 'להסתיר' },
          ],
          shortSentenceEn: 'Sensors detect strange signals.',
          shortSentenceHe: 'חיישנים מאתרים אותות מוזרים.',
          rule: {
            questionEn: 'Which modal verbs express 50% possibility about a present situation?',
            correct: 'might / could',
            wrong: ['must / will', 'should / ought'],
            explainHe:
              'משתמשים ב-might או could כדי להביע אפשרות של כ-50% שדבר מסוים מתרחש או ייתכן (ייתכן שכן וייתכן שלא).',
            hintHe: 'אפשרות של 50% היא ייתכן שכן וייתכן שלא: לא ודאות ולא עצה.',
          },
          story: {
            passageEn:
              'In 1977, an observatory in Ohio detected a powerful radio pulse nicknamed the Wow Signal. Some astronomers suggested that it could be evidence of extraterrestrial communication. However, other astrophysicists argued that it might simply be an echo from passing comets.',
            passageHe:
              'בשנת 1977, מצפה כוכבים באוהיו איתר פולס רדיו עוצמתי שזכה לכינוי ״אות ה-וואו״. כמה אסטרונומים העלו השערה כי ייתכן שזו עדות לתקשורת חוצנית. עם זאת, אסטרופיזיקאים אחרים טענו שייתכן שמדובר פשוט בהד מכוכבי שביט חולפים.',
            questionEn: 'What did skeptical astrophysicists suggest about the signal?',
            questionHe: 'מה הציעו אסטרופיזיקאים סקפטיים לגבי האות?',
            correct: 'It might be an echo from passing comets.',
            wrong: ['It was a secret military broadcast.', 'It was an error in the microwave oven.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'I am not sure, so it might be a plane.',
                wrong: ['I am not sure, so it must be a plane.'],
                explainHe: 'כשלא בטוחים משתמשים ב-might. must מביע ודאות גבוהה.',
                hintHe: 'המשפט אומר שאין ודאות. איזו מילה מביעה אפשרות בלבד?',
              },
              story: {
                passageEn:
                  'Dan saw a strange light in the sky. He thinks it could be a plane. He is not sure, so he looks again.',
                passageHe:
                  'דן ראה אור מוזר בשמיים. הוא חושב שאולי זה מטוס. הוא לא בטוח, ולכן הוא מסתכל שוב.',
                questionEn: 'Is Dan sure about the light?',
                questionHe: 'האם דן בטוח לגבי האור?',
                correct: 'No, he is not sure.',
                wrong: ['Yes, he is sure.'],
              },
            },
            challenger: {
              clozeWrong: [['backpack', 'sandwich'], ['musical', 'tropical'], ['launch', 'repair']],
            },
            master: {
              sentenceEn:
                'The unusual lights over the mountains could be caused by sunlight reflecting off ice.',
              sentenceHe: 'האורות החריגים מעל ההרים עשויים להיגרם מאור שמש המוחזר מקרח.',
              decoys: ['causing', 'reflect'],
              voiceEn: 'It might snow in the mountains tonight.',
              voiceHe: 'ייתכן שיירד שלג בהרים הלילה.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The strange noise might come from the old pipes.',
                wrong: ['The strange noise might to come from the old pipes.', 'The strange noise might comes from the old pipes.', 'The strange noise might coming from the old pipes.'],
                explainHe: 'אחרי might בא פועל בסיס: בלי to, בלי s ובלי ing.',
                hintEn: 'Look at the form of the verb right after might.',
              },
              story: {
                passageEn:
                  'For three nights, fishermen near Eilat reported a faint blue glow under the water. A university team collected samples and put them under a microscope. Inside, they found millions of tiny organisms that produce light when the water moves. The scientists admitted that this could not be the only explanation, because the glow also appeared on calm nights. They plan to return with special cameras next summer.',
                passageHe: '',
                questionEn: 'Why are the scientists still not completely sure?',
                questionHe: '',
                correct: 'The light also appeared when the sea was quiet.',
                wrong: ['The organisms were too big to see.', 'The fishermen refused to talk to them.', 'No samples were taken from the water.'],
              },
              storyHintEn: 'On which nights did the explanation not fit?',
            },
          },
        },
      },
      {
        icon: '👑',
        isBoss: true,
        titleEn: 'Boss: Deep Ocean Mystery Unseen',
        titleHe: 'בוס: מסתורין במעמקי האוקיינוס — אתגר מדעי',
        storyHookHe:
          'משימת בוס עיונית: צוללת מחקר הגיעה לעומק של 8,000 מטר ומצאה מבנה ביולוגי יוצא דופן. עליכם לנתח את הראיות ולהסיק מסקנות מנומקות!',
        grammarTopic: 'Modals of Deduction Synthesis & Scientific Unseen',
        skills: ['Deduction Synthesis', 'Scientific Unseen', 'Module E Readiness'],
        sentenceEn: 'Scientists concluded that the deep underwater organisms must survive without sunlight.',
        sentenceHe: 'מדענים הסיקו כי האורגניזמים במעמקי המים חייבים לשרוד ללא אור שמש.',
        vocab: [
          [
            'conclude',
            'verb',
            'להסיק מסקנה / לסכם',
            '🎯',
            'After reviewing the data, we concluded the test succeeded.',
            'לאחר סקירת הנתונים, הסקנו כי המבחן הצליח.',
          ],
          [
            'mysterious',
            'adjective',
            'מסתורי / בלתי מוסבר',
            '🔮',
            'A mysterious glow lit up the dark underwater trench.',
            'זוהר מסתורי האיר את השקע התת-ימי החשוך.',
          ],
          [
            'organism',
            'noun',
            'יצור חי / אורגניזם',
            '🦠',
            'Microscopic organisms thrive in boiling volcanic vents.',
            'אורגניזמים מיקרוסקופיים משגשגים בפתחים וולקניים רותחים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'inorganic', translationHe: 'אנאורגני' },
            { wordEn: 'artificial', translationHe: 'מלאכותי' },
          ],
          shortSentenceEn: 'Deep organisms survive darkness.',
          shortSentenceHe: 'אורגניזמים במעמקים שורדים בחשיכה.',
          rule: {
            questionEn: 'Select the sentence showing the highest degree of certainty:',
            correct: 'The expedition must be successful; they found living samples.',
            wrong: [
              'The expedition might be successful if they find samples.',
              'The expedition could be successful tomorrow.',
            ],
            explainHe:
              'משפט עם must be מביע את דרגת הוודאות הגבוהה ביותר כאשר יש ראיה תומכת (they found living samples).',
            hintHe: 'הוודאות הגבוהה ביותר מגיעה כשיש ראיה. באיזה משפט מופיעה ראיה שכבר נמצאה?',
          },
          story: {
            passageEn:
              'In the Mariana Trench, robotic cameras recorded translucent creatures moving near thermal vents where temperatures exceed 300 degrees Celsius. Biologists realized these organisms cannot depend on photosynthesis because no light penetrates such depths. Instead, they must rely on chemosynthesis, converting mineral sulfur into life energy.',
            passageHe:
              'בשקע מריאנה, מצלמות רובוטיות תיעדו יצורים שקופים-למחצה שנעים ליד פתחים תרמיים שבהם הטמפרטורה עולה על 300 מעלות צלזיוס. ביולוגים הבינו כי יצורים אלה אינם יכולים להיות תלויים בפוטוסינתזה כיוון ששום אור אינו חודר לעומקים כאלה. במקום זאת, הם חייבים להסתמך על כמוסינתזה, הממירה גופרית מינרלית לאנרגיית חיים.',
            questionEn: 'How do creatures in the Mariana Trench generate life energy?',
            questionHe: 'כיצד יצורים בשקע מריאנה מייצרים אנרגיית חיים?',
            correct: 'Through chemosynthesis, utilizing mineral sulfur.',
            wrong: ['Through direct sunlight absorbed from above.', 'By eating plants drifting from surface waters.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'The lights are on, so someone must be home.',
                wrong: ["The lights are on, so someone can't be home."],
                explainHe: 'האורות דולקים, ולכן בטוחים שמישהו בבית: must be.',
                hintHe: 'יש ראיה שמישהו בבית. איזו ודאות מתאימה לראיה הזאת?',
              },
              story: {
                passageEn:
                  'A diver found a strange shell on the sea floor. It was bigger than a plate. She took a photo and sent it to a scientist.',
                passageHe:
                  'צוללנית מצאה צדף מוזר בקרקעית הים. הוא היה גדול מצלחת. היא צילמה ושלחה את התמונה למדען.',
                questionEn: 'What did the diver find?',
                questionHe: 'מה הצוללנית מצאה?',
                correct: 'A big strange shell.',
                wrong: ['A small silver coin.'],
              },
            },
            challenger: {
              clozeWrong: [['schedule', 'postpone'], ['wooden', 'salty'], ['mineral', 'crystal']],
            },
            master: {
              sentenceEn:
                'The creatures must use chemicals for energy because no sunlight reaches the seabed.',
              sentenceHe: 'היצורים חייבים להשתמש בכימיקלים לאנרגיה כי שום אור שמש לא מגיע לקרקעית הים.',
              decoys: ['uses', 'reach'],
              voiceEn: 'That strange fish cannot be a plant.',
              voiceHe: 'הדג המוזר הזה לא יכול להיות צמח.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'The animal has no eyes, so it must live in darkness.',
                wrong: ['The animal has no eyes, so it must lives in darkness.', 'The animal has no eyes, so it must to live in darkness.', 'The animal has no eyes, so it must be live in darkness.'],
                explainHe:
                  'אחרי must בא פועל בסיס אחד: must live. לא must lives, לא must to live ולא must be live.',
                hintEn: 'Check the verb after the modal and any extra words.',
              },
              story: {
                passageEn:
                  'In 2019, a research ship lowered a camera into a deep cave in the ocean floor. The footage showed white worms, each as long as a pencil, clustered around a hot stream of water. There were no plants, no algae and no light at all. Biologists were amazed, because they had assumed that nothing larger than bacteria could live there. After studying the worms, they concluded that the animals feed on bacteria that turn chemicals from the hot water into food.',
                passageHe: '',
                questionEn: 'What surprised the biologists most?',
                questionHe: '',
                correct: 'Large animals were living where they expected only tiny life.',
                wrong: ['The worms were growing on plants and algae.', 'The cave was full of bright sunlight.', 'The camera stopped working at the surface.'],
              },
              storyHintEn: 'Compare what they expected with what they saw.',
            },
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 4: Technology Ethics & Future Dilemmas',
    titleHe: 'פרק 4: אתיקה טכנולוגית ודילמות העתיד',
    subtitleHe: 'משפטי תנאי (First vs. Second Conditional), בינה מלאכותית ואחריות חברתית',
    badgeEmoji: '🤖',
    missions: [
      {
        icon: '💻',
        titleEn: 'Tech Tomorrow: Cause & Condition',
        titleHe: 'טכנולוגיית המחר: תנאי ותוצאה',
        storyHookHe:
          'מה יקרה אם מכוניות אוטונומיות יקבלו החלטות בכביש? נתרגל משפטי תנאי ראשון (First Conditional: If + Present, will + base verb) לתחזיות עתידיות ריאליות.',
        grammarTopic: 'First Conditional for Realistic Predictions',
        skills: ['First Conditional', 'Tech Forecasting', 'Clause Ordering'],
        sentenceEn: 'If automated cars encounter hazards, smart algorithms will respond instantly.',
        sentenceHe: 'אם מכוניות אוטונומיות ייתקלו במפגעים, אלגוריתמים חכמים יגיבו באופן מיידי.',
        vocab: [
          [
            'artificial',
            'adjective',
            'מלאכותי',
            '🤖',
            'Artificial intelligence is transforming medical diagnostics.',
            'בינה מלאכותית משנה את האבחון הרפואי.',
          ],
          [
            'ethical',
            'adjective',
            'מוסרי / אתי',
            '⚖️',
            'Engineers must follow ethical standards when designing AI.',
            'מהנדסים חייבים לציית לתקנים אתיים בעת תכנון בינה מלאכותית.',
          ],
          [
            'regulate',
            'verb',
            'להסדיר / לפקח בחוק',
            '📜',
            'Governments need to regulate automated algorithms.',
            'ממשלות צריכות להסדיר אלגוריתמים אוטומטיים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'disorderly', translationHe: 'בלתי מסודר' },
            { wordEn: 'primitive', translationHe: 'פרימיטיבי' },
          ],
          shortSentenceEn: 'Smart algorithms respond instantly.',
          shortSentenceHe: 'אלגוריתמים חכמים מגיבים מיד.',
          rule: {
            questionEn: 'Complete the First Conditional: "If society _______ tech, risks will decrease."',
            correct: 'regulates',
            wrong: ['will regulate', 'regulated'],
            explainHe:
              'בפסוקית התנאי (אחרי if) במשפט תנאי ראשון, משתמשים ב-Present Simple (regulates), ורק בחלק העיקרי של המשפט שמים will.',
            hintHe: 'אחרי if בתנאי ראשון לא שמים will, ו-society הוא it (יחיד).',
          },
          story: {
            passageEn:
              'Autonomous public transit is being piloted in major European hubs. If test fleets maintain zero collisions for six consecutive months, regional authorities will expand autonomous buses across residential suburbs. Civic planners emphasize that safety will always precede speed.',
            passageHe:
              'תחבורה ציבורית אוטונומית נבחנת בפיילוט במרכזים אירופיים מרכזיים. אם ציי הניסוי ישמרו על אפס התנגשויות במשך שישה חודשים רצופים, הרשויות האזוריות ירחיבו את האוטובוסים האוטונומיים לפרברי מגורים. מתכנני ערים מדגישים כי בטיחות תמיד תקדם למהירות.',
            questionEn: 'Under what condition will autonomous buses be expanded?',
            questionHe: 'באיזה תנאי יורחב מערך האוטובוסים האוטונומיים?',
            correct: 'If the test fleet maintains zero collisions for six months.',
            wrong: ['If ticket prices are doubled immediately.', 'If drivers agree to work overtime.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'If the robot breaks, we will repair it.',
                wrong: ['If the robot will break, we will repair it.'],
                explainHe: 'אחרי if בתנאי ראשון משתמשים ב-Present Simple (breaks), ולא ב-will.',
                hintHe: 'אחרי if לא שמים will. בדקו איפה הוא מופיע.',
              },
              story: {
                passageEn:
                  'The school has a new robot teacher. If it works well, other classes will get one too. The students test it every day.',
                passageHe:
                  'בבית הספר יש מורה רובוט חדש. אם הוא יעבוד טוב, גם כיתות אחרות יקבלו אחד. התלמידים בודקים אותו כל יום.',
                questionEn: 'What will happen if the robot works well?',
                questionHe: 'מה יקרה אם הרובוט יעבוד טוב?',
                correct: 'Other classes will get one.',
                wrong: ['The school will close.'],
              },
            },
            challenger: {
              clozeWrong: [['rural', 'seasonal'], ['musical', 'tropical'], ['celebrate', 'inherit']],
            },
            master: {
              sentenceEn:
                'If companies collect more personal data, governments will introduce stricter privacy laws.',
              sentenceHe: 'אם חברות יאספו עוד מידע אישי, ממשלות יחוקקו חוקי פרטיות מחמירים יותר.',
              decoys: ['would', 'introduced'],
              voiceEn: 'If we cooperate, the project will succeed.',
              voiceHe: 'אם נשתף פעולה, הפרויקט יצליח.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'If people stop trusting the app, its owners will lose money.',
                wrong: ['If people will stop trusting the app, its owners will lose money.', 'If people stop trusting the app, its owners would lose money.', 'If people stopped trusting the app, its owners will lose money.'],
                explainHe:
                  'תנאי ראשון: If + Present Simple, ובתוצאה will + פועל בסיס. לא will אחרי if, ולא would או Past Simple.',
                hintEn: 'Check the verb forms before and after the comma.',
              },
              story: {
                passageEn:
                  'The city of Haifa is considering a ban on delivery robots on narrow pavements. Supporters say that if the robots stay, accidents will become more common, especially for elderly walkers. The companies disagree. They claim that if the city introduces a ban, hundreds of small shops will lose customers who depend on quick deliveries. The mayor has promised to decide only after a three-month trial in two neighbourhoods, in which both sides will present their data.',
                passageHe: '',
                questionEn: 'Why will the mayor wait before making a decision?',
                questionHe: '',
                correct: 'A trial will give both sides a chance to show real data.',
                wrong: ['The robots must first be repaired by the city.', 'Both sides have already reached an agreement.', 'Elderly walkers asked for the shops to be closed.'],
              },
              storyHintEn: 'Look for what happens before the decision is made.',
            },
          },
        },
      },
      {
        icon: '🎨',
        titleEn: 'AI & Creative Dilemmas',
        titleHe: 'בינה מלאכותית ודילמות יצירתיות',
        storyHookHe:
          'אילו מחשב היה כותב שיר זוכה פרסים, למי היו שייכות זכויות היוצרים? נתרגל תנאי שני (Second Conditional: If + Past, would + base verb) למצבים היפותטיים.',
        grammarTopic: 'Second Conditional for Hypothetical Situations',
        skills: ['Second Conditional', 'Creative AI', 'Hypothetical Reasoning'],
        sentenceEn: 'If algorithms created original music, questions of copyright would become complex.',
        sentenceHe: 'אילו אלגוריתמים היו יוצרים מוזיקה מקורית, שאלות של זכויות יוצרים היו הופכות למורכבות.',
        vocab: [
          [
            'innovation',
            'noun',
            'חדשנות',
            '💡',
            'Technological innovation creates exciting opportunities.',
            'חדשנות טכנולוגית יוצרת הזדמנויות מרגשות.',
          ],
          [
            'copyright',
            'noun',
            'זכויות יוצרים',
            '©️',
            'The artist registered the copyright for her artwork.',
            'האמנית רשמה את זכויות היוצרים על יצירתה.',
          ],
          [
            'algorithm',
            'noun',
            'אלגוריתם',
            '⚙️',
            'The search algorithm organizes millions of pages.',
            'אלגוריתם החיפוש מארגן מיליוני עמודים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'tradition', translationHe: 'מסורת' },
            { wordEn: 'plagiarism', translationHe: 'גניבה ספרותית' },
          ],
          shortSentenceEn: 'Innovation creates great opportunities.',
          shortSentenceHe: 'חדשנות יוצרת הזדמנויות נהדרות.',
          rule: {
            questionEn: 'Which sentence correctly demonstrates the Second Conditional?',
            correct: 'If I were a programmer, I would design ethical AI tools.',
            wrong: [
              'If I am a programmer, I would design ethical AI tools.',
              'If I was a programmer, I will design ethical AI tools.',
            ],
            explainHe:
              'בתנאי שני למצב היפותטי בהווה, משתמשים בצורת עבר (if I were/studied) ולאחריה would + פועל בסיסי.',
            hintHe: 'תנאי שני הוא מצב דמיוני: אחרי If צורת עבר, ובתוצאה would + פועל בסיסי. בכתיבה רשמית יש לפועל להיות צורת עבר אחת לכל הגופים.',
          },
          story: {
            passageEn:
              'An art gallery in Tokyo hosted an exhibition where all paintings were produced by deep neural networks. Visitors were asked to guess which canvases were made by humans. If visitors knew an algorithm painted the portrait, they rated its emotional resonance substantially lower.',
            passageHe:
              'גלריית אמנות בטוקיו אירחה תערוכה שבה כל הציורים הופקו על ידי רשתות נוירונים עמוקות. המבקרים התבקשו לנחש אילו קנבסים נוצרו על ידי בני אדם. אם המבקרים ידעו שאלגוריתם צייר את הדיוקן, הם דירגו את התהודה הרגשית שלו באופן נמוך משמעותית.',
            questionEn: 'How did knowing a computer painted a portrait affect visitors?',
            questionHe: 'כיצד הידיעה שמחשב צייר את הדיוקן השפיעה על המבקרים?',
            correct: 'They rated its emotional impact significantly lower.',
            wrong: ['They offered twice as much money to buy it.', 'They refused to enter the gallery.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'If I had a drone, I would film the beach.',
                wrong: ['If I had a drone, I will film the beach.'],
                explainHe: 'תנאי שני: If + Past Simple (had), ובתוצאה would + פועל בסיס.',
                hintHe: 'מצב דמיוני. בדקו איזה פועל עזר מתאים לצורת העבר אחרי if.',
              },
              story: {
                passageEn:
                  'Mia loves to paint. If she had a tablet, she would draw on it. Her birthday is next week.',
                passageHe:
                  'מיה אוהבת לצייר. אילו היה לה טאבלט, היא הייתה מציירת עליו. יום ההולדת שלה בשבוע הבא.',
                questionEn: 'What would Mia do with a tablet?',
                questionHe: 'מה מיה הייתה עושה עם טאבלט?',
                correct: 'She would draw on it.',
                wrong: ['She would sell it.'],
              },
            },
            challenger: {
              clozeWrong: [['pollution', 'vegetable'], ['passport', 'scholarship'], ['keyboard', 'password']],
            },
            master: {
              sentenceEn:
                'If every student had a personal tutor, exam results would probably improve across the country.',
              sentenceHe: 'אילו לכל תלמיד היה מורה פרטי, תוצאות המבחנים כנראה היו משתפרות בכל הארץ.',
              decoys: ['improving', 'were'],
              voiceEn: 'If I were famous, I would help children.',
              voiceHe: 'אילו הייתי מפורסם/ת, הייתי עוזר/ת לילדים.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'If she knew the answer, she would tell her classmates.',
                wrong: ['If she knows the answer, she would tell her classmates.', 'If she knew the answer, she will tell her classmates.', 'If she would know the answer, she would tell her classmates.'],
                explainHe:
                  'תנאי שני: If + Past Simple, would + פועל בסיס. לא Present אחרי if, לא will, ולא would אחרי if.',
                hintEn: 'Check both verbs: one is past, one has would.',
              },
              story: {
                passageEn:
                  'Last year, a young composer named Eli used a program to create a short piece of piano music in seconds. He entered it into a school competition and won second place. When the judges discovered that a computer had written most of the notes, some of them demanded that the prize be taken back. Eli argued that he had chosen the style, the speed and the final version himself. The argument continued for weeks. In the end, the school decided to add a new category for music created with technology.',
                passageHe: '',
                questionEn: 'How did the school solve the problem?',
                questionHe: '',
                correct: 'It created a separate group for computer-assisted music.',
                wrong: ['It gave the first prize to the computer.', 'It banned all piano competitions in school.', 'It asked Eli to pay for the program.'],
              },
              storyHintEn: 'What did the school add at the end?',
            },
          },
        },
      },
      {
        icon: '👑',
        isBoss: true,
        titleEn: 'Boss: Module C/E Gateway Simulation',
        titleHe: 'בוס: סימולציית בגרות שאלון C/E — אתגר עתידנות',
        storyHookHe:
          'משימת בוס עיונית: עליכם לפתור קטע הבנת הנקרא אקדמי מלא ברמת שאלון בגרות E על עתיד החינוך והטכנולוגיה!',
        grammarTopic: 'Conditionals & Future Discourse Synthesis',
        skills: ['Conditionals Synthesis', 'Bagrut Module E Prep', 'Critical Reading'],
        sentenceEn: 'Society will benefit greatly if advanced technologies are guided by ethical principles.',
        sentenceHe: 'החברה תפיק תועלת רבה אם טכנולוגיות מתקדמות יונחו על ידי עקרונות מוסריים.',
        vocab: [
          [
            'benefit',
            'verb',
            'להפיק תועלת / להועיל',
            '🌟',
            'Students benefit greatly from interactive digital tools.',
            'תלמידים מפיקים תועלת רבה מכלים דיגיטליים אינטראקטיביים.',
          ],
          [
            'principle',
            'noun',
            'עיקרון מנחה / כלל',
            '🧭',
            'Honesty is a fundamental principle of science.',
            'יושר הוא עיקרון יסוד במדע.',
          ],
          [
            'impact',
            'noun',
            'השפעה / רושם',
            '💥',
            'Online education had a huge impact on modern schools.',
            'לחינוך מקוון הייתה השפעה עצומה על בתי ספר מודרניים.',
          ],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'disadvantage', translationHe: 'חיסרון' },
            { wordEn: 'indifference', translationHe: 'אדישות' },
          ],
          shortSentenceEn: 'Principles guide smart technology.',
          shortSentenceHe: 'עקרונות מנחים טכנולוגיה חכמה.',
          rule: {
            questionEn: 'Choose the correct structure: "Unless we _______ rules, problems will arise."',
            correct: 'establish',
            wrong: ['will establish', 'established'],
            explainHe:
              'המילה unless פירושה if not (אלא אם כן). אחריה משתמשים ב-Present Simple (establish) בדיוק כמו אחרי if.',
            hintHe: 'unless פירושו if not. אחריה משתמשים באותו זמן כמו אחרי if בתנאי ראשון.',
          },
          story: {
            passageEn:
              'A landmark international study conducted across twenty school districts evaluated the impact of personalized tutoring bots. The research proved that when bots were used as supplementary mentors alongside human teachers, reading comprehension scores rose by twenty-two percent. However, lead researchers warned that human empathy remains indispensable.',
            passageHe:
              'מחקר בינלאומי פורץ דרך שנערך בעשרים מחוזות לימוד העריך את ההשפעה של בוטים מותאמים אישית להוראה פרטית. המחקר הוכיח שכאשר בוטים שימשו כחונכים משלימים לצד מורים אנושיים, ציוני הבנת הנקרא עלו בעשרים ושניים אחוזים. עם זאת, החוקרים הראשיים הזהירו כי אמפתיה אנושית נותרה הכרחית ובלתי ניתנת להחלפה.',
            questionEn: 'What did the study prove about personalized tutoring bots?',
            questionHe: 'מה הוכיח המחקר לגבי בוטים מותאמים אישית להוראה?',
            correct: 'They significantly boosted reading scores when paired with human teachers.',
            wrong: ['They completely replaced the need for human teachers.', 'They caused students to fail examinations.'],
          },
          tiers: {
            explorer: {
              rule: {
                questionEn: 'Which sentence is right?',
                correct: 'If we plan well, the trip will be fun.',
                wrong: ['If we will plan well, the trip will be fun.'],
                explainHe: 'אחרי if בתנאי ראשון משתמשים ב-Present Simple (plan), ולא ב-will.',
                hintHe: 'בדקו איזו מילה לא שייכת אחרי if.',
              },
              story: {
                passageEn:
                  'Lina wants to use less plastic. If she brings a bottle to school, she will save money. She also brings her own bag.',
                passageHe:
                  'לינה רוצה להשתמש בפחות פלסטיק. אם תביא בקבוק לבית הספר, היא תחסוך כסף. היא גם מביאה תיק משלה.',
                questionEn: 'What does Lina bring from home?',
                questionHe: 'מה לינה מביאה מהבית?',
                correct: 'A bottle and a bag.',
                wrong: ['A pen and a book.'],
              },
            },
            challenger: {
              clozeWrong: [['escape', 'compete'], ['accident', 'experiment'], ['budget', 'invention']],
            },
            master: {
              sentenceEn:
                'Unless companies are honest about how they use data, customers will stop trusting them.',
              sentenceHe: 'אלא אם כן חברות יהיו כנות לגבי השימוש שלהן במידע, לקוחות יפסיקו לסמוך עליהן.',
              decoys: ['than', 'trusted'],
              voiceEn: 'Strong principles guide good decisions.',
              voiceHe: 'עקרונות חזקים מנחים החלטות טובות.',
              errorFix: {
                questionEn: 'Which sentence has no mistake?',
                correct: 'If the experiment succeeds, the team will publish the results.',
                wrong: ['If the experiment will succeed, the team will publish the results.', 'Unless the experiment succeeds, the team will publish the results.', 'If the experiment succeeded, the team will publish the results.'],
                explainHe:
                  'אחרי if בתנאי ראשון משתמשים ב-Present Simple. unless פירושו if not ולכן לא מתאים כאן, ו-Past Simple לא מתאים לתוצאה עם will.',
                hintEn: 'Check the tense after if and the meaning of unless.',
              },
              story: {
                passageEn:
                  'A group of researchers followed two hundred teenagers for a year. One half used a language-learning app every day, while the other half studied only with their regular textbooks. At the end of the year, the app users had improved their speaking scores by fifteen percent, but the textbook group had improved by only four percent. Interestingly, the students who combined the app with weekly conversations with a teacher achieved the highest scores of all.',
                passageHe: '',
                questionEn: 'What is the main message of the study?',
                questionHe: '',
                correct: 'Technology works best when it is combined with human contact.',
                wrong: ['Textbooks are more effective than any app.', 'Teachers should be replaced by language apps.', 'Speaking scores cannot be improved in a year.'],
              },
              storyHintEn: 'Which group scored highest of all?',
            },
          },
        },
      },
    ],
  },
];

export const grade10Curriculum = buildHighSchoolGrade('grade-10', units);
