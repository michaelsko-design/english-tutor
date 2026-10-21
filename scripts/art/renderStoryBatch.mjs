/**
 * Batch image generation for English Tutor story missions using Gemini Batch API.
 * Uses gemini-3.1-flash-lite-image at 50% discount.
 *
 * Usage:
 *   node scripts/art/renderStoryBatch.mjs submit
 *   node scripts/art/renderStoryBatch.mjs status
 *   node scripts/art/renderStoryBatch.mjs collect
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const MODEL = 'gemini-3.1-flash-lite-image';
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const STATE_FILE = join(process.cwd(), '.art-gemini-batches.json');
const HTML_FILE = 'C:\\Users\\micha\\Downloads\\English Tutor Art Prompts.html';
const STORIES_DIR = join(process.cwd(), 'art-src', 'stories');

const STYLE_BASE = 'Cute 2.5D game illustration for a children’s English-learning app (ages 6–17). Soft rounded shapes, thick clean dark outlines, simple cel shading with one soft highlight, warm friendly lighting. Readable when shrunk to 96 pixels. No text, no letters, no numbers, no logos, no watermark, no signature anywhere in the image.';
const PALETTE_COZY = 'Outline colour: dark plum (#3B2A5A). Colour palette: peach #FFD9C7, rose #F27BA4, lavender #B39DDB, violet #9B5CF6, butter yellow #FFD66B, mint #8FDDB8, cream #FFF6EC.';

function fullRules(ratio, size) {
  return `The picture fills the whole frame edge to edge, with no border, no frame and no white margins. Output: ${ratio} image, at least ${size} pixels.`;
}

function buildStoryPrompt(passage) {
  const subject = [
    'A small storybook illustration for a short English reading passage in a children’s learning app. Show the main moment of this passage as one simple, friendly scene:',
    `“${passage}”`,
    'Use three characters at most and a simple background with clear shapes. If the passage names a real brand, place or famous person, draw a generic version instead. Do not draw any words, signs with writing or speech bubbles.'
  ].join('\n');

  const rules = fullRules('landscape 16:9', '1536 × 864');
  return [STYLE_BASE, PALETTE_COZY, '', subject, '', rules].join('\n');
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

function loadStories() {
  const html = readFileSync(HTML_FILE, 'utf8');
  const match = html.match(/var STORIES = (\[[\s\S]+?\]);\s*var STYLE_BASE/);
  if (!match) throw new Error('Could not find STORIES in HTML file');
  return JSON.parse(match[1]);
}

function getMissingStories() {
  mkdirSync(STORIES_DIR, { recursive: true });
  const all = loadStories();
  return all.filter((s) => !existsSync(join(STORIES_DIR, `${s.id}.jpg`)));
}

async function submit(apiKey) {
  const state = readState();
  if (state.length > 0) {
    console.log(`Warning: ${state.length} batch(es) already in progress.`);
  }

  const missing = getMissingStories();
  console.log(`Found ${missing.length} missing story images out of 144.`);
  if (missing.length === 0) {
    console.log('All story images are already rendered!');
    return;
  }

  const requests = missing.map((s) => ({
    request: {
      contents: [
        {
          role: 'user',
          parts: [{ text: buildStoryPrompt(s.passage) }]
        }
      ],
      generationConfig: {
        responseModalities: ['IMAGE'],
        imageConfig: {
          aspectRatio: '16:9'
        }
      }
    },
    metadata: { key: s.id }
  }));

  const payload = {
    batch: {
      display_name: `story-illustrations-${Date.now()}`,
      input_config: {
        requests: {
          requests
        }
      }
    }
  };

  console.log(`Submitting batch of ${requests.length} image requests to ${MODEL}...`);
  const res = await fetch(`${API_BASE}/models/${MODEL}:batchGenerateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Batch submission failed (${res.status}): ${errorText}`);
  }

  const batch = await res.json();
  console.log(`Batch submitted successfully!`);
  console.log(`Name: ${batch.name}`);
  state.push({ name: batch.name, count: requests.length, submittedAt: new Date().toISOString() });
  writeState(state);
}

async function status(apiKey) {
  const state = readState();
  if (state.length === 0) {
    console.log('No active batches found in .art-gemini-batches.json');
    return;
  }

  for (const b of state) {
    console.log(`\nChecking batch: ${b.name} (${b.count} requests, submitted ${b.submittedAt})...`);
    const res = await fetch(`${API_BASE}/${b.name}?key=${apiKey}`);
    if (!res.ok) {
      console.error(`Error querying batch status (${res.status}): ${await res.text()}`);
      continue;
    }
    const data = await res.json();
    const batchState = data.metadata?.state || data.state || 'UNKNOWN';
    const stats = data.metadata?.batchStats || {};
    console.log(`State: ${batchState}`);
    if (Object.keys(stats).length > 0) {
      console.log(`Stats:`, JSON.stringify(stats));
    }
  }
}

async function batchItems(apiKey, batchData) {
  const inline =
    batchData.metadata?.output?.inlinedResponses?.inlinedResponses ||
    batchData.response?.inlinedResponses?.inlinedResponses ||
    batchData.output?.inlinedResponses?.inlinedResponses;
  if (inline) return inline;

  const file =
    batchData.metadata?.output?.responsesFile ||
    batchData.response?.responsesFile ||
    batchData.output?.responsesFile;
  if (!file) return [];

  console.log(`Downloading response file: ${file}...`);
  const downloadBase = API_BASE.replace('/v1beta', '/download/v1beta');
  const res = await fetch(`${downloadBase}/${file}:download?alt=media`, {
    headers: { 'x-goog-api-key': apiKey }
  });
  if (!res.ok) throw new Error(`Download failed (${res.status}): ${await res.text()}`);
  const lines = (await res.text()).split('\n').filter((l) => l.trim());
  return lines.map((l) => {
    const item = JSON.parse(l);
    return { ...item, metadata: item.metadata || { key: item.key } };
  });
}

function parseDimensions(buf) {
  let offset = 2;
  while (offset < buf.length) {
    if (buf[offset] !== 0xFF) break;
    const marker = buf[offset + 1];
    const len = buf.readUInt16BE(offset + 2);
    if (marker === 0xC0 || marker === 0xC2) {
      const height = buf.readUInt16BE(offset + 5);
      const width = buf.readUInt16BE(offset + 7);
      return `${width}x${height}`;
    }
    offset += 2 + len;
  }
  return 'unknown';
}

async function collect(apiKey) {
  const state = readState();
  if (state.length === 0) {
    console.log('No batches to collect.');
    return;
  }

  const remaining = [];
  let totalSaved = 0;

  for (const b of state) {
    console.log(`\nChecking batch for collection: ${b.name}...`);
    const res = await fetch(`${API_BASE}/${b.name}?key=${apiKey}`);
    if (!res.ok) {
      console.error(`Failed to fetch status for ${b.name}: ${res.status}`);
      remaining.push(b);
      continue;
    }
    const data = await res.json();
    const batchState = data.metadata?.state || data.state || 'UNKNOWN';
    console.log(`Batch state: ${batchState}`);

    if (batchState !== 'BATCH_STATE_SUCCEEDED') {
      console.log(`Batch is not finished yet (${batchState}). Kept in queue.`);
      remaining.push(b);
      continue;
    }

    const items = await batchItems(apiKey, data);
    console.log(`Retrieved ${items.length} items from batch.`);

    for (const item of items) {
      const key = item.metadata?.key;
      if (!key) {
        console.warn('Item missing metadata key:', item);
        continue;
      }

      const outPath = join(STORIES_DIR, `${key}.jpg`);
      if (existsSync(outPath)) {
        console.log(`Skipping ${key}.jpg (already exists on disk).`);
        continue;
      }

      const candidate = item.response?.candidates?.[0];
      const part = candidate?.content?.parts?.find((p) => p.inlineData?.data);
      if (!part?.inlineData?.data) {
        console.error(`Failed to find image data for ${key}:`, item.error || 'No inlineData in response');
        continue;
      }

      const buf = Buffer.from(part.inlineData.data, 'base64');
      writeFileSync(outPath, buf);
      const dims = parseDimensions(buf);
      console.log(`Saved ${key}.jpg (${dims}, ${(buf.length / 1024).toFixed(0)} KB)`);
      totalSaved++;
    }
  }

  writeState(remaining);
  console.log(`\nCollection complete! ${totalSaved} new images written.`);
  const missingAfter = getMissingStories();
  console.log(`Total remaining missing stories: ${missingAfter.length} / 144.`);
}

async function main() {
  const command = process.argv[2] || 'status';
  const apiKey = readApiKey();

  if (command === 'submit') {
    await submit(apiKey);
  } else if (command === 'status') {
    await status(apiKey);
  } else if (command === 'collect') {
    await collect(apiKey);
  } else {
    console.log(`Unknown command: ${command}`);
    console.log('Usage: node scripts/art/renderStoryBatch.mjs [submit|status|collect]');
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
