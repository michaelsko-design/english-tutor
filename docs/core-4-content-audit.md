# core-4 ("עונה 4") content audit

Independent review of the core-4 pack, run 2026-11-23 against the brief in `docs/core-4-content-audit-prompt.md`. Four reviewers worked in parallel (grades 2–4, 5–7, 8–10, 11–12 + pack settings); none of them wrote the content, and no file under `src/` was changed. Paths in the findings are relative to `src/data/` (or `src/data/curriculum/packs/core4/` where a band's section says so).

## Summary

**182 findings: 15 must fix, 89 should fix, 78 consider.**

| Grade | Must fix | Should fix | Consider |
|---|---|---|---|
| 2 | 0 | 2 | 8 |
| 3 | 0 | 8 | 5 |
| 4 | 3 | 10 | 8 |
| 5 | 1 | 5 | 7 |
| 6 | 2 | 6 | 8 |
| 7 | 1 | 11 | 7 |
| 8 | 1 | 9 | 6 |
| 9 | 1 | 8 | 3 |
| 10 | 1 | 10 | 6 |
| 11 | 2 | 10 | 11 |
| 12 | 3 | 10 | 8 |
| Pack settings | 0 | 0 | 1 |
| **Total** | **15** | **89** | **78** |

Per-category counts for each band are under "Counts by category" at the end of this report.

### Must fix (15)

| # | Grade | Where | Problem |
|---|---|---|---|
| 1 | 4 | `examBank/grade4.ts:42–45` | "We are going to the beach ____." — wrong option `together` also fits. |
| 2 | 4 | `examBank/grade4.ts:36–39` | "In winter it gets dark in the ____." — wrong option `storm` also fits. |
| 3 | 4 | `examBank/grade4.ts:129, 140–143` | Passage says "hot summer afternoon"; marked answer is "Because it is early". |
| 4 | 5 | `examBank/grade5.ts:123` | Wrong option "After soccer practice." is also true from the passage. |
| 5 | 6 | `examBank/grade6.ts:36–39` | "…so we left ____." — wrong option `alone` also fits. |
| 6 | 6 | `curriculum/grade6.ts:323` | "she nearly floated like a boat" — in the Dead Sea you float easily. |
| 7 | 7 | `curriculum/grade7.ts:215` | "was in trouble with a science project" → "had trouble with". |
| 8 | 8 | `curriculum/grade8.ts:111` | "she told me that's all right" breaks the reported speech being taught → "that it was all right". |
| 9 | 9 | `examBank/grade9.ts:129` | "The facility opened lately" → "opened recently". |
| 10 | 10 | `curriculum/grade10.ts:137` | "The doors stay closed, and you cannot leave, not until the alarm stops." — ungrammatical and unsafe advice during a fire alarm. |
| 11 | 11 | `curriculum/grade11.ts:54` | "predicted that by 2050, robots will have taken over" — mission 2 of the same unit marks "thought that … will" as wrong. |
| 12 | 11 | `curriculum/grade11.ts:216` | "many people believed … everyone would fly to work" overstates the 1900 predictions; the story's logic doesn't hold. |
| 13 | 12 | `curriculum/grade12.ts:94–96` | Master decoys `will` + `hurts` build a correct first conditional. |
| 14 | 12 | `curriculum/grade12.ts:213` | Story calls the unsold-food law "unfair to small shops", but such laws (France 2016) cover only large stores. |
| 15 | 12 | `examBank/grade12.ts:24` | "The player got a ____ for touching the ball with his hand." — in soccer the other team gets the penalty. (Merger's note: "got a penalty" can loosely mean "was penalized", so this is ambiguous rather than flatly wrong; rewording is still the safe fix.) |

### Themes across grades

- **Level vs. the Ministry grade.** Grade 3 stories and exam passages rely on the past simple (lived, came, ran…) and past questions, which the Ministry places at grade 7. Grade 8 teaches backshift as the core rule while the Band II descriptor says "no tense shift". Grade 10's "conditional imperative" in the Ministry sense ("Sit here if you like") is never taught. Grades 2 and 4–5 test forms the lessons never teach (third-person -s, short answers, -ing spelling, going-to negatives and Wh-questions).
- **Capital letters in fill-ins** (grade 3 and others): when the blank starts the sentence the correct answer shows in lowercase while the decoys are capitalized. One engine fix covers all cases.
- **Article give-aways** (grade 7): "an ____" with consonant-initial decoys.
- **Grade 7 facts need hedging:** the USB flash drive's inventor is disputed, modern (not all) drip irrigation began in Israel, Hedy Lamarr's patent was not used in WWII, Rachel was a Hebrew poet who died before the state existed, and the Haifa robot story states an invented fact about a real city.
- **Fiction reading as news:** grade 12 Ido story ("Last month … from Tel Aviv … 10,000 shekels").
- **Direct speech without quotation marks** (grades 9, 12). The grades 5–7 reviewer notes this is a house convention shared with core-3. The owner should decide once.
- **Gender balance:** in grade 12 every moral hero is a boy. In grade 7, check the secretary/director roles.
- **Hebrew:** deck gloss order doesn't lead with the example's meaning in several decks. There are a few unnatural phrasings ("זה גס רוח ל…", "חברות בחדר כושר", "לקח פיקוד על החברה"). The future perfect needs "כבר".
- **Repeats:** "Dan said that he was hungry." (also in season2 grade 9) and "If I had wings, I would fly to school." (also in holidays grade 9). Nothing repeats core-3.
- **Grade 10 deck sensitivity:** "prisoners were released", "army seized the bridge".

### Overall view

**Not ready to ship yet, but close.** (Status 2026-11-23: must, should and consider fixes applied; see the two fix logs at the end. The owner's three decisions are applied too (last section).) No grade has a structural problem except grade 3's level (past-simple stories), which needs an owner decision. The 15 must-fix items are small, local edits. Tiers are genuinely different in every grade: no Master reuses Challenger's sentence, rule or story. Every mission and deck word is in its Ministry band (except "a bit" in grade 3). Nothing is unsuitable, and the Ethics and safety units are fit for their ages. After the must-fixes and the facts and level should-fixes, the pack needs the usual Hebrew review, then `tts:check`/render/upload before release.

## Findings by grade

### Grade 2

- **should fix** · Level · `curriculum/packs/core4/curriculum/grade2.ts:290-292` (Boss Master errorFix), `:285` (decoy `helps`), `curriculum/packs/core4/examBank/grade2.ts:85-90` · "My dad helps me with the box." / "My mom helps me." · Third-person -s is tested, but the unit teaches only Where do you live? / There are, and base grade 2 never teaches he/she + -s (the core-3 audit standard: g2-g3 grammar items test only what the unit teaches). · Test I / we instead: "I help my dad with the box." vs "I helps…", "I help I…"; exam: "We help Mom." vs "We helps Mom." / "Us help Mom."; decoy `helps` → `is`.
- **should fix** · Lessons · `curriculum/packs/core4/lessons/grade2.ts:11` · `Where does Tom live?` · The lesson teaches only "Where do you live?"; "does" is never explained and grade 2 can't parse it. · `Where do you live, Tom?` (`איפה אתה גר, תום?`).
- **consider** · Level · `curriculum/packs/core4/curriculum/grade2.ts:104, 200, 297` · Master stories (Lior's card, the pizza, Dana's boxes) · 35-45 words of English with no Hebrew for children who barely read; the longest of all three tiers. · Cut each to 3 short sentences (e.g. "Lior wants to send a card to Grandpa. Mom says, His address is 9 Palm Street. Lior writes it on the card.").
- **consider** · English · `curriculum/packs/core4/curriculum/grade2.ts:200` · "Ben eats half of the pizza. Dana eats a few pieces. … There is no pizza for Dad!" · Half + "a few pieces" doesn't clearly add up to the whole pizza. · "Dana eats the other half."
- **consider** · Answers · `curriculum/packs/core4/curriculum/grade2.ts:181` · clozeWrong `['one', 'much']` for "I have ____ cookies in my bag." · `one` is wrong only because of the plural -s on "cookies", a subtle cue for grade 2. · `['red', 'much']` → swap `one` for a word that can't fit at all, e.g. `under`.
- **consider** · Hebrew / Consistency · `curriculum/packs/core4/curriculum/grade2.ts:126, 130` · `how many` → "כמה", `a few` → "כמה (מעט)" · In the meaning-match step two cards say "כמה". · `a few` → "מעט / כמה (לא הרבה)".
- **consider** · Suitability · `curriculum/packs/core4/curriculum/grade2.ts:259` · wrong option "Go away, Mom!" · A rude line to a parent, shown and read aloud to 7-year-olds. · "I am sleeping, Mom." or "Good night, Mom!"
- **consider** · English · `curriculum/packs/core4/curriculum/grade2.ts:128` · `['plus', 'word', …]` · Part of speech "word" is not a part of speech. · `preposition` (or `conjunction`).
- **consider** · Level · `curriculum/packs/core4/curriculum/grade2.ts:237-243` · Boss rule tests only the word order of "I feel well" · The Boss is the unit review but its rule checks neither Where do you live? nor There are. · e.g. "Three cats. Which sentence is right?" style item, or "Where does Noa live?"-free "Which answers Where do you live?".
- **consider** · Level · `curriculum/packs/core4/examBank/grade2.ts:146` · "How much of her piece does Lea eat?" · "How much" is new and right next to the taught "How many". · "Does Lea eat all of her piece?" → options "No, half." / "Yes." / … or "What does Lea eat?" → "Half of her piece."

### Grade 3

- **should fix** · Level · `curriculum/packs/core4/curriculum/grade3.ts:60, 77, 110, 257, 312`, `examBank/grade3.ts:103, 114-123` · "The bird lived… sang", "He had", "came… said… stood… ran… never came back", "ran… was… said", "fell… stood up… went on… clapped… took"; exam "swam… ate… looked for… found" · Past simple of lexical verbs (regular and irregular) is Ministry Band II, first level grade 7 (`grammarLists.json`); base grade 3 is present-only, and the unit's Pre-Band I item is just the chunk "there was". Questions like "What did the king have?" / "Why did the fox go away?" also need past questions (grade 7). · Keep "Once upon a time, there was…" and tell the rest in the present ("The bird lives in the tree… Every morning, the bird sings."), which is normal in early readers; questions become "What does the king have?" etc.
- **should fix** · Level · `curriculum/packs/core4/curriculum/grade3.ts:239` (also `:257`, exam `:43-45`, `:129`, `:136`) · `a bit` · `a bit` is Band I Core II in `wordLists.json`, not Pre-Band I; the roadmap says each grade 3 mission teaches 6 Pre-Band I words. · Swap for a Pre-Band I word not yet taught, e.g. "Well done!" (fits the race: "Well done, Dana!").
- **should fix** · Answers · `curriculum/packs/core4/curriculum/grade3.ts:96-98` · Master sentence "Once upon a time, there was a king and a queen." with decoy `were` · "there were a king and a queen" is also acceptable English (compound subject), so a child who uses the decoy is marked wrong for a correct sentence. · Decoy `are` (wrong tense for the Hebrew "היה").
- **should fix** · Answers · `curriculum/packs/core4/curriculum/grade3.ts:88` · clozeWrong `['their', 'last']` for "We eat lunch, and ____ we play." · "and last we play" (= finally) is acceptable. · `['their', 'them']`.
- **should fix** · Consistency / Lessons · `curriculum/packs/core4/curriculum/grade3.ts:151` "I am tired, but happy." and `:172` "Dan likes ice cream, but not cake." · The lesson (`lessons/grade3.ts:36` "בכל חלק צריך am") and the rule explanations ("ולא שוכחים את is", `:157`, `:206`) teach that each half needs its verb; these key items drop it, and the rule wrong options punish exactly that ("…but the water cold"). · "I am tired, but I am happy." / "Dan likes ice cream, but he doesn't like cake."
- **should fix** · Answers · `curriculum/packs/core4/curriculum/grade3.ts:31, 87` (and grade 4 below) · Fill-in answer `once upon a time` (lowercase, from the headword) for a blank at the start of the sentence, against `Good night` / `Thank you` capitalised · The correct chip is the only one that doesn't look like a sentence opener: it either gives the answer away or looks wrong. · Lowercase the distractors for this item (`good night`, `thank you`), or capitalise the option in the engine when the blank starts the sentence.
- **should fix** · Answers · `curriculum/packs/core4/examBank/grade3.ts:123` · wrong option "On the farm." for "Where did the brothers find the little duck?" · The passage doesn't say where the tree is; the duck lives on the farm, so "On the farm" can be true. · "In a shop."
- **should fix** · Hebrew · `curriculum/packs/core4/curriculum/grade3.ts:237` "דנה חמישית במרוץ." and `:259` "היא הייתה חמישית" · Unnatural for race places (the gloss "חמישי" itself is the owner's call; this is only the sentences). · "דנה במקום החמישי במרוץ." / "אבל היא הגיעה למקום החמישי."
- **consider** · Hebrew · `curriculum/packs/core4/curriculum/grade3.ts:40` · `them` → "אותם / איתם" · "איתם" is "with them" (the preposition is in "with"). · "אותם / אותן / להם".
- **consider** · Hebrew · `curriculum/packs/core4/lessons/grade3.ts:30` · "שמשי, אבל קר." · Reads like a forecast term. · "יש שמש, אבל קר."
- **consider** · English · `curriculum/packs/core4/curriculum/grade3.ts:294` · "…but we can rest at the end." · `rest` is taught as a noun ("I need a rest"); the Master sentence uses the verb. · "…but we can have a rest at the end."
- **consider** · Level · `curriculum/packs/core4/examBank/grade3.ts:85, 129, 136` · "fairy tale", "scared" · Not in the Ministry lists up to Band I; in the passage "a bit scared" is the tested answer. · "How does a story start?"; "He is a bit sad." or "He is not happy."
- **consider** · English · `curriculum/packs/core4/examBank/grade3.ts:103` · "Her brothers looked for her all the time." · "all the time" means "always / habitually", not "for a long time". · "Her brothers looked for her all day." (or keep "all the time" elsewhere).

### Grade 4

- **must fix** · Answers · `curriculum/packs/core4/examBank/grade4.ts:42-45` · "We are going to the beach ____. Today it is raining." answer `tomorrow`, wrong `together` · "We are going to the beach together." is correct and makes sense. · Wrong options `['nobody', 'everything']` (or `['slowly', 'everything']` → "going to the beach slowly" is still English; prefer `nobody`).
- **must fix** · Answers · `curriculum/packs/core4/examBank/grade4.ts:36-39` · "In winter it gets dark in the ____." answer `evening`, wrong `storm` · "In winter it gets dark in the storm." is a sensible sentence. · Wrong options `['easily', 'nobody']`.
- **must fix** · Consistency / Answers · `curriculum/packs/core4/examBank/grade4.ts:129, 140-143` · "It is a hot summer afternoon. … Is the beach crowded? No, it isn't, because it is early." Q: "Why is the beach not crowded?" → "Because it is early." · Afternoon contradicts "early"; the tested answer relies on the contradiction. · "It is a hot summer morning." (Hebrew "זה בוקר חם בקיץ.").
- **should fix** · Answers · `curriculum/packs/core4/curriculum/grade4.ts:132, 185` · clozeWrong `['storm', 'close']` for "Is the bus coming ____?" (soon) · "Is the bus coming close?" is acceptable English. · `['storm', 'evening']`.
- **should fix** · Answers · `curriculum/packs/core4/curriculum/grade4.ts:35, 88` · clozeWrong `['heavy', 'afternoon']` for "The snow is falling ____." (slowly) · "The snow is falling heavy" is common informal usage (heavily). · `['dry', 'afternoon']`.
- **should fix** · Answers · `curriculum/packs/core4/curriculum/grade4.ts:33, 86` and `:234, 287` · Answers `wait a minute` / `nobody` (lowercase) at the start of the sentence, against `Good night` / `Happy birthday` and `Tomorrow` / `Think` (capitalised) · Same casing giveaway as grade 3. · Lowercase the distractors or capitalise sentence-initial options in the engine (one fix covers all three items).
- **should fix** · Lessons / Level · `curriculum/packs/core4/curriculum/grade4.ts:230` "I am visiting Grandma tomorrow.", `:273` "Tomorrow we are learning about snow.", `:297` "Tomorrow we are traveling to the beach.", `examBank/grade4.ts:43` "We are going to the beach tomorrow." · The lesson says the present continuous is for what happens "ממש עכשיו"; these use it for the future with no explanation, which contradicts the rule the grade 4 learner just read (future arrangements are Band I grade 5 territory). · Keep the Boss on "now": "Today I am visiting Grandma.", "Today we are learning about snow.", "Today we are traveling to the beach."; for the exam item, test `tomorrow` with the present simple ("I have a test ____.") or drop it. If the future use stays, add one line to the m1 lesson explaining it.
- **should fix** · English · `curriculum/packs/core4/curriculum/grade4.ts:255` · "Tomorrow the rain is stopping, so you can travel." · Present continuous for a forecast is unnatural (it is for arranged plans); a weather report says "will stop". · "Now the rain is stopping, so you can travel soon." (keeps the unit's grammar).
- **should fix** · English · `curriculum/packs/core4/curriculum/grade4.ts:107` · "Suddenly the rain is very heavy. Noa is not stopping, because her house is near." · Unnatural narrative. · "Suddenly it is raining very hard. Noa doesn't stop, because her house is near."
- **should fix** · Lessons · `curriculum/packs/core4/lessons/grade4.ts:22-38` · The questions lesson never shows short answers · `examBank/grade4.ts:78-83` tests "No, it isn't." and the m2 story (`grade4.ts:154`) and Master story (`:207`) use "Yes, we are." · Add to the pattern: "Is it raining? Yes, it is. / No, it isn't."
- **should fix** · Lessons · `curriculum/packs/core4/lessons/grade4.ts:5-21` · No -ing spelling rules · `examBank/grade4.ts:57-62` (sitting, double t) and `:85-90` (making, drop e) test them. · Add one line: "make → making, sit → sitting, run → running".
- **should fix** · Answers · `curriculum/packs/core4/curriculum/grade4.ts:308-312` · "she puts her raincoat in her bag… Yael is dry." → correct "She has a raincoat in her bag." · A raincoat in a bag doesn't keep her dry; the answer needs her to wear it. · Story: "…puts her raincoat in her bag. At three o'clock it rains, so she puts it on." Answer: "She has her raincoat with her."
- **should fix** · English · `wordDecks/grade4.ts:103` · "Forty children are in the store." · Odd sentence for a shopping deck; "There are forty children…" would be the natural form anyway. · "These shoes cost forty shekels." (`הנעליים האלה עולות ארבעים שקלים.`).
- **consider** · Level · `curriculum/packs/core4/curriculum/grade4.ts:119-218` · Present continuous **questions** · `grammarLists.json` puts "Present continuous questions" at first level GRADE 5 (the affirmative is grade 4). The brief sets this target, so just noting it a year early.
- **consider** · Answers · `curriculum/packs/core4/curriculum/grade4.ts:135, 186` · clozeWrong `['storm', 'close']` for "The kite is flying ____ in the wind." (easily) · "flying close" is marginal English. · `['storm', 'evening']`.
- **consider** · Hebrew · `curriculum/packs/core4/curriculum/grade4.ts:36, 72` · "the sun is coming up" → "השמש זורחת" · The same Hebrew is used for "the sun is shining" (`:255`, `lessons/grade4.ts:28`). · "השמש עולה" for coming up.
- **consider** · English · `curriculum/packs/core4/examBank/grade4.ts:96` · "My sister is reading in the afternoon." · "in the afternoon" sounds habitual next to the continuous. · "My sister is reading this afternoon."
- **consider** · Level · `curriculum/packs/core4/examBank/grade4.ts:129, 140` · "crowded" · Not in the Band I list, and the question hinges on it. · "Are there a lot of people at the beach? No, there aren't…"
- **consider** · Answers · `curriculum/packs/core4/curriculum/grade4.ts:48` · wrong option "It is rain." · Grammatical as an identification ("What's that? It is rain."). · "It are raining."
- **consider** · Consistency · `wordDecks/grade4.ts:106` vs `:79` · `pretty` → "יפה" and (core-3) `beautiful` → "יפה" · Two deck words with the same gloss in one grade. · `pretty` → "יפה, חמוד".
- **consider** · Consistency · `wordDecks/grade4.ts:97` · `take off` partOfSpeech `'phrase'` · It's a phrasal verb; other verbs in the deck are `'v'`. · `'v'` if the deck UI shows the part of speech.

The rest of grade 4 (both lessons' rules and examples, the m1/m2/Boss rules, all Explorer items, the Master sentences/voice lines/errorFix items, the Jerusalem passage, all other fill-ins and the other 15 deck items with their Ministry tags) checked clean.

### Grade 5

- **must fix** · Answers · `examBank/grade5.ts:123`. Passage 1, Q3 "When is the family going to watch a movie?" offers the wrong option `'After soccer practice.'` The passage has soccer on Saturday morning and the movie "in the evening", so the movie really is after soccer and this option can also be defended as right. Fix: replace it with `'On Saturday morning.'`
- **should fix** · Answers / English · `curriculum/grade5.ts:112`. Master story: "On Friday she goes shopping for food, but the weather report says it is going to rain all day." "All day" seems to mean Friday, but the answer (`:116`) is "It is going to rain on Saturday." Fix: "…the weather report says it is going to rain all day on Saturday."
- **should fix** · Lessons · `lessons/grade5.ts:5–38`. The two lessons teach only affirmative statements and yes/no questions. The exam bank tests the negative "They are not going to play today." (`examBank/grade5.ts:79`) and a Wh-question "What are you going to do tomorrow?" (`:86`), and the Ministry's Band I heading lists both. Fix: add one negative example to the m1 lesson ("She is not going to come." / "היא לא הולכת לבוא.") and one Wh-question to the m2 lesson ("What are you going to do?").
- **should fix** · Consistency · `lessons/grade5.ts:33–36` and `examBank/grade5.ts:71–73`. The m2 quickTry ("Are you going to come?" → "No, I'm not." / wrong "No, I don't.") is the same item as exam grammar Q4, with the same correct and wrong answers. Fix: change the quickTry to "Is Dana going to sing? → Yes, she is. / wrong: Yes, she does."
- **should fix** · English · `examBank/grade5.ts:12`. "I am going to invite all my class to my birthday party." "All my class" is unnatural. Fix: "…invite my whole class to my birthday party."
- **should fix** · English · `wordDecks/grade5.ts:104`. "English is fun with games." is unnatural. Fix: "English is fun when we play games." / "אנגלית כיפית כשמשחקים משחקים." (or "We learn English with fun games.").
- **consider** · Hebrew · `curriculum/grade5.ts:57`. "בשבת הוא הולך ללכת לים" (for "is going to go") reads clumsily. Fix: "בשבת הוא הולך לים".
- **consider** · Hebrew · `curriculum/grade5.ts:163`. "לאן הבנות הולכות ללכת?" is clumsy. Fix: "לאן הבנות הולכות?"
- **consider** · English / Answers · `curriculum/grade5.ts:198–200`. The Master sentence "Is your family going to travel in the summer?" has the decoy `'Are'`. In British English "Are your family going to…" is acceptable. The app is US, so "Is" is right, but a learner who picks "Are" is not wrong in BrE. Fix: use another decoy (e.g. `'Does'`).
- **consider** · Answers · `examBank/grade5.ts:80`. The wrong option "They are going not to play today." is marginal rather than plainly wrong ("going not to" is rare but possible). Fix: use "They aren't going play today." instead.
- **consider** · English · `examBank/grade5.ts:18`. "Our neighbor has a big dog. He lives next door." "He" can be read as the dog. Fix: "Our neighbor lives next door. He has a big dog."
- **consider** · Hebrew · `curriculum/grade5.ts:242`. "איזו מידה אתם?" is colloquial. "מה המידה שלכם?" is more standard.
- **consider** · Consistency · `curriculum/grade5.ts:151–153` and `examBank/grade5.ts:64–66`. The Challenger rule ("Is Ron going to swim today?" with wrong answers "Does Ron going…" / "Is Ron going swim…") and exam Q3 ("Is Maya going to dance…", same two wrong patterns) are the same item with a new name. Fix: vary one of the two (e.g. the exam item tests "Are your friends going to…").

### Grade 6

- **must fix** · Answers · `examBank/grade6.ts:36–39`. "We didn't have time to wait, so we left ____." The answer is `immediately`, but the wrong option `alone` also makes a correct, sensible sentence ("…so we left alone", without waiting for the others). Fix: replace `'alone'` with `'double'` or `'strange'`.
- **must fix** · Facts · `curriculum/grade6.ts:323`. Ella's Dead Sea story says "The water was so salty that she nearly floated like a boat." "Nearly floated" means she almost floated. In the Dead Sea people float easily (the next sentence is about reading a newspaper while floating). Fix: "The water was so salty that she floated like a boat."
- **should fix** · Consistency / Lessons · `lessons/grade6.ts:8` and `curriculum/grade6.ts:47`. The m1 lesson's idea text uses "When the bus came, we got on.", which is the exact correct answer of the Challenger rule ("When the bus came, we got on." against "…come…" / "…get on"). Core-3's audit flagged this kind of lesson/drill duplication. Fix: change the lesson example to "When the bell rang, we went out."
- **should fix** · Consistency · `lessons/grade6.ts:30–32` and `examBank/grade6.ts:64–66`. The m2 quickTry ("The game stopped because of the rain." / wrong "…because the rain.") is exam grammar Q3 word for word. Fix: change the quickTry sentence (e.g. "We stayed inside ___ the heat.").
- **should fix** · English · `curriculum/grade6.ts:33`. "We waited at the gate when the plane was late." "When" with a state reads oddly here, and this is the mission that teaches "when" for two past moments. Fix: "When we got to the airport, we waited at the gate." / "כשהגענו לשדה התעופה, חיכינו בשער."
- **should fix** · Hebrew · `curriculum/grade6.ts:157`. "מה עשה את הרעש המוזר?" is a calque of "What made the noise?" Fix: "מה השמיע את הרעש המוזר?"
- **should fix** · Hebrew · `curriculum/grade6.ts:243` (`double`). The gloss "כפול / זוגי" puts the example's meaning ("a double room" = חדר זוגי) second. Core-3's audit raised gloss order as should fix. This gloss is on the owner's "judgment calls" list, so the only point here is the order. Fix: "זוגי / כפול".
- **should fix** · Hebrew · `wordDecks/grade6.ts:97` (`mean`). The gloss "להתכוון / פירושו" puts the example's meaning ("What does this word mean?" → פירוש) second. Fix: "פירושו / להתכוון".
- **consider** · Answers · `examBank/grade6.ts:80`. The wrong option "You did notice the strange man?" is acceptable in speech as an emphatic or echo question. Fix: "Did you noticing the strange man?"
- **consider** · English / Answers · `curriculum/grade6.ts:324–328`. "Why did Ella write about the Dead Sea?" → "She had to describe her best trip." That answer explains why she wrote at all, not why she chose the Dead Sea. Fix: ask "Why did Ella write about a trip?", or make the answer "It was her best trip."
- **consider** · Level / English · `curriculum/grade6.ts:32` (`railway`) and `:236` (`the ground floor`). Both are British usage (US: railroad, first floor), while the app is US everywhere. Both are the Ministry's Band I entries, so the list wins, as with "queue" in grade 10. Flag for the owner's decision.
- **consider** · Lessons / Tiers · `curriculum/grade6.ts:153–154`. The Challenger story of the "Because…" mission gives its reason with "so" and never uses because or because of. Fix: "He was afraid because the noise was very close, so he woke up his friend."
- **consider** · Hebrew · `curriculum/grade6.ts:134` and `:173`. "הלכנו ברגל במקום." / "שיחקנו במשחקים במקום." end on a bare "במקום". Fix: "…במקום זה." (matching the gloss).
- **consider** · Hebrew · `curriculum/grade6.ts:129` (`afraid`). The gloss "מפחד" is masculine only. Fix: "מפחד/ת / חושש".
- **consider** · Consistency · `curriculum/grade6.ts:258–262` (Boss Challenger rule "When we got to the hotel, we were very hungry" with wrong answers "we was" / "get") and `:100–101` (m1 Master error-fix "When we got home, we were very tired" with "we was" / "get"). Same rule, same traps. Fix: give the Boss rule a because / because of item instead.
- **consider** · Suitability (emoji) · `curriculum/grade6.ts:234`. `helicopter` uses ✈️. 🚁 exists.

### Grade 7

- **must fix** · English · `curriculum/grade7.ts:215`. "When Ori was in trouble with a science project…" "Be in trouble" means being blamed or punished (the sense this mission's vocab teaches at `:138`). Having difficulty is "have trouble with". Fix: "When Ori had trouble with a science project, he called him."
- **should fix** · Answers · `curriculum/grade7.ts:32` + `:85` (`emoji`) and `:34` + `:87` (`error`). The Challenger fill-ins "She sent me an ___ that was laughing." and "There is an ___ in the code that I wrote." keep the article "an", so the wrong options (`click`/`maximum`, `click`/`software`), all starting with consonants, drop out without reading. Fix: give each a vowel-initial wrong option (`option`, `advantage`, `error`/`emoji`), or rewrite with "the". "An emoji that was laughing" is also unnatural: "She sent me an emoji with a big smile."
- **should fix** · Facts · `examBank/grade7.ts:103` (EN) and `:105` (HE). "The USB flash drive… was developed by an Israeli company." M-Systems (DiskOnKey) filed one of the first patents (April 1999), but the invention is disputed: Trek 2000 (Singapore) sold the first ThumbDrive (Britannica), and IBM and Netac also claim it. Fix: "One of the first USB flash drives, the DiskOnKey, was developed by an Israeli company." / "אחד מהחסנים הניידים הראשונים, הדיסק און קי, פותח בחברה ישראלית."
- **should fix** · Facts · `examBank/grade7.ts:103`. "Drip irrigation… also began in Israel." Modern drip irrigation (Simcha Blass's emitter, Netafim, 1959–1965) was developed in Israel, but the idea is older: clay-pipe subsurface irrigation in Germany in the 1860s, E. B. House in Colorado in 1913, perforated pipe in Germany in the 1920s. Fix: "Modern drip irrigation… was developed in Israel." / "השקיה בטפטוף המודרנית… פותחה בישראל." The opener "Many inventions that we use every day came from Israel" overstates this too. Fix: "Some inventions…".
- **should fix** · Facts · `curriculum/grade7.ts:158` (HE `:160`). Hedy Lamarr "worked on an idea which helped send secret radio signals". Her 1942 patent (with George Antheil, "Secret Communication System", frequency hopping for torpedo guidance) was not used during the war, so "helped send" implies a use that never happened. Fix: "she worked on an idea for sending secret radio signals" / "היא עבדה על רעיון לשליחת אותות רדיו סודיים". The Wi-Fi/Bluetooth sentence is hedged ("Some people say… ideas like hers") and can stay: Bluetooth does use frequency hopping, but the link to modern Wi-Fi is weak, so "Bluetooth uses ideas like hers" would be the most accurate version.
- **should fix** · Facts / Suitability · `curriculum/grade7.ts:111`. "Now the city uses robots that clean three beaches every week." Together with "students from a school in Haifa", this states an invented fact about a real city as news. Fix: drop the city ("a school near the sea…", "Now the school's robots clean the beach every week.").
- **should fix** · English · `curriculum/grade7.ts:235` ("The team that wins the fair will visit a real lab.") and `examBank/grade7.ts:97` ("The girl who won the fair is my cousin."). You win a competition or a prize, not a fair. Fix: "The team that wins at the fair…" / "The girl who won first prize at the fair…"
- **should fix** · English · `curriculum/grade7.ts:241`. "The team that wins, according to the rules, gets a trophy." The phrase is awkwardly placed. Fix: "According to the rules, the team that wins gets a trophy." The cloze still works.
- **should fix** · English · `curriculum/grade7.ts:262` (HE `:264`). "a cheap, reasonable water filter": "reasonable" describes a price, not a filter, and is redundant next to "cheap". Fix: "a water filter at a reasonable price" / "מסנן מים במחיר סביר".
- **should fix** · Hebrew · `curriculum/grade7.ts:243`. "Please let me know when your invention is ready." → "תודיעו לי בבקשה מתי ההמצאה שלכם מוכנה". "מתי" asks for the time; the English means "once it is ready". Fix: "…כשההמצאה שלכם מוכנה." (as the exam already does at `examBank/grade7.ts:37`).
- **should fix** · Hebrew · `wordDecks/grade7.ts:113` (`scene`). The gloss "סצנה / מחזה" is wrong: מחזה is a play, not a scene. Fix: "סצנה / תמונה (במחזה)".
- **should fix** · Facts · `wordDecks/grade7.ts:109` (`poet`). "Rachel was a famous Israeli poet." Rachel Bluwstein (1890–1931) died 17 years before the state existed; she is described as a Hebrew poet. The claim is not false in everyday Israeli usage, but it is imprecise. Fix: "Rachel was a famous Hebrew poet." / "רחל הייתה משוררת עברית מפורסמת."
- **consider** · Suitability · `curriculum/grade7.ts:133–134` and `:215`. The secretary is female (המזכירה), the director male (הבמאי), and the engineer is Grandpa, so roles follow stereotype. The English is neutral; only the Hebrew picks a gender. Fix: "המזכיר" and "הבמאית", or make Ori's grandmother the engineer.
- **consider** · Consistency · `curriculum/grade7.ts:111` (robot: error → students change the software) and `examBank/grade7.ts:122` (Gil's bird feeder: too many photos → he changes the software). Same plot twice in one unit. Fix: give Gil a different fix (e.g. he moves the camera).
- **consider** · Lessons · `lessons/grade7.ts:5–19`. The lesson uses an object relative ("the book that you bought") but doesn't say the pronoun can be left out ("the book you bought"), which is a separate descriptor in the Ministry's Band II heading. Exam Q3 (`examBank/grade7.ts:57`, "the drone ____ my uncle built") has no empty-gap option, so no answer is ambiguous. Fix: add one line to the tip.
- **consider** · Answers · `examBank/grade7.ts:12–15`. In "My computer is slow because it has a ____." the wrong option `limit` makes a grammatical (if odd) sentence. Fix: `wrong: ['secretary', 'emoji']`.
- **consider** · English · `curriculum/grade7.ts:175–176`. "Ben has a friend who builds robots. His newest robot can dance!" "His" could be Ben's or the friend's. Fix: "The friend's newest robot…" / "His friend's newest robot…"
- **consider** · Hebrew · `lessons/grade7.ts:11`. "מקרר הוא מכונה ששומרת על האוכל קר" is a calque of "keeps food cold". Fix: "ששומרת את האוכל קר" / "שמקררת את האוכל".
- **consider** · Consistency · `examBank/grade7.ts:93` ("This is the app that helps me learn words.") vs. the Challenger rule `curriculum/grade7.ts:47` ("This is the app that helps me study."), and `examBank/grade7.ts:95` ("We need technology which saves energy.") vs. vocab `curriculum/grade7.ts:29` ("We need technology that saves water."). These are near-duplicates. Fix: vary one of each pair.

### Grade 8

- **must fix**, English, `curriculum/packs/core4/curriculum/grade8.ts:111`: `'When I said sorry, she told me that\'s all right.'` This mixes direct and reported speech. *told me that's all right* is wrong, and it breaks the very rule the mission teaches (tense back, told + that-clause). Fix: `When I said sorry, she told me that it was all right.` The Hebrew can stay. The Challenger blank needs the headword as written, so either keep "that's all right" in a direct-speech example (`When I said sorry, she smiled and said, "That's all right."`) or let the cloze move on to another word.
- **should fix**, Level, `grade8.ts:21–27` and `lessons/grade8.ts:8`: at Band II, the Ministry's reported-speech descriptors are "say + that-clause, with pronoun shift (**no tense shift**)" and "tell + object + that-clause … (no tense shift)" (`grammarLists.json`, band-2 "CLAUSES: Reported speech", from grade 7). The unit makes the tense shift its core rule ("ומזיזים את הזמן אחורה"), which goes past the band. Teaching it isn't wrong, but no item treats an unshifted report as acceptable. Fix: keep the backshift, and add one line to the lesson tip, e.g. "כשמה שנאמר עדיין נכון, אפשר להשאיר הווה: She said that she loves Israel." Also fix the decoy below.
- **should fix**, Answers, `grade8.ts:68` (Master sentence decoys `['is', 'told']`): *The scientist said that the situation in the ocean **is** serious.* is correct English (the situation is still true). A learner who builds it with the decoy "is" is marked wrong. Fix: replace the decoy with `says` or `tell`. The same applies, more weakly, to `grade8.ts:279` (decoy `is` in *…told the actors that the performance was a success*), where it is **consider**.
- **should fix**, English, `grade8.ts:61`: `Lia said that she hardly ever read books before, but now she wanted to read more.` With "before", this needs the past perfect, or a time phrase. Fix: `Lia said that in the past she hardly ever read books, but now she wanted to read more.`
- **should fix**, English/Consistency, `grade8.ts:84`: the Master story's correct answer `'He said his wife cooks better than him.'` drops the backshift that the mission drills, and changes the passage's wording ("a better cook than he was"). Fix: `He said that his wife was a better cook.`
- **should fix**, English, `grade8.ts:226`: `'The tester said that my English level was high.'` "Tester" is not natural for a person who grades a test. Fix: `The examiner said…` (Hebrew "הבוחן" stays).
- **should fix**, English (part of speech), `grade8.ts:227`: `['total', 'noun', …, 'The article said that the total cost was two million shekels.']` Here "total" is an adjective. The Ministry's Core I entry is `total: adj` (Core II has the noun). Fix: change the POS to `adjective`.
- **should fix**, Answers, `examBank/grade8.ts:12–15`: `The bus driver gave us an ____ for being late.` The wrong option "opportunity" fits the blank grammatically ("gave us an opportunity"), so only the meaning rules it out. Fix: replace "opportunity" with `duty` or `level`.
- **should fix**, Consistency, `grade8.ts:47`: the rule answer `Dan said that he was hungry.` is word for word in `curriculum/packs/season2/curriculum/grade9.ts:388`. Fix: e.g. `Dan said, "I am thirsty."` → `Dan said that he was thirsty.`
- **consider**, English, `grade8.ts:31`: `The coach said that, as you know, the final is on Sunday.` Inside reported speech, "you" no longer points to the reader. Fix: `"As you know, the final is on Sunday," the coach said.`
- **consider**, English, `grade8.ts:224`: `…it was my duty to clean the board.` For a class chore, "my turn" is the natural word. Fix: `The teacher told us that it was our duty to help new students.`
- **consider**, English, `grade8.ts:178`: `…told him that he got the job.` Fix: `…that he had gotten the job` (US).
- **consider**, Consistency, `docs/content-packs-roadmap.md:312` says the words are "never in the app first". But "admit" is in `packs/season2/curriculum/grade9.ts:460`, "apology" in `packs/holidays/curriculum/grade10.ts:31`, and "opportunity" in base `middleSchool/grade9.ts:28`. The glosses agree. Teaching them a year earlier is fine; correct the roadmap's claim or swap the words.
- **should fix**, Hebrew, `wordDecks/grade8.ts:120`: `social networking` is glossed "רשתות חברתיות", and the example uses "רשתות חברתיות יכולות לקחת…". The English names the activity, not the networks. Fix: gloss `שימוש ברשתות חברתיות`, example `השימוש ברשתות חברתיות יכול לקחת הרבה מהזמן שלכם.`
- **consider**, Hebrew, `wordDecks/grade8.ts:105`: `lock` is tagged `n` but glossed "מנעול / לנעול". Fix: `מנעול`.
- **consider**, English, `wordDecks/grade8.ts:109`: `Save the file before you close the computer.` Fix: `…before you shut down the computer.`

Fiction check: every news and interview item uses an unnamed role (reporter, minister, mayor, singer, chef, basketball player) or an ordinary first name. None reads as a real event. The storm passage's "call 100" is correct for the Israel Police.

### Grade 9

- **must fix**, English, `examBank/grade9.ts:129`: `The facility opened lately, …` "Lately" doesn't go with a single past event in the past simple. Fix: `The facility opened recently, …`
- **should fix**, English, `examBank/grade9.ts:98`: `Lately, more girls are studying engineering.` "Lately" takes the present perfect. Fix: `Lately, more girls have started studying engineering.` (Hebrew stays.)
- **should fix**, English (punctuation), `curriculum/packs/core4/curriculum/grade9.ts:54, 216, 264, 321`: direct speech has no quotation marks. Examples: `told her, If you take up flying lessons…`; `Her dad said, If I were you, …`; `Dana thought, What if they say no?`; `She said, If you are strong…`; `told her, If you study education, …`. The Hebrew passages do quote, and grade 10 (`grade10.ts:54`) uses `\"…\"`. Fix: add quotes, e.g. `told her, "If you take up flying, you will understand the job better."`
- **should fix**, English, `grade9.ts:54`: `take up flying lessons`. "Take up" goes with an activity, not with lessons. Fix: `If you take up flying at seventeen, …`
- **should fix**, Answers, `grade9.ts:321–325`: the Master story's correct answer `She has enjoyed babysitting for a long time.` relies on enjoyment that the passage never mentions. Also, `For quite a while, Yarden babysat…` reads as finished, but she still does it. Fix the passage: `For quite a while, Yarden has babysat for families in her building, and she loves it.`
- **should fix**, English, `grade9.ts:43`: shortSentence `If it rains, we will stay.` is incomplete ("stay" where?), and `If it rains, we will stay home.` already exists in `curriculum/lessons/grade8.ts:167`. Fix: `If it rains, we will play inside.` / `אם ירד גשם, נשחק בפנים.`
- **should fix**, Consistency, `lessons/grade9.ts:30`: `If I had wings, I would fly to school.` is word for word in `packs/holidays/curriculum/grade9.ts:386`. Fix: e.g. `If I had a robot, I would never clean my room.`
- **should fix**, Hebrew, `grade9.ts:241`: `['female', 'adjective', 'אישה / נקבה', …]`. The gloss is a noun for an adjective (the example "טייסות" is fine). Fix: `נשית / (ממין) נקבה`. This gloss is already on the owner's to-confirm list.
- **should fix**, English, `wordDecks/grade9.ts:121`: `On hot days, drink water before you feel thirst.` English says "feel thirsty", not "feel thirst". Fix: `On hot days, don't wait for thirst; drink water often.` / `בימים חמים, אל תחכו לצמא; שתו מים לעיתים קרובות.`
- **consider**, Suitability, `grade9.ts:137`: `I suppose I would be a teacher if I liked kids more.` This mildly runs down teaching and children. Fix: `…if I were more patient.`
- **consider**, English, `grade9.ts:264`: `Lately, more women have joined.` Joined what? Fix: `…have joined the fire service.`
- **consider**, Hebrew, `grade9.ts:136`: `מה אם לא הייתי מקבל/ת את העבודה?` is stiff. `ומה אם לא אקבל את העבודה?` is the natural Hebrew for the worry.

Level: both conditionals are Ministry Band III (4 points / B1) headings. The roadmap lists grade 9 core-4 as "recycled" grammar, and base grade 8 (first) and grade 9 (second) already teach them, so there is no level finding. Words: all 24 are Band II Core II.

### Grade 10

- **must fix**, English/Suitability, `curriculum/packs/core4/curriculum/grade10.ts:137`: `The doors stay closed, and you cannot leave, not until the alarm stops.` The trailing "not until" is ungrammatical. Worse, in a safety unit it tells learners they can't leave while an alarm sounds, which is the opposite of evacuation advice. Fix: `Don't go back into the building, not until a firefighter says it is safe.` / `אל תחזרו לבניין, לא לפני שכבאי אומר שזה בטוח.` A cleaner English option: `Don't go back inside until a firefighter says it is safe.` The headword "not until" still appears as written.
- **should fix**, Level, `grade10.ts:23–24` and `lessons/grade10.ts:5–9`: the Ministry's Band III "CLAUSES: Conditional imperative" (3 points) means an if-clause that *softens* an imperative, offer or suggestion ("if you want / like / prefer": *Sit here if you like.*). The unit teaches only If + present + an instruction, which is a real condition with an imperative. Fix: add one lesson example and one exam or rule item of the softening kind, e.g. `If you like, I can show you the first aid kit.` / `Take a seat, if you want.`
- **should fix**, English, `grade10.ts:43`: shortSentence `If you slip, sit down.` is illogical advice (someone who slipped is already down). Fix: `If you get hurt, stay calm.` / `אם נפגעים, הישארו רגועים.` This matches the mission title.
- **should fix**, English/Suitability, `grade10.ts:31`: `If a gas tank is hot, stay away, because it can explode.` In US English a "gas tank" is a car's fuel tank. A hot cylinder "exploding" is also the most frightening line in the unit. Fix: `If there is a fire near a gas cylinder, stay far away, because it can explode.` / `…ליד בלון גז, התרחקו…`
- **should fix**, English, `grade10.ts:136`: `Rain is probable tomorrow, so take a raincoat.` This is unnatural. Fix: `It is probable that it will rain tomorrow, so take a raincoat.`
- **should fix**, English, `grade10.ts:141`: `The police called in connection with the accident, but nobody was hurt.` The "but" has no contrast, and the police called whom? Fix: `The police called me in connection with the accident, so I told them what I saw.` / `המשטרה התקשרה אליי בקשר לתאונה, אז סיפרתי להם מה ראיתי.`
- **should fix**, English, `grade10.ts:159`: `The alarm was false, yet she said that the practice was useful.` A false alarm isn't "the practice". Fix: `…yet she said that it was good practice.`
- **should fix**, English, `grade10.ts:267`: `She said, If you use up something in the kit, tell me, …` has no quotation marks (`:54` quotes). Fix: add `\"…\"`.
- **should fix**, English (US), `grade10.ts:324`: `the best gift Omer had ever got` → `had ever gotten`.
- **should fix**, Hebrew, `wordDecks/grade10.ts:111`: `take control`, example Hebrew `המנהל החדש לקח פיקוד על החברה.` "פיקוד" is military and unnatural for a company. Fix: `המנהל החדש השתלט על החברה / קיבל את השליטה בחברה.`
- **should fix**, Suitability, `wordDecks/grade10.ts:109–110`: `The prisoners were released after five years.` / `The army seized the bridge at night.` In Israel today, "prisoners released" points straight at prisoner/hostage deals, and the deck already has army, command and rank items. Fix: `The rescued bird was released back into the wild.` / `The team seized the chance to win.`
- **consider**, Facts, `grade10.ts:54`: `She put cold water on his ankle`. For a sprain, standard first aid is a cold pack (RICE). This isn't harmful, just weak. Fix: `She held a cold pack on his ankle.` / `היא החזיקה משהו קר על הקרסול שלו.`
- **consider**, Facts, `grade10.ts:72`: seasickness, `told her to look at the sea`. The usual advice is to look at the horizon. Fix: `…to look at the horizon and breathe slowly.` (Not confirmed by my search; this is general knowledge.)
- **consider**, Suitability, `grade10.ts:267`: a first aid kit `hidden underneath a desk`. Kits should be easy to find. Fix: `kept underneath the teacher's desk`.
- **consider**, English, `grade10.ts:201`: Master voice line `Call an ambulance, or take him to the hospital.` "Him" has no referent. Fix: `If he can't stand up, call an ambulance.`
- **consider**, Hebrew, `wordDecks/grade10.ts:99, 101`: `command` and `force` are tagged `n` but have verb glosses ("לפקד", "להכריח"). Lead with the noun only, or drop the verb.
- **consider**, Facts, `wordDecks/grade10.ts:117`: `The Egyptians built a great civilization.` → `The ancient Egyptians…`.

and / but / or / so / yet: each of the 10 choice items (`grade10.ts:151–153`, `:170–172`, Master decoys `:200` and `:308`, `examBank/grade10.ts:64–87`, lesson quickTry) has exactly one correct answer. "but" is never offered where "yet" is the key. The comma items (`examBank:86–87`, `grade10.ts:205–209`) are also unambiguous.

Safety content otherwise checks out: burn → cool water, no ice; deep cut → press on it; smell gas → open windows and leave; no elevator in a fire; no swimming without a lifeguard; don't swim out alone; call 101 for facial swelling after a sting; lie down after fainting. Apart from `:31`, nothing is frightening.

### Grade 11

- **must fix**, Consistency/English, `curriculum/packs/core4/curriculum/grade11.ts:54`: "One expert predicted that by 2050, robots will have taken over many boring jobs. Another said that people will have found new kinds of work…". Mission 2 of the same unit teaches that after a past reporting verb, *will* becomes *would*, and marks "We thought that the bus will arrive soon" wrong (`:207`). This story does what mission 2 marks wrong. Fix: put the reporting verbs in the present ("One expert predicts that by 2050, robots will have taken over… Another says that people will have found…"; Hebrew "חוזה… אומר"). Do not use "would have taken": that form is not taught.
- **must fix**, Facts/Logic, `grade11.ts:216` (Master story, mission 2): "In 1900, many people believed that by the year 2000, everyone would fly to work in small planes… Some experts say that the old predictions got it wrong because they did not imagine the internet, which changed work far more than planes did." (1) "Many people believed… everyone would fly to work" overstates the sources. Some writers and artists of the time imagined commuting by air (Watkins, *Ladies' Home Journal*, Dec 1900; the French "year 2000" postcards, 1899–1910), but nothing shows that most people believed it. (2) The reason given doesn't follow: not foreseeing the internet doesn't explain why people don't fly to work. (3) "most people still drive cars" isn't true worldwide. Fix: "In 1900, some writers imagined that by the year 2000, people would fly to work in small flying machines. Strangely enough, that never happened. In actual fact, most people still travel to work on the ground. Some experts say that the old predictions got the future of work wrong because they did not imagine the internet: today, many people work from home." The question and answer can stay.
- **should fix**, Consistency/Facts, `grade11.ts:322` (Master story, Boss): "wrote letters… and the teacher kept them for ten years or so. When the class met again in 2026…". 2016 to 2026 is exactly ten years, so "or so" contradicts the dates. Fix: "…kept them for ten years or so. When the class met again, Noam opened his letter." (drop "in 2026"; you could also drop "In 2016"). Also "physiotherapist" is British; US English says "physical therapist". Use "physical therapist".
- **should fix**, Answers (Master builder), `grade11.ts:304`: "I hope that by then you will have found a job you love." There is no comma, so "I hope that you will have found a job you love by then" is also correct, and it uses exactly the same chips (the check is exact-match). Fix: "By then, I hope that you will have found a job you love." (the capitalized "By" and the comma chip fix the order), or another sentence with only one valid order.
- **should fix**, English (US), `grade11.ts:247`: "I promised myself that I would eat only an occasional sweet." "a sweet" is British. Fix: "…only an occasional piece of candy" or "…would eat candy only on occasional weekends". Simplest: "I promised myself that I would allow myself only an occasional treat." (Hebrew "…שאפנק את עצמי רק מדי פעם").
- **should fix**, English, `grade11.ts:136` (misunderstand): "People often misunderstand the plan: we were going to meet at six, not seven." A present habit doesn't fit one past plan. Fix: "Many people misunderstood the plan: we were going to meet at six, not seven." Hebrew: "הרבה אנשים הבינו לא נכון את התוכנית: …".
- **should fix**, English (logic), `grade11.ts:137` (get it wrong): "I thought that the test would be easy, but I was afraid I would get it wrong." The two halves contradict each other. Fix: "I was sure that I would get it wrong, but I got every answer right." Hebrew: "הייתי בטוח/ה שאטעה, אבל עניתי נכון על הכול." Or keep one clause: "I was afraid that I would get it wrong."
- **should fix**, Hebrew (gloss order), `grade11.ts:242`: immigration is glossed "הגירה / עלייה", but the example (immigration to Israel) and the Boss story mean "עלייה". Fix: "עלייה / הגירה".
- **should fix**, Hebrew, `grade11.ts:243`: "אם יש לכם מצב רוח רע" is less natural than "אם אתם במצב רוח רע", which is also the form the Explorer story uses (`:284`, "מאיה במצב רוח טוב").
- **should fix**, Hebrew, `grade11.ts:237–238` and the future-perfect Hebrew in general (`:29–36`, `:240`, `:246`; exam `examBank/grade11.ts:93,96`): "בעוד עשר שנים, אטייל לפחות בחמש מדינות" means "I will travel in five countries". The idea of completion is lost, and that idea is the whole point of the unit. Fix: add "כבר" where it fits, as the Master line `:94` does: "בעוד עשר שנים, כבר אבקר בלפחות חמש מדינות" / "עד אז, כבר אראה מקומות מדהימים" / "עד 2040, רובוטים כבר ישנו כמעט כל מקצוע".
- **consider**, Hebrew (gloss order; open owner item), `grade11.ts:244`: regards is glossed "דרישת שלום / בברכה", but the example is a letter's sign-off ("Best regards…"), so "בברכה" should come first under the gloss rule. Its Hebrew "בברכה, מהעצמי הצעיר שלכם!" is a calque; "בברכה, מכם בגיל שש עשרה" (or "דרישת שלום מהעבר!") reads naturally.
- **consider**, Hebrew (open owner item), `grade11.ts:36`: "תודה על התרומה שלכם" for "Thanks for your input" is understandable, but "תודה על ההערות / על המשוב שלכם" is what an Israeli would say. Gloss: "משוב / הערות; קלט".
- **consider**, Answers, `grade11.ts:247` with `:299` (Challenger, occasional): the blank follows "an", which rules out the distractor "mood" on form alone (the other distractor, "immigration", still fits "an"). Swap "mood" for "incredible" (it fits the article but not the meaning).
- **consider**, Answers, `grade11.ts:87` (Challenger, personality): "Your ____ will have changed…" with the distractor "psychology". "Your psychology" (mental makeup) is marginal but possible. Swap it for "union".
- **consider**, Lessons, `lessons/grade11.ts:27`: the lesson says *would* is used "במקום will" for a past plan or prediction, but not *when*: after a past verb such as said / thought / knew / promised. Every drill tests exactly that. Add: "would בא אחרי פועל בעבר: said, thought, knew, promised".
- **consider**, Level, `grade11.ts` mission 2 and lessons: the Ministry's 5-point heading "VERBS: Future in the past" lists only *was going to + verb*. The *would* half is the reported-speech / "MODALITY: Would" use. It's fine to teach, but the roadmap row could say so.
- **consider**, Facts, `examBank/grade11.ts:103`: "we will have used up much of the planet's fresh water" overstates it, because fresh water is renewable and the real risk is shortage. Fix: "…many regions will have run short of fresh water". The answer ("Using up fresh water.") would become "Running short of fresh water."
- **consider**, Answers, `examBank/grade11.ts:148`: "He teaches students who may become scientists." "get there" means space, so "He teaches students who may one day reach space." matches the passage more closely.
- **consider**, Lessons/Consistency, `lessons/grade11.ts:31` "He promised that he would help us." almost repeats `examBank/grade11.ts:95` "He said that he would help us." Change one of them.

Clean: Challenger distractors (all 24 pairs), rule/errorFix items, exam-bank grammar items (one correct answer each), the Explorer items, the army-service mention (an open owner item; the age is plausible: enlistment at 18 plus 32–36 months ends around 21).

### Grade 12

- **must fix**, Answers (Master builder), `curriculum/packs/core4/curriculum/grade12.ts:94–96`: "Would you tell a friend the truth if it hurt their feelings?" with the decoys `['will', 'hurts']`. Putting both decoys in builds "Will you tell a friend the truth if it hurts their feelings?", a fully correct first conditional. Fix: decoys `['will', 'hurted']`, or `['would', …]`-style errors that can't make a grammatical sentence, e.g. `['hurts', 'telling']`.
- **must fix**, Facts/Logic, `grade12.ts:213` (Master story, mission 2): "In some countries, big supermarkets must give away food… Others think that the rule is unfair to small shops, which may not have the time to organize it." The French law (2016) and similar laws apply only to large stores (over 400 m²), so small shops are exempt, and the "unfair to small shops" argument contradicts the passage's own "big supermarkets". The story also doesn't use the unit's modal passive. Fix: "In some countries, food that big supermarkets cannot sell must be given away to charities, and a penalty must be paid if it is thrown out. Supporters say that this law helps families in need. Others think that it is hard for charities to collect and store so much food. Either way, less food is wasted." Q: "Why do some people think the law is hard to follow?" Answer: "Charities may not be able to collect and store all the food."
- **must fix**, Facts, `examBank/grade12.ts:24`: "The player got a ____ for touching the ball with his hand." In soccer the player who handles the ball gets a foul or a card; the *other* team gets a penalty (kick). This is wrong, and in a soccer context it confuses penalty = עונש with penalty kick. Fix: "The driver had to pay a ____ for parking in the wrong place." (Hebrew "הנהג נאלץ לשלם קנס על חנייה במקום אסור."). The distractors can stay.
- **should fix**, Facts, `grade12.ts:318` (Master story, Boss): "They expected that most wallets with money would be kept." In Cohn et al. (Science, 2019) it was the economists and ordinary people the team surveyed who predicted that more money would mean fewer returns. Also "Instead, wallets with more money were returned more often" is accurate (38 of 40 countries). Fix: "Most people expected that wallets with money would be kept." and Q: "What surprised people about the results?" Answer unchanged.
- **should fix**, Suitability/Facts (reads like news), `grade12.ts:108`: "Last month, Ido, a teenager from Tel Aviv, found a bag with 10,000 shekels on a bench… the owner, an old woman, got in touch with him…". "Last month" plus a real city plus an exact sum reads like a real news report about a named teenager. Fix: "Ido, a teenager in our story, once found a bag with 10,000 shekels on a bench…" (or drop "Last month" and "from Tel Aviv").
- **should fix**, Suitability (gender balance), grade 12 as a whole: every person who acts morally is a boy (Yonatan `:55`, Ido `:108`, Eran `examBank/grade12.ts:129`, the "gentleman" captain `:261`), and the one named negative example is also a boy (Dan, `:73`). Girls appear only as "a girl from the other team" (`:300`), a sister and an old woman. Fix: make one hero a girl, e.g. Yonatan → Yael (`:55–60`, Hebrew "יעל… היא סיפרה") or Ido → Noa.
- **should fix**, English (punctuation), `grade12.ts:35`, `:55`, `:73`, `examBank/grade12.ts:129`: direct speech has no quotation marks ("Some people say, Who cares? It's only a small lie."; "Some said, Who cares? It's not our fault."; "His sister said, That's so selfish!"; "he says, If I had taken the money, …"). The Hebrew has them, and grade 11 (`grade11.ts:111`) uses them. Add the quotation marks. The sentence builder strips `"`, so the chips don't change. Check the Challenger cloze for `:35` still blanks "Who cares?".
- **should fix**, English/Level, `grade12.ts:37` (some kind of): "If you found a wallet, should you get some kind of reward?" This mixes the unit's If + past with *should*, and a reward for *finding* doesn't make sense. Fix: "If you returned a lost wallet, would you expect some kind of reward?" Hebrew: "אם הייתם מחזירים ארנק אבוד, הייתם מצפים לסוג של פרס?" Keep the Challenger distractors.
- **should fix**, Hebrew, `grade12.ts:32`, `:98`, `examBank/grade12.ts:13`: "זה גס רוח לבדוק… / זה גס רוח להפריע / זה גס רוח לדבר עם פה מלא". In Hebrew "גס רוח" describes a person, so "it is rude to…" is "זה לא מנומס ל…" or "זו גסות רוח ל…". Gloss: "גס רוח / לא מנומס".
- **should fix**, Hebrew, `grade12.ts:133` (membership): "חברות בחדר כושר" is a calque. Israelis say "מנוי לחדר כושר". Gloss "חברות (במועדון) / מנוי"; example "האם מנוי לחדר כושר צריך להיות בחינם לבני נוער?"
- **should fix**, English, `grade12.ts:136`: "Phones, games, that kind of thing should not be used in class." A list subject without a conjunction is awkward in a model sentence. Fix: "Phones, games and that kind of thing should not be used in class." (The Challenger blank still works.)
- **should fix**, English, `examBank/grade12.ts:18`: "It will ____ the baby." (annoy): music *wakes* or *disturbs* a baby, so "annoy the baby" is unnatural, and the Hebrew "יפריע" already drifts from the gloss. Fix: "Please turn down the music. It will ____ the neighbors." / "זה ירגיז את השכנים."
- **should fix**, Answers (Master builder), `grade12.ts:300`: "The best argument was given by a girl from the other team." The same chips also build "The best argument from the other team was given by a girl." (correct, slightly different meaning; exact-match check). It is also a past passive, not the unit's modal passive. Fix: "The winners will be chosen by three judges from the university." (decoys `['chose', 'was']`) or another modal-passive sentence with one valid order.
- **consider**, Level, `grade12.ts:233` (Boss key sentence): "If we lose the debate, we will still have learned a lot." This is a first conditional with the future perfect, neither of the unit's targets (second/third conditional, modal passive). Suggest: "If we had prepared more, we would have won the debate." (the Master errorFix uses the same idea, so maybe "If our team lost, we would still be proud.").
- **consider**, Lessons, `lessons/grade12.ts:70–77`: the question form "Should + subject + be + V3?" is tested (`examBank/grade12.ts:79`, voice `grade12.ts:198`, example `:133`) but the lesson never shows it. Add an example: "Should phones be banned in class?"
- **consider**, Lessons/Tiers, `lessons/grade12.ts:54` "If I saw a friend cheating, I would talk to him." is very close to the rule item `grade12.ts:48` "If I saw someone cheating, I would tell the teacher." Vary one of them. Likewise the Master voice line `:303` "Only a fool would cheat…" repeats the "Only a fool would…" frame from `:237`.
- **consider**, English, `grade12.ts:237` "Only a fool would believe everything he reads online." and `examBank/grade12.ts:103` "says it is his own": generic *he*. Use "they read" / "their own".
- **consider**, English (US), `grade12.ts:239`: "the staff were kind" is British; in US English it is "the staff was kind" or "the people who worked there were kind".
- **consider**, Hebrew (gloss order), `grade12.ts:236`: defeat "תבוסה / הפסד". The example and its Hebrew use "הפסד", so lead with "הפסד".
- **consider**, Suitability (open owner item): weapon (`:131`, a safety rule), bribery (`examBank/grade12.ts:129`, refused, in a novel), cheating and lying (always shown as wrong), animal testing (`examBank:79`), and the voting age (`:198`). All of it is fine for ages 16–18 and none is political in an Israeli party sense. My view: keep it. Hebrew `:131` "אסור אף פעם להשאיר נשק" reads better as "אסור בשום מקרה להשאיר נשק…".

Clean: all 24 Challenger pairs, the rule/errorFix items (one correct answer each; "If I would see…" and "If the team would have prepared…" are rightly marked wrong), the exam grammar items, both exam passages' answers, the zoo-debate Boss story.

### Decks (grades 11–12)

- **should fix**, English (US), `wordDecks/grade11.ts:106`: "Mint is a herb that grows easily." In US English the *h* is silent: "Mint is an herb that grows easily." (The en-US TTS voice says "erb", so "a herb" also sounds wrong.)
- **should fix**, Hebrew (gloss order), `wordDecks/grade11.ts:110`: spread out "להתפרס / להתפזר". The example ("The volunteers spread out along the beach" / "התפזרו") means "להתפזר", so lead with that.
- **consider**, Consistency, `wordDecks/grade11.ts:110` and `wordDecks/grade12.ts:116`: "spread out" and "come up with" are tagged `'phrase'`, while the other core decks tag phrasal verbs `'phrasal v'` (e.g. `grade11.ts:92` stand by).
- **consider**, Consistency: "expand" is glossed "להרחיב" as a wrong-word in `curriculum/packs/season2/curriculum/grade12.ts:611`, and "להתרחב" in this deck (the deck's gloss is right for its intransitive example).
- **consider**, Hebrew, `wordDecks/grade11.ts:103` pond "בריכה (טבעית)" is fine; "אגם קטן / בריכה טבעית" is clearer to a learner who knows בריכה as a swimming pool.

Clean otherwise: every deck word is Band III Core II, productive in the Ministry list, and in no other mission or deck. The facts (coral reefs and warming seas, desertification, wolves near villages, trees producing oxygen) are sound at this level. The `g12-core-4-arguing` words don't overlap the Season 2 "Linking Ideas" deck ("in short" next to "in brief", and "without a doubt" next to "undoubtedly", are near-synonyms but different Ministry entries).

### Pack settings

- **consider**, `curriculum/packs/registry.ts:69–80`: `titleHe: 'עונה 4'` / `titleEn: 'Season 4'` is a placeholder (an open owner item). It matches core-3 ("עונה 3"), so it is consistent. `after: 'core-3'`, `idUnitNumber: 24`, `xpUnitNumber: 10` (it continues core-3's 9 and the reward scale only grows), `wordsPerMission: ENRICHMENT_WORDS_PER_MISSION` (8 in grades 4–12, which matches the 8 words per mission in grades 11–12), and `grades: CORE_4_GRADES` (= core-3's 2–12) are all consistent with the roadmap. No issue.

## Facts verified

### Grades 2-4

| Claim | How verified | Source |
|---|---|---|
| Holon, Haifa, Eilat, Ashdod, Netanya, Rehovot are Israeli cities (g2) | General knowledge | common knowledge, not web-checked |
| Snow falls in Jerusalem in some winters (g4 exam passage 1) | General knowledge | Israel Meteorological Service climate record (not web-checked in this run) |
| Rain in the north while the south is dry; spring rain in Israel (g4 Boss story, "sometimes" example) | General knowledge of Israeli climate | not web-checked; framed as a fictional forecast, so no factual risk |
| Saturday as a family day (g2 exam passage 2) | Weekend in Israel | common knowledge |
| Prices in shekels / dollars (g4 deck) | Plausible amounts, fictional | n/a |

No other factual claims in grades 2-4; all named people (Noa, Tom, Lior, Dana, Yoni, Lea, Gil, Yael, Roni…) are clearly fictional. Word-band claims checked against `docs/ministry-sources/raw/parsed/wordLists.json` (all grade 2 words Pre-Band I; grade 3 all Pre-Band I except `a bit`; grade 4 all Band I Core I/II; deck `ministryList` tags all match). Grammar levels checked against `grammarLists.json`.

### Grades 5-7

| Claim | Where | How verified | Result | Source |
|---|---|---|---|---|
| Alexander Graham Bell, telephone, 1876 | g7 `curriculum:54` | Web search | Correct: patent No. 174,465 granted 7 March 1876; first call 10 March 1876. Others (Reis, Gray, Meucci) worked on similar devices, but "made a machine that could carry a voice over a wire" is fair. | history.com "Alexander Graham Bell patents the telephone"; historyofinformation.com id=507; IEEE History "The Telephonic Bell" |
| Hedy Lamarr: film star, WWII secret radio signals | g7 `curriculum:158` | Web search | Correct in substance: with George Antheil, US patent 2,292,387 "Secret Communication System" (filed 1941, granted Aug 1942), frequency hopping for torpedo guidance. Not used by the Navy in WWII, so "helped send" is imprecise (finding above). | APS News "This Month in Physics History"; Smithsonian Air & Space "The Hollywood Bombshell…"; MIT Lemelson "Hedy Lamarr" |
| "Some people say Wi-Fi and Bluetooth use ideas like hers" | g7 `curriculum:158` | Web search | Hedged claim is acceptable. Bluetooth uses frequency hopping. Modern Wi-Fi mostly uses other techniques (only the original 802.11 had a frequency-hopping mode), so the Wi-Fi link is the weaker half. | Scientific American blog "Hop, Skip and a Jump"; Autodesk blog on wireless technologies |
| USB flash drive developed by an Israeli company | g7 `examBank:103` | Web search | Partly true: M-Systems (Dov Moran, Amir Ban, Oron Ogdan) filed in April 1999 and sold the DiskOnKey with IBM in 2000. Trek 2000 (Singapore) is credited by Britannica with the first sale; Netac and IBM also claim it. The origin is disputed, so it needs "one of the first". | IEEE Spectrum "Who Really Invented the Thumb Drive?"; Britannica "USB flash drive"; Wikipedia "M-Systems" |
| Drip irrigation began in Israel | g7 `examBank:103` | Web search | True only for modern drip irrigation (Simcha Blass's emitter 1959, Netafim with Kibbutz Hatzerim 1965). Earlier forms: Germany 1860s clay pipes, E. B. House (Colorado) 1913, perforated pipe in 1920s Germany. | Wikipedia "Simcha Blass"; Times of Israel "What Israeli drips did for the world"; DripWorks "The Origins of Drip Irrigation"; cawaterlibrary 1977 article |
| Rachel, a famous Israeli poet | `wordDecks/grade7.ts:109` | Web search | Rachel Bluwstein, 1890–1931, Hebrew poet, immigrated 1909, on the 20-shekel note. "Famous" is right; "Israeli" is loose because she died before 1948 ("Hebrew poet" is preferred). | Wikipedia "Rachel Bluwstein"; Library of Congress blog (2021) "Rachel Bluwstein (1890–1931), Hebrew poetess and pioneer"; Jewish Virtual Library |
| Marie Curie won two Nobel Prizes | g7 `curriculum:130` | Own knowledge, not web-searched | Correct: Physics 1903, Chemistry 1911. | — |
| Dead Sea: you can read a newspaper while floating | g6 `curriculum:323` | Web search | Correct: the very salty water makes floating effortless, and reading a newspaper is a classic photo. So "nearly floated" is wrong (finding above). | USGS "Dead Sea floating"; UIUC Physics Van "Floating in the Dead Sea" |
| Smaller fictional/plausible details: Haifa by train in about an hour, camels on the way to Eilat, Galilee helicopter rides, 20-shekel-scale prices, 26 letters in the alphabet | g5–g6 stories, g5 deck | Own knowledge | Plausible or true. The English alphabet has 26 letters. | — |
| Haifa school robots: "the city uses robots that clean three beaches" | g7 `curriculum:111` | Not verifiable | This is invented, but it reads as fact about a real city (finding above). | — |

### Grades 8-10

| Claim | Where | How verified | Source |
|---|---|---|---|
| 101 = Magen David Adom ambulance / medical emergency in Israel (100 police, 102 fire) | g10 `:26`, lesson, exam passage; g8 exam "call 100" (police) | WebSearch | en.wikipedia.org/wiki/Magen_David_Adom; ynetnews.com "What happens when you call 101?"; en.wikipedia.org/wiki/Emergency_medical_services_in_Israel |
| Black flag on Israeli beaches = swimming forbidden / dangerous sea (white = OK, red = caution) | `examBank/grade10.ts:103–117` | WebSearch | shlomirosenfeld.co.il/en/kmusa/yam-israeli-sea; jewishpress.com public-safety announcement on Israel's beach flags. The text's "the sea is dangerous, so stay on the sand" is accurate. A tighter wording is "swimming is not allowed". |
| Bee sting: watch for allergy; facial swelling → call emergency at once | `examBank/grade10.ts:129` | WebSearch | redcross.org "Insect Bites and Stings"; mayoclinic.org bee-sting first aid; poison.org "Bee stings: is it an allergic reaction?". Safe as written. (Real guidance also says to use the person's epinephrine auto-injector if they have one; it doesn't need to be in the text.) |
| Burn: cool with (cool) running water, no ice | g10 `:47`, `:257` | WebSearch | nhs.uk burns-and-scalds treatment; health.clevelandclinic.org "How to treat a burn"; redcross.org.uk burns. No MDA page found, but the international guidance agrees. "Cold water" is acceptable; "cool" is the stricter wording. |
| Fainting: lay the person down (legs up), call emergency if they don't come round | g10 `:26` | WebSearch | mayoclinic.org "Fainting: First aid"; nhs.uk fainting. Correct; adding "raise their legs" is optional. |
| Gas smell: ventilate, leave, no flames or switches; Israel fire service 102 | g10 `:100` | WebSearch | dsb.no (Norway) and gas.city.sendai.jp: ventilate and leave; en-safety.tau.ac.il and efrat.muni.il: 102. Sources differ on windows (some US fire departments say leave them alone); "open the windows and leave" matches European and Israeli practice. No official Israeli gas-leak page was found. |
| Israel became independent in 1948 (declared 14 May 1948) | deck `grade10.ts:102` | WebSearch | timesofisrael.com "Israel's Declaration of Independence — May 14, 1948"; catalog.archives.gov.il (Israel State Archives) |
| Martin Luther King led a movement for equal rights (US civil rights movement) | deck `grade10.ts:116` | WebSearch | history.com/topics/civil-rights-movement/martin-luther-king-jr; nps.gov/mlkm |
| Ancient Egyptians built a great civilization | deck `grade10.ts:117` | General knowledge (uncontroversial); not searched | — |
| Lightning → go indoors; no elevator in a fire; lifeguard advice | g10 | General knowledge, standard safety advice; not searched separately | — |
| Seasickness → look at the horizon (suggested fix) | g10 `:72` | My search returned nothing on this; general knowledge only | unverified |
| Grade 8 news/interview stories are fiction | g8 all | Read: no named real person, place or event; reporters, ministers and singers are generic | — |
| Grade 9: pilot lessons at 17, female firefighters, babysitting | g9 | Plausible general statements, no specific claim to check | — |

### Grades 11-12

| Claim | Where | How verified | Result / source |
|---|---|---|---|
| World population "almost ten billion" by 2050 | `examBank/grade11.ts:103` | WebSearch, UN WPP 2024 | Correct enough: WPP 2024 projects ~9.7 bn in 2050 (WPP 2022: 9.7 bn), peak ~10.3 bn mid-2080s. [UN WPP 2024 summary](https://www.un.org/development/desa/pd/world-population-prospects-2024), [UN News](https://news.un.org/en/story/2024/07/1151971) |
| In 1900, many people believed everyone would fly to work by 2000 | `curriculum/grade11.ts:216` | WebSearch | Overstated: some writers and artists imagined air commuting (J. E. Watkins Jr., "What May Happen in the Next Hundred Years", *Ladies' Home Journal*, Dec 1900; Jean-Marc Côté's "year 2000" postcards, 1899–1910), but there is no evidence of a widespread belief. [earlyradiohistory.us transcript](https://earlyradiohistory.us/1900next.htm), [Open Culture](https://openculture.com/2013/12/ladies-home-journal-publishes-28-predictions.html) |
| Grandpa's immigration from Ethiopia | `curriculum/grade11.ts:242,265` | Background knowledge (Operations Moses 1984–85 and Solomon 1991, plus ongoing aliyah) | No historical detail is claimed. A grandparent of a 16-year-old in 2026 who made aliyah from Ethiopia is plausible. The portrayal is respectful. |
| Army service finished by 21 | `curriculum/grade11.ts:111` | Background knowledge | Plausible: enlistment at 18, 32–36 months of service. |
| Lost-wallet experiment: wallets with more money returned more often | `curriculum/grade12.ts:318` | WebSearch | Correct: Cohn, Maréchal, Tannenbaum & Zünd, *Science* 2019. 17,303 wallets, 355 cities, 40 countries; money raised reporting rates in 38 of 40 countries (about 51% vs 40%). The surveyed economists and lay people predicted the opposite, not "the researchers". [NPR](https://npr.org/2019/06/20/734141432/what-dropping-17-000-wallets-around-the-globe-can-teach-us-about-honesty), [ScienceDaily](https://www.sciencedaily.com/releases/2019/06/190620153447.htm), [Scientific American](https://www.scientificamerican.com/article/missing-wallets-with-more-cash-are-more-likely-to-be-returned/) |
| Some countries make supermarkets give away unsold food, with a penalty | `curriculum/grade12.ts:213` | WebSearch | Correct for France: the Garot law (Feb 2016) requires stores over 400 m² to make donation agreements and bans destroying edible food, with fines (amounts vary by source and year). The Czech Republic (2018, stores over 400 m²) is supported only by a weak secondary source plus background knowledge; "some countries" stands. The law covers *large* stores only, so the story's "unfair to small shops" is inconsistent. [Interreg Europe](https://interregeurope.eu/good-practices/french-law-against-food-waste), [CS Monitor](https://m.csmonitor.com/Environment/2018/0103/How-France-became-a-global-leader-in-curbing-food-waste), [deutschland.de](https://www.deutschland.de/en/what-we-can-learn-from-france-food-should-not-be-thrown-away) |
| Handball gives "the player" a penalty | `examBank/grade12.ts:24` | Laws of the Game (background knowledge) | Wrong: a deliberate handball is a foul, and the *opposing* team gets a free kick or penalty kick; the player may get a card. |
| Coral reefs at risk from warming sea; desert expanding; trees produce oxygen | `wordDecks/grade11.ts` | Background knowledge | Correct at this level. |
| Fictional named people (Noa, Tom, Lior, Shira, Maya, Noam, Avi, Yonatan, Dan, Ido, Eran) | various | Read as fiction | All fine, except Ido (`grade12.ts:108`), whose "Last month… from Tel Aviv… 10,000 shekels" reads like a news report. |

## How each band was checked

### Grades 2-4

Scope: `src/data/curriculum/packs/core4/{curriculum,lessons,examBank}/grade{2,3,4}.ts` and the `packId: 'core-4'` deck in `src/data/wordDecks/grade4.ts` (lines 85-110). Paths below are relative to `src/data/`. Challenger fill-ins were checked against the engine (`tierSteps/challengerSteps.ts` + `utils/hints.ts` `toExactClozeSentence`): `clozeWrong[i]` goes with `vocab[i]`'s example, blank matched case-insensitively at word boundaries; every headword appears exactly once in its example, so no blank leaks the answer. Owner calls already listed in `docs/content-packs-open-items.md` (glosses for in front of, kid, go away, It's not fair, fifth, wait a minute, heavy; plural "you") are not re-raised.

Overall: grade 2 is close to ready; grade 3 has a real level problem (past-simple stories) plus a few answer items; grade 4 has 3 must-fix exam items and several lesson gaps. Nothing unsuitable. No sentence repeats core-3 or another core-4 grade (scripted exact-string check over all curriculum, lesson, exam-bank and deck files; only stock prompts like "Which sentence is right?" recur).

### Grades 5-7

Scope: `src/data/curriculum/packs/core4/{curriculum,lessons,examBank}/grade5–7.ts`, plus the `packId: 'core-4'` decks in `src/data/wordDecks/grade5.ts` (`g5-core-4-school`), `grade6.ts` (`g6-core-4-opinions`) and `grade7.ts` (`g7-core-4-arts`). Paths below are relative to `src/data/curriculum/packs/core4/` unless they start with `wordDecks/`.

How it was checked:
- Every Challenger `clozeWrong` pair was tried in its word's example sentence, the way `challengerSteps.ts` blanks it (`toExactClozeSentence`, headword as written).
- Every rule, error-fix, story and exam question was checked for a second correct answer.
- Every mission word and deck word was looked up in `wordLists.json`. All of them are in the right band (grade 5–6 words are in Band I, grade 7 words in Band II; `let me know` matches `let sb know (sth)`, Band II Core I). No deck word repeats a word taught elsewhere in the app.
- Grammar headings were checked against `grammarLists.json`: `be going to` (affirmative, negative, Wh-questions) is Band I, grade 5; defining relative clauses are Band II, grade 7.
- Repeated sentences were searched with a script across all of `src/data/curriculum` and `src/data/wordDecks`, including core-3 and the other core-4 grades. No content sentence repeats; only the standard prompts ("Which sentence is right?") and a few short answer options do.
- Topics were compared with core-3 grades 5–7 (Future Me / will, Sports / adverbs, Café / would like + reflexives). None overlap.
- Owner decisions in `docs/content-packs-open-items.md` (the core-4 "Hebrew judgment calls" and "Content choices", e.g. Saturday at the beach) were not raised again.

Two house conventions were left alone: dialogue in English passages has no quotation marks (core-3 does the same), and "you" is translated as a plural.

### Grades 8-10

Scope: `src/data/curriculum/packs/core4/{curriculum,lessons,examBank}/grade8–10.ts` and the `packId: 'core-4'` decks in `src/data/wordDecks/grade8.ts`, `grade9.ts` and `grade10.ts`. Paths below are relative to `src/data/`. No repo file was edited.

Checks run besides reading:
- Every Challenger `clozeWrong` pair, matched by index against its word's example sentence (`tierSteps/challengerSteps.ts:36`). I found no distractor that also fits a blank, in any of the 72 items.
- Every mission and deck word, looked up in `wordLists.json`. All of them are in the right band: grade 8 is Band II Core I, grade 9 is Band II Core II, and grade 10 missions are Band III Core I (4-point). The deck `ministryList` tags match the list too; the one exception is "put an end to", which the list has as "put an end to sth".
- The grammar headings, checked in `grammarLists.json`.
- A search for repeated sentences: every English sentence of 23+ characters in the nine files, searched across all of `src/data`.
- No overlap in topic or sentences with core-3 grades 8–10 (Made in Israel / Identity / Gap Year Plans).

### Grades 11-12

Scope: `src/data/curriculum/packs/core4/{curriculum,lessons,examBank}/grade11.ts|grade12.ts`, the `packId: 'core-4'` decks in `src/data/wordDecks/grade11.ts` (`g11-core-4-nature`) and `grade12.ts` (`g12-core-4-arguing`), and the `'core-4'` entry in `src/data/curriculum/packs/registry.ts`. Paths below are relative to `src/data/`. Owner items still open in `docs/content-packs-open-items.md` (core-4 "judgment calls to confirm") are commented on only where the house rules (gloss order, US usage) give a clear answer.

Overall: the grammar is right, every marked answer checked is right, every Challenger `clozeWrong` pair was checked against its blanked example (none is also correct), and all 48 mission words are in Band III Core I (4-point), all 40 deck words in Band III Core II (5-point). The must-fix items are three facts or logic errors in stories, one Master decoy pair that builds a fully correct sentence, a reported-speech inconsistency between missions 1 and 2 of grade 11, and one wrong football fact in the grade 12 exam bank. The Ethics unit is fit for grades 11–12.

## Counts by category

### Grades 2-4

| Grade | Category | must fix | should fix | consider |
|---|---|---|---|---|
| 2 | Level | 0 | 1 | 3 |
| 2 | Lessons | 0 | 1 | 0 |
| 2 | English | 0 | 0 | 2 |
| 2 | Answers | 0 | 0 | 1 |
| 2 | Hebrew | 0 | 0 | 1 |
| 2 | Suitability | 0 | 0 | 1 |
| **2** | **total** | **0** | **2** | **8** |
| 3 | Level | 0 | 2 | 1 |
| 3 | Answers | 0 | 4 | 0 |
| 3 | Consistency | 0 | 1 | 0 |
| 3 | Hebrew | 0 | 1 | 2 |
| 3 | English | 0 | 0 | 2 |
| **3** | **total** | **0** | **8** | **5** |
| 4 | Answers | 2 | 4 | 2 |
| 4 | Consistency | 1 | 0 | 2 |
| 4 | Lessons | 0 | 3 | 0 |
| 4 | English | 0 | 3 | 1 |
| 4 | Level | 0 | 0 | 2 |
| 4 | Hebrew | 0 | 0 | 1 |
| **4** | **total** | **3** | **10** | **8** |
| **All** | | **3** | **20** | **21** |

Facts, Tiers and Suitability (grades 3-4): no findings. Tiers: in every mission Master's sentence, rule and story differ from Challenger's.

### Grades 5-7

Findings per category per grade, by severity (must / should / consider).

| Category | Grade 5 | Grade 6 | Grade 7 | Total |
|---|---|---|---|---|
| Facts | 0 / 0 / 0 | 1 / 0 / 0 | 0 / 5 / 0 | 1 / 5 / 0 |
| English | 0 / 2 / 1 | 0 / 1 / 1 | 1 / 3 / 1 | 1 / 6 / 3 |
| Answers | 1 / 1 / 2 | 1 / 0 / 1 | 0 / 1 / 1 | 2 / 2 / 4 |
| Hebrew | 0 / 0 / 3 | 0 / 3 / 2 | 0 / 2 / 1 | 0 / 5 / 6 |
| Level | 0 / 0 / 0 | 0 / 0 / 1 | 0 / 0 / 0 | 0 / 0 / 1 |
| Tiers | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 | 0 / 0 / 0 |
| Lessons | 0 / 1 / 0 | 0 / 0 / 1 | 0 / 0 / 1 | 0 / 1 / 2 |
| Suitability | 0 / 0 / 0 | 0 / 0 / 1 | 0 / 0 / 1 | 0 / 0 / 2 |
| Consistency | 0 / 1 / 1 | 0 / 2 / 1 | 0 / 0 / 2 | 0 / 3 / 4 |
| **Total** | **1 / 5 / 7** | **2 / 6 / 8** | **1 / 11 / 7** | **4 / 22 / 22** |

How findings were counted:
- Each finding is counted once, under its first category.
- The grade 7 Haifa robot finding (Facts / Suitability) is counted under Facts.
- The grade 5 rain finding (Answers / English) is counted under Answers.
- The grade 6 "Because…" story finding (Lessons / Tiers) is counted under Lessons.
- The grade 7 `an` cloze finding is counted under Answers.

Overall: the grades 5–7 units are close to ready. The grammar matches the Ministry headings, every word is in its band, and the tiers are really different questions: no Master item reuses Challenger's sentence, rule or story. All 48 Challenger fill-ins have no second correct option, apart from the two `an` give-aways in grade 7. The 4 must-fix items and the grade 7 fact nuances (USB, drip irrigation, Hedy Lamarr, Haifa) should be fixed before release.

### Grades 8-10

| Grade | Category | must fix | should fix | consider |
|---|---|---|---|---|
| 8 | English | 1 | 4 | 4 |
| 8 | Answers | 0 | 2 | 0 |
| 8 | Level | 0 | 1 | 0 |
| 8 | Hebrew | 0 | 1 | 1 |
| 8 | Consistency | 0 | 1 | 1 |
| 8 | **Total** | **1** | **9** | **6** |
| 9 | English | 1 | 5 | 1 |
| 9 | Answers | 0 | 1 | 0 |
| 9 | Hebrew | 0 | 1 | 1 |
| 9 | Suitability | 0 | 0 | 1 |
| 9 | Consistency | 0 | 1 | 0 |
| 9 | **Total** | **1** | **8** | **3** |
| 10 | English | 1 | 6 | 1 |
| 10 | Level | 0 | 1 | 0 |
| 10 | Hebrew | 0 | 1 | 1 |
| 10 | Suitability | 0 | 2 | 1 |
| 10 | Facts | 0 | 0 | 3 |
| 10 | **Total** | **1** | **10** | **6** |
| **All** | | **3** | **27** | **15** |

Notes on the counts:
- The g10 `:137` must fix is counted under English; it is also a Suitability (safety) problem. The g10 `:31` gas-tank finding is counted under Suitability.
- The g8 "the Master decoy `is` at `:279`" sub-item is folded into its should-fix bullet.
- No Tiers or Lessons findings: Master never reuses Challenger's sentence, rule or story in these grades, and the lesson rules match their examples. The lesson gaps are the Level findings above.

### Grades 11-12

| Grade | Category | Must fix | Should fix | Consider |
|---|---|---|---|---|
| 11 | Facts | 1 | 1 | 1 |
| 11 | English | 0 | 3 | 0 |
| 11 | Answers | 0 | 1 | 3 |
| 11 | Hebrew | 0 | 3 | 2 |
| 11 | Level | 0 | 0 | 1 |
| 11 | Lessons | 0 | 0 | 2 |
| 11 | Consistency | 1 | 0 | 0 |
| 11 | Decks (Hebrew 1, English 1 / Consistency 1, Hebrew 1) | 0 | 2 | 2 |
| **11 total** |  | **2** | **10** | **11** |
| 12 | Facts | 2 | 1 | 0 |
| 12 | Answers | 1 | 1 | 0 |
| 12 | English | 0 | 4 | 2 |
| 12 | Hebrew | 0 | 2 | 1 |
| 12 | Suitability | 0 | 2 | 1 |
| 12 | Level | 0 | 0 | 1 |
| 12 | Lessons / Tiers | 0 | 0 | 2 |
| 12 | Decks (Consistency) | 0 | 0 | 1 |
| **12 total** |  | **3** | **10** | **8** |
| Pack settings |  | 0 | 0 | 1 |
| **All** |  | **5** | **20** | **20** |

Note on the counts: the grade 11 Facts must-fix (1900 predictions) and grade 12 Facts must-fix (supermarket law) are also logic errors in their stories. Grade 12's must-fixes are the Master decoys (`:96`, Answers), the supermarket story and the exam handball item (`examBank/grade12.ts:24`, both Facts). The wallet item is a should fix.


## Fix log (2026-11-23)

All must-fix and should-fix findings were applied on 2026-11-23, except the three owner decisions listed under "Left to the owner" in `docs/content-packs-open-items.md` (core-4 section) and one should-fix that was skipped on a closer look (grade 3 "a bit": Pre-Band I lists "bit", so it is not out of band). The "consider" items are not applied yet.

Shared engine change: Challenger fill-ins whose blank opens the sentence now show every option capitalized (`caseOptionsForCloze`, `src/utils/hints.ts`), and the option's 🔊 still reads the text as written (`speakEn`), so released options keep their clips. The TTS corpus now collects what an option actually speaks (`speakEn ?? textEn`).

### Grades 2-4

Paths relative to `src/`. Status per must/should finding (consider items were not applied).

### Engine (shared)
- **Fill-in casing (g3 once upon a time, g4 wait a minute, g4 nobody)** · fixed · `utils/hints.ts` new `caseOptionsForCloze(cloze, options)`: when the blank opens the sentence every option is capitalized; mid-sentence options stay as written. Used in `data/tierSteps/challengerSteps.ts:36-40` (answer + both distractors go through it; the Hebrew feedback still names the headword). Test: `utils/hints.test.ts` "caseOptionsForCloze" (2 cases). Exam-bank items are authored with their own casing and were already consistent, and the Explorer/base word-choice steps are not sentence fill-ins, so nothing else needed it.

### Grade 2
- Third-person -s tested · fixed · `data/curriculum/packs/core4/curriculum/grade2.ts:285` decoy `helps` → `is`; `:290-293` errorFix now "I help my dad with the box." vs "I helps…", "Me help…", "…the box with." (explain/hint updated); `data/curriculum/packs/core4/examBank/grade2.ts:86-89` now "We help Mom." vs "We helps Mom." / "Us help Mom.".
- Lesson "Where does Tom live?" · fixed · `data/curriculum/packs/core4/lessons/grade2.ts:11` → "Where do your friends live?" / "איפה החברים שלכם גרים?" (my first suggestion, "Where do you live, Tom?", failed `miniLessons.test.ts`: a lesson must not show the mission answer "Where do you live?").

### Grade 3
- Past-simple stories (level) · **owner decision**, left as is.
- `a bit` not Pre-Band I · **skipped**: on a closer look Pre-Band I lists `bit` (prod), and "a bit" is its everyday use; the Band I Core II entry is just the phrase listed again. Not a band violation.
- Master decoy `were` · fixed · `curriculum/grade3.ts:98` → `are`.
- clozeWrong `last` for "and ____ we play" · fixed · `curriculum/grade3.ts:88` → `['their', 'them']`.
- Elided verb vs the lesson rule · fixed · `curriculum/grade3.ts:151-152` "I am tired, but I am happy." / "אני עייף/ה, אבל אני שמח/ה."; `:172` "Dan likes ice cream, but he does not like cake.".
- Fill-in casing · fixed by the engine change above.
- Exam option "On the farm." · fixed · `examBank/grade3.ts:123` → "In a shop.".
- "דנה חמישית" Hebrew · fixed · `curriculum/grade3.ts:237` "דנה במקום החמישי במרוץ."; `:259` "אבל היא הגיעה למקום החמישי.".

### Grade 4
- MUST exam "together" fits · fixed · `examBank/grade4.ts:42-45` item rewritten: "Today is Monday, and ____ is Tuesday." (`tomorrow`; wrong `nobody`, `everything`; Hebrew "היום יום שני, ומחר יום שלישי."). Also removes the present-continuous-for-future use there.
- MUST exam "storm" fits · fixed · `examBank/grade4.ts:39` wrong → `['easily', 'nobody']`.
- MUST afternoon vs early · fixed · `examBank/grade4.ts:129` "a hot summer morning" (Hebrew `:131` "זה בוקר חם בקיץ.").
- clozeWrong `close` for "Is the bus coming ____?" · fixed · `curriculum/grade4.ts:185` → `['storm', 'evening']`.
- clozeWrong `heavy` for "The snow is falling ____." · fixed · `curriculum/grade4.ts:88` → `['dry', 'afternoon']`.
- Fill-in casing · fixed by the engine change above.
- Present continuous for the future · fixed · `curriculum/grade4.ts:230` `tomorrow` example → "We can play in the snow tomorrow." / "אנחנו יכולים לשחק בשלג מחר."; `:273-278` Explorer story → "Today we are learning about rain. Our teacher is showing us pictures of a storm." (Q "What are they learning about today?" → rain / snow); `:297` Master voice → "Today we are traveling to the beach." / "היום אנחנו נוסעים לים."; exam item as above.
- "Tomorrow the rain is stopping" · fixed · `curriculum/grade4.ts:255` → "In the north, the rain is stopping now, so you can travel soon." (Hebrew `:257` "בצפון הגשם נפסק עכשיו, אז בקרוב אפשר לנסוע.").
- Noa narrative · fixed · `curriculum/grade4.ts:107` → "Suddenly it is raining very hard. Noa doesn't stop, because her house is near.".
- Short answers not taught · fixed · `lessons/grade4.ts:25-26` idea adds "ועונים בקצרה: Yes, it is. / No, it isn't."; pattern "Is it …ing? · Yes, it is. / No, it isn't. · What are you doing?".
- -ing spelling not taught · fixed · `lessons/grade4.ts:8` adds "שימו לב לאיות: make → making, sit → sitting.".
- Yael raincoat · fixed · `curriculum/grade4.ts:308` "…At three o'clock the storm comes, so Yael puts on her raincoat. Everything is wet, but Yael is dry."; answer `:312` "She is wearing her raincoat."; hint "What does Yael put on at three o'clock?".
- Deck "forty" · fixed · `data/wordDecks/grade4.ts:103` "These shoes cost forty shekels." / "הנעליים האלה עולות ארבעים שקלים." (emoji 👥 → 👞).

Tally: 3 must fixed; 20 should → 18 fixed, 1 skipped (`a bit`), 1 owner decision (grade 3 past simple).

Tests: `npx vitest run src/data src/utils/hints.test.ts`: 72 files, 3079 tests passed. `tsc -b` reports no errors in the touched files. Nothing committed.

New English text that needs a clip (`tts:check` will list it): g2 "I help my dad with the box." (+3 wrong options), "We help Mom." / "We helps Mom." / "Us help Mom.", "Where do your friends live?"; g3 "I am tired, but I am happy.", "Dan likes ice cream, but he does not like cake.", "In a shop."; g4 "We can play in the snow tomorrow.", the new Explorer story, "What are they learning about today?", "Today we are traveling to the beach.", the edited Boss story, the Noa and Yael Master stories, "She is wearing her raincoat.", "What does Yael put on at three o'clock?", "Today is Monday, and ____ is Tuesday." (and its full form), the morning beach passage, "These shoes cost forty shekels."; capitalized fill-in options at sentence start ("Once upon a time", "Wait a minute", "Nobody", "Good night", "Thank you", "Happy birthday", "Tomorrow", "Think"). Single words are keyed in lowercase, so only the multi-word ones may be new.

### Grades 5-7

All 4 must-fix and 22 should-fix findings were applied: **26 fixed, 0 skipped, 0 left for the owner.** One of them (grade 6 `double`) touches a gloss on the owner's "judgment calls" list; only its order changed, so the owner can still revert it.

Paths are relative to `src/data/curriculum/packs/core4/` unless they start with `wordDecks/` (which means `src/data/wordDecks/`).

### Grade 5
| Finding | Status | Where, what changed |
|---|---|---|
| must: Itay Q3 has a second true option | fixed | `examBank/grade5.ts:123` wrong `'After soccer practice.'` → `'On Saturday morning.'` |
| should: Eden "rain all day" | fixed | `curriculum/grade5.ts:112` → "…going to rain all day on Saturday." |
| should: lessons miss the negative and Wh-questions | fixed | `lessons/grade5.ts:8,13`: idea text now has the negative, and example 3 is "They are not going to ride bikes." `:25,28`: idea text now has "What are you going to do?", and example 1 is "What are you going to eat?" (lessons allow at most 3 examples, so examples were swapped, not added) |
| should: m2 quickTry repeats exam Q4 | fixed | `lessons/grade5.ts:33–36`: quickTry is now "Is Tom going to come?" → "Yes, he is." / wrong "Yes, he does." |
| should: "all my class" | fixed | `examBank/grade5.ts:12` → "my whole class" |
| should: "English is fun with games." | fixed | `wordDecks/grade5.ts:104` → "We learn English with fun games." / "אנחנו לומדים אנגלית עם משחקים כיפיים." |

### Grade 6
| Finding | Status | Where, what changed |
|---|---|---|
| must: `alone` also fits "…so we left ____" | fixed | `examBank/grade6.ts:39` wrong → `['strange', 'excellent']` |
| must: "nearly floated" (Dead Sea) | fixed | `curriculum/grade6.ts:323` → "she floated like a boat" |
| should: lesson idea text = Challenger rule answer | fixed | `lessons/grade6.ts:8` → "When the bell rang, we went out." / "We went out when the bell rang." |
| should: m2 quickTry = exam grammar Q3 | fixed | `lessons/grade6.ts:33–36` → "We stayed inside ___ the heat." (because of / wrong "because") |
| should: `gate` "when the plane was late" | fixed | `curriculum/grade6.ts:33` → "When we got to the airport, we waited at the gate." / "כשהגענו לשדה התעופה, חיכינו בשער." The fill-in options (notice, journey) are still wrong options. |
| should: "מה עשה את הרעש" | fixed | `curriculum/grade6.ts:158` → "מה השמיע את הרעש המוזר?" |
| should: `double` gloss order | fixed (owner list) | `curriculum/grade6.ts:243` → "זוגי / כפול". This gloss is on the owner's "judgment calls" list; only the order changed. |
| should: `mean` gloss order | fixed | `wordDecks/grade6.ts:97` → "פירושו / להתכוון" |

### Grade 7
| Finding | Status | Where, what changed |
|---|---|---|
| must: "in trouble with a science project" | fixed | `curriculum/grade7.ts:215` → "When Ori had trouble with a science project" |
| should: `an` give-aways (emoji, error) | fixed | `curriculum/grade7.ts:32` emoji example → "She sent me an emoji that has a big smile." / "היא שלחה לי אימוג׳י שיש לו חיוך גדול." with wrong options `['option', 'error']` (`:85`). `:34` error example → "There is an error in the code that I wrote, so the app doesn't work." / "…, אז האפליקציה לא עובדת." with wrong options `['advantage', 'option']` (`:87`). Every option now starts with a vowel. |
| should: USB flash drive | fixed | `examBank/grade7.ts:103,105` → "One of the first USB flash drives, which store files, was developed by an Israeli company." / "אחד החסנים הניידים (דיסק און קי) הראשונים… פותח בחברה ישראלית." |
| should: drip irrigation, "Many inventions" | fixed | same passage → "Some inventions…", "Modern drip irrigation… was also developed in Israel." / "כמה המצאות…", "גם ההשקיה בטפטוף המודרנית… פותחה בישראל." |
| should: Hedy Lamarr "helped send" | fixed | `curriculum/grade7.ts:158,160` → "an idea for sending secret radio signals" / "רעיון לשליחת אותות רדיו סודיים". The hedged Wi-Fi/Bluetooth sentence is kept. The question ("When did…?") and its answers are unchanged. |
| should: Haifa robots as fact | fixed | `curriculum/grade7.ts:111` → "students from a school near the sea…", "Now the school's robots clean the beach every week." The question and answers are unchanged. |
| should: "wins the fair" | fixed | `curriculum/grade7.ts:235` mission sentence → "The team that wins at the fair will visit a real lab." (all words are glossed; `wordGlosses.test` passes). `examBank/grade7.ts:97` → "The girl who won first prize at the fair is my cousin." / "הילדה שזכתה בפרס הראשון בתערוכה…" |
| should: "according to" placement | fixed | `curriculum/grade7.ts:242` → "The team that wins gets a trophy, according to the rules." / "הקבוצה שמנצחת מקבלת גביע, לפי החוקים." The phrase stays out of first position, so the fill-in doesn't depend on the capitalization engine fix. |
| should: "cheap, reasonable water filter" | fixed | `curriculum/grade7.ts:263,265` → "a water filter at a reasonable price" / "מסנן מים במחיר סביר" |
| should: `let me know` Hebrew "מתי" | fixed | `curriculum/grade7.ts:244` → "…כשההמצאה שלכם מוכנה." |
| should: `scene` gloss "מחזה" | fixed | `wordDecks/grade7.ts:113` → "סצנה / תמונה (במחזה)" |
| should: Rachel "Israeli poet" | fixed | `wordDecks/grade7.ts:109` → "Rachel was a famous Hebrew poet." / "רחל הייתה משוררת עברית מפורסמת." |

Not touched, as instructed:
- Missing quotation marks around direct speech (owner decision).
- The fill-in capitalization engine (owned by the grade 2–4 agent).
- All "consider" items.

### Tests
`npx vitest run src/data`: 3039 passed, 2 failed, 1 error. None of them are in grades 5–7:
- **The 2 failures:** both are `miniLessons.test.ts > never shows a mission answer in its lesson`, which stops at **g2-u24-m1**, the grade 2 agent's area.
- **The error:** `homeTips.storage.test.tsx` cannot start its jsdom worker (`Cannot find module '@asamuzakjp/css-color'`). That is the local install, not the content.

Because the lesson test stops at its first failure, the same check was run on grades 5–7 alone in a temporary test (deleted afterwards). It passed. `wordGlosses.test`, `tierSeedLint` and the content-pack tests pass.

### Grades 8-10

Applied 2026-11-23. Line numbers are the current ones. **Correction:** the grade 8 line numbers in the findings above were estimates (I read that file without line numbers); the real ones are given here. Paths are under `src/data/`.

### Grade 8
- must: "told me that's all right" → **fixed**, `curriculum/packs/core4/curriculum/grade8.ts:136`: the example is now direct speech, `When I said sorry, she smiled and said, "That's all right."`, Hebrew `כשאמרתי סליחה, היא חייכה ואמרה: "זה בסדר."`.
- should: Level, backshift beyond the Band II descriptor → **owner decision** (backshift stays the unit's core rule).
- should: Master decoy "is" marks a correct sentence wrong → **fixed**, `grade8.ts:95`: decoys `['tell', 'told']`. The weaker `:301` decoy (`['said', 'is']`, consider) is left as is.
- should: Lia "hardly ever read books before" → **fixed**, `grade8.ts:54`: "Lia said that in the past she hardly ever read books, but now…".
- should: chef answer without backshift → **fixed**, `grade8.ts:115`: `He said that his wife was a better cook.`
- should: "tester" → **fixed**, `grade8.ts:240`: "The examiner said…".
- should: "total" tagged as a noun → **fixed**, `grade8.ts:241`: POS `adjective`, gloss `כולל / סך הכול`.
- should: exam distractor "opportunity" fits the blank → **fixed**, `examBank/grade8.ts:15`: `['duty', 'level']`.
- should: "Dan said that he was hungry." also in Season 2 → **fixed**, `grade8.ts:46–48`: now "I am thirsty" → "Dan said that he was thirsty." (and both wrong options). The hint and explanation still fit.
- should: social networking gloss → **fixed**, `wordDecks/grade8.ts:121`: gloss `שימוש ברשתות חברתיות`, Hebrew example `השימוש ברשתות חברתיות יכול…`.
- (consider, done at the coordinator's request) roadmap "never in the app" claim → **fixed**, `docs/content-packs-roadmap.md:312`: names admit, apology and opportunity as words taught again earlier.

### Grade 9
- must: "The facility opened lately" → **fixed**, `examBank/grade9.ts:129`: "opened recently".
- should: "Lately, more girls are studying engineering." → **fixed**, `examBank/grade9.ts:98`: "…have started studying engineering." / `…התחילו ללמוד הנדסה.`
- should: direct speech without quotation marks → **owner decision** (house convention shared with core-3).
- should: "take up flying lessons" → **fixed**, `curriculum/packs/core4/curriculum/grade9.ts:54`: "take up flying at seventeen"; Hebrew `אם תתחילי ללמוד טיסה…`.
- should: Yarden answer not supported by the passage → **fixed**, `grade9.ts:321`: "For quite a while, Yarden has babysat for families in her building, and she loves it."
- should: shortSentence "If it rains, we will stay." → **fixed**, `grade9.ts:43`: `If it rains, we will play inside.` / `אם ירד גשם, נשחק בפנים.`
- should: "If I had wings…" repeated from holidays → **fixed**, `lessons/grade9.ts:30`: `If I had a robot, it would clean my room.` / `אם היה לי רובוט, הוא היה מנקה את החדר שלי.`
- should: "female" gloss → **fixed**, `grade9.ts:241`: `נשית / (ממין) נקבה`. This gloss is also on the owner's to-confirm list in `docs/content-packs-open-items.md`.
- should: thirst example → **fixed**, `wordDecks/grade9.ts:121`: `On hot days, don't wait for thirst; drink water often.` / `בימים חמים, אל תחכו לצמא; שתו מים לעיתים קרובות.`

### Grade 10
- must: "not until" alarm sentence → **fixed**, `curriculum/packs/core4/curriculum/grade10.ts:137`: `Leave the building, and do not go back in, not until a firefighter says it is safe.` / `צאו מהבניין, ואל תחזרו פנימה, לא לפני שכבאי אומר שזה בטוח.` This is now safe advice, and the Challenger distractors (naturally, probable) still don't fit.
- should: Level, the Ministry's softening "conditional imperative" → **fixed**, `lessons/grade10.ts:15`: the tip is now `if גם מרכך הוראה או הצעה: Sit here, if you like. כש-If בהתחלה, שמים פסיק אחרי החלק שלו.` The lesson's 110-character limit meant dropping the old "Call 101 if…" note; the third lesson example already shows that order. No drill item was added.
- should: shortSentence "If you slip, sit down." → **fixed**, `grade10.ts:43`: `If you get hurt, stay calm.` / `אם נפגעים, הישארו רגועים.`
- should: "gas tank" explode line → **fixed**, `grade10.ts:31`: `If there is a fire near a gas cylinder, stay far away, because it can explode.` / `אם יש שריפה ליד בלון גז, התרחקו ממנו…`
- should: "Rain is probable tomorrow" → **fixed**, `grade10.ts:136`: `It is probable that it will rain tomorrow, so take a raincoat.` / `סביר שירד גשם מחר…`
- should: police "but nobody was hurt" → **fixed**, `grade10.ts:141`: `The police called me in connection with the accident, so I told them what I saw.` / `המשטרה התקשרה אליי בקשר לתאונה, אז סיפרתי להם מה ראיתי.`
- should: "the practice was useful" → **fixed**, `grade10.ts:159`: "…yet she said that it was good practice." (The Hebrew "התרגול היה מועיל" still fits.)
- should: missing quotation marks (`:267`) → **owner decision**.
- should: "had ever got" → **fixed**, `grade10.ts:324`: "had ever gotten".
- should: take control Hebrew → **fixed**, `wordDecks/grade10.ts:111`: `המנהל החדש קיבל את השליטה בחברה.`
- should: sensitive deck examples → **fixed**, `wordDecks/grade10.ts:109`: release → `The turtles were released back into the sea.` / `הצבים שוחררו בחזרה לים.`; `:110` seize → `She seized the chance to sing on stage.` / `היא ניצלה את ההזדמנות לשיר על הבמה.`, with the gloss now leading with `לנצל (הזדמנות) / לתפוס / להשתלט`.

Totals for the 30 must + should findings: **27 fixed** (3 must, 24 should), **0 skipped**, **3 owner decisions** (g8 backshift, g9 quotes, g10 quotes). Also fixed, though it was consider-level: the roadmap claim.

Tests: `vitest run src/data` gives 3040 passed and 1 failed. The failure is `miniLessons.test.ts` "never shows a mission answer in its lesson" at **g2-u24-m1** ("where do you live tom"), which belongs to the grades 2–4 agent. The run also prints a `Cannot find module '@asamuzakjp/css-color'` error from jsdom, which looks like node_modules being changed underneath (`npx vitest` and `vite-node` binaries are currently missing, so tests were run with `node node_modules/vitest/vitest.mjs`). All grade 8–10 checks pass, including wordGlosses, tierSeedLint, contentPacks and deck tests.

### Grades 11-12

Applied 2026-11-23. Paths are relative to `src/data/`; core-4 files are under `curriculum/packs/core4/`.

### Grade 11
- **must** reported-speech inconsistency: **fixed** in `curriculum/grade11.ts:54–56`. The story now uses present reporting verbs ("asks / predicts / says"). The Hebrew is updated to match and adds "כבר".
- **must** 1900 predictions: **fixed** in `curriculum/grade11.ts:216`. It now says "some writers imagined… people would fly to work in small flying machines… most people still travel to work on the ground… got the future of work wrong because they did not imagine the internet: today, many people work from home." The question and answers are unchanged and still match.
- **should** Noam story dates and "physiotherapist": **fixed** in `curriculum/grade11.ts:322`. It now reads "When Noam was in high school… When the class met again…", and the job is "physical therapist".
- **should** Boss Master builder had two valid orders: **fixed** in `curriculum/grade11.ts:304–305`. The sentence is now "By the age of thirty, you will have found a job you love." with the Hebrew "עד גיל שלושים, כבר תמצאו עבודה שאתם אוהבים.". The capitalized "By" plus the comma chip fix the order; the decoys `finds`/`would` are kept.
- **should** "occasional sweet" (British usage): **fixed** in `curriculum/grade11.ts:247`. It now reads "I promised myself that I would have only an occasional piece of candy." The Hebrew is unchanged, because it still matches.
- **should** misunderstand example: **fixed** in `curriculum/grade11.ts:136`. It now reads "I didn't want them to misunderstand the plan: we were going to meet at six, not seven." with the Hebrew "לא רציתי שהם יבינו לא נכון…". I kept the base form so the Challenger exact-word fill-in still works; the "misunderstood" wording I first suggested would have broken it.
- **should** get it wrong example: **fixed** in `curriculum/grade11.ts:137`. It now reads "I was sure that I would get it wrong, but I got every answer right." with the Hebrew "הייתי בטוח/ה שאטעה, אבל עניתי נכון על הכול.".
- **should** immigration gloss order: **fixed** in `curriculum/grade11.ts:242`, now "עלייה / הגירה".
- **should** mood Hebrew: **fixed** in `curriculum/grade11.ts:243`, now "אם אתם במצב רוח רע…".
- **should** future-perfect Hebrew needs "כבר": **fixed** in `curriculum/grade11.ts:29, 30, 31, 33, 238, 240, 246` and `examBank/grade11.ts:93, 96`. The Boss key sentence now reads "בעוד עשר שנים, כבר אספיק לטייל בחמש מדינות לפחות.".
- **should** deck "a herb": **fixed** in `wordDecks/grade11.ts:106`, now "Mint is an herb that grows easily."
- **should** deck spread out gloss order: **fixed** in `wordDecks/grade11.ts:111`, now "להתפזר / להתפרס".

### Grade 12
- **must** Master decoys built a valid first conditional: **fixed** in `curriculum/grade12.ts:96`. The decoys are now `['hurts', 'telling']`.
- **must** supermarket story contradicted itself: **fixed** in `curriculum/grade12.ts:213–220`. The story is now in the modal passive ("food that big supermarkets cannot sell must be given away to charities, and a penalty must be paid if it is thrown out"), and the objection is now that it is hard for charities to collect and store so much food. The question is now "Why do some people think the law is hard to follow?" and the answer "Charities may not be able to collect and store all the food.". One distractor is now "Small shops sell more food.", and the hint is "Who has to collect the food?".
- **must** handball / penalty: **fixed** in `examBank/grade12.ts:24–25`. The item now reads "The driver had to pay a ____ for parking in the wrong place." / "הנהג נאלץ לשלם קנס על חנייה במקום אסור.", with no soccer context.
- **should** wallet experiment: **fixed** in `curriculum/grade12.ts:318, 320`. The text now says "Most people expected that wallets with money would be kept.", and the question is "What surprised people about the results?".
- **should** Ido story read like news: **fixed** in `curriculum/grade12.ts:108–113`. It now reads "Tamar was sixteen when she found a bag full of money on a park bench…". There is no date, city or exact sum, the owner is an old man, and the question and answers are updated to "he/his".
- **should** gender balance: **fixed**. Yonatan became Yael (`curriculum/grade12.ts:55–59`, with the Hebrew "יעל חשבה… היא סיפרה" and the question "What did Yael think?"), and Ido became Tamar. Each name is consistent within its story.
- **should** missing quotation marks: **owner decision**. Not changed; this is the house convention shared with core-3.
- **should** "some kind of" example: **fixed** in `curriculum/grade12.ts:37`. It now reads "If you returned a lost wallet, would you expect some kind of reward?" with the Hebrew "אם הייתם מחזירים ארנק אבוד, הייתם מצפים לסוג של פרס?".
- **should** rude Hebrew: **fixed**. The gloss is now "גס רוח / לא מנומס", with "לא מנומס ל…" in `curriculum/grade12.ts:32`, `:98` and `examBank/grade12.ts:13`.
- **should** membership Hebrew: **fixed** in `curriculum/grade12.ts:133`. The gloss is now "חברות (במועדון) / מנוי", and the example "האם מנוי לחדר כושר צריך להיות בחינם לבני נוער?".
- **should** "that kind of thing" list: **fixed** in `curriculum/grade12.ts:136`. It now reads "Phones, games and that kind of thing should not be used in class.", with the Hebrew aligned.
- **should** "annoy the baby": **fixed** in `examBank/grade12.ts:18–19`. It now reads "It will ____ the neighbors." / "זה ירגיז את השכנים.".
- **should** Boss Master builder: **fixed** in `curriculum/grade12.ts:300–302`. The sentence is now "Every speaker must be given the same amount of time." with the Hebrew "חובה לתת לכל דובר ודוברת אותו זמן בדיוק." and the decoys `['gave', 'are']`. It is a modal passive with one valid order and doesn't reuse the Challenger rule.

### Totals
- Must fix: 5 fixed.
- Should fix: 19 fixed, 0 skipped, 1 owner decision (quotation marks).
- Consider items: none applied.

### Tests
`vitest run src/data` (run with `node node_modules/vitest/vitest.mjs`, because the `vitest` bin shim is missing): 3040 passed, 1 failed, 1 worker error, and none of these come from grades 11–12. `wordGlosses.test.ts`, `tierSeedLint.test.ts` and `contentPacks.test.ts` pass.
- The failure is `miniLessons.test.ts`, which flags `g2-u24-m1` ("where do you live tom" vs "where do you live"). That is grade 2, owned by the grade 2–4 agent.
- The worker error is `homeTips.storage.test.tsx`, which could not start because jsdom can't find `@asamuzakjp/css-color`. This is a node_modules or environment problem.

### New English text needing TTS clips
- g11: the m1 story (`:54`), the m2 Master story (`:216`), the Boss Master story (`:322`), the Boss Master sentence, and the examples at `:136`, `:137` and `:247`.
- g11 deck: "Mint is an herb that grows easily."
- g12: the m1 story and its question (Yael), the m1 Master story with its question and answers (Tamar), the example at `:37`, the example at `:136`, the m2 Master story with its question, answers and hint, the Boss Master sentence, and the wallet story with its question.
- g12 exam: the annoy and penalty items (`:18`, `:24`).


## Consider fix log (2026-11-23)

The owner asked for all 78 "consider" items. 73 were applied. 4 were notes with no change: grade 4 present-continuous questions a year early, grade 6 "railway"/"the ground floor" (Ministry words), grade 12 suitability, and the pack name. 2 were skipped: the grade 6 helicopter 🚁 has no drawn map icon yet, and grade 4 "take off" keeps the decks' `'phrase'` tag. The grade 8 roadmap claim had already been fixed. "expand" in Season 2 was correct there.

### Grades 2-4

Paths relative to `src/data/curriculum/packs/core4/` unless noted.

### Grade 2
- Master stories too long · applied · `curriculum/grade2.ts:104` Lior: "…He asks Mom, What is Grandpa's address? Mom says, 9 Palm Street." (question and answer unchanged); `:200` pizza: "Ben and Dana have a pizza. Ben eats half of it. Dana eats the other half. Then Dad comes home. There is no pizza for Dad!"; `:297` boxes: "Dana has a new home. There are a lot of boxes. Her mom and dad can't move the big box. Three kids come and help."
- Pizza logic · applied (same edit: "Dana eats the other half").
- clozeWrong `one` · applied · `curriculum/grade2.ts:181` → `['under', 'much']`.
- `a few` gloss · applied · `curriculum/grade2.ts:130` → "מעט / כמה (לא הרבה)".
- "Go away, Mom!" · applied · `curriculum/grade2.ts:259` → "Good night, Mom!".
- `plus` part of speech · applied · `curriculum/grade2.ts:128` `word` → `preposition`.
- Boss rule off the unit grammar · applied · `curriculum/grade2.ts:238-242` → "Welcome to my home! Three kids live here. Which sentence is right?" "There are three kids in my family." vs "There is three kids…" / "There are three kid…" (Hebrew explain + hint gender-neutral plural). "I feel well" is still tested in the exam bank.
- "How much of her piece" · applied · `examBank/grade2.ts:146-149` → "What does Lea eat?" / "מה לאה אוכלת?" → "Half of her piece." vs "All of the cake." / "A lot of cake.".

### Grade 3
- `them` gloss · applied · `curriculum/grade3.ts:40` → "אותם / אותן / איתם" (kept "איתם" because the example is "play with them").
- "שמשי" · applied · `lessons/grade3.ts:30` → "יש שמש, אבל קר.".
- `rest` as a verb · applied · `curriculum/grade3.ts:294` → "The race is hard, but we can have a rest at the end." (Hebrew unchanged; decoys `are` / `rests` still wrong).
- "fairy tale", "scared" · applied · `examBank/grade3.ts:85` "How does a story start?"; `:129/131/136` "He is a bit sad." / "הוא קצת עצוב." / answer "A bit sad.".
- "looked for her all the time" · applied · `examBank/grade3.ts:103/105` "all day" / "כל היום".

### Grade 4
- Present continuous questions are Ministry grade 5 · note, no change.
- clozeWrong `close` for "flying ____ in the wind" · applied · `curriculum/grade4.ts:188` → `['storm', 'evening']`.
- "the sun is coming up" Hebrew · applied · `curriculum/grade4.ts:36` "מוקדם, והשמש עולה."; `:73` "…השמש עולה.".
- "reading in the afternoon" · applied · `examBank/grade4.ts:96` "My sister is reading this afternoon." / "אחותי קוראת היום אחר הצהריים.".
- "crowded" · applied · `examBank/grade4.ts:129/131` "Are there a lot of people at the beach? No, there aren't, because it is early." / "יש הרבה אנשים בחוף? לא, כי מוקדם."; question `:140-141` "Why are there not a lot of people at the beach?" / "למה אין הרבה אנשים בחוף?".
- "It is rain." option · applied · `curriculum/grade4.ts:48` → "It are raining.".
- `pretty` gloss · applied · `src/data/wordDecks/grade4.ts:106` → "יפה, חמוד".
- `take off` part of speech · skipped: the decks mark phrasal verbs as `'phrase'` (e.g. `spread out`), so `'phrase'` is the house convention.

Tally: 21 consider items → 19 applied, 1 note (no change), 1 skipped.

Tests: `npx vitest run src/data` → only failures outside grades 2-4, rerun alone with the same result: `homeBase.test.ts` (5 quest-ring tests, another session's work), `miniLessons.test.ts` (g11/g12 lesson tips over 110 chars, the grades 11-12 agent's files) and `wordGlosses.test.ts` (`proud` unglossed, in core-4 grades 10/12). Grade 2-4 lesson ideas measure 87-161 chars (limit 170); all other src/data tests pass.

New English text that needs a clip: the three shortened grade 2 Master stories, the new grade 2 Boss rule ("Welcome to my home! Three kids live here. Which sentence is right?", "There are three kids in my family.", the two wrong forms), "Good night, Mom!", "What does Lea eat?", "Half of her piece.", "All of the cake."; grade 3 "The race is hard, but we can have a rest at the end.", "How does a story start?" (may already exist), the edited duck and Ron passages, "A bit sad."; grade 4 "It are raining.", "My sister is reading this afternoon.", the edited beach passage and its question.

### Grades 5-7

22 consider findings: **20 applied, 1 note-only, 1 skipped.** Paths are relative to `src/data/curriculum/packs/core4/`.

### Grade 5 (7 applied)
| Finding | Status | What changed |
|---|---|---|
| "הולך ללכת לים" | applied | `curriculum/grade5.ts:57` → "בשבת הוא הולך לים עם החברים שלו." |
| "לאן הבנות הולכות ללכת?" | applied | `curriculum/grade5.ts:163` → "לאן הבנות הולכות?" |
| Master decoy "Are" (BrE-valid) | applied | `curriculum/grade5.ts:200` decoys → `['Does', 'goes']` |
| "They are going not to play" | applied | `examBank/grade5.ts:80` wrong → "They aren't going play today." |
| neighbor / dog "He" | applied | `examBank/grade5.ts:18–19` → "Our ____ lives next door. He has a big dog." / "השכן שלנו גר בבית ליד. יש לו כלב גדול." |
| "איזו מידה אתם?" | applied | `curriculum/grade5.ts:242` → "מה המידה שלכם? …" |
| Ron / Maya duplicate | applied | `examBank/grade5.ts:64–68`: exam Q3 now asks friends: "Are you going to dance in the show?", with wrong options "Are you going to dancing…" / "Do you going to dance…". Hebrew explanation and hint updated (plural). The Challenger rule (Is Ron…) is unchanged. |

### Grade 6 (6 applied, 1 note-only, 1 skipped)
| Finding | Status | What changed |
|---|---|---|
| "You did notice…?" | applied | `examBank/grade6.ts:80` → "Did you noticing the strange man?" |
| Ella question/answer | applied | `curriculum/grade6.ts:327` correct → "It was her best trip." (the question is unchanged) |
| railway / the ground floor (UK) | note-only | The Ministry's Band I entries; the words are kept (the list wins, as with "queue"). |
| "Because…" story without because | applied | `curriculum/grade6.ts:154,156` → "He was afraid because the noise was very close, so he woke up his friend." / "הוא פחד כי הרעש היה קרוב מאוד, אז…" |
| bare "במקום" | applied | `curriculum/grade6.ts:134` and `:173` → "במקום זה." |
| `afraid` gloss | applied | `curriculum/grade6.ts:129` → "מפחד/ת" |
| Boss rule repeats the m1 error-fix | applied | `curriculum/grade6.ts:259–262` Boss Challenger rule → "We missed the bus because we got up late." with wrong options "…because of we got up late." / "…because we get up late." The Hebrew explanation and hint are about because. |
| helicopter emoji ✈️ → 🚁 | skipped | `contentPacks.test` ("core-4 grade 6 has a drawn icon for every map picture") fails because 🚁 has no drawn icon yet. Reverted to ✈️. It can change once a helicopter picture is drawn. |

### Grade 7 (7 applied)
| Finding | Status | What changed |
|---|---|---|
| Stereotyped roles | applied | `curriculum/grade7.ts:133` secretary Hebrew → "המזכיר שעובד… מכיר כל תלמיד." `:134` director → "הבמאית שעשתה… היא מישראל." `:215–222` Ori's grandmother is now the engineer, with "she" in the passage, question, answers and hint. |
| Gil's plot repeats the robot story | applied | `examBank/grade7.ts:122,124`: Gil now "moved the camera away from the tree, and now it only takes photos of birds." / "גיל הזיז את המצלמה רחוק מהעץ, ועכשיו היא מצלמת רק ציפורים." Q3 correct → "He moved the camera.", wrong → "He bought a new camera." / "He changed the software." |
| Lesson doesn't mention leaving out the pronoun | applied | `lessons/grade7.ts:15` tip → "אחרי that או which לא חוזרים על הדבר (לא that you bought it). אפשר גם בלי that: the book you bought." (≤110 chars) |
| `limit` also fits "has a ____" | applied | `examBank/grade7.ts:15` wrong → `['secretary', 'emoji']` |
| Ben's "His newest robot" | applied | `curriculum/grade7.ts:176–177` → "His friend's newest robot can dance!" / "הרובוט החדש ביותר של החבר יודע לרקוד!" |
| Lesson calque "ששומרת על האוכל קר" | applied | `lessons/grade7.ts:11` → "מקרר הוא מכונה שמקררת את האוכל." |
| Near-duplicate exam sentences | applied | `examBank/grade7.ts:93` → "This is the game that helps me learn words." / "זה המשחק שעוזר לי ללמוד מילים." `:95` → "We need machines which save energy." / "אנחנו צריכים מכונות שחוסכות אנרגיה." |

### Tests
- **First full run:** `npx vitest run src/data` flaked. Every file failed to load, because another session was working in the folder at the same time.
- **Rerun:** 3056 passed, 3 failed.
  - One failure was this pass's 🚁 emoji, now reverted.
  - The other two belong to other grades:
    - `miniLessons.test` "keeps every lesson short": **g11-u24-m2** idea text is 113 characters.
    - `wordGlosses.test`: **'proud'** is missing a gloss; it comes from core-4 grade 10 / 12 content.
- **Those three files run alone after the revert:** only those two other-grade failures remain. Nothing fails in grades 5–7.

### Grades 8-10

Applied 2026-11-23. Every spot was checked before editing; none had been touched by an earlier attempt.

### Grade 8
- `:301` Boss Master decoy `is` → **applied**, `curriculum/packs/core4/curriculum/grade8.ts:301`: decoys `['said', 'says']`. The old `is` gave a valid present-tense sentence.
- "as you know" inside reported speech → **applied**, `grade8.ts:34`: `The coach said, "The final, as you know, is on Sunday."` / `המאמן אמר: "הגמר, כפי שאתם יודעים, ביום ראשון."` The headword stays lowercase, so the Challenger blank still works.
- duty example → **applied**, `grade8.ts:239`: `The teacher told us that it was our duty to help new students.` / `המורה אמרה לנו שזו החובה שלנו לעזור לתלמידים חדשים.`
- Roy "he got the job" → **applied**, `grade8.ts:212`: "…told him that he had gotten the job."
- roadmap "words are new" → **done** in the must/should pass (`docs/content-packs-roadmap.md:312`).
- lock gloss → **applied**, `wordDecks/grade8.ts:106`: `מנעול`.
- "close the computer" → **applied**, `wordDecks/grade8.ts:110`: `Save the file before you shut down the computer.` / `…לפני שאתם מכבים את המחשב.`

### Grade 9
- teacher line → **applied**, `curriculum/packs/core4/curriculum/grade9.ts:137`: `I suppose I would be a teacher if I were more patient.` / `…אם הייתי סבלני/ת יותר.`
- "more women have joined" → **applied**, `grade9.ts:264`: "…have joined the fire service." / `…לשירותי הכבאות.`
- "What if" Hebrew → **applied**, `grade9.ts:136`: `ומה אם לא אקבל את העבודה?`

### Grade 10
- sprain "cold water" → **applied**, `curriculum/packs/core4/curriculum/grade10.ts:54`: `She held a cold pack wrapped in a towel on his ankle…` / `…שקית קירור עטופה במגבת…`. This is safe: cold, never ice straight on the skin.
- seasickness → **applied**, `grade10.ts:72–73`: "look at the horizon" / `להסתכל על קו האופק`.
- kit "hidden" → **applied**, `grade10.ts:267, 269, 272`: "kept underneath the teacher's desk"; the answer is now `Underneath the teacher's desk.` and the Hebrew is `ששמורה מתחת לשולחן של המורה`.
- voice line "Call an ambulance, or take him to the hospital." → **applied**, `grade10.ts:201–202`: `He can't stand up, so stay with him and call an ambulance.` / `הוא לא יכול לעמוד, אז הישארו איתו והתקשרו לאמבולנס.` It still uses a conjunction (so), as the mission requires.
- command / force verb glosses → **applied**, `wordDecks/grade10.ts:99, 101`: `פקודה`, `כוח`.
- Egyptians → **applied**, `wordDecks/grade10.ts:117`: `The ancient Egyptians built a great civilization.` / `המצרים הקדמונים בנו…`

Totals: **18 applied** (one of them the roadmap item, already done), 0 note-only, 0 skipped.

Tests: `vitest run src/data` gives 3056 passed and 3 failed; rerun alone, 2 still fail, and none is in grades 8–10:
- `miniLessons` g11-u24-m2 tip is 113 characters against a 110 limit (grade 11).
- `wordGlosses` "proud" is missing (grade 12 `sentenceEn`, `grade12.ts:233`).
- `contentPacks` core-4 grade 6 🚁 has no drawn icon. This one passed when rerun alone, so it was flaky or already fixed by another session.

### Grades 11-12

Applied 2026-11-23 on the owner's "apply all". I checked each spot before editing; none had been applied by an earlier attempt. Paths are relative to `src/data/curriculum/packs/core4/` unless they say otherwise.

### Grade 11
- regards gloss order and calque: **applied** in `curriculum/grade11.ts:244`. The gloss is now "בברכה / דרישת שלום", and the example Hebrew "בברכה, מכם מלפני כמה שנים!".
- input Hebrew: **applied** in `curriculum/grade11.ts:36`. The gloss is now "משוב / הערות; קלט", and the example Hebrew "תודה על ההערות שלכם…".
- occasional Challenger distractor "mood" (ruled out by "an"): **applied** in `curriculum/grade11.ts:300`. The pair is now `['immigration', 'incredible']`; both take "an", and neither fits the meaning.
- personality Challenger distractor "psychology": **applied** in `curriculum/grade11.ts:87`. The pair is now `['unemployed', 'union']`.
- lesson on when *would* is used: **applied** in `lessons/grade11.ts:34`. The tip is now "would בא אחרי פועל בעבר (said, thought, promised). was going to מרמז לרוב שהתוכנית לא קרתה." It fits the 110-character limit that `miniLessons.test.ts` enforces.
- Ministry heading for *would*: **applied** in `docs/content-packs-roadmap.md`. The grade 11 core-4 row now notes that the 5-point heading lists only *was going to*, and that the *would* half is the "MODALITY: Would" / reported-speech use.
- fresh water overstated: **applied** in `examBank/grade11.ts:103–105`. The text is now "many regions will have run short of fresh water", with the Hebrew "באזורים רבים כבר יהיה מחסור במים מתוקים". The answer at `:122` is now "Running short of fresh water.".
- Avi answer: **applied** in `examBank/grade11.ts:148`. It is now "He teaches students who may one day reach space.".
- lesson and exam near-duplicate: **applied** in `examBank/grade11.ts:95`. The sentence is now "He said that he would bring the snacks." / "הוא אמר שהוא יביא את החטיפים.".

### Grade 12
- Boss key sentence off-target: **applied** in `curriculum/grade12.ts:233–234`. It is now "If our team lost the debate, we would still be proud." / "אם הקבוצה שלנו הייתה מפסידה בוויכוח, עדיין היינו גאים.". I added `proud: 'גאה'` to `src/data/wordGlossesExtra.ts`.
- lesson doesn't show the modal-passive question form: **applied** in `lessons/grade12.ts:34`. The tip is now "בשלילה not בא אחרי מילת העזר (should not be allowed), ובשאלה מילת העזר ראשונה: Should it be banned?".
- lesson example near-duplicates the rule item: **applied** in `lessons/grade12.ts:11`. It is now "If I saw a friend in trouble, I would help him." / "…הייתי עוזר/ת לו.", with the highlight "would help".
- Master voice repeated the "Only a fool would…" frame: **applied** in `curriculum/grade12.ts:303–304`. It is now "If I were the judge, I would listen to both teams." / "אם הייתי השופט/ת, הייתי מקשיב/ה לשתי הקבוצות.".
- generic *he*: **applied**. `curriculum/grade12.ts:237` is now "everything they read online", with the Hebrew "לכל מה שכתוב ברשת". `examBank/grade12.ts:103` is now "says it is their own".
- "the staff were kind": **applied** in `curriculum/grade12.ts:239`. It is now "the people who worked there were kind" / "האנשים שעבדו שם היו נחמדים".
- defeat gloss order: **applied** in `curriculum/grade12.ts:236`, now "הפסד / תבוסה".
- suitability: **note, no change**; the owner decides. Its Hebrew wording is **applied** in `curriculum/grade12.ts:131`, now "אסור בשום מקרה להשאיר נשק…".

### Decks
- phrasal verbs tagged as `'phrase'`: **applied** in `wordDecks/grade11.ts:111` (spread out) and `wordDecks/grade12.ts:116` (come up with), now `'phrasal v'`.
- "expand" in Season 2: **note, no change**. Its wrong-word gloss "להרחיב" (`curriculum/packs/season2/curriculum/grade12.ts:611`) has no example sentence and correctly glosses transitive *expand*. The deck's "להתרחב" fits its intransitive example.
- pond gloss: **applied** in `wordDecks/grade11.ts:103`, now "אגם קטן / בריכה טבעית".

### Pack settings
- pack name "עונה 4": **note, no change**. The owner names it.

### Totals
- 17 applied, 3 note-only (suitability, expand, pack name), 0 skipped.

### Tests
- `npx vitest run src/data`: 72 files and 3059 tests passed.
- The first full run had 3 failures:
  - `miniLessons.test.ts`: my two new tips were over the 110-character limit. I shortened them.
  - `wordGlosses.test.ts`: "proud" had no gloss. I added it.
  - `homeBase.test.ts`: this came from another session's work in progress. It passed on the rerun.

### New English text needing TTS clips
- g11: the fresh-water exam passage (`examBank/grade11.ts:103`) and its answer; "He teaches students who may one day reach space."; "He said that he would bring the snacks."
- g12: "If our team lost the debate, we would still be proud."; "If I were the judge, I would listen to both teams."; "Only a fool would believe everything they read online."; "The food in the hotel was dreadful, but the people who worked there were kind."; the AI exam passage (`examBank/grade12.ts:103`); the lesson example "If I saw a friend in trouble, I would help him."


## Owner decisions applied (2026-11-23)

1A: grade 3 stories stay in the past, and questions test only the present or short answers. 2A: grade 8 teaches say / tell + that with a pronoun change and no required tense shift (Ministry Band II), and no item has a tense-only choice. 3A: straight double quotes around direct speech in the English of core-3 and core-4. Engine: the story-hint sentence counter keeps a closing quote with its sentence (`splitSentences`, `src/utils/hints.ts`).

### Grades 2-4

### 1A: grade 3 stories stay in the past, the past is not tested
Stories keep "Once upon a time, there was…" and the past narrative; every question and answer option is now present tense or a short phrase (`src/data/curriculum/packs/core4/`):
- `curriculum/grade3.ts` m1 Challenger story: "Who lived in the tree?" → "Where is the bird's home?" / "איפה הבית של הציפור?" → "in a big tree" (wrong "in a big house", "in the sea").
- m1 Explorer story: "What did the king have?" → "What is big in the story?" / "מה גדול בסיפור?" → "the castle" (wrong "the cat").
- m1 Master story: "Why did the fox go away?" → "What makes the fox go away?" → "The rabbit and her friends." (wrong "A big dog.", "The rain.", "Some carrots."); hint "Who is at the door?".
- Boss Challenger story: "What place was Dana in the race?" → "What is Dana's place in the race?" / "באיזה מקום דנה במרוץ?".
- Boss Master errorFix (it tested was/ran): now "Maya is tired, but she runs to the end." vs "…she run…", "Maya are…", "…but runs she…" (Hebrew explanation and hint updated).
- Boss Master story: "Why did everyone clap for Noa?" → "Why does everyone clap for Noa?" → "She gets up and goes on." (wrong "She is first in the race.", "She takes a picture.", "She does not run."); hint "What does Noa do after she falls?".
- `examBank/grade3.ts` duck passage: "Where did the little duck live?" → "Where is the little duck's home?"; "What did the ducks do after they swam?" → "After the lake, what do the ducks eat?" → "Bread." (wrong "Grass.", "Cake."); "Where did the brothers find the little duck?" → "Where is the little duck at the end?".
- Kept on purpose: the taught "there was" pattern (lesson example, exam cloze, exam grammar item, exam sentence, Master sentence "there was a king and a queen").

### 3A: straight double quotes around direct speech (grades 2-4, core-3 and core-4)
US style, punctuation inside the quotes, question marks outside when the whole sentence is the question ('Who says, "Yes, I do"?', 'Why does Tom's sister say "It's not fair"?'). English only; Hebrew, Master sentence-builder sentences, decoys and voice lines untouched. Quoted passages/strings changed:
- core-3: `curriculum/grade2.ts` 9, `curriculum/grade3.ts` 8, `examBank/grade2.ts` 4 (incl. the cloze 'I say, "____!"'), `examBank/grade3.ts` 3; `curriculum/grade4.ts` and `examBank/grade4.ts` were already quoted; lessons have no direct speech. Total 24.
- core-4: `curriculum/grade2.ts` 3, `curriculum/grade3.ts` 7, `curriculum/grade4.ts` 4, `examBank/grade2.ts` 2, `examBank/grade3.ts` 1; lessons have no direct speech. Total 17.
- Decks (`src/data/wordDecks/grade4.ts`, core-3 and core-4 entries): no direct speech, no change.

Tests: `npx vitest run src/data src/utils` → 91 files, 3284 tests passed (one earlier run had 2 failures in miniLessons/missionHints that passed alone and on the full rerun: the other session editing this folder).

Clips: every edited passage and question above is new English text for `tts:check` / `tts:render` (the quotes change the text keys).

### Grades 5-7

**Decision 3A (quotation marks around direct speech), grades 5–7 only.** Straight ASCII double quotes were added in US style, punctuation inside the quotes. Hebrew, Master sentence-builder sentences, decoys and voice targets were not touched. No answer depends on the changed text.

- **core-4 (7 strings):**
  - `curriculum/grade5.ts:159`: the Gali / Tamar dialogue (3 quotes).
  - `curriculum/grade5.ts:170`: Explorer rule question, Your friend asks, "Are you going to come?"
  - `curriculum/grade5.ts:177`: Explorer story, says, "Good evening!"
  - `curriculum/grade5.ts:216`: Master story, Dad asks, "Are you sure the movie is at six?"
  - `curriculum/grade6.ts:107`: He said, "Your suitcase is on another plane!"
  - `curriculum/grade6.ts:266`: Tal said, "It was excellent!"
  - `curriculum/grade6.ts:323`: she wrote, "Imagine reading a newspaper while you lie on the water!"
- **core-3 (1 string):** `curriculum/grade5.ts:164`: Explorer rule question, Someone asks, "Will you come to my party?"
- **Already quoted in core-3:** the other speech in core-3 grades 5–7 (g5:71, g5:153, g6:53, g6:210, g6:315, g7:55, examBank g5:103, g6:103, g7:103).
- **Lessons, exam banks and decks:** core-3/core-4 grades 5–7 lessons and exam banks, and the core-3/core-4 deck examples in `wordDecks/grade5–7.ts`, have no unquoted direct speech.
- **Left unquoted on purpose, as narration or text rather than reported speech:**
  - "Oh no! It is at five!" (Ori's thought, core-4 g5:216).
  - Questions put straight to the learner ("Are you going to swim? You are not. What do you say?").
  - The error message "Sorry, there is an error on this page."

Tests: `npx vitest run src/data src/utils` → 91 files, 3284 tests, all passed.

### Grades 8-10

### Decision 2A: grade 8 reported speech follows the Band II descriptor (pronoun shift; no tense shift required)

`lessons/grade8.ts` (g8-u24-m1):
- `ideaHe` is rewritten (text below).
- `pattern` is now `"I love …" → He said (that) he loves …`.
- New examples: `Ron said that he loves soccer.`, `Maya told me that her brother is a chef.` and `The girls said that they liked the show.` The "was late" and "would call" examples are gone.
- The quickTry is now `Yael said, "My cat is sick."` → `Yael said that her cat is sick.` (wrong option: `…my cat…`), so it tests my → her.
- The m2 lesson (told / told to / asked whether) is unchanged: it has no tense rule.

`curriculum/packs/core4/curriculum/grade8.ts`:
- The header comment, the m1 `storyHookHe` (now `"My team is ready" → He said that his team is ready.`) and `grammarTopic` (`Reported speech: said (that) + pronoun change`) are updated.
- Two models now report present facts that are still true without a shift: "the situation is getting better" and "the singer said that she loves Israel".
- m1 Challenger rule: the explanation and hint no longer mention am → was. Its options test only the pronoun and "said me".
- m1 Explorer rule is now `Noa said that she likes pizza.` (wrong option: `…I like pizza.`).
- m1 Master sentence is now `…the situation in the ocean is serious.` (decoys `tell`, `told`).
- The Boss rule is rebuilt as `Maya said, "My team is winning."` → `Maya said that her team was winning.` Wrong options: `…my team…` and `Maya told that…`. This tests my → her and said vs told. The old option "they was" vs "were" is gone.

`examBank/grade8.ts`:
- Q1 explanation: the am → was part is dropped.
- Q2: the correct answer is now `The girls said that they love the new park.` The wrong options are `…we love…` and `…said me that…`, replacing "loved" vs "loves".
- Q5 is replaced. The old one marked will → would (a tense item). The new one is `Mom said to me, "My phone is broken."` → `Mom told me that her phone is broken.` Wrong options: `…my phone…` and `Mom said me…`.

Result: no grade 8 item now has a tense-only choice. The only item with "was"/"were" in both its right and wrong options is the m1 Master error-fix's "they was"/"they were", which is subject–verb agreement, not tense.

`docs/content-packs-roadmap.md:312` describes the unit as "pronoun change (Band II descriptor…)".

### Decision 3A: straight double quotes around direct speech (grades 8–10, core-3 and core-4, English only)

core-4: 8 quoted spots in 7 passages.
- `curriculum/grade9.ts`:
  - `:54` (the uncle's advice)
  - `:159` (the question "What job would you choose…?")
  - `:216` (the dad's advice and Dana's thought)
  - `:264` (the firefighter)
  - `:321` (the aunt's advice, both sentences)
- `curriculum/grade10.ts`:
  - `:111` (the teacher's candle advice, now capitalized: "If the power goes off, don't put candles near curtains.")
  - `:267` (the instructor)

core-3: 1 spot.
- `examBank/grade9.ts:103`: `"In general," Yosef says, "the team is like a second family where everyone is accepted."`

Checked and left unquoted:
- Reported speech ("said that…").
- Paraphrase ("She says no!").
- The deck examples for grades 8–10: none has direct speech without quotes.
- Master sentence-builder sentences and voice lines: none was touched.

Tests: `vitest run src/data src/utils` gives 91 files and 3284 tests, all passing.

### Grades 11-12

**Decision 3A (2026-11-23):** direct speech gets straight ASCII double quotes in grades 11–12 of core-3 and core-4, in English only.

I searched the curriculum, lessons, exam banks and core-3/core-4 deck examples of both packs for sentences with a speech verb (said, says, say, asked, tells, replied, shouted, laughed and so on) and for speech that already had quotes.

**core-4: 4 passages quoted**
- `curriculum/packs/core4/curriculum/grade12.ts:35`, the "Who cares?" example: `Some people say, "Who cares? It's only a small lie."` The Challenger blank still finds "Who cares?" (word-boundary match after the quote).
- `curriculum/packs/core4/curriculum/grade12.ts:55`, the Yael story: `Some said, "Who cares? It's not our fault." But Yael…`
- `curriculum/packs/core4/curriculum/grade12.ts:73`, the Explorer story: `His sister said, "That's so selfish!"`
- `curriculum/packs/core4/examBank/grade12.ts:129`, the Eran novel: `At the end of the book he says, "If I had taken the money, I would never have been able to look at myself in the mirror."`

**Already quoted, no change:**
- the Lior story (`grade11.ts:111`)
- the Noam story (`grade11.ts:322`)
- the Avi exam passage (`examBank/grade11.ts:129`)

**Not direct speech, no change:**
- `grade11.ts:159`, "In actual fact, she said later, it was the best summer of her life.": the "her life" makes it indirect, so quoting it would change the text.
- The deck dialogue exchanges ("You want to leave early? Fair enough.", "Can I ask a question? By all means.") are two-line exchanges with no speech verb, so they stay unquoted.
- The Master sentence-builder and voice sentences contain no direct speech.

**core-3: 0 passages changed.** Grades 11–12 already quote everything that needs it: the essay questions and quoted sentences in `core3/curriculum/grade12.ts:114, 220, 269`, the "Complete: "…"" items, and the core-3 deck `wordDecks/grade11.ts:71` (`"Good night, darling," said Mom.`). Every other speech verb there introduces reported speech ("said that…").

**Hebrew:** not touched.

**Tests:** `npx vitest run src/data src/utils`: 91 files and 3284 tests passed.

**TTS:** the four quoted passages change only punctuation. The clip key may still change, so `tts:check` will show whether they need re-rendering.

