# EnglishVibe — Legal & Compliance Audit Implementation Plan

- **Audit Date:** 2026-11-19
- **Business Identity:** מיכאל שקולניק, בעל העסק "SHK טכנולוגיות" (עוסק פטור `310720370`), החיטה 323, מאור
- **Contact & Business Hours:** `support@englishvibe.co.il` | `055-2903310` | ימים א׳–ה׳, 09:00–17:00
- **Audit Scope Covered:** All **67** findings marked `"מאשר שינוי — לתקן לפני השקה"` in the owner's exported review + the **6** previously finalized items (`TOS-03`, `TOS-08`, `TOS-12`, `TOS-19`, `CHK-01`, `LAND-02`), using conservative Israeli-law defaults because this soft launch proceeds without formal legal counsel sign-off.
- **Execution Rules:** Implement **one task at a time**, wait for verification on each task before proceeding, and do not mark items off in `backlog.md` without explicit approval.

---

## 1. Locked-In Business & Legal Decisions

### A. Identity, Contacts & Response SLA (`TOS-01`–`TOS-03`, `PRIV-01`, `REF-01`, `LAND-05`, `Q-11`)
- **Legal Entity Disclosure:** Terms §1 (`TOS-03`) and Privacy Notice header (`PRIV-01`) identify **"מיכאל שקולניק, בעל העסק SHK טכנולוגיות, עוסק פטור מס׳ 310720370, מרחוב החיטה 323, מאור"**. Marketing footer on `/home/` may retain the trade name (`SHK טכנולוגיות`).
- **Response SLA:** Unified across `docs/legal/pro-legal-drafts.md`, `docs/legal/Service and Refund Policy.md`, `src/site/siteContent.ts`, and `home/index.html` to **3 business days (`3 ימי עסקים — ימים א׳–ה׳, בין השעות 09:00–17:00, לא כולל שבתות וחגי ישראל`)**.
- **Contact Consistency:** `055-2903310` stays as the statutory/Grow phone number (`SHOW_PHONE_ON_SITE = true` at pre-check gate in Task 7). Support queries and 4+ child inquiries standardize on `support@englishvibe.co.il` when WhatsApp buttons are removed.

### B. Cancellation, Refunds & Grow Mechanics (`TOS-13`–`TOS-19`, `REF-01`–`REF-05`, `Q-01`–`Q-03`, `Q-07`, `Q-09`, `MISS-03`)
- **14-Day Full Refund (`Q-01`, `REF-02`, `TOS-17`, `TOS-18`):** 100% full refund with **no cancellation fee**, once per family/account, with the 14-day clock starting from payment OR receipt of the written transaction disclosure document (whichever is later, §14ג(ג)).
- **Protected Groups (`TOS-18`, `REF-02`):** 4-month statutory window for senior citizens (65+), persons with disabilities, and new immigrants when a conversation occurred (§14ג1).
- **Monthly Plan Cancellation (`Q-02`, `TOS-18`, `REF-03`):** By default, access continues through the end of the already-paid billing month with no future charges (and any interim Grow charge during manual task turnaround is refunded in full); upon explicit customer request, terminate within **3 business days** with a pro-rata refund for unused days (§13ד(ג)).
- **Yearly Plan Cancellation After 14 Days (`Option B`, `TOS-17`, `REF-04`, `Q-03`):**
  $$\text{Refund} = \max\Big(0,\ \text{Yearly Amount Paid} - (\text{Months Started Including Current Month} \times \text{Regular Monthly Rate})\Big)$$
  where Regular Monthly Rate = `₪39` (1 child), `₪64` (2), `₪89` (3), `₪114` (4). From month 9 onward (`9 × ₪39 = ₪351 > ₪349`), refund is `₪0` and Pro remains active until year-end. Disclosed explicitly at checkout (§13ג).
