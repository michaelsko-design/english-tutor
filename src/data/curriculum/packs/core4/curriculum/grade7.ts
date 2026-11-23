import { buildMiddleSchoolGrade, type MiddleSchoolUnitSpec } from '../../../middleSchool/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-4 grade 7 unit (Band II): defining relative clauses with that / which for things and
 * who for people, about inventions and inventors, with Band II Core I words the app never taught
 * or taught only later. Example Hebrew addresses the learner in the plural; hints and
 * explanations are gender-neutral plural.
 */
const UNIT_CORE_4: MiddleSchoolUnitSpec = {
  ...packUnitNumbers('core-4'),
  titleEn: 'Inventions',
  titleHe: 'המצאות',
  subtitleHe: 'עונה 4: מתארים המצאות וממציאים עם who, which ו-that',
  badgeEmoji: '💡',
  missions: [
    {
      icon: '🤖',
      titleEn: 'A Machine That…',
      titleHe: 'מכונה ש…',
      storyHookHe:
        'איך מתארים המצאה? מחברים לשם העצם משפט שמסביר אותו: a machine that talks, an app which helps me. לדברים משתמשים ב-that או which.',
      grammarTopic: 'Defining relative clauses: that / which (things)',
      skills: ['that / which', 'Relative Clauses', 'Technology'],
      sentenceEn: 'The phone is an invention that changed the world.',
      sentenceHe: 'הטלפון הוא המצאה ששינתה את העולם.',
      vocab: [
        ['technology', 'noun', 'טכנולוגיה', '💻', 'We need technology that saves water.', 'אנחנו צריכים טכנולוגיה שחוסכת מים.'],
        ['software', 'noun', 'תוכנה', '🖥️', 'This is the software that my brother wrote.', 'זו התוכנה שאחי כתב.'],
        ['click', 'verb', 'ללחוץ (בעכבר)', '⌨️', 'You need to click the icon that looks like a star.', 'צריך ללחוץ על הסמל שנראה כמו כוכב.'],
        ['emoji', 'noun', 'אימוג׳י', '😄', 'She sent me an emoji that has a big smile.', 'היא שלחה לי אימוג׳י שיש לו חיוך גדול.'],
        ['virus', 'noun', 'וירוס', '🦠', 'A computer virus is a program that damages files.', 'וירוס מחשב הוא תוכנה שפוגעת בקבצים.'],
        ['error', 'noun', 'שגיאה', '❌', 'There is an error in the code that I wrote, so the app doesn\'t work.', 'יש שגיאה בקוד שכתבתי, אז האפליקציה לא עובדת.'],
        ['option', 'noun', 'אפשרות', '🔀', 'Choose the option that you like best.', 'בחרו את האפשרות שאתם הכי אוהבים.'],
        ['maximum', 'noun', 'מקסימום / הכי הרבה', '📈', 'The robot which we built can carry a maximum of two kilos.', 'הרובוט שבנינו יכול לשאת מקסימום שני קילו.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'eyebrow', translationHe: 'גבה' },
          { wordEn: 'bucket', translationHe: 'דלי' },
        ],
        shortSentenceEn: 'This is the robot that talks.',
        shortSentenceHe: 'זה הרובוט שמדבר.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'This is the app that helps me study.',
          wrong: ['This is the app who helps me study.', 'This is the app that it helps me study.'],
          explainHe: 'לדברים משתמשים ב-that או ב-which (לא who). אחרי that לא חוזרים על it.',
          hintHe: 'בדקו את מילת החיבור לדבר, והאם יש מילה מיותרת.',
        },
        story: {
          passageEn:
            'In 1876, Alexander Graham Bell made a machine that could carry a voice over a wire. People called it the telephone. Today we have smartphones that can do much more: we can send an emoji, take photos and use software that teaches English!',
          passageHe:
            'בשנת 1876 אלכסנדר גרהם בל בנה מכונה שיכלה להעביר קול דרך חוט. אנשים קראו לה טלפון. היום יש לנו טלפונים חכמים שיכולים לעשות הרבה יותר: אפשר לשלוח אימוג׳י, לצלם ולהשתמש בתוכנה שמלמדת אנגלית!',
          questionEn: 'What could Bell\'s machine do?',
          questionHe: 'מה יכלה המכונה של בל לעשות?',
          correct: 'Carry a voice over a wire.',
          wrong: ['Send an emoji.', 'Take photos.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which word fits? A robot is a machine ___ can work.',
              correct: 'that',
              wrong: ['who'],
              explainHe: 'למכונה (דבר) משתמשים ב-that.',
              hintHe: 'robot הוא אדם או דבר?',
            },
            story: {
              passageEn: 'Dana has a watch that counts her steps. Today she walked 8,000 steps.',
              passageHe: 'לדנה יש שעון שסופר את הצעדים שלה. היום היא הלכה 8,000 צעדים.',
              questionEn: 'What does Dana\'s watch count?',
              questionHe: 'מה סופר השעון של דנה?',
              correct: 'Her steps.',
              wrong: ['Her money.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['click', 'maximum'],
              ['click', 'realize'],
              ['software', 'virus'],
              ['option', 'error'],
              ['emoji', 'click'],
              ['advantage', 'option'],
              ['click', 'realize'],
              ['click', 'emoji'],
            ],
          },
          master: {
            sentenceEn: 'Engineers are building cars that can drive themselves.',
            sentenceHe: 'מהנדסים בונים מכוניות שיכולות לנהוג בעצמן.',
            decoys: ['who', 'drives'],
            voiceEn: 'I use an app that checks my spelling.',
            voiceHe: 'אני משתמש/ת באפליקציה שבודקת את האיות שלי.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'The robot that won the prize was made by kids.',
              wrong: [
                'The robot who won the prize was made by kids.',
                'The robot that it won the prize was made by kids.',
                'The robot that won the prize were made by kids.',
              ],
              explainHe: 'לדבר: that (לא who), בלי it אחרי that, ועם robot אחד אומרים was.',
              hintEn: 'Check that, it and was.',
            },
            story: {
              passageEn:
                'Last year, students from a school near the sea built a small robot which could find plastic on the beach. At first the robot had an error that made it pick up shells, too. The students changed the software, and the robot worked. Now the school\'s robots clean the beach every week.',
              passageHe: '',
              questionEn: 'Why did the students change the software?',
              questionHe: '',
              correct: 'The robot was picking up shells by mistake.',
              wrong: ['The robot was too slow.', 'The city wanted a bigger robot.', 'The beach had no plastic.'],
            },
            storyHintEn: 'What was the error?',
          },
        },
      },
    },
    {
      icon: '👷',
      titleEn: 'The Person Who…',
      titleHe: 'האדם ש…',
      storyHookHe: 'מי עומד מאחורי ההמצאות? לאנשים משתמשים ב-who: the woman who invented…, the boy who built…',
      grammarTopic: 'Defining relative clauses: who (people)',
      skills: ['who', 'Relative Clauses', 'Inventors'],
      sentenceEn: 'Marie Curie was a scientist who won two Nobel Prizes.',
      sentenceHe: 'מארי קירי הייתה מדענית שזכתה בשני פרסי נובל.',
      vocab: [
        ['secretary', 'noun', 'מזכיר / מזכירה', '🧑‍💼', 'The secretary who works at our school knows every student.', 'המזכיר שעובד בבית הספר שלנו מכיר כל תלמיד.'],
        ['director', 'noun', 'במאי / מנהל', '🎬', 'The director who made this movie is from Israel.', 'הבמאית שעשתה את הסרט הזה היא מישראל.'],
        ['advantage', 'noun', 'יתרון', '👍', 'The big advantage of this phone is the camera.', 'היתרון הגדול של הטלפון הזה הוא המצלמה.'],
        ['quality', 'noun', 'איכות', '💎', 'People who buy this bike say its quality is excellent.', 'אנשים שקונים את האופניים האלה אומרים שהאיכות שלהם מצוינת.'],
        ['realize', 'verb', 'להבין / לקלוט', '💡', 'I didn\'t realize that the woman who helped me was a famous inventor.', 'לא הבנתי שהאישה שעזרה לי הייתה ממציאה מפורסמת.'],
        ['trouble', 'noun', 'צרה / בעיה', '⚠️', 'The boy who broke the window is in trouble.', 'הילד ששבר את החלון בצרות.'],
        ['somehow', 'adverb', 'איכשהו', '🤷', 'The man who lost his keys somehow got into the house.', 'האיש שאיבד את המפתחות איכשהו נכנס לבית.'],
        ['surely', 'adverb', 'בוודאי / בטוח', '💯', 'The person who invented the wheel was surely very clever.', 'האדם שהמציא את הגלגל היה בוודאי חכם מאוד.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'saucepan', translationHe: 'סיר' },
          { wordEn: 'puddle', translationHe: 'שלולית' },
        ],
        shortSentenceEn: 'She is the girl who won.',
        shortSentenceHe: 'היא הילדה שניצחה.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'The woman who invented this game is my aunt.',
          wrong: ['The woman which invented this game is my aunt.', 'The woman who she invented this game is my aunt.'],
          explainHe: 'לאנשים משתמשים ב-who (או that), לא ב-which. אחרי who לא חוזרים על she.',
          hintHe: 'האם מדובר באדם או בדבר? ויש מילה מיותרת?',
        },
        story: {
          passageEn:
            'Hedy Lamarr was a famous movie star who was also an inventor. During World War II, she worked on an idea for sending secret radio signals. Few people realized how clever she was. Some people say that Wi-Fi and Bluetooth use ideas like hers.',
          passageHe:
            'הדי למאר הייתה כוכבת קולנוע מפורסמת שהייתה גם ממציאה. במלחמת העולם השנייה היא עבדה על רעיון לשליחת אותות רדיו סודיים. מעט אנשים הבינו כמה היא חכמה. יש אומרים שטכנולוגיות כמו Wi-Fi ו-Bluetooth משתמשות ברעיונות דומים לשלה.',
          questionEn: 'When did Hedy Lamarr work on her idea?',
          questionHe: 'מתי הדי למאר עבדה על הרעיון שלה?',
          correct: 'During World War II.',
          wrong: ['Last year.', 'When she was a child.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which word fits? My teacher is the person ___ helps me most.',
              correct: 'who',
              wrong: ['which'],
              explainHe: 'לאדם משתמשים ב-who.',
              hintHe: 'teacher הוא אדם או דבר?',
            },
            story: {
              passageEn: 'Ben has a friend who builds robots. His friend\'s newest robot can dance!',
              passageHe: 'לבן יש חבר שבונה רובוטים. הרובוט החדש ביותר של החבר יודע לרקוד!',
              questionEn: 'What can the newest robot do?',
              questionHe: 'מה הרובוט החדש יודע לעשות?',
              correct: 'Dance.',
              wrong: ['Swim.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['somehow', 'surely'],
              ['realize', 'somehow'],
              ['surely', 'realize'],
              ['somehow', 'realize'],
              ['quality', 'trouble'],
              ['surely', 'secretary'],
              ['quality', 'trouble'],
              ['trouble', 'secretary'],
            ],
          },
          master: {
            sentenceEn: 'The girl who designed this app is only fourteen years old.',
            sentenceHe: 'הנערה שעיצבה את האפליקציה הזאת היא רק בת ארבע עשרה.',
            decoys: ['which', 'are'],
            voiceEn: 'I know a man who repairs old radios.',
            voiceHe: 'אני מכיר/ה איש שמתקן מכשירי רדיו ישנים.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'The people who live next door have a 3D printer.',
              wrong: [
                'The people which live next door have a 3D printer.',
                'The people who lives next door have a 3D printer.',
                'The people who they live next door have a 3D printer.',
              ],
              explainHe: 'לאנשים who; people הם רבים, אז live בלי s; ואין they אחרי who.',
              hintEn: 'Check who, live and they.',
            },
            story: {
              passageEn:
                'Ori\'s grandmother was an engineer who designed water pipes for farms. When Ori had trouble with a science project, he called her. Grandma did not give him the answer. Instead, she asked questions which made Ori think. Somehow, by the end of the call, Ori had a new plan for his project.',
              passageHe: '',
              questionEn: 'How did Grandma help Ori?',
              questionHe: '',
              correct: 'She asked questions that helped Ori think.',
              wrong: ['She gave Ori the answer.', 'She built the project for Ori.', 'She bought Ori new pipes.'],
            },
            storyHintEn: 'What did Grandma do instead of giving the answer?',
          },
        },
      },
    },
    {
      icon: '🏆',
      isBoss: true,
      titleEn: 'Boss: The Invention Fair',
      titleHe: 'אתגר הבוס: תערוכת ההמצאות',
      storyHookHe: 'תערוכת ההמצאות פתוחה! תארו את ההמצאות ואת האנשים שבנו אותן עם who, which ו-that.',
      grammarTopic: 'Defining relative clauses: Review',
      skills: ['who / which / that', 'Inventions', 'Review'],
      sentenceEn: 'The team that wins at the fair will visit a real lab.',
      sentenceHe: 'הקבוצה שתנצח בתערוכה תבקר במעבדה אמיתית.',
      vocab: [
        ['information technology', 'noun', 'טכנולוגיית מידע (IT)', '💻', 'My cousin studies information technology at college.', 'בן הדוד שלי לומד טכנולוגיית מידע במכללה.'],
        ['standard', 'adjective', 'רגיל / סטנדרטי', '📏', 'This is a standard battery that fits most toys.', 'זו סוללה רגילה שמתאימה לרוב הצעצועים.'],
        ['limit', 'noun', 'הגבלה / גבול', '🛑', 'There is a time limit of five minutes for each team.', 'יש הגבלת זמן של חמש דקות לכל קבוצה.'],
        ['reasonable', 'adjective', 'סביר', '⚖️', 'The price of the robot that they sell is reasonable.', 'המחיר של הרובוט שהם מוכרים סביר.'],
        ['according to', 'phrase', 'לפי', '📰', 'The team that wins gets a trophy, according to the rules.', 'הקבוצה שמנצחת מקבלת גביע, לפי החוקים.'],
        ['as soon as', 'phrase', 'ברגע ש...', '⚡', 'We will start as soon as the judges arrive.', 'נתחיל ברגע שהשופטים יגיעו.'],
        ['let me know', 'phrase', 'תודיעו לי', '📬', 'Please let me know when your invention is ready.', 'תודיעו לי בבקשה כשההמצאה שלכם מוכנה.'],
        ['at present', 'phrase', 'כרגע', '⏱️', 'Our robot works well at present, but we want to improve it.', 'הרובוט שלנו עובד טוב כרגע, אבל אנחנו רוצים לשפר אותו.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'eyelash', translationHe: 'ריס' },
          { wordEn: 'sandcastle', translationHe: 'ארמון חול' },
        ],
        shortSentenceEn: 'This is the robot that won.',
        shortSentenceHe: 'זה הרובוט שניצח.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'The girls who built the drone are in my class.',
          wrong: ['The girls which built the drone are in my class.', 'The girls who built the drone is in my class.'],
          explainHe: 'לאנשים משתמשים ב-who. הנושא הוא the girls (רבים), אז are.',
          hintHe: 'בדקו את מילת החיבור ואת is או are.',
        },
        story: {
          passageEn:
            'Our school had an invention fair last week. According to the rules, every team had a time limit of three minutes to show its invention. The team that won built a water filter at a reasonable price. As soon as the judges tasted the clean water, they smiled.',
          passageHe:
            'בשבוע שעבר הייתה בבית הספר שלנו תערוכת המצאות. לפי החוקים, לכל קבוצה הייתה הגבלת זמן של שלוש דקות להציג את ההמצאה שלה. הקבוצה שניצחה בנתה מסנן מים במחיר סביר. ברגע שהשופטים טעמו את המים הנקיים, הם חייכו.',
          questionEn: 'What did the winning team build?',
          questionHe: 'מה בנתה הקבוצה המנצחת?',
          correct: 'A water filter.',
          wrong: ['A robot.', 'A phone app.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which word fits? This is the boy ___ won the prize.',
              correct: 'who',
              wrong: ['which'],
              explainHe: 'לאדם משתמשים ב-who.',
              hintHe: 'boy הוא אדם או דבר?',
            },
            story: {
              passageEn: 'Maya made a lamp that turns on when you clap. Everyone at the fair loved it.',
              passageHe: 'מאיה הכינה מנורה שנדלקת כשמוחאים כפיים. כולם בתערוכה אהבו אותה.',
              questionEn: 'When does the lamp turn on?',
              questionHe: 'מתי המנורה נדלקת?',
              correct: 'When you clap.',
              wrong: ['When you sing.'],
            },
          },
          challenger: {
            clozeWrong: [
              ['as soon as', 'let me know'],
              ['according to', 'at present'],
              ['reasonable', 'as soon as'],
              ['as soon as', 'according to'],
              ['as soon as', 'limit'],
              ['limit', 'reasonable'],
              ['at present', 'standard'],
              ['standard', 'limit'],
            ],
          },
          master: {
            sentenceEn: 'Please let me know as soon as the judges choose the winner.',
            sentenceHe: 'תודיעו לי בבקשה ברגע שהשופטים יבחרו את המנצח.',
            decoys: ['chooses', 'who'],
            voiceEn: 'The invention that I like most is the bicycle.',
            voiceHe: 'ההמצאה שאני הכי אוהב/ת היא האופניים.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'The app which we made won second place.',
              wrong: [
                'The app who we made won second place.',
                'The app which we made it won second place.',
                'The app which we made win second place.',
              ],
              explainHe: 'לדבר which או that, בלי it אחרי made, ובעבר won.',
              hintEn: 'Check which, it and won.',
            },
            story: {
              passageEn:
                'At present, Noam is building a smart bin which opens when you walk past it. He wants to enter it in the national invention fair. According to the fair\'s website, every invention must cost less than 200 shekels. Noam\'s bin costs 250 shekels, so he is looking for cheaper parts.',
              passageHe: '',
              questionEn: 'Why is Noam looking for cheaper parts?',
              questionHe: '',
              correct: 'His bin costs more than the fair allows.',
              wrong: ['His bin does not open.', 'The fair is next week.', 'He wants to sell the bin.'],
            },
            storyHintEn: 'What does the website say about the cost?',
          },
        },
      },
    },
  ],
};

/** The core-4 pack's grade 7 unit (`../../registry.ts`) */
export const CORE_4_GRADE_7_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildMiddleSchoolGrade('grade-7', [UNIT_CORE_4]);
