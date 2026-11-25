/** The PC's side of the online review Worker (reviewWorker/worker.ts). */
import { loadEnv } from 'vite';
import type { MarksClient } from './hebrewReviewSync';
import type { Snapshot } from './reviewCloudSnapshot';
import { MAX_INBOX_BATCH, parseInboxItems, type InboxItem, type ReviewState } from './reviewMarks';

const TIMEOUT_MS = 60_000;

export interface CloudConfig {
  url: string;
  token: string;
}

/** HEBREW_REVIEW_URL and HEBREW_REVIEW_TOKEN from .env.local; null when the phone review is not set up. */
export function parseCloudConfig(env: Readonly<Record<string, string | undefined>>): CloudConfig | null {
  const url = env.HEBREW_REVIEW_URL?.trim().replace(/\/+$/, '');
  const token = env.HEBREW_REVIEW_TOKEN?.trim();
  if (!url || !token) return null;
  // The token goes in a header: never over plain http, except to the Worker run on this PC
  const { protocol, hostname } = new URL(url);
  if (protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(hostname)) throw new Error('HEBREW_REVIEW_URL must be https.');
  return { url, token };
}

export const readCloudConfig = (): CloudConfig | null => parseCloudConfig(loadEnv('development', process.cwd(), 'HEBREW_REVIEW_'));

export interface CloudClient extends MarksClient {
  putSnapshot(snapshot: Snapshot): Promise<void>;
}

export function createCloudClient({ url, token }: CloudConfig, send: typeof fetch = fetch): CloudClient {
  const call = async (path: string, method = 'GET', body?: unknown): Promise<unknown> => {
    const response = await send(`${url}${path}`, {
      method,
      headers: { Authorization: `Bearer ${token}`, ...(body !== undefined && { 'Content-Type': 'application/json' }) },
      ...(body !== undefined && { body: JSON.stringify(body) }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`Review page answered ${response.status} to ${method} ${path}.`);
    return response.json();
  };
  return {
    getInbox: async (): Promise<InboxItem[]> => parseInboxItems(((await call('/api/inbox')) as { items?: unknown }).items),
    putMarks: async (marks: ReviewState) => void (await call('/api/marks', 'PUT', { marks })),
    clearInbox: async (items) => {
      for (let start = 0; start < items.length; start += MAX_INBOX_BATCH) {
        await call('/api/inbox/clear', 'POST', { items: items.slice(start, start + MAX_INBOX_BATCH) });
      }
    },
    putSnapshot: async (snapshot) => void (await call('/api/snapshot', 'PUT', snapshot)),
  };
}
