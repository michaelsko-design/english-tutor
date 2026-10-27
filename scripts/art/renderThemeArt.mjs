/**
 * Art for the three grown-up themes (focus-desk, urban-night, travel-journal) and their mascots
 * (sage, kai, atlas). Flatter and more grown-up than the kid themes: thin outlines, flat fills,
 * no blush or sparkle. Each theme gets map-bg, home-scene and room-bg; each mascot gets one sheet
 * with all five poses, so the character stays the same in every pose. The sheets are cut into
 * single poses by scripts/art/slice_companion_sheets.py, then scripts/process_art.py makes the WebP.
 *
 * Usage:
 *   node scripts/art/renderThemeArt.mjs pilot [key ...]   render now (default: sage's sheet and focus-desk's map-bg)
 *   node scripts/art/renderThemeArt.mjs submit            every missing picture as one batch (50% discount)
 *   node scripts/art/renderThemeArt.mjs status
 *   node scripts/art/renderThemeArt.mjs collect
 *   node scripts/art/renderThemeArt.mjs list              every key and whether its file exists
 * Keys: <theme>/<scene> (e.g. focus-desk/map-bg) and companion/<mascot> (e.g. companion/sage).
 * Pictures land in art-src/<theme>/<scene>.png and art-src/companion-sheets/<mascot>.png.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const MODEL = 'gemini-3.1-flash-image'; // the lite model only draws 1K, too small for map-bg
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const STATE_FILE = join(process.cwd(), '.art-gemini-theme-batches.json');
const ART_SRC = join(process.cwd(), 'art-src');
const IMAGE_SIZE = '2K'; // map-bg is shown 1080 wide, and process_art.py never enlarges
const PILOT_KEYS = ['companion/sage', 'focus-desk/map-bg'];

const STYLE_BASE =
  'Flat vector illustration for an English-learning app for teenagers (ages 12–18). Clean, modern and grown-up, like a good editorial or app illustration: flat colour fills, thin even outlines, at most one soft shade per colour, simple geometric shapes. Not childish: no blush, no sparkles, no glitter, no hearts, no rainbow colours. No text, no letters, no numbers, no logos, no watermark, no signature anywhere in the image.';

const THEMES = {
  'focus-desk': {
    palette:
      'Palette: warm off-white paper #FAF7F2, slate ink #334155 for lines and dark shapes, soft greys #E2E8F0 and #CBD5E1, and one teal accent #0F9D8A used sparingly. Calm, quiet and flat, with lots of empty space.',
    'map-bg':
      'A pale city plan seen from straight above, like a minimal metro map: a soft grid of light grey street blocks on warm off-white paper, a few small muted green parks, a thin pale river, tiny station dots in teal. The empty band is the corridor of one metro line: plain off-white, slightly lighter than the blocks around it.',
    'home-scene':
      'A calm study corner seen from the front: on the left a desk with an open laptop, a notebook, a desk lamp, a mug and a small plant, under a large window with soft morning light and a pale city outside. The right half is a plain light wall with a little shelf high up.',
    'room-bg':
      'A minimal modern room: warm off-white wall, a thin slate baseboard, a light oak wooden floor. The window shows a pale city skyline in the morning.',
  },
  'urban-night': {
    palette:
      'Palette: dark charcoal #16181D, graphite greys #23262E and #343844, cool light grey #C9CED8 for highlights, and one lime accent #B6F23A used sparingly (lit windows, a sign light, a road line). Night-time, moody but clean, flat.',
    'map-bg':
      'A city at night seen from straight above: dark charcoal rooftops and blocks, tiny warm and lime lit windows, small street lights, a few dark trees. The empty band is one dark asphalt road, plain and even, with a faint lime glow along its two edges and no road markings. It is the only wide or glowing road: no fork, no branch and no second road beside it; the other streets are thin, straight and unlit.',
    'home-scene':
      'A city street corner at night seen from the front: on the left a small building with a lit shop front (blank sign, no writing), a skate ramp and a street lamp; wet road with soft reflections. The right half is a quiet dark street and a skyline of dark buildings with a few lit windows.',
    'room-bg':
      'A loft room at night: dark charcoal wall with a subtle concrete texture, a thin lime-lit baseboard line, a dark grey floor. The window shows a night city skyline with lit windows.',
  },
  'travel-journal': {
    palette:
      'Palette: sand #E9DCC0 and light paper #F5EEDD, olive green #6E7B3A, navy blue #1F3557, a little terracotta #C0643F. A subtle paper grain texture, like a travel journal; ink-stamp shapes (round and rectangular postmarks, blank inside). Flat.',
    'map-bg':
      'An illustrated old-style world map on sand-coloured paper seen from straight above: olive green land, faded navy sea with thin wave lines, a small compass rose, a few tiny mountains, palm trees and a little ship, two or three blank round postmark stamps near the sides. The empty band is a plain light paper strip, where a dotted route will be drawn. It lies on top of the map: no land, island or coastline crosses or cuts it, so it is one unbroken strip from top to bottom.',
    'home-scene':
      'A traveller’s view seen from the front: on the left a small railway station with a platform, a vintage suitcase, a backpack and a blank departure board; beyond it olive hills and a winding road. The right half is open sky over distant mountains and sea, with one or two blank postmark stamps in the sky.',
    'room-bg':
      'A cosy traveller’s room: sand-coloured wall with a subtle paper texture, a thin olive baseboard, a warm wooden floor. The window shows a coast with olive hills and the navy sea.',
  },
};

const SCENES = {
  'map-bg': {
    aspectRatio: '9:16',
    rules: [
      'A tall portrait map background (1080 × 1935 when shown). The view is from straight above, a flat map, no horizon, no perspective.',
      'One empty winding band runs from the top edge to the bottom edge: it enters at the middle of the top edge (50% across) and leaves at the middle of the bottom edge (50% across), and in between it swings in three or four gentle, wide S-curves, its centre always staying between 35% and 65% of the width (a narrow, calm swing, well away from the sides). It only ever moves downward: going down the picture, every part of the band is lower than the part before it, with no loops, no hairpins, no U-turns and no part that turns back up.',
      'There is exactly one band, and it is one continuous unbroken strip: nothing crosses, cuts or interrupts it anywhere, and it never forks.',
      'The band is about 14% of the image width wide, the same width all the way, in one plain flat colour, completely empty: nothing is drawn on it or across it (the app draws its own path and stops on it).',
      'Everything else is small and quiet so that coins, labels and a character placed on top stay readable. No characters, no people, no animals.',
      'The picture fills the whole frame edge to edge, with no border, no frame and no white margins.',
    ].join('\n'),
  },
  'home-scene': {
    aspectRatio: '16:9',
    rules: [
      'A wide landscape background for the home screen. The main subject sits in the left third; the right two thirds and the bottom third stay calm and simple, because a character and a text card are placed over them.',
      'No characters, no people, no animals, no mascots.',
      'The picture fills the whole frame edge to edge, with no border, no frame and no white margins.',
    ].join('\n'),
  },
  'room-bg': {
    aspectRatio: '4:3',
    rules: [
      'An empty room seen straight from the front, flat, with only a little perspective on the floor. The back wall fills the top 60% of the picture, a thin baseboard runs across at 60% down, and the floor fills the bottom 40%.',
      'One window in the middle of the wall: from 35% to 65% across and from 14% to 52% down.',
      'Nothing else: no furniture, no rugs, no shelves, no pictures, no plants, no objects, no people, no animals (the app places furniture on top).',
      'The picture fills the whole frame edge to edge, with no border, no frame and no white margins.',
    ].join('\n'),
  },
};

const MASCOTS = {
  sage: 'Sage, a calm, wise owl: compact round body in slate blue-grey with a soft cream face disc and belly, small teal accents, round thin-rimmed glasses and over-ear headphones (teal ear cups) resting on its head. Calm, friendly, a little nerdy. Palette: slate #334155, blue-grey #64748B, cream #F3EBDD, teal #0F9D8A.',
  kai: 'Kai, a raccoon in an oversized charcoal hoodie with a lime drawstring and a lime stripe on the sleeve, dark grey baggy trousers and sneakers, holding a skateboard (lime wheels) in every one of the five poses (under an arm, or in a hand). Cool and relaxed rather than cute: half-lidded confident eyes, a small smirk, the classic dark eye mask and a ringed tail. Chunky, stylised proportions: a big head about one third of the total height, a short sturdy body and short legs, so the face still reads when the character is shown 40 pixels tall. Palette: charcoal #23262E, grey #8A909C, light grey #D5D9E0, lime #B6F23A.',
  atlas: 'Atlas, an otter explorer: warm brown fur with a light sand face and belly, an olive explorer vest over a cream shirt, a navy backpack with a rolled map, a camera on a strap around the neck and a small navy scarf, with a bare head (no hat, cap or hood in any pose). Curious and adventurous. Chunky, stylised proportions: a big head about one third of the total height, a short sturdy body and short legs, so the face still reads when the character is shown 40 pixels tall. Palette: brown #8A5A3C, sand #E9DCC0, olive #6E7B3A, navy #1F3557, terracotta #C0643F.',
};

// Described without the pose names: named poses come back with the names written under them.
const POSES = [
  'standing relaxed, facing the viewer, a small calm smile',
  'both arms raised in celebration, happy open smile',
  'one hand on the chin, eyes looking up and to the side, thinking',
  'embarrassed, one hand rubbing the back of the head, a small awkward grin',
  'one hand raised high, waving hello',
];

const SHEET_RULES = [
  'A character sheet of the same character in five poses, in one single row from left to right, in this order:',
  ...POSES.map((pose, i) => `${i + 1}. ${pose}`),
  'Every pose is the full body (head to feet), the same size, the same proportions and the same colours, standing on the same baseline. The five poses are evenly spaced, each in its own fifth of the width, with a wide empty white gap between neighbours: no pose touches or overlaps another or the edge of the image.',
  'A thin dark outline closes the whole silhouette of each pose. The character has no pure white areas: use cream or light grey instead of white. Anything worn on the head (a band, a hood) sits flat against it, with no background showing through between them.',
  'Plain pure white background (#FFFFFF) everywhere around the poses. No ground line, no ground shadows, no floor, no scenery. Absolutely no writing: no captions, no pose names, no labels, no numbers under or beside the poses.',
].join('\n');

/** Every picture this script draws: { key, path, prompt, aspectRatio }. */
function allJobs() {
  const scenes = Object.entries(THEMES).flatMap(([theme, spec]) =>
    Object.entries(SCENES).map(([scene, { aspectRatio, rules }]) => ({
      key: `${theme}/${scene}`,
      path: join(ART_SRC, theme, `${scene}.png`),
      prompt: [STYLE_BASE, spec.palette, '', spec[scene], '', rules].join('\n'),
      aspectRatio,
    })),
  );
  const sheets = Object.entries(MASCOTS).map(([id, character]) => ({
    key: `companion/${id}`,
    path: join(ART_SRC, 'companion-sheets', `${id}.png`),
    prompt: [STYLE_BASE, '', `Character: ${character}`, '', SHEET_RULES].join('\n'),
    aspectRatio: '16:9',
  }));
  return [...scenes, ...sheets];
}

