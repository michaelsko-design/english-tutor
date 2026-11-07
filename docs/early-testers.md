# Closed early-tester phase: runbook

Status: **live on production** (access closed). Design notes for developers are in `docs/architecture.md` §4.31;
this file is the operating manual: how to run the test, how to look after the testers' data, and how to open the
app to everyone later.

## How it works in one minute
- `config/access { open }` is the launch switch. While `open` is **false**, only accounts with an `allowed/{uid}`
  document can use the app. This is enforced in `firestore.rules` (`isAllowed()`), not in the client, so a leaked
  link or a hand-made Auth account gets nothing.
- A stranger can still create an Auth account but cannot read or write anything. The app shows the invite screen
  (`AccessGateScreen`). Guest (anonymous) sign-in is unusable until access is opened.
- An invite is a single-use code (10 characters) in the server-only `invites/{code}` collection. The link is
  `<APP_ORIGIN>/?access=CODE`. Redeeming it (`/api/redeem-invite`) writes `allowed/{uid}` and a comp Pro
  `entitlements/{uid}`, and marks the code used. The page then reloads once into the app.
- A parent's Google account is outside the gate. It can only link to a child that has data.
- Everything below is also done from the owner dashboard (`/?owner`, or the installed `/owner/` app).

Commands (PowerShell), once per shell, for the scripts:

```powershell
npm i --no-save firebase-admin
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\service-account.json"   # keep the key OUTSIDE the repo
$env:APP_ORIGIN = "https://<production-domain>"
```

## Daily use (owner dashboard)

### Early testers card
- **Create invites**: one alias per line (first name or `kid-3`, never a full name), a cohort tag (default
  `tester`) and validity in days (default 14, max 90). *Copy link* per child. Send the link to the **parent only**,
  on the child's device.
- **Invites list**: open / used / expired, with the counts (`N open · M archived`). *Withdraw* (the X) cancels an
  unused invite. *Archive N used or expired* hides finished invites from the list; they stay in the database.
- **Allowed accounts**: everyone who can use the app, with the heading count. *Lock out* deletes `allowed/{uid}`
  and a comp entitlement, so the child is cut off on the next open (also when the profile is cached on the device).
  Their learner data is untouched; a new invite brings them back to the same profile.
- *Remove completely* (red, next to *Lock out*) deletes the sign-in and all of the tester's data for good (notes stay,
  without a link to the account; a paid entitlement stays). It only opens a dialog: type the alias to enable
  *Delete forever*. For an account that is already locked out (no longer listed) use *Remove a locked-out account by
  username* under the list. If it fails halfway, press it again: the sign-in is deleted last.
- A used link cannot work for a second account. The invite screen also takes a code typed by hand.

### Usage card
Per-tester table (sessions, minutes, missions, last seen, return), where kids get stuck (struggle line),
and the **tester notes** sent from *Settings > account tab* (idea / problem). Test accounts (`Test accounts`
card) are left out of every number.

### What a child needs to know
The child picks a username and a PIN at sign-up. Nobody can read the PIN back, so the parent should **write down
the username and PIN**, and link a parent Google account (parent area) so the PIN can be reset. The invite
message to parents should say: what the test is, what is collected, how to opt out (*Settings > account tab >
usage statistics*), how to delete the account, and a contact address. (Draft the Hebrew WhatsApp text before the
first invites go out; it is still an open item, see `backlog.md`.)

## Invite message drafts (Hebrew WhatsApp, to the parent)
Placeholders in square brackets. Aliases only, never a full name.

### Teaser (sent first, together with the video ad; no link, no legal text)
```
היי [שם]! 👋
בניתי אפליקציה ללימוד אנגלית לילדים, ורציתי להראות לך אותה קודם (הסרטון למטה 🎬).

EnglishVibe בנויה בעברית לכיתות א׳–י״ב:
• משימות קצרות ומשחקיות, עם כוכבים, מטבעות ופינה אישית שמתעצבת לפי ההתקדמות
• הקראה בקול של המילים והמשפטים
• מותאמת לרמה ולכיתה של הילד/ה, עם רמות קושי שונות בכל משימה
• הילדים רוצים לחזור אליה, וזה העיקר

כרגע היא בבדיקה סגורה, רק לכמה ילדים של חברים קרובים, לפני שפותחים לכולם.
אשמח שתרשו ל[שם הילד/ה] להשתתף. זה חינם, ואין שום התחייבות. אני רק רוצה לראות איך ילד אמיתי משתמש בה ולשמוע מה עובד ומה לא.

אם מתאים לך, תכתוב/י לי "כן" ואשלח קישור אישי עם כל ההסבר. 🙏
```

