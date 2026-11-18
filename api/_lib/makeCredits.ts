/**
 * Warns the owner before Make's monthly credits run out. Every Grow checkout goes through the Make
 * scenario (docs/grow-make-setup.md); with no credits left Make stops it until the cycle resets, and
 * new checkouts fail. The daily reconcile (`api/pro-reconcile.ts`) reads the organization's usage
 * with a read-only Make API token (`organizations:read`) and alerts the owner, by email and Telegram,
 * once at 70% and once more at 90% in each cycle. What was last sent is kept in
 * `ownerNotices/makeCredits` (server only) so it isn't repeated every night.
 * Without `MAKE_API_TOKEN` and `MAKE_ORGANIZATION_ID` it does nothing.
 */
import type { FirestoreAdmin } from './firestoreAdmin.js';
import type { OwnerNotice } from './ownerAlerts.js';

const TIMEOUT_MS = 10_000;
const CENTICREDITS_PER_CREDIT = 100;
const PERCENT = 100;
const DEFAULT_ZONE = 'eu1.make.com';
/** Warning levels, in percent of the cycle's credits */
export const CREDIT_WARNING_LEVELS = [70, 90] as const;

const ORGANIZATION_ID_PATTERN = /^\d{1,12}$/;
/** Make's own API hosts only, so the token can't be sent anywhere else */
const ZONE_PATTERN = /^[a-z]{2}\d{1,2}\.make\.com$/;
const NOTICE_COLLECTION = 'ownerNotices';
const NOTICE_ID = 'makeCredits';

export interface MakeApiConfig {
  token: string;
  organizationId: string;
  zone: string;
}

export interface MakeCredits {
  used: number;
  limit: number;
  percent: number;
  /** The cycle's start and next reset, as Make gives them (ISO) */
  cycleStart: string;
  nextReset: string;
}

export interface MakeCreditsCheck extends MakeCredits {
  alerted: boolean;
}

export interface MakeCreditsDeps {
  fetchImpl?: typeof fetch;
  nowMs?: () => number;
}

export function readMakeApiConfig(env: Record<string, string | undefined>): MakeApiConfig | null {
  const token = env.MAKE_API_TOKEN?.trim() ?? '';
  const organizationId = env.MAKE_ORGANIZATION_ID?.trim() ?? '';
  const zone = env.MAKE_ZONE?.trim() || DEFAULT_ZONE;
  if (!token || !ORGANIZATION_ID_PATTERN.test(organizationId) || !ZONE_PATTERN.test(zone)) return null;
  return { token, organizationId, zone };
}

/** The highest warning level reached (0: none) */
export function creditLevel(used: number, limit: number): number {
  if (limit <= 0) return 0;
  const percent = (used / limit) * PERCENT;
  return Math.max(0, ...CREDIT_WARNING_LEVELS.filter((level) => percent >= level));
}

const toNumber = (value: unknown) => {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  return Number.isFinite(parsed) ? parsed : 0;
};
const toText = (value: unknown) => (typeof value === 'string' ? value : '');

export class MakeApiError extends Error {
  constructor(readonly status: number | 'invalid') {
    super(`Make API ${status}`);
  }
}

async function fetchMakeCredits(config: MakeApiConfig, fetchImpl: typeof fetch): Promise<MakeCredits> {
  const response = await fetchImpl(`https://${config.zone}/api/v2/organizations/${config.organizationId}`, {
    headers: { Authorization: `Token ${config.token}`, Accept: 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new MakeApiError(response.status);
  const body = (await response.json().catch(() => null)) as { organization?: Record<string, unknown> } | null;
  const org = body?.organization;
  const license = org?.license as Record<string, unknown> | undefined;
  const planCredits = toNumber(license?.operations);
  if (!org || planCredits <= 0) throw new MakeApiError('invalid');
  const used = toNumber(org.centicreditsConsumed) / CENTICREDITS_PER_CREDIT;
  // Extra credits bought this cycle raise the limit
  const limit = planCredits + toNumber(org.centicreditsExtra) / CENTICREDITS_PER_CREDIT;
  return {
    used,
    limit,
    percent: Math.round((used / limit) * PERCENT),
    cycleStart: toText(org.lastReset),
    nextReset: toText(org.nextReset),
  };
}

const formatDate = (iso: string) => {
  const ms = Date.parse(iso);
  return Number.isFinite(ms)
    ? new Intl.DateTimeFormat('he-IL', { timeZone: 'Asia/Jerusalem', day: '2-digit', month: '2-digit', year: 'numeric' }).format(ms)
    : '';
};

function creditsNotice(credits: MakeCredits, level: number): OwnerNotice {
  const resetDate = formatDate(credits.nextReset);
  const lines = [
    `נוצלו ${Math.round(credits.used)} מתוך ${credits.limit} קרדיטים ב-Make בחודש הזה (${credits.percent}%).`,
    resetDate ? `הקרדיטים מתחדשים ב-${resetDate}.` : '',
    'כשהקרדיטים נגמרים, Make עוצר את תרחיש התשלומים ותשלומים חדשים נכשלים עד החידוש.',
    'כדאי לשדרג את המנוי ב-Make (או לקנות קרדיטים נוספים) לפני שזה קורה.',
  ];
  return {
    kind: 'make_credits',
    subject: `EnglishVibe: נוצלו ${level}% מהקרדיטים ב-Make`,
    text: lines.filter(Boolean).join('\n'),
  };
}

/**
 * Reads Make's usage and warns the owner when a new level is reached in this cycle. Returns null
 * when it isn't configured. A warning that couldn't be sent isn't recorded, so the next run tries again.
 */
export async function checkMakeCredits(
  env: Record<string, string | undefined>,
  admin: Pick<FirestoreAdmin, 'getDocument' | 'commit'>,
  notify: (notice: OwnerNotice) => Promise<boolean>,
  { fetchImpl = fetch, nowMs = Date.now }: MakeCreditsDeps = {}
): Promise<MakeCreditsCheck | null> {
  const config = readMakeApiConfig(env);
  if (!config) return null;
  const credits = await fetchMakeCredits(config, fetchImpl);
  const level = creditLevel(credits.used, credits.limit);
  const saved = await admin.getDocument(NOTICE_COLLECTION, NOTICE_ID);
  const sameCycle = saved?.fields.cycleStart === credits.cycleStart;
  const sentLevel = sameCycle ? toNumber(saved?.fields.level) : 0;
  if (level <= sentLevel) return { ...credits, alerted: false };
  if (!(await notify(creditsNotice(credits, level)))) return { ...credits, alerted: false };
  await admin.commit([{
    collection: NOTICE_COLLECTION,
    id: NOTICE_ID,
    fields: { cycleStart: credits.cycleStart, level, percent: credits.percent, updatedAt: nowMs() },
  }]);
  return { ...credits, alerted: true };
}
