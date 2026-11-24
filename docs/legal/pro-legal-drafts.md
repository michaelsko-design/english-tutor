# EnglishVibe Pro: legal text drafts (for the owner's approval)

> **Status:** drafts written 2026-10-29 by the developer's assistant (Claude) from `docs/feature-pro-tier.md`. They are **not legal advice**. Section 1 (the terms) was rewritten on 2026-11-19 from the legal audit (`docs/legal/legal-audit-implementation-plan.md`), with the owner's decisions on the open questions (section 4) and conservative Israeli-law defaults, because the soft launch goes ahead without a lawyer's sign-off. A lawyer's review is still welcome later; their changes go into this file.
>
> The texts are in Hebrew, as the app shows them. Parent copy is gender-neutral plural ("אפשר", "תוכלו"), like the rest of the parent portal.
>
> Where each text goes in the app:
> 1. **Terms of service:** a new "תנאי שימוש" dialog next to "פרטיות ומידע" (sign-in screen, settings, parent portal), and a link from the checkout.
> 2. **Privacy notice, payments section:** one more section in `SECTIONS` of `src/components/privacy/PrivacyNoticeDialog.tsx`.
> 3. **Checkout line and consent box:** in `ProCheckoutPanel`, above "המשך לתשלום". The button stays disabled until the box is ticked.

---

## 1. תנאי שימוש ומנוי EnglishVibe Pro

**עודכן לאחרונה:** 20 בנובמבר 2026

### 1. מי אנחנו
EnglishVibe ("האפליקציה") מופעלת על ידי מיכאל שקולניק, בעל העסק "SHK טכנולוגיות", עוסק פטור מס׳ 310720370, מרחוב החיטה 323, מאור ("אנחנו").

אפשר לפנות אלינו באימייל support@englishvibe.co.il או בטלפון 055-2903310. אנחנו עונים לכל פנייה בתוך 3 ימי עסקים (ימים א׳–ה׳, בין השעות 09:00–17:00, לא כולל שבתות וחגי ישראל), ובדרך כלל מוקדם יותר.

### 2. השימוש באפליקציה
- האפליקציה והשירות מיועדים לתושבי מדינת ישראל בלבד, ללימוד אנגלית בכיתות א׳–י״ב. רוב האפליקציה חינמית.
- קטין/ה מתחת לגיל 18 פותח/ת חשבון ומשתמש/ת באפליקציה בידיעת ההורים או האפוטרופוסים ובהסכמתם. מתחת לגיל 13 (כיתות א׳–ז׳) ההורה או האפוטרופוס מאשרים בעת ההרשמה שקראו והסכימו לתנאים אלה ולמדיניות הפרטיות. מגיל 13 (כיתות ח׳–י״ב) הלומד/ת מאשרים שקראו והסכימו להם בידיעת ההורים ובהסכמתם.
- אסור להשתמש באפליקציה כדי לפגוע באחרים, לבחור שם משתמש או שם תצוגה פוגעני, לעקוף את מנגנוני האבטחה או התשלום שלה, או להעתיק את התוכן שלה לשימוש מסחרי.
- התוכן, העיצוב, הדמויות וההקלטות שייכים לנו או למי שהעניק לנו רישיון. השימוש בהם מותר ללימוד אישי בלבד.
- תוכן שאתם מזינים לאפליקציה (כגון רשימות מילים, משפטים להקראה, מדבקות שציירתם או יומן החלומות) נשאר שלכם. אתם מעניקים לנו רישיון מוגבל לשמור, להציג ולהקריא אותו לצורך הפעלת השירות בלבד. אין להזין תוכן פוגעני, בלתי חוקי או המפר זכויות של אחרים, וכדאי לא להזין בו פרטים מזהים כמו שם משפחה, טלפון או כתובת.
- EnglishVibe היא יוזמה פרטית. היא לא קשורה למשרד החינוך, לא מופעלת מטעמו ולא באה במקום הלימודים בבית הספר. התוכן מותאם לתוכנית הלימודים, בלי שיוך או חסות של המשרד.

