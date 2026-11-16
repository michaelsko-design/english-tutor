# EnglishVibe: marketing strategy, free first, then paid ads

Written 2026-11-16. Covers the soft launch (early December 2026) through the public launch (mid-January 2027).
The ad briefs, one agent prompt per ad, are in `marketing/ad-briefs.md`.

All cost figures below are planning estimates for the Israeli market, not measured numbers. The free steps and the first small paid step exist to replace them with real ones.

## 1. Recommendation in short

- **Start free, and pay only for what already worked for free.** Section 5 is a ladder of six steps: the first three cost nothing, the fourth costs ₪300–500 in total, and each step opens only when the one before passes its gate.
- **About ₪2,000 is the most you spend before Pro revenue exists.** After that, ad spend is capped at half of last month's Pro revenue.
- **When you do pay, start on Meta (Facebook + Instagram)**, then add a small Google Search campaign.
- **Target parents, not children.** The parent pays, and ad platforms restrict targeting of under-18s anyway.
- **Prepare 3 creatives first, not 6:** ad 1 (exists), ad 2 (school word list) and ad 3 (the price still). Post them for free; the one parents respond to becomes the first paid ad. Ads 4–6 and the Google text ads wait for step 5.
- **Do not expect ads to pay for themselves at first.** See section 2. The WhatsApp class loop and friend contests in `englishvibe-presentation-and-launch.html` stay the main engine; ads add fuel to it.

## 2. The economics, honestly

| Item | Value | Source |
|---|---|---|
| Price | ₪39 / month, ₪349 / year, per first child | `src/config/proTier.ts` |
| Revenue from a paying family | roughly ₪150–350 | assumes 4–6 months monthly, or one yearly payment |
| Free → paid conversion | 3–5% | usual range for freemium learning apps; yours is unknown |
| So one free sign-up is worth | about ₪5–15 | revenue × conversion |
| Likely cost per free sign-up from ads | ₪10–30 | estimate; depends on creative |

A sign-up will probably cost more than it earns back directly. Paid ads make sense for EnglishVibe in three cases:

1. Each family that joins brings others (class WhatsApp groups, friend contests). If one paid family brings one more, the cost per family halves.
2. Free → paid conversion turns out higher than 5%. Exam periods are the best chance of that.
3. You are buying learning, not profit: which message, which grade band, which audience. The free steps in section 5 buy most of that for nothing.

Payments are not live in production yet (`IS_PRO_GATING_ON` is false, the Pro plans show only on staging). Until they are, the test can measure sign-ups and first missions only, not purchases. That is fine for the soft launch; the main spend should wait until a parent can actually pay.

## 3. Why Meta first, Google second

| | Meta (Facebook + Instagram) | Google Search |
|---|---|---|
| What it does | Shows the app to parents who were not looking for it | Catches parents already searching |
| Fit | Strong: the product is visual and game-like, video sells it | Good intent, but small search volume in Hebrew |
| Cost per click (estimate) | ₪1–3 | ₪2–6 |
| Role | Main channel, creative testing | Small, steady, high-intent |

Skip for now: TikTok (audience is the children, who cannot pay), YouTube and Performance Max (need more budget and conversion data than you have), display banners.

## 4. Setup before spending anything

