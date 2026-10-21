import { describe, expect, it } from 'vitest';
import { LISTENER_GENDERED_WORDS, type ListenerGender } from '../../src/services/tts/ttsText';
import { HEBREW_PRONUNCIATIONS, LISTENER_GENDERED_PRONUNCIATIONS, markPronunciations } from './hebrewPronunciation';

const spelled = (text: string, gender: ListenerGender | null = null) =>
  markPronunciations(text, gender).filter((segment) => segment.ipa);

describe('markPronunciations', () => {
  it('spells out a listed word and keeps the text around it', () => {
    expect(markPronunciations('הקשב ובחר את האות')).toEqual([
      { text: 'הקשב', ipa: 'hak.ˈʃev' },
      { text: ' ' },
      { text: 'ובחר', ipa: 'uv.ˈχaʁ' },
      { text: ' את האות' },
    ]);
  });

  it('reads "בבוס" as be-BOS, stressed on the last syllable', () => {
    expect(spelled('בבוס נפגשים כל הנושאים של היחידה.')).toEqual([{ text: 'בבוס', ipa: 'be.ˈbos' }]);
  });

  it('matches whole words only, so a longer word that contains one is left alone', () => {
    expect(spelled('הבחירה שלך')).toEqual([]);
    expect(spelled('נסיון')).toEqual([]);
  });

  it('reads שם by its neighbors: shem for a name, sam for putting', () => {
    expect(spelled('לכל אות יש שם, צורה גדולה')).toEqual([{ text: 'שם', ipa: 'ˈʃem' }]);
    expect(spelled('אני שם גרביים')).toEqual([{ text: 'שם', ipa: 'ˈsam' }]);
    expect(spelled('הצבע בא לפני שם העצם')).toEqual([{ text: 'שם', ipa: 'ˈʃem' }]);
    // Without a listed neighbor the voice decides
    expect(spelled('הוא גר שם')).toEqual([]);
  });

  it('spells out a prefix before an English word, with its pause', () => {
    expect(spelled('מתחיל ב-B')).toEqual([{ text: 'ב-', ipa: 'be', pauseAfterMs: 50 }]);
    expect(spelled('מתחיל בבית')).toEqual([]);
  });

  it('says a yes/no pair as two words', () => {
    expect(spelled('שאלת כן/לא מתחילה בפועל')).toEqual([{ text: 'כן/לא', ipa: 'ˈken o ˈlo' }]);
  });

  it('splits every multi-syllable spelling into dotted syllables with one stress mark', () => {
    for (const { pattern, ipa } of HEBREW_PRONUNCIATIONS) {
      for (const word of ipa.split(' o ')) {
        const vowels = word.match(/[aeiou]+/g) ?? [];
        expect(word.split('ˈ').length - 1, `${pattern}: ${word}`).toBeLessThanOrEqual(1);
        if (vowels.length > 1) expect(word.split('.').length, `${pattern}: ${word}`).toBe(vowels.length);
      }
    }
  });

  it("spells words that read by gender in the learner's form, and leaves them to the voice without one", () => {
    expect(spelled('מעולה! בנית את המילה', 'girl')).toEqual([{ text: 'בנית', ipa: 'ba.ˈnit' }]);
    expect(spelled('מעולה! בנית את המילה', 'boy')).toEqual([{ text: 'בנית', ipa: 'ba.ˈni.ta' }]);
    expect(spelled('מעולה! בנית את המילה')).toEqual([]);
    // The rest of the list still applies
    expect(spelled('הקשיבי ובחרי את האות ששמעת', 'girl').map((s) => s.ipa)).toEqual([
      'hak.ˈʃi.vi',
      'u.va.χa.ˈʁi',
      'ʃe.ʃa.ˈmat',
    ]);
  });

  it('has a girl and a boy form for every word that reads by gender', () => {
    for (const word of LISTENER_GENDERED_WORDS) {
      expect(LISTENER_GENDERED_PRONUNCIATIONS[word], word).toEqual({ girl: expect.any(String), boy: expect.any(String) });
    }
  });

  it('lists every pattern once', () => {
    const patterns = HEBREW_PRONUNCIATIONS.map((entry) => entry.pattern);
    expect(new Set(patterns).size).toBe(patterns.length);
  });
});
