import { describe, expect, it, vi } from 'vitest';
import { ConflictError, createFirestoreAdmin, toFirestoreValue, toPlainDocument } from './firestoreAdmin';
import { AdminError } from './googleAdmin';

async function makeAccount() {
  const pair = await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['sign', 'verify']
  );
  const pkcs8 = Buffer.from(await crypto.subtle.exportKey('pkcs8', pair.privateKey)).toString('base64');
  return { client_email: 'svc@p.iam', private_key: `-----BEGIN PRIVATE KEY-----\n${pkcs8.match(/.{1,64}/g)!.join('\n')}\n-----END PRIVATE KEY-----\n` };
}

function adminWith(answer: (url: string, init?: RequestInit) => Response) {
  const fetchImpl = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
    const url = String(input);
    if (url === 'https://oauth2.googleapis.com/token') return new Response(JSON.stringify({ access_token: 'access-1', expires_in: 3600 }));
    return answer(url, init);
  });
  return { fetchImpl, make: async () => createFirestoreAdmin(await makeAccount(), 'proj', { fetchImpl: fetchImpl as unknown as typeof fetch }) };
}

describe('Firestore values', () => {
  it('encodes and decodes strings, integers, doubles, booleans, null and string lists', () => {
    expect(toFirestoreValue(3900)).toEqual({ integerValue: '3900' });
    expect(toFirestoreValue(1.5)).toEqual({ doubleValue: 1.5 });
    expect(toFirestoreValue(null)).toEqual({ nullValue: null });
    expect(toFirestoreValue(['a', 'b'])).toEqual({ arrayValue: { values: [{ stringValue: 'a' }, { stringValue: 'b' }] } });
    const doc = toPlainDocument({
      name: 'projects/p/databases/(default)/documents/subscriptions/s1',
      updateTime: '2026-10-28T10:00:00Z',
      fields: { n: { integerValue: '7' }, none: { nullValue: null }, kids: { arrayValue: { values: [{ stringValue: 'k1' }] } }, empty: { arrayValue: {} } },
    });
    expect(doc).toEqual({ id: 's1', updateTime: '2026-10-28T10:00:00Z', fields: { n: 7, none: null, kids: ['k1'], empty: [] } });
  });
});

describe('createFirestoreAdmin', () => {
  it('reads one document, and null when it is missing', async () => {
    const { make } = adminWith((url) =>
      url.endsWith('/entitlements/kid1')
        ? new Response(JSON.stringify({ name: 'x/entitlements/kid1', fields: { status: { stringValue: 'active' } } }))
        : new Response('{}', { status: 404 })
    );
    const admin = await make();
    expect(await admin.getDocument('entitlements', 'kid1')).toEqual({ id: 'kid1', fields: { status: 'active' } });
    expect(await admin.getDocument('entitlements', 'kid2')).toBeNull();
  });

  it('commits writes with field masks and preconditions in one request', async () => {
    const { fetchImpl, make } = adminWith(() => new Response('{}'));
    const admin = await make();

    await admin.commit([
      { collection: 'payments', id: 'grow_1', fields: { at: 1 }, precondition: { exists: false } },
      { collection: 'checkouts', id: 'c1', fields: { status: 'paid' }, mergeFields: ['status'] },
    ]);

    const [url, init] = fetchImpl.mock.calls[1] as [string, RequestInit];
    expect(url).toBe('https://firestore.googleapis.com/v1/projects/proj/databases/(default)/documents:commit');
    expect(JSON.parse(String(init.body))).toEqual({
      writes: [
        {
          update: { name: 'projects/proj/databases/(default)/documents/payments/grow_1', fields: { at: { integerValue: '1' } } },
          currentDocument: { exists: false },
        },
        {
          update: { name: 'projects/proj/databases/(default)/documents/checkouts/c1', fields: { status: { stringValue: 'paid' } } },
          updateMask: { fieldPaths: ['status'] },
        },
      ],
    });
  });

  it('reports a failed precondition as a conflict and other failures as AdminError', async () => {
    const conflict = adminWith(() => new Response(JSON.stringify({ error: { status: 'ALREADY_EXISTS' } }), { status: 409 }));
    await expect((await conflict.make()).commit([])).rejects.toBeInstanceOf(ConflictError);
    const precondition = adminWith(() => new Response(JSON.stringify({ error: { status: 'FAILED_PRECONDITION' } }), { status: 400 }));
    await expect((await precondition.make()).commit([])).rejects.toBeInstanceOf(ConflictError);
    const broken = adminWith(() => new Response('{}', { status: 500 }));
    await expect((await broken.make()).commit([])).rejects.toBeInstanceOf(AdminError);
  });
});
