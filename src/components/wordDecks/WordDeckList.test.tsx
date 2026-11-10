import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TEST_THEME } from '../../test/fixtures';
import { FIXTURE_DECK, FIXTURE_PRO_DECK } from '../../data/wordDecks/fixtures';
import type { DeckWordMasteryMap } from '../../data/wordDecks/deckMastery';
import type { LearnerGender } from '../../types/learner';
import { WordDeckList } from './WordDeckList';

const MASTERY: DeckWordMasteryMap = {
  apple: { wordEn: 'apple', translationHe: 'תפוח', firstTryDays: ['2026-11-01', '2026-11-02'], masteredOn: '2026-11-02' },
  bread: { wordEn: 'bread', translationHe: 'לחם', firstTryDays: ['2026-11-01'] },
};

function renderList(gender: LearnerGender = 'girl', decks = [FIXTURE_DECK, FIXTURE_PRO_DECK]) {
  const handlers = { onStart: vi.fn(), onAskPro: vi.fn(), onSpeakEnglish: vi.fn() };
  render(
    <WordDeckList
      decks={decks}
      mastery={MASTERY}
      gender={gender}
      theme={TEST_THEME}
      canPlay={(deck) => deck.packId !== FIXTURE_PRO_DECK.packId}
      {...handlers}
    />
  );
  return handlers;
}

describe('WordDeckList', () => {
  it('lists each deck with its topic, word count and mastered count', () => {
    renderList();
    const deck = screen.getByRole('article', { name: 'אוכל' });
    expect(within(deck).getByText('Food')).toHaveAttribute('lang', 'en');
    expect(within(deck).getByText('6 מילים · 1 נשלטו')).toBeInTheDocument();
    expect(within(deck).getByRole('progressbar', { name: 'מילים שנשלטו' })).toHaveAttribute('aria-valuenow', '1');
  });

  it('starts a deck session', async () => {
    const { onStart } = renderList();
    await userEvent.click(within(screen.getByRole('article', { name: 'אוכל' })).getByRole('button', { name: 'תרגלי את הערכה' }));
    expect(onStart).toHaveBeenCalledWith(FIXTURE_DECK);
  });

  it('a Pro deck asks for Pro instead of starting', async () => {
    const { onStart, onAskPro } = renderList();
    const proDeck = screen.getByRole('article', { name: 'עוד אוכל' });
    expect(within(proDeck).queryByRole('button', { name: 'תרגלי את הערכה' })).toBeNull();
    await userEvent.click(within(proDeck).getByRole('button', { name: /ערכה של/ }));
    expect(onAskPro).toHaveBeenCalled();
    expect(onStart).not.toHaveBeenCalled();
  });

  it('shows the words, reads each one aloud and marks the mastered ones', async () => {
    const { onSpeakEnglish } = renderList();
    const deck = screen.getByRole('article', { name: 'אוכל' });
    const toggle = within(deck).getByRole('button', { name: 'הצגת המילים' });
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(within(deck).getAllByRole('listitem')).toHaveLength(FIXTURE_DECK.items.length);
    expect(within(deck).getByText('apple')).toHaveAttribute('dir', 'ltr');
    expect(within(deck).getAllByLabelText('נשלטה')).toHaveLength(1);

    await userEvent.click(within(deck).getByRole('button', { name: /הקשבה ל-.*apple/ }));
    expect(onSpeakEnglish).toHaveBeenCalledWith('apple. I eat an apple.', 0.95);
  });

  it('speaks to a boy in the masculine', () => {
    renderList('boy');
    expect(screen.getAllByRole('button', { name: 'תרגל את הערכה' })).toHaveLength(1);
    expect(screen.getByText(/בחר ערכה ותרגל/)).toBeInTheDocument();
  });

  it('shows nothing when the grade has no released deck', () => {
    const { container } = render(
      <WordDeckList decks={[]} mastery={undefined} gender="girl" theme={TEST_THEME} canPlay={() => true} onStart={vi.fn()} onAskPro={vi.fn()} onSpeakEnglish={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
