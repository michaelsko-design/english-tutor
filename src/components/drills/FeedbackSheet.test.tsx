import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TEST_THEME } from '../../test/fixtures';
import { FeedbackSheet } from './FeedbackSheet';

function renderSheet(props: { isCorrect: boolean; showNext: boolean }) {
  const handlers = { onNext: vi.fn(), onTryAgain: vi.fn() };
  render(
    <FeedbackSheet
      {...props}
      text="כל הכבוד!"
      nextLabel="הבא"
      tryAgainLabel="ננסה שוב"
      xpGain={10}
      theme={TEST_THEME}
      {...handlers}
    />
  );
  return handlers;
}

describe('FeedbackSheet', () => {
  it('announces a correct answer and moves on with the next button', async () => {
    const user = userEvent.setup();
    const { onNext, onTryAgain } = renderSheet({ isCorrect: true, showNext: true });

    expect(screen.getByRole('alert')).toHaveTextContent('נכון! כל הכבוד!');
    const next = screen.getByRole('button', { name: 'הבא' });
    expect(next).toHaveFocus();
    await user.click(next);

    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onTryAgain).not.toHaveBeenCalled();
  });

  it('a wrong answer offers to try again instead', async () => {
    const user = userEvent.setup();
    const { onNext, onTryAgain } = renderSheet({ isCorrect: false, showNext: false });

    expect(screen.getByRole('alert')).toHaveTextContent('לא נכון.');
    expect(screen.queryByRole('button', { name: 'הבא' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'ננסה שוב' }));

    expect(onTryAgain).toHaveBeenCalledTimes(1);
    expect(onNext).not.toHaveBeenCalled();
  });
});
