# `core-3` ("עונה 3") Independent Content Audit

## Summary

### Findings by Category and Severity

| Category | Must Fix | Should Fix | Consider | Total |
| :--- | :---: | :---: | :---: | :---: |
| **Answer correctness** (broken Challenger clozes on inflected words; eliminable distractors) | 17 | 3 | 0 | **20** |
| **English** (US vs. UK usage, punctuation, unidiomatic phrasing, target-grammar fit) | 3 | 12 | 5 | **20** |
| **Level & curriculum fit** (out-of-band words, receptive words in decks, coverage-matcher mismatches, untaught grammar in drills) | 5 | 9 | 0 | **14** |
| **Hebrew** (singular/plural `you` number mismatches, singular addressing, gloss order vs. example meaning, blurred lesson translation) | 2 | 16 | 0 | **18** |
| **Lessons & Tiers** (exact lesson/drill sentence duplication, Grade 2 chip-count load) | 0 | 4 | 0 | **4** |
| **Consistency & Facts** (timeline slip in story, roadmap doc mismatch) | 0 | 2 | 0 | **2** |
| **Suitability** | 0 | 0 | 0 | **0** |
| **Total** | **27** | **46** | **5** | **78** |

### Findings by Grade

| Grade | Must Fix | Should Fix | Consider | Total |
| :--- | :---: | :---: | :---: | :---: |
| **Cross-grade / Docs** | 0 | 1 | 0 | **1** |
| **Grade 2** | 0 | 5 | 0 | **5** |
| **Grade 3** | 3 | 5 | 1 | **9** |
| **Grade 4** | 1 | 6 | 1 | **8** |
| **Grade 5** | 1 | 4 | 0 | **5** |
| **Grade 6** | 1 | 4 | 1 | **6** |
| **Grade 7** | 3 | 4 | 0 | **7** |
| **Grade 8** | 5 | 5 | 0 | **10** |
| **Grade 9** | 3 | 5 | 0 | **8** |
| **Grade 10** | 4 | 4 | 0 | **8** |
| **Grade 11** | 5 | 2 | 1 | **8** |
| **Grade 12** | 1 | 1 | 1 | **3** |
| **Total** | **27** | **46** | **5** | **78** |

### Overall Readiness View

**Not ready to ship yet.** While the historical, scientific, and geographical facts are accurate and the content is age-appropriate and culturally well-adapted for Israeli learners, there is one systemic **must-fix** issue across Grades 7–11 and several curriculum/English/Hebrew issues that should be resolved before release:

1. **Challenger Step 1 cloze inflection mismatch (17 vocabulary items across Grades 7–11):** `buildChallengerSteps` (`src/data/tierSteps/challengerSteps.ts:20–40`) blanks the vocabulary word out of `word.exampleEn` using `toClozeSentence` (`src/utils/hints.ts:75–90`), which strips inflections (`-s`, `-ed`, `-ing`), and then offers the **uninflected headword** `word.wordEn` as the correct multiple-choice option. Whenever `exampleEn` uses an inflected form (e.g., `will be educating`, `is operated`, `had been chasing`, `smells`, `vehicles`), the blanked sentence (`Maya will be ____ young children`, `The machine is ____ by one worker`, `The police officer had been ____ the thief`) forces the learner to choose an ungrammatical base form (`educate`, `operate`, `chase`) that directly contradicts the mission's own grammar rule. In Grade 2–6 and Grade 12, every `exampleEn` uses the exact uninflected headword; Grades 7–11 need the same discipline.
2. **Curriculum band and matcher alignment:** Grade 3 teaches standalone `'know'` and `'color'` (which are Band I Core I, while Pre-Band I only has the chunks `'Do you know …?'` and `'What color is your …?'`); Grade 6's cooking deck includes two `pre-band-1` words (`add`, `mix`); seven of the nine word decks include receptive (`rec`) words despite roadmap §2–3 stating that receptive words do not belong in decks; and Grade 12's time deck shortens three slash-separated Ministry headwords (`by this time`, `the day before last`, `in the long term`) so `npm run review:coverage` fails to match them against `wordLists.json`.
3. **US vs. UK English and plural-`"you"` number mismatches:** In Grade 7 (`curriculum/grade7.ts:113` and `examBank/grade7.ts:103`), men (`an old man` and `Dad`) say they lost or looked for their `'purse'` to pay the bill—a British usage for a coin pouch that in US English means a woman's handbag (`wallet` is required for men in US English). In Grade 5 (`curriculum/grade5.ts:125–126`, `lessons/grade5.ts:30`, `examBank/grade5.ts:94`) and Grade 7 (`curriculum/grade7.ts:137`), applying the plural `"you"` rule (`אתם` / `אל תיכוו`) produced number mismatches against singular English forms (`Will you be a singer in a band?` -> `'אתם תהיו זמרים בלהקה?'`; `Will you be a doctor or a singer?` -> `'אתם תהיו רופאים או זמרים?'`; `Don't burn yourself` -> `'אל תיכוו'`).

---

## Findings by Grade

### Cross-Grade / Documentation

1. **[should fix] Receptive (`rec`) words included in 7 of the 9 `core-3` word decks (23 items total) and roadmap doc out of sync**
   - **Files & lines:**
     - `docs/content-packs-roadmap.md:29, 306` (`"core-3 has no decks yet"` / `"no core-3 decks"`)
     - `src/data/wordDecks/grade4.ts:68, 72, 73, 74` (`zoo`, `sea`, `tooth`, `noise`)
     - `src/data/wordDecks/grade5.ts:67, 69, 72, 73` (`anything else`, `meal`, `steak`, `sandwich`)
     - `src/data/wordDecks/grade6.ts:72, 73, 75, 76, 77, 78, 79` (`mix`, `pour`, `cover`, `piece`, `garlic`, `potato`, `meat`)
     - `src/data/wordDecks/grade7.ts:88, 89` (`abroad`, `passport`)
     - `src/data/wordDecks/grade8.ts:91, 92, 93` (`century`, `army`, `soldier`)
     - `src/data/wordDecks/grade9.ts:92, 93` (`can afford`, `owe`)
     - `src/data/wordDecks/grade11.ts:91, 92` (`get along with`, `stand by`)
   - **What is wrong:** `docs/content-packs-roadmap.md` (§2 line 53 and §3 line 308) states: *"Receptive words don't need decks. They go into unit stories, lesson examples and deck example sentences, and count as 'seen'."* Yet 23 items across the `core-3` decks are `recProd: 'rec'`. In addition, `docs/content-packs-roadmap.md:29, 306` still states that `core-3` has no decks.
   - **Suggested fix:** Either replace the 23 `rec` deck entries with remaining `prod` words from each grade's band (or update the roadmap rule if `rec` words in thematic decks are now intentional), and update `docs/content-packs-roadmap.md:29, 306` to reflect the 9 `core-3` decks.

---

### Grade 2

1. **[should fix] Lesson example translates `I'm sorry` as `סליחה`, contradicting the lesson's own explanation**
   - **File & line:** `src/data/curriculum/packs/core3/lessons/grade2.ts:18, 28` (and `src/data/curriculum/packs/core3/curriculum/grade2.ts:195`)
   - **Text as it is:**
     - `lessons/grade2.ts:18`: `ideaHe: 'I\'m sorry פירושו "אני מצטער" או "אני מצטערת": אומרים את זה כשעושים טעות. Excuse me פירושו "סליחה": אומרים את זה כשפונים למישהו או רוצים לעבור.'`
     - `lessons/grade2.ts:28`: `{ en: 'I\'m sorry, Dan!', he: 'סליחה, דן!', highlight: 'I\'m sorry', emoji: '😢' }`
     - `curriculum/grade2.ts:194–195`: `voiceEn: 'Sorry, I lost your pencil.', voiceHe: 'סליחה, איבדתי את העיפרון שלך.'`
   - **What is wrong:** The lesson explicitly teaches 7-year-old learners to distinguish `I'm sorry` (`אני מצטער/ת`) from `Excuse me` (`סליחה`), but its first example immediately translates `I'm sorry, Dan!` as `סליחה, דן!`—identical to the `Excuse me` translations in the next two examples.
   - **Suggested fix:** Change `lessons/grade2.ts:28` `he` to `'אני מצטער/ת, דן!'` and `curriculum/grade2.ts:195` `voiceHe` to `'אני מצטער/ת, איבדתי את העיפרון שלך.'`.

2. **[should fix] Master sentence-builder in `g2-u23-m3` has 12 chips (including two comma chips) for Grade 2 emergent readers**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade2.ts:292–294`
   - **Text as it is:**
     ```ts
     sentenceEn: 'Excuse me, can I have some cake, please?',
     sentenceHe: 'סליחה, אפשר לקבל קצת עוגה, בבקשה?',
     decoys: ['has', 'cakes'],
     ```
   - **What is wrong:** Grade 2 learners barely read (`CLAUDE.md` / curriculum guidelines). Because `splitWordsAndCommas` turns every comma into a separate `COMMA_CHIP` (`,`), this 8-word, 2-comma sentence plus 2 decoys produces **12 tiles** in the bank, including two identical `,` chips that must both be placed correctly.
   - **Suggested fix:** Shorten `sentenceEn` to one polite marker with at most one comma (e.g., `'Can I have some cake, please?'` / `'אפשר לקבל קצת עוגה, בבקשה?'`).

3. **[should fix] `g2-u23-m3` Master `errorFix` and `examBank/grade2.ts` test untaught grammar (`We wait` vs. `We waits` and `How are you?` inversion)**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade2.ts:297–303` and `src/data/curriculum/packs/core3/examBank/grade2.ts:78–90`
   - **Text as it is:**
     - `curriculum/grade2.ts:299`: `correct: 'We wait for our friends.', wrong: ['We waits for our friends.', 'We wait to our friends.', 'We for wait our friends.']`
     - `examBank/grade2.ts:79`: `correct: 'How are you, Grandpa?', wrong: ['How you are, Grandpa?', 'How is you, Grandpa?']`
     - `examBank/grade2.ts:86`: `correct: 'We wait for Grandma.', wrong: ['We wait Grandma for.', 'We waits for Grandma.']`
   - **What is wrong:** `lessons/grade2.ts` only teaches polite formulas (`Can I have …, please?`, `Thank you`, `You're welcome`, `I'm sorry`, `Excuse me`). Present Simple verb agreement (`wait` vs. `waits`) and Wh-question inversion (`How are you?`) are not taught in the unit's lessons.
   - **Suggested fix:** Replace these grammar items with questions testing the unit's taught polite formulas (`Can I have …, please?`, `I'm sorry`, `Excuse me`, `Thank you` / `You're welcome`).

