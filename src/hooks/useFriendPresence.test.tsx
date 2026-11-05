import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_PROFILE } from '../data/defaultProfile';
import type { AuthUserSummary, LearnerProfile } from '../types/learner';
import { useFriendPresence } from './useFriendPresence';

const service = vi.hoisted(() => ({
  ensureFriendIdentity: vi.fn(),
  publishPublicProfile: vi.fn(),
  removeLookupEntries: vi.fn(),
  removePublicProfile: vi.fn(),
}));
vi.mock('../services/friendsService', () => service);

const CLAIM_RETRY_MS = 30_000;
const USER: AuthUserSummary = { uid: 'u1', displayName: null, email: 'noam@peachnote.tutor.local', isAnonymous: false };
const TEEN: LearnerProfile = { ...DEFAULT_PROFILE, isOnboarded: true, name: 'נועם', age: 14 };
const WITH_CODE: LearnerProfile = {
  ...TEEN,
  friendsHub: { isEnabled: true, updatedAt: '2026-03-01T00:00:00.000Z', friendCode: 'KEEP2345' },
};

interface Props {
  authUser: AuthUserSummary | null;
  profile: LearnerProfile;
  isSynced: boolean;
}
const onUpdateProfile = vi.fn();
let latest: LearnerProfile;

function render(props: Partial<Props> = {}) {
  const initial: Props = { authUser: USER, profile: TEEN, isSynced: true, ...props };
  latest = initial.profile;
  return renderHook(
    (p: Props) => useFriendPresence({ ...p, avatarEmoji: '🐱', getLatestProfile: () => latest, onUpdateProfile }),
    { initialProps: initial }
  );
}
const flush = () => act(async () => { await vi.advanceTimersByTimeAsync(0); });

beforeEach(() => {
  vi.useFakeTimers();
  service.ensureFriendIdentity.mockResolvedValue({ ok: true, value: 'NEWCODE2' });
  service.publishPublicProfile.mockResolvedValue({ ok: true, value: undefined });
  service.removeLookupEntries.mockResolvedValue({ ok: true, value: undefined });
  service.removePublicProfile.mockResolvedValue({ ok: true, value: undefined });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useFriendPresence while the hub is on', () => {
  it('claims a friend code, saves it on the profile, and publishes the summary', async () => {
    render();
    await flush();

    expect(service.ensureFriendIdentity).toHaveBeenCalledWith(
      { uid: 'u1', email: USER.email, displayName: 'נועם', avatarEmoji: '🐱' },
      undefined,
      false
    );
    expect(onUpdateProfile).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ friendsHub: expect.objectContaining({ friendCode: 'NEWCODE2' }) })
    );
    expect(service.publishPublicProfile).toHaveBeenCalledExactlyOnceWith(
      'u1',
      expect.objectContaining({ displayName: 'נועם', avatarEmoji: '🐱' })
    );
  });

  it('reuses the code already on the profile and does not rewrite the profile', async () => {
    render({ profile: WITH_CODE });
    await flush();

    expect(service.ensureFriendIdentity).toHaveBeenCalledWith(expect.anything(), 'KEEP2345', false);
    expect(onUpdateProfile).not.toHaveBeenCalled();
  });

  it('does not undo a code that arrived while the claim was running', async () => {
    render();
    latest = WITH_CODE;
    await flush();

    expect(onUpdateProfile).not.toHaveBeenCalled();
  });

  it('passes on whether the username may be searched', async () => {
    render({ profile: { ...WITH_CODE, friendsHub: { ...WITH_CODE.friendsHub!, isUsernameSearchable: true } } });
    await flush();

    expect(service.ensureFriendIdentity).toHaveBeenCalledWith(expect.anything(), 'KEEP2345', true);
  });

  it('tries again after 30 seconds when the claim fails', async () => {
    service.ensureFriendIdentity.mockResolvedValueOnce({ ok: false, errorHe: 'offline' });
    render();
    await flush();
    expect(service.ensureFriendIdentity).toHaveBeenCalledTimes(1);

    await act(async () => { await vi.advanceTimersByTimeAsync(CLAIM_RETRY_MS); });

    expect(service.ensureFriendIdentity).toHaveBeenCalledTimes(2);
    expect(onUpdateProfile).toHaveBeenCalledTimes(1);
  });

  it('tries again as soon as the connection is back', async () => {
    service.ensureFriendIdentity.mockResolvedValueOnce({ ok: false, errorHe: 'offline' });
    render();
    await flush();

    await act(async () => { window.dispatchEvent(new Event('online')); });
    await flush();

    expect(service.ensureFriendIdentity).toHaveBeenCalledTimes(2);
  });

  it('publishes again only when what friends see has changed', async () => {
    const { rerender } = render({ profile: WITH_CODE });
    await flush();
    expect(service.publishPublicProfile).toHaveBeenCalledTimes(1);

    rerender({ authUser: USER, isSynced: true, profile: { ...WITH_CODE, age: 15 } });
    await flush();
    expect(service.publishPublicProfile).toHaveBeenCalledTimes(1);

    rerender({ authUser: USER, isSynced: true, profile: { ...WITH_CODE, stats: { ...WITH_CODE.stats, stars: 7 } } });
    await flush();
    expect(service.publishPublicProfile).toHaveBeenCalledTimes(2);
    expect(service.publishPublicProfile).toHaveBeenLastCalledWith('u1', expect.objectContaining({ stars: 7 }));
  });

  it('retries a failed publish on the next change', async () => {
    service.publishPublicProfile.mockResolvedValueOnce({ ok: false, errorHe: 'offline' });
    const { rerender } = render({ profile: WITH_CODE });
    await flush();

    rerender({ authUser: USER, isSynced: true, profile: { ...WITH_CODE, stats: { ...WITH_CODE.stats, stars: 1 } } });
    await flush();

    expect(service.publishPublicProfile).toHaveBeenCalledTimes(2);
    expect(service.publishPublicProfile).toHaveBeenLastCalledWith('u1', expect.objectContaining({ stars: 1 }));
  });
});

