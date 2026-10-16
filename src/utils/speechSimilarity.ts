export interface WordMatchResult {
  targetWord: string;
  cleanWord: string;
  matched: boolean;
}

export interface SpeechEvaluationResult {
  scorePercent: number;
  passed: boolean;
  wordResults: WordMatchResult[];
}

function normalizeToken(token: string): string {
  return token
    .toLowerCase()
    .replace(/[^a-z0-9']/g, '')
    .trim();
}

function levenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

/**
 * Evaluates a spoken transcript from Web Speech Recognition against the target English sentence.
 * Requires accurate pronunciation while highlighting each matched word.
 */
export function evaluateSpokenSentence(
  targetSentence: string,
  spokenTranscript: string
): SpeechEvaluationResult {
  const rawTargetWords = targetSentence.trim().split(/\s+/).filter(Boolean);
  const spokenTokens = spokenTranscript
    .trim()
    .split(/\s+/)
    .map(normalizeToken)
    .filter(Boolean);

  const usedSpokenIndices = new Set<number>();
  let matchedCount = 0;

  const wordResults: WordMatchResult[] = rawTargetWords.map((rawWord) => {
    const cleanTarget = normalizeToken(rawWord);
    if (!cleanTarget) {
      return { targetWord: rawWord, cleanWord: '', matched: true };
    }

    // 1. First try exact match on an unused spoken token
    let matchedIdx = spokenTokens.findIndex(
      (spoken, idx) => !usedSpokenIndices.has(idx) && spoken === cleanTarget
    );

    // 2. If no exact match, allow slight phonetic/spelling variation only on longer words
    //    when the first letter matches
    if (matchedIdx === -1 && cleanTarget.length >= 5) {
      matchedIdx = spokenTokens.findIndex((spoken, idx) => {
        if (usedSpokenIndices.has(idx) || !spoken) return false;
        if (spoken[0] !== cleanTarget[0]) return false;
        const dist = levenshteinDistance(spoken, cleanTarget);
        if (cleanTarget.length >= 8 && dist <= 2) return true;
        if (cleanTarget.length >= 5 && dist <= 1) return true;
        return false;
      });
    }

    const isMatched = matchedIdx !== -1;
    if (isMatched) {
      usedSpokenIndices.add(matchedIdx);
      matchedCount++;
    }

    return {
      targetWord: rawWord,
      cleanWord: cleanTarget,
      matched: isMatched,
    };
  });

  const totalWords = Math.max(1, wordResults.length);
  const scorePercent = Math.round((matchedCount / totalWords) * 100);
  const requiredPercent = totalWords <= 2 ? 100 : 80;

  return {
    scorePercent,
    passed: spokenTokens.length > 0 && scorePercent >= requiredPercent,
    wordResults,
  };
}