### 3. מה כולל המנוי
מנוי EnglishVibe Pro ("המנוי") פותח לילד/ה שמחובר/ת אליו:
- את כל היחידות והבוסים בכל הכיתות, ואת חבילות התוכן שיצאו כחבילות Pro;
- הכנה מלאה למבחן, כולל מבחן תרגול ותעודה;
- עד 10 רשימות מילים פעילות מבית הספר;
- את כל ערכות העיצוב וכל הדמויות.

פריטי החנות באפליקציה (פריטי החדר, הבגדים, המדבקות וכרטיס הסטודיו) נקנים ביהלומים שצוברים בלמידה. המנוי לא פותח אותם אוטומטית ולא מעניק יהלומים.

המנוי נפתח מיד כשהתשלום מאושר, ולכל המאוחר בתוך 24 שעות. אם הוא לא נפתח עד אז, כתבו לנו ונטפל בזה.

כל השאר נשאר חינמי גם בלי מנוי. אנחנו יכולים להוסיף תוכן ותכונות למנוי. אם נוריד ממנו מרכיב מהותי, נודיע על כך לפחות 30 יום מראש באימייל שנמסר בתשלום ובפורטל ההורים. מנוי חודשי אפשר יהיה לבטל לפני השינוי בלי חיוב נוסף, ומנוי שנתי אפשר יהיה לבטל ולקבל החזר יחסי מלא על החודשים שנותרו.

### 4. מי משלם
- רק הורה שמחובר לילד/ה דרך פורטל ההורים, עם חשבון Google משלו, יכול לרכוש מנוי. הילדים לא רואים מחירים ולא משלמים.
- הרכישה מותרת רק למי שמלאו לו 18. ההורה שמשלם מצהיר/ה על כך בעמוד התשלום.
- מנוי אחד מכסה בין ילד אחד ל-4 ילדים של אותו הורה. למשפחות עם יותר ילדים: אפשר לפנות אלינו באימייל support@englishvibe.co.il.
- רק ההורה ששילם/ה יכול/ה לבטל או לשנות את המנוי. הורה נוסף שמחובר לאותו ילד יכול לראות שיש מנוי, אבל לא לשנות אותו.
- ניתוק הקישור בין חשבון ההורה לחשבון הילד/ה מפסיק את הדוח השבועי, אבל לא מבטל את המנוי ולא את החיובים. ביטול נעשה כמוסבר בסעיף 9.

### 5. מחירים
המחירים בשקלים. העסק הוא עוסק פטור, ולכן המחירים פטורים ממע״מ והסכום המוצג הוא הסכום הסופי לתשלום:

| ילדים | חודשי | שנתי |
| :--- | :--- | :--- |
| 1 | ₪39 | ₪349 |
| 2 | ₪64 | ₪569 |
| 3 | ₪89 | ₪799 |
| 4 | ₪114 | ₪999 |

- המחיר המלא מוצג לפני התשלום.
- שינוי מחיר של מנוי חודשי קיים יחול רק על חיובים שמועדם לפחות 30 יום אחרי שנשלחה עליו הודעה ישירה לאימייל שנמסר בתשלום (וגם הודעה בפורטל ההורים). אפשר לבטל לפני שהשינוי נכנס לתוקף, בלי חיוב נוסף.
- מבצעים ותקופות הטבה (למשל חודש ראשון במחיר מוזל): לפני התשלום יוצגו במפורש המחיר המוזל, משך ההטבה, והמחיר הרגיל שיחול אחריה אוטומטית אם המנוי לא יבוטל קודם. לפני המעבר למחיר הרגיל תישלח הודעה כפי שהדין דורש.

### 6. תשלום וקבלות
- התשלום נעשה בעמוד התשלום המאובטח של גרואו פיימנטס בע״מ (Grow, לשעבר משולם). פרטי הכרטיס לא מגיעים אלינו.
- **מנוי חודשי:** בכרטיס אשראי בלבד, בהוראת קבע. Bit, Apple Pay ו-Google Pay לא תומכים בחיוב חודשי חוזר.
- **מנוי שנתי:** בכרטיס אשראי, Bit, Apple Pay או Google Pay.
- בפירוט החיובים של הכרטיס יופיע שם העסק (SHK טכנולוגיות / EnglishVibe) כפי שחברת התשלומים מציגה אותו.
- כתובת אימייל היא שדה חובה בתשלום. אליה נשלחת קבלה כחוק על כל תשלום, ובעמוד שאחרי התשלום מוצג סיכום העסקה ופרטי הביטול, שאפשר לשמור או להדפיס.

