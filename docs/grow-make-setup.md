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
1. Sign up at make.com. The free plan gives 1,000 credits a month, and each checkout uses about 3.
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
   - **Payment methods:** set **Charge Type** = Regular Charge. Its nested **Transaction Type** field then appears; map it to `transactionTypes` (`[1]` monthly, `[1,6,13,14]` yearly). Grow still shows only what the account allows: check the yearly page for Bit and the wallets.
   - **Product:**
     - name = `productName`;
     - price = `price` (whole shekels);
     - quantity = 1;
     - **VAT type:** exempt (עוסק פטור) on the live account. **The sandbox refused 3 (exempt)** and only takes regular VAT, so the sandbox scenario uses regular VAT. Ask Grow which value an עוסק פטור sends live.
   - **Page fields:**
     - full name = `payerName`;
     - phone = `payerPhone`;
     - email = `payerEmail`.
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

- **Preview protection:** turn on Vercel **Deployment Protection → Protection Bypass for Automation**. The checkout then adds the bypass to Grow's notify URL on Preview only.
- **Test on staging** (the `staging` branch, Firebase project `english-tutor-staging`; `docs/staging.md`), with a test parent account. Never use the owner's own card or a relative's card (Grow terms §11.2.7).

## 5. Sandbox test run (card 4580 4580 4580 4580)

| Case | Expect |
| :--- | :--- |
| Monthly checkout | Grow page shows card only. After paying: `subscriptions/{id}` active, entitlements on, `payments/grow_…`, קבלה emailed |
| Yearly checkout | Page shows card (Bit and wallets are real charges, skip them). Plan active for 12 months |
| Monthly renewal (ask Grow how to trigger one in the sandbox) | Plan linked to its standing order (`recurringRefs/grow_…`), `periodEnd` + 1 month |
| Failed charge | Plan and seats `past_due` |
| Cancel in the parent portal | Plan canceled, the owner dashboard shows "Cancel the standing order". Cancel it in Grow, press Done |
| Add a child to a monthly plan | Owner task "Change the standing order amount" with the new price |

**After each case, send Claude the Make run output and Grow's notice, with personal details blanked.**

**Grow's payment notice, as seen in the sandbox (2026-11-16):**
- It arrives **form-encoded** (`data[statusCode]=2`, …), not JSON as Grow's answer said. The server reads both, and the total `data[sum]` wins over each `data[productData][n][sum]`.
- `data`:
  - `statusCode` "2" (`status` "שולם"), `sum`, `transactionId`, `transactionToken`, `asmachta`;
  - `directDebitId` (the standing order) and also `recurringDebitId` (a different number);
  - `paymentLinkProcessId`/`Token`, `processId`/`Token`, `customFields[cField1]`, the payer's name and phone, and card details.
  - It also holds the business's `invoice_name` and `invoice_license_number`: keep notices out of logs.
- **Approve Transaction** takes `transactionId` and `transactionToken` (required), and `fullName`, `payerPhone` and `asmachta`.
- **Open question for Grow:** do renewal and failed-charge webhooks carry `directDebitId` or `recurringDebitId`? The plan is linked by `directDebitId`.

## 6. Launch
1. Copy the scenario onto the **live** connection, with a new webhook address and key, and set the Production env.
2. Create the two account webhooks in the live dashboard with the Production address.
3. Make one real low-price charge on a card that isn't the owner's or a relative's. Check the קבלה, then refund it in Grow.

## Owner's manual work
- The owner dashboard (`?owner`, Overview tab) lists open **Grow tasks**. The count turns red after a day, and the daily reconcile logs tasks open for more than two days.
- **Cancel the standing order:** do it before the date shown, or the parent is charged after cancelling.
- **Change the standing order amount:** set the new amount from the next charge.
- **Refund:** a charge after cancelling, or a child who already had Pro.
- **Unmatched Grow charge:** a renewal or failure we couldn't tie to a plan. Find the parent by phone in Grow.
- **Extend the standing order:** it has one charge left. In Grow's standing-orders area, add the number of charges the note says (the same as `GROW_MAKE_MAX_CHARGES`), before the date shown. Then press Done.
