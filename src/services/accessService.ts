import { auth, getAppCheckToken } from './firebase';
import { APP_CHECK_HEADER, TTS_TOKEN_HEADER } from './tts/ttsText';

/**
 * Closed early-tester phase: the single-use access code from an invite link (`/?access=CODE`) is
 * kept until the learner has signed in, then sent to /api/redeem-invite, which allows the account.
 * (`?invite=` is the friend-code link, a different thing.)
 */

const ACCESS_PARAM = 'access';
const PENDING_ACCESS_KEY = 'english_tutor_pending_access_code';
const REDEEM_URL = '/api/redeem-invite';
const CODE_LENGTH = 10;

const GENERIC_ERROR_HE = 'משהו השתבש. כדאי לנסות שוב.';
const OFFLINE_ERROR_HE = 'אין חיבור לאינטרנט. כדאי לנסות שוב בעוד רגע.';
const REDEEM_ERRORS_HE: Record<number, string> = {
  400: 'הקוד לא נראה תקין. כדאי לבדוק שהעתקתם אותו במלואו.',
  401: 'צריך להירשם עם שם משתמש וקוד סודי. כניסה כאורח לא זמינה בבדיקות.',
  404: 'לא מצאנו את הקוד הזה. כדאי לבדוק אותו שוב.',
  409: 'הקוד הזה כבר נוצל. כדאי לבקש קוד חדש.',
  410: 'תוקף הקוד פג. כדאי לבקש קוד חדש.',
};

/** Letters and digits only, upper case, at most the code length (the user may paste spaces or dashes). */
export function normalizeAccessCode(raw: string): string {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, CODE_LENGTH);
}

export function isCompleteAccessCode(code: string): boolean {
  return code.length === CODE_LENGTH;
}

/** The code from the address bar (then removed from it) or the one kept from an earlier visit. */
export function readPendingAccessCode(): string | null {
  try {
    const fromUrl = new URL(window.location.href).searchParams.get(ACCESS_PARAM);
    if (fromUrl) {
      const code = normalizeAccessCode(fromUrl);
      localStorage.setItem(PENDING_ACCESS_KEY, code);
      const url = new URL(window.location.href);
      url.searchParams.delete(ACCESS_PARAM);
      window.history.replaceState(null, '', url.pathname + url.search + url.hash);
      return code;
    }
    return localStorage.getItem(PENDING_ACCESS_KEY);
  } catch {
    return null;
  }
}

export function clearPendingAccessCode(): void {
  try {
    localStorage.removeItem(PENDING_ACCESS_KEY);
  } catch {
    // ignore storage errors
  }
}

/** Firestore refused the read because the account is not allowed yet (see `isAllowed` in firestore.rules). */
export function isAccessDeniedError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && (error as { code?: unknown }).code === 'permission-denied';
}

export type RedeemResult = { ok: true } | { ok: false; errorHe: string };

export async function redeemAccessCode(code: string): Promise<RedeemResult> {
  const user = auth?.currentUser;
  if (!user) return { ok: false, errorHe: REDEEM_ERRORS_HE[401] };
  try {
    const [idToken, appCheckToken] = await Promise.all([user.getIdToken(), getAppCheckToken()]);
    const response = await fetch(REDEEM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        [TTS_TOKEN_HEADER]: idToken,
        ...(appCheckToken ? { [APP_CHECK_HEADER]: appCheckToken } : {}),
      },
      body: JSON.stringify({ code }),
    });
    if (response.ok) {
      clearPendingAccessCode();
      return { ok: true };
    }
    return { ok: false, errorHe: REDEEM_ERRORS_HE[response.status] ?? GENERIC_ERROR_HE };
  } catch {
    // fetch only throws when there is no connection
    return { ok: false, errorHe: OFFLINE_ERROR_HE };
  }
}
