import { describe, expect, it } from 'vitest';
import {
  FRIEND_CODE_ALPHABET,
  FRIEND_CODE_LENGTH,
  FRIEND_REACTIONS,
  FriendshipDoc,
  MAX_DISPLAY_NAME_LENGTH,
  MAX_FRIENDS,
  MAX_OUTGOING_REQUESTS,
  buildInviteUrl,
  buildPublicProfile,
  checkFriendRequest,
  classifyFriendships,
  generateFriendCode,
  getPairId,
  isFriendCode,
  isFriendsHubEnabled,
  setFriendsHubEnabled,
  withFriendCode,
  isPresetReaction,
  isSamePublicProfile,
  normalizeFriendQuery,
  parseInviteParam,
  toDisplayName,
} from './friends';
import { LearnerProfile } from '../types/learner';
import { normalizeIdentifierToEmail, toUsernameSlug, usernameFromEmail } from '../utils/username';

const ME = 'uid-me';

const baseProfile: LearnerProfile = {
  isOnboarded: true,
  name: 'Noa',
  age: 10,
  gender: 'girl',
  gradeId: 'grade-5',
  preferredTier: 'challenger',
  themeId: 'cozy-studio',
  stats: {
    xp: 400,
    level: 3,
    stars: 7,
    maxPossibleStars: 36,
    diamonds: 10,
    streakDays: 4,
    shabbatShieldActive: true,
    wordsMastered: 0,
    missionsCompleted: 9,
  },
  missionProgress: { 'g5-u1-m1': 3, 'g5-u1-m2': 2, 'g5-u1-m3': 0, 'g5-u2-m1': 2 },
  unlockedRewardIds: [],
  claimedDailyQuestIds: [],
  dailyCounters: {
    dateStr: '2026-10-17',
    missionsCompletedToday: 0,
    voiceWordsPracticedToday: 0,
    threeStarMissionsToday: 0,
  },
  createdAt: '2026-01-01T00:00:00.000Z',
};

function makeFriendship(overrides: Partial<FriendshipDoc> & { other: string; fromMe: boolean }): FriendshipDoc {
  const { other, fromMe, ...rest } = overrides;
  const requesterUid = fromMe ? ME : other;
  return {
    id: getPairId(ME, other),
    uids: fromMe ? [ME, other] : [other, ME],
    requesterUid,
    requesterName: fromMe ? 'Noa' : `Name of ${other}`,
    requesterAvatar: '🐱',
    addresseeName: fromMe ? `Name of ${other}` : 'Noa',
    addresseeAvatar: '🐼',
    status: 'pending',
    createdAt: '2026-10-17T08:00:00.000Z',
    ...rest,
  };
}

describe('friend codes', () => {
  it('generates codes of the right length from the unambiguous alphabet', () => {
    let seed = 0;
    const random = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    for (let i = 0; i < 50; i++) {
      const code = generateFriendCode(random);
      expect(code).toHaveLength(FRIEND_CODE_LENGTH);
      expect([...code].every((ch) => FRIEND_CODE_ALPHABET.includes(ch))).toBe(true);
      expect(isFriendCode(code)).toBe(true);
    }
  });

  it('leaves out letters and digits that are easy to mix up', () => {
    for (const ch of ['0', 'O', '1', 'I', 'L']) expect(FRIEND_CODE_ALPHABET).not.toContain(ch);
  });

  it('accepts a typed code in lowercase or with spaces and dashes', () => {
    expect(isFriendCode('abc-23x')).toBe(true);
    expect(isFriendCode('ab-c2 3x')).toBe(true);
    expect(isFriendCode('ABC10X')).toBe(false);
    expect(isFriendCode('ABC2')).toBe(false);
  });
});

