/**
 * /api/redeem-invite: closed early-tester phase. A signed-in learner sends the single-use access
 * code from their invite link; on success the server records them as allowed (`allowed/{uid}`),
 * gives them a comp Pro entitlement, and marks the code used. `firestore.rules` lets only allowed
 * accounts read and write learner data while `config/access.open` is false.
 *   POST { code } → 200 { ok: true, cohort } | 400 | 401 | 404 unknown | 409 used | 410 expired
 * Collections `invites`, `allowed`, `entitlements` are written by the service account only.
 */
import { createFirestoreAdmin, ConflictError, type FirestoreAdmin } from './_lib/firestoreAdmin.js';
import { AdminError, parseServiceAccount } from './_lib/googleAdmin.js';
import { readFirebaseClaims, verifyFirebaseIdToken } from './_lib/firebaseToken.js';
import { errorResponse, firebaseProjectId, jsonResponse, readJsonBody } from './_lib/parentRequest.js';
import { TTS_TOKEN_HEADER } from '../src/services/tts/ttsText.js';

const MAX_BODY_BYTES = 256;
/** Codes are 10 characters from an alphabet without look-alikes (see scripts/createInvite.mjs) */
const CODE_PATTERN = /^[A-HJKMNP-Z2-9]{10}$/;
/** Open-ended comp Pro: 1 Jan 2100, as scripts/grantPro.mjs */
const COMP_PERIOD_END_MS = Date.UTC(2100, 0, 1);

export interface RedeemInviteDeps {
  fetchImpl?: typeof fetch;
  verifyToken?: (token: string, projectId: string) => Promise<boolean>;
  nowMs?: () => number;
  createAdmin?: (...args: Parameters<typeof createFirestoreAdmin>) => FirestoreAdmin;
}

const text = (value: unknown, fallback: string): string => (typeof value === 'string' && value ? value : fallback);

export async function handleRedeemInviteRequest(
  request: Request,
  env: Record<string, string | undefined>,
  deps: RedeemInviteDeps = {}
): Promise<Response> {
  const { fetchImpl = fetch, verifyToken = verifyFirebaseIdToken, nowMs = Date.now, createAdmin = createFirestoreAdmin } = deps;
  if (request.method !== 'POST') return errorResponse(405, 'Method not allowed');

  const projectId = firebaseProjectId(env);
  const idToken = request.headers.get(TTS_TOKEN_HEADER) ?? '';
  if (!idToken || !(await verifyToken(idToken, projectId))) return errorResponse(401, 'Sign in first');
  const claims = readFirebaseClaims(idToken);
  if (!claims || claims.signInProvider === 'anonymous') return errorResponse(401, 'Sign in with an account first');

  const body = await readJsonBody(request, MAX_BODY_BYTES);
  const code = typeof body?.code === 'string' ? body.code.trim().toUpperCase() : '';
  if (!CODE_PATTERN.test(code)) return errorResponse(400, 'Invalid code');

  const account = parseServiceAccount(env.FIREBASE_SERVICE_ACCOUNT_JSON);
  if (!account) return errorResponse(503, 'Not configured');

  try {
    const admin = createAdmin(account, projectId, { fetchImpl });
    const invite = await admin.getDocument('invites', code);
    if (!invite) return errorResponse(404, 'Unknown code');

    const usedBy = invite.fields.usedByUid;
    const cohort = text(invite.fields.cohort, 'tester');
    const label = text(invite.fields.label, code);
    const isOwnRedeem = typeof usedBy === 'string' && usedBy === claims.uid;
    if (typeof usedBy === 'string' && usedBy && !isOwnRedeem) return errorResponse(409, 'Code already used');
    const now = nowMs();
    if (!isOwnRedeem && typeof invite.fields.expiresAt === 'number' && invite.fields.expiresAt < now) {
      return errorResponse(410, 'Code expired');
    }

    const existingEntitlement = await admin.getDocument('entitlements', claims.uid);
    const keepsSubscription = existingEntitlement?.fields.source === 'subscription';
    await admin.commit([
      // Claims the code: fails if another account used it since the read above
      {
        collection: 'invites',
        id: code,
        fields: { usedByUid: claims.uid, usedAt: now },
        mergeFields: ['usedByUid', 'usedAt'],
        ...(invite.updateTime ? { precondition: { updateTime: invite.updateTime } } : {}),
      },
      { collection: 'allowed', id: claims.uid, fields: { cohort, label, invitedAt: now } },
      ...(keepsSubscription
        ? []
        : [
            {
              collection: 'entitlements',
              id: claims.uid,
              fields: {
                plan: 'pro',
                status: 'active',
                source: 'comp',
                billingPeriod: null,
                periodEnd: COMP_PERIOD_END_MS,
                payerParentUid: null,
                updatedAt: now,
              },
            },
          ]),
    ]);
    return jsonResponse(200, { ok: true, cohort });
  } catch (error) {
    if (error instanceof ConflictError) return errorResponse(409, 'Code already used');
    // Only a status is logged: never codes, uids or tokens
    console.error(`redeem-invite: failed (${error instanceof AdminError ? error.status : 'unexpected'})`);
    return errorResponse(502, 'Could not redeem the code');
  }
}

export const POST = (request: Request): Promise<Response> => handleRedeemInviteRequest(request, process.env);
