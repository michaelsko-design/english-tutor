# Feature 42: Mini-Lessons Before a Mission (שיעור קצרצר לפני המשימה)

> Backlog: "before starting the questions of a mission, show a very short and fun mini-lesson to teach the subject of the mission. explain in hebrew mixed with english examples."

## Goal
Before the first question, the companion teaches the mission's subject in about 30–45 seconds, using three swipeable cards: the idea in Hebrew, English examples to hear, and one quick try. It must feel like part of the game, not homework, and must never block a mission.

## What exists today
- `MissionRunner` has two phases, `hasStarted` false (the `MissionIntro`, tier choice) then the steps. A mission started from the map sheet skips the intro (`isTierChosen`).
- Every mission has `grammarTopic` (English label), `storyHookHe`, `sampleSentenceEn/He`, `vocabulary`, and `drillSeed.rule` (a step-4 question with `explainHe` / `hintHe`). None of these teaches the topic. `explainHe` explains one specific answer, and the sample sentence *is* the sentence-builder answer.
- 144 missions: 96 regular + 48 Boss reviews.

## Decisions (recommended)
| Question | Recommendation | Why |
| :--- | :--- | :--- |
| Generated or hand-written? | **Hand-written** for the 96 regular missions; Boss missions get an automatic **recap** built from their unit's two lessons (an authored Boss lesson overrides it, for Bosses that add something new such as grade 9 unit 2's contrast connectors). | Generated text from `grammarTopic` would be thin and wrong for phonics. The hints work (Feature 20) showed that hand-written content plus a sweep test works. |
| When is it shown? | Automatically on the **first play** (mission has 0 stars). On replays it is closed, and a "📖 תזכורת קצרה" link on the intro opens it. During the steps, a 📖 button in the HUD reopens it as a sheet. | Fun the first time, not a chore on the third replay. Needs no new profile field (it uses `missionProgress`). |
| Skippable? | Yes: "אני כבר יודע/ת ← לתרגול" on every card. | Never block a mission. |
| Reward? | None. The quick try isn't scored and doesn't touch stars, combo or XP. | No sync or merge changes, no farming. |
| Per tier? | One lesson per mission for all tiers. | Keeps the authoring at 96. Tier already scales the drills. |
| Where does the data live? | `src/data/curriculum/lessons/grade<N>.ts`, keyed by mission id, **loaded lazily** when the runner opens. | Keeps the first download small (Feature 31 is about exactly this). The curriculum files are already large. |

## Lesson data
```ts
// src/data/curriculum/lessons/types.ts
export interface LessonExample {
  en: string;            // "She has already finished."
  he: string;            // "היא כבר סיימה."
  highlight: string;     // "has already finished" – must appear in `en`
  emoji?: string;        // pictures for grades 1–3
}

export interface MiniLesson {
  titleHe: string;       // fun headline, ≤ 40 chars: "הסוד של have + V3 🔑"
  ideaHe: string;        // 1–2 sentences, Hebrew with inline English, ≤ 160 chars
  pattern?: string;      // English formula shown as a chip: "have / has + V3"
  examples: LessonExample[];   // 2–3
  tipHe?: string;        // common mistake of Hebrew speakers, ≤ 100 chars
  quickTry: {            // one tap, not scored
    promptHe: string;
    correct: string;
    wrong: string;       // a single distractor: 2 big buttons
    explainHe: string;
  };
}

export type LessonPack = Record<string /* mission id */, MiniLesson>;
```
- `getMiniLesson(mission, gradeId): Promise<MiniLesson | null>` (`data/miniLessons.ts`): dynamic `import()` of the grade's pack. A Boss without its own lesson gets `buildBossRecap(unit, pack)` (both patterns, one example from each, no quick try). Returns `null` on any failure; the runner then goes straight to the steps.
- Grades 1–2 (phonics and words): `pattern` is the sound ("/k/ = c"), examples are picture words with `emoji`, and the Hebrew is one short line, because they can't read much yet. Feature 32 (Hebrew audio) will read it aloud later.

## Screen (`components/mission/MiniLesson.tsx`)
Three cards with dots, right to left, the companion on top:
1. **הרעיון** (companion `think`): `titleHe`, `ideaHe`, `pattern` as a big chip (`dir="ltr" lang="en"`), `tipHe` as a "⚠️ טעות נפוצה" note.
2. **דוגמאות** (companion `idle`): each example is a tappable card. It reads the English aloud (`onSpeakEnglish`), and the `highlight` part is coloured in the theme colour. The Hebrew sits under it. Grades 1–3 hear the first example automatically (like `readsQuestionsAloud`).
3. **נסו!** (companion `cheer` / `oops`): `quickTry` as two chunky buttons (`MultipleChoiceOptions`) with the right / wrong sound and `explainHe`. Then the gendered button "יאללה לתרגול! 🚀".

