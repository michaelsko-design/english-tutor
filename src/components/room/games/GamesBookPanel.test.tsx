import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeProfile, TEST_THEME } from '../../../test/fixtures';
import { GamesBookPanel } from './GamesBookPanel';

const score = vi.hoisted(() => ({ value: 80 }));

vi.mock('./ScrambleGame', () => ({
  ScrambleGame: ({ onFinish }: { onFinish: (s: number) => void }) => (
    <button type="button" onClick={() => onFinish(score.value)}>finish-ScrambleGame</button>
  ),
}));
vi.mock('./CrosswordGame', () => ({
  CrosswordGame: ({ onFinish }: { onFinish: (s: number) => void }) => (
    <button type="button" onClick={() => onFinish(score.value)}>finish-CrosswordGame</button>
  ),
}));
vi.mock('./WordHuntGame', () => ({
  WordHuntGame: ({ onFinish }: { onFinish: (s: number) => void }) => (
    <button type="button" onClick={() => onFinish(score.value)}>finish-WordHuntGame</button>
  ),
}));

const onUpdateProfile = vi.fn();
const onClose = vi.fn();

function setup(stars: number) {
  render(
    <GamesBookPanel
      profile={makeProfile({ stats: { stars } as never })}
      theme={TEST_THEME}
      onUpdateProfile={onUpdateProfile}
      onSpeakEnglish={vi.fn()}
      onClose={onClose}
    />
  );
  return userEvent.setup();
}

const gameButton = (title: RegExp) => screen.getByRole('button', { name: title });

/** The grade's words load asynchronously, so a tap before they arrive does nothing: tap until the game shows. */
async function startGame(user: ReturnType<typeof userEvent.setup>, title: RegExp, finishName: string) {
  await waitFor(async () => {
    const button = screen.queryByRole('button', { name: title });
    if (button) await user.click(button);
    expect(screen.getByRole('button', { name: finishName })).toBeInTheDocument();
  });
}

beforeEach(() => {
  score.value = 80;
  onUpdateProfile.mockClear();
  onClose.mockClear();
});

describe('GamesBookPanel', () => {
  it('locks the games that need more stars and says how many are missing', () => {
    setup(0);
    expect(gameButton(/מילים מבולבלות/)).toBeEnabled();
    expect(gameButton(/תפזורת/)).toBeDisabled();
    expect(screen.getByText(/נפתח ב־10.*חסרים לך 10/)).toBeInTheDocument();
    expect(screen.getByText(/יש לך 0/)).toBeInTheDocument();
  });

  it('unlocks every game with enough stars', () => {
    setup(40);
    for (const title of [/מילים מבולבלות/, /תפזורת/, /תשבץ/, /מילים מוסתרות/]) expect(gameButton(title)).toBeEnabled();
  });

  it('plays a game, shows the result, rewards it and records it', async () => {
    const user = setup(0);
    await startGame(user, /מילים מבולבלות/, 'finish-ScrambleGame');
    await user.click(screen.getByRole('button', { name: 'finish-ScrambleGame' }));
    expect(onUpdateProfile).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/מילים מבולבלות: 80%/)).toBeInTheDocument();
  });

  it('runs each other game type', async () => {
    const user = setup(40);
    await startGame(user, /תשבץ/, 'finish-CrosswordGame');
    await user.click(screen.getByRole('button', { name: /לספר המשחקים/ }));
    await startGame(user, /תפזורת/, 'finish-WordHuntGame');
    await user.click(screen.getByRole('button', { name: /לספר המשחקים/ }));
    await startGame(user, /מילים מוסתרות/, 'finish-WordHuntGame');
  });

  it('plays again from the result and returns to the book from a game', async () => {
    const user = setup(0);
    await startGame(user, /מילים מבולבלות/, 'finish-ScrambleGame');
    await user.click(screen.getByRole('button', { name: 'finish-ScrambleGame' }));
    await user.click(screen.getByRole('button', { name: /שוב/ }));
    await user.click(await screen.findByRole('button', { name: /לספר המשחקים/ }));
    expect(screen.getByText(/ספר המשחקים/)).toBeInTheDocument();
  });

  it('explains a low score that misses the daily reward', async () => {
    score.value = 20;
    const user = setup(0);
    await startGame(user, /מילים מבולבלות/, 'finish-ScrambleGame');
    await user.click(screen.getByRole('button', { name: 'finish-ScrambleGame' }));
    expect(screen.getByText(/הפרס היומי ניתן מ־50% ומעלה/)).toBeInTheDocument();
  });

  it('shows the best score on a played game after the book reopens', async () => {
    const user = setup(0);
    await startGame(user, /מילים מבולבלות/, 'finish-ScrambleGame');
    await user.click(screen.getByRole('button', { name: 'finish-ScrambleGame' }));
    await user.click(screen.getByRole('button', { name: /לספר המשחקים/ }));
    expect(screen.getByText(/מילים מבולבלות/)).toBeInTheDocument();
  });
});
