/**
 * Renders the Hebrew clips with Gemini through its batch API (interactive requests are capped at
 * 100 a day; a batch has its own limits, costs half and finishes within 24 hours, usually minutes):
 *   npm run tts:render:he -- submit    sends every Hebrew corpus phrase that has no clip yet
 *   npm run tts:render:he -- status    shows how the submitted batches are doing
 *   npm run tts:render:he -- collect   writes the finished clips and rewrites public/tts/manifest.json
 *   npm run tts:render:he -- redo "<text>"   deletes the clips whose line contains <text> (one that came
 *                                      out wrong; Gemini differs a little each take), then submit again
 * Needs GEMINI_API_KEY in .env.local. The submitted batches are kept in .tts-gemini-batches.json
 * (gitignored) between the steps; a phrase that failed is simply missing and goes in the next submit.
 */
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadEnv } from 'vite';
import { HEBREW_VOICE, parseListenerGender, type ClipVoice } from '../../src/services/tts/ttsText';
import { collectCorpus, type CorpusPhrase } from './corpus';
import { getVoiceDir, listRenderedKeys, writeManifest } from './clipManifest';
import { toGeminiText } from './geminiSpelling';
import {
  buildGeminiRequest,
  GEMINI_API_BASE,
  GEMINI_TTS_MODEL,
  responseToMp3,
  type GeminiResponse,
} from './geminiTts';

const STATE_FILE = join(process.cwd(), '.tts-gemini-batches.json');
/** Requests per batch: a batch's answer holds all its audio inline, so it stays tens of MB. */
const BATCH_SIZE = 300;
const DONE_STATES = new Set(['BATCH_STATE_SUCCEEDED', 'BATCH_STATE_FAILED', 'BATCH_STATE_CANCELLED', 'BATCH_STATE_EXPIRED']);

interface SubmittedBatch {
  name: string;
  count: number;
}

interface BatchItem {
  metadata?: { key?: string };
  response?: GeminiResponse;
  error?: { message?: string };
}

interface BatchStatus {
  metadata?: { state?: string; batchStats?: Record<string, string> };
  response?: { inlinedResponses?: { inlinedResponses?: BatchItem[] }; responsesFile?: string };
  error?: { message?: string };
}

function readApiKey(): string {
  const apiKey = loadEnv('development', process.cwd(), 'GEMINI_').GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error('Set GEMINI_API_KEY in .env.local.');
  return apiKey;
}

const readState = (): SubmittedBatch[] =>
  existsSync(STATE_FILE) ? (JSON.parse(readFileSync(STATE_FILE, 'utf8')) as SubmittedBatch[]) : [];
const writeState = (batches: SubmittedBatch[]) => writeFileSync(STATE_FILE, `${JSON.stringify(batches, null, 2)}\n`);

