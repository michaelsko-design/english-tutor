import React, { Suspense, useEffect, useRef, useState } from 'react';
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
import { createProfileSaveQueue } from './services/profileSaveQueue';
import { getDeviceId } from './utils/deviceId';
import { DashboardView } from './components/DashboardView';
import { AuthModal } from './components/AuthModal';
import { AppLogo } from './components/AppLogo';
import { applyPlacementToProfile } from './data/placementTest';
import { recordActivityLog } from './data/activityLog';
import { getFirstLaunchSteps } from './data/homeBase';
import { THEME_REGISTRY } from './themes/themeRegistry';
import { useFriendPresence } from './hooks/useFriendPresence';
import { useReportSnapshotPublisher } from './hooks/useReportSnapshotPublisher';
import { useReminderSync } from './hooks/useReminderSync';
import { useStickerImageSync } from './hooks/useStickerImageSync';
import { usePendingInvite } from './hooks/usePendingInvite';
import { CloudLoadErrorScreen } from './components/CloudLoadErrorScreen';
import { ScreenLoading } from './components/ScreenLoading';
import { lazyNamed } from './utils/lazyNamed';
import { setListenerGender } from './services/tts';
import { HebrewAudioContext, playsHebrewAloud } from './data/hebrewAudio';
import { AccountResult, deleteAccount } from './services/accountService';
import { DEFAULT_PROFILE, WELCOME_GIFT_DIAMONDS } from './data/defaultProfile';

// Screens most visits never open load in their own chunks
const OnboardingView = lazyNamed(() => import('./components/OnboardingView'), 'OnboardingView');
const PlacementTest = lazyNamed(() => import('./components/PlacementTest'), 'PlacementTest');
const FirstLaunchGreeting = lazyNamed(() => import('./components/home/FirstLaunchGreeting'), 'FirstLaunchGreeting');
const ProfileTour = lazyNamed(() => import('./components/tutorial/ProfileTour'), 'ProfileTour');

