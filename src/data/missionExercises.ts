import { MissionNode } from './curriculum';
import { LearnerGender, ProficiencyTier } from '../types/learner';
import { inflectHebrew } from '../utils/hebrewGender';

export type DrillType =
  | 'chat-reply'
  | 'sentence-builder'
  | 'voice-speak'
  | 'grammar-detective'
  | 'story-unseen';

export interface MultipleChoiceOption {
  textEn: string;
  isCorrect: boolean;
  explanationHe: string;
}

export interface MissionExerciseStep {
  id: string;
  stepNumber: number;
  type: DrillType;
  badgeLabelHe: string;
  promptHe: string;
  hintHe: string;
  // For chat-reply, grammar-detective, story-unseen
  speakerName?: string;
  speakerAvatar?: string;
  contextPassageEn?: string;
  contextPassageHe?: string;
  questionEn: string;
  options?: MultipleChoiceOption[];
  // For sentence-builder
  targetSentenceEn?: string;
  targetSentenceHe?: string;
  scrambledWords?: string[];
  // For voice-speak
  speakTargetEn?: string;
  speakTargetHe?: string;
  focusWordEn?: string;
}

function applyGenderToStep(
  step: MissionExerciseStep,
  gender: LearnerGender
): MissionExerciseStep {
  return {
    ...step,
    badgeLabelHe: inflectHebrew(step.badgeLabelHe, gender),
    promptHe: inflectHebrew(step.promptHe, gender),
    hintHe: inflectHebrew(step.hintHe, gender),
    contextPassageHe: step.contextPassageHe
      ? inflectHebrew(step.contextPassageHe, gender)
      : undefined,
    options: step.options?.map((opt) => ({
      ...opt,
      explanationHe: inflectHebrew(opt.explanationHe, gender),
    })),
  };
}

/**
 * Generates a 5-step interactive mission tailored to the specific MissionNode, ProficiencyTier, and LearnerGender.
 */
export function getExercisesForMission(
  mission: MissionNode,
  tier: ProficiencyTier,
  gender: LearnerGender = 'girl'
): MissionExerciseStep[] {
  const steps = getRawExercisesForMission(mission, tier);
  return steps.map((s) => applyGenderToStep(s, gender));
}

