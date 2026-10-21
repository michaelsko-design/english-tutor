/**
 * Renders the read-aloud clips with Azure Neural voices into public/tts/<voice>/<key>.mp3 and
 * writes public/tts/manifest.json: `npm run tts:render -- [--voice female|male] [--limit N]`. The Hebrew
 * voice is rendered with Gemini instead: `npm run tts:render:he` (renderGeminiBatch.ts).
 * It skips clips already on disk, so a stopped run continues where it left off. Needs
 * AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in .env.local.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadEnv } from 'vite';
import { AzureTtsError, readAzureConfig, synthesize, type AzureConfig } from '../../api/_lib/azureTts';
import { HEBREW_VOICE, isTtsVoice, type ClipVoice } from '../../src/services/tts/ttsText';
import { collectCorpus, type CorpusPhrase } from './corpus';
import { getVoiceDir, listRenderedKeys, writeManifest } from './clipManifest';

const CONCURRENCY = 2;
const REQUEST_TIMEOUT_MS = 20_000;
const MAX_ATTEMPTS = 6;
const FIRST_BACKOFF_MS = 5_000;
const MAX_BACKOFF_MS = 120_000;
const MANIFEST_EVERY = 200;

function readArg(name: string): string | undefined {
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function renderOne(phrase: CorpusPhrase, voice: ClipVoice, config: AzureConfig): Promise<boolean> {
  let backoff = FIRST_BACKOFF_MS;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const audio = await synthesize(phrase.text, voice, phrase.speed, config, REQUEST_TIMEOUT_MS);
      writeFileSync(join(getVoiceDir(voice), `${phrase.key}.mp3`), Buffer.from(audio));
      return true;
    } catch (error) {
      const status = error instanceof AzureTtsError ? error.status : 0;
      if (status === 401 || status === 403) throw error;
      if (attempt === MAX_ATTEMPTS) {
        console.error(`Failed ${phrase.key} (status ${status || 'network'}): "${phrase.text.slice(0, 60)}"`);
        return false;
      }
      await sleep(backoff);
      backoff = Math.min(backoff * 2, MAX_BACKOFF_MS);
    }
  }
  return false;
}

async function main(): Promise<void> {
  const voiceArg = readArg('voice') ?? 'female';
  if (!isTtsVoice(voiceArg)) throw new Error(`Unknown voice "${voiceArg}"; use female, male or he-female.`);
  const voice: ClipVoice = voiceArg;
  if (voice === HEBREW_VOICE) throw new Error('Hebrew clips are rendered with Gemini: npm run tts:render:he -- submit, then -- collect.');
  const limit = Number(readArg('limit') ?? Infinity);
  const config = readAzureConfig(loadEnv('development', process.cwd(), 'AZURE_'));
  if (!config) throw new Error('Set AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in .env.local.');

  const corpus = collectCorpus(voice);
  const keyCache = new Map<ClipVoice, Set<string>>([[voice, new Set(corpus.map((phrase) => phrase.key))]]);
  const corpusKeys = (v: ClipVoice) => {
    if (!keyCache.has(v)) keyCache.set(v, new Set(collectCorpus(v).map((phrase) => phrase.key)));
    return keyCache.get(v) as Set<string>;
  };
  mkdirSync(getVoiceDir(voice), { recursive: true });
  const existing = listRenderedKeys(voice);
  const todo = corpus.filter((phrase) => !existing.has(phrase.key)).slice(0, limit);
  const todoChars = todo.reduce((sum, phrase) => sum + phrase.text.length, 0);
  console.log(`${voice}: ${existing.size} clips on disk, rendering ${todo.length} (${todoChars} characters).`);

  let done = 0;
  let failed = 0;
  let chars = 0;
  let next = 0;
  const worker = async () => {
    while (next < todo.length) {
      const phrase = todo[next];
      next += 1;
      if (await renderOne(phrase, voice, config)) {
        done += 1;
        chars += phrase.text.length;
      } else {
        failed += 1;
      }
      if ((done + failed) % MANIFEST_EVERY === 0) {
        writeManifest(corpusKeys);
        console.log(`  ${done + failed}/${todo.length} (${chars} characters so far)`);
      }
    }
  };
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  const manifest = writeManifest(corpusKeys);
  console.log(`Rendered ${done}, failed ${failed}, ${chars} characters used.`);
  console.log(`Manifest: ${Object.entries(manifest.voices).map(([v, keys]) => `${v} ${keys?.length ?? 0}`).join(', ')}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
