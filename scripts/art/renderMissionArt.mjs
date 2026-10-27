/**
 * Each theme's own mission art (ThemeBase.missionArtFolder): the Boss stop, the reward chest, the
 * level badge and one landmark per unit, drawn in the theme's style from the subjects in
 * scripts/art/missionArtThemes.mjs. Cozy keeps the shared set in /art/common and /art/landmarks.
 * Pictures are drawn up to nine to a sheet (scripts/art/missionArtSheets.mjs: a 3 x 3 grid at 2K,
 * one request for nine pictures). Each sheet is kept in art-src/mission-sheets/<theme>/ and cut
 * into pictures by scripts/art/slice_mission_sheet.py as soon as it arrives. Everything is drawn
 * on white, so scripts/process_art.py can cut it out:
 *   python scripts/process_art.py common/<theme> landmarks/<theme>
 *
 * Usage:
 *   node scripts/art/renderMissionArt.mjs pilot <theme> [key ...]  render now (default: the pilot keys)
 *   node scripts/art/renderMissionArt.mjs submit <theme> [key ...]  every missing picture, plus the keys named
 *                                                                   (drawn again), as one batch (50% discount)
 *   node scripts/art/renderMissionArt.mjs status
 *   node scripts/art/renderMissionArt.mjs collect
 *   node scripts/art/renderMissionArt.mjs list <theme>             every key and whether its file exists
 *   node scripts/art/renderMissionArt.mjs prompts <theme> [key ...] print the sheet prompts, draws nothing
 * Keys: boss, chest (pairs, closed and open on one sheet), level-badge, and landmark ids (g7-u3).
 * Pictures land in art-src/common/<theme>/ and art-src/landmarks/<theme>/.
 * <theme>:<variant> (e.g. urban-night:flat) draws the same subjects in one of the theme's
 * styleVariants, into art-src/common/<theme>-<variant>/ and so on, to compare styles in a pilot.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { packSheets, sheetImageSize, sheetLayout, sheetPrompt } from './missionArtSheets.mjs';
import { MISSION_ART_THEMES } from './missionArtThemes.mjs';

const MODEL = 'gemini-3.1-flash-image';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const STATE_FILE = join(process.cwd(), '.art-gemini-mission-batches.json');
const ART_SRC = join(process.cwd(), 'art-src');
const SHEETS_DIR = join(ART_SRC, 'mission-sheets');
const SLICER = join(process.cwd(), 'scripts', 'art', 'slice_mission_sheet.py');
const PILOT_KEYS = ['boss', 'chest', 'g1-u12', 'g5-u2', 'g8-u1', 'g12-u3'];

const NO_TEXT =
  'No text, no words, no numbers, no logos, no watermark, no signature anywhere in the image, except the letters or digits a subject names. Maps, pages, screens, tickets and signs show only plain shapes and blank lines, never labels or place names.';

const CUTOUT_RULES = [
  'A thin dark outline in the style colour closes the whole silhouette, with no gaps. No part of the drawing is pure white: use the lightest colour of the palette instead.',
  'Plain pure white background (#FFFFFF) everywhere around the drawing. No ground line, no ground shadow, no table top, no floor, no scenery, no frame, no border, no box or card behind the drawing.',
].join('\n');

/** A theme's spec, or one of its style variants ("urban-night:2.5d"): the same subjects, another style. */
function themeSpec(theme) {
  const [themeId, variant] = theme.split(':');
  const spec = MISSION_ART_THEMES[themeId];
  if (!spec) throw new Error(`No mission art for theme "${themeId}". Themes: ${Object.keys(MISSION_ART_THEMES).join(', ')}`);
  if (variant === undefined) return spec;
  const style = spec.styleVariants?.[variant];
  if (!style) throw new Error(`Theme "${themeId}" has no style variant "${variant}".`);
  return { ...spec, style };
}

/** The art-src folder name of a theme or a variant: urban-night:flat draws into urban-night-flat. */
function artFolder(theme) {
  return theme.replace(':', '-');
}

