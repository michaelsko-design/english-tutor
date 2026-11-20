import { auth, getAppCheckToken } from './firebase';
import { APP_CHECK_HEADER, TTS_TOKEN_HEADER } from './tts/ttsText';
import type { BillingPeriod } from '../config/proTier';
import { PRIVACY_CONTACT_EMAIL } from '../config/appInfo';
import type { ParentResult } from './parentService';

/**
 * The parent's Pro payments (docs/feature-pro-tier.md, "Phase 2"): start a checkout, change or
 * cancel a plan. The server checks every pairing and computes every price; this only carries the
 * parent's choice and turns the answer into Hebrew.
 */

const CHECKOUT_URL = '/api/checkout';
const SUBSCRIPTION_URL = '/api/subscription';
const MOCK_PAY_URL = '/api/mock-pay';

const GENERIC_ERROR_HE = 'משהו השתבש. כדאי לנסות שוב.';
const OFFLINE_ERROR_HE = 'אין חיבור לאינטרנט. כדאי לנסות שוב בעוד רגע.';
const SIGN_IN_ERROR_HE = 'צריך להתחבר כהורה.';

const CHECKOUT_ERRORS_HE: Record<number, string> = {
  400: 'כדאי לבדוק את השם המלא, את מספר הנייד ואת האימייל.',
  401: SIGN_IN_ERROR_HE,
  403: 'אחד הילדים כבר לא מחובר לחשבון ההורה הזה.',
  409: 'לאחד הילדים כבר יש Pro.',
  503: 'התשלום עדיין לא זמין. כדאי לנסות שוב מאוחר יותר.',
};

/** Refusals the server names with a `code`, more specific than the status */
const CHECKOUT_CODE_ERRORS_HE: Record<string, string> = {
  renewal_separate: 'חידוש מנוי שנתי נעשה לבד: כדאי לבחור רק את הילדים שהמנוי שלהם מתחדש, ולהוסיף ילדים אחרים בתשלום נפרד.',
  too_many_checkouts: `נפתחו היום יותר מדי דפי תשלום. כדאי לנסות שוב מחר, או לכתוב לנו ל-${PRIVACY_CONTACT_EMAIL}.`,
};

async function checkoutErrorHe(response: Response): Promise<string> {
  const body = (await response.json().catch(() => null)) as { code?: unknown } | null;
  const byCode = typeof body?.code === 'string' ? CHECKOUT_CODE_ERRORS_HE[body.code] : undefined;
  return byCode ?? CHECKOUT_ERRORS_HE[response.status] ?? GENERIC_ERROR_HE;
}

const PLAN_ERRORS_HE: Record<number, string> = {
  401: SIGN_IN_ERROR_HE,
  403: 'הילד הזה כבר לא מחובר לחשבון ההורה הזה.',
  404: 'לא מצאנו את המנוי. רק ההורה ששילם יכול לשנות אותו.',
  409: 'אי אפשר לעשות את השינוי הזה במנוי כרגע.',
  429: 'אפשר להחליף ילד במנוי פעם ב-30 יום.',
  503: 'שינוי המנוי עדיין לא זמין. כדאי לנסות שוב מאוחר יותר.',
};

export interface CheckoutRequest {
  childUids: string[];
  period: BillingPeriod;
  payerName: string;
  payerPhone: string;
  payerEmail: string;
  /** The parent ticked the terms box (the server refuses a payment page without it) */
  acceptedTerms: true;
}

export type PlanAction = 'cancel' | 'cancelWithRefund' | 'addChild' | 'removeChild';

/** Plan refusals the server names with a `code`, more specific than the status */
const PLAN_CODE_ERRORS_HE: Record<string, string> = {
  confirm_price: 'המחיר החודשי השתנה בינתיים. כדאי לרענן את הדף ולאשר שוב.',
  no_refund: 'אין במנוי הזה סכום להחזר. אפשר לכתוב לנו ונבדוק.',
  already_requested: 'כבר ביקשתם החזר על המנוי הזה. נטפל בו בתוך 14 יום.',
};

async function planErrorHe(response: Response): Promise<string> {
  const body = (await response.json().catch(() => null)) as { code?: unknown } | null;
  const byCode = typeof body?.code === 'string' ? PLAN_CODE_ERRORS_HE[body.code] : undefined;
  return byCode ?? PLAN_ERRORS_HE[response.status] ?? GENERIC_ERROR_HE;
}

