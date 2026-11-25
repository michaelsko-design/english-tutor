import { describe, expect, it } from 'vitest';
import { overlayInbox, parseInboxItems, parseState, type InboxItem, type ReviewState } from './reviewMarks';

const FP = '100-0123456789abcdef';
const item = (over: Partial<InboxItem> = {}): InboxItem => ({
  key: 'abc1',
  fp: FP,
  markedAt: '2026-11-25T10:00:00.000Z',
  entry: { status: 'good', fp: FP, at: '2026-11-25', markedAt: '2026-11-25T10:00:00.000Z' },
  ...over,
});

describe('parseInboxItems', () => {
  it('accepts a mark and a clear', () => {
    expect(parseInboxItems([item(), item({ key: 'abc2', entry: null })])).toHaveLength(2);
  });

  it.each([
    ['not a list', {}],
    ['a bad key', [item({ key: '../x' })]],
    ['a bad fingerprint', [item({ fp: 'nope' })]],
    ['a bad time', [item({ markedAt: 'yesterday' })]],
    ['a bad status', [item({ entry: { status: 'meh' as never, fp: FP, at: '2026-11-25' } })]],
    ['a bad reason', [item({ entry: { status: 'regenerate', reasons: ['x' as never], fp: FP, at: '2026-11-25' } })]],
    ['a long note', [item({ entry: { status: 'regenerate', note: 'a'.repeat(301), fp: FP, at: '2026-11-25' } })]],
    ['an entry for other audio', [item({ entry: { status: 'good', fp: '9-ffffffffffffffff', at: '2026-11-25' } })]],
  ])('rejects %s', (_label, value) => {
    expect(() => parseInboxItems(value)).toThrow();
  });

  it('drops fields it does not know', () => {
    const [parsed] = parseInboxItems([{ ...item(), extra: 1 }]);
    expect(parsed).not.toHaveProperty('extra');
  });
});

describe('parseState', () => {
  it('reads the marks file format, with or without markedAt', () => {
    const state: ReviewState = { abc1: { status: 'good', fp: FP, at: '2026-10-30' } };
    expect(parseState(state)).toEqual(state);
  });

  it('rejects a list', () => {
    expect(() => parseState([])).toThrow();
  });
});

describe('overlayInbox', () => {
  const older: ReviewState = { abc1: { status: 'regenerate', fp: FP, at: '2026-10-30' } };

  it('shows a newer phone mark over the PC mark without changing the input', () => {
    expect(overlayInbox(older, [item()]).abc1?.status).toBe('good');
    expect(older.abc1?.status).toBe('regenerate');
  });

  it('keeps a PC mark made after the phone mark', () => {
    const newer: ReviewState = { abc1: { status: 'regenerate', fp: FP, at: '2026-11-25', markedAt: '2026-11-25T11:00:00.000Z' } };
    expect(overlayInbox(newer, [item()]).abc1?.status).toBe('regenerate');
  });

  it('removes a mark on a newer clear', () => {
    expect(overlayInbox(older, [item({ entry: null })])).toEqual({});
  });
});
