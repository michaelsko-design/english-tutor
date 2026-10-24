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

/** Firebase Auth's minimum password length, so also the shortest PIN */
export const MIN_PIN_LENGTH = 6;
