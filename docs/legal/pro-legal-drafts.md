# EnglishVibe Pro: legal text drafts (for the owner's approval)

> **Status:** drafts written 2026-10-29 by the developer's assistant (Claude) from `docs/feature-pro-tier.md`. They are **not legal advice**. Before launch (Phase 4): the owner fills in the `[brackets]`, and a lawyer checks every item under "Questions for the legal review", especially the cancellation rules of the Consumer Protection Law and the Privacy Protection Law (Amendment 13).
>
> The texts are in Hebrew, as the app shows them. Parent copy is gender-neutral plural ("אפשר", "תוכלו"), like the rest of the parent portal.
>
> Where each text goes in the app:
> 1. **Terms of service:** a new "תנאי שימוש" dialog next to "פרטיות ומידע" (sign-in screen, settings, parent portal), and a link from the checkout.
> 2. **Privacy notice, payments section:** one more section in `SECTIONS` of `src/components/privacy/PrivacyNoticeDialog.tsx`.
> 3. **Checkout line and consent box:** in `ProCheckoutPanel`, above "המשך לתשלום". The button stays disabled until the box is ticked.

---

## 1. תנאי שימוש ומנוי EnglishVibe Pro

**עודכן לאחרונה:** [תאריך]

### 1. מי אנחנו
EnglishVibe ("האפליקציה") מופעלת על ידי [שם העסק], [עוסק פטור / עוסק מורשה] מספר [מספר], [כתובת] ("אנחנו"). אפשר לפנות אלינו בוואטסאפ [מספר העסק] או באימייל [כתובת אימייל בדומיין העסק].

### 2. השימוש באפליקציה
- האפליקציה מיועדת ללימוד אנגלית של ילדים ובני נוער בכיתות א׳–י״ב. רוב האפליקציה חינמית.
- חשבון של ילד/ה מתחת לגיל 18 נפתח ומשמש בהסכמת הורה או אפוטרופוס.
- אסור להשתמש באפליקציה כדי לפגוע באחרים, לעקוף את מנגנוני האבטחה שלה, או להעתיק את התוכן שלה לשימוש מסחרי.
- התוכן, העיצוב, הדמויות וההקלטות שייכים לנו או למי שהעניק לנו רישיון. השימוש בהם מותר ללימוד אישי בלבד.

### 3. מה כולל המנוי
מנוי EnglishVibe Pro ("המנוי") פותח לילד/ה שמחובר/ת אליו:
- את כל היחידות והבוסים בכל הכיתות, ואת חבילות התוכן שיצאו כחבילות Pro;
- הכנה מלאה למבחן, כולל מבחן תרגול ותעודה;
- עד 10 רשימות מילים פעילות מבית הספר;
- את כל ערכות העיצוב וכל הדמויות.

כל השאר נשאר חינמי גם בלי מנוי. אנחנו יכולים להוסיף תוכן ותכונות למנוי. אם נוריד ממנו משהו מהותי, נודיע על כך מראש בפורטל ההורים, ואפשר יהיה לבטל בלי חיוב נוסף.

### 4. מי משלם
- רק הורה שמחובר לילד/ה דרך פורטל ההורים, עם חשבון Google משלו, יכול לרכוש מנוי. הילדים לא רואים מחירים ולא משלמים.
- ההורה שמשלם מצהיר שמלאו לו 18.
- מנוי אחד מכסה בין ילד אחד ל-4 ילדים של אותו הורה. למשפחות עם יותר ילדים: אפשר לפנות אלינו בוואטסאפ.
- רק ההורה ששילם יכול לבטל או לשנות את המנוי. הורה נוסף שמחובר לאותו ילד יכול לראות שיש מנוי, אבל לא לשנות אותו.

### 5. מחירים
המחירים בשקלים[, כולל מע״מ]:

| ילדים | חודשי | שנתי |
| :--- | :--- | :--- |
| 1 | ₪39 | ₪349 |
| 2 | ₪64 | ₪569 |
| 3 | ₪89 | ₪799 |
| 4 | ₪114 | ₪999 |

- המחיר המלא מוצג לפני התשלום. שינוי מחיר יחול רק על חיובים שאחרי ההודעה עליו, ולא לפני שנודיע עליו בפורטל ההורים לפחות [30] יום מראש.
- מבצעים וקודי הנחה, כשיהיו, יחולו לפי התנאים שיוצגו איתם.

