import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TEST_THEME } from '../../test/fixtures';
import { SpellingMagnetDrill } from './SpellingMagnetDrill';

const LISTEN_LABEL = /האזנה למילה/;

function renderDrill(props: Partial<React.ComponentProps<typeof SpellingMagnetDrill>> = {}) {
  const onSpeakEnglish = vi.fn();
  const onChangeSlots = vi.fn();
  render(
    <SpellingMagnetDrill
      targetEn="map"
      letterTiles={['a', 'p', 'm']}
      slots={[]}
      isCompleted={false}
      onChangeSlots={onChangeSlots}
      onReset={vi.fn()}
      onCheck={vi.fn()}
      listenEn="map"
      listenRate={0.7}
      onSpeakEnglish={onSpeakEnglish}
      theme={TEST_THEME}
      {...props}
    />
  );
  return { onSpeakEnglish, onChangeSlots };
}

describe('SpellingMagnetDrill letter audio', () => {
  it('says the letter name when a tile is tapped, and still places it', async () => {
    const user = userEvent.setup();
    const { onSpeakEnglish, onChangeSlots } = renderDrill({ speaksLetters: true });
    await user.click(screen.getByRole('button', { name: 'letter p' }));
    expect(onSpeakEnglish).toHaveBeenCalledWith('[letter:p]');
    expect(onChangeSlots).toHaveBeenCalledTimes(1);
  });

  it('is silent on tiles by default', async () => {
    const user = userEvent.setup();
    const { onSpeakEnglish } = renderDrill();
    await user.click(screen.getByRole('button', { name: 'letter p' }));
    expect(onSpeakEnglish).not.toHaveBeenCalled();
  });

  it('shows the listen button by default and can hide it', () => {
    renderDrill();
    expect(screen.getByRole('button', { name: LISTEN_LABEL })).toBeTruthy();
    document.body.innerHTML = '';
    renderDrill({ hasListenButton: false });
    expect(screen.queryByRole('button', { name: LISTEN_LABEL })).toBeNull();
  });
});
