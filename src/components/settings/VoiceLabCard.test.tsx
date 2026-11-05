import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getTtsService } from '../../services/tts';
import { DEMO_SENTENCE } from '../../services/tts/demoPhrases';
import { TEST_THEME } from '../../test/fixtures';
import { DEFAULT_VOICE_PREFERENCE } from '../../utils/ttsVoice';
import { VoiceLabCard } from './VoiceLabCard';

function setup() {
  render(<VoiceLabCard voicePreference={DEFAULT_VOICE_PREFERENCE} theme={TEST_THEME} />);
  return userEvent.setup();
}

let speakSpy: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  speakSpy = vi.spyOn(getTtsService(), 'speak');
});

describe('VoiceLabCard', () => {
  it('plays the demo sentence in the chosen voice', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: /שמעו דוגמה/ }));
    expect(speakSpy).toHaveBeenCalledTimes(1);
    expect(speakSpy.mock.calls[0][0]).toBe(DEMO_SENTENCE);
    expect(speakSpy.mock.calls[0][1]).toMatchObject({ voice: DEFAULT_VOICE_PREFERENCE });
  });

  it('plays the typed sentence from the button', async () => {
    const user = setup();
    await user.type(screen.getByLabelText('משפט באנגלית להקראה'), 'Hello there');
    await user.click(screen.getByRole('button', { name: 'הקראה' }));
    expect(speakSpy.mock.calls.some((call: unknown[]) => call[0] === 'Hello there')).toBe(true);
  });

  it('plays the typed sentence with Enter, without submitting a form', async () => {
    const user = setup();
    await user.type(screen.getByLabelText('משפט באנגלית להקראה'), 'Good morning{Enter}');
    expect(speakSpy.mock.calls.some((call: unknown[]) => call[0] === 'Good morning')).toBe(true);
  });

  it('says nothing for an empty or blank sentence', async () => {
    const user = setup();
    await user.click(screen.getByRole('button', { name: 'הקראה' }));
    await user.type(screen.getByLabelText('משפט באנגלית להקראה'), '   {Enter}');
    expect(speakSpy).not.toHaveBeenCalled();
  });
});
