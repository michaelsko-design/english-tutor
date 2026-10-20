/**
 * Builds the grade 1 phonics missions (Feature 48): letters A–Z, then blending letters into words.
 * Their vocabulary is the picture words they teach, so the Vocabulary Vault, word games and word
 * counts keep working; their steps come from letterExercises.ts and blendingExercises.ts.
 */
import { GradeId } from '../../../types/learner';
import { MissionNode, PhonicsMission, VocabularyItem } from '../types';
import { getAlphabetLetter } from '../../alphabet';
import { getBlendWord } from '../../blendingWords';

export interface PhonicsMissionSpec {
  icon: string;
  isBoss?: boolean;
  titleEn: string;
  titleHe: string;
  storyHookHe: string;
  grammarTopic: string;
  skills: string[];
  phonics: PhonicsMission;
}

const PHONICS_BASE_XP = 25;

function letterVocabulary(letters: readonly string[]): VocabularyItem[] {
  return letters.flatMap((upper) =>
    getAlphabetLetter(upper).words.map((word) => ({
      wordEn: word.en,
      partOfSpeech: 'word',
      translationHe: word.he,
      emoji: word.emoji,
      exampleEn: `${upper} is for ${word.en}.`,
      exampleHe: `${upper} כמו ${word.he}`,
    })),
  );
}

function blendVocabulary(words: readonly string[]): VocabularyItem[] {
  return words.map((text) => {
    const word = getBlendWord(text);
    return {
      wordEn: word.word,
      partOfSpeech: 'word',
      translationHe: word.he,
      emoji: word.emoji,
      exampleEn: `${word.tiles.join('-')}, ${word.word}!`,
      exampleHe: `קוראים אות אחרי אות: ${word.he}`,
    };
  });
}

export function buildPhonicsMission(
  gradeId: GradeId,
  unitNumber: number,
  missionNumber: number,
  spec: PhonicsMissionSpec,
  idUnitNumber = unitNumber
): MissionNode {
  const grade = parseInt(gradeId.replace('grade-', ''), 10);
  const isBoss = Boolean(spec.isBoss);
  const baseXp = PHONICS_BASE_XP + (unitNumber - 1) * 2 + (missionNumber - 1) * 2 + (isBoss ? 10 : 0);
  const vocabulary =
    spec.phonics.kind === 'letters' ? letterVocabulary(spec.phonics.letters) : blendVocabulary(spec.phonics.words);
  const first = vocabulary[0];

  const mission: MissionNode = {
    id: `g${grade}-u${idUnitNumber}-m${missionNumber}`,
    unitNumber,
    missionNumber,
    icon: spec.icon,
    titleEn: spec.titleEn,
    titleHe: spec.titleHe,
    storyHookHe: spec.storyHookHe,
    grammarTopic: spec.grammarTopic,
    estimatedMinutes: 2 + (isBoss ? 1 : 0),
    baseXp,
    baseDiamonds: Math.round(baseXp / 4),
    skills: spec.skills,
    sampleSentenceEn: first.exampleEn,
    sampleSentenceHe: first.exampleHe,
    vocabulary,
    tierObjectives: {
      explorer: {
        tier: 'explorer',
        focusHe: 'שומעים, מסתכלים ובוחרים מבין שתי אפשרויות',
        samplePromptEn: first.exampleEn,
        samplePromptHe: first.exampleHe,
      },
      challenger: {
        tier: 'challenger',
        focusHe: 'בוחרים מבין שלוש אפשרויות',
        samplePromptEn: first.exampleEn,
        samplePromptHe: first.exampleHe,
      },
      master: {
        tier: 'master',
        focusHe: 'שלוש אפשרויות ופחות עזרה',
        samplePromptEn: first.exampleEn,
        samplePromptHe: first.exampleHe,
      },
    },
    phonics: spec.phonics,
  };
  if (isBoss) mission.isBoss = true;
  return mission;
}
