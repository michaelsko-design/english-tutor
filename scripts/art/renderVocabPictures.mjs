/**
 * Vocabulary pictures for the "What is this?" cards: one picture per word and meaning, drawn 16 to
 * a 4 × 4 sheet at 2K (cells ≈ 512 px) with gemini-3.1-flash-image, all sheets in ONE batch (half
 * price). The list comes from scripts/art/buildVocabPictureList.ts; sheets are cut by
 * scripts/art/slice_vocab_sheets.py, then `python scripts/process_art.py icons` makes the WebP files.
 *
 * Usage:
 *   node scripts/art/renderVocabPictures.mjs prompts [sheet]     print the prompts, no API call
 *   node scripts/art/renderVocabPictures.mjs submit [sheet …]    every missing sheet (or the named ones) as one batch
 *   node scripts/art/renderVocabPictures.mjs status
 *   node scripts/art/renderVocabPictures.mjs collect
 * Sheets land in art-src/vocab-sheets/sheet-<n>.png. To redraw single pictures, move their entries in
 * vocabPictureList.json to a new sheet number (cells 0, 1, …) and submit that sheet.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { batchItems, fetchBatch, imageFrom, readApiKey, stateStore, submitBatch } from './geminiBatch.mjs';

const MODEL = 'gemini-3.1-flash-image';
const SHEETS_DIR = join(process.cwd(), 'art-src', 'vocab-sheets');
const LIST_FILE = join(process.cwd(), 'scripts', 'art', 'vocabPictureList.json');
const state = stateStore(join(process.cwd(), '.art-gemini-vocab-batches.json'));
const PER_SHEET = 16;

const STYLE = [
  'A picture-dictionary sheet for young children (ages 6–12) learning English words. Each picture must be instantly recognisable as exactly the named word and nothing else, even to a six-year-old.',
  'Style: cute, friendly 2.5D illustration with soft rounded shapes, clean dark outlines, simple soft shading and natural, true-to-life colours. One matching set: the same line weight, lighting and level of detail in every picture. No text, letters, numbers, words, labels, logos, watermark or signature anywhere in the image.',
].join('\n');
const LAYOUT = [
  'Layout: exactly sixteen separate pictures in a strict 4 × 4 grid (four rows, four columns) on a plain pure white background, listed below in reading order: left to right, top to bottom.',
  'Every picture is centered in its own equal square cell, filling about 70% of the cell, with an empty white margin on all sides so that nothing touches another picture or the edge of the image. No grid lines, borders, frames, tiles, ground shadows, labels or scenery behind the subject. Square 1:1 image.',
].join('\n');

function loadSheets() {
  const sheets = new Map();
  for (const entry of JSON.parse(readFileSync(LIST_FILE, 'utf8'))) {
    sheets.set(entry.sheet, [...(sheets.get(entry.sheet) ?? []), entry]);
  }
  return sheets;
}

/** One line per cell in reading order; a cell without a picture (moved to a redraw sheet) stays empty. */
function buildPrompt(entries) {
  const byCell = new Map(entries.map((e) => [e.cell, e]));
  const lastCell = Math.max(...entries.map((e) => e.cell));
  const lines = Array.from(
    { length: lastCell + 1 },
    (_, cell) => `${cell + 1}. ${byCell.get(cell)?.subject ?? 'nothing: this cell stays completely empty and white'}`
  );
  const spare = PER_SHEET - lastCell - 1;
  const spareNote = spare > 0 ? `\nThe last ${spare} cell(s) stay completely empty and white.` : '';
  return [STYLE, '', LAYOUT, '', 'Pictures:', ...lines].join('\n') + spareNote;
}

function request(entries) {
  return {
    contents: [{ role: 'user', parts: [{ text: buildPrompt(entries) }] }],
    generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '1:1', imageSize: '2K' } },
  };
}

const sheetPath = (n) => join(SHEETS_DIR, `sheet-${n}.png`);

function sheetsToDraw(named) {
  const sheets = loadSheets();
  const numbers = named.length ? named.map(Number) : [...sheets.keys()].filter((n) => !existsSync(sheetPath(n)));
  return numbers.sort((a, b) => a - b).map((n) => {
    if (!sheets.has(n)) throw new Error(`No sheet ${n} in ${LIST_FILE}`);
    return { n, entries: sheets.get(n) };
  });
}

async function submit(apiKey, named) {
  if (state.read().length > 0) throw new Error('A batch is still in flight: run status / collect first.');
  const todo = sheetsToDraw(named);
  const pictures = todo.reduce((sum, s) => sum + s.entries.length, 0);
  console.log(`${pictures} picture(s) on ${todo.length} sheet(s) to draw (${todo.length} request(s)).`);
  if (todo.length === 0) return;
  const requests = todo.map(({ n, entries }) => ({ request: request(entries), metadata: { key: String(n) } }));
  const batch = await submitBatch(apiKey, MODEL, `vocab-pictures-${Date.now()}`, requests);
  state.write([{ name: batch.name, sheets: todo.map((s) => s.n), submittedAt: new Date().toISOString() }]);
  console.log(`Submitted ${batch.name}`);
}

async function status(apiKey) {
  const batches = state.read();
  if (batches.length === 0) return console.log('No batch in flight.');
  for (const b of batches) {
    const { state: batchState } = await fetchBatch(apiKey, b.name);
    console.log(`${b.name} (sheets ${b.sheets.join(', ')}): ${batchState}`);
  }
}

async function collect(apiKey) {
  const remaining = [];
  mkdirSync(SHEETS_DIR, { recursive: true });
  for (const b of state.read()) {
    const { data, state: batchState } = await fetchBatch(apiKey, b.name);
    if (batchState !== 'BATCH_STATE_SUCCEEDED') {
      console.log(`${b.name}: ${batchState}, kept.`);
      remaining.push(b);
      continue;
    }
    for (const item of await batchItems(apiKey, data)) {
      const key = item.metadata?.key;
      const buf = imageFrom(item.response);
      if (!key || !buf) {
        console.error(`Sheet ${key ?? '?'} has no image:`, JSON.stringify(item.error ?? item.response ?? {}).slice(0, 300));
        continue;
      }
      writeFileSync(sheetPath(key), buf);
      console.log(`Saved sheet-${key}.png (${(buf.length / 1024).toFixed(0)} KB)`);
    }
  }
  state.write(remaining);
}

async function main() {
  const [command = 'status', ...args] = process.argv.slice(2);
  if (command === 'prompts') {
    for (const { n, entries } of sheetsToDraw(args)) console.log(`--- sheet ${n} ---\n${buildPrompt(entries)}\n`);
    return;
  }
  const apiKey = readApiKey();
  if (command === 'submit') await submit(apiKey, args);
  else if (command === 'status') await status(apiKey);
  else if (command === 'collect') await collect(apiKey);
  else console.log('Usage: node scripts/art/renderVocabPictures.mjs [prompts|submit|status|collect]');
}

main().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
