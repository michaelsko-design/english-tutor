import React, { useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  AuthUserSummary,
  CloudSyncStatus,
  LearnerProfile,
} from './types/learner';
import { auth, db, isFirebaseConfigured } from './services/firebase';
import {
  buildLoginProfile,
  mergeLearnerProfiles,
  migrateAndSyncProfileOnLogin,
  saveProfileToFirestore,
} from './services/cloudSync';
import { recordDiamondChange } from './data/diamondLedger';
import { getDeviceId } from './utils/deviceId';
import { toLocalDateStr } from './utils/dates';
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
import { CloudLoadErrorScreen } from './components/CloudLoadErrorScreen';

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
  /** The first cloud read after sign-in failed: nothing is saved until it succeeds */
  const [isCloudLoadFailed, setIsCloudLoadFailed] = useState<boolean>(false);
  const isCloudLoadedRef = useRef<boolean>(false);
  const retryCloudLoadRef = useRef<(() => void) | null>(null);
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
    // Each sign-in change bumps this, so a slow load of an earlier account is ignored
    let authGeneration = 0;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      authGeneration += 1;
      const generation = authGeneration;
      const isCurrent = () => generation === authGeneration;
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }
      isCloudLoadedRef.current = false;
      retryCloudLoadRef.current = null;
      setIsCloudLoadFailed(false);

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

      // A clean-slate profile for new users; for existing ones it only fills gaps
      const freshDefault: LearnerProfile = {
        ...DEFAULT_PROFILE,
        name: firebaseUser.displayName?.split(' ')[0] || '',
        createdAt: new Date(0).toISOString(),
        updatedAt: new Date(0).toISOString(),
      };

      // 1. Load the cloud profile. If that fails, the learner sees a retry screen: a default
      // profile must never reach onboarding, or finishing it would overwrite the cloud progress.
      const loadCloudProfile = async () => {
        setIsAuthInitializing(true);
        setSyncStatus('syncing');
        try {
          const loadedProfile = await migrateAndSyncProfileOnLogin(firebaseUser.uid, freshDefault);
          if (!isCurrent()) return;
          isCloudLoadedRef.current = true;
          setProfile(loadedProfile);
          setIsCloudLoadFailed(false);
          setSyncStatus('synced');
        } catch (error) {
          if (!isCurrent()) return;
          console.warn('Loading the cloud profile failed:', (error as { code?: string })?.code ?? error);
          setIsCloudLoadFailed(true);
          setSyncStatus('offline-error');
        } finally {
          if (isCurrent()) setIsAuthInitializing(false);
        }
      };
      retryCloudLoadRef.current = () => void loadCloudProfile();
      await loadCloudProfile();
      if (!isCurrent()) return;

      // 2. Real-time cross-device sync via Firestore onSnapshot
      if (db) {
        const learnerDocRef = doc(db, 'learners', firebaseUser.uid);
        unsubscribeSnapshot = onSnapshot(
          learnerDocRef,
          (snapshot) => {
            if (!isCurrent() || !snapshot.exists()) return;
            const cloudData = snapshot.data() as Partial<LearnerProfile>;
            if (!isCloudLoadedRef.current) {
              // The first load failed but the document arrived now (back online)
              isCloudLoadedRef.current = true;
              setIsCloudLoadFailed(false);
              setProfile(buildLoginProfile(freshDefault, cloudData));
            } else {
              setProfile((currentLocal) => mergeLearnerProfiles(currentLocal, cloudData));
            }
            // Local writes fire a snapshot at once; the save itself reports "synced" once the
            // server has them
            setSyncStatus(snapshot.metadata.hasPendingWrites ? 'syncing' : 'synced');
          },
          () => {
            if (isCurrent()) setSyncStatus('offline-error');
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
    const previous = profileRef.current;
    // Every local change passes here, so the weekly report's log and this device's diamond
    // ledger record it once (cloud snapshots are merged, never recorded)
    const withLog = recordActivityLog(previous, updated, now);
    const stamped: LearnerProfile = {
      ...recordDiamondChange(previous, withLog, getDeviceId()),
      updatedAt: now.toISOString(),
    };
    // A second update before the next render then diffs against this one, not the older profile
    profileRef.current = stamped;
    setProfile(stamped);

    // Never save before the cloud profile loaded: a default profile would overwrite it
    if (authUser && isFirebaseConfigured && isCloudLoadedRef.current) {
      setSyncStatus('syncing');
      saveProfileToFirestore(authUser.uid, stamped)
        .then(() => setSyncStatus('synced'))
        .catch((error) => {
          console.warn('Saving the profile failed:', (error as { code?: string })?.code ?? error);
          setSyncStatus('offline-error');
        });
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

  if (isCloudLoadFailed) {
    return (
      <CloudLoadErrorScreen
        theme={activeTheme}
        onRetry={() => retryCloudLoadRef.current?.()}
        onSignOut={() => {
          if (auth) void signOut(auth);
        }}
      />
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
