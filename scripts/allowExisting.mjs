// Grandfathers accounts that already exist (your own family) into the closed early-tester phase,
// BEFORE the allowlist rules are deployed. Without this they would be locked out.
// Dry run by default: lists every Auth account. With --apply it allows only the ones you name.
// Usage (PowerShell):
//   npm i --no-save firebase-admin
//   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\service-account.json"   # keep the key OUTSIDE the repo
//   node scripts/allowExisting.mjs                                  # list accounts, change nothing
//   node scripts/allowExisting.mjs --apply noa12 dana7              # allow these (username or uid)
//   node scripts/allowExisting.mjs --apply noa12 --cohort family
//   node scripts/allowExisting.mjs --all --cohort existing          # allow EVERY account that exists now (guests too)
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const PROJECT_ID = 'english-tutor-il-7';
const USERNAME_EMAIL_DOMAIN = 'peachnote.tutor.local';
const COMP_PERIOD_END_MS = Date.UTC(2100, 0, 1);

const args = process.argv.slice(2);
const applyIndex = args.indexOf('--apply');
const cohortIndex = args.indexOf('--cohort');
const cohort = cohortIndex === -1 ? 'family' : args[cohortIndex + 1];
const isAll = args.includes('--all');
const targets = applyIndex === -1 ? [] : args.slice(applyIndex + 1).filter((arg, i, rest) => !arg.startsWith('--') && rest[i - 1] !== '--cohort');

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS to the service-account key path.');
  process.exit(1);
}
initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
const auth = getAuth();
const db = getFirestore();

async function listAllUsers() {
  const users = [];
  let pageToken;
  do {
    const page = await auth.listUsers(1000, pageToken);
    users.push(...page.users);
    pageToken = page.pageToken;
  } while (pageToken);
  return users;
}

async function findUser(usernameOrUid) {
  try {
    return await auth.getUserByEmail(`${usernameOrUid.toLowerCase()}@${USERNAME_EMAIL_DOMAIN}`);
  } catch {
    return auth.getUser(usernameOrUid);
  }
}

const allowedIds = new Set((await db.collection('allowed').get()).docs.map((doc) => doc.id));

if (applyIndex === -1 && !isAll) {
  const users = (await listAllUsers()).sort((a, b) => (a.metadata.creationTime < b.metadata.creationTime ? -1 : 1));
  console.log(`${users.length} account(s). "allowed" = can use the app once the allowlist rules are live.\n`);
  for (const user of users) {
    const kind = user.providerData.length === 0 ? 'guest' : user.providerData.map((p) => p.providerId).join('+');
    const allowed = allowedIds.has(user.uid) ? 'allowed' : 'NOT allowed';
    console.log([user.uid, user.email ?? '(no email)', kind, `created ${user.metadata.creationTime}`, `last ${user.metadata.lastSignInTime}`, allowed].join('\t'));
  }
  console.log('\nNothing changed. Re-run with --apply <username|uid> ... for the accounts to keep.');
  process.exit(0);
}

if (!isAll && targets.length === 0) {
  console.error('Name at least one username or uid after --apply, or use --all.');
  process.exit(1);
}

/** One entry per account to allow: {user, target}. --all takes every account not yet allowed (never relabels an invited one). */
async function resolveTargets() {
  if (!isAll) return Promise.all(targets.map(async (target) => ({ target, user: await findUser(target).catch((err) => ({ error: err })) })));
  const emailSuffix = `@${USERNAME_EMAIL_DOMAIN}`;
  return (await listAllUsers())
    .filter((user) => !allowedIds.has(user.uid))
    .map((user) => ({
      user,
      target: user.email?.endsWith(emailSuffix) ? user.email.slice(0, -emailSuffix.length) : (user.email ?? user.uid),
    }));
}

let allowedCount = 0;
for (const { target, user: found } of await resolveTargets()) {
  try {
    if (found.error) throw found.error;
    const user = found;
    const entitlementRef = db.collection('entitlements').doc(user.uid);
    const existing = await entitlementRef.get();
    await db.collection('allowed').doc(user.uid).set({ cohort, label: target, invitedAt: Date.now(), grandfathered: true });
    if (!(existing.exists && existing.get('source') === 'subscription')) {
      await entitlementRef.set({
        plan: 'pro',
        status: 'active',
        source: 'comp',
        billingPeriod: null,
        periodEnd: COMP_PERIOD_END_MS,
        payerParentUid: null,
        updatedAt: Date.now(),
      });
    }
    console.log(`allowed: ${user.email ?? user.uid} (cohort ${cohort})`);
    allowedCount += 1;
  } catch (err) {
    console.error(`FAILED ${target}: ${err.message}`);
    process.exitCode = 1;
  }
}
console.log(`
Done: ${allowedCount} account(s) allowed.`);
