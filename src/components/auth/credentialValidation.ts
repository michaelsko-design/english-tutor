import { MIN_PIN_LENGTH, toUsernameSlug } from '../../utils/username';

/** "new" opens an account; "existing" signs in to one */
export type CredentialMode = 'new' | 'existing';

export const USERNAME_REQUIRED_HE = 'צריך לכתוב שם משתמש.';
export const USERNAME_ENGLISH_ONLY_HE = 'שם המשתמש צריך להיות באותיות באנגלית ובמספרים בלבד (בלי רווחים).';
export const PASSWORD_TOO_SHORT_HE = `הסיסמה צריכה להיות לפחות ${MIN_PIN_LENGTH} תווים.`;

/**
 * Checks the username and password before Firebase sees them. A username keeps only the characters
 * an account email can hold, so one with Hebrew or spaces would silently become another name; it is
 * refused instead. Signing in to an existing account also accepts a real email address.
 */
export function validateCredentials(mode: CredentialMode, username: string, password: string): string | null {
  const trimmed = username.trim().toLowerCase();
  if (!trimmed) return USERNAME_REQUIRED_HE;
  const isEmail = mode === 'existing' && trimmed.includes('@');
  if (!isEmail && toUsernameSlug(trimmed) !== trimmed) return USERNAME_ENGLISH_ONLY_HE;
  if (password.trim().length < MIN_PIN_LENGTH) return PASSWORD_TOO_SHORT_HE;
  return null;
}
