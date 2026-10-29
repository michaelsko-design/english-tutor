/**
 * GET /api/streak-reminder: the daily Vercel Cron job (vercel.json; once a day works on the Hobby
 * plan). For every learner who turned on streak reminders it sends a Web Push every day they have not
 * practised yet (never on Friday/Shabbat for Shabbat observers): "keep your streak" while the streak
 * is alive, otherwise a short "come back, just 5 minutes" nudge. Vercel Cron
 * authenticates with `Authorization: Bearer $CRON_SECRET`. Subscriptions the push service reports
 * as gone (404/410) are deleted.
 */
import webpush from 'web-push';
import { createFirestoreAdmin, type FirestoreAdmin, type PlainDocument } from './_lib/firestoreAdmin.js';
import { AdminError, parseServiceAccount } from './_lib/googleAdmin.js';
import { safeEqual } from './_lib/payments/provider.js';
import {
  buildReminderMessage,
  getReminderKind,
  getIsraelToday,
  isPushServiceEndpoint,
  isReminderDue,
  type ReminderKind,
  type ReminderSubscriber,
} from './_lib/streakReminder.js';

const DEFAULT_FIREBASE_PROJECT_ID = 'english-tutor-il-7';
const COLLECTION = 'pushSubscriptions';
const SENDS_COLLECTION = 'reminderSends';
const GONE_STATUSES = [404, 410];
const PUSH_TTL_S = 3600;
// Sends run one after another inside the function's time limit: a push service that never answers must not stall the rest
const PUSH_TIMEOUT_MS = 5000;

export interface PushTarget {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export interface StreakReminderDeps {
  nowMs?: () => number;
  createAdmin?: (account: NonNullable<ReturnType<typeof parseServiceAccount>>, projectId: string) => FirestoreAdmin;
  sendPush?: (target: PushTarget, payload: string, vapid: { subject: string; publicKey: string; privateKey: string }) => Promise<void>;
}

function jsonResponse(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

async function defaultSendPush(
  target: PushTarget,
  payload: string,
  vapid: { subject: string; publicKey: string; privateKey: string }
): Promise<void> {
  await webpush.sendNotification(target, payload, { vapidDetails: vapid, TTL: PUSH_TTL_S, timeout: PUSH_TIMEOUT_MS });
}

function toSubscriber(doc: PlainDocument): (ReminderSubscriber & PushTarget) | null {
  const { endpoint, p256dh, auth, streakDays, streakLastDateStr, isShabbatObserver, gender } = doc.fields;
  if (typeof endpoint !== 'string' || typeof p256dh !== 'string' || typeof auth !== 'string') return null;
  if (!isPushServiceEndpoint(endpoint)) return null;
  if (typeof streakDays !== 'number') return null;
  return {
    id: doc.id,
    endpoint,
    keys: { p256dh, auth },
    streakDays,
    streakLastDateStr: typeof streakLastDateStr === 'string' ? streakLastDateStr : undefined,
    isShabbatObserver: isShabbatObserver !== false,
    gender: gender === 'girl' || gender === 'boy' ? gender : undefined,
  };
}

function statusOf(error: unknown): number | undefined {
  return typeof error === 'object' && error !== null && 'statusCode' in error
    ? Number((error as { statusCode: unknown }).statusCode)
    : undefined;
}

/** Records the push for the owner dashboard's effectiveness numbers; a failure here never stops the run. */
async function logSend(admin: FirestoreAdmin, uid: string, dateStr: string, kind: ReminderKind): Promise<void> {
  try {
    await admin.commit([{ collection: SENDS_COLLECTION, id: `${dateStr}_${uid}`, fields: { uid, dateStr, kind } }]);
  } catch (error) {
    console.error(`streak-reminder: could not log a send (${error instanceof AdminError ? error.status : 'unexpected'})`);
  }
}

export async function handleStreakReminderRequest(
  request: Request,
  env: Record<string, string | undefined>,
  { nowMs = Date.now, createAdmin = createFirestoreAdmin, sendPush = defaultSendPush }: StreakReminderDeps = {}
): Promise<Response> {
  const secret = env.CRON_SECRET;
  if (!secret || !safeEqual(request.headers.get('authorization') ?? '', `Bearer ${secret}`)) {
    return jsonResponse(401, { error: 'Unauthorized' });
  }

  const account = parseServiceAccount(env.FIREBASE_SERVICE_ACCOUNT_JSON);
  const publicKey = env.VITE_VAPID_PUBLIC_KEY;
  const privateKey = env.VAPID_PRIVATE_KEY;
  if (!account || !publicKey || !privateKey) return jsonResponse(503, { error: 'Reminders are not configured' });
  const vapid = { subject: env.VAPID_SUBJECT || 'mailto:admin@example.com', publicKey, privateKey };

  const admin = createAdmin(account, env.FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_PROJECT_ID);
  const today = getIsraelToday(nowMs());
  let sent = 0;
  let removed = 0;
  let failed = 0;

  try {
    const subscribers = (await admin.listDocuments(COLLECTION))
      .map(toSubscriber)
      .filter((s): s is ReminderSubscriber & PushTarget => s !== null && isReminderDue(s, today));

    for (const subscriber of subscribers) {
      try {
        const kind = getReminderKind(subscriber, today);
        await sendPush(subscriber, JSON.stringify(buildReminderMessage(subscriber, kind)), vapid);
        sent += 1;
        await logSend(admin, subscriber.id, today, kind);
      } catch (error) {
        const status = statusOf(error);
        if (status !== undefined && GONE_STATUSES.includes(status)) {
          await admin.deleteDocument(COLLECTION, subscriber.id);
          removed += 1;
        } else {
          failed += 1;
          // Only the status is logged: never the endpoint or the keys.
          console.error(`streak-reminder: push failed (${status ?? 'unexpected'})`);
        }
      }
    }
  } catch (error) {
    // Only the failing step and status are logged: never the key or the token.
    console.error(`streak-reminder: could not read subscriptions (${error instanceof AdminError ? `${error.message}, status ${error.status}` : 'unexpected'})`);
    return jsonResponse(502, { error: 'Reminder run failed' });
  }

  return jsonResponse(200, { sent, removed, failed });
}

export function GET(request: Request): Promise<Response> {
  return handleStreakReminderRequest(request, process.env);
}
