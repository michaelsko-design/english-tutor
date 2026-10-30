/**
 * Pilot: a room picture with its fixed furniture drawn in (bed, wardrobe, desk, two wall shelves), so
 * the furniture shares the room's own camera and light. Only the small items stay movable.
 * Every theme uses the same LAYOUT (the same pieces in the same places), for familiarity.
 * Room wording from renderRoomPilot.mjs, furniture wording from roomArtSpec.mjs.
 *
 * Usage: node scripts/art/renderBakedRoom.mjs prompt|prompt-options <theme>   (no API call, no cost)
 *        node scripts/art/renderBakedRoom.mjs options <theme> --yes   (ONE paid request: 2 × 2 sheet of four takes)
 *        node scripts/art/renderBakedRoom.mjs draw <theme> [--ref <png> --change <text> ...] --yes
 *          (ONE paid request: the room alone, or a small fix of a picked take)
 * Output: art-src/room-baked/<theme>-options.png, art-src/room-baked/<theme>.png
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { HOUSE_STYLE, THEME_LOOKS } from './roomArtSpec.mjs';

const MODEL = 'gemini-3.1-flash-image';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const OUT_DIR = join(process.cwd(), 'art-src', 'room-baked');

/** The room itself, as the empty rooms were described (renderRoomPilot.mjs). */
const ROOM_IDEAS = {
  'cozy-studio':
    'a cozy pastel bedroom-studio: rose-pink and cream wall with a soft stripe, warm honey-wood floor planks, a big arched window showing a sunny sky with fluffy clouds, white curtains tied back, warm afternoon light',
  'neon-pop':
    'a night-time pop-arcade bedroom: deep indigo wall with a glowing cyan neon tube trim along the baseboard and a magenta neon outline around the window, a dark plum floor with a faint reflective shine, the window shows a glowing city skyline at night, a few flat neon geometric wall decals',
  'starlight-rpg':
    'a magical fantasy tower room at night, built like a timber-framed attic: dark brown-violet wooden beams frame the room — a thick vertical post in the back corner, a beam along the top of each wall and curved diagonal braces under it; the upper walls are smooth lavender-violet plaster, the lower walls are dark indigo stone blocks, and a gold-trimmed wooden rail runs along both walls on top of the stone; a BIG round-arched window with a thick grey stone frame shows a huge glowing cream crescent moon and twinkling stars in a deep blue night sky; three glowing golden star lanterns hang on long gold cords from the top beams; deep indigo wooden floor planks; soft moonlight and warm star-lantern glow',
  'focus-desk':
    'a calm modern study room: warm off-white wall with a thin slate-blue band, light grey-oak floor, a wide square window with a clean city view in daylight, a plain roller blind, tidy and minimal with one teal accent',
  'urban-night':
    'a city loft room at night: dark graphite brick wall, concrete-grey floor, a big industrial grid window showing city lights, a lime-green neon tube along the top of the wall, a few flat painted lime stripes, moody but clean',
  'travel-journal':
    'an explorer’s study: sand and cream wall with a faded map pattern (no writing), dark wooden plank floor, a window showing mountains and a blue sky, olive-green curtains, a rope and a few pennant flags along the top of the wall',
};

const CAMERA = [
  'The view: we stand INSIDE the room, near the front of it, looking toward a back corner where two walls meet in one vertical corner a little left of the middle of the picture, so both walls are wide. The picture is cropped inside the room on all four sides: the walls run off the top and the left and right edges, and the floor runs off the bottom edge. It is NOT a cut-away box or diorama: no outside of the room, no white or empty background, no top edges or thickness of the walls, no edge of the floor slab.',
  'The camera is LOW, about at the height of a child’s eyes, and looks almost straight ahead, NOT from above: the lines where the walls meet the floor slant only gently (much flatter than isometric game art): along the left wall the floor line slants gently down toward the left edge of the picture, along the right wall it slants gently down toward the right edge. A clear baseboard runs along both walls. The floor takes up about the lower 45% of the picture, its planks receding in soft perspective.',
].join(' ');

/** Where each fixed piece stands: the same in every theme. Pieces stand against the walls so the middle of the floor stays free. */
const LAYOUT = [
  'The window is in the middle of the LEFT wall, set high enough that the bed fits under it.',
  'THE BED stands in the back corner: its headboard is flat against the RIGHT wall, touching it, and its long side is flat against the LEFT wall, so it runs from the corner along the left wall toward the viewer, under the window, with its foot end toward the front-left. None of it reaches the middle of the floor.',
  'THE WARDROBE stands with its back flat against the LEFT wall, at the far front-left end of that wall, almost at the left edge of the picture, leaving a wide strip of open floor between it and the foot of the bed; its doors face into the room. It is the tallest piece, reaching about two thirds of the way up the wall.',
  'THE DESK stands with its back flat against the RIGHT wall, touching it, far to the right, almost at the right edge of the picture, with a wide stretch of bare wall and floor between the headboard and the desk, so the desk hides no part of the bed. Its long side runs along the wall. Its top is completely empty.',
  'THE TWO WALL SHELVES hang on the RIGHT wall above the desk, both empty, staggered: the upper shelf a little further to the left and the lower shelf a little further to the right, the lower one well above the desk top; they run along the wall at the same slant as the wall.',
  'To the right of the desk and the shelves, the rest of the right wall is plain empty wall, and the floor in front of it is empty.',
  'Everything else is EMPTY: the whole middle and front of the floor is open, bare floor with no rug; no other furniture, no chair, no sofa, no pictures on the walls, no objects on the desk, the shelves, the bed or the floor, no characters.',
  'Every piece is drawn in the room’s own perspective: its edges along a wall run exactly parallel to that wall’s floor line, its edges reaching out from a wall run parallel to the other wall’s floor line, and its upright edges are exactly vertical. Each piece stands on the floor with all its feet, and casts a soft shadow on the floor and wall that matches the room’s light.',
];

