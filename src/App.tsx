import React, { useEffect, useState } from 'react';
import { LearnerProfile } from './types/learner';
import { OnboardingView } from './components/OnboardingView';
import { DashboardView } from './components/DashboardView';

const STORAGE_KEY = 'english_tutor_learner_profile_v1';

const DEFAULT_PROFILE: LearnerProfile = {
  isOnboarded: false,
  name: '',
  age: 12,
  gender: 'girl',
  gradeId: 'grade-7',
  preferredTier: 'challenger',
  themeId: 'cozy-studio', // Option B selected by user
  stats: {
    xp: 320,
    level: 3,
    stars: 5,
    maxPossibleStars: 36,
    diamonds: 140,
    streakDays: 5,
    shabbatShieldActive: true,
    wordsMastered: 48,
    missionsCompleted: 2,
  },
  missionProgress: {
    'g7-u1-m1': 3,
    'g7-u1-m2': 2,
  },
  unlockedRewardIds: ['avatar-boba-cat', 'sticker-strawberry-croissant'],
  equippedAvatarEmoji: undefined,
  claimedDailyQuestIds: [],
  dailyCounters: {
    dateStr: new Date().toISOString().slice(0, 10),
    missionsCompletedToday: 0,
    voiceWordsPracticedToday: 1,
    threeStarMissionsToday: 0,
  },
  createdAt: new Date().toISOString(),
};

export function App() {
  const [profile, setProfile] = useState<LearnerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          missionProgress: {
            ...DEFAULT_PROFILE.missionProgress,
            ...(parsed.missionProgress || {}),
          },
          unlockedRewardIds:
            parsed.unlockedRewardIds || DEFAULT_PROFILE.unlockedRewardIds,
          claimedDailyQuestIds:
            parsed.claimedDailyQuestIds || DEFAULT_PROFILE.claimedDailyQuestIds,
          dailyCounters: {
            ...DEFAULT_PROFILE.dailyCounters,
            ...(parsed.dailyCounters || {}),
          },
        };
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_PROFILE;
  });

  const [isEditingOnboarding, setIsEditingOnboarding] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore storage errors
    }
  }, [profile]);

  if (!profile.isOnboarded || isEditingOnboarding) {
    return (
      <OnboardingView
        initialProfile={profile}
        onComplete={(updated) => {
          setProfile(updated);
          setIsEditingOnboarding(false);
        }}
      />
    );
  }

  return (
    <DashboardView
      profile={profile}
      onUpdateProfile={setProfile}
      onEditOnboarding={() => setIsEditingOnboarding(true)}
    />
  );
}

export default App;
