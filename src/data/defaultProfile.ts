import { LearnerProfile } from '../types/learner';
import { toLocalDateStr } from '../utils/dates';

export const WELCOME_GIFT_DIAMONDS = 50;

/** A new learner before onboarding (App's starting state, and the base for test profiles) */
export const DEFAULT_PROFILE: LearnerProfile = {
  isOnboarded: false,
  name: '',
  age: 12,
  gender: 'girl',
  gradeId: 'grade-7',
  preferredTier: 'challenger',
  themeId: 'cozy-studio', // Option B selected by user
  stats: {
    xp: 0,
    level: 1,
    stars: 0,
    maxPossibleStars: 36,
    diamonds: WELCOME_GIFT_DIAMONDS,
    streakDays: 0,
    shabbatShieldActive: true,
    wordsMastered: 0,
    missionsCompleted: 0,
  },
  missionProgress: {},
  unlockedRewardIds: ['avatar-boba-cat'],
  equippedAvatarEmoji: undefined,
  claimedDailyQuestIds: [],
  dailyCounters: {
    dateStr: toLocalDateStr(new Date()),
    missionsCompletedToday: 0,
    voiceWordsPracticedToday: 0,
    threeStarMissionsToday: 0,
  },
  isShabbatObserver: true,
  hasSeenWelcomeGiftModal: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
