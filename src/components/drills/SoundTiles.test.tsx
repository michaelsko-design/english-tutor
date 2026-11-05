import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TEST_THEME } from '../../test/fixtures';
import { SoundTiles } from './SoundTiles';

const reduced = vi.hoisted(() => ({ value: false }));
vi.mock('../../hooks/usePrefersReducedMotion', () => ({ usePrefersReducedMotion: () => reduced.value }));

const onSpeakEnglish = vi.fn();

function setup(props: { canSlide?: boolean; word?: string; tiles?: string[] } = {}) {
  const view = render(
    <SoundTiles tiles={props.tiles ?? ['sh', 'i', 'p']} word={props.word ?? 'ship'} canSlide={props.canSlide ?? true} onSpeakEnglish={onSpeakEnglish} theme={TEST_THEME} />
  );
  const user = { click: async (el: HTMLElement) => void fireEvent.click(el) };
  return { ...view, user };
}

const slideButton = () => screen.getByRole('button', { name: /מחברים את האותיות/ });
const isLit = (tile: string) => screen.getByRole('button', { name: `האות ${tile}` }).className.includes('bg-amber-300');

beforeEach(() => {
  vi.useFakeTimers();
  reduced.value = false;
  onSpeakEnglish.mockClear();
});
afterEach(() => vi.useRealTimers());

describe('SoundTiles', () => {
  it('says the letter name when a tile is tapped', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'האות sh' }));
    expect(onSpeakEnglish).toHaveBeenCalledTimes(1);
  });

  it('hides the slide button when sliding is not allowed', () => {
    setup({ canSlide: false });
    expect(screen.queryByRole('button', { name: /מחברים את האותיות/ })).not.toBeInTheDocument();
  });

  it('lights the tiles one by one and then reads the word slowly', async () => {
    const { user } = setup();
    await user.click(slideButton());
    expect(isLit('sh')).toBe(true);
    expect(isLit('i')).toBe(false);
    act(() => void vi.advanceTimersByTime(450));
    expect(isLit('i')).toBe(true);
    expect(onSpeakEnglish).not.toHaveBeenCalled();
    act(() => void vi.advanceTimersByTime(450));
    expect(isLit('p')).toBe(true);
    expect(onSpeakEnglish).toHaveBeenCalledWith('ship', 0.7);
  });

  it('lights everything at once for a learner who prefers reduced motion', async () => {
    reduced.value = true;
    const { user } = setup();
    await user.click(slideButton());
    expect(isLit('sh') && isLit('i') && isLit('p')).toBe(true);
    expect(onSpeakEnglish).toHaveBeenCalledWith('ship', 0.7);
  });

  it('restarts the slide when it is pressed again', async () => {
    const { user } = setup();
    await user.click(slideButton());
    act(() => void vi.advanceTimersByTime(450));
    await user.click(slideButton());
    expect(isLit('sh')).toBe(true);
    expect(isLit('i')).toBe(false);
  });

  it('starts a new word dark', async () => {
    const { user, rerender } = setup();
    await user.click(slideButton());
    rerender(<SoundTiles tiles={['m', 'a', 'p']} word="map" canSlide onSpeakEnglish={onSpeakEnglish} theme={TEST_THEME} />);
    expect(isLit('m')).toBe(false);
  });

  it('stops its timer when it unmounts', async () => {
    const { user, unmount } = setup();
    await user.click(slideButton());
    unmount();
    act(() => void vi.advanceTimersByTime(2000));
    expect(onSpeakEnglish).not.toHaveBeenCalled();
  });
});
