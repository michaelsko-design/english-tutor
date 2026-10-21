/**
 * Room furniture sheet (shelves, sill, desk top, rug) for the room scene. One 3 x 3 sheet in the
 * house style (see renderIconBatch.mjs), cut into single pictures by scripts/art/slice_icon_sheets.py.
 *
 * Usage: node scripts/art/renderRoomFurniture.mjs [outFile]   (default art-src/room-furniture/sheet.png)
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const MODEL = 'gemini-3.1-flash-lite-image';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

const PROMPT = [
  'Cute 2.5D game furniture for a children’s English-learning app (ages 6–17). Soft rounded shapes, thick clean dark outlines, simple cel shading with one soft highlight, warm friendly lighting. No text, no letters, no numbers, no logos, no watermark.',
  'Outline colour: dark plum (#3B2A5A). Colour palette: peach #FFD9C7, rose #F27BA4, lavender #B39DDB, violet #9B5CF6, butter yellow #FFD66B, mint #8FDDB8, cream #FFF6EC; warm light-wood for the wood.',
  '',
  'Layout: a sheet of exactly nine separate pieces in a strict 3 × 3 grid on a plain pure white background, listed in reading order (left to right, top to bottom). Every piece is seen straight from the front with a slight look-down so the flat top surface shows as a thin lighter band above a thick front edge. Each piece is centered in its own equal square cell, fills about 80% of the cell width, has a wide white margin, and never touches another piece or the image edge. No items on the pieces, no ground shadows, no grid lines, no labels. All nine share the same line weight and look. Output: square 1:1 image, at least 1024 × 1024 pixels.',
  '',
  'Pieces:',
  '1. a long wooden wall shelf plank with two small curved wooden brackets underneath, light wood',
  '2. a short wooden wall shelf plank with two small brackets, painted lavender',
  '3. a thin floating wall shelf plank, painted mint, no brackets',
  '4. a narrow window sill ledge, cream colour with a wooden front edge',
  '5. a cozy wooden desk with a thick top, two simple legs and one small drawer, front view, light wood',
  '6. a low wide wooden floor shelf unit with two open cubby levels, empty, light wood',
  '7. a round fluffy rug seen from a slight angle as a flat ellipse, rose and cream stripes',
  '8. a corkboard sticker board in a wooden frame, empty, seen from the front',
  '9. a small round wooden side table with three legs, seen from the front',
].join('\n');

function readApiKey() {
  const envFile = join(process.cwd(), '.env.local');
  if (!existsSync(envFile)) throw new Error('Missing .env.local file');
  const match = readFileSync(envFile, 'utf8').match(/GEMINI_API_KEY=(.+)/);
  if (!match) throw new Error('GEMINI_API_KEY not found in .env.local');
  return match[1].trim();
}

const outFile = process.argv[2] || join(process.cwd(), 'art-src', 'room-furniture', 'sheet.png');
const res = await fetch(`${API_BASE}/models/${MODEL}:generateContent?key=${readApiKey()}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ role: 'user', parts: [{ text: PROMPT }] }],
    generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '1:1' } },
  }),
});
if (!res.ok) throw new Error(`Request failed (${res.status}): ${await res.text()}`);
const part = (await res.json())?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
if (!part) throw new Error('No image in the response');
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, Buffer.from(part.inlineData.data, 'base64'));
console.log(`Saved ${outFile}`);
