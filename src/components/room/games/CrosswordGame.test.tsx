import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CrosswordPuzzle } from '../../../data/wordGames';
import { TEST_THEME } from '../../../test/fixtures';
import { CrosswordGame } from './CrosswordGame';

/** CAT across from (0,0); COW down from (0,0): they share the C. */
const PUZZLE: CrosswordPuzzle = {
  width: 3,
  height: 3,
  entries: [
    { number: 1, direction: 'across', row: 0, col: 0, word: { word: 'CAT', he: 'חתול', emoji: '🐱' } },
    { number: 1, direction: 'down', row: 0, col: 0, word: { word: 'COW', he: 'פרה', emoji: '🐮' } },
  ],
};

const onFinish = vi.fn();
const onSpeakEnglish = vi.fn();

function setup(gender: 'girl' | 'boy' = 'girl') {
  render(<CrosswordGame puzzle={PUZZLE} gender={gender} theme={TEST_THEME} onSpeakEnglish={onSpeakEnglish} onFinish={onFinish} />);
  return userEvent.setup();
}

const answerBox = () => screen.getByRole('textbox');

beforeEach(() => {
  onFinish.mockClear();
  onSpeakEnglish.mockClear();
});

describe('CrosswordGame', () => {
  it('shows the Hebrew clues with the word lengths, grouped by direction', () => {
    setup();
    expect(screen.getByText(/1\. .*חתול \(3\)/)).toBeInTheDocument();
    expect(screen.getByText(/1\. .*פרה \(3\)/)).toBeInTheDocument();
    expect(screen.getByText(/מאוזן/)).toBeInTheDocument();
    expect(screen.getByText(/מאונך/)).toBeInTheDocument();
  });

  it('keeps only letters and limits the answer to the word length', async () => {
    const user = setup();
    await user.type(answerBox(), 'c4a-t!x');
    expect(answerBox()).toHaveValue('cat');
  });

  it('accepts a right answer, reads it aloud and moves on to the next clue', async () => {
    const user = setup();
    await user.type(answerBox(), 'cat');
    await user.click(screen.getByRole('button', { name: /בדיקה/ }));
    expect(screen.getByRole('status')).toHaveTextContent('נכון! CAT');
    expect(onSpeakEnglish).toHaveBeenCalledWith('cat', 0.9);
    expect(screen.getByLabelText(/חתול|פרה/)).toBeInTheDocument();
    expect(screen.getByLabelText('התשובה ל־1: פרה')).toBeInTheDocument();
  });

  it('checks with the Enter key', async () => {
    const user = setup();
    await user.type(answerBox(), 'cat{Enter}');
    expect(screen.getByRole('status')).toHaveTextContent('נכון!');
  });

  it('asks to try again on a wrong answer, in the learner’s gender', async () => {
    const user = setup('boy');
    await user.type(answerBox(), 'dog');
    await user.click(screen.getByRole('button', { name: /בדיקה/ }));
    expect(screen.getByRole('status')).toHaveTextContent('בדוק את מספר האותיות ונסה שוב');
  });

  it('switches to another clue by tapping it', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: /פרה/ }));
    expect(screen.getByLabelText('התשובה ל־1: פרה')).toBeInTheDocument();
  });

  it('scores only the words solved without a miss or a reveal', async () => {
    const user = setup();
    await user.type(answerBox(), 'dog');
    await user.click(screen.getByRole('button', { name: /בדיקה/ }));
    await user.clear(answerBox());
    await user.type(answerBox(), 'cat{Enter}');
    await user.type(answerBox(), 'cow{Enter}');
    await user.click(screen.getByRole('button', { name: /פתרת את התשבץ/ }));
    expect(onFinish).toHaveBeenCalledWith(50);
  });

  it('reveals an answer, which then does not count', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'גילוי' }));
    expect(screen.getByRole('status')).toHaveTextContent('התשובה: CAT');
    await user.type(answerBox(), 'cow{Enter}');
    await user.click(screen.getByRole('button', { name: /פתרת את התשבץ/ }));
    expect(onFinish).toHaveBeenCalledWith(50);
  });

  it('gives a full score when every word is right the first time', async () => {
    const user = setup();
    await user.type(answerBox(), 'cat{Enter}');
    await user.type(answerBox(), 'cow{Enter}');
    await user.click(screen.getByRole('button', { name: /פתרת את התשבץ/ }));
    expect(onFinish).toHaveBeenCalledWith(100);
  });
});
