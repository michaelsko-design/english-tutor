/**
 * The online half of the Hebrew clip review (a Cloudflare Worker, outside the app): it serves the
 * phone page (public/), keeps the line list and the PC's marks in a private R2 bucket and the marks
 * made on the phone in D1 until the PC takes them. Every /api request needs the owner's token.
 * A Worker's entry module may export only its handler (and types): constants live in reviewMarks.ts.
 */
import { MAX_INBOX_BATCH, overlayInbox, parseInboxItems, parseInboxRef, parseState, type InboxItem, type ReviewState } from '../reviewMarks';

export interface D1Statement {
  bind(...values: (string | null)[]): D1Statement;
  all<T>(): Promise<{ results: T[] }>;
  run(): Promise<unknown>;
}

export interface D1Like {
  prepare(sql: string): D1Statement;
  batch(statements: D1Statement[]): Promise<unknown>;
}

export interface Env {
  DB: D1Like;
  STORE: {
    get(key: string): Promise<{ text(): Promise<string> } | null>;
    put(key: string, value: string): Promise<unknown>;
  };
  HEBREW_REVIEW_TOKEN?: string;
}

const MIN_TOKEN_LENGTH = 32;
const MAX_SNAPSHOT_BYTES = 20 * 1024 * 1024;
const MAX_MARKS_BYTES = 8 * 1024 * 1024;
const MAX_INBOX_BYTES = 512 * 1024;
const D1_BATCH = 100;
const SNAPSHOT_OBJECT = 'snapshot.json';
const MARKS_OBJECT = 'marks.json';

class HttpError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}

const respond = (status: number, body: string): Response =>
  new Response(body, { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
const sendJson = (status: number, body: unknown): Response => respond(status, JSON.stringify(body));

const digest = async (text: string): Promise<Uint8Array> => new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));

/** Compares hashes of equal length, byte by byte to the end, so the timing says nothing about the token. */
async function isOwner(request: Request, token: string): Promise<boolean> {
  const [given, expected] = await Promise.all([digest(request.headers.get('Authorization') ?? ''), digest(`Bearer ${token}`)]);
  return expected.reduce((difference, byte, index) => difference | (byte ^ (given[index] as number)), 0) === 0;
}

async function readText(request: Request, maxBytes: number): Promise<string> {
  const tooLarge = () => new HttpError(413, 'Body too large.');
  if (Number(request.headers.get('Content-Length') ?? 0) > maxBytes) throw tooLarge();
  const text = await request.text();
  if (new TextEncoder().encode(text).length > maxBytes) throw tooLarge();
  return text;
}

/** Bad input from the caller becomes a 400. */
function validate<T>(read: () => T): T {
  try {
    return read();
  } catch (error) {
    throw new HttpError(400, error instanceof Error ? error.message : 'Bad request.');
  }
}

async function readList(request: Request): Promise<unknown[]> {
  const text = await readText(request, MAX_INBOX_BYTES);
  const items = validate(() => (JSON.parse(text) as { items?: unknown }).items);
  if (!Array.isArray(items) || items.length > MAX_INBOX_BATCH) throw new HttpError(400, 'Bad items.');
  return items;
}

async function runInBatches(db: D1Like, statements: D1Statement[]): Promise<void> {
  for (let start = 0; start < statements.length; start += D1_BATCH) await db.batch(statements.slice(start, start + D1_BATCH));
}

interface InboxRow {
  key: string;
  entry: string | null;
  fp: string;
  marked_at: string;
}

async function readInbox(db: D1Like): Promise<InboxItem[]> {
  const { results } = await db.prepare('SELECT key, entry, fp, marked_at FROM inbox ORDER BY marked_at, key').all<InboxRow>();
  return parseInboxItems(results.map((row) => ({ key: row.key, fp: row.fp, markedAt: row.marked_at, entry: row.entry === null ? null : JSON.parse(row.entry) })));
}

async function addToInbox(db: D1Like, items: readonly InboxItem[]): Promise<void> {
  // The newest mark of a clip wins: a phone that was offline may send an older one later
  const upsert = db.prepare(
    `INSERT INTO inbox (key, entry, fp, marked_at) VALUES (?, ?, ?, ?)
     ON CONFLICT (key) DO UPDATE SET entry = excluded.entry, fp = excluded.fp, marked_at = excluded.marked_at
     WHERE excluded.marked_at >= inbox.marked_at`,
  );
  await runInBatches(db, items.map((item) => upsert.bind(item.key, item.entry && JSON.stringify(item.entry), item.fp, item.markedAt)));
}

/** Only the item as it was read is removed: a newer mark of the same clip stays for the next sync. */
async function clearInbox(db: D1Like, refs: readonly Pick<InboxItem, 'key' | 'markedAt'>[]): Promise<void> {
  const remove = db.prepare('DELETE FROM inbox WHERE key = ? AND marked_at = ?');
  await runInBatches(db, refs.map((ref) => remove.bind(ref.key, ref.markedAt)));
}

async function readPcMarks(env: Env): Promise<ReviewState> {
  const object = await env.STORE.get(MARKS_OBJECT);
  return object ? parseState(JSON.parse(await object.text())) : {};
}

async function route(request: Request, env: Env): Promise<Response> {
  const route = `${request.method} ${new URL(request.url).pathname}`;
  switch (route) {
    case 'GET /api/snapshot': {
      const object = await env.STORE.get(SNAPSHOT_OBJECT);
      return object ? respond(200, await object.text()) : sendJson(404, { error: 'No lines yet: run  npm run tts:review:he -- sync  on the PC.' });
    }
    case 'PUT /api/snapshot': {
      const text = await readText(request, MAX_SNAPSHOT_BYTES);
      const snapshot = validate(() => JSON.parse(text) as { version?: unknown; items?: unknown });
      if (snapshot?.version !== 1 || !Array.isArray(snapshot.items)) throw new HttpError(400, 'Bad snapshot.');
      await env.STORE.put(SNAPSHOT_OBJECT, text);
      return sendJson(200, { ok: true });
    }
    case 'GET /api/marks':
      return sendJson(200, { marks: overlayInbox(await readPcMarks(env), await readInbox(env.DB)) });
    case 'PUT /api/marks': {
      const text = await readText(request, MAX_MARKS_BYTES);
      const marks = validate(() => parseState((JSON.parse(text) as { marks?: unknown }).marks));
      await env.STORE.put(MARKS_OBJECT, JSON.stringify(marks));
      return sendJson(200, { ok: true });
    }
    case 'GET /api/inbox':
      return sendJson(200, { items: await readInbox(env.DB) });
    case 'PUT /api/inbox': {
      const list = await readList(request);
      await addToInbox(env.DB, validate(() => parseInboxItems(list)));
      return sendJson(200, { ok: true });
    }
    case 'POST /api/inbox/clear': {
      const list = await readList(request);
      await clearInbox(env.DB, validate(() => list.map(parseInboxRef)));
      return sendJson(200, { ok: true });
    }
    default:
      return sendJson(404, { error: 'Not found.' });
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const token = env.HEBREW_REVIEW_TOKEN ?? '';
    if (token.length < MIN_TOKEN_LENGTH) return sendJson(500, { error: 'The review token is not set up.' });
    if (!(await isOwner(request, token))) return sendJson(401, { error: 'Not signed in.' });
    try {
      return await route(request, env);
    } catch (error) {
      if (error instanceof HttpError) return sendJson(error.status, { error: error.message });
      console.error(error);
      return sendJson(500, { error: 'Something went wrong.' });
    }
  },
};