### 6. תשלום וחשבוניות
- התשלום נעשה בעמוד התשלום המאובטח של חברת Grow (משולם), בכרטיס אשראי, Bit, Apple Pay או Google Pay. פרטי הכרטיס לא מגיעים אלינו.
- [חשבונית מס / קבלה] נשלחת לכתובת האימייל שנמסרה בתשלום.

### 7. חידוש ותקופת המנוי
- **מנוי חודשי** מתחדש בכל חודש באופן אוטומטי ובאותו סכום, עד שמבטלים אותו. החיוב הבא מופיע בפורטל ההורים.
- **מנוי שנתי** משולם מראש לשנה ו**לא מתחדש מעצמו**. 14 יום לפני סופו יופיע בפורטל ההורים תאריך הסיום וכפתור לחידוש. חידוש בזמן ממשיך מתאריך הסיום, כך שלא הולך לאיבוד אף יום ששולם.
- אם חיוב חודשי נכשל (למשל כרטיס שפג תוקפו), חברת התשלומים תנסה שוב, וה-Pro נשאר פתוח עוד 3 ימים אחרי סוף התקופה. אם התשלום לא מצליח, המנוי מסתיים.

### 8. הוספה, הסרה והחלפה של ילדים
- **מנוי חודשי:** אפשר להוסיף ילד (עד 4) או להסיר ילד בכל עת מפורטל ההורים. הילד שנוסף מקבל Pro מיד, והמחיר החדש חל מהחיוב הבא.
- **מנוי שנתי:** אפשר למלא רק מקומות שכבר שולמו. כדי להוסיף מעבר להם, פותחים מנוי נוסף.
- ילד שהוסר נשאר עם Pro עד סוף התקופה הנוכחית, אבל לא יותר מחודש.
- החלפת ילד (הסרה של ילד והכנסה של אחר במקומו) אפשרית פעם ב-30 יום.

### 9. ביטול והחזרים
- **ביטול מנוי חודשי:** בכל עת, בלחיצה אחת בפורטל ההורים, באותה דרך שבה נרשמתם, או בהודעה אלינו בוואטסאפ או באימייל. לא יהיו חיובים נוספים, וה-Pro נשאר פתוח עד סוף החודש ששולם.
- **ביטול בתוך 14 יום מהתשלום הראשון:** אפשר לבטל ולקבל החזר מלא של התשלום הראשון[, בניכוי דמי ביטול של עד 5% או ₪100, הנמוך מביניהם]. [ניסוח סופי לפי הבדיקה המשפטית, ראו שאלות 1–2.]
- **ביטול מנוי שנתי** אחרי 14 הימים הראשונים: נחזיר את החלק היחסי של החודשים המלאים שנותרו[, בניכוי …]. [ניסוח סופי לפי הבדיקה המשפטית, ראו שאלה 3.]
- ההחזר מועבר לאמצעי התשלום שבו שילמתם, בתוך 14 יום מבקשת הביטול.
- אם ילד קיבל Pro בשתי תוכניות בטעות (למשל שני הורים ששילמו בו זמנית), נבטל את הכפילות ונחזיר את ההפרש.
- למחוק את חשבון הילד/ה זה לא כמו לבטל את המנוי: אם הילד האחרון במנוי חודשי נמחק, נבטל את המנוי בתוך יום אחד.

### 10. הפסקה או שינוי של השירות
- אם האפליקציה לא תהיה זמינה לתקופה ממושכת באשמתנו, או אם נפסיק את המנוי, נחזיר את החלק היחסי של מה ששולם על התקופה שלא ניתנה.
- אנחנו יכולים לחסום חשבון שמשמש לעקיפת התשלום או לפגיעה בשירות, ובמקרה כזה לא יינתן החזר על התקופה שאחרי החסימה.

### 11. אחריות
האפליקציה ניתנת כמו שהיא. אנחנו עושים כל מאמץ שהתוכן יהיה נכון והשירות זמין, אבל לא מתחייבים לציון מסוים במבחן או לזמינות רציפה. אחריותנו מוגבלת לסכום ששולם על המנוי ב-12 החודשים האחרונים, ככל שהדין מאפשר.

### 12. פרטיות
המידע שנשמר ואיך מוחקים אותו מוסבר ב"פרטיות ומידע".