describe('normalizeFriendQuery', () => {
  it('reads a friend code', () => {
    expect(normalizeFriendQuery('k7m-p2q').code).toBe('K7MP2Q');
  });

  it('reads a username that cannot be a code', () => {
    expect(normalizeFriendQuery('Dana12')).toEqual({ usernameSlug: 'dana12' });
    expect(normalizeFriendQuery('@ido.k')).toEqual({ usernameSlug: 'ido.k' });
  });

  it('tries both when a username looks like a code', () => {
    expect(normalizeFriendQuery('dannyy')).toEqual({ code: 'DANNYY', usernameSlug: 'dannyy' });
  });

  it('returns nothing for empty or too-short input', () => {
    expect(normalizeFriendQuery('  ')).toEqual({});
    expect(normalizeFriendQuery('a')).toEqual({});
  });
});

describe('usernames', () => {
  it('uses the same slug as the sign-in email', () => {
    expect(toUsernameSlug(' Noa 12! ')).toBe('noa12');
    expect(normalizeIdentifierToEmail('Noa 12!')).toBe('noa12@peachnote.tutor.local');
    expect(normalizeIdentifierToEmail('Mom@Gmail.com')).toBe('mom@gmail.com');
  });

  it('reads the username back only from a username account email', () => {
    expect(usernameFromEmail('noa12@peachnote.tutor.local')).toBe('noa12');
    expect(usernameFromEmail('noa@gmail.com')).toBeNull();
    expect(usernameFromEmail(null)).toBeNull();
  });
});

describe('getPairId', () => {
  it('gives the same id from either side', () => {
    expect(getPairId('b', 'a')).toBe('a_b');
    expect(getPairId('a', 'b')).toBe('a_b');
  });
});

describe('buildPublicProfile', () => {
  it('shows only the display name, avatar and progress', () => {
    expect(buildPublicProfile(baseProfile, '🐱')).toEqual({
      displayName: 'Noa',
      avatarEmoji: '🐱',
      level: 3,
      streakDays: 4,
      stars: 7,
      missionsCompleted: 3,
    });
  });

  it('trims long or empty names', () => {
    expect(toDisplayName('  ')).toBe('Learner');
    expect(toDisplayName('a'.repeat(40))).toHaveLength(MAX_DISPLAY_NAME_LENGTH);
    expect(toDisplayName(' Noa   Levi ')).toBe('Noa Levi');
  });

  it('compares summaries so unchanged progress is not written again', () => {
    const summary = buildPublicProfile(baseProfile, '🐱');
    expect(isSamePublicProfile({ ...summary }, summary)).toBe(true);
    expect(isSamePublicProfile({ ...summary, stars: 8 }, summary)).toBe(false);
    expect(isSamePublicProfile(null, summary)).toBe(false);
  });
});

describe('classifyFriendships', () => {
  it('splits friends, incoming and outgoing requests', () => {
    const docs = [
      makeFriendship({ other: 'a', fromMe: true, status: 'accepted', acceptedAt: '2026-10-17T09:00:00.000Z' }),
      makeFriendship({ other: 'b', fromMe: false }),
      makeFriendship({ other: 'c', fromMe: true }),
    ];
    const result = classifyFriendships(docs, ME);
    expect(result.accepted.map((f) => f.friendUid)).toEqual(['a']);
    expect(result.incoming.map((f) => f.friendUid)).toEqual(['b']);
    expect(result.outgoing.map((f) => f.friendUid)).toEqual(['c']);
  });

  it("shows the other learner's saved name and avatar", () => {
    const [sent] = classifyFriendships([makeFriendship({ other: 'c', fromMe: true })], ME).outgoing;
    expect(sent.fallbackName).toBe('Name of c');
    expect(sent.fallbackAvatar).toBe('🐼');
    const [received] = classifyFriendships([makeFriendship({ other: 'b', fromMe: false })], ME).incoming;
    expect(received.fallbackName).toBe('Name of b');
    expect(received.fallbackAvatar).toBe('🐱');
  });

  it('tells my reaction apart from the friend reaction', () => {
    const doc = makeFriendship({
      other: 'a',
      fromMe: false,
      status: 'accepted',
      reactions: { a: { emoji: '🔥', at: 'x' }, [ME]: { emoji: '👏', at: 'y' } },
    });
    const [friend] = classifyFriendships([doc], ME).accepted;
    expect(friend.theirReaction?.emoji).toBe('🔥');
    expect(friend.myReaction?.emoji).toBe('👏');
  });

  it('ignores documents the learner is not part of', () => {
    const stranger = { ...makeFriendship({ other: 'a', fromMe: false }), uids: ['x', 'y'] };
    expect(classifyFriendships([stranger], ME).incoming).toEqual([]);
  });
});

