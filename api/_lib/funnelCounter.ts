/**
 * POST /api/owner-stats { event, src? } (the same function file as the owner stats: Vercel Hobby allows 12
 * functions, so the counter is a method of that file): counts one step of the sign-up funnel before an account exists
 * (src/services/analytics/events.ts FUNNEL_EVENTS). There is no learner to tie it to, so it adds 1
 * to a counter in one document per day (`funnelDaily/{day}`) and stores nothing else: no address,
 * no device, no id. Only allow-listed event names count; an address is limited per hour so a script
 * can't swamp the numbers. The count is a brake, not a quota (see _lib/rateLimit.ts).
 */
import { createFirestoreAdmin, type FirestoreAdmin } from './firestoreAdmin.js';
import { parseServiceAccount } from './googleAdmin.js';
import { israelDateStr } from './ownerStats.js';
import { errorResponse, firebaseProjectId, readJsonBody } from './parentRequest.js';
import { createRateLimiter } from './rateLimit.js';
import { isMarketingSource } from '../../src/config/marketingSources.js';
import { FUNNEL_DAILY_COLLECTION, funnelSourceKey, isFunnelEvent, isFunnelSourceEvent } from '../../src/services/analytics/events.js';

const MAX_BODY_BYTES = 128;
const RATE_WINDOW_MS = 60 * 60 * 1000;
/** A classroom shares one address, and a signing-up child makes about six calls */
const MAX_CALLS_PER_IP = 600;
const defaultIpLimiter = createRateLimiter({ limit: MAX_CALLS_PER_IP, windowMs: RATE_WINDOW_MS });

export interface FunnelDeps {
  fetchImpl?: typeof fetch;
  nowMs?: () => number;
  createAdmin?: (...args: Parameters<typeof createFirestoreAdmin>) => FirestoreAdmin;
  isIpWithinLimit?: (ip: string) => boolean;
}

/** Vercel puts the client address first in x-forwarded-for */
const clientIp = (request: Request): string => request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';

export async function handleFunnelRequest(
  request: Request,
  env: Record<string, string | undefined>,
  deps: FunnelDeps = {}
): Promise<Response> {
  const { fetchImpl = fetch, nowMs = Date.now, createAdmin = createFirestoreAdmin, isIpWithinLimit = defaultIpLimiter } = deps;
  if (request.method !== 'POST') return errorResponse(405, 'Method not allowed');
  if (!isIpWithinLimit(clientIp(request))) return errorResponse(429, 'Too many calls');

  const body = await readJsonBody(request, MAX_BODY_BYTES);
  if (!isFunnelEvent(body?.event)) return errorResponse(400, 'Unknown event');

  const account = parseServiceAccount(env.FIREBASE_SERVICE_ACCOUNT_JSON);
  if (!account) return errorResponse(503, 'Not configured');

  try {
    const admin = createAdmin(account, firebaseProjectId(env), { fetchImpl });
    // Two steps are also counted per source tag; a tag outside the list never becomes a field name
    const sourceField = isFunnelSourceEvent(body.event) && isMarketingSource(body.src) ? [funnelSourceKey(body.event, body.src)] : [];
    await admin.incrementCounters(FUNNEL_DAILY_COLLECTION, israelDateStr(new Date(nowMs())), [body.event, ...sourceField]);
    return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    // Counting is best effort: the caller never needs to know
    return errorResponse(502, 'Could not count');
  }
}
