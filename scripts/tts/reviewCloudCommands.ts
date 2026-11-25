/**
 * `npm run tts:review:he -- sync | link | setup-token`: the PC commands of the phone review
 * (docs/hebrew-review-phone.md).
 */
import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadEnv } from 'vite';
import { HEBREW_VOICE, type ClipVoice } from '../../src/services/tts/ttsText';
import { getClipObjectKey, getVoiceDir } from './clipManifest';
import type { ReviewCatalog } from './hebrewReviewCatalog';
import { getReviewDirs } from './hebrewReviewPaths';
import { inspectClip, readTakes } from './hebrewReviewState';
import { syncMarks } from './hebrewReviewSync';
import { listRemoteClips, openR2 } from './r2';
import { createCloudClient, readCloudConfig, type CloudClient } from './reviewCloudClient';
import { buildSnapshot } from './reviewCloudSnapshot';
import type { LinePart } from './wholeLines';

/** A cut line's English part is a clip of the English female voice. */
const voiceOf = (voice: LinePart['voice']): ClipVoice => (voice === 'en' ? 'female' : HEBREW_VOICE);

export async function publishSnapshot(cloud: CloudClient, catalog: ReviewCatalog): Promise<void> {
  const clipBaseUrl = loadEnv('development', process.cwd(), 'VITE_TTS_').VITE_TTS_CLIP_BASE_URL?.trim();
  if (!clipBaseUrl) throw new Error('Set VITE_TTS_CLIP_BASE_URL in .env.local.');
  const { client, bucket } = openR2();
  const takes = readTakes(getReviewDirs());
  const { snapshot, skipped } = buildSnapshot({
    catalog,
    clipBaseUrl,
    inspect: (voice, key) => inspectClip(join(getVoiceDir(voiceOf(voice)), `${key}.mp3`)),
    objectPath: (voice, key) => getClipObjectKey(voiceOf(voice), key),
    remoteEtags: await listRemoteClips(client, bucket),
    hasTake: (key) => takes.has(key),
  });
  await cloud.putSnapshot(snapshot);
  console.log(`Phone page: ${snapshot.items.length} lines sent.`);
  if (skipped.notUploaded + skipped.lines > 0) {
    console.log(`Left out until uploaded (npm run tts:upload): ${skipped.notUploaded} clips, ${skipped.lines} whole lines.`);
  }
  if (skipped.missing > 0) console.log(`${skipped.missing} lines have no clip on this PC.`);
}

/** Takes the phone marks and sends the PC marks, saying what happened. */
export async function syncAndReport(cloud: CloudClient): Promise<void> {
  const { applied, dropped } = await syncMarks(cloud, getReviewDirs());
  const changed = dropped.filter((mark) => mark.why === 'changed').length;
  console.log(`Marks synced: ${applied} taken from the phone.`);
  if (changed > 0) console.log(`${changed} phone marks were for audio this PC no longer has: those clips are to review again.`);
  if (dropped.length > changed) console.log(`${dropped.length - changed} phone marks were older than a mark made here.`);
}

/** Creates the access token (never printed), keeps it in .env.local and gives it to the Worker. */
function setUpToken(): void {
  const existing = loadEnv('development', process.cwd(), 'HEBREW_REVIEW_').HEBREW_REVIEW_TOKEN?.trim();
  const token = existing || randomBytes(32).toString('base64url');
  if (!existing) {
    appendFileSync(join(process.cwd(), '.env.local'), `\n# Phone review of the Hebrew clips (docs/hebrew-review-phone.md)\nHEBREW_REVIEW_TOKEN=${token}\n`);
  }
  const result = spawnSync('npx wrangler@4 secret put HEBREW_REVIEW_TOKEN', {
    cwd: join(process.cwd(), 'scripts', 'tts', 'reviewWorker'),
    input: `${token}\n`,
    stdio: ['pipe', 'inherit', 'inherit'],
    shell: true,
  });
  if (result.status !== 0) throw new Error('wrangler could not store the token (are you signed in? npx wrangler@4 login).');
}

export async function runCloudCommand(command: string, catalog: ReviewCatalog): Promise<void> {
  if (command === 'setup-token') return setUpToken();
  const config = readCloudConfig();
  if (!config) throw new Error('Set HEBREW_REVIEW_URL and HEBREW_REVIEW_TOKEN in .env.local (docs/hebrew-review-phone.md).');
  if (command === 'link') {
    console.log(`Open on your phone (the link signs it in, so keep it private):\n${config.url}/#token=${config.token}`);
    return;
  }
  if (command !== 'sync') throw new Error('Use: npm run tts:review:he [-- sync | link | setup-token]');
  const cloud = createCloudClient(config);
  await syncAndReport(cloud);
  await publishSnapshot(cloud, catalog);
}
