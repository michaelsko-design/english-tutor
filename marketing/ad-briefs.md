# EnglishVibe: ad briefs (one agent prompt per ad)

Strategy, audiences and budget: `marketing/paid-ads-strategy.md`.
Each prompt below is written to be pasted to an agent working in this repository. Every prompt tells the agent to read the shared rules first, so paste the prompt as it is.

| # | Ad | Format | Speaks to | Campaign tag (`c=`) |
|---|---|---|---|---|
| 1 | The game (exists, needs cut-downs) | Video 20s + 10s | Elementary parents | `game` |
| 2 | Test on Thursday | Video 15s | Parents of grades 3–9 | `wordlist` |
| 3 | One lesson or a whole month | Still image | Tutor-fatigue parents | `tutor` |
| 4 | What did they do this week? | Carousel, 4 cards | Careful parents | `report` |
| 5 | Not a kids' app | Video 15s | Parents of grades 9–12 | `exam` |
| 6 | Before they can read | Video 15s | Parents of grades 1–2 | `young` |
| 7 | Google Search text ads | Text | People searching | `search-…` |

## Shared rules (every agent reads this)

**Product.** EnglishVibe is a Hebrew-first, game-like web app that teaches English to Israeli pupils in grades 1–12. It runs in the browser, with no download. Children play missions, collect diamonds, keep a daily streak and decorate a personal room. Parents get a weekly report. Free to start; Pro is ₪39 a month or ₪349 a year for the first child.

**Who the ad is for.** Israeli parents, Hebrew-speaking, on a phone, sound off, scrolling Facebook or Instagram. Address them in the plural ("הילדים שלכם", "נסו").

**Hard rules.**
- Use real app screens only. Capture them the way the landing site does (`npm run site:screens`, emulators only; never sign in to the live Firebase project). No mock-up screens, no invented features.
- No invented people, quotes, reviews, user counts, marks or results. No photos or AI images of children. The app's mascots and screens carry the ad.
- The curriculum claim is exactly "בנוי על נושאי הלימוד וסדר הדקדוק של משרד החינוך". Never "תואם את תוכנית הלימודים".
- The free line is exactly "מתחילים חינם, ללא צורך בכרטיס אשראי".
- Prices only as "₪39 לחודש" / "₪349 לשנה". No discounts, no "מבצע".
- Brand name is written "EnglishVibe" in Latin letters, isolated left-to-right inside Hebrew. For narration, write the name in English in the script (the Hebrew spelling is read wrongly; see `marketing/ad/adVoBatch.ts`).
- Closing tagline: "לומדים אנגלית בכיף!"
- Every video works with no sound: burned-in Hebrew captions, large, inside the safe area (keep the top 14% and bottom 20% of a 9:16 frame clear of text). The first 2 seconds hold the hook.
- No paid image or video generation without the owner's approval. If generated art is needed, state the count first and generate in 3×3 sheets, in batches.

