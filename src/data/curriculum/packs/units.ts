import { CONTENT_PACKS } from './registry';
import type { ContentPackId } from './types';

/** The id and reward unit numbers of a pack's unit, for a unit spec. */
export function packUnitNumbers(packId: ContentPackId): { idUnitNumber: number; xpUnitNumber: number } {
  const pack = CONTENT_PACKS[packId];
  return { idUnitNumber: pack.idUnitNumber, xpUnitNumber: pack.xpUnitNumber };
}
