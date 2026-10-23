import { buildMiddleSchoolGrade, type MiddleSchoolUnitSpec } from '../../../middleSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * Core-plus pack, grade 8 ("Season 2"): used to for past habits, then gerunds and infinitives.
 * Builds on units 1–4 (Past Simple & Continuous, will / going to, Present Perfect, First
 * Conditional). The second unit's Boss is the grade's new finale.
 */
const UNITS: MiddleSchoolUnitSpec[] = [
  {
    ...packUnitNumbers('core-plus', 0),
    titleEn: 'Time Capsule: Life Before Smartphones',
    titleHe: 'קפסולת זמן: החיים לפני הסמארטפון',
    subtitleHe: 'עונה 2: used to להרגלים בעבר, didn’t use to ושאלות Did you use to',
    badgeEmoji: '⏪',
    missions: [
      {
        icon: '✉️',
        titleEn: 'Grandpa Used to Write Letters',
        titleHe: 'סבא נהג לכתוב מכתבים',
        storyHookHe:
          'הרפתקאות בונוס! מצאנו קופסה ישנה בבוידעם של סבא וסבתא. נגלה איך חיו פעם, בעזרת used to.',
        grammarTopic: 'used to + Base Verb (Past Habits & States)',
        skills: ['used to', 'Past Habits', 'Then vs. Now'],
        sentenceEn: 'My grandparents used to listen to music on old cassettes in their car.',
        sentenceHe: 'סבא וסבתא שלי נהגו להאזין למוזיקה בקלטות ישנות במכונית שלהם.',
        vocab: [
          ['generation', 'noun', 'דור', '👪', 'Every generation has its own favorite songs.', 'לכל דור יש שירים אהובים משלו.'],
          ['cassette', 'noun', 'קלטת', '📼', 'Dad found a cassette with his school band on it.', 'אבא מצא קלטת עם הלהקה שלו מבית הספר.'],
          ['typewriter', 'noun', 'מכונת כתיבה', '⌨️', 'Grandma wrote her first stories on a typewriter.', 'סבתא כתבה את הסיפורים הראשונים שלה במכונת כתיבה.'],
          ['neighborhood', 'noun', 'שכונה', '🏘️', 'There was only one phone in the whole neighborhood.', 'היה רק טלפון אחד בכל השכונה.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'download', translationHe: 'להוריד (קובץ)' },
            { wordEn: 'satellite', translationHe: 'לוויין' },
          ],
          shortSentenceEn: 'My grandparents used to listen to cassettes.',
          shortSentenceHe: 'סבא וסבתא שלי נהגו להאזין לקלטות.',
          rule: {
            questionEn: 'Complete the sentence: "When Mom was a child, she ____ to school by bus."',
            correct: 'used to go',
            wrong: ['used to going', 'use to went'],
            explainHe:
              'להרגל בעבר משתמשים ב-used to ואחריו פועל בצורת הבסיס (V1): used to go.',
            hintHe: 'מדובר בהרגל שהיה פעם. אחרי המבנה הזה בא פועל בצורת הבסיס, בלי ing ובלי צורת עבר.',
          },
          story: {
            passageEn:
              'Last week, Itai and his grandfather opened an old box in the storage room. Inside, they found letters, photos and a small typewriter. His grandfather explained that people used to write long letters to their friends abroad. A letter used to take two weeks to arrive! Itai laughed and sent a photo of the box to his cousin in seconds.',
            passageHe:
              'בשבוע שעבר איתי וסבא שלו פתחו קופסה ישנה במחסן. בפנים הם מצאו מכתבים, תמונות ומכונת כתיבה קטנה. סבא שלו הסביר שאנשים נהגו לכתוב מכתבים ארוכים לחברים שלהם בחו״ל. למכתב לקח פעם שבועיים להגיע! איתי צחק ושלח תמונה של הקופסה לבן הדוד שלו תוך שניות.',
            questionEn: 'How long did a letter use to take to arrive?',
            questionHe: 'כמה זמן לקח פעם למכתב להגיע?',
            correct: 'Two weeks.',
            wrong: ['Two days.', 'A few seconds.'],
          },
        },
      },
      {
        icon: '👴',
        titleEn: 'Did You Use to Have a Phone?',
        titleHe: 'היה לך פעם טלפון?',
        storyHookHe:
          'ראיון עם סבתא לפרויקט שורשים! נלמד לשאול ולשלול הרגלים מהעבר: Did you use to? ו-didn’t use to.',
        grammarTopic: 'didn’t use to & Did … use to? (Negatives & Questions)',
        skills: ['Did … use to?', 'didn’t use to', 'Roots Project Interview'],
        sentenceEn: 'Did you use to get pocket money when you were my age, Grandma?',
        sentenceHe: 'סבתא, קיבלת דמי כיס כשהיית בגיל שלי?',
        vocab: [
          ['habit', 'noun', 'הרגל', '🔁', 'Reading before bed is a good habit.', 'לקרוא לפני השינה זה הרגל טוב.'],
          ['childhood', 'noun', 'ילדות', '🧒', 'Grandpa spent his childhood in a small village.', 'סבא בילה את ילדותו בכפר קטן.'],
          ['strict', 'adjective', 'קפדן / קפדנית', '📏', 'My piano teacher was very strict about practice.', 'המורה שלי לפסנתר הייתה מאוד קפדנית לגבי אימונים.'],
          ['allowance', 'noun', 'דמי כיס', '🪙', 'I save half of my weekly allowance.', 'אני חוסך/ת חצי מדמי הכיס השבועיים שלי.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'salary', translationHe: 'משכורת' },
            { wordEn: 'lenient', translationHe: 'מקל / סלחן' },
          ],
          shortSentenceEn: 'Did you use to get pocket money?',
          shortSentenceHe: 'קיבלת פעם דמי כיס?',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'We didn’t use to have a computer at home.',
            wrong: ['We didn’t used to have a computer at home.', 'We not used to have a computer at home.'],
            explainHe:
              'בשלילה ובשאלה, אחרי didn’t או Did בא use בלי d: didn’t use to.',
            hintHe: 'אחרי פועל העזר של העבר, הפועל חוזר לצורת הבסיס. בדקו את הסוף של המילה שאחריו.',
          },
          story: {
            passageEn:
              'For her roots project, Lia interviewed her grandmother Rachel. Rachel grew up on a kibbutz in the 1960s. She explained that children didn’t use to sleep at home with their parents. They used to sleep together in a children’s house. Rachel says it was strange at first, but she made friends for life.',
            passageHe:
              'לפרויקט השורשים שלה, ליה ראיינה את סבתה רחל. רחל גדלה בקיבוץ בשנות השישים. היא הסבירה שילדים לא נהגו לישון בבית עם ההורים שלהם. הם נהגו לישון יחד בבית הילדים. רחל אומרת שזה היה מוזר בהתחלה, אבל היא הכירה חברים לכל החיים.',
            questionEn: 'Where did children on the kibbutz use to sleep?',
            questionHe: 'איפה ילדים בקיבוץ נהגו לישון?',
            correct: 'Together in a children’s house.',
            wrong: ['At home with their parents.', 'In tents near the fields.'],
          },
        },
      },
      {
        icon: '🕰️',
        isBoss: true,
        titleEn: 'Boss: The Museum of Old Things',
        titleHe: 'אתגר הבוס: המוזיאון לדברים ישנים',
        storyHookHe:
          'משימת סיכום! סיור במוזיאון שמציג חפצים מפעם. קראו קטע Unseen והראו שאתם שולטים ב-used to, בשלילה ובשאלה.',
        grammarTopic: 'Unit Boss: used to vs. Past Simple in Unseen Reading',
        skills: ['Boss Unseen', 'used to Review', 'Then & Now Discussion'],
        sentenceEn: 'People used to wait days for news, but now we read it in a second.',
        sentenceHe: 'אנשים נהגו לחכות ימים לחדשות, אבל עכשיו אנחנו קוראים אותן בשנייה.',
        vocab: [
          ['decade', 'noun', 'עשור', '📅', 'Phones changed a lot in the last decade.', 'הטלפונים השתנו מאוד בעשור האחרון.'],
          ['nostalgic', 'adjective', 'נוסטלגי / מתגעגע לעבר', '🥹', 'Old songs make my parents feel nostalgic.', 'שירים ישנים גורמים להורים שלי להתגעגע לעבר.'],
          ['transform', 'verb', 'לשנות מן היסוד', '🔄', 'The internet transformed the way we learn.', 'האינטרנט שינה מן היסוד את הדרך שבה אנחנו לומדים.'],
          ['ancestor', 'noun', 'אב קדמון / בן משפחה מדורות קודמים', '🌳', 'My ancestors came from Morocco and Poland.', 'בני המשפחה שלי מדורות קודמים הגיעו ממרוקו ומפולין.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'modern', translationHe: 'מודרני' },
            { wordEn: 'upgrade', translationHe: 'לשדרג' },
          ],
          shortSentenceEn: 'People used to wait for news.',
          shortSentenceHe: 'אנשים נהגו לחכות לחדשות.',
          rule: {
            questionEn: 'Which sentence describes a past habit?',
            correct: 'Dad used to play basketball every evening.',
            wrong: ['Dad is used to play basketball every evening.', 'Dad uses to play basketball every evening.'],
            explainHe:
              'הרגל שהיה בעבר ונגמר: used to + V1, בלי is ובלי s.',
            hintHe: 'ההרגל הזה כבר לא קורה היום. איזו צורה מתארת הרגל מהעבר, בלי פועל עזר של ההווה?',
          },
          story: {
            passageEn:
              'The Museum of Everyday Life in Jerusalem shows objects from the last ten decades. In one room, visitors can see a radio from the 1950s. Many families used to sit around a radio like this every evening to hear the news. In another room, there is a phone with a round dial. Teenagers usually laugh at it, but their grandparents feel nostalgic.',
            passageHe:
              'מוזיאון חיי היומיום בירושלים מציג חפצים מעשרת העשורים האחרונים. באחד החדרים המבקרים יכולים לראות רדיו משנות החמישים. משפחות רבות נהגו לשבת סביב רדיו כזה בכל ערב כדי לשמוע את החדשות. בחדר אחר יש טלפון עם חוגה עגולה. בני נוער בדרך כלל צוחקים עליו, אבל הסבים והסבתות שלהם מתגעגעים לעבר.',
            questionEn: 'Why did many families use to sit around the radio every evening?',
            questionHe: 'מדוע משפחות רבות נהגו לשבת סביב הרדיו בכל ערב?',
            correct: 'To hear the news.',
            wrong: ['To dance to loud music.', 'To repair it together.'],
          },
        },
      },
    ],
  },
  {
    ...packUnitNumbers('core-plus', 1),
    titleEn: 'Passions & Plans: Doing and To Do',
    titleHe: 'תשוקות ותוכניות: לעשות ולעשות',
    subtitleHe: 'עונה 2: Gerunds (enjoy doing) ו-Infinitives (decide to do) — הגמר החדש של כיתה ח׳',
    badgeEmoji: '🎯',
    missions: [
      {
        icon: '🎸',
        titleEn: 'I Enjoy Playing, I Avoid Waiting',
        titleHe: 'אני נהנה/ית לנגן, אני נמנע/ת מלחכות',
        storyHookHe:
          'מה התחביב שלכם? יש פעלים שאחריהם בא פועל עם ing — בדיוק כמו enjoy ו-avoid.',
        grammarTopic: 'Gerunds after enjoy, avoid, mind, finish & consider',
        skills: ['Verb + -ing', 'Gerund as Subject', 'Hobbies Vocab'],
        sentenceEn: 'I enjoy playing the guitar, but I avoid practicing late at night.',
        sentenceHe: 'אני נהנה/ית לנגן בגיטרה, אבל אני נמנע/ת מלהתאמן מאוחר בלילה.',
        vocab: [
          ['avoid', 'verb', 'להימנע מ-', '🚫', 'I avoid eating sweets before training.', 'אני נמנע/ת מלאכול ממתקים לפני אימון.'],
          ['hobby', 'noun', 'תחביב', '🎨', 'Her favorite hobby is making short films.', 'התחביב האהוב עליה הוא ליצור סרטים קצרים.'],
          ['mind', 'verb', 'להתנגד / להפריע ל-', '🤷', 'Do you mind waiting for a few minutes?', 'אכפת לכם לחכות כמה דקות?'],
          ['consider', 'verb', 'לשקול', '🤔', 'We are considering joining the school choir.', 'אנחנו שוקלים להצטרף למקהלת בית הספר.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'ignore', translationHe: 'להתעלם' },
            { wordEn: 'chore', translationHe: 'מטלה בבית' },
          ],
          shortSentenceEn: 'I enjoy playing the guitar.',
          shortSentenceHe: 'אני נהנה/ית לנגן בגיטרה.',
          rule: {
            questionEn: 'Complete the sentence: "Ella finished ____ her science project at midnight."',
            correct: 'writing',
            wrong: ['to write', 'write'],
            explainHe: 'אחרי finish בא פועל עם ing (gerund): finished writing.',
            hintHe: 'יש פעלים שאחריהם הפועל הבא מקבל סיומת מיוחדת. בדקו איך מתנהג הפועל אחרי "לסיים".',
          },
          story: {
            passageEn:
              'Ido is fourteen and he has an unusual hobby: building small boats from recycled bottles. He enjoys spending his weekends at the beach in Ashdod, where he tests his boats. He avoids going on windy days because the boats sink. Now he is considering entering a national competition for young builders.',
            passageHe:
              'עידו בן ארבע-עשרה ויש לו תחביב לא רגיל: לבנות סירות קטנות מבקבוקים ממוחזרים. הוא נהנה לבלות את סופי השבוע שלו בחוף באשדוד, שם הוא בודק את הסירות שלו. הוא נמנע מללכת בימים סוערים כי הסירות טובעות. עכשיו הוא שוקל להירשם לתחרות ארצית לבונים צעירים.',
            questionEn: 'Why does Ido avoid going to the beach on windy days?',
            questionHe: 'מדוע עידו נמנע מללכת לחוף בימים סוערים?',
            correct: 'Because the boats sink.',
            wrong: ['Because the beach is closed.', 'Because his parents are busy.'],
          },
        },
      },
      {
        icon: '🤝',
        titleEn: 'We Decided to Try',
        titleHe: 'החלטנו לנסות',
        storyHookHe:
          'הבטחות, החלטות ותוכניות! אחרי פעלים כמו decide, promise ו-refuse בא to ופועל בצורת הבסיס.',
        grammarTopic: 'Infinitives after decide, promise, refuse, afford & manage',
        skills: ['Verb + to + Verb', 'Gerund vs. Infinitive', 'Making Promises'],
        sentenceEn: 'My brother refused to give up, and he finally managed to fix the old bike.',
        sentenceHe: 'אחי סירב לוותר, ולבסוף הוא הצליח לתקן את האופניים הישנים.',
        vocab: [
          ['refuse', 'verb', 'לסרב', '🙅', 'The goalkeeper refused to leave the field.', 'השוער סירב לעזוב את המגרש.'],
          ['promise', 'verb', 'להבטיח', '🤞', 'I promise to call you after the match.', 'אני מבטיח/ה להתקשר אליך אחרי המשחק.'],
          ['afford', 'verb', 'להרשות לעצמו (כסף)', '💳', 'We can’t afford to buy a new laptop this year.', 'אנחנו לא יכולים להרשות לעצמנו לקנות מחשב נייד חדש השנה.'],
          ['manage', 'verb', 'להצליח (במשהו קשה)', '🧗', 'She managed to climb the wall in two minutes.', 'היא הצליחה לטפס על הקיר בשתי דקות.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'hesitate', translationHe: 'להסס' },
            { wordEn: 'borrow', translationHe: 'לשאול (חפץ)' },
          ],
          shortSentenceEn: 'My brother refused to give up.',
          shortSentenceHe: 'אחי סירב לוותר.',
          rule: {
            questionEn: 'Complete the sentence: "After the storm, the town decided ____ a new bridge."',
            correct: 'to build',
            wrong: ['building', 'build'],
            explainHe: 'אחרי decide בא to ופועל בצורת הבסיס (infinitive): decided to build.',
            hintHe: 'אחרי "להחליט" באנגלית בא מבנה של שתי מילים. איזו אפשרות בנויה כך?',
          },
          story: {
            passageEn:
              'Noam’s youth band wanted to record their first song, but they couldn’t afford to rent a studio. So they decided to turn Noam’s garage into a studio. They promised to keep the noise down after eight o’clock. After two months of hard work, they managed to record three songs, and one of them played on a local radio station.',
            passageHe:
              'להקת הנוער של נועם רצתה להקליט את השיר הראשון שלה, אבל הם לא יכלו להרשות לעצמם לשכור אולפן. אז הם החליטו להפוך את המוסך של נועם לאולפן. הם הבטיחו לא להרעיש אחרי שמונה בערב. אחרי חודשיים של עבודה קשה, הם הצליחו להקליט שלושה שירים, ואחד מהם הושמע בתחנת רדיו מקומית.',
            questionEn: 'What did the band promise to do?',
            questionHe: 'מה הלהקה הבטיחה לעשות?',
            correct: 'To keep the noise down after eight o’clock.',
            wrong: ['To pay for a professional studio.', 'To play every song on the radio.'],
          },
        },
      },
      {
        icon: '🏅',
        isBoss: true,
        titleEn: 'Boss: Teen Changemakers Award',
        titleHe: 'אתגר הבוס: פרס בני הנוער המשנים',
        storyHookHe:
          'הגמר הגדול של כיתה ח׳! קראו על בני נוער שהחליטו לשנות את העולם, והראו שאתם יודעים מתי בא ing ומתי to.',
        grammarTopic: 'Grade 8 Finale: Gerunds vs. Infinitives & used to in Unseen Reading',
        skills: ['Champion Unseen', 'Gerund vs. Infinitive', 'Final Voice Challenge'],
        sentenceEn: 'Shani decided to volunteer at the animal shelter because she loves helping others.',
        sentenceHe: 'שני החליטה להתנדב במקלט לבעלי חיים, כי היא אוהבת לעזור לאחרים.',
        vocab: [
          ['ambition', 'noun', 'שאיפה / יעד גדול', '🌠', 'My ambition is to design video games one day.', 'השאיפה שלי היא לעצב משחקי וידאו יום אחד.'],
          ['volunteer', 'verb', 'להתנדב', '🙋', 'Many teenagers volunteer at hospitals in the summer.', 'בני נוער רבים מתנדבים בבתי חולים בקיץ.'],
          ['determined', 'adjective', 'נחוש / נחושה', '💪', 'He was determined to finish the marathon.', 'הוא היה נחוש לסיים את המרתון.'],
          ['skill', 'noun', 'מיומנות', '🛠️', 'Cooking is a useful skill for life.', 'בישול הוא מיומנות שימושית לחיים.'],
        ],
        seed: {
          wrongWords: [
            { wordEn: 'laziness', translationHe: 'עצלות' },
            { wordEn: 'doubtful', translationHe: 'מפקפק' },
          ],
          shortSentenceEn: 'Shani decided to volunteer.',
          shortSentenceHe: 'שני החליטה להתנדב.',
          rule: {
            questionEn: 'Which sentence is correct?',
            correct: 'Tom wants to join the team, and he enjoys training with them.',
            wrong: [
              'Tom wants joining the team, and he enjoys to train with them.',
              'Tom wants to join the team, and he enjoys to train with them.',
            ],
            explainHe:
              'אחרי want בא to + V1 (wants to join), ואחרי enjoy בא פועל עם ing (enjoys training).',
            hintHe: 'בדקו כל חלק של המשפט בנפרד: לכל אחד משני הפעלים הראשיים יש מבנה קבוע משלו.',
          },
          story: {
            passageEn:
              'Every year, the city of Rishon LeZion gives an award to teenagers who help their community. This year’s winner is Amir, who is fifteen. He used to spend hours playing computer games alone. Then he decided to teach older people how to use smartphones. Now he volunteers twice a week, and more than sixty grandparents can video-call their families.',
            passageHe:
              'בכל שנה העיר ראשון לציון מעניקה פרס לבני נוער שעוזרים לקהילה שלהם. הזוכה השנה הוא אמיר, בן חמש-עשרה. פעם הוא נהג לבלות שעות במשחקי מחשב לבד. ואז הוא החליט ללמד אנשים מבוגרים איך להשתמש בסמארטפונים. עכשיו הוא מתנדב פעמיים בשבוע, ויותר משישים סבים וסבתות יכולים לשוחח בשיחות וידאו עם המשפחות שלהם.',
            questionEn: 'What did Amir decide to do?',
            questionHe: 'מה אמיר החליט לעשות?',
            correct: 'To teach older people how to use smartphones.',
            wrong: ['To build a new computer game.', 'To move to another city.'],
          },
        },
      },
    ],
  },
];

export const CORE_PLUS_GRADE_8_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildMiddleSchoolGrade('grade-8', UNITS);
