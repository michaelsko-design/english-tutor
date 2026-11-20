/**
 * POST /api/pro-trial  {childUid}: a linked parent starts a child's free Pro week (docs/feature-pro-tier.md,
 * "Pro week"). Once per child account: a child who ever had any entitlement (a plan, a comp grant or an
 * earlier week) gets none, and `proTrials/{childUid}` stays as the record. No payment, no card, nothing
 * renews: the week's entitlement ends on its day (no grace days) and the daily reconcile marks it expired.
 */
import { ConflictError, createFirestoreAdmin } from './_lib/firestoreAdmin.js';
import { AdminError, parseServiceAccount } from './_lib/googleAdmin.js';
import {
  authenticateParent,
  errorResponse,
  isParentLinked,
  jsonResponse,
  readJsonBody,
  type ParentRequestDeps,
} from './_lib/parentRequest.js';
import { createPaymentProvider } from './_lib/payments/index.js';
import { UID_PATTERN } from './_lib/proBilling.js';
import { PRO_TRIAL_DAYS } from '../src/config/proTier.js';

const MAX_BODY_BYTES = 1024;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface ProTrialDeps extends ParentRequestDeps {
  fetchImpl?: typeof fetch;
  nowMs?: () => number;
  createAdmin?: typeof createFirestoreAdmin;
  createProvider?: typeof createPaymentProvider;
}

const refusal = (status: number, error: string, reason: string) => jsonResponse(status, { error, reason });

export async function handleProTrialRequest(
  request: Request,
  env: Record<string, string | undefined>,
  deps: ProTrialDeps = {}
): Promise<Response> {
  if (request.method !== 'POST') return errorResponse(405, 'Method not allowed');
  const { fetchImpl = fetch, nowMs = Date.now, createAdmin = createFirestoreAdmin, createProvider = createPaymentProvider } = deps;
  const caller = await authenticateParent(request, env, deps);
  if (caller instanceof Response) return caller;
  const body = await readJsonBody(request, MAX_BODY_BYTES);
  const childUid = typeof body?.childUid === 'string' ? body.childUid : '';
  if (!UID_PATTERN.test(childUid)) return errorResponse(400, 'Invalid request');
  if (childUid === caller.parentUid) return errorResponse(403, 'Not allowed');

  // Offered only where Pro is sold: the same switch as the checkout
  const account = parseServiceAccount(env.FIREBASE_SERVICE_ACCOUNT_JSON);
  if (!createProvider(env, fetchImpl) || !account) return errorResponse(503, 'Payments are not configured');

  try {
    if (!(await isParentLinked(caller, childUid, fetchImpl))) return errorResponse(403, 'This parent is not linked to that learner');
    const admin = createAdmin(account, caller.projectId, { fetchImpl });
    const [entitlement, trial] = await Promise.all([admin.getDocument('entitlements', childUid), admin.getDocument('proTrials', childUid)]);
    if (trial) return refusal(409, 'This child already had a free Pro week', 'trial_used');
    if (entitlement) return refusal(409, 'This child already has or had Pro', 'had_pro');

    const now = nowMs();
    const endsAt = now + PRO_TRIAL_DAYS * DAY_MS;
    await admin.commit([
      // Created once: a second start (two taps, two parents) fails here
      {
        collection: 'proTrials',
        id: childUid,
        precondition: { exists: false },
        fields: { parentUid: caller.parentUid, startedAt: now, endsAt },
      },
      {
        collection: 'entitlements',
        id: childUid,
        precondition: { exists: false },
        fields: {
          plan: 'pro',
          status: 'active',
          source: 'trial',
          billingPeriod: null,
          periodEnd: endsAt,
          payerParentUid: caller.parentUid,
          updatedAt: now,
        },
      },
    ]);
    return jsonResponse(200, { ok: true, endsAt });
  } catch (error) {
    if (error instanceof ConflictError) return refusal(409, 'This child already had a free Pro week', 'trial_used');
    // Only a status is logged: never uids or tokens
    console.error(`pro-trial: failed (${error instanceof AdminError ? error.status : 'unexpected'})`);
    return errorResponse(502, 'The free week could not be started');
  }
}

export function POST(request: Request): Promise<Response> {
  return handleProTrialRequest(request, process.env);
}
