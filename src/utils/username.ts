/**
 * Kid usernames sign in through Firebase Email/Password as `<slug>@peachnote.tutor.local`.
 * The auth screen, the dashboard label and the Friends Hub username lookup (and its Firestore
 * rule) all use these helpers, so the slug is the same everywhere.
 */

export const USERNAME_EMAIL_DOMAIN = 'peachnote.tutor.local';

/** Lowercases a username and keeps only the characters an account email can hold. */
export function toUsernameSlug(input: string): string {
  return input.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
}

/** Turns a username (e.g. "noa12") into its account email; a real email passes through. */
export function normalizeIdentifierToEmail(input: string): string {
  const trimmed = input.trim().toLowerCase();
  if (trimmed.includes('@')) return trimmed;
  return `${toUsernameSlug(trimmed) || 'learner'}@${USERNAME_EMAIL_DOMAIN}`;
}

/** The username of a username+PIN account, or null for Google and real-email accounts. */
export function usernameFromEmail(email: string | null | undefined): string | null {
  const suffix = `@${USERNAME_EMAIL_DOMAIN}`;
  if (!email || !email.endsWith(suffix)) return null;
  return email.slice(0, -suffix.length) || null;
}

const HEBREW_TO_LATIN: Readonly<Record<string, string>> = {
  א: 'a', ב: 'b', ג: 'g', ד: 'd', ה: 'h', ו: 'o', ז: 'z', ח: 'h', ט: 't', י: 'i',
  כ: 'k', ך: 'k', ל: 'l', מ: 'm', ם: 'm', נ: 'n', ן: 'n', ס: 's', ע: 'a', פ: 'p',
  ף: 'p', צ: 'ts', ץ: 'ts', ק: 'k', ר: 'r', ש: 'sh', ת: 't',
};
const SUGGESTED_NAME_MAX_LENGTH = 8;
const SUGGESTED_FALLBACK = 'kid';

/** One word: Hebrew letters become Latin ones, a final ה is silent, anything else is kept as typed */
function transliterateWord(word: string): string {
  const letters = Array.from(word);
  return letters
    .map((letter, index) => {
      if (letter === 'ה' && index === letters.length - 1 && letters.length > 1) return '';
      return HEBREW_TO_LATIN[letter] ?? letter;
    })
    .join('');
}

/**
 * A username to offer a new learner, made from their name: "נועה" becomes "noa42". Hebrew is
 * transliterated, the result keeps only characters a username can hold, and two digits make it
 * likely to be free. `random` (0 up to 1) is injectable so tests are deterministic.
 */
export function suggestUsername(name: string, random: () => number = Math.random): string {
  const base = toUsernameSlug(name.split(/[\s־-]+/).map(transliterateWord).join('').replace(/[._-]/g, ''))
    .slice(0, SUGGESTED_NAME_MAX_LENGTH);
  const digits = String(Math.floor(random() * 100)).padStart(2, '0');
  return `${base || SUGGESTED_FALLBACK}${digits}`;
}

/** Firebase Auth's minimum password length, so also the shortest PIN */
export const MIN_PIN_LENGTH = 6;
