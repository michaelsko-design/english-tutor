import { describe, expect, it } from 'vitest';
import { getFallbackPitch, pickVoice, type VoiceInfo } from './ttsVoice';

describe('getFallbackPitch', () => {
  it('leaves the pitch alone when a matching voice was found', () => {
    expect(getFallbackPitch('male', true)).toBe(1);
    expect(getFallbackPitch('female', true)).toBe(1);
  });

  it('lowers the male and raises the female pitch when no voice matched', () => {
    expect(getFallbackPitch('male', false)).toBeLessThan(1);
    expect(getFallbackPitch('female', false)).toBeGreaterThan(1);
  });
});

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

  it('recognises Android Google TTS voices by their code', () => {
    const list = [v('en-us-x-sfg-local'), v('en-us-x-iom-local'), v('en-us-x-tpc-network')];
    expect(pickVoice(list, 'male')?.name).toBe('en-us-x-iom-local');
    expect(pickVoice(list, 'female')?.name).not.toBe('en-us-x-iom-local');
    expect(pickVoice(list, 'female')).not.toBeNull();
  });

  it('does not treat a female voice as male', () => {
    expect(pickVoice([v('Google UK English Female', 'en-GB')], 'male')).toBeNull();
  });
});
