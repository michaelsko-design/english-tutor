import { describe, expect, it } from 'vitest';
import { pickVoice, type VoiceInfo } from './ttsVoice';

const v = (name: string, lang = 'en-US'): VoiceInfo => ({ name, lang });

describe('pickVoice', () => {
  const voices = [
    v('Microsoft David - English (United States)'),
    v('Microsoft Zira - English (United States)'),
    v('Google UK English Female', 'en-GB'),
    v('Carmit', 'he-IL'),
  ];

  it('picks a female voice for the female preference', () => {
    expect(pickVoice(voices, 'female')?.name).toContain('Zira');
  });

  it('picks a male voice for the male preference', () => {
    expect(pickVoice(voices, 'male')?.name).toContain('David');
  });

  it('prefers en-US over en-GB among female voices', () => {
    const list = [v('Google UK English Female', 'en-GB'), v('Samantha')];
    expect(pickVoice(list, 'female')?.name).toBe('Samantha');
  });

  it('prefers natural neural voices', () => {
    const list = [v('Microsoft Zira - English (United States)'), v('Microsoft Aria Online (Natural) - English (United States)')];
    expect(pickVoice(list, 'female')?.name).toContain('Aria');
  });

  it('ignores non-English voices', () => {
    expect(pickVoice([v('Samantha', 'es-ES')], 'female')).toBeNull();
  });

  it('returns null for an empty list or no match', () => {
    expect(pickVoice([], 'female')).toBeNull();
    expect(pickVoice([v('Robot 9000')], 'male')).toBeNull();
  });

  it('treats an unknown preference as female', () => {
    expect(pickVoice(voices, 'other' as never)?.name).toContain('Zira');
  });

  it('does not treat a female voice as male', () => {
    expect(pickVoice([v('Google UK English Female', 'en-GB')], 'male')).toBeNull();
  });
});
