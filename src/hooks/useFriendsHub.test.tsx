import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FriendshipDoc, PublicProfile } from '../data/friends';
import { useFriendsHub } from './useFriendsHub';

const service = vi.hoisted(() => ({
  subscribeFriendships: vi.fn(),
  subscribeContests: vi.fn(),
  subscribePublicProfile: vi.fn(),
}));
vi.mock('../services/friendsService', () => service);

type DocsHandler = (docs: FriendshipDoc[]) => void;
type ErrorHandler = (errorHe: string) => void;

const unsubscribeFriendships = vi.fn();
const unsubscribeContests = vi.fn();
const profileUnsubscribes = new Map<string, ReturnType<typeof vi.fn>>();
let emitDocs: DocsHandler;
let failFriendships: ErrorHandler;
let emitContests: (contests: unknown[]) => void;
let failContests: ErrorHandler;
const profileHandlers = new Map<string, (profile: PublicProfile | null) => void>();

const friendship = (friendUid: string, overrides: Partial<FriendshipDoc> = {}): FriendshipDoc => ({
  id: `me_${friendUid}`,
  uids: ['me', friendUid],
  requesterUid: 'me',
  requesterName: 'אני',
  requesterAvatar: '🐱',
  addresseeName: `חבר ${friendUid}`,
  addresseeAvatar: '🐶',
  status: 'accepted',
  createdAt: '2026-03-01T00:00:00.000Z',
  acceptedAt: '2026-03-02T00:00:00.000Z',
  ...overrides,
});
const profile = (displayName: string): PublicProfile => ({
  displayName, avatarEmoji: '🐶', level: 2, streakDays: 1, stars: 3, missionsCompleted: 1, updatedAt: '2026-03-04T00:00:00.000Z',
}) as PublicProfile;

beforeEach(() => {
  profileUnsubscribes.clear();
  profileHandlers.clear();
  service.subscribeFriendships.mockImplementation((_uid: string, onChange: DocsHandler, onError: ErrorHandler) => {
    emitDocs = onChange;
    failFriendships = onError;
    return unsubscribeFriendships;
  });
  service.subscribeContests.mockImplementation(
    (_uid: string, _since: string, onChange: (c: unknown[]) => void, onError: ErrorHandler) => {
      emitContests = onChange;
      failContests = onError;
      return unsubscribeContests;
    }
  );
  service.subscribePublicProfile.mockImplementation((uid: string, onChange: (p: PublicProfile | null) => void) => {
    profileHandlers.set(uid, onChange);
    const unsubscribe = vi.fn();
    profileUnsubscribes.set(uid, unsubscribe);
    return unsubscribe;
  });
});

describe('useFriendsHub', () => {
  it('is off and subscribes to nothing without a signed-in learner', () => {
    const { result } = renderHook(() => useFriendsHub(null));

    expect(result.current.status).toBe('off');
    expect(result.current.friendships).toEqual({ accepted: [], incoming: [], outgoing: [] });
    expect(service.subscribeFriendships).not.toHaveBeenCalled();
    expect(service.subscribeContests).not.toHaveBeenCalled();
  });

  it('loads, then shows the friends once the first snapshot arrives', () => {
    const { result } = renderHook(() => useFriendsHub('me'));
    expect(result.current.status).toBe('loading');
    expect(service.subscribeContests).toHaveBeenCalledWith('me', expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/), expect.any(Function), expect.any(Function));

    act(() => emitDocs([friendship('f1'), friendship('f2', { status: 'pending', requesterUid: 'f2' })]));

    expect(result.current.status).toBe('ready');
    expect(result.current.friendships.accepted.map((f) => f.friendUid)).toEqual(['f1']);
    expect(result.current.friendships.incoming).toHaveLength(1);
  });

  it('follows each friend\'s public profile, including a friend who turned the hub off', () => {
    const { result } = renderHook(() => useFriendsHub('me'));
    act(() => emitDocs([friendship('f1'), friendship('f2')]));

    act(() => profileHandlers.get('f1')?.(profile('דני')));
    act(() => profileHandlers.get('f2')?.(null));

    expect(result.current.profiles).toEqual({ f1: profile('דני'), f2: null });
  });

  it('stops following a friend who was removed and keeps the others', () => {
    const { result } = renderHook(() => useFriendsHub('me'));
    act(() => emitDocs([friendship('f1'), friendship('f2')]));
    act(() => profileHandlers.get('f1')?.(profile('דני')));
    act(() => profileHandlers.get('f2')?.(profile('דנה')));

    act(() => emitDocs([friendship('f1')]));

    expect(profileUnsubscribes.get('f2')).toHaveBeenCalled();
    expect(Object.keys(result.current.profiles)).toEqual(['f1']);
  });

  it('shows the contests from the live list', () => {
    const { result } = renderHook(() => useFriendsHub('me'));

    act(() => emitContests([{ id: 'c1' }]));

    expect(result.current.contests).toEqual([{ id: 'c1' }]);
  });

  it('reports a friendships error, and a contests error when that is the only one', () => {
    const { result } = renderHook(() => useFriendsHub('me'));

    act(() => failContests('contests down'));
    expect(result.current.errorHe).toBe('contests down');
    expect(result.current.status).toBe('loading');

    act(() => failFriendships('אין הרשאה'));
    expect(result.current.errorHe).toBe('אין הרשאה');
    expect(result.current.status).toBe('error');

    act(() => emitDocs([]));
    expect(result.current.status).toBe('ready');
    expect(result.current.errorHe).toBe('contests down');
  });

  it('goes off and unsubscribes when the learner signs out', () => {
    const { result, rerender } = renderHook(({ uid }) => useFriendsHub(uid), { initialProps: { uid: 'me' as string | null } });
    act(() => emitDocs([friendship('f1')]));

    rerender({ uid: null });

    expect(result.current.status).toBe('off');
    expect(result.current.friendships.accepted).toEqual([]);
    expect(unsubscribeFriendships).toHaveBeenCalled();
    expect(unsubscribeContests).toHaveBeenCalled();
    expect(profileUnsubscribes.get('f1')).toHaveBeenCalled();
  });

  it('unsubscribes everything on unmount', () => {
    const { unmount } = renderHook(() => useFriendsHub('me'));
    act(() => emitDocs([friendship('f1')]));

    unmount();

    expect(unsubscribeFriendships).toHaveBeenCalled();
    expect(unsubscribeContests).toHaveBeenCalled();
    expect(profileUnsubscribes.get('f1')).toHaveBeenCalled();
  });
});
