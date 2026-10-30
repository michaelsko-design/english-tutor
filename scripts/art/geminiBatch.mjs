/**
 * The Gemini image batch plumbing shared by the art scripts that draw sheets (see
 * docs/image-generation-pipeline.md): the API key, a small JSON state file that remembers which
 * batches are in flight, and submit / status / result helpers. Plain Node, no dependencies.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export function readApiKey() {
  const envFile = join(process.cwd(), '.env.local');
  if (!existsSync(envFile)) throw new Error('Missing .env.local file');
  const match = readFileSync(envFile, 'utf8').match(/GEMINI_API_KEY=(.+)/);
  if (!match) throw new Error('GEMINI_API_KEY not found in .env.local');
  return match[1].trim();
}

/** Batches that were submitted and not collected yet, kept in a git-ignored JSON file. */
export function stateStore(file) {
  return {
    read() {
      if (!existsSync(file)) return [];
      try {
        return JSON.parse(readFileSync(file, 'utf8'));
      } catch (err) {
        throw new Error(`${file} is not valid JSON: ${err.message}`);
      }
    },
    write(batches) {
      writeFileSync(file, JSON.stringify(batches, null, 2) + '\n');
    },
  };
}

function headers(apiKey) {
  return { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey };
}

/** The first picture of a generateContent response (or a batch item's response), as a Buffer; null when there is none. */
export function imageFrom(response) {
  const part = response?.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
  return part ? Buffer.from(part.inlineData.data, 'base64') : null;
}

/** One instant request (the single-sheet pilot). */
export async function generateOne(apiKey, model, request) {
  const res = await fetch(`${API_BASE}/models/${model}:generateContent`, {
    method: 'POST',
    headers: headers(apiKey),
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error(`Request failed (${res.status}): ${await res.text()}`);
  const buf = imageFrom(await res.json());
  if (!buf) throw new Error('No image in the response');
  return buf;
}

/** Submits requests as one batch (half price); each is { request, metadata: { key } }. Returns the batch (its `name`). */
export async function submitBatch(apiKey, model, displayName, requests) {
  const res = await fetch(`${API_BASE}/models/${model}:batchGenerateContent`, {
    method: 'POST',
    headers: headers(apiKey),
    body: JSON.stringify({ batch: { display_name: displayName, input_config: { requests: { requests } } } }),
  });
  if (!res.ok) throw new Error(`Batch submission failed (${res.status}): ${await res.text()}`);
  return res.json();
}

export async function fetchBatch(apiKey, name) {
  const res = await fetch(`${API_BASE}/${name}`, { headers: headers(apiKey) });
  if (!res.ok) throw new Error(`Status query failed (${res.status}): ${await res.text()}`);
  const data = await res.json();
  return { data, state: data.metadata?.state || data.state || 'UNKNOWN' };
}

/** The items of a finished batch, from the inline answer or the downloaded JSONL file. */
export async function batchItems(apiKey, batchData) {
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
    .filter((line) => line.trim())
    .map((line) => {
      const item = JSON.parse(line);
      return { ...item, metadata: item.metadata || { key: item.key } };
    });
}
