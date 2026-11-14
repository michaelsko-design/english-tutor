/**
 * Staging only: writes marked test learners (`seed-funnel-*`) for the owner dashboard's Funnel tab,
 * runs the real owner-stats handler on the staging data before and after, and compares the change
 * with what the seed should add. Uses the Firebase CLI's login; refuses any project but staging.
 *
 *   NPM_GLOBAL_ROOT="$(npm root -g)" npx vite-node scripts/staging/seedFunnelTest.ts run
 *   NPM_GLOBAL_ROOT="$(npm root -g)" npx vite-node scripts/staging/seedFunnelTest.ts clean
 */
import { generateKeyPairSync } from 'node:crypto';
import { createRequire } from 'node:module';
import path from 'node:path';
import { handleOwnerStatsRequest } from '../../api/owner-stats';
import { addDaysToDateStr, israelDateStr } from '../../api/_lib/ownerStats';
import type { ConversionStats, StepCounts } from '../../api/_lib/conversionFunnel';

const PROJECT_ID = 'english-tutor-staging';
const SEED = 'seed-funnel';
const DOCS = `projects/${PROJECT_ID}/databases/(default)/documents`;
const REST = `https://firestore.googleapis.com/v1/${DOCS}`;
const DAY_MS = 24 * 60 * 60 * 1000;
const GRADES = ['grade-1', 'grade-3', 'grade-5', 'grade-8'];
const SEEDED_COLLECTIONS = ['learners', 'signups', 'analyticsDaily', 'parentLinks', 'checkouts', 'entitlements', 'subscriptions'];

type Json = Record<string, unknown>;
type SeedDoc = { collection: string; id: string; fields: Json };

interface Spec {
  uid: string;
  signupAgo: number;
  /** Mission days as [days after sign-up, missions] */
  activity: Array<[number, number]>;
  activated: boolean;
  wallOffset: number | null;
  asked: boolean;
  parent: boolean;
  checkout: boolean;
  paid: boolean;
  cancelled: boolean;
  day30Eligible: boolean;
  activeDay30: boolean;
  /** What the dashboard should file the learner under */
  src: string;
  /** What is stored in `signups` (null: no document) */
  storedSrc: string | null;
  campaign?: string;
  gradeId: string;
}

const uidOf = (i: number): string => `${SEED}-${String(i).padStart(2, '0')}`;
const inSet = (i: number, ...ids: number[]): boolean => ids.includes(i);
const between = (i: number, from: number, to: number): boolean => i >= from && i <= to;

/** Day-30 activity for the oldest group: [days after sign-up, missions, counts as active at day 30] */
const DAY30_EXTRA: Record<number, [number, number, boolean]> = {
  1: [30, 1, true],
  2: [30, 1, true],
  3: [30, 1, true],
  4: [27, 1, false], // one day too early
  5: [28, 1, true], // first day of the window
  6: [34, 1, true], // last day of the window
  7: [35, 1, false], // one day too late
  8: [30, 0, false], // opened the app, no mission
};

function sourceOf(i: number): Pick<Spec, 'src' | 'storedSrc' | 'campaign'> {
  if (between(i, 1, 10)) return { src: 'wa-family', storedSrc: 'wa-family' };
  if (between(i, 11, 18)) return { src: 'landing', storedSrc: 'landing' };
  if (between(i, 19, 22)) return { src: 'qr', storedSrc: 'qr' };
  if (between(i, 23, 24)) return { src: 'direct', storedSrc: null };
  if (between(i, 25, 30)) return { src: 'wa-teachers', storedSrc: 'wa-teachers' };
  if (between(i, 31, 34)) return { src: 'ig', storedSrc: 'ig' };
  if (i === 35) return { src: 'direct', storedSrc: 'bogus' }; // an unknown tag is counted as direct
  if (i === 36) return { src: 'wa-students', storedSrc: 'wa-students' };
  return { src: 'wa-family', storedSrc: 'wa-family', campaign: 'dec-soft' };
}