function jobsByKey(keys) {
  const jobs = allJobs();
  return keys.map((key) => {
    const job = jobs.find((j) => j.key === key);
    if (!job) throw new Error(`Unknown key "${key}". Run "list" to see the keys.`);
    return job;
  });
}

function missingJobs() {
  return allJobs().filter((job) => !existsSync(job.path));
}

function readApiKey() {
  const envFile = join(process.cwd(), '.env.local');
  if (!existsSync(envFile)) throw new Error('Missing .env.local file');
  const match = readFileSync(envFile, 'utf8').match(/GEMINI_API_KEY=(.+)/);
  if (!match) throw new Error('GEMINI_API_KEY not found in .env.local');
  return match[1].trim();
}

function readState() {
  if (!existsSync(STATE_FILE)) return [];
  try {
    return JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  } catch (err) {
    throw new Error(`${STATE_FILE} is not valid JSON: ${err.message}`);
  }
}

function writeState(batches) {
  writeFileSync(STATE_FILE, JSON.stringify(batches, null, 2) + '\n');
}

function imageRequest(job) {
  return {
    contents: [{ role: 'user', parts: [{ text: job.prompt }] }],
    generationConfig: {
      responseModalities: ['IMAGE'],
      imageConfig: { aspectRatio: job.aspectRatio, imageSize: IMAGE_SIZE },
    },
  };
}

