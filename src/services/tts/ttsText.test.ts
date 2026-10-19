import { describe, expect, it } from 'vitest';
import {
  buildLiveTtsQuery,
  getClipKey,
  getClipSpeed,
  getClipText,
  getSpeedBucket,
  isCloudSpeakable,
  MAX_TTS_CHARS,
  normalizeTtsText,
  toSpeakableText,
} from './ttsText';

describe('toSpeakableText', () => {
  it('reads blanks as "blank" and drops emoji', () => {
    expect(toSpeakableText('I ___ a cat 🐱')).toBe('I blank a cat');
  });
});

describe('normalizeTtsText', () => {
  it('trims and collapses whitespace', () => {
    expect(normalizeTtsText('  Hello \n  world  ')).toBe('Hello world');
  });
});

describe('getClipText', () => {
  it('lowercases a single word and drops its edge punctuation', () => {
    expect(getClipText('School.')).toBe('school');
    expect(getClipText('"Hi,"')).toBe('hi');
  });

  it('keeps the pronoun I capitalised', () => {
    expect(getClipText('I')).toBe('I');
  });

  it('keeps sentences as written', () => {
    expect(getClipText('I like  Apples.')).toBe('I like Apples.');
  });
});

describe('isCloudSpeakable', () => {
  it('accepts plain English', () => {
    expect(isCloudSpeakable("Don't forget your hat!")).toBe(true);
  });

  it('rejects Hebrew, empty and over-long text', () => {
    expect(isCloudSpeakable('שלום')).toBe(false);
    expect(isCloudSpeakable('   ')).toBe(false);
    expect(isCloudSpeakable('a'.repeat(MAX_TTS_CHARS + 1))).toBe(false);
  });

  it('allows a longer limit for rendered clips', () => {
    expect(isCloudSpeakable('a '.repeat(150), 2000)).toBe(true);
  });

  it('rejects markup characters', () => {
    expect(isCloudSpeakable('<speak>hi</speak>')).toBe(false);
  });
});

describe('speed buckets', () => {
  it('treats 0.8 and below as slow', () => {
    expect(getSpeedBucket(0.65)).toBe('slow');
    expect(getSpeedBucket(0.8)).toBe('slow');
    expect(getSpeedBucket(0.85)).toBe('normal');
  });

  it('only single words get a slow clip', () => {
    expect(getClipSpeed('cat', 'slow')).toBe('slow');
    expect(getClipSpeed('a big cat', 'slow')).toBe('normal');
  });
});

describe('getClipKey', () => {
  it('gives a word chip and a vocabulary word the same key', () => {
    expect(getClipKey('School.', 'normal')).toBe(getClipKey('school', 'normal'));
  });

  it('tells speeds and texts apart', () => {
    expect(getClipKey('cat', 'slow')).not.toBe(getClipKey('cat', 'normal'));
    expect(getClipKey('cat', 'normal')).not.toBe(getClipKey('cap', 'normal'));
  });

  it('uses the normal clip for a slow sentence', () => {
    expect(getClipKey('a big cat', 'slow')).toBe(getClipKey('a big cat', 'normal'));
  });
});

describe('buildLiveTtsQuery', () => {
  it('survives URL parsing unchanged, apostrophes included', () => {
    const query = buildLiveTtsQuery("Don't stop (now)!", 'male', 'normal');
    expect(new URL(`https://app.test/api/tts${query}`).search).toBe(query);
    expect(new URL(`https://app.test/api/tts${query}`).searchParams.get('t')).toBe("Don't stop (now)!");
  });
});
