/**
 * Exam question bank (Feature 43): questions written for "Get Ready for an Exam" only, so a
 * question the learner meets in an exam session never appears in a mission, a mini-lesson, the
 * placement test or a contest.
 *
 * Every unit has 6 vocabulary, 6 grammar and 6 sentence items and 2 reading passages with 3
 * questions each. The last EXAM_MOCK_RESERVED_PER_LIST items of each list and the second passage
 * are kept for the mock exam, so the mock is unseen.
 *
 * Hebrew hints and explanations are written gender-neutral (plural forms such as "שימו לב").
 */

/** A fill-in-the-blank sentence on one of the unit's own vocabulary words. */
export interface ExamVocabItem {
  /** English sentence with one "____" blank */
  clozeEn: string;
  /** The whole sentence in Hebrew, shown as the hint */
  clozeHe: string;
  /** A word of the unit's vocabulary that fills the blank */
  answer: string;
  /** Explorer gets only the first */
  wrong: [string, string];
}

/** Same shape as a mission's `drillSeed.rule`. */
export interface ExamGrammarItem {
  questionEn: string;
  correct: string;
  wrong: [string, string];
  /** Why the answer is right, shown after any pick */
  explainHe: string;
  /** How to decide, without naming the answer */
  hintHe: string;
}

/** A sentence for the word magnets, 4–14 words. */
export interface ExamSentenceItem {
  en: string;
  he: string;
}

export interface ExamPassageQuestion {
  questionEn: string;
  questionHe: string;
  correct: string;
  wrong: [string, string];
}

export interface ExamPassage {
  passageEn: string;
  passageHe: string;
  questions: [ExamPassageQuestion, ExamPassageQuestion, ExamPassageQuestion];
}

export interface ExamUnitBank {
  vocabulary: ExamVocabItem[];
  grammar: ExamGrammarItem[];
  sentences: ExamSentenceItem[];
  /** The first is for practice, the second for the mock exam */
  passages: [ExamPassage, ExamPassage];
}

/** A grade's bank by unit number */
export type ExamBankPack = Record<number, ExamUnitBank>;

/** The last items of each list that only the mock exam uses. */
export const EXAM_MOCK_RESERVED_PER_LIST = 2;
export const EXAM_BANK_ITEMS_PER_LIST = 6;
export const EXAM_BANK_BLANK = '____';
