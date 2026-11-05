import type { DrillSeed, MissionNode, TierSeeds, VocabularyItem } from '../curriculum';
import type { MissionExerciseStep, MultipleChoiceOption } from '../missionExercises';
import { hebrewTemplate } from '../../utils/hebrewGender';
import type { LearnerGender } from '../../types/learner';
import {
  findAnswerSentenceNumber,
  getPronunciationTipHe,
  getSentenceOrderHintHe,
  isolateLtr,
} from '../../utils/hints';
import { COMMA_CHIP } from '../../utils/sentenceChips';
import { getSentenceHintWords } from '../wordGlosses';

/** What every tier's step builder needs. */
export interface TierContext {
  mission: MissionNode;
  seed: DrillSeed;
  tiers: TierSeeds;
  he: ReturnType<typeof hebrewTemplate>;
  vocab: VocabularyItem[];
  /** Replay salt: rotates which vocabulary word each tier drills */
  salt: number;
}

export function createTierContext(
  mission: MissionNode,
  gender: LearnerGender,
  salt: number
): TierContext | null {
  const seed = mission.drillSeed;
  if (!seed?.tiers) return null;
  return { mission, seed, tiers: seed.tiers, he: hebrewTemplate(gender), vocab: mission.vocabulary, salt };
}

/**
 * The vocabulary word a tier drills: Explorer offset 0, Challenger 1, Master 2. All three shift by
 * the same replay salt, so they stay different words while a replay drills new ones.
 */
export function pickVocabIndex(ctx: TierContext, offset: number): number {
  return (offset + Math.abs(Math.trunc(ctx.salt))) % ctx.vocab.length;
}

export function pickVocab(ctx: TierContext, offset: number): VocabularyItem {
  return ctx.vocab[pickVocabIndex(ctx, offset)];
}

export function splitWords(sentence: string): string[] {
  return sentence
    .replace(/[.!?",]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

/** Like `splitWords`, but each comma stays as a chip of its own, in its place after the word. */
export function splitWordsAndCommas(sentence: string): string[] {
  return sentence
    .replace(/[.!?"]/g, '')
    .replace(/,/g, ` ${COMMA_CHIP} `)
    .split(/\s+/)
    .filter(Boolean);
}

export function buildSentenceStep(
  ctx: TierContext,
  sentenceEn: string,
  sentenceHe: string,
  badgeLabelHe: string
): MissionExerciseStep {
  const { he, mission } = ctx;
  const words = splitWords(sentenceEn);
  return {
    id: `${mission.id}-s2`,
    stepNumber: 2,
    type: 'sentence-builder',
    badgeLabelHe,
    promptHe: he`הרכיבי את המשפט:`,
    hintHe: `💡 ${getSentenceOrderHintHe(words)}`,
    questionEn: 'Tap the words in the right order:',
    targetSentenceEn: sentenceEn,
    targetSentenceHe: sentenceHe,
    scrambledWords: [...words],
    hintWords: getSentenceHintWords(words, mission.vocabulary),
  };
}

export function buildVoiceStep(
  ctx: TierContext,
  sentenceEn: string,
  sentenceHe: string,
  focusWordEn: string
): MissionExerciseStep {
  const { he, mission } = ctx;
  return {
    id: `${mission.id}-s3`,
    stepNumber: 3,
    type: 'voice-speak',
    badgeLabelHe: he`🎙️ שלב 3/5: אימון קריאה ודיבור`,
    promptHe: he`הקשיבי וחזרי על המשפט:`,
    hintHe: `💡 ${getPronunciationTipHe(sentenceEn)}`,
    questionEn: 'Speak this sentence aloud:',
    speakTargetEn: sentenceEn,
    speakTargetHe: sentenceHe,
    focusWordEn,
  };
}

/** A multiple-choice list with the correct answer first (the caller shuffles it). */
export function choiceOptions(
  correct: string,
  correctExplainHe: string,
  wrong: readonly string[],
  wrongExplainHe: (index: number) => string
): MultipleChoiceOption[] {
  return [
    { textEn: correct, isCorrect: true, explanationHe: correctExplainHe },
    ...wrong.map((textEn, index) => ({ textEn, isCorrect: false, explanationHe: wrongExplainHe(index) })),
  ];
}

/** Points to the story sentence holding the answer, in Hebrew (Explorer / Challenger). */
export function storyLocationHintHe(
  story: { passageEn: string; questionEn: string; questionHe: string; correct: string },
  includeQuestionHe: boolean
): string {
  const number = findAnswerSentenceNumber(story.passageEn, story.correct, story.questionEn);
  const where = number
    ? `התשובה נמצאת במשפט מספר ${number} בסיפור.`
    : 'כדאי לחפש בסיפור את המילים מהשאלה.';
  return includeQuestionHe ? `💡 ${where} השאלה בעברית: "${story.questionHe}"` : `💡 ${where}`;
}

/** An English-only nudge (Master hints). */
export function englishHint(text: string): string {
  return `💡 ${isolateLtr(text)}`;
}