4. **[should fix] `examBank/grade2.ts` duplicates a grammar question verbatim from `curriculum/grade2.ts`**
   - **File & line:** `src/data/curriculum/packs/core3/examBank/grade2.ts:57–62` (duplicates `src/data/curriculum/packs/core3/curriculum/grade2.ts:235–240`)
   - **Text as it is:**
     ```ts
     questionEn: 'Your friend says, Thank you! What do you say?',
     correct: 'You\'re welcome!',
     ```
   - **What is wrong:** The header comment of `examBank/grade2.ts` states `"New questions only"`, but `grammar[1]` is identical in question and answer to `g2-u23-m3` `seed.rule`.
   - **Suggested fix:** Change the prompt scenario in `examBank/grade2.ts:57` (e.g., `'You give Mom a flower. She says, Thank you! What do you say?'`).

5. **[should fix] `g2-u23-m2` `shortSentenceEn` does not show the mission's polite-expression target**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade2.ts:138–139`
   - **Text as it is:**
     ```ts
     shortSentenceEn: 'My dog is lost.',
     shortSentenceHe: 'הכלב שלי הלך לאיבוד.',
     ```
   - **What is wrong:** Mission 2 teaches `I'm sorry` and `Excuse me`, but its Explorer sentence-builder drill (`shortSentenceEn`) contains neither expression.
   - **Suggested fix:** Change `shortSentenceEn` to `'I\'m sorry, I am late.'` (`'אני מצטער/ת, אני מאחר/ת.'`) or `'Excuse me, please.'`.

---

### Grade 3

1. **[must fix] Standalone `'know'` and `'color'` in `g3-u23-m3` and `examBank/grade3.ts` are outside Grade 3's `pre-band-1` list**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade3.ts:220–221, 290, 306` and `src/data/curriculum/packs/core3/examBank/grade3.ts:30–34`
   - **Text as it is:**
     - `curriculum/grade3.ts:220`: `['know', 'verb', 'לדעת / להכיר', '🤓', 'Do you know my teacher?', 'אתם מכירים את המורה שלי?'],`
     - `curriculum/grade3.ts:221`: `['color', 'noun', 'צבע', '🟧', 'What color is your bag?', 'באיזה צבע התיק שלך?'],`
     - `examBank/grade3.ts:30`: `clozeEn: 'My favorite ____ is green.', clozeHe: 'הצבע האהוב עליי הוא ירוק.', answer: 'color',`
   - **What is wrong:** In `docs/ministry-sources/raw/parsed/wordLists.json`, `pre-band-1` does **not** include standalone `'know'` or `'color'` (both are `band-1-core-1`, Grades 4–5). `pre-band-1` only includes the fixed conversational chunks `'Do you know …?'` and `'What color is your …?'`. Teaching `'color'` as a standalone noun leads `examBank/grade3.ts:30` to test `'My favorite ____ is green'` (which is outside `pre-band-1`), and `curriculum/grade3.ts:306` to use `'She does not know Hebrew well'`.
   - **Suggested fix:** Teach the `pre-band-1` chunks `'Do you know …?'` and `'What color is your …?'` (or replace them with `pre-band-1` words), and change `examBank/grade3.ts:30` to use the chunk `'What ____ is your bag?'`.

2. **[must fix] `g3-u23-m3` Master drills and `examBank/grade3.ts` test untaught Wh-questions with `be` (`What color is…?`, `Where are you from?`) and adverb placement (`We both have`) instead of `Do you …?`**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade3.ts:280–282, 285–291` and `src/data/curriculum/packs/core3/examBank/grade3.ts:78–90`
   - **Text as it is:**
     - `curriculum/grade3.ts:280`: `sentenceEn: 'What color is your new bike?', decoys: ['are', 'colors']`
     - `curriculum/grade3.ts:287`: `correct: 'Where are you from?', wrong: ['Where you are from?', 'Where is you from?', 'From where you are?']`
     - `examBank/grade3.ts:79`: `correct: 'Where is your teacher from?', wrong: ['Where your teacher is from?', 'Where are your teacher from?']`
     - `examBank/grade3.ts:86`: `correct: 'We both have a little dog.', wrong: ['We have both a little dog.', 'We both has a little dog.']`
   - **What is wrong:** Per `docs/content-packs-roadmap.md:153` and `lessons/grade3.ts`, Unit 23 teaches **`Do you like …?` and `Do you have …?` with `Yes, I do / No, I don't`**. Neither `lessons/grade3.ts` nor the unit's grammar heading teaches `Where is/are … from?` inversion or the mid-position placement of `both` (`We both have` vs. `We have both`).
   - **Suggested fix:** Replace these four items with `Do you like/have/know …?` questions and `Yes, I do / No, I don't` answers.

3. **[must fix] `g3-u23-m3` `seed.rule` explanation says to use a short answer (`Yes, I do / No, I don't`), but the marked answer is a full sentence**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade3.ts:235–240`
   - **Text as it is:**
     ```ts
     questionEn: 'You have no dog. Someone asks, Do you have a dog? Which answer is correct?',
     correct: 'No, I don\'t have a dog.',
     wrong: ['No, I doesn\'t have a dog.', 'No, I not have a dog.'],
     explainHe: 'על שאלה עם Do you…? עונים בקצרה: Yes, I do או No, I don\'t.',
     ```
   - **What is wrong:** `explainHe` tells the learner that the rule is the short answer `Yes, I do` or `No, I don't`, which does not match `correct` (`'No, I don\'t have a dog.'`) and fails to explain why `'No, I doesn\'t...'` and `'No, I not...'` are wrong.
   - **Suggested fix:** Either change `correct` to `'No, I don\'t.'` (and `wrong` to `['No, I doesn\'t.', 'No, I am not.']`) or update `explainHe` to `'בשלילה עם I אומרים don\'t (do not), לא doesn\'t ולא not לבד.'`.

4. **[should fix] `g3-u23-m1` and `g3-u23-m2` `shortSentenceEn` do not show the `Do you …?` grammar structure**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade3.ts:45, 131`
   - **Text as it is:**
     - Line 45: `shortSentenceEn: 'I like my pet.'`
     - Line 131: `shortSentenceEn: 'I have a net.'`
   - **What is wrong:** Both missions teach `Do you like/have …?`, but their Explorer sentence-builder sentences are affirmative statements (`I like…`, `I have…`).
   - **Suggested fix:** Change line 45 to `'Do you like pets?'` (`'אתם אוהבים חיות מחמד?'`) and line 131 to `'Do you have a net?'` (`'יש לכם רשת?'`).

5. **[should fix] Gloss order in `g3-u23-m2` (`both`) and `g3-u23-m3` (`know`) puts the example sentence's meaning second**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade3.ts:117, 220`
   - **Text as it is:**
     - Line 117: `['both', 'pronoun', 'שניהם / שנינו', '✌️', 'We both have a red bike.', 'לשנינו יש אופניים אדומים.']`
     - Line 220: `['know', 'verb', 'לדעת / להכיר', '🤓', 'Do you know my teacher?', 'אתם מכירים את המורה שלי?']`
   - **What is wrong:** The example sentences use `'שנינו'` and `'להכיר'`, which appear second in `translationHe`.
   - **Suggested fix:** Reorder `translationHe` to `'שנינו / שניהם'` (line 117) and `'להכיר / לדעת'` (line 220).

6. **[should fix] Singular `'שלך'` / `'לך'` in `g3-u23-m3` `vocab[1]`, `master.sentenceHe`, and `lessons/grade3.ts` `quickTry.promptHe`**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade3.ts:221, 281` and `src/data/curriculum/packs/core3/lessons/grade3.ts:33`
   - **Text as it is:**
     - `curriculum/grade3.ts:221`: `'What color is your bag?', 'באיזה צבע התיק שלך?'`
     - `curriculum/grade3.ts:281`: `sentenceHe: 'באיזה צבע האופניים החדשים שלך?'`
     - `lessons/grade3.ts:33`: `promptHe: 'איך שואלים "יש לך כדור?"'`
   - **What is wrong:** Standalone `you`/`your` sentences and lesson prompts in `g3-u23` otherwise use plural (`'אתם אוהבים...'`, `'יש לכם...'`, `'יש לשניכם את הספרים שלכם היום?'`, `'איך שואלים "אתם אוהבים גלידה?"'`), but these three lines switch to singular `'שלך'` / `'לך'`.
   - **Suggested fix:** Change `'שלך'` to `'שלכם'` in `curriculum/grade3.ts:221, 281` and `'יש לך כדור?'` to `'יש לכם כדור?'` in `lessons/grade3.ts:33`.

7. **[consider] UK `'football'` used for `'כדורגל'` in free prose**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade3.ts:150, 223, 247, 306–312` and `src/data/curriculum/packs/core3/examBank/grade3.ts:129, 136`
   - **Text as it is:** `'My dad is a big fan of football.'` / `'Tal and Ido play football.'`
   - **What is wrong:** While `'football'` appears in the Ministry's `pre-band-1` list, the app standardizes on US English (`soccer`).
   - **Suggested fix:** Consider using `'soccer'` (or `'basketball'` / `'ball'`) in free prose when `'football'` is not the target vocabulary item being drilled.

