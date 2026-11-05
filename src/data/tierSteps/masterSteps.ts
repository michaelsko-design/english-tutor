import type { VocabularyItem } from '../curriculum';
import type { MissionExerciseStep } from '../missionExercises';
import { seededShuffleNotIdentity } from '../../utils/shuffle';
import { getSentenceOrderHintHe } from '../../utils/hints';
import {
  buildVoiceStep,
  choiceOptions,
  englishHint,
  pickVocab,
  splitWords,
  type TierContext,
} from './shared';

const SPELLABLE_WORD = /^[A-Za-z]{2,}$/;

/** The word to spell: the Master offset, or the next vocabulary word that is one plain word. */
function pickSpellableWord(ctx: TierContext): VocabularyItem | null {
  for (let step = 0; step < ctx.vocab.length; step++) {
    const word = pickVocab(ctx, 2 + step);
    if (SPELLABLE_WORD.test(word.wordEn)) return word;
  }
  return null;
}

function buildVocabularyStep(ctx: TierContext): MissionExerciseStep {
  const { he, mission, seed } = ctx;
  const spellWord = pickSpellableWord(ctx);
  const word = spellWord ?? pickVocab(ctx, 2);
  const explainHe = he`מעולה! ${word.emoji ? `${word.emoji} ` : ''}${word.wordEn} פירושו "${word.translationHe}".`;

  if (spellWord) {
    const letters = spellWord.wordEn.toLowerCase().split('');
    return {
      id: `${mission.id}-s1`,
      stepNumber: 1,
      type: 'word-spell',
      badgeLabelHe: he`🧲 שלב 1/5: איך כותבים באנגלית?`,
      promptHe: he`הרכיבי את המילה באנגלית מהאותיות:`,
      hintHe: `💡 המילה מתחילה באות "${letters[0]}" ויש בה ${letters.length} אותיות.`,
      questionEn: spellWord.wordEn,
      cardTextHe: spellWord.translationHe,
      targetSentenceEn: spellWord.wordEn.toLowerCase(),
      letterTiles: seededShuffleNotIdentity(letters, `${mission.id}|${spellWord.wordEn}|tiles`),
    };
  }

  // No plain single word to spell: Hebrew → English with four options
  const others = [...ctx.vocab.filter((v) => v !== word).map((v) => v.wordEn), ...seed.wrongWords.map((w) => w.wordEn)];
  return {
    id: `${mission.id}-s1`,
    stepNumber: 1,
    type: 'chat-reply',
    badgeLabelHe: he`💬 שלב 1/5: איך אומרים באנגלית?`,
    promptHe: he`איך אומרים את זה באנגלית?`,
    hintHe: `💡 המילה מתחילה באות ${word.wordEn[0].toUpperCase()}.`,
    speakerName: 'Word Guide',
    speakerAvatar: mission.icon,
    questionEn: 'Which English word is right?',
    cardTextHe: word.translationHe,
    options: choiceOptions(word.wordEn, explainHe, others.slice(0, 3), () => he`לא בדיוק. נסי שוב!`),
  };
}

/**
 * Master 👑 (produce and reason): spell a word from its Hebrew, build a new longer sentence among
 * decoy words, say a sentence from memory, find the sentence with no mistake among four, and
 * answer an inference question about a longer story with no Hebrew help.
 */
export function buildMasterSteps(ctx: TierContext): MissionExerciseStep[] {
  const { he, mission, tiers } = ctx;
  const master = tiers.master;
  const sentenceWords = splitWords(master.sentenceEn);
  // The voice step's pronunciation focus is the word step 1 spells
  const focus = pickSpellableWord(ctx) ?? pickVocab(ctx, 2);

  const step2: MissionExerciseStep = {
    id: `${mission.id}-s2`,
    stepNumber: 2,
    type: 'sentence-builder',
    badgeLabelHe: he`🧩 שלב 2/5: משפט חדש (עם מילים מיותרות)`,
    promptHe: he`הרכיבי את המשפט. שימו לב: יש שתי מילים מיותרות!`,
    hintHe: `💡 ${getSentenceOrderHintHe(sentenceWords)}`,
    questionEn: 'Tap the words in the right order:',
    targetSentenceEn: master.sentenceEn,
    targetSentenceHe: master.sentenceHe,
    scrambledWords: [...sentenceWords, ...master.decoys],
  };

  const step3: MissionExerciseStep = {
    ...buildVoiceStep(ctx, master.voiceEn, master.voiceHe, focus.wordEn),
    badgeLabelHe: he`🎙️ שלב 3/5: חוזרים מהזיכרון`,
    promptHe: he`הקשיבי, והפעם אמרי את המשפט בלי לראות אותו:`,
    hideText: true,
  };

  const fix = master.errorFix;
  const step4: MissionExerciseStep = {
    id: `${mission.id}-s4`,
    stepNumber: 4,
    type: 'grammar-detective',
    badgeLabelHe: he`🕵️‍♀️ שלב 4/5: מצאי את הטעות`,
    promptHe: he`בחרי את המשפט הנכון (שלוש אפשרויות שגויות):`,
    hintHe: englishHint(fix.hintEn),
    questionEn: fix.questionEn,
    options: choiceOptions(
      fix.correct,
      he`כל הכבוד! ${fix.explainHe}`,
      fix.wrong,
      () => he`לא בדיוק. ${fix.explainHe}`
    ),
  };

  const story = master.story;
  const step5: MissionExerciseStep = {
    id: `${mission.id}-s5`,
    stepNumber: 5,
    type: 'story-unseen',
    badgeLabelHe: he`📖 שלב 5/5: הבנת הנקרא – בלי עזרה בעברית`,
    promptHe: he`קראי את הסיפור וחשבי: מה התשובה הנכונה?`,
    hintHe: englishHint(master.storyHintEn),
    contextPassageEn: story.passageEn,
    questionEn: story.questionEn,
    options: choiceOptions(
      story.correct,
      he`אלופה! סיימת את כל שלבי המשימה בהצלחה! 🎉`,
      story.wrong,
      (i) => (i === 0 ? he`נסי שוב — חפשי את התשובה בסיפור 🔍` : he`כמעט! קראי שוב את הסיפור ובדקי 🔍`)
    ),
  };

  return [buildVocabularyStep(ctx), step2, step3, step4, step5];
}
