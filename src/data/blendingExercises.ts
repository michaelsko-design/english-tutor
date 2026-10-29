/**
 * The 5 steps of a grade 1 blending mission (Feature 48): putting letters together into words.
 * A word is shown as tiles; tapping a tile says its letter, and the slide button lights the tiles
 * one by one while the word is read slowly, then at normal speed.
 *  1. hear and see the word in tiles → pick its picture,
 *  2. read the word (no sound unless the learner slides it) → pick its picture,
 *  3. hear the word and see its picture → build it with letter magnets,
 *  4. read the word aloud,
 *  5. a picture → its word among look-alikes one letter apart (hat, hit, hot).
 * The Boss of the last unit ends with a first sentence to read instead (step 5).
 * Explorer has 2 options, Challenger and Master 3; Master can't slide the word in step 2.
 * Options come in authored order (correct first); the caller shuffles them.
 */
import type { MissionNode } from './curriculum';
import type { MissionExerciseStep, MultipleChoiceOption } from './missionExercises';
import type { LearnerGender, ProficiencyTier } from '../types/learner';
import { FIRST_SENTENCES, getBlendWord, type BlendWord } from './blendingWords';
import { hebrewTemplate } from '../utils/hebrewGender';
import { getPronunciationTipHe, isolateLtr } from '../utils/hints';

/** English inside Hebrew feedback stays left-to-right */
const en = isolateLtr;
import { seededShuffle } from '../utils/shuffle';

interface BlendStepContext {
  missionId: string;
  he: ReturnType<typeof hebrewTemplate>;
  optionCount: number;
  words: BlendWord[];
}

/** Picture options: the word's picture and pictures of other words of the mission. */
function pictureOptions(word: BlendWord, ctx: BlendStepContext): MultipleChoiceOption[] {
  const others = ctx.words.filter((other) => other.word !== word.word).slice(0, ctx.optionCount - 1);
  return [
    { textEn: word.emoji, speakEn: '', isCorrect: true, explanationHe: `מעולה! ${en(word.word)} ${word.emoji} זה "${word.he}".` },
    ...others.map((other) => ({
      textEn: other.emoji,
      speakEn: '',
      isCorrect: false,
      explanationHe: `${other.emoji} זה ${en(other.word)}. קראו שוב אות אחרי אות ונסו שוב!`,
    })),
  ];
}

function buildListenStep(word: BlendWord, ctx: BlendStepContext): MissionExerciseStep {
  const { he } = ctx;
  return {
    id: `${ctx.missionId}-s1`,
    stepNumber: 1,
    type: 'blend-listen',
    badgeLabelHe: he`👂 שלב 1/5: שומעים מילה`,
    promptHe: he`הקשיבי למילה וגעי באותיות. איזו תמונה זו?`,
    hintHe: he`💡 לחצי על ➡️ כדי לשמוע שוב את המילה, אות אחרי אות.`,
    questionEn: word.word,
    soundTiles: word.tiles,
    canSlide: true,
    options: pictureOptions(word, ctx),
  };
}

function buildReadStep(word: BlendWord, ctx: BlendStepContext, canSlide: boolean): MissionExerciseStep {
  const { he } = ctx;
  return {
    id: `${ctx.missionId}-s2`,
    stepNumber: 2,
    type: 'blend-read',
    badgeLabelHe: he`📖 שלב 2/5: קוראים לבד`,
    promptHe: he`קראי את המילה ובחרי את התמונה:`,
    hintHe: canSlide
      ? he`💡 אמרי כל אות לאט, ואז מהר יותר, עד שזו נשמעת כמו מילה. אפשר ללחוץ על ➡️.`
      : he`💡 אמרי כל אות לאט, ואז מהר יותר, עד שזו נשמעת כמו מילה.`,
    // Nothing is read by itself: this is the learner's own reading
    questionEn: '',
    soundTiles: word.tiles,
    canSlide,
    options: pictureOptions(word, ctx),
  };
}

function buildBuildStep(word: BlendWord, ctx: BlendStepContext): MissionExerciseStep {
  const { he } = ctx;
  return {
    id: `${ctx.missionId}-s3`,
    stepNumber: 3,
    type: 'blend-build',
    badgeLabelHe: he`🧲 שלב 3/5: בונים מילה`,
    promptHe: he`הקשיבי והרכיבי את המילה מהאותיות:`,
    hintHe: he`💡 הקשיבי למילה לאט. איזו אות שומעים ראשונה? ואחריה?`,
    questionEn: word.word,
    cardDisplay: word.emoji,
    targetSentenceEn: word.word,
    letterTiles: seededShuffle(word.word.split(''), `${ctx.missionId}|${word.word}|tiles`),
  };
}

