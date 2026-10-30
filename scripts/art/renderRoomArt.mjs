/**
 * Draws the themed My English Room art (furniture, items, stickers; see roomArtSpec.mjs): sheets of
 * nine pictures, one batch for everything that is missing (half price), cut into single pictures by
 * scripts/art/slice_mission_sheet.py. Plain Node. Follows docs/image-generation-pipeline.md.
 *
 * Nothing is paid for without --yes: every paid command first prints how many pictures and sheets it
 * would draw, and stops there when --yes is missing.
 *
 * Usage: node scripts/art/renderRoomArt.mjs list [theme]
 *        node scripts/art/renderRoomArt.mjs prompts [theme|key ...]       (no API call, no cost)
 *        node scripts/art/renderRoomArt.mjs calibration [--yes]           (a batch of two sheets, cozy-studio only)
 *        node scripts/art/renderRoomArt.mjs submit [theme|key ...] [--yes] (one batch; named keys are redrawn)
 *        node scripts/art/renderRoomArt.mjs status
 *        node scripts/art/renderRoomArt.mjs collect
 *        node scripts/art/renderRoomArt.mjs jobs                          (JSON for process_room_art.py)
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { packSheets, sheetImageSize, sheetLayout, sheetPrompt } from './missionArtSheets.mjs';
import { batchItems, fetchBatch, imageFrom, readApiKey, stateStore, submitBatch } from './geminiBatch.mjs';
import { CALIBRATION_KEYS, CUTOUT_RULES, ROOM_ART_DIR, ROOM_ART_SPEC, THEME_IDS, allJobs } from './roomArtSpec.mjs';

const MODEL = 'gemini-3.1-flash-image';
const SHEETS_DIR = join(ROOM_ART_DIR, 'sheets');
const SLICER = join(process.cwd(), 'scripts', 'art', 'slice_mission_sheet.py');
const YES_FLAG = '--yes';
const state = stateStore(join(process.cwd(), '.art-gemini-room-batches.json'));

const NO_TEXT =
  'No text, no words, no numbers, no logos, no watermark, no signature anywhere in the image. Clocks have no numbers, and screens, pages and stickers show only plain shapes and blank lines.';

const jobs = allJobs();

function jobsOfTheme(theme) {
  return jobs.filter((job) => job.key.startsWith(`${theme}/`));
}

function missing(list = jobs) {
  return list.filter((job) => !existsSync(job.path));
}

/** Named themes mean their missing pictures; named keys mean those pictures (drawn again when they exist). No names: everything missing. */
function selectJobs(names) {
  if (names.length === 0) return missing();
  return names.flatMap((name) => {
    if (THEME_IDS.includes(name)) return missing(jobsOfTheme(name));
    const job = jobs.find((candidate) => candidate.key === name);
    if (!job) throw new Error(`Unknown name "${name}". Themes: ${THEME_IDS.join(', ')}; keys look like cozy-studio/room-sofa (see "list").`);
    return [job];
  });
}

function sheetRequest(sheet) {
  const prompt = sheetPrompt(ROOM_ART_SPEC, sheet, { noText: NO_TEXT, cutoutRules: CUTOUT_RULES });
  return {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '1:1', imageSize: sheetImageSize() } },
  };
}

function describeSheets(sheets) {
  const pictures = sheets.reduce((sum, sheet) => sum + sheet.cells.length, 0);
  return `${pictures} picture(s) on ${sheets.length} sheet(s)`;
}

/** A sheet as kept in the batch state (picture keys only), and back again. */
function storedSheet(id, sheet) {
  return { id, columns: sheet.columns, cells: sheet.cells.map(({ job, row, col, span }) => ({ key: job.key, row, col, span })) };
}

function restoredSheet(stored) {
  const cells = stored.cells.map(({ key, ...place }) => {
    const job = jobs.find((candidate) => candidate.key === key);
    if (!job) throw new Error(`Sheet ${stored.id} names an unknown picture "${key}"`);
    return { job, ...place };
  });
  return { columns: stored.columns, cells };
}

/** Keeps the sheet and its layout in art-src/room-art/sheets/, then cuts it into pictures. */
function saveSheet(id, sheet, buf) {
  mkdirSync(SHEETS_DIR, { recursive: true });
  const sheetPath = join(SHEETS_DIR, `${id}.png`);
  writeFileSync(sheetPath, buf);
  writeFileSync(join(SHEETS_DIR, `${id}.json`), JSON.stringify(sheetLayout(sheet), null, 2) + '\n');
  console.log(`Saved sheet ${id} -> ${sheetPath} (${(buf.length / 1024).toFixed(0)} KB)`);
  const slicer = spawnSync('python', [SLICER, sheetPath], { stdio: 'inherit' });
  if (slicer.status !== 0) throw new Error(`Slicing ${sheetPath} failed; run: python ${SLICER} ${sheetPath}`);
}

