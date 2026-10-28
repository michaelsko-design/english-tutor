// Gives a learner free EnglishVibe Pro (a "comp" grant: family, testers), or takes it away.
// docs/feature-pro-tier.md, "Entitlement model". Writes entitlements/{uid}, which only the server may write.
// Usage (PowerShell):
//   npm i --no-save firebase-admin
//   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\service-account.json"   # keep the key OUTSIDE the repo
//   node scripts/grantPro.mjs <username or uid>            # Pro with no end
//   node scripts/grantPro.mjs <username or uid> --revoke   # back to free
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const PROJECT_ID = 'english-tutor-il-7';
const USERNAME_EMAIL_DOMAIN = 'peachnote.tutor.local';
/** Open-ended: 1 Jan 2100 */
const COMP_PERIOD_END_MS = Date.UTC(2100, 0, 1);

const target = process.argv[2];
const isRevoke = process.argv.includes('--revoke');

if (!target) {
  console.error('Usage: node scripts/grantPro.mjs <username or uid> [--revoke]');
  process.exit(1);
}
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS to the service-account key path.');
  process.exit(1);
}

initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });

/** A kid username signs in as <username>@peachnote.tutor.local; anything else is taken as a uid. */
async function findUser(usernameOrUid) {
  try {
    return await getAuth().getUserByEmail(`${usernameOrUid.toLowerCase()}@${USERNAME_EMAIL_DOMAIN}`);
  } catch {
    return getAuth().getUser(usernameOrUid);
  }
}

try {
  const user = await findUser(target);
  const ref = getFirestore().collection('entitlements').doc(user.uid);
  const existing = await ref.get();
  if (existing.exists && existing.get('source') === 'subscription') {
    console.error('This learner has a paid subscription; cancel it from the parent portal instead.');
    process.exit(1);
  }
  console.log(`Account: ${user.email ?? user.uid}`);
  if (isRevoke) {
    await ref.delete();
    console.log('Pro removed. The learner keeps every mission they already have stars in.');
  } else {
    await ref.set({
      plan: 'pro',
      status: 'active',
      source: 'comp',
      billingPeriod: null,
      periodEnd: COMP_PERIOD_END_MS,
      payerParentUid: null,
      updatedAt: Date.now(),
    });
    console.log('Pro granted (comp, no end date).');
  }
} catch (err) {
  console.error('Failed:', err.message);
  process.exit(1);
}
