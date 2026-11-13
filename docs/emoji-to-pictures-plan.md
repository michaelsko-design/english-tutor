# Emoji → pictures: audit and plan (2026-11-13)

## What the app shows today

A scan of `src/` (not tests) found **4,333 emoji** in places the app renders. The JSX runtime
(`src/emojiJsx/withEmojiIcons.ts`) already swaps every emoji that has a drawn icon for that icon:

| Status | Uses | What the learner sees |
|---|---|---|
| Drawn icon (`ICON_ID_BY_EMOJI`, 513 icons) | 4,080 | a drawing, but **chosen by the emoji, not by the meaning** |
| No drawn icon | 197 | the phone's own emoji |
| Lucide line symbol (✓ ➡ 🔊 ⚙ …) | 56 | a line icon in the text colour |

So the problem is rarely "a raw emoji". Mostly it is one of these:

1. **Drawn copies of an emoji, used for something else.** On sign-in, "child" shows `word-child` (a
   faceless toddler) and "parent" shows `word-person` (one young person). 💡 "tip" shows the room's
   floor lamp (`room-lamp`), 🧭 "app tour" shows a sticker. 👤 "profile" uses `word-someone`, and 📅
   "calendar" uses the exam-prep dock tile. In all, 40 UI emoji borrow a word, room, wardrobe or
   sticker drawing (list below).
2. **One picture per emoji everywhere.** A vocabulary word shows the emoji's drawing in the word bank,
   word lists, decks and games. Only the "What is this?" card uses the word's own picture (237
   `vocab-*` pictures).
3. **197 plain emoji** with no drawing at all. 72 are in the unreleased core-3 pack, 55 in word
   decks (grades 4–6), 17 in lesson and curriculum text (clocks, colour dots, numbers), and a few in
   UI badges (🆕 ▶ ⏩ 🕒).

## Approach

Keep the global emoji → icon map **for the UI chrome only**: gems, stars, streak flame, gift and
rocket. Those 68 `ui-*` icons already form one matching set. Content gets **pictures keyed by
meaning**, through the `pictureId` path the vocabulary cards already use:

- A word shows `getVocabPictureId(word)` wherever the word appears, not only on the card.
- Missions, letters and sign-in roles each get their own picture id (`mission-<id>`,
  `letter-<word>`, `ui-role-child`, …).
- Arrows and badges (🆕 ▶ ⏩ ▪ ✔ ↔ ⬇ 🔼) become Lucide symbols, like ✓ and 🔊 today. They are
  symbols, not drawings, and cost nothing.
- Decorative emoji in Hebrew lesson text that add nothing are deleted instead of drawn.

All drawing goes through the existing pipeline (`buildVocabPictureList` → `renderVocabPictures`
4 × 4 at 2K in one batch → `slice_vocab_sheets.py` → `process_art.py icons`), at about $0.05 a
sheet of 16.

## Phases

| # | Surface | New pictures | Sheets | Cost | Code |
|---|---|---|---|---|---|
| 0 | Word pictures everywhere a word appears: word bank (`VocabularyVaultModal`), word lists, word decks, room games, dream journal, matching drills | 0 (reuse 237) | 0 | $0 | `getWordPicture()` helper + `pictureId` on those screens |
| 1 | **Sign-in and onboarding + the 40 borrowed UI icons**: child, parent (adult with child), new account, sign in, save with Google, privacy for parents, tip bulb, tour compass, profile, calendar, clock, … | ~30 | 2 | $0.10 | role buttons in `auth/SignInPanel.tsx`, `CredentialsForm.tsx`; repoint `ICON_ID_BY_EMOJI` to new `ui-*` ids |
| 2 | Mission and unit pictures on the map, mission sheet, intro and victory screens (107 mission icons + unit badges, grades 1–12) | ~120 | 8 | $0.40 | `mission.pictureId` from the mission id; fallback to today's icon |
| 3 | Grade 1 letters and blending (`alphabet.ts`, `blendingWords.ts`) | **done**: 91 of 93 words reuse vocab pictures; 5 left (up, zero, net, shell, cat on the bed) go on the phase 4 sheets | 0 | $0 | `cardPictureId` on cards, `pictureId` on answer options and lesson quick tries (`data/phonicsPictures.ts`) |
| 4 | Concrete grade 7–12 vocabulary and word-deck words (212 + 55 words; abstract ones get none) | ~180 | 12 | $0.60 | add to the vocab list (grade cap 6 → 12, abstract filter) |
| 5 | Lesson text and the core-3 pack: clocks at set times, colour dots (→ CSS circles), numbers; delete pure decoration | ~30 | 2 | $0.10 | edit lesson and pack text (TTS unaffected: `toSpeakableText` strips emoji) |
| | **Total** | **~420** | **~28** | **≈ $1.40 + ~$0.30 redraws** | |

**Not in scope, already drawn per item:** shop, room furniture, wardrobe, avatars, stickers and
companions (`room-*`, `wear-*`, `avatar-*`, `sticker-*`).

Each phase is one batch. It is followed by a by-eye review sheet like the vocabulary one, and a
redraw sheet for misses (watch counts, clock times and stray labels). State the request count
before every paid run.

## The 40 borrowed UI icons (phase 1)

🆕 (plain), 🔑 word-key, 💡 room-lamp, 🧒 word-child, 🧑 word-person, 🛡 boost-shield, 📖 games-book,
👀 word-eyes, 📅 dock-exam-prep, 🎓 wear-graduation-cap, ⭐ room-star, 👑 wear-crown, 🏆 room-trophy,
📚 room-books, ▶ (plain), 👫 dock-friends, 🧭 sticker-compass, 🕒 (plain), 📝 dock-word-lists,
🎨 pass-sticker-studio, 📊 dock-report, 🐰 avatar-bunny, 🕶 wear-sunglasses, 🎀 wear-bow,
🌸 decor-flower-lamp, 🛏 bed, 📱 phone, 🏠 dock-room, 🏙 word-city, 🌆 (plain), ⛰ word-mountain,
🚪 wardrobe, ✏ word-pencil, 🖼 room-picture, 👧 avatar-girl, 👦 avatar-boy, 👤 word-someone,
🐱 avatar-cat, 🪴 room-plant, ⏩ (plain).

Many of these are fine where they are: the shop and room screens show the real item. Phase 1 redraws
only those whose meaning differs: sign-in roles, tip, tour, profile, calendar, clock, "new", and
star/trophy/crown when used as ratings. It checks the rest by eye on a contact sheet first.
