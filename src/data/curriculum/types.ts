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

/**
 * A phonics mission of grade 1 (Feature 48): the letters A–Z, then blending letters into words.
 * Its steps come from its own generators instead of a drill seed.
 */
export type PhonicsMission =
  | { kind: 'letters'; letters: string[] }
  | {
      kind: 'blending';
      /** Words to read, each built from the letters taught in units 1–4 */
      words: string[];
      /** Words read whole, not sounded out ("the", "is") */
      sightWords?: string[];
      /** The sound pattern of the mission, e.g. "a" or "sh", shown in its lesson */
      focus: string;
    };

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
  /** A grade 1 letters or blending mission; it has no drill seed */
  phonics?: PhonicsMission;
}

/** A unit of phonics missions (grade 1 units 1–6): no exam bank and no contest sentences. */
export function isPhonicsUnit(unit: { missions: readonly MissionNode[] }): boolean {
  return unit.missions.length > 0 && unit.missions.every((mission) => mission.phonics !== undefined);
}

export interface CurriculumUnit {
  unitNumber: number;
  titleEn: string;
  titleHe: string;
  subtitleHe: string;
  badgeEmoji: string;
  missions: MissionNode[];
  /** The content pack the unit came from (`packs/registry.ts`); missing on the grade's own units */
  packId?: string;
  /**
   * The unlock track of a pack that opens on its own (the holidays pack): its missions follow
   * one another but don't wait for the main path. Missing on the main path.
   */
  track?: string;
}

export interface GradeCurriculumPack {
  gradeId: GradeId;
  units: CurriculumUnit[];
}
