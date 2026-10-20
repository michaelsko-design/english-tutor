/** Test helpers for hint checks: the English words of a text, and the words that give an answer away. */

export function toTokens(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9'\s-]/g, ' ')
      .split(/\s+/)
      .map((w) => w.replace(/^['-]+|['-]+$/g, ''))
      .filter(Boolean)
  );
}

/** Words that appear in the correct option but in none of the wrong ones: naming them gives the answer. */
export function decidingWords(correct: string, wrong: readonly string[]): string[] {
  const wrongTokens = new Set(wrong.flatMap((w) => [...toTokens(w)]));
  return [...toTokens(correct)].filter((t) => !wrongTokens.has(t));
}
