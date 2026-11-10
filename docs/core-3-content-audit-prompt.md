# Prompt: independent content audit of the "עונה 3" pack (core-3)

Give everything below the line to a fresh agent opened in this repository (`C:\Development\English Tutor`).

---

You are an independent reviewer. You did not write this content, and your job is to find what is wrong with it, not to praise it. **Do not edit any file in `src/`.** Write your findings to `docs/core-3-content-audit.md` and nothing else.

## What the app is
EnglishVibe is a Hebrew-first app that teaches English to Israeli students in grades 1–12. Instructions and explanations are in Hebrew; the English being taught follows the Israeli Ministry of Education curriculum. `CLAUDE.md` at the repo root has the house rules. Read it first.

## What to review
The content pack `core-3` ("עונה 3"): one new unit (unit 23, three missions: two teaching missions and a Boss) in each of grades 2–12, plus nine word decks for grades 4–12. It is written but not released yet.

| What | Where |
|---|---|
| Missions (vocabulary, example sentences, Hebrew hints, drill seeds with Explorer / Challenger / Master tiers) | `src/data/curriculum/packs/core3/curriculum/grade2.ts` … `grade12.ts` |
| Mini-lessons (the grammar explanation shown before a mission) | `src/data/curriculum/packs/core3/lessons/grade<N>.ts` |
| Exam-bank questions | `src/data/curriculum/packs/core3/examBank/grade<N>.ts` |
| Word decks (word, Hebrew gloss, part of speech, example sentence and its Hebrew) | the entries with `packId: 'core-3'` in `src/data/wordDecks/grade4.ts` … `grade12.ts` |
| Pack name and settings | the `'core-3'` entry in `src/data/curriculum/packs/registry.ts` |
| What each grade's unit is meant to teach, and why | `docs/content-packs-roadmap.md` (the core-3 row and the enrichment rule) |
| The Ministry's official lists | `docs/ministry-sources/raw/parsed/wordLists.json` (vocabulary by band) and `grammarLists.json` (grammar headings by band and grade); the source PDFs are in `docs/ministry-sources/raw/` |
| Known gaps the pack is meant to close | `docs/ministry-sources/coverage-findings.md` |
| Decisions the owner has already made (don't re-raise these) | `docs/content-packs-open-items.md`, sections "Owner review applied", 3 and 5 |

The files are large. Read them grade by grade with offsets rather than all at once, and keep notes as you go.

## What to check
Check every grade. For each finding give the file, line, the text as it is, what is wrong, and a suggested fix.

1. **Facts.** Every factual claim in an English or Hebrew sentence: dates, numbers, places, people, history, science, geography, what is grown or made where. Known ones to verify: drip irrigation used in more than 100 countries; the pill camera made by a company in northern Israel; dates grown mainly in the Jordan Valley (the Arava grows them too); Fleming, 1928, mould and penicillin; in the grade 8 History deck, 1948, the 1979 peace treaty, the 1949 election, Columbus 1492, the Second Temple destroyed in 70 CE, the Western Wall about 2,000 years old. Find the others yourself. Say how you verified each one; if you can't verify a claim, say so instead of guessing.
2. **English.** Grammar, spelling (the app uses **US spelling everywhere**), punctuation, natural word choice, and that each sentence actually shows the grammar point its mission teaches. Flag sentences no native speaker would say.
3. **Answer correctness.** In every drill and exam question, the marked answer is right and **only** that answer is right. Look hard at distractors that are also correct, ambiguous gaps, and word-order items with more than one valid order.
4. **Hebrew.** Natural, correct Israeli Hebrew; translations that match the English meaning; no calques. Rules: hints, lessons and exam-bank Hebrew address the learner in the **gender-neutral plural** ("שימו לב", "אתם…"); first-person slash forms like "אני אוהב/ת" are intentional and stay. Glosses in the decks should give the meaning used in the example sentence first.
5. **Level and curriculum fit.** Is each unit right for its grade (vocabulary and sentence length; grade 2 learners barely read)? Does it teach the grammar heading the roadmap says it targets, at the Ministry's grade? Are the taught words in the Ministry list for that grade's band (`wordLists.json`)? Flag words outside the band.
6. **Tiers.** Explorer, Challenger and Master are meant to be different questions of rising difficulty. Master must not reuse Challenger's sentence, rule or story. Flag tiers that are the same difficulty or repeat each other.
7. **Lessons.** Each grammar explanation is correct, complete enough for the grade, and its examples match its rule.
8. **Suitability.** Content for children aged 7–18 in Israel: nothing frightening, violent, political or religiously insensitive; stereotypes; a fair mix of boys' and girls' names and roles.
9. **Consistency.** The same word glossed differently in two places; names or story details that change within a mission; repeated sentences across grades.

## How to report
Write `docs/core-3-content-audit.md` with:
- a short summary: the number of findings per category and per grade, and your overall view of whether the pack is ready to ship;
- the findings, grouped by grade, each marked **must fix** (wrong fact, wrong or ambiguous answer, incorrect English or Hebrew), **should fix** (unnatural, off-level, inconsistent) or **consider** (taste);
- a list of the facts you verified, with your source for each.

Don't pad the report: a clean grade gets one line saying so. Don't run the TTS, art or upload scripts, don't commit, and don't push.
