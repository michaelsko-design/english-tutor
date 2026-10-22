import { CONTENT_PACKS } from './registry';
import type { ContentPackId } from './types';

/** The id and reward unit numbers of a pack's first (0) or second (1) unit, for a unit spec. */
export function packUnitNumbers(
  packId: ContentPackId,
  index: 0 | 1
): { idUnitNumber: number; xpUnitNumber: number } {
  const pack = CONTENT_PACKS[packId];
  return { idUnitNumber: pack.idUnitNumbers[index], xpUnitNumber: pack.xpUnitNumbers[index] };
}
