/**
 * The 5 steps of a grade 1 letters mission (Feature 48), for learners who don't know the letters
 * yet. Every step is a multiple choice with big letters or pictures, and the letter's name can
 * always be heard:
 *  1. hear a letter's name → pick the letter,
 *  2. a small letter → its capital (Master: a capital → its small letter),
 *  3. a picture → the letter its word starts with,
 *  4. say the letter's first word aloud,
 *  5. a letter → the picture that starts with it.
 * Explorer has 2 options, Challenger and Master 3; Master also mixes in letters taught earlier.
 * Options come in authored order (correct first); the caller shuffles them.
 */
import type { MissionNode } from './curriculum';
import type { MissionExerciseStep, MultipleChoiceOption } from './missionExercises';
import type { LearnerGender, ProficiencyTier } from '../types/learner';
import { getAlphabetLetter, getLetterNameSpeech, getLettersBefore, type AlphabetLetter } from './alphabet';
import { hebrewTemplate } from '../utils/hebrewGender';
import { getPronunciationTipHe, isolateLtr } from '../utils/hints';

/** English inside Hebrew feedback stays left-to-right ("באות B", not a flipped "B-ב") */
const en = isolateLtr;

const STEP_COUNT = 5;

interface LetterStepContext {
  missionId: string;
  he: ReturnType<typeof hebrewTemplate>;
  optionCount: number;
  pool: AlphabetLetter[];
}

/** Up to `count - 1` other letters of the pool, nearest to the target first (stable for a target). */
function otherLetters(target: AlphabetLetter, pool: readonly AlphabetLetter[], count: number): AlphabetLetter[] {
  const others = pool.filter((letter) => letter.upper !== target.upper);
  const start = Math.max(0, others.findIndex((letter) => letter.upper > target.upper));
  return [...others.slice(start), ...others.slice(0, start)].slice(0, count - 1);
}

const startsOrEnds = (letter: AlphabetLetter) => (letter.position === 'end' ? 'מסתיים' : 'מתחיל');

function buildListenStep(letter: AlphabetLetter, ctx: LetterStepContext): MissionExerciseStep {
  const { he } = ctx;
  const word = letter.words[0];
  const options: MultipleChoiceOption[] = [
    {
      textEn: letter.upper,
      speakEn: getLetterNameSpeech(letter.upper),
      isCorrect: true,
      explanationHe: `מעולה! זו האות ${en(letter.upper)}. ${en(letter.upper)} כמו ${en(word.en)} ${word.emoji}`,
    },
    ...otherLetters(letter, ctx.pool, ctx.optionCount).map((other) => ({
      textEn: other.upper,
      speakEn: getLetterNameSpeech(other.upper),
      isCorrect: false,
      explanationHe: he`זו האות ${en(other.upper)}. לחצי על 🔊, הקשיבי שוב ונסי שוב!`,
    })),
  ];
  return {
    id: `${ctx.missionId}-s1`,
    stepNumber: 1,
    type: 'letter-listen',
    badgeLabelHe: he`👂 שלב 1/5: איזו אות שמעת?`,
    promptHe: he`הקשיבי ובחרי את האות ששמעת:`,
    hintHe: he`💡 לחצי על 🔊 כדי לשמוע שוב את שם האות, ואז חפשי אותה בין האותיות.`,
    questionEn: getLetterNameSpeech(letter.upper),
    cardDisplay: '👂',
    options,
  };
}

function buildCaseStep(letter: AlphabetLetter, ctx: LetterStepContext, toLower: boolean): MissionExerciseStep {
  const { he } = ctx;
  const shown = toLower ? letter.upper : letter.lower;
  const pick = (l: AlphabetLetter) => (toLower ? l.lower : l.upper);
  const options: MultipleChoiceOption[] = [
    { textEn: pick(letter), speakEn: getLetterNameSpeech(letter.upper), isCorrect: true, explanationHe: `מעולה! ${en(`${letter.upper} ${letter.lower}`)}: אותה אות, גדולה וקטנה.` },
    ...otherLetters(letter, ctx.pool, ctx.optionCount).map((other) => ({
      textEn: pick(other),
      speakEn: getLetterNameSpeech(other.upper),
      isCorrect: false,
      explanationHe: `לא הפעם: ${en(pick(other))} שייכת לאות ${en(`${other.upper}${other.lower}`)}. נסו שוב!`,
    })),
  ];
  return {
    id: `${ctx.missionId}-s2`,
    stepNumber: 2,
    type: 'letter-case',
    badgeLabelHe: he`🔠 שלב 2/5: גדולה וקטנה`,
    promptHe: toLower ? he`איזו אות קטנה מתאימה לאות הגדולה?` : he`איזו אות גדולה מתאימה לאות הקטנה?`,
    hintHe: he`💡 לכל אות יש צורה גדולה וצורה קטנה. יש אותיות שהצורות שלהן דומות, ויש שלא, אז הסתכלי היטב.`,
    questionEn: getLetterNameSpeech(letter.upper),
    cardDisplay: shown,
    options,
  };
}

