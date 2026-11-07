// Creates single-use access codes for the closed early-tester phase and prints each child's link.
// Writes invites/{code}, which only the server may touch. Redeemed by /api/redeem-invite.
// Usage (PowerShell):
//   npm i --no-save firebase-admin
//   $env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\service-account.json"   # keep the key OUTSIDE the repo
//   $env:APP_ORIGIN = "https://your-production-domain"
//   node scripts/createInvite.mjs noa dana --cohort tester-nov26 --days 14
// Labels are aliases (first names or "kid-3"), never full names; they show in the owner dashboard.
import { randomInt } from 'node:crypto';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const PROJECT_ID = 'english-tutor-il-7';
/** Without 0/1/I/L/O so a code read aloud or typed from WhatsApp is unambiguous (matches CODE_PATTERN in api/redeem-invite.ts) */
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 10;
const DAY_MS = 24 * 60 * 60 * 1000;

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const index = args.indexOf(`--${name}`);
  return index === -1 ? fallback : args[index + 1];
};
const flagValues = new Set([flag('cohort', ''), flag('days', '')]);
const labels = args.filter((arg, i) => !arg.startsWith('--') && args[i - 1] !== '--cohort' && args[i - 1] !== '--days' && !flagValues.has(arg));
const cohort = flag('cohort', 'tester');
const days = Number(flag('days', '14'));
const origin = (process.env.APP_ORIGIN ?? '').replace(/\/$/, '');

if (labels.length === 0 || !Number.isFinite(days) || days <= 0) {
  console.error('Usage: node scripts/createInvite.mjs <label> [<label> ...] [--cohort name] [--days 14]');
  process.exit(1);
}
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS to the service-account key path.');
  process.exit(1);
}
if (!origin) {
  console.error('Set APP_ORIGIN to the production URL, e.g. https://example.com');
  process.exit(1);
}

initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID });
const db = getFirestore();

const newCode = () => Array.from({ length: CODE_LENGTH }, () => ALPHABET[randomInt(ALPHABET.length)]).join('');

for (const label of labels) {
  const code = newCode();
  const ref = db.collection('invites').doc(code);
  // create() fails on the (astronomically unlikely) collision instead of overwriting a live code
  await ref.create({ label, cohort, createdAt: Date.now(), expiresAt: Date.now() + days * DAY_MS, usedByUid: null });
  console.log(`${label}\t${origin}/?access=${code}`);
}
console.log(`\nCodes are single use and expire in ${days} days. Send each link to the child's parent only.`);
