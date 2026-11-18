import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TEST_THEME } from '../../test/fixtures';
import { ProUpsellSheet } from './ProUpsellSheet';
import type { ProAskLearner } from './proUpsellContext';
import { readLastAsk, rememberAsk } from '../../data/proAsk';

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

  it('remembers the focus of an ask, and counts a resend against the same ask', async () => {
    parentService.listParentsOfChild.mockResolvedValue([]);
    parentService.createParentInvite.mockResolvedValue({ ok: true, value: { code: 'ABCD2345', invite: {} } });
    rememberAsk('kid1', '2026-11-01', { focus: 'themes', nowMs: Date.UTC(2026, 10, 1) });
    const user = userEvent.setup();
    render(<ProUpsellSheet learner={LEARNER} focus="themes" theme={TEST_THEME} isResend onClose={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /לבקש מהורה/ }));

    await screen.findByRole('link', { name: /וואטסאפ/ });
    expect(readLastAsk('kid1')).toMatchObject({ focus: 'themes', resends: 1 });
  });

  it('leads with a coming exam, in the sheet and in the message', async () => {
    parentService.listParentsOfChild.mockResolvedValue([{ parentUid: 'p1', childUid: 'kid1' }]);
    const future = new Date(Date.now() + 5 * 86_400_000);
    const examDateStr = `${future.getFullYear()}-${String(future.getMonth() + 1).padStart(2, '0')}-${String(future.getDate()).padStart(2, '0')}`;
    const user = userEvent.setup();
    render(
      <ProUpsellSheet learner={{ ...LEARNER, exam: { examDateStr, listCount: 0 } }} focus="missions" theme={TEST_THEME} onClose={vi.fn()} />
    );

    expect(screen.getAllByRole('listitem')[0].textContent).toMatch(/המבחן ב-.*עוד 5 ימים/);
    await user.click(screen.getByRole('button', { name: /לבקש מהורה/ }));
    expect(await sharedMessage()).toContain('יש לי מבחן באנגלית');
  });
});
