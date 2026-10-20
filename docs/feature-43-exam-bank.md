# Feature 43: Exam Question Bank (שאלות חדשות להכנה למבחן)

> Backlog: "the prepare for exam questions are taken from the missions question pool. we need to increase the range of questions so that the same question never appears more than in one place, meaning - new questions for exam preparation."

## Goal
"Get Ready for an Exam" (4.9) used the step of each unit mission that matches the skill, so a (unit × skill) block held the 3 questions the learner had already answered, and the mock repeated them. Exam prep now has its own questions, which appear nowhere else in the app.

## Decisions
| Question | Decision |
| :--- | :--- |
| How many per unit? | 6 vocabulary, 6 grammar, 6 sentences, 2 reading passages with 3 questions each. |
| Mock exam | The last 2 items of each list (`EXAM_MOCK_RESERVED_PER_LIST`) and the second passage are kept for the mock, so it is unseen. Practice uses the first 4 and the first passage. |
| Vocabulary | New fill-in-the-blank sentences on the **unit's own words**: new questions on studied words. |
| Tiers | One item for every tier. Explorer gets the first wrong option only (2 options) and the passage translation; Challenger 3 options; Master 3 options and no passage translation. |
| Rollout | Engine + grade 7 first. Other grades use the mission questions until their bank is written. |
| Data | `src/data/curriculum/examBank/grade<N>.ts`, keyed by unit number, loaded when a session opens (`EXAM_BANK_LOADERS` in `data/examBank.ts`, `useExamBank`). No profile fields change. |

## Data (`examBank/types.ts`)
- `ExamVocabItem`: `clozeEn` (one `____`), `clozeHe` (the whole sentence in Hebrew, shown as the hint), `answer` (a word of the unit's vocabulary), `wrong` (2).
- `ExamGrammarItem`: `questionEn`, `correct`, `wrong` (2), `explainHe`, `hintHe` (same shape as `drillSeed.rule`).
- `ExamSentenceItem`: `en` (4–14 words), `he`.
- `ExamPassage`: `passageEn`, `passageHe`, 3 questions (`questionEn`, `questionHe`, `correct`, `wrong` (2)).

## Writing a grade's bank
1. Copy the shape of `grade7.ts`. Follow the unit's grammar topics and vocabulary (`CURRICULUM_BY_GRADE`), at the grade's level. Grades 1–3: very short sentences and passages, picture-friendly words, simple questions.
2. **Everything new.** No sentence, passage, question or option of 3+ words may repeat a mission step (any tier), a vocabulary example, a mini-lesson example or quick try, a voice message, or another bank item. The test compares lower-cased text without punctuation.
3. **Vocabulary**: the answer must be one of the unit's vocabulary words in exactly that form, and must not appear elsewhere in the sentence. Pick wrong options that clearly don't fit (other unit words are best).
4. **Grammar**: one answer only, with no "also correct" option. `hintHe` says how to decide and contains no English word that only the correct option has.
5. **Passages**: 4–6 sentences, a new setting (not the mission story). Each answer should share words with its sentence, so the hint ("the answer is in sentence N") points to the right one. Avoid abbreviations such as "Mr." in passages.
6. **Hebrew**: hints and explanations in gender-neutral plural forms ("שימו לב", "קראו", "בדקו"); `inflectHebrew` must leave them unchanged. Typographic apostrophes (’) like the curriculum.
7. Add the grade to `EXAM_BANK_LOADERS` (`data/examBank.ts`) **and** `ALL_EXAM_BANKS` (`examBank/index.ts`).
8. `npx vitest run src/data/examBank.test.ts`, then `npm run tts:check`, `npm run tts:render`, `npm run tts:check`, and commit the clips with the bank.
