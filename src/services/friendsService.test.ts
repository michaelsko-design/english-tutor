import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type Data = Record<string, unknown>;

const fake = vi.hoisted(() => ({
  db: {} as object | null,
  docs: new Map<string, Data>(),
  setDoc: vi.fn(),
  deleteDoc: vi.fn(),
  updateDoc: vi.fn(),
  batchSet: vi.fn(),
  batchCommit: vi.fn(),
  txSet: vi.fn(),
  onSnapshot: vi.fn(),
  where: vi.fn((...args: unknown[]) => ({ where: args })),
}));

vi.mock('firebase/firestore', () => {
  const snapshotOf = (path: string) => ({
    exists: () => fake.docs.has(path),
    data: () => fake.docs.get(path),
  });
  return {
    collection: vi.fn((_db: unknown, name: string) => ({ collection: name })),
    doc: vi.fn((_db: unknown, ...path: string[]) => ({ path: path.join('/') })),
    getDoc: vi.fn(async (ref: { path: string }) => snapshotOf(ref.path)),
    setDoc: fake.setDoc,
    deleteDoc: fake.deleteDoc,
    updateDoc: fake.updateDoc,
    query: vi.fn((...args: unknown[]) => ({ query: args })),
    where: fake.where,
    onSnapshot: fake.onSnapshot,
    writeBatch: () => ({ set: fake.batchSet, commit: fake.batchCommit }),
    runTransaction: vi.fn(async (_db: unknown, run: (tx: unknown) => Promise<unknown>) =>
      run({ get: async (ref: { path: string }) => snapshotOf(ref.path), set: fake.txSet })
    ),
  };
});

vi.mock('./firebase', () => ({
  get db() {
    return fake.db;
  },
}));

import { generateFriendCode } from '../data/friends';
import type { ContestDoc } from '../data/contests';
import { toLocalDateStr } from '../utils/dates';
import {
  MAX_FRIEND_REQUESTS_PER_DAY,
  acceptFriendRequest,
  createContestDoc,
  deleteFriendship,
  ensureFriendIdentity,
  lookupFriend,
  publishPublicProfile,
  removeLookupEntries,
  removePublicProfile,
  respondToContest,
  sendFriendRequest,
  sendReaction,
  submitContestResult,
  subscribeContests,
  subscribeFriendships,
  subscribePublicProfile,
  type FriendIdentity,
} from './friendsService';

const ME: FriendIdentity = { uid: 'uid-b', email: null, displayName: 'נועה', avatarEmoji: '🐱' };
const OTHER = { uid: 'uid-a', displayName: 'דני', avatarEmoji: '🐶' };
const PIN_EMAIL = 'noam@peachnote.tutor.local';
const FIRST_CODE = generateFriendCode(() => 0);
const NOT_CONFIGURED_HE = 'החיבור לענן לא זמין כרגע.';
const GENERIC_HE = 'משהו השתבש. כדאי לנסות שוב.';

function firestoreError(code: string): Error {
  return Object.assign(new Error(code), { code });
}

