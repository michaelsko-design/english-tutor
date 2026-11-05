import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_PROFILE } from '../data/defaultProfile';
import { PARENTS_CHANGED_EVENT } from '../data/parentLink';
import type { AuthUserSummary, LearnerProfile } from '../types/learner';
import { useReportSnapshotPublisher } from './useReportSnapshotPublisher';

const { listParentsOfChild, publishReportSnapshot } = vi.hoisted(() => ({
  listParentsOfChild: vi.fn(),
  publishReportSnapshot: vi.fn(),
}));
vi.mock('../services/parentService', () => ({ listParentsOfChild, publishReportSnapshot }));

const PUBLISH_DELAY_MS = 15_000;
const RECHECK_MS = 10 * 60 * 1000;
const USER: AuthUserSummary = { uid: 'child-1', displayName: null, email: null, isAnonymous: false };
const PROFILE: LearnerProfile = { ...DEFAULT_PROFILE, isOnboarded: true, name: 'נועה' };
const LINK = { parentUid: 'p1', childUid: 'child-1' };

interface Props {
  authUser: AuthUserSummary | null;
  profile: LearnerProfile;
  isSynced: boolean;
}
/** Lets promises settle and timers run. */
const advance = (ms: number) => act(async () => { await vi.advanceTimersByTimeAsync(ms); });

/** Renders, then lets the parent check finish, so the publish delay counts from the start. */
async function render(props: Partial<Props> = {}) {
  const view = renderHook((p: Props) => useReportSnapshotPublisher(p), {
    initialProps: { authUser: USER, profile: PROFILE, isSynced: true, ...props },
  });
  await advance(0);
  return view;
}

beforeEach(() => {
  vi.useFakeTimers();
  listParentsOfChild.mockResolvedValue([LINK]);
  publishReportSnapshot.mockResolvedValue(undefined);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('useReportSnapshotPublisher', () => {
  it('publishes the snapshot once a parent is paired, after the delay', async () => {
    await render();

    await advance(PUBLISH_DELAY_MS - 1);
    expect(publishReportSnapshot).not.toHaveBeenCalled();
    await advance(1);

    expect(publishReportSnapshot).toHaveBeenCalledExactlyOnceWith('child-1', expect.objectContaining({ name: 'נועה' }));
  });

  it('writes nothing for a learner with no parent', async () => {
    listParentsOfChild.mockResolvedValue([]);
    await render();

    await advance(PUBLISH_DELAY_MS * 2);

    expect(listParentsOfChild).toHaveBeenCalledWith('child-1');
    expect(publishReportSnapshot).not.toHaveBeenCalled();
  });

  it.each([
    ['signed out', { authUser: null }],
    ['a guest', { authUser: { ...USER, isAnonymous: true } }],
    ['the cloud profile has not loaded', { isSynced: false }],
    ['the learner is not onboarded', { profile: { ...PROFILE, isOnboarded: false } }],
  ])('does not even look for parents when %s', async (_label, props) => {
    await render(props);

    await advance(PUBLISH_DELAY_MS * 2);

    expect(listParentsOfChild).not.toHaveBeenCalled();
    expect(publishReportSnapshot).not.toHaveBeenCalled();
  });

  it('publishes after a parent claims a code (the parents-changed event)', async () => {
    listParentsOfChild.mockResolvedValueOnce([]);
    await render();
    await advance(PUBLISH_DELAY_MS);
    expect(publishReportSnapshot).not.toHaveBeenCalled();

    listParentsOfChild.mockResolvedValueOnce([LINK]);
    await act(async () => { window.dispatchEvent(new Event(PARENTS_CHANGED_EVENT)); });
    await advance(PUBLISH_DELAY_MS);

    expect(publishReportSnapshot).toHaveBeenCalledTimes(1);
  });

  it('does not republish unchanged content, but publishes a change', async () => {
    const { rerender } = await render();
    await advance(PUBLISH_DELAY_MS);
    expect(publishReportSnapshot).toHaveBeenCalledTimes(1);

    rerender({ authUser: USER, isSynced: true, profile: { ...PROFILE } });
    await advance(PUBLISH_DELAY_MS);
    expect(publishReportSnapshot).toHaveBeenCalledTimes(1);

    rerender({ authUser: USER, isSynced: true, profile: { ...PROFILE, name: 'דנה' } });
    await advance(PUBLISH_DELAY_MS);
    expect(publishReportSnapshot).toHaveBeenCalledTimes(2);
    expect(publishReportSnapshot).toHaveBeenLastCalledWith('child-1', expect.objectContaining({ name: 'דנה' }));
  });

  it('retries a failed publish on the next change and warns', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    publishReportSnapshot.mockRejectedValueOnce(new Error('offline'));
    const { rerender } = await render();

    await advance(PUBLISH_DELAY_MS);
    expect(warn).toHaveBeenCalledWith('Publishing the parent report failed:', expect.any(Error));

    rerender({ authUser: USER, isSynced: true, profile: { ...PROFILE } });
    await advance(PUBLISH_DELAY_MS);
    expect(publishReportSnapshot).toHaveBeenCalledTimes(2);
  });

  it('warns and carries on when the parent check fails', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    listParentsOfChild.mockRejectedValueOnce(new Error('offline'));
    await render();

    await advance(PUBLISH_DELAY_MS);

    expect(warn).toHaveBeenCalledWith('Checking paired parents failed:', expect.any(Error));
    expect(publishReportSnapshot).not.toHaveBeenCalled();
  });

  it('checks for parents again when the tab comes back after ten minutes, not sooner', async () => {
    await render();
    await advance(1000);
    expect(listParentsOfChild).toHaveBeenCalledTimes(1);

    await act(async () => { document.dispatchEvent(new Event('visibilitychange')); });
    expect(listParentsOfChild).toHaveBeenCalledTimes(1);

    await advance(RECHECK_MS);
    await act(async () => { document.dispatchEvent(new Event('visibilitychange')); });
    expect(listParentsOfChild).toHaveBeenCalledTimes(2);
  });

  it('forgets what it knew when another account signs in', async () => {
    const { rerender } = await render();
    await advance(PUBLISH_DELAY_MS);
    listParentsOfChild.mockResolvedValue([]);

    rerender({ authUser: { ...USER, uid: 'child-2' }, isSynced: true, profile: PROFILE });
    await advance(PUBLISH_DELAY_MS * 2);

    expect(listParentsOfChild).toHaveBeenLastCalledWith('child-2');
    expect(publishReportSnapshot).toHaveBeenCalledTimes(1);
  });

  it('cancels a pending publish on unmount', async () => {
    const { unmount } = await render();
    await advance(1000);

    unmount();
    await advance(PUBLISH_DELAY_MS * 2);

    expect(publishReportSnapshot).not.toHaveBeenCalled();
  });
});
