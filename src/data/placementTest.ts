import { CURRICULUM_BY_GRADE, MissionNode } from './curriculum';
import {
  GradeId,
  LearnerGender,
  LearnerProfile,
  PlacementResult,
  ProficiencyTier,
} from '../types/learner';
import { inflectHebrew } from '../utils/hebrewGender';
import { seededShuffle } from '../utils/shuffle';

/**
 * Diagnostic placement test (Feature 11).
 *
 * Questions are generated from the curriculum's drill seeds (one grammar-rule item and one
 * vocabulary-meaning item per mission). Difficulty follows an up/down staircase across grades
 * 1–12, and the level estimate comes from the answers in the second half of the test.
 */

export const PLACEMENT_QUESTION_COUNT = 10;
export const PLACEMENT_REWARD_XP = 30;
export const PLACEMENT_REWARD_DIAMONDS = 10;

const MIN_GRADE = 1;
const MAX_GRADE = 12;
/** The first questions move two grades at a time to find the learner's range quickly. */
const COARSE_STEP_QUESTIONS = 3;
/** Answers from this (0-based) index on are used for the level estimate. */
const ESTIMATE_FROM_INDEX = 4;
const XP_PER_LEVEL = 150;

export type PlacementQuestionKind = 'rule' | 'vocab';

export interface PlacementOption {
  text: string;
  isCorrect: boolean;
}

export interface PlacementQuestion {
  id: string;
  gradeNum: number;
  kind: PlacementQuestionKind;
  promptHe: string;
  questionEn: string;
  options: PlacementOption[];
}

export interface PlacementAnswer {
  questionId: string;
  difficulty: number;
  isCorrect: boolean;
}

function clampGrade(grade: number): number {
  return Math.min(MAX_GRADE, Math.max(MIN_GRADE, grade));
}

export function gradeIdToNumber(gradeId: GradeId): number {
  return parseInt(gradeId.replace('grade-', ''), 10);
}

export function gradeNumberToId(grade: number): GradeId {
  return `grade-${clampGrade(Math.round(grade))}` as GradeId;
}

function buildMissionQuestions(
  mission: MissionNode,
  gradeNum: number,
  gender: LearnerGender
): PlacementQuestion[] {
  const seed = mission.drillSeed;
  const focusWord = mission.vocabulary[0];
  if (!seed || !focusWord) return [];

  const vocab: PlacementQuestion = {
    id: `${mission.id}-vocab`,
    gradeNum,
    kind: 'vocab',
    promptHe: inflectHebrew('בחרי את התרגום הנכון למילה באנגלית:', gender),
    questionEn: `What does "${focusWord.wordEn}" mean?`,
    options: [
      { text: focusWord.translationHe, isCorrect: true },
      ...seed.wrongWords.map((w) => ({ text: w.translationHe, isCorrect: false })),
    ],
  };

  const rule: PlacementQuestion = {
    id: `${mission.id}-rule`,
    gradeNum,
    kind: 'rule',
    promptHe: inflectHebrew('בחרי את התשובה הנכונה:', gender),
    questionEn: seed.rule.questionEn,
    options: [
      { text: seed.rule.correct, isCorrect: true },
      ...seed.rule.wrong.map((w) => ({ text: w, isCorrect: false })),
    ],
  };

  return [vocab, rule];
}

/** All placement items for one grade, in curriculum order (options unshuffled). */
export function buildPlacementPool(gradeNum: number, gender: LearnerGender): PlacementQuestion[] {
  const pack = CURRICULUM_BY_GRADE[gradeNumberToId(gradeNum)];
  return pack.units
    .flatMap((u) => u.missions)
    .flatMap((m) => buildMissionQuestions(m, gradeNum, gender));
}

/** The test starts one grade below the school grade so it opens with a confidence win. */
export function getStartingDifficulty(schoolGrade: number): number {
  return clampGrade(schoolGrade - 1);
}

/** Staircase step: up after a correct answer, down after a wrong one. */
export function nextDifficulty(current: number, isCorrect: boolean, questionIndex: number): number {
  const step = questionIndex < COARSE_STEP_QUESTIONS ? 2 : 1;
  return clampGrade(current + (isCorrect ? step : -step));
}

/**
 * Picks an unused question at `gradeNum`, alternating vocab (even index) and rule (odd index)
 * items. The same `salt` gives the same question and option order, so the pick is stable
 * across re-renders but changes between attempts.
 */
export function pickNextQuestion(
  gradeNum: number,
  questionIndex: number,
  usedIds: readonly string[],
  gender: LearnerGender,
  salt: number
): PlacementQuestion {
  const pool = seededShuffle(buildPlacementPool(gradeNum, gender), `placement|${salt}|g${gradeNum}`);
  const preferredKind: PlacementQuestionKind = questionIndex % 2 === 0 ? 'vocab' : 'rule';
  const unused = pool.filter((q) => !usedIds.includes(q.id));
  const picked = unused.find((q) => q.kind === preferredKind) ?? unused[0] ?? pool[0];

  return {
    ...picked,
    options: seededShuffle(picked.options, `placement|${salt}|${picked.id}`),
  };
}

