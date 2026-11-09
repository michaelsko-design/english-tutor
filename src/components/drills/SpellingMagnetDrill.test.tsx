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

function slotRowSizes(): number[] {
  const word = screen.getByLabelText('המילה');
  return Array.from(word.children).map((row) => row.children.length);
}

describe('SpellingMagnetDrill slot layout', () => {
  it('keeps a 7-letter word on one row', () => {
    renderDrill({ targetEn: 'monster', letterTiles: [...'monster'] });
    expect(slotRowSizes()).toEqual([7]);
  });

  it('splits a 12-letter word into even rows', () => {
    renderDrill({ targetEn: 'refrigerator'.slice(0, 12), letterTiles: [...'refrigerator'.slice(0, 12)] });
    expect(slotRowSizes()).toEqual([6, 6]);
  });

  it('lets a phrase wrap on its own, without row containers', () => {
    renderDrill({ targetEn: 'ice cream', letterTiles: [...'icecream'] });
    expect(screen.getByLabelText('המילה').className).toContain('flex-wrap');
  });
});

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
