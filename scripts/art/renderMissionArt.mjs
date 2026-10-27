/**
 * Each theme's own mission art (ThemeBase.missionArtFolder): the Boss stop, the reward chest, the
 * level badge and one landmark per unit, drawn in the theme's style from the subjects in
 * scripts/art/missionArtThemes.mjs. Cozy keeps the shared set in /art/common and /art/landmarks.
 * Everything is drawn on white, so scripts/process_art.py can cut it out:
 *   python scripts/process_art.py common/<theme> landmarks/<theme>
 *
 * Usage:
 *   node scripts/art/renderMissionArt.mjs pilot <theme> [key ...]  render now (default: the pilot keys)
 *   node scripts/art/renderMissionArt.mjs submit <theme> [key ...]  every missing picture, plus the keys named
 *                                                                   (drawn again), as one batch (50% discount)
 *   node scripts/art/renderMissionArt.mjs status
 *   node scripts/art/renderMissionArt.mjs collect
 *   node scripts/art/renderMissionArt.mjs list <theme>             every key and whether its file exists
 * Keys: boss, chest (pairs, closed and open on one sheet), level-badge, and landmark ids (g7-u3).
 * Pictures land in art-src/common/<theme>/ and art-src/landmarks/<theme>/.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { MISSION_ART_THEMES } from './missionArtThemes.mjs';

const MODEL = 'gemini-3.1-flash-image';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const STATE_FILE = join(process.cwd(), '.art-gemini-mission-batches.json');
const ART_SRC = join(process.cwd(), 'art-src');
const IMAGE_SIZE = '1K'; // cut-outs are shown at most 512px
const PILOT_KEYS = ['boss', 'chest', 'g1-u12', 'g5-u2', 'g8-u1', 'g12-u3'];

const NO_TEXT =
  'No text, no words, no numbers, no logos, no watermark, no signature anywhere in the image, except the letters a subject names. Maps, pages, screens, tickets and signs show only plain shapes and blank lines, never labels or place names.';

const CUTOUT_RULES = [
  'A thin dark slate outline closes the whole silhouette, with no gaps. No part of the drawing is pure white: use warm paper #F1EEE8 or light grey instead.',
  'Plain pure white background (#FFFFFF) everywhere around the drawing. No ground line, no ground shadow, no table top, no floor, no scenery, no frame, no border, no box or card behind the drawing.',
].join('\n');

const LANDMARK_RULES = [
  'One map landmark, centred, the whole group filling about 80% of the square, about as wide as it is tall. Seen from a slight three-quarter angle from the front and a little above. It must read clearly when shown 90 pixels wide: a few large, simple shapes, no tiny details.',
  CUTOUT_RULES,
].join('\n');

const PAIR_RULES = [
  'Two pictures of the same object side by side on one wide sheet: the left one in the left half, the right one in the right half, each centred in its half, the same size, the same angle and the same colours, standing on the same baseline. A wide empty white gap runs down the middle: neither picture touches the other or the edge of the image.',
  CUTOUT_RULES,
].join('\n');

const SINGLE_RULES = ['One picture, centred, filling about 80% of the square.', CUTOUT_RULES].join('\n');

function themeSpec(theme) {
  const spec = MISSION_ART_THEMES[theme];
  if (!spec) throw new Error(`No mission art for theme "${theme}". Themes: ${Object.keys(MISSION_ART_THEMES).join(', ')}`);
  return spec;
}

/** Every picture of a theme: { key, path, prompt, aspectRatio }. */
function allJobs(theme) {
  const spec = themeSpec(theme);
  const commonDir = join(ART_SRC, 'common', theme);
  const prompt = (subject, rules) => [spec.style, NO_TEXT, '', subject, '', rules].join('\n');
  const pairs = Object.entries(spec.pairs).map(([key, { names, subject }]) => ({
    key,
    path: join(commonDir, `${names.join('+')}.png`),
    prompt: prompt(subject, PAIR_RULES),
    aspectRatio: '16:9',
  }));
  const singles = Object.entries(spec.singles).map(([key, subject]) => ({
    key,
    path: join(commonDir, `${key}.png`),
    prompt: prompt(subject, SINGLE_RULES),
    aspectRatio: '1:1',
  }));
  const landmarks = Object.entries(spec.landmarks).map(([key, subject]) => ({
    key,
    path: join(ART_SRC, 'landmarks', theme, `${key}.png`),
    prompt: prompt(`${spec.landmarkIdea}\nSubject: ${subject}`, LANDMARK_RULES),
    aspectRatio: '1:1',
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

async function pilot(apiKey, theme, keys) {
  for (const job of jobsByKey(theme, keys.length > 0 ? keys : PILOT_KEYS)) {
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

async function submit(apiKey, theme, redrawKeys) {
  if (readState().length > 0) console.log('Warning: a batch is already in progress.');
  const redraw = jobsByKey(theme, redrawKeys).filter((job) => existsSync(job.path));
  const missing = [...missingJobs(theme), ...redraw];
  console.log(`${missing.length} picture(s) to draw (${redraw.length} of them again).`);
  if (missing.length === 0) return;

  const requests = missing.map((job) => ({ request: imageRequest(job), metadata: { key: job.key } }));
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
    { name: batch.name, theme, count: requests.length, submittedAt: new Date().toISOString() },
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
    console.log(`${b.name} (${b.theme}, ${b.count} pictures, submitted ${b.submittedAt}): ${batchState}`);
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
    const jobs = allJobs(b.theme);
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
    console.log(`${b.theme}: ${missingJobs(b.theme).length} still missing.`);
  }
  writeState(remaining);
  console.log(`${saved} picture(s) written.`);
}

function list(theme) {
  for (const job of allJobs(theme)) console.log(`${existsSync(job.path) ? 'done   ' : 'missing'} ${job.key}`);
}

const USAGE =
  'Usage: node scripts/art/renderMissionArt.mjs [pilot <theme> [key ...]|submit <theme> [key ...]|status|collect|list <theme>]';

async function main() {
  const [command = 'status', theme, ...keys] = process.argv.slice(2);
  const needsTheme = ['pilot', 'submit', 'list'].includes(command);
  if (needsTheme && !theme) return console.log(USAGE);
  if (command === 'list') return list(theme);
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
