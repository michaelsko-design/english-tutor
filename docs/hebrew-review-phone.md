# Reviewing the Hebrew clips on the phone

The review of `npm run tts:review:he`, on any phone or tablet, with the PC off. **Mark only** (good, or regenerate with reasons and a note); comparing new takes stays on the PC.

## How it works

- A Cloudflare Worker (`scripts/tts/reviewWorker/`), outside the app: no Vercel, Firestore or app change. It serves the page, a private R2 bucket holds the line list and the PC's marks, D1 holds the marks made on the phone.
- Audio comes from the public clips bucket the app uses.
- `scripts/tts/hebrewReview.json` on the PC stays the only authority, and is still committed from the PC. Phone marks wait online until the PC takes them; every device sees them meanwhile.
- A phone mark is applied only if the PC still has the audio that was heard and has no newer mark of its own. A PC undo has no time, so a phone mark still waiting for that clip (for example one made offline) can bring it back.
- A line is listed on the phone only when the clip online is byte for byte the PC's file: upload, then sync.

## Daily use

| When | Run on the PC |
|---|---|
| After rendering, `redo`, a compare decision or an upload | `npm run tts:upload` (with `--force` after a replaced clip), then `npm run tts:review:he -- sync` |
| Taking the phone marks | `npm run tts:review:he -- sync`, opening `npm run tts:review:he`, or `tts:render:he -- regenerate` (it syncs first; `--offline` skips) |
| Opening the page on a new device | `npm run tts:review:he -- link`, and send the link to that device privately |

The local page syncs the lines and marks when it starts, and the marks after each click.

On the phone, marks made without a connection are kept in the browser and sent later ("N marks not saved online yet"). Playing needs a connection. An iPhone home-screen icon has its own storage: paste the link into its sign-in box once.

Before the first sync the marks file is copied to `scripts/tts/hebrewReview.before-sync.json.bak`.

## One-time setup

Run from the project folder.

1. `npx wrangler@4 login` (opens the browser; sign in to the Cloudflare account of the clips bucket).
2. `npx wrangler@4 d1 create hebrew-review`, and put the printed `database_id` in `scripts/tts/reviewWorker/wrangler.toml`.
3. `npx wrangler@4 r2 bucket create englishvibe-hebrew-review` (private: leave public access off).
4. `npx wrangler@4 d1 execute hebrew-review --remote --file scripts/tts/reviewWorker/schema.sql --config scripts/tts/reviewWorker/wrangler.toml`
5. `npx wrangler@4 deploy --config scripts/tts/reviewWorker/wrangler.toml`, and add the printed address to `.env.local` as `HEBREW_REVIEW_URL=https://…workers.dev`.
6. `npm run tts:review:he -- setup-token` (creates the token, keeps it in `.env.local`, stores it in the Worker; it is never printed).
7. `npm run tts:review:he -- sync`, then `npm run tts:review:he -- link`.

After a change under `reviewWorker/`, run step 5 again.

**A lost phone or leaked link:** delete the `HEBREW_REVIEW_TOKEN` line from `.env.local`, run `setup-token` again, and open the new link.

## Local test

`.dev.vars` in `reviewWorker/` (gitignored) with `HEBREW_REVIEW_TOKEN=<any 32+ characters>`, step 4 with `--local` instead of `--remote`, then the `he-review-worker` preview (port 8787). Sync against it with a **copy** of the marks file, never the real one.