Details:
- Hebrew text goes through `inflectHebrew(text, gender)` and should be written gender-neutral where possible (like the hints). English is never inflected.
- English inside Hebrew lines is isolated: `<bdi>` / `isolateLtr` (`utils/bidi.ts`), so "have/has" keeps its order.
- Reduced motion: no slide between cards and no companion motion.
- The "הבא" / "הקודם" buttons move between cards (no swipe, so the direction can't confuse in right-to-left); Escape closes the whole runner as today.
- Text ≥ 12px, buttons ≥ 44px, `aria-live` on the quick-try feedback.

## Runner flow
Replace `hasStarted` with `phase: 'intro' | 'lesson' | 'steps'`:
- intro → Start → `lesson` when `shouldAutoShowLesson(stars) && lesson` is true, else `steps`.
- From the map sheet (`isTierChosen`): start in `lesson` or `steps` by the same rule.
- While the lesson pack loads, the Start button shows a spinner for at most 1.5 s, then it goes to the steps without a lesson.
- The HUD 📖 button opens the same component in a sheet (`useDialog`). Closing it returns to the same step with its state.
- `readsQuestionsAloud` waits for `phase === 'steps'`.

## Read-aloud clips
The lesson examples are new fixed English, so:
- `scripts/tts/corpus.ts` adds every `examples[].en`, `pattern`, and `quickTry.correct/wrong` that is English.
- `npm run tts:check` → `npm run tts:render` → `npm run tts:check` and commit the clips with each content batch (CLAUDE.md section 6).

## Tests (`data/miniLessons.test.ts`, extending the sweeps)
- Every regular mission of grades 1–12 has a lesson, and no lesson id is orphaned.
- Shape and length: 2–3 examples, length caps, each `highlight` is a substring of its `en`, and the quick try's `correct !== wrong`.
- **No giveaways**: no example sentence or quick-try answer equals (case/punctuation-insensitive) any step answer of that mission for any tier. That means the sentence-builder sentences, `rule.correct`, the story answer and the voice sentence. Same idea as `missionHints.test.ts`.
- Gender: `inflectHebrew` leaves every English token unchanged, and the Hebrew reads the same for words on the protected list (`hebrewGender.test.ts`).
- `buildBossRecap` combines both regular lessons; an authored Boss lesson wins.
- `shouldAutoShowLesson` (0 stars → true, ≥ 1 → false).
- `getMiniLesson` returns `null` when the import fails.

## Status
Done. Steps 1–4 shipped: the engine, runner flow, 📖 review button and lessons for all 12 grades, with Boss lessons where a Boss adds new grammar (CLAUDE.md 4.24).

## Build order
1. **Engine + one grade.** Types, `miniLessons.ts` (loader, Boss recap, `shouldAutoShowLesson`) with tests, `MiniLesson.tsx`, the runner `phase`, the HUD 📖 sheet, the intro link. Content for **grade 7** (8 regular missions) to prove the format. Check it in the emulator app (section 8) in all three themes and on a phone width.
2. **Review checkpoint.** You review the grade 7 lessons (tone, length, Hebrew) before more content is written.
3. **Content in batches**, each with its clips and green sweep tests: grades 1–3 (phonics and pictures), 4–6, 8–9, 10–12. Bosses that teach something new get an authored lesson.
4. **Docs.** CLAUDE.md section 4.24 (written with step 1), plus 4.5 / 4.17 (runner flow), the directory tree, and moving the backlog item to Completed.

Steps 1–2 must come first. The batches in step 3 are independent (separate files) and can run in parallel sessions once the format is approved.

## Out of scope / follow-ups
- Lessons in Exam Prep sessions (grammar focus blocks could open the unit's lessons).
- Hebrew audio of the lesson text for grades 1–2 (Feature 32).
- An index of every lesson in the Vocabulary Vault, as a "grammar book".

## Risks
- **Authoring effort and quality**: 96 lessons is the bulk of the work. Mitigated by the review checkpoint, the length caps and the giveaway test.
- **Mission length**: adds about 30–45 s to first plays only. `estimatedMinutes` stays the same; the intro's "כ-N דקות" adds 1 when the lesson will show.
- **Clip quota**: roughly 96 × 4 ≈ 400 new short phrases, a few minutes of rendering.
