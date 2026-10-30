import { useCallback, useState } from 'react';
import { getWordGlossKey, getWordRevealLimit, WordGloss } from '../utils/hints';

export interface WordReveal {
  limit: number;
  left: number;
  /** The Hebrew translation of a word the learner already revealed */
  revealedGlossFor: (word: string) => string | undefined;
  /** The word has a translation, has not been revealed yet, and reveals are left */
  canReveal: (word: string) => boolean;
  reveal: (word: string) => void;
}

/**
 * Sentence-builder hint: the learner taps a translate icon next to a word in the word bank to see
 * its Hebrew (a couple of words at most). Starts over when the step changes.
 */
export function useWordReveal(
  stepId: string,
  hintWords: ReadonlyArray<WordGloss> | undefined,
  sentenceWordCount: number
): WordReveal {
  const [state, setState] = useState<{ stepId: string; revealed: string[] }>({ stepId, revealed: [] });
  const revealed = state.stepId === stepId ? state.revealed : [];
  const limit = getWordRevealLimit(sentenceWordCount);
  const left = limit - revealed.length;

  const findGloss = useCallback(
    (word: string) => {
      const key = getWordGlossKey(word);
      return hintWords?.find((gloss) => getWordGlossKey(gloss.wordEn) === key);
    },
    [hintWords]
  );

  const revealedGlossFor = (word: string) =>
    revealed.includes(getWordGlossKey(word)) ? findGloss(word)?.translationHe : undefined;

  const canReveal = (word: string) =>
    left > 0 && !revealed.includes(getWordGlossKey(word)) && findGloss(word) !== undefined;

  const reveal = (word: string) => {
    if (!canReveal(word)) return;
    setState({ stepId, revealed: [...revealed, getWordGlossKey(word)] });
  };

  return { limit, left, revealedGlossFor, canReveal, reveal };
}
