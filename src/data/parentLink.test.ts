import { describe, expect, it } from 'vitest';
import { buildWeeklyReport } from './progressReport';
import {
  PARENT_CODE_ALPHABET,
  PARENT_CODE_LENGTH,
  buildParentMessageHe,
  buildParentUrl,
  buildReportSnapshot,
  generateParentCode,
  getInviteExpiry,
  isInviteExpired,
  isParentCode,
  isParentRoute,
  maskParentEmail,
  normalizeParentCode,
  parentLinkId,
  parseParentParam,
  snapshotContentKey,
  snapshotToProfile,
} from './parentLink';
import { makeProfile } from '../test/fixtures';

const NOW = new Date('2026-03-04T10:00:00.000Z');

describe('parent code', () => {
  it('has the right length and only alphabet letters', () => {
    const code = generateParentCode();
    expect(code).toHaveLength(PARENT_CODE_LENGTH);
    expect([...code].every((ch) => PARENT_CODE_ALPHABET.includes(ch))).toBe(true);
    expect(isParentCode(code)).toBe(true);
  });

  it('skips random bytes that would favour some letters', () => {
    const limit = 256 - (256 % PARENT_CODE_ALPHABET.length);
    const bytes = [limit, 255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const code = generateParentCode(() => Uint8Array.from(bytes));
    expect(code).toBe([0, 1, 2, 3, 4, 5, 6, 7].map((i) => PARENT_CODE_ALPHABET[i]).join(''));
  });

  it('normalizes pasted codes', () => {
    expect(normalizeParentCode(' abcd-2345 ')).toBe('ABCD2345');
    expect(isParentCode('ABCD2345')).toBe(true);
    expect(isParentCode('ABCD234')).toBe(false);
    expect(isParentCode('ABCD234O')).toBe(false);
  });

  it('reads the code from the link, and tells the portal route apart', () => {
    expect(parseParentParam('?parent=abcd2345')).toBe('ABCD2345');
    expect(parseParentParam('?parent=bad')).toBeNull();
    expect(parseParentParam('?parent')).toBeNull();
    expect(parseParentParam('?invite=ABCD23')).toBeNull();
    expect(isParentRoute('?parent')).toBe(true);
    expect(isParentRoute('?parent=ABCD2345')).toBe(true);
    expect(isParentRoute('?invite=ABCD23')).toBe(false);
    expect(buildParentUrl('https://app.example/', 'ABCD2345')).toBe('https://app.example/?parent=ABCD2345');
  });

  it('expires after two days', () => {
    const expiresAtMs = getInviteExpiry(NOW);
    expect(new Date(expiresAtMs).toISOString()).toBe('2026-03-06T10:00:00.000Z');
    expect(isInviteExpired({ expiresAtMs }, new Date('2026-03-06T09:59:59.000Z'))).toBe(false);
    expect(isInviteExpired({ expiresAtMs }, new Date('2026-03-06T10:00:00.000Z'))).toBe(true);
  });

  it('hides most of the parent email', () => {
    expect(maskParentEmail('maya.cohen@gmail.com')).toBe('m***@gmail.com');
    expect(maskParentEmail(null)).toBe('');
    expect(maskParentEmail('no-at-sign')).toBe('');
  });

  it('writes the message in the sender\'s gender and falls back without a name', () => {
    expect(buildParentMessageHe('נועה', 'girl', 'ABCD2345', 'u')).toContain('נועה מבקשת');
    expect(buildParentMessageHe('דני', 'boy', 'ABCD2345', 'u')).toContain('דני מבקש ');
    expect(buildParentMessageHe(' ', 'girl', 'ABCD2345', 'u')).toContain('הילדה שלך מבקשת');
  });

  it('builds the link id from both uids', () => {
    expect(parentLinkId('p1', 'c1')).toBe('p1_c1');
  });
});

describe('report snapshot', () => {
  const profile = makeProfile({
    name: 'נועה',
    gender: 'girl',
    age: 9,
    schoolName: 'בית ספר',
    missionProgress: { 'g1-u1-m1': 3 },
    activityLog: [
      { dateStr: '2026-03-03', sessions: 2, voiceWords: 1, threeStarSessions: 1, xpEarned: 50, starsGained: 3, missionStars: { 'g1-u1-m1': 3 }, firstCompletedIds: ['g1-u1-m1'] },
    ],
  } as never);

  it('keeps only what the report reads', () => {
    const snapshot = buildReportSnapshot(profile, NOW);
    expect(Object.keys(snapshot).sort()).toEqual(
      ['activityLog', 'gender', 'gradeId', 'isShabbatObserver', 'missionProgress', 'name', 'preferredTier', 'stats', 'updatedAt']
    );
    expect(Object.keys(snapshot.stats).every((key) => !['diamonds', 'xp'].includes(key))).toBe(true);
    expect(JSON.stringify(snapshot)).not.toContain('בית ספר');
    expect(snapshot.updatedAt).toBe(NOW.toISOString());
  });

  it('has no undefined values, which Firestore rejects', () => {
    const snapshot = buildReportSnapshot(makeProfile({ stats: { ...makeProfile().stats, streakLastDateStr: undefined } }), NOW);
    expect(JSON.parse(JSON.stringify(snapshot))).toEqual(snapshot);
  });

  it('gives the same weekly report as the full profile', () => {
    const fromSnapshot = snapshotToProfile(buildReportSnapshot(profile, NOW));
    expect(buildWeeklyReport(fromSnapshot, '2026-03-01', '2026-03-04')).toEqual(
      buildWeeklyReport(profile, '2026-03-01', '2026-03-04')
    );
  });

  it('ignores the publish time when comparing content', () => {
    const first = buildReportSnapshot(profile, NOW);
    const later = buildReportSnapshot(profile, new Date('2026-03-05T10:00:00.000Z'));
    expect(snapshotContentKey(first)).toBe(snapshotContentKey(later));
    const changed = buildReportSnapshot({ ...profile, missionProgress: {} }, NOW);
    expect(snapshotContentKey(changed)).not.toBe(snapshotContentKey(first));
  });
});
