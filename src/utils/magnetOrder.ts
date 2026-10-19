// Order of the magnets (word chips or letter tiles) placed in a magnet drill.
// An order lists bank indices in the order they were placed; every helper returns a new array.

export type MagnetChangeKind = 'add' | 'remove' | 'move';

export interface MagnetChange {
  kind: MagnetChangeKind;
  /** The bank index of the magnet that was added, removed or moved */
  idx: number;
}

const MAGNET_ID_PREFIX = 'magnet-';

/** The drag id of a magnet; the same in the bank and the tray, so a chip keeps its identity while it moves. */
export const toMagnetId = (idx: number): string => `${MAGNET_ID_PREFIX}${idx}`;

/** The bank index of a magnet drag id, or null for any other id (the tray or the bank). */
export const fromMagnetId = (id: string | number): number | null => {
  if (typeof id !== 'string' || !id.startsWith(MAGNET_ID_PREFIX)) return null;
  const idx = Number(id.slice(MAGNET_ID_PREFIX.length));
  return Number.isInteger(idx) && idx >= 0 ? idx : null;
};

const clampPosition = (position: number, length: number): number => Math.min(Math.max(position, 0), length);

/** Places a magnet at a position (the end when omitted). An order that already has it is returned as is. */
export const addMagnet = (order: readonly number[], idx: number, position: number = order.length): number[] => {
  if (order.includes(idx)) return order as number[];
  const at = clampPosition(position, order.length);
  return [...order.slice(0, at), idx, ...order.slice(at)];
};

export const removeMagnet = (order: readonly number[], idx: number): number[] => order.filter((i) => i !== idx);

/** Moves a placed magnet to a position in the order. An order without it is returned as is. */
export const moveMagnet = (order: readonly number[], idx: number, position: number): number[] => {
  if (!order.includes(idx)) return order as number[];
  const rest = removeMagnet(order, idx);
  const at = clampPosition(position, rest.length);
  return [...rest.slice(0, at), idx, ...rest.slice(at)];
};

/** A tap: a magnet in the bank goes to the end, a placed one goes back to the bank. */
export const toggleMagnet = (order: readonly number[], idx: number): { order: number[]; change: MagnetChange } =>
  order.includes(idx)
    ? { order: removeMagnet(order, idx), change: { kind: 'remove', idx } }
    : { order: addMagnet(order, idx), change: { kind: 'add', idx } };

/** What happened to a magnet between two orders, or null when the order didn't change. */
export const describeMagnetChange = (
  before: readonly number[],
  after: readonly number[],
  idx: number
): MagnetChange | null => {
  const wasPlaced = before.includes(idx);
  const isPlaced = after.includes(idx);
  if (!wasPlaced && isPlaced) return { kind: 'add', idx };
  if (wasPlaced && !isPlaced) return { kind: 'remove', idx };
  const isSameOrder = before.length === after.length && before.every((value, i) => value === after[i]);
  return isPlaced && !isSameOrder ? { kind: 'move', idx } : null;
};
