import { describe, expect, it } from 'vitest';
import { voiceForListener } from './hebrewListener';
import { toSpeakableText } from './ttsText';

describe('voiceForListener', () => {
  it("says a boy/girl pair in the learner's form", () => {
    expect(voiceForListener('אני משחק/ת בקוביות.', 'girl')).toBe('אני משחקת בקוביות.');
    expect(voiceForListener('אני משחק/ת בקוביות.', 'boy')).toBe('אני משחק בקוביות.');
  });

  it('tags a line whose words read by gender, after resolving its pairs', () => {
    expect(voiceForListener('מעולה! בנית את המילה cat', 'boy')).toBe('[to:boy] מעולה! בנית את המילה cat');
  });

  it('leaves a line alone without a gender, or with nothing to resolve', () => {
    expect(voiceForListener('אני משחק/ת בקוביות.', null)).toBe('אני משחק/ת בקוביות.');
    expect(voiceForListener('שאלת כן/לא מתחילה בפועל', 'girl')).toBe('שאלת כן/לא מתחילה בפועל');
  });
});

describe('the 🔊 in a Hebrew instruction', () => {
  it('is said as the speaker button, and dropped from English', () => {
    expect(toSpeakableText('לחצי על 🔊 כדי לשמוע שוב')).toBe('לחצי על כפתור הרמקול כדי לשמוע שוב');
    expect(toSpeakableText('Tap 🔊 to listen')).toBe('Tap  to listen');
    expect(toSpeakableText('מעולה! 🧲')).toBe('מעולה!');
  });
});
