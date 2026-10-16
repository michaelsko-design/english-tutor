import React, { useEffect, useRef, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  AuthUserSummary,
  CloudSyncStatus,
  LearnerProfile,
} from './types/learner';
import { auth, db, isFirebaseConfigured } from './services/firebase';
import {
  mergeLearnerProfiles,
  migrateAndSyncProfileOnLogin,
  saveProfileToFirestore,
} from './services/cloudSync';
import { OnboardingView } from './components/OnboardingView';
import { DashboardView } from './components/DashboardView';
import { AuthModal } from './components/AuthModal';
import { THEME_REGISTRY } from './themes/themeRegistry';

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
  updatedAt: new Date().toISOString(),
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
  const [authUser, setAuthUser] = useState<AuthUserSummary | null>(null);
  const [isAuthInitializing, setIsAuthInitializing] = useState<boolean>(isFirebaseConfigured);
  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>('local-only');

  const profileRef = useRef<LearnerProfile>(profile);
  profileRef.current = profile;

  // Always mirror profile to localStorage for instant offline access
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore storage errors
    }
  }, [profile]);

  // Listen to Firebase Auth state & attach real-time Firestore onSnapshot listener
  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) {
      setSyncStatus('local-only');
      setIsAuthInitializing(false);
      return;
    }

    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (!firebaseUser) {
        setAuthUser(null);
        setSyncStatus('local-only');
        setIsAuthInitializing(false);
        return;
      }

      const summary: AuthUserSummary = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        isAnonymous: firebaseUser.isAnonymous,
      };
      setAuthUser(summary);
      setIsAuthInitializing(false);
      setSyncStatus('syncing');

      try {
        // 1. First-time login migration: merge local progress into Firestore document
        const migrated = await migrateAndSyncProfileOnLogin(
          firebaseUser.uid,
          profileRef.current
        );
        setProfile(migrated);
        setSyncStatus('synced');
      } catch {
        setSyncStatus('offline-error');
      }

      // 2. Real-time cross-device sync via Firestore onSnapshot
      if (db) {
        const learnerDocRef = doc(db, 'learners', firebaseUser.uid);
        unsubscribeSnapshot = onSnapshot(
          learnerDocRef,
          (snapshot) => {
            if (!snapshot.exists()) return;
            const cloudData = snapshot.data() as Partial<LearnerProfile>;
            setProfile((currentLocal) =>
              mergeLearnerProfiles(currentLocal, cloudData)
            );
            setSyncStatus('synced');
          },
          () => {
            setSyncStatus('offline-error');
          }
        );
      }
    });

    return () => {
      if (unsubscribeSnapshot) unsubscribeSnapshot();
      unsubscribeAuth();
    };
  }, []);

  // Unified handler that updates local state and pushes to Firestore when logged in
  const handleUpdateProfile = (updated: LearnerProfile) => {
    const stamped: LearnerProfile = {
      ...updated,
      updatedAt: new Date().toISOString(),
    };
    setProfile(stamped);

    if (authUser && isFirebaseConfigured) {
      setSyncStatus('syncing');
      saveProfileToFirestore(authUser.uid, stamped)
        .then(() => setSyncStatus('synced'))
        .catch(() => setSyncStatus('offline-error'));
    }
  };

  const activeTheme =
    THEME_REGISTRY[profile.themeId] || THEME_REGISTRY['cozy-studio'];

  if (isAuthInitializing) {
    return (
      <div
        className={`min-h-screen w-full ${activeTheme.pageBgClass} flex items-center justify-center p-6`}
      >
        <div className="text-center space-y-3" dir="rtl">
          <div
            className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl ${activeTheme.primaryBtnClass} animate-bounce`}
          >
            {activeTheme.avatarEmoji}
          </div>
          <p className="font-extrabold text-sm md:text-base">
            בודק חיבור לחשבון...
          </p>
        </div>
      </div>
    );
  }

  // Mandatory Login Gate: require authenticated user before accessing the app
  if (!authUser) {
    return (
      <div className={`min-h-screen w-full ${activeTheme.pageBgClass}`}>
        <AuthModal
          authUser={authUser}
          syncStatus={syncStatus}
          gender={profile.gender}
          learnerName={profile.name}
          theme={activeTheme}
          isMandatory={true}
        />
      </div>
    );
  }

  if (!profile.isOnboarded || isEditingOnboarding) {
    return (
      <OnboardingView
        initialProfile={profile}
        onComplete={(updated) => {
          handleUpdateProfile(updated);
          setIsEditingOnboarding(false);
        }}
      />
    );
  }

  return (
    <DashboardView
      profile={profile}
      authUser={authUser}
      syncStatus={syncStatus}
      onUpdateProfile={handleUpdateProfile}
      onEditOnboarding={() => setIsEditingOnboarding(true)}
    />
  );
}

export default App;
