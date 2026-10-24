import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ParentInvite, ParentLink } from '../../data/parentLink';
import { makeProfile, TEST_THEME } from '../../test/fixtures';
import { ParentLinkCard } from './ParentLinkCard';

vi.mock('../../services/firebase', () => ({
  auth: { currentUser: { uid: 'child-1', isAnonymous: false } },
  isFirebaseConfigured: true,
  getAppCheckToken: async () => null,
}));

const parentService = vi.hoisted(() => ({
  getActiveParentInvite: vi.fn(),
  listParentsOfChild: vi.fn(),
  createParentInvite: vi.fn(),
  withdrawParentInvite: vi.fn(),
  unlinkParent: vi.fn(),
}));
vi.mock('../../services/parentService', () => parentService);

const INVITE: ParentInvite = { childUid: 'child-1', childName: 'נועה', childAvatar: '🐱', expiresAtMs: Date.UTC(2026, 2, 11) };
const LINK: ParentLink = {
  parentUid: 'parent-1', childUid: 'child-1', childName: 'נועה', childAvatar: '🐱', inviteCode: 'ABCD2345',
  linkedAt: '2026-03-04T10:00:00.000Z',
};

beforeEach(() => {
  Object.values(parentService).forEach((fn) => fn.mockReset());
  parentService.getActiveParentInvite.mockResolvedValue(null);
  parentService.listParentsOfChild.mockResolvedValue([]);
});

function renderCard() {
  render(<ParentLinkCard profile={makeProfile({ name: 'נועה' })} theme={TEST_THEME} />);
}

describe('ParentLinkCard', () => {
  it('says the parent is optional and offers a code', async () => {
    renderCard();

    expect(await screen.findByRole('button', { name: /יצירת קוד להורה/ })).toBeEnabled();
    expect(screen.getByText(/לא חובה/)).toBeInTheDocument();
  });

  it('shows the new code for sharing', async () => {
    const user = userEvent.setup();
    parentService.createParentInvite.mockResolvedValue({ ok: true, value: { code: 'ABCD2345', invite: INVITE } });
    renderCard();

    await user.click(await screen.findByRole('button', { name: /יצירת קוד להורה/ }));

    expect(await screen.findByText('ABCD2345')).toBeInTheDocument();
    expect(parentService.createParentInvite).toHaveBeenCalledWith('child-1', 'נועה', expect.any(String));
    expect(screen.getByRole('button', { name: 'ביטול הקוד' })).toBeInTheDocument();
  });

  it('shows the error when the code cannot be made', async () => {
    const user = userEvent.setup();
    parentService.createParentInvite.mockResolvedValue({ ok: false, errorHe: 'אין חיבור לאינטרנט.' });
    renderCard();

    await user.click(await screen.findByRole('button', { name: /יצירת קוד להורה/ }));

    expect(await screen.findByRole('alert')).toHaveTextContent('אין חיבור לאינטרנט.');
  });

  it('lists a paired parent and unlinks it', async () => {
    const user = userEvent.setup();
    parentService.listParentsOfChild.mockResolvedValueOnce([LINK]).mockResolvedValue([]);
    parentService.unlinkParent.mockResolvedValue({ ok: true, value: undefined });
    renderCard();

    await user.click(await screen.findByRole('button', { name: 'ניתוק' }));

    expect(parentService.unlinkParent).toHaveBeenCalledWith(LINK);
    expect(await screen.findByRole('button', { name: /יצירת קוד להורה/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'ניתוק' })).not.toBeInTheDocument();
  });
});