/** The pieces, worded as in roomArtSpec.mjs. */
const PIECES = {
  bed: 'a single bed with a headboard, a pillow and a folded blanket',
  wardrobe: 'a tall two-door wardrobe with two simple handles, closed',
  desk: 'a study desk with a thick flat top, one drawer and four legs, the top completely empty',
  shelves: 'two wooden wall shelf planks with two small brackets underneath each, empty (the upper one short, the lower one long)',
};

/**
 * With a picked take as reference: keep everything, change only what `--change` asks (repeatable). The
 * model redraws the whole picture, and a change that moves a big piece tends to come back unchanged:
 * use this for small fixes (Starlight's staggered shelves), and a new options sheet for a new layout.
 */
function referenceNote(changes) {
  return [
    'EDIT the attached picture, the approved draft of this room. Keep everything exactly as it is — the camera, framing, style, colours, walls, window, lanterns, floor and every piece of furniture in its place — and draw it again as one finished full-bleed picture at full detail, changing ONLY this, which must be clearly visible:',
    ...changes.map((change) => `- ${change}`),
  ].join('\n');
}

/** Four takes of one room on one sheet, to pick the best as the reference for the full render. */
const OPTIONS_SHEET =
  'A sheet of FOUR alternative pictures of the same room, in a 2 × 2 grid of four equal cells, each cell wider than it is tall (4:3), with a thin plain white gutter between the cells. Every cell is one complete room picture filling its whole cell edge to edge (full bleed inside the cell, cropped inside the room as described below). The four follow the same description, camera and furniture layout, but each is its own take, with its own furniture designs and small details, so they can be compared. No labels, numbers, frames or borders anywhere.';

export function buildPrompt(theme, isOptionsSheet = false, changes = []) {
  if (!ROOM_IDEAS[theme]) throw new Error(`Unknown theme: ${theme}`);
  const look = THEME_LOOKS[theme];
  return [
    HOUSE_STYLE,
    '',
    isOptionsSheet ? OPTIONS_SHEET : 'One single full-bleed picture of a room (not a sheet, no frame, no border).',
    '',
    `The room: ${ROOM_IDEAS[theme]}.`,
    '',
    CAMERA,
    '',
    `The furniture, all in the room’s style (${look}):`,
    ...Object.entries(PIECES).map(([name, text]) => `- the ${name}: ${text}.`),
    '',
    'Where everything is:',
    ...LAYOUT.map((line) => `- ${line}`),
    ...(changes.length > 0 ? ['', referenceNote(changes)] : []),
  ].join('\n');
}

function readApiKey() {
  const envFile = join(process.cwd(), '.env.local');
  if (!existsSync(envFile)) throw new Error('Missing .env.local file');
  const match = readFileSync(envFile, 'utf8').match(/GEMINI_API_KEY=(.+)/);
  if (!match) throw new Error('GEMINI_API_KEY not found in .env.local');
  return match[1].trim();
}

async function draw(theme, isOptionsSheet, referenceFile, changes) {
  const referencePart = referenceFile
    ? [{ inlineData: { mimeType: 'image/png', data: readFileSync(referenceFile).toString('base64') } }]
    : [];
  const res = await fetch(`${API_BASE}/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': readApiKey() },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [...referencePart, { text: buildPrompt(theme, isOptionsSheet, changes) }] }],
      generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '4:3', imageSize: '2K' } },
    }),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status}): ${await res.text()}`);
  const part = (await res.json())?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
  if (!part) throw new Error('No image in the response');
  mkdirSync(OUT_DIR, { recursive: true });
  const outFile = join(OUT_DIR, `${theme}${isOptionsSheet ? '-options' : ''}.png`);
  writeFileSync(outFile, Buffer.from(part.inlineData.data, 'base64'));
  console.log(`Saved ${outFile}`);
}

const [command, theme, ...flags] = process.argv.slice(2);
const isOptionsSheet = command === 'options';
const refIndex = flags.indexOf('--ref');
const referenceFile = refIndex >= 0 ? flags[refIndex + 1] : undefined;
const changes = flags.flatMap((flag, index) => (flag === '--change' ? [flags[index + 1]] : []));
if (referenceFile && changes.length === 0) throw new Error('With --ref, say what to change: --change "<text>" (repeatable)');
if ((command === 'prompt' || command === 'prompt-options') && theme) {
  console.log(buildPrompt(theme, command === 'prompt-options', changes));
} else if ((command === 'draw' || isOptionsSheet) && theme) {
  const what = isOptionsSheet ? '2 × 2 sheet of four takes of' : 'room';
  console.log(`1 instant request: ${what} "${theme}" with its furniture${referenceFile ? ', with a reference picture' : ''}, model ${MODEL}, 2K, 4:3`);
  if (!flags.includes('--yes')) throw new Error('Add --yes to send the paid request');
  await draw(theme, isOptionsSheet, referenceFile, changes);
} else {
  console.log('Usage: renderBakedRoom.mjs prompt|prompt-options <theme> | draw|options <theme> [--ref <png> --change <text> ...] --yes');
}
