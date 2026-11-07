# Closed early-tester phase: runbook

The app is on the production site, but while `config/access.open` is **false** only accounts with an
`allowed/{uid}` document can use it (`isAllowed()` in `firestore.rules`). A stranger can create an Auth
account but can read and write nothing; the app shows the invite-code screen (`AccessGateScreen`).
Guest (anonymous) sign-in is therefore unusable until access is opened.

All commands (PowerShell), once per shell:

```powershell
npm i --no-save firebase-admin
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\service-account.json"   # keep the key OUTSIDE the repo
$env:APP_ORIGIN = "https://<production-domain>"
```

## Go-live order (do not swap steps 1-3)
1. `node scripts/allowExisting.mjs` lists every account. Then `node scripts/allowExisting.mjs --apply <username> <username> --cohort family` for your daughters (and any other account that must keep working). Unnamed accounts will be locked out.
2. `node scripts/setAccess.mjs --closed` (writes `config/access { open: false }`).
3. Deploy the rules (`firebase deploy --only firestore:rules`), then push the app and `api/redeem-invite`.
4. Check: a fresh private-window sign-up sees only the invite screen; your daughters still sign in.

## Inviting a child
`node scripts/createInvite.mjs noa dana --cohort tester-nov26 --days 14` prints one single-use link per label
(`<APP_ORIGIN>/?access=CODE`). Send it to the parent only. The child signs up with a username and PIN, the code
redeems itself, and the account is allowed with a comp Pro entitlement. A used or expired link is useless.
Labels are aliases (they show in the owner tooling), never full names.

## Revoking
Delete `allowed/{uid}` in the Firebase console: the child is locked out at once.

## Public launch
`node scripts/setAccess.mjs --open` (instant, no deploy), then remove the `noindex` meta in `index.html` and the
`Disallow` in `public/robots.txt`, enforce App Check, rate-limit `/api/tts`, and review the privacy text.
`node scripts/setAccess.mjs --closed` closes it again.

## Known limits
- `/api/tts` only checks for a signed-in account, not an allowed one, so a stranger with a throwaway account could use the online voice fallback until it is rate-limited or App Check is enforced.
- Parent accounts (Google sign-in) are outside the gate; they can only link to a child that has data.
