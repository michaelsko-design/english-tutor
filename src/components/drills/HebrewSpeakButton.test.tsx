import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HebrewAudioContext } from '../../data/hebrewAudio';
import { HebrewSpeakButton } from './HebrewSpeakButton';
import { OptionSpeakButton } from './OptionSpeakButton';

const withAudio = (isOn: boolean, ui: React.ReactElement) =>
  render(<HebrewAudioContext.Provider value={isOn}>{ui}</HebrewAudioContext.Provider>);

describe('Hebrew speaker buttons', () => {
  it('show for grades 1–2', () => {
    withAudio(true, <HebrewSpeakButton text="שלום" label="הקשבה להוראה" />);
    expect(screen.getByRole('button', { name: 'הקשבה להוראה' })).toBeTruthy();
  });

  it('are hidden for later grades, except where marked always', () => {
    withAudio(false, <HebrewSpeakButton text="שלום" label="הקשבה להוראה" />);
    expect(screen.queryByRole('button')).toBeNull();
    withAudio(false, <HebrewSpeakButton text="שלום" label="הקשבה לשאלה" isAlways />);
    expect(screen.getByRole('button', { name: 'הקשבה לשאלה' })).toBeTruthy();
  });

  it('keep the English option speaker for every grade but hide the Hebrew one', () => {
    withAudio(false, <OptionSpeakButton text="cat" onSpeakEnglish={() => undefined} className="" />);
    expect(screen.getByRole('button')).toBeTruthy();
    document.body.innerHTML = '';
    withAudio(false, <OptionSpeakButton text="חתול" className="" />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
