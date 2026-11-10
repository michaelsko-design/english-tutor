import { describe, expect, it } from 'vitest';
import {
  ALL_GRADES,
  CONTENT_PACK_IDS,
  CONTENT_PACKS,
  ENRICHMENT_WORDS_PER_MISSION,
  packGrades,
  packWordsPerMission,
  RELEASED_CONTENT_PACKS,
} from './registry';
import type { ContentPack, ContentPackId } from './types';

const LEGACY_PACK_IDS: readonly ContentPackId[] = ['season2-1', 'season2-2', 'holidays-autumn', 'holidays-spring'];

describe('packWordsPerMission', () => {
  it('keeps 4 new words per mission in every grade for Season 2 and the holiday packs', () => {
    LEGACY_PACK_IDS.forEach((id) => {
      [1, 3, 4, 8, 12].forEach((grade) => expect(packWordsPerMission(CONTENT_PACKS[id], grade), `${id} g${grade}`).toBe(4));
    });
  });

  it('gives core-3 the enrichment word count', () => {
    expect(CONTENT_PACKS['core-3'].wordsPerMission).toBe(ENRICHMENT_WORDS_PER_MISSION);
  });

  it('gives an enrichment core pack 6 words in grades 1-3 and 8 in grades 4-12', () => {
    const corePack: ContentPack = { ...CONTENT_PACKS['season2-2'], wordsPerMission: ENRICHMENT_WORDS_PER_MISSION };
    expect([1, 2, 3].map((grade) => packWordsPerMission(corePack, grade))).toEqual([6, 6, 6]);
    expect([4, 7, 12].map((grade) => packWordsPerMission(corePack, grade))).toEqual([8, 8, 8]);
  });
});

describe('content pack registry', () => {
  it('gives every pack its own unit number in the mission ids', () => {
    const numbers = CONTENT_PACK_IDS.map((id) => CONTENT_PACKS[id].idUnitNumber);
    expect(new Set(numbers).size).toBe(numbers.length);
    CONTENT_PACK_IDS.forEach((id) => expect(CONTENT_PACKS[id].id).toBe(id));
  });

  it('chains only sequence (core) packs, each after a known core pack', () => {
    CONTENT_PACK_IDS.forEach((id) => {
      const { after, kind, unlock } = CONTENT_PACKS[id];
      expect(unlock === 'sequence', id).toBe(kind === 'core');
      if (after === undefined) return;
      expect(CONTENT_PACKS[after].kind, id).toBe('core');
      expect(CONTENT_PACK_IDS.indexOf(after), id).toBeLessThan(CONTENT_PACK_IDS.indexOf(id));
    });
  });

  it('lists each pack’s grades once, in order, within grades 1-12', () => {
    CONTENT_PACK_IDS.forEach((id) => {
      const grades = packGrades(CONTENT_PACKS[id]);
      expect(grades.length, id).toBeGreaterThan(0);
      expect(grades.every((grade) => ALL_GRADES.includes(grade)), id).toBe(true);
      expect([...grades].sort((a, b) => a - b), id).toEqual([...new Set(grades)]);
    });
  });

  it('releases a pack only after the pack it follows, and each pack once', () => {
    const released = RELEASED_CONTENT_PACKS.map((r) => r.id);
    expect(new Set(released).size).toBe(released.length);
    released.forEach((id, index) => {
      const after = CONTENT_PACKS[id].after;
      if (after !== undefined) expect(released.slice(0, index), id).toContain(after);
    });
  });
});