---

### Grade 4

1. **[must fix] Unidiomatic English in `examBank/grade4.ts` `vocabulary[2]`**
   - **File & line:** `src/data/curriculum/packs/core3/examBank/grade4.ts:24–25`
   - **Text as it is:**
     ```ts
     clozeEn: 'I am ____ because I have no breakfast.',
     clozeHe: 'אני רעב/ה כי אין לי ארוחת בוקר.',
     ```
   - **What is wrong:** `'because I have no breakfast'` is unnatural in English; native speakers say `'because I had no breakfast'`, `'because I didn\'t eat breakfast'`, or `'because it is lunch time'`.
   - **Suggested fix:** Change `clozeEn` to `'I am ____ because it is lunch time.'` (`'אני רעב/ה כי הגיע זמן ארוחת הצהריים.'`) or `'I am ____ because I have no food.'` (`'אני רעב/ה כי אין לי אוכל.'`).

2. **[should fix] Incorrect comma before restrictive `because` clauses in `lessons/grade4.ts` and `curriculum/grade4.ts`**
   - **File & line:** `src/data/curriculum/packs/core3/lessons/grade4.ts:33` and `src/data/curriculum/packs/core3/curriculum/grade4.ts:138, 196, 214`
   - **Text as it is:**
     - `lessons/grade4.ts:33` & `curriculum/grade4.ts:138`: `'Don\'t forget your hat, because it is hot.'`
     - `curriculum/grade4.ts:196`: `voiceEn: 'Don\'t forget your coat, because it is cold.'`
     - `curriculum/grade4.ts:214`: `'Shira says, "Tamar is not here, because she is sick."'`
   - **What is wrong:** Standard US punctuation does not place a comma before a restrictive `because` clause (`"Tamar is not here, because she is sick"` is particularly wrong because a comma after a negative main clause before `because` implies she *is* here for another reason). Moreover, `lessons/grade4.ts:22` teaches putting a comma before `but`, so showing a comma before `because` in `lessons/grade4.ts:33` misleads students into thinking `because` takes a comma too.
   - **Suggested fix:** Remove the comma before `because` in all four lines.

3. **[should fix] Singular `'מה דעתך'` / `'אתה רוצה'` in `curriculum/grade4.ts`**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade4.ts:35, 137`
   - **Text as it is:**
     - Line 35: `['hey', 'interjection', 'היי', '👋', 'Hey, Dan! Do you want to play?', 'היי, דן! אתה רוצה לשחק?']` (fine because addressed to Dan, though line 137 has no named addressee)
     - Line 137: `['how about', 'phrase', 'מה דעתך על…?', '🫴', 'I am bored. How about a game?', 'משעמם לי. מה דעתך על משחק?']`
   - **What is wrong:** Line 137 uses singular `'מה דעתך על…?'` in both the vocabulary gloss and the example translation, whereas the adjacent phrase on line 138 (`don't forget`) uses plural `'אל תשכחו'`.
   - **Suggested fix:** Change `'מה דעתך על…?'` / `'מה דעתך על משחק?'` on line 137 to `'מה דעתכם על…?'` / `'מה דעתכם על משחק?'`.

4. **[should fix] `g4-u23-m3` `shortSentenceEn` and 14 of 24 vocabulary `exampleEn` sentences in Grade 4 do not show the unit's conjunctions (`and, but, or, because`)**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade4.ts:33, 35, 36, 133, 135–137, 139, 233, 234, 236, 238–240, 246`
   - **Text as it is:**
     - Line 246 (`g4-u23-m3` `shortSentenceEn`): `'We are the same age.'`
     - Vocab examples without conjunctions: lines 33 (`anybody`), 35 (`hey`), 36 (`conversation`), 133 (`laugh`), 135 (`lie`), 136 (`once`), 137 (`how about`), 139 (`anywhere`), 233 (`group`), 234 (`often`), 236 (`age`), 238 (`meet`), 239 (`nice`), 240 (`someone`).
   - **What is wrong:** `g4-u23-m3` is the Boss mission for conjunctions, yet its `shortSentenceEn` (`'We are the same age.'`) has no conjunction, and more than half of the unit's vocabulary example sentences omit the target conjunctions.
   - **Suggested fix:** Change `g4-u23-m3` `shortSentenceEn` to `'We are young, but we are clever.'` (or `'I am busy because we have a test.'`) and add `and`/`but`/`or`/`because` clauses to the standalone vocabulary examples where natural.

5. **[should fix] `lessons/grade4.ts` reuses three exact sentences from `curriculum/grade4.ts` drills**
   - **File & line:** `src/data/curriculum/packs/core3/lessons/grade4.ts:16, 20, 29, 33` (duplicating `src/data/curriculum/packs/core3/curriculum/grade4.ts:32, 132, 138, 250`)
   - **Text as it is:** `'I fell, but I am all right.'`, `'Do you want tea or milk?'`, `'I am hungry because it is lunch time.'`, `'Don\'t forget your hat, because it is hot.'`
   - **What is wrong:** The mini-lesson shown right before each mission uses the exact same sentences that the mission then drills as vocabulary clozes and Explorer rule questions.
   - **Suggested fix:** Use fresh example sentences in `lessons/grade4.ts`.

6. **[should fix] Gloss order in `g4-u23-m3` `vocab[5]` (`meet`) puts the example sentence's meaning second**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade4.ts:238`
   - **Text as it is:** `['meet', 'verb', 'לפגוש / להיפגש', '🤝', 'I meet my friends at the park.', 'אני נפגש/ת עם החברים שלי בפארק.']`
   - **What is wrong:** `exampleHe` uses `'נפגש/ת'` (`להיפגש`), which is listed second in `translationHe`.
   - **Suggested fix:** Reorder `translationHe` to `'להיפגש / לפגוש'`.

7. **[consider] UK `'football'` used in `curriculum/grade4.ts` and `examBank/grade4.ts`**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade4.ts:47–49, 98, 102, 304, 309` and `src/data/curriculum/packs/core3/examBank/grade4.ts:51`
   - **Text as it is:** `'Gal likes football, but he does not like tennis.'` / `'Complete: "I like football, ____ I don\'t like tennis."'`
   - **What is wrong:** Uses British `'football'` instead of US `'soccer'`.
   - **Suggested fix:** Change `'football'` to `'soccer'` (or `'basketball'`).

---

### Grade 5

1. **[must fix] Singular-English vs. plural-Hebrew number mismatch in `"Will you be a singer…?"` across `curriculum/grade5.ts`, `lessons/grade5.ts`, and `examBank/grade5.ts`**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade5.ts:125–126` (`g5-u23-m2`, displayed as mission 7.2 in the map), `src/data/curriculum/packs/core3/lessons/grade5.ts:30`, and `src/data/curriculum/packs/core3/examBank/grade5.ts:94`
   - **Text as it is:**
     - `curriculum/grade5.ts:125–126`:
       ```ts
       sentenceEn: 'Will you be a singer in a band?',
       sentenceHe: 'אתם תהיו זמרים בלהקה?',
       ```
     - `lessons/grade5.ts:30`:
       ```ts
       { en: 'Will you be a singer?', he: 'אתם תהיו זמרים?', highlight: 'Will you', emoji: '🎤' },
       ```
     - `examBank/grade5.ts:94`:
       ```ts
       { en: 'Will you be a doctor or a singer?', he: 'אתם תהיו רופאים או זמרים?' },
       ```
   - **What is wrong:** Because of the plural `"you"` rule (`אתם`), the Hebrew translations use plural predicate nouns (`זמרים`, `רופאים או זמרים`), while the English sentences use singular predicate nouns with the indefinite article `a` (`a singer`, `a doctor or a singer` — one person). In a sentence-building or translation exercise, `"אתם תהיו זמרים בלהקה?"` means `"Will you be singers in a band?"`, not `"Will you be a singer in a band?"`.
   - **Suggested fix:** Either replace `be + a <singular noun>` with a verb or adjective that works identically in singular and plural (e.g., `curriculum/grade5.ts:125–126`: `'Will you sing in a band?'` / `'אתם תשירו בלהקה?'`; `lessons/grade5.ts:30`: `'Will you sing in the show?'` / `'אתם תשירו בהופעה?'`; `examBank/grade5.ts:94`: `'Will you study music or computers?'` / `'אתם תלמדו מוזיקה או מחשבים?'`), or make the English nouns plural (`'Will you be singers in a band?'`, `'Will you be singers?'`, `'Will you be doctors or singers?'`).