### 7. חידוש ותקופת המנוי
- **מנוי חודשי** מתחדש בכל חודש באופן אוטומטי ובאותו סכום, עד שמבטלים אותו. החיוב הבא מופיע בפורטל ההורים.
- **מנוי שנתי** משולם מראש לשנה ו**לא מתחדש מעצמו**. 14 יום לפני סופו יופיע בפורטל ההורים תאריך הסיום וכפתור לחידוש. חידוש בזמן ממשיך מתאריך הסיום, כך שלא הולך לאיבוד אף יום ששולם.
- אם חיוב חודשי נכשל (למשל כרטיס שפג תוקפו), חברת התשלומים תנסה לחייב את אותו כרטיס שוב, באותו סכום, במשך עד 10 ימים (ולא אחרי סוף החודש הקלנדרי). בהרשמה למנוי חודשי ההורה מסכים לניסיונות החיוב החוזרים האלה. בזמן הזה ה-Pro נשאר פתוח. אם החיוב לא עובר עד אז, המנוי מסתיים, ה-Pro נסגר, ולא יהיו ניסיונות חיוב נוספים. ההתקדמות של הילד/ה נשמרת.

### 8. הוספה, הסרה והחלפה של ילדים
- **מנוי חודשי:** אפשר להוסיף ילד (עד 4) או להסיר ילד בכל עת מפורטל ההורים. הוספה שמעלה את החיוב החודשי מוצגת לאישור לפני שהיא נעשית. הילד שנוסף מקבל Pro מיד, והמחיר החדש חל מהחיוב הבא.
- **מנוי שנתי:** אפשר למלא רק מקומות שכבר שולמו. כדי להוסיף מעבר להם, פותחים מנוי נוסף.
- ילד שהוסר נשאר עם Pro עד סוף התקופה הנוכחית, אבל לא יותר מחודש.
- החלפת ילד (הסרה של ילד והכנסה של אחר במקומו) אפשרית פעם ב-30 יום. במנוי לילד אחד אי אפשר להסיר את הילד היחיד בפורטל, ולכן החלפה כזאת נעשית בפנייה אלינו באימייל.
- אם נמחק חשבון של ילד במנוי: כשנשארים במנוי ילדים אחרים, המחיר החודשי יורד בהתאם מהחיוב הבא. כשנמחק הילד האחרון במנוי חודשי, נבטל את המנוי בתוך יום עסקים אחד, ואם בינתיים ירד חיוב, נחזיר אותו במלואו.

