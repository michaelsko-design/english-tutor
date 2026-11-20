import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TEST_THEME } from '../../test/fixtures';
import { ParentInfoSheet } from './ParentInfoSheet';
import type { ProAskLearner } from './proUpsellContext';

const parentService = vi.hoisted(() => ({
  listParentsOfChild: vi.fn(),
  createParentInvite: vi.fn(),
}));
vi.mock('../../services/parentService', () => parentService);
const analytics = vi.hoisted(() => ({ trackEvent: vi.fn() }));
vi.mock('../../services/analytics', () => analytics);

const LEARNER: ProAskLearner = { uid: 'kid1', name: 'נועה', gender: 'girl', avatarEmoji: '🐱', isGuest: false };

function renderSheet(learner: ProAskLearner = LEARNER, readsHebrewAloud = false) {
  const onClose = vi.fn();
  render(<ParentInfoSheet learner={learner} focus="themes" theme={TEST_THEME} readsHebrewAloud={readsHebrewAloud} onClose={onClose} />);
  return { onClose };
}

/** The share step: the WhatsApp link (no native share sheet in jsdom) carries the message */
const sharedMessage = async () =>
  decodeURIComponent((await screen.findByRole('link', { name: /וואטסאפ/ })).getAttribute('href')?.split('text=')[1] ?? '');

describe('ParentInfoSheet', () => {
  beforeEach(() => {
    parentService.listParentsOfChild.mockReset();
    parentService.createParentInvite.mockReset();
    analytics.trackEvent.mockReset();
  });

  it('is a neutral note for parents: no perks, prices or ask to buy', () => {
    renderSheet();

    const dialog = screen.getByRole('dialog');
    expect(screen.getByRole('heading', { name: 'תוכן במסלול המלא — מידע להורים' })).toBeInTheDocument();
    expect(dialog).toHaveTextContent('החלק הזה כלול במסלול Pro');
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(dialog.textContent).not.toMatch(/₪|לבקש|לשדרג|לקנות/);
    expect(analytics.trackEvent).toHaveBeenCalledWith('pro_wall_view');
  });

  it('reads its line aloud only for grades 1–2', () => {
    renderSheet();
    expect(screen.queryByRole('button', { name: 'הקשבה' })).toBeNull();
  });

  it('has a Hebrew 🔊 for grades 1–2', () => {
    renderSheet(LEARNER, true);
    expect(screen.getByRole('button', { name: 'הקשבה' })).toBeInTheDocument();
  });

  it('shares the parent area with a paired parent, as information', async () => {
    parentService.listParentsOfChild.mockResolvedValue([{ parentUid: 'p1', childUid: 'kid1' }]);
    const user = userEvent.setup();
    renderSheet();

    await user.click(screen.getByRole('button', { name: 'שיתוף קישור לאזור ההורים' }));

    const message = await sharedMessage();
    expect(message).toContain('קישור לאזור ההורים');
    expect(message).toContain('/?parent&pro=1');
    expect(message).not.toMatch(/לשדרג|נועה/);
    expect(parentService.createParentInvite).not.toHaveBeenCalled();
    expect(analytics.trackEvent).toHaveBeenCalledWith('pro_ask_sent');
  });

  it('makes a pairing code when no parent is paired', async () => {
    parentService.listParentsOfChild.mockResolvedValue([]);
    parentService.createParentInvite.mockResolvedValue({ ok: true, value: { code: 'ABCD2345' } });
    const user = userEvent.setup();
    renderSheet();

    await user.click(screen.getByRole('button', { name: 'שיתוף קישור לאזור ההורים' }));

    expect(await sharedMessage()).toContain('/?parent=ABCD2345&pro=1');
  });

  it('says so and makes no code when it cannot tell whether a parent is paired', async () => {
    parentService.listParentsOfChild.mockRejectedValue(new Error('offline'));
    const user = userEvent.setup();
    renderSheet();

    await user.click(screen.getByRole('button', { name: 'שיתוף קישור לאזור ההורים' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('לא הצלחנו להתחבר');
    expect(parentService.createParentInvite).not.toHaveBeenCalled();
  });

  it('asks a guest to save the account first, with no share button', () => {
    renderSheet({ ...LEARNER, isGuest: true });
    expect(screen.getByText(/קודם שמרי את החשבון/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'שיתוף קישור לאזור ההורים' })).toBeNull();
  });

  it('closes from the X', async () => {
    const user = userEvent.setup();
    const { onClose } = renderSheet();
    await user.click(screen.getByRole('button', { name: 'סגירה' }));
    expect(onClose).toHaveBeenCalled();
  });
});
