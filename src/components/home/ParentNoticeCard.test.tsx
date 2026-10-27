import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ParentLink } from '../../data/parentLink';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { ParentNoticeCard } from './ParentNoticeCard';
import { findParentNotices, readSeenParents } from './parentNotices';

const firebase = vi.hoisted(() => ({ auth: { currentUser: { uid: 'child-1', isAnonymous: false } as { uid: string; isAnonymous: boolean } } }));
vi.mock('../../services/firebase', () => ({
  auth: firebase.auth,
  isFirebaseConfigured: true,
  getAppCheckToken: async () => null,
}));

const parentService = vi.hoisted(() => ({ listParentsOfChild: vi.fn(), unlinkParent: vi.fn() }));
vi.mock('../../services/parentService', () => parentService);

const LINK: ParentLink = {
  parentUid: 'parent-1', childUid: 'child-1', childName: 'נועה', childAvatar: '🐱', inviteCode: 'ABCD2345',
  linkedAt: '2026-03-04T10:00:00.000Z', parentLabel: 'p***@gmail.com',
};
const RESET_LINK: ParentLink = { ...LINK, pinResetAt: '2026-03-06T08:00:00.000Z' };

beforeEach(() => {
  window.localStorage.clear();
  firebase.auth.currentUser = { uid: 'child-1', isAnonymous: false };
  Object.values(parentService).forEach((fn) => fn.mockReset());
  parentService.listParentsOfChild.mockResolvedValue([]);
});

function renderCard(isOnboarded = true) {
  render(<ParentNoticeCard profile={makeProfile({ isOnboarded })} theme={TEST_THEME} />);
}

describe('findParentNotices', () => {
  it('announces a new parent once, and a new reset again', () => {
    expect(findParentNotices([LINK], { linked: [], resets: {} })).toEqual([{ kind: 'linked', link: LINK }]);
    expect(findParentNotices([LINK], { linked: ['parent-1'], resets: {} })).toEqual([]);
    expect(findParentNotices([RESET_LINK], { linked: ['parent-1'], resets: {} })).toEqual([{ kind: 'pin-reset', link: RESET_LINK }]);
    expect(findParentNotices([RESET_LINK], { linked: ['parent-1'], resets: { 'parent-1': RESET_LINK.pinResetAt! } })).toEqual([]);
  });
});

describe('ParentNoticeCard', () => {
  it('says who joined and stays quiet once it is understood', async () => {
    const user = userEvent.setup();
    parentService.listParentsOfChild.mockResolvedValue([LINK]);
    renderCard();

    expect(await screen.findByRole('status')).toHaveTextContent('p***@gmail.com');
    await user.click(screen.getByRole('button', { name: 'הבנתי' }));

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(readSeenParents('child-1').linked).toEqual(['parent-1']);
  });

  it('says that a parent reset the PIN, with the date', async () => {
    parentService.listParentsOfChild.mockResolvedValue([RESET_LINK]);
    renderCard();

    expect(await screen.findByRole('status')).toHaveTextContent('החליף את הקוד הסודי');
  });

  it('unlinks the parent from the notice', async () => {
    const user = userEvent.setup();
    parentService.listParentsOfChild.mockResolvedValue([RESET_LINK]);
    parentService.unlinkParent.mockResolvedValue({ ok: true, value: undefined });
    renderCard();

    await user.click(await screen.findByRole('button', { name: 'ניתוק ההורה' }));

    expect(parentService.unlinkParent).toHaveBeenCalledWith(RESET_LINK);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows nothing for a guest, before onboarding, or when the check fails', async () => {
    firebase.auth.currentUser = { uid: 'guest-1', isAnonymous: true };
    renderCard();
    firebase.auth.currentUser = { uid: 'child-1', isAnonymous: false };
    renderCard(false);
    expect(parentService.listParentsOfChild).not.toHaveBeenCalled();

    parentService.listParentsOfChild.mockRejectedValue(new Error('offline'));
    renderCard();
    await vi.waitFor(() => expect(parentService.listParentsOfChild).toHaveBeenCalled());
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
