import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { resolveTheme } from '../themes/themeRegistry';
import { FirstLesson } from './FirstLesson';

vi.mock('../services/tts', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../services/tts')>()),
  getTtsService: () => ({
    speak: vi.fn(),
    stop: vi.fn(),
    enqueue: vi.fn(),
    speakSequence: vi.fn(),
    subscribe: () => () => {},
    getCurrent: () => null,
  }),
  speakHebrew: vi.fn().mockResolvedValue(undefined),
}));

const theme = resolveTheme('cozy-studio');

function setup() {
  const onDone = vi.fn();
  render(<FirstLesson theme={theme} onDone={onDone} />);
  return { onDone, user: userEvent.setup() };
}

describe('FirstLesson', () => {
  it('opens on the letters lesson with nothing to answer', () => {
    setup();
    expect(screen.getByRole('dialog', { name: 'השיעור הראשון' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /האותיות/ })).toBeInTheDocument();
    expect(screen.queryByText(/נסו בעצמכם/)).not.toBeInTheDocument();
  });

  it('is finished by walking through the cards to the last button', async () => {
    const { onDone, user } = setup();
    // Two cards (the idea, the letters): "הבא" once, then the last button ends the lesson
    await user.click(screen.getByRole('button', { name: 'הבא' }));
    expect(onDone).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: /סיימנו/ }));
    expect(onDone).toHaveBeenCalledWith(true);
  });

  it('reports an early exit as not finished, so no streak is earned', async () => {
    const { onDone, user } = setup();
    await user.click(screen.getByRole('button', { name: 'יציאה מהשיעור' }));
    expect(onDone).toHaveBeenCalledWith(false);
  });
});
