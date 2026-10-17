import { describe, expect, it } from 'vitest';
import {
  ROOM_ACTIVITY_DIAMONDS,
  ROOM_ACTIVITY_REPEAT_XP,
  ROOM_ACTIVITY_XP,
  applyRoomActivityReward,
  isActivityRewardedToday,
} from './roomActivities';
import { PHONE_SESSION_SIZE, VOICE_MESSAGES, applyPhoneSessionResult, buildPhoneSession, getGradeBand } from './voiceMessages';
import { LearnerProfile } from '../types/learner';

const NOW = new Date(2026, 9, 17, 10, 0);
const LATER = new Date(2026, 9, 17, 18, 0);
const TOMORROW = new Date(2026, 9, 18, 10, 0);

const baseProfile: LearnerProfile = {
  isOnboarded: true,
  name: 'Ido',
  age: 10,
  gender: 'boy',
  gradeId: 'grade-5',
  preferredTier: 'challenger',
  themeId: 'cozy-studio',
  stats: {
    xp: 0,
    level: 1,
    stars: 0,
    maxPossibleStars: 36,
    diamonds: 10,
    streakDays: 2,
    shabbatShieldActive: true,
    wordsMastered: 0,
    missionsCompleted: 0,
  },
  missionProgress: {},
  unlockedRewardIds: [],
  claimedDailyQuestIds: [],
  dailyCounters: {
    dateStr: '2026-10-16',
    missionsCompletedToday: 0,
    voiceWordsPracticedToday: 0,
    threeStarMissionsToday: 0,
  },
  createdAt: '2026-01-01T00:00:00.000Z',
};

describe('applyRoomActivityReward', () => {
  it('gives the full reward once a day and counts a mission and voice words', () => {
    const result = applyRoomActivityReward(baseProfile, 'phone', 2, NOW);
    expect(result.isFullReward).toBe(true);
    expect(result.profile.stats.xp).toBe(ROOM_ACTIVITY_XP);
    expect(result.profile.stats.diamonds).toBe(baseProfile.stats.diamonds + ROOM_ACTIVITY_DIAMONDS);
    expect(result.profile.dailyCounters.missionsCompletedToday).toBe(1);
    expect(result.profile.dailyCounters.voiceWordsPracticedToday).toBe(2);
    expect(isActivityRewardedToday(result.profile, 'phone', LATER)).toBe(true);
  });

  it('gives only a little XP for a repeat on the same day', () => {
    const first = applyRoomActivityReward(baseProfile, 'phone', 1, NOW).profile;
    const repeat = applyRoomActivityReward(first, 'phone', 1, LATER);
    expect(repeat.isFullReward).toBe(false);
    expect(repeat.xpEarned).toBe(ROOM_ACTIVITY_REPEAT_XP);
    expect(repeat.profile.stats.diamonds).toBe(first.stats.diamonds);
    expect(repeat.profile.dailyCounters).toEqual(first.dailyCounters);
  });

  it('keeps each activity and each day separate', () => {
    const phone = applyRoomActivityReward(baseProfile, 'phone', 1, NOW).profile;
    expect(applyRoomActivityReward(phone, 'journal', 0, NOW).isFullReward).toBe(true);
    expect(applyRoomActivityReward(phone, 'phone', 1, TOMORROW).isFullReward).toBe(true);
  });
});

describe('voice messages', () => {
  it('maps grades to bands', () => {
    expect(getGradeBand('grade-2')).toBe('early');
    expect(getGradeBand('grade-6')).toBe('band1');
    expect(getGradeBand('grade-7')).toBe('band2');
    expect(getGradeBand('grade-12')).toBe('band3');
  });

  it('builds a session of unique messages from the grade band, stable per salt', () => {
    const session = buildPhoneSession('grade-8', 42);
    expect(session).toHaveLength(PHONE_SESSION_SIZE);
    expect(new Set(session.map((m) => m.id)).size).toBe(PHONE_SESSION_SIZE);
    session.forEach((m) => expect(m.id.startsWith('vm-band2-')).toBe(true));
    expect(buildPhoneSession('grade-8', 42)).toEqual(session);
  });

  it('keeps early replies short', () => {
    VOICE_MESSAGES.early.forEach((m) => expect(m.replyEn.split(/\s+/).length).toBeLessThanOrEqual(4));
  });

  it('rewards a session only when a message was sent', () => {
    expect(applyPhoneSessionResult(baseProfile, 0, NOW)).toBeNull();
    expect(applyPhoneSessionResult(baseProfile, 3, NOW)?.profile.dailyCounters.voiceWordsPracticedToday).toBe(3);
  });
});
