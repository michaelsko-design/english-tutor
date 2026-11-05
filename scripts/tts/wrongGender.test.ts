import { describe, expect, it } from 'vitest';
import { getClipKey } from '../../src/services/tts/ttsText';
import type { CorpusPhrase } from './corpusBuilder';
import { dropWrongGender } from './wrongGender';
import { collectCorpus } from './corpus';
import { HEBREW_VOICE, parseListenerGender } from '../../src/services/tts/ttsText';
import { inflectHebrew } from '../../src/utils/hebrewGender';

const phrase = (text: string): CorpusPhrase => ({ key: getClipKey(text, 'normal'), text, speed: 'normal' });
const texts = (phrases: CorpusPhrase[]): string[] => phrases.map((item) => item.text);

describe('dropWrongGender', () => {
  const pair = [
    phrase('[to:girl] הקשיבי ובחרי את האות ששמעת:'),
    phrase('[to:boy] הקשיבי ובחרי את האות ששמעת:'),
    phrase('[to:girl] הקשב ובחר את האות ששמעת:'),
    phrase('[to:boy] הקשב ובחר את האות ששמעת:'),
  ];

  it('keeps a feminine text for the girl and a masculine one for the boy', () => {
    expect(texts(dropWrongGender(pair))).toEqual(['[to:girl] הקשיבי ובחרי את האות ששמעת:', '[to:boy] הקשב ובחר את האות ששמעת:']);
  });

  it('keeps both genders of a line whose wording is the same for both', () => {
    const same = [phrase('[to:girl] מעולה'), phrase('[to:boy] מעולה'), phrase('[to:girl] בנית את המילה cat'), phrase('[to:boy] בנית את המילה cat')];
    expect(dropWrongGender(same)).toHaveLength(4);
  });

  it('leaves lines without a gender tag alone', () => {
    const plain = [phrase('הקשיבי ובחרי את האות'), phrase('הקשב ובחר את האות')];
    expect(dropWrongGender(plain)).toHaveLength(2);
  });
});

describe('the Hebrew corpus', () => {
  const tagged = collectCorpus(HEBREW_VOICE).map((item) => parseListenerGender(item.text)).filter((item) => item.gender);

  it('has no boy clip with feminine wording', () => {
    expect(tagged.filter((item) => item.gender === 'boy' && inflectHebrew(item.text, 'boy') !== item.text)).toEqual([]);
  });

  it('has a girl clip and a boy clip for every gendered text', () => {
    const girl = new Set(tagged.filter((item) => item.gender === 'girl').map((item) => item.text));
    const boy = new Set(tagged.filter((item) => item.gender === 'boy').map((item) => item.text));
    // a feminine line has its masculine twin (inflected) in the boy set
    const feminine = [...girl].filter((text) => inflectHebrew(text, 'boy') !== text);
    expect(feminine.filter((text) => !boy.has(inflectHebrew(text, 'boy')))).toEqual([]);
  });
});
