import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ScrambleRound } from '../../../data/wordGames';
import { TEST_THEME } from '../../../test/fixtures';
import { ScrambleGame } from './ScrambleGame';

const ROUNDS: ScrambleRound[] = [
  { word: { word: 'CAT', he: 'חתול', emoji: '🐱' }, letterTiles: ['T', 'C', 'A'] },
  { word: { word: 'DOG', he: 'כלב', emoji: '🐶' }, letterTiles: ['G', 'D', 'O'] },
];

const onFinish = vi.fn();
const onSpeakEnglish = vi.fn();

function setup(gender: 'girl' | 'boy' = 'girl') {
  render(<ScrambleGame rounds={ROUNDS} gender={gender} theme={TEST_THEME} onSpeakEnglish={onSpeakEnglish} onFinish={onFinish} />);
  return userEvent.setup();
}

/** Taps the letters from the tile bank, in order, to spell `word`. */
async function spell(user: ReturnType<typeof userEvent.setup>, word: string) {
  for (const letter of word) {
    const bank = screen.getByLabelText('האותיות');
    const tile = within(bank)
      .getAllByRole('button', { name: `letter ${letter}` })
      .find((button) => !(button as HTMLButtonElement).disabled);
    await user.click(tile!);
  }
}

const check = () => screen.getByRole('button', { name: /בדיקת איות/ });

beforeEach(() => {
  onFinish.mockClear();
  onSpeakEnglish.mockClear();
});

describe('ScrambleGame', () => {
  it('shows the first word’s clue and its position', () => {
    setup();
    expect(screen.getByText(/מילה 1 מתוך 2/)).toBeInTheDocument();
  });

  it('accepts the right order, reads the word aloud and moves to the next round', async () => {
    const user = setup();
    await spell(user, 'CAT');
    await user.click(check());
    expect(screen.getByText(/נכון! CAT = חתול/)).toBeInTheDocument();
    expect(onSpeakEnglish).toHaveBeenCalledWith('cat', 0.9);
    await user.click(screen.getByRole('button', { name: 'למילה הבאה' }));
    expect(screen.getByText(/מילה 2 מתוך 2/)).toBeInTheDocument();
  });

  it('asks to try another order for a wrong spelling, in the learner’s gender', async () => {
    const user = setup('boy');
    await spell(user, 'TCA');
    await user.click(check());
    expect(screen.getByText(/נסה סדר אחר/)).toBeInTheDocument();
  });

  it('cannot check before every slot is filled', async () => {
    const user = setup();
    await spell(user, 'CA');
    expect(check()).toBeDisabled();
  });

  it('takes a placed letter back and resets all of them', async () => {
    const user = setup();
    await spell(user, 'CA');
    await user.click(screen.getByRole('button', { name: 'איפוס אותיות' }));
    expect(check()).toBeDisabled();
  });

  it('scores only the words spelled right on the first try', async () => {
    const user = setup();
    await spell(user, 'TCA');
    await user.click(check());
    await user.click(screen.getByRole('button', { name: 'איפוס אותיות' }));
    await spell(user, 'CAT');
    await user.click(check());
    await user.click(screen.getByRole('button', { name: 'למילה הבאה' }));
    await spell(user, 'DOG');
    await user.click(check());
    await user.click(screen.getByRole('button', { name: /סיום/ }));
    expect(onFinish).toHaveBeenCalledWith(50);
  });

  it('gives a full score for two clean rounds', async () => {
    const user = setup();
    await spell(user, 'CAT');
    await user.click(check());
    await user.click(screen.getByRole('button', { name: 'למילה הבאה' }));
    await spell(user, 'DOG');
    await user.click(check());
    await user.click(screen.getByRole('button', { name: /סיום/ }));
    expect(onFinish).toHaveBeenCalledWith(100);
  });
});