beforeEach(() => {
  fake.db = {};
  fake.docs.clear();
  [fake.setDoc, fake.deleteDoc, fake.updateDoc, fake.batchSet, fake.batchCommit, fake.txSet, fake.onSnapshot, fake.where]
    .forEach((fn) => fn.mockClear());
  fake.setDoc.mockResolvedValue(undefined);
  fake.deleteDoc.mockResolvedValue(undefined);
  fake.updateDoc.mockResolvedValue(undefined);
  fake.batchCommit.mockResolvedValue(undefined);
  vi.spyOn(Math, 'random').mockReturnValue(0);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('error handling', () => {
  it('reports the cloud as unavailable when Firestore is not configured', async () => {
    fake.db = null;

    const result = await removePublicProfile('uid-b');

    expect(result).toEqual({ ok: false, errorHe: NOT_CONFIGURED_HE });
  });

  it.each([
    ['permission-denied', 'אין הרשאה לפעולה הזו.'],
    ['unavailable', 'אין חיבור לאינטרנט. כדאי לנסות שוב בעוד רגע.'],
    ['internal', GENERIC_HE],
  ])('maps a %s error to its Hebrew message', async (code, errorHe) => {
    fake.deleteDoc.mockRejectedValueOnce(firestoreError(code));

    expect(await deleteFriendship('uid-a_uid-b')).toEqual({ ok: false, errorHe });
  });
});

describe('ensureFriendIdentity', () => {
  it('keeps the existing code and skips the write when the entry is unchanged', async () => {
    fake.docs.set('friendCodes/KEEP', { uid: ME.uid, displayName: ME.displayName, avatarEmoji: ME.avatarEmoji });

    const result = await ensureFriendIdentity(ME, 'KEEP', false);

    expect(result).toEqual({ ok: true, value: 'KEEP' });
    expect(fake.setDoc).not.toHaveBeenCalled();
  });

  it('refreshes the entry when the name changed', async () => {
    fake.docs.set('friendCodes/KEEP', { uid: ME.uid, displayName: 'old', avatarEmoji: ME.avatarEmoji });

    await ensureFriendIdentity(ME, 'KEEP', false);

    expect(fake.setDoc).toHaveBeenCalledWith(
      { path: 'friendCodes/KEEP' },
      { uid: ME.uid, displayName: ME.displayName, avatarEmoji: ME.avatarEmoji }
    );
  });

  it('recovers the code recorded for this learner on another device', async () => {
    fake.docs.set(`friendCodeOwners/${ME.uid}`, { code: 'OTHERDEV' });

    const result = await ensureFriendIdentity(ME, undefined, false);

    expect(result).toEqual({ ok: true, value: 'OTHERDEV' });
    expect(fake.txSet).not.toHaveBeenCalled();
  });

  it('claims a new code together with its owner record', async () => {
    const result = await ensureFriendIdentity(ME, undefined, false);

    expect(result).toEqual({ ok: true, value: FIRST_CODE });
    expect(fake.txSet).toHaveBeenCalledWith(
      { path: `friendCodes/${FIRST_CODE}` },
      { uid: ME.uid, displayName: ME.displayName, avatarEmoji: ME.avatarEmoji }
    );
    expect(fake.txSet).toHaveBeenCalledWith({ path: `friendCodeOwners/${ME.uid}` }, { code: FIRST_CODE });
  });

  it('gives up after five codes that are all taken', async () => {
    fake.docs.set(`friendCodes/${FIRST_CODE}`, { uid: 'someone-else' });

    const result = await ensureFriendIdentity(ME, undefined, false);

    expect(result).toEqual({ ok: false, errorHe: GENERIC_HE });
    expect(fake.txSet).not.toHaveBeenCalled();
  });

  it('publishes the username of a PIN account only when searchable is on', async () => {
    await ensureFriendIdentity({ ...ME, email: PIN_EMAIL }, 'KEEP', true);

    expect(fake.setDoc).toHaveBeenCalledWith({ path: 'usernames/noam' }, expect.objectContaining({ uid: ME.uid }));
  });

  it('removes a published username when searchable is turned off', async () => {
    fake.docs.set('usernames/noam', { uid: ME.uid });

    await ensureFriendIdentity({ ...ME, email: PIN_EMAIL }, 'KEEP', false);

    expect(fake.deleteDoc).toHaveBeenCalledWith({ path: 'usernames/noam' });
  });

  it('does not touch usernames for an account without one', async () => {
    await ensureFriendIdentity(ME, 'KEEP', true);

    expect(fake.setDoc.mock.calls.every(([ref]) => (ref as { path: string }).path.startsWith('friendCodes/'))).toBe(true);
  });
});

describe('removeLookupEntries', () => {
  it('deletes the code and username documents that exist', async () => {
    fake.docs.set('friendCodes/KEEP', {});
    fake.docs.set('usernames/noam', {});

    const result = await removeLookupEntries({ uid: ME.uid, email: PIN_EMAIL }, 'KEEP');

    expect(result.ok).toBe(true);
    expect(fake.deleteDoc).toHaveBeenCalledTimes(2);
  });

  it('does not delete documents that are not there', async () => {
    await removeLookupEntries({ uid: ME.uid, email: PIN_EMAIL }, 'KEEP');

    expect(fake.deleteDoc).not.toHaveBeenCalled();
  });

  it('skips the code when the learner has none', async () => {
    await removeLookupEntries({ uid: ME.uid, email: null }, undefined);

    expect(fake.deleteDoc).not.toHaveBeenCalled();
  });
});

describe('public profile', () => {
  it('publishes the profile with a fresh updatedAt', async () => {
    const profile = { displayName: 'נועה' } as never;

    const result = await publishPublicProfile('uid-b', profile);

    expect(result.ok).toBe(true);
    expect(fake.setDoc).toHaveBeenCalledWith(
      { path: 'publicProfiles/uid-b' },
      expect.objectContaining({ displayName: 'נועה', updatedAt: expect.any(String) })
    );
  });

  it('hides the profile by deleting it', async () => {
    await removePublicProfile('uid-b');

    expect(fake.deleteDoc).toHaveBeenCalledWith({ path: 'publicProfiles/uid-b' });
  });
});

describe('lookupFriend', () => {
  it('finds a learner by friend code', async () => {
    fake.docs.set('friendCodes/ABCD2345', OTHER);

    const result = await lookupFriend('abcd-2345');

    expect(result).toEqual({ ok: true, value: [{ entry: OTHER, via: 'code' }] });
  });

  it('finds a learner by username with a leading @', async () => {
    fake.docs.set('usernames/dani', OTHER);

    const result = await lookupFriend('@Dani');

    expect(result).toEqual({ ok: true, value: [{ entry: OTHER, via: 'username' }] });
  });

  it('returns both matches when a username looks like a code and belongs to someone else', async () => {
    const other = { uid: 'uid-z', displayName: 'זהר', avatarEmoji: '🦊' };
    fake.docs.set('friendCodes/ABCD2345', OTHER);
    fake.docs.set('usernames/abcd2345', other);

    const result = await lookupFriend('ABCD2345');

    expect(result).toEqual({
      ok: true,
      value: [{ entry: other, via: 'username' }, { entry: OTHER, via: 'code' }],
    });
  });

  it('returns one match when the username and the code are the same learner', async () => {
    fake.docs.set('friendCodes/ABCD2345', OTHER);
    fake.docs.set('usernames/abcd2345', OTHER);

    const result = await lookupFriend('ABCD2345');

    expect(result).toEqual({ ok: true, value: [{ entry: OTHER, via: 'username' }] });
  });

  it('returns an empty list when nothing matches', async () => {
    expect(await lookupFriend('nobody')).toEqual({ ok: true, value: [] });
  });
});

describe('sendFriendRequest', () => {
  const NOW = new Date(2026, 2, 4, 10, 0, 0);

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  it('writes a pending friendship under the sorted pair id with the counter at 1', async () => {
    const result = await sendFriendRequest(ME, OTHER);

    expect(result.ok).toBe(true);
    expect(fake.batchSet).toHaveBeenCalledWith(
      { path: 'friendships/uid-a_uid-b' },
      expect.objectContaining({
        uids: ['uid-b', 'uid-a'],
        requesterUid: 'uid-b',
        requesterName: 'נועה',
        addresseeName: 'דני',
        status: 'pending',
      })
    );
    expect(fake.batchSet).toHaveBeenCalledWith(
      { path: 'friendRequestCounts/uid-b' },
      { dateStr: toLocalDateStr(NOW), count: 1 }
    );
  });

  it('increments the counter within the same day', async () => {
    fake.docs.set('friendRequestCounts/uid-b', { dateStr: toLocalDateStr(NOW), count: 4 });

    await sendFriendRequest(ME, OTHER);

    expect(fake.batchSet).toHaveBeenCalledWith(expect.anything(), { dateStr: toLocalDateStr(NOW), count: 5 });
  });

  it('restarts the counter on a new day', async () => {
    fake.docs.set('friendRequestCounts/uid-b', { dateStr: '2020-01-01', count: MAX_FRIEND_REQUESTS_PER_DAY });

    const result = await sendFriendRequest(ME, OTHER);

    expect(result.ok).toBe(true);
    expect(fake.batchSet).toHaveBeenCalledWith(expect.anything(), { dateStr: toLocalDateStr(NOW), count: 1 });
  });

  it('refuses the request after the daily limit without writing', async () => {
    fake.docs.set('friendRequestCounts/uid-b', { dateStr: toLocalDateStr(NOW), count: MAX_FRIEND_REQUESTS_PER_DAY });

    const result = await sendFriendRequest(ME, OTHER);

    expect(result).toEqual({ ok: false, errorHe: 'שלחת היום הרבה בקשות חברות. אפשר לשלוח עוד מחר 🙂' });
    expect(fake.batchCommit).not.toHaveBeenCalled();
  });

  it('explains a request the rules refused (the other learner has the hub off)', async () => {
    fake.batchCommit.mockRejectedValueOnce(firestoreError('permission-denied'));

    const result = await sendFriendRequest(ME, OTHER);

    expect(result).toEqual({
      ok: false,
      errorHe: 'אי אפשר לשלוח בקשה לחבר הזה כרגע. כדאי לבדוק את הקוד ולנסות שוב.',
    });
  });

  it('passes other commit errors through the usual mapping', async () => {
    fake.batchCommit.mockRejectedValueOnce(firestoreError('unavailable'));

    const result = await sendFriendRequest(ME, OTHER);

    expect(result).toEqual({ ok: false, errorHe: 'אין חיבור לאינטרנט. כדאי לנסות שוב בעוד רגע.' });
  });
});

describe('friendship updates', () => {
  it('accepts a request with the accepted status and a timestamp', async () => {
    await acceptFriendRequest('uid-a_uid-b');

    expect(fake.updateDoc).toHaveBeenCalledWith(
      { path: 'friendships/uid-a_uid-b' },
      { status: 'accepted', acceptedAt: expect.any(String) }
    );
  });

  it('removes a friendship', async () => {
    const result = await deleteFriendship('uid-a_uid-b');

    expect(result.ok).toBe(true);
    expect(fake.deleteDoc).toHaveBeenCalledWith({ path: 'friendships/uid-a_uid-b' });
  });

  it('stores a reaction under the sender uid', async () => {
    await sendReaction('uid-a_uid-b', 'uid-b', '🎉');

    expect(fake.updateDoc).toHaveBeenCalledWith(
      { path: 'friendships/uid-a_uid-b' },
      { 'reactions.uid-b': { emoji: '🎉', at: expect.any(String) } }
    );
  });
});

describe('contests', () => {
  it('creates a contest without the local-only fields', async () => {
    const contest = { id: 'c1', hasPendingWrites: true, dateStr: '2026-03-04', uids: ['a', 'b'] } as unknown as ContestDoc;

    await createContestDoc(contest);

    expect(fake.setDoc).toHaveBeenCalledWith({ path: 'contests/c1' }, { dateStr: '2026-03-04', uids: ['a', 'b'] });
  });

  it.each([
    [true, 'accepted'],
    [false, 'declined'],
  ])('responds with accepted=%s as status %s', async (isAccepted, status) => {
    await respondToContest('c1', isAccepted);

    expect(fake.updateDoc).toHaveBeenCalledWith({ path: 'contests/c1' }, { status });
  });

  describe('submitContestResult', () => {
    const RESULT = { score: 7 } as never;

    beforeEach(() => {
      vi.useFakeTimers();
      vi.stubGlobal('window', { setTimeout: (fn: () => void, ms: number) => globalThis.setTimeout(fn, ms) });
    });

    it('saves the result under the learner uid', async () => {
      const result = await submitContestResult('c1', 'uid-b', RESULT);

      expect(result.ok).toBe(true);
      expect(fake.updateDoc).toHaveBeenCalledWith({ path: 'contests/c1' }, { 'results.uid-b': RESULT });
    });

    it('reports the offline message when the save is not confirmed in 10 seconds', async () => {
      fake.updateDoc.mockReturnValueOnce(new Promise(() => undefined));

      const pending = submitContestResult('c1', 'uid-b', RESULT);
      await vi.advanceTimersByTimeAsync(10_000);

      expect(await pending).toEqual({
        ok: false,
        errorHe: 'אין חיבור לאינטרנט כרגע. התוצאה תישלח כשהחיבור יחזור, אם זה יקרה לפני חצות.',
      });
    });
  });
});

describe('subscriptions', () => {
  it('subscribeFriendships maps documents with their ids and returns the unsubscribe', () => {
    const unsubscribe = vi.fn();
    fake.onSnapshot.mockImplementation((_query, onNext) => {
      onNext({ docs: [{ id: 'f1', data: () => ({ status: 'pending' }) }] });
      return unsubscribe;
    });
    const onChange = vi.fn();

    const stop = subscribeFriendships('uid-b', onChange, vi.fn());

    expect(fake.where).toHaveBeenCalledWith('uids', 'array-contains', 'uid-b');
    expect(onChange).toHaveBeenCalledWith([{ id: 'f1', status: 'pending' }]);
    expect(stop).toBe(unsubscribe);
  });

  it('subscribeFriendships reports a snapshot error in Hebrew', () => {
    fake.onSnapshot.mockImplementation((_query, _onNext, onError) => {
      onError(firestoreError('permission-denied'));
      return vi.fn();
    });
    const onError = vi.fn();

    subscribeFriendships('uid-b', vi.fn(), onError);

    expect(onError).toHaveBeenCalledWith('אין הרשאה לפעולה הזו.');
  });

  it('subscribeFriendships reports not-configured and returns a no-op without a database', () => {
    fake.db = null;
    const onError = vi.fn();

    const stop = subscribeFriendships('uid-b', vi.fn(), onError);

    expect(onError).toHaveBeenCalledWith(NOT_CONFIGURED_HE);
    expect(stop()).toBeUndefined();
    expect(fake.onSnapshot).not.toHaveBeenCalled();
  });

  it('subscribePublicProfile delivers the profile, or null when it is gone or unreadable', () => {
    const onChange = vi.fn();
    fake.onSnapshot.mockImplementation((_ref, onNext, onError) => {
      onNext({ exists: () => true, data: () => ({ displayName: 'דני' }) });
      onNext({ exists: () => false });
      onError(firestoreError('permission-denied'));
      return vi.fn();
    });

    subscribePublicProfile('uid-a', onChange);

    expect(onChange.mock.calls).toEqual([[{ displayName: 'דני' }], [null], [null]]);
  });

  it('subscribePublicProfile and subscribeContests are no-ops without a database', () => {
    fake.db = null;

    subscribePublicProfile('uid-a', vi.fn())();
    subscribeContests('uid-b', '2026-03-01', vi.fn(), vi.fn())();

    expect(fake.onSnapshot).not.toHaveBeenCalled();
  });

  it('subscribeContests filters by learner and date and flags unconfirmed local writes', () => {
    fake.onSnapshot.mockImplementation((_query, _options, onNext) => {
      onNext({ docs: [{ id: 'c1', data: () => ({ dateStr: '2026-03-04' }), metadata: { hasPendingWrites: true } }] });
      return vi.fn();
    });
    const onChange = vi.fn();

    subscribeContests('uid-b', '2026-03-01', onChange, vi.fn());

    expect(fake.where).toHaveBeenCalledWith('uids', 'array-contains', 'uid-b');
    expect(fake.where).toHaveBeenCalledWith('dateStr', '>=', '2026-03-01');
    expect(onChange).toHaveBeenCalledWith([{ id: 'c1', dateStr: '2026-03-04', hasPendingWrites: true }]);
  });

  it('subscribeContests reports a snapshot error in Hebrew', () => {
    fake.onSnapshot.mockImplementation((_query, _options, _onNext, onError) => {
      onError(firestoreError('unavailable'));
      return vi.fn();
    });
    const onError = vi.fn();

    subscribeContests('uid-b', '2026-03-01', vi.fn(), onError);

    expect(onError).toHaveBeenCalledWith('אין חיבור לאינטרנט. כדאי לנסות שוב בעוד רגע.');
  });
});
