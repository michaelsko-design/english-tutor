# Code and Security Audit — 2026-10-29

Scope: the whole repository. That covers the 12 Vercel functions (`api/`), `firestore.rules`, the client (`src/`), `vercel.json` (CSP, headers, rewrites), `public/sw.js`, dependencies, secrets and test coverage. Method: automated checks, then three parallel read-only reviews (server/API, Firestore rules and data access, client and code quality). Every finding below was checked against the code before it went in; unconfirmed ones were dropped. No live testing against production or the live Firebase project.

## Summary

| Severity | Count | Status |
|---|---|---|
| CRITICAL | 0 | — |
| HIGH | 2 | Fixed in this change, with regression tests |
| MEDIUM | 6 | Backlog (Technical) |
| LOW | 12 | Backlog (one grouped item) or accepted |

Baseline before changes: lint 0 errors (3 `exhaustive-deps` warnings in `MissionMap.tsx` and `useAnimationClock.ts`), typecheck clean, 1458/1458 tests. After: 1488 tests, all passing.

## HIGH (fixed)

**H1. The streak-reminder cron posts to any URL a user stores, with no timeout.**
- Where: `firestore.rules` (`isPushSubscription`), `api/streak-reminder.ts`.
- Defect: the rule accepted any `https://` endpoint. The daily cron posts to every subscriber one after another inside its 60 s limit, with no request timeout.
- Failure scenario: one signed-in account stores `https://slow.example/` as its endpoint. That server never answers, the run stalls, and every learner after it gets no reminder. The cron also becomes a relay for outbound POSTs to any host.
- Fix:
  - The endpoint must be on a browser push service (`fcm.googleapis.com`, `updates.push.services.mozilla.com`, `web.push.apple.com`, `*.notify.windows.com`). The rule and `isPushServiceEndpoint` (`api/_lib/streakReminder.ts`) both check this, so documents stored before the change are skipped too.
  - Each send has a 5 s timeout.
- Tests:
  - `api/_lib/streakReminder.test.ts`: real endpoints accepted; lookalike hosts, user-info, ports and `http` refused.
  - `api/streak-reminder.test.ts`: no send to a non-push host.
  - `rulesSmoke.mjs`: two new deny cases. All 64 checks pass on the emulators.

**H2. Deleting an account left its push subscription.**
- Where: `src/services/accountService.ts` (`deleteLearnerData`).
- Defect: every learner document was deleted except `pushSubscriptions/{uid}`.
- Failure scenario: after a child deletes the account, the device keeps getting the daily "keep your streak" push. The endpoint, gender and streak data stay in Firestore, against the app's own deletion promise for children's data.
- Fix: delete it with the rest. Guests are skipped, since the rules give them no subscription and would deny the delete.
- Tests: new `src/services/accountService.test.ts`, the first tests for this file.
  - Every owned document is deleted, and the sign-in is deleted last.
  - Shared friendships, contests and the username are deleted.
  - A friend code now owned by someone else is kept.
  - A wrong PIN deletes nothing.
  - A guest account is handled.

## MEDIUM (backlog)

**M1. Friend requests can go to any uid.**
- Where: `firestore.rules`, `isNewFriendRequest`.
- Defect: `uids[1]` is never checked to belong to a learner with the Friends Hub on. A stranger who learns a child's uid can send a request even after the child turned the hub off. The child then sees the sender's display name, which is free text (24 characters).
- Mitigations already in place: username search is opt-in, friend codes are about 1e9, and there is a 10-a-day cap.
- Fix: require `exists(publicProfiles/{uids[1]})` (the hub is on), and require `addresseeName` to equal that profile's name. Consider limiting display names to letters, digits and spaces.

