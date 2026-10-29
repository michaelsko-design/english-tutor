# Image Generation Pipeline (Gemini, 3×3 sheets, batch mode)

A low-cost pipeline for producing large sets of consistent game/app art (icons, landmarks, mascots, scene pieces) with an image-generation model. It is plain Node (no dependencies, uses built-in `fetch`) plus Python (Pillow, numpy, scipy) for post-processing.

## 1. Overview

```
 spec file (subjects + style)
        │
        ▼
 pack subjects into 3×3 sheets ──► build one text prompt per sheet
        │
        ▼
 submit ALL sheets as ONE batch job (batchGenerateContent, 50% discount)
        │            (state file remembers batch name + sheet layout)
        ▼
 status … status … collect  ──► sheet PNGs saved
        │
        ▼
 slice sheet into single pictures (find empty gaps, warn on overlaps)
        │
        ▼
 post-process: white background → transparent, trim, resize, WebP
        │
        ▼
 shipped assets
```

Everything is driven by small CLI scripts with the same subcommands: `pilot`, `submit`, `status`, `collect` (plus `list` and `prompts` for dry inspection).

## 2. Cost-saving approach (the important part)

Three multiplicative savings:

| Technique | Effect |
|---|---|
| **3×3 sheets**: one request draws nine pictures in a grid | ~9× fewer billed image requests |
| **Batch mode** (async `batchGenerateContent`) | 50% discount vs. the instant API |
| **Cheap model for simple art** (a "flash-lite" image model for icons; the regular flash image model at 2K only where detail matters) | lower per-image price |

Combined, a picture costs roughly **1/18 of the naive "one picture per instant request"** price. (Check current Gemini pricing yourself; prices change. The point is the ratios.)

### Models used

| Model ID | Used for | Resolution / aspect |
|---|---|---|
| `gemini-3.1-flash-lite-image` | Icons, room furniture, story illustrations (simple art, cheapest) | 1K only (the lite model cannot draw larger); icons and furniture 1:1 sheets, stories 16:9 |
| `gemini-3.1-flash-image` | Mission art / landmarks, themed scenes (map, home, room backgrounds) | Supports `imageSize` `2K` (sheets 1:1; scenes 9:16, 16:9, 4:3) |

The model is a single `MODEL` constant at the top of each render script, so it is easy to swap. Pick the cheapest model whose maximum resolution still gives enough pixels per cell: 1K sheet → cells ≈ 340 px (fine for icons shown ≤ 128 px); 2K sheet → cells ≈ 680 px (needed for landmarks and backgrounds). Model IDs, prices and supported sizes change over time, so check the current Gemini model list and pricing page before you start.

Rules of thumb we follow:

1. **Never one picture per request.** Every request is a full 3×3 sheet. A short last sheet leaves cells empty ("stay completely empty" in the prompt) rather than being sent partly filled mid-run.
2. **Never use instant calls for mass generation.** Instant (`generateContent`) is only for a single-sheet **pilot** to check the style before the real run. The pilot is itself one sheet = nine pictures, not one picture.
3. **Redraws go into a batch sheet too.** Bad pictures are re-queued by key and packed into new sheets with other missing pictures (redraws first), so a redraw never costs a full-price single request.
4. **Only draw what is missing.** The scripts check whether each output file already exists and only pack the missing ones. Re-running `submit` is idempotent.
5. **State the request count before every paid run.** `submit` prints "N picture(s) on M sheet(s) to draw" and `prompts` prints every prompt without calling the API. Use `prompts` first; a bad prompt multiplied by a whole batch is the expensive mistake.
6. **Keep resolution only as high as needed.** Icons: 1K sheet (cell ≈ 340 px, shown at ≤ 128 px). Detailed landmarks: 2K sheet (cell ≈ 680 px). Square 1:1 aspect ratio always, so cells are square and slicing is simple.
7. **Pilot before scaling.** Draw one themed sheet, eyeball it, tune the style prompt, and only then submit everything.

## 3. API details

Base: `https://generativelanguage.googleapis.com/v1beta`

**Instant (pilot only)** — `POST /models/{MODEL}:generateContent`

```json
{
  "contents": [{ "role": "user", "parts": [{ "text": "<sheet prompt>" }] }],
  "generationConfig": {
    "responseModalities": ["IMAGE"],
    "imageConfig": { "aspectRatio": "1:1", "imageSize": "2K" }
  }
}
```

