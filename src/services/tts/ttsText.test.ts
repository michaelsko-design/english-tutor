import { describe, expect, it } from 'vitest';
import {
  buildLiveTtsQuery,
  getClipKey,
  getClipSpeed,
  getClipText,
  getSpeedBucket,
  isCloudSpeakable,
  isHebrewSpeakable,
  isSpeakableBy,
  splitLangRuns,
  letterToken,
  parseLetterToken,
  toPlainSpeech,
  MAX_TTS_CHARS,
  normalizeTtsText,
  toSpeakableText,
} from './ttsText';

describe('toSpeakableText', () => {
  it('drops bidi isolates, so an isolated English run keeps the clip key', () => {
    expect(toSpeakableText('A כמו ⁦apple⁩.')).toBe('A כמו apple.');
  });

  it('reads blanks as "blank" and drops emoji', () => {
    expect(toSpeakableText('I ___ a cat 🐱')).toBe('I blank a cat');
  });

  it('drops the keycap mark of a keycap emoji', () => {
    expect(toSpeakableText('What is this? 3️⃣')).toBe('What is this? 3');
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

  it('accepts accented Latin letters and grammar formulas', () => {
    expect(isCloudSpeakable('Does this café serve matcha?')).toBe(true);
    expect(isCloudSpeakable('If + had + V3, would have + V3')).toBe(true);
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

describe('isHebrewSpeakable', () => {
  it('accepts Hebrew with English words, quotes and Hebrew punctuation', () => {
    expect(isHebrewSpeakable('מעולה! cat פירושו "חתול".')).toBe(true);
    expect(isHebrewSpeakable('כיתה א׳ — מתחילים!')).toBe(true);
  });

  it('refuses text without Hebrew, unsupported characters or too long', () => {
    expect(isHebrewSpeakable('hello')).toBe(false);
    expect(isHebrewSpeakable('שלום <b>')).toBe(false);
    expect(isHebrewSpeakable('א'.repeat(MAX_TTS_CHARS + 1))).toBe(false);
  });

  it('is what the Hebrew voice reads, while the English voices read English', () => {
    expect(isSpeakableBy('he-female', 'שלום')).toBe(true);
    expect(isSpeakableBy('he-female', 'hello')).toBe(false);
    expect(isSpeakableBy('female', 'שלום')).toBe(false);
  });
});

describe('splitLangRuns', () => {
  it('splits Hebrew text into Hebrew and English runs', () => {
    expect(splitLangRuns('A כמו apple. B כמו ball.')).toEqual([
      { lang: 'en', text: 'A' },
      { lang: 'he', text: ' כמו ' },
      { lang: 'en', text: 'apple. B' },
      { lang: 'he', text: ' כמו ' },
      { lang: 'en', text: 'ball' },
      { lang: 'he', text: '.' },
    ]);
  });

  it('keeps a Hebrew-only text as one run', () => {
    expect(splitLangRuns('שימו לב!')).toEqual([{ lang: 'he', text: 'שימו לב!' }]);
  });
});

describe('letter tokens', () => {
  it('keeps a letter token as its own clip text and reads it as capitals elsewhere', () => {
    expect(letterToken('B')).toBe('[letter:b]');
    expect(getClipText('[letter:b]')).toBe('[letter:b]');
    expect(parseLetterToken('[letter:sh]')).toBe('SH');
    expect(parseLetterToken('ball')).toBeNull();
    expect(toPlainSpeech('[letter:a]')).toBe('A');
    expect(toPlainSpeech('apple')).toBe('apple');
  });
});
