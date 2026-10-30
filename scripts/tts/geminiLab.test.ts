import { describe, expect, it } from 'vitest';
import { applyLabSpellings, classifyLine, labRequestKey, labSegments, parseLabRequestKey, pickLabKeys, splitLine } from './geminiLab';

describe('splitLine', () => {
  it('cuts at sentence ends and dashes', () => {
    expect(splitLine('לא בדיוק — socks פירושו "גרביים". נסי שוב!', false)).toEqual(['לא בדיוק', 'socks פירושו "גרביים".', 'נסי שוב!']);
  });

  it('also cuts where English and Hebrew meet', () => {
    expect(splitLine('סופרים eight, nine, ten. לפני ten בא nine.', true)).toEqual(['סופרים', 'eight, nine, ten.', 'לפני', 'ten', 'בא', 'nine.']);
  });

  it('keeps a lone punctuation mark with the clip before it', () => {
    expect(splitLine('לא בדיוק. B כמו ball . אמור את המילה לאט ונסה שוב!', true)).toEqual(['לא בדיוק.', 'B', 'כמו', 'ball .', 'אמור את המילה לאט ונסה שוב!']);
  });

  it('leaves a single word whole', () => {
    expect(splitLine('מיטה', true)).toEqual(['מיטה']);
  });
});

describe('labSegments', () => {
  it('puts the flagged words in niqqud, whole words only', () => {
    expect(applyLabSpellings('קראי את הסיפור וקראי שוב')).toBe('קִרְאִי את הסיפור וְקִרְאִי שוב');
    expect(applyLabSpellings('מקראי')).toBe('מקראי');
  });

  it('gives the niqqud variant as one clip and the others split', () => {
    expect(labSegments('niqqud', '[to:girl] קראי. שלום')).toEqual(['קִרְאִי. שלום']);
    expect(labSegments('sentences-niqqud', '[to:girl] קראי. שלום')).toEqual(['קִרְאִי.', 'שלום']);
  });
});

describe('lab selection', () => {
  it('classifies lines', () => {
    expect(classifyLine('לא בדיוק — socks פירושו "גרביים"')).toBe('mixed');
    expect(classifyLine('מיטה')).toBe('short');
    expect(classifyLine('לאוגר יש כדור אדום מאוד')).toBe('other');
  });

  it('takes a few of each class', () => {
    const flagged = ['מיטה', 'לימון', 'זו תרנגולת', 'a b', 'לאוגר יש כדור אדום מאוד'].map((text, i) => ({ key: String(i), text }));
    expect(pickLabKeys(flagged, 2).map((item) => item.key)).toEqual(['0', '1', '3', '4']);
  });

  it('round-trips a request key', () => {
    expect(parseLabRequestKey(labRequestKey('abc', 'runs-niqqud', 2, 5))).toEqual({ key: 'abc', variant: 'runs-niqqud', index: 2, count: 5 });
    expect(parseLabRequestKey('abc')).toBeNull();
  });
});
