# Ministry of Education — English source documents

Official documents used to check EnglishVibe against the Israeli English curriculum.
Downloaded 2026-11-06 from `meyda.education.gov.il` (the Ministry's file server) and `pop.education.gov.il`.

The files are in `raw/` and are **not committed** (`.gitignore`): the Ministry's files say *"No part of this
curriculum may be reproduced … without prior permission in writing"*. Keep them local, and quote them only briefly in the app or marketing.
Plain-text copies of the curriculum PDFs (top level of `raw/`, not the exam folders) are in `raw/text/` (made with `pdftotext -layout`) so scripts can search them.
Re-download from the URLs below if `raw/` is missing.

## Coverage check

`python -I scripts/review/ministryWordLists.py` turns the official Excel lists into JSON (in `raw/parsed/`), then
`npm run review:coverage` compares them with the app and writes `review-out/curriculum-coverage.html`.
Latest results: [coverage-findings.md](coverage-findings.md).

## Current curriculum: English Curriculum 2020

Still the version in force. No newer curriculum was found; the only later change is a corrected Band I list (Jan 2023).
Base URL `https://meyda.education.gov.il/files/Mazkirut_Pedagogit/English/` (Aug 2021 set: `CurriculumFilesAugust21/`).

| File | What it is |
|---|---|
| `Curriculum2020.pdf` | Core document (Nov 2020), all levels. Table 2 maps levels → bands → grades |
| `curriculum2020Elementary.pdf` | Elementary edition (Pre-A1 → A2) |
| `framework2020.pdf` | Framework of reference that comes with the curriculum |
| `candospreA1.pdf`, `candosA1.pdf`, `candosA2.pdf`, `candosB1.pdf`, `candosB2.pdf` | Can-do statements per level (the benchmarks) |
| `candosalllevelstable.pdf` | All can-do statements in one table |
| `prefoundationcando.pdf` | Pre-Foundation (first year of English) can-dos |
| `LexicalBand1.pdf/.xlsx` | Pre-Band I + Band I word list (elementary), updated 26 Jan 2023 |
| `LexicalBand2.pdf/.xlsx` | Band II word list (junior high) |
| `LexicalBand3.pdf/.xlsx` | Band III word list (high school, 4- and 5-point) |
| `GrammarBandI.pdf/.xlsx`, `GrammarBandII…`, `GrammarBandIII…` | Grammar structures per band |

The `.xlsx` files are the ones to use for automated coverage checks.

### Levels → grades (Curriculum 2020, Table 2)

| CEFR level | Lexical band | Grades |
|---|---|---|
| Pre-A1 | Pre-Band I | Grade 3 and/or first months of grade 4 |
| A1 | Band I Core I | Grade 4 – mid grade 5 |
| A2 | Band I Core II | Mid grade 5 – end of grade 6 |
| A2 → B1 | Band II Core I | Grade 7 – mid grade 8 |
| B1 | Band II Core II | Mid grade 8 – end of grade 9 |
| B2 | Band III (4 / 5 points) | Grades 10–12 |

**Grades 1–2 are not in the curriculum.** The only Ministry program for them is the "Enjoy English" enrichment
(kindergarten + grades 1–2: songs and topic recordings, no syllabus):
https://pop.education.gov.il/kindergarten/topics/english/teaching-materials/enrichment/

## Older versions (for history only)

| File | What it is |
|---|---|
| `Curriculum2018July.pdf` | Revised English Curriculum, July 2018 (the four areas + benchmarks) |
| `Englishcurriculum-HaarachatOvdeyHoraa.pdf` | Older curriculum summary (teacher-evaluation copy) |
| `band11July18.pdf`, `band33July18.pdf` | 2018 Band I and Band III lists |
| `bandsLists.pdf` | Older bands list from the Bagrut pages |

## Bagrut (grades 10–12)

| File | What it is |
|---|---|
| `5pointsbooklet2025.pdf` | 5-point Bagrut handbook, Feb 2025 (modules, content, format) |
| `handbook_4_points.pdf` | 4-point Bagrut handbook, Dec 2020 (newest 4-point one found) |
| `BagrutSummer2026Updates.pdf` | Summer 2026 exam updates |
| `GeneralGuidelineswithclarifications25.pdf` | General exam guidelines, 2025 |
| `bagrut-summer-2026/` | Summer 2026 papers (one version each): `016381`, `016382`, `016384`, `016471`, `016484`, `016582`, `016584`, plus answer keys (`pitron-*`) |

Exam archive (every session from 2014 to Summer B 2026, with listening MP3s):
https://pop.education.gov.il/tchumey_daat/english/chativa-elyona/bagrut-exam/bagrut-archives/
Paper URLs: `https://meyda.education.gov.il/sheeloney_bagrut/pitronot_bagrut/<year>/<month>/<code>-….pdf`

## Meitzav (RAMA, grades 5 and 8) — `raw/meitzav/`

| File | What it is |
|---|---|
| `100-ENG-018-5-SOF-pnimi-net.pdf` | Grade 5 internal Meitzav test, 2018 |
| `E5_2018_2.pdf` | Grade 5 Meitzav 2018 test blueprint: % weight per area and skill (based on the 2014 curriculum) |
| `meitzav-eng8heb-2014-test.pdf` | Grade 8 test, 2014 |
| `123-ENG-017-8B-SOF-p-pnimi-net.pdf` | Grade 8 scoring key, version B, 2017 |

The newest public Meitzav English papers found are from 2018. More can be found under `https://meyda.education.gov.il/files/Rama/`.

## Not found / not public

- A syllabus for grades 1–2 (there isn't one; see above).
- The Ministry's approval process for digital learning materials and the Gefen program catalog. These are process pages, not documents; look them up when needed.
