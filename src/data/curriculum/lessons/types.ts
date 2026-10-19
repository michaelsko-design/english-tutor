/**
 * Mini-lessons (Feature 42): a short, fun lesson the companion teaches before a mission's
 * first question. Hebrew explanations with English examples, three cards: the idea, the
 * examples and one quick try.
 *
 * The Hebrew is written gender-neutral (plural forms such as "שימו לב"), so it reads the
 * same for every learner without `inflectHebrew`.
 */

export interface LessonExample {
  /** English example sentence, read aloud on tap */
  en: string;
  /** Its Hebrew translation */
  he: string;
  /** The part of `en` that shows the rule; drawn in the theme colour. Must appear in `en`. */
  highlight: string;
  /** Picture for early grades */
  emoji?: string;
}

/** One quick question at the end of the lesson. Not scored. */
export interface LessonQuickTry {
  promptHe: string;
  /** Optional English sentence for the question, e.g. with a ____ blank */
  questionEn?: string;
  correct: string;
  wrong: string;
  /** Why the answer is right, shown after any pick */
  explainHe: string;
}

/** One topic of a Boss recap */
export interface LessonRecapPart {
  titleHe: string;
  pattern?: string;
}

export interface MiniLesson {
  /** Fun headline */
  titleHe: string;
  /** The idea in one or two sentences, Hebrew with short inline English */
  ideaHe: string;
  /** English formula shown as a chip, e.g. "have / has + V3" */
  pattern?: string;
  /** 2–3 examples */
  examples: LessonExample[];
  /** A common mistake of Hebrew speakers */
  tipHe?: string;
  /** Missing on a Boss recap */
  quickTry?: LessonQuickTry;
  /** Only on a Boss recap built from the unit's lessons */
  recapParts?: LessonRecapPart[];
}

/** A grade's lessons by mission id (`g7-u1-m1`) */
export type LessonPack = Record<string, MiniLesson>;