**How to build video.** Reuse the existing pipeline in `marketing/ad/`: `ad.html` (scenes), `adTimeline.js` (animation as a function of time), `renderAd.mjs` (renders frames to MP4), `adVoBatch.ts` (Hebrew narration through Gemini's batch API, three takes per line). Read those four files before writing anything. Add a new ad as its own scene file and timeline next to them; do not change the existing ad. Motion follows the app's own keyframes in `src/index.css`.

**Deliverables for each ad.**
- Video: 9:16 at 1080×1920 (Reels, Stories) and 4:5 at 1080×1350 (feed), MP4, H.264, under 30 MB.
- Still: 1:1 at 1080×1080 and 4:5 at 1080×1350, PNG.
- A text file next to the media with: primary text (2 versions, 125 characters at most for the first line), headline (3 versions, 40 characters at most), description, and the button "למידע נוסף" or "הרשמה".
- The link: `https://englishvibe.co.il/home/?src=ad&c=<tag>` with the tag from the table above (the landing page keeps the tag).
- Save everything under `marketing/ad/<tag>/`. Commit nothing; report the file paths and anything you could not verify.

---

## Ad 1: The game (cut-downs of the existing ad)

```text
Read "Shared rules" in marketing/ad-briefs.md first, then the existing ad in marketing/ad/ (ad.html, adTimeline.js, renderAd.mjs, adVoBatch.ts) and watch marketing/ad/englishvibe-ad-20s-he-v2.mp4.

Task: make the existing 20-second EnglishVibe ad ready for Meta, and cut a shorter version. Do not redesign it.

1. Check the 20-second v2 against the shared rules: captions readable with no sound, text inside the safe area for 9:16, the first 2 seconds carry a hook that makes sense alone, and the last scene shows the free line "מתחילים חינם, ללא צורך בכרטיס אשראי". Fix only what fails.
2. Render a 4:5 (1080×1350) version of the same ad. Re-lay out scenes that crop badly; do not just crop.
3. Make a 10-second version in both sizes: the hook ("אנגלית? הכי כיף כשזה משחק!"), the spelling game with the diamond chest, then the end card with the name, the tagline and the free line. Reuse the narration takes already in marketing/ad/vo/; render new lines only if a cut needs one.
4. Write the ad text file. Angle: screen time the child asks for and the parent is happy about. Example first line: "הילדים רוצים מסך. אתם רוצים שילמדו אנגלית. אפשר גם וגם."

Campaign tag: game. Output under marketing/ad/game/. Done means four MP4 files (20s and 10s, each in 9:16 and 4:5) plus the text file, and a short note of what you changed in the 20-second version.
```

## Ad 2: Test on Thursday

```text
Read "Shared rules" in marketing/ad-briefs.md first, then the existing ad pipeline in marketing/ad/.

Task: a new 15-second vertical video ad for EnglishVibe about practising the school's own word list before a vocabulary test or dictation.

Audience: parents of grades 3–9 who know the weekly fight over practising words.

Before writing, find how the feature really works in the app (search for the custom word lists feature: src/data/customWordLists.ts and the screens that use it) and show only what exists: a parent or child types in the word list from school, and the app turns it into practice games.

Story, four beats:
1. 0–2s, hook, big caption on a plain background in the app's colours: "הכתבה באנגלית ביום חמישי?"
2. 2–6s: the school word list being typed into the app (real screen, 5–6 simple words such as lion, garden, because).
3. 6–12s: the same words appearing in two of the app's games, a correct answer, diamonds flying, the streak counter going up. Caption: "מקלידים את הרשימה מבית הספר. מתרגלים במשחק."
4. 12–15s: end card with the mascot, "EnglishVibe", "לומדים אנגלית בכיף!" and "מתחילים חינם, ללא צורך בכרטיס אשראי".

Narration in Hebrew, 3 short lines at most, rendered with adVoBatch.ts in three takes each; pick the best by ear and say which you picked. Free accounts hold up to 2 word lists: do not say or imply "unlimited".

Campaign tag: wordlist. Output under marketing/ad/wordlist/: the video in 9:16 and 4:5, and the ad text file. First-line idea for the text: "במקום לריב על תרגול המילים, תנו להם לשחק איתן."
```

## Ad 3: One lesson or a whole month

```text
Read "Shared rules" in marketing/ad-briefs.md first.

Task: a still-image ad for EnglishVibe that compares its price with a private tutor. Build it as an HTML page rendered to PNG (the same approach marketing/ad/ uses for video frames), so the text stays sharp and editable.

Audience: parents of grades 5–10 who pay, or are thinking of paying, for private English lessons.

Layout: two halves, clear at a glance on a phone.
- One half, muted: "שיעור פרטי אחד" with "כ-₪150" under it.
- Other half, in the app's bright colours with a real app screen and a mascot: "חודש שלם של תרגול יומי" with "₪39" under it.
- Bottom strip: "EnglishVibe" and "מתחילים חינם, ללא צורך בכרטיס אשראי".

Rules for this ad: write "כ-₪150" (about), since tutor prices vary. Do not say the app replaces a teacher and do not mock tutors; the claim is daily practice between lessons at a fraction of the cost. Hebrew is right-to-left, the price figures and the brand name are isolated left-to-right.

Make three versions that differ only in the headline, so the owner can test them:
A. "שיעור פרטי אחד, או חודש שלם?"
B. "תרגול אנגלית כל יום, במחיר של רבע שיעור"
C. "בין שיעור לשיעור, מי מתרגל איתם?"

Campaign tag: tutor. Output under marketing/ad/tutor/: each version in 1:1 and 4:5 PNG, the HTML source, and the ad text file.
```

## Ad 4: What did they do this week?

```text
Read "Shared rules" in marketing/ad-briefs.md first.

Task: a 4-card carousel ad for EnglishVibe aimed at careful parents: what the parent sees, and why the app is safe. Build each card as HTML rendered to a 1080×1080 PNG.

Before writing, check each claim against the app and the landing site's FAQ (src/site/siteContent.ts) and use only what is true there: a weekly report for parents, no advertisements, no open chat and no free text between children, the friends area off under age 13 until a parent turns it on.

Cards:
1. Hook: "מה הילדים עשו השבוע באנגלית?" over a real screenshot of the weekly parent report (capture it in the emulators with seeded progress; no real child's data).
2. "דוח שבועי להורים": what the report shows, in one line, with the screenshot enlarged on the key numbers.
3. "בלי פרסומות. בלי צ׳אט פתוח.": one line on the friends area being off under 13 until a parent turns it on.
4. End card: the mascot, "EnglishVibe", "מכיתה א׳ ועד י״ב", "מתחילים חינם, ללא צורך בכרטיס אשראי".

Keep each card to one idea and at most 12 words. The four cards share one background and type style so they read as one strip when swiped.

Campaign tag: report. Output under marketing/ad/report/: four PNG files in order, the HTML source, and the ad text file with one headline per card.
```

## Ad 5: Not a kids' app

```text
Read "Shared rules" in marketing/ad-briefs.md first, then the existing ad pipeline in marketing/ad/.

Task: a 15-second vertical video ad for EnglishVibe aimed at parents of grades 9–12, about preparing for English exams. It must not look like an app for small children.

Look: the Urban Night theme and the mascot Kai throughout, dark background, calmer motion than the existing ad, no confetti storms.

Before writing, find how exam preparation really works in the app (docs/architecture.md: grep for the exam prep section; do not read the whole file) and show only what exists: a daily practice plan, a practice test, a readiness certificate. Free accounts get a taster day only, so do not present the full plan as free.

Story:
1. 0–2s, hook: "מבחן באנגלית בעוד שבועיים?"
2. 2–7s: the exam plan screen, days being ticked off one after another. Caption: "תוכנית תרגול יומית עד המבחן."
3. 7–12s: a practice test question at high-school level being answered, then the readiness certificate. Caption: "מבחן תרגול ותעודת מוכנות."
4. 12–15s: end card in the dark theme: "EnglishVibe", "גם לחטיבה ולתיכון", "מתחילים חינם, ללא צורך בכרטיס אשראי".

No promised marks and no mention of a specific Bagrut score. The word "בגרות" may appear only if the app's exam banks cover it; check before using it and say what you found.

Narration: 3 short lines, a teenager-neutral adult voice, three takes each with adVoBatch.ts.

Campaign tag: exam. Output under marketing/ad/exam/: the video in 9:16 and 4:5, and the ad text file.
```

## Ad 6: Before they can read

```text
Read "Shared rules" in marketing/ad-briefs.md first, then the existing ad pipeline in marketing/ad/.

Task: a 15-second vertical video ad for EnglishVibe aimed at parents of first and second graders.

The point: in grades 1–2 the Hebrew instructions are read aloud, so a child who does not read yet can play alone. This ad is the one exception to "works with no sound" being enough: it should also invite turning the sound on, because the read-aloud is the feature.

Look: the light, playful Cozy Studio theme and the mascot Mochi.

Story:
1. 0–2s, hook: "עוד לא קוראים? אפשר כבר להתחיל אנגלית."
2. 2–8s: a grade 1 letter mission. The instruction appears and a speaker icon pulses while it is read aloud (use the app's own Hebrew clip for that instruction and the English clip for the letter; find them through public/tts/manifest.json rather than rendering new ones). The child's tap is shown as a finger marker, the letter lands, a star drops in.
3. 8–12s: the room and the sticker reward. Caption: "ההוראות מוקראות בקול. הילדים משחקים לבד."
4. 12–15s: end card: "EnglishVibe", "מכיתה א׳", "מתחילים חינם, ללא צורך בכרטיס אשראי".

A small "🔊 הפעילו קול" tag sits in a corner for the first 3 seconds.

Campaign tag: young. Output under marketing/ad/young/: the video in 9:16 and 4:5, and the ad text file.
```

## Ad 7: Google Search text ads

```text
Read "Shared rules" in marketing/ad-briefs.md and section 7 of marketing/paid-ads-strategy.md first.

Task: write Google responsive search ads in Hebrew for EnglishVibe, one ad per ad group, as a single file marketing/ad/search/google-search-ads.md. Text only; build nothing.

Ad groups and their campaign tags:
1. App for children (search-app): people searching for an app or games to learn English for children.
2. Tests and vocabulary (search-test): practising for an English test, dictation, vocabulary by grade.
3. Private tutor (search-tutor): people searching for an English tutor or lesson prices.
4. Exam preparation (search-exam): high-school English exam practice.

For each ad group give:
- 12 headlines, each 30 characters at most, counted with spaces. At least 3 contain the searched phrase, 2 contain "EnglishVibe", 2 carry the free start, 1 carries the price "₪39 לחודש".
- 4 descriptions, each 90 characters at most.
- 4 sitelinks (title 25 characters at most, with two description lines of 35) pointing at real sections of https://englishvibe.co.il/home/ (check the page's section anchors in the site source under src/site/ before choosing).
- The final URL: https://englishvibe.co.il/home/?src=ad&c=<tag>.
- 15–20 keywords in phrase or exact match, and the negative keywords.

Print the character count next to every headline and description, and recount before finishing: Google rejects lines that are one character over. Hebrew for parents, plural, no exclamation marks in headlines (Google allows none there), no superlatives such as "הכי טוב" (not provable). The tutor group must not claim the app replaces a teacher.
```
