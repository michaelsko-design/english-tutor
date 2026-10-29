/** What the central question card shows: the exercise itself, never a generic instruction. */
export interface QuestionCardContent {
  text: string;
  lang: 'en' | 'he';
  /** `word` for a single English word (vocabulary), shown very large and centered; `glyph` for a
   * letter or a picture of grade 1's letters and blending steps, larger still */
  size: 'sentence' | 'word' | 'glyph';
}

interface QuestionCardStep {
  type: string;
  questionEn: string;
  targetSentenceHe?: string;
  /** Hebrew word or phrase to put into English: shown instead of the English question */
  cardTextHe?: string;
  /** Letters and blending steps: the letter, picture or sentence to show (Feature 48) */
  cardDisplay?: string;
  /** Blending steps that show the word as sound tiles instead of a card */
  soundTiles?: string[];
}

/** A blank in a fill-in-the-blank question: three or more underscores. */
export const BLANK_PATTERN = /_{3,}/;

const SINGLE_WORD_PATTERN = /^[A-Za-z][A-Za-z'’-]*$/;

/**
 * Picks the card content for a drill step. The voice step has no card here: `VoiceSpeakDrill`
 * shows the sentence to say in its own card. The sentence builder shows the Hebrew sentence to
 * translate (the English one is the answer).
 */
export function getQuestionCardContent(step: QuestionCardStep): QuestionCardContent | null {
  if (step.type === 'voice-speak' || step.soundTiles) return null;
  if (step.cardDisplay) {
    const isSentence = /\s/.test(step.cardDisplay.trim());
    return { text: step.cardDisplay, lang: 'en', size: isSentence ? 'sentence' : 'glyph' };
  }
  if (step.type === 'sentence-builder') {
    // Without a translation (a teacher's sheet), the instruction above is enough
    return step.targetSentenceHe ? { text: step.targetSentenceHe, lang: 'he', size: 'sentence' } : null;
  }
  if (step.cardTextHe) return { text: step.cardTextHe, lang: 'he', size: 'word' };
  const text = step.questionEn.trim();
  return { text, lang: 'en', size: SINGLE_WORD_PATTERN.test(text) ? 'word' : 'sentence' };
}

/**
 * What the card's 🔊 reads. Undefined: the card text itself. An empty `questionEn` on a shown sentence
 * is a reading check that plays nothing by itself, but the learner can still ask to hear it (grade 1's
 * "my first sentence").
 */
export function getCardReadAloudText(step: QuestionCardStep): string | undefined {
  if (step.cardDisplay === undefined) return undefined;
  const isReadingCheck = !step.questionEn && /\s/.test(step.cardDisplay.trim());
  return isReadingCheck ? step.cardDisplay : step.questionEn;
}

/** Splits a question into text parts and blanks, so a blank can be drawn as an empty slot. */
export function splitBlanks(text: string): { text: string; isBlank: boolean }[] {
  return text
    .split(/(_{3,})/)
    .filter((part) => part !== '')
    .map((part) => ({ text: part, isBlank: BLANK_PATTERN.test(part) }));
}
