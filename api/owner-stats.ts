/**
 * GET /api/owner-stats: the numbers behind the owner dashboard (`?owner`). Only the owner's Google
 * account may call it (`OWNER_UID`, the uid of that account); the answer holds aggregates only.
 * The same account can still be a parent: this adds a second route, it changes nothing for parents.
 */
import { createFirestoreAdmin } from './_lib/firestoreAdmin.js';
import { AdminError, createAuthAdmin, parseServiceAccount } from './_lib/googleAdmin.js';
import { authenticateParent, errorResponse, firebaseProjectId, jsonResponse, type ParentRequestDeps } from './_lib/parentRequest.js';
import { safeEqual } from './_lib/payments/provider.js';
import { computeOwnerStats, israelDateStr, proChildUidsFrom, type LearnerRow } from './_lib/ownerStats.js';

const LEARNER_FIELDS = ['gradeId', 'isOnboarded', 'activityLog'] as const;

export interface OwnerStatsDeps extends ParentRequestDeps {
  nowMs?: () => number;
  createAdmin?: typeof createFirestoreAdmin;
  findAnonymousUids?: (uids: string[]) => Promise<Set<string>>;
}

export async function handleOwnerStatsRequest(
  request: Request,
  env: Record<string, string | undefined>,
  deps: OwnerStatsDeps = {}
): Promise<Response> {
  const ownerUid = env.OWNER_UID;
  if (!ownerUid) return errorResponse(503, 'The owner dashboard is not configured');
  const caller = await authenticateParent(request, env, deps);
  if (caller instanceof Response) return caller;
  if (!safeEqual(caller.parentUid, ownerUid)) return errorResponse(403, 'Owner only');

  const account = parseServiceAccount(env.FIREBASE_SERVICE_ACCOUNT_JSON);
  if (!account) return errorResponse(503, 'The owner dashboard is not configured');

  const { fetchImpl = fetch, nowMs = Date.now, createAdmin = createFirestoreAdmin } = deps;
  const projectId = firebaseProjectId(env);
  const findAnonymousUids = deps.findAnonymousUids ?? ((uids: string[]) => createAuthAdmin(account, projectId, { fetchImpl }).findAnonymousUids(uids));

  try {
    const admin = createAdmin(account, projectId, { fetchImpl });
    const now = new Date(nowMs());
    const learners: LearnerRow[] = await admin.listFieldsOf('learners', LEARNER_FIELDS);
    const entitlements = await admin.listFieldsOf('entitlements', ['status', 'periodEnd']);
    const anonymousUids = await findAnonymousUids(learners.map((row) => row.id));
    const [links, sends, subscriptions] = await Promise.all([
      admin.listFieldsOf('parentLinks', ['parentUid', 'childUid']),
      admin.listFieldsOf('reminderSends', ['uid', 'dateStr', 'kind']),
      admin.listFieldsOf('pushSubscriptions', ['streakDays']),
    ]);
    const stats = computeOwnerStats({
      parentLinks: links.flatMap(({ fields }) =>
        typeof fields.parentUid === 'string' && typeof fields.childUid === 'string'
          ? [{ parentUid: fields.parentUid, childUid: fields.childUid }]
          : []
      ),
      reminderSends: sends.flatMap(({ fields }) =>
        typeof fields.uid === 'string' && typeof fields.dateStr === 'string' && (fields.kind === 'streak' || fields.kind === 'comeback')
          ? [{ uid: fields.uid, dateStr: fields.dateStr, kind: fields.kind }]
          : []
      ),
      reminderSubscribers: subscriptions.length,
      learners,
      anonymousUids,
      proChildUids: proChildUidsFrom(entitlements, now.getTime()),
      todayStr: israelDateStr(now),
      now,
    });
    return jsonResponse(200, { ...stats });
  } catch (error) {
    // Only a status is logged: never ids, tokens or keys
    console.error(`owner-stats: failed (${error instanceof AdminError ? error.status : 'unexpected'})`);
    return errorResponse(502, 'Could not load the stats');
  }
}

export function GET(request: Request): Promise<Response> {
  return handleOwnerStatsRequest(request, process.env);
}