### Short version (close friends, current phase)
```
היי [שם]! 👋
אני מריץ בדיקה סגורה של EnglishVibe, אפליקציה ללימוד אנגלית לילדים בעברית, וזה הקישור האישי של [שם הילד/ה]:
[קישור]

הקישור חד־פעמי ותקף 14 יום, כדאי לפתוח אותו במכשיר של הילד/ה.
• בוחרים שם משתמש וקוד סודי, ו*חשוב לרשום אותם*, אי אפשר לשחזר אוטומטית.
• מומלץ לחבר חשבון גוגל של ההורה (באזור ההורים) כדי שאפשר יהיה לאפס את הקוד.
• כדאי להוסיף למסך הבית מתפריט הדפדפן.

אני רואה נתוני שימוש כלליים (בלי שם מלא ובלי מה שהילד/ה כותב/ת), ואפשר לכבות את זה בהגדרות או למחוק את החשבון בכל רגע.
כל הערה, תקלה או רעיון אפשר לכתוב לי כאן, וגם מתוך האפליקציה בהגדרות. תודה! 🙏
```

### Full version with consent wording (for people outside close friends; needs the lawyer review first)
```
היי [שם ההורה] 👋

תודה שהסכמת לעזור! EnglishVibe היא אפליקציה ללימוד אנגלית לילדים בכיתות א׳–י״ב, בעברית, עם משימות ומשחקים. היא עדיין בשלב בדיקה סגור, ורק ילדים שהוזמנו יכולים להשתמש בה. המטרה היא לראות איך ילדים אמיתיים משתמשים בה ולתקן מה שלא עובד.

🔗 הקישור האישי של [שם הילד/ה]:
[קישור]
הקישור הוא לשימוש חד־פעמי ותקף ל־14 יום. אפשר לפתוח אותו במכשיר של הילד/ה (טלפון או טאבלט) ולא להעביר הלאה.

📝 איך נכנסים:
1. פותחים את הקישור ובוחרים שם משתמש וקוד סודי (PIN).
2. חשוב: לרשום את שם המשתמש והקוד במקום בטוח. אי אפשר לשחזר אותם אוטומטית.
3. מומלץ מאוד לחבר גם חשבון גוגל של ההורה (באזור ההורים באפליקציה). כך אפשר לאפס את הקוד אם נשכח.
4. כדאי להוסיף את האפליקציה למסך הבית: בתפריט הדפדפן בוחרים "הוספה למסך הבית".

🔒 מה נאסף, בקצרה:
• התקדמות הלימוד של הילד/ה (משימות, כוכבים, זמן שימוש).
• מוני שימוש ודיווחי תקלות. הם מקושרים לחשבון, ללא שם מלא וללא תוכן שהילד/ה כותב.
• הערות שהילד/ה בוחר/ת לשלוח בכפתור "הערה" בהגדרות.
אנחנו לא שולחים מידע לגורמים אחרים ולא מפרסמים אותו.

⚙️ אתם בשליטה:
• אפשר לכבות את איסוף הסטטיסטיקות בהגדרות ← חשבון ← "סטטיסטיקות שימוש".
• אפשר למחוק את החשבון בכל רגע בהגדרות. ההתקדמות והנתונים נמחקים. הערות שנשלחו נשמרות אצלנו בלי קישור לחשבון, ושם הכינוי שלכם בהזמנה נשאר איתן.
• אם אתם ממשיכים, אתם מאשרים שאתם ההורים או האפוטרופוסים של הילד/ה, ושקראתם את הפרטים האלה.

💬 לשאלות, תקלות או רעיונות, אפשר לכתוב לי כאן או ל־[מייל/טלפון].
ממש יעזור לראות את הילד/ה משתמש/ת בפעם הראשונה ולשמוע מה היה קשה או מבלבל.

תודה רבה! 🙏
[השם שלך]
```
Note: the app has no parent consent screen before sign-up, so the consent sentence lives in the message itself.
If the owner decides not to keep notes after deletion, remove that sentence from the full version.

## Go-live order that was used (do not swap steps 1-3)
1. `node scripts/allowExisting.mjs` lists every account. Then `--all --cohort existing` (every account that exists
   now, guests included) or name some: `--apply <username> <username> --cohort family`. Unnamed accounts are
   locked out.
2. `node scripts/setAccess.mjs --closed`.
3. `firebase deploy --only firestore:rules`, then push (Vercel deploys the app and `api/redeem-invite`,
   `api/owner-testers`, `api/erase-account-data`).
4. Check: a fresh private-window sign-up sees only the invite screen; existing accounts still sign in.

Later app-only changes (API and client, no rules change) need just the push. A change to `firestore.rules`
(new counter, new collection) needs the rules deployed **before** the push.

## Revoking and the kill switch
- One child: *Lock out* in the dashboard (or delete `allowed/{uid}` in the Firebase console); *Remove completely* to also delete the account and data.
- Everyone: `node scripts/setAccess.mjs --closed` is already the state; to freeze the whole app delete the
  `allowed/*` documents, or redeploy the previous rules. Gate code is additive: reverting the commit restores
  open sign-up.

## Data and privacy of the test
- Collected per child: the normal learner profile, per-day usage counters (`analyticsDaily/{day}_{uid}`,
  pseudonymous: keyed by uid, no names or learner text), error reports, and notes the child chooses to send
  (`feedback`, max 500 characters, with an "no personal details" warning). The privacy notice
  (`PrivacyNoticeDialog`) says this honestly ("pseudonymous", not "anonymous").
