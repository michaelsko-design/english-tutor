import { MissionNode } from './curriculum';
import { ProficiencyTier } from '../types/learner';
import type { MissionExerciseStep, MultipleChoiceOption } from './missionExercises';

/**
 * Generates the 5-step mission for elementary missions (Grades 1–6) from the
 * authored `mission.drillSeed` + vocabulary. Difficulty scales with the tier:
 *
 *  - Explorer:   picture → English word (2 options), short sentence, 2-option checks, Hebrew help.
 *  - Challenger: English word → Hebrew meaning (3 options), full sentence.
 *  - Master:     Hebrew → English word (3 options), full sentence, story without Hebrew translation.
 *
 * Options are returned in authored order (correct first); the caller shuffles them.
 */
export function buildElementaryExercises(
  mission: MissionNode,
  tier: ProficiencyTier
): MissionExerciseStep[] {
  const seed = mission.drillSeed;
  if (!seed) return [];

  const v0 = mission.vocabulary[0];
  const [wrongA, wrongB] = seed.wrongWords;
  const isExplorer = tier === 'explorer';
  const isMaster = tier === 'master';

  // ---- Step 1: vocabulary match -------------------------------------------------
  let step1: MissionExerciseStep;
  const correctExplain = `מעולה! ${v0.emoji ? `${v0.emoji} ` : ''}${v0.wordEn} פירושו "${v0.translationHe}".`;
  const wrongExplain = (w: { wordEn: string; translationHe: string }) =>
    `לא בדיוק — ${w.wordEn} פירושו "${w.translationHe}". נסי שוב!`;

  if (isExplorer) {
    const opts: MultipleChoiceOption[] = [
      { textEn: v0.wordEn, isCorrect: true, explanationHe: correctExplain },
      { textEn: wrongA.wordEn, isCorrect: false, explanationHe: wrongExplain(wrongA) },
    ];
    step1 = {
      id: `${mission.id}-s1`,
      stepNumber: 1,
      type: 'chat-reply',
      badgeLabelHe: '💬 שלב 1/5: איזו מילה זו?',
      promptHe: v0.emoji
        ? 'איזו מילה באנגלית מתאימה לתמונה? בחרי:'
        : `איזו מילה באנגלית פירושה "${v0.translationHe}"? בחרי:`,
      hintHe: `💡 רמז: המילה מתחילה באות ${v0.wordEn.charAt(0).toUpperCase()}`,
      speakerName: 'Word Guide',
      speakerAvatar: mission.icon,
      questionEn: v0.emoji ? `What is this? ${v0.emoji}` : 'Which word is right?',
      options: opts,
    };
  } else if (!isMaster) {
    step1 = {
      id: `${mission.id}-s1`,
      stepNumber: 1,
      type: 'chat-reply',
      badgeLabelHe: '💬 שלב 1/5: מה פירוש המילה?',
      promptHe: 'מה המשמעות של המילה באנגלית? בחרי את התרגום הנכון:',
      hintHe: `💡 משפט לדוגמה: "${v0.exampleEn}" (${v0.exampleHe})`,
      speakerName: 'Word Guide',
      speakerAvatar: mission.icon,
      questionEn: `What does "${v0.wordEn}" mean?`,
      options: [
        { textEn: v0.translationHe, isCorrect: true, explanationHe: correctExplain },
        { textEn: wrongA.translationHe, isCorrect: false, explanationHe: wrongExplain(wrongA) },
        { textEn: wrongB.translationHe, isCorrect: false, explanationHe: wrongExplain(wrongB) },
      ],
    };
  } else {
    step1 = {
      id: `${mission.id}-s1`,
      stepNumber: 1,
      type: 'chat-reply',
      badgeLabelHe: '💬 שלב 1/5: איך אומרים באנגלית?',
      promptHe: `איך אומרים באנגלית "${v0.translationHe}"? בחרי את המילה הנכונה:`,
      hintHe: `💡 משפט לדוגמה: "${v0.exampleEn}"`,
      speakerName: 'Word Guide',
      speakerAvatar: mission.icon,
      questionEn: 'Which English word is right?',
      options: [
        { textEn: v0.wordEn, isCorrect: true, explanationHe: correctExplain },
        { textEn: wrongA.wordEn, isCorrect: false, explanationHe: wrongExplain(wrongA) },
        { textEn: wrongB.wordEn, isCorrect: false, explanationHe: wrongExplain(wrongB) },
      ],
    };
  }

  // ---- Step 2: sentence builder -------------------------------------------------
  const sentenceEn = isExplorer ? seed.shortSentenceEn : mission.sampleSentenceEn;
  const sentenceHe = isExplorer ? seed.shortSentenceHe : mission.sampleSentenceHe;
  const cleanWords = sentenceEn
    .replace(/[.!?",]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  const step2: MissionExerciseStep = {
    id: `${mission.id}-s2`,
    stepNumber: 2,
    type: 'sentence-builder',
    badgeLabelHe: '🧩 שלב 2/5: הרכבת משפט',
    promptHe: 'לחצי על המילים לפי הסדר הנכון כדי להרכיב את המשפט:',
    hintHe: `💡 תרגום המשפט: "${sentenceHe}"`,
    questionEn: 'Tap the words in the right order:',
    targetSentenceEn: sentenceEn,
    targetSentenceHe: sentenceHe,
    scrambledWords: [...cleanWords],
  };

  // ---- Step 3: voice drill ------------------------------------------------------
  const step3: MissionExerciseStep = {
    id: `${mission.id}-s3`,
    stepNumber: 3,
    type: 'voice-speak',
    badgeLabelHe: '🎙️ שלב 3/5: אימון קריאה ודיבור',
    promptHe: 'האזיני למשפט (רגיל או איטי) ואז הקליטי את עצמך קוראת אותו בקול:',
    hintHe: `💡 מילת המיקוד להיום: "${v0.wordEn}" (${v0.translationHe})`,
    questionEn: 'Speak this sentence aloud:',
    speakTargetEn: sentenceEn,
    speakTargetHe: sentenceHe,
    focusWordEn: v0.wordEn,
  };

  // ---- Step 4: mini rule / phonics check ----------------------------------------
  const ruleOpts: MultipleChoiceOption[] = [
    {
      textEn: seed.rule.correct,
      isCorrect: true,
      explanationHe: `כל הכבוד! ${seed.rule.explainHe}`,
    },
    {
      textEn: seed.rule.wrong[0],
      isCorrect: false,
      explanationHe: `כמעט! ${seed.rule.explainHe}`,
    },
  ];
  if (!isExplorer) {
    ruleOpts.push({
      textEn: seed.rule.wrong[1],
      isCorrect: false,
      explanationHe: `לא בדיוק. ${seed.rule.explainHe}`,
    });
  }
  const step4: MissionExerciseStep = {
    id: `${mission.id}-s4`,
    stepNumber: 4,
    type: 'grammar-detective',
    badgeLabelHe: '🕵️‍♀️ שלב 4/5: בלשית הדקדוק',
    promptHe: isExplorer
      ? 'בחרי את התשובה הנכונה (יש רק שתי אפשרויות):'
      : 'בחרי את התשובה הנכונה:',
    hintHe: `💡 נושא המשימה: ${mission.grammarTopic}`,
    questionEn: seed.rule.questionEn,
    options: ruleOpts,
  };

  // ---- Step 5: mini story -------------------------------------------------------
  const storyOpts: MultipleChoiceOption[] = [
    {
      textEn: seed.story.correct,
      isCorrect: true,
      explanationHe: 'אלופה! סיימת את כל שלבי המשימה בהצלחה! 🎉',
    },
    {
      textEn: seed.story.wrong[0],
      isCorrect: false,
      explanationHe: 'נסי שוב — חפשי את התשובה בסיפור 🔍',
    },
  ];
  if (!isExplorer) {
    storyOpts.push({
      textEn: seed.story.wrong[1],
      isCorrect: false,
      explanationHe: 'כמעט! קראי שוב את הסיפור ובדקי 🔍',
    });
  }
  const step5: MissionExerciseStep = {
    id: `${mission.id}-s5`,
    stepNumber: 5,
    type: 'story-unseen',
    badgeLabelHe: '📖 שלב 5/5: סיפור קצר והבנת הנקרא',
    promptHe: isExplorer
      ? `קראי את הסיפור הקצר. ${seed.story.questionHe}`
      : 'קראי את הסיפור ובחרי את התשובה הנכונה:',
    hintHe: `💡 זכרי את המילים שלמדנו: ${mission.vocabulary
      .slice(0, 2)
      .map((v) => v.wordEn)
      .join(', ')}.`,
    contextPassageEn: seed.story.passageEn,
    contextPassageHe: isMaster ? undefined : seed.story.passageHe,
    questionEn: seed.story.questionEn,
    options: storyOpts,
  };

  return [step1, step2, step3, step4, step5];
}
