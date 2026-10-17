import { GradeId, ProficiencyTier } from '../../types/learner';

export interface VocabularyItem {
  wordEn: string;
  partOfSpeech: string;
  translationHe: string;
  exampleEn: string;
  exampleHe: string;
  /** Optional picture-emoji for the word (used for picture matching in early grades) */
  emoji?: string;
}

export interface TierObjective {
  tier: ProficiencyTier;
  focusHe: string;
  samplePromptEn: string;
  samplePromptHe: string;
}

/** A wrong-answer distractor word used in vocabulary matching drills. */
export interface DistractorWord {
  wordEn: string;
  translationHe: string;
}

/**
 * Compact authored data from which the 5-step elementary exercises are generated
 * (see `src/data/elementaryExercises.ts`).
 */
export interface DrillSeed {
  /** Two wrong words for the vocabulary match (step 1) and the cloze variant. */
  wrongWords: [DistractorWord, DistractorWord];
  /** Short 3–5 word sentence for Explorer sentence builder & speaking drill. */
  shortSentenceEn: string;
  shortSentenceHe: string;
  /** Step 4: mini rule / phonics / sentence-order check. */
  rule: {
    questionEn: string;
    correct: string;
    wrong: [string, string];
    explainHe: string;
    /** Hint shown before answering: how to decide, without naming the answer (Feature 20). */
    hintHe: string;
  };
  /** Step 5: short story with one comprehension question. */
  story: {
    passageEn: string;
    passageHe: string;
    questionEn: string;
    questionHe: string;
    correct: string;
    wrong: [string, string];
  };
}

export interface MissionNode {
  id: string;
  unitNumber: number;
  missionNumber: number;
  icon: string;
  isBoss?: boolean;
  titleEn: string;
  titleHe: string;
  storyHookHe: string;
  grammarTopic: string;
  estimatedMinutes: number;
  baseXp: number;
  baseDiamonds: number;
  skills: string[];
  sampleSentenceEn: string;
  sampleSentenceHe: string;
  vocabulary: VocabularyItem[];
  tierObjectives: Record<ProficiencyTier, TierObjective>;
  /** Authored seed for generated exercises (elementary grades 1–6). */
  drillSeed?: DrillSeed;
}

export interface CurriculumUnit {
  unitNumber: number;
  titleEn: string;
  titleHe: string;
  subtitleHe: string;
  badgeEmoji: string;
  missions: MissionNode[];
}

export interface GradeCurriculumPack {
  gradeId: GradeId;
  units: CurriculumUnit[];
}
