/**
 * Bidirectional text helpers (Feature 27: the whole app is right-to-left).
 *
 * Inside a Hebrew sentence, "+10 XP" shows as "XP 10+" because the plus sign takes the
 * sentence's right-to-left direction. JSX can wrap such parts in <bdi>; plain strings
 * (feedback messages, status lines) wrap them in a left-to-right isolate instead.
 */
const LEFT_TO_RIGHT_ISOLATE = '\u2066';
const POP_DIRECTIONAL_ISOLATE = '\u2069';

/** `text` as a left-to-right island inside right-to-left text. */
export function isolateLtr(text: string): string {
  return `${LEFT_TO_RIGHT_ISOLATE}${text}${POP_DIRECTIONAL_ISOLATE}`;
}

/**
 * An English run: words joined by spaces, commas, slashes, plus signs, hyphens, colons or arrows, from
 * its first letter to its last letter or digit ("sh, ch, s, x", "es: watches, goes", "he / she / it").
 * Punctuation after the last word belongs to the Hebrew sentence.
 */
const ENGLISH_RUN = /[A-Za-z][A-Za-z0-9'’]*(?:[\s,/+:→-]+[A-Za-z0-9][A-Za-z0-9'’]*)*/g;

/**
 * Hebrew text with every English run isolated left-to-right. Without it, the commas and colons
 * inside an English list take the Hebrew direction and the list comes out in the wrong order.
 */
export function isolateEnglishRuns(text: string): string {
  return text.replace(ENGLISH_RUN, (run) => isolateLtr(run));
}

/** A gained amount, e.g. "+10 XP" or "+2 💎", isolated so its plus sign stays in front. */
export function formatGainLtr(amount: number, unit: string): string {
  return isolateLtr(`+${amount} ${unit}`);
}

/**
 * The language to mark on text that may be English or Hebrew (answer options), so screen readers
 * read English with an English voice. Mixed text stays with the page's Hebrew.
 */
export function getTextLang(text: string): 'en' | undefined {
  return /[A-Za-z]/.test(text) && !/[֐-׿]/.test(text) ? 'en' : undefined;
}
