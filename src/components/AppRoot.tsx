import React, { useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import App from '../App';
import { isParentRoute, parseParentParam } from '../data/parentLink';
import { auth } from '../services/firebase';
import { getAccountKind } from '../services/accountService';
import { readAccountRole, writeAccountRole } from '../services/accountRole';
import { hasLearnerProfile, isParentAccount } from '../services/parentService';
import { lazyNamed } from '../utils/lazyNamed';
import { ScreenLoading } from './ScreenLoading';

// The parent area is a separate, lazy screen: it never starts the learner app or its cloud sync
const ParentPortal = lazyNamed(() => import('./parent/ParentPortal'), 'ParentPortal');

type Screen = 'checking' | 'app' | 'parent';

/**
 * A Google account that is a parent's (it joined a learner through the parent area and has no
 * learner profile) opens the parent area, not the learner's onboarding. Everyone else, including
 * signed-out visitors, guests and username + PIN learners, goes straight to the app.
 */
async function resolveScreen(user: User | null): Promise<Screen> {
  if (!user || user.isAnonymous || getAccountKind(user) !== 'google') return 'app';
  const cached = readAccountRole(user.uid);
  if (cached) return cached === 'parent' ? 'parent' : 'app';
  try {
    const isLearner = await hasLearnerProfile(user.uid);
    if (isLearner) {
      writeAccountRole(user.uid, 'learner');
      return 'app';
    }
    if (await isParentAccount(user.uid)) {
      writeAccountRole(user.uid, 'parent');
      return 'parent';
    }
  } catch {
    // Offline or no access: open the app, which handles its own sign-in
  }
  return 'app';
}

export const AppRoot: React.FC = () => {
  const isParentView = isParentRoute(window.location.search);
  const [screen, setScreen] = useState<Screen>(isParentView ? 'parent' : 'checking');

  useEffect(() => {
    if (isParentView) return undefined;
    if (!auth) {
      setScreen('app');
      return undefined;
    }
    let isCancelled = false;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      void resolveScreen(user).then((next) => {
        if (!isCancelled) setScreen(next);
      });
    });
    return () => {
      isCancelled = true;
      unsubscribe();
    };
  }, [isParentView]);

  if (screen === 'checking') return <ScreenLoading />;
  if (screen === 'app') return <App />;
  return (
    <React.Suspense fallback={<ScreenLoading />}>
      <ParentPortal initialCode={parseParentParam(window.location.search)} />
    </React.Suspense>
  );
};