function list(theme) {
  for (const job of theme ? jobsOfTheme(theme) : jobs) console.log(`${existsSync(job.path) ? 'done   ' : 'missing'} ${job.key}`);
  const todo = missing(theme ? jobsOfTheme(theme) : jobs);
  console.log(`${todo.length} missing of ${theme ? jobsOfTheme(theme).length : jobs.length}`);
}

function prompts(names) {
  const sheets = packSheets(names.length > 0 ? selectJobs(names) : missing());
  console.log(describeSheets(sheets));
  for (const [index, sheet] of sheets.entries()) {
    console.log(`\n--- sheet ${index + 1} (${sheet.columns} x ${sheet.columns}, ${sheetImageSize()}) ---`);
    console.log(sheetRequest(sheet).contents[0].parts[0].text);
  }
}

async function submit(apiKey, args) {
  if (state.read().length > 0) console.log('Warning: a batch is already in progress.');
  const names = args.filter((arg) => arg !== YES_FLAG);
  const selected = selectJobs(names);
  const sheets = packSheets(selected);
  const redrawn = selected.filter((job) => existsSync(job.path)).length;
  if (selected.length === 0) return console.log('Nothing to draw.');
  console.log(`Batch: ${describeSheets(sheets)} (${redrawn} drawn again), model ${MODEL}, ${sheetImageSize()}, half price.`);
  if (!args.includes(YES_FLAG)) return console.log(`Not submitting: add ${YES_FLAG} to spend it.`);

  const stamp = Date.now();
  const stored = sheets.map((sheet, index) => storedSheet(`${stamp}-${index + 1}`, sheet));
  const requests = sheets.map((sheet, index) => ({ request: sheetRequest(sheet), metadata: { key: stored[index].id } }));
  const batch = await submitBatch(apiKey, MODEL, `room-art-${stamp}`, requests);
  console.log(`Batch submitted: ${batch.name}`);
  state.write([...state.read(), { name: batch.name, count: selected.length, sheets: stored, submittedAt: new Date().toISOString() }]);
}

async function status(apiKey) {
  const batches = state.read();
  if (batches.length === 0) console.log('No active batches.');
  for (const batch of batches) {
    const { data, state: batchState } = await fetchBatch(apiKey, batch.name);
    console.log(`${batch.name} (${batch.count} pictures on ${batch.sheets.length} sheet(s), submitted ${batch.submittedAt}): ${batchState}`);
    if (data.metadata?.batchStats) console.log('Stats:', JSON.stringify(data.metadata.batchStats));
  }
}

async function collect(apiKey) {
  const remaining = [];
  let saved = 0;
  for (const batch of state.read()) {
    const { data, state: batchState } = await fetchBatch(apiKey, batch.name);
    if (batchState !== 'BATCH_STATE_SUCCEEDED') {
      console.log(`${batch.name}: ${batchState}, kept in the queue.`);
      remaining.push(batch);
      continue;
    }
    for (const item of await batchItems(apiKey, data)) {
      const stored = batch.sheets.find((sheet) => sheet.id === item.metadata?.key);
      const buf = imageFrom(item.response);
      if (!stored || !buf) {
        console.error(`Sheet ${item.metadata?.key ?? '?'} has no image:`, item.error || 'empty response');
        continue;
      }
      saveSheet(stored.id, restoredSheet(stored), buf);
      saved += stored.cells.length;
    }
  }
  state.write(remaining);
  console.log(`${saved} picture(s) written, ${missing().length} still missing.`);
}

const USAGE =
  'Usage: node scripts/art/renderRoomArt.mjs [list [theme]|prompts [theme|key ...]|calibration [--yes]|submit [theme|key ...] [--yes]|status|collect]';

async function main() {
  const [command = 'status', ...args] = process.argv.slice(2);
  if (command === 'list') return list(args[0]);
  // For process_room_art.py: every picture's key and whether it has a baked-in shadow
  if (command === 'jobs') return console.log(JSON.stringify(jobs.map(({ key, hasShadow }) => ({ key, hasShadow }))));
  if (command === 'prompts') return prompts(args);
  const apiKey = readApiKey();
  // The calibration is a small batch of named pictures (two sheets), kept if they are good
  if (command === 'calibration') return submit(apiKey, [...CALIBRATION_KEYS, ...args]);
  if (command === 'submit') return submit(apiKey, args);
  if (command === 'status') return status(apiKey);
  if (command === 'collect') return collect(apiKey);
  console.log(USAGE);
}

main().catch((err) => {
  console.error(err.message);
  process.exitCode = 1;
});