/** Every picture of a theme: { key, kind, subject, path }; kind is pair, single or landmark. */
function allJobs(theme) {
  const spec = themeSpec(theme);
  const commonDir = join(ART_SRC, 'common', artFolder(theme));
  const pairs = Object.entries(spec.pairs).map(([key, { names, subject }]) => ({
    key,
    kind: 'pair',
    subject,
    path: join(commonDir, `${names.join('+')}.png`),
  }));
  const singles = Object.entries(spec.singles).map(([key, subject]) => ({
    key,
    kind: 'single',
    subject,
    path: join(commonDir, `${key}.png`),
  }));
  const landmarks = Object.entries(spec.landmarks).map(([key, subject]) => ({
    key,
    kind: 'landmark',
    subject,
    path: join(ART_SRC, 'landmarks', artFolder(theme), `${key}.png`),
  }));
  return [...pairs, ...singles, ...landmarks].map((job) => ({ ...job, key: `${theme}/${job.key}` }));
}

function jobsByKey(theme, keys) {
  const jobs = allJobs(theme);
  return keys.map((key) => {
    const job = jobs.find((j) => j.key === `${theme}/${key}`);
    if (!job) throw new Error(`Unknown key "${key}". Run "list ${theme}" to see the keys.`);
    return job;
  });
}

function missingJobs(theme) {
  return allJobs(theme).filter((job) => !existsSync(job.path));
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

function sheetRequest(theme, sheet) {
  const prompt = sheetPrompt(themeSpec(theme), sheet, { noText: NO_TEXT, cutoutRules: CUTOUT_RULES });
  return {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ['IMAGE'],
      imageConfig: { aspectRatio: '1:1', imageSize: sheetImageSize(sheet) },
    },
  };
}

/** A sheet as kept in the batch state (job keys only), and back again. */
function storedSheet(id, sheet) {
  const cells = sheet.cells.map(({ job, row, col, span }) => ({ key: job.key, row, col, span }));
  return { id, columns: sheet.columns, cells };
}

function restoredSheet(theme, stored) {
  const jobs = allJobs(theme);
  const cells = stored.cells.map(({ key, ...place }) => {
    const job = jobs.find((j) => j.key === key);
    if (!job) throw new Error(`Sheet ${stored.id} names an unknown picture "${key}"`);
    return { job, ...place };
  });
  return { columns: stored.columns, cells };
}

function describeSheets(sheets) {
  const pictures = sheets.reduce((sum, sheet) => sum + sheet.cells.length, 0);
  return `${pictures} picture(s) on ${sheets.length} sheet(s)`;
}

function imageFrom(response) {
  const part = response?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
  return part ? Buffer.from(part.inlineData.data, 'base64') : null;
}

/** Keeps the sheet and its layout in art-src/mission-sheets/<theme>/, then cuts it into pictures. */
function saveSheet(theme, id, sheet, buf) {
  const dir = join(SHEETS_DIR, artFolder(theme));
  mkdirSync(dir, { recursive: true });
  const sheetPath = join(dir, `${id}.png`);
  writeFileSync(sheetPath, buf);
  writeFileSync(join(dir, `${id}.json`), JSON.stringify(sheetLayout(sheet), null, 2) + '\n');
  console.log(`Saved sheet ${id} -> ${sheetPath} (${(buf.length / 1024).toFixed(0)} KB)`);
  const slicer = spawnSync('python', [SLICER, sheetPath], { stdio: 'inherit' });
  if (slicer.status !== 0) throw new Error(`Slicing ${sheetPath} failed; run: python ${SLICER} ${sheetPath}`);
}

