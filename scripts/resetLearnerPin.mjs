// Sets a new sign-in PIN for an existing learner account (no recovery email exists for username accounts).
// Usage (PowerShell):
//   npm i --no-save firebase-admin
//   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\service-account.json"   # keep the key OUTSIDE the repo
//   $env:NEW_PIN = "<new PIN>"
//   node scripts/resetLearnerPin.mjs <uid>
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const PROJECT_ID = 'english-tutor-il-7';
const MIN_PIN_LENGTH = 6; // Firebase Auth minimum password length

const uid = process.argv[2];
const pin = process.env.NEW_PIN;

if (!uid || !pin) {
  console.error('Usage: set NEW_PIN, then run: node scripts/resetLearnerPin.mjs <uid>');
  process.exit(1);
}
if (pin.length < MIN_PIN_LENGTH) {
  console.error(`PIN must be at least ${MIN_PIN_LENGTH} characters (Firebase Auth minimum).`);
  process.exit(1);
}
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS to the service-account key path.');
  process.exit(1);
}

initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });

try {
  const before = await getAuth().getUser(uid);
  console.log(`Account: ${before.email}`);
  await getAuth().updateUser(uid, { password: pin });
  console.log('PIN updated. The learner can sign in with the new PIN; her progress is unchanged.');
} catch (err) {
  console.error('Failed:', err.message);
  process.exit(1);
}
