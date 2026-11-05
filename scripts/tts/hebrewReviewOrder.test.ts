import { describe, expect, it } from 'vitest';
import { collectCorpus } from './corpus';
import { buildReviewPlaces } from './hebrewReviewOrder';
import { HEBREW_VOICE } from '../../src/services/tts/ttsText';

describe('hebrew review order', () => {
  const places = buildReviewPlaces();
  const phrases = collectCorpus(HEBREW_VOICE);

  it('places most corpus lines (a few shared ones are filed under other)', () => {
    const unplaced = phrases.filter((phrase) => !places.has(phrase.key));
    expect(unplaced.length / phrases.length).toBeLessThan(0.05);
  });

  it('walks general lines, then core, the Pro tail and the packs', () => {
    const rankOf = (group: string) => [...places.values()].filter((place) => place.group === group).map((place) => place.rank);
    expect(Math.max(...rankOf('general'))).toBeLessThan(Math.min(...rankOf('core')));
    expect(Math.max(...rankOf('core'))).toBeLessThan(Math.min(...rankOf('pro-tail')));
    expect(Math.max(...rankOf('pro-tail'))).toBeLessThan(Math.min(...rankOf('packs')));
  });
});
