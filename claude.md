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
- **Metrics**: stars (all grades, 1–3 per mission) measure mastery depth; the "Missions Completed" (משימות הושלמו) tile counts distinct missions with ≥1 star (`countCompletedMissions`). Both are derived from `missionProgress`, so no extra sync fields. `stats.missionsCompleted` (counts replays) is still stored but not shown.

### 4.11. School Word List Importer (`customWordLists.ts`, `components/wordLists/`)
- The "My Word Lists" (רשימות המילים שלי) dashboard card, under the exam prep card, lets the learner paste a word list from a school worksheet and practise it.
- **Parsing** (`parseWordListText`): one item per line; numbering and bullets are stripped; a Hebrew translation can come before or after the English, separated by a dash, `=`, `:` or a tab; comma lists of short words are split. Lines of 1–2 words are words, longer lines are sentences (max 15 words). Duplicates and lines without English are reported with a Hebrew reason. A word without a translation gets one from the curriculum vocabulary when it is there (📚).
- **Limits**: 3–30 items per list, up to 10 active lists.
- **Sessions** (`buildWordListSteps`): up to 5 items per session in three rounds: meaning match (words with a translation, options are other list words), magnets (letter tiles for words with spaces/punctuation kept fixed, word chips for sentences), then voice. Practice allows hints and retries and scores the first try; a skipped voice step ("quiet place") is left out of the score.
- **Rewards**: the full reward (15 XP, 2 💎, +3 💎 at 80%+) once per list per day, for up to 3 lists a day (`lastRewardedDateStr`); otherwise 3 XP. Every session counts as a mission for the daily quests and streak; voice-word and 3-star quest credit come only from rewarded sessions. There are no mission stars.
- Stored as `customWordLists` on the profile. Deleting a list sets `archivedAt` and empties its items (a small tombstone, so a merge can't bring it back). Merge: union by id; the same list keeps the best score and latest practice, and stays deleted once either device archived it.
- Voice recognition lives in `hooks/useSpeechRecognition.ts` and `drills/VoiceSpeakDrill.tsx`, shared with `MissionRunner`; letter magnets are `drills/SpellingMagnetDrill.tsx`.

### 4.12. My English Room (`room.ts`, `components/room/`) — Phase 1
- The "החדר האנגלי שלי" dashboard card (under the word lists card) shows a live preview of the room and opens it full-screen.
- **The room** (`RoomScene`): a drawn wall/floor scene with fixed slots (wall, sticker board, shelf, desk, floor) and four mission objects: 🛏️ bed, 📱 phone, 🚪 wardrobe, 📖 Games Book. Slot positions and per-theme colours live in `roomLayout.ts`. The equipped shop avatar walks to whatever the learner taps.
- **Mission objects** show a "coming soon" bubble with their activity until later phases ship.
- **Items**: 20 room items (`ROOM_ITEMS`) plus the shop decor lamp and the 3 shop stickers (`SHOP_ROOM_ITEMS`). Every learner starts with the 🪴 plant. Ownership reuses `unlockedRewardIds`.
- **Earning**: a mission's *first* 3-star result awards the next unowned item in `ROOM_REWARD_ORDER` (`getRoomRewardForMission`). The victory screen previews it and the dashboard shows a toast.
- **Placing** (`NameItemPanel`): pick an item, then a blinking slot of its kind; the learner must **say** the English name (speech recognition) or **spell** it with letter magnets. The first naming of each item gives +5 XP (`namedItemIds`). Tapping a placed item says its name and offers move / put away.
- **Avatars**: five free starter avatars (girl, boy, puppy, kitten, panda) were added to the shop.
- Stored as `room` on the profile (`placements` slot → item, `namedItemIds`, `updatedAt`). Merge: the newer layout wins; named items are unioned.
- Later phases (wardrobe dress-up, phone voice messages, bed dream journal, Games Book word games, Sticker Studio) are tracked under Feature 12 in `backlog.md`.

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
│   │   ├── MissionMap.tsx            # Unit & mission progression node tree
│   │   ├── MissionRunner.tsx         # 5-step interactive exercise runner
│   │   ├── OnboardingView.tsx        # Profile setup (name, gender, age, grade, tier)
│   │   ├── PlacementTest.tsx         # Adaptive diagnostic placement test overlay
│   │   ├── PlacementResultCard.tsx   # Placement result & grade/tier recommendation
│   │   ├── RewardShopModal.tsx       # Diamond shop (avatars, stickers, shields)
│   │   ├── room/                     # My English Room: dashboard hub, scene & layout, inventory, name-it-to-place-it panel
│   │   ├── VocabularyVaultModal.tsx  # Ministry word bank & pronunciation studio
│   │   └── wordLists/                # School word lists: dashboard card, importer, session runner & result
│   ├── data/
│   │   ├── curriculum/               # Grade-specific curriculum packs
│   │   │   ├── elementary/           # Grades 1 to 6 (builder.ts + 72 missions across grade1..6.ts)
│   │   │   ├── middleSchool/         # Grades 7 to 9 (builder.ts + 36 missions across grade7..9.ts)
│   │   │   ├── highSchool/           # Grades 10 to 12 (builder.ts + 36 missions across grade10..12.ts)
│   │   │   ├── index.ts              # CURRICULUM_BY_GRADE registry
│   │   │   └── types.ts              # Unit, MissionNode, VocabularyItem, and DrillSeed types
│   │   ├── customWordLists.ts        # School word list parsing, session steps, scoring & rewards (+ .test.ts)
│   │   ├── elementaryExercises.ts    # Tier-aware 5-step generator for elementary drill seeds
│   │   ├── missionExercises.ts       # Concrete exercise definitions & seeded option/word shuffler
│   │   ├── examPrep.ts               # Exam study plan building, session/mock steps & scoring (+ .test.ts)
│   │   ├── milestones.ts             # Boss star gate, mission unlocks, suggested mission & missions counter (+ .test.ts)
│   │   ├── placementTest.ts          # Placement question generation, staircase & scoring (+ .test.ts)
│   │   ├── progressRewards.ts        # Shared level formula & daily-activity/streak bookkeeping
│   │   ├── room.ts                   # Room items & slots, 3-star item rewards, placing & naming rules (+ .test.ts)
│   │   └── rewardShop.ts             # Daily quest & shop item catalog
│   ├── hooks/
│   │   └── useSpeechRecognition.ts   # Web Speech recognition for the voice drills
│   ├── services/
│   │   ├── cloudSync.ts              # LocalStorage <-> Firestore sync & merge logic (+ .test.ts)
│   │   └── firebase.ts               # Firebase initialization & auth/db instances
│   ├── themes/
│   │   └── themeRegistry.ts          # Pluggable theme visual definitions & tiers
│   ├── types/
│   │   └── learner.ts                # Core domain types (LearnerProfile, Stats, Grades)
│   ├── utils/
│   │   ├── hebrewGender.ts           # Hebrew grammatical gender inflection engine
│   │   ├── shuffle.ts                # Deterministic seeded shuffle for options & word chips
│   │   └── speechSimilarity.ts       # Phonetic & string similarity calculation for voice
│   ├── App.tsx                       # Root orchestrator & Firebase auth/sync listener
│   ├── index.css                     # Tailwind & custom CSS utility rules
│   └── main.tsx                      # React root entry point
├── backlog.md              # Project product backlog (completed & future items)
├── firestore.rules         # Security rules for Firestore learners collection
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