function buildSpec(i: number): Spec {
  const signupAgo = i <= 10 ? 45 : i <= 24 ? 20 : i <= 36 ? 5 : 1;
  const activated = between(i, 1, 8) || between(i, 11, 22) || between(i, 25, 30);
  // Learner 9 did three missions on one day only: not activated
  const base: Array<[number, number]> = activated ? [[0, 2], [1, 1]] : [[0, i === 9 ? 3 : 1]];
  const extra = DAY30_EXTRA[i];
  const wallOffset = between(i, 1, 4) ? 3 : between(i, 11, 13) ? 5 : i === 5 ? 20 : between(i, 25, 30) ? 2 : inSet(i, 9, 10, 23, 24) || between(i, 31, 36) ? 1 : null;
  return {
    uid: uidOf(i),
    signupAgo,
    activity: extra ? [...base, [extra[0], extra[1]]] : base,
    activated,
    wallOffset,
    asked: wallOffset !== null && !between(i, 33, 36),
    parent: inSet(i, 1, 2, 3, 4, 6, 11, 12, 25, 26),
    checkout: inSet(i, 1, 2, 6, 11, 12),
    paid: inSet(i, 1, 6, 7),
    cancelled: i === 6,
    day30Eligible: signupAgo >= 34,
    activeDay30: Boolean(extra?.[2]),
    ...sourceOf(i),
    gradeId: GRADES[i % GRADES.length],
  };
}

const SPECS: Spec[] = Array.from({ length: 40 }, (_, index) => buildSpec(index + 1));

function buildDocs(today: string, nowMs: number): SeedDoc[] {
  const day = (ago: number): string => addDaysToDateStr(today, -ago);
  const docs: SeedDoc[] = [];
  for (const spec of SPECS) {
    const signupDay = day(spec.signupAgo);
    docs.push({
      collection: 'learners',
      id: spec.uid,
      fields: {
        seed: SEED,
        gradeId: spec.gradeId,
        isOnboarded: true,
        activityLog: spec.activity.map(([offset, sessions]) => ({ dateStr: addDaysToDateStr(signupDay, offset), sessions, activeSeconds: 300 })),
      },
    });
    if (spec.storedSrc) {
      docs.push({
        collection: 'signups',
        id: spec.uid,
        fields: { uid: spec.uid, day: signupDay, src: spec.storedSrc, ...(spec.campaign ? { campaign: spec.campaign } : {}) },
      });
    }
    if (spec.wallOffset !== null) {
      const wallDay = addDaysToDateStr(signupDay, spec.wallOffset);
      docs.push({
        collection: 'analyticsDaily',
        id: `${wallDay}_${spec.uid}`,
        fields: { uid: spec.uid, day: wallDay, gradeId: spec.gradeId, counts: { pro_wall_view: 2, ...(spec.asked ? { pro_ask_sent: 1 } : {}) } },
      });
    }
    if (spec.parent) {
      const parentUid = `${SEED}-parent-${spec.uid.slice(-2)}`;
      docs.push({ collection: 'parentLinks', id: `${parentUid}_${spec.uid}`, fields: { parentUid, childUid: spec.uid, linkedAt: nowMs } });
    }
  }
  const checkout = (n: number, parent: number, kids: number[], status: string): SeedDoc => ({
    collection: 'checkouts',
    id: `${SEED}-co-${n}`,
    fields: { parentUid: `${SEED}-parent-${String(parent).padStart(2, '0')}`, childUids: kids.map(uidOf), status, createdAt: nowMs },
  });
  docs.push(checkout(1, 1, [1], 'paid'), checkout(2, 6, [6], 'paid'), checkout(3, 2, [2, 11], 'pending'), checkout(4, 12, [12], 'failed'));
  const entitlement = (i: number, status: string, source: string): SeedDoc => ({
    collection: 'entitlements',
    id: uidOf(i),
    fields: { status, source, periodEnd: nowMs + 20 * DAY_MS },
  });
  // Learner 7 paid with no checkout on file; learner 8 has a gift (comp) plan, which is not "paid"
  docs.push(entitlement(1, 'active', 'subscription'), entitlement(6, 'canceled', 'subscription'), entitlement(7, 'active', 'subscription'), entitlement(8, 'active', 'comp'));
  const plan = (n: number, status: string, createdAgo: number, periodEndAgo: number): SeedDoc => ({
    collection: 'subscriptions',
    id: `${SEED}-sub-${String(n).padStart(2, '0')}`,
    fields: { payerParentUid: `${SEED}-payer-${n}`, childUids: [`${SEED}-kid-${n}`], status, createdAt: nowMs - createdAgo * DAY_MS, periodEnd: nowMs - periodEndAgo * DAY_MS },
  });
  for (let n = 1; n <= 18; n += 1) docs.push(plan(n, 'active', 70, -20));
  docs.push(plan(19, 'past_due', 70, 2));
  for (let n = 20; n <= 22; n += 1) docs.push(plan(n, 'canceled', 70, 10)); // cancelled lately: counted
  for (let n = 23; n <= 24; n += 1) docs.push(plan(n, 'canceled', 120, 60)); // cancelled long ago: not in the base
  for (let n = 25; n <= 27; n += 1) docs.push(plan(n, 'active', 10, -20)); // too new to judge
  docs.push({
    collection: 'funnelDaily',
    id: day(12),
    fields: { seed: SEED, gate_view: 50, gate_view__wa_family: 30, gate_view__landing: 20, signup_done: 12, signup_done__wa_family: 8, signup_done__landing: 4, parent_link_open: 9, parent_pro_link_open: 5 },
  });
  return docs;
}

