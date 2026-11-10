# Content packs: open items for the owner (2026-11-09)

Everything below is written and passes the tests (4,142), typecheck and build. Nothing here is committed, uploaded or released. This is the list of what needs a human decision, approval or check before the work ships. Plan: `docs/content-packs-roadmap.md`.

## 1. Commit and release mechanics
- [x] **Commit the work** (380408e0, 2026-11-10). The Season 2 decks, the word-track engine, the pack-system changes and all of `core-3` are uncommitted in the working tree. Commit only these files: `scripts/tts/hebrewReview.json`, `marketing/`, `room-*.html` and `scripts/review/*Audit*.json` belong to other work.
- [x] **Upload the clips, then commit the manifest** (4,348 uploaded 2026-11-10). There are about 4,070 new English clips (decks 1,329, core-3 2,739) and 285 Hebrew clips (grade 1 deck 76, core-3 grade 2 209). Run `npm run tts:upload`, then commit `public/tts/manifest.json`.
- [x] **Deploy `firestore.rules`** (deployed 2026-11-10). The parent report snapshot now carries `deckWordMastery`.
- [x] **Free or Pro:** decided 2026-11-10: every new pack is **Pro** by default (`DEFAULT_PACK_ACCESS`; a released entry needs `access: 'free'` to open it to everyone). Decks follow their pack's access.
- [ ] **Look at it in the app.** Run `dev:packs` on desktop and phone. The Vault deck list and the deck session have only been tested in component tests, never seen live. `e2e/packs-core3.spec.ts` already plays core-3 in grades 2, 8 and 12.
- [ ] **Name core-3.** The pack card now reads "עונה 3: פרק 1" / "Season 3: Chapter 1". Keep it or rename it.
- [ ] **Lint.** `npm run lint` fails with 7 old errors in `scripts/review/auditAllHebrew.ts`, which is unrelated to this work. Fix them or leave them.

## 2. Pictures to approve (paid, 3×3 batch sheets)
Grades 2–6 need a drawn icon for every word. For now, core-3 reuses existing pictures, so these words show a stand-in.
- **Grade 2 (12):** ask, glad, say it again please, in a minute, it doesn't matter, hit, lost, come back, how are you, fine, I'm ready, wait for
- **Grade 3 (10):** film star, yes, no, both, at home, today, know, color, fan, end, from
- **Grade 4 (11):** first name, all right, anybody, as well, lie, once, how about, don't forget, the rest, busy, someone
- **Grade 5 (9):** adult, somewhere, everywhere, telephone, try, river, parent, pupil, different
- **Grade 6 (15):** careful, follow, the middle, not bad, almost, side, exactly, come along, hang on, a while, across, push, enough, Olympic Games, throw

That is **57 words = 7 sheets of 9** (6 slots spare).

**Optional, grades 7–12** (no test needs these): café, purse, croissant, furniture, package, goods, metal, device, vehicle, tool, engineer, selfie, date of birth, nationality, resort, cab, laser, tube, pump, powder, liquid, layer, spy, barrier. That is 24 more words, or 3 sheets.

## 3. Hebrew to approve

### Season 2 word decks
- **Grade 1:**
  - "Take care!" → "שמרו על עצמכם!" (plural, to stay gender-neutral)
  - "What's your name?" → "איך קוראים לך?", which is voiced once, so only one gender's sound
  - "How old are you?" → "מה הגיל שלך?"
- **Grade 10:**
  - hip → "אגן; מפרק הירך" and thigh → "ירך"
  - compulsory → "של חובה; מחייב" sits next to obligation → "חובה; מחויבות" in the same deck
- **Grade 12:**
  - "to make matters worse" → "וכאילו זה לא מספיק"
  - "the latter" → "האחרון (מבין השניים)"
- **Other decks:**
  - homemaker → "עקר בית / עקרת בית"
  - toast → "טוסט; לחם קלוי"
  - petrol → "דלק; בנזין"
  - skate → "להחליק (בגלגיליות)"
  - dining room → "פינת אוכל"
  - "do your best" → "להשתדל כמה שאפשר"
- **Example sentences:** some first-person examples use masculine forms ("אני גר", "אני מרגיש").

### core-3, grades 2–3
- "אני מצטער/ת" and "אני מוכן/ה": the slash may show wherever the text isn't inflected for gender
- "say it again please" → "אפשר להגיד שוב, בבקשה?"
- both → "שניהם / שנינו"
- fan → "אוהד / מעריץ"
- fun → "כיף"
- Questions to "you" use the plural: "אתם אוהבים…? / יש לכם…?"

### core-3, grades 4–6
- **Grade 6 sentences:**
  - "Dana is a quick runner" → "דנה רצה מהירה", which also reads as "ran". Suggested: "דנה היא רצה מהירה".
  - "מי מנצח במרוץ?" is masculine, but the answer is Noa.