/** The tier within the recommended grade, so a learner moved to an easier grade isn't also given the easiest tier. */
function recommendTier(estimate: number, recommendedGrade: number): ProficiencyTier {
  const diff = estimate - recommendedGrade;
  if (diff <= -1) return 'explorer';
  if (diff === 0) return 'challenger';
  return 'master';
}

/**
 * Mastery shown by one answer: a correct answer at grade g shows mastery of g, a wrong one
 * shows mastery of g − 1. A correct answer at the top grade counts as passing beyond it, so
 * the staircase ceiling (and likewise the floor, via 0) doesn't hide very strong or very
 * early learners.
 */
function masteryEvidence(answer: PlacementAnswer): number {
  if (!answer.isCorrect) return answer.difficulty - 1;
  return answer.difficulty >= MAX_GRADE ? MAX_GRADE + 1 : answer.difficulty;
}

/**
 * Turns the answers into a placement result. The raw estimate is the rounded mean mastery
 * evidence of the answers in the estimate window. The tier uses the raw estimate, so it can
 * fall outside 1–12; the grade ids are clamped.
 */
export function computePlacementResult(
  answers: readonly PlacementAnswer[],
  schoolGrade: number,
  completedAt: string
): PlacementResult {
  const window = answers.length > ESTIMATE_FROM_INDEX ? answers.slice(ESTIMATE_FROM_INDEX) : answers;
  const evidence = window.map(masteryEvidence);
  const mean = evidence.length
    ? evidence.reduce((sum, g) => sum + g, 0) / evidence.length
    : schoolGrade;
  const rawEstimate = Math.round(mean);
  const estimate = clampGrade(rawEstimate);
  const recommendedGrade = Math.abs(estimate - schoolGrade) >= 2 ? estimate : schoolGrade;

  return {
    completedAt,
    estimatedGradeId: gradeNumberToId(estimate),
    recommendedGradeId: gradeNumberToId(recommendedGrade),
    recommendedTier: recommendTier(rawEstimate, recommendedGrade),
    correctCount: answers.filter((a) => a.isCorrect).length,
    totalQuestions: answers.length,
  };
}

/**
 * The result for a learner who can't read English yet: no questions, the letters of grade 1 at the
 * easiest tier, whatever their school grade (the ±2 rule doesn't apply).
 */
export function buildNonReaderResult(completedAt: string): PlacementResult {
  return {
    completedAt,
    estimatedGradeId: 'grade-1',
    recommendedGradeId: 'grade-1',
    recommendedTier: 'explorer',
    correctCount: 0,
    totalQuestions: 0,
    isNonReader: true,
  };
}

/** The question that opens the placement test, read aloud in Hebrew (the learner may not read yet). */
export function getReadGateCopy(gender: LearnerGender): { questionHe: string; yesHe: string; notYetHe: string } {
  return {
    questionHe: gender === 'girl' ? 'האם את יודעת לקרוא באנגלית?' : 'האם אתה יודע לקרוא באנגלית?',
    yesHe: gender === 'girl' ? 'כן, אני יודעת לקרוא' : 'כן, אני יודע לקרוא',
    notYetHe: 'עוד לא',
  };
}

/** The line on the result screen of a learner who can't read English yet. */
export const NON_READER_RESULT_HE = 'נתחיל ממש מההתחלה: מהאותיות! 🔤';

/** The learner's school grade: set at onboarding, before a placement test changed the practice grade. */
export function getSchoolGradeId(profile: LearnerProfile): GradeId {
  return profile.schoolGradeId ?? profile.gradeId;
}

/**
 * Saves the result on the profile, optionally applying the recommended grade and tier.
 * The XP and diamond reward is granted only for the learner's first completed test.
 */
export function applyPlacementToProfile(
  profile: LearnerProfile,
  result: PlacementResult,
  applyRecommendation: boolean
): LearnerProfile {
  const isFirstTest = !profile.placementResult;
  const xp = profile.stats.xp + (isFirstTest ? PLACEMENT_REWARD_XP : 0);

  return {
    ...profile,
    placementResult: result,
    // The grade the learner is in at school stays the base of later tests
    schoolGradeId: getSchoolGradeId(profile),
    gradeId: applyRecommendation ? result.recommendedGradeId : profile.gradeId,
    preferredTier: applyRecommendation ? result.recommendedTier : profile.preferredTier,
    stats: {
      ...profile.stats,
      xp,
      level: Math.max(profile.stats.level, Math.floor(xp / XP_PER_LEVEL) + 1),
      diamonds: profile.stats.diamonds + (isFirstTest ? PLACEMENT_REWARD_DIAMONDS : 0),
    },
  };
}
