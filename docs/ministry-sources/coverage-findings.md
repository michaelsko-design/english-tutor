# Curriculum coverage: first run (2026-11-06)

What the app teaches, compared with the Ministry's official Lexical Bands and Grammar Bands
(English Curriculum 2020). Made with `npm run review:coverage`; the full lists are in
`review-out/curriculum-coverage.html`. Released content only (no content packs are released yet).
The numbers with every pack included are given where they differ.

## How to read the numbers

- **Taught**: a mission vocabulary word (the words a mission drills), in any grade up to the band's last grade.
- **Seen**: taught, or appears anywhere in the English the app shows in those grades
  (sentences, stories, mini-lessons, exam bank). Seeing a word in a sentence is not learning it, so this
  number is generous.
- Matching is automatic and approximate: regular word forms plus common irregular ones. Spot checks
  (e.g. *December*, *husband*, *ambulance*) confirmed that words reported missing really are missing from released content.
- Grammar: each Ministry grammar heading is matched by hand-written rules against mission grammar topics
  and titles. "Has a mission" means a mission names the structure, not that everything under the heading is practised.

## Vocabulary

| Official list | Grades | Entries | Taught | Seen | Never in the app |
|---|---|---|---|---|---|
| Pre-Band I (Pre-A1) | 3 | 198 | 16% | 61% | 36 |
| Band I Core I (A1) | 4–5 | 549 | 17% | 68% | 49 |
| Band I Core II (A2) | 5–6 | 602 | 10% | 55% | 95 |
| Band II Core I | 7–8 | 1,014 | 8% | 51% | 284 |
| Band II Core II (B1) | 8–9 | 1,002 | 6% | 48% | 357 |
| Band III Core I (4-point) | 10–12 | 887 | 6% | 56% | 386 |
| Band III Core II (5-point) | 10–12 | 1,100 | 5% | 42% | 634 |

With every content pack included: Band I Core I is 26% taught / 81% seen, and Band II Core I is 14% / 59%.

**Main finding: the app's vocabulary is much smaller than the official lists.** Each grade has 36–48 mission
words (grade 1: 117, mostly phonics). Grades 3–6 together drill about 160 words; the official
Pre-Band I + Band I lists for those grades have 1,349 entries, and the Ministry expects all of Band I to be
used actively by the end of grade 6.

Examples of official Band I words the app never shows: the months, *husband*, *wife*, *ambulance*, *east/west*,
*butter*, *chicken*, *How about …?*, *Excuse me*, *as … as*. Many Pre-Band I classroom phrases are also missing
(*How old are you?*, *Where do you live?*, *I'm sorry*, *you're welcome*).

The app also teaches words *earlier* than the Ministry plans. Grade 3 has 33 words from Band I, for example.
That's fine to keep, but say so ("ahead of the curriculum"), not "matches it".

## Grammar

| Grammar band | Headings | Has a mission by the band's end | Later than the Ministry's grade | Only after the band | No mission |
|---|---|---|---|---|---|
| Band I (grades 4–6) | 33 | 24 | 7 | 5 | 4 |
| Band II (grades 7–9) | 50 | 40 | 4 | 1 | 9 |
| Band III (grades 10–12) | 43 | 29 | – | – | 14 |

**No mission:**
- Band I: coordinated clauses (*and/but/or*), possessives (*my/your/his*), superlatives, adverbs of manner.
- Band II: reported speech, *would like*, *used to*, reflexive pronouns, no article, possessives, superlatives, sequencing adverbs, coordinated clauses.
- Band III: future continuous, future in the past, future perfect, present continuous for the future, present perfect continuous, past perfect (simple and continuous), conditional imperative, *used to*, complex noun phrases, superlatives, sequencing, coordinating conjunctions.

**Too late:**
- *will* and *going to*: the Ministry starts them in grade 5; the app starts them in grade 7.
- Subordinate clauses (*because, when*): the Ministry starts them in grade 4; the app starts them in grade 8.
- Present continuous: the Ministry starts it in grade 4; the app starts it in grade 6.
- Defining relative clauses: the Ministry starts them in grade 7; the app starts them in grade 9.
- Non-defining relative clauses: the Ministry puts them in Band II; the app starts them in grade 10.

**The docs claim more than the app has.** `docs/architecture.md` lists superlatives in grade 8 and the past perfect
in grade 9, but no mission in those grades teaches them.

## What this means for "proof" to parents

- Vocabulary: today the honest claim is "built on the Ministry's curriculum topics and grammar order",
  not "covers the Ministry's word lists". The numbers above shouldn't be published yet.
- Grammar is the stronger part: most headings in each band have a mission. Closing the missing
  and late items above would make "follows the Ministry's grammar order" defensible.

## Re-running

```bash
python -I scripts/review/ministryWordLists.py   # once, after downloading the official files
npm run review:coverage                         # released content
npm run review:coverage -- --with-packs         # as if every content pack had shipped
```
