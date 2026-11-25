import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import type { InboxItem } from '../reviewMarks';
import worker, { type D1Like, type D1Statement, type Env } from './worker';

// Loaded through require: Vite does not resolve the newer built-in
const { DatabaseSync } = createRequire(import.meta.url)('node:sqlite') as typeof import('node:sqlite');

const TOKEN = 'test-token-0123456789abcdef0123456789abcdef';
const FP = '100-0123456789abcdef';

/** D1 over a real SQLite in memory, so the statements run as written. */
function fakeD1(): D1Like {
  const db = new DatabaseSync(':memory:');
  db.exec(readFileSync(join(process.cwd(), 'scripts', 'tts', 'reviewWorker', 'schema.sql'), 'utf8'));
  const statement = (sql: string, values: (string | null)[] = []): D1Statement => ({
    bind: (...next) => statement(sql, next),
    all: async <T>() => ({ results: db.prepare(sql).all(...values) as T[] }),
    run: async () => void db.prepare(sql).run(...values),
  });
  return {
    prepare: (sql) => statement(sql),
    batch: async (statements) => {
      for (const one of statements) await one.run();
    },
  };
}

function fakeStore(): Env['STORE'] {
  const objects = new Map<string, string>();
  return {
    get: async (key) => (objects.has(key) ? { text: async () => objects.get(key) as string } : null),
    put: async (key, value) => void objects.set(key, value),
  };
}

let env: Env;
const call = (path: string, init: { method?: string; body?: unknown; token?: string | null } = {}) => {
  const { method = 'GET', body, token = TOKEN } = init;
  return worker.fetch(
    new Request(`https://review.example${path}`, {
      method,
      headers: token === null ? {} : { Authorization: `Bearer ${token}` },
      ...(body !== undefined && { body: typeof body === 'string' ? body : JSON.stringify(body) }),
    }),
    env,
  );
};
const json = async (response: Response) => (await response.json()) as Record<string, never>;
const mark = (markedAt: string, status: 'good' | 'regenerate' | null = 'good', key = 'abc1'): InboxItem => ({
  key,
  fp: FP,
  markedAt,
  entry: status && { status, fp: FP, at: markedAt.slice(0, 10), markedAt },
});
const T1 = '2026-11-25T10:00:00.000Z';
const T2 = '2026-11-25T11:00:00.000Z';

beforeEach(() => {
  env = { DB: fakeD1(), STORE: fakeStore(), HEBREW_REVIEW_TOKEN: TOKEN };
});

describe('review worker: access', () => {
  it.each([
    ['no token', null],
    ['a wrong token', 'test-token-wrong-0123456789abcdef0123456'],
    ['an empty token', ''],
  ])('answers 401 to %s on every route', async (_label, token) => {
    for (const [path, method] of [['/api/snapshot', 'GET'], ['/api/marks', 'GET'], ['/api/inbox', 'PUT'], ['/api/inbox/clear', 'POST']]) {
      expect((await call(path as string, { method, token })).status).toBe(401);
    }
  });

  it('refuses to serve when the secret is missing or short', async () => {
    env = { ...env, HEBREW_REVIEW_TOKEN: 'short' };
    expect((await call('/api/marks', { token: 'short' })).status).toBe(500);
  });

  it('answers 404 to an unknown route', async () => {
    expect((await call('/api/other')).status).toBe(404);
  });
});

describe('review worker: snapshot and marks', () => {
  it('has no snapshot until the PC sends one', async () => {
    expect((await call('/api/snapshot')).status).toBe(404);
    expect((await call('/api/snapshot', { method: 'PUT', body: { version: 1, items: [] } })).status).toBe(200);
    expect(await json(await call('/api/snapshot'))).toEqual({ version: 1, items: [] });
  });

  it('rejects a body that is not a snapshot', async () => {
    expect((await call('/api/snapshot', { method: 'PUT', body: { items: 1 } })).status).toBe(400);
    expect((await call('/api/snapshot', { method: 'PUT', body: 'not json' })).status).toBe(400);
  });

  it('lays the waiting phone marks over the PC marks', async () => {
    await call('/api/marks', { method: 'PUT', body: { marks: { abc2: { status: 'good', fp: FP, at: '2026-10-30' } } } });
    await call('/api/inbox', { method: 'PUT', body: { items: [mark(T1, 'regenerate')] } });
    const { marks } = await json(await call('/api/marks'));
    expect(Object.keys(marks).sort()).toEqual(['abc1', 'abc2']);
  });

  it('rejects bad marks', async () => {
    expect((await call('/api/marks', { method: 'PUT', body: { marks: { abc2: { status: 'x' } } } })).status).toBe(400);
  });
});

describe('review worker: inbox', () => {
  const put = (...items: InboxItem[]) => call('/api/inbox', { method: 'PUT', body: { items } });
  const inbox = async () => (await json(await call('/api/inbox'))).items as unknown as InboxItem[];

  it('keeps the newest mark of a clip, whatever order they arrive in', async () => {
    await put(mark(T2, 'regenerate'));
    await put(mark(T1, 'good'));
    expect(await inbox()).toEqual([mark(T2, 'regenerate')]);
  });

  it('keeps a clear as an item without a mark', async () => {
    await put(mark(T1));
    await put(mark(T2, null));
    expect(await inbox()).toEqual([mark(T2, null)]);
  });

  it('clears only the items that did not change since they were read', async () => {
    await put(mark(T1, 'good', 'abc1'), mark(T2, 'good', 'abc2'));
    const response = await call('/api/inbox/clear', {
      method: 'POST',
      body: { items: [{ key: 'abc1', markedAt: T1 }, { key: 'abc2', markedAt: T1 }] },
    });
    expect(response.status).toBe(200);
    expect((await inbox()).map((item) => item.key)).toEqual(['abc2']);
  });

  it('rejects an invalid or oversized batch', async () => {
    expect((await put({ ...mark(T1), key: '../x' })).status).toBe(400);
    const many = Array.from({ length: 501 }, (_, i) => mark(T1, 'good', `k${i}`));
    expect((await put(...many)).status).toBe(400);
    expect((await call('/api/inbox', { method: 'PUT', body: 'x'.repeat(600_000) })).status).toBe(413);
  });
});