// ---------- what the seed should add ----------

function tally(specs: readonly Spec[]): StepCounts {
  const n = (test: (spec: Spec) => boolean): number => specs.filter(test).length;
  return {
    signedUp: specs.length,
    activated: n((s) => s.activated),
    reachedWall: n((s) => s.wallOffset !== null),
    askSent: n((s) => s.asked),
    parentLinked: n((s) => s.parent),
    checkoutStarted: n((s) => s.checkout),
    paid: n((s) => s.paid),
    day30Eligible: n((s) => s.day30Eligible),
    activeDay30: n((s) => s.activeDay30),
    cancelled: n((s) => s.cancelled),
  };
}

function sundayOf(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00Z`);
  return new Date(date.getTime() - date.getUTCDay() * DAY_MS).toISOString().slice(0, 10);
}

const EXPECTED_GATES: Record<string, [number, number]> = (() => {
  const mature = SPECS.filter((s) => s.activated && s.signupAgo >= 14);
  return {
    activation: [SPECS.filter((s) => s.activated).length, SPECS.length],
    wall: [mature.filter((s) => s.wallOffset !== null && s.wallOffset <= 14).length, mature.length],
    ask: [SPECS.filter((s) => s.asked).length, SPECS.filter((s) => s.wallOffset !== null).length],
    askToPaid: [SPECS.filter((s) => s.asked && s.paid).length, SPECS.filter((s) => s.asked).length],
    activatedToPaid: [SPECS.filter((s) => s.activated && s.paid).length, SPECS.filter((s) => s.activated).length],
    monthlyCancel: [3, 22],
  };
})();

// ---------- staging access ----------

async function cliAccessToken(): Promise<string> {
  const root = process.env.NPM_GLOBAL_ROOT;
  if (!root) throw new Error('Set NPM_GLOBAL_ROOT to the output of `npm root -g`');
  const auth = createRequire(path.join(root, 'index.js'))('firebase-tools/lib/auth');
  const account = auth.getGlobalDefaultAccount();
  if (!account?.tokens?.refresh_token) throw new Error('Run `firebase login` first');
  const tokens = await auth.getAccessToken(account.tokens.refresh_token, ['https://www.googleapis.com/auth/cloud-platform']);
  return tokens.access_token as string;
}

function toValue(value: unknown): Json {
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(toValue) } };
  if (value && typeof value === 'object') return { mapValue: { fields: toFields(value as Json) } };
  return { nullValue: 'NULL_VALUE' };
}
const toFields = (fields: Json): Json => Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, toValue(value)]));

async function commit(token: string, writes: Json[]): Promise<void> {
  const response = await fetch(`${REST}:commit`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ writes }),
  });
  if (!response.ok) throw new Error(`Firestore commit failed (${response.status}): ${await response.text()}`);
}

async function listDocs(token: string, collection: string, mask: string): Promise<Array<{ name: string; fields?: Json }>> {
  const response = await fetch(`${REST}/${collection}?pageSize=300&mask.fieldPaths=${mask}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`Firestore list failed (${response.status})`);
  return ((await response.json()) as { documents?: Array<{ name: string; fields?: Json }> }).documents ?? [];
}

