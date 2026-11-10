import { describe, expect, it } from 'vitest';
import { buildIndex, entryFoundIn, entryVariants, inflect, normalizeText } from './wordMatch';

describe('normalizeText', () => {
  it('lower-cases, straightens quotes and pads with spaces', () => {
    expect(normalizeText('Don’t STOP, Dan!')).toBe(' do not stop dan ');
    expect(normalizeText("What's this? I'm Dan.")).toBe(' what is this i am dan ');
  });
});

describe('entryVariants', () => {
  it('splits alternatives on a slash', () => {
    expect(entryVariants('airplane/plane')).toEqual(['airplane', 'plane']);
    expect(entryVariants('a quarter to/a quarter past ')).toEqual(['a quarter to', 'a quarter past']);
  });

  it('splits sentence chunks on question marks and ellipses', () => {
    expect(entryVariants('What is this? What’s this?')).toEqual(['what is this']);
    expect(entryVariants('Where is the …? Where’s the …')).toEqual(['where is the']);
  });

  it('drops placeholders and notes', () => {
    expect(entryVariants('look after sb')).toEqual(['look after']);
    expect(entryVariants('too small / hard / much, etc.')).toEqual(['too small', 'hard', 'much']);
  });

  it('keeps one phrase for a phrasal verb listed in both word orders, but not for "more or less"', () => {
    expect(entryVariants('sum up (sth/sb) or sum (sth/sb) up')).toEqual(['sum up']);
    expect(entryVariants('give away sth or give sth away')).toEqual(['give away']);
    expect(entryVariants('more or less')).toEqual(['more or less']);
  });
});

describe('inflect', () => {
  it('makes regular forms', () => {
    expect(inflect('play')).toEqual(expect.arrayContaining(['plays', 'played', 'playing']));
    expect(inflect('make')).toEqual(expect.arrayContaining(['making', 'made']));
    expect(inflect('baby')).toEqual(expect.arrayContaining(['babies']));
    expect(inflect('stop')).toEqual(expect.arrayContaining(['stopped', 'stopping']));
  });

  it('adds irregular forms', () => {
    expect(inflect('go')).toEqual(expect.arrayContaining(['went', 'gone']));
    expect(inflect('child')).toContain('children');
  });
});

describe('entryFoundIn', () => {
  const index = buildIndex(['The children went to school by plane.', 'She is looking after her brother.']);

  it('finds a word in any form', () => {
    expect(entryFoundIn('child', index)).toBe(true);
    expect(entryFoundIn('go', index)).toBe(true);
    expect(entryFoundIn('airplane/plane', index)).toBe(true);
  });

  it('finds a phrase with its first word inflected', () => {
    expect(entryFoundIn('look after sb', index)).toBe(true);
  });

  it('does not match part of a longer word', () => {
    expect(entryFoundIn('rot', index)).toBe(false);
    expect(entryFoundIn('ten', buildIndex(['They often listen.']))).toBe(false);
  });
});
