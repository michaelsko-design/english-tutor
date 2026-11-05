import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { WordSearchPuzzle } from '../../../data/wordGames';
import { TEST_THEME } from '../../../test/fixtures';
import { WordHuntGame } from './WordHuntGame';

/**
 *  C A T
 *  X O X
 *  D O G   (CAT across the top row, DOG across the bottom row)
 */
const PUZZLE: WordSearchPuzzle = {
  grid: [
    ['C', 'A', 'T'],
    ['X', 'O', 'X'],
    ['D', 'O', 'G'],
  ],
  placed: [
    { word: { word: 'CAT', he: 'חתול', emoji: '🐱' }, cells: [[0, 0], [0, 1], [0, 2]] },
    { word: { word: 'DOG', he: 'כלב', emoji: '🐶' }, cells: [[2, 0], [2, 1], [2, 2]] },
  ],
};

const onFinish = vi.fn();
const onSpeakEnglish = vi.fn();

function setup(props: { showEnglishList?: boolean; isStream?: boolean; gender?: 'girl' | 'boy' } = {}) {
  render(
    <WordHuntGame
      puzzle={PUZZLE}
      showEnglishList={props.showEnglishList ?? true}
      isStream={props.isStream ?? false}
      gender={props.gender ?? 'girl'}
      theme={TEST_THEME}
      onSpeakEnglish={onSpeakEnglish}
      onFinish={onFinish}
    />
  );
  return userEvent.setup();
}

const cell = (letter: string, row: number, col: number) =>
  screen.getByRole('button', { name: new RegExp(`^${letter}, שורה ${row + 1} עמודה ${col + 1}`) });

async function select(user: ReturnType<typeof userEvent.setup>, from: [string, number, number], to: [string, number, number]) {
  await user.click(cell(...from));
  await user.click(cell(...to));
}

beforeEach(() => {
  onFinish.mockClear();
  onSpeakEnglish.mockClear();
});

describe('WordHuntGame', () => {
  it('lists the English words only when asked to', () => {
    setup({ showEnglishList: false });
    expect(screen.getByText(/חתול/)).toBeInTheDocument();
    expect(screen.queryByText('CAT')).not.toBeInTheDocument();
  });

  it('asks for the last letter after the first tap, in the learner’s gender', async () => {
    const user = setup({ gender: 'boy' });
    await user.click(cell('C', 0, 0));
    expect(screen.getByRole('status')).toHaveTextContent('הקש על האות האחרונה');
  });

  it('cancels a selection by tapping the same letter again', async () => {
    const user = setup();
    await user.click(cell('C', 0, 0));
    await user.click(cell('C', 0, 0));
    expect(screen.getByRole('status')).toHaveTextContent('');
  });

  it('finds a word, reads it aloud and marks it found', async () => {
    const user = setup();
    await select(user, ['C', 0, 0], ['T', 0, 2]);
    expect(screen.getByRole('status')).toHaveTextContent('מצאת: CAT = חתול');
    expect(onSpeakEnglish).toHaveBeenCalledWith('cat', 0.9);
    expect(screen.getByRole('button', { name: /^C, שורה 1 עמודה 1.*נמצא/ })).toBeInTheDocument();
  });

  it('finds a word selected backwards', async () => {
    const user = setup();
    await select(user, ['G', 2, 2], ['D', 2, 0]);
    expect(screen.getByRole('status')).toHaveTextContent('מצאת: DOG');
  });

  it('says so for a selection that is not a word', async () => {
    const user = setup();
    await select(user, ['X', 1, 0], ['X', 1, 2]);
    expect(screen.getByRole('status')).toHaveTextContent('זו לא מילה מהרשימה');
  });

  it('ignores a word that was already found', async () => {
    const user = setup();
    await select(user, ['C', 0, 0], ['T', 0, 2]);
    onSpeakEnglish.mockClear();
    await select(user, ['C', 0, 0], ['T', 0, 2]);
    expect(onSpeakEnglish).not.toHaveBeenCalled();
  });

  it('finishes early with the share of words found, minus 5 for each mistake', async () => {
    const user = setup();
    await select(user, ['C', 0, 0], ['T', 0, 2]);
    await select(user, ['X', 1, 0], ['X', 1, 2]);
    await user.click(screen.getByRole('button', { name: /סיימתי לחפש \(1\/2\)/ }));
    expect(onFinish).toHaveBeenCalledWith(45);
  });

  it('finishes with a full score when every word is found', async () => {
    const user = setup();
    await select(user, ['C', 0, 0], ['T', 0, 2]);
    await select(user, ['D', 2, 0], ['G', 2, 2]);
    expect(screen.getByRole('status')).toHaveTextContent('מצאת את כל המילים');
    await user.click(screen.getByRole('button', { name: /סיום \(100%\)/ }));
    expect(onFinish).toHaveBeenCalledWith(100);
  });

  it('never drops below zero', async () => {
    const user = setup();
    for (let i = 0; i < 25; i++) await select(user, ['X', 1, 0], ['X', 1, 2]);
    await user.click(screen.getByRole('button', { name: /סיימתי לחפש/ }));
    expect(onFinish).toHaveBeenCalledWith(0);
  });
});
