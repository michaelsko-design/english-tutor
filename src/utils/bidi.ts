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

/** A gained amount, e.g. "+10 XP" or "+2 💎", isolated so its plus sign stays in front. */
export function formatGainLtr(amount: number, unit: string): string {
  return isolateLtr(`+${amount} ${unit}`);
}
