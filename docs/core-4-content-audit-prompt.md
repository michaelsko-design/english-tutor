# Prompt: independent content audit of the "עונה 4" pack (core-4)

Give everything below the line to a fresh agent opened in this repository (`C:\Development\English Tutor`).

---

You are an independent reviewer. You did not write this content, and your job is to find what is wrong with it, not to praise it. **Do not edit any file in `src/`.** Write your findings to `docs/core-4-content-audit.md` and nothing else.

## What the app is
EnglishVibe is a Hebrew-first app that teaches English to Israeli students in grades 1–12. Instructions and explanations are in Hebrew; the English being taught follows the Israeli Ministry of Education curriculum. `CLAUDE.md` at the repo root has the house rules. Read it first.

## What to review
The content pack `core-4` ("עונה 4"): one new unit (unit id 24, three missions: two teaching missions and a Boss) in each of grades 2–12, plus nine word decks for grades 4–12. It is written but not released yet.

| What | Where |
|---|---|
| Missions (vocabulary, example sentences, Hebrew hints, drill seeds with Explorer / Challenger / Master tiers) | `src/data/curriculum/packs/core4/curriculum/grade2.ts` … `grade12.ts` |
| Mini-lessons (the grammar explanation shown before a mission) | `src/data/curriculum/packs/core4/lessons/grade<N>.ts` |
| Exam-bank questions | `src/data/curriculum/packs/core4/examBank/grade<N>.ts` |
| Word decks (word, Hebrew gloss, part of speech, example sentence and its Hebrew) | the entries with `packId: 'core-4'` in `src/data/wordDecks/grade4.ts` … `grade12.ts` |
| Pack name and settings | the `'core-4'` entry in `src/data/curriculum/packs/registry.ts` |
| What each grade's unit is meant to teach, and why | `docs/content-packs-roadmap.md`: §2 (the core-4 row of each grade's table) and §9 (what was written, word by word) |
| The Ministry's official lists | `docs/ministry-sources/raw/parsed/wordLists.json` (vocabulary by band) and `grammarLists.json` (grammar headings by band and grade); the source PDFs are in `docs/ministry-sources/raw/` |
| Known gaps the pack is meant to close | `docs/ministry-sources/coverage-findings.md` |
| Decisions the owner has already made (don't re-raise these) | `docs/content-packs-open-items.md`, sections "Owner review applied", 3 and 5, and the core-4 section |
| How core-3 was audited (the same standard applies) | `docs/core-3-content-audit.md` |

The grammar each grade's unit targets:

| Grade | Unit | Grammar |
|---|---|---|
| 2 | Where Do You Live? | Where do you live? / I live in…; How many? / There are… |
| 3 | Once Upon a Time | and / and then / but in stories; Once upon a time, there was… |
| 4 | Weather & Seasons | present continuous and its questions |
| 5 | Weekend Plans | be going to, questions and short answers |
| 6 | Travel Stories | past simple with when; because / because of |
| 7 | Inventions | defining relative clauses (who / which / that) |
| 8 | News & Interviews | reported speech: said that, told sb (to), asked whether |
| 9 | Careers | first and second conditionals |
| 10 | Safety & First Aid | conditional imperative; and / but / or / so / yet |
| 11 | Predictions & Plans | future perfect; future in the past (was going to, would) |
| 12 | Ethics | second and third conditionals; passive with modals |

The files are large. Read them grade by grade with offsets rather than all at once, and keep notes as you go.

## What to check
Check every grade. For each finding give the file, line, the text as it is, what is wrong, and a suggested fix.

1. **Facts.** Every factual claim in an English or Hebrew sentence: dates, numbers, places, people, history, science. Known ones to verify:
   - grade 7: Alexander Graham Bell's telephone in 1876; Hedy Lamarr, a film star who worked on secret radio signals in World War II, and the claim "some people say Wi-Fi and Bluetooth use ideas like hers"; the USB flash drive developed by an Israeli company; drip irrigation beginning in Israel; Rachel as a famous Israeli poet (deck);
   - grade 8: nothing named, but check the news and interview stories read as fiction, not as real events;
   - grade 10: 101 as the number for an ambulance in Israel; the black flag on Israeli beaches; bee-sting allergy advice; Israel independent in 1948, Martin Luther King's movement, the Egyptian civilization (deck);
   - grade 11: the world's population reaching almost ten billion by 2050; people in 1900 expecting to fly to work by 2000; immigration from Ethiopia;
   - grade 12: the lost-wallet experiment (wallets with more money were returned more often); laws in some countries that make supermarkets give away unsold food.
   Find the others yourself. Say how you verified each one; if you can't verify a claim, say so instead of guessing. A story about a named, ordinary person (Noa, Ido, Eran…) is fiction and must not read like a real news report.
2. **English.** Grammar, spelling (the app uses **US spelling everywhere**), punctuation, natural word choice, and that each sentence actually shows the grammar point its mission teaches.
3. **Answer correctness.** In every drill and exam question, the marked answer is right and **only** that answer is right. Look hard at distractors that are also correct (especially the Challenger fill-in distractors, `clozeWrong`, and the and / but / so / yet choices in grades 3 and 10), ambiguous gaps, and word-order items with more than one valid order.
4. **Hebrew.** Natural, correct Israeli Hebrew; translations that match the English meaning; no calques. Rules: hints, lessons and exam-bank Hebrew address the learner in the **gender-neutral plural** ("שימו לב", "אתם…"); first-person slash forms like "אני אוהב/ת" are intentional and stay. Glosses in the decks give the meaning used in the example sentence first.
5. **Level and curriculum fit.** Is each unit right for its grade (grade 2 learners barely read)? Does it teach the grammar heading in the table above, at the Ministry's grade? Are the taught words in the Ministry list for that grade's band (`wordLists.json`)? Flag words outside the band.
6. **Tiers.** Explorer, Challenger and Master are meant to be different questions of rising difficulty. Master must not reuse Challenger's sentence, rule or story.
7. **Lessons.** Each grammar explanation is correct, complete enough for the grade, and its examples match its rule.
8. **Suitability.** Content for children aged 7–18 in Israel: nothing frightening, violent, political or religiously insensitive; stereotypes; a fair mix of boys' and girls' names and roles. Look closely at the grade 12 Ethics unit (weapons, bribery, cheating) and the grade 10 safety unit (injuries, fire, gas).
9. **Consistency.** The same word glossed differently in two places; names or story details that change within a mission; repeated sentences across grades, or with core-3.

## How to report
Write `docs/core-4-content-audit.md` with:
- a short summary: the number of findings per category and per grade, and your overall view of whether the pack is ready to ship;
- the findings, grouped by grade, each marked **must fix** (wrong fact, wrong or ambiguous answer, incorrect English or Hebrew), **should fix** (unnatural, off-level, inconsistent) or **consider** (taste);
- a list of the facts you verified, with your source for each.

Don't pad the report: a clean grade gets one line saying so. Don't run the TTS, art or upload scripts, don't commit, and don't push.
