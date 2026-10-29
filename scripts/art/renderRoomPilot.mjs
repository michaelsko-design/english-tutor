/**
 * Pilot for the 2.5D "My English Room" redesign: two 3 x 3 sheets, drawn with one instant request each.
 *   rooms: the six theme rooms (empty, six cells used)
 *   items: Games Book, lamp and sofa in three themes (one theme per row)
 * Style and sheet rules: docs/image-generation-pipeline.md. Sheets are cut and mocked up afterwards.
 *
 * Usage: node scripts/art/renderRoomPilot.mjs prompts [rooms|items]   (no API call, no cost)
 *        node scripts/art/renderRoomPilot.mjs pilot rooms|items       (ONE paid request for that sheet)
 * Output: art-src/room-pilot/<sheet>.png
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const MODEL = 'gemini-3.1-flash-image';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const OUT_DIR = join(process.cwd(), 'art-src', 'room-pilot');

const HOUSE_STYLE =
  'Polished 2.5D game art for a children’s English-learning app (ages 6–17): soft rounded shapes with a gentle three-quarter depth, clean dark outlines, smooth cel shading with one soft highlight and one soft shade per colour, rich but friendly colours. No text, no letters, no numbers, no logos, no watermark, no faces on objects.';

const ROOM_THEMES = [
  {
    id: 'cozy-studio',
    idea: 'a cozy pastel bedroom-studio: rose-pink and cream wall with a soft stripe, warm honey-wood floor planks, a big arched window showing a sunny sky with fluffy clouds, white curtains tied back, a round woven rug edge, warm afternoon light',
  },
  {
    id: 'neon-pop',
    idea: 'a night-time pop-arcade bedroom: deep indigo wall with a glowing cyan neon tube trim along the baseboard and a magenta neon outline around the window, a dark plum floor with a faint reflective shine, the window shows a glowing city skyline at night, a few flat neon geometric wall decals',
  },
  {
    id: 'starlight-rpg',
    idea: 'a magical fantasy tower room at night: violet and indigo stone-and-wood wall with golden trim, a round arched window showing a huge crescent moon and stars, deep indigo wooden floor with a gold-edged rug edge, hanging golden star lanterns, soft moonlight',
  },
  {
    id: 'focus-desk',
    idea: 'a calm modern study room: warm off-white wall with a thin slate-blue band, light grey-oak floor, a wide square window with a clean city view in daylight, a plain roller blind, tidy and minimal with one teal accent',
  },
  {
    id: 'urban-night',
    idea: 'a city loft room at night: dark graphite brick wall, concrete-grey floor, a big industrial grid window showing city lights, a lime-green neon tube along the top of the wall, a few flat painted lime stripes, moody but clean',
  },
  {
    id: 'travel-journal',
    idea: 'an explorer’s study: sand and cream wall with a faded map pattern (no writing), dark wooden plank floor with a navy rug edge, a window showing mountains and a blue sky, olive-green curtains, a rope and a few pennant flags along the top of the wall',
  },
];

const ITEM_THEMES = [
  {
    id: 'cozy-studio',
    look: 'cozy pastel style: peach, rose, cream, butter yellow and lavender, soft rounded plush shapes, warm honey wood',
    book: 'a chunky padded hardcover game book lying flat, rose-pink cover with a cream page block, a lavender ribbon bookmark hanging out, a simple yellow star badge on the cover',
    lamp: 'a small desk lamp with a round cream fabric shade and a rose-pink ceramic base, warm glowing bulb light',
    sofa: 'a plump two-seat sofa in rose-pink with cream cushions and short honey-wood legs',
  },
  {
    id: 'neon-pop',
    look: 'neon arcade style: deep indigo and black bodies with glowing cyan and magenta neon edge trims, glossy highlights',
    book: 'a sleek game book lying flat, dark indigo cover with a glowing cyan neon edge outline and a magenta neon controller symbol on the cover, dark page block',
    lamp: 'a desk lamp made of a bent dark metal arm with a glowing magenta neon tube shade and a cyan neon ring at its base',
    sofa: 'a low modern two-seat sofa in dark indigo with glowing cyan neon strip along the bottom edge and magenta cushions',
  },
  {
    id: 'starlight-rpg',
    look: 'fantasy storybook style: royal violet, midnight indigo and shiny gold accents, ornate but simple shapes, little stars',
    book: 'a thick magical spell-tome lying flat, violet leather cover with golden corner plates, a golden clasp and a gold crescent moon and star on the cover, cream page block',
    lamp: 'a small magical lantern lamp with a gold frame, a glowing warm yellow orb inside and little gold stars hanging from it',
    sofa: 'a royal two-seat sofa in deep violet velvet with gold trim, tufted back, carved gold feet and a star-patterned cushion',
  },
];

const ROOM_RULES = [
  'Layout: a sheet in a strict 3 × 3 grid of nine equal square cells on a plain pure white background, with a thin white gutter between cells. Each of the cells listed below contains one complete room picture that fills its whole cell (full bleed inside the cell, but no part of the room crosses into another cell). Cells listed as empty stay completely empty, plain white. No grid lines, borders, frames, labels or cell numbers.',
  'Every room is the same view: a corner room seen from inside, the camera pulled far back and zoomed OUT so the whole room fits with lots of space: two walls meeting in a back corner in the middle-left of the picture, a clear baseboard along both walls, and a large open floor in the foreground that takes up about the lower 45% of the picture, with floor planks or tiles receding in soft perspective. The window is a normal-sized window (about one fifth of the picture width) on one wall, not filling the wall, with large plain empty wall areas on both sides of it (space for shelves and a board later). The floor is wide, open and completely empty, with its front edge cut off by the bottom of the picture. The room is EMPTY: no furniture, no shelves, no desk, no bed, no pictures on the wall, no characters, no objects on the floor, no rug in the middle of the floor. All six rooms share the same camera, proportions, line weight and level of detail, but each has its own colours, materials and mood.',
].join('\n');

const ITEM_RULES = [
  'Layout: a sheet of exactly nine separate pictures in a strict 3 × 3 grid of equal square cells on a plain pure white background, listed in reading order. Each picture is centred in its own cell, fills about 65–75% of it, has a wide white margin on all sides and never touches another picture or the image edge. No grid lines, borders, frames, labels or cell numbers. Each row is one theme: the three pictures of a row share its palette and materials, and the three rows must look clearly different from each other in colour, material and shape detail.',
  'Every object is drawn in the same low 2.5D view as the corner of a room seen from inside: the camera looks down at the object from a LOW angle of only about 12 degrees (nearly level, not from above), and the object is turned exactly 45 degrees to the right, so its long front side and its short left side are both visible. Because the camera is so low, the bottom edges of the object are nearly horizontal on screen: the long bottom edge slopes down to the right by only about 12 degrees, and the short bottom edge slopes down to the left by only about 12 degrees, the same shallow slopes as the baseboards of a room corner. Furniture stands on its legs and feet, which all rest on one flat ground plane; the bottom of the drawing is flat and level (never steeply tilted), nothing hovers. The book lies flat, seen from the same low angle. A thin dark outline closes the whole silhouette with no gaps; no pure white inside the drawings (use the lightest palette colour); no ground line, no table, no scene behind the objects. NO shadow under or around any object, EXCEPT in column 3 (see the cell list).',
].join('\n');

const COLS = ['book', 'sofa', 'sofaShadow'];

/** Light comes from the window on the left wall, so cast shadows fall to the right and slightly forward. */
const SHADOW_NOTE =
  ' IDENTICAL to the sofa in column 2, drawn the same size and angle, but WITH a baked-in cast shadow: the light comes from a window on the left wall, from the left and slightly from behind, so a soft-edged semi-transparent dark violet-grey shadow lies flat on the floor plane (using the same shallow ground slopes), touching the bottom of the legs and following the sofa’s own outline, stretching about 40% of the sofa’s width to the right of it and slightly toward the viewer. The shadow is a flat shape on the ground only, drawn on the plain white background';

