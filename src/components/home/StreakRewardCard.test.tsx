import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { STREAK_REWARD_DAYS, STREAK_REWARD_DIAMONDS, STREAK_REWARD_SPOKEN_HE } from '../../data/streakReward';
import { TEST_THEME } from '../../test/fixtures';
import { StreakRewardCard } from './StreakRewardCard';

const renderCard = (hasEarned: boolean, readsHebrewAloud = false) =>
  render(<StreakRewardCard accountKey="kid1" hasEarnedStreakReward={hasEarned} theme={TEST_THEME} readsHebrewAloud={readsHebrewAloud} />);

describe('StreakRewardCard', () => {
  beforeEach(() => localStorage.clear());

  it('shows nothing before the reward was paid', () => {
    renderCard(false);
    expect(screen.queryByRole('region', { name: 'מתנת רצף' })).toBeNull();
  });

  it('says once that the reward was paid, and stays closed after', async () => {
    const user = userEvent.setup();
    const { unmount } = renderCard(true);
    const card = screen.getByRole('region', { name: 'מתנת רצף' });
    expect(card).toHaveTextContent(`${STREAK_REWARD_DAYS} ימים ברצף`);
    expect(card).toHaveTextContent(`${STREAK_REWARD_DIAMONDS} יהלומים`);

    await user.click(screen.getByRole('button', { name: 'יש! ממשיכים' }));
    expect(screen.queryByRole('region', { name: 'מתנת רצף' })).toBeNull();
    unmount();

    renderCard(true);
    expect(screen.queryByRole('region', { name: 'מתנת רצף' })).toBeNull();
  });

  it('reads aloud for grades 1–2', () => {
    renderCard(true, true);
    expect(screen.getByRole('button', { name: 'הקשבה' })).toBeInTheDocument();
  });

  it('keeps the spoken line in step with the numbers', () => {
    // The clip says the numbers as words: update STREAK_REWARD_SPOKEN_HE (and re-render it) if they change
    expect([STREAK_REWARD_DAYS, STREAK_REWARD_DIAMONDS]).toEqual([3, 10]);
    expect(STREAK_REWARD_SPOKEN_HE).toMatch(/שלושה ימים.*עשרה יהלומים/);
  });
});