- **Parent Portal Controls (`TOS-19`, `REF-02`, `REF-04`):** Add **1-click cancellation for yearly plans** in the Parent Portal (`api/subscription.ts` + UI), plus a distinct `< 14 days` full-refund cancellation path for both monthly and yearly subscriptions creating an owner refund task in `gatewayTasks`.
- **Daily Reconcile & Seat Edits (`TOS-16`, `TOS-19`):** Deleting the last Pro child triggers cancellation at daily reconcile with full refund of any interim charge; deleting 1 of multiple children reduces the next monthly charge; adding a child that increases the monthly charge displays explicit confirmation & logs server consent; 1-child yearly seat swaps are handled via support.
- **Bit / Digital Wallet Refunds (`REF-05`):** Fallback to bank transfer / agreed transfer method within 14 days if the original wallet cannot process a direct partial refund months later.
- **Mandatory Email & Written Disclosure (`TOS-13`, `CHK-03`, `MISS-03`):** Make `payerEmail` mandatory at checkout; render a printable/saveable `"סיכום עסקה ופרטי ביטול"` disclosure card on `ProPaymentReturn.tsx` (§14ג(ב)–(ג)); persist `{ termsVersion, privacyVersion, acceptedAt, acceptedRetryConsent }` on checkout records (`Q-09`).
- **Recurring & Price Changes (`TOS-07`, `TOS-10`, `TOS-14`, `TOS-15`, `TOS-22`, `Q-04`):** Note Grow/Make 36-charge cap internally; verify `regular_payment_id` vs `directDebitId` on first live PROD failure test; price increases or material terms reductions require **30 days' direct email notice** to paying parents (+ portal notice), with pre-change cancellation (and pro-rata yearly refund if terms/core value are materially reduced). Operational Resend parent emails tracked in `backlog.md` (manual `support@englishvibe.co.il` suffices until automated).

### C. Minor Consent & Free-Tier Signup (`TOS-04`, `Q-06`, `ROAD-04`)
- **Territorial Scope:** Terms §2 restricts the service to **residents of Israel only (`תושבי מדינת ישראל בלבד`, grades 1–12)** to reduce COPPA/GDPR exposure.
- **Option A Consent (No SMS/Email Verification on Free Tier):**
  - Grades 1–7 (`< 13`): Upgrade checkbox in `LearnerBasicsForm.tsx` to link BOTH Terms of Service & Privacy Policy (`"אני הורה/אפוטרופוס, קראתי ומסכים/ה לתנאי השימוש ולמדיניות הפרטיות..."`) and persist timestamp + policy versions.
  - Grades 8–12 (`13–17`): Add concise checkbox (`"קראתי ומסכים/ה לתנאי השימוש ולמדיניות הפרטיות, בידיעת והסכמת הוריי"`) and persist timestamp + policy versions, eliminating the age-18 vs. age-13 mismatch.

### D. Privacy & Minimum Security Tier (`PRIV-01`–`PRIV-13`, `Q-05`, `Q-10`, `Q-12`, `MISS-04`)
- **Keep Analytics Toggle (`PRIV-09`):** Retain the `isAnalyticsOptedOut` toggle and update `useActiveTimeTracker.ts` so `activeSeconds` stops recording when opted out.
- **Neutral Shabbat / Weekend Framing (`PRIV-02`, `Q-05`):** Reframe the `isShabbatObserver` UI copy & Privacy Notice neutrally as a **weekend/Shabbat streak-pause & quiet-day preference** (not religious-belief profiling), keeping database classification safely within **"מאגר המנוהל בידי יחיד"** (1-page `docs/legal/database-definition.md` + local folder of standard vendor DPAs; no registration, no DPO, no formal incident/security procedures required). Preserve internal Firestore field names for backward compatibility.
- **Full Deletion & Data Hygiene (`PRIV-04`, `PRIV-07`, `PRIV-10`, `PRIV-13`, `Q-12`):**
  - Stop caching user-typed dynamic TTS strings in public CDN for 1 year (`api/tts.ts` → `private, no-store` for dynamic text; update privacy text to disclose Hebrew + English TTS).
  - Update privacy disclosures for `Firebase (EEA & Auth/App Check US)`, `Vercel`, `Cloudflare R2`, `Google reCAPTCHA Enterprise`, `Web Push`, `Grow` (with link + `sendingMode: 3` non-WhatsApp note), `Make/Celonis`, `deviceId` / `?src=` / `funnelDaily`, `FriendsHub` code/alias visibility, and actual `reportSnapshots` fields.
  - Delete `reminderSends`, `friendRequestCounts`, strip `testerLabel` / delete `feedback` & `invites`, and clear `localStorage` on learner deletion; handle parent account deletion (wire `deleteParentAccountData` or clear 30-day email deletion + explicit data-export scope); purge operational payer contact info (`payerName`/`payerPhone`/`payerEmail`) from closed `checkouts`/`gatewayTasks` after 90 days (keeping 7-year accounting records).

