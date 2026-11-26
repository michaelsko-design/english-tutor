import { describe, expect, it } from 'vitest';
import { isProPlanVisibleFor, parsePreviewUids } from './proTier';

const HIDDEN = { isAlwaysVisible: false };

describe('isProPlanVisibleFor (one-parent plan preview while the plans are hidden)', () => {
  it('shows the plans to a parent on the preview list', () => {
    expect(isProPlanVisibleFor('parentA', { ...HIDDEN, previewUids: ['parentA'] })).toBe(true);
  });

  it('hides them from everyone else, and from everyone when the list is empty', () => {
    expect(isProPlanVisibleFor('parentB', { ...HIDDEN, previewUids: ['parentA'] })).toBe(false);
    expect(isProPlanVisibleFor('parentA', { ...HIDDEN, previewUids: [] })).toBe(false);
    expect(isProPlanVisibleFor('', { ...HIDDEN, previewUids: [''] })).toBe(false);
    expect(isProPlanVisibleFor(null, { ...HIDDEN, previewUids: ['parentA'] })).toBe(false);
  });

  it('shows them to every parent where the plans are visible anyway (dev, staging)', () => {
    expect(isProPlanVisibleFor('parentB', { isAlwaysVisible: true, previewUids: [] })).toBe(true);
  });
});

describe('parsePreviewUids', () => {
  it('reads a comma-separated list, trimmed, empty entries dropped', () => {
    expect(parsePreviewUids(' a1 , b2,,')).toEqual(['a1', 'b2']);
    expect(parsePreviewUids(undefined)).toEqual([]);
    expect(parsePreviewUids('')).toEqual([]);
  });
});
