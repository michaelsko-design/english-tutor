import { describe, expect, it } from 'vitest';
import { formatGainLtr, getTextLang, isolateEnglishRuns, isolateLtr } from './bidi';

describe('isolateLtr', () => {
  it('wraps the text in a left-to-right isolate', () => {
    expect(isolateLtr('+10 XP')).toBe('\u2066+10 XP\u2069');
  });
});

describe('formatGainLtr', () => {
  it('puts the plus sign in front of the amount and isolates it', () => {
    expect(formatGainLtr(5, 'XP')).toBe('\u2066+5 XP\u2069');
    expect(formatGainLtr(2, '💎')).toBe('\u2066+2 💎\u2069');
  });
});

describe('getTextLang', () => {
  it('marks English-only text as English', () => {
    expect(getTextLang('She is reading a book.')).toBe('en');
  });

  it('leaves Hebrew and mixed text to the page language', () => {
    expect(getTextLang('לרוץ מהר')).toBeUndefined();
    expect(getTextLang('לרוץ מהר (to run)')).toBeUndefined();
    expect(getTextLang('12')).toBeUndefined();
  });
});

describe('isolateEnglishRuns', () => {
  const ltr = (text: string) => `⁦${text}⁩`;

  it('keeps an English list in one piece and leaves the Hebrew sentence its punctuation', () => {
    expect(isolateEnglishRuns('פעלים שנגמרים ב-sh, ch, s, x או o מקבלים es: watches, goes.')).toBe(
      `פעלים שנגמרים ב-${ltr('sh, ch, s, x')} או ${ltr('o')} מקבלים ${ltr('es: watches, goes')}.`
    );
  });

  it('isolates formulas and words with apostrophes', () => {
    expect(isolateEnglishRuns('עם he / she / it מוסיפים s')).toBe(`עם ${ltr('he / she / it')} מוסיפים ${ltr('s')}`);
    expect(isolateEnglishRuns('ו-mustn’t? אסור!')).toBe(`ו-${ltr('mustn’t')}? אסור!`);
  });

  it('leaves Hebrew-only text unchanged', () => {
    expect(isolateEnglishRuns('שלום לכולם!')).toBe('שלום לכולם!');
  });
});
