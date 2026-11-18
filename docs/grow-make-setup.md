# Grow through Make: setup

How EnglishVibe takes payments through Grow's free Make.com app instead of Grow's paid API (₪250 + VAT a month, from the testing stage on). Code: `api/_lib/payments/growMake.ts` (`PAYMENT_PROVIDER=grow-make`). Background and decision: `docs/feature-pro-tier.md`, "Grow through Make".

**Who does what**
- **The owner** does every step in Make and in Grow's dashboard. These accounts sign in with the owner's ID number and phone.
- **The code** only calls the scenario's webhook address and receives Grow's notices.

## How it fits together

```
parent → /api/checkout → Make scenario (action=create) → Grow: Create Payment Link → {url, processId, processToken}
parent pays on Grow's page
Grow → notifyUrl (/api/payment-webhook?source=process&key=…; checkout id from cField1) → plan activated
     → /api/payment-webhook → Make scenario (action=approve) → Grow: Approve Transaction
Grow account webhooks (dashboard) → /api/payment-webhook?source=account&key=… → renewal / failed charge
cancel or price change → owner task on the owner dashboard → done by hand in Grow
```

## 1. Make account and the Grow connection
1. Sign up at make.com. The free plan gives 1,000 credits a month and 2 active scenarios (the sandbox and the live one); each checkout, approve or alert uses about 3 credits. The reconcile warns the owner at 70% and 90% (`MAKE_API_TOKEN`, section 4).
2. Create a scenario and add a **Grow → Create Payment Link** module, then **Create a connection**:
   - For testing, choose **Grow Sandbox**. Name it `Grow Sandbox`.
   - In "Grow account number", enter the **ID number (ת.ז.) linked to the Grow account**. This is not the Grow account number.
   - Enter the mobile number linked to the account, then the SMS code.
3. Later, for launch, add a second connection of type **Grow** (live). It is set up the same way.

**Sandbox warning:** test card payments in the sandbox aren't charged. **Bit, Apple Pay and Google Pay in the sandbox are real charges.** Test with the card only.

## 2. The scenario: "EnglishVibe payments (sandbox)"

Build one scenario per environment: sandbox first, then a copy on the live connection.

**The sandbox scenario is built** (Make connector, 2026-11-16): scenario 8616617 "EnglishVibe payments (sandbox)" on webhook 4119019, with the routes below (`create` monthly, `create` yearly, `approve`; no `info` route). Test calls returned a working link for both monthly and yearly. The webhook requires an API key (a key of type **Webhook API Key Auth**, created under Keys and attached to the webhook; Make's webhook detail page doesn't show it). Since 2026-11-16 the scenario is **on**, and calls without the key get 401. The owner puts the webhook address and the key into `GROW_MAKE_WEBHOOK_URL` / `GROW_MAKE_API_KEY` on Vercel Preview. An unknown `action` gets Make's plain `Accepted`, which the server treats as a failure.

**Scenario settings** (the ⚙ at the bottom):
- **Data is confidential: on.** Make then keeps no payer details in its run history.
- **Sequential processing: off.**

### Module 1: Webhooks → Custom webhook
1. Click **Add**, name it `EnglishVibe sandbox`, and open **API Keys** → **Add**. Create a long random key.
2. Copy the webhook address and the key. They become `GROW_MAKE_WEBHOOK_URL` and `GROW_MAKE_API_KEY` (step 4).
3. Click **Redetermine data structure**, then send this sample from a terminal. Replace the address and the key:

```bash
curl -X POST "<GROW_MAKE_WEBHOOK_URL>" -H "Content-Type: application/json" -H "x-make-apikey: <GROW_MAKE_API_KEY>" -d "{\"action\":\"create\",\"recurring\":true,\"transactionTypes\":[1],\"checkoutId\":\"test\",\"productName\":\"EnglishVibe Pro monthly 1 child\",\"price\":39,\"payerName\":\"Test Parent\",\"payerPhone\":\"0500000000\",\"payerEmail\":\"\",\"successUrl\":\"https://englishvibe.co.il/?parent\",\"notifyUrl\":\"https://englishvibe.co.il/api/payment-webhook\",\"maxCharges\":36,\"processId\":\"\",\"processToken\":\"\",\"transactionId\":\"\",\"transactionToken\":\"\",\"asmachta\":\"\",\"fullName\":\"\"}"
```

### Module 2: Router with three routes
Each route has a filter on `action`:
- `create`
- `info`
- `approve`

