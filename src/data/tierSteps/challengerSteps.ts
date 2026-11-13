import type { MissionExerciseStep } from '../missionExercises';
import { isolateLtr, toExactClozeSentence } from '../../utils/hints';
import {
  buildSentenceStep,
  buildVoiceStep,
  choiceOptions,
  pickVocabIndex,
  storyLocationHintHe,
  type TierContext,
} from './shared';

/**
 * Challenger ⚡ (use in context): a fill-in-the-blank with the mission's second word, the full key
 * sentence to build and say, the grade's rule question and its story with the Hebrew translation.
 */
/**
 * The fill-in offers the headword itself, so it needs an example that has the word as written
 * ("Dogs smell…" can't take "smell"): from the salt's word on, the first word whose example does.
 * The tier lint checks every mission has one.
 */
function pickExactClozeIndex(ctx: TierContext, startIndex: number): number {
  const count = ctx.vocab.length;
  for (let step = 0; step < count; step++) {
    const index = (startIndex + step) % count;
    const word = ctx.vocab[index];
    if (toExactClozeSentence(word.exampleEn, word.wordEn)) return index;
  }
  return startIndex;
}

export function buildChallengerSteps(ctx: TierContext): MissionExerciseStep[] {
  const { he, mission, seed, tiers } = ctx;
  const wordIndex = pickExactClozeIndex(ctx, pickVocabIndex(ctx, 1));
  const word = ctx.vocab[wordIndex];
  const cloze = toExactClozeSentence(word.exampleEn, word.wordEn);
  const [wrongA, wrongB] = tiers.challenger.clozeWrong[wordIndex];

  const step1: MissionExerciseStep = {
    id: `${mission.id}-s1`,
    stepNumber: 1,
    type: 'chat-reply',
    badgeLabelHe: he`💬 שלב 1/5: השלימי את המשפט`,
    promptHe: he`בחרי את המילה שמשלימה את המשפט:`,
    hintHe: he`💡 קראו את המשפט עד הסוף ובדקו איזו מילה מתאימה לו במשמעות ובדקדוק.`,
    // After a miss the Hebrew sentence is fair help (it would give the answer away up front)
    hintAfterWrongHe: `💡 המשפט בעברית: ${word.exampleHe}`,
    questionEn: cloze ?? word.exampleEn,
    options: choiceOptions(
      word.wordEn,
      he`מעולה! ${word.emoji ? `${word.emoji} ` : ''}${word.wordEn} פירושו "${word.translationHe}".`,
      [wrongA, wrongB],
      () => he`לא בדיוק — המילה שמתאימה כאן היא "${isolateLtr(word.wordEn)}" (${word.translationHe}).`
    ),
  };

  const step4: MissionExerciseStep = {
    id: `${mission.id}-s4`,
    stepNumber: 4,
    type: 'grammar-detective',
    badgeLabelHe: he`🕵️‍♀️ שלב 4/5: בלשית הדקדוק`,
    promptHe: he`בחרי את התשובה הנכונה:`,
    hintHe: `💡 ${seed.rule.hintHe}`,
    questionEn: seed.rule.questionEn,
    options: choiceOptions(
      seed.rule.correct,
      he`כל הכבוד! ${seed.rule.explainHe}`,
      seed.rule.wrong,
      (i) => (i === 0 ? he`כמעט! ${seed.rule.explainHe}` : he`לא בדיוק. ${seed.rule.explainHe}`)
    ),
  };

  const story = seed.story;
  const step5: MissionExerciseStep = {
    id: `${mission.id}-s5`,
    stepNumber: 5,
    type: 'story-unseen',
    badgeLabelHe: he`📖 שלב 5/5: סיפור קצר והבנת הנקרא`,
    promptHe: he`קראי את הסיפור ובחרי את התשובה הנכונה:`,
    hintHe: storyLocationHintHe(story, true),
    contextPassageEn: story.passageEn,
    contextPassageHe: story.passageHe,
    questionEn: story.questionEn,
    options: choiceOptions(
      story.correct,
      he`אלופה! סיימת את כל שלבי המשימה בהצלחה! 🎉`,
      story.wrong,
      (i) => (i === 0 ? he`נסי שוב — חפשי את התשובה בסיפור 🔍` : he`כמעט! קראי שוב את הסיפור ובדקי 🔍`)
    ),
  };

  return [
    step1,
    buildSentenceStep(ctx, mission.sampleSentenceEn, mission.sampleSentenceHe, he`🧩 שלב 2/5: הרכבת משפט`),
    buildVoiceStep(ctx, mission.sampleSentenceEn, mission.sampleSentenceHe, word.wordEn),
    step4,
    step5,
  ];
}