async function pilot(apiKey, theme, keys) {
  const sheets = packSheets(jobsByKey(theme, keys.length > 0 ? keys : PILOT_KEYS));
  console.log(`Drawing ${describeSheets(sheets)} now.`);
  const stamp = Date.now();
  for (const [index, sheet] of sheets.entries()) {
    const id = `${stamp}-${index + 1}`;
    const res = await fetch(`${API_BASE}/models/${MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sheetRequest(theme, sheet)),
    });
    if (!res.ok) throw new Error(`Request for sheet ${id} failed (${res.status}): ${await res.text()}`);
    const buf = imageFrom(await res.json());
    if (!buf) throw new Error(`No image in the response for sheet ${id}`);
    saveSheet(theme, id, sheet, buf);
  }
}

async function submit(apiKey, theme, redrawKeys) {
  if (readState().length > 0) console.log('Warning: a batch is already in progress.');
  const redraw = jobsByKey(theme, redrawKeys).filter((job) => existsSync(job.path));
  const missing = [...missingJobs(theme), ...redraw];
  if (missing.length === 0) return console.log('Nothing to draw.');
  const sheets = packSheets(missing);
  console.log(`${describeSheets(sheets)} to draw (${redraw.length} picture(s) again).`);

  const stamp = Date.now();
  const stored = sheets.map((sheet, index) => storedSheet(`${stamp}-${index + 1}`, sheet));
  const requests = sheets.map((sheet, index) => ({ request: sheetRequest(theme, sheet), metadata: { key: stored[index].id } }));
  const payload = {
    batch: {
      display_name: `mission-art-${theme}-${Date.now()}`,
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
  writeState([
    ...readState(),
    { name: batch.name, theme, count: missing.length, sheets: stored, submittedAt: new Date().toISOString() },
  ]);
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
    const sheetCount = b.sheets?.length ?? b.count;
    console.log(`${b.name} (${b.theme}, ${b.count} pictures on ${sheetCount} sheet(s), submitted ${b.submittedAt}): ${batchState}`);
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
  for (const b of readState()) {
    const { data, state } = await fetchBatch(apiKey, b.name);
    if (state !== 'BATCH_STATE_SUCCEEDED') {
      console.log(`${b.name}: ${state}, kept in the queue.`);
      remaining.push(b);
      continue;
    }
    for (const item of await batchItems(apiKey, data)) {
      const stored = b.sheets?.find((sheet) => sheet.id === item.metadata?.key);
      const buf = imageFrom(item.response);
      if (!stored || !buf) {
        console.error(`Sheet ${item.metadata?.key ?? '?'} has no image:`, item.error || 'empty response');
        continue;
      }
      saveSheet(b.theme, stored.id, restoredSheet(b.theme, stored), buf);
      saved += stored.cells.length;
    }
    console.log(`${b.theme}: ${missingJobs(b.theme).length} still missing.`);
  }
  writeState(remaining);
  console.log(`${saved} picture(s) written.`);
}

function list(theme) {
  for (const job of allJobs(theme)) console.log(`${existsSync(job.path) ? 'done   ' : 'missing'} ${job.key}`);
}

/** Prints the sheets the named keys (or every missing picture) would be drawn on, without drawing. */
function prompts(theme, keys) {
  const sheets = packSheets(keys.length > 0 ? jobsByKey(theme, keys) : missingJobs(theme));
  console.log(describeSheets(sheets));
  for (const [index, sheet] of sheets.entries()) {
    console.log(`\n--- sheet ${index + 1} (${sheet.columns} x ${sheet.columns}, ${sheetImageSize(sheet)}) ---`);
    console.log(sheetRequest(theme, sheet).contents[0].parts[0].text);
  }
}

const USAGE =
  'Usage: node scripts/art/renderMissionArt.mjs [pilot <theme> [key ...]|submit <theme> [key ...]|status|collect|list <theme>|prompts <theme> [key ...]]';

async function main() {
  const [command = 'status', theme, ...keys] = process.argv.slice(2);
  const needsTheme = ['pilot', 'submit', 'list', 'prompts'].includes(command);
  if (needsTheme && !theme) return console.log(USAGE);
  if (command === 'list') return list(theme);
  if (command === 'prompts') return prompts(theme, keys);
  const apiKey = readApiKey();
  if (command === 'pilot') await pilot(apiKey, theme, keys);
  else if (command === 'submit') await submit(apiKey, theme, keys);
  else if (command === 'status') await status(apiKey);
  else if (command === 'collect') await collect(apiKey);
  else console.log(USAGE);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
