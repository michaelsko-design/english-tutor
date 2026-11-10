import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-3 source's grade 8 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_3_GRADE_8_EXAM_BANK: ExamBankPack = {
  // Unit 23: the present simple passive, made in Israel
  23: {
    vocabulary: [
      {
        clozeEn: 'Our new sofa and table arrived today. We love the new ____.',
        clozeHe: 'הספה והשולחן החדשים שלנו הגיעו היום. אנחנו אוהבים את הרהיטים החדשים.',
        answer: 'furniture',
        wrong: ['success', 'process'],
      },
      {
        clozeEn: 'Only trained workers can ____ this big machine.',
        clozeHe: 'רק עובדים מיומנים יכולים להפעיל את המכונה הגדולה הזאת.',
        answer: 'operate',
        wrong: ['wrapped up', 'designed'],
      },
      {
        clozeEn: 'The ____ is sent by mail, and it arrives in three days.',
        clozeHe: 'החבילה נשלחת בדואר, והיא מגיעה תוך שלושה ימים.',
        answer: 'package',
        wrong: ['fashion', 'metal'],
      },
      {
        clozeEn: 'A bus is a big ____ that carries many people.',
        clozeHe: 'אוטובוס הוא כלי רכב גדול שמסיע הרבה אנשים.',
        answer: 'vehicle',
        wrong: ['tools', 'goods'],
      },
      {
        clozeEn: 'Our phone is old. Dad wants to buy the ____ model.',
        clozeHe: 'הטלפון שלנו ישן. אבא רוצה לקנות את הדגם החדש ביותר.',
        answer: 'latest',
        wrong: ['mainly', 'extremely'],
      },
      {
        clozeEn: 'Our school play was a big ____: every ticket was sold.',
        clozeHe: 'ההצגה של בית הספר שלנו הייתה הצלחה גדולה: כל הכרטיסים נמכרו.',
        answer: 'success',
        wrong: ['device', 'furniture'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete: "Hummus ____ from chickpeas."',
        correct: 'is made',
        wrong: ['are made', 'is make'],
        explainHe: 'hummus הוא יחיד, ולכן is, ואחריו V3: made.',
        hintHe: 'האם החומוס הוא יחיד או רבים? ואיזו צורה של הפועל באה אחרי פועל העזר?',
      },
      {
        questionEn: 'Complete: "Many Israeli apps ____ all over the world."',
        correct: 'are used',
        wrong: ['is used', 'are use'],
        explainHe: 'apps הן רבות, ולכן are, ואחריו V3: used.',
        hintHe: 'כמה אפליקציות יש? בדקו גם את סוף הפועל.',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'The museum is visited by many tourists.',
        wrong: ['The museum is visit by many tourists.', 'The museum visited by many tourists.'],
        explainHe: 'בסביל צריך גם is וגם V3: is visited.',
        hintHe: 'בדקו שיש פועל עזר ושהפועל בצורה השלישית.',
      },
      {
        questionEn: 'Which question is correct?',
        correct: 'Is this bread baked every day?',
        wrong: ['Does this bread baked every day?', 'Is this bread bake every day?'],
        explainHe: 'בשאלה בסביל פותחים ב-is, ואחרי הנושא בא V3: baked. לא משתמשים ב-does.',
        hintHe: 'באיזה פועל עזר פותחים שאלה בסביל?',
      },
      {
        questionEn: 'Complete: "Olives ____ in October and November."',
        correct: 'are picked',
        wrong: ['are pick', 'is picked'],
        explainHe: 'olives הם רבים, ולכן are, ואחריו V3: picked.',
        hintHe: 'כמה זיתים יש? ואיזו צורה של הפועל באה בסביל?',
      },
      {
        questionEn: 'Complete: "The new school laptops ____ by the city."',
        correct: 'are paid for',
        wrong: ['are pay for', 'is paid for'],
        explainHe: 'laptops הם רבים, ולכן are. ה-V3 של pay הוא paid.',
        hintHe: 'מה הצורה השלישית של pay? ובדקו גם את פועל העזר.',
      },
    ],
    sentences: [
      { en: 'This chair is made of metal.', he: 'הכיסא הזה עשוי ממתכת.' },
      { en: 'Our goods are sold in many countries.', he: 'הסחורה שלנו נמכרת בהרבה מדינות.' },
      { en: 'Is this device used in schools?', he: 'האם משתמשים במכשיר הזה בבתי ספר?' },
      { en: 'The game is controlled by a phone.', he: 'שולטים במשחק באמצעות טלפון.' },
      { en: 'The gifts are wrapped in red paper.', he: 'המתנות עטופות בנייר אדום.' },
      { en: 'This bag is made of old jeans.', he: 'התיק הזה עשוי מג׳ינס ישנים.' },
    ],
    passages: [
      {
        passageEn:
          'Have you ever eaten an Israeli cherry tomato? These small tomatoes are grown in greenhouses in the south. They are picked by hand, packed in small boxes and sent to shops in Europe. Today, cherry tomatoes are an everyday food in many countries.',
        passageHe:
          'אכלתם פעם עגבניית שרי ישראלית? מגדלים את העגבניות הקטנות האלה בחממות בדרום. קוטפים אותן ביד, אורזים אותן בקופסאות קטנות ושולחים אותן לחנויות באירופה. היום עגבניות שרי הן מזון יומיומי בהרבה מדינות.',
        questions: [
          {
            questionEn: 'Where are the tomatoes grown?',
            questionHe: 'איפה מגדלים את העגבניות?',
            correct: 'In greenhouses in the south.',
            wrong: ['In gardens in Europe.', 'In fields in the north.'],
          },
          {
            questionEn: 'How are the tomatoes picked?',
            questionHe: 'איך קוטפים את העגבניות?',
            correct: 'By hand.',
            wrong: ['By machines.', 'By robots.'],
          },
          {
            questionEn: 'Where are the boxes sent?',
            questionHe: 'לאן שולחים את הקופסאות?',
            correct: 'To shops in Europe.',
            wrong: ['To schools in Israel.', 'To farms in the south.'],
          },
        ],
      },
      {
        passageEn:
          'An Israeli company makes a small device that helps blind people. The device is put on a pair of glasses. It reads signs, books and even faces, and the words are said quietly into the person\'s ear. The device is used in more than fifty countries, and it is controlled with one finger.',
        passageHe:
          'חברה ישראלית מייצרת מכשיר קטן שעוזר לאנשים עיוורים. שמים את המכשיר על זוג משקפיים. הוא קורא שלטים, ספרים ואפילו פנים, והמילים נאמרות בשקט לתוך האוזן. משתמשים במכשיר ביותר מחמישים מדינות, ושולטים בו באצבע אחת.',
        questions: [
          {
            questionEn: 'Who does the device help?',
            questionHe: 'במי המכשיר עוזר?',
            correct: 'Blind people.',
            wrong: ['Doctors.', 'Young drivers.'],
          },
          {
            questionEn: 'Where is the device put?',
            questionHe: 'איפה שמים את המכשיר?',
            correct: 'On a pair of glasses.',
            wrong: ['In a phone.', 'On a book.'],
          },
          {
            questionEn: 'How is the device controlled?',
            questionHe: 'איך שולטים במכשיר?',
            correct: 'With one finger.',
            wrong: ['With the voice.', 'From a computer.'],
          },
        ],
      },
    ],
  },
};