### E. Public Site, Accessibility, Grow & Pre-Login Links (`LAND-01`–`LAND-05`, `MISS-01`, `CHK-01`–`CHK-04`, `TOS-02`, `TOS-12`)
- **Root Domain Architecture (`LAND-01`):** Root `/` stays the learning game/app (no redirect to `/home/`). Display prominent **`"ביטול עסקה"`** (`→ /refunds/#cancel`) and **`"הצהרת נגישות"`** (`→ /accessibility/`) links on `/home/` and all static site pages (`src/site/renderSite.ts`), AND discreetly on the **pre-login / unauthenticated entry screens** of `/` (`SignInPanel.tsx`) and `/?parent` (`ParentPortal.tsx`), while keeping children's active gameplay screens uncluttered.
- **Self-Authored Accessibility Statement (`MISS-01`):** Author `docs/legal/accessibility-statement.md`, build static `/accessibility/index.html` + `vercel.json` redirect (`/accessibility` → `/accessibility/`) + footer link.
- **Two-Stage Grow Rollout (`TOS-12`, `CHK-01`, `LAND-02`):**
  - *Stage A (before Grow Site Check & flipping `LEGAL_PAGES_LIVE = true` + `SHOW_PHONE_ON_SITE = true`):* Replace draft `[brackets]` in Terms §6 with clean, bracket-free business descriptor text (`"SHK טכנולוגיות / EnglishVibe"`).
  - *Stage B (immediately after the first real PROD test charge — never using owner's or 1st-degree relative's card — and before enabling `IS_PRO_PLAN_VISIBLE = true`):* Fill the exact observed credit-card descriptor string in Terms §6 and `ProCheckoutPanel.tsx`.

---

## 2. Phased Implementation Plan (1 Task at a Time)

### Task 1 — Core Legal Texts Rewrite & Neutral Shabbat Copy
- **Covers:** `TOS-01`, `TOS-03`, `TOS-05`, `TOS-06`, `TOS-07`, `TOS-09`, `TOS-10`, `TOS-11`, `TOS-12` (Stage A), `TOS-14`, `TOS-15`, `TOS-16` (wording), `TOS-17`, `TOS-18`, `TOS-20`, `TOS-21`, `TOS-22`, `TOS-23`, `PRIV-01`, `PRIV-02`, `PRIV-03`, `PRIV-04` (disclosure), `PRIV-05`, `PRIV-06`, `PRIV-07`, `PRIV-08`, `PRIV-10`, `PRIV-11`, `PRIV-12`, `PRIV-13` (disclosure), `REF-01`, `REF-02` (wording), `REF-03`, `REF-04` (wording), `REF-05`, `Q-01`–`Q-12`, `ROAD-01`–`ROAD-04` (wording) *(+ optional `TEST-01`–`TEST-04` in `docs/early-testers.md` if still used)*.
- **Target Files:**
  - `docs/legal/pro-legal-drafts.md`
  - `docs/legal/Service and Refund Policy.md`
  - `src/config/privacyNotice.ts`
  - `src/config/appInfo.ts` (bump `TERMS_VERSION`; add `PRIVACY_VERSION`)
  - `src/components/settings/SettingsView.tsx` (neutral weekend/Shabbat streak-pause & quiet-day label copy without changing internal schema keys)
  - `docs/early-testers.md` *(only if closed-tester WhatsApp invites are still being sent)*