### Route `create`
1. **Grow → Create Payment Link** (connection: Grow Sandbox). Field reference: developers.grow.business, "createPaymentLink".
   - **Sending Mode:** none. We show the link ourselves, so Grow sends no SMS or email.
   - **Sending Mode** "none" shows as `3` in the module input.
   - **Payment Type:** two `create` routes, split by a filter on `recurring` (`true` / `false`):
     - monthly: Recurring Payment;
     - yearly: Payments, Max or Custom = Custom Payments, Payments Number = **1**.
     - For a recurring payment, **Max or Custom** = **Custom** and **Payments Max Number** = map `maxCharges` (the server sends `GROW_MAKE_MAX_CHARGES`, default 36).
     - **A standing order can't run until cancelled through Make** (Grow, 2026-11-15). Grow refuses `1`. With Max or Custom = Max Payments, the module refuses anything above 12 ("Maximum value is 12", a Make-side check); **Custom takes up to 36** (checked in the sandbox, 2026-11-16).
     - One charge before a standing order runs out, the owner gets an **"Extend the standing order"** task: add the same number of charges to it in Grow's standing-orders area.
   - **Payment methods:** set **Charge Type** = Regular Charge. Its nested **Transaction Type** field then appears; map it to `transactionTypes` (`[1]` monthly, `[6,13,14,1]` yearly: Bit and the wallets first). Grow still shows only what the account allows: check the yearly page for Bit and the wallets, and whether it keeps this order. The direct Grow API (`grow.ts`) sends no methods; there the page's own settings set them and their order.
   - **Product:**
     - name = `productName`;
     - price = `price` (whole shekels);
     - quantity = 1;
     - **VAT type:** exempt (עוסק פטור) on the live account. **The sandbox refused 3 (exempt)** and only takes regular VAT, so the sandbox scenario uses regular VAT. Ask Grow which value an עוסק פטור sends live.
   - **Page fields:**
     - full name = `payerName`;
     - phone = `payerPhone`;
     - email = `payerEmail`.
     - Invoice Name and Invoice License Number: left empty (not set). Set to "Optional" they add "שם לחשבונית" and "מ. תעודת זהות" to Grow's details screen; removed from the sandbox scenario 2026-11-18.
   - **Success URL** = `successUrl`.
   - **Notify URL** = `notifyUrl`. It already carries our secret; never edit it.
     - It has no checkout id: the webhook takes that from `cField1`.
     - Keep it under 255 characters. On staging, a 263-character address (with `&checkout=` and Vercel's bypass) never reached us, while a 243-character one did (2026-11-16).
   - **cField1** = `checkoutId`.
2. **Webhooks → Webhook response**:
   - status 200;
   - header `Content-Type: application/json`;
   - body:

```json
{"url":"{{Data.URL}}","processId":"{{Data.Payment Link Process ID}}","processToken":"{{Data.Payment Link Process Token}}"}
```

   Use Make's mapping panel to pick these three fields from the Create Payment Link output. A sandbox run (2026-11-13) answered `Status: 1`, an empty `Error`, and `Data` with `Payment Link Process ID` (a number), `Payment Link Process Token` and `URL` (`https://sandbox.grow.link/…`).

### Route `info` (optional, not built)
Grow's payment notice already carries `directDebitId` (sandbox, 2026-11-16), and Get Payment Link Info's output has no such field, so the built scenario leaves this route out. Without it the server logs "info failed" and links the plan on its first renewal.
1. **Grow → Get Payment Link Info**: process id = `processId`, process token = `processToken`.
2. **JSON → Create JSON** from the whole module output.
3. **Webhooks → Webhook response**: status 200, the JSON string as the body.

### Route `approve`
1. **Grow → Approve Transaction**: map each field it asks for from the webhook data. These include:
   - Transaction ID = `transactionId`;
   - Transaction Token = `transactionToken`;
   - Full Name = `fullName`;
   - Payer Phone = `payerPhone`;
   - Asmachta = `asmachta`.

   The server sends only these five fields from Grow's notice.
2. **Webhooks → Webhook response**: status 200, body `{"ok":true}`.

### Route `notify` (alerts to the owner)
The server calls it whenever it saves a Grow task (cancel, amount, extend, refund, unmatched charge), and the daily reconcile calls it again for tasks open more than 2 days (`api/_lib/ownerAlerts.ts`). The body is `{action, kind, subject, text, dueDate, dashboardUrl}`. It never carries the payer's details: those stay on the owner dashboard.
1. **Webhooks → Webhook response:** status 200, body `{"ok":true}`, sent first so the server never waits on the alert.
2. **Email → Send an Email to a Team Member:**
   - to: the owner's Make address;
   - subject = `subject`;
   - content = `text`, right-to-left.
3. **Telegram Bot → Send a Text Message or a Reply** (free, to the owner's own chat):
   - connection: the owner's alerts bot (made with @BotFather; the token is pasted only into Make's Telegram connection, "EnglishVibe alerts bot");
   - Chat ID = the owner's chat with the bot (open the bot, press Start, send any message; a bot can't write to someone who hasn't messaged it);
   - text = `subject`, a blank line, then `text`; link previews off.
   - The sandbox scenario has it (2026-11-18). CallMeBot WhatsApp was dropped: it had no free sign-up slots.
4. Both alert modules have an **Ignore** error handler. The scenario turns itself off after 3 errors in a row, and a failed alert must never take payments down with it.

Then **save** the scenario and turn **Scheduling** on ("Immediately as data arrives").

## 3. Grow dashboard webhooks (renewals and failed charges)

In Grow: **הגדרות → ניהול וובהוקים → יצירת וובהוק חדש**. Create two webhooks:
1. **Recurring Payment** (each monthly charge from the second on);
2. **Failed Recurring Payment**.

Use this address for both:

```
<APP_ORIGIN>/api/payment-webhook?source=account&key=<PAYMENT_WEBHOOK_SECRET>
```

- **On a Vercel Preview:** add `&x-vercel-protection-bypass=<the Protection Bypass for Automation secret>`.
- **If Grow shows a webhook key:** put it in `GROW_WEBHOOK_KEY`, and the server then checks it too.
- **Don't** set the per-link "קישור לעדכון מערכות מידע (שרת)" field by hand. Every link our server creates carries its own notify URL.

**Don't create these webhooks until the server is deployed with `PAYMENT_PROVIDER=grow-make`.** Until then every charge would be answered with an error.

## 4. Vercel environment

| Variable | Preview (sandbox) | Production (live) |
| :--- | :--- | :--- |
| `PAYMENT_PROVIDER` | `grow-make` | `grow-make` |
| `GROW_MAKE_WEBHOOK_URL` | sandbox scenario address | live scenario address |
| `GROW_MAKE_API_KEY` | sandbox key | live key |
| `GROW_MAKE_MAX_CHARGES` | unset (36) | unset (36) |
| `PAYMENT_WEBHOOK_SECRET` | long random string | a different long random string |
| `APP_ORIGIN` | the Preview URL | `https://englishvibe.co.il` |
| `GROW_WEBHOOK_KEY` | only if Grow shows one | only if Grow shows one |
| `CRON_SECRET`, `FIREBASE_SERVICE_ACCOUNT_JSON`, `OWNER_UID` | as today | as today |
| `MAKE_API_TOKEN` | unset | a Make API token with only the `organizations:read` scope |
| `MAKE_ORGANIZATION_ID` | unset | the Make organization's id (in the address bar of the organization page) |
| `MAKE_ZONE` | unset | unset (`eu1.make.com`) |

- **Make credits warning:** the nightly reconcile reads the organization's credit use with `MAKE_API_TOKEN` and warns the owner by email and Telegram (route `notify`, kind `make_credits`) at 70% and again at 90% of the cycle's credits (`api/_lib/makeCredits.ts`). With no credits left Make stops the payment scenario and new checkouts fail until the reset, so upgrade the Make plan or buy credits when the warning comes. Make the token in Make under **Profile → API access → Add token**, tick only `organizations:read`, and paste it straight into Vercel (Production only: the Vercel cron runs only there, and staging shares the same Make organization).
- **Preview protection:** turn on Vercel **Deployment Protection → Protection Bypass for Automation**. The checkout then adds the bypass to Grow's notify URL on Preview only.
- **Test on staging** (the `staging` branch, Firebase project `english-tutor-staging`; `docs/staging.md`), with a test parent account. Never use the owner's own card or a relative's card (Grow terms §11.2.7).

## 5. Sandbox test run (card 4580 4580 4580 4580)

| Case | Expect |
| :--- | :--- |
| Monthly checkout | Grow page shows card only. After paying: `subscriptions/{id}` active, entitlements on, `payments/grow_…`, קבלה emailed |
| Yearly checkout | Page shows card (Bit and wallets are real charges, skip them). Plan active for 12 months |
| Receipt | **Not issued yet (2026-11-16):** the payer got only Grow's payment confirmation, and no notice reached `invoiceNotifyUrl` (sandbox scenario → catcher hook). Receipts must be turned on in Grow's account first; recheck after. Before launch, the live scenario's `invoiceNotifyUrl` is left empty or points at our server, never the catcher |
| Monthly renewal (ask Grow how to trigger one in the sandbox) | Plan linked to its standing order (`recurringRefs/grow_…`), `periodEnd` + 1 month |
| Failed charge | Plan and seats `past_due` |
| Cancel in the parent portal | Plan canceled, the owner dashboard shows "Cancel the standing order" (an open amount task closes). Cancel it in Grow, press Done (passed on staging 2026-11-18) |
| Add a child to a monthly plan | Owner task "Change the standing order amount" with the new price (passed on staging 2026-11-18) |
| Remove that child before doing the task | The amount task closes by itself: Grow still charges the old price (2026-11-18 fix) |

**After each case, send Claude the Make run output and Grow's notice, with personal details blanked.**

**Grow's payment notice, as seen in the sandbox (2026-11-16):**
- It arrives **form-encoded** (`data[statusCode]=2`, …), not JSON as Grow's answer said. The server reads both, and the total `data[sum]` wins over each `data[productData][n][sum]`.
- `data`:
  - `statusCode` "2" (`status` "שולם"), `sum`, `transactionId`, `transactionToken`, `asmachta`;
  - `directDebitId` (the standing order) and also `recurringDebitId` (a different number);
  - `paymentLinkProcessId`/`Token`, `processId`/`Token`, `customFields[cField1]`, the payer's name and phone, and card details.
  - It also holds the business's `invoice_name` and `invoice_license_number`: keep notices out of logs.
- **Approve Transaction** takes `transactionId` and `transactionToken` (required), and `fullName`, `payerPhone` and `asmachta`.
- **Grow's answers (2026-11-17):**
  - **Renewals** ("Recurring Payment", from the second charge on) carry `directDebitId`: the same id the first notice gives, so they find the plan directly.
  - **Failed charges** ("Failed Recurring Payment") carry `regular_payment_id`, "the standing order's code". Grow won't confirm it equals `directDebitId`. If it doesn't, the failure finds no plan and becomes an owner task (`match_renewal`, emailed and sent on WhatsApp); the plan isn't marked past due, and the reconcile expires it at `periodEnd` if no renewal comes. Check the first real failure and record the answer here.
  - `recurringDebitId` is another id, used for token charges. We don't use it.
  - **VAT:** the sandbox account is VAT-registered, so it only takes `vatType` 1. The **live** scenario must use **VAT Exempt (3)**, with the Grow account set up as an עוסק פטור.
  - **Unlimited standing orders** exist, but only on links made in Grow's own app, not through Make (capped at 36). Those links can't carry `cField1` or the payer's details, so we keep Make plus the "extend" task.
  - **Fixed sales pages** can't take `cField1` or prefilled details from the URL. Use Make payment links.
- **Grow's second answers (2026-11-17):**
  - **Receipts:** turned on in the live Grow account under מסמכים → הגדרות בית עסק / הגדרות מסמך (business details, numbering, document type קבלה for an עוסק פטור, automatic issuing and emailing to the payer). Guide: https://grow.business/invoice_guides/. **The Make sandbox is one account shared by all Grow customers**, so it never shows our document settings: receipts can only be checked on the launch charge.
  - `invoiceNotifyUrl` reports the first payment's document only. Documents for monthly charges need a separate dashboard webhook of type "Invoice creation". We don't need either; the sandbox scenario's `invoiceNotifyUrl` can go.
  - **No sandbox dashboard:** the sandbox standing order 252530 can't be cancelled by us, and charges nothing real. Mark its staging task done.
  - **Failed-charge notice** (documented sample): `regular_payment_id`, `sum`, `error_message`, `charges_attempts`, `webhook_key`. No `directDebitId`, `cField1`, phone or email. Grow still won't confirm `regular_payment_id` equals `directDebitId`.
  - **Grow retries a failed monthly charge automatically** for up to 10 days, never past the end of the calendar month, and this can't be turned off. Grow doesn't promise a notice per retry or one when it gives up. The server keeps one unmatched-failure task per standing order, so retries don't re-alert or reopen it.
  - **Renewals and failures can't be triggered in the sandbox**, and the shared sandbox takes no dashboard webhooks. They're covered by unit tests against the documented samples, and checked live after launch.

## 6. Launch
1. Copy the scenario onto the **live** connection, with a new webhook address and key, and set the Production env. In the copy, set each product's **VAT Type to VAT Exempt (3)**, and clear `invoiceNotifyUrl` (or point it at our server).
2. Create the two account webhooks in the live dashboard with the Production address.
3. Make one real low-price charge on a card that isn't the owner's or a relative's. Check the קבלה, then refund it in Grow.

## Owner's manual work
- Each new Grow task is sent to the owner by **email and Telegram** (route `notify`), and again every day once it's been open more than two days, until it's marked done.
- The owner dashboard (`?owner`, Overview tab) lists open **Grow tasks**, with the payer's details. The count turns red after a day.
- **Cancel the standing order:** do it before the date shown, or the parent is charged after cancelling.
- **Change the standing order amount:** set the new amount from the next charge.
- **Refund:** a charge after cancelling, or a child who already had Pro.
- **Unmatched Grow charge:** a renewal or failure we couldn't tie to a plan. Find the parent by phone in Grow.
- **Extend the standing order:** it has one charge left. In Grow's standing-orders area, add the number of charges the note says (the same as `GROW_MAKE_MAX_CHARGES`), before the date shown. Then press Done.
