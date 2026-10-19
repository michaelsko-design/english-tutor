# Read-aloud voice: evaluation and decision

**Problem.** The app read English with `window.speechSynthesis`. On Android it sounds robotic, and it differs on every device. Learners copy what they hear, so the voice has to be clear and natural.

## Options compared

| Criterion | A: Kokoro in the browser (`kokoro-js`) | B: Azure Neural through a live proxy | C: Azure clips rendered once |
|---|---|---|---|
| Clarity and cadence | Very good | Very good, SSML speed and pauses | Very good, and every clip can be checked before it ships |
| Cold start | 86–92 MB q8 model (WASM); WebGPU needs fp32, ~310 MB; 300 MB+ RAM | None | None |
| Playback latency | Expected to run slower than real time on mid-tier phones (from reports, not measured) | One Azure request: **~650–750 ms measured** from the dev machine, plus the round trip; a CDN hit is one small download | One static file: ~8 KB for a word, ~25 KB for a sentence |
| Data use | 90–310 MB once per device | ~6 KB per second of speech | Same, and only the clips that are played |
| Offline | Yes, after the download | Clips played before (device cache) | Clips played before (service worker cache) |
| Running cost and risk | Free; heavy client; WebGPU uneven (iOS, Firefox) | Function, key in production, abuse, quota | None at runtime |
| Text learners type | Yes | Yes | No |

**Azure free tier (F0):** 500,000 characters a month. It can't be billed: over quota it answers 429.

**Measured corpus** (`npm run tts:corpus`):
- 4,974 fixed phrases, 140K characters per voice.
- Rendered as 24 kHz 48 kbps MP3, the female voice is **96 MB** (4,974 files). Rendering used 140,138 characters, about 28% of one month's free quota, and took ~35 minutes with 2 parallel requests and no 429s.
- Smaller formats were rejected. 32 kbps at 16 kHz dulls *s*, *f* and *th*, which matter for phonics. WebM/Opus isn't reliable in iPhone Safari's `<audio>` element ([WebKit bug 238546](https://bugs.webkit.org/show_bug.cgi?id=238546)).

## Decision: a hybrid of C and B

Each phrase tries three tiers in order (`src/services/tts/hybridTtsService.ts`):
1. **Rendered clip.** The default female voice for all fixed curriculum and room text, committed in `public/tts/v1/female/` and listed in `public/tts/manifest.json`. A typed word that matches a rendered word also plays its clip.
2. **Online Azure voice** (`/api/tts`, a Vercel Function). Used for any other English text: word lists, sticker names, dreams, the male voice and curriculum text not rendered yet. The CDN caches each answer by URL for a year, and the device keeps it in CacheStorage.
3. **Device voice.** Used offline, over quota (the online voice then pauses for 10 minutes), after a 3 s timeout, when playback is blocked, or for text the online voice doesn't read (non-English, over 200 characters).

**Why:**
- The content is fixed, so it's rendered once for everyone, and most plays need no server.
- Typed text still gets the natural voice, and it's a small share of the free quota.
- Phones download only what they play. There's no model download and no memory pressure.
- Every tier falls back to the next, so nothing breaks.

**Why only the female voice in git.** Clips live in git, and git keeps every version forever. A voice change re-renders everything and adds the full size to history again. Rendering only the default voice halves that. The male voice uses tier 2.

## Risks and mitigations

- **Abuse of the proxy.** Only plain English up to 200 characters is accepted, with a fixed voice and speed list. Only the canonical query is served, so cache-busting variants are rejected. A script can still spend the quota on new phrases, so add a Vercel Firewall rate-limit rule on `/api/tts`. F0 can't bill.
- **Stale audio after a voice change.** Clips and answers are cached forever, so the audio version (`TTS_AUDIO_VERSION`) is part of every clip path and query. Bump it when the voice or SSML changes.
- **Corpus drift.** New curriculum text has no clip until `npm run tts:render`; the online voice reads it meanwhile.
  - `npm run tts:check` lists phrases without a clip.
  - In dev builds, `window.__ttsMisses` records text that had no clip.
- **iOS autoplay.** One shared `<audio>` element is unlocked with a moment of silence on `touchend` / `click` / `keydown` (`audioUnlock.ts`), retried until a sound plays. A blocked `play()` falls back to the device voice. Not yet tried on a real iPhone.
- **Safari and service workers.** Clips are loaded with `fetch()` into object URLs. Safari won't play media that a service worker answers without byte ranges.
- **Other risks:**
  - Azure might retire a voice; voices and SSML live only in `api/_lib/azureTts.ts`.
  - Vercel Hobby is for non-commercial use.
  - Check Microsoft's terms for redistributing synthesized audio.

## Measured in production (2026-10-19, from Israel, Vercel edge `fra1`)

- `/api/tts`, first request for a phrase (function cold start + Azure `qatarcentral`): **2.1 s**, then `X-Vercel-Cache: HIT` at **0.33–0.49 s**. On the device, a repeat is served from CacheStorage.
- A rendered clip (`/tts/v1/female/*.mp3`, ~28 KB): **0.46 s** on a CDN miss.
- A non-canonical query (`&x=1`) is rejected with 400.

## Still to check

- On real Android and iPhone devices, the settings preview (a sample sentence, then typed text twice) should sound natural, with the first play of typed text quick enough. An iPhone also checks the audio unlock (`audioUnlock.ts`).