1. **Tracking tags already exist.** Every ad link uses `?src=ad&c=<campaign>`; the owner dashboard's Funnel tab then shows sign-ups per ad. The campaign value is lower-case letters, digits and dashes, 24 characters at most (`src/config/marketingSources.ts`).
2. **Ads and shared links open the landing page:** `https://englishvibe.co.il/home/?src=ad&c=…`. The page keeps the tag (`src/site/keepSourceTag.ts`, added 2026-11-16), so the sign-up is counted under the ad and not under `landing`. This works once that change is deployed.
3. **No ad pixel is installed** (no Meta Pixel or Google tag in the site, and the CSP in `vercel.json` would block them). Two options:
   - **Start without a pixel:** optimise Meta for landing-page views and judge the ads by sign-ups in your own Funnel tab. Simple, private, good enough for steps 3 and 4.
   - **Add a pixel to the landing page only** (never inside the child's app): Meta then optimises for the people who press "מתחילים חינם". Better delivery, but it needs a CSP change, a line in the privacy notice, and belongs in the lawyer review that is already pending.
   My recommendation: start without, add the landing-only pixel only when you reach step 5.
4. **Accounts:** a Meta Business account with a Facebook page and Instagram profile for EnglishVibe, and a Google Ads account. Both ask for a payment card and business details; those steps are yours to do.
5. **The access gate must be open for ad traffic.** While the app is in the closed tester phase (`config/access.open` false), a parent arriving from an ad cannot get in. Ads start only once the soft-launch access is open to them.

## 5. Budget and timeline

A ladder. Move up one step only when the gate of the current step is met; if it is not, fix the product or the message and stay where you are. Dates are a guide, the gates decide.

| Step | When | Cost | What you do | Gate to the next step |
|---|---|---|---|---|
| 0. Foundations | now – soft launch | ₪0 | Tag forwarding fixed (4.2); Facebook page and Instagram profile; Google Search Console on the landing page; ads 1–3 made | All done |
| 1. Invited families | soft launch, weeks 1–3 | ₪0 | The 200 invited families, the WhatsApp templates, private tutors | 100 sign-ups; 60% finish the first mission; 25% still play after 7 days |
| 2. Free public reach | weeks 3–6 | ₪0 | Parent groups, short videos, teachers, QR flyers (details below) | 300 sign-ups in total, and one post that clearly beats the others |
| 3. Boost the winner | weeks 6–7 | ₪300–500 in total | Put ₪25–30 a day behind the best post from step 2, on Meta, for 10–14 days | Cost per sign-up under ₪20 |
| 4. Small steady ads | from the public launch, payments live | ₪1,000–1,500 a month | Meta ₪30 a day: one ad set, three creatives. Google Search ₪15 a day: exact-match test and tutor keywords only | Cost per paying family under ₪150, measured over 4 weeks |
| 5. Reinvest | after step 4 passes | half of last month's Pro revenue | The full two-ad-set test in section 7, ads 4–6, the Google ad groups | Keeps going only while cost per paying family stays under ₪150 |

Worst case, if every paid step fails its gate, you have spent about ₪2,000 and learned which message works.

### The free steps in detail

Every link carries its own tag, so the Funnel tab shows which free channel works: `wa-parents`, `wa-teachers`, `wa-students`, `fb`, `ig`, `tiktok`, `qr`.

**Step 1: people who already trust you.**
- Send the invited families the WhatsApp templates already written in `englishvibe-presentation-and-launch.html`, on Tuesday or Wednesday, before the weekly dictation.
- Write personally to 10 private English tutors. Offer the school word-list tool for their pupils. A tutor who likes it brings every pupil.
- Ask each family for one thing: share it in the class parents' group if the child enjoyed it. Ask a few for a one-line quote with permission to use it; real quotes are what the paid ads lack today.
- The friend contest and "show your parents" bonus already do the child-to-child and child-to-parent sharing. Check in the Funnel tab that they bring sign-ups.

**Step 2: strangers, still free.**
- **Facebook parent groups.** Read each group's rules first; many forbid promotion. Ask the admin, say openly that you built the app, and post something useful rather than an advert, for example how to turn the weekly word list into a game. One good post in a large group can bring more than a week of paid ads.
- **Short videos, two a week,** on Instagram Reels, Facebook, TikTok and YouTube Shorts: the same file on all four. Use ads 1 and 2 and simple screen recordings of one game each. This is a free creative test: note views and link clicks per video.
- **School English teachers and coordinators.** A free tool for the whole class reaches 30 families at once. Start with teachers you or the invited parents know.
- **QR flyers** for tutors, after-school centres and library boards, with `?src=qr`.
- **Search, slowly.** Register the landing page in Google Search Console and check it appears for the app's name. Ranking for wider searches takes months; do not count on it for the launch.

Low-cost rules for the paid steps:
- In step 3 use the post that already won for free. Do not pay to find out whether a message works; step 2 answers that for nothing.
- Use Ads Manager with a traffic or landing-page-view goal, not the "Boost post" button, which optimises for likes.
- One ad set only until step 5. At ₪30 a day a second ad set starves both.
- A new Google Ads account is sometimes offered starting credit; check when you open the account, and do not plan on it.

Rules while running (all paid steps):
- Leave a new ad set alone for 5–7 days. Meta needs that long to settle; daily changes reset it.
- Raise a budget by at most 20–30% every few days.
- Weekly: pause the two weakest creatives, add one new variation of the strongest.
- The launch coupon is automatic and date-limited (decided 2026-11-14). When it exists, the January ads should name its end date; that is the only urgency the ads should use.

## 6. What to measure, and when to stop or scale

Read these from the Funnel tab (per `c=` value) next to the spend in Meta / Google.

| Number | Good | Stop or fix |
|---|---|---|
| Click-through rate (Meta) | above 1% | below 0.5% after ₪150 spent on that ad: pause it |
| Cost per sign-up | under ₪15 | above ₪35 after 2 weeks: the message or page is wrong |
| Sign-up → first mission finished | above 60% | below 40%: onboarding problem, not an ad problem |
| Parent pairing (parent linked) | above 25% of sign-ups | low: no one to sell Pro to |
| Still playing after 7 days | above 25% | below 15%: do not scale, the product leaks |
| Sign-ups that came from an ad family's invite | any | this is what makes ads affordable; track it |

These are the numbers behind the gates in section 5. Before payments are live, judge by cost per sign-up (under about ₪20) and 7-day retention. Once payments are live, the real test replaces both: cost per paying family under about ₪150.

## 7. Target audiences

Everyone: Israel, Hebrew-speaking, parents. Steps 3 and 4 use ad set A only. From step 5 the Meta test uses **one campaign with two ad sets**, and the six creatives do the segmenting (each speaks to a different parent).

**Meta ad set A: broad parents.** Age 28–52, Israel, language Hebrew, no interests. Meta finds the buyers from who responds to which creative. This usually wins.

**Meta ad set B: parent signals.** Same age and place, plus Meta's parent categories (parents with early school-age children, with preteens, with teenagers) and interests such as education, private tutoring, learning English.

The parents the creatives speak to:

| Segment | Who | What they worry about | Creative |
|---|---|---|---|
| 1. Elementary parents (grades 3–6) | 32–45, the largest group | Screen time wasted; child says English is boring | 1, 3 |
| 2. "Test on Thursday" parents (grades 3–9) | 32–48 | Dictation and vocabulary tests, nagging the child to practise | 2 |
| 3. Tutor-fatigue parents (grades 5–10) | 35–50 | ₪120–180 per private lesson; gaps opening up | 3 |
| 4. Careful parents | any | Safety, ads, strangers, not knowing what the child did | 4 |
| 5. Exam and Bagrut parents (grades 9–12) | 40–55 | Marks, Bagrut units; the teen thinks kids' apps are babyish | 5 |
| 6. First and second grade parents | 30–42 | Child cannot read yet; wants a head start | 6 |

Later (step 5): a retargeting ad set for people who visited the landing page and did not start (needs the pixel), and a lookalike audience built from parents who linked an account.

**Google Search**, one campaign, exact and phrase match, Hebrew, Israel:
- App intent: אפליקציה ללימוד אנגלית לילדים, לימוד אנגלית לילדים, אנגלית לכיתה ג (and the other grades), משחקים באנגלית לילדים
- Test intent: תרגול למבחן באנגלית, הכתבה באנגלית, אוצר מילים באנגלית כיתה ה
- Tutor intent: מורה פרטי לאנגלית, שיעורים פרטיים באנגלית מחיר
- Bagrut intent: הכנה לבגרות באנגלית, תרגול בגרות באנגלית
- Negative keywords: למבוגרים, קורס, תרגום, חינם להורדה, עבודה, wall street, duolingo (competitor clicks are costly and convert badly)

## 8. Rules every ad must follow

- **Only claims the app backs.** The curriculum line is "בנוי על נושאי הלימוד וסדר הדקדוק של משרד החינוך", never "תואם את תוכנית הלימודים" (see the note in `marketing/ad/adVoBatch.ts`). No promised marks, no "guaranteed".
- **No invented testimonials, parents, children or numbers.** No "thousands of families". Real quotes only, with permission, once testers give them.
- **The free line as written:** "מתחילים חינם, ללא צורך בכרטיס אשראי".
- **Real app screens**, not mock-ups (`npm run site:screens` recaptures them). Show a grown-up theme (Urban Night, Kai) in anything aimed at grade 7 and up.
- **Prices as on the site:** ₪39 לחודש / ₪349 לשנה, per first child. One price for everyone; no private discounts.
- **Hebrew addresses parents in the plural** ("הילדים שלכם"). English inside Hebrew text is isolated left-to-right.
- **Sound off by default:** every video works with captions alone. The first 2 seconds must stop the scroll.

## 9. Open decisions for you

1. Decided 2026-11-16: ads open the landing page, which keeps the tag (section 4.2).
2. Pixel on the landing page: now, in January, or never (section 4.3)?
3. Is about ₪2,000 before revenue, then half of last month's Pro revenue, the right ceiling for you?