async function gemini<T>(apiKey: string, path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${GEMINI_API_BASE}/${path}`, {
    ...init,
    headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
  });
  const body = (await response.json().catch(() => ({}))) as T & { error?: { message?: string } };
  if (!response.ok) throw new Error(`Gemini ${response.status}: ${body.error?.message ?? path}`);
  return body;
}

function missingPhrases(): CorpusPhrase[] {
  const rendered = listRenderedKeys(HEBREW_VOICE);
  return collectCorpus(HEBREW_VOICE).filter((phrase) => !rendered.has(phrase.key));
}

async function submit(apiKey: string): Promise<void> {
  if (readState().length > 0) throw new Error('Batches are still waiting: run collect first (or delete .tts-gemini-batches.json).');
  const todo = missingPhrases();
  console.log(`${todo.length} Hebrew phrases without a clip.`);
  const submitted: SubmittedBatch[] = [];
  for (let start = 0; start < todo.length; start += BATCH_SIZE) {
    const chunk = todo.slice(start, start + BATCH_SIZE);
    const requests = chunk.map((phrase) => ({ request: buildGeminiRequest(toGeminiText(phrase.text)), metadata: { key: phrase.key } }));
    const batch = await gemini<{ name: string }>(apiKey, `models/${GEMINI_TTS_MODEL}:batchGenerateContent`, {
      method: 'POST',
      body: JSON.stringify({ batch: { display_name: `hebrew-clips-${start / BATCH_SIZE + 1}`, input_config: { requests: { requests } } } }),
    });
    submitted.push({ name: batch.name, count: chunk.length });
    writeState(submitted);
    console.log(`Submitted ${batch.name} (${chunk.length} phrases).`);
  }
}

async function batchItems(apiKey: string, status: BatchStatus): Promise<BatchItem[]> {
  const inline = status.response?.inlinedResponses?.inlinedResponses;
  if (inline) return inline;
  const file = status.response?.responsesFile;
  if (!file) return [];
  const response = await fetch(`${GEMINI_API_BASE.replace('/v1beta', '/download/v1beta')}/${file}:download?alt=media`, {
    headers: { 'x-goog-api-key': apiKey },
  });
  if (!response.ok) throw new Error(`Gemini ${response.status} downloading ${file}`);
  return (await response.text())
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => {
      const item = JSON.parse(line) as BatchItem & { key?: string };
      return { ...item, metadata: item.metadata ?? { key: item.key } };
    });
}

async function collect(apiKey: string, isDryRun: boolean): Promise<void> {
  const waiting: SubmittedBatch[] = [];
  let written = 0;
  let failed = 0;
  mkdirSync(getVoiceDir(HEBREW_VOICE), { recursive: true });
  for (const batch of readState()) {
    const status = await gemini<BatchStatus>(apiKey, batch.name);
    const state = status.metadata?.state ?? 'unknown';
    if (!DONE_STATES.has(state) || isDryRun) {
      console.log(`${batch.name}: ${state} ${JSON.stringify(status.metadata?.batchStats ?? {})}`);
      waiting.push(batch);
      continue;
    }
    if (state !== 'BATCH_STATE_SUCCEEDED') {
      console.error(`${batch.name}: ${state} ${status.error?.message ?? ''}; its phrases go in the next submit.`);
      continue;
    }
    for (const item of await batchItems(apiKey, status)) {
      const key = item.metadata?.key;
      const mp3 = item.response ? responseToMp3(item.response) : null;
      if (!key || !mp3) {
        failed += 1;
        console.error(`No audio for ${key ?? '?'}: ${item.error?.message ?? 'empty answer'}`);
        continue;
      }
      writeFileSync(join(getVoiceDir(HEBREW_VOICE), `${key}.mp3`), mp3);
      written += 1;
    }
    console.log(`${batch.name}: collected.`);
  }
  writeState(waiting);
  if (isDryRun) return;
  const keyCache = new Map<ClipVoice, Set<string>>();
  const manifest = writeManifest((voice) => {
    if (!keyCache.has(voice)) keyCache.set(voice, new Set(collectCorpus(voice).map((phrase) => phrase.key)));
    return keyCache.get(voice) as Set<string>;
  });
  console.log(`Wrote ${written} clips, ${failed} without audio, ${waiting.length} batches still running.`);
  console.log(`Manifest: he-female ${manifest.voices[HEBREW_VOICE]?.length ?? 0}, ${missingPhrases().length} Hebrew phrases still without a clip.`);
}

/** Deletes the clips of the lines that contain `text`, so the next submit renders them again. */
function redo(text: string | undefined): void {
  if (!text) throw new Error('Use: npm run tts:render:he -- redo "<part of the line>"');
  const lines = collectCorpus(HEBREW_VOICE).filter((phrase) => parseListenerGender(phrase.text).text.includes(text));
  for (const phrase of lines) {
    const file = join(getVoiceDir(HEBREW_VOICE), `${phrase.key}.mp3`);
    if (existsSync(file)) unlinkSync(file);
    console.log(`Deleted ${phrase.key}: ${phrase.text}`);
  }
  console.log(`${lines.length} clips to render again: run submit, then collect.`);
}

async function main(): Promise<void> {
  const [command, argument] = process.argv.slice(2).filter((arg) => arg !== '--');
  if (command === 'redo') return redo(argument);
  const apiKey = readApiKey();
  if (command === 'submit') return submit(apiKey);
  if (command === 'status') return collect(apiKey, true);
  if (command === 'collect') return collect(apiKey, false);
  throw new Error('Use: npm run tts:render:he -- submit | status | collect | redo "<text>"');
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
