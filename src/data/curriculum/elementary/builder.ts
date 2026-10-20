import { GradeId } from '../../../types/learner';
import {
  CurriculumUnit,
  DrillSeed,
  GradeCurriculumPack,
  MissionNode,
  VocabularyItem,
} from '../types';
import { buildPhonicsMission, PhonicsMissionSpec } from './phonicsBuilder';

/** [wordEn, partOfSpeech, translationHe, emoji, exampleEn, exampleHe] */
export type VocabTuple = [string, string, string, string, string, string];

export interface ElementaryMissionSpec {
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

export interface ElementaryUnitSpec {
  titleEn: string;
  titleHe: string;
  subtitleHe: string;
  badgeEmoji: string;
  /**
   * The unit number in the mission ids when it differs from the unit's place: grade 1's letters
   * and blending units came first later (Feature 48), so they use new ids (g1-u11…) and the older
   * units kept theirs (g1-u1…), which keeps every learner's stars on the missions they played.
   */
  idUnitNumber?: number;
  /** Grade 1's phonics units hold letters and blending missions (Feature 48) */
  missions: (ElementaryMissionSpec | PhonicsMissionSpec)[];
}

const BASE_XP_BY_GRADE: Record<number, number> = {
  1: 30,
  2: 35,
  3: 40,
  4: 45,
  5: 50,
  6: 55,
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
  spec: ElementaryMissionSpec,
  idUnitNumber = unitNumber
): MissionNode {
  const grade = gradeNumber(gradeId);
  const isBoss = Boolean(spec.isBoss);
  const baseXp =
    (BASE_XP_BY_GRADE[grade] ?? 40) + (idUnitNumber - 1) * 5 + (missionNumber - 1) * 5 + (isBoss ? 15 : 0);
  const baseDiamonds = Math.round(baseXp / 4);
  const estimatedMinutes = (grade <= 2 ? 2 : grade <= 4 ? 3 : 4) + (isBoss ? 1 : 0);
  const words = spec.vocab.map((v) => v[0]).join(', ');
  const { seed } = spec;

  const mission: MissionNode = {
    id: `g${grade}-u${idUnitNumber}-m${missionNumber}`,
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
        focusHe: `זיהוי והתאמה של המילים: ${words}`,
        samplePromptEn: seed.shortSentenceEn,
        samplePromptHe: seed.shortSentenceHe,
      },
      challenger: {
        tier: 'challenger',
        focusHe: 'הרכבת משפט שלם וקריאתו בקול ברור',
        samplePromptEn: spec.sentenceEn,
        samplePromptHe: spec.sentenceHe,
      },
      master: {
        tier: 'master',
        focusHe: 'קריאה שוטפת והבנת הנקרא של סיפור קצר',
        samplePromptEn: seed.story.passageEn,
        samplePromptHe: seed.story.passageHe,
      },
    },
    drillSeed: seed,
  };
  if (isBoss) mission.isBoss = true;
  return mission;
}

/** Expands compact unit/mission specs into a full GradeCurriculumPack. */
export function buildElementaryGrade(
  gradeId: GradeId,
  units: ElementaryUnitSpec[]
): GradeCurriculumPack {
  const builtUnits: CurriculumUnit[] = units.map((u, uIdx) => {
    const unitNumber = uIdx + 1;
    return {
      unitNumber,
      titleEn: u.titleEn,
      titleHe: u.titleHe,
      subtitleHe: u.subtitleHe,
      badgeEmoji: u.badgeEmoji,
      missions: u.missions.map((m, mIdx) =>
        'phonics' in m
          ? buildPhonicsMission(gradeId, unitNumber, mIdx + 1, m, u.idUnitNumber)
          : buildMission(gradeId, unitNumber, mIdx + 1, m, u.idUnitNumber)
      ),
    };
  });
  return { gradeId, units: builtUnits };
}