function imageFrom(response) {
  const part = response?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
  return part ? Buffer.from(part.inlineData.data, 'base64') : null;
}

function saveImage(job, buf) {
  mkdirSync(dirname(job.path), { recursive: true });
  writeFileSync(job.path, buf);
  console.log(`Saved ${job.key} -> ${job.path} (${(buf.length / 1024).toFixed(0)} KB)`);
}

async function pilot(apiKey, keys) {
  for (const job of jobsByKey(keys.length > 0 ? keys : PILOT_KEYS)) {
    const res = await fetch(`${API_BASE}/models/${MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(imageRequest(job)),
    });
    if (!res.ok) throw new Error(`Request for ${job.key} failed (${res.status}): ${await res.text()}`);
    const buf = imageFrom(await res.json());
    if (!buf) throw new Error(`No image in the response for ${job.key}`);
    saveImage(job, buf);
  }
}

async function submit(apiKey) {
  if (readState().length > 0) console.log('Warning: a batch is already in progress.');
  const missing = missingJobs();
  console.log(`${missing.length} picture(s) still to draw.`);
  if (missing.length === 0) return;

  const requests = missing.map((job) => ({ request: imageRequest(job), metadata: { key: job.key } }));
  const payload = {
    batch: {
      display_name: `theme-art-${Date.now()}`,
      input_config: { requests: { requests } },
    },
  };
  const res = await fetch(`${API_BASE}/models/${MODEL}:batchGenerateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Batch submission failed (${res.status}): ${await res.text()}`);
  const batch = await res.json();
  console.log(`Batch submitted: ${batch.name}`);
  writeState([...readState(), { name: batch.name, count: requests.length, submittedAt: new Date().toISOString() }]);
}

async function fetchBatch(apiKey, name) {
  const res = await fetch(`${API_BASE}/${name}?key=${apiKey}`);
  if (!res.ok) throw new Error(`Status query failed (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return { data, state: data.metadata?.state || data.state || 'UNKNOWN' };
}

async function status(apiKey) {
  const state = readState();
  if (state.length === 0) console.log(`No active batches in ${STATE_FILE}`);
  for (const b of state) {
    const { data, state: batchState } = await fetchBatch(apiKey, b.name);
    console.log(`${b.name} (${b.count} pictures, submitted ${b.submittedAt}): ${batchState}`);
    const stats = data.metadata?.batchStats;
    if (stats) console.log('Stats:', JSON.stringify(stats));
  }
}

async function batchItems(apiKey, batchData) {
  const inline =
    batchData.metadata?.output?.inlinedResponses?.inlinedResponses ||
    batchData.response?.inlinedResponses?.inlinedResponses ||
    batchData.output?.inlinedResponses?.inlinedResponses;
  if (inline) return inline;

  const file =
    batchData.metadata?.output?.responsesFile || batchData.response?.responsesFile || batchData.output?.responsesFile;
  if (!file) return [];
  const downloadBase = API_BASE.replace('/v1beta', '/download/v1beta');
  const res = await fetch(`${downloadBase}/${file}:download?alt=media`, { headers: { 'x-goog-api-key': apiKey } });
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${await res.text()}`);
  return (await res.text())
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => {
      const item = JSON.parse(l);
      return { ...item, metadata: item.metadata || { key: item.key } };
    });
}

async function collect(apiKey) {
  const jobs = allJobs();
  const remaining = [];
  let saved = 0;
  for (const b of readState()) {
    const { data, state } = await fetchBatch(apiKey, b.name);
    if (state !== 'BATCH_STATE_SUCCEEDED') {
      console.log(`${b.name}: ${state}, kept in the queue.`);
      remaining.push(b);
      continue;
    }
    for (const item of await batchItems(apiKey, data)) {
      const job = jobs.find((j) => j.key === item.metadata?.key);
      const buf = imageFrom(item.response);
      if (!job || !buf) {
        console.error(`${item.metadata?.key ?? '?'} has no image:`, item.error || 'empty response');
        continue;
      }
      saveImage(job, buf);
      saved++;
    }
  }
  writeState(remaining);
  console.log(`${saved} picture(s) written; ${missingJobs().length} still missing.`);
}

function list() {
  for (const job of allJobs()) console.log(`${existsSync(job.path) ? 'done   ' : 'missing'} ${job.key}`);
}

async function main() {
  const [command = 'status', ...args] = process.argv.slice(2);
  if (command === 'list') return list();
  const apiKey = readApiKey();
  if (command === 'pilot') await pilot(apiKey, args);
  else if (command === 'submit') await submit(apiKey);
  else if (command === 'status') await status(apiKey);
  else if (command === 'collect') await collect(apiKey);
  else console.log('Usage: node scripts/art/renderThemeArt.mjs [pilot [key ...]|submit|status|collect|list]');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
