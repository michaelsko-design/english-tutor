/**
 * Uploads the rendered clips (public/tts/v<N>/<voice>/<key>.mp3) to the Cloudflare R2 bucket that
 * serves them: `npm run tts:upload -- [--force] [--dry-run]`. The object key equals the URL path
 * (`tts/v1/female/<key>.mp3`), so the app only needs the bucket's public base URL
 * (VITE_TTS_CLIP_BASE_URL). Clips already in the bucket are skipped unless --force (a `redo`
 * re-render needs --force). Needs R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and
 * R2_BUCKET in .env.local.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { loadEnv } from 'vite';
import { TTS_PUBLIC_DIR } from './clipManifest';

const CLIP_CACHE_CONTROL = 'public, max-age=31536000, immutable';
const UPLOAD_CONCURRENCY = 16;
const PROGRESS_EVERY = 500;

interface LocalClip {
  key: string;
  file: string;
}

interface R2Config {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
}

function readR2Config(): R2Config {
  const env = loadEnv('development', process.cwd(), 'R2_');
  const config = {
    accountId: env.R2_ACCOUNT_ID?.trim(),
    accessKeyId: env.R2_ACCESS_KEY_ID?.trim(),
    secretAccessKey: env.R2_SECRET_ACCESS_KEY?.trim(),
    bucket: env.R2_BUCKET?.trim(),
  };
  if (!config.accountId || !config.accessKeyId || !config.secretAccessKey || !config.bucket) {
    throw new Error('Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET in .env.local.');
  }
  return config as R2Config;
}

function listLocalClips(): LocalClip[] {
  const clips: LocalClip[] = [];
  for (const version of readdirSync(TTS_PUBLIC_DIR, { withFileTypes: true })) {
    if (!version.isDirectory()) continue;
    for (const voice of readdirSync(join(TTS_PUBLIC_DIR, version.name), { withFileTypes: true })) {
      if (!voice.isDirectory()) continue;
      const dir = join(TTS_PUBLIC_DIR, version.name, voice.name);
      for (const name of readdirSync(dir).filter((entry) => entry.endsWith('.mp3'))) {
        clips.push({ key: `tts/${version.name}/${voice.name}/${name}`, file: join(dir, name) });
      }
    }
  }
  return clips;
}

async function listRemoteKeys(client: S3Client, bucket: string): Promise<Set<string>> {
  const keys = new Set<string>();
  let token: string | undefined;
  do {
    const page = await client.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: 'tts/', ContinuationToken: token }));
    for (const object of page.Contents ?? []) if (object.Key) keys.add(object.Key);
    token = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (token);
  return keys;
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
  const dryRun = args.includes('--dry-run');
  const config = readR2Config();
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
  });

  const local = listLocalClips();
  const remote = force ? new Set<string>() : await listRemoteKeys(client, config.bucket);
  const pending = local.filter((clip) => !remote.has(clip.key));
  console.log(`${local.length} local clips, ${local.length - pending.length} already uploaded, ${pending.length} to upload.`);
  if (dryRun || pending.length === 0) return;

  const uploaded = await uploadAll(client, config.bucket, pending);
  console.log(`Uploaded ${uploaded} clips.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
