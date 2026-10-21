import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { LearnerProfile } from '../types/learner';

const firestore = vi.hoisted(() => ({
  getDocFromServer: vi.fn(),
  getDocFromCache: vi.fn(),
  runTransaction: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock('./firebase', () => ({ db: { fake: true } }));
vi.mock('firebase/firestore', () => ({ doc: vi.fn(() => ({ path: 'learners/u1' })), ...firestore }));

const { migrateAndSyncProfileOnLogin } = await import('./cloudSync');

const freshDefault = {
  isOnboarded: false,
  name: '',
  stats: { xp: 0, level: 1, stars: 0, diamonds: 50 },
  updatedAt: new Date(0).toISOString(),
} as unknown as LearnerProfile;

const snapshot = (exists: boolean, data: Partial<LearnerProfile> = {}) => ({ exists: () => exists, data: () => data });

beforeEach(() => {
  Object.values(firestore).forEach((mock) => mock.mockReset());
});

describe('migrateAndSyncProfileOnLogin', () => {
  it('loads an existing profile from the server and writes nothing', async () => {
    firestore.getDocFromServer.mockResolvedValue(
      snapshot(true, { isOnboarded: true, stats: { xp: 896, level: 6 } } as Partial<LearnerProfile>),
    );

    const profile = await migrateAndSyncProfileOnLogin('u1', freshDefault);

    expect(profile.isOnboarded).toBe(true);
    expect(profile.stats.xp).toBe(896);
    expect(firestore.runTransaction).not.toHaveBeenCalled();
    expect(firestore.setDoc).not.toHaveBeenCalled();
  });

  it('creates the default only when the transaction still finds no profile', async () => {
    firestore.getDocFromServer.mockResolvedValue(snapshot(false));
    const set = vi.fn();
    firestore.runTransaction.mockImplementation((_db, run) => run({ get: async () => snapshot(false), set }));

    const profile = await migrateAndSyncProfileOnLogin('u1', freshDefault);

    expect(set).toHaveBeenCalledTimes(1);
    expect(profile.isOnboarded).toBe(false);
  });

  it('keeps a profile that appeared before the transaction instead of overwriting it', async () => {
    firestore.getDocFromServer.mockResolvedValue(snapshot(false));
    const set = vi.fn();
    firestore.runTransaction.mockImplementation((_db, run) =>
      run({ get: async () => snapshot(true, { isOnboarded: true, stats: { xp: 896, level: 6 } } as Partial<LearnerProfile>), set }),
    );

    const profile = await migrateAndSyncProfileOnLogin('u1', freshDefault);

    expect(set).not.toHaveBeenCalled();
    expect(profile.stats.xp).toBe(896);
  });

  it('opens from a cached profile when the server cannot be reached', async () => {
    firestore.getDocFromServer.mockRejectedValue(new Error('unavailable'));
    firestore.getDocFromCache.mockResolvedValue(snapshot(true, { isOnboarded: true } as Partial<LearnerProfile>));

    const profile = await migrateAndSyncProfileOnLogin('u1', freshDefault);

    expect(profile.isOnboarded).toBe(true);
    expect(firestore.runTransaction).not.toHaveBeenCalled();
  });

  it('fails (retry screen) rather than creating a default when offline with nothing cached', async () => {
    firestore.getDocFromServer.mockRejectedValue(new Error('unavailable'));
    firestore.getDocFromCache.mockRejectedValue(new Error('not cached'));

    await expect(migrateAndSyncProfileOnLogin('u1', freshDefault)).rejects.toThrow('unavailable');
    expect(firestore.runTransaction).not.toHaveBeenCalled();
    expect(firestore.setDoc).not.toHaveBeenCalled();
  });
});