describe('useFriendPresence when it must stay quiet', () => {
  it.each([
    ['signed out', { authUser: null }],
    ['a guest', { authUser: { ...USER, isAnonymous: true } }],
    ['the cloud profile has not loaded', { isSynced: false }],
    ['the learner is not onboarded', { profile: { ...TEEN, isOnboarded: false } }],
  ])('does nothing when %s', async (_label, props) => {
    render(props);
    await flush();

    expect(service.ensureFriendIdentity).not.toHaveBeenCalled();
    expect(service.publishPublicProfile).not.toHaveBeenCalled();
    expect(service.removePublicProfile).not.toHaveBeenCalled();
  });
});

describe('useFriendPresence when the hub is off', () => {
  it('hides the summary and the lookup entries instead of claiming anything', async () => {
    const hubOff: LearnerProfile = {
      ...WITH_CODE,
      friendsHub: { ...WITH_CODE.friendsHub!, isEnabled: false },
    };
    render({ profile: hubOff });
    await flush();

    expect(service.ensureFriendIdentity).not.toHaveBeenCalled();
    expect(service.publishPublicProfile).not.toHaveBeenCalled();
    expect(service.removePublicProfile).toHaveBeenCalledExactlyOnceWith('u1');
    expect(service.removeLookupEntries).toHaveBeenCalledExactlyOnceWith({ uid: 'u1', email: USER.email }, 'KEEP2345');
  });

  it('hides everything when a learner turns the hub off', async () => {
    const { rerender } = render({ profile: WITH_CODE });
    await flush();
    expect(service.removePublicProfile).not.toHaveBeenCalled();

    rerender({
      authUser: USER,
      isSynced: true,
      profile: { ...WITH_CODE, friendsHub: { ...WITH_CODE.friendsHub!, isEnabled: false } },
    });
    await flush();

    expect(service.removePublicProfile).toHaveBeenCalledWith('u1');
  });

  it('keeps a learner under 13 hidden until a parent turns the hub on', async () => {
    render({ profile: { ...TEEN, age: 10 } });
    await flush();

    expect(service.ensureFriendIdentity).not.toHaveBeenCalled();
    expect(service.removePublicProfile).toHaveBeenCalledWith('u1');
  });
});
