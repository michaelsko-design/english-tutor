# EnglishVibe — Architecture & System Documentation

## 1. Overview & Vision
**EnglishVibe** (`APP_NAME` in `src/config/appInfo.ts`; formerly "English Tutor App") is an interactive, gamified English-learning web application specifically tailored for Israeli students across Grades 1–12 (יסודי, חטיבת ביניים, וחטיבה עליונה). The app aligns with the Israeli Ministry of Education English Curriculum Bands (Pre-Foundation, Foundation, Band I, Band II, and Band III).

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
| **Drag & Drop** | [@dnd-kit](https://dndkit.com/) (`core` + `sortable`) for the word and letter magnets |
| **Speech & Audio** | Azure Neural read-aloud (rendered MP3 clips + `/api/tts` Vercel Function), Web Speech API `SpeechSynthesis` as fallback, `SpeechRecognition` / `webkitSpeechRecognition` |
| **Backend & Auth** | [Firebase](https://firebase.google.com/) (Authentication & Cloud Firestore) |
| **Testing** | [Vitest](https://vitest.dev/) unit tests (`npm test`) |
| **Deployment & Hosting** | [Vercel](https://vercel.com/) (project `english-tutor`, team `clear-shield`; a push to `main` deploys to production). Firebase hosts only Auth and Firestore (project `english-tutor-il-7`). |

**Production URL:** https://english-tutor-nine-ebon.vercel.app/ (`english-tutor-clear-shield.vercel.app` is the team alias behind Vercel's login, and `english-tutor.vercel.app` is someone else's app).

---

## 3. System Architecture & Component Hierarchy

```mermaid
flowchart TD
    App[App.tsx - Root & State Orchestrator] --> AuthGate{User Authenticated?}
    AuthGate -- No --> AuthModal[AuthModal.tsx - Login / Register Gate]
    AuthGate -- Yes --> OnboardingCheck{Profile Complete?}
    OnboardingCheck -- No --> OnboardingView[OnboardingView.tsx - Setup & Gender/Grade]
    OnboardingCheck -- Yes --> FirstLaunch{First launch?}
    FirstLaunch -- Yes --> FirstLaunchSeq[home/FirstLaunchGreeting.tsx - Companion & Welcome Chest, tutorial/AppTour.tsx, then PlacementTest.tsx offer]
    FirstLaunch -- No --> DashboardView[DashboardView.tsx - Home Base]
    FirstLaunchSeq --> DashboardView

    DashboardView --> HomeHud[home/HomeHud.tsx - Avatar in Level Ring, Streak, Gems, Sound, Sync]
    HomeHud --> StatsSheet[home/StatsSheet.tsx - Stat Tiles, Grade, Placement Test, App Tour]
    DashboardView --> HomeHero[home/HomeHero.tsx - Home Scene, Companion Greeting, Play Button]
    DashboardView --> QuestRings[home/QuestRings.tsx - 3 Quest Rings, opens DailyQuestsCard.tsx]
    DashboardView --> Dock[Dock: Room, Exam Prep, Word Lists, Friends, Report tiles]
    DashboardView --> MapPeek[home/MapPeek.tsx - Current Unit Strip]
    DashboardView --> MissionMap[MissionMap.tsx - Units & Multi-Node Progression Tree]
    DashboardView --> VocabModal[VocabularyVaultModal.tsx - Searchable Ministry Word Bank]
    DashboardView --> ShopModal[RewardShopModal.tsx - Avatars, Stickers, Decor, Boosts]
    HomeHero --> MissionRunner[MissionRunner.tsx - 5-Step Mission Drill Engine]

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
- **Local Mirroring**: State is mirrored to `localStorage` under `english_tutor_learner_profile_v2` (shown behind the sign-in check). Offline use relies on Firestore's IndexedDB cache.
- **Firebase Authentication**: Mandatory login gate supporting:
  - Google 1-Tap sign-in (`signInWithPopup`).
  - Kid-friendly Email/Username + PIN password authentication.
- **Sign-in load** (`App.tsx`, `buildLoginProfile` in `cloudSync.ts`): the cloud document is the profile; a fresh default only fills gaps, and its 50 welcome diamonds never count for an existing account. If the first read fails, `CloudLoadErrorScreen` offers a retry and **nothing is saved** until the profile loaded (`isCloudLoadedRef`), so a default profile can never reach onboarding and overwrite the cloud. A slow load of an earlier account is ignored (`authGeneration`).
- **Every local change** goes through `App.handleUpdateProfile`, which records it once: the activity log (`recordActivityLog`) and this device's diamond ledger (`recordDiamondChange`). Cloud saves are batched (`services/profileSaveQueue.ts`): one write of the latest profile a second after a burst, flushed when the app is hidden or closed and before switching accounts.
- **Merge (`mergeLearnerProfiles`)** runs on every snapshot. It builds the profile field by field, so **a new profile field must be added there** or a sync drops it locally.
  - Stars: the maximum per mission. Unlocked items: union. XP: the maximum.
  - **Diamonds** (`data/diamondLedger.ts`): `diamondLedger` holds per-device `{earned, spent}` totals that only grow; devices merge by the larger value of each, and `stats.diamonds` is their balance. A purchase on one device is never refunded by another. The balance from before the ledger is the `legacy` entry; while neither side has a ledger, the larger plain balance is kept.
  - **Streak** (`mergeStreakStats`): the device that learned most recently wins (4.6).
  - Dates are local calendar days everywhere (`utils/dates.ts`, `toLocalDateStr`), never the UTC date.
- **Real-Time Synchronization**: Listens to Firestore snapshots (`onSnapshot`) on `learners/{uid}`, updating state in real time across multiple devices.

### 4.2. Hebrew Grammatical Gender Localization (`hebrewGender.ts`)
- Israeli learners are addressed naturally according to their chosen gender (`girl` / `boy`).
- `getHebrewCopy(gender, name)` generates personalized greeting headlines, CTA buttons, and status texts.
- `inflectHebrew(text, gender)` applies regex-based grammatical inflection (e.g., turning "השלימי" into "השלם", "קראי" into "קרא"). Mission steps use the `he` tagged template (`hebrewTemplate(gender)`), which inflects only the instruction text written in the template, never the story passages, story questions or answer options it embeds, so third-person story text ("היא יכולה") reads the same for every learner. `hebrewGender.test.ts` checks every mission × tier for both genders against a list of words that must not change.

### 4.3. Pluggable Theming System (`themeRegistry.ts`)
- The app is always called EnglishVibe; theme names appear only in the theme picker in settings. Internal ids (`english_tutor_*` storage keys, the `english-tutor-il-7` Firebase project, the `@peachnote.tutor.local` sign-in domain) keep their old names so existing accounts and data keep working.
- Supports 3 complete visual design themes switchable on-the-fly:
  1. **PeachNote Studio (`cozy-studio`)** *(Default)*: Pastel rose/purple tones, warm café aesthetic, Mochi the cat companion.
  2. **VibeLingua (`neon-pop`)**: Vibrant dark mode with neon cyan and fuchsia cyber accents.
  3. **Starlight RPG (`starlight-rpg`)**: Midnight indigo galaxy style, golden stars, Nova celestial companion.
- Each theme defines layout tokens: `pageBgClass`, `cardBgClass`, `heroCardClass`, `primaryBtnClass`, `hudBgClass`, and companion metadata.
- `isDark` turns on the `dark:` colours: Tailwind uses `darkMode: 'class'` and `App` sets the `dark` class on `<html>` from the theme, not from the phone's dark-mode setting. `themeColor` is the browser bar colour.

### 4.4. Multi-Grade Curriculum Framework (`src/data/curriculum/`)
> **After any change to English text, render the read-aloud clips again.** See "When English text changes" in section 6.

The curriculum is organized into modular grade packs covering Grades 1 to 12:
- **Elementary School (Grades 1–6 — Deep Content Active: 4 units × 3 missions = 12 missions per grade, 72 total)**:
  - **Grade 1 (Pre-Foundation, 10 units, Feature 48)**: reading from zero. Units 1–4 teach the letters A–Z in order (`data/alphabet.ts`: capital and small form, the letter's name, three picture words each); units 5–6 blend letters into short words, then sh / ch / th, sight words (`I`, `a`, `the`, `is`, `see`) and a first sentence (`data/blendingWords.ts`). Units 7–10 are the earlier topics: greetings, colors, numbers, body, classroom, fruit and toys. These phonics missions have `phonics` instead of a `drillSeed` (`isPhonicsUnit`); their steps are in 4.5.
    - **Mission ids**: a unit's `idUnitNumber` is the unit number in its mission ids. The phonics units use `g1-u11` … `g1-u16`, and units 7–10 kept `g1-u1` … `g1-u4`, so learners' stars stayed on the missions they played (no migration). Exam banks are keyed by the unit's place (`unitNumber` 7–10); phonics units have no exam bank, are left out of exam prep (`getUnitOptions`), and contests count only units with sentence missions (contest unit N = the grade's Nth such unit).
  - **Grade 2 (Pre-Foundation)**: CVC rhyming word families, sight words, family, healthy snacks, farm/pet animals, home and clothes, with picture-emoji vocabulary matching and Hebrew-first instructions.
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
- **Proficiency Tiers** (`TIER_CONFIG` in `themeRegistry.ts`):
  - `explorer` (Beginner - 1.0x XP, +5 💎)
  - `challenger` (Standard - 1.5x XP, +12 💎)
  - `master` (Advanced - 2.0x XP, +20 💎)

### 4.5. 5-Step Interactive Mission Engine (`MissionRunner.tsx`)
Each learning mission consists of 5 pedagogical drill stages:
1. **Chat Reply Simulation / Vocabulary Match (`chat-reply`)**: Conversational English or tier-scaled picture/translation word matching in elementary grades.
2. **Sentence Magnet Builder (`sentence-builder`)**: Interactive chip builder to assemble scrambled words into grammatically correct English sentences. Words are tapped in order or dragged (see 4.23).
3. **Voice Studio Drill (`voice-speak`)**: Speech-to-Text pronunciation exercise with Levenshtein-based similarity scoring and real-time pronunciation feedback.
4. **Grammar Detective (`grammar-detective`)**: Multiple-choice rule or phonics analysis with in-depth Hebrew explanations.
5. **Story Unseen (`story-unseen`)**: Reading comprehension passage with contextual questions and vocabulary reinforcement.
- Answer options and scrambled word chips are randomized on each attempt via a deterministic seeded shuffle (`src/utils/shuffle.ts`) so the correct option is never fixed in the first slot while remaining stable across React re-renders.
- Features combo multipliers, sound effects, celebration confetti, and 1–3 star ratings based on exercise accuracy.
- **Question screen layout (Feature 46)**: step badge, one short gendered instruction (`promptHe`), then the question card, the largest text on the screen. `drills/questionCard.ts` (`getQuestionCardContent`) picks what the card shows, for all four runners: the Hebrew sentence to translate in the sentence builder (no 🔊, there is no Hebrew voice and the English is the answer), the Hebrew word in Hebrew → English word steps (`cardTextHe`), a single English word very large, otherwise `questionEn`, with `___` drawn as an empty slot. The voice step has no question card: `VoiceSpeakDrill` is the card (sentence, Hebrew translation, 🐢/🔊) with one round record button under it. Authored gender pairs in Hebrew content (`אני אוהב/ת`, `החבר/ה`) are resolved to the learner's form by `resolveGenderSlashes` (`utils/hebrewGender.ts`) when steps are built (`resolveStepGenderSlashes`).
- **Grade 1 phonics steps (Feature 48)**: `getRawExercisesForMission` sends `phonics` missions to `data/letterExercises.ts` and `data/blendingExercises.ts`. All are multiple choice with big letters or pictures (`cardDisplay`, `size: 'glyph'`), except the word build and the voice step.
  - **Letters**: hear a letter's name → pick it (`letter-listen`); small → capital letter, Master capital → small (`letter-case`); a picture → its first letter (`letter-picture`); say the first word; a letter → the picture that starts with it (`letter-find`, picture options read their word via `speakEn`). A Boss spreads its 5 steps over its unit's letters; Master mixes in earlier letters.
  - **Blending**: tiles (`drills/SoundTiles.tsx`: tap a tile for its letter's name, ➡️ lights the tiles one by one and reads the word slowly) → pick the picture (`blend-listen`); read the tiles alone, nothing read by itself (`blend-read`, Master can't slide); build the word with letter magnets (`blend-build`, `SpellingMagnetDrill`); read it aloud; a picture → its word among look-alikes one letter apart (`blend-change`). The unit 6 Boss ends with a first sentence to read.
  - Isolated letter sounds (IPA phonemes) were tried and rejected by ear, so letters are taught by their name (`[letter:b]` clips) and words.
- A mission opens on an intro screen (`mission/MissionIntro.tsx`) where the tier is chosen; the steps have no tier switcher. A first play then shows the mission's mini-lesson (4.24). The runner's look and the companion are described in 4.17.

### 4.6. Gamification, Streaks & Shabbat Shield
- **Daily Quests (`DailyQuestsCard.tsx`)**: 3 daily challenges rewarding XP and diamonds (Daily Mission, Voice Practice, 3-Star Mastery).
- **Streak** (`data/streak.ts`): consecutive days with a finished session, stored with the date it last counted (`stats.streakLastDateStr`). Always read it with `getCurrentStreak(profile, todayStr)`: a missed weekday breaks it (shown as 0), Friday and Shabbat never do for observers, and each shop **streak shield** covers one missed day. Shields are used up (`streakShieldsBought` / `streakShieldsUsed`) and can be bought again. `totalActiveDays` counts every active day; old profiles' streak number (which never reset) became it, and their streak is rebuilt from the activity log.
- **Daily counters and claimed quests** belong to one local day (`getTodayCounters`): a tab left open past midnight shows zero and unclaimed quests.
- **Weekly calendar** (`DailyQuestsCard`): 🔥 only on days with a finished session (from the activity log), 🛡️ on protected days, 💤 on missed days.
- **Reward Shop (`RewardShopModal.tsx`)**: Spend diamonds on equippable avatar emojis, collectible stickers, and streak shields.
- **Replay rewards** (`data/missionRewards.ts`): a mission pays its full XP and diamonds the first time, when the stars improve, and once a day until it has 3 stars; other replays give 20% of the XP. A skipped voice step ("quiet place") is left out of the stars and earns no voice-word credit.

### 4.7. Interactive Vocabulary Vault (`VocabularyVaultModal.tsx`)
- Searchable directory of Israeli Ministry of Education curriculum words (with picture emojis for elementary vocabulary).
- Filters by grade and unit.
- One-tap audio pronunciation via the read-aloud service (4.20).
- Interactive microphone drill to test spoken pronunciation against target vocabulary words. Each word earns its reward once a day, for up to 20 words a day (`vaultPractice`, `VAULT_DAILY_REWARD_WORDS`).

### 4.8. Diagnostic Level Placement Test (`PlacementTest.tsx`, `placementTest.ts`)
- A 10-question adaptive test (מבחן רמה) that estimates the learner's English level and recommends a grade and proficiency tier.
- **Offered** once right after first-time onboarding (skippable), and on demand from the stats sheet (the avatar in the HUD, retakes allowed).
- **"Can you read English?" first (Feature 47)**: the test opens with `getReadGateCopy`, read aloud in Hebrew (the learner may not read Hebrew yet either). "עוד לא" skips the questions: `buildNonReaderResult` recommends grade 1 at the Explorer tier (`isNonReader: true`, the ±2 rule doesn't apply), and the first-test reward is the same.
- **Questions are generated from the curriculum**: each mission with a drill seed (not grade 1's letters and blending missions) yields a grammar-rule item (`drillSeed.rule`) and a vocabulary-meaning item (`vocabulary[0]` + `drillSeed.wrongWords`). Options are shuffled with the seeded shuffle and a per-attempt salt.
- **Adaptive staircase**: starts one grade below the school grade; a correct answer moves up and a wrong answer or "לא יודע/ת" moves down (±2 for the first 3 questions, then ±1), clamped to grades 1–12.
- **Estimate**: rounded mean mastery evidence of questions 5–10 (correct at grade g → g, wrong → g−1, correct at grade 12 → 13). A different grade is recommended only when the estimate is 2+ grades away. The tier is measured against the **recommended** grade (below → Explorer, equal → Challenger, above → Master), so a learner moved to an easier grade isn't also given the easiest tier.
- **School grade**: `schoolGradeId` (set at onboarding, kept when a test moves the practice `gradeId`) is the base of every test (`getSchoolGradeId`), so retakes don't drift.
- The result is stored as `placementResult` on the profile (merged across devices by latest `completedAt`). The first completed test grants +30 XP and +10 diamonds.

### 4.9. "Get Ready for an Exam" Study Plans (`examPrep.ts`, `components/examPrep/`)
- The learner picks an exam date (today to +21 days), the units of their grade, and the skills: Vocabulary, Grammar, Sentence building, Unseen reading.
- **Plan**: study days run from today to the day before the exam (Saturdays skipped for Shabbat observers). The (unit × skill) focus blocks are spread over the practice days (repeated when there are more days than blocks), a mixed review day is added once there are 3+ practice days, and the last study day is the **Mock Mini-Exam**. An exam today or tomorrow gives a 1-day crash course (mixed review + mock).
- **Questions** come from the grade's **exam question bank** (Feature 43, `data/examBank.ts`, `data/curriculum/examBank/grade<N>.ts`), written for exam prep only so no question repeats a mission, mini-lesson, placement test or contest. Each unit has 6 vocabulary items (new fill-in-the-blank sentences on the unit's own words), 6 grammar items, 6 sentences for the magnets and 2 reading passages with 3 questions each. The last 2 items of each list and the second passage are kept for the mock, so the mock is unseen. Tiers scale them like the missions (Explorer 2 options, Master no passage translation). The bank loads when a session opens (`useExamBank`, `EXAM_BANK_LOADERS`; given up after 3 s). A grade or unit without a bank, or a bank that fails to load, uses the old source: the step type matching the skill from each of the unit's missions. Every grade has a bank; the authoring rules are in `docs/feature-43-exam-bank.md`, and **a new grade goes in both `EXAM_BANK_LOADERS` and `examBank/index.ts`**. `examBank.test.ts` checks the counts, the blanks, the hints, gender neutrality and that no bank text repeats any mission, lesson or voice-message text. Render the clips after adding a bank (section 6).
- **Sessions**: for each focus unit, the skill's practice items, up to 8 per session, interleaved across the day's blocks. Voice drills are not used. Practice allows hints and retries and scores the first try; the mock (12 questions, balanced by skill) has no hints and locks each answer.
- **Rewards**: first completion of a day gives XP and diamonds and counts as a mission for the daily quests and streak (no mission stars); repeats give a little XP. A mock score of 70%+ grants the "Exam Ready" certificate and a one-time bonus.
- Stored as `examPrep` on the profile. Dismissing a plan sets `archivedAt` (fields are never removed, so a merge can't bring them back). Merge: different plans → newest `createdAt`; same plan → earliest completion and best score per day.
- Shared drill UI (`components/drills/`) renders the steps for both `MissionRunner` and `ExamSessionRunner`.
- `useDrillSession` (`hooks/useDrillSession.ts`, a tested pure reducer) holds the per-step state (step, answers, first-try miss, resolved, feedback, chosen option/tiles) for all four runners; the feedback type can carry extras (the mission's `xpGain`). `components/ui/Button.tsx` is the shared button (44px minimum, `sm`/`md`/`lg`); use it for text actions, and keep icon-only and toggle buttons as plain `<button>`s with `min-w-11 min-h-11`.

### 4.10. Star-Gated Boss Missions & Missions Counter (`milestones.ts`)
- **Boss gate**: a unit's Boss mission unlocks only when the unit's regular missions have earned 2 stars each (`BOSS_STARS_PER_REGULAR_MISSION`, i.e. 4 of 6). This is on top of the sequential rule (a mission opens once the previous one has a star), so the next unit also waits for the Boss. A Boss that already has stars always stays unlocked.
- **Suggestion**: `getSuggestedMission` returns the first mission without stars; when that is a gated Boss it suggests replaying the unit's weakest regular mission and returns the gate, so the dashboard hero and the mission map explain how many stars are missing.
- **Metrics**: stars (all grades, 1–3 per mission) measure mastery depth; the "Missions Completed" (משימות הושלמו) tile counts distinct missions with ≥1 star (`countCompletedMissions`). The words count on the XP tile (the one that opens the Vocabulary Vault) is the mastered-word count of the weekly report (`countMasteredWords` in `progressReport.ts`): the vocabulary of missions with 3 stars, across all grades, each word once. All three are derived from `missionProgress`, so no extra sync fields. `stats.missionsCompleted` (counts replays) and `stats.wordsMastered` (counts replays and Vault practice) are still stored but not shown.
- **Vault practice**: a word said in the Vocabulary Vault (`applyVocabPracticeReward` in `progressRewards.ts`) adds a voice word to today's counters (reset on a new day, like every activity) but is not a mission, so it doesn't extend the streak. It pays once per word per day (4.7).

### 4.11. School Word List Importer (`customWordLists.ts`, `components/wordLists/`)
- The "My Word Lists" (רשימות המילים שלי) home dock tile opens the lists card in a sheet, which lets the learner paste a word list from a school worksheet and practise it.
- **Parsing** (`parseWordListText`): one item per line; numbering and bullets are stripped; a Hebrew translation can come before or after the English, separated by a dash, `=`, `:` or a tab; comma lists of short words are split. Lines of 1–2 words are words, longer lines are sentences (max 15 words). Duplicates and lines without English are reported with a Hebrew reason. A word without a translation gets one from the curriculum vocabulary when it is there (📚).
- **Limits**: 3–30 items per list, up to 10 active lists.
- **Sessions** (`buildWordListSteps`): up to 5 items per session in three rounds: meaning match (words with a translation, options are other list words), magnets (letter tiles for words with spaces/punctuation kept fixed, word chips for sentences), then voice. Practice allows hints and retries and scores the first try; a skipped voice step ("quiet place") is left out of the score.
- **Rewards**: the full reward (15 XP, 2 💎, +3 💎 at 80%+) once per list per day, for up to 3 lists a day (`lastRewardedDateStr`); otherwise 3 XP. Every session counts as a mission for the daily quests and streak; voice-word and 3-star quest credit come only from rewarded sessions. There are no mission stars.
- Stored as `customWordLists` on the profile. Deleting a list sets `archivedAt` and empties its items (a small tombstone, so a merge can't bring it back). Merge: union by id; the same list keeps the best score and latest practice, and stays deleted once either device archived it.
- Voice recognition lives in `hooks/useSpeechRecognition.ts` and `drills/VoiceSpeakDrill.tsx`, shared with `MissionRunner`; letter magnets are `drills/SpellingMagnetDrill.tsx` (tap or drag, 4.23).

### 4.12. My English Room (`room.ts`, `wardrobe.ts`, `roomRewards.ts`, `roomActivities.ts`, `voiceMessages.ts`, `dreamJournal.ts`, `wordGames.ts`, `stickers.ts`, `components/room/`)
- The "החדר שלי" home dock tile opens the room full-screen; its dot shows while an earned item waits to be placed.
- **The room** (`RoomScene`): a drawn wall/floor scene, drawn furniture (`public/art/room/*.webp`: two shelves, the window sill, the desk and the sticker board, made with `scripts/art/renderRoomFurniture.mjs` and `scripts/art/process_room_furniture.py`; `FURNITURE_PIECES` in `roomLayout.ts`) and four mission objects: 🛏️ bed, 📱 phone, 🚪 wardrobe, 📖 Games Book. **Free placement** (`data/roomPlacement.ts`): items stand on *surfaces* (`ROOM_SURFACES`: wall-left/right, board, shelf-high, shelf-low, window-sill, desk-top, floor), each for one `slotKind`. A point is the item's feet (shelf, desk, floor) or centre (wall, board), in scene %. `snapToSurface` puts any point on the nearest surface of the item's kind, `findFreePoint` moves a drop off other items, floor items scale with depth (`getDepthScale`), and a soft shadow sits under standing items. **Moving**: drag with mouse or touch (`useRoomItemDrag`, 6 px threshold so a tap still taps; the surfaces show as dashed zones while dragging), or with the keyboard: focus an item or press "הזזה", arrows move, Up/Down or PageUp/PageDown change surface, Enter drops, Esc cancels, with a Hebrew live announcement. A new item is chosen in the inventory, a zone is tapped, and the item is named as before. Per-theme colours stay in `roomLayout.ts`. The equipped shop avatar walks to whatever the learner taps.
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
- Stored as `room` on the profile (`placements` key → item, `positions` key → point, `outfit` layer → item, `namedItemIds`, `dressUpDay`, `activityRewardDates`, `dreamJournal`, `gameBestScores`, `drawnStickers`, `backgroundStickerId`, `updatedAt`). Placement keys are old slot ids (a placement with no saved position sits at the slot's `LEGACY_SLOT_POINTS`, so old profiles need no migration) or the item id (written when an item is placed or moved; the old key is dropped). `saveProfileToFirestore` writes `room.placements` and `room.positions` as whole maps (a plain merge would bring removed keys back). Merge: the newer layout (placements and positions together) and outfit win; named items are unioned; the same day's dress-up progress keeps the highest counts and a given reward stays given; activity reward dates keep the later date per activity; dreams are unioned by id (newest 20); game best scores keep the higher score per game; drawn stickers are unioned by id and stay deleted once either device archived one.
- Every mission object now opens its activity; the per-item missions follow the draft designs in `backlog.md` (Feature 12) until a detailed breakdown replaces them.

### 4.13. Drill Hints (`utils/hints.ts`)
- **Rule**: a hint (`hintHe`, shown in a popover by the 💡 "רמז" button in the runner's header, only when tapped: `drills/HintPopover.tsx`) gives a way to work the answer out. It never names the answer or repeats text already on screen. Hints are worded gender-neutrally (`כדאי…`, `טיפ:`).
- **Generated hints** (pure helpers in `utils/hints.ts`, + `.test.ts`):
  - Step 1, vocabulary: Explorer and Master (English-word options) get the example sentence with the word blanked (`toClozeSentence`). When the word isn't in it, they get the letter count, plus the first letter when another option has the same length (`getWordShapeHintHe`). Challenger (Hebrew-meaning options) gets the English example sentence without its Hebrew translation.
  - Step 2, sentence builder: the word count and the last word, plus the first word for sentences of 5+ words (`getSentenceOrderHintHe`). The capitalised chip already shows the first word of short sentences.
  - Step 3, voice: a pronunciation tip for Hebrew speakers on the first tricky sound, checking content words first (`getPronunciationTipHe`: th, w, silent letters, `-ed`, `-ing`, silent e, ee).
  - Step 5, story: which sentence of the story holds the answer (`findAnswerSentenceNumber`). Challenger/Master also get the question in Hebrew.
- **Hand-written step-4 hints**: every mission's `drillSeed.rule.hintHe` (required, 144 in all) reminds the learner how to decide. It must not contain any word that is in the correct option but in none of the wrong ones. `missionHints.test.ts` checks every mission × tier for this and for repeated prompts.
- Word lists reuse the same helpers (meaning: word shape, magnets: `getSpellingHintHe` / sentence order, voice: pronunciation tip). The room naming panel's spell hint shows the first letter and the letter count, not the name.

### 4.14. Friends Hub & Daily Contests (`friends.ts`, `contests.ts`, `services/friendsService.ts`, `components/friends/`)
- The "👫 חברים" home dock tile opens the hub; its dot shows waiting friend requests and contest invites. It is only for signed-in, non-guest accounts (guests get no tile). The settings screen (`OnboardingView` in edit mode) has an on/off toggle (`friendsHub.isEnabled`). Without a stored choice it is on from age 13 and **off under 13** (`needsParentApproval`); turning it on for a younger learner needs a parent's checkbox (`parentApprovedAt`). When it is off, the tile is hidden, no listeners run, and the public summary, friend code entry and username entry are deleted.
- **Username search is opt-in** (`friendsHub.isUsernameSearchable`, off by default): usernames are easy to guess, so the `usernames/{slug}` entry exists only while it is on. The friend code always works.
- **Display names**: the only free text friends see is the first name; `toDisplayName` shows a name with a blocked word as "Learner".
- **Firestore** (all access rules in `firestore.rules`; client-only, no Cloud Functions):
  - `friendCodes/{CODE}` and `usernames/{slug}` → `{uid, displayName, avatarEmoji}`. They can be read one at a time (no listing). Each learner owns exactly one code, recorded in `friendCodeOwners/{uid}` in the same write; another device recovers it from there. A username can be claimed or changed only by the account whose sign-in email is `<slug>@peachnote.tutor.local` (`utils/username.ts`). A lookup returns both the code match and the username match, labelled, when both exist.
  - Every avatar field must be emoji only (no letters or digits). Timestamps are bounded strings.
  - `publicProfiles/{uid}` → display name, avatar, level, streak, stars, missions completed. Nothing else (no age, grade or email). Readable only by the owner and accepted friends. The numbers are capped at what the curriculum allows (stars ≤ 432, missions ≤ 144, level ≤ 1000, streak ≤ 3650; `PUBLIC_PROFILE_LIMITS`), in the rules and in `buildPublicProfile`. `useFriendPresence` (in `App.tsx`) claims the friend code and republishes the summary when it changes.
  - `friendships/{pairId}` (`getPairId`: sorted uids): a pending request with both names and avatars. The requester's name and avatar must match their own public profile. The addressee accepts. Either side deletes it to cancel, decline or remove. Each friend may set only their own preset reaction (`FRIEND_REACTIONS`, also listed in the rules). There is no chat and no free text besides the first name.
  - `friendRequestCounts/{uid}` → `{dateStr, count}`: at most 10 requests a day. Every new request must raise it by one in the same write (`sendFriendRequest` uses a batch); it only goes up (or restarts at 1 on a later day) and can't be deleted.
  - `contests/{pairId}_{dateStr}`: one contest per pair per day, ending at the creator's local midnight (`expiresAtMs`). The rules accept only a date within a day of the server date, an expiry at most 25 hours away, and players who are still friends. The invitee accepts or declines. Each player writes their own result once, before midnight, with at least 5 questions and at least 3 seconds. Listed with the `uids` + `dateStr` composite index (`firestore.indexes.json`).
- **Adding friends**: by friend code (6 characters, no 0/O/1/I/L) or username. An invite link `/?invite=CODE` (`usePendingInvite`) is kept through sign-in and opens the hub with the code. Sharing uses `navigator.share`, with a WhatsApp link and copy as the fallback. Limits: 30 friends and 10 outgoing requests (`checkFriendRequest`).
- **Contests** (`buildContestSteps`): each player gets questions from their *own* grade, at the same relative difficulty. That means the same unit number (seeded 1–4), the Challenger tier for both, and the same layout: 5 meaning matches (1 + 3 distractor translations from the grade) and the sentence magnet of each of the unit's 3 missions. Everything is seeded by the contest. `ContestRunner` has no hints, one try per question and a timer. Leaving after the first answer ends the contest with the answers so far. The result screen opens while the result saves. Offline saves time out after 10 seconds with a message.
- **Deciding a contest** (`getContestState`): the higher score percentage wins, and the faster time breaks a tie. A contest is decided once both played, or at midnight or a decline when only one did (`friend-missed`). A result finished after midnight is ignored. A contest is recorded only after the server confirms it (`hasPendingWrites`). Contests are found by the viewer's local date, which assumes friends share a time zone.
- **Rewards**: finishing gives +10 XP and counts as a mission for the daily quests and streak, for the first 3 contests a day (then +2 XP). A decided contest is recorded once in `friendsHub.contestHistory` (the last 30 days, sized so no record in the 7-day lookback is ever dropped). The history also feeds the record vs. each friend. A win or tie gives 10 💎; a loss, or a friend who never played, gives 3 💎. Diamonds are paid for at most 3 contests per contest day.
- Merge (`mergeFriendsHub`): the newer toggle wins, the earlier-claimed friend code is kept, contest records are unioned by contest id (newest first, `MAX_CONTEST_HISTORY`), and the same day's finish count keeps the higher value.

### 4.15. Parent / Teacher Weekly Progress Report (`activityLog.ts`, `progressReport.ts`, `components/progressReport/`)
- The "📊 דוח להורים" home dock tile opens the full report (this week first, Sunday–Saturday). It works for every account, on the learner's own device.
- **Activity log** (`activityLog.ts`): `profile.activityLog` keeps one entry per local day for the last 12 weeks (`ACTIVITY_LOG_DAYS = 84`): sessions (anything that counts as a mission for the quests and streak), voice words, 3-star sessions, XP earned, stars gained, the missions that gained stars (`missionStars`) and the missions that got their first star (`firstCompletedIds`).
  - It is recorded in one place: `App.tsx` `handleUpdateProfile` calls `recordActivityLog(prev, next, now)`, which diffs the profile before and after each local update (XP, mission stars, `dailyCounters`; drops are ignored). Reward code doesn't need to report activity.
  - Cloud snapshots are merged with `mergeActivityLog`, never diffed, so nothing is counted twice. Merge: union by date; the same day keeps the higher value of each counter and the higher stars per mission. A day played on two devices therefore shows the busier device, not the sum, so weekly totals can be a little lower than the real activity.
  - The log only starts when this feature ships; the report says from which date it counts.
- **Report** (`progressReport.ts`, pure, + `.test.ts`): `buildWeeklyReport(profile, weekStart, todayStr)` gives the week's day statuses (active = a finished session or words said aloud; XP alone, e.g. a quest claim, doesn't count / missed / Shabbat-shielded for observers / future), totals, new missions completed and the words of missions that reached 3 stars that week. The overall part has level, streak, missions completed, a star mastery rating (average stars per completed mission, and stars of the current grade) and the mastered word count. A mission's words count as mastered at 3 stars (`MASTERED_WORD_MIN_STARS`), de-duplicated across grades. `getAvailableWeeks` goes back to the log's first week, at most 12 weeks.
- **Screen** (`WeeklyReportScreen`): week arrows, the week strip and tiles, overall progress, this week's new words (tap to hear), and sharing. `buildWeeklyReportTextHe` writes a Hebrew text summary about the learner in the third person (gendered), listing up to 10 new words; `ShareTextActions` sends it with the native share sheet, or a WhatsApp link, plus copy. The friend invite panel uses the same component.

### 4.16. Reward Feedback Kit (`utils/rewardFeedback.ts`, `utils/celebrate.ts`, `utils/sfx.ts`, `components/victory/`, `components/hud/`)
- Phase 1 of the Feature 22 redesign. Presentation only: rewards, XP, levels and sync are unchanged.
- **Staged victory** (`MissionVictory`, used by `MissionRunner`): over about 4 seconds the three star slots land one by one (a missed star lands grey), the XP bar fills from the learner's XP before the mission toward the next level and shows a "רמה חדשה!" badge when a level is crossed, the XP / diamonds / words count up, and the 3-star room item flips in last (its space is kept so nothing jumps). A tap anywhere skips to the end. Everything on screen is derived from one clock (`useAnimationClock`) through the pure `getVictoryFrame(input, elapsedMs)`; `VICTORY_TIMING` holds the schedule. `MissionRunner` takes `startXp` / `startLevel` from the dashboard for the bar.
- **Header**: the level ring around the avatar shows the XP toward the next level (`getLevelProgress`: a stored level ahead of the XP shows an empty ring; see 4.19), the diamond counters count up when they change (`useCountUp`), and a 🔊 / 🔇 button mutes the sound effects.
- **Sound effects** (`sfx.ts`): 8 short CC0 Kenney sounds in `public/sfx/` (`tap`, `correct`, `wrong`, `star`, `star-miss`, `coins`, `level-up`, `celebrate`; sources in `public/sfx/CREDITS.md`, swap a sound by replacing its file). Nothing plays before the first tap or key press. The mute setting is saved on the device (`english_tutor_sfx_muted`, not synced). Browsers without Ogg Vorbis (older than iOS Safari 17.4) stay silent. Every `FeedbackBanner` (and the mission runner's `FeedbackSheet`) plays the correct / wrong sound, so all drill runners get it; word chips and letter magnets play `tap`.
- **Celebrations** (`celebrate(size)`): the one place that fires confetti. `small` (quest claim, purchase, vault word, item placed, drawing saved) plays `coins`; `medium` (room activity rewards) and `big` (exam session, certificate, word list session, mission victory) play `celebrate`; `{ isSilent: true }` skips the sound.
- **Reduced motion** (`utils/motion.ts`, `usePrefersReducedMotion`): no confetti, the victory starts at its final state (one cheer instead of the staged sounds), counters jump, and a global CSS rule in `index.css` stops animations and transitions.
- **Icons**: the star, gem, flame and trophy counters (`HudIcon`, props `name`, `className`, `isGreyed`) use the drawn icons `room-star`, `ui-gem`, `ui-flame`, `room-trophy` from `public/art/icons/`, on the victory screen, the stat tiles of the stats sheet and the HUD streak and diamond counters. (The Fluent Emoji set they replaced is gone.)
- **Catalog icons** (`components/art/iconArt.ts`, `EmojiIcon`): the room objects and items, drawn stickers' decor, shop avatars, wardrobe items and the home dock tiles show a drawn icon (`/art/icons/<id>.webp`, 256px, and `@128`) instead of the platform emoji. The data keeps its `emoji` field; `ICON_ID_BY_EMOJI` maps it (variation selectors stripped) to an icon id and `getIconSrc(emoji, sizePx, dpr)` picks the file. `EmojiIcon` (props `emoji`, `size` as a CSS length) renders it through `ArtImage`, so an emoji with no icon, or a missing file, shows the plain emoji at the same size. Used by `ItemIcon`, `DockTile`, the room scene objects, the wardrobe panel, the shop cards and the room reward toast; `DressedAvatar` (head and outfit pieces, positioned in em of the avatar size: head accessories at `top: -0.38em`), and the avatar chips of the home HUD, stats sheet and room screen use it too. **Text is swapped everywhere by the JSX runtime** (`src/emojiJsx/`, `jsxImportSource: 'emoji-jsx'` in `tsconfig.json`, `vite.config.ts` and `vitest.config.ts`): a thin wrapper around React's own runtime that, for DOM elements (not `option`, `textarea`, `title`, `input`, `style`, `script`), replaces every emoji that has a drawn icon in string children with an inline `EmojiIcon` (1.2em). So any `<p>`, button label, heading or list item shows drawn icons with no change to the component, and a new icon in `ICON_ID_BY_EMOJI` lights up app-wide. Not covered: attributes (`aria-label`, `title`), strings that never reach a DOM child, and emoji with no icon (they stay text). An element with `data-raw-emoji` keeps its text (EmojiIcon's own fallback uses it). Plain symbols such as ✓ ➡ ⚪ ⏹ ✏ stay text. **A new catalog item needs a new icon**: `iconArt.test.ts` fails for a catalog emoji without one. To make icons: add them to `scripts/art/iconList.json`, `node scripts/art/renderIconBatch.mjs submit` / `status` / `collect` (nine icons per 3 × 3 sheet, about a ninth of the cost; `pilot` draws only the first sheet), `python scripts/art/slice_icon_sheets.py` (cuts `art-src/icon-sheets/` into `art-src/icons/`, warns when an icon touches a cell border), then `python scripts/process_art.py icons` (transparent cut-outs; `OPEN_SHAPE_ICONS` also clears the white inside a loop). Every entry names its `sheet` (nine per sheet, in list order; never move an icon to another sheet once drawn). Then add the emoji to `ICON_ID_BY_EMOJI`.

### 4.17. Companions, Art Manifest & a Mission Runner That Reacts (`themes/themeArt.ts`, `utils/artStatus.ts`, `components/art/`, `components/companion/`, `components/mission/`, `utils/missionFeedback.ts`, `scripts/process_art.py`)
- Phase 2 of the Feature 22 redesign (Feature 25). Presentation only: scoring, hints, rewards and sync are unchanged.
- **Art manifest** (`themeArt.ts`, the `art` block of every `ThemeDefinition`). All generated art is WebP under `public/art/`:
  - Per theme, `/art/<theme>/`: `companion-<pose>.webp` (512px) and `companion-<pose>@256.webp` for the five poses `idle`, `cheer`, `think`, `oops`, `wave`, plus `map-bg.webp` (Feature 26), `home-scene.webp` (Feature 27) and `room-bg.webp`.
  - Shared: `/art/common/` (`chest-closed`, `chest-open`, `boss-locked`, `boss-open`, `level-badge`, 512px + `@256`, via `getCommonArt`), `/art/landmarks/g<grade>-u<unit>.webp` (+ `@256`, `getUnitLandmarkArt`; `<unit>` is the unit number in the mission ids, so grade 1's letters units are `g1-u11`…`g1-u16`) and `/art/stories/<missionId>.webp` (`getStoryArt`).
  - `pickCutoutSrc` uses the 256px file when it is sharp enough for the size shown (size × device pixel ratio ≤ 256).
  - Committed: the five poses of all three companions (Mochi, DJ Lexi, Nova), `map-bg` and `home-scene` for every theme, all five `common` pictures and the 48 landmarks. `room-bg` for every theme (drawn behind the room scene's furniture outlines, replacing the drawn wall, floor and window) and the 36 story pictures of grades 1–3. Not generated yet: the story pictures of grades 4–12. A missing file falls back, and lights up as soon as it is added: no code change needed.
- **Fallback** (`artStatus.ts`, `useArtStatus`, `ArtImage`): every picture is probed once with `new Image()` and cached for the visit as `loading` / `loaded` / `missing` (a missing file that comes back as the app's HTML page fails to decode, so it is `missing` too). `ArtImage` keeps its box size: empty while loading, the picture when loaded, the caller's fallback when missing. No broken-image icon, no layout jump.
- **Companion** (`Companion`, props `theme`, `pose`, `size`): CSS motion per pose (idle/wave bob, cheer hops with a squash, oops wiggles, think sways), a soft CSS ground shadow, and no motion with reduced motion. Without art it shows the theme's avatar emoji in a soft white bubble of the same size. A theme can set `art.companionRim`, a CSS filter drawn around the art only (not the fallback): Starlight uses `LIGHT_COMPANION_RIM`, a soft white edge and cyan glow, so dark-navy Nova stays visible on the midnight background. It is always `position: relative`; wrap it to place it. `preloadCompanion(theme, poses, size)` loads poses before they are shown: the dashboard preloads the idle pose, the mission runner preloads every pose it uses.
- **Mission runner**:
  - Intro screen (`MissionIntro`): the companion waves, the mission title, story hook and length, the three tiers as chunky cards, and a gendered start button. The tier switcher left the step header.
  - Trail progress (`TrailProgress`, `getTrailSegments`): one segment per step, green once answered, the open step amber, right to left. The combo is a Fluent flame that appears at 2x and grows at 3x and 5x (`getComboFlameLevel`); reaching 3x or 5x fires a silent small `celebrate`.
  - Chunky answer buttons (`MultipleChoiceOptions`, shared by every runner): a pressed edge (`.btn-chunky` in `index.css`), the answer text only (direction from the text, so Hebrew meanings sit on the right) and a ✓ / ✗ badge with Hebrew screen-reader text. The picked right answer bounces and a wrong one shakes.
  - Feedback sheet (`drills/FeedbackSheet`, mission runner only; the other runners keep `FeedbackBanner`): slides up from the bottom with the companion's cheer or oops pose on its edge, plays the right / wrong sound, and floats "+XP" for a right answer. The float is the answer's share of the mission XP (`getStepXpGain`: the tier-scaled base XP spread so the shares add up exactly, plus `COMBO_BONUS_XP_PER_STEP` when the best streak grows), so the floats add up to the victory screen's XP. After a wrong answer, a gendered "try again" button closes the sheet. The sheet is rendered outside the blurred overlay (a `backdrop-filter` ancestor would make `position: fixed` scroll with the drill), and focus moves to its button without scrolling.
  - The companion peeks over the question card's corner (`getPeekCompanionPose`): `think` while the hint is open, `idle` otherwise, and it ducks out of sight while the feedback sheet shows its own companion.
  - Story step: `/art/stories/<missionId>.webp` above the passage when it exists (preloaded at the mission start), nothing otherwise.
  - Victory (`MissionVictory`): the companion's cheer pose holds up the trophy. A level-up pins the level badge (`hud/LevelBadge`: `level-badge` art with the level number drawn on its blank centre, a plain gold-rimmed circle without the art) to the XP bar's corner; the stats sheet shows the same badge beside the level line.
- **Art pipeline** (`scripts/process_art.py`, needs Pillow and numpy): reads `art-src/` (gitignored originals; `.jpg`, `.jpeg`, `.png` or `.webp`) and writes `public/art/`. Cut-outs drawn on a white background (companion poses, `art-src/common/*`, `art-src/landmarks/*`) lose the background and the drawn ground shadow by a flood fill from the edges and become transparent bottom-centred squares at 512 and 256px; the five poses of a theme are scaled to the same height so they swap in place. Full-frame pictures are only resized, never enlarged: `map-bg` 1080px wide, `home-scene` 1200, `room-bg` 1600, `art-src/stories/*` 960. Missing files are skipped, and the script lists what it wrote and skipped. `python scripts/process_art.py [theme|common|landmarks|stories ...] [--src DIR] [--out DIR]`; `scripts/cutout_companion.py [theme]` still processes one theme's poses.

### 4.18. World Map (`data/worldMap.ts`, `components/MissionMap.tsx`, `components/worldMap/`)
- Phase 3 of the Feature 22 redesign (Feature 26). `MissionMap` (still embedded by the dashboard, same props) is an illustrated map of the learner's grade. Unlocks, the Boss gate and rewards are unchanged: every stop's state comes from `milestones.ts`.
- **Layout** (`buildWorldMap`, pure, + `.test.ts`): all lengths are in map widths, so the map scales with the screen. Each unit is one region drawn on one copy of the theme's map background (`art.mapBg`, 1080 × 1935, `MAP_BG_ASPECT`, about one phone screen). The copies don't tile, so each unit's banner (`UnitBanner`: badge, `יחידה N`, Hebrew and English titles, the unit's stars) is centred on the join above its region (`MAP_BANNER_HEIGHT`; half a banner of space above the first region). The stops sit at equal distances along the path between the banner above and the one below (`getStopPositions`), and the landmark goes between the first two stops on the side away from the path (`getLandmarkPlacement`).
- **Path** (`MapPathLayer`): one SVG over the backgrounds in the same coordinates as the stops. It follows `art.mapPath.centerline`, points traced on each theme's background along its empty winding band (`MAP_PATH_BY_THEME` in `themeArt.ts`; trace again if a background is replaced), smoothed with Catmull-Rom (`sampleCenterline`). The colours are in the same manifest: a sandy road on PeachNote's grass; a light path with a cyan glow on the near-black VibeLingua band and the deep-navy Starlight band. The walked part (top to the current mission) is drawn in the trail colour.
- **Stops** (`MapStops`): coins, gold with 1–3 stars when done, the theme colour when open, grey with a lock when locked. The suggested mission (`getSuggestedMission`, so a gated Boss sends the companion to the weakest regular mission) pulses and has the companion (idle pose) standing on it. The Boss is a castle (`/art/common/boss-locked.webp` / `boss-open.webp`, fallback a 🏰 tile) with the stars toward its gate (`👑 3/4 ⭐`); when the gate is met it opens with an animation once per device (`castleMemory.ts`, `english_tutor_opened_castles_v1`, not synced). Landmarks (`/art/landmarks/g<grade>-u<unit>.webp`, grade read from the mission ids) show the unit's badge emoji in a bubble until the file exists.
- **Mission sheet** (`MissionSheet`, rendered into `<body>`): tapping any stop opens a bottom sheet with the full title (no truncation), story hook, length and topic, stars, the rewards for the chosen tier, the tier choice (`mission/TierChoice`, shared with `MissionIntro`), the tier's focus and sample sentence, the words (tap to hear) and Start / Play again. A locked stop says why (the missing Boss stars, or the mission to finish first) and has no Start. Escape or the backdrop closes it.
- The map is a scroll window (`min(76vh, 760px)`, centred, at most 520px wide on desktop) so the dashboard around it still scrolls; it scrolls to the current mission when it opens, on a grade change and when the next mission moves, and the "למשימה הבאה" button scrolls back. Per-theme banner, coin and sheet styles are in `worldMap/worldMapStyles.ts`. With reduced motion there is no pulse, the castle is simply open and the sheet doesn't slide.

### 4.20. Read-Aloud Voice (`services/tts/`, `api/tts.ts`, `scripts/tts/`, `utils/ttsVoice.ts`)
- Features 23 and 28. All English read-aloud goes through `getTtsService().speak(text, { rate, voice })` (called by `speakEnglish` in `DashboardView` and the settings voice preview), which implements `TextToSpeechService` (`speak` / `stop` / `isReady`). Each new `speak` stops the last one. The evaluation and decision are in `docs/tts-evaluation.md`.
- **Stopping** (Feature 41, `speechStatus.ts`, `hooks/useSpeech.ts`): the service also knows what it is reading (`getCurrent()`: the text and rate, from the tap until it ends or is stopped). Every 🔊 button reads through `useSpeechToggle` (or `useCurrentSpeech` + `toggleSpeech` in a list): while its own text and rate are being read it shows a stop square (`SpeakIcon`, "עצירת ההקראה") and a tap stops it. Auto-reads (questions, word chips, answers) stay plain `speak` calls. Reading stops when the screen that started it closes (`useStopSpeechOnLeave`: the four drill runners, the room and its panels, the Vault, the report, the map's mission sheet, the voice lab) and when the app goes to the background (`visibilitychange`). **A new 🔊 button or screen that reads aloud uses these too.**
- **Three tiers** (`hybridTtsService.ts`, + `.test.ts`):
  1. **Rendered clip.** An Azure Neural MP3 in `public/tts/v<N>/<voice>/<key>.mp3`, listed in `public/tts/manifest.json`. Only the default female voice is rendered, to keep git small.
  2. **Online voice.** `/api/tts?a=&v=&s=&t=` (Vercel Function, `api/tts.ts`) for any other plain English text up to 200 characters: word lists, sticker names, dreams, the male voice.
     - Only the canonical query from `buildLiveTtsQuery` is accepted, so extra parameters can't bust the CDN cache.
     - The CDN caches answers for a year (`s-maxage`), and the page keeps the newest 300 in CacheStorage `englishvibe-tts-live-v1`.
     - A 429 or 503 pauses it for 10 minutes; it has 3 s to answer.
     - **Signed-in learners only.** The app sends its Firebase ID token in `X-Firebase-Token` (`TTS_TOKEN_HEADER`); the function verifies it with Web Crypto against Google's securetoken keys (`api/_lib/firebaseToken.ts`, no Admin SDK) before calling Azure, and answers 401 (never cached) otherwise. Answers already in the CDN cache never reach the function, and the cache key ignores the header. `FIREBASE_PROJECT_ID` overrides the project (default `english-tutor-il-7`); `TTS_AUTH=off` turns the check off, which the dev server does (emulator tokens aren't signed). **App Check:** the app also sends its Firebase App Check token (reCAPTCHA Enterprise, started in `services/firebase.ts` when `VITE_APPCHECK_SITE_KEY` is set; off for emulators) in `X-Firebase-AppCheck` (`APP_CHECK_HEADER`); with `APPCHECK_ENFORCE=on` the function verifies it (`api/_lib/appCheckToken.ts`, project number from `FIREBASE_PROJECT_NUMBER`, default `1003230297590`) and answers 401 otherwise. Leave it off until the Firebase console shows the web app sending valid tokens, then enforce App Check for Firestore there too. Local `npm run dev` uses a debug token (printed in the console, registered in the console).
  3. **Device voice.** `speakWithVoice` in `ttsVoice.ts`: `pickVoice` chooses the best English device voice of the learner's `voicePreference`. Voices load asynchronously, so `watchVoices()` (in `main.tsx`) caches them.
- **Clip keys** (`ttsText.ts`, shared by the app, the proxy and the scripts): `getClipKey(text, speed)` hashes the clip text (`getClipText`: a single word is lowercased without edge punctuation, so a word chip and a vocabulary word share a clip). A rate of 0.8 or below is `slow`. Only single words have slow clips; a slow sentence plays the normal clip with `playbackRate`.
- **Rendering** (needs `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` in `.env.local`, server only, no `VITE_`):
  - `npm run tts:corpus`: the size of the corpus.
  - `npm run tts:render -- [--voice female|male] [--limit N]`: renders missing clips and rewrites the manifest; it resumes where it stopped.
  - `npm run tts:check`: phrases without a clip.
  - `scripts/tts/corpus.ts` builds the corpus from the real generators: every mission × tier step, vocabulary, room and wardrobe names, voice messages, dream words and the demo phrases. **Add new fixed spoken text there and re-render after curriculum changes.** In dev builds, text read without a clip is collected in `window.__ttsMisses`.
- Voices and SSML (Jenny / Guy, prosody, a 200 ms leading break) live only in `api/_lib/azureTts.ts`. **Changing them means bumping `TTS_AUDIO_VERSION` in `ttsText.ts` and re-rendering.** The new clip folder and query make every cache (browser, service worker, CDN) fetch the new sound. `api/` imports use `.js` extensions, because the package is ESM.
- **Playback** (`audioUnlock.ts`): one shared `<audio>` element, unlocked with a moment of silence on `touchend` / `click` / `keydown`. A touch `pointerdown` doesn't count on iOS. The unlock retries on each gesture until a sound has played. A system pause (a call) ends the current `speak`, and a manifest that fails to load is tried again on the next one. Clips are fetched into object URLs, because Safari won't play media a service worker answers without byte ranges. `public/sw.js` serves `/tts/*.mp3` cache-first (`englishvibe-tts-v1`), skips `/api/`, and keeps `englishvibe-tts-*` caches.
- **Dev server:** a plugin in `vite.config.ts` serves `/api/tts` with the `.env.local` key. **Production** (https://english-tutor-nine-ebon.vercel.app/, Vercel project `english-tutor`, scope `clear-shield`):
  - `AZURE_SPEECH_REGION` (`germanywestcentral`, Frankfurt) and the sensitive `AZURE_SPEECH_KEY` are project environment variables (Production + Preview).
  - The Firewall rule "Rate limit online voice" allows 100 requests a minute per IP on `/api/tts`. The app answers its 429 by pausing the online voice.
  - `vercel.json` pins functions to `fra1` (Frankfurt), the same city as the Azure Speech resource.
- **Hebrew voice (Feature 47)**: `speak(text, { lang: 'he' })` reads Hebrew with the `he-female` clip voice, whatever the English voice choice is. **The clips are rendered with Gemini** (`scripts/tts/geminiTts.ts`: `gemini-3.8-flash-lite-tts`, voice Kira, no language setting (`he-IL` gave pure Hebrew an English accent), 24 kHz WAV encoded to the same 48 kbps MP3 with `@breezystack/lamejs`), chosen by ear (2026-10) because it reads unvoweled Hebrew by context where Azure misread it. It gets **only the text**: an instruction in it is read aloud, and naming the listener doesn't change the forms. `toGeminiText` (`scripts/tts/geminiSpelling.ts`) gives a girl's clip the girl's form of a word that reads by gender in niqqud (`בָּנִית`, `קָרָאתְ` with its closing sheva; boys get the plain word, Gemini's default) and spells out the few words it misreads (`GEMINI_SPELLINGS`: וּבִחְרִי, הַקְשֵׁב; add one only after hearing it wrong). Interactive requests are capped at 100 a day, so the clips are rendered through the **batch API** (`npm run tts:render:he -- submit`, then `status` / `collect`; `scripts/tts/renderGeminiBatch.ts`, batches of 300, usually done in minutes, half price: the full Hebrew set is under $1). Gemini differs a little each take (now and then an English accent, or a letter name said oddly), so a clip that comes out wrong is re-rendered alone: `npm run tts:render:he -- redo "<part of the line>"`, then `submit` and `collect`. Hebrew next to English words keeps a slight English accent. The **online Hebrew voice** (`/api/tts`, for text with no clip) is still Azure `en-US-AvaMultilingualNeural` speaking `he-IL`: `buildSsml` splits the text into Hebrew and English runs (`splitLangRuns`) with `<lang>` tags, so "cat" inside an instruction is native English. Clips live in `public/tts/v<N>/he-female/` (the manifest lists them under `he-female`); the Hebrew corpus is `scripts/tts/hebrewCorpus.ts`: every Hebrew instruction, hint, explanation and Hebrew option of grades 1–2 (missions, lessons, exam banks, both genders, every tier), the fixed runner feedback (`data/missionFeedbackHe.ts`) and the placement gate. Other Hebrew (the learner's name, a speech transcript, older grades) goes to `/api/tts` with `v=he-female` (`isHebrewSpeakable`), and the device voice only if it has a Hebrew voice (`pickHebrewVoice`), otherwise nothing. Bidi isolates (`isolateLtr`, `isolateEnglishRuns`) are stripped before speaking, so they never change a clip key.
  - **Where it plays**: a 🔊 (`drills/HebrewSpeakButton`, `InstructionLine`) beside every step instruction, in the 💡 hint, the feedback sheet and banner, Hebrew question cards and the mini-lesson. For grades 1–2 (`playsHebrewAloud`) the instruction plays by itself when a step opens, followed by the English question (`speakSequence`, which another reading or a stop cancels); the hint plays when it opens; and an answer's English (the option, the built sentence) is followed by its Hebrew feedback. Every answer option has its own 🔊 that only listens (`drills/OptionSpeakButton`): English options in the learner's voice (a lone letter by its name), Hebrew meanings in the Hebrew voice.
  - **Azure pronunciation list** (`api/_lib/hebrewPronunciation.ts`, used by the online Hebrew voice since the clips moved to Gemini): without niqqud Azure misreads some words (הקשב as *hakashev*, שם as *sham*), so `buildSsml` spells those out in IPA (`<phoneme>`). Only the audio changes; the screen text and clip keys stay the same. Each entry is a word, or a phrase with the word in [brackets] when its neighbors decide the reading (`יש [שם]` *shem*, `אני [שם]` *sam*). Every spelling splits its syllables with dots and marks the stress (`na.ˈse`); without the dots Azure stresses the syllable before the mark. Full niqqud and IPA on every word both sounded worse. Checked by ear word by word (2026-10); a new entry needs the same check. ב-/ל- before English get a short pause, and the 🔊 in an instruction is said as "כפתור הרמקול" (`toSpeakableText`), so the voice never guesses a word for it. **Words said to the learner that read by gender** (`LISTENER_GENDERED_WORDS` in `ttsText.ts`: בנית *banit*/*banita*, שמעת, קראת, סיימת, דילגת, אותך, שלך) are written the same for both, so a line with one, or with a boy/girl pair (`משחק/ת`, said in the learner's form by `resolveGenderSlashes`), gets a girl and a boy clip: the app sets the learner's gender once (`setListenerGender`, from `App`), `speak` (`voiceForListener`, `hebrewListener.ts`) tags such a line `[to:girl] …` / `[to:boy] …` (`addListenerGender`), the corpus renders both tags, and `buildSsml` reads the tag and spells the word in that form (`LISTENER_GENDERED_PRONUNCIATIONS`). The device voice gets the untagged text. A new such word goes in both lists. Changing the list means bumping `HEBREW_AUDIO_VERSION` (`ttsText.ts`, the Hebrew voice's own version, so English clips stay) and re-rendering the Hebrew voice.
- **Letter names**: `[letter:b]` (`letterToken`) is a clip rendered with `<say-as interpret-as="characters">`, so a lone "a" isn't read as the article; the online and device voices get the capital letter (`toPlainSpeech`).
- **Settings:** the voice choice and its preview (`components/settings/VoiceLabCard.tsx`: one "🔊 שמעו דוגמה" button with a rendered sample sentence, plus a field to hear any typed text) are in the settings screen (`OnboardingView` in edit mode). The choice is stored as `voicePreference` on the profile; a missing value means female. Merge: same rule as `themeId`.

### 4.19. Home Base Dashboard (`DashboardView.tsx`, `components/home/`, `data/homeBase.ts`, `utils/bidi.ts`)
- Phase 4 of the Feature 22 redesign (Feature 27). The home screen has one focus, top to bottom: HUD, hero with one Play button, quest rings, dock, map peek, then the world map (`MissionMap`, 4.18). The bottom nav stays on phones.
- **HUD** (`HomeHud`), one row: the avatar inside a ring of the XP toward the next level with the level number under it (`ProgressRing`, `getLevelProgress`) opens the **stats sheet**; the 🔥 streak opens the daily quests sheet; the 💎 count (count-up) opens the shop; then the ❓ app tour (4.25), the sound toggle and the cloud sync button (shown only on a sync problem or for an unsaved guest; logout is in the profile settings, `AccountPrivacyCard`). Desktop adds the vault, shop and settings buttons.
- **Stats sheet** (`StatsSheet`): level, the five stat tiles that left the home screen (streak, stars, missions completed, diamonds → shop, XP and mastered words → Vocabulary Vault), the grade selector, the Shabbat shield and the placement test link, plus profile settings.
- **Hero** (`HomeHero`): the theme's `art.homeScene` (16:9, `object-fit: cover`; on phones it keeps the left side, where the building is), with the hero card gradient as the fallback. The companion waves on the right with a speech bubble (`getHomeGreetingHe`: by name and gender; first adventure / Boss stars missing / mission done today / ready). Today's mission card shows the tier-scaled XP and 💎, the Hebrew and English titles, the Boss-gate replay line (`getSuggestedMission`), and one big Play button (`getPlayLabelHe`: "בואי נשחק!" or "שפרי כוכבים" for the replay). The tier is chosen on the mission intro (4.17).
- **Quest rings** (`QuestRings`, `getQuestRings`): the three daily quests as small rings (pink in progress, amber pulsing when the reward waits, green when claimed). A tap opens the full `DailyQuestsCard` (quests and Shabbat-safe streak week) in a sheet.
- **Dock** (`DockTile`): each hub renders its own tile and keeps its overlays. 🏠 Room (dot: an unplaced item; the dashboard owns its open state so the new-item toast opens it), 📅 Exam prep (sheet with `ExamPrepCard`; dot: a study session waits today), 📝 Word lists (sheet with `WordListsCard`), 👫 Friends (only when the hub is on and the account is not a guest; dot: requests or contest invites), 📊 Report (opens `WeeklyReportScreen`). Sheets reuse `ExamModalShell`.
- **Map peek** (`MapPeek`, `getMapPeek`): the current unit (first one with a mission without stars), the grade's missions and stars; a tap scrolls to the map.
- **First launch** (`App.tsx`, `getFirstLaunchSteps`): one sequence instead of two modals. `FirstLaunchGreeting` (once per profile, `hasSeenWelcomeGiftModal`): the companion says hello and hands over the welcome chest (`/art/common/chest-closed.webp` → `chest-open.webp`, emoji fallbacks); a tap opens it with a big celebration and counts up the 50 welcome gems. Then the app tour (4.25), and, right after first-time onboarding, the placement test offer. The old welcome modal is gone.
- **Right-to-left**: `index.html` is `<html lang="he" dir="rtl">`, so per-element `dir="rtl"` was removed (it stays only inside English `dir="ltr"` blocks). English text is marked `dir="ltr"` (blocks, word chips, letter grids, inputs), `dir="auto"` (answer options, mixed search) or `<bdi>` (English inside Hebrew lines, e.g. the login title). Plain strings use `isolateLtr` / `formatGainLtr` (`utils/bidi.ts`), so "+10 XP" doesn't show as "XP 10+".
- **Text size**: nothing is smaller than 12px (`text-xs`); `text-[10px]` and `text-[11px]` are gone.
- Reduced motion: no chest wobble or confetti, the gems show at once, the companion stands still.

### 4.21. Privacy, Accounts & Child Safety (`components/privacy/`, `components/settings/AccountPrivacyCard.tsx`, `services/accountService.ts`)
- **Privacy notice** (`PrivacyNoticeDialog`, Hebrew): what is stored and where, what friends see, what isn't done, and the parents' rights. Linked from the sign-in screen, the settings and onboarding. The contact address is `PRIVACY_CONTACT_EMAIL` (`config/appInfo.ts`).
- **Parental consent**: onboarding a learner under 13 needs a parent's checkbox (`parentalConsentAt`, the first one kept on merge).
- **Settings → פרטיות וחשבון**: download all data as JSON (`downloadProfileJson`), and **delete the account** (`deleteAccount`): the confirm word "מחיקה" plus the PIN (or Google again) first, then the profile, public profile, friend code and its owner record, username, every friendship and contest of the learner, and the sign-in itself. Only the daily friend-request counter stays (no personal data; it can't be deleted, or the limit could be reset).
- **Guests** (anonymous sign-in) can keep their progress by adding Google or a username + PIN to the same account (`saveGuestWithGoogle` / `saveGuestWithUsername`, same uid). A guest is warned before signing out, because a guest account can't be signed into again.
- Children's safety in the Friends Hub: 4.14.

### 4.22. App Shell, Accessibility & Security Headers
- **Error boundary** (`AppErrorBoundary` in `main.tsx`): a render error shows the companion's oops pose with "try again" and reload, not a blank page.
- **Lazy screens**: dialogs and hub screens load on first open (`utils/lazyNamed.ts` + `Suspense` with `ScreenLoading`), and so do the four drill runners, so the drills and @dnd-kit stay out of the first download; Firebase and React are their own chunks, whose hashes survive releases. The service worker precaches every chunk of a build. Loading only the learner's grade of the curriculum is not done yet (every module reads `CURRICULUM_BY_GRADE` synchronously).
- **Dialogs** use `hooks/useDialog.ts`: focus moves in and is trapped, Escape closes only the top dialog, focus returns, the page behind doesn't scroll. `ExamModalShell` is the shared shell; the mission runner, shop, Vault, sign-in panel, placement test and victory screen use the hook directly.
- **Screen readers**: English text carries `lang="en"` with `dir="ltr"` (and `getTextLang` for answer options that may be English or Hebrew), so it is read with an English voice. Answer feedback is `role="alert"`. Icon buttons have Hebrew `aria-label`s. A `:focus-visible` ring shows keyboard focus.
- **Phones**: pinch-zoom is allowed (inputs are 16px on small screens so iOS doesn't zoom into them); `viewport-fit=cover` with `env(safe-area-inset-*)` padding on the bottom nav, sheets and header; sheets use `dvh`. Grades 1–3 hear each question when it opens; a mission started from the map sheet skips the intro's tier choice.
- **Fonts** are bundled (`@fontsource-variable/rubik`, `@fontsource-variable/plus-jakarta-sans`), not loaded from Google Fonts.
- **Headers** (`vercel.json`): `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy` (microphone only for the app). The Content Security Policy is enforced (it ran Report-Only first; Google sign-in and a mission produced no reports). A new third-party origin (script, API, iframe) must be added to it, or the browser blocks it.

### 4.23. Drag-and-Drop Magnets (`drills/magnetDrag.tsx`, `drills/letterSlotDrag.tsx`, `utils/magnetOrder.ts`, `utils/letterSlots.ts`)
- Feature 40. The sentence magnets (`SentenceBuilderDrill`: missions, exam prep, word lists, contests) and the letter magnets (`SpellingMagnetDrill`: word lists, Word Scramble, room naming) take a tap **or** a drag. Checking is unchanged: the runner builds the answer from the placed bank indices in order.
- **Words** (a list with no gaps): drag a bank chip to any spot in the tray (it lands before or after the chip it is dropped on, by the dragged chip's centre); drag a placed chip to another spot; drag it back onto the bank to take it out. A tap still appends or takes back. The drill reports `onChangeOrder(next, change)` (`MagnetChange`: `add` / `remove` / `move` + the bank index); the sentence runners speak a word when it is added.
- **Letters** (one slot per letter, gaps allowed): the runner keeps `slots: (number | null)[]` (an empty list means all open) and gets `onChangeSlots(next)`. A letter dropped on an open slot stays there, even with open slots before it; dropped on a filled slot, a placed letter swaps places with the one there and a bank letter sends that one back to the bank. Dragging a letter onto the bank takes it out. A tap on a bank letter fills the first open slot; a tap on a placed letter opens its slot and nothing else moves. The check button waits until every slot is filled; `spellSlots` reads the word.
- A drop outside the drill changes nothing.
- **Pure helpers** (+ `.test.ts`): `magnetOrder.ts` (`addMagnet`, `removeMagnet`, `moveMagnet`, `toggleMagnet`, `describeMagnetChange`, and the drag ids `magnet-<idx>`, the same id in the bank and the tray so a chip keeps its identity while it changes zone) and `letterSlots.ts` (`placeLetter`, `takeBackLetter`, `dropLetter`, `isEverySlotFilled`, `spellSlots`, slot ids `letter-slot-<pos>`).
- **`useMagnetDrag`** (words) keeps a preview order while dragging (bank ↔ tray moves change the preview, moves inside the tray are shown by the sortable list) and reports one change on drop. **`useLetterSlotDrag`** (letters) has a droppable per slot (`LetterSlot`) and no preview; the hovered slot lights up. Both share `useMagnetSensors`, `useDragClickGuard`, the announcements and `DraggableMagnet`. Sensors: mouse after 5 px; touch after a 150 ms hold (a quick swipe still scrolls); keyboard on placed chips (Space picks up and drops, arrows move, to the next chip for words and the next slot or the bank for letters, Escape cancels, Enter still taps). Bank chips start drags only by pointer, so Enter/Space there is a tap. The click a browser fires right after a drop is ignored. Announcements and instructions are in Hebrew.
- The chip under the finger (`MagnetDragOverlay`) is rendered on `<body>`, because the mission runner's `backdrop-filter` would make its `position: fixed` scroll. Reduced motion: no sliding and no drop animation.

### 4.24. Mini-Lessons Before a Mission (`data/miniLessons.ts`, `data/curriculum/lessons/`, `mission/MiniLesson.tsx`, `hooks/useMiniLesson.ts`)
- Feature 42 (plan: `docs/feature-42-mini-lessons.md`). Every regular mission of grades 1–12 has a hand-written lesson. A Boss that adds new grammar has its own lesson; a review Boss gets the recap of its unit (`buildBossRecap`). Grades 1–3 use picture words (`emoji`) and very short Hebrew.
- **Flow**: `MissionRunner` has three phases, `intro` → `lesson` → `steps`. On a first play (`shouldAutoShowLesson`: no stars yet) Start opens the lesson. A mission started from the map sheet goes straight to the lesson. On replays the intro offers "תזכורת קצרה". During the steps a 📖 button in the header reopens the lesson over the step (a wrong-answer sheet closes, like "try again", and the step keeps its state; hidden once the step is answered). Nothing in a lesson is scored or rewarded.
- **Screen** (`MiniLesson`): up to three cards with dots: the idea (title, `ideaHe`, the `pattern` chip, a "⚠️ טעות נפוצה" tip), examples (tap to hear, the `highlight` part underlined in the theme colour) and one quick try (two chunky options, the companion cheers or says oops, `explainHe` either way). "דילוג" skips to the steps. Grades 1–3 hear the first example by themselves.
- **Grade 1 phonics lessons (Feature 48)**: built from the alphabet and blending words (`lessons/grade1Phonics.ts`). A letters lesson has `letters`: its examples card shows one card per letter (`mission/PhonicsLessonCards.tsx`: the big capital and small letter, tap for its name, and three pictures to hear). A blending lesson has `blendWords`, shown as sliding tiles. Boss recaps keep both. Grades 1–2 hear the idea and the quick-try question in Hebrew by themselves.
- **Data**: `lessons/grade<N>.ts` exports a `LessonPack` keyed by mission id (`MiniLesson` in `lessons/types.ts`). It loads only when a mission opens (`LESSON_PACK_LOADERS`, a dynamic `import()` per grade); `lessons/index.ts` (`ALL_LESSON_PACKS`) is for the tests and the clip corpus, so **a new grade goes in both lists**. A Boss without its own lesson gets `buildBossRecap` (the unit's topics and patterns, one example from each, no quick try). `useMiniLesson` gives up after 3 s (`LESSON_LOAD_TIMEOUT_MS`), and a failed load starts the steps, so a lesson never blocks a mission.
- **Writing a lesson**: Hebrew in gender-neutral plural forms ("שימו לב", "בואו"); `inflectHebrew` must leave it unchanged. The screen wraps every English run of the Hebrew text in a left-to-right isolate (`isolateEnglishRuns` in `utils/bidi.ts`: words joined by spaces, commas, slashes, colons or arrows), so a list like "sh, ch, s, x" stays in order; a comma between two English words that belong to different parts of the sentence ("A כמו apple, B כמו ball") joins them into one run, so write those with periods instead. A quick try may have Hebrew options (a word's meaning); they aren't read aloud. Examples are new sentences, never a mission's own answers. `miniLessons.test.ts` checks every regular mission of a grade with lessons, the length caps, the highlights, gender neutrality and that no example or quick-try answer repeats a step answer of the mission in any tier. Examples and quick-try answers are in `scripts/tts/corpus.ts`, so render the clips after adding lessons.

### 4.25. App Tour (`data/appTutorial.ts`, `components/tutorial/`)
- Feature 45. A short slideshow that shows a new learner the loop (play a mission, earn stars, XP and diamonds, spend them) and where everything is. Nothing in it is scored or rewarded.
- **When**: once in the first-launch sequence (`getFirstLaunchSteps`: greeting → `tour` → placement offer). The greeting's button opens it; App keeps `isOfferingTour` for the session only (like the placement offer), so no profile field and no merge change. Again on demand from the ❓ button in the HUD and "סיור באפליקציה 🧭" in the stats sheet.
- **Slides** (`getTutorialSlides`, pure, + `.test.ts`): welcome, missions (the 5 steps), map (1–3 stars, the Boss castle), economy (XP and the theme's `currencyNameHe`), streak (quests; the Shabbat shield only for observers), dock (the Friends tile only when the hub is on and the account isn't a guest), finish. Each slide has a companion pose. The Hebrew is gender-neutral plural; the test checks it with `inflectHebrew` for every theme. Only the buttons around it (`finishLabelHe`, the greeting's button) are gendered.
- **Screen** (`AppTour`, `ProfileTour` builds the slides from the profile): a full-screen dialog (`useDialog`) with progress dots, the animated scene (`TourScenes.tsx`: small mocks of the play button and step trail, map coins and castle, level ring and gem count-up, week of flames and quest rings, dock tiles, trophy; per-slide colours in `TOUR_ACCENTS`), the companion beside its speech card, and back / next. Swipe (right to left: a swipe to the right goes forward), ←/→ keys, Escape and "דילוג" close it. The last slide fires `celebrate('medium')`. Animations are the `animate-tour-*` classes in `index.css`; reduced motion shows each scene's end state.
- A new hub or a big change to the home screen should get a line in the dock or its own slide.

---

## 5. Directory Structure

```text
├── api/                    # Vercel Functions: tts.ts (online Azure voice, signed-in learners only), _lib/azureTts.ts (SSML & Azure call, shared with scripts/tts), _lib/firebaseToken.ts (ID token check)
├── docs/                   # tts-evaluation.md (read-aloud voice decision)
├── public/                 # Static assets & favicon; tts/ (rendered read-aloud clips + manifest.json, see 4.20); sfx/ (Kenney CC0 sounds + CREDITS.md), art/icons/ (drawn icons, see 4.17), art/<theme>/ etc. (generated WebP art, see 4.17)
├── scripts/                # process_art.py (art-src/ -> public/art/ WebP pipeline), cutout_companion.py (one theme's poses), tts/ (read-aloud corpus, clip render & check), emulator/rulesSmoke.mjs (firestore.rules check against the emulators)
├── src/
│   ├── components/         # React UI Components
│   │   ├── AppErrorBoundary.tsx      # Render errors show the companion with "try again" instead of a blank page
│   │   ├── art/                      # ArtImage: a generated picture with a fallback when the file is missing; EmojiIcon + iconArt: drawn catalog icons
│   │   ├── AuthModal.tsx             # Kid-friendly authentication modal
│   │   ├── CloudLoadErrorScreen.tsx  # Retry screen when the first cloud read after sign-in fails (nothing is saved meanwhile)
│   │   ├── companion/                # Companion: theme companion poses with CSS motion, ground shadow & emoji fallback
│   │   ├── DailyQuestsCard.tsx       # Daily quest tracker & streak counter
│   │   ├── DashboardView.tsx         # Home base: HUD, hero, quest rings, dock, map peek, map, sheets & modals
│   │   ├── drills/                   # Shared drill UI (chunky options, sentence/letter magnets with magnetDrag.tsx drag-and-drop, voice, passage, feedback banner & sheet, story art)
│   │   ├── examPrep/                 # Exam prep hub, setup, plan timeline, session runner, certificate
│   │   ├── home/                     # Home base: HUD with level ring, hero scene, quest rings, dock tile, map peek, stats sheet, first-launch greeting & chest
│   │   ├── tutorial/                 # App tour (Feature 45): slideshow shell, animated scenes, profile wrapper
│   │   ├── hud/                      # Header pieces: sound toggle, `HudIcon` (drawn counter icons)
│   │   ├── friends/                  # Friends Hub: dock tile, hub screen, friend card & reactions, add friend, invite code, contest panel/runner/result
│   │   ├── mission/                  # Mission runner pieces: intro screen, mini-lesson cards (Feature 42), tier choice (shared with the map sheet), trail progress with the combo flame
│   │   ├── MissionMap.tsx            # World map of the grade: regions, path, stops, banners & mission sheet (Feature 26)
│   │   ├── MissionRunner.tsx         # 5-step interactive exercise runner
│   │   ├── OnboardingView.tsx        # Profile setup (name, gender, age, grade, tier)
│   │   ├── PlacementTest.tsx         # Adaptive diagnostic placement test overlay
│   │   ├── progressReport/           # Weekly parent / teacher report: dock tile, week strip, report screen
│   │   ├── ShareTextActions.tsx      # Share sheet / WhatsApp / copy buttons for a text (report, friend invite)
│   │   ├── PlacementResultCard.tsx   # Placement result & grade/tier recommendation
│   │   ├── RewardShopModal.tsx       # Diamond shop (avatars, stickers, shields)
│   │   ├── settings/                 # VoiceLabCard (read-aloud tiers), AccountPrivacyCard (logout, privacy notice, data download, account deletion)
│   │   ├── privacy/                  # PrivacyNoticeDialog: the Hebrew privacy notice for parents
│   │   ├── ScreenLoading.tsx         # Spinner while a lazily loaded screen arrives
│   │   ├── SpeakIcon.tsx             # 🔊 icon, or a stop square while the button's own text is being read (Feature 41)
│   │   ├── room/                     # My English Room: hub, scene & layout, inventory, naming panel, wardrobe, phone, dream journal, games/ (Games Book), stickers/ (Sticker Studio)
│   │   ├── victory/                  # Staged mission victory screen with the cheering companion (Features 24–25)
│   │   ├── VocabularyVaultModal.tsx  # Ministry word bank & pronunciation studio
│   │   ├── worldMap/                 # World map pieces: SVG path, coin & castle stops, banners, landmarks, mission sheet, per-theme styles
│   │   └── wordLists/                # School word lists: dock tile, lists card, importer, session runner & result
│   ├── data/
│   │   ├── curriculum/               # Grade-specific curriculum packs
│   │   │   ├── elementary/           # Grades 1 to 6 (builder.ts + 72 missions across grade1..6.ts)
│   │   │   ├── middleSchool/         # Grades 7 to 9 (builder.ts + 36 missions across grade7..9.ts)
│   │   │   ├── highSchool/           # Grades 10 to 12 (builder.ts + 36 missions across grade10..12.ts)
│   │   │   ├── lessons/              # Mini-lessons by grade (Feature 42, grade1..12.ts), loaded when a mission opens
│   │   │   ├── examBank/             # Exam prep question banks by grade (Feature 43, grade1..12.ts), loaded when a session opens
│   │   │   ├── index.ts              # CURRICULUM_BY_GRADE registry
│   │   │   └── types.ts              # Unit, MissionNode, VocabularyItem, and DrillSeed types
│   │   ├── appTutorial.ts            # App tour slides: texts, points and companion poses (+ .test.ts)
│   │   ├── activityLog.ts            # Daily activity log (12 weeks) recorded by diffing profile updates, + merge (+ .test.ts)
│   │   ├── diamondLedger.ts          # Per-device earned/spent diamond totals, balance & merge (+ .test.ts)
│   │   ├── customWordLists.ts        # School word list parsing, session steps, scoring & rewards (+ .test.ts)
│   │   ├── homeBase.ts               # Home base: quest rings, companion greeting, Play label, map peek, first-launch steps (+ .test.ts)
│   │   ├── elementaryExercises.ts    # Tier-aware 5-step generator for elementary drill seeds
│   │   ├── missionExercises.ts       # Concrete exercise definitions & seeded option/word shuffler
│   │   ├── examPrep.ts               # Exam study plan building, session/mock steps & scoring (+ .test.ts)
│   │   ├── examBank.ts               # Exam question bank loading & bank items as exam steps, practice vs. mock pool (+ .test.ts: sweep, no repeats)
│   │   ├── friends.ts                # Friend codes, requests, public summary, reactions & invite links (+ .test.ts)
│   │   ├── contests.ts               # Daily contest questions by grade, deciding & rewards (+ .test.ts)
│   │   ├── milestones.ts             # Boss star gate, mission unlocks, suggested mission & missions counter (+ .test.ts)
│   │   ├── missionRewards.ts         # Full reward vs. repeat XP for mission replays (+ .test.ts)
│   │   ├── worldMap.ts               # World map layout: regions, path sampling, stop & landmark positions, stop states (+ .test.ts)
│   │   ├── missionHints.test.ts      # Sweep of every mission × tier: hints never repeat the prompt or reveal the answer
│   │   ├── miniLessons.ts            # Mini-lesson loading, Boss recap & when the lesson opens (+ .test.ts: coverage, giveaways, gender)
│   │   ├── placementTest.ts          # Placement question generation, staircase & scoring (+ .test.ts)
│   │   ├── progressReport.ts         # Weekly report: week days, totals, star mastery, mastered words & share text (+ .test.ts)
│   │   ├── progressRewards.ts        # Shared level formula & daily-activity/streak bookkeeping
│   │   ├── streak.ts                 # Streak that breaks on missed weekdays, Shabbat days & shields, merge (+ .test.ts)
│   │   ├── curriculum.test.ts        # Curriculum data checks: unique ids, wrong answers, sentences
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
│   │   ├── useAnimationClock.ts      # Per-frame clock with skip, starting at the end for reduced motion
│   │   ├── useArtStatus.ts           # Whether a generated picture is loading, loaded or missing
│   │   ├── useDialog.ts              # Modal behaviour: focus trap, Escape for the top dialog, focus return, scroll lock
│   │   ├── useCountUp.ts             # Counts a number up from its previous value
│   │   ├── useFriendsHub.ts          # Live friendships, friends' public profiles & contests
│   │   ├── useFriendPresence.ts      # Claims the friend code and publishes the public summary
│   │   ├── useMiniLesson.ts          # Loads a mission's mini-lesson, giving up after 3 s
│   │   ├── useExamBank.ts            # Loads the grade's exam question bank, giving up after 3 s
│   │   ├── usePendingInvite.ts       # Friend code from an invite link, kept through sign-in
│   │   ├── usePrefersReducedMotion.ts # The reduce-motion setting
│   │   ├── useSfxMuted.ts            # The sound mute setting
│   │   ├── useSpeech.ts              # What is being read aloud, 🔊 play/stop toggles, stop on leaving a screen (Feature 41)
│   │   └── useSpeechRecognition.ts   # Web Speech recognition for the voice drills
│   ├── services/
│   │   ├── tts/                      # Read-aloud: hybrid service (clip / online / device), what is being read (speechStatus), clip keys, audio unlock, demo phrases (+ tests)
│   │   ├── cloudSync.ts              # LocalStorage <-> Firestore sync & merge logic (+ .test.ts)
│   │   ├── accountService.ts         # Account deletion with all data, data export, saving a guest account
│   │   ├── profileSaveQueue.ts       # Batches cloud saves of the profile (+ .test.ts)
│   │   ├── friendsService.ts         # Firestore calls for friends, public profiles & contests
│   │   └── firebase.ts               # Firebase initialization & auth/db instances
│   ├── themes/
│   │   ├── themeArt.ts               # Art manifest: companion poses, scene backgrounds, map path per theme, common/landmark/story art paths (+ .test.ts)
│   │   └── themeRegistry.ts          # Pluggable theme visual definitions, art block & tiers
│   ├── types/
│   │   └── learner.ts                # Core domain types (LearnerProfile, Stats, Grades)
│   ├── utils/
│   │   ├── artStatus.ts              # Probes each art file once and caches loaded / missing (+ .test.ts)
│   │   ├── dates.ts                  # Local calendar days (YYYY-MM-DD): toLocalDateStr, addDays, daysBetween
│   │   ├── deviceId.ts               # This browser's id in the diamond ledger
│   │   ├── celebrate.ts              # Shared confetti + sound celebration (small / medium / big)
│   │   ├── hebrewGender.ts           # Hebrew grammatical gender inflection engine
│   │   ├── missionFeedback.ts        # Mission runner trail, combo flame, per-answer XP float & companion peek pose (+ .test.ts)
│   │   ├── motion.ts                 # prefers-reduced-motion check
│   │   ├── rewardFeedback.ts         # Level progress, count-up and victory timeline maths (+ .test.ts)
│   │   ├── sfx.ts                    # Kenney sound effects, first-gesture unlock & device mute (+ .test.ts)
│   │   ├── bidi.ts                   # Left-to-right isolates for English inside Hebrew strings (+ .test.ts)
│   │   ├── hints.ts                  # Drill hint builders: word shape, cloze, word order, pronunciation tips, story locator (+ .test.ts)
│   │   ├── ttsVoice.ts               # Device voice: choice (female default / male) and speechSynthesis helper (+ .test.ts)
│   │   ├── shuffle.ts                # Deterministic seeded shuffle for options & word chips
│   │   ├── magnetOrder.ts            # Order of placed word magnets: add, remove, move, drag ids (+ .test.ts)
│   │   ├── letterSlots.ts            # Letter magnet slots with gaps: place, take back, drop/swap, spell (+ .test.ts)
│   │   ├── lazyNamed.ts              # React.lazy for named exports
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

# Lint (ESLint with react-hooks) and typecheck only
npm run lint
npm run typecheck

# Preview production build locally
npm run preview

# Check firestore.rules against the running emulators (section 8)
node scripts/emulator/rulesSmoke.mjs
```

### When English text changes: render the read-aloud clips
Every fixed English phrase the app reads aloud has a pre-rendered Azure clip (4.20). That covers curriculum missions and generated drill steps, mini-lessons, exam question banks, vocabulary, room and wardrobe item names, voice messages, dream journal words and the settings sample sentence. A changed or new phrase has no clip, so the online voice reads it. That costs Azure quota on every new device, and the device voice reads it offline. After changing any of that text, in the same commit:
1. **New kinds of spoken text** (a new data file, or a new `onSpeakEnglish(...)` call on fixed text) go into `scripts/tts/corpus.ts`. Text the learner types does not.
2. Run `npm run tts:check`. It lists phrases without a clip.
3. Run `npm run tts:render`. It renders only the missing clips (`AZURE_SPEECH_KEY` / `AZURE_SPEECH_REGION` in `.env.local`) and rewrites `public/tts/manifest.json`. Clips of removed text stay on disk but leave the manifest; they can be deleted.
4. Run `npm run tts:check` again (it must report every phrase), then commit the new `public/tts/v<N>/female/*.mp3` files with `manifest.json`.
5. Optional: in `npm run dev`, play the changed screens. `window.__ttsMisses` in the console lists text read without a clip; it should stay empty.

Changing the **voice or SSML** (`api/_lib/azureTts.ts`) is different. Bump `TTS_AUDIO_VERSION` in `src/services/tts/ttsText.ts`, render everything into the new `v<N>` folder (~140K characters, about 35 minutes), and delete the old folder. The old URLs stay cached forever, so reusing them would serve the old sound.

---

## 7. Product Backlog & Roadmap
Detailed feature tracking and future planned enhancements are managed in [`backlog.md`](file:///c:/Development/English%20Tutor/backlog.md).

---

## 8. Local Testing with the Firebase Emulators
Use the emulators to try new features and fixes in the real app, signed in, without touching the live Firebase project (`english-tutor-il-7`). Claude may create and sign in with accounts here, because everything stays on localhost; against the live project it must not (sign in by hand, see `.claude/test-user.md`, gitignored).

**How it works**
- `npm run emulators` starts the Auth (9099) and Firestore (8080) emulators under the demo project `demo-english-vibe`, with the rules in `firestore.rules`. It needs Java 21+ (Microsoft OpenJDK 21 is installed; put its `bin` on `PATH` if `java` isn't found) and the CLI downloads the Firestore emulator jar once.
- `npm run dev:emu` runs Vite in `emulator` mode (port 5173; the `vite-emu` preview config in `.claude/launch.json` uses port 5174). `services/firebase.ts` then points Auth and Firestore at the emulators, only on `localhost` / `127.0.0.1`, with a demo project id and key. A normal `npm run dev` or production build never uses them.
- Data lives in memory and is saved to the gitignored `.emulator-data/` only when the emulators exit cleanly (Ctrl+C). If they are killed, the accounts and profiles are gone: just re-create the test user.

**Process for testing a feature or fix**
1. Start the emulators (a background process, or a terminal tab) and wait until `127.0.0.1:9099` and `:8080` answer.
2. Create the test learner through the Auth emulator (skip if it was exported before): `POST http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-api-key` with `{"email":"emutest@peachnote.tutor.local","password":"<PIN>","returnSecureToken":true}`. The username `emutest` signs in as `emutest@peachnote.tutor.local` (`utils/username.ts`). Keep the PIN in the gitignored `.claude/test-user-emulator.md`, never in this file.
3. Start the app in emulator mode (`vite-emu` preview or `npm run dev:emu`), sign in with the username and PIN, and finish onboarding once (name, grade, theme). A new profile also gets the welcome chest and the placement-test offer (skip it).
4. Exercise the change and check it: screenshots, `read_page`, console messages, and the network tab, which must show only `127.0.0.1` requests for Auth and Firestore. Try the other themes (settings > theme) when the change is visual; theme changes apply live.
5. Stop the dev server and the emulators when done (a clean stop with Ctrl+C keeps `.emulator-data/`). Run `npm test` and `npm run build` before committing; the emulators don't replace them.

**Limits**: Google sign-in and anything needing real Firebase services (Hosting, Storage) don't work in emulator mode. Friends and contests need a second emulator account, created the same way. Dock tiles can scroll under the sticky header, so click them with a script (`button[aria-label^="..."]`) if a coordinate click misses.
