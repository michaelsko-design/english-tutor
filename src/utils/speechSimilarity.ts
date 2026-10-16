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
 * Forgiving enough for a 12-year-old Hebrew speaker's accent while highlighting each matched word.
 */
export function evaluateSpokenSentence(
  targetSentence: string,
  spokenTranscript: string
): SpeechEvaluationResult {
  const rawTargetWords = targetSentence.trim().split(/\s+/);
  const spokenTokens = spokenTranscript
    .trim()
    .split(/\s+/)
    .map(normalizeToken)
    .filter(Boolean);

  let matchedCount = 0;

  const wordResults: WordMatchResult[] = rawTargetWords.map((rawWord) => {
    const cleanTarget = normalizeToken(rawWord);
    if (!cleanTarget) {
      return { targetWord: rawWord, cleanWord: '', matched: true };
    }

    const isMatched = spokenTokens.some((spoken) => {
      if (spoken === cleanTarget) return true;
      // Allow 1 character difference for words >= 4 chars, or 2 chars for words >= 7 chars
      const dist = levenshteinDistance(spoken, cleanTarget);
      if (cleanTarget.length >= 7 && dist <= 2) return true;
      if (cleanTarget.length >= 4 && dist <= 1) return true;
      return false;
    });

    if (isMatched) matchedCount++;

    return {
      targetWord: rawWord,
      cleanWord: cleanTarget,
      matched: isMatched,
    };
  });

  const totalWords = Math.max(1, wordResults.length);
  const scorePercent = Math.round((matchedCount / totalWords) * 100);

  return {
    scorePercent,
    passed: scorePercent >= 60,
    wordResults,
  };
}
