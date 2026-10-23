import type { ExamBankPack } from '../../../examBank/types';

/**
 * The core-plus pack's grade 10 exam bank (Feature 43), by the unit number in its mission ids.
 * New questions only. The last 2 items of each list and the second passage are for the mock exam.
 */
export const CORE_PLUS_GRADE_10_EXAM_BANK: ExamBankPack = {
  // Season 2, unit A: reported questions and commands
  21: {
    vocabulary: [
      {
        clozeEn: 'Every ____ must send a short video and a CV by Friday.',
        clozeHe: 'כל מועמד חייב לשלוח סרטון קצר וקורות חיים עד יום שישי.',
        answer: 'applicant',
        wrong: ['deadline', 'internship'],
      },
      {
        clozeEn: 'If you miss the ____, your application will not be accepted.',
        clozeHe: 'אם תפספסו את המועד האחרון, הבקשה שלכם לא תתקבל.',
        answer: 'deadline',
        wrong: ['employer', 'qualification'],
      },
      {
        clozeEn: 'The bus driver is always ____, so the students are never late.',
        clozeHe: 'נהג האוטובוס תמיד דייקן, ולכן התלמידים אף פעם לא מאחרים.',
        answer: 'punctual',
        wrong: ['negotiate', 'recruit'],
      },
      {
        clozeEn: 'Before signing the contract, Maya tried to ____ a higher hourly wage.',
        clozeHe: 'לפני שחתמה על החוזה, מאיה ניסתה לנהל משא ומתן על שכר שעתי גבוה יותר.',
        answer: 'negotiate',
        wrong: ['punctual', 'applicant'],
      },
      {
        clozeEn: 'Please call the office to ____ about the opening hours.',
        clozeHe: 'בבקשה התקשרו למשרד כדי לברר לגבי שעות הפתיחה.',
        answer: 'inquire',
        wrong: ['deadline', 'supervisor'],
      },
      {
        clozeEn: 'The hospital wants to ____ more volunteers for the night shifts.',
        clozeHe: 'בית החולים רוצה לגייס עוד מתנדבים למשמרות הלילה.',
        answer: 'recruit',
        wrong: ['punctual', 'internship'],
      },
    ],
    grammar: [
      {
        questionEn: 'Report the question: "Where do you live?"',
        correct: 'She asked me where I lived.',
        wrong: ['She asked me where did I live.', 'She asked me where do I live.'],
        explainHe: 'בשאלה עקיפה סדר המילים רגיל (I lived) ובלי do / did. Present Simple זז ל-Past Simple.',
        hintHe: 'בשאלה עקיפה לא משתמשים בפועל עזר של שאלה, והזמן זז צעד אחורה.',
      },
      {
        questionEn: 'Report the question: "Are you available on Saturday?"',
        correct: 'He asked whether I was available on Saturday.',
        wrong: ['He asked whether was I available on Saturday.', 'He asked whether I am available on Saturday.'],
        explainHe: 'בשאלת כן-לא עקיפה: whether + נושא + פועל, והזמן זז אחורה: I was.',
        hintHe: 'בדקו את סדר הנושא והפועל אחרי whether, והאם הזמן זז אחורה.',
      },
      {
        questionEn: 'Complete the sentence: "The teacher asked us _______ our phones during the exam."',
        correct: 'not to use',
        wrong: ['don’t use', 'not using'],
        explainHe: 'בקשה שלילית בדיבור עקיף: asked + מישהו + not to + פועל בסיס.',
        hintHe: 'אחרי asked us באה הוראה בשלילה. איזו תבנית מתאימה לפקודה שלילית עקיפה?',
      },
      {
        questionEn: 'Report the command: "Wear a helmet!"',
        correct: 'The instructor told us to wear a helmet.',
        wrong: ['The instructor told us wear a helmet.', 'The instructor said us to wear a helmet.'],
        explainHe: 'פקודה עקיפה: told + מישהו + to + פועל בסיס. said לא בא עם us.',
        hintHe: 'בדקו איזה פועל מוסר בא עם מישהו אחריו, ומה חייב לבוא לפני פועל הבסיס.',
      },
      {
        questionEn: 'Choose the correct reported question:',
        correct: 'The employer asked how long I had worked there.',
        wrong: ['The employer asked how long had I worked there.', 'The employer asked how long did I work there.'],
        explainHe: 'בשאלה עקיפה הנושא (I) בא לפני הפועל (had worked), בלי היפוך ובלי did.',
        hintHe: 'בשאלה עקיפה סדר המילים כמו במשפט רגיל. איזה משפט שומר על הסדר הזה בלי פועל עזר של שאלה?',
      },
      {
        questionEn: 'Report the request: "Could you send me the form?"',
        correct: 'She asked me to send her the form.',
        wrong: ['She asked me send her the form.', 'She asked me sending her the form.'],
        explainHe: 'בקשה עקיפה: asked + מישהו + to + פועל בסיס (to send).',
        hintHe: 'בקשה עקיפה בנויה כמו פקודה עקיפה: מישהו, ואחריו פועל בסיס עם מילה קטנה לפניו.',
      },
    ],
    sentences: [
      { en: 'The manager asked if I could start on Sunday.', he: 'המנהל שאל אם אוכל להתחיל ביום ראשון.' },
      { en: 'She told the new workers to wear name tags.', he: 'היא אמרה לעובדים החדשים לענוד תגי שם.' },
      { en: 'They asked us not to park near the gate.', he: 'הם ביקשו מאיתנו לא לחנות ליד השער.' },
      { en: 'My father asked who had called so late.', he: 'אבא שלי שאל מי התקשר כל כך מאוחר.' },
      { en: 'The supervisor wanted to know why the shop was closed.', he: 'האחראי רצה לדעת למה החנות סגורה.' },
      { en: 'The interviewer asked what my biggest strength was.', he: 'המראיין שאל מה החוזקה הכי גדולה שלי.' },
    ],
    passages: [
      {
        passageEn:
          'Yarden wanted a summer job at a beach café in Netanya. On the phone, the owner asked her how old she was and whether she had worked before. He also asked her to bring a letter from a teacher. At the interview, he told her to arrive at seven every morning. Yarden agreed, and she started work the following week.',
        passageHe:
          'ירדן רצתה עבודת קיץ בבית קפה על החוף בנתניה. בטלפון הבעלים שאל אותה בת כמה היא והאם עבדה בעבר. הוא גם ביקש ממנה להביא מכתב ממורה. בראיון הוא אמר לה להגיע בשבע בכל בוקר. ירדן הסכימה, והתחילה לעבוד בשבוע שאחרי.',
        questions: [
          {
            questionEn: 'Where was the summer job?',
            questionHe: 'איפה הייתה עבודת הקיץ?',
            correct: 'At a beach café in Netanya.',
            wrong: ['At a hotel in Eilat.', 'At a bookshop in Haifa.'],
          },
          {
            questionEn: 'What did the owner ask Yarden to bring?',
            questionHe: 'מה הבעלים ביקש מירדן להביא?',
            correct: 'A letter from a teacher.',
            wrong: ['A copy of her passport.', 'Her own uniform.'],
          },
          {
            questionEn: 'What time did the owner tell her to arrive?',
            questionHe: 'באיזו שעה הבעלים אמר לה להגיע?',
            correct: 'At seven every morning.',
            wrong: ['At noon.', 'At nine every morning.'],
          },
        ],
      },
      {
        passageEn:
          'Many Israeli high schools now offer a work-experience week in tenth grade. Before the week begins, students are asked which field interests them most. Last year, Omri chose a veterinary clinic in Petah Tikva. The vet told him to wash his hands after every animal and not to give food to the dogs. At the end of the week, she asked Omri whether he wanted to come back in the summer.',
        passageHe:
          'בתי ספר תיכוניים רבים בישראל מציעים היום שבוע התנסות בעבודה בכיתה י׳. לפני שהשבוע מתחיל, שואלים את התלמידים איזה תחום מעניין אותם יותר מכול. בשנה שעברה עמרי בחר במרפאה וטרינרית בפתח תקווה. הווטרינרית אמרה לו לשטוף ידיים אחרי כל חיה ולא לתת אוכל לכלבים. בסוף השבוע היא שאלה את עמרי אם הוא רוצה לחזור בקיץ.',
        questions: [
          {
            questionEn: 'Which field did Omri choose?',
            questionHe: 'באיזה תחום בחר עמרי?',
            correct: 'A veterinary clinic.',
            wrong: ['A bank.', 'A newspaper office.'],
          },
          {
            questionEn: 'What did the vet tell him not to do?',
            questionHe: 'מה הווטרינרית אמרה לו לא לעשות?',
            correct: 'Not to give food to the dogs.',
            wrong: ['Not to touch the cats.', 'Not to answer the phone.'],
          },
          {
            questionEn: 'What did the vet ask at the end of the week?',
            questionHe: 'מה שאלה הווטרינרית בסוף השבוע?',
            correct: 'Whether he wanted to come back in the summer.',
            wrong: ['Whether he wanted to become a vet.', 'Whether he had enjoyed the week.'],
          },
        ],
      },
    ],
  },
  // Season 2, unit B: Present Perfect Continuous vs. Present Perfect Simple
  22: {
    vocabulary: [
      {
        clozeEn: 'Swimming long distances requires great ____.',
        clozeHe: 'שחייה למרחקים ארוכים דורשת סבולת גבוהה.',
        answer: 'endurance',
        wrong: ['draft', 'milestone'],
      },
      {
        clozeEn: 'The band will ____ the new song three times before the concert.',
        clozeHe: 'הלהקה תעשה חזרות על השיר החדש שלוש פעמים לפני ההופעה.',
        answer: 'rehearse',
        wrong: ['exhausted', 'progress'],
      },
      {
        clozeEn: 'After two night shifts in a row, the nurse felt ____.',
        clozeHe: 'אחרי שתי משמרות לילה ברצף, האחות הרגישה מותשת.',
        answer: 'exhausted',
        wrong: ['commitment', 'athlete'],
      },
      {
        clozeEn: 'Please read my ____ and tell me what to improve.',
        clozeHe: 'בבקשה קראו את הטיוטה שלי ותגידו לי מה לשפר.',
        answer: 'draft',
        wrong: ['endurance', 'persevere'],
      },
      {
        clozeEn: 'Learning to walk again after the accident was a huge ____ for him.',
        clozeHe: 'ללמוד ללכת מחדש אחרי התאונה היה אבן דרך עצומה עבורו.',
        answer: 'milestone',
        wrong: ['revise', 'exhausted'],
      },
      {
        clozeEn: 'Even when the exercises are hard, try to ____ and not give up.',
        clozeHe: 'גם כשהתרגילים קשים, נסו להתמיד ולא לוותר.',
        answer: 'persevere',
        wrong: ['dedication', 'draft'],
      },
    ],
    grammar: [
      {
        questionEn: 'Complete the sentence: "Our neighbours _______ their kitchen for three weeks, and it is still not finished."',
        correct: 'have been painting',
        wrong: ['has been painting', 'have been paint'],
        explainHe: 'פעולה שנמשכת שלושה שבועות ועדיין לא נגמרה, עם נושא ברבים: have been + V-ing.',
        hintHe: 'הנושא ברבים, והפעולה עדיין נמשכת. בדקו את פועל העזר ואת סיומת הפועל.',
      },
      {
        questionEn: 'Complete the question: "How long _______ the guitar?"',
        correct: 'has she been playing',
        wrong: ['has she playing', 'is she been playing'],
        explainHe: 'שאלה על משך של פעולה שנמשכת: How long + has + נושא + been + V-ing.',
        hintHe: 'השאלה היא על משך של פעולה שעדיין נמשכת. בדקו שיש את כל שלושת החלקים של התבנית.',
      },
      {
        questionEn: 'Choose the correct sentence:',
        correct: 'She has written three songs this month.',
        wrong: ['She has been writing three songs this month.', 'She have written three songs this month.'],
        explainHe: 'סופרים תוצאות (three songs), ולכן Present Perfect Simple: has written.',
        hintHe: 'במשפט יש מספר של דברים שהושלמו. איזה זמן מדגיש תוצאה, ואיזה פועל עזר מתאים ל-she?',
      },
      {
        questionEn: 'Complete the sentence: "I _______ this song since I was a child."',
        correct: 'have loved',
        wrong: ['have been loving', 'am loving'],
        explainHe: 'love הוא פועל של רגש ומצב, ולכן Present Perfect Simple: have loved.',
        hintHe: 'הפועל כאן מתאר רגש, ופעלי רגש ומצב בדרך כלל לא באים בצורה עם ing.',
      },
      {
        questionEn: 'Complete the answer: "Why are your hands so dirty?" "I _______ in the garden."',
        correct: 'have been working',
        wrong: ['have worked', 'am worked'],
        explainHe: 'הידיים מלוכלכות בגלל פעילות שנמשכה עד עכשיו, ולכן have been + V-ing.',
        hintHe: 'רואים עכשיו סימנים של פעילות ארוכה שנגמרה הרגע. איזה זמן מדגיש את הפעילות עצמה?',
      },
      {
        questionEn: 'Complete the sentence: "Ron is exhausted because he _______ since six o’clock."',
        correct: 'has been studying',
        wrong: ['have been studying', 'has studying'],
        explainHe: 'Ron הוא יחיד, ולכן has been + V-ing.',
        hintHe: 'הנושא ביחיד. בדקו את פועל העזר ושיש את כל חלקי התבנית.',
      },
    ],
    sentences: [
      { en: 'We have been planning this trip for months.', he: 'אנחנו מתכננים את הטיול הזה כבר חודשים.' },
      { en: 'How long has your brother been learning Japanese?', he: 'כמה זמן אחיך לומד יפנית?' },
      { en: 'It has been snowing on the Hermon all week.', he: 'כל השבוע יורד שלג בחרמון.' },
      { en: 'She has finished her project, so now she is relaxing.', he: 'היא סיימה את הפרויקט שלה, אז עכשיו היא נחה.' },
      { en: 'They have been volunteering at the animal shelter since spring.', he: 'הם מתנדבים במקלט לבעלי חיים מאז האביב.' },
      { en: 'I have revised two chapters so far.', he: 'חזרתי על שני פרקים עד עכשיו.' },
    ],
    passages: [
      {
        passageEn:
          'Since September, a group of tenth graders in Karmiel has been building a small electric car. They have been meeting every Tuesday after school. So far, they have built the frame and tested the battery twice. Their teacher says that their commitment has surprised everyone. The car is going to race against other schools in June.',
        passageHe:
          'מאז ספטמבר, קבוצת תלמידי כיתה י׳ בכרמיאל בונה מכונית חשמלית קטנה. הם נפגשים בכל יום שלישי אחרי הלימודים. עד עכשיו הם בנו את השלדה ובדקו את הסוללה פעמיים. המורה שלהם אומר שהמחויבות שלהם הפתיעה את כולם. המכונית תתחרה מול בתי ספר אחרים ביוני.',
        questions: [
          {
            questionEn: 'How often have the students been meeting?',
            questionHe: 'באיזו תדירות התלמידים נפגשים?',
            correct: 'Every Tuesday after school.',
            wrong: ['Every morning before school.', 'Once a month.'],
          },
          {
            questionEn: 'What have they built so far?',
            questionHe: 'מה הם בנו עד עכשיו?',
            correct: 'The frame of the car.',
            wrong: ['The whole engine.', 'A new garage.'],
          },
          {
            questionEn: 'When is the car going to race?',
            questionHe: 'מתי המכונית תתחרה?',
            correct: 'In June.',
            wrong: ['In September.', 'Next week.'],
          },
        ],
      },
      {
        passageEn:
          'Rotem has been learning to play the oud for two years. At first, she practised for only ten minutes a day. Now she has been practising for an hour every evening. Last month, she reached an important milestone: she played in front of an audience for the first time. Her grandfather, who taught her the first songs, sat in the front row.',
        passageHe:
          'רותם לומדת לנגן בעוד כבר שנתיים. בהתחלה היא התאמנה רק עשר דקות ביום. עכשיו היא מתאמנת שעה בכל ערב. בחודש שעבר היא הגיעה לאבן דרך חשובה: היא ניגנה מול קהל בפעם הראשונה. סבא שלה, שלימד אותה את השירים הראשונים, ישב בשורה הראשונה.',
        questions: [
          {
            questionEn: 'How long has Rotem been learning the oud?',
            questionHe: 'כמה זמן רותם לומדת לנגן בעוד?',
            correct: 'For two years.',
            wrong: ['For six months.', 'For five years.'],
          },
          {
            questionEn: 'What milestone did she reach last month?',
            questionHe: 'לאיזו אבן דרך היא הגיעה בחודש שעבר?',
            correct: 'She played in front of an audience for the first time.',
            wrong: ['She wrote her first song.', 'She bought a new oud.'],
          },
          {
            questionEn: 'Where did her grandfather sit?',
            questionHe: 'איפה ישב סבא שלה?',
            correct: 'In the front row.',
            wrong: ['At the back of the hall.', 'On the stage.'],
          },
        ],
      },
    ],
  },
};