/** What cancelling would give back (api/_lib/cancellation.ts) */
export type CancelMode = 'full_refund' | 'yearly_prorata' | 'monthly_end' | 'none';

export interface CancelQuote {
  mode: CancelMode;
  refundAgorot: number;
  /** Pro stays on until this time (ms) */
  accessUntil: number;
}

const CANCEL_MODES: readonly CancelMode[] = ['full_refund', 'yearly_prorata', 'monthly_end', 'none'];

function readCancelQuote(body: unknown): CancelQuote | null {
  const value = body as { mode?: unknown; refundAgorot?: unknown; accessUntil?: unknown } | null;
  const mode = CANCEL_MODES.find((m) => m === value?.mode);
  if (!mode || typeof value?.refundAgorot !== 'number' || typeof value?.accessUntil !== 'number') return null;
  return { mode, refundAgorot: value.refundAgorot, accessUntil: value.accessUntil };
}

export interface PlanChangeOptions {
  childUid?: string;
  /** `addChild` on a monthly plan: the new monthly amount the parent confirmed */
  confirmedAmountAgorot?: number;
}

async function postAsParent(url: string, body: Record<string, unknown>): Promise<Response | ParentResult<never>> {
  const user = auth?.currentUser;
  if (!user) return { ok: false, errorHe: SIGN_IN_ERROR_HE };
  try {
    const [idToken, appCheckToken] = await Promise.all([user.getIdToken(), getAppCheckToken()]);
    return await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        [TTS_TOKEN_HEADER]: idToken,
        ...(appCheckToken ? { [APP_CHECK_HEADER]: appCheckToken } : {}),
      },
      body: JSON.stringify(body),
    });
  } catch {
    // fetch only throws when there is no connection
    return { ok: false, errorHe: OFFLINE_ERROR_HE };
  }
}

/** Opens a payment page for the chosen children; the value is the page's address. */
export async function startProCheckout(request: CheckoutRequest): Promise<ParentResult<string>> {
  const response = await postAsParent(CHECKOUT_URL, { ...request });
  if (!(response instanceof Response)) return response;
  if (!response.ok) return { ok: false, errorHe: await checkoutErrorHe(response) };
  const body = (await response.json().catch(() => null)) as { url?: unknown } | null;
  const url = typeof body?.url === 'string' ? body.url : '';
  // Only an https page, or our own origin (the stand-in gateway's page)
  const isSafe = url.startsWith('https://') || url.startsWith(`${window.location.origin}/`);
  return isSafe ? { ok: true, value: url } : { ok: false, errorHe: GENERIC_ERROR_HE };
}

/** Cancels a plan (a monthly renewal, or with a refund), or adds or removes a child (the paying parent only). */
export async function changeProPlan(action: PlanAction, subscriptionId: string, options: PlanChangeOptions = {}): Promise<ParentResult> {
  const { childUid, confirmedAmountAgorot } = options;
  const response = await postAsParent(SUBSCRIPTION_URL, {
    action,
    subscriptionId,
    ...(childUid ? { childUid } : {}),
    ...(confirmedAmountAgorot ? { confirmedAmountAgorot } : {}),
  });
  if (!(response instanceof Response)) return response;
  if (response.ok) return { ok: true, value: undefined };
  return { ok: false, errorHe: await planErrorHe(response) };
}

/** What cancelling this plan would give back, without changing it (the paying parent only). */
export async function quoteProCancellation(subscriptionId: string): Promise<ParentResult<CancelQuote>> {
  const response = await postAsParent(SUBSCRIPTION_URL, { action: 'quoteCancel', subscriptionId });
  if (!(response instanceof Response)) return response;
  if (!response.ok) return { ok: false, errorHe: await planErrorHe(response) };
  const quote = readCancelQuote(await response.json().catch(() => null));
  return quote ? { ok: true, value: quote } : { ok: false, errorHe: GENERIC_ERROR_HE };
}

/** The stand-in gateway's "pay" (emulator runs only): tells the server the checkout was paid. */
export async function payMockCheckout(checkoutId: string): Promise<ParentResult> {
  try {
    const response = await fetch(MOCK_PAY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkoutId }),
    });
    return response.ok ? { ok: true, value: undefined } : { ok: false, errorHe: GENERIC_ERROR_HE };
  } catch {
    return { ok: false, errorHe: OFFLINE_ERROR_HE };
  }
}
