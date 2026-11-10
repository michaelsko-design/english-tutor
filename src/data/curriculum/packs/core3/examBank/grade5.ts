import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-3 source's grade 5 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_3_GRADE_5_EXAM_BANK: ExamBankPack = {
  // Unit 23: will (predictions) and Will you…? questions, Future Me
  23: {
    vocabulary: [
      {
        clozeEn: 'English is a ____ that people speak all over the world.',
        clozeHe: 'אנגלית היא שפה שאנשים מדברים בכל העולם.',
        answer: 'language',
        wrong: ['boat', 'parent'],
      },
      {
        clozeEn: 'When I am an ____, I will drive a car.',
        clozeHe: 'כשאהיה מבוגר/ת, אנהג במכונית.',
        answer: 'adult',
        wrong: ['river', 'singer'],
      },
      {
        clozeEn: 'The workers will build a bridge over the ____.',
        clozeHe: 'הפועלים יבנו גשר מעל הנהר.',
        answer: 'river',
        wrong: ['pupil', 'world'],
      },
      {
        clozeEn: 'Grandma will ____ cookies for us tomorrow.',
        clozeHe: 'סבתא תאפה לנו עוגיות מחר.',
        answer: 'bake',
        wrong: ['begin', 'understand'],
      },
      {
        clozeEn: 'This math test will be very ____.',
        clozeHe: 'המבחן הזה בחשבון יהיה קשה מאוד.',
        answer: 'difficult',
        wrong: ['computer', 'try'],
      },
      {
        clozeEn: 'The new ____ in our class is from France.',
        clozeHe: 'התלמיד החדש בכיתה שלנו מצרפת.',
        answer: 'pupil',
        wrong: ['parent', 'band'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete: "Next year I ____ twelve."',
        correct: 'will be',
        wrong: ['will am', 'will is'],
        explainHe: 'אחרי will בא be, בלי am או is: I will be twelve.',
        hintHe: 'מה הצורה הבסיסית של am ו-is?',
      },
      {
        questionEn: 'Complete: "In the future, robots ____ our homes."',
        correct: 'will clean',
        wrong: ['will cleans', 'wills clean'],
        explainHe: 'אחרי will הפועל בא בלי s, ו-will עצמו לא מקבל s.',
        hintHe: 'בדקו את will ואת הפועל שאחריו.',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Will you be a doctor one day?',
        wrong: ['Will you are a doctor one day?', 'Do you will be a doctor one day?'],
        explainHe: 'שאלה על העתיד: Will + you + be. לא מוסיפים do.',
        hintHe: 'במה מתחילה השאלה? ומה בא אחרי Will you?',
      },
      {
        questionEn: "Will you come to the game? (You can't come.) Which answer is correct?",
        correct: "No, I won't.",
        wrong: ["No, I don't will.", "No, I willn't."],
        explainHe: "התשובה השלילית הקצרה: No, I won't (will not).",
        hintHe: 'מה הצורה הקצרה של will not?',
      },
      {
        questionEn: 'Complete: "When ____ the show begin?"',
        correct: 'will',
        wrong: ['does will', 'is'],
        explainHe: 'בשאלה על העתיד בא will אחרי When: When will the show begin?',
        hintHe: 'ההופעה תתחיל בעתיד. איזו מילה מראה עתיד?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: "It won't rain tomorrow.",
        wrong: ["It won't rains tomorrow.", "It will doesn't rain tomorrow."],
        explainHe: "בשלילה אומרים won't (will not) ואז הפועל בלי s.",
        hintHe: "מה בא אחרי won't?",
      },
    ],
    sentences: [
      { en: 'One day I will travel around the world.', he: 'יום אחד אטייל מסביב לעולם.' },
      { en: 'Will you be a doctor or a singer?', he: 'אתם תהיו רופאים או זמרים?' },
      { en: 'In the future, cars will drive everywhere.', he: 'בעתיד מכוניות ייסעו בכל מקום.' },
      { en: "No, I won't play in the band.", he: 'לא, אני לא אנגן בלהקה.' },
      { en: 'Next year I will study a new language.', he: 'בשנה הבאה אלמד שפה חדשה.' },
      { en: 'Will the workers finish the road soon?', he: 'הפועלים יסיימו את הכביש בקרוב?' },
    ],
    passages: [
      {
        passageEn:
          'Lior is eleven. He thinks about his future. "When I am an adult, I will study computers," he says. "I will live somewhere near the sea, and I will have a boat." His sister asks, "Will you take me on your boat?" Lior laughs. "Yes, I will!"',
        passageHe:
          'ליאור בן אחת עשרה. הוא חושב על העתיד שלו. "כשאהיה מבוגר, אלמד מחשבים," הוא אומר. "אגור איפשהו ליד הים, ותהיה לי סירה." אחותו שואלת: "תיקח אותי בסירה שלך?" ליאור צוחק. "כן!"',
        questions: [
          {
            questionEn: 'What will Lior study?',
            questionHe: 'מה ליאור ילמד?',
            correct: 'Computers.',
            wrong: ['Languages.', 'Music.'],
          },
          {
            questionEn: 'Where will Lior live?',
            questionHe: 'איפה ליאור יגור?',
            correct: 'Near the sea.',
            wrong: ['In a big city.', 'Near a river.'],
          },
          {
            questionEn: 'Will Lior take his sister on his boat?',
            questionHe: 'ליאור ייקח את אחותו בסירה שלו?',
            correct: 'Yes, he will.',
            wrong: ["No, he won't.", 'He has no boat.'],
          },
        ],
      },
      {
        passageEn:
          'Our school band will play at the end-of-year party. The show will begin at six. Dana will sing, and Ori will play the drums. Will it be difficult? Maybe, but the band will practice every day. Everybody will be there!',
        passageHe:
          'הלהקה של בית הספר שלנו תנגן במסיבת סוף השנה. ההופעה תתחיל בשש. דנה תשיר, ואורי ינגן בתופים. זה יהיה קשה? אולי, אבל הלהקה תתאמן כל יום. כולם יהיו שם!',
        questions: [
          {
            questionEn: 'What time will the show begin?',
            questionHe: 'באיזו שעה ההופעה תתחיל?',
            correct: 'At six.',
            wrong: ['At ten.', 'At four.'],
          },
          {
            questionEn: 'What will Ori do?',
            questionHe: 'מה אורי יעשה?',
            correct: 'Play the drums.',
            wrong: ['Sing a song.', 'Bake a cake.'],
          },
          {
            questionEn: 'How often will the band practice?',
            questionHe: 'כמה פעמים הלהקה תתאמן?',
            correct: 'Every day.',
            wrong: ['Once a week.', 'Only on Friday.'],
          },
        ],
      },
    ],
  },
};
