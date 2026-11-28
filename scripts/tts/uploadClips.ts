/**
 * Uploads the clips the manifest lists (public/tts/v<N>/<voice>/<key>.mp3) to the Cloudflare R2 bucket that
 * serves them: `npm run tts:upload -- [--force | --revised] [--voice <voice>] [--dry-run]` (`--voice` sends only that voice's clips). The object key equals the URL path
 * (`tts/v1/female/<key>.mp3`), so the app only needs the bucket's public base URL
 * (VITE_TTS_CLIP_BASE_URL). Clips already in the bucket are skipped unless --force (a `redo`
 * re-render needs --force, or --revised to replace only the clips listed in clipRevisions.ts). Needs R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and
 * R2_BUCKET in .env.local.
 */
import { existsSync, readFileSync } from 'node:fs';
import { PutObjectCommand, type S3Client } from '@aws-sdk/client-s3';
import { CLIP_REVISIONS } from '../../src/services/tts/clipRevisions';
import { listManifestClips, readManifest } from './clipManifest';
import { listRemoteClips, openR2 } from './r2';

const CLIP_CACHE_CONTROL = 'public, max-age=31536000, immutable';
const UPLOAD_CONCURRENCY = 16;
const PROGRESS_EVERY = 500;

interface LocalClip {
  key: string;
  file: string;
}

/** The clips the manifest lists, so clips that are not in it never reach the bucket. */
function listLocalClips(): LocalClip[] {
  const manifest = readManifest();
  if (!manifest) throw new Error('No public/tts/manifest.json: run tts:render (or tts:render:he -- collect) first.');
  const clips = listManifestClips(manifest);
  const missing = clips.filter((clip) => !existsSync(clip.file));
  if (missing.length > 0) throw new Error(`${missing.length} clips in the manifest have no file, e.g. ${missing[0]?.file}. Render them first.`);
  return clips;
}

async function uploadAll(client: S3Client, bucket: string, clips: LocalClip[]): Promise<number> {
  let next = 0;
  let done = 0;
  const worker = async (): Promise<void> => {
    while (next < clips.length) {
      const clip = clips[next++];
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: clip.key,
          Body: readFileSync(clip.file),
          ContentType: 'audio/mpeg',
          CacheControl: CLIP_CACHE_CONTROL,
        }),
      );
      done++;
      if (done % PROGRESS_EVERY === 0) console.log(`  ${done}/${clips.length}`);
    }
  };
  await Promise.all(Array.from({ length: UPLOAD_CONCURRENCY }, worker));
  return done;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const isRevisedOnly = args.includes('--revised');
  const dryRun = args.includes('--dry-run');
  const voiceIndex = args.indexOf('--voice');
  const onlyVoice = voiceIndex >= 0 ? args[voiceIndex + 1] : undefined;
  const { client, bucket } = openR2();

  const local = listLocalClips();
  const remote = force ? new Map<string, string>() : await listRemoteClips(client, bucket);
  // --revised: the clips re-rendered after they shipped (a revision entry) are sent again, the rest skipped as usual
  const isRevised = (clip: LocalClip): boolean => isRevisedOnly && /^tts\/v\d+\/([^/]+\/[^/]+)\.mp3$/.test(clip.key) && (clip.key.replace(/^tts\/v\d+\//, '').replace(/\.mp3$/, '') in CLIP_REVISIONS);
  const isWantedVoice = (clip: LocalClip): boolean => !onlyVoice || clip.key.split('/')[2] === onlyVoice;
  const pending = local.filter((clip) => isWantedVoice(clip) && (!remote.has(clip.key) || isRevised(clip)));
  console.log(`${local.length} local clips, ${local.length - pending.length} already uploaded, ${pending.length} to upload.`);
  if (dryRun || pending.length === 0) return;

  const uploaded = await uploadAll(client, bucket, pending);
  console.log(`Uploaded ${uploaded} clips.`);
  console.log('Reviewing on the phone? Run  npm run tts:review:he -- sync');
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
