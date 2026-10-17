import { MissionNode } from './curriculum';
import { LearnerGender, ProficiencyTier } from '../types/learner';
import { inflectHebrew } from '../utils/hebrewGender';
import { seededShuffle, seededShuffleNotIdentity } from '../utils/shuffle';
import { buildElementaryExercises } from './elementaryExercises';
import {
  findAnswerSentenceNumber,
  getPronunciationTipHe,
  getSentenceOrderHintHe,
  isolateLtr,
} from '../utils/hints';

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
 * Answer options and scrambled sentence chips are shuffled with a seeded shuffle, so the correct
 * answer is not always first. Pass a per-attempt `salt` to vary the order between attempts while
 * keeping it stable across re-renders.
 */
export function getExercisesForMission(
  mission: MissionNode,
  tier: ProficiencyTier,
  gender: LearnerGender = 'girl',
  salt: number = 0
): MissionExerciseStep[] {
  const steps = getRawExercisesForMission(mission, tier);
  return steps.map((s) => {
    const gendered = applyGenderToStep(s, gender);
    const seedKey = `${mission.id}|${tier}|${s.id}|${salt}`;
    const targetKey = gendered.targetSentenceEn
      ? gendered.targetSentenceEn.replace(/[.!?",]/g, '').split(/\s+/).filter(Boolean).join('\u0000')
      : undefined;
    return {
      ...gendered,
      options: gendered.options ? seededShuffle(gendered.options, seedKey) : undefined,
      scrambledWords: gendered.scrambledWords
        ? seededShuffleNotIdentity(gendered.scrambledWords, `${seedKey}|words`, targetKey)
        : undefined,
    };
  });
}

function getRawExercisesForMission(
  mission: MissionNode,
  tier: ProficiencyTier
): MissionExerciseStep[] {
  // All missions across Grades 1 through 12 with drillSeed delegate to the structured generator
  if (mission.drillSeed) {
    return buildElementaryExercises(mission, tier);
  }

  // Graceful fallback for any dynamic mission node missing drillSeed
  const v0 = mission.vocabulary[0] || {
    wordEn: 'creative',
    partOfSpeech: 'adj',
    translationHe: 'יצירתי',
    exampleEn: mission.sampleSentenceEn,
    exampleHe: mission.sampleSentenceHe,
  };
  const v1 = mission.vocabulary[1] || v0;
  const tierObj = mission.tierObjectives[tier];
  const storyPassageEn = `${mission.sampleSentenceEn} ${v0.exampleEn} ${v1.exampleEn}`;
  const storySentence = findAnswerSentenceNumber(storyPassageEn, v1.wordEn, '');
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
      hintHe: `💡 כדאי לקרוא את המילה בתוך משפט: "${isolateLtr(v0.exampleEn)}"`,
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
      hintHe: `💡 ${getSentenceOrderHintHe(cleanWords)}`,
      questionEn: 'Tap the words in the right order:',
      targetSentenceEn: cleanWords.join(' '),
      targetSentenceHe: mission.sampleSentenceHe,
      scrambledWords: [...cleanWords],
    },
    {
      id: `${mission.id}-s3`,
      stepNumber: 3,
      type: 'voice-speak',
      badgeLabelHe: '🎙️ שלב 3/5: אימון קריאה ודיבור (Voice Recognition)',
      promptHe: 'האזיני למשפט (רגיל או איטי) ואז הקליטי את עצמך קוראת אותו בקול:',
      hintHe: `💡 ${getPronunciationTipHe(mission.sampleSentenceEn)}`,
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
      hintHe: '💡 כדאי לבדוק בכל משפט שהנושא והפועל מתאימים זה לזה, ושכל הפעלים באותו זמן.',
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
      hintHe: `💡 כדאי למצוא את "${v1.wordEn}" בסיפור${storySentence ? ` (משפט מספר ${storySentence})` : ''} ולהבין אותה מתוך המשפט.`,
      contextPassageEn: storyPassageEn,
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
