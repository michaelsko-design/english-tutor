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

/** Exact match on an unused spoken token, else a slight spelling slip on a longer word with the same first letter. */
function findSpokenMatch(target: string, spokenTokens: string[], used: Set<number>): number {
  const exactIdx = spokenTokens.findIndex((spoken, idx) => !used.has(idx) && spoken === target);
  if (exactIdx !== -1 || target.length < 5) return exactIdx;
  return spokenTokens.findIndex((spoken, idx) => {
    if (used.has(idx) || !spoken || spoken[0] !== target[0]) return false;
    const dist = levenshteinDistance(spoken, target);
    return target.length >= 8 ? dist <= 2 : dist <= 1;
  });
}

// ---- Canonical form: numbers, clock times and contractions ----------------------------------

const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen',
];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const IRREGULAR_ORDINALS: Record<string, string> = {
  one: 'first', two: 'second', three: 'third', five: 'fifth', eight: 'eighth', nine: 'ninth', twelve: 'twelfth',
};
const MAX_NUMBER_IN_WORDS = 999_999;

function numberToWords(n: number): string[] {
  if (n < 20) return [ONES[n]];
  if (n < 100) return n % 10 ? [TENS[Math.floor(n / 10)], ONES[n % 10]] : [TENS[n / 10]];
  if (n < 1000) {
    const rest = n % 100;
    return [ONES[Math.floor(n / 100)], 'hundred', ...(rest ? numberToWords(rest) : [])];
  }
  if (n <= MAX_NUMBER_IN_WORDS) {
    const rest = n % 1000;
    return [...numberToWords(Math.floor(n / 1000)), 'thousand', ...(rest ? numberToWords(rest) : [])];
  }
  return String(n).split('').map((d) => ONES[Number(d)]);
}

function toOrdinalWords(n: number): string[] {
  const words = numberToWords(n);
  const last = words[words.length - 1];
  const ordinal =
    IRREGULAR_ORDINALS[last] ?? (last.endsWith('y') ? `${last.slice(0, -1)}ieth` : `${last}th`);
  return [...words.slice(0, -1), ordinal];
}

/** Ways to say a clock time; the first one is the default. */
function getTimePhrasings(hour24: number, minute: number): string[][] {
  const hour = numberToWords(hour24 % 12 || 12);
  const nextHour = numberToWords((hour24 % 12) + 1);
  if (minute === 0) return [[...hour, "o'clock"], hour];
  if (minute === 30) return [[...hour, 'thirty'], ['half', 'past', ...hour]];
  if (minute === 15) return [[...hour, 'fifteen'], ['quarter', 'past', ...hour], ['a', 'quarter', 'past', ...hour]];
  if (minute === 45) return [[...hour, 'forty', 'five'], ['quarter', 'to', ...nextHour], ['a', 'quarter', 'to', ...nextHour]];
  const digital = minute < 10 ? [...hour, 'oh', ...numberToWords(minute)] : [...hour, ...numberToWords(minute)];
  const relative =
    minute < 30 ? [...numberToWords(minute), 'past', ...hour] : [...numberToWords(60 - minute), 'to', ...nextHour];
  return [digital, relative];
}

/** Pronouns whose "'s" means "is" or "has"; on any other word "'s" is a possessive and is kept. */
const IS_OR_HAS_STEMS = new Set(['he', 'she', 'it', 'that', 'what', 'there', 'where', 'who', 'here', 'how']);
const IRREGULAR_NEGATIVES: Record<string, string[]> = {
  "can't": ['can', 'not'],
  cannot: ['can', 'not'],
  "won't": ['will', 'not'],
  "shan't": ['shall', 'not'],
  "ain't": ['is', 'not'],
};
const CONTRACTION_SUFFIXES: [string, string[][]][] = [
  ["n't", [['not']]],
  ["'re", [['are']]],
  ["'m", [['am']]],
  ["'ve", [['have']]],
  ["'ll", [['will']]],
  ["'d", [['would'], ['had']]],
];

/** Long forms of a contraction (the first is the default), or null when the word is not one. */
function expandContraction(word: string): string[][] | null {
  if (IRREGULAR_NEGATIVES[word]) return [IRREGULAR_NEGATIVES[word]];
  if (word === "let's") return [['let', 'us']];
  for (const [suffix, endings] of CONTRACTION_SUFFIXES) {
    if (word.endsWith(suffix) && word.length > suffix.length) {
      const stem = word.slice(0, -suffix.length);
      return endings.map((ending) => [stem, ...ending]);
    }
  }
  if (word.endsWith("'s")) {
    const stem = word.slice(0, -2);
    if (IS_OR_HAS_STEMS.has(stem)) return [[stem, 'is'], [stem, 'has']];
  }
  return null;
}

