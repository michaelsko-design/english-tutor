import { GradeId } from '../../../types/learner';
import {
  CurriculumUnit,
  DrillSeed,
  GradeCurriculumPack,
  MissionNode,
  VocabularyItem,
} from '../types';

/** [wordEn, partOfSpeech, translationHe, emoji, exampleEn, exampleHe] */
export type VocabTuple = [string, string, string, string, string, string];

export interface MiddleSchoolMissionSpec {
  icon: string;
  /** Third mission of every unit is a Boss review mission. */
  isBoss?: boolean;
  titleEn: string;
  titleHe: string;
  storyHookHe: string;
  grammarTopic: string;
  skills: string[];
  /** Full key sentence of the mission (used for Challenger / Master). */
  sentenceEn: string;
  sentenceHe: string;
  /** 3–4 vocabulary words. The FIRST word is the mission's focus word for step 1. */
  vocab: VocabTuple[];
  seed: DrillSeed;
}

export interface MiddleSchoolUnitSpec {
  titleEn: string;
  titleHe: string;
  subtitleHe: string;
  badgeEmoji: string;
  missions: MiddleSchoolMissionSpec[];
}

const BASE_XP_BY_GRADE: Record<number, number> = {
  7: 60,
  8: 70,
  9: 85,
};

function gradeNumber(gradeId: GradeId): number {
  return parseInt(gradeId.replace('grade-', ''), 10);
}

function toVocabulary(tuples: VocabTuple[]): VocabularyItem[] {
  return tuples.map(([wordEn, partOfSpeech, translationHe, emoji, exampleEn, exampleHe]) => ({
    wordEn,
    partOfSpeech,
    translationHe,
    emoji,
    exampleEn,
    exampleHe,
  }));
}

function buildMission(
  gradeId: GradeId,
  unitNumber: number,
  missionNumber: number,
  spec: MiddleSchoolMissionSpec
): MissionNode {
  const grade = gradeNumber(gradeId);
  const isBoss = Boolean(spec.isBoss);
  const baseXp =
    (BASE_XP_BY_GRADE[grade] ?? 75) + (unitNumber - 1) * 5 + (missionNumber - 1) * 5 + (isBoss ? 15 : 0);
  const baseDiamonds = Math.round(baseXp / 4);
  const estimatedMinutes = 4 + (isBoss ? 1 : 0);
  const words = spec.vocab.map((v) => v[0]).join(', ');
  const { seed } = spec;

  const mission: MissionNode = {
    id: `g${grade}-u${unitNumber}-m${missionNumber}`,
    unitNumber,
    missionNumber,
    icon: spec.icon,
    titleEn: spec.titleEn,
    titleHe: spec.titleHe,
    storyHookHe: spec.storyHookHe,
    grammarTopic: spec.grammarTopic,
    estimatedMinutes,
    baseXp,
    baseDiamonds,
    skills: spec.skills,
    sampleSentenceEn: spec.sentenceEn,
    sampleSentenceHe: spec.sentenceHe,
    vocabulary: toVocabulary(spec.vocab),
    tierObjectives: {
      explorer: {
        tier: 'explorer',
        focusHe: `זיהוי והבנת אוצר המילים ומשפט המפתח: ${words}`,
        samplePromptEn: seed.shortSentenceEn,
        samplePromptHe: seed.shortSentenceHe,
      },
      challenger: {
        tier: 'challenger',
        focusHe: 'שליטה במבנה הדקדוקי והגיית המשפט המלא',
        samplePromptEn: spec.sentenceEn,
        samplePromptHe: spec.sentenceHe,
      },
      master: {
        tier: 'master',
        focusHe: 'ניתוח טקסט עיוני / סיפור קצר ודיבור שוטף',
        samplePromptEn: seed.story.passageEn,
        samplePromptHe: seed.story.passageHe,
      },
    },
    drillSeed: seed,
  };
  if (isBoss) mission.isBoss = true;
  return mission;
}

/** Expands compact unit/mission specs into a full GradeCurriculumPack for Middle School. */
export function buildMiddleSchoolGrade(
  gradeId: GradeId,
  units: MiddleSchoolUnitSpec[]
): GradeCurriculumPack {
  const builtUnits: CurriculumUnit[] = units.map((u, uIdx) => {
    const unitNumber = uIdx + 1;
    return {
      unitNumber,
      titleEn: u.titleEn,
      titleHe: u.titleHe,
      subtitleHe: u.subtitleHe,
      badgeEmoji: u.badgeEmoji,
      missions: u.missions.map((m, mIdx) => buildMission(gradeId, unitNumber, mIdx + 1, m)),
    };
  });
  return { gradeId, units: builtUnits };
}