### 13. שינויים בתנאים
שינוי מהותי בתנאים יוצג בפורטל ההורים לפחות [30] יום לפני שיחול, ואפשר יהיה לבטל לפני כן בלי חיוב נוסף.

### 14. דין וסמכות
על התנאים חלים דיני מדינת ישראל. הסמכות הבלעדית נתונה לבתי המשפט המוסמכים ב[עיר].

---

## 2. פרטיות ומידע: סעיף תשלומים

To add to `SECTIONS` in `PrivacyNoticeDialog.tsx`, after "מה הורים רואים":

```ts
{
  titleHe: 'תשלום על Pro',
  bodyHe: [
    'רק הורה מחובר יכול לשלם על Pro. התשלום נעשה בעמוד המאובטח של חברת Grow (משולם), ופרטי הכרטיס או ה-Bit לא מגיעים אלינו.',
    'אנחנו שומרים את מצב המנוי (פעיל, מבוטל, עד מתי), איזה חשבון הורה משלם, אילו ילדים במנוי, הסכומים ומספרי האישור של חברת התשלומים.',
    'השם, הטלפון והאימייל שנמסרים בתשלום עוברים ישירות ל-Grow, לצורך התשלום והחשבונית, ולא נשמרים אצלנו.',
    'רשומות התשלום נשמרות כפי שחוקי המס דורשים (בדרך כלל 7 שנים), עם מזהה החשבון בלבד, גם אחרי מחיקת החשבון.',
  ],
},
```

Also:
- The "מה נשמר" section: add "מצב המנוי ל-Pro, אם יש" to its first line.
- `PRIVACY_CONTACT_EMAIL` (`config/appInfo.ts`) moves to the business domain address before launch.

---

## 3. מסך התשלום: שורת תנאים ותיבת הסכמה

Above "המשך לתשלום" in `ProCheckoutPanel`, after the price:

> **שורת תנאים** (`text-xs`, under the total):
> - חודשי: "₪{סכום} לחודש, מתחדש כל חודש עד שמבטלים. אפשר לבטל בכל עת כאן בפורטל."
> - שנתי: "₪{סכום} לשנה, תשלום אחד. לא מתחדש מעצמו."

> **תיבת הסכמה** (required, unticked by default):
> "קראתי ואני מסכים/ה ל[תנאי השימוש והמנוי] ול[מדיניות הפרטיות], ואני מעל גיל 18."

Both links open the dialogs. The server records the consent with the checkout (`termsVersion`, `acceptedAt`), so it can be shown later.

---

## 4. Questions for the legal review

1. **Cancellation within 14 days (סעיף 14ג לחוק הגנת הצרכן, עסקת מכר מרחוק):** does it apply to a digital service that starts at once? May a cancellation fee (5% or ₪100) be charged, or is a full refund better for trust and simpler? The draft leaves the fee in brackets.
2. **Monthly plans as a continuing transaction (סעיף 13ד):** is "cancel any time, Pro until the end of the paid month, no refund for that month" enough, or must cancellation take effect within 3 business days with a pro-rated refund?
3. **Yearly plans:** a pro-rated refund of the remaining full months after 14 days: is that required, and how is the fee worked out?
4. **Notice of a price change and of changes to the terms:** is 30 days in the parent portal enough, or does it need email too? (The app has no email channel yet.)
5. **Privacy Protection Law, Amendment 13 (2025):** does a children's app with paying parents need a privacy officer, a registered database, or a written security procedure (תקנות אבטחת מידע)? Is Firebase in Europe acceptable as is?
6. **Children's consent:** is the parent's declaration at checkout, together with the existing parent pairing, enough consent for a minor's account?
7. **VAT:** עוסק פטור or מורשה decides whether "כולל מע״מ" is written, and which document Grow issues (קבלה or חשבונית מס/קבלה).
8. **Limitation of liability (section 11):** can it be enforced against consumers as written?

---

## 5. Changes in the app before launch (Phase 4)

- A `TermsDialog` (same shell as `PrivacyNoticeDialog`) with section 1 above, linked from the sign-in screen, the settings, the parent portal and the checkout.
- The payments section in `PrivacyNoticeDialog`.
- The terms line and the consent box in `ProCheckoutPanel`, with `api/checkout.ts` requiring `acceptedTerms: true` and saving `termsVersion` and `acceptedAt` on the checkout.
- The business details (name, number, address, WhatsApp, email) in `config/appInfo.ts`.
