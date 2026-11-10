import { buildElementaryGrade, type ElementaryUnitSpec } from '../../../elementary/builder';
import type { GradeCurriculumPack } from '../../../types';
import { packUnitNumbers } from '../../units';

/**
 * The core-3 grade 5 unit (Band I): the future with will (predictions) and Will you…? questions
 * with the short answers (Yes, I will / No, I won't), about the learner's future, with Band I
 * words the app never taught or taught only later. Example Hebrew uses slash forms ("אהיה
 * מבוגר/ת"); hints and explanations are gender-neutral plural.
 */
const UNIT_CORE_3: ElementaryUnitSpec = {
  ...packUnitNumbers('core-3'),
  titleEn: 'Future Me',
  titleHe: 'אני בעתיד',
  subtitleHe: 'עונה 3: מדברים על העתיד עם will, ושואלים Will you…?',
  badgeEmoji: '🔮',
  missions: [
    {
      icon: '🚀',
      titleEn: 'One Day I Will…',
      titleHe: 'יום אחד אני…',
      storyHookHe: 'מה יקרה בעוד עשרים שנה? נלמד לדבר על העתיד עם will: I will travel, It will be…',
      grammarTopic: 'will + verb (predictions)',
      skills: ['will', 'Future', 'Predictions'],
      sentenceEn: 'When I am an adult, I will speak three languages.',
      sentenceHe: 'כשאהיה מבוגר/ת, אדבר שלוש שפות.',
      vocab: [
        ['adult', 'noun', 'מבוגר', '👨‍💼', 'When I am an adult, I will live in a big city.', 'כשאהיה מבוגר/ת, אגור בעיר גדולה.'],
        ['world', 'noun', 'עולם', '🌍', 'One day I will see the whole world.', 'יום אחד אראה את כל העולם.'],
        ['language', 'noun', 'שפה', '🗣️', 'Spanish is a beautiful language.', 'ספרדית היא שפה יפה.'],
        ['speak', 'verb', 'לדבר (שפה)', '💬', 'In the future, I will speak Chinese.', 'בעתיד אדבר סינית.'],
        ['rich', 'adjective', 'עשיר', '💰', 'Maybe I will be rich one day.', 'אולי אהיה עשיר/ה יום אחד.'],
        ['cellphone', 'noun', 'טלפון נייד', '📱', 'My cellphone will be very small in the future.', 'הטלפון הנייד שלי יהיה קטן מאוד בעתיד.'],
        ['somewhere', 'adverb', 'למקום כלשהו / איפשהו', '❔', 'Next summer we will go somewhere hot.', 'בקיץ הבא ניסע למקום חם כלשהו.'],
        ['everywhere', 'adverb', 'בכל מקום', '🌎', 'In the future, there will be robots everywhere.', 'בעתיד יהיו רובוטים בכל מקום.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'pillow', translationHe: 'כרית' },
          { wordEn: 'onion', translationHe: 'בצל' },
        ],
        shortSentenceEn: 'I will be an adult.',
        shortSentenceHe: 'אני אהיה מבוגר/ת.',
        rule: {
          questionEn: 'Which sentence is correct?',
          correct: 'One day I will speak English well.',
          wrong: ['One day I will speaks English well.', 'One day I wills speak English well.'],
          explainHe: 'אחרי will בא הפועל בצורה הבסיסית, בלי s: will speak. גם will עצמו לא מקבל s.',
          hintHe: 'מה קורה לפועל שבא אחרי will?',
        },
        story: {
          passageEn:
            'Ella thinks about the future. "When I am an adult, I will travel around the world," she says. "I will speak three languages, and I will have a big dog." Her brother laughs. "And I will be rich!"',
          passageHe:
            'אלה חושבת על העתיד. "כשאהיה מבוגרת, אטייל מסביב לעולם," היא אומרת. "אדבר שלוש שפות, ויהיה לי כלב גדול." אחיה צוחק. "ואני אהיה עשיר!"',
          questionEn: 'How many languages will Ella speak?',
          questionHe: 'כמה שפות אלה תדבר?',
          correct: 'three',
          wrong: ['two', 'four'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence talks about the future?',
              correct: 'I will be a doctor.',
              wrong: ['I am a doctor.'],
              explainHe: 'will מראה שזה יקרה בעתיד.',
              hintHe: 'איזו מילה מספרת על העתיד?',
            },
            story: {
              passageEn: 'Tom has a new cellphone. He says, "One day I will have a robot, too!"',
              passageHe: 'לתום יש טלפון נייד חדש. הוא אומר: "יום אחד יהיה לי גם רובוט!"',
              questionEn: 'What does Tom have now?',
              questionHe: 'מה יש לתום עכשיו?',
              correct: 'a cellphone',
              wrong: ['a robot'],
            },
          },
          challenger: {
            clozeWrong: [
              ['apple', 'egg'],
              ['sleep', 'happy'],
              ['sing', 'under'],
              ['chair', 'green'],
              ['table', 'eat'],
              ['sing', 'jump'],
              ['apple', 'happy'],
              ['yesterday', 'banana'],
            ],
          },
          master: {
            sentenceEn: 'In twenty years, I will live somewhere near the sea.',
            sentenceHe: 'בעוד עשרים שנה, אגור איפשהו ליד הים.',
            decoys: ['lives', 'am'],
            voiceEn: 'Maybe one day I will be rich.',
            voiceHe: 'אולי יום אחד אהיה עשיר/ה.',
            errorFix: {
              questionEn: 'Which sentence has no mistake?',
              correct: 'It will be hot tomorrow.',
              wrong: ['It will is hot tomorrow.', 'It wills be hot tomorrow.', 'It will being hot tomorrow.'],
              explainHe: 'אחרי will בא be (ולא is או being): It will be hot.',
              hintEn: 'Look at the verb after will.',
            },
            story: {
              passageEn:
                'Mr. Levi asks his class to write about life in the year 2050. Noa writes, "Cars will fly, and every home will have a robot." Ari writes, "People will live on the moon." Mr. Levi reads them and smiles. "Good ideas! But will people still need teachers?" Everybody laughs. "Yes, they will!"',
              passageHe: '',
              questionEn: 'What does the class write about?',
              questionHe: '',
              correct: 'Life in the future.',
              wrong: ['Their teacher, Mr. Levi.', 'A trip to the moon last year.', 'Robots at school today.'],
            },
            storyHintEn: 'Look at the year in the first sentence.',
          },
        },
      },
    },
    {
      icon: '💭',
      titleEn: 'Will You…? Yes, I Will!',
      titleHe: 'שואלים על העתיד: Will you…?',
      storyHookHe: 'שואלים חברים על העתיד! נלמד לשאול Will you…? ולענות Yes, I will או No, I won\'t.',
      grammarTopic: "will questions: Will you …? Yes, I will. / No, I won't.",
      skills: ['Will you…?', 'Short Answers', 'Future'],
      sentenceEn: 'Will you be a singer in a band?',
      sentenceHe: 'אתם תהיו זמרים בלהקה?',
      vocab: [
        ['begin', 'verb', 'להתחיל', '🏁', 'When will the show begin?', 'מתי ההופעה תתחיל?'],
        ['boat', 'noun', 'סירה', '🚢', 'Will we go on a boat tomorrow?', 'ניסע מחר בסירה?'],
        ['singer', 'noun', 'זמר', '🎤', 'My sister will be a famous singer.', 'אחותי תהיה זמרת מפורסמת.'],
        ['band', 'noun', 'להקה', '🎸', 'Will your band play at the party?', 'הלהקה שלך תנגן במסיבה?'],
        ['telephone', 'noun', 'טלפון', '☎️', 'Will people still have a telephone at home?', 'לאנשים עוד יהיה טלפון בבית?'],
        ['bake', 'verb', 'לאפות', '🧁', 'Will you bake a cake for my birthday?', 'תאפו עוגה ליום ההולדת שלי?'],
        ['river', 'noun', 'נהר', '🏞️', 'Will we swim in the river?', 'נשחה בנהר?'],
        ['try', 'verb', 'לנסות', '🪜', 'Will you try the new game with me?', 'תנסו איתי את המשחק החדש?'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'carrot', translationHe: 'גזר' },
          { wordEn: 'lamp', translationHe: 'מנורה' },
        ],
        shortSentenceEn: 'Will you bake a cake?',
        shortSentenceHe: 'אתם תאפו עוגה?',
        rule: {
          questionEn: 'Which question is correct?',
          correct: 'Will you play in the band?',
          wrong: ['Will you to play in the band?', 'Will you plays in the band?'],
          explainHe: 'שאלה על העתיד מתחילה ב-Will, אחר כך you, ואז הפועל בצורה הבסיסית: Will you play…?',
          hintHe: 'במה מתחילה השאלה? ומה בא אחרי Will you?',
        },
        story: {
          passageEn:
            'Dan and Lea plan a trip. Lea asks, "Will we go on a boat on the river?" Dan says, "Yes, we will!" Lea asks, "Will we swim?" Dan says, "No, we won\'t. The water is too cold."',
          passageHe:
            'דן ולאה מתכננים טיול. לאה שואלת: "ניסע בסירה על הנהר?" דן אומר: "כן!" לאה שואלת: "נשחה?" דן אומר: "לא. המים קרים מדי."',
          questionEn: "Why won't they swim?",
          questionHe: 'למה הם לא ישחו?',
          correct: 'The water is cold.',
          wrong: ['They have no boat.', 'The river is far away.'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Someone asks, Will you come to my party? You want to come. What do you say?',
              correct: 'Yes, I will.',
              wrong: ['Yes, I do.'],
              explainHe: 'על שאלה עם Will עונים בקצרה עם will: Yes, I will או No, I won\'t.',
              hintHe: 'איזו מילה מהשאלה חוזרת בתשובה?',
            },
            story: {
              passageEn: 'Omer will be a singer. He sings every day. His band will play at school.',
              passageHe: 'עומר יהיה זמר. הוא שר כל יום. הלהקה שלו תנגן בבית הספר.',
              questionEn: 'Where will the band play?',
              questionHe: 'איפה הלהקה תנגן?',
              correct: 'at school',
              wrong: ['at home'],
            },
          },
          challenger: {
            clozeWrong: [
              ['apple', 'happy'],
              ['sleep', 'green'],
              ['eat', 'under'],
              ['spoon', 'tall'],
              ['eat', 'tall'],
              ['chair', 'blue'],
              ['eat', 'happy'],
              ['table', 'sleep'],
            ],
          },
          master: {
            sentenceEn: 'Will the workers finish the new road next year?',
            sentenceHe: 'הפועלים יסיימו את הכביש החדש בשנה הבאה?',
            decoys: ['finishes', "won't"],
            voiceEn: "No, I won't bake a cake today.",
            voiceHe: 'לא, אני לא אאפה עוגה היום.',
            errorFix: {
              questionEn: 'Which question has no mistake?',
              correct: 'When will the game begin?',
              wrong: ['When the game will begin?', 'When will the game begins?', 'When will begin the game?'],
              explainHe: 'בשאלה עם When בא קודם will, אחר כך the game, ואז begin בלי s.',
              hintEn: 'Check the order of will and the game.',
            },
            story: {
              passageEn:
                'Maya wants to bake a big cake for the class party, but she is worried. "Will it be ready in time?" she asks her dad. "The party will begin at ten." Dad looks at the clock. "It is eight now. The cake needs one hour in the oven." Maya smiles and starts to work.',
              passageHe: '',
              questionEn: 'Why does Maya smile?',
              questionHe: '',
              correct: 'There is enough time.',
              wrong: ['The party is at eight.', 'Dad will bake the cake.', 'The cake is already in the oven.'],
            },
            storyHintEn: 'Compare the time now and the party time.',
          },
        },
      },
    },
    {
      icon: '🎓',
      isBoss: true,
      titleEn: 'Boss: My Future Plan',
      titleHe: 'אתגר הבוס: התוכנית שלי לעתיד',
      storyHookHe: 'כותבים מכתב לעצמכם בעתיד! הראו שאתם יודעים לספר על העתיד עם will ולשאול Will you…?',
      grammarTopic: 'will & Will you…? Review',
      skills: ['will', 'Will you…?', 'Review'],
      sentenceEn: 'I will study computers, and I will solve big problems.',
      sentenceHe: 'אלמד מחשבים, ואפתור בעיות גדולות.',
      vocab: [
        ['computer', 'noun', 'מחשב', '💻', 'I will learn to build a computer.', 'אלמד לבנות מחשב.'],
        ['study', 'verb', 'ללמוד', '📚', 'Next year I will study French.', 'בשנה הבאה אלמד צרפתית.'],
        ['problem', 'noun', 'בעיה', '🧩', "Don't worry. We will fix the problem.", 'אל תדאגו. נתקן את הבעיה.'],
        ['understand', 'verb', 'להבין', '💡', 'Now I understand the question.', 'עכשיו אני מבין/ה את השאלה.'],
        ['difficult', 'adjective', 'קשה', '😬', 'This test will be difficult.', 'המבחן הזה יהיה קשה.'],
        ['different', 'adjective', 'שונה', '🍏', 'Life will be different in the future.', 'החיים יהיו שונים בעתיד.'],
        ['pupil', 'noun', 'תלמיד', '🧑‍🎓', 'Every pupil will get a new book.', 'כל תלמיד יקבל ספר חדש.'],
        ['parent', 'noun', 'הורה', '🧑‍🍼', 'One day I will be a parent, too.', 'יום אחד גם אני אהיה הורה.'],
      ],
      seed: {
        wrongWords: [
          { wordEn: 'bridge', translationHe: 'גשר' },
          { wordEn: 'sock', translationHe: 'גרב' },
        ],
        shortSentenceEn: 'I will study every day.',
        shortSentenceHe: 'אני אלמד כל יום.',
        rule: {
          questionEn: 'Will you study music next year? (You want to.) Which answer is correct?',
          correct: 'Yes, I will. I love music.',
          wrong: ['Yes, I am. I love music.', 'Yes, I wills. I love music.'],
          explainHe: 'על שאלה עם Will עונים בקצרה: Yes, I will או No, I won\'t. will לא מקבל s.',
          hintHe: 'שימו לב למילה הראשונה בשאלה: היא חוזרת בתשובה הקצרה.',
        },
        story: {
          passageEn:
            'Our class writes letters to the future. Ido writes, "In ten years, I will study computers. Life will be different, and the air will be clean." Ido puts his letter in a box. The class will open the box in ten years.',
          passageHe:
            'הכיתה שלנו כותבת מכתבים לעתיד. עידו כותב: "בעוד עשר שנים אלמד מחשבים. החיים יהיו שונים, והאוויר יהיה נקי." עידו שם את המכתב שלו בקופסה. הכיתה תפתח את הקופסה בעוד עשר שנים.',
          questionEn: 'When will the class open the box?',
          questionHe: 'מתי הכיתה תפתח את הקופסה?',
          correct: 'in ten years',
          wrong: ['tomorrow', 'next week'],
        },
        tiers: {
          explorer: {
            rule: {
              questionEn: 'Which sentence is right?',
              correct: 'It will be difficult.',
              wrong: ['It will is difficult.'],
              explainHe: 'אחרי will בא be.',
              hintHe: 'מה בא אחרי will: be או is?',
            },
            story: {
              passageEn: 'Rina is a good pupil. She will study computers. She loves math problems.',
              passageHe: 'רינה תלמידה טובה. היא תלמד מחשבים. היא אוהבת בעיות בחשבון.',
              questionEn: 'What will Rina study?',
              questionHe: 'מה רינה תלמד?',
              correct: 'computers',
              wrong: ['music'],
            },
          },
          challenger: {
            clozeWrong: [
              ['sing', 'blue'],
              ['table', 'yellow'],
              ['sing', 'happy'],
              ['chair', 'green'],
              ['table', 'swim'],
              ['apple', 'run'],
              ['jump', 'green'],
              ['eat', 'green'],
            ],
          },
          master: {
            sentenceEn: 'Will robots understand people in the future?',
            sentenceHe: 'רובוטים יבינו אנשים בעתיד?',
            decoys: ['understands', 'do'],
            voiceEn: 'This problem will not be difficult for you.',
            voiceHe: 'הבעיה הזאת לא תהיה קשה בשבילכם.',
            errorFix: {
              questionEn: 'Which question has no mistake?',
              correct: 'Will you help me with this problem?',
              wrong: [
                'Will you helps me with this problem?',
                'Will help you me with this problem?',
                'Do you will help me with this problem?',
              ],
              explainHe: 'שאלה עם will: Will, אחר כך you, ואז הפועל בצורה הבסיסית. לא מוסיפים do.',
              hintEn: 'Check the word order and the verb.',
            },
            story: {
              passageEn:
                'Grandpa shows Noam an old photo of his class from 1970. "We had no computers," he says. "Every pupil wrote with a pen." Noam looks at his tablet. "What will school be like in fifty years?" he asks. Grandpa laughs. "Maybe robots will be the teachers, and you will be the grandpa!"',
              passageHe: '',
              questionEn: 'What does Grandpa think may happen?',
              questionHe: '',
              correct: 'Robots may teach classes.',
              wrong: ['Pupils will write with pens.', 'Noam will lose his tablet.', 'There will be no schools.'],
            },
            storyHintEn: 'Read what Grandpa says at the end.',
          },
        },
      },
    },
  ],
};

/** The core-3 pack's grade 5 unit (`../../registry.ts`) */
export const CORE_3_GRADE_5_CURRICULUM: GradeCurriculumPack = /*#__PURE__*/ buildElementaryGrade('grade-5', [UNIT_CORE_3]);