const STORAGE_KEY = 'english_tutor_learner_profile_v2';
/** A burst of changes is saved to the cloud this long after the last one */
const SAVE_DELAY_MS = 1000;

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
  // The app tour right after the welcome chest (Feature 45)
  const [isOfferingTour, setIsOfferingTour] = useState<boolean>(false);
  const [authUser, setAuthUser] = useState<AuthUserSummary | null>(null);
  const [isAuthInitializing, setIsAuthInitializing] = useState<boolean>(isFirebaseConfigured);
  const [syncStatus, setSyncStatus] = useState<CloudSyncStatus>('local-only');
  /** The first cloud read after sign-in failed: nothing is saved until it succeeds */
  const [isCloudLoadFailed, setIsCloudLoadFailed] = useState<boolean>(false);
  const isCloudLoadedRef = useRef<boolean>(false);
  const retryCloudLoadRef = useRef<(() => void) | null>(null);
  const [pendingInviteCode, clearPendingInvite] = usePendingInvite();

  const profileRef = useRef<LearnerProfile>(profile);
  // One cloud write per burst of changes; flushed when the app is hidden or closed
  const saveQueueRef = useRef(createProfileSaveQueue(saveProfileToFirestore, SAVE_DELAY_MS, setSyncStatus));

  useEffect(() => {
    const flush = () => saveQueueRef.current.flush();
    const flushWhenHidden = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', flushWhenHidden);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', flushWhenHidden);
    };
  }, []);
  profileRef.current = profile;

  // The Hebrew voice says words like "בנית" in the learner's form (banit / banita)
  useEffect(() => setListenerGender(profile.gender), [profile.gender]);

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
      // The previous account's waiting changes go out before anything switches
      saveQueueRef.current.flush();
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
      // Sign-out lives on the profile screen: whoever signs in next starts on the dashboard
      setIsEditingOnboarding(false);

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

  /** Signs out once the waiting cloud save went out: after the sign-out, Firestore refuses it */
  const signOutAfterSaving = async (): Promise<void> => {
    await saveQueueRef.current.flush();
    if (auth) await signOut(auth);
  };

  /**
   * Deletes the account once the saves on their way are done, and holds new ones meanwhile: a
   * save landing after the deletion would re-create the profile. A failed deletion lets them go.
   */
  const deleteAccountAfterSaving = async (friendCode: string | undefined, pin: string): Promise<AccountResult> => {
    const queue = saveQueueRef.current;
    await queue.flush();
    queue.hold();
    const result = await deleteAccount(friendCode, pin);
    if (result.ok) queue.discard();
    else queue.release();
    return result;
  };

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
      saveQueueRef.current.schedule(authUser.uid, stamped);
    }
  };

  const activeTheme =
    THEME_REGISTRY[profile.themeId] || THEME_REGISTRY['cozy-studio'];

  // Dark themes switch on the dark: colours, and the browser bar follows the theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', activeTheme.isDark);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', activeTheme.themeColor);
  }, [activeTheme]);

  useStickerImageSync({
    uid: authUser?.uid,
    isReady: !isAuthInitializing && !isCloudLoadFailed,
    profile,
    getLatestProfile: () => profileRef.current,
    onUpdateProfile: handleUpdateProfile,
  });

  useFriendPresence({
    authUser,
    profile,
    isSynced: !isAuthInitializing && syncStatus === 'synced',
    avatarEmoji: profile.equippedAvatarEmoji || activeTheme.avatarEmoji,
    getLatestProfile: () => profileRef.current,
    onUpdateProfile: handleUpdateProfile,
  });

  useReportSnapshotPublisher({ authUser, profile, isSynced: !isAuthInitializing && syncStatus === 'synced' });
  useReminderSync({ authUser, profile, isSynced: !isAuthInitializing && syncStatus === 'synced' });

  if (isAuthInitializing) {
    return (
      <div
        className={`min-h-screen w-full ${activeTheme.pageBgClass} flex items-center justify-center p-6`}
      >
        <div className="text-center space-y-3">
          <AppLogo size={80} className="mx-auto shadow-xl animate-bounce" />
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
          onSignOut={signOutAfterSaving}
        />
      </div>
    );
  }

  if (isCloudLoadFailed) {
    return (
      <CloudLoadErrorScreen
        theme={activeTheme}
        onRetry={() => retryCloudLoadRef.current?.()}
        onSignOut={() =>
          signOutAfterSaving().catch((error: unknown) => console.warn('Signing out failed:', error))
        }
      />
    );
  }

  if (!profile.isOnboarded || isEditingOnboarding) {
    return (
      <Suspense fallback={<ScreenLoading />}>
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
        onSignOut={signOutAfterSaving}
        onDeleteAccount={deleteAccountAfterSaving}
      />
      </Suspense>
    );
  }

  // First launch, one screen after another: the companion's greeting with the welcome chest,
  // the app tour (Feature 45), then the placement test offer (Feature 27)
  const firstLaunchSteps = getFirstLaunchSteps({
    hasSeenWelcomeGift: Boolean(profile.hasSeenWelcomeGiftModal),
    isOfferingTour,
    isOfferingPlacement,
  });

  if (firstLaunchSteps[0] === 'greeting') {
    return (
      <Suspense fallback={<ScreenLoading />}>
      <FirstLaunchGreeting
        theme={activeTheme}
        gender={profile.gender}
        name={profile.name}
        welcomeGems={WELCOME_GIFT_DIAMONDS}
        onDone={() => {
          handleUpdateProfile({ ...profileRef.current, hasSeenWelcomeGiftModal: true });
          setIsOfferingTour(true);
        }}
      />
      </Suspense>
    );
  }

  if (firstLaunchSteps[0] === 'tour') {
    const isGirl = profile.gender === 'girl';
    return (
      <div className={`min-h-screen w-full ${activeTheme.pageBgClass}`}>
        <Suspense fallback={<ScreenLoading />}>
        <ProfileTour
          profile={profile}
          theme={activeTheme}
          authUser={authUser}
          finishLabelHe={
            firstLaunchSteps.includes('placement')
              ? `${isGirl ? 'המשיכי' : 'המשך'} למבחן רמה קצר 🎯`
              : isGirl
              ? 'בואי נשחק! 🚀'
              : 'בוא נשחק! 🚀'
          }
          onDone={() => setIsOfferingTour(false)}
        />
        </Suspense>
      </div>
    );
  }

  if (firstLaunchSteps[0] === 'placement') {
    return (
      <HebrewAudioContext.Provider value={playsHebrewAloud(profile.gradeId)}>
      <div className={`min-h-screen w-full ${activeTheme.pageBgClass}`}>
        <Suspense fallback={<ScreenLoading />}>
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
        </Suspense>
      </div>
      </HebrewAudioContext.Provider>
    );
  }

  return (
    <HebrewAudioContext.Provider value={playsHebrewAloud(profile.gradeId)}>
    <DashboardView
      profile={profile}
      authUser={authUser}
      syncStatus={syncStatus}
      onUpdateProfile={handleUpdateProfile}
      onEditOnboarding={() => setIsEditingOnboarding(true)}
      onSignOut={signOutAfterSaving}
      pendingInviteCode={pendingInviteCode}
      onInviteHandled={clearPendingInvite}
    />
    </HebrewAudioContext.Provider>
  );
}

export default App;
