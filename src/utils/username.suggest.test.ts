import { describe, expect, it } from 'vitest';
import { suggestUsername, toUsernameSlug } from './username';

const noDigits = () => 0;

describe('suggestUsername', () => {
  it('transliterates a Hebrew name into an English username with two digits', () => {
    const suggestion = suggestUsername('נועה', () => 0.42);
    expect(suggestion).toBe('noa42');
  });

  it('keeps an English name, lowercased', () => {
    expect(suggestUsername('Dani', () => 0.07)).toBe('dani07');
  });

  it('drops spaces, punctuation and niqqud', () => {
    expect(suggestUsername('  מיה־לי  ', noDigits)).toMatch(/^[a-z0-9]+$/);
    expect(suggestUsername('Ben-Ami!', noDigits)).toBe('benami00');
  });

  it('uses a friendly fallback when the name has nothing to transliterate', () => {
    expect(suggestUsername('', () => 0.5)).toBe('kid50');
    expect(suggestUsername('😊', () => 0.5)).toBe('kid50');
  });

  it('shortens a long name so the username stays easy to type', () => {
    const suggestion = suggestUsername('אלכסנדרה־שרלוטה', noDigits);
    expect(suggestion.length).toBeLessThanOrEqual(10);
  });

  it('always passes the username validation (English letters and digits only)', () => {
    for (const name of ['נועה', 'עידו', 'Ben', 'שירה כהן', '', 'יוסף']) {
      const suggestion = suggestUsername(name, () => 0.99);
      expect(toUsernameSlug(suggestion)).toBe(suggestion);
      expect(suggestion.length).toBeGreaterThanOrEqual(3);
    }
  });
});
