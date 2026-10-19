import { describe, expect, it } from 'vitest';
import {
  dropLetter,
  fromSlotId,
  isEverySlotFilled,
  placeLetter,
  spellSlots,
  takeBackLetter,
  toSlotId,
  toSlots,
} from './letterSlots';

describe('toSlots', () => {
  it('pads an empty or short list with empty slots', () => {
    expect(toSlots([], 3)).toEqual([null, null, null]);
    expect(toSlots([2], 3)).toEqual([2, null, null]);
  });

  it('drops entries past the slot count', () => {
    expect(toSlots([0, 1, 2], 2)).toEqual([0, 1]);
  });
});

describe('placeLetter (tap)', () => {
  it('fills the first open slot, even before a later letter', () => {
    expect(placeLetter([null, 3, null], 3, 1)).toEqual([1, 3, null]);
    expect(placeLetter([0, null, 2], 3, 1)).toEqual([0, 1, 2]);
  });

  it('leaves the slots unchanged when the letter is placed or every slot is full', () => {
    expect(placeLetter([1, null], 2, 1)).toEqual([1, null]);
    expect(placeLetter([0, 1], 2, 2)).toEqual([0, 1]);
  });
});

describe('takeBackLetter', () => {
  it('empties only that slot, the other letters stay where they are', () => {
    expect(takeBackLetter([0, 1, 2], 3, 1)).toEqual([0, null, 2]);
  });

  it('leaves the slots unchanged for a letter in the bank', () => {
    expect(takeBackLetter([0, null], 2, 5)).toEqual([0, null]);
  });
});

describe('dropLetter', () => {
  it('places a bank letter in any open slot', () => {
    expect(dropLetter([], 4, 2, 3)).toEqual([null, null, null, 2]);
  });

  it('sends the letter in a filled slot back to the bank when a bank letter lands on it', () => {
    expect(dropLetter([0, null], 2, 1, 0)).toEqual([1, null]);
  });

  it('moves a placed letter to an open slot', () => {
    expect(dropLetter([0, null, null], 3, 0, 2)).toEqual([null, null, 0]);
  });

  it('swaps two placed letters', () => {
    expect(dropLetter([0, 1, null], 3, 0, 1)).toEqual([1, 0, null]);
  });

  it('leaves the slots unchanged for a drop on its own slot or outside the word', () => {
    expect(dropLetter([0, 1], 2, 0, 0)).toEqual([0, 1]);
    expect(dropLetter([0, null], 2, 1, 5)).toEqual([0, null]);
    expect(dropLetter([0, null], 2, 1, -1)).toEqual([0, null]);
  });

  it('does not change the original array', () => {
    const slots = [0, null];
    dropLetter(slots, 2, 1, 1);
    expect(slots).toEqual([0, null]);
  });
});

describe('isEverySlotFilled', () => {
  it('is true only when every slot has a letter', () => {
    expect(isEverySlotFilled([0, 1], 2)).toBe(true);
    expect(isEverySlotFilled([0, null], 2)).toBe(false);
    expect(isEverySlotFilled([0], 2)).toBe(false);
  });
});

describe('spellSlots', () => {
  it('reads the placed letters in slot order', () => {
    expect(spellSlots([2, 0, 1], ['T', 'A', 'C'])).toBe('CTA');
  });

  it('skips open slots', () => {
    expect(spellSlots([null, 0], ['A'])).toBe('A');
  });
});

describe('slot ids', () => {
  it('round-trips a slot position', () => {
    expect(fromSlotId(toSlotId(4))).toBe(4);
  });

  it('returns null for other ids', () => {
    expect(fromSlotId('magnet-4')).toBeNull();
    expect(fromSlotId(4)).toBeNull();
  });
});
