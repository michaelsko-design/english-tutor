import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TEST_THEME } from '../../test/fixtures';
import { QuickReviewCard } from './QuickReviewCard';

const WORDS = ['apple', 'bread', 'milk'].map((wordEn) => ({ wordEn, translationHe: 'מילה', missedOn: '2026-11-22' }));

describe('QuickReviewCard', () => {
  it('offers the review with the number of waiting words and starts it', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(<QuickReviewCard words={WORDS} theme={TEST_THEME} onStart={onStart} />);

    expect(screen.getByRole('region', { name: 'חזרה של דקה' })).toHaveTextContent('3 מילים');
    await user.click(screen.getByRole('button', { name: 'מתחילים' }));

    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('shows nothing when no review is due', () => {
    const { container } = render(<QuickReviewCard words={[]} theme={TEST_THEME} onStart={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });
});
