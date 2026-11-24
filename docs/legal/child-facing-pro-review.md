# Child-facing Pro wording: legal review (2026-11-20)

A review by Claude, standing in for a lawyer's review, which the owner chose not to do for now. It is not legal advice. It checks what a learner (a minor) sees about Pro against the rules below, and records the verdict and any remaining risk for each item.

## The rules applied

**Consumer Protection regulations on advertising and marketing aimed at minors (1991)** (תקנות הגנת הצרכן (פרסומת ודרכי שיווק המכוונים לקטינים), תשנ"א-1991). A minor is anyone under 18, and "marketing methods" covers any approach, direct or indirect. Paraphrased:
- s.2: information must be clear and accurate. Price rules apply when a price is shown.
- s.3(1): no exploiting a minor's imagination, trust, naivety or inexperience.
- s.3(2): no frightening a minor or creating tension.
- s.3(4): no encouraging a minor to buy.
- s.3(5): no encouraging a minor to persuade their parents or others to buy.
- s.3(6): no making a minor feel deprived, inferior or not accepted without the product.
- s.3(7): no claiming the product gives abilities it doesn't.
- s.7א: no using a minor's personal details (name, address, email, phone) without a parent's consent, except to deliver the service.

**Also considered:**
- The Legal Capacity and Guardianship Law (1962): a minor's own transactions need a parent's consent.
- The Consumer Protection Law's rules on free periods that turn into a paid deal.
- The Privacy Protection Authority's guidance against design that improperly pushes a person to consent.

## Verdicts

| # | What the learner sees | Where | Verdict |
|---|---|---|---|
| 1 | Parents' info sheet: "תוכן במסלול המלא — מידע להורים", "החלק הזה כלול במסלול Pro. אפשר להמשיך לתרגל בחלקים הפתוחים, והורים יכולים להיכנס לאזור ההורים למידע נוסף." | `ParentInfoSheet.tsx` | **OK.** A factual statement with no perks, price, urgency or ask. It tells the child they can keep practising (s.3(6)). |
| 2 | Sheet button "שיתוף קישור לאזור ההורים" and the shared message "קישור לאזור ההורים ב-EnglishVibe (דוח שבועי ומידע על המסלול המלא): {url}" | `ParentInfoSheet.tsx`, `proAsk.ts` | **OK, with a small remaining risk.** See note A. |
| 3 | "המשימה הזו כלולה במסלול Pro. מידע להורים באזור ההורים." plus "לאזור ההורים" | `MissionSheet.tsx` | **OK.** A neutral fact. |
| 4 | "סיימת את כל המשימות החינמיות! 🎉 / היחידות הבאות כלולות במסלול Pro. מידע להורים באזור ההורים." | `FreeMissionsDoneCard.tsx` | **OK.** The praise is for the child's achievement, not for the product. |
| 5 | Word lists: "עוד רשימות כלולות במסלול Pro (מידע להורים)" | `WordListsCard.tsx` | **OK.** |
| 6 | Theme preview: "👑 תצוגה מקדימה" showing the map in a Pro theme, then "ערכת העיצוב הזו כלולה במסלול Pro" | `ThemePreviewSheet.tsx` | **OK, with a remaining risk.** See note B. |
| 7 | New Pro pack card: "יחידה חדשה נוספה למפה. היא כלולה במסלול Pro. מידע להורים באזור ההורים." | `contentPacks.ts` | **OK.** |
| 8 | 👑 Pro badges on map stops and exam days | `MapStops.tsx`, `ExamPrepPlanView.tsx` | **OK.** These are labels. Showing which parts are locked is information, not an inducement. |
| 9 | Pro week: "יש לך Pro לשבוע, במתנה מההורים. (עד …)" | `ProWeekCards.tsx` | **OK.** True, since the parent started it. It has no countdown, no "only N days left" and no offer. |
| 10 | After the Pro week: "שבוע ה-Pro הסתיים. כל ההתקדמות שלך נשמרה, והיחידות החינמיות ממשיכות כרגיל." | `ProWeekCards.tsx` | **OK.** It reassures the child rather than stressing the loss (s.3(2), s.3(6)), and has no ask and no upsell. |
| 11 | No prices anywhere in the learner app | all | **OK.** The s.2 price rules don't come into play. |
| 12 | The free week itself | `api/_lib/proTrial.ts` | **OK.** The parent starts it, with no payment details, no commitment and nothing that turns into a charge. The child makes no transaction (Legal Capacity Law), and the free-period-to-paid rules don't apply. |

**Note A (the shared link):**
- What it does: the link opens the parent area with `pro=1`, which scrolls to the plans with this child ticked.
- Why it's fine: the child is asked only to share a link to the parent area. The child isn't told to persuade anyone, and the message is information, not the child's voice. All selling happens on the parent's screen, which is allowed.
- The remaining argument: the child acts as the channel to a page that opens on the plans.
- How to remove it, if wanted: drop `&pro=1` from links the child shares, so the parent lands on the parent area's normal view (the plans are still there, lower down). The cost is losing the funnel's `parent_pro_link_open` count and the automatic scroll.
- **Recommendation:** keep the link as it is. The regulation targets urging the child, which this no longer does.

**Note B (theme preview):**
- Showing a child how their map would look in a paid theme is closer to advertising than any other item here.
- It's acceptable because the child taps to preview on their own, nothing tells them to buy or ask, and the wording is factual.
- **Recommendation:** keep it. Revisit only if a regulator's guidance on in-app previews for children appears.

## Outside Pro, worth knowing

- **Diamond reward for daily reminders.** `FirstWinScreen.tsx` offers "מתנה: N יהלומים 💎" for turning on the daily reminder. The text is addressed "להורים:", but the reward goes to the child. The Privacy Protection Authority warns against design that improperly influences consent, and here a reward is tied to a notifications permission. Risk: low to medium.
  - Option: keep the reminder offer and drop the diamond reward, or give the reward for the next practice day instead of for the permission.
  - **Resolved (2026-11-20):** the reminder asks no longer offer diamonds; they say only that a daily reminder helps keep the streak. The 10 💎 are now paid once for practising 3 days in a row (`data/streakReward.ts`), whether reminders are on or not, and the goal is shown on the streak panel, not next to the reminder switch. The reward pays for practice, not for a permission.
- **The reminder ask spoken to the child (2026-11-23).** The daily-reminder asks (the first-win screen and later asks all open the full-screen `ReminderAskScreen`; the iPhone install guide) now speak to the child ("רוצה שאזכיר לך מחר?") instead of "להורים:". At the owner's request the screen is short: a title, one line on the benefit ("תזכורת קטנה כל יום עוזרת ללמוד טוב יותר ולשמור על הרצף": a soft, true claim, not a promise of results, so it stays honest under the Consumer Protection Law and the 1991 regulations, and it offers no reward), a yes button, and a "לא עכשיו" text link. How to turn it off is not on the ask itself; it is a switch in the settings, where it was turned on, and the notification links back to the app. Checked against the same rules:
  - **Privacy (Amendment 13):** no new data leaves the device. The push subscription and send times are already in the privacy notice; the two new profile fields (`reminderAskCount`, `reminderLastAskedAtStr`) are app state. The browser permission is a device setting; the data use rests on the parent's consent at sign-up. Risk: low. The owner decided on 2026-11-23 that no lawyer review is needed for asking the child directly.
  - **Spam Law §30A:** covers advertising messages. A streak reminder with no commercial content is a service message. Kept that way by a guard test (`data/reminderMessage.test.ts` fails on Pro, price or offer words). A marketing push would need its own explicit consent and an opt-out in every message.
  - **1991 regulations and dark patterns:** not marketing; no gift for the permission; no guilt wording; X and Escape close it; at most 3 asks ever, never two on one day; the native prompt only after the child taps yes. "לא עכשיו" is a text link, smaller than the yes button (the owner's choice, a common pattern). It stays readable (14px, underlined, normal contrast) with a 44px tap area, so the way out is plain to see. Risk: low. The Privacy Protection Authority's dark-patterns guidance prefers equal weight for yes and no; the owner accepted the visible link without a lawyer review (2026-11-23).
- **The earned victory surprise and the contest reminder (2026-11-24, retention audit).** About one finished mission in five pays a 10-30 💎 bonus ("🎁 הפתעה!", `data/victorySurprise.ts`), and the daily reminder can say a friend's contest waits for the child's turn. Checked:
  - **Chance-based reward (loot-box concern):** the surprise is never bought, never sold and never shown in advance. It comes only with a full prize for practice (no replay farming) and at most once a day. Diamonds can't be bought or cashed out, so nothing of value is staked or won. It is not gambling and not a dark pattern under the 1991 regulations. Risk: low.
  - **Consumer Protection (honest marketing):** nothing promises a surprise or links it to Pro, so no claim can mislead.
  - **Privacy (Amendment 13):** the surprise adds a counter (`dailyCounters.surprisesToday`) to the progress the app already keeps. The contest reminder reads contests the server already holds and never names the friend, because a lock screen shows it. The privacy notice says so (`PRIVACY_VERSION` 2026-11-24). Risk: low.
  - **Spam Law §30A:** the contest line is a service message with no commercial content; the guard test in `data/reminderMessage.test.ts` covers it too.
- **"Show off to your parents" bonus (`showOff.ts`, 20 diamonds) and the first-win "שלחו להורים מה עשיתם היום!".** These reward the child for sharing progress, not for buying, and the link carries no `pro=1`. **OK** under s.3(4) and s.3(5).
- **Friend-invite rewards (planned, "after launch").** Rewarding a child for bringing in other children is marketing through minors. If such a reward is ever tied to Pro or a purchase, it falls under s.3(4) and s.3(5). **Recommendation:** give such rewards only for free activity, never for a purchase, and with no Pro in the invite message.

## Conclusion

The child-facing Pro wording as of commit 82d1134a meets the 1991 regulations as read here. The Pro week is legal as built. The one change recommended outside Pro, the diamond reward for turning on reminders, is done: the reward now pays for a 3-day streak instead. A guard test (`src/data/proAsk.test.ts`) fails the build if "לבקש מהורה", "לשדרג" or "לקנות" comes back into the child-facing Pro files.
