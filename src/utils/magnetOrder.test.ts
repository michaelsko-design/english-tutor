import { describe, expect, it } from 'vitest';
import {
  addMagnet,
  describeMagnetChange,
  fromMagnetId,
  moveMagnet,
  removeMagnet,
  toggleMagnet,
  toMagnetId,
} from './magnetOrder';

describe('addMagnet', () => {
  it('appends when no position is given', () => {
    expect(addMagnet([2, 0], 1)).toEqual([2, 0, 1]);
  });

  it('inserts at the given position', () => {
    expect(addMagnet([2, 0, 3], 1, 0)).toEqual([1, 2, 0, 3]);
    expect(addMagnet([2, 0, 3], 1, 2)).toEqual([2, 0, 1, 3]);
  });

  it('clamps the position to the order', () => {
    expect(addMagnet([2], 1, 9)).toEqual([2, 1]);
    expect(addMagnet([2], 1, -3)).toEqual([1, 2]);
  });

  it('leaves an order that already has the magnet unchanged', () => {
    const order = [2, 1];
    expect(addMagnet(order, 1, 0)).toBe(order);
  });

  it('does not change the original array', () => {
    const order = [0, 1];
    addMagnet(order, 2, 1);
    expect(order).toEqual([0, 1]);
  });
});

describe('removeMagnet', () => {
  it('removes the magnet', () => {
    expect(removeMagnet([3, 1, 2], 1)).toEqual([3, 2]);
  });

  it('leaves an order without the magnet unchanged', () => {
    expect(removeMagnet([3, 2], 1)).toEqual([3, 2]);
  });
});

describe('moveMagnet', () => {
  it('moves a magnet forward and back', () => {
    expect(moveMagnet([0, 1, 2, 3], 0, 2)).toEqual([1, 2, 0, 3]);
    expect(moveMagnet([0, 1, 2, 3], 3, 0)).toEqual([3, 0, 1, 2]);
  });

  it('clamps the position', () => {
    expect(moveMagnet([0, 1, 2], 0, 9)).toEqual([1, 2, 0]);
  });

  it('leaves the order unchanged for a magnet that is not in it', () => {
    const order = [0, 1];
    expect(moveMagnet(order, 5, 0)).toBe(order);
  });
});

describe('toggleMagnet', () => {
  it('appends a magnet from the bank', () => {
    expect(toggleMagnet([1], 0)).toEqual({ order: [1, 0], change: { kind: 'add', idx: 0 } });
  });

  it('takes a placed magnet back to the bank', () => {
    expect(toggleMagnet([1, 0], 1)).toEqual({ order: [0], change: { kind: 'remove', idx: 1 } });
  });
});

describe('describeMagnetChange', () => {
  it('reports an added magnet', () => {
    expect(describeMagnetChange([0], [1, 0], 1)).toEqual({ kind: 'add', idx: 1 });
  });

  it('reports a removed magnet', () => {
    expect(describeMagnetChange([0, 1], [0], 1)).toEqual({ kind: 'remove', idx: 1 });
  });

  it('reports a moved magnet', () => {
    expect(describeMagnetChange([0, 1], [1, 0], 1)).toEqual({ kind: 'move', idx: 1 });
  });

  it('reports nothing when the order is the same', () => {
    expect(describeMagnetChange([0, 1], [0, 1], 1)).toBeNull();
    expect(describeMagnetChange([0], [0], 1)).toBeNull();
  });
});

describe('magnet ids', () => {
  it('round-trips a bank index', () => {
    expect(fromMagnetId(toMagnetId(7))).toBe(7);
  });

  it('returns null for other ids', () => {
    expect(fromMagnetId('magnet-tray')).toBeNull();
    expect(fromMagnetId('word-3')).toBeNull();
    expect(fromMagnetId(3)).toBeNull();
  });
});