/** The real handler, reading staging with the CLI's login in place of the server's service account. */
async function loadConversion(token: string): Promise<ConversionStats> {
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  const throwawayKey = privateKey.export({ type: 'pkcs8', format: 'pem' }) as string;
  const ownerUid = `${SEED}-owner`;
  const claims = Buffer.from(JSON.stringify({ sub: ownerUid, firebase: { sign_in_provider: 'google.com' } })).toString('base64url');
  const fetchImpl: typeof fetch = async (input, init) => {
    const url = String(input);
    if (url.startsWith('https://oauth2.googleapis.com/')) return new Response(JSON.stringify({ access_token: token, expires_in: 3600 }), { status: 200 });
    const headers = new Headers(init?.headers);
    if (url.includes('identitytoolkit')) headers.set('x-goog-user-project', PROJECT_ID);
    return fetch(input, { ...init, headers });
  };
  const response = await handleOwnerStatsRequest(
    new Request('https://staging.invalid/api/owner-stats', { headers: { 'X-Firebase-Token': `x.${claims}.x` } }),
    {
      OWNER_UID: ownerUid,
      FIREBASE_PROJECT_ID: PROJECT_ID,
      FIREBASE_SERVICE_ACCOUNT_JSON: JSON.stringify({ client_email: 'seed@staging.invalid', private_key: throwawayKey }),
    },
    { fetchImpl, verifyToken: async () => true }
  );
  if (response.status !== 200) throw new Error(`owner-stats answered ${response.status}: ${await response.text()}`);
  return ((await response.json()) as { conversion: ConversionStats }).conversion;
}

// ---------- compare ----------

