import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CONTENT_PACKS } from '../../data/curriculum/packs/registry';
import type { NewPackOffer } from '../../data/contentPacks';
import { TEST_THEME } from '../../test/fixtures';
import { NewPackCard } from './NewPackCard';

const OFFER: NewPackOffer = {
  pack: CONTENT_PACKS.holidays,
  unitCount: 2,
  firstMissionId: 'g2-u31-m1',
  badgeEmoji: '🕎',
};

function renderCard(readsHebrewAloud: boolean, isProLocked = false) {
  const handlers = { onOpen: vi.fn(), onClose: vi.fn() };
  render(
    <NewPackCard offer={OFFER} gender="boy" theme={TEST_THEME} readsHebrewAloud={readsHebrewAloud} isProLocked={isProLocked} {...handlers} />
  );
  return handlers;
}

describe('NewPackCard', () => {
  it("names the pack and how many units it adds", () => {
    renderCard(false);
    expect(screen.getByRole('heading', { name: 'חדש! חגים ועונות' })).toBeInTheDocument();
    expect(screen.getByText('2 יחידות חדשות נוספו למפה שלך.')).toBeInTheDocument();
  });

  it('opens the pack or closes the card', async () => {
    const user = userEvent.setup();
    const handlers = renderCard(false);
    await user.click(screen.getByRole('button', { name: 'בוא לראות' }));
    expect(handlers.onOpen).toHaveBeenCalledTimes(1);
    await user.click(screen.getByRole('button', { name: 'סגירה' }));
    expect(handlers.onClose).toHaveBeenCalledTimes(1);
  });

  it('reads the card aloud in Hebrew only for grades 1–2', () => {
    renderCard(false);
    expect(screen.queryByRole('button', { name: 'הקשבה להודעה' })).toBeNull();
  });

  it('has a Hebrew 🔊 for grades 1–2', () => {
    renderCard(true);
    expect(screen.getByRole('button', { name: 'הקשבה להודעה' })).toBeInTheDocument();
  });

  it('asks a parent for a Pro pack the learner cannot play yet', async () => {
    const user = userEvent.setup();
    const handlers = renderCard(false, true);
    expect(screen.getByText(/מחכות במפה/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /לבקש מהורה/ }));
    expect(handlers.onOpen).toHaveBeenCalledTimes(1);
  });
});