2. **[should fix] Singular `'שלך'` in `g5-u23-m2` `vocab[3]` (`band`) alongside plural `'אתם'` in the same mission**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade5.ts:131`
   - **Text as it is:**
     ```ts
     ['band', 'noun', 'להקה', '🎸', 'Will your band play at the party?', 'הלהקה שלך תנגן במסיבה?'],
     ```
   - **What is wrong:** Every other `you`/`your` question in `g5-u23-m2` uses plural (`'אתם תהיו...'`, `'תאפו עוגה...'`, `'תנסו איתי...'`, `'אתם תאפו עוגה?'`), but line 131 uses singular `'שלך'`.
   - **Suggested fix:** Change `'הלהקה שלך תנגן במסיבה?'` to `'הלהקה שלכם תנגן במסיבה?'`.

3. **[should fix] Two vocabulary `exampleEn` sentences in Grade 5 do not use `will` (the unit's target grammar)**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade5.ts:30, 232`
   - **Text as it is:**
     - Line 30 (`g5-u23-m1` `vocab[2]` `language`): `'Spanish is a beautiful language.'`
     - Line 232 (`g5-u23-m3` `vocab[3]` `understand`): `'Now I understand the question.'`
   - **What is wrong:** All other 22 vocabulary examples in Grade 5 Unit 23 model `Future with will`, but these two use Present Simple (`is`, `Now I understand`).
   - **Suggested fix:** Change line 30 to `'One day I will learn a new language.'` (`'יום אחד אלמד שפה חדשה.'`) and line 232 to `'Soon you will understand every word.'` (`'בקרוב תבינו כל מילה.'`).

4. **[should fix] `lessons/grade5.ts` reuses two exact vocabulary example sentences from `curriculum/grade5.ts` (including the default Challenger Step 1 cloze)**
   - **File & line:** `src/data/curriculum/packs/core3/lessons/grade5.ts:11, 31` (duplicating `src/data/curriculum/packs/core3/curriculum/grade5.ts:29, 128`)
   - **Text as it is:**
     - `'One day I will see the whole world.'` (`lessons/grade5.ts:11` & `curriculum/grade5.ts:29` `vocab[1]` — default `salt = 0` Challenger Step 1 cloze!)
     - `'When will the show begin?'` (`lessons/grade5.ts:31` & `curriculum/grade5.ts:128` `vocab[0]`)
   - **What is wrong:** Showing `'One day I will see the whole world.'` in the mini-lesson right before `g5-u23-m1` gives away the exact sentence blanked in Challenger Step 1 (`'One day I will see the whole ____.'`).
   - **Suggested fix:** Replace those two examples in `lessons/grade5.ts` with different sentences (e.g., `'One day people will live on Mars.'` and `'When will the movie start?'`).

---

### Grade 6

1. **[must fix] Out-of-band words (`pre-band-1`) in Grade 6 cooking deck (`g6-core-3-cooking`)**
   - **File & line:** `src/data/wordDecks/grade6.ts:71–72`
   - **Text as it is:**
     ```ts
     { wordEn: 'add', translationHe: 'להוסיף', partOfSpeech: 'v', ministryList: 'pre-band-1', recProd: 'prod', ... },
     { wordEn: 'mix', translationHe: 'לערבב', partOfSpeech: 'v', ministryList: 'pre-band-1', recProd: 'rec', ... },
     ```
   - **What is wrong:** Grade 6 is in the Elementary Band I (`band-1-core-1` / `band-1-core-2`), and `docs/content-packs-roadmap.md` (§2 line 56) specifies: *"No word from outside the band's lists."* Both `'add'` and `'mix'` belong to `pre-band-1` (Grade 3) in `wordLists.json`.
   - **Suggested fix:** Replace `'add'` and `'mix'` in `g6-core-3-cooking` with `band-1-core-1` / `band-1-core-2` food/cooking words that are `prod`.

2. **[should fix] `g6-u23-m3` `shortSentenceEn`, `master.voiceEn`, and all 8 `g6-u23-m3` vocabulary `exampleEn` sentences contain no adverb of manner**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade6.ts:233–240, 246, 296` (plus `g6-u23-m1` lines 33–36 and `g6-u23-m2` lines 134–138)
   - **Text as it is:**
     - Line 246 (`g6-u23-m3` `shortSentenceEn`): `'We have enough players.'`
     - Line 296 (`g6-u23-m3` `master.voiceEn`): `'Hang on, we will rest for a while.'`
     - Lines 233–240 (`g6-u23-m3` `vocab[0..7]`): none of the 8 example sentences contain an adverb of manner.
   - **What is wrong:** `g6-u23-m3` is the Boss mission for Adverbs of Manner (`quickly`, `carefully`, `well`, `hard`, `fast`, `easily`), yet neither its `shortSentenceEn`, its `master.voiceEn`, nor any of its 8 vocabulary example sentences includes an adverb of manner.
   - **Suggested fix:** Add adverbs of manner to `g6-u23-m3` `shortSentenceEn` (e.g., `'Our players run fast.'`), `master.voiceEn` (e.g., `'Hang on, you are running too fast!'`), and the vocabulary example sentences where natural.

3. **[should fix] `lessons/grade6.ts` reuses three exact vocabulary example sentences from `curriculum/grade6.ts` (including `g6-u23-m2`'s default Challenger Step 1 cloze)**
   - **File & line:** `src/data/curriculum/packs/core3/lessons/grade6.ts:18, 29, 31` (duplicating `src/data/curriculum/packs/core3/curriculum/grade6.ts:32, 132, 133`)
   - **Text as it is:** `'Ron wins the race easily.'`, `'Maya sings very well.'`, `'Dan works hard every day.'`
   - **What is wrong:** The mini-lesson examples are identical to the mission vocabulary examples drilled immediately afterward (`'Dan works hard every day.'` is `vocab[1]`, the default Challenger Step 1 cloze in `g6-u23-m2`).
   - **Suggested fix:** Use distinct example sentences in `lessons/grade6.ts`.

4. **[should fix] UK vs. US mismatch in `wordDecks/grade6.ts` (`biscuit`)**
   - **File & line:** `src/data/wordDecks/grade6.ts:82`
   - **Text as it is:**
     ```ts
     { wordEn: 'biscuit', translationHe: 'עוגייה; ביסקוויט', partOfSpeech: 'n', ministryList: 'band-1-core-1', recProd: 'prod', exampleEn: 'We bake biscuits for the class party.', exampleHe: 'אנחנו אופים עוגיות למסיבת הכיתה.' },
     ```
   - **What is wrong:** While `'biscuit'` is the headword in `band-1-core-1`, in US English sweet `'עוגיות'` baked for a class party are `'cookies'` (US `'biscuits'` are savory bread rolls, and Israeli `'ביסקוויטים'` are dry tea biscuits bought in a packet, not baked for a class party).
   - **Suggested fix:** Put `'ביסקוויט; עוגייה'` with an example that fits both US/Israeli usage (e.g., `'I dip my biscuit in hot tea.'` / `'אני טובל/ת את הביסקוויט בתה חם.'`).

5. **[consider] UK `'football'` used in `examBank/grade6.ts`**
   - **File & line:** `src/data/curriculum/packs/core3/examBank/grade6.ts:107, 134`
   - **Text as it is:** `'Yoni loves football.'` / `wrong: ['Running.', 'Football.']`
   - **What is wrong:** Uses UK `'football'` instead of US `'soccer'`.
   - **Suggested fix:** Change `'football'` to `'soccer'` or `'basketball'`.

---

### Grade 7

1. **[must fix] Challenger Step 1 cloze in `g7-u23-m2` (`smell`) blanks `'smells'` and offers ungrammatical base form `'smell'`**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade7.ts:143`
   - **Text as it is:**
     ```ts
     ['smell', 'verb', 'להריח / ריח', '👃', 'The fresh bread smells wonderful.', 'הלחם הטרי מריח נפלא.'],
     ```
   - **What is wrong:** `toClozeSentence('The fresh bread smells wonderful.', 'smell')` produces `'The fresh bread ____ wonderful.'`, and Challenger Step 1 (`challengerSteps.ts:35`) presents `'smell'` (alongside `'swim'` and `'write'`) as the correct answer—yielding the ungrammatical sentence **`"The fresh bread smell wonderful."`**
   - **Suggested fix:** Rewrite `exampleEn` so `'smell'` appears in its base form (e.g., `'The fresh cookies smell wonderful.'` / `'העוגיות הטריות מריחות נפלא.'` or `'I can smell the fresh bread from here.'`).