/** One part of a written word, with the ways it can be said (the first is the default). */
interface Piece {
  source: number;
  options: string[][];
}

interface CanonToken {
  text: string;
  /** Index of the written word the token came from. */
  source: number;
}

function partToOptions(part: string): string[][] {
  const time = part.match(/^(\d{1,2}):(\d{2})$/);
  if (time && Number(time[1]) < 24 && Number(time[2]) < 60) {
    return getTimePhrasings(Number(time[1]), Number(time[2]));
  }
  const decimal = part.match(/^(\d+)\.(\d+)$/);
  if (decimal) {
    const digits = decimal[2].split('').map((d) => ONES[Number(d)]);
    return [[...numberToWords(Number(decimal[1])), 'point', ...digits]];
  }
  const number = part.match(/^(\d{1,3}(?:,\d{3})+|\d+)(st|nd|rd|th)?(%)?$/);
  if (number) {
    const value = Number(number[1].replace(/,/g, ''));
    const words = number[2] ? toOrdinalWords(value) : numberToWords(value);
    return [number[3] ? [...words, 'percent'] : words];
  }
  const contraction = expandContraction(part);
  if (contraction) return contraction;
  const word = part.replace(/[^a-z0-9']/g, '');
  return word ? [[word]] : [];
}

/** Splits each written word (hyphens and slashes too) into pieces in canonical form. */
function toPieces(rawWords: string[]): Piece[] {
  return rawWords.flatMap((raw, source) =>
    raw
      .toLowerCase()
      .replace(/[’‘`]/g, "'")
      .split(/[-–—/]+/)
      .map((part) => part.replace(/^[^a-z0-9']+|[^a-z0-9'%]+$/g, ''))
      .map((part) => partToOptions(part))
      .filter((options) => options.length > 0)
      .map((options) => ({ source, options }))
  );
}

/** The other side's default reading, to choose between readings that are both right. */
function toReference(pieces: Piece[]): string {
  return ` ${pieces.flatMap((p) => p.options[0]).join(' ')} `;
}

/**
 * Picks one reading per piece: the one the other side says (with the next word, so "I'd known"
 * reads "I had known" and "I'd have" reads "I would have"), else the default.
 */
function resolvePieces(pieces: Piece[], reference: string): CanonToken[] {
  return pieces.flatMap((piece, i) => {
    const nextWord = pieces[i + 1]?.options[0][0];
    const says = (words: string[]) => reference.includes(` ${words.join(' ')} `);
    const chosen =
      piece.options.length === 1
        ? piece.options[0]
        : piece.options.find((opt) => nextWord !== undefined && says([...opt, nextWord])) ??
          piece.options.find((opt) => says(opt)) ??
          piece.options[0];
    return chosen.map((text) => ({ text, source: piece.source }));
  });
}

/**
 * Evaluates a spoken transcript from Web Speech Recognition against the target English sentence.
 * Requires accurate pronunciation while highlighting each matched word.
 *
 * Both sides are compared in a canonical form, so the way Chrome writes a word doesn't matter:
 * digits and number words ("2" / "two", "25" / "twenty-five", "3rd" / "third", "20%"), clock
 * times ("7:30" / "half past seven" / "seven thirty") and contractions ("don't" / "do not",
 * "I'm" / "I am"). A target word counts as said only when all of its canonical parts were said.
 */
export function evaluateSpokenSentence(
  targetSentence: string,
  spokenTranscript: string
): SpeechEvaluationResult {
  const rawTargetWords = targetSentence.trim().split(/\s+/).filter(Boolean);
  const rawSpokenWords = spokenTranscript.trim().split(/\s+/).filter(Boolean);
  const targetPieces = toPieces(rawTargetWords);
  const spokenPieces = toPieces(rawSpokenWords);
  const targetTokens = resolvePieces(targetPieces, toReference(spokenPieces));
  const spokenTokens = resolvePieces(spokenPieces, toReference(targetPieces)).map((t) => t.text);

  const usedSpokenIndices = new Set<number>();
  const tokenMatched = targetTokens.map((token) => {
    const matchedIdx = findSpokenMatch(token.text, spokenTokens, usedSpokenIndices);
    if (matchedIdx === -1) return false;
    usedSpokenIndices.add(matchedIdx);
    return true;
  });

  let matchedCount = 0;
  const wordResults: WordMatchResult[] = rawTargetWords.map((rawWord, wordIdx) => {
    const cleanTarget = normalizeToken(rawWord);
    const parts = tokenMatched.filter((_, i) => targetTokens[i].source === wordIdx);
    const isMatched = parts.every(Boolean);
    if (parts.length > 0 && isMatched) matchedCount++;
    if (parts.length === 0) {
      return { targetWord: rawWord, cleanWord: '', matched: true };
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