export function buildRoomsPrompt() {
  const cells = ROOM_THEMES.map((theme, index) => {
    const row = Math.floor(index / 3) + 1;
    const col = (index % 3) + 1;
    return `Row ${row}, column ${col}: an empty room, ${theme.idea}.`;
  });
  const empties = [7, 8, 9].map((n) => `Row 3, column ${n - 6}: empty, plain white.`);
  return [HOUSE_STYLE, '', ROOM_RULES, '', 'Cells:', ...cells, ...empties].join('\n');
}

export function buildItemsPrompt() {
  const cells = ITEM_THEMES.flatMap((theme, rowIndex) =>
    COLS.map(
      (kind, colIndex) =>
        `Row ${rowIndex + 1}, column ${colIndex + 1} (${theme.id} theme, ${theme.look}): ${
          kind === 'sofaShadow' ? theme.sofa + SHADOW_NOTE : theme[kind]
        }.`
    )
  );
  return [HOUSE_STYLE, '', ITEM_RULES, '', 'Pictures:', ...cells].join('\n');
}

const SHEETS = { rooms: buildRoomsPrompt, items: buildItemsPrompt };

function readApiKey() {
  const envFile = join(process.cwd(), '.env.local');
  if (!existsSync(envFile)) throw new Error('Missing .env.local file');
  const match = readFileSync(envFile, 'utf8').match(/GEMINI_API_KEY=(.+)/);
  if (!match) throw new Error('GEMINI_API_KEY not found in .env.local');
  return match[1].trim();
}

async function drawSheet(name) {
  const prompt = SHEETS[name]();
  const res = await fetch(`${API_BASE}/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': readApiKey() },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['IMAGE'],
        imageConfig: { aspectRatio: '1:1', imageSize: '2K' },
      },
    }),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status}): ${await res.text()}`);
  const part = (await res.json())?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
  if (!part) throw new Error('No image in the response');
  mkdirSync(OUT_DIR, { recursive: true });
  const outFile = join(OUT_DIR, `${name}.png`);
  writeFileSync(outFile, Buffer.from(part.inlineData.data, 'base64'));
  console.log(`Saved ${outFile}`);
}

const [command, sheetName] = process.argv.slice(2);
const names = sheetName ? [sheetName] : Object.keys(SHEETS);
if (names.some((name) => !SHEETS[name])) throw new Error('Sheet must be rooms or items');

if (command === 'prompts') {
  for (const name of names) console.log(`===== ${name} =====\n${SHEETS[name]()}\n`);
} else if (command === 'pilot') {
  if (!sheetName) throw new Error('Name the sheet: pilot rooms|items (one paid request each)');
  console.log(`1 request: sheet "${sheetName}" (9 cells), model ${MODEL}, 2K`);
  await drawSheet(sheetName);
} else {
  console.log('Usage: renderRoomPilot.mjs prompts [rooms|items] | pilot rooms|items');
}
