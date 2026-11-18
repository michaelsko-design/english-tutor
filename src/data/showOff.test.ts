import { describe, expect, it } from 'vitest';
import { makeProfile } from '../test/fixtures';
import {
  applyShowOffReward,
  buildFirstWinSummaryHe,
  buildParentShareMessageHe,
  buildPlacementSummaryHe,
  SHOW_OFF_DIAMONDS,
} from './showOff';

describe('applyShowOffReward', () => {
  it('pays the diamonds once and marks the reward as paid', () => {
    const profile = makeProfile();
    const paid = applyShowOffReward(profile);
    expect(paid.stats.diamonds).toBe(profile.stats.diamonds + SHOW_OFF_DIAMONDS);
    expect(paid.hasEarnedShowOffReward).toBe(true);
    expect(applyShowOffReward(paid)).toBe(paid);
  });

  it('does not change the original profile', () => {
    const profile = makeProfile();
    applyShowOffReward(profile);
    expect(profile.hasEarnedShowOffReward).toBeUndefined();
  });
});

describe('buildFirstWinSummaryHe', () => {
  it('says a girl finished her first mission, with the streak', () => {
    const text = buildFirstWinSummaryHe({ name: 'נועה', gender: 'girl', streakDays: 1, isLesson: false });
    expect(text).toContain('נועה סיימה היום את המשימה הראשונה שלה');
    expect(text).toContain('יום 1 ברצף');
  });

  it('says a boy finished his first lesson in grades 1–2', () => {
    expect(buildFirstWinSummaryHe({ name: 'איתי', gender: 'boy', streakDays: 1, isLesson: true })).toContain(
      'איתי סיים היום את השיעור הראשון שלו'
    );
  });

  it('uses a fallback when the name is empty', () => {
    expect(buildFirstWinSummaryHe({ name: '  ', gender: 'boy', streakDays: 1, isLesson: false })).toMatch(/^הילד שלך סיים/);
  });
});

describe('buildPlacementSummaryHe', () => {
  it('names the level and what comes next', () => {
    const text = buildPlacementSummaryHe({ name: 'נועה', gender: 'girl', levelHe: 'כיתה ד׳', practiceGradeHe: 'כיתה ד׳', tierHe: 'מאתגר' });
    expect(text).toContain('נועה עשתה מבחן רמה');
    expect(text).toContain('הרמה: כיתה ד׳');
    expect(text).toContain('ממשיכים לתרגל: כיתה ד׳, מאתגר');
  });
});

describe('buildParentShareMessageHe', () => {
  it('adds the pairing code and link for a parent who is not paired yet', () => {
    const text = buildParentShareMessageHe('סיכום', { url: 'https://x.test/?parent=ABC123', code: 'ABC123' });
    expect(text).toMatch(/^סיכום\n\n/);
    expect(text).toContain('קוד ההורים: ABC123');
    expect(text.endsWith('https://x.test/?parent=ABC123')).toBe(true);
  });

  it('links a paired parent to the portal without a code', () => {
    const text = buildParentShareMessageHe('סיכום', { url: 'https://x.test/?parent', code: null });
    expect(text).not.toContain('קוד');
    expect(text.endsWith('https://x.test/?parent')).toBe(true);
  });
});