2. **[must fix] British `'purse'` used for a man's wallet in `curriculum/grade7.ts` and `examBank/grade7.ts`**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade7.ts:113` and `src/data/curriculum/packs/core3/examBank/grade7.ts:103, 121`
   - **Text as it is:**
     - `curriculum/grade7.ts:113`: `'One morning, an old man came in and sat by the window... Then he said quietly, "I would like a cup of tea, but I left my purse at home."'`
     - `examBank/grade7.ts:103, 121`: `'When the bill comes, Dad looks for his purse.'` / `correct: 'Dad cannot find his purse.'`
   - **What is wrong:** In US English (the app's standard), a `'purse'` is a woman's handbag (`ארנק נשים / תיק יד`), never a man's wallet. Having an old man and Dad say they left or looked for their `'purse'` is a Britishism that sounds wrong in US English.
   - **Suggested fix:** Change the character in `curriculum/grade7.ts:113` to `'an old woman'` (`she`/`her purse`) and change `Dad` in `examBank/grade7.ts:103–121` to `'Mom'` (`'Mom looks for her purse'` / `'Mom cannot find her purse'`).

3. **[must fix] Challenger Step 1 cloze in `g7-u23-m3` (`Why not?`) strips the closing question mark inside quotes**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade7.ts:246`
   - **Text as it is:**
     ```ts
     ['Why not?', 'phrase', 'למה לא?', '🙂', '"Let\'s have breakfast at the café." "Why not?"', '"בואו נאכל ארוחת בוקר בבית הקפה." "למה לא?"'],
     ```
   - **What is wrong:** Because `wordEn` includes `'?'`, `toClozeSentence` replaces `'Why not?'` with `'____'`, rendering the prompt as `'"Let\'s have breakfast at the café." "____"'` with an unpunctuated blank inside quotation marks.
   - **Suggested fix:** Store `wordEn` without the question mark (`'why not'`) and keep `'?'` in `exampleEn` (`'"Let\'s have breakfast at the café." "Why not?"'` with `clozeWrong: [['how old', 'what color']]`), or place `'?'` outside the blank.

4. **[should fix] `g7-u23-m3` `master.voiceEn` and 13 of 16 vocabulary `exampleEn` sentences in `g7-u23-m1` and `g7-u23-m3` do not show the target grammar (`would like/love/prefer` or reflexive pronouns)**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade7.ts:29, 31–36, 240–246, 304`
   - **Text as it is:**
     - Line 304 (`g7-u23-m3` `master.voiceEn`): `'Too bad, the cake is finished.'`
     - Lines 29, 31–36 (`g7-u23-m1` `vocab[0, 2..7]`) and lines 240–246 (`g7-u23-m3` `vocab[1..7]`): none of these 13 example sentences use `would like/love/prefer` or a reflexive pronoun.
   - **What is wrong:** `g7-u23-m3` is the Boss mission combining `would like/love/prefer` and reflexive pronouns, yet `master.voiceEn` and almost all vocabulary examples in `m1` and `m3` omit both structures.
   - **Suggested fix:** Change `g7-u23-m3` `master.voiceEn` to `'Too bad, I would love some cake.'` and incorporate `would like/love/prefer` or reflexive pronouns into the `m1`/`m3` vocabulary examples where natural (e.g., `'Can I have a medium orange juice?'` -> `'I would like a medium orange juice, please.'`).

5. **[should fix] Gloss order in `g7-u23-m2` `vocab[6]` (`pleasure`) puts the example sentence's meaning second**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade7.ts:142`
   - **Text as it is:** `['pleasure', 'noun', 'הנאה / בשמחה (my pleasure)', '😊', '"Thank you for the tea!" "It\'s my pleasure."', '"תודה על התה!" "בשמחה."']`
   - **What is wrong:** `exampleEn` / `exampleHe` uses `'בשמחה (my pleasure)'`, which is listed second in `translationHe`.
   - **Suggested fix:** Reorder `translationHe` to `'בשמחה (my pleasure) / הנאה'`.

6. **[should fix] Singular-English `yourself` vs. plural-Hebrew `'אל תיכוו'` in `g7-u23-m2` `vocab[0]`**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade7.ts:137`
   - **Text as it is:**
     ```ts
     ['yourself', 'pronoun', 'את עצמך / בעצמך', '👉', "Be careful! Don't burn yourself on the hot cup.", 'זהירות! אל תיכוו מהכוס החמה.'],
     ```
   - **What is wrong:** Mission 2 explicitly teaches the difference between singular `yourself` (`vocab[0]`: `'את עצמך / בעצמך'`) and plural `yourselves` (`vocab[4]`, line 141: `'את עצמכם / בעצמכם'`, and `master.errorFix` line 318: `'Would you like to try the soup yourselves, kids?'`). Because the plural `"you"` rule was applied to `exampleHe`, `"Don't burn yourself"` was translated in the plural (`'אל תיכוו'`), which corresponds to `yourselves` rather than singular `yourself`.
   - **Suggested fix:** Name a singular addressee in `exampleEn`/`exampleHe` so singular `yourself` is unambiguous in both languages (e.g., `'Dan, be careful! Don\'t burn yourself on the hot cup.'` / `'דן, זהירות! אל תיכווה מהכוס החמה.'`).

---

### Grade 8

1. **[must fix] Challenger Step 1 cloze in `g8-u23-m2` and `g8-u23-m3` breaks on 5 inflected vocabulary items (`operate`, `control`, `vehicle`, `design`, `model`), teaching ungrammatical passive forms**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade8.ts:138, 139, 142, 143, 245`
   - **Text as it is:**
     - Line 138 (`operate`): `'The machine is operated by one worker.'` -> blanks to `'The machine is ____ by one worker.'` with correct option `'operate'`
     - Line 139 (`control`): `'The drone is controlled from a phone.'` -> blanks to `'The drone is ____ from a phone.'` with correct option `'control'`
     - Line 142 (`vehicle`): `'Electric vehicles are charged at home or at work.'` -> blanks to `'Electric ____ are charged at home or at work.'` with correct option `'vehicle'`
     - Line 143 (`design`): `'New apps are designed by young engineers in Tel Aviv.'` -> blanks to `'New apps are ____ by young engineers in Tel Aviv.'` with correct option `'design'`
     - Line 245 (`model`): `'Two new models are shown at the expo.'` -> blanks to `'Two new ____ are shown at the expo.'` with correct option `'model'`
   - **What is wrong:** When `toClozeSentence` replaces the inflected word (`operated`, `controlled`, `vehicles`, `designed`, `models`) with `____`, Challenger Step 1 forces the student to pick the uninflected headword (`'operate'`, `'control'`, `'vehicle'`, `'design'`, `'model'`)—producing **`"The machine is operate by one worker"`**, **`"The drone is control from a phone"`**, **`"New apps are design by young engineers"`**, **`"Electric vehicle are charged"`**, and **`"Two new model are shown"`**. The three verb items directly contradict the unit's Present Simple Passive (`is/are + V3`) rule!
   - **Suggested fix:** For the nouns (`vehicle`, `model`), use singular passive sentences in `exampleEn`: `'This electric vehicle is charged at home.'` and `'A new model is shown at the expo.'`. For the active base-form verbs (`operate`, `control`, `design`), either use base-form contexts in `exampleEn` while keeping passive in the rest of the sentence (e.g., `'One worker can operate the machine after it is checked.'`, `'You can control the drone after it is connected.'`, `'Young engineers design apps that are used worldwide.'`) or update `toClozeSentence`/`challengerSteps.ts` to display the inflected token from `exampleEn` as the option label.

2. **[should fix] Two vocabulary questions in `examBank/grade8.ts` have distractors whose grammatical form rules them out immediately**
   - **File & line:** `src/data/curriculum/packs/core3/examBank/grade8.ts:18–22, 30–34`
   - **Text as it is:**
     - Lines 18–22 (`vocab[1]`): `clozeEn: 'Only trained workers can ____ this big machine.', answer: 'operate', wrong: ['wrapped up', 'designed']`
     - Lines 30–34 (`vocab[3]`): `clozeEn: 'A bus is a big ____ that carries many people.', answer: 'vehicle', wrong: ['tools', 'goods']`
   - **What is wrong:** In `vocab[1]`, `'can ____'` requires a base verb, and both distractors (`'wrapped up'`, `'designed'`) are `-ed` forms. In `vocab[3]`, `'a big ____ that carries'` requires a singular noun, and both distractors (`'tools'`, `'goods'`) are plural. A student can pick the right answer purely by grammar without knowing the vocabulary.
   - **Suggested fix:** Change `vocab[1]` `wrong` to base verbs `['wrap up', 'design']` and `vocab[3]` `wrong` to singular nouns `['tool', 'package']`.

3. **[should fix] `g8-u23-m3` `master.voiceEn` and 6 vocabulary `exampleEn` sentences in Grade 8 are active/copular rather than Present Simple Passive**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade8.ts:30, 34, 244, 247, 248, 250, 305`
   - **Text as it is:**
     - Line 305 (`g8-u23-m3` `master.voiceEn`): `'This tool is extremely practical.'`
     - Vocab examples without passive: line 30 (`'These shoes are expensive, but they are well-made.'`), line 34 (`'At the shop, they wrap up every gift in blue paper.'`), line 244 (`'Making paper is a long process.'`), line 247 (`'The new phone is extremely thin.'`), line 248 (`'Cherry tomatoes are now an everyday food in many countries.'`), line 250 (`'The new game is a big success in Israel and abroad.'`).
   - **What is wrong:** `g8-u23-m3` is the Boss mission for Present Simple Passive (`am/is/are + V3`), but `master.voiceEn` (`'This tool is extremely practical.'`) has `is + adjective`, not passive.
   - **Suggested fix:** Change `g8-u23-m3` `master.voiceEn` to `'This practical tool is made in Haifa.'` (`'הכלי השימושי הזה מיוצר בחיפה.'`).

4. **[should fix] Gloss order in `g8-u23-m3` `vocab[6]` (`practical`) puts the example sentence's meaning second**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade8.ts:249`
   - **Text as it is:** `['practical', 'adjective', 'מעשי / שימושי', '🧰', 'This bag is practical: it is used for school and for sport.', 'התיק הזה שימושי: משתמשים בו לבית הספר ולספורט.']`
   - **What is wrong:** `exampleHe` uses `'שימושי'`, which is second in `translationHe`.
   - **Suggested fix:** Reorder `translationHe` to `'שימושי / מעשי'`.

---

### Grade 9

1. **[must fix] Challenger Step 1 cloze in `g9-u23-m2` and `g9-u23-m3` breaks on 3 inflected vocabulary items (`accept`, `expectation`, `persuade`)**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade9.ts:137, 244, 245`
   - **Text as it is:**
     - Line 137 (`accept`): `'A good team accepts players who are different.'` -> blanks to `'A good team ____ players who are different.'` with correct option `'accept'`
     - Line 244 (`expectation`): `'My parents have high expectations of me.'` -> blanks to `'My parents have high ____ of me.'` with correct option `'expectation'`
     - Line 245 (`persuade`): `'My friend persuaded me to join the drama club.'` -> blanks to `'My friend ____ me to join the drama club.'` with correct option `'persuade'`
   - **What is wrong:** `toClozeSentence` strips `-s`/`-ed` and offers the uninflected headwords `'accept'`, `'expectation'`, and `'persuade'`, producing ungrammatical sentences (**`"A good team accept players..."`**, **`"My parents have high expectation of me"`**, and **`"My friend persuade me..."`**).
   - **Suggested fix:** Rewrite the three `exampleEn` sentences so the headword appears in its exact base form:
     - Line 137: `'Good teams accept players who are different.'` (`'קבוצות טובות מקבלות שחקנים שהם שונים.'`)
     - Line 244: `'There is a high expectation that everyone will help.'` (or `'One expectation at our school is that everyone helps.'`)
     - Line 245: `'My friends always persuade me to join their games.'` (or `'Can I persuade you to join the drama club that meets on Mondays?'`)

2. **[should fix] `g9-u23-m3` `shortSentenceEn`, `master.voiceEn`, and 14 of 24 vocabulary `exampleEn` sentences in Grade 9 contain no relative clause**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade9.ts:32, 35, 134–136, 138, 140, 240–245, 247, 254, 305`
   - **Text as it is:**
     - Line 254 (`g9-u23-m3` `shortSentenceEn`): `'This is my opinion.'`
     - Line 305 (`g9-u23-m3` `master.voiceEn`): `'In my opinion, every human is special.'`
     - 14 vocabulary examples across `m1`, `m2`, `m3` (e.g., `'My diary is private, so please don\'t read it.'`, `'To be honest, the test was easier than we expected.'`) have no relative pronoun (`who`, `which`, `that`, `where`).
   - **What is wrong:** `g9-u23-m3` is the Boss mission for Relative Clauses (`who, which, that, where`), yet neither `shortSentenceEn`, `master.voiceEn`, nor 7 of its 8 vocabulary examples include a relative clause.
   - **Suggested fix:** Change `g9-u23-m3` `shortSentenceEn` to `'I respect people who are honest.'` (`'אני מכבד/ת אנשים שהם כנים.'`), `master.voiceEn` to `'In my opinion, a friend who listens is special.'`, and add relative clauses to the standalone vocabulary examples where natural.

3. **[should fix] Gloss order in `wordDecks/grade9.ts` (`sale`) and `curriculum/grade9.ts` (`nationality`) puts the example sentence's meaning second**
   - **File & line:** `src/data/wordDecks/grade9.ts:84` and `src/data/curriculum/packs/core3/curriculum/grade9.ts:29`
   - **Text as it is:**
     - `wordDecks/grade9.ts:84`: `{ wordEn: 'sale', translationHe: 'מכירה; מבצע', ..., exampleEn: 'Shoes are on sale this week.', exampleHe: 'השבוע יש מבצע על נעליים.' }`
     - `curriculum/grade9.ts:29`: `['nationality', 'noun', 'לאום / אזרחות', '🪪', 'People who live in Israel can have more than one nationality.', 'לאנשים שגרים בישראל יכולה להיות יותר מאזרחות אחת.']`
   - **What is wrong:** The prompt specifies: *"Glosses in the decks should give the meaning used in the example sentence first."* In `sale`, `'מבצע'` is used in the example but listed second (`'מכירה; מבצע'`). In `nationality`, `'אזרחות'` is used in the example but listed second (`'לאום / אזרחות'`).
   - **Suggested fix:** Reorder to `'מבצע; מכירה'` (`wordDecks/grade9.ts:84`) and `'אזרחות / לאום'` (`curriculum/grade9.ts:29`).

---

### Grade 10

1. **[must fix] Challenger Step 1 cloze in `g10-u23-m2` and `g10-u23-m3` breaks on 3 `-ing` verbs (`rescue`, `educate`, `quit`)—including the default `salt = 0` question in `g10-u23-m2`—teaching ungrammatical Future/Present Continuous forms**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade10.ts:136, 137, 245`
   - **Text as it is:**
     - Line 136 (`rescue`): `'Next summer, volunteers will be rescuing sea turtles on the beach at night.'` -> blanks to `'Next summer, volunteers will be ____ sea turtles on the beach at night.'` with correct option `'rescue'`
     - Line 137 (`educate`, `vocab[1]` — default `salt = 0` Challenger Step 1!): `'During her service year, Maya will be educating young children about saving water.'` -> blanks to `'During her service year, Maya will be ____ young children about saving water.'` with correct option `'educate'`
     - Line 245 (`quit`): `'Noam is quitting his job in May because he is traveling to India.'` -> blanks to `'Noam is ____ his job in May because he is traveling to India.'` with correct option `'quit'`
   - **What is wrong:** `toClozeSentence` replaces `'rescuing'`, `'educating'`, and `'quitting'` with `'____'`, and Challenger Step 1 offers the bare base verbs `'rescue'`, `'educate'`, and `'quit'` as the correct choices—forcing the learner to build **`"volunteers will be rescue sea turtles"`**, **`"Maya will be educate young children"`**, and **`"Noam is quit his job"`**, which are the exact ungrammatical forms that the unit's grammar rules mark wrong!
   - **Suggested fix:** Rewrite those three `exampleEn` sentences so the headword is in its base form while another verb in the sentence carries the Future Continuous / Present Continuous for future:
     - Line 136: `'Next summer, we will be working with volunteers who rescue sea turtles.'`
     - Line 137: `'During her service year, Maya will be helping teachers educate young children.'`
     - Line 245: `'Noam is traveling to India in May, so he plans to quit his job.'`

2. **[must fix] UK `'paid holidays'` used for `'חופשה בתשלום'` in `wordDecks/grade10.ts` (`entitle`), plus gloss order reversed**
   - **File & line:** `src/data/wordDecks/grade10.ts:84`
   - **Text as it is:**
     ```ts
     { wordEn: 'entitle', translationHe: 'להעניק זכות; להיות זכאי ל־', partOfSpeech: 'v', ministryList: 'band-3-core-2', recProd: 'prod', exampleEn: 'Every worker is entitled to paid holidays.', exampleHe: 'כל עובד זכאי לחופשה בתשלום.' },
     ```
   - **What is wrong:** In US English, `'חופשה בתשלום'` (annual leave) is `'paid vacation'` or `'paid time off'` (`'paid holidays'` in US English means public/federal holidays such as Labor Day). In addition, the example uses `'להיות זכאי ל־'`, which is placed second in `translationHe` (`'להעניק זכות; להיות זכאי ל־'`).
   - **Suggested fix:** Change `translationHe` to `'להיות זכאי ל־; להעניק זכות'` and `exampleEn` to `'Every worker is entitled to paid vacation.'`.

3. **[should fix] Gloss order in `wordDecks/grade10.ts` (`estate`, `reduction`) puts the example sentence's meaning second**
   - **File & line:** `src/data/wordDecks/grade10.ts:75, 78`
   - **Text as it is:**
     - Line 75 (`estate`): `translationHe: 'אחוזה; נכסים', ..., exampleEn: 'Her uncle works in real estate.', exampleHe: 'הדוד שלה עובד בתחום הנדל״ן.'`
     - Line 78 (`reduction`): `translationHe: 'הפחתה; הנחה', ..., exampleEn: 'Students get a reduction on bus tickets.', exampleHe: 'סטודנטים מקבלים הנחה על כרטיסי אוטובוס.'`
   - **What is wrong:** In line 75, `'אחוזה'` (country mansion) is first, while the example uses `'real estate'` (`נדל״ן / נכסים`). In line 78, `'הפחתה'` is first, while `exampleHe` uses `'הנחה'`.
   - **Suggested fix:** Change line 75 `translationHe` to `'נכסים (נדל״ן); אחוזה'` and line 78 `translationHe` to `'הנחה; הפחתה'`.

4. **[should fix] Internal timeline contradiction in `g10-u23-m3` Master story (`third of March` + `first week` -> `On the eighth`) and 7 of 8 `g10-u23-m3` vocab examples lack the target future forms**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade10.ts:243, 244, 246–250, 329`
   - **Text as it is:**
     - Line 329: `'The tickets are booked: they are flying to Lima on the third of March. The problem is the first week... During the first week, Ido will be climbing with a local guide, and Lihi will be learning to surf. On the eighth, they are meeting in Cusco.'`
   - **What is wrong:** Flying to Lima on March 3 and meeting in Cusco after `"the first week"` would be March 10 (or March 11), not `"On the eighth"` (which is only 5 days after March 3, including the flight to Lima and travel to the mountains/Cusco). Also, 7 of the 8 vocabulary `exampleEn` sentences in `g10-u23-m3` (lines 243, 244, 246–250) do not use either Present Continuous for future or Future Continuous (`will be + V-ing`).
   - **Suggested fix:** Change `'On the eighth'` on line 329 to `'On the tenth'` (or `'A week later, on the tenth'`), and incorporate future arrangements / `will be + V-ing` into the `g10-u23-m3` vocabulary examples.

---

### Grade 11

1. **[must fix] Challenger Step 1 cloze in `g11-u23-m1`, `g11-u23-m2`, and `g11-u23-m3` breaks on 5 inflected verbs (`rob`, `chase`, `frighten`, `calculate`, `punish`)**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade11.ts:30, 33, 37, 136, 249`
   - **Text as it is:**
     - Line 30 (`rob`): `'Two men robbed the jewelry shop after they had been watching it for days.'` -> blanks to `'Two men ____ the jewelry shop after they had been watching it for days.'` with correct option `'rob'`
     - Line 33 (`chase`): `'The police officer had been chasing the thief for ten minutes when he finally caught him.'` -> blanks to `'The police officer had been ____ the thief for ten minutes...'` with correct option `'chase'`
     - Line 37 (`frighten`): `'The strange noises frightened the children, who had been sleeping in the tent.'` -> blanks to `'The strange noises ____ the children, who had been sleeping in the tent.'` with correct option `'frighten'`
     - Line 136 (`calculate`): `'We calculated how long the experiment had been running.'` -> blanks to `'We ____ how long the experiment had been running.'` with correct option `'calculate'`
     - Line 249 (`punish`): `'The court punished the company that had been polluting the river.'` -> blanks to `'The court ____ the company that had been polluting the river.'` with correct option `'punish'`
   - **What is wrong:** `toClozeSentence` replaces the inflected verbs (`robbed`, `chasing`, `frightened`, `calculated`, `punished`) with `____` and Challenger Step 1 offers the bare base form as the answer—producing **`"The police officer had been chase the thief"`** (violating the unit's `had been + V-ing` rule!), **`"The court punish the company"`** (ungrammatical in any tense), and present-tense **`"rob"` / `"frighten"` / `"calculate"`** clashing with past perfect continuous clauses (`had been watching` / `had been sleeping` / `had been running`).
   - **Suggested fix:** Rewrite these five `exampleEn` sentences so the headword appears in its base form after `to` / a modal (`did`, `could`, `had to`, `tried to`):
     - Line 30: `'Two men tried to rob the jewelry shop after they had been watching it for days.'`
     - Line 33: `'The police officer had to chase the thief who had been hiding in the shop.'`
     - Line 37: `'The strange noises began to frighten the children, who had been sleeping in the tent.'`
     - Line 136: `'We tried to calculate how long the experiment had been running.'`
     - Line 249: `'The court decided to punish the company that had been polluting the river.'`

2. **[should fix] Gloss order in `wordDecks/grade11.ts` (`look up to`) and blunt gloss for `pass away`**
   - **File & line:** `src/data/wordDecks/grade11.ts:77, 84`
   - **Text as it is:**
     - Line 77: `{ wordEn: 'look up to', translationHe: 'להעריך מאוד; לראות כמודל לחיקוי', ..., exampleHe: 'הרבה בני נוער רואים באחים הגדולים שלהם מודל לחיקוי.' }`
     - Line 84: `{ wordEn: 'pass away', translationHe: 'למות', ..., exampleEn: 'Her grandfather passed away last year.', exampleHe: 'סבא שלה נפטר בשנה שעברה.' }`
   - **What is wrong:** In line 77, `'לראות כמודל לחיקוי'` is the meaning used in `exampleHe` but is placed second. In line 84, `pass away` is a gentle euphemism (`'ללכת לעולמו; להיפטר'`, as translated in `exampleHe`: `'נפטר'`), whereas `translationHe` glosses it bluntly as `'למות'` (`die`).
   - **Suggested fix:** Change line 77 `translationHe` to `'לראות כמודל לחיקוי; להעריך מאוד'` and line 84 `translationHe` to `'להיפטר; ללכת לעולמו'`.

3. **[should fix] Half of the vocabulary `exampleEn` sentences in `g11-u23-m3` do not use Past Perfect Continuous (`had been + V-ing`)**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade11.ts:250–252, 254`
   - **Text as it is:**
     - Line 250 (`as a matter of fact`): `'As a matter of fact, the mayor had known about the problem for years.'`
     - Line 251 (`involvement`): `'The police are checking his involvement in the robbery.'`
     - Line 252 (`nonsense`): `'The manager said the story was nonsense, but the reporters had proof.'`
     - Line 254 (`urgent`): `'The editor sent us a very urgent message: the story was going online at six.'`
   - **What is wrong:** `g11-u23-m3` is the Boss mission for Past Perfect Continuous, but 4 of its 8 vocabulary example sentences do not use `had been + V-ing`.
   - **Suggested fix:** Revise lines 251, 252, and 254 to include `had been + V-ing` (e.g., `'The police had been checking his involvement in the robbery for weeks.'`).

4. **[consider] UK `'holiday'`, `'cinema'`, `'film'`, and `'shop'` used in Grade 11**
   - **File & line:** `src/data/curriculum/packs/core3/curriculum/grade11.ts:30, 58, 219, 224` and `src/data/curriculum/packs/core3/examBank/grade11.ts:12, 50`
   - **Text as it is:** `'Alexander Fleming came back from a holiday'` / `'before his holiday'` (`curriculum/grade11.ts:219, 224`); `'When we arrived at the cinema, the film ____ for ten minutes.'` (`examBank/grade11.ts:50`); `'jewelry shop'` (`curriculum/grade11.ts:30, 58`).
   - **What is wrong:** Uses British `'holiday'` (`vacation`), `'cinema'` (`movie theater`), `'film'` (`movie`), and `'shop'` (`store`).
   - **Suggested fix:** Replace with US equivalents (`'from a vacation'` / `'before his vacation'`, `'movie theater'`, `'movie'`, `'jewelry store'`).

---

### Grade 12

1. **[must fix] Three headwords in `wordDecks/grade12.ts` (`g12-core-3-time`) do not match `wordLists.json` in `npm run review:coverage`**
   - **File & line:** `src/data/wordDecks/grade12.ts:73, 83, 87`
   - **Text as it is:**
     - Line 73: `{ wordEn: 'by this time', ... ministryList: 'band-3-core-2', recProd: 'prod', ... }`
     - Line 83: `{ wordEn: 'the day before last', ... ministryList: 'band-3-core-2', recProd: 'prod', ... }`
     - Line 87: `{ wordEn: 'in the long term', ... ministryList: 'band-3-core-2', recProd: 'prod', ... }`
   - **What is wrong:** In `docs/ministry-sources/raw/parsed/wordLists.json`, the official `band-3-core-2` headwords are `'by this/that time'`, `'the day/week/year, etc. before last'`, and `'in the short/long term'`. Because `entryVariants` in `scripts/review/curriculumMatch/wordMatch.ts` splits on `/` around whitespace (producing `'by this'` and `'that time'`, etc.), `review:coverage` (`review-out/curriculum-coverage-with-core-3.json`) reports `'by this time'`, `'the day before last'`, and `'in the long term'` as `"inNoOfficialList"` and leaves the three official Band III Core II entries marked `"missing"`.
   - **Suggested fix:** Either use the official Ministry headwords (or add slash-phrase expansion in `wordMatch.ts` / `wordDecks` so `'by this/that time'` expands to `'by this time'` and `'by that time'`).

2. **[should fix] Gloss order in `wordDecks/grade12.ts` (`newly`, `cease`, `sustain`, `collapse`) puts the example sentence's meaning second, and 13 of 24 vocabulary `exampleEn` sentences in `curriculum/grade12.ts` omit the unit's sequencing/coordinating markers**
   - **File & line:** `src/data/wordDecks/grade12.ts:74, 75, 82, 90` and `src/data/curriculum/packs/core3/curriculum/grade12.ts:31, 33–36, 134, 135, 138, 141, 245, 250–252`
   - **Text as it is:**
     - `wordDecks/grade12.ts:74` (`newly`): `translationHe: 'זה עתה; לא מזמן'`, `exampleHe: 'הספרייה שנבנתה לא מזמן נפתחת ביום ראשון.'`
     - `wordDecks/grade12.ts:75` (`cease`): `translationHe: 'לחדול; להפסיק'`, `exampleHe: 'המפעל הפסיק את הייצור ב־2010.'`
     - `wordDecks/grade12.ts:82` (`sustain`): `translationHe: 'לקיים לאורך זמן; לשמר'`, `exampleHe: 'קשה לשמור על צמיחה מהירה כזאת לאורך זמן.'`
     - `wordDecks/grade12.ts:90` (`collapse`): `translationHe: 'להתמוטט; לקרוס'`, `exampleHe: 'הגשר הישן קרס אחרי הסערה.'`
   - **What is wrong:** In all four deck entries, `exampleHe` uses the second meaning in `translationHe` rather than the first. In `curriculum/grade12.ts`, 13 of the 24 vocabulary example sentences do not contain the mission's target sequencing markers (`first, then, after that, finally, to sum up`) or coordinating conjunctions (`and, but, or, so, yet`).
   - **Suggested fix:** Put the meaning used in `exampleHe` first (`'לא מזמן; זה עתה'`, `'להפסיק; לחדול'`, `'לשמר; לקיים לאורך זמן'`, `'לקרוס; להתמוטט'`), and include sequencing/coordinating markers in the `curriculum/grade12.ts` vocabulary examples where natural.

3. **[consider] UK `'film'` used in `examBank/grade12.ts`**
   - **File & line:** `src/data/curriculum/packs/core3/examBank/grade12.ts:77`
   - **Text as it is:** `questionEn: 'Complete: "The bus was late, ____ we missed the start of the film."'`
   - **What is wrong:** Uses UK `'film'` instead of US `'movie'`.
   - **Suggested fix:** Change `'film'` to `'movie'`.

---

## Verified Facts

Every factual claim across `core-3` (curriculum missions, lessons, exam banks, and word decks) was checked. All verified facts below are accurate (except for the internal March 3 -> March 8 "first week" timeline slip in Grade 10 noted above).

| Grade & Location | Claim in Text | Verification Status & Source |
| :--- | :--- | :--- |
| **G5** `wordDecks/grade5.ts:70` | `"Israeli salad has tomatoes and cucumbers."` | **Verified.** Standard culinary definition of Israeli chopped salad (*salat katzutz*). |
| **G6** `wordDecks/grade6.ts:70` | `"On Independence Day, many families grill meat in the park."` | **Verified.** Well-known Israeli cultural tradition (*mangal* on Yom Ha'atzmaut). |
| **G6** `lessons/grade6.ts:33`, `examBank/grade6.ts:49` | `"The cheetah runs fast."` / `"The cheetah runs very quickly."` | **Verified.** The cheetah (*Acinonyx jubatus*) is the fastest land animal. |
| **G7** `wordDecks/grade7.ts:74` | `"In Italy, you pay in euros."` | **Verified.** Italy adopted the euro as its official currency (cash circulation began in 2002; European Central Bank). |
| **G7** `wordDecks/grade7.ts:75` | `"The Western Wall is one of the most famous sights in Jerusalem."` | **Verified.** Standard geographical and tourist fact. |
| **G7** `wordDecks/grade7.ts:76` | `"In Jerusalem, you can take the tram to the Old City."` | **Verified.** The Jerusalem Light Rail Red Line stops at City Hall (*Safra Square*) and Damascus Gate right by the Old City walls. |
| **G7** `wordDecks/grade7.ts:78` | `"Many tourists visit the churches of Nazareth."` | **Verified.** Nazareth in northern Israel is home to major Christian pilgrimage churches, including the Basilica of the Annunciation. |
| **G7** `wordDecks/grade7.ts:87` | `"We spent the day exploring the old port of Akko."` | **Verified.** Akko (Acre) has a historic ancient port on the Mediterranean coast. |
| **G8** `lessons/grade8.ts:16` | `"Bananas are grown near the Sea of Galilee."` | **Verified.** The Jordan Valley / Sea of Galilee (Kinneret) region is one of Israel's main commercial banana-growing areas (Israeli Ministry of Agriculture). |
| **G8** `curriculum/grade8.ts:35` | `"These dates are mainly grown in the Jordan Valley."` | **Verified.** Commercial date cultivation in Israel (especially Medjool dates) is concentrated along the Syrian-African Rift—primarily the Jordan Valley (including the Beit She'an / Dead Sea valleys, holding the largest share of plantations) and the Arava Valley (Israel Ministry of Agriculture / Hadiklaim). |
| **G8** `curriculum/grade8.ts:169–171` | `"Drip irrigation is an Israeli invention. Today, it is used by farmers in more than one hundred countries."` | **Verified.** Modern commercial drip irrigation was developed in Israel by Simcha Blass and commercialized with Kibbutz Hatzerim (Netafim, founded 1965); Netafim's systems are used in more than 100 (over 110) countries (Netafim corporate records / *Times of Israel*). |
| **G8** `curriculum/grade8.ts:219–223` | `"In a company in the north of Israel, a very special camera is made. The camera is the size of a pill, and it is swallowed by the patient..."` | **Verified.** The PillCam capsule endoscope was developed and manufactured by Given Imaging (now part of Medtronic), founded in 1998 and headquartered in Yokneam Illit in northern Israel (Medtronic / Wikipedia *Given Imaging*). |
| **G8** `curriculum/grade8.ts:248`, `examBank/grade8.ts:50, 99` | `"Cherry tomatoes are now an everyday food in many countries."` / `"These small tomatoes are grown in greenhouses in the south."` | **Verified.** Israeli agricultural researchers (Prof. Nahum Kedar and Prof. Chaim Rabinowitch at the Hebrew University Faculty of Agriculture) pioneered commercial long-shelf-life cherry varieties, and cherry tomatoes are widely grown in greenhouses in southern Israel (Besor/Negev/Arava) for domestic use and export to Europe. |
| **G8** `examBank/grade8.ts:43` | `"Hummus is made from chickpeas."` | **Verified.** Standard culinary fact. |
| **G8** `examBank/grade8.ts:71` | `"Olives are picked in October and November."` | **Verified.** The traditional olive harvest (*masik*) in Israel takes place in autumn, primarily October and November. |
| **G8** `examBank/grade8.ts:122–126` | `"An Israeli company makes a small device that helps blind people. The device is put on a pair of glasses. It reads signs, books and even faces... used in more than fifty countries, and it is controlled with one finger."` | **Verified.** Describes the OrCam MyEye assistive wearable camera developed by Jerusalem-based OrCam Technologies (founded 2010 by Prof. Amnon Shashua and Ziv Aviram), which mounts on glasses frames, reads text and recognizes faces into the user's ear, responds to pointing/touch with a finger, and is distributed in more than 50 countries (OrCam Technologies). |
| **G8** `wordDecks/grade8.ts:76` | `"The State of Israel was established in 1948."` | **Verified.** The State of Israel was proclaimed on May 14, 1948 (5 Iyar 5708). |
| **G8** `wordDecks/grade8.ts:77` | `"Akko is an old city in northern Israel."` | **Verified.** Akko (Acre) is a historic port city on the northern Mediterranean coast of Israel. |
| **G8** `wordDecks/grade8.ts:78` | `"Be'er Sheva is the largest city in southern Israel."` | **Verified.** Be'er Sheva is the largest city in the Negev / Southern District of Israel (Israel Central Bureau of Statistics). |
| **G8** `wordDecks/grade8.ts:79` | `"The Western Wall is about two thousand years old."` | **Verified.** The Western Wall was built as a retaining wall of the Temple Mount during King Herod's expansion of the Second Temple (begun c. 20–19 BCE), making it roughly 2,000 years old (Encyclopaedia Britannica / Israel Antiquities Authority). |
| **G8** `wordDecks/grade8.ts:80` | `"Long ago, traders carried spices along this route through the Negev."` | **Verified.** The Nabataean Incense and Spice Route across the Negev Desert connected Arabia to the Mediterranean from roughly the 3rd century BCE to the 2nd century CE (UNESCO World Heritage Site: *Incense Route – Desert Cities in the Negev*). |
| **G8** `wordDecks/grade8.ts:81` | `"Columbus sailed to America in 1492."` | **Verified.** Christopher Columbus made his first transatlantic voyage to the Americas in August–October 1492. |
| **G8** `wordDecks/grade8.ts:83` | `"Each state in the USA has its own flag."` | **Verified.** All 50 US states have their own official state flags. |
| **G8** `wordDecks/grade8.ts:85` | `"Israel and Egypt signed a peace agreement in 1979."` | **Verified.** The Egypt–Israel Peace Treaty was signed in Washington, D.C., on March 26, 1979, by Menachem Begin and Anwar Sadat (Knesset Archives / Britannica). |
| **G8** `wordDecks/grade8.ts:86` | `"David Ben-Gurion was the head of Israel's first government."` | **Verified.** David Ben-Gurion served as Israel's first Prime Minister, heading both the Provisional Government (1948–1949) and the first elected government (1949) (Knesset official website). |
| **G8** `wordDecks/grade8.ts:87` | `"The first Knesset election took place in 1949."` | **Verified.** Israel's first national election (to the Constituent Assembly, shortly renamed the First Knesset) was held on January 25, 1949 (Knesset official website). |
| **G8** `wordDecks/grade8.ts:92` | `"The Roman army destroyed the Second Temple in 70 CE."` | **Verified.** Roman legions commanded by Titus besieged Jerusalem and destroyed the Second Temple in August 70 CE (Encyclopaedia Britannica). |
| **G9** `curriculum/grade9.ts:29` | `"People who live in Israel can have more than one nationality."` | **Verified.** Israeli law (the Nationality Law, 1952) permits dual/multiple citizenship. |
| **G9** `curriculum/grade9.ts:134` | `"In Jerusalem, there are holy places of more than one religion."` | **Verified.** Jerusalem contains holy sites for Judaism, Islam, and Christianity. |
| **G9** `curriculum/grade9.ts:154` | `"Hanukkah is a holiday which is celebrated with candles."` | **Verified.** Hanukkah is celebrated by lighting the eight-branched *hanukkiah* over eight nights. |
| **G9** `wordDecks/grade9.ts:74` | `"Tourism is important for the economy of Eilat."` | **Verified.** Eilat is Israel's premier Red Sea resort city, whose economy relies heavily on domestic and international tourism. |
| **G9** `wordDecks/grade9.ts:75` | `"The currency of Israel is the shekel."` | **Verified.** The New Israeli Shekel (ILS / ₪) is the official currency of Israel (Bank of Israel). |
| **G10** `curriculum/grade10.ts:329` | `"they are flying to Lima ... meeting in Cusco."` (Peru geography) | **Verified (geography).** Lima is the capital and main international airport hub of Peru on the Pacific coast, and Cusco is the major city in the Peruvian Andes (note: the 5-day March 3 -> March 8 timeline for `"the first week"` is flagged under Grade 10 Finding #4). |
| **G10** `examBank/grade10.ts:122` | `"Many Israeli teenagers take a gap year before the army. Some work and save money, while others volunteer in poor towns or nature reserves."` | **Verified.** Pre-army service year (*shnat sherut*) and pre-military academies (*mechinot*) or working before draft are standard post-high-school paths in Israel. |
| **G11** `curriculum/grade11.ts:219–223` | `"In 1928, Alexander Fleming came back from a holiday to his laboratory in London. Before he left, he had been growing bacteria in small glass dishes. He noticed that a blue-green mold had been growing on one of the dishes, and that around the mold, the bacteria had died... led to penicillin..."` | **Verified.** In September 1928, Scottish bacteriologist Alexander Fleming returned from vacation to his laboratory at St Mary's Hospital in London and observed that a contaminating blue-green mold (*Penicillium notatum*) on a *Staphylococcus* culture plate had created a bacteria-free halo around itself, leading to his discovery of penicillin (Encyclopaedia Britannica / Nobel Prize biography). |
| **G11** `examBank/grade11.ts:122–126` | `"water in a small salt lake turned bright pink... scientists tested the water and found that tiny living things were causing the color. These living things grow well in very salty water, and the lake had been getting saltier because there had been no rain for months."` | **Verified.** Hypersaline lakes and ponds turn bright pink/red when high salinity triggers blooms of halophilic microorganisms—specifically the microalga *Dunaliella salina* and halophilic archaea (*Halobacteria*)—which produce red/pink beta-carotene and bacteriorhodopsin pigments (documented in salt lakes in Israel, Australia, and Senegal). |
| **G12** `wordDecks/grade12.ts:80` | `"His grandparents settled in Haifa in the 1950s."` | **Verified.** Historically plausible (mass immigration to Israel during the 1950s). |
