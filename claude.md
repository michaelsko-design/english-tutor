# English Tutor App — Architecture & System Documentation

## 1. Overview & Vision
The **English Tutor App** is an interactive, gamified English-learning web application specifically tailored for Israeli students across Grades 1–12 (יסודי, חטיבת ביניים, וחטיבה עליונה). The app aligns with the Israeli Ministry of Education English Curriculum Bands (Pre-Foundation, Foundation, Band I, Band II, and Band III).

It provides an engaging, Duolingo-meets-aesthetic-studio learning experience featuring:
- **Hebrew Instructions with Dynamic Gender Inflection**: Automatically adjusts Hebrew grammatical forms (verbs, imperatives, congratulations) based on whether the learner is a girl (`girl`) or a boy (`boy`).
- **Interactive Multi-Grade Curriculum**: Structured progression through elementary, middle school, and high school units.
- **Bi-Directional Voice Engine**: Text-to-Speech (TTS) for native English pronunciation and Speech Recognition with fuzzy phonetic similarity scoring for speaking practice.
- **Gamified Engagement Loop**: XP, player levels, 1–3 star mission mastery, diamond gems, Shabbat-protected daily streaks, daily quests, and an unlockable reward shop.
- **Pluggable Aesthetic Themes**: Distinct visual and thematic experiences (e.g., *PeachNote Cozy Pastel Studio*, *VibeLingua Neon Pop*, *Starlight RPG*).
- **Kid-Friendly Cloud Sync**: Firebase-backed persistent cross-device synchronization with offline-first local cache.

---

