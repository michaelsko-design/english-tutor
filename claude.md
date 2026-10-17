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
- **High School (Grades 10–12)**:
  - Advanced reading comprehension, essay transitions, literature vocabulary, and Bagrut matriculation preparation.
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

---

## 5. Directory Structure

```text
├── public/                 # Static assets & favicon
├── src/
│   ├── components/         # React UI Components
│   │   ├── AuthModal.tsx             # Kid-friendly authentication modal
│   │   ├── DailyQuestsCard.tsx       # Daily quest tracker & streak counter
│   │   ├── DashboardView.tsx         # Main hub screen (HUD, Hero, Maps, Actions)
│   │   ├── MissionMap.tsx            # Unit & mission progression node tree
│   │   ├── MissionRunner.tsx         # 5-step interactive exercise runner
│   │   ├── OnboardingView.tsx        # Profile setup (name, gender, age, grade, tier)
│   │   ├── RewardShopModal.tsx       # Diamond shop (avatars, stickers, shields)
│   │   └── VocabularyVaultModal.tsx  # Ministry word bank & pronunciation studio
│   ├── data/
│   │   ├── curriculum/               # Grade-specific curriculum packs
│   │   │   ├── elementary/           # Grades 1 to 6 (builder.ts + 72 missions across grade1..6.ts)
│   │   │   ├── middleSchool/         # Grades 7 to 9 (builder.ts + 36 missions across grade7..9.ts)
│   │   │   ├── highSchool/           # Grades 10 to 12
│   │   │   ├── index.ts              # CURRICULUM_BY_GRADE registry
│   │   │   └── types.ts              # Unit, MissionNode, VocabularyItem, and DrillSeed types
│   │   ├── elementaryExercises.ts    # Tier-aware 5-step generator for elementary drill seeds
│   │   ├── missionExercises.ts       # Concrete exercise definitions & seeded option/word shuffler
│   │   └── rewardShop.ts             # Daily quest & shop item catalog
│   ├── services/
│   │   ├── cloudSync.ts              # LocalStorage <-> Firestore sync & merge logic
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

# Typecheck and build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 7. Product Backlog & Roadmap
Detailed feature tracking and future planned enhancements are managed in [`backlog.md`](file:///c:/Development/English%20Tutor/backlog.md).
