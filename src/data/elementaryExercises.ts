import { MissionNode } from './curriculum';
import { LearnerGender, ProficiencyTier } from '../types/learner';
import type { MissionExerciseStep, MultipleChoiceOption } from './missionExercises';
import {
  findAnswerSentenceNumber,
  getPronunciationTipHe,
  getSentenceOrderHintHe,
  getWordShapeHintHe,
  isolateLtr,
  toClozeSentence,
} from '../utils/hints';
import { hebrewTemplate } from '../utils/hebrewGender';

/**
 * Generates the 5-step mission for elementary missions (Grades 1–6) from the
 * authored `mission.drillSeed` + vocabulary. Difficulty scales with the tier:
 *
 *  - Explorer:   picture → English word (2 options), short sentence, 2-option checks, Hebrew help.
 *  - Challenger: English word → Hebrew meaning (3 options), full sentence.
 *  - Master:     Hebrew → English word (3 options), full sentence, story without Hebrew translation.
 *
 * Options are returned in authored order (correct first); the caller shuffles them.
 * Only the instruction templates follow the learner's gender (`he`); story text, questions and
 * other authored data are put in as written.
 */
export function buildElementaryExercises(
  mission: MissionNode,
  tier: ProficiencyTier,
  gender: LearnerGender = 'girl'
): MissionExerciseStep[] {
  const he = hebrewTemplate(gender);
  const seed = mission.drillSeed;
  if (!seed) return [];

  const v0 = mission.vocabulary[0];
  const [wrongA, wrongB] = seed.wrongWords;
  const isExplorer = tier === 'explorer';
  const isMaster = tier === 'master';

  // ---- Step 1: vocabulary match -------------------------------------------------
  let step1: MissionExerciseStep;
  const correctExplain = he`מעולה! ${v0.emoji ? `${v0.emoji} ` : ''}${v0.wordEn} פירושו "${v0.translationHe}".`;
  const wrongExplain = (w: { wordEn: string; translationHe: string }) =>
    he`לא בדיוק — ${w.wordEn} פירושו "${w.translationHe}". נסי שוב!`;

  const isMiddleOrHigh =
    mission.id.startsWith('g7-') ||
    mission.id.startsWith('g8-') ||
    mission.id.startsWith('g9-') ||
    mission.id.startsWith('g10-') ||
    mission.id.startsWith('g11-') ||
    mission.id.startsWith('g12-');

  // English-word options: a fill-in-the-blank example needs real understanding, while a letter
  // clue would single out one of only two or three options.
  const cloze = toClozeSentence(v0.exampleEn, v0.wordEn);
  const englishOptionHint = (others: string[]) =>
    cloze
      ? he`💡 איזו מילה משלימה את המשפט? "${isolateLtr(cloze)}"`
      : `💡 ${getWordShapeHintHe(v0.wordEn, others)}`;

  if (isExplorer) {
    const opts: MultipleChoiceOption[] = [
      { textEn: v0.wordEn, isCorrect: true, explanationHe: correctExplain },
      { textEn: wrongA.wordEn, isCorrect: false, explanationHe: wrongExplain(wrongA) },
    ];
    step1 = {
      id: `${mission.id}-s1`,
      stepNumber: 1,
      type: 'chat-reply',
      badgeLabelHe: he`💬 שלב 1/5: איזו מילה זו?`,
      promptHe: isMiddleOrHigh
        ? he`איזו מילה באנגלית פירושה "${v0.translationHe}"? בחרי:`
        : v0.emoji
        ? he`איזו מילה באנגלית מתאימה לתמונה? בחרי:`
        : he`איזו מילה באנגלית פירושה "${v0.translationHe}"? בחרי:`,
      hintHe: englishOptionHint([wrongA.wordEn]),
      speakerName: 'Word Guide',
      speakerAvatar: mission.icon,
      questionEn: isMiddleOrHigh
        ? `Which English word means "${v0.translationHe}"?`
        : v0.emoji
        ? `What is this? ${v0.emoji}`
        : 'Which word is right?',
      options: opts,
    };
  } else if (!isMaster) {
    step1 = {
      id: `${mission.id}-s1`,
      stepNumber: 1,
      type: 'chat-reply',
      badgeLabelHe: he`💬 שלב 1/5: מה פירוש המילה?`,
      promptHe: he`מה המשמעות של המילה באנגלית? בחרי את התרגום הנכון:`,
      hintHe: he`💡 כדאי לקרוא את המילה בתוך משפט: "${isolateLtr(v0.exampleEn)}"`,
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
      badgeLabelHe: he`💬 שלב 1/5: איך אומרים באנגלית?`,
      promptHe: he`איך אומרים באנגלית "${v0.translationHe}"? בחרי את המילה הנכונה:`,
      hintHe: englishOptionHint([wrongA.wordEn, wrongB.wordEn]),
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
    badgeLabelHe: he`🧩 שלב 2/5: הרכבת משפט`,
    promptHe: he`לחצי על המילים לפי הסדר הנכון כדי להרכיב את המשפט:`,
    hintHe: `💡 ${getSentenceOrderHintHe(cleanWords)}`,
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
    badgeLabelHe: he`🎙️ שלב 3/5: אימון קריאה ודיבור`,
    promptHe: he`האזיני למשפט (רגיל או איטי) ואז הקליטי את עצמך קוראת אותו בקול:`,
    hintHe: `💡 ${getPronunciationTipHe(sentenceEn)}`,
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
      explanationHe: he`כל הכבוד! ${seed.rule.explainHe}`,
    },
    {
      textEn: seed.rule.wrong[0],
      isCorrect: false,
      explanationHe: he`כמעט! ${seed.rule.explainHe}`,
    },
  ];
  if (!isExplorer) {
    ruleOpts.push({
      textEn: seed.rule.wrong[1],
      isCorrect: false,
      explanationHe: he`לא בדיוק. ${seed.rule.explainHe}`,
    });
  }
  const step4: MissionExerciseStep = {
    id: `${mission.id}-s4`,
    stepNumber: 4,
    type: 'grammar-detective',
    badgeLabelHe: he`🕵️‍♀️ שלב 4/5: בלשית הדקדוק`,
    promptHe: isExplorer
      ? he`בחרי את התשובה הנכונה (יש רק שתי אפשרויות):`
      : he`בחרי את התשובה הנכונה:`,
    hintHe: `💡 ${seed.rule.hintHe}`,
    questionEn: seed.rule.questionEn,
    options: ruleOpts,
  };

  // ---- Step 5: mini story -------------------------------------------------------
  const storyOpts: MultipleChoiceOption[] = [
    {
      textEn: seed.story.correct,
      isCorrect: true,
      explanationHe: he`אלופה! סיימת את כל שלבי המשימה בהצלחה! 🎉`,
    },
    {
      textEn: seed.story.wrong[0],
      isCorrect: false,
      explanationHe: he`נסי שוב — חפשי את התשובה בסיפור 🔍`,
    },
  ];
  if (!isExplorer) {
    storyOpts.push({
      textEn: seed.story.wrong[1],
      isCorrect: false,
      explanationHe: he`כמעט! קראי שוב את הסיפור ובדקי 🔍`,
    });
  }
  const step5: MissionExerciseStep = {
    id: `${mission.id}-s5`,
    stepNumber: 5,
    type: 'story-unseen',
    badgeLabelHe: he`📖 שלב 5/5: סיפור קצר והבנת הנקרא`,
    promptHe: isExplorer
      ? he`קראי את הסיפור הקצר. ${seed.story.questionHe}`
      : he`קראי את הסיפור ובחרי את התשובה הנכונה:`,
    hintHe: getStoryHintHe(seed.story, isExplorer),
    contextPassageEn: seed.story.passageEn,
    contextPassageHe: isMaster ? undefined : seed.story.passageHe,
    questionEn: seed.story.questionEn,
    options: storyOpts,
  };

  return [step1, step2, step3, step4, step5];
}

/**
 * Points to the story sentence that holds the answer. Challenger and Master also get the question
 * in Hebrew; Explorer already sees it in the prompt.
 */
export function getStoryHintHe(
  story: { passageEn: string; questionEn: string; questionHe: string; correct: string },
  isExplorer: boolean
): string {
  const sentenceNumber = findAnswerSentenceNumber(story.passageEn, story.correct, story.questionEn);
  const where = sentenceNumber
    ? `התשובה נמצאת במשפט מספר ${sentenceNumber} בסיפור.`
    : 'כדאי לחפש בסיפור את המילים מהשאלה.';
  return isExplorer ? `💡 ${where}` : `💡 ${where} השאלה בעברית: "${story.questionHe}"`;
}