### 9. ביטול והחזרים
- **דרכי ביטול:** אפשר לבטל בכל אחת מהדרכים האלה: בפורטל ההורים, בעמוד [ביטול עסקה](/refunds/#cancel) שמקושר מדף הבית, באימייל support@englishvibe.co.il, בטלפון 055-2903310, או בדואר רשום לכתובת SHK טכנולוגיות, החיטה 323, מאור.
- **ביטול בתוך 14 יום (החזר מלא):** אפשר לבטל מנוי חודשי או שנתי בתוך 14 יום מיום התשלום הראשון, או מיום שקיבלתם את סיכום העסקה ופרטי הביטול, לפי המאוחר מביניהם, ולקבל החזר מלא (100%) בלי דמי ביטול. ה-Pro נסגר והחשבון חוזר למסלול החינמי, וכל ההתקדמות נשמרת. ההחזר המלא ניתן פעם אחת לכל משפחה. אזרח ותיק (בן 65 ומעלה), אדם עם מוגבלות ועולה חדש רשאים לבטל בתוך 4 חודשים, כשהעסקה כללה שיחה איתנו, לפי סעיף 14ג1 לחוק הגנת הצרכן.
- **ביטול מנוי חודשי אחרי 14 יום:** מרגע הביטול לא יהיו חיובים נוספים, וה-Pro נשאר פתוח עד סוף החודש ששולם. אם תבקשו לסיים את המנוי מיד, נסיים אותו בתוך 3 ימי עסקים ונחזיר את החלק היחסי של הימים שנותרו בחודש. אם בגלל עיכוב טכני ירד חיוב אחרי בקשת הביטול, נחזיר אותו במלואו.
- **ביטול מנוי שנתי אחרי 14 יום:** נחזיר את הסכום ששולם פחות המחיר החודשי הרגיל של כל חודש מנוי שהתחיל, כולל החודש הנוכחי: **החזר = הסכום השנתי ששולם − (מספר החודשים שהתחילו × המחיר החודשי הרגיל)**, ולא פחות מ-0. המחיר החודשי הרגיל הוא זה שהיה בתוקף ביום הרכישה למספר הילדים במנוי (היום: ₪39 לילד אחד, ₪64 לשניים, ₪89 לשלושה ו-₪114 לארבעה), ואם המחיר ירד מאז, המחיר הנמוך יותר. העלאת מחיר אחרי הרכישה לא מקטינה את ההחזר. לדוגמה, ביטול מנוי שנתי לילד אחד (₪349) בחודש הרביעי: ‎349 − 4 × 39 = ₪193. מהחודש התשיעי ההחזר הוא ₪0, וה-Pro נשאר פתוח עד סוף השנה. אחרי ביטול שיש בו החזר, ה-Pro נסגר בסוף החודש הנוכחי.
- **אופן ההחזר:** ההחזר מועבר לאמצעי התשלום שבו שילמתם, בתוך 14 יום מבקשת הביטול. אם אמצעי התשלום כבר לא מאפשר החזר (למשל Bit אחרי כמה חודשים), נחזיר בהעברה בנקאית או בדרך אחרת שנתאם איתכם, באותו מועד.
- אם ילד קיבל Pro בשתי תוכניות בטעות (למשל שני הורים ששילמו בו זמנית), נבטל את הכפילות ונחזיר את ההפרש.
- הפרטים המלאים מופיעים ב[מדיניות השירות והביטולים](/refunds/).

### 10. הפסקה או שינוי של השירות
- אם האפליקציה לא תהיה זמינה בגלל תקלה שבשליטתנו יותר מ-72 שעות רצופות, או יותר מ-7 ימים במצטבר בחודש קלנדרי (לא כולל תחזוקה מתוכננת שהודענו עליה מראש), או אם נפסיק להפעיל את השירות, נחזיר את החלק היחסי של מה ששולם על התקופה שלא ניתנה.
- הפרה מהותית של התנאים (כגון הונאה, עקיפת מנגנוני התשלום או פגיעה באבטחה) עלולה להוביל לחסימת החשבון ולסיום המנוי, אחרי התראה סבירה מראש, למעט במקרה חירום של אבטחה.

### 11. אחריות
האפליקציה ניתנת כמו שהיא (As-Is). אנחנו עושים כל מאמץ שהתוכן יהיה נכון והשירות זמין, אבל לא מתחייבים לתוצאה או לציון מסוים במבחן, או לזמינות רציפה בלי תקלות. ככל שהדין מאפשר, לא נהיה אחראים לנזק עקיף או תוצאתי, או לאובדן רווח או מידע, שנגרמו מהשימוש באפליקציה. האחריות הכוללת שלנו לנזק ישיר בגין השירות או המנוי מוגבלת לסכום ששילמתם על המנוי ב-12 החודשים שלפני האירוע. כל זה בלי לגרוע מזכויות צרכן שאי אפשר לוותר עליהן לפי הדין.

### 12. פרטיות
איזה מידע נאסף, איך הוא נשמר, למי הוא מועבר ואיך מוחקים אותו מוסבר ב[מדיניות הפרטיות](/privacy/), שהיא חלק מהתנאים האלה.

### 13. שינויים בתנאים
שינוי מהותי בתנאים יוצג בפורטל ההורים וגם יישלח להורים משלמים באימייל, לפחות 30 יום לפני שיחול. מי שלא מסכימים לשינוי יכולים לבטל לפני שהוא חל, בלי חיוב נוסף, ובמנוי שנתי לקבל החזר יחסי על החודשים המלאים שנותרו.

### 14. דין וסמכות
על התנאים האלה חלים דיני מדינת ישראל בלבד. הסמכות נתונה לבתי המשפט המוסמכים בישראל לפי הדין.

---

## 2. פרטיות ומידע: סעיף תשלומים

To add to `SECTIONS` in `PrivacyNoticeDialog.tsx`, after "מה הורים רואים":

```ts
{
  titleHe: 'תשלום על Pro',
  bodyHe: [
    'רק הורה מחובר יכול לשלם על Pro. התשלום נעשה בעמוד המאובטח של גרואו פיימנטס בע״מ (Grow), ופרטי אמצעי התשלום לא מגיעים אלינו.',
    'אנחנו שומרים את מצב המנוי (פעיל, מבוטל, עד מתי), איזה חשבון הורה משלם, אילו ילדים במנוי, הסכומים ומספרי האישור של חברת התשלומים.',
    'השם, הטלפון והאימייל שנמסרים בתשלום עוברים ל-Grow, לצורך התשלום והקבלה. Grow מעבדת אותם בשבילנו, לפי מדיניות הפרטיות שלה. הם עוברים ל-Grow דרך שירות האוטומציה Make (של חברת Celonis), שמעביר אותם ואינו שומר אותם.',
    'אנחנו שומרים את השם, הטלפון והאימייל של המשלם, כדי לטפל בביטול או בשינוי של הוראת הקבע ובהחזרים, ומוחקים אותם בתוך 90 יום מסיום המנוי והטיפול בו.',
    'רשומות התשלום נשמרות כפי שחוקי המס דורשים (בדרך כלל 7 שנים), עם מזהה החשבון בלבד, גם אחרי מחיקת החשבון.',
  ],
},
```

Also:
- The "מה נשמר" section: add "מצב המנוי ל-Pro, אם יש" to its first line.
- `PRIVACY_CONTACT_EMAIL` (`config/appInfo.ts`) is now `support@englishvibe.co.il` (done).

---

## 3. מסך התשלום: שורת תנאים ותיבת הסכמה

Above "המשך לתשלום" in `ProCheckoutPanel`, after the price:

> **שורת תנאים** (`text-xs`, under the total):
> - חודשי: "₪{סכום} לחודש, מתחדש כל חודש עד שמבטלים. אפשר לבטל בכל עת כאן בפורטל. תשלום בכרטיס אשראי בלבד."
> - שנתי: "₪{סכום} לשנה, תשלום אחד. לא מתחדש מעצמו. אפשר לשלם בכרטיס אשראי, Bit, Apple Pay או Google Pay."
> - שורה לשניהם: "בפירוט החיובים יופיע: [שם החיוב]."

> **תיבת הסכמה** (required, unticked by default):
> "קראתי ואני מסכים/ה ל[תנאי השימוש והמנוי] ול[מדיניות הפרטיות], ואני מעל גיל 18."
> Monthly only, one more sentence in the same box (Grow terms §13.1.5.11 require advance notice and explicit consent before retrying a failed recurring charge):
> "אם חיוב חודשי ייכשל, אני מסכים/ה שחברת התשלומים תנסה לחייב את הכרטיס שוב במשך עד 10 ימים."

Both links open the dialogs. The server records the consent with the checkout (`termsVersion`, `acceptedAt`), so it can be shown later.

---

## 4. Questions for the legal review

**Decided 2026-11-19 (owner, from the legal audit; conservative defaults, no lawyer yet):** 1: full 14-day refund, no fee, once per family; the clock starts at payment or at receipt of the written transaction summary, whichever is later; 4 months for protected groups (§14ג1). 2: access to the end of the paid month by default; on request, termination within 3 business days with a pro-rated refund (§13ד). 3: yearly after 14 days: refund = paid − (months started × regular monthly rate), never below 0 ("Option B"). 4: 30 days' direct email + portal notice. 5: "מאגר המנוהל בידי יחיד", no registration or DPO; internal pack in `docs/legal/database-definition.md`. 6: Israel residents only; consent checkbox with Terms + Privacy for every grade at signup. 7: section 6 renamed "תשלום וקבלות", email mandatory. 8: indirect damage excluded, direct capped at 12 months' fees. 9: retry consent stored on the checkout. 10: Grow privacy link, `sendingMode: 3`. 11: keep the registered address. 12: payer contact details deleted 90 days after the plan ends; payment records 7 years.

1. **Cancellation within 14 days (סעיף 14ג לחוק הגנת הצרכן, עסקת מכר מרחוק):** does it apply to a digital service that starts at once? May a cancellation fee (5% or ₪100) be charged, or is a full refund better for trust and simpler? The draft leaves the fee in brackets.
2. **Monthly plans as a continuing transaction (סעיף 13ד):** is "cancel any time, Pro until the end of the paid month, no refund for that month" enough, or must cancellation take effect within 3 business days with a pro-rated refund?
3. **Yearly plans:** a pro-rated refund of the remaining full months after 14 days: is that required, and how is the fee worked out?
4. **Notice of a price change and of changes to the terms:** is 30 days in the parent portal enough, or does it need email too? (The app has no email channel yet.)
5. **Privacy Protection Law, Amendment 13 (2025):** does a children's app with paying parents need a privacy officer, a registered database, or a written security procedure (תקנות אבטחת מידע)? Is Firebase in Europe acceptable as is?
6. **Children's consent:** is the parent's declaration at checkout, together with the existing parent pairing, enough consent for a minor's account?
7. **VAT:** registered as עוסק פטור (310720370), so the text states "עוסק פטור, פטור ממע״מ" and Grow issues a קבלה (confirm the wording if transitioning to עוסק מורשה later).
8. **Limitation of liability (section 11):** can it be enforced against consumers as written? (Grow's site check requires a clause on direct and indirect damage.)
9. **Retrying failed monthly charges:** Grow's terms (§13.1.5.11) allow retries only with the customer's advance, explicit consent. Are the sentence in section 7 and the extra line in the checkout box enough?
10. **Grow as a processor:** Grow processes the payer's name, phone and email for us, and its privacy policy allows sharing with Meta when WhatsApp is used. Does the privacy notice need to say more than "Grow processes them for us under its own privacy policy"?
11. **Published phone number and address:** Grow's site check requires a contact phone on the site and the business address on the site or in the terms. Is the private home address acceptable, or should it be a P.O. box?
12. **Make as a processor abroad, and keeping payer details:** payments go to Grow through Make.com (Celonis, outside Israel), which passes the payer's name, phone and email on without keeping them (its run history is set to confidential). We also keep the payer's name, phone and email on the checkout record, so the owner can cancel or change the standing order in Grow by hand. Does this need consent or a notice beyond the privacy text above (transfer abroad, Privacy Protection Law Amendment 13)? How long may we keep them after the plan ends, given that billing records may have to be kept?

---

## 5. Changes in the app before launch (Phase 4)

Built 2026-11-17, from the drafts as they stand; the lawyer's changes go into this file (and the privacy text into `src/config/privacyNotice.ts`):
- **Terms:** no separate dialog. The site's `/terms/` page is built from section 1 of this file, so the app links to it (`TERMS_PAGE_PATH`, new tab) from the sign-in screen ("תנאי שימוש", next to privacy), the settings' account card ("תנאי שימוש ומנוי") and the checkout's consent box. One text, nothing to keep in sync.
- **Privacy, payments section:** "תשלום על Pro" in `PRIVACY_NOTICE_SECTIONS`, after "מה הורים רואים", without the draft's retention bracket (question 12 above stays open). The /privacy/ page always shows it; the app's dialog shows it only where Pro can be bought (`privacyNoticeSections(IS_PRO_PLAN_VISIBLE)`).
- **Checkout:** under the total, the renewal line ("מתחדש כל חודש עד שמבטלים…" / "תשלום אחד לשנה. לא מתחדש מעצמו."); the consent box (unticked, "המשך לתשלום" disabled until it's ticked) with links to /terms/ and /privacy/, and the 10-day retry sentence on monthly plans only. `api/checkout.ts` refuses a payment page without `acceptedTerms: true` (400) and saves `termsVersion` (`TERMS_VERSION` in `config/appInfo.ts`, the terms' "עודכן לאחרונה" date: change it with the text) and `acceptedAt` on the checkout.
- **Not yet:** the line "בפירוט החיובים יופיע: …" waits for Grow to confirm the charge name; the "מה נשמר" section doesn't mention the Pro status (the payments section does).
- **Business details** were already in `src/site/siteContent.ts` (`BUSINESS`, `CONTACT`) and in the terms text.
- Grow's site clearing approval (Site_check.pdf; Grow said on 2026-11-24 that the site needs no check, but the site keeps all of this) also needs: the terms linked from the site's home page and next to the checkout box, the phone shown on the home or contact page, and every plan and price shown on the site.