let failures = 0;
function check(label: string, actual: unknown, expected: unknown): void {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}: ${JSON.stringify(actual)}${ok ? '' : `  (expected ${JSON.stringify(expected)})`}`);
}

const STEP_KEYS = Object.keys(tally([])) as Array<keyof StepCounts>;
const minus = (after: StepCounts | undefined, before: StepCounts | undefined): StepCounts =>
  Object.fromEntries(STEP_KEYS.map((key) => [key, (after?.[key] ?? 0) - (before?.[key] ?? 0)])) as unknown as StepCounts;
const pick = (counts: StepCounts): StepCounts => Object.fromEntries(STEP_KEYS.map((key) => [key, counts[key]])) as unknown as StepCounts;

function compare(before: ConversionStats, after: ConversionStats, today: string): void {
  const segment = (stats: ConversionStats, src: string) => stats.segments.find((s) => s.src === src);
  check('all learners, change in every step', minus(segment(after, 'all')?.totals, segment(before, 'all')?.totals), tally(SPECS));
  for (const src of [...new Set(SPECS.map((s) => s.src))]) {
    check(`source ${src}`, minus(segment(after, src)?.totals, segment(before, src)?.totals), tally(SPECS.filter((s) => s.src === src)));
  }
  for (const week of [...new Set(SPECS.map((s) => sundayOf(addDaysToDateStr(today, -s.signupAgo))))].sort()) {
    const row = (stats: ConversionStats) => segment(stats, 'all')?.cohorts.find((c) => c.weekStart === week);
    const expected = tally(SPECS.filter((s) => sundayOf(addDaysToDateStr(today, -s.signupAgo)) === week));
    const afterRow = row(after);
    check(`sign-up week ${week}`, afterRow ? minus(pick(afterRow), row(before)) : 'week missing', expected);
  }
  for (const [id, [numerator, sample]] of Object.entries(EXPECTED_GATES)) {
    const gate = (stats: ConversionStats) => stats.gates.find((g) => g.id === id);
    check(`gate ${id} (count / out of)`, [(gate(after)?.numerator ?? 0) - (gate(before)?.numerator ?? 0), (gate(after)?.sample ?? 0) - (gate(before)?.sample ?? 0)], [numerator, sample]);
  }
  const visits = (stats: ConversionStats, src: string) => stats.visitsBySource.find((v) => v.src === src);
  for (const [src, gate, signup] of [['wa-family', 30, 8], ['landing', 20, 4]] as const) {
    check(`visits ${src} (gate views, sign-ups)`, [(visits(after, src)?.gate_view ?? 0) - (visits(before, src)?.gate_view ?? 0), (visits(after, src)?.signup_done ?? 0) - (visits(before, src)?.signup_done ?? 0)], [gate, signup]);
  }
  check('parent links opened (all, from a Pro ask)', [after.parentLinkOpens.all - before.parentLinkOpens.all, after.parentLinkOpens.pro - before.parentLinkOpens.pro], [9, 5]);
  if (before.wallByGrade.length === 0) {
    const expected = GRADES.map((gradeId) => {
      const days = SPECS.filter((s) => s.gradeId === gradeId && s.wallOffset !== null).map((s) => s.wallOffset as number).sort((a, b) => a - b);
      const mid = Math.floor(days.length / 2);
      return { gradeId, learners: days.length, medianDays: days.length % 2 ? days[mid] : (days[mid - 1] + days[mid]) / 2 };
    }).filter((row) => row.learners > 0);
    check('days to the first wall, per grade', after.wallByGrade, expected);
  } else {
    console.log('SKIP  days to the first wall: staging already had wall data, so the medians are mixed');
  }
  console.log('\nGate tiles as the dashboard will show them:');
  for (const gate of after.gates) {
    console.log(`  ${gate.label}: ${gate.value === null ? 'n/a' : `${Math.round(gate.value * 1000) / 10}%`} (${gate.numerator}/${gate.sample}) -> ${gate.status}`);
  }
}

// ---------- commands ----------

async function run(): Promise<void> {
  const token = await cliAccessToken();
  const nowMs = Date.now();
  const today = israelDateStr(new Date(nowMs));
  const docs = buildDocs(today, nowMs);
  const funnelDay = docs.find((doc) => doc.collection === 'funnelDaily');
  const existing = await listDocs(token, 'funnelDaily', 'seed');
  const clash = existing.find((doc) => doc.name.endsWith(`/${funnelDay?.id}`));
  if (clash && !clash.fields?.seed) throw new Error(`funnelDaily/${funnelDay?.id} holds real counts; not overwriting it`);
  const alreadySeeded = (await listDocs(token, 'learners', 'seed')).some((doc) => doc.name.includes(`/${SEED}-`));
  if (alreadySeeded) throw new Error('Seed data is already there; run `clean` first');

  const before = await loadConversion(token);
  await commit(token, docs.map((doc) => ({ update: { name: `${DOCS}/${doc.collection}/${doc.id}`, fields: toFields(doc.fields) } })));
  console.log(`Wrote ${docs.length} documents to ${PROJECT_ID} (today is ${today}).\n`);
  const after = await loadConversion(token);
  compare(before, after, today);
  console.log(failures ? `\n${failures} check(s) FAILED` : '\nAll checks passed');
  if (failures) process.exitCode = 1;
}

async function clean(): Promise<void> {
  const token = await cliAccessToken();
  const names: string[] = [];
  for (const collection of SEEDED_COLLECTIONS) {
    names.push(...(await listDocs(token, collection, '__name__')).map((doc) => doc.name).filter((name) => name.includes(SEED)));
  }
  names.push(...(await listDocs(token, 'funnelDaily', 'seed')).filter((doc) => doc.fields?.seed).map((doc) => doc.name));
  if (names.length) await commit(token, names.map((name) => ({ delete: name })));
  console.log(`Deleted ${names.length} seed documents from ${PROJECT_ID}.`);
}

const command = process.argv[2];
(command === 'run' ? run() : command === 'clean' ? clean() : Promise.reject(new Error('Use: run | clean'))).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