- Opt-out: *AnalyticsOptOutCard*; with it on, no counters or errors are sent.
- **Account deletion** (Settings, with the PIN) calls `/api/erase-account-data` before deleting the Auth user. It
  removes the learner's `analyticsDaily`, `allowed` and comp `entitlements` (a paid subscription is kept).
  **Feedback notes are deliberately kept**, because they are valuable: the uid is blanked and the invite alias
  stays (`testerLabel`), so they show in the dashboard as "<alias> (account deleted)". The used invite record
  (`invites/{code}`, with its alias) is kept too, without an account link. This is a privacy decision to put in
  front of the lawyer (open item) and is stated in the notice. The call is best effort: if it fails, the
  leftover rows are pseudonymous and can be removed by hand.
- Delete a tester's test account the same way: new invite, sign in, Settings > delete. Deleting only from the
  Firebase console leaves their `learners`, `analyticsDaily` and `feedback` rows behind.

## Public launch: full deployment checklist
Do these in order. Steps 1-4 are code or console work and can be done days before; step 5 is the switch.

1. **Privacy and legal.** Lawyer review of `PrivacyNoticeDialog` (including the "notes and invite record kept
   after deletion" wording, and parental consent for under-13s), terms, and the consent text parents see. Update
   the notice if the review changes what is kept.
2. **Business and payments readiness** (`backlog.md` Business section, `docs/feature-pro-tier.md`): Osek Patur, bank
   account, Grow (Meshulam) account and live ids (`GROW_ENV=production`, see `.env.example`).
3. **Decide Pro.** Pro gating is off for everyone (`IS_PRO_GATING_ON = false` in `src/config/proTier.ts`), so
   "full access" needs nothing. Testers hold a comp Pro entitlement (`source: 'comp'`). Before switching gating
   on, decide: keep it lifetime as a "founding member" thank-you, or give it an expiry (`entitlements` supports
   both; `scripts/grantPro.mjs`). Phase plan: `docs/feature-pro-tier.md`.
4. **Harden the billed endpoints.** Set `VITE_APPCHECK_SITE_KEY` (reCAPTCHA Enterprise) in Vercel, wait until the
   Firebase console shows the web app sending valid App Check tokens, then set `APPCHECK_ENFORCE=on` in Vercel
   Production and redeploy. `/api/tts` already needs a signed-in account and has per-uid and per-IP rate limits
   but does not check `allowed/{uid}`; once access is open that is fine, App Check is the extra protection.
5. **Open the gate.**
   - `node scripts/setAccess.mjs --open` (instant, no deploy, reversible with `--closed`).
   - Remove `<meta name="robots" content="noindex, nofollow" />` from `index.html` and change
     `public/robots.txt` to `User-agent: *` / `Allow: /`. Commit and push (this is the only part that needs a
     deploy).
   - Optional: add `Sitemap` and canonical metadata if you want search to find the app.
6. **After opening.**
   - Existing testers, family accounts and their data, streaks and diamonds are untouched; their `allowed`
     docs just stop mattering. The dashboard joins testers server-side from the `allowed` docs (label, cohort), so
     keep those docs: they are what separates tester data from real users in the tester table.
   - Invite codes still work as optional referral links but are no longer required. The invite screen no longer
     appears for new sign-ups. The Early testers card keeps working; it shows an amber "Access is OPEN" warning.
   - Guest sign-in works again.
   - Watch the dashboard and the error list daily for the first week (`/?owner`), and Vercel runtime logs for
     `/api/*` errors.
7. **Rollback.** `node scripts/setAccess.mjs --closed` takes the app back to testers-only within seconds. Anyone
   who signed up while it was open then has no `allowed` doc and sees the invite screen; run
   `scripts/allowExisting.mjs --all` first if you want to keep them.

## Known limits
- Sign-in with an unverified throwaway Auth account is possible while closed, but it can read and write nothing.
- The first e2e test in a run is slow (cold emulators); rerun once if the first `page.goto` times out.
- `e2e/onboarding.spec` has a stale selector (not from this work).
- The dashboard buttons were verified with component and API tests and in the emulators, not against real Google
  sign-in.

## Where things live
| What | Where |
| --- | --- |
| Rules gate | `firestore.rules` (`isAccessOpen`, `isAllowed`, `invites`, `allowed`, `config`, `feedback`) |
| Redeem | `api/redeem-invite.ts`, client `src/services/accessService.ts`, screen `AccessGateScreen` |
| Owner API | `api/owner-testers.ts` (GET view, POST create / archive, DELETE withdraw / lock out / `erase` remove completely) |
| Dashboard | `src/components/owner/EarlyTestersCard.tsx`, `UsageCard.tsx`, service `ownerTestersService.ts` |
| Deletion | `api/erase-account-data.ts`, `src/services/accountService.ts` |
| Notes | `src/services/feedbackService.ts`, `src/components/settings/FeedbackCard.tsx` |
| Scripts | `scripts/allowExisting.mjs`, `createInvite.mjs`, `setAccess.mjs` |
| Tests | `e2e/early-testers.spec.ts` (run in the emulators), unit tests beside each file |