function buildPictureStep(letter: AlphabetLetter, ctx: LetterStepContext): MissionExerciseStep {
  const { he } = ctx;
  const word = letter.words[1];
  const options: MultipleChoiceOption[] = [
    {
      textEn: letter.upper,
      speakEn: getLetterNameSpeech(letter.upper),
      isCorrect: true,
      explanationHe: `מעולה! ${word.emoji} ${en(word.en)} ${startsOrEnds(letter)} באות ${en(letter.upper)}.`,
    },
    ...otherLetters(letter, ctx.pool, ctx.optionCount).map((other) => ({
      textEn: other.upper,
      speakEn: getLetterNameSpeech(other.upper),
      isCorrect: false,
      explanationHe: he`לא בדיוק. ${en(other.upper)} כמו ${en(other.words[0].en)} ${other.words[0].emoji}. אמרי את המילה לאט ונסי שוב!`,
    })),
  ];
  return {
    id: `${ctx.missionId}-s3`,
    stepNumber: 3,
    type: 'letter-picture',
    badgeLabelHe: he`🖼️ שלב 3/5: תמונה ואות`,
    promptHe: letter.position === 'end' ? he`באיזו אות מסתיימת המילה?` : he`באיזו אות מתחילה המילה?`,
    hintHe:
      letter.position === 'end'
        ? he`💡 אמרי את המילה בקול לאט, והקשיבי לצליל האחרון שלה.`
        : he`💡 אמרי את המילה בקול לאט, והקשיבי לצליל הראשון שלה.`,
    questionEn: word.en,
    cardDisplay: word.emoji,
    options,
  };
}

function buildSayStep(letter: AlphabetLetter, ctx: LetterStepContext): MissionExerciseStep {
  const { he } = ctx;
  const word = letter.words[0];
  return {
    id: `${ctx.missionId}-s4`,
    stepNumber: 4,
    type: 'voice-speak',
    badgeLabelHe: he`🎙️ שלב 4/5: אמרי בקול`,
    promptHe: he`הקשיבי ואמרי את המילה בקול:`,
    hintHe: `💡 ${getPronunciationTipHe(word.en)}`,
    questionEn: 'Say this word aloud:',
    speakTargetEn: word.en,
    speakTargetHe: `${word.emoji} ${word.he}`,
    focusWordEn: word.en,
  };
}

function buildFindStep(letter: AlphabetLetter, ctx: LetterStepContext): MissionExerciseStep {
  const { he } = ctx;
  const word = letter.words[2];
  const options: MultipleChoiceOption[] = [
    {
      textEn: word.emoji,
      speakEn: word.en,
      isCorrect: true,
      explanationHe: `מעולה! ${word.emoji} ${en(word.en)} ${startsOrEnds(letter)} באות ${en(letter.upper)}.`,
    },
    ...otherLetters(letter, ctx.pool, ctx.optionCount).map((other) => ({
      textEn: other.words[2].emoji,
      speakEn: other.words[2].en,
      isCorrect: false,
      explanationHe: `${other.words[2].emoji} ${en(other.words[2].en)} ${startsOrEnds(other)} באות ${en(other.upper)}. נסו שוב!`,
    })),
  ];
  return {
    id: `${ctx.missionId}-s5`,
    stepNumber: 5,
    type: 'letter-find',
    badgeLabelHe: he`🔎 שלב 5/5: מצאי את התמונה`,
    promptHe:
      letter.position === 'end'
        ? he`איזו תמונה מסתיימת באות ${isolateLtr(letter.upper)}?`
        : he`איזו תמונה מתחילה באות ${isolateLtr(letter.upper)}?`,
    hintHe: he`💡 לחצי על 🔊 ליד כל תמונה ושמעי את המילה. במה היא ${letter.position === 'end' ? 'מסתיימת' : 'מתחילה'}?`,
    questionEn: getLetterNameSpeech(letter.upper),
    cardDisplay: `${letter.upper}${letter.lower}`,
    options,
  };
}

export function buildLetterExercises(
  mission: MissionNode,
  tier: ProficiencyTier,
  gender: LearnerGender = 'girl'
): MissionExerciseStep[] {
  if (mission.phonics?.kind !== 'letters') return [];
  const letters = mission.phonics.letters.map(getAlphabetLetter);
  const isMaster = tier === 'master';
  const earlier = isMaster ? getLettersBefore(letters[0].upper) : [];
  const ctx: LetterStepContext = {
    missionId: mission.id,
    he: hebrewTemplate(gender),
    optionCount: tier === 'explorer' ? 2 : 3,
    pool: [...letters, ...earlier],
  };
  // Each step practises another letter of the mission, so all of them come up; a Boss spreads
  // its five steps over its unit's letters
  const letterAt = (stepIdx: number) =>
    mission.isBoss
      ? letters[Math.floor((stepIdx * letters.length) / STEP_COUNT) % letters.length]
      : letters[stepIdx % letters.length];
  return [
    buildListenStep(letterAt(0), ctx),
    buildCaseStep(letterAt(1), ctx, isMaster),
    buildPictureStep(letterAt(2), ctx),
    buildSayStep(letterAt(3), ctx),
    buildFindStep(letterAt(4), ctx),
  ];
}