- **Glosses:**
  - how about → "מה דעתך על…?" (singular)
  - anywhere → "בשום מקום / בכל מקום"
  - across → "לרוחב / מעבר ל…"
  - come along → "להצטרף / לבוא"
  - hang on → "רגע / חכו"
  - well → "היטב / טוב"
  - lie → "לשקר"
- **"You" sentences are mixed:** some use the slash ("את/ה רוצה…", "את/ה בסדר, או שאת/ה עצוב/ה?"), others the plural ("אתם תהיו זמרים בלהקה?", "תאפו עוגה…?"). Grades 7–12 use the plural throughout. Suggested: change the slash forms to the plural.
- **Grammar note in grade 6, mission 2:** "good הוא תואר של שם עצם".

### core-3, grades 7–9
- "Don't burn yourself" → "אל תכוו". The spelling should probably be "אל תיכוו".
- "…and served ourselves" → "שירתנו את עצמנו" reads unnaturally. Suggested: "הגשנו לעצמנו".
- would prefer → "להעדיף (בנימוס)", in "אחותי הייתה מעדיפה תה"
- would love → "מאוד לרצות / לשמוח ל…", in "סבתא שלי מאוד הייתה רוצה כוס תה עם נענע"
- "It's my pleasure" → "בשמחה"; pleasure → "הנאה / בשמחה"
- itself → "את עצמו / את עצמה (דבר או חיה)"
- "Dan cut himself with the bread knife" → "דן נחתך מסכין הלחם"
- on offer → "במבצע"
- well-made → "עשוי היטב / איכותי"
- control → "לשלוט / לכוון"
- "every table is finished by hand" → "את הגימור של כל שולחן עושים ביד"
- nationality → "לאום / אזרחות"
- likes and dislikes → "מה שאוהבים ומה שלא אוהבים"
- teenager → "נער / נערה (בגיל ההתבגרות)"
- society → "חברה (ציבור)"
- human → "בן אדם / אנושי"
- class 7B → "כיתה ז׳2"

### core-3, grades 10–12
- **"gap year" → "שנת הפסקה":** Israeli usage may prefer "שנת שירות" or "שנת חופש".
- **Possible calque:** hopefully → "בתקווה / אני מקווה ש…", in "בתקווה, היא גם תישן טוב".
- **Other glosses:**
  - check in → "לעשות צ'ק-אין / להירשם בכניסה"
  - part-time → "חלקי (משרה חלקית)"
  - territory → "שטח / טריטוריה"
  - worthwhile → "שווה את המאמץ / כדאי"
  - quit → "לעזוב (עבודה) / להפסיק"
  - incident → "תקרית / אירוע"
  - mess → "בלגן"
  - apparent → "ברור / גלוי לעין"
  - as a matter of fact → "למעשה / בעצם"
  - interaction → "קשר בין אנשים / אינטראקציה"
  - tube → "מבחנה / צינור"
  - the main thing → "העיקר"
  - whatever → "מה ש… / לא משנה מה"
  - except that → "אלא ש… / חוץ מזה ש…"
- **Future continuous:** Hebrew has no such tense, so sentences like "This time next year, we will be working…" → "…אנחנו נעבוד בחווה" use the simple future.

### Review tools
- **`npm run review:he-tiers`:** about 940 tier items are waiting for review, core-3 among them.
- **`npm run tts:review:he`:** check the new Hebrew clips by ear (grade 1 deck and core-3 grade 2).

## 4. Facts in the texts to confirm
- Drip irrigation is used in more than 100 countries (grade 8).
- The pill camera is made by a company in the north (grade 8).
- Dates are grown mainly in the Jordan Valley (grade 8). The Arava grows them too.
- Fleming, 1928: he came back from holiday and found mould that had killed bacteria, which led to penicillin (grade 11).
- These general claims are fine as written: "Teachers who mark Bagrut essays often see the same problems" and "Experts say the gap year can be worthwhile".

## 5. Content choices to confirm
- **Grade 5 core-3 words taught a year early:** try, computer, study, problem, understand, difficult, different and parent are taught in a base grade 6 mission, and core-3 now teaches them a year earlier. The roadmap's word-choice rule 2 allows this. Keep them, or swap them for words that are never in the app.
- **"would prefer" in grade 7** is kept, although base grade 7 teaches "prefer". It is a separate Ministry entry.
- **Spelling:** the grades 10–12 texts mix US forms (neighbor, center, jewelry) with UK forms (colour, mould, travelling). Pick one.
- **Grammar later than the Ministry's grade:** the past perfect continuous (grade 11) and adverbs of sequencing (grade 12) have missions after the Ministry's grade 10.
- **Small decks:** grade 5 Weather has 13 words and grade 4 Body & Health has 15, because Band I has few untaught words on those topics.
