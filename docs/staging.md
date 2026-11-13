# Staging: test every change before production

Production is the `main` branch on Vercel plus the Firebase project `english-tutor-il-7`.
Staging is the `staging` branch on Vercel (a Preview deployment) plus its own Firebase project
`english-tutor-staging` (alias `staging` in `.firebaserc`). Staging has its own accounts and data, so
nothing tried there touches real learners. Staging builds show an amber **STAGING** label
(`src/components/StagingBadge.tsx`, from `VITE_FIREBASE_PROJECT_ID`).

## Everyday flow

1. Work on a branch; when it's ready to try, bring it onto `staging` and push:
   ```bash
   git checkout staging && git merge <your-branch> && git push origin staging
   ```
2. Vercel builds the staging site (Preview). Test it there: sign in with a staging account, play the change on a phone.
3. Firestore rules changed? Deploy them to staging first: `npx firebase deploy --only firestore --project staging`, test, and deploy to production (`--project default`) only together with the release.
4. Happy with it: release to production:
   ```bash
   git checkout main && git merge staging && git push origin main
   ```
5. Production broke anyway: Vercel dashboard → Deployments → previous production deployment → **Instant Rollback**.

Admin scripts (`setAccess`, `createInvite`, `grantPro`, `resetLearnerPin`, `allowExisting`) act on
production unless `FIREBASE_TARGET=staging` is set (with the staging service-account key in
`GOOGLE_APPLICATION_CREDENTIALS`); each prints the project it is about to use.

What staging does not run: the Vercel crons (production only), real payments (Grow sandbox only).
Read-aloud clips come from the same R2 bucket as production (read only).

## One-time setup

Done (2026-11-13, through the Firebase MCP):
- [x] Firebase project `english-tutor-staging` (Spark plan), web app `EnglishVibe Staging Web`
- [x] Firestore `(default)` in `eur3`, rules + indexes deployed from this repo
- [x] `.firebaserc` alias `staging`

Left (Firebase console, project `english-tutor-staging`):
- [x] Authentication → Sign-in method: Email/Password, Anonymous and Google enabled (2026-11-13)
- [x] Authentication → Settings → Authorized domains: staging branch URL added (2026-11-13)
- [x] Service-account key generated (kept outside the repo; also the `GOOGLE_APPLICATION_CREDENTIALS` key for admin scripts on staging)
- [x] `config/access` = open on staging (2026-11-13), so any staging account can use the app. To test the tester gate itself: `FIREBASE_TARGET=staging node scripts/setAccess.mjs --closed`, then `... allowExisting.mjs --apply <you>`

Left (Vercel project `english-tutor`, Settings → Environment Variables, **Preview** only, branch `staging`):
- [x] The six `VITE_FIREBASE_*` (staging web app config), `FIREBASE_PROJECT_ID`, `FIREBASE_PROJECT_NUMBER` (added 2026-11-13 with `vercel env add <NAME> preview staging`; `VITE_FIREBASE_API_KEY` as `--type config`, it is public by design)
- [x] `FIREBASE_SERVICE_ACCOUNT_JSON` = the staging key, Preview branch `staging` (2026-11-13; checked: the staging funnel counter wrote to `english-tutor-staging`)
- [x] The live `FIREBASE_SERVICE_ACCOUNT_JSON` narrowed to Production only, so other preview branches can't reach live data
- [ ] `OWNER_UID` (Preview, branch `staging`): your uid in the staging project, only needed for the owner dashboard (`/?owner`) on staging. Sign in on staging with Google first, then the uid is in Firebase → Authentication
- [ ] Payments: off on staging for now (no `PAYMENT_PROVIDER` on Preview). When Grow/Make is ready to try: `PAYMENT_PROVIDER=grow`, `GROW_ENV=sandbox` + sandbox ids, its own `PAYMENT_WEBHOOK_SECRET`, `APP_ORIGIN` = the staging URL
- [x] `APPCHECK_ENFORCE` and `VITE_APPCHECK_SITE_KEY` are Production only, so App Check is off on staging
- [x] Production variables unchanged (only the live service-account key was narrowed from Production+Preview to Production)
- [x] `staging` branch created on GitHub from `main` (2026-11-13); branch URL `english-tutor-git-staging-clear-shield.vercel.app`
- [x] Badge code on `staging` (ae9b3529); the build has it switched on

Optional:
- Custom domain for the `staging` branch (Vercel → Domains → assign to Git branch `staging`).
- Keep Vercel Deployment Protection on Previews, so only you (and people you share a link with) can open staging.
- GitHub branch protection on `main`, so production changes only through a merged pull request.

Google sign-in: `vercel.json` proxies `/__/auth/*` to the production auth domain. Staging uses
`english-tutor-staging.firebaseapp.com` directly as its auth domain, so the proxy is not used there.
If Google sign-in on staging fails in Safari (third-party storage), add a host-conditioned rewrite for the staging host.
