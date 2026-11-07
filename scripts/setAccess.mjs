// Opens or closes the app to everyone: writes config/access { open }. The Firestore rules read it
// (isAccessOpen in firestore.rules), so it takes effect at once with no rules deploy.
//   closed (default for the tester phase): only allowed/{uid} accounts can use the app
//   open: every signed-in account can (public launch)
// Usage (PowerShell):
//   npm i --no-save firebase-admin
//   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\service-account.json"   # keep the key OUTSIDE the repo
//   node scripts/setAccess.mjs --closed
//   node scripts/setAccess.mjs --open
//   node scripts/setAccess.mjs            # shows the current state
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const PROJECT_ID = 'english-tutor-il-7';
const args = process.argv.slice(2);

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS to the service-account key path.');
  process.exit(1);
}
initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
const ref = getFirestore().collection('config').doc('access');

if (args.includes('--open') === args.includes('--closed')) {
  const snapshot = await ref.get();
  console.log(`Access is currently ${snapshot.exists && snapshot.get('open') === true ? 'OPEN to everyone' : 'CLOSED (allowed accounts only)'}.`);
  if (args.length > 0) console.error('Pass exactly one of --open or --closed to change it.');
  process.exit(args.length > 0 ? 1 : 0);
}

const open = args.includes('--open');
await ref.set({ open, updatedAt: Date.now() });
console.log(open ? 'Access is now OPEN: any signed-in account can use the app.' : 'Access is now CLOSED: only allowed accounts can use the app.');
