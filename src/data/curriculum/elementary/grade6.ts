import { buildElementaryGrade } from './builder';

/**
 * Grade 6 — Band I (Foundation) completion and bridge to Band II: Present Simple review,
 * Present Progressive intro, was/were and common past verbs, comparatives, Wh-questions,
 * digital vocabulary, school subjects and holidays. 4 units × 3 missions (the 3rd mission
 * of each unit is a Boss review). Hebrew copy is gender-neutral (slash forms / plural).
 */
export const grade6Curriculum = buildElementaryGrade('grade-6', [
  {
    titleEn: 'Unit 1: After-School Creators Club',
    titleHe: 'פרק 1: מועדון היוצרים אחרי בית הספר',
    subtitleHe: 'Present Simple, תחביבים, שעות וימים בשבוע',
    badgeEmoji: '🎨',
    missions: [
      {
        icon: '🎶',
        titleEn: 'Our Weekly Hobby Club',
        titleHe: 'מועדון התחביבים השבועי שלנו',
        storyHookHe: 'מה אתם אוהבים לעשות אחרי הלימודים? נלמד לספר על תחביבים, נגינה ופעילויות!',
        grammarTopic: 'Present Simple & Hobbies',
        skills: ['Present Simple', 'Hobbies Vocab', 'Voice Practice'],
        sentenceEn: 'We usually paint and listen to music on Tuesdays.',
        sentenceHe: 'אנחנו בדרך כלל מציירים ומאזינים למוזיקה בימי שלישי.',
        vocab: [
          ['instrument', 'noun', 'כלי נגינה', '🎸', 'Do you play a musical instrument?', 'האם אתם מנגנים בכלי נגינה?'],
          ['together', 'adverb', 'ביחד', '🤝', 'We walk home together every day.', 'אנחנו הולכים הביתה ביחד כל יום.'],
          ['practice', 'verb / noun', 'להתאמן / תרגול', '🔁', 'Practice makes progress in English.', 'תרגול מוביל להתקדמות באנגלית.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'sandwich', translationHe: 'כריך' },
            { wordEn: 'window', translationHe: 'חלון' },
          ],
          shortSentenceEn: 'We practice together.',
          shortSentenceHe: 'אנחנו מתאמנים ביחד.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'My sister plays the guitar.',
            wrong: ['My sister play the guitar.', 'My sister playing the guitar.'],
            explainHe: 'ב-Present Simple עם he / she / it (גוף שלישי יחיד) מוסיפים s לפועל: My sister plays.',
            hintHe: 'my sister היא she. איזו סיומת מקבל הפועל ב-Present Simple עם she?',
          },
          story: {
            passageEn:
              'Dana goes to the hobby club on Tuesdays. She plays the guitar with her friends. They practice together for one hour. Then they eat fruit and talk.',
            passageHe:
              'דנה הולכת למועדון התחביבים בימי שלישי. היא מנגנת בגיטרה עם החברים שלה. הם מתאמנים ביחד במשך שעה. אחר כך הם אוכלים פירות ומשוחחים.',
            questionEn: 'What does Dana play?',
            questionHe: 'במה דנה מנגנת?',
            correct: 'the guitar',
            wrong: ['the piano', 'the drums'],
          },
        },
      },
      {
        icon: '♟️',
        titleEn: 'Do You Like Chess?',
        titleHe: 'האם אתם אוהבים שחמט?',
        storyHookHe: 'במועדון יש משחקים, ציור ומוזיקה. בואו נשאל שאלות על תחביבים עם Do ו-Does!',
        grammarTopic: 'Do / Does Questions',
        skills: ['Do / Does', 'Hobby Questions', 'Club Vocabulary'],
        sentenceEn: 'Does your brother play chess at the club?',
        sentenceHe: 'האם אחיך משחק שחמט במועדון?',
        vocab: [
          ['chess', 'noun', 'שחמט', '♟️', 'My grandfather teaches me chess.', 'סבא שלי מלמד אותי שחמט.'],
          ['hobby', 'noun', 'תחביב', '🎯', 'Drawing is my favorite hobby.', 'ציור הוא התחביב האהוב עליי.'],
          ['club', 'noun', 'חוג / מועדון', '👥', 'The art club starts at four.', 'חוג האמנות מתחיל בארבע.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'ladder', translationHe: 'סולם' },
            { wordEn: 'envelope', translationHe: 'מעטפה' },
          ],
          shortSentenceEn: 'Do you play chess?',
          shortSentenceHe: 'האם אתם משחקים שחמט?',
          rule: {
            questionEn: 'Which question is correct?',
            correct: 'Does he play chess?',
            wrong: ['Do he play chess?', 'Does he plays chess?'],
            explainHe: 'עם he / she / it שואלים עם Does, ואחרי Does הפועל חוזר לצורתו הבסיסית בלי s: Does he play?',
            hintHe: 'עם he שואלים עם פועל העזר של גוף שלישי, ואחריו הפועל בלי סיומת.',
          },
          story: {
            passageEn:
              'Omer has a new hobby. He plays chess at the club on Mondays. He does not play on Fridays. Omer likes the club and his friends.',
            passageHe:
              'לעומר יש תחביב חדש. הוא משחק שחמט במועדון בימי שני. הוא לא משחק בימי שישי. עומר אוהב את המועדון ואת החברים שלו.',
            questionEn: 'When does Omer play chess?',
            questionHe: 'מתי עומר משחק שחמט?',
            correct: 'on Mondays',
            wrong: ['on Fridays', 'on Sundays'],
          },
        },
      },
      {
        icon: '🗓️',
        isBoss: true,
        titleEn: 'Boss: Club Week Review',
        titleHe: 'אתגר הבוס: שבוע במועדון',
        storyHookHe: 'המועדון עמוס השבוע! הראו שאתם יודעים לתכנן שבוע שלם עם Present Simple, ימים ושעות.',
        grammarTopic: 'Present Simple Review & Time Prepositions',
        skills: ['Present Simple Review', 'Days & Times', 'Reading'],
        sentenceEn: 'We usually check the calendar before the club starts.',
        sentenceHe: 'אנחנו בדרך כלל בודקים את לוח השנה לפני שהמועדון מתחיל.',
        vocab: [
          ['calendar', 'noun', 'לוח שנה', '🗓️', 'The calendar is on the wall.', 'לוח השנה תלוי על הקיר.'],
          ['usually', 'adverb', 'בדרך כלל', '🔁', 'We usually eat lunch at noon.', 'אנחנו בדרך כלל אוכלים צהריים בצהריים.'],
          ['sometimes', 'adverb', 'לפעמים', '🌤️', 'Sometimes I read before bed.', 'לפעמים אני קורא/ת לפני השינה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'bottle', translationHe: 'בקבוק' },
            { wordEn: 'jacket', translationHe: 'מעיל' },
          ],
          shortSentenceEn: 'I check the calendar.',
          shortSentenceHe: 'אני בודק/ת את לוח השנה.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'She usually walks to the club.',
            wrong: ['She walks usually to the club.', 'She usually walk to the club.'],
            explainHe: 'מילות תדירות כמו usually באות לפני הפועל הראשי, ועם she הפועל מקבל s: She usually walks.',
            hintHe: 'מילת תדירות (usually) באה לפני הפועל הראשי, ועם she הפועל מקבל סיומת.',
          },
          story: {
            passageEn:
              'Noa looks at the calendar every Sunday. On Monday she usually paints at the club. On Tuesday she sometimes plays chess. On Wednesday she swims with her team. Noa loves her busy week.',
            passageHe:
              'נועה מסתכלת בלוח השנה בכל יום ראשון. ביום שני היא בדרך כלל מציירת במועדון. ביום שלישי היא לפעמים משחקת שחמט. ביום רביעי היא שוחה עם הקבוצה שלה. נועה אוהבת את השבוע העמוס שלה.',
            questionEn: 'What does Noa usually do on Monday?',
            questionHe: 'מה נועה בדרך כלל עושה ביום שני?',
            correct: 'She paints at the club.',
            wrong: ['She swims with her team.', 'She plays chess.'],
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 2: Junior High Countdown & Digital Skills',
    titleHe: 'פרק 2: ספירה לאחור לחטיבה ועולם דיגיטלי',
    subtitleHe: 'Present Progressive (am/is/are + -ing) מול Present Simple, וטכנולוגיה יומיומית',
    badgeEmoji: '💻',
    missions: [
      {
        icon: '📱',
        titleEn: 'Sending a Quick Voice Note',
        titleHe: 'שולחים הודעה קולית מהירה',
        storyHookHe:
          'מתכוננים לעלייה לחטיבת הביניים! נלמד להבדיל בין פעולה שקורית ברגע זה (now) לבין שגרה קבועה.',
        grammarTopic: 'Present Simple vs. Present Progressive Intro',
        skills: ['Simple vs. Progressive', 'Digital Vocab', 'Voice Messaging'],
        sentenceEn: 'Right now, Dan is recording a fun video for his classmates.',
        sentenceHe: 'ברגע זה, דן מקליט סרטון מהנה לחבריו לכיתה.',
        vocab: [
          ['message', 'noun', 'הודעה', '💬', 'Did you receive my voice message?', 'האם קיבלתם את ההודעה הקולית שלי?'],
          ['record', 'verb', 'להקליט', '🎙️', 'We record English stories for school.', 'אנחנו מקליטים סיפורים באנגלית לבית הספר.'],
          ['prepare', 'verb', 'להתכונן / להכין', '🎒', 'The students prepare for middle school.', 'התלמידים מתכוננים לחטיבת הביניים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'blanket', translationHe: 'שמיכה' },
            { wordEn: 'carrot', translationHe: 'גזר' },
          ],
          shortSentenceEn: 'Dan is recording a message.',
          shortSentenceHe: 'דן מקליט הודעה.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'Maya is drawing right now.',
            wrong: ['Maya draws right now.', 'Maya drawing right now.'],
            explainHe:
              'כשהפעולה קורית ברגע זה (right now) משתמשים ב-am / is / are + פועל עם ing: Maya is drawing.',
            hintHe: 'right now זה ממש עכשיו. לפעולה שקורית עכשיו צריך גם צורה של be וגם פועל עם ing.',
          },
          story: {
            passageEn:
              'Dan is in his room. He usually does his homework at five. Right now he is recording a voice message. He is sending it to his friend.',
            passageHe:
              'דן נמצא בחדר שלו. הוא בדרך כלל עושה שיעורי בית בחמש. ברגע זה הוא מקליט הודעה קולית. הוא שולח אותה לחבר שלו.',
            questionEn: 'What is Dan doing right now?',
            questionHe: 'מה דן עושה ברגע זה?',
            correct: 'recording a message',
            wrong: ['doing his homework', 'riding a bike'],
          },
        },
      },
      {
        icon: '💻',
        titleEn: 'My Laptop and My Password',
        titleHe: 'המחשב הנייד והסיסמה שלי',
        storyHookHe: 'כולנו משתמשים במחשבים ובאתרים! נלמד לדבר על מה שקורה עכשיו מול המסך.',
        grammarTopic: 'Present Progressive & Technology Words',
        skills: ['am / is / are + -ing', 'Technology Vocab', 'Reading'],
        sentenceEn: 'My sister is using the laptop in the living room.',
        sentenceHe: 'אחותי משתמשת במחשב הנייד בסלון.',
        vocab: [
          ['laptop', 'noun', 'מחשב נייד', '💻', 'I carry my laptop in my bag.', 'אני נושא/ת את המחשב הנייד בתיק.'],
          ['password', 'noun', 'סיסמה', '🔑', 'Never share your password.', 'לעולם אל תשתפו את הסיסמה.'],
          ['website', 'noun', 'אתר אינטרנט', '🌐', 'This website has fun games.', 'באתר הזה יש משחקים כיפיים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'umbrella', translationHe: 'מטרייה' },
            { wordEn: 'bicycle', translationHe: 'אופניים' },
          ],
          shortSentenceEn: 'She is using a laptop.',
          shortSentenceHe: 'היא משתמשת במחשב נייד.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'They are using the laptop now.',
            wrong: ['They using the laptop now.', 'They are use the laptop now.'],
            explainHe: 'חייבים להשתמש ב-am / is / are וגם בפועל עם ing: They are using. אי אפשר לדלג על are.',
            hintHe: 'פעולה שקורית עכשיו צריכה שני חלקים: צורה של be ופועל עם ing.',
          },
          story: {
            passageEn:
              'Tom is using a laptop in his room. He is looking for a website about space. First he types his password. Then he reads about the moon.',
            passageHe:
              'תום משתמש במחשב נייד בחדר שלו. הוא מחפש אתר על החלל. קודם הוא מקליד את הסיסמה שלו. אחר כך הוא קורא על הירח.',
            questionEn: 'What is Tom looking for?',
            questionHe: 'מה תום מחפש?',
            correct: 'a website about space',
            wrong: ['a game about animals', 'a video about sports'],
          },
        },
      },
      {
        icon: '🎧',
        isBoss: true,
        titleEn: 'Boss: Digital Day Review',
        titleHe: 'אתגר הבוס: יום דיגיטלי',
        storyHookHe: 'היום כל הכיתה לומדת מהבית! שלבו בין שגרה (Present Simple) לבין מה שקורה עכשיו (Present Progressive).',
        grammarTopic: 'Present Simple vs. Present Progressive Review',
        skills: ['Simple vs. Progressive', 'Digital Vocab', 'Reading'],
        sentenceEn: 'Today the class is learning online with headphones and a screen.',
        sentenceHe: 'היום הכיתה לומדת באופן מקוון עם אוזניות ומסך.',
        vocab: [
          ['headphones', 'noun', 'אוזניות', '🎧', 'I wear headphones when I study.', 'אני עונד/ת אוזניות כשאני לומד/ת.'],
          ['screen', 'noun', 'מסך', '🖥️', 'The screen is big and bright.', 'המסך גדול ובהיר.'],
          ['online', 'adverb', 'באופן מקוון / ברשת', '🌐', 'We meet our teacher online.', 'אנחנו נפגשים עם המורה ברשת.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'spoon', translationHe: 'כף' },
            { wordEn: 'pillow', translationHe: 'כרית' },
          ],
          shortSentenceEn: 'I wear my headphones.',
          shortSentenceHe: 'אני עונד/ת את האוזניות שלי.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'Every day I read, but now I am watching a video.',
            wrong: [
              'Every day I am read, but now I watch a video.',
              'Every day I reading, but now I watching a video.',
            ],
            explainHe:
              'שגרה (every day) מבטאים ב-Present Simple: I read. פעולה ברגע זה (now) מבטאים ב-am / is / are + ing: I am watching.',
            hintHe: 'every day זו שגרה (Present Simple), ו-now זה עכשיו (be + ing). כדאי לבדוק כל חלק בנפרד.',
          },
          story: {
            passageEn:
              'Today the school is closed. Yael is learning online at home. She is wearing headphones and looking at the screen. Usually she walks to school with her friends. Today she is happy to see her teacher on the screen.',
            passageHe:
              'היום בית הספר סגור. יעל לומדת מהבית באופן מקוון. היא עונדת אוזניות ומסתכלת על המסך. בדרך כלל היא הולכת לבית הספר עם החברים שלה. היום היא שמחה לראות את המורה שלה על המסך.',
            questionEn: 'How is Yael learning today?',
            questionHe: 'איך יעל לומדת היום?',
            correct: 'online at home',
            wrong: ['in the classroom', 'on a bus'],
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 3: Last Weekend & Holiday Memories',
    titleHe: 'פרק 3: סוף השבוע שעבר וזיכרונות מהחגים',
    subtitleHe: 'was / were, פעלים נפוצים בעבר, חגים וטיולים',
    badgeEmoji: '🎆',
    missions: [
      {
        icon: '🏖️',
        titleEn: 'Where Were You Last Weekend?',
        titleHe: 'איפה הייתם בסוף השבוע שעבר?',
        storyHookHe: 'מכונת הזמן יוצאת לדרך! נספר איפה היינו אתמול ובסוף השבוע שעבר עם was ו-were.',
        grammarTopic: 'Past Simple of "to be": was / were',
        skills: ['was / were', 'Past Time Words', 'Voice Practice'],
        sentenceEn: 'Last weekend we were at the beach with my cousins.',
        sentenceHe: 'בסוף השבוע שעבר היינו בחוף הים עם בני הדודים שלי.',
        vocab: [
          ['beach', 'noun', 'חוף ים', '🏖️', 'The beach is hot in summer.', 'חוף הים חם בקיץ.'],
          ['yesterday', 'adverb', 'אתמול', '📅', 'Yesterday was a sunny day.', 'אתמול היה יום שמשי.'],
          ['weekend', 'noun', 'סוף שבוע', '🎉', 'We relax on the weekend.', 'אנחנו נחים בסוף השבוע.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'kitchen', translationHe: 'מטבח' },
            { wordEn: 'museum', translationHe: 'מוזיאון' },
          ],
          shortSentenceEn: 'I was at the beach.',
          shortSentenceHe: 'הייתי בחוף הים.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'We were at the beach yesterday.',
            wrong: ['We was at the beach yesterday.', 'We are at the beach yesterday.'],
            explainHe: 'בעבר of to be: was עם I / he / she / it, ו-were עם we / you / they. אתמול זה עבר, לכן אומרים were.',
            hintHe: 'yesterday זה עבר. עם we, איזו צורת עבר של be מתאימה (לא was)?',
          },
          story: {
            passageEn:
              'Last Saturday Eli and his family were at the beach. The water was warm. His cousins were there too. Eli was very tired in the evening.',
            passageHe:
              'בשבת שעברה אלי והמשפחה שלו היו בחוף הים. המים היו חמימים. גם בני הדודים שלו היו שם. בערב אלי היה עייף מאוד.',
            questionEn: "Where was Eli's family last Saturday?",
            questionHe: 'איפה הייתה המשפחה של אלי בשבת שעברה?',
            correct: 'at the beach',
            wrong: ['at the museum', 'at school'],
          },
        },
      },
      {
        icon: '🎇',
        titleEn: 'Holiday Fireworks',
        titleHe: 'זיקוקים בחג',
        storyHookHe: 'החג היה מרגש! נספר מה עשינו בחג עם פעלים בעבר כמו visited ו-watched.',
        grammarTopic: 'Past Simple: Regular Verbs (-ed)',
        skills: ['Past Simple -ed', 'Holiday Vocab', 'Speaking'],
        sentenceEn: 'On the holiday we visited our grandparents and watched fireworks.',
        sentenceHe: 'בחג ביקרנו את הסבא והסבתא וצפינו בזיקוקים.',
        vocab: [
          ['fireworks', 'noun', 'זיקוקים', '🎆', 'The fireworks are bright and loud.', 'הזיקוקים בוהקים ורועשים.'],
          ['grandparents', 'noun', 'סבא וסבתא', '👵', 'My grandparents live in Haifa.', 'סבא וסבתא שלי גרים בחיפה.'],
          ['visit', 'verb', 'לבקר', '🏠', 'We visit our cousins every year.', 'אנחנו מבקרים את בני הדודים בכל שנה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'sandals', translationHe: 'סנדלים' },
            { wordEn: 'carrots', translationHe: 'גזרים' },
          ],
          shortSentenceEn: 'We watched the fireworks.',
          shortSentenceHe: 'צפינו בזיקוקים.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'We visited our grandparents yesterday.',
            wrong: ['We visit our grandparents yesterday.', 'We visiting our grandparents yesterday.'],
            explainHe: 'כדי לדבר על העבר מוסיפים ed לפועל רגיל: visit הופך ל-visited. המילה yesterday מרמזת על עבר.',
            hintHe: 'yesterday מרמזת על עבר. מה מוסיפים לסוף של פועל רגיל בעבר?',
          },
          story: {
            passageEn:
              'On Independence Day Rina visited her grandparents. They ate dinner outside. At night the family watched fireworks. Rina loved the colorful sky.',
            passageHe:
              'ביום העצמאות רינה ביקרה את סבא וסבתא שלה. הם אכלו ארוחת ערב בחוץ. בלילה המשפחה צפתה בזיקוקים. רינה אהבה את השמיים הצבעוניים.',
            questionEn: 'What did the family watch at night?',
            questionHe: 'במה המשפחה צפתה בלילה?',
            correct: 'fireworks',
            wrong: ['a movie', 'a football game'],
          },
        },
      },
      {
        icon: '🎭',
        isBoss: true,
        titleEn: 'Boss: Purim Party Memories',
        titleHe: 'אתגר הבוס: זיכרונות ממסיבת פורים',
        storyHookHe: 'פורים היה כאן לפני רגע! הראו שאתם יודעים לספר על מסיבה בעבר עם was, were ופעלים נוספים.',
        grammarTopic: 'Past Simple Review: was / were & Past Verbs',
        skills: ['was / were', 'Past Verbs', 'Reading'],
        sentenceEn: 'Last Purim my friends were at a party in funny costumes.',
        sentenceHe: 'בפורים שעבר החברים שלי היו במסיבה בתחפושות מצחיקות.',
        vocab: [
          ['costume', 'noun', 'תחפושת', '🎭', 'My costume is red and gold.', 'התחפושת שלי אדומה וזהובה.'],
          ['doughnut', 'noun', 'סופגנייה', '🍩', 'I ate a sweet doughnut.', 'אכלתי סופגנייה מתוקה.'],
          ['party', 'noun', 'מסיבה', '🥳', 'The party was fun.', 'המסיבה הייתה כיפית.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'bucket', translationHe: 'דלי' },
            { wordEn: 'ticket', translationHe: 'כרטיס' },
          ],
          shortSentenceEn: 'I wore a costume.',
          shortSentenceHe: 'לבשתי תחפושת.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'Last Purim I wore a funny costume.',
            wrong: ['Last Purim I wear a funny costume.', 'Last Purim I wearing a funny costume.'],
            explainHe: 'פורים שעבר הוא זמן עבר. לפועל לא רגיל wear יש צורת עבר מיוחדת: wore.',
            hintHe: 'Last Purim זה עבר. wear הוא פועל לא רגיל, עם צורת עבר מיוחדת (בלי ed).',
          },
          story: {
            passageEn:
              'Last Purim was great. Noam wore a funny costume. His friends were at his house for a party. They ate doughnuts and played games. Everyone was happy.',
            passageHe:
              'פורים שעבר היה נהדר. נועם לבש תחפושת מצחיקה. החברים שלו היו אצלו בבית למסיבה. הם אכלו סופגניות ושיחקו במשחקים. כולם היו שמחים.',
            questionEn: "Where were Noam's friends?",
            questionHe: 'איפה היו החברים של נועם?',
            correct: 'at his house',
            wrong: ['at the beach', 'at school'],
          },
        },
      },
    ],
  },
  {
    titleEn: 'Unit 4: Bigger, Better, Ready for Grade 7!',
    titleHe: 'פרק 4: גדולים יותר, טובים יותר, מוכנים לכיתה ז׳!',
    subtitleHe: 'השוואות (bigger, more interesting), מקצועות לימוד, שאלות Wh וסיכום Band I',
    badgeEmoji: '🚀',
    missions: [
      {
        icon: '🐘',
        titleEn: 'Who Is Bigger? Who Is Faster?',
        titleHe: 'מי גדול יותר? מי מהיר יותר?',
        storyHookHe: 'בואו נשווה חיות וחברים! נלמד להגיד bigger, faster ו-than.',
        grammarTopic: 'Comparatives with -er',
        skills: ['Comparatives -er', 'Animal Vocab', 'Voice Practice'],
        sentenceEn: 'An elephant is bigger than a horse.',
        sentenceHe: 'פיל גדול יותר מסוס.',
        vocab: [
          ['elephant', 'noun', 'פיל', '🐘', 'The elephant drinks a lot of water.', 'הפיל שותה הרבה מים.'],
          ['bigger', 'adjective', 'גדול יותר', '📏', 'My bag is bigger than yours.', 'התיק שלי גדול יותר משלך.'],
          ['faster', 'adjective', 'מהיר יותר', '🏃', 'A cheetah is faster than a dog.', 'ברדלס מהיר יותר מכלב.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'butterfly', translationHe: 'פרפר' },
            { wordEn: 'rabbit', translationHe: 'ארנב' },
          ],
          shortSentenceEn: 'A horse is faster.',
          shortSentenceHe: 'סוס מהיר יותר.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'An elephant is bigger than a horse.',
            wrong: ['An elephant is biggest than a horse.', 'An elephant is more big than a horse.'],
            explainHe: 'בשם תואר קצר מוסיפים er כדי להשוות: big הופך ל-bigger (עם b כפולה), ואחריו בא than.',
            hintHe: 'משווים שני דברים (than). לתואר קצר כמו big מוסיפים סיומת, ולפעמים מכפילים אות.',
          },
          story: {
            passageEn:
              "Dan has a small dog and Maya has a big dog. Maya's dog is bigger than Dan's dog. But Dan's dog is faster than Maya's dog. Both dogs love the park.",
            passageHe:
              'לדן יש כלב קטן ולמאיה יש כלב גדול. הכלב של מאיה גדול יותר מהכלב של דן. אבל הכלב של דן מהיר יותר מהכלב של מאיה. שני הכלבים אוהבים את הפארק.',
            questionEn: 'Which dog is faster?',
            questionHe: 'איזה כלב מהיר יותר?',
            correct: "Dan's dog",
            wrong: ["Maya's dog", 'the cat'],
          },
        },
      },
      {
        icon: '🔬',
        titleEn: 'Which Subject Is More Interesting?',
        titleHe: 'איזה מקצוע מעניין יותר?',
        storyHookHe: 'בקרוב בכיתה ז׳ יהיו מקצועות חדשים! נשווה מקצועות עם more interesting ו-more difficult.',
        grammarTopic: 'Comparatives with more + adjective',
        skills: ['more + Adjective', 'School Subjects', 'Reading'],
        sentenceEn: 'Science is more interesting than history for me.',
        sentenceHe: 'מדעים מעניינים יותר מהיסטוריה בשבילי.',
        vocab: [
          ['science', 'noun', 'מדעים', '🔬', 'We do experiments in science.', 'אנחנו עושים ניסויים במדעים.'],
          ['history', 'noun', 'היסטוריה', '🏛️', 'History tells stories about the past.', 'היסטוריה מספרת סיפורים על העבר.'],
          ['interesting', 'adjective', 'מעניין', '🤔', 'This book is very interesting.', 'הספר הזה מעניין מאוד.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'bakery', translationHe: 'מאפייה' },
            { wordEn: 'airport', translationHe: 'שדה תעופה' },
          ],
          shortSentenceEn: 'Science is more interesting.',
          shortSentenceHe: 'מדעים מעניינים יותר.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'Math is more difficult than art.',
            wrong: ['Math is difficulter than art.', 'Math is most difficult than art.'],
            explainHe: 'בשמות תואר ארוכים (difficult, interesting) לא מוסיפים er אלא שמים more לפני התואר, ואחריו than.',
            hintHe: 'difficult הוא תואר ארוך: לא מוסיפים לו סיומת אלא מילה לפניו. ו-most שמור ל-הכי.',
          },
          story: {
            passageEn:
              'Lia has two favorite subjects. She thinks science is more interesting than history. In science class she does experiments with her friends. In history class she only reads the book. Lia wants to be a scientist.',
            passageHe:
              'לליה יש שני מקצועות אהובים. היא חושבת שמדעים מעניינים יותר מהיסטוריה. בשיעור מדעים היא עושה ניסויים עם החברים. בשיעור היסטוריה היא רק קוראת בספר. ליה רוצה להיות מדענית.',
            questionEn: 'Which subject is more interesting for Lia?',
            questionHe: 'איזה מקצוע מעניין יותר בעיני ליה?',
            correct: 'science',
            wrong: ['history', 'math'],
          },
        },
      },
      {
        icon: '🎒',
        isBoss: true,
        titleEn: 'Boss: Ready for Grade 7',
        titleHe: 'אתגר הבוס: מוכנים לכיתה ז׳',
        storyHookHe: 'הגענו לאתגר האחרון של Band I! שאלו שאלות עם How many ו-Why וענו עם because.',
        grammarTopic: 'Wh-Questions: How many / How much / Why',
        skills: ['How many / How much', 'Why & Because', 'Band I Review'],
        sentenceEn: 'How many notebooks are in your backpack today?',
        sentenceHe: 'כמה מחברות יש בתיק שלכם היום?',
        vocab: [
          ['backpack', 'noun', 'תיק גב', '🎒', 'My backpack is blue and heavy.', 'תיק הגב שלי כחול וכבד.'],
          ['notebook', 'noun', 'מחברת', '📓', 'I write new words in my notebook.', 'אני כותב/ת מילים חדשות במחברת.'],
          ['because', 'conjunction', 'כי / בגלל ש', '💡', 'I am happy because it is Friday.', 'אני שמח/ה כי היום יום שישי.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'sofa', translationHe: 'ספה' },
            { wordEn: 'fence', translationHe: 'גדר' },
          ],
          shortSentenceEn: 'How many notebooks are there?',
          shortSentenceHe: 'כמה מחברות יש?',
          rule: {
            questionEn: 'Which question is correct?',
            correct: 'How many books are in the bag?',
            wrong: ['How much books are in the bag?', 'How many book are in the bag?'],
            explainHe: 'עם עצמים שאפשר לספור משתמשים ב-How many ובשם עצם ברבים: books. ל-How much משתמשים עם דברים שלא סופרים, כמו water.',
            hintHe: 'אפשר לספור ספרים? לדברים שסופרים יש מילת שאלה מיוחדת, ושם העצם צריך להיות ברבים.',
          },
          story: {
            passageEn:
              'Tal is ready for Grade 7. Her backpack is heavy because it has five notebooks. It also has three pens and a lunch box. Tal asks her teacher how many books she needs. The teacher says only two.',
            passageHe:
              'טל מוכנה לכיתה ז׳. התיק שלה כבד כי יש בו חמש מחברות. יש בו גם שלושה עטים וקופסת אוכל. טל שואלת את המורה כמה ספרים היא צריכה. המורה אומר שרק שניים.',
            questionEn: "Why is Tal's backpack heavy?",
            questionHe: 'למה התיק של טל כבד?',
            correct: 'Because it has five notebooks.',
            wrong: ['Because it has a big laptop.', 'Because it has ten balls.'],
          },
        },
      },
    ],
  },
]);