function buildSayStep(word: BlendWord, ctx: BlendStepContext): MissionExerciseStep {
  const { he } = ctx;
  return {
    id: `${ctx.missionId}-s4`,
    stepNumber: 4,
    type: 'voice-speak',
    badgeLabelHe: he`🎙️ שלב 4/5: קוראים בקול`,
    promptHe: he`קראי את המילה בקול:`,
    hintHe: `💡 ${getPronunciationTipHe(word.word)}`,
    questionEn: 'Read this word aloud:',
    speakTargetEn: word.word,
    speakTargetHe: `${word.emoji} ${word.he}`,
    focusWordEn: word.word,
  };
}

function buildChangeStep(word: BlendWord, ctx: BlendStepContext): MissionExerciseStep {
  const { he } = ctx;
  const options: MultipleChoiceOption[] = [
    { textEn: word.word, speakEn: '', isCorrect: true, explanationHe: `מעולה! ${word.emoji} זה ${en(word.word)}.` },
    ...word.lookAlikes.slice(0, ctx.optionCount - 1).map((lookAlike) => ({
      textEn: lookAlike,
      speakEn: '',
      isCorrect: false,
      explanationHe: he`זה ${en(lookAlike)}, אות אחת שונה. הסתכלי על כל האותיות ונסי שוב!`,
    })),
  ];
  return {
    id: `${ctx.missionId}-s5`,
    stepNumber: 5,
    type: 'blend-change',
    badgeLabelHe: he`🔍 שלב 5/5: מילים דומות`,
    promptHe: he`איזו מילה מתאימה לתמונה? הן שונות רק באות אחת!`,
    hintHe: he`💡 קראי כל מילה לאט, אות אחרי אות. איפה הן שונות?`,
    // Nothing is read by itself: hearing the word would answer the reading check
    questionEn: '',
    cardDisplay: word.emoji,
    options,
  };
}

/** The last Boss's step 5: a first sentence to read, then its picture. */
function buildSentenceStep(ctx: BlendStepContext, sentenceIdx: number): MissionExerciseStep {
  const { he } = ctx;
  const sentence = FIRST_SENTENCES[sentenceIdx % FIRST_SENTENCES.length];
  const options: MultipleChoiceOption[] = [
    { textEn: sentence.emoji, speakEn: '', isCorrect: true, explanationHe: `כל הכבוד! קראת משפט שלם: "${sentence.he}"` },
    ...sentence.distractorEmojis.slice(0, ctx.optionCount - 1).map((emoji) => ({
      textEn: emoji,
      speakEn: '',
      isCorrect: false,
      explanationHe: he`עוד לא. קראי שוב את המשפט לאט, מילה אחרי מילה, ונסי שוב!`,
    })),
  ];
  return {
    id: `${ctx.missionId}-s5`,
    stepNumber: 5,
    type: 'blend-read',
    badgeLabelHe: he`🏆 שלב 5/5: המשפט הראשון שלי`,
    promptHe: he`קראי את המשפט ובחרי את התמונה המתאימה:`,
    hintHe: he`💡 מילים כמו I, a ו-the קוראים במבט אחד. את שאר המילים קוראים אות אחרי אות.`,
    // Nothing is read by itself (the learner's own reading); the card's 🔊 reads cardDisplay on request
    questionEn: '',
    cardDisplay: sentence.en,
    canSlide: false,
    options,
  };
}

export function buildBlendingExercises(
  mission: MissionNode,
  tier: ProficiencyTier,
  gender: LearnerGender = 'girl'
): MissionExerciseStep[] {
  if (mission.phonics?.kind !== 'blending') return [];
  const ctx: BlendStepContext = {
    missionId: mission.id,
    he: hebrewTemplate(gender),
    optionCount: tier === 'explorer' ? 2 : 3,
    words: mission.phonics.words.map(getBlendWord),
  };
  const wordAt = (stepIdx: number) => ctx.words[stepIdx % ctx.words.length];
  const hasSentences = Boolean(mission.phonics.sightWords?.length) && Boolean(mission.isBoss);
  return [
    buildListenStep(wordAt(0), ctx),
    buildReadStep(wordAt(1), ctx, tier !== 'master'),
    buildBuildStep(wordAt(2), ctx),
    buildSayStep(wordAt(3), ctx),
    hasSentences ? buildSentenceStep(ctx, mission.missionNumber) : buildChangeStep(wordAt(4), ctx),
  ];
}
