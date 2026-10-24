import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { ParentNudgeCard } from './ParentNudgeCard';
import { isParentNudgeDismissed } from './parentNudge';

const firebase = vi.hoisted(() => ({ auth: { currentUser: { uid: 'child-1', isAnonymous: false } as { uid: string; isAnonymous: boolean } } }));
vi.mock('../../services/firebase', () => ({
  auth: firebase.auth,
  isFirebaseConfigured: true,
  getAppCheckToken: async () => null,
}));

const parentService = vi.hoisted(() => ({
  listParentsOfChild: vi.fn(),
  getActiveParentInvite: vi.fn(),
  createParentInvite: vi.fn(),
  withdrawParentInvite: vi.fn(),
  unlinkParent: vi.fn(),
}));
vi.mock('../../services/parentService', () => parentService);

beforeEach(() => {
  window.localStorage.clear();
  firebase.auth.currentUser = { uid: 'child-1', isAnonymous: false };
  Object.values(parentService).forEach((fn) => fn.mockReset());
  parentService.listParentsOfChild.mockResolvedValue([]);
  parentService.getActiveParentInvite.mockResolvedValue(null);
});

function renderCard(isOnboarded = true) {
  render(<ParentNudgeCard profile={makeProfile({ isOnboarded })} theme={TEST_THEME} />);
}

describe('ParentNudgeCard', () => {
  it('invites a parent, says it is optional, and opens the invite', async () => {
    const user = userEvent.setup();
    renderCard();

    expect(await screen.findByText(/לא חובה/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'להזמין הורה' }));

    expect(await screen.findByRole('dialog', { name: 'הזמנת הורה' })).toBeInTheDocument();
  });

  it('stays away after it is closed on this device', async () => {
    const user = userEvent.setup();
    renderCard();

    await user.click(await screen.findByRole('button', { name: 'סגירה' }));

    expect(screen.queryByRole('region', { name: 'הזמנת הורה' })).not.toBeInTheDocument();
    expect(isParentNudgeDismissed('child-1')).toBe(true);
  });

  it('does not show when a parent is already paired', async () => {
    parentService.listParentsOfChild.mockResolvedValue([{ parentUid: 'p', childUid: 'child-1' }]);
    renderCard();

    await vi.waitFor(() => expect(parentService.listParentsOfChild).toHaveBeenCalled());
    expect(screen.queryByText(/לא חובה/)).not.toBeInTheDocument();
  });

  it('does not show for a guest, before onboarding, or after it was closed', async () => {
    firebase.auth.currentUser = { uid: 'guest-1', isAnonymous: true };
    renderCard();
    expect(parentService.listParentsOfChild).not.toHaveBeenCalled();

    firebase.auth.currentUser = { uid: 'child-1', isAnonymous: false };
    renderCard(false);
    expect(parentService.listParentsOfChild).not.toHaveBeenCalled();

    window.localStorage.setItem('english_tutor_parent_nudge_dismissed_child-1', '1');
    renderCard();
    expect(parentService.listParentsOfChild).not.toHaveBeenCalled();
  });

  it('does not show when the check fails, such as offline', async () => {
    parentService.listParentsOfChild.mockRejectedValue(new Error('offline'));
    renderCard();

    await vi.waitFor(() => expect(parentService.listParentsOfChild).toHaveBeenCalled());
    expect(screen.queryByText(/לא חובה/)).not.toBeInTheDocument();
  });
});
