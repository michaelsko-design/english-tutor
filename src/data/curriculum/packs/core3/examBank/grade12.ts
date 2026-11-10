import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-3 source's grade 12 exam bank, by the unit number in its mission ids. New questions
 * only; the last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_3_GRADE_12_EXAM_BANK: ExamBankPack = {
  // Unit 23: Bagrut essay skills (sequencing and coordinating)
  23: {
    vocabulary: [
      {
        clozeEn: 'The town is beautiful, ____ it is very crowded in summer.',
        clozeHe: 'העיירה יפה, אלא שבקיץ היא צפופה מאוד.',
        answer: 'except that',
        wrong: ['thanks to', 'the main thing'],
      },
      {
        clozeEn: 'My grandmother ____ watches TV; she prefers reading the newspaper.',
        clozeHe: 'סבתא שלי צופה בטלוויזיה לעיתים רחוקות; היא מעדיפה לקרוא את העיתון.',
        answer: 'seldom',
        wrong: ['whatever', 'appropriate'],
      },
      {
        clozeEn: 'Everyone must wear a helmet, and teachers are no ____.',
        clozeHe: 'כולם חייבים לחבוש קסדה, וגם המורים אינם יוצאים מן הכלל.',
        answer: 'exception',
        wrong: ['wealth', 'impression'],
      },
      {
        clozeEn: 'Many people believe that ____ brings happiness, but money cannot buy friends.',
        clozeHe: 'הרבה אנשים מאמינים שעושר מביא אושר, אבל כסף לא יכול לקנות חברים.',
        answer: 'wealth',
        wrong: ['barrier', 'exception'],
      },
      {
        clozeEn: 'Jeans are not ____ clothes for a job interview.',
        clozeHe: "ג'ינס הם לא בגדים מתאימים לראיון עבודה.",
        answer: 'appropriate',
        wrong: ['limited', 'aggressive'],
      },
      {
        clozeEn: '____ the new bridge, the drive to the city takes only ten minutes.',
        clozeHe: 'בזכות הגשר החדש, הנסיעה לעיר לוקחת רק עשר דקות.',
        answer: 'thanks to',
        wrong: ['even if', 'whatever'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete: "First, choose a topic. ____, write a short plan."',
        correct: 'Then',
        wrong: ['Finally', 'To sum up'],
        explainHe: 'זה הצעד השני ברצף, ולכן Then. Finally פותח את הצעד האחרון, ו-To sum up את הסיכום.',
        hintHe: 'זה הצעד השני מתוך כמה. איזו מילה ממשיכה רצף?',
      },
      {
        questionEn: 'Complete: "The museum was free, ____ it was almost empty."',
        correct: 'yet',
        wrong: ['so', 'and so'],
        explainHe: 'מוזיאון בחינם ובכל זאת ריק: זה ניגוד, ולכן yet. so ו-and so מציגים תוצאה.',
        hintHe: 'האם המוזיאון הריק הוא תוצאה צפויה או הפתעה?',
      },
      {
        questionEn: 'Complete: "We can write about sport, ____ we can write about music."',
        correct: 'or',
        wrong: ['so', 'yet'],
        explainHe: 'מציגים שתי אפשרויות לבחירה, ולכן or.',
        hintHe: 'האם המשפט מציג בחירה, ניגוד או תוצאה?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'In conclusion, the plan is expensive, but it is worth it.',
        wrong: [
          'In conclusion, the plan is expensive, so it is worth it.',
          'In the conclusion, the plan is expensive, but it is worth it.',
        ],
        explainHe: 'כותבים In conclusion בלי the, ובין "יקר" לבין "שווה את זה" יש ניגוד, ולכן but.',
        hintHe: 'בדקו את מילות הפתיחה ואת הקשר בין שני החלקים.',
      },
      {
        questionEn: 'Complete: "The bus was late, ____ we missed the start of the movie."',
        correct: 'so',
        wrong: ['but', 'or'],
        explainHe: 'האיחור גרם לתוצאה, ולכן so.',
        hintHe: 'האם החלק השני הוא תוצאה של החלק הראשון?',
      },
      {
        questionEn: 'Which sentence is correct?',
        correct: 'After that, we compared the two answers.',
        wrong: ['After, we compared the two answers.', 'At first of all, we compared the two answers.'],
        explainHe: 'במשפט שממשיך רצף כותבים After that. After לבד לא פותח משפט כזה, ואין At first of all.',
        hintHe: 'בדקו את הביטוי שפותח את המשפט.',
      },
    ],
    sentences: [
      { en: 'First of all, read the question carefully.', he: 'קודם כול, קראו את השאלה בעיון.' },
      { en: 'The movie was long, yet nobody left early.', he: 'הסרט היה ארוך, ובכל זאת אף אחד לא יצא מוקדם.' },
      { en: 'We were hungry, so we stopped at a cafe.', he: 'היינו רעבים, אז עצרנו בבית קפה.' },
      { en: 'After that, give an example from your own life.', he: 'אחרי זה, תנו דוגמה מהחיים שלכם.' },
      { en: 'You can type your essay, or you can write it by hand.', he: 'אתם יכולים להקליד את החיבור, או לכתוב אותו בכתב יד.' },
      { en: 'To sum up, both sides have good arguments.', he: 'לסיכום, לשני הצדדים יש טיעונים טובים.' },
    ],
    passages: [
      {
        passageEn:
          'Writing a good Bagrut essay takes practice. First of all, read the task twice and underline the key words. Then make a short plan with three main ideas. After that, write one paragraph for each idea and connect your sentences with words like and, but and so. Finally, leave five minutes to check your spelling and punctuation.',
        passageHe:
          'כתיבת חיבור טוב לבגרות דורשת תרגול. קודם כול, קראו את המשימה פעמיים וסמנו את מילות המפתח. אחר כך הכינו תוכנית קצרה עם שלושה רעיונות עיקריים. אחרי זה, כתבו פסקה אחת לכל רעיון וחברו את המשפטים במילים כמו and, but ו-so. לבסוף, השאירו חמש דקות לבדיקת האיות והפיסוק.',
        questions: [
          {
            questionEn: 'What should you do first?',
            questionHe: 'מה צריך לעשות קודם?',
            correct: 'Read the task twice.',
            wrong: ['Write a paragraph.', 'Check your spelling.'],
          },
          {
            questionEn: 'How many main ideas should the plan have?',
            questionHe: 'כמה רעיונות עיקריים צריכים להיות בתוכנית?',
            correct: 'Three.',
            wrong: ['Two.', 'Five.'],
          },
          {
            questionEn: 'What are the last five minutes for?',
            questionHe: 'בשביל מה חמש הדקות האחרונות?',
            correct: 'Checking spelling and punctuation.',
            wrong: ['Reading the task again.', 'Making a short plan.'],
          },
        ],
      },
      {
        passageEn:
          'Should students wear school uniforms? Supporters say that uniforms save money, and they reduce competition over clothes. Opponents agree that uniforms are cheap, yet they argue that young people need to express themselves. Some schools have found a middle way: students wear a school shirt, but they can choose the rest of their clothes.',
        passageHe:
          'האם תלמידים צריכים ללבוש תלבושת אחידה? התומכים אומרים שתלבושת אחידה חוסכת כסף ומפחיתה תחרות על בגדים. המתנגדים מסכימים שהתלבושת זולה, ובכל זאת הם טוענים שצעירים צריכים לבטא את עצמם. כמה בתי ספר מצאו דרך ביניים: התלמידים לובשים חולצה של בית הספר, אבל יכולים לבחור את שאר הבגדים.',
        questions: [
          {
            questionEn: 'What do supporters say about uniforms?',
            questionHe: 'מה אומרים התומכים על תלבושת אחידה?',
            correct: 'They save money.',
            wrong: ['They look modern.', 'They are comfortable.'],
          },
          {
            questionEn: 'Why are opponents against uniforms?',
            questionHe: 'למה המתנגדים נגד תלבושת אחידה?',
            correct: 'Young people need to express themselves.',
            wrong: ['Uniforms are too expensive.', 'Uniforms are not warm enough.'],
          },
          {
            questionEn: 'What is the middle way?',
            questionHe: 'מהי דרך הביניים?',
            correct: 'A school shirt, and free choice of the rest.',
            wrong: ['No uniform on Fridays.', 'Uniforms only for teachers.'],
          },
        ],
      },
    ],
  },
};
