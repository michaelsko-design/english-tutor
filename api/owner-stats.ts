/**
 * GET /api/owner-stats: the numbers behind the owner dashboard (`?owner`). Only the owner's Google
 * account may call it (`OWNER_UID`, the uid of that account); the answer holds aggregates only.
 * The same account can still be a parent: this adds a second route, it changes nothing for parents.
 */
import { createFirestoreAdmin } from './_lib/firestoreAdmin.js';
import { AdminError, createAuthAdmin } from './_lib/googleAdmin.js';
import { authenticateOwner } from './_lib/ownerRequest.js';
import { errorResponse, jsonResponse, type ParentRequestDeps } from './_lib/parentRequest.js';
import { computeUsageStats, readAnalyticsRows, readClientErrorRows } from './_lib/usageStats.js';
import { computeOwnerStats, israelDateStr, proChildUidsFrom, withoutTestUsers, type LearnerRow } from './_lib/ownerStats.js';

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
  const owner = await authenticateOwner(request, env, deps);
  if (owner instanceof Response) return owner;
  const { account, projectId } = owner;

  const { fetchImpl = fetch, nowMs = Date.now, createAdmin = createFirestoreAdmin } = deps;
  const findAnonymousUids = deps.findAnonymousUids ?? ((uids: string[]) => createAuthAdmin(account, projectId, { fetchImpl }).findAnonymousUids(uids));

  try {
    const admin = createAdmin(account, projectId, { fetchImpl });
    const now = new Date(nowMs());
    // The owner's list of test accounts: every source below is read through it, so only real users are counted
    const testUids = new Set((await admin.listFieldsOf('testUsers', ['label'])).map((row) => row.id));
    const uidOf = (row: { id: string }) => [row.id];
    const learners: LearnerRow[] = withoutTestUsers(await admin.listFieldsOf('learners', LEARNER_FIELDS), testUids, uidOf);
    const entitlements = withoutTestUsers(await admin.listFieldsOf('entitlements', ['status', 'periodEnd']), testUids, uidOf);
    const anonymousUids = await findAnonymousUids(learners.map((row) => row.id));
    const [links, sends, subscriptions, analyticsDocs, errorDocs] = await Promise.all([
      admin.listFieldsOf('parentLinks', ['parentUid', 'childUid']),
      admin.listFieldsOf('reminderSends', ['uid', 'dateStr', 'kind']),
      admin.listFieldsOf('pushSubscriptions', ['streakDays']),
      admin.listFieldsOf('analyticsDaily', ['uid', 'day', 'counts']),
      admin.listFieldsOf('clientErrors', ['day', 'message', 'source', 'count']),
    ]);
    const todayStr = israelDateStr(now);
    const usage = computeUsageStats(
      readAnalyticsRows(withoutTestUsers(analyticsDocs, testUids, ({ fields }) => [String(fields.uid)])),
      readClientErrorRows(errorDocs),
      todayStr
    );
    const stats = computeOwnerStats({
      excludedTestUsers: testUids.size,
      parentLinks: withoutTestUsers(links, testUids, ({ fields }) => [String(fields.parentUid), String(fields.childUid)]).flatMap(({ fields }) =>
        typeof fields.parentUid === 'string' && typeof fields.childUid === 'string'
          ? [{ parentUid: fields.parentUid, childUid: fields.childUid }]
          : []
      ),
      reminderSends: withoutTestUsers(sends, testUids, ({ fields }) => [String(fields.uid)]).flatMap(({ fields }) =>
        typeof fields.uid === 'string' && typeof fields.dateStr === 'string' && (fields.kind === 'streak' || fields.kind === 'comeback')
          ? [{ uid: fields.uid, dateStr: fields.dateStr, kind: fields.kind }]
          : []
      ),
      reminderSubscribers: withoutTestUsers(subscriptions, testUids, uidOf).length,
      learners,
      anonymousUids,
      proChildUids: proChildUidsFrom(entitlements, now.getTime()),
      todayStr: israelDateStr(now),
      now,
    });
    return jsonResponse(200, { ...stats, usage });
  } catch (error) {
    // Only a status is logged: never ids, tokens or keys
    console.error(`owner-stats: failed (${error instanceof AdminError ? error.status : 'unexpected'})`);
    return errorResponse(502, 'Could not load the stats');
  }
}

export function GET(request: Request): Promise<Response> {
  return handleOwnerStatsRequest(request, process.env);
}
