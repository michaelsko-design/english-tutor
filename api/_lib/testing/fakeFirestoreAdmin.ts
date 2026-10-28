/** An in-memory FirestoreAdmin for the payment functions' tests (honours commit preconditions). */
import { ConflictError, type DocumentWrite, type FirestoreAdmin, type PlainDocument, type PlainValue } from '../firestoreAdmin.js';

export interface FakeFirestore {
  admin: FirestoreAdmin;
  docs: Map<string, PlainDocument>;
  get(collection: string, id: string): Record<string, PlainValue> | undefined;
  seed(collection: string, id: string, fields: Record<string, PlainValue>): void;
  commits: DocumentWrite[][];
}

export function createFakeFirestore(): FakeFirestore {
  const docs = new Map<string, PlainDocument>();
  const commits: DocumentWrite[][] = [];
  let version = 0;
  const key = (collection: string, id: string) => `${collection}/${id}`;
  const store = (collection: string, id: string, fields: Record<string, PlainValue>) => {
    version += 1;
    docs.set(key(collection, id), { id, fields, updateTime: `v${version}` });
  };

  const admin = {
    async listDocuments(collection: string) {
      return [...docs.entries()].filter(([path]) => path.startsWith(`${collection}/`)).map(([, doc]) => doc);
    },
    async getDocument(collection: string, id: string) {
      return docs.get(key(collection, id)) ?? null;
    },
    async commit(writes: DocumentWrite[]) {
      for (const write of writes) {
        const existing = docs.get(key(write.collection, write.id));
        const pre = write.precondition;
        if (pre && 'exists' in pre && existing) throw new ConflictError();
        if (pre && 'updateTime' in pre && existing?.updateTime !== pre.updateTime) throw new ConflictError();
      }
      commits.push(writes);
      for (const write of writes) {
        const existing = docs.get(key(write.collection, write.id));
        const fields = write.mergeFields ? { ...(existing?.fields ?? {}), ...write.fields } : write.fields;
        store(write.collection, write.id, fields);
      }
    },
    async deleteDocument(collection: string, id: string) {
      docs.delete(key(collection, id));
    },
  } satisfies FirestoreAdmin;

  return {
    admin,
    docs,
    commits,
    get: (collection, id) => docs.get(key(collection, id))?.fields,
    seed: store,
  };
}
