import { describe, expect, it } from 'vitest';
import { CONTENT_PACK_IDS, CONTENT_PACKS, RELEASED_CONTENT_PACKS } from './registry';

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

  it('releases a pack only after the pack it follows, and each pack once', () => {
    const released = RELEASED_CONTENT_PACKS.map((r) => r.id);
    expect(new Set(released).size).toBe(released.length);
    released.forEach((id, index) => {
      const after = CONTENT_PACKS[id].after;
      if (after !== undefined) expect(released.slice(0, index), id).toContain(after);
    });
  });
});
