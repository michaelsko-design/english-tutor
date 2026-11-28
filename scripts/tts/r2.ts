/** The Cloudflare R2 bucket the clips are served from. Needs the R2_* values in .env.local. */
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { loadEnv } from 'vite';

export interface R2Config {
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

export function openR2(): { client: S3Client; bucket: string } {
  const config = readR2Config();
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
  });
  return { client, bucket: config.bucket };
}

/** Bucket path → ETag without its quotes (the MD5 of the bytes, for clips uploaded in one part). */
export async function listRemoteClips(client: S3Client, bucket: string): Promise<Map<string, string>> {
  const clips = new Map<string, string>();
  let token: string | undefined;
  do {
    const page = await client.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: 'tts/', ContinuationToken: token }));
    for (const object of page.Contents ?? []) if (object.Key) clips.set(object.Key, (object.ETag ?? '').replace(/"/g, ''));
    token = page.IsTruncated ? page.NextContinuationToken : undefined;
  } while (token);
  return clips;
}
