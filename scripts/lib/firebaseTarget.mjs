// Which Firebase project the admin scripts (setAccess, createInvite, grantPro, ...) act on.
// Production by default; set FIREBASE_TARGET=staging to run them against the staging project:
//   $env:FIREBASE_TARGET = "staging"   # PowerShell; use the staging service-account key too
const PROJECT_IDS = Object.freeze({
  production: 'english-tutor-il-7',
  staging: 'english-tutor-staging',
});

/** @returns {string} the Firebase project id named by FIREBASE_TARGET (default production) */
export function resolveProjectId() {
  const target = (process.env.FIREBASE_TARGET ?? 'production').trim().toLowerCase();
  const projectId = PROJECT_IDS[target];
  if (!projectId) {
    console.error(`Unknown FIREBASE_TARGET "${target}". Use "production" or "staging".`);
    process.exit(1);
  }
  console.log(`Firebase project: ${projectId}${target === 'production' ? ' (PRODUCTION)' : ''}`);
  return projectId;
}