- **Verification:** `npm run build` + `privacyNotice` and site rendering unit tests.

### Task 2 — Accessibility Page (`/accessibility/`) & Public Site / Pre-Login Compliance
- **Covers:** `MISS-01`, `LAND-01`, `LAND-03`, `LAND-04`, `LAND-05`, unified `3 ימי עסקים (09:00–17:00)` SLA on `/home/`.
- **Target Files:**
  - `docs/legal/accessibility-statement.md` *(new)*
  - `accessibility/index.html` *(new static entry)*
  - `vite.config.ts` (add `'accessibility'` to `SITE_PAGES` and `buildSiteBlocks` support in `src/site/renderSite.ts`)
  - `vercel.json` (add `/accessibility` → `/accessibility/` permanent redirect)
  - `src/site/renderSite.ts` (footer links `"ביטול עסקה"` → `/refunds/#cancel`, `"הצהרת נגישות"` → `/accessibility/`, VAT-exempt pricing note)
  - `src/site/siteContent.ts` (`CONTACT` SLA `3 ימי עסקים`, `FAQ` monthly + yearly cancel & Option B summary, `TERMS_DOC_PATH` / `REFUNDS_DOC_PATH` links)
  - `home/index.html` (Ministry non-affiliation note, WhatsApp report card correction, privacy link on "What's stored", `3 ימי עסקים` FAQ line)
  - `refunds/index.html` (ensure `#cancel` anchor + quick cancel form/`mailto` helper)
  - `src/components/SignInPanel.tsx` & `src/components/parent/ParentPortal.tsx` (discreet pre-login `"ביטול עסקה"` and `"הצהרת נגישות"` links only when signed out)
- **Verification:** `npm run build`, inspect generated `dist/accessibility/index.html`, `dist/home/index.html`, `dist/refunds/index.html`, and run site/component unit tests.

### Task 3 — Minor Consent & Free-Tier Signup Compliance (Option A)
- **Covers:** `TOS-04`, `Q-06`.
- **Target Files:**
  - `src/components/LearnerBasicsForm.tsx` (grades 1–7 `<13` checkbox linking Terms + Privacy; grades 8–12 `13–17` checkbox `"קראתי ומסכים/ה לתנאי השימוש ולמדיניות הפרטיות, בידיעת והסכמת הוריי"`)
  - `src/components/OnboardingView.tsx`
  - `src/types/learner.ts` & `src/utils/buildSavedProfile.ts` (persist consent timestamp + `termsVersion` + `privacyVersion`)
  - `src/services/cloudSync.ts`
  - `firestore.rules` (allow/validate consent metadata fields if constrained)
- **Verification:** Unit tests for `LearnerBasicsForm` / `buildSavedProfile` / `cloudSync` + `firestore.rules` check.

### Task 4 — Checkout, Yearly Portal Cancel, 14-Day Refund UX & Written Disclosure Card
- **Covers:** `TOS-08`, `TOS-13`, `TOS-16`, `TOS-19`, `REF-02`, `REF-04`, `CHK-02`, `CHK-03`, `CHK-04`, `Q-09`, `MISS-03`.
- **Target Files:**
  - `src/config/proTier.ts` & `api/checkout.ts` (remove `MAX_LINKED_CHILDREN = 6`, require `payerEmail`, store `privacyVersion` & `acceptedRetryConsent`)
  - `src/components/parent/ProCheckoutPanel.tsx` & `src/components/parent/proPlanParts.tsx` (mandatory email, `/refunds/` link + explicit 14-day/Option B disclosure text, explicit `"גרואו פיימנטס בע״מ (Grow)"` naming, replace 4+ kids WhatsApp button with `support@englishvibe.co.il`, promo s.13א ready slot)
  - `api/subscription.ts`, `src/components/parent/ChildProSection.tsx`, `src/components/parent/ParentHome.tsx` (remove 409 yearly cancel block; add 1-click yearly cancel UI showing 14-day / Option B refund preview and creating manual `gatewayTasks`; add `< 14 days` full-refund flow for both monthly & yearly; explicit confirmation & server consent log when adding a child increases monthly recurring amount)
  - `src/components/parent/ProPaymentReturn.tsx` (render printable/saveable `"סיכום עסקה ופרטי ביטול"` disclosure card per §14ג(ב)–(ג))
