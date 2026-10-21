/**
 * Icon generation for the room items, shop, wardrobe and dock tiles (replaces the platform emoji).
 * Same house style as the other generated art (scripts/art/renderStoryBatch.mjs). To save cost,
 * each request draws a 3 x 3 sheet of icons (9 icons for the price of one 1K image); the sheets are
 * cut into single pictures by scripts/art/slice_icon_sheets.py.
 *
 * Usage:
 *   node scripts/art/renderIconBatch.mjs pilot [outDir]   one sheet (the first), rendered at once
 *   node scripts/art/renderIconBatch.mjs submit           every missing sheet as one batch (50% discount)
 *   node scripts/art/renderIconBatch.mjs status
 *   node scripts/art/renderIconBatch.mjs collect
 * Sheets land in art-src/icon-sheets/sheet-<n>.png (n is the "sheet" number of the icons in iconList.json, at most nine per sheet).
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const MODEL = 'gemini-3.1-flash-lite-image';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const STATE_FILE = join(process.cwd(), '.art-gemini-icon-batches.json');
const SHEETS_DIR = join(process.cwd(), 'art-src', 'icon-sheets');
const ICON_LIST = join(process.cwd(), 'scripts', 'art', 'iconList.json');
const SHEET_COLUMNS = 3;
const ICONS_PER_SHEET = SHEET_COLUMNS * SHEET_COLUMNS;

const STYLE_BASE =
  'Cute 2.5D game icons for a children’s English-learning app (ages 6–17). Soft rounded shapes, thick clean dark outlines, simple cel shading with one soft highlight, warm friendly lighting. Each icon must stay readable when shrunk to 64 pixels. No text, no letters, no numbers, no logos, no watermark, no signature anywhere in the image.';
const PALETTE_COZY =
  'Outline colour: dark plum (#3B2A5A). Colour palette: peach #FFD9C7, rose #F27BA4, lavender #B39DDB, violet #9B5CF6, butter yellow #FFD66B, mint #8FDDB8, cream #FFF6EC.';
const SHEET_RULES = [
  'Layout: a sheet of exactly nine separate icons in a strict 3 × 3 grid (three rows, three columns) on a plain pure white background. The icons are listed below in reading order: left to right, top to bottom.',
  'Every icon is one single object (or one single pair), centered in its own equal square cell, filling about 65% of the cell, with a wide empty white margin on all sides so that no icon touches or overlaps another icon or the edge of the image. No grid lines, no cell borders, no frames, no ground shadows, no labels.',
  'All nine icons share the same line weight, lighting and level of detail, as one matching set. Output: square 1:1 image, at least 1024 × 1024 pixels.',
].join('\n');

function loadIcons() {
  return JSON.parse(readFileSync(ICON_LIST, 'utf8'));
}

/** The icons of each sheet, in sheet order; every icon in iconList.json names its sheet number. */
function groupBySheet(list) {
  const sheets = new Map();
  for (const icon of list) sheets.set(icon.sheet, [...(sheets.get(icon.sheet) ?? []), icon]);
  return [...sheets.entries()].sort(([a], [b]) => a - b).map(([n, icons]) => ({ n, icons }));
}

function buildSheetPrompt(icons) {
  const cells = icons.map((icon, i) => `${i + 1}. ${icon.subject}`).join('\n');
  const spare = ICONS_PER_SHEET - icons.length;
  const spareNote = spare > 0 ? `\nThe last ${spare} cell(s) stay completely empty.` : '';
  return [STYLE_BASE, PALETTE_COZY, '', SHEET_RULES, '', 'Icons:', cells + spareNote].join('\n');
}

function sheetPath(n) {
  return join(SHEETS_DIR, `sheet-${n}.png`);
}

/** The sheets still to draw, as { n, icons } (n is the 1-based sheet number). */
function missingSheets() {
  return groupBySheet(loadIcons()).filter(({ n }) => !existsSync(sheetPath(n)));
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
  } catch {
    return [];
  }
}

function writeState(batches) {
  writeFileSync(STATE_FILE, JSON.stringify(batches, null, 2) + '\n');
}

function sheetRequest(icons) {
  return {
    contents: [{ role: 'user', parts: [{ text: buildSheetPrompt(icons) }] }],
    generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '1:1' } },
  };
}

function imageFrom(response) {
  const part = response?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
  return part ? Buffer.from(part.inlineData.data, 'base64') : null;
}

async function pilot(apiKey, outDir) {
  const [{ icons: first }] = groupBySheet(loadIcons());
  const res = await fetch(`${API_BASE}/models/${MODEL}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sheetRequest(first)),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status}): ${await res.text()}`);
  const buf = imageFrom(await res.json());
  if (!buf) throw new Error('No image in the response');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'sheet-1.png'), buf);
  console.log(`Saved sheet-1.png (${(buf.length / 1024).toFixed(0)} KB) with: ${first.map((i) => i.id).join(', ')}`);
}

async function submit(apiKey) {
  if (readState().length > 0) console.log('Warning: a batch is already in progress.');
  const missing = missingSheets();
  console.log(`${missing.length} sheet(s) still to draw.`);
  if (missing.length === 0) return;

  const requests = missing.map(({ n, icons }) => ({ request: sheetRequest(icons), metadata: { key: String(n) } }));
  const payload = {
    batch: {
      display_name: `icon-sheets-${Date.now()}`,
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
    console.log(`${b.name} (${b.count} sheets, submitted ${b.submittedAt}): ${batchState}`);
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
  const remaining = [];
  let saved = 0;
  mkdirSync(SHEETS_DIR, { recursive: true });
  for (const b of readState()) {
    const { data, state } = await fetchBatch(apiKey, b.name);
    if (state !== 'BATCH_STATE_SUCCEEDED') {
      console.log(`${b.name}: ${state}, kept in the queue.`);
      remaining.push(b);
      continue;
    }
    for (const item of await batchItems(apiKey, data)) {
      const key = item.metadata?.key;
      const buf = imageFrom(item.response);
      if (!key || !buf) {
        console.error(`Sheet ${key ?? '?'} has no image:`, item.error || 'empty response');
        continue;
      }
      writeFileSync(sheetPath(key), buf);
      console.log(`Saved sheet-${key}.png (${(buf.length / 1024).toFixed(0)} KB)`);
      saved++;
    }
  }
  writeState(remaining);
  console.log(`${saved} sheet(s) written; ${missingSheets().length} still missing.`);
}

async function main() {
  const command = process.argv[2] || 'status';
  const apiKey = readApiKey();
  if (command === 'pilot') await pilot(apiKey, process.argv[3] || SHEETS_DIR);
  else if (command === 'submit') await submit(apiKey);
  else if (command === 'status') await status(apiKey);
  else if (command === 'collect') await collect(apiKey);
  else console.log('Usage: node scripts/art/renderIconBatch.mjs [pilot|submit|status|collect]');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