(`imageSize` omitted = default 1K.) The image is in `candidates[0].content.parts[].inlineData.data` (base64 PNG).

**Batch** — `POST /models/{MODEL}:batchGenerateContent`

```json
{
  "batch": {
    "display_name": "icon-sheets-<timestamp>",
    "input_config": {
      "requests": {
        "requests": [
          { "request": { ...same body as above... }, "metadata": { "key": "<sheet id>" } }
        ]
      }
    }
  }
}
```

The response has `name` (e.g. `batches/abc123`). Put a unique `metadata.key` on each request; results come back carrying it, which is how you match a returned image to the sheet layout.

**Status** — `GET /{batch name}`; read `metadata.state` (`BATCH_STATE_SUCCEEDED` when done) and optional `metadata.batchStats`. Batches complete asynchronously (minutes to hours; the service targets within 24 h).

**Results** — either inline (`metadata.output.inlinedResponses.inlinedResponses`) or as a JSONL file (`responsesFile`) downloaded from `/download/v1beta/{file}:download?alt=media`. Handle both shapes; each item is `{ metadata: {key}, response: {...} | error }`. Items can fail individually, so log items with no image and leave those pictures "missing" so the next `submit` re-queues them.

Auth: this project reads `GEMINI_API_KEY` from a git-ignored `.env.local` and passes it as `?key=`. Prefer the `x-goog-api-key` header instead (keeps the key out of URLs and logs; the download call already uses it).

## 4. Persistent batch state

Batches outlive the process, so each script keeps a small JSON state file (git-ignored), e.g. `.art-gemini-mission-batches.json`:

```json
[{
  "name": "batches/abc123",
  "theme": "some-theme",
  "count": 27,
  "submittedAt": "…",
  "sheets": [
    { "id": "1730000000000-1", "columns": 3,
      "cells": [{ "key": "theme/boss", "row": 0, "col": 0, "span": 1 }] }
  ]
}]
```

- `status` polls every entry.
- `collect` downloads finished ones, saves + slices sheets, and **keeps unfinished batches in the file** (only finished ones are removed).
- The sheet layout (which subject sits in which cell) is stored *in the state*, because it must be known when the result arrives, possibly in a later session. It is also written next to each saved sheet as `<sheet>.json` so a sheet can be re-sliced later without the API.
- `submit` warns if a batch is already in progress, to avoid paying twice for the same missing pictures.

## 5. Spec files and sheet packing

**Subject spec.** Each art set is data, not code: a list of `{ id, sheet?, subject }` (icons: `iconList.json`, ≈ 300 entries each assigned a sheet number, max nine per sheet) or a per-theme spec with `style`, `landmarkIdea`, and groups of `singles`, `pairs`, `landmarks` (`missionArtThemes.mjs`). A theme can have `styleVariants`; `theme:variant` draws the same subjects in another style, into a separate folder, for cheap A/B comparison in a pilot.

**Packing** (`missionArtSheets.mjs`). Jobs are placed greedily in reading order into a 3×3 grid:

- Single = 1 cell. **Pair** (e.g. closed/open chest) = 2 adjacent cells in one row, so both halves come out at the same size/angle/colours.
- First free spot that fits the span; a single fills the gap a pair leaves.
- `takeOneSheet` takes the longest prefix that fits; repeat until all jobs are placed. The last sheet is short and its unused cells are listed as "empty, plain white".

## 6. Prompt structure (per sheet)

Assembled in this order:

