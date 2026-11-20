import { describe, expect, it, vi } from 'vitest';
import { clearLocalAppData } from './clearLocalData';

function memoryStorage(entries: Record<string, string>): Storage {
  const map = new Map(Object.entries(entries));
  return {
    get length() {
      return map.size;
    },
    key: (index: number) => [...map.keys()][index] ?? null,
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => void map.set(key, value),
    removeItem: (key: string) => void map.delete(key),
    clear: () => map.clear(),
  };
}

describe('clearLocalAppData', () => {
  it("removes every key of the app from both storages and keeps other sites' keys", async () => {
    const local = memoryStorage({
      english_tutor_learner_profile_v2: '{"name":"נועה"}',
      english_tutor_device_id: 'd1',
      english_tutor_parent_code_kid1: 'ABC',
      'firebase:authUser': 'x',
    });
    const session = memoryStorage({ english_tutor_pending_access_code: 'X1', other: 'y' });
    const caches = { delete: vi.fn(async () => true) };
    const indexedDb = {
      databases: vi.fn(async () => [{ name: 'firestore/[DEFAULT]/demo/main' }, { name: 'firebaseLocalStorageDb' }]),
      deleteDatabase: vi.fn(),
    };

    await clearLocalAppData({ local, session, caches, indexedDb: indexedDb as never });

    expect(local.length).toBe(1);
    expect(local.getItem('firebase:authUser')).toBe('x');
    expect(session.getItem('english_tutor_pending_access_code')).toBeNull();
    expect(session.getItem('other')).toBe('y');
    expect(caches.delete).toHaveBeenCalledWith('englishvibe-tts-live-v1');
    expect(indexedDb.deleteDatabase).toHaveBeenCalledExactlyOnceWith('firestore/[DEFAULT]/demo/main');
  });

  it('never throws when storage or the cache is blocked', async () => {
    const blocked = {
      get length(): number {
        throw new Error('blocked');
      },
    } as unknown as Storage;
    const caches = { delete: vi.fn(async () => Promise.reject(new Error('blocked'))) };

    await expect(clearLocalAppData({ local: blocked, session: null, caches })).resolves.toBeUndefined();
  });
});