## 2. Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool & Bundler** | [Vite 6](https://vitejs.dev/) |
| **Styling & Design System** | [Tailwind CSS 3](https://tailwindcss.com/) with custom CSS variables, gradients, and backdrop blurs |
| **Icons & Visual Effects** | [Lucide React](https://lucide.dev/), [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Speech & Audio** | Native Web Speech API (`SpeechSynthesis` and `SpeechRecognition` / `webkitSpeechRecognition`) |
| **Backend & Auth** | [Firebase](https://firebase.google.com/) (Authentication & Cloud Firestore) |
| **Testing** | [Vitest](https://vitest.dev/) unit tests (`npm test`) |
| **Deployment & Hosting** | [Vercel](https://vercel.com/) & Firebase Hosting configuration |

---

## 3. System Architecture & Component Hierarchy

```mermaid
flowchart TD
    App[App.tsx - Root & State Orchestrator] --> AuthGate{User Authenticated?}
    AuthGate -- No --> AuthModal[AuthModal.tsx - Login / Register Gate]
    AuthGate -- Yes --> OnboardingCheck{Profile Complete?}
    OnboardingCheck -- No --> OnboardingView[OnboardingView.tsx - Setup & Gender/Grade]
    OnboardingCheck -- Yes --> DashboardView[DashboardView.tsx - Main Hub]

    DashboardView --> HeaderHUD[Header HUD: Streaks, Diamonds, Level, Theme, Grade, Sync Status]
    DashboardView --> DailyQuests[DailyQuestsCard.tsx - Quests & Daily Counters]
    DashboardView --> TodayHero[Today's Recommended Mission Card]
    DashboardView --> MissionMap[MissionMap.tsx - Units & Multi-Node Progression Tree]
    DashboardView --> VocabModal[VocabularyVaultModal.tsx - Searchable Ministry Word Bank]
    DashboardView --> ShopModal[RewardShopModal.tsx - Avatars, Stickers, Decor, Boosts]
    DashboardView --> MissionRunner[MissionRunner.tsx - 5-Step Mission Drill Engine]

    subgraph CloudSyncEngine [Services & Persistence]
        FirebaseService[services/firebase.ts]
        CloudSyncService[services/cloudSync.ts]
        LocalStorage[(localStorage v2 Mirror)]
        FirestoreDoc[(Firestore: learners/{uid})]
    end

    App <--> CloudSyncEngine
```

---

## 4. Key Architectural Patterns & Features

### 4.1. State Management & Cloud Sync Pipeline
- **Local Mirroring**: State is mirrored synchronously to `localStorage` under `english_tutor_learner_profile_v2` for offline availability.
- **Firebase Authentication**: Mandatory login gate supporting:
  - Google 1-Tap sign-in (`signInWithPopup`).
  - Kid-friendly Email/Username + PIN password authentication.
- **Conflict-Free Merge (`mergeLearnerProfiles`)**:
  - When a user signs in, local and remote profiles are merged safely without data loss.
  - Takes the **maximum** stars per mission ID (`Math.max(local, cloud)`).
  - Unions unlocked items (`unlockedRewardIds`).
  - Preserves maximum streaks, diamonds, and XP.
- **Real-Time Synchronization**: Listens to Firestore snapshots (`onSnapshot`) on `learners/{uid}`, updating state in real time across multiple devices.

### 4.2. Hebrew Grammatical Gender Localization (`hebrewGender.ts`)
- Israeli learners are addressed naturally according to their chosen gender (`girl` / `boy`).
- `getHebrewCopy(gender, name)` generates personalized greeting headlines, CTA buttons, and status texts.
- `inflectHebrew(text, gender)` applies regex-based grammatical inflection to mission prompts, hints, daily quests, and explanations (e.g., turning "השלימי" into "השלם", "קראי" into "קרא").

### 4.3. Pluggable Theming System (`themeRegistry.ts`)
- Supports 3 complete visual design themes switchable on-the-fly:
  1. **PeachNote Studio (`cozy-studio`)** *(Default)*: Pastel rose/purple tones, warm café aesthetic, Mochi the cat companion.
  2. **VibeLingua (`neon-pop`)**: Vibrant dark mode with neon cyan and fuchsia cyber accents.
  3. **Starlight RPG (`starlight-rpg`)**: Midnight indigo galaxy style, golden stars, Nova celestial companion.
- Each theme defines layout tokens: `pageBgClass`, `cardBgClass`, `heroCardClass`, `primaryBtnClass`, `hudBgClass`, and companion metadata.

### 4.4. Multi-Grade Curriculum Framework (`src/data/curriculum/`)
The curriculum is organized into modular grade packs covering Grades 1 to 12:
- **Elementary School (Grades 1–6 — Deep Content Active: 4 units × 3 missions = 12 missions per grade, 72 total)**:
  - **Grades 1–2 (Pre-Foundation)**: Phonics, alphabet sounds, CVC rhyming word families, sight words, colors, numbers, family, healthy snacks, farm/pet animals, home, clothes, and classroom objects, with picture-emoji vocabulary matching and Hebrew-first instructions.
  - **Grade 3 (Pre-Band I)**: Early reading of short sentences and mini-passages, school supplies, days of the week, weather, feelings, zoo animals, `I am / I have / I like / I can`, and simple questions (`What is this?`, `Is it...?`).
  - **Grades 4–6 (Band I Foundation)**:
    - **Grade 4**: Core action verbs, `can / can't`, rooms & furniture with `There is / There are`, prepositions of place (`in`, `on`, `under`, `next to`), sports/hobbies, and healthy food with `What` questions.
    - **Grade 5**: `Be` (`am / is / are`), `have / has`, town places & directions, telling time (`o'clock`, `half past`), daily routines with Present Simple (`he / she / it + s`), frequency adverbs (`always`, `usually`, `never`), and `Wh-` questions.
    - **Grade 6**: Present Simple vs. Present Progressive (`am / is / are + -ing`), Past Simple (`was / were` & regular `-ed` / common irregular verbs), comparatives (`-er` and `more + adjective`), `How many / How much / Why`, digital skills, school subjects, and Band I completion review.
  - Every unit culminates in a **Boss Review Mission** (`isBoss: true`).
- **Middle School (Grades 7–9 — Deep Content Active: 4 units × 3 missions = 12 missions per grade, 36 total)**:
  - **Grade 7**: 4 full curriculum units containing 12 comprehensive missions covering Present Simple vs. Present Progressive, Stative Verbs, Past Simple regular & irregular V2 verbs, Questions with Did/Didn't, Future Tenses (`will` vs. `going to`), Modals & Semi-Modals, and 4 Boss Unseen reading challenges.
  - **Grade 8 (Band II Completion)**: Past Simple vs. Past Continuous (`while` / `when`), Present Perfect Simple (`have/has + V3`, `ever`, `never`, `already`, `just`, `since`, `for`), Comparative & Superlative modifiers (`as...as`, irregular forms), First Conditional (`if` + present, `will` + base verb), and Band II Boss reading challenges.
  - **Grade 9 (Band III Entry)**: Passive Voice (Present & Past: `am/is/are + V3`, `was/were + V3`), Second Conditional (`if` + past, `would` + base verb), Relative Clauses (`who`, `which`, `that`, `where`), Past Perfect (`had + V3` before past actions), and Band III Boss synthesis challenges.
- **High School (Grades 10–12 — Deep Content Active: 4 units × 3 missions = 12 missions per grade, 36 total)**:
  - **Grade 10 (Band III Entry & Bagrut Foundations)**: Passive Voice (Present & Past Simple), Defining & Non-Defining Relative Clauses, Modals of Deduction in the Present (`must be`, `can't be`, `might / could be`), First & Second Conditionals review, and Bagrut Module C/E Gateway Unseens.
  - **Grade 11 (Band III Core & Module E Mastery)**: Third Conditional (`If + had + V3, would have + V3`), HOTS Literature analysis (Cause and Effect, Distinguishing Different Perspectives, Comparing and Contrasting), Modals in the Past (`should have`, `must have`, `couldn't have + V3`), and Module E scientific unseens with trend/graph interpretation.
  - **Grade 12 (Band III Mastery, Bagrut Opinion Essay & Module G)**: Academic discourse markers & connectors (addition, contrast, result, concession), 120–140 word Bagrut Opinion Essay structure (thesis statement, counter-argument & rebuttal, conclusion), Module G rigorous unseen reading (identifying author's tone, cross-paragraph synthesis, and justification), and global professional English.
- **Proficiency Tiers**:
  - `explorer` (Beginner - 1.0x XP multiplier)
  - `challenger` (Standard - 1.25x XP multiplier)
  - `master` (Advanced - 1.5x XP multiplier + diamond bonus)

### 4.5. 5-Step Interactive Mission Engine (`MissionRunner.tsx`)
Each learning mission consists of 5 pedagogical drill stages:
1. **Chat Reply Simulation / Vocabulary Match (`chat-reply`)**: Conversational English or tier-scaled picture/translation word matching in elementary grades.
2. **Sentence Magnet Builder (`sentence-builder`)**: Interactive chip builder to assemble scrambled words into grammatically correct English sentences.
3. **Voice Studio Drill (`voice-speak`)**: Speech-to-Text pronunciation exercise with Levenshtein-based similarity scoring and real-time pronunciation feedback.
4. **Grammar Detective (`grammar-detective`)**: Multiple-choice rule or phonics analysis with in-depth Hebrew explanations.
5. **Story Unseen (`story-unseen`)**: Reading comprehension passage with contextual questions and vocabulary reinforcement.
- Answer options and scrambled word chips are randomized on each attempt via a deterministic seeded shuffle (`src/utils/shuffle.ts`) so the correct option is never fixed in the first slot while remaining stable across React re-renders.
- Features combo multipliers, sound effects, celebration confetti, and 1–3 star ratings based on exercise accuracy.

### 4.6. Gamification, Streaks & Shabbat Shield
- **Daily Quests (`DailyQuestsCard.tsx`)**: 3 daily challenges rewarding XP and diamonds (Daily Mission, Voice Practice, 3-Star Mastery).
- **Shabbat-Safe Streak Calendar**: Observant learners can toggle Shabbat observer status. Weekend days (Friday–Saturday) do not break streaks if inactive, preventing lost progress.
- **Reward Shop (`RewardShopModal.tsx`)**: Spend diamonds on equippable avatar emojis, collectible stickers, and streak shields.

### 4.7. Interactive Vocabulary Vault (`VocabularyVaultModal.tsx`)
- Searchable directory of Israeli Ministry of Education curriculum words (with picture emojis for elementary vocabulary).
- Filters by grade and unit.
- One-tap audio pronunciation via Text-to-Speech (`window.speechSynthesis`).
- Interactive microphone drill to test spoken pronunciation against target vocabulary words.

### 4.8. Diagnostic Level Placement Test (`PlacementTest.tsx`, `placementTest.ts`)
- A 10-question adaptive test (מבחן רמה) that estimates the learner's English level and recommends a grade and proficiency tier.
- **Offered** once right after first-time onboarding (skippable), and on demand from the dashboard link under the tier selector (retakes allowed).
- **Questions are generated from the curriculum**: each mission yields a grammar-rule item (`drillSeed.rule`) and a vocabulary-meaning item (`vocabulary[0]` + `drillSeed.wrongWords`). Options are shuffled with the seeded shuffle and a per-attempt salt.
- **Adaptive staircase**: starts one grade below the school grade; a correct answer moves up and a wrong answer or "לא יודע/ת" moves down (±2 for the first 3 questions, then ±1), clamped to grades 1–12.
- **Estimate**: rounded mean mastery evidence of questions 5–10 (correct at grade g → g, wrong → g−1, correct at grade 12 → 13). Tier: below school grade → Explorer, equal → Challenger, above → Master. A different grade is recommended only when the estimate is 2+ grades away.
- The result is stored as `placementResult` on the profile (merged across devices by latest `completedAt`). The first completed test grants +30 XP and +10 diamonds.

### 4.9. "Get Ready for an Exam" Study Plans (`examPrep.ts`, `components/examPrep/`)
- The learner picks an exam date (today to +21 days), the units of their grade, and the skills: Vocabulary, Grammar, Sentence building, Unseen reading.
- **Plan**: study days run from today to the day before the exam (Saturdays skipped for Shabbat observers). The (unit × skill) focus blocks are spread over the practice days (repeated when there are more days than blocks), a mixed review day is added once there are 3+ practice days, and the last study day is the **Mock Mini-Exam**. An exam today or tomorrow gives a 1-day crash course (mixed review + mock).
- **Sessions** reuse the mission drills: for each focus unit, the step type matching the skill (`chat-reply`, `grammar-detective`, `sentence-builder`, `story-unseen`) from every mission, up to 8 per session. Voice drills are not used. Practice allows hints and retries and scores the first try; the mock (12 questions, balanced by skill) has no hints and locks each answer.
- **Rewards**: first completion of a day gives XP and diamonds and counts as a mission for the daily quests and streak (no mission stars); repeats give a little XP. A mock score of 70%+ grants the "Exam Ready" certificate and a one-time bonus.
- Stored as `examPrep` on the profile. Dismissing a plan sets `archivedAt` (fields are never removed, so a merge can't bring them back). Merge: different plans → newest `createdAt`; same plan → earliest completion and best score per day.
- Shared drill UI (`components/drills/`) renders the steps for both `MissionRunner` and `ExamSessionRunner`.

### 4.10. Star-Gated Boss Missions & Missions Counter (`milestones.ts`)
- **Boss gate**: a unit's Boss mission unlocks only when the unit's regular missions have earned 2 stars each (`BOSS_STARS_PER_REGULAR_MISSION`, i.e. 4 of 6). This is on top of the sequential rule (a mission opens once the previous one has a star), so the next unit also waits for the Boss. A Boss that already has stars always stays unlocked.
- **Suggestion**: `getSuggestedMission` returns the first mission without stars; when that is a gated Boss it suggests replaying the unit's weakest regular mission and returns the gate, so the dashboard hero and the mission map explain how many stars are missing.
- **Metrics**: stars (all grades, 1–3 per mission) measure mastery depth; the "Missions Completed" (משימות הושלמו) tile counts distinct missions with ≥1 star (`countCompletedMissions`). The words count on the XP tile (the one that opens the Vocabulary Vault) is the mastered-word count of the weekly report (`countMasteredWords` in `progressReport.ts`): the vocabulary of missions with 3 stars, across all grades, each word once. All three are derived from `missionProgress`, so no extra sync fields. `stats.missionsCompleted` (counts replays) and `stats.wordsMastered` (counts replays and Vault practice) are still stored but not shown.
- **Vault practice**: a word said in the Vocabulary Vault (`applyVocabPracticeReward` in `progressRewards.ts`) adds a voice word to today's counters (reset on a new day, like every activity) but is not a mission, so it doesn't extend the streak.

### 4.11. School Word List Importer (`customWordLists.ts`, `components/wordLists/`)
- The "My Word Lists" (רשימות המילים שלי) dashboard card, under the exam prep card, lets the learner paste a word list from a school worksheet and practise it.
- **Parsing** (`parseWordListText`): one item per line; numbering and bullets are stripped; a Hebrew translation can come before or after the English, separated by a dash, `=`, `:` or a tab; comma lists of short words are split. Lines of 1–2 words are words, longer lines are sentences (max 15 words). Duplicates and lines without English are reported with a Hebrew reason. A word without a translation gets one from the curriculum vocabulary when it is there (📚).
- **Limits**: 3–30 items per list, up to 10 active lists.
- **Sessions** (`buildWordListSteps`): up to 5 items per session in three rounds: meaning match (words with a translation, options are other list words), magnets (letter tiles for words with spaces/punctuation kept fixed, word chips for sentences), then voice. Practice allows hints and retries and scores the first try; a skipped voice step ("quiet place") is left out of the score.
- **Rewards**: the full reward (15 XP, 2 💎, +3 💎 at 80%+) once per list per day, for up to 3 lists a day (`lastRewardedDateStr`); otherwise 3 XP. Every session counts as a mission for the daily quests and streak; voice-word and 3-star quest credit come only from rewarded sessions. There are no mission stars.
- Stored as `customWordLists` on the profile. Deleting a list sets `archivedAt` and empties its items (a small tombstone, so a merge can't bring it back). Merge: union by id; the same list keeps the best score and latest practice, and stays deleted once either device archived it.
- Voice recognition lives in `hooks/useSpeechRecognition.ts` and `drills/VoiceSpeakDrill.tsx`, shared with `MissionRunner`; letter magnets are `drills/SpellingMagnetDrill.tsx`.

### 4.12. My English Room (`room.ts`, `wardrobe.ts`, `roomRewards.ts`, `roomActivities.ts`, `voiceMessages.ts`, `dreamJournal.ts`, `wordGames.ts`, `stickers.ts`, `components/room/`)
- The "החדר האנגלי שלי" dashboard card (under the word lists card) shows a live preview of the room and opens it full-screen.
- **The room** (`RoomScene`): a drawn wall/floor scene with fixed slots (wall, sticker board, shelf, desk, floor) and four mission objects: 🛏️ bed, 📱 phone, 🚪 wardrobe, 📖 Games Book. Slot positions and per-theme colours live in `roomLayout.ts`. The equipped shop avatar walks to whatever the learner taps.
- **Mission objects** show a "coming soon" bubble with their activity until later phases ship.
- **Items**: 20 room items (`ROOM_ITEMS`) plus the shop decor lamp and the 3 shop stickers (`SHOP_ROOM_ITEMS`). Every learner starts with the 🪴 plant. Ownership reuses `unlockedRewardIds`.
- **Earning**: a mission's *first* 3-star result awards the next unowned item in `ROOM_REWARD_ORDER` (`roomRewards.ts`), which alternates room decor and wardrobe items. The victory screen previews it and the dashboard shows a toast.
- **Placing** (`NameItemPanel`): pick an item, then a blinking slot of its kind; the learner must **say** the English name (speech recognition) or **spell** it with letter magnets. The first naming of each item gives +5 XP (`namedItemIds`). Tapping a placed item says its name and offers move / put away.
- **Avatars**: five free starter avatars (girl, boy, puppy, kitten, panda) were added to the shop.
- **🚪 Wardrobe Dress-Up Studio** (phase 2, `wardrobe.ts`, `WardrobePanel`, `DressedAvatar`): tapping the wardrobe opens the studio. 17 items on six layers (head, face, neck, torso, legs, feet); accessories fit every avatar, clothes only the girl/boy avatars (`HUMAN_AVATAR_EMOJIS`) and are hidden on animal avatars. The avatar is drawn as a paper doll in the room and the studio.
  - Starter set: cap, glasses, scarf, shirt, jeans. More come from 3-star missions; sunglasses, graduation cap and crown are sold in the shop's new `accessory` category (same ids).
  - An item goes on only after naming it (`NameItemPanel` modes by tier): Explorer can say, pick from 3 written names or spell; Challenger says or spells; Master must spell. Tapping a worn item takes it off. A new item on a layer replaces the old one.
  - Daily reward: putting on 3 items a day (`DRESS_UP_DAILY_GOAL`) gives +10 XP and +2 💎 once a day and counts as a mission for the daily quests and streak (voice namings count as voice words). First naming of each item also gives +5 XP.
- **📱 Voice Messages** (phase 3, `voiceMessages.ts`, `PhonePanel`): tapping the phone opens a chat. A friend's message is read aloud, and the learner records the English reply (`VoiceSpeakDrill`, scored by `evaluateSpokenSentence`). Each session has 3 messages from the learner's grade band (`getGradeBand`: grades 1–3, 4–6, 7–9, 10–12; 8 messages each, replies grow from 2–4 words to two Band III sentences). Skipped messages are not sent.
- **🛏️ Dream Journal** (phase 4, `dreamJournal.ts`, `DreamJournalPanel`): guided frames, no AI. Each dream uses 2 sentence frames from the learner's grade band (4 per band, 2 blanks × 4 word choices). Step 1: invent the dream by picking Hebrew words (plus an optional free Hebrew note). Step 2: translate each picked word — Explorer/Challenger choose from 3 English options, Master types it (`isSameTranslation` ignores case and punctuation); first-try accuracy is shown. Step 3: listen and optionally read the English dream aloud. Saving adds it to the journal (`room.dreamJournal`, newest 20) and gives the room-activity reward. The Hebrew frames avoid gendered forms, so the text works for every learner.
- **📖 Games Book** (phase 5, `wordGames.ts`, `components/room/games/`): four word games built from the learner's word lists and grade vocabulary (single words of 3–8 letters; nearby grades and room item names fill in when a grade has too few). Games unlock with total stars: 🔀 Word Scramble (0 ⭐, letter magnets with the Hebrew clue), 🔍 Word Search / תפזורת (10 ⭐, 9×9 grid; Explorer right/down, Challenger adds diagonals, Master also backwards), ✏️ Crossword (25 ⭐, Hebrew clues, typed answers, greedy crossing generator), 🕵️ Hidden Words (40 ⭐, words hidden in one letter stream, Hebrew clues only). Selections are first + last letter (`matchSelection`). Scores: first-try share (scramble, crossword) or words found minus 5% per wrong selection; the best score per game is kept (`room.gameBestScores`). Each game has its own daily room-activity reward, given only for a score of 50%+ (`GAME_FULL_REWARD_MIN_SCORE`); below that a game gives only the repeat XP and the daily reward stays open, and a game ended at 0% (nothing found, or every crossword answer revealed) earns nothing. Generators are pure and seeded (`+ .test.ts`).
- **🎨 Sticker Studio** (phase 6, `stickers.ts`, `components/room/stickers/`, header button "🎨 מדבקות"): an album of every board sticker the learner owns (shop stickers, earned ⭐🌈❤️ and drawings). Each can go on the room's sticker board (placed by naming it, like any item) or become the dashboard background (`StickerBackground`, a faint repeating pattern; `room.backgroundStickerId`, saved with the layout).
  - **Premium drawing**: the shop's "Sticker Studio Pass" (`pass-sticker-studio`, 150 💎) unlocks a drawing pad (`StickerCanvas`: 8 colours, 2 brush sizes, eraser, undo, clear). A drawing is saved only with an English name of 1–3 words, typed or spoken; it is stored as a 96px PNG data URL inside the profile (`room.drawnStickers`, at most 12 active, max 30 KB each) so no Firebase Storage is needed. If two offline devices together have more than 12 active, the merge keeps the newest 12 and archives the rest. Naming it gives the first-time +5 XP. Deleting archives it (picture emptied) and takes it off the board and the background.
  - Drawn stickers are items like any other: `getRoomItemFor(profile, id)` / `getPlacedRoomItems` resolve them, and `ItemIcon` shows the picture instead of an emoji.
- **Room activity rewards** (`roomActivities.ts`): the first finished session of each activity per day (`phone`, `journal`, each word game) gives +10 XP and +2 💎 and counts as a mission for the daily quests and streak; repeats give +2 XP. Dates are kept in `room.activityRewardDates`. Panels share `RoomPanelFrame` and `ActivityRewardSummary`.
- Stored as `room` on the profile (`placements` slot → item, `outfit` layer → item, `namedItemIds`, `dressUpDay`, `activityRewardDates`, `dreamJournal`, `gameBestScores`, `drawnStickers`, `backgroundStickerId`, `updatedAt`). Merge: the newer layout and outfit win; named items are unioned; the same day's dress-up progress keeps the highest counts and a given reward stays given; activity reward dates keep the later date per activity; dreams are unioned by id (newest 20); game best scores keep the higher score per game; drawn stickers are unioned by id and stay deleted once either device archived one.
- Every mission object now opens its activity; the per-item missions follow the draft designs in `backlog.md` (Feature 12) until a detailed breakdown replaces them.

### 4.13. Drill Hints (`utils/hints.ts`)
- **Rule**: a hint (`hintHe`, shown by the "רמז בעברית 💡" button and automatically for Explorer) gives a way to work the answer out. It never names the answer or repeats text already on screen. Hints are worded gender-neutrally (`כדאי…`, `טיפ:`).
- **Generated hints** (pure helpers in `utils/hints.ts`, + `.test.ts`):
  - Step 1, vocabulary: Explorer and Master (English-word options) get the example sentence with the word blanked (`toClozeSentence`). When the word isn't in it, they get the letter count, plus the first letter when another option has the same length (`getWordShapeHintHe`). Challenger (Hebrew-meaning options) gets the English example sentence without its Hebrew translation.
  - Step 2, sentence builder: the word count and the last word, plus the first word for sentences of 5+ words (`getSentenceOrderHintHe`). The capitalised chip already shows the first word of short sentences.
  - Step 3, voice: a pronunciation tip for Hebrew speakers on the first tricky sound, checking content words first (`getPronunciationTipHe`: th, w, silent letters, `-ed`, `-ing`, silent e, ee).
  - Step 5, story: which sentence of the story holds the answer (`findAnswerSentenceNumber`). Challenger/Master also get the question in Hebrew.
- **Hand-written step-4 hints**: every mission's `drillSeed.rule.hintHe` (required, 144 in all) reminds the learner how to decide. It must not contain any word that is in the correct option but in none of the wrong ones. `missionHints.test.ts` checks every mission × tier for this and for repeated prompts.
- Word lists reuse the same helpers (meaning: word shape, magnets: `getSpellingHintHe` / sentence order, voice: pronunciation tip). The room naming panel's spell hint shows the first letter and the letter count, not the name.

### 4.14. Friends Hub & Daily Contests (`friends.ts`, `contests.ts`, `services/friendsService.ts`, `components/friends/`)
- The "👫 החברים שלי" dashboard card (under the room card) opens the hub. It is only for signed-in, non-guest accounts. The settings screen (`OnboardingView` in edit mode) has an on/off toggle (`friendsHub.isEnabled`, on by default). When it is off, the card is hidden, no listeners run, and the public summary, friend code entry and username entry are deleted.
- **Firestore** (all access rules in `firestore.rules`; client-only, no Cloud Functions):
  - `friendCodes/{CODE}` and `usernames/{slug}` → `{uid, displayName, avatarEmoji}`. They can be read one at a time (no listing). Each learner owns exactly one code, recorded in `friendCodeOwners/{uid}` in the same write; another device recovers it from there. A username can be claimed or changed only by the account whose sign-in email is `<slug>@peachnote.tutor.local` (`utils/username.ts`). A lookup returns both the code match and the username match, labelled, when both exist.
  - Every avatar field must be emoji only (no letters or digits). Timestamps are bounded strings.
  - `publicProfiles/{uid}` → display name, avatar, level, streak, stars, missions completed. Nothing else (no age, grade or email). Readable only by the owner and accepted friends. `useFriendPresence` (in `App.tsx`) claims the friend code and republishes the summary when it changes.
  - `friendships/{pairId}` (`getPairId`: sorted uids): a pending request with both names and avatars. The requester's name and avatar must match their own public profile. The addressee accepts. Either side deletes it to cancel, decline or remove. Each friend may set only their own preset reaction (`FRIEND_REACTIONS`, also listed in the rules). There is no free text anywhere.
  - `contests/{pairId}_{dateStr}`: one contest per pair per day, ending at the creator's local midnight (`expiresAtMs`). The rules accept only a date within a day of the server date, an expiry at most 25 hours away, and players who are still friends. The invitee accepts or declines. Each player writes their own result once, before midnight, with at least 5 questions and at least 3 seconds. Listed with the `uids` + `dateStr` composite index (`firestore.indexes.json`).
- **Adding friends**: by friend code (6 characters, no 0/O/1/I/L) or username. An invite link `/?invite=CODE` (`usePendingInvite`) is kept through sign-in and opens the hub with the code. Sharing uses `navigator.share`, with a WhatsApp link and copy as the fallback. Limits: 30 friends and 10 outgoing requests (`checkFriendRequest`).
- **Contests** (`buildContestSteps`): each player gets questions from their *own* grade, at the same relative difficulty. That means the same unit number (seeded 1–4), the Challenger tier for both, and the same layout: 5 meaning matches (1 + 3 distractor translations from the grade) and the sentence magnet of each of the unit's 3 missions. Everything is seeded by the contest. `ContestRunner` has no hints, one try per question and a timer. Leaving after the first answer ends the contest with the answers so far. The result screen opens while the result saves. Offline saves time out after 10 seconds with a message.
- **Deciding a contest** (`getContestState`): the higher score percentage wins, and the faster time breaks a tie. A contest is decided once both played, or at midnight or a decline when only one did (`friend-missed`). A result finished after midnight is ignored. A contest is recorded only after the server confirms it (`hasPendingWrites`). Contests are found by the viewer's local date, which assumes friends share a time zone.
- **Rewards**: finishing gives +10 XP and counts as a mission for the daily quests and streak, for the first 3 contests a day (then +2 XP). A decided contest is recorded once in `friendsHub.contestHistory` (the last 30 days, sized so no record in the 7-day lookback is ever dropped). The history also feeds the record vs. each friend. A win or tie gives 10 💎; a loss, or a friend who never played, gives 3 💎. Diamonds are paid for at most 3 contests per contest day.
- Merge (`mergeFriendsHub`): the newer toggle wins, the earlier-claimed friend code is kept, contest records are unioned by contest id (newest first, `MAX_CONTEST_HISTORY`), and the same day's finish count keeps the higher value.

### 4.15. Parent / Teacher Weekly Progress Report (`activityLog.ts`, `progressReport.ts`, `components/progressReport/`)
- The "📊 דוח התקדמות להורים ולמורים" dashboard card (under the friends card) shows this week's practice days (Sunday–Saturday) and opens the full report. It works for every account, on the learner's own device.
- **Activity log** (`activityLog.ts`): `profile.activityLog` keeps one entry per local day for the last 12 weeks (`ACTIVITY_LOG_DAYS = 84`): sessions (anything that counts as a mission for the quests and streak), voice words, 3-star sessions, XP earned, stars gained, the missions that gained stars (`missionStars`) and the missions that got their first star (`firstCompletedIds`).
  - It is recorded in one place: `App.tsx` `handleUpdateProfile` calls `recordActivityLog(prev, next, now)`, which diffs the profile before and after each local update (XP, mission stars, `dailyCounters`; drops are ignored). Reward code doesn't need to report activity.
  - Cloud snapshots are merged with `mergeActivityLog`, never diffed, so nothing is counted twice. Merge: union by date; the same day keeps the higher value of each counter and the higher stars per mission. A day played on two devices therefore shows the busier device, not the sum, so weekly totals can be a little lower than the real activity.
  - The log only starts when this feature ships; the report says from which date it counts.
- **Report** (`progressReport.ts`, pure, + `.test.ts`): `buildWeeklyReport(profile, weekStart, todayStr)` gives the week's day statuses (active = a finished session or words said aloud; XP alone, e.g. a quest claim, doesn't count / missed / Shabbat-shielded for observers / future), totals, new missions completed and the words of missions that reached 3 stars that week. The overall part has level, streak, missions completed, a star mastery rating (average stars per completed mission, and stars of the current grade) and the mastered word count. A mission's words count as mastered at 3 stars (`MASTERED_WORD_MIN_STARS`), de-duplicated across grades. `getAvailableWeeks` goes back to the log's first week, at most 12 weeks.
- **Screen** (`WeeklyReportScreen`): week arrows, the week strip and tiles, overall progress, this week's new words (tap to hear), and sharing. `buildWeeklyReportTextHe` writes a Hebrew text summary about the learner in the third person (gendered), listing up to 10 new words; `ShareTextActions` sends it with the native share sheet, or a WhatsApp link, plus copy. The friend invite panel uses the same component.

---

## 5. Directory Structure

```text
├── public/                 # Static assets & favicon
├── src/
│   ├── components/         # React UI Components
│   │   ├── AuthModal.tsx             # Kid-friendly authentication modal
│   │   ├── DailyQuestsCard.tsx       # Daily quest tracker & streak counter
│   │   ├── DashboardView.tsx         # Main hub screen (HUD, Hero, Maps, Actions)
│   │   ├── drills/                   # Shared drill UI (options, sentence/letter magnets, voice, passage, feedback)
│   │   ├── examPrep/                 # Exam prep hub, setup, plan timeline, session runner, certificate
│   │   ├── friends/                  # Friends Hub: dashboard card, hub screen, friend card & reactions, add friend, invite code, contest panel/runner/result
│   │   ├── MissionMap.tsx            # Unit & mission progression node tree
│   │   ├── MissionRunner.tsx         # 5-step interactive exercise runner
│   │   ├── OnboardingView.tsx        # Profile setup (name, gender, age, grade, tier)
│   │   ├── PlacementTest.tsx         # Adaptive diagnostic placement test overlay
│   │   ├── progressReport/           # Weekly parent / teacher report: dashboard card, week strip, report screen
│   │   ├── ShareTextActions.tsx      # Share sheet / WhatsApp / copy buttons for a text (report, friend invite)
│   │   ├── PlacementResultCard.tsx   # Placement result & grade/tier recommendation
│   │   ├── RewardShopModal.tsx       # Diamond shop (avatars, stickers, shields)
│   │   ├── room/                     # My English Room: hub, scene & layout, inventory, naming panel, wardrobe, phone, dream journal, games/ (Games Book), stickers/ (Sticker Studio)
│   │   ├── VocabularyVaultModal.tsx  # Ministry word bank & pronunciation studio
│   │   └── wordLists/                # School word lists: dashboard card, importer, session runner & result
│   ├── data/
│   │   ├── curriculum/               # Grade-specific curriculum packs
│   │   │   ├── elementary/           # Grades 1 to 6 (builder.ts + 72 missions across grade1..6.ts)
│   │   │   ├── middleSchool/         # Grades 7 to 9 (builder.ts + 36 missions across grade7..9.ts)
│   │   │   ├── highSchool/           # Grades 10 to 12 (builder.ts + 36 missions across grade10..12.ts)
│   │   │   ├── index.ts              # CURRICULUM_BY_GRADE registry
│   │   │   └── types.ts              # Unit, MissionNode, VocabularyItem, and DrillSeed types
│   │   ├── activityLog.ts            # Daily activity log (12 weeks) recorded by diffing profile updates, + merge (+ .test.ts)
│   │   ├── customWordLists.ts        # School word list parsing, session steps, scoring & rewards (+ .test.ts)
│   │   ├── elementaryExercises.ts    # Tier-aware 5-step generator for elementary drill seeds
│   │   ├── missionExercises.ts       # Concrete exercise definitions & seeded option/word shuffler
│   │   ├── examPrep.ts               # Exam study plan building, session/mock steps & scoring (+ .test.ts)
│   │   ├── friends.ts                # Friend codes, requests, public summary, reactions & invite links (+ .test.ts)
│   │   ├── contests.ts               # Daily contest questions by grade, deciding & rewards (+ .test.ts)
│   │   ├── milestones.ts             # Boss star gate, mission unlocks, suggested mission & missions counter (+ .test.ts)
│   │   ├── missionHints.test.ts      # Sweep of every mission × tier: hints never repeat the prompt or reveal the answer
│   │   ├── placementTest.ts          # Placement question generation, staircase & scoring (+ .test.ts)
│   │   ├── progressReport.ts         # Weekly report: week days, totals, star mastery, mastered words & share text (+ .test.ts)
│   │   ├── progressRewards.ts        # Shared level formula & daily-activity/streak bookkeeping
│   │   ├── room.ts                   # Room items & slots, placing & naming rules (+ .test.ts)
│   │   ├── roomRewards.ts            # 3-star rewards alternating room decor and wardrobe items (+ .test.ts)
│   │   ├── roomActivities.ts         # Shared daily reward for room activities (+ .test.ts, with voice messages)
│   │   ├── voiceMessages.ts          # Phone voice-message prompts by grade band & session reward
│   │   ├── dreamJournal.ts           # Dream Journal sentence frames, translation checks & journal entries (+ .test.ts)
│   │   ├── wordGames.ts              # Games Book word source, scramble/search/crossword/hidden-word generators & scores (+ .test.ts)
│   │   ├── stickers.ts               # Sticker Studio album, drawn stickers (pass, names, PNG limits) & app background (+ .test.ts)
│   │   ├── wardrobe.ts               # Dress-Up Studio items, outfit rules & daily dress-up reward (+ .test.ts)
│   │   └── rewardShop.ts             # Daily quest & shop item catalog
│   ├── hooks/
│   │   ├── useFriendsHub.ts          # Live friendships, friends' public profiles & contests
│   │   ├── useFriendPresence.ts      # Claims the friend code and publishes the public summary
│   │   ├── usePendingInvite.ts       # Friend code from an invite link, kept through sign-in
│   │   └── useSpeechRecognition.ts   # Web Speech recognition for the voice drills
│   ├── services/
│   │   ├── cloudSync.ts              # LocalStorage <-> Firestore sync & merge logic (+ .test.ts)
│   │   ├── friendsService.ts         # Firestore calls for friends, public profiles & contests
│   │   └── firebase.ts               # Firebase initialization & auth/db instances
│   ├── themes/
│   │   └── themeRegistry.ts          # Pluggable theme visual definitions & tiers
│   ├── types/
│   │   └── learner.ts                # Core domain types (LearnerProfile, Stats, Grades)
│   ├── utils/
│   │   ├── hebrewGender.ts           # Hebrew grammatical gender inflection engine
│   │   ├── hints.ts                  # Drill hint builders: word shape, cloze, word order, pronunciation tips, story locator (+ .test.ts)
│   │   ├── shuffle.ts                # Deterministic seeded shuffle for options & word chips
│   │   ├── speechSimilarity.ts       # Phonetic & string similarity calculation for voice
│   │   └── username.ts               # Username <-> sign-in email slug (auth, lookup and rules)
│   ├── App.tsx                       # Root orchestrator & Firebase auth/sync listener
│   ├── index.css                     # Tailwind & custom CSS utility rules
│   └── main.tsx                      # React root entry point
├── backlog.md              # Project product backlog (completed & future items)
├── firestore.rules         # Firestore security rules (learners, friends, public profiles, contests)
├── firestore.indexes.json  # Composite index for the contests query
├── index.html              # HTML entry point
├── package.json            # Node.js dependencies & scripts
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite bundler configuration
```

---

## 6. Development & Build Commands

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run unit tests (Vitest)
npm test

# Typecheck and build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 7. Product Backlog & Roadmap
Detailed feature tracking and future planned enhancements are managed in [`backlog.md`](file:///c:/Development/English%20Tutor/backlog.md).
