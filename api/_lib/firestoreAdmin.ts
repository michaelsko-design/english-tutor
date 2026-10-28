/**
 * Server-side Firestore access with the service account, through the REST API (no Admin SDK, like
 * googleAdmin.ts). It bypasses security rules, so callers must only use it for server jobs.
 */
import { AdminError, createAccessTokenProvider, type AdminDeps, type ServiceAccount } from './googleAdmin.js';

const PAGE_SIZE = 300;

type FirestoreValue = {
  stringValue?: string;
  integerValue?: string;
  booleanValue?: boolean;
  doubleValue?: number;
  nullValue?: null;
  arrayValue?: { values?: FirestoreValue[] };
};

interface RestDocument {
  name: string;
  fields?: Record<string, FirestoreValue>;
  updateTime?: string;
}

/** Plain field values; lists hold strings only (all this server writes) */
export type PlainValue = string | number | boolean | null | string[];

export interface PlainDocument {
  id: string;
  fields: Record<string, PlainValue>;
  /** Server version of the document, for `commit` preconditions */
  updateTime?: string;
}

function plainValue(value: FirestoreValue): PlainValue | undefined {
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return Number(value.integerValue);
  if (value.doubleValue !== undefined) return value.doubleValue;
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.nullValue !== undefined) return null;
  if (value.arrayValue !== undefined) {
    return (value.arrayValue.values ?? []).flatMap((item) => (item.stringValue !== undefined ? [item.stringValue] : []));
  }
  return undefined;
}

export function toFirestoreValue(value: PlainValue): FirestoreValue {
  if (value === null) return { nullValue: null };
  if (Array.isArray(value)) return { arrayValue: { values: value.map((item) => ({ stringValue: item })) } };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
}

/** One write of an atomic `commit`: replace a whole document, or only the listed fields. */
export interface DocumentWrite {
  collection: string;
  id: string;
  fields: Record<string, PlainValue>;
  /** Only these fields change (the rest of the document stays); omitted = replace the document */
  mergeFields?: string[];
  /** `false`: the write fails if the document exists (idempotency); a string: its `updateTime` must still match */
  precondition?: { exists: false } | { updateTime: string };
}

/** A `commit` was refused by a precondition: someone else wrote first */
export class ConflictError extends Error {
  constructor() {
    super('Firestore precondition failed');
  }
}

export function toPlainDocument(doc: RestDocument): PlainDocument {
  const fields: Record<string, PlainValue> = {};
  for (const [key, value] of Object.entries(doc.fields ?? {})) {
    const plain = plainValue(value);
    if (plain !== undefined) fields[key] = plain;
  }
  return { id: doc.name.slice(doc.name.lastIndexOf('/') + 1), fields, ...(doc.updateTime ? { updateTime: doc.updateTime } : {}) };
}

export function createFirestoreAdmin(account: ServiceAccount, projectId: string, deps: AdminDeps = {}) {
  const fetchImpl = deps.fetchImpl ?? fetch;
  const getAccessToken = createAccessTokenProvider(account, deps);
  const base = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

  const documentName = (collection: string, id: string) =>
    `projects/${projectId}/databases/(default)/documents/${collection}/${encodeURIComponent(id)}`;

  async function request(url: string, method: 'GET' | 'DELETE' | 'POST', body?: unknown): Promise<Response> {
    const token = await getAccessToken();
    return fetchImpl(url, {
      method,
      headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  }

  function toRestWrite(write: DocumentWrite) {
    const fields = Object.fromEntries(Object.entries(write.fields).map(([key, value]) => [key, toFirestoreValue(value)]));
    return {
      update: { name: documentName(write.collection, write.id), fields },
      ...(write.mergeFields ? { updateMask: { fieldPaths: write.mergeFields } } : {}),
      ...(write.precondition ? { currentDocument: write.precondition } : {}),
    };
  }

  return {
    /** Every document of a top-level collection, following the pages. */
    async listDocuments(collection: string): Promise<PlainDocument[]> {
      const documents: PlainDocument[] = [];
      let pageToken = '';
      do {
        const query = `pageSize=${PAGE_SIZE}${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`;
        const response = await request(`${base}/${collection}?${query}`, 'GET');
        if (!response.ok) throw new AdminError('Firestore list failed', response.status);
        const body = (await response.json()) as { documents?: RestDocument[]; nextPageToken?: string };
        documents.push(...(body.documents ?? []).map(toPlainDocument));
        pageToken = body.nextPageToken ?? '';
      } while (pageToken);
      return documents;
    },

    /** One document, or null when it doesn't exist. */
    async getDocument(collection: string, id: string): Promise<PlainDocument | null> {
      const response = await request(`${base}/${collection}/${encodeURIComponent(id)}`, 'GET');
      if (response.status === 404) return null;
      if (!response.ok) throw new AdminError('Firestore read failed', response.status);
      return toPlainDocument((await response.json()) as RestDocument);
    },

    /** All writes at once or none; a failed precondition throws ConflictError. */
    async commit(writes: DocumentWrite[]): Promise<void> {
      const response = await request(`${base}:commit`, 'POST', { writes: writes.map(toRestWrite) });
      if (response.status === 409 || response.status === 412) throw new ConflictError();
      if (response.status === 400 || response.status === 404) {
        // A failed `exists`/`updateTime` precondition can come back as FAILED_PRECONDITION (400) or NOT_FOUND
        const body = (await response.json().catch(() => ({}))) as { error?: { status?: string } };
        if (body.error?.status === 'FAILED_PRECONDITION' || body.error?.status === 'NOT_FOUND' || body.error?.status === 'ALREADY_EXISTS') {
          throw new ConflictError();
        }
      }
      if (!response.ok) throw new AdminError('Firestore commit failed', response.status);
    },

    async deleteDocument(collection: string, id: string): Promise<void> {
      const response = await request(`${base}/${collection}/${encodeURIComponent(id)}`, 'DELETE');
      if (!response.ok && response.status !== 404) throw new AdminError('Firestore delete failed', response.status);
    },
  };
}

export type FirestoreAdmin = ReturnType<typeof createFirestoreAdmin>;
