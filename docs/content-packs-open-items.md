# Content packs: open items for the owner (2026-11-09)

Everything below is written and passes the tests (4,142), typecheck and build. Nothing here is committed, uploaded or released. This is the list of what needs a human decision, approval or check before the work ships. Plan: `docs/content-packs-roadmap.md`.

## 1. Commit and release mechanics
- [x] **Commit the work** (380408e0, 2026-11-10). The Season 2 decks, the word-track engine, the pack-system changes and all of `core-3` are uncommitted in the working tree. Commit only these files: `scripts/tts/hebrewReview.json`, `marketing/`, `room-*.html` and `scripts/review/*Audit*.json` belong to other work.
- [x] **Upload the clips, then commit the manifest** (4,348 uploaded 2026-11-10). There are about 4,070 new English clips (decks 1,329, core-3 2,739) and 285 Hebrew clips (grade 1 deck 76, core-3 grade 2 209). Run `npm run tts:upload`, then commit `public/tts/manifest.json`.
- [x] **Deploy `firestore.rules`** (deployed 2026-11-10). The parent report snapshot now carries `deckWordMastery`.
- [x] **Free or Pro:** decided 2026-11-10: every new pack is **Pro** by default (`DEFAULT_PACK_ACCESS`; a released entry needs `access: 'free'` to open it to everyone). Decks follow their pack's access.
- [x] **Look at it in the app** (play-tested 2026-11-10 in `dev:packs` on the emulators, grade 5 girl). Map: core-3 is unit 7 "אני בעתיד / Future Me", after both Season 2 units, and unlocks after them; 7.1 (Challenger), 7.2 (Challenger) and the Boss 7.3 (Master, at 375px phone width) play to the end; no sideways scroll on the phone. Vault: the three grade 5 decks show, with words, pictures and practice (meaning match and word magnets checked).
  - **Fixed:** the step 4 badge "🕵️‍♀️" showed a stray ♀ next to the detective picture in every mission (the emoji swap missed a joined emoji with a variation selector inside it); deck practice told learners to order words "מהדף של המורה" (the deck's own prompt was built but never used).
  - **Dev only:** Vite pre-bundles the emoji JSX runtime despite `optimizeDeps.exclude`, so edits to `emojiSegments.ts`/`iconArt.ts` show in `npm run dev` only after `vite --force`. The build is not affected.
  - **For the audit / owner:** g5 7.2 "אתם תהיו זמרים בלהקה?" (plural) vs "Will you be a singer in a band?" (one singer). The g5 Restaurant deck shows 7 food words as plain emoji (salad, rice, steak, fork, spoon, tea, snack) next to drawn pictures, and "glass" shows the milk picture.
- [x] **Name core-3:** "עונה 3" / "Season 3" (owner, 2026-11-10).
- [ ] **Lint.** `npm run lint` fails with 7 old errors in `scripts/review/auditAllHebrew.ts`, which is unrelated to this work. Fix them or leave them.

## Owner review applied (2026-11-10)
- "How old are you?" → "בן כמה אתה?"; "say it again please" → "אפשר לחזור על זה בבקשה?"; "דנה היא רצה מהירה"; "אל תיכוו"; "הגשנו לעצמנו"; "…עושים ידנית"; quit → "לעזוב (עבודה) / להפסיק / לפרוש".
- **"You" slash forms → plural everywhere** (core-3, Season 2, base grades 7–8, voice messages): no "את/ה", "תוכל/י", "בוא/י" left in `src/data`.
- **US spelling everywhere** (color, neighbor, center, practice, canceled, organize…): 253 changes in learner-facing strings; ids, keys and code names untouched. The Ministry lists are US-spelled, so coverage matching improves. 218 English clips re-rendered.
- [x] First-person slash forms ("אני אוהב/ת") stay as they are (owner, 2026-11-10).

## 2. Pictures (paid, 3×3 batch sheets): 10 sheets drawn 2026-11-10 (sheets 52–61), wired in
All 90 are in `public/art/icons` and mapped in `iconArt.ts`. **Redraws approved 2026-11-10 (sheet 62, `-2` ids):** lost, keep, thirsty, full, fill (drawn on a coloured tile), once, don't forget (coloured circle behind), nationality (the passport shows the word "PASSPORT"). Drawn and wired in (the old pictures are deleted). The new passport still had "PASSPORT" on it, so the word was painted out by hand in `art-src/icons/word-nationality-2.png`: re-slicing sheet 62 brings it back, so don't re-run `process_art.py` on that icon from a fresh slice.
Each word now has its own emoji key (pictures are looked up by emoji). 90 pictures: the 57 required (minus "across", which keeps its bridge picture), 23 optional grades 7–12 (croissant already had one), and 10 core-3 deck words (noise, ground, keep, bottle, thirsty, full, yogurt, jam, grill, fill). Other grade 4–6 deck words without a fitting picture: fat, brown, Do you mind?, would like, anything else, half-price, order, extra, cover, add, lovely, pleasant.

The original list:
Grades 2–6 need a drawn icon for every word. For now, core-3 reuses existing pictures, so these words show a stand-in.
- **Grade 2 (12):** ask, glad, say it again please, in a minute, it doesn't matter, hit, lost, come back, how are you, fine, I'm ready, wait for
- **Grade 3 (10):** film star, yes, no, both, at home, today, know, color, fan, end, from
- **Grade 4 (11):** first name, all right, anybody, as well, lie, once, how about, don't forget, the rest, busy, someone
- **Grade 5 (9):** adult, somewhere, everywhere, telephone, try, river, parent, pupil, different
- **Grade 6 (15):** careful, follow, the middle, not bad, almost, side, exactly, come along, hang on, a while, across, push, enough, Olympic Games, throw

That is **57 words = 7 sheets of 9** (6 slots spare).

**Optional, grades 7–12** (no test needs these): café, purse, croissant, furniture, package, goods, metal, device, vehicle, tool, engineer, selfie, date of birth, nationality, resort, cab, laser, tube, pump, powder, liquid, layer, spy, barrier. That is 24 more words, or 3 sheets.

## 3. Hebrew: all approved by the owner (2026-11-10)

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

### core-3 decks (grades 4–12, 180 words)
- g4: keep → "לגדל (חיה); לשמור"; ground → "קרקע; אדמה"
- g5: "Do you mind?" → "אכפת לכם?" ("אכפת לכם שאשב כאן?"); would like → "הייתי רוצה (בנימוס)"; sandwich → "כריך; סנדוויץ׳"; full → "שבע (אחרי אוכל); מלא"
- g6: grill → "לצלות על האש"; pour → "למזוג; לשפוך"; biscuit → "עוגייה; ביסקוויט"
- g7: sight → "אתר תיירות; מראה"; I'm afraid → "לצערי (בנימוס)"; tram → "רכבת קלה"; explore example is a loose rendering
- g8: route → "דרך; מסלול" (example repeats "דרך"); century → "מאה (מאה שנים)"; dates to confirm: 1948, 1979 peace treaty, 1949 election, Columbus 1492, Second Temple 70 CE, Western Wall ~2,000 years
- g9: can afford → "להרשות לעצמו (מבחינת כסף)"; hire → "לקבל לעבודה; לשכור"; shop assistant → "מוכר בחנות"; sale → "מכירה; מבצע"
- g10: estate → "אחוזה; נכסים" (example says real estate → נדל״ן); qualify → "לקבל הסמכה; להיות זכאי"; entitle; campaign → "קמפיין; מסע (פרסום)"
- g11: pass away → "למות" (owner, 2026-11-10); look up to; eldest → "הבכור"; darling → "מותק; יקירי"; have a word → "לדבר רגע"
- g12: by this time; increasingly → "במידה הולכת וגוברת"; newly → "זה עתה; לא מזמן"; simultaneously → "בו־זמנית"

### Review tools
- **`npm run review:he-tiers`:** about 940 tier items are waiting for review, core-3 among them.
- **`npm run tts:review:he`:** check the new Hebrew clips by ear (grade 1 deck and core-3 grade 2).

## Independent content audit (2026-11-10): `docs/core-3-content-audit.md`
78 findings: 27 must fix, 46 should fix, 5 consider. Facts all checked as correct; nothing unsuitable.
- [x] **Must fix, all 27 handled:**
  - **Challenger fill-in (17 items, grades 7–11):** the blank took an inflected form ("smells", "educating") while the answer offered the headword. Fixed in the engine (`challengerSteps.ts`): the fill-in now moves on to the next word whose example has the word as written, so the same bug is also gone from 77 items elsewhere (43 in the live base grades). `tierSeedLint.test.ts` checks every mission and every replay salt.
  - **Grade 3:** "know"/"color" became the Pre-Band I chunks "Do you know" / "What color is your"; the Boss rule answer is the short answer; "Where are you from?" and "We both have" were replaced by `Do you…?` items; Emma's "She does not know Hebrew well" dropped.
  - **Grade 4:** "because I have no breakfast" → "because I have no food".
  - **Grade 5:** "Will you be a singer…?" → "Will you sing in a band?" (and lesson / exam), so the plural Hebrew matches.
  - **Grade 6 deck:** "add" and "mix" (Pre-Band I) removed; a new deck test keeps every deck word in its grade's band.
  - **Grade 7:** "purse" now belongs to an old woman (story) and to Mom (exam passage). "Why not?" needs no change: the blank and the answer both include the question mark.
  - **Grade 10 deck:** "paid holidays" → "paid vacation"; entitle's gloss leads with "להיות זכאי ל־".
  - **Grade 12 deck:** `review:coverage` now expands "by this/that time", "in the short/long term" and "the day/week/year before last", so the three deck phrases count.
- [x] **Should fix (46) and consider (5), applied 2026-11-10** (owner: "apply them"):
  - Example sentences now show the unit's grammar: conjunctions (g4), will (g5), adverbs of manner (g6), would like / reflexives (g7), passive (g8), relative clauses (g9), future forms (g10), past perfect continuous (g11), sequencing and linking words (g12); the Boss short sentences and Master voice lines too.
  - Plural "you" Hebrew where the English is general (g3–g5); singular "yourself" now has a named addressee (g7, "דן, … אל תיכווה").
  - Glosses lead with the example's meaning (about 15, missions and decks).
  - Lesson examples no longer repeat the drill sentences (g4–g6); g2–g3 grammar items test only what the unit teaches; g2 Master sentence shortened; g2 "I'm sorry" → "אני מצטער/ת".
  - US words: soccer (not football) across core-3; vacation, movie theater, movie, store (g11–g12); biscuit example "dip my biscuit in tea" (g6).
  - g8 exam distractors match the blank's form; g10 Master story "On the tenth".
  - Receptive words in decks: kept, and the roadmap rule now says a topic deck may include them (Season 2 already had about 100); the roadmap no longer says core-3 has no decks.
  - **Not changed:** "pass away" stays "למות" (owner's call earlier today; the audit suggested "להיפטר").

## 4. Facts in the texts to confirm
The owner wants an independent agent to check all of core-3, facts included: the prompt is `docs/core-3-content-audit-prompt.md`, and its report goes to `docs/core-3-content-audit.md`.
- Drip irrigation is used in more than 100 countries (grade 8).
- The pill camera is made by a company in the north (grade 8).
- Dates are grown mainly in the Jordan Valley (grade 8). The Arava grows them too.
- Fleming, 1928: he came back from holiday and found mould that had killed bacteria, which led to penicillin (grade 11).
- These general claims are fine as written: "Teachers who mark Bagrut essays often see the same problems" and "Experts say the gap year can be worthwhile".

## 5. Content choices: all confirmed by the owner (2026-11-10)
- **Grade 5 core-3 words taught a year early:** try, computer, study, problem, understand, difficult, different and parent are taught in a base grade 6 mission, and core-3 now teaches them a year earlier. The roadmap's word-choice rule 2 allows this. Keep them, or swap them for words that are never in the app.
- **"would prefer" in grade 7** is kept, although base grade 7 teaches "prefer". It is a separate Ministry entry.
- [x] **Spelling:** US everywhere (owner, 2026-11-10).
- **Grammar later than the Ministry's grade:** the past perfect continuous (grade 11) and adverbs of sequencing (grade 12) have missions after the Ministry's grade 10.
- **Small decks:** grade 5 Weather has 13 words and grade 4 Body & Health has 15, because Band I has few untaught words on those topics.
