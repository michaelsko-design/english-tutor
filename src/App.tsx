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
import { PlacementTest } from './components/PlacementTest';
import { applyPlacementToProfile } from './data/placementTest';
import { recordActivityLog } from './data/activityLog';
import { getFirstLaunchSteps } from './data/homeBase';
import { FirstLaunchGreeting } from './components/home/FirstLaunchGreeting';
import { THEME_REGISTRY } from './themes/themeRegistry';
import { useFriendPresence } from './hooks/useFriendPresence';
import { usePendingInvite } from './hooks/usePendingInvite';

const STORAGE_KEY = 'english_tutor_learner_profile_v2';
export const WELCOME_GIFT_DIAMONDS = 50;

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
    dateStr: new Date().toISOString().slice(0, 10),
    missionsCompletedToday: 0,
    voiceWordsPracticedToday: 0,
    threeStarMissionsToday: 0,
  },
  isShabbatObserver: true,
  hasSeenWelcomeGiftModal: false,
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
          isShabbatObserver:
            parsed.isShabbatObserver !== undefined
              ? parsed.isShabbatObserver
              : true,
          missionProgress: {
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
  /** True right after first-time onboarding, while the placement test is being offered */
  const [isOfferingPlacement, setIsOfferingPlacement] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<AuthUserSummary | null>(null);
  const [isAuthInitializing, setIsAuthInitializing] = useState<boolean>(isFirebaseConfigured);
  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>('local-only');
  const [pendingInviteCode, clearPendingInvite] = usePendingInvite();

  const profileRef = useRef<LearnerProfile>(profile);
  profileRef.current = profile;

  // Always mirror profile to localStorage when logged in for instant offline access
  useEffect(() => {
    try {
      localStorage.removeItem('english_tutor_learner_profile_v1');
    } catch {
      // ignore storage errors
    }
    if (!authUser) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore storage errors
    }
  }, [profile, authUser]);

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
        setProfile(DEFAULT_PROFILE);
        setIsOfferingPlacement(false);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore storage errors
        }
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
      setIsAuthInitializing(true);
      setSyncStatus('syncing');

      try {
        // 1. Load user's cloud profile or initialize a clean-slate profile for new users
        const freshDefault: LearnerProfile = {
          ...DEFAULT_PROFILE,
          name: firebaseUser.displayName?.split(' ')[0] || '',
          createdAt: new Date(0).toISOString(),
          updatedAt: new Date(0).toISOString(),
        };
        const loadedProfile = await migrateAndSyncProfileOnLogin(
          firebaseUser.uid,
          freshDefault
        );
        setProfile(loadedProfile);
        setSyncStatus('synced');
      } catch {
        setSyncStatus('offline-error');
      } finally {
        setIsAuthInitializing(false);
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
    const now = new Date();
    const stamped: LearnerProfile = {
      // Every local change passes here, so the weekly report's log records it once
      ...recordActivityLog(profileRef.current, updated, now),
      updatedAt: now.toISOString(),
    };
    // A second update before the next render then diffs against this one, not the older profile
    profileRef.current = stamped;
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

  useFriendPresence({
    authUser,
    profile,
    isSynced: !isAuthInitializing && syncStatus === 'synced',
    avatarEmoji: profile.equippedAvatarEmoji || activeTheme.avatarEmoji,
    getLatestProfile: () => profileRef.current,
    onUpdateProfile: handleUpdateProfile,
  });

  if (isAuthInitializing) {
    return (
      <div
        className={`min-h-screen w-full ${activeTheme.pageBgClass} flex items-center justify-center p-6`}
      >
        <div className="text-center space-y-3">
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
          const isFirstOnboarding = !profile.isOnboarded;
          handleUpdateProfile(updated);
          setIsEditingOnboarding(false);
          setIsOfferingPlacement(isFirstOnboarding);
        }}
        onCancel={
          profile.isOnboarded ? () => setIsEditingOnboarding(false) : undefined
        }
      />
    );
  }

  // First launch, one screen after another: the companion's greeting with the welcome chest,
  // then the placement test offer (Feature 27)
  const firstLaunchSteps = getFirstLaunchSteps({
    hasSeenWelcomeGift: Boolean(profile.hasSeenWelcomeGiftModal),
    isOfferingPlacement,
  });

  if (firstLaunchSteps[0] === 'greeting') {
    return (
      <FirstLaunchGreeting
        theme={activeTheme}
        gender={profile.gender}
        name={profile.name}
        welcomeGems={WELCOME_GIFT_DIAMONDS}
        hasPlacementNext={firstLaunchSteps.includes('placement')}
        onDone={() => handleUpdateProfile({ ...profileRef.current, hasSeenWelcomeGiftModal: true })}
      />
    );
  }

  if (firstLaunchSteps[0] === 'placement') {
    return (
      <div className={`min-h-screen w-full ${activeTheme.pageBgClass}`}>
        <PlacementTest
          profile={profile}
          theme={activeTheme}
          mode="onboarding"
          onFinish={(result, applyRecommendation) => {
            handleUpdateProfile(
              applyPlacementToProfile(profile, result, applyRecommendation)
            );
            setIsOfferingPlacement(false);
          }}
          onClose={() => setIsOfferingPlacement(false)}
        />
      </div>
    );
  }

  return (
    <DashboardView
      profile={profile}
      authUser={authUser}
      syncStatus={syncStatus}
      onUpdateProfile={handleUpdateProfile}
      onEditOnboarding={() => setIsEditingOnboarding(true)}
      pendingInviteCode={pendingInviteCode}
      onInviteHandled={clearPendingInvite}
    />
  );
}

export default App;
