import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TEST_THEME } from '../../test/fixtures';
import { ProUpsellSheet } from './ProUpsellSheet';
import type { ProAskLearner } from './proUpsellContext';

const parentService = vi.hoisted(() => ({
  listParentsOfChild: vi.fn(),
  createParentInvite: vi.fn(),
}));
vi.mock('../../services/parentService', () => parentService);

const LEARNER: ProAskLearner = { uid: 'kid1', name: 'נועה', gender: 'girl', avatarEmoji: '🐱', isGuest: false };

function renderSheet(learner: ProAskLearner = LEARNER, readsHebrewAloud = false) {
  const onClose = vi.fn();
  render(<ProUpsellSheet learner={learner} focus="themes" theme={TEST_THEME} readsHebrewAloud={readsHebrewAloud} onClose={onClose} />);
  return { onClose };
}

/** The share step: the WhatsApp link (no native share sheet in jsdom) carries the message */
const sharedMessage = async () =>
  decodeURIComponent((await screen.findByRole('link', { name: /וואטסאפ/ })).getAttribute('href')?.split('text=')[1] ?? '');

describe('ProUpsellSheet', () => {
  beforeEach(() => localStorage.clear());

  it('leads with what brought the learner here, and shows no prices', () => {
    renderSheet();

    const perks = screen.getAllByRole('listitem').map((li) => li.textContent);
    expect(perks[0]).toContain('ערכות העיצוב');
    expect(screen.getByRole('dialog').textContent).not.toMatch(/₪|\d+\s*ש"ח/);
  });

  it('greets the learner by gender, and reads the sheet aloud only for grades 1–2', () => {
    renderSheet();
    expect(screen.getByRole('heading', { name: 'בואי נמשיך להרפתקה הבאה!' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'הקשבה' })).toBeNull();
  });

  it('has a Hebrew 🔊 for grades 1–2', () => {
    renderSheet({ ...LEARNER, gender: 'boy' }, true);
    expect(screen.getByRole('heading', { name: 'בוא נמשיך להרפתקה הבאה!' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'הקשבה' })).toBeInTheDocument();
  });

  it('sends a paired parent straight to the portal', async () => {
    parentService.listParentsOfChild.mockResolvedValue([{ parentUid: 'p1', childUid: 'kid1' }]);
    const user = userEvent.setup();
    renderSheet();

    await user.click(screen.getByRole('button', { name: /לבקש מהורה/ }));

    expect(await sharedMessage()).toContain('/?parent&pro=1');
    expect(parentService.createParentInvite).not.toHaveBeenCalled();
  });

  it('makes a pairing code when no parent is paired', async () => {
    parentService.listParentsOfChild.mockResolvedValue([]);
    parentService.createParentInvite.mockResolvedValue({ ok: true, value: { code: 'ABCD2345', invite: {} } });
    const user = userEvent.setup();
    renderSheet();

    await user.click(screen.getByRole('button', { name: /לבקש מהורה/ }));

    expect(await sharedMessage()).toContain('/?parent=ABCD2345&pro=1');
  });

  it('shows the error when no code can be made', async () => {
    parentService.listParentsOfChild.mockResolvedValue([]);
    parentService.createParentInvite.mockResolvedValue({ ok: false, errorHe: 'אין חיבור' });
    const user = userEvent.setup();
    renderSheet();

    await user.click(screen.getByRole('button', { name: /לבקש מהורה/ }));

    expect(await screen.findByRole('alert')).toHaveTextContent('אין חיבור');
  });

  it('asks a guest to save the account first', () => {
    renderSheet({ ...LEARNER, isGuest: true });

    expect(screen.queryByRole('button', { name: /לבקש מהורה/ })).not.toBeInTheDocument();
    expect(screen.getByText(/שמרי את החשבון/)).toBeInTheDocument();
  });
});
