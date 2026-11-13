import type { MissionExerciseStep } from '../missionExercises';
import { getWordShapeHintHe, isolateLtr, toClozeSentence } from '../../utils/hints';
import {
  buildSentenceStep,
  buildVoiceStep,
  choiceOptions,
  pickVocab,
  storyLocationHintHe,
  type TierContext,
} from './shared';

const MIDDLE_AND_HIGH_ID = /^g(7|8|9|10|11|12)-/;

/**
 * Explorer 🌱 (recognize): a picture or a Hebrew cue to an English word with two options, the
 * short sentence, an easy rule check and a 2–3 sentence story with the Hebrew translation.
 */
export function buildExplorerSteps(ctx: TierContext): MissionExerciseStep[] {
  const { he, mission, seed, tiers } = ctx;
  const word = pickVocab(ctx, 0);
  const isFocusFirst = word === ctx.vocab[0];
  const distractor = isFocusFirst ? seed.wrongWords[0] : ctx.vocab[0];
  const isMiddleOrHigh = MIDDLE_AND_HIGH_ID.test(mission.id);
  const hasPicture = Boolean(word.emoji) && !isMiddleOrHigh;
  const cloze = toClozeSentence(word.exampleEn, word.wordEn);

  const step1: MissionExerciseStep = {
    id: `${mission.id}-s1`,
    stepNumber: 1,
    type: 'chat-reply',
    badgeLabelHe: he`💬 שלב 1/5: איזו מילה זו?`,
    promptHe: hasPicture ? he`איזו מילה באנגלית מתאימה לתמונה? בחרי:` : he`איך אומרים את זה באנגלית?`,
    hintHe: cloze
      ? he`💡 איזו מילה משלימה את המשפט? "${isolateLtr(cloze)}"`
      : `💡 ${getWordShapeHintHe(word.wordEn, [distractor.wordEn])}`,
    questionEn: isMiddleOrHigh
      ? `Which English word means "${word.translationHe}"?`
      : word.emoji
      ? `What is this? ${word.emoji}`
      : 'Which word is right?',
    cardTextHe: hasPicture ? undefined : word.translationHe,
    cardDisplay: hasPicture ? word.emoji : undefined,
    options: choiceOptions(
      word.wordEn,
      he`מעולה! ${word.emoji ? `${word.emoji} ` : ''}${word.wordEn} פירושו "${word.translationHe}".`,
      [distractor.wordEn],
      () => he`לא בדיוק — ${distractor.wordEn} פירושו "${distractor.translationHe}". נסי שוב!`
    ),
  };

  const rule = tiers.explorer.rule;
  const step4: MissionExerciseStep = {
    id: `${mission.id}-s4`,
    stepNumber: 4,
    type: 'grammar-detective',
    badgeLabelHe: he`🕵️‍♀️ שלב 4/5: בלשית הדקדוק`,
    promptHe: he`בחרי את התשובה הנכונה (יש רק שתי אפשרויות):`,
    hintHe: `💡 ${rule.hintHe}`,
    questionEn: rule.questionEn,
    options: choiceOptions(
      rule.correct,
      he`כל הכבוד! ${rule.explainHe}`,
      rule.wrong.slice(0, 1),
      () => he`כמעט! ${rule.explainHe}`
    ),
  };

  const story = tiers.explorer.story;
  const step5: MissionExerciseStep = {
    id: `${mission.id}-s5`,
    stepNumber: 5,
    type: 'story-unseen',
    badgeLabelHe: he`📖 שלב 5/5: סיפור קצר והבנת הנקרא`,
    promptHe: he`קראי את הסיפור הקצר. ${story.questionHe}`,
    hintHe: storyLocationHintHe(story, false),
    contextPassageEn: story.passageEn,
    contextPassageHe: story.passageHe,
    questionEn: story.questionEn,
    options: choiceOptions(
      story.correct,
      he`אלופה! סיימת את כל שלבי המשימה בהצלחה! 🎉`,
      story.wrong.slice(0, 1),
      () => he`נסי שוב — חפשי את התשובה בסיפור 🔍`
    ),
  };

  return [
    step1,
    buildSentenceStep(ctx, seed.shortSentenceEn, seed.shortSentenceHe, he`🧩 שלב 2/5: הרכבת משפט`),
    buildVoiceStep(ctx, seed.shortSentenceEn, seed.shortSentenceHe, word.wordEn),
    step4,
    step5,
  ];
}
