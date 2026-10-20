# EnglishVibe — Developer Cheat Sheet

Hebrew-first, gamified English-learning web app for Israeli students, grades 1–12 (`APP_NAME` in `src/config/appInfo.ts`).
**Full architecture and feature specs: `docs/architecture.md`** (read only the section you need, e.g. `grep -n "^### 4.20" docs/architecture.md`).

## Core Stack
React 18 + TypeScript, Vite 6, Tailwind CSS 3 (`darkMode: 'class'`, set from the theme), Firebase (Auth + Firestore, project `english-tutor-il-7`), Azure Neural TTS (rendered MP3 clips + `/api/tts` Vercel Function), Vitest. Deploy: Vercel; **a push to `main` deploys to production.**

## Commands
```bash
npm run dev          # Vite dev server
npm run dev:emu      # Vite against the Firebase emulators (port 5173)
npm run emulators    # Auth 9099 + Firestore 8080, demo project demo-english-vibe (needs Java 21+)
npm test             # Vitest (vitest run)
npm run lint         # ESLint
npm run typecheck    # tsc -b
npm run build        # tsc -b && vite build  (run test + build before committing)
npm run tts:check    # phrases without a read-aloud clip
npm run tts:render   # render missing clips, rewrite public/tts/manifest.json
node scripts/emulator/rulesSmoke.mjs   # firestore.rules vs. running emulators
```
Emulator testing: never sign in or create accounts against the live Firebase project. Use the emulator user `emutest` (PIN in gitignored `.claude/test-user-emulator.md`); steps in `docs/architecture.md` §8.

## Essential Rules

**TTS corpus** (any change to English text the app reads aloud):
- Hebrew shown to grades 1–2 is read aloud too (Feature 47): it must be built by the generators `scripts/tts/hebrewCorpus.ts` runs (or added there), and rendered with `npm run tts:render -- --voice he-female`.
- Fixed spoken text must be in `scripts/tts/corpus.ts` (new data file or new `onSpeakEnglish(...)` call on fixed text → add it there). Learner-typed text is not.
- After editing curriculum, mini-lessons, exam banks, vocabulary, room/wardrobe names, voice messages, dream words: `npm run tts:check` → `npm run tts:render` (needs `AZURE_SPEECH_KEY`/`AZURE_SPEECH_REGION` in `.env.local`) → `tts:check` again → commit new `public/tts/v<N>/female/*.mp3` + `manifest.json` in the same commit.
- Changing voice/SSML (`api/_lib/azureTts.ts`) means bumping `TTS_AUDIO_VERSION` in `src/services/tts/ttsText.ts` and re-rendering everything.
- All read-aloud goes through `getTtsService().speak(...)`; 🔊 buttons use `useSpeechToggle`; screens that read aloud use `useStopSpeechOnLeave`.

**Profile sync**:
- Every local change goes through `App.handleUpdateProfile` (activity log + diamond ledger recorded there).
- **A new `LearnerProfile` field must be added to `mergeLearnerProfiles`** (`services/cloudSync.ts`) or a sync drops it. Dates are local calendar days (`utils/dates.ts`), never UTC.
- Never save before the cloud profile loaded (`isCloudLoadedRef`). Diamonds merge via `diamondLedger`; streaks via `mergeStreakStats`.
- New Firestore access → update `firestore.rules` and run the rules smoke test.

**Hebrew RTL & inflection**:
- `<html lang="he" dir="rtl">`. English text gets `dir="ltr"` + `lang="en"`, or `dir="auto"`, or `<bdi>`; English inside Hebrew strings uses `isolateLtr` / `isolateEnglishRuns` (`utils/bidi.ts`).
- Hebrew addresses the learner by gender (`girl`/`boy`): use `getHebrewCopy` / `inflectHebrew` / the `he` template (`utils/hebrewGender.ts`). Hints, lessons, tour and exam-bank Hebrew are **gender-neutral plural** ("שימו לב", "כדאי…") and must be unchanged by `inflectHebrew` (tests enforce it).
- Minimum text size `text-xs` (12px). Honor reduced motion (`usePrefersReducedMotion`).

**Conventions**: internal ids keep old names (`english_tutor_*` storage keys, `@peachnote.tutor.local` sign-in domain); don't rename. New third-party origin → add to the CSP in `vercel.json`. New grade of lessons/exam bank → register in both the loader map and the `index.ts` list (see §4.24, §4.9). Prefer immutable updates; files < 800 lines.

## Efficiency & Subagent Rules
- No broad repo sweeps: `Grep`/`Glob` for the specific symbol first, then `Read` with `offset`/`limit`. Don't read whole curriculum, lesson, exam-bank, or `public/tts` files.
- Don't open `docs/architecture.md` in full; grep for the section heading you need.
- Use subagents only for genuinely large, independent work. Simple lookups, single-file edits and small fixes are done inline.
- In the browser/preview: query targeted DOM selectors (`javascript_tool` with `querySelector`, `find`, `read_page` with `ref_id`) instead of full page or tree dumps; prefer `get_page_text` over screenshots for text checks. Dock tiles can hide under the sticky header: click via `button[aria-label^="..."]`.
- Report changes as concise diffs/`file:line` references, not re-printed files. Don't restate unchanged code.
