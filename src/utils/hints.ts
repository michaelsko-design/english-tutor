/**
 * Builders for the Hebrew drill hints (Feature 20).
 *
 * A hint gives the learner a way to work the answer out (count letters, word order, a sound,
 * where to look in the story) without naming the answer or repeating text already on screen.
 * The wording is gender-neutral, so it does not depend on `inflectHebrew`.
 */

const BLANK = '____';

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'am', 'was', 'were', 'be', 'to', 'of', 'in', 'on', 'at', 'and',
  'or', 'it', 'its', 'he', 'she', 'they', 'i', 'you', 'we', 'his', 'her', 'their', 'my', 'your',
  'do', 'does', 'did', 'what', 'where', 'who', 'when', 'why', 'how', 'which', 'that', 'this',
  'for', 'with', 'from', 'by', 'has', 'have', 'had',
]);

/**
 * Wraps English text in Unicode left-to-right isolation marks, so it keeps its order inside a
 * Hebrew (RTL) hint. Without them a trailing "____." jumps to the start of the sentence.
 */
export function isolateLtr(text: string): string {
  return `\u2066${text}\u2069`;
}

function countLetters(text: string): number {
  return text.replace(/[^A-Za-z0-9]/g, '').length;
}

function firstLetter(text: string): string {
  return (text.match(/[A-Za-z0-9]/)?.[0] ?? '').toUpperCase();
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Lower-case words without punctuation. */
function toWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9'\s-]/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^['-]+|['-]+$/g, ''))
    .filter(Boolean);
}

function toContentWords(text: string): Set<string> {
  return new Set(toWords(text).filter((w) => !STOP_WORDS.has(w)));
}

/**
 * Clue for picking an English word: its letter count, plus the first letter when another
 * option has the same number of letters.
 */
export function getWordShapeHintHe(targetEn: string, otherOptionsEn: string[]): string {
  const length = countLetters(targetEn);
  const sameLength = otherOptionsEn.some((o) => countLetters(o) === length);
  if (!sameLength) {
    return `בתשובה הנכונה יש ${length} אותיות. כדאי לספור את האותיות בכל תשובה.`;
  }
  return `התשובה הנכונה מתחילה באות ${firstLetter(targetEn)} ויש בה ${length} אותיות.`;
}

/** Spelling clue: the first letter and how many letters to place. */
export function getSpellingHintHe(letters: string[]): string {
  return `המילה מתחילה באות "${letters[0]}" ויש בה ${letters.length} אותיות.`;
}

/**
 * Blanks the word (and simple inflected forms: run → runs/running, make → making,
 * study → studies) out of the sentence. Returns null when the word is not in it.
 */
export function toClozeSentence(sentenceEn: string, wordEn: string): string | null {
  const word = wordEn.trim().toLowerCase();
  if (!word) return null;
  const patterns = [`\\b${escapeRegExp(word)}\\w*`];
  if (!word.includes(' ') && word.length > 3 && word.endsWith('e')) {
    patterns.push(`\\b${escapeRegExp(word.slice(0, -1))}(?:ing|ed|er|es)\\b`);
  }
  if (!word.includes(' ') && word.length > 3 && word.endsWith('y')) {
    patterns.push(`\\b${escapeRegExp(word.slice(0, -1))}(?:ies|ied|ier|iest)\\b`);
  }
  for (const pattern of patterns) {
    const regex = new RegExp(pattern, 'gi');
    if (regex.test(sentenceEn)) return sentenceEn.replace(regex, BLANK);
  }
  return null;
}

function stripEdgePunctuation(word: string): string {
  return word.replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, '');
}

/**
 * Word-order clue: the last word for short sentences (the capitalised chip already shows the
 * first one), and the first and last words for sentences of 5+ words.
 */
export function getSentenceOrderHintHe(words: string[]): string {
  const first = stripEdgePunctuation(words[0] ?? '');
  const last = stripEdgePunctuation(words[words.length - 1] ?? '');
  if (words.length <= 4) {
    return `המשפט מסתיים במילה "${last}" ויש בו ${words.length} מילים.`;
  }
  return `המשפט מתחיל ב-"${first}" ומסתיים ב-"${last}" (${words.length} מילים).`;
}

/** Short function words: a tip on a content word helps more, so these are tried last. */
const FUNCTION_WORDS = new Set([
  'the', 'this', 'that', 'these', 'those', 'they', 'them', 'their', 'there', 'then', 'than',
  'with', 'we', 'was', 'were', 'what', 'where', 'when', 'why', 'which', 'who', 'will', 'would',
]);

/** Words ending in consonant + e whose vowel stays short or irregular. */
const SILENT_E_EXCEPTIONS = new Set([
  'have', 'give', 'live', 'love', 'come', 'some', 'done', 'gone', 'none', 'one', 'move', 'lose',
  'whose', 'were', 'are', 'there', 'where', 'here', 'once', 'since', 'above', 'glove', 'dove',
]);

interface PronunciationRule {
  matches: (word: string) => boolean;
  tipHe: (word: string) => string;
}