1. **Style block**: art style, line weight, shading, palette with hex colours, outline colour, "must stay readable at 64 px".
2. **No-text rule**: no text/letters/numbers/logos/watermarks (image models love to letter signs). Subject descriptions have unit/place names stripped so the model isn't tempted to write them.
3. **Layout rules**: "strict 3 × 3 grid of equal square cells on a plain pure white background; each picture centred in its own cell, filling ~65–75% of it, wide empty white margin on all sides; nothing touches another picture or the edge; no grid lines, borders, frames, labels, cell numbers; all pictures share line weight, lighting and detail level as one matching set".
4. **Cell list** in reading order: `Row 2, column 3 (a single picture): <subject>`; pairs get `Row 1, columns 1 and 2 (one pair: …same size, same angle, same colours, same baseline…)`. Unused cells: `Row 3, column 2: empty, plain white.`
5. **Cut-out rules**: thin dark outline closing the whole silhouette with no gaps; *no pure white inside the drawing* (use the palette's lightest colour — pure white is reserved for background); no ground line, shadow, table, scene, frame or card behind the object.

Why white + closed outline: it makes the later background removal a simple flood fill.

## 7. Slicing sheets back into pictures

The model never puts its grid exactly on thirds, so naive `size/3` cuts slice through drawings. `slice_mission_sheet.py` / `slice_icon_sheets.py` (Pillow + numpy):

1. Build a "drawing mask": pixel is drawing if `255 - min(R,G,B) > 40` (tolerance for off-white).
2. For each cut line, search a window (±12% of the sheet) around the nominal third and cut through the **middle of the nearest run of empty rows/columns** (≤ 4 drawing pixels counts as empty). Fall back to the emptiest line.
3. Row cuts are computed within each column's band and column cuts within each row's band, so one large picture doesn't shift its neighbours' cuts.
4. For a pair (span 2), crop each cell with its own box and paste onto one wide white canvas.
5. **Quality check**: if drawing touches the outer edge of a sliced picture, a cut went through it (two pictures overlapped). Print a warning naming it; the fix is to re-queue that key in the next batch.

## 8. Post-processing to shippable assets

`process_art.py` turns white-background PNG/JPG into app-ready WebP:

- **Background removal**: flood fill from the image edges through near-white pixels (tolerance ≈ 22). Works because the outline closes the silhouette. Optional handling for enclosed white (inside loops/handles) via a size/brightness/warmth heuristic, with an explicit allow-list for pictures where enclosed white is real paint (snow, a blank canvas).
- **Ground-shadow removal**: low-saturation grey-mauve regions are dropped (the app draws its own shadow so the sprite can animate).
- **Trim + margin** (≈ 8% free space), centre on a square canvas, output at 2 sizes (e.g. 512/256 for sprites, 256/128 for icons) as WebP with alpha.
- **Pose sets**: scale all poses of a mascot to the same height and bottom-centre them on the same canvas so poses swap in place.
- Full-frame backgrounds (maps, rooms) are only resized, never enlarged.
- Missing source files are skipped and reported; the app has fallbacks for absent art.

## 9. Typical workflow

```bash
node scripts/art/renderMissionArt.mjs list <theme>            # what exists / is missing
node scripts/art/renderMissionArt.mjs prompts <theme>         # read the prompts, no API call, no cost
node scripts/art/renderMissionArt.mjs pilot <theme>           # one small instant run to check the style
node scripts/art/renderMissionArt.mjs submit <theme>          # everything missing, one batch, 50% off
node scripts/art/renderMissionArt.mjs status                  # repeat until BATCH_STATE_SUCCEEDED
node scripts/art/renderMissionArt.mjs collect                 # saves sheets, slices automatically
python scripts/process_art.py common/<theme> landmarks/<theme>   # transparent WebP
# bad ones: submit <theme> <key> [<key> …]  → redrawn inside the next batch
```

## 10. Lessons learned

- A run of ~57 **single-picture instant** requests plus full-price redraws burned through prepaid credits; this is why sheets + batch are mandatory and the request count is stated before each paid run.
- Keep sheets **white-backgrounded and unframed**; coloured tiles, scenes or shadows behind objects break background removal.
- "Filling ~65–75% of the cell with wide margins" is what makes slicing reliable; asking for bigger pictures causes overlaps.
- Put pairs on the same row so left/right variants match in size and angle.
- A style pilot of one sheet is cheap insurance; compare style variants there, not after the full batch.
- Treat all sheets as untrusted: always run the cut-through warning and eyeball a contact sheet before shipping.

## 11. Minimal skeleton to reimplement

1. `spec.json` → list of `{id, subject}` plus a style string.
2. `pack(jobs)` → arrays of ≤ 9 (add span logic only if you need pairs).
3. `buildPrompt(sheet)` → style + layout rules + numbered cells + cut-out rules.
4. `submit` → one `batchGenerateContent` with one request per sheet, `metadata.key = sheetId`; persist `{batchName, sheets}` to a state file.
5. `status` / `collect` → poll; on success parse inline or JSONL results, write `sheet-<id>.png`, remove the batch from state.
6. `slice` → gap-seeking cuts + edge-touch warning.
7. `process` → flood-fill transparency, trim, resize, WebP.
8. Skip any output that already exists, so every run only pays for what is missing.