describe('checkFriendRequest', () => {
  const docs = [
    makeFriendship({ other: 'friend', fromMe: true, status: 'accepted' }),
    makeFriendship({ other: 'asked-me', fromMe: false }),
    makeFriendship({ other: 'i-asked', fromMe: true }),
  ];
  const friendships = classifyFriendships(docs, ME);

  it('blocks adding yourself, a friend or a learner already asked', () => {
    expect(checkFriendRequest(friendships, ME, ME).kind).toBe('self');
    expect(checkFriendRequest(friendships, ME, 'friend').kind).toBe('already-friends');
    expect(checkFriendRequest(friendships, ME, 'i-asked').kind).toBe('already-sent');
  });

  it('accepts their request when they already asked', () => {
    expect(checkFriendRequest(friendships, ME, 'asked-me')).toEqual({
      kind: 'accept-incoming',
      friendshipId: getPairId(ME, 'asked-me'),
    });
  });

  it('allows a new request', () => {
    expect(checkFriendRequest(friendships, ME, 'someone-new').kind).toBe('ok');
  });

  it('stops at the friend and pending-request limits', () => {
    const manyFriends = classifyFriendships(
      Array.from({ length: MAX_FRIENDS }, (_, i) => makeFriendship({ other: `f${i}`, fromMe: true, status: 'accepted' })),
      ME
    );
    expect(checkFriendRequest(manyFriends, ME, 'new').kind).toBe('too-many-friends');
    const manyRequests = classifyFriendships(
      Array.from({ length: MAX_OUTGOING_REQUESTS }, (_, i) => makeFriendship({ other: `r${i}`, fromMe: true })),
      ME
    );
    expect(checkFriendRequest(manyRequests, ME, 'new').kind).toBe('too-many-requests');
  });
});

describe('reactions', () => {
  it('allows only the preset reactions', () => {
    expect(FRIEND_REACTIONS.every((r) => isPresetReaction(r.emoji))).toBe(true);
    expect(isPresetReaction('hello')).toBe(false);
  });
});

describe('invite links', () => {
  it('builds and reads an invite link', () => {
    const url = buildInviteUrl('https://example.app/', 'K7MP2Q');
    expect(url).toBe('https://example.app/?invite=K7MP2Q');
    expect(parseInviteParam(new URL(url).search)).toBe('K7MP2Q');
  });

  it('ignores a missing or invalid invite code', () => {
    expect(parseInviteParam('')).toBeNull();
    expect(parseInviteParam('?invite=<script>')).toBeNull();
    expect(parseInviteParam('?invite=k7mp2q')).toBe('K7MP2Q');
  });
});

describe('hub toggle and friend code on the profile', () => {
  const NOW = new Date(2026, 9, 17, 10, 0);

  it('is on by default and remembers when it was turned off', () => {
    expect(isFriendsHubEnabled(baseProfile)).toBe(true);
    const off = setFriendsHubEnabled(baseProfile, false, NOW);
    expect(isFriendsHubEnabled(off)).toBe(false);
    expect(off.friendsHub?.updatedAt).toBe(NOW.toISOString());
  });

  it('stores a claimed code without changing the toggle time', () => {
    const fresh = withFriendCode(baseProfile, 'K7MP2Q', NOW);
    expect(fresh.friendsHub).toEqual({
      isEnabled: true,
      updatedAt: new Date(0).toISOString(),
      friendCode: 'K7MP2Q',
      friendCodeCreatedAt: NOW.toISOString(),
    });
    const off = setFriendsHubEnabled(baseProfile, false, new Date(2026, 9, 16));
    const withCode = withFriendCode(off, 'K7MP2Q', NOW);
    expect(withCode.friendsHub?.isEnabled).toBe(false);
    expect(withCode.friendsHub?.updatedAt).toBe(off.friendsHub?.updatedAt);
  });
});
