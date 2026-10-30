/**
 * Renders the Hebrew clips with Gemini through its batch API (interactive requests are capped at
 * 100 a day; a batch has its own limits, costs half and finishes within 24 hours, usually minutes):
 *   npm run tts:render:he -- submit    sends every Hebrew corpus phrase that has no clip yet
 *   npm run tts:render:he -- status    shows how the submitted batches are doing
 *   npm run tts:render:he -- regenerate   sends the clips marked "regenerate" in the review (npm run tts:review:he)
 *                                      as new takes; collect saves them to .tts-candidates, the originals stay
 *   npm run tts:render:he -- lab        renders a few flagged lines in several ways (geminiLab.ts) to compare by ear
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
import { bumpClipRevisions } from './clipRevisions';
import { getVoiceDir, listRenderedKeys, writeManifest } from './clipManifest';
import { toGeminiText } from './geminiSpelling';
import { CANDIDATE_DIR, getReviewDirs } from './hebrewReviewPaths';
import { keysToRegenerate, listReviewItems, loadState } from './hebrewReviewState';
import {
  buildGeminiRequest,
  GEMINI_API_BASE,
  GEMINI_TTS_MODEL,
  joinPcm,
  encodeMp3,
  responseToMp3,
  responseToPcm,
  type GeminiResponse,
  type Pcm,
} from './geminiTts';
import {
  LAB_GAP_MS,
  LAB_TAKE_PREFIX,
  LAB_VARIANTS,
  labRequestKey,
  labSegments,
  MODEL_LAB_MODELS,
  MODEL_LAB_VARIANTS,
  parseLabRequestKey,
  pickLabKeys,
  type LabVariant,
  type ModelVariant,
} from './geminiLab';

const STATE_FILE = join(process.cwd(), '.tts-gemini-batches.json');
/** Requests per batch: a batch's answer holds all its audio inline, so it stays tens of MB. */
const BATCH_SIZE = 300;
const LAB_PER_CLASS = 4;
const DONE_STATES = new Set(['BATCH_STATE_SUCCEEDED', 'BATCH_STATE_FAILED', 'BATCH_STATE_CANCELLED', 'BATCH_STATE_EXPIRED']);

/** 'lab': pieces of lines in several ways (geminiLab.ts), stitched into candidate takes. */
type BatchTarget = 'clip' | 'candidate' | 'lab';

interface SubmittedBatch {
  name: string;
  count: number;
  /** 'candidate': a new take of a reviewed clip, saved beside the original instead of over it. */
  target?: BatchTarget;
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
  console.log(`${missingPhrases().length} Hebrew phrases without a clip.`);
  return submitPhrases(apiKey, missingPhrases(), 'clip');
}

/** The lines marked for regenerate in the review: rendered as new takes, the originals stay. */
async function regenerate(apiKey: string): Promise<void> {
  const dirs = getReviewDirs();
  const phrases = collectCorpus(HEBREW_VOICE);
  const keys = new Set(keysToRegenerate(listReviewItems(phrases, loadState(dirs.statePath), dirs)));
  console.log(`${keys.size} clips marked for regenerate.`);
  return submitPhrases(apiKey, phrases.filter((phrase) => keys.has(phrase.key)), 'candidate');
}

/** A few flagged lines in every lab way: what to listen to before choosing how to fix the rest. */
async function lab(apiKey: string, isDryRun: boolean, isModelLab = false): Promise<void> {
  const variants: readonly LabVariant[] = isModelLab ? MODEL_LAB_VARIANTS : LAB_VARIANTS;
  const dirs = getReviewDirs();
  const phrases = collectCorpus(HEBREW_VOICE);
  const textByKey = new Map(phrases.map((phrase) => [phrase.key, phrase.text]));
  const flagged = listReviewItems(phrases, loadState(dirs.statePath), dirs).filter(
    (item) => (item.phase === 'regenerate' || item.phase === 'compare') && (item.reasons.length > 0 || item.note),
  );
  const picked = pickLabKeys(flagged, LAB_PER_CLASS);
  const requests = picked.flatMap((item) =>
    variants.flatMap((variant) => {
      const segments = labSegments(variant, textByKey.get(item.key) ?? item.text);
      const model = variant in MODEL_LAB_MODELS ? MODEL_LAB_MODELS[variant as ModelVariant] : undefined;
      return segments.map((text, index) => ({ key: labRequestKey(item.key, variant, index, segments.length), text, model }));
    }),
  );
  console.log(`Lab: ${picked.length} lines in ${variants.length} ways, ${requests.length} clips to render.`);
  if (isDryRun) {
    for (const request of requests) console.log(`${request.key}  ${request.text}`);
    return;
  }
  return submitRequests(apiKey, requests, 'lab');
}

