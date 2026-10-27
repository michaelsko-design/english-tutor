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
};

interface RestDocument {
  name: string;
  fields?: Record<string, FirestoreValue>;
}

export type PlainValue = string | number | boolean;

export interface PlainDocument {
  id: string;
  fields: Record<string, PlainValue>;
}

function plainValue(value: FirestoreValue): PlainValue | undefined {
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return Number(value.integerValue);
  if (value.doubleValue !== undefined) return value.doubleValue;
  if (value.booleanValue !== undefined) return value.booleanValue;
  return undefined;
}

export function toPlainDocument(doc: RestDocument): PlainDocument {
  const fields: Record<string, PlainValue> = {};
  for (const [key, value] of Object.entries(doc.fields ?? {})) {
    const plain = plainValue(value);
    if (plain !== undefined) fields[key] = plain;
  }
  return { id: doc.name.slice(doc.name.lastIndexOf('/') + 1), fields };
}

export function createFirestoreAdmin(account: ServiceAccount, projectId: string, deps: AdminDeps = {}) {
  const fetchImpl = deps.fetchImpl ?? fetch;
  const getAccessToken = createAccessTokenProvider(account, deps);
  const base = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;

  async function request(url: string, method: 'GET' | 'DELETE'): Promise<Response> {
    const token = await getAccessToken();
    return fetchImpl(url, { method, headers: { Authorization: `Bearer ${token}` } });
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

    async deleteDocument(collection: string, id: string): Promise<void> {
      const response = await request(`${base}/${collection}/${encodeURIComponent(id)}`, 'DELETE');
      if (!response.ok && response.status !== 404) throw new AdminError('Firestore delete failed', response.status);
    },
  };
}

export type FirestoreAdmin = ReturnType<typeof createFirestoreAdmin>;