function getRawExercisesForMission(
  mission: MissionNode,
  tier: ProficiencyTier
): MissionExerciseStep[] {
  // Specialized rich content for 7th Grade Missions, with dynamic fallback for any mission node
  if (mission.id === 'g7-u1-m1') {
    return [
      {
        id: 'g7-u1-m1-s1',
        stepNumber: 1,
        type: 'chat-reply',
        badgeLabelHe: '💬 שלב 1/5: סימולטור צ׳אט קבוצתי',
        promptHe:
          tier === 'explorer'
            ? 'בחרי את הפועל הנכון להשלמת ההודעה (שימי לב ל-My best friend = She):'
            : tier === 'challenger'
            ? 'השלימי את ההודעה בצ׳אט הבינלאומי ב-Present Simple:'
            : 'אתגר מצוינות: בחרי את המשפט המדויק ביותר תחבירית לדוברי אנגלית:',
        hintHe:
          '💡 ב-Present Simple, עבור He / She / It מוסיפים s או es לפועל (למשל designs, studies).',
        speakerName: 'Mina (Seoul Studio)',
        speakerAvatar: '🧋',
        questionEn:
          tier === 'explorer'
            ? 'My best friend usually _______ digital stickers after school.'
            : tier === 'challenger'
            ? 'Every afternoon, Noa _______ her tablet and _______ creative stickers.'
            : 'Which reply to the group chat uses Present Simple frequency adverbs and spelling correctly?',
        options:
          tier === 'explorer'
            ? [
                {
                  textEn: 'designs',
                  isCorrect: true,
                  explanationHe: 'מעולה! My best friend היא גוף שלישי יחיד (She), ולכן מוסיפים s: designs.',
                },
                {
                  textEn: 'design',
                  isCorrect: false,
                  explanationHe: 'כמעט! עבור She ב-Present Simple חייבים להוסיף s לפועל.',
                },
                {
                  textEn: 'designing',
                  isCorrect: false,
                  explanationHe: 'המילה usually מעידה על הרגל קבוע (Present Simple), לא על ing.',
                },
              ]
            : tier === 'challenger'
            ? [
                {
                  textEn: 'takes / designs',
                  isCorrect: true,
                  explanationHe: 'בול! שני הפעלים מתייחסים לנועה (She) בהרגל קבוע ולכן שניהם מקבלים s.',
                },
                {
                  textEn: 'take / designs',
                  isCorrect: false,
                  explanationHe: 'שימי לב שגם הפועל הראשון (takes) מתייחס לנועה וצריך s!',
                },
                {
                  textEn: 'is taking / is designing',
                  isCorrect: false,
                  explanationHe: 'Every afternoon מעיד על פעולה קבועה (Present Simple), לא על מה שקורה רק עכשיו.',
                },
              ]
            : [
                {
                  textEn: 'She always carries her sketchbook and studies new art styles.',
                  isCorrect: true,
                  explanationHe: 'אלופה! פעלים שמסתיימים בעיצור + y (כמו carry, study) הופכים ל-ies בגוף שלישי!',
                },
                {
                  textEn: 'She carries always her sketchbook and studys new art styles.',
                  isCorrect: false,
                  explanationHe: 'שתי נקודות לתשומת לב: always בא לפני הפועל, ו-study הופך ל-studies (עם ies).',
                },
                {
                  textEn: 'She always carry her sketchbook and studies new art styles.',
                  isCorrect: false,
                  explanationHe: 'הפועל carry חייב להפוך ל-carries עבור She.',
                },
              ],
      },
      {
        id: 'g7-u1-m1-s2',
        stepNumber: 2,
        type: 'sentence-builder',
        badgeLabelHe: '🧩 שלב 2/5: הרכבת משפט ממגנטים',
        promptHe: 'לחצי על המילים באנגלית לפי הסדר הנכון כדי לתרגם את המשפט:',
        hintHe: '💡 סדר משפט באנגלית: נושא (I / We) + מילת תדירות (usually) + פועל + המשך המשפט.',
        questionEn: 'Build the sentence in the right order:',
        targetSentenceEn: 'I usually drink iced tea in the afternoon',
        targetSentenceHe: 'אני בדרך כלל שותה תה קר אחר הצהריים.',
        scrambledWords:
          tier === 'explorer'
            ? ['afternoon', 'I', 'iced', 'usually', 'drink', 'tea', 'in', 'the']
            : tier === 'challenger'
            ? ['afternoon', 'I', 'iced', 'usually', 'drink', 'tea', 'in', 'the', 'drinks']
            : ['afternoon', 'I', 'iced', 'usually', 'drink', 'tea', 'in', 'the', 'drinks', 'at'],
      },
      {
        id: 'g7-u1-m1-s3',
        stepNumber: 3,
        type: 'voice-speak',
        badgeLabelHe: '🎙️ שלב 3/5: אימון קריאה ודיבור (Voice Recognition)',
        promptHe: 'הקשיבי למשפט ואז לחצי על המיקרופון וקראי אותו בקול ברור:',
        hintHe: '💡 שימי לב להגייה של המילה creative (קרי-איי-טיב) ו-schedule (סקג׳-וּל).',
        questionEn: 'Read this sentence aloud:',
        speakTargetEn: 'She has very creative ideas for our school schedule.',
        speakTargetHe: 'יש לה רעיונות יצירתיים מאוד למערכת השעות של בית הספר שלנו.',
        focusWordEn: 'creative',
      },
      {
        id: 'g7-u1-m1-s4',
        stepNumber: 4,
        type: 'grammar-detective',
        badgeLabelHe: '🕵️‍♀️ שלב 4/5: בלשית הדקדוק (Spot the Glitch)',
        promptHe: 'אחת ההודעות בצ׳אט כוללת טעות דקדוקית נפוצה של דוברי עברית. איזה תיקון הוא הנכון?',
        hintHe: '💡 בעברית אומרים "יש לה", אבל באנגלית עבור She משתמשים ב-has (ולא ב-have!).',
        questionEn: '❌ Wrong Message: "My friend Maya have a busy schedule on Mondays." — How do we fix it?',
        options: [
          {
            textEn: 'My friend Maya has a busy schedule on Mondays.',
            isCorrect: true,
            explanationHe: 'מדויק! עבור He / She / It הפועל have הופך ל-has.',
          },
          {
            textEn: 'My friend Maya is having a busy schedule on Mondays.',
            isCorrect: false,
            explanationHe: 'כשמדובר בשייכות קבועה ("יש לה"), have/has הוא פועל מצב ולא מקבל ing.',
          },
          {
            textEn: 'My friend Maya haves a busy schedule on Mondays.',
            isCorrect: false,
            explanationHe: 'אין מילה כזו haves באנגלית — הצורה הנכונה היא has!',
          },
        ],
      },
      {
        id: 'g7-u1-m1-s5',
        stepNumber: 5,
        type: 'story-unseen',
        badgeLabelHe: '📖 שלב 5/5: מיני-Unseen (סיכום משימה)',
        promptHe: 'קראי (או האזיני 🔊) לפוסט הקצר מהסטודיו בסיאול ועני על שאלת ההבנה:',
        hintHe: '💡 חפשי בטקסט את המילה introduce ואת הסיבה שבגללה הם נפגשים ביום שלישי.',
        contextPassageEn:
          'Welcome to PeachNote Studio! Every Tuesday at 4:00 PM, we introduce new teen creators from different countries. Together, we design digital stickers, share study tips, and practice English in a friendly group chat.',
        contextPassageHe:
          'ברוכים הבאים לסטודיו PeachNote! בכל יום שלישי ב-16:00 אנחנו מציגים יוצרים צעירים ממדינות שונות, מעצבים מדבקות ומתרגלים אנגלית.',
        questionEn: 'What does the club do every Tuesday at 4:00 PM?',
        options: [
          {
            textEn: 'They introduce new teen creators and design digital stickers together.',
            isCorrect: true,
            explanationHe: 'אלופה! הבנת מצוין את הקטע ואת אוצר המילים מ-Band II!',
          },
          {
            textEn: 'They study for a math test at the school library.',
            isCorrect: false,
            explanationHe: 'זה לא מופיע בטקסט — בדקי שוב מה הם עושים בסטודיו בכל יום שלישי.',
          },
          {
            textEn: 'They only meet once a year during summer vacation.',
            isCorrect: false,
            explanationHe: 'בטקסט כתוב Every Tuesday (בכל יום שלישי), ולא פעם בשנה.',
          },
        ],
      },
    ];
  }

  // Specialized content for Present Progressive vs. Simple (g7-u2-m1)
  if (mission.id === 'g7-u2-m1') {
    return [
      {
        id: 'g7-u2-m1-s1',
        stepNumber: 1,
        type: 'chat-reply',
        badgeLabelHe: '💬 שלב 1/5: סימולטור צ׳אט קבוצתי',
        promptHe:
          tier === 'explorer'
            ? 'שימי לב למילים Right now (ממש עכשיו)! בחרי את הפועל המתאים:'
            : tier === 'challenger'
            ? 'השלימי את ההודעה עם השילוב הנכון של Present Simple ו-Present Progressive:'
            : 'אתגר פעלי מצב (Stative Verbs) + Present Progressive:',
        hintHe:
          '💡 Usually = הרגל קבוע (Present Simple) | Today / Right now = קורה כרגע (am/is/are + ing).',
        speakerName: 'DJ Lexi',
        speakerAvatar: '🎧',
        questionEn:
          tier === 'explorer'
            ? 'Maya can’t answer her phone because she _______ the guitar right now.'
            : tier === 'challenger'
            ? 'Usually Noa _______ the bus, but today she _______ to the studio with her friends.'
            : 'We are at the studio right now! Which message is 100% grammatically correct?',
        options:
          tier === 'explorer'
            ? [
                {
                  textEn: 'is practicing',
                  isCorrect: true,
                  explanationHe: 'מעולה! Right now מעיד על פעולה שקורה ברגע זה: is + practicing.',
                },
                {
                  textEn: 'practices',
                  isCorrect: false,
                  explanationHe: 'practices מתאים להרגל קבוע (למשל every day), לא למה שקורה עכשיו.',
                },
                {
                  textEn: 'practicing',
                  isCorrect: false,
                  explanationHe: 'באנגלית אי אפשר להשתמש ב-ing בלי פועל עזר (am/is/are) לפניו!',
                },
              ]
            : tier === 'challenger'
            ? [
                {
                  textEn: 'takes / is walking',
                  isCorrect: true,
                  explanationHe: 'בול! takes להרגל קבוע (Usually), ו-is walking למה שקורה היום (today).',
                },
                {
                  textEn: 'is taking / walks',
                  isCorrect: false,
                  explanationHe: 'הפוך! Usually דורש Present Simple ו-today דורש Present Progressive.',
                },
                {
                  textEn: 'takes / walks',
                  isCorrect: false,
                  explanationHe: 'החלק השני מתאר שינוי זמני שקורה היום (today), ולכן צריך is walking.',
                },
              ]
            : [
                {
                  textEn: 'I love this melody, and right now the band is performing it live!',
                  isCorrect: true,
                  explanationHe: 'אלופה! הפועל love הוא פועל רגש (Stative Verb) שנשאר ב-Present Simple, ו-is performing ב-Progressive!',
                },
                {
                  textEn: 'I am loving this melody, and right now the band performs it live!',
                  isCorrect: false,
                  explanationHe: 'הפועל perform קורה ממש עכשיו ולכן דורש is performing.',
                },
                {
                  textEn: 'I am knowing all the words while the band is performing!',
                  isCorrect: false,
                  explanationHe: 'הפועל know הוא פועל מחשבה (Stative Verb) ולעולם לא מקבל ing!',
                },
              ],
      },
      {
        id: 'g7-u2-m1-s2',
        stepNumber: 2,
        type: 'sentence-builder',
        badgeLabelHe: '🧩 שלב 2/5: הרכבת משפט ממגנטים',
        promptHe: 'הרכיבי משפט ב-Present Progressive (זכרי את פועל העזר are!):',
        hintHe: '💡 They + are + practicing + their + new + dance + right + now.',
        questionEn: 'Build the sentence:',
        targetSentenceEn: 'They are practicing their new dance right now',
        targetSentenceHe: 'הן מתאמנות על הריקוד החדש שלהן ממש עכשיו.',
        scrambledWords:
          tier === 'explorer'
            ? ['now', 'They', 'practicing', 'are', 'their', 'new', 'dance', 'right']
            : ['now', 'They', 'practicing', 'are', 'their', 'new', 'dance', 'right', 'practice', 'is'],
      },
      {
        id: 'g7-u2-m1-s3',
        stepNumber: 3,
        type: 'voice-speak',
        badgeLabelHe: '🎙️ שלב 3/5: אימון קריאה ודיבור בקול',
        promptHe: 'האזיני למשפט מפרק 2 ואז הקליטי את עצמך קוראת אותו באנגלית:',
        hintHe: '💡 שימי לב למילה currently (כרגע) ולהגייה הברורה של walking.',
        questionEn: 'Read this sentence aloud:',
        speakTargetEn:
          'Usually Noa takes the bus, but today she is walking to the studio.',
        speakTargetHe: 'בדרך כלל נועה לוקחת אוטובוס, אבל היום היא הולכת ברגל לסטודיו.',
        focusWordEn: 'walking',
      },
      {
        id: 'g7-u2-m1-s4',
        stepNumber: 4,
        type: 'grammar-detective',
        badgeLabelHe: '🕵️‍♀️ שלב 4/5: בלשית הדקדוק',
        promptHe: 'דוברי עברית רבים שוכחים את am / is / are לפני ing. איזה משפט מתקן את הטעות?',
        hintHe: '💡 עבור She חייבים להוסיף is לפני הפועל recording.',
        questionEn: '❌ Wrong: "She currently recording a new song in the studio." — Fix it:',
        options: [
          {
            textEn: 'She is currently recording a new song in the studio.',
            isCorrect: true,
            explanationHe: 'מעולה! הוספת את פועל העזר is במקום המדויק.',
          },
          {
            textEn: 'She are currently recording a new song in the studio.',
            isCorrect: false,
            explanationHe: 'עבור She משתמשים ב-is (ולא ב-are).',
          },
          {
            textEn: 'She currently records a new song right now.',
            isCorrect: false,
            explanationHe: 'המילים currently ו-right now דורשות Present Progressive (is recording).',
          },
        ],
      },
      {
        id: 'g7-u2-m1-s5',
        stepNumber: 5,
        type: 'story-unseen',
        badgeLabelHe: '📖 שלב 5/5: מיני-Unseen מאחורי הקלעים',
        promptHe: 'קראי את הדיווח החי מאחורי הקלעים ועני על השאלה:',
        hintHe: '💡 שימי לב להבדל בין מה שהלהקה עושה כל קיץ (every summer) לבין מה שהם עושים הערב (tonight).',
        contextPassageEn:
          'The Starlight Band performs on big stages every summer. However, tonight is special! Right now, the singers are standing backstage and checking their microphones because the concert starts in five minutes.',
        contextPassageHe:
          'להקת Starlight מופיעה על במות גדולות כל קיץ. אבל הערב מיוחד! ממש עכשיו הזמרות עומדות מאחורי הקלעים ובודקות את המיקרופונים.',
        questionEn: 'What are the singers doing right now?',
        options: [
          {
            textEn: 'They are standing backstage and checking their microphones.',
            isCorrect: true,
            explanationHe: 'בול! זיהית בדיוק את הפעולות ב-Present Progressive שמתרחשות עכשיו!',
          },
          {
            textEn: 'They are buying tickets for next summer’s vacation.',
            isCorrect: false,
            explanationHe: 'זה לא מופיע בקטע — בדקי מה הן עושות backstage כרגע.',
          },
          {
            textEn: 'They are sleeping at the hotel.',
            isCorrect: false,
            explanationHe: 'ההופעה מתחילה בעוד 5 דקות, הן כבר מאחורי הקלעים!',
          },
        ],
      },
    ];
  }

  // Dynamic generator for all other missions across Grades 5, 6, 7, 8, 9
  const v0 = mission.vocabulary[0] || {
    wordEn: 'creative',
    partOfSpeech: 'adj',
    translationHe: 'יצירתי',
    exampleEn: mission.sampleSentenceEn,
    exampleHe: mission.sampleSentenceHe,
  };
  const v1 = mission.vocabulary[1] || v0;
  const tierObj = mission.tierObjectives[tier];
  const cleanWords = mission.sampleSentenceEn
    .replace(/[.!?"]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  return [
    {
      id: `${mission.id}-s1`,
      stepNumber: 1,
      type: 'chat-reply',
      badgeLabelHe: '💬 שלב 1/5: אתגר אוצר מילים בהקשר',
      promptHe: `בחרי את המשמעות הנכונה של המילה "${v0.wordEn}" מתוך הסיפור:`,
      hintHe: `💡 משפט לדוגמה: "${v0.exampleEn}" (${v0.exampleHe})`,
      speakerName: 'Studio Guide',
      speakerAvatar: mission.icon,
      questionEn: `In the sentence "${v0.exampleEn}", what does "${v0.wordEn}" mean?`,
      options: [
        {
          textEn: `${v0.translationHe} (${v0.wordEn})`,
          isCorrect: true,
          explanationHe: `מעולה! המילה "${v0.wordEn}" פירושה "${v0.translationHe}".`,
        },
        {
          textEn: 'לרוץ מהר מאוד (to sprint)',
          isCorrect: false,
          explanationHe: `לא בדיוק — בדקי את הרמז: "${v0.exampleHe}".`,
        },
        {
          textEn: 'לסגור את הדלת (to lock)',
          isCorrect: false,
          explanationHe: `נסי שוב! המשמעות של "${v0.wordEn}" היא "${v0.translationHe}".`,
        },
      ],
    },
    {
      id: `${mission.id}-s2`,
      stepNumber: 2,
      type: 'sentence-builder',
      badgeLabelHe: '🧩 שלב 2/5: הרכבת משפט המפתח',
      promptHe: 'לחצי על המילים לפי הסדר הנכון כדי להרכיב את משפט המפתח של המשימה:',
      hintHe: `💡 תרגום המשפט: "${mission.sampleSentenceHe}"`,
      questionEn: 'Tap the words in the right order:',
      targetSentenceEn: cleanWords.join(' '),
      targetSentenceHe: mission.sampleSentenceHe,
      scrambledWords: [...cleanWords].reverse(),
    },
    {
      id: `${mission.id}-s3`,
      stepNumber: 3,
      type: 'voice-speak',
      badgeLabelHe: '🎙️ שלב 3/5: אימון קריאה ודיבור (Voice Recognition)',
      promptHe: 'האזיני למשפט (רגיל או איטי) ואז הקליטי את עצמך קוראת אותו בקול:',
      hintHe: `💡 מילת המיקוד להיום: "${v0.wordEn}" (${v0.translationHe})`,
      questionEn: 'Speak this sentence aloud:',
      speakTargetEn: mission.sampleSentenceEn,
      speakTargetHe: mission.sampleSentenceHe,
      focusWordEn: v0.wordEn,
    },
    {
      id: `${mission.id}-s4`,
      stepNumber: 4,
      type: 'grammar-detective',
      badgeLabelHe: '🕵️‍♀️ שלב 4/5: מיקוד דקדוק ורמת קושי',
      promptHe: tierObj.focusHe,
      hintHe: `💡 נושא הדקדוק במשימה: ${mission.grammarTopic}`,
      questionEn: `Which sentence matches our "${mission.grammarTopic}" rule best?`,
      options: [
        {
          textEn: v1.exampleEn,
          isCorrect: true,
          explanationHe: `כל הכבוד! המשפט "${v1.exampleEn}" כתוב ללא שגיאות!`,
        },
        {
          textEn: 'She are going yesterday to the school.',
          isCorrect: false,
          explanationHe: 'במשפט הזה יש ערבוב זמנים ושגיאה ב-She are.',
        },
        {
          textEn: 'We doesn’t knows the answer right now.',
          isCorrect: false,
          explanationHe: 'עבור We משתמשים ב-don’t know (ולא ב-doesn’t knows).',
        },
      ],
    },
    {
      id: `${mission.id}-s5`,
      stepNumber: 5,
      type: 'story-unseen',
      badgeLabelHe: '📖 שלב 5/5: שאלת הבנה מסכמת',
      promptHe: 'קראי את משפטי המשימה ובחרי את התשובה הנכונה לסיום:',
      hintHe: `💡 זכרי את המילים שלמדנו: ${v0.wordEn} ו-${v1.wordEn}.`,
      contextPassageEn: `${mission.sampleSentenceEn} ${v0.exampleEn} ${v1.exampleEn}`,
      contextPassageHe: `${mission.sampleSentenceHe} ${v0.exampleHe}`,
      questionEn: `Which Hebrew meaning matches the word "${v1.wordEn}" from our story?`,
      options: [
        {
          textEn: v1.translationHe,
          isCorrect: true,
          explanationHe: `אלופה! סיימת את כל שלבי המשימה בהצלחה! 🎉`,
        },
        {
          textEn: 'מחשב נייד ישן',
          isCorrect: false,
          explanationHe: `בדקי שוב את המשפט: "${v1.exampleHe}".`,
        },
        {
          textEn: 'מזג אוויר סוער',
          isCorrect: false,
          explanationHe: `לא בדיוק — המשמעות של "${v1.wordEn}" היא "${v1.translationHe}".`,
        },
      ],
    },
  ];
}