- **Verification:** API + React checkout/subscription/portal unit tests and `npm run build`.

### Task 5 — Privacy & Data-Lifecycle Code Fixes
- **Covers:** `PRIV-04`, `PRIV-07`, `PRIV-09`, `PRIV-10`, `PRIV-13`, `Q-12`, `MISS-04` (code cleanup).
- **Target Files:**
  - `api/tts.ts` (`Cache-Control: private, no-store` for dynamic/user-typed TTS strings vs. static curriculum clips)
  - `src/hooks/useActiveTimeTracker.ts` & `src/App.tsx` (honor `isAnalyticsOptedOut` so `activeSeconds` is not recorded when opted out)
  - `api/_lib/eraseAccount.ts`, `src/services/accountService.ts`, `firestore.rules` (delete `reminderSends`, `friendRequestCounts`, strip `testerLabel` / delete `feedback` & `invites`, clear `localStorage`)
  - `src/components/parent/ParentHome.tsx` & `src/services/parentService.ts` (wire `deleteParentAccountData` UI action in Parent Portal)
  - `api/pro-reconcile.ts` (purge operational `payerName`, `payerPhone`, `payerEmail` from closed `checkouts` / `gatewayTasks` older than 90 days after plan end)
- **Verification:** TTS cache header tests, erase-account & parent-delete unit tests, active-time tracker tests, `pro-reconcile` cleanup tests.

### Task 6 — Internal Minimum Privacy Package & Backlog Updates
- **Covers:** `Q-05`, `MISS-04` (minimal internal compliance under `"מאגר המנוהל בידי יחיד"`), `TOS-10`, `TOS-12` (Stage B reminder), `ROAD-01`–`ROAD-03`.
- **Target Files:**
  - `docs/legal/database-definition.md` *(new — concise 1-page Regulation 2 Database Definition Document + list of standard vendor DPAs to save locally: Google Cloud/Firebase, Microsoft Azure, Vercel, Cloudflare, Make/Celonis, Grow)*
  - `backlog.md` (add ONLY new follow-up items: operational Resend parent emails per `TOS-10`/`MISS-03`, Stage B exact credit-card descriptor update after first live PROD test charge per `TOS-12`/`CHK-01`; leave all existing checkboxes untouched)
- **Verification:** Markdown review + verify no unintended `backlog.md` status edits.

### Task 7 — Pre-Grow Site Check Switch (`LAND-02`, `TOS-02`)
- **Covers:** `LAND-02`, `TOS-02` *(executed only after Tasks 1–6 pass verification)*.
- **Target Files:**
  - `src/site/siteContent.ts` (`LEGAL_PAGES_LIVE = true`, `SHOW_PHONE_ON_SITE = true`)
- **Post-Launch Gate Reminder (after the first live PROD charge; Grow said on 2026-11-24 that no site check is needed):** Complete `TOS-12` Stage B + `CHK-01` exact credit-card statement descriptor before enabling `IS_PRO_PLAN_VISIBLE = true`.

---

## 3. Open Question Before Starting Task 1
- **`docs/early-testers.md` (`TEST-01`–`TEST-04`):** Confirm whether closed-tester WhatsApp invites are still being sent (include in Task 1) or if we are moving straight to open soft launch (skip).
