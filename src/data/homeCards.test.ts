import { describe, expect, it } from 'vitest';
import { HOME_CARD_PRIORITY, HomeCardId, pickHomeCard } from './homeCards';

const want = (...ids: HomeCardId[]): ReadonlySet<HomeCardId> => new Set(ids);

describe('pickHomeCard', () => {
  it('shows nothing when no card wants to show', () => {
    expect(pickHomeCard(want(), null)).toBeNull();
  });

  it('picks the first wanting card in priority order', () => {
    expect(pickHomeCard(want('parent-nudge', 'quick-review', 'home-tip'), null)).toBe('quick-review');
    expect(pickHomeCard(want('reminder-nudge', 'welcome-back'), null)).toBe('welcome-back');
  });

  it('keeps the card already shown this visit, even when a higher card arrives later', () => {
    expect(pickHomeCard(want('home-tip', 'welcome-back'), 'home-tip')).toBe('home-tip');
  });

  it('shows no other card once the shown card is closed or used', () => {
    expect(pickHomeCard(want('parent-nudge', 'reminder-nudge'), 'home-tip')).toBeNull();
  });

  it('puts earned gifts first and the optional asks last', () => {
    expect(HOME_CARD_PRIORITY[0]).toBe('welcome-back');
    expect(HOME_CARD_PRIORITY.slice(-2)).toEqual(['reminder-nudge', 'parent-nudge']);
    expect(new Set(HOME_CARD_PRIORITY).size).toBe(HOME_CARD_PRIORITY.length);
  });
});
