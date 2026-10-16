import { GradeId, ProficiencyTier } from '../../types/learner';

export interface VocabularyItem {
  wordEn: string;
  partOfSpeech: string;
  translationHe: string;
  exampleEn: string;
  exampleHe: string;
}

export interface TierObjective {
  tier: ProficiencyTier;
  focusHe: string;
  samplePromptEn: string;
  samplePromptHe: string;
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
