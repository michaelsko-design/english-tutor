import { describe, expect, it } from 'vitest';
import type { CurriculumUnit, MissionNode } from './curriculum/types';
import { CONTENT_PACKS, RELEASED_CONTENT_PACKS } from './curriculum/packs/registry';
import { ASK_PARENT_LABEL_HE, PRO_SPOKEN_HE } from './proAsk';
import { isHebrewSpeakable } from '../services/tts/ttsText';
import { getNewPackCopy, getNewPackOffer, isPackNew, NEW_PACK_DAYS, type PackReleaseState } from './contentPacks';

const RELEASED: PackReleaseState = { released: [{ id: 'holidays', releasedAt: '2026-12-01', access: 'free' }], isPreview: false };
const NOTHING_RELEASED: PackReleaseState = { released: [], isPreview: false };
const PREVIEW: PackReleaseState = { released: [], isPreview: true };

const unit = (idUnit: number, packId?: string): CurriculumUnit => ({
  unitNumber: idUnit,
  titleEn: '',
  titleHe: '',
  subtitleHe: '',
  badgeEmoji: '🕎',
  missions: [{ id: `g3-u${idUnit}-m1` } as MissionNode],
  ...(packId ? { packId } : {}),
});
const UNITS = [unit(1), unit(2), unit(31, 'holidays'), unit(32, 'holidays')];

describe('isPackNew', () => {
  it('is new from the release day for NEW_PACK_DAYS days', () => {
    expect(isPackNew('holidays', '2026-12-01', RELEASED)).toBe(true);
    expect(isPackNew('holidays', '2026-12-14', RELEASED)).toBe(true);
    expect(isPackNew('holidays', '2026-12-15', RELEASED)).toBe(false);
    expect(NEW_PACK_DAYS).toBe(14);
  });

  it('is never new before the release, for an unreleased pack or for a grade unit', () => {
    expect(isPackNew('holidays', '2026-11-30', RELEASED)).toBe(false);
    expect(isPackNew('core-plus', '2026-12-01', RELEASED)).toBe(false);
    expect(isPackNew(undefined, '2026-12-01', RELEASED)).toBe(false);
  });

  it('counts every pack as new in the preview', () => {
    expect(isPackNew('core-plus', '2026-01-01', PREVIEW)).toBe(true);
    expect(isPackNew(undefined, '2026-01-01', PREVIEW)).toBe(false);
  });
});

describe('getNewPackOffer', () => {
  it("offers the new pack's first unit with its unit count", () => {
    const offer = getNewPackOffer(UNITS, '2026-12-03', [], RELEASED);
    expect(offer).toMatchObject({ unitCount: 2, firstMissionId: 'g3-u31-m1', badgeEmoji: '🕎' });
    expect(offer?.pack.id).toBe('holidays');
  });

  it('offers nothing once seen, after the window, or with no pack units', () => {
    expect(getNewPackOffer(UNITS, '2026-12-03', ['holidays'], RELEASED)).toBeNull();
    expect(getNewPackOffer(UNITS, '2027-01-03', [], RELEASED)).toBeNull();
    expect(getNewPackOffer(UNITS.slice(0, 2), '2026-12-03', [], RELEASED)).toBeNull();
    expect(getNewPackOffer(UNITS, '2026-12-03', [], NOTHING_RELEASED)).toBeNull();
  });
});

describe('getNewPackCopy', () => {
  it('addresses the learner by gender and reads title and body as one clip', () => {
    const girl = getNewPackCopy(CONTENT_PACKS.holidays, 2, 'girl');
    const boy = getNewPackCopy(CONTENT_PACKS.holidays, 2, 'boy');
    expect(girl.titleHe).toBe('חדש! חגים ועונות');
    expect(girl.buttonHe).toBe('בואי לראות');
    expect(boy.buttonHe).toBe('בוא לראות');
    expect(girl.spokenHe).toBe(`${girl.titleHe}. ${girl.bodyHe}`);
  });

  it('asks a parent for a Pro pack the learner cannot play yet, and says "Pro" in Hebrew letters', () => {
    const copy = getNewPackCopy(CONTENT_PACKS.holidays, 2, 'girl', true);
    expect(copy.buttonHe).toBe(ASK_PARENT_LABEL_HE);
    expect(copy.bodyHe).toContain('Pro');
    expect(copy.bodyHe).toContain('אפשר לבקש מהורה');
    expect(copy.spokenHe).not.toMatch(/[A-Za-z]/);
    expect(copy.spokenHe).toContain(PRO_SPOKEN_HE);
    expect(isHebrewSpeakable(copy.spokenHe)).toBe(true);
  });
});

describe('released packs', () => {
  it('ships no pack yet (a release updates this test)', () => {
    expect(RELEASED_CONTENT_PACKS).toEqual([]);
  });
});