**M2. The Firebase auth-handler proxy has no CSP.**
- Where: `vercel.json`, `/__/auth/(.*)`.
- Defect: third-party pages (`firebaseapp.com`) are served on our origin, so a script there could read our `localStorage` and the Firebase IndexedDB.
- Fix: add a minimal CSP to that path (`frame-ancestors 'self'`, the handler's script sources), test Google sign-in on phone and desktop, and add an explicit `Strict-Transport-Security` header.

**M3. Lookup documents can be guessed.**
- Where: `usernames/*`, `friendCodes/*`.
- Defect: any real account can `get` them without limit, and each returns a uid, display name and avatar. Usernames are guessable, but finding by username is opt-in. Friend codes are 6 characters.
- Fix:
  - Confirm App Check enforcement on Firestore in the console (the backlog says it is enforced).
  - Move to 8-character friend codes.

**M4. `/api/tts` abuse depends on App Check.**
- Where: `api/tts.ts`.
- Defect: anonymous guests count as signed in, and there is no per-user rate limit. Without `APPCHECK_ENFORCE=on`, a script can use up the Azure quota with guest accounts. The online voice goes down; the app falls back to the device voice.
- Fix:
  - Confirm `APPCHECK_ENFORCE=on` is set in Vercel Production. The backlog says it is.
  - Add a per-uid cap on cache misses or a Vercel WAF rate rule.

**M5. The saved profile is spread into state without validation.**
- Where: `src/App.tsx:57`.
- Failure scenario: valid JSON with the wrong shape (an old or corrupt `english_tutor_learner_profile_v2`) can crash screens. The user is stuck on the error boundary until storage is cleared.
- Fix: a shape check that falls back to `DEFAULT_PROFILE`.

**M6. Dependency advisories.**
- Fixed here: `npm audit fix` (non-breaking) brought re2js to 2.9.1, vite to 6.4.5 and postcss-selector-parser to 6.1.5.
- Left open: 4 high advisories, all `@grpc/grpc-js` through `firebase` → `@firebase/firestore`. They can't be reached here, because the browser SDK uses WebChannel and the server code doesn't use the `firebase` package. npm's suggested "fix" is a downgrade to firebase 9.14.
- Fix: re-check when `firebase` releases its next version.

## LOW

These are tracked as one backlog item.

- `api/payment-webhook.ts:147`: a duplicate payment on an already-paid checkout is dropped with no log, so a double charge goes unnoticed.
- `api/payment-webhook.ts:267`: a renewal with a lower amount still extends the plan; it is only logged. It needs the Grow key, so outsiders can't trigger it.
- `api/_lib/payments/grow.ts:56`: if `GROW_ENV` is unset, Grow uses the sandbox even in Production. Require it explicitly when `VERCEL_ENV=production`.
- `api/_lib/firebaseToken.ts`: no refetch of keys on an unknown `kid` (brief 401s after a Google key rotation), and no revocation check on sensitive parent calls.
- `api/streak-reminder.ts`: the VAPID subject falls back to `mailto:admin@example.com`. Require `VAPID_SUBJECT`.
- `api/payment-webhook.ts:162`: the parent link isn't re-checked at payment time.
- `api/checkout.ts`, `api/payment-webhook.ts`: the webhook secret travels in `?key=` and lands in request logs. It is compared in constant time, so this is hygiene only.
- `firestore.rules`: contest results are self-reported (a fake perfect score is possible). Contests carry no rewards beyond bragging.
- `firestore.rules`: guests can write `learners/{uid}` and stickers with no field allowlist (storage abuse through guest accounts). App Check limits this.
- `src/services/parentService.ts:95,107,207`: invite-code cleanup errors are swallowed. The code still expires after 3 days.
- `src/services/cloudSync.ts:249`: `updatedAt` after a merge takes the cloud time, not the later of the two.
- `VocabularyVaultModal.tsx`, `useSpeechRecognition.ts`: `any` for the Web Speech API. Add minimal types.

## Checked and found clean

- **Secrets:** no real secrets in the tree or in git history. The `AIza…` key in `src/services/firebase.ts` is the public web key, restricted to our domains. The private-key strings are test fixtures generated at runtime. `.env*` and test credentials are gitignored, and no secret is exposed through a `VITE_` variable.
- **Gitignore:** local `firebase-export-*` and `emulator-export-*` folders, which can hold user data, were not ignored. They are now, along with `coverage/` and `.art-gemini-icon-batches.json`.
- **Server auth:** ID tokens are verified with RS256 only, plus `kid`, `aud`, `iss`, `exp` and `iat` checks. Parent endpoints need a Google sign-in and a pairing check under the caller's own rules. The cron secret and webhook keys are compared in constant time and fail closed. `owner-stats` is gated by `OWNER_UID`.
- **Payments:**
  - The webhook body is never trusted: payment is confirmed with Grow.
  - The amount must match the server's price.
  - Idempotency and seat races are guarded with `exists:false` and `updateTime` preconditions.
  - The mock gateway and `devPaymentsApi` can't run outside a local demo project; the mock gate is tested in `api/_lib/payments/index.test.ts`.
- **Injection:** SSML is escaped, and the Azure region is validated. No `dangerouslySetInnerHTML`, `innerHTML`, `eval` or open redirect anywhere. URL params (`?parent=`, `?invite`) are checked against fixed alphabets.
- **Firestore rules:**
  - `entitlements`, `subscriptions`, `checkouts`, `payments` and `recurringRefs` are server-write-only.
  - No collection can be listed by another user.
  - Parent invites are single-use in one batch, and public profiles and report snapshots have exact-key allowlists.
  - Default deny.
- **Client:**
  - The CSP has no `unsafe-eval` and no `unsafe-inline` in `script-src`, and sets `frame-ancestors 'none'`.
  - The service worker caches only same-origin 200 responses and clip MP3s, and never `/api/`.
  - No PINs or tokens are stored or logged, and there are no `postMessage` listeners.
  - `mergeLearnerProfiles` merges every `LearnerProfile` field.
  - No non-data file is over 800 lines.

## Test coverage

`npm run test:coverage` (v8; curriculum data, fixtures and type-only files excluded). The thresholds in `vitest.config.ts` are floors just under these numbers, so coverage can't drop silently.

| Area | Lines | Notes |
|---|---|---|
| Overall | 60.8% (was 60.2%) | |
| `api/` | 92% | floor 90 |
| `src/data` | 98% | floor 95 |
| `src/utils` | 87% | floor 85 |
| `src/services` | 63% (was 58%) | `friendsService` 0%, `parentService` 54% |
| `src/hooks` | 34% (was 32%) | |
| `src/components` | 37% | 23 component tests for about 150 components |
| `src/App.tsx` | 0% | |

Tests added in this change:
- `useProAccess.test.tsx`: gating off reads nothing; no Pro while loading; expiry and grace; one learner never sees the previous account's entitlement.
- `entitlementService.test.ts`: the live watch, caching, the parent portal's no-cache mode, and a corrupt cache.
- `accountService.test.ts`.
- The push-endpoint tests listed under H1.

Next tests, in priority order (tracked in the backlog):
1. `friendsService` (0%): request, accept and remove. Also, after M1, a request to a learner with the hub off is refused (unit test plus a smoke deny case).
2. The rules smoke test gaps: denials for usernames and friendCodes by non-owners, friendship self-accept and third-party read, contest forgery and expiry, non-friend `publicProfiles` reads, `parentInvites` misuse, anonymous access everywhere except `learners`, and an unknown path denied.
3. `parentService` (54%): pairing, unlinking, and data deletion.
4. The hooks behind sync and reporting: `useActiveTimeTracker`, `useReminderSync`, `useReportSnapshotPublisher`, `usePendingInvite`, `useFriendsHub`, `useFriendPresence` (fake timers, mocked services).
5. Components on critical flows (RTL, behaviour and RTL text): sign-in and PIN entry, parent pairing and PIN reset, checkout and the Pro screens, settings and account deletion, and the mission step flow.
6. End-to-end tests: friends (invite, accept, contest) and a guest upgrading to a saved account while keeping the profile.
7. Raise the floors as these land. The target is 80% lines on `api/`, `src/services`, `src/utils` and `src/hooks`.