/** Ordered by how often each sound trips up Hebrew speakers; the first match wins. */
const PRONUNCIATION_RULES: PronunciationRule[] = [
  {
    matches: (w) => w.includes('th'),
    tipHe: (w) => `טיפ: ב-"${w}" יש th — שמים את קצה הלשון בין השיניים ונושפים (לא ס׳ ולא ד׳).`,
  },
  {
    matches: (w) => /^w(?!r|ho)/.test(w),
    tipHe: (w) => `טיפ: ב-"${w}" ה-w נשמעת כמו "וּ" קצרה עם שפתיים עגולות — לא כמו v.`,
  },
  {
    matches: (w) => w.startsWith('kn'),
    tipHe: (w) => `טיפ: ב-"${w}" האות k שקטה — מתחילים ישר בצליל n.`,
  },
  {
    matches: (w) => w.startsWith('wr'),
    tipHe: (w) => `טיפ: ב-"${w}" האות w שקטה — מתחילים ישר בצליל r.`,
  },
  {
    matches: (w) => w.includes('igh'),
    tipHe: (w) => `טיפ: ב-"${w}" האותיות gh שקטות, וה-i נשמעת כמו "אַי".`,
  },
  {
    matches: (w) => w.length > 3 && w.endsWith('mb'),
    tipHe: (w) => `טיפ: ב-"${w}" האות b בסוף שקטה.`,
  },
  {
    matches: (w) => w.length > 3 && w.endsWith('ed') && !w.endsWith('eed'),
    tipHe: (w) =>
      /[td]ed$/.test(w)
        ? `טיפ: ב-"${w}" הסיומת ed נשמעת כמו "אִד" — הברה נוספת אחרי t או d.`
        : `טיפ: ב-"${w}" הסיומת ed נשמעת כמו t או d קצרה, בלי הברה נוספת.`,
  },
  {
    matches: (w) => w.length > 4 && w.endsWith('ing'),
    tipHe: (w) => `טיפ: ב-"${w}" הסיומת ing נגמרת בצליל אפי רך (ng), בלי g חזקה בסוף.`,
  },
  {
    matches: (w) => w.length >= 4 && /[^aeiou][aeiou][^aeiouwy]e$/.test(w) && !SILENT_E_EXCEPTIONS.has(w),
    tipHe: (w) => `טיפ: ב-"${w}" ה-e בסוף שקטה, והיא מאריכה את התנועה שלפניה.`,
  },
  {
    matches: (w) => w.includes('ee'),
    tipHe: (w) => `טיפ: ב-"${w}" ה-ee ארוכה, כמו "אִי" מתוחה.`,
  },
];

const PRONUNCIATION_FALLBACK_HE = 'טיפ: כדאי להאזין קודם ב-🐢 ואז להקיש על מילה קשה כדי לשמוע אותה לבד.';

/**
 * A pronunciation tip for the first tricky sound in the sentence, looking at content words
 * before short function words like "the".
 */
export function getPronunciationTipHe(sentenceEn: string): string {
  const words = toWords(sentenceEn);
  const contentWords = words.filter((w) => !FUNCTION_WORDS.has(w));
  for (const candidates of [contentWords, words]) {
    for (const rule of PRONUNCIATION_RULES) {
      const word = candidates.find(rule.matches);
      if (word) return rule.tipHe(word);
    }
  }
  return PRONUNCIATION_FALLBACK_HE;
}

/** A fragment that ends in a title or abbreviation ("Dr.", "e.g.") does not end a sentence. */
const ABBREVIATION_END = /\b(?:dr|mr|mrs|ms|prof|st|jr|sr|vs|etc|e\.g|i\.e|no)\.$/i;

function splitSentences(passageEn: string): string[] {
  const fragments = (passageEn.match(/[^.!?]+[.!?]*/g) ?? []).map((s) => s.trim()).filter(Boolean);
  const sentences: string[] = [];
  let pending = '';
  for (const fragment of fragments) {
    pending = pending ? `${pending} ${fragment}` : fragment;
    // Keep joining after an abbreviation, or when the next text starts in lower case / a digit.
    if (!ABBREVIATION_END.test(pending)) {
      sentences.push(pending);
      pending = '';
    }
  }
  if (pending) sentences.push(pending);
  return sentences.reduce<string[]>((acc, sentence) => {
    if (acc.length > 0 && /^[a-z0-9]/.test(sentence)) {
      return [...acc.slice(0, -1), `${acc[acc.length - 1]}${sentence}`];
    }
    return [...acc, sentence];
  }, []);
}

function overlap(words: Set<string>, sentence: string): number {
  return toWords(sentence).filter((w) => words.has(w)).length;
}

/**
 * The 1-based number of the passage sentence that holds the answer: the one sharing the most
 * words with the answer, with the question as a tie-breaker. Returns null for a one-sentence
 * passage or when nothing matches.
 */
export function findAnswerSentenceNumber(
  passageEn: string,
  answerEn: string,
  questionEn: string
): number | null {
  const sentences = splitSentences(passageEn);
  if (sentences.length < 2) return null;
  const answerWords = toContentWords(answerEn);
  const questionWords = toContentWords(questionEn);
  let bestIdx = -1;
  let bestScore = 0;
  sentences.forEach((sentence, idx) => {
    const score = overlap(answerWords, sentence) * 10 + overlap(questionWords, sentence);
    if (score > bestScore) {
      bestScore = score;
      bestIdx = idx;
    }
  });
  return bestIdx >= 0 ? bestIdx + 1 : null;
}