async function submitPhrases(apiKey: string, todo: CorpusPhrase[], target: 'clip' | 'candidate'): Promise<void> {
  return submitRequests(apiKey, todo.map((phrase) => ({ key: phrase.key, text: toGeminiText(phrase.text) })), target);
}

/** `model` overrides the render's model for that request (the model lab); one batch goes to one model. */
async function submitRequests(apiKey: string, todo: { key: string; text: string; model?: string }[], target: BatchTarget): Promise<void> {
  // New clips and new takes are different phrases, so both kinds may wait at once; the same kind may not
  const waiting = readState();
  if (waiting.some((batch) => (batch.target ?? 'clip') === target)) {
    throw new Error('Batches are still waiting: run collect first (or delete .tts-gemini-batches.json).');
  }
  const submitted: SubmittedBatch[] = [...waiting];
  const models = [...new Set(todo.map((phrase) => phrase.model ?? GEMINI_TTS_MODEL))];
  for (const model of models) {
    const forModel = todo.filter((phrase) => (phrase.model ?? GEMINI_TTS_MODEL) === model);
    for (let start = 0; start < forModel.length; start += BATCH_SIZE) {
      const chunk = forModel.slice(start, start + BATCH_SIZE);
      const requests = chunk.map((phrase) => ({ request: buildGeminiRequest(phrase.text), metadata: { key: phrase.key } }));
      const batch = await gemini<{ name: string }>(apiKey, `models/${model}:batchGenerateContent`, {
        method: 'POST',
        body: JSON.stringify({ batch: { display_name: `hebrew-clips-${start / BATCH_SIZE + 1}`, input_config: { requests: { requests } } } }),
      });
      submitted.push({ name: batch.name, count: chunk.length, target });
      writeState(submitted);
      console.log(`Submitted ${batch.name} (${chunk.length} phrases, ${model}).`);
    }
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

/** Stitches the pieces of each lab line into its candidate take; a line with a piece missing is skipped. */
async function collectLab(items: BatchItem[]): Promise<{ written: number; failed: number }> {
  const lines = new Map<string, { count: number; parts: Map<number, Pcm> }>();
  let failed = 0;
  for (const item of items) {
    const parsed = parseLabRequestKey(item.metadata?.key ?? '');
    const pcm = item.response ? responseToPcm(item.response) : null;
    if (!parsed || !pcm) {
      failed += 1;
      console.error(`No audio for ${item.metadata?.key ?? '?'}: ${item.error?.message ?? 'empty answer'}`);
      continue;
    }
    const id = `${parsed.key}.${LAB_TAKE_PREFIX}${parsed.variant}`;
    const line = lines.get(id) ?? { count: parsed.count, parts: new Map<number, Pcm>() };
    line.parts.set(parsed.index, pcm);
    lines.set(id, line);
  }
  let written = 0;
  for (const [id, line] of lines) {
    if (line.parts.size !== line.count) {
      console.error(`${id}: ${line.parts.size} of ${line.count} pieces, skipped.`);
      continue;
    }
    const ordered = [...line.parts.entries()].sort(([a], [b]) => a - b).map(([, pcm]) => pcm);
    writeFileSync(join(CANDIDATE_DIR, `${id}.mp3`), encodeMp3(joinPcm(ordered, LAB_GAP_MS)));
    written += 1;
  }
  return { written, failed };
}

async function collect(apiKey: string, isDryRun: boolean): Promise<void> {
  const waiting: SubmittedBatch[] = [];
  let written = 0;
  let failed = 0;
  mkdirSync(getVoiceDir(HEBREW_VOICE), { recursive: true });
  mkdirSync(CANDIDATE_DIR, { recursive: true });
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
    if (batch.target === 'lab') {
      const result = await collectLab(await batchItems(apiKey, status));
      written += result.written;
      failed += result.failed;
      console.log(`${batch.name}: collected.`);
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
      writeFileSync(join(batch.target === 'candidate' ? CANDIDATE_DIR : getVoiceDir(HEBREW_VOICE), `${key}.mp3`), mp3);
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
  // A re-rendered clip keeps its file name: a new revision in its URL makes devices fetch the new take
  bumpClipRevisions(HEBREW_VOICE, lines.map((phrase) => phrase.key));
  console.log(`${lines.length} clips to render again: run submit, then collect.`);
}

async function main(): Promise<void> {
  const [command, argument] = process.argv.slice(2).filter((arg) => arg !== '--');
  if (command === 'redo') return redo(argument);
  const apiKey = readApiKey();
  if (command === 'submit') return submit(apiKey);
  if (command === 'regenerate') return regenerate(apiKey);
  if (command === 'lab') return lab(apiKey, process.argv.includes('dry'), process.argv.includes('models'));
  if (command === 'status') return collect(apiKey, true);
  if (command === 'collect') return collect(apiKey, false);
  throw new Error('Use: npm run tts:render:he -- submit | regenerate | lab | status | collect | redo "<text>"');
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
